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
      return { part: p, x0: p.x0, z0: p.z0, x1: p.x1, z1: p.z1, nx, nz, terr: p.terrain, name: p.name, night: p.night,
        eTop: edge(nx, (i) => p.terrain(X(i), p.z0 + e)), eBot: edge(nx, (i) => p.terrain(X(i), p.z1 - e)),
        eLeft: edge(nz, (i) => p.terrain(p.x0 + e, Zc(i))), eRight: edge(nz, (i) => p.terrain(p.x1 - e, Zc(i))) };
    });
    const rectAt = (x, z) => { for (const r of R) if (x >= r.x0 && x <= r.x1 && z >= r.z0 && z <= r.z1) return r; return null; };
    const inRectM = (x, z) => rectAt(x, z) !== null;
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
    const ROADS = (L.roads || []).map((r) => ({ pts: r.pts, w: r.w || 3.4, stone: r.stone || null, from: r.pts[0], b: box(r.pts, 14) }));
    const RIVERS = (L.rivers || []).map((r) => ({ pts: r.pts, level: r.level, bed: r.bed, tex: r.tex, rep: r.rep, flow: r.flow, b: box(r.pts, 26) }));
    const LAKES = (L.lakes || []).map((l) => ({ poly: l.poly, level: l.level, bed: l.bed, tex: l.tex, rep: l.rep, flow: l.flow, b: box(l.poly, 16), bb: box(l.poly, 0) }));
    const CLEAR = L.clearings || [];
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
    let roadStone = null;   // the nearest road, if it carries a town's stone (paving or cobbles) out from its first point: set by roadEdge
    function roadEdge(x, z) {
      let best = 1e9; roadStone = null;
      for (const r of ROADS) {
        if (x < r.b[0] || x > r.b[2] || z < r.b[1] || z > r.b[3]) continue;
        for (let i = 0; i + 1 < r.pts.length; i++) { const d = segDist(x, z, r.pts[i][0], r.pts[i][1], r.pts[i + 1][0], r.pts[i + 1][1]) - r.w / 2; if (d < best) { best = d; roadStone = r.stone ? r : null; } }
      }
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

    // ---- the rules: a height and a kind of ground for any spot past the place ----
    // F: what field() fills in. h the height; road, thorn, moss, wet 0 to 1 for the ground's look
    const F = { h: 0, road: 0, thorn: 0, moss: 0, wet: 0, cob: 0, pave: 0, sd: 1e9, re: 1e9 };
    function field(x, z, want) {
      const tk = thornK(x, z), re = roadEdge(x, z), stone = roadStone, rw = 1 - ss(-0.5, 1.4, re), calm = 1 - ss(0, 7, re);
      // rolling ground: a slow swell, hummocks, and small bumps; gentler along a road, a little wilder in the thorns
      const amp = lerp(L.roll[0], L.roll[1], tk) * (1 - 0.72 * calm);
      let h = L.level + (vnoise(x / 150 + 3.1, z / 150 + 8.7) - 0.5) * 2.6 + ((vnoise(x / 41 + 11.3, z / 41 + 2.9) - 0.5) * 1.9 + (vnoise(x / 13 + 5.5, z / 13 + 1.7) - 0.5) * 0.55 + (vnoise(x / 4.1, z / 4.1) - 0.5) * 0.13) * amp;
      // water: the banks stand a little above it, and the bed drops away inside it
      const w = water(x, z), sd = w.sd;
      if (sd < 14) { const low = w.level + 0.45 - h; if (low > 0) h += low * (1 - ss(4, 14, sd)); if (sd < 0.4) h = lerp(w.bed, h, ss(-1.4, 0.4, sd)); }   // (a steep bank, as the town's own water has)
      // meeting the place: its own edge height at the edge, the wild's by 28 m out
      const d = dOut(x, z);
      F.h = d < 28 ? lerp(hEdge(NR, x, z), h, ss(0, 28, d)) : h;
      F.sd = sd; F.re = re;
      if (want) {
        F.road = rw;
        // a road out of town keeps the town's stone underfoot for its first steps, then wears down to earth
        const sk = stone ? rw * (1 - ss(3, 24, Math.hypot(x - stone.from[0], z - stone.from[1]))) : 0; F.cob = stone && stone.stone === 'cob' ? sk : 0; F.pave = stone && stone.stone === 'pave' ? sk : 0;
        F.thorn = tk;
        F.moss = tk * ss(0.52, 0.7, vnoise(x / 23 + 9.9, z / 23 + 4.4)) * (1 - rw);
        F.wet = 1 - ss(0, 5, Math.max(sd, 0));
      }
      return F;
    }
    const height = (x, z) => field(x, z, false).h;
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
    // (near a place the ground also takes that place's lamplight and shade, fading out over 16 m: r is that place)
    const makeGroundMat = (r) => new THREE.ShaderMaterial({
      uniforms: Object.assign({}, r ? r.part.P.U : U, {
        tCob: { value: tx(GM.cob) }, tPave: { value: tx(GM.pave) }, uRepS: { value: new THREE.Vector2(1 / GM.repStone[0], 1 / GM.repStone[1]) },
        tGrass: { value: tx(GM.grass) }, tBram: { value: tx(GM.bramble) }, tMoss: { value: tx(GM.moss) }, tDirt: { value: tx(GM.dirt) }, tRock: { value: tx(GM.rock) },
        uRepL: { value: new THREE.Vector4(1 / GM.rep[0], 1 / GM.rep[1], 1 / GM.rep[2], 1 / GM.rep[3]) },
        uGrassTint: { value: new THREE.Vector3(...GM.grassTint) }, uBramTint: { value: new THREE.Vector3(...GM.brambleTint) }, uMossTint: { value: new THREE.Vector3(...GM.mossTint) }, uDirtTint: { value: new THREE.Vector3(...GM.dirtTint) },
        uRect: { value: r ? new THREE.Vector4(r.x0, r.z0, r.x1, r.z1) : new THREE.Vector4(0, 0, 0, 0) }, uWildShade: { value: new THREE.Vector2(L.shade[0], L.shade[1]) },
        uRep: { value: new THREE.Vector2(1, 1) }, uTint: { value: new THREE.Color(0xffffff) }, uEmis: { value: new THREE.Color(0) }, uLit: { value: 1 }, uGlowUse: { value: 1 }, uSpec: { value: 0 }, uShadeK: { value: 1 },
      }),
      vertexShader: `attribute vec4 aW; attribute vec2 aS; varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying vec3 vCol; varying vec4 vWt; varying vec2 vSt;
        void main() { vW = position; vN = normal; vUv = position.xz; vCol = vec3(1.0); vWt = aW; vSt = aS; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.0); }`,
      fragmentShader: W3D.GLSL.F + `
        uniform sampler2D tGrass, tBram, tMoss, tDirt, tRock; uniform vec4 uRepL, uRect; uniform vec3 uGrassTint, uBramTint, uMossTint, uDirtTint; uniform vec2 uWildShade; varying vec4 vWt; uniform sampler2D tCob, tPave; uniform vec2 uRepS; varying vec2 vSt;
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
      const by = R.find((r) => x0 + SIZE > r.x0 - 17 && x0 < r.x1 + 17 && z0 + SIZE > r.z0 - 17 && z0 < r.z1 + 17);
      const nv = N1 * N1 + 4 * N1, pos = new Float32Array(nv * 3), nrm = new Float32Array(nv * 3), wt = new Float32Array(nv * 4), st = new Float32Array(nv * 2), deep = nearRect ? new Uint8Array(N1 * N1) : null;
      let lo = 1e9, hi = -1e9;
      for (let j = -1; j <= n + 1; j++) for (let i = -1; i <= n + 1; i++) {
        const x = x0 + i * cell, z = z0 + j * cell, inner = i >= 0 && j >= 0 && i <= n && j <= n;
        let y;
        if (nearRect && inRectM(x, z)) { y = drawnY(x, z); if (inner) { if (y < -50) deep[j * N1 + i] = 1; const k = (j * N1 + i) * 4; wt[k] = 0; wt[k + 1] = 0; wt[k + 2] = 0; wt[k + 3] = 0; } }
        else if (inner) { const f = field(x, z, true); y = f.h; const k = (j * N1 + i) * 4; wt[k] = f.road; wt[k + 1] = f.thorn; wt[k + 2] = f.moss; wt[k + 3] = f.wet; st[k / 2] = f.cob; st[k / 2 + 1] = f.pave; }
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
        for (const a of list) { pos[v * 3] = pos[a * 3]; pos[v * 3 + 1] = pos[a * 3 + 1] - drop; pos[v * 3 + 2] = pos[a * 3 + 2]; nrm[v * 3] = nrm[a * 3]; nrm[v * 3 + 1] = nrm[a * 3 + 1]; nrm[v * 3 + 2] = nrm[a * 3 + 2]; wt.set(wt.subarray(a * 4, a * 4 + 4), v * 4); st[v * 2] = st[a * 2]; st[v * 2 + 1] = st[a * 2 + 1]; v++; }
        for (let q = 0; q + 1 < list.length; q++) { const a = list[q], b = list[q + 1], c = s0 + q, d = s0 + q + 1; if (deep && (deep[a] || deep[b])) continue; if (flip) idx.push(a, b, c, b, d, c); else idx.push(a, c, b, b, c, d); }
      };
      const row = (j) => Array.from({ length: N1 }, (_, i) => j * N1 + i), colm = (i) => Array.from({ length: N1 }, (_, j) => j * N1 + i);
      hang(row(0), false); hang(row(n), true); hang(colm(0), true); hang(colm(n), false);
      if (!idx.length) return null;
      const g = new THREE.BufferGeometry();
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nrm, 3)); g.setAttribute('aW', new THREE.BufferAttribute(wt, 4)); g.setAttribute('aS', new THREE.BufferAttribute(st, 2));
      g.setIndex(new THREE.BufferAttribute(new Uint16Array(idx), 1));
      g.boundingSphere = new THREE.Sphere(new THREE.Vector3(x0 + SIZE / 2, (lo + hi) / 2 - drop / 2, z0 + SIZE / 2), Math.hypot(SIZE * 0.71, (hi - lo) / 2 + drop) + 1);
      const mesh = new THREE.Mesh(g, by ? by.mat : wildMat); mesh.matrixAutoUpdate = false; mesh.name = 'land';
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
      q = { trees: [], herbs: [] };
      const x0 = ci * SIZE, z0 = cj * SIZE, x1 = x0 + SIZE, z1 = z0 + SIZE;
      for (let gz = Math.floor(z0 / TS) - 1; gz <= Math.floor(z1 / TS); gz++) for (let gx = Math.floor(x0 / TS) - 1; gx <= Math.floor(x1 / TS); gx++) {
        const x = (gx + 0.12 + 0.76 * h2(gx, gz, 1)) * TS, z = (gz + 0.12 + 0.76 * h2(gx, gz, 2)) * TS;
        if (x < x0 || x >= x1 || z < z0 || z >= z1 || dOut(x, z) < 0.6) continue;
        const tk = thornK(x, z), rim = Math.min(x - BX0, BX1 - x, z - BZ0, BZ1 - z);
        // the woods thin and thicken; the thorns stand in clumps with clearings between; the land's rim is a thick hedge
        const dens = rim < 14 ? 1 : lerp(L.trees.woods * (0.55 + 0.45 * ss(0.3, 0.55, vnoise(x / 31 + 2.2, z / 31 + 6.1))), L.trees.thorn * (0.08 + 0.92 * ss(0.4, 0.6, vnoise(x / 36 + 7.7, z / 36 + 1.3))), tk);
        if (h2(gx, gz, 3) > dens || !freeOfClearing(x, z)) continue;
        const f = field(x, z, false); if (f.re < 1.7 || f.sd < 1.8) continue;
        const r = h2(gx, gz, 4), r2 = h2(gx, gz, 5);
        // kinds as the place engine names them: 0 a leafy tree, 1 a fir, 2 a bare thorn
        const kind = r < tk * L.trees.thornShare ? 2 : (r2 < (tk > 0.5 ? 0.25 : L.trees.firShare) ? 1 : 0);
        const size = kind === 2 ? 1.15 + 0.95 * r2 * r2 + 0.25 * h2(gx, gz, 6) : 0.8 + 0.7 * r2;
        q.trees.push({ x, z, y: f.h, size, kind, seed: (gx * 73 + gz * 151) & 0xffff, r: 0.3 * size });
      }
      for (let gz = Math.floor(z0 / HS); gz <= Math.floor(z1 / HS); gz++) for (let gx = Math.floor(x0 / HS); gx <= Math.floor(x1 / HS); gx++) {
        const x = (gx + 0.15 + 0.7 * h2(gx, gz, 11)) * HS, z = (gz + 0.15 + 0.7 * h2(gx, gz, 12)) * HS;
        if (x < x0 || x >= x1 || z < z0 || z >= z1 || dOut(x, z) < L.herbs.away || x < BX0 + 16 || x > BX1 - 16 || z < BZ0 + 16 || z > BZ1 - 16) continue;
        const tk = thornK(x, z); if (h2(gx, gz, 13) > lerp(L.herbs.woods, L.herbs.thorn, tk)) continue;
        const f = field(x, z, false); if (f.re < 0.3 || f.sd < 1.4) continue;
        if (q.trees.some((t) => Math.hypot(t.x - x, t.z - z) < t.r + 0.9)) continue;
        const kinds = L.herbs.kinds, kind = kinds[Math.floor(h2(gx, gz, 14) * kinds.length) % kinds.length];
        q.herbs.push({ id: gx + ',' + gz, x, z, y: f.h, kind: kind.id, turn: h2(gx, gz, 15) * 6.283 });
      }
      lists.set(key, q); return q;
    }

    // ---- pockets: things built once that stand on the land (the first test has one: a ring of standing stones) ----
    const SOLID = [];   // [x, z, r]: what she walks round, besides the trees
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
      if (!any) return [];
      const out = HB.build(herbMats), list = [];
      for (const k in out) { out[k].name = 'land-herbs'; scene.add(out[k]); list.push(out[k]); }
      return list;
    }

    // ---- where her feet can stand on the land ----
    function landWalkable(x, z) {
      if (x < BX0 + 6 || x > BX1 - 6 || z < BZ0 + 6 || z > BZ1 - 6) return false;
      if (water(x, z).sd < 0.5) return false;
      for (const s of SOLID) if (Math.hypot(x - s[0], z - s[1]) < s[2]) return false;
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
    let queue = [], made = 0, region = null, regionWant = null, regionT = 0;
    const SKY0 = [0.62, 0.6, 0.7], MOON0 = [0.42, 0.43, 0.56];   // the place engine's own sky and moon
    const NW = L.night.woods, NT = L.night.thorn, col = new THREE.Color();
    const mix3 = (a, b, t) => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
    const nearestD = (ci, cj, x, z) => Math.hypot(Math.max(ci * SIZE - x, 0, x - (ci + 1) * SIZE), Math.max(cj * SIZE - z, 0, z - (cj + 1) * SIZE));
    const levelFor = (d, cur) => { for (let k = 0; k < LEVELS.length; k++) if (d < LEVELS[k].d * (cur >= 0 && cur <= k ? 1.12 : 0.92)) return k; return LEVELS.length - 1; };
    function drop(s) {
      if (s.mesh) { scene.remove(s.mesh); s.mesh.geometry.dispose(); s.mesh = null; }
      if (s.trees) { P.unplant(s.trees); s.trees = null; }
      if (s.herbs) { for (const m of s.herbs) { scene.remove(m); m.geometry.dispose(); } s.herbs = null; }
    }
    function landUpdate(cam, io) {
      const guideOn = U.uFogNear.value > 5000;
      // the fog: each place's own in and near it; past it thicker in the woods, thickest (and paler) in the thorns
      const dN = dOut(io.x, io.z), near = NR, kw = ss(4, 40, dN), tk = thornK(io.x, io.z), pn = near.night;
      if (!guideOn) {
        U.uFogNear.value = lerp(pn.near, lerp(NW.near, NT.near, tk), kw); U.uFogFar.value = lerp(pn.far, lerp(NW.far, NT.far, tk), kw);
        U.uFog.value.setRGB(...mix3(pn.fog, mix3(NW.fog, NT.fog, tk), kw));
        U.uSky.value.setRGB(...mix3(pn.sky, mix3(SKY0, NT.sky, tk), kw)); U.uMoon.value.setRGB(...mix3(pn.moon, mix3(MOON0, NT.moon, tk), kw));
      }
      const fogFar = guideOn ? 115 : U.uFogFar.value;
      if (sky) { sky.position.copy(cam.position); sky.updateMatrix(); }
      // the far hills sink out of sight where the fog is heavy
      hills.position.set(cam.position.x, -110 * (1 - ss(62, 95, fogFar)), cam.position.z);
      // which squares are wanted, and at what detail
      const R = fogFar + 46, RT = fogFar + 14, RH = Math.min(fogFar, 70);
      const c0 = Math.floor((io.x - R) / SIZE), c1 = Math.floor((io.x + R) / SIZE), r0 = Math.floor((io.z - R) / SIZE), r1 = Math.floor((io.z + R) / SIZE);
      const want = [];
      for (let cj = r0; cj <= r1; cj++) for (let ci = c0; ci <= c1; ci++) {
        // nothing is made past the land's rim but a ring of ground one square deep, lost in the fog
        if ((ci + 1) * SIZE < BX0 - SIZE || ci * SIZE > BX1 + SIZE || (cj + 1) * SIZE < BZ0 - SIZE || cj * SIZE > BZ1 + SIZE) continue;
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
      const t0 = performance.now(), budget = TEST ? 400 : made < 12 ? 30 : 5;
      while (queue.length && performance.now() - t0 < budget) {
        const w = queue.shift(), s = w.s, t1 = performance.now();
        if (w.job === 'ground') {
          const mesh = makeSquare(s.ci, s.cj, w.lv);
          if (s.mesh) { scene.remove(s.mesh); s.mesh.geometry.dispose(); }
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
      const now = dN < 10 ? near.name : tk > 0.5 ? L.names.thorn : L.names.woods;
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
      // the nearest herb still on the ground to a spot, among the squares made so far (for the checks)
      nearestHerb(x, z) { let best = null, bd = 1e9; for (const sq of squares.values()) { if (!sq.herbs) continue; for (const h of listFor(sq.ci, sq.cj).herbs) { const d = Math.hypot(h.x - x, h.z - z); if (!picked.has(h.id) && d < bd) { bd = d; best = h; } } } return best; },
      numbers() { let g = 0, t = 0, h = 0, tr = 0; for (const s of squares.values()) { if (s.mesh) g++; if (s.trees) { t++; tr += listFor(s.ci, s.cj).trees.length; } if (s.herbs && s.herbs.length) h += listFor(s.ci, s.cj).herbs.filter((q) => !picked.has(q.id)).length; } return { squares: g, treeSquares: t, trees: tr, herbs: h, fogFar: Math.round(U.uFogFar.value) }; },
    };
    return Z;
  };
})(window);
