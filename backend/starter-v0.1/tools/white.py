#!/usr/bin/env python3
import argparse
import json
from client import request

parser=argparse.ArgumentParser(description="WHITE yeni tur yönetimi")
parser.add_argument("action",choices=("reset",))
args=parser.parse_args()
try: print(json.dumps(request("white","/api/v1/white/reset",{}),ensure_ascii=False,indent=2))
except (RuntimeError,OSError,ValueError) as exc: parser.exit(1,str(exc)+"\n")
