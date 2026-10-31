const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const html=fs.readFileSync(__dirname+'/../web/index.html','utf8');
const app=[...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script\s*>/g)].find(m=>m[2].includes('function renderPLC('))[2];
new vm.Script(app);
const exposed=vm.runInNewContext(app.split("  const KEY=")[0]+`\nreturn {setSnapshot(s,stale=false){live.snapshot=s;live.lastOK=Date.now()-(stale?3000:0)},rows(){return telemetrySources(live.snapshot.scenario_cursor,REGION_DATA.map(liveRegion),new Map(REGION_DATA.map(r=>[r.id,livePlant(r)])))},region(){return liveRegion(REGION_DATA[0])},telemetrySignalProfile,liveStage};})();`,{Intl,Date,Math});
const snapshots=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
let checks=0;const check=(value,message)=>{assert.ok(value,message);checks++};
for(const [stage,snapshot] of Object.entries(snapshots)){
 exposed.setSnapshot(snapshot);const rows=exposed.rows();check(rows.length===31,'31 server-backed sources / '+stage);
 const a=rows.find(x=>x.id==='KR-ZPT-01');
 check(a.asset.coord.lat===snapshot.regions[0].assets[0].coord.lat,'position equals server packet / '+stage);
 const p=rows.find(x=>x.id==='GO-PLC-01');
 check(p.plant.shown===snapshot.plants.guneyova.shown,'HMI equals server packet / '+stage);
 if(stage==='position')check(a.channels[0].tone==='bad','corrupted position turns red');
 if(stage==='contained')check(a.asset.drift===650&&a.offline,'containment preserves damage and the existing outage');
 if(stage==='command')check(p.channels[0].tone==='bad'&&p.channels[1].tone==='bad','PLC measurement and command warnings');
 if(stage==='outage')check(a.offline&&p.offline,'outage shown for both channels');
 if(stage==='recovered')check(rows.every(x=>x.tone==='good'),'recovered sources return to normal');
}
exposed.setSnapshot(snapshots.normal,true);
check(exposed.rows().every(x=>x.offline),'API loss never silently falls back to synthetic live data');
check(exposed.telemetrySignalProfile(exposed.rows()[0],Date.now()).bars.every(v=>v===0),'API loss stops signal activity');
console.log(checks+' server-to-frontend projection checks passed.');
