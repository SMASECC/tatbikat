# Proxmox üzerinde Git'ten kurulum

Kurulum girişi sürümü: **0.3.0-lab.2**.

Bu giriş Proxmox **VE 9.x / x86-64**, root Shell, BIOS'ta açık VT-x/AMD-V ve ilk kurulumda internet gerektirir. 64 GiB RAM önerilir. İlk kurulumda VM disk deposunda **380 GiB**, kaynakların bulunduğu `/root` dosya sisteminde ayrıca yaklaşık **25 GiB** boş alan kontrol edilir. Bunlar farklı depolarda olabilir; aynı dosya sistemindeyse iki ihtiyacı birlikte karşılayın. VMID 100–170 ve yedi lab ağı mevcut kaynaklarla çakışmamalıdır. Kurulum bunları değiştirmeden önce kontrol eder.

GitHub deposu özel olduğunda Proxmox'un da okuma izni olmalıdır. ChatGPT'nin Git erişimi fiziksel sunucuya aktarılmaz. HTTPS klonlama kullanıcı adı/parola sorarsa GitHub kullanıcı adınızı ve yalnız bu depoya okuma yetkili token'ınızı parola alanına girin. GitHub hesap parolası kullanılamaz. Token'ı komuta, URL'ye veya dosyaya yazmayın; sohbetle paylaşmayın. Önceden yapılandırılmış Git kimlik doğrulaması da kullanılabilir. Depoyu herkese açmak gerekmez.

## Tek komut

Proxmox web arayüzünde **node → Shell** açın ve root olarak çalıştırın. Aşağıdaki komut **aboneliksiz tatbikat hostu** içindir. Enterprise APT girdileri yedeklenir, imzalı no-subscription kaynağı seçilir. Host yönetim IP'si/fiziksel NIC korunur; yeni özel lab bridge'leri ve VM'ler oluşturulur.

```bash
(command -v git >/dev/null || apt-get install -y git) && (test -d /root/KALKAN-1/.git || git clone --branch v0.3.0-lab.2 --single-branch https://github.com/SMASECC/tatbikat.git /root/KALKAN-1) && bash /root/KALKAN-1/install.sh --community-repo
```

Geçerli enterprise aboneliğiniz varsa son `--community-repo` seçeneğini kaldırın. Git paketi kurulamazsa veya depoya erişim reddedilirse lab kurulumu başlamaz; önce Proxmox'un Debian paket kaynaklarını/GitHub erişimini düzeltin. Mevcut `/root/KALKAN-1` dizini otomatik silinmez veya güncellenmez. Başka bir checkout varsa kendi yolunda `bash install.sh --community-repo` çalıştırın. Dizinlerin üzerine ZIP açmayın.

Kurulum sırası: salt okunur host kontrolü → kontrol araçları → checksum doğrulamalı resmi imaj/araç indirmeleri → özel bridge/VM/cloud-init → Ansible ile servisler → bağımsız OT verisini bekleme → normal profil ve geçici NAT'ı kaldırma → en fazla 5 dakika boyunca gerçek servis/ajan kabulü.

Bu işlem yalnız yeni lab kaynaklarını yönetir. Mevcut Proxmox güvenlik duvarı/kurumsal ağ politikaları lab yönetim trafiğini engelliyorsa otomasyon bu politikaları kaldırmaz; ağ yöneticisi incelemelidir. Python/Node geliştirme testlerini Proxmox'a kurmak gerekmez; sunucu kurulumunda Python ve sanal ortam bağımlılıkları hazırlanır.

## Başarılı kurulum ve tekrar çalıştırma

`KURULUM VE SERVİS KABULÜ GEÇTİ` yalnız gerçek APP/OT, 27 saha unsuru, dört tesis, servisler ve altı Wazuh ajanı kontrolü geçtiğinde yazılır. Sonuç `.local/install-complete.json` içinde saklanır. Salt okunur ön kontrol:

```bash
cd /root/KALKAN-1
bash install.sh --preflight-only
```

Başarısız kurulumdan sonra hatayı düzeltip aynı komutu yeniden çalıştırın; doğrulanmış cache ve `.local` korunur. Yarım kalmış tek ve sahipliği doğrulanmış VM diski yeniden kullanılabilir. Beklenmeyen/çoklu kullanılmayan diskler varsa elle inceleme istenir; yabancı disk silinmez. Başarılı kurulumun tekrarında mevcut tatbikat sıfırlanmaz, yalnız servis kabulü çalışır. Kaynakları yeniden uygulamak için `bash install.sh --community-repo --reconfigure` kullanılır; bu seçenek labı normal profile sıfırlar. Önce çalışma ayarlarını ve kanıtları yedekleyin. Kaynakları güncellemek ayrıca kontrollü bir işlemdir, otomatik `git pull` yapılmaz.

Hata halinde başarı kaydı üretilmez; hostun geçici NAT'ı hata çıkışında da kaldırılır. Mevcut VM'ler silinmez. `.local` klasörünü silerek tekrar başlamak anahtarları ve sahiplik bilgisini kaybettirebilir. İşlem elektrik/çekirdek çökmesiyle kesildiyse normal hata temizliği çalışamayabilir; host NAT durumunu ve kaldığı adımı inceleyin.

## Erişim ve fiziksel kabul

```bash
cd /root/KALKAN-1
python3 deploy/kalkan.py access
python3 deploy/kalkan.py credentials
```

İlk komut Windows/Linux yönetim bilgisayarınızda açık tutulacak SSH tünelini gösterir. Lab CA sertifikası `/root/KALKAN-1/.local/pki/ca.crt` içindedir; yönetim bilgisayarının güvenilir sertifika deposuna aktarılır. Uygulama/Wazuh rolleri, ekran açılışı ve tam kırmızı/mavi takım provası [kurulum rehberindeki](delivery/KALKAN-1_Kurulum_Rehberi_v0.3.0.md) 8–13. adımlarla yapılır. Kurucu saldırı zincirini otomatik başlatmaz.

Yerel kaynak testleri gerçek Proxmox kurulumu değildir. Bu değişiklik bulut ortamında yerel testler ve Ansible sözdizimiyle sınanmıştır; fiziksel host üzerinde VM/cloud-init/Ligolo/Wazuh zinciri ve yeniden açılış provası tamamlanmadan tam lab kabulü iddia edilmez.

Bu sürümün yerel doğrulamasında 15 kontrol grubu tamamlandı; 89 Python testinden 88'i geçti, root test denetleyicisi gerektiren biri atlandı. Üç Ansible playbook sözdizimi ve sekiz VM envanteri doğrulandı. Ligolo resmi checksum listesinde seçilen ikili adları doğrulandı. Ubuntu/Kali/Wazuh indirme adreslerinin canlı kontrolü bu bulut ortamının ağ politikası nedeniyle tamamlanamadı; fiziksel kurulumun indirme aşaması bu erişimleri doğrulayacak ve hata varsa VM/ağ oluşturmadan duracaktır.

İlk kurulum Ubuntu cloud, Kali cloud, GitHub/Ligolo, Wazuh, Debian/Ubuntu/Kali APT aynaları ve PyPI'ye erişir. İnternet çıkışı kısıtlı ağlarda indirme yönlendirmeleri ve imzalı paket depoları da izinli olmalıdır. ZIP/Git kaynak paketi tam çevrimdışı kurulum değildir.
