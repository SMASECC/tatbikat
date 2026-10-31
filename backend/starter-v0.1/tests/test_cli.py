import json
import os
from pathlib import Path
import secrets
import subprocess
import sys
import tempfile
import threading
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from engine import Engine
from server import Server


class CommandLineFlow(unittest.TestCase):
    def test_actual_red_and_blue_scripts_against_the_http_service(self):
        root=Path(__file__).resolve().parents[1]
        with tempfile.TemporaryDirectory() as folder:
            keys={r:secrets.token_urlsafe(36) for r in ("red","blue","white","viewer","operator")}
            path=Path(folder)/"keys.json";path.write_text(json.dumps(keys));path.chmod(0o600)
            engine=Engine(folder);server=Server(("127.0.0.1",0),engine,keys)
            thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
            env={**os.environ,"KALKAN_URL":f"http://127.0.0.1:{server.server_address[1]}","KALKAN_CREDENTIALS":str(path),"KALKAN_RED_SESSION_FILE":str(Path(folder)/"session.json")}
            def run(name,*args,ok=True):
                result=subprocess.run([sys.executable,str(root/"tools"/name),*args],env=env,text=True,capture_output=True,timeout=15)
                self.assertEqual(result.returncode==0,ok,result.stdout+result.stderr)
                return result.stdout
            try:
                run("red.py","run","--delay","0")
                self.assertEqual(engine.snapshot()["stage_index"],6)
                event=next(e for e in engine.snapshot()["events"] if e["event_type"]=="integrity.position_mismatch")
                run("blue.py","contain","--alert-id","TEST-ONLY","--rule-id","110102","--event-seq",str(event["event_seq"]),"--reason","CLI integration test")
                run("red.py","session",ok=False)
                run("blue.py","restore","--reason","Trusted records restored")
                self.assertTrue(engine.snapshot()["restored"])
                self.assertEqual(engine.snapshot()["regions"][0]["assets"][0]["drift"],0)
                output=run("blue.py","status");self.assertIn('"contained": true',output)
                old=engine.state["run_id"];run("white.py","reset")
                self.assertNotEqual(engine.state["run_id"],old)
            finally:
                server.shutdown();server.server_close();thread.join();engine.close()
