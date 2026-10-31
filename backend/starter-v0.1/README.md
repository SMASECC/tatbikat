# KALKAN-1 · Backend başlangıç paketi v0.1.0

30 Ekim 2026

Son onaylanan dört bölgeli frontend, ortak bir Python sunucusuna bağlandı. Kırmızı takım komutları sunucudaki konum/görev kayıtlarını, HMI ölçümünü, PLC hedeflerini ve paket dağıtımını değiştirir. Mavi takım Wazuh alarmlarını inceler, oturumu iptal eder, uzak yazmayı kilitler, güvenilir kaydı geri yükler ve hizmetin kararlı olduğunu doğrular.

Bu sürüm uygulama seviyesinde çalışan bir laboratuvar emülasyonudur. Gerçek bir açığı sömürmez, işletim sistemi ele geçirmez ve fiziksel PLC'ye komut göndermez. Kırmızı takım için ele geçirilmiş bir komuta oturumunun etkileri kontrollü lab API'siyle temsil edilir. Veri değişiklikleri, proses tepkisi, kalıcı kayıt, rol denetimi ve API trafiği çalışan backend'dedir. Wazuh kendi manager/agent kurulumu üzerinden gerçek JSON günlüklerini alır; frontend, Wazuh alarmı varmış gibi veri üretmez.

Bu paket, eski `KALKAN-1_v1.2.0_Proxmox_Ansible.zip` içindeki S01–S15 mimarisine otomatik geçiş yapmaz. Güncel frontend'in 10 adımına yönelik ayrı bir başlangıç hizmetidir. Eski dosyaları, VM ağlarını ve Proxmox yapılandırmasını değiştirmez. Ansible örneğinin hedef VM'sini uygulamadan önce kendi envanterinle eşleştir.

## 1. İlk çalıştırma

Gereksinim: Python 3.10 veya üzeri. Çalıştırma için pip paketi, Node, Docker veya internet gerekmez. Node sadece isteğe bağlı frontend projeksiyon testinde kullanılır. Linux sunucu dağıtımı hedeflenmiştir; yerel komutlar Python ile çalışır.

ZIP'i açtıktan sonra proje klasöründe:

```bash
python3 tools/init_lab.py
python3 server.py
```

Tarayıcıdan `http://127.0.0.1:8088` adresini aç. Rol seçip `runtime/credentials.json` içindeki o role ait anahtarla giriş yap. Anahtarlar her kurulumda ayrı üretilir; ZIP içinde hazır anahtar yoktur. Dosyayı takımlar arasında paylaşmak yerine herkese yalnız kendi rol anahtarını ver.

| Rol | Kullanım |
|---|---|
| viewer | Yalnızca ekranları ve sunucu verisini okur |
| operator | Ekrandaki PLC pompaları, vana, frekans ve sıcaklık kumandaları |
| red | Altı kontrollü saldırı etkisi; viewer/blue/WHITE yetkisi yok |
| blue | Alarm referanslı containment, geri yükleme, doğrulama |
| white | Yeni tur, mavi takım müdahaleleri ve yerel tesis kumandası |

Sunucu yerelde çalıştırıldığında scriptler anahtarları varsayılan olarak `runtime/credentials.json` dosyasından okur. Ayrı takım makinelerinde yalnız ilgili rolün `KALKAN_RED_TOKEN`, `KALKAN_BLUE_TOKEN` veya `KALKAN_WHITE_TOKEN` ortam değişkenini tanımla; tüm anahtar dosyasını kopyalama. `KALKAN_URL` servis adresini, `KALKAN_CREDENTIALS` farklı anahtar dosyası yolunu seçer. Belirteçler URL'ye veya shell komut parametresine eklenmez.

## 2. Monitörler ve sunucu bağlantısı

Reji bölümündeki bağlantılar mevcut monitör düzenlerini açar. Ayrı bilgisayarlar aynı backend'e bağlandığında ortak veriyi alır. Ekranlar 500 ms aralıklarla sunucuyu sorgular. Saldırı senaryosunu ilerletmek için eski yerel oynatma düğmeleri devre dışıdır; adımlar scriptlerden gelir. Tesis operatörüyle giriş yapıldığında PLC butonları backend'e komut gönderir. İzleyici hesabıyla yazma reddedilir.

| Ekran | Adresin hash bölümü |
|---|---|
| Komuta özeti | `#view=command&audience=1` |
| Harekât resmi | `#view=operations&audience=1` |
| Tesis / PLC | `#view=plc&audience=1&display=wall` |
| Telemetri | `#view=telemetry&audience=1&display=wall` |
| Olay akışı | `#view=events&audience=1` |
| Reji | `#view=director` |

Konumlar ve proses ölçümleri backend'den alınır. Telemetri sütunlarının önceki dalgalı görünümü korunur; renk kaynağın bütünlük durumunu gösterir. Bu sütunlar RF spektrum analizörü değildir. Bağlantı açıksa bozuk veri kırmızı sütunlarla akabilir; kesintide son değerler saklanır, aktivite durur. API bağlantısı 2,5 saniyeyi aşarsa uyarı çıkar ve gösterge yeni veri varmış gibi devam etmez. Önceki zaman tabanlı taslağın geçmiş trendleri canlı modda gizlidir; gerçek tarihçe API'si sonraki sürüme bırakılmıştır.

İlk dağıtımda uygulamaya SSH tüneliyle erişilebilir. Örnekteki kullanıcı ve IP'yi kendi VM'nle değiştir:

```bash
ssh -N -L 8088:127.0.0.1:8088 kalkanops@10.77.10.90
```

Ardından o bilgisayarda `http://127.0.0.1:8088` açılır. Ayrı bilgisayarların her biri kendi tünelini açabilir. Doğrudan lab arayüzüne bağlama seçeneği `python3 server.py --host LAB_VM_IP --port 8088` şeklindedir. Bu ilk sürümün kendi HTTP sunucusunda TLS yoktur; rol anahtarları için ilk kurulum örneği loopback/SSH tüneli kullanır.

## 3. Kırmızı takım akışı

İkinci terminali proje klasöründe aç. Tek tek komutlar:

```bash
python3 tools/red.py session
python3 tools/red.py position
python3 tools/red.py mission
python3 tools/red.py plc-measurement
python3 tools/red.py plc-command
python3 tools/red.py outage
```

Script yalnız KALKAN API'sine bu sabit eylemleri gönderir; keyfi hedef, işletim sistemi komutu veya dosya yolu kabul etmez. `session` sonucu özel bir yerel oturum dosyasına yazılır ve sonraki adımlarda kullanılır. Backend sıra kontrolü yapar; adımlar atlanamaz. Yeni tur için WHITE reset gerekir.

Tüm adımları sırayla ve her adımda anlatıcı onayıyla ilerletmek için:

```bash
python3 tools/red.py run
```

Her adım Enter bekler. Wazuh tespitini ve ekrandaki etkiyi gösterip sonra ilerle. Otomatik zamanlama istenirse `python3 tools/red.py run --delay 15` kullanılır; ilk adım hemen, sonraki adımlar belirtilen aralıkla uygulanır.

| Adım | Sunucudaki değişiklik | Wazuh kuralı / seviye | Mavi takımın inceleyeceği kanıt |
|---|---|---|---|
| Başlangıç | 27 saha + 4 tesis; referanslar uyumlu | 110112 / 3 | Yeni `run_id`, başlangıç kaydı |
| session | Tanımlı istemci listesi dışındaki lab komuta oturumu | 110101 / 8 | Hesap, kaynak IP, oturum politikası |
| position | KR-ZPT-01 bildirilen konumuna 650 m eklenir; referans değişmez | 110102 / 12 | `position_delta_m`, bağımsız konum |
| mission | Onaylı kuzey kontrol noktası yerine doğu vadisi bildirilir | 110103 / 12 | `mission_approved`, `mission_reported` |
| plc-measurement | GO-PLC-01 LT-01 değerine 30 puan eklenir; LT-02 değişmez | 110104 / 12 | `measurement_delta` |
| plc-command | Vana %70 → %15; sıcaklık hedefi 48 → 82 °C | 110105 / 13 | Onaylı/bildirilen vana ve sıcaklık |
| outage | Karatepe'nin altı saha kaynağı ve Güneyova HMI paket dağıtımı durur | 110106 / 12 | 3 saniyelik paket yokluğu, büyüyen veri yaşı |

Kesinti ana servisi ve Wazuh günlüğünü durdurmaz. HMI'nin son alınan örneği donarken yerel proses ve bağımsız referans ilerler. Gerçek ağ kesintisi/DoS yerine uygulama katmanındaki paket teslimi durdurulur. Tesis sıcaklığı ve hizmeti hedefe zamanla yaklaşır; komut verildiği anda geçmiş taslaktaki sabit sayılara sıçramaz.

## 4. Wazuh bağlantısı

Mevcut bir Wazuh manager + dashboard ve backend VM'sinde manager'a kayıtlı bir Wazuh agent kullan. Paket Wazuh'u kurmaz ve mevcut manager kimlik bilgilerini varsaymaz. Manager sürümü ve agent bağlantısını mevcut ortamında doğrula.

Akış: **backend → tek satırlık JSON günlük → yerel Wazuh agent → manager kuralları → Wazuh alarmı → mavi takım incelemesi → müdahale API'si → frontend**.

### Agent tarafı

Systemd/Ansible kurulumunda günlük yolu `/var/log/kalkan-1-backend/events.jsonl` olur. `wazuh/localfile.xml` içeriğini agent'ın `/var/ossec/etc/ossec.conf` dosyasında bir `<ossec_config>` öğesinin **içine** ekle. Mevcut dosyayı bu parçayla tamamen değiştirme. Aynı yolu ikinci kez ekleme.

```xml
<localfile>
  <log_format>json</log_format>
  <location>/var/log/kalkan-1-backend/events.jsonl</location>
</localfile>
```

Yerel geliştirme kurulumunda `runtime/events.jsonl` oluşur; XML'de bunun gerçek **mutlak yolunu** kullan. Agent'ın dosyayı ve üst klasörleri okuyabildiğini doğrula. Daemon `wazuh` kullanıcısıyla okuyorsa o kullanıcıya `kalkan` grubundan okuma verilebilir; herkes için yazma izni açma.

```bash
sudo systemctl restart wazuh-agent
```

### Manager tarafı

Paketin `wazuh/` ve `tools/` klasörlerini manager üzerinde aynı proje yapısını koruyarak bulundur. Mevcut özel kurallarda 110100–110112 aralığının kullanılmadığını kontrol et. Çakışıyorsa kuralları ve `engine.py` içindeki RULES eşlemesini, watcher aralığını, test beklentilerini birlikte düzenle.

```bash
sudo install -o root -g wazuh -m 0640 wazuh/kalkan_rules.xml \
  /var/ossec/etc/rules/kalkan_rules.xml
sudo python3 tools/test_wazuh.py
sudo systemctl restart wazuh-manager
```

`tools/test_wazuh.py` gerçek `/var/ossec/bin/wazuh-logtest -U` aracını kullanır; 12 örneğin kural ID'si, seviyesi ve `json` decoder'ı eşleşmezse hata verir. Bu test ruleset doğrulamasıdır. Ayrıca agent → manager → dashboard zincirinin canlı bir `red.py position` olayıyla uçtan uca görülmesi gerekir. Toplama başladıktan sonra yeni olay üret; eski satırların otomatik geçmiş taramasına güvenme.

Dashboard filtre örnekleri:

```text
rule.groups:kalkan1
rule.groups:kalkan1 AND data.run_id:"GUNCEL_RUN_ID"
rule.id:110104 AND data.asset_id:"GO-PLC-01"
```

Manager üzerindeki gerçek alarm akışını terminalde okumak için:

```bash
sudo tail -n 0 -F /var/ossec/logs/alerts/alerts.json | python3 tools/watch_wazuh.py
```

Bu izleyici yalnız Wazuh'un `id`, `rule.id`, `data.app`, `data.event_seq`, `data.run_id` alanlarını içeren alarm zarfını kabul eder. Ham backend günlüğünü Wazuh alarmı diye göstermez. Komut önerir; kendiliğinden containment veya geri yükleme çalıştırmaz. `--run-id GUNCEL_RUN_ID` ile mevcut tura daraltılabilir. Önerilen komutu blue terminalinde, blue anahtarıyla çalıştır.

Tespitler uygulamanın bağımsız referans/politika karşılaştırmasından üretilen olaylara dayanır. Wazuh bu olayları JSON olarak ayrıştırıp kurallarla alarm üretir. Referans ve HMI bu sürümde aynı backend içinde ayrı mantıksal veri alanlarıdır; ayrı VM/sensör güven sınırı henüz uygulanmamıştır. `client_trusted=no` kontrollü oturum emülasyonunun girdisidir; Wazuh'un kendi başına IP itibarı araştırması yaptığı anlamına gelmez.

## 5. Mavi takım müdahalesi

Önce Wazuh'taki alarmı aç; `run_id`, `asset_id`, kaynak, ölçüm farkı ve önceki olayları doğrula. Alarmda görünen referansları kullan:

```bash
python3 tools/blue.py contain \
  --alert-id 'WAZUH_ALARM_ID' --rule-id 110102 --event-seq 5 \
  --reason 'Wazuh konum uyumsuzluğu incelendi; oturum iptali ve uzak yazma kilidi'
```

Buradaki ID ve `event-seq 5` yalnız biçim örneğidir; kendi alarmındaki gerçek değerleri gir. Backend, olayın güncel tura ve ilgili kural eşlemesine ait olmasını denetler. `alert_id` operatörün girdiği kanıt referansıdır; backend bu ilk sürümde Wazuh API'sine bağlanıp alarm ID'sinin özgünlüğünü ayrıca sorgulamaz.

Containment, red oturumunu iptal eder, o turun red hesabını ve uzak yazmayı kapatır. Mevcut bozuk kayıtları, yanlış hedefleri ve kesintiyi silmez. Böylece ekranda etkinin hâlâ sürdüğü görülür. Yeni red adımı **403** ile reddedilir; Wazuh 110110 olayı oluşur.

Güvenilir görev ve proses reçetesi hazır olduğunda:

```bash
python3 tools/blue.py restore --reason 'Bağımsız konum, görev kaydı ve güvenli proses reçetesi geri yüklendi'
python3 tools/blue.py status
python3 tools/blue.py verify --wait --reason 'Bağlantı, bütünlük, sıcaklık ve hizmet kararlı olarak doğrulandı'
```

| Müdahale | Sonuç | Wazuh kuralı |
|---|---|---|
| contain | Oturum iptali + uzak yazma kilidi; mevcut etki korunur | 110107 |
| restore | Konum/görev/HMI doğruluğu ve paket dağıtımı geri gelir; vana, ısı ve pompalar onaylı reçeteye döner | 110108 |
| verify | Açık bulgu yok, bağlantılar açık, tüm tesislerin hizmeti ≥ %98 ve sıcaklığı onaylı değere ±4 °C; koşullar en az 8 sn kararlı | 110109 |

`verify --wait` en fazla 180 saniye bekler. Koşullar sağlanmadan yalnız ekranda yeşil göstermek için aşama ilerlemez. Müdahale otomatik olarak yeniden saldırı izni açmaz. Yeni tur yalnız WHITE ile:

```bash
python3 tools/white.py reset
```

Yeni `run_id` oluşur; eski olaylar ve SQLite kayıtları silinmez. Red ekibi yeniden `session` adımından başlar.

**Gösterim seçimi:** Tüm etki zincirini göstereceksen her adımın Wazuh alarmını inceleyip containment'i son etki adımında uygula. Erken müdahale denemesinde ilk alarmdan sonra containment uygula; sonraki red adımlarının reddedildiğini göster. Sonra yeni tur aç. Erken müdahaleden sonra saldırının sessizce devam etmesi bu pakette beklenen davranış değildir.

## 6. Proxmox / Ansible başlangıç dağıtımı

Mevcut Proxmox'ta hazırlanmış Linux lab VM'sine dağıtım örneği eklenmiştir. Playbook VM oluşturmaz, bridge/VLAN/firewall değiştirmez ve Wazuh kurmaz. `deploy/inventory.example.yml` adresleri örnektir. Önce SSH erişimini ve hedefin doğru lab VM'si olduğunu kontrol et. Ansible denetleyicisinde ansible-core ve hedefte Python 3 gerekir.

```bash
cp deploy/inventory.example.yml deploy/inventory.yml
# inventory.yml içindeki hedef IP ve kullanıcıyı düzenle.
ansible-inventory -i deploy/inventory.yml --graph
ansible-playbook -i deploy/inventory.yml deploy/deploy.yml
```

Hizmet: `kalkan-backend.service`; kaynak: `/opt/kalkan-1-backend`; özel durum/anahtarlar: `/var/lib/kalkan-1-backend`; agent günlüğü: `/var/log/kalkan-1-backend/events.jsonl`; varsayılan dinleme: `127.0.0.1:8088`. Önceki paketle aynı kaynak/durum klasörü kullanılmaz.

```bash
sudo systemctl status kalkan-backend
sudo journalctl -u kalkan-backend -n 50 --no-pager
```

Kurulum anahtarını yönetim makinesinde görüntüleme örneği: `sudo cat /var/lib/kalkan-1-backend/credentials.json`. Çıktı kurulum sırrıdır; takım katılımcılarına yalnız ilgili rolün değerini ver. Hizmet yeniden dağıtıldığında mevcut anahtar dosyası üzerine yazılmaz.

## 7. Kalıcı durum, olaylar ve test

SQLite, proses durumunu ve olayları birlikte tutar. JSONL dosyası Wazuh'a aktarılan olay kopyasıdır. Olaylar `event_seq` ve `run_id` ile ilişkilendirilir; yeniden başlatma veriyi korur. Kesilmiş son JSON satırı başlangıçta onarılır ve SQLite'taki eksik olaylar yeniden dışarı aktarılır. Disk yazımı başarısızsa hizmet çalışmaya devam ediyormuş gibi gösterilmez. Uzun süreli günlük döndürme ve arşivleme ilk sürümde yoktur; kanıt dışa alımında SQLite/WAL ve JSONL'yi birlikte dikkate al.

```bash
python3 -m unittest discover -s tests -v
```

Bu paket hazırlanırken 18 test ve Node ile 28 frontend projeksiyon kontrolü geçti. Testler rol ayrımını, kaynak verisinin ekrana aktarımını, komutların proses etkisini, kesintide donmayı, containment sonrası engellemeyi, geri yükleme ve 8 saniye kararlılık koşulunu, gerçek HTTP üzerinden CLI akışını kapsar. XML/örnek alan eşleşmesi yerelde kontrol edildi. Wazuh manager/agent, Ansible hedefi ve Proxmox bu çalışma ortamında mevcut olmadığından **gerçek Wazuh alarm üretimi ve VM dağıtımı burada çalıştırılmadı**; kurulumdaki kabul testi yukarıdadır.

Klasörler: `engine.py` proses/durum/kayıt; `server.py` HTTP ve rol denetimi; `tools/red.py` kırmızı takım; `tools/blue.py` mavi takım; `tools/watch_wazuh.py` gerçek alarm okuyucu; `wazuh/` kurallar ve test olayları; `web/frontend-approved.html` onaylanan taslak; `web/index.html` backend'e bağlı sürüm; `tools/build_frontend.py` bağlantı adaptörü; `deploy/` dağıtım örnekleri; `tests/` kabul kontrolleri.

## 8. Sonraki geliştirme için sınır

Bir sonraki adım mevcut Wazuh sürümü, agent yerleşimi ve lab VM adresleriyle uçtan uca alarm kabulüdür. Ardından ayrı telemetri/proses servisleri ve bağımsız referans VM'si, gerçek Modbus/TCP lab cihazı, Wazuh alarm ID'sini indexer üzerinden doğrulama, seçilmiş kurallara Active Response ve gerçek zaman serisi geçmişi eklenebilir. Bu sürümde otomatik Active Response açık değildir; aksiyon mavi takım operatöründedir.

## Resmî Wazuh kaynakları

- [JSON decoder](https://documentation.wazuh.com/current/user-manual/ruleset/decoders/json-decoder.html)
- [Log dosyası toplama](https://documentation.wazuh.com/current/user-manual/capabilities/log-data-collection/monitoring-log-files.html)
- [Özel kurallar](https://documentation.wazuh.com/current/user-manual/ruleset/rules/custom.html)
- [Kural sözdizimi](https://documentation.wazuh.com/current/user-manual/ruleset/ruleset-xml-syntax/rules.html)
- [wazuh-logtest ve -U](https://documentation.wazuh.com/current/user-manual/reference/tools/wazuh-logtest.html)
