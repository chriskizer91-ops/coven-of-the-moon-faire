#!/usr/bin/env python3
"""walk-test.py: plays the first test with no screen and checks what can be checked by numbers.

    python3 tools/walk-test.py builds/first-test.html

It checks:
  1. Out and back. Io starts on the town's bridge, walks east off the town's own ground into the land, keeps going, then
     turns round and walks back onto the bridge. She must cross the town's edge both ways without stopping, and her
     height must never jump (no step, no drop) as she crosses.
  2. South. The same out of the south road.
  3. The land's rules. 4,000 spots: no spot in water or inside a tree can be stood on, and asking never fails.
  4. A herb. She is put beside the nearest herb and walks into it: it must go into her bag and off the ground.
  5. The page makes no errors.
Distances are metres. The town's own ground ends 49.1 m east and 46.6 m south of the square's middle.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

page_file = os.path.abspath(sys.argv[1])
errors, fails = [], []
def check(ok, text):
    print(('  ok    ' if ok else '  FAIL  ') + text)
    if not ok: fails.append(text)

WALK = """async ([px, py, camYaw, secs]) => {
  const w = window.__w3d, M = w.P.M; w.setIo(px, py, camYaw + Math.PI); w.setCam(camYaw, 0.4, 8); w.push(0, -1, 1.0);
  const out = []; let last = w.io.y, jump = 0, stuck = 0, lastX = M.x(w.io.px), lastZ = M.z(w.io.py);
  for (let i = 0; i < secs * 30; i++) {
    w.step(1 / 30, 30, false);
    jump = Math.max(jump, Math.abs(w.io.y - last)); last = w.io.y;
    if (i % 30 === 29) { const x = M.x(w.io.px), z = M.z(w.io.py); if (Math.hypot(x - lastX, z - lastZ) < 0.3) stuck++; lastX = x; lastZ = z; out.push([+x.toFixed(1), +z.toFixed(1), +w.io.y.toFixed(2)]); }
  }
  w.push(null);
  return { path: out, jump: +jump.toFixed(3), stuck, end: [M.x(w.io.px), M.z(w.io.py)] };
}"""

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 960, 'height': 540})
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test')
    pg.wait_for_function('window.__ready || window.__err', timeout=180000)
    if pg.evaluate('window.__err || null'):
        print('THE PAGE DID NOT START:', pg.evaluate('window.__err')); sys.exit(1)
    rect = pg.evaluate('window.__land.rect')
    print('the town\'s own ground: %.1f to %.1f m east, %.1f to %.1f m south' % (rect[0], rect[2], rect[1], rect[3]))

    print('1. east over the bridge, out into the Thornwood, and back')
    r = pg.evaluate(WALK, [1320, 378, -1.5708, 34])
    check(r['end'][0] > rect[2] + 30, 'walked %.0f m past the town\'s east edge (ended %.0f m east of the square)' % (r['end'][0] - rect[2], r['end'][0]))
    check(r['jump'] < 0.12, 'her height never jumped on the way out (the biggest change in one thirtieth of a second: %.1f cm)' % (r['jump'] * 100))
    check(r['stuck'] <= 2, 'she kept moving (seconds spent stopped: %d of 34)' % r['stuck'])
    out_end = r['end']
    r = pg.evaluate("""async ([camYaw, secs]) => { const w = window.__w3d; return (%s)([w.io.px, w.io.py, camYaw, secs]); }""" % WALK, [1.5708, 44])
    check(r['end'][0] < rect[2] - 2, 'walked back onto the town\'s own ground (ended %.0f m east of the square, the edge is at %.0f)' % (r['end'][0], rect[2]))
    check(r['jump'] < 0.12, 'her height never jumped on the way back (%.1f cm)' % (r['jump'] * 100))

    print('2. south down the road, out of town, and back')
    r = pg.evaluate(WALK, [782, 940, 3.1416, 30])
    check(r['end'][1] > rect[3] + 25, 'walked %.0f m past the town\'s south edge' % (r['end'][1] - rect[3]))
    check(r['jump'] < 0.12, 'her height never jumped (%.1f cm)' % (r['jump'] * 100))
    r = pg.evaluate("""async ([camYaw, secs]) => { const w = window.__w3d; return (%s)([w.io.px, w.io.py, camYaw, secs]); }""" % WALK, [0, 36])
    check(r['end'][1] < rect[3] - 2, 'walked back into town (ended %.0f m south of the square, the edge is at %.0f)' % (r['end'][1], rect[3]))

    print('3. the land\'s rules, at 4,000 spots')
    r = pg.evaluate("""() => { const L = window.__land, [x0, z0, x1, z1] = L.bounds; let n = 0, ok = 0, wetStand = 0, bad = 0, lo = 1e9, hi = -1e9; let s = 12345; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      for (let i = 0; i < 4000; i++) { const x = x0 + rnd() * (x1 - x0), z = z0 + rnd() * (z1 - z0); if (x > L.rect[0] && x < L.rect[2] && z > L.rect[1] && z < L.rect[3]) continue; n++;
        const f = L.field(x, z), w = L.walkable(x, z); if (!isFinite(f.h)) bad++; if (w) ok++; if (w && f.sd < 0.4) wetStand++; lo = Math.min(lo, f.h); hi = Math.max(hi, f.h); }
      return { n, ok, wetStand, bad, lo, hi }; }""")
    check(r['bad'] == 0, 'every spot has a height (lowest %.1f m, highest %.1f m)' % (r['lo'], r['hi']))
    check(r['wetStand'] == 0, 'no spot in the water can be stood on')
    print('        %d of %d spots can be stood on (%d%%): the rest are water, trees, stones or the land\'s rim' % (r['ok'], r['n'], round(100 * r['ok'] / r['n'])))

    print('4. a herb')
    r = pg.evaluate("""async () => { const w = window.__w3d, M = w.P.M, L = window.__land;
      w.setIo(M.px(110), M.py(-22), 0); w.step(2, 30, false); for (let i = 0; i < 60 && L.pending(); i++) w.step(0.2, 30, false);
      return { before: L.numbers().herbs }; }""")
    herbs_before = r['before']
    r = pg.evaluate("""async () => { const w = window.__w3d, M = w.P.M, L = window.__land; let got = null; const old = window.W3D.landEvents.herb; window.W3D.landEvents.herb = (k, n, bag) => { got = [k.name, n]; old(k, n, bag); };
      const h = L.nearestHerb(110, -22); if (!h) return { none: true };
      w.setIo(M.px(h.x - 1.6), M.py(h.z), Math.PI / 2); w.setCam(-Math.PI / 2, 0.4, 8); w.push(0, -1, 0.6);
      for (let i = 0; i < 90 && !got; i++) w.step(1 / 30, 30, false); w.push(null); w.step(0.1, 30, false);
      return { got, after: L.numbers().herbs, bag: Object.assign({}, L.bag), text: document.getElementById('bag').textContent }; }""")
    check(bool(r.get('got')), 'she walked into a herb and it went into her bag: %s' % json.dumps(r.get('got')))
    check(r.get('after', herbs_before) == herbs_before - 1, 'it is gone from the ground (%d herbs near her before, %d after)' % (herbs_before, r.get('after', -1)))
    check(bool(r.get('text')), 'the bag on the screen reads "%s"' % r.get('text'))

    t = pg.evaluate('window.__land.times()')
    print('   how long the land takes to make a piece, in thousandths of a second (on this machine): ' + json.dumps(t))
    print('5. page errors: %d' % len(errors))
    for e in errors[:8]: print('   ' + e[:300])
    check(len(errors) == 0, 'the page made no errors')
    b.close()
print('\n%s' % ('ALL PASSED' if not fails else '%d FAILED' % len(fails)))
sys.exit(1 if fails else 0)
