import base64
import hashlib
import json
import os
from pathlib import Path
import secrets
import subprocess

ROOT=Path(__file__).resolve().parents[1]
LOCAL=ROOT/'.local'


def run(*args):return subprocess.check_output(args,text=True)


def initialize_secrets():
    LOCAL.mkdir(exist_ok=True,mode=0o700);os.chmod(LOCAL,0o700)
    path=LOCAL/'secrets.json'
    if not path.exists():
        path.write_text(json.dumps({role:secrets.token_urlsafe(48) for role in ('white','integrator','blue','viewer','operator','ot','evidence')}));path.chmod(0o600)
    keys=LOCAL/'keys';keys.mkdir(exist_ok=True,mode=0o700)
    management=keys/'management'
    if not management.exists():subprocess.run(['ssh-keygen','-q','-t','ed25519','-N','','-C','kalkan-management','-f',str(management)],check=True)
    pki=LOCAL/'pki';pki.mkdir(exist_ok=True,mode=0o700)
    if not (pki/'ca.crt').exists():
        subprocess.run(['openssl','req','-x509','-newkey','rsa:3072','-nodes','-days','3650','-subj','/CN=KALKAN-1 Lab CA','-keyout',str(pki/'ca.key'),'-out',str(pki/'ca.crt')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        (pki/'ca.key').chmod(0o600)
    return json.loads(path.read_text())


def certificate(name,ip):
    pki=LOCAL/'pki';prefix=pki/name
    cert=prefix.with_suffix('.crt');key=prefix.with_suffix('.key')
    if not cert.exists():
        csr=prefix.with_suffix('.csr');ext=prefix.with_suffix('.ext')
        sans=f'IP:{ip},IP:127.0.0.1,DNS:localhost,DNS:{name.lower()}'
        if name=='DMZ-PORTAL-01':sans+=',IP:198.18.60.1'
        ext.write_text('subjectAltName='+sans+'\nextendedKeyUsage=serverAuth,clientAuth\n')
        subprocess.run(['openssl','req','-newkey','rsa:2048','-nodes','-subj','/CN='+name,'-keyout',str(key),'-out',str(csr)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        subprocess.run(['openssl','x509','-req','-in',str(csr),'-CA',str(pki/'ca.crt'),'-CAkey',str(pki/'ca.key'),'-CAcreateserial','-days','825','-extfile',str(ext),'-out',str(cert)],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
        key.chmod(0o600)
    return cert.read_text(),key.read_text()


def nginx(port,mutual=False):
    return '''server {
 listen 443 ssl;
 server_name _;
 ssl_certificate /etc/kalkan/tls/server.crt;
 ssl_certificate_key /etc/kalkan/tls/server.key;
 ssl_protocols TLSv1.2 TLSv1.3;
 client_max_body_size 32k;
'''+(' ssl_client_certificate /etc/kalkan/tls/ca.crt;\n ssl_verify_client on;\n' if mutual else '')+f'''
 location / {{
  proxy_pass http://127.0.0.1:{port};
  proxy_set_header Host $http_host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $remote_addr;
  proxy_cookie_flags ~ secure;
  proxy_read_timeout 20s;
 }}
}}
'''


def bundles(topology,bootstrap_dns):
    secrets_data=initialize_secrets()
    folder=LOCAL/'node-configs';folder.mkdir(exist_ok=True)
    ca=(LOCAL/'pki/ca.crt').read_text()
    proxy_cert,proxy_key=certificate('KALI-RED-01','198.18.60.20')
    proxy_der=subprocess.check_output(['openssl','x509','-in',str(LOCAL/'pki/KALI-RED-01.crt'),'-outform','DER'])
    fingerprint=hashlib.sha256(proxy_der).hexdigest()
    known=(LOCAL/'known_hosts').read_text() if (LOCAL/'known_hosts').exists() else ''
    for vm in topology['vms']:
        name=vm['name'];files=[]
        def add(path,text,mode='0644',owner='root',group=None):
            files.append({'path':path,'data':base64.b64encode(text.encode()).decode(),'mode':mode,'owner':owner,'group':group})
        def add_json(path,value,owner='root',group=None):add(path,json.dumps(value,ensure_ascii=False,indent=2)+'\n','0640',owner,group)
        cert,key=certificate(name,vm['ansible_host'])
        add('/etc/kalkan/tls/ca.crt',ca);add('/etc/kalkan/tls/server.crt',cert);add('/etc/kalkan/tls/server.key',key,'0600')
        add_json('/etc/kalkan/profile.json',{'lab_id':'KALKAN-1','profile':'normal','maintenance':True,'enrollment':True})
        if name=='KKBS-APP-01':
            add('/etc/kalkan/tls/client.crt',cert);add('/etc/kalkan/tls/client.key',key,'0640',group='kalkan')
            add_json('/etc/kalkan/credentials.json',{k:v for k,v in secrets_data.items() if k in ('white','integrator','blue','viewer','operator')},group='kalkan')
            add_json('/etc/kalkan/app.json',{'runtime':'/var/lib/kalkan/app','log_path':'/var/log/kalkan/events.jsonl','credentials':'/etc/kalkan/credentials.json',
                'ot_url':'https://10.77.40.20','ot_token':secrets_data['ot'],'evidence_key':secrets_data['evidence'],'ca':'/etc/kalkan/tls/ca.crt','client_cert':'/etc/kalkan/tls/client.crt','client_key':'/etc/kalkan/tls/client.key','profile_path':'/etc/kalkan/profile.json'},group='kalkan')
            add('/etc/nginx/sites-enabled/kalkan.conf',nginx(8088))
        elif name=='OT-SIM-01':
            add_json('/etc/kalkan/ot.json',{'runtime':'/var/lib/kalkan/ot','log_path':'/var/log/kalkan/ot.jsonl','token':secrets_data['ot']},group='kalkan')
            add('/etc/nginx/sites-enabled/kalkan.conf',nginx(8090,True))
        elif name=='DMZ-PORTAL-01':add('/etc/nginx/sites-enabled/kalkan.conf',nginx(8089))
        elif name=='KKBS-INT-01':
            add_json('/etc/kalkan/integration/identity.json',{'app_url':'https://10.77.30.30','portal_url':'https://10.77.20.20','token':secrets_data['integrator'],'ca':'/etc/kalkan/tls/ca.crt','log_path':'/var/log/kalkan/integration.jsonl'},group='svc-sync')
            add('/home/svc-sync/.ssh/authorized_keys','','0600','svc-sync')
        elif name=='KALI-RED-01':
            add_json('/etc/kalkan/red.json',{'lab_id':'KALKAN-1','portal_url':'https://198.18.60.1','ssh_target':'10.77.30.20','ca':'/etc/kalkan/tls/ca.crt','known_hosts':'/etc/kalkan/red_known_hosts','state_dir':'/var/lib/kalkan-red','proxy_fingerprint':fingerprint})
            add('/etc/kalkan/red_known_hosts',known)
            add('/etc/kalkan/ligolo.yml','agent:\n  "027700000140":\n    autobind: true\n    interface: k1tun\ninterface:\n  k1tun:\n    routes:\n      - 10.77.30.20/32\nweb:\n  enabled: false\n  enableui: false\n')
        gateway=next(n['gateway'] for n in topology['networks'] if n['id']==vm['zone'])
        bundle={'name':name,'gateway':gateway,'gateways':[n['gateway'] for n in topology['networks']],'bootstrap_dns':bootstrap_dns,
                'dns_records':{v['name'].lower():v['ansible_host'] for v in topology['vms']},'files':files}
        path=folder/(name+'.json');path.write_text(json.dumps(bundle));path.chmod(0o600)
    return folder
