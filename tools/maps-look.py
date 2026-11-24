#!/usr/bin/env python3
"""maps-look.py: pictures of the maps, taken with no screen (the maps job).

    python3 tools/maps-look.py builds/maps.html <out folder>            every view at 1280 x 720 and at 412 x 880
    python3 tools/maps-look.py builds/zone-1.html <out folder> --size 412x880

It opens the Maps tab (through the menu if the page has one, or else in a box of its own), and takes: the zone's own
map; the 3D map of Aethermoor where the coven is, with a landing's card, and from far off; choosing where to fly (as it
opens, a landing that is not open, the open one, and the dotted line after "Set course"); the star map (the whole
system, Thareia's card, the moon's card). It prints what each 3D map cost to open and to draw.
The browser here draws without a graphics card: its frame rate means nothing, and it cannot show motion."""
import sys, os, json, time
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
if len(args) < 2:
    sys.exit(__doc__)
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
sizes = [(1280, 720), (412, 880)]
if '--size' in args:
    sizes = [tuple(int(v) for v in args[args.index('--size') + 1].split('x'))]
os.makedirs(out, exist_ok=True)
errors = []
OPEN = """(view) => { const T = window.__look = window.__look || {}; const menu = window.W3D.menu && typeof W3D.menu.open === 'function';
  if (menu) W3D.menu.open('maps'); else if (!T.host) { T.host = document.createElement('div'); T.host.style.cssText = 'position:fixed;inset:0;z-index:50'; document.body.appendChild(T.host);
    const zone = Object.keys(window.W3D_PLACES || {}).find((k) => /^zone-\\d$/.test(k)) || 'zone-1'; W3D.maps.tab.mount(T.host, { W: window.__w3d || null, zone, close() {} }); }
  if (W3D.maps.tab.view !== view) W3D.maps.tab.show(view); }"""
CLOSE = "() => { const T = window.__look || {}; if (window.W3D.menu && typeof W3D.menu.close === 'function') W3D.menu.close(); else if (T.host) { W3D.maps.tab.unmount(); T.host.remove(); T.host = null; } }"
WORLD_READY = "() => !!(W3D.maps.world.shown && W3D.maps.world.shown.state.ready)"
CHOOSE_READY = "() => !!(W3D.maps.world.choosing && W3D.maps.world.choosing.state.ready)"
SKY_READY = "() => !!(W3D.maps.sky.shown && W3D.maps.sky.shown.state.ready)"

for (W, H) in sizes:
    tag = '%dx%d' % (W, H)
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
        pg = b.new_page(viewport={'width': W, 'height': H}, has_touch=W < 600)
        pg.on('pageerror', lambda e: errors.append('page error: ' + str(e)))
        pg.on('console', lambda m: errors.append('console error: ' + m.text) if m.type == 'error' else None)
        pg.goto('file://' + page_file + '?test&mapshold=40')
        pg.wait_for_function('window.__ready || window.__err', timeout=600000)
        def shot(name, settle=2.5):
            # the map draws by itself; a few frames are let by so the picture is the settled one
            pg.wait_for_timeout(int(settle * 1000)); f = os.path.join(out, '%s-%s.jpg' % (name, tag)); pg.screenshot(path=f, type='jpeg', quality=90, timeout=180000); print('  ' + os.path.basename(f))
        frames = lambda h: pg.evaluate('(c) => { const h = c ? W3D.maps.world.choosing : W3D.maps.world.shown; return h ? h.state.frames : 0; }', h)
        def drawn(choosing=False, n=3):
            f0 = frames(choosing)
            pg.wait_for_function('([c, f]) => { const h = c ? W3D.maps.world.choosing : W3D.maps.world.shown; return !h || h.state.frames >= f; }', arg=[choosing, f0 + n], timeout=120000)
        print(tag)
        # the zone's own map
        pg.evaluate(OPEN, 'zone'); shot('1-zone', 0.6)
        # the 3D map of Aethermoor
        pg.evaluate(OPEN, 'world'); pg.wait_for_function(WORLD_READY, timeout=300000); drawn(); shot('2-world-here')
        l = pg.evaluate('W3D.maps.last.world'); print('    the 3D map: %s ms to open, %s triangles in %s draw calls, %s detail, %s shapes and %s pictures held' % (l['openMs'], '{:,}'.format(l['triangles']), l['calls'], l['detail'], l['geometries'], l['textures']))
        pg.evaluate("W3D.maps.world.shown.pick('wickhollow')"); drawn(); shot('3-world-landing-card', 1)
        pg.evaluate("(() => { const h = W3D.maps.world.shown; h.pick(null); h.map.view = { x: 2304, y: 1700, dist: 99999, yaw: 0, tilt: 0.95 }; })()"); drawn(); shot('4-world-far')
        n = pg.evaluate('W3D.maps.world.shown.map.numbers()'); print('    from far off: %s triangles in %s draw calls' % ('{:,}'.format(n['triangles']), n['calls']))
        pg.evaluate("(() => { const h = W3D.maps.world.shown; h.map.view = { x: 1348, y: 1838, dist: 240, yaw: 0.5, tilt: 0.5 }; })()"); drawn(); shot('5-world-close')
        n = pg.evaluate('W3D.maps.world.shown.map.numbers()'); print('    close in: %s triangles in %s draw calls' % ('{:,}'.format(n['triangles']), n['calls']))
        pg.evaluate(CLOSE)
        # choosing where to fly
        pg.evaluate("(() => { window.__got = undefined; W3D.maps.world.choose({ from: 'wickhollow', open: ['warmCamp'] }).then((v) => { window.__got = v; }); })()"); pg.wait_for_function(CHOOSE_READY, timeout=300000); drawn(True); shot('6-choose')
        pg.evaluate("W3D.maps.world.choosing.pick('northCamp')"); drawn(True); shot('7-choose-not-open', 1)
        pg.evaluate("W3D.maps.world.choosing.pick('warmCamp')"); drawn(True); shot('8-choose-open', 1)
        pg.evaluate("W3D.maps.world.choosing.setCourse('warmCamp')"); shot('9-choose-line', 0.8)   # (the map draws itself when the course is set; the line is held 40 seconds here, for the picture)
        pg.wait_for_function("window.__got !== undefined", timeout=90000)
        # the star map
        pg.evaluate(OPEN, 'sky'); pg.wait_for_function(SKY_READY, timeout=300000); shot('10-sky', 5)
        l = pg.evaluate('W3D.maps.last.sky'); print('    the star map: %s ms to open, %s triangles in %s draw calls, %s shapes and %s pictures held' % (l['openMs'], '{:,}'.format(l['triangles']), l['calls'], l['geometries'], l['textures']))
        fr = [f for f in pg.frames if f != pg.main_frame][0]
        fr.evaluate("StarMap.select('thareia'); StarMap._skip && StarMap._skip()"); shot('11-sky-thareia', 4)
        fr.evaluate("StarMap.select('aurous'); StarMap._skip && StarMap._skip()"); shot('12-sky-moon', 4)
        pg.evaluate(CLOSE)
        b.close()
print('page errors: %d' % len(errors))
for e in errors[:10]:
    print('  ' + e[:300])
sys.exit(1 if errors else 0)
