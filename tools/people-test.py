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
    o.open = [0, 1, 2, 3, 4, 5, 6, 7].filter((k) => L.walkable(p.x + Math.cos(k * 0.785) * 1.4, p.z + Math.sin(k * 0.785) * 1.4)).length;
    o.nearest = Math.min(...P.list.filter((q) => q !== p).map((q) => Math.hypot(q.x - p.x, q.z - p.z)));
    // walk up: stand at the most open spot 1.6 m off, and look for the button
    let best = null; for (let k = 0; k < 8; k++) { const x = p.x + Math.cos(k * 0.785) * 1.6, z = p.z + Math.sin(k * 0.785) * 1.6; if (L.walkable(x, z)) { best = [x, z]; break; } }
    if (best) { w.setIo(M.px(best[0]), M.py(best[1]), 0); w.step(0.2, 30, false); P.tick(); o.btn = document.querySelector('.talkbtn').textContent; o.shown = document.querySelector('.talkbtn').style.display !== 'none';
      P.talk(p.id); const s = P.say(); o.said = s ? s.text : null; o.boxed = document.querySelector('.talkbox').style.display !== 'none'; o.talking = !!(p.npc && p.npc.talking);
      for (let i = 0; i < 12 * 30 && P.say(); i++) w.step(1 / 30, 30, false); o.ended = !P.say() && document.querySelector('.talkbox').style.display === 'none' && !(p.npc && p.npc.talking); }
    out.people.push(o); }
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
    check(o['open'] >= 5 and o['nearest'] > 1.2, '   in the open (%d of 8 spots round them can be stood on; the nearest other person is %.1f m off)' % (o['open'], o['nearest']))
    check(o.get('shown') and o.get('btn') == 'Talk to ' + o['name'], '   walking up shows the button "%s"' % o.get('btn'))
    check(o.get('said') and o.get('boxed') and o.get('talking'), '   a talk shows their words: "%s"' % o.get('said'))
    check(o.get('ended'), '   and ends by itself')
print('2. page errors: %d' % len(errors)); check(not errors, 'no page errors')
for e in errors[:6]: print('  ! ' + e)
print('ALL PASSED' if not fails else '%d FAILED' % len(fails)); sys.exit(1 if fails else 0)
