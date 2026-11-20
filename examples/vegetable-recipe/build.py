"""Builds index.html for the Vegetable Recipe page. Run: python3 build.py"""
import os, re, sys
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
from build_common import *
here = os.path.dirname(os.path.abspath(__file__))
src = lambda f: read(os.path.join(here, 'src', f))

def light_block(name):
    """The first :root block of a colour file holds the LIGHT values. The recipe sheet (the PDF) is always light, even when
    the page is dark, so we copy those values onto .sheet."""
    t = read(os.path.join(SRC, 'tokens', name))
    block = t[t.index(':root {'):]
    block = block[:block.index('\n}') + 2]
    return block.replace(':root {', '.sheet {', 1)

css = design_system_css() + '\n' + light_block('semantic.css') + '\n' + light_block('component.css') + '\n' + src('recipe.css')
head = "(function () {\n  var root = document.documentElement;\n  var ICONS = " + icons_json() + ";\n"
js = head + shared('icon-helper.js') + '\n' + shared('vegetable-data.js') + src('recipe.js')
html = page('Vegetable Recipe', css, src('body.html'), js)
open(os.path.join(here, 'index.html'), 'w').write(html)
print('Built', len(html), 'bytes')
