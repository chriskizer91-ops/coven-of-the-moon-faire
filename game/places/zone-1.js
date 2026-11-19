// zone-1.js: zone 1, "Wickhollow and the fen", as one open land with its places standing in it (Coven of the Moon Faire,
// November 18, 2026). Load it after every place's own file and after places/wickhollow-open.js.
//
// It holds the zone's six places: Wickhollow; the Thornwood across its bridge; Bogmire past the Thornwood, and the
// fen's dark heart north of Bogmire; Io's cottage down the south road; the jetty west of the cottage.
// And the Moon Faire's camp, where the game starts: in the meadow off the south road, between the lake and the cottage.
// Everything is metres: x east, z south, Wickhollow's square at 0, 0.
// The layout is the hub's (hub's call): the places stand the way their roads join in the old Envoi (Wickhollow's bridge
// leads east to the Thornwood, the Thornwood's far side to Bogmire), with the distances squeezed.
(function (G) {
  'use strict';
  const PL = G.W3D_PLACES;
  const ss = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

  // ---- the Thornwood, opened at its two gates ----
  // The Thornwood is a wood inside a thorn hedge, with a way out west (to Wickhollow) and a way out east (to Bogmire).
  // Its trails used to stop at the hedge, 16 m short of the edge of its own ground. Now each runs on to the edge, where
  // the land's road takes over: a strip she can walk, and no trees standing in it.
  {
    const T = PL.thornwood, GATES = [[-1536, 330, -1124, 402], [2692, 510, 3072, 586]];   // painting pixels: [x0, y0, x1, y1]
    T.walkAdd = T.walkAdd.concat(GATES.map(([a, b, c, d]) => ({ poly: [[a, b], [c, b], [c, d], [a, d]], ground: 'cob' })));
    G.W3D_TREES.thornwood = G.W3D_TREES.thornwood.filter(([x, y]) => !GATES.some(([a, b, c, d]) => x > a - 40 && x < c + 40 && y > b - 50 && y < d + 50));
  }

  // ---- where things stand: on the map of Aethermoor, at one third its size (Chris, November 18, 21:04) ----
  // The map is 4608 x 3072 atlas pixels, 10 m each. A metre here is three on the map, so an atlas pixel is 3.333 m here.
  // Wickhollow's pin on the map, (1348, 1838), is this land's (0, 0). The places' pins are Envoi's 3D map's own.
  const K = 10 / 3, PIN0 = [1348, 1838], at = (ax, ay) => [+((ax - PIN0[0]) * K).toFixed(1), +((ay - PIN0[1]) * K).toFixed(1)];
  const AT = { wickhollow: [0, 0], thornwood: at(1530, 2160), bogmire: at(1752, 2512), heart: at(1800, 2385), cottage: at(1352, 1948), jetty: at(1446, 1806), zone2: at(820, 1530) };
  const off = (p, dx, dz) => [+(p[0] + dx).toFixed(1), +(p[1] + dz).toFixed(1)];
  // each place's gates, as metres from its own middle (where its own roads reach the edge of its ground)
  const GATE = { thornW: off(AT.thornwood, -92.1, -7.3), thornE: off(AT.thornwood, 92.1, 1.8), bogW: off(AT.bogmire, -49.1, -7.3), bogN: off(AT.bogmire, 0.9, -46.6), heartS: off(AT.heart, 0, 46.6),
    cotN: off(AT.cottage, -8.6, -46.6), cotW: off(AT.cottage, -49.1, -4.6), jetN: off(AT.jetty, 0, -46.6) };
  PL['zone-1'] = {
    id: 'zone-1', name: 'Wickhollow and the fen', size: [1536, 1024],
    // she starts in the Moon Faire's camp, 5 m south of its well. (The zone's pixels are Wickhollow's painting's: one
    // pixel is 4 cm across and 5 cm down, and Wickhollow's square's middle is pixel 768, 512.)
    start: [768 + (-70) / 0.04, 512 + (128 + 5) / 0.05], startFace: Math.PI,
    zone: {
      // where each place stands. Its own ground reaches out round that spot: Wickhollow 49 m east and west, 47 m north
      // and south; the Thornwood 92 m and 77 m. autoWater: its streams and shores are carried on past its edge by rule
      // open: a town that used to be closed in at its painting's edge, opened to the edge of its own ground
      places: [
        { id: 'wickhollow', at: AT.wickhollow },                                       // (opened by places/wickhollow-open.js)
        { id: 'thornwood', at: AT.thornwood },                                         // 1.2 km south-east of Wickhollow
        { id: 'bogmire', at: AT.bogmire, open: true, moat: true, waterY: -1.5 },       // 2.6 km south-east, in the fen
        { id: 'bogmire-heart', at: AT.heart, open: true, moat: true, waterY: -1.8 },   // 450 m north-north-east of Bogmire
        { id: 'cottage', at: AT.cottage, open: true },                                 // 370 m south of Wickhollow
        { id: 'jetty', at: AT.jetty, open: true, waterY: -1.6 },                       // on the lake, 340 m north-east
      ],
      land: {
        bounds: [-443, -460, 2040, 2707],        // 2.5 km by 3.2 km: the map from (1215, 1700) to (1960, 2650)
        level: -1.0, roll: [0.8, 1.15],
        // ---- how the land lies on the 3D map of Aethermoor (engine/land/atlas.js) ----
        // map: the atlas pixel under this land's (0, 0); k: metres here to an atlas pixel; vk: what the map's heights
        // are multiplied by (a third, as across). waterY: how far the map's water lies below land of the same height.
        atlas: { height: "art/world/aethermoor-terrain-height.png", kinds: "art/world/aethermoor-terrain-kinds.png",
          map: { origin: PIN0, k: K, vk: 1 / 3 }, waterY: -1.5,
          water: { tex: 'shared_water_dark', rep: 6, flow: [0.003, 0.0015] } },
        // the road toward zone 2: the map between the cottage's west gate and where the Warm Roads camp will be,
        // walkable 70 m either side where it leaves this land's own ground
        longRoad: { route: true, pts: [GATE.cotW, off(GATE.cotW, -30, 0), AT.zone2], half: 70, w: 3.4, name: 'The long road' },
        // how much of the thorn country a spot is (0 the woods round the town, 1 the thorns): from the river's far bank east
        thornK: (x, z) => 1 - ss(190, 330, Math.hypot((x - AT.thornwood[0]) * 0.75, z - AT.thornwood[1])),
        names: { woods: 'The woods round Wickhollow', thorn: 'The thorn country' },
        // what the open land is called where she stands (past the thorns, the fen's edge)
        nameAt: (x, z, f) => (Math.hypot(x - AT.zone2[0], z - AT.zone2[1]) < 150 ? 'The end of the road, for now' : f.fen > 0.5 ? 'The fen' : (f.thorn || 0) > 0.5 ? 'The thorn country'
          : Math.hypot(x, z) < 320 ? 'The woods round Wickhollow' : x < -443 || z < -460 ? 'The long road' : 'The wilds of Aethermoor'),
        ground: { grass: 'shared_grass_meadow', bramble: 'thorn_bramble_ground', moss: 'thorn_moss_ground', dirt: 'shared_dirt_track', rock: 'thorn_rock_mossy',
          cob: 'shared_cobbles_town', pave: 'wick_bridge_paving', repStone: [3.2, 2.6], fen: 'bogmire_bank_grass', repFen: 4.0, fenTint: [0.62, 0.7, 0.68],
          rep: [4.0, 3.4, 2.6, 4.0], grassTint: [0.5, 0.58, 0.55], brambleTint: [0.9, 0.86, 0.95], mossTint: [1, 1, 1], dirtTint: [1, 1, 1] },
        shade: [0.78, 0.7],
        night: {
          woods: { fog: [0.085, 0.09, 0.175], near: 20, far: 92 },
          thorn: { fog: [0.16, 0.165, 0.3], near: 11, far: 62, sky: [0.58, 0.58, 0.72], moon: [0.4, 0.44, 0.6] },
          fen: { fog: [0.075, 0.115, 0.125], near: 10, far: 66, sky: [0.5, 0.58, 0.62], moon: [0.38, 0.46, 0.5] },   // the fen: a low green-grey mist
        },
        // roads: the middle line of each, its width, and the town's stone it carries out from its first point (`stone`)
        // or in to its last (`stoneTo`), if any
        // `route`: the road finds its own way over the hills between the points given (engine/land/land.js)
        roads: [
          { w: 4.0, stone: 'pave', pts: [[49.1, -7.1], [62, -7.4], [80, -10.5], [100, -12]] },                                    // east from Wickhollow's bridge
          { w: 2.8, route: true, name: 'Wickhollow to the Thornwood', to: 'The Thornwood', pts: [[100, -12], [128, 4], off(GATE.thornW, -40, 0), GATE.thornW] },
          { w: 2.6, name: 'Wickhollow to the jetty', to: 'The jetty', pts: [[100, -12], [150, -22], [205, -32], [250, -48], off(AT.jetty, -82, 30), off(AT.jetty, -82, -40), off(AT.jetty, -68, -72), off(AT.jetty, -25, -80), off(GATE.jetN, 0, -31), GATE.jetN] },   // down to the lake's south shore, then round the jetty's west side on a bank (its gate is on its north side, under the cliffs)
          { w: 2.8, route: true, name: 'the Thornwood to Bogmire', to: 'Bogmire', pts: [GATE.thornE, off(GATE.thornE, 30, 0), off(GATE.bogW, -36, 0), GATE.bogW] },
          { w: 2.4, route: true, name: 'Bogmire to the fen\u2019s dark heart', to: 'The fen\u2019s dark heart', pts: [GATE.bogN, off(GATE.bogN, 0, -26), off(GATE.heartS, 0, 26), GATE.heartS] },
          { w: 3.3, route: true, stone: 'cob', stoneTo: 'cob', name: 'Wickhollow to Io\u2019s cottage', to: 'Io\u2019s cottage', pts: [[0.5, 46.6], [1, 62], [-4, 85], [-12, 108], [-20, 130], [-24, 160], off(GATE.cotN, 0, -26), GATE.cotN] },
          { w: 2.6, pts: [[-20, 128.5], [-29, 127.5], [-39, 128]] },                                                              // the lane off it to the camp's gate
        ],
        // the camp's meadow: levelled, trampled, clear of trees, with the town's clearer fog round its lanterns
        flats: [{ x: -70, z: 128, r: 36, name: 'The Moon Faire', night: { fog: [0.075, 0.08, 0.16], near: 30, far: 115 } }],
        trees: { step: 5.2, woods: 0.8, thorn: 0.9, thornShare: 0.85, firShare: 0.25 },
        herbs: { step: 13, woods: 0.3, thorn: 0.6, away: 10, kinds: [
          { id: 'moonpetal', name: 'Moonpetal', petal: '#d6ecff', heart: '#fff6c8' },
          { id: 'lavender', name: 'Lavender', petal: '#c9a6ff', heart: '#f4e2ff' },
        ] },
      },
      // ---- the Moon Faire's camp: Moon Faire's fair kit (fair/ow-kit.js), set down by fair/fair.js ----
      // Each piece: [kind, { x, z, ... }], metres east and south of the camp's middle (the well). face: turned to face the
      // middle. turn: degrees (0 its front to the south, 90 to the east). The layout is the hub's (hub's call): the big top
      // at the north, tents either side, a half ring of stalls to the south, wagons drawn up behind, the gate to the east
      // where the lane comes in from the south road.
      camp: {
        x: -70, z: 128, r: 36,
        pieces: [
          ['well', { x: 0, z: 0 }],
          ['tentRound', { x: 0, z: -21, r: 5.2, wall: 2.6, top: 7.2, canvas: 'red', door: 'bigtop', roof: 'bigtop', face: true }],
          ['tentRound', { x: -23, z: -9, r: 3.1, canvas: 'blue', door: 'bigtop', face: true }],
          ['tentRound', { x: 23, z: -11, r: 2.9, canvas: 'damask', door: 'bigtop', face: true }],
          ['tentSquare', { x: -26, z: 11, canvas: 'damask', door: 'bigtop', face: true }],
          ['tentSquare', { x: 26, z: 13, canvas: 'blue', door: 'bigtop', face: true }],
          ['stall', { x: -14, z: 15, front: 'lamp', face: true }],
          ['stall', { x: -5, z: 20.5, front: 'herb', face: true }],
          ['stall', { x: 5, z: 20.5, front: 'moon', face: true }],
          ['stall', { x: 14, z: 15, front: 'brass', face: true }],
          ['booth', { x: 15, z: -3, face: true }],
          ['wagon', { x: -15, z: -30, turn: 8 }],
          ['wagon', { x: 16, z: -30, turn: -6, roof: 'shingle' }],
          ['gate', { x: 31, z: 0, turn: 90 }],
          ['ovenCart', { x: -9, z: 8, face: true }],
          ['pieCart', { x: 10, z: -7, face: true }],
          ['brazier', { x: -6, z: -8 }], ['brazier', { x: 7, z: 9 }],
        ].concat([0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i + 0.5) / 8 * Math.PI * 2; return ['lanternPost', { x: Math.round(Math.cos(a) * 95) / 10, z: Math.round(Math.sin(a) * 95) / 10 }]; }))
          .concat([['lanternPost', { x: 25, z: -2.2 }], ['lanternPost', { x: 25, z: 2.2 }], ['lanternPost', { x: 34, z: -2.4 }], ['lanternPost', { x: 34, z: 2.4 }], ['lanternPost', { x: -4, z: -14 }], ['lanternPost', { x: 4, z: -14 }]])
          .concat([['crate', { x: -17, z: 3, turn: 20 }], ['crateTall', { x: -18.3, z: 4.2 }], ['barrel', { x: -16.3, z: 5.1 }], ['bale', { x: 17, z: -15, turn: 30 }], ['bale', { x: 18.3, z: -14.2, turn: -15 }],
            ['keg', { x: 17, z: 8 }], ['table', { x: -3, z: 11, turn: 10 }], ['table', { x: 4, z: -12 }], ['barrel', { x: 21, z: 9 }], ['crate', { x: -21, z: -17, turn: -30 }], ['barrel', { x: -20, z: -18.4 }]]),
      },
    },
  };
})(window);
