"""Apply only dedicated lab identity, privilege and firewall profile changes."""
import argparse
import base64
import json
import os
from pathlib import Path
import signal
import subprocess
import sys
import uuid
from .common import load
from .node_setup import put,command
from .firewall import apply as apply_firewall


def apply(data):
    marker=load('/etc/kalkan/lab-marker.json')
    if marker.get('lab_id')!='KALKAN-1' or os.geteuid()!=0:raise RuntimeError('İşaretli lab VM ve root gerekmektedir.')
    profile=data['profile'];name=marker['name']
    if profile not in ('normal','exercise','restored'):raise ValueError('Geçersiz profil')
    run_id=str(uuid.UUID(data['run_id']))
    resolver=Path('/etc/resolv.conf')
    if resolver.is_symlink():resolver.unlink()
    put(str(resolver),'nameserver '+marker['gateway']+'\nsearch kalkan.test\n')
    put('/etc/kalkan/profile.json',json.dumps({'lab_id':'KALKAN-1','profile':profile,'run_id':run_id,'maintenance':data.get('maintenance',False),'enrollment':data.get('enrollment',False)}))
    if name=='DMZ-PORTAL-01':
        directory=Path('/var/lib/kalkan-portal/legacy-sync');directory.mkdir(exist_ok=True,parents=True,mode=0o700);directory.chmod(0o700)
        sudo=Path('/etc/sudoers.d/kalkan-lab');key=directory/'id_ed25519'
        if profile=='exercise':
            put(str(sudo),'svc-web ALL=(root) NOPASSWD: /usr/bin/python3\n',0o440)
            command('visudo','-cf',str(sudo))
            put(str(key),base64.b64decode(data['legacy_private_key']).decode(),0o600)
        else:
            sudo.unlink(missing_ok=True);key.unlink(missing_ok=True)
            pid_file=Path('/var/lib/kalkan-portal/ligolo.pid')
            if pid_file.exists():
                try:
                    pid=int(pid_file.read_text());executable=Path(f'/proc/{pid}/exe').resolve()
                    if str(executable)=='/opt/kalkan/bin/ligolo-agent':os.kill(pid,signal.SIGTERM)
                except (ValueError,ProcessLookupError,FileNotFoundError):pass
                pid_file.unlink(missing_ok=True)
    if name=='KKBS-INT-01':
        if profile!='exercise':
            # Only the named exercise account is terminated. The labadmin management channel remains separate.
            subprocess.run(['loginctl','terminate-user','svc-sync'],capture_output=True)
            subprocess.run(['pkill','-KILL','-u','svc-sync'],capture_output=True)
        command('usermod','--shell','/bin/bash' if profile=='exercise' else '/usr/sbin/nologin','svc-sync')
        public=base64.b64decode(data['legacy_public_key']).decode().strip() if profile=='exercise' else ''
        content='from="10.77.20.20",no-agent-forwarding,no-port-forwarding,no-X11-forwarding '+public+'\n' if public else ''
        put('/home/svc-sync/.ssh/authorized_keys',content,0o600,'svc-sync')
        Path('/home/svc-sync/.local/share/kalkan/session.json').unlink(missing_ok=True)
        command('systemctl','restart','kalkan-integration')
    if name=='KALI-RED-01':
        command('systemctl','stop','kalkan-ligolo')
        subprocess.run(['ip','link','delete','k1tun'],capture_output=True)
        command('systemctl','start','kalkan-ligolo')
    apply_firewall(name,profile,data.get('maintenance',False),data.get('enrollment',False))
    if name=='FW-01' and profile!='exercise':
        for destination in ('198.18.60.20','10.77.30.20'):
            result=subprocess.run(['conntrack','-D','-s','10.77.20.20','-d',destination],capture_output=True)
            if result.returncode not in (0,1):raise RuntimeError('Mevcut bağlantı durumu temizlenemedi')


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--input',default='-');args=parser.parse_args()
    data=json.load(sys.stdin) if args.input=='-' else load(args.input)
    apply(data)
    print('Profil uygulandı: '+data['profile'])
