// m7-stretch.mjs: the no-stretching check for the creatures from Aethermoor M7, as this game draws them (the creatures
// job). M7 has a check of its own (its stretch.json: no edge of the skin may grow past 1.3 times its rest length); this
// one does the same sums on this game's copy, with this game's motions and mends, so a mend can be proved here.
//
//   node tools/m7-stretch.mjs [glowcap,thornhound,...] [--frames 24] [--json out.json]
//
// For each creature, each of its motions (standing, walking, and every motion the battle can ask for) is posed at
// many moments; the skin is worked out the way the graphics card does it; and for every triangle it measures
//   stretch: each edge against its length at rest: an edge of 1% of the height or more may grow to 1.3 times, a
//            shorter one (a crease) to 3 times, as in M7's own check (kit/tools/stretch.mjs). Shown as a share of 1.3,
//   folds:   triangles turned inside out against the bone that carries them (the skin folding through itself).
// It prints the worst of each motion, where on the body it is (the bone that carries most of it), and how many
// triangles are over. Nothing is drawn: it needs no screen.
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const ROOT = path.dirname(path.dirname(new URL(import.meta.url).pathname));
const M = path.join(ROOT, 'game/battle/models/m7');
const args = process.argv.slice(2);
const opt = { frames: 24, json: null, keys: null, limit: 1.3 };
for (let i = 0; i < args.length; i++) { if (args[i] === '--frames') opt.frames = +args[++i]; else if (args[i] === '--json') opt.json = args[++i]; else if (args[i] === '--limit') opt.limit = +args[++i]; else opt.keys = args[i].split(','); }

// a page with no screen: just enough of one for the loader to make its materials
const ctx2d = { createLinearGradient: () => ({ addColorStop() {} }), createRadialGradient: () => ({ addColorStop() {} }), fillRect() {}, set fillStyle(v) {} };
const G = { console, performance, atob, Blob, Response, DecompressionStream, setTimeout, Math, Promise, Uint8Array, Float32Array, location: { search: '' },
  document: undefined };
G.window = G; G.self = G; G.globalThis = G;
G.document = { readyState: 'complete', createElement: () => ({ width: 0, height: 0, getContext: () => ctx2d }), addEventListener() {} };
vm.createContext(G);
const run = (f) => vm.runInContext(fs.readFileSync(f, 'utf8'), G, { filename: f });
run(path.join(ROOT, 'game/lib/three.r128.min.js'));
G.THREE.TextureLoader.prototype.load = function () { return new G.THREE.Texture(); };
run(path.join(M, 'meshopt-decoder.js'));
run(path.join(M, 'm7-foe.js'));
for (const f of fs.readdirSync(path.join(M, 'moves'))) run(path.join(M, 'moves', f));
const keys = opt.keys || ['glowcap', 'forge-spark', 'sapwight', 'rotwarden', 'rotstag', 'thornhound'];
for (const k of keys) { run(path.join(M, k, 'light.js')); run(path.join(M, k, k + '.js')); }
await G.M7.ready;

const T = G.THREE, out = {};
for (const k of keys) {
  const m = G.makeM7Foe({ kind: k }), mesh = m.F.mesh, geo = mesh.geometry, idx = geo.index.array, n = geo.attributes.position.count;
  const H = m.F.height || 1, sw = geo.attributes.skinWeight, si = geo.attributes.skinIndex, bones = mesh.skeleton.bones;
  const P = new Float32Array(n * 3), v = new T.Vector3();
  // (r128's boneTransform reads the packed weights as 0 to 255, not 0 to 1: each point is divided by its weights' sum)
  const WS = new Float32Array(n); for (let i = 0; i < n; i++) for (let j = 0; j < 4; j++) WS[i] += geo.attributes.skinWeight.array[i * 4 + j];
  const skin = () => { m.root.updateMatrixWorld(true); mesh.skeleton.update(); for (let i = 0; i < n; i++) { mesh.boneTransform(i, v); const w = WS[i] || 1; P[i * 3] = v.x / w; P[i * 3 + 1] = v.y / w; P[i * 3 + 2] = v.z / w; } };
  const tri = idx.length / 3, len = (A, a, b) => Math.hypot(A[a * 3] - A[b * 3], A[a * 3 + 1] - A[b * 3 + 1], A[a * 3 + 2] - A[b * 3 + 2]);
  // the rest: no motion at all
  for (const b of bones) { b.rotation.set(0, 0, 0); b.position.copy(b.userData.p0); }
  m.F.body.position.set(0, 0, 0); m.F.body.rotation.set(0, 0, 0); skin();
  const rest = P.slice(), restN = new Float32Array(tri * 3), e0 = new Float32Array(tri * 3), carrier = new Uint8Array(tri);
  const nrm = (A, t, o) => { const a = idx[t * 3], b = idx[t * 3 + 1], c = idx[t * 3 + 2];
    const ux = A[b * 3] - A[a * 3], uy = A[b * 3 + 1] - A[a * 3 + 1], uz = A[b * 3 + 2] - A[a * 3 + 2], wx = A[c * 3] - A[a * 3], wy = A[c * 3 + 1] - A[a * 3 + 1], wz = A[c * 3 + 2] - A[a * 3 + 2];
    o[0] = uy * wz - uz * wy; o[1] = uz * wx - ux * wz; o[2] = ux * wy - uy * wx; const l = Math.hypot(o[0], o[1], o[2]) || 1; o[0] /= l; o[1] /= l; o[2] /= l; return l; };
  const tmp = [0, 0, 0];
  for (let t = 0; t < tri; t++) { const a = idx[t * 3], b = idx[t * 3 + 1], c = idx[t * 3 + 2];
    e0[t * 3] = len(rest, a, b); e0[t * 3 + 1] = len(rest, b, c); e0[t * 3 + 2] = len(rest, c, a);
    nrm(rest, t, tmp); restN[t * 3] = tmp[0]; restN[t * 3 + 1] = tmp[1]; restN[t * 3 + 2] = tmp[2];
    let best = 0, bw = -1; const w = {};
    for (const vi of [a, b, c]) { for (let j = 0; j < 4; j++) { const bi = si.array[vi * 4 + j], ww = sw.array[vi * 4 + j]; w[bi] = (w[bi] || 0) + ww; } }
    for (const bi in w) if (w[bi] > bw) { bw = w[bi]; best = +bi; } carrier[t] = best; }
  const q = new T.Quaternion(), restQ = bones.map((b) => b.getWorldQuaternion(new T.Quaternion()).invert());
  const motions = ['stand', 'walk'].concat(Object.keys(m.ACTIONS).filter((a) => a !== 'die' && a !== 'retreat' && a !== 'appear'));
  const res = {};
  for (const act of motions) {
    let worst = 1, worstAt = null, over = new Set(), folds = new Set(), foldWorst = null;
    for (let f = 0; f < opt.frames; f++) {
      const u = (f + 0.5) / opt.frames, time = 2 + u * 4;
      m.reset();
      if (act === 'stand' || act === 'walk') { for (let s = 0; s < 20; s++) m.animate(time * 4.2, act === 'walk' ? 1 : 0, time + s / 30, 1 / 30); }
      else { for (let s = 0; s < 20; s++) m.animate(0, 0, time - 1 + s / 30, 1 / 30); m.play(act, true); const D = m.ACTIONS[act].dur * u; for (let s = 0; s < D - 1e-6; s += 1 / 30) m.animate(0, 0, time + s, Math.min(1 / 30, D - s)); }   // played as the battle plays it
      skin(); bones.forEach((b, i) => { b.userData.q = b.getWorldQuaternion(new T.Quaternion()).multiply(restQ[i]); });
      for (let t = 0; t < tri; t++) { const a = idx[t * 3], b = idx[t * 3 + 1], c = idx[t * 3 + 2];
        // as M7's check: an edge of 1% of the height or more may grow to 1.3 times; a shorter one (a crease) to 3 times
        let r = 0; for (let e = 0; e < 3; e++) { const l0 = e0[t * 3 + e]; if (l0 < 1e-4 * H) continue; const x = idx[t * 3 + e], y = idx[t * 3 + (e + 1) % 3];
          const g = len(P, x, y) / l0, o = l0 >= 0.01 * H ? g : g * opt.limit / 3; if (o > r) r = o; }
        if (r > worst) { worst = r; worstAt = { u: +u.toFixed(2), bone: bones[carrier[t]].name, e: [e0[t * 3], e0[t * 3 + 1], e0[t * 3 + 2]].map((x) => +(x / H).toFixed(4)), at: [P[a * 3], P[a * 3 + 1], P[a * 3 + 2]].map((x) => +x.toFixed(2)) }; }
        if (r > opt.limit) over.add(t);
        const area = nrm(P, t, tmp); if (area < 1e-12) continue;
        v.set(restN[t * 3], restN[t * 3 + 1], restN[t * 3 + 2]).applyQuaternion(bones[carrier[t]].userData.q);
        if (v.x * tmp[0] + v.y * tmp[1] + v.z * tmp[2] < -0.2) { folds.add(t); if (!foldWorst) foldWorst = { u: +u.toFixed(2), bone: bones[carrier[t]].name }; } }
    }
    const bad = worst > opt.limit;
    res[act] = { worst: +worst.toFixed(3), ok: !bad, over: over.size, folds: folds.size, where: worstAt, foldAt: foldWorst };
  }
  // where it stands: its lowest and highest point while standing (feet on the ground: lowest near 0)
  m.reset(); for (let s2 = 0; s2 < 30; s2++) m.animate(0, 0, 2 + s2 / 30, 1 / 30); skin();
  let lo = 1e9, hi = -1e9; for (let i = 0; i < n; i++) { lo = Math.min(lo, P[i * 3 + 1]); hi = Math.max(hi, P[i * 3 + 1]); }
  m.root.updateMatrixWorld(true); const by = m.F.body.position.y + m.F.mesh.position.y;
  out[k] = { triangles: tri, lowest: +(lo + by).toFixed(3), highest: +(hi + by).toFixed(3), motions: res };
  console.log(`${k}: standing, its lowest point ${(lo + by).toFixed(3)} m and its highest ${(hi + by).toFixed(2)} m`);
  const fails = Object.entries(res).filter(([, r]) => !r.ok);
  console.log(`${k}: ${tri} triangles, ${motions.length} motions, ${fails.length ? fails.length + ' over ' + opt.limit : 'none over ' + opt.limit}`);
  for (const [a, r] of Object.entries(res)) console.log(`   ${a.padEnd(9)} worst ${r.worst.toFixed(2)}${r.ok ? '' : ' OVER'}  triangles over ${r.over}  folded ${r.folds}` + (r.where ? `  at ${r.where.bone}, u ${r.where.u}` : '') + (r.foldAt ? `  folds at ${r.foldAt.bone}` : ''));
}
if (opt.json) fs.writeFileSync(opt.json, JSON.stringify(out, null, 1));
