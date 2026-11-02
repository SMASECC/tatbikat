"""Artifact retry integrity and non-destructive repository bootstrap regressions."""
import hashlib
import io
from pathlib import Path
import tarfile
import tempfile
import unittest
from unittest.mock import patch

from deploy import artifacts, bootstrap


class ArtifactIntegrityTests(unittest.TestCase):
    def test_unlocked_checksum_manifest_can_refresh_after_image_update(self):
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'SHA256SUMS';target.write_bytes(b'old manifest')
            with patch.object(artifacts.urllib.request,'urlopen',return_value=io.BytesIO(b'new manifest')) as fetch:
                artifacts.download('https://example.invalid/SHA256SUMS',target,refresh=True)
            fetch.assert_called_once()
            self.assertEqual(target.read_bytes(),b'new manifest')

    def test_interrupted_extraction_is_replaced_from_verified_archive(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);archive=root/'agent.tar.gz';target=root/'agent'
            with tarfile.open(archive,'w:gz') as package:
                payload=b'complete verified executable'
                member=tarfile.TarInfo('agent');member.size=len(payload)
                package.addfile(member,io.BytesIO(payload))
            target.write_bytes(b'partial')
            artifacts.extract_one(archive,target,member_name='agent')
            self.assertEqual(target.read_bytes(),payload)
            self.assertFalse((root/'agent.part').exists())

    def test_failed_extraction_preserves_existing_target(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);archive=root/'bad.tar.gz';target=root/'agent'
            target.write_bytes(b'previous valid binary')
            with tarfile.open(archive,'w:gz'):
                pass
            with self.assertRaisesRegex(RuntimeError,'Beklenen dosya'):
                artifacts.extract_one(archive,target,member_name='agent')
            self.assertEqual(target.read_bytes(),b'previous valid binary')
            self.assertFalse((root/'agent.part').exists())

    def test_empty_or_incomplete_lock_cannot_skip_preparation(self):
        with self.assertRaisesRegex(RuntimeError,'eksik'):
            artifacts.validate_lock([])
        with self.assertRaisesRegex(RuntimeError,'eksik'):
            artifacts.validate_lock([{'file':'ubuntu.img','sha256':'0'*64}])

    def test_lock_checks_all_required_artifacts_and_corruption(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(artifacts,'CACHE',Path(directory)):
            rows=[]
            for name in artifacts.REQUIRED_FILES:
                data=name.encode();(Path(directory)/name).write_bytes(data)
                rows.append({'file':name,'sha256':hashlib.sha256(data).hexdigest()})
            artifacts.validate_lock(rows)
            (Path(directory)/'ligolo-agent').write_bytes(b'corrupt')
            with self.assertRaisesRegex(RuntimeError,'ligolo-agent'):
                artifacts.validate_lock(rows)

    def test_checksum_mismatch_does_not_replace_valid_file(self):
        with tempfile.TemporaryDirectory() as directory:
            target=Path(directory)/'disk';target.write_bytes(b'old')
            with patch.object(artifacts.urllib.request,'urlopen',return_value=io.BytesIO(b'bad')):
                with self.assertRaisesRegex(RuntimeError,'SHA256'):
                    artifacts.download('https://example.invalid/disk',target,'0'*64)
            self.assertEqual(target.read_bytes(),b'old')
            self.assertFalse(target.with_suffix('.part').exists())


class BootstrapSourcesTests(unittest.TestCase):
    def test_enterprise_sources_are_backed_up_and_debian_is_preserved_on_rerun(self):
        with tempfile.TemporaryDirectory() as directory:
            root=Path(directory);sources=root/'sources.list.d';sources.mkdir()
            legacy=root/'sources.list';backup=root/'backup'
            debian='deb https://deb.debian.org/debian trixie main'
            original=debian+'\ndeb https://enterprise.proxmox.com/debian/pve trixie pve-enterprise\n'
            legacy.write_text(original)
            enterprise=sources/'enterprise.sources'
            enterprise.write_text('Types: deb\nURIs: https://enterprise.proxmox.com/debian/pve\nSuites: trixie\nComponents: pve-enterprise\n')
            for _ in range(2):bootstrap.community_sources(sources,legacy,backup)
            self.assertEqual((backup/'sources.list').read_text(),original)
            self.assertIn(debian,legacy.read_text().splitlines())
            self.assertIn('# deb https://enterprise.proxmox.com',legacy.read_text())
            self.assertEqual(enterprise.read_text().count('Enabled: no'),1)
            self.assertIn('Signed-By: /usr/share/keyrings/proxmox-archive-keyring.gpg',(sources/'kalkan-pve.sources').read_text())


if __name__=='__main__':unittest.main()
