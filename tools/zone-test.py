#!/usr/bin/env python3
"""zone-test.py: plays the zone page with no screen and checks, by numbers, that the places are joined.

    python3 tools/zone-test.py builds/zone-1.html

For every place after the first it walks Io from the land onto the place's own ground and on into it, and checks that she
got there without stopping and that her height never jumped at the edge. It then checks the land's rules at 4,000 spots
(no spot in water can be stood on; no spot is both a place's and the land's) and that the page made no errors.
The walks are listed in WALKS below: where she starts (metres, x east and z south of Wickhollow's square), which way she
walks (the camera's turn: -1.57 walks east, 1.57 west, 3.14 south, 0 north), for how many seconds, and where she must end.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

WALKS = [
    ('from Wickhollow\'s bridge east along the road to the Thornwood\'s west gate', [22, -7], -1.5708, 46, lambda e, R: e[0] > R['The Thornwood']['x0'] - 6),
    ('in through the Thornwood\'s west gate, past its hedge', [128, -7.3], -1.5708, 22, lambda e, R: e[0] > R['The Thornwood']['x0'] + 22),
    ('out of the Thornwood\'s east gate onto the land', [300, 1.8], -1.5708, 16, lambda e, R: e[0] > R['The Thornwood']['x1'] + 8),
    ('back in through the east gate', [332, 2.5], 1.5708, 16, lambda e, R: e[0] < R['The Thornwood']['x1'] - 8),
]
page_file = os.path.abspath(sys.argv[1]); errors, fails = [], []
def check(ok, text):
    print(('  ok    ' if ok else '  FAIL  ') + text)
    if not ok: fails.append(text)
WALK = """([x, z, camYaw, secs]) => {
  const w = window.__w3d, M = w.P.M; const at = w.nearestFit(M.px(x), M.py(z)); w.setIo(at[0], at[1], camYaw + Math.PI); w.setCam(camYaw, 0.4, 8); w.push(0, -1, 1.0);
  let last = w.io.y, jump = 0, stuck = 0, lx = M.x(w.io.px), lz = M.z(w.io.py);
  for (let i = 0; i < secs * 30; i++) { w.step(1 / 30, 30, false); jump = Math.max(jump, Math.abs(w.io.y - last)); last = w.io.y;
    if (i % 30 === 29) { const x = M.x(w.io.px), z = M.z(w.io.py); if (Math.hypot(x - lx, z - lz) < 0.3) stuck++; lx = x; lz = z; } }
  w.push(null); return { jump, stuck, end: [M.x(w.io.px), M.z(w.io.py)] }; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 960, 'height': 540}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    if pg.evaluate('window.__err || null'): print('THE PAGE DID NOT START:', pg.evaluate('window.__err')); sys.exit(1)
    R = {r['name']: r for r in pg.evaluate('window.__land.rects')}
    print('the places, and how far their own ground reaches (metres east and south of Wickhollow\'s square):')
    for n, r in R.items(): print('   %-16s %6.1f to %6.1f east, %6.1f to %6.1f south' % (n, r['x0'], r['x1'], r['z0'], r['z1']))
    print('1. walking between them')
    for name, at, yaw, secs, want in WALKS:
        r = pg.evaluate(WALK, at + [yaw, secs])
        check(want(r['end'], R), '%s (ended %.0f m east, %.0f m south)' % (name, r['end'][0], r['end'][1]))
        check(r['jump'] < 0.15, '   her height never jumped (at most %.1f cm in a thirtieth of a second)' % (r['jump'] * 100))
        print('           (seconds she spent stopped against something on the way: %d of %d)' % (r['stuck'], secs))
    print('2. the land\'s rules at 4,000 spots')
    r = pg.evaluate("""() => { const L = window.__land, [x0, z0, x1, z1] = L.bounds; let n = 0, ok = 0, wet = 0, bad = 0; let s = 777; const rnd = () => (s = (s * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
      for (let i = 0; i < 4000; i++) { const x = x0 + rnd() * (x1 - x0), z = z0 + rnd() * (z1 - z0); if (L.rects.some((r) => x > r.x0 && x < r.x1 && z > r.z0 && z < r.z1)) continue; n++;
        const f = L.field(x, z), w = L.walkable(x, z); if (!isFinite(f.h)) bad++; if (w) ok++; if (w && f.sd < 0.4) wet++; }
      return { n, ok, wet, bad }; }""")
    check(r['bad'] == 0, 'every spot has a height'); check(r['wet'] == 0, 'no spot in the water can be stood on')
    print('        %d of %d spots on the land can be stood on (%d%%)' % (r['ok'], r['n'], round(100 * r['ok'] / r['n'])))
    print('   how long a piece of land takes to make, thousandths of a second: ' + json.dumps(pg.evaluate('window.__land.times()')))
    print('3. page errors: %d' % len(errors))
    for e in errors[:8]: print('   ' + e[:300])
    check(len(errors) == 0, 'the page made no errors')
    b.close()
print('\n%s' % ('ALL PASSED' if not fails else '%d FAILED' % len(fails)))
sys.exit(1 if fails else 0)
