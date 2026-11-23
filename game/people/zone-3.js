// zone-3.js (people): who stands where in zone 3, how its story moves, and the knight's light (Coven of the Moon Faire,
// November 23, 2026). The people and their lines are the story job's (game/talk/zone-3.js, game/talk/cast.js;
// docs/lore/story-zones-2-4.md). Where each stands is the hub's call; in the shipyard, mostly where the new Envoi stood
// them. Their bodies are the fair folk's other shapes for now (hub's call), until they are painted anew.
// A spot is `place: [the place's id, x, y]` in that place's painting, with `look` the spot they face.
(function (G) {
  'use strict';
  const W3D = G.W3D; W3D.PEOPLE = W3D.PEOPLE || {}; W3D.STORY = W3D.STORY || {}; W3D.THINGS = W3D.THINGS || {};
  const CAMP = { place: ['northern-camp', 590, 470], look: [662, 420] }, SLIP = { place: ['shipyard', 800, 384], look: [764, 240] };
  W3D.PEOPLE['zone-3'] = {
    people: [
      // the Grey Hat: at the northern camp where the ship set down; once the coven has gone, at the shipyard's slip
      Object.assign({ id: 'captain', name: 'The Grey Hat', trade: 'the captain', body: 'grey-hat-captain' }, CAMP),
      // Eldergrove's edge
      { id: 'cutter', name: 'The bramble-cutter', trade: 'the bramble-cutter', body: 'gate-keeper', place: ['eldergrove-edge', 160, 500], look: [60, 470] },      // on the road, just inside from the camp's side
      // the shipyard
      { id: 'ysmera', name: 'Ysmera Brightkeel', trade: 'the shipmaster', body: 'fortune-teller-opus', place: ['shipyard', 530, 300], look: [700, 460] },   // at the corner of the tall house
      { id: 'gil', name: 'Old Gil', trade: 'the innkeeper', body: 'old-night-watchman-opus', place: ['shipyard', 436, 482], look: [520, 560] },              // before his bunkhouse
      { id: 'tock', name: 'Tock', trade: 'the shipwright', body: 'fair-baker-opus', size: 0.62, place: ['shipyard', 1000, 400], look: [764, 240] },        // a gnome, by the slip
      { id: 'pim', name: 'Pim', trade: 'the herb-seller', body: 'pie-seller', size: 0.62, place: ['shipyard', 1189, 532], look: [1100, 600] },             // a gnome, before her hall
      { id: 'passenger', name: 'The last passenger', trade: 'the passenger', body: 'ballad-singer', place: ['shipyard', 300, 600], look: [150, 632] },    // on the lower quay, by the west dock
    ],
  };

  // ---- the knight of light, seen on the road east of the crossroads when she is due: a tall pale light, no body yet
  // (hub's call: her fighting model is the fights job's; on the land she is "all light") ----
  W3D.THINGS['zone-3'] = [{
    id: 'knight', place: ['crossroads', 1500, 490],
    make: (t, k) => { const T = k.THREE, x = t.x = k.X(1500), z = t.z = k.Z(490), y = k.ground(x, z), g = new T.Group();
      for (const a of [0, Math.PI / 2]) { const m = k.glow(0xfff0c8, 1, 1); m.scale.set(1.5, 3.4, 1); m.rotation.y = a; m.position.y = 1.35; g.add(m); }        // the tall light she is
      const halo = k.glow(0xffe6b0, 9, 0.55); halo.rotation.x = -Math.PI / 2; halo.position.y = 0.08; g.add(halo);                                           // and the ground lit round her
      g.position.set(x, y, z); g.visible = false; k.scene.add(g); t.light = g; },
    look: (t, c) => { if (t.light) t.light.visible = c.stage === 2 && !c.won(); },
    tick: (t, c) => { if (t.light) { const on = c.stage === 2 && !c.won(); if (t.light.visible !== on) t.light.visible = on; if (on) t.light.rotation.y += 0.01; } },
  }];

  // ---- how zone 3's story moves. The stages are the story job's. What moves each on is the hub's call, made to fit
  // the map: the road from the camp runs past Eldergrove's edge, over the cold moor and through the crossroads to the
  // shipyard, so the coven comes to the shipyard first and meets the knight on the way back up to the crossroads. ----
  W3D.STORY['zone-3'] = {
    talk: 'COVEN_TALK_Z3', key: 'coven.story.z3.v1', gate: 'knightOfLight', first: 'landing',
    stages: [
      { to: 1, when: (c) => c.near('shipyard', 1) },                                               // refit: the coven has come to the shipyard
      { to: 2, when: (c) => c.stage >= 1 && c.heard('ysmera.01') && c.heard('captain.05') },       // the shipmaster and the Grey Hat have both been heard: back up to the crossroads
      { to: 3, when: (c) => c.stage >= 2 && c.won() },                                             // knight: she has been met, and has walked away
      { to: 4, when: (c) => c.stage >= 3 && c.heard('ysmera.name') },                              // named: Ysmera has said her name
    ],
    tellStage: { 1: 'refit', 2: 'north-road' },
    // the Grey Hat takes his ship to the shipyard once his landing talk is heard (he is moved when the coven is far off)
    each: (c) => { if (c.heard('captain.landing') && !c.moved) { c.moved = true; c.people.move('captain', SLIP); } },
    moments: [
      ['after-knight', (c) => c.stage >= 2 && c.won()],
      ['the-name', (c) => c.heard('ysmera.name')],
      ['leaving', (c) => c.stage >= 4 && c.heard('captain.11')],
      ['brambles', (c) => c.near('eldergrove-edge', 150) && !c.near('eldergrove-edge', 60)],     // on the road from the camp, before Eldergrove's edge
      ['grove', (c) => c.near('eldergrove-edge', 1)],
      ['campfire', (c) => c.played('grove') && c.spot('eldergrove-edge', 2500, 620, 16)],         // at Eldergrove's east end, the night before the moor and the crossroads
      ['shipyard', (c) => c.near('shipyard', 60)],
      // (until the fights job sets the knight's fight, she is met and walks away once the coven has stood before her)
      ['before-knight', (c) => c.stage === 2 && !c.won() && (c.gate ? c.gateD() < 40 : c.spot('crossroads', 1500, 490, 30)), (c) => { if (!c.gate) c.flag('gate', true); }],
    ],
  };
})(window);
