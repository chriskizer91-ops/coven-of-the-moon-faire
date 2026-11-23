// zone-2.js: zone 2, the Warm Roads and Dawnroost, on the map of Aethermoor at one third size
// (Coven of the Moon Faire, November 23, 2026). The same engine and the same rules as zone 1 (game/places/zone-1.js):
// each place stands at its own pin on Chris's map and at the map's height; the land between is the map; the roads find
// their own way between the gates. The places are the new Envoi's five for zone 2, as they are.
(function (G) {
  'use strict';
  const PL = G.W3D_PLACES;
  // ---- where things stand. The Warm Roads camp's pin on the map, (820, 1530), is this land's (0, 0) ----
  const K = 10 / 3, PIN0 = [820, 1530], at = (ax, ay) => [+((ax - PIN0[0]) * K).toFixed(1), +((ay - PIN0[1]) * K).toFixed(1)];
  const AT = { camp: [0, 0], ember: at(1000, 1420), road: at(1185, 1250), dawnroost: at(1325, 1098), node: at(1338, 985) };
  const off = (p, dx, dz) => [+(p[0] + dx).toFixed(1), +(p[1] + dz).toFixed(1)];

  // ---- the three wild places, opened at their gates ----
  // Each is open ground inside its own hedge of trees, 184 m by 154 m, and its trail used to stop at the hedge. Now each
  // trail runs on to the edge of the place's own ground, where the land's road takes over: a strip she can walk, with no
  // trees standing in it. [x0, y0, x1, y1] in the place's painting pixels.
  const open = (id, gates) => { const T = PL[id]; T.walkAdd = (T.walkAdd || []).concat(gates.map(([a, b, c, d]) => ({ poly: [[a, b], [c, b], [c, d], [a, d]], ground: 'dirt' })));
    G.W3D_TREES[id] = (G.W3D_TREES[id] || []).filter(([x, y]) => !gates.some(([a, b, c, d]) => x > a - 40 && x < c + 40 && y > b - 50 && y < d + 50)); };
  open('warm-roads-camp', [[2734, 402, 3072, 478]]);                                   // east, to the Ember Line road
  open('ember-line-road', [[-1536, 554, -1130, 626], [962, -1024, 1038, -852]]);       // west, to the camp; north, to the forest road
  open('dawnroost-road', [[726, -1024, 842, -756], [932, 1774, 1048, 2048]]);          // north, to Dawnroost; south, to the Ember Line road
  // each place's gates, as metres from its own middle
  const GATE = { campE: off(AT.camp, 92.2, -3.6), emberW: off(AT.ember, -92.2, 3.9), emberN: off(AT.ember, 9.3, -76.8), roadS: off(AT.road, 8.9, 76.8), roadN: off(AT.road, 0.6, -76.8),
    dawnS: off(AT.dawnroost, -5.1, 46.6), dawnN: off(AT.dawnroost, -6.0, -46.6), nodeS: off(AT.node, 0, 46.6) };

  PL['zone-2'] = {
    id: 'zone-2', name: 'The Warm Roads and Dawnroost', size: [1536, 1024],
    start: PL['warm-roads-camp'].start, startFace: PL['warm-roads-camp'].startFace,
    zone: {
      places: [
        { id: 'warm-roads-camp', at: AT.camp },                    // where the ship sets down
        { id: 'ember-line-road', at: AT.ember },                   // 700 m east-north-east
        { id: 'dawnroost-road', at: AT.road },                     // 770 m on, north-east: the forest road
        { id: 'dawnroost', at: AT.dawnroost, open: true },         // the Wardens' town, 690 m on
        { id: 'dawnroost-node', at: AT.node, open: true },         // its living node, 380 m north of the town
      ],
      land: {
        bounds: [-267, -2033, 2000, 400],        // 2.3 km by 2.4 km: the map from (740, 920) to (1420, 1650)
        level: -1.0, roll: [0.8, 1.15],
        atlas: { height: "art/world/aethermoor-terrain-height.png", kinds: "art/world/aethermoor-terrain-kinds.png",
          map: { origin: PIN0, k: K, vk: 1 / 3 }, waterY: -1.5,
          water: { tex: 'shared_water_dark', rep: 6, flow: [0.003, 0.0015] } },
        thornK: () => 0,
        names: {},
        nameAt: (x, z, f) => (f.fen > 0.5 ? 'The marsh' : f.re < 12 ? 'The Warm Roads' : f.pine > 0.5 ? 'The cold pines' : 'The cold hills'),
        ground: { grass: 'shared_grass_meadow', bramble: 'wilds_heath_ground', moss: 'wilds_heath_ground', dirt: 'shared_warm_road', rock: 'wilds_boulder_stone',
          cob: 'shared_warm_road', pave: 'shared_warm_road', repStone: [3.2, 2.6], fen: 'wilds_heath_ground', repFen: 4.0, fenTint: [0.62, 0.7, 0.68],
          rep: [4.0, 3.4, 2.6, 3.4], grassTint: [0.5, 0.56, 0.58], brambleTint: [0.8, 0.84, 0.9], mossTint: [1, 1, 1], dirtTint: [0.9, 0.9, 0.95] },
        shade: [0.78, 0.7],
        // the cold country at night: a pale, thin mist, a little farther seen than Wickhollow's woods
        night: {
          woods: { fog: [0.14, 0.145, 0.26], near: 16, far: 84 },
          thorn: { fog: [0.14, 0.145, 0.26], near: 16, far: 84, sky: [0.6, 0.6, 0.72], moon: [0.42, 0.44, 0.58] },
        },
        // `route`: the road finds its own way over the hills between the points given (engine/land/land.js)
        roads: [
          { w: 3.2, route: true, name: 'the Warm Roads camp to the Ember Line road', to: 'The Ember Line road', pts: [GATE.campE, off(GATE.campE, 30, 0), off(GATE.emberW, -30, 0), GATE.emberW] },
          { w: 3.2, route: true, name: 'the Ember Line road to the forest road', to: 'The forest road to Dawnroost', pts: [GATE.emberN, off(GATE.emberN, 0, -30), off(GATE.roadS, 0, 30), GATE.roadS] },
          { w: 3.2, route: true, name: 'the forest road to Dawnroost', to: 'Dawnroost', pts: [GATE.roadN, off(GATE.roadN, 0, -30), off(GATE.dawnS, 0, 30), GATE.dawnS] },
          { w: 2.8, route: true, name: 'Dawnroost to its living node', to: 'Dawnroost\u2019s living node', pts: [GATE.dawnN, off(GATE.dawnN, 0, -30), off(GATE.nodeS, 0, 30), GATE.nodeS] },
        ],
        trees: { step: 5.2, woods: 0.8, thorn: 0.9, thornShare: 0, firShare: 0.4 },
        herbs: { step: 13, woods: 0.3, thorn: 0.6, away: 10, kinds: [
          { id: 'moonpetal', name: 'Moonpetal', petal: '#d6ecff', heart: '#fff6c8' },
          { id: 'lavender', name: 'Lavender', petal: '#c9a6ff', heart: '#f4e2ff' },
        ] },
      },
    },
  };
})(window);
