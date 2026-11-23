// jetty-ship.js: the Grey Hat's ship at the end of the jetty's pier, as a STAND-IN (Coven of the Moon Faire,
// November 23, 2026). Load it after places/jetty.js.
//
// The lines and the narrator speak of her: "An airship rides at the end of the pier, with every one of her twelve
// lamp hooks bare." Until now nothing stood there. This is a plain ship made new here, in the place engine's own
// wood, so she stands under the jetty's own night, fog and lamplight: a hull, a cabin, a mast with its sail furled,
// a tall tail fin, a dim amber sunstone at the stern, and twelve iron lamp hooks along her rails, six a side.
//
// She is NOT one of Chris's ships. The real one comes from Skies of Aethermoor with the flight between zones (which
// ship is Chris's call). When it comes it takes this file's place: keep `W3D_PLACES.jetty.ship.hooks` (where the
// twelve lamps hang), which game/people/zone-1.js reads to hang each lamp as it comes home.
//
// The jetty's own file is not changed: this adds to what its `extra` builds.
// The ship's own measure: x toward the bow, z to starboard, y up from the water, in metres. She lies across the end
// of the pier with her bow to the west and her port side to the pier, 1.6 m off it.
(function (G) {
  'use strict';
  const J = G.W3D_PLACES.jetty, extra0 = J.extra;
  const WATER = -1.6, DECK = -1.0;                       // the lake, and the pier's planks (the jetty's own numbers)
  const PX = (px) => (px - 768) * 0.04, PZ = (py) => (py - 512) * 0.05;   // the jetty's painting, in metres from its middle
  const LEN = 15, HB = 2.2, N = 14, DECKY = 0.72;        // her length, half her beam, how many ribs, her deck above the water
  const CX = PX(768) - 0.8, CZ = PZ(800) + 1.6 + HB;     // her middle, in the jetty's metres
  const P = (sx, sy, sz) => [CX - sx, WATER + sy, CZ + sz];               // the ship's measure to the jetty's
  const sxAt = (t) => -LEN / 2 + t * LEN;                // t: 0 at the stern, 1 at the bow
  const half = (t) => HB * Math.max(0.03, t < 0.4 ? 0.62 + 0.38 * Math.sin(t / 0.4 * Math.PI / 2) : Math.pow(Math.cos((t - 0.4) / 0.6 * Math.PI / 2), 0.75));
  const sheer = (t) => 1.2 + (2 * t - 1) * (2 * t - 1) * (t > 0.5 ? 1.15 : 0.9);    // her rail, above the water: low amidships, rising to bow and stern
  const rake = (t) => { const e = Math.max(0, (t - 0.75) / 0.25); return e * e; };   // the stem leans forward
  const rail = (t, side) => [sxAt(t) + 0.8 * rake(t), sheer(t), side * half(t)];
  const bilge = (t, side) => [sxAt(t), 0.1, side * half(t) * 0.86];
  const keel = (t, side) => [sxAt(t) - 0.9 * rake(t), -0.65, side * half(t) * 0.15];
  const inner = (t, side) => [sxAt(t) + 0.8 * rake(t) * 0.6, DECKY, side * half(t) * 0.93];

  // the twelve hooks: six a side, clear of the gangway. Each is where a lamp hangs, in the jetty's metres.
  // The order is the order the lamps come home: from the gangway outward, the pier's side first.
  const HOOK_T = [0.52, 0.36, 0.62, 0.26, 0.72, 0.82], POST_H = 1.25, ARM = 0.36;
  const hookAt = (t, side) => { const r = rail(t, side); return P(r[0], r[1] + POST_H - 0.34, r[2] + side * ARM); };
  const hooks = []; for (const t of HOOK_T) for (const side of [-1, 1]) hooks.push(hookAt(t, side));
  J.ship = { standIn: true, hooks, at: [CX, WATER, CZ], length: LEN, beam: HB * 2 };

  function build(K) {
    const B = K.B, T3 = G.THREE, solid0 = B.solid; B.solid = false;       // (one solid for the whole hull is added at the end)
    const HULL = [0.5, 0.39, 0.34], STRAKE = [0.74, 0.58, 0.47], DARK = [0.4, 0.31, 0.28], ROPE = [1.3, 1.1, 0.78], CANVAS = [1.45, 1.3, 1.05];
    const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
    // a four-cornered face, turned so that it is seen from the side `out` points to (in the jetty's measure)
    const face = (k, a, b, c, d, out, col) => { const e1 = sub(b, a), e2 = sub(d, a), n = [e1[1] * e2[2] - e1[2] * e2[1], e1[2] * e2[0] - e1[0] * e2[2], e1[0] * e2[1] - e1[1] * e2[0]];
      if (n[0] * out[0] + n[1] * out[1] + n[2] * out[2] < 0) B.quad(k, a, d, c, b, null, col); else B.quad(k, a, b, c, d, null, col); };
    const S = (v) => P(v[0], v[1], v[2]);
    // a round stick from a to b
    const stick = (k, a, b, r, col, seg) => { const d = new T3.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = d.length(), g = new T3.CylinderGeometry(r, r, len, seg || 5, 1, true);
      B.geom(k, g, new T3.Matrix4().compose(new T3.Vector3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2), new T3.Quaternion().setFromUnitVectors(new T3.Vector3(0, 1, 0), d.normalize()), new T3.Vector3(1, 1, 1)), col, [1, 1]); g.dispose(); };

    // ---- the hull: two strakes a side from keel to rail, the bulwark's inner face, the deck, the transom ----
    for (let i = 0; i < N; i++) { const t0 = i / N, t1 = (i + 1) / N;
      for (const side of [-1, 1]) { const out = [0, 0.25, side];
        face('wood', S(keel(t0, side)), S(keel(t1, side)), S(bilge(t1, side)), S(bilge(t0, side)), [0, -0.5, side], HULL);
        face('wood', S(bilge(t0, side)), S(bilge(t1, side)), S(rail(t1, side)), S(rail(t0, side)), out, i % 2 ? STRAKE : [STRAKE[0] * 0.93, STRAKE[1] * 0.93, STRAKE[2] * 0.93]);
        face('wood', S(inner(t0, side)), S(inner(t1, side)), S(rail(t1, side)), S(rail(t0, side)), [0, 0.25, -side], DARK); }
      face('deck', S(inner(t0, -1)), S(inner(t1, -1)), S(inner(t1, 1)), S(inner(t0, 1)), [0, 1, 0], [0.82, 0.78, 0.8]); }
    face('wood', S(keel(0, -1)), S(keel(0, 1)), S(bilge(0, 1)), S(bilge(0, -1)), [1, 0, 0], HULL);
    face('wood', S(bilge(0, -1)), S(bilge(0, 1)), S(rail(0, 1)), S(rail(0, -1)), [1, 0, 0], STRAKE);
    // a dark rubbing strake along each side, just under the rail
    for (let i = 0; i < N; i++) for (const side of [-1, 1]) { const a = rail(i / N, side), b = rail((i + 1) / N, side); stick('wood', P(a[0], a[1] - 0.16, a[2] + side * 0.03), P(b[0], b[1] - 0.16, b[2] + side * 0.03), 0.06, DARK, 4); }

    // ---- the cabin at the stern: plank walls, a deck for its roof, a door toward the bow, two dark windows ----
    const cab = { x: CX + 5.0, w: 3.2, d: 2.5, y: WATER + DECKY, h: 1.75 };
    B.box('planks', cab.x, cab.y, CZ, cab.w, cab.h, cab.d, 0, [0.72, 0.62, 0.58]);
    B.box('deck', cab.x, cab.y + cab.h, CZ, cab.w + 0.3, 0.1, cab.d + 0.3, 0, [0.7, 0.66, 0.68]);
    { const x = cab.x - cab.w / 2 - 0.012, y = cab.y; B.quad('door', [x, y, CZ - 0.42], [x, y, CZ + 0.42], [x, y + 1.5, CZ + 0.42], [x, y + 1.5, CZ - 0.42], [0, 0, 1, 1]);
      for (const side of [-1, 1]) { const z = CZ + side * (cab.d / 2 + 0.012), a = [cab.x - 0.3 * side, y + 0.75, z], b = [cab.x + 0.3 * side, y + 0.75, z]; B.quad('winDark', a, b, [b[0], y + 1.35, z], [a[0], y + 1.35, z], [0, 0, 1, 1]); } }

    // ---- the mast, its yard and the furled sail, and her standing rigging ----
    const mx = CX - 1.0, my = WATER + DECKY, MAST = 9.2, yardY = my + 7.3;
    B.cyl('wood', mx, my, CZ, 0.17, 0.09, MAST, 8, [0.62, 0.5, 0.42], [1, 1]);
    stick('wood', [mx, yardY, CZ - 3.2], [mx, yardY, CZ + 3.2], 0.07, [0.62, 0.5, 0.42], 6);
    stick('wood', [mx - 0.02, yardY - 0.24, CZ - 2.8], [mx - 0.02, yardY - 0.24, CZ + 2.8], 0.2, CANVAS, 8);
    for (const z of [-2.2, -1.1, 0, 1.1, 2.2]) stick('wood', [mx - 0.02, yardY - 0.47, CZ + z], [mx - 0.02, yardY + 0.1, CZ + z], 0.03, DARK, 4);
    const top = [mx, my + MAST - 0.25, CZ];
    stick('wood', top, S(rail(1, 0)), 0.025, ROPE, 4); stick('wood', top, [cab.x, cab.y + cab.h + 0.1, CZ], 0.025, ROPE, 4);
    for (const side of [-1, 1]) for (const t of [0.5, 0.62]) stick('wood', [mx, my + MAST - 1.6, CZ], S(rail(t, side)), 0.022, ROPE, 4);

    // ---- what makes her a ship of the air: a tall tail fin on the stern, and the sunstone under it, amber and low ----
    { const a = P(-7.2, 1.0, 0), b = P(-9.5, 1.7, 0), c = P(-9.7, 4.4, 0), d = P(-7.5, 3.5, 0);
      face('planks', a, b, c, d, [0, 0, -1], [0.68, 0.56, 0.5]); face('planks', a, b, c, d, [0, 0, 1], [0.68, 0.56, 0.5]);
      stick('wood', a, d, 0.07, DARK, 5); stick('wood', d, c, 0.05, DARK, 5); stick('wood', a, b, 0.05, DARK, 5); stick('wood', b, c, 0.05, DARK, 5);
      // (the sunstone sits in an iron cradle on the cabin's roof, at its after end)
      const s = P(-6.1, DECKY + 1.75 + 0.16, 0);
      B.box('iron', s[0], s[1] - 0.06, s[2], 0.46, 0.06, 0.46, 0.6); B.box('glass', s[0], s[1], s[2], 0.28, 0.36, 0.28, 0.6, [0.85, 0.42, 0.12]); B.box('iron', s[0], s[1] + 0.36, s[2], 0.38, 0.05, 0.38, 0.6);
      K.halo(s[0], s[1] + 0.18, s[2], 1.4, [0.75, 0.36, 0.1]); }

    // ---- the twelve lamp hooks: an iron post on the rail, an arm out over the water, a ring. Bare until a lamp comes home ----
    for (const t of HOOK_T) for (const side of [-1, 1]) { const r = rail(t, side), foot = P(r[0], r[1] - 0.05, r[2]), head = P(r[0], r[1] + POST_H, r[2]), tip = P(r[0], r[1] + POST_H, r[2] + side * ARM);
      stick('iron', foot, head, 0.028, null, 4); stick('iron', head, tip, 0.022, null, 4); stick('iron', tip, [tip[0], tip[1] - 0.1, tip[2]], 0.015, null, 4); }

    // ---- the gangway from the pier's end, and her two lines to the bollards there ----
    { const g = rail(0.44, -1), x = CX - g[0], a = [x - 0.42, DECK + 0.02, PZ(800) - 0.25], b = [x + 0.42, DECK + 0.02, PZ(800) - 0.25], c = [x + 0.42, WATER + g[1] + 0.03, CZ + g[2] + 0.1], d = [x - 0.42, WATER + g[1] + 0.03, CZ + g[2] + 0.1];
      face('deck', a, b, c, d, [0, 1, 0], [0.9, 0.86, 0.86]); face('wood', [a[0], a[1] - 0.07, a[2]], [b[0], b[1] - 0.07, b[2]], [c[0], c[1] - 0.07, c[2]], [d[0], d[1] - 0.07, d[2]], [0, -1, 0], DARK);
      stick('wood', a, d, 0.04, DARK, 4); stick('wood', b, c, 0.04, DARK, 4); }
    for (const [px, t] of [[727, 0.58], [815, 0.3]]) { const r = rail(t, -1); stick('wood', [PX(px), -0.62, PZ(806)], P(r[0], r[1] - 0.05, r[2]), 0.03, ROPE, 4); }

    // one solid for the whole hull and one for the cabin, so the camera never sits inside her
    B.solid = solid0;
    const rect = (x0, z0, x1, z1) => [[x0, z0], [x1, z0], [x1, z1], [x0, z1]];
    B.solids.push({ k: 'wood', y0: WATER - 0.6, y1: WATER + 1.5, poly: rect(CX - LEN / 2 + 0.6, CZ - HB + 0.25, CX + LEN / 2, CZ + HB - 0.25) });
    B.solids.push({ k: 'planks', y0: cab.y, y1: cab.y + cab.h, poly: rect(cab.x - cab.w / 2, CZ - cab.d / 2, cab.x + cab.w / 2, CZ + cab.d / 2) });
  }
  J.extra = function (K) { extra0.call(this, K); try { build(K); } catch (e) { console.error(e); } };
})(window);
