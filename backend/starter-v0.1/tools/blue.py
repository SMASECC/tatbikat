#!/usr/bin/env python3
import argparse
import json
import time
from client import request


def main():
    parser=argparse.ArgumentParser(description="Wazuh alarmından sonra lab müdahalesi")
    parser.add_argument("action",choices=("status","contain","restore","verify"))
    parser.add_argument("--reason",default="")
    parser.add_argument("--alert-id")
    parser.add_argument("--rule-id",type=int)
    parser.add_argument("--event-seq",type=int)
    parser.add_argument("--wait",action="store_true",help="verify koşullarını en fazla 180 sn bekle")
    args=parser.parse_args()
    try:
        if args.action=="status":
            s=request("blue","/api/v1/snapshot")
            print(json.dumps({k:s[k] for k in ("run_id","stage_index","active_findings","contained","restored","verify_ready","stable_for")},ensure_ascii=False,indent=2));return
        if not args.reason.strip(): parser.error("--reason gerekli")
        body={"reason":args.reason}
        if args.action=="contain":
            if not all((args.alert_id,args.rule_id,args.event_seq)): parser.error("contain için --alert-id --rule-id --event-seq gerekli")
            body["alert"]={"alert_id":args.alert_id,"rule_id":args.rule_id,"event_seq":args.event_seq}
        if args.action=="verify" and args.wait:
            deadline=time.monotonic()+180
            while not request("blue","/api/v1/snapshot")["verify_ready"]:
                if time.monotonic()>=deadline: raise RuntimeError("Doğrulama süresi doldu; status ile açık bulguları incele")
                time.sleep(1)
        print(json.dumps(request("blue","/api/v1/blue/"+args.action,body),ensure_ascii=False,indent=2))
    except (RuntimeError,OSError,ValueError) as exc: parser.exit(1,str(exc)+"\n")


if __name__=="__main__": main()
