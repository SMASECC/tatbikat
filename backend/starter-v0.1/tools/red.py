#!/usr/bin/env python3
"""Controlled effects on the KALKAN lab API; no shell execution on any target."""
import argparse
import json
import os
from pathlib import Path
import time
from client import request

STEPS=("session","position","mission","plc-measurement","plc-command","outage")
session_file=Path(os.environ.get("KALKAN_RED_SESSION_FILE",str(Path(__file__).resolve().parents[1]/"runtime/red-session.json")))


def step(name):
    saved=json.loads(session_file.read_text()) if session_file.exists() else {}
    result=request("red","/api/v1/red/"+name,{},saved.get("session"))
    if "session" in result:
        session_file.parent.mkdir(mode=0o700,parents=True,exist_ok=True)
        fd=os.open(session_file,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
        with os.fdopen(fd,"w") as handle: json.dump(result,handle)
    print(f"Uygulandı: {name} / run_id={result['run_id']}",flush=True)


def main():
    parser=argparse.ArgumentParser(description="KALKAN kırmızı takım lab adımları")
    parser.add_argument("step",choices=(*STEPS,"run"))
    parser.add_argument("--delay",type=float,help="run adımları arasında saniye; verilmezse her adım Enter bekler")
    args=parser.parse_args()
    if args.delay is not None and not 0<=args.delay<=300: parser.error("delay 0–300 saniye olmalı")
    try:
        if args.step!="run": step(args.step); return
        for name in STEPS:
            if args.delay is None: input(f"{name}: Wazuh gözlemcisi hazırsa Enter ile uygula...")
            step(name)
            if args.delay is not None: time.sleep(args.delay)
    except (RuntimeError,OSError,ValueError,EOFError) as exc: parser.exit(1,str(exc)+"\n")


if __name__=="__main__":main()
