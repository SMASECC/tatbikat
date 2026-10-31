"""APP state overlays independent measurements from the OT VM."""
import copy
import hashlib
import hmac
import json
import secrets
import time
from .core import Engine, LabError, WORLD, coordinate, digest
from .common import request, load


class LiveEngine(Engine):
    def __init__(self, config, clock=time.time, transport=request):
        self.config, self.transport = config, transport
        self.reference, self.reference_received = None, 0
        super().__init__(config["runtime"], config["log_path"], clock)

    def ot(self, path, body=None):
        cfg = self.config
        try:
            return self.transport(cfg["ot_url"] + path, body, token=cfg["ot_token"], ca=cfg["ca"],
                                  cert=cfg["client_cert"], key=cfg["client_key"], timeout=2)
        except (OSError, ValueError) as error:
            raise LabError(503, "Bağımsız OT hizmetine erişilemedi") from error

    def reference_stale(self):
        return self.reference is None or self.clock()-self.reference_received > 2.5

    def _event(self, kind, actor, message, **facts):
        if actor == "lab-command-user": actor = "svc-sync/integrator"
        return super()._event(kind, actor, message, **facts)

    def tick(self):
        try:
            reference = self.ot("/reference")
            if reference.get("run_id") != self.state["run_id"]:
                raise ValueError("OT tur kimliği eşleşmiyor")
            with self.lock:
                self.reference, self.reference_received = reference, self.clock()
                for region, plant in reference["plants"].items():
                    target = self.state["plants"][region]
                    for key in ("actual", "service", "branchServices", "valve", "heat", "driveHz", "pumps", "operatorControlled"):
                        target[key] = copy.deepcopy(plant[key])
                    target["local_temp"] = plant["localTemp"]
        except (OSError, ValueError, KeyError, TypeError, LabError):
            pass  # Keep the last independent sample and expose its age; never fabricate freshness.
        with self.lock:
            self.state["revision"] += 1
            self.state["updated_at"] = self.clock()
            self._detect(); self._save(); self._export()

    def _regions(self, at):
        if self.reference is None:
            rows = super()._regions(self.state["started_at"])
            for row in rows:
                row.update(offline=True, age=0)
                for asset in row["assets"]: asset.update(offline=True, tone="muted")
            return rows
        rows = copy.deepcopy(self.reference["regions"])
        for row in rows:
            kr = row["id"] == "karatepe"
            offline = self.reference_stale() or kr and self.state["field_offline_since"] is not None
            age = at-self.reference_received if self.reference_stale() else at-self.state["field_offline_since"] if offline else .1
            if kr and offline and self.state.get("field_frozen"):
                frozen = {a["id"]: a for a in self.state["field_frozen"]}
                for asset in row["assets"]:
                    if not asset.get("loss") and asset["id"] in frozen:
                        asset['_frozen_reported']=copy.deepcopy(frozen[asset['id']]['reported'])
                        asset['values']=copy.deepcopy(frozen[asset['id']]['values'])
            for index, asset in enumerate(row["assets"]):
                meta = next(u for r in WORLD["regions"] if r["id"] == row["id"] for u in r["units"] if u["id"] == asset["id"])
                region = next(r for r in WORLD["regions"] if r["id"] == row["id"])
                drift = self.state["position_offset_m"] if kr and index == 0 else 0
                saved_report=asset.pop('_frozen_reported',None)
                asset["reported"] = saved_report or dict(asset["truth"])
                if saved_report is None:asset["reported"]["x"] += drift/5
                changed = kr and self.state["mission_changed"] and meta["kind"] != "air"
                target = region["changedTarget"]
                asset.update(drift=drift, orderChanged=changed,
                             changedTarget=target if changed else None,
                             destination="GÖREV SONA ERDİ" if asset.get("destroyed") else target["name"] if changed else meta["destination"],
                             coord=coordinate(region, asset["reported"]), refCoord=coordinate(region, asset["truth"]),
                             offline=offline or asset.get("destroyed", False), radioBlocked=kr and offline,
                             tone="red" if asset.get("destroyed") or drift or changed else "muted" if offline else "green")
                if kr and offline: asset["values"]["signal"] = 0
            row.update(offline=offline, age=max(0, age))
        return rows

    def _plants(self, at):
        result = super()._plants(at)
        if self.reference_stale():
            for row in result.values(): row.update(offline=True, age=max(0, at-self.reference_received) if self.reference_received else 0)
        return result

    def _conditions(self):
        result = super()._conditions()
        result["telemetry.reference_timeout"] = (self.reference_stale(), "OT-SIM-01", {"reference_age": max(0, self.clock()-self.reference_received) if self.reference_received else None})
        return result

    def red(self, step, session, srcip):
        if load(self.config["profile_path"])["profile"] != "exercise":
            self.deny("svc-sync/integrator", "Entegrasyon hesabının fazla yazma yetkisi kapalı", srcip, step)
            raise LabError(403, "Tatbikat profili etkin değildir")
        with self.lock:
            if self.reference_stale(): raise LabError(503, "Bağımsız OT kaynağı alınamıyor")
            if step!='session' and (not session or not secrets.compare_digest(digest(session),self.state['session_hash'] or '')):
                raise LabError(403,'Geçerli uygulama oturumu gerekmektedir')
            if step == "plc-command" and self.state["red_enabled"] and self.state["red_step"] == 4:
                self.ot("/command", {"region": "guneyova", "settings": {"valve": 15, "heat": 82}})
            if step=='mission' and self.state['red_enabled'] and self.state['red_step']==2:
                self.ot('/mission',{})
            if step == "outage" and self.state["red_enabled"] and self.state["red_step"] == 5:
                self.ot("/impact", {})
            return super().red(step, session, srcip)

    def blue(self, action, body):
        with self.lock:
            if action=='contain' and body.get('host_receipt'):
                receipt=body['host_receipt'];signature=body.get('signature','')
                canonical=json.dumps(receipt,sort_keys=True,separators=(',',':')).encode()
                expected=hmac.new(self.config['evidence_key'].encode(),canonical,hashlib.sha256).hexdigest()
                if not hmac.compare_digest(expected,signature) or receipt.get('run_id')!=self.state['run_id'] or abs(self.clock()-receipt.get('verified_at',0))>300:
                    raise LabError(403,'Wazuh kanıt doğrulama imzası veya turu geçersiz')
                if not receipt.get('alert_id') or not isinstance(receipt.get('rule_id'),int):raise LabError(400,'Alarm referansı gerekli')
                event=self._event('evidence.wazuh_verified','controller-verifier','Wazuh kaynak alarmı yönetim kanalından doğrulandı',
                                  source_alert_id=receipt['alert_id'],source_rule_id=receipt['rule_id'],source_alert_sha256=receipt['alert_sha256'],verified_by='controller-hmac')
                self._save();self._export()
                body=dict(body,alert={'alert_id':receipt['alert_id'],'rule_id':receipt['rule_id'],'event_seq':event['event_seq']})
            if action == "restore":
                if not self.state["contained"]: raise LabError(409, "Önce sınırlandırma gerekmektedir")
                self.ot("/restore", {})
            return super().blue(action, body)

    def operator(self, region, body):
        # OT validates ranges before physical model state changes; then APP records the command.
        self.ot("/command", {"region": region, "settings": body.get("settings")})
        return super().operator(region, body)

    def reset(self):
        result = super().reset()
        self.ot("/reset", {"run_id": result["run_id"]})
        self.reference = None; self.reference_received = 0
        self.tick()
        return result

    def snapshot(self):
        result = super().snapshot()
        result.update(reference_connected=not self.reference_stale(), reference_received_at=self.reference_received,
                      impact_at=self.reference.get("impact_at") if self.reference else None)
        return result
