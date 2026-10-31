"""Build the current approved UI with an authenticated, server-backed data adapter."""
import ast
from pathlib import Path
import re
import subprocess
import sys

ROOT=Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(ROOT/'frontend/build.py')],check=True)
html=(ROOT/'dist/frontend/index.html').read_text()
app=next(body for _,body in re.findall(r'<script([^>]*)>(.*?)</script\s*>',html,re.S) if 'function renderPLC(' in body)
original=app
legacy=ast.parse((ROOT/'backend/starter-v0.1/tools/build_frontend.py').read_text())
bridge=next(ast.literal_eval(node.value) for node in legacy.body if isinstance(node,ast.Assign) and any(isinstance(x,ast.Name) and x.id=='bridge' for x in node.targets))
bridge=bridge.replace("role:'viewer'","role:'__KALKAN_ROLE__'")
bridge=bridge.replace("offline,tone:offline?'muted':a.tone","offline:offline||!!a.destroyed,tone:a.destroyed?'red':offline?'muted':a.tone")
bridge=bridge.replace("online:offline?0:r.units.length","online:offline?0:assets.filter(a=>!a.destroyed).length")
bridge=bridge.replace("label:offline?'GÜNCEL VERİ YOK'","label:assets.some(a=>a.destroyed)?'1 DRON İMHA':offline?'GÜNCEL VERİ YOK'")
bridge=bridge.replace("state={version:VERSION,runId:data.run_id,rev:data.revision,writer:'server',cursor:data.scenario_cursor,anchor:Date.now(),m:0,playing:false,speed:1,controlRev:data.revision};",
    "state={...state,version:VERSION,runId:data.run_id,rev:data.revision,writer:'server',cursor:data.scenario_cursor,anchor:Date.now(),m:data.motion_seconds-data.scenario_cursor,playing:false,speed:1,controlRev:data.revision,impactAt:data.impact_at?data.impact_at*1000:null,caseOpenedAt:Date.now()-data.motion_seconds*1000};")
bridge=bridge.replace("void liveRequest('/api/v1/me').then(data=>live.role=data.role);","")
bridge += r'''
  async function livePresence(){
    try{const value=await liveRequest('/api/v1/presence',{id:windowId,view:currentView,status:currentBroadcastStatus()});if(value.audioOwner&&value.audioOwner!==windowId)sceneSound.release();for(const p of value.screens||[])if(p.sender!==windowId)receiveBroadcastHeartbeat({...p,at:Date.now()});}catch{}
  }
'''

def change(old,new):
    global app
    if app.count(old)!=1:raise RuntimeError('Frontend adapter anchor mismatch: '+old[:80])
    app=app.replace(old,new,1)

change("  const KEY='kalkan-wall-v6-state'",bridge+"\n  const KEY='kalkan-live-v1-state'")
change("CHANNEL='kalkan-wall-v6'","CHANNEL='kalkan-live-v1'")
change("  function regionSnapshot(r,seconds) {","  function regionSnapshot(r,seconds) {if(LIVE)return liveRegion(r);")
change("  function currentPlant(r,cursor,at=Date.now()) {","  function currentPlant(r,cursor,at=Date.now()) {if(LIVE)return livePlant(r);")
change("  function cursorAt(now=Date.now()){const value=","  function cursorAt(now=Date.now()){if(LIVE)return live.snapshot?.scenario_cursor||0;const value=")
change("  function acceptState(s){if(","  function acceptState(s){if(LIVE)return;if(")
change("  function commit(change,kind='presentation',detail='',relatedStage=null) {","  function commit(change,kind='presentation',detail='',relatedStage=null) {if(LIVE){toast('Canlı işlemler kırmızı / mavi takım araçlarından yönetilmektedir.');return;}")
change("    if(!canOperatePLC()||!regionMap.has(region))return;","    if(!canOperatePLC()||!regionMap.has(region))return;\n    if(LIVE){void liveControl(patch,message,region);return;}")
change("const canOperatePLC=()=>plcControlAllowed(currentView,audience,screenMonitor);","const canOperatePLC=()=>['operator','white'].includes(live.role)&&plcControlAllowed(currentView,audience,screenMonitor);")
change("  function updateTelemetryFeed(feed,runId,cursor,at,plants=null,controlVersion=0) {","  function updateTelemetryFeed(feed,runId,cursor,at,plants=null,controlVersion=0) {if(LIVE)return liveFeed(feed,runId,cursor,at);")
change("  function renderEvents(snap) {","  function renderEvents(snap) {if(LIVE){liveEvents(snap);return;}")
change("  function plcWarning(seconds) {", """  function plcWarning(seconds) {
    if(LIVE){if(!live.snapshot)return null;const p=livePlant(regionMap.get('guneyova'));if(!p.offline&&p.quality!=='red'&&!live.snapshot.contained)return null;return {tone:p.offline||p.quality==='red'?'red':'amber',label:'WARN / CANLI PROSES',title:p.offline?'HMI güncel veri almamaktadır':p.bias>3?'PLC ölçümü referansla uyuşmamaktadır':p.quality==='red'?'Proses parametreleri onaylı reçeteden farklıdır':'Müdahale sonrası doğrulama sürmektedir',detail:'Bağımsız OT ölçümü ve alınan son paket birlikte izlenmektedir.',value:p.bias>3?fmt(p.bias,1)+' puan':'%'+fmt(p.service),valueLabel:p.bias>3?'ÖLÇÜM FARKI':'HİZMET KAPASİTESİ',tag:'GO-PLC-01 · GÜNEYOVA',event:live.snapshot.stage_index};}
""")
change("  function renderTelemetry(snap) {","  function renderTelemetry(snap) {if(LIVE&&!live.snapshot){setText('k-tlm-headline','Sunucu bağlantısı beklenmektedir');return;}")
change("const cursor=cursorAt(),stage=stageAt(cursor),playing=state.playing&&cursor<TOTAL_SECONDS;","const cursor=cursorAt(),stage={...stageAt(cursor),...liveStage()},playing=false;")
change("      if(currentView==='director')renderDirector(snap);","      if(currentView==='director')renderDirector(snap);if(LIVE)liveDecorate();")
change("  readLocation();send('hello');heartbeat();","  readLocation();send('hello');heartbeat();void pollLive();setInterval(pollLive,500);void livePresence();setInterval(livePresence,1000);")
change("currentView=VIEWS.some(v=>v.id===next)?next:'command';audience=","currentView=VIEWS.some(v=>v.id===next)?next:'command';if(currentView==='director'&&live.role!=='white')currentView='command';audience=")
app=app.replace('Bu kontrol, backend veya haricî Wazuh bağlantısını doğrulamamaktadır. Sekmeler aynı tarayıcı ve adreste açılmalıdır.','Bu kontrol backend üzerinden ekran durumlarını almaktadır. Haricî Wazuh sağlığı ayrıca doğrulanmalıdır.')
app=app.replace('Veri kaynağı: yerel gösterim modeli.','Veri kaynağı: bağımsız OT modeli ve ortak backend.')
app=app.replace('Önerilen scriptler henüz uygulanmamıştır.','Scriptler lab paketindedir; işlemler host ve Wazuh kayıtlarıyla doğrulanmalıdır.')
app=app.replace('Mevcut backend’in servis hesabı eşlemesi henüz eklenmemiştir.','Servis hesabı, ayrı uygulama kimliği ve API oturumu ile ilişkilendirilmektedir.')
app=app.replace("    document.body.classList.add('k-live-backend');","    document.body.classList.add('k-live-backend');if(live.role!=='white'){sceneSound.release();document.querySelectorAll('[data-sound-toggle],[data-sound-test]').forEach(b=>b.disabled=true);}")
html=html.replace(original,app,1)
html=html.replace('</style>', '\n.k-live-backend #k-plc-trends,.k-live-backend #k-position-trend{display:none}.k-live-connection{position:fixed;z-index:10000;top:0;left:50%;transform:translateX(-50%);background:#693242;color:#ffe1e6;padding:10px 22px;border:1px solid #f17f88;border-radius:0 0 6px 6px;font:12px system-ui;pointer-events:none}.k-live-connection[hidden]{display:none}\n</style>',1)
html=html.replace('<div id="k-toast"','<div id="k-live-connection" class="k-live-connection" role="status">SUNUCUYA BAĞLANILIYOR</div>\n<div id="k-toast"',1)
output=ROOT/'dist/live/index.html';output.parent.mkdir(parents=True,exist_ok=True);output.write_text(html)
print('Built current live frontend:',output)
