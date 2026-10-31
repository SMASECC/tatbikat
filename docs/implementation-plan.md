# Teslim ve kabul durumu

Kaynak ve kurulum otomasyonu 0.3.0-lab.1 içinde sunulmuştur. Çalışan kaynaklar lab/ ve deploy/ dizinlerindedir. Büyük imajlar ve araç ikilileri ilk kurulumda indirilir.

| İş | Durum |
|---|---|
| Portal, 11 kırmızı takım giriş noktası ve profil kodu | Kaynak hazır; tam VM provası beklenmektedir. |
| Bağımsız OT, APP, güncel frontend bağlantısı | Yerel mTLS/HTTP testleri geçti; VM provası beklenmektedir. |
| Proxmox VM/ağ otomasyonu ve Ansible | Kaynak ve sözdizimi kontrolü hazır; gerçek host kurulumu yapılmamıştır. |
| Wazuh merkezi/ajan kurulumu, yeni kurallar ve decoder | Kaynak hazır; gerçek engine/alarm kabulü beklenmektedir. |
| IOC/TTP incelemesi, imzalı Wazuh makbuzu ve OS/ağ müdahalesi | Kaynak hazır; gerçek olay provası beklenmektedir. |
| Kopyala-yapıştır kurulum ve işletim rehberi | docs/delivery içinde hazırdır. |

Bir sonraki iş yeni belge üretmek değildir; rehberi gerçek lab hostunda çalıştırmak, check ile altyapıyı ve 01–11 ile erişim zincirini doğrulamaktır.
