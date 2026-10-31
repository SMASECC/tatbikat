#!/usr/bin/env python3
"""Generate deterministic logtest fixtures from real Engine operations, not fabricated alerts."""
import json
from pathlib import Path
import sys
import tempfile
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from engine import Engine,RED_STEPS,RULES,ROOT

with tempfile.TemporaryDirectory() as folder:
    now=[1700000000.0]
    lab=Engine(folder,clock=lambda:now[0]);session=None
    for step in RED_STEPS:
        result=lab.red(step,session,"10.77.20.50");session=result.get("session",session)
    for _ in range(8):now[0]+=.5;lab.tick()
    event=next(e for e in lab.snapshot()["events"] if e["event_type"]=="integrity.position_mismatch")
    lab.blue("contain",{"reason":"Örnek alarm incelemesi","alert":{"alert_id":"FIXTURE-REFERENCE-ONLY","rule_id":110102,"event_seq":event["event_seq"]}})
    lab.blue("restore",{"reason":"Örnek geri yükleme"})
    for _ in range(120):now[0]+=.5;lab.tick()
    lab.blue("verify",{"reason":"Örnek doğrulama"})
    lab.deny("lab-command-user","Kilit sonrası örnek ret")
    lab.operator("karatepe",{"settings":{"valve":65}})
    lab.close()
    events=[json.loads(line) for line in (Path(folder)/"events.jsonl").read_text().splitlines()]
    selected={}
    for event in events:
        kind=event["event_type"]
        if kind in RULES and kind not in selected:selected[kind]=event
    assert set(selected)==set(RULES)
    (ROOT/"wazuh/fixtures.jsonl").write_text(''.join(json.dumps(e,ensure_ascii=False)+"\n" for e in selected.values()))
    (ROOT/"wazuh/expected.json").write_text(json.dumps([{ "line":i+1,"rule_id":RULES[e["event_type"]],"event_type":e["event_type"]} for i,e in enumerate(selected.values())],indent=2))
    print("12 Engine kaynaklı Wazuh test örneği üretildi.")
