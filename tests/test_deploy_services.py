import pathlib
import tempfile
import unittest
from unittest.mock import patch
import xml.etree.ElementTree as ET

from lab import node_setup


class AgentConfigurationTests(unittest.TestCase):
    def test_late_application_logs_are_collected_and_configuration_is_repeatable(self):
        with tempfile.TemporaryDirectory() as directory:
            root = pathlib.Path(directory)
            config = root / 'var/ossec/etc/ossec.conf'
            config.parent.mkdir(parents=True)
            config.write_text('''<ossec_config><client><server><address>10.77.50.20</address></server></client>
<localfile><log_format>syslog</log_format><location>/var/log/auth.log</location></localfile>
</ossec_config><ossec_config><active-response><disabled>yes</disabled></active-response></ossec_config>''')

            def local_path(value):
                return root / str(value).lstrip('/')

            with patch.object(node_setup, 'Path', side_effect=local_path), \
                    patch.object(node_setup, 'put') as put, \
                    patch.object(node_setup, 'command') as command:
                node_setup.configure_agent('KKBS-APP-01')
                node_setup.configure_agent('KKBS-APP-01')

            parsed = ET.fromstring('<all>' + config.read_text() + '</all>')
            self.assertEqual(len(parsed.findall('ossec_config')), 2)
            self.assertEqual(parsed.findtext('ossec_config/client/server/address'), '10.77.50.20')
            self.assertEqual(parsed.findtext('ossec_config/active-response/disabled'), 'yes')
            locations = [node.findtext('location') for node in parsed.findall('ossec_config/localfile')]
            self.assertEqual(locations.count('/var/log/auth.log'), 1)
            self.assertEqual(locations.count('/var/log/kalkan/events.jsonl'), 1)
            self.assertFalse((root / 'var/log/kalkan/events.jsonl').exists())
            self.assertEqual(len(parsed.findall('ossec_config/syscheck/directories')), 2)
            command.assert_any_call('augenrules', '--load')
            command.assert_any_call('systemctl', 'enable', 'wazuh-agent')
            self.assertEqual(command.call_args.args, ('systemctl', 'restart', 'wazuh-agent'))
            put.assert_called_with('/etc/audit/rules.d/70-kalkan.rules', '-b 8192\n')

    def test_invalid_agent_configuration_stops_before_starting_agent(self):
        with tempfile.TemporaryDirectory() as directory:
            config = pathlib.Path(directory) / 'ossec.conf'
            config.write_text('<invalid/>')
            with patch.object(node_setup, 'Path', return_value=config), \
                    patch.object(node_setup, 'command') as command:
                with self.assertRaisesRegex(RuntimeError, 'ossec_config'):
                    node_setup.configure_agent('KKBS-APP-01')
            command.assert_not_called()


if __name__ == '__main__':
    unittest.main()
