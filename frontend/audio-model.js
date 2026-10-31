  const SOUND_NAMES={cold:'Soğuk su akışı',hot:'Sıcak su dolaşımı',pump:'Pompa motoru',valve:'Vana aktüatörü',radio:'Telsiz bağlantı kaybı',warning:'Kritik durum bildirimi',notice:'Erişim uyarısı',restore:'Doğrulama bildirimi',blast:'Dron çarpması'};
  // Deterministic, local sound buffers. No downloads, microphone or external assets.
  function synthSound(kind,sampleRate=44100,seed=37){
    const durations={cold:6.4,hot:7.2,pump:5,valve:1.35,radio:.62,warning:.64,notice:.38,restore:.62,blast:2.45};
    if(!durations[kind]||!Number.isInteger(sampleRate)||sampleRate<8000||sampleRate>192000)throw new Error('Ses türü veya örnekleme hızı geçersizdir.');
    const duration=durations[kind],out=new Float32Array(Math.ceil(duration*sampleRate));let rng=(seed>>>0)||37,low=0,slow=0,previous=0,phase=0,mean=0;
    const random=()=>{rng^=rng<<13;rng^=rng>>>17;rng^=rng<<5;return (rng>>>0)/2147483648-1;};
    const pulse=(t,start,length,f)=>{const a=t-start;return a<0||a>length?0:Math.sin(Math.PI*a/length)**1.8*Math.sin(2*Math.PI*f*a);};
    for(let i=0;i<out.length;i++){
      const t=i/sampleRate,w=random();low+=.035*(w-low);slow+=.0015*(w-slow);let v=0;
      if(kind==='cold'||kind==='hot'){
        const warm=kind==='hot',swell=.8+.11*Math.sin(2*Math.PI*t/duration)+.055*Math.sin(2*Math.PI*3*t/duration+1.4);
        const grain=warm?low*3.2+w*.12:low*1.4+w*.29;
        const bubbles=.028*Math.sin(2*Math.PI*(warm?690:1280)*t)*Math.max(0,Math.sin(2*Math.PI*7*t/duration))**16;
        v=swell*grain+bubbles;
      }else if(kind==='pump'){
        v=.22*Math.sin(2*Math.PI*96*t)+.045*Math.sin(2*Math.PI*192*t+.3)+.027*Math.sin(2*Math.PI*288*t)+low*.18;
      }else if(kind==='valve'){
        const env=Math.sin(Math.PI*t/duration)**.55;
        phase+=2*Math.PI*(112+22*Math.sin(Math.PI*t/duration))/sampleRate;
        v=env*(.13*Math.sin(phase)+.05*Math.sin(phase*3)+low*.65)*( .82+.18*Math.sin(2*Math.PI*19*t))+
          pulse(t,.012,.04,1400)*.18+pulse(t,duration-.09,.07,730)*.24;
      }else if(kind==='radio'){
        const attack=Math.min(1,t/.012),env=attack*Math.exp(-t*7),tail=Math.max(0,1-t/duration);
        v=(w-previous)*.16*env+low*.2*tail+pulse(t,.44,.065,820)*.06;
      }else if(kind==='blast'){
        const onset=Math.min(1,t/.004),body=Math.exp(-t*4.5),air=Math.exp(-t*2.4);
        phase+=2*Math.PI*(38+58*Math.exp(-t*7))/sampleRate;
        const debris=pulse(t,.29,.07,1540)*.06+pulse(t,.47,.09,970)*.045+pulse(t,.71,.1,620)*.025;
        v=onset*(Math.sin(phase)*.34*body+low*2.6*air+w*.17*Math.exp(-t*26))+debris;
      }else if(kind==='warning')v=.2*pulse(t,.01,.16,720)+.17*pulse(t,.29,.19,610);
      else if(kind==='notice')v=.17*pulse(t,.015,.15,640)+.1*pulse(t,.2,.13,570);
      else if(kind==='restore')v=.13*pulse(t,.01,.2,480)+.14*pulse(t,.27,.24,640);
      previous=w;out[i]=v;mean+=v;
    }
    mean/=out.length;
    let peak=0;for(let i=0;i<out.length;i++){out[i]-=mean;peak=Math.max(peak,Math.abs(out[i]));}
    const gain=peak>0?(kind==='blast'?.64:kind==='cold'||kind==='hot'?.55:.48)/peak:1;
    const isLoop=['cold','hot','pump'].includes(kind),fade=Math.ceil(sampleRate*(isLoop?.07:.009));
    for(let i=0;i<out.length;i++){
      // Raised-cosine seam and tails avoid clicks when a buffer starts, ends or loops.
      const edge=Math.min(i/fade,(out.length-1-i)/fade,1),envelope=.5-.5*Math.cos(Math.PI*Math.max(0,edge));out[i]*=gain*envelope;
    }
    return {samples:out,duration:out.length/sampleRate,loop:isLoop};
  }
  function audioScene(view,stage,requested){
    if(requested==='plc'||requested==='field')return requested;
    if(view==='plc')return 'plc';if(view==='operations')return 'field';
    return [4,5,7,8,9].includes(stage)?'plc':'field';
  }
  function soundCue(stage){return stage>=1&&stage<=3?'notice':stage>=4&&stage<=6?'warning':stage>=7?'restore':null;}
