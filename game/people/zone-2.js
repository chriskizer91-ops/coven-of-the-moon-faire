// zone-2.js (people): who stands where in zone 2, how its story moves, and its three road stones (Coven of the Moon
// Faire, November 23, 2026). The people and their lines are the story job's (game/talk/zone-2.js, game/talk/cast.js;
// docs/lore/story-zones-2-4.md). Where each stands is the hub's call; in Dawnroost it is where the new Envoi stood them.
// Their bodies are the fair folk's other shapes for now (hub's call), until they are painted anew.
// A spot is `place: [the place's id, x, y]` in that place's painting, with `look` the spot they face.
(function (G) {
  'use strict';
  const W3D = G.W3D; W3D.PEOPLE = W3D.PEOPLE || {}; W3D.STORY = W3D.STORY || {}; W3D.THINGS = W3D.THINGS || {};
  W3D.PEOPLE['zone-2'] = {
    people: [
      // the Warm Roads camp: the ship has set down here
      { id: 'captain', name: 'The Grey Hat', trade: 'the captain', body: 'grey-hat-captain', place: ['warm-roads-camp', 500, 410], look: [575, 466] },             // west of the tents, where the ship came down
      { id: 'roadwarden', name: 'The roadwarden', trade: 'the roadwarden', body: 'old-night-watchman-opus', place: ['warm-roads-camp', 856, 470], look: [793, 456] },   // by the fire
      { id: 'carter', name: 'The carter', trade: 'the carter', body: 'chestnut-roaster-opus', place: ['warm-roads-camp', 2380, 486], look: [2290, 506] },             // by the broken cart, on the road east
      // Dawnroost (where the new Envoi stands them)
      { id: 'marta', name: 'Marta', trade: 'the keeper of the Wardens’ hall', body: 'old-lamplighter-opus', place: ['dawnroost', 376, 462], look: [420, 560] },     // before the Wardens' hall
      { id: 'brann', name: 'Brann', trade: 'the storekeeper', body: 'fair-baker-opus', place: ['dawnroost', 1084, 690], look: [1000, 640] },
      { id: 'tamsin', name: 'Tamsin', trade: 'the child', body: 'farm-lad', size: 0.72, place: ['dawnroost', 880, 478], look: [800, 560] },
    ],
  };

  // ---- the three dark nodes of the Ember Line: the old road stones with a glass eye that the Ember Line road already
  // has (game/places/ember-line-road.js, NODES). Io lights each with a small flame: its eye glows amber from then on.
  // (Hub's call: lit by walking up and pressing the button. The fights job may set a fight by each later.) ----
  const NODES = [
    { id: 'node-road', at: [585, 452], stand: [585, 486], d: 0.8, h: 2.3, eye: 1.7 },      // beside the road, by the bridge
    { id: 'node-ring', at: [240, 222], stand: [240, 252], d: 0.85, h: 3.2, eye: 2.35 },    // in the ring of standing stones, off to the west
    { id: 'node-rise', at: [1354, 168], stand: [1352, 200], d: 0.75, h: 2.1, eye: 1.55 },  // up on the rise, in the east
  ];
  W3D.THINGS['zone-2'] = NODES.map((n) => ({
    id: n.id, place: ['ember-line-road', n.stand[0], n.stand[1]], reach: 3.0, label: 'Light the road stone',
    can: (c) => c.stage >= 1 && !c.flag(n.id),
    use: (t, c, story) => { c.flag(n.id, true); story.setNodes(c.nodes + 1); },
    make: (t, k) => { const T = k.THREE, x = k.X(n.at[0]), zf = k.Z(n.at[1]), y = k.ground(x, zf) + n.eye, z = zf + n.d * (1 - 0.15 * n.eye / n.h) / 2 + 0.05;
      const eye = new T.Mesh(new T.CircleGeometry(0.17, 20), new T.MeshBasicMaterial({ color: 0xffa23a })); eye.position.set(x, y, z);       // the eye itself, amber
      const halo = k.glow(0xff7a1c, 2.6, 0.9); halo.position.set(x, y, z + 0.04);                                                           // its glow, on the stone's face
      const pool = k.glow(0xff7a1c, 7.5, 0.5); pool.rotation.x = -Math.PI / 2; pool.position.set(x, k.ground(x, zf + 1.4) + 0.07, zf + 1.4);   // and on the ground before it
      t.lit = [eye, halo, pool]; for (const m of t.lit) { m.visible = false; k.scene.add(m); } },
    look: (t, c) => { const on = !!c.flag(n.id); for (const m of t.lit || []) m.visible = on; },
  }));
  const byNode = (c, d) => NODES.some((n) => c.spot('ember-line-road', n.stand[0], n.stand[1], d));

  // ---- how zone 2's story moves (the stages are the story job's; what moves each on is the hub's call) ----
  W3D.STORY['zone-2'] = {
    talk: 'COVEN_TALK_Z2', key: 'coven.story.z2.v1', gate: 'nodeNight', first: 'landing',
    stages: [
      { to: 1, when: (c) => c.heard('roadwarden.ask') },                                    // nodes: the roadwarden has asked
      { to: 2, when: (c) => c.stage >= 1 && c.nodes >= 3 && c.near('dawnroost', 4) },       // hall: the three are lit, and Dawnroost is reached
      { to: 3, when: (c) => c.stage >= 2 && c.heard('marta.node') },                        // node: Marta has told what comes at night
      { to: 4, when: (c) => c.stage >= 3 && c.won() },                                      // after: the node holds
    ],
    tellStage: { 1: 'nodes' },
    tell: [['node-two', (c) => c.nodes === 2], ['node-three', (c) => c.nodes >= 3]],
    moments: [
      ['after-node', (c) => c.stage >= 3 && c.won()],
      ['leaving', (c) => c.stage >= 4 && c.heard('captain.10')],
      ['node-lit', (c) => c.nodes >= 1],
      ['first-node', (c) => c.stage >= 1 && c.nodes === 0 && byNode(c, 9)],
      ['dawnroost', (c) => c.near('dawnroost', 45)],
      ['forty-beds', (c) => c.heard('marta.hello')],
      // (until the fights job sets the night's fight at the node, the node holds once the coven has stood before it)
      ['before-node', (c) => c.stage >= 3 && !c.won() && (c.gate ? c.gateD() < 40 : c.near('dawnroost-node', 2)), (c) => { if (!c.gate) c.flag('gate', true); }],
    ],
  };
})(window);
