  // Shared identifiers and analyst evidence. Presentation time is never an incident clock.
  const CASE_SCHEMA='kalkan-session/1';
  const CASE_ROLES={source:'Erişim kaynağı',command:'KKBS / API',records:'Konum / görev kayıtları',hmi:'HMI',plc:'PLC'};
  const CASE_KINDS={log:'Log bulgusu',ioc:'IOC',ttp:'TTP',response:'Müdahale kaydı'};
  const CASE_TIME_LABELS={started:'İlk kötü amaçlı faaliyet',detected:'Tespit',contained:'Kontrol altına alma',restored:'Hizmetin geri kazanılması'};
  function caseIdFor(runId){
    let a=2166136261,b=3339675911;
    for(const c of String(runId)){a=Math.imul(a^c.charCodeAt(0),16777619);b=Math.imul(b^c.charCodeAt(0),2246822519);}
    return 'K1-'+(a>>>0).toString(16).padStart(8,'0').toUpperCase()+(b>>>0).toString(16).padStart(8,'0').toUpperCase();
  }
  const incidentId=(id,stage)=>id+'-E'+String(stage+1).padStart(2,'0');
  function emptyCase(runId,at){return {id:caseIdFor(runId),openedAt:at,times:{},evidence:[],actor:{name:'',confidence:'belirsiz',basis:'',alternatives:''}};}
  function textLimit(value,max,label,required=false){
    if(typeof value!=='string'||value.length>max||required&&!value.trim())throw new Error(label+' alanını kontrol ediniz.');
    return value.trim();
  }
  function validEpoch(at){return Number.isFinite(at)&&at>=946684800000&&at<=4102444800000;}
  function validateCase(raw,id){
    if(!raw||raw.id!==id||!validEpoch(raw.openedAt)||!Array.isArray(raw.evidence)||raw.evidence.length>100)throw new Error('Olay dosyası geçersizdir.');
    const data={id,openedAt:raw.openedAt,times:{},evidence:[],actor:{}};
    for(const key of Object.keys(CASE_TIME_LABELS)){
      const item=raw.times?.[key];if(item){if(!validEpoch(item.at))throw new Error('UTC zamanını kontrol ediniz.');data.times[key]={at:item.at,ref:textLimit(item.ref,240,'Zaman kanıtı',true)};}
    }
    const ordered=Object.keys(CASE_TIME_LABELS).map(k=>data.times[k]?.at).filter(Number.isFinite);
    if(ordered.some((v,i)=>i>0&&v<ordered[i-1]))throw new Error('Olay zamanları kronolojik sırada olmalıdır.');
    const seen=new Set();
    for(const item of raw.evidence){
      if(!item||!CASE_KINDS[item.kind]||!Number.isInteger(item.stage)||item.stage<0||item.stage>9||!validEpoch(item.at)||!validEpoch(item.addedAt))throw new Error('Bulgu kaydı geçersizdir.');
      const e={id:textLimit(item.id,80,'Bulgu kimliği',true),stage:item.stage,eventId:incidentId(id,item.stage),kind:item.kind,at:item.at,addedAt:item.addedAt,
        ref:textLimit(item.ref,240,'Kanıt referansı',true),summary:textLimit(item.summary,700,'Bulgu açıklaması',true),value:textLimit(item.value||'',300,'IOC / teknik'),
        iocType:textLimit(item.iocType||'',40,'IOC türü'),confidence:item.confidence,from:item.from||'',to:item.to||'',confirmed:item.confirmed===true};
      if(seen.has(e.id))throw new Error('Tekrarlanan bulgu kimliği bulunmaktadır.');seen.add(e.id);
      if(!['düşük','orta','yüksek'].includes(e.confidence))throw new Error('Güven düzeyi seçiniz.');
      if(e.kind==='ioc'&&(!e.value||!['IPv4 / IPv6','Alan adı','URL','SHA-256','Hesap','Diğer'].includes(e.iocType)))throw new Error('IOC türünü ve değerini giriniz.');
      if(e.kind==='ttp'&&!/^T\d{4}(?:\.\d{3})?$/.test(e.value))throw new Error('ATT&CK tekniğini T1078 veya T1078.001 biçiminde giriniz.');
      if(e.from||e.to){if(!CASE_ROLES[e.from]||!CASE_ROLES[e.to]||e.from===e.to)throw new Error('Bağlantı için farklı iki sistem seçiniz.');}
      if(e.confirmed&&(!e.from||!e.to))throw new Error('Doğrulanan bağlantının iki ucunu seçiniz.');
      data.evidence.push(e);
    }
    const actor=raw.actor||{};
    data.actor={name:textLimit(actor.name||'',100,'Grup adı'),confidence:actor.confidence||'belirsiz',basis:textLimit(actor.basis||'',1000,'Atıf kanıtı'),alternatives:textLimit(actor.alternatives||'',700,'Alternatif açıklamalar')};
    if(!['belirsiz','düşük','orta','yüksek'].includes(data.actor.confidence))throw new Error('Atıf güven düzeyi geçersizdir.');
    if(data.actor.name&&(!data.actor.basis||data.actor.confidence==='belirsiz'))throw new Error('Grup benzerliği için kanıt ve güven düzeyi gerekmektedir.');
    return data;
  }
  function caseMetrics(data){
    const t=data.times||{},delta=(a,b)=>t[a]&&t[b]&&t[b].at>=t[a].at?t[b].at-t[a].at:null;
    return [
      {key:'detect',label:'Tespit süresi',from:'İlk faaliyet → Tespit',ms:delta('started','detected')},
      {key:'contain',label:'Kontrol altına alma süresi',from:'Tespit → Kontrol altına alma',ms:delta('detected','contained')},
      {key:'recover',label:'Hizmeti geri kazanma süresi',from:'Kontrol altına alma → Hizmet',ms:delta('contained','restored')},
      {key:'total',label:'Toplam geçen süre',from:'İlk faaliyet → Hizmet',ms:delta('started','restored')}
    ];
  }
  function durationLabel(ms){if(ms===null||!Number.isFinite(ms))return 'Ölçülmedi';const s=Math.floor(ms/1000);return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(v=>String(v).padStart(2,'0')).join(':');}
  function utcLabel(at){return validEpoch(at)?new Date(at).toISOString().replace('T',' ').replace(/\.\d{3}Z$/,' UTC'):'—';}
  function utcInput(at){return validEpoch(at)?new Date(at).toISOString().slice(0,19):'';}
  function parseUTC(value){
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value))throw new Error('UTC zamanını giriniz.');
    const ms=Date.parse(value+'Z');if(!validEpoch(ms)||utcInput(ms).slice(0,value.length)!==value)throw new Error('UTC zamanı geçersizdir.');return ms;
  }
  function confirmedEdges(data,maxStage=9){return data.evidence.filter(e=>e.stage<=maxStage&&e.confirmed&&e.ref&&CASE_ROLES[e.from]&&CASE_ROLES[e.to]);}
  function actorStatement(actor){return actor?.name?`${actor.name} ile teknik benzerlik değerlendirilmektedir. Güven düzeyi ${actor.confidence} olarak kaydedilmiştir. Bu benzerlik kesin atıf oluşturmamaktadır. Yöntemlerin taklit edilmiş olabileceği değerlendirilmektedir.`:'Grup atfı yapılmamıştır. Mevcut kayıtlar tek başına bir APT grubuna işaret etmemektedir.';}
  function topologyMarkup(data,maxStage=9,privateView=false){
    const edges=confirmedEdges(data,maxStage),active=[...new Set(edges.flatMap(e=>[e.from,e.to]))];
    if(!edges.length)return '<p class="k-case-empty">Kanıtla doğrulanmış bağlantı henüz kaydedilmemiştir.</p>';
    const positions={source:[110,55],command:[330,55],records:[550,55],hmi:[330,175],plc:[550,175]};
    const svg=`<svg viewBox="0 0 670 235" role="img" aria-label="Kanıtla doğrulanmış erişim bağlantıları"><defs><marker id="k-evidence-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#86d4c7"/></marker></defs>${edges.map((e,i)=>{const a=positions[e.from],b=positions[e.to],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),ox=dx/length*65,oy=dy/length*22;return `<path d="M${a[0]+ox} ${a[1]+oy}L${b[0]-ox} ${b[1]-oy}" stroke="#86d4c7" stroke-width="2" fill="none" marker-end="url(#k-evidence-arrow)"/><text x="${(a[0]+b[0])/2+5}" y="${(a[1]+b[1])/2-8}" fill="#b6e4db" font-size="12">${i+1}</text>`;}).join('')}${active.map(key=>{const p=positions[key];return `<rect x="${p[0]-83}" y="${p[1]-22}" width="166" height="44" rx="7" fill="#173644" stroke="#4b7b86"/><text x="${p[0]}" y="${p[1]+4}" text-anchor="middle" fill="#dbedf0" font-size="13">${CASE_ROLES[key]}</text>`;}).join('')}</svg>`;
    return svg+`<ol class="k-case-path-list">${edges.map(e=>`<li><b>${esc(CASE_ROLES[e.from])} → ${esc(CASE_ROLES[e.to])}</b><small>${esc(e.eventId)}${privateView?' · '+esc(e.ref):' · Kanıt referansı kaydedilmiştir.'}</small></li>`).join('')}</ol>`;
  }
  function validateRecording(raw){
    if(!raw||raw.schema!==CASE_SCHEMA||!raw.session||!Array.isArray(raw.frames)||!Array.isArray(raw.events)||raw.frames.length>10800||raw.events.length>20000)throw new Error('KALKAN oturum dosyası geçersizdir.');
    const s=raw.session;if(typeof s.runId!=='string'||s.runId.length>160||s.id!==caseIdFor(s.runId)||!validEpoch(s.openedAt))throw new Error('Oturum kimliği geçersizdir.');
    const session={id:s.id,runId:s.runId,openedAt:s.openedAt,data:validateCase(s.data,s.id),recording:false,frameCount:raw.frames.length,eventCount:raw.events.length,endedAt:s.endedAt||null};
    let last=0,lastSeq=0;
    const safeNumber=(v,min,max)=>{if(!Number.isFinite(v)||v<min||v>max)throw new Error('Kayıt ölçüm değeri geçersizdir.');return v;};
    const frames=raw.frames.map(f=>{
      if(!f||!validEpoch(f.at)||f.at<last||!Number.isInteger(f.sequence)||f.sequence<=lastSeq||!Number.isInteger(f.stage)||f.stage<0||f.stage>9||!Array.isArray(f.rows)||f.rows.length!==31||!Array.isArray(f.regions)||f.regions.length!==4||!Array.isArray(f.plants)||f.plants.length!==4)throw new Error('Kayıt karesi geçersizdir.');
      last=f.at;lastSeq=f.sequence;safeNumber(f.cursor,0,300);
      const rows=f.rows.map(r=>({id:textLimit(r.id,50,'Kaynak',true),region:textLimit(r.region,30,'Bölge',true),metricLabel:textLimit(r.metricLabel,80,'Ölçüm',true),metricValue:textLimit(String(r.metricValue),100,'Değer'),tone:['cyan','green','amber','red','muted'].includes(r.tone)?r.tone:'muted',offline:!!r.offline,age:safeNumber(r.age,0,1e9),link:safeNumber(r.link,0,100),lastReceivedAt:validEpoch(r.lastReceivedAt)?r.lastReceivedAt:null,packetSequence:safeNumber(r.packetSequence,0,1e12)}));
      if(new Set(rows.map(r=>r.id)).size!==31)throw new Error('Kaynak kimlikleri tekrarlanmamalıdır.');
      const regions=f.regions.map(r=>{
        if(!REGION_DATA.some(base=>base.id===r.id)||!Array.isArray(r.assets)||r.assets.length!==REGION_DATA.find(base=>base.id===r.id).units.length)throw new Error('Bölge kaydı geçersizdir.');
        return {id:r.id,assets:r.assets.map(a=>({id:textLimit(a.id,50,'Unsur',true),x:safeNumber(a.x,-1000,5000),y:safeNumber(a.y,-1000,5000),refX:safeNumber(a.refX,-1000,5000),refY:safeNumber(a.refY,-1000,5000),drift:safeNumber(a.drift,0,100000),destroyed:!!a.destroyed,offline:!!a.offline,changed:!!a.changed,tone:['cyan','green','amber','red','muted'].includes(a.tone)?a.tone:'muted'}))};
      });
      const plants=f.plants.map(p=>{if(!REGION_DATA.some(r=>r.id===p.id))throw new Error('Tesis kaydı geçersizdir.');return {id:p.id,actual:safeNumber(p.actual,0,100),shown:safeNumber(p.shown,0,100),temp:safeNumber(p.temp,-50,200),valve:safeNumber(p.valve,0,100),service:safeNumber(p.service,0,100),offline:!!p.offline};});
      if(new Set(regions.map(r=>r.id)).size!==4||new Set(plants.map(p=>p.id)).size!==4)throw new Error('Bölge kimlikleri tekrarlanmamalıdır.');
      return {sessionId:s.id,sequence:f.sequence,at:f.at,cursor:f.cursor,stage:f.stage,curtain:!!f.curtain,regions,plants,rows};
    });
    const events=raw.events.map((e,i)=>{if(!validEpoch(e.at)||!Number.isInteger(e.stage)||e.stage<0||e.stage>9||!['model','analyst','director'].includes(e.source))throw new Error('Zaman çizelgesi geçersizdir.');return {sessionId:s.id,sequence:i+1,at:e.at,stage:e.stage,eventId:incidentId(s.id,e.stage),source:e.source,kind:textLimit(e.kind,50,'Kayıt türü',true),text:textLimit(e.text,1200,'Kayıt açıklaması',true)};});
    return {schema:CASE_SCHEMA,session,frames,events};
  }
  function recordedEffects(frames){
    if(!frames.length)return null;
    let minimumService=100,maximumDrift=0;const destroyed=new Set();for(const f of frames){for(const p of f.plants)minimumService=Math.min(minimumService,p.service);for(const r of f.regions)for(const a of r.assets){maximumDrift=Math.max(maximumDrift,a.drift);if(a.destroyed)destroyed.add(a.id);}}
    return {minimumService,maximumDrift,destroyed:[...destroyed],samples:frames.length};
  }
  function caseReport(bundle){
    const {session:s,frames,events}=bundle,d=s.data,effects=recordedEffects(frames),rows=(heads,body)=>`<table><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${body.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const evidenceTable=kind=>rows(['Olay / kayıt','UTC / kanıt referansı','Bulgu / bağlam','Değer / güven'],d.evidence.filter(e=>e.kind===kind).map(e=>[e.eventId+' / '+e.id,utcLabel(e.at)+' / '+e.ref,e.summary,(e.iocType?e.iocType+': ':'')+e.value+' / '+e.confidence]));
    return `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KALKAN-1 · ${esc(s.id)}</title><style>body{font:14px/1.6 system-ui,sans-serif;color:#203345;max-width:1120px;margin:36px auto;padding:0 24px}h1{font-size:30px}h2{font-size:20px;margin-top:30px;color:#174c62}small{color:#55717c}table{border-collapse:collapse;width:100%;font-size:12px;table-layout:fixed}th,td{text-align:left;vertical-align:top;border:1px solid #cfdae0;padding:9px;overflow-wrap:anywhere}th{background:#edf3f5}.metrics{display:flex;gap:12px;flex-wrap:wrap}.metrics div{background:#edf3f5;padding:14px;flex:1;min-width:160px}.metrics b{display:block;font:24px monospace}.note{padding:12px 16px;background:#f3f5f6;border-left:3px solid #728e9e}svg{max-width:780px;background:#0e2533} @media print{body{margin:0;font-size:11px}h2{break-after:avoid}tr{break-inside:avoid}.print{display:none}}</style><h1>KALKAN-1 · Tatbikat Sonuç Raporu</h1><p><b>Ortak olay kimliği:</b> ${esc(s.id)}<br><b>Oturum açılışı:</b> ${utcLabel(s.openedAt)}<br><b>Kayıt kapsamı:</b> ${frames.length} görüntü / telemetri örneği · ${events.length} zaman çizelgesi kaydı</p><p class="note">Wazuh kanıt referansları ve siber müdahale kayıtları analist tarafından girilmiştir. Bu arayüz Wazuh loglarını otomatik doğrulamamaktadır. Saha ve PLC verileri gösterim modeline aittir. Bu iki kaynak aşağıda ayrı sunulmaktadır.</p><p class="print">PDF çıktısı için tarayıcıda Yazdır → PDF olarak kaydet seçeneğini kullanınız.</p><h2>1. Analist tarafından doğrulanan olay zamanları</h2><div class="metrics">${caseMetrics(d).map(m=>`<div>${esc(m.label)}<b>${durationLabel(m.ms)}</b><small>${esc(m.from)}</small></div>`).join('')}</div><p>Bu süreler UTC olay zamanlarından hesaplanmıştır. 30 saniyelik sunum süresi ölçüme katılmamıştır. Eksik zamanlar “Ölçülmedi” olarak bırakılmıştır.</p>${rows(['Kilometre taşı','UTC','Kanıt referansı'],Object.entries(CASE_TIME_LABELS).map(([key,label])=>[label,utcLabel(d.times[key]?.at),d.times[key]?.ref||'Kaydedilmemiştir']))}<h2>2. Log bulguları</h2>${evidenceTable('log')}<h2>3. IOC kayıtları</h2>${evidenceTable('ioc')}<h2>4. Gözlenen TTP’ler</h2>${evidenceTable('ttp')}<h2>5. Mavi takım müdahale kayıtları</h2>${evidenceTable('response')}<p>Müdahalenin gerçekleştiği ve sonucu, ilgili kanıt referansı üzerinden incelenmelidir. Reji geçişi veya görsel hizmet düzelmesi, siber olayın kapandığı anlamına gelmemektedir.</p><h2>6. Kanıtla doğrulanan saldırı yolu</h2>${topologyMarkup(d,9,true)}<h2>7. Tehdit aktörü değerlendirmesi</h2><p>${esc(actorStatement(d.actor))}</p><p><b>Dayanak:</b> ${esc(d.actor.basis||'Kaydedilmemiştir.')}<br><b>Alternatif açıklamalar:</b> ${esc(d.actor.alternatives||'Taklit ve yanıltma ihtimali dışlanmamıştır.')}</p><h2>8. Kaydedilen gösterim etkileri</h2>${effects?`<p>${effects.samples} kayıt örneğinde en düşük tesis hizmeti %${effects.minimumService.toFixed(1)}, en yüksek bildirilen konum farkı ${effects.maximumDrift.toFixed(0)} m olarak kaydedilmiştir. İmha işaretli unsurlar: ${esc(effects.destroyed.join(', ')||'Bulunmamaktadır.')}.</p><p>Özet yalnız kaydedilen örnekleri kapsamaktadır; kayda alınmayan aralıklar için sonuç üretilmemiştir.</p>`:'<p>Telemetri kaydı bulunmamaktadır. Etki özeti üretilmemiştir.</p>'}<h2>9. Kayıt zaman çizelgesi</h2>${rows(['UTC / olay','Kaynak / tür','Kayıt'],events.map(e=>[utcLabel(e.at)+' / '+e.eventId,e.source+' / '+e.kind,e.text]))}</html>`;
  }
