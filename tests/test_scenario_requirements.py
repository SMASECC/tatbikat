from pathlib import Path
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "scripts"))
from scenario_plan import load_plan, validate


class ExerciseRequirementsContractTests(unittest.TestCase):
    def setUp(self):
        self.plan = load_plan()

    def test_current_requirements_resolve_existing_sources_and_topology(self):
        self.assertEqual(validate(self.plan), [])

    def test_missing_blue_evidence_is_rejected(self):
        self.plan["phases"][2]["log_sources"] = []
        self.assertTrue(any("kanıt" in message for message in validate(self.plan)))

    def test_nonexistent_script_cannot_be_reported_as_available(self):
        self.plan["phases"][1]["script"]["status"] = "model_only"
        self.plan["phases"][1]["script"]["path"] = "scenarios/red-blue/01_dmz_service_rce.py"
        self.assertTrue(any("Script kaynağı" in message for message in validate(self.plan)))

    def test_unimplemented_wazuh_rule_cannot_be_claimed(self):
        self.plan["phases"][1]["existing_rule_ids"] = [119999]
        self.assertTrue(any("Wazuh kuralı" in message for message in validate(self.plan)))

    def test_dependency_cycle_is_rejected(self):
        self.plan["components"][0]["requires"] = ["pivot-path"]
        self.assertTrue(any("döngü" in message for message in validate(self.plan)))

    def test_normal_profile_cannot_contain_the_stolen_key(self):
        self.plan["profiles"]["normal"]["legacy_private_key_on_dmz"] = True
        self.assertTrue(any("Profil" in message for message in validate(self.plan)))

    def test_unimplemented_live_chain_cannot_be_marked_ready(self):
        self.plan["live_ready"] = True
        self.assertTrue(any("canlı senaryo hazır" in message for message in validate(self.plan)))


if __name__ == "__main__":
    unittest.main()
