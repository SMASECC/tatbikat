#!/usr/bin/env python3
"""Render review files from one topology; never provision or modify a host."""
import argparse
import json
from pathlib import Path
from validate_repo import ROOT, read_json, validate_topology, validate_policy


def render(topology, policy, output):
    errors = validate_topology(topology) + validate_policy(policy, topology)
    if errors:
        raise ValueError("; ".join(errors))
    output.mkdir(parents=True, exist_ok=True)
    zones = {n["id"]: n for n in topology["networks"]}
    groups = {"ubuntu": {"hosts": {}}, "kali": {"hosts": {}}}
    for vm in topology["vms"]:
        groups[vm["template"]]["hosts"][vm["name"]] = {
            "ansible_host": vm["ansible_host"], "kalkan_role": vm["role"],
            "kalkan_zone": vm["zone"], "proxmox_vmid": vm["vmid"],
        }
    inventory = {"all": {"vars": {
        "ansible_user": "REPLACE_ME_SSH_USER", "lab_profile": topology["default_profile"],
        "deployment_configured": False,
    }, "children": groups}}
    plan = {"status": "review_only_not_applied", "plan_id": topology["plan_id"],
            "hypervisor": topology["hypervisor"], "vms": []}
    for vm in topology["vms"]:
        item = dict(vm)
        item["interfaces"] = [dict(iface, bridge=zones[iface["zone"]]["bridge"],
                                    prefix=zones[iface["zone"]]["cidr"].split("/")[1]) for iface in vm["interfaces"]]
        plan["vms"].append(item)
    for filename, value in (("inventory.json", inventory), ("proxmox-plan.json", plan)):
        (output / filename).write_text(json.dumps(value, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    lines = ["# Erişim politikası incelemesi", "", "Durum: yalnız inceleme; nftables veya Proxmox firewall kuralları uygulanmamıştır.", "",
             "Varsayılan eylem: ret. Yerleşmiş bağlantı yanıtları, anti-spoofing ve DNAT/forward eşlemesi gerçek firewall rolünde tamamlanacaktır.", "",
             "| Kaynak | Hedef | Protokol / port | Profil / koşul | Açıklama |",
             "|---|---|---|---|---|"]
    for rule in policy["rules"]:
        condition = ", ".join(rule["profiles"])
        if rule.get("gate"):
            condition += " / " + rule["gate"] + " (varsayılan kapalı)"
        lines.append(f"| {rule['source']} | {rule['destination']} | {rule['protocol']} {', '.join(map(str, rule['ports']))} | {condition} | {rule['description']} |")
    lines += ["", "## Uygulama sınırları", "",
              "KKBS-INT-01 ve KKBS-APP-01 aynı L2 ağındadır. Aralarındaki trafik FW-01 üzerinden geçmez. VM firewall, guest firewall, API yetkilendirmesi ve IP/MAC kısıtları birlikte uygulanmalıdır.", "",
              "set:agent-vms: FW-01, MGMT-01, DMZ-PORTAL-01, KKBS-INT-01, KKBS-APP-01 ve OT-SIM-01. set:managed-vms: MGMT-01 dışındaki lab VM'leri. İstemci adresleri topology.json içindedir.", "",
              "overbroad_api bir uygulama yetki profilidir. Firewall kuralı üretmez; yeni API rolü henüz uygulanmamıştır.", "",
              "RED → KKBS/OT/SOC/MGMT/DISPLAY, DMZ → APP/OT/Proxmox ve INT → OT doğrudan erişimleri kapalıdır. PostgreSQL 5432 ve indexer 9200 ağlara açılmaz.", "",
              "DNS TCP/UDP 53 ve NTP UDP 123 için her bölgeden yalnız kendi FW ağ geçidine erişim planlanmıştır. Gerçek internet çıkışı bu planda yoktur."]
    (output / "firewall-review.md").write_text("\n".join(lines) + "\n", encoding="utf-8")
    rows = ["# VM kaynak planı", "", "| VM | Bölge | Adres | vCPU | RAM GiB | Disk GiB |", "|---|---|---|---:|---:|---:|"]
    rows += [f"| {v['name']} | {v['zone']} | {v['ansible_host']} | {v['vcpu']} | {v['ram_gib']} | {v['disk_gib']} |" for v in topology["vms"]]
    rows += ["| **Toplam** | 8 VM / 7 ağ | | **20** | **26** | **360** |", "", "İmajlar, yedekler ve snapshot alanı toplama dahil değildir. Bu dosya dağıtım kanıtı değildir."]
    (output / "summary.md").write_text("\n".join(rows) + "\n", encoding="utf-8")
    return inventory, plan


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output-dir", type=Path, default=ROOT / "build/infra")
    args = parser.parse_args()
    render(read_json(ROOT / "infra/topology.json"), read_json(ROOT / "infra/firewall-policy.json"), args.output_dir)
    print(f"PASS: Envanter, VM planı ve erişim incelemesi üretildi: {args.output_dir}")
