"""Normal INT worker pulls DMZ health; its separate APP credential is the lab target."""
import argparse
import time
from .common import load, request, append_log


def main():
    parser=argparse.ArgumentParser(); parser.add_argument('--config',default='/etc/kalkan/integration/identity.json')
    cfg=load(parser.parse_args().config)
    while True:
        try:
            feed=request(cfg['portal_url']+'/feed',ca=cfg['ca'])
            result=request(cfg['app_url']+'/api/v1/integration/pulse',{'portal_time':feed['server_time'],'portal_execution_at':feed.get('last_execution_at'),'run_id':feed.get('run_id')},token=cfg['token'],ca=cfg['ca'])
            append_log(cfg['log_path'],'integration.pulse',actor='svc-sync',outcome='success',portal_time=feed['server_time'])
        except (OSError,ValueError,KeyError):
            append_log(cfg['log_path'],'integration.pulse',actor='svc-sync',outcome='failed')
        time.sleep(10)


if __name__=='__main__':main()
