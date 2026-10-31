"""Dedicated private bridges, bootstrap NAT and per-tap source guards for Proxmox."""
import ipaddress
import json
import os
from pathlib import Path
import subprocess


def run(*args,check=True):
    return subprocess.run(args,check=check,text=True,capture_output=True)


def facts():
    if os.geteuid()!=0 or not Path('/etc/pve').is_dir():raise RuntimeError('Bu adım Proxmox host üzerinde root olarak çalışmalıdır.')
    node=run('hostname','-s').stdout.strip()
    nodes=json.loads(run('pvesh','get','/nodes','--output-format','json').stdout)
    if node not in {n['node'] for n in nodes}:raise RuntimeError('Yerel Proxmox node adı doğrulanamadı.')
    storage=json.loads(run('pvesm','status','--content','images','--output-format','json').stdout)
    options=[s for s in storage if s.get('active') and s.get('enabled',1)]
    if not options:raise RuntimeError('Aktif VM disk deposu bulunamadı.')
    selected=next((s for s in options if s['storage']=='local-lvm'),max(options,key=lambda x:x.get('avail',0)))
    route=json.loads(run('ip','-j','route','show','default').stdout)
    if len(route)!=1:raise RuntimeError('Tek bir etkin varsayılan ağ yolu gerekmektedir.')
    uplink=route[0]['dev']
    addresses=json.loads(run('ip','-j','address','show','dev',uplink).stdout)
    address=next((a['local'] for link in addresses for a in link['addr_info'] if a['family']=='inet'),None)
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
    return {'node':node,'storage':selected['storage'],'available_disk_bytes':capacity['avail'],'uplink':uplink,'access_ip':address,'bootstrap_dns':dns[0]}


def mac(vmid,index=0):return f'02:77:00:{index:02x}:{vmid//100:02d}:{vmid%100:02d}'


def preflight(topology,config):
    if int(Path('/proc/meminfo').read_text().split('MemTotal:')[1].split()[0])<31*1024*1024:
        raise RuntimeError('Host RAM en az 32 GiB olmalıdır; önerilen kapasite 64 GiB veya üzeridir.')
    existing=json.loads(run('pvesh','get','/cluster/resources','--type','vm','--output-format','json').stdout)
    allocated={row['vmid'] for row in existing}
    available=int(Path('/proc/meminfo').read_text().split('MemAvailable:')[1].split()[0])*1024
    required=(2+sum(vm['ram_gib'] for vm in topology['vms'] if vm['vmid'] not in allocated))*1024**3
    if available<required:raise RuntimeError('Yeni VM belleği ve host rezervi için boş RAM yetersiz; mevcut VM yükünü azaltın.')
    remaining=20+sum(vm['disk_gib'] for vm in topology['vms'] if vm['vmid'] not in allocated)
    if config['available_disk_bytes']<remaining*1024**3:raise RuntimeError(f'Seçilen depoda yeni VM ve rezerv için {remaining} GiB boş alan gerekmektedir.')
    for vm in topology['vms']:
        hit=next((v for v in existing if v['vmid']==vm['vmid']),None)
        if hit:
            text=run('qm','config',str(vm['vmid'])).stdout
            if 'KALKAN-1-MANAGED' not in text:raise RuntimeError(f"VMID çakışması: {vm['vmid']}; mevcut VM değiştirilmedi.")
    owned=Path('/etc/kalkan-host/config.json').exists()
    links={i['ifname'] for i in json.loads(run('ip','-j','link').stdout)}
    for network in topology['networks']:
        if network['bridge'] in links and not owned:raise RuntimeError(f"Bridge zaten kullanılıyor: {network['bridge']}; üzerine yazılmadı.")
    routes=json.loads(run('ip','-j','route','show').stdout)
    if not owned:
        for route in routes:
            if route.get('dst') in (None,'default'):continue
            try:subnet=ipaddress.ip_network(route['dst'])
            except ValueError:continue
            if any(subnet.overlaps(ipaddress.ip_network(n['cidr'])) for n in topology['networks']):
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


def network(config):
    directory=Path('/etc/kalkan-host');directory.mkdir(exist_ok=True)
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
    if config.get('maintenance'):
        Path('/proc/sys/net/ipv4/ip_forward').write_text('1')
        firewall+='table ip kalkan_bootstrap { chain postrouting { type nat hook postrouting priority srcnat; policy accept; ip saddr { 10.77.0.0/16, 198.18.60.0/24 } oifname "'+config['uplink']+'" masquerade; } }\n'
    else:Path('/proc/sys/net/ipv4/ip_forward').write_text(str(config.get('previous_ip_forward',0)))
    file=directory/'host.nft';file.write_text(firewall)
    run('nft','-c','-f',str(file));run('nft','-f',str(file))
    (directory/'config.json').write_text(json.dumps(config));(directory/'config.json').chmod(0o600)


if __name__=='__main__':network(json.loads(Path('/etc/kalkan-host/config.json').read_text()))
