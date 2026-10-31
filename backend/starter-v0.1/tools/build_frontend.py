#!/usr/bin/env python3
"""Attach a server-backed adapter to the approved standalone front end."""
from pathlib import Path
import re

ROOT=Path(__file__).resolve().parents[1]
source=ROOT/"web/frontend-approved.html"
html=source.read_text()
app=next(body for attrs,body in re.findall(r'<script([^>]*)>(.*?)</script\s*>',html,re.S) if 'function renderPLC(' in body)
original=app


def change(old,new):
    global app
    assert app.count(old)==1,old[:100]
    app=app.replace(old,new,1)


bridge=r'''
  const LIVE=true;
  const live={snapshot:null,role:'viewer',lastOK:0,polling:false};
  const liveStale=()=>!live.snapshot||Date.now()-live.lastOK>2500;
  function liveRegion(r) {
    const row=live.snapshot?.regions.find(x=>x.id===r.id);
    if(!row)return {r,assets:r.units.map(u=>({id:u.id,meta:u,truth:position(u,r,0),reported:position(u,r,0),refCoord:coordinate(r,position(u,r,0)),coord:coordinate(r,position(u,r,0)),values:{},drift:0,orderChanged:false,offline:true,tone:'muted',destination:u.destination})),offline:true,affected:true,label:'SUNUCU BEKLENİYOR',note:'Henüz sunucudan doğrulanmış paket alınmadı.',tone:'amber',online:0,age:0,total:r.units.length};
    const stale=liveStale(),offline=row.offline||stale,age=row.age+Math.max(0,(Date.now()-live.lastOK)/1000);
    const assets=row.assets.map(a=>({...a,meta:r.units.find(u=>u.id===a.id),offline,tone:offline?'muted':a.tone}));
    const p=live.snapshot.plants[r.id],bad=assets.some(a=>a.drift||a.orderChanged)||p.quality==='red',validating=live.snapshot.stage_index===7||live.snapshot.stage_index===8;
    const affected=offline||bad||validating&&(r.id==='karatepe'||r.id==='guneyova')||live.snapshot.stage_index===1&&r.id==='karatepe';
    return {r,assets,offline,affected,label:offline?'GÜNCEL VERİ YOK':bad?'VERİ / TESİS UYARISI':affected?'DOĞRULAMA':'NORMAL',note:offline?'Son alınan örnekler gösteriliyor.':bad?'Sunucu verisi bağımsız referans veya onaylı işletimle uyuşmuyor.':affected?'Bağlantı, bütünlük ve hizmet durumu izleniyor.':r.composition+' · Kayıtlar güncel ve uyumlu.',tone:bad?'red':affected?'amber':'green',online:offline?0:r.units.length,age,total:r.units.length};
  }
  function livePlant(r) {
    const p=live.snapshot?.plants[r.id];
    if(!p)return {...plantSnapshot(r,0),pumps:Array(6).fill(false),driveHz:0,offline:true,age:0,quality:'amber'};
    return {...p,r,cfg:PLANTS[r.id],cursor:live.snapshot.scenario_cursor,offline:p.offline||liveStale(),age:p.age+Math.max(0,(Date.now()-live.lastOK)/1000)};
  }
  function liveStage() {
    if(!live.snapshot||liveStale())return {headline:'Sunucu bağlantısı bekleniyor',detail:'Son alınan veri korunuyor; yeni paket doğrulanmadı.',effect:'Yeni veri alınamıyor.',evidence:'API bağlantısını kontrol et.',tone:'amber'};
    const s=live.snapshot,n=s.active_findings.length;
    if(s.verified)return {headline:'Veriler ve tesis hizmeti doğrulandı',detail:'Bağlantı, bütünlük ve hizmet koşulları en az 8 saniye kararlı.',tone:'green'};
    if(s.restored)return {headline:'Kayıtlar geri yüklendi; tesisin kararlılığı izleniyor',detail:'Bağımsız ölçüm, bağlantı, sıcaklık ve hizmet koşulları karşılaştırılıyor.',tone:'amber'};
    if(s.contained)return {headline:'Uzak yazma kilitlendi; mevcut etkiler inceleniyor',detail:'Oturum iptal edildi. Bozuk kayıtlar ve bağlantı kaybı geri yükleme yapılana kadar sürer.',effect:'Yeni izinsiz değişiklikler engellendi.',evidence:n+' açık bulgu; geri yükleme bekleniyor.',tone:n?'red':'amber'};
    return {};
  }
  function liveFeed(feed,runId,cursor,at) {
    if(!live.snapshot)return false;
    if(feed.runId!==runId)Object.assign(feed,createTelemetryFeed(runId,at));
    const version=live.snapshot.revision+':'+liveStale(),bucket=Math.floor(at/1000);
    if(feed.liveVersion===version&&feed.bucket===bucket)return false;
    const plants=new Map(REGION_DATA.map(r=>[r.id,livePlant(r)]));
    const sources=telemetrySources(cursor,REGION_DATA.map(liveRegion),plants).map(s=>{
      const previous=feed.packets.get(s.id),lastReceivedAt=s.offline?(previous?.lastReceivedAt??at-s.age*1000):live.lastOK;
      const row={...s,sampledAt:live.lastOK,lastReceivedAt,packetSequence:live.snapshot.revision,age:Math.max(0,(at-lastReceivedAt)/1000)};
      if(!s.offline||!previous)feed.packets.set(s.id,row);
      return row;
    });
    const sample={bucket,rows:new Map(sources.map(s=>[s.id,s]))};
    if(feed.bucket===bucket)feed.samples[feed.samples.length-1]=sample;else feed.samples.push(sample);
    feed.samples=feed.samples.filter(s=>s.bucket>=bucket-60);feed.bucket=bucket;feed.sources=sources;feed.liveVersion=version;return true;
  }
  async function liveRequest(path,body) {
    const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),2500);
    try {
      const response=await fetch(path,{method:body===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:controller.signal});
      if(response.status===401){location.href='/login';throw new Error('Oturum gerekli');}
      const data=await response.json();if(!response.ok)throw new Error(data.error||'Sunucu komutu reddedildi');return data;
    }finally{clearTimeout(timer);}
  }
  async function pollLive() {
    if(live.polling)return;live.polling=true;
    try {
      const data=await liveRequest('/api/v1/snapshot');
      if(data.schema_version!==1||!Array.isArray(data.regions)||!data.plants)throw new Error('Geçersiz sunucu paketi');
      live.snapshot=data;live.lastOK=Date.now();
      state={version:VERSION,runId:data.run_id,rev:data.revision,writer:'server',cursor:data.scenario_cursor,anchor:Date.now(),m:0,playing:false,speed:1,controlRev:data.revision};
      render();
    }catch(error){if(liveStale())render();}finally{live.polling=false;}
  }
  async function liveControl(patch,message,region) {
    try {await liveRequest('/api/v1/operator/'+encodeURIComponent(region),{settings:patch});await pollLive();setText('k-plc-control-feedback',message);toast(message);}
    catch(error){toast(error.message);}
  }
  function liveEvents(snap) {
    hero(snap);const events=(live.snapshot?.events||[]).filter(e=>!observerView()||!['lab.reset','record.changed'].includes(e.event_type));
    put('k-chain',events.map(e=>`<div class="k-chain-row active"><i>●</i><time>${esc(clock(new Date(e.timestamp).getTime()))}</time><div><h3>${esc(e.event_type)}</h3><p>${esc(e.message)}</p></div><small>KAYIT #${e.event_seq}</small></div>`).join(''));
    put('k-causal',`<div class="k-causal-step"><small>GÜNCEL BULGULAR</small><strong>${live.snapshot?.active_findings.length||0} açık bulgu</strong><p>${esc((live.snapshot?.active_findings||[]).join(' · ')||'Referanslarla uyumsuzluk yok.')}</p></div>`);
    put('k-checks',recoveryChecks(snap.stage));
  }
  function liveDecorate() {
    document.body.classList.add('k-live-backend');
    const status=$('k-live-connection');
    if(status){status.hidden=!liveStale();status.textContent=live.snapshot?'SUNUCU BAĞLANTISI KESİLDİ · Son alınan veriler gösteriliyor':'SUNUCUYA BAĞLANILIYOR';}
    document.querySelectorAll('[data-stage],[data-action="play"],[data-action="previous"],[data-action="next"],[data-action="reset"]').forEach(b=>{b.disabled=true;b.title='Canlı akış kırmızı/mavi takım komutlarıyla yönetilir.';});
    if(currentView==='director'){
      setText('k-live-mode-note','Canlı backend · Adımlar kırmızı ve mavi takım scriptlerinden gelir. PLC kumandaları sunucuya uygulanır.');
      setText('k-dock-status','CANLI SUNUCU');
    }
    if(currentView==='command'){
      const rows=REGION_DATA.map(liveRegion),bad=rows.flatMap(r=>r.assets).filter(a=>a.drift||a.orderChanged).length,connected=rows.reduce((n,r)=>n+r.online,0),critical=REGION_DATA.filter(r=>livePlant(r).service<98).length;
      put('k-services',serviceRow('Saha bağlantıları',connected/27*100,`${connected} / 27`,connected<27?'critical':'')+serviceRow('Konum / görev doğruluğu',(27-bad)/27*100,`${27-bad} / 27`,bad?'critical':'')+serviceRow('Normal tesis hizmeti',(4-critical)/4*100,`${4-critical} / 4`,critical?'critical':''));
      put('k-mini-events',(live.snapshot?.events||[]).filter(e=>!['lab.reset','record.changed'].includes(e.event_type)).slice(0,3).map(e=>`<div class="k-mini-event"><i></i><div><time>${esc(clock(new Date(e.timestamp).getTime()))}</time><p>${esc(e.message)}</p></div></div>`).join(''));
    }
  }
'''

change("  const KEY='kalkan-wall-v3-state'",bridge+"\n  const KEY='kalkan-live-v1-state'")
change("  function regionSnapshot(r,seconds) {","  function regionSnapshot(r,seconds) {\n    if(LIVE)return liveRegion(r);")
change("  function currentPlant(r,cursor,at=Date.now()) {","  function currentPlant(r,cursor,at=Date.now()) {\n    if(LIVE)return livePlant(r);")
change("  function cursorAt(now=Date.now()){return cap(","  function cursorAt(now=Date.now()){if(LIVE)return live.snapshot?.scenario_cursor||0;return cap(")
change("  function acceptState(s){if(","  function acceptState(s){if(LIVE)return;if(")
change("    if(audience)return;\n    const now=Date.now(),cursor=cursorAt(now);","    if(LIVE){toast('Canlı akış kırmızı / mavi takım scriptleriyle yönetilir.');return;}\n    if(audience)return;\n    const now=Date.now(),cursor=cursorAt(now);")
change("    if(!regionMap.has(region))return;\n    const now=Date.now(),cursor=cursorAt(now)","    if(!regionMap.has(region))return;\n    if(LIVE){void liveControl(patch,message,region);return;}\n    const now=Date.now(),cursor=cursorAt(now)")
change("  function updateTelemetryFeed(feed,runId,cursor,at,plants=null,controlVersion=0) {","  function updateTelemetryFeed(feed,runId,cursor,at,plants=null,controlVersion=0) {\n    if(LIVE)return liveFeed(feed,runId,cursor,at);")
change("commandChanged?(p.locked?'warn':'bad'):p.operatorControlled", "commandChanged?(LIVE?'bad':p.locked?'warn':'bad'):p.operatorControlled")
change("  function renderEvents(snap) {","  function renderEvents(snap) {\n    if(LIVE){liveEvents(snap);return;}")
change("  function renderTelemetry(snap) {", "  function renderTelemetry(snap) {\n    if(LIVE&&!live.snapshot){setText('k-tlm-headline','Sunucu bağlantısı bekleniyor');return;}")
change("  function recoveryChecks(s) {", """  function recoveryChecks(s) {
    if(LIVE){const q=live.snapshot,findings=q?.active_findings||[];return [['Saha / HMI bağlantıları',!findings.includes('telemetry.link_timeout')&&!liveStale()],['Konum ve görev kaydı',!findings.some(x=>x.includes('position')||x.includes('mission'))&&!liveStale()],['Bağımsız ölçüm uyumu',!findings.includes('integrity.measurement_mismatch')&&!liveStale()],['Kararlı hizmet / doğrulama',!!q?.verified]].map(([name,ok])=>`<div class="k-check ${ok?'done':'wait'}"><i>${ok?'✓':'…'}</i><div>${name}<small>${ok?'Doğrulandı':'Kontrol sürüyor'}</small></div></div>`).join('');}
""")
change("  function plcWarning(seconds) {", """  function plcWarning(seconds) {
    if(LIVE){const p=livePlant(regionMap.get('guneyova'));if(!live.snapshot)return null;const bad=p.offline||p.quality==='red';if(!bad&&!live.snapshot.contained)return null;return {tone:bad?'red':'amber',label:bad?'WARN / CANLI PROSES':'MÜDAHALE / DOĞRULAMA',title:p.offline?'Uzak HMI yeni veri almıyor':p.bias>3?'PLC ölçümü referansla uyuşmuyor':bad?'Onaylı proses komutu değişti':'Uzak yazma kilitli; geri dönüş izleniyor',detail:'LT-01 / LT-02 ve vana / sıcaklık değerleri sunucudan alınıyor.',value:p.bias>3?fmt(p.bias,1)+' puan':'%'+fmt(p.service),valueLabel:p.bias>3?'ÖLÇÜM FARKI':'HİZMET KAPASİTESİ',tag:'GO-PLC-01 · GÜNEYOVA',event:live.snapshot.stage_index};}
""")
change("const cursor=cursorAt(),stage=stageAt(cursor),playing=state.playing&&cursor<TOTAL_SECONDS;", "const cursor=cursorAt(),stage={...stageAt(cursor),...(LIVE?liveStage():{})},playing=state.playing&&cursor<TOTAL_SECONDS;")
change("      if(currentView==='director')renderDirector(snap);", "      if(currentView==='director')renderDirector(snap);\n      if(LIVE)liveDecorate();")
change("  readLocation();send('hello');heartbeat();", "  readLocation();send('hello');heartbeat();\n  if(LIVE){void liveRequest('/api/v1/me').then(data=>live.role=data.role);void pollLive();setInterval(pollLive,500);}")
html=html.replace(original,app,1)
html=html.replace('</style>', '\n.k-live-backend #k-plc-trends,.k-live-backend #k-position-trend{display:none}.k-live-connection{position:fixed;z-index:10000;top:0;left:50%;transform:translateX(-50%);background:#693242;color:#ffe1e6;padding:10px 22px;border:1px solid #f17f88;border-radius:0 0 6px 6px;font:12px system-ui;pointer-events:none}.k-live-connection[hidden]{display:none}\n</style>',1)
html=html.replace('<div id="k-toast"','<div id="k-live-connection" class="k-live-connection" role="status">SUNUCUYA BAĞLANILIYOR</div>\n<div id="k-toast"',1)
html=html.replace('1 ÖRNEK / sn','2 ÖRNEK / sn')
html=html.replace('Görsel senaryo ve bütün veriler bu dosyada üretilir. Eşitleme aynı bilgisayardaki tarayıcı pencereleri içindir. Teknik kurulum ve ekran yerleşimi için gösterim rehberini aç.','Canlı backend verileri kullanılır. Aynı sunucuya bağlanan izleyici bilgisayarları ortak durumu alır. Saldırı ve müdahale adımları scriptlerle uygulanır; ayrıntılar paketin kurulum rehberindedir.')
(ROOT/'web/index.html').write_text(html)
print('Sunucuya bağlı frontend üretildi:',ROOT/'web/index.html')
