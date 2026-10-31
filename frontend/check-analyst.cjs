const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const app=fs.readFileSync(__dirname+'/app.js','utf8').replace('  /* SERVICE_CHECKS */',fs.readFileSync(__dirname+'/service-checks.js','utf8'));
let now=1000000;class Clock extends Date{static now(){return now;}}
const model=vm.runInNewContext(app.split('  const KEY=')[0]+`\nconst state={m:0,playing:false,anchor:1000000,impactAt:800000};return {STAGES,REGION_DATA,telemetrySources,createTelemetryFeed,updateTelemetryFeed,serviceHealth,serviceValidation};})();`,{Intl,Date:Clock});
const normalize=vm.runInNewContext(fs.readFileSync(__dirname+'/analyst-ui.js','utf8')+';normalizeWazuhAddress',{URL,localStorage:{getItem(){return null;}}});
let checks=0;const check=(v,msg)=>{assert.ok(v,msg);checks++;};
check(normalize(' https://wazuh.example.invalid:443/ ')==='https://wazuh.example.invalid/','Wazuh address normalizes safely');
check(normalize('http://192.0.2.10:5601/app/')==='http://192.0.2.10:5601/app/','lab address and explicit port are supported');
check(normalize('')==='','address can be cleared');
for(const value of ['javascript:alert(1)','file:///etc/passwd','https://user:pass@example.invalid/','https://example.invalid/?token=secret','https://example.invalid/#session','not-a-url']){
 assert.throws(()=>normalize(value));checks++;
}
check(!app.includes("id:'defense'")&&!app.includes('renderDefense')&&!app.includes('data-blue-action'),'custom defence view and fake intervention buttons are removed');
check(!app.includes('blueGate')&&!app.includes('blueManual'),'cancelled intervention automation cannot block the presentation');
check(app.includes('holdAfterStep:true'),'presentation waits for analyst review by default');
check(model.STAGES.every(s=>s.seconds===30&&s.narration.split(/\s+/).length<=55),'ten formal spoken cards fit their nominal 30-second steps');
check(model.STAGES.every(s=>!s.narration.includes('Siber Savunma')),'no spoken reference to the cancelled screen remains');
const steps=vm.runInNewContext(fs.readFileSync(__dirname+'/analyst-steps.js','utf8')+';ANALYST_STEPS');
check(steps.length===10&&steps.every(s=>s.logs&&s.ioc&&s.ttp&&s.response&&s.limit),'each red-team step has log, IOC, TTP and response guidance');
check(steps[9].limit.includes('Taklit')&&steps[9].limit.includes('tek başına'),'attribution retains the mimicry alternative and evidence limit');
check(model.STAGES[9].narration.includes('kesin atıf oluşturmamaktadır'),'final spoken assessment does not assert definitive attribution');
let feed=model.createTelemetryFeed('analyst',now);
const sample=i=>{model.updateTelemetryFeed(feed,'analyst',model.STAGES[i].start,now);return model.serviceValidation({stage:model.STAGES[i]},feed,now);};
let s=sample(7);
check(s.rows.find(r=>r.id==='KR-ZPT-01').asset.drift===650,'containment scene retains corrupted position');
check(s.active.filter(r=>r.asset.orderChanged).length===5,'containment scene retains corrupted mission records');
check(s.lost.length===1&&s.linked.length===26,'loss is separate from restored surviving field links');
now+=1000;s=sample(8);check(!s.clean&&!s.verified,'partial service recovery is not declared fully healthy');
now+=1000;s=sample(9);check(s.clean&&!s.verified,'one new sample is insufficient for service verification');
now+=1000;s=sample(9);check(!s.verified,'two new samples are insufficient');
now+=1000;s=sample(9);check(s.verified,'three consecutive fresh samples confirm only the service checks');
now+=5000;s=model.serviceValidation({stage:model.STAGES[9]},feed,now);check(!s.verified,'stale samples cannot sustain the verification');
const built=fs.readFileSync(__dirname+'/dist/index.html','utf8');
check(!built.includes('Siber Savunma')&&!built.includes('data-blue-action')&&!built.includes('k-blue-grid'),'standalone output contains none of the cancelled dashboard');
check(built.includes('Wazuh’u ayrı pencerede aç')&&built.includes('taklit edilmiş olabileceği'),'output includes the external Wazuh launch and cautious reporting guidance');
console.log(checks+' Wazuh workflow, removal, attribution and service-verification checks passed.');
