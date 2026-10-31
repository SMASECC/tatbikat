# Uygulama ve prova kabul listesi

Bu liste kurulum tamamlandığında uygulanacaktır. Kaynak doğrulaması aşağıdaki maddelerin yapıldığı anlamına gelmemektedir. Kaynaklar ve kurulum kodu pakettedir; ilk canlı prova gerçek hostta kabul beklemektedir.

## Kurulum sırası

1. Fiziksel host, Proxmox şablonları, depolama ve yedi ağ bölgesi gerçek ortama eşlenmelidir. İzinli/yasak yollar ve aynı L2 ağındaki VM firewall kısıtları test edilmelidir.
2. Wazuh, altı ajan ve manager'ın kendi izleme kaynakları kurulmalıdır. Saat eşitlemesi, auditd, SSH, FIM, web, uygulama ve FW kayıtları gerçek kaynaklarda doğrulanmalıdır.
3. Zafiyetli servis ürünü/sürümü seçilmeli; sağlıklı ve zafiyetli imaj özetleri sabitlenmelidir. İlk shell'in svc-web olduğu ve özel anahtarın ilk yetkiyle okunamadığı sınanmalıdır.
4. Ayrı lab anahtarları, sudo hatası, eski SSH yolu, pivot çıkışı ve uygulama rol fazlalığı profil değişkenlerine bağlanmalıdır. Gerçek yönetim anahtarları hedef VM'lere konulmamalıdır.
5. İlk altı kırmızı takım scripti ve uygulama kimliği geçişi lab/red ile lab/integrator_command.py üzerinden gerçek hedeflerde sınanmalıdır. Önkoşul veya kanıt eksikse zincir durmalıdır.
6. Yeni Wazuh host/ağ kuralları gerçek pozitif/negatif loglarla test edilmelidir. Sonuçlar canlı Dashboard üzerinde ayrıca görülmelidir.
7. Yeni API, OT modeli ve güncel frontend bağlanmalıdır. Gerçek olay zamanları, reji zamanlayıcısından bağımsız olmalıdır.
8. Mavi takım müdahale araçları, kanıt dışa aktarımı, geri dönüş ve ikinci temiz tur doğrulanmalıdır.

## Normal profil kabulü

- [ ] Dış lab yalnız yayınlanan DMZ HTTPS hizmetine ulaşmaktadır.
- [ ] DMZ→INT eski SSH yolu ve DMZ→Kali pivot çıkışı kapalıdır.
- [ ] Servis yaması/sağlıklı imaj etkin, sudo yetkisi daraltılmış ve DMZ'de ele geçirilebilir eski anahtar yoktur.
- [ ] Entegrasyon hesabı normal veri kabulünü yapmaktadır; fazla yazma/komut isteği reddedilmektedir.
- [ ] Tüm kayıt kaynaklarının sağlıklı örneği Wazuh'ta görülmektedir. Eksik kayıt kaynağı sessizce normal sayılmamaktadır.

## Tatbikat profili kabulü

- [ ] İlk erişim test hesabıyla değil, seçilen servis koşuluyla oluşmaktadır. Web isteği ve svc-web shell süreci ilişkilendirilmiştir.
- [ ] DMZ'deki gerçek yetki değişimi ve ardından özel anahtarın okunduğu gösterilmiştir.
- [ ] Ligolo dosyalarının sürüm/hash kaydı, TLS kimliği, ajan süreci ve dış bağlantısı doğrulanmıştır.
- [ ] İç SSH oturumunun kaynak adresi DMZ'dir. Kullanılan svc-sync hesabı ve anahtar parmak izi doğrulanmıştır.
- [ ] authorized_keys değişikliği ve eklenen anahtarla ikinci oturum birlikte görülmüştür.
- [ ] SSH kimliği ile integrator API kimliği ayrı ilişkilendirilmiştir. Uygulama etkisi yalnız bu ek yetki koşulu sağlanınca oluşmaktadır.
- [ ] Konum, görev, HMI, proses komutu ve kesinti olayları ortak tur ve olay referansıyla canlı ekranlara ulaşmaktadır.
- [ ] Drone/telsiz/görev animasyonları sanal model olayıyla oluşmaktadır. Gerçek donanım veya RF etkisi iddia edilmemektedir.
- [ ] Mavi takım her bulguyu dayanak kaydıyla ilişkilendirmiş, IOC ve anomali ölçümlerini ayırmış, yalnız kanıtlanan TTP'leri eşlemiştir.

## Müdahale ve kapanış kabulü

- [ ] Anahtar iptali, kalıcılık temizliği, açık SSH oturumu sonlandırma ve uygulama oturumu iptali ayrı doğrulanmıştır.
- [ ] Dış tünel hem yeni hem mevcut bağlantılar için kesilmiştir. FW kuralı ve bağlantı durumu kanıtı korunmuştur.
- [ ] Sağlıklı servis/sudo/API yetki profili uygulanmıştır. Eski yollarla tekrar erişim veya yetkisiz komut başarısızdır.
- [ ] Onaylı konum, görev ve tesis reçetesi geri yüklenmiştir. Yeni telemetri bağımsız referansla karşılaştırılmıştır.
- [ ] Veri tazeliği, bağlantı, bütünlük ve proses kararlılığı birlikte doğrulanmıştır. Yalnız yeşil ekran kapanış kanıtı sayılmamaktadır.
- [ ] Kayıt, alarm, sorgu ve kontrol sonuçları erişimi kısıtlı kanıt alanına aktarılmış ve özetleri alınmıştır.
- [ ] APT değerlendirmesi dayanak/güven düzeyi içermektedir; yeterli kanıt yoksa atıf yapılmamıştır.
- [ ] Yeni run_id ile temiz tur açılmıştır. Eski kanıtlar silinmemiş; eski anahtar ve oturumlar yeniden çalışmamıştır.

## Mevcut kaynakta çalıştırılabilen kontroller

`make scenario-plan` gereksinim tutarlılığını; `make check` frontend, mevcut model backend ve depo sözleşmelerini kontrol etmektedir. Ansible sözdizimi/yerel ortam sınırları `docs/deployment.md` içinde belirtilmiştir. Bu komutlar yukarıdaki canlı kabul maddelerini tamamlanmış olarak işaretlemeyecektir.
