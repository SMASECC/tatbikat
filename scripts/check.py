#!/usr/bin/env python3
"""Build and verify the repository without contacting deployment targets."""
import hashlib
import json
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def main():
    report = ROOT / "build/check-report.json"
    report.parent.mkdir(exist_ok=True)
    report.unlink(missing_ok=True)
    if sys.version_info < (3, 12):
        raise SystemExit("Python 3.12 veya üzeri gerekmektedir.")
    if not shutil.which("node"):
        raise SystemExit("Frontend kontrolleri için Node.js 22+ gerekmektedir.")
    node_version = subprocess.check_output(["node", "--version"], text=True).strip()
    if int(node_version.lstrip("v").split(".")[0]) < 22:
        raise SystemExit("Node.js 22 veya üzeri gerekmektedir.")
    steps = [([sys.executable, "lab/build_frontend.py"], ROOT),
             ([sys.executable, "scripts/validate_repo.py", "--require-build"], ROOT),
             ([sys.executable, "scripts/render_infra.py"], ROOT),
             ([sys.executable, "scripts/scenario_plan.py", "--check"], ROOT)]
    steps += [(["node", f"frontend/check-{name}.cjs"], ROOT) for name in ("controls", "show", "analyst", "session", "audio", "broadcast", "dmz")]
    steps += [(['node','lab/check_frontend.cjs'],ROOT)]
    steps += [([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-v"], ROOT),
              ([sys.executable, "-m", "unittest", "discover", "-s", "lab/tests", "-v"], ROOT),
              ([sys.executable, "-m", "unittest", "discover", "-s", "tests", "-v"], ROOT / "backend/starter-v0.1")]
    completed = []
    for command, cwd in steps:
        print(f"\n> {' '.join(command)} [{cwd.relative_to(ROOT) or '.'}]", flush=True)
        subprocess.run(command, cwd=cwd, check=True)
        completed.append({"command": [Path(command[0]).name, *command[1:]], "cwd": str(cwd.relative_to(ROOT)), "passed": True})
    source_hashes = {}
    ignored = {".git", ".local", ".venv", "build", "dist", "__pycache__", "runtime"}
    for path in sorted(ROOT.rglob("*")):
        relative = path.relative_to(ROOT)
        if path.is_file() and not any(part in ignored for part in relative.parts):
            source_hashes[relative.as_posix()] = hashlib.sha256(path.read_bytes()).hexdigest()
    result = {"status": "passed", "scope": "local_only_no_lab_deployment", "node": node_version,
              "frontend_sha256": hashlib.sha256((ROOT / "dist/frontend/index.html").read_bytes()).hexdigest(),
              "steps": completed, "source_sha256": source_hashes,
              "live_frontend_sha256":hashlib.sha256((ROOT/'dist/live/index.html').read_bytes()).hexdigest(),
              "unverified":["Proxmox VM/network deployment","full eight-VM privilege/pivot/SSH chain","actual Wazuh engine and delivery","live browser visual QA"],
              "known_test_skip":"Non-root subprocess boundary cannot run in this environment's UID mapping; installer verifies svc-web is non-root."}
    report.write_text(json.dumps(result, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"\nPASS: {len(completed)} kontrol grubu tamamlandı. Gerçek sunucu kurulumu yapılmadı.")


if __name__ == "__main__":
    try:
        main()
    except subprocess.CalledProcessError as exc:
        raise SystemExit(exc.returncode)
