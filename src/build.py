# src/ の各ファイルを1枚にまとめて ../index.html を作る
import re
from pathlib import Path

here = Path(__file__).parent
s = (here / 'shell.html').read_text(encoding='utf8')
for key, name in (('/*SIM*/', 'sim.js'), ('/*ART*/', 'art.js'), ('/*UI*/', 'ui.js')):
    s = s.replace(key, (here / name).read_text(encoding='utf8'))
s = re.sub(r'window\.__g=\{.*?\};\n', '', s)
head = '''<!doctype html><html lang="ja"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="サーモン大遡上">
<meta name="theme-color" content="#0d3440">
<link rel="manifest" href="manifest.webmanifest">
<link rel="apple-touch-icon" href="icons/icon-180.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0;font-size:14px}[hidden]{display:none!important}</style>
</head><body>'''
tail = '''<script>if('serviceWorker' in navigator&&location.protocol!=='file:')navigator.serviceWorker.register('sw.js').catch(()=>{})</script></body></html>'''
(here.parent / 'index.html').write_text(head + s + tail, encoding='utf8')
print('built', len(head + s + tail))
