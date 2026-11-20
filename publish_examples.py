"""Copies the example pages into docs/examples/ so GitHub Pages can show them. Run after the Storybook build."""
import os, sys, shutil
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), 'examples'))
import build_common as bc
root = os.path.dirname(os.path.abspath(__file__))
pages = [('vegetable-explorer', 'Vegetable Explorer', 'Browse vegetables by price and nutrients.'),
         ('vegetable-face-off', 'Vegetable Face-off', 'A quick game: which vegetable wins?'),
         ('vegetable-recipe', 'Vegetable Recipe', 'Pick two vegetables, download a one-page recipe PDF.'),
         ('coffee-brew', 'Coffee Brew Guide', 'Step-by-step coffee settings.')]
out = os.path.join(root, 'docs', 'examples')
shutil.rmtree(out, ignore_errors=True)
for slug, _, _ in pages:
    os.makedirs(os.path.join(out, slug))
    html = open(os.path.join(root, 'examples', slug, 'index.html'), encoding='utf-8').read()
    open(os.path.join(out, slug, 'index.html'), 'w', encoding='utf-8').write(bc.standalone(html))
shutil.copytree(os.path.join(root, 'examples', 'shared', 'icons'), os.path.join(out, 'shared', 'icons'))  # vegetable illustrations the pages load from ../shared/icons/
items = ''.join('<li><a href="%s/">%s</a> <span>%s</span></li>' % (s, t, d) for s, t, d in pages)
open(os.path.join(out, 'index.html'), 'w').write('''<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Cool Graphs examples</title>
<style>body{font:18px/1.5 system-ui,sans-serif;background:#fff4ea;color:#5a3d22;max-width:640px;margin:0 auto;padding:32px 16px}
@media(prefers-color-scheme:dark){body{background:#2a1d12;color:#f3e3d0}a{color:#f3e3d0}}
h1{font-size:32px;margin:0 0 8px}ul{padding:0;list-style:none}li{margin:16px 0}a{font-weight:700;font-size:22px}span{display:block}</style></head>
<body><h1>Cool Graphs examples</h1><p>Finished pages built with the Cool Graphs design system.</p><ul>%s</ul><p><a href="../">Design system (Storybook)</a></p></body></html>''' % items)
print('Published examples to', out)
