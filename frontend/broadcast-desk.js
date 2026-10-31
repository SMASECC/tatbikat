  const BROADCAST_PLAN_KEY='kalkan-broadcast-plan-v1';
  let broadcastRequired=['command','operations','plc','telemetry'],broadcastAudioRequired=true,renderCompletedAt=0,renderFrame=0;
  try{const p=JSON.parse(localStorage.getItem(BROADCAST_PLAN_KEY));if(p){const views=p.views?.filter(v=>VIEWS.some(x=>x.id===v&&v!=='director'));if(views?.length)broadcastRequired=[...new Set(views)];if(typeof p.audioRequired==='boolean')broadcastAudioRequired=p.audioRequired;}}catch{}
  const peerAlive=id=>!!peers.get(id)&&Date.now()-peers.get(id).seen<=PEER_FRESH_MS;
  const canOperatePLC=()=>plcControlAllowed(currentView,audience,screenMonitor);
  const plcReadonlyAttributes=new WeakMap();
  function currentBroadcastStatus(at=Date.now()){
    const cursor=cursorAt(at);return {protocol:BROADCAST_PROTOCOL,build:BROADCAST_BUILD,runId:state.runId,rev:state.rev,stage:stageAt(cursor).index,cursor,playing:state.playing,hold:!!state.holdAfterStep,
      observer:observerView(),readOnly:!canOperatePLC(),visible:!document.hidden,curtain:!!state.curtain,capturedAt:at,renderedAt:renderCompletedAt,frame:renderFrame,audio:sceneSound.status()};
  }
  function receiveBroadcastHeartbeat(m){
    if(typeof m.sender!=='string'||m.sender.length>200||!VIEWS.some(v=>v.id===m.view))return;
    peers.set(m.sender,{id:m.sender,view:m.view,seen:Date.now(),health:validBroadcastStatus(m.status)?m.status:null});
  }
  function broadcastSummary(){
    const now=Date.now(),self=currentBroadcastStatus(now),reports=[{id:windowId,view:currentView,seen:now,health:self},...peers.values()];
    return summarizeBroadcast(reports,self,broadcastRequired,now,broadcastAudioRequired);
  }
  function broadcastDeskMarkup(){
    return `<dialog id="k-broadcast-dialog" class="k-broadcast-dialog" aria-labelledby="k-broadcast-title"><header><div><small>REJİ / YAYIN HAZIRLIĞI</small><h2 id="k-broadcast-title">Yayın kontrolü</h2><p>Açık KALKAN pencerelerinin eşitlemesi ve ses çıkışı izlenmektedir.</p></div><button class="k-button" data-broadcast-close aria-label="Yayın kontrolünü kapat">Kapat ×</button></header><div class="k-broadcast-body" tabindex="0" aria-label="Yayın kontrol ayrıntıları"><div class="k-broadcast-verdict"><div><strong id="k-broadcast-verdict"></strong><p id="k-broadcast-context"></p></div><button class="k-button" data-broadcast-sync>Ekranları eşitle ↻</button></div><div class="k-broadcast-kpis" id="k-broadcast-kpis"></div><div class="k-broadcast-plan"><b>Yayında kullanılacak ekranlar</b><div>${VIEWS.filter(v=>v.id!=='director').map(v=>`<label><input type="checkbox" data-broadcast-required="${v.id}"> ${esc(v.name)}</label>`).join('')}</div><label><input type="checkbox" id="k-broadcast-audio-required"> Ses çıkışı gerekli</label></div><div class="k-broadcast-table-wrap"><table><thead><tr><th>İzleyici ekranı</th><th>Yayın durumu</th><th>Olay / aşama</th><th>Son eşitleme</th><th>Kumanda</th><th>Pencere</th></tr></thead><tbody id="k-broadcast-rows"></tbody></table></div><section class="k-broadcast-audio"><div><small>SES ÇIKIŞI</small><strong id="k-broadcast-audio-title"></strong><p id="k-broadcast-audio-detail"></p></div><div><button class="k-button" data-broadcast-audio>Sesi rejide aç</button><button class="k-button" data-broadcast-mute>Tüm sesleri sustur</button></div></section><p class="k-broadcast-caption">Veri kaynağı: yerel gösterim modeli. Bu kontrol, backend veya haricî Wazuh bağlantısını doğrulamamaktadır. Sekmeler aynı tarayıcı ve adreste açılmalıdır. Gösterilecek pencereler kendi monitörlerinde görünür tutulmalıdır.</p><p id="k-broadcast-feedback" role="status"></p></div></dialog>`;
  }
  function applyPlcAudienceLock(){
    const locked=!canOperatePLC();document.body.classList.toggle('k-plc-readonly',locked&&currentView==='plc');
    const chip=$('k-plc-viewer-lock');if(chip)chip.hidden=!locked;
    if(locked&&$('k-plc-controls')?.open){$('k-plc-controls').close();plcControlRegion=null;}
    document.querySelectorAll('[data-plc-pump],[data-plc-panel],[data-plc-auto]').forEach(el=>{
      if(el.namespaceURI==='http://www.w3.org/2000/svg'){
        if(locked){if(!plcReadonlyAttributes.has(el))plcReadonlyAttributes.set(el,{role:el.getAttribute('role'),tab:el.getAttribute('tabindex'),label:el.getAttribute('aria-label'),pressed:el.getAttribute('aria-pressed'),title:el.querySelector('title')?.textContent});el.setAttribute('aria-disabled','true');el.removeAttribute('tabindex');el.setAttribute('role','img');el.removeAttribute('aria-pressed');
          const tag=el.hasAttribute('data-plc-pump')?'P-0'+(Number(el.dataset.plcPump)+1):({'heat':'Sıcaklık hedefi','driveHz':'Dolum sürücüsü','valve':'Vana / kontrol'})[el.dataset.plcPanel]||'Proses değeri';
          const label=el.hasAttribute('data-plc-pump')?(plcReadonlyAttributes.get(el).title?.includes('Durdur')?'Çalışmaktadır':'Durmaktadır'):'Salt okunur';el.setAttribute('aria-label',tag+' · '+label);if(el.querySelector('title'))el.querySelector('title').textContent=tag+' · '+label;
        }else if(plcReadonlyAttributes.has(el)){const old=plcReadonlyAttributes.get(el);for(const [attr,key]of [['role','role'],['tabindex','tab'],['aria-label','label'],['aria-pressed','pressed']]){if(old[key]===null)el.removeAttribute(attr);else el.setAttribute(attr,old[key]);}el.removeAttribute('aria-disabled');if(el.querySelector('title'))el.querySelector('title').textContent=old.title;plcReadonlyAttributes.delete(el);}
      }else if(el.tagName==='BUTTON'){el.disabled=locked;el.classList.toggle('k-plc-write-button',locked);}
    });
  }
  function renderBroadcastDesk(){
    if(currentView!=='director'){if($('k-broadcast-dialog').open)$('k-broadcast-dialog').close();return;}
    const s=broadcastSummary(),audioGood=s.audio.tone==='green',button=document.querySelector('[data-broadcast-open]');
    if(button){button.textContent='Yayın kontrolü · '+s.readyCount+'/'+s.total;button.dataset.tone=s.ready?'green':'amber';}
    put('k-monitor-status',s.groups.map(g=>`<span class="k-broadcast-mini ${g.tone}" title="${esc(g.label)}">● ${esc(VIEWS.find(v=>v.id===g.view).name)}${g.ready?' ✓':''}</span>`).join(''));
    if(!$('k-broadcast-dialog').open)return;
    setText('k-broadcast-verdict',s.ready?'Yayına hazırdır.':'Yayın kontrolleri beklenmektedir.');$('k-broadcast-verdict').dataset.tone=s.ready?'green':'amber';
    setText('k-broadcast-context',liveCase().id+' · Aşama '+String(stageAt(cursorAt()).index+1).padStart(2,'0')+' / 10 · '+(state.curtain?'Bekleme ekranı':'İzleyici yayını'));
    const matching=s.groups.filter(g=>g.copies.length&&g.copies.every(c=>c.peer.health?.runId===state.runId)).length;
    const stageMatching=s.groups.filter(g=>g.copies.length&&g.copies.every(c=>c.peer.health?.stage===stageAt(cursorAt()).index)).length;
    put('k-broadcast-kpis',[[s.readyCount+' / '+s.total,'Hazır izleyici ekranı'],[matching+' / '+s.total,'Aynı olay kimliği'],[stageMatching+' / '+s.total,'Aynı aşama'],[audioGood?'✓':'!','Ses çıkışı']].map(([v,l])=>`<div><strong>${esc(v)}</strong><small>${esc(l)}</small></div>`).join(''));
    document.querySelectorAll('[data-broadcast-required]').forEach(el=>el.checked=broadcastRequired.includes(el.dataset.broadcastRequired));$('k-broadcast-audio-required').checked=broadcastAudioRequired;
    put('k-broadcast-rows',s.groups.map(g=>{
      const view=VIEWS.find(v=>v.id===g.view),copies=g.copies.length?g.copies:[null];
      return copies.map((copy,i)=>{const p=copy?.peer,h=p?.health,id=h?caseIdFor(h.runId):'—',age=copy?fmt(copy.age/1000,1)+' sn önce':'—';return `<tr><td><b>${esc(view.name)}</b>${g.copies.length>1?`<small>${i+1} / ${g.copies.length} pencere</small>`:''}</td><td><span class="k-broadcast-pill ${copy?.tone||g.tone}">${esc(copy?.label||g.label)}</span></td><td><code>${esc(id)}</code><small>${h?'Aşama '+String(h.stage+1).padStart(2,'0')+' / 10':'Durum bilgisi beklenmektedir.'}</small></td><td>${age}${h?`<small>${clock(p.seen)}</small>`:''}</td><td>${h?g.view==='plc'?(h.readOnly?'Kilitli':'Açık'):'Salt okunur':'—'}</td><td><a href="${esc(monitorURL(g.view))}" data-monitor="${g.view}" target="_blank" rel="noopener">${g.copies.length?'Yeniden aç ↗':'Ekranı aç ↗'}</a></td></tr>`;}).join('');
    }).join(''));
    setText('k-broadcast-audio-title',s.audio.label);$('k-broadcast-audio-title').dataset.tone=s.audio.tone;
    const owners=s.owners.map(p=>(p.id===windowId?'Bu reji':VIEWS.find(v=>v.id===p.view)?.name||p.view)+' · %'+Math.round(p.health.audio.volume*100));
    setText('k-broadcast-audio-detail',owners.length?owners.join(' / '):'Ses bu reji penceresinde veya bir izleyici penceresinde açılabilir.');
    const sound=sceneSound.status(),audioButton=document.querySelector('[data-broadcast-audio]');audioButton.disabled=sound.enabled;audioButton.textContent=sound.enabled?'Ses rejidedir':'Sesi rejide aç';
  }
  function openBroadcastDesk(){
    if(currentView!=='director'||audience)return;$('k-broadcast-feedback').textContent='';if(!$('k-broadcast-dialog').open)$('k-broadcast-dialog').showModal();heartbeat();send('health-request');renderBroadcastDesk();
  }
  function persistBroadcastPlan(){try{localStorage.setItem(BROADCAST_PLAN_KEY,JSON.stringify({views:broadcastRequired,audioRequired:broadcastAudioRequired}));}catch{}}
  document.body.insertAdjacentHTML('beforeend',broadcastDeskMarkup());
  document.addEventListener('click',e=>{
    if(currentView!=='director'||audience)return;
    if(e.target.closest('[data-broadcast-open]')){openBroadcastDesk();return;}
    if(e.target.closest('[data-broadcast-close]')){$('k-broadcast-dialog').close();return;}
    if(e.target.closest('[data-broadcast-sync]')){commit({},'broadcast-sync','İzleyici ekranları için eşitleme isteği gönderilmiştir.');send('sync-request');heartbeat();setText('k-broadcast-feedback','Eşitleme isteği gönderilmiştir. Ekran yanıtları kontrol edilmektedir.');return;}
    if(e.target.closest('[data-broadcast-mute]')){sceneSound.release();send('audio-silence');heartbeat();renderBroadcastDesk();setText('k-broadcast-feedback','Sesleri susturma isteği gönderilmiştir. Çıkış durumları izlenmektedir.');return;}
    if(e.target.closest('[data-broadcast-audio]')){void sceneSound.toggle().then(()=>{heartbeat();renderBroadcastDesk();});return;}
  });
  document.addEventListener('change',e=>{
    if(currentView!=='director'||audience)return;
    if(e.target.matches('[data-broadcast-required]')){const id=e.target.dataset.broadcastRequired;if(e.target.checked)broadcastRequired=[...new Set([...broadcastRequired,id])];else if(broadcastRequired.length>1)broadcastRequired=broadcastRequired.filter(v=>v!==id);else{e.target.checked=true;setText('k-broadcast-feedback','En az bir izleyici ekranı seçilmelidir.');}persistBroadcastPlan();renderBroadcastDesk();}
    if(e.target.id==='k-broadcast-audio-required'){broadcastAudioRequired=e.target.checked;persistBroadcastPlan();renderBroadcastDesk();}
  });
