"""Download official prerequisites, verify checksums, and retain an immutable local lock."""
import hashlib
import json
from pathlib import Path
import re
import shutil
import tarfile
import urllib.request

ROOT=Path(__file__).resolve().parents[1]
CACHE=ROOT/'.local/cache'
REQUIRED_FILES=frozenset({'ubuntu-SHA256SUMS','ubuntu.img','kali-SHA256SUMS',
    'kali.tar.xz','kali.img','ligolo-checksums.txt','ligolo-agent.tar.gz',
    'ligolo-agent','ligolo-proxy.tar.gz','ligolo-proxy','wazuh-install.sh','GPG-KEY-WAZUH'})


def sha256(path):
    digest=hashlib.sha256()
    with Path(path).open('rb') as source:
        for chunk in iter(lambda:source.read(1024*1024),b''):digest.update(chunk)
    return digest.hexdigest()


def download(url,path,digest=None,refresh=False):
    path=Path(path)
    if not refresh and path.exists() and (digest is None or sha256(path)==digest):return path
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
        if len(parts)>=2 and re.fullmatch(r'[0-9a-fA-F]{64}',parts[0]):result[parts[-1].lstrip('*')]=parts[0].lower()
    return result


def extract_one(archive,target,suffixes=None,member_name=None):
    # Before the completed lock exists, an old target may be an interrupted extraction.
    # Always derive it again from the checksum-verified archive and replace atomically.
    target=Path(target);temporary=target.with_name(target.name+'.part')
    try:
        with tarfile.open(archive) as package:
            candidates=[x for x in package.getmembers() if x.isfile() and (member_name is None or Path(x.name).name==member_name)
                        and (suffixes is None or Path(x.name).suffix in suffixes)]
            if not candidates:raise RuntimeError('Beklenen dosya arşivde yok: '+str(archive))
            selected=max(candidates,key=lambda x:x.size)
            with package.extractfile(selected) as source,temporary.open('wb') as output:shutil.copyfileobj(source,output,1024*1024)
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)
    return target


def validate_lock(saved):
    if not isinstance(saved,list) or any(not isinstance(row,dict) for row in saved):
        raise RuntimeError('İndirme kilidi geçerli bir dosya listesi değil.')
    names=[row.get('file') for row in saved]
    if (any(not isinstance(name,str) for name in names)
            or len(names)!=len(REQUIRED_FILES) or set(names)!=REQUIRED_FILES):
        raise RuntimeError('İndirme kilidi eksik veya bu teslimle uyumsuz; mevcut cache dosyalarını koruyup kilidi inceleyin.')
    for row in saved:
        path=CACHE/row['file']
        if (not re.fullmatch(r'[0-9a-f]{64}',str(row.get('sha256','')))
                or not path.is_file() or sha256(path)!=row['sha256']):
            raise RuntimeError('Önceki indirme kilidiyle uyuşmayan dosya: '+row['file'])


def prepare():
    CACHE.mkdir(parents=True,exist_ok=True)
    lock_path=CACHE/'artifacts.lock.json'
    if lock_path.exists():
        saved=json.loads(lock_path.read_text())
        validate_lock(saved)
        return saved
    records=[]
    def add(url,name,digest=None,refresh=False):
        path=download(url,CACHE/name,digest,refresh=refresh)
        records.append({'file':name,'url':url,'sha256':sha256(path),'bytes':path.stat().st_size})
        return path
    base='https://cloud-images.ubuntu.com/noble/current/'
    checks=add(base+'SHA256SUMS','ubuntu-SHA256SUMS',refresh=True)
    image='noble-server-cloudimg-amd64.img'
    add(base+image,'ubuntu.img',sums(checks)[image])
    base='https://kali.download/cloud-images/kali-2026.2/'
    checks=add(base+'SHA256SUMS','kali-SHA256SUMS',refresh=True)
    name='kali-linux-2026.2-cloud-genericcloud-amd64.tar.xz'
    image=add(base+name,'kali.tar.xz',sums(checks)[name])
    disk=extract_one(image,CACHE/'kali.img',suffixes={'.raw','.qcow2','.img'})
    records.append({'file':'kali.img','source':'kali.tar.xz','sha256':sha256(disk),'bytes':disk.stat().st_size})
    base='https://github.com/nicocha30/ligolo-ng/releases/download/v0.9.2/'
    checks=add(base+'ligolo-ng_0.9.2_checksums.txt','ligolo-checksums.txt',refresh=True)
    for component in ('agent','proxy'):
        name=f'ligolo-ng_{component}_0.9.2_linux_amd64.tar.gz'
        archive=add(base+name,'ligolo-'+component+'.tar.gz',sums(checks)[name])
        binary=extract_one(archive,CACHE/('ligolo-'+component),member_name=component)
        binary.chmod(0o755)
        records.append({'file':binary.name,'source':archive.name,'sha256':sha256(binary),'bytes':binary.stat().st_size})
    add('https://packages.wazuh.com/4.14/wazuh-install.sh','wazuh-install.sh')
    add('https://packages.wazuh.com/key/GPG-KEY-WAZUH','GPG-KEY-WAZUH')
    validate_lock(records)
    temporary=lock_path.with_suffix('.json.part')
    temporary.write_text(json.dumps(records,indent=2)+'\n')
    temporary.replace(lock_path)
    return records
