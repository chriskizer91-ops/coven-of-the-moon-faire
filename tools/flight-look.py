#!/usr/bin/env python3
"""flight-look.py: pictures of the flight between zones, taken with no screen.

    python3 tools/flight-look.py builds/flight.html <out folder> [--from wickhollow --to warmCamp] [--ship brig]

For each of three screens (a laptop at 1280 by 720, a phone upright at 412 by 880, a phone on its side at 880 by 412)
it flies one flight through the piece's own test handle and saves:
    <size>-1-start.png      the ship over the landing she leaves, the light of the landing ahead
    <size>-2-raiders.png    the raiders about, shots in the air (the raiders are set just ahead of her for the picture)
    <size>-3-arrival.png    the landing reached
    <size>-4-lost.png       the ship going down (a second flight, her hull struck out)
    <size>-5-paused.png     the pause card
It prints the triangles and draw calls of each picture, and the page's errors (there should be none).
A browser with no screen draws slowly and cannot show motion, so the frame rate box is blank in these pictures.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
if len(args) < 2:
    sys.exit(__doc__)
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
FROM, TO, SHIP = opt('--from', 'wickhollow'), opt('--to', 'warmCamp'), opt('--ship', None)
SIZES = [('laptop-1280x720', 1280, 720, False), ('phone-412x880', 412, 880, True), ('phone-side-880x412', 880, 412, True)]
if '--size' in args:
    SIZES = [s for s in SIZES if opt('--size', '') in s[0]]
os.makedirs(out, exist_ok=True)
errors = []


def main():
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
        for name, w, h, touch in SIZES:
            ctx = b.new_context(viewport={'width': w, 'height': h}, has_touch=touch, is_mobile=touch, offline=True, device_scale_factor=2 if touch else 1)
            pg = ctx.new_page(); pg.set_default_timeout(240000)
            pg.on('pageerror', lambda e: errors.append('page error: ' + str(e)))
            pg.on('console', lambda m: errors.append('console error: ' + m.text) if m.type == 'error' else None)
            pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready')
            ask = lambda cmd, a=None: pg.evaluate('([c, a]) => W3D.flight.test(c, a)', [cmd, a or {}])

            def begin():
                o = {'from': FROM, 'to': TO, 'test': {'hold': True}}
                if SHIP: o['ship'] = SHIP
                pg.evaluate('(o) => { window.__answer = null; W3D.flight.fly(o).then((r) => { window.__answer = r; }); }', o)
                return pg.evaluate('W3D.flight.whenReady()')

            def shot(n, wait=350):
                s = ask('draw'); pg.wait_for_timeout(wait); f = os.path.join(out, '%s-%s.png' % (name, n)); pg.screenshot(path=f)
                print('%-34s %7d triangles %4d draw calls   %s' % (os.path.basename(f), s['triangles'], s['calls'], s['state']))

            begin(); ask('safe'); ask('step', {'seconds': 1.2, 'auto': True}); shot('1-start', 900)
            ask('step', {'seconds': 200, 'auto': True, 'until': 'raised'}); ask('step', {'seconds': 0.6, 'auto': True}); ask('showRaiders')
            ask('step', {'seconds': 0.35, 'fight': True}); ask('showRaiders'); ask('step', {'seconds': 0.12, 'fight': True}); shot('2-raiders', 900)
            ask('downRaiders'); ask('warp', {'frac': 0.86}); ask('step', {'seconds': 60, 'auto': True, 'until': 'cleared'})
            for _ in range(40):
                s = ask('step', {'seconds': 1, 'auto': True})
                if s['state'] == 'arriving': break
            ask('step', {'seconds': 1.0}); shot('3-arrival', 900)
            ask('step', {'seconds': 10}); pg.wait_for_function('window.__answer !== null')
            begin(); ask('step', {'seconds': 3, 'auto': True}); ask('sink'); ask('step', {'seconds': 2.4}); shot('4-lost', 900)
            ask('step', {'seconds': 10}); pg.wait_for_function('window.__answer !== null')
            begin(); ask('step', {'seconds': 2, 'auto': True}); ask('pause'); shot('5-paused')
            pg.evaluate('() => { W3D.flight.stop(); }'); pg.wait_for_function('window.__answer !== null')
            ctx.close()
        b.close()
    print('page errors: %d' % len(errors))
    for e in errors[:10]:
        print('  ' + e[:300])
    sys.exit(1 if errors else 0)


if __name__ == '__main__':
    main()
