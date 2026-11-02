"""Configure a marked exercise VM. Called by Ansible as root, never on Proxmox."""
import argparse
import base64
import grp
import json
import os
from pathlib import Path
import pwd
import re
import shlex
import subprocess
import xml.etree.ElementTree as ET
from .common import load
from .firewall import apply as apply_firewall


def command(*args):return subprocess.run(args,check=True,text=True,capture_output=True)


def put(path,text,mode=0o644,owner='root',group=None):
    path=Path(path);path.parent.mkdir(parents=True,exist_ok=True)
    temporary=path.with_name(path.name+'.kalkan-new')
    descriptor=os.open(temporary,os.O_CREAT|os.O_TRUNC|os.O_WRONLY,0o600)
    with os.fdopen(descriptor,'w') as output:output.write(text)
    temporary.chmod(mode)
    os.chown(temporary,pwd.getpwnam(owner).pw_uid,grp.getgrnam(group or owner).gr_gid)
    temporary.replace(path)


def user(name,home,shell='/usr/sbin/nologin'):
    try:pwd.getpwnam(name)
    except KeyError:command('useradd','--system','--user-group','--create-home','--home-dir',home,'--shell',shell,name)


def service(name,module,arguments='',owner='kalkan',privileges=False):
    text=f'''[Unit]
Description=KALKAN-1 {name}
After=network-online.target
Wants=network-online.target
[Service]
User={owner}
Group={owner}
WorkingDirectory=/opt/kalkan
ExecStart=/usr/bin/python3 -m {module} {arguments}
Restart=always
RestartSec=3
UMask=0027
PrivateTmp=true
NoNewPrivileges={'false' if privileges else 'true'}
[Install]
WantedBy=multi-user.target
'''
    put('/etc/systemd/system/'+name+'.service',text)


def configure(bundle):
    marker=load('/etc/kalkan/lab-marker.json')
    if marker.get('lab_id')!='KALKAN-1' or marker.get('name')!=bundle['name']:
        raise SystemExit('Hedef VM işareti eşleşmiyor; sistem değiştirilmedi.')
    name=bundle['name']
    user('kalkan','/var/lib/kalkan')
    if name=='DMZ-PORTAL-01':user('svc-web','/var/lib/kalkan-portal')
    if name=='KKBS-INT-01':user('svc-sync','/home/svc-sync')
    for directory in ['/var/log/kalkan','/var/lib/kalkan']:
        Path(directory).mkdir(exist_ok=True,parents=True)
        account=pwd.getpwnam('kalkan');os.chown(directory,account.pw_uid,account.pw_gid);os.chmod(directory,0o750)
    for item in bundle['files']:
        put(item['path'],base64.b64decode(item['data']).decode(),int(item.get('mode','0644'),8),item.get('owner','root'),item.get('group'))
    put('/etc/sysctl.d/80-kalkan.conf','net.ipv6.conf.all.disable_ipv6=1\nnet.ipv6.conf.default.disable_ipv6=1\n'+('net.ipv4.ip_forward=1\n' if name=='FW-01' else ''))
    command('sysctl','--system')
    services=[]
    if name=='DMZ-PORTAL-01':
        service('kalkan-portal','lab.portal',owner='svc-web',privileges=True);services=['kalkan-portal']
        Path('/var/lib/kalkan-portal/legacy-sync').mkdir(exist_ok=True,mode=0o700)
        os.chown('/var/lib/kalkan-portal/legacy-sync',0,0);os.chmod('/var/lib/kalkan-portal/legacy-sync',0o700)
        put('/var/log/kalkan/portal.jsonl','',0o640,'svc-web') if not Path('/var/log/kalkan/portal.jsonl').exists() else None
        # svc-web must traverse the log directory; it cannot alter other services' files.
        os.chmod('/var/log/kalkan',0o755)
    elif name=='KKBS-INT-01':
        service('kalkan-integration','lab.integration',owner='svc-sync');services=['kalkan-integration']
        put('/var/log/kalkan/integration.jsonl','',0o640,'svc-sync') if not Path('/var/log/kalkan/integration.jsonl').exists() else None
        os.chmod('/var/log/kalkan',0o755)
        ssh=Path('/home/svc-sync/.ssh');ssh.mkdir(mode=0o700,exist_ok=True)
        account=pwd.getpwnam('svc-sync');os.chown(ssh,account.pw_uid,account.pw_gid)
        put('/etc/ssh/sshd_config.d/50-kalkan-sync.conf','Match User svc-sync\n    AuthenticationMethods publickey\n    PasswordAuthentication no\n    AllowTcpForwarding no\n    X11Forwarding no\n    PermitTTY yes\nMatch all\n')
        command('sshd','-t');command('systemctl','restart','ssh')
    elif name=='KKBS-APP-01':service('kalkan-app','lab.app');services=['kalkan-app']
    elif name=='OT-SIM-01':service('kalkan-ot','lab.ot');services=['kalkan-ot']
    elif name=='KALI-RED-01':
        put('/etc/systemd/system/kalkan-ligolo.service','''[Unit]
Description=KALKAN-1 Ligolo proxy
After=network-online.target
[Service]
WorkingDirectory=/var/lib/kalkan
ExecStart=/opt/kalkan/bin/ligolo-proxy -daemon -config /etc/kalkan/ligolo.yml -laddr 198.18.60.20:11601 -certfile /etc/kalkan/tls/server.crt -keyfile /etc/kalkan/tls/server.key
Restart=on-failure
RestartSec=3
[Install]
WantedBy=multi-user.target
''');services=['kalkan-ligolo']
    if name in ('DMZ-PORTAL-01','KKBS-APP-01','OT-SIM-01'):
        default=Path('/etc/nginx/sites-enabled/default')
        if default.is_symlink() or default.exists():default.unlink()
        command('nginx','-t');command('systemctl','enable','--now','nginx');command('systemctl','restart','nginx')
    gateway=bundle['gateway']
    chrony=('pool ntp.ubuntu.com iburst\nlocal stratum 10\nallow 10.77.0.0/16\nallow 198.18.60.0/24\n' if name=='FW-01' else f'server {gateway} iburst\n')
    put('/etc/chrony/chrony.conf',chrony+'driftfile /var/lib/chrony/chrony.drift\nmakestep 1 3\nrtcsync\n')
    command('systemctl','restart','chrony')
    if name=='FW-01':
        records=''.join('host-record='+name+','+name+'.kalkan.test,'+ip+'\n' for name,ip in bundle['dns_records'].items())
        put('/etc/dnsmasq.d/kalkan.conf','bind-dynamic\nlisten-address='+','.join(bundle['gateways'])+'\nno-resolv\nserver='+bundle['bootstrap_dns']+'\ndomain-needed\nbogus-priv\n'+records)
        command('systemctl','enable','--now','dnsmasq');command('systemctl','restart','dnsmasq')
    command('systemctl','daemon-reload')
    for item in services:command('systemctl','enable','--now',item);command('systemctl','restart',item)
    apply_firewall(name,'normal',maintenance=True,enrollment=True)
    put('/etc/systemd/system/kalkan-firewall.service', '''[Unit]
Description=KALKAN dedicated guest firewall
After=network-online.target
[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/kalkan
ExecStart=/usr/bin/python3 -m lab.node_setup --apply-firewall
[Install]
WantedBy=multi-user.target
''')
    command('systemctl','daemon-reload');command('systemctl','enable','kalkan-firewall')


def configure_agent(name):
    config=Path('/var/ossec/etc/ossec.conf')
    text=re.sub(r'<\?xml[^>]*\?>','',config.read_text())
    wrapper=ET.fromstring('<kalkan_wrapper>'+text+'</kalkan_wrapper>')
    root=wrapper.find('ossec_config')
    if root is None:raise RuntimeError('Wazuh ossec_config bulunamadı')
    existing={node.findtext('location') for node in root.findall('localfile')}
    locations=[('/var/log/audit/audit.log','audit'),('/var/log/auth.log','syslog')]
    if name=='FW-01':locations.append(('/var/log/kern.log','syslog'))
    # Register configured sources even if their first event has not been written.
    # Otherwise a service that starts late is never collected after installation.
    service_logs={'DMZ-PORTAL-01':'portal.jsonl','KKBS-INT-01':'integration.jsonl',
                  'KKBS-APP-01':'events.jsonl','OT-SIM-01':'ot.jsonl'}
    paths={str(path) for path in Path('/var/log/kalkan').glob('*.jsonl')}
    if name in service_logs:paths.add('/var/log/kalkan/'+service_logs[name])
    locations.extend((path,'json') for path in sorted(paths))
    for location,kind in locations:
        if location not in existing:
            node=ET.SubElement(root,'localfile');ET.SubElement(node,'log_format').text=kind;ET.SubElement(node,'location').text=location
    syscheck=root.find('syscheck')
    if syscheck is None:syscheck=ET.SubElement(root,'syscheck')
    for path in ('/etc/sudoers.d','/etc/kalkan/profile.json')+ (('/home/svc-sync/.ssh/authorized_keys',) if name=='KKBS-INT-01' else ()):
        if not any(x.text==path for x in syscheck.findall('directories')):
            ET.SubElement(syscheck,'directories',{'check_all':'yes','whodata':'yes'}).text=path
    config.write_text('\n'.join(ET.tostring(block,encoding='unicode') for block in wrapper))
    audit=['-b 8192']
    if name=='DMZ-PORTAL-01':
        uid=pwd.getpwnam('svc-web').pw_uid
        audit += [f'-a always,exit -F arch=b64 -S execve,execveat -F uid={uid} -k k1_web_exec',
                  '-a always,exit -F arch=b64 -S execve,execveat -F euid=0 -k k1_root_exec',
                  '-w /var/lib/kalkan-portal/legacy-sync -p r -k k1_service_key_read']
    if name=='KKBS-INT-01':
        audit += ['-w /home/svc-sync/.ssh/authorized_keys -p wa -k k1_authorized_keys',
                  '-w /etc/kalkan/integration/identity.json -p r -k k1_api_identity']
    put('/etc/audit/rules.d/70-kalkan.rules','\n'.join(audit)+'\n')
    command('augenrules','--load')
    command('systemctl','enable','wazuh-agent')
    command('systemctl','restart','wazuh-agent')


if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--bundle');parser.add_argument('--agent',action='store_true');parser.add_argument('--apply-firewall',action='store_true')
    args=parser.parse_args()
    if os.geteuid()!=0:raise SystemExit('Root gerekmektedir')
    marker=load('/etc/kalkan/lab-marker.json')
    if marker.get('lab_id')!='KALKAN-1':raise SystemExit('Lab VM işareti bulunamadı')
    if args.agent:configure_agent(marker['name'])
    elif args.apply_firewall:
        cfg=load('/etc/kalkan/profile.json');apply_firewall(marker['name'],cfg['profile'],cfg.get('maintenance',False),cfg.get('enrollment',False))
    else:configure(load(args.bundle))
