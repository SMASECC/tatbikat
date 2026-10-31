#!/usr/bin/env python3
"""Local lab HTTP API. Python 3.10+, no third-party runtime dependencies."""
import argparse
import hashlib
from http import cookies
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import os
from pathlib import Path
import secrets
import signal
import threading
import time
from urllib.parse import parse_qs, urlsplit

from .core import LabError
from .live_engine import LiveEngine
from .common import load
ROOT = Path(__file__).resolve().parents[1]

LOGIN = """<!doctype html><html lang=tr><meta charset=utf-8><meta name=viewport content="width=device-width">
<title>KALKAN-1 / Oturum</title><style>body{background:#091923;color:#d5e8ef;font:16px system-ui;display:grid;place-items:center;min-height:95vh}form{width:330px;padding:32px;border:1px solid #36596a;border-radius:10px;background:#102633}h1{font-weight:500}label{display:block;margin:20px 0 7px}input,select,button{box-sizing:border-box;width:100%;padding:12px;background:#081923;color:#d5e8ef;border:1px solid #527689;border-radius:5px}button{margin-top:24px;background:#24516a;cursor:pointer}small{color:#8aafbf}</style>
<form method=post action=/api/v1/login><small>KOMUTA KONTROL MERKEZİ</small><h1>KALKAN-1</h1><p>Canlı laboratuvar oturumu</p><label>Rol</label><select name=role><option value=viewer>İzleyici</option><option value=operator>Tesis operatörü</option><option value=blue>Mavi takım</option><option value=white>Reji / WHITE</option></select><label>Rol anahtarı</label><input type=password name=token required autocomplete=current-password><button>Oturum aç</button></form></html>"""


class Server(ThreadingHTTPServer):
    daemon_threads = True
    def __init__(self, address, engine, credentials):
        super().__init__(address, Handler)
        self.engine, self.credentials, self.sessions = engine, credentials, {}
        self.session_lock = threading.Lock()
        self.presence = {}
        self.started = time.time()


class Handler(BaseHTTPRequestHandler):
    server_version = "KALKAN-Lab/0.3"

    def log_message(self, *args):
        pass  # Structured audit is authoritative; never print Authorization or cookies.

    def respond(self, status, data, content_type="application/json", headers=None):
        payload = json.dumps(data, ensure_ascii=False, allow_nan=False).encode() if content_type == "application/json" else data.encode() if isinstance(data,str) else data
        self.send_response(status)
        self.send_header("Content-Type",content_type+"; charset=utf-8")
        self.send_header("Content-Length",str(len(payload)))
        self.send_header("Cache-Control","no-store")
        self.send_header("X-Content-Type-Options","nosniff")
        self.send_header("Referrer-Policy","no-referrer")
        self.send_header("X-Frame-Options","SAMEORIGIN")
        for key,value in (headers or {}).items(): self.send_header(key,value)
        self.end_headers()
        try: self.wfile.write(payload)
        except (BrokenPipeError,ConnectionResetError): pass

    def role(self):
        if hasattr(self.server,'credentials_path'):
            self.server.credentials=load(self.server.credentials_path)
        auth = self.headers.get("Authorization","")
        if auth.startswith("Bearer "):
            token = auth[7:]
            for role, value in self.server.credentials.items():
                if secrets.compare_digest(token,value): return role,"bearer"
        jar = cookies.SimpleCookie()
        try: jar.load(self.headers.get("Cookie",""))
        except cookies.CookieError: return None,None
        token = jar.get("kalkan_session")
        with self.server.session_lock:
            key = hashlib.sha256(token.value.encode()).hexdigest() if token else ""
            item = self.server.sessions.get(key)
            if item and item[1] > time.time(): return item[0],"cookie"
            if key: self.server.sessions.pop(key,None)
        return None,None

    def require(self, allowed, mutation=False):
        role, mode = self.role()
        if role not in allowed:
            self.server.engine.deny(role or "unknown","Rol yetkisi reddedildi",self.client_address[0],urlsplit(self.path).path)
            raise LabError(403 if role else 401,"Bu işlem için uygun rol anahtarı gerekli")
        if mutation and mode == "cookie": self.check_origin(required=True)
        return role

    def check_origin(self, required=False):
        origin = self.headers.get("Origin")
        if (required and not origin) or (origin and urlsplit(origin).netloc != self.headers.get("Host")):
            raise LabError(403,"İstek aynı kökenden gelmeli")

    def body(self, form=False):
        if self.headers.get("Transfer-Encoding"): raise LabError(400,"Transfer-Encoding desteklenmiyor")
        try: size = int(self.headers.get("Content-Length","0"))
        except ValueError: raise LabError(400,"Geçersiz içerik uzunluğu")
        if not 0 <= size <= 16384: raise LabError(413,"İstek çok büyük")
        raw = self.rfile.read(size).decode("utf-8")
        if form: return {k:v[0] for k,v in parse_qs(raw).items()}
        if self.headers.get("Content-Type","").split(";")[0] != "application/json": raise LabError(415,"application/json gerekli")
        try: data = json.loads(raw, parse_constant=lambda value: (_ for _ in ()).throw(ValueError(value)))
        except ValueError: raise LabError(400,"Geçersiz JSON")
        if not isinstance(data,dict): raise LabError(400,"JSON nesnesi gerekli")
        return data

    def do_GET(self):
        try:
            path = urlsplit(self.path).path
            if path == "/healthz": return self.respond(200,{"status":"ok","version":"0.3.0-lab.1"})
            if path == "/login": return self.respond(200,LOGIN,"text/html")
            if path in ("/","/index.html"):
                role,_ = self.role()
                if role not in ("viewer","operator","blue","white"):
                    return self.respond(303,"","text/plain",{"Location":"/login"})
                return self.respond(200,(ROOT/"dist/live/index.html").read_text().replace('__KALKAN_ROLE__',role),"text/html")
            if path == "/api/v1/snapshot":
                self.require(("viewer","operator","blue","white"))
                return self.respond(200,self.server.engine.snapshot())
            if path == "/api/v1/me":
                role = self.require(("viewer","operator","blue","white"))
                return self.respond(200,{"role":role})
            raise LabError(404,"Bulunamadı")
        except LabError as exc: self.respond(exc.status,{"error":exc.message})

    def do_POST(self):
        try:
            path = urlsplit(self.path).path
            if path == '/api/v1/presence':
                role=self.require(('viewer','operator','blue','white'),True); body=self.body()
                identifier=body.get('id',''); view=body.get('view',''); status=body.get('status',{})
                if not isinstance(identifier,str) or not 1<=len(identifier)<=100 or view not in ('command','operations','plc','telemetry','events','director') or not isinstance(status,dict):
                    raise LabError(400,'Geçersiz ekran durumu')
                if view=='director' and role!='white': raise LabError(403,'Reji rolü gerekli')
                with self.server.session_lock:
                    now=time.time(); self.server.presence={k:v for k,v in self.server.presence.items() if now-v['received']<8}
                    if len(self.server.presence)>100: raise LabError(429,'Ekran sınırı')
                    self.server.presence[identifier]={'sender':identifier,'view':view,'status':status,'received':now}
                    rows=list(self.server.presence.values())
                    if role!='white':status['audio']={'enabled':False}
                    owner=next((row['sender'] for row in rows if isinstance(row['status'].get('audio'),dict) and row['status']['audio'].get('enabled')),None)
                return self.respond(200,{'screens':rows,'audioOwner':owner})
            if path == "/api/v1/login":
                self.check_origin()
                data = self.body(form=True); role = data.get("role"); value = self.server.credentials.get(role,"")
                if role not in ("viewer","operator","blue","white") or not value or not secrets.compare_digest(value,data.get("token","")):
                    self.server.engine.deny("unknown","Tarayıcı oturumu reddedildi",self.client_address[0],path)
                    raise LabError(401,"Rol veya anahtar yanlış")
                token = secrets.token_urlsafe(32)
                with self.server.session_lock:
                    self.server.sessions = {k:v for k,v in self.server.sessions.items() if v[1]>time.time()}
                    if len(self.server.sessions) >= 256: raise LabError(429,"Oturum sınırı")
                    self.server.sessions[hashlib.sha256(token.encode()).hexdigest()] = (role,time.time()+8*3600)
                return self.respond(303,"","text/plain",{"Location":"/", "Set-Cookie":f"kalkan_session={token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800"})
            if path.startswith("/api/v1/integrator/"):
                self.require(("integrator",),True); self.body()
                source=self.headers.get('X-Real-IP',self.client_address[0]) if self.client_address[0]=='127.0.0.1' else self.client_address[0]
                return self.respond(200,self.server.engine.red(path.rsplit("/",1)[1],self.headers.get("X-Kalkan-Session",""),source))
            if path == '/api/v1/integration/pulse':
                self.require(('integrator',),True); body=self.body()
                engine=self.server.engine
                with engine.lock:
                    executed=body.get('portal_execution_at')
                    if isinstance(executed,(int,float)) and executed>=engine.state['started_at'] and body.get('run_id')==engine.state['run_id'] and engine.state['stage']==0:
                        engine.state['stage']=1
                        engine._event('integration.dmz_notice','svc-sync','DMZ servisinin komut çalıştırma bildirimi alındı; host kayıtlarıyla doğrulanmalıdır.')
                        engine._save();engine._export()
                return self.respond(200,{'ok':True,'server_time':time.time()})
            if path.startswith("/api/v1/blue/"):
                self.require(("blue","white"),True)
                return self.respond(200,self.server.engine.blue(path.rsplit("/",1)[1],self.body()))
            if path == "/api/v1/white/reset":
                self.require(("white",),True); self.body()
                return self.respond(200,self.server.engine.reset())
            if path.startswith("/api/v1/operator/"):
                self.require(("operator","white"),True)
                return self.respond(200,self.server.engine.operator(path.rsplit("/",1)[1],self.body()))
            raise LabError(404,"Bulunamadı")
        except LabError as exc: self.respond(exc.status,{"error":exc.message})
        except (UnicodeDecodeError, ValueError): self.respond(400,{"error":"Geçersiz istek"})


def main():
    parser = argparse.ArgumentParser(description="KALKAN-1 canlı lab API")
    parser.add_argument("--config",default="/etc/kalkan/app.json")
    parser.add_argument("--host",default=os.environ.get("KALKAN_HOST","127.0.0.1"))
    parser.add_argument("--port",type=int,default=int(os.environ.get("KALKAN_PORT","8088")))
    parser.add_argument("--runtime",default=os.environ.get("KALKAN_RUNTIME",str(ROOT/"runtime")))
    parser.add_argument("--log-path",default=os.environ.get("KALKAN_LOG_PATH"))
    args = parser.parse_args()
    cfg=load(args.config)
    args.runtime,args.log_path=cfg['runtime'],cfg['log_path']
    credentials_path = Path(cfg['credentials'])
    if not credentials_path.is_file(): parser.error("Kurulum tarafından üretilen rol anahtarları bulunamadı; tam lab kurulumunu tamamlayın.")
    credentials = json.loads(credentials_path.read_text())
    if set(credentials)!={"white","integrator","blue","viewer","operator"} or any(not isinstance(v,str) or len(v)<40 for v in credentials.values()):
        parser.error("Geçersiz rol anahtarı dosyası")
    engine = LiveEngine(cfg)
    server = Server((args.host,args.port),engine,credentials)
    server.credentials_path=credentials_path
    stop = threading.Event()
    def tick():
        while not stop.wait(.5):
            try: engine.tick()
            except Exception:
                print("Proses / kayıt yazımı başarısız; hizmet durduruluyor.",flush=True)
                stop.set(); server.shutdown(); return
    worker = threading.Thread(target=tick,daemon=True); worker.start()
    def shutdown(*_):
        stop.set(); threading.Thread(target=server.shutdown,daemon=True).start()
    signal.signal(signal.SIGTERM,shutdown); signal.signal(signal.SIGINT,shutdown)
    print(f"KALKAN-1 lab v0.1.0 / http://{args.host}:{args.port}",flush=True)
    try: server.serve_forever(poll_interval=.25)
    finally: stop.set(); worker.join(timeout=5); server.server_close(); engine.close()


if __name__ == "__main__": main()
