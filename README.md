# KALKAN 1 kaynak deposu

Bu depo güncel Komuta Kontrol Merkezi frontend'ini, çalışan backend başlangıç paketini ve 8 VM / 7 ağ bölgesi için kurulum kaynaklarını bir araya getirmektedir. Amaç, aynı kaynaklardan tekrar üretilebilen bir tatbikat ortamı oluşturmaktır.

**Sürüm:** v0.2.0-scaffold.1  
**Durum:** Kaynak deposu ve altyapı hazırlığı. Canlı Proxmox, Wazuh ve yeni DMZ erişim zinciri henüz kurulmamıştır.

## İlk kullanım

Gereksinimler: Python 3.12 ve Node.js 22 veya üzeri. Node yalnız frontend kontrolleri için kullanılmaktadır.

Kaynak kontrolü ve Ansible komutları Linux veya WSL üzerinde çalıştırılmalıdır. Derlenmiş frontend tarayıcıda açılabilir.

```bash
python3 scripts/check.py
```

Bu komut güncel frontend'i derler, topolojiyi doğrular, envanter ve ağ inceleme dosyalarını üretir ve mevcut testleri çalıştırır. Uzak sunucuya bağlantı kurmaz.

Hazır frontend `dist/frontend/index.html` konumunda oluşur. Dağıtım ZIP'inde bu dosyanın derlenmiş kopyası da bulunmaktadır.

## Dizinler

| Dizin | İçerik |
|---|---|
| frontend | Güncel DMZ anlatımı, reji, harita, PLC, telemetri ve 298 kontrolün kaynakları |
| backend/starter-v0.1 | Python/SQLite başlangıç motoru, CLI istemcileri ve Wazuh uygulama kuralları |
| backend/next-api | FastAPI, PostgreSQL ve canlı veri geçişi için iş listesi ve API sözleşmesi |
| infra | Topoloji, erişim politikası, örnek kurulum ayarları, Ansible ön kontrolü ve temel OS rolü |
| docs | Güncel teknik gereksinimler, ağ/senaryo görseli, kurulum sırası ve kaynak durumu |
| scripts | Derleme, doğrulama, envanter üretme ve paketleme araçları |
| tests | Depo ve ağ yapılandırması kontrolleri |

## Ağ planı

Adresler `infra/topology.json` dosyasından yönetilmektedir. İç ağlar `10.77.x.x`, dış lab `198.18.60.0/24`, Kali/Ligolo adresi `198.18.60.20` olarak tanımlıdır. Bu dış lab gerçek internetten ayrıdır. Ayrıntılar `docs/infrastructure-requirements.md` içindedir.

```bash
make plan
make frontend
make check
```

`make plan`, `build/infra/` altında önerilen Ansible envanterini, Proxmox VM planını ve erişim inceleme tablosunu üretir. Bu dosyalar kendiliğinden uygulanmaz.

## Ansible hazırlığı

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-infra.lock
mkdir -p .local
cp infra/site.example.yml .local/site.yml
cp .env.example .local/proxmox.env
python3 scripts/check_ansible.py
```

Proxmox node adı, depolama ve bridge eşlemesi gerçek hosta göre doldurulmalıdır. API tokenı yalnız yerel çalışma dosyasında veya ortam değişkeninde tutulmalıdır. `.local/`, `.env` ve özel anahtarlar Git dışında bırakılmıştır.

`infra/playbooks/preflight.yml` yalnız Proxmox sürümünü ve mevcut bridge'leri okur. `base-os.yml`, önceden oluşturulmuş Ubuntu VM'lerine temel paketleri kurar. İki playbook da örnek ayarlarla çalışmayı reddeder. Tam VM klonlama, firewall uygulama, Wazuh kurulumu ve yeni backend dağıtımı sonraki geliştirme işleridir.

```bash
set -a
. .local/proxmox.env
set +a
make preflight
```

## Mevcut backend sınırı

`backend/starter-v0.1` çalışan uygulama seviyesi başlangıç paketidir. İçindeki web kopyası önceki frontend sürümüdür. Güncel frontend ile canlı veri bağlantısı henüz tamamlanmamıştır. Bu paketin kontrollü etki komutları gerçek RCE, SSH veya Ligolo bağlantısı kanıtı değildir.

## Git deposunu kullanma

Dağıtım paketindeki `kalkan-1.bundle` Git geçmişini taşımaktadır. Kaynakları geçmişiyle ayrı klasöre açmak için:

```bash
git clone --branch main /paketin/yolu/kalkan-1.bundle kalkan-1-work
cd kalkan-1-work
make check
```

Uzak Git adresi henüz bağlanmamıştır. Mevcut kurum içi Git sunucusu veya seçilecek özel depo, çalışma kopyasına `origin` olarak eklenebilir. Kurulum envanteri ve gerçek sırlar kaynak koddan ayrı kalacaktır.

Bir sonraki uygulama sırası `docs/implementation-plan.md` dosyasındadır.
