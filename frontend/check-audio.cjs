const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
const modelCode=fs.readFileSync(__dirname+'/audio-model.js','utf8'),engineCode=fs.readFileSync(__dirname+'/audio.js','utf8');
const model=vm.runInNewContext(modelCode+';({SOUND_NAMES,synthSound,audioScene,soundCue})',{Float32Array});
let checks=0;const check=(v,msg)=>{assert.ok(v,msg);checks++;};
const stats={};
for(const kind of Object.keys(model.SOUND_NAMES)){
 const a=model.synthSound(kind,22050),b=model.synthSound(kind,22050);let peak=0,sum=0,mean=0;
 for(let i=0;i<a.samples.length;i++){const v=a.samples[i];assert.ok(Number.isFinite(v));assert.equal(v,b.samples[i]);peak=Math.max(peak,Math.abs(v));sum+=v*v;mean+=v;}
 check(peak<.66&&peak>.05,kind+' has controlled nonzero peak');check(Math.abs(a.samples[0])+Math.abs(a.samples.at(-1))<1e-7,kind+' starts and ends without a step');check(Math.abs(mean/a.samples.length)<.003,kind+' has negligible DC offset');
 stats[kind]={duration:a.duration,peak:+peak.toFixed(4),rms:+Math.sqrt(sum/a.samples.length).toFixed(4)};
}
check(model.synthSound('cold').duration>6&&model.synthSound('hot').duration>7,'water textures avoid short repeating loops');
check(model.audioScene('plc',0,'auto')==='plc'&&model.audioScene('director',6,'auto')==='field'&&model.audioScene('telemetry',5,'auto')==='plc','automatic audio follows view and actual stage');
check(model.soundCue(0)===null&&model.soundCue(2)==='notice'&&model.soundCue(5)==='warning'&&model.soundCue(9)==='restore','notification vocabulary follows event severity');
assert.throws(()=>model.synthSound('unknown'));checks++;
let now=1793440000000,simulatedCursor=0,impactAt=now,plantValve=70;
const nodes=[],timeouts=new Map(),listeners={},texts={};let timerId=0;
class Param{constructor(value=0){this.value=value;this.calls=[];}setValueAtTime(v){this.value=v;this.calls.push(v);}setTargetAtTime(v){this.value=v;this.calls.push(v);}linearRampToValueAtTime(v){this.value=v;this.calls.push(v);}cancelScheduledValues(){}cancelAndHoldAtTime(){}}
class Node{constructor(type){this.type=type;this.gain=new Param(1);this.frequency=new Param();this.Q=new Param();this.playbackRate=new Param(1);this.started=false;this.stopped=false;nodes.push(this);}connect(){}disconnect(){}start(){this.started=true;}stop(){this.stopped=true;}getFloatTimeDomainData(a){a.fill(0);}}
class FakeAudio{constructor(){this.state='suspended';this.currentTime=0;this.sampleRate=8000;this.destination={};this.suspends=0;FakeAudio.last=this;}async resume(){this.state='running';}async suspend(){this.state='suspended';this.suspends++;}createGain(){return new Node('gain');}createBiquadFilter(){return new Node('filter');}createBufferSource(){return new Node('source');}createAnalyser(){return new Node('analyser');}createDynamicsCompressor(){const n=new Node('compressor');for(const k of ['threshold','knee','ratio','attack','release'])n[k]=new Param();return n;}createBuffer(channels,length,rate){return {duration:length/rate,copyToChannel(){}};}}
const state={runId:'sound-test',playing:false,curtain:false,controlRev:0};
const body={dataset:{}},context={Float32Array,Map,Set,WeakMap,Date:class extends Date{static now(){return now;}},Math,Number,JSON,
 window:{AudioContext:FakeAudio,addEventListener:(k,fn)=>listeners[k]=fn},localStorage:{getItem(){return null;},setItem(){}},document:{body,activeElement:null,querySelectorAll:()=>[],querySelector:()=>null},
 setTimeout:fn=>{timeouts.set(++timerId,fn);return timerId;},clearTimeout:id=>timeouts.delete(id),state,windowId:'test-window',currentView:'director',plcRegion:'guneyova',
 regionMap:new Map([['guneyova',{id:'guneyova'}]]),cap:(v,a,b)=>Math.min(b,Math.max(a,v)),clock:()=>'',send(){},toast(){},setText:(id,v)=>texts[id]=v,
 cursorAt:()=>simulatedCursor,stageAt:c=>({index:Math.min(9,Math.floor(c/30))}),impactStartAt:()=>impactAt,
 currentPlant:()=>({valve:plantValve,pumps:[true,true,true,true,true,true],driveHz:22,service:100,temp:48})};
vm.createContext(context);vm.runInContext(modelCode+engineCode+';globalThis.audio=sceneSound;',context);
(async()=>{
 const audio=context.audio;await audio.toggle();check(body.dataset.sound==='on'&&body.dataset.audioContext==='running','explicit gesture enables one audio context');
 const loopCount=nodes.filter(n=>n.type==='source'&&n.loop).length;check(loopCount===3,'only three reusable process layers are allocated');
 simulatedCursor=150;audio.update();check(body.dataset.soundEffects==='1','stage transition produces one short notification');
 for(let i=0;i<40;i++){now+=100;audio.update();}check(body.dataset.soundEffects==='1','paused stages do not produce repeated alarms');
 state.playing=true;now+=13000;audio.update();check(body.dataset.soundEffects==='2','critical running stage has a bounded reminder');
 now+=60000;audio.update();check(body.dataset.soundEffects==='2','critical stage never becomes an endless alarm loop');
 simulatedCursor=180;impactAt=now;audio.update();const before=Number(body.dataset.soundEffects);now+=3500;audio.update();check(Number(body.dataset.soundEffects)===before+1&&texts['k-sound-last'].includes('Dron çarpması'),'drone impact follows the 3.5-second visual crash');
 audio.update();check(Number(body.dataset.soundEffects)===before+1,'impact cannot be duplicated by render ticks');
 state.curtain=true;audio.update();check(body.dataset.soundVoices===''&&texts['k-sound-status'].includes('susturulmuştur'),'curtain cancels active effects and suppresses output');
 const quietCount=body.dataset.soundEffects;await audio.preview('blast');check(body.dataset.soundEffects===quietCount,'curtain also suppresses manual sound tests');
 state.curtain=false;audio.update();check(body.dataset.soundEffects===quietCount,'curtain reopening never replays an expired impact');
 audio.setOption('events',false);simulatedCursor=210;audio.update();check(body.dataset.soundEffects===quietCount,'disabled event bus suppresses scene notifications');
 audio.setOption('events',true);audio.setScene('plc');plantValve=45;audio.update();check(texts['k-sound-last'].includes('Vana aktüatörü'),'valve command changes trigger a physical actuator effect');
 const valveCount=body.dataset.soundEffects;for(let i=0;i<5;i++)audio.update();check(body.dataset.soundEffects===valveCount,'unchanged valve settings never retrigger');
 audio.setVolume(NaN);audio.update();check(!nodes.flatMap(n=>n.gain.calls).some(Number.isNaN),'bad volume input cannot poison the audio graph');
 audio.release();check(body.dataset.sound==='off'&&body.dataset.soundVoices==='','mute cancels all voices');for(const fn of timeouts.values())fn();check(FakeAudio.last.state==='suspended','muted audio suspends the audio device');
 await audio.toggle();check(nodes.filter(n=>n.type==='source'&&n.loop).length===3,'reenabling audio does not leak duplicate loops');
 listeners.storage({key:'kalkan-audio-owner-v1',newValue:'other-window:1'});check(body.dataset.sound==='off','another monitor claiming sound releases this output');
 let finishResume;FakeAudio.prototype.resume=function(){return new Promise(resolve=>{finishResume=()=>{this.state='running';resolve();};});};
 const pending=audio.toggle();audio.release();for(const fn of timeouts.values())fn();finishResume();await pending;
 check(body.dataset.sound==='off'&&FakeAudio.last.state==='suspended','a delayed resume cannot reactivate a muted or transferred audio device');
 console.log(checks+' sound synthesis, cue timing, controls, curtain and ownership checks passed.');
 console.log(JSON.stringify(stats));
})().catch(error=>{console.error(error);process.exitCode=1;});
