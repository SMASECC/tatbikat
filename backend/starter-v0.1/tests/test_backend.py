import http.client
import json
from pathlib import Path
import secrets
import sys
import tempfile
import threading
import unittest

sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from engine import Engine, LabError, RED_STEPS, RULES
from server import Server


class Clock:
    def __init__(self):self.now=1700000000.0
    def __call__(self):return self.now
    def advance(self,engine,seconds):
        for _ in range(seconds*2):self.now+=.5;engine.tick()


class LabTest(unittest.TestCase):
    def setUp(self):
        self.directory=tempfile.TemporaryDirectory();self.clock=Clock()
        self.lab=Engine(self.directory.name,clock=self.clock)
    def tearDown(self):self.lab.close();self.directory.cleanup()
    def red_until(self,n):
        session=None
        for step in RED_STEPS[:n]:
            result=self.lab.red(step,session,"10.77.20.50")
            session=result.get("session",session)
        return session
    def contain(self):
        event=next(e for e in self.lab.snapshot()["events"] if e["event_type"] in ("integrity.position_mismatch","auth.session_opened"))
        return self.lab.blue("contain",{"reason":"Alarm incelendi", "alert":{"alert_id":"wazuh-test-reference", "rule_id":RULES[event["event_type"]],"event_seq":event["event_seq"]}})

    def test_source_count_and_live_coordinates(self):
        a=self.lab.snapshot();self.clock.advance(self.lab,2);b=self.lab.snapshot()
        self.assertEqual(sum(len(r["assets"]) for r in a["regions"]),27)
        self.assertEqual(len(a["plants"]),4)
        self.assertNotEqual(a["regions"][0]["assets"][0]["coord"],b["regions"][0]["assets"][0]["coord"])
        self.assertEqual(a["regions"][0]["assets"][0]["coord"],a["regions"][0]["assets"][0]["refCoord"])

    def test_mutation_is_separate_from_truth(self):
        self.red_until(3);a=self.lab.snapshot()["regions"][0]["assets"][0]
        self.assertEqual(a["reported"]["x"]-a["truth"]["x"],130)
        self.assertEqual(a["drift"],650);self.assertTrue(a["orderChanged"])
        self.assertNotEqual(a["coord"],a["refCoord"])

    def test_sequence_and_session(self):
        with self.assertRaises(LabError):self.lab.red("position","","x")
        self.lab.red("session","","x")
        with self.assertRaises(LabError):self.lab.red("position","wrong","x")
        self.assertEqual(self.lab.state["position_offset_m"],0)

    def test_plc_process_responds_to_attack(self):
        self.red_until(5);self.clock.advance(self.lab,30)
        p=self.lab.snapshot()["plants"]["guneyova"]
        self.assertAlmostEqual(p["shown"]-p["actual"],30)
        self.assertEqual(p["valve"],15);self.assertGreater(p["temp"],75)
        self.assertLess(p["service"],27)

    def test_outage_freezes_hmi_and_field_but_not_local_reference(self):
        self.red_until(6);a=self.lab.snapshot();self.clock.advance(self.lab,10);b=self.lab.snapshot()
        self.assertNotIn("telemetry.link_timeout",a["active_findings"])
        self.assertIn("telemetry.link_timeout",b["active_findings"])
        self.assertEqual(a["plants"]["guneyova"]["shown"],b["plants"]["guneyova"]["shown"])
        self.assertEqual(a["plants"]["guneyova"]["branchServices"],b["plants"]["guneyova"]["branchServices"])
        self.assertNotEqual(a["plants"]["guneyova"]["actual"],b["plants"]["guneyova"]["actual"])
        self.assertEqual(a["regions"][0]["assets"][0]["coord"],b["regions"][0]["assets"][0]["coord"])
        self.assertGreater(b["plants"]["guneyova"]["age"],a["plants"]["guneyova"]["age"])

    def test_containment_blocks_writes_without_hiding_existing_damage(self):
        session=self.red_until(3);self.contain();s=self.lab.snapshot()
        self.assertTrue(s["contained"]);self.assertEqual(s["regions"][0]["assets"][0]["drift"],650)
        with self.assertRaises(LabError):self.lab.red("plc-measurement",session,"x")
        self.assertIsNone(self.lab.state["session_hash"])

    def test_restore_and_verify_require_real_stable_dwell(self):
        self.red_until(6);self.clock.advance(self.lab,30);self.contain()
        self.lab.blue("restore",{"reason":"Güvenilir kayıtlar yüklendi"})
        with self.assertRaises(LabError):self.lab.blue("verify",{"reason":"Kontrol"})
        self.clock.advance(self.lab,60)
        self.assertTrue(self.lab.snapshot()["verify_ready"])
        self.lab.blue("verify",{"reason":"Kararlılık kontrol edildi"})
        self.assertEqual(self.lab.snapshot()["stage_index"],9)

    def test_restore_before_contain_and_wrong_alarm_rejected(self):
        self.red_until(1)
        with self.assertRaises(LabError):self.lab.blue("restore",{"reason":"Yanlış sıra"})
        with self.assertRaises(LabError):self.lab.blue("contain",{"reason":"Yanlış referans","alert":{"alert_id":"x","rule_id":110104,"event_seq":1}})
        self.assertFalse(self.lab.snapshot()["contained"])

    def test_operator_affects_process_without_erasing_bias(self):
        self.red_until(4)
        self.lab.operator("guneyova",{"settings":{"pumps":[True,True,False,True,True,True]}})
        self.clock.advance(self.lab,40);p=self.lab.snapshot()["plants"]["guneyova"]
        self.assertLess(p["flow"],.01);self.assertAlmostEqual(p["bias"],30)
        self.assertTrue(p["operatorControlled"])
        with self.assertRaises(LabError):self.lab.operator("guneyova",{"settings":{"driveHz":200}})

    def test_restart_preserves_state_audit_and_reset_keeps_old_evidence(self):
        self.red_until(2);old=self.lab.state["run_id"]
        self.lab.close();self.lab=Engine(self.directory.name,clock=self.clock)
        self.assertEqual(self.lab.state["run_id"],old);self.assertEqual(self.lab.state["position_offset_m"],650)
        self.lab.reset();self.assertNotEqual(self.lab.state["run_id"],old)
        logs=[json.loads(line) for line in (Path(self.directory.name)/"events.jsonl").read_text().splitlines()]
        self.assertTrue(any(e["run_id"]==old for e in logs))
        self.assertEqual(len({e["event_seq"] for e in logs}),len(logs))
        self.assertNotIn("session_hash",json.dumps(logs))


class HttpTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.directory=tempfile.TemporaryDirectory();cls.engine=Engine(cls.directory.name)
        cls.keys={r:secrets.token_urlsafe(36) for r in ("red","blue","white","viewer","operator")}
        cls.server=Server(("127.0.0.1",0),cls.engine,cls.keys)
        cls.thread=threading.Thread(target=cls.server.serve_forever,daemon=True);cls.thread.start()
    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown();cls.server.server_close();cls.thread.join();cls.engine.close();cls.directory.cleanup()
    def call(self,path,role=None,body=None,headers=None):
        connection=http.client.HTTPConnection("127.0.0.1",self.server.server_address[1],timeout=5)
        hdr={"Content-Type":"application/json",**(headers or {})}
        if role:hdr["Authorization"]="Bearer "+self.keys[role]
        raw=json.dumps(body) if body is not None else None
        connection.request("POST" if raw is not None else "GET",path,raw,hdr)
        response=connection.getresponse();data=response.read();result=response.status,dict(response.getheaders()),data
        connection.close();return result
    def test_role_isolation(self):
        self.assertEqual(self.call("/api/v1/snapshot")[0],401)
        self.assertEqual(self.call("/api/v1/snapshot","viewer")[0],200)
        self.assertEqual(self.call("/api/v1/red/session","viewer",{})[0],403)
        self.assertEqual(self.call("/api/v1/white/reset","red",{})[0],403)
        self.assertEqual(self.call("/api/v1/operator/guneyova","blue",{"settings":{}})[0],403)
    def test_private_paths_are_not_served(self):
        for path in ("/runtime/credentials.json","/../engine.py","/config/world.json"):
            self.assertEqual(self.call(path,"white")[0],404)
        status,headers,data=self.call("/","viewer")
        self.assertEqual(status,200);self.assertIn(b"function liveFeed",data)
        self.assertNotIn(self.keys["white"].encode(),data)
    def test_cookie_mutation_requires_same_origin(self):
        import urllib.parse
        connection=http.client.HTTPConnection("127.0.0.1",self.server.server_address[1],timeout=5)
        raw=urllib.parse.urlencode({"role":"operator","token":self.keys["operator"]})
        connection.request("POST","/api/v1/login",raw,{"Content-Type":"application/x-www-form-urlencoded"})
        response=connection.getresponse();cookie=response.getheader("Set-Cookie").split(";",1)[0];response.read();connection.close()
        self.assertEqual(self.call("/api/v1/operator/guneyova",body={"settings":{}},headers={"Cookie":cookie})[0],403)
        host="127.0.0.1:"+str(self.server.server_address[1])
        self.assertEqual(self.call("/api/v1/operator/guneyova",body={"settings":{}},headers={"Cookie":cookie,"Origin":"http://"+host})[0],200)
    def test_non_finite_and_bad_body_rejected(self):
        self.assertEqual(self.call("/api/v1/operator/guneyova","operator",{"settings":{"heat":float('nan')}})[0],400)
        self.assertEqual(self.call("/api/v1/operator/guneyova","operator",[1,2])[0],400)


if __name__=="__main__":unittest.main(verbosity=2)
