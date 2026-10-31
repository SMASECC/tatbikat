# Mavi takım gereksinimleri

Mavi takım, ayrı monitörde gerçek Wazuh Dashboard kullanacaktır. Akış; kayıt inceleme, IOC çıkarımı, davranış/TTP analizi, analist onaylı müdahale ve sonuç doğrulama aşamalarından oluşmaktadır. Bu belge gereksinimleri tanımlamaktadır; canlı Wazuh kurulumu veya hazır OS/ağ müdahalesi anlamına gelmemektedir.

## Teknoloji ve erişim

| Bileşen | Gereksinim |
|---|---|
| WAZUH-01 | Manager, indexer ve dashboard aynı uyumlu sürüm kümesinden kurulmalıdır. Plan 4 vCPU, 8 GiB RAM ve 100 GiB disktir. |
| Ajanlar | FW-01, MGMT-01, DMZ-PORTAL-01, KKBS-INT-01, KKBS-APP-01 ve OT-SIM-01 kaydedilmelidir. Manager'ın kendi kayıtları ayrıca izlenmelidir. Kali başlangıç için izleme kapsamının zorunlu kaynağı değildir. |
| Mavi takım istemcisi | topology.json içindeki blue istemcisi Dashboard HTTPS erişimine sahip olmalıdır. Ayrı analist ve gerektiğinde müdahale yetkileri tanımlanmalıdır. |
| Linux Audit | auditd ve seçilen kurulumda gerekiyorsa audispd-plugins hazırlanmalıdır. Süreç, UID/eUID, dosya okuma ve değişiklik kayıtlarının gerçek geldiği sınanmalıdır. |
| FIM / who-data | authorized_keys, sudo yapılandırması ve servis ayarları izlenmelidir. Değişiklik özeti ve yapan kullanıcı/süreç bilgisi alınmalıdır. [B2] |
| Uygulama kayıtları | API kabul/ret, aktör, kaynak, hedef, önceki/yeni değer veya değer özeti ve olay referansı JSON olarak yazılmalıdır. |
| Ağ kayıtları | FW logları kaynak/hedef IP, port, eylem ve kural kimliğini göstermelidir. Geçen bağlantıları göstermek için yalnız drop logu yeterli değildir. DNAT eşlemesi ve durum takibi ayrıca doğrulanmalıdır. |
| Zaman ve saklama | Ortak chrony kaynağı, UTC kayıt zamanı, veri kabul zamanı ve turun zaman aralığı bulunmalıdır. Ham kayıt ve alarm saklama süresi log hacmi ölçüldükten sonra seçilmelidir. |
| Kanıt çalışma alanı | `.local/evidence/<run_id>/` altında erişimi kısıtlı olay dosyası, sorgu çıktıları ve SHA256 listesi tutulmalıdır. Bu dizin Git'e eklenmemelidir. |

## Toplanacak kaynaklar

| Kaynak | Gerekli kayıt | Temel inceleme |
|---|---|---|
| DMZ Nginx / portal | İstek zamanı, gerçek TCP kaynağı, istek kimliği, URI, durum kodu ve servis hatası | Web isteği ile servis alt sürecini ilişkilendirmek |
| DMZ auditd / sudo | PID, PPID, çalıştırılan dosya, uid, euid, auid mevcutsa, oturum ve sonuç | Servis → shell → yetki değişimi zinciri |
| Lab özel anahtarı | Hedefli read/attribute audit kaydı; dosyanın kendisi günlüklenmemelidir | Anahtar yoluna erişen süreç ve etkin kullanıcı |
| DMZ pivot süreci / FW | Ajan dosyasının gerçek SHA256 değeri, süreç kaydı ve DMZ→Kali TCP/TLS bağlantısı | Süreç, dış bağlantı ve sonraki iç SSH oturumunun zaman ilişkisi |
| INT sshd | Kaynak IP, kullanıcı, publickey yöntemi, anahtar parmak izi ve yeni oturum | svc-sync hesabı ile kullanılan anahtarın doğrulanması |
| INT authorized_keys | FIM/who-data değişikliği, eklenen genel anahtarın parmak izi ve yeni SSH kaydı | Dosya değişikliği ile yeniden erişimin birlikte incelenmesi |
| INT entegrasyon hizmeti | Uygulama kimliği ve APP istek referansı | SSH hesabı ile API işlem hesabının ayrı ilişkilendirilmesi |
| APP olay günlüğü | run_id, event_seq, request_id, oturum, aktör, hedef varlık ve değişiklik | Konum/görev/HMI/komut manipülasyonunun kaynağı |
| OT model günlüğü | Bağımsız ölçüm, komut kabulü, proses tepkisi ve bağlantı durumu | Gösterilen veri ile model durumunun karşılaştırılması |

FIM değişikliği göstermektedir; özel anahtarın yalnız okunmasını kanıtlamak için hedefli Linux Audit kuralı gerekmektedir. [B1][B2] auid değeri oturum açmayan servis süreçlerinde atanmış olmayabilir. Böyle bir durumda UID/eUID ve süreç ebeveynliği korunmalı, atanmış olmayan auid değeri bir kullanıcı hesabı olarak raporlanmamalıdır.

Host ve ağ kayıtları kendiliğinden run_id içermemektedir. Korelasyon, kayıt kaynağı/kimliği, host, hesap, süreç, anahtar parmak izi ve gerçek zaman aralığı üzerinden yapılmalıdır. Turla ilişki ayrıca kaydedilmeli; bütün host kayıtlarına uygulama run_id alanı varmış gibi sorgu yazılmamalıdır.

## Wazuh kuralları ve test gereksinimi

| Kural kümesi | Kaynak durumu | Yapılacak iş |
|---|---|---|
| 110101–110106 | Mevcut uygulama etki kurallarıdır. | Güncel veri sözleşmesi ve canlı uygulama akışıyla yeniden doğrulanmalıdır. |
| 110107–110112 | Mevcut müdahale, doğrulama, ret ve yeni tur kurallarıdır. | Olayın gerçek işlem sonucuyla eşleştiği doğrulanmalıdır. |
| Yeni host/ağ korelasyonları | Henüz XML kuralı yazılmamıştır. | Web→shell, sudo, anahtar okuma, dış tünel, SSH ve kalıcılık için gerçek örnek kayıtlarla decoder/korelasyon hazırlanmalıdır. |

Yeni kural ID'leri seçilen Wazuh sürümünün yüklü özel kurallarıyla çakışma kontrolünden sonra atanacaktır. Bu belgede çalışmayan bir kural numarası alarm gibi sunulmamaktadır. Yalnız port 11601, başarılı SSH veya sudo kullanımı kendi başına saldırı kanıtı sayılmayacaktır.

Kurallar `/var/ossec/bin/wazuh-logtest` ile hem pozitif hem negatif örneklerde sınanmalıdır. Bu araç decoder ve kural eşleşmesini test etmektedir. [B3] Sonrasında gerçek ajan→manager→indexer→Dashboard yolu ayrı sınanmalıdır. Başarılı logtest sonucu canlı alarm teslimi kanıtı değildir. Ham kayıt erişimi için gerekli saklama ayarı da seçilmelidir; Dashboard alarm listesinin bütün ham kayıtları içerdiği varsayılmamalıdır.

Mevcut `tools/watch_wazuh.py` yalnız 110101–110112 uygulama kurallarını kabul etmektedir. Yeni host/ağ kuralları için genişletilmeden tam erişim zinciri izleyicisi olarak kullanılamaz. Mevcut `tools/test_wazuh.py` de yalnız mevcut uygulama fixture'larını test etmektedir. Fixture örnekleri geçmiş zaman damgalı ve yapay kayıtlardır; gerçek tatbikat olayı gibi sunulmayacaktır.

## IOC, TTP ve olay bağlamı

Her bulgu için değer/tür, etkilenen varlık, ilk/son görülme, kaynak kayıt referansı, gerekçe, doğrulayan analist ve güven düzeyi tutulmalıdır. IP, hesap ve dosya yolu önce gözlem değeridir; olayla zararlı ilişkisi doğrulanınca IOC olarak sınıflandırılmalıdır.

Öncelikli gözlemler: dış web kaynağı, DMZ'nin iç SSH kaynağı, svc-web ve svc-sync hesapları, kullanılan ve eklenen anahtarların parmak izleri, pivot dosyasının gerçek SHA256 değeri, PID/PPID ve ilgili API oturumu. Özel anahtar, parola ve bearer token IOC dosyasına eklenmeyecektir. 650 m konum farkı, sıcaklık sapması ve veri yaşı IOC değil; olayın etki/anomali ölçümleridir.

TTP eşlemeleri kanıtlanan davranışa göre yapılmalıdır: T1190, T1548.003, T1552.004, T1090 ailesi, T1021.004, T1098.004. Depolanmış verinin değiştirildiği kanıtlanırsa T1565.001; gösterim manipülasyonu için T0832; proses parametresi için T0836; HMI görünürlüğünün engellenmesi için T0815 değerlendirilebilir. Veri saklama biçimi bilinmiyorsa doğrudan T1565.001 sonucu yazılmamalıdır.

Araç adı veya birkaç ortak TTP kesin APT atfı sağlamamaktadır. Yeterli ek kanıt yoksa değerlendirme “APT atfı için yeterli bulgu bulunmamaktadır” şeklinde tutulmalıdır. Benzerlik varsa dayanak, güven düzeyi, alternatif açıklama ve yöntem taklidi ihtimali yazılmalıdır. Boş kanıt şablonu `scenarios/red-blue/evidence-template.json` içindedir.

## Müdahale ve sonucun doğrulanması

| Kontrol | Uygulama yeri | Doğrulama |
|---|---|---|
| DMZ portalını sınırlama / zafiyeti giderme | FW-01 ve DMZ servisi; yetkili yönetim hesabı | Dış giriş zinciri tekrar edilememeli; gerekli sağlıklı veri akışı ayrıca sınanmalıdır. |
| Hatalı sudo yetkisini kaldırma | DMZ sudo yapılandırması | svc-web hesabı aynı yolla euid=0 elde edememelidir. |
| Servis anahtarını iptal etme | INT SSH yetkilendirmesi; lab anahtarı yenileme | Eski parmak iziyle yeni oturum açılamamalı; meşru kimlik ayrı sınanmalıdır. |
| Kalıcılık anahtarını kaldırma | INT authorized_keys | Eklenen anahtarın parmak izi artık kabul edilmemelidir. Dosya kaydı ve başarısız yeni oturum birlikte korunmalıdır. |
| Tüneli kesme / eski SSH yolunu kapatma | FW-01, DMZ ajan süreci ve mevcut bağlantı durumu | Yeni ve mevcut kanal üzerinden erişim kesilmelidir. Yalnız yeni bağlantı kuralı değiştirilip açık oturum devam ediyorsa müdahale tamamlanmış sayılmamalıdır. |
| Açık SSH oturumlarını sonlandırma | INT üzerinde doğrulanan saldırgan oturumları | Anahtar iptali mevcut oturumu otomatik kapatmış sayılmamalıdır. İlgili oturumun bitişi doğrulanmalıdır. |
| API kimliği/oturumunu iptal etme | KKBS-APP-01 rol ve oturum katmanı | Mevcut ve yeni yetkisiz yazma girişimleri reddedilmeli; viewer ve normal veri alımı çalışmalıdır. |
| Geri yükleme ve kararlılık | APP ve OT modeli | Onaylı konum, görev, reçete, bağımsız ölçüm ve bağlantı durumu yeni verilerle uyuşmalıdır. |

Wazuh Dashboard inceleme aracıdır. Firewall, SSH, servis ve API değişikliklerini ilk sürümde yetkili mavi takım/yönetim akışı uygulayacaktır. Otomatik Active Response hazır kabul edilmeyecektir. Yönetim işlemleri MGMT üzerinden yürütülecek; mavi takım istemcisine Proxmox veya bütün hedef VM'ler için yeni sınırsız ağ yolu eklenmeyecektir.

Mevcut `blue.py contain` yalnız uygulama modelini sınırlandırmaktadır. Anahtar iptali, SSH oturumu sonlandırma, ajan sürecini kapatma ve firewall değişikliği yapmamaktadır. Elle girilen alert_ref, Wazuh'taki alarmın otomatik doğrulandığı anlamına gelmemektedir. Gelecekte alarm doğrulaması için manager API ile indexer arama erişimleri ayrı tasarlanmalıdır.

## Kaynaklar

- [B1 — Wazuh dosya/dizin erişim denetimi](https://documentation.wazuh.com/current/user-manual/capabilities/system-calls-monitoring/use-cases/monitoring-file-and-directory-access.html)
- [B2 — FIM who-data ve gereksinimleri](https://documentation.wazuh.com/current/user-manual/capabilities/file-integrity/advanced-settings.html)
- [B3 — Decoder ve kural testi](https://documentation.wazuh.com/current/user-manual/ruleset/testing.html)
- [Wazuh JSON decoder](https://documentation.wazuh.com/current/user-manual/ruleset/decoders/json-decoder.html)
- [MITRE T1090.001 — Internal Proxy](https://attack.mitre.org/techniques/T1090/001/)
- [MITRE T1565.001 — Stored Data Manipulation](https://attack.mitre.org/techniques/T1565/001/)
- [MITRE T0832 — Manipulation of View](https://attack.mitre.org/techniques/T0832/)
- [MITRE T0836 — Modify Parameter](https://attack.mitre.org/techniques/T0836/)
- [MITRE T0815 — Denial of View](https://attack.mitre.org/techniques/T0815/)

Erişim tarihi: 31 Ekim 2026. Müdahale yolları, kabul hedefleri ve proje durumları projeye ait gereksinimlerdir.
