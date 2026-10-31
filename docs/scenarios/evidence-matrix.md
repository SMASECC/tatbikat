# Aşama, kanıt ve müdahale çizelgesi

Bu dosya `scenarios/red-blue/requirements.json` verisinden `make scenario-plan` ile üretilmektedir.

**Durum: gereksinimler tanımlıdır; canlı senaryo hazır değildir.** Planlanan altı erişim scripti mevcut değildir. Etki ve müdahale istemcileri eski uygulama modelinde bulunmaktadır. Host/ağ işlemleri ve canlı entegrasyon ayrıca geliştirilecektir.

Sunum adımı 1–10 olarak gösterilmiştir. İlk erişimin altı teknik işlemi aynı sunum adımına bağlıdır. Her adımın hedef anlatım süresi 30 saniyedir; gerçek işlem/tespit süresi değildir.

## Kırmızı takım / işlem ve kanıt

| Aşama / sunum | Script ve kaynak durumu | Önkoşul | Kayıt kaynakları / mevcut uygulama kuralı |
|---|---|---|---|
| B00 · Başlangıç ve kayıt sağlığı / 1 | Analist / reji kontrolü; kurulum beklenmektedir. | Normal profil, yeni run_id ve saat/kayıt kaynağı kontrolü. | fw-connections, app-events, ot-reference / Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir. |
| R01 · DMZ servisinden ilk erişim / 2 | `01_dmz_service_rce.py` — planlanan isim; dosya yoktur. | Seçilmiş zafiyetli servis ve yalnız DMZ HTTPS yayını. | dmz-web, dmz-exec, fw-connections / Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir. |
| R02 · DMZ yerel yetki yükseltme / 2 | `02_dmz_privilege_escalation.py` — planlanan isim; dosya yoktur. | R01 kanıtı ve exercise profilindeki hatalı sudo. | dmz-exec, dmz-sudo / Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir. |
| R03 · Eski servis anahtarına erişim / 2 | `03_service_key_access.py` — planlanan isim; dosya yoktur. | R02 kanıtı ve root-only eski svc-sync özel anahtarı. | key-read, dmz-exec / Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir. |
| R04 · DMZ üzerinden pivot kanalı / 2 | `04_pivot_channel.py` — planlanan isim; dosya yoktur. | R01 sonrası DMZ kod yürütme; exercise çıkış izni ve Kali TUN yetkisi. | dmz-exec, fw-connections / Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir. |
| R05 · İç entegrasyon sunucusuna SSH / 2 | `05_lateral_ssh.py` — planlanan isim; dosya yoktur. | Kullanılabilir svc-sync anahtarı, pivot, eski SSH yolu ve etkileşimli oturum izni. | int-ssh, fw-connections / Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir. |
| R06 · SSH kalıcılığı ve uygulama kimliği / 2 | `06_persistence.py` — planlanan isim; dosya yoktur. | svc-sync SSH oturumu, yazılabilir kullanıcı authorized_keys ve ayrı uygulama kimliği. | int-fim, int-ssh, integration-events, app-events / Yeni host/ağ korelasyonu veya temel kayıt incelemesi gerekmektedir. |
| R07 · Konum manipülasyonu / 3 | `red.py position` — model istemcisi; canlı OS/ağ işlemi değildir. | Canlı modda doğrulanmış uygulama kimliği ve fazla yazma yetkisi. | integration-events, app-events, ot-reference / 110102 |
| R08 · Görev manipülasyonu / 4 | `red.py mission` — model istemcisi; canlı OS/ağ işlemi değildir. | Canlı modda R06 kimlik/yetki koşulu ve onaylı görev referansı. | integration-events, app-events, ot-reference / 110103 |
| R09 · HMI ölçüm manipülasyonu / 5 | `red.py plc-measurement` — model istemcisi; canlı OS/ağ işlemi değildir. | Bildirilen HMI ölçümü ve bağımsız proses ölçümü ayrı olmalıdır. | app-events, ot-reference / 110104 |
| R10 · Proses parametresi değişikliği / 6 | `red.py plc-command` — model istemcisi; canlı OS/ağ işlemi değildir. | Komut kimliği/yetkisi ve gerçek OT model komut kanalı. | app-events, ot-reference / 110105 |
| R11 · Görünürlük kaybı ve saha sonuçları / 7 | `red.py outage` — model istemcisi; canlı OS/ağ işlemi değildir. | Kesinti yolu ve varlık bazlı drone/görev/telsiz model olayları hazırlanmalıdır. | app-events, ot-reference / 110106 |
| B12 · IOC/TTP incelemesi ve sınırlandırma / 8 | `blue.py contain` — model istemcisi; canlı OS/ağ işlemi değildir. | Analist tarafından doğrulanmış kayıt/alarm ve saldırı zaman çizelgesi. | dmz-web, dmz-exec, key-read, fw-connections, int-ssh, int-fim, app-events / 110107 |
| B13 · Kalıcılık temizliği ve geri yükleme / 9 | `blue.py restore` — model istemcisi; canlı OS/ağ işlemi değildir. | Sınırlandırma kanıtı ve onaylı yapılandırma/veri referansı. | dmz-sudo, int-fim, app-events, ot-reference / 110108 |
| B14 · Kararlılık, rapor ve temiz tur / 10 | `blue.py verify` — model istemcisi; canlı OS/ağ işlemi değildir. | Yeni veriyle kararlılık, tekrar erişim ret testi ve korunmuş olay kanıtı. | app-events, ot-reference, int-ssh, fw-connections / 110109 |

## Mavi takım / müdahale ve doğrulama

| Aşama | İnceleme / müdahale | Tamamlanma kanıtı |
|---|---|---|
| B00 | Başlangıç kaydını, normal iş akışını ve yasak yolları doğrulama. | Eksik kayıt kaynağı bulunmamalı; normal veri ve izleyici rolü çalışmalıdır. |
| R01 | Web isteğini servis→shell zinciriyle doğrulama; DMZ hizmetini daraltma/yama. | İlk shell svc-web olmalı; iyileştirilmiş serviste aynı ilk erişim tekrarlanamamalıdır. |
| R02 | Hatalı sudo yetkisini kaldırma ve ilgili oturumu sınırlandırma. | Aynı yolla svc-web→euid=0 geçişi artık başarısız olmalıdır. |
| R03 | Anahtar ilişkisinin doğrulanması ve hedefte eski anahtarın iptali/yenilenmesi. | İlk düşük yetki anahtarı okuyamamalı; iptal edilen anahtarla yeni SSH açılamamalıdır. |
| R04 | Ajan süreci ve dış bağlantıyı ilişkilendirme; tüneli ve mevcut bağlantı durumunu kesme. | Yeni ve mevcut tünel üzerinden erişim bitmeli; izinli iş akışı ayrıca sınanmalıdır. |
| R05 | Eski SSH istisnasını kapatma, anahtarı iptal etme ve açık saldırgan oturumunu sonlandırma. | Eski anahtarla yeni oturum açılamamalı; önceki açık oturum da bitmelidir. |
| R06 | Kalıcılık anahtarını kaldırma, oturumları iptal etme ve fazla API yetkisini daraltma. | Eklenen anahtar yeniden giriş sağlayamamalı; API yazma yetkisi ayrı reddedilmelidir. |
| R07 | Kaynağı/oturumu doğrulama, yazmayı durdurma ve onaylı konumu geri yükleme. | Yeni ölçüm bağımsız referansla uyuşmalı; eski oturumla tekrar yazma reddedilmelidir. |
| R08 | Görev yazma yetkisini kaldırma ve onaylı görevi geri yükleme. | Yeni görev/rota davranışı onaylı kayıtla uyuşmalıdır. |
| R09 | HMI veri yazmasını durdurma, ölçüm kaynağını ve bağımsız referansı doğrulama. | Bildirilen değer yeni bağımsız ölçümle uyuşmalı; alarm yalnız gizlenmemelidir. |
| R10 | Yetkisiz kumandayı engelleme, oturumu iptal etme ve onaylı reçeteyi geri yükleme. | Komut reddi ve prosesin yeni ölçümlerle kararlı duruma gelmesi birlikte doğrulanmalıdır. |
| R11 | Kesintinin kaynağını durdurma, bağımsız kaynağı kontrol etme ve izinli veri yolunu geri açma. | Yeni paket alınmalı; son değer donması doğru olmalı; animasyonlar gerçek model olayına dayanmalıdır. |
| B12 | Servis/anahtar/açık oturum/pivot/SSH/API kontrollerini olay bağlamına göre uygulama. | Her kontrol ayrı sonuç vermeli; açık kanal kalmamalı; eski bulgular korunmalıdır. |
| B13 | Servis/sudo/API yanlış yapılandırmalarını düzeltme, kalıcılığı temizleme ve onaylı kayıtları geri yükleme. | Tekrar erişim başarısız olmalı; yeni konum/görev/ölçüm onaylı referansla uyuşmalıdır. |
| B14 | Bağlantı/bütünlük/hizmet doğrulaması; kanıtı koruma; yeterli kanıt yoksa APT atfı yapmama. | Eski anahtar/oturumlar çalışmamalı; önceki kanıt korunmalı; yeni temiz tur bağımsız açılmalıdır. |

## Canlı kurulum önündeki eksikler

- Zafiyetli servis ürünü/sürümü ve doğrulanmış zafiyet koşulu seçilmelidir.
- İlk altı erişim zinciri scripti henüz yazılmamıştır.
- Canlı Wazuh, ajanlar ve yeni host/ağ korelasyonları kurulup doğrulanmalıdır.
- SSH servis kimliği, yeni API, OT modeli ve güncel frontend canlı bağlantısı tamamlanmalıdır.
- OS/ağ müdahale ve temiz tur işlemleri gerçek sistemlerde doğrulanmalıdır.

Kayıt kaynağı kimliklerinin ayrıntıları [mavi takım gereksinimleri](blue-team-requirements.md) ve ortak JSON planında bulunmaktadır. [Kanıt şablonu](../../scenarios/red-blue/evidence-template.json) boş şablondur; gerçek olay içermemektedir.
