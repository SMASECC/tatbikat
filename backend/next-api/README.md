# Yeni API geliştirme işleri

Hedef teknoloji Python 3.12, FastAPI/Uvicorn, PostgreSQL 16 ve WebSocket'tir. Bu dizin API uygulaması değildir; üzerinde uzlaşılan geliştirme sözleşmesini taşımaktadır.

Kırmızı/mavi takımın aşama ve kimlik bağımlılıkları `docs/scenarios/` ve `scenarios/red-blue/requirements.json` içindedir. SSH hesabı → ayrı integrator kimliği → API yetkisi ilişkisi, OS/ağ müdahalesi ve varlık bazlı drone/telsiz/görev model olayları bu sözleşmeyle birlikte geliştirilmelidir.

1. Kimlikler: viewer, operator, integrator, blue ve white; API tarafında rol denetimi ve iptal edilebilir oturum.
2. Ortak durum: run_id, event_seq, revision, kaynak ölçüm zamanı ve sunucunun kabul zamanı.
3. Veri kabulü: OT modelinden telemetri ve bağımsız referans; entegrasyon işçisinden doğrulanan kayıtlar.
4. Yayın: GET snapshot ve WebSocket; bağlantı kesilince son değer ve veri yaşı; en az iki farklı istemcide eşitleme.
5. Komut: Hedef, değer aralığı, rol ve işlem kimliği doğrulaması; OT modeline ayrı yetkili kanal.
6. Olay: Durum değişikliğiyle aynı işlemde kalıcı kayıt; Wazuh'a aktarılacak JSON denetim günlüğü.
7. Müdahale: Servis kimliği/oturum iptali, geri yükleme ve kararlılık doğrulaması.
8. Frontend: Yerel senaryo modeli ile canlı veri modu ayrımı; sunum adımı gerçek saldırı başarısı sayılmayacaktır.

Mevcut etki komutları model testlerinde kullanılabilir. RCE, pivot ve SSH başarısı host/ağ kayıtlarıyla ayrıca doğrulanmalıdır. Parola, özel anahtar veya oturum belirteci günlüklenmemelidir.
