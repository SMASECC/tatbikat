# KALKAN-1 — Adım adım kurulum ve işletim

Sürüm: **0.3.0-lab.1** · 31 Ekim 2026

Bu rehber temiz bir **Proxmox VE 9.x x86-64** hosttan başlayarak sekiz VM'li labı kurmaktadır. İlk kurulum internet erişimi gerektirmektedir. Ürün kaynakları, saldırı/müdahale scriptleri, Ansible otomasyonu ve güncel arayüz pakettedir. Ubuntu/Kali imajları, Ligolo ikilileri ve işletim sistemi/Wazuh paketleri büyük dosyalar oldukları için kurulumda resmi kaynaklardan indirilmektedir; bunlar ZIP içine gömülü değildir. Hazırlık aşaması dosya özetlerini denetleyip yerel kilit oluşturmaktadır.

Bu teslimin yazılım testleri yerel ortamda yapılmıştır. Gerçek Proxmox ve Wazuh üzerinde sekiz VM'nin kurulumu ve tüm erişim zincirinin provası bu ortamda yapılmamıştır. Aşağıdaki kabul komutları bunu kullanıcının labında doğrulamaktadır. Kaynak paketi ile canlı ortam kabulü ayrı tutulmaktadır.

## 0. Başlamadan önce

Gerekenler: Proxmox 9.x kurulu fiziksel sunucu, root yönetim erişimi, ilk kurulum için çalışan DNS/internet, önerilen 64 GiB RAM, en az 380 GiB boş VM depolama alanı ve yedekler için ayrıca alan. 32 GiB altındaki host kurulumdan önce reddedilmektedir. Mevcut diğer VM'lerin yükü için ayrıca kapasite ayrılmalıdır.

Proxmox ISO kurulumu ve fiziksel disk seçimi bu komutların önkoşuludur. İşletim sistemi kurulmamış veya disk seçimi yapılmamış bir hosta bu rehberden doğrudan VM kurulumu yapılamaz.

Lab ağları `10.77.10.0/24`, `10.77.20.0/24`, `10.77.30.0/24`, `10.77.40.0/24`, `10.77.50.0/24`, `198.18.60.0/24`, `10.77.70.0/24` olarak seçilmiştir. Mevcut ağlarla veya VMID 100–170 planıyla çakışma olursa kurulum durmaktadır. Otomasyon mevcut yabancı VM'yi silmemektedir.

Yedi lab bridge'i fiziksel NIC'e bağlanmadan oluşturulmaktadır. Hostun mevcut yönetim adresi ve fiziksel bağlantısı korunmaktadır. Lab yönetimi için `vmbr10` üzerine ek `10.77.10.10/24` adresi atanmaktadır. İlk kurulumdaki geçici dış erişim NAT'ı kurulum sonunda kaldırılmaktadır. İzleyiciler için ilk teslimde SSH port yönlendirmesi kullanılmaktadır; switch üzerinde VLAN değişikliği gerekmemektedir.

## 1. Paketi Proxmox'a gönderin — Windows PowerShell

ZIP'i İndirilenler klasörüne kaydedin. Aşağıdaki blok Proxmox IP'sini bir kez soracaktır. Root parolası yalnız SSH/SCP istemcisinde girilmektedir.

```powershell
$KalkanPve = Read-Host "Proxmox yonetim IP adresi"
$KalkanPaket = Join-Path $env:USERPROFILE "Downloads\KALKAN-1_Tam_Paket_v0.3.0.zip"
scp $KalkanPaket "root@${KalkanPve}:/root/"
ssh "root@$KalkanPve"
```

İlk SSH bağlantısında gösterilen host anahtarını kendi Proxmox hostunuzla karşılaştırın. Sonraki komutlar Proxmox terminalinde çalıştırılacaktır.

## 2. Arşivi açın ve doğrulayın — Proxmox

```bash
cd /root
python3 -m zipfile -e KALKAN-1_Tam_Paket_v0.3.0.zip /root
cd /root/KALKAN-1
sha256sum -c SHA256SUMS
```

Tüm satırlar `OK` olmalıdır. Hata alınırsa kurulum başlatılmamalıdır. Mevcut bir `/root/KALKAN-1` kurulumu varsa arşivi onun üzerine açmayın; önce mevcut kaynak ve `.local` yapılandırmasını ayrı yere yedekleyin.

## 3. Host araçlarını hazırlayın — Proxmox

Aboneliksiz, temiz tatbikat hostu için seçilen yol:

```bash
cd /root/KALKAN-1
python3 deploy/bootstrap.py --community-repo
```

Bu komut Proxmox enterprise kaynaklarını yedekleyip devre dışı bırakır ve imzalı `pve-no-subscription` deposunu seçer. Debian kaynakları korunur. Gerekli kontrol araçları kurulur. Proxmox lisanslı enterprise deposunu kullanıyorsanız yukarıdaki komutun yerine aşağıdaki komutu çalıştırın:

```bash
python3 deploy/bootstrap.py
```

İki komuttan yalnız ortamınıza uygun olanını kullanın. Tam işletim sistemi yükseltmesi yapılmamaktadır.

## 4. Donanım ve ağ planını üretin — Proxmox

```bash
cd /root/KALKAN-1
python3 deploy/kalkan.py plan
```

Node adı, VM depolama deposu, dış erişim arayüzü, gerçek yönetim adresi ve DNS otomatik okunur. Gerçek değerler `.local/deployment.json` içine kaydedilir. Hata varsa VM veya host ağı değiştirilmez. Bu aşamada 8 VM / 7 özel bridge planı görülmelidir.

## 5. İmajları ve araçları hazırlayın — Proxmox

```bash
python3 deploy/kalkan.py prepare
```

Seçimler: Ubuntu Server 24.04 LTS cloud image, Kali 2026.2 genericcloud, Ligolo-ng 0.9.2 ve Wazuh 4.14 kurulum asistanı. Ajan sürümü 4.14.9-1 olarak seçilmiştir. İndirmeler `.local/cache` altına alınır. Ubuntu/Kali/Ligolo dosyaları resmi SHA256 listeleriyle karşılaştırılır. Gerçek indirilen dosyaların özetleri `artifacts.lock.json` içinde saklanır. Hatalı özetle kurulum sürmez. Wazuh ve OS paketleri kurulum sırasında ayrıca indirilecektir.

Önbelleği farklı bir kuruluma taşımak mümkündür; fakat bu dosyalar tek başına tam çevrimdışı APT/Wazuh deposu değildir. Bu sürüm çevrimiçi ilk kurulum içindir.

## 6. Tam kurulumu çalıştırın — Proxmox

```bash
python3 deploy/kalkan.py install
```

Bu adım özel bridge'leri, kaynak IP/MAC kısıtlarını, VM disklerini, cloud-init ayarlarını ve SSH anahtarlarını oluşturur. Önce FW-01 açılır; diğer VM'ler onun ardından açılır. Ansible, lab işaretini doğruladıktan sonra servisleri, TLS, auditd, Wazuh merkezi bileşenlerini, ajanları ve erişim politikalarını kurar. Bağımlılık kurulumu ilk açılışta zaman alabilir; komut tamamlanmadan terminal kapatılmamalıdır.

Kurulum bittiğinde lab **normal** profildedir. Komut çalıştırma zafiyeti, hatalı sudo ve eski SSH/pivot yolları açık değildir. Geçici internet çıkışı kapatılır. İşletim konsolu MGMT-01'e hazırlanır; bundan sonraki işletim komutları Proxmox üzerinden verildiğinde MGMT-01'e iletilir.

Bir adım hata verirse `FAIL` görülür ve başarılı kurulum kaydı yazılmaz. Sorun giderildikten sonra aynı klasörden `install` yeniden çalıştırılabilir. Bu işlem çalışan tatbikat sırasında yapılmamalıdır; normal profil ve yeni başlangıç uygulamaktadır.

## 7. Kurulum kabulünü çalıştırın — Proxmox

```bash
python3 deploy/kalkan.py check
python3 deploy/kalkan.py status
```

Beklenen sonuç: bağımsız OT kaynağı bağlıdır; 27 saha unsuru ve 4 tesis bulunmaktadır; altı Wazuh ajanı `Active` durumundadır; portal, entegrasyon, APP, OT, Ligolo proxy ve Wazuh hizmetleri çalışmaktadır. Wazuh ilk kayıtları henüz tamamlamadıysa kısa süre sonra `check` tekrar çalıştırılır. Hata varken tatbikata geçilmemelidir.

Bu kontrol henüz RCE/SSH/kalıcılık zincirinin tamamını çalıştırmaz. O zincir 11. adımda gerçek sonuçlarıyla sınanacaktır.

## 8. Tarayıcı erişimini açın — ikinci Windows PowerShell

İlk PowerShell penceresini Proxmox yönetimi için açık tutun. Windows'ta yeni bir PowerShell açıp aşağıdaki bloğu çalıştırın:

```powershell
$KalkanPve = Read-Host "Proxmox yonetim IP adresi"
ssh -N -L 8443:10.77.30.30:443 -L 9443:10.77.50.20:443 "root@$KalkanPve"
```

Bu pencere bağlantı devam ettiği sürece açık kalmalıdır. Komut satırında yeni istem görünmemesi normaldir. Port 8443 veya 9443 başka uygulamada kullanılıyorsa önce o uygulama kapatılmalıdır; rehberin standart adresleri bu iki portu kullanmaktadır.

Başka bir PowerShell penceresinde lab CA sertifikasını alın ve Windows kullanıcı sertifika deposuna ekleyin:

```powershell
$KalkanPve = Read-Host "Proxmox yonetim IP adresi"
$KalkanCa = Join-Path $env:USERPROFILE "Downloads\KALKAN-1-Lab-CA.crt"
scp "root@${KalkanPve}:/root/KALKAN-1/.local/pki/ca.crt" $KalkanCa
certutil.exe -user -addstore Root $KalkanCa
```

İçe aktarılan dosya yalnız bu kurulumun CA sertifikasıdır; CA özel anahtarı istemciye aktarılmamaktadır. Tarayıcı yeniden açıldıktan sonra şu adresler kullanılacaktır:

- Komuta Kontrol Merkezi: `https://localhost:8443/`
- Wazuh Dashboard: `https://localhost:9443/`

Tarayıcı sertifika hatası gösteriyorsa bağlantı adresini, CA dosyasını ve SSH tünelini düzeltin. Sertifika doğrulamasını kapatan bir komut gerekmemektedir.

## 9. Oturumları açın ve monitörleri yerleştirin

Proxmox terminalinde:

```bash
cd /root/KALKAN-1
python3 deploy/kalkan.py credentials
python3 deploy/kalkan.py wazuh-passwords
```

İlk komut kuruluma özel uygulama rol anahtarlarını gösterir. İkinci komut Wazuh asistanının oluşturduğu parola dosyasını yerel yönetim terminalinde gösterir. Wazuh Dashboard için `admin` kullanıcısına ait parola kullanılacaktır. Bu çıktılar kaynak kod deposuna eklenmemelidir.

Reji için ayrı tarayıcı profili kullanıp `white` rolüyle oturum açın. İzleyici ekranları için başka tarayıcı profilinde `viewer` rolüyle oturum açın. Aynı tarayıcı profilindeki rol çerezi bütün sekmelerde ortaktır; yalnız URL'deki audience parametresi backend yetkisi sayılmamaktadır. PLC operatörü gerekiyorsa ayrı profilde `operator` rolü kullanılmalıdır.

Oturum açtıktan sonra aşağıdaki adresleri ayrı pencerelerde açın ve monitörlere taşıyın:

| Monitör | Rol / adres |
|---|---|
| Özel reji | white · `https://localhost:8443/#view=director` |
| Komuta resmi | viewer · `https://localhost:8443/#view=command&audience=1` |
| Üs bölgesi | viewer · `https://localhost:8443/#view=operations&audience=1&display=map&region=karatepe` |
| Tesis / PLC | viewer · `https://localhost:8443/#view=plc&audience=1&display=wall&region=guneyova` |
| Telemetri | viewer · `https://localhost:8443/#view=telemetry&audience=1&display=wall` |
| Mavi takım | Wazuh Dashboard · `https://localhost:9443/` |

Tarayıcı tam ekranı için F11 kullanılabilir. Bölge ekranında 1–4 kısayolları ve otomatik kamera korunmuştur. İzleyici rolünün yazma istekleri backend'de de reddedilmektedir. Ses yalnız white/reji penceresinde açılmalıdır. Diğer bilgisayarlar kendi SSH erişim tünellerini ve viewer oturumlarını kullanabilir; her monitöre ayrı IP gerekmemektedir.

## 10. Temiz tatbikat turu açın — Proxmox

```bash
python3 deploy/kalkan.py new-run
python3 deploy/kalkan.py status
```

Yeni run_id oluşturulur. Önce eski tünel/SSH yolları kapatılır; eski servis oturumları sonlandırılır. Ayrı lab SSH anahtarı ve yeni integrator API anahtarı üretilir. Sonra exercise profili uygulanır. Gerçek yönetim anahtarları hedef DMZ veya INT hesabına verilmez. Önceki Wazuh ve olay kayıtları silinmez.

## 11. Kırmızı takım zincirini çalıştırın — Proxmox, terminal A

İlk prova için adım adım yol:

```bash
python3 deploy/kalkan.py red --interactive
```

Her adımda Enter beklenir. Mavi takım kayıtları incelerken bu terminal bekletilebilir. Her `PASS`, ilgili adımın gerçek sonucunun doğrulandığı anlamına gelmektedir; sonraki adım için öncekinin kanıt kaydı gerekmektedir.

| Sıra | Çalışan dosya | Sonuç |
|---|---|---|
| 01 | `lab/red/01_dmz_service_rce.py` | DMZ portalında svc-web yetkisinde gerçek shell komutu |
| 02 | `lab/red/02_dmz_privilege_escalation.py` | Hatalı sudo izniyle DMZ'de euid=0 doğrulaması |
| 03 | `lab/red/03_service_key_access.py` | Root korumalı, yalnız lab için üretilmiş svc-sync anahtarının alınması |
| 04 | `lab/red/04_pivot_channel.py` | Ligolo ajanı/proxy ve yalnız INT hedefi için tünel |
| 05 | `lab/red/05_lateral_ssh.py` | DMZ kaynak adresi üzerinden svc-sync SSH oturumu |
| 06 | `lab/red/06_persistence.py` | Yeni genel anahtar, ikinci SSH oturumu ve ayrı integrator API oturumu |
| 07 | `lab/red/07_position_manipulation.py` | Bildirilen konum manipülasyonu |
| 08 | `lab/red/08_mission_manipulation.py` | Görev ve sanal rota değişimi |
| 09 | `lab/red/09_hmi_manipulation.py` | Gösterilen ölçüm ile bağımsız proses verisinin ayrışması |
| 10 | `lab/red/10_process_command.py` | Yetkili uygulama kanalı üzerinden sanal vana/sıcaklık etkisi |
| 11 | `lab/red/11_visibility_loss.py` | Görünürlük kaybı, donan son değerler ve sanal drone/telsiz sonucu |

Dosyalar ortak uygulamayı `lab/red/common.py` içinden çağırmaktadır. Bunlar isimden oluşan boş dosyalar değildir; ortak modülde gerçek HTTP komutları, UID doğrulaması, anahtar okuma, SSH, kalıcılık ve API işlemleri bulunmaktadır.

Sonraki provalarda otomatik anlatım aralığı kullanılabilir:

```bash
python3 deploy/kalkan.py red --delay 30
```

İlk altı teknik işlem erişim zinciridir. Sonraki etkiler arasında 30 saniye beklenir. Gerçek erişim ve tespit sürelerinin 30 saniye olduğu iddia edilmemektedir. İlk erişim test hesabıyla değil, KALKAN Data Portal 1.0.0 içindeki bilerek oluşturulmuş **CWE-78** üzerinden sağlanmaktadır. Yayınlanmış bir ürün CVE'si kullanıldığı iddia edilmemektedir. Tüm saha/PLC etkileri yazılım modelindedir; gerçek PLC, drone veya RF komutu yoktur.

## 12. Wazuh'ta inceleyin — mavi takım monitörü

Wazuh Threat Hunting bölümünde zaman aralığını tatbikatı kapsayacak şekilde seçin. Örnek filtreler:

```text
rule.groups: kalkan1
```

```text
agent.name: DMZ-PORTAL-01 AND rule.id: (110201 OR 110211 OR 110212 OR 110213)
```

```text
agent.name: FW-01 AND rule.id: (110221 OR 110222)
```

```text
rule.id: (110102 OR 110103 OR 110104 OR 110105 OR 110106)
```

Yeni host kuralları 110211–110215, ağ kuralları 110221–110222, uygulama etkileri 110101–110106 kapsamındadır. Başarılı SSH için INT üzerindeki sshd kaydı da incelenmelidir. FIM değişikliği tek başına anahtar okuma kanıtı değildir; okuma için hedefli audit kaydı toplanmaktadır. Kural etiketi tek başına kesin teknik/aktör kararı değildir; süreç, hesap, zaman ve oturum bağlamı birlikte değerlendirilmelidir.

İnceleme çıktısını gerçek Wazuh dosyasından almak için terminal B'de:

```bash
cd /root/KALKAN-1
python3 deploy/kalkan.py blue-inspect
```

Komut güncel turun gerçek alarm kayıtlarını MGMT-01 üzerindeki `.local/evidence/<run_id>/` altına aktarır. Gözlem değerleri ve TTP adayları çıkarılır. IOC sınıflandırması ve APT değerlendirmesi analist incelemesi bekler. Dosyada varsayılan APT sonucu `insufficient_evidence` şeklindedir. Ortak TTP'lerden kesin grup adı üretilmez.

## 13. Sınırlandırın, geri yükleyin, doğrulayın — terminal B

Analist incelemesi sonrasında:

```bash
python3 deploy/kalkan.py blue-contain
```

Gerçek Wazuh alarmı okunur, turla ilişkilendirilir ve imzalı kontrol makbuzu APP'a gönderilir. Alarm bulunmazsa komut başarılı sayılmaz. Uygulama yazması/oturumu kapatılır; eski SSH/pivot yolları ve mevcut bağlantı durumları temizlenir; saldırgan anahtarları kaldırılır; svc-sync etkileşimli girişi ve hatalı sudo kapatılır. Mevcut bozulmuş konum/görev/ölçüm bu adımda gizlenmez.

Ardından:

```bash
python3 deploy/kalkan.py blue-restore
python3 deploy/kalkan.py blue-verify
```

Geri yükleme onaylı kayıtları ve proses reçetesini uygular. Doğrulama, yeni bağımsız veriyle en az 8 saniyelik kararlılık, SSH hesabı/anahtar temizliği ve API yazmasının 403 ile reddini sınar. Proses sıcaklığının dönmesi zaman alabilir; doğrulama en fazla 180 saniye bekler. Hata veya süre aşımı başarıya çevrilmez. İmha edilmiş drone işareti yeni tura kadar korunur.

Kapanış durumunu görün:

```bash
python3 deploy/kalkan.py status
```

`contained`, `restored`, `verified` alanları true olmalıdır. `reference_connected` true olmalı ve açık anomali listesi boş olmalıdır. Yeni tura geçmek için tekrar `new-run` kullanılacaktır. Kanıtlar korunacaktır.

## 14. Yedek ve kapatma

Kaynak arşivi, Git bundle ve `.local` çalışma ayarları ayrı korunmalıdır. `.local` gerçek yönetim sırlarını içerdiği için kaynak deposuna eklenmemelidir. MGMT-01 üzerindeki olay dosyaları yeni turda silinmemektedir.

VM yedeği için Proxmox'un vzdump aracını ayrı ve bağlı bir yedek disk/NAS üzerinde kullanın. Aşağıdaki örnekte `/mnt/kalkan-backup` önceden bağlanmış ayrı yedek hedefidir. Bu dizinin oluşturulması tek başına ayrı disk bağlandığı anlamına gelmez:

```bash
mountpoint -q /mnt/kalkan-backup && vzdump 100 110 120 130 140 150 160 170 --mode snapshot --compress zstd --dumpdir /mnt/kalkan-backup
```

Yedek geri yüklemesi, üretim dışı ayrı VMID ile test edilmelidir. Bu rehber mevcut VM'leri otomatik silen bir geri yükleme komutu içermemektedir. Host üzerindeki snapshot tek başına bağımsız yedek sayılmaz.

Gösterim bitince Windows SSH tüneli penceresinde Ctrl+C kullanın. VM'ler Proxmox'tan normal kapatma ile durdurulabilir. Sonraki açılışta lab profili ve hizmetler kaldığı yerden yüklenir; temiz tur için `new-run` gerekir.

## Sorun giderme

| Belirti | Kontrol / işlem |
|---|---|
| VMID, bridge veya IP çakışması | `plan` çıktısını okuyun. Mevcut kaynakları silmeyin. Temiz host/adres alanı kullanın. |
| İlk açılış beklemesi | Proxmox'ta ilgili VM konsolunu açın; `cloud-init status --long` ve `/var/log/cloud-init-output.log` kayıtlarını inceleyin. DNS, APT ve geçici dış erişim yolunu doğrulayın. |
| APT 401 / enterprise hatası | Aboneliğe uygun bootstrap komutunu kullanın. Kaynak değişikliğinin yedeği `.local/apt-before` içindedir. |
| Wazuh ajanı Active değil | Kayıt sırasında 1515, olay aktarımında 1514 yolunu ve WAZUH-01 hizmetlerini kontrol edin. Kabul geçmeden kırmızı takımı başlatmayın. |
| 04 pivot adımı başarısız | Kali'de `sudo journalctl -u kalkan-ligolo -n 80`; DMZ'de `/var/lib/kalkan-portal/ligolo.log`; FW'de 11601 izin kaydı ve doğru MAC/ajan kimliği incelenmelidir. Tünel kurulmadan 05 çalıştırılmaz. |
| SSH host key changed | VM yeniden oluşturulduysa host anahtarını gerçek VM üzerinden doğrulayın. StrictHostKeyChecking kapatılmamalıdır. |
| Browser bağlanamıyor | Windows SSH tüneli açık mı; 8443/9443 boş mu; doğru Proxmox'a bağlanıldı mı kontrol edin. |
| Sertifika uyarısı | Doğru kurulumun CA sertifikasını içe aktarın; `localhost` adresini kullanın. Farklı hostun eski CA'sını kullanmayın. |
| PLC/telemetri güncel değil | `status` içinde reference_connected değerini, OT mTLS sertifikalarını ve `kalkan-ot` hizmetini inceleyin. Son değer yeni veri gibi gösterilmemektedir. |
| blue-contain alarm bulamıyor | Wazuh zaman aralığı, rule.groups filtresi, ajan kayıt kaynağı ve yeni kurallar kontrol edilmelidir. Fixture dosyasıyla başarı kaydı üretilmez. |
| blue-verify süre aşıyor | Referans bağlantısı, sıcaklık/hizmet dönüşü ve açık bulgular incelenmelidir. Süre aşımı doğrulanmış kapanış değildir. |

## Teslim doğrulamasının sınırları

Kaynak derlemesi, mevcut frontend kontrolleri, backend testleri, yerel mTLS/OT entegrasyon testleri ve Ansible sözdizimi kontrolü yapılmıştır. Ek UID ile düşük yetkili süreç çalıştırma testi bu geliştirme ortamının UID eşlemesi nedeniyle atlanmıştır. Yerel shell enjeksiyonu ve yamalı profil ret testi çalışmıştır. Asıl 01 scripti gerçek labda svc-web ve root olmayan UID koşulunu zorunlu tutmaktadır.

Proxmox VM oluşturma, cloud-init, nftables uygulaması, Ligolo'nun gerçek ikilisi, sekiz VM'deki sudo/SSH/kalıcılık zinciri, Wazuh engine/alarmlar ve gerçek monitör provası kullanıcı ortamındaki kabul kapsamındadır. Bu adımlar bu teslim için yapılmış gibi raporlanmamaktadır.

Ürün belgeleri: [Proxmox](https://pve.proxmox.com/pve-docs/pve-admin-guide.pdf), [Kali cloud](https://kali.download/cloud-images/kali-2026.2/), [Ubuntu cloud](https://cloud-images.ubuntu.com/noble/current/), [Ligolo-ng](https://docs.ligolo.ng/), [Wazuh quickstart](https://documentation.wazuh.com/current/quickstart.html), [Wazuh audit](https://documentation.wazuh.com/current/user-manual/capabilities/system-calls-monitoring/index.html).
