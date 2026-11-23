#!/usr/bin/env python3
"""people-test.py: the people who stand in the land, and talking to them, checked with no screen.
    python3 tools/people-test.py builds/zone-1.html
It builds every person, then checks: each stands on the ground, in the open, not on top of another; walking up to each
brings the Talk button with their name; a talk shows their words and ends by itself; and the page made no errors."""
import sys, os, json
from playwright.sync_api import sync_playwright
page_file = os.path.abspath(sys.argv[1]); errors, fails = [], []
def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok: fails.append(what)
JS = """async () => { const P = window.__people, L = window.__land, w = window.__w3d, M = w.P.M, t0 = performance.now(); const n = await P.ready(), ms = (performance.now() - t0) / Math.max(1, n), out = { n, ms, people: [] };
  for (const p of P.list) { const o = { id: p.id, name: p.name, failed: p.failed || null };
    o.off = p.npc ? Math.abs(p.npc.root.position.y - w.P.walkH(M.px(p.x), M.py(p.z))) : 9; o.tris = p.npc ? p.npc.triangles : 0;
    o.open = [0, 1, 2, 3, 4, 5, 6, 7].filter((k) => w.P.walkable(M.px(p.x + Math.cos(k * 0.785) * 1.4), M.py(p.z + Math.sin(k * 0.785) * 1.4))).length;
    o.nearest = Math.min(...P.list.filter((q) => q !== p).map((q) => Math.hypot(q.x - p.x, q.z - p.z)));
    // walk up: stand at the most open spot 1.6 m off, and look for the button
    let best = null; for (let k = 0; k < 8; k++) { const x = p.x + Math.cos(k * 0.785) * 1.6, z = p.z + Math.sin(k * 0.785) * 1.6; if (w.P.walkable(M.px(x), M.py(z))) { best = [x, z]; break; } }
    if (best) { w.setIo(M.px(best[0]), M.py(best[1]), 0); w.step(0.2, 30, false); P.tick(); o.btn = document.querySelector('.talkbtn').textContent; o.shown = document.querySelector('.talkbtn').style.display !== 'none';
      P.talk(p.id); const s = P.say(); o.said = s ? s.text : null; o.boxed = document.querySelector('.talkbox').style.display !== 'none'; o.talking = !!(p.npc && p.npc.talking);
      for (let i = 0; i < 40 * 30 && P.say(); i++) w.step(1 / 30, 30, false); o.ended = !P.say() && document.querySelector('.talkbox').style.display === 'none' && !(p.npc && p.npc.talking); }
    out.people.push(o); }
  // ---- the story: which line comes next ----
  const S = window.__story, V = window.COVEN_VOICE || {}, st = out.story = { lines: S.lines.length, voiced: S.lines.filter((l) => V[l.id]).length, bad: [] };
  const finish = () => { for (let i = 0; i < 60 * 30 && P.say(); i++) w.step(1 / 30, 30, false); };
  const go = (id) => { const p = P.list.find((q) => q.id === id); w.setIo(M.px(p.x + 1.2), M.py(p.z + 0.9), 0); w.step(0.1, 30, false); P.tick(); P.talk(id); const ids = []; let guard = 0; while (P.say() && guard++ < 12) { ids.push(P.say().id + '|' + P.say().name); P.talk(id); } finish(); return ids; };
  // every person has something to say at every stage, and its sound is there
  for (let stage = 0; stage <= 4; stage++) { S.reset(); S.set({ stage }); for (const p of P.list) { const ls = S.linesFor(p); if (!ls || !ls.length) st.bad.push(p.id + ' has nothing to say at stage ' + stage); else for (const l of ls) if (!V[l.id]) st.bad.push('no sound for ' + l.id); } }
  // the story said through, as a player would
  S.reset(); S.setLamps(0); st.captain1 = go('captain'); st.stage1 = S.state().stage; st.nettie1 = go('nettie'); st.stage2 = S.state().stage;
  st.wenna1 = go('wenna'); st.wenna2 = go('wenna'); st.stage3 = S.state().stage;
  S.set({ stage: 4 }); S.setLamps(12); st.sew = go('captain');
  // a person does not repeat a line until all of theirs are said
  S.reset(); S.setLamps(0); const seen = []; for (let i = 0; i < 8; i++) seen.push(go('odile')[0]); st.odile = seen; st.odileDistinct = new Set(seen).size; st.odileFirst = new Set(seen.slice(0, st.odileDistinct)).size;
  // the coven's set moments, once each
  S.reset(); st.moments = {}; for (const m of ['opening', 'cottage', 'thornwood', 'fen', 'before-wraith', 'after-wraith', 'leaving']) { const ok = S.moment(m); const ids = []; let guard = 0; while (P.say() && guard++ < 12) { ids.push(P.say().name); P.talk(); } finish(); st.moments[m] = { ok, n: ids.length, who: ids.join(', '), again: S.moment(m) }; }
  st.call = (S.callFor(P.list[0]) || {}).text || null;
  S.reset(); S.set({ moments: { opening: true } }); P.stop(); S.narrate('lamp-first'); S.watch(); st.told = P.say(); finish();
  // walking right up: nobody speaks from 3 m; at arm's length the first talk begins by itself; a later visit gets a short word
  S.reset(); P.stop(); P.autoInTest = true; const k = P.list.find((q) => q.id === 'kofi'); const at = (d) => { w.setIo(M.px(k.x - d), M.py(k.z), 0); w.step(0.1, 30, false); P.tick(); };
  at(12); at(3); st.far = P.say(); at(1.3); st.close = P.say() ? P.say().id : null; finish(); at(12); at(1.3); st.again = P.say() ? P.say().id : null; finish(); P.autoInTest = false;
  st.kinds = [st.close, st.again].map((id) => (S.lines.find((l) => l.id === id) || {}).kind);
  return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    r = pg.evaluate(JS); b.close()
print('1. the people (%d made, about %.0f thousandths of a second each here)' % (r['n'], r['ms']))
for o in r['people']:
    check(not o['failed'] and o['tris'] > 0, '%s is there (%d triangles)' % (o['name'], o['tris']))
    check(o['off'] < 0.05, '   stands on the ground (%.0f cm off)' % (o['off'] * 100))
    check(o['open'] >= 3 and o['nearest'] > 1.2, '   in the open (%d of 8 spots round them can be stood on; the nearest other person is %.1f m off)' % (o['open'], o['nearest']))
    check(o.get('shown') and o.get('btn') == 'Talk to ' + o['name'].replace('The ', 'the '), '   walking up shows the button "%s"' % o.get('btn'))
    check(o.get('said') and o.get('boxed') and o.get('talking'), '   a talk shows their words: "%s"' % o.get('said'))
    check(o.get('ended'), '   and ends by itself')
st = r['story']
print('2. the story: which line comes next')
check(st['lines'] == st['voiced'] and st['lines'] > 0, '%d lines, %d with their recording in the page' % (st['lines'], st['voiced']))
check(not st['bad'], 'every person has something to say at every stage, with its sound' + ('' if not st['bad'] else ': ' + '; '.join(st['bad'][:5])))
check(len(st['captain1']) == 4 and st['stage1'] == 1, 'the Grey Hat\'s first talk is his asking, four lines (%s), and the stage moves to 1 (asked)' % ', '.join(x.split('|')[0] for x in st['captain1']))
check(st['stage2'] == 2, 'Nettie\'s first talk (%d lines) moves the stage to 2 (home)' % len(st['nettie1']))
check(st['stage3'] == 3, 'Old Wenna\'s second talk tells of the great wraith (%d lines) and moves the stage to 3 (fen)' % len(st['wenna2']))
check(len(st['sew']) == 3 and st['sew'][0].endswith('|Europa'), 'at stage 4 with twelve lamps home, the talk at the jetty is Europa sewing the flames: %s' % ', '.join(x.split('|')[1] for x in st['sew']))
check(st['odileFirst'] == st['odileDistinct'] and st['odileDistinct'] >= 3, 'at dusk Odile has %d different talks, and says each once before any comes round again (%d talks tried)' % (st['odileDistinct'], len(st['odile'])))
for m, v in st['moments'].items(): check(v['ok'] and v['n'] >= 6 and v['who'].startswith(', ') and not v['again'], 'the moment "%s": the narrator first, then %d lines (%s), once only' % (m, v['n'] - 1, v['who'][2:]))
check(st['told'] and st['told']['who'] == 'narrator' and st['told']['id'] == 'z1.narrator.11', 'when the first lamp comes home the narrator says so: "%s"' % (st['told'] or {}).get('text'))
check(bool(st['call']), 'Odile has a call for when the coven walks past: "%s"' % st['call'])
check(st['far'] is None, 'at 3 m nobody speaks by themselves')
check(st['kinds'][0] == 'hello', 'walking right up to Kofi (1.3 m) the first time, his first talk begins by itself (%s)' % st['close'])
check(st['kinds'][1] == 'call', 'walking right up again later, he says a short word (%s)' % st['again'])
print('3. page errors: %d' % len(errors)); check(not errors, 'no page errors')
for e in errors[:6]: print('  ! ' + e)
print('ALL PASSED' if not fails else '%d FAILED' % len(fails)); sys.exit(1 if fails else 0)
