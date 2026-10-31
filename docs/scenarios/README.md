# Kırmızı takım ve mavi takım senaryoları

Senaryo: **K1-RED-BLUE-01** · Teslim: **0.3.0-lab.1**

Bu sürümde gereksinimlerin yanında uygulama kodları ve kurulum otomasyonu da bulunmaktadır. Canlı Proxmox/Wazuh kabulü kullanıcı ortamında tamamlanacaktır.

| Kaynak | Durum / yer |
|---|---|
| Gerçek DMZ komut çalıştırma ve yamalı profil | lab/portal.py, lab/profiles.py |
| İlk altı OS erişim adımı | lab/red/01_dmz_service_rce.py – 06_persistence.py; uygulama lab/red/common.py |
| Beş saha/PLC etki adımı | lab/red/07_position_manipulation.py – 11_visibility_loss.py |
| Bağımsız OT ve APP | lab/ot.py, lab/live_engine.py, lab/app.py |
| Wazuh host/ağ kaynakları | lab/node_setup.py, lab/wazuh/host_rules.xml, lab/wazuh/network_decoder.xml |
| IOC/TTP incelemesi ve müdahale | deploy/blue.py, lab/profiles.py, deploy/kalkan.py |
| Kurulum | deploy/bootstrap.py, deploy/kalkan.py, deploy/playbooks/site.yml |

[Kurulum rehberi](../delivery/KALKAN-1_Kurulum_Rehberi_v0.3.0.md), [kırmızı takım](red-team-requirements.md), [mavi takım](blue-team-requirements.md), [ortak çizelge](evidence-matrix.md) ve [kabul listesi](runbook.md) birlikte kullanılmalıdır.

Ortak aşama verisi scenarios/red-blue/requirements.json içindedir. make scenario-plan çizelgeyi yeniden üretir; işlem veya saldırı çalıştırmaz. live_ready=false, bütün kaynakların yokluğu anlamına gelmez; tam VM/Wazuh provası bu geliştirme ortamında yapılmadığı için kabul henüz işaretlenmemiştir.

İzleyici ekranlarında teknik kartlar gösterilmemektedir. Mavi takım gerçek Wazuh kullanır. Rejide 10×30 saniyelik anlatım planı korunur; canlı veri sahne zamanlayıcısından üretilmez. Gerçek OS işlemleri ve yazılım modelindeki saha/PLC sonuçları kanıt türü bakımından ayrı tutulur.
