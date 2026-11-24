#!/usr/bin/env python3
"""story-test.py: zone 2's, zone 3's or zone 4's people and story, checked with no screen.
    python3 tools/story-test.py builds/zone-2.html        (or builds/zone-3.html, or builds/zone-4.html)
It builds every person and checks each as tools/people-test.py does for zone 1 (on the ground, in the open, the Talk
button, a talk that shows and ends). Then it plays the zone's story through as a player would, by standing the coven
where the story needs it, and checks that each stage and each of the coven's moments comes when it should, the
narrator first. It cannot hear a line or see a face move: only Chris can."""
import sys, os, json
from playwright.sync_api import sync_playwright
page_file = os.path.abspath(sys.argv[1]); errors, fails = [], []
def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok: fails.append(what)
JS = """async () => { const P = window.__people, S = window.__story, T = window.__things, L = window.__land, w = window.__w3d, M = w.P.M, t0 = performance.now(); const n = await P.ready(), ms = (performance.now() - t0) / Math.max(1, n), out = { n, ms, people: [], zone: S.zone };
  const finish = () => { for (let i = 0; i < 90 * 30 && P.say(); i++) w.step(1 / 30, 30, false); };
  if (S.zone === 'z4') { S.set({ stage: 4 }); P.move('warden', window.W3D.ZONE4.spots.AWAKE, true); }   // (zone 4: the Warden who speaks is one of the forty until the fire ends: she is looked at as she stands after it)
  for (const p of P.list) { const o = { id: p.id, name: p.name, failed: p.failed || null, moved: !!p.moved };
    o.off = p.npc ? Math.abs(p.npc.root.position.y - w.P.walkH(M.px(p.x), M.py(p.z))) : 9; o.tris = p.npc ? p.npc.triangles : 0;
    o.open = [0, 1, 2, 3, 4, 5, 6, 7].filter((k) => w.P.walkable(M.px(p.x + Math.cos(k * 0.785) * 1.4), M.py(p.z + Math.sin(k * 0.785) * 1.4))).length;
    o.nearest = Math.min(...P.list.filter((q) => q !== p).map((q) => Math.hypot(q.x - p.x, q.z - p.z)));
    let best = null; for (let k = 0; k < 8; k++) { const x = p.x + Math.cos(k * 0.785) * 1.6, z = p.z + Math.sin(k * 0.785) * 1.6; if (w.P.walkable(M.px(x), M.py(z))) { best = [x, z]; break; } }
    if (best) { w.setIo(M.px(best[0]), M.py(best[1]), 0); w.step(0.2, 30, false); P.tick(); o.btn = document.querySelector('.talkbtn').textContent; o.shown = document.querySelector('.talkbtn').style.display !== 'none';
      P.talk(p.id); const s = P.say(); o.said = s ? s.text : null; o.boxed = document.querySelector('.talkbox').style.display !== 'none'; o.talking = !!(p.npc && p.npc.talking);
      finish(); o.ended = !P.say() && document.querySelector('.talkbox').style.display === 'none' && !(p.npc && p.npc.talking); }
    out.people.push(o); }
  // ---- the story ----
  const V = window.COVEN_VOICE || {}, st = out.story = { lines: S.lines.length, voiced: S.lines.filter((l) => V[l.id]).length, bad: [], log: [] };
  for (let stage = 0; stage <= 4; stage++) { S.reset(); S.set({ stage }); for (const p of P.list) { const ls = S.linesFor(p); if ((S.cfg.quiet || {})[p.id] > stage) { if (ls && ls.length) st.bad.push(p.id + ' should have nothing to say at stage ' + stage); continue; }
    if (!ls || !ls.length) st.bad.push(p.id + ' has nothing to say at stage ' + stage); else if (st.voiced) for (const l of ls) if (!V[l.id]) st.bad.push(l.id + ' has no sound'); } }
  S.reset(); P.stop(); if (S.zone === 'z4') P.move('warden', { at: [0, 6000] }, true);
  const part = (id) => w.P.parts.find((q) => q.id === id);
  // what is said next, read through to its end: [line ids]
  const read = () => { const ids = []; let guard = 0; while (P.say() && guard++ < 14) { ids.push(P.say().id); P.talk(); } return ids; };
  const stand = (x, z) => { w.setIo(M.px(x), M.py(z), 0); w.step(0.1, 30, false); P.tick(); T.tick(); };
  const at = (id, px, py) => { const p = part(id); stand(p.ox + p.P.M.x(px), p.oz + p.P.M.z(py)); };
  // let the story look (it looks twice a second in the game), and read whatever it starts: returns the first line's id of each thing said
  const look = (name) => { const got = []; for (let i = 0; i < 6; i++) { S.watch(); if (!P.say()) { if (i > 1) break; continue; } const ids = read(); got.push(ids); } st.log.push([name, S.state().stage, got.map((g) => g[0] + ' +' + (g.length - 1)).join('; ')]); return got; };
  const go = (id) => { const p = P.list.find((q) => q.id === id); stand(p.x + 1.2, p.z + 0.9); if (!w.P.walkable(w.io.px, w.io.py)) stand(p.x - 1.2, p.z + 0.9); P.talk(id); const ids = read(); st.log.push(['talk to ' + id, S.state().stage, ids.join(' ')]); return ids; };
  const until = (id, line, max) => { for (let i = 0; i < max; i++) { const ids = go(id); if (ids.indexOf(line) >= 0) return i + 1; look('after ' + id); } return 0; };
  const pos = (id) => { const p = P.list.find((q) => q.id === id); return [Math.round(p.x), Math.round(p.z)]; };
  S.begin(); const R = st.r = {};
  if (S.zone === 'z2') {
    at('warm-roads-camp', 575, 466); R.landing = look('the start');
    R.captain = go('captain'); R.warden = go('roadwarden'); R.stage1 = S.state().stage; R.told = look('after the roadwarden');
    R.cant0 = T.list.map((t) => t.lit[0].visible).join(',');
    at('ember-line-road', 585, 486); R.btn = document.querySelectorAll('.talkbtn')[1].textContent; R.first = look('at the first road stone');
    T.use('node-road'); R.lit1 = look('one lit'); R.nodes1 = S.state().nodes;
    at('ember-line-road', 240, 252); R.btn2 = document.querySelectorAll('.talkbtn')[1].textContent; T.use('node-ring'); R.lit2 = look('two lit');
    at('ember-line-road', 1352, 200); R.btn3 = document.querySelectorAll('.talkbtn')[1].textContent; T.use('node-rise'); R.lit3 = look('three lit'); R.nodes3 = S.state().nodes; R.lights = T.list.map((t) => t.lit[0].visible).join(',');
    R.warden2 = go('roadwarden');
    at('dawnroost', 645, 900); R.dawn = look('coming into Dawnroost'); R.stage2 = S.state().stage;
    R.marta = go('marta'); R.beds = look('after Marta'); R.martaN = until('marta', 'z2.marta.06', 6); R.stage3 = S.state().stage;
    at('dawnroost-node', 768, 900); R.node = look('at the living node'); R.stage4 = S.state().stage;
    R.capN = until('captain', 'z2.captain.10', 8); R.leaving = look('after the Grey Hat');
  } else if (S.zone === 'z4') {
    // ---- zone 4: from the landing to the leaving for the Faire ----
    const Q = window.W3D.ZONE4, TH = (id) => T.get(id), play = (sec) => { w.step(sec, 30, false); P.tick(); T.tick(); }, one = (name) => { S.watch(); const ids = read(); st.log.push([name, S.state().stage, ids.join(' ')]); return ids; };
    const onRoad = (name, dist) => { const q = L.roadList.find((r) => r.name === name).pts; let d = 0; for (let i = 1; i < q.length; i++) { const sg = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]); if (d + sg >= dist) { const f = (dist - d) / sg; return [q[i - 1][0] + (q[i][0] - q[i - 1][0]) * f, q[i - 1][1] + (q[i][1] - q[i - 1][1]) * f]; } d += sg; } return q[q.length - 1]; };
    await TH('wardens').ready(); await TH('halcyon').ready(); R.failed = [TH('wardens').failed || null, TH('halcyon').failed || null];
    at('frozen-camp', 630, 452); R.landing = look('the start');
    play(0.2); R.spare0 = TH('spare-lamp').h.visible; R.captain = go('captain'); play(0.2); R.spare1 = TH('spare-lamp').h.visible; R.stage0 = S.state().stage; R.keeper = go('passkeeper'); R.stage1 = S.state().stage; R.keeper2 = go('passkeeper');
    R.shipOn = !!(window.COVEN_SHIPS && window.W3D.mooredShip);
    at('frostmere-shore', 560, 430); R.shore = look('at Frostmere’s shore');
    at('frozen-pass', 774, 545); R.pass = look('at the frozen pass');
    // the great bramble, on the road above the pass
    { const B = TH('bramble'), b = Q.bramble.at, far = onRoad(Q.spots.R3, Q.bramble.along - 40), near = onRoad(Q.spots.R3, Q.bramble.along - 14);
      stand(far[0], far[1]); R.far = look('40 m short of the bramble'); R.canes = B.canes; R.mid0 = B.mid.visible; R.shut = !L.walkable(b[0], b[1]); R.stops = B.stops.filter((q) => q.r > 0).length;
      stand(near[0], near[1]); R.bramble = look('before the great bramble'); play(0.2); R.mid1 = B.mid.visible; R.open = L.walkable(b[0], b[1]); R.sides = B.sides.visible; R.stopsLeft = B.stops.filter((q) => q.r > 0).length; }
    at('misthollow', 768, 1300); R.bridge = look('on the bridge into Misthollow'); R.stage2 = S.state().stage;
    play(0.2); { const Wd = TH('wardens'); R.mode0 = Wd.mode; R.forty = Wd.n; R.stillTris = Wd.triangles; R.stillPieces = Wd.pieces; R.dawn = TH('night').sky ? TH('night').sky.state.dawn : -1; R.wardenFar = Math.round(P.list.find((q) => q.id === 'warden').z); }
    at('misthollow', 766, 655); R.town = look('at the top of the great stair');
    R.watch = go('watch'); R.sorrel = go('sorrel'); R.ede = go('ede'); play(0.2); R.hearth0 = TH('ede-hearth').h.visible; R.wisps0 = TH('cold-lights').wisps.filter((q) => q.h.visible).length; R.wardenSilent = !S.linesFor(P.list.find((q) => q.id === 'warden'));
    // up the street to the Moonwell
    at('moonwell', 768, 1300); R.street = look('in the Moonwell’s street'); play(0.2); R.light0 = TH('halcyon').light.visible; R.bowls0 = TH('the-fire').bowls[0].visible; R.well0 = TH('the-fire').well.visible; R.body = !!TH('halcyon').npc;
    at('moonwell', 768, 1010); R.stair = look('at the foot of the Moonwell’s stair'); R.stage2b = S.state().stage;
    at('moonwell', 768, 806); R.letter = one('on the stair, before Halcyon'); R.stage3 = S.state().stage; play(13); R.light1 = TH('halcyon').light.visible; R.well1 = TH('the-fire').well.visible;
    R.before = one('before the fire'); R.between = one('between its two forms'); play(4); R.well2 = TH('the-fire').well.visible; R.won = S.ctx.won();
    R.after = look('after the fire'); R.stage4 = S.state().stage; play(0.3); R.bowls4 = TH('the-fire').bowls[0].visible; R.moths = TH('moths').m.visible; R.mothN = TH('moths').N; R.flame = TH('halcyon').flame.visible; R.rest = look('and then'); play(30); R.dark = TH('night').dark; R.stars = TH('night').sky ? TH('night').sky.state.stars : -1;
    R.mode4 = TH('wardens').mode; R.awakeN = TH('wardens').n; R.wardenNow = Math.round(P.list.find((q) => q.id === 'warden').z);
    // down again
    at('misthollow', 766, 655); play(0.3); R.home = TH('halcyon').home; R.hearth4 = TH('ede-hearth').h.visible; R.wisps4 = TH('cold-lights').wisps.filter((q) => q.h.visible).length;
    R.warden = go('warden'); R.watch4 = go('watch'); R.ede4 = go('ede'); R.sorrel4 = go('sorrel');
    at('frozen-pass', 774, 545); look('down past the frozen pass'); play(0.2); R.gone = !!S.state().flags.gone;
    at('frozen-camp', 630, 452); look('back at the camp'); R.keeper4 = go('passkeeper'); play(0.2); R.prints = TH('footprints').m.visible; R.printN = TH('footprints').n; R.modeEnd = TH('wardens').mode; R.capN = until('captain', 'z4.captain.07', 8); R.leave = look('after the Grey Hat'); R.leaving = !!S.state().flags.leaving;
  } else {
    at('northern-camp', 662, 420); R.landing = look('the start'); R.cap0 = pos('captain');
    R.captain = go('captain'); look('after the Grey Hat');
    { const p = part('eldergrove-edge'); stand(p.x0 - 100, p.oz - 2); } R.brambles = look('on the road to Eldergrove'); R.cap1 = pos('captain');
    at('eldergrove-edge', 300, 470); R.grove = look('at Eldergrove’s edge'); R.cutter = go('cutter');
    at('eldergrove-edge', 2500, 620); R.fire = look('at Eldergrove’s east end');
    { const p = part('shipyard'); stand(p.ox - 0.2, p.z1 + 40); } R.sight = look('on the causeway'); R.stage0 = S.state().stage;
    at('shipyard', 760, 990); R.yard = look('on the shipyard’s bridge'); R.stage1 = S.state().stage;
    R.ysmera = go('ysmera'); R.cap = go('captain'); R.stage2 = S.state().stage; R.north = look('after the Grey Hat at the slip'); T.tick(); R.light2 = T.list[0].light.visible;
    at('crossroads', 1100, 480); R.knight = look('at the crossroads'); R.stage3 = S.state().stage; T.tick(); R.light3 = T.list[0].light.visible;
    R.ysN = until('ysmera', 'z3.ysmera.11', 8); R.stage4 = S.state().stage; R.name = look('after the name');
    R.capN = until('captain', 'z3.captain.11', 10); R.leaving = look('after the Grey Hat');
  }
  st.moments = S.state().moments; st.final = S.state().stage;
  return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    r = pg.evaluate(JS); b.close()
print('1. the people (%d made, about %.0f thousandths of a second each here)' % (r['n'], r['ms']))
for o in r['people']:
    check(not o['failed'] and o['tris'] > 0, '%s is there (%d triangles)%s' % (o['name'], o['tris'], ', moved to the nearest spot that can be stood on' if o['moved'] else ''))
    check(o['off'] < 0.05, '   stands on the ground (%.0f cm off)' % (o['off'] * 100))
    check(o['open'] >= 3 and o['nearest'] > 1.2, '   in the open (%d of 8 spots round them can be stood on; the nearest other person is %.1f m off)' % (o['open'], o['nearest']))
    check(o.get('shown') and o.get('btn') == 'Talk to ' + o['name'].replace('The ', 'the '), '   walking up shows the button "%s"' % o.get('btn'))
    check(o.get('said') and o.get('boxed') and o.get('talking'), '   a talk shows their words: "%s"' % o.get('said'))
    check(o.get('ended'), '   and ends by itself')
st = r['story']; R = st['r']; z = r['zone']
print('2. the story, played through')
for name, stage, said in st['log']: print('      %-34s stage %d   %s' % (name, stage, said))
narr = len([1 for l in range(0)])
if z == 'z4' and not st['voiced']: print('        (zone 4: %d lines, none with a recording in the page yet: they are being recorded)' % st['lines'])
else: check(st['lines'] - st['voiced'] == 0, '%d lines, %d with their recording in the page' % (st['lines'], st['voiced']))
check(not st['bad'], 'every person has something to say at every stage, with its sound' + ('' if not st['bad'] else ': ' + '; '.join(st['bad'][:5])))
first = lambda got, want: bool(got) and any(g[0] == want for g in got)
def moment(got, name, least=2): 
    g = next((g for g in (got or []) if g[0] == '%s.narrator.%s' % (z, name[1]) or g[0].startswith('standin.narrator')), None)
    check(g is not None and len(g) >= least, 'the moment "%s": the narrator first (%s), then the coven (%d lines)' % (name[0], g[0] if g else 'not said', len(g) - 1 if g else 0))
if z == 'z2':
    moment(R['landing'], ('landing', '03'))
    check(R['captain'][:2] == ['z2.captain.03', 'z2.captain.04'], 'the Grey Hat\'s first talk sends the coven to the roadwarden (%d lines)' % len(R['captain']))
    check(R['stage1'] == 1 and R['warden'][0] == 'z2.roadwarden.01', 'the roadwarden asks (%d lines), and the stage moves to 1' % len(R['warden']))
    check(first(R['told'], 'z2.narrator.11'), 'the narrator then says where the three dark stones are')
    check(R['cant0'] == 'false,false,false', 'the three road stones start dark')
    check(R['btn'] == 'Light the road stone', 'standing by the stone by the bridge shows the button "%s"' % R['btn'])
    moment(R['first'], ('first-node', '04'))
    check(R['nodes1'] == 1, 'lighting it counts one stone lit'); moment(R['lit1'], ('node-lit', '05'))
    check(first(R['lit2'], 'z2.narrator.12'), 'with two lit the narrator says one is left')
    check(R['nodes3'] == 3 and R['lights'] == 'true,true,true' and first(R['lit3'], 'z2.narrator.13'), 'with three lit all three eyes glow, and the narrator says the road is warm')
    check(len(R['warden2']) > 0, 'the roadwarden has more to say (%s)' % R['warden2'][0])
    check(R['stage2'] == 2, 'coming into Dawnroost with three lit moves the stage to 2'); moment(R['dawn'], ('dawnroost', '06'))
    check(R['marta'][0] == 'z2.marta.01', 'Marta knows Io (%d lines)' % len(R['marta'])); moment(R['beds'], ('forty-beds', '07'))
    check(R['martaN'] > 0 and R['stage3'] == 3, 'Marta tells what comes at night (on talk %d after her first), and the stage moves to 3' % R['martaN'])
    moment(R['node'], ('before-node', '08')); check(R['stage4'] == 4 and any(g[0] == 'z2.narrator.09' for g in R['node']), 'the node holds (no fight yet: a stand-in), the narrator and the coven speak after it, and the stage moves to 4')
    check(R['capN'] > 0, 'the Grey Hat says they can fly (on talk %d)' % R['capN']); moment(R['leaving'], ('leaving', '10'))
    want = ['landing', 'first-node', 'node-lit', 'dawnroost', 'forty-beds', 'before-node', 'after-node', 'leaving']
elif z == 'z4':
    check(not R['failed'][0] and not R['failed'][1], 'the forty Wardens and Halcyon were made')
    moment(R['landing'], ('landing', '02'), 6)
    check(R['captain'] == ['z4.captain.02', 'z4.captain.03', 'z4.io.02', 'z4.captain.04'] and R['stage0'] == 0 and R['shipOn'], 'the Grey Hat\'s first talk: he waits below with every lamp lit, and lights a spare (4 lines); his ship lies on the landing ground')
    check(not R['spare0'] and R['spare1'], 'the spare lamp hangs dark until he has said he will light it, and burns after')
    check(R['keeper'] == ['z4.passkeeper.01'] and R['stage1'] == 1, 'the pass-keeper speaks, and the stage moves to 1')
    check(R['keeper2'] == ['z4.passkeeper.04'], 'asked again, she tells of the great bramble first')
    check(first(R['shore'], 'z4.narrator.12') and first(R['pass'], 'z4.narrator.13'), 'the narrator speaks at Frostmere\'s shore and at the frozen pass')
    check(not R['far'] and R['mid0'] and R['shut'] and R['stops'] >= 12, 'the great bramble lies over the road above the pass (%d canes): it cannot be walked through, and nothing is said 40 m short of it' % R['canes'])
    moment(R['bramble'], ('frozen-road', '03'), 5)
    check(R['open'] and not R['mid1'] and R['sides'] and R['stopsLeft'] < R['stops'] and any(g[0] == 'z4.narrator.14' for g in R['bramble']), 'it gives way (no fight yet: a stand-in): the canes over the road are gone, the rest still stand, the road can be walked, and the narrator says so')
    check(R['stage2'] == 2 and not R['bridge'], 'on the bridge into Misthollow the stage moves to 2, and nothing is said yet')
    check(R['mode0'] == 'held' and R['forty'] == 40 and R['wardenFar'] > 3000 and R['wardenSilent'], 'forty Wardens stand held in the street (%d triangles in %d pieces), and none of them can be talked to' % (R['stillTris'], R['stillPieces']))
    check(R['dawn'] > 0.95, 'the sky over Misthollow is the pale dawn')
    moment(R['town'], ('misthollow', '04'), 6)
    check(R['watch'] == ['z4.watch.01'] and R['sorrel'] == ['z4.sorrel.01'] and R['ede'] == ['z4.ede.01'] and not R['hearth0'], 'the watchwoman, Sorrel and Ede each speak; Ede\'s hearth is dark')
    check(R['wisps0'] > 0, 'cold lights are in the town (%d in sight)' % R['wisps0'])
    check(not R['street'] and R['light0'] and R['bowls0'] and not R['well0'] and R['body'], 'in the Moonwell\'s street: Halcyon stands in her light on the top step, the two bowls burn cold, the well is dark, and nothing is said yet')
    moment(R['stair'], ('stair', '05'), 7); check(R['stage2b'] == 2, 'and it is still stage 2')
    check(R['letter'] == ['z4.io.06', 'z4.halcyon.04', 'z4.io.07', 'z4.halcyon.05', 'z4.halcyon.06', 'z4.europa.05'] and R['stage3'] == 3, 'walking up to her, Io gives her the letter (6 lines), and the stage moves to 3')
    check(not R['light1'] and R['well1'], 'the light on the stair goes out, and the fire wakes in the dead well')
    check(R['before'][:1] == ['z4.narrator.06'] and len(R['before']) == 6 and R['between'][:1] == ['z4.narrator.07'] and len(R['between']) == 7, 'the coven speaks before the fire (5 lines) and between its two forms (6 lines), the narrator first each time (no fight yet: a stand-in)')
    check(R['won'] and not R['well2'], 'the fire ends: the well is dark again')
    moment(R['after'], ('after-fire', '08'), 7)
    check(R['stage4'] == 4 and not R['bowls4'], 'the stage moves to 4, and the two bowls are out')
    check(any(g == ['z4.kore.12', 'z4.callisto.09', 'z4.io.12', 'z4.kore.13', 'z4.europa.08'] for g in R['after']) and any(g == ['z4.halcyon.08', 'z4.io.13', 'z4.europa.09'] for g in R['after']), 'Kore\'s bow (5 lines) and the kept flame (3 lines) follow')
    moment(R['after'], ('moonset', '09'), 6)
    check(R['moths'] and R['flame'], 'the moths are rising (%d of them), and the kept flame is in Halcyon\'s hands' % R['mothN'])
    check(first(R['rest'], 'z4.narrator.15'), 'the narrator then turns the coven back down')
    check(R['dark'] > 0.99 and R['stars'] > 0.99, 'half a minute on, the moon has set: it is dark over Misthollow, and the stars are out')
    check(R['mode4'] == 'awake' and R['awakeN'] == 39 and R['wardenNow'] < 0, 'the forty are awake and coming down: thirty-nine on the street, the squares and the great stair, and the one who speaks at the bottom of the street')
    check(R['home'], 'once the coven has gone down, Halcyon is at the ship')
    check(R['warden'] == ['z4.warden.01'] and R['watch4'] == ['z4.watch.06'] and R['ede4'] == ['z4.ede.07'] and R['sorrel4'] == ['z4.sorrel.06'] and R['keeper4'] == ['z4.passkeeper.07'], 'the Warden, the watchwoman, Ede, Sorrel and the pass-keeper each say what the ending has done')
    check(R['gone'] and R['prints'] and R['printN'] > 400, 'once the coven is down past the frozen pass the forty have gone down ahead of it: %d footprints lie on the trail by the pass-keeper\'s hut, all going down' % R['printN'])
    check(R['hearth4'] and R['wisps4'] == 0, 'Ede\'s hearth burns, and the cold lights are gone')
    check(R['capN'] > 0 and R['leaving'] and first(R['leave'], 'z4.narrator.16'), 'the Grey Hat counts five down (on talk %d): that is the leaving for the Faire, and the narrator says it' % R['capN'])
    want = ['landing', 'frozen-road', 'misthollow', 'stair', 'letter', 'before-fire', 'between', 'after-fire', 'bow', 'flame', 'moonset']
else:
    moment(R['landing'], ('landing', '03'))
    check(R['captain'][:2] == ['z3.captain.03', 'z3.captain.04'], 'the Grey Hat\'s first talk points to the shipyard (%d lines)' % len(R['captain']))
    check(R['cap0'] != R['cap1'], 'once the coven has gone, the Grey Hat is at the shipyard (he stood at %s, now at %s)' % (R['cap0'], R['cap1']))
    moment(R['brambles'], ('brambles', '05')); moment(R['grove'], ('grove', '06')); check(R['cutter'][0] == 'z3.cutter.01', 'the bramble-cutter speaks at Eldergrove\'s edge')
    moment(R['fire'], ('campfire', '07'), 3)
    check(R['stage0'] == 0, 'on the causeway it is still stage 0'); moment(R['sight'], ('shipyard', '04'))
    check(R['stage1'] == 1 and first(R['yard'], 'z3.narrator.12'), 'stepping onto the shipyard\'s bridge moves the stage to 1, and the narrator speaks of the refit')
    check(R['ysmera'][0] == 'z3.ysmera.01' and R['cap'][0] == 'z3.captain.05' and R['stage2'] == 2, 'the shipmaster and the Grey Hat at the slip have both been heard: the stage moves to 2')
    check(first(R['north'], 'z3.narrator.13') and R['light2'], 'the narrator sends the coven back to the crossroads, and the knight\'s light stands on the east road there')
    moment(R['knight'], ('before-knight', '08'), 3); check(R['stage3'] == 3 and any(g[0] == 'z3.narrator.09' for g in R['knight']) and not R['light3'], 'she is met (no fight yet: a stand-in) and walks away: the stage moves to 3 and her light is gone')
    check(R['ysN'] > 0 and R['stage4'] == 4, 'Ysmera says the name (on talk %d after the knight), and the stage moves to 4' % R['ysN']); moment(R['name'], ('the-name', '10'))
    check(R['capN'] > 0, 'the Grey Hat says where they fly next (on talk %d)' % R['capN']); moment(R['leaving'], ('leaving', '11'))
    want = ['landing', 'brambles', 'grove', 'campfire', 'shipyard', 'before-knight', 'after-knight', 'the-name', 'leaving']
miss = [m for m in want if not st['moments'].get(m)]
check(not miss and st['final'] == 4, 'every moment was played (%d), and the zone ends at stage 4%s' % (len(want), '' if not miss else '; missing: ' + ', '.join(miss)))
print('3. page errors: %d' % len(errors)); check(not errors, 'no page errors')
for e in errors[:6]: print('  ! ' + e)
print('ALL PASSED' if not fails else '%d FAILED' % len(fails)); sys.exit(1 if fails else 0)
