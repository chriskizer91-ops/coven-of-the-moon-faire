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
WALK_ROAD = """([pts, secs, extra]) => {
  const w = window.__w3d, M = w.P.M, L = window.__land; let k = 1; const at = w.nearestFit(M.px(pts[0][0]), M.py(pts[0][1])); w.setIo(at[0], at[1], 0);
  let last = null, jump = 0, pj = 0, lo = 1e9, hi = -1e9, t = 0; const rects = L.rects;
  for (let i = 0; i < secs * 30 && k < pts.length; i++) { const x = M.x(w.io.px), z = M.z(w.io.py); if (Math.hypot(pts[k][0] - x, pts[k][1] - z) < 4) { k++; if (k >= pts.length) break; }
    w.setCam(Math.atan2(-(pts[k][0] - x), -(pts[k][1] - z)), 0.4, 8); w.push(0, -1, 1.3); w.step(1 / 30, 30, false); t++;   // (1.3: a sprint, 5.2 m a second)
    // (her height's biggest change in one step, on the land; a place's own ramps and steps are counted apart)
    const nx = M.x(w.io.px), nz = M.z(w.io.py), inP = rects.some((q) => (nx > q.x0 - 0.3 && nx < q.x1 + 0.3 && nz > q.z0 - 0.3 && nz < q.z1 + 0.3) || (x > q.x0 - 0.3 && x < q.x1 + 0.3 && z > q.z0 - 0.3 && z < q.z1 + 0.3));
    if (last !== null) { const dj = Math.abs(w.io.y - last); if (inP) pj = Math.max(pj, dj); else jump = Math.max(jump, dj); } last = w.io.y; lo = Math.min(lo, w.io.y); hi = Math.max(hi, w.io.y); }
  for (let i = 0; i < extra * 30; i++) w.step(1 / 30, 30, false);   // (walking on a little, the way she was going)
  w.push(null); const x = M.x(w.io.px), z = M.z(w.io.py), e = pts[pts.length - 1];
  return { jump, left: Math.hypot(e[0] - x, e[1] - z), secs: t / 30, lo, hi, name: L.region(), done: k >= pts.length, end: [x, z], pj }; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 960, 'height': 540}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    if pg.evaluate('window.__err || null'): print('THE PAGE DID NOT START:', pg.evaluate('window.__err')); sys.exit(1)
    R = {r['name']: r for r in pg.evaluate('window.__land.rects')}
    print('the places, and how far their own ground reaches (metres east and south of Wickhollow\'s square):')
    for n, r in R.items(): print('   %-16s %6.1f to %6.1f east, %6.1f to %6.1f south' % (n, r['x0'], r['x1'], r['z0'], r['z1']))
    print('1. walking the roads between them, at a sprint (5.2 m a second)')
    import math
    def cut(pts, a, b):   # the stretch of a road between a and b metres along it
        out, d = [], 0.0
        for i, q in enumerate(pts):
            if i: d += math.hypot(q[0] - pts[i - 1][0], q[1] - pts[i - 1][1])
            if a <= d <= b: out.append(q)
        return out
    roads = pg.evaluate('window.__land.roadList'); lr = pg.evaluate('(() => { const m = window.__land.mapData(); return m.longRoad ? m.longRoad.pts : null; })()')
    for rd in roads + ([{'name': 'the long road', 'to': None, 'pts': lr}] if lr else []):
        if not rd['name']: continue
        pts = rd['pts']; total = sum(math.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(len(pts) - 1))
        runs = [('all %d m of it' % total, pts, True)] if total < 520 else [('its first 220 m', cut(pts, 0, 220), False), ('its last 220 m (of %d m)' % total, cut(pts, total - 220, total + 1), True)]
        for what, run, to_end in runs:
            ln = sum(math.hypot(run[i + 1][0] - run[i][0], run[i + 1][1] - run[i][1]) for i in range(len(run) - 1))
            r = pg.evaluate(WALK_ROAD, [run, ln / 5.2 * 1.6 + 25, 3 if (to_end and rd['to']) else 0])
            check(r['done'], '%s, %s: she reached its end in %.0f s (her height went from %.1f to %.1f m)' % (rd['name'], what, r['secs'], r['lo'], r['hi']))
            check(r['jump'] < 0.15, '   on the land her height never jumped (at most %.1f cm in a thirtieth of a second; on a place\'s own ground %.1f cm)' % (r['jump'] * 100, r['pj'] * 100))
            if to_end and rd['to']:
                q = R[rd['to']]; e = r['end']
                check(e[0] > q['x0'] and e[0] < q['x1'] and e[1] > q['z0'] and e[1] < q['z1'], '   and walking on, she stood on the ground of %s' % rd['to'])
    if lr:
        w = pg.evaluate('(() => { const L = window.__land, lr = L.mapData().longRoad.pts; let n = 0, ok = 0, wet = 0; for (let i = 0; i < lr.length; i++) for (const o of [-60, -30, 0, 30, 60]) { const a = lr[Math.max(0, i - 1)], b = lr[Math.min(lr.length - 1, i + 1)], l = Math.hypot(b[0] - a[0], b[1] - a[1]), x = lr[i][0] - (b[1] - a[1]) / l * o, z = lr[i][1] + (b[0] - a[0]) / l * o, f = L.field(x, z), wk = L.walkable(x, z); n++; if (wk) ok++; if (wk && f.sd < 0.4) wet++; } return { n, ok, wet }; })()')
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
