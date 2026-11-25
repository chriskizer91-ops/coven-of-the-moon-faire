#!/usr/bin/env python3
"""leader-look.py: pictures of each of the four witches leading on a zone's land (the leader job, November 25, 2026).

    python3 tools/leader-look.py builds/zone-1.html <out folder> [--size 960x640]

For each witch, four pictures, and one sheet of them all (sheet-<zone>.jpg):
  land    walking on open land, seen from behind and to one side, mid-stride
  slope   running up the steepest ground near the zone's start she can stand on, seen from the side
  small   standing beside the smallest person drawn in the zone's busiest place, seen from the front
  tall    the same beside the tallest
It prints, for each, the numbers a person can check: her height, the people's heights, how steep the slope is.

The browser here has no screen: a picture shows a pose, not motion. Whether her feet slide, and the frame rate, only a
real laptop or phone can show.
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw

FOUR = ['io', 'kore', 'europa', 'callisto']
FLAGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl']

# move her along her own facing (yaw), whatever way the camera looks: the thumb's push, turned into the camera's terms
PUSH = """([yaw, mag]) => { const W = window.__w3d, Cy = W.C.yaw, dx = Math.sin(yaw), dz = Math.cos(yaw);
  const rx = Math.cos(Cy), rz = -Math.sin(Cy), fx = -Math.sin(Cy), fz = -Math.cos(Cy); W.push(dx * rx + dz * rz, -(dx * fx + dz * fz), mag); }"""
TALL = """() => { const A = window.__w3d.A; A.root.updateMatrixWorld(true); let lo = 1e9, hi = -1e9; const v = new THREE.Vector3();
  A.root.traverse((o) => { if (!o.isMesh || !o.visible) return; for (let q = o; q; q = q.parent) if (!q.visible) return; const b = new THREE.Box3().setFromObject(o); if (b.isEmpty()) return; lo = Math.min(lo, b.min.y); hi = Math.max(hi, b.max.y); });
  return +(hi - lo).toFixed(2); }"""


def main():
    a = sys.argv[1:]
    if len(a) < 2:
        sys.exit(__doc__)
    page, out = os.path.abspath(a[0]), os.path.abspath(a[1]); size = (960, 640)
    if '--size' in a: size = tuple(int(v) for v in a[a.index('--size') + 1].split('x'))
    os.makedirs(out, exist_ok=True)
    errs = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=FLAGS)
        pg = b.new_page(viewport={'width': size[0], 'height': size[1]})
        pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto('file://' + page + '?test', timeout=600000)
        pg.wait_for_function('(window.__ready && W3D.menu && W3D.menu.ready) || window.__err', timeout=900000)
        if pg.evaluate('window.__err || null'):
            sys.exit('the page did not start: ' + pg.evaluate('window.__err'))
        zone = pg.evaluate('W3D.saves.zone')
        pg.evaluate("(() => { if (window.__fights && window.__fights.meetings) window.__fights.meetings.hold(true); if (window.__people) window.__people.stop(); })()")
        start = pg.evaluate("(() => { const W = __w3d, M = W.P.M; return [M.x(W.io.px), M.z(W.io.py), W.io.yaw]; })()")
        # the steepest ground near the start she can stand on (a grade under 0.6), and which way is up
        slope = pg.evaluate("""([x0, z0]) => { const W = __w3d, M = W.P.M, h = (x, z) => W.P.walkH(M.px(x), M.py(z)); let best = null;
          for (let r = 20; r <= 400; r += 20) for (let a = 0; a < 6.28; a += 0.3) { const x = x0 + Math.cos(a) * r, z = z0 + Math.sin(a) * r;
            if (!W.fits(M.px(x), M.py(z)) || !W.fits(M.px(x + 3), M.py(z)) || !W.fits(M.px(x - 3), M.py(z)) || !W.fits(M.px(x), M.py(z + 3)) || !W.fits(M.px(x), M.py(z - 3))) continue;
            const gx = (h(x + 2, z) - h(x - 2, z)) / 4, gz = (h(x, z + 2) - h(x, z - 2)) / 4, g = Math.hypot(gx, gz);
            if (g < 0.6 && (!best || g > best.g)) best = { x, z, g, up: Math.atan2(gx, gz) }; }
          return best; }""", start)
        # the busiest place: where most people stand within 30 m; there, the people drawn, and how tall each is
        crowd = pg.evaluate("""() => { const L = (window.__people && __people.list) || []; let best = null, bn = -1;
          for (const p of L) { const n = L.filter((q) => Math.hypot(q.x - p.x, q.z - p.z) < 30).length; if (n > bn) { bn = n; best = p; } }
          return best ? [best.x, best.z, bn] : null; }""")
        people = []
        if crowd:
            pg.evaluate("([x, z]) => { const W = __w3d, M = W.P.M, a = W.nearestFit(M.px(x + 3), M.py(z + 3)); W.setIo(a[0], a[1], 0); }", crowd)
            for _ in range(30):      # they are made one at a time as the coven comes near
                pg.evaluate('(() => { __w3d.step(0.5, 30, false); })()'); pg.wait_for_timeout(700)
                n = pg.evaluate("(__people.list || []).filter((p) => p.npc).length")
                if n >= min(crowd[2], 8): break
            people = pg.evaluate("""() => (__people.list || []).filter((p) => p.npc && p.npc.root).map((p) => { const r = p.npc.root; r.updateMatrixWorld(true); const b = new THREE.Box3().setFromObject(r);
              return { id: p.id, name: p.name, x: p.x, z: p.z, h: +(b.max.y - b.min.y).toFixed(2) }; }).filter((p) => p.h > 0.5 && p.h < 3.5)""")
        people.sort(key=lambda q: q['h'])
        small, tall = (people[0], people[-1]) if people else (None, None)
        print('%s: start %s; slope %s; people drawn %d: %s' % (zone, [round(v) for v in start[:2]], slope and 'grade %.2f' % slope['g'], len(people), ', '.join('%s %.2f m' % (q['name'], q['h']) for q in people)))
        notes = {'zone': zone, 'slope': slope and round(slope['g'], 2), 'people': people, 'witches': {}}
        for w in FOUR:
            pg.evaluate("(w) => __w3d.setWho(w)", w)
            hw = pg.evaluate(TALL)
            notes['witches'][w] = hw
            # 1. walking on open land: from behind and to one side, mid-stride
            pg.evaluate("([x, z, yaw]) => { const W = __w3d, M = W.P.M, a = W.nearestFit(M.px(x), M.py(z)); W.setIo(a[0], a[1], yaw); W.setCam(null); W.C.yaw = yaw + Math.PI - 0.7; W.C.hold = false; W.C.auto = 99; }", start)
            pg.evaluate(PUSH, [start[2], 0.6]); pg.evaluate('(() => { __w3d.step(1.3, 30, false); __w3d.step(0.1, 30, true); })()')
            pg.screenshot(path=os.path.join(out, '%s-%s-land.png' % (zone, w))); pg.evaluate('__w3d.push(null)')
            # 2. running up the slope, seen from the side
            if slope:
                pg.evaluate("([x, z, up]) => { const W = __w3d, M = W.P.M, a = W.nearestFit(M.px(x - Math.sin(up) * 3), M.py(z - Math.cos(up) * 3)); W.setIo(a[0], a[1], up); W.setCam(up + Math.PI / 2, 0.18, 5.0); W.C.hold = true; }", [slope['x'], slope['z'], slope['up']])
                pg.evaluate(PUSH, [slope['up'], 1.0]); pg.evaluate('(() => { __w3d.step(1.1, 30, false); __w3d.step(0.1, 30, true); })()')
                pg.screenshot(path=os.path.join(out, '%s-%s-slope.png' % (zone, w))); pg.evaluate('__w3d.push(null)')
            # 3 and 4. standing beside the smallest and the tallest, seen from the front
            for tag, q in (('small', small), ('tall', tall)):
                if not q: continue
                pg.evaluate("""([x, z]) => { const W = __w3d, M = W.P.M, a = W.nearestFit(M.px(x - 1.0), M.py(z)); W.setIo(a[0], a[1], 0); W.setCam(0.25, 0.12, 4.2); W.C.hold = true; W.step(0.6, 30, false); W.step(0.05, 30, true); }""", [q['x'], q['z']])
                pg.screenshot(path=os.path.join(out, '%s-%s-%s.png' % (zone, w, tag)))
            print('  %-9s %.2f m tall (her model as drawn)' % (w, hw))
        # one sheet: a row for each witch, a column for each picture
        cols = ['land', 'slope', 'small', 'tall']
        tw, th = size[0] // 2, size[1] // 2
        sheet = Image.new('RGB', (tw * len(cols), th * len(FOUR)), (10, 11, 24)); dr = ImageDraw.Draw(sheet)
        for r, w in enumerate(FOUR):
            for c, k in enumerate(cols):
                f = os.path.join(out, '%s-%s-%s.png' % (zone, w, k))
                if os.path.exists(f): sheet.paste(Image.open(f).convert('RGB').resize((tw, th)), (c * tw, r * th))
                label = w.capitalize() + ', ' + {'land': 'walking', 'slope': 'running uphill', 'small': 'beside %s' % (small['name'] if small else ''), 'tall': 'beside %s' % (tall['name'] if tall else '')}[k]
                dr.rectangle([c * tw + 4, r * th + 4, c * tw + 8 + 7 * len(label), r * th + 20], fill=(10, 11, 24)); dr.text((c * tw + 7, r * th + 6), label, fill=(255, 230, 168))
        sheet.save(os.path.join(out, 'sheet-%s.jpg' % zone), quality=86)
        json.dump(notes, open(os.path.join(out, 'numbers-%s.json' % zone), 'w'), indent=1)
        print('page errors:', len(errs), errs[:3])
        b.close()


if __name__ == '__main__':
    main()
