"""Download official prerequisites, verify checksums, and retain an immutable local lock."""
import hashlib
import json
from pathlib import Path
import shutil
import tarfile
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'.local/cache'


def sha256(path):
    digest=hashlib.sha256()
    with Path(path).open('rb') as source:
        for chunk in iter(lambda:source.read(1024*1024),b''):digest.update(chunk)
    return digest.hexdigest()


def download(url,path,digest=None):
    path=Path(path)
    if path.exists() and (digest is None or sha256(path)==digest):return path
    temporary=path.with_suffix(path.suffix+'.part')
    request=urllib.request.Request(url,headers={'User-Agent':'KALKAN-1-Lab-Installer/0.3'})
    with urllib.request.urlopen(request,timeout=60) as source,temporary.open('wb') as target:
        shutil.copyfileobj(source,target,1024*1024)
    actual=sha256(temporary)
    if digest and actual!=digest:temporary.unlink();raise RuntimeError('SHA256 uyuşmadı: '+path.name)
    temporary.replace(path)
    return path


def sums(path):
    result={}
    for line in Path(path).read_text().splitlines():
        parts=line.split()
        if len(parts)>=2 and len(parts[0])==64:result[parts[-1].lstrip('*')]=parts[0]
    return result


def extract_one(archive,target,suffixes=None,member_name=None):
    if target.exists():return target
    with tarfile.open(archive) as package:
        candidates=[x for x in package.getmembers() if x.isfile() and (member_name is None or Path(x.name).name==member_name)
                    and (suffixes is None or Path(x.name).suffix in suffixes)]
        if not candidates:raise RuntimeError('Beklenen dosya arşivde yok: '+str(archive))
        selected=max(candidates,key=lambda x:x.size)
        with package.extractfile(selected) as source,target.open('wb') as output:shutil.copyfileobj(source,output,1024*1024)
    return target


def prepare():
    CACHE.mkdir(parents=True,exist_ok=True)
    lock_path=CACHE/'artifacts.lock.json'
    if lock_path.exists():
        saved=json.loads(lock_path.read_text())
        for row in saved:
            path=CACHE/row['file']
            if not path.is_file() or sha256(path)!=row['sha256']:
                raise RuntimeError('Önceki indirme kilidiyle uyuşmayan dosya: '+row['file'])
        return saved
    records=[]
    def add(url,name,digest=None):
        path=download(url,CACHE/name,digest)
        records.append({'file':name,'url':url,'sha256':sha256(path),'bytes':path.stat().st_size})
        return path
    base='https://cloud-images.ubuntu.com/noble/current/'
    checks=add(base+'SHA256SUMS','ubuntu-SHA256SUMS')
    image='noble-server-cloudimg-amd64.img'
    add(base+image,'ubuntu.img',sums(checks)[image])
    base='https://kali.download/cloud-images/kali-2026.2/'
    checks=add(base+'SHA256SUMS','kali-SHA256SUMS')
    name='kali-linux-2026.2-cloud-genericcloud-amd64.tar.xz'
    image=add(base+name,'kali.tar.xz',sums(checks)[name])
    disk=extract_one(image,CACHE/'kali.img',suffixes={'.raw','.qcow2','.img'})
    records.append({'file':'kali.img','source':'kali.tar.xz','sha256':sha256(disk),'bytes':disk.stat().st_size})
    base='https://github.com/nicocha30/ligolo-ng/releases/download/v0.9.2/'
    checks=add(base+'ligolo-ng_0.9.2_checksums.txt','ligolo-checksums.txt')
    for component in ('agent','proxy'):
        name=f'ligolo-ng_{component}_0.9.2_linux_amd64.tar.gz'
        archive=add(base+name,'ligolo-'+component+'.tar.gz',sums(checks)[name])
        binary=extract_one(archive,CACHE/('ligolo-'+component),member_name=component)
        binary.chmod(0o755)
        records.append({'file':binary.name,'source':archive.name,'sha256':sha256(binary),'bytes':binary.stat().st_size})
    add('https://packages.wazuh.com/4.14/wazuh-install.sh','wazuh-install.sh')
    add('https://packages.wazuh.com/key/GPG-KEY-WAZUH','GPG-KEY-WAZUH')
    lock_path.write_text(json.dumps(records,indent=2)+'\n')
    return records
