# KALKAN-1 tam lab kaynak paketi

**Sürüm: 0.3.0-lab.2**

Bu teslim güncel arayüzü, bağımsız OT modelini, gerçek Linux erişim zincirini, mavi takım araçlarını, Wazuh kurallarını ve Proxmox/Ansible kurulum otomasyonunu içermektedir. Kaynak ve yerel test paketi hazırlanmıştır. Sekiz VM'nin gerçek Proxmox/Wazuh üzerindeki tam kurulumu bu geliştirme ortamında doğrulanmamıştır. Kurulum kabul araçları bunu kullanıcı ortamında sınamaktadır.

## Buradan başlayın

[Git'ten tek komutla Proxmox kurulumu](docs/git-install.md): `install.sh` host ön kontrolünü, bağımlılıkları, VM/servis kurulumunu ve servis kabulünü sırayla çalıştırır. Özel depoya fiziksel sunucudan Git okuma izni gerekir. Gerçek Proxmox provası henüz doğrulanmamıştır.

[Kopyala-yapıştır seviyesinde kurulum rehberi](docs/delivery/KALKAN-1_Kurulum_Rehberi_v0.3.0.md)

Rehber; Windows'tan dosya aktarımı, temiz Proxmox hazırlığı, otomatik kaynak seçimi, kurulum, sertifikalar, rol anahtarları, ekranlar, kırmızı takım, Wazuh analizi, mavi takım müdahalesi, yeni tur ve yedeği kapsamaktadır. Gerçek hostun adresi başlangıçta bir kez girilmektedir; örnek dosyalarda REPLACE_ME doldurulması ana kurulum yolunun parçası değildir.

## Teslim içeriği

| Dizin | Kaynak |
|---|---|
| lab/red | 01–06 gerçek OS erişim zinciri; 07–11 sanal saha/PLC etkisi. Ortak uygulama common.py içindedir. |
| lab/portal.py | KALKAN Data Portal 1.0.0; bilerek oluşturulmuş CWE-78 ve yamalı profil. Yayınlanmış ürün/CVE iddiası yoktur. |
| lab/app.py, live_engine.py, core.py | Rol kontrollü API, kalıcı olay/durum, bağımsız referans, oturum iptali ve müdahale. |
| lab/ot.py | Ayrı VM'de 27 saha unsuru ve dört tesis, proses komutu, bağımsız ölçüm, görev/drone modeli. |
| lab/wazuh | Gerçek web/audit/anahtar/pivot/SSH kaynakları için host kuralları ve ağ decoder'ı. |
| deploy | Native Proxmox VM/bridge hazırlığı, Ansible dağıtımı, profil ve mavi takım konsolu. |
| frontend | Onaylı görsel kaynaklar. lab/build_frontend.py güncel kaynaklara canlı veri adapter'ı ekler. |
| docs/scenarios, scenarios/red-blue | Aşama, önkoşul, kayıt kaynağı, IOC/TTP ve müdahale sözleşmeleri. |
| backend/starter-v0.1 | Geçmiş model sürümü ve uygulama Wazuh kuralları. Ana canlı dağıtım bu dizinden yapılmaz. |
| backend/next-api | Önceki FastAPI/PostgreSQL genişleme önerisi. Bu teslimde uygulanmış teknoloji sayılmaz. |

## Seçilen çalışma mimarisi

8 VM / 7 özel ağ; dış lab 198.18.60.0/24'tür. Yalnız FW-01 birden fazla bölgeye bağlanır. Diğer VM'ler tek arayüzlüdür. VM IP/MAC kaynak kısıtları hostun özel bridge tablosunda, erişim politikası guest nftables tablolarında uygulanır. Fiziksel NIC'ler lab bridge'lerine bağlanmaz. İlk kurulumdan sonra geçici dış erişim kapatılır.

İlk çalışan teslim için Python standart kütüphanesi, tek durum yayımlayıcısı, SQLite WAL ve 500 ms HTTPS sorgulaması seçilmiştir. Düşük sayıdaki gösterim istemcileri aynı sunucu durumunu alır. OT ve APP ayrı VM'lerde, ayrı kalıcı durumla çalışır; aralarındaki kanal mTLS ve ayrı token ile doğrulanır. Önceki mimarideki FastAPI/PostgreSQL/WebSocket önerisi bu sürümün bağımlılığı değildir. Bu seçim kurulumdaki bağımlılık sayısını azaltmaktadır.

Kali 2026.2 genericcloud, Ligolo-ng 0.9.2, Ubuntu 24.04 LTS ve Wazuh 4.14 ailesi seçilmiştir. OS imajları, Ligolo ikilileri ve dağıtım paketleri ilk kurulumda resmi kaynaklardan indirilir. ZIP tam çevrimdışı imaj/APT deposu değildir. Gerçek indirilen dosyaların SHA256 kilidi .local/cache altında oluşturulur. Gerçek sırlar yalnız .local ve ilgili yetkili VM yapılandırmasında üretilir.

## İşletim komutları

Kurulumdan sonra Proxmox'ta paket dizininde:

```bash
python3 deploy/kalkan.py check
python3 deploy/kalkan.py new-run
python3 deploy/kalkan.py red --interactive
```

Mavi takım için ayrı terminalde:

```bash
python3 deploy/kalkan.py blue-inspect
python3 deploy/kalkan.py blue-contain
python3 deploy/kalkan.py blue-restore
python3 deploy/kalkan.py blue-verify
```

İşletim komutları MGMT-01'e iletilir. Wazuh gerçek alarmı yoksa blue-contain başarılı sayılmaz. Gözlemler otomatik kesin IOC veya APT atfına dönüştürülmez. Sınırlandırma, geri yükleme ve yeni veriyle doğrulama ayrı işlemlerdir. Otomatik Active Response devrede değildir; komutun analist tarafından çalıştırılması müdahale onayıdır.

## Kaynak kontrolü

Python 3.12+, Node 22+ bulunan Linux/WSL üzerinde:

```bash
python3 scripts/check.py
```

Bu komut uzak lab kurmaz. Onaylı frontend'i ve canlı adapter'ı derler; kaynak, ağ ve senaryo sözleşmelerini; mevcut model testlerini ve yeni yerel mTLS/OT testlerini çalıştırır. Çalışma ortamının ek UID eşlemesi yoksa düşük yetkili alt süreç testi açıkça atlanır; atlama başarılı host testi olarak raporlanmaz. Ansible sözdizimi ayrıca kontrol edilir; yerel RPC kısıtı nedeniyle bu ortamda gerçek playbook yürütülmemiştir.

`dist/live/index.html` yalnız lab backend'i üzerinden sunulur. `dist/frontend/index.html` bağımsız görsel model arşividir. Ayrı bilgisayarlarda canlı gösterim için bağımsız HTML dosyaları açılmaz; ortak HTTPS uygulamasına bağlanılır.

Git geçmişi kalkan-1.bundle içindedir. Uzak depo bağlanmamıştır. .local, anahtarlar, cache ve olay kanıtları Git'e eklenmez. Eski altyapı planı docs/infrastructure-requirements.md içinde korunmuştur; bu teslimin teknoloji ve kurulum kararları bu README ve teslim rehberidir.
