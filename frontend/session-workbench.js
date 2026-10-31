  let sessionDBPromise=null,sessionQueue=Promise.resolve(),sessionError='',recordBusy=false,lastRecordedAt=0;
  let preparedDownloadURL=null;
  let workbenchTab='evidence',replayBundle=null,replayIndex=0,replayPlaying=false,replayWall=0,replayOrigin=0,archiveSelection='';
  const liveCase=()=>state.caseData||emptyCase(state.runId,state.caseOpenedAt||state.anchor);
  function sessionDB(){
    if(sessionDBPromise)return sessionDBPromise;
    sessionDBPromise=new Promise((resolve,reject)=>{
      if(!window.indexedDB){reject(new Error('Tarayıcı oturum kaydını desteklememektedir.'));return;}
      const request=indexedDB.open('kalkan-evidence-sessions-v1',1);
      request.onupgradeneeded=()=>{const db=request.result;db.createObjectStore('sessions',{keyPath:'id'});for(const name of ['frames','events'])db.createObjectStore(name,{keyPath:['sessionId','sequence']}).createIndex('sessionId','sessionId');};
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db);};
      request.onerror=()=>reject(request.error||new Error('Oturum arşivi açılamamıştır.'));
      request.onblocked=()=>reject(new Error('Arşiv güncellemesi başka bir pencere tarafından bekletilmektedir.'));
    });return sessionDBPromise;
  }
  async function dbRead(store,key,index){
    const db=await sessionDB();return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly'),source=index?tx.objectStore(store).index(index):tx.objectStore(store),req=key===undefined?source.getAll():index?source.getAll(key):source.get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  }
  async function dbWrite(stores,write){
    const db=await sessionDB();return new Promise((resolve,reject)=>{const tx=db.transaction(stores,'readwrite');try{write(tx);}catch(error){tx.abort();reject(error);return;}tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('Kayıt yazılamamıştır.'));tx.onabort=()=>reject(tx.error||new Error('Kayıt işlemi tamamlanmamıştır.'));});
  }
  function enqueueSession(task){
    const result=sessionQueue.then(task);sessionQueue=result.catch(error=>{sessionError=error?.message||'Tarayıcı kayıt alanına yazılamamıştır.';if(state.recording?.owner===windowId)commit({recording:null},'record-error');renderSessionStatus();});return result;
  }
  function sessionMeta(s){const data=s.caseData||emptyCase(s.runId,s.caseOpenedAt||s.anchor);return {id:data.id,runId:s.runId,openedAt:data.openedAt,data,caseRev:s.rev,recording:!!s.recording,endedAt:s.recording?null:Date.now()};}
  async function mutateSession(s,extraStore,mutate=()=>{}){
    const db=await sessionDB(),incoming=sessionMeta(s);
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(extraStore?['sessions',extraStore]:['sessions'],'readwrite'),store=tx.objectStore('sessions'),get=store.get(incoming.id);let result,failure;
      get.onsuccess=()=>{try{const old=get.result||{},fresh=!old.caseRev||incoming.caseRev>=old.caseRev;result={frameCount:0,eventCount:0,...old,...(fresh?incoming:{})};mutate(tx,result);store.put(result);}catch(error){failure=error;tx.abort();}};
      tx.oncomplete=()=>resolve(result);tx.onerror=tx.onabort=()=>reject(failure||tx.error||new Error('Oturum kaydı tamamlanmamıştır.'));
    });
  }
  const saveMeta=s=>mutateSession(s);
  async function appendJournal(s,kind,text,source='director',relatedStage=null){
    const at=Date.now(),stage=Number.isInteger(relatedStage)?relatedStage:stageAt(s.cursor).index;
    await mutateSession(s,'events',(tx,meta)=>{meta.eventCount++;tx.objectStore('events').put({sessionId:meta.id,sequence:meta.eventCount,at,stage,eventId:incidentId(meta.id,stage),source,kind,text});});
  }
  function onSessionTransition(previous,next,kind='presentation',detail='',relatedStage=null){
    const was=!!previous.recording,now=!!next.recording,changedCase=previous.runId!==next.runId;
    if(changedCase){if(was||previous.caseData)void enqueueSession(()=>appendJournal({...previous,recording:null},'session-end','Yeni tura geçilmiştir. Önceki dosya korunmaktadır.')).catch(()=>{});return;}
    if(!was&&!now&&!next.caseData)return;
    let source='director',text=detail;
    if(!text){if(kind==='evidence'||kind==='times'||kind==='assessment'){source='analyst';text={evidence:'Analist bulgu dosyası güncellenmiştir.',times:'Analist UTC olay zamanlarını güncellemiştir.',assessment:'Tehdit aktörü değerlendirmesi güncellenmiştir.'}[kind];}
      else if(previous.curtain!==next.curtain){kind='curtain';text=next.curtain?'İzleyici bekleme ekranı açılmıştır.':'İzleyici yayınına dönülmüştür.';}
      else if(was!==now){kind=now?'record-start':'record-stop';text=now?'Gösterim ve telemetri kaydı başlatılmıştır.':'Kayıt durdurulmuştur.';}
      else if(stageAt(previous.cursor).index!==stageAt(next.cursor).index){kind='stage';source='model';text='Gösterim: '+STAGES[stageAt(next.cursor).index].name;}
      else if(kind==='plc'){source='model';text='Sanal PLC yerel kumandası değiştirilmiştir.';}
      else text=next.playing?'Sunum akışı başlatılmıştır.':'Sunum akışı duraklatılmış veya konumlandırılmıştır.';}
    if(['evidence','times','assessment'].includes(kind))source='analyst';if(kind==='plc')source='model';
    void enqueueSession(()=>appendJournal(next,kind,text,source,relatedStage)).catch(()=>{});
  }
  function packSessionFrame(snap,at,sequence){
    return {sessionId:liveCase().id,sequence,at,cursor:snap.cursor,stage:snap.stage.index,curtain:!!state.curtain,
      regions:snap.regions.map(rs=>({id:rs.r.id,assets:rs.assets.map(a=>({id:a.id,x:a.reported.x,y:a.reported.y,refX:a.truth.x,refY:a.truth.y,drift:a.drift,destroyed:a.destroyed,offline:a.offline,changed:a.orderChanged,tone:a.tone}))})),
      plants:REGION_DATA.map(r=>{const p=currentPlant(r,snap.cursor,at);return {id:r.id,actual:p.actual,shown:p.shown,temp:p.localTemp??p.temp,valve:p.valve,service:p.service,offline:p.offline};}),
      rows:telemetryFeedRows(telemetryFeed,at).map(r=>({id:r.id,region:r.region.id,metricLabel:r.metricLabel,metricValue:r.metricValue,tone:({good:'cyan',bad:'red',warn:'amber',unknown:'muted'})[r.tone]||'muted',offline:r.offline,age:r.age,link:r.link?.quality??0,lastReceivedAt:r.lastReceivedAt,packetSequence:r.packetSequence||0}))};
  }
  function recordSessionFrame(snap,force=false){
    const at=Date.now(),record=state.recording;
    if(!record||record.owner!==windowId||record.caseId!==liveCase().id||recordBusy||!force&&at-lastRecordedAt<1000)return;
    recordBusy=true;lastRecordedAt=at;const savedState=structuredClone(state),frame=packSessionFrame(snap,at,1);
    void enqueueSession(async()=>{
      await mutateSession(savedState,'frames',(tx,meta)=>{if(meta.frameCount>=10800)throw new Error('Üç saatlik kayıt sınırına ulaşılmıştır. Kaydı dışa aktarınız.');frame.sequence=++meta.frameCount;meta.lastFrameAt=at;tx.objectStore('frames').put(frame);});
    }).catch(()=>{}).finally(()=>{recordBusy=false;renderSessionStatus();});
  }
  function freshSessionSnapshot(){const cursor=cursorAt(),stage=stageAt(cursor),at=Date.now();collectTelemetry(at,cursor);return {cursor,stage,regions:REGION_DATA.map(r=>regionSnapshot(r,cursor))};}
  async function toggleSessionRecording(){
    if(currentView!=='director'||audience)return;
    try{await sessionQueue;await sessionDB();sessionError='';
      if(state.recording?.owner===windowId){recordSessionFrame(freshSessionSnapshot(),true);await sessionQueue;commit({recording:null},'record-stop');}
      else{if(state.recording?.owner&&peers.has(state.recording.owner))throw new Error('Kayıt başka bir açık reji penceresinde sürmektedir. Önce o pencerede durdurunuz.');
        const data=liveCase();commit({caseData:data,caseOpenedAt:data.openedAt,recording:{caseId:data.id,owner:windowId,since:Date.now()}},'record-start');lastRecordedAt=0;recordSessionFrame(freshSessionSnapshot(),true);}
      await sessionQueue;await refreshArchives();renderSessionStatus();
    }catch(error){sessionError=error.message;toast(sessionError);renderSessionStatus();}
  }
  async function bundleFor(id=liveCase().id){
    await sessionQueue;if(id===liveCase().id)await enqueueSession(()=>saveMeta(state));
    const [session,frames,events]=await Promise.all([dbRead('sessions',id),dbRead('frames',id,'sessionId'),dbRead('events',id,'sessionId')]);
    if(!session)throw new Error('Oturum kaydı bulunamamıştır.');
    frames.sort((a,b)=>a.sequence-b.sequence);events.sort((a,b)=>a.sequence-b.sequence);return {schema:CASE_SCHEMA,session,frames,events};
  }
  function downloadSessionFile(name,content,type){
    if(preparedDownloadURL)URL.revokeObjectURL(preparedDownloadURL);preparedDownloadURL=URL.createObjectURL(new Blob([content],{type}));const link=$('k-case-download-link');link.href=preparedDownloadURL;link.download=name;link.textContent=name+' ↓';const view=$('k-case-report-view');view.hidden=!type.startsWith('text/html');view.href=preparedDownloadURL;$('k-case-download-ready').hidden=false;link.click();
  }
  async function exportSession(kind){
    try{const bundle=await bundleFor(archiveSelection||liveCase().id),id=bundle.session.id;
      if(kind==='report')downloadSessionFile(id+'_Sonuc_Raporu.html',caseReport(bundle),'text/html;charset=utf-8');
      else if(kind==='journal')downloadSessionFile(id+'_Olay_Kayitlari.jsonl',bundle.events.map(e=>JSON.stringify({...e,case_id:id,event_id:e.eventId})).join('\n')+'\n','application/x-ndjson');
      else downloadSessionFile(id+'_Oturum.json',JSON.stringify(bundle),'application/json');
      toast(kind==='report'?'Sonuç raporu hazırlanmıştır.':'Oturum kaydı dışa aktarılmıştır.');
    }catch(error){toast('Dosya hazırlanamamıştır: '+error.message);}
  }
  function caseToolbarMarkup(){return `<div class="k-case-toolbar" aria-label="Oturum ve yayın araçları"><span id="k-case-toolbar-status"></span><div><button class="k-button" data-case-open="evidence">Bulgu dosyası</button><button class="k-button" data-case-open="recording">Kayıt / Tekrar</button><button class="k-button" data-case-report>Sonuç raporu ↓</button><button class="k-button k-curtain-toggle" data-case-curtain aria-pressed="false">Bekleme ekranı</button></div></div>`;}
  function caseWorkbenchMarkup(){
    const options=Object.entries(CASE_ROLES).map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
    return `<dialog id="k-case-dialog" class="k-case-dialog" aria-labelledby="k-case-title"><header><div><small>REJİ · ÖZEL ÇALIŞMA ALANI</small><h2 id="k-case-title">Olay dosyası</h2><p id="k-case-dialog-id"></p></div><button class="k-button" data-case-close aria-label="Olay dosyasını kapat">Kapat ×</button></header><nav class="k-case-tabs" aria-label="Olay dosyası bölümleri"><button data-case-tab="evidence" aria-pressed="true">Bulgular / Saldırı yolu</button><button data-case-tab="times" aria-pressed="false">Olay süreleri</button><button data-case-tab="assessment" aria-pressed="false">APT değerlendirmesi</button><button data-case-tab="recording" aria-pressed="false">Kayıt / Tekrar oynatma</button></nav><p class="k-case-feedback" id="k-case-feedback" role="status"></p><div class="k-case-dialog-body"><div id="k-case-download-ready" class="k-case-download-ready" hidden><span>Dosya hazırdır. İndirme başlamadıysa bağlantıyı kullanınız.</span><div><a id="k-case-report-view" class="k-button" target="_blank" rel="noopener noreferrer" hidden>Raporu aç / Yazdır ↗</a><a id="k-case-download-link" class="k-button k-primary" download>Dosyayı indir</a></div></div><section data-case-page="evidence"><div class="k-case-two"><form id="k-case-evidence-form" class="k-case-form"><h3>Kanıt ekle</h3><p>Wazuh alarmı veya ham log referansını giriniz. Müdahale sonucunu ilgili yönetim aracı kaydıyla ilişkilendiriniz.</p><div class="k-case-fields"><label>İlişkili olay<select name="stage">${STAGES.map(s=>`<option value="${s.index}">${String(s.index+1).padStart(2,'0')} · ${esc(s.name)}</option>`).join('')}</select></label><label>Kayıt türü<select name="kind">${Object.entries(CASE_KINDS).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>Olay zamanı (UTC)<input type="datetime-local" step="1" name="at" required></label><label>Güven düzeyi<select name="confidence"><option>düşük</option><option>orta</option><option>yüksek</option></select></label></div><label>Kanıt referansı<input name="ref" maxlength="240" required placeholder="Wazuh alert ID / rule ID / ham log referansı"></label><label>Bulgu ve bağlam<textarea name="summary" maxlength="700" rows="3" required placeholder="Gözlenen davranış, etkilenen kaynak ve doğrulama sonucu"></textarea></label><div class="k-case-fields"><label>IOC türü<select name="iocType"><option>IPv4 / IPv6</option><option>Alan adı</option><option>URL</option><option>SHA-256</option><option>Hesap</option><option>Diğer</option></select></label><label>IOC değeri / ATT&CK tekniği<input name="value" maxlength="300" placeholder="IOC veya T1078"></label></div><details class="k-case-edge-form"><summary>Doğrulanan erişim bağlantısı ekle</summary><div class="k-case-fields"><label>Kaynak sistem<select name="from"><option value="">Seçilmemiştir</option>${options}</select></label><label>Hedef sistem<select name="to"><option value="">Seçilmemiştir</option>${options}</select></label></div><label class="k-case-check"><input name="confirmed" type="checkbox"> Bu bağlantı, yazdığım kanıt referansıyla doğrulanmıştır.</label><p>İşaretlenen bağlantılar olay akışı monitöründe yayınlanacaktır. Ham IOC ve log metni rejide kalacaktır.</p></details><button class="k-button k-primary" type="submit">Bulguyu kaydet</button></form><div><h3>Doğrulanan saldırı yolu</h3><div id="k-case-topology" class="k-case-topology"></div><h3>Bulgu kayıtları</h3><div id="k-case-evidence-list"></div></div></div></section><section data-case-page="times" hidden><h3>Gerçek olay zamanları</h3><p class="k-case-intro">Loglardaki UTC zamanlarını ve kanıt referanslarını giriniz. Tespit, kontrol altına alma ve hizmeti geri kazanma süreleri bu kayıtlardan hesaplanacaktır. Sunum saati bu ölçümü etkilememektedir.</p><div id="k-case-metrics" class="k-case-metrics"></div><form id="k-case-times-form" class="k-case-form">${Object.entries(CASE_TIME_LABELS).map(([key,label])=>`<div class="k-case-time-row"><label>${label}<input type="datetime-local" step="1" name="${key}" aria-label="${label} (UTC)"></label><button type="button" class="k-button" data-case-now="${key}">Şimdi (UTC)</button><label>Kanıt referansı<input name="${key}Ref" maxlength="240" aria-label="${label} kanıt referansı"></label></div>`).join('')}<button class="k-button k-primary" type="submit">Olay zamanlarını kaydet</button><p>İlk faaliyet zamanı bilinmiyorsa boş bırakınız. Eksik zamanlar için süre üretilmemektedir. Bunlar tek olaya ait sürelerdir; ortalama MTTD / MTTR olarak adlandırılmamaktadır.</p></form></section><section data-case-page="assessment" hidden><h3>Kanıta dayalı tehdit aktörü değerlendirmesi</h3><p class="k-case-intro">Bir grubun adını yalnız teknik benzerliği destekleyen kanıt varsa giriniz. ATT&CK tekniğinin tek başına örtüşmesi kesin atıf sağlamamaktadır.</p><form id="k-case-actor-form" class="k-case-form"><div class="k-case-fields"><label>Benzerlik değerlendirilen grup<input name="name" maxlength="100" placeholder="Kanıt yoksa boş bırakınız"></label><label>Değerlendirme güveni<select name="confidence"><option>belirsiz</option><option>düşük</option><option>orta</option><option>yüksek</option></select></label></div><label>Kanıt ve benzerlik gerekçesi<textarea name="basis" maxlength="1000" rows="4" placeholder="Prosedür, araç, altyapı ve zaman çizelgesi referansları"></textarea></label><label>Alternatif açıklamalar<textarea name="alternatives" maxlength="700" rows="3" placeholder="Taklit, ortak araç kullanımı, yanıltıcı izler"></textarea></label><button class="k-button k-primary" type="submit">Değerlendirmeyi kaydet</button></form><p id="k-case-actor-statement" class="k-case-note"></p></section><section data-case-page="recording" hidden><div class="k-case-record-head"><div><h3>Oturum kaydı</h3><p id="k-case-record-status"></p></div><button class="k-button k-primary" data-case-record>Kaydı başlat</button></div><p class="k-case-intro">Saha konumları, PLC ölçümleri ve 31 telemetri kaynağı saniyede bir kaydedilmektedir. Sahne geçişleri, yerel kumanda ve analist kayıtları zaman çizelgesine eklenmektedir. Wazuh ekran videosu kaydedilmemektedir. Tarayıcı kapanmadan önce kaydı JSON olarak dışa aktarınız.</p><div class="k-case-archive-row"><label>Oturum arşivi<select id="k-case-archives" aria-label="Oturum arşivi"></select></label><button class="k-button" data-case-archive-refresh>Yenile</button><button class="k-button" data-case-replay-load>Kaydı aç</button></div><div class="k-case-export-row"><button class="k-button" data-case-export="json">Oturumu indir · JSON</button><button class="k-button" data-case-export="journal">Olay kayıtları · JSONL</button><button class="k-button" data-case-export="report">Sonuç raporu · HTML / PDF</button><label class="k-button k-case-import">Kayıt içe aktar<input type="file" id="k-case-import" accept="application/json,.json"></label></div><p class="k-case-note">Tekrar oynatma yalnız bu özel pencerede gerçekleşmektedir. Canlı yayın, PLC kumandaları ve güncel olay dosyası değişmemektedir. Bekleme ekranı KALKAN pencerelerini kapsamaktadır; haricî Wazuh penceresini kapatmamaktadır.</p><div id="k-case-replay" hidden><div class="k-case-replay-controls"><button class="k-button" data-case-replay="previous">← Örnek</button><button class="k-button k-primary" data-case-replay="play">Oynat</button><button class="k-button" data-case-replay="next">Örnek →</button><strong id="k-case-replay-time"></strong><span id="k-case-replay-position"></span></div><input id="k-case-replay-range" aria-label="Kayıt zaman çizelgesi" type="range" min="0" max="0" value="0"><p id="k-case-replay-gap" class="k-case-note" hidden></p><div id="k-case-replay-maps" class="k-case-replay-maps"></div><div class="k-case-two"><div><h3>Kaydedilen telemetri</h3><div class="k-case-table-wrap" id="k-case-replay-telemetry"></div></div><div><h3>Olay ve müdahale zaman çizelgesi</h3><div id="k-case-replay-journal"></div></div></div></div><p id="k-case-replay-empty" class="k-case-empty">İncelemek için bir kayıt açınız.</p></section></div></dialog><div id="k-case-curtain" hidden><div><span>K1</span><small>KOMUTA KONTROL MERKEZİ</small><h1>Yayın bekletilmektedir.</h1><p>Gösterim kısa süre içinde devam edecektir.</p></div></div>`;
  }
  function caseFeedback(message,error=false){setText('k-case-feedback',message);$('k-case-feedback')?.classList.toggle('error',error);}
  function switchCaseTab(tab){
    if(!['evidence','times','assessment','recording'].includes(tab))return;
    workbenchTab=tab;document.querySelectorAll('[data-case-page]').forEach(el=>el.hidden=el.dataset.casePage!==tab);document.querySelectorAll('[data-case-tab]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.caseTab===tab)));
    if(tab==='recording')void refreshArchives();
  }
  function fillCaseForms(){
    const data=liveCase(),ef=$('k-case-evidence-form');ef.elements.namedItem('stage').value=String(stageAt(cursorAt()).index);ef.elements.namedItem('at').value=utcInput(Date.now());
    const tf=$('k-case-times-form');for(const key of Object.keys(CASE_TIME_LABELS)){tf.elements.namedItem(key).value=utcInput(data.times[key]?.at);tf.elements.namedItem(key+'Ref').value=data.times[key]?.ref||'';}
    const af=$('k-case-actor-form');for(const key of ['name','confidence','basis','alternatives'])af.elements.namedItem(key).value=data.actor[key];
  }
  function openCaseWorkbench(tab){
    if(currentView!=='director'||audience)return;
    caseFeedback('');fillCaseForms();refreshCasePanels();switchCaseTab(tab);const dialog=$('k-case-dialog');if(!dialog.open)dialog.showModal();
  }
  function refreshCasePanels(){
    const data=liveCase();setText('k-case-dialog-id',data.id+' · '+data.evidence.length+' bulgu');
    put('k-case-metrics',caseMetrics(data).map(m=>`<div><small>${esc(m.label)}</small><b>${durationLabel(m.ms)}</b><span>${esc(m.from)}</span></div>`).join(''));
    put('k-case-topology',topologyMarkup(data,9,true));setText('k-case-actor-statement',actorStatement(data.actor));
    put('k-case-evidence-list',data.evidence.length?data.evidence.slice().reverse().map(e=>`<article class="k-case-evidence"><header><strong>${CASE_KINDS[e.kind]}</strong><span>${esc(e.eventId)}</span></header><p>${esc(e.summary)}</p>${e.value?`<code>${esc((e.iocType?e.iocType+' · ':'')+e.value)}</code>`:''}<small>${utcLabel(e.at)} · ${esc(e.confidence)} güven<br>${esc(e.ref)}</small><button class="k-button" data-case-evidence-delete="${esc(e.id)}">Kaydı kaldır</button></article>`).join(''):'<p class="k-case-empty">Henüz analist bulgusu eklenmemiştir.</p>');
    renderSessionStatus();
  }
  function saveCaseData(data,kind,detail='',relatedStage=null){
    const clean=validateCase(data,caseIdFor(state.runId));commit({caseData:clean,caseOpenedAt:clean.openedAt},kind,detail,relatedStage);refreshCasePanels();caseFeedback('Olay dosyası kaydedilmiştir.');
  }
  function submitCaseEvidence(e){
    e.preventDefault();if(currentView!=='director'||audience)return;
    try{const form=e.target,fd=new FormData(form),data=structuredClone(liveCase());
      if(data.evidence.length>=100)throw new Error('Bir olay dosyasında en fazla 100 bulgu saklanmaktadır.');
      const kind=fd.get('kind'),entry={id:'B-'+(typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now()+'-'+Math.random().toString(16).slice(2)),stage:Number(fd.get('stage')),kind,at:parseUTC(fd.get('at')),addedAt:Date.now(),ref:fd.get('ref'),summary:fd.get('summary'),value:['ioc','ttp'].includes(kind)?fd.get('value'):'',iocType:kind==='ioc'?fd.get('iocType'):'',confidence:fd.get('confidence'),from:fd.get('from'),to:fd.get('to'),confirmed:fd.get('confirmed')==='on'};
      data.evidence.push(entry);saveCaseData(data,'evidence',CASE_KINDS[kind]+': '+entry.summary+' · Kanıt: '+entry.ref,entry.stage);form.reset();form.elements.namedItem('stage').value=String(stageAt(cursorAt()).index);form.elements.namedItem('at').value=utcInput(Date.now());
    }catch(error){caseFeedback(error.message,true);}
  }
  function submitCaseTimes(e){
    e.preventDefault();if(currentView!=='director'||audience)return;
    try{const fd=new FormData(e.target),data=structuredClone(liveCase());data.times={};
      for(const key of Object.keys(CASE_TIME_LABELS)){const value=fd.get(key),ref=fd.get(key+'Ref');if(value)data.times[key]={at:parseUTC(value),ref};else if(String(ref).trim())throw new Error(CASE_TIME_LABELS[key]+' için zamanı da giriniz.');}
      saveCaseData(data,'times');
    }catch(error){caseFeedback(error.message,true);}
  }
  function submitCaseActor(e){
    e.preventDefault();if(currentView!=='director'||audience)return;
    try{const fd=new FormData(e.target),data=structuredClone(liveCase());data.actor=Object.fromEntries(['name','confidence','basis','alternatives'].map(k=>[k,fd.get(k)]));saveCaseData(data,'assessment');}
    catch(error){caseFeedback(error.message,true);}
  }
  async function refreshArchives(){
    if(!$('k-case-dialog')?.open&&workbenchTab!=='recording')return;
    try{await sessionQueue;const sessions=await dbRead('sessions');sessions.sort((a,b)=>b.openedAt-a.openedAt);const select=$('k-case-archives'),current=archiveSelection||liveCase().id;
      put('k-case-archives',sessions.map(s=>`<option value="${esc(s.id)}">${esc(s.id)} · ${utcLabel(s.openedAt)} · ${s.frameCount||0} örnek</option>`).join('')||'<option value="">Arşivde oturum bulunmamaktadır</option>');
      if(sessions.some(s=>s.id===current))select.value=current;archiveSelection=select.value;
    }catch(error){caseFeedback('Arşiv açılamamıştır: '+error.message,true);}
  }
  async function loadCaseReplay(){
    try{if(!archiveSelection)throw new Error('Bir kayıt seçiniz.');replayPlaying=false;replayBundle=await bundleFor(archiveSelection);replayIndex=0;renderCaseReplay();caseFeedback('Kayıt inceleme için açılmıştır. Canlı yayın sürmektedir.');}
    catch(error){caseFeedback(error.message,true);}
  }
  function replayMapMarkup(region){
    const base=regionMap.get(region.id),roads=base.units.slice(0,4).map(u=>u.route?`<path d="M${u.route.map(p=>p.join(' ')).join('L')}" fill="none" stroke="#294656" stroke-width="8"/>`:'').join('');
    return `<article><header><b>${esc(base.name||base.short)}</b><small>KAYITLI KONUM</small></header><svg viewBox="0 0 1200 720" role="img" aria-label="${esc(base.short)} kayıtlı konumları"><rect width="1200" height="720" fill="#0a1d29"/>${roads}${region.assets.map(a=>`<path d="M${a.refX} ${a.refY}L${a.x} ${a.y}" stroke="#e8978d" stroke-width="4" stroke-dasharray="10 8"/><circle cx="${a.refX}" cy="${a.refY}" r="12" fill="none" stroke="#80c8a8" stroke-width="3"/>${a.destroyed?`<path d="M${a.x-17} ${a.y-17}L${a.x+17} ${a.y+17}M${a.x+17} ${a.y-17}L${a.x-17} ${a.y+17}" stroke="#f38d8c" stroke-width="10"/>`:`<circle cx="${a.x}" cy="${a.y}" r="13" fill="${COLORS[a.tone]||COLORS.muted}"/>`}<text x="${Math.min(1000,a.x+24)}" y="${a.y-24}" fill="#c7dde5" font-size="27">${esc(a.id)}${a.destroyed?' · İMHA':a.offline?' · KESİNTİ':a.changed?' · GÖREV Δ':''}</text>`).join('')}</svg></article>`;
  }
  function renderCaseReplay(){
    const bundle=replayBundle,frames=bundle?.frames||[],frame=frames[replayIndex];$('k-case-replay').hidden=!frame;$('k-case-replay-empty').hidden=!!frame;
    if(!frame){setText('k-case-replay-empty',bundle?'Bu oturumda telemetri örneği bulunmamaktadır. Bulgu ve müdahale kayıtları rapordan incelenebilir.':'İncelemek için bir kayıt açınız.');return;}
    setText('k-case-replay-time',utcLabel(frame.at));setText('k-case-replay-position',`${bundle.session.id} · ${replayIndex+1} / ${frames.length} · Sunum T+${mmss(frame.cursor)}${frame.curtain?' · Yayın bekletilmiştir.':''}`);
    const range=$('k-case-replay-range');range.max=String(frames.length-1);range.value=String(replayIndex);
    document.querySelector('[data-case-replay="play"]').textContent=replayPlaying?'Duraklat':'Oynat';document.querySelector('[data-case-replay="previous"]').disabled=replayIndex===0;document.querySelector('[data-case-replay="next"]').disabled=replayIndex===frames.length-1;
    const gap=replayIndex>0?frame.at-frames[replayIndex-1].at:0;$('k-case-replay-gap').hidden=gap<2500;setText('k-case-replay-gap',`Önceki örnekten bu yana ${(gap/1000).toFixed(1)} saniye geçmiştir. Aradaki veriler kaydedilmemiştir.`);
    put('k-case-replay-maps',frame.regions.map(replayMapMarkup).join(''));
    put('k-case-replay-telemetry',`<table><thead><tr><th>Kaynak</th><th>Ölçüm</th><th>Değer</th><th>Bağlantı</th><th>Veri yaşı</th></tr></thead><tbody>${frame.rows.map(r=>`<tr><td><i class="k-case-dot ${r.tone}"></i>${esc(r.id)}</td><td>${esc(r.metricLabel)}</td><td>${esc(r.metricValue)}</td><td>${r.offline?'Kesildi':'%'+fmt(r.link)}</td><td>${fmt(r.age,1)} sn</td></tr>`).join('')}</tbody></table><div class="k-case-record-plants">${frame.plants.map(p=>`<p><b>${esc(regionMap.get(p.id).short)}</b> · Seviye LT-02 %${fmt(p.actual,1)} / HMI %${fmt(p.shown,1)} · ${fmt(p.temp,1)} °C · Vana %${fmt(p.valve)} · Hizmet %${fmt(p.service)}</p>`).join('')}</div>`);
    const journal=bundle.events.filter(e=>e.at<=frame.at).slice(-40).reverse(),evidence=bundle.session.data.evidence.filter(e=>e.addedAt<=frame.at);
    put('k-case-replay-journal',`<p class="k-case-note">Bu ana kadar ${evidence.length} analist bulgusu kaydedilmiştir.</p>`+(journal.map(e=>`<article class="k-case-replay-event"><small>${utcLabel(e.at)} · ${esc(e.eventId)}</small><b>${esc(({analyst:'Analist kaydı',model:'Gösterim modeli',director:'Reji kaydı'})[e.source])}</b><p>${esc(e.text)}</p></article>`).join('')||'<p class="k-case-empty">Bu ana kadar olay kaydı bulunmamaktadır.</p>'));
  }
  function replayTick(){
    if(!replayPlaying||!replayBundle?.frames.length||!$('k-case-dialog').open||workbenchTab!=='recording')return;
    const frames=replayBundle.frames,target=replayOrigin+Date.now()-replayWall;let next=replayIndex;
    while(next<frames.length-1&&frames[next+1].at<=target)next++;
    if(next!==replayIndex){replayIndex=next;renderCaseReplay();}
    if(replayIndex===frames.length-1){replayPlaying=false;renderCaseReplay();}
  }
  async function importCaseRecording(file){
    try{if(!file)return;if(file.size>48*1024*1024)throw new Error('Kayıt dosyası 48 MB sınırını aşmaktadır.');
      const bundle=validateRecording(JSON.parse(await file.text()));await sessionQueue;
      if(await dbRead('sessions',bundle.session.id))throw new Error('Bu olay kimliği arşivde bulunmaktadır. Mevcut kayıt korunmuştur.');
      await enqueueSession(()=>dbWrite(['sessions','frames','events'],tx=>{tx.objectStore('sessions').put(bundle.session);bundle.frames.forEach(f=>tx.objectStore('frames').put(f));bundle.events.forEach(e=>tx.objectStore('events').put(e));}));
      archiveSelection=bundle.session.id;await refreshArchives();replayBundle=bundle;replayIndex=0;replayPlaying=false;renderCaseReplay();caseFeedback('Oturum arşive alınmıştır. Güncel olay dosyası değiştirilmemiştir.');
    }catch(error){caseFeedback('İçe aktarma tamamlanmamıştır: '+error.message,true);}finally{$('k-case-import').value='';}
  }
  function renderSessionStatus(){
    const data=liveCase(),record=state.recording,ours=record?.owner===windowId,ownerAlive=record&&peers.has(record.owner);
    setText('k-case-toolbar-status',data.id+' · '+(record?'● Kayıt etkin':'Kayıt kapalı'));
    setText('k-case-record-status',sessionError?'Kayıt hatası: '+sessionError:record?ours?'Kayıt bu reji penceresinde sürmektedir.':ownerAlive?'Kayıt diğer reji penceresinde sürmektedir.':'Kayıt penceresi yanıt vermemektedir. Kaydı bu pencerede devralabilirsiniz.':'Kayıt kapalıdır.');
    document.querySelectorAll('[data-case-record]').forEach(b=>{b.textContent=ours?'Kaydı durdur':record?'Kaydı devral':'Kaydı başlat';b.disabled=!!record&&!ours&&ownerAlive;});
    document.querySelectorAll('[data-case-curtain]').forEach(b=>{b.setAttribute('aria-pressed',String(!!state.curtain));b.textContent=state.curtain?'Yayına dön':'Bekleme ekranı';});
    const hidden=!!state.curtain&&currentView!=='director';$('k-case-curtain').hidden=!hidden;$('k-app').inert=hidden;document.body.classList.toggle('k-curtain-active',hidden);
    if(currentView!=='director'&&$('k-case-dialog').open)$('k-case-dialog').close();
    const label=data.id+' / E'+String(stageAt(cursorAt()).index+1).padStart(2,'0');
    for(const parent of document.querySelectorAll('.k-head-meta,.k-screen-monitor-heading>div,.k-map-monitor-title>div')){let el=parent.querySelector('.k-common-id');if(!el){el=document.createElement('small');el.className='k-common-id';parent.append(el);}el.textContent=label;}
  }
  function renderCaseTopology(snap){put('k-event-case-id',incidentId(liveCase().id,snap.stage.index));put('k-event-topology',topologyMarkup(liveCase(),audience?snap.stage.index:9,false));}
  document.body.insertAdjacentHTML('beforeend',caseWorkbenchMarkup());
  $('k-case-evidence-form').addEventListener('submit',submitCaseEvidence);$('k-case-times-form').addEventListener('submit',submitCaseTimes);$('k-case-actor-form').addEventListener('submit',submitCaseActor);
  $('k-case-dialog').addEventListener('close',()=>{replayPlaying=false;});
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-case-open]');if(open){openCaseWorkbench(open.dataset.caseOpen);return;}
    if(currentView!=='director'||audience)return;
    if(e.target.closest('[data-case-close]')){$('k-case-dialog').close();return;}
    const tab=e.target.closest('[data-case-tab]');if(tab){replayPlaying=false;switchCaseTab(tab.dataset.caseTab);return;}
    if(e.target.closest('[data-case-curtain]')){commit({curtain:!state.curtain,playing:false},'curtain');return;}
    if(e.target.closest('[data-case-record]')){void toggleSessionRecording();return;}
    if(e.target.closest('[data-case-report]')){openCaseWorkbench('recording');archiveSelection=liveCase().id;void exportSession('report');return;}
    const exp=e.target.closest('[data-case-export]');if(exp){void exportSession(exp.dataset.caseExport);return;}
    if(e.target.closest('[data-case-archive-refresh]')){void refreshArchives();return;}
    if(e.target.closest('[data-case-replay-load]')){void loadCaseReplay();return;}
    const now=e.target.closest('[data-case-now]');if(now){$('k-case-times-form').elements.namedItem(now.dataset.caseNow).value=utcInput(Date.now());return;}
    const del=e.target.closest('[data-case-evidence-delete]');if(del){try{const data=structuredClone(liveCase());data.evidence=data.evidence.filter(x=>x.id!==del.dataset.caseEvidenceDelete);saveCaseData(data,'evidence','Analist bulgu kaydını kaldırmıştır: '+del.dataset.caseEvidenceDelete);}catch(error){caseFeedback(error.message,true);}return;}
    const replay=e.target.closest('[data-case-replay]');if(replay&&replayBundle?.frames.length){if(replay.dataset.caseReplay==='play'){if(replayIndex===replayBundle.frames.length-1)replayIndex=0;replayPlaying=!replayPlaying;replayOrigin=replayBundle.frames[replayIndex].at;replayWall=Date.now();}else{replayPlaying=false;replayIndex=cap(replayIndex+(replay.dataset.caseReplay==='next'?1:-1),0,replayBundle.frames.length-1);}renderCaseReplay();}
  });
  $('k-case-archives').addEventListener('change',e=>{archiveSelection=e.target.value;});
  $('k-case-replay-range').addEventListener('input',e=>{replayPlaying=false;replayIndex=Number(e.target.value);renderCaseReplay();});
  $('k-case-import').addEventListener('change',e=>{void importCaseRecording(e.target.files[0]);});
  setInterval(()=>{if(state.recording?.owner===windowId)recordSessionFrame(freshSessionSnapshot());replayTick();},250);
