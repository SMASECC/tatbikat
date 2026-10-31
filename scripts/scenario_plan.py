#!/usr/bin/env python3
"""Validate and render red/blue requirements without executing lab actions."""
import argparse
import json
from pathlib import Path
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
PLAN = ROOT / "scenarios/red-blue/requirements.json"
MATRIX = ROOT / "docs/scenarios/evidence-matrix.md"


def load_plan():
    return json.loads(PLAN.read_text(encoding="utf-8"))


def validate(plan, root=ROOT):
    errors = []
    topology = json.loads((root / "infra/topology.json").read_text(encoding="utf-8"))
    hosts = {v["name"] for v in topology["vms"]}
    components = {c["id"]: c for c in plan["components"]}
    logs = {s["id"]: s for s in plan["log_sources"]}
    phases = {p["id"]: p for p in plan["phases"]}
    if plan.get("schema") != "kalkan.exercise-requirements.v1":
        errors.append("Senaryo gereksinim şeması tanınmamaktadır.")
    if len(components) != len(plan["components"]) or len(logs) != len(plan["log_sources"]) or len(phases) != len(plan["phases"]):
        errors.append("Bileşen, kayıt kaynağı ve aşama kimlikleri benzersiz olmalıdır.")
    expected_ids = {"B00", "B12", "B13", "B14"} | {f"R{i:02}" for i in range(1, 12)}
    if set(phases) != expected_ids:
        errors.append("Erişim, beş etki ve mavi takım kapanış aşamaları tam olmalıdır.")

    def existing_file(path):
        if not path:
            return False
        candidate = (root / path).resolve()
        return candidate.is_relative_to(root.resolve()) and candidate.is_file()

    for component in plan["components"]:
        if component["owner"] not in ("red", "blue", "shared") or not set(component["hosts"]) <= hosts:
            errors.append(f"Bileşen sahibi veya sunucusu geçersizdir: {component['id']}")
        if not set(component["requires"]) <= set(components):
            errors.append(f"Bileşen bağımlılığı eksiktir: {component['id']}")
        if component["status"].startswith("existing") and not component.get("source_paths"):
            errors.append(f"Mevcut bileşenin kaynak yolu gerekmektedir: {component['id']}")
        for path in component.get("source_paths", []):
            if not existing_file(path):
                errors.append(f"Bileşen kaynağı bulunamadı veya depo dışındadır: {path}")
    visiting, visited = set(), set()

    def visit(name):
        if name in visiting:
            errors.append(f"Bileşen bağımlılık döngüsü: {name}")
            return
        if name in visited or name not in components:
            return
        visiting.add(name)
        for dependency in components[name]["requires"]:
            visit(dependency)
        visiting.remove(name)
        visited.add(name)

    for name in components:
        visit(name)
    for source in logs.values():
        if source["host"] not in hosts or not source.get("requirements"):
            errors.append(f"Kayıt kaynağı geçersizdir: {source['id']}")
    rule_ids = {int(r.attrib["id"]) for path in ('backend/starter-v0.1/wazuh/kalkan_rules.xml','lab/wazuh/host_rules.xml') for r in ET.parse(root / path).getroot()}
    for phase in plan["phases"]:
        if not set(phase["hosts"]) <= hosts or not set(phase["requires"]) <= set(components) or not set(phase["log_sources"]) <= set(logs):
            errors.append(f"Aşama host/bileşen/kayıt referansı eksiktir: {phase['id']}")
        if not phase["log_sources"] or not phase["observables"] or not all(phase.get(k) for k in ("entry_condition", "blue_response", "verification")):
            errors.append(f"Aşama kanıt veya müdahale sözleşmesi eksiktir: {phase['id']}")
        if not set(phase["existing_rule_ids"]) <= rule_ids:
            errors.append(f"Mevcut diye belirtilen Wazuh kuralı bulunamadı: {phase['id']}")
        script = phase.get("script")
        if script:
            if script["status"] == "planned" and script["path"] is not None:
                errors.append(f"Planlanan script çalışır kaynak gibi gösterilemez: {phase['id']}")
            elif script["status"] != "planned" and not existing_file(script["path"]):
                errors.append(f"Script kaynağı bulunamadı veya depo dışındadır: {phase['id']}")
    frontend_names = re.findall(r"script:'([^']+\.py)'", (root / "frontend/dmz-guide.js").read_text(encoding="utf-8"))
    plan_names = [phases[f"R{i:02}"]["script"]["name"] for i in range(1, 7) if f"R{i:02}" in phases]
    if frontend_names != plan_names:
        errors.append("Rejideki altı script adı gereksinim planıyla uyuşmamaktadır.")
    if plan["presentation"] != dict(stage_count=10, stage_seconds=30, access_chain_stage=1, pause_for_evidence=True, timer_implies_attack_success=False):
        errors.append("Sunum süresi ve gerçek işlem/kanıt ayrımı korunmalıdır.")
    if {p["presentation_stage"] for p in plan["phases"]} != set(range(10)):
        errors.append("Aşamalar on sunum adımıyla eşleşmelidir.")
    for name in ("normal", "restored"):
        if any(plan["profiles"][name].values()):
            errors.append(f"Profil zafiyet veya kalıcılık anahtarıyla başlayamaz: {name}")
    if plan["profiles"]["exercise"]["persistence_key_present_at_start"]:
        errors.append("Kalıcılık anahtarı tatbikat başlamadan hazır bulunamaz.")
    if plan.get("live_ready") and any(c["status"] in ("planned", "blocked_selection", "existing_source_unverified_live", "existing_model") for c in components.values()):
        errors.append("Tamamlanmamış kaynaklarla canlı senaryo hazır gösterilemez.")
    return errors


def table_text(value):
    return str(value).replace("|", "/").replace("\n", " ")


def render_matrix(plan):
    lines = ["# Aşama, kanıt ve müdahale çizelgesi", "", "Bu dosya `scenarios/red-blue/requirements.json` verisinden `make scenario-plan` ile üretilmektedir.", "",
             "**Durum: kaynak kod ve kurulum otomasyonu pakettedir; tam VM/Wazuh provası henüz doğrulanmamıştır.** Altı erişim scripti, beş etki scripti, bağımsız model ve mavi takım araçları bulunmaktadır. Büyük imajlar ve Ligolo ikilileri resmi kaynaklardan kurulumda indirilir.", "",
             "Sunum adımı 1–10 olarak gösterilmiştir. İlk erişimin altı teknik işlemi aynı sunum adımına bağlıdır. Her adımın hedef anlatım süresi 30 saniyedir; gerçek işlem/tespit süresi değildir.", "",
             "## Kırmızı takım / işlem ve kanıt", "",
             "| Aşama / sunum | Script ve kaynak durumu | Önkoşul | Kayıt kaynakları / mevcut uygulama kuralı |",
             "|---|---|---|---|"]
    for phase in plan["phases"]:
        script = phase["script"]
        if not script:
            source = "Analist / reji kontrolü; kurulum beklenmektedir."
        elif script["status"] == "planned":
            source = f"`{script['name']}` — planlanan isim; dosya yoktur."
        elif script['status']=='model_only':
            source = f"`{script['name']} {script['command']}` — model istemcisi; canlı OS/ağ işlemi değildir."
        else:
            source=f"`{script['path']}`"+(f" · `{script['command']}`" if script.get('command') else '')+' — kaynak pakette; tam VM provası beklenmektedir.'
        rules = ", ".join(map(str, phase["existing_rule_ids"])) or "Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir."
        cells = [f"{phase['id']} · {phase['title']} / {phase['presentation_stage'] + 1}", source,
                 phase["entry_condition"], ", ".join(phase["log_sources"]) + " / " + rules]
        lines.append("| " + " | ".join(map(table_text, cells)) + " |")
    lines += ["", "## Mavi takım / müdahale ve doğrulama", "", "| Aşama | İnceleme / müdahale | Tamamlanma kanıtı |", "|---|---|---|"]
    for phase in plan["phases"]:
        lines.append("| " + " | ".join(table_text(phase[k]) for k in ("id", "blue_response", "verification")) + " |")
    lines += ["", "## Canlı kurulum önündeki eksikler", ""]
    lines += [f"- {value}" for value in plan["blockers"]]
    lines += ["", "Kayıt kaynağı kimliklerinin ayrıntıları [mavi takım gereksinimleri](blue-team-requirements.md) ve ortak JSON planında bulunmaktadır. [Kanıt şablonu](../../scenarios/red-blue/evidence-template.json) boş şablondur; gerçek olay içermemektedir."]
    return "\n".join(lines) + "\n"


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="Çizelgeyi değiştirmeden planla eşleşmesini kontrol eder.")
    args = parser.parse_args()
    plan = load_plan()
    errors = validate(plan)
    if errors:
        raise SystemExit("\n".join("FAIL: " + message for message in errors))
    matrix = render_matrix(plan)
    if args.check:
        if not MATRIX.exists() or MATRIX.read_text(encoding="utf-8") != matrix:
            raise SystemExit("Çizelge güncel değildir; make scenario-plan çalıştırın.")
    else:
        MATRIX.write_text(matrix, encoding="utf-8")
    print(f"PASS: {len(plan['components'])} bileşen, {len(plan['log_sources'])} kayıt kaynağı, {len(plan['phases'])} aşama. Canlı prova hazır: hayır.")


if __name__ == "__main__":
    main()
