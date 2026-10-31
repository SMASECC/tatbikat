#!/usr/bin/env python3
"""Package a clean, tested Git revision and verify its portable history."""
import argparse
import hashlib
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile

ROOT = Path(__file__).resolve().parents[1]


def git(*args):
    return subprocess.check_output(["git", *args], cwd=ROOT).decode().strip()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=ROOT.parent / "KALKAN-1_Kaynak_Deposu_v0.2.0.zip")
    args = parser.parse_args()
    if git("status", "--porcelain"):
        raise SystemExit("Paketlemeden önce kaynak değişikliklerini commit edin.")
    if git("branch", "--show-current") != "main":
        raise SystemExit("Bu dağıtım main dalından hazırlanmalıdır.")
    report_path = ROOT / "build/check-report.json"
    if not report_path.exists():
        raise SystemExit("Önce python3 scripts/check.py çalıştırılmalıdır.")
    report = json.loads(report_path.read_text(encoding="utf-8"))
    if report.get("status") != "passed":
        raise SystemExit("Başarılı kaynak kontrolü bulunamadı.")
    files = subprocess.check_output(["git", "ls-files", "-z"], cwd=ROOT).decode().split("\0")
    files = [name for name in files if name]
    for name in files:
        digest = hashlib.sha256((ROOT / name).read_bytes()).hexdigest()
        if report["source_sha256"].get(name) != digest:
            raise SystemExit(f"Kontrol sonrası kaynak değişmiş veya test edilmemiş: {name}")
    frontend = ROOT / "dist/frontend/index.html"
    if hashlib.sha256(frontend.read_bytes()).hexdigest() != report["frontend_sha256"]:
        raise SystemExit("Kontrol sonrası frontend değişmiştir.")
    commit = git("rev-parse", "HEAD")
    version = (ROOT / "VERSION").read_text().strip()
    tag = "v" + version
    if git("rev-list", "-n", "1", tag) != commit:
        raise SystemExit("Sürüm etiketi mevcut commit ile uyuşmamaktadır.")
    with tempfile.TemporaryDirectory(prefix="kalkan-release-") as directory:
        temporary = Path(directory)
        bundle = temporary / "kalkan-1.bundle"
        subprocess.run(["git", "bundle", "create", str(bundle), "--all"], cwd=ROOT, check=True)
        subprocess.run(["git", "bundle", "verify", str(bundle)], cwd=ROOT, check=True, stdout=subprocess.DEVNULL)
        clone = temporary / "restored"
        subprocess.run(["git", "clone", "--quiet", "--branch", "main", str(bundle), str(clone)], check=True)
        cloned_commit = subprocess.check_output(["git", "rev-parse", "HEAD"], cwd=clone).decode().strip()
        if cloned_commit != commit:
            raise SystemExit("Git bundle geri yükleme kontrolü başarısızdır.")
        entries = {name: (ROOT / name).read_bytes() for name in files}
        entries["dist/frontend/index.html"] = frontend.read_bytes()
        entries["kalkan-1.bundle"] = bundle.read_bytes()
        entries["verification/check-report.json"] = report_path.read_bytes()
        ansible_report = ROOT / "build/ansible-report.json"
        if ansible_report.exists():
            entries["verification/ansible-report.json"] = ansible_report.read_bytes()
        for path in sorted((ROOT / "build/infra").glob("*")):
            if path.is_file():
                entries["review/" + path.name] = path.read_bytes()
        release = {"project": "KALKAN-1", "version": version, "git_commit": commit, "git_tag": tag,
                   "git_bundle_restore_verified": True, "deployment_status": "not_deployed",
                   "test_scope": report["scope"], "frontend_sha256": report["frontend_sha256"],
                   "contents": "source, approved frontend build, git history, review plans, local verification"}
        entries["RELEASE.json"] = (json.dumps(release, ensure_ascii=False, indent=2) + "\n").encode()
        checksums = {name: hashlib.sha256(data).hexdigest() for name, data in entries.items()}
        entries["SHA256SUMS"] = ("\n".join(f"{checksums[name]}  {name}" for name in sorted(checksums)) + "\n").encode()
        args.output.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(args.output, "w", compression=zipfile.ZIP_DEFLATED, compresslevel=9) as archive:
            for name, data in sorted(entries.items()):
                archive.writestr("KALKAN-1/" + name, data)
        with zipfile.ZipFile(args.output) as archive:
            if archive.testzip() is not None:
                raise SystemExit("Arşiv bütünlüğü kontrolü başarısızdır.")
            for name, digest in checksums.items():
                if hashlib.sha256(archive.read("KALKAN-1/" + name)).hexdigest() != digest:
                    raise SystemExit(f"Arşiv özeti uyuşmamaktadır: {name}")
        print(json.dumps({"path": str(args.output.resolve()), "bytes": args.output.stat().st_size,
                          "files": len(entries), "commit": commit, "tag": tag,
                          "sha256": hashlib.sha256(args.output.read_bytes()).hexdigest()}, indent=2))


if __name__ == "__main__":
    main()
