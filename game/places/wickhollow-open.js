// wickhollow-open.js: four small changes to Wickhollow's own data, so the town opens onto land (Coven of the Moon Faire,
// November 18, 2026). Load it after places/wickhollow.js, before the land's or the zone's data.
(function (G) {
  'use strict';
  const place = G.W3D_PLACES.wickhollow;
  // 1. She can walk anywhere on the town's own ground that isn't water or solid, right to its edge (before: only inside
  //    the painting, behind a hedge of bushes).
  place.bounds = [[-460, -420], [1996, -420], [1996, 1444], [-460, 1444]];
  place.thicket = false;
  // 2. Its far hills stay off: the land draws them round the camera instead, wherever she goes.
  place.night = Object.assign({}, place.night, { hills: false });
  // 3. Its roads out are just roads now, not doors to another page.
  place.exits = [];
  // 4. Its lake and its river used to stop a few metres past the painting. Now they run on to the edge of the town's
  //    ground, where the land's lake and river carry on (the same water, the same level).
  for (const w of place.water) w.poly = w.poly.map(([x, y]) => [x === -200 ? -700 : x, y === -200 ? -700 : y === 1300 ? 1800 : y]);
  // and the textures the land wears that the town didn't already carry: the Thornwood's two grounds
  place.textures = place.textures.concat([
    { id: 'thorn_bramble_ground', made: "./../texture-packs/made-web/thorn_bramble_ground.webp" },
    { id: 'thorn_moss_ground', made: "./../texture-packs/made-web/thorn_moss_ground.webp" },
  ]);
})(window);
