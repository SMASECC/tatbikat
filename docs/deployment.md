# Güncel kurulum yolu

0.3.0-lab.1 için [tam kurulum rehberi](delivery/KALKAN-1_Kurulum_Rehberi_v0.3.0.md) kullanılmalıdır. Eski infra/playbooks iskeleti ana dağıtım yolu değildir. Ana giriş deploy/kalkan.py; tam Ansible playbook deploy/playbooks/site.yml konumundadır.

Bu geliştirme ortamında Ansible yerel RPC/UID sınırları ve ayrı tarayıcı ağı nedeniyle tam host provası yapılmamıştır. Yerel API/mTLS testleri ve Ansible sözdizimi kontrolü gerçek Proxmox/Wazuh kabulünün yerine geçmez.
