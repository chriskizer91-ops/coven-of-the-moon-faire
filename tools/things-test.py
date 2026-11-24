#!/usr/bin/env python3
"""things-test.py: the small things zone 1's lines speak of, checked with no screen.
    python3 tools/things-test.py builds/zone-1.html
The lit gate lamps at Io's cottage; Old Bridie's lantern on the south road; the Grey Hat's ship at the end of the jetty's
pier (a stand-in) and the twelve lamps that come home to her hooks; the pale moth after the great wraith. It also checks
that the cottage's lines are said at its gate, and the jetty's line where the ship can be seen.
It cannot see a picture or a motion: it checks where things are, what is shown, and when. Look with tools/look.py."""
import sys, os, json
from playwright.sync_api import sync_playwright
page_file = os.path.abspath(sys.argv[1]); errors, fails = [], []
def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok: fails.append(what)
JS = """async () => { const w = window.__w3d, Z = w.P, M = Z.M, P = window.__people, S = window.__story, T = window.__things, out = { err: window.__peopleErr || null };
  if (!T) return out; await P.ready();
  const put = (x, z, yaw) => { w.setIo(M.px(x), M.py(z), yaw == null ? 0 : yaw + Math.PI); if (yaw != null) w.setCam(yaw, 0.12, 6); w.step(0.1, 30, false); }, run = (sec) => w.step(sec, 30, false);
  const part = (id) => Z.parts.find((p) => p.id === id), finish = () => { for (let i = 0; i < 60 * 30 && P.say(); i++) w.step(1 / 30, 30, false); P.stop(); };
  out.things = T.list.map((t) => t.id);
  // ---- the cottage's gate lamps ----
  { const g = T.get('gate-lamps'), c = part('cottage'), own = c.P.lamps.map((l) => [l.x + c.ox, l.y + (c.oy || 0), l.z + c.oz]); put(4.6, 333, Math.PI); T.tick();
    out.gate = (g.halos || []).map((h) => { const p = h.position, d = own.map((o) => [Math.hypot(o[0] - p.x, o[2] - p.z), Math.abs(o[1] - p.y)]).sort((a, b) => a[0] - b[0])[0]; return { off: d[0], up: d[1], shown: h.visible, strength: h.material.opacity, above: p.y - Z.walkH(M.px(p.x), M.py(p.z + 1.2)) }; }); }
  // ---- Old Bridie's lantern ----
  { const b = T.get('bridie-lantern'), br = P.list.find((p) => p.id === 'bridie'), road = Z.land.roadList.find((r) => r.name === 'Wickhollow to Io’s cottage').pts;
    let dRoad = 1e9; for (let i = 1; i < road.length; i++) { const ax = road[i - 1][0], az = road[i - 1][1], bx = road[i][0] - ax, bz = road[i][1] - az, t = Math.max(0, Math.min(1, ((b.x - ax) * bx + (b.z - az) * bz) / (bx * bx + bz * bz))); dRoad = Math.min(dRoad, Math.hypot(b.x - ax - bx * t, b.z - az - bz * t)); }
    out.bridie = b.post ? { fromHer: Math.hypot(b.x - br.x, b.z - br.z), fromRoad: dRoad, lampUp: b.lamp[1] - Z.walkH(M.px(b.lamp[0]), M.py(b.lamp[2])), solid: !Z.walkable(M.px(b.x), M.py(b.z)), herFree: Z.walkable(M.px(br.x + (br.lookX - br.x) * 0.6), M.py(br.z + (br.lookZ - br.z) * 0.6)),
      lights: Z.lamps.some((l) => Math.hypot(l.x - b.lamp[0], l.y - b.lamp[1], l.z - b.lamp[2]) < 0.1), triangles: b.post.triangles, pool: !!(b.pool && b.pool.parent) } : null; }
  // ---- the ship and her lamps ----
  { const s = T.get('ship-lamps'), J = window.W3D_PLACES.jetty.ship, j = part('jetty'), shown = () => ({ n: s.n, glass: s.glass.geometry.drawRange.count / 36, iron: s.iron.geometry.drawRange.count / 72, halos: s.halos.filter((h) => h.visible).length });
    out.ship = { standIn: J.standIn, hooks: J.hooks.length, port: J.hooks.filter((h) => h[2] < J.at[2]).length, lowest: Math.min(...J.hooks.map((h) => h[1])) - J.at[1], clearOfPier: J.at[2] - J.beam / 2 - 14.4, inPlace: J.hooks.every((h) => Math.abs(h[0]) < 49 && Math.abs(h[2]) < 46),
      walkOn: Z.walkable(M.px(j.ox + J.at[0]), M.py(j.oz + J.at[2])), counts: [] };
    S.reset(); for (const n of [0, 1, 4, 11, 12]) { S.setLamps(n); T.tick(); out.ship.counts.push([n, shown()]); }
    put(j.ox, j.oz + 12, Math.PI); T.tick(); out.ship.strength = s.halos[0].material.opacity; S.setLamps(0); T.tick(); }
  // ---- when the cottage's lines and the jetty's line are said ----
  { const told = (x, z) => { S.reset(); S.set({ moments: { opening: true } }); P.stop(); put(x, z); S.watch(); if (!P.say()) S.watch(); const s = P.say(); finish(); return s ? s.id : null; };   // (a thing to be told is noted on one look and said on the next)
    const c = part('cottage'), j = part('jetty');
    out.cottage = { far: told(4.7, c.z0 - 34), gate: told(4.6, 333), garden: told(14.3, 390) };
    out.jetty = { top: told(j.ox, j.z0 - 6), quay: told(j.ox, j.oz - 9) }; }
  // ---- the moth ----
  { const m = T.get('moth'), g = (window.__fights && window.__fights.gate) || { at: [1348, 2180] }, at = () => ({ x: m.root.position.x, y: m.root.position.y, z: m.root.position.z, shown: m.root.visible, strength: m.mat.opacity });
    S.reset(); S.set({ stage: 3, moments: { opening: true } }); P.stop(); m.done = false; m.T0 = -1; put(g.at[0], g.at[1] + 6, 0); T.tick();
    const o = out.moth = { before: m.root.visible };
    // the great wraith is let go: marked in the party's own record, the way a won gate fight marks it
    const pty = window.__fights && window.__fights.party; o.byParty = !!(pty && pty.gates); if (o.byParty) pty.gates[g.id || 'greatWraith'] = true; else S.flag('gate', true);
    S.watch(); o.said = P.say() ? P.say().id : null; T.tick(); const me = P.me(), y0 = Z.walkH(M.px(me.x), M.py(me.z));
    o.start = at(); o.fromCoven = Math.hypot(o.start.x - me.x, o.start.z - me.z); o.ahead = o.start.z < me.z; o.y0 = y0; o.fromSpot = Math.hypot(o.start.x - g.at[0], o.start.z - g.at[1]); o.spot = g.at; o.heart = (() => { const h = part('bogmire-heart'); return g.at[0] > h.x0 && g.at[0] < h.x1 && g.at[1] > h.z0 && g.at[1] < h.z1 && Z.walkable(M.px(g.at[0]), M.py(g.at[1])); })();
    run(6); o.s6 = at(); run(24); o.s30 = at(); run(30); o.s60 = at(); finish(); run(70); T.tick(); o.s130 = at(); o.done = m.done;
    run(3); T.tick(); o.again = m.root.visible;
    // opened after the great wraith was already let go: no moth
    m.done = null; m.T0 = -1; T.looks(); T.tick(); run(1); o.late = m.root.visible;
    // with the camera turned away from the spot, it rises where the camera looks
    m.done = false; m.T0 = -1; m.root.visible = false; put(g.at[0], g.at[1] + 6, Math.PI); const p0 = m.fly(), me2 = P.me(); o.away = { fromSpot: Math.hypot(p0[0] - g.at[0], p0[2] - g.at[1]), fromCoven: Math.hypot(p0[0] - me2.x, p0[2] - me2.z), south: p0[2] > me2.z };
    m.T0 = -1; m.done = true; m.root.visible = false; if (o.byParty) delete pty.gates[g.id || 'greatWraith']; }
  return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    r = pg.evaluate(JS); b.close()
if '--json' in sys.argv: print(json.dumps(r, indent=1))
check(not r.get('err') and r.get('things') == ['gate-lamps', 'bridie-lantern', 'ship-lamps', 'moth'], 'the four things are made: %s' % ', '.join(r.get('things') or ['none: ' + str(r.get('err'))]))
if r.get('things'):
    print('1. the gate lamps at Io\'s cottage')
    g = r['gate']
    check(len(g) == 4, 'four glows, one for each gate pillar\'s lantern (the lane\'s two, the garden gate\'s two)')
    check(all(q['off'] < 0.3 and q['up'] < 0.3 for q in g), 'each sits on one of the cottage\'s own lanterns (the furthest is %.0f cm off)' % (100 * max(max(q['off'], q['up']) for q in g)))
    check(all(q['shown'] and q['strength'] > 0.4 for q in g[:2]), 'from the lane, 14 m off, the two by the lane are lit (strength %.2f of 0.8)' % min(q['strength'] for q in g[:2]))
    check(all(2.0 < q['above'] < 4.2 for q in g), 'each is %.1f to %.1f m above the ground' % (min(q['above'] for q in g), max(q['above'] for q in g)))
    print('2. Old Bridie\'s lantern')
    o = r['bridie']
    check(bool(o) and o['triangles'] > 10, 'one of the Faire\'s lantern posts stands there (%d triangles)' % (o['triangles'] if o else 0))
    if o:
        check(0.8 < o['fromHer'] < 1.8, 'it is %.1f m from where she stands' % o['fromHer'])
        check(o['fromRoad'] > 1.8, 'it is off the road: %.1f m from the road\'s middle (the road is 3.3 m wide)' % o['fromRoad'])
        check(2.0 < o['lampUp'] < 3.6, 'its lamp hangs %.1f m above the ground' % o['lampUp'])
        check(o['solid'], 'the post cannot be walked through')
        check(o['herFree'], 'the way up to Old Bridie from the road is still open')
        check(o['lights'] and o['pool'], 'its lamp lights whoever stands by it, and the ground under it')
    print('3. the Grey Hat\'s ship (a stand-in) and her twelve lamps')
    s = r['ship']
    check(s['standIn'] is True, 'the ship is marked as a stand-in')
    check(s['hooks'] == 12 and s['port'] == 6, 'twelve lamp hooks, six a side')
    check(s['lowest'] > 1.5 and s['inPlace'], 'every hook is over the water, inside the jetty\'s own ground (the lowest lamp hangs %.1f m above the lake)' % s['lowest'])
    check(s['clearOfPier'] > 1.0, 'she lies clear of the pier\'s end, by %.1f m' % s['clearOfPier'])
    check(not s['walkOn'], 'she cannot be walked onto')
    for n, c in s['counts']: check(c['n'] == n and c['glass'] == n and c['iron'] == n and c['halos'] == n, 'with %d lamps home, %d hang lit on her hooks' % (n, c['halos']))
    check(s['strength'] > 0.4, 'from the foot of the pier a lamp\'s glow is strong (%.2f of 0.75)' % s['strength'])
    print('4. when the lines that speak of them are said')
    c, j = r['cottage'], r['jetty']
    check(c['far'] is None, 'on the road 34 m short of the cottage, where no lamp can be seen, the cottage\'s lines are not said')
    check(c['gate'] == 'z1.narrator.02', 'at the lane\'s gate they are: the narrator first (%s)' % c['gate'])
    check(c['garden'] == 'z1.narrator.02', 'and at the garden gate, coming from the south (%s)' % c['garden'])
    check(j['top'] is None, 'at the top of the jetty\'s lane, where the ship cannot be seen, the jetty\'s line is not said')
    check(j['quay'] == 'z1.narrator.17', 'down on the quay it is (%s)' % j['quay'])
    print('5. the pale moth')
    m = r['moth']
    check(m['before'] is False, 'before the great wraith is let go there is no moth')
    check(m['said'] == 'z1.narrator.06', 'when it is (%s), the narrator speaks of the moth (%s)' % ('marked won in the party\'s record' if m.get('byParty') else 'by the story\'s own flag', m['said']))
    check(m['heart'], 'the great wraith\'s spot (%.0f, %.0f) is in the fen\'s dark heart, on ground that can be walked' % tuple(m['spot']))
    check(m['start']['shown'] and 3 < m['fromCoven'] < 9 and m['ahead'], 'the moth is there at once, %.1f m from the coven, the way the camera looks' % m['fromCoven'])
    check(m['fromSpot'] < 0.5, 'it rises on the great wraith\'s own spot when the camera has that in view')
    check(m['away']['fromSpot'] > 6 and 5 < m['away']['fromCoven'] < 8 and m['away']['south'], 'with the camera turned away from the spot it rises where the camera looks, %.1f m from the coven' % m['away']['fromCoven'])
    check(m['s6']['y'] - m['y0'] > 2.5, 'six seconds on it has risen to %.1f m above the road' % (m['s6']['y'] - m['y0']))
    west, north = m['start']['x'] - m['s30']['x'], m['start']['z'] - m['s30']['z']
    check(west > 15 and north > 5 and west > north and m['s30']['shown'] and m['s30']['strength'] > 0.3, 'thirty seconds on it is %.0f m to the west and %.0f m to the north, %.1f m up, and still plain to see' % (west, north, m['s30']['y'] - m['y0']))
    check(m['start']['x'] - m['s60']['x'] > 50 and m['s60']['strength'] < m['s30']['strength'], 'a minute on it is %.0f m west, and fainter (the fog is taking it)' % (m['start']['x'] - m['s60']['x']))
    check(m['s130']['shown'] is False and m['done'] is True and m['again'] is False, 'after about two minutes it is gone, and it does not rise again')
    check(m['late'] is False, 'if the great wraith was let go before the page was opened, no moth rises')
print('6. page errors: %d' % len(errors)); check(not errors, 'no page errors')
for e in errors[:6]: print('  ! ' + e[:300])
print('ALL PASSED' if not fails else '%d FAILED' % len(fails)); sys.exit(1 if fails else 0)
