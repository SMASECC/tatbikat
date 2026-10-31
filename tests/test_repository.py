import copy
import json
from pathlib import Path
import sys
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from validate_repo import read_json, validate_topology, validate_policy
from render_infra import render


class InfrastructureContractTests(unittest.TestCase):
    def setUp(self):
        self.topology = read_json(ROOT / "infra/topology.json")
        self.policy = read_json(ROOT / "infra/firewall-policy.json")

    def test_current_plan_is_valid(self):
        self.assertEqual(validate_topology(self.topology), [])
        self.assertEqual(validate_policy(self.policy, self.topology), [])

    def test_overlapping_subnets_are_rejected(self):
        self.topology["networks"][1]["cidr"] = "10.77.10.0/24"
        self.assertTrue(any("çakış" in e for e in validate_topology(self.topology)))

    def test_non_firewall_dual_homing_is_rejected(self):
        self.topology["vms"][4]["interfaces"].append({"zone": "kkbs", "ip": "10.77.30.99"})
        self.assertTrue(any("birden fazla" in e for e in validate_topology(self.topology)))

    def test_duplicate_ip_is_rejected(self):
        self.topology["vms"][4]["interfaces"][0]["ip"] = "10.77.20.1"
        self.assertTrue(any("Tekrarlanan" in e for e in validate_topology(self.topology)))

    def test_legacy_external_subnet_is_rejected(self):
        self.topology["networks"][5]["cidr"] = "10.77.60.0/24"
        self.assertTrue(any("R1" in e for e in validate_topology(self.topology)))

    def test_normal_profile_cannot_enable_legacy_ssh(self):
        self.topology["profiles"]["normal"]["legacy_ssh"] = True
        self.assertTrue(any("istisnalarını" in e for e in validate_topology(self.topology)))

    def test_exercise_exception_cannot_leak_into_restored_profile(self):
        rule = next(r for r in self.policy["rules"] if r["id"] == "pivot-egress")
        rule["profiles"].append("restored")
        self.assertTrue(any("Tatbikat istisnası" in e for e in validate_policy(self.policy, self.topology)))

    def test_database_publication_is_rejected(self):
        self.policy["rules"][0]["ports"].append(5432)
        self.assertTrue(any("Veritabanı" in e for e in validate_policy(self.policy, self.topology)))

    def test_direct_red_access_to_application_is_rejected(self):
        self.policy["rules"][0]["destination"] = "host:KKBS-APP-01"
        self.assertTrue(any("RED doğrudan" in e for e in validate_policy(self.policy, self.topology)))

    def test_inventory_has_no_implicit_deployment_permission(self):
        with tempfile.TemporaryDirectory() as directory:
            inventory, plan = render(self.topology, self.policy, Path(directory))
            self.assertFalse(inventory["all"]["vars"]["deployment_configured"])
            self.assertEqual(plan["status"], "review_only_not_applied")
            hosts = [name for group in inventory["all"]["children"].values() for name in group["hosts"]]
            self.assertEqual(len(hosts), 8)
            self.assertEqual(len(set(hosts)), 8)
            loaded = json.loads((Path(directory) / "inventory.json").read_text())
            self.assertEqual(loaded, inventory)

    def test_render_does_not_mutate_source_topology(self):
        before = copy.deepcopy(self.topology)
        with tempfile.TemporaryDirectory() as directory:
            render(self.topology, self.policy, Path(directory))
        self.assertEqual(self.topology, before)


if __name__ == "__main__":
    unittest.main()
