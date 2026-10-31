#!/usr/bin/env python3
"""Generate per-install role keys. Never overwrite an existing credential set."""
import argparse
import json
import os
from pathlib import Path
import secrets

parser=argparse.ArgumentParser()
parser.add_argument("--runtime",default=str(Path(__file__).resolve().parents[1]/"runtime"))
args=parser.parse_args()
root=Path(args.runtime); root.mkdir(mode=0o700,parents=True,exist_ok=True)
target=root/"credentials.json"
if target.exists():
    print("Rol anahtarları mevcut; değiştirilmedi.")
else:
    fd=os.open(target,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
    with os.fdopen(fd,"w") as handle:
        json.dump({role:secrets.token_urlsafe(36) for role in ("white","red","blue","viewer","operator")},handle,indent=2)
    print("Kuruluma özel beş rol anahtarı oluşturuldu. runtime/credentials.json")
