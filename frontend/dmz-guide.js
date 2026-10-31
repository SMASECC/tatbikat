  const DMZ_ACCESS_STEPS=[
    {id:'rce',short:'Servis zafiyeti',title:'DMZ servisinden ilk erişim',technique:'T1190 · Exploit Public-Facing Application',script:'01_dmz_service_rce.py',screen:'Wazuh · DMZ web ve süreç kayıtları',
      narration:'Kırmızı takım dış lab ağında bulunmaktadır. DMZ’de yayınlanan veri kabul servisinin zafiyeti üzerinden shell elde edilmektedir. İlk shell, servisi çalıştıran svc-web hesabının yetkileriyle oluşmaktadır. Mavi takım, web isteğini servis süreci ve shell alt süreciyle ilişkilendirmektedir.',
      evidence:'Web erişim kaydı, kaynak adresi, servis süreci ve shell alt süreci incelenmelidir.'},
    {id:'elevation',short:'Yetki yükseltme',title:'DMZ’de yerel yetki yükseltme',technique:'T1548.003 · Sudo and Sudo Caching',script:'02_dmz_privilege_escalation.py',screen:'Wazuh · sudo ve auditd kayıtları',
      narration:'DMZ sunucusundaki hatalı sudo yetkisi kötüye kullanılmaktadır. Aynı sunucuda servis kullanıcısından yönetici yetkisine geçilmektedir. Bu yetki, korunan servis kimliğine erişmek için kullanılmaktadır. Mavi takım, sudo kaydını, süreç zincirini ve gerçek kullanıcı ile etkin kullanıcı kimliklerini karşılaştırmaktadır.',
      evidence:'sudo kaydı, komut süreci, üst süreç ve gerçek / etkin UID incelenmelidir.'},
    {id:'credential',short:'Servis anahtarı',title:'Eski aktarım işindeki servis anahtarına erişim',technique:'T1552.004 · Private Keys',script:'03_service_key_access.py',screen:'Wazuh · Anahtar dosyasına erişim kayıtları',
      narration:'Eski SFTP aktarım işine ait svc-sync hesabının SSH özel anahtarı elde edilmektedir. Anahtarın kullanılabilir olması ayrı doğrulanmaktadır. Bu kurgu, otomatik olarak bellekten parola elde edildiğini varsaymamaktadır. Mavi takım, anahtar dosyasını okuyan süreci ve kullanıcıyı dosya erişim kayıtlarıyla incelemektedir.',
      evidence:'Anahtar dosyasına okuma erişimi için auditd gerekir. FIM dosya okumasını tek başına göstermemektedir.'},
    {id:'pivot',short:'Pivot kanalı',title:'DMZ üzerinden pivot kanalı',technique:'T1090 · Proxy',script:'04_pivot_channel.py',screen:'Wazuh · Ajan süreci ve dış bağlantı kayıtları',
      narration:'DMZ’deki Ligolo-ng ajanı dış lab ağındaki proxy’ye bağlanmaktadır. Bu kanal, dış ağdaki kırmızı takımın DMZ’den erişilebilen servislere ulaşmasını sağlamaktadır. Ligolo-ng güvenlik duvarı izni oluşturmamaktadır. Ajan tarafında yönetici yetkisi zorunlu değildir. Mavi takım, ajan sürecini ve dış TCP/TLS bağlantısını ilişkilendirmektedir.',
      evidence:'DMZ çıkış izni, ajan süreci ve dış TCP/TLS bağlantısı incelenmelidir. Port 443 izni tünelin kurulacağını tek başına garanti etmemektedir.'},
    {id:'lateral',short:'SSH geçişi',title:'İç entegrasyon sunucusuna yatay hareket',technique:'T1021.004 · SSH',script:'05_lateral_ssh.py',screen:'Wazuh · Güvenlik duvarı ve hedef SSH kayıtları',
      narration:'Eski SFTP işinden kalmış ağ kuralı, DMZ sunucusundan KKBS-INT-01’e SSH erişimine izin vermektedir. Ele geçirilen svc-sync anahtarıyla iç sunucuda oturum açılmaktadır. Etkileşimli SSH izni ayrı bir yanlış yapılandırmadır. Mavi takım, hedef SSH kaydını ağ kaydıyla ilişkilendirmektedir. Kaynak adresi olarak DMZ ajanının görünmesi beklenmektedir.',
      evidence:'DMZ → KKBS-INT TCP/22 izni, kabul edilen anahtar, hesap ve hedef oturumu incelenmelidir. SSH erişimi uygulamaya yazma yetkisini tek başına sağlamamaktadır.'},
    {id:'persistence',short:'Kalıcılık',title:'Kalıcılık ve uygulama yetkisi',technique:'T1098.004 · SSH Authorized Keys',script:'06_persistence.py',screen:'Wazuh · SSH anahtar değişikliği ve uygulama kayıtları',
      narration:'Ele geçirilen lab hesabına SSH anahtarı eklenerek erişimin sürdürülmesi modellenmektedir. Komuta uygulamasındaki yazma yetkisi ayrıca değerlendirilmektedir. Ağ erişimi ile uygulama yetkisi ayrı koşullardır. Mavi takım, anahtar değişikliğini, yeni SSH oturumunu ve servis hesabının uygulama işlemlerini birlikte incelemektedir.',
      evidence:'authorized_keys değişikliği, yeni oturum ve uygulama yetkilendirme kayıtları incelenmelidir. Mevcut backend’in servis hesabı eşlemesi henüz eklenmemiştir.'}
  ];
  let dmzCueIndex=0,dmzReaderActive=false,dmzGuideRunId=null;
  const dmzGuideAllowed=()=>currentView==='director'&&!audience&&!observerView();
  function dmzGuideMarkup(){
    if(!dmzGuideAllowed())return '';
    return `<section class="k-dmz-guide" aria-labelledby="k-dmz-title"><header><div><small>YALNIZ REJİ / ANLATIM REHBERİ</small><h3 id="k-dmz-title">DMZ’den KKBS’ye erişim zinciri</h3></div><span>6 teknik alt adım</span></header><ol class="k-dmz-zones"><li><b>Dış lab ağı</b><span>Kırmızı takımın başlangıç konumudur.</span></li><li><b>DMZ veri kabul servisi</b><span>İlk erişim bu sunucuda sağlanmaktadır.</span></li><li><b>KKBS entegrasyonu</b><span>Eski SSH izni ve servis anahtarı kullanılmaktadır.</span></li><li><b>Saha / PLC modeli</b><span>Yetkili uygulama kanalı üzerinden etkilenmektedir.</span></li></ol><div class="k-dmz-conditions"><p><b>Ağ koşulu:</b> DMZ’den KKBS-INT-01’e eski SFTP işinden kalmış TCP/22 izni bulunmaktadır. Normal veri akışında KKBS, DMZ’den HTTPS ile veri çekmektedir.</p><p><b>Yetki koşulu:</b> Kullanılabilir servis anahtarı, etkileşimli SSH izni ve gereğinden geniş uygulama yazma yetkisi ayrı doğrulanmaktadır. DMZ’den saha ağına doğrudan erişim bulunmamaktadır.</p></div><div class="k-dmz-buttons" role="group" aria-label="Teknik anlatım alt adımını seç">${DMZ_ACCESS_STEPS.map((c,i)=>`<button class="k-button" data-dmz-cue="${i}" aria-controls="k-dmz-cue-body" aria-pressed="${i===dmzCueIndex}"><span>${String(i+1).padStart(2,'0')}</span>${esc(c.short)}</button>`).join('')}</div><article id="k-dmz-cue-body" class="k-dmz-cue" aria-live="polite"></article><p class="k-dmz-caption">Bu kartlar anlatım planıdır. VM, shell, tünel veya Wazuh bağlantısı bu dosyadan doğrulanmamaktadır. Önerilen scriptler henüz uygulanmamıştır. Teknik inceleme için sunum adımı bekletilebilir.</p></section>`;
  }
  function renderDmzGuide(stage){
    if(dmzGuideRunId!==state.runId){dmzGuideRunId=state.runId;dmzCueIndex=0;dmzReaderActive=false;}
    if(!dmzGuideAllowed()||stage.index!==1){dmzReaderActive=false;return;}
    const root=$('k-dmz-cue-body');if(!root)return;
    document.querySelectorAll('[data-dmz-cue]').forEach(el=>el.setAttribute('aria-pressed',String(Number(el.dataset.dmzCue)===dmzCueIndex)));
    if(root.dataset.cue===String(dmzCueIndex))return;root.dataset.cue=String(dmzCueIndex);
    const c=DMZ_ACCESS_STEPS[dmzCueIndex];
    put('k-dmz-cue-body',`<div class="k-dmz-cue-top"><small>TEKNİK ${String(dmzCueIndex+1).padStart(2,'0')} / 06</small><button class="k-button" data-dmz-reader>Alt adımı büyük yazıyla oku ↗</button></div><h4>${esc(c.title)}</h4><p class="k-dmz-spoken">${esc(c.narration)}</p><p class="k-dmz-proof"><b>Wazuh’ta incelenecek kanıt:</b> ${esc(c.evidence)}</p><footer><span>${esc(c.technique)}</span><code>${esc(c.script)}</code></footer>`);
  }
  function selectDmzCue(index){
    if(!dmzGuideAllowed()||stageAt(cursorAt()).index!==1||!Number.isInteger(index)||index<0||index>=DMZ_ACCESS_STEPS.length)return;
    dmzCueIndex=index;renderDmzGuide(stageAt(cursorAt()));
    if($('k-script-reader').open)renderScriptReader(stageAt(cursorAt()));
  }
  function navigateDmzReader(direction){
    if(!dmzGuideAllowed()||!dmzReaderActive||!$('k-script-reader').open)return;
    if(direction>0&&dmzCueIndex===DMZ_ACCESS_STEPS.length-1){dmzReaderActive=false;renderScriptReader(stageAt(cursorAt()));return;}
    selectDmzCue(Math.max(0,Math.min(DMZ_ACCESS_STEPS.length-1,dmzCueIndex+direction)));
  }
