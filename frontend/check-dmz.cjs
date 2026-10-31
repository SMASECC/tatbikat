const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const guide=fs.readFileSync(__dirname+'/dmz-guide.js','utf8');
let stage=1,readerCalls=0,checks=0;
const root={dataset:{}},reader={open:false};
const context={currentView:'director',audience:false,state:{runId:'case-A',cursor:30},observerView:()=>context.audience,
  stageAt:()=>({index:stage}),cursorAt:()=>context.state.cursor,document:{querySelectorAll:()=>[]},
  $:id=>id==='k-dmz-cue-body'?root:id==='k-script-reader'?reader:null,
  esc:s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;'),
  put:(id,html)=>{if(id==='k-dmz-cue-body')root.markup=html;},renderScriptReader:()=>readerCalls++};
const m=vm.runInNewContext(guide+';({DMZ_ACCESS_STEPS,dmzGuideMarkup,renderDmzGuide,selectDmzCue,navigateDmzReader,index:()=>dmzCueIndex,active:()=>dmzReaderActive,readerMode:v=>dmzReaderActive=v})',context);
const check=(x,label)=>{assert.ok(x,label);checks++;};
check(m.DMZ_ACCESS_STEPS.length===6,'six technical cues form the access chain');
check(m.DMZ_ACCESS_STEPS.every(x=>x.narration.split(/\s+/).length<=55),'each technical card is readable within its nominal 30-second interval');
check(m.DMZ_ACCESS_STEPS[0].narration.includes('svc-web'),'initial shell runs as the service user');
check(m.DMZ_ACCESS_STEPS[3].narration.includes('yönetici yetkisi zorunlu değildir'),'pivot does not falsely require root');
check(m.DMZ_ACCESS_STEPS[4].evidence.includes('uygulamaya yazma yetkisini tek başına'),'network access and application authorization remain separate');
for(const view of ['command','operations','plc','telemetry','events']){
 context.currentView=view;check(m.dmzGuideMarkup()==='','no technical guide is rendered in '+view);
 m.selectDmzCue(4);check(m.index()===0,'cue selection cannot operate outside private director view / '+view);
}
context.currentView='director';context.audience=true;check(m.dmzGuideMarkup()==='','audience flag prevents guide rendering');
context.audience=false;const html=m.dmzGuideMarkup();
check((html.match(/data-dmz-cue=/g)||[]).length===6,'director renders six reading controls');
check(html.includes('henüz uygulanmamıştır')&&html.includes('doğrulanmamaktadır'),'the guide identifies the planned scripts and lack of live verification');
m.renderDmzGuide({index:stage});
for(let i=0;i<6;i++){m.selectDmzCue(i);check(m.index()===i&&root.markup.includes(m.DMZ_ACCESS_STEPS[i].script),'each cue selects its own script and reading card / '+i);}
check(context.state.cursor===30,'technical cue selection never advances the presentation');
for(const n of [-1,6,1.5,NaN]){m.selectDmzCue(n);check(m.index()===5,'invalid cue index is ignored');}
reader.open=true;m.readerMode(true);m.navigateDmzReader(1);
check(!m.active()&&context.state.cursor===30&&readerCalls>0,'last technical cue returns to the stage script without advancing it');
m.readerMode(true);context.state.runId='case-B';m.renderDmzGuide({index:1});
check(m.index()===0&&!m.active(),'a new case resets the guide to the first cue');
m.readerMode(true);m.renderDmzGuide({index:2});check(!m.active(),'leaving the access stage clears technical reader mode');
const app=fs.readFileSync(__dirname+'/app.js','utf8'),match=app.match(/const STAGES\s*=\s*(\[[\s\S]*?\n\]);/);
const stages=JSON.parse(match[1]);
check(!/sudo|SSH|tünel|svc-|\.py|DMZ-PORTAL/.test(stages[1].evidence+stages[1].target),'public impact fields do not reveal the private technical plan');
check(stages[1].narration.includes('DMZ')&&!stages[1].narration.includes('geçerli komuta hesabını'),'initial access narration follows the DMZ scenario');
console.log(checks+' DMZ cue privacy, narration, prerequisites, navigation and reset checks passed.');
