# Kırmızı takım ve mavi takım senaryoları

**Senaryo kimliği:** K1-RED-BLUE-01

Bu dizin iki takımın kurulum, gözlem, müdahale ve kabul gereksinimlerini tanımlamaktadır. Önceki pakette altyapı gereksinimleri ve uygulama etki istemcileri bulunmaktaydı. DMZ erişim zincirinin script, kimlik ve kanıt bağımlılıkları ayrı bir gereksinim seti halinde sunulmamaktaydı. Bu eksiklik giderilmiştir.

| Belge | Kullanım |
|---|---|
| [Kırmızı takım](red-team-requirements.md) | İlk erişim, yerel yetki yükseltme, servis anahtarı, pivot, yatay hareket, kalıcılık ve saha/PLC etkileri |
| [Mavi takım](blue-team-requirements.md) | Wazuh kayıt kaynakları, IOC ve TTP çıkarımı, analist onaylı engelleme ve kapanış |
| [Ortak çizelge](evidence-matrix.md) | Her aşamanın önkoşulu, kaynak durumu, kanıtı, müdahalesi ve doğrulaması |
| [Uygulama ve prova](runbook.md) | Kurulum sırası, sahte başarıyı önleyen kabul koşulları ve sıfırlama |
| [Yapılandırılmış plan](../../scenarios/red-blue/requirements.json) | Script ve kural durumu dahil ortak veri kaynağı |
| [Kanıt şablonu](../../scenarios/red-blue/evidence-template.json) | İnceleme sırasında doldurulacak boş olay, IOC, TTP ve müdahale kaydı |

## Kaynakların gerçek durumu

| Kaynak | Durum |
|---|---|
| Güncel frontend, 10 sunum adımı ve 6 özel DMZ anlatım kartı | Kaynak hazırdır; ortak canlı backend bağlantısı yapılmamıştır. |
| `backend/starter-v0.1/tools/red.py` | Altı kontrollü uygulama etkisi bulunmaktadır. RCE, pivot veya SSH açmamaktadır. |
| `backend/starter-v0.1/tools/blue.py` | Uygulama seviyesinde status, contain, restore ve verify bulunmaktadır. OS, SSH ve firewall müdahalesi yapmamaktadır. |
| `backend/starter-v0.1/wazuh/kalkan_rules.xml` | 110101–110112 uygulama kuralları kaynakta bulunmaktadır. Canlı Wazuh doğrulaması yapılmamıştır. |
| `01_dmz_service_rce.py`–`06_persistence.py` | Rejideki planlanmış isimlerdir. Çalışan script dosyaları bu sürümde bulunmamaktadır. |
| Host/ağ korelasyonları, IOC dışa aktarımı ve OS/ağ müdahale araçları | Gereksinimleri tanımlanmıştır; geliştirilecektir. |

`make scenario-plan` yalnız yerel dosyaları doğrular. Gerçek VM, kimlik veya Wazuh erişimini doğrulamaz. Bu sürümün durumu **gereksinimler hazır, canlı kurulum beklenmektedir** şeklindedir.

## Sunum ve gerçek işlem ayrımı

10 sunum adımının hedef süresi 30'ar saniyedir. DMZ zincirinin altı teknik alt adımı, ilk erişim sunum adımı altında anlatılmaktadır. Gerçek kurulumda her işlem kendi sonucunu ve kaynak kanıtını üretecektir. Altı işlemin 30 saniyede biteceği veya Wazuh tespitinin sunum süresine uyacağı varsayılmamaktadır. Reji gerektiğinde adımı bekletecektir. Senaryo veya anlatım zamanlayıcısı başarı kaydı oluşturmayacaktır.

İzleyiciler harekât resmi, bölge, tesis/PLC ve telemetri ekranlarını izleyecektir. Mavi takım ayrı monitörde gerçek Wazuh Dashboard kullanacaktır. Teknik kartlar ve script adları yalnız özel reji ekranında kalacaktır.
