#!/usr/bin/env python3
"""left-overs-flames.py: close pictures of the land's flames (the left-overs job, November 25, 2026). Nothing here is the game.

    python3 tools/left-overs-flames.py builds/zone-1.html --list                       # every lamp and fire, place by place
    python3 tools/left-overs-flames.py builds/zone-1.html <out> <name>=<place>:<n>[:<stage>[:<dist>]] ... (thing:<id>:0 for a story thing's lamp) [--tag after] [--dist 1.2]

A shot: the n-th lamp or fire of that place (as --list numbers them), the story set to <stage> (if given). The camera
stands <dist> m off to the south-east of the flame, a little above it, looking north-west: so north-east, the way the
lines say flames lean, is straight to the right in the picture, and north is to the right and away from the eye.
It prints how far the flame's light leans now (window.W3D.LEAN_U, if the page has it). A still cannot show the flicker.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:]]
page_file = os.path.abspath(args[0])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
tag, dist = opt('--tag', 'shot'), float(opt('--dist', '1.2'))
LIST = '--list' in args
rest = [a for i, a in enumerate(args[1:], 1) if not a.startswith('--') and not (args[i - 1] in ('--tag', '--dist'))]
out = os.path.abspath(rest[0]) if rest and not LIST else None
shots = [s.split('=', 1) for s in rest[1:]] if out else []

LAMPS = """() => { const L = window.__land, Z = L ? window.__w3d.P : null, parts = (Z && Z.parts) || [{ id: 'place', ox: 0, oy: 0, oz: 0, P: window.__w3d.P }];
  return parts.map((p) => ({ id: p.id || (p.P.place && p.P.place.id), lamps: (p.P.lamps || []).map((l) => [+(l.x + (p.ox || 0)).toFixed(2), +(l.y + (p.oy || 0)).toFixed(2), +(l.z + (p.oz || 0)).toFixed(2), l.c.toString(16)]) })); }"""
SHOT = """([part, n, stage, dist]) => { const w = window.__w3d, M = w.P.M, Z = w.P;
  const parts = Z.parts || [{ id: 'place', ox: 0, oy: 0, oz: 0, P: Z }];
  let x, y, z, l = { c: 0 };
  if (part.startsWith('thing:')) { const t = window.__things && window.__things.get(part.slice(6)); if (!t || !t.lamp) return { err: 'no thing ' + part }; [x, y, z] = t.lamp; y -= 0.03; }      // a story thing's lamp (Old Bridie's)
  else { const p = parts.find((q) => (q.id || (q.P.place && q.P.place.id)) === part); if (!p) return { err: 'no place ' + part };
    l = p.P.lamps[n]; if (!l) return { err: 'no lamp ' + n }; x = l.x + (p.ox || 0); y = l.y + (p.oy || 0); z = l.z + (p.oz || 0); }
  if (stage != null && window.__story) window.__story.set({ stage });
  if (window.W3D.flameLean) window.W3D.flameLean.refresh(true);
  // Io well away, to the north-west, so she is not in the picture
  w.setIo(M.px(x - 6), M.py(z - 6), 0); w.step(1.0, 30, false);
  if (window.W3D.flameLean) window.W3D.flameLean.refresh(true);
  const k = Math.SQRT1_2; w.cam.position.set(x + dist * k, y + 0.12, z + dist * k); w.cam.lookAt(x, y - 0.02, z); w.cam.updateMatrixWorld(true); w.render();
  const U = window.W3D.LEAN_U; return { x, y, z, c: l.c.toString(16), lean: U ? [U.uLean.value.x, U.uLean.value.y, U.uLean.value.z].map((v) => +v.toFixed(3)) : null, stage: window.__story ? window.__story.state().stage : null }; }"""

errors = []
with sync_playwright() as pw:
    b = pw.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    if LIST:
        for p in pg.evaluate(LAMPS):
            print(p['id'], len(p['lamps']))
            for i, l in enumerate(p['lamps']): print('   %3d  %s' % (i, l))
    else:
        os.makedirs(out, exist_ok=True)
        for name, spec in shots:
            q = spec.split(':')
            if q[0] == 'thing': q = ['thing:' + q[1]] + q[2:]
            part, n = q[0], int(q[1]); stage = int(q[2]) if len(q) > 2 and q[2] != '' else None; d = float(q[3]) if len(q) > 3 else dist
            r = pg.evaluate(SHOT, [part, n, stage, d]); pg.screenshot(path=os.path.join(out, '%s-%s.png' % (name, tag)))
            print(name, json.dumps(r))
    b.close()
print('page errors: %d' % len(errors))
for e in errors[:5]: print('  ! ' + e[:300])
