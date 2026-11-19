#!/usr/bin/env python3
"""battle-scope-css.py: makes game/battle/screen-layer.css from game/battle/screen.css.

    python3 tools/battle-scope-css.py

The battle page's look (screen.css) is written for a page of its own: it styles the page's html, body, header and every
button. On the land the battle is a layer laid over the land's page (game/battle/start.js makes it: div.coven-battle),
so every rule here is made to reach only inside that layer:
  :root, html and body   become the layer itself (its colours, its letters, its column)
  everything else        is looked for only inside the layer
  @keyframes             stay as they are
Run it again whenever screen.css changes; tools/battle-test.py and the encounter check use what it makes.
"""
import os, re

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(HERE, '..', 'game', 'battle', 'screen.css')
OUT = os.path.join(HERE, '..', 'game', 'battle', 'screen-layer.css')
L = '.coven-battle'


def blocks(css):
    """Top-level pieces: (head, body) for a rule or an @-block, or (text, None) for anything between."""
    out, i, n = [], 0, len(css)
    while i < n:
        j = css.find('{', i)
        if j < 0: out.append((css[i:], None)); break
        head, depth, k = css[i:j], 1, j + 1
        while depth and k < n:
            if css[k] == '{': depth += 1
            elif css[k] == '}': depth -= 1
            k += 1
        out.append((head, css[j + 1:k - 1])); i = k
    return out


def one(sel):
    sel = sel.strip()
    if not sel: return sel
    for top in (':root', 'html', 'body'):
        if sel == top: return L
        if sel.startswith(top + '[') or sel.startswith(top + ':'): return L + sel[len(top):]   # :root[data-theme="dark"], :root:not(...)
    if sel.startswith('*'): return L + ' ' + sel
    return L + ' ' + sel


def scope(css):
    out = []
    for head, body in blocks(css):
        if body is None: out.append(head); continue
        h = head.strip()
        comment = head[:len(head) - len(head.lstrip())] if False else ''
        # a comment before the rule stays with it
        m = re.match(r'^(\s*(?:/\*.*?\*/\s*)*)(.*)$', head, re.S)
        pre, h = m.group(1), m.group(2).strip()
        if h.startswith('@keyframes') or h.startswith('@font-face'):
            out.append(pre + h + '{' + body + '}')
        elif h.startswith('@media') or h.startswith('@supports'):
            out.append(pre + h + '{' + scope(body) + '}')
        else:
            out.append(pre + ','.join(one(s) for s in h.split(',')) + '{' + body + '}')
    return ''.join(out)


css = open(SRC, encoding='utf-8').read()
note = ('/* screen-layer.css: MADE by tools/battle-scope-css.py from screen.css. Do not change it here: change screen.css\n'
        '   and run the tool. The battle\'s look, reaching only inside the battle\'s layer on the land (div.coven-battle). */\n')
extra = ('\n/* the layer itself: a column, as the battle page\'s body is */\n'
         + L + '{display:flex;flex-direction:column;overflow:hidden;line-height:normal;text-align:left}\n'
         '/* an id the land\'s page also uses for one of its own buttons (#nums): what its style would add is taken away */\n'
         + L + ' #nums{width:auto;height:auto;border:0;border-radius:0;background:none;display:block;padding:0;cursor:default;box-shadow:none}\n')
open(OUT, 'w', encoding='utf-8').write(note + scope(css) + extra)
print('made', os.path.relpath(OUT), os.path.getsize(OUT), 'bytes')
