# KALKAN 1 çalışma kuralları

- Kanonik frontend kaynakları frontend/ içindedir. Derleme python3 frontend/build.py ile yapılır. Dist dosyaları elle düzenlenmez.
- infra/topology.json adres ve VM planının tek kaynağıdır. Dış lab 198.18.60.0/24 olarak kalmalıdır.
- Kırmızı/mavi takım aşama sözleşmesi scenarios/red-blue/requirements.json içindedir. Çizelge make scenario-plan ile üretilir. Planlanan script isimleri çalışan dosya gibi gösterilmez.
- backend/starter-v0.1 geçmiş başlangıç sürümüdür. Onun web kopyası güncel frontend olarak sunulmaz.
- Canlı veri, Wazuh alarmı veya saldırı başarısı varmış gibi veri üretilmez. Demo ve gerçek olay kaydı ayrımı korunur.
- Reji kartları izleyici ekranlarına taşınmaz. İzleyici PLC kumanda kilidi korunur.
- .local, ortam dosyaları, özel anahtarlar ve çalışma günlükleri Git'e eklenmez.
- Yapılan değişikliğe uygun kontroller çalıştırılır. Depo için ana kontrol python3 scripts/check.py komutudur.
- Gerçek Proxmox node, depolama ve fiziksel NIC/bridge eşlemesi olmadan otomatik host ağı değişikliği yapılmaz. Bu depoda henüz bu işi yapan bir playbook yoktur.
