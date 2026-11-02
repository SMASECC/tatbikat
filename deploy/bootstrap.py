#!/usr/bin/env python3
"""Install controller tools on a clean Proxmox 9 host; optional lab repository setup."""
import argparse
import os
from pathlib import Path
import platform
import shutil
import subprocess

ROOT=Path(__file__).resolve().parents[1]


def community_sources(source_dir,legacy_file,backup):
    """Back up enterprise sources once, preserving unrelated repository entries."""
    backup.mkdir(parents=True,exist_ok=True,mode=0o700)
    sources=list(source_dir.glob('*.sources'))+list(source_dir.glob('*.list'))
    if legacy_file.exists():sources.append(legacy_file)
    for source in sources:
        text=source.read_text()
        if 'enterprise.proxmox.com' not in text:continue
        if not (backup/source.name).exists():shutil.copy2(source,backup/source.name)
        if source.suffix=='.sources':
            blocks=[]
            for block in text.split('\n\n'):
                if 'enterprise.proxmox.com' in block:
                    rows=[row for row in block.splitlines() if not row.startswith('Enabled:')]
                    rows.append('Enabled: no');block='\n'.join(rows)
                blocks.append(block)
            source.write_text('\n\n'.join(blocks)+'\n')
        else:
            source.write_text('\n'.join('# '+row if 'enterprise.proxmox.com' in row and not row.lstrip().startswith('#') else row for row in text.splitlines())+'\n')
    (source_dir/'kalkan-pve.sources').write_text('Types: deb\nURIs: http://download.proxmox.com/debian/pve\nSuites: trixie\nComponents: pve-no-subscription\nSigned-By: /usr/share/keyrings/proxmox-archive-keyring.gpg\n')


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('--community-repo',action='store_true',help='Temiz ve aboneliksiz Proxmox lab için pve-no-subscription deposunu seçer.')
    args=parser.parse_args()
    if os.geteuid()!=0 or not Path('/etc/pve').is_dir():raise SystemExit('Proxmox host üzerinde root olarak çalıştırın.')
    version=subprocess.check_output(['pveversion'],text=True)
    if not version.startswith('pve-manager/9.'):raise SystemExit('Bu teslim Proxmox VE 9.x için hazırlanmıştır.')
    if platform.machine() not in ('x86_64','amd64'):raise SystemExit('Bu teslim x86-64 Proxmox host gerektirir.')
    if args.community_repo:
        community_sources(Path('/etc/apt/sources.list.d'),Path('/etc/apt/sources.list'),ROOT/'.local/apt-before')
    environment=os.environ.copy();environment['DEBIAN_FRONTEND']='noninteractive'
    subprocess.run(['apt-get','update'],check=True,env=environment)
    subprocess.run(['apt-get','install','-y','python3-venv','git','unzip','curl','ca-certificates','openssl','openssh-client','nftables','gnupg','iproute2','tar','rsync'],check=True,env=environment)
    print('Kontrol araçları hazır. Sonraki: python3 deploy/kalkan.py plan')


if __name__=='__main__':main()
