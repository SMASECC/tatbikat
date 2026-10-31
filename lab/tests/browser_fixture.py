"""Loopback-only development fixture; generated credentials die with this process."""
from http.server import ThreadingHTTPServer
import json
from pathlib import Path
import secrets
import sys
import tempfile
import threading
import time

ROOT=Path(__file__).resolve().parents[2]
sys.path.insert(0,str(ROOT))
from lab.ot import Model,Handler
from lab.app import Server
from lab.live_engine import LiveEngine

temporary=tempfile.TemporaryDirectory();directory=Path(temporary.name)
model=Model(directory/'ot')
ot=ThreadingHTTPServer(('127.0.0.1',0),Handler);ot.engine=model;ot.token=secrets.token_urlsafe(48)
threading.Thread(target=ot.serve_forever,daemon=True).start()
profile=directory/'profile.json';profile.write_text(json.dumps({'profile':'exercise'}))
cfg={'runtime':str(directory/'app'),'log_path':str(directory/'events.jsonl'),'ot_url':f'http://127.0.0.1:{ot.server_port}',
     'ot_token':ot.token,'evidence_key':secrets.token_urlsafe(48),'ca':None,'client_cert':None,'client_key':None,'profile_path':str(profile)}
engine=LiveEngine(cfg);engine.reset()
credentials={role:secrets.token_urlsafe(48) for role in ('viewer','operator','blue','white','integrator')}
server=Server(('127.0.0.1',0),engine,credentials)
connection=ROOT/'.local/browser-fixture.json';connection.parent.mkdir(exist_ok=True);connection.write_text(json.dumps({'url':f'http://127.0.0.1:{server.server_port}','credentials':credentials}));connection.chmod(0o600)
def tick():
    while True:time.sleep(.5);model.tick();engine.tick()
threading.Thread(target=tick,daemon=True).start()
print('Fixture ready: loopback only',flush=True)
try:server.serve_forever()
finally:server.server_close();ot.shutdown();engine.close();model.close();temporary.cleanup();connection.unlink(missing_ok=True)
