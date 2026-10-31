"""Generate only the dedicated lab table; preserve unrelated firewall tables."""
import json
from pathlib import Path
import subprocess

ZONES=['mgmt','dmz','kkbs','ot','soc','external','display']
GATEWAYS=['10.77.10.1','10.77.20.1','10.77.30.1','10.77.40.1','10.77.50.1','198.18.60.1','10.77.70.1']
MANAGEMENT='{ 10.77.10.10, 10.77.10.20 }'


def render(name,profile='normal',maintenance=False,enrollment=False):
    lines=['table inet kalkan {',' chain input { type filter hook input priority 0; policy drop;',
           '  iifname "lo" accept','  ct state established,related accept',
           f'  ip saddr {MANAGEMENT} tcp dport 22 accept', '  ip protocol icmp accept']
    def allow(source,ports):lines.append(f'  ip saddr {source} tcp dport {{ {ports} }} accept')
    if name=='FW-01':
        for index,gateway in enumerate(GATEWAYS):
            lines += [f'  iifname "ens{18+index}" ip daddr {gateway} udp dport {{ 53, 123 }} accept',
                      f'  iifname "ens{18+index}" ip daddr {gateway} tcp dport 53 accept']
    elif name=='DMZ-PORTAL-01':allow('{ 198.18.60.20, 10.77.30.20, 10.77.10.10, 10.77.10.20 }','443')
    elif name=='KKBS-INT-01':
        if profile=='exercise':allow('10.77.20.20','22')
    elif name=='KKBS-APP-01':allow('{ 10.77.30.20, 10.77.40.20, 10.77.70.0/24, 10.77.50.30, 10.77.10.10, 10.77.10.20 }','443')
    elif name=='OT-SIM-01':allow('10.77.30.30','443')
    elif name=='WAZUH-01':
        allow('{ 10.77.50.30, 10.77.70.20, 10.77.10.10, 10.77.10.20 }','443')
        agents='{ 10.77.10.1, 10.77.50.1, 10.77.10.20, 10.77.20.20, 10.77.30.20, 10.77.30.30, 10.77.40.20 }'
        allow(agents,'1514'+(', 1515' if enrollment else ''))
        allow('127.0.0.1','55000, 9200')
    elif name=='KALI-RED-01':allow('10.77.20.20','11601')
    lines += ['  limit rate 10/second burst 20 packets log prefix "K1_NET_DROP "',' }',
              ' chain output { type filter hook output priority 0; policy accept; }',
              ' chain forward { type filter hook forward priority 0; policy drop;']
    if name=='FW-01':
        lines += ['  ct state established,related accept']
        def flow(source,destination,ports):
            lines.append(f'  ip saddr {source} ip daddr {destination} tcp dport {{ {ports} }} ct state new limit rate 30/second burst 60 packets log prefix "K1_NET_ALLOW " accept')
        flow('198.18.60.20','10.77.20.20','443')
        flow('10.77.30.20','10.77.20.20','443')
        flow('10.77.30.30','10.77.40.20','443')
        flow('10.77.40.20','10.77.30.30','443')
        flow('10.77.70.0/24','10.77.30.30','443')
        flow('10.77.50.30','10.77.30.30','443')
        flow('10.77.70.20','10.77.50.20','443')
        flow(MANAGEMENT,'{ 10.77.10.0/24, 10.77.20.0/24, 10.77.30.0/24, 10.77.40.0/24, 10.77.50.0/24, 198.18.60.0/24, 10.77.70.0/24 }','22, 443')
        agents='{ 10.77.10.1, 10.77.10.20, 10.77.20.20, 10.77.30.20, 10.77.30.30, 10.77.40.20 }'
        flow(agents,'10.77.50.20','1514'+(', 1515' if enrollment else ''))
        if profile=='exercise':
            flow('10.77.20.20','10.77.30.20','22')
            flow('10.77.20.20','198.18.60.20','11601')
        if maintenance:
            lines.append('  oifname "ens18" ip saddr { 10.77.0.0/16, 198.18.60.0/24 } ip daddr != { 10.77.0.0/16, 198.18.60.0/24 } accept')
        lines.append('  limit rate 10/second burst 20 packets log prefix "K1_NET_DROP "')
    lines += [' }']
    if name=='FW-01':
        lines += [' chain prerouting { type nat hook prerouting priority dstnat; policy accept;',
                  '  ip saddr 198.18.60.20 ip daddr 198.18.60.1 tcp dport 443 dnat ip to 10.77.20.20:443', ' }']
    lines += ['}']
    return '\n'.join(lines)+'\n'


def apply(name,profile,maintenance=False,enrollment=False):
    text=render(name,profile,maintenance,enrollment)
    if subprocess.run(['nft','list','table','inet','kalkan'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL).returncode==0:
        text='delete table inet kalkan\n'+text
    path=Path('/etc/kalkan/firewall.nft');path.write_text(text)
    subprocess.run(['nft','-c','-f',str(path)],check=True)
    subprocess.run(['nft','-f',str(path)],check=True)
