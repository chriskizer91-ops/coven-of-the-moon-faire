// land.js: open land round a 3D place, walked into and out of with no fade (Coven of the Moon Faire, the first test,
// November 18, 2026).
//
// The method is Moon Faire's open world (its ow-terrain.js, after Chris's racing game Mud Lab): the land is rules, not a
// stored model. A height and a kind of ground can be asked for any spot; the ground is drawn in squares of 32 m round the
// walker, each made at the detail its distance needs (a point every half metre close by, then every 1, 2 and 4 m), with
// a skirt hanging from each square's edge to hide the seams, and swapped for a finer or coarser one as she moves.
// The code is new, because the land here is lit by the place engine's night (core.js: the same moon, sky, fog and lamps
// as the town), wears the place engine's textures, and grows the place engine's own trees (world.js: plantPatch).
//
// How it joins the places: zone.js builds every place of a zone, sets each down at its spot, and hands the lot (Z) to
// W3D.landAttach(Z, land). That wraps four things the walker asks:
//   Z.walkable, Z.walkH, Z.terrain   inside a place's own ground that place answers; past it, the land
//   Z.update                         also makes and drops the land's squares, trees and herbs round the walker, moves
//                                    the sky and far hills with the camera, and brings the fog round to where she is
// So the walker (walker.js) needs no change to walk out of a town, across the land, and into the next.
//
// Everything is metres: x east, z south, the zone's first place's middle at 0, 0 (as core.js's W3D.map). Painting pixels
// only where a place is asked something. Places must stand at least 60 m apart (the land meets each one's edge over
// 28 m).
(function (G) {
  'use strict';
  const W3D = G.W3D;
  const { ss, clamp, vnoise, inPoly, edgeDist } = W3D;
  const lerp = (a, b, t) => a + (b - a) * t;
  const SIZE = 32;
  // a whole number hash to 0..1, the same on every machine: where a tree or a herb stands never changes
  const h2 = (i, j, s) => { let n = (Math.imul(i, 374761393) + Math.imul(j, 668265263) + Math.imul(s | 0, 1274126177)) | 0; n = Math.imul(n ^ (n >>> 13), 1274126177); return ((n ^ (n >>> 16)) >>> 0) / 4294967296; };
  const segDist = (x, z, ax, az, bx, bz) => { const dx = bx - ax, dz = bz - az, t = clamp(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1), 0, 1); return Math.hypot(x - ax - t * dx, z - az - t * dz); };

  W3D.landAttach = function (Z, L) {
    const P = Z.host, M = Z.M, U = Z.U, scene = Z.scene;
    const TEST = /[?&]test\b/.test(location.search), PHONE = W3D.quality !== 'high';
    // a point every half metre near her on a laptop; a phone starts at every metre
    const LEVELS = PHONE ? [{ n: 32, d: 46 }, { n: 16, d: 100 }, { n: 8, d: 1e9 }] : [{ n: 64, d: 40 }, { n: 32, d: 90 }, { n: 16, d: 170 }, { n: 8, d: 1e9 }];
    const place0 = { walkable: Z.walkable, walkH: Z.walkH, terrain: Z.terrain, update: Z.update, dispose: Z.dispose };
    const [BX0, BZ0, BX1, BZ1] = L.bounds;

    // ---- each place's own ground (R), in metres, with its height all along its edge read once, so the land meets it
    // exactly ----
    const STEP = 0.5;
    const edge = (n, f) => { const a = new Float32Array(n + 1); for (let i = 0; i <= n; i++) a[i] = f(i); return a; };
    const along = (a, t) => { const f = clamp(t / STEP, 0, a.length - 1), i = Math.min(a.length - 2, Math.floor(f)); return lerp(a[i], a[i + 1], f - i); };
    const R = Z.parts.map((p) => {
      const e = 0.01, nx = Math.ceil((p.x1 - p.x0) / STEP), nz = Math.ceil((p.z1 - p.z0) / STEP);   // (a hair inside the edge, so the place itself answers)
      const X = (i) => clamp(p.x0 + i * STEP, p.x0 + e, p.x1 - e), Zc = (i) => clamp(p.z0 + i * STEP, p.z0 + e, p.z1 - e);
      // the edge's height is the place's ground there; or, where a boardwalk or a deck she can walk reaches the edge above
      // the ground (the dark heart's road out is a boardwalk), the deck's own height, so the land rises to meet it
      const top = (x, z) => { const g = p.terrain(x, z); return p.walkable(x, z) ? Math.max(g, p.walkH(x, z)) : g; };
      return { part: p, x0: p.x0, z0: p.z0, x1: p.x1, z1: p.z1, nx, nz, terr: p.terrain, name: p.name, night: p.night,
        eTop: edge(nx, (i) => top(X(i), p.z0 + e)), eBot: edge(nx, (i) => top(X(i), p.z1 - e)),
        eLeft: edge(nz, (i) => top(p.x0 + e, Zc(i))), eRight: edge(nz, (i) => top(p.x1 - e, Zc(i))) };
    });
    const rectAt = (x, z) => { for (const r of R) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return r; return null; };
    const inRectM = (x, z) => rectAt(x, z) !== null;
    // an upright rectangle [a..c] x [b..d], less every place's own ground: the pieces left
    const cutRects = (a, b, c, d) => { let list = [[a, b, c, d]]; for (const r of R) { const out = []; for (const q of list) { const [qa, qb, qc, qd] = q; if (qc <= r.x0 || qa >= r.x1 || qd <= r.z0 || qb >= r.z1) { out.push(q); continue; } if (qb < r.z0) out.push([qa, qb, qc, r.z0]); if (qd > r.z1) out.push([qa, r.z1, qc, qd]); const m0 = Math.max(qb, r.z0), m1 = Math.min(qd, r.z1); if (qa < r.x0) out.push([qa, m0, r.x0, m1]); if (qc > r.x1) out.push([r.x1, m0, qc, m1]); } list = out; } return list; };
    const dOutR = (r, x, z) => Math.hypot(Math.max(r.x0 - x, 0, x - r.x1), Math.max(r.z0 - z, 0, z - r.z1));
    // how far outside the nearest place's ground a spot is (0 inside one); NR is that place
    let NR = R[0];
    const dOut = (x, z) => { let d = 1e9; for (const r of R) { const q = dOutR(r, x, z); if (q < d) { d = q; NR = r; } } return d; };
    function hEdge(r, x, z) {
      const cx = clamp(x, r.x0, r.x1), cz = clamp(z, r.z0, r.z1);
      if (z <= r.z0) return along(r.eTop, cx - r.x0);
      if (z >= r.z1) return along(r.eBot, cx - r.x0);
      return x <= r.x0 ? along(r.eLeft, cz - r.z0) : along(r.eRight, cz - r.z0);
    }

    // ---- the land's lines: roads, rivers, lakes, clearings ----
    const box = (pts, pad) => { let a = 1e9, b = 1e9, c = -1e9, d = -1e9; for (const q of pts) { a = Math.min(a, q[0]); b = Math.min(b, q[1]); c = Math.max(c, q[0]); d = Math.max(d, q[1]); } return [a - pad, b - pad, c + pad, d + pad]; };
    // ---- a road marked `route` finds its own way over the map's hills between the points given for it: the easiest
    // way by slope (a steep step costs many times a level one), keeping off water where it can and out of the places
    // and the camp. Found on a grid of 16 m squares, then smoothed. (The points given stay: the gates and the lead-ins.) ----
    if (L.atlas && L.atlas.map && W3D.atlas && W3D.atlas.ready) {
      const AMr = L.atlas.map, O = {}, C = 16, parts = Z.parts, flats = L.flats || [];
      const route = (a, b) => {
        const x0 = Math.min(a[0], b[0]) - 320, z0 = Math.min(a[1], b[1]) - 320, nx = Math.ceil((Math.max(a[0], b[0]) + 320 - x0) / C) + 1, nz = Math.ceil((Math.max(a[1], b[1]) + 320 - z0) / C) + 1, N = nx * nz;
        const H = new Float32Array(N), K = new Float32Array(N), g = new Float32Array(N).fill(1e30), from = new Int32Array(N).fill(-1), done = new Uint8Array(N);
        for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) { const x = x0 + i * C, z = z0 + j * C, q = W3D.atlas.at(AMr.origin[0] + x / AMr.k, AMr.origin[1] + z / AMr.k, O); H[j * nx + i] = q.h * AMr.vk;
          K[j * nx + i] = parts.some((p) => x > p.x0 - 14 && x < p.x1 + 14 && z > p.z0 - 14 && z < p.z1 + 14) || flats.some((f) => Math.hypot(x - f.x, z - f.z) < f.r + 8) ? 1e9 : q.water > 0.4 ? 10 : 1; }
        const id = (p) => clamp(Math.round((p[1] - z0) / C), 0, nz - 1) * nx + clamp(Math.round((p[0] - x0) / C), 0, nx - 1), s = id(a), e = id(b), ei = e % nx, ej = (e - ei) / nx;
        // (the two ends may lie against a place: the squares right by them are let through)
        for (const n of [s, e]) for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) { const k = n + dj * nx + di; if (k >= 0 && k < N && K[k] > 1e8) K[k] = 1; }
        const heap = [[0, s]]; g[s] = 0;
        const push = (v) => { heap.push(v); let i = heap.length - 1; while (i > 0) { const p = (i - 1) >> 1; if (heap[p][0] <= heap[i][0]) break; [heap[p], heap[i]] = [heap[i], heap[p]]; i = p; } };
        const pop = () => { const t = heap[0], l = heap.pop(); if (heap.length) { heap[0] = l; let i = 0; for (;;) { const a2 = 2 * i + 1, b2 = a2 + 1; let m = i; if (a2 < heap.length && heap[a2][0] < heap[m][0]) m = a2; if (b2 < heap.length && heap[b2][0] < heap[m][0]) m = b2; if (m === i) break; [heap[m], heap[i]] = [heap[i], heap[m]]; i = m; } } return t; };
        while (heap.length) { const [, n] = pop(); if (done[n]) continue; done[n] = 1; if (n === e) break; const i = n % nx, j = (n - i) / nx;
          for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) { if (!di && !dj) continue; const I = i + di, J = j + dj; if (I < 0 || J < 0 || I >= nx || J >= nz) continue; const m = J * nx + I; if (done[m] || K[m] > 1e8) continue;
            const d = C * (di && dj ? 1.414 : 1), gr = Math.abs(H[m] - H[n]) / d, c = g[n] + d * (1 + (gr / 0.09) * (gr / 0.09)) * K[m]; if (c < g[m]) { g[m] = c; from[m] = n; push([c + Math.hypot(I - ei, J - ej) * C, m]); } } }
        let path = []; for (let n = e; n !== -1 && path.length < N; n = from[n]) path.push([x0 + (n % nx) * C, z0 + Math.floor(n / nx) * C]); path.reverse();
        if (path.length < 2 || from[e] === -1) return [a, b];
        let pts = [a].concat(path.filter((_, i) => i % 2 === 1 && i > 1 && i < path.length - 2), [b]);
        for (let pass = 0; pass < 2; pass++) pts = pts.map((p, i) => (i === 0 || i === pts.length - 1 ? p : [(pts[i - 1][0] + 2 * p[0] + pts[i + 1][0]) / 4, (pts[i - 1][1] + 2 * p[1] + pts[i + 1][1]) / 4]));
        return pts.map((p) => [+p[0].toFixed(1), +p[1].toFixed(1)]);
      };
      for (const r of (L.roads || []).concat(L.longRoad ? [L.longRoad] : [])) { if (!r.route) continue; let pts = [r.pts[0]];
        for (let i = 1; i < r.pts.length; i++) { const a = r.pts[i - 1], b = r.pts[i]; pts = pts.concat(Math.hypot(b[0] - a[0], b[1] - a[1]) > 150 ? route(a, b).slice(1) : [b]); }
        r.pts = pts; }
      // every sharp corner is rounded off (cut 12 m back each way, or a third of the stretch), twice
      for (const r of (L.roads || []).concat(L.longRoad ? [L.longRoad] : [])) for (let pass = 0; pass < 2; pass++) { const q = r.pts, out = [q[0]];
        for (let i = 1; i + 1 < q.length; i++) { const a = q[i - 1], b = q[i], c = q[i + 1], l1 = Math.hypot(b[0] - a[0], b[1] - a[1]), l2 = Math.hypot(c[0] - b[0], c[1] - b[1]), cs = ((b[0] - a[0]) * (c[0] - b[0]) + (b[1] - a[1]) * (c[1] - b[1])) / (l1 * l2 || 1);
          if (cs > 0.9 || l1 < 3 || l2 < 3) { out.push(b); continue; } const k1 = Math.min(12, l1 / 3) / l1, k2 = Math.min(12, l2 / 3) / l2;
          out.push([+(b[0] + (a[0] - b[0]) * k1).toFixed(1), +(b[1] + (a[1] - b[1]) * k1).toFixed(1)], [+(b[0] + (c[0] - b[0]) * k2).toFixed(1), +(b[1] + (c[1] - b[1]) * k2).toFixed(1)]); }
        out.push(q[q.length - 1]); r.pts = out; }
    }
    // (a long road is kept in short runs, each with its own box, so finding the nearest run is quick)
    const ROADS = []; let ROADS_SRC = -1; for (const r of L.roads || []) { ROADS_SRC++; const n = r.pts.length; for (let i = 0; ; i += 8) { const pts = r.pts.slice(i, i + 9), last = i + 9 >= n; ROADS.push({ src: ROADS_SRC, i0: i, hs: null, pts, w: r.w || 3.4, stone: i === 0 ? r.stone || null : null, from: r.pts[0], stoneTo: last ? r.stoneTo || null : null, to: r.pts[n - 1], b: box(pts, 14) }); if (last) break; } }
    const RIVERS = (L.rivers || []).map((r) => ({ pts: r.pts, level: r.level, bed: r.bed, tex: r.tex, rep: r.rep, flow: r.flow, b: box(r.pts, 26) }));
    const LAKES = (L.lakes || []).map((l) => ({ poly: l.poly, level: l.level, bed: l.bed, tex: l.tex, rep: l.rep, flow: l.flow, b: box(l.poly, 16), bb: box(l.poly, 0) }));
    // flats: round stretches of ground levelled and trampled to earth, with no trees (the Moon Faire's camp). Each may
    // carry its own name and its own night (clearer fog round the lanterns)
    const FLATS = (L.flats || []).map((f) => Object.assign({ h: null }, f));
    // ---- a long road out of the zone (L.longRoad: { pts, half, w }): the land she can walk is the zone's own ground and
    // a band `half` metres either side of it. It is kept in short runs, each with its own box, so finding the nearest
    // run is quick however long the road is ----
    const LR = [], LRH = L.longRoad ? L.longRoad.half : 0;
    if (L.longRoad) { const q = L.longRoad.pts; for (let i = 0; i + 1 < q.length; i += 8) { const pts = q.slice(i, i + 9); LR.push({ pts, b: box(pts, LRH + 2) }); ROADS.push({ src: (L.roads || []).length, i0: i, hs: null, pts, w: L.longRoad.w || 3.4, stone: null, from: pts[0], stoneTo: null, to: pts[pts.length - 1], b: box(pts, 12) }); } }
    // how far inside the edge of the land she can walk (under 0: outside it)
    const rimD = (x, z) => { let d = Math.min(x - BX0, BX1 - x, z - BZ0, BZ1 - z); if (d >= 16) return d;
      for (const c of LR) { if (x < c.b[0] || x > c.b[2] || z < c.b[1] || z > c.b[3]) continue; for (let i = 0; i + 1 < c.pts.length; i++) d = Math.max(d, LRH - segDist(x, z, c.pts[i][0], c.pts[i][1], c.pts[i + 1][0], c.pts[i + 1][1])); }
      return d; };
    const CLEAR = (L.clearings || []).concat(FLATS.map((f) => ({ x: f.x, z: f.z, r: f.r + 3 })));
    // ---- a place's water carried on past its edge by rule (a place set down with `autoWater`): wherever one of its
    // lakes or streams reaches the edge of its ground, the land takes it on from there at the same level. A narrow
    // run (a stream) becomes a river winding out to the land's rim; a wide one (a lake's shore) becomes a bay ----
    for (const r of R) {
      if (!r.part.autoWater) continue;
      const pt = r.part, pl = pt.P.place, PM = pt.P.M, lx = (x) => PM.px(x - pt.ox), lz = (z) => PM.py(z - pt.oz);
      const sides = [   // each side: its two ends, and the way out
        { a: [r.x0, r.z0], b: [r.x1, r.z0], n: [0, -1] }, { a: [r.x1, r.z0], b: [r.x1, r.z1], n: [1, 0] },
        { a: [r.x1, r.z1], b: [r.x0, r.z1], n: [0, 1] }, { a: [r.x0, r.z1], b: [r.x0, r.z0], n: [-1, 0] }];
      (pl.water || []).forEach((w, wi) => {
        for (const sd of sides) {
          const len = Math.hypot(sd.b[0] - sd.a[0], sd.b[1] - sd.a[1]), n = Math.ceil(len / STEP); let run = null;
          for (let i = 0; i <= n + 1; i++) {
            const t = Math.min(1, i / n), x = lerp(sd.a[0], sd.b[0], t), z = lerp(sd.a[1], sd.b[1], t);
            const wet = i <= n && inPoly(w.poly, lx(x - sd.n[0] * 0.05), lz(z - sd.n[1] * 0.05));
            if (wet && !run) run = [x, z]; 
            if (!wet && run) {
              const wd = Math.hypot(x - run[0], z - run[1]), mx = (x + run[0]) / 2, mz = (z + run[1]) / 2, level = w.level(lz(mz));
              if (wd > 1.5 && wd <= 18) {
                // a stream: out from the edge, a bend every 26 m, to the land's rim (or to another place's ground)
                const pts = [[mx, mz, wd]]; let px = mx, pz = mz;
                for (let k = 1; k < 60; k++) {
                  const sway = (h2(Math.round(mx), Math.round(mz), k) - 0.5) * 12; px += sd.n[0] * 26 + sd.n[1] * sway; pz += sd.n[1] * 26 + sd.n[0] * sway;
                  if (rectAt(px, pz)) break;
                  pts.push([px, pz, lerp(wd, Math.min(wd, 6), Math.min(1, k / 3))]);
                  if (px < BX0 - 10 || px > BX1 + 10 || pz < BZ0 - 10 || pz > BZ1 + 10) break;
                }
                if (pts.length > 1) RIVERS.push({ pts, level, bed: level - 1.7, tex: w.tex, rep: w.rep, flow: w.flow, b: box(pts, 26) });
              } else if (wd > 18) {
                // a shore: a bay bulging out from the edge, as deep as half its width (12 to 60 m)
                const dep = clamp(wd * 0.45, 12, 60), poly = [];
                for (let k = 0; k <= 16; k++) { const q = k / 16, e = 0.5 - 0.5 * Math.cos(q * Math.PI), o = Math.sin(q * Math.PI) * dep; poly.push([lerp(run[0], x, e) + sd.n[0] * o, lerp(run[1], z, e) + sd.n[1] * o]); }
                LAKES.push({ poly, level, bed: Math.min(w.bed, level - 1.0), tex: w.tex, rep: w.rep, flow: w.flow, b: box(poly, 16), bb: box(poly, 0) });
              }
              run = null;
            }
          }
        }
      });
    }
    // how far from the middle of the nearest road, less half its width (so 0 is the road's edge)
    let roadH = null;   // and the graded height of that road at its nearest point, if it has been graded (below): set by roadEdge
    let roadStone = null;   // the nearest road, if it carries a town's stone (paving or cobbles) out from its first point (`stone`) or in to its last (`stoneTo`): set by roadEdge
    function roadEdge(x, z) {
      let best = 1e9, hw = 0, ww = 0; roadStone = null;
      for (const r of ROADS) {
        if (x < r.b[0] || x > r.b[2] || z < r.b[1] || z > r.b[3]) continue;
        for (let i = 0; i + 1 < r.pts.length; i++) { const a = r.pts[i], b = r.pts[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1), 0, 1);
          const d = Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz) - r.w / 2; if (d < best) { best = d; roadStone = r.stone || r.stoneTo ? r : null; }
          // (the graded height: every run near by has its say, the nearest by far the most, so the height does not jump on the inside of a bend)
          if (r.hs) { const dc = d + r.w / 2, wg = 1 / ((dc * dc + 1) * (dc * dc + 1)); hw += wg * lerp(r.hs[i], r.hs[i + 1], t); ww += wg; } }
      }
      roadH = ww > 0 ? hw / ww : null;
      return best;
    }
    // the nearest water: how far outside its edge (under 0: in it), with its level and bed
    const WAT = { sd: 1e9, level: 0, bed: 0 };
    function water(x, z) {
      WAT.sd = 1e9;
      for (const r of RIVERS) {
        if (x < r.b[0] || x > r.b[2] || z < r.b[1] || z > r.b[3]) continue;
        for (let i = 0; i + 1 < r.pts.length; i++) {
          const a = r.pts[i], b = r.pts[i + 1], dx = b[0] - a[0], dz = b[1] - a[1], t = clamp(((x - a[0]) * dx + (z - a[1]) * dz) / (dx * dx + dz * dz || 1), 0, 1);
          const d = Math.hypot(x - a[0] - t * dx, z - a[1] - t * dz) - lerp(a[2], b[2], t) / 2;
          if (d < WAT.sd) { WAT.sd = d; WAT.level = r.level; WAT.bed = r.bed; }
        }
      }
      for (const l of LAKES) {
        if (x < l.b[0] || x > l.b[2] || z < l.b[1] || z > l.b[3]) continue;
        const e = edgeDist(l.poly, x, z), d = inPoly(l.poly, x, z) ? -e : e;
        if (d < WAT.sd) { WAT.sd = d; WAT.level = l.level; WAT.bed = l.bed; }
      }
      return WAT;
    }
    const thornK = L.thornK || (() => 0);
    // ---- the 3D map of Aethermoor under this land (engine/land/atlas.js; L.atlas.map says how the land lies on it) ----
    // The land is the map at one size everywhere: `origin` is the atlas pixel under this land's (0, 0), `k` the metres
    // here to an atlas pixel, `vk` what the map's heights are multiplied by. The map's heights are the land's hills;
    // its lakes, rivers, sea and fen pools are water here, each at its own height; its fen, open grass and pine forest
    // change the ground and the trees. Each place stands at the map's height for its spot (engine/land/zone.js).
    const AT = L.atlas && L.atlas.map && W3D.atlas && W3D.atlas.ready ? L.atlas : null, AO = { h: 0, hw: 0, water: 0, fen: 0, open: 0, pine: 0 };
    const AM = AT ? AT.map : null, H0 = AT ? W3D.atlas.at(AM.origin[0], AM.origin[1], AO).h : 0;
    const FENS = AT ? R.filter((r) => r.part.moat) : [];
    // where a place's own water reaches the edge of its ground, the land's water carries on from it, at its level:
    // each such run of edge, as [x0, z0, x1, z1, level]
    const WET = [], WET_BEFORE = (r) => WET.filter((w) => w.r === r).length;
    if (AT) for (const r of R) { const p = r.part, PM = p.P.M, ws = p.P.place.water || [];
      const lv = (x, z) => { const px = PM.px(x - p.ox), py = PM.py(z - p.oz); for (const w of ws) if (inPoly(w.poly, px, py)) return (typeof w.level === 'function' ? w.level(py) : w.level) + (p.oy || 0); return null; };
      const walk = (n, at) => { let run = null; for (let i = 0; i <= n; i++) { const [x, z] = at(i), l = lv(x, z); if (l !== null && run && Math.abs(l - run[4]) < 0.3) { run[2] = x; run[3] = z; } else { if (run) WET.push(run); run = l !== null ? [x, z, x, z, l] : null; if (run) run.r = r; } } if (run) WET.push(run); };
      const e = 0.05; walk(r.nx, (i) => [Math.min(r.x1, r.x0 + i * STEP), r.z0 + e]); walk(r.nx, (i) => [Math.min(r.x1, r.x0 + i * STEP), r.z1 - e]);
      walk(r.nz, (i) => [r.x0 + e, Math.min(r.z1, r.z0 + i * STEP)]); walk(r.nz, (i) => [r.x1 - e, Math.min(r.z1, r.z0 + i * STEP)]);
      // a place that stands in the fen (`moat`), whose own water stops short of its edge: the land's water lies all round it
      if (p.moat && p.waterY != null && WET_BEFORE(r) === 0) { const l = p.waterY + (p.oy || 0); WET.push([r.x0, r.z0, r.x1, r.z0, l], [r.x0, r.z1, r.x1, r.z1, l], [r.x0, r.z0, r.x0, r.z1, l], [r.x1, r.z0, r.x1, r.z1, l]); } }
    for (const w of WET) w.b = [Math.min(w[0], w[2]) - 52, Math.min(w[1], w[3]) - 52, Math.max(w[0], w[2]) + 52, Math.max(w[1], w[3]) + 52];
    let wetD = 1e9, wetL = 0;
    const wetNear = (x, z) => { wetD = 1e9; for (const w of WET) { if (x < w.b[0] || x > w.b[2] || z < w.b[1] || z > w.b[3]) continue; const d = segDist(x, z, w[0], w[1], w[2], w[3]); if (d < wetD) { wetD = d; wetL = w[4]; } } return wetD; };
    // AQ: what atlasAt fills in. rel: the height the map gives; wm: how much the map has water there, force: how much
    // a place's own water carries on there, wk the greater; fen, open, pine: 0 to 1; wl: the water's level there;
    // mpp: about how many metres the map's water edge is spread over
    const AQ = { rel: 0, wk: 0, wm: 0, force: 0, fen: 0, open: 0, pine: 0, wl: 0, mpp: 1 };
    function atlasAt(x, z) {
      const a = W3D.atlas.at(AM.origin[0] + x / AM.k, AM.origin[1] + z / AM.k, AO);
      AQ.rel = (a.h - H0) * AM.vk; AQ.wm = a.water; AQ.fen = a.fen; AQ.open = a.open; AQ.pine = a.pine; AQ.mpp = 4 * AM.k;
      let wl = AT.waterY + (a.hw - H0) * AM.vk, force = 0;
      if (wetNear(x, z) < 50) { wl = lerp(wetL, wl, ss(26, 50, wetD) * ss(0.3, 0.5, a.water)); force = 1 - ss(26, 40, wetD); }
      for (const m of FENS) { const d = dOutR(m, x, z); if (d < 60) AQ.fen = Math.max(AQ.fen, 1 - ss(20, 60, d)); }
      AQ.wl = wl; AQ.force = force; AQ.wk = Math.max(a.water, force);
      return AQ;
    }
    // rolling ground: a slow swell, hummocks, and small bumps
    const roll = (x, z, amp) => L.level + (vnoise(x / 150 + 3.1, z / 150 + 8.7) - 0.5) * 2.6 + ((vnoise(x / 41 + 11.3, z / 41 + 2.9) - 0.5) * 1.9 + (vnoise(x / 13 + 5.5, z / 13 + 1.7) - 0.5) * 0.55 + (vnoise(x / 4.1, z / 4.1) - 0.5) * 0.13) * amp;

    // ---- the rules: a height and a kind of ground for any spot past the place ----
    // F: what field() fills in. h the height; road, thorn, moss, wet 0 to 1 for the ground's look
    for (const f of FLATS) f.h = roll(f.x, f.z, lerp(L.roll[0], L.roll[1], thornK(f.x, f.z)) * 0.5) + (AT ? atlasAt(f.x, f.z).rel : 0);
    const F = { h: 0, road: 0, thorn: 0, moss: 0, wet: 0, cob: 0, pave: 0, sd: 1e9, re: 1e9, aw: 0, fen: 0, open: 0, pine: 0, wl: 0 };
    function field(x, z, want) {
      const tk = thornK(x, z), re = roadEdge(x, z), stone = roadStone, rh = roadH, rw = 1 - ss(-0.5, 1.4, re), calm = 1 - ss(0, 7, re);
      // rolling ground: a slow swell, hummocks, and small bumps; gentler along a road, a little wilder in the thorns
      const amp = lerp(L.roll[0], L.roll[1], tk) * (1 - 0.72 * calm);
      let h = roll(x, z, amp), flatK = 0, q = null;
      // the map's hills are added on; the fen lies flat, a hand above its water
      if (AT) { q = atlasAt(x, z); const bumps = h - L.level; h = lerp(L.level + bumps + q.rel, q.wl + 0.42 + bumps * 0.16, q.fen); }
      // a graded road: the ground is cut or banked up to the road's own even slope, over 14 m either side
      if (rh !== null && re < 14) h = lerp(rh, h, ss(1.0, 14, re));
      // a flat: the ground comes level with its middle, and is trampled to earth
      for (const f of FLATS) { const dd = Math.hypot(x - f.x, z - f.z); if (dd >= f.r) continue; if (f.h === null) f.h = roll(f.x, f.z, lerp(L.roll[0], L.roll[1], thornK(f.x, f.z)) * 0.5); const k = 1 - ss(f.r * 0.6, f.r, dd); h = lerp(h, f.h, k); if (k > flatK) flatK = k; }
      // water: the banks stand a little above it, and the bed drops away inside it
      const w = water(x, z), sd = w.sd;
      if (sd < 14) { const low = w.level + 0.45 - h; if (low > 0) h += low * (1 - ss(4, 14, sd)); if (sd < 0.4) h = lerp(w.bed, h, ss(-1.4, 0.4, sd)); }   // (a steep bank, as the town's own water has)
      // meeting the place: its own edge height at the edge, the wild's by 28 m out
      const d = dOut(x, z);
      // the map's own water: the land never lies lower than a hand above it, slopes down to it as a bank, and drops
      // away under it. A road crosses on a raised bank of earth. It keeps clear of the water drawn by hand, of the
      // camp, and of the places that do not stand in it
      let wk = 0;
      if (q) {
        wk = Math.max(q.wm * ss(24, 44, d), q.force) * ss(1.2, 4.0, re) * ss(25, 55, sd) * (1 - flatK);
        const fl = q.wl + 0.3; if (h < fl) h = lerp(h, fl, ss(2, 10, sd) * ss(0.05, 0.3, q.wk));   // (only where there is water near: a road's cutting stays cut)
        h = lerp(h, fl, ss(0.15, 0.45, wk)) - 1.4 * ss(0.47, 0.7, wk);
      }
      F.h = d < 28 ? lerp(hEdge(NR, x, z), h, ss(0, 28, d)) : h;
      F.sd = q && wk > 0.25 ? Math.min(sd, (0.5 - wk) * q.mpp) : sd; F.re = re;
      F.aw = wk; if (q) { F.fen = q.fen; F.open = q.open; F.pine = q.pine; F.wl = q.wl; }
      if (want) {
        F.road = Math.max(rw, flatK * (0.5 + 0.5 * ss(0.3, 0.6, vnoise(x / 6.3 + 1.1, z / 6.3 + 7.7))));
        // a road out of town keeps the town's stone underfoot for its first steps, then wears down to earth
        F.cob = 0; F.pave = 0;
        if (stone) for (const [kind, at] of [[stone.stone, stone.from], [stone.stoneTo, stone.to]]) { if (!kind) continue; const sk = rw * (1 - ss(3, 24, Math.hypot(x - at[0], z - at[1]))); if (kind === 'cob') F.cob = Math.max(F.cob, sk); else F.pave = Math.max(F.pave, sk); }
        F.thorn = tk;
        F.moss = tk * ss(0.52, 0.7, vnoise(x / 23 + 9.9, z / 23 + 4.4)) * (1 - rw);
        F.wet = Math.max(1 - ss(0, 5, Math.max(sd, 0)), ss(0.12, 0.5, wk));
      }
      return F;
    }
    const height = (x, z) => field(x, z, false).h;
    // ---- on the map's hills the roads are graded: each keeps the height it has at its two ends, and between them never
    // climbs or falls steeper than `grade` (18 m in 100), cutting through a rise and banking over a dip. Done one road
    // at a time, in order, so a road that starts on an earlier one starts at that road's height ----
    if (AT) {
      const GR = AT.grade || 0.18, all = (L.roads || []).map((r) => r.pts); if (L.longRoad) all.push(L.longRoad.pts);
      all.forEach((pts, ri) => {
        const n = pts.length, hs = new Float32Array(n), sd = new Float32Array(n);
        for (let i = 0; i < n; i++) { hs[i] = field(pts[i][0], pts[i][1], false).h; if (i) sd[i] = sd[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); }
        const len = sd[n - 1], h0 = hs[0], h1 = hs[n - 1];
        for (let i = 1; i < n - 1; i++) hs[i] = clamp(hs[i], Math.max(h0 - GR * sd[i], h1 - GR * (len - sd[i])), Math.min(h0 + GR * sd[i], h1 + GR * (len - sd[i])));
        for (let pass = 0; pass < 3; pass++) {
          for (let i = 1; i < n - 1; i++) hs[i] = (hs[i - 1] + 2 * hs[i] + hs[i + 1]) / 4;
          for (let i = 1; i < n - 1; i++) { const g = GR * (sd[i] - sd[i - 1]); hs[i] = clamp(hs[i], hs[i - 1] - g, hs[i - 1] + g); }
          for (let i = n - 2; i > 0; i--) { const g = GR * (sd[i + 1] - sd[i]); hs[i] = clamp(hs[i], hs[i + 1] - g, hs[i + 1] + g); }
        }
        for (const r of ROADS) if (r.src === ri) r.hs = hs.subarray(r.i0, r.i0 + r.pts.length);
      });
    }
    // the ground a square is drawn with: inside the place's own ground it follows the place's, a finger lower at the edge
    // and a hand lower from a little way in, so the place's ground always lies on top there and the two never flicker
    function drawnY(x, z) {
      const r = rectAt(x, z); if (!r) return height(x, z);
      const dIn = Math.min(x - r.x0, r.x1 - x, z - r.z0, r.z1 - z);
      return dIn > 4 ? -60 : r.terr(x, z) - 0.05 - 0.6 * ss(0.3, 2.0, dIn);
    }

    // ---- the ground's look: the place engine's own lighting, four of Chris's ground textures laid by the rules ----
    const tx = (id) => W3D.zoneTex(id) || W3D.zoneTex(L.ground.grass);
    const GM = L.ground;
    const atlasWaterMat = AT ? W3D.waterMat(U, { water: tx(AT.water.tex), rep: AT.water.rep, flow: AT.water.flow }) : null;
    // (near a place the ground also takes that place's lamplight and shade, fading out over 16 m: r is that place)
    const makeGroundMat = (r) => new THREE.ShaderMaterial({
      uniforms: Object.assign({}, r ? r.U || r.part.P.U : U, {
        tCob: { value: tx(GM.cob) }, tPave: { value: tx(GM.pave) }, uRepS: { value: new THREE.Vector2(1 / GM.repStone[0], 1 / GM.repStone[1]) },
        tGrass: { value: tx(GM.grass) }, tBram: { value: tx(GM.bramble) }, tMoss: { value: tx(GM.moss) }, tDirt: { value: tx(GM.dirt) }, tRock: { value: tx(GM.rock) }, tFen: { value: tx(GM.fen || GM.grass) }, uFen: { value: new THREE.Vector4(1 / (GM.repFen || 4), ...(GM.fenTint || [1, 1, 1])) },
        uRepL: { value: new THREE.Vector4(1 / GM.rep[0], 1 / GM.rep[1], 1 / GM.rep[2], 1 / GM.rep[3]) },
        uGrassTint: { value: new THREE.Vector3(...GM.grassTint) }, uBramTint: { value: new THREE.Vector3(...GM.brambleTint) }, uMossTint: { value: new THREE.Vector3(...GM.mossTint) }, uDirtTint: { value: new THREE.Vector3(...GM.dirtTint) },
        uRect: { value: r ? new THREE.Vector4(r.x0, r.z0, r.x1, r.z1) : new THREE.Vector4(0, 0, 0, 0) }, uWildShade: { value: new THREE.Vector2(L.shade[0], L.shade[1]) },
        uRep: { value: new THREE.Vector2(1, 1) }, uTint: { value: new THREE.Color(0xffffff) }, uEmis: { value: new THREE.Color(0) }, uLit: { value: 1 }, uGlowUse: { value: 1 }, uSpec: { value: 0 }, uShadeK: { value: 1 },
      }),
      vertexShader: `attribute vec4 aW; attribute vec3 aS; varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying vec3 vCol; varying vec4 vWt; varying vec3 vSt;
        void main() { vW = position; vN = normal; vUv = position.xz; vCol = vec3(1.0); vWt = aW; vSt = aS; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,
      fragmentShader: W3D.GLSL.F + `
        uniform sampler2D tGrass, tBram, tMoss, tDirt, tRock; uniform vec4 uRepL, uRect; uniform vec3 uGrassTint, uBramTint, uMossTint, uDirtTint; uniform vec2 uWildShade; varying vec4 vWt; uniform sampler2D tCob, tPave, tFen; uniform vec2 uRepS; uniform vec4 uFen; varying vec3 vSt;
        // each picture twice, the second larger and shifted, as the town's ground does, so it never reads as tiles
        vec3 two(sampler2D t, vec2 w, float rep) {
          #ifdef LITE
            return toLin(texture2D(t, w * rep).rgb);   // (a phone reads each picture once)
          #else
          vec3 a = texture2D(t, w * rep).rgb, b = texture2D(t, w * rep * 0.29 + vec2(0.37, 0.71)).rgb;
          return toLin(a) * mix(0.78, 1.22, smoothstep(0.15, 0.6, dot(b, vec3(0.333))));
          #endif
        }
        void main() {
          vec2 w = vW.xz; vec3 n = normalize(vN);
          vec3 c = mix(two(tGrass, w, uRepL.x) * uGrassTint, two(tBram, w, uRepL.y) * uBramTint, vWt.y);
          c = mix(c, two(tMoss, w, uRepL.z) * uMossTint, vWt.z);
          c = mix(c, two(tFen, w, uFen.x) * uFen.yzw, vSt.z);   // the fen's own ground
          c = mix(c, two(tDirt, w, uRepL.w) * uDirtTint, vWt.x);
          c = mix(c, two(tCob, w, uRepS.x), vSt.x); c = mix(c, two(tPave, w, uRepS.y), vSt.y);
          // bare rock where the ground is steep (a river's banks)
          c = mix(c, toLin(texture2D(tRock, w * 0.45).rgb) * 0.75, smoothstep(0.34, 0.6, 1.0 - n.y));
          c *= 1.0 - 0.3 * vWt.w;   // darker where it is wet, by the water
          // the town's lamplight and its trees' shade reach a little way out, then give way to the wild's own shade
          #ifdef WILD
            vec3 col = c * nightLight(vW, n, mix(uWildShade.x, uWildShade.y, vWt.y));
          #else
            vec2 dr = max(max(uRect.xy - w, w - uRect.zw), 0.0); float kIn = 1.0 - smoothstep(0.0, 16.0, length(dr));
            float sh = mix(mix(uWildShade.x, uWildShade.y, vWt.y), texture2D(uShade, paintUv(vW)).r, kIn);
            vec3 col = c * (nightLight(vW, n, sh) + lampLight(vW, n) * kIn);
          #endif
          gl_FragColor = outC(fogged(col, vW));
        }`,
      // drawn a hair behind anything that lies in the same place (the place's own ground along its edge)
      polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 2, defines: Object.assign(PHONE ? { LITE: '' } : {}, r ? {} : { WILD: '' }),
    });
    const wildMat = makeGroundMat(null); for (const r of R) r.mat = makeGroundMat(r);
    // ground lit by lamps that are not a place's (the camp's lanterns): { x0, z0, x1, z1, U } with its own lamplight picture
    const GLOWS = [];

    // ---- the rim: a low upright band of ground all round the place's edge, just under its ground's own edge. The land
    // lies a finger lower than the place's ground where they meet, and seen from outside at a low angle that would show
    // as a thin dark crack; the band closes it, in the ground's own colours (paving where a road crosses) ----
    const rims = [];
    for (const r of R) {
      const pos = [], nrm = [], wt = [], st = [], idx = [];
      const pts = [];
      for (let i = 0; i <= r.nx; i++) pts.push([Math.min(r.x1, r.x0 + i * STEP), r.z0]);
      for (let i = 1; i <= r.nz; i++) pts.push([r.x1, Math.min(r.z1, r.z0 + i * STEP)]);
      for (let i = r.nx - 1; i >= 0; i--) pts.push([Math.min(r.x1, r.x0 + i * STEP), r.z1]);
      for (let i = r.nz - 1; i >= 0; i--) pts.push([r.x0, Math.min(r.z1, r.z0 + i * STEP)]);
      pts.forEach(([x, z], k) => {
        const f = field(x, z, true), y = hEdge(r, x, z);
        for (const dy of [0.01, -0.9]) { pos.push(x, y + dy, z); nrm.push(0, 1, 0); wt.push(f.road, f.thorn, f.moss, f.wet); st.push(f.cob, f.pave); }
        if (k) { const a = (k - 1) * 2, b = a + 1, c = k * 2, d = c + 1; idx.push(a, b, c, c, b, d, a, c, b, c, d, b); }   // both ways round: seen from either side
      });
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nrm, 3));
      g.setAttribute('aW', new THREE.Float32BufferAttribute(wt, 4)); g.setAttribute('aS', new THREE.Float32BufferAttribute(st, 2)); g.setIndex(idx);
      const rim = new THREE.Mesh(g, r.mat); rim.matrixAutoUpdate = false; rim.name = 'land-rim'; scene.add(rim); rims.push(rim);
    }

    // ---- one square of ground ----
    function makeSquare(ci, cj, lv) {
      const n = LEVELS[lv].n, cell = SIZE / n, x0 = ci * SIZE, z0 = cj * SIZE, N1 = n + 1, HP = n + 3;
      const Hh = new Float32Array(HP * HP);
      const nearRect = R.some((r) => x0 + SIZE > r.x0 - 1 && x0 < r.x1 + 1 && z0 + SIZE > r.z0 - 1 && z0 < r.z1 + 1);
      // the ground within 16 m of a place takes that place's lamplight and shade
      const nearBy = (r) => x0 + SIZE > r.x0 - 17 && x0 < r.x1 + 17 && z0 + SIZE > r.z0 - 17 && z0 < r.z1 + 17, by = R.find(nearBy) || GLOWS.find(nearBy);
      const nv = N1 * N1 + 4 * N1, pos = new Float32Array(nv * 3), nrm = new Float32Array(nv * 3), wt = new Float32Array(nv * 4), st = new Float32Array(nv * 3), deep = nearRect ? new Uint8Array(N1 * N1) : null;
      let lo = 1e9, hi = -1e9, wetN = 0, hsMin = 1e9;
      for (let j = -1; j <= n + 1; j++) for (let i = -1; i <= n + 1; i++) {
        const x = x0 + i * cell, z = z0 + j * cell, inner = i >= 0 && j >= 0 && i <= n && j <= n;
        let y;
        if (nearRect && inRectM(x, z)) { y = drawnY(x, z); if (inner) { if (y < -50) deep[j * N1 + i] = 1; const k = (j * N1 + i) * 4; wt[k] = 0; wt[k + 1] = 0; wt[k + 2] = 0; wt[k + 3] = 0; } }
        else if (inner) { const f = field(x, z, true); y = f.h; const k = (j * N1 + i) * 4; wt[k] = f.road; wt[k + 1] = f.thorn; wt[k + 2] = f.moss; wt[k + 3] = f.wet; const s3 = (j * N1 + i) * 3; st[s3] = f.cob; st[s3 + 1] = f.pave; st[s3 + 2] = f.fen; if (f.aw > 0.47) { wetN++; if (f.wl < hsMin) hsMin = f.wl; } }
        else y = height(x, z);
        Hh[(j + 1) * HP + i + 1] = y;
        if (inner && y > -50) { if (y < lo) lo = y; if (y > hi) hi = y; }
      }
      if (lo > hi) return null;   // wholly under the place
      for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) {
        const k = (j * N1 + i) * 3, c = (j + 1) * HP + i + 1;
        pos[k] = x0 + i * cell; pos[k + 1] = Hh[c]; pos[k + 2] = z0 + j * cell;
        let a = Hh[c - 1], b = Hh[c + 1], d = Hh[c - HP], e = Hh[c + HP];
        if (a < -50) a = Hh[c]; if (b < -50) b = Hh[c]; if (d < -50) d = Hh[c]; if (e < -50) e = Hh[c];
        const nx = -(b - a) / (2 * cell), nz = -(e - d) / (2 * cell), l = Math.hypot(nx, 1, nz);
        nrm[k] = nx / l; nrm[k + 1] = 1 / l; nrm[k + 2] = nz / l;
      }
      const idx = [];
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) {
        const a = j * N1 + i, b = a + 1, c = a + N1, d = c + 1;
        if (deep && deep[a] && deep[b] && deep[c] && deep[d]) continue;   // under the place: never seen
        if (deep && (deep[a] || deep[b] || deep[c] || deep[d])) continue;
        idx.push(a, c, b, b, c, d);
      }
      // the skirt: each edge again, hung lower, so a coarser neighbour never shows a gap
      const drop = cell * 1.3 + 0.5; let v = N1 * N1;
      const hang = (list, flip) => {
        const s0 = v;
        for (const a of list) { pos[v * 3] = pos[a * 3]; pos[v * 3 + 1] = pos[a * 3 + 1] - drop; pos[v * 3 + 2] = pos[a * 3 + 2]; nrm[v * 3] = nrm[a * 3]; nrm[v * 3 + 1] = nrm[a * 3 + 1]; nrm[v * 3 + 2] = nrm[a * 3 + 2]; wt.set(wt.subarray(a * 4, a * 4 + 4), v * 4); st[v * 3] = st[a * 3]; st[v * 3 + 1] = st[a * 3 + 1]; st[v * 3 + 2] = st[a * 3 + 2]; v++; }
        for (let q = 0; q + 1 < list.length; q++) { const a = list[q], b = list[q + 1], c = s0 + q, d = s0 + q + 1; if (deep && (deep[a] || deep[b])) continue; if (flip) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d); }
      };
      const row = (j) => Array.from({ length: N1 }, (_, i) => j * N1 + i), colm = (i) => Array.from({ length: N1 }, (_, j) => j * N1 + i);
      hang(row(0), false); hang(row(n), true); hang(colm(0), true); hang(colm(n), false);
      if (!idx.length) return null;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); g.setAttribute('aW', new THREE.BufferAttribute(wt, 4)); g.setAttribute('aS', new THREE.BufferAttribute(st, 3));
      g.setIndex(new THREE.BufferAttribute(new Uint16Array(idx), 1));
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(x0 + SIZE / 2, (lo + hi) / 2 - drop / 2, z0 + SIZE / 2), Math.hypot(SIZE * 0.71, (hi - lo) / 2 + drop) + 1);
      const mesh = new THREE.Mesh(g, by ? by.mat : wildMat); mesh.matrixAutoUpdate = false; mesh.name = 'land';
      // the map's water in this square: one level sheet over it, at the lowest the water stands in the square, which
      // the land hides wherever it stands higher
      if (wetN) {
        const WB = W3D.Builder(); WB.solid = false; const y = hsMin - 0.02;
        for (const [a, b, c, d] of cutRects(x0, z0, x0 + SIZE, z0 + SIZE)) WB.quad('w', [a, y, d], [c, y, d], [c, y, b], [a, y, b], [a, d, c, b]);
        const wm = WB.build({ w: atlasWaterMat }).w; if (wm) { wm.name = 'land-water'; mesh.add(wm); mesh.water = wm; }
      }
      return mesh;
    }

    // ---- the water past the place: the lake's wide sheet, the river's ribbon; both stop at the place's edge, where its
    // own water carries on ----
    const waterMeshes = [];
    {
      const cut1 = (q, r) => {   // an upright rectangle [a..c] x [b..d], less one place's own ground: up to four pieces
        const [a, b, c, d] = q; if (c <= r.x0 || a >= r.x1 || d <= r.z0 || b >= r.z1) return [q];
        const out = [];
        if (b < r.z0) out.push([a, b, c, r.z0]); if (d > r.z1) out.push([a, r.z1, c, d]);
        const m0 = Math.max(b, r.z0), m1 = Math.min(d, r.z1);
        if (a < r.x0) out.push([a, m0, r.x0, m1]); if (c > r.x1) out.push([r.x1, m0, c, m1]);
        return out;
      };
      const cut = (a, b, c, d) => { let list = [[a, b, c, d]]; for (const r of R) list = [].concat(...list.map((q) => cut1(q, r))); return list; };
      for (const l of LAKES) {
        const WB = W3D.Builder(); WB.solid = false; const c = 4, y = l.level - 0.02;
        for (let z = Math.floor(l.bb[1] / c) * c; z < l.bb[3]; z += c) for (let x = Math.floor(l.bb[0] / c) * c; x < l.bb[2]; x += c) {
          const near = [[x, z], [x + c, z], [x, z + c], [x + c, z + c], [x + c / 2, z + c / 2]].some(([p, q]) => inPoly(l.poly, p, q) || edgeDist(l.poly, p, q) < 1.2);
          if (!near) continue;
          for (const [a, b, e, d] of cut(x, z, x + c, z + c)) WB.quad('w', [a, y, d], [e, y, d], [e, y, b], [a, y, b], [a, d, e, b]);
        }
        const mesh = WB.build({ w: W3D.waterMat(U, { water: tx(l.tex), rep: l.rep, flow: l.flow }) }).w;
        if (mesh) { mesh.name = 'land-water'; scene.add(mesh); waterMeshes.push(mesh); }
      }
      for (const r of RIVERS) {
        const WB = W3D.Builder(); WB.solid = false; const y = r.level - 0.02;
        // cross-sections every 3 m or so along the middle line, each square to the way the river runs there
        const cs = [];
        for (let i = 0; i + 1 < r.pts.length; i++) { const a = r.pts[i], b = r.pts[i + 1], len = Math.hypot(b[0] - a[0], b[1] - a[1]), k = Math.max(1, Math.round(len / 3)); for (let q = i ? 1 : 0; q <= k; q++) cs.push([lerp(a[0], b[0], q / k), lerp(a[1], b[1], q / k), lerp(a[2], b[2], q / k)]); }
        const ends = cs.map((p, i) => { const a = cs[Math.max(0, i - 1)], b = cs[Math.min(cs.length - 1, i + 1)]; let dx = b[0] - a[0], dz = b[1] - a[1]; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
          // where it leaves the place its end lies along the place's edge, so the two waters meet in a straight line
          const flat = (i === 0 || i === cs.length - 1) && Math.abs(dz) > Math.abs(dx); const nx = flat ? (dz > 0 ? -1 : 1) : -dz, nz = flat ? 0 : dx, hw = p[2] / 2 + 0.7;
          return [[p[0] - nx * hw, p[1] - nz * hw], [p[0] + nx * hw, p[1] + nz * hw]]; });
        for (let i = 0; i + 1 < ends.length; i++) { const [a, b] = ends[i], [c, d] = ends[i + 1]; const q = [[a[0], y, a[1]], [b[0], y, b[1]], [d[0], y, d[1]], [c[0], y, c[1]]];
          // wound so it faces up, whichever way the river runs
          const up = (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]) < 0;
          if (up) WB.quad('w', q[0], q[1], q[2], q[3], [a[0], a[1], b[0], c[1]]); else WB.quad('w', q[3], q[2], q[1], q[0], [a[0], c[1], b[0], a[1]]); }
        const mesh = WB.build({ w: W3D.waterMat(U, { water: tx(r.tex), rep: r.rep, flow: r.flow }) }).w;
        if (mesh) { mesh.name = 'land-water'; scene.add(mesh); waterMeshes.push(mesh); }
      }
    }

    // ---- the far hills, as the place draws its own, but round the camera wherever it goes (they don't fog: they are
    // the far edge). In the thorn wood's heavy fog they sink out of sight ----
    let hills = null;
    {
      const HB = W3D.Builder(); HB.solid = false; const TAU = Math.PI * 2;
      const ring = (Rr, hmin, hmax, f, lowC, topC, snow) => {
        const N = 120, H = (i) => hmin + (hmax - hmin) * (0.55 * vnoise((i % N) * f, 3.7) + 0.3 * vnoise((i % N) * f * 2.7, 9.1) + 0.15 * vnoise((i % N) * f * 7, 1.3));
        for (let i = 0; i < N; i++) {
          const a0 = i / N * TAU, a1 = (i + 1) / N * TAU, h0 = H(i), h1 = H(i + 1);
          const P0 = [Math.cos(a0) * Rr, -25, Math.sin(a0) * Rr], P1 = [Math.cos(a1) * Rr, -25, Math.sin(a1) * Rr], T0 = [P0[0], h0, P0[2]], T1 = [P1[0], h1, P1[2]];
          HB.tri('hills', P0, P1, T1, [[0, 0], [1, 0], [1, 1]], lowC); HB.tri('hills', P0, T1, T0, [[0, 0], [1, 1], [0, 1]], lowC);
          if (snow) { const s0 = [T0[0] * 1.001, h0 - 4, T0[2] * 1.001], s1 = [T1[0] * 1.001, h1 - 4, T1[2] * 1.001]; if (h0 > hmin + (hmax - hmin) * 0.5) HB.tri('hills', s0, s1, T1, [[0, 0], [1, 0], [1, 1]], topC); if (h1 > hmin + (hmax - hmin) * 0.5) HB.tri('hills', s0, T1, T0, [[0, 0], [1, 1], [0, 1]], topC); }
        }
      };
      ring(330, 30, 100, 0.13, [0.13, 0.13, 0.24], [0.36, 0.37, 0.52], true);
      ring(210, 8, 30, 0.31, [0.045, 0.06, 0.09], null, false);
      hills = HB.build({ hills: W3D.mat(U, { lit: 0, nofog: true, side: THREE.DoubleSide, glow: 0 }) }).hills;
      hills.matrixAutoUpdate = true; hills.frustumCulled = false; hills.name = 'land-hills'; scene.add(hills);
    }
    const sky = Z.sky;

    // ---- what stands on a square: its trees and its herbs, worked out from its place on the map alone ----
    const TS = L.trees.step, HS = L.herbs.step, lists = new Map();
    const freeOfClearing = (x, z) => !CLEAR.some((c) => Math.hypot(x - c.x, z - c.z) < c.r);
    function listFor(ci, cj) {
      const key = ci + ',' + cj; let q = lists.get(key); if (q) return q;
      q = { trees: [], herbs: [], reeds: [] };
      const x0 = ci * SIZE, z0 = cj * SIZE, x1 = x0 + SIZE, z1 = z0 + SIZE;
      for (let gz = Math.floor(z0 / TS) - 1; gz <= Math.floor(z1 / TS); gz++) for (let gx = Math.floor(x0 / TS) - 1; gx <= Math.floor(x1 / TS); gx++) {
        const x = (gx + 0.12 + 0.76 * h2(gx, gz, 1)) * TS, z = (gz + 0.12 + 0.76 * h2(gx, gz, 2)) * TS;
        if (x < x0 || x >= x1 || z < z0 || z >= z1 || dOut(x, z) < 0.6) continue;
        const tk = thornK(x, z), rim = rimD(x, z);
        // the woods thin and thicken; the thorns stand in clumps with clearings between; the land's rim is a thick hedge
        let dens = rim < 14 ? 1 : lerp(L.trees.woods * (0.55 + 0.45 * ss(0.3, 0.55, vnoise(x / 31 + 2.2, z / 31 + 6.1))), L.trees.thorn * (0.08 + 0.92 * ss(0.4, 0.6, vnoise(x / 36 + 7.7, z / 36 + 1.3))), tk);
        const f = field(x, z, false); if (f.re < 1.7 || f.sd < 1.8) continue;
        // by the map: few trees on its open grass and in the fen (where they stand bare), firs in its pine forest
        const fen = f.fen, pine = f.pine; if (rim >= 14) dens *= (1 - 0.55 * f.open * (1 - tk)) * (1 - 0.7 * fen);
        if (h2(gx, gz, 3) > dens || !freeOfClearing(x, z)) continue;
        const r = h2(gx, gz, 4), r2 = h2(gx, gz, 5);
        // kinds as the place engine names them: 0 a leafy tree, 1 a fir, 2 a bare thorn
        const kind = r < Math.max(tk * L.trees.thornShare, fen * 0.8) ? 2 : (r2 < (tk > 0.5 ? 0.25 : lerp(L.trees.firShare, 0.85, pine)) ? 1 : 0);
        const size = kind === 2 ? 1.15 + 0.95 * r2 * r2 + 0.25 * h2(gx, gz, 6) : 0.8 + 0.7 * r2;
        q.trees.push({ x, z, y: f.h, size, kind, seed: (gx * 73 + gz * 151) & 0xffff, r: 0.3 * size });
      }
      for (let gz = Math.floor(z0 / HS); gz <= Math.floor(z1 / HS); gz++) for (let gx = Math.floor(x0 / HS); gx <= Math.floor(x1 / HS); gx++) {
        const x = (gx + 0.15 + 0.7 * h2(gx, gz, 11)) * HS, z = (gz + 0.15 + 0.7 * h2(gx, gz, 12)) * HS;
        if (x < x0 || x >= x1 || z < z0 || z >= z1 || dOut(x, z) < L.herbs.away || rimD(x, z) < 16) continue;
        const tk = thornK(x, z); if (h2(gx, gz, 13) > lerp(L.herbs.woods, L.herbs.thorn, tk) || !freeOfClearing(x, z)) continue;
        const f = field(x, z, false); if (f.re < 0.3 || f.sd < 1.4) continue;
        if (q.trees.some((t) => Math.hypot(t.x - x, t.z - z) < t.r + 0.9)) continue;
        const kinds = L.herbs.kinds, kind = kinds[Math.floor(h2(gx, gz, 14) * kinds.length) % kinds.length];
        q.herbs.push({ id: gx + ',' + gz, x, z, y: f.h, kind: kind.id, turn: h2(gx, gz, 15) * 6.283 });
      }
      // reeds along the map's water: in the fen thick, by a lake's shore a few
      if (AT) { const RS = 2.1; for (let gz = Math.floor(z0 / RS); gz <= Math.floor(z1 / RS); gz++) for (let gx = Math.floor(x0 / RS); gx <= Math.floor(x1 / RS); gx++) {
        const x = (gx + 0.1 + 0.8 * h2(gx, gz, 21)) * RS, z = (gz + 0.1 + 0.8 * h2(gx, gz, 22)) * RS;
        if (x < x0 || x >= x1 || z < z0 || z >= z1) continue;
        const f = field(x, z, false); if (f.aw < 0.3 || f.aw > 0.6 || f.re < 1.4 || h2(gx, gz, 23) > 0.2 + 0.5 * f.fen || inRectM(x, z)) continue;
        q.reeds.push({ x, z, y: Math.max(f.h, f.wl - 0.1), s: 0.75 + 0.7 * h2(gx, gz, 24), turn: h2(gx, gz, 25) * 3.14 });
      } }
      lists.set(key, q); return q;
    }

    // ---- pockets: things built once that stand on the land (the first test has one: a ring of standing stones) ----
    const SOLID = [];   // [x, z, r]: what she walks round, besides the trees
    const BLOCK = [];   // and what the fair kit sets down: { x, z, r } round, or { x, z, w, d, a } a box turned by a
    {
      const rockMat = W3D.mat(U, { map: tx(GM.rock), rep: 1.8, cut: true, shade: 0, glow: 0, vary: 0.25 });
      const PB = W3D.Builder(); PB.solid = false; let any = false;
      for (const s of L.stones || []) {
        const rr = (k) => h2(Math.round(s.x * 10), Math.round(s.z * 10), k);
        const y = height(s.x, s.z) - 0.25, w = (s.w || 0.9) * (0.85 + 0.3 * rr(1)), hgt = (s.h || 2.4) * (0.8 + 0.4 * rr(2));
        PB.box('rock', s.x, y, s.z, w, hgt, w * 0.6, rr(3) * 3.1, [0.8 + 0.2 * rr(4), 0.8 + 0.2 * rr(4), 0.85 + 0.15 * rr(5)]);
        if (s.lintel) PB.box('rock', s.x, y + hgt, s.z, w * 2.6, 0.45, w * 0.7, s.lintel, [0.85, 0.85, 0.9]);
        SOLID.push([s.x, s.z, w * 0.62]); any = true;
      }
      if (any) { const mesh = PB.build({ rock: rockMat }).rock; mesh.name = 'land-stones'; scene.add(mesh); waterMeshes.push(mesh); }
    }

    // ---- herbs: a small glowing sprig, three crossed cards, the picture painted here ----
    const sprig = (petal, heart) => {
      const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d');
      g.lineCap = 'round';
      const stem = (x0, x1, top, wdt) => { g.strokeStyle = '#3f6b52'; g.lineWidth = wdt; g.beginPath(); g.moveTo(x0, 128); g.quadraticCurveTo(x0 + (x1 - x0) * 0.2, 128 - (128 - top) * 0.6, x1, top); g.stroke(); };
      const leaf = (x, y, a) => { g.save(); g.translate(x, y); g.rotate(a); g.fillStyle = '#4f8a66'; g.beginPath(); g.ellipse(0, 0, 13, 4.5, 0, 0, 6.3); g.fill(); g.restore(); };
      const bloom = (x, y, r) => { g.fillStyle = petal; for (let i = 0; i < 6; i++) { const a = i / 6 * 6.283; g.beginPath(); g.ellipse(x + Math.cos(a) * r * 0.75, y + Math.sin(a) * r * 0.75, r * 0.62, r * 0.4, a, 0, 6.3); g.fill(); } g.fillStyle = heart; g.beginPath(); g.arc(x, y, r * 0.42, 0, 6.3); g.fill(); };
      stem(64, 62, 30, 5); stem(60, 30, 52, 4); stem(68, 98, 46, 4);
      leaf(46, 96, -0.7); leaf(84, 92, 0.7); leaf(52, 70, -0.4); leaf(78, 66, 0.5);
      bloom(62, 24, 17); bloom(28, 46, 13); bloom(100, 40, 13);
      return W3D.canvasTex(c, false);
    };
    const herbMats = {};
    for (const k of L.herbs.kinds) herbMats[k.id] = W3D.mat(U, { map: sprig(k.petal, k.heart), alphaTest: 0.35, side: THREE.DoubleSide, noflip: true, lit: 0.3, glow: 0, shade: 0 });
    // (and the reeds: pale stalks with dark heads, painted here)
    if (AT) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'); g.lineCap = 'round';
      for (let i = 0; i < 17; i++) { const x0 = 14 + i * 6.2 + (h2(i, 1, 31) - 0.5) * 5, top = 14 + h2(i, 2, 31) * 60, lean = (h2(i, 3, 31) - 0.5) * 34;
        g.strokeStyle = i % 3 ? '#465c4a' : '#5f7355'; g.lineWidth = 2.2 + h2(i, 4, 31) * 1.6; g.beginPath(); g.moveTo(x0, 128); g.quadraticCurveTo(x0 + lean * 0.2, 70, x0 + lean, top); g.stroke();
        if (i % 2 === 0) { g.strokeStyle = '#33271d'; g.lineWidth = 5; g.beginPath(); g.moveTo(x0 + lean * 0.86, top + 16); g.lineTo(x0 + lean, top + 2); g.stroke(); } }
      herbMats.reed = W3D.mat(U, { map: W3D.canvasTex(c, false), alphaTest: 0.4, side: THREE.DoubleSide, noflip: true, lit: 0.09, glow: 0, shade: 0 }); }
    const picked = new Set(), bag = {};
    function herbMeshes(q) {
      const HB = W3D.Builder(); HB.solid = false; let any = false;
      for (const h of q.herbs) {
        if (picked.has(h.id)) continue; any = true;
        for (let i = 0; i < 3; i++) {
          const a = h.turn + i * 1.047, dx = Math.cos(a) * 0.3, dz = Math.sin(a) * 0.3, y0 = h.y - 0.03, y1 = h.y + 0.62;
          HB.quad(h.kind, [h.x - dx, y0, h.z - dz], [h.x + dx, y0, h.z + dz], [h.x + dx, y1, h.z + dz], [h.x - dx, y1, h.z - dz], [0, 0, 1, 1]);
        }
      }
      for (const r of q.reeds) { any = true; for (let i = 0; i < 2; i++) { const a = r.turn + i * 1.571, dx = Math.cos(a) * 0.55 * r.s, dz = Math.sin(a) * 0.55 * r.s, y1 = r.y + 1.5 * r.s; HB.quad('reed', [r.x - dx, r.y, r.z - dz], [r.x + dx, r.y, r.z + dz], [r.x + dx, y1, r.z + dz], [r.x - dx, y1, r.z - dz], [0, 0, 1, 1]); } }
      if (!any) return [];
      const out = HB.build(herbMats), list = [];
      for (const k in out) { out[k].name = 'land-herbs'; scene.add(out[k]); list.push(out[k]); }
      return list;
    }

    // ---- where her feet can stand on the land ----
    function landWalkable(x, z) {
      if (rimD(x, z) < 6) return false;
      if (field(x, z, false).sd < 0.5) return false;
      for (const s of SOLID) if (Math.hypot(x - s[0], z - s[1]) < s[2]) return false;
      for (const b of BLOCK) { const dx = x - b.x, dz = z - b.z; if (b.r != null) { if (dx * dx + dz * dz < b.r * b.r) return false; } else if (Math.abs(dx) < b.w + b.d && Math.abs(dz) < b.w + b.d) { const c = Math.cos(b.a), sn = Math.sin(b.a); if (Math.abs(dx * c - dz * sn) < b.w && Math.abs(dx * sn + dz * c) < b.d) return false; } }
      const ci = Math.floor(x / SIZE), cj = Math.floor(z / SIZE), fx = x - ci * SIZE, fz = z - cj * SIZE;
      for (let dj = fz < 1.2 ? -1 : 0; dj <= (fz > SIZE - 1.2 ? 1 : 0); dj++) for (let di = fx < 1.2 ? -1 : 0; di <= (fx > SIZE - 1.2 ? 1 : 0); di++)
        for (const t of listFor(ci + di, cj + dj).trees) if (Math.abs(t.x - x) < t.r && Math.hypot(t.x - x, t.z - z) < t.r) return false;
      return true;
    }
    const inRectP = (px, py) => inRectM(M.x(px), M.z(py));
    Z.walkable = (px, py) => (inRectP(px, py) ? place0.walkable(px, py) : landWalkable(M.x(px), M.z(py)));
    Z.walkH = (px, py) => (inRectP(px, py) ? place0.walkH(px, py) : height(M.x(px), M.z(py)));
    Z.terrain = (px, py) => (inRectP(px, py) ? place0.terrain(px, py) : height(M.x(px), M.z(py)));

    // ---- each frame: the squares, trees and herbs round her; the sky and hills round the camera; the fog ----
    const squares = new Map();   // key -> { ci, cj, lv, mesh, trees, herbs }
    const TIMES = {};   // how long each kind of piece takes to make: { kind: [thousandths of a second in all, how many] }
    let queue = [], made = 0, region = null, regionWant = null, regionT = 0, farMake = 0, lastT = 0, frameMs = 10, frameN = 0;
    const SKY0 = [0.62, 0.6, 0.7], MOON0 = [0.42, 0.43, 0.56];   // the place engine's own sky and moon
    const NW = L.night.woods, NT = L.night.thorn, NF = L.night.fen || null, col = new THREE.Color();
    const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
    const nearestD = (ci, cj, x, z) => Math.hypot(Math.max(ci * SIZE - x, 0, x - (ci + 1) * SIZE), Math.max(cj * SIZE - z, 0, z - (cj + 1) * SIZE));
    const levelFor = (d, cur) => { for (let k = 0; k < LEVELS.length; k++) if (d < LEVELS[k].d * (cur >= 0 && cur <= k ? 1.12 : 0.92)) return k; return LEVELS.length - 1; };
    function drop(s) {
      if (s.mesh) { scene.remove(s.mesh); s.mesh.geometry.dispose(); if (s.mesh.water) s.mesh.water.geometry.dispose(); s.mesh = null; }
      if (s.trees) { P.unplant(s.trees); s.trees = null; }
      if (s.herbs) { for (const m of s.herbs) { scene.remove(m); m.geometry.dispose(); } s.herbs = null; }
    }
    function landUpdate(cam, io) {
      const guideOn = U.uFogNear.value > 5000;
      // the fog: each place's own in and near it; past it thicker in the woods, thickest (and paler) in the thorns
      const dN = dOut(io.x, io.z), near = NR, kw = ss(4, 40, dN), tk = thornK(io.x, io.z), pn = near.night;
      if (!guideOn) {
        // (the wild's own: the woods', the thorn country's, and the fen's where the map has fen)
        const fk = AT && NF ? atlasAt(io.x, io.z).fen : 0, NFq = NF || NT;
        U.uFogNear.value = lerp(pn.near, lerp(lerp(NW.near, NT.near, tk), NFq.near, fk), kw); U.uFogFar.value = lerp(pn.far, lerp(lerp(NW.far, NT.far, tk), NFq.far, fk), kw);
        U.uFog.value.setRGB(...mix3(pn.fog, mix3(mix3(NW.fog, NT.fog, tk), NFq.fog, fk), kw));
        U.uSky.value.setRGB(...mix3(pn.sky, mix3(mix3(SKY0, NT.sky, tk), NFq.sky || SKY0, fk), kw)); U.uMoon.value.setRGB(...mix3(pn.moon, mix3(mix3(MOON0, NT.moon, tk), NFq.moon || MOON0, fk), kw));
      }
      // a flat with a night of its own (the camp): the fog clears toward it
      let flat = null;
      for (const f of FLATS) { const dd = Math.hypot(io.x - f.x, io.z - f.z); if (dd < f.r) flat = f; if (!f.night || guideOn) continue; const kc = 1 - ss(f.r * 0.8, f.r + 32, dd); if (kc <= 0) continue;
        U.uFogNear.value = lerp(U.uFogNear.value, f.night.near, kc); U.uFogFar.value = lerp(U.uFogFar.value, f.night.far, kc); U.uFog.value.lerp(col.setRGB(...f.night.fog), kc); }
      const fogFar = guideOn ? 115 : U.uFogFar.value;
      if (sky) { sky.position.copy(cam.position); sky.updateMatrix(); }
      // the far hills sink out of sight where the fog is heavy
      hills.position.set(cam.position.x, -110 * (1 - ss(62, 95, fogFar)) + (AT ? height(io.x, io.z) - L.level : 0), cam.position.z);   // (they rise and fall with the ground she stands on)
      // which squares are wanted, and at what detail
      // (how far out land is made follows the fog, but when the fog draws back quickly, as on leaving a town for the woods,
      // it grows only 10 m a second: the new ring of land is made over a few seconds, not all in one)
      const nowT = performance.now(), fms = lastT ? Math.min(100, nowT - lastT) : 16; lastT = nowT; frameMs = frameMs * 0.9 + fms * 0.1; frameN++;
      farMake = TEST || !farMake || fogFar <= farMake ? fogFar : Math.min(fogFar, farMake + 10 * fms / 1000);
      const R = farMake + 46, RT = farMake + 14, RH = Math.min(farMake, 70);
      const c0 = Math.floor((io.x - R) / SIZE), c1 = Math.floor((io.x + R) / SIZE), r0 = Math.floor((io.z - R) / SIZE), r1 = Math.floor((io.z + R) / SIZE);
      const want = [];
      for (let cj = r0; cj <= r1; cj++) for (let ci = c0; ci <= c1; ci++) {
        // nothing is made past the land's rim but a ring of ground one square deep, lost in the fog
        if (rimD((ci + 0.5) * SIZE, (cj + 0.5) * SIZE) < -SIZE * 1.6) continue;
        const d = nearestD(ci, cj, io.x, io.z); if (d > R) continue;
        const key = ci + ',' + cj; let s = squares.get(key); if (!s) { s = { ci, cj, lv: -1, mesh: null, trees: null, herbs: null, none: false }; squares.set(key, s); }
        s.d = d; const lv = levelFor(d, s.lv);
        if (lv !== s.lv && !s.none) want.push({ s, d, job: 'ground', lv });
        if (d < RT && !s.trees) want.push({ s, d: d + 8, job: 'trees' });
        if (d < RH && !s.herbs) want.push({ s, d: d + 4, job: 'herbs' });
        if (s.trees && d > RT + 26) { P.unplant(s.trees); s.trees = null; }
      }
      for (const [key, s] of squares) { const d = nearestD(s.ci, s.cj, io.x, io.z); if (d > R + 40) { drop(s); squares.delete(key); } else if (s.mesh) s.mesh.visible = d < fogFar + 8 || guideOn; }
      want.sort((a, b) => a.d - b.d); queue = want;
      // make what is wanted, nearest first, for a few thousandths of a second a frame (so walking never stutters)
      // (when frames are already slow, under about 54 a second, as in the Flipbook look on a phone: less is made a
      // frame, and only on one frame in three, unless the piece wanted is bare ground close by)
      const slow = frameMs > 18.5 && !TEST && made >= 12, rest = slow && frameN % 3 !== 0 && !(queue.length && queue[0].job === 'ground' && !queue[0].s.mesh && queue[0].d < 60);
      const t0 = performance.now(), budget = TEST ? 400 : made < 12 ? 30 : slow ? 2 : 5;
      while (queue.length && !rest && performance.now() - t0 < budget) {
        const w = queue.shift(), s = w.s, t1 = performance.now();
        if (w.job === 'ground') {
          const mesh = makeSquare(s.ci, s.cj, w.lv);
          if (s.mesh) { scene.remove(s.mesh); s.mesh.geometry.dispose(); if (s.mesh.water) s.mesh.water.geometry.dispose(); }
          s.mesh = mesh; s.lv = w.lv; if (mesh) scene.add(mesh); else s.none = true;   // wholly under the place: nothing to draw, ever
        } else if (w.job === 'trees') {
          const q = listFor(s.ci, s.cj);
          s.trees = q.trees.length ? P.plantPatch(q.trees.map((t) => [P.M.px(t.x), P.M.py(t.z), t.size, t.kind, t.seed, t.kind !== 2, t.y])) : [];
        } else { s.herbs = herbMeshes(listFor(s.ci, s.cj)); }
        made++; const tm = TIMES[w.job === 'ground' ? 'ground' + LEVELS[w.lv].n : w.job] || (TIMES[w.job === 'ground' ? 'ground' + LEVELS[w.lv].n : w.job] = [0, 0]); tm[0] += performance.now() - t1; tm[1]++;
      }
      // a herb she walks into is picked
      const ci = Math.floor(io.x / SIZE), cj = Math.floor(io.z / SIZE);
      for (let dj = -1; dj <= 1; dj++) for (let di = -1; di <= 1; di++) {
        const s = squares.get((ci + di) + ',' + (cj + dj)); if (!s || !s.herbs) continue;
        const q = listFor(s.ci, s.cj);
        for (const h of q.herbs) if (!picked.has(h.id) && Math.hypot(h.x - io.x, h.z - io.z) < 0.85) {
          picked.add(h.id); bag[h.kind] = (bag[h.kind] || 0) + 1;
          for (const m of s.herbs) { scene.remove(m); m.geometry.dispose(); } s.herbs = herbMeshes(q);
          if (W3D.landEvents && W3D.landEvents.herb) W3D.landEvents.herb(L.herbs.kinds.find((k) => k.id === h.kind), bag[h.kind], bag);
        }
      }
      // where she is, by name: told once she has been there a moment
      const now = flat && flat.name ? flat.name : dN < 10 ? near.name : L.nameAt ? L.nameAt(io.x, io.z, field(io.x, io.z, true)) : tk > 0.5 ? L.names.thorn : L.names.woods;
      if (now !== regionWant) { regionWant = now; regionT = performance.now(); }
      else if (now !== region && (region === null || performance.now() - regionT > 900 || TEST)) { const was = region; region = now; if (W3D.landEvents && W3D.landEvents.region) W3D.landEvents.region(now, was); }
    }
    Z.update = (t, cam, io) => { place0.update(t, cam, io); if (cam && io) landUpdate(cam, io); };
    Z.dispose = () => { for (const s of squares.values()) drop(s); squares.clear(); for (const m of waterMeshes.concat(rims)) { scene.remove(m); m.geometry.dispose(); } scene.remove(hills); hills.geometry.dispose(); wildMat.dispose(); for (const r of R) r.mat.dispose(); place0.dispose(); };

    // for the page and the checks
    G.__land = Z.land = {
      height, field: (x, z) => Object.assign({}, field(x, z, true)), walkable: landWalkable, thornK, bag, picked, region: () => region,
      rect: [R[0].x0, R[0].z0, R[0].x1, R[0].z1], rects: R.map((r) => ({ name: r.name, x0: r.x0, z0: r.z0, x1: r.x1, z1: r.z1 })), bounds: L.bounds,
      times() { const o = {}; for (const k in TIMES) o[k] = +(TIMES[k][0] / TIMES[k][1]).toFixed(1); return o; },
      pending: () => queue.length,
      // everything a map of the land needs to draw it (engine/land/minimap.js)
      mapData: () => ({ bounds: L.bounds, roads: ROADS.map((r) => ({ pts: r.pts, w: r.w })), rivers: RIVERS.map((r) => ({ pts: r.pts })), lakes: LAKES.map((l) => l.poly),
        places: Z.parts.map((p) => ({ name: p.name, x0: p.x0, z0: p.z0, x1: p.x1, z1: p.z1, water: (p.P.place.water || []).map((w) => w.poly.map(([x, y]) => [p.ox + p.P.M.x(x), p.oz + p.P.M.z(y)])) })),
        flats: FLATS.map((f) => ({ name: f.name, x: f.x, z: f.z, r: f.r })), thornK,
        // what a spot is, 0 to 1 each: water (the map's or drawn by hand), fen, thorn country, open grass, pine forest; and rim, metres inside the edge of the land she can walk
        kind: (x, z) => { const f = field(x, z, false); return { water: f.sd < 0 ? 1 : 0, fen: f.fen, thorn: thornK(x, z) * (1 - f.fen), open: f.open, pine: f.pine, rim: rimD(x, z) }; },
        wide: L.longRoad ? box(L.longRoad.pts.concat([[BX0, BZ0], [BX1, BZ1]]), L.longRoad.half) : L.bounds,
        longRoad: L.longRoad ? { pts: L.longRoad.pts, half: L.longRoad.half, name: L.longRoad.name } : null }),
      atlas: (x, z) => (AT ? Object.assign({}, atlasAt(x, z)) : null), rim: rimD, wet: WET,
      roadList: (L.roads || []).map((r) => ({ name: r.name || null, to: r.to || null, pts: r.pts })),
      addGlow(a) { a.mat = makeGroundMat(a); GLOWS.push(a); }, addBlockers(list) { for (const b of list) BLOCK.push(b); },
      // the nearest herb still on the ground to a spot, among the squares made so far (for the checks)
      nearestHerb(x, z) { let best = null, bd = 1e9; for (const sq of squares.values()) { if (!sq.herbs) continue; for (const h of listFor(sq.ci, sq.cj).herbs) { const d = Math.hypot(h.x - x, h.z - z); if (!picked.has(h.id) && d < bd) { bd = d; best = h; } } } return best; },
      waiting: () => queue.length,
      numbers() { let g = 0, t = 0, h = 0, tr = 0; for (const s of squares.values()) { if (s.mesh) g++; if (s.trees) { t++; tr += listFor(s.ci, s.cj).trees.length; } if (s.herbs && s.herbs.length) h += listFor(s.ci, s.cj).herbs.filter((q) => !picked.has(q.id)).length; } return { squares: g, treeSquares: t, trees: tr, herbs: h, fogFar: Math.round(U.uFogFar.value) }; },
    };
    return Z;
  };
})(window);
