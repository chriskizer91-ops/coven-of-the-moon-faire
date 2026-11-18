// zone-1.js: zone 1, "Wickhollow and the fen", as one open land with its places standing in it (Coven of the Moon Faire,
// November 18, 2026). Load it after every place's own file and after places/wickhollow-open.js.
//
// It holds the zone's six places: Wickhollow; the Thornwood across its bridge; Bogmire past the Thornwood, and the
// fen's dark heart north of Bogmire; Io's cottage down the south road; the jetty west of the cottage.
// Still to come: the Moon Faire's camp, where the game starts (docs/BOARD.md).
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

  PL['zone-1'] = {
    id: 'zone-1', name: 'Wickhollow and the fen', size: [1536, 1024],
    start: [777, 600], startFace: Math.PI,       // in Wickhollow's square (the zone's pixels are Wickhollow's painting's)
    zone: {
      // where each place stands. Its own ground reaches out round that spot: Wickhollow 49 m east and west, 47 m north
      // and south; the Thornwood 92 m and 77 m. autoWater: its streams and shores are carried on past its edge by rule
      // open: a town that used to be closed in at its painting's edge, opened to the edge of its own ground
      places: [
        { id: 'wickhollow', at: [0, 0] },                                  // (opened by places/wickhollow-open.js)
        { id: 'thornwood', at: [226.3, 0], autoWater: true },              // its west gate 85 m from Wickhollow's bridge road's end
        { id: 'bogmire', at: [462.6, 9.1], open: true },                   // its west road 95 m from the Thornwood's east gate
        { id: 'bogmire-heart', at: [463.5, -159.1], open: true },          // its south road 75 m north of Bogmire's north road
        { id: 'cottage', at: [-30, 205], open: true },                     // its north road 112 m south of Wickhollow's south road
        { id: 'jetty', at: [-190, 250], open: true },                      // its north road 62 m west of the cottage's west road
      ],
      land: {
        bounds: [-385, -300, 570, 345],          // 955 m by 645 m
        level: -1.0, roll: [0.8, 1.15],
        // how much of the thorn country a spot is (0 the woods round the town, 1 the thorns): from the river's far bank east
        thornK: (x, z) => ss(44, 72, x) * (1 - ss(345, 400, x)),
        names: { woods: 'The woods round Wickhollow', thorn: 'The thorn country' },
        // what the open land is called where she stands (past the thorns, the fen's edge)
        nameAt: (x, z) => (x > 372 ? 'The fen’s edge' : x > 58 ? 'The thorn country' : z > 120 ? 'The south woods' : 'The woods round Wickhollow'),
        ground: { grass: 'shared_grass_meadow', bramble: 'thorn_bramble_ground', moss: 'thorn_moss_ground', dirt: 'shared_dirt_track', rock: 'thorn_rock_mossy',
          cob: 'shared_cobbles_town', pave: 'wick_bridge_paving', repStone: [3.2, 2.6],
          rep: [4.0, 3.4, 2.6, 4.0], grassTint: [0.5, 0.58, 0.55], brambleTint: [0.9, 0.86, 0.95], mossTint: [1, 1, 1], dirtTint: [1, 1, 1] },
        shade: [0.78, 0.7],
        night: {
          woods: { fog: [0.085, 0.09, 0.175], near: 20, far: 92 },
          thorn: { fog: [0.16, 0.165, 0.3], near: 11, far: 62, sky: [0.58, 0.58, 0.72], moon: [0.4, 0.44, 0.6] },
        },
        // roads: the middle line of each, its width, and the town's stone it carries out from its first point (`stone`)
        // or in to its last (`stoneTo`), if any
        roads: [
          { w: 4.0, stone: 'pave', pts: [[49.1, -7.1], [62, -7.4], [80, -10.5], [100, -12]] },                         // east from Wickhollow's bridge
          { w: 2.6, pts: [[100, -12], [118, -9.5], [134.2, -7.3]] },                                                    // narrowing to the Thornwood's west gate
          { w: 2.6, pts: [[318.4, 1.8], [340, 3], [365, -3], [390, -2], [413.5, 1.8]] },                               // the Thornwood's east gate to Bogmire's west road
          { w: 2.4, pts: [[463.5, -37.5], [466, -58], [460, -80], [462, -100], [463.5, -112.5]] },                     // Bogmire's north road to the fen's dark heart
          { w: 3.3, stone: 'cob', stoneTo: 'cob', pts: [[0.5, 46.6], [1, 62], [-4, 85], [-14, 112], [-28, 136], [-38.6, 158.4]] },     // south from Wickhollow to Io's cottage
          { w: 2.6, stone: 'cob', stoneTo: 'cob', pts: [[-79.1, 200.4], [-100, 198], [-130, 188], [-165, 186], [-186, 192], [-190, 203.4]] },        // the cottage's west road round to the jetty
          { w: 2.6, stone: 'cob', pts: [[-30.9, 251.6], [-28, 270], [-34, 300], [-30, 330], [-32, 350]] },                           // the cottage's south road, on toward the world
        ],
        // Wickhollow's river, carried on north and south: [x, z, width] along the middle
        rivers: [
          { level: -2.5, bed: -4.6, tex: 'shared_water_river', rep: 4, flow: [0.0, 0.05], pts: [[24.6, -46.6, 5.1], [25.5, -70, 5.1], [22, -100, 5.4], [27, -135, 5.0], [21, -175, 5.4], [26, -215, 5.0], [23, -262, 5.2], [25, -310, 5.2]] },
          { level: -3.9, bed: -5.0, tex: 'shared_water_river', rep: 4, flow: [0.0, 0.05], pts: [[32.7, 46.6, 12.3], [33, 62, 11], [31, 85, 8], [34, 115, 6.5], [30, 150, 6], [35, 190, 6], [31, 230, 6], [33, 270, 6], [32, 310, 6]] },
        ],
        // Wickhollow's lake, carried on west, north and south of the town
        lakes: [
          { level: -2.3, bed: -3.4, tex: 'shared_water_dark', rep: 6, flow: [0.004, 0.002],
            poly: [[-26.3, -46.6], [-30, -70], [-45, -100], [-80, -125], [-130, -130], [-175, -105], [-195, -60], [-200, 0], [-190, 55], [-160, 95], [-110, 115], [-60, 100], [-35, 75], [-28.0, 46.6]] },
        ],
        trees: { step: 5.2, woods: 0.8, thorn: 0.9, thornShare: 0.85, firShare: 0.25 },
        herbs: { step: 13, woods: 0.3, thorn: 0.6, away: 10, kinds: [
          { id: 'moonpetal', name: 'Moonpetal', petal: '#d6ecff', heart: '#fff6c8' },
          { id: 'lavender', name: 'Lavender', petal: '#c9a6ff', heart: '#f4e2ff' },
        ] },
      },
    },
  };
})(window);
