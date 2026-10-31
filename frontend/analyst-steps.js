  const ANALYST_STEPS=[
  {
    "focus": "Normal erişim ve uygulama davranışının Wazuh üzerinden incelenmesi.",
    "logs": "DMZ web erişimleri, güvenlik duvarı kuralları, iç entegrasyon ve uygulama kayıtları; normal hesap ve bağlantı örüntüsü.",
    "ioc": "Bu aşamada IOC tanımlanmamaktadır. Başlangıç kayıtları olay bağlamı için kullanılmaktadır.",
    "ttp": "Aktif saldırı tekniği eşlemesi yapılmamaktadır.",
    "response": "Müdahale, somut bulguya göre planlanmalıdır.",
    "proof": "27 saha unsuru, dört tesis, ayrı DMZ / KKBS / saha ağları ve izinli veri akışı.",
    "handoff": "Başlangıç durumunu gösteriniz. Mavi takımın log görünürlüğünü teyit ediniz.",
    "limit": "Gösterim, gerçek Wazuh bağlantısının veya log alımının kanıtı değildir."
  },
  {
    "focus": "DMZ servis ihlalinden iç entegrasyon sunucusuna uzanan erişim zincirinin analizi.",
    "logs": "DMZ web ve süreç kayıtları, sudo / auditd, özel anahtar dosyasına erişim, dış TCP/TLS bağlantısı, güvenlik duvarı ve hedef SSH kayıtları.",
    "ioc": "Dış kaynak IP, DMZ ajanının adresi, svc-web / svc-sync hesapları, anahtar parmak izi ve ilişkili süreç artefaktları bağlamıyla çıkarılmalıdır. Özel anahtarın kendisi loglanmamalıdır.",
    "ttp": "T1190 → T1548.003 → T1552.004 → T1090 → T1021.004 → T1098.004. Eşlemeler gerçek kayıtlarla doğrulanmalıdır.",
    "response": "İhlal edilen servis izole edilmeli; ele geçirilen anahtar iptal edilmeli; dış tünel, eski TCP/22 izni ve yetkisiz uygulama erişimi ilgili kontrollerde engellenmelidir.",
    "proof": "Wazuh üzerinde dış web isteği, DMZ süreç zinciri, anahtar erişimi, tünel ve hedef SSH oturumu.",
    "handoff": "Teknik alt adımları anlatınız. Her aşamada ilgili kaydı teyit ediniz. Kanıt incelemesi tamamlanmadan sunum süresini zorunlu ilerleme ölçütü olarak kullanmayınız.",
    "limit": "Mevcut frontend bu zinciri modellemektedir. VM, RCE, tünel ve yeni Wazuh kuralları henüz kurulmamıştır. Tünel firewall iznini aşmamaktadır. Ligolo ajanı için root zorunlu değildir."
  },
  {
    "focus": "Konum değişikliğinin hesap ve oturum kayıtlarıyla ilişkilendirilmesi.",
    "logs": "KKBS entegrasyon sunucusundaki SSH ve uygulama/API erişim kayıtları, konum değişiklikleri ve bağımsız konum ölçümü.",
    "ioc": "İşlem yapan uygulama hesabı, kaynak entegrasyon sunucusu ve oturum çıkarılmalıdır. 650 m sapma bir anomali bulgusudur.",
    "ttp": "T1565.001 · Stored Data Manipulation; değiştirilen kaydın saklanma biçimi kanıtla doğrulanmalıdır.",
    "response": "Yetkisiz kayıt değişikliği yolu ilgili uygulama ve erişim kontrolünde engellenmelidir.",
    "proof": "Haritada bildirilen konum, bağımsız konum ve 650 m fark.",
    "handoff": "Analistin değişikliği ilgili hesap veya oturumla ilişkilendirdiğini teyit ediniz.",
    "limit": "Konum kaydı manipülasyonu gerçek drona uçuş komutu göndermemektedir."
  },
  {
    "focus": "Görev değişikliklerinin davranış ve denetim kaydı analizi.",
    "logs": "Görev denetim kayıtları, yazma işlemleri, işlem hesabı ve görev yürütme logları.",
    "ioc": "Kaynak sistem, hesap, oturum ve değiştirilen kayıtlar çıkarılmalıdır. Varsa ilişkili dosya artefaktları incelenmelidir.",
    "ttp": "T1565.001 · Görev kaydı manipülasyonu. İşlemlerin prosedür düzeyindeki sırası ayrıca kaydedilmelidir.",
    "response": "İhlal edilen entegrasyon hesabının görev kaydı yazma yetkisi sınırlandırılmalıdır. Onaylı plan geri yüklenmelidir.",
    "proof": "Beş unsurun değişen hedefleri ve kırmızı görev güzergâhları.",
    "handoff": "Wazuh bulgusu ile görev değişikliği kaydı arasındaki ilişkiyi teyit ediniz.",
    "limit": "Genel bir ATT&CK tekniği tek başına belirli bir APT grubunu göstermemektedir."
  },
  {
    "focus": "HMI logları ve bağımsız ölçüm üzerinden manipülasyon analizi.",
    "logs": "HMI uygulama logları, değişiklik kayıtları, ilgili süreç kayıtları ve LT-02 ölçümü.",
    "ioc": "Varsa ilişkili süreç, dosya yolu ve dosya özeti çıkarılmalıdır. Zararlı ilişki kanıtlanmadan IOC olarak sunulmamalıdır.",
    "ttp": "T0832 · Manipulation of View. HMI gösterimi ile proses kumandası ayrı incelenmelidir.",
    "response": "Doğrulanan saldırı yolu ilgili uçnokta ve uygulama kontrollerinde engellenmelidir.",
    "proof": "LT-01 %88, LT-02 %58 ve 30 yüzde puanlık fark.",
    "handoff": "Analistin HMI değişikliği ile bağımsız ölçümü karşılaştırdığını teyit ediniz.",
    "limit": "Sensörler arasındaki fark, bir dosyanın zararlı olduğunu veya belirli bir grubun varlığını kanıtlamamaktadır."
  },
  {
    "focus": "Yetkisiz komut kaynağı ve erişim yetkilerinin analizi.",
    "logs": "PLC komut kayıtları, uygulama/API erişimleri, hesap rolü ve set değeri değişiklikleri.",
    "ioc": "Komutu veren hesap, kaynak uçnokta, oturum ve işlem zamanı çıkarılmalıdır.",
    "ttp": "T0836 · Modify Parameter; T1692.001 · Command Message. Eşleme gözlenen komuta göre yapılmalıdır.",
    "response": "Entegrasyon hesabının komut yetkisi ve uygulama oturumu sınırlandırılmalıdır. İlgili ağ geçidinde izinli komut politikası uygulanmalıdır.",
    "proof": "Vana %15, hedef 82 °C ve hizmet %26.",
    "handoff": "Sahne geçişini gerçek engelleme işlemi olarak sunmayınız.",
    "limit": "Wazuh log incelemesini desteklemektedir. Engelleme, yapılandırılmış yanıt veya ilgili yönetim kontrolü gerektirmektedir."
  },
  {
    "focus": "Bağlantı kaybının kök nedeninin ve fiziksel etkinin ayrıştırılması.",
    "logs": "Bağlantı ve sistem logları, son paket zamanı, HMI akışı ve bağımsız saha gözlemi.",
    "ioc": "Kesintiyle ilişkili hesap, kaynak ve olaylar çıkarılmalıdır. Sinyal kaybı tek başına IOC değildir.",
    "ttp": "T0815 · Denial of View, HMI görünürlük kaybı için değerlendirilebilir. Dron imhası fiziksel sonuçtur.",
    "response": "Doğrulanan ağ, uçnokta veya uygulama erişimi ilgili kontrolde engellenmelidir. Kesintinin kaynağına uygun işlem seçilmelidir.",
    "proof": "Dron imhası, telsiz kesintisi ve HMI paket yaşı.",
    "handoff": "Mavi takımın bağlantı kaybını ve bağımsız gözlemi birlikte değerlendirdiğini teyit ediniz.",
    "limit": "RF karıştırması veya belirli bir saldırı kaynağı, yalnız bağlantı kesintisinden çıkarılamaz."
  },
  {
    "focus": "Doğrulanan giriş yoluna uygun engelleme ve sonuç kontrolü.",
    "logs": "Anahtar iptali, tünel kesintisi, eski SSH kuralının kaldırılması, oturum sonlandırma ve müdahale sonrası erişim kayıtları.",
    "ioc": "Doğrulanmış IOC listesi; dayanak log, ilk/son görülme ve etkilenen varlık bilgileriyle korunmalıdır.",
    "ttp": "Gözlenen saldırı zinciri, girişten etkiye kadar zaman sırasıyla çıkarılmalıdır.",
    "response": "Mavi takım DMZ servisini izole etmeli, servis anahtarını iptal etmeli, dış tüneli kesmeli ve eski SSH iznini kaldırmalıdır. Uygulama oturumları sonlandırılmalı; sonuç yeni loglarla doğrulanmalıdır.",
    "proof": "Wazuh üzerinde müdahale sonrası kayıtlar; sahada korunan veri bozulmaları.",
    "handoff": "Mavi takım engelleme sonucunu teyit ettikten sonra geri yükleme sahnesine geçiniz.",
    "limit": "Reji düğmeleri kimlik, firewall veya PLC üzerinde gerçek engelleme uygulamamaktadır."
  },
  {
    "focus": "Geri yükleme, tekrar eden davranış ve hizmet kararlılığı kontrolü.",
    "logs": "Servis yaması, SSH anahtar ve sudo değişiklikleri, uygulama yetki düzenlemeleri, geri yükleme kayıtları ve yeni telemetri.",
    "ioc": "IOC’lerin yeniden görülüp görülmediği kontrol edilmelidir. Adli izler ve olay zaman çizelgesi korunmalıdır.",
    "ttp": "Gözlenen tekniklerin devam edip etmediği ve olası ek prosedürler incelenmelidir.",
    "response": "Adli izler korunduktan sonra kalıcılık anahtarları kaldırılmalı, servis zafiyeti ve sudo / uygulama izinleri düzeltilmelidir. Onaylı kayıtlar geri yüklenmeli; yeniden erişim izlenmelidir.",
    "proof": "Konum farkı 0 m, vana %70, hedef 48 °C ve hizmet %88.",
    "handoff": "Analistin geri yükleme ve tekrar kontrolü sonucunu teyit ediniz.",
    "limit": "Normalleşen bir grafik, saldırgan erişiminin tamamen sona erdiğini tek başına kanıtlamamaktadır."
  },
  {
    "focus": "IOC, TTP ve varsa tehdit aktörü benzerliğinin ihtiyatlı raporlanması.",
    "logs": "Olay zaman çizelgesi, doğrulanmış göstergeler, araç/altyapı artefaktları ve müdahale çıktıları.",
    "ioc": "IOC listesi, bağlam ve güven düzeyiyle raporlanmalıdır. Sahipliği veya zararlı niteliği doğrulanmamış değerler ayrı tutulmalıdır.",
    "ttp": "Teknik ve prosedür örtüşmesi bilinen profillerle karşılaştırılmalıdır. APT adı ancak yeterli kanıt varsa benzerlik olarak belirtilmelidir.",
    "response": "Kalıcı önlemler ve izleme ihtiyaçları belirlenmelidir. Fiziksel kayıp ayrı olay sonucu olarak korunmalıdır.",
    "proof": "26 etkin saha unsuru, dört tesis ve korunmuş dron imha kaydı.",
    "handoff": "Analistin raporunu esas alınız. Grup adı, kanıt ve güven düzeyi olmadan atıf yapmayınız.",
    "limit": "Taklit / yanıltma ihtimali korunmalıdır. Mevcut gösterim tek başına belirli bir APT grubuna atıf sağlamamaktadır."
  }
];
