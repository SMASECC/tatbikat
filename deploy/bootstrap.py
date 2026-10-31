#!/usr/bin/env python3
"""Install controller tools on a clean Proxmox 9 host; optional lab repository setup."""
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys

parser=argparse.ArgumentParser()
parser.add_argument('--community-repo',action='store_true',help='Temiz ve aboneliksiz Proxmox lab için pve-no-subscription deposunu seçer.')
args=parser.parse_args()
if os.geteuid()!=0 or not Path('/etc/pve').is_dir():raise SystemExit('Proxmox host üzerinde root olarak çalıştırın.')
version=subprocess.check_output(['pveversion'],text=True)
if not version.startswith('pve-manager/9.'):raise SystemExit('Bu teslim Proxmox VE 9.x için hazırlanmıştır.')
if args.community_repo:
    backup=Path(__file__).resolve().parents[1]/'.local/apt-before';backup.mkdir(parents=True,exist_ok=True,mode=0o700)
    for source in list(Path('/etc/apt/sources.list.d').glob('*.sources'))+list(Path('/etc/apt/sources.list.d').glob('*.list')):
        text=source.read_text()
        if 'enterprise.proxmox.com' not in text:continue
        if not (backup/source.name).exists():shutil.copy2(source,backup/source.name)
        if source.suffix=='.sources':
            blocks=[]
            for block in text.split('\n\n'):
                if 'enterprise.proxmox.com' in block:
                    rows=[row for row in block.splitlines() if not row.startswith('Enabled:')];rows.append('Enabled: no');block='\n'.join(rows)
                blocks.append(block)
            source.write_text('\n\n'.join(blocks)+'\n')
        else:source.write_text('\n'.join('# '+row if 'enterprise.proxmox.com' in row and not row.lstrip().startswith('#') else row for row in text.splitlines())+'\n')
    Path('/etc/apt/sources.list.d/kalkan-pve.sources').write_text('Types: deb\nURIs: http://download.proxmox.com/debian/pve\nSuites: trixie\nComponents: pve-no-subscription\nSigned-By: /usr/share/keyrings/proxmox-archive-keyring.gpg\n')
subprocess.run(['apt-get','update'],check=True)
subprocess.run(['apt-get','install','-y','python3-venv','unzip','curl','openssl','openssh-client','nftables','gnupg'],check=True)
print('Kontrol araçları hazır. Sonraki: python3 deploy/kalkan.py plan')
