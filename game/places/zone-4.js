// zone-4.js: zone 4, the northeast peaks (the frozen camp, Frostmere's shore, the frozen pass, Misthollow and the dead
// Moonwell), on the map of Aethermoor (Coven of the Moon Faire, November 24, 2026). The same engine and the same rules
// as zones 1 to 3: each place stands on Chris's map and at the map's height; the land between is the map; the roads
// find their own way between the gates. The places are the new Envoi's five for zone 4.
//
// THE JOB'S CALLS HERE, each one line of data, each Chris's to overrule (docs/slips/zone-4.md says why):
//   VK        the peaks stand at one ninth of the map's height, not the one third of zones 1 to 3
//   AT.mist   Misthollow stands 143 m south of its pin, on the flat top of its mountain
//   AT.well   the dead Moonwell stands at the head of Misthollow's one street, 153 m north of the town (290 m south of
//             its own pin), and WELL_UP metres above the street's top
//   FLAMES    no flame is lit in Misthollow or at the Moonwell: every lamp there is dead and every window dark
//   DAWN      the light there is a pale cold dawn that never turns (and DARK is the night that comes back at the end)
(function (G) {
  'use strict';
  const PL = G.W3D_PLACES, W3D = G.W3D;
  // ---- where things stand. The frozen camp's pin on the map, (2760, 1105), is this land's (0, 0) ----
  const K = 10 / 3, VK = 1 / 9, PIN0 = [2760, 1105], at = (ax, ay) => [+((ax - PIN0[0]) * K).toFixed(1), +((ay - PIN0[1]) * K).toFixed(1)];
  const off = (p, dx, dz) => [+(p[0] + dx).toFixed(1), +(p[1] + dz).toFixed(1)];
  const MIST_PIN = [3500, 778];                       // (its pin on the map is (3500, 735))
  const AT = { camp: [0, 0], shore: at(3180, 1125), pass: at(3270, 980), mist: at(MIST_PIN[0], MIST_PIN[1]) };
  AT.well = off(AT.mist, -0.1, -153.2);               // (its pin on the map is (3522, 645))
  const WELL_UP = 3.0;                                // how far the street climbs between the town's north edge and the Moonwell's south edge, metres

  // ---- the wild places, opened at their gates (as in zones 2 and 3): a strip of walking ground from each way out to
  // the edge of the place's own ground, with no tree standing in it. A gate is [x0, y0, x1, y1] in the place's painting
  // pixels, or a line of points with a half width in metres (a road that bends) ----
  const ribbon = (pts, hw) => { const L = [], R = [];
    for (let i = 0; i < pts.length; i++) { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; let dx = (b[0] - a[0]) * 0.04, dz = (b[1] - a[1]) * 0.05; const l = Math.hypot(dx, dz) || 1; dx /= l; dz /= l;
      L.push([Math.round(pts[i][0] - dz * hw / 0.04), Math.round(pts[i][1] + dx * hw / 0.05)]); R.push([Math.round(pts[i][0] + dz * hw / 0.04), Math.round(pts[i][1] - dx * hw / 0.05)]); }
    return L.concat(R.reverse()); };
  const open = (id, gates, ground) => { const T = PL[id];
    const polys = gates.map((g) => (g.line ? ribbon(g.line, g.hw) : [[g[0], g[1]], [g[2], g[1]], [g[2], g[3]], [g[0], g[3]]]));
    const boxes = polys.map((p) => [Math.min(...p.map((q) => q[0])), Math.min(...p.map((q) => q[1])), Math.max(...p.map((q) => q[0])), Math.max(...p.map((q) => q[1]))]);
    const clear = ([x, y]) => !boxes.some(([a, b, c, d]) => x > a - 40 && x < c + 40 && y > b - 50 && y < d + 50);
    T.walkAdd = (T.walkAdd || []).concat(polys.map((poly) => ({ poly, ground: ground || 'dirt' })));
    G.W3D_TREES[id] = (G.W3D_TREES[id] || []).filter(clear); if (Array.isArray(T.extraTrees)) T.extraTrees = T.extraTrees.filter(clear); };
  open('frozen-camp', [[2900, 536, 3072, 612]]);                                                   // east, to Frostmere's shore
  open('frostmere-shore', [[-1536, 596, -1410, 668], [744, -1024, 820, -930]], 'cob');             // west, to the camp; north, to the frozen pass
  open('frozen-pass', [{ line: [[782, 1930], [784, 2110], [860, 2300], [900, 2510]], hw: 2.7 },    // south, to Frostmere's shore (the road the place already draws there)
    { line: [[790, -890], [800, -1080], [720, -1260], [690, -1480]], hw: 2.6 }], 'cob');           // north, to Misthollow

  // ---- Misthollow, joined to the land ----
  // It stands on its own rock above a sea of mist, and in the old game its two ways out were doors. Here:
  //   north  its one street runs on between the houses to the edge of its ground, and on up to the Moonwell
  //   south  a bridge of stone setts on tall posts carries the road from the foot of its south stair over the mist
  //   the mist stops a hand short of the edge of its ground, and under the mist the rock no longer falls deeper than
  //   the mist itself, so the land outside rises out of the mist and not out of a pit
  { const T = PL.misthollow, MISTY = -14, BR = [700, 1088, 836, 1444];
    T.walkAdd = (T.walkAdd || []).concat([{ poly: [[700, -420], [832, -420], [832, 12], [700, 12]], ground: 'cob' }]);
    T.decks = (T.decks || []).concat([{ r: BR, y: -3.6, bottom: MISTY - 1, spacing: 3.2, rails: { kind: 'wood', sides: 'we' } }]);
    T.water = [{ poly: [[-446, -406], [-175, -406], [-175, 230], [-120, 400], [-40, 480], [30, 500], [40, 560], [40, 1100], [60, 1195], [1466, 1195], [1500, 1010], [1466, 800], [1466, 590], [1540, 540],
      [1640, 470], [1676, 300], [1676, -406], [1982, -406], [1982, 1430], [-446, 1430]], level: () => MISTY, tex: 'shared_snow', rep: 16, flow: [0.0016, 0.0007], bed: MISTY - 2.4, tint: 0xb4bcdc }];
    // (and where the bridge comes to the edge of the town's ground it lands on a bank of rock, 20 m wide, so the road
    // from the pass arrives on firm ground and not on a spike)
    const ss = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
    const g0 = T.ground_h, w0 = T.walk_h, FLOOR = MISTY - 0.7, bank = (x, y) => -3.9 - 10.8 * (1 - ss(1290, 1436, y) * (1 - ss(250, 520, Math.abs(x - 768))));
    T.ground_h = (x, y) => Math.max(FLOOR, bank(x, y), g0(x, y)); T.walk_h = (x, y) => Math.max(FLOOR, bank(x, y), w0(x, y)); }

  // ---- the dead Moonwell, joined to the land: its street runs on south, past its two last houses, to the edge of its
  // ground. (South of those houses the old place let the mountain fall away at 42 degrees: here it keeps the street's
  // own gentle slope, so the street can be walked.) ----
  { const T = PL.moonwell, g0 = T.ground_h, w0 = T.walk_h, keep = (y) => (y > 1240 ? 0.045 * (y - 1240) : 0);
    T.ground_h = (x, y) => g0(x, y) + keep(y); T.walk_h = (x, y) => w0(x, y) + keep(y);
    T.walkAdd = (T.walkAdd || []).concat([{ poly: [[660, 1010], [876, 1010], [876, 1444], [660, 1444]], ground: 'dirt' }]); }

  // ---- FLAMES: no flame stays lit in Misthollow or at the Moonwell (the Grey Hat, Ede, the watchwoman and the
  // pass-keeper all say so). The old places had warm lanterns, lit windows and two fire bowls. Here every window is
  // dark, every wall lantern is gone, every lamp pillar stands with a dead lantern on it, and the fire bowls are cold
  // iron. (What burns at the Moonwell, and what lights again when the fire ends, is the story's: game/people/zone-4.js.) ----
  const warm = (c) => Array.isArray(c) && c.length >= 3 && c[0] > c[2] * 1.15;
  const flameless = (id) => { const T = PL[id], lamps = T.lamps || [], ex = T.extra;
    for (const b of T.buildings || []) { delete b.lanterns; for (const w of b.windows || []) w.dark = true; for (const d of b.doors || []) d.light = false; }
    T.lamps = []; T.deadLamps = lamps;
    if (Array.isArray(T.lights)) T.lights = T.lights.filter((l) => l[4] === 'moon' || l[4] === 'cold');
    T.extra = function (K) {
      // what the place builds for itself goes through a builder that makes warm glass dark, and lights nothing warm
      // (a warm cone of glass is a flame: it is left out; a lit window becomes a dark one)
      const B = new Proxy(K.B, { get(t, k) { const v = t[k]; if (k !== 'box' && k !== 'cyl' && k !== 'quad') return typeof v === 'function' ? v.bind(t) : v;
        return (kind, ...a) => { if (k === 'quad') return t.quad(kind === 'win' || kind === 'winColour' ? 'winDark' : kind, ...a);
          if (kind === 'glass' && warm(a[7])) { if (k === 'cyl' && a[4] === 0) return; a[7] = [0.1, 0.11, 0.15]; } return t[k](kind, ...a); }; }, set(t, k, v) { t[k] = v; return true; } });
      const dead = (x, y, z, n, size, hang) => { const s = size || 1;   // a lantern with no flame in it (the engine's own, dark)
        if (n) B.box('iron', x - n[0] * 0.15, y + 0.33 * s, z - n[2] * 0.15, Math.abs(n[2]) > 0.5 ? 0.05 : 0.36, 0.05, Math.abs(n[0]) > 0.5 ? 0.05 : 0.36, 0, null);
        if (hang) B.box('iron', x, y + 0.3 * s, z, 0.03, 0.4, 0.03, 0);
        B.box('iron', x, y - 0.03 * s, z, 0.26 * s, 0.05 * s, 0.26 * s, 0); B.box('glass', x, y, z, 0.2 * s, 0.3 * s, 0.2 * s, 0, [0.1, 0.11, 0.15]);
        B.box('iron', x, y + 0.3 * s, z, 0.3 * s, 0.06 * s, 0.3 * s, 0); B.cyl('iron', x, y + 0.36 * s, z, 0.16 * s, 0.02, 0.14 * s, 4);
        for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) B.box('iron', x + dx * 0.1 * s, y, z + dz * 0.1 * s, 0.025, 0.3 * s, 0.025, 0); };
      const K2 = Object.assign({}, K, { B, lantern: dead, lamps3d: [], halo: (x, y, z, size, rgb) => { if (!warm(rgb)) K.halo(x, y, z, size, rgb); },
        light: (px, py, r, s, kind) => { if (kind === 'moon' || kind === 'cold') K.light(px, py, r, s, kind); }, fire: () => {} });
      if (ex) ex.call(T, K2);
      // the lamp pillars and posts the engine would have lit: the same stone and iron, the lantern dead
      for (const l of lamps) { const x = K.X(l.at[0]), z = K.Z(l.at[1]), y = l.y != null ? l.y : K.walkH(l.at[0], l.at[1]);
        if (l.kind === 'pillar') { const ph = l.h || 1.45; B.box('stone', x, y - 0.3, z, 0.62, ph + 0.3, 0.62, 0, [0.95, 0.93, 0.98]); B.box('stone', x, y + ph, z, 0.76, 0.14, 0.76, 0, [0.8, 0.78, 0.84]); dead(x, y + ph + 0.17, z, null, 1.05); }
        else { const hh = l.h || 3.0; B.box('iron', x, y, z, 0.26, 0.3, 0.26, 0); B.cyl('iron', x, y + 0.3, z, 0.06, 0.045, hh - 0.3, 6); B.box('iron', x, y + hh - 0.06, z, 0.3, 0.06, 0.06, 0); dead(x, y + hh + 0.02, z, null, 1.1); }
        K.addBlock(K.circlePx(l.at[0], l.at[1], l.kind === 'pillar' ? 0.42 : 0.22, 8)); }
    }; };
  flameless('misthollow'); flameless('moonwell');

  // ---- DAWN: "never dark, never warm": in Misthollow and at the Moonwell it has been a pale cold morning for eight
  // years. Each place keeps its own light and mist (the land brings them round as she comes near), so these two are
  // given a bright, colourless dawn. DARK is the honest night that comes back when the fire ends: the story sets it. ----
  const DAWN = { sky: [1.45, 1.5, 1.66], moon: [0.36, 0.38, 0.46], ground: [0.5, 0.52, 0.6], fog: [0.66, 0.7, 0.8], fogNear: 30, fogFar: 120 };
  const DARK = { sky: [0.5, 0.52, 0.7], moon: [0.3, 0.32, 0.46], fog: [0.035, 0.04, 0.085], fogNear: 34, fogFar: 150 };
  PL.misthollow.night = Object.assign({}, PL.misthollow.night, DAWN); PL.moonwell.night = Object.assign({}, PL.moonwell.night, DAWN);
  W3D.ZONE4 = { DAWN, DARK, AT, K, VK, PIN0 };

  // each place's gates, as metres from its own middle
  const GATE = { campE: off(AT.camp, 92.2, 3.1), shoreW: off(AT.shore, -92.2, 6.0), shoreN: off(AT.shore, 0.6, -76.8), passS: off(AT.pass, 5.3, 99.9), passN: off(AT.pass, -3.1, -99.6),
    mistS: off(AT.mist, 0, 46.6), mistN: off(AT.mist, -0.1, -46.6), wellS: off(AT.well, 0, 46.6) };

  PL['zone-4'] = {
    id: 'zone-4', name: 'The northeast peaks', size: [1536, 1024],
    start: PL['frozen-camp'].start, startFace: PL['frozen-camp'].startFace,
    zone: {
      places: [
        { id: 'frozen-camp', at: AT.camp },                        // where the ship sets down, at the foot of the pass
        { id: 'frostmere-shore', at: AT.shore },                   // 1.4 km east, 117 m higher: the frozen mere
        { id: 'frozen-pass', at: AT.pass },                        // 570 m on, north-north-east, 70 m higher
        { id: 'misthollow', at: AT.mist },                         // 1 km on, north-east, on the mountain's flat top
        // the Moonwell stands above the town: the top of Misthollow's street is 6.06 m above its lower square, the street
        // climbs WELL_UP more to the Moonwell's ground, whose south edge is 3.7 m below its court
        { id: 'moonwell', at: AT.well, get y() { if (!W3D.atlas || !W3D.atlas.ready) return null; const o = {}, h = (p) => W3D.atlas.at(p[0], p[1], o).h; return (h(MIST_PIN) - h(PIN0)) * VK + 6.06 + WELL_UP + 3.7; } },
      ],
      land: {
        bounds: [-300, -1500, 2767, 367],        // 3.1 km by 1.9 km: the map from (2670, 655) to (3590, 1215)
        level: -1.0, roll: [0.8, 1.15],
        atlas: { height: "art/world/aethermoor-terrain-height.png", kinds: "art/world/aethermoor-terrain-kinds.png",
          map: { origin: PIN0, k: K, vk: VK }, waterY: -1.5,
          water: { tex: 'shared_ice', rep: 9, flow: [0.0006, 0.0003] } },
        thornK: () => 0,
        names: {},
        // (the names a player reads as she walks: stand-ins until Chris names the country)
        nameAt: (x, z, f) => (f.re < 12 ? 'The frozen road' : f.pine > 0.5 ? 'The snowbound pines' : 'The northeast peaks'),
        ground: { grass: 'shared_snow', bramble: 'shared_snow', moss: 'shared_snow', dirt: 'snow_trodden_trail', rock: 'cliff_rock_frozen',
          cob: 'frozenpass_road_snowy', pave: 'shared_setts_frosted', repStone: [3.0, 2.4], fen: 'shared_ice', repFen: 5.0, fenTint: [0.8, 0.86, 0.95],
          rep: [7.5, 7.5, 7.5, 3.2], grassTint: [1.0, 0.98, 0.92], brambleTint: [0.94, 0.94, 0.96], mossTint: [0.9, 0.92, 1.0], dirtTint: [1.0, 0.98, 0.96] },
        shade: [0.8, 0.72],
        // the peaks at night: cold, pale and thick with blown snow
        night: {
          woods: { fog: [0.17, 0.18, 0.31], near: 14, far: 78 },
          thorn: { fog: [0.17, 0.18, 0.31], near: 14, far: 78, sky: [0.6, 0.62, 0.76], moon: [0.44, 0.47, 0.62] },
        },
        roads: [
          { w: 2.8, route: true, name: 'the frozen camp to Frostmere’s shore', to: 'Frostmere\'s shore', pts: [GATE.campE, off(GATE.campE, 30, 0), off(GATE.shoreW, -30, 0), GATE.shoreW] },
          { w: 3.0, route: true, stone: 'cob', stoneTo: 'cob', name: 'Frostmere’s shore up to the frozen pass', to: 'The frozen pass', pts: [GATE.shoreN, off(GATE.shoreN, 0, -30), off(GATE.passS, 4, 30), GATE.passS] },
          { w: 3.0, route: true, stone: 'cob', name: 'the frozen pass up to Misthollow', to: 'Misthollow', pts: [GATE.passN, off(GATE.passN, -4, -30), off(GATE.mistS, 0, 34), GATE.mistS] },
          // the town's one street, going on up to the Moonwell: stone underfoot from end to end
          { w: 5.2, stone: 'pave', stoneTo: 'pave', stoneAll: true, name: 'Misthollow’s street up to the Moonwell', to: 'The dead Moonwell', pts: [GATE.mistN, off(GATE.mistN, 0, -20), off(GATE.wellS, 0, 20), GATE.wellS] },
        ],
        trees: { step: 5.6, woods: 0.7, thorn: 0.9, thornShare: 0, firShare: 0.92, noLeaf: true },
        // (Sorrel: "White sage, white thyme, white everything". The second herb's name is a stand-in)
        herbs: { step: 14, woods: 0.3, thorn: 0.6, away: 10, kinds: [
          { id: 'moonpetal', name: 'Moonpetal', petal: '#d6ecff', heart: '#fff6c8' },
          { id: 'white-sage', name: 'White sage', petal: '#f2f4ee', heart: '#dfe8d0' },
        ] },
      },
    },
  };
})(window);
