#!/usr/bin/env python3
import argparse
import time
from common import RedLab

parser=argparse.ArgumentParser(description='KALKAN-1 gerçek lab erişim zinciri ve sanal saha etkileri')
parser.add_argument('--delay',type=float,default=30,help='Etki aşamaları arasındaki anlatım süresi')
parser.add_argument('--interactive',action='store_true')
args=parser.parse_args()
if not 0<=args.delay<=300:parser.error('delay 0–300 saniye olmalıdır')
lab=RedLab()
for number in range(1,12):
    if args.interactive:input(f'{number:02}: Wazuh gözlemcisi hazırsa Enter...')
    lab.run(number)
    if number>=6 and number<11 and not args.interactive:time.sleep(args.delay)
