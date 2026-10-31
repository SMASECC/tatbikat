import base64
import json
import os
from pathlib import Path
import socket
import shutil
import subprocess
import sys
import tempfile
import time
import unittest
from unittest.mock import patch
import urllib.request

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from lab.red.common import persistence_program


class EntryPointExecutionTests(unittest.TestCase):
    def test_authorized_key_program_preserves_lines_and_is_repeatable(self):
        with tempfile.TemporaryDirectory() as directory:
            home=Path(directory);(home/'.ssh').mkdir();path=home/'.ssh/authorized_keys';path.write_text('ssh-ed25519 OLD legitimate')
            public=base64.b64encode(b'ssh-ed25519 NEW kalkan-persistence-test\n').decode()
            program=persistence_program(public)
            with patch('pathlib.Path.home',return_value=home):
                exec(program,{});exec(program,{})
            self.assertEqual(len(path.read_text().splitlines()),2)
            self.assertEqual(path.stat().st_mode&0o777,0o600)

    @unittest.skipUnless(os.geteuid()==0,'Non-root subprocess boundary test requires a root test controller')
    def test_http_command_injection_really_runs_in_a_low_privilege_process(self):
        with tempfile.TemporaryDirectory() as directory:
            folder=Path(directory);folder.chmod(0o755)
            profile=folder/'profile.json';profile.write_text(json.dumps({'lab_id':'KALKAN-1','profile':'exercise','run_id':'unit-test'}));profile.chmod(0o644)
            log=folder/'portal.jsonl';log.touch();log.chmod(0o600)
            try:os.chown(log,65534,65534)
            except OSError as error:self.skipTest('Çalışma ortamında ek kullanıcı UID eşlemesi yok: '+str(error.errno))
            package=folder/'lab';package.mkdir()
            for name in ('__init__.py','portal.py','common.py'):shutil.copy2(ROOT/'lab'/name,package/name)
            with socket.socket() as sock:sock.bind(('127.0.0.1',0));port=sock.getsockname()[1]
            process=subprocess.Popen([sys.executable,'-m','lab.portal','--port',str(port),'--profile',str(profile),'--log',str(log)],cwd=folder,
                                     user=65534,group=65534,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
            try:
                deadline=time.monotonic()+5
                while True:
                    try:
                        with urllib.request.urlopen(f'http://127.0.0.1:{port}/healthz',timeout=.3):break
                    except OSError:
                        if process.poll() is not None:raise RuntimeError(process.stderr.read().decode())
                        if time.monotonic()>deadline:raise RuntimeError('Test portal did not start')
                        time.sleep(.05)
                body=json.dumps({'filename':'data.csv >/dev/null; /usr/bin/id -u #'}).encode()
                req=urllib.request.Request(f'http://127.0.0.1:{port}/api/v1/validate',data=body,headers={'Content-Type':'application/json'})
                with urllib.request.urlopen(req) as response:result=json.load(response)
                self.assertEqual(result['stdout'].strip(),'65534')
                record=json.loads(log.read_text().splitlines()[-1]);self.assertEqual(record['euid'],65534)
            finally:
                process.terminate();process.wait(timeout=3);process.stderr.close()


if __name__=='__main__':unittest.main()
