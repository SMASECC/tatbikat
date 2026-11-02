"""Dedicated private bridges, bootstrap NAT and per-tap source guards for Proxmox."""
import ipaddress
import json
import os
import platform
import shutil
from pathlib import Path
import subprocess


def run(*args,check=True):
    return subprocess.run(args,check=check,text=True,capture_output=True)


def facts():
    if os.geteuid()!=0 or not Path('/etc/pve').is_dir():raise RuntimeError('Bu adım Proxmox host üzerinde root olarak çalışmalıdır.')
    version=run('pveversion').stdout.strip()
    if not version.startswith('pve-manager/9.'):
        raise RuntimeError('Bu kurulum Proxmox VE 9.x gerektirir: '+version)
    if platform.machine()!='x86_64':raise RuntimeError('Lab imajları x86_64 işlemci gerektirir.')
    try:
        with open('/dev/kvm','rb+',buffering=0):pass
    except OSError as error:
        raise RuntimeError('KVM erişimi yok; BIOS/UEFI sanallaştırmasını (VT-x/AMD-V) etkinleştirin.') from error
    node=run('hostname','-s').stdout.strip()
    nodes=json.loads(run('pvesh','get','/nodes','--output-format','json').stdout)
    if node not in {n['node'] for n in nodes}:raise RuntimeError('Yerel Proxmox node adı doğrulanamadı.')
    storage=json.loads(run('pvesh','get',f'/nodes/{node}/storage','--content','images','--output-format','json').stdout)
    options=[s for s in storage if s.get('active') and s.get('enabled',1)]
    if not options:raise RuntimeError('Aktif VM disk deposu bulunamadı.')
    selected=next((s for s in options if s['storage']=='local-lvm'),max(options,key=lambda x:x.get('avail',0)))
    route=json.loads(run('ip','-j','route','show','default').stdout)
    if len(route)!=1:raise RuntimeError('Tek bir etkin varsayılan ağ yolu gerekmektedir.')
    uplink=route[0]['dev']
    addresses=json.loads(run('ip','-j','address','show','dev',uplink).stdout)
    address=next((a['local'] for link in addresses for a in link['addr_info'] if a['family']=='inet'),None)
    if not address:raise RuntimeError('Varsayılan ağ arayüzünde yönetim için IPv4 adresi bulunamadı.')
    dns=[]
    for line in Path('/etc/resolv.conf').read_text().splitlines():
        if line.startswith('nameserver '):
            candidate=line.split()[1]
            try:
                ip=ipaddress.ip_address(candidate)
                if ip.version==4 and not ip.is_loopback:dns.append(candidate)
            except ValueError:pass
    if not dns:raise RuntimeError('Host üzerinde erişilebilir IPv4 DNS bulunamadı; /etc/resolv.conf ayarını tamamlayın.')
    capacity=json.loads(run('pvesh','get',f"/nodes/{node}/storage/{selected['storage']}/status",'--output-format','json').stdout)
    shared_cache=False
    if selected.get('type')=='dir':
        store=json.loads(run('pvesh','get','/storage/'+selected['storage'],'--output-format','json').stdout)
        store_path=store.get('path')
        if not store_path or not Path(store_path).is_dir():raise RuntimeError('VM directory deposunun yolu doğrulanamadı.')
        shared_cache=Path(store_path).stat().st_dev==Path(__file__).resolve().parents[1].stat().st_dev
    return {'node':node,'storage':selected['storage'],'available_disk_bytes':capacity['avail'],'cache_shared_with_vm_storage':shared_cache,'available_cache_bytes':shutil.disk_usage(Path(__file__).resolve().parents[1]).free,'uplink':uplink,'access_ip':address,'bootstrap_dns':dns[0]}


def mac(vmid,index=0):return f'02:77:00:{index:02x}:{vmid//100:02d}:{vmid%100:02d}'


def preflight(topology,config):
    if int(Path('/proc/meminfo').read_text().split('MemTotal:')[1].split()[0])<31*1024*1024:
        raise RuntimeError('Host RAM en az 32 GiB olmalıdır; önerilen kapasite 64 GiB veya üzeridir.')
    existing=json.loads(run('pvesh','get','/cluster/resources','--type','vm','--output-format','json').stdout)
    allocated={row['vmid'] for row in existing}
    running={row['vmid'] for row in existing if row.get('node')==config['node'] and row.get('type')=='qemu' and row.get('status')=='running'}
    available=int(Path('/proc/meminfo').read_text().split('MemAvailable:')[1].split()[0])*1024
    required=(2+sum(vm['ram_gib'] for vm in topology['vms'] if vm['vmid'] not in running))*1024**3
    if available<required:raise RuntimeError('Yeni VM belleği ve host rezervi için boş RAM yetersiz; mevcut VM yükünü azaltın.')
    remaining=20+sum(vm['disk_gib'] for vm in topology['vms'] if vm['vmid'] not in allocated)
    cache=Path(__file__).resolve().parents[1]/'.local/cache'
    cache_required=5+sum(size for name,size in [('ubuntu.img',4),('kali.img',15),('ligolo-agent',1)] if not (cache/name).is_file())
    if config.get('available_cache_bytes',0)<cache_required*1024**3:
        raise RuntimeError(f'Kaynak/cache dosya sisteminde yaklaşık {cache_required} GiB boş alan gerekir; local-lvm alanı /root alanı yerine geçmez.')
    if config.get('cache_shared_with_vm_storage') and min(config['available_disk_bytes'],config['available_cache_bytes'])<(remaining+cache_required)*1024**3:
        raise RuntimeError(f'VM diskleri ve cache aynı dosya sisteminde; toplam yaklaşık {remaining+cache_required} GiB boş alan gerekmektedir.')
    if config['available_disk_bytes']<remaining*1024**3:raise RuntimeError(f'Seçilen depoda yeni VM ve rezerv için {remaining} GiB boş alan gerekmektedir.')
    for vm in topology['vms']:
        hit=next((v for v in existing if v['vmid']==vm['vmid']),None)
        if hit:
            if hit.get('node')!=config['node'] or hit.get('type')!='qemu':
                raise RuntimeError(f"VMID çakışması: {vm['vmid']} başka node veya LXC üzerinde kullanılıyor.")
            text=run('qm','config',str(vm['vmid'])).stdout
            if 'KALKAN-1-MANAGED' not in text:raise RuntimeError(f"VMID çakışması: {vm['vmid']}; mevcut VM değiştirilmedi.")
    saved=Path('/etc/kalkan-host/config.json')
    previous=json.loads(saved.read_text()) if saved.exists() else None
    if previous is None and Path('/etc/network/interfaces.d/kalkan').exists():
        raise RuntimeError('Sahipliği doğrulanamayan /etc/network/interfaces.d/kalkan dosyası var; üzerine yazılmadı.')
    validate_network_inventory(topology,previous,json.loads(run('ip','-d','-j','link').stdout),
                               json.loads(run('ip','-j','route','show').stdout))


def validate_network_inventory(topology,previous,links,routes):
    """Adopt only previously recorded lab bridges/routes, including on retries."""
    if previous is not None and previous.get('lab_id')!='KALKAN-1':
        raise RuntimeError('Kaydedilmiş host ağ sahipliği doğrulanamadı.')
    owned={n['bridge']:n for n in (previous or {}).get('topology',{}).get('networks',[])}
    present={link['ifname']:link for link in links}
    for network in topology['networks']:
        name=network['bridge']
        if name not in present:continue
        if owned.get(name)!=network:
            raise RuntimeError('Bridge zaten kullanılıyor veya plan değişmiş: '+name)
        bridge=present[name]
        if bridge.get('linkinfo',{}).get('info_kind')!='bridge':
            raise RuntimeError('Lab bridge adı başka tür bir arayüzde kullanılıyor: '+name)
        expected={f"tap{vm['vmid']}i{index}" for vm in topology['vms'] for index,interface in enumerate(vm['interfaces']) if interface['zone']==network['id']}
        ports=[link['ifname'] for link in links if link.get('master') in (name,bridge.get('ifindex',-1))]
        if any(port not in expected for port in ports):
            raise RuntimeError('Lab bridge üzerinde yabancı/fiziksel port bulundu: '+name)
    for route in routes:
        if route.get('dst') in (None,'default'):continue
        try:subnet=ipaddress.ip_network(route['dst'])
        except ValueError:continue
        for network in topology['networks']:
            if not subnet.overlaps(ipaddress.ip_network(network['cidr'])):continue
            same_owned=owned.get(network['bridge'])==network and route['dst']==network['cidr']
            expected_route=(route.get('dev')==network['bridge'] and network['id']=='mgmt' and not route.get('gateway')) or (
                network['id']!='mgmt' and route.get('dev')=='vmbr10' and route.get('gateway')=='10.77.10.1')
            if not (same_owned and expected_route):
                raise RuntimeError('Lab adresleri mevcut host ağıyla çakışmaktadır: '+route['dst'])


def source_guard(config):
    lines=['table bridge kalkan_source {',' chain ingress { type filter hook prerouting priority -200; policy accept;']
    for vm in config['topology']['vms']:
        for index,interface in enumerate(vm['interfaces']):
            port=f"tap{vm['vmid']}i{index}"
            lines.append(f'  iifname "{port}" ether saddr != {mac(vm["vmid"],index)} drop')
            lines.append(f'  iifname "{port}" ether type ip6 drop')
            if vm['name']!='FW-01':
                lines.append(f'  iifname "{port}" ether type ip ip saddr != {interface["ip"]} drop')
                lines.append(f'  iifname "{port}" ether type arp arp saddr ip != {interface["ip"]} drop')
    return '\n'.join(lines+[' }','}'])+'\n'


def bootstrap_firewall(config):
    """Limit bootstrap NAT and post-bootstrap egress to exactly the lab subnets."""
    sources='{ '+', '.join(network['cidr'] for network in config['topology']['networks'])+' }'
    uplink=json.dumps(config['uplink'])
    lines=['table ip kalkan_bootstrap {']
    if config.get('maintenance'):
        lines += [' chain postrouting { type nat hook postrouting priority srcnat; policy accept;',
                  f'  ip saddr {sources} oifname {uplink} masquerade', ' }']
    else:
        # Drop established packets too: deleting a NAT rule alone leaves conntrack mappings.
        # A dedicated filter preserves unrelated host/forwarded traffic and firewall tables.
        lines += [' chain forward { type filter hook forward priority -10; policy accept;',
                  f'  ip saddr {sources} oifname {uplink} drop', ' }']
    return '\n'.join(lines+['}'])+'\n'


def network(config):
    directory=Path('/etc/kalkan-host')
    saved=directory/'config.json'
    previous=json.loads(saved.read_text()) if saved.exists() else None
    validate_network_inventory(config['topology'],previous,json.loads(run('ip','-d','-j','link').stdout),
                               json.loads(run('ip','-j','route','show').stdout))
    directory.mkdir(exist_ok=True)
    # Record validated ownership before mutation so a partial setup can be retried.
    descriptor=os.open(saved,os.O_WRONLY|os.O_CREAT|os.O_TRUNC,0o600)
    with os.fdopen(descriptor,'w') as output:json.dump(config,output)
    saved.chmod(0o600)
    interfaces=[]
    for n in config['topology']['networks']:
        name=n['bridge']
        if run('ip','link','show',name,check=False).returncode:
            run('ip','link','add',name,'type','bridge')
        run('ip','link','set',name,'up')
        interfaces += [f'auto {name}',f'iface {name} inet '+('static' if n['id']=='mgmt' else 'manual')]
        if n['id']=='mgmt':
            current=run('ip','-j','address','show','dev',name).stdout
            if '10.77.10.10' not in current:run('ip','address','add','10.77.10.10/24','dev',name)
            interfaces += ['    address 10.77.10.10/24']
        interfaces += ['    bridge-ports none','    bridge-stp off','    bridge-fd 0','']
        if n['id']!='mgmt':run('ip','route','replace',n['cidr'],'via','10.77.10.1','dev','vmbr10')
    Path('/etc/network/interfaces.d').mkdir(exist_ok=True)
    Path('/etc/network/interfaces.d/kalkan').write_text('\n'.join(interfaces))
    main=Path('/etc/network/interfaces');text=main.read_text()
    if 'source /etc/network/interfaces.d/*' not in text:
        if not (directory/'interfaces.before').exists():(directory/'interfaces.before').write_text(text)
        main.write_text(text.rstrip()+'\nsource /etc/network/interfaces.d/*\n')
    firewall=source_guard(config)
    if run('nft','list','table','bridge','kalkan_source',check=False).returncode==0:firewall='delete table bridge kalkan_source\n'+firewall
    if run('nft','list','table','ip','kalkan_bootstrap',check=False).returncode==0:firewall+='delete table ip kalkan_bootstrap\n'
    Path('/proc/sys/net/ipv4/ip_forward').write_text('1' if config.get('maintenance') else str(config.get('previous_ip_forward',0)))
    firewall+=bootstrap_firewall(config)
    file=directory/'host.nft';file.write_text(firewall)
    run('nft','-c','-f',str(file));run('nft','-f',str(file))
    (directory/'config.json').write_text(json.dumps(config));(directory/'config.json').chmod(0o600)


if __name__=='__main__':network(json.loads(Path('/etc/kalkan-host/config.json').read_text()))
