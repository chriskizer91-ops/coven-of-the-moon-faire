#!/usr/bin/env python3
"""battle-look.py: pictures of the built battle page, with no screen.

    python3 tools/battle-look.py builds/battle.html <out folder> [--size 1280x720] [--fights band1,gate5] [--at 6,14]

It takes a picture of the fight list, then starts each fight (it plays itself) and takes a picture at each moment
asked for (seconds of the battle's own clock after the fight begins). It prints the page's errors (there should be
none), and for each picture the triangles and draw calls. The browser here has no graphics card: its frame rate
means nothing, and the pictures are stills.
"""
import os, sys, time
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
W, H = (int(x) for x in opt('--size', '1280x720').split('x'))
ONLY = opt('--fights', '')
AT = [float(x) for x in opt('--at', '8,20').split(',')]
os.makedirs(out, exist_ok=True)
errors = []
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': W, 'height': H})
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errors.append('console: ' + m.text) if m.type == 'error' else None)
    pg.goto('file://' + page_file, wait_until='load', timeout=180000)
    pg.wait_for_function('!!window.__arena', timeout=180000)
    pg.evaluate("() => { try { localStorage.setItem('mfw.flipbook', '0'); } catch (e) {} }")
    pg.wait_for_timeout(1500)
    pg.screenshot(path=os.path.join(out, '00-the-list.png'))
    print('00-the-list.png')
    ids = pg.evaluate("() => window.__arena.FIGHTS.map((F) => F.id)")
    for n, fid in enumerate(ids, 1):
        if ONLY and fid not in ONLY.split(','): continue
        pg.evaluate("(i) => window.__arena.start(i, { watch: 'expert' })", fid)
        pg.wait_for_function("window.__battle && window.__battle.state === 'battle'", timeout=600000, polling=250)
        pg.evaluate("() => { window.__battle.turbo = 3; }")
        t0 = pg.evaluate("() => window.__battle.t")
        for k, at in enumerate(AT):
            pg.wait_for_function("(t) => !window.__battle || window.__battle.t >= t || window.__battle.state === 'over'", arg=t0 + at, timeout=900000, polling=200)
            if not pg.evaluate("() => !!window.__battle"): break
            pg.evaluate("() => { window.__battle.turbo = 0; }"); pg.wait_for_timeout(400)
            name = '%02d-%s-%d.png' % (n, fid, k + 1)
            pg.screenshot(path=os.path.join(out, name))
            d = pg.evaluate("() => window.__battle.drawn")
            print('%s  %s triangles, %s draw calls' % (name, f"{d['triangles']:,}", d['calls']))
            pg.evaluate("() => { window.__battle.turbo = 3; }")
        pg.evaluate("() => window.__arena.stop()")
    b.close()
print('page errors: %d' % len(errors))
for e in errors[:10]: print('  ! ' + e)
sys.exit(1 if errors else 0)
