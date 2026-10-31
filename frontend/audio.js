  const sceneSound=(()=>{
    const ownerKey='kalkan-audio-owner-v1',prefsKey='kalkan-audio-preferences-v3';
    let ctx=null,master=null,ambienceBus=null,effectBus=null,notificationBus=null,analyser=null,meterData=null,loops={},buffers=new Map(),targets=new WeakMap();
    let enabled=false,starting=false,epoch=0,suspendTimer=null,volume=.35,scene='auto',process=true,events=true,speech=true;
    let lastStage=null,lastRun=null,lastRegion=null,lastValve=null,lastControl=null,playedImpact='',radioEvent='',reminders=0,nextReminder=Infinity;
    let lastEffect='—',effectCount=0,lastUI=0,wasCurtain=false,lastFault='',lastPreviewAt=-Infinity,previewUntil=0;
    const voices=new Set();
    try{const p=JSON.parse(localStorage.getItem(prefsKey));if(p){if(Number.isFinite(p.volume))volume=cap(p.volume,0,1);if(['auto','plc','field'].includes(p.scene))scene=p.scene;for(const k of ['process','events','speech'])if(typeof p[k]==='boolean'){if(k==='process')process=p[k];if(k==='events')events=p[k];if(k==='speech')speech=p[k];}}}catch{}
    function savePreferences(){try{localStorage.setItem(prefsKey,JSON.stringify({volume,scene,process,events,speech}));}catch{}}
    function automate(param,value,time=.1){
      if(!ctx||!Number.isFinite(value))return;value=Math.max(0,value);if(Math.abs((targets.get(param)??-999)-value)<.0001)return;targets.set(param,value);
      const t=ctx.currentTime;try{if(typeof param.cancelAndHoldAtTime==='function')param.cancelAndHoldAtTime(t);else{param.cancelScheduledValues(t);param.setValueAtTime(param.value,t);}param.setTargetAtTime(value,t,Math.max(.01,time));}catch{param.value=value;}
    }
    function bufferFor(kind){
      if(buffers.has(kind))return buffers.get(kind);const sound=synthSound(kind,ctx.sampleRate,37+Object.keys(SOUND_NAMES).indexOf(kind)*311),buffer=ctx.createBuffer(1,sound.samples.length,ctx.sampleRate);buffer.copyToChannel(sound.samples,0);buffers.set(kind,buffer);return buffer;
    }
    function makeLoop(kind,high,low){
      const source=ctx.createBufferSource(),hp=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter(),gain=ctx.createGain();source.buffer=bufferFor(kind);source.loop=true;
      hp.type='highpass';hp.frequency.value=high;hp.Q.value=.6;lp.type='lowpass';lp.frequency.value=low;lp.Q.value=.6;gain.gain.value=0;
      source.connect(hp);hp.connect(lp);lp.connect(gain);gain.connect(ambienceBus);source.start();return {source,gain,filter:lp};
    }
    function initialize(){
      if(ctx)return;const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)throw new Error('Bu tarayıcı sahne sesini desteklememektedir.');
      ctx=new Audio({latencyHint:'interactive'});master=ctx.createGain();ambienceBus=ctx.createGain();effectBus=ctx.createGain();notificationBus=ctx.createGain();
      ambienceBus.connect(master);effectBus.connect(master);notificationBus.connect(master);master.gain.value=0;
      const hp=ctx.createBiquadFilter(),compressor=ctx.createDynamicsCompressor();hp.type='highpass';hp.frequency.value=32;hp.Q.value=.6;
      compressor.threshold.value=-15;compressor.knee.value=12;compressor.ratio.value=3;compressor.attack.value=.008;compressor.release.value=.22;
      analyser=ctx.createAnalyser();analyser.fftSize=1024;meterData=new Float32Array(analyser.fftSize);
      master.connect(hp);hp.connect(compressor);compressor.connect(analyser);analyser.connect(ctx.destination);
      loops={cold:makeLoop('cold',140,3400),hot:makeLoop('hot',75,2200),pump:makeLoop('pump',55,620)};
    }
    function stopVoices(){
      for(const v of voices){automate(v.gain.gain,0,.012);try{v.source.stop(ctx.currentTime+.07);}catch{} }voices.clear();previewUntil=0;
    }
    function oneShot(kind,{preview=false}={}){
      if(!SOUND_NAMES[kind]||!enabled||state.curtain||ctx?.state!=='running')return false;
      if(!preview&&(['cold','hot','pump','valve'].includes(kind)?!process:!events))return false;
      if(voices.size>=8)return false;
      const source=ctx.createBufferSource(),gain=ctx.createGain(),filter=ctx.createBiquadFilter();source.buffer=bufferFor(kind);filter.type='lowpass';filter.frequency.value=kind==='radio'?2700:kind==='blast'?4600:kind==='hot'?2400:kind==='cold'?3600:5000;filter.Q.value=.6;
      const notice=['warning','notice','restore'].includes(kind);gain.gain.value=kind==='blast'?.85:kind==='radio'?.55:notice?.5:kind==='valve'?.68:.55;
      source.connect(filter);filter.connect(gain);gain.connect(notice?notificationBus:effectBus);
      const v={source,gain,kind,preview};voices.add(v);source.onended=()=>{voices.delete(v);source.disconnect();filter.disconnect();gain.disconnect();};
      source.start();if(['cold','hot','pump'].includes(kind)){const t=ctx.currentTime;gain.gain.setValueAtTime(gain.gain.value,t+1.5);gain.gain.linearRampToValueAtTime(0,t+1.8);source.stop(t+1.82);}
      lastEffect=SOUND_NAMES[kind]+' · '+clock(Date.now());effectCount++;updateUI(true);return true;
    }
    function baseline(){
      const c=cursorAt(),i=stageAt(c).index,r=regionMap.get(currentView==='plc'?plcRegion:'guneyova');lastStage=i;lastRun=state.runId;lastRegion=r.id;lastValve=currentPlant(r,c).valve;lastControl=state.controlRev||0;reminders=0;nextReminder=Date.now()+12000;
      const age=(Date.now()-impactStartAt())/1000;playedImpact=i>=6&&age>=3.5?state.runId+':'+impactStartAt():'';radioEvent=i===6?state.runId+':'+impactStartAt():'';
    }
    async function enable(){
      const ticket=++epoch;starting=true;clearTimeout(suspendTimer);lastFault='';
      try{initialize();await ctx.resume();if(ticket!==epoch){if(!enabled&&!starting&&ctx.state==='running')void ctx.suspend().catch(()=>{});return;}if(ctx.state!=='running')throw new Error('Ses çıkışını açmak için düğmeye tekrar basınız.');
        enabled=true;starting=false;baseline();send('audio-owner',{owner:windowId});try{localStorage.setItem(ownerKey,windowId+':'+Date.now());}catch{}update();updateUI(true);
      }catch(error){if(ticket===epoch){lastFault=error.message;release();throw error;}}
    }
    function release(){
      ++epoch;enabled=false;starting=false;clearTimeout(suspendTimer);if(ctx){stopVoices();automate(master.gain,0,.018);for(const l of Object.values(loops))automate(l.gain.gain,0,.025);const ticket=epoch;suspendTimer=setTimeout(()=>{if(ticket===epoch&&!enabled&&ctx?.state==='running')void ctx.suspend().catch(()=>{});},160);}updateUI(true);
    }
    async function toggle(){if(enabled||starting){release();return;}try{await enable();}catch(error){toast(error.message);}}
    function setVolume(value){if(!Number.isFinite(value))return;volume=cap(value/100,0,1);savePreferences();update();updateUI(true);}
    function setScene(value){if(!['auto','plc','field'].includes(value))return;scene=value;savePreferences();baseline();update();updateUI(true);}
    function setOption(key,value){
      if(!['process','events','speech'].includes(key))return;if(key==='process')process=!!value;if(key==='events')events=!!value;if(key==='speech')speech=!!value;
      if(!value&&key!=='speech')for(const v of [...voices]){const physical=['cold','hot','pump','valve'].includes(v.kind);if((key==='process'&&physical)||(key==='events'&&!physical)){automate(v.gain.gain,0,.012);try{v.source.stop(ctx.currentTime+.07);}catch{}voices.delete(v);}}
      savePreferences();update();updateUI(true);
    }
    async function preview(kind){
      if(!SOUND_NAMES[kind])return;if(state.curtain){toast('Bekleme ekranı açıkken sesler susturulmaktadır.');return;}
      if(Date.now()-lastPreviewAt<250)return;lastPreviewAt=Date.now();
      try{if(!enabled)await enable();if(!enabled)return;stopVoices();previewUntil=ctx.currentTime+(['cold','hot','pump'].includes(kind)?1.85:bufferFor(kind).duration+.05);update();oneShot(kind,{preview:true});}
      catch(error){toast(error.message);}
    }
    function updateUI(force=false){
      const now=Date.now();if(!force&&now-lastUI<180)return;lastUI=now;
      document.body.dataset.sound=enabled?'on':starting?'starting':'off';document.body.dataset.audioContext=ctx?.state||'idle';document.body.dataset.soundEffects=String(effectCount);document.body.dataset.soundVoices=[...voices].map(v=>v.kind).join(',');
      document.querySelectorAll('[data-sound-toggle]').forEach(b=>{b.setAttribute('aria-pressed',String(enabled));b.textContent=starting?'♪ Ses açılmaktadır…':enabled?'♪ Ses açık':'♪ Ses kapalı';b.title=enabled?'Bu penceredeki sesi kapat':'Sesi yalnız bu pencerede aç';});
      document.querySelectorAll('[data-sound-volume]').forEach(el=>{if(el!==document.activeElement)el.value=String(Math.round(volume*100));});
      document.querySelectorAll('[data-sound-scene]').forEach(el=>{if(el!==document.activeElement)el.value=scene;});
      document.querySelectorAll('[data-sound-option]').forEach(el=>{el.checked=({process,events,speech})[el.dataset.soundOption];});
      setText('k-sound-volume-label',Math.round(volume*100)+'%');setText('k-sound-last','Son efekt: '+lastEffect);
      let level=0;if(enabled&&!state.curtain&&ctx?.state==='running'&&analyser){analyser.getFloatTimeDomainData(meterData);let sum=0;for(const v of meterData)sum+=v*v;level=Math.min(100,Math.sqrt(sum/meterData.length)*800);}
      const meter=document.querySelector('.k-sound-meter');if(meter){meter.setAttribute('aria-valuenow',String(Math.round(level)));meter.querySelector('i').style.width=level+'%';}
      setText('k-sound-status',lastFault||(!enabled?'Ses kapalıdır.':state.curtain?'Bekleme ekranı · Sesler susturulmuştur.':ctx?.state!=='running'?'Tarayıcı ses çıkışını bekletmektedir.':volume===0?'Ses düzeyi %0’dır.':'Tek ses çıkışı bu pencerededir.'));
    }
    function update(snap){
      if(!ctx||!enabled){updateUI();return;}
      const now=Date.now(),cursor=snap?.cursor??cursorAt(),stage=stageAt(cursor).index,quiet=!!state.curtain,previewing=ctx.currentTime<previewUntil;
      if(quiet!==wasCurtain){if(quiet)stopVoices();wasCurtain=quiet;lastUI=0;}
      automate(master.gain,quiet?0:volume*.8,.07);automate(ambienceBus.gain,process&&!previewing?(speech?.28:.65):0,.22);automate(effectBus.gain,speech?.72:1,.1);automate(notificationBus.gain,speech?.55:.8,.1);
      const chosen=audioScene(currentView,stage,scene),r=regionMap.get(currentView==='plc'?plcRegion:'guneyova'),p=currentPlant(r,cursor),plc=chosen==='plc';
      const flow=cap(p.driveHz/22,0,1.4),service=cap(p.service/100,0,1),pumpOn=p.pumps.filter(Boolean).length/6;
      automate(loops.cold.gain.gain,plc&&p.pumps[0]? .46*flow:0,.23);automate(loops.hot.gain.gain,plc&&p.pumps[1]&&p.pumps[2]?.55*service:0,.3);automate(loops.pump.gain.gain,plc?.19*pumpOn:0,.25);
      automate(loops.hot.filter.frequency,1400+cap(p.localTemp??p.temp,20,90)*10,.35);automate(loops.pump.source.playbackRate,.65+flow*.35,.3);
      const changedRun=lastRun!==state.runId,changedStage=lastStage!==stage;
      if(changedRun){stopVoices();baseline();}
      else if(changedStage){stopVoices();lastStage=stage;reminders=0;nextReminder=now+12000;if(!quiet){const cue=soundCue(stage);if(cue)oneShot(cue);}lastRegion=r.id;lastValve=p.valve;lastControl=state.controlRev||0;}
      if(lastRegion!==r.id){lastRegion=r.id;lastValve=p.valve;}
      if(!quiet&&plc&&lastValve!==null&&Math.abs(lastValve-p.valve)>=.5)oneShot('valve');lastValve=p.valve;lastControl=state.controlRev||0;
      if(stage===6){
        const key=state.runId+':'+impactStartAt(),age=(now-impactStartAt())/1000;
        if(radioEvent!==key){radioEvent=key;if(!quiet&&scene!=='plc')oneShot('radio');}
        if(age>=3.5&&playedImpact!==key){playedImpact=key;if(age<5.5&&!quiet&&scene!=='plc')oneShot('blast');}
      }
      if(!quiet&&events&&state.playing&&[4,5,6].includes(stage)&&now>=nextReminder&&reminders<1){oneShot('warning');reminders++;nextReminder=Infinity;}
      updateUI();
    }
    window.addEventListener('storage',e=>{if(e.key===ownerKey&&e.newValue&&!e.newValue.startsWith(windowId+':'))release();});
    return {toggle,release,update,setVolume,setScene,setOption,preview,status:()=>({enabled,context:ctx?.state||'idle',volume})};
  })();
