import json
from pathlib import Path
import re
import sys
import unittest
import xml.etree.ElementTree as ET

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/"tools"))
from watch_wazuh import render


class WazuhContract(unittest.TestCase):
    def test_generated_events_match_the_supplied_rule_fields(self):
        root=Path(__file__).resolve().parents[1]
        rules=ET.parse(root/"wazuh/kalkan_rules.xml").getroot()
        self.assertEqual(len({r.attrib["id"] for r in rules}),len(rules))
        logs=[json.loads(line) for line in (root/"wazuh/fixtures.jsonl").read_text().splitlines()]
        expectations=json.loads((root/"wazuh/expected.json").read_text())
        # Static contract check only; actual Wazuh evaluation uses tools/test_wazuh.py.
        for expected in expectations:
            event=logs[expected["line"]-1]
            matches=[r for r in rules if int(r.attrib["level"])>0 and all(re.search(f.text,str(event.get(f.attrib["name"],""))) for f in r.findall("field"))]
            self.assertEqual([r.attrib["id"] for r in matches],[str(expected["rule_id"])])
        normal={"app":"kalkan1","event_type":"telemetry.sample"}
        self.assertFalse(any(int(r.attrib["level"])>0 and all(re.search(f.text,str(normal.get(f.attrib["name"],""))) for f in r.findall("field")) for r in rules))
    def test_watcher_accepts_only_wazuh_alert_envelopes(self):
        event={"app":"kalkan1","run_id":"r","event_seq":12,"event_type":"integrity.position_mismatch"}
        self.assertIsNone(render(event))
        alert={"id":"1.2","data":event,"rule":{"id":"110102"}}
        result=render(alert,"r")
        self.assertIn("--event-seq 12",result);self.assertIn("--alert-id 1.2",result)
        self.assertIsNone(render(alert,"other-run"));self.assertIsNone(render({"data":[],"rule":{}}))
