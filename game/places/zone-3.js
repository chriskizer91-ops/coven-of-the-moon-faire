// zone-3.js: zone 3, the northern wilds and the shipyard, on the map of Aethermoor at one third size
// (Coven of the Moon Faire, November 23, 2026). The same engine and the same rules as zones 1 and 2: each place stands
// at its own pin on Chris's map and at the map's height; the land between is the map; the roads find their own way
// between the gates. The places are the new Envoi's five for zone 3, as they are.
(function (G) {
  'use strict';
  const PL = G.W3D_PLACES;
  // ---- where things stand. The northern camp's pin on the map, (1150, 612), is this land's (0, 0) ----
  const K = 10 / 3, PIN0 = [1150, 612], at = (ax, ay) => [+((ax - PIN0[0]) * K).toFixed(1), +((ay - PIN0[1]) * K).toFixed(1)];
  const AT = { camp: [0, 0], grove: at(1390, 655), moor: at(1680, 735), cross: at(1960, 820), yard: at(2097, 684) };
  // (Hub's call, for Chris to overrule: the shipyard's pin, (2097, 599), is on a headland 25 m above the sea, and the yard is a rock in
  // the sea at the end of a long bridge from the south. So it stands in the bay just off that headland, 280 m south of its pin.)
  const off = (p, dx, dz) => [+(p[0] + dx).toFixed(1), +(p[1] + dz).toFixed(1)];
  // ---- the wild places, opened at their gates (as in zone 2): [x0, y0, x1, y1] in the place's painting pixels ----
  const open = (id, gates, ground) => { const T = PL[id], clear = ([x, y]) => !gates.some(([a, b, c, d]) => x > a - 40 && x < c + 40 && y > b - 50 && y < d + 50);
    T.walkAdd = (T.walkAdd || []).concat(gates.map(([a, b, c, d]) => ({ poly: [[a, b], [c, b], [c, d], [a, d]], ground: ground || 'dirt' })));
    G.W3D_TREES[id] = (G.W3D_TREES[id] || []).filter(clear); if (Array.isArray(T.extraTrees)) T.extraTrees = T.extraTrees.filter(clear); };
  open('northern-camp', [[2692, 484, 3072, 550]]);                                    // east, to Eldergrove's edge
  open('eldergrove-edge', [[-1536, 432, -1128, 508], [2700, 577, 3500, 663]]);        // west, to the camp; east, to the cold moor
  open('cold-moor', [[-1536, 512, -1124, 620], [2692, 514, 3072, 608]]);              // west, to Eldergrove's edge; east, to the crossroads
  open('crossroads', [[-2100, 434, -1384, 530], [708, -1480, 824, -902]]);            // west, to the cold moor; north, to the shipyard (its own ground is wider: 230 m by 200 m)
  open('shipyard', [[704, 1004, 822, 1700]], 'cob');                                  // the long bridge south, on past the painting to where its stones end
  // each place's gates, as metres from its own middle
  const GATE = { campE: off(AT.camp, 92.2, 0.25), groveW: off(AT.grove, -92.2, -2.1), groveE: off(AT.grove, 109.3, 5.4), moorW: off(AT.moor, -92.2, 2.7), moorE: off(AT.moor, 92.2, 2.45),
    crossW: off(AT.cross, -114.7, -1.5), crossN: off(AT.cross, -0.1, -99.6), yardS: off(AT.yard, -0.2, 59.4) };

  const SHORE = [2850, 286];   // where the road down the hill meets the causeway, on the shelf above the shore

  PL['zone-3'] = {
    id: 'zone-3', name: 'The northern wilds and the shipyard', size: [1536, 1024],
    start: PL['northern-camp'].start, startFace: PL['northern-camp'].startFace,
    zone: {
      places: [
        { id: 'northern-camp', at: AT.camp },                      // where the ship sets down
        { id: 'eldergrove-edge', at: AT.grove },                   // 810 m east
        { id: 'cold-moor', at: AT.moor },                          // 1 km on, east-south-east
        { id: 'crossroads', at: AT.cross },                        // 980 m on: the northern crossroads
        { id: 'shipyard', at: AT.yard, sea: true, waterY: -2.6 },  // 640 m north-east of the crossroads, out in the bay: a rock in its own sea, level with the map's
      ],
      land: {
        bounds: [-267, -373, 3467, 993],         // 3.7 km by 1.4 km: the map from (1070, 500) to (2190, 910)
        level: -1.0, roll: [0.8, 1.15],
        atlas: { height: "art/world/aethermoor-terrain-height.png", kinds: "art/world/aethermoor-terrain-kinds.png",
          map: { origin: PIN0, k: K, vk: 1 / 3 }, waterY: -1.5,
          water: { tex: 'shipyard_icy_sea', rep: 8, flow: [0.002, 0.001] } },
        thornK: () => 0,
        names: {},
        nameAt: (x, z, f) => (f.fen > 0.5 ? 'The frozen marsh' : f.re < 12 ? 'The north road' : f.pine > 0.5 ? 'The frosted pines' : 'The northern wilds'),
        ground: { grass: 'shared_grass_frosted', bramble: 'moor_heather_frost', moss: 'moor_heather_frost', dirt: 'frozen_earth_path', rock: 'boulder_mossy_frost',
          cob: 'crossroads_road_paving', pave: 'crossroads_road_paving', repStone: [3.2, 2.6], fen: 'moor_bracken_heather', repFen: 4.0, fenTint: [0.7, 0.76, 0.8],
          rep: [4.0, 3.4, 2.6, 4.0], grassTint: [0.56, 0.62, 0.66], brambleTint: [0.8, 0.84, 0.9], mossTint: [1, 1, 1], dirtTint: [0.95, 0.95, 1] },
        shade: [0.8, 0.72],
        // the north at night: cold, clear and blue
        night: {
          woods: { fog: [0.15, 0.17, 0.29], near: 16, far: 86 },
          thorn: { fog: [0.15, 0.17, 0.29], near: 16, far: 86, sky: [0.6, 0.62, 0.74], moon: [0.44, 0.46, 0.6] },
        },
        roads: [
          { w: 2.8, route: true, name: 'the northern camp to Eldergrove\u2019s edge', to: 'Eldergrove\u2019s edge', pts: [GATE.campE, off(GATE.campE, 30, 0), off(GATE.groveW, -30, 0), GATE.groveW] },
          { w: 2.8, route: true, name: 'Eldergrove\u2019s edge to the cold moor', to: 'The cold moor', pts: [GATE.groveE, off(GATE.groveE, 30, 0), off(GATE.moorW, -30, 0), GATE.moorW] },
          { w: 2.8, route: true, name: 'the cold moor to the crossroads', to: 'The northern crossroads', pts: [GATE.moorE, off(GATE.moorE, 30, 0), off(GATE.crossW, -30, 0), GATE.crossW] },
// The shipyard stands out in the bay, under the crossroads' hill. The coast is steep all round, so the road comes down the
          // hill to a shelf above the shore (finding its own way), and from there one long stone causeway slopes down over the
          // sea to the yard's bridge (drawn by hand: points less than 150 m apart are kept as they are).
          { w: 3.2, route: true, stone: 'pave', name: 'the crossroads down to the shore', pts: [GATE.crossN, off(GATE.crossN, 0, -30), SHORE] },
          { w: 4.4, stone: 'pave', stoneTo: 'pave', stoneAll: true, name: 'the long causeway to the shipyard', to: 'The shipyard',
            pts: [SHORE, [2950, 300], [3050, 315], off(GATE.yardS, -6, 30), off(GATE.yardS, 0, 30), GATE.yardS] },
        ],
        trees: { step: 5.2, woods: 0.8, thorn: 0.9, thornShare: 0, firShare: 0.7, noLeaf: true },
        herbs: { step: 13, woods: 0.3, thorn: 0.6, away: 10, kinds: [
          { id: 'moonpetal', name: 'Moonpetal', petal: '#d6ecff', heart: '#fff6c8' },
          { id: 'lavender', name: 'Lavender', petal: '#c9a6ff', heart: '#f4e2ff' },
        ] },
      },
    },
  };
})(window);
