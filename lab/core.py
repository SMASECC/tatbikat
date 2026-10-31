"""KALKAN-1 lab process, independent references and append-only event store."""
from __future__ import annotations

import copy
import hashlib
import json
import math
import os
from pathlib import Path
import secrets
import sqlite3
import threading
import time
import uuid
from datetime import datetime, timezone

ROOT = Path(__file__).resolve().parent
WORLD = json.loads((ROOT / "world.json").read_text())
STAGE_STARTS = list(range(0, 300, 30))
RED_STEPS = ["session", "position", "mission", "plc-measurement", "plc-command", "outage"]
RULES = {"auth.session_opened": 110101, "integrity.position_mismatch": 110102,
         "integrity.mission_mismatch": 110103, "integrity.measurement_mismatch": 110104,
         "process.command_deviation": 110105, "telemetry.link_timeout": 110106,
         "response.contained": 110107, "response.restored": 110108,
         "response.verified": 110109, "access.denied": 110110,
         "operator.command": 110111, "lab.reset": 110112}


class LabError(Exception):
    def __init__(self, status, message):
        self.status, self.message = status, message
        super().__init__(message)


def utc(at):
    return datetime.fromtimestamp(at, timezone.utc).isoformat(timespec="milliseconds")


def digest(value):
    return hashlib.sha256(value.encode()).hexdigest()


def initial(at):
    return {"run_id": str(uuid.uuid4()), "revision": 1, "started_at": at, "updated_at": at,
            "stage": 0, "red_step": 0, "session_hash": None, "red_enabled": True,
            "remote_write": True, "contained": False, "restored": False,
            "verified": False, "stable_since": None, "position_offset_m": 0,
            "mission_changed": False, "field_offline_since": None,
            "hmi_offline_since": None, "last_conditions": {}, "last_sample": 0,
            "hmi_frozen": None, "field_frozen": None,
            "plants": {region: {"actual": cfg["initial"], "local_temp": cfg["temp"],
                                 "service": 100.0, "branchServices": [100.0] * 3, "bias": 0.0, "valve": 70.0,
                                 "heat": cfg["temp"], "driveHz": 22.0,
                                 "pumps": [True] * 6, "operatorControlled": False}
                       for region, cfg in WORLD["plants"].items()}}


def position(unit, region, seconds):
    t = seconds + region["phase"]
    if unit["kind"] == "fixed":
        return {"x": unit["fixed"][0], "y": unit["fixed"][1], "heading": 0, "speed": 0}
    if unit["kind"] == "air":
        o = unit["orbit"]; a = t * o["rate"] + .2
        return {"x": o["cx"] + o["rx"] * math.cos(a), "y": o["cy"] + o["ry"] * math.sin(a),
                "heading": math.degrees(math.atan2(-o["rx"] * math.sin(a), -o["ry"] * math.cos(a))) % 360,
                "speed": math.hypot(o["rx"] * o["rate"] * math.sin(a), o["ry"] * o["rate"] * math.cos(a)) * 18}
    points = unit["route"]
    lengths = [math.dist(p, points[(i + 1) % len(points)]) for i, p in enumerate(points)]
    distance = (t * unit["speed"] / 5 + unit.get("offset", 0)) % sum(lengths)
    k = 0
    while k < len(lengths) - 1 and distance > lengths[k]:
        distance -= lengths[k]; k += 1
    a, b = points[k], points[(k + 1) % len(points)]
    f = distance / lengths[k] if lengths[k] else 0
    return {"x": a[0] + (b[0] - a[0]) * f, "y": a[1] + (b[1] - a[1]) * f,
            "heading": math.degrees(math.atan2(b[0] - a[0], a[1] - b[1])) % 360,
            "speed": unit["speed"] * 3.6}


def coordinate(region, point):
    return {"lat": region["origin"][0] + (720 - point["y"]) * 5 / 111320,
            "lon": region["origin"][1] + point["x"] * 5 / 85276}


class Engine:
    def __init__(self, runtime, log_path=None, clock=time.time):
        self.clock, self.lock = clock, threading.RLock()
        runtime = Path(runtime); runtime.mkdir(parents=True, exist_ok=True)
        self.log_path = Path(log_path or runtime / "events.jsonl")
        self.log_path.parent.mkdir(parents=True, exist_ok=True)
        self.db = sqlite3.connect(runtime / "kalkan.sqlite3", check_same_thread=False)
        self.db.execute("PRAGMA journal_mode=WAL")
        self.db.execute("PRAGMA synchronous=FULL")
        self.db.executescript("CREATE TABLE IF NOT EXISTS state (id INTEGER PRIMARY KEY, body TEXT NOT NULL);"
                             "CREATE TABLE IF NOT EXISTS events (seq INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT NOT NULL);")
        row = self.db.execute("SELECT body FROM state WHERE id=1").fetchone()
        self.state = json.loads(row[0]) if row else initial(self.clock())
        if row and not self.state["verified"]:
            self.state["stable_since"] = None
        self.last_tick = self.clock()
        self.exported = self._last_exported()
        if not row:
            self._event("lab.reset", "white", "Başlangıç kaydı oluşturuldu", asset="ALL")
        self._save()
        self._export()

    def _last_exported(self):
        # Repair only an incomplete trailing JSON line after an interrupted write.
        if not self.log_path.exists():
            self.log_path.touch(mode=0o640); return 0
        with self.log_path.open("rb+") as handle:
            handle.seek(0, 2); size = handle.tell()
            if not size: return 0
            handle.seek(max(0, size - 65536)); tail = handle.read()
            if not tail.endswith(b"\n"):
                end = tail.rfind(b"\n")
                handle.truncate(max(0, size - len(tail) + end + 1)); tail = tail[:end + 1]
            lines = tail.splitlines()
            return json.loads(lines[-1])["event_seq"] if lines else 0

    def _export(self):
        rows = self.db.execute("SELECT seq, body FROM events WHERE seq>? ORDER BY seq", (self.exported,)).fetchall()
        if not rows: return
        with self.log_path.open("a", encoding="utf-8") as handle:
            for seq, body in rows:
                handle.write(body + "\n")
            handle.flush(); os.fsync(handle.fileno())
        self.exported = rows[-1][0]

    def _event(self, kind, actor, message, asset="ALL", outcome="success", **facts):
        at = self.clock()
        event = {"app": "kalkan1", "schema_version": 1, "timestamp": utc(at),
                 "run_id": self.state["run_id"], "event_type": kind, "actor": actor,
                 "asset_id": asset, "outcome": outcome, "message": message, **facts}
        cursor = self.db.execute("INSERT INTO events(body) VALUES(?)", ("{}",))
        event["event_seq"] = cursor.lastrowid
        body = json.dumps(event, ensure_ascii=False, separators=(",", ":"))
        self.db.execute("UPDATE events SET body=? WHERE seq=?", (body, cursor.lastrowid))
        return event

    def _save(self):
        self.db.execute("INSERT OR REPLACE INTO state(id,body) VALUES(1,?)", (json.dumps(self.state),))
        self.db.commit()

    def deny(self, actor, reason, srcip="", route=""):
        with self.lock:
            self._event("access.denied", actor, reason, outcome="denied", srcip=srcip, route=route[:512])
            self._save(); self._export()

    def _plants(self, at):
        result = {}
        s = self.state
        for region, p in s["plants"].items():
            cfg = WORLD["plants"][region]
            offline = region == "guneyova" and s["hmi_offline_since"] is not None
            current = {"actual": p["actual"], "shown": p["actual"] + p["bias"],
                       "temp": p["local_temp"], "localTemp": p["local_temp"], "valve": p["valve"],
                       "heat": p["heat"], "driveHz": p["driveHz"], "pump": p["driveHz"] * 2 if p["pumps"][0] else 0,
                       "flow": cfg["demand"] * p["service"] / 100,
                       "pressure": cfg["pressure"] * p["service"] / 100,
                       "service": p["service"], "pumps": p["pumps"],
                       "branchServices": p["branchServices"],
                       "operatorControlled": p["operatorControlled"]}
            if offline and s["hmi_frozen"]:
                actual, local_temp = current["actual"], current["localTemp"]
                current.update(s["hmi_frozen"])
                current.update(actual=actual, localTemp=local_temp)
            current.update(offline=offline, age=at-s["hmi_offline_since"] if offline else .1,
                           locked=s["contained"], verified=abs(current["shown"]-current["actual"]) <= 3,
                           levelTarget=cfg["target"], returnTemp=current["temp"]-8.2,
                           mode="YEREL GÜVENLİ İŞLETİM" if s["contained"] else "OTOMATİK KONTROL")
            current["bias"] = abs(current["shown"]-current["actual"])
            deviation = not p["operatorControlled"] and (p["valve"] != 70 or p["heat"] != cfg["temp"])
            current["quality"] = "red" if current["bias"] > 3 or deviation else "amber" if s["stage"] in (7,8) or p["operatorControlled"] else "green"
            result[region] = current
        return result

    def _regions(self, at):
        s = self.state; result = []
        for region in WORLD["regions"]:
            kr = region["id"] == "karatepe"
            offline = kr and s["field_offline_since"] is not None
            seconds = (s["field_offline_since"] if offline else at) - s["started_at"]
            assets = []
            for j, unit in enumerate(region["units"]):
                truth = position(unit, region, seconds); reported = dict(truth)
                drift = s["position_offset_m"] if kr and j == 0 else 0
                reported["x"] += drift / 5
                values = {key: spec if isinstance(spec, (int,float)) else spec["base"]+spec.get("swing",0)*math.sin((seconds+region["phase"])*spec.get("rate",.05)+j*.7)
                          for key, spec in unit["values"].items()}
                changed = kr and j == 0 and s["mission_changed"]
                assets.append({"id":unit["id"], "truth":truth, "reported":reported,
                               "coord":coordinate(region,reported), "refCoord":coordinate(region,truth),
                               "values":values, "drift":drift, "orderChanged":changed,
                               "offline":offline, "tone":"muted" if offline else "red" if drift or changed else "amber" if s["stage"] in (7,8) and kr else "green",
                               "destination":region["changedTarget"]["name"] if changed else unit["destination"]})
            if offline and s["field_frozen"]:
                assets = copy.deepcopy(s["field_frozen"])
                for asset in assets: asset.update(offline=True, tone="muted")
            result.append({"id":region["id"], "assets":assets, "offline":offline,
                           "age":at-s["field_offline_since"] if offline else .1})
        return result

    def _conditions(self):
        s = self.state; p = s["plants"]["guneyova"]
        return {"integrity.position_mismatch": (bool(s["position_offset_m"]), "KR-ZPT-01", {"position_delta_m":s["position_offset_m"]}),
                "integrity.mission_mismatch": (s["mission_changed"], "KR-ZPT-01", {"mission_approved":"KUZEY KONTROL NOKTASI", "mission_reported":"DOĞU VADİSİ"}),
                "integrity.measurement_mismatch": (abs(p["bias"]) > 3, "GO-PLC-01", {"measurement_delta":abs(p["bias"])}),
                "process.command_deviation": (not p["operatorControlled"] and (p["valve"] != 70 or p["heat"] != 48), "GO-PLC-01", {"valve_reported":p["valve"], "valve_approved":70, "heat_reported":p["heat"], "heat_approved":48}),
                "telemetry.link_timeout": (any(since is not None and self.clock()-since >= 3 for since in (s["hmi_offline_since"],s["field_offline_since"])), "KR-FIELD+GO-PLC-01", {"field_link":"offline" if s["field_offline_since"] is not None else "online", "hmi_link":"offline" if s["hmi_offline_since"] is not None else "online", "timeout_seconds":3})}

    def _detect(self, force=False):
        s = self.state; at = self.clock()
        for kind, (active, asset, facts) in self._conditions().items():
            previous = s["last_conditions"].get(kind)
            if active and (force or previous is None or at-previous >= 15):
                self._event(kind, "reference-validator", "Bağımsız referans / işletim politikası ile uyumsuzluk", asset=asset, **facts)
                s["last_conditions"][kind] = at
            elif not active: s["last_conditions"].pop(kind, None)
        clean = not any(x[0] for x in self._conditions().values())
        stable = clean and s["contained"] and s["restored"] and all(p["service"] >= 98 and abs(p["local_temp"]-WORLD["plants"][r]["temp"]) <= 4 for r,p in s["plants"].items())
        if stable:
            if s["stable_since"] is None: s["stable_since"] = at
        else: s["stable_since"] = None

    def tick(self):
        with self.lock:
            at = self.clock(); dt = min(2, max(0, at-self.last_tick)); self.last_tick = at
            for region, p in self.state["plants"].items():
                cfg = WORLD["plants"][region]
                capacity = min(100,max(0,26+(p["valve"]-15)*74/55)) if p["pumps"][2] else 0
                for i,running in enumerate(p["pumps"][3:]):
                    target_service = capacity if running else 0
                    p["branchServices"][i] += (target_service-p["branchServices"][i])*(1-math.exp(-dt/4))
                p["service"] = sum(p["branchServices"])/3
                target = p["heat"] if p["pumps"][1] else 25
                p["local_temp"] += (target-p["local_temp"])*(1-math.exp(-dt/8))
                inlet = p["driveHz"]/22 if p["pumps"][0] else 0
                p["actual"] = min(98,max(2,p["actual"]+(inlet-p["service"]/100)*dt*.08+(cfg["target"]-p["actual"])*dt*.003))
            self.state["revision"] += 1; self.state["updated_at"] = at
            self._detect()
            if at-self.state["last_sample"] >= 5:
                self._event("telemetry.sample", "telemetry-producer", "31 kaynağın üretim döngüsü", source_count=31,
                            field_connected=21 if self.state["field_offline_since"] is not None else 27,
                            plc_connected=3 if self.state["hmi_offline_since"] is not None else 4)
                self.state["last_sample"] = at
            self._save(); self._export()

    def snapshot(self):
        with self.lock:
            at = self.clock(); s = self.state
            stable_for = 0 if s["stable_since"] is None else max(0, at-s["stable_since"])
            active = [k for k,v in self._conditions().items() if v[0]]
            public_events = [json.loads(row[0]) for row in self.db.execute("SELECT body FROM events ORDER BY seq DESC LIMIT 150")]
            public_events = [e for e in public_events if e["run_id"] == s["run_id"] and e["event_type"] != "telemetry.sample"][:25]
            return {"schema_version":1, "run_id":s["run_id"], "revision":s["revision"],
                    "generated_at":utc(at), "server_time":at, "stage_index":s["stage"],
                    "scenario_cursor":STAGE_STARTS[s["stage"]], "motion_seconds":at-s["started_at"],
                    "contained":s["contained"], "restored":s["restored"], "verified":s["verified"],
                    "remote_write":s["remote_write"], "red_enabled":s["red_enabled"],
                    "active_findings":active, "stable_for":stable_for, "verify_ready":stable_for >= 8,
                    "regions":self._regions(at), "plants":self._plants(at), "events":public_events}

    def red(self, step, session, srcip):
        with self.lock:
            s = self.state
            if not s["red_enabled"] or not s["remote_write"]:
                self.deny("lab-command-user", "Hesap / uzak yazma kapalı", srcip, step)
                raise LabError(403, "Mavi takım uzak yazmayı kapattı; yeni turu WHITE açabilir.")
            if step not in RED_STEPS: raise LabError(404, "Bilinmeyen adım")
            expected = RED_STEPS.index(step)
            if s["red_step"] != expected: raise LabError(409, f"Sıradaki adım: {RED_STEPS[s['red_step']] if s['red_step'] < 6 else 'BLUE müdahalesi'}")
            if expected and (not session or not secrets.compare_digest(digest(session), s["session_hash"] or "")):
                self.deny("lab-command-user", "Oturum geçersiz / iptal edildi", srcip, step)
                raise LabError(403, "Geçerli lab oturumu gerekli")
            token = None
            if step == "session":
                token = secrets.token_urlsafe(32); s["session_hash"] = digest(token)
                self._event("auth.session_opened", "lab-command-user", "Tanımlı istemci listesinde bulunmayan komuta oturumu açıldı", asset="KR-KKN", srcip=srcip, client_trusted="no")
            elif step == "position": s["position_offset_m"] = 650
            elif step == "mission": s["mission_changed"] = True
            elif step == "plc-measurement": s["plants"]["guneyova"]["bias"] = 30
            elif step == "plc-command": s["plants"]["guneyova"].update(valve=15,heat=82,operatorControlled=False)
            elif step == "outage":
                at = self.clock()
                s["hmi_frozen"] = copy.deepcopy(self._plants(at)["guneyova"])
                s["field_frozen"] = self._regions(at)[0]["assets"]
                s["field_offline_since"] = at; s["hmi_offline_since"] = at
            s["red_step"] += 1; s["stage"] = s["red_step"]; s["revision"] += 1
            self._event("record.changed", "lab-command-user", f"Lab komutu: {step}", asset="KR-ZPT-01" if expected in (1,2) else "GO-PLC-01", srcip=srcip, operation=step)
            self._detect(force=True); self._save(); self._export()
            return {"ok":True, "step":step, "run_id":s["run_id"], **({"session":token} if token else {})}

    def blue(self, action, body):
        with self.lock:
            s = self.state
            reason = body.get("reason", "")
            if not isinstance(reason,str) or not reason.strip() or len(reason)>500:
                raise LabError(400,"Müdahale gerekçesi gerekli (en fazla 500 karakter)")
            ref = body.get("alert", {})
            if action == "contain":
                if s["contained"]: raise LabError(409,"Uzak yazma zaten kilitli; mevcut geri dönüş aşaması korundu")
                if not isinstance(ref,dict) or not isinstance(ref.get("event_seq"),int) or not isinstance(ref.get("alert_id"),str) or not 1 <= len(ref["alert_id"]) <= 150:
                    raise LabError(400,"Wazuh alert_id, rule_id ve event_seq referansını gir")
                row = self.db.execute("SELECT body FROM events WHERE seq=?",(ref["event_seq"],)).fetchone()
                event = json.loads(row[0]) if row else {}
                verified_host=(event.get('event_type')=='evidence.wazuh_verified' and event.get('verified_by')=='controller-hmac' and event.get('source_alert_id')==ref.get('alert_id') and event.get('source_rule_id')==ref.get('rule_id'))
                known_app=(str(RULES.get(event.get("event_type")))==str(ref.get("rule_id")) and event.get("event_type") in set(RULES)-{"response.contained","response.restored","response.verified","lab.reset","operator.command"})
                if event.get("run_id") != s["run_id"] or not (verified_host or known_app):
                    raise LabError(409,"Alarm referansı güncel turdaki bir tespit kaydıyla uyuşmuyor")
                s.update(contained=True,red_enabled=False,remote_write=False,session_hash=None,stage=7)
                kind = "response.contained"
            elif action == "restore":
                if not s["contained"]: raise LabError(409,"Önce oturumu iptal et ve uzak yazmayı kilitle (contain)")
                if s["restored"]: return {"ok":True,"action":action,"already_applied":True,"run_id":s["run_id"]}
                s.update(position_offset_m=0,mission_changed=False,field_offline_since=None,hmi_offline_since=None,
                         hmi_frozen=None,field_frozen=None,restored=True,stage=8,stable_since=None,verified=False)
                for r,p in s["plants"].items():
                    p.update(bias=0,valve=70,heat=WORLD["plants"][r]["temp"],pumps=[True]*6,driveHz=22,operatorControlled=False)
                kind = "response.restored"
            elif action == "verify":
                if s["verified"]: return {"ok":True,"action":action,"already_applied":True,"run_id":s["run_id"]}
                self._detect()
                if s["stable_since"] is None or self.clock()-s["stable_since"] < 8:
                    raise LabError(409,"Bağlantı/bütünlük/hizmet/sıcaklık koşulları 8 saniye kararlı değil")
                s.update(verified=True,stage=9); kind = "response.verified"
            else: raise LabError(404,"Bilinmeyen müdahale")
            s["revision"] += 1
            self._event(kind,"blue-operator",reason,alert_ref=ref)
            self._detect(); self._save(); self._export()
            return {"ok":True,"action":action,"run_id":s["run_id"]}

    def operator(self, region, body):
        with self.lock:
            if region not in self.state["plants"]: raise LabError(404,"Bilinmeyen tesis")
            p = self.state["plants"][region]
            if not isinstance(body,dict): raise LabError(400,"Komut nesne olmalı")
            patch = body.get("settings")
            if patch is None:
                patch = {"driveHz":22,"valve":70,"heat":WORLD["plants"][region]["temp"],"pumps":[True]*6}
                manual = False
            else: manual = True
            if not isinstance(patch,dict) or set(patch)-{"driveHz","valve","heat","pumps"}: raise LabError(400,"Geçersiz komut alanı")
            for key,lo,hi in (("driveHz",0,50),("valve",0,100),("heat",20,85)):
                if key in patch and (type(patch[key]) not in (int,float) or not math.isfinite(patch[key]) or not lo <= patch[key] <= hi):
                    raise LabError(400,f"{key}: {lo}–{hi} aralığında sayı gerekli")
            if "pumps" in patch and (not isinstance(patch["pumps"],list) or len(patch["pumps"]) != 6 or any(type(x) is not bool for x in patch["pumps"])):
                raise LabError(400,"Altı pompa için boolean dizi gerekli")
            p.update(patch); p["operatorControlled"] = manual
            if p["driveHz"] == 0: p["pumps"][0] = False
            self.state["verified"] = False
            if self.state["stage"] == 9: self.state["stage"] = 8
            self.state["revision"] += 1
            self._event("operator.command","plant-operator","Yerel tesis komutu uygulandı",asset=region.upper()+"-PLC-01",settings=patch)
            self._detect(); self._save(); self._export()
            return {"ok":True}

    def reset(self):
        with self.lock:
            self.state = initial(self.clock()); self.last_tick = self.clock()
            self._event("lab.reset","white","Yeni tur başlatıldı; önceki olay kayıtları korundu")
            self._save(); self._export()
            return {"ok":True,"run_id":self.state["run_id"]}

    def close(self):
        with self.lock: self._save(); self._export(); self.db.close()
