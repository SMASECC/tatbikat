from pathlib import Path
import re
root = Path(__file__).parent
app = (root/'app.js').read_text().replace('  /* AUDIO_MODEL */', (root/'audio-model.js').read_text()).replace('  /* SOUND_ENGINE */', (root/'audio.js').read_text()).replace('  /* BROADCAST_MODEL */', (root/'broadcast-model.js').read_text()).replace('  /* BROADCAST_DESK */', (root/'broadcast-desk.js').read_text()).replace('  /* DMZ_ACCESS_GUIDE */', (root/'dmz-guide.js').read_text())
assert all(marker not in app for marker in ['/* AUDIO_MODEL */','/* SOUND_ENGINE */','/* BROADCAST_MODEL */','/* BROADCAST_DESK */','/* DMZ_ACCESS_GUIDE */'])
html = (root/'source.html').read_text().replace('\n/* KALKAN_MAIN_APP */\n', app, 1)
html = html.replace('</style>', '\n'+(root/'polish.css').read_text()+'\n'+(root/'broadcast.css').read_text()+'\n'+(root/'dmz-guide.css').read_text()+'\n</style>', 1)
target = root.parent/'dist'/'frontend'
target.mkdir(parents=True, exist_ok=True)
out = target/'index.html'
out.write_text(html)
(root/'dist').mkdir(exist_ok=True)
(root/'dist/index.html').write_text(html)
print('Built', out, out.stat().st_size, 'bytes')
