"""Host guards must fail before changing a Proxmox network or another VM."""
import copy
import json
from pathlib import Path
from types import SimpleNamespace
import unittest
from unittest.mock import patch

from deploy import host

TOPOLOGY = json.loads((Path(__file__).resolve().parents[1] / 'infra/topology.json').read_text())


class NetworkOwnershipTests(unittest.TestCase):
    def setUp(self):
        self.saved = {'lab_id': 'KALKAN-1', 'topology': copy.deepcopy(TOPOLOGY)}
        self.links = [{'ifname': 'vmbr10', 'ifindex': 10, 'linkinfo': {'info_kind': 'bridge'}},
                      {'ifname': 'tap100i0', 'master': 'vmbr10'},
                      {'ifname': 'vmbr20', 'ifindex': 20, 'linkinfo': {'info_kind': 'bridge'}},
                      {'ifname': 'tap140i0', 'master': 'vmbr20'}]
        self.routes = [{'dst': '10.77.10.0/24', 'dev': 'vmbr10'},
                       {'dst': '10.77.20.0/24', 'dev': 'vmbr10', 'gateway': '10.77.10.1'},
                       {'dst': 'default', 'dev': 'vmbr0', 'gateway': '192.0.2.1'}]

    def check(self, saved=None, links=None, routes=None):
        host.validate_network_inventory(TOPOLOGY, self.saved if saved is None else saved,
                                        self.links if links is None else links,
                                        self.routes if routes is None else routes)

    def test_clean_host_and_partial_install_can_continue(self):
        host.validate_network_inventory(TOPOLOGY, None, [{'ifname': 'vmbr0'}], [])
        self.check()
        self.check(links=[], routes=[])

    def test_bridge_without_recorded_ownership_is_rejected(self):
        with self.assertRaisesRegex(RuntimeError, 'Bridge'):
            host.validate_network_inventory(TOPOLOGY, None, self.links, [])

    def test_physical_bridge_port_is_rejected_even_after_previous_install(self):
        with self.assertRaisesRegex(RuntimeError, 'fiziksel'):
            self.check(links=self.links + [{'ifname': 'eno1', 'master': 'vmbr20'}])

    def test_vm_tap_connected_to_wrong_lab_bridge_is_rejected(self):
        with self.assertRaisesRegex(RuntimeError, 'fiziksel'):
            self.check(links=self.links + [{'ifname': 'tap150i0', 'master': 'vmbr20'}])

    def test_changed_topology_or_replaced_bridge_is_rejected(self):
        changed=copy.deepcopy(self.saved)
        changed['topology']['networks'][0]['cidr']='10.77.11.0/24'
        with self.assertRaisesRegex(RuntimeError, 'Bridge'):
            self.check(saved=changed)
        links=copy.deepcopy(self.links)
        links[0]['linkinfo']['info_kind']='vlan'
        with self.assertRaisesRegex(RuntimeError, 'başka tür'):
            self.check(links=links)

    def test_foreign_overlapping_route_is_rejected_on_retry(self):
        for route in [{'dst': '10.77.20.0/24', 'dev': 'vmbr0'},
                      {'dst': '10.77.0.0/16', 'dev': 'tun0'},
                      {'dst': '10.77.20.0/24', 'dev': 'vmbr10', 'gateway': '10.77.10.99'}]:
            with self.subTest(route=route), self.assertRaisesRegex(RuntimeError, 'çakışmaktadır'):
                self.check(routes=self.routes + [route])


class BootstrapIsolationTests(unittest.TestCase):
    def test_finished_install_blocks_established_lab_egress_only(self):
        text=host.bootstrap_firewall({'topology': TOPOLOGY, 'uplink':'vmbr0', 'maintenance':False})
        self.assertIn('hook forward priority -10; policy accept',text)
        self.assertIn('oifname "vmbr0" drop',text)
        self.assertNotIn('ct state',text)
        self.assertNotIn('masquerade',text)
        self.assertNotIn('flush ruleset',text)
        self.assertNotIn('10.77.0.0/16',text)
        for network in TOPOLOGY['networks']:self.assertIn(network['cidr'],text)

    def test_maintenance_nat_uses_only_exact_lab_subnets(self):
        text=host.bootstrap_firewall({'topology': TOPOLOGY, 'uplink':'vmbr0', 'maintenance':True})
        self.assertIn('oifname "vmbr0" masquerade',text)
        self.assertNotIn('drop',text)
        self.assertNotIn('10.77.0.0/16',text)


class HostRequirementsTests(unittest.TestCase):
    def test_version_architecture_and_kvm_are_required_before_inventory(self):
        with patch.object(host.os, 'geteuid', return_value=0), patch.object(host.Path, 'is_dir', return_value=True), patch.object(host, 'run') as run:
            run.return_value=SimpleNamespace(stdout='pve-manager/8.4.1')
            with self.assertRaisesRegex(RuntimeError, '9.x'):host.facts()
            run.return_value=SimpleNamespace(stdout='pve-manager/9.0.1')
            with patch.object(host.platform, 'machine', return_value='aarch64'):
                with self.assertRaisesRegex(RuntimeError, 'x86_64'):host.facts()
            with patch.object(host.platform, 'machine', return_value='x86_64'), patch('builtins.open', side_effect=PermissionError()):
                with self.assertRaisesRegex(RuntimeError, 'KVM'):host.facts()
            self.assertTrue(all(call.args==('pveversion',) for call in run.call_args_list))

    def test_low_root_space_is_rejected_even_with_free_vm_storage(self):
        config={'available_disk_bytes':600*1024**3,'available_cache_bytes':1024**3,'node':'pve'}
        mem='MemTotal: 67108864 kB\nMemAvailable: 62914560 kB\n'
        with patch.object(host.Path, 'read_text', return_value=mem), patch.object(host, 'run', return_value=SimpleNamespace(stdout='[]')):
            with self.assertRaisesRegex(RuntimeError, 'local-lvm'):host.preflight(TOPOLOGY,config)

    def test_shared_vm_and_cache_filesystem_requires_combined_capacity(self):
        config={'available_disk_bytes':390*1024**3,'available_cache_bytes':390*1024**3,
                'cache_shared_with_vm_storage':True,'node':'pve'}
        mem='MemTotal: 67108864 kB\nMemAvailable: 62914560 kB\n'
        with patch.object(host.Path, 'read_text', return_value=mem), patch.object(host, 'run', return_value=SimpleNamespace(stdout='[]')):
            with self.assertRaisesRegex(RuntimeError, 'aynı dosya sisteminde'):host.preflight(TOPOLOGY,config)

    def test_stopped_existing_vms_still_need_memory_to_start(self):
        config={'available_disk_bytes':600*1024**3,'available_cache_bytes':100*1024**3,'node':'pve'}
        mem='MemTotal: 67108864 kB\nMemAvailable: 10485760 kB\n'
        stopped=[{'vmid':vm['vmid'],'node':'pve','type':'qemu','status':'stopped'} for vm in TOPOLOGY['vms']]
        with patch.object(host.Path, 'read_text', return_value=mem), patch.object(host, 'run', return_value=SimpleNamespace(stdout=json.dumps(stopped))) as run:
            with self.assertRaisesRegex(RuntimeError, 'RAM'):host.preflight(TOPOLOGY,config)
            self.assertEqual(run.call_count,1)

    def test_cluster_vmid_collision_is_rejected_without_local_qm_query(self):
        config={'available_disk_bytes':600*1024**3,'available_cache_bytes':100*1024**3,'node':'pve'}
        mem='MemTotal: 67108864 kB\nMemAvailable: 62914560 kB\n'
        remote=[{'vmid':100,'node':'other','type':'qemu'}]
        with patch.object(host.Path, 'read_text', return_value=mem), patch.object(host, 'run', return_value=SimpleNamespace(stdout=json.dumps(remote))) as run:
            with self.assertRaisesRegex(RuntimeError, 'başka node'):host.preflight(TOPOLOGY,config)
            self.assertEqual(run.call_count,1)


if __name__=='__main__':unittest.main()
