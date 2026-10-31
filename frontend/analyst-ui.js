  const WAZUH_ADDRESS_KEY='kalkan-wazuh-address-v1';
  function normalizeWazuhAddress(value){
    const raw=String(value||'').trim();if(!raw)return '';
    let url;try{url=new URL(raw);}catch{throw new Error('Geçerli bir Wazuh ana adresi giriniz.');}
    if(!['http:','https:'].includes(url.protocol)||!url.hostname||url.username||url.password||url.search||url.hash)throw new Error('Wazuh ana adresini http veya https ile, kullanıcı ve oturum bilgisi eklemeden giriniz.');
    return url.href;
  }
  let wazuhAddress='';
  try{wazuhAddress=normalizeWazuhAddress(localStorage.getItem(WAZUH_ADDRESS_KEY));}catch{}
  function analystDeskMarkup(){
    return `<section class="k-panel k-analyst-desk">${sectionHead('Mavi takım / Wazuh','HARİCÎ MONİTÖR')}<div class="k-analyst-desk-body"><p>Log incelemesi ve tehdit analizi, ayrı monitörde Wazuh üzerinden yürütülecektir.</p><div id="k-wazuh-launch"></div><details class="k-wazuh-settings" ${wazuhAddress?'':'open'}><summary>Wazuh adresi</summary><form id="k-wazuh-address-form"><label for="k-wazuh-address">Wazuh ana adresi</label><input id="k-wazuh-address" type="url" autocomplete="off" placeholder="https://wazuh-sunucusu" value="${esc(wazuhAddress)}"><button class="k-button" type="submit">Adresi kaydet</button></form></details><div class="k-analyst-focus"><small>GEÇERLİ AŞAMADA ODAK</small><p id="k-analyst-focus"></p></div><p class="k-analyst-handoff">Sahneyi ilerletmeden önce mavi takımın bulgu ve müdahale sonucunu teyit ediniz.</p></div></section>`;
  }
  function renderWazuhLaunch(){
    put('k-wazuh-launch',wazuhAddress?`<a class="k-button k-primary" href="${esc(wazuhAddress)}" target="_blank" rel="noopener noreferrer" data-wazuh-external>Wazuh’u ayrı pencerede aç ↗</a><small>Haricî uygulama · Bağlantı durumu bu arayüzden ölçülmemektedir.</small>`:'<button class="k-button" disabled>Wazuh adresi beklenmektedir</button>');
  }
  function saveWazuhAddress(e){
    e.preventDefault();
    try{wazuhAddress=normalizeWazuhAddress($('k-wazuh-address').value);try{localStorage.setItem(WAZUH_ADDRESS_KEY,wazuhAddress);}catch{}renderWazuhLaunch();toast(wazuhAddress?'Wazuh adresi kaydedilmiştir.':'Wazuh adresi kaldırılmıştır.');}
    catch(error){toast(error.message);}
  }
  function analystNotesMarkup(){
    return `<details class="k-analyst-notes"><summary>Analist çalışma notları · IOC / TTP / Müdahale</summary><div id="k-analyst-notes"></div></details><details class="k-analyst-attribution"><summary>Tehdit aktörü değerlendirmesi</summary><p>APT değerlendirmesi; IOC bağlamı, TTP’ler, araçlar, altyapı ve olay zaman çizelgesiyle birlikte yapılmalıdır. Teknik örtüşme tek başına kesin atıf oluşturmamaktadır. Taklit ve yanıltma ihtimali dikkate alınmalıdır.</p><p><b>Raporlama kalıbı:</b> “[Grup adı] ile [kanıtlanan teknik / prosedür / altyapı] yönünden benzerlik bulunmaktadır. Değerlendirme [düşük / orta / yüksek] güven düzeyindedir. Bu benzerlik, saldırının söz konusu grup tarafından gerçekleştirildiğini kanıtlamamaktadır. Yöntemlerin taklit edilmiş olabileceği değerlendirilmektedir.”</p><p>Yeterli bulgu bulunmadığında grup adı verilmemelidir. Mevcut gösterim tek başına bir APT grubuna atıf sağlamamaktadır.</p><a href="https://attack.mitre.org/groups/" target="_blank" rel="noopener noreferrer">MITRE ATT&CK Groups ↗</a> · <a href="https://unit42.paloaltonetworks.com/unit-42-attribution-framework/" target="_blank" rel="noopener noreferrer">Atıf değerlendirme yaklaşımı ↗</a></details><details class="k-analyst-architecture"><summary>Gösterim ve gerçek sistem ayrımı</summary><p>Bu dosya saha ve tesis etkilerini yerel modelle göstermektedir. Wazuh ayrı uygulama olarak açılacaktır. Log incelemesi, IOC doğrulaması ve TTP analizi mavi takım tarafından yürütülecektir.</p><p>Engellemeler, doğrulanan erişim yöntemine göre kimlik, ağ, uçnokta veya uygulama kontrollerinde uygulanmalıdır. Yapılandırılmış Active Response veya ilgili yönetim araçları kullanılabilir. Rejideki sahne geçişi siber engelleme uygulamamaktadır.</p><p>Backend, Wazuh’a analiz edilebilir uygulama ve erişim logları sağlamalıdır. Bağımsız referans, bildirilen telemetri ve kumanda kanalı ayrı tutulmalıdır.</p></details>`;
  }
  function renderAnalystNotes(snap){
    const item=ANALYST_STEPS[snap.stage.index];
    renderWazuhLaunch();setText('k-analyst-focus',item.focus);setText('k-presenter-proof',item.proof);
    put('k-analyst-cues',`<div><small>MAVİ TAKIM FAALİYETİ</small><p>${esc(item.focus)}</p></div><div><small>REJİ GEÇİŞ KONTROLÜ</small><p>${esc(item.handoff)}</p></div>`);
    put('k-analyst-notes',[["İNCELENECEK LOGLAR",item.logs],["ÇIKARILACAK ARTEFAKTLAR / IOC",item.ioc],["DAVRANIŞ ANALİZİ / TTP",item.ttp],["ERİŞİM YÖNTEMİNE UYGUN MÜDAHALE",item.response],["KANIT SINIRI",item.limit]].map(([title,content])=>`<div><small>${title}</small><p>${esc(content)}</p></div>`).join(''));
  }
