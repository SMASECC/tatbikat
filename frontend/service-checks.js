  function serviceHealth(rows,phase=9){
    const field=rows.filter(s=>s.asset),lost=field.filter(s=>s.asset.destroyed),active=field.filter(s=>!s.asset.destroyed),plants=rows.filter(s=>s.plant);
    const linked=active.filter(s=>!s.offline&&s.age<3),positions=active.filter(s=>!s.offline&&s.asset.drift===0),missions=active.filter(s=>!s.offline&&!s.asset.orderChanged);
    const levels=plants.filter(s=>!s.offline&&s.age<3&&s.plant.bias<=1),parameters=plants.filter(s=>!s.offline&&s.age<3&&Math.abs(s.plant.valve-70)<.1&&Math.abs(s.plant.heat-s.plant.cfg.temp)<.1);
    const services=plants.filter(s=>!s.offline&&s.age<3&&s.plant.service>=98&&Math.abs(s.plant.temp-s.plant.cfg.temp)<4);
    const checks=[
      {key:'link',title:'Etkin saha bağlantıları',value:linked.length+' / '+active.length,ok:active.length>0&&linked.length===active.length,detail:lost.length?'Bir dron fiziksel kayıp olarak ayrı tutulmaktadır.':'Tüm saha unsurlarının paket zamanı kontrol edilmektedir.'},
      {key:'position',title:'Konum bütünlüğü',value:positions.length+' / '+active.length,ok:active.length>0&&positions.length===active.length,detail:'Bildirilen konum bağımsız kayıtla karşılaştırılmaktadır.'},
      {key:'mission',title:'Onaylı görev uyumu',value:missions.length+' / '+active.length,ok:active.length>0&&missions.length===active.length,detail:'Görev hedefleri onaylı planla karşılaştırılmaktadır.'},
      {key:'level',title:'Bağımsız ölçüm uyumu',value:levels.length+' / '+plants.length,ok:plants.length===4&&levels.length===4,detail:'HMI ve bağımsız sensör farkı en fazla 1 yüzde puandır.'},
      {key:'parameters',title:'Onaylı proses ayarları',value:parameters.length+' / '+plants.length,ok:plants.length===4&&parameters.length===4,detail:'Vana ve sıcaklık set değerleri kontrol edilmektedir.'},
      {key:'service',title:'Tesis hizmet kapasitesi',value:services.length+' / '+plants.length,ok:plants.length===4&&services.length===4,detail:'Hizmet en az %98, sıcaklık sapması en fazla 4 °C olmalıdır.'}
    ];
    return {checks,lost,active,plants,linked,clean:checks.every(c=>c.ok)};
  }
  function serviceValidation(snap,feed,at=Date.now()){
    const rows=telemetryFeedRows(feed,at),health=serviceHealth(rows,snap.stage.index);
    const samples=feed.samples.slice(-3),fresh=Math.floor(at/1000);
    const stable=samples.length===3&&samples.every((sample,j)=>sample.stage===9&&sample.bucket>=feed.verificationStartBucket&&sample.controlVersion===feed.controlVersion&&sample.bucket===samples[0].bucket+j&&fresh-sample.bucket<4&&serviceHealth([...sample.rows.values()],9).clean);
    return {...health,rows,stable,verified:snap.stage.index===9&&health.clean&&stable};
  }
