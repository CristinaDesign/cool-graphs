"""Builds index.html for the Coffee brew guide. Run: python3 build.py
Joins the design system (tokens + components in ../../src) with this page's own files in src/.
The three illustrations are embedded in the page as data, so index.html is one self-contained file."""
import os, sys, base64
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
import build_common as bc

def js_esc(t):
    """Escape non-ASCII for a JS source file, including emoji (which need a surrogate pair)."""
    out = []
    for c in t:
        o = ord(c)
        if o < 128: out.append(c)
        elif o < 0x10000: out.append('\\u%04x' % o)
        else:
            o -= 0x10000
            out.append('\\u%04x\\u%04x' % (0xD800 + (o >> 10), 0xDC00 + (o & 0x3FF)))
    return ''.join(out)
bc.js_esc = js_esc  # the shared helper cannot handle emoji

here = os.path.dirname(os.path.abspath(__file__))
src = lambda f: bc.read(os.path.join(here, 'src', f))
css = bc.design_system_css() + '\n' + src('brew.css')
js = src('brew.js')
for name in ('latera-normal', 'decaf-latera', 'decaf-lavazza', 'bean'):
    data = base64.b64encode(open(os.path.join(here, 'src', 'img', name + '.png'), 'rb').read()).decode()
    js = js.replace('@@IMG_' + name.upper().replace('-', '_') + '@@', 'data:image/png;base64,' + data)
html = bc.page('Coffee Brew Guide', css, src('body.html'), js)
open(os.path.join(here, 'index.html'), 'w').write(html)
print('Built', len(html), 'bytes')
