"""Run on INT as the compromised lab svc-sync account, never directly on Kali."""
import argparse
import json
from pathlib import Path
from .common import load, request, write_private


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('step',choices=('session','position','mission','plc-measurement','plc-command','outage'))
    args=parser.parse_args()
    cfg=load('/etc/kalkan/integration/identity.json')
    session_path=Path.home()/'.local/share/kalkan/session.json'
    previous=load(session_path) if session_path.exists() else {}
    result=request(cfg['app_url']+'/api/v1/integrator/'+args.step,{},token=cfg['token'],ca=cfg['ca'],session=previous.get('session'))
    if 'session' in result:write_private(session_path,{'session':result['session'],'run_id':result['run_id']})
    print(json.dumps({key:value for key,value in result.items() if key!='session'}))


if __name__=='__main__':main()
