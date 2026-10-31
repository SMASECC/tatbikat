#!/usr/bin/env python3
"""Run on a manager after installing rules. Fails if the actual Wazuh engine disagrees."""
import json
from pathlib import Path
import subprocess
import sys
import xml.etree.ElementTree as ET

root=Path(__file__).resolve().parents[1]
tool=Path("/var/ossec/bin/wazuh-logtest")
if not tool.is_file():sys.exit("Wazuh manager üzerinde çalıştır: /var/ossec/bin/wazuh-logtest bulunamadı.")
rules={r.attrib["id"]:r.attrib["level"] for r in ET.parse(root/"wazuh/kalkan_rules.xml").getroot()}
logs=(root/"wazuh/fixtures.jsonl").read_text().splitlines()
for expected in json.loads((root/"wazuh/expected.json").read_text()):
    rule=str(expected["rule_id"])
    result=subprocess.run([str(tool),"-q","-U",f"{rule}:{rules[rule]}:json"],input=logs[expected["line"]-1]+"\n",text=True,capture_output=True,timeout=20)
    if result.returncode:print(result.stdout,result.stderr);sys.exit(f"Kural doğrulanamadı: {rule}")
    print(f"PASS {rule} / {expected['event_type']}")
