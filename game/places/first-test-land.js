// first-test-land.js: the open land round Wickhollow for the first test (Coven of the Moon Faire, November 18, 2026):
// the woods round the town, the lake to the west, the river running north to south past its east side, and across the
// town's bridge the Thornwood: bare thorny trees in clumps, heavy pale fog, a road east, a trail to a ring of standing
// stones, another to a still pool, and herbs growing on the ground for Io to find.
// It gives Wickhollow's data `land`, which the land engine reads (engine/land/land.js). Load it after
// places/wickhollow.js and places/wickhollow-open.js (which opens the town onto the land).
// Everything in `land` is metres: x east, z south, the square's middle at 0, 0. The town's own ground reaches 49.1 m
// east and west of that and 46.6 m north and south; the land takes over there.
// The shape of this land is made up for the test (hub's call). The real zone 1 will take its shape from the 3D map.
(function (G) {
  'use strict';
  const place = G.W3D_PLACES.wickhollow;
  const ss = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };

  // ---- the land ----
  place.land = {
    bounds: [-385, -255, 385, 255],          // 770 m by 510 m: about the size of Moon Faire's whole land
    level: -1.0, roll: [0.8, 1.15],          // the ground's middle height; how much it rolls in the woods, and in the thorns
    // how much of the Thornwood a spot is (0 the woods round the town, 1 the thorns): it begins past the river's far bank
    thornK: (x, z) => ss(44, 72, x),
    names: { town: 'Wickhollow', woods: 'The woods round Wickhollow', thorn: 'The Thornwood' },
    // the ground: Chris's textures, how many metres each repeats over, and the tint each wears in its own place's 3D
    ground: { grass: 'shared_grass_meadow', bramble: 'thorn_bramble_ground', moss: 'thorn_moss_ground', dirt: 'shared_dirt_track', rock: 'thorn_rock_mossy',
      cob: 'shared_cobbles_town', pave: 'wick_bridge_paving', repStone: [3.2, 2.6],
      rep: [4.0, 3.4, 2.6, 4.0], grassTint: [0.5, 0.58, 0.55], brambleTint: [0.9, 0.86, 0.95], mossTint: [1, 1, 1], dirtTint: [1, 1, 1] },
    shade: [0.78, 0.7],                      // how much light reaches the ground under the woods, and under the thorns
    // the night past the town: thicker fog in the woods; thickest, and paler, in the thorns (the Thornwood's own colours)
    night: {
      woods: { fog: [0.085, 0.09, 0.175], near: 20, far: 92 },
      thorn: { fog: [0.16, 0.165, 0.3], near: 11, far: 62, sky: [0.58, 0.58, 0.72], moon: [0.4, 0.44, 0.6] },
    },
    // roads: the middle line of each, and its width. The first two leave the town where its own roads reach its edge,
    // and keep the town's stone underfoot (`stone`: its bridge's paving, its square's cobbles) for their first steps
    roads: [
      { w: 4.0, stone: 'pave', pts: [[49.1, -7.1], [62, -7.4], [80, -11], [104, -20], [128, -24], [150, -16], [176, -4], [205, 2], [236, -6], [268, -18], [300, -22], [340, -14], [386, -10]] },   // east, over the bridge and through the Thornwood
      { w: 3.3, stone: 'cob', pts: [[0.5, 46.6], [1, 60], [-4, 85], [-10, 115], [-6, 150], [4, 190], [10, 230], [8, 256]] },                                                                 // south, toward Io's cottage
      { w: 1.8, pts: [[128, -24], [138, -44], [150, -68], [164, -88]] },                                                                                                       // a trail to the standing stones
      { w: 1.8, pts: [[150, -16], [155, 8], [149, 36], [151, 56]] },                                                                                                           // a trail to the still pool
    ],
    // rivers: [x, z, width] along the middle. Each starts on the town's edge, as wide as the town's river is there
    rivers: [
      { level: -2.5, bed: -4.6, tex: 'shared_water_river', rep: 4, flow: [0.0, 0.05], pts: [[24.6, -46.6, 5.1], [25.5, -70, 5.1], [22, -100, 5.4], [27, -135, 5.0], [21, -175, 5.4], [26, -215, 5.0], [23, -262, 5.2]] },
      { level: -3.9, bed: -5.0, tex: 'shared_water_river', rep: 4, flow: [0.0, 0.05], pts: [[32.7, 46.6, 12.3], [33, 62, 11], [31, 85, 8], [34, 115, 6.5], [30, 150, 6], [35, 190, 6], [31, 230, 6], [33, 262, 6]] },
    ],
    // lakes: the town's lake carries on west, north and south of it; and a still pool in the Thornwood
    lakes: [
      { level: -2.3, bed: -3.4, tex: 'shared_water_dark', rep: 6, flow: [0.004, 0.002],
        poly: [[-26.3, -46.6], [-30, -70], [-45, -100], [-80, -125], [-130, -130], [-175, -105], [-195, -60], [-200, 0], [-190, 55], [-160, 95], [-110, 115], [-60, 100], [-35, 75], [-28.0, 46.6]] },
      { level: -3.0, bed: -3.9, tex: 'shared_water_dark', rep: 5, flow: [0.002, 0.001],
        poly: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((i) => { const a = i / 18 * Math.PI * 2, r = 9.5 + 2.2 * Math.sin(a * 2 + 0.6) + 1.3 * Math.sin(a * 5 + 2.1); return [151 + Math.cos(a) * r * 1.15, 68 + Math.sin(a) * r * 0.85]; }) },
    ],
    // where no tree grows: the stone ring's clearing, the pool's bank
    clearings: [{ x: 170, z: -98, r: 14 }, { x: 151, z: 68, r: 15 }],
    // a ring of nine standing stones, one pair carrying a lintel, and a stone in the middle
    stones: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => { const a = i / 9 * Math.PI * 2 + 0.2; return { x: 170 + Math.cos(a) * 7, z: -98 + Math.sin(a) * 7, h: 2.6, w: 0.95 }; })
      .concat([{ x: 170, z: -98, h: 1.1, w: 1.5 }]),
    // trees: one chance of a tree every `step` metres each way; how many of those chances are taken in the woods and in
    // the thorns' clumps; how many of the thorns' trees are bare thorn trees; how many of the woods' are firs
    trees: { step: 5.2, woods: 0.8, thorn: 0.9, thornShare: 0.85, firShare: 0.25 },
    // herbs: one chance every `step` metres each way, taken this often in the woods and in the thorns; none nearer the
    // town's ground than `away` metres. The names are Envoi's two healing herbs
    herbs: { step: 13, woods: 0.3, thorn: 0.6, away: 10, kinds: [
      { id: 'moonpetal', name: 'Moonpetal', petal: '#d6ecff', heart: '#fff6c8' },
      { id: 'lavender', name: 'Lavender', petal: '#c9a6ff', heart: '#f4e2ff' },
    ] },
  };
})(window);
