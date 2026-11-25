#!/usr/bin/env python3
"""left-overs-folk.py: the left-overs job's look at how people stand (November 25, 2026). Nothing here is the game.

    python3 tools/left-overs-folk.py builds/zone-1.html <out folder> pell tobb nettie [--witches] [--tag after]

For each person named: makes everyone, lets them stand two seconds, puts the camera 2.4 m in front of that person and
takes a picture (<id>-<tag>.png). With --witches, does the same for each of the four witches standing where Io starts
(witch-<id>-<tag>.png). It prints the knee and elbow of each, as the angle at the joint (hip, knee, ankle in one line
is 180 degrees; a crouch is about 90). The angles are measured in the model's own size, so a person's build (wider
or narrower than tall) does not change them.
"""
import json, os, sys
from playwright.sync_api import sync_playwright

args = [a for a in sys.argv[1:] if not a.startswith('--')]
page_file, out, ids = os.path.abspath(args[0]), os.path.abspath(args[1]), args[2:]
tag = sys.argv[sys.argv.index('--tag') + 1] if '--tag' in sys.argv else 'shot'
if tag in ids: ids.remove(tag)
witches = '--witches' in sys.argv
os.makedirs(out, exist_ok=True)

JOINTS = """(root) => { const T = THREE, bones = []; root.traverse((o) => { if (o.isBone) bones.push(o); });
  const find = (names) => { for (const n of names) { const b = bones.find((q) => q.name.toLowerCase() === n); if (b) return b; } return null; };
  const inv = new T.Matrix4().copy(root.matrixWorld).invert(), at = (b) => b.getWorldPosition(new T.Vector3()).applyMatrix4(inv);
  const ang = (a, b, c) => { if (!a || !b || !c) return null; const p = at(a), k = at(b), f = at(c); return Math.round(p.sub(k).angleTo(f.sub(k)) * 180 / Math.PI); };
  const r = {}; for (const S of ['l', 'r']) {
    r['knee' + S] = ang(find(['thigh' + S, 'thigh_' + S, 'upperleg' + S, 'upleg' + S]), find(['shin' + S, 'shin_' + S, 'calf' + S, 'lowerleg' + S, 'leg' + S]), find(['foot' + S, 'foot_' + S]));
    r['elbow' + S] = ang(find(['uarm' + S, 'upperarm' + S, 'uparm' + S, 'arm' + S]), find(['farm' + S, 'forearm' + S, 'lowerarm' + S]), find(['hand' + S, 'hand_' + S]));
  }
  r.bones = bones.length; return r; }"""

SHOT = """async ([id, joints]) => { const P = window.__people, w = window.__w3d, M = w.P.M, T = THREE, J = eval(joints);
  const p = P.list.find((q) => q.id === id); if (!p || !p.npc) return { id, missing: true };
  // Io stands well behind the person, out of the picture
  const a0 = p.npc.root.rotation.y; let put = null;
  for (const d of [6, 8, 10, 5, 12]) for (let k = 0; k < 8 && !put; k++) { const a = a0 + Math.PI + (k - 3.5) * 0.35, x = p.x + Math.sin(a) * d, z = p.z + Math.cos(a) * d; if (w.P.walkable(M.px(x), M.py(z))) put = [x, z]; }
  if (put) w.setIo(M.px(put[0]), M.py(put[1]), 0);
  w.step(2, 30, false); P.tick();
  const r = p.npc.root, a = r.rotation.y, h = 1.75 * r.scale.y, y = r.position.y;
  w.cam.position.set(r.position.x + Math.sin(a) * 2.4 * Math.max(0.75, r.scale.y), y + h * 0.55, r.position.z + Math.cos(a) * 2.4 * Math.max(0.75, r.scale.y));
  w.cam.lookAt(r.position.x, y + h * 0.48, r.position.z); w.cam.updateMatrixWorld(true); w.render();
  r.updateMatrixWorld(true); return Object.assign({ id, name: p.name, size: +r.scale.y.toFixed(3), build: [+(r.scale.x / r.scale.y).toFixed(3), +(r.scale.z / r.scale.y).toFixed(3)] }, J(r)); }"""

WITCH = """async ([id, joints]) => { const w = window.__w3d, T = THREE, J = eval(joints);
  w.setWho(id); w.step(2, 30, false);
  const A = w.A || null, r = (window.W3D.witch(id)).root, a = r.rotation.y, y = r.position.y;
  w.cam.position.set(r.position.x + Math.sin(a) * 3.0, y + 1.0, r.position.z + Math.cos(a) * 3.0);
  w.cam.lookAt(r.position.x, y + 0.85, r.position.z); w.cam.updateMatrixWorld(true); w.render();
  r.updateMatrixWorld(true); return Object.assign({ id, size: +r.scale.y.toFixed(3) }, J(r)); }"""

errors = []
with sync_playwright() as pw:
    b = pw.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.goto('file://' + page_file + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    pg.evaluate('window.__people.ready()')
    for i in ids:
        r = pg.evaluate(SHOT, [i, JOINTS]); pg.screenshot(path=os.path.join(out, '%s-%s.png' % (i, tag)))
        print(json.dumps(r))
    if witches:
        start = pg.evaluate('[window.__w3d.io.px, window.__w3d.io.py]')
        for i in ['io', 'kore', 'europa', 'callisto']:
            pg.evaluate('([x, y]) => window.__w3d.setIo(x, y, 0)', start)
            r = pg.evaluate(WITCH, [i, JOINTS]); pg.screenshot(path=os.path.join(out, 'witch-%s-%s.png' % (i, tag)))
            print(json.dumps(r))
    b.close()
print('page errors: %d' % len(errors))
for e in errors[:5]: print('  ! ' + e[:300])
