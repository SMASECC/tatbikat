#!/usr/bin/env python3
"""Synthetic decoder/rule tests on the actual manager; never produce a real incident."""
from pathlib import Path
import subprocess
import sys

tool=Path('/var/ossec/bin/wazuh-logtest')
if not tool.exists():raise SystemExit('Bu test Wazuh manager üzerinde çalıştırılmalıdır.')
cases=[
 ('110201:8:json','{"app":"kalkan_lab","event_type":"portal.validation","run_id":"SYNTHETIC-LOGTEST-ONLY"}'),
 ('110113:12:json','{"app":"kalkan1","event_type":"telemetry.reference_timeout","run_id":"SYNTHETIC-LOGTEST-ONLY"}'),
 ('110221:10:kalkan-network','Oct 31 12:00:00 fw-01 kernel: K1_NET_ALLOW IN=ens19 OUT=ens23 SRC=10.77.20.20 DST=198.18.60.20 LEN=60 PROTO=TCP SPT=43320 DPT=11601'),
 ('110222:10:kalkan-network','Oct 31 12:00:01 fw-01 kernel: K1_NET_ALLOW IN=ens19 OUT=ens20 SRC=10.77.20.20 DST=10.77.30.20 LEN=60 PROTO=TCP SPT=43321 DPT=22')]
for expected,line in cases:
    result=subprocess.run([str(tool),'-q','-U',expected],input=line+'\n',text=True,capture_output=True,timeout=20)
    if result.returncode:
        print(result.stdout,result.stderr);raise SystemExit('FAIL logtest: '+expected)
print('PASS: 4 synthetic rule/decoder checks. This is not live attack or agent-delivery proof.')
