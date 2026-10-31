#!/usr/bin/env python3
"""Validate the installation plan locally, without reaching any lab system."""
import argparse
import hashlib
import ipaddress
import json
from pathlib import Path
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]


def read_json(path):
    return json.loads(path.read_text(encoding="utf-8"))


def validate_topology(data):
    errors = []
    networks = data.get("networks", [])
    vms = data.get("vms", [])
    zones = {n["id"]: n for n in networks}
    if data.get("schema") != "kalkan.topology.v1":
        errors.append("Topoloji şeması tanınmamaktadır.")
    if len(networks) != 7 or len(zones) != 7:
        errors.append("Yedi benzersiz ağ bölgesi gerekmektedir.")
    if len({n["vlan"] for n in networks}) != len(networks):
        errors.append("VLAN numaraları benzersiz olmalıdır.")
    if len({n["bridge"] for n in networks}) != len(networks):
        errors.append("Bu planda her bölge ayrı bridge kullanmalıdır.")
    parsed = {}
    for n in networks:
        try:
            subnet = ipaddress.ip_network(n["cidr"], strict=True)
            gateway = ipaddress.ip_address(n["gateway"])
            if gateway not in subnet or gateway in (subnet.network_address, subnet.broadcast_address):
                errors.append(f"Geçersiz ağ geçidi: {n['id']}")
            parsed[n["id"]] = subnet
        except ValueError:
            errors.append(f"Geçersiz ağ: {n['id']}")
    items = list(parsed.items())
    for i, (name, subnet) in enumerate(items):
        for other, other_subnet in items[i + 1:]:
            if subnet.overlaps(other_subnet):
                errors.append(f"Ağlar çakışmaktadır: {name}, {other}")
    if zones.get("external", {}).get("cidr") != "198.18.60.0/24":
        errors.append("Dış lab adres revizyonu R1 ile uyuşmamaktadır.")
    if len(vms) != 8:
        errors.append("Plan sekiz VM içermelidir.")
    for key in ("name", "vmid", "ansible_host"):
        if len({vm[key] for vm in vms}) != len(vms):
            errors.append(f"VM alanı benzersiz olmalıdır: {key}")
    addresses = set()
    for vm in vms:
        interfaces = vm.get("interfaces", [])
        if vm["name"] != "FW-01" and len(interfaces) != 1:
            errors.append(f"Yalnız FW-01 birden fazla bölgeye bağlanabilir: {vm['name']}")
        if vm["ansible_host"] not in [i["ip"] for i in interfaces]:
            errors.append(f"Yönetim adresi VM arayüzlerinde bulunmamaktadır: {vm['name']}")
        for iface in interfaces:
            try:
                ip = ipaddress.ip_address(iface["ip"])
                subnet = parsed.get(iface["zone"])
                if subnet is None or ip not in subnet or ip in (subnet.network_address, subnet.broadcast_address):
                    errors.append(f"Arayüz yanlış bölgededir: {vm['name']}")
                if ip in addresses:
                    errors.append(f"Tekrarlanan arayüz adresi: {ip}")
                addresses.add(ip)
            except ValueError:
                errors.append(f"Geçersiz arayüz adresi: {vm['name']}")
        if any(vm[k] <= 0 for k in ("vcpu", "ram_gib", "disk_gib")):
            errors.append(f"VM kaynakları pozitif olmalıdır: {vm['name']}")
    fw = next((v for v in vms if v["name"] == "FW-01"), {})
    if {(i["zone"], i["ip"]) for i in fw.get("interfaces", [])} != {(n["id"], n["gateway"]) for n in networks}:
        errors.append("FW-01 bütün bölgelerin ağ geçitlerini taşımalıdır.")
    red = next((v for v in vms if v["name"] == "KALI-RED-01"), {})
    if red.get("ansible_host") != "198.18.60.20":
        errors.append("Kali dış lab adresi R1 ile uyuşmamaktadır.")
    totals = tuple(sum(vm[k] for vm in vms) for k in ("vcpu", "ram_gib", "disk_gib"))
    if totals != (20, 26, 360):
        errors.append(f"Kaynak planı teknik gereksinimlerle uyuşmamaktadır: {totals}")
    hypervisor = data.get("hypervisor", {})
    if hypervisor.get("management_zone") != "mgmt" or hypervisor.get("ip") != "10.77.10.10":
        errors.append("Proxmox yalnız yönetim bölgesinde bulunmalıdır.")
    if data.get("default_profile") != "normal":
        errors.append("Varsayılan profil normal olmalıdır.")
    for profile in ("normal", "restored"):
        if data.get("profiles", {}).get(profile) != dict(legacy_ssh=False, pivot_egress=False, overbroad_api=False):
            errors.append(f"Profil tatbikat istisnalarını kapatmalıdır: {profile}")
    return errors


def validate_policy(policy, topology):
    errors = []
    if policy.get("default_action") != "deny" or policy.get("application_status") != "review_only":
        errors.append("Erişim planı varsayılan ret ve inceleme durumunda olmalıdır.")
    valid_endpoints = {f"host:{vm['name']}" for vm in topology["vms"]}
    valid_endpoints |= {f"zone:{n['id']}" for n in topology["networks"]}
    valid_endpoints |= {f"gateway:{n['id']}" for n in topology["networks"]}
    valid_endpoints |= {"hypervisor", "client:reji", "client:blue", "set:agent-vms", "set:managed-vms"}
    seen = set()
    for rule in policy.get("rules", []):
        if rule["id"] in seen:
            errors.append(f"Tekrarlanan erişim kuralı: {rule['id']}")
        seen.add(rule["id"])
        if rule["source"] not in valid_endpoints or rule["destination"] not in valid_endpoints:
            errors.append(f"Bilinmeyen erişim uç noktası: {rule['id']}")
        if rule.get("protocol") not in ("tcp", "udp") or not all(isinstance(p, int) and 1 <= p <= 65535 for p in rule.get("ports", [])) or not rule.get("ports"):
            errors.append(f"Protokol/port geçersizdir: {rule['id']}")
        if not rule.get("profiles") or not set(rule["profiles"]) <= set(topology["profiles"]):
            errors.append(f"Profil geçersizdir: {rule['id']}")
        if rule.get("gate") and rule["gate"] not in policy["optional_gates"]:
            errors.append(f"İsteğe bağlı kapı tanımsızdır: {rule['id']}")
        if rule["id"] in ("legacy-ssh", "pivot-egress") and rule["profiles"] != ["exercise"]:
            errors.append(f"Tatbikat istisnası normal profilde açılamaz: {rule['id']}")
        if set(rule["ports"]) & {5432, 9200}:
            errors.append("Veritabanı ve indexer portları ağlara yayınlanamaz.")
        if rule["source"] == "host:KALI-RED-01" and rule["destination"] != "gateway:external":
            errors.append("RED doğrudan iç ağa erişemez.")
    if not {"legacy-ssh", "pivot-egress", "external-portal", "integration-api"} <= seen:
        errors.append("Temel erişim kuralları eksiktir.")
    if any(policy.get("optional_gates", {}).values()):
        errors.append("İsteğe bağlı kayıt ve yönetim yolları varsayılan olarak kapalı olmalıdır.")
    return errors


def validate_repo(root=ROOT, require_build=False):
    topology = read_json(root / "infra/topology.json")
    policy = read_json(root / "infra/firewall-policy.json")
    errors = validate_topology(topology) + validate_policy(policy, topology)
    lock = read_json(root / "sources.lock.json")
    expected = [("docs/infrastructure-requirements.md", lock["infrastructure_plan"]["sha256"])]
    if require_build:
        expected.append(("dist/frontend/index.html", lock["frontend"]["sha256"]))
    for name, digest in expected:
        path = root / name
        if not path.is_file() or hashlib.sha256(path.read_bytes()).hexdigest() != digest:
            errors.append(f"Onaylı kaynak özeti ile uyuşmamaktadır: {name}")
    required = ["frontend/source.html", "frontend/app.js", "frontend/build.py", "backend/starter-v0.1/server.py", "requirements-infra.lock"]
    for name in required:
        if not (root / name).is_file():
            errors.append(f"Kaynak dosyası eksiktir: {name}")
    if (root / ".git").exists():
        result = subprocess.run(["git", "ls-files", "-z"], cwd=root, check=True, capture_output=True)
        paths = [Path(p) for p in result.stdout.decode().split("\0") if p]
        for path in paths:
            if ".local" in path.parts or "runtime" in path.parts or (path.name.startswith(".env") and path.name != ".env.example"):
                errors.append(f"Yerel sır veya çalışma dosyası Git'e eklenmiştir: {path}")
            if path.suffix in (".key", ".pem", ".p12", ".pfx"):
                errors.append(f"Anahtar/sertifika dosyası Git'e eklenmiştir: {path}")
            file_path = root / path
            if file_path.is_file() and re.search(br"-----BEGIN (?:OPENSSH |RSA |EC |DSA |ENCRYPTED )?PRIVATE KEY-----", file_path.read_bytes()):
                errors.append(f"Git kaynağında özel anahtar bulunmuştur: {path}")
    return errors


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--require-build", action="store_true")
    args = parser.parse_args()
    try:
        errors = validate_repo(require_build=args.require_build)
    except (KeyError, TypeError, ValueError, OSError) as exc:
        print(f"FAIL: Yapılandırma okunamadı: {exc}", file=sys.stderr)
        return 1
    if errors:
        print("\n".join(f"FAIL: {message}" for message in errors), file=sys.stderr)
        return 1
    print("PASS: 8 VM / 7 ağ, kaynak özetleri ve erişim profilleri doğrulandı.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
