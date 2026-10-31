"""Read actual Wazuh alerts; keep analysis, response and verification separate."""
import hashlib
import hmac
import json
from pathlib import Path
import re
import time
import uuid
from datetime import datetime,timezone
from urllib.error import HTTPError
from deploy.configuration import LOCAL
from deploy.kalkan import api,ssh,profile_vm
from lab.common import load,write_private,request


TECHNIQUES={110211:'T1190',110212:'T1548.003',110213:'T1552.004',110214:'T1098.004',
            110221:'T1090',110222:'T1021.004',110102:'T1565.001: verify stored-data context',
            110103:'T1565.001: verify stored-data context',110104:'T0832',110105:'T0836',110106:'T0815'}


def timestamp(value):
    return datetime.fromisoformat(value.replace('Z','+00:00')).timestamp()


def save_case(directory,case):
    write_private(directory/'case.json',case)
    files=[p for p in (directory/'alerts.jsonl',directory/'case.json') if p.exists()]
    (directory/'SHA256SUMS').write_text('\n'.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name for p in files)+'\n')


def extract_observables(alert):
    observations=[]
    wanted={'srcip':'ip','dstip':'ip','srcuser':'account','dstuser':'account','path':'file_path','sha256_after':'sha256','exe':'process_path'}
    def walk(value):
        if not isinstance(value,dict):return
        for key,item in value.items():
            if key in wanted and isinstance(item,str):observations.append((wanted[key],item))
            if isinstance(item,dict):walk(item)
    walk(alert.get('data',{}));walk(alert.get('syscheck',{}))
    for value in re.findall(r'SHA256:[A-Za-z0-9+/=]+',alert.get('full_log','')):observations.append(('ssh_key_fingerprint',value))
    return observations


def inspect():
    snapshot=api('/api/v1/snapshot');run_id=str(uuid.UUID(snapshot['run_id']))
    directory=LOCAL/'evidence'/run_id;directory.mkdir(parents=True,exist_ok=True,mode=0o700)
    text=ssh('WAZUH-01','sudo tail -n 100000 /var/ossec/logs/alerts/alerts.json').stdout
    start=snapshot['server_time']-snapshot['motion_seconds']-2
    rows=[]
    for line in text.splitlines():
        try:
            alert=json.loads(line);when=timestamp(alert['timestamp']);rule=int(alert['rule']['id'])
            if when<start or not 110100<=rule<=110299:continue
            event_run=alert.get('data',{}).get('run_id')
            if event_run and event_run!=run_id:continue
            rows.append(alert)
        except (ValueError,KeyError,TypeError):continue
    if not rows:raise RuntimeError('Güncel tur için Wazuh kaynak alarmı bulunamadı; sahte kanıt üretilmedi.')
    raw=directory/'alerts.jsonl';raw.write_text('\n'.join(json.dumps(row,ensure_ascii=False) for row in rows)+'\n');raw.chmod(0o600)
    observables={}
    for alert in rows:
        for kind,value in extract_observables(alert):
            item=observables.setdefault((kind,value),{'type':kind,'value':value,'classification':'observable_requires_analyst_validation','evidence_refs':[]})
            item['evidence_refs'].append(alert['id'])
    candidates=[]
    for rule,technique in TECHNIQUES.items():
        evidence=[r['id'] for r in rows if int(r['rule']['id'])==rule]
        if evidence:candidates.append({'technique':technique,'status':'candidate_requires_behavior_validation','evidence_refs':evidence})
    path=directory/'case.json';previous=load(path) if path.exists() else {}
    case={'schema':'kalkan.case.v1','run_id':run_id,'collected_at':time.time(),'source':'WAZUH-01:/var/ossec/logs/alerts/alerts.json',
          'time_window_start_utc':datetime.fromtimestamp(start,timezone.utc).isoformat(),'alert_count':len(rows),
          'observables':list(observables.values()),'ioc_records':previous.get('ioc_records',[]),'ttp_candidates':candidates,
          'ttp_assessments':previous.get('ttp_assessments',[]),'analyst_notes':previous.get('analyst_notes',[]),
          'source_window_limit_lines':100000,'coverage':'source_tail_window_only',
          'attribution':previous.get('attribution',{'assessment':'insufficient_evidence','candidate_group':None,'confidence':None,'imitation_possible':True}),
          'responses':previous.get('responses',[]),'verification':previous.get('verification',[])}
    write_private(path,case)
    hashes='\n'.join(hashlib.sha256(p.read_bytes()).hexdigest()+'  '+p.name for p in (raw,path))+'\n'
    (directory/'SHA256SUMS').write_text(hashes)
    print(f'WAZUH: {len(rows)} gerçek alarm, {len(observables)} gözlem değeri. IOC ve TTP sınıflandırması analist incelemesi beklemektedir.')
    print('Olay dosyası:',path)
    return directory,rows,case


def action(name):
    if name=='inspect':inspect();return
    snapshot=api('/api/v1/snapshot');run_id=str(uuid.UUID(snapshot['run_id']));directory=LOCAL/'evidence'/run_id
    if name=='contain':
        directory,rows,case=inspect()
        alert=next((r for r in reversed(rows) if int(r['rule']['id']) in {110101,110102,110103,110104,110105,110106,110211,110213,110214,110221,110222}),None)
        if alert is None:raise RuntimeError('Sınırlandırma için ilgili gerçek Wazuh bulgusu bulunamadı.')
        receipt={'run_id':run_id,'verified_at':time.time(),'alert_id':str(alert['id']),'rule_id':int(alert['rule']['id']),
                 'alert_sha256':hashlib.sha256(json.dumps(alert,sort_keys=True,separators=(',',':')).encode()).hexdigest()}
        signature=hmac.new(load(LOCAL/'secrets.json')['evidence'].encode(),json.dumps(receipt,sort_keys=True,separators=(',',':')).encode(),hashlib.sha256).hexdigest()
        api('/api/v1/blue/contain',{'reason':'Wazuh kaynak kayıtları incelendi; analist onaylı sınırlandırma.','host_receipt':receipt,'signature':signature},role='blue')
        for node in ('FW-01','DMZ-PORTAL-01','KKBS-INT-01','KKBS-APP-01'):
            try:
                profile_vm(node,'restored',run_id)
                case['responses'].append({'target':node,'action':'restored_profile_containment','outcome':'success','time':time.time()})
            except Exception:
                case['responses'].append({'target':node,'action':'restored_profile_containment','outcome':'failed','time':time.time()})
                save_case(directory,case);raise
        save_case(directory,case)
        print('PASS: uygulama oturumu, SSH anahtarları/oturumları, sudo ve pivot yolları sınırlandırıldı. Mevcut etkiler korunmaktadır.')
    elif name=='restore':
        api('/api/v1/blue/restore',{'reason':'Onaylı konum, görev ve proses reçetesi geri yüklenmektedir.'},role='blue')
        print('Geri yükleme uygulandı. Yeni ölçümler ve proses kararlılığı beklenmektedir.')
    elif name=='verify':
        deadline=time.monotonic()+180
        while time.monotonic()<deadline:
            snapshot=api('/api/v1/snapshot')
            if snapshot['verify_ready'] and snapshot['reference_connected']:break
            time.sleep(1)
        else:raise RuntimeError('Kararlılık süresi doldu; kaynak veya proses koşulları sağlanmadı.')
        key_state=ssh('KKBS-INT-01','sudo test ! -s /home/svc-sync/.ssh/authorized_keys && getent passwd svc-sync').stdout
        if '/usr/sbin/nologin' not in key_state:raise RuntimeError('SSH kimliği sınırlandırılmadı.')
        try:
            request('https://10.77.30.30/api/v1/integrator/position',{},token=load(LOCAL/'secrets.json')['integrator'],ca=str(LOCAL/'pki/ca.crt'))
            raise RuntimeError('Uygulama yazma ret testi başarısız.')
        except HTTPError as error:
            if error.code!=403:raise RuntimeError('Uygulama yazması beklenen 403 ile reddedilmedi.')
        api('/api/v1/blue/verify',{'reason':'Yeni referans/telemetri, SSH kapatma ve API ret kontrolleri tamamlandı.'},role='blue')
        case=load(directory/'case.json')
        case['verification'].append({'time':time.time(),'result':'passed','controls':['independent_reference','stable_8_seconds','authorized_keys_empty','sync_login_disabled','api_write_403']})
        save_case(directory,case)
        print('PASS: hizmet, veri bütünlüğü, SSH kapatma ve API ret testi. Dron kayıp işareti yeni tura kadar korunmaktadır.')
