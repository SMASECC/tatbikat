
const REGION_DATA=[{"id": "karatepe", "code": "KR", "number": "01", "name": "Karatepe Üs Bölgesi", "short": "Karatepe", "terrain": "Dağlık üs bölgesi", "description": "Zırhlı devriye, üs emniyeti ve VTOL gözetlemesi", "seed": 1, "origin": [40, 32], "baseElevation": 1820, "phase": 0, "wind": "KB 12 km/sa", "visibility": "8,4 km", "accent": "#73d7cf", "palette": [48, 65, 48], "base": [560, 420], "helipad": [720, 440], "drone": [950, 250, 165, 87], "changedTarget": {"name": "DOĞU VADİSİ", "x": 1030, "y": 550}, "peaks": [[0.14, 0.18, 0.022, 0.035, 900], [0.41, 0.05, 0.028, 0.019, 680], [0.78, 0.17, 0.025, 0.022, 1040], [0.96, 0.56, 0.018, 0.045, 730], [0.53, 0.99, 0.053, 0.019, 680], [0.02, 0.8, 0.018, 0.044, 500]], "outer": [[300, 535], [430, 480], [560, 445], [650, 415], [770, 380], [855, 300], [810, 225], [680, 200], [515, 225], [400, 275], [330, 355], [300, 450]], "perimeter": [[410, 345], [510, 320], [650, 290], [790, 370], [745, 495], [525, 535], [405, 445]], "supply": [[80, 650], [220, 610], [300, 535], [430, 480], [510, 450], [430, 480], [300, 535], [220, 610]], "inner": [[500, 410], [535, 390], [580, 405], [615, 435], [650, 465], [600, 490], [540, 470]], "targets": [["KUZEY KONTROL NOKTASI", 680, 200], ["DOĞU GÖZLEM NOKTASI", 855, 300], ["İKMAL NOKTASI", 510, 450], ["KEŞİF SEKTÖRÜ", 1020, 215], ["BATI NİZAMİYE", 410, 345], ["KOMUTA BİNASI", 570, 365]], "units": [{"id": "KR-ZPT-01", "kind": "ground", "type": "Zırhlı personel taşıyıcı", "task": "Üs çevre emniyeti", "icon": "armor", "color": "#75d9ef", "label": [20, -52], "destination": "KUZEY KONTROL NOKTASI", "target": [680, 200], "speed": 6.4, "offset": 0, "values": {"fuel": 78, "engine": {"base": 81, "swing": 2, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[300, 535], [430, 480], [560, 445], [650, 415], [770, 380], [855, 300], [810, 225], [680, 200], [515, 225], [400, 275], [330, 355], [300, 450]]}, {"id": "KR-DEVR-02", "kind": "ground", "type": "4×4 zırhlı devriye aracı", "task": "Sırt hattı devriyesi", "icon": "jeep", "color": "#75d9ef", "label": [18, 20], "destination": "DOĞU GÖZLEM NOKTASI", "target": [855, 300], "speed": 7.8, "offset": 720, "values": {"fuel": 64, "engine": {"base": 84, "swing": 2, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[300, 535], [430, 480], [560, 445], [650, 415], [770, 380], [855, 300], [810, 225], [680, 200], [515, 225], [400, 275], [330, 355], [300, 450]]}, {"id": "KR-VTOL-01", "kind": "air", "type": "VTOL keşif dronu", "task": "Geniş alan gözetlemesi", "icon": "vtol", "color": "#c5afff", "label": [-170, -58], "destination": "KEŞİF SEKTÖRÜ", "target": [1020, 215], "speed": 5.5, "offset": 0, "values": {"battery": 73, "altitude": {"base": 185, "swing": 3, "rate": 0.07}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "altitude", "label": "UÇUŞ İRTİFASI", "unit": "m AGL", "digits": 0}, {"key": "battery", "label": "BATARYA", "unit": "%", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "orbit": {"cx": 950, "cy": 250, "rx": 165, "ry": 87, "rate": 0.018}}, {"id": "KR-EMN-01", "kind": "personnel", "type": "6 personel · Nizamiye emniyet timi", "task": "Nizamiye emniyet timi", "icon": "personnel", "color": "#82e5bb", "label": [-170, -36], "destination": "BATI NİZAMİYE", "target": [410, 345], "speed": 1.15, "offset": 0, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 6}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[410, 345], [510, 320], [650, 290], [790, 370], [745, 495], [525, 535], [405, 445]], "people": 6}, {"id": "KR-DEV-02", "kind": "personnel", "type": "4 personel · Yaya devriye timi", "task": "Yaya devriye timi", "icon": "personnel", "color": "#82e5bb", "label": [22, 12], "destination": "KOMUTA BİNASI", "target": [570, 365], "speed": 1.15, "offset": 145, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 4}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[500, 410], [535, 390], [580, 405], [615, 435], [650, 465], [600, 490], [540, 470]], "people": 4}, {"id": "KR-GÖZ-01", "kind": "fixed", "type": "Sabit gözetleme noktası", "task": "Doğu gözetleme noktası", "icon": "camera", "color": "#edcd8f", "label": [24, 20], "destination": "DOĞU GÖZLEM NOKTASI", "target": [835, 320], "speed": 0, "offset": 0, "values": {"pan": {"base": 42, "swing": 7, "rate": 0.025}, "voltage": 24.1, "temperature": {"base": 13.2, "swing": 0.4, "rate": 0.02}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "pan", "label": "BAKIŞ AÇISI", "unit": "°", "digits": 0}, {"key": "voltage", "label": "BESLEME", "unit": "V", "digits": 1}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "fixed": [835, 320]}], "highlight": {"label": "VTOL", "asset": "KR-VTOL-01", "key": "battery", "unit": "%"}, "heroMetrics": [{"asset": "KR-VTOL-01", "metric": {"key": "altitude", "label": "VTOL İRTİFASI", "unit": "m AGL", "digits": 0}}, {"asset": "KR-VTOL-01", "metric": {"key": "battery", "label": "VTOL BATARYASI", "unit": "%", "digits": 0}}], "mix": {"ground": 2, "air": 1, "personnel": 2, "fixed": 1}, "people": 10, "composition": "2 kara · 1 hava · 2 tim · 1 sabit"}, {"id": "akvadi", "code": "AV", "number": "02", "name": "Akvadi İleri Üs", "short": "Akvadi", "terrain": "Ormanlık vadi", "description": "Hafif arazi keşfi, köprü kontrolü ve saha haberleşmesi", "seed": 5, "origin": [39, 34], "baseElevation": 1360, "phase": 28, "wind": "B 8 km/sa", "visibility": "10,2 km", "accent": "#87b9ee", "palette": [41, 67, 61], "base": [665, 440], "helipad": [790, 465], "drone": [855, 245, 195, 90], "changedTarget": {"name": "GÜNEY VADİSİ", "x": 1040, "y": 575}, "peaks": [[0.08, 0.18, 0.024, 0.04, 990], [0.55, 0.02, 0.028, 0.018, 650], [0.86, 0.13, 0.023, 0.025, 850], [0.98, 0.65, 0.025, 0.04, 810], [0.54, 0.99, 0.06, 0.025, 500]], "outer": [[170, 575], [310, 515], [440, 470], [565, 455], [690, 425], [825, 350], [935, 275], [900, 205], [755, 170], [595, 225], [430, 270], [310, 340], [225, 440]], "perimeter": [[500, 345], [720, 300], [865, 410], [800, 535], [575, 570], [465, 460]], "supply": [[85, 650], [170, 575], [310, 515], [440, 470], [580, 455], [440, 470], [310, 515], [170, 575]], "inner": [[575, 405], [625, 380], [685, 410], [735, 460], [705, 505], [625, 500], [575, 455]], "targets": [["VADİ GEÇİŞ NOKTASI", 310, 340], ["KUZEY GÖZLEM NOKTASI", 900, 205], ["İLERİ İKMAL NOKTASI", 580, 455], ["VADİ GÖZETLEME SEKTÖRÜ", 1015, 200], ["ÜS BATI GİRİŞİ", 500, 345], ["İLERİ KOMUTA BİNASI", 665, 390]], "units": [{"id": "AV-4X4-01", "kind": "ground", "type": "Hafif arazi keşif aracı", "task": "Vadi yol devriyesi", "icon": "jeep", "color": "#75d9ef", "label": [20, -52], "destination": "VADİ GEÇİŞ NOKTASI", "target": [310, 340], "speed": 5.5, "offset": 0, "values": {"fuel": 71, "engine": {"base": 77, "swing": 2, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[170, 575], [310, 515], [440, 470], [565, 455], [690, 425], [825, 350], [935, 275], [900, 205], [755, 170], [595, 225], [430, 270], [310, 340], [225, 440]]}, {"id": "AV-ATV-02", "kind": "ground", "type": "ATV arazi aracı", "task": "Orman kenarı keşfi", "icon": "atv", "color": "#75d9ef", "label": [20, 22], "destination": "KUZEY GÖZLEM NOKTASI", "target": [900, 205], "speed": 3.5, "offset": 230, "values": {"fuel": 62, "engine": {"base": 66, "swing": 2, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[500, 345], [720, 300], [865, 410], [800, 535], [575, 570], [465, 460]]}, {"id": "AV-MİNİ-01", "kind": "air", "type": "Mini keşif dronu", "task": "Vadi ve köprü gözetlemesi", "icon": "quadcopter", "color": "#c5afff", "label": [-170, -58], "destination": "VADİ GÖZETLEME SEKTÖRÜ", "target": [1015, 200], "speed": 5.5, "offset": 0, "values": {"battery": 82, "altitude": {"base": 86, "swing": 2, "rate": 0.07}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "altitude", "label": "UÇUŞ İRTİFASI", "unit": "m AGL", "digits": 0}, {"key": "battery", "label": "BATARYA", "unit": "%", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "orbit": {"cx": 855, "cy": 245, "rx": 195, "ry": 90, "rate": 0.009}}, {"id": "AV-KEŞ-01", "kind": "personnel", "type": "5 personel · Yaya keşif timi", "task": "Yaya keşif timi", "icon": "personnel", "color": "#82e5bb", "label": [-172, -45], "destination": "ÜS BATI GİRİŞİ", "target": [500, 345], "speed": 1.15, "offset": 340, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 5}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[500, 345], [720, 300], [865, 410], [800, 535], [575, 570], [465, 460]], "people": 5}, {"id": "AV-KÖP-02", "kind": "personnel", "type": "3 personel · Köprü kontrol timi", "task": "Köprü kontrol timi", "icon": "personnel", "color": "#82e5bb", "label": [-168, 20], "destination": "VADİ GEÇİŞ NOKTASI", "target": [310, 340], "speed": 1.15, "offset": 15, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 3}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[310, 340], [345, 322], [375, 305], [345, 322]], "people": 3}, {"id": "AV-SNS-01", "kind": "fixed", "type": "Köprü ve dere sensörü", "task": "Köprü sensör noktası", "icon": "sensor", "color": "#edcd8f", "label": [20, -58], "destination": "KÖPRÜ SENSÖR NOKTASI", "target": [355, 390], "speed": 0, "offset": 0, "values": {"waterLevel": {"base": 1.24, "swing": 0.03, "rate": 0.02}, "temperature": {"base": 16.3, "swing": 0.3, "rate": 0.025}, "battery": 94, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "waterLevel", "label": "SU SEVİYESİ", "unit": "m", "digits": 2}, {"key": "temperature", "label": "SICAKLIK", "unit": "°C", "digits": 1}, {"key": "battery", "label": "BATARYA", "unit": "%", "digits": 0}], "fixed": [355, 390]}, {"id": "AV-RÖLE-01", "kind": "fixed", "type": "Saha haberleşme rölesi", "task": "Vadi haberleşme rölesi", "icon": "relay", "color": "#edcd8f", "label": [-170, -30], "destination": "VADI HABERLEŞME RÖLESI", "target": [990, 115], "speed": 0, "offset": 0, "values": {"battery": 88, "voltage": 12.6, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}, {"key": "battery", "label": "BATARYA", "unit": "%", "digits": 0}, {"key": "voltage", "label": "BESLEME", "unit": "V", "digits": 1}], "fixed": [990, 115]}], "highlight": {"label": "MİNİ DRON", "asset": "AV-MİNİ-01", "key": "battery", "unit": "%"}, "heroMetrics": [{"asset": "AV-MİNİ-01", "metric": {"key": "altitude", "label": "MİNİ DRON İRTİFASI", "unit": "m AGL", "digits": 0}}, {"asset": "AV-SNS-01", "metric": {"key": "waterLevel", "label": "DERE SEVİYESİ", "unit": "m", "digits": 2}}], "mix": {"ground": 2, "air": 1, "personnel": 2, "fixed": 2}, "people": 8, "composition": "2 kara · 1 hava · 2 tim · 2 sabit"}, {"id": "sarpgecit", "code": "SG", "number": "03", "name": "Sarp Geçit", "short": "Sarp Geçit", "terrain": "Yüksek dağ geçidi", "description": "Yol kontrolü, kurtarma, geçit bakımı ve termal gözetleme", "seed": 12, "origin": [38, 36], "baseElevation": 2170, "phase": 61, "wind": "KD 22 km/sa", "visibility": "6,2 km", "accent": "#d6bd88", "palette": [73, 66, 51], "base": [595, 405], "helipad": [700, 435], "drone": [885, 250, 175, 98], "changedTarget": {"name": "BATI YAMAÇ NOKTASI", "x": 285, "y": 555}, "peaks": [[0.14, 0.35, 0.02, 0.08, 1110], [0.3, 0.08, 0.02, 0.02, 700], [0.78, 0.28, 0.03, 0.07, 1150], [0.94, 0.8, 0.028, 0.04, 820], [0.18, 0.96, 0.03, 0.02, 550]], "outer": [[540, 645], [600, 565], [640, 485], [610, 420], [555, 360], [585, 290], [645, 225], [620, 145], [560, 105], [510, 170], [535, 255], [480, 345], [500, 445], [460, 535]], "perimeter": [[495, 340], [625, 300], [745, 360], [720, 475], [565, 510], [470, 435]], "supply": [[540, 690], [540, 645], [600, 565], [640, 485], [610, 420], [585, 385], [610, 420], [640, 485], [600, 565], [540, 645]], "inner": [[535, 390], [580, 365], [630, 390], [665, 435], [620, 475], [555, 455]], "targets": [["KUZEY GEÇİT NOKTASI", 620, 145], ["GÜNEY YOL KONTROLÜ", 600, 565], ["GEÇİT İKMAL NOKTASI", 585, 385], ["SIRT GÖZETLEME SEKTÖRÜ", 1015, 210], ["BATI GÖZETLEME NOKTASI", 495, 340], ["GEÇİT KOMUTA NOKTASI", 595, 370]], "units": [{"id": "SG-YOL-01", "kind": "ground", "type": "4×4 yol kontrol aracı", "task": "Geçit yol kontrolü", "icon": "jeep", "color": "#75d9ef", "label": [-172, -50], "destination": "KUZEY GEÇİT NOKTASI", "target": [620, 145], "speed": 5.2, "offset": 0, "values": {"fuel": 75, "engine": {"base": 78, "swing": 2, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[540, 645], [600, 565], [640, 485], [610, 420], [555, 360], [585, 290], [645, 225], [620, 145], [560, 105], [510, 170], [535, 255], [480, 345], [500, 445], [460, 535]]}, {"id": "SG-KUR-02", "kind": "ground", "type": "Arazi tipi kurtarıcı", "task": "Yol ve araç kurtarma", "icon": "recovery", "color": "#75d9ef", "label": [22, -45], "destination": "GÜNEY YOL KONTROLÜ", "target": [600, 565], "speed": 4.2, "offset": 610, "values": {"fuel": 81, "engine": {"base": 79, "swing": 2, "rate": 0.1}, "winchLoad": 12, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "winchLoad", "label": "VİNÇ YÜKÜ", "unit": "%", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[540, 645], [600, 565], [640, 485], [610, 420], [555, 360], [585, 290], [645, 225], [620, 145], [560, 105], [510, 170], [535, 255], [480, 345], [500, 445], [460, 535]]}, {"id": "SG-BAK-03", "kind": "ground", "type": "Paletli yol bakım aracı", "task": "Geçit yol bakımı", "icon": "dozer", "color": "#75d9ef", "label": [20, 20], "destination": "GEÇİT İKMAL NOKTASI", "target": [585, 385], "speed": 1.8, "offset": 110, "values": {"fuel": 72, "engine": {"base": 82, "swing": 2, "rate": 0.1}, "hydraulic": {"base": 158, "swing": 4, "rate": 0.08}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "hydraulic", "label": "HİDROLİK", "unit": "bar", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}], "route": [[610, 420], [640, 485], [600, 565], [640, 485], [610, 420], [555, 360]]}, {"id": "SG-GEÇ-01", "kind": "personnel", "type": "4 personel · Geçit kontrol timi", "task": "Geçit kontrol timi", "icon": "personnel", "color": "#82e5bb", "label": [-172, -38], "destination": "BATI GÖZETLEME NOKTASI", "target": [495, 340], "speed": 1.15, "offset": 130, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 4}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[495, 340], [625, 300], [745, 360], [720, 475], [565, 510], [470, 435]], "people": 4}, {"id": "SG-DAĞ-02", "kind": "personnel", "type": "3 personel · Dağ gözetleme timi", "task": "Dağ gözetleme timi", "icon": "personnel", "color": "#82e5bb", "label": [-172, 20], "destination": "KUZEY GEÇİT NOKTASI", "target": [620, 145], "speed": 1.15, "offset": 800, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 3}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[540, 645], [600, 565], [640, 485], [610, 420], [555, 360], [585, 290], [645, 225], [620, 145], [560, 105], [510, 170], [535, 255], [480, 345], [500, 445], [460, 535]], "people": 3}, {"id": "SG-TRM-01", "kind": "fixed", "type": "Termal gözlem noktası", "task": "Kuzey termal gözlem noktası", "icon": "thermal", "color": "#edcd8f", "label": [22, -45], "destination": "KUZEY TERMAL GÖZLEM NOKTASI", "target": [668, 200], "speed": 0, "offset": 0, "values": {"pan": {"base": 28, "swing": 6, "rate": 0.025}, "temperature": {"base": -4.2, "swing": 0.4, "rate": 0.02}, "voltage": 24.2, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "pan", "label": "BAKIŞ AÇISI", "unit": "°", "digits": 0}, {"key": "temperature", "label": "SICAKLIK", "unit": "°C", "digits": 1}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "fixed": [668, 200]}], "highlight": {"label": "TERMAL", "asset": "SG-TRM-01", "key": "signal", "unit": "%"}, "heroMetrics": [{"asset": "SG-TRM-01", "metric": {"key": "temperature", "label": "GEÇİT SICAKLIĞI", "unit": "°C", "digits": 1}}, {"asset": "SG-TRM-01", "metric": {"key": "signal", "label": "TERMAL SİNYAL", "unit": "%", "digits": 0}}], "mix": {"ground": 3, "air": 0, "personnel": 2, "fixed": 1}, "people": 7, "composition": "3 kara · 2 tim · 1 sabit"}, {"id": "guneyova", "code": "GO", "number": "04", "name": "Güneyova İkmal Bölgesi", "short": "Güneyova", "terrain": "Dağ eteği ve plato", "description": "Yük ve akaryakıt sevki, depo hizmetleri, sağlık ve enerji desteği", "seed": 19, "origin": [37, 33], "baseElevation": 1090, "phase": 105, "wind": "KB 10 km/sa", "visibility": "12,0 km", "accent": "#c0afd9", "palette": [72, 72, 49], "base": [565, 455], "helipad": [770, 495], "drone": [905, 245, 175, 95], "changedTarget": {"name": "DOĞU SERVİS YOLU", "x": 1060, "y": 575}, "peaks": [[0.1, 0.12, 0.028, 0.03, 650], [0.42, 0.01, 0.035, 0.012, 630], [0.79, 0.08, 0.035, 0.02, 850], [0.98, 0.57, 0.014, 0.04, 570], [0.49, 1.03, 0.07, 0.024, 450]], "outer": [[160, 585], [320, 535], [470, 495], [620, 455], [790, 405], [930, 345], [1020, 245], [900, 170], [710, 175], [550, 240], [400, 290], [260, 360], [175, 470]], "perimeter": [[330, 340], [630, 290], [850, 365], [820, 550], [480, 610], [300, 480]], "supply": [[70, 660], [160, 585], [320, 535], [470, 495], [540, 475], [470, 495], [320, 535], [160, 585]], "inner": [[430, 420], [520, 385], [620, 400], [710, 455], [640, 540], [520, 555], [425, 495]], "targets": [["KUZEY SEVK NOKTASI", 710, 175], ["DOĞU YOL KONTROLÜ", 930, 345], ["ANA İKMAL DEPOSU", 540, 475], ["PLATO GÖZETLEME SEKTÖRÜ", 1040, 210], ["İKMAL NİZAMİYE", 330, 340], ["LOJİSTİK KOMUTA BİNASI", 565, 390]], "units": [{"id": "GO-YÜK-01", "kind": "ground", "type": "6×6 yük kamyonu", "task": "Ana depo ikmal sevki", "icon": "truck", "color": "#75d9ef", "label": [20, -52], "destination": "KUZEY SEVK NOKTASI", "target": [710, 175], "speed": 5.5, "offset": 0, "values": {"fuel": 83, "engine": {"base": 80, "swing": 2, "rate": 0.1}, "cargo": 68, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "cargo", "label": "YÜK DOLULUĞU", "unit": "%", "digits": 0}, {"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}], "route": [[160, 585], [320, 535], [470, 495], [620, 455], [790, 405], [930, 345], [1020, 245], [900, 170], [710, 175], [550, 240], [400, 290], [260, 360], [175, 470]]}, {"id": "GO-TNK-02", "kind": "ground", "type": "Akaryakıt tankeri", "task": "Akaryakıt sevki", "icon": "tanker", "color": "#75d9ef", "label": [-172, 22], "destination": "ANA İKMAL DEPOSU", "target": [540, 475], "speed": 4.7, "offset": 290, "values": {"fuel": 86, "engine": {"base": 78, "swing": 2, "rate": 0.1}, "tank": 76, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "tank", "label": "TANK DOLUMU", "unit": "%", "digits": 0}, {"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[70, 660], [160, 585], [320, 535], [470, 495], [540, 475], [470, 495], [320, 535], [160, 585]]}, {"id": "GO-AMB-03", "kind": "ground", "type": "Arazi tipi ambulans", "task": "Sağlık desteği", "icon": "ambulance", "color": "#75d9ef", "label": [22, 18], "destination": "DOĞU YOL KONTROLÜ", "target": [930, 345], "speed": 6.1, "offset": 1150, "values": {"fuel": 91, "engine": {"base": 76, "swing": 2, "rate": 0.1}, "equipment": 95, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "equipment", "label": "DONANIM ŞARJI", "unit": "%", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[160, 585], [320, 535], [470, 495], [620, 455], [790, 405], [930, 345], [1020, 245], [900, 170], [710, 175], [550, 240], [400, 290], [260, 360], [175, 470]]}, {"id": "GO-FRK-04", "kind": "ground", "type": "Elektrikli forklift", "task": "Depo yükleme ve boşaltma", "icon": "forklift", "color": "#75d9ef", "label": [-172, -55], "destination": "ANA İKMAL DEPOSU", "target": [540, 475], "speed": 1.25, "offset": 70, "values": {"battery": 81, "load": 35, "engine": {"base": 42, "swing": 1, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "battery", "label": "BATARYA", "unit": "%", "digits": 0}, {"key": "load", "label": "KALDIRMA YÜKÜ", "unit": "%", "digits": 0}, {"key": "engine", "label": "MOTOR", "unit": "°C", "digits": 0}], "route": [[500, 480], [535, 460], [575, 465], [610, 500], [575, 535], [530, 525]]}, {"id": "GO-ÇEK-05", "kind": "ground", "type": "Arazi tipi çekici", "task": "İkmal araçlarına teknik destek", "icon": "recovery", "color": "#75d9ef", "label": [22, -48], "destination": "DOĞU YOL KONTROLÜ", "target": [930, 345], "speed": 4.5, "offset": 770, "values": {"fuel": 79, "engine": {"base": 81, "swing": 2, "rate": 0.1}, "winchLoad": 8, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}, {"key": "winchLoad", "label": "VİNÇ YÜKÜ", "unit": "%", "digits": 0}, {"key": "signal", "label": "SİNYAL", "unit": "%", "digits": 0}], "route": [[160, 585], [320, 535], [470, 495], [620, 455], [790, 405], [930, 345], [1020, 245], [900, 170], [710, 175], [550, 240], [400, 290], [260, 360], [175, 470]]}, {"id": "GO-İKM-01", "kind": "personnel", "type": "6 personel · İkmal timi", "task": "İkmal timi", "icon": "personnel", "color": "#82e5bb", "label": [24, 12], "destination": "LOJİSTİK KOMUTA BİNASI", "target": [565, 390], "speed": 1.15, "offset": 100, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 6}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[430, 420], [520, 385], [620, 400], [710, 455], [640, 540], [520, 555], [425, 495]], "people": 6}, {"id": "GO-SĞL-02", "kind": "personnel", "type": "3 personel · Sağlık timi", "task": "Sağlık timi", "icon": "personnel", "color": "#82e5bb", "label": [-172, 20], "destination": "LOJİSTİK KOMUTA BİNASI", "target": [565, 390], "speed": 1.15, "offset": 30, "values": {"heart": {"base": 88, "swing": 4, "rate": 0.1}, "signal": {"base": 96, "swing": 2, "rate": 0.13}, "people": 3}, "metrics": [{"key": "people", "label": "TİM MEVCUDU", "unit": "kişi", "digits": 0}, {"key": "heart", "label": "ORT. NABIZ", "unit": "atım/dk", "digits": 0}, {"key": "signal", "label": "TELSİZ", "unit": "%", "digits": 0}], "route": [[430, 420], [470, 405], [500, 420], [475, 445], [435, 445]], "people": 3}, {"id": "GO-JEN-01", "kind": "fixed", "type": "Saha jeneratörü", "task": "İkmal bölgesi enerji noktası", "icon": "generator", "color": "#edcd8f", "label": [22, 20], "destination": "İKMAL BÖLGESI ENERJI NOKTASI", "target": [665, 550], "speed": 0, "offset": 0, "values": {"load": {"base": 62, "swing": 2, "rate": 0.035}, "power": {"base": 28, "swing": 0.6, "rate": 0.035}, "fuel": 86, "voltage": 230, "signal": {"base": 96, "swing": 2, "rate": 0.13}}, "metrics": [{"key": "power", "label": "GÜÇ", "unit": "kW", "digits": 1}, {"key": "load", "label": "YÜK", "unit": "%", "digits": 0}, {"key": "fuel", "label": "YAKIT", "unit": "%", "digits": 0}], "fixed": [665, 550]}], "highlight": {"label": "JEN. YÜK", "asset": "GO-JEN-01", "key": "load", "unit": "%"}, "heroMetrics": [{"asset": "GO-TNK-02", "metric": {"key": "tank", "label": "AKARYAKIT DOLUMU", "unit": "%", "digits": 0}}, {"asset": "GO-JEN-01", "metric": {"key": "load", "label": "JENERATÖR YÜKÜ", "unit": "%", "digits": 0}}], "mix": {"ground": 5, "air": 0, "personnel": 2, "fixed": 1}, "people": 9, "composition": "5 kara · 2 tim · 1 sabit"}];
'use strict';
(() => {
  // Standalone presentation model. No network or device operations are performed.
  const $ = id => document.getElementById(id);
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const formats = new Map();
  const fmt = (n, d = 0) => {
    if (!Number.isFinite(n)) return '—';
    if (!formats.has(d)) formats.set(d, new Intl.NumberFormat('tr-TR', {minimumFractionDigits:d, maximumFractionDigits:d}));
    return formats.get(d).format(n);
  };
  const clockFormat = new Intl.DateTimeFormat('tr-TR', {timeZone:'Europe/Istanbul', hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false});
  const clock = value => clockFormat.format(value);
  const mmss = s => `${String(Math.floor(Math.max(0,s)/60)).padStart(2,'0')}:${String(Math.floor(Math.max(0,s)%60)).padStart(2,'0')}`;
  const cap = (n, a, b) => Math.min(b, Math.max(a,n));
  const ph=p=>'-'+((performance.now()/1000)%p).toFixed(2)+'s';
  const lastPos=new Map();
  const markupCache = new WeakMap();
  const put = (id, html) => {const node=$(id); if (!node || markupCache.get(node) === html) return;const active=node.contains(document.activeElement)?document.activeElement?.closest('[data-asset],[data-tlm-source],[data-tlm-select],[data-tlm-region],[data-map-plc]'):null;const attribute=['data-tlm-source','data-tlm-select','data-tlm-region','data-map-plc','data-asset'].find(k=>active?.hasAttribute(k))||'data-asset';const focused=active?.getAttribute(attribute);node.innerHTML=html;markupCache.set(node,html);if(focused)node.querySelector(`[${attribute}="${CSS.escape(focused)}"]`)?.focus({preventScroll:true});};
  const setText = (id, value) => {const node=$(id); if(node && node.textContent !== String(value)) node.textContent=value;};
  const iconPaths = {
    command:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
    operations:'<path d="m3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2V5Z M9 3v16m6-14v16"/>',
    plc:'<rect x="7" y="7" width="10" height="10" rx="1"/><path d="M9 2v5m6-5v5M9 17v5m6-5v5M2 9h5m-5 6h5m10-6h5m-5 6h5M10 10h4v4h-4z"/>',
    events:'<circle cx="5" cy="5" r="2"/><circle cx="5" cy="12" r="2"/><circle cx="5" cy="19" r="2"/><path d="M10 5h11M10 12h11M10 19h11M5 7v3m0 4v3"/>',
    telemetry:'<path d="M2 12h4l3-7 5 14 3-7h5"/><path d="M3 3h18M3 21h18" opacity=".4"/>',
    director:'<path d="M4 5h16M4 12h16M4 19h16"/><circle cx="8" cy="5" r="2" fill="var(--bg)"/><circle cx="16" cy="12" r="2" fill="var(--bg)"/><circle cx="11" cy="19" r="2" fill="var(--bg)"/>',
    fullscreen:'<path d="M8 3H3v5m13-5h5v5M3 16v5h5m8 0h5v-5"/>',
    shield:'<path d="m12 2 9 4v6c0 5-5 8-9 10-4-2-9-5-9-10V6l9-4Z"/><path d="m8 12 3 3 5-6"/>',
    alert:'<path d="m12 3 10 18H2L12 3Z"/><path d="M12 9v5m0 3v.1"/>',
    link:'<path d="m9 15 6-6m-7 8-2 2a4 4 0 0 1-5-5l4-4a4 4 0 0 1 6 0m2 4a4 4 0 0 0 6 0l4-4a4 4 0 0 0-6-5l-2 2"/>',
    ground:'<path d="M3 16V9l4-5h10l4 5v7H3zm0-6h18M8 4v6m8-6v6"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>',
    air:'<path d="m6 6 12 12M6 18 18 6"/><rect x="9" y="8" width="6" height="8" rx="1"/><circle cx="4" cy="4" r="3"/><circle cx="20" cy="4" r="3"/><circle cx="4" cy="20" r="3"/><circle cx="20" cy="20" r="3"/>',
    personnel:'<circle cx="12" cy="5" r="3"/><path d="M7 22v-8a5 5 0 0 1 10 0v8m-5-8v8M3 13v7m18-7v7"/>',
    fixed:'<path d="M12 3 5 22h14L12 3Zm-4 10h8m-10 5h12M3 5a12 12 0 0 0 0 10m18-10a12 12 0 0 1 0 10"/>',
    monitor:'<rect x="2" y="3" width="20" height="14" rx="1"/><path d="M12 17v4m-5 0h10"/>'
  };
  const icon = name => `<svg class="k-icon" viewBox="0 0 24 24" aria-hidden="true">${iconPaths[name] || iconPaths.command}</svg>`;
  const VIEWS = [{id:'command',name:'Komuta özeti',label:'KOMUTA ÖZETİ',no:'01'}, {id:'operations',name:'Harekât resmi',label:'HAREKÂT RESMİ',no:'02'}, {id:'plc',name:'Tesis / PLC',label:'TESİS KONTROLÜ',no:'03'}, {id:'events',name:'Olay akışı',label:'OLAY AKIŞI',no:'04'}, {id:'telemetry',name:'Telemetri',label:'TELEMETRİ DURUMU',no:'05'}, {id:'director',name:'Reji',label:'REJİ',no:'R'}];
  const STAGES = [
  {
    "short": "Başlangıç",
    "name": "Normal işletim",
    "tone": "green",
    "phase": "Gözlem",
    "headline": "Dört bölge izlenmektedir",
    "detail": "27 saha unsuru ve dört tesisin bağlantısı aktiftir. Konum, görev ve proses değerleri onaylı kayıtlarla eşleşmektedir.",
    "target": "Dört bölge",
    "effect": "Saha ve tesis hizmetleri normal işletimdedir.",
    "cause": "Başlangıç kontrolü",
    "evidence": "27 saha unsuru · 4 tesis · Uyumlu kayıtlar",
    "action": "Başlangıç değerlerini ve bağımsız doğrulama kontrollerini gösteriniz.",
    "screen": "01 · Komuta özeti / Haricî Wazuh",
    "narration": "Komuta Kontrol Merkezi, 27 saha unsurunun ve dört tesisin verilerini izlemektedir. Harici veriler DMZ’deki kabul servisinden alınmaktadır. İç hizmet ağı ve saha ağı ayrı tutulmaktadır. Mavi takım, Wazuh üzerinden başlangıç kayıtlarını incelemektedir. Konum, görev ve proses değerleri bağımsız kayıtlarla karşılaştırılmaktadır.",
    "seconds": 30
  },
  {
    "short": "Erişim",
    "name": "DMZ’den yetkisiz erişim",
    "tone": "amber",
    "phase": "Erişim",
    "headline": "Entegrasyon hizmetine yetkisiz erişilmiştir",
    "detail": "DMZ’deki servis ihlalinin ardından entegrasyon hesabıyla iç hizmet ağına erişim sağlanmıştır.",
    "target": "Veri entegrasyon hizmeti",
    "effect": "Komuta verilerinin bütünlüğü risk altındadır.",
    "cause": "DMZ servisi ihlali, yetki yükseltme ve servis kimliğinin kötüye kullanılması",
    "evidence": "Entegrasyon erişim uyarısı · Saha bağlantıları aktiftir",
    "action": "Wazuh üzerinde erişim zincirini ve güvenlik duvarı iznini ilişkilendiriniz.",
    "screen": "Haricî Wazuh · DMZ, ağ ve SSH kayıtları",
    "narration": "Kırmızı takım, DMZ’deki veri kabul servisinin zafiyetinden yararlanarak erişim sağlamaktadır. Yerel yetki yükseltmenin ardından servis hesabına ait SSH anahtarı elde edilmektedir. Pivot kanalı ve mevcut ağ izni kullanılarak iç entegrasyon sunucusuna geçilmektedir. Mavi takım, web, süreç, güvenlik duvarı ve SSH kayıtlarını Wazuh üzerinde ilişkilendirmektedir.",
    "seconds": 30
  },
  {
    "short": "Konum",
    "name": "Konum saptırma",
    "tone": "red",
    "phase": "Bütünlük",
    "headline": "Devriyenin konumu 650 m saptırılmıştır",
    "detail": "KR-ZPT-01’in bildirilen konumu ile bağımsız konum kaydı arasında 650 m fark bulunmaktadır.",
    "target": "KR-ZPT-01 / Konum",
    "effect": "Komuta resmi manipüle edilmiş konumu göstermektedir.",
    "cause": "Bildirilen konum kaydının manipülasyonu",
    "evidence": "Bildirilen / referans konum farkı: 650 m",
    "action": "Bildirilen konum ile bağımsız konum kaydını karşılaştırınız.",
    "screen": "02 · Harekât resmi / Haricî Wazuh",
    "narration": "KR-ZPT-01’in bildirilen konumu 650 metre saptırılmıştır. Bağımsız konum kaydı korunmaktadır. Mavi takım, yetkisiz değişikliği entegrasyon sunucusundaki oturum ve uygulama hesabıyla ilişkilendirmektedir. Konum sapması veri bütünlüğü bulgusudur. IOC listesine alınacak göstergeler, ilgili erişim ve işlem kayıtlarıyla doğrulanmaktadır.",
    "seconds": 30
  },
  {
    "short": "Görev",
    "name": "Görev yönlendirme",
    "tone": "red",
    "phase": "Bütünlük",
    "headline": "Görev kayıtları değiştirilmiştir",
    "detail": "Karatepe’de araç ve timler yetkisiz değiştirilen hedeflere yönelmektedir. Gözetleme noktasının bakış yönü değiştirilmiştir.",
    "target": "Karatepe / Görev kayıtları",
    "effect": "Unsurlar onaylı görev planından sapmaktadır.",
    "cause": "Görev kaydının değiştirilmesi ve görev yürütme etkisi",
    "evidence": "Kırmızı hedefler ve değişen hareket güzergâhları",
    "action": "Onaylı görev hedeflerini ve yetkisiz değişiklikleri gösteriniz.",
    "screen": "02 · Harekât resmi / Haricî Wazuh",
    "narration": "Karatepe’de beş unsurun görev hedefleri değiştirilmiştir. Görev yürütme bileşeni, unsurları farklı hedeflere yönlendirmektedir. Mavi takım, entegrasyon hesabının yazma yetkilerini ve uygulama kayıtlarını incelemektedir. Değişiklikler onaylı görev planıyla karşılaştırılmaktadır. Oturum, kaynak sunucu ve işlem sırası birlikte değerlendirilmektedir.",
    "seconds": 30
  },
  {
    "short": "Ölçüm",
    "name": "PLC ölçüm yanıltma",
    "tone": "red",
    "phase": "Bütünlük",
    "headline": "Tesisin seviye verisi manipüle edilmiştir",
    "detail": "LT-01 yaklaşık %88 göstermektedir. Bağımsız LT-02 yaklaşık %58 ölçmektedir.",
    "target": "GO-PLC-01 / LT-01",
    "effect": "Dolum kararı manipüle edilmiş ölçüme dayanmaktadır.",
    "cause": "HMI gösterim verisinin manipülasyonu",
    "evidence": "LT-01 / LT-02 farkı: 30 puan",
    "action": "HMI değerini bağımsız LT-02 ölçümüyle karşılaştırınız.",
    "screen": "03 · Tesis / PLC / Haricî Wazuh",
    "narration": "Güneyova’nın HMI seviye verisi manipüle edilmiştir. LT-01 yüzde 88 gösterirken bağımsız LT-02 yüzde 58 ölçmektedir. Mavi takım, HMI ve uygulama kayıtlarını inceleyerek 30 yüzde puanlık farkın kaynağını araştırmaktadır. Gösterim verisindeki değişiklik ile fiziksel proses üzerindeki etki ayrı değerlendirilmektedir.",
    "seconds": 30
  },
  {
    "short": "Proses",
    "name": "Vana ve ısı müdahalesi",
    "tone": "red",
    "phase": "Etki",
    "headline": "Proses parametreleri değiştirilmiştir",
    "detail": "Yetkisiz PLC komutlarıyla vana açıklığı %15’e düşürülmüştür. Sıcaklık set değeri 82 °C’ye yükseltilmiştir.",
    "target": "GO-PLC-01 / V-01",
    "effect": "Dağıtım kapasitesi normalin %26’sına düşmüştür.",
    "cause": "PLC kumanda kanalında yetkisiz parametre değişikliği",
    "evidence": "Vana %70 → %15 · Hedef 48 → 82 °C",
    "action": "PLC komutlarını, hesap yetkilerini ve izinli komut listesini inceleyiniz.",
    "screen": "03 · Tesis / PLC / Haricî Wazuh",
    "narration": "Yetkisiz PLC komutları, vana açıklığını yüzde 15’e düşürmüş ve sıcaklık set değerini 82 dereceye yükseltmiştir. Hizmet kapasitesi yüzde 26’ya düşmüştür. Mavi takım, entegrasyon hesabının komut yetkisini ve uygulama geçidini incelemektedir. Yetkisiz işlemler ilgili hesap, ağ ve uygulama kontrollerinde engellenmektedir.",
    "seconds": 30
  },
  {
    "short": "Saha etkisi",
    "name": "Dron kaybı ve telsiz kesintisi",
    "tone": "red",
    "phase": "Etki",
    "headline": "Dron ve haberleşme kaybı oluşmuştur",
    "detail": "Karatepe’de dron kontrol kaybıyla düşmektedir. Telsiz bağlantıları ve Güneyova’nın uzak HMI veri akışı kesilmiştir.",
    "target": "KR-VTOL-01 + saha telsizleri",
    "effect": "Dron imha olmuştur. Saha verilerine erişim kesilmiştir.",
    "cause": "Komuta kontrol ve haberleşme bağlantılarının kesilmesi",
    "evidence": "Dron imha kaydı · Telsiz kesintisi · HMI zaman aşımı",
    "action": "Karatepe’deki fiziksel kaybı gösteriniz. Ardından HMI son paket zamanını kontrol ediniz.",
    "screen": "02 + 05 · Harekât / Telemetri / Haricî Wazuh",
    "narration": "Karatepe’de dronun komuta ve kontrol bağlantısı kesilmiştir. Kontrol kaybı dronun düşmesine neden olmaktadır. Telsiz bağlantıları ve Güneyova’nın uzak HMI veri akışı kesilmiştir. Mavi takım, son paket zamanını, bağlantı loglarını ve bağımsız gözlemi birlikte incelemektedir. Kesintinin kaynağı, elde edilen kanıtlarla değerlendirilmektedir.",
    "seconds": 30
  },
  {
    "short": "Müdahale",
    "name": "Saldırının kontrol altına alınması",
    "tone": "amber",
    "phase": "Müdahale",
    "headline": "Yeni yetkisiz komutlar engellenmiştir",
    "detail": "Şüpheli erişim yolu kapatılmıştır. Yeni yetkisiz komutlar engellenmiştir. Değiştirilmiş kayıtlar henüz geri yüklenmemiştir.",
    "target": "DMZ + KKBS entegrasyonu + tesis",
    "effect": "Yeni yetkisiz değişiklikler engellenmiştir.",
    "cause": "Servis kimliğinin iptali, pivotun kesilmesi ve erişim kuralının kaldırılması",
    "evidence": "Oturum iptali · Hizmet %58 · Bütünlük ihlalleri sürmektedir",
    "action": "Mavi takımın engelleme sonucunu teyit ettikten sonra gösterimi ilerletiniz.",
    "screen": "Haricî Wazuh / İlgili yönetim araçları",
    "narration": "DMZ’deki ihlal edilen servis izole edilmektedir. Mavi takım, servis hesabının SSH anahtarını iptal etmekte, pivot bağlantısını kesmekte ve eski SSH erişim kuralını kaldırmaktadır. Yetkisiz uygulama oturumları sonlandırılmaktadır. Yeni komutların engellendiği Wazuh kayıtlarıyla doğrulanmaktadır. Bozulmuş konum, görev ve proses kayıtları geri yükleme için korunmaktadır.",
    "seconds": 30
  },
  {
    "short": "Geri yükleme",
    "name": "Onaylı kayıtların geri yüklenmesi",
    "tone": "amber",
    "phase": "Doğrulama",
    "headline": "Onaylı kayıt ve ayarlar geri yüklenmiştir",
    "detail": "Konum ve görev kayıtları onaylı planla eşleşmektedir. LT-01 ve LT-02 uyumludur. Hizmet kapasitesi %88’dir.",
    "target": "Etkin unsurlar + LT-02",
    "effect": "Tesis kapasitesi %88’e ulaşmıştır.",
    "cause": "Onaylı kayıtların geri yüklenmesi",
    "evidence": "Konum farkı 0 m · Vana %70 · Hedef 48 °C · Hizmet %88",
    "action": "Mavi takımın geri yükleme ve izleme sonucunu teyit ediniz.",
    "screen": "03 + 05 · Tesis / Telemetri / Haricî Wazuh",
    "narration": "Adli izler korunduktan sonra yetkisiz SSH anahtarları kaldırılmaktadır. Servis zafiyeti giderilmekte, yerel sudo ve uygulama izinleri düzeltilmektedir. Onaylı konum ve görev kayıtları geri yüklenmektedir. Vana açıklığı yüzde 70’e, sıcaklık hedefi 48 dereceye dönmektedir. Mavi takım, yeni logları ve telemetri örneklerini kontrol etmektedir.",
    "seconds": 30
  },
  {
    "short": "Doğrulama",
    "name": "Son hizmet doğrulaması",
    "tone": "amber",
    "phase": "Sonuç",
    "headline": "26 saha unsuru ve dört tesis normal işletimdedir",
    "detail": "Mavi takım son hizmet kontrollerini yeni telemetri örnekleriyle gerçekleştirmektedir. Bir dronun kalıcı kayıp kaydı korunmaktadır.",
    "target": "Dört bölge",
    "effect": "Etkin saha unsurları ve tesisler normal işletimdedir.",
    "cause": "Geri yükleme ve doğrulamanın tamamlanması",
    "evidence": "26/27 saha unsuru bağlı · 1 dron imha · 4/4 tesis",
    "action": "Hizmet durumunu gösteriniz. Analistin IOC, TTP ve varsa ihtiyatlı aktör değerlendirmesini aktarınız.",
    "screen": "01 · Komuta özeti / Haricî Wazuh",
    "narration": "26 saha unsuru ve dört tesis normal işletimdedir. Dronun imha kaydı korunmaktadır. Mavi takım, IOC’leri ve TTP’leri bilinen tehdit aktörü profilleriyle karşılaştırmaktadır. Varsa benzerlik, kanıt ve güven düzeyiyle raporlanmaktadır. TTP örtüşmesi kesin atıf oluşturmamaktadır. Başka bir grubun yöntemlerinin taklit edilmiş olabileceği dikkate alınmaktadır.",
    "seconds": 30
  }
];
  const BRIEFINGS=[
  {
    "badge": "BASELINE / TRUST",
    "headline": "Dört bölge izlenmektedir",
    "attackLabel": "BAŞLANGIÇ DURUMU",
    "attackTitle": "No Active Intrusion",
    "attackText": "Aktif siber saldırı bulunmamaktadır. Telemetri verileri onaylı başlangıç kayıtlarıyla eşleşmektedir.",
    "attackTerms": [
      "Attack Surface",
      "Trust Boundary"
    ],
    "refs": [],
    "defenseTitle": "Başlangıç kayıtları ve veri bütünlüğü",
    "defenseText": "Mavi takım, DMZ, iç hizmet ve saha ağlarının izinli bağlantılarını Wazuh kayıtlarıyla incelemektedir. Onaylı başlangıç kayıtları ve bağımsız ölçümler veri bütünlüğü değerlendirmesinde kullanılmaktadır.",
    "defenseTerms": [
      "Security Baseline",
      "Configuration Integrity"
    ],
    "evidence": "27 saha unsuru · 4 tesis · Uyumlu kayıtlar",
    "takeaway": "Saha ve tesis hizmetleri normal işletimdedir."
  },
  {
    "badge": "DMZ / INITIAL ACCESS",
    "headline": "Entegrasyon hizmetine yetkisiz erişilmiştir",
    "attackLabel": "SALDIRI TEKNİĞİ",
    "attackTitle": "Servis zafiyeti ve erişim zinciri",
    "attackText": "İlk erişim, DMZ’de yayınlanan veri kabul servisindeki zafiyet üzerinden sağlanmaktadır. Yerel yetki yükseltme, servis anahtarına erişim, pivot ve SSH geçişi ayrı teknik alt adımlar olarak izlenmektedir.",
    "attackTerms": [
      "RCE",
      "Local Privilege Escalation",
      "Credential Access",
      "Pivoting",
      "SSH Lateral Movement"
    ],
    "refs": [
      [
        "T1190",
        "https://attack.mitre.org/techniques/T1190/"
      ],
      [
        "T1548.003",
        "https://attack.mitre.org/techniques/T1548/003/"
      ],
      [
        "T1552.004",
        "https://attack.mitre.org/techniques/T1552/004/"
      ],
      [
        "T1090",
        "https://attack.mitre.org/techniques/T1090/"
      ],
      [
        "T1021.004",
        "https://attack.mitre.org/techniques/T1021/004/"
      ],
      [
        "T1098.004",
        "https://attack.mitre.org/techniques/T1098/004/"
      ]
    ],
    "defenseTitle": "Web, süreç ve ağ kayıtlarının korelasyonu",
    "defenseText": "Mavi takım, DMZ web isteğinden hedef SSH oturumuna kadar kayıtları ilişkilendirmektedir. Kaynak adresinin değişmesi, hesap kullanımı ve güvenlik duvarı izni ayrı doğrulanmaktadır. Ağ erişimi, uygulama yazma yetkisini tek başına sağlamamaktadır.",
    "defenseTerms": [
      "Process Ancestry",
      "Audit Log Correlation",
      "Network Segmentation",
      "SSH Authentication"
    ],
    "evidence": "Web / süreç kaydı · sudo · SSH anahtarı · tünel · hedef SSH oturumu",
    "takeaway": "Komuta verilerinin bütünlüğü risk altındadır."
  },
  {
    "badge": "IMPACT / DATA INTEGRITY",
    "headline": "Devriyenin konumu 650 m saptırılmıştır",
    "attackLabel": "SALDIRI TEKNİĞİ",
    "attackTitle": "Stored Data Manipulation",
    "attackText": "Saldırgan, bildirilen konum kaydını manipüle etmektedir. Bu işlem, telemetri verisinin bütünlüğünü bozmaktadır.",
    "attackTerms": [
      "Telemetry Tampering",
      "Position Integrity"
    ],
    "refs": [
      [
        "T1565.001",
        "https://attack.mitre.org/techniques/T1565/001/"
      ]
    ],
    "defenseTitle": "Veri bütünlüğü doğrulaması",
    "defenseText": "Konum değişikliği, entegrasyon sunucusundaki SSH oturumu ve uygulama işlem hesabıyla ilişkilendirilmektedir. 650 m sapma bir anomali bulgusudur. IOC değerlendirmesi göstergenin erişim ve işlem bağlamıyla yapılmaktadır.",
    "defenseTerms": [
      "Audit Log Correlation",
      "IOC Context",
      "Integrity Validation"
    ],
    "evidence": "Bildirilen / referans konum farkı: 650 m",
    "takeaway": "Komuta resmi manipüle edilmiş konumu göstermektedir."
  },
  {
    "badge": "IMPACT / MISSION INTEGRITY",
    "headline": "Görev kayıtları değiştirilmiştir",
    "attackLabel": "SALDIRI TEKNİĞİ",
    "attackTitle": "Mission Data Tampering",
    "attackText": "Görev kaydı yetkisiz değiştirilmiştir. Görev yürütme bileşeni, değiştirilen hedefleri uygulamaktadır. Veri değişikliği ve kumanda etkisi ayrı izlenmektedir.",
    "attackTerms": [
      "Task Redirection",
      "Unauthorized Write"
    ],
    "refs": [
      [
        "T1565.001",
        "https://attack.mitre.org/techniques/T1565/001/"
      ]
    ],
    "defenseTitle": "Değişiklik ve erişim denetimi",
    "defenseText": "Görev değişiklikleri uygulama denetim logları ve onaylı planla karşılaştırılmaktadır. Entegrasyon hesabının gereğinden geniş yazma yetkileri incelenmektedir. İşlem sırası, hesap ve kaynak sunucu üzerinden TTP analizi yürütülmektedir.",
    "defenseTerms": [
      "Behavioral Analysis",
      "TTP Mapping",
      "Audit Trail"
    ],
    "evidence": "Kırmızı hedefler ve değişen hareket güzergâhları",
    "takeaway": "Unsurlar onaylı görev planından sapmaktadır."
  },
  {
    "badge": "ICS / MANIPULATION OF VIEW",
    "headline": "Tesisin seviye verisi manipüle edilmiştir",
    "attackLabel": "SALDIRI TEKNİĞİ",
    "attackTitle": "Manipulation of View",
    "attackText": "HMI gösterim verisi manipüle edilmiştir. Tankın bağımsız ölçümü korunmaktadır. Proses kumandası bu gösterim değişikliğinden ayrı izlenmektedir.",
    "attackTerms": [
      "HMI Deception",
      "Sensor Data Integrity"
    ],
    "refs": [
      [
        "T0832",
        "https://attack.mitre.org/techniques/T0832/"
      ]
    ],
    "defenseTitle": "Bağımsız ölçüm doğrulaması",
    "defenseText": "HMI uygulama kayıtları bağımsız sensör ölçümüyle karşılaştırılmaktadır. İlişkili süreç veya dosya artefaktları varsa incelenmektedir. Ölçüm farkı doğrudan IOC olarak sınıflandırılmamaktadır.",
    "defenseTerms": [
      "Out-of-Band Verification",
      "Anomaly Detection"
    ],
    "evidence": "LT-01 / LT-02 farkı: 30 puan",
    "takeaway": "Dolum kararı manipüle edilmiş ölçüme dayanmaktadır."
  },
  {
    "badge": "ICS / IMPAIR PROCESS CONTROL",
    "headline": "Proses parametreleri değiştirilmiştir",
    "attackLabel": "SALDIRI TEKNİĞİ",
    "attackTitle": "Modify Parameter",
    "attackText": "Saldırgan, yetkisiz PLC komutlarıyla vana açıklığını ve sıcaklık set değerini değiştirmektedir. Bu müdahale proses kontrolünü etkilemektedir.",
    "attackTerms": [
      "Setpoint Tampering",
      "Unauthorized Command"
    ],
    "refs": [
      [
        "T0836",
        "https://attack.mitre.org/techniques/T0836/"
      ],
      [
        "T1692.001",
        "https://attack.mitre.org/techniques/T1692/001/"
      ]
    ],
    "defenseTitle": "PLC komut yetkilendirmesi",
    "defenseText": "DMZ’den saha ağına doğrudan erişim bulunmamaktadır. İhlal edilen entegrasyon hesabının uygulama geçidindeki komut yetkileri incelenmektedir. Gerekli hesap, oturum ve komut yolu engellemeleri ilgili yönetim araçlarında uygulanmaktadır.",
    "defenseTerms": [
      "Authorization Enforcement",
      "Command Allowlisting",
      "RBAC"
    ],
    "evidence": "Vana %70 → %15 · Hedef 48 → 82 °C",
    "takeaway": "Dağıtım kapasitesi normalin %26’sına düşmüştür."
  },
  {
    "badge": "CONTROL LOSS / AVAILABILITY",
    "headline": "Dron ve haberleşme kaybı oluşmuştur",
    "attackLabel": "SALDIRI TEKNİĞİ",
    "attackTitle": "Kontrol ve haberleşme kaybı",
    "attackText": "Komuta ve kontrol bağlantısı kaybedilmiştir. Dron imhası, kontrol kaybının fiziksel etkisi olarak modellenmektedir. T0815, HMI görünürlük kaybını ifade etmektedir.",
    "attackTerms": [
      "Control Loss",
      "Radio Link Denial"
    ],
    "refs": [
      [
        "T0815",
        "https://attack.mitre.org/techniques/T0815/"
      ]
    ],
    "defenseTitle": "Erişilebilirlik izleme",
    "defenseText": "Bağlantı logları, son paket zamanı ve bağımsız gözlem birlikte incelenmektedir. Kesinti, tek başına saldırı kaynağını veya RF karıştırmasını kanıtlamamaktadır.",
    "defenseTerms": [
      "Availability Monitoring",
      "Heartbeat / Timeout",
      "Out-of-Band Verification"
    ],
    "evidence": "Dron imha kaydı · Telsiz kesintisi · HMI zaman aşımı",
    "takeaway": "Dron imha olmuştur. Saha verilerine erişim kesilmiştir."
  },
  {
    "badge": "CONTAINMENT",
    "headline": "Yeni yetkisiz komutlar engellenmiştir",
    "attackLabel": "İHLAL DURUMU",
    "attackTitle": "Unauthorized Command",
    "attackText": "Pivot kanalı kesilmiş, servis hesabının anahtarı iptal edilmiş ve eski SSH erişim izni kaldırılmıştır. Uygulama oturumları sonlandırılmıştır. Veri bütünlüğü ihlalleri geri yükleme aşamasında giderilmektedir.",
    "attackTerms": [
      "Command Message",
      "Attack Path Isolation"
    ],
    "refs": [
      [
        "T1692.001",
        "https://attack.mitre.org/techniques/T1692/001/"
      ]
    ],
    "defenseTitle": "Saldırının kontrol altına alınması",
    "defenseText": "Mavi takım, DMZ servisini izole etmekte, ele geçirilen anahtarı iptal etmekte ve eski SSH kuralını kaldırmaktadır. Dış tünel ve uygulama erişimi kesilmektedir. Sonuç, yeni ağ, SSH ve uygulama kayıtlarıyla doğrulanmaktadır. Reji yalnız gösterimi yönetmektedir.",
    "defenseTerms": [
      "Incident Containment",
      "Key Revocation",
      "Egress Control",
      "Access Control"
    ],
    "evidence": "Oturum iptali · Hizmet %58 · Bütünlük ihlalleri sürmektedir",
    "takeaway": "Yeni yetkisiz değişiklikler engellenmiştir."
  },
  {
    "badge": "VALIDATION / INTEGRITY",
    "headline": "Onaylı kayıt ve ayarlar geri yüklenmiştir",
    "attackLabel": "İHLAL DURUMU",
    "attackTitle": "Residual Data Manipulation",
    "attackText": "Saldırı sırasında değiştirilen kayıtlar geri yüklenmiştir. Kalan veri bütünlüğü ihlalleri ve yapılandırma sapmaları kontrol edilmektedir.",
    "attackTerms": [
      "Data Integrity",
      "Configuration Drift"
    ],
    "refs": [
      [
        "T1565.001",
        "https://attack.mitre.org/techniques/T1565/001/"
      ]
    ],
    "defenseTitle": "Güvenilir yapılandırmaya dönüş",
    "defenseText": "Adli izler korunduktan sonra yetkisiz SSH anahtarları kaldırılmaktadır. Servis zafiyeti, sudo politikası ve uygulama yetkileri düzeltilmektedir. Onaylı kayıtlar geri yüklenmekte ve yeni loglarla tekrar eden erişim kontrol edilmektedir.",
    "defenseTerms": [
      "Known-Good Configuration",
      "Integrity Validation",
      "Recovery"
    ],
    "evidence": "Konum farkı 0 m · Vana %70 · Hedef 48 °C · Hizmet %88",
    "takeaway": "Tesis kapasitesi %88’e ulaşmıştır."
  },
  {
    "badge": "RECOVERY / MONITORING",
    "headline": "26 saha unsuru ve dört tesis normal işletimdedir",
    "attackLabel": "İHLAL DURUMU",
    "attackTitle": "Attack Path Closed",
    "attackText": "Saha ve tesis hizmetleri geri kazanılmıştır. Dron kaybı, olayın kalıcı fiziksel etkisi olarak kaydedilmektedir.",
    "attackTerms": [
      "Verified Recovery",
      "Restored Visibility"
    ],
    "refs": [],
    "defenseTitle": "Tehdit aktörü değerlendirmesi",
    "defenseText": "IOC’ler, TTP’ler, araçlar, altyapı ve olay zaman çizelgesi birlikte değerlendirilmektedir. Teknik benzerlik güven düzeyiyle raporlanmaktadır. Taklit ihtimali korunmakta ve kesin APT atfı yapılmamaktadır.",
    "defenseTerms": [
      "IOC Correlation",
      "TTP Analysis",
      "Attribution Confidence",
      "False Flag"
    ],
    "evidence": "26/27 saha unsuru bağlı · 1 dron imha · 4/4 tesis",
    "takeaway": "Etkin saha unsurları ve tesisler normal işletimdedir."
  }
];
  function narrationSeconds(stage){return Math.ceil(stage.narration.trim().split(/\s+/).length/2);}
  function narrationMarkup(stage){return stage.narration.split(/\n\s*\n/).map(p=>'<p>'+esc(p).replace(/(650|30|27|26|58|88|82|48|15|70)(?:&#39;[a-zçğıöşü]+)?(?=\s|[.,;:]|$)/gi,'<strong>$&</strong>')+'</p>').join('');}
  const COLORS={green:'#75cba6',amber:'#e7b969',red:'#f17f88',cyan:'#72c9df',muted:'#839ba9'};
  let sum=0;
  STAGES.forEach((s,i)=>{s.index=i;s.start=sum;s.end=sum+s.seconds;sum=s.end;});
  const TOTAL_SECONDS=sum;
  const W=1200,H=720,METRES_PER_PIXEL=5;
  const regionMap=new Map(REGION_DATA.map(r=>[r.id,r]));
  const PLANTS={karatepe:{name:'Üs Isı ve Su Merkezi',initial:62,target:62,temp:53,demand:11,pressure:3.4,capacity:80,branches:['KARARGÂH','PERSONEL BLOKLARI','BAKIM HANGARI']},akvadi:{name:'Vadi Isı ve Su Merkezi',initial:58,target:60,temp:50,demand:8,pressure:2.9,capacity:60,branches:['KONAKLAMA','SAHRA REVİRİ','GÖZLEM NOKTASI']},sarpgecit:{name:'Geçit Isı ve Su Merkezi',initial:64,target:65,temp:57,demand:5,pressure:3.8,capacity:45,branches:['KONTROL NOKTASI','DAĞ BARINAĞI','KURTARMA GARAJI']},guneyova:{name:'İkmal Isı ve Su Merkezi',initial:66,target:65,temp:48,demand:16,pressure:3.2,capacity:110,branches:['İKMAL DEPOSU','SAĞLIK BİRİMİ','TEKNİK ATÖLYE']}};
  const routeCache=new WeakMap();
  function position(u,region,seconds) {
    const t=seconds+region.phase;
    if(u.kind==='fixed')return {x:u.fixed[0],y:u.fixed[1],heading:0,speed:0};
    if(u.kind==='air') {const o=u.orbit,a=t*o.rate+.2;return {x:o.cx+o.rx*Math.cos(a),y:o.cy+o.ry*Math.sin(a),heading:(Math.atan2(-o.rx*Math.sin(a),-o.ry*Math.cos(a))*180/Math.PI+360)%360,speed:Math.hypot(o.rx*o.rate*Math.sin(a),o.ry*o.rate*Math.cos(a))*18};}
    let c=routeCache.get(u);
    if(!c){const lengths=u.route.map((p,i)=>Math.hypot(p[0]-u.route[(i+1)%u.route.length][0],p[1]-u.route[(i+1)%u.route.length][1]));c={lengths,total:lengths.reduce((a,b)=>a+b,0)};routeCache.set(u,c);}
    let distance=((t*u.speed/5+(u.offset||0))%c.total+c.total)%c.total,k=0;
    while(distance>c.lengths[k]&&k<c.lengths.length-1){distance-=c.lengths[k];k++;}
    const a=u.route[k],b=u.route[(k+1)%u.route.length],f=c.lengths[k]?distance/c.lengths[k]:0;
    return {x:a[0]+(b[0]-a[0])*f,y:a[1]+(b[1]-a[1])*f,heading:(Math.atan2(b[0]-a[0],a[1]-b[1])*180/Math.PI+360)%360,speed:u.speed*3.6};
  }
  function coordinate(r,p) {return {lat:r.origin[0]+(H-p.y)*5/111320,lon:r.origin[1]+p.x*5/85276};}
  function stageAt(seconds) {return STAGES.find(s=>seconds<s.end)||STAGES[STAGES.length-1];}
  function changedMission(r,u) {
    const targets={
      'KR-ZPT-01':{name:'DOĞU VADİSİ',x:1030,y:550},
      'KR-DEVR-02':{name:'BATI İKMAL YOLU',x:180,y:610},
      'KR-EMN-01':{name:'GÜNEY EMNİYET HATTI',x:700,y:600},
      'KR-DEV-02':{name:'DOĞU TOPLANMA NOKTASI',x:920,y:420},
      'KR-GÖZ-01':{name:'DOĞU GÖZETLEME SEKTÖRÜ',x:1030,y:230}
    };
    return targets[u.id]||r.changedTarget;
  }
  function redirectedPosition(u,r,seconds,target) {
    if(u.kind==='fixed')return position(u,r,seconds);
    const origin=position(u,r,STAGES[3].start),dx=target.x-origin.x,dy=target.y-origin.y;
    const distance=Math.hypot(dx,dy),travel=Math.max(0,seconds-STAGES[3].start)*u.speed/5;
    const progress=distance?cap(travel/distance,0,1):1;
    return {x:origin.x+dx*progress,y:origin.y+dy*progress,heading:(Math.atan2(dx,-dy)*180/Math.PI+360)%360,speed:progress<1?u.speed*3.6:0};
  }
  function impactStartAt() {
    if(Number.isFinite(state.impactAt))return state.impactAt;
    return state.anchor+(STAGES[6].start-state.cursor)*1000;
  }
  function droneLoss(u,r,seconds) {
    if(r.id!=='karatepe'||u.kind!=='air'||seconds<STAGES[6].start)return null;
    const elapsed=stageAt(seconds).index>6?30:Math.max(0,(Date.now()-impactStartAt())/1000);
    const origin=position(u,r,STAGES[6].start),impact={x:cap(origin.x+70,140,1040),y:cap(origin.y+155,150,580)};
    const progress=cap(elapsed/3.5,0,1);
    const point={x:origin.x+(impact.x-origin.x)*progress,y:origin.y+(impact.y-origin.y)*progress*progress,heading:progress*240,speed:progress<1?42:0};
    return {origin,impact,point,elapsed,progress,destroyed:elapsed>=3.5,burst:elapsed>=3.5&&elapsed<5.3};
  }
  function droneLabelBox(loss,assets=[]) {
    const x=loss.impact.x,y=loss.impact.y;
    const candidates=[[x+51,y-22],[x-229,y-22],[x-89,y-104],[x-89,y+55]].map(([x,y])=>({x:cap(x,20,1005),y:cap(y,24,640),w:178,h:43}));
    const score=b=>assets.filter(a=>!a.loss&&a.reported.x+34>b.x-9&&a.reported.x-34<b.x+b.w+9&&a.reported.y+34>b.y-9&&a.reported.y-34<b.y+b.h+9).length;
    return candidates.reduce((best,b)=>score(b)<score(best)?b:best,candidates[0]);
  }
  function droneLossMarkup(a,detail,assets=[]) {
    const l=a.loss,p=l.point,x=l.impact.x,y=l.impact.y,label=droneLabelBox(l,assets),labelX=label.x,labelY=label.y;
    const select=detail?`data-asset="${a.id}" tabindex="0" role="button" aria-label="${a.id} · ${l.destroyed?'İmha edildi':'Kontrol kaybı; düşüş sürmektedir'}"`:'';
    const age=Math.max(0,l.elapsed-3.5),delay='animation-delay:-'+age.toFixed(3)+'s';
    const falling=!l.destroyed?`<path d="M${l.origin.x} ${l.origin.y}Q${x-28} ${l.origin.y+48} ${x} ${y}" fill="none" stroke="#eaa46c" stroke-dasharray="5 6" opacity=".65"/><g class="k-falling-drone" transform="translate(${p.x} ${p.y})"><g transform="rotate(${p.heading}) scale(${1-l.progress*.35})"><circle r="33" fill="#f17f8828" stroke="#f17f88" stroke-dasharray="4 6"/><g transform="translate(-17 -17) scale(1.42)" fill="none" stroke="#ffd7bc" stroke-width="1.8">${iconPaths.air}</g></g></g><rect x="${cap(p.x-67,20,1020)}" y="${p.y-57}" width="134" height="24" rx="3" fill="#452330" stroke="#f17f88"/><text x="${cap(p.x,87,1087)}" y="${p.y-41}" fill="#ffd5da" font-size="11" text-anchor="middle">KONTROL KAYBI</text>`:'';
    const flash=l.burst?`<g transform="translate(${x} ${y})" class="k-impact-burst" style="${delay}"><circle class="k-blast-ring" r="36" fill="none" stroke="#ffaf6d" stroke-width="3"/><path class="k-blast-fire" d="M0-48 10-23 33-39 25-9 56 1 26 13 37 40 10 29-1 57-12 29-41 39-27 9-54-5-25-17-34-41-10-25Z" fill="#ffa862"/><circle class="k-blast-core" r="20" fill="#fff0c3"/>${Array.from({length:12},(_,i)=>{const angle=i*Math.PI/6,xx=Math.cos(angle)*64,yy=Math.sin(angle)*64;return `<path class="k-blast-ray" d="M${xx*.55} ${yy*.55}L${xx} ${yy}" stroke="#ffc48d" stroke-width="3"/>`;}).join('')}</g>`:'';
    const wreck=l.destroyed?`<g transform="translate(${x} ${y})"><ellipse rx="42" ry="20" fill="#170e13" opacity=".8"/><circle r="31" fill="#48222a66" stroke="#c66973" stroke-dasharray="3 5"/><path d="M-20-13 17 16M-18 14 19-17M-8-15 4-2 17-3M-17 3-5 2 6 17" stroke="#bc7d76" stroke-width="5" fill="none"/><path d="m-8-7 16 14m-16 0L8-7" stroke="#ffb6bd" stroke-width="3"/><g class="k-wreck-smoke" style="${delay}" fill="#8c8589" opacity=".38"><circle cx="0" cy="-27" r="12"/><circle cx="-8" cy="-45" r="15"/><circle cx="9" cy="-64" r="18"/></g></g><path d="M${x+24} ${y}L${cap(x,labelX,labelX+178)} ${cap(y,labelY,labelY+43)}" fill="none" stroke="#d88a98" stroke-width="1.2"/><rect x="${labelX}" y="${labelY}" width="178" height="43" rx="4" fill="#3c1725f5" stroke="#f17f88" stroke-width="1.7"/><text x="${labelX+89}" y="${labelY+17}" fill="#ffe5e8" font-size="12" font-weight="700" text-anchor="middle">İMHA EDİLDİ</text><text x="${labelX+89}" y="${labelY+33}" fill="#eea7b1" font-size="10" text-anchor="middle">${a.id} · GÖRSEL TEYİT</text>`:'';
    return `<g class="k-drone-loss" data-drone-phase="${l.destroyed?'destroyed':'falling'}" ${select}>${falling}${wreck}${flash}</g>`;
  }
  function radioBlockedMarkup(p) {
    return `<g transform="translate(${p.x+25} ${p.y-26})" class="k-radio-block"><circle r="13" fill="#401a29" stroke="#f17f88"/><path d="M-5-3h10v9H-5Zm2-5v5m5-6v6M-8-8 8 8" fill="none" stroke="#ffb0bc" stroke-width="1.8"/></g>`;
  }
  function radioZoneMarkup(r) {
    return `<g class="k-radio-zone" fill="none" stroke="#f17f88" opacity=".22"><ellipse cx="${r.base[0]}" cy="${r.base[1]}" rx="370" ry="225" stroke-dasharray="7 14"/><ellipse cx="${r.base[0]}" cy="${r.base[1]}" rx="280" ry="165" stroke-dasharray="4 12"/></g>`;
  }
  function transportTick() {
    if(!state.playing||audience)return;
    const raw=state.cursor+(Date.now()-state.anchor)/1000;
    const end=stageAt(state.cursor).end;
    if(state.holdAfterStep&&raw>=end)commit({cursor:end-.001,playing:false});
  }

  function regionSnapshot(r,seconds) {
    const st=stageAt(seconds),i=st.index,kr=r.id==='karatepe',go=r.id==='guneyova';
    const offline=kr&&i===6,drift=kr&&i>=2&&i<=7,orders=kr&&i>=3&&i<=7;
    const localTime=offline?STAGES[6].start:seconds;
    const mo=(state.m||0)+(!offline&&!state.playing?(Date.now()-state.anchor)/1000:0);
    const assets=r.units.map((u,j)=>{
      const changed=orders&&u.kind!=='air',target=changedMission(r,u),loss=droneLoss(u,r,seconds);
      const truth=loss?loss.point:changed?redirectedPosition(u,r,localTime+mo,target):position(u,r,localTime+mo),reported={...truth};
      if(drift&&j===0)reported.x+=650/5;
      const values={};
      for(const[key,spec]of Object.entries(u.values))values[key]=typeof spec==='number'?spec:spec.base+(spec.swing||0)*Math.sin((localTime+r.phase)*(spec.rate||.05)+j*.7);
      if(offline)values.signal=0;
      if(loss){values.altitude=loss.destroyed?0:Math.max(0,185*(1-loss.progress));if(loss.destroyed)values.signal=0;}
      if(changed&&u.kind==='fixed')values.pan=112;
      const destroyed=!!loss?.destroyed,assetOffline=offline||destroyed;
      return {id:u.id,meta:u,truth,reported,refCoord:coordinate(r,truth),coord:coordinate(r,reported),values,drift:drift&&j===0?650:0,orderChanged:changed,changedTarget:changed?target:null,loss,destroyed,radioBlocked:offline,offline:assetOffline,tone:destroyed?'red':offline?'muted':(drift&&j===0)||changed?'red':kr&&i===1||((kr||go)&&(i===7||i===8))?'amber':'green',destination:destroyed?'GÖREV SONA ERDİ':changed?target.name:u.destination};
    });
    const destroyed=assets.filter(a=>a.destroyed).length;
    const affected=(kr&&i>=1)||(go&&i>=4&&i<=8);
    const label=offline?'TELSİZ KESİLDİ':destroyed?'1 DRON İMHA':orders?'GÖREVLER DEĞİŞTİ':kr&&i===2?'KONUM SAPMASI':kr&&i===1?'ERİŞİM UYARISI':go&&i===5?'HİZMET KAYBI':go&&i===4?'ÖLÇÜM FARKI':affected&&i>=7?'DOĞRULAMA':'NORMAL';
    const note=offline?'Telsiz verisi alınamamaktadır. Dron düşüşü görsel olarak izlenmektedir.':destroyed?'5 etkin unsur bağlıdır. KR-VTOL-01’in imha kaydı korunmaktadır.':orders?'Araçlar ve timler değiştirilen hedeflere yönelmektedir.':kr&&i===2?'KR-ZPT-01 · Konum farkı 650 m.':kr&&i===1?'Entegrasyon hizmetine yetkisiz erişilmiştir.':go&&i===4?'Seviye ölçümleri arasında 30 puan fark.':go&&i===5?'Vana %15 · Hizmet %26.':go&&i>=7?'Ölçüm ve hizmetler doğrulanmaktadır.':`${r.composition} · Kayıtlar uyumlu.`;
    return {r,assets,offline,affected,label,note,tone:affected?(i===1||i>=7?'amber':'red'):'green',online:assets.filter(a=>!a.offline).length,age:offline?Math.max(0,(Date.now()-impactStartAt())/1000)+.4:.4,total:r.units.length,destroyed};
  }
  function plantSnapshot(r,seconds) {
    const cfg=PLANTS[r.id],st=stageAt(seconds),i=st.index,affected=r.id==='guneyova';
    let actual=cfg.initial,shown=cfg.initial,temp=cfg.temp,pressure=cfg.pressure,flow=cfg.demand,valve=70,heat=cfg.temp,service=100,pump=44,quality='green';
    if(affected) {
      if(i===4){actual=58;shown=88;pump=12;flow=13;service=81;pressure=2.8;quality='red';}
      if(i===5||i===6){actual=i===6?40:43;shown=82;temp=71;pressure=1.2;flow=4.16;valve=15;heat=82;service=26;pump=10;quality='red';}
      if(i===7){actual=43;shown=82;temp=61;pressure=2.1;flow=9.28;valve=45;service=58;pump=61;quality='amber';}
      if(i===8){actual=58;shown=58;temp=50;pressure=3;flow=14.08;valve=70;service=88;pump=48;quality='amber';}
    }
    const offline=affected&&i===6,measuredAt=offline?STAGES[6].start:seconds;
    const ripple=Math.sin(measuredAt*.18+cfg.capacity)*.12;
    actual+=Math.sin(seconds*.18+cfg.capacity)*.12;shown+=ripple;temp+=ripple;pressure+=Math.sin(measuredAt*.17)*.02;
    return {r,cfg,actual,shown,temp,pressure,flow,valve,heat,service,pump,offline,age:offline?Math.max(0,(Date.now()-impactStartAt())/1000):.3,quality,bias:Math.abs(shown-actual),locked:affected&&i>=7,verified:!affected||i<4||i>=8,levelTarget:cfg.target,mode:affected&&i>=7?'YEREL GÜVENLİ İŞLETİM':'OTOMATİK KONTROL',returnTemp:temp-8.2};
  }

  const TLM_COLORS={good:COLORS.green,warn:COLORS.amber,bad:COLORS.red,unknown:COLORS.muted};
  const TLM_LABELS={good:'Uyumlu',warn:'Doğrulama',bad:'Uyumsuz',unknown:'Yeni veri yok'};
  function telemetryTone(channels) {return channels.some(c=>c.tone==='unknown')?'unknown':channels.some(c=>c.tone==='bad')?'bad':channels.some(c=>c.tone==='warn')?'warn':'good';}
  function telemetrySources(seconds,regionRows=REGION_DATA.map(r=>regionSnapshot(r,seconds)),plants=null) {
    const i=stageAt(seconds).index;
    return regionRows.flatMap(rs=>{
      const validating=rs.affected&&i>=7&&i<=8;
      const field=rs.assets.map(a=>{
        const m=a.meta.metrics[0],metricValue=a.values[m.key]??a.meta.people;
        const channels=[
          {name:'Konum',tone:a.destroyed?'bad':a.offline?'unknown':a.drift?'bad':validating?'warn':'good',label:a.destroyed?'İmha edildi':a.offline?'Son konum':a.drift?fmt(a.drift)+' m sapma':validating?'Doğrulama':'Uyumlu'},
          {name:'Görev',tone:a.offline?'unknown':a.orderChanged?'bad':validating?'warn':'good',label:a.offline?'Son görev':a.orderChanged?'Değiştirildi':validating?'Doğrulama':'Onaylı'},
          {name:'Bağlantı',tone:a.offline?'unknown':'good',label:a.offline?'Kesildi':'Bağlı'}
        ];
        return {id:a.id,region:rs.r,kind:a.meta.kind,asset:a,age:a.destroyed?Math.max(0,seconds-STAGES[6].start-3.5):rs.age,offline:a.offline,channels,tone:a.destroyed?'bad':telemetryTone(channels),metricLabel:m.label,metricValue:fmt(metricValue,m.digits)+' '+m.unit,type:a.meta.type};
      });
      const p=plants?.get(rs.r.id)||plantSnapshot(rs.r,seconds),commandChanged=!p.operatorControlled&&(p.valve!==70||p.heat!==p.cfg.temp);
      const channels=[
        {name:'Ölçüm',tone:p.offline?'unknown':p.bias>3?'bad':!p.operatorControlled&&p.quality==='amber'?'warn':'good',label:p.offline?'Eski örnek':p.bias>3?fmt(p.bias,0)+' puan fark':!p.operatorControlled&&p.quality==='amber'?'Doğrulama':'Uyumlu'},
        {name:'Komut',tone:p.offline?'unknown':commandChanged?(p.locked?'warn':'bad'):p.operatorControlled?'good':p.quality==='amber'?'warn':'good',label:p.offline?'Son komut':p.operatorControlled?'Yerel operatör':commandChanged?(p.locked?'Güvenli yerel':'Değiştirildi'):p.locked?'Komut denetimi':'Onaylı'},
        {name:'HMI bağlantısı',tone:p.offline?'unknown':'good',label:p.offline?'Kesildi':'Bağlı'}
      ];
      return [...field,{id:rs.r.code+'-PLC-01',region:rs.r,kind:'plc',plant:p,age:p.age,offline:p.offline,channels,tone:telemetryTone(channels),metricLabel:'LT-01 / SEVİYE',metricValue:fmt(p.shown,1)+' %',type:p.cfg.name}];
    });
  }
  function scenarioFocus(seconds) {
    const stage=stageAt(seconds),i=stage.index;
    if(i===0||i===9)return null;
    if(i<=3)return {region:'karatepe',source:'KR-ZPT-01',kind:'field',reason:i===1?'Komuta oturumu uyarısı':i===2?'Konum verisi değiştirildi':'Görev noktası değiştirildi',event:i};
    if(i===6)return {region:'karatepe',source:'KR-VTOL-01',kind:'field',reason:'Dron kontrol kaybı · Telsiz bağlantıları kesildi',event:i};
    return {region:'guneyova',source:'GO-PLC-01',kind:'plc',reason:i===4?'PLC ölçümü manipüle edilmektedir':i===5?'PLC komutları değiştirildi':i===6?'Uzak HMI kesintisi · İki bölgede etki':'Tesis verileri doğrulanmaktadır',event:i};
  }
  function plcWarning(seconds) {
    const i=stageAt(seconds).index;
    if(i<4||i>8)return null;
    const p=plantSnapshot(regionMap.get('guneyova'),seconds);
    if(i===4)return {tone:'red',label:'WARN / ÖLÇÜM BÜTÜNLÜĞÜ',title:'PLC ölçümü manipüle edilmektedir',detail:'LT-01 değeri yüksek gösterilmektedir. Bu değer, bağımsız LT-02 ölçümüyle uyuşmamaktadır.',value:fmt(p.bias,0)+' puan',valueLabel:'ÖLÇÜM FARKI',tag:'GO-PLC-01 · GÜNEYOVA',event:i};
    if(i===5)return {tone:'red',label:'WARN / İZİNSİZ KOMUT',title:'Vana ve sıcaklık hedefi değiştirildi',detail:'V-01 %70 → %15 · Isı hedefi 48 °C → 82 °C. Dağıtım hizmeti etkilenmektedir.',value:'%'+fmt(p.service),valueLabel:'HİZMET KAPASİTESİ',tag:'GO-PLC-01 · GÜNEYOVA',event:i};
    if(i===6)return {tone:'red',label:'WARN / HABERLEŞME KAYBI',title:'Uzak HMI bağlantısı kesildi',detail:'Ekrandaki HMI değerleri son alınan örnektir. Yerel PLC ve bağımsız ölçüm kanalı çalışmaktadır.',value:fmt(p.age,1)+' sn',valueLabel:'HMI VERİ YAŞI',tag:'GO-PLC-01 · GÜNEYOVA',event:i};
    return {tone:'amber',label:i===7?'MÜDAHALE / GÜVENLİ YEREL İŞLETİM':'DOĞRULAMA / GERİ DÖNÜŞ',title:i===7?'Yetkisiz komutlar engellenmiştir':'Onaylı proses ayarları geri yüklenmiştir',detail:i===7?'Yerel güvenli işletim bağımsız LT-02 ölçümünü kullanmaktadır. HMI bütünlüğü henüz geri kazanılmamıştır.':'Onaylı vana ve sıcaklık ayarları geri yüklenmiştir. Hizmet koşulları doğrulanmaktadır.',value:'%'+fmt(p.service),valueLabel:'HİZMET KAPASİTESİ',tag:'GO-PLC-01 · GÜNEYOVA',event:i};
  }
  function telemetryHistory(sourceId,seconds) {
    return Array.from({length:31},(_,i)=>{const time=seconds-(30-i)*2;return {time,reference:time<0,source:telemetrySources(Math.max(0,time)).find(s=>s.id===sourceId)};});
  }
  const TELEMETRY_STEP=1000,TELEMETRY_WINDOW=30,TELEMETRY_KEEP=61;
  function createTelemetryFeed(runId,at) {
    return {runId,origin:Math.floor(at/TELEMETRY_STEP),bucket:null,stage:null,sequence:0,samples:[],sources:[],packets:new Map(),baseline:new Map(telemetrySources(0).map(s=>[s.id,s]))};
  }
  function updateTelemetryFeed(feed,runId,cursor,at,plants=null,controlVersion=0) {
    if(feed.runId!==runId)Object.assign(feed,createTelemetryFeed(runId,at));
    const bucket=Math.floor(at/TELEMETRY_STEP),stage=stageAt(cursor).index;
    if(feed.bucket===bucket&&feed.stage===stage&&feed.controlVersion===controlVersion)return false;
    const sameBucket=feed.bucket===bucket,t=bucket-feed.origin;
    if(stage===9&&(feed.stage!==9||feed.controlVersion!==controlVersion))feed.verificationStartBucket=bucket;
    if(!sameBucket)feed.sequence++;
    const sources=telemetrySources(cursor,undefined,plants).map((base,index)=>{
      const previous=feed.packets.get(base.id),wave=Math.sin(t*.71+index*.83);
      const row={...base,sampledAt:bucket*TELEMETRY_STEP};
      if(base.offline) {
        row.lastReceivedAt=previous?.lastReceivedAt??bucket*TELEMETRY_STEP-base.age*1000;
        row.packetSequence=previous?.packetSequence??0;
        if(base.asset)row.asset={...(previous?.asset||base.asset),offline:true,tone:base.asset.destroyed?'red':'muted',destroyed:base.asset.destroyed,loss:base.asset.loss,radioBlocked:base.asset.radioBlocked,...(base.asset.destroyed?{coord:base.asset.coord,refCoord:base.asset.refCoord,truth:base.asset.truth,reported:base.asset.reported,values:base.asset.values,destination:base.asset.destination}: {})};
        if(base.plant)row.plant={...(previous?.plant||base.plant),actual:base.plant.actual+.16*wave,offline:true};
        row.metricValue=previous?.metricValue||base.metricValue;
      } else {
        row.lastReceivedAt=bucket*TELEMETRY_STEP-base.age*1000;
        row.packetSequence=feed.sequence;
        if(base.asset) {
          const asset={...base.asset,values:{...base.asset.values}};
          asset.meta.metrics.forEach((m,j)=>{
            if(!Number.isFinite(asset.values[m.key])||m.unit==='kişi')return;
            const amplitude=m.unit==='°C'?1.1:m.label==='SİNYAL'?1.8:m.label==='YAKIT'? .18:m.unit==='%'? .35:.2;
            const value=asset.values[m.key]+amplitude*Math.sin(t*(.4+j*.16)+index);
            asset.values[m.key]=m.unit==='%'?cap(value,0,100):Math.max(0,value);
          });
          row.asset=asset;const m=asset.meta.metrics[0];
          row.metricValue=fmt(asset.values[m.key]??asset.meta.people,m.digits)+' '+m.unit;
        }
        if(base.plant) {
          const p=base.plant,delta=.22*wave;
          row.plant={...p,actual:p.actual+delta,shown:p.shown+delta,temp:p.temp+.45*Math.sin(t*.56+index),pressure:p.pressure+.02*wave};
          row.plant.bias=Math.abs(row.plant.shown-row.plant.actual);
          row.metricValue=fmt(row.plant.shown,1)+' %';
        }
      }
      if(!row.offline){
        const quality=cap(row.asset?.values.signal??(96+3*Math.sin(t*.41+index)),0,100);
        const latency=18+(100-quality)*5,jitter=previous?.link?Math.abs(latency-previous.link.latency):0;
        row.link={quality,rssi:-110+quality*.6,snr:quality*.45,latency,jitter};
      }else row.link=null;
      row.age=Math.max(0,(at-row.lastReceivedAt)/1000);
      if(!base.offline||!previous)feed.packets.set(row.id,row);
      return row;
    });
    const sample={bucket,stage,controlVersion,rows:new Map(sources.map(s=>[s.id,s]))};
    if(sameBucket)feed.samples[feed.samples.length-1]=sample;else feed.samples.push(sample);
    feed.samples=feed.samples.filter(s=>s.bucket>=bucket-TELEMETRY_KEEP+1);
    feed.bucket=bucket;feed.stage=stage;feed.controlVersion=controlVersion;feed.sources=sources;
    return true;
  }
  function telemetryFeedRows(feed,at) {
    return feed.sources.map(s=>({...s,age:Math.max(0,(at-s.lastReceivedAt)/1000)}));
  }
  function telemetryFeedHistory(feed,sourceId,count=TELEMETRY_WINDOW+1,step=1) {
    const samples=new Map(feed.samples.map(s=>[s.bucket,s]));
    return Array.from({length:count},(_,i)=>{
      const bucket=feed.bucket-(count-i-1)*step,reference=bucket<feed.origin;
      return {at:bucket*TELEMETRY_STEP,reference,source:reference?feed.baseline.get(sourceId):samples.get(bucket)?.rows.get(sourceId)||null};
    });
  }
  function telemetrySignalProfile(source,at) {
    const t=at/1000,seed=[...source.id].reduce((n,c)=>n+c.charCodeAt(0),0)*.017;
    if(source.offline)return {quality:null,rssi:null,snr:null,latency:null,jitter:null,bars:Array(36).fill(0),wave:Array(65).fill(.5)};
    const base=source.asset?.values.signal??97;
    const swell=Math.sin(t*.57+seed)*5.4+Math.sin(t*1.43+seed*.3)*2.8;
    const quality=cap(base+swell,20,99.8),strength=quality/100;
    const bars=Array.from({length:36},(_,i)=>{
      const band=.35+.38*Math.pow(Math.sin(i*.12+.4),2);
      const motion=.19*Math.sin(t*(1.2+i*.031)+i*.73+seed)+.14*Math.sin(t*2.7-i*.43+seed);
      return cap((band+motion+.08*Math.sin(t*.4+i))*strength,.035,.98);
    });
    const wave=Array.from({length:65},(_,i)=>.5+strength*(.17*Math.sin(i*.31+t*1.8+seed)+.08*Math.sin(i*.76-t*3.1)+.035*Math.sin(i*1.41+t*.7)));
    return {quality,rssi:-106+quality*.48+Math.sin(t*.89+seed)*2.2,snr:5+quality*.27+Math.sin(t*1.14+seed)*2.1,latency:Math.max(1,(source.asset?400:300)+Math.sin(t*.73+seed)*24),jitter:3.5+Math.abs(Math.sin(t*1.37+seed))*8.6,bars,wave};
  }
  function plcSettings(base,patch={}) {
    const finite=(v,f,min,max)=>Number.isFinite(Number(v))?cap(Number(v),min,max):f;
    const prior=base.pumps||Array(6).fill(true);
    return {pumps:Array.from({length:6},(_,i)=>typeof patch.pumps?.[i]==='boolean'?patch.pumps[i]:prior[i]!==false),
      driveHz:finite(patch.driveHz,base.driveHz??base.pump/2,0,50),valve:finite(patch.valve,base.valve,0,100),heat:finite(patch.heat,base.heat,20,85)};
  }
  function controlledPlant(base,record,at) {
    if(!record||record.stage!==stageAt(record.cursor).index||stageAt(record.cursor).index!==stageAt(base.cursor).index||!Number.isFinite(record.cursor)||!Number.isFinite(record.at)||record.at>at)return {...base,pumps:Array(6).fill(true),driveHz:base.pump/2};
    const settings=plcSettings(base,record),from=record.from||base;if(settings.driveHz===0)settings.pumps[0]=false;
    const t=cap((at-record.at)/1000,0,300),mix=1-Math.exp(-t/4),thermal=1-Math.exp(-t/12);
    const levelStart=Number.isFinite(from.actual)?from.actual:base.actual;
    const branchFraction=settings.pumps.slice(3).filter(Boolean).length/3;
    const outlet=settings.pumps[2]?settings.valve/70*branchFraction:0,inlet=settings.pumps[0]?settings.driveHz/22:0;
    const actual=cap(levelStart+(inlet-outlet)*t*.28,0,100);
    const localTemp=(Number.isFinite(from.localTemp)?from.localTemp:base.temp)+( (settings.pumps[1]?settings.heat:20)-(Number.isFinite(from.localTemp)?from.localTemp:base.temp))*thermal;
    const water=actual>5?1:actual/5,heatFactor=cap((localTemp-20)/Math.max(1,base.cfg.temp-20),0,1);
    const capacity=cap(settings.valve/70,0,1)*water*heatFactor;
    const branchServices=settings.pumps.slice(3).map((run,i)=>{
      const start=Number.isFinite(from.branchServices?.[i])?from.branchServices[i]:base.service;
      const target=run&&settings.pumps[2]?capacity*100:0;
      return start+(target-start)*mix;
    });
    const bias=(Number.isFinite(from.shown)&&Number.isFinite(from.actual))?from.shown-from.actual:base.shown-base.actual;
    const shown=base.offline?(Number.isFinite(from.shown)?from.shown:base.shown):cap(actual+bias,0,100);
    return {...base,...settings,actual,shown,bias:Math.abs(shown-actual),localTemp,temp:base.offline?(from.temp??base.temp):localTemp,
      pressure:settings.pumps[2]?base.cfg.pressure*Math.sqrt(cap(settings.valve/70,0,1.5))*water:0,
      flow:base.cfg.demand*outlet*water,pump:settings.pumps[0]?settings.driveHz*2:0,branchServices,
      service:branchServices.reduce((n,v)=>n+v,0)/3,mode:'YEREL / ELLE KUMANDA',operatorControlled:true,
      quality:Math.abs(shown-actual)>3?'red':'amber',returnTemp:localTemp-8.2};
  }
  function layoutMapLabels(assets,reserved=[]) {
    const placed=[],result=new Map(),w=113,h=23;
    const overlaps=(a,b)=>a.x<b.x+b.w+5&&a.x+a.w+5>b.x&&a.y<b.y+b.h+5&&a.y+a.h+5>b.y;
    for(const asset of assets) {
      const p=asset.reported,candidates=[];
      for(const gap of [36,64,96,132]) {
        const below={x:p.x-w/2,y:p.y+gap},above={x:p.x-w/2,y:p.y-gap-h};
        candidates.push(...(asset.drift?[above,below]:[below,above]),
          {x:p.x+gap,y:p.y-h/2},{x:p.x-gap-w,y:p.y-h/2},
          {x:p.x+gap*.75,y:p.y+gap*.75},{x:p.x-gap*.75-w,y:p.y+gap*.75},
          {x:p.x+gap*.75,y:p.y-gap*.75-h},{x:p.x-gap*.75-w,y:p.y-gap*.75-h});
      }
      let best=null,bestScore=Infinity;
      candidates.forEach((candidate,index)=>{
        const box={x:cap(candidate.x,16,1200-w-16),y:cap(candidate.y,16,720-h-16),w,h};
        const unitHits=assets.filter(a=>{const q=a.reported,dx=q.x-cap(q.x,box.x,box.x+w),dy=q.y-cap(q.y,box.y,box.y+h);return dx*dx+dy*dy<32*32;}).length;
        const hits=unitHits+[...reserved,...placed].filter(r=>overlaps(box,r)).length;
        const score=hits*1000000+index;
        if(score<bestScore){best=box;bestScore=score;}
      });
      placed.push(best);result.set(asset.id,best);
    }
    return result;
  }
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

  // Shared identifiers and analyst evidence. Presentation time is never an incident clock.
  const CASE_SCHEMA='kalkan-session/1';
  const CASE_ROLES={source:'Erişim kaynağı',command:'KKBS / API',records:'Konum / görev kayıtları',hmi:'HMI',plc:'PLC'};
  const CASE_KINDS={log:'Log bulgusu',ioc:'IOC',ttp:'TTP',response:'Müdahale kaydı'};
  const CASE_TIME_LABELS={started:'İlk kötü amaçlı faaliyet',detected:'Tespit',contained:'Kontrol altına alma',restored:'Hizmetin geri kazanılması'};
  function caseIdFor(runId){
    let a=2166136261,b=3339675911;
    for(const c of String(runId)){a=Math.imul(a^c.charCodeAt(0),16777619);b=Math.imul(b^c.charCodeAt(0),2246822519);}
    return 'K1-'+(a>>>0).toString(16).padStart(8,'0').toUpperCase()+(b>>>0).toString(16).padStart(8,'0').toUpperCase();
  }
  const incidentId=(id,stage)=>id+'-E'+String(stage+1).padStart(2,'0');
  function emptyCase(runId,at){return {id:caseIdFor(runId),openedAt:at,times:{},evidence:[],actor:{name:'',confidence:'belirsiz',basis:'',alternatives:''}};}
  function textLimit(value,max,label,required=false){
    if(typeof value!=='string'||value.length>max||required&&!value.trim())throw new Error(label+' alanını kontrol ediniz.');
    return value.trim();
  }
  function validEpoch(at){return Number.isFinite(at)&&at>=946684800000&&at<=4102444800000;}
  function validateCase(raw,id){
    if(!raw||raw.id!==id||!validEpoch(raw.openedAt)||!Array.isArray(raw.evidence)||raw.evidence.length>100)throw new Error('Olay dosyası geçersizdir.');
    const data={id,openedAt:raw.openedAt,times:{},evidence:[],actor:{}};
    for(const key of Object.keys(CASE_TIME_LABELS)){
      const item=raw.times?.[key];if(item){if(!validEpoch(item.at))throw new Error('UTC zamanını kontrol ediniz.');data.times[key]={at:item.at,ref:textLimit(item.ref,240,'Zaman kanıtı',true)};}
    }
    const ordered=Object.keys(CASE_TIME_LABELS).map(k=>data.times[k]?.at).filter(Number.isFinite);
    if(ordered.some((v,i)=>i>0&&v<ordered[i-1]))throw new Error('Olay zamanları kronolojik sırada olmalıdır.');
    const seen=new Set();
    for(const item of raw.evidence){
      if(!item||!CASE_KINDS[item.kind]||!Number.isInteger(item.stage)||item.stage<0||item.stage>9||!validEpoch(item.at)||!validEpoch(item.addedAt))throw new Error('Bulgu kaydı geçersizdir.');
      const e={id:textLimit(item.id,80,'Bulgu kimliği',true),stage:item.stage,eventId:incidentId(id,item.stage),kind:item.kind,at:item.at,addedAt:item.addedAt,
        ref:textLimit(item.ref,240,'Kanıt referansı',true),summary:textLimit(item.summary,700,'Bulgu açıklaması',true),value:textLimit(item.value||'',300,'IOC / teknik'),
        iocType:textLimit(item.iocType||'',40,'IOC türü'),confidence:item.confidence,from:item.from||'',to:item.to||'',confirmed:item.confirmed===true};
      if(seen.has(e.id))throw new Error('Tekrarlanan bulgu kimliği bulunmaktadır.');seen.add(e.id);
      if(!['düşük','orta','yüksek'].includes(e.confidence))throw new Error('Güven düzeyi seçiniz.');
      if(e.kind==='ioc'&&(!e.value||!['IPv4 / IPv6','Alan adı','URL','SHA-256','Hesap','Diğer'].includes(e.iocType)))throw new Error('IOC türünü ve değerini giriniz.');
      if(e.kind==='ttp'&&!/^T\d{4}(?:\.\d{3})?$/.test(e.value))throw new Error('ATT&CK tekniğini T1078 veya T1078.001 biçiminde giriniz.');
      if(e.from||e.to){if(!CASE_ROLES[e.from]||!CASE_ROLES[e.to]||e.from===e.to)throw new Error('Bağlantı için farklı iki sistem seçiniz.');}
      if(e.confirmed&&(!e.from||!e.to))throw new Error('Doğrulanan bağlantının iki ucunu seçiniz.');
      data.evidence.push(e);
    }
    const actor=raw.actor||{};
    data.actor={name:textLimit(actor.name||'',100,'Grup adı'),confidence:actor.confidence||'belirsiz',basis:textLimit(actor.basis||'',1000,'Atıf kanıtı'),alternatives:textLimit(actor.alternatives||'',700,'Alternatif açıklamalar')};
    if(!['belirsiz','düşük','orta','yüksek'].includes(data.actor.confidence))throw new Error('Atıf güven düzeyi geçersizdir.');
    if(data.actor.name&&(!data.actor.basis||data.actor.confidence==='belirsiz'))throw new Error('Grup benzerliği için kanıt ve güven düzeyi gerekmektedir.');
    return data;
  }
  function caseMetrics(data){
    const t=data.times||{},delta=(a,b)=>t[a]&&t[b]&&t[b].at>=t[a].at?t[b].at-t[a].at:null;
    return [
      {key:'detect',label:'Tespit süresi',from:'İlk faaliyet → Tespit',ms:delta('started','detected')},
      {key:'contain',label:'Kontrol altına alma süresi',from:'Tespit → Kontrol altına alma',ms:delta('detected','contained')},
      {key:'recover',label:'Hizmeti geri kazanma süresi',from:'Kontrol altına alma → Hizmet',ms:delta('contained','restored')},
      {key:'total',label:'Toplam geçen süre',from:'İlk faaliyet → Hizmet',ms:delta('started','restored')}
    ];
  }
  function durationLabel(ms){if(ms===null||!Number.isFinite(ms))return 'Ölçülmedi';const s=Math.floor(ms/1000);return [Math.floor(s/3600),Math.floor(s/60)%60,s%60].map(v=>String(v).padStart(2,'0')).join(':');}
  function utcLabel(at){return validEpoch(at)?new Date(at).toISOString().replace('T',' ').replace(/\.\d{3}Z$/,' UTC'):'—';}
  function utcInput(at){return validEpoch(at)?new Date(at).toISOString().slice(0,19):'';}
  function parseUTC(value){
    if(!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2})?$/.test(value))throw new Error('UTC zamanını giriniz.');
    const ms=Date.parse(value+'Z');if(!validEpoch(ms)||utcInput(ms).slice(0,value.length)!==value)throw new Error('UTC zamanı geçersizdir.');return ms;
  }
  function confirmedEdges(data,maxStage=9){return data.evidence.filter(e=>e.stage<=maxStage&&e.confirmed&&e.ref&&CASE_ROLES[e.from]&&CASE_ROLES[e.to]);}
  function actorStatement(actor){return actor?.name?`${actor.name} ile teknik benzerlik değerlendirilmektedir. Güven düzeyi ${actor.confidence} olarak kaydedilmiştir. Bu benzerlik kesin atıf oluşturmamaktadır. Yöntemlerin taklit edilmiş olabileceği değerlendirilmektedir.`:'Grup atfı yapılmamıştır. Mevcut kayıtlar tek başına bir APT grubuna işaret etmemektedir.';}
  function topologyMarkup(data,maxStage=9,privateView=false){
    const edges=confirmedEdges(data,maxStage),active=[...new Set(edges.flatMap(e=>[e.from,e.to]))];
    if(!edges.length)return '<p class="k-case-empty">Kanıtla doğrulanmış bağlantı henüz kaydedilmemiştir.</p>';
    const positions={source:[110,55],command:[330,55],records:[550,55],hmi:[330,175],plc:[550,175]};
    const svg=`<svg viewBox="0 0 670 235" role="img" aria-label="Kanıtla doğrulanmış erişim bağlantıları"><defs><marker id="k-evidence-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto"><path d="M0 0L7 3.5L0 7Z" fill="#86d4c7"/></marker></defs>${edges.map((e,i)=>{const a=positions[e.from],b=positions[e.to],dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),ox=dx/length*65,oy=dy/length*22;return `<path d="M${a[0]+ox} ${a[1]+oy}L${b[0]-ox} ${b[1]-oy}" stroke="#86d4c7" stroke-width="2" fill="none" marker-end="url(#k-evidence-arrow)"/><text x="${(a[0]+b[0])/2+5}" y="${(a[1]+b[1])/2-8}" fill="#b6e4db" font-size="12">${i+1}</text>`;}).join('')}${active.map(key=>{const p=positions[key];return `<rect x="${p[0]-83}" y="${p[1]-22}" width="166" height="44" rx="7" fill="#173644" stroke="#4b7b86"/><text x="${p[0]}" y="${p[1]+4}" text-anchor="middle" fill="#dbedf0" font-size="13">${CASE_ROLES[key]}</text>`;}).join('')}</svg>`;
    return svg+`<ol class="k-case-path-list">${edges.map(e=>`<li><b>${esc(CASE_ROLES[e.from])} → ${esc(CASE_ROLES[e.to])}</b><small>${esc(e.eventId)}${privateView?' · '+esc(e.ref):' · Kanıt referansı kaydedilmiştir.'}</small></li>`).join('')}</ol>`;
  }
  function validateRecording(raw){
    if(!raw||raw.schema!==CASE_SCHEMA||!raw.session||!Array.isArray(raw.frames)||!Array.isArray(raw.events)||raw.frames.length>10800||raw.events.length>20000)throw new Error('KALKAN oturum dosyası geçersizdir.');
    const s=raw.session;if(typeof s.runId!=='string'||s.runId.length>160||s.id!==caseIdFor(s.runId)||!validEpoch(s.openedAt))throw new Error('Oturum kimliği geçersizdir.');
    const session={id:s.id,runId:s.runId,openedAt:s.openedAt,data:validateCase(s.data,s.id),recording:false,frameCount:raw.frames.length,eventCount:raw.events.length,endedAt:s.endedAt||null};
    let last=0,lastSeq=0;
    const safeNumber=(v,min,max)=>{if(!Number.isFinite(v)||v<min||v>max)throw new Error('Kayıt ölçüm değeri geçersizdir.');return v;};
    const frames=raw.frames.map(f=>{
      if(!f||!validEpoch(f.at)||f.at<last||!Number.isInteger(f.sequence)||f.sequence<=lastSeq||!Number.isInteger(f.stage)||f.stage<0||f.stage>9||!Array.isArray(f.rows)||f.rows.length!==31||!Array.isArray(f.regions)||f.regions.length!==4||!Array.isArray(f.plants)||f.plants.length!==4)throw new Error('Kayıt karesi geçersizdir.');
      last=f.at;lastSeq=f.sequence;safeNumber(f.cursor,0,300);
      const rows=f.rows.map(r=>({id:textLimit(r.id,50,'Kaynak',true),region:textLimit(r.region,30,'Bölge',true),metricLabel:textLimit(r.metricLabel,80,'Ölçüm',true),metricValue:textLimit(String(r.metricValue),100,'Değer'),tone:['cyan','green','amber','red','muted'].includes(r.tone)?r.tone:'muted',offline:!!r.offline,age:safeNumber(r.age,0,1e9),link:safeNumber(r.link,0,100),lastReceivedAt:validEpoch(r.lastReceivedAt)?r.lastReceivedAt:null,packetSequence:safeNumber(r.packetSequence,0,1e12)}));
      if(new Set(rows.map(r=>r.id)).size!==31)throw new Error('Kaynak kimlikleri tekrarlanmamalıdır.');
      const regions=f.regions.map(r=>{
        if(!REGION_DATA.some(base=>base.id===r.id)||!Array.isArray(r.assets)||r.assets.length!==REGION_DATA.find(base=>base.id===r.id).units.length)throw new Error('Bölge kaydı geçersizdir.');
        return {id:r.id,assets:r.assets.map(a=>({id:textLimit(a.id,50,'Unsur',true),x:safeNumber(a.x,-1000,5000),y:safeNumber(a.y,-1000,5000),refX:safeNumber(a.refX,-1000,5000),refY:safeNumber(a.refY,-1000,5000),drift:safeNumber(a.drift,0,100000),destroyed:!!a.destroyed,offline:!!a.offline,changed:!!a.changed,tone:['cyan','green','amber','red','muted'].includes(a.tone)?a.tone:'muted'}))};
      });
      const plants=f.plants.map(p=>{if(!REGION_DATA.some(r=>r.id===p.id))throw new Error('Tesis kaydı geçersizdir.');return {id:p.id,actual:safeNumber(p.actual,0,100),shown:safeNumber(p.shown,0,100),temp:safeNumber(p.temp,-50,200),valve:safeNumber(p.valve,0,100),service:safeNumber(p.service,0,100),offline:!!p.offline};});
      if(new Set(regions.map(r=>r.id)).size!==4||new Set(plants.map(p=>p.id)).size!==4)throw new Error('Bölge kimlikleri tekrarlanmamalıdır.');
      return {sessionId:s.id,sequence:f.sequence,at:f.at,cursor:f.cursor,stage:f.stage,curtain:!!f.curtain,regions,plants,rows};
    });
    const events=raw.events.map((e,i)=>{if(!validEpoch(e.at)||!Number.isInteger(e.stage)||e.stage<0||e.stage>9||!['model','analyst','director'].includes(e.source))throw new Error('Zaman çizelgesi geçersizdir.');return {sessionId:s.id,sequence:i+1,at:e.at,stage:e.stage,eventId:incidentId(s.id,e.stage),source:e.source,kind:textLimit(e.kind,50,'Kayıt türü',true),text:textLimit(e.text,1200,'Kayıt açıklaması',true)};});
    return {schema:CASE_SCHEMA,session,frames,events};
  }
  function recordedEffects(frames){
    if(!frames.length)return null;
    let minimumService=100,maximumDrift=0;const destroyed=new Set();for(const f of frames){for(const p of f.plants)minimumService=Math.min(minimumService,p.service);for(const r of f.regions)for(const a of r.assets){maximumDrift=Math.max(maximumDrift,a.drift);if(a.destroyed)destroyed.add(a.id);}}
    return {minimumService,maximumDrift,destroyed:[...destroyed],samples:frames.length};
  }
  function caseReport(bundle){
    const {session:s,frames,events}=bundle,d=s.data,effects=recordedEffects(frames),rows=(heads,body)=>`<table><thead><tr>${heads.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${body.map(row=>`<tr>${row.map(cell=>`<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const evidenceTable=kind=>rows(['Olay / kayıt','UTC / kanıt referansı','Bulgu / bağlam','Değer / güven'],d.evidence.filter(e=>e.kind===kind).map(e=>[e.eventId+' / '+e.id,utcLabel(e.at)+' / '+e.ref,e.summary,(e.iocType?e.iocType+': ':'')+e.value+' / '+e.confidence]));
    return `<!doctype html><html lang="tr"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>KALKAN-1 · ${esc(s.id)}</title><style>body{font:14px/1.6 system-ui,sans-serif;color:#203345;max-width:1120px;margin:36px auto;padding:0 24px}h1{font-size:30px}h2{font-size:20px;margin-top:30px;color:#174c62}small{color:#55717c}table{border-collapse:collapse;width:100%;font-size:12px;table-layout:fixed}th,td{text-align:left;vertical-align:top;border:1px solid #cfdae0;padding:9px;overflow-wrap:anywhere}th{background:#edf3f5}.metrics{display:flex;gap:12px;flex-wrap:wrap}.metrics div{background:#edf3f5;padding:14px;flex:1;min-width:160px}.metrics b{display:block;font:24px monospace}.note{padding:12px 16px;background:#f3f5f6;border-left:3px solid #728e9e}svg{max-width:780px;background:#0e2533} @media print{body{margin:0;font-size:11px}h2{break-after:avoid}tr{break-inside:avoid}.print{display:none}}</style><h1>KALKAN-1 · Tatbikat Sonuç Raporu</h1><p><b>Ortak olay kimliği:</b> ${esc(s.id)}<br><b>Oturum açılışı:</b> ${utcLabel(s.openedAt)}<br><b>Kayıt kapsamı:</b> ${frames.length} görüntü / telemetri örneği · ${events.length} zaman çizelgesi kaydı</p><p class="note">Wazuh kanıt referansları ve siber müdahale kayıtları analist tarafından girilmiştir. Bu arayüz Wazuh loglarını otomatik doğrulamamaktadır. Saha ve PLC verileri gösterim modeline aittir. Bu iki kaynak aşağıda ayrı sunulmaktadır.</p><p class="print">PDF çıktısı için tarayıcıda Yazdır → PDF olarak kaydet seçeneğini kullanınız.</p><h2>1. Analist tarafından doğrulanan olay zamanları</h2><div class="metrics">${caseMetrics(d).map(m=>`<div>${esc(m.label)}<b>${durationLabel(m.ms)}</b><small>${esc(m.from)}</small></div>`).join('')}</div><p>Bu süreler UTC olay zamanlarından hesaplanmıştır. 30 saniyelik sunum süresi ölçüme katılmamıştır. Eksik zamanlar “Ölçülmedi” olarak bırakılmıştır.</p>${rows(['Kilometre taşı','UTC','Kanıt referansı'],Object.entries(CASE_TIME_LABELS).map(([key,label])=>[label,utcLabel(d.times[key]?.at),d.times[key]?.ref||'Kaydedilmemiştir']))}<h2>2. Log bulguları</h2>${evidenceTable('log')}<h2>3. IOC kayıtları</h2>${evidenceTable('ioc')}<h2>4. Gözlenen TTP’ler</h2>${evidenceTable('ttp')}<h2>5. Mavi takım müdahale kayıtları</h2>${evidenceTable('response')}<p>Müdahalenin gerçekleştiği ve sonucu, ilgili kanıt referansı üzerinden incelenmelidir. Reji geçişi veya görsel hizmet düzelmesi, siber olayın kapandığı anlamına gelmemektedir.</p><h2>6. Kanıtla doğrulanan saldırı yolu</h2>${topologyMarkup(d,9,true)}<h2>7. Tehdit aktörü değerlendirmesi</h2><p>${esc(actorStatement(d.actor))}</p><p><b>Dayanak:</b> ${esc(d.actor.basis||'Kaydedilmemiştir.')}<br><b>Alternatif açıklamalar:</b> ${esc(d.actor.alternatives||'Taklit ve yanıltma ihtimali dışlanmamıştır.')}</p><h2>8. Kaydedilen gösterim etkileri</h2>${effects?`<p>${effects.samples} kayıt örneğinde en düşük tesis hizmeti %${effects.minimumService.toFixed(1)}, en yüksek bildirilen konum farkı ${effects.maximumDrift.toFixed(0)} m olarak kaydedilmiştir. İmha işaretli unsurlar: ${esc(effects.destroyed.join(', ')||'Bulunmamaktadır.')}.</p><p>Özet yalnız kaydedilen örnekleri kapsamaktadır; kayda alınmayan aralıklar için sonuç üretilmemiştir.</p>`:'<p>Telemetri kaydı bulunmamaktadır. Etki özeti üretilmemiştir.</p>'}<h2>9. Kayıt zaman çizelgesi</h2>${rows(['UTC / olay','Kaynak / tür','Kayıt'],events.map(e=>[utcLabel(e.at)+' / '+e.eventId,e.source+' / '+e.kind,e.text]))}</html>`;
  }

  /* AUDIO_MODEL */
  /* BROADCAST_MODEL */
  const KEY='kalkan-wall-v6-state',CHANNEL='kalkan-wall-v6',VERSION=6;
  const windowId=typeof crypto.randomUUID==='function'?crypto.randomUUID():`${Date.now()}-${Math.random().toString(36).slice(2)}`;
  let state={version:VERSION,runId:windowId,rev:0,writer:windowId,cursor:0,anchor:Date.now(),playing:false,speed:1,holdAfterStep:true,caseOpenedAt:Date.now(),curtain:false};
  let storageOK=true,channel=null;
  function validState(s){return !!s&&s.version===VERSION&&typeof s.runId==='string'&&Number.isFinite(s.rev)&&typeof s.writer==='string'&&Number.isFinite(s.cursor)&&s.cursor>=0&&s.cursor<=TOTAL_SECONDS&&Number.isFinite(s.anchor)&&typeof s.playing==='boolean'&&s.speed===1&&validSessionState(s);}
  function validSessionState(s){try{if(s.caseData)validateCase(s.caseData,caseIdFor(s.runId));return (s.curtain===undefined||typeof s.curtain==='boolean')&&(!s.recording||typeof s.recording.owner==='string'&&s.recording.caseId===caseIdFor(s.runId)&&validEpoch(s.recording.since));}catch{return false;}}
  try{const saved=JSON.parse(localStorage.getItem(KEY));if(validState(saved))state=saved;else localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;}
  state.caseOpenedAt=state.caseData?.openedAt||state.caseOpenedAt||state.anchor;
  try{if('BroadcastChannel' in window)channel=new BroadcastChannel(CHANNEL);}catch{}
  const peers=new Map();
  let currentView='command',audience=false,operationsRegion='karatepe',plcRegion='guneyova',selected=REGION_DATA.map(r=>r.id),selectedAsset=null,lastRenderedView='',cachedStage=-1,lastNav='',pendingRender=false;
  let syncReceived=false,telemetryOnlyIssues=false,telemetryDetail=null;
  let cameraAuto=true,cameraManualUntil=0,cameraEvent='',cameraSwitchUntil=0;
  let telemetryRegion='karatepe',telemetryFocus='KR-ZPT-01',telemetryAuto=true,telemetryManualUntil=0,telemetryEvent='';
  let plcNoticeKey='',plcNoticeUntil=0,plcNoticeDismissed=false;
  let mapMonitor=false,mapPanelVisible=true,mapFullscreenOwned=false;
  let screenMonitor=false,screenFullscreenOwned=false;
  let telemetryFeed=null,telemetryChart=null,telemetryFrame=0;
  let plcControlRegion=null;
  /* SOUND_ENGINE */
  const observerView=()=>audience||(mapMonitor&&currentView==='operations')||(screenMonitor&&['plc','telemetry'].includes(currentView));
  /* BROADCAST_DESK */
  /* DMZ_ACCESS_GUIDE */
  function cursorAt(now=Date.now()){const value=state.cursor+(state.playing?Math.max(0,now-state.anchor)/1000:0);return cap(state.playing&&state.holdAfterStep?Math.min(value,stageAt(state.cursor).end-.001):value,0,TOTAL_SECONDS);}
  function isNewer(s){return s.rev>state.rev||(s.rev===state.rev&&s.writer>state.writer);}
  function acceptState(s){if(validState(s)&&isNewer(s)){state=s;syncReceived=true;render();heartbeat();}}
  function send(type,extra={}){try{channel?.postMessage({type,sender:windowId,...extra});}catch{}}
  if(channel)channel.onmessage=e=>{
    const m=e.data;if(!m||m.sender===windowId)return;
    if(m.type==='audio-owner'||m.type==='audio-silence'){sceneSound.release();heartbeat();}
    if(m.type==='state')acceptState(m.state);
    if(m.type==='hello'){send('state',{state});heartbeat();}
    if(m.type==='heartbeat')receiveBroadcastHeartbeat(m);
    if(m.type==='health-request')heartbeat();
    if(m.type==='sync-request'){render();heartbeat();}
    if(m.type==='bye')peers.delete(m.sender);
  };
  window.addEventListener('storage',e=>{if(e.key!==KEY||!e.newValue)return;try{acceptState(JSON.parse(e.newValue));}catch{}});
  function commit(change,kind='presentation',detail='',relatedStage=null) {
    if(audience)return;
    const now=Date.now(),cursor=cursorAt(now),previous={...state,cursor};
    const target=Number.isFinite(change.cursor)?change.cursor:cursor;
    if(stageAt(target).index===6&&stageAt(cursor).index!==6)change={...change,impactAt:now};
    else if(stageAt(cursor).index===6&&!Number.isFinite(state.impactAt))change={...change,impactAt:impactStartAt()};
    if(change.runId&&change.runId!==state.runId)change={...change,impactAt:null,caseData:null,caseOpenedAt:now,recording:null};
    if(change.runId&&change.runId!==state.runId||Number.isFinite(change.cursor)&&stageAt(change.cursor).index!==stageAt(cursor).index)change={...change,controls:{},controlRev:Date.now()};
    state={...state,cursor,anchor:now,m:(state.m||0)+(state.playing?0:(now-state.anchor)/1000),...change,rev:Math.max(Date.now(),state.rev+1),writer:windowId};
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;}
    onSessionTransition(previous,state,kind,detail,relatedStage);send('state',{state});render();heartbeat();
  }
  function gotoStage(index){const i=cap(index,0,STAGES.length-1);commit({cursor:STAGES[i].start,playing:false});}
  function playPause(){let cursor=cursorAt();if(state.holdAfterStep&&cursor>=stageAt(cursor).end-.02)cursor=stageAt(cursor).end;if(cursor>=TOTAL_SECONDS){commit({cursor:0,playing:true,runId:windowId+'-'+Date.now(),impactAt:null});return;}commit({cursor,playing:!state.playing});}
  function currentPlant(r,cursor,at=Date.now()) {
    const base={...plantSnapshot(r,cursor),cursor};
    return controlledPlant(base,state.controls?.[r.id],at);
  }
  function writePlcControls(patch,message,region=plcRegion) {
    if(!canOperatePLC()||!regionMap.has(region))return;
    const now=Date.now(),cursor=cursorAt(now),p=currentPlant(regionMap.get(region),cursor,now),controls={...state.controls};
    if(patch===null)delete controls[region];
    else controls[region]={...plcSettings(p,patch),stage:stageAt(cursor).index,cursor,at:now,
      from:{actual:p.actual,shown:p.shown,temp:p.temp,localTemp:p.localTemp??p.temp,service:p.service,branchServices:p.branchServices||Array(3).fill(p.service)}};
    const previous={...state,cursor};
    state={...state,cursor,anchor:now,m:(state.m||0)+(state.playing?0:(now-state.anchor)/1000),controls,controlRev:now,impactAt:Number.isFinite(state.impactAt)?state.impactAt:stageAt(cursor).index===6?impactStartAt():null,rev:Math.max(now,state.rev+1),writer:windowId};
    try{localStorage.setItem(KEY,JSON.stringify(state));}catch{storageOK=false;}
    onSessionTransition(previous,state,'plc',message);setText('k-plc-control-feedback',clock(now)+' · '+message);send('state',{state});render();toast(message);
  }
  function togglePlcPump(index) {
    if(!canOperatePLC()||!Number.isInteger(index)||index<0||index>5)return;
    const region=plcControlRegion||plcRegion,p=currentPlant(regionMap.get(region),cursorAt()),pumps=[...p.pumps];
    pumps[index]=!pumps[index];writePlcControls({pumps,...(index===0&&pumps[0]&&p.driveHz===0?{driveHz:22}:{})},`P-0${index+1} ${pumps[index]?'çalıştırıldı':'durduruldu'}`,region);
  }
  function openPlcControls(field='valve') {
    if(!canOperatePLC())return;
    plcControlRegion=plcRegion;const p=currentPlant(regionMap.get(plcRegion),cursorAt());
    ['driveHz','valve','heat'].forEach(name=>document.querySelectorAll('[data-plc-field="'+name+'"]').forEach(el=>el.value=String(p[name])));
    setText('k-plc-control-title',regionMap.get(plcRegion).short+' / Yerel kumanda');renderPlcControls();
    if(!$('k-plc-controls').open)$('k-plc-controls').showModal();
    $('k-plc-controls').querySelector('input[name="'+(['driveHz','valve','heat'].includes(field)?field:'valve')+'"]').focus({preventScroll:true});
  }
  function renderPlcControls() {
    if(!plcControlRegion)return;
    const p=currentPlant(regionMap.get(plcControlRegion),cursorAt());
    setText('k-plc-control-state',p.operatorControlled?'YEREL KUMANDA ETKİN':p.mode);
    document.querySelectorAll('#k-plc-controls [data-plc-pump]').forEach(button=>{const i=Number(button.dataset.plcPump);button.setAttribute('aria-pressed',String(p.pumps[i]));button.innerHTML=`<b>P-0${i+1}</b><span>${p.pumps[i]?'■ Durdur':'▶ Çalıştır'}</span><small>${['Dolum','Isı kaynağı','Dağıtım',...p.cfg.branches][i]}</small>`;});
    put('k-plc-control-readings',[['SEVİYE',p.actual,'%'],['SICAKLIK',p.localTemp??p.temp,'°C'],['DEBİ',p.flow,'m³/sa'],['HİZMET',p.service,'%']].map(([label,v,unit])=>`<div><small>${label}</small><strong>${fmt(v,1)} <em>${unit}</em></strong></div>`).join(''));
  }
  function applyPlcControls(e) {
    e.preventDefault();if(!canOperatePLC())return;const form=$('k-plc-control-form');if(!form.reportValidity())return;
    const patch={};['driveHz','valve','heat'].forEach(key=>patch[key]=Number(form.elements.namedItem(key).value));
    writePlcControls(patch,`Yerel komut uygulandı · ${fmt(patch.driveHz,1)} Hz · Vana %${fmt(patch.valve)} · Hedef ${fmt(patch.heat)} °C`,plcControlRegion);
  }
  function heartbeat(){const now=Date.now();for(const[id,p]of peers)if(now-p.seen>60000)peers.delete(id);send('heartbeat',{view:currentView,at:now,status:currentBroadcastStatus(now)});}
  function locationFor(view,aud=false,region=null) {
    const p=new URLSearchParams({view});if(aud)p.set('audience','1');if(region)p.set('region',region);if(view==='operations'&&mapMonitor)p.set('display','map');if(view===currentView&&screenMonitor)p.set('display','wall');return '#'+p.toString();
  }
  function monitorURL(view) {const url=new URL(location.href),p=new URLSearchParams(locationFor(view,true).slice(1));if(['plc','telemetry'].includes(view))p.set('display','wall');url.hash=p.toString();return url.href;}
  function syncMapMonitor() {
    document.body.classList.toggle('k-map-monitor',mapMonitor&&currentView==='operations');
    document.body.classList.toggle('k-map-monitor-no-data',mapMonitor&&!mapPanelVisible&&currentView==='operations');
    document.body.classList.toggle('k-screen-monitor',screenMonitor&&['plc','telemetry'].includes(currentView));
    document.body.classList.toggle('k-observer',observerView());
    document.querySelector('.k-stage-band').hidden=currentView==='plc'||currentView==='director'||observerView();
    if(observerView()&&$('k-plc-controls')?.open){$('k-plc-controls').close();plcControlRegion=null;}
  }
  async function setScreenMonitor(enabled,requestNative=true) {
    if(!['plc','telemetry'].includes(currentView))return;
    screenMonitor=Boolean(enabled);
    if(screenMonitor&&$('k-tlm-dialog')?.open)$('k-tlm-dialog').close();
    syncMapMonitor();
    const url=new URL(location.href),params=new URLSearchParams(url.hash.slice(1));
    if(screenMonitor)params.set('display','wall');else params.delete('display');
    url.hash=params.toString();history.replaceState(null,'',url.href);render();
    if(screenMonitor&&requestNative&&!document.fullscreenElement){try{await document.documentElement.requestFullscreen();screenFullscreenOwned=true;}catch{toast('Seyirci düzeni açıldı. Tarayıcı tam ekranı için F11 tuşunu kullanabilirsin.');}}
    else if(!screenMonitor&&screenFullscreenOwned){screenFullscreenOwned=false;if(document.fullscreenElement)try{await document.exitFullscreen();}catch{}}
  }
  async function setMapMonitor(enabled,requestNative=true) {
    if(currentView!=='operations')return;
    mapMonitor=Boolean(enabled);syncMapMonitor();
    const url=new URL(location.href);if(mapMonitor)url.hash=new URLSearchParams({...Object.fromEntries(new URLSearchParams(url.hash.slice(1))),display:'map'}).toString();else{const params=new URLSearchParams(url.hash.slice(1));params.delete('display');url.hash=params.toString();}
    history.replaceState(null,'',url.href);render();
    if(mapMonitor&&requestNative&&!document.fullscreenElement){try{await document.documentElement.requestFullscreen();mapFullscreenOwned=true;}catch{toast('Harita monitör modu açıldı. Tarayıcıyı tam ekran yapmak için F11 tuşunu kullanabilirsin.');}}
    else if(!mapMonitor&&mapFullscreenOwned){mapFullscreenOwned=false;if(document.fullscreenElement)try{await document.exitFullscreen();}catch{}}
  }
  function manualCamera(id) {
    if(!regionMap.has(id))return;
    operationsRegion=id;selectedAsset=null;cameraManualUntil=Date.now()+12000;cameraEvent=state.runId+':'+stageAt(cursorAt()).index;cameraSwitchUntil=Date.now()+750;
    history.replaceState(null,'',locationFor('operations',audience,id)+'&camera=manual');lastRenderedView='';render();
  }
  function updateCamera(snap) {
    if(currentView!=='operations'||!cameraAuto)return;
    const focus=scenarioFocus(snap.cursor),key=state.runId+':'+snap.stage.index;
    const freshEvent=key!==cameraEvent;cameraEvent=key;
    if(!focus)return;
    if(!freshEvent&&Date.now()<cameraManualUntil)return;
    if(freshEvent){cameraManualUntil=0;selectedAsset=focus.kind==='field'?focus.source:null;}
    if(operationsRegion!==focus.region){operationsRegion=focus.region;selectedAsset=focus.kind==='field'?focus.source:null;cameraSwitchUntil=Date.now()+750;history.replaceState(null,'',locationFor('operations',audience,focus.region)+'&camera=auto');lastRenderedView='';}
  }
  function readLocation() {
    const p=new URLSearchParams(location.hash.slice(1));const next=p.get('view');
    currentView=VIEWS.some(v=>v.id===next)?next:'command';audience=p.get('audience')==='1'&&currentView!=='director';document.body.dataset.screen=currentView;
    if(currentView!=='director'&&$('k-script-reader')?.open)$('k-script-reader').close();
    if(currentView!=='plc'&&$('k-plc-controls')?.open)$('k-plc-controls').close();
    if(currentView!=='telemetry'){stopTelemetryAnimation();telemetryChart?.observer?.disconnect();telemetryChart=null;}
    mapMonitor=currentView==='operations'&&p.get('display')==='map';
    screenMonitor=['plc','telemetry'].includes(currentView)&&p.get('display')==='wall';syncMapMonitor();
    if(currentView!=='operations'&&mapFullscreenOwned){mapFullscreenOwned=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}
    if(!['plc','telemetry'].includes(currentView)&&screenFullscreenOwned){screenFullscreenOwned=false;if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});}
    const id=p.get('region');if(regionMap.has(id)){if(currentView==='operations'){operationsRegion=id;if(p.get('camera')!=='auto'){cameraManualUntil=Date.now()+12000;cameraEvent=state.runId+':'+stageAt(cursorAt()).index;}}if(currentView==='plc')plcRegion=id;}
    if(currentView!=='telemetry')telemetryDetail=null;
    document.body.classList.toggle('k-audience',audience);document.querySelector('.k-brand').href=locationFor('command',audience);lastRenderedView='';lastNav='';render();heartbeat();
  }
  const sectionHead=(title,tag='')=>`<div class="k-section-head"><h2>${title}</h2>${tag?`<small>${tag}</small>`:''}</div>`;
  function titleRow(title,subtitle,screen,side='') {return `<div class="k-title-row"><div><p class="k-eyebrow">KALKAN-1 <span class="k-separator">/</span> EKRAN ${screen}</p><h1>${title}</h1><p class="k-subtitle">${subtitle}</p></div><div class="k-title-side">${side||`<span class="k-chip"><i class="k-dot"></i> SENKRON GÖRÜNÜM</span>`}</div></div>`;}
  function regionTabs(active,scope){return `<div class="k-region-tabs" aria-label="Bölge seçimi">${REGION_DATA.map((r,i)=>`<button data-region="${r.id}" data-scope="${scope}" class="${r.id===active?'active':''}" aria-pressed="${r.id===active}">${scope==='operations'?`<kbd>${i+1}</kbd>`:''}${r.short}</button>`).join('')}</div>`;}
  function operationsMonitorMarkup() {
    return `<header class="k-map-monitor-bar k-map-monitor-ui"><div class="k-map-monitor-title"><span class="k-map-monitor-brand">K1</span><div><small id="k-map-monitor-eyebrow">KALKAN-1 / HAREKÂT RESMİ</small><h1 id="k-map-monitor-name"></h1><span id="k-map-monitor-status"></span></div></div><div class="k-map-monitor-controls">${regionTabs(operationsRegion,'operations')}<div class="k-map-monitor-actions"><button class="k-camera-auto" data-camera-auto aria-pressed="${cameraAuto}"><kbd>A</kbd> Otomatik</button><button class="k-camera-auto" id="k-map-panel-toggle" data-map-panel-toggle aria-pressed="${mapPanelVisible}"><kbd>H</kbd> Veriler</button><button class="k-camera-auto" data-map-native-fullscreen title="Tarayıcı tam ekranı">${icon('fullscreen')}</button>${soundButtonMarkup()}<button class="k-camera-auto k-map-monitor-exit" data-map-monitor-exit><kbd>F</kbd> Çıkış</button></div></div></header>`;
  }
  function screenMonitorButton() {return `<button class="k-button k-primary" data-screen-monitor-toggle>${icon('fullscreen')} Seyirci tam ekran <kbd>F</kbd></button>`;}
  function screenMonitorMarkup(view) {
    return `<header class="k-screen-monitor-bar"><div class="k-screen-monitor-heading"><span class="k-screen-monitor-brand">K1</span><div><small>KALKAN-1 / ${view==='plc'?'TESİS KONTROLÜ':'TELEMETRİ'}</small><h1 id="k-screen-monitor-name"></h1><p id="k-screen-monitor-status"></p></div></div><div class="k-screen-monitor-controls">${view==='plc'?regionTabs(plcRegion,'plc'):''}<div class="k-screen-monitor-actions">${view==='plc'?'<button class="k-camera-auto" data-plc-panel="valve">Kumanda ⚙</button><span class="k-camera-auto k-plc-viewer-lock" id="k-plc-viewer-lock" hidden>🔒 Kumanda kilitli</span>':''}${view==='telemetry'?`<button class="k-camera-auto" data-telemetry-auto aria-pressed="${telemetryAuto}"><kbd>A</kbd> Otomatik odak</button>`:''}${soundButtonMarkup()}<time id="k-screen-monitor-clock"></time><button class="k-icon-button" data-screen-native-fullscreen aria-label="Tarayıcı tam ekranı" title="Tarayıcı tam ekranı">${icon('fullscreen')}</button><button class="k-camera-auto" data-screen-monitor-exit><kbd>F</kbd> Çıkış</button></div></div></header>`;
  }
  function renderScreenMonitor(name,status,tone='cyan') {
    setText('k-screen-monitor-name',name);setText('k-screen-monitor-status',status);
    if($('k-screen-monitor-status'))$('k-screen-monitor-status').style.color=COLORS[tone]||COLORS.cyan;
    setText('k-screen-monitor-clock',clock(Date.now()));
  }
  function telemetryLayout() {
    return titleRow('Telemetri akışı','Renkli durum göstergeleri · Konum / ölçüm, görev / komut ve bağlantı','05',`<button class="k-camera-auto" data-telemetry-auto id="k-telemetry-auto" aria-pressed="${telemetryAuto}">${icon('telemetry')} Otomatik odak</button>${screenMonitorButton()}`)+screenMonitorMarkup('telemetry')+`<section class="k-tlm-summary" aria-label="Telemetri durum özeti"><div class="k-tlm-now"><small id="k-tlm-step"></small><h2 id="k-tlm-headline"></h2></div><div class="k-tlm-counts" id="k-tlm-counts"></div></section><div class="k-stream-layout"><aside class="k-panel k-stream-rail"><div class="k-section-head"><h2>Kaynaklar</h2><small>27 SAHA + 4 PLC</small></div><div class="k-stream-regions" id="k-stream-regions"></div><div class="k-stream-source-list" id="k-stream-source-list"></div><div class="k-stream-rail-foot" id="k-stream-follow-state"></div></aside><section class="k-panel k-stream-focus"><div class="k-stream-focus-head"><div><p class="k-eyebrow" id="k-stream-source-type"></p><h2 id="k-stream-source-title"></h2></div><button class="k-button k-subtle" data-tlm-open>Ayrıntılı değerler ↗</button></div><div class="k-stream-gauges" id="k-stream-gauges"></div><div class="k-stream-history"><div class="k-stream-history-head"><div><h3>Anlık ölçüm göstergeleri</h3><p class="k-stream-flow-caption">Konum / proses verisi ve bağlantı seviyesi</p></div><div class="k-stream-feed-head"><span class="k-stream-live-badge" id="k-stream-live-badge"><i></i><b id="k-stream-feed-label">CANLI AKIŞ</b></span><span>1 ÖRNEK / sn</span><strong id="k-stream-packet-id"></strong><time id="k-stream-packet-time"></time></div></div><div id="k-stream-history-rows" class="k-instrument-grid"></div></div><div class="k-stream-live-values" id="k-stream-live-values"></div><div class="k-stream-focus-foot" id="k-stream-focus-foot"></div></section></div><div class="k-tlm-legend"><span class="good">● Mavi: güncel / uyumlu</span><span class="bad">● Kırmızı: değiştirilmiş / uyumsuz</span><span class="warn">● Sarı: doğrulama</span><span class="unknown">● Gri: yeni veri yok</span><small>Konum / ölçüm doğruluğu ile bağlantı seviyesi ayrı izlenir.</small></div><dialog class="k-dialog k-tlm-dialog" id="k-tlm-dialog" aria-labelledby="k-tlm-detail-title"><div class="k-dialog-head"><div><p class="k-eyebrow" id="k-tlm-detail-type"></p><h2 id="k-tlm-detail-title"></h2></div><button class="k-icon-button" data-tlm-close aria-label="Telemetri ayrıntısını kapat">✕</button></div><div id="k-tlm-detail-body"></div></dialog>`;
  }
  function mount() {
    const v=VIEWS.find(v=>v.id===currentView);
    if(lastNav!==`${currentView}-${audience}`){put('k-nav',VIEWS.filter(x=>!audience||x.id!=='director').map(x=>`<a href="${locationFor(x.id,audience)}" data-view="${x.id}" class="${x.id===currentView?'active':''}" ${x.id===currentView?'aria-current="page"':''}>${icon(x.id)}${x.name}</a>`).join(''));lastNav=`${currentView}-${audience}`;}
    if(lastRenderedView===currentView)return;
    lastRenderedView=currentView;
    setText('k-footer-view',v.label);document.title='KALKAN-1 · '+v.name+(audience?' · izleyici':'');
    if(currentView==='command') {
      $('k-content').innerHTML=titleRow('Operasyonel durum','Dört bölge · Ortak harekât resmi · Tesis hizmetleri','01',`<div id="k-region-filters" class="k-filter-row">${REGION_DATA.map(r=>`<button class="k-filter" data-filter="${r.id}" aria-pressed="${selected.includes(r.id)}"><i class="k-dot" style="background:${r.accent}"></i>${r.short}</button>`).join('')}</div>`)+`<div class="k-overview-layout"><div id="k-region-grid" class="k-region-grid"></div><aside class="k-side-stack"><section class="k-panel">${sectionHead('Sahaya yansıyan etki','ŞİMDİ')}<div id="k-impact"></div></section><section class="k-panel">${sectionHead('Hizmet durumu','BAĞLANTI / BÜTÜNLÜK')}<div id="k-services" class="k-service-list"></div><div id="k-service-impact" hidden></div></section><section class="k-panel">${sectionHead('Son gelişmeler',audience?'OLAY KAYITLARI':'SENARYO ZAMANI')}<div id="k-mini-events" class="k-mini-events"></div></section></aside></div>`;
      mountRegionCards();
    } else if(currentView==='operations') {
      $('k-content').innerHTML=titleRow('Harekât resmi','Bildirilen konum, bağımsız referans ve onaylı görev planı','02',regionTabs(operationsRegion,'operations')+`<button class="k-camera-auto" data-camera-auto id="k-camera-auto" aria-pressed="${cameraAuto}"><kbd>A</kbd> Otomatik odak</button><button class="k-button k-primary k-map-expand-button" data-map-monitor-toggle>${icon('fullscreen')} Haritayı tam ekran <kbd>F</kbd></button>`)+`<div id="k-hero"></div><div class="k-operations-grid"><div><section class="k-panel"><div id="k-map-heading"></div><div class="k-map-box"><svg id="k-main-map" class="k-main-map" viewBox="0 0 1200 720" role="group" aria-label="Bölge haritası"></svg><div id="k-main-map-stamp" class="k-map-stamp"></div><div id="k-camera-caption" class="k-camera-caption"></div><div id="k-map-offline"></div></div><div class="k-map-key"><span><i class="k-key-dot"></i>Bildirilen konum</span><span><i class="k-key-dot" style="background:var(--green)"></i>Bağımsız referans</span><span><i class="k-key-line"></i>Konum / görev farkı</span><span>◇ Görev noktası</span><span class="k-camera-keys"><kbd>1–4</kbd> Bölge <kbd>←</kbd><kbd>→</kbd> Geçiş <kbd>A</kbd> Otomatik</span></div></section><section class="k-panel" style="margin-top:16px">${sectionHead('Bölgedeki unsurlar','KONUM / GÖREV / VERİ YAŞI')}<div id="k-unit-table" class="k-table-wrap"></div></section></div><aside class="k-side-stack"><section class="k-panel"><div id="k-asset-heading"></div><div id="k-coordinates"></div></section><section class="k-panel"><div id="k-mission-heading"></div><div id="k-mission"></div></section><section class="k-panel"><div id="k-operations-trend-heading"></div><div class="k-detail-trend" id="k-position-trend"></div></section></aside>${operationsMonitorMarkup()}</div>`;
    } else if(currentView==='plc') {
      $('k-content').innerHTML=titleRow('Tesis kontrolü','Isı ve su dağıtımı · Proses, ölçüm doğruluğu ve hizmet sürekliliği','03',regionTabs(plcRegion,'plc')+`<button class="k-button" data-plc-panel="valve">Yerel kumanda ⚙</button>`+screenMonitorButton())+screenMonitorMarkup('plc')+`<div id="k-plc-warning" aria-live="off"></div><div id="k-plc-notice" class="k-plc-notice" role="alert" hidden></div><div id="k-plc-kpis" class="k-kpi-strip"></div><div class="k-plc-layout"><div><section class="k-panel"><div id="k-process-heading"></div><div class="k-process-stage"><svg id="k-process" class="k-process-svg" viewBox="0 0 1200 660" preserveAspectRatio="xMidYMid meet" role="group" aria-label="Tesis proses şeması"></svg><div id="k-plc-offline"></div></div><div class="k-process-caption"><span><strong>——</strong> Besleme / dolaşım <span style="color:var(--red)">——</span> Sıcak su <span style="color:#8babc0">┄┄</span> Ölçüm / kontrol</span><span id="k-plc-mode"></span></div></section><section class="k-panel" style="margin-top:16px">${sectionHead('Proses eğilimleri',audience?'ÖLÇÜM GEÇMİŞİ':'MODEL GEÇMİŞİ · SENARYO ZAMANI')}<div id="k-plc-trends" class="k-detail-trend"></div></section></div><aside class="k-side-stack"><section class="k-panel">${sectionHead('Ölçüm doğruluğu','LT-01 / LT-02')}<div id="k-level-compare" class="k-compare"></div></section><section class="k-panel">${sectionHead('İşletim bildirimleri','TESİS / GÜVENLİK')}<div id="k-plc-alarms" class="k-alarm-list"></div></section><section class="k-panel">${sectionHead('Desteklenen tesisler','HİZMET KAPASİTESİ')}<div id="k-plc-services" class="k-service-list"></div></section></aside></div>`;
    } else if(currentView==='events') {
      $('k-content').innerHTML=titleRow('Olay ve müdahale akışı',audience?'Güncel olaylar, doğrulama bulguları ve müdahale kayıtları':'Erişim belirtisinden hizmet kaybına, müdahaleden güvenilir duruma','04')+`<div id="k-hero"></div><section class="k-panel k-event-topology-panel"><div class="k-section-head"><h2>Doğrulanan saldırı yolu</h2><small id="k-event-case-id"></small></div><div id="k-event-topology" class="k-case-topology"></div></section><div class="k-incident-grid"><section class="k-panel">${sectionHead(audience?'Olay zaman çizgisi':'Senaryo zaman çizgisi','NEDEN → ETKİ → MÜDAHALE')}<div id="k-chain" class="k-chain-list"></div></section><aside class="k-side-stack"><section class="k-panel">${sectionHead(audience?'Güncel olayın etkisi':'Geçerli adımın etki zinciri','ŞİMDİ')}<div id="k-causal" class="k-causal"></div></section><section class="k-panel">${sectionHead('Geri dönüş kontrolleri','6 BAĞIMSIZ KONTROL')}<div id="k-checks" class="k-checklist"></div></section></aside></div>`;

    } else if(currentView==='telemetry') {
      $('k-content').innerHTML=telemetryLayout();
      $('k-tlm-dialog').addEventListener('close',()=>telemetryDetail=null);
    } else {
      $('k-content').innerHTML=directorMarkup();
      $('k-step-hold').addEventListener('change',e=>commit({holdAfterStep:e.target.checked}));
      $('k-wazuh-address-form').addEventListener('submit',saveWazuhAddress);
    }
  }
  function mountRegionCards() {
    const grid=$('k-region-grid');if(!grid)return;
    grid.className='k-region-grid'+(selected.length===1?' single':selected.length===3?' odd':'');
    grid.innerHTML=REGION_DATA.filter(r=>selected.includes(r.id)).map(r=>`<article class="k-region-card" id="k-card-${r.id}" style="--accent:${r.accent}"><div class="k-region-head"><div class="k-region-name"><span class="k-region-code">${r.code}</span><div><h3>${r.name}</h3><small>${r.terrain.toLocaleUpperCase('tr-TR')} · ${r.units.length} UNSUR</small></div></div><span id="k-card-status-${r.id}" class="k-region-status"><i></i>NORMAL</span></div><div class="k-map-box"><svg class="k-mini-map" id="k-mini-${r.id}" viewBox="0 0 1200 720" role="img" aria-label="${r.name} temsili haritası"></svg><span class="k-map-stamp">${r.code} / SEKTÖR ${r.number}</span><div id="k-mini-offline-${r.id}"></div></div><div class="k-region-bottom"><span>SAHA BAĞLANTISI<strong id="k-card-online-${r.id}"></strong></span><span>SON PAKET<strong id="k-card-age-${r.id}"></strong></span><a href="${locationFor('operations',audience,r.id)}" aria-label="${r.name} harekât ayrıntısını aç">Haritayı aç ↗</a></div><div class="k-region-note" id="k-card-note-${r.id}"></div></article>`).join('');
  }
  function hero(snapshot) {
    const {stage:s,regions}=snapshot;
    const online=regions.reduce((a,r)=>a+r.online,0),affected=regions.filter(r=>r.affected).length;
    const risk=snapshot.cursor>=STAGES[4].start&&snapshot.cursor<STAGES[9].start?1:0;
    const droneLost=regions.some(r=>r.assets.some(a=>a.destroyed));
    const detail=s.index===6&&droneLost?'Karatepe’de dron imha edilmiştir. Telsiz bağlantıları ve Güneyova’nın uzak HMI veri akışı kesilmiştir.':s.detail;
    put('k-hero',`<section class="k-hero" aria-label="Güncel operasyonel durum"><div><div class="k-hero-top">${icon(s.tone==='green'?'shield':'alert')}${observerView()?'<span>GÜNCEL DURUM</span>':`<span>ADIM ${String(s.index+1).padStart(2,'0')} / 10</span><span style="color:#597384">|</span><span>${s.phase.toLocaleUpperCase('tr-TR')}</span>`}</div><h2>${s.headline}</h2><p>${detail}</p></div><div class="k-hero-data"><div><small>SAHA BAĞLANTISI</small><strong class="${online<27?'k-critical':''}">${online}<em> / 27</em></strong><span>${snapshot.stage.index>=7?'26 etkin unsur · 1 dron imha':online<27?'Telsiz verisi alınamamaktadır':'Tüm saha unsurları bağlı'}</span></div><div><small>ETKİLENEN BÖLGE</small><strong class="${affected?'k-critical':''}">${affected}<em> / 4</em></strong><span>${affected?(s.index>=7?'Doğrulama sürmektedir':'Komuta / tesis etkisi'):'Bölgeler normal'}</span></div><div><small>TESİS HİZMETİ</small><strong class="${risk?'k-critical':''}">${risk?3:4}<em> / 4</em></strong><span>${risk?'Güneyova kısıtlı':s.index===7||s.index===8?'Geri kazanım sürmektedir':'Normal işletim'}</span></div></div></section>`);
  }
  function gridMarkup(r) {
    let lines='';for(let x=100;x<1200;x+=200)lines+=`<path d="M${x} 0V720"/><text x="${x+5}" y="705">${r.code}-${String(x/100).padStart(2,'0')}</text>`;
    for(let y=120;y<720;y+=200)lines+=`<path d="M0 ${y}H1200"/>`;
    return `<g stroke="#99c5c4" stroke-width=".6" opacity=".12" fill="none">${lines}</g><g fill="#99c5c4" font-size="9" opacity=".4"><text x="1110" y="28">N</text><path d="M1114 36v30m0-30-5 10m5-10 5 10" stroke="#a5cfcc" fill="none" stroke-width="1.5"/><path d="M42 665h100m-100-4v8m100-8v8" stroke="#a5cfcc"/><text x="42" y="686">500 m</text></g>`;
  }
  function unitSymbol(meta,x,y,color,selected=false) {
    const size=meta.kind==='air'?29:meta.kind==='fixed'?21:25;
    const prev=lastPos.get(meta.id);lastPos.set(meta.id,[x,y]);
    const glide=prev&&(prev[0]!==x||prev[1]!==y)&&Math.hypot(prev[0]-x,prev[1]-y)<60?` style="--fx:${prev[0].toFixed(1)}px;--fy:${prev[1].toFixed(1)}px;--tx:${x.toFixed(1)}px;--ty:${y.toFixed(1)}px;animation:k-glide .5s linear both"`:'';
    return `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)})"${glide}><circle class="k-map-halo" style="animation-delay:${ph(3)}" r="${selected?39:30}" fill="${color}" opacity=".1"/><circle class="k-marker-ring" r="${selected?23:19}" fill="#0b1c25" stroke="${color}" stroke-width="${selected?2:1.2}"/><g transform="translate(${-size/2} ${-size/2}) scale(${size/24})" fill="none" stroke="${color}" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${iconPaths[meta.kind]}</g></g>`;
  }
  function mapMarkup(regionState,detail=false,seconds=0) {
    const {r,assets,offline}=regionState;let paths='',actors='',targets='';const incident=r.id==='guneyova'&&stageAt(seconds).index>=4&&stageAt(seconds).index<=8;
    const reserved=incident?[{x:r.base[0]+114,y:r.base[1]-123,w:204,h:55}]:[];
    const lost=assets.find(a=>a.loss);if(lost)reserved.push(droneLabelBox(lost.loss,assets));
    const focused=detail?assets.find((a,j)=>selectedAsset?selectedAsset===a.id:j===0&&!incident):null;
    if(focused){const u=focused.meta;reserved.push({x:u.target[0]+10,y:u.target[1]-24,w:u.destination.length*6.5+12,h:22});}
    const labels=detail?layoutMapLabels(assets,reserved):null;
    assets.forEach((a,j)=> {
      const u=a.meta,p=a.reported,c=COLORS[a.tone],focus=detail&&(selectedAsset?selectedAsset===a.id:j===0&&!incident);
      if(u.route&&j<4)paths+=`<path d="M${u.route.map(p=>p.join(' ')).join('L')}Z" class="k-map-line" stroke="${c}" stroke-width="1.4" stroke-dasharray="5 9" opacity=".3"/>`;
      if(a.loss){actors+=droneLossMarkup(a,detail,assets);return;}
      if(a.orderChanged&&a.changedTarget){const t=a.changedTarget;paths+=`<path class="k-task-path" d="M${p.x} ${p.y}L${t.x} ${t.y}" fill="none" stroke="#f17f88" stroke-width="2" stroke-dasharray="7 7" opacity=".65"/><circle cx="${t.x}" cy="${t.y}" r="9" fill="#451f2e" stroke="#f17f88" stroke-width="2"/>`;}
      if(u.orbit)paths+=`<ellipse cx="${u.orbit.cx}" cy="${u.orbit.cy}" rx="${u.orbit.rx}" ry="${u.orbit.ry}" fill="none" stroke="${c}" opacity=".25" stroke-dasharray="5 8"/>`;
      if(a.drift) {
        paths+=`<circle cx="${a.truth.x}" cy="${a.truth.y}" r="20" fill="#16372ed9" stroke="${COLORS.green}" stroke-width="2"/><path d="M${a.truth.x-7} ${a.truth.y}h14m-7-7v14" stroke="${COLORS.green}" stroke-width="2"/><path d="M${a.truth.x} ${a.truth.y}L${p.x} ${p.y}" class="k-map-line" stroke="${COLORS.red}" stroke-dasharray="7 5" stroke-width="2.5"/><rect x="${(a.truth.x+p.x)/2-35}" y="${p.y+25}" width="70" height="25" rx="3" fill="#2b1c25e8" stroke="#b96878"/><text x="${(a.truth.x+p.x)/2}" y="${p.y+42}" fill="#ffb2bb" font-size="13" text-anchor="middle" style="stroke-width:0">650 m</text>`;
      }
      if(focus) {
        const tx=u.target[0],ty=u.target[1];
        targets+=`<path d="M${p.x} ${p.y}L${tx} ${ty}" stroke="${COLORS.cyan}" stroke-dasharray="7 7" opacity=".6" fill="none"/><g transform="translate(${tx} ${ty})" fill="${COLORS.cyan}"><path d="M0-10 10 0 0 10-10 0Z" fill="#0f2736" stroke="${COLORS.cyan}"/><text x="15" y="-10" font-size="11">${esc(u.destination)}</text></g>`;
        if(a.orderChanged){const m=a.changedTarget||r.changedTarget;targets+=`<path d="M${p.x} ${p.y}L${m.x} ${m.y}" stroke="${COLORS.red}" stroke-dasharray="7 5" stroke-width="2" fill="none"/><g transform="translate(${m.x} ${m.y})" fill="${COLORS.red}"><path d="M0-13 13 0 0 13-13 0Z" fill="#381e2a" stroke="${COLORS.red}" stroke-width="2"/><text x="-17" y="-16" font-size="11" text-anchor="end">${esc(m.name)} / DEĞİŞTİRİLDİ</text></g>`;}
      }
      const idLabel=detail||j===0||u.kind==='air';
      const label=labels?.get(a.id),lx=label?.x??cap(p.x-53,20,1050),ly=label?.y??cap(p.y+(a.drift?-47:34)-3,57,662);
      actors+=`<g class="k-map-unit" ${detail?`data-asset="${esc(a.id)}" tabindex="0" role="button" aria-pressed="${focus}" aria-label="${esc(a.id)}, ${esc(u.type)}${a.drift?', 650 metre konum sapması':''}"`:''}><title>${esc(a.id)} · ${esc(u.type)} · ${offline?'Son teyit edilen konum':a.drift?'650 m konum sapması':esc(u.task)}</title>${detail?`<path d="M${p.x} ${p.y}L${cap(p.x,lx,lx+113)} ${cap(p.y,ly,ly+23)}" stroke="${c}" stroke-width="1" opacity=".55"/>`:''}${unitSymbol(u,p.x,p.y,c,focus)}${a.radioBlocked?radioBlockedMarkup(p):''}${idLabel?`<rect class="k-map-label" x="${lx}" y="${ly}" width="113" height="23" rx="3" fill="#0b1b25ed" stroke="${c}" stroke-opacity=".6"/><text x="${lx+8}" y="${ly+16}" font-size="12" fill="${c}" style="stroke-width:0">${esc(a.id)}</text>`:''}</g>`;
    });
    let facility='';
    if(incident){const p=currentPlant(r,seconds),x=r.base[0]+80,y=r.base[1]-95,c=p.quality==='red'?COLORS.red:COLORS.amber;facility=`<g data-map-plc="${r.id}" role="button" tabindex="0" class="k-map-facility" aria-label="${r.code}-PLC-01 tesis uyarısını aç"><path d="M${r.base[0]} ${r.base[1]}L${x} ${y}" stroke="${c}" stroke-dasharray="5 5" stroke-width="2"/><circle class="k-incident-halo" cx="${x}" cy="${y}" r="45" fill="${c}" opacity=".13"/><rect x="${x-24}" y="${y-24}" width="48" height="48" rx="8" fill="#291d28" stroke="${c}" stroke-width="3"/><g transform="translate(${x-15} ${y-15}) scale(1.25)" fill="none" stroke="${c}" stroke-width="1.8">${iconPaths.plc}</g><rect x="${x+34}" y="${y-28}" width="204" height="55" rx="5" fill="#201b26f0" stroke="${c}" stroke-width="1.5"/><text x="${x+46}" y="${y-7}" fill="${c}" font-size="14" font-weight="600" style="stroke-width:0">${r.code}-PLC-01 / ${p.offline?'HMI KESİLDİ':p.quality==='red'?'SALDIRI ETKİSİ':'DOĞRULAMA'}</text><text x="${x+46}" y="${y+12}" fill="#d6c4ce" font-size="11" style="stroke-width:0">${p.offline?'Son örnek · bağımsız kanal açık':p.bias>3?'Ölçüm farkı '+fmt(p.bias,0)+' puan':'Hizmet kapasitesi %'+fmt(p.service)}</text></g>`;}
    return `<g opacity=".78"><use href="#terrain-${r.id}"/></g><rect width="1200" height="720" fill="#073344" opacity=".14"/>${gridMarkup(r)}${paths}${targets}${r.id==='karatepe'&&stageAt(seconds).index===6?radioZoneMarkup(r):''}${actors}${facility}`;
  }
  function renderCommand(snap) {
    const {stage:s,regions,cursor}=snap;
    regions.filter(r=>selected.includes(r.r.id)).forEach(rs=>{
      const id=rs.r.id,node=$('k-card-'+id);node.classList.toggle('affected',rs.affected);
      node.style.setProperty('--tone',COLORS[rs.tone]);
      put('k-card-status-'+id,`<i></i>${rs.label}`);$('k-card-status-'+id).className='k-region-status '+rs.tone;
      put('k-mini-'+id,mapMarkup(rs,false,cursor));
      put('k-mini-offline-'+id,rs.offline?`<div class="k-map-offline"><b>SON TEYİT EDİLEN KONUMLAR</b><span>${fmt(rs.age,1)} sn eski</span></div>`:'');
      setText('k-card-online-'+id,`${rs.online} / ${rs.total}`);setText('k-card-age-'+id,`${fmt(rs.age,1)} sn`);setText('k-card-note-'+id,rs.note);
      $('k-card-age-'+id).style.color=rs.offline?COLORS.red:'';
    });
    put('k-impact',`<div class="k-impact-body"><small>${s.target.toLocaleUpperCase('tr-TR')}</small><h3>${s.effect}</h3><p>${s.index<7?s.evidence:s.detail}</p><div class="k-impact-pair"><div><small>ETKİ ALANI</small><b>${s.index===0||s.index===9?'Normal işletim':s.index<4?'Komuta resmi':s.index<=6?'Komuta + tesis':'Geri dönüş'}</b></div><div><small>İZLENECEK EKRAN</small><b>${s.screen}</b></div></div></div>`);
    const allAssets=regions.flatMap(r=>r.assets),activeAssets=allAssets.filter(a=>!a.destroyed),correct=activeAssets.filter(a=>!a.offline&&!a.drift&&!a.orderChanged).length,connected=regions.reduce((n,r)=>n+r.online,0),integrity=correct/activeAssets.length*100,plants=REGION_DATA.map(r=>currentPlant(r,cursor)),critical=plants.filter(p=>p.service<98).length;
    put('k-services',serviceRow('Saha bağlantıları',connected/27*100,`${connected} / 27`,connected<27?'critical':'')+serviceRow('Konum / görev doğruluğu',integrity,`${correct} / ${activeAssets.length}`,integrity<100?'critical':'')+serviceRow('Normal tesis hizmeti',(4-critical)/4*100,`${4-critical} / 4`,critical?'critical':''));
    const affected=regions.filter(rs=>rs.affected);
    $('k-service-impact').hidden=affected.length===0;
    put('k-service-impact',affected.length?`<div class="k-service-impact" style="--impact-tone:${affected.some(rs=>rs.tone==='red')?COLORS.red:COLORS.amber}"><div><small>ETKİLENEN BÖLGE</small><strong>${affected.length}<em> / ${regions.length}</em></strong></div><p>${affected.map(rs=>esc(rs.r.short)).join(' · ')}</p></div>`:'');
    put('k-mini-events',STAGES.slice(Math.max(0,s.index-2),s.index+1).reverse().map(st=>`<div class="k-mini-event"><i style="background:${COLORS[st.tone]}"></i><div><time>${audience?mmss(snap.cursor-st.start)+' önce':'T+'+mmss(st.start)}</time><p>${st.name}</p></div></div>`).join(''));
  }
  function serviceRow(label,percent,value,kind=''){return `<div class="k-service ${kind}"><div><span>${label}</span><b>${value}</b></div><div class="k-bar"><i style="width:${cap(percent,0,100)}%"></i></div></div>`;}
  function renderOperations(snap) {
    hero(snap);const rs=snap.regions.find(r=>r.r.id===operationsRegion),r=rs.r;
    const asset=rs.assets.find(a=>a.id===selectedAsset)||rs.assets[0];document.querySelector('.k-operations-grid').style.setProperty('--map-state',COLORS[rs.tone]);
    put('k-map-heading',sectionHead(r.name,`${r.composition.toLocaleUpperCase('tr-TR')} / ${rs.label}`));
    const cameraFocus=scenarioFocus(snap.cursor),manual=cameraAuto&&Date.now()<cameraManualUntil;
    document.querySelectorAll('[data-camera-auto]').forEach(b=>b.setAttribute('aria-pressed',String(cameraAuto)));
    put('k-camera-caption',`<span class="${cameraAuto&&!manual&&cameraFocus?'active':''}"><i></i>${!cameraAuto?'MANUEL KAMERA':manual?'ELLE SEÇİM · '+Math.ceil((cameraManualUntil-Date.now())/1000)+' sn':'OTOMATİK KAMERA'}</span><b>${cameraAuto&&!manual&&cameraFocus?cameraFocus.reason:r.name}</b>`);
    put('k-mission-heading',sectionHead('Görev kaydı karşılaştırması','ONAYLI / BİLDİRİLEN'));
    put('k-operations-trend-heading',sectionHead('Konum farkı','MODEL GEÇMİŞİ · m'));
    put('k-main-map',mapMarkup(rs,true,snap.cursor));
    $('k-main-map').setAttribute('aria-label',r.name+' · Bildirilen ve bağımsız konumlar');
    setText('k-main-map-stamp',`${r.code} / SEKTÖR ${r.number} · ${r.terrain.toLocaleUpperCase('tr-TR')} · TEMSİLİ ARAZİ`);
    put('k-map-offline',rs.offline?`<div class="k-radio-banner"><b>TELSİZ BAĞLANTILARI ENGELLENDİ</b><span>Son saha paketi ${fmt(rs.age,1)} sn önce · Dron kaybı görsel olarak doğrulanmaktadır</span></div>`:'');
    put('k-asset-heading',sectionHead(asset.id,asset.meta.type));
    put('k-coordinates',`<div class="k-coordinate"><small>BAĞIMSIZ REFERANS${rs.offline?' / SON TEYİT':''}</small><strong>${fmt(asset.refCoord.lat,5)}° K<br>${fmt(asset.refCoord.lon,5)}° D</strong><span><i class="k-dot" style="background:${rs.offline?COLORS.muted:COLORS.green}"></i>${rs.offline?'Güncel referans alınamamaktadır':'Bağımsız konum kaydı'}</span></div><div class="k-coordinate report"><small>KOMUTA EKRANINDAKİ KONUM${rs.offline?' / SON ALINAN':''}</small><strong>${fmt(asset.coord.lat,5)}° K<br>${fmt(asset.coord.lon,5)}° D</strong><span><i class="k-dot k-tone-dot"></i>${asset.drift?'Referans kayıtla uyumsuzdur':rs.offline?'Yeni konum paketi yok':'Referans kayıtla uyumlu'}</span></div><div class="k-big-delta"><strong>${fmt(asset.drift)}</strong><span>metre<small style="display:block">${rs.offline?'Son teyit edilen konum farkı':'Konum farkı'}</small></span></div><div class="k-asset-telemetry">${asset.meta.metrics.slice(0,3).map(m=>`<div><small>${m.label}</small><b>${fmt(asset.values[m.key]??asset.meta.people,m.digits)} <em>${m.unit}</em></b></div>`).join('')}</div>`);
    put('k-mission',`<div class="k-mission"><small>ONAYLI GÖREV NOKTASI</small><b>${esc(asset.meta.destination)}</b><p>Bağımsız görev planındaki kayıt.</p></div><div class="k-mission current"><small>KOMUTA KAYDINDAKİ HEDEF${rs.offline?' / SON ALINAN':''}</small><b>${esc(asset.destination)}</b><p>${asset.orderChanged?'Onaylı görev planından farklı bir hedef yazıldı.':'Görev noktası onaylı planla uyumlu.'}</p></div>`);
    put('k-unit-table',`<table class="k-unit-table"><thead><tr><th>UNSUR</th><th>GÖREV / HEDEF</th><th>KONUM FARKI</th><th>HAREKET</th><th>VERİ YAŞI</th><th>DURUM</th></tr></thead><tbody>${rs.assets.map(a=>`<tr class="${a.id===asset.id?'highlight':''}"><td><button class="k-lab-link" data-asset="${esc(a.id)}" style="color:${a.id===asset.id?COLORS.cyan:'inherit'};border:0;background:none;padding:0;font:inherit">${a.id}</button><small>${a.meta.type}</small></td><td class="${a.orderChanged?'k-red':''}">${esc(a.destination)}</td><td class="${a.drift?'k-red':''}">${fmt(a.drift)} m${rs.offline?' *':''}</td><td>${rs.offline?'—':fmt(a.reported.speed,1)+' km/sa'}</td><td class="${rs.offline?'k-red':''}">${fmt(rs.age,1)} sn</td><td class="${a.destroyed?'k-red':a.offline?'k-muted':a.tone==='red'?'k-red':a.tone==='amber'?'k-amber':'k-green'}">${a.destroyed?'İMHA EDİLDİ':a.radioBlocked?'TELSİZ ENGELLENDİ':a.offline?'SON ALINAN':a.orderChanged?'GÖREV DEĞİŞTİ':a.drift?'KONUM SAPMASI':a.tone==='amber'?'DOĞRULAMA':'UYUMLU'}</td></tr>`).join('')}</tbody></table>${rs.offline?'<p class="k-subtitle" style="padding:10px 15px">* Bağlantı kesilmeden önceki konum farkı; güncel saha ölçümü değildir.</p>':''}`);
    put('k-position-trend',spark(snap.cursor,seconds=>regionSnapshot(r,seconds).assets.find(a=>a.id===asset.id).drift,0,800,'m',COLORS.red,`Konum farkı / ${asset.id}`));
    if(!selectedAsset&&r.id==='guneyova'&&snap.stage.index>=4&&snap.stage.index<=8){
      const p=currentPlant(r,snap.cursor);
      put('k-asset-heading',sectionHead('GO-PLC-01','İKMAL TESİSİ / AKTİF ODAK'));
      put('k-coordinates',`<div class="k-coordinate report"><small>LT-01 / UZAK HMI${p.offline?' · SON ÖRNEK':''}</small><strong>${fmt(p.shown,1)} %</strong><span>Komuta ekranına aktarılan ölçüm</span></div><div class="k-coordinate"><small>LT-02 / BAĞIMSIZ REFERANS</small><strong>${fmt(p.actual,1)} %</strong><span>Ayrı doğrulama kanalı</span></div><div class="k-big-delta"><strong>${p.offline?'—':fmt(p.bias,1)}</strong><span>puan<small style="display:block">${p.offline?'HMI örneği eski':'Ölçüm farkı'}</small></span></div><div class="k-asset-telemetry"><div><small>VANA</small><b>%${fmt(p.valve)}</b></div><div><small>ISI HEDEFİ</small><b>${fmt(p.heat)} °C</b></div><div><small>HİZMET</small><b>%${fmt(p.service)}</b></div></div>`);
      put('k-mission-heading',sectionHead('Tesis komutları','ONAYLI / BİLDİRİLEN'));
      put('k-mission',`<div class="k-mission"><small>ONAYLI İŞLETİM</small><b>Vana %70 · Isı hedefi ${p.cfg.temp} °C</b></div><div class="k-mission current"><small>${p.offline?'SON ALINAN KOMUT':'GEÇERLİ KOMUT'}</small><b>Vana %${fmt(p.valve)} · Isı hedefi ${fmt(p.heat)} °C</b></div>`);
      put('k-operations-trend-heading',sectionHead('Ölçüm farkı','MODEL GEÇMİŞİ · PUAN'));
      put('k-position-trend',spark(snap.cursor,t=>plantSnapshot(r,t).bias,0,50,'puan',COLORS.red,'LT-01 / LT-02 farkı'));
    }
    if(asset.loss){put('k-coordinates',`<div class="k-loss-status"><small>GÖRSEL TEYİT</small><strong>${asset.destroyed?'İMHA EDİLDİ':'KONTROL KAYBI'}</strong><p>${asset.id} · ${asset.destroyed?'Uçuş sona erdi.':'Düşüş izlenmektedir.'}</p></div><div class="k-coordinate"><small>${asset.destroyed?'İMHA KONUMU':'DÜŞÜŞ KONUMU'}</small><strong>${fmt(asset.coord.lat,5)}° K<br>${fmt(asset.coord.lon,5)}° D</strong><span>Görüntü üzerinden işaretlenen konum</span></div>`);put('k-mission',`<div class="k-mission"><small>UÇUŞ GÖREVİ</small><b>${asset.destroyed?'GÖREV SONA ERDİ':'UÇUŞ KONTROLÜ KAYBEDİLDİ'}</b><p>Gözetleme desteği kullanılamamaktadır.</p></div>`);}
    setText('k-map-monitor-eyebrow',`KALKAN-1 / SEKTÖR ${r.number} / ${r.terrain.toLocaleUpperCase('tr-TR')}`);
    setText('k-map-monitor-name',r.name);
    put('k-map-monitor-status',`<i style="background:${COLORS[rs.tone]}"></i><span style="color:${COLORS[rs.tone]}">${rs.label}</span><span class="k-map-monitor-status-detail">${r.composition}</span>`);
    if($('k-map-panel-toggle'))$('k-map-panel-toggle').setAttribute('aria-pressed',String(mapPanelVisible));
    $('k-main-map').setAttribute('viewBox',mapMonitor?'-40 -40 1280 800':'0 0 1200 720');
    $('k-main-map').setAttribute('preserveAspectRatio','xMidYMid meet');
  }
  function spark(cursor,fn,min,max,unit,color,label,secondFn=null,secondColor=COLORS.green) {
    const from=Math.max(0,cursor-90),to=Math.max(from+1,cursor),rows=Array.from({length:46},(_,i)=>{const t=from+(to-from)*i/45;return {t,v:fn(t),ref:secondFn?secondFn(t):null};});
    const path=key=>rows.map((v,i)=>`${i?'L':'M'}${(38+i/45*540).toFixed(1)} ${(91-cap((v[key]-min)/(max-min),0,1)*70).toFixed(1)}`).join('');
    const ticks=[min,(min+max)/2,max];
    return `<div class="k-trend-legend"><span><i style="background:${color}"></i>${label} (${unit})</span>${secondFn?`<span><i style="background:${secondColor}"></i>Bağımsız referans</span>`:''}</div><svg class="k-spark" viewBox="0 0 600 120" role="img" aria-label="${esc(label)}, ${unit}, son ${fmt(to-from)} ${audience?'saniye':'senaryo saniyesi'}"><title>${esc(label)}. Geçerli değer ${fmt(fn(cursor),1)} ${unit}. ${audience?'Ölçüm geçmişi.':'Modelden üretilen senaryo geçmişi.'}</title>${ticks.map(v=>{const y=91-(v-min)/(max-min)*70;return `<path d="M38 ${y}H578" stroke="#28414e" stroke-dasharray="3 5"/><text x="28" y="${y+4}" text-anchor="end" font-size="9" fill="#7d9aaa">${fmt(v)}</text>`;}).join('')}${STAGES.filter(s=>s.start>from&&s.start<to).map(s=>`<path d="M${38+(s.start-from)/(to-from)*540} 15V94" stroke="#8ba8b52b" stroke-dasharray="2 4"/>`).join('')}<path d="${path('v')}" stroke="${color}" stroke-width="2.4" fill="none" stroke-linejoin="round"/>${secondFn?`<path d="${path('ref')}" stroke="${secondColor}" stroke-width="2" stroke-dasharray="5 4" fill="none"/>`:''}<text x="38" y="113" fill="#7f9aaa" font-size="9">${audience?'−'+mmss(to-from):'T+'+mmss(from)}</text><text x="578" y="113" fill="#7f9aaa" font-size="9" text-anchor="end">${audience?'Şimdi':'T+'+mmss(cursor)}</text></svg>`;
  }
  function processMarkup(p) {
    const {cfg}=p,hot='#e38c88',cold='#72c9df',muted='#678495',ink='#d6e5ed',bad=p.quality==='red',offline=p.offline;
    const n=(v,d=0)=>fmt(v,d);
    const text=(x,y,value,size=12,color=ink,anchor='start',weight=400)=>`<text x="${x}" y="${y}" font-size="${size}" fill="${color}" text-anchor="${anchor}" font-weight="${weight}">${value}</text>`;
    const rect=(x,y,w,h,fill='#122b3a',stroke='#365665',rx=4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" stroke="${stroke}"/>`;
    const fd=p.service<40?4.2:1.7,run=i=>p.pumps?.[i]!==false;
    const wave='M0 0q17.1 -5 34.25 0'+'t34.25 0'.repeat(7)+'V12H0Z';
    const bub=(x0,h,j)=>[0,1,2,3,4].map(i=>`<circle class="k-bubble" style="animation-delay:${ph(3+i*.7)};animation-duration:${3+i*.7}s;--rise:${Math.max(10,h-14)}px" cx="${x0+25+i*24+j*3}" cy="430" r="${1.6+i%3*.7}" fill="#bfeaf5"/>`).join('');
    const pipe=(d,c,active=true)=>`<path d="${d}" stroke="${active?c:'#42545e'}" stroke-opacity=".16" stroke-width="18" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#050d14" stroke-width="14" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#35505f" stroke-width="11" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="#0a1822" stroke-width="8.5" fill="none" stroke-linejoin="round"/><path d="${d}" stroke="${active?c:'#42545e'}" stroke-width="6" fill="none" stroke-linejoin="round" opacity="${active?.85:1}"/>${active?`<path class="k-flow" style="animation-delay:${ph(fd)};animation-duration:${fd}s" d="${d}" stroke="#e9fbff" stroke-opacity=".8" stroke-dasharray="2 13" stroke-linecap="round" stroke-width="2.4" fill="none"/><path class="k-flow2" style="animation-delay:${ph(fd*3)};animation-duration:${fd*3}s" d="${d}" stroke="${c}" stroke-dasharray="16 44" stroke-linecap="round" stroke-width="3.4" fill="none"/>`:''}`;
    const pump=(x,y,tag,active=true,compact=false)=>{const index=Number(tag.slice(-2))-1;active=p.pumps?.[index]??active;return `<g class="k-plc-control" role="button" tabindex="0" aria-label="${tag} ${active?'durdur':'çalıştır'}" aria-pressed="${active}" data-plc-pump="${index}" data-plc-control-key="pump-${index}"><title>${tag}: ${active?'Durdur':'Çalıştır'}</title>${active?`<circle class="k-pump-glow" style="animation-delay:${ph(2)}" cx="${x}" cy="${y}" r="27" fill="none" stroke="${cold}" stroke-width="1.5"/>`:''}<circle cx="${x}" cy="${y}" r="23" fill="#132c39" stroke="${active?cold:muted}" stroke-width="2"/><path d="M${x-10} ${y-12} ${x+13} ${y} ${x-10} ${y+12}Z" fill="${active?cold:muted}"/>${text(x,y-32,tag,11,ink,'middle',600)}${compact?'':text(x,y+43,active?'ÇALIŞIYOR':'DURDU',8,active?COLORS.green:muted,'middle')}<circle class="k-control-hit" cx="${x}" cy="${y}" r="27"/></g>`;};
    const badge=(x,y,tag,value,unit,tone=cold)=>{const v=parseFloat(String(value).replace(',','.'));return rect(x,y,132,68,'url(#k-card)',tone)+`<rect x="${x}" y="${y}" width="132" height="3" rx="1.5" fill="${tone}" opacity=".85"/><circle class="k-led" style="animation-delay:${ph(1.6)}" cx="${x+121}" cy="${y+12}" r="3" fill="${tone}"/>`+text(x+10,y+18,tag,9,muted)+text(x+10,y+46,value,25,tone,'start',500)+text(x+120,y+46,unit,10,muted,'end')+(unit==='%'&&Number.isFinite(v)?`<rect x="${x+10}" y="${y+56}" width="112" height="3" rx="1.5" fill="#1b3646"/><rect x="${x+10}" y="${y+56}" width="${(cap(v,0,100)*1.12).toFixed(1)}" height="3" rx="1.5" fill="${tone}"/>`:'');};
    const control=(x,y,tag,value)=>{const key=tag==='P-01 / SÜRÜCÜ'?'driveHz':tag==='SICAKLIK HEDEFİ'?'heat':tag==='PLC / KONTROL'?'valve':null;return `<g ${key?`class="k-plc-control" role="button" tabindex="0" aria-label="${tag} ayarla" data-plc-panel="${key}" data-plc-control-key="panel-${key}-${x}"`:''}>`+rect(x,y,126,51,'#132b37','#3c5968')+text(x+10,y+17,tag,8,muted)+text(x+10,y+38,value,14,ink,'start',500)+(key?`<rect class="k-control-hit" x="${x}" y="${y}" width="126" height="51" rx="4"/>`:'')+'</g>';};
    let svg=`<defs><pattern id="k-plc-grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M30 0H0V30" fill="none" stroke="#314c5b" stroke-width=".6" opacity=".28"/></pattern><linearGradient id="k-tank-metal"><stop stop-color="#2b4654"/><stop offset=".3" stop-color="#3a5969"/><stop offset=".65" stop-color="#223e4c"/><stop offset="1" stop-color="#172e3b"/></linearGradient><linearGradient id="k-water-fill" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#4d9fb8" stop-opacity=".6"/><stop offset="1" stop-color="#245970" stop-opacity=".85"/></linearGradient><radialGradient id="k-bg" cx=".5" cy=".42" r=".75"><stop stop-color="#12303f"/><stop offset="1" stop-color="#08141d"/></radialGradient><linearGradient id="k-glass" x1="0" x2="1"><stop stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient><linearGradient id="k-card" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#16364a"/><stop offset="1" stop-color="#0b1d29"/></linearGradient></defs><rect width="1200" height="660" fill="url(#k-bg)"/><rect width="1200" height="660" fill="url(#k-plc-grid)"/>`;
    svg+=text(28,34,'ISI VE SU DAĞITIMI / PROSES RESMİ',11,muted,'start',600)+text(1170,34,`${p.r.code}-PLC-01 · YEREL CPU RUN`,10,COLORS.green,'end',500);
    svg+=pipe('M120 165H175',cold,run(0))+pipe('M221 165H360V230H455V270H485',cold,run(0))+pipe('M475 295H485',hot,run(1))+pipe('M558 238V230H778V238',hot,run(1))+pipe('M632 320H670V207H900V230H965V475',hot,run(2))+pipe('M852 320H875V207',hot,run(2))+pipe('M1108 350V542H689',cold,run(2))+pipe('M643 542H470V385H475',cold,run(2));
    svg+=rect(28,125,92,80,'#163748','#528b9f')+text(74,146,'SU BESLEME',9,cold,'middle',600)+text(74,174,'12,0',23,cold,'middle',500)+text(74,193,'°C',10,muted,'middle');
    svg+=pump(198,165,'P-01')+badge(268,115,'FT-01 / DOLUM',n(p.pump/100*36,1),'m³/sa')+control(268,44,'P-01 / SÜRÜCÜ',n(p.driveHz??p.pump/2,1)+' Hz');
    svg+=rect(385,244,90,181,'url(#k-tank-metal)','#658493')+text(430,226,'HX-01',13,ink,'middle',600);
    for(let i=0;i<7;i++)svg+=`<path d="M394 ${260+i*22} 429 ${273+i*22} 466 ${260+i*22}" stroke="${i%2?cold:hot}" stroke-width="3" fill="none" opacity=".8"/>`;
    svg+=pipe('M28 295H385',hot,run(1))+pipe('M385 385H300V465H28',cold,run(1))+pump(198,295,'P-02')+text(28,265,'ISI KAYNAĞI',11,hot,'start',600)+text(28,490,'KAYNAK DÖNÜŞÜ',10,cold)+text(430,454,'PLAKALI EŞANJÖR',9,muted,'middle');
    const tanks=[{x:485,tag:'TK-01 / PROSES',level:p.actual},{x:705,tag:'TK-02 / DENGE',level:p.actual}];
    tanks.forEach((t,j)=>{
      const fill=cap(t.level,0,100)/100*187,y=435-fill;
      svg+=`<defs><clipPath id="k-tank-clip-${j}"><rect x="${t.x+5}" y="248" width="137" height="187" rx="6"/></clipPath></defs>`;
      svg+=rect(t.x,238,147,207,'url(#k-tank-metal)','#54798a',10)+`<g clip-path="url(#k-tank-clip-${j})"><rect x="${t.x+5}" y="${y+4}" width="137" height="${Math.max(0,fill-4)}" fill="url(#k-water-fill)"/><g transform="translate(${t.x+5} ${y})"><path class="k-wave" style="animation-delay:${ph(3.2)}" d="${wave}" fill="#5fb7d1" fill-opacity=".35"/><path class="k-wave k-wave-b" style="animation-delay:${ph(2.1)}" d="${wave}" fill="#8adbf0" fill-opacity=".5"/></g>${bub(t.x,fill,j)}</g><rect x="${t.x+9}" y="246" width="9" height="190" rx="4.5" fill="url(#k-glass)"/>${[25,50,75].map(v=>`<path d="M${t.x+147} ${435-v*1.87}h-7" stroke="#9fc4d2" stroke-opacity=".5"/>`).join('')}<ellipse cx="${t.x+73.5}" cy="238" rx="73.5" ry="13" fill="#355462" stroke="#698a98"/>`;
      svg+=text(t.x+74,219,t.tag,10,ink,'middle',600)+text(t.x+74,343,n(p.actual,1)+' %',27,ink,'middle',500)+text(t.x+74,365,'YEREL PROSES / REFERANS',8,muted,'middle')+text(t.x+74,410,n(p.temp,1)+' °C',15,hot,'middle')+text(t.x+74,468,n(cfg.capacity/2,0)+' m³ KAPASİTE',9,muted,'middle');
      const targetY=435-cfg.target/100*187;svg+=`<path d="M${t.x+5} ${targetY}h137" stroke="#a8c7c9" stroke-dasharray="5 5" opacity=".5"/>`;
    });
    svg+=pipe('M558 445V500H778V445',cold,run(2))+pipe('M666 500V519',cold,run(2))+pump(666,542,'P-03');
    svg+=badge(486,96,'LT-01 / UZAK HMI',n(p.shown,1),'%',p.bias>3?COLORS.red:offline?muted:cold)+badge(706,96,'LT-02 / BAĞIMSIZ',n(p.actual,1),'%',COLORS.green);
    svg+=`<path d="M552 165V201m220-36v36M632 130H705" stroke="${p.bias>3?COLORS.red:muted}" stroke-dasharray="4 5" fill="none"/>`+text(668,120,p.bias>3?'≠':'=',18,p.bias>3?COLORS.red:COLORS.green,'middle',600);
    svg+=pipe('M852 230H965V475',hot,run(2))+badge(907,78,'TT-01 / GİDİŞ',n(p.temp,1),'°C',p.temp>=65?COLORS.red:hot)+control(1055,78,'SICAKLIK HEDEFİ',n(p.heat)+' °C');
    svg+=`<g transform="translate(965 243) rotate(90)" stroke="${p.valve<25?COLORS.red:'#95bccb'}" stroke-width="2" fill="#203b49"><path d="M-17-11 0 0-17 11Z M17-11 0 0 17 11Z"/><path d="M0 0V-25m-12 0h24" fill="none"/></g>`+text(995,238,'V-01',10,muted)+text(995,259,n(p.valve)+' %',17,p.valve<25?COLORS.red:ink);
    svg+=`<circle cx="965" cy="243" r="25" fill="none" stroke="#1b3646" stroke-width="3"/><circle cx="965" cy="243" r="25" fill="none" stroke="${p.valve<25?COLORS.red:cold}" stroke-width="3" stroke-linecap="round" stroke-dasharray="${(p.valve/100*157).toFixed(1)} 157" transform="rotate(-90 965 243)"/>`;
    svg+=`<g class="k-plc-control" role="button" tabindex="0" aria-label="V-01 vana açıklığını ayarla" data-plc-panel="valve" data-plc-control-key="valve"><circle class="k-control-hit" cx="965" cy="243" r="30"/></g>`;
    cfg.branches.forEach((branch,j)=>{
      const y=320+j*77,branchService=p.branchServices?.[j]??p.service;
      svg+=pipe(`M965 ${y}H1030`,hot,run(2)&&run(3+j))+pipe(`M1076 ${y}H1150V${y+30}H1108`,cold,run(2)&&run(3+j))+pump(1053,y,'P-0'+(4+j),true,true);
      svg+=rect(1122,y-19,62,38,'#1b303c','#4d6a78')+text(1153,y+5,'HX',11,p.service<40?COLORS.red:hot,'middle',600)+text(1185,y-29,branch,9,muted,'end')+text(1185,y+59,(offline?'SON TEYİT ':'')+n(branchService)+' %',10,offline?muted:p.service<40?COLORS.red:COLORS.green,'end');
    });
    svg+=badge(32,542,'PT-01 / DAĞITIM',n(p.pressure,1),'bar',p.pressure<2?COLORS.red:cold)+badge(183,542,'FT-02 / KULLANIM',n(p.flow,1),'m³/sa',p.service<40?COLORS.red:cold)+control(377,554,'PLC / KONTROL',p.operatorControlled?'YEREL / ELLE':p.locked?'KOMUT DENETİMİ':'OTOMATİK')+control(816,554,'HMI BAĞLANTISI',offline?'YENİ VERİ YOK':'BAĞLI')+control(1055,554,'ENERJİ / UPS','230 V / 24 V DC');
    if(!screenMonitor)svg+=text(28,639,(audience?'REFERANS KANALI:':'MODEL REFERANSI:')+' tank dolumları bağımsız LT-02 ölçümünü gösterir. Uzak HMI değeri LT-01 kutusundadır.',9,muted)+text(1170,639,offline?'UZAK VERİ DONDU / YEREL PLC ÇALIŞIYOR':p.locked?'GÜVENLİ YEREL REÇETE':audience?'PROSES İZLEME':'TEMSİLİ PROSES',9,offline?COLORS.red:p.locked?COLORS.green:muted,'end');
    const red=COLORS.red,pd=`style="animation-delay:${ph(2.4)}"`;
    const box=(x,y,w,h)=>`<rect class="k-plc-process-pulse" ${pd} x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="none" stroke="${red}" stroke-width="3"/>`;
    const ring=(cx,cy,r)=>`<circle class="k-plc-process-pulse" ${pd} cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${red}" stroke-width="3"/>`;
    const flag=(x,y,w,title,sub,x1,y1,x2,y2)=>`<g class="k-plc-process-pulse" ${pd}><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${red}" stroke-width="2"/><rect x="${x}" y="${y}" width="${w}" height="${sub?46:26}" rx="5" fill="#3a1b27" stroke="${red}" stroke-width="2"/><circle cx="${x+15}" cy="${y+13}" r="9" fill="${red}"/><text x="${x+15}" y="${y+17.5}" font-size="13" font-weight="700" fill="#2a0f18" text-anchor="middle">!</text><text x="${x+31}" y="${y+17}" font-size="13" font-weight="650" fill="#ffb4bd">${title}</text>${sub?`<text x="${x+31}" y="${y+35}" font-size="11" fill="#e6c0c7">${sub}</text>`:''}</g>`;
    if(p.quality==='red'){
      if(p.bias>3)svg+=box(480,90,144,80)+flag(486,56,178,'ÖLÇÜM UYUŞMUYOR',null,552,90,552,82);
      if(p.valve<25)svg+=ring(965,243,26)+flag(1012,184,184,p.operatorControlled?'V-01 YEREL KOMUT':'V-01 İZİNSİZ KOMUT','%70 → %'+n(p.valve)+' açıklık',985,236,1012,207);
      if(p.heat!==cfg.temp)svg+=box(1049,72,138,63)+flag(1041,140,160,'HEDEF → '+n(p.heat)+' °C',null,1118,135,1118,140);
      if(p.offline)svg+=box(810,548,138,63)+flag(816,508,150,'HABERLEŞME YOK',null,880,548,880,534);
    }
    return svg;
  }
  function renderPLCWarning(snap) {
    let warning=plcWarning(snap.cursor);const notice=$('k-plc-notice'),local=currentPlant(regionMap.get(plcRegion),snap.cursor);
    if(local.operatorControlled&&(!warning||plcRegion==='guneyova')&&!local.offline)warning={tone:local.bias>3?'red':'amber',label:local.bias>3?'WARN / ÖLÇÜM BÜTÜNLÜĞÜ':'YEREL KUMANDA',title:local.bias>3?'Bağımsız ölçüm farkı sürmektedir':'Operatör komutları uygulanmaktadır',detail:'Yerel pompa, vana ve ısıtma ayarları etkin.',value:local.bias>3?fmt(local.bias,1)+' puan':'%'+fmt(local.service),valueLabel:local.bias>3?'ÖLÇÜM FARKI':'HİZMET KAPASİTESİ',tag:local.r.code+'-PLC-01',event:'local-'+state.controlRev};
    if(!warning){put('k-plc-warning','');notice.hidden=true;plcNoticeKey='';return;}
    put('k-plc-warning',`<section class="k-plc-alert ${warning.tone}"><div class="k-plc-alert-icon">${icon('alert')}</div><div class="k-plc-alert-copy"><small>${warning.label} <span> / ${warning.tag}</span></small><h2>${warning.title}</h2><p>${warning.detail}</p>${plcRegion!=='guneyova'?'<button class="k-button" data-plc-jump="guneyova">Güneyova tesisine geç →</button>':''}</div><div class="k-plc-alert-stat"><strong>${warning.value}</strong><span>${warning.valueLabel}</span></div></section>`);
    const key=state.runId+':'+warning.event;
    if(warning.tone==='red'&&key!==plcNoticeKey){plcNoticeKey=key;plcNoticeUntil=Date.now()+12000;plcNoticeDismissed=false;put('k-plc-notice',`<div class="k-plc-notice-head">${icon('alert')} YENİ PLC UYARISI <button data-plc-dismiss aria-label="PLC bildirimini kapat">✕</button></div><h3>${warning.title}</h3><p>${warning.detail}</p><div class="k-plc-notice-foot"><span>${warning.tag} · ${observerView()?clock(Date.now()):'T+'+mmss(snap.cursor)}</span><button data-plc-dismiss>Gördüm</button></div>`);}
    notice.hidden=warning.tone!=='red'||plcNoticeDismissed||Date.now()>plcNoticeUntil;
  }
  function renderPLC(snap) {
    renderPLCWarning(snap);const r=regionMap.get(plcRegion),p=currentPlant(r,snap.cursor),{cfg}=p;
    renderScreenMonitor(r.name,cfg.name+' · '+(p.offline?'YENİ HMI VERİSİ YOK':p.quality==='red'?'KRİTİK UYARI':p.operatorControlled?'YEREL KUMANDA':p.quality==='amber'?'DOĞRULAMA':'NORMAL İŞLETİM'),p.offline?'muted':p.quality==='red'?'red':p.quality==='amber'?'amber':'green');
    $('k-process').setAttribute('viewBox',screenMonitor?'0 0 1200 620':'0 0 1200 660');
    const kpi=(label,value,unit,note,tone='')=>`<div class="k-kpi ${tone}"><small>${label}</small><strong>${value}<em>${unit}</em></strong><span>${note}</span></div>`;
    put('k-plc-kpis',kpi('LT-01 / UZAK HMI',fmt(p.shown,1),'%',p.offline?'SON ALINAN HMI ÖRNEĞİ':p.bias>3?'BAĞIMSIZ ÖLÇÜMLE UYUŞMUYOR':'ÖLÇÜM GÜNCEL',p.bias>3?'red':p.offline?'amber':'')+kpi('LT-02 / BAĞIMSIZ REFERANS',fmt(p.actual,1),'%','AYRI DOĞRULAMA KANALI')+kpi('DAĞITIM SICAKLIĞI',fmt(p.temp,1),'°C',p.offline?'SON TEYİT / UZAK HMI':'ONAYLI HEDEF '+cfg.temp+' °C',p.temp>65?'red':'')+kpi('V-01 / VANA AÇIKLIĞI',fmt(p.valve),'%',p.offline?'SON TEYİT / UZAK HMI':'ONAYLI İŞLETİM %70',p.valve<25?'red':'')+kpi('TESİS HİZMETİ',fmt(p.service),'%',p.offline?'SON TEYİT / YENİ VERİ YOK':p.service===100?'NORMAL KAPASİTE':'DAĞITIM / NORMAL KAPASİTE',p.service<40?'red':p.service<95?'amber':''));
    put('k-process-heading',sectionHead(cfg.name,`${r.code}-PLC-01 / ISI VE SU`));
    const focusKey=$('k-process').contains(document.activeElement)?document.activeElement.dataset.plcControlKey:null;
    put('k-process',processMarkup(p));
    if(focusKey)$('k-process').querySelector('[data-plc-control-key="'+focusKey+'"]')?.focus({preventScroll:true});
    $('k-process').setAttribute('aria-label',`${cfg.name}, tanklar, pompa, eşanjör, vana ve üç tesis kolu. Hizmet ${fmt(p.service)} yüzde. ${p.offline?'Uzak HMI güncellenmemektedir.':''}`);
    put('k-plc-offline',p.offline?`<div class="k-plc-offline">UZAK HMI ÖRNEĞİ DONDU · ${fmt(p.age,1)} sn eski<br><small>Yerel proses ve bağımsız LT-02 sensörü çalışmaktadır.</small></div>`:'');
    setText('k-plc-mode',p.mode+(p.locked?' · KOMUT YETKİLENDİRMESİ ETKİN':''));
    const compareRow=(label,value,kind='')=>`<div class="k-compare-row"><span>${label}</span><div class="k-compare-bar ${kind}"><i style="width:${cap(value,0,100)}%"></i></div><b>${fmt(value,1)}%</b></div>`;
    put('k-level-compare',`<div class="k-compare-title"><span>AYNI PROSES / İKİ ÖLÇÜM</span><span class="k-chip ${p.bias>3?'red':'green'}">${p.bias>3?'UYUMSUZ':'UYUMLU'}</span></div>${compareRow('LT-01 / HMI',p.shown,p.bias>3?'false':'')}${compareRow('LT-02 / Ref.',p.actual)}<div class="k-compare-delta"><b>${fmt(p.bias,1)} yüzde puan fark</b><span class="k-compare-explanation">${p.offline?'HMI değeri son alınan örnektir. LT-02 ayrı doğrulama kanalından güncellenir.':p.bias>3?'LT-01 değeri yüksek gösterilmektedir. Uzak HMI ölçümü bağımsız LT-02 ile uyuşmamaktadır.':'Uzak HMI ve bağımsız ölçüm birbiriyle uyumlu.'}</span></div>`);
    const alarms=[];
    if(p.operatorControlled&&!p.offline&&p.bias<=3&&p.valve>=25&&p.heat<=70){const stopped=p.pumps.map((on,i)=>on?null:'P-0'+(i+1)).filter(Boolean);alarms.push(['amber','Yerel operatör kumandası',stopped.length?stopped.join(', ')+' durdu.':'Yerel ayarlar uygulanmaktadır.']);}
    if(p.offline)alarms.push(['red','HMI haberleşme kaybı',`${fmt(p.age,1)} sn yeni HMI örneği yok. Yerel PLC çalışmaktadır.`]);
    if(p.bias>3)alarms.push(['red','Seviye ölçümleri farklı',`LT-01 / LT-02 farkı ${fmt(p.bias,1)} yüzde puan.`]);
    if(p.valve<25)alarms.push([p.operatorControlled?'amber':'red',p.operatorControlled?'Vana yerel komutla kısıldı':'Vana açıklığı onaylı değerden farklı',`Onaylı %70 → bildirilen %${fmt(p.valve)}.`]);
    if(p.heat>70)alarms.push([p.operatorControlled?'amber':'red',p.operatorControlled?'Yerel sıcaklık hedefi yüksek':'Sıcaklık hedefi değiştirildi',`${cfg.temp} °C → ${p.heat} °C. Onaylı reçeteyle uyumsuz.`]);
    if(p.locked)alarms.push(['green','PLC komut yetkilendirmesi etkin','Yetkisiz kontrol komutları reddedilmektedir. Bağımsız ölçüme dayalı yerel kontrol uygulanmaktadır.']);
    if(p.service<100&&p.quality==='amber')alarms.push(['amber',p.operatorControlled?'Hizmet yerel ayarlarla sınırlandı':'Hizmet kapasitesi geri kazanılmaktadır',`Dağıtım hizmeti normal kapasitenin %${fmt(p.service)} düzeyinde.`]);
    if(!alarms.length)alarms.push(['green','Ölçümler ve komutlar uyumlu','Onaylı işletim hedefleri korunmaktadır.']);
    put('k-plc-alarms',alarms.map(([tone,title,detail])=>`<div class="k-alarm ${tone}"><i></i><div><b>${title}</b><small>${detail}</small></div></div>`).join(''));
    put('k-plc-services',cfg.branches.map((b,i)=>{const service=p.branchServices?.[i]??p.service;return serviceRow(b,service,(p.offline?'Son ':'')+'%'+fmt(service),service<40?'critical':service<95?'caution':'');}).join(''));
    renderPlcControls();
    put('k-plc-trends',spark(snap.cursor,t=>plantSnapshot(r,t).shown,0,100,'%',COLORS.cyan,'LT-01 / HMI',t=>plantSnapshot(r,t).actual)+spark(snap.cursor,t=>plantSnapshot(r,t).temp,20,90,'°C','#e38c88','Dağıtım sıcaklığı'));
  }
  function recoveryChecks(snap) {return snap.health.checks.map(c=>`<div class="k-recovery-check ${c.ok?'pass':''}"><i>${c.ok?'✓':'!'}</i><div><b>${esc(c.title)}</b></div><strong>${esc(c.value)}</strong></div>`).join('');}
  function renderEvents(snap) {
    hero(snap);const s=snap.stage;
    const cause=audience?({1:'Geçerli komuta hesabının yetkisiz kullanılması',6:'Komuta ve HMI bağlantılarının kesilmesi'}[s.index]||s.cause):s.cause;
    const visibleStages=audience?STAGES.slice(0,s.index+1).reverse():STAGES;
    put('k-chain',visibleStages.map(st=>`<div class="k-chain-row ${st.index<s.index?'done':st.index===s.index?'active':'future'}"><i>${st.index<s.index?'✓':audience?'●':String(st.index+1).padStart(2,'0')}</i><time>${audience?mmss(snap.cursor-st.start)+' önce':'T+'+mmss(st.start)}</time><div><h3>${st.name}</h3><p>${st.index===s.index?st.evidence:st.effect}</p></div><small>${st.index===s.index?(audience?'GÜNCEL OLAY':'GEÇERLİ ADIM'):st.index<s.index?(audience?'OLAY KAYDI':'ÖNCEKİ ADIM'):`PLANLANAN · ${st.phase.toLocaleUpperCase('tr-TR')}`}</small></div>`).join(''));
    put('k-causal',[[s.index>=7?'MÜDAHALE':'TETİKLEYEN DEĞİŞİKLİK',cause,s.target],['DOĞRULAMA BULGUSU',s.evidence,audience?'Bağımsız kayıtlar üzerinden karşılaştırma.':'Bağımsız kayıtlar ve senaryo modeli üzerinden karşılaştırma.'],['SAHAYA / TESİSE ETKİ',s.effect,audience?(snap.health.verified?'Hizmet koşulları üç ardışık örnekte doğrulanmıştır.':'Etki, güncel telemetri ve bağımsız kayıtlarla izlenmektedir.'):s.action]].map(([tag,title,detail])=>`<div class="k-causal-step"><small>${tag}</small><strong>${title}</strong><p>${detail}</p></div>`).join(''));
    put('k-checks',recoveryChecks(snap));renderCaseTopology(snap);
  }
  function tlmPill(channel) {return `<span class="k-tlm-pill ${channel.tone}" title="${esc(channel.name+': '+channel.label)}"><i>${channel.tone==='good'?'✓':channel.tone==='bad'?'!':channel.tone==='warn'?'…':'—'}</i>${esc(channel.label)}</span>`;}
  function collectTelemetry(at=Date.now(),cursor=cursorAt(at)) {
    if(!telemetryFeed)telemetryFeed=createTelemetryFeed(state.runId,at);
    return updateTelemetryFeed(telemetryFeed,state.runId,cursor,at,new Map(REGION_DATA.map(r=>[r.id,currentPlant(r,cursor,at)])),state.controlRev||0);
  }
  function stopTelemetryAnimation() {
    if(telemetryFrame)cancelAnimationFrame(telemetryFrame);
    telemetryFrame=0;
  }
  function startTelemetryAnimation() {
    if(telemetryFrame||document.hidden)return;
    const frame=()=>{
      if(currentView!=='telemetry'||document.hidden){telemetryFrame=0;return;}
      const now=Date.now();
      if(collectTelemetry(now))render();
      if(telemetryChart&&now-telemetryChart.lastPaint>=32){
        paintTelemetrySignal(telemetryChart.source,now);telemetryChart.lastPaint=now;
      }
      telemetryFrame=requestAnimationFrame(frame);
    };
    telemetryFrame=requestAnimationFrame(frame);
  }
  function paintTelemetrySignal(source,now) {
    const chart=telemetryChart;if(!chart||chart.source.id!==source.id)return;
    const profile=telemetrySignalProfile(source,now);
    chart.bars.forEach((bar,i)=>{bar.style.transform='scaleY('+Math.max(.012,profile.bars[i]).toFixed(4)+')';});
    chart.wave.setAttribute('d',profile.wave.map((v,i)=>(i?'L':'M')+(i*360/64).toFixed(1)+' '+(120-v*120).toFixed(1)).join(' '));
    if(now-chart.lastMetrics>=160) {
      const field=chart.variant==='field';
      setText('k-scope-primary',source.offline?'—':fmt(field?profile.rssi:profile.quality,1));
      setText('k-scope-secondary',source.offline?'—':fmt(field?profile.snr:profile.latency,1));
      setText('k-scope-tertiary',source.offline?'—':fmt(field?profile.quality:profile.jitter,1));
      chart.lastMetrics=now;
    }
  }
  function renderTelemetryChart(source) {
    const root=$('k-stream-history-rows'),variant=source.plant?'plc':'field';
    if(telemetryChart?.root!==root||telemetryChart.variant!==variant) {
      const field=variant==='field';
      root.innerHTML=`<article class="k-measure-card" id="k-measure-card"><header><div><small>${field?'COORDINATE / POSITION':'PROCESS / LEVEL'}</small><h3>${field?'Konum bilgisi':'Su seviye ölçümü'}</h3></div><span class="k-measure-state" id="k-measure-state"></span></header>${field?`<div class="k-position-readout"><small>BİLDİRİLEN KONUM</small><div class="k-lat-lon"><div><span>ENLEM</span><strong id="k-position-lat"></strong></div><div><span>BOYLAM</span><strong id="k-position-lon"></strong></div></div><div class="k-reference-coord"><span>BAĞIMSIZ REFERANS</span><b id="k-position-reference"></b></div></div><div class="k-position-check"><svg viewBox="0 0 300 58" role="img" aria-label="Bildirilen ve referans konum farkı"><path d="M30 29H270" stroke="#355260" stroke-dasharray="3 5"/><circle cx="60" cy="29" r="13" fill="#16382d" stroke="#79d5b0" stroke-width="2"/><path d="M54 29h12m-6-6v12" stroke="#79d5b0"/><path id="k-position-gap" stroke="#f17f88" stroke-width="2"/><circle id="k-position-dot" cx="60" cy="29" r="6" fill="#79d5b0"/></svg><p id="k-position-verdict"></p></div>`:`<div class="k-level-instrument"><div><span>LT-01 / HMI</span><strong id="k-measure-shown"></strong><div class="k-level-meter"><i id="k-level-shown"></i></div><small>Bildirilen seviye</small></div><div><span>LT-02 / BAĞIMSIZ</span><strong id="k-measure-actual"></strong><div class="k-level-meter reference"><i id="k-level-actual"></i></div><small>Ayrı ölçüm kanalı</small></div></div><p class="k-measure-explain" id="k-level-verdict"></p>`}</article><article class="k-scope-card" id="k-scope-card"><header><div><small>${field?'RECEIVER / SIGNAL ENVELOPE':'HMI / NETWORK ACTIVITY'}</small><h3>${field?'Sinyal gücü':'HMI veri etkinliği'}</h3></div><span id="k-scope-state"></span></header><div class="k-scope-values"><div class="primary"><small>${field?'RSSI':'BAĞLANTI KALİTESİ'}</small><strong id="k-scope-primary"></strong><em>${field?'dBm':'%'}</em></div><div><small>${field?'SNR':'YANIT SÜRESİ'}</small><strong id="k-scope-secondary"></strong><em>${field?'dB':'ms'}</em></div><div><small>${field?'KALİTE':'JITTER'}</small><strong id="k-scope-tertiary"></strong><em>${field?'%':'ms'}</em></div></div><div class="k-scope-display" role="img" aria-label="Yerinde yükselip alçalan anlık sinyal genlik göstergesi"><div class="k-scope-grid"></div><div class="k-scope-bars">${Array.from({length:36},()=>'<i></i>').join('')}</div><svg viewBox="0 0 360 120" preserveAspectRatio="none" aria-hidden="true"><path id="k-scope-wave" fill="none" stroke="currentColor" stroke-width="1.3"/></svg><span class="k-scope-zero">0</span></div><div class="k-scope-caption"><span>ANLIK GENLİK PROFİLİ</span><span id="k-scope-caption"></span></div></article>`;
      telemetryChart={root,variant,source,bars:[...root.querySelectorAll('.k-scope-bars i')],wave:$('k-scope-wave'),lastPaint:0,lastMetrics:0};
    }
    const chart=telemetryChart;chart.source=source;
    const a=source.asset,p=source.plant,tone=source.channels[0].tone;
    $('k-measure-card').dataset.tone=tone;
    setText('k-measure-state',a?.destroyed?'İMHA EDİLDİ':source.offline?'SON ALINAN':tone==='bad'?'UYUŞMUYOR':tone==='warn'?'DOĞRULAMA':'UYUMLU');
    if(a) {
      setText('k-position-lat',fmt(a.coord.lat,5)+'° K');setText('k-position-lon',fmt(a.coord.lon,5)+'° D');
      setText('k-position-reference',fmt(a.refCoord.lat,5)+'° K · '+fmt(a.refCoord.lon,5)+'° D');
      const x=60+cap(a.drift/800,0,1)*200;
      $('k-position-dot').setAttribute('cx',x);$('k-position-dot').setAttribute('fill',a.drift?COLORS.red:COLORS.green);
      $('k-position-gap').setAttribute('d','M60 29H'+x);
      setText('k-position-verdict',a.destroyed?'KR-VTOL-01 · İmha konumu · Yeni uçuş verisi yok':source.offline?'Son teyit edilen koordinat · Yeni konum paketi yok':a.drift?'Referans konumdan '+fmt(a.drift)+' metre sapma':'Konum, bağımsız referansla uyumlu');
    } else {
      setText('k-measure-shown',fmt(p.shown,1)+' %');setText('k-measure-actual',fmt(p.actual,1)+' %');
      $('k-level-shown').style.width=cap(p.shown,0,100)+'%';$('k-level-actual').style.width=cap(p.actual,0,100)+'%';
      setText('k-level-verdict',source.offline?'HMI değeri son alınan örnektir. Bağımsız kanalda ölçüm sürmektedir.':p.bias>3?'İki ölçüm arasında '+fmt(p.bias,1)+' yüzde puan fark var.':'LT-01 ve bağımsız LT-02 ölçümleri uyumlu.');
    }
    $('k-scope-card').classList.toggle('offline',source.offline);
    $('k-scope-card').dataset.tone=source.tone;
    setText('k-scope-state',source.offline?'YENİ ÖLÇÜM YOK':source.tone==='bad'?'VERİ BÜTÜNLÜĞÜ İHLALİ':source.tone==='warn'?'DOĞRULAMA':'ALIM VAR');
    setText('k-scope-caption',source.offline?'Son değerler saklanmaktadır':source.tone==='bad'?'Bütünlük uyarısı · Veri alımı etkin':source.tone==='warn'?'Doğrulama sürmektedir':'Yerinde değişen seviye');
    const badge=$('k-stream-live-badge');badge.className='k-stream-live-badge '+(source.offline?'unknown':'good');
    setText('k-stream-feed-label',source.offline?'PAKET BEKLENİYOR':'ANLIK ÖLÇÜM');
    setText('k-stream-packet-id',source.packetSequence?'ÖRNEK #'+String(source.packetSequence).padStart(5,'0'):'ÖRNEK BEKLENİYOR');
    setText('k-stream-packet-time','Son paket '+clock(source.lastReceivedAt));
    paintTelemetrySignal(source,Date.now());startTelemetryAnimation();
  }
  function renderTelemetry(snap) {
    const now=Date.now();collectTelemetry(now,snap.cursor);
    const sources=telemetryFeedRows(telemetryFeed,now),counts={good:0,bad:0,warn:0,unknown:0};sources.forEach(row=>counts[row.tone]++);
    setText('k-tlm-step',observerView()?'GÜNCEL VERİ DURUMU':`ADIM ${String(snap.stage.index+1).padStart(2,'0')} / 10 · ${snap.stage.phase.toLocaleUpperCase('tr-TR')} · T+${mmss(snap.cursor)}`);
    setText('k-tlm-headline',sources.some(s=>s.plant?.operatorControlled)?'Yerel operatör komutları uygulanmaktadır':snap.stage.headline);
    put('k-tlm-counts',[['good','GÜNCEL'],['bad','UYUMSUZ'],['warn','DOĞRULAMA'],['unknown','VERİ YOK']].map(([tone,label])=>`<div class="${tone}"><strong>${counts[tone]}</strong><small>${label}</small></div>`).join(''));
    const focus=scenarioFocus(snap.cursor),key=state.runId+':'+snap.stage.index,fresh=telemetryEvent!==key;telemetryEvent=key;
    if(telemetryAuto&&focus&&(fresh||Date.now()>=telemetryManualUntil)){telemetryRegion=focus.region;telemetryFocus=focus.source;if(fresh)telemetryManualUntil=0;}
    let source=sources.find(s=>s.id===telemetryFocus&&s.region.id===telemetryRegion);if(!source){source=sources.find(s=>s.region.id===telemetryRegion)||sources[0];telemetryFocus=source.id;}
    put('k-stream-regions',REGION_DATA.map(r=>{const rows=sources.filter(s=>s.region.id===r.id),n=rows.filter(s=>s.tone!=='good').length;return `<button data-tlm-region="${r.id}" aria-pressed="${telemetryRegion===r.id}" class="${telemetryRegion===r.id?'active':''}"><span>${r.code}</span><b>${r.short}</b><small class="${n?'bad':'good'}">${n?n+' uyarı':rows.length+' güncel'}</small></button>`;}).join(''));
    put('k-stream-source-list',sources.filter(s=>s.region.id===telemetryRegion).map(s=>`<button class="k-stream-source ${s.id===source.id?'selected':''}" data-tlm-select="${esc(s.id)}" aria-pressed="${s.id===source.id}" title="${esc(s.type)}">${icon(s.kind)}<span><b>${s.id}</b><small>${esc(s.type)}</small></span><i class="${s.tone}"></i></button>`).join(''));
    const manual=Date.now()<telemetryManualUntil;
    setText('k-stream-follow-state',!telemetryAuto?'Elle seçim · otomatik odak kapalı':manual?'Elle seçim · '+Math.ceil((telemetryManualUntil-Date.now())/1000)+' sn sonra otomatik odak':'Otomatik odak · etkin veri kaynağı');
    document.querySelectorAll('[data-telemetry-auto]').forEach(b=>b.setAttribute('aria-pressed',String(telemetryAuto)));
    renderScreenMonitor('Telemetri',source.region.name+' · '+source.id+' · '+(source.asset?.destroyed?'İmha':TLM_LABELS[source.tone]),({good:'cyan',bad:'red',warn:'amber',unknown:'muted'})[source.tone]);
    setText('k-stream-source-type',source.region.name.toLocaleUpperCase('tr-TR')+' / '+source.type);
    put('k-stream-source-title',`${source.id}<span class="k-stream-quality ${source.tone}">${(source.asset?.destroyed?'İmha':TLM_LABELS[source.tone])}</span>`);
    renderTelemetryVisual(source,snap);
    if(telemetryDetail) {
      const source=sources.find(s=>s.id===telemetryDetail);if(source)renderTelemetryDetail(source,snap);
    }
  }
  function renderTelemetryVisual(source,snap) {
    const a=source.asset,p=source.plant;
    const values=a?[a.destroyed?'İMHA':fmt(a.drift)+' <em>m</em>',a.destroyed?'SONA ERDİ':a.offline?'SON GÖREV':a.orderChanged?'DEĞİŞTİ':'ONAYLI',fmt(source.age,1)+' <em>sn</em>']:[p.offline?'ESKİ ÖRNEK':fmt(p.bias,1)+' <em>puan</em>',p.offline?'SON KOMUT':source.channels[1].tone==='bad'?'İZİNSİZ':p.operatorControlled?'YEREL':p.locked?'KİLİTLİ':'ONAYLI',fmt(source.age,1)+' <em>sn</em>'];
    const notes=a?['Bildirilen / referans konum farkı',a.destination,a.offline?'Yeni paket alınmamaktadır':'Son alınan paketin yaşı']:['LT-01 / LT-02 ölçüm farkı',`Vana %${fmt(p.valve)} · Hedef ${fmt(p.heat)} °C`,p.offline?'Uzak HMI yeni veri almamaktadır':'HMI örneği güncel'];
    if(!$('k-stream-gauge-0'))put('k-stream-gauges',source.channels.map((c,i)=>`<article class="k-stream-gauge" id="k-stream-gauge-${i}"><div class="k-stream-status-ring"><svg viewBox="0 0 60 60" aria-hidden="true"><circle class="track" cx="30" cy="30" r="25"/><circle cx="30" cy="30" r="25" stroke-dasharray="140 17"/></svg><span id="k-stream-gauge-icon-${i}"></span></div><div><small id="k-stream-gauge-name-${i}"></small><strong id="k-stream-gauge-value-${i}"></strong><p id="k-stream-gauge-note-${i}"></p></div></article>`).join(''));
    source.channels.forEach((c,i)=>{
      $('k-stream-gauge-'+i).className='k-stream-gauge '+c.tone;
      setText('k-stream-gauge-icon-'+i,c.tone==='good'?'✓':c.tone==='bad'?'!':c.tone==='warn'?'…':'—');
      setText('k-stream-gauge-name-'+i,c.name.toLocaleUpperCase('tr-TR'));put('k-stream-gauge-value-'+i,values[i]);
      setText('k-stream-gauge-note-'+i,notes[i]);
    });
    renderTelemetryChart(source);
    const tile=(label,value,note='')=>`<div><small>${label}</small><strong>${value}</strong><span>${note}</span></div>`;
    const metricValues=a?a.meta.metrics.slice(0,3).map(m=>tile(m.key==='signal'?'SİNYAL / SON ÖRNEK':m.label,fmt(a.values[m.key]??a.meta.people,m.digits)+' <em>'+m.unit+'</em>',a.offline?'Son alınan örnek':m.key==='signal'?'Paket kaydındaki seviye':'Güncel örnek')).join('')+tile('VERİ YAŞI',fmt(source.age,1)+' <em>sn</em>',a.offline?'Son alınan paketten beri':'Son alınan örnek'):tile('LT-01 / HMI',fmt(p.shown,1)+' <em>%</em>',p.offline?'Son alınan örnek':'Operatör ekranı')+tile('LT-02 / BAĞIMSIZ',fmt(p.actual,1)+' <em>%</em>','Ayrı doğrulama kanalı')+tile('SICAKLIK',fmt(p.temp,1)+' <em>°C</em>',p.offline?'Son teyit':'Onaylı hedef '+p.cfg.temp+' °C')+tile('TESİS HİZMETİ',fmt(p.service)+' <em>%</em>',p.offline?'Son teyit':'Normal kapasiteye oran');
    put('k-stream-live-values',metricValues);
    setText('k-stream-focus-foot',a?.destroyed?'KR-VTOL-01 İMHA EDİLDİ · Kayıp işareti yeni tura kadar korunur.':p?.operatorControlled&&!source.offline?'YEREL KUMANDA · Debi '+fmt(p.flow,1)+' m³/sa · Hizmet %'+fmt(p.service)+' · Ölçümler alınan paketle güncellenir.':source.offline?'BAĞLANTI KESİLDİ · Değerler son alınan örnek; bağımsız PLC referansı ayrı kanaldır.':source.tone==='bad'?'VERİ BÜTÜNLÜĞÜ İHLALİ · Konum / ölçüm bozulmuş olsa da bağlantı sinyali normal kalabilir.':source.tone==='warn'?'DOĞRULAMA · Bağımsız kayıtlar ve ölçümler karşılaştırılmaktadır.':'DEĞERLER UYUMLU · Dalgalanan gösterge anlık bağlantı seviyesini gösterir.');
  }
  function renderTelemetryDetail(source,snap) {
    const {asset:a,plant:p}=source;
    setText('k-tlm-detail-title',source.id);setText('k-tlm-detail-type',`${source.region.name.toLocaleUpperCase('tr-TR')} / ${source.type}`);
    const tile=(label,value,note='',tone='')=>`<div class="k-tlm-detail-value ${tone}"><small>${label}</small><strong>${value}</strong>${note?`<span>${note}</span>`:''}</div>`;
    let values='';
    if(a) {
      values=tile('BİLDİRİLEN KONUM',`${fmt(a.coord.lat,5)}° K<br>${fmt(a.coord.lon,5)}° D`,a.offline?'Son alınan konum':'Komuta kaydındaki koordinat',a.drift?'bad':'')+tile('BAĞIMSIZ REFERANS',`${fmt(a.refCoord.lat,5)}° K<br>${fmt(a.refCoord.lon,5)}° D`,a.offline?'Son teyit edilen referans':'Bağımsız konum kaydı')+tile('KONUM FARKI',fmt(a.drift)+' m',a.offline?'Güncel karşılaştırma yok; son teyit farkı':'Bildirilen / referans konum',a.drift?'bad':'')+tile('GÖREV NOKTASI',esc(a.destination),'Onaylı: '+esc(a.meta.destination),a.orderChanged?'bad':'')+a.meta.metrics.map(m=>tile(m.label,fmt(a.values[m.key]??a.meta.people,m.digits)+' <em>'+esc(m.unit)+'</em>',a.offline?'Son alınan değer':'Güncel örnek')).join('');
    } else {
      values=tile('LT-01 / UZAK HMI',fmt(p.shown,1)+' %',p.offline?'Son alınan HMI örneği':'Operatör ekranındaki seviye',p.bias>3?'bad':'')+tile('LT-02 / BAĞIMSIZ',fmt(p.actual,1)+' %','Ayrı doğrulama kanalı')+tile('ÖLÇÜM FARKI',p.offline?'—':fmt(p.bias,1)+' puan',p.offline?'Örnek zamanları farklı; HMI verisi eski':'LT-01 ile LT-02 arasındaki fark',p.bias>3?'bad':'')+tile('V-01 / VANA',fmt(p.valve)+' %','Onaylı işletim: %70',p.valve<25?'bad':'')+tile('SICAKLIK HEDEFİ',fmt(p.heat)+' °C','Onaylı hedef: '+p.cfg.temp+' °C',p.heat>70?'bad':'')+tile('TESİS HİZMETİ',fmt(p.service)+' %',p.offline?'Son teyit edilen kapasite':'Normal kapasiteye oran',p.service<40?'bad':'');
    }
    const histories=telemetryFeedHistory(telemetryFeed,source.id,31,2);
    const history=source.channels.map((channel,j)=>`<div class="k-tlm-history-row"><span>${channel.name}</span><div class="k-tlm-history-cells" role="img" aria-label="${esc(channel.name)}: son 60 saniyenin durum geçmişi, şu an ${esc(TLM_LABELS[channel.tone])}">${histories.map(h=>`<i class="${h.source?h.source.channels[j].tone:'unknown'}${h.reference?' reference':''}" title="${h.reference?'Başlangıç referansı':clock(h.at)} · ${h.source?h.source.channels[j].label:'Bu aralıkta örnek kaydı yok'}"></i>`).join('')}</div>${tlmPill(channel)}</div>`).join('');
    put('k-tlm-detail-body',`<div class="k-tlm-detail-status">${source.channels.map(tlmPill).join('')}<span class="k-mono">Veri yaşı ${fmt(source.age,1)} sn</span></div>${source.offline?'<p class="k-tlm-detail-note">Yeni veri alınmamaktadır. Kaynak değerleri son alınan örnektir; PLC bağımsız referansı ayrı kanaldan izlenir.</p>':''}<div class="k-tlm-detail-grid">${values}</div><div class="k-tlm-history"><div class="k-tlm-history-head"><h3>Veri durumlarının geçmişi</h3><span>CANLI ÖRNEK GEÇMİŞİ · 2 sn / aralık</span></div>${history}<div class="k-tlm-history-axis"><span>−60 sn</span><span>Şimdi</span></div><p class="k-subtitle">Renkler alınan örneklerin durumunu gösterir. Soluk hücreler başlangıç referansıdır; gri aralıklarda yeni örnek kaydı yoktur.</p></div>`);
  }
  function renderScriptReader(stage) {
    const body=$('k-script-reader-body');
    if(stage.index!==1||!dmzGuideAllowed())dmzReaderActive=false;
    const cue=dmzReaderActive?DMZ_ACCESS_STEPS[dmzCueIndex]:null;
    const reading=cue?{...stage,name:cue.title,narration:cue.narration,screen:cue.screen}:stage;
    const key=String(stage.index)+':'+(cue?dmzCueIndex:'main');
    setText('k-script-reader-title',reading.name);
    setText('k-script-reader-count','ADIM '+String(stage.index+1).padStart(2,'0')+' / '+STAGES.length+(cue?' · TEKNİK '+String(dmzCueIndex+1).padStart(2,'0')+' / 06':''));
    setText('k-script-reader-estimate','Yaklaşık '+narrationSeconds(reading)+' sn okuma');
    setText('k-script-reader-screen',reading.screen);
    setText('k-reader-instruction',cue?'Teknik alt adımlar sunum aşamasını değiştirmemektedir. Son alt adımdan sonra sunum metnine dönülmektedir.':'Anlatımı bitirince “Sonraki adım” ile ilerleyiniz. Okuma görünümünde otomatik akış bekletilmektedir.');
    setText('k-script-reader-hint',cue?'Anlatım rehberi · Gerçek işlem yürütülmemektedir.':'Her adımın metni hazırdır.');
    if(body.dataset.stage!==key){put('k-script-reader-text',narrationMarkup(reading));body.dataset.stage=key;body.scrollTop=0;}
    $('k-script-reader-prev').disabled=cue?dmzCueIndex===0:stage.index===0;
    $('k-script-reader-next').disabled=!cue&&stage.index===STAGES.length-1;
    setText('k-script-reader-prev',cue?'← Önceki alt adım':'← Önceki adım');
    setText('k-script-reader-next',cue?(dmzCueIndex===DMZ_ACCESS_STEPS.length-1?'Sunum metnine dön ↩':'Sonraki alt adım →'):stage.index===STAGES.length-1?'Son adım':'Sonraki adım →');
  }
  function openScriptReader(technical=false) {
    if(currentView!=='director'||audience)return;
    if(state.playing)commit({playing:false});
    dmzReaderActive=technical===true&&dmzGuideAllowed()&&stageAt(cursorAt()).index===1;
    renderScriptReader(stageAt(cursorAt()));
    const reader=$('k-script-reader');if(!reader.open)reader.showModal();
    $('k-script-reader-body').scrollTop=0;$('k-script-reader-body').focus({preventScroll:true});
  }
  function soundButtonMarkup() {return `<button class="k-camera-auto k-sound-toggle" data-sound-toggle aria-pressed="false" title="Sesi bu ekranda aç">♪ Ses kapalı</button>`;}
  const WAZUH_ADDRESS_KEY='kalkan-wazuh-address-v1';
  function normalizeWazuhAddress(value){
    const raw=String(value||'').trim();if(!raw)return '';
    let url;try{url=new URL(raw);}catch{throw new Error('Geçerli bir Wazuh ana adresi giriniz.');}
    if(!['http:','https:'].includes(url.protocol)||!url.hostname||url.username||url.password||url.search||url.hash)throw new Error('Wazuh ana adresini http veya https ile, kullanıcı ve oturum bilgisi eklemeden giriniz.');
    return url.href;
  }
  let wazuhAddress='';
  try{wazuhAddress=normalizeWazuhAddress(localStorage.getItem(WAZUH_ADDRESS_KEY));}catch{}
  function analystDeskMarkup(){
    return `<section class="k-panel k-analyst-desk">${sectionHead('Mavi takım / Wazuh','HARİCÎ MONİTÖR')}<div class="k-analyst-desk-body"><p>Log incelemesi ve tehdit analizi, ayrı monitörde Wazuh üzerinden yürütülecektir.</p><div id="k-wazuh-launch"></div><details class="k-wazuh-settings" ${wazuhAddress?'':'open'}><summary>Wazuh adresi</summary><form id="k-wazuh-address-form"><label for="k-wazuh-address">Wazuh ana adresi</label><input id="k-wazuh-address" type="url" autocomplete="off" placeholder="https://wazuh-sunucusu" value="${esc(wazuhAddress)}"><button class="k-button" type="submit">Adresi kaydet</button></form></details><div class="k-analyst-focus"><small>GEÇERLİ AŞAMADA ODAK</small><p id="k-analyst-focus"></p></div><p class="k-analyst-handoff">Sahneyi ilerletmeden önce mavi takımın bulgu ve müdahale sonucunu teyit ediniz.</p></div></section>`;
  }
  function renderWazuhLaunch(){
    put('k-wazuh-launch',wazuhAddress?`<a class="k-button k-primary" href="${esc(wazuhAddress)}" target="_blank" rel="noopener noreferrer" data-wazuh-external>Wazuh’u ayrı pencerede aç ↗</a><small>Haricî uygulama · Bağlantı durumu bu arayüzden ölçülmemektedir.</small>`:'<button class="k-button" disabled>Wazuh adresi beklenmektedir</button>');
  }
  function saveWazuhAddress(e){
    e.preventDefault();
    try{wazuhAddress=normalizeWazuhAddress($('k-wazuh-address').value);try{localStorage.setItem(WAZUH_ADDRESS_KEY,wazuhAddress);}catch{}renderWazuhLaunch();toast(wazuhAddress?'Wazuh adresi kaydedilmiştir.':'Wazuh adresi kaldırılmıştır.');}
    catch(error){toast(error.message);}
  }
  function analystNotesMarkup(){
    return `<details class="k-analyst-notes"><summary>Analist çalışma notları · IOC / TTP / Müdahale</summary><div id="k-analyst-notes"></div></details><details class="k-analyst-attribution"><summary>Tehdit aktörü değerlendirmesi</summary><p>APT değerlendirmesi; IOC bağlamı, TTP’ler, araçlar, altyapı ve olay zaman çizelgesiyle birlikte yapılmalıdır. Teknik örtüşme tek başına kesin atıf oluşturmamaktadır. Taklit ve yanıltma ihtimali dikkate alınmalıdır.</p><p><b>Raporlama kalıbı:</b> “[Grup adı] ile [kanıtlanan teknik / prosedür / altyapı] yönünden benzerlik bulunmaktadır. Değerlendirme [düşük / orta / yüksek] güven düzeyindedir. Bu benzerlik, saldırının söz konusu grup tarafından gerçekleştirildiğini kanıtlamamaktadır. Yöntemlerin taklit edilmiş olabileceği değerlendirilmektedir.”</p><p>Yeterli bulgu bulunmadığında grup adı verilmemelidir. Mevcut gösterim tek başına bir APT grubuna atıf sağlamamaktadır.</p><a href="https://attack.mitre.org/groups/" target="_blank" rel="noopener noreferrer">MITRE ATT&CK Groups ↗</a> · <a href="https://unit42.paloaltonetworks.com/unit-42-attribution-framework/" target="_blank" rel="noopener noreferrer">Atıf değerlendirme yaklaşımı ↗</a></details><details class="k-analyst-architecture"><summary>Gösterim ve gerçek sistem ayrımı</summary><p>Bu dosya saha ve tesis etkilerini yerel modelle göstermektedir. Wazuh ayrı uygulama olarak açılacaktır. Log incelemesi, IOC doğrulaması ve TTP analizi mavi takım tarafından yürütülecektir.</p><p>Engellemeler, doğrulanan erişim yöntemine göre kimlik, ağ, uçnokta veya uygulama kontrollerinde uygulanmalıdır. Yapılandırılmış Active Response veya ilgili yönetim araçları kullanılabilir. Rejideki sahne geçişi siber engelleme uygulamamaktadır.</p><p>Backend, Wazuh’a analiz edilebilir uygulama ve erişim logları sağlamalıdır. Bağımsız referans, bildirilen telemetri ve kumanda kanalı ayrı tutulmalıdır.</p></details>`;
  }
  function renderAnalystNotes(snap){
    const item=ANALYST_STEPS[snap.stage.index];
    renderWazuhLaunch();setText('k-analyst-focus',item.focus);setText('k-presenter-proof',item.proof);
    put('k-analyst-cues',`<div><small>MAVİ TAKIM FAALİYETİ</small><p>${esc(item.focus)}</p></div><div><small>REJİ GEÇİŞ KONTROLÜ</small><p>${esc(item.handoff)}</p></div>`);
    put('k-analyst-notes',[["İNCELENECEK LOGLAR",item.logs],["ÇIKARILACAK ARTEFAKTLAR / IOC",item.ioc],["DAVRANIŞ ANALİZİ / TTP",item.ttp],["ERİŞİM YÖNTEMİNE UYGUN MÜDAHALE",item.response],["KANIT SINIRI",item.limit]].map(([title,content])=>`<div><small>${title}</small><p>${esc(content)}</p></div>`).join(''));
  }

  const ANALYST_STEPS=[
  {
    "focus": "Normal erişim ve uygulama davranışının Wazuh üzerinden incelenmesi.",
    "logs": "DMZ web erişimleri, güvenlik duvarı kuralları, iç entegrasyon ve uygulama kayıtları; normal hesap ve bağlantı örüntüsü.",
    "ioc": "Bu aşamada IOC tanımlanmamaktadır. Başlangıç kayıtları olay bağlamı için kullanılmaktadır.",
    "ttp": "Aktif saldırı tekniği eşlemesi yapılmamaktadır.",
    "response": "Müdahale, somut bulguya göre planlanmalıdır.",
    "proof": "27 saha unsuru, dört tesis, ayrı DMZ / KKBS / saha ağları ve izinli veri akışı.",
    "handoff": "Başlangıç durumunu gösteriniz. Mavi takımın log görünürlüğünü teyit ediniz.",
    "limit": "Gösterim, gerçek Wazuh bağlantısının veya log alımının kanıtı değildir."
  },
  {
    "focus": "DMZ servis ihlalinden iç entegrasyon sunucusuna uzanan erişim zincirinin analizi.",
    "logs": "DMZ web ve süreç kayıtları, sudo / auditd, özel anahtar dosyasına erişim, dış TCP/TLS bağlantısı, güvenlik duvarı ve hedef SSH kayıtları.",
    "ioc": "Dış kaynak IP, DMZ ajanının adresi, svc-web / svc-sync hesapları, anahtar parmak izi ve ilişkili süreç artefaktları bağlamıyla çıkarılmalıdır. Özel anahtarın kendisi loglanmamalıdır.",
    "ttp": "T1190 → T1548.003 → T1552.004 → T1090 → T1021.004 → T1098.004. Eşlemeler gerçek kayıtlarla doğrulanmalıdır.",
    "response": "İhlal edilen servis izole edilmeli; ele geçirilen anahtar iptal edilmeli; dış tünel, eski TCP/22 izni ve yetkisiz uygulama erişimi ilgili kontrollerde engellenmelidir.",
    "proof": "Wazuh üzerinde dış web isteği, DMZ süreç zinciri, anahtar erişimi, tünel ve hedef SSH oturumu.",
    "handoff": "Teknik alt adımları anlatınız. Her aşamada ilgili kaydı teyit ediniz. Kanıt incelemesi tamamlanmadan sunum süresini zorunlu ilerleme ölçütü olarak kullanmayınız.",
    "limit": "Mevcut frontend bu zinciri modellemektedir. VM, RCE, tünel ve yeni Wazuh kuralları henüz kurulmamıştır. Tünel firewall iznini aşmamaktadır. Ligolo ajanı için root zorunlu değildir."
  },
  {
    "focus": "Konum değişikliğinin hesap ve oturum kayıtlarıyla ilişkilendirilmesi.",
    "logs": "KKBS entegrasyon sunucusundaki SSH ve uygulama/API erişim kayıtları, konum değişiklikleri ve bağımsız konum ölçümü.",
    "ioc": "İşlem yapan uygulama hesabı, kaynak entegrasyon sunucusu ve oturum çıkarılmalıdır. 650 m sapma bir anomali bulgusudur.",
    "ttp": "T1565.001 · Stored Data Manipulation; değiştirilen kaydın saklanma biçimi kanıtla doğrulanmalıdır.",
    "response": "Yetkisiz kayıt değişikliği yolu ilgili uygulama ve erişim kontrolünde engellenmelidir.",
    "proof": "Haritada bildirilen konum, bağımsız konum ve 650 m fark.",
    "handoff": "Analistin değişikliği ilgili hesap veya oturumla ilişkilendirdiğini teyit ediniz.",
    "limit": "Konum kaydı manipülasyonu gerçek drona uçuş komutu göndermemektedir."
  },
  {
    "focus": "Görev değişikliklerinin davranış ve denetim kaydı analizi.",
    "logs": "Görev denetim kayıtları, yazma işlemleri, işlem hesabı ve görev yürütme logları.",
    "ioc": "Kaynak sistem, hesap, oturum ve değiştirilen kayıtlar çıkarılmalıdır. Varsa ilişkili dosya artefaktları incelenmelidir.",
    "ttp": "T1565.001 · Görev kaydı manipülasyonu. İşlemlerin prosedür düzeyindeki sırası ayrıca kaydedilmelidir.",
    "response": "İhlal edilen entegrasyon hesabının görev kaydı yazma yetkisi sınırlandırılmalıdır. Onaylı plan geri yüklenmelidir.",
    "proof": "Beş unsurun değişen hedefleri ve kırmızı görev güzergâhları.",
    "handoff": "Wazuh bulgusu ile görev değişikliği kaydı arasındaki ilişkiyi teyit ediniz.",
    "limit": "Genel bir ATT&CK tekniği tek başına belirli bir APT grubunu göstermemektedir."
  },
  {
    "focus": "HMI logları ve bağımsız ölçüm üzerinden manipülasyon analizi.",
    "logs": "HMI uygulama logları, değişiklik kayıtları, ilgili süreç kayıtları ve LT-02 ölçümü.",
    "ioc": "Varsa ilişkili süreç, dosya yolu ve dosya özeti çıkarılmalıdır. Zararlı ilişki kanıtlanmadan IOC olarak sunulmamalıdır.",
    "ttp": "T0832 · Manipulation of View. HMI gösterimi ile proses kumandası ayrı incelenmelidir.",
    "response": "Doğrulanan saldırı yolu ilgili uçnokta ve uygulama kontrollerinde engellenmelidir.",
    "proof": "LT-01 %88, LT-02 %58 ve 30 yüzde puanlık fark.",
    "handoff": "Analistin HMI değişikliği ile bağımsız ölçümü karşılaştırdığını teyit ediniz.",
    "limit": "Sensörler arasındaki fark, bir dosyanın zararlı olduğunu veya belirli bir grubun varlığını kanıtlamamaktadır."
  },
  {
    "focus": "Yetkisiz komut kaynağı ve erişim yetkilerinin analizi.",
    "logs": "PLC komut kayıtları, uygulama/API erişimleri, hesap rolü ve set değeri değişiklikleri.",
    "ioc": "Komutu veren hesap, kaynak uçnokta, oturum ve işlem zamanı çıkarılmalıdır.",
    "ttp": "T0836 · Modify Parameter; T1692.001 · Command Message. Eşleme gözlenen komuta göre yapılmalıdır.",
    "response": "Entegrasyon hesabının komut yetkisi ve uygulama oturumu sınırlandırılmalıdır. İlgili ağ geçidinde izinli komut politikası uygulanmalıdır.",
    "proof": "Vana %15, hedef 82 °C ve hizmet %26.",
    "handoff": "Sahne geçişini gerçek engelleme işlemi olarak sunmayınız.",
    "limit": "Wazuh log incelemesini desteklemektedir. Engelleme, yapılandırılmış yanıt veya ilgili yönetim kontrolü gerektirmektedir."
  },
  {
    "focus": "Bağlantı kaybının kök nedeninin ve fiziksel etkinin ayrıştırılması.",
    "logs": "Bağlantı ve sistem logları, son paket zamanı, HMI akışı ve bağımsız saha gözlemi.",
    "ioc": "Kesintiyle ilişkili hesap, kaynak ve olaylar çıkarılmalıdır. Sinyal kaybı tek başına IOC değildir.",
    "ttp": "T0815 · Denial of View, HMI görünürlük kaybı için değerlendirilebilir. Dron imhası fiziksel sonuçtur.",
    "response": "Doğrulanan ağ, uçnokta veya uygulama erişimi ilgili kontrolde engellenmelidir. Kesintinin kaynağına uygun işlem seçilmelidir.",
    "proof": "Dron imhası, telsiz kesintisi ve HMI paket yaşı.",
    "handoff": "Mavi takımın bağlantı kaybını ve bağımsız gözlemi birlikte değerlendirdiğini teyit ediniz.",
    "limit": "RF karıştırması veya belirli bir saldırı kaynağı, yalnız bağlantı kesintisinden çıkarılamaz."
  },
  {
    "focus": "Doğrulanan giriş yoluna uygun engelleme ve sonuç kontrolü.",
    "logs": "Anahtar iptali, tünel kesintisi, eski SSH kuralının kaldırılması, oturum sonlandırma ve müdahale sonrası erişim kayıtları.",
    "ioc": "Doğrulanmış IOC listesi; dayanak log, ilk/son görülme ve etkilenen varlık bilgileriyle korunmalıdır.",
    "ttp": "Gözlenen saldırı zinciri, girişten etkiye kadar zaman sırasıyla çıkarılmalıdır.",
    "response": "Mavi takım DMZ servisini izole etmeli, servis anahtarını iptal etmeli, dış tüneli kesmeli ve eski SSH iznini kaldırmalıdır. Uygulama oturumları sonlandırılmalı; sonuç yeni loglarla doğrulanmalıdır.",
    "proof": "Wazuh üzerinde müdahale sonrası kayıtlar; sahada korunan veri bozulmaları.",
    "handoff": "Mavi takım engelleme sonucunu teyit ettikten sonra geri yükleme sahnesine geçiniz.",
    "limit": "Reji düğmeleri kimlik, firewall veya PLC üzerinde gerçek engelleme uygulamamaktadır."
  },
  {
    "focus": "Geri yükleme, tekrar eden davranış ve hizmet kararlılığı kontrolü.",
    "logs": "Servis yaması, SSH anahtar ve sudo değişiklikleri, uygulama yetki düzenlemeleri, geri yükleme kayıtları ve yeni telemetri.",
    "ioc": "IOC’lerin yeniden görülüp görülmediği kontrol edilmelidir. Adli izler ve olay zaman çizelgesi korunmalıdır.",
    "ttp": "Gözlenen tekniklerin devam edip etmediği ve olası ek prosedürler incelenmelidir.",
    "response": "Adli izler korunduktan sonra kalıcılık anahtarları kaldırılmalı, servis zafiyeti ve sudo / uygulama izinleri düzeltilmelidir. Onaylı kayıtlar geri yüklenmeli; yeniden erişim izlenmelidir.",
    "proof": "Konum farkı 0 m, vana %70, hedef 48 °C ve hizmet %88.",
    "handoff": "Analistin geri yükleme ve tekrar kontrolü sonucunu teyit ediniz.",
    "limit": "Normalleşen bir grafik, saldırgan erişiminin tamamen sona erdiğini tek başına kanıtlamamaktadır."
  },
  {
    "focus": "IOC, TTP ve varsa tehdit aktörü benzerliğinin ihtiyatlı raporlanması.",
    "logs": "Olay zaman çizelgesi, doğrulanmış göstergeler, araç/altyapı artefaktları ve müdahale çıktıları.",
    "ioc": "IOC listesi, bağlam ve güven düzeyiyle raporlanmalıdır. Sahipliği veya zararlı niteliği doğrulanmamış değerler ayrı tutulmalıdır.",
    "ttp": "Teknik ve prosedür örtüşmesi bilinen profillerle karşılaştırılmalıdır. APT adı ancak yeterli kanıt varsa benzerlik olarak belirtilmelidir.",
    "response": "Kalıcı önlemler ve izleme ihtiyaçları belirlenmelidir. Fiziksel kayıp ayrı olay sonucu olarak korunmalıdır.",
    "proof": "26 etkin saha unsuru, dört tesis ve korunmuş dron imha kaydı.",
    "handoff": "Analistin raporunu esas alınız. Grup adı, kanıt ve güven düzeyi olmadan atıf yapmayınız.",
    "limit": "Taklit / yanıltma ihtimali korunmalıdır. Mevcut gösterim tek başına belirli bir APT grubuna atıf sağlamamaktadır."
  }
];

  let sessionDBPromise=null,sessionQueue=Promise.resolve(),sessionError='',recordBusy=false,lastRecordedAt=0;
  let preparedDownloadURL=null;
  let workbenchTab='evidence',replayBundle=null,replayIndex=0,replayPlaying=false,replayWall=0,replayOrigin=0,archiveSelection='';
  const liveCase=()=>state.caseData||emptyCase(state.runId,state.caseOpenedAt||state.anchor);
  function sessionDB(){
    if(sessionDBPromise)return sessionDBPromise;
    sessionDBPromise=new Promise((resolve,reject)=>{
      if(!window.indexedDB){reject(new Error('Tarayıcı oturum kaydını desteklememektedir.'));return;}
      const request=indexedDB.open('kalkan-evidence-sessions-v1',1);
      request.onupgradeneeded=()=>{const db=request.result;db.createObjectStore('sessions',{keyPath:'id'});for(const name of ['frames','events'])db.createObjectStore(name,{keyPath:['sessionId','sequence']}).createIndex('sessionId','sessionId');};
      request.onsuccess=()=>{const db=request.result;db.onversionchange=()=>db.close();resolve(db);};
      request.onerror=()=>reject(request.error||new Error('Oturum arşivi açılamamıştır.'));
      request.onblocked=()=>reject(new Error('Arşiv güncellemesi başka bir pencere tarafından bekletilmektedir.'));
    });return sessionDBPromise;
  }
  async function dbRead(store,key,index){
    const db=await sessionDB();return new Promise((resolve,reject)=>{const tx=db.transaction(store,'readonly'),source=index?tx.objectStore(store).index(index):tx.objectStore(store),req=key===undefined?source.getAll():index?source.getAll(key):source.get(key);req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);});
  }
  async function dbWrite(stores,write){
    const db=await sessionDB();return new Promise((resolve,reject)=>{const tx=db.transaction(stores,'readwrite');try{write(tx);}catch(error){tx.abort();reject(error);return;}tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error||new Error('Kayıt yazılamamıştır.'));tx.onabort=()=>reject(tx.error||new Error('Kayıt işlemi tamamlanmamıştır.'));});
  }
  function enqueueSession(task){
    const result=sessionQueue.then(task);sessionQueue=result.catch(error=>{sessionError=error?.message||'Tarayıcı kayıt alanına yazılamamıştır.';if(state.recording?.owner===windowId)commit({recording:null},'record-error');renderSessionStatus();});return result;
  }
  function sessionMeta(s){const data=s.caseData||emptyCase(s.runId,s.caseOpenedAt||s.anchor);return {id:data.id,runId:s.runId,openedAt:data.openedAt,data,caseRev:s.rev,recording:!!s.recording,endedAt:s.recording?null:Date.now()};}
  async function mutateSession(s,extraStore,mutate=()=>{}){
    const db=await sessionDB(),incoming=sessionMeta(s);
    return new Promise((resolve,reject)=>{
      const tx=db.transaction(extraStore?['sessions',extraStore]:['sessions'],'readwrite'),store=tx.objectStore('sessions'),get=store.get(incoming.id);let result,failure;
      get.onsuccess=()=>{try{const old=get.result||{},fresh=!old.caseRev||incoming.caseRev>=old.caseRev;result={frameCount:0,eventCount:0,...old,...(fresh?incoming:{})};mutate(tx,result);store.put(result);}catch(error){failure=error;tx.abort();}};
      tx.oncomplete=()=>resolve(result);tx.onerror=tx.onabort=()=>reject(failure||tx.error||new Error('Oturum kaydı tamamlanmamıştır.'));
    });
  }
  const saveMeta=s=>mutateSession(s);
  async function appendJournal(s,kind,text,source='director',relatedStage=null){
    const at=Date.now(),stage=Number.isInteger(relatedStage)?relatedStage:stageAt(s.cursor).index;
    await mutateSession(s,'events',(tx,meta)=>{meta.eventCount++;tx.objectStore('events').put({sessionId:meta.id,sequence:meta.eventCount,at,stage,eventId:incidentId(meta.id,stage),source,kind,text});});
  }
  function onSessionTransition(previous,next,kind='presentation',detail='',relatedStage=null){
    const was=!!previous.recording,now=!!next.recording,changedCase=previous.runId!==next.runId;
    if(changedCase){if(was||previous.caseData)void enqueueSession(()=>appendJournal({...previous,recording:null},'session-end','Yeni tura geçilmiştir. Önceki dosya korunmaktadır.')).catch(()=>{});return;}
    if(!was&&!now&&!next.caseData)return;
    let source='director',text=detail;
    if(!text){if(kind==='evidence'||kind==='times'||kind==='assessment'){source='analyst';text={evidence:'Analist bulgu dosyası güncellenmiştir.',times:'Analist UTC olay zamanlarını güncellemiştir.',assessment:'Tehdit aktörü değerlendirmesi güncellenmiştir.'}[kind];}
      else if(previous.curtain!==next.curtain){kind='curtain';text=next.curtain?'İzleyici bekleme ekranı açılmıştır.':'İzleyici yayınına dönülmüştür.';}
      else if(was!==now){kind=now?'record-start':'record-stop';text=now?'Gösterim ve telemetri kaydı başlatılmıştır.':'Kayıt durdurulmuştur.';}
      else if(stageAt(previous.cursor).index!==stageAt(next.cursor).index){kind='stage';source='model';text='Gösterim: '+STAGES[stageAt(next.cursor).index].name;}
      else if(kind==='plc'){source='model';text='Sanal PLC yerel kumandası değiştirilmiştir.';}
      else text=next.playing?'Sunum akışı başlatılmıştır.':'Sunum akışı duraklatılmış veya konumlandırılmıştır.';}
    if(['evidence','times','assessment'].includes(kind))source='analyst';if(kind==='plc')source='model';
    void enqueueSession(()=>appendJournal(next,kind,text,source,relatedStage)).catch(()=>{});
  }
  function packSessionFrame(snap,at,sequence){
    return {sessionId:liveCase().id,sequence,at,cursor:snap.cursor,stage:snap.stage.index,curtain:!!state.curtain,
      regions:snap.regions.map(rs=>({id:rs.r.id,assets:rs.assets.map(a=>({id:a.id,x:a.reported.x,y:a.reported.y,refX:a.truth.x,refY:a.truth.y,drift:a.drift,destroyed:a.destroyed,offline:a.offline,changed:a.orderChanged,tone:a.tone}))})),
      plants:REGION_DATA.map(r=>{const p=currentPlant(r,snap.cursor,at);return {id:r.id,actual:p.actual,shown:p.shown,temp:p.localTemp??p.temp,valve:p.valve,service:p.service,offline:p.offline};}),
      rows:telemetryFeedRows(telemetryFeed,at).map(r=>({id:r.id,region:r.region.id,metricLabel:r.metricLabel,metricValue:r.metricValue,tone:({good:'cyan',bad:'red',warn:'amber',unknown:'muted'})[r.tone]||'muted',offline:r.offline,age:r.age,link:r.link?.quality??0,lastReceivedAt:r.lastReceivedAt,packetSequence:r.packetSequence||0}))};
  }
  function recordSessionFrame(snap,force=false){
    const at=Date.now(),record=state.recording;
    if(!record||record.owner!==windowId||record.caseId!==liveCase().id||recordBusy||!force&&at-lastRecordedAt<1000)return;
    recordBusy=true;lastRecordedAt=at;const savedState=structuredClone(state),frame=packSessionFrame(snap,at,1);
    void enqueueSession(async()=>{
      await mutateSession(savedState,'frames',(tx,meta)=>{if(meta.frameCount>=10800)throw new Error('Üç saatlik kayıt sınırına ulaşılmıştır. Kaydı dışa aktarınız.');frame.sequence=++meta.frameCount;meta.lastFrameAt=at;tx.objectStore('frames').put(frame);});
    }).catch(()=>{}).finally(()=>{recordBusy=false;renderSessionStatus();});
  }
  function freshSessionSnapshot(){const cursor=cursorAt(),stage=stageAt(cursor),at=Date.now();collectTelemetry(at,cursor);return {cursor,stage,regions:REGION_DATA.map(r=>regionSnapshot(r,cursor))};}
  async function toggleSessionRecording(){
    if(currentView!=='director'||audience)return;
    try{await sessionQueue;await sessionDB();sessionError='';
      if(state.recording?.owner===windowId){recordSessionFrame(freshSessionSnapshot(),true);await sessionQueue;commit({recording:null},'record-stop');}
      else{if(state.recording?.owner&&peerAlive(state.recording.owner))throw new Error('Kayıt başka bir açık reji penceresinde sürmektedir. Önce o pencerede durdurunuz.');
        const data=liveCase();commit({caseData:data,caseOpenedAt:data.openedAt,recording:{caseId:data.id,owner:windowId,since:Date.now()}},'record-start');lastRecordedAt=0;recordSessionFrame(freshSessionSnapshot(),true);}
      await sessionQueue;await refreshArchives();renderSessionStatus();
    }catch(error){sessionError=error.message;toast(sessionError);renderSessionStatus();}
  }
  async function bundleFor(id=liveCase().id){
    await sessionQueue;if(id===liveCase().id)await enqueueSession(()=>saveMeta(state));
    const [session,frames,events]=await Promise.all([dbRead('sessions',id),dbRead('frames',id,'sessionId'),dbRead('events',id,'sessionId')]);
    if(!session)throw new Error('Oturum kaydı bulunamamıştır.');
    frames.sort((a,b)=>a.sequence-b.sequence);events.sort((a,b)=>a.sequence-b.sequence);return {schema:CASE_SCHEMA,session,frames,events};
  }
  function downloadSessionFile(name,content,type){
    if(preparedDownloadURL)URL.revokeObjectURL(preparedDownloadURL);preparedDownloadURL=URL.createObjectURL(new Blob([content],{type}));const link=$('k-case-download-link');link.href=preparedDownloadURL;link.download=name;link.textContent=name+' ↓';const view=$('k-case-report-view');view.hidden=!type.startsWith('text/html');view.href=preparedDownloadURL;$('k-case-download-ready').hidden=false;link.click();
  }
  async function exportSession(kind){
    try{const bundle=await bundleFor(archiveSelection||liveCase().id),id=bundle.session.id;
      if(kind==='report')downloadSessionFile(id+'_Sonuc_Raporu.html',caseReport(bundle),'text/html;charset=utf-8');
      else if(kind==='journal')downloadSessionFile(id+'_Olay_Kayitlari.jsonl',bundle.events.map(e=>JSON.stringify({...e,case_id:id,event_id:e.eventId})).join('\n')+'\n','application/x-ndjson');
      else downloadSessionFile(id+'_Oturum.json',JSON.stringify(bundle),'application/json');
      toast(kind==='report'?'Sonuç raporu hazırlanmıştır.':'Oturum kaydı dışa aktarılmıştır.');
    }catch(error){toast('Dosya hazırlanamamıştır: '+error.message);}
  }
  function caseToolbarMarkup(){return `<div class="k-case-toolbar" aria-label="Oturum ve yayın araçları"><span id="k-case-toolbar-status"></span><div><button class="k-button" data-broadcast-open>Yayın kontrolü</button><button class="k-button" data-case-open="evidence">Bulgu dosyası</button><button class="k-button" data-case-open="recording">Kayıt / Tekrar</button><button class="k-button" data-case-report>Sonuç raporu ↓</button><button class="k-button k-curtain-toggle" data-case-curtain aria-pressed="false">Bekleme ekranı</button></div></div>`;}
  function caseWorkbenchMarkup(){
    const options=Object.entries(CASE_ROLES).map(([id,name])=>`<option value="${id}">${name}</option>`).join('');
    return `<dialog id="k-case-dialog" class="k-case-dialog" aria-labelledby="k-case-title"><header><div><small>REJİ · ÖZEL ÇALIŞMA ALANI</small><h2 id="k-case-title">Olay dosyası</h2><p id="k-case-dialog-id"></p></div><button class="k-button" data-case-close aria-label="Olay dosyasını kapat">Kapat ×</button></header><nav class="k-case-tabs" aria-label="Olay dosyası bölümleri"><button data-case-tab="evidence" aria-pressed="true">Bulgular / Saldırı yolu</button><button data-case-tab="times" aria-pressed="false">Olay süreleri</button><button data-case-tab="assessment" aria-pressed="false">APT değerlendirmesi</button><button data-case-tab="recording" aria-pressed="false">Kayıt / Tekrar oynatma</button></nav><p class="k-case-feedback" id="k-case-feedback" role="status"></p><div class="k-case-dialog-body"><div id="k-case-download-ready" class="k-case-download-ready" hidden><span>Dosya hazırdır. İndirme başlamadıysa bağlantıyı kullanınız.</span><div><a id="k-case-report-view" class="k-button" target="_blank" rel="noopener noreferrer" hidden>Raporu aç / Yazdır ↗</a><a id="k-case-download-link" class="k-button k-primary" download>Dosyayı indir</a></div></div><section data-case-page="evidence"><div class="k-case-two"><form id="k-case-evidence-form" class="k-case-form"><h3>Kanıt ekle</h3><p>Wazuh alarmı veya ham log referansını giriniz. Müdahale sonucunu ilgili yönetim aracı kaydıyla ilişkilendiriniz.</p><div class="k-case-fields"><label>İlişkili olay<select name="stage">${STAGES.map(s=>`<option value="${s.index}">${String(s.index+1).padStart(2,'0')} · ${esc(s.name)}</option>`).join('')}</select></label><label>Kayıt türü<select name="kind">${Object.entries(CASE_KINDS).map(([id,name])=>`<option value="${id}">${name}</option>`).join('')}</select></label><label>Olay zamanı (UTC)<input type="datetime-local" step="1" name="at" required></label><label>Güven düzeyi<select name="confidence"><option>düşük</option><option>orta</option><option>yüksek</option></select></label></div><label>Kanıt referansı<input name="ref" maxlength="240" required placeholder="Wazuh alert ID / rule ID / ham log referansı"></label><label>Bulgu ve bağlam<textarea name="summary" maxlength="700" rows="3" required placeholder="Gözlenen davranış, etkilenen kaynak ve doğrulama sonucu"></textarea></label><div class="k-case-fields"><label>IOC türü<select name="iocType"><option>IPv4 / IPv6</option><option>Alan adı</option><option>URL</option><option>SHA-256</option><option>Hesap</option><option>Diğer</option></select></label><label>IOC değeri / ATT&CK tekniği<input name="value" maxlength="300" placeholder="IOC veya T1078"></label></div><details class="k-case-edge-form"><summary>Doğrulanan erişim bağlantısı ekle</summary><div class="k-case-fields"><label>Kaynak sistem<select name="from"><option value="">Seçilmemiştir</option>${options}</select></label><label>Hedef sistem<select name="to"><option value="">Seçilmemiştir</option>${options}</select></label></div><label class="k-case-check"><input name="confirmed" type="checkbox"> Bu bağlantı, yazdığım kanıt referansıyla doğrulanmıştır.</label><p>İşaretlenen bağlantılar olay akışı monitöründe yayınlanacaktır. Ham IOC ve log metni rejide kalacaktır.</p></details><button class="k-button k-primary" type="submit">Bulguyu kaydet</button></form><div><h3>Doğrulanan saldırı yolu</h3><div id="k-case-topology" class="k-case-topology"></div><h3>Bulgu kayıtları</h3><div id="k-case-evidence-list"></div></div></div></section><section data-case-page="times" hidden><h3>Gerçek olay zamanları</h3><p class="k-case-intro">Loglardaki UTC zamanlarını ve kanıt referanslarını giriniz. Tespit, kontrol altına alma ve hizmeti geri kazanma süreleri bu kayıtlardan hesaplanacaktır. Sunum saati bu ölçümü etkilememektedir.</p><div id="k-case-metrics" class="k-case-metrics"></div><form id="k-case-times-form" class="k-case-form">${Object.entries(CASE_TIME_LABELS).map(([key,label])=>`<div class="k-case-time-row"><label>${label}<input type="datetime-local" step="1" name="${key}" aria-label="${label} (UTC)"></label><button type="button" class="k-button" data-case-now="${key}">Şimdi (UTC)</button><label>Kanıt referansı<input name="${key}Ref" maxlength="240" aria-label="${label} kanıt referansı"></label></div>`).join('')}<button class="k-button k-primary" type="submit">Olay zamanlarını kaydet</button><p>İlk faaliyet zamanı bilinmiyorsa boş bırakınız. Eksik zamanlar için süre üretilmemektedir. Bunlar tek olaya ait sürelerdir; ortalama MTTD / MTTR olarak adlandırılmamaktadır.</p></form></section><section data-case-page="assessment" hidden><h3>Kanıta dayalı tehdit aktörü değerlendirmesi</h3><p class="k-case-intro">Bir grubun adını yalnız teknik benzerliği destekleyen kanıt varsa giriniz. ATT&CK tekniğinin tek başına örtüşmesi kesin atıf sağlamamaktadır.</p><form id="k-case-actor-form" class="k-case-form"><div class="k-case-fields"><label>Benzerlik değerlendirilen grup<input name="name" maxlength="100" placeholder="Kanıt yoksa boş bırakınız"></label><label>Değerlendirme güveni<select name="confidence"><option>belirsiz</option><option>düşük</option><option>orta</option><option>yüksek</option></select></label></div><label>Kanıt ve benzerlik gerekçesi<textarea name="basis" maxlength="1000" rows="4" placeholder="Prosedür, araç, altyapı ve zaman çizelgesi referansları"></textarea></label><label>Alternatif açıklamalar<textarea name="alternatives" maxlength="700" rows="3" placeholder="Taklit, ortak araç kullanımı, yanıltıcı izler"></textarea></label><button class="k-button k-primary" type="submit">Değerlendirmeyi kaydet</button></form><p id="k-case-actor-statement" class="k-case-note"></p></section><section data-case-page="recording" hidden><div class="k-case-record-head"><div><h3>Oturum kaydı</h3><p id="k-case-record-status"></p></div><button class="k-button k-primary" data-case-record>Kaydı başlat</button></div><p class="k-case-intro">Saha konumları, PLC ölçümleri ve 31 telemetri kaynağı saniyede bir kaydedilmektedir. Sahne geçişleri, yerel kumanda ve analist kayıtları zaman çizelgesine eklenmektedir. Wazuh ekran videosu kaydedilmemektedir. Tarayıcı kapanmadan önce kaydı JSON olarak dışa aktarınız.</p><div class="k-case-archive-row"><label>Oturum arşivi<select id="k-case-archives" aria-label="Oturum arşivi"></select></label><button class="k-button" data-case-archive-refresh>Yenile</button><button class="k-button" data-case-replay-load>Kaydı aç</button></div><div class="k-case-export-row"><button class="k-button" data-case-export="json">Oturumu indir · JSON</button><button class="k-button" data-case-export="journal">Olay kayıtları · JSONL</button><button class="k-button" data-case-export="report">Sonuç raporu · HTML / PDF</button><label class="k-button k-case-import">Kayıt içe aktar<input type="file" id="k-case-import" accept="application/json,.json"></label></div><p class="k-case-note">Tekrar oynatma yalnız bu özel pencerede gerçekleşmektedir. Canlı yayın, PLC kumandaları ve güncel olay dosyası değişmemektedir. Bekleme ekranı KALKAN pencerelerini kapsamaktadır; haricî Wazuh penceresini kapatmamaktadır.</p><div id="k-case-replay" hidden><div class="k-case-replay-controls"><button class="k-button" data-case-replay="previous">← Örnek</button><button class="k-button k-primary" data-case-replay="play">Oynat</button><button class="k-button" data-case-replay="next">Örnek →</button><strong id="k-case-replay-time"></strong><span id="k-case-replay-position"></span></div><input id="k-case-replay-range" aria-label="Kayıt zaman çizelgesi" type="range" min="0" max="0" value="0"><p id="k-case-replay-gap" class="k-case-note" hidden></p><div id="k-case-replay-maps" class="k-case-replay-maps"></div><div class="k-case-two"><div><h3>Kaydedilen telemetri</h3><div class="k-case-table-wrap" id="k-case-replay-telemetry"></div></div><div><h3>Olay ve müdahale zaman çizelgesi</h3><div id="k-case-replay-journal"></div></div></div></div><p id="k-case-replay-empty" class="k-case-empty">İncelemek için bir kayıt açınız.</p></section></div></dialog><div id="k-case-curtain" hidden><div><span>K1</span><small>KOMUTA KONTROL MERKEZİ</small><h1>Yayın bekletilmektedir.</h1><p>Gösterim kısa süre içinde devam edecektir.</p></div></div>`;
  }
  function caseFeedback(message,error=false){setText('k-case-feedback',message);$('k-case-feedback')?.classList.toggle('error',error);}
  function switchCaseTab(tab){
    if(!['evidence','times','assessment','recording'].includes(tab))return;
    workbenchTab=tab;document.querySelectorAll('[data-case-page]').forEach(el=>el.hidden=el.dataset.casePage!==tab);document.querySelectorAll('[data-case-tab]').forEach(el=>el.setAttribute('aria-pressed',String(el.dataset.caseTab===tab)));
    if(tab==='recording')void refreshArchives();
  }
  function fillCaseForms(){
    const data=liveCase(),ef=$('k-case-evidence-form');ef.elements.namedItem('stage').value=String(stageAt(cursorAt()).index);ef.elements.namedItem('at').value=utcInput(Date.now());
    const tf=$('k-case-times-form');for(const key of Object.keys(CASE_TIME_LABELS)){tf.elements.namedItem(key).value=utcInput(data.times[key]?.at);tf.elements.namedItem(key+'Ref').value=data.times[key]?.ref||'';}
    const af=$('k-case-actor-form');for(const key of ['name','confidence','basis','alternatives'])af.elements.namedItem(key).value=data.actor[key];
  }
  function openCaseWorkbench(tab){
    if(currentView!=='director'||audience)return;
    caseFeedback('');fillCaseForms();refreshCasePanels();switchCaseTab(tab);const dialog=$('k-case-dialog');if(!dialog.open)dialog.showModal();
  }
  function refreshCasePanels(){
    const data=liveCase();setText('k-case-dialog-id',data.id+' · '+data.evidence.length+' bulgu');
    put('k-case-metrics',caseMetrics(data).map(m=>`<div><small>${esc(m.label)}</small><b>${durationLabel(m.ms)}</b><span>${esc(m.from)}</span></div>`).join(''));
    put('k-case-topology',topologyMarkup(data,9,true));setText('k-case-actor-statement',actorStatement(data.actor));
    put('k-case-evidence-list',data.evidence.length?data.evidence.slice().reverse().map(e=>`<article class="k-case-evidence"><header><strong>${CASE_KINDS[e.kind]}</strong><span>${esc(e.eventId)}</span></header><p>${esc(e.summary)}</p>${e.value?`<code>${esc((e.iocType?e.iocType+' · ':'')+e.value)}</code>`:''}<small>${utcLabel(e.at)} · ${esc(e.confidence)} güven<br>${esc(e.ref)}</small><button class="k-button" data-case-evidence-delete="${esc(e.id)}">Kaydı kaldır</button></article>`).join(''):'<p class="k-case-empty">Henüz analist bulgusu eklenmemiştir.</p>');
    renderSessionStatus();
  }
  function saveCaseData(data,kind,detail='',relatedStage=null){
    const clean=validateCase(data,caseIdFor(state.runId));commit({caseData:clean,caseOpenedAt:clean.openedAt},kind,detail,relatedStage);refreshCasePanels();caseFeedback('Olay dosyası kaydedilmiştir.');
  }
  function submitCaseEvidence(e){
    e.preventDefault();if(currentView!=='director'||audience)return;
    try{const form=e.target,fd=new FormData(form),data=structuredClone(liveCase());
      if(data.evidence.length>=100)throw new Error('Bir olay dosyasında en fazla 100 bulgu saklanmaktadır.');
      const kind=fd.get('kind'),entry={id:'B-'+(typeof crypto.randomUUID==='function'?crypto.randomUUID():Date.now()+'-'+Math.random().toString(16).slice(2)),stage:Number(fd.get('stage')),kind,at:parseUTC(fd.get('at')),addedAt:Date.now(),ref:fd.get('ref'),summary:fd.get('summary'),value:['ioc','ttp'].includes(kind)?fd.get('value'):'',iocType:kind==='ioc'?fd.get('iocType'):'',confidence:fd.get('confidence'),from:fd.get('from'),to:fd.get('to'),confirmed:fd.get('confirmed')==='on'};
      data.evidence.push(entry);saveCaseData(data,'evidence',CASE_KINDS[kind]+': '+entry.summary+' · Kanıt: '+entry.ref,entry.stage);form.reset();form.elements.namedItem('stage').value=String(stageAt(cursorAt()).index);form.elements.namedItem('at').value=utcInput(Date.now());
    }catch(error){caseFeedback(error.message,true);}
  }
  function submitCaseTimes(e){
    e.preventDefault();if(currentView!=='director'||audience)return;
    try{const fd=new FormData(e.target),data=structuredClone(liveCase());data.times={};
      for(const key of Object.keys(CASE_TIME_LABELS)){const value=fd.get(key),ref=fd.get(key+'Ref');if(value)data.times[key]={at:parseUTC(value),ref};else if(String(ref).trim())throw new Error(CASE_TIME_LABELS[key]+' için zamanı da giriniz.');}
      saveCaseData(data,'times');
    }catch(error){caseFeedback(error.message,true);}
  }
  function submitCaseActor(e){
    e.preventDefault();if(currentView!=='director'||audience)return;
    try{const fd=new FormData(e.target),data=structuredClone(liveCase());data.actor=Object.fromEntries(['name','confidence','basis','alternatives'].map(k=>[k,fd.get(k)]));saveCaseData(data,'assessment');}
    catch(error){caseFeedback(error.message,true);}
  }
  async function refreshArchives(){
    if(!$('k-case-dialog')?.open&&workbenchTab!=='recording')return;
    try{await sessionQueue;const sessions=await dbRead('sessions');sessions.sort((a,b)=>b.openedAt-a.openedAt);const select=$('k-case-archives'),current=archiveSelection||liveCase().id;
      put('k-case-archives',sessions.map(s=>`<option value="${esc(s.id)}">${esc(s.id)} · ${utcLabel(s.openedAt)} · ${s.frameCount||0} örnek</option>`).join('')||'<option value="">Arşivde oturum bulunmamaktadır</option>');
      if(sessions.some(s=>s.id===current))select.value=current;archiveSelection=select.value;
    }catch(error){caseFeedback('Arşiv açılamamıştır: '+error.message,true);}
  }
  async function loadCaseReplay(){
    try{if(!archiveSelection)throw new Error('Bir kayıt seçiniz.');replayPlaying=false;replayBundle=await bundleFor(archiveSelection);replayIndex=0;renderCaseReplay();caseFeedback('Kayıt inceleme için açılmıştır. Canlı yayın sürmektedir.');}
    catch(error){caseFeedback(error.message,true);}
  }
  function replayMapMarkup(region){
    const base=regionMap.get(region.id),roads=base.units.slice(0,4).map(u=>u.route?`<path d="M${u.route.map(p=>p.join(' ')).join('L')}" fill="none" stroke="#294656" stroke-width="8"/>`:'').join('');
    return `<article><header><b>${esc(base.name||base.short)}</b><small>KAYITLI KONUM</small></header><svg viewBox="0 0 1200 720" role="img" aria-label="${esc(base.short)} kayıtlı konumları"><rect width="1200" height="720" fill="#0a1d29"/>${roads}${region.assets.map(a=>`<path d="M${a.refX} ${a.refY}L${a.x} ${a.y}" stroke="#e8978d" stroke-width="4" stroke-dasharray="10 8"/><circle cx="${a.refX}" cy="${a.refY}" r="12" fill="none" stroke="#80c8a8" stroke-width="3"/>${a.destroyed?`<path d="M${a.x-17} ${a.y-17}L${a.x+17} ${a.y+17}M${a.x+17} ${a.y-17}L${a.x-17} ${a.y+17}" stroke="#f38d8c" stroke-width="10"/>`:`<circle cx="${a.x}" cy="${a.y}" r="13" fill="${COLORS[a.tone]||COLORS.muted}"/>`}<text x="${Math.min(1000,a.x+24)}" y="${a.y-24}" fill="#c7dde5" font-size="27">${esc(a.id)}${a.destroyed?' · İMHA':a.offline?' · KESİNTİ':a.changed?' · GÖREV Δ':''}</text>`).join('')}</svg></article>`;
  }
  function renderCaseReplay(){
    const bundle=replayBundle,frames=bundle?.frames||[],frame=frames[replayIndex];$('k-case-replay').hidden=!frame;$('k-case-replay-empty').hidden=!!frame;
    if(!frame){setText('k-case-replay-empty',bundle?'Bu oturumda telemetri örneği bulunmamaktadır. Bulgu ve müdahale kayıtları rapordan incelenebilir.':'İncelemek için bir kayıt açınız.');return;}
    setText('k-case-replay-time',utcLabel(frame.at));setText('k-case-replay-position',`${bundle.session.id} · ${replayIndex+1} / ${frames.length} · Sunum T+${mmss(frame.cursor)}${frame.curtain?' · Yayın bekletilmiştir.':''}`);
    const range=$('k-case-replay-range');range.max=String(frames.length-1);range.value=String(replayIndex);
    document.querySelector('[data-case-replay="play"]').textContent=replayPlaying?'Duraklat':'Oynat';document.querySelector('[data-case-replay="previous"]').disabled=replayIndex===0;document.querySelector('[data-case-replay="next"]').disabled=replayIndex===frames.length-1;
    const gap=replayIndex>0?frame.at-frames[replayIndex-1].at:0;$('k-case-replay-gap').hidden=gap<2500;setText('k-case-replay-gap',`Önceki örnekten bu yana ${(gap/1000).toFixed(1)} saniye geçmiştir. Aradaki veriler kaydedilmemiştir.`);
    put('k-case-replay-maps',frame.regions.map(replayMapMarkup).join(''));
    put('k-case-replay-telemetry',`<table><thead><tr><th>Kaynak</th><th>Ölçüm</th><th>Değer</th><th>Bağlantı</th><th>Veri yaşı</th></tr></thead><tbody>${frame.rows.map(r=>`<tr><td><i class="k-case-dot ${r.tone}"></i>${esc(r.id)}</td><td>${esc(r.metricLabel)}</td><td>${esc(r.metricValue)}</td><td>${r.offline?'Kesildi':'%'+fmt(r.link)}</td><td>${fmt(r.age,1)} sn</td></tr>`).join('')}</tbody></table><div class="k-case-record-plants">${frame.plants.map(p=>`<p><b>${esc(regionMap.get(p.id).short)}</b> · Seviye LT-02 %${fmt(p.actual,1)} / HMI %${fmt(p.shown,1)} · ${fmt(p.temp,1)} °C · Vana %${fmt(p.valve)} · Hizmet %${fmt(p.service)}</p>`).join('')}</div>`);
    const journal=bundle.events.filter(e=>e.at<=frame.at).slice(-40).reverse(),evidence=bundle.session.data.evidence.filter(e=>e.addedAt<=frame.at);
    put('k-case-replay-journal',`<p class="k-case-note">Bu ana kadar ${evidence.length} analist bulgusu kaydedilmiştir.</p>`+(journal.map(e=>`<article class="k-case-replay-event"><small>${utcLabel(e.at)} · ${esc(e.eventId)}</small><b>${esc(({analyst:'Analist kaydı',model:'Gösterim modeli',director:'Reji kaydı'})[e.source])}</b><p>${esc(e.text)}</p></article>`).join('')||'<p class="k-case-empty">Bu ana kadar olay kaydı bulunmamaktadır.</p>'));
  }
  function replayTick(){
    if(!replayPlaying||!replayBundle?.frames.length||!$('k-case-dialog').open||workbenchTab!=='recording')return;
    const frames=replayBundle.frames,target=replayOrigin+Date.now()-replayWall;let next=replayIndex;
    while(next<frames.length-1&&frames[next+1].at<=target)next++;
    if(next!==replayIndex){replayIndex=next;renderCaseReplay();}
    if(replayIndex===frames.length-1){replayPlaying=false;renderCaseReplay();}
  }
  async function importCaseRecording(file){
    try{if(!file)return;if(file.size>48*1024*1024)throw new Error('Kayıt dosyası 48 MB sınırını aşmaktadır.');
      const bundle=validateRecording(JSON.parse(await file.text()));await sessionQueue;
      if(await dbRead('sessions',bundle.session.id))throw new Error('Bu olay kimliği arşivde bulunmaktadır. Mevcut kayıt korunmuştur.');
      await enqueueSession(()=>dbWrite(['sessions','frames','events'],tx=>{tx.objectStore('sessions').put(bundle.session);bundle.frames.forEach(f=>tx.objectStore('frames').put(f));bundle.events.forEach(e=>tx.objectStore('events').put(e));}));
      archiveSelection=bundle.session.id;await refreshArchives();replayBundle=bundle;replayIndex=0;replayPlaying=false;renderCaseReplay();caseFeedback('Oturum arşive alınmıştır. Güncel olay dosyası değiştirilmemiştir.');
    }catch(error){caseFeedback('İçe aktarma tamamlanmamıştır: '+error.message,true);}finally{$('k-case-import').value='';}
  }
  function renderSessionStatus(){
    const data=liveCase(),record=state.recording,ours=record?.owner===windowId,ownerAlive=record&&peerAlive(record.owner);
    setText('k-case-toolbar-status',data.id+' · '+(record?'● Kayıt etkin':'Kayıt kapalı'));
    setText('k-case-record-status',sessionError?'Kayıt hatası: '+sessionError:record?ours?'Kayıt bu reji penceresinde sürmektedir.':ownerAlive?'Kayıt diğer reji penceresinde sürmektedir.':'Kayıt penceresi yanıt vermemektedir. Kaydı bu pencerede devralabilirsiniz.':'Kayıt kapalıdır.');
    document.querySelectorAll('[data-case-record]').forEach(b=>{b.textContent=ours?'Kaydı durdur':record?'Kaydı devral':'Kaydı başlat';b.disabled=!!record&&!ours&&ownerAlive;});
    document.querySelectorAll('[data-case-curtain]').forEach(b=>{b.setAttribute('aria-pressed',String(!!state.curtain));b.textContent=state.curtain?'Yayına dön':'Bekleme ekranı';});
    const hidden=!!state.curtain&&currentView!=='director';$('k-case-curtain').hidden=!hidden;$('k-app').inert=hidden;document.body.classList.toggle('k-curtain-active',hidden);
    if(currentView!=='director'&&$('k-case-dialog').open)$('k-case-dialog').close();
    const label=data.id+' / E'+String(stageAt(cursorAt()).index+1).padStart(2,'0');
    for(const parent of document.querySelectorAll('.k-head-meta,.k-screen-monitor-heading>div,.k-map-monitor-title>div')){let el=parent.querySelector('.k-common-id');if(!el){el=document.createElement('small');el.className='k-common-id';parent.append(el);}el.textContent=label;}
  }
  function renderCaseTopology(snap){put('k-event-case-id',incidentId(liveCase().id,snap.stage.index));put('k-event-topology',topologyMarkup(liveCase(),audience?snap.stage.index:9,false));}
  document.body.insertAdjacentHTML('beforeend',caseWorkbenchMarkup());
  $('k-case-evidence-form').addEventListener('submit',submitCaseEvidence);$('k-case-times-form').addEventListener('submit',submitCaseTimes);$('k-case-actor-form').addEventListener('submit',submitCaseActor);
  $('k-case-dialog').addEventListener('close',()=>{replayPlaying=false;});
  document.addEventListener('click',e=>{
    const open=e.target.closest('[data-case-open]');if(open){openCaseWorkbench(open.dataset.caseOpen);return;}
    if(currentView!=='director'||audience)return;
    if(e.target.closest('[data-case-close]')){$('k-case-dialog').close();return;}
    const tab=e.target.closest('[data-case-tab]');if(tab){replayPlaying=false;switchCaseTab(tab.dataset.caseTab);return;}
    if(e.target.closest('[data-case-curtain]')){commit({curtain:!state.curtain,playing:false},'curtain');return;}
    if(e.target.closest('[data-case-record]')){void toggleSessionRecording();return;}
    if(e.target.closest('[data-case-report]')){openCaseWorkbench('recording');archiveSelection=liveCase().id;void exportSession('report');return;}
    const exp=e.target.closest('[data-case-export]');if(exp){void exportSession(exp.dataset.caseExport);return;}
    if(e.target.closest('[data-case-archive-refresh]')){void refreshArchives();return;}
    if(e.target.closest('[data-case-replay-load]')){void loadCaseReplay();return;}
    const now=e.target.closest('[data-case-now]');if(now){$('k-case-times-form').elements.namedItem(now.dataset.caseNow).value=utcInput(Date.now());return;}
    const del=e.target.closest('[data-case-evidence-delete]');if(del){try{const data=structuredClone(liveCase());data.evidence=data.evidence.filter(x=>x.id!==del.dataset.caseEvidenceDelete);saveCaseData(data,'evidence','Analist bulgu kaydını kaldırmıştır: '+del.dataset.caseEvidenceDelete);}catch(error){caseFeedback(error.message,true);}return;}
    const replay=e.target.closest('[data-case-replay]');if(replay&&replayBundle?.frames.length){if(replay.dataset.caseReplay==='play'){if(replayIndex===replayBundle.frames.length-1)replayIndex=0;replayPlaying=!replayPlaying;replayOrigin=replayBundle.frames[replayIndex].at;replayWall=Date.now();}else{replayPlaying=false;replayIndex=cap(replayIndex+(replay.dataset.caseReplay==='next'?1:-1),0,replayBundle.frames.length-1);}renderCaseReplay();}
  });
  $('k-case-archives').addEventListener('change',e=>{archiveSelection=e.target.value;});
  $('k-case-replay-range').addEventListener('input',e=>{replayPlaying=false;replayIndex=Number(e.target.value);renderCaseReplay();});
  $('k-case-import').addEventListener('change',e=>{void importCaseRecording(e.target.files[0]);});
  setInterval(()=>{if(state.recording?.owner===windowId)recordSessionFrame(freshSessionSnapshot());replayTick();},250);

  function directorMarkup() {
    return titleRow('Gösterim rejisi','10 adım · Her adım 30 saniye · Analist incelemesi için bekletilebilir','R',`<span class="k-chip">SUNUCU EKRANI</span>`)+caseToolbarMarkup()+`<div class="k-show-grid"><section class="k-panel k-show-transport"><div class="k-show-clock"><div><small>ADIMDA KALAN</small><strong id="k-step-time">00:30</strong></div><span id="k-progress-stage"></span></div><div class="k-show-main-controls"><button class="k-button" data-action="previous" id="k-prev">← Önceki</button><button class="k-button k-primary" data-action="play" id="k-console-play">Başlat</button><button class="k-button" data-action="next" id="k-next">Sonraki →</button></div><div class="k-show-options"><label><input type="checkbox" id="k-step-hold"> Wazuh incelemesi için adım sonunda beklet</label><button data-step-restart>Adımı başa al</button><button data-action="reset">Yeni tur</button></div><div class="k-progress-wrap"><div><span id="k-total"></span><span id="k-console-time"></span></div><div class="k-progress"><i id="k-progress"></i></div></div><div id="k-reji-stages" class="k-show-stage-list">${STAGES.map(s=>`<button data-stage="${s.index}" class="k-show-stage" aria-pressed="false"><span>${String(s.index+1).padStart(2,'0')}</span><b>${s.name}</b><em>30 sn</em></button>`).join('')}</div><p class="k-show-keys">Boşluk: başlat / duraklat · ← →: adım</p></section><section class="k-panel k-show-reader"><div id="k-briefing"></div></section><aside class="k-show-outputs">${analystDeskMarkup()}<section class="k-panel"><div class="k-section-head"><h2>İzleyici ekranları</h2><small>MONİTÖRLER</small></div><div class="k-show-monitors">${VIEWS.filter(v=>v.id!=='director').map(v=>`<a href="${esc(monitorURL(v.id))}" data-monitor="${v.id}" target="_blank" rel="noopener">${icon(v.id)}<span>${v.name}</span><b>↗</b></a>`).join('')}</div><div id="k-monitor-status" class="k-monitor-layout"></div></section><details class="k-panel k-sound-panel"><summary class="k-analyst-sound-summary">Sahne sesi ve ses denemeleri <span>⌄</span></summary><div class="k-sound-settings">${soundButtonMarkup()}<label>Ses düzeyi <output id="k-sound-volume-label">35%</output><input aria-label="Ses düzeyi" data-sound-volume type="range" min="0" max="100" value="35"></label><label>Ses kaynağı<select data-sound-scene aria-label="Ses kaynağı"><option value="auto">Otomatik · Geçerli adım</option><option value="plc">PLC · Su ve vana</option><option value="field">Saha · Telsiz ve imha</option></select></label><div class="k-sound-options"><label><input type="checkbox" data-sound-option="process" checked> Su, pompa ve vana sesleri</label><label><input type="checkbox" data-sound-option="events" checked> Uyarı, telsiz ve dron efektleri</label><label><input type="checkbox" data-sound-option="speech" checked> Anlatım önceliği</label><small>Anlatım önceliği, arka plan seslerini azaltır. Sesler yalnız seçilen pencereden verilmektedir.</small></div><div class="k-sound-meter" role="meter" aria-label="Ses çıkış seviyesi" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><i></i></div><p id="k-sound-status">Ses kapalı.</p><small id="k-sound-last">Son efekt: —</small><div class="k-sound-tests"><button data-sound-test="cold">Soğuk su</button><button data-sound-test="hot">Sıcak su</button><button data-sound-test="valve">Vana hareketi</button><button data-sound-test="radio">Telsiz kesintisi</button><button data-sound-test="warning">Kritik bildirim</button><button data-sound-test="blast">Dron çarpması</button></div></div></details></aside></div>`;
  }

  function renderDirector(snap) {
    const {stage:s,cursor,playing}=snap,remaining=s.end-cursor<.02?0:Math.max(0,Math.ceil(s.end-cursor));
    setText('k-step-time',mmss(remaining));setText('k-console-time','Toplam '+mmss(cursor));
    setText('k-console-play',playing?'Duraklat':cursor>=TOTAL_SECONDS?'Yeni oynatım':'Başlat');
    setText('k-progress-stage',`ADIM ${String(s.index+1).padStart(2,'0')} / 10`);
    setText('k-total',`${mmss(cursor)} / 05:00`);$('k-progress').style.width=`${cursor/TOTAL_SECONDS*100}%`;
    $('k-prev').disabled=s.index===0;$('k-next').disabled=s.index===STAGES.length-1;
    $('k-step-hold').checked=!!state.holdAfterStep;
    document.querySelectorAll('button[data-stage]').forEach(b=>{b.setAttribute('aria-pressed',String(Number(b.dataset.stage)===s.index));b.classList.toggle('done',Number(b.dataset.stage)<s.index);});
    const b=BRIEFINGS[s.index],cueKey=String(s.index),root=$('k-briefing');
    if(root.dataset.stage!==cueKey){root.dataset.stage=cueKey;put('k-briefing',`<div class="k-show-cue-top"><span>ŞİMDİ ANLAT</span><div class="k-cue-tools">${s.index===1?'<button class="k-button" data-dmz-jump>Erişim zinciri · 6 kart ↓</button>':''}<button class="k-button" data-script-open>Okuma görünümü ↗</button></div></div><h2>${s.name}</h2><div class="k-show-read-text">${narrationMarkup(s)}</div><div class="k-show-evidence"><small>EKRANDA GÖSTER</small><strong>${s.screen}</strong><p id="k-presenter-proof">${s.evidence}</p>${s.index===6?'<button class="k-button" data-impact-replay>Düşüşü tekrar göster ↻</button>':''}</div><div class="k-analyst-cues" id="k-analyst-cues"></div><div class="k-show-emphasis"><small>VURGU</small><p>${s.effect}</p></div><details class="k-show-technical"><summary>Teknik özet · Saldırı / savunma</summary><div class="k-tactics-grid"><article class="k-tactic-card attack"><small>${b.attackLabel}</small><h4>${b.attackTitle}</h4><p>${b.attackText}</p><div class="k-tech-terms">${b.attackTerms.map(t=>`<span>${t}</span>`).join('')}</div><div class="k-tech-refs">${b.refs.map(([id,url])=>`<a href="${url}" target="_blank" rel="noopener noreferrer">${id} ↗</a>`).join('')}</div></article><article class="k-tactic-card defense"><small>SAVUNMA</small><h4>${b.defenseTitle}</h4><p>${b.defenseText}</p><div class="k-tech-terms">${b.defenseTerms.map(t=>`<span>${t}</span>`).join('')}</div></article></div></details>${s.index===1?dmzGuideMarkup():''}${analystNotesMarkup()}`);}
    renderAnalystNotes(snap);renderDmzGuide(s);
    setText('k-show-next',STAGES[s.index+1]?.name||'Gösterim tamamlandı');
    if($('k-script-reader').open)renderScriptReader(s);
    renderBroadcastDesk();
  }
  function render() {
    if(pendingRender)return;pendingRender=true;
    try {
      const cursor=cursorAt(),stage=stageAt(cursor),playing=state.playing&&cursor<TOTAL_SECONDS;
      const snap={cursor,stage,playing,regions:REGION_DATA.map(r=>regionSnapshot(r,cursor))};
      collectTelemetry(Date.now(),cursor);snap.health=serviceValidation(snap,telemetryFeed);
      updateCamera(snap);
      document.documentElement.style.setProperty('--tone',COLORS[stage.tone]);
      document.body.classList.toggle('k-paused',!playing);
      document.body.classList.toggle('k-camera-switch',currentView==='operations'&&Date.now()<cameraSwitchUntil);
      document.body.classList.toggle('k-plc-incident',currentView==='plc'&&(!!plcWarning(cursor)||currentPlant(regionMap.get(plcRegion),cursor).operatorControlled));
      mount();
      if(cachedStage!==stage.index||!$('k-stages').childElementCount){put('k-stages',STAGES.map(s=>`<div class="k-step ${s.index<stage.index?'done':s.index===stage.index?'current':''}" ${s.index===stage.index?'aria-current="step"':''}><i>${s.index<stage.index?'✓':''}</i><span>${s.short}</span></div>`).join(''));cachedStage=stage.index;}
      setText('k-clock',clock(Date.now()));setText('k-elapsed','T+'+mmss(cursor));
      setText('k-dock-status',playing?'Akış sürmektedir':cursor>=TOTAL_SECONDS?'Akış tamamlandı':cursor===0?'Akış hazır':'Akış duraklatıldı');
      setText('k-dock-stage',stage.short);setText('k-dock-play',playing?'Duraklat':cursor>=TOTAL_SECONDS?'Yeniden oynat':cursor===0?'Akışı başlat':'Devam et');
      document.querySelectorAll('#k-dock [data-action="previous"]').forEach(b=>b.disabled=stage.index===0);
      document.querySelectorAll('#k-dock [data-action="next"]').forEach(b=>b.disabled=stage.index===STAGES.length-1);
      $('k-dock').hidden=observerView()||currentView==='director';
      const count=1+[...peers.values()].filter(p=>Date.now()-p.seen<=PEER_FRESH_MS).length;
      setText('k-sync',count>1?`${count} EKRAN EŞZAMANLI`:!channel&&!storageOK?'EŞİTLEME YOK · YEREL PENCERE':location.protocol==='file:'?'TEK EKRAN · DOSYADAN ÇALIŞMA':'TEK EKRAN · EŞİTLEME HAZIR');
      document.title=`KALKAN-1 · ${VIEWS.find(v=>v.id===currentView).name}${observerView()?'':' · '+stage.short}`;
      if(currentView==='command')renderCommand(snap);
      if(currentView==='operations')renderOperations(snap);
      if(currentView==='plc')renderPLC(snap);
      if(currentView==='events')renderEvents(snap);
      if(currentView==='telemetry')renderTelemetry(snap);
      if(currentView==='director')renderDirector(snap);
      if(currentView==='plc')applyPlcAudienceLock();
      renderSessionStatus();sceneSound.update(snap);renderCompletedAt=Date.now();renderFrame++;renderBroadcastDesk();
    } finally {pendingRender=false;}
  }
  let toastTimeout=null;
  function toast(message){setText('k-toast',message);$('k-toast').hidden=false;clearTimeout(toastTimeout);toastTimeout=setTimeout(()=>$('k-toast').hidden=true,4500);}
  function openHelp(){if(!$('k-help').open)$('k-help').showModal();}
  document.addEventListener('click',e=>{
    const sound=e.target.closest('[data-sound-toggle]');if(sound){void sceneSound.toggle().then(()=>{heartbeat();renderBroadcastDesk();});return;}
    const test=e.target.closest('[data-sound-test]');if(test){void sceneSound.preview(test.dataset.soundTest).then(()=>{heartbeat();renderBroadcastDesk();});return;}
    if(e.target.closest('[data-impact-replay]')&&!audience){commit({cursor:STAGES[6].start,playing:false,impactAt:Date.now()});return;}
    if(e.target.closest('[data-step-restart]')&&!audience){const s=stageAt(cursorAt());commit({cursor:s.start,playing:false,...(s.index===6?{impactAt:Date.now()}:{} )});return;}
    if(e.target.closest('[data-plc-pump],[data-plc-panel],[data-plc-auto]')&&!canOperatePLC()){e.preventDefault();return;}
    const pump=e.target.closest('[data-plc-pump]');if(pump){togglePlcPump(Number(pump.dataset.plcPump));return;}
    const panel=e.target.closest('[data-plc-panel]');if(panel){openPlcControls(panel.dataset.plcPanel);return;}
    if(e.target.closest('[data-plc-controls-close]')){$('k-plc-controls').close();return;}
    if(e.target.closest('[data-plc-auto]')){writePlcControls(null,'Otomatik işletime dönüldü',plcControlRegion);const p=currentPlant(regionMap.get(plcControlRegion),cursorAt());['driveHz','valve','heat'].forEach(name=>document.querySelectorAll('[data-plc-field="'+name+'"]').forEach(el=>el.value=String(p[name])));return;}
    if(e.target.closest('[data-dmz-jump]')&&dmzGuideAllowed()){$('k-dmz-title')?.closest('.k-dmz-guide')?.scrollIntoView({block:'start',behavior:'smooth'});return;}
    const dmzCue=e.target.closest('[data-dmz-cue]');if(dmzCue){selectDmzCue(Number(dmzCue.dataset.dmzCue));return;}
    if(e.target.closest('[data-dmz-reader]')){openScriptReader(true);return;}
    if(dmzReaderActive&&$('k-script-reader').open&&e.target.closest('#k-script-reader-prev,#k-script-reader-next')){navigateDmzReader(e.target.closest('#k-script-reader-next')?1:-1);return;}
    if(e.target.closest('[data-script-open]')){openScriptReader();return;}
    if(e.target.closest('[data-script-close]')){$('k-script-reader').close();return;}
    if(e.target.closest('[data-screen-monitor-toggle]')){void setScreenMonitor(!screenMonitor);return;}
    if(e.target.closest('[data-screen-monitor-exit]')){void setScreenMonitor(false);return;}
    if(e.target.closest('[data-screen-native-fullscreen]')){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else document.documentElement.requestFullscreen().then(()=>{screenFullscreenOwned=true;}).catch(()=>toast('Tarayıcı tam ekranı için F11 tuşunu kullanabilirsin.'));return;}
    if(e.target.closest('[data-map-monitor-toggle]')){void setMapMonitor(!mapMonitor);return;}
    if(e.target.closest('[data-map-monitor-exit]')){void setMapMonitor(false);return;}
    if(e.target.closest('[data-map-panel-toggle]')){mapPanelVisible=!mapPanelVisible;syncMapMonitor();render();return;}
    if(e.target.closest('[data-map-native-fullscreen]')){if(document.fullscreenElement)document.exitFullscreen().catch(()=>{});else document.documentElement.requestFullscreen().then(()=>{mapFullscreenOwned=true;}).catch(()=>toast('Tam ekran için F11 tuşunu kullanabilirsin.'));return;}
    if(e.target.closest('[data-camera-auto]')){cameraAuto=!cameraAuto;cameraManualUntil=0;cameraEvent='';render();return;}
    if(e.target.closest('[data-telemetry-auto]')){telemetryAuto=!telemetryAuto;telemetryManualUntil=0;telemetryEvent='';render();return;}
    const tlmRegion=e.target.closest('[data-tlm-region]');if(tlmRegion){telemetryRegion=tlmRegion.dataset.tlmRegion;telemetryFocus=regionMap.get(telemetryRegion).units[0].id;telemetryManualUntil=Date.now()+12000;telemetryEvent=state.runId+':'+stageAt(cursorAt()).index;render();return;}
    const tlmSelect=e.target.closest('[data-tlm-select]');if(tlmSelect){telemetryFocus=tlmSelect.dataset.tlmSelect;telemetryManualUntil=Date.now()+12000;telemetryEvent=state.runId+':'+stageAt(cursorAt()).index;render();return;}
    if(e.target.closest('[data-tlm-open]')){telemetryDetail=telemetryFocus;render();if(!$('k-tlm-dialog').open)$('k-tlm-dialog').showModal();return;}
    if(e.target.closest('[data-plc-dismiss]')){plcNoticeDismissed=true;if($('k-plc-notice'))$('k-plc-notice').hidden=true;return;}
    const plcJump=e.target.closest('[data-plc-jump],[data-map-plc]');if(plcJump){plcRegion=plcJump.dataset.plcJump||plcJump.dataset.mapPlc;location.hash=locationFor('plc',observerView(),plcRegion);return;}
    const tlmFilter=e.target.closest('[data-tlm-filter]');if(tlmFilter){telemetryOnlyIssues=tlmFilter.dataset.tlmFilter==='issues';document.querySelectorAll('[data-tlm-filter]').forEach(b=>b.setAttribute('aria-pressed',String((b.dataset.tlmFilter==='issues')===telemetryOnlyIssues)));render();return;}
    const tlmClose=e.target.closest('[data-tlm-close]');if(tlmClose){$('k-tlm-dialog')?.close();telemetryDetail=null;return;}
    const tlmSource=e.target.closest('[data-tlm-source]');if(tlmSource&&currentView==='telemetry'){telemetryDetail=tlmSource.dataset.tlmSource;render();if(!$('k-tlm-dialog').open)$('k-tlm-dialog').showModal();return;}
    const monitor=e.target.closest('[data-monitor]');
    if(monitor&&!audience){const opened=window.open(monitor.href,'kalkan-monitor-'+monitor.dataset.monitor,'popup=yes,width=1600,height=900');if(opened){e.preventDefault();opened.focus();toast('İzleyici penceresi açıldı. İlgili monitöre taşıyabilirsin.');}else toast('Tarayıcı ayrı pencereyi engelledi; açılan sekmeyi dışarı sürükleyerek monitöre taşıyabilirsin.');return;}
    const action=e.target.closest('[data-action]');
    if(action){const a=action.dataset.action;if(a==='help'){openHelp();return;}if(audience)return;const s=stageAt(cursorAt());if(a==='play')playPause();if(a==='next')gotoStage(s.index+1);if(a==='previous')gotoStage(s.index-1);if(a==='reset')commit({cursor:0,playing:false,runId:windowId+'-'+Date.now()});return;}
    const stage=e.target.closest('button[data-stage]');if(stage&&!audience){gotoStage(Number(stage.dataset.stage));return;}
    const pick=e.target.closest('[data-filter]');if(pick){const id=pick.dataset.filter;if(selected.includes(id)&&selected.length===1){toast('En az bir bölge görünür olmalı.');return;}selected=selected.includes(id)?selected.filter(r=>r!==id):[...selected,id];pick.setAttribute('aria-pressed',String(selected.includes(id)));mountRegionCards();render();return;}
    const region=e.target.closest('[data-region]');if(region){if(region.dataset.scope==='operations'){manualCamera(region.dataset.region);return;}plcRegion=region.dataset.region;location.hash=locationFor(currentView,audience,region.dataset.region);lastRenderedView='';render();return;}
    const asset=e.target.closest('[data-asset]');if(asset&&currentView==='operations'){selectedAsset=asset.dataset.asset;render();}
  });
  document.addEventListener('keydown',e=> {
    if(state.curtain&&currentView!=='director'||$('k-case-dialog')?.open||$('k-broadcast-dialog')?.open||e.altKey||e.ctrlKey||e.metaKey||e.target.closest('input,select,textarea')||$('k-help').open||$('k-tlm-dialog')?.open||$('k-script-reader')?.open||$('k-plc-controls')?.open)return;
    const plcControl=e.target.closest('[data-plc-pump],[data-plc-panel]');if(plcControl&&['Enter',' '].includes(e.key)){e.preventDefault();if(!canOperatePLC())return;if(plcControl.hasAttribute('data-plc-pump'))togglePlcPump(Number(plcControl.dataset.plcPump));else openPlcControls(plcControl.dataset.plcPanel);return;}
    if(['plc','telemetry'].includes(currentView)&&e.key.toLowerCase()==='f'&&!e.repeat){e.preventDefault();void setScreenMonitor(!screenMonitor);return;}
    if(screenMonitor&&e.key==='Escape'){e.preventDefault();void setScreenMonitor(false);return;}
    if(currentView==='telemetry'&&e.key.toLowerCase()==='a'&&!e.repeat){e.preventDefault();telemetryAuto=!telemetryAuto;telemetryManualUntil=0;telemetryEvent='';render();return;}
    if(currentView==='operations'&&e.key.toLowerCase()==='f'&&!e.repeat){e.preventDefault();void setMapMonitor(!mapMonitor);return;}
    if(currentView==='operations'&&mapMonitor&&e.key.toLowerCase()==='h'&&!e.repeat){e.preventDefault();mapPanelVisible=!mapPanelVisible;syncMapMonitor();render();return;}
    if(currentView==='operations'&&mapMonitor&&e.key==='Escape'){e.preventDefault();void setMapMonitor(false);return;}
    if((currentView==='operations'||currentView==='command')&&/^[1-4]$/.test(e.key)){e.preventDefault();const id=REGION_DATA[Number(e.key)-1].id;if(currentView==='operations')manualCamera(id);else location.hash=locationFor('operations',audience,id)+'&camera=manual';return;}
    if(currentView==='operations'&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();const index=REGION_DATA.findIndex(r=>r.id===operationsRegion),next=(index+(e.key==='ArrowRight'?1:3))%4;manualCamera(REGION_DATA[next].id);return;}
    if(currentView==='operations'&&e.key.toLowerCase()==='a'&&!e.repeat){e.preventDefault();cameraAuto=!cameraAuto;cameraManualUntil=0;cameraEvent='';render();return;}
    const facility=e.target.closest('[data-map-plc]');if(facility&&['Enter',' '].includes(e.key)){e.preventDefault();plcRegion=facility.dataset.mapPlc;location.hash=locationFor('plc',observerView(),plcRegion);return;}
    if(e.target.closest('button,a,summary'))return;
    const asset=e.target.closest('[data-asset]');if(asset&&['Enter',' '].includes(e.key)){e.preventDefault();selectedAsset=asset.dataset.asset;render();return;}
    if(observerView())return;
    if(e.code==='Space'){e.preventDefault();playPause();}
    if(e.key==='ArrowRight'){e.preventDefault();gotoStage(stageAt(cursorAt()).index+1);}
    if(e.key==='ArrowLeft'){e.preventDefault();gotoStage(stageAt(cursorAt()).index-1);}
  });
  $('k-fullscreen').innerHTML=icon('fullscreen');
  document.addEventListener('fullscreenchange',()=>{if(screenFullscreenOwned&&!document.fullscreenElement){screenFullscreenOwned=false;if(screenMonitor)void setScreenMonitor(false,false);}if(mapFullscreenOwned&&!document.fullscreenElement){mapFullscreenOwned=false;if(mapMonitor)void setMapMonitor(false,false);}});
  $('k-fullscreen').addEventListener('click',async()=>{if(['plc','telemetry'].includes(currentView)){void setScreenMonitor(true);return;}try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen();}catch{toast('Tarayıcı tam ekranı açamadı. F11 tuşunu kullanabilirsin.');}});
  $('k-help-open').onclick=openHelp;$('k-help-close').onclick=()=>$('k-help').close();$('k-help-done').onclick=()=>$('k-help').close();
  $('k-help').addEventListener('click',e=>{if(e.target===$('k-help')){const r=$('k-help').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('k-help').close();}});
  $('k-plc-controls').addEventListener('close',()=>plcControlRegion=null);
  $('k-plc-control-form').addEventListener('submit',applyPlcControls);
  $('k-plc-controls').addEventListener('input',e=>{const key=e.target.dataset.plcField;if(key)document.querySelectorAll('[data-plc-field="'+key+'"]').forEach(el=>{if(el!==e.target)el.value=e.target.value;});});
  window.addEventListener('hashchange',readLocation);
  window.addEventListener('pagehide',()=>{sceneSound.release();send('bye');});
  window.addEventListener('pageshow',()=>{send('hello');heartbeat();render();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stopTelemetryAnimation();if(!document.hidden){try{const saved=JSON.parse(localStorage.getItem(KEY));if(validState(saved)&&isNewer(saved))state=saved;}catch{}send('hello');heartbeat();render();}});
  document.querySelector('.k-head-meta')?.insertAdjacentHTML('afterbegin',soundButtonMarkup());
  document.addEventListener('input',e=>{if(e.target.matches('[data-sound-volume]'))sceneSound.setVolume(Number(e.target.value));});
  document.addEventListener('change',e=>{if(e.target.matches('[data-sound-scene]'))sceneSound.setScene(e.target.value);if(e.target.matches('[data-sound-option]'))sceneSound.setOption(e.target.dataset.soundOption,e.target.checked);});
  readLocation();send('hello');heartbeat();
  setInterval(()=>{transportTick();sceneSound.update();},100);
  setInterval(()=>{if(telemetryFeed)collectTelemetry();if(!document.hidden)render();},500);
  setInterval(heartbeat,2000);

  /* ===== KALKAN-1 görsel katman v2: hikâye şeridi + aşama başlık kartı ===== */
  (()=>{
    const band=document.querySelector('.k-stage-band');if(!band)return;
    const strip=document.createElement('div');strip.id='k-story';strip.setAttribute('role','status');
    strip.innerHTML='<div class="ks-lead"><i></i><span class="ks-no"></span><b class="ks-name"></b></div><div class="ks-chain">'+[['cause','Neden'],['effect','Etki'],['evidence','Kanıt']].map(([k,l],n)=>(n?'<u></u>':'')+'<div><small>'+l+'</small><span data-k="'+k+'"></span></div>').join('')+'</div><div class="ks-prog"><i></i></div>';
    band.after(strip);
    const card=document.createElement('div');card.id='k-title-card';card.setAttribute('aria-hidden','true');
    card.innerHTML='<div class="kt-in"><div class="kt-no"></div><div class="kt-name"></div><div class="kt-line"></div><div class="kt-head"></div></div>';
    document.body.append(card);
    const q=(el,s)=>el.querySelector(s);let last=-1,lastView=null;
    function tick(){
      let c,s;try{c=cursorAt();s=stageAt(c);}catch(e){return;}
      const privateStory=!observerView()&&!['director','plc'].includes(currentView);strip.hidden=!privateStory;card.hidden=!privateStory;if(!privateStory)card.classList.remove('on');
      if(s.index!==last){
        const no=String(s.index+1).padStart(2,'0')+' / '+STAGES.length;
        q(strip,'.ks-no').textContent=no;q(strip,'.ks-name').textContent=s.name;
        ['cause','effect','evidence'].forEach(k=>{const e=q(strip,'[data-k="'+k+'"]');e.textContent=s[k];e.title=s[k];});
        if(last>=0&&privateStory&&!document.hidden){
          q(card,'.kt-no').textContent='ADIM '+no;q(card,'.kt-name').textContent=s.name;q(card,'.kt-head').textContent=s.headline;
          card.classList.remove('on');void card.offsetWidth;card.classList.add('on');
        }
        last=s.index;
      }
      q(strip,'.ks-prog i').style.width=Math.max(0,Math.min(100,(c-s.start)/((s.end-s.start)||1)*100))+'%';
      band.style.setProperty('--prog',Math.min(1,c/TOTAL_SECONDS));
      if(currentView!==lastView){const k=document.getElementById('k-content');if(k){k.classList.remove('k-enter');void k.offsetWidth;k.classList.add('k-enter');}lastView=currentView;}
    }
    setInterval(tick,250);tick();
  })();
})();

