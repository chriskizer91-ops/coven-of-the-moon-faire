// flight-bake-ship.mjs: bakes one of Skies of Aethermoor's ships into plain data, so the land's own engine can draw her
// moored at a landing.
//
//   cd game/flight && npm install        (once)
//   node tools/flight-bake-ship.mjs skiff          ->  game/flight/moored/skiff.js
//
// The ships are built by code (game/flight/src/ship/, with each ship's measurements in game/flight/src/ships/), for a
// newer three.js than the land draws with. This tool runs that builder once, here, and writes down what it made: her
// shape, as one list of corners and faces for each of her materials (planks, deck, brass band, brass, bronze, wood,
// rope, canvas, the painted parts, the crystals, the pennant), with where each corner sits on her painted pieces.
// game/flight/moored/moored-ship.js draws that under a place's own night. The painted pieces themselves are the
// pictures in game/flight/assets/ships/.
//
// She is baked a little plainer than the ship you fly (about 30,000 triangles for the Skiff, not 100,000: no rivets,
// rounder things made of fewer flats), with her sails spread and still, and WITHOUT her own lanterns: in this game the
// Grey Hat's lamps are the twelve that come home to her hooks. The built file is kept in the repo: run this again only
// if the ship builder or a ship's measurements change.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

const root = new URL('..', import.meta.url).pathname, dir = root + 'game/flight/';
const THREE = await import(dir + 'node_modules/three/build/three.module.js');
const { buildShip, LEVELS } = await import(dir + 'src/ship/build.js');
const { FLEET } = await import(dir + 'src/ships/index.js');
const { curve } = await import(dir + 'src/ship/kit.js');
const rects = JSON.parse(readFileSync(dir + 'assets/ships/parts.json', 'utf8')).rects;

const id = process.argv[2] ?? 'skiff';
const R0 = FLEET.find((s) => s.id === id);
if (!R0) { console.error('no such ship: ' + id + ' (one of ' + FLEET.map((s) => s.id).join(', ') + ')'); process.exit(1); }

// the detail she is baked at: Skies' "full" recipe with these numbers turned down (its own "middle" drops two rail
// posts in three, which shows from the pier)
const MOORED = { stations: 56, rings: 12, deckAcross: 3, latheSeg: 7, tubeRad: 4, tubePer: 3, railPath: 0.3, ropeRad: 3, sailDiv: 6, rivets: false, lights: false };
const keep = { ...LEVELS.full };
Object.assign(LEVELS.full, MOORED);
const ship = buildShip({ ...R0, lanterns: [] }, 'full', { M: {}, rects });
Object.assign(LEVELS.full, keep);
ship.update(0, { calm: true });
ship.body.position.set(0, 0, 0); ship.body.rotation.set(0, 0, 0);
ship.root.updateMatrixWorld(true);

// ---- every mesh of one material, joined, in the ship's own measure (x to port, y up, z to the bow; metres) ----
const groups = {};
const v = new THREE.Vector3(), n = new THREE.Vector3(), nm = new THREE.Matrix3();
ship.body.traverse((o) => {
  if (!o.isMesh) return;
  const g = o.geometry.index ? o.geometry.toNonIndexed() : o.geometry, A = g.attributes, G = (groups[o.name] ??= { p: [], n: [], u: [], c: [], hasCol: false });
  nm.getNormalMatrix(o.matrixWorld);
  for (let i = 0; i < A.position.count; i++) {
    v.fromBufferAttribute(A.position, i).applyMatrix4(o.matrixWorld); G.p.push(v.x, v.y, v.z);
    n.fromBufferAttribute(A.normal, i).applyMatrix3(nm).normalize(); G.n.push(n.x, n.y, n.z);
    G.u.push(A.uv ? A.uv.getX(i) : 0, A.uv ? A.uv.getY(i) : 0);
    if (A.color) { G.c.push(A.color.getX(i), A.color.getY(i), A.color.getZ(i)); if (A.color.getX(i) < 0.999 || A.color.getY(i) < 0.999 || A.color.getZ(i) < 0.999) G.hasCol = true; } else G.c.push(1, 1, 1);
  }
});

// ---- corners shared by several faces are written once: whole numbers for where they are, small ones for which way they face ----
const b64 = (a) => Buffer.from(a.buffer, a.byteOffset, a.byteLength).toString('base64');
const parts = {};
let tris = 0, corners = 0;
const box = new THREE.Box3().setFromObject(ship.body), reach = Math.max(...box.min.toArray().map(Math.abs), ...box.max.toArray().map(Math.abs)) * 1.001;
for (const [key, G] of Object.entries(groups)) {
  const count = G.p.length / 3, seen = new Map(), idx = new Uint32Array(count), P = [], N = [], U = [], C = [];
  let uvMax = 0; for (const x of G.u) uvMax = Math.max(uvMax, Math.abs(x));
  for (let i = 0; i < count; i++) {
    const p = [0, 1, 2].map((k) => Math.round(G.p[i * 3 + k] / reach * 32767)), q = [0, 1, 2].map((k) => Math.round(G.n[i * 3 + k] * 127));
    const u = [G.u[i * 2], G.u[i * 2 + 1]].map((x) => Math.round(x * 4096) / 4096), c = [0, 1, 2].map((k) => Math.round(Math.min(1, G.c[i * 3 + k]) * 255));
    const k = p.join(',') + '|' + q.join(',') + '|' + u.join(',') + (G.hasCol ? '|' + c.join(',') : '');
    let j = seen.get(k);
    if (j == null) { j = P.length / 3; seen.set(k, j); P.push(...p); N.push(...q, 0); U.push(...u); C.push(...c, 255); }
    idx[i] = j;
  }
  const nv = P.length / 3;
  parts[key] = { corners: nv, triangles: count / 3, pos: b64(new Int16Array(P)), nor: b64(new Int8Array(N)), uv: b64(new Float32Array(U)),
    col: G.hasCol ? b64(new Uint8Array(C)) : null, idx: b64(nv <= 65535 ? new Uint16Array(idx) : idx), wide: nv > 65535 };
  tris += count / 3; corners += nv;
}

// ---- what a mooring needs to know of her: her rail (for lamp hooks and a gangway), her keel, her glowing crystals ----
const H = R0.hull, half = curve(H.half), rim = curve(H.rim), keel = curve(H.keel), rail = [];
for (let i = 0; i <= 28; i++) { const z = H.stern + (H.bow - H.stern) * i / 28; rail.push([+z.toFixed(3), +half(z).toFixed(3), +(rim(z) + R0.rail.h).toFixed(3), +keel(z).toFixed(3)]); }
const glows = [];
{ const A = ship.glow.geometry.attributes;
  for (let i = 0; i < A.position.count; i++) if (A.kind.getX(i) === 1) glows.push([+A.position.getX(i).toFixed(3), +A.position.getY(i).toFixed(3), +A.position.getZ(i).toFixed(3), +A.size.getX(i).toFixed(2), +A.color.getX(i).toFixed(3), +A.color.getY(i).toFixed(3), +A.color.getZ(i).toFixed(3)]); }
const r3 = (x) => +x.toFixed(3);
const data = {
  id, length: R0.length, beam: r3(2 * Math.max(...rail.map((p) => p[1]))), reach: r3(reach), triangles: tris,
  box: { min: box.min.toArray().map(r3), max: box.max.toArray().map(r3) },
  hull: { stern: H.stern, bow: H.bow, keel: r3(Math.min(...rail.map((p) => p[3]))), railH: R0.rail.h },
  masts: R0.masts.map((m) => ({ z: m.z, height: m.height })),
  rail,      // from stern to bow: [z, her half width there, her rail's top, her keel]
  glows,     // her crystals' own light: [x, y, z, size, r, g, b]
  parts,
};
const file = `// ${id}.js: BUILT by tools/flight-bake-ship.mjs. Do not edit by hand: run the tool again.
// The ${id} from Chris's airship game, Skies of Aethermoor, baked into plain data so the land's own engine can draw her
// moored at a landing: ${tris.toLocaleString('en')} triangles in ${Object.keys(parts).length} materials. Her own measure: x to port, y up, z to the bow, in metres, 0 at
// her deck amidships. Each part's corners are packed numbers (pos: whole numbers, times reach / 32767 for metres).
// game/flight/moored/moored-ship.js draws her. Load this before it.
(function (G) { (G.COVEN_SHIPS = G.COVEN_SHIPS || {}).${id} = ${JSON.stringify(data)}; })(typeof window !== 'undefined' ? window : globalThis);
`;
mkdirSync(dir + 'moored', { recursive: true });
writeFileSync(dir + 'moored/' + id + '.js', file);
console.log(`game/flight/moored/${id}.js: ${(file.length / 1024).toFixed(0)} KB; ${tris} triangles, ${corners} corners, ${Object.keys(parts).length} materials (${Object.entries(parts).map(([k, p]) => k + ' ' + p.triangles).join(', ')}); ${glows.length} crystal glows`);
