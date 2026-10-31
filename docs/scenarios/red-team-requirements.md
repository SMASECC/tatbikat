# Kırmızı takım gereksinimleri

Bu belge K1-RED-BLUE-01 senaryosunun geliştirme ve kurulum sözleşmesidir. Ağ ve IP değerlerinin kaynağı `infra/topology.json` dosyasıdır. Ortam henüz kurulmamıştır.

## Başlangıç konumu ve araçlar

Kırmızı takım, `KALI-RED-01` üzerinde dış lab ağından başlamaktadır. İlk hedef, FW-01 üzerinden DMZ portalına yayınlanan HTTPS hizmetidir. Kırmızı takıma iç KKBS, OT, SOC veya MGMT ağına doğrudan erişim sağlanmayacaktır. Ayrıntılı bağlantı politikası `infra/firewall-policy.json` içindedir.

| Bileşen | Gereksinim | Durum / kurulum yeri |
|---|---|---|
| Kali Linux x86-64 | İmaj sürümü, indirme adresi ve SHA256 kaydı | KALI-RED-01; imaj kilidi seçilecektir. |
| Python 3 ve curl | Aşama istemcileri, HTTPS erişimi ve yapılandırılmış işlem sonucu | Kali; paket sürümleri kurulumda kilitlenecektir. |
| OpenSSH istemcisi ve ssh-keygen | Lab anahtarı, parmak izi ve SSH oturum doğrulaması | Kali; gerçek yönetim anahtarından ayrı tutulacaktır. |
| Ligolo-ng proxy ve ajan | Aynı uyumlu sürüm, ikili dosya SHA256 değerleri ve TLS parmak izi doğrulaması | Proxy Kali'de, ajan DMZ'de; sürüm ve dosyalar henüz sağlanmamıştır. |
| TUN yetkisi | Proxy tarafında TUN oluşturabilecek yerel yetki | Kali'de gerekir. DMZ ajanı için root zorunlu değildir. [R1] |
| tcpdump | Gerekli durumda kısa, filtreli bağlantı kanıtı | İsteğe bağlıdır; Wazuh için zorunlu bir ağ sensörü sayılmamaktadır. |
| Tatbikat yapılandırması | Hedef listesi, run_id, profil, süre sınırı ve anahtar parmak izleri | Gerçek sırlar `.local/` altında oluşturulacaktır; Git'e eklenmeyecektir. |

Bellekten kimlik bilgisi çıkarılması bu sürümün zorunlu aşaması değildir. Tekrar üretilebilir ilk yol, eski aktarım işindeki lab SSH anahtarının dosyadan elde edilmesidir.

## Hedef ve kimlik koşulları

| Sunucu / kimlik | Sağlanması gereken koşul |
|---|---|
| DMZ-PORTAL-01 / svc-web | Dışarıdan HTTPS ile erişilen, ürünü ve sürümü sabitlenmiş zafiyetli servis düşük yetkili svc-web hesabıyla çalışmalıdır. İlk shell bu hesabın yetkisinde oluşmalıdır. Root ile başlayan servis kabul edilmeyecektir. |
| DMZ yerel yetki yükseltme | Tatbikat profilindeki hatalı sudo yetkisi, gerçek kullanıcı ve etkin kullanıcı değişimiyle doğrulanmalıdır. Kesin sudo girdisi ve kullanılan yardımcı program geliştirme sırasında seçilip test edilecektir. |
| Eski svc-sync anahtarı | Yalnız lab için üretilmiş kullanılabilir özel anahtar DMZ'deki eski aktarım işinde bulunmalıdır. Önerilen yol `/var/lib/kalkan-portal/legacy-sync/id_ed25519` ve erişim root:root 0600'dür. İlk svc-web shell'i anahtarı okuyamamalıdır. Root aşamasından sonra okuma kanıtı üretilmelidir. |
| KKBS-INT-01 / svc-sync | Tatbikat profilinde ilgili genel anahtarı kabul etmeli; eski DMZ→INT SSH yolu ve etkileşimli oturum izni bulunmalıdır. Normal ve iyileştirilmiş profiller bu yolu kapatmalıdır. |
| Kalıcılık noktası | `/home/svc-sync/.ssh/authorized_keys` üzerinde yeni bir lab genel anahtarı eklenmesi ve bu anahtarla ikinci oturum ayrıca doğrulanmalıdır. Başlangıç snapshot'ında saldırganın kalıcılık anahtarı bulunmamalıdır. |
| Uygulama kimliği | svc-sync SSH hesabı ile integrator API kimliği ayrı tanımlanmalıdır. INT üzerindeki servis kimliği uygulamaya erişimi sağlamalıdır. Bu kimliğin önerilen yapılandırma yolu `/etc/kalkan/integration/identity.json` olup yalnız ilgili servis hesabı tarafından okunmalıdır. |
| Uygulama yetkisi | Normal profil yalnız tanımlı veri kabulünü açmalıdır. Tatbikat profilindeki fazla konum/görev/ölçüm/komut yetkileri ayrıca tanımlanmalı ve geri alınabilmelidir. SSH oturumu tek başına API yazma yetkisi sayılmayacaktır. |
| OT-SIM-01 | 27 saha unsuru ve 4 tesisin modeli, bağımsız referansı ve yetkili komut kanalı çalışmalıdır. DMZ veya INT'den OT'ye doğrudan kumanda açılmayacaktır. |

Bu yollar ve hesaplar kurulum sözleşmesidir; mevcut VM üzerinde oluşturulmuş kaynaklar değildir. Root elde edilmesi DMZ ile sınırlı yerel yetki yükseltme adımıdır. İç entegrasyon sunucusunda ikinci bir root aşaması zorunlu değildir; uygulama etkisi için ayrıca API kimliği ve fazla uygulama yetkisi gerekmektedir.

## İlk erişim servisinin seçimi

Ürün, sürüm ve CVE henüz seçilmemiştir. Bu seçim tamamlanmadan ilk erişim scripti hazır sayılmayacaktır. Seçim kaydında ürünün lisansı, indirme adresi, imaj/dosya özeti, zafiyet önkoşulları, HTTPS ters vekil davranışı, Ubuntu uyumluluğu, servis kullanıcısı ve yama/iyileştirme yolu bulunmalıdır. Sağlıklı profil ile zafiyetli profil aynı kurulumdan tekrar üretilebilmelidir. Test hesabıyla oturum açılması ilk erişim yerine kullanılmayacaktır.

## Script envanteri ve gerçek durum

| Aşama | Planlanan dosya / mevcut araç | Uygulama durumu |
|---|---|---|
| DMZ servisinden shell | `01_dmz_service_rce.py` | Planlanan isimdir; dosya yoktur, servis seçimi beklenmektedir. |
| DMZ yerel yetki yükseltme | `02_dmz_privilege_escalation.py` | Planlanan isimdir; dosya yoktur. |
| Servis anahtarına erişim | `03_service_key_access.py` | Planlanan isimdir; dosya yoktur. |
| Pivot kanalı | `04_pivot_channel.py` | Planlanan isimdir; dosya yoktur. Ligolo ikilileri ayrıca sağlanacaktır. |
| İç sunucuya SSH geçişi | `05_lateral_ssh.py` | Planlanan isimdir; dosya yoktur. |
| SSH anahtarıyla kalıcılık | `06_persistence.py` | Planlanan isimdir; dosya yoktur. |
| Konum / görev / HMI / PLC / kesinti etkileri | `backend/starter-v0.1/tools/red.py` içindeki position, mission, plc-measurement, plc-command, outage | Mevcut kontrollü model komutlarıdır. Yeni integrator kimliği üzerinden canlı etki bağlantısı henüz yapılmamıştır. |

Mevcut `red.py session` komutu eski model oturumunu oluşturmaktadır. Bu komut DMZ servisinden ilk erişim değildir ve canlı erişim zincirinin yerine kullanılmayacaktır.

Yeni altı script için ortak gereksinimler: önceki aşamanın kanıt referansı, hedef doğrulaması, run_id, başlangıç/bitiş zamanı, işlem sonucu, hata halinde sıfırdan farklı çıkış kodu ve tekrarlı çalıştırmada kontrollü davranış. Script yalnız çalıştığı için başarılı sayılmayacaktır. Kanıt dosyasında parola, özel anahtar veya bearer token bulunmayacaktır. Eksik önkoşul, sonraki aşamanın çalıştırılmasını durdurmalıdır.

## Saha ve tesis etkileri

| Etki | Veri gereksinimi | İzleyici karşılığı |
|---|---|---|
| Konum manipülasyonu | Bildirilen konum ile bağımsız referans ayrı tutulmalıdır. | Haritada sapma ve ilgili telemetri göstergesi görünmelidir. |
| Görev manipülasyonu | Onaylı görev, bildirilen görev ve değişikliği yapan uygulama hesabı kaydedilmelidir. | İlgili unsurun görev/rota davranışı değişmelidir. |
| HMI manipülasyonu | Tesisin gösterilen ölçümü ile bağımsız proses ölçümü ayrılmalıdır. | Tesis/PLC uyarısı ve telemetri bütünlük göstergesi değişmelidir. |
| Proses komutu | Yetkili API üzerinden verilen komut ve modelin gerçek tepkisi ayrı kaydedilmelidir. | Vana, pompa ve sıcaklık davranışı model sonucuna göre değişmelidir. |
| Kesinti / saha sonucu | Kaynak bağlantı durumu, son paket ve veri yaşı tutulmalıdır. Drone, görev ve telsiz sonuçları model olaylarıyla ilişkilendirilmelidir. | Son değer donmalı; kesinti, görev değişimi ve drone etkisi ilgili varlıkta gösterilmelidir. |

Mevcut model istemcisi bütün saha varlıklarının canlı davranışlarını henüz uygulamamaktadır. Drone düşüşü, telsiz kesilmesi ve görev değişimi gerçek cihazlara veya RF kanalına gönderilen işlem değildir; sanal model sonucu olarak geliştirilecektir. Her animasyon için aynı run_id ve olay referansı aranacaktır.

## Profil ve sıfırlama

Normal, exercise ve restored profillerinin gereksinimleri ortak plan dosyasında bulunmaktadır. Exercise profilinin seçilmesi kaynak paketinde hiçbir ağ kuralını veya zafiyeti kendiliğinden açmamaktadır; Ansible uygulama rolleri geliştirilecektir. Yeni turda yeni run_id ve lab anahtarları oluşturulmalı, eklenen kalıcılık anahtarı kaldırılmalı, fazla API izinleri sıfırlanmalı ve önceki turun kanıtları korunmalıdır.

## Kaynaklar

- [R1 — Ligolo-ng giriş ve yetki modeli](https://docs.ligolo.ng/)
- [R2 — Ligolo-ng quickstart ve TLS parmak izi](https://docs.ligolo.ng/Quickstart/)
- [MITRE T1190 — Exploit Public-Facing Application](https://attack.mitre.org/techniques/T1190/)
- [MITRE T1548.003 — Sudo and Sudo Caching](https://attack.mitre.org/techniques/T1548/003/)
- [MITRE T1552.004 — Private Keys](https://attack.mitre.org/techniques/T1552/004/)
- [MITRE T1021.004 — SSH](https://attack.mitre.org/techniques/T1021/004/)
- [MITRE T1098.004 — SSH Authorized Keys](https://attack.mitre.org/techniques/T1098/004/)

Erişim tarihi: 31 Ekim 2026. Lab yolları, profiller, hesaplar ve kaynak durumları projeye ait tasarım kararlarıdır.
