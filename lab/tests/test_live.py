import hashlib
import hmac
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
import ssl
import sys
import tempfile
import threading
import unittest

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from deploy import configuration
from lab.common import request
from lab.core import LabError
from lab.live_engine import LiveEngine
from lab.ot import Model,Handler
from lab.portal import validate_filename
from lab.firewall import render
from lab.app import Server
from urllib.error import HTTPError


class Clock:
    def __init__(self):self.value=1000.
    def __call__(self):return self.value


class IndependentAuthorityTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.tls=tempfile.TemporaryDirectory();cls.original=configuration.LOCAL;configuration.LOCAL=Path(cls.tls.name)
        configuration.initialize_secrets()
        configuration.certificate('OT-SIM-01','10.77.40.20');configuration.certificate('KKBS-APP-01','10.77.30.30')
        cls.pki=configuration.LOCAL/'pki'
        configuration.LOCAL=cls.original

    @classmethod
    def tearDownClass(cls):cls.tls.cleanup()

    def setUp(self):
        self.temp=tempfile.TemporaryDirectory();self.root=Path(self.temp.name);self.clock=Clock()
        self.model=Model(self.root/'ot',clock=self.clock)
        self.server=ThreadingHTTPServer(('127.0.0.1',0),Handler);self.server.engine=self.model;self.server.token='test-ot-key'
        context=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(self.pki/'OT-SIM-01.crt',self.pki/'OT-SIM-01.key')
        context.load_verify_locations(self.pki/'ca.crt');context.verify_mode=ssl.CERT_REQUIRED
        self.server.socket=context.wrap_socket(self.server.socket,server_side=True)
        self.thread=threading.Thread(target=self.server.serve_forever,daemon=True);self.thread.start()
        profile=self.root/'profile.json';profile.write_text(json.dumps({'profile':'exercise'}))
        self.config={'runtime':str(self.root/'app'),'log_path':str(self.root/'events.jsonl'),'ot_url':f'https://127.0.0.1:{self.server.server_port}',
                     'ot_token':'test-ot-key','evidence_key':'test-evidence-key','ca':str(self.pki/'ca.crt'),
                     'client_cert':str(self.pki/'KKBS-APP-01.crt'),'client_key':str(self.pki/'KKBS-APP-01.key'),'profile_path':str(profile)}
        self.app=LiveEngine(self.config,clock=self.clock);self.app.reset()

    def tearDown(self):
        self.app.close();self.server.shutdown();self.thread.join();self.server.server_close();self.model.close();self.temp.cleanup()

    def advance(self,seconds=1):
        self.clock.value+=seconds;self.model.tick();self.app.tick()

    def red_to(self,last):
        result=self.app.red('session',None,'10.77.30.20');session=result['session']
        for step in ['position','mission','plc-measurement','plc-command','outage']:
            self.app.red(step,session,'10.77.30.20')
            self.advance()
            if step==last:break
        return session

    def contain(self):
        receipt={'run_id':self.app.state['run_id'],'verified_at':self.clock(),'alert_id':'synthetic-unit-test-only','rule_id':110213,'alert_sha256':'a'*64}
        signature=hmac.new(b'test-evidence-key',json.dumps(receipt,sort_keys=True,separators=(',',':')).encode(),hashlib.sha256).hexdigest()
        return self.app.blue('contain',{'reason':'Unit test receipt','host_receipt':receipt,'signature':signature})

    def test_mutual_tls_and_shared_run_deliver_31_sources(self):
        result=self.app.snapshot();self.assertTrue(result['reference_connected'])
        self.assertEqual(sum(len(r['assets']) for r in result['regions']),27);self.assertEqual(len(result['plants']),4)
        self.assertEqual(self.model.state['run_id'],result['run_id'])

    def test_actual_http_api_rejects_viewer_write_and_accepts_stolen_service_identity(self):
        server=Server(('127.0.0.1',0),self.app,{'viewer':'v'*64,'integrator':'i'*64,'white':'w'*64,'blue':'b'*64,'operator':'o'*64})
        worker=threading.Thread(target=server.serve_forever,daemon=True);worker.start()
        url=f'http://127.0.0.1:{server.server_port}'
        try:
            with self.assertRaises(HTTPError) as caught:request(url+'/api/v1/integrator/session',{},token='v'*64)
            self.assertEqual(caught.exception.code,403)
            result=request(url+'/api/v1/integrator/session',{},token='i'*64)
            self.assertTrue(result['ok']);self.assertIn('session',result)
            read=request(url+'/api/v1/snapshot',token='v'*64)
            self.assertEqual(read['stage_index'],1)
        finally:server.shutdown();worker.join();server.server_close()

    def test_ot_rejects_a_client_without_a_certificate(self):
        with self.assertRaises(Exception):request(self.config['ot_url']+'/reference',token='test-ot-key',ca=self.config['ca'])

    def test_position_overlay_does_not_change_independent_truth(self):
        self.red_to('position');asset=self.app.snapshot()['regions'][0]['assets'][0]
        self.assertEqual(asset['drift'],650)
        self.assertAlmostEqual(asset['reported']['x']-asset['truth']['x'],130)
        self.assertEqual(self.model.snapshot()['regions'][0]['assets'][0]['drift'],0)

    def test_hmi_bias_does_not_change_independent_measurement(self):
        self.red_to('plc-measurement')
        self.assertAlmostEqual(self.app.snapshot()['plants']['guneyova']['bias'],30)
        self.assertEqual(self.model.snapshot()['plants']['guneyova']['bias'],0)

    def test_invalid_session_cannot_change_the_ot_model(self):
        self.red_to('plc-measurement')
        with self.assertRaises(LabError):self.app.red('plc-command','wrong-session','10.77.30.20')
        self.assertEqual(self.model.state['plants']['guneyova']['valve'],70)

    def test_process_command_reaches_the_separate_authority(self):
        self.red_to('plc-command');self.assertEqual(self.model.state['plants']['guneyova']['valve'],15)
        before=self.model.state['plants']['guneyova']['local_temp'];self.advance(2)
        self.assertGreater(self.model.state['plants']['guneyova']['local_temp'],before)

    def test_loss_freezes_reported_position_while_reference_continues(self):
        self.red_to('outage');first=self.app.snapshot()['regions'][0]['assets'][0]
        self.advance(2);second=self.app.snapshot()['regions'][0]['assets'][0]
        self.assertEqual(first['reported'],second['reported']);self.assertNotEqual(first['truth'],second['truth'])

    def test_drone_model_marks_loss_and_preserves_it_until_new_run(self):
        self.red_to('outage');self.advance(5)
        drone=next(a for a in self.app.snapshot()['regions'][0]['assets'] if a['id']=='KR-VTOL-01')
        self.assertTrue(drone['destroyed']);self.contain();self.app.blue('restore',{'reason':'test restore'});self.advance()
        self.assertIsNotNone(self.model.state.get('drone_impact'))
        self.app.reset();self.assertIsNone(self.model.state.get('drone_impact'))

    def test_containment_does_not_erase_damage(self):
        session=self.red_to('mission');self.contain()
        self.assertEqual(self.app.state['position_offset_m'],650)
        with self.assertRaises(LabError):self.app.red('plc-measurement',session,'10.77.30.20')

    def test_unsigned_wazuh_claim_is_rejected(self):
        with self.assertRaises(LabError):self.app.blue('contain',{'reason':'test','host_receipt':{'run_id':self.app.state['run_id']},'signature':'forged'})
        self.assertFalse(self.app.state['contained'])

    def test_stale_reference_is_not_presented_as_new_telemetry(self):
        original=self.app.ot
        def unavailable(*args,**kwargs):raise LabError(503,'offline')
        self.app.ot=unavailable;self.clock.value+=4;self.app.tick()
        result=self.app.snapshot();self.assertFalse(result['reference_connected']);self.assertTrue(result['plants']['guneyova']['offline'])
        self.assertFalse(result['verify_ready']);self.app.ot=original

    def test_normal_profile_rejects_integrator_mutations(self):
        Path(self.config['profile_path']).write_text(json.dumps({'profile':'normal'}))
        with self.assertRaises(LabError):self.app.red('session',None,'10.77.30.20')


class PortalAndPolicyTests(unittest.TestCase):
    def test_deliberate_flaw_executes_a_harmless_os_command(self):
        result=validate_filename('file.csv >/dev/null; printf KALKAN_REAL_SHELL #','exercise')
        self.assertEqual(result.stdout,'KALKAN_REAL_SHELL');self.assertEqual(result.returncode,0)

    def test_patched_profile_rejects_the_same_injection(self):
        with self.assertRaises(ValueError):validate_filename('file.csv; id #','restored')

    def test_patched_service_preserves_legitimate_filename_validation(self):
        self.assertEqual(validate_filename('sensor_01.csv','normal').stdout,'sensor_01.csv')

    def test_no_general_icmp_forwarding_or_management_escape(self):
        normal=render('FW-01','normal')
        forward=normal.split('chain forward')[1]
        self.assertNotIn('ip protocol icmp accept',forward)
        self.assertNotIn('tcp dport { 11601 }',normal)

    def test_fw_agent_uses_its_soc_interface(self):
        self.assertIn('10.77.50.1',render('WAZUH-01'))

    def test_maintenance_does_not_grant_red_access_to_management(self):
        self.assertIn('ip daddr != { 10.77.0.0/16, 198.18.60.0/24 }',render('FW-01',maintenance=True))


if __name__=='__main__':unittest.main()
