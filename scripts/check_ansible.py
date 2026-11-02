#!/usr/bin/env python3
"""Validate the current full-lab playbook and review inventory without contacting VMs."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def main():
    local = ROOT / '.venv/bin/ansible-playbook'
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ansible-playbook', default=str(local) if local.exists() else 'ansible-playbook')
    args = parser.parse_args()
    executable = shutil.which(args.ansible_playbook)
    if not executable:
        raise SystemExit('Önce requirements-infra.lock bağımlılıklarını kurun.')
    inventory = ROOT / 'build/infra/inventory.json'
    if not inventory.is_file():
        raise SystemExit('Önce make plan veya python3 scripts/check.py çalıştırın.')
    environment = os.environ.copy()
    environment['ANSIBLE_CONFIG'] = str(ROOT / 'deploy/ansible.cfg')
    environment['ANSIBLE_NOCOLOR'] = '1'
    subprocess.run([executable, '-i', str(inventory), str(ROOT / 'deploy/playbooks/site.yml'), '--syntax-check'],
                   cwd=ROOT, env=environment, check=True, timeout=30)
    inventory_tool = str(Path(executable).with_name('ansible-inventory'))
    result = subprocess.run([inventory_tool, '-i', str(inventory), '--list'], cwd=ROOT,
                            env=environment, text=True, capture_output=True, check=True, timeout=30)
    if len(json.loads(result.stdout)['_meta']['hostvars']) != 8:
        raise SystemExit('Ansible envanterinde sekiz VM bulunmalıdır.')
    report = {'status': 'passed', 'scope': 'syntax_inventory_only',
              'checks': [{'playbook': 'full_lab', 'check': 'syntax', 'passed': True},
                         {'check': 'inventory_8_vms', 'passed': True}]}
    (ROOT / 'build/ansible-report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
    print('PASS: Güncel full_lab playbook sözdizimi ve 8 VM envanteri doğrulandı; uzak erişim yapılmadı.')


if __name__ == '__main__':
    main()
