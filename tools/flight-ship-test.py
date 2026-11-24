#!/usr/bin/env python3
"""flight-ship-test.py: the Grey Hat's real ship moored at the jetty, checked with no screen.

    python3 tools/flight-ship-test.py builds/moored-ship.html        (the small page: the jetty alone)
    python3 tools/flight-ship-test.py builds/zone-1.html             (once the hub has switched zone 1 to the real ship)

It checks what the lamps need (twelve hook spots, six a side, over the water, clear of the pier and of her sails), that
she is the baked Skiff and drawn by the place's own night (the same moon, fog and lamps as the pier's planks), that she
cannot be walked onto, and that the page has no errors. It cannot see her: look with tools/look.py.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

if len(sys.argv) < 2:
    sys.exit(__doc__)
page_file = os.path.abspath(sys.argv[1]); errors, fails = [], []


def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok: fails.append(what)


JS = """() => { const w = window.__w3d, Z = w.P, J = window.W3D_PLACES.jetty, S = J.ship, D = (window.COVEN_SHIPS || {})[S.ship], out = { ship: S.ship, standIn: S.standIn, length: S.length, beam: S.beam };
  const part = Z.parts ? Z.parts.find((p) => p.id === 'jetty') : null, ox = part ? part.ox : 0, oy = part ? part.oy || 0 : 0, oz = part ? part.oz : 0, P = part ? part.P : Z;
  out.hooks = S.hooks.length; out.pierSide = S.hooks.filter((h) => h[2] < S.at[2]).length; out.lowest = Math.min(...S.hooks.map((h) => h[1])) - S.at[1];
  out.clearOfPier = S.at[2] - S.beam / 2 - 14.4; out.nearestPierHook = Math.min(...S.hooks.map((h) => h[2])) - 14.4; out.inPlace = S.hooks.every((h) => Math.abs(h[0]) < 49 && Math.abs(h[2]) < 46);
  out.apart = Math.min(...S.hooks.map((a, i) => Math.min(...S.hooks.filter((b, j) => j !== i).map((b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2])))));
  out.order = S.hooks.map((h) => +Math.hypot(h[0] - S.gangway[0]).toFixed(2)); out.pierFirst = S.hooks.every((h, i) => (i % 2 === 0) === (h[2] < S.at[2]));
  // her meshes, and the night they are lit by
  const meshes = []; P.scene.traverse((o) => { if (o.isMesh && /^ship_/.test(o.name)) meshes.push(o); });
  const plank = []; P.scene.traverse((o) => { if (o.isMesh && (o.name === 'deck' || o.name === 'wood')) plank.push(o); });
  out.meshes = meshes.map((m) => m.name.slice(5)).sort(); out.triangles = meshes.reduce((n, m) => n + m.geometry.attributes.position.count / 3, 0); out.baked = D ? D.triangles : -1; out.bakedParts = D ? Object.keys(D.parts).sort() : [];
  out.sameNight = meshes.length > 0 && plank.length > 0 && meshes.every((m) => ['uFog', 'uMoon', 'uMoonDir', 'uSky', 'uGlow', 'uShade', 'uFogFar'].every((k) => m.material.uniforms[k] === plank[0].material.uniforms[k]));
  out.pictures = meshes.filter((m) => m.material.uniforms.map.value).map((m) => { const im = m.material.uniforms.map.value.image; return [m.name.slice(5), im ? (im.naturalWidth || im.width) : 0]; });
  // her sails, and how near a lamp hangs to them
  const sail = meshes.find((m) => m.name === 'ship_canvas'); let near = 1e9;
  if (sail) { const a = sail.geometry.attributes.position; for (const h of S.hooks) for (let i = 0; i < a.count; i++) near = Math.min(near, Math.hypot(a.getX(i) - h[0], a.getY(i) - h[1], a.getZ(i) - h[2])); }
  out.sailClear = near; out.sailTip = 0; if (sail) { const a = sail.geometry.attributes.position; let zm = 1e9; for (let i = 0; i < a.count; i++) if (a.getZ(i) < zm) { zm = a.getZ(i); out.sailTip = a.getY(i); } }
  // where she sits
  const box = new THREE.Box3(); for (const m of meshes) { m.geometry.computeBoundingBox(); box.union(m.geometry.boundingBox); }
  out.box = { x: [box.min.x, box.max.x], y: [box.min.y, box.max.y], z: [box.min.z, box.max.z] }; out.deck = S.deck; out.lake = S.at[1];
  out.walkOn = Z.walkable(Z.M.px(ox + S.at[0]), Z.M.py(oz + S.at[2])); out.walkPier = Z.walkable(Z.M.px(ox + 0), Z.M.py(oz + 13.5));
  out.all = w.step ? w.step(0.1, 30) : null;
  return out; }"""

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    if pg.evaluate('window.__err || null'):
        print('THE PAGE DID NOT START:', pg.evaluate('window.__err')); sys.exit(1)
    pg.wait_for_timeout(1500)   # (her painted pieces are pictures: give them a moment to be read)
    r = pg.evaluate(JS); b.close()
if '--json' in sys.argv: print(json.dumps(r, indent=1))
print('1. what the lamps need')
check(r['standIn'] is False and r['ship'] == 'skiff', 'she is the real ship, not the stand-in: the %s, %.0f m long, %.2f m in the beam' % (r['ship'], r['length'], r['beam']))
check(r['hooks'] == 12 and r['pierSide'] == 6, 'twelve lamp hooks, six a side')
check(r['lowest'] > 1.5 and r['inPlace'], 'every hook is over the water, inside the jetty\'s own ground (the lowest lamp hangs %.2f m above the lake)' % r['lowest'])
check(r['clearOfPier'] > 1.0 and r['nearestPierHook'] > 0.6, 'she lies clear of the pier\'s end by %.1f m, and the nearest lamp hangs %.1f m off it' % (r['clearOfPier'], r['nearestPierHook']))
check(r['apart'] > 0.6, 'no two lamps hang nearer each other than %.2f m' % r['apart'])
check(r['sailClear'] > 0.4, 'no lamp hangs nearer her sails than %.2f m' % r['sailClear'])
check(all(r['order'][i] <= r['order'][i + 2] + 1e-6 for i in range(0, 10)) and r['pierFirst'], 'the hooks are in the order the lamps come home: from the gangway outward (%s m along her from it), the pier\'s side first' % ', '.join('%.1f' % r['order'][i] for i in range(0, 12, 2)))
print('2. the ship herself')
check(r['meshes'] == r['bakedParts'] and len(r['meshes']) >= 10, 'she is drawn in %d materials, as she was baked: %s' % (len(r['meshes']), ', '.join(r['meshes'])))
check(r['triangles'] == r['baked'], '%d triangles, the baked ship\'s own count' % r['triangles'])
check(r['sameNight'], 'every one of her surfaces is lit by the jetty\'s own night (the same moon, sky, fog and lamp light as the pier\'s planks)')
check(len(r['pictures']) >= 6 and all(w > 8 for _, w in r['pictures']), 'her painted pieces are in the page and read: %s' % ', '.join('%s %d px' % (k, w) for k, w in r['pictures']))
check(abs(r['box']['y'][0] - (r['deck'] - 1.706)) < 0.05 and r['box']['z'][0] > 14.4, 'she rides with her deck %.2f m above the lake; nothing of her reaches over the pier (her wing sail\'s tip stops %.0f cm short of its end, %.1f m above its planks)' % (r['deck'] - r['lake'], (r['box']['z'][0] - 14.4) * 100, r['sailTip'] + 1.0))
check(not r['walkOn'] and r['walkPier'], 'she cannot be walked onto, and the pier\'s end can still be walked')
print('3. errors')
check(not errors, '%d page errors%s' % (len(errors), '' if not errors else ': ' + ' | '.join(e[:160] for e in errors[:4])))
print('\n%s: %d checks failed' % ('ALL GOOD' if not fails else 'NOT GOOD', len(fails)))
sys.exit(1 if fails else 0)
