# Güncel kurulum yolu

[Git'ten tek komutla Proxmox kurulumu](git-install.md) güncel başlangıç noktasıdır. `install.sh` host ön kontrolünü, bağımlılıkları, VM/servis kurulumunu ve servis kabulünü birleştirir. Tam Ansible dağıtımı `deploy/playbooks/site.yml` konumundadır; işletim komutları `deploy/kalkan.py` üzerinden çalışır.

[İşletim rehberi](delivery/KALKAN-1_Kurulum_Rehberi_v0.3.0.md) sertifikaları, ekranları, senaryo provasını ve mavi takım müdahalesini açıklar. ZIP/USB aktarımı alternatif kaynak aktarım yoludur.

Kaynak kontrolü `python3 scripts/check.py`, Ansible sözdizimi ve envanter kontrolü `python3 scripts/check_ansible.py` ile yapılır. Yerel API/mTLS testleri ve Ansible sözdizimi kontrolü gerçek Proxmox/Wazuh kabulünün yerine geçmez. Fiziksel host üzerinde tam kurulum ve senaryo provası henüz doğrulanmamıştır.
