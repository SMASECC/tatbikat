import json
from pathlib import Path
import subprocess
import tempfile
import unittest
from unittest.mock import patch

from deploy import kalkan, quickstart


class InstallerTests(unittest.TestCase):
    def test_invalid_preflight_never_changes_host(self):
        with patch.object(quickstart, 'preflight', side_effect=RuntimeError('VMID collision')), patch.object(quickstart, 'execute') as execute:
            with self.assertRaisesRegex(RuntimeError, 'collision'):
                quickstart.setup(True)
            execute.assert_not_called()

    def test_failed_install_never_records_success_or_runs_acceptance(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(quickstart, 'ROOT', Path(directory)), patch.object(quickstart, 'preflight'), patch.object(quickstart, 'execute', side_effect=[None, subprocess.CalledProcessError(4, ['install'])]), patch.object(quickstart, 'verify_services') as verify:
            with self.assertRaises(subprocess.CalledProcessError):
                quickstart.setup(True)
            verify.assert_not_called()
            self.assertFalse((Path(directory) / '.local/install-complete.json').exists())

    def test_completed_install_does_not_reset_live_exercise(self):
        with tempfile.TemporaryDirectory() as directory:
            root = Path(directory)
            (root / '.local').mkdir()
            (root / '.local/install-complete.json').write_text('{}')
            with patch.object(quickstart, 'ROOT', root), patch.object(quickstart, 'preflight'), patch.object(quickstart, 'execute') as execute, patch.object(quickstart, 'verify_services') as verify:
                quickstart.setup(True)
                execute.assert_not_called()
                verify.assert_called_once()

    def test_acceptance_timeout_propagates_failure(self):
        with patch.object(quickstart, 'execute', side_effect=subprocess.CalledProcessError(1, ['check'])), patch.object(quickstart.time, 'monotonic', side_effect=[0, 301]), patch.object(quickstart.time, 'sleep'):
            with self.assertRaises(subprocess.CalledProcessError):
                quickstart.verify_services()

    def test_completed_bootstrap_install_and_check_required_for_success(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(quickstart, 'ROOT', Path(directory)), patch.object(quickstart, 'preflight'), patch.object(quickstart, 'execute') as execute, patch.object(quickstart, 'verify_services') as verify:
            quickstart.setup(True)
            self.assertEqual(execute.call_args_list[0].args[0][-1], '--community-repo')
            self.assertEqual(execute.call_args_list[1].args[0][-1], 'install')
            verify.assert_called_once()
            self.assertEqual(json.loads((Path(directory) / '.local/install-complete.json').read_text())['status'], 'passed')

    def test_only_one_owned_unused_disk_can_resume_import(self):
        self.assertEqual(kalkan.imported_volume('unused0: local-lvm:vm-100-disk-0\n', '100', 'local-lvm'), 'local-lvm:vm-100-disk-0')
        self.assertEqual(kalkan.imported_volume('unused0: local:100/vm-100-disk-0.raw\n', '100', 'local'), 'local:100/vm-100-disk-0.raw')
        for config in ('unused0: local-lvm:vm-999-disk-0', 'unused0: other:vm-100-disk-0', 'unused0: local-lvm:vm-100-disk-0\nunused1: local-lvm:vm-100-disk-1'):
            with self.assertRaises(RuntimeError):
                kalkan.imported_volume(config, '100', 'local-lvm')

    def test_disk_resize_is_repeatable_and_refuses_shrink(self):
        vm = dict(name='FW-01', vmid=100, disk_gib=20)
        with patch.object(kalkan, 'run') as run:
            kalkan.resize_disk(vm, 'scsi0: local-lvm:vm-100-disk-0,size=20G')
            run.assert_not_called()
            kalkan.resize_disk(vm, 'scsi0: local-lvm:vm-100-disk-0,size=2G')
            run.assert_called_once_with('qm', 'resize', '100', 'scsi0', '20G')
            with self.assertRaises(RuntimeError):
                kalkan.resize_disk(vm, 'scsi0: local-lvm:vm-100-disk-0,size=32G')

    def test_guest_agent_identity_is_pinned_and_key_change_rejected(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(kalkan, 'LOCAL', Path(directory)):
            kalkan.record_host_key('FW-01', 'ssh-ed25519 AAAA guest-comment')
            kalkan.record_host_key('FW-01', 'ssh-ed25519 AAAA')
            known = Path(directory) / 'known_hosts'
            self.assertEqual(known.read_text(), '10.77.10.1 ssh-ed25519 AAAA\n')
            with self.assertRaisesRegex(RuntimeError, 'değişmiş'):
                kalkan.record_host_key('FW-01', 'ssh-ed25519 BBBB')
            self.assertEqual(known.read_text(), '10.77.10.1 ssh-ed25519 AAAA\n')

    def test_install_failure_removes_temporary_host_nat(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(kalkan, 'LOCAL', Path(directory)), patch.object(kalkan, 'plan', return_value={'maintenance': True}), patch.object(kalkan, 'prepare_artifacts'), patch.object(kalkan, 'install_configured', side_effect=RuntimeError('failed playbook')), patch.object(kalkan, 'Path') as path, patch.object(kalkan.host, 'network') as network:
            path.return_value.exists.return_value = True
            with self.assertRaisesRegex(RuntimeError, 'failed playbook'):
                kalkan.install()
            network.assert_called_once_with({'maintenance': False})

    def test_retry_opens_firewall_before_other_vm_boot_and_packages(self):
        cfg={'storage':'local-lvm'}
        order=[]
        # Stop at the next VM: enough to prove maintenance precedes its network use.
        def provision(vm,*args):
            order.append(vm['name'])
            if vm['name']!='FW-01':raise RuntimeError('stop after firewall')
        with patch.object(kalkan.host,'network'), patch.object(kalkan,'Path'), patch.object(kalkan.shutil,'copyfile'), patch.object(kalkan,'run'), patch.object(kalkan,'snippets',return_value=('local',Path('/tmp'))), patch.object(kalkan,'provision_vm',side_effect=provision), patch.object(kalkan,'wait_for_vm'), patch.object(kalkan,'guest_maintenance',side_effect=lambda enabled:order.append('maintenance')):
            with self.assertRaisesRegex(RuntimeError,'stop after firewall'):
                kalkan.install_configured(cfg)
        self.assertEqual(order[:3],['FW-01','maintenance','MGMT-01'])


if __name__ == '__main__':
    unittest.main()
