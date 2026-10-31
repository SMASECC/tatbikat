# Uygulama sırası

| Sıra | İş | Durum |
|---|---|---|
| 1 | Güncel frontend ve backend başlangıç kaynaklarını tek Git deposunda toplama | Bu paket |
| 2 | Tek topoloji kaynağı, envanter üretimi, doğrulama ve kaynak testleri | Bu paket |
| 3 | Gerçek host node, storage, template, NIC/bridge ve kapasite eşlemesi | Kullanıcı ortamı bilgileri beklenmektedir |
| 4 | VM klonlama ve ilk ağ uygulaması rolü | Geliştirilecek |
| 5 | Wazuh merkezi kurulum ve ajan kaydı | Geliştirilecek |
| 6 | FastAPI, PostgreSQL ve OT modelinin ayrılması | Geliştirilecek |
| 7 | Son frontend'in ortak canlı veriye bağlanması | Geliştirilecek |
| 8 | Zafiyetli servis ürünü/sürümü ve gerçek log zinciri | Seçim ve doğrulama yapılacak |
| 9 | Normal, tatbikat ve iyileştirilmiş profillerin uygulanması | Geliştirilecek |
| 10 | Mavi takım müdahalesi, çoklu ekran provası ve temiz tur | Entegrasyon testi yapılacak |

Kurum içi Git servisi varsa bu depo orada özel erişimle tutulabilir. Uzak servis seçimi yapılmadığı için bu pakette origin adresi bulunmamaktadır. Git geçmişi bundle dosyasıyla taşınmaktadır.

İlk gerçek kurulum işi, fiziksel sunucu envanteri üzerinden Proxmox şablonları ve bridge eşlemesini kesinleştirmektir. Wazuh ve saldırı zinciri aşamaları, kaynakları yalnız mevcut diye kurulmuş kabul edilmeyecektir.
