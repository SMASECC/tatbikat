#!/usr/bin/env python3
"""Read REAL Wazuh alerts.json from stdin. Display references; never auto-execute."""
import argparse
import json
import shlex
import sys


def render(alert, run_id=None):
    data=alert.get("data",{}); rule=alert.get("rule",{})
    if not isinstance(data,dict) or not isinstance(rule,dict):return None
    if data.get("app")!="kalkan1" or run_id and data.get("run_id")!=run_id: return None
    try: rule_id=int(rule["id"]); event_seq=int(data["event_seq"])
    except (ValueError,TypeError,KeyError): return None
    if not 110101<=rule_id<=110112: return None
    alert_id=str(alert.get("id",""))
    if not alert_id or len(alert_id)>150 or any(ord(c)<32 for c in alert_id): return None
    text=f"WAZUH {alert_id} | kural {rule_id} | olay {event_seq} | run_id={data.get('run_id','')} | {data.get('event_type','')}"
    text="".join(c if ord(c)>=32 else " " for c in text)
    if rule_id in (110101,110102,110103,110104,110105,110106,110110):
        text += "\n  Müdahale adayı: python3 tools/blue.py contain --alert-id "+shlex.quote(alert_id)+f" --rule-id {rule_id} --event-seq {event_seq} --reason 'Wazuh alarmı incelendi; oturum iptali ve uzak yazma kilidi'"
    elif rule_id==110107: text+="\n  Sonraki: bağımsız kayıtları kontrol et; python3 tools/blue.py restore --reason 'Güvenilir görev ve proses reçetesi geri yüklendi'"
    elif rule_id==110108: text+="\n  Sonraki: python3 tools/blue.py verify --wait --reason 'Bağlantı, bütünlük ve hizmet kararlı olarak doğrulandı'"
    elif rule_id==110109: text+="\n  Tur doğrulandı. Alarm ve olay kanıtını sakla."
    return text


def main():
    parser=argparse.ArgumentParser(description="Wazuh alerts.json akışında KALKAN olaylarını izle")
    parser.add_argument("--run-id")
    args=parser.parse_args(); seen=set()
    for line in sys.stdin:
        if len(line)>1024*1024: continue
        try: alert=json.loads(line)
        except ValueError: continue
        if not isinstance(alert,dict): continue
        key=alert.get("id")
        if not isinstance(key,str) or key in seen: continue
        output=render(alert,args.run_id)
        if output:
            seen.add(key)
            if len(seen)>10000: seen={key}
            print(output,flush=True)


if __name__=="__main__":main()
