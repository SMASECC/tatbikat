#!/usr/bin/env python3
"""One controller for the complete isolated KALKAN lab. Run on the Proxmox host."""
import argparse
import base64
import hashlib
import hmac
import json
import os
from pathlib import Path
import shlex
import shutil
import subprocess
import sys
import tarfile
import time
import uuid

ROOT=Path(__file__).resolve().parents[1]
sys.path.insert(0,str(ROOT))
from deploy import host
from deploy.artifacts import prepare as prepare_artifacts
from deploy.configuration import LOCAL,initialize_secrets,bundles
from lab.common import load,request,write_private

TOPOLOGY=load(ROOT/'infra/topology.json')
VM={v['name']:v for v in TOPOLOGY['vms']}


def run(*args,input=None,capture=True,check=True):
    return subprocess.run(args,input=input,text=True,capture_output=capture,check=check)


def settings():return load(LOCAL/'deployment.json')


def ssh(name,command,input=None,check=True,capture=True):
    args=['ssh','-o','BatchMode=yes','-o','IdentityAgent=none','-o','ConnectTimeout=8','-o','StrictHostKeyChecking=yes',
          '-o','UserKnownHostsFile='+str(LOCAL/'known_hosts'),'-i',str(LOCAL/'keys/management'),
          'labadmin@'+VM[name]['ansible_host'],command]
    return run(*args,input=input,check=check,capture=capture)


def api(path,body=None,role='white'):
    return request('https://10.77.30.30'+path,body,token=load(LOCAL/'secrets.json')[role],ca=str(LOCAL/'pki/ca.crt'),timeout=8)


def plan():
    initialize_secrets();cfg=host.facts();host.preflight(TOPOLOGY,cfg)
    cfg.update(lab_id='KALKAN-1',topology=TOPOLOGY,maintenance=True,
               previous_ip_forward=int(Path('/proc/sys/net/ipv4/ip_forward').read_text()))
    previous=LOCAL/'deployment.json'
    if previous.exists():cfg['previous_ip_forward']=load(previous)['previous_ip_forward']
    write_private(previous,cfg)
    print(json.dumps({k:v for k,v in cfg.items() if k!='topology'},ensure_ascii=False,indent=2))
    print('Plan: 8 VM, 7 özel bridge, fiziksel NIC bağlantısı olmayan lab; mevcut fiziksel yönetim adresi korunacaktır.')
    return cfg


def snippets():
    stores=json.loads(run('pvesh','get','/storage','--output-format','json').stdout)
    selected=next((s for s in stores if s.get('type')=='dir' and s.get('storage')=='local'),None)
    if selected is None:raise RuntimeError('Cloud-init için local adlı directory deposu gerekmektedir.')
    content=set(selected.get('content','').split(','));content.add('snippets')
    run('pvesm','set',selected['storage'],'--content',','.join(sorted(content)))
    directory=Path(selected.get('path','/var/lib/vz'))/'snippets';directory.mkdir(exist_ok=True)
    return selected['storage'],directory


def cloud_init(vm,pubkey):
    data={'hostname':vm['name'].lower(),'manage_etc_hosts':True,'ssh_pwauth':False,'disable_root':True,
          'users':[{'name':'labadmin','groups':['sudo'],'shell':'/bin/bash','sudo':'ALL=(ALL) NOPASSWD:ALL','lock_passwd':True,'ssh_authorized_keys':[pubkey]}],
          'package_update':True,'package_upgrade':False,
          'packages':['python3','openssh-server','sudo','rsync','qemu-guest-agent','ca-certificates'],
          'write_files':[{'path':'/etc/kalkan/lab-marker.json','permissions':'0644','content':json.dumps({'lab_id':'KALKAN-1','name':vm['name'],'gateway':next(n['gateway'] for n in TOPOLOGY['networks'] if n['id']==vm['zone'])})}],
          'runcmd':[['systemctl','enable','--now','qemu-guest-agent'],['systemctl','enable','--now','ssh']]}
    if vm['name']=='FW-01':data['bootcmd']=[['sysctl','-w','net.ipv4.ip_forward=1']]
    return '#cloud-config\n'+json.dumps(data,indent=2)+'\n'


def provision_vm(vm,cfg,store,directory):
    vmid=str(vm['vmid']);description='KALKAN-1-MANAGED / '+vm['name']
    status=run('qm','status',vmid,check=False)
    if status.returncode:
        run('qm','create',vmid,'--name',vm['name'],'--cores',str(vm['vcpu']),'--memory',str(vm['ram_gib']*1024),
            '--ostype','l26','--scsihw','virtio-scsi-pci','--serial0','socket','--vga','serial0',
            '--agent','enabled=1','--description',description,'--onboot','1')
    elif description.split(' / ')[0] not in run('qm','config',vmid).stdout:raise RuntimeError('VM sahipliği eşleşmiyor: '+vmid)
    for index,interface in enumerate(vm['interfaces']):
        zone=next(n for n in TOPOLOGY['networks'] if n['id']==interface['zone'])
        run('qm','set',vmid,'--net'+str(index),f"virtio={host.mac(vm['vmid'],index)},bridge={zone['bridge']}")
        ipcfg=f"ip={interface['ip']}/24"
        if index==0:ipcfg+=',gw='+('10.77.10.10' if vm['name']=='FW-01' else zone['gateway'])
        run('qm','set',vmid,'--ipconfig'+str(index),ipcfg)
    current=run('qm','config',vmid).stdout
    if 'scsi0:' not in current:
        image=LOCAL/'cache'/('kali.img' if vm['template']=='kali' else 'ubuntu.img')
        run('qm','importdisk',vmid,str(image),cfg['storage'],'--format','raw')
        current=run('qm','config',vmid).stdout
        volume=next(line.split(': ',1)[1].split(',')[0] for line in current.splitlines() if line.startswith('unused'))
        run('qm','set',vmid,'--scsi0',volume)
        run('qm','resize',vmid,'scsi0',str(vm['disk_gib'])+'G')
    if 'ide2:' not in current:run('qm','set',vmid,'--ide2',cfg['storage']+':cloudinit')
    name='kalkan-'+vmid+'.yaml';(directory/name).write_text(cloud_init(vm,(LOCAL/'keys/management.pub').read_text().strip()))
    run('qm','set',vmid,'--cicustom','user='+store+':snippets/'+name,'--nameserver',cfg['bootstrap_dns'],'--boot','order=scsi0')
    if 'running' not in run('qm','status',vmid).stdout:run('qm','start',vmid)


def wait_for_vm(name):
    ip=VM[name]['ansible_host'];deadline=time.monotonic()+900
    known=LOCAL/'known_hosts';known.touch(mode=0o600,exist_ok=True)
    while time.monotonic()<deadline:
        scan=run('ssh-keyscan','-T','3','-t','ed25519',ip,check=False)
        if scan.returncode==0 and scan.stdout.strip():
            existing=known.read_text()
            if not any(line.startswith(ip+' ') for line in existing.splitlines()):
                with known.open('a') as output:output.write(scan.stdout)
            result=ssh(name,'cloud-init status --wait',check=False)
            if result.returncode in (0,2):
                if ssh(name,'command -v python3 && command -v rsync',check=False).returncode==0:
                    print('BOOT PASS:',name,flush=True);return
        time.sleep(5)
    raise RuntimeError(name+' ilk açılışını tamamlamadı; qm terminal veya cloud-init günlüğünü inceleyin.')


def archive_sources():
    path=LOCAL/'source.tar.gz';ignored={'.git','.local','.venv','__pycache__','runtime','build'}
    with tarfile.open(path,'w:gz') as package:
        for item in sorted(ROOT.rglob('*')):
            relative=item.relative_to(ROOT)
            if any(p in ignored or p.startswith('.venv-') for p in relative.parts):continue
            if item.is_file():package.add(item,arcname=str(relative),recursive=False)
    return path


def install():
    cfg=plan();prepare_artifacts()
    host.network(cfg)
    Path('/opt/kalkan-host').mkdir(exist_ok=True)
    shutil.copyfile(ROOT/'deploy/host.py','/opt/kalkan-host/host.py')
    service=Path('/etc/systemd/system/kalkan-host-network.service')
    service.write_text('[Unit]\nDescription=KALKAN private VM networks\nAfter=network-online.target\nBefore=pve-guests.service\n[Service]\nType=oneshot\nRemainAfterExit=yes\nExecStart=/usr/bin/python3 /opt/kalkan-host/host.py\n[Install]\nWantedBy=multi-user.target\n')
    run('systemctl','daemon-reload');run('systemctl','enable','kalkan-host-network')
    store,directory=snippets()
    provision_vm(VM['FW-01'],cfg,store,directory);wait_for_vm('FW-01')
    for vm in TOPOLOGY['vms']:
        if vm['name']!='FW-01':provision_vm(vm,cfg,store,directory)
    for vm in TOPOLOGY['vms']:
        if vm['name']!='FW-01':wait_for_vm(vm['name'])
    node_folder=bundles(TOPOLOGY,cfg['bootstrap_dns'])
    run(sys.executable,str(ROOT/'lab/build_frontend.py'),capture=False)
    source=archive_sources()
    inventory={'all':{'hosts':{v['name']:{'ansible_host':v['ansible_host']} for v in TOPOLOGY['vms']},
                      'vars':{'ansible_user':'labadmin','ansible_ssh_private_key_file':str(LOCAL/'keys/management'),
                              'ansible_ssh_common_args':'-o IdentityAgent=none -o StrictHostKeyChecking=yes -o UserKnownHostsFile='+str(LOCAL/'known_hosts')}}}
    write_private(LOCAL/'full-inventory.json',inventory)
    write_private(LOCAL/'full-vars.json',{'source_archive':str(source),'node_bundle_dir':str(node_folder),'cache_dir':str(LOCAL/'cache'),'project_root':str(ROOT)})
    venv=ROOT/'.venv'
    if not (venv/'bin/python').exists():run(sys.executable,'-m','venv',str(venv))
    run(str(venv/'bin/python'),'-m','pip','install','--quiet','-r',str(ROOT/'requirements-infra.lock'),capture=False)
    environment=os.environ.copy();environment['ANSIBLE_CONFIG']=str(ROOT/'deploy/ansible.cfg')
    subprocess.run([str(venv/'bin/ansible-playbook'),'-i',str(LOCAL/'full-inventory.json'),str(ROOT/'deploy/playbooks/site.yml'),'-e','@'+str(LOCAL/'full-vars.json')],cwd=ROOT,env=environment,check=True)
    result=api('/api/v1/white/reset',{})
    for name in VM:profile_vm(name,'normal',result['run_id'])
    for vm in TOPOLOGY['vms']:
        gateway=next(n['gateway'] for n in TOPOLOGY['networks'] if n['id']==vm['zone'])
        run('qm','set',str(vm['vmid']),'--nameserver',gateway)
    cfg['maintenance']=False;write_private(LOCAL/'deployment.json',cfg);host.network(cfg)
    sync_controller()
    print('Kurulum tamamlandı. Kabul testi: python3 deploy/kalkan.py check',flush=True)
    access()


def sync_controller():
    selected=['secrets.json','deployment.json','known_hosts','keys/management','keys/management.pub','pki/ca.crt']
    payload={name:base64.b64encode((LOCAL/name).read_bytes()).decode() for name in selected}
    code='''import base64,json,os,sys
from pathlib import Path
root=Path("/opt/kalkan/.local");root.mkdir(exist_ok=True,mode=0o700)
for name,data in json.load(sys.stdin).items():
 p=root/name;p.parent.mkdir(parents=True,exist_ok=True,mode=0o700);p.write_bytes(base64.b64decode(data));p.chmod(0o600)
(root/"controller-ready").touch()
'''
    ssh('MGMT-01','sudo python3 -c '+shlex.quote(code),input=json.dumps(payload))
    (LOCAL/'controller-ready').touch()


def profile_vm(name,profile,run_id,private=None,public=None):
    data={'profile':profile,'run_id':run_id,'maintenance':False,'enrollment':False}
    if private and name=='DMZ-PORTAL-01':data['legacy_private_key']=base64.b64encode(Path(private).read_bytes()).decode()
    if public and name=='KKBS-INT-01':data['legacy_public_key']=base64.b64encode(Path(public).read_bytes()).decode()
    return ssh(name,'cd /opt/kalkan && sudo python3 -m lab.profiles --input -',input=json.dumps(data))


def new_run():
    old=api('/api/v1/snapshot')['run_id']
    for name in ('FW-01','DMZ-PORTAL-01','KKBS-INT-01','KALI-RED-01','KKBS-APP-01'):
        profile_vm(name,'normal',old)
    secret=load(LOCAL/'secrets.json');secret['integrator']=__import__('secrets').token_urlsafe(48);write_private(LOCAL/'secrets.json',secret)
    payload=json.dumps({k:v for k,v in secret.items() if k in ('white','integrator','blue','viewer','operator')})
    code='import json,sys;from lab.node_setup import put;put("/etc/kalkan/credentials.json",sys.stdin.read(),0o640,"root","kalkan")'
    ssh('KKBS-APP-01','cd /opt/kalkan && sudo python3 -c '+shlex.quote(code),input=payload)
    code='import json,sys;from pathlib import Path;p=Path("/etc/kalkan/integration/identity.json");d=json.loads(p.read_text());d["token"]=sys.stdin.read();p.write_text(json.dumps(d))'
    ssh('KKBS-INT-01','sudo python3 -c '+shlex.quote(code),input=secret['integrator'])
    result=api('/api/v1/white/reset',{});run_id=result['run_id']
    key=LOCAL/'keys'/('svc-sync-'+run_id)
    run('ssh-keygen','-q','-t','ed25519','-N','','-C','kalkan-legacy-'+run_id,'-f',str(key))
    for name in VM:profile_vm(name,'exercise',run_id,key,str(key)+'.pub')
    print('Yeni tatbikat turu:',run_id)


def access():
    cfg=settings()
    print('\nWindows PowerShell / Linux terminalinde açık tutulacak komut:')
    print('ssh -N -L 8443:10.77.30.30:443 -L 9443:10.77.50.20:443 root@'+cfg['access_ip'])
    print('KKBS: https://localhost:8443 / Wazuh: https://localhost:9443')
    print('Rol anahtarları: python3 deploy/kalkan.py credentials')


def check():
    result=api('/api/v1/snapshot')
    if not result['reference_connected']:raise RuntimeError('Bağımsız OT kaynağı alınamıyor')
    if sum(len(r['assets']) for r in result['regions'])!=27 or len(result['plants'])!=4:raise RuntimeError('31 kaynak doğrulanamadı')
    for name,unit in [('DMZ-PORTAL-01','kalkan-portal'),('KKBS-INT-01','kalkan-integration'),('KKBS-APP-01','kalkan-app'),('OT-SIM-01','kalkan-ot'),('KALI-RED-01','kalkan-ligolo'),('WAZUH-01','wazuh-manager')]:
        ssh(name,'systemctl is-active '+unit)
    agents=ssh('WAZUH-01','sudo /var/ossec/bin/agent_control -l').stdout
    for name in ('FW-01','MGMT-01','DMZ-PORTAL-01','KKBS-INT-01','KKBS-APP-01','OT-SIM-01'):
        if not any(name in line and 'Active' in line for line in agents.splitlines()):raise RuntimeError('Wazuh ajanı aktif değil: '+name)
    ssh('WAZUH-01','sudo /var/ossec/bin/wazuh-analysisd -t')
    report={'status':'passed','scope':'deployed_services_and_31_sources_and_6_agents','run_id':result['run_id'],'time':time.time()}
    write_private(LOCAL/'acceptance-services.json',report)
    print('PASS: gerçek hizmetler, bağımsız 31 kaynak ve altı Wazuh ajanı. Saldırı zinciri provası ayrıca çalıştırılmalıdır.')


def main():
    parser=argparse.ArgumentParser();parser.add_argument('action',choices=('plan','prepare','install','new-run','red','blue-inspect','blue-contain','blue-restore','blue-verify','check','access','credentials','wazuh-passwords','status'))
    parser.add_argument('--interactive',action='store_true');parser.add_argument('--delay',type=float,default=30)
    args=parser.parse_args()
    if args.action in ('new-run','red','blue-inspect','blue-contain','blue-restore','blue-verify','check','credentials','wazuh-passwords','status') and (LOCAL/'controller-ready').exists() and Path('/etc/pve').is_dir():
        command='cd /opt/kalkan && sudo python3 deploy/kalkan.py '+args.action
        if args.action=='red':command+=' --interactive' if args.interactive else ' --delay '+str(args.delay)
        result=ssh('MGMT-01',command,capture=False,check=False)
        raise SystemExit(result.returncode)
    if args.action=='plan':plan()
    elif args.action=='prepare':initialize_secrets();prepare_artifacts();print('Resmî kaynaklar indirildi, dosya özetleri kilitlendi.')
    elif args.action=='install':install()
    elif args.action=='new-run':new_run()
    elif args.action=='red':
        command='cd /opt/kalkan && sudo python3 lab/red/run.py '+('--interactive' if args.interactive else '--delay '+str(args.delay))
        ssh('KALI-RED-01',command,capture=False)
    elif args.action.startswith('blue-'):
        from deploy.blue import action
        action(args.action.removeprefix('blue-'))
    elif args.action=='check':check()
    elif args.action=='access':access()
    elif args.action=='wazuh-passwords':
        print(ssh('WAZUH-01','sudo tar -xOf /root/wazuh-install-files.tar wazuh-install-files/wazuh-passwords.txt').stdout)
    elif args.action=='credentials':
        secret=load(LOCAL/'secrets.json');print(json.dumps({k:v for k,v in secret.items() if k in ('viewer','operator','blue','white')},ensure_ascii=False,indent=2))
        print('Wazuh parolası: ssh yönetim kanalıyla WAZUH-01 /root/wazuh-install-files.tar içinden okunur; rehberde komutu vardır.')
    else:
        state=api('/api/v1/snapshot')
        print(json.dumps({k:state[k] for k in ('run_id','revision','stage_index','reference_connected','contained','restored','verified','active_findings','stable_for')},ensure_ascii=False,indent=2))


if __name__=='__main__':
    try:main()
    except (RuntimeError,OSError,ValueError,subprocess.CalledProcessError) as error:
        print('FAIL:',str(error),file=sys.stderr)
        if isinstance(error,subprocess.CalledProcessError) and error.stderr:print(error.stderr[-3000:],file=sys.stderr)
        sys.exit(1)
