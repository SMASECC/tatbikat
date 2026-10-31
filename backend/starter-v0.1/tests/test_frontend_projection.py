import json
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from engine import Engine, RED_STEPS


class FrontendProjection(unittest.TestCase):
    @unittest.skipUnless(shutil.which("node"),"Node yok; sunucuya bağlı frontend projeksiyon testi atlandı")
    def test_server_packets_reach_existing_instruments(self):
        now=[1700000000.0]
        with tempfile.TemporaryDirectory() as folder:
            lab=Engine(folder,clock=lambda:now[0]);snapshots={"normal":lab.snapshot()};session=None
            for step in RED_STEPS:
                result=lab.red(step,session,"10.77.20.50");session=result.get("session",session)
                if step in ("position","plc-command","outage"):snapshots[{"plc-command":"command"}.get(step,step)]=lab.snapshot()
            event=next(e for e in lab.snapshot()["events"] if e["event_type"]=="integrity.position_mismatch")
            lab.blue("contain",{"reason":"Test","alert":{"alert_id":"TEST","rule_id":110102,"event_seq":event["event_seq"]}})
            snapshots["contained"]=lab.snapshot()
            lab.blue("restore",{"reason":"Test"});snapshots["restored"]=lab.snapshot()
            for _ in range(40):now[0]+=.5;lab.tick()
            lab.blue("verify",{"reason":"Test"});snapshots["recovered"]=lab.snapshot();lab.close()
            target=Path(folder)/"snapshots.json";target.write_text(json.dumps(snapshots))
            subprocess.run(["node",str(Path(__file__).with_name("test_frontend.cjs")),str(target)],check=True,timeout=20)
