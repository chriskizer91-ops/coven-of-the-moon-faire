#!/usr/bin/env python3
"""faire-test.py: the ending at the Faire's camp, checked with no screen (the zone-4 job's check).
    python3 tools/faire-test.py builds/faire-ending.html
It opens the page as a check (nothing is saved, no Begin button), and plays the ending as a player would: the
homecoming is said first; then the coven walks up to each of the fifteen, and each says their own goodbye by
themselves; when the fifteenth has been heard the last talk plays, and the game ends on Io's "Yes."
It cannot hear a line or see a face move: only Chris can."""
import sys, os, json
from playwright.sync_api import sync_playwright
page_file = os.path.abspath(sys.argv[1]); errors, fails = [], []
def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok: fails.append(what)
JS = """async () => { const P = window.__people, S = window.__story, F = window.__faire, w = window.__w3d, M = w.P.M, E = window.W3D.faireEnding, out = { who: E.who, people: [], log: [] };
  await P.ready(); await F.halcyon.ready; out.halcyon = { there: !!F.halcyon.npc, failed: F.halcyon.failed, d: Math.hypot(F.halcyon.x - P.me().x, F.halcyon.z - P.me().z), ok: w.P.walkable(M.px(F.halcyon.x), M.py(F.halcyon.z)) };
  const read = () => { const ids = []; let guard = 0; while (P.say() && guard++ < 14) { ids.push(P.say().id); P.talk(); } return ids; };
  const camp = window.W3D.PEOPLE['zone-1'].camp;
  for (const id of E.who) { const p = P.list.find((q) => q.id === id); out.people.push({ id, name: p ? p.name : null, there: !!(p && p.npc), d: p ? Math.hypot(p.x - camp[0], p.z - camp[1]) : 999, ok: !!p && w.P.walkable(M.px(p.x + 0.9), M.py(p.z + 0.6)),
    nearest: p ? Math.min(...P.list.filter((q) => q !== p).map((q) => Math.hypot(q.x - p.x, q.z - p.z))) : 0 }); }
  // the homecoming, said when the scene opens
  S.begin(); S.watch(); out.home = read(); S.watch(); S.watch(); out.told = read(); out.early = S.state().moments['faire.farewell'] || false;
  // walk right up to each: they speak by themselves, once
  P.autoInTest = true;
  for (const id of E.who) { const p = P.list.find((q) => q.id === id); let said = [];
    for (const [dx, dz] of [[4.5, 3], [-4.5, 3], [4.5, -3], [-4.5, -3]]) { const fx = w.nearestFit(M.px(p.x + dx), M.py(p.z + dz)); w.setIo(fx[0], fx[1], 0); w.step(0.1, 30, false); P.tick();        // from a little way off
      for (const [ex, ez] of [[0.9, 0.6], [-0.9, 0.6], [0.9, -0.6], [-0.9, -0.6]]) { if (!w.P.walkable(M.px(p.x + ex), M.py(p.z + ez))) continue; w.setIo(M.px(p.x + ex), M.py(p.z + ez), 0); w.step(0.1, 30, false); P.tick(); break; }
      if (P.say()) { said = read(); break; } }
    const before = E.who.filter((q) => S.ctx.heard('faire.' + q)).length; out.log.push([id, said, before]);
    // a second press of Talk says the same goodbye again, never a stand-in
    P.talk(id); const again = P.say() ? P.say().id : null; read(); out.log[out.log.length - 1].push(again);
    if (before < E.who.length) { S.watch(); if (P.say()) { out.tooSoon = P.say().id; read(); } } }
  out.left = F.left(); S.watch(); out.last = read(); out.ended = F.ended; out.card = F.card.style.display; out.words = [F.card.querySelector('.faire-end-1').textContent, F.card.querySelector('.faire-end-2').textContent];
  S.watch(); out.after = P.say() ? P.say().id : null; out.lamps = S.state().lamps; out.saved = (() => { try { return localStorage.getItem('coven.story.faire.v1'); } catch (e) { return 'blocked'; } })();
  return out; }"""
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    if pg.evaluate('window.__err || window.__peopleErr || null'): print('THE PAGE DID NOT START:', pg.evaluate('window.__err || window.__peopleErr')); sys.exit(1)
    r = pg.evaluate(JS); b.close()
print('1. who is at the camp for the last night')
check(r['halcyon']['there'] and not r['halcyon']['failed'] and r['halcyon']['d'] < 6, 'Halcyon stands by the well, %.1f m from where the coven starts' % r['halcyon']['d'])
for o in r['people']:
    check(o['there'] and o['d'] < 34, '%s is at the camp (%.0f m from its well)' % (o['name'], o['d']))
    check(o['ok'] and o['nearest'] > 1.5, '   and can be walked up to (the nearest other person is %.1f m off)' % o['nearest'])
print('2. the ending, played through')
check(len(r['home']) >= 5 and r['home'][-5] == 'z4.europa.11' and r['home'][-1] == 'z4.callisto.12', 'it opens on the homecoming (%d lines: %s ... %s)' % (len(r['home']), r['home'][0] if r['home'] else '-', r['home'][-1] if r['home'] else '-'))
if r['told']: print('        then the narrator: %s' % ' '.join(r['told']))
check(not r['early'], 'the last talk does not play before the goodbyes')
n = 0
for id, said, heard, again in r['log']:
    ok = bool(said) and all(('.%s.' % id) in s or s.split('.')[1] in ('io', 'kore', 'europa', 'callisto', 'halcyon') for s in said) and any(('.%s.' % id) in s for s in said)
    n += 1 if ok else 0
    check(ok, 'walking up to %s: %d lines by themselves (%s)' % (id, len(said), ' '.join(said)))
    check(again is not None and again in said, '   asked again, the same goodbye (%s)' % again)
check(not r.get('tooSoon'), 'nothing else was said in between' + ('' if not r.get('tooSoon') else ': ' + r['tooSoon']))
check(n == 15 and not r['left'], 'all fifteen goodbyes were heard')
check(r['last'][-6:] == ['z4.halcyon.11', 'z4.io.16', 'z4.halcyon.12', 'z4.io.17', 'z4.kore.16', 'z4.io.18'], 'then the last talk plays, and ends on Io\'s "Yes." (%s)' % ' '.join(r['last']))
check(r['ended'] and r['card'] == 'grid' and all(r['words']), 'and the game ends: the picture goes dark and the words come up ("%s", "%s": stand-ins)' % tuple(r['words']))
check(r['after'] is None, 'nothing is said after the end')
check(r['lamps'] == 0, 'the ship\'s lamps are out')
check(r['saved'] in (None, 'blocked'), 'as a check, nothing was saved')
print('3. page errors: %d' % len(errors)); check(not errors, 'no page errors')
for e in errors[:6]: print('  ! ' + e)
print('ALL PASSED' if not fails else '%d FAILED' % len(fails)); sys.exit(1 if fails else 0)
