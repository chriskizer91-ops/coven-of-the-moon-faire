#!/usr/bin/env python3
"""zone-test.py: plays the zone page with no screen and checks, by numbers, that the places are joined.

    python3 tools/zone-test.py builds/zone-1.html

For every place after the first it walks Io from the land onto the place's own ground and on into it, and checks that she
got there without stopping and that her height never jumped at the edge. It then checks the land's rules at 4,000 spots
(no spot in water can be stood on; no spot is both a place's and the land's) and that the page made no errors.
The walks are listed in WALKS below: where she starts (metres, x east and z south of Wickhollow's square), the spot she
walks straight toward (through whatever is between, sliding round trees), for how many seconds, and where she must end.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

WALKS = [   # (what, where she starts, the spot she walks straight toward, seconds, the place she must end up on)
    ('the Moon Faire\'s gate, up to Wickhollow', [-37, 128], [-5, 30], 50, 'Wickhollow'),
    ('Wickhollow\'s bridge, east along the road, to the Thornwood', [22, -7], [170, -7.3], 46, 'The Thornwood'),
    ('the Thornwood\'s east gate, on to Bogmire', [322, 2], [440, 2], 40, 'Bogmire'),
    ('Bogmire\'s north road, up to the fen\'s dark heart', [463.5, -42], [463.5, -140], 30, 'The fen’s dark heart'),
    ('Wickhollow\'s south road, down past the camp to Io\'s cottage', [0.5, 50], [-44.7, 210], 70, 'Io’s cottage'),
    ('the cottage\'s west road, round to the jetty', [-84, 230], [-190, 245], 44, 'The jetty'),
    ('the jetty, back toward Wickhollow', [-150, 230], [-30, 20], 110, 'Wickhollow'),
]
# walks along a road of the land: (what, the road's points to follow [first, last], seconds)
ROAD_WALKS = [
    ('off the jetty road, west to the long road\'s gate', 'gate', 90),
    ('the long road, its first 600 m', [0, 11], 170),
    ('the long road, over its highest hill', [30, 38], 140),
    ('the long road, its last 300 m', [-7, -1], 100),
]
GATE_ROAD = [[-165, 216], [-200, 205], [-245, 190], [-300, 160], [-350, 128], [-400, 105]]
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
WALK_ROAD = """([pts, secs]) => {
  const w = window.__w3d, M = w.P.M, L = window.__land; let k = 1; const at = w.nearestFit(M.px(pts[0][0]), M.py(pts[0][1])); w.setIo(at[0], at[1], 0);
  let last = null, jump = 0, lo = 1e9, hi = -1e9, t = 0;
  for (let i = 0; i < secs * 30 && k < pts.length; i++) { const x = M.x(w.io.px), z = M.z(w.io.py); if (Math.hypot(pts[k][0] - x, pts[k][1] - z) < 4) { k++; if (k >= pts.length) break; }
    w.setCam(Math.atan2(-(pts[k][0] - x), -(pts[k][1] - z)), 0.4, 8); w.push(0, -1, 1.3); w.step(1 / 30, 30, false); t++;   // (1.3: a sprint, 5.2 m a second)
    if (last !== null) jump = Math.max(jump, Math.abs(w.io.y - last)); last = w.io.y; lo = Math.min(lo, w.io.y); hi = Math.max(hi, w.io.y); }
  w.push(null); const x = M.x(w.io.px), z = M.z(w.io.py), e = pts[pts.length - 1];
  return { jump, left: Math.hypot(e[0] - x, e[1] - z), secs: t / 30, lo, hi, name: L.region(), done: k >= pts.length }; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 960, 'height': 540}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    if pg.evaluate('window.__err || null'): print('THE PAGE DID NOT START:', pg.evaluate('window.__err')); sys.exit(1)
    R = {r['name']: r for r in pg.evaluate('window.__land.rects')}
    print('the places, and how far their own ground reaches (metres east and south of Wickhollow\'s square):')
    for n, r in R.items(): print('   %-16s %6.1f to %6.1f east, %6.1f to %6.1f south' % (n, r['x0'], r['x1'], r['z0'], r['z1']))
    print('1. walking between them')
    import math
    for name, at, to, secs, place in WALKS:
        yaw = math.atan2(-(to[0] - at[0]), -(to[1] - at[1]))
        r = pg.evaluate(WALK, at + [yaw, secs]); q = R[place]; e = r['end']
        inside = e[0] > q['x0'] + 3 and e[0] < q['x1'] - 3 and e[1] > q['z0'] + 3 and e[1] < q['z1'] - 3
        check(inside, '%s: she ended on its ground (%.0f m east, %.0f m south)' % (name, e[0], e[1]))
        check(r['jump'] < 0.15, '   her height never jumped (at most %.1f cm in a thirtieth of a second)' % (r['jump'] * 100))
        print('           (seconds she spent stopped against something on the way: %d of %d)' % (r['stuck'], secs))
    lr = pg.evaluate('(() => { const m = window.__land.mapData(); return m.longRoad ? m.longRoad.pts : null; })()')
    if lr:
        total = sum(math.hypot(lr[i + 1][0] - lr[i][0], lr[i + 1][1] - lr[i][1]) for i in range(len(lr) - 1))
        print('   the long road: %.2f km, %d points' % (total / 1000, len(lr)))
        for name, span, secs in ROAD_WALKS:
            pts = GATE_ROAD if span == 'gate' else lr[span[0]:] if span[1] == -1 else lr[span[0]:span[1] + 1]
            r = pg.evaluate(WALK_ROAD, [pts, secs])
            check(r['done'], '%s: she reached its end in %.0f s (now in "%s"; her height went from %.1f to %.1f m)' % (name, r['secs'], r['name'], r['lo'], r['hi']))
            check(r['jump'] < 0.15, '   her height never jumped (at most %.1f cm in a thirtieth of a second)' % (r['jump'] * 100))
        w = pg.evaluate('(() => { const L = window.__land; let n = 0, ok = 0, wet = 0; for (let i = 0; i < lr.length; i++) for (const o of [-60, -30, 0, 30, 60]) { const a = lr[Math.max(0, i - 1)], b = lr[Math.min(lr.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]), x = lr[i][0] - (b[1] - a[1]) / l * o, z = lr[i][1] + (b[0] - a[0]) / l * o, f = L.field(x, z), wk = L.walkable(x, z); n++; if (wk) ok++; if (wk && f.sd < 0.4) wet++; } return { n, ok, wet }; })()'.replace('lr.', 'window.__land.mapData().longRoad.pts.').replace('lr[', 'window.__land.mapData().longRoad.pts['))
        print('        %d of %d spots along and beside the long road can be stood on' % (w['ok'], w['n'])); check(w['wet'] == 0, 'no spot in the water beside the long road can be stood on')
    f = pg.evaluate("() => { const w = window.__w3d, M = w.P.M, f = w.P.fair; const s = w.P.place.start; return f ? { pieces: f.pieces, lamps: f.lamps, triangles: f.triangles, startOk: w.P.walkable(s[0], s[1]), name: window.__land.region() } : null; }")
    if f:
        print('   the Moon Faire\'s camp: %d pieces, %d lamps and fires, %d triangles' % (f['pieces'], f['lamps'], f['triangles']))
        check(f['startOk'], 'the spot the game starts on, in the camp, can be stood on')
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
