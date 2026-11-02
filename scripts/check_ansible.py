#!/usr/bin/env python3
"""Check Ansible syntax and inventory; optionally execute local configuration guards."""
import argparse
import json
import os
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]


def main():
    default = str(ROOT / ".venv/bin/ansible-playbook") if (ROOT / ".venv/bin/ansible-playbook").exists() else "ansible-playbook"
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ansible-playbook", default=default)
    parser.add_argument("--guard-runtime", action="store_true", help="Yerel Ansible işçilerini de çalıştırır; normal kontrol makinesinde kullanılır.")
    args = parser.parse_args()
    executable = shutil.which(args.ansible_playbook)
    if not executable:
        raise SystemExit("Önce requirements-infra.lock bağımlılıklarını kurun.")
    if not (ROOT / "build/infra/inventory.json").exists():
        raise SystemExit("Önce make plan veya python3 scripts/check.py çalıştırın.")
    environment = os.environ.copy()
    for key in ("PROXMOX_API_TOKEN_ID", "PROXMOX_API_TOKEN_SECRET"):
        environment.pop(key, None)
    environment["ANSIBLE_NOCOLOR"] = "1"
    results = []
    for name in ("preflight", "base-os"):
        command = [executable, f"playbooks/{name}.yml"]
        result = subprocess.run([*command, "--syntax-check"], cwd=ROOT / "infra", env=environment, text=True, capture_output=True, timeout=30)
        if result.returncode:
            raise SystemExit(result.stdout + result.stderr)
        results.append({"playbook": name, "check": "syntax", "passed": True})
        if not args.guard_runtime:
            continue
        result = subprocess.run([*command, "--check"], cwd=ROOT / "infra", env=environment, text=True, capture_output=True, timeout=30)
        forbidden_next_task = "Read the authenticated Proxmox version" if name == "preflight" else "Gather target operating-system facts"
        if result.returncode != 2 or "failed=1" not in result.stdout or forbidden_next_task in result.stdout:
            raise SystemExit(f"Örnek yapılandırma uzak erişim öncesinde durmadı: {name}\n" + result.stdout + result.stderr)
        results.append({"playbook": name, "check": "example_config_refused_before_remote_access", "passed": True})
    inventory_command = str(Path(executable).with_name("ansible-inventory"))
    result = subprocess.run([inventory_command, "--list"], cwd=ROOT / "infra", env=environment, text=True, capture_output=True, check=True, timeout=30)
    if len(json.loads(result.stdout)["_meta"]["hostvars"]) != 8:
        raise SystemExit("Ansible envanterinde sekiz VM bulunmalıdır.")
    results.append({"check": "inventory_8_vms", "passed": True})
    environment["ANSIBLE_CONFIG"] = str(ROOT / "deploy/ansible.cfg")
    subprocess.run([executable, "-i", "localhost,", str(ROOT / "deploy/playbooks/site.yml"), "--syntax-check"],
                   cwd=ROOT, env=environment, check=True, timeout=30)
    results.append({"playbook": "full_lab", "check": "syntax", "passed": True})
    report = {"status": "passed", "scope": "syntax_inventory_only" if not args.guard_runtime else "syntax_inventory_local_guard_only",
              "guard_runtime": "not_run" if not args.guard_runtime else "passed", "checks": results}
    (ROOT / "build/ansible-report.json").write_text(json.dumps(report, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print("PASS: 3 playbook sözdizimi ve 8 VM envanteri doğrulandı. Yerel koruma testi: " + report["guard_runtime"])


if __name__ == "__main__":
    main()
