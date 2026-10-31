# Kurulum hazırlığı

## Yerel kaynak kontrolü

Python 3.12 ve Node.js 22 veya üzeri kurulu makinede python3 scripts/check.py çalıştırılır. Güncel frontend derlenir ve yerel kontroller tamamlanır. Uzak ağa bağlantı kurulmaz.

## Gerçek ortam bilgileri

infra/site.example.yml dosyası .local/site.yml konumuna kopyalanır. Proxmox node, storage, CA dosyası, bridge eşlemesi, şablon ID'leri ve SSH kullanıcısı gerçek bilgilerle tamamlanır. deployment_configured yalnız bu eşleme tamamlandığında true yapılır.

FW-01 ve MGMT-01 başlangıç erişimi oluşturulduktan sonra otomasyon MGMT-01 üzerinden yürütülür. Bu paket host ağını veya VM'leri henüz otomatik oluşturmamaktadır.

## Ön kontrol

Proxmox API tokenı .local/proxmox.env dosyasında tutulur. Dosya kabukta okunur ve make preflight çalıştırılır. Ön kontrol yalnız HTTPS GET kullanır; sertifika doğrulaması açıktır. Node ve bridge adları gerçek API yanıtıyla doğrulanır.

python3 scripts/check_ansible.py yalnız sözdizimini ve üretilen envanteri kontrol eder. Normal kontrol makinesinde --guard-runtime seçeneğiyle örnek ayarların ilk yerel adımda reddedildiği ayrıca sınanabilir. Bu paketin hazırlandığı çalışma ortamı Ansible yerel RPC işçisinin başlamasına izin vermediği için koruma adımının çalışma testi tamamlanamamıştır. Sözdizimi ve envanter kontrolleri geçmiştir; uzak API, SSH ve paket kurulumu doğrulanmamıştır.

## Temel işletim sistemi

make base-os, önceden hazırlanmış Ubuntu VM'lerinde Python, auditd, chrony ve QEMU Guest Agent paketlerini kurar. Wazuh kurulumu, firewall uygulaması veya saldırı scripti çalıştırmaz. Paket depoları için hazırlık aşamasındaki erişim yolu kurulmuş olmalıdır.

## Sürüm yönetimi

Normal kaynak ve test komutları Git'te tutulur. .local, çalışma günlükleri ve gerçek sırlar tutulmaz. Python altyapı bağımlılıkları requirements-infra.lock içinden kurulur. İmaj dosyaları için infra/artifacts.example.json şablonundaki SHA256 değerleri gerçek indirmelerle doldurulmadan imaj kilidi tamamlanmış sayılmaz.

Kaynak değişikliğinden sonra make check çalıştırılır. Git'e yalnız kaynaklar eklenir; paketleme scripts/package_repo.py ile yapılır. Dağıtım arşivi kaynak ağacını, derlenmiş frontend'i, Git bundle dosyasını ve SHA256SUMS dosyasını içerir.
