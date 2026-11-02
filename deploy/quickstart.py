#!/usr/bin/env python3
"""Proxmox-only installation entrypoint; never starts an exercise automatically."""
import argparse
import fcntl
import json
import os
from pathlib import Path
import subprocess
import sys
import time

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))
from deploy import host
from lab.common import write_private


def execute(command):
    print("\n> " + " ".join(map(str, command)), flush=True)
    subprocess.run(command, cwd=ROOT, check=True)


def preflight():
    topology = json.loads((ROOT / "infra/topology.json").read_text())
    facts = host.facts()
    host.preflight(topology, facts)
    print(json.dumps(facts, ensure_ascii=False, indent=2), flush=True)
    print("Ön kontrol geçti: 8 VM / 7 özel ağ. Fiziksel yönetim bağlantısı korunur.", flush=True)
    return facts


def verify_services(timeout=300):
    deadline = time.monotonic() + timeout
    while True:
        try:
            execute([sys.executable, "deploy/kalkan.py", "check"])
            return
        except subprocess.CalledProcessError:
            if time.monotonic() >= deadline:
                raise
            print("Servis/ajan hazır olması bekleniyor; en fazla 300 saniye.", flush=True)
            time.sleep(10)


def setup(community_repo=False, reconfigure=False):
    # Read-only checks precede APT, VM, bridge and firewall changes.
    preflight()
    complete = ROOT / '.local/install-complete.json'
    if complete.exists() and not reconfigure:
        print('Önceki kurulum korunuyor; mevcut tur sıfırlanmadan servis kabulü çalıştırılıyor.', flush=True)
        verify_services()
        return
    execute([sys.executable, "deploy/bootstrap.py"] + (["--community-repo"] if community_repo else []))
    execute([sys.executable, "deploy/kalkan.py", "install"])
    verify_services()
    write_private(complete, {'status': 'passed', 'scope': 'deployed_services_only', 'completed_at': time.time()})
    print("\nKURULUM VE SERVİS KABULÜ GEÇTİ. Tam kırmızı/mavi takım provası henüz yapılmadı.", flush=True)
    print("Erişim: python3 deploy/kalkan.py access\nRol anahtarları: python3 deploy/kalkan.py credentials", flush=True)
    print("Yeni tur ayrıca başlatılır: python3 deploy/kalkan.py new-run", flush=True)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--community-repo", action="store_true", help="Aboneliksiz lab hostunda enterprise depolarını yedekleyip no-subscription seçer.")
    parser.add_argument("--preflight-only", action="store_true", help="Salt okunur host/kaynak/ağ kontrolü; kurulum yapmaz.")
    parser.add_argument("--reconfigure", action="store_true", help="Mevcut kurulumu yeniden uygular ve labı normal profile sıfırlar; kanıtlar korunur.")
    args = parser.parse_args()
    if args.preflight_only:
        preflight()
        return
    # A fixed host-wide lock also protects against a second checkout's installer.
    if os.geteuid() != 0 or not Path("/etc/pve").is_dir():
        raise RuntimeError("Proxmox host Shell üzerinde root olarak çalıştırın.")
    with open("/run/lock/kalkan-install.lock", "w") as lock:
        try:
            fcntl.flock(lock, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            raise RuntimeError("Başka bir KALKAN kurulumu çalışıyor; ikinci kurulum başlatılmadı.") from None
        setup(args.community_repo, args.reconfigure)


if __name__ == "__main__":
    try:
        main()
    except (RuntimeError, OSError, ValueError, subprocess.CalledProcessError) as error:
        print("KURULUM BAŞARISIZ: " + str(error), file=sys.stderr)
        print("Hata düzeltilince aynı checkout'ta install.sh yeniden çalıştırılabilir. .local korunmalıdır.", file=sys.stderr)
        sys.exit(error.returncode if isinstance(error, subprocess.CalledProcessError) else 1)
