"""Independent process authority. No public red-team endpoint is exposed here."""
import argparse
import copy
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
import json
import math
import secrets
import threading
import time
import uuid
from .core import Engine, LabError, WORLD, coordinate
from .common import load


class Model(Engine):
    def snapshot(self):
        result=super().snapshot()
        result['impact_at']=self.state.get('drone_impact',{}).get('at')
        return result

    def impact(self):
        with self.lock:
            if not self.state.get("drone_impact"):
                asset = next(a for a in super()._regions(self.clock())[0]["assets"] if a["id"] == "KR-VTOL-01")
                self.state["drone_impact"] = {"at": self.clock(), "origin": asset["truth"],
                    "impact": {"x": min(1040, asset["truth"]["x"] + 70), "y": min(580, asset["truth"]["y"] + 155)}}
                self._event("model.drone_impact", "model-controller", "Sanal saha modeli etkisi başlatıldı", asset="KR-VTOL-01")
                self._save(); self._export()

    def _regions(self, at):
        rows = super()._regions(at)
        mission=self.state.get('mission_redirect')
        if mission:
            region=WORLD['regions'][0];target=region['changedTarget']
            for index,asset in enumerate(rows[0]['assets']):
                meta=next(u for u in region['units'] if u['id']==asset['id'])
                if meta['kind']=='air':continue
                if meta['kind']=='fixed':asset['values']['pan']=112;continue
                origin=mission['origins'][asset['id']];end={'x':target['x']-index*22,'y':target['y']-index*14}
                distance=math.hypot(end['x']-origin['x'],end['y']-origin['y'])
                progress=min(1,max(0,at-mission['at'])*meta['speed']/5/max(1,distance))
                point={'x':origin['x']+(end['x']-origin['x'])*progress,'y':origin['y']+(end['y']-origin['y'])*progress,
                       'heading':math.degrees(math.atan2(end['x']-origin['x'],origin['y']-end['y']))%360,'speed':meta['speed']*3.6 if progress<1 else 0}
                asset.update(truth=point,reported=point,coord=coordinate(region,point),refCoord=coordinate(region,point))
        loss = self.state.get("drone_impact")
        if loss:
            elapsed = max(0, at - loss["at"])
            progress = min(1, elapsed / 3.5)
            for asset in rows[0]["assets"]:
                if asset["id"] == "KR-VTOL-01":
                    origin, end = loss["origin"], loss["impact"]
                    point = {"x": origin["x"]+(end["x"]-origin["x"])*progress,
                             "y": origin["y"]+(end["y"]-origin["y"])*progress**2,
                             "heading": progress*240, "speed": 42 if progress < 1 else 0}
                    asset.update(truth=point, reported=point, destroyed=progress >= 1,
                                 loss={"origin": origin, "impact": end, "point": point, "elapsed": elapsed,
                                       "progress": progress, "destroyed": progress >= 1, "burst": 3.5 <= elapsed < 5.3})
                    asset["values"]["altitude"] = max(0, 185*(1-progress))
        return rows


class Handler(BaseHTTPRequestHandler):
    def log_message(self, *_): pass

    def reply(self, status, body):
        content = json.dumps(body, ensure_ascii=False, allow_nan=False).encode()
        self.send_response(status); self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(content))); self.end_headers(); self.wfile.write(content)

    def authorized(self):
        return secrets.compare_digest(self.headers.get("Authorization", ""), "Bearer " + self.server.token)

    def do_GET(self):
        if not self.authorized(): return self.reply(403, {"error": "Kimlik reddedildi"})
        if self.path != "/reference": return self.reply(404, {"error": "Bulunamadı"})
        self.reply(200, self.server.engine.snapshot())

    def do_POST(self):
        if not self.authorized(): return self.reply(403, {"error": "Kimlik reddedildi"})
        try:
            length = int(self.headers.get("Content-Length", "0"))
            if not 1 <= length <= 16384 or self.headers.get("Transfer-Encoding"): raise ValueError()
            body = json.loads(self.rfile.read(length))
            engine = self.server.engine
            if self.path == "/command":
                result = engine.operator(body["region"], {"settings": body.get("settings")})
            elif self.path=='/mission':
                with engine.lock:
                    engine.state['mission_redirect']={'at':engine.clock(),'origins':{a['id']:a['truth'] for a in engine._regions(engine.clock())[0]['assets']}}
                    engine._event('model.mission_redirect','model-controller','Sanal saha görevleri değiştirildi');engine._save();engine._export()
                result={'ok':True}
            elif self.path == "/impact":
                engine.impact(); result = {"ok": True}
            elif self.path == "/reset":
                run_id = str(uuid.UUID(body["run_id"]))
                engine.reset()
                with engine.lock:
                    engine.state["run_id"] = run_id; engine._save()
                result = {"ok": True, "run_id": run_id}
            elif self.path == "/restore":
                engine.state.pop('mission_redirect',None)
                for region in engine.state["plants"]:
                    engine.operator(region, {"settings": None})
                result = {"ok": True}
            else: return self.reply(404, {"error": "Bulunamadı"})
            self.reply(200, result)
        except LabError as error: self.reply(error.status, {"error": error.message})
        except (ValueError, KeyError, TypeError): self.reply(400, {"error": "Geçersiz istek"})


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--config", default="/etc/kalkan/ot.json")
    args = parser.parse_args(); cfg = load(args.config)
    engine = Model(cfg["runtime"], cfg["log_path"])
    server = ThreadingHTTPServer((cfg.get("host", "127.0.0.1"), cfg.get("port", 8090)), Handler)
    server.engine, server.token = engine, cfg["token"]
    failures=[]
    def tick():
        while True:
            time.sleep(.5)
            try:engine.tick()
            except Exception as error:
                failures.append(error);server.shutdown();return
    threading.Thread(target=tick, daemon=True).start()
    try: server.serve_forever()
    finally: engine.close()
    if failures:raise RuntimeError('OT ölçüm/kayıt döngüsü durdu') from failures[0]


if __name__ == "__main__": main()
