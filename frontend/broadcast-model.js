  const BROADCAST_PROTOCOL=1,BROADCAST_BUILD='K1-dmz-20261031-v1',PEER_FRESH_MS=7000;
  function plcControlAllowed(view,aud,wall){return view==='plc'&&!aud&&!wall;}
  function validBroadcastStatus(h){
    return !!h&&h.protocol===BROADCAST_PROTOCOL&&typeof h.build==='string'&&h.build.length<=64&&typeof h.runId==='string'&&h.runId.length<=200&&Number.isFinite(h.rev)&&
      Number.isInteger(h.stage)&&h.stage>=0&&h.stage<10&&Number.isFinite(h.cursor)&&h.cursor>=0&&h.cursor<=300&&typeof h.playing==='boolean'&&typeof h.hold==='boolean'&&
      typeof h.observer==='boolean'&&typeof h.readOnly==='boolean'&&typeof h.visible==='boolean'&&typeof h.curtain==='boolean'&&Number.isFinite(h.capturedAt)&&Number.isFinite(h.renderedAt)&&
      Number.isInteger(h.frame)&&h.frame>=0&&!!h.audio&&typeof h.audio.enabled==='boolean'&&Number.isFinite(h.audio.volume)&&h.audio.volume>=0&&h.audio.volume<=1&&
      ['idle','running','suspended','interrupted','closed'].includes(h.audio.context);
  }
  function projectedBroadcastCursor(h,at){
    const advanced=h.cursor+(h.playing?Math.max(0,at-h.capturedAt)/1000:0),end=h.hold?(h.stage+1)*30-.001:300;return Math.max(0,Math.min(300,h.playing?Math.min(advanced,end):advanced));
  }
  function evaluateBroadcastPeer(peer,expected,at){
    const age=Math.max(0,at-peer.seen),h=peer.health;
    const result=(code,label,tone='amber')=>({code,label,tone,age,peer});
    if(age>PEER_FRESH_MS)return result('offline','Yanıt alınamamaktadır','red');
    if(!validBroadcastStatus(h)||h.build!==BROADCAST_BUILD)return result('legacy','Güncel sürüm açılmalıdır');
    if(h.runId!==expected.runId)return result('case','Farklı olay','red');
    if(h.stage!==expected.stage)return result('stage','Farklı aşama','red');
    if(h.rev!==expected.rev)return result('revision','Eşitleme beklenmektedir');
    if(h.curtain!==expected.curtain)return result('curtain','Bekleme ekranı farklı','red');
    if(h.playing!==expected.playing||Math.abs(projectedBroadcastCursor(h,at)-expected.cursor)>1.5)return result('clock','Akış zamanı farklı','red');
    if(peer.view==='plc'&&!h.readOnly)return result('controls','Kumanda kilidi kapalı','red');
    if(!h.observer)return result('operator','Operatör görünümü');
    if(!h.visible)return result('background','Pencere arka plandadır');
    if(!h.frame||at-h.renderedAt>5000)return result('render','Görüntü yenilenmemektedir','red');
    if(age>4000)return result('late','Eşitleme gecikmektedir');
    return result('ready','Hazır','green');
  }
  function summarizeBroadcast(peers,expected,required,at,audioRequired=true){
    const assessed=peers.map(p=>evaluateBroadcastPeer(p,expected,at));
    const groups=required.map(view=>{
      const copies=assessed.filter(a=>a.peer.view===view&&(a.peer.health?.observer!==false)),operators=assessed.filter(a=>a.peer.view===view&&a.peer.health?.observer===false);
      const ready=copies.length>0&&copies.every(a=>a.code==='ready'),worst=copies.find(a=>a.tone==='red')||copies.find(a=>a.code!=='ready')||copies[0];
      return {view,copies,operators,ready,label:worst?.label||(operators.length?'Yalnız operatör penceresi açıktır':'İzleyici ekranı açık değildir'),tone:worst?.tone||'amber'};
    });
    const fresh=peers.filter(p=>at-p.seen<=PEER_FRESH_MS&&validBroadcastStatus(p.health)),owners=fresh.filter(p=>p.health.audio.enabled),audible=owners.filter(p=>p.health.audio.context==='running'&&p.health.audio.volume>0&&!p.health.curtain);
    const audio=owners.length>1?{code:'multiple',label:'Birden fazla ses çıkışı',tone:'red'}:expected.curtain?{code:'curtain',label:'Bekleme ekranında sessiz',tone:'green'}:
      audible.length===1?{code:'ready',label:'Tek ses çıkışı doğrulanmıştır',tone:'green'}:!audioRequired?{code:'optional',label:'Sessiz gösterim seçilmiştir',tone:'green'}:
      owners.length?{code:'muted',label:owners[0].health.audio.volume===0?'Ses düzeyi %0’dır':'Ses çıkışı bekletilmektedir',tone:'amber'}:{code:'missing',label:'Ses çıkışı seçilmemiştir',tone:'amber'};
    const readyCount=groups.filter(g=>g.ready).length;
    return {groups,assessed,owners,audible,audio,readyCount,total:required.length,ready:required.length>0&&readyCount===required.length&&audio.tone==='green'};
  }
