const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync(__dirname+'/app.js','utf8').replace('  /* SERVICE_CHECKS */',fs.readFileSync(__dirname+'/service-checks.js','utf8'));
let now=1000000;class Clock extends Date{static now(){return now;}}
const model=vm.runInNewContext(app.split('  const KEY=')[0]+`\nconst state={m:0,playing:false,anchor:1000000,cursor:0,impactAt:null};return {STAGES,REGION_DATA,TOTAL_SECONDS,regionSnapshot,position,telemetrySources,createTelemetryFeed,updateTelemetryFeed,telemetryFeedRows,droneLossMarkup,setState(s){Object.assign(state,s)}};})();`,{Intl,Date:Clock});
let checks=0;const check=(yes,message)=>{assert.ok(yes,message);checks++};
check(model.STAGES.length===10&&model.STAGES.every(s=>s.seconds===30),'ten equal 30 second steps');
check(model.TOTAL_SECONDS===300,'five minute total');
check(model.STAGES.every(s=>s.narration.trim().split(/\s+/).length<=55),'all spoken cards fit within a 30 second step');
const kr=model.REGION_DATA[0],normal=model.regionSnapshot(kr,0);
check(normal.online===6&&!normal.assets.some(a=>a.destroyed),'clean baseline');
const redirected=model.regionSnapshot(kr,model.STAGES[3].start+5);
check(redirected.assets.filter(a=>a.orderChanged).length===5,'two vehicles, two teams and fixed observation get changed missions');
for(const a of redirected.assets.filter(a=>a.orderChanged&&a.meta.kind!=='fixed')){
 const later=model.regionSnapshot(kr,model.STAGES[3].start+15).assets.find(x=>x.id===a.id);
 check(Math.hypot(later.truth.x-a.changedTarget.x,later.truth.y-a.changedTarget.y)<Math.hypot(a.truth.x-a.changedTarget.x,a.truth.y-a.changedTarget.y),'actual movement approaches changed target / '+a.id);
}
model.setState({cursor:model.STAGES[6].start,impactAt:now,anchor:now});
let scene=model.regionSnapshot(kr,model.STAGES[6].start),drone=scene.assets.find(a=>a.meta.kind==='air');
check(drone.loss&&!drone.destroyed&&drone.values.altitude>0,'fall starts before destruction');
check(scene.assets.every(a=>a.radioBlocked&&a.values.signal===0),'all Karatepe radio links are blocked');
const firstY=drone.reported.y;now+=1750;drone=model.regionSnapshot(kr,model.STAGES[6].start).assets.find(a=>a.meta.kind==='air');
check(drone.reported.y>firstY&&!drone.destroyed,'drone visibly descends while the stage is paused');
now+=1900;drone=model.regionSnapshot(kr,model.STAGES[6].start).assets.find(a=>a.meta.kind==='air');
check(drone.destroyed&&drone.loss.burst&&drone.values.altitude===0,'impact creates a short burst and zero altitude');
check(model.droneLossMarkup(drone,true).includes('İMHA EDİLDİ'),'explicit destruction badge');
now+=3000;drone=model.regionSnapshot(kr,model.STAGES[6].start).assets.find(a=>a.meta.kind==='air');
check(drone.destroyed&&!drone.loss.burst,'explosion ends while the wreck remains');
for(const stage of model.STAGES.slice(7)){
 const regions=model.REGION_DATA.map(r=>model.regionSnapshot(r,stage.start));
 check(regions.reduce((n,r)=>n+r.online,0)===26,'recovery restores surviving assets without resurrecting the drone / '+stage.index);
 check(regions[0].assets.find(a=>a.meta.kind==='air').destroyed,'loss persists / '+stage.index);
}
const feed=model.createTelemetryFeed('show',now);model.updateTelemetryFeed(feed,'show',model.STAGES[5].start,now);
model.updateTelemetryFeed(feed,'show',model.STAGES[6].start,now+1000);
const lost=model.telemetryFeedRows(feed,now+1000).find(s=>s.id==='KR-VTOL-01');
check(lost.asset.destroyed&&lost.tone==='bad'&&lost.asset.values.altitude===0,'received history preserves the destruction flag during outage');
const restored=model.regionSnapshot(kr,0);check(restored.online===6&&!restored.assets.some(a=>a.loss),'new baseline clears the loss');
console.log(checks+' timing, narration, redirection, crash and recovery checks passed.');
