// zone-2.js: the fights of zone 2, the Warm Roads and Dawnroost (Coven of the Moon Faire, the fights job, November 24,
// 2026). Only numbers and names, in the form of zone-1.js. Levels 5 to 10; the big fight at level 10.
// A spot is [x, z] in the zone's metres, or ['place id', px, py]: a spot in that place's own painting, as the people's
// files give theirs (game/people/zone-2.js), so it moves with the place.
//
// The walk (measured on the built land): the road from the camp to the living node is 2.5 km outside the places (camp to
// the Ember Line road 0.57, on to the forest road 0.9, on to Dawnroost 0.74, up to the node 0.29). The plan asks about
// 45 fights in the zone before its big fight. At one meeting every 125 m the road out brings about 20, so the coven
// walks it about twice (out, back to a fire to rest, and out again) before the node's fight is offered. JOB'S CALL: the
// other choice is fewer fights that are each worth more: raise `reward` and the count falls in step (the check says by
// how much).
window.COVEN_ENCOUNTERS = window.COVEN_ENCOUNTERS || {};
window.COVEN_ENCOUNTERS['zone-2'] = {
  id: 'zone-2', band: 2,
  levels: [5, 10], above: 1,
  // what a fight is worth, against the battle's own (set with the check so the zone takes about 45 fights)
  reward: 0.27,
  calm: 70, margin: 25,
  // the arenas a fight here can be in: the nearest (the new Envoi's two for these lands)
  arenas: [
    { id: 'warm-roads-moor', name: 'the Warm Roads’ moor', at: ['warm-roads-camp', 768, 512] },
    { id: 'dawnroost', name: 'Dawnroost’s hill', at: ['dawnroost', 768, 512] },
  ],
  // how strong, by how far along the road the coven is: the first that fits. near: [place, metres from its edge]
  stretches: [
    { id: 'heights', name: 'the heights round Dawnroost', near: ['dawnroost-node', 330], levels: [8, 10] },
    { id: 'heights', name: 'the heights round Dawnroost', near: ['dawnroost', 420], levels: [8, 10] },
    { id: 'forest', name: 'the forest road', near: ['dawnroost-road', 430], levels: [7, 9] },
    { id: 'ember', name: 'the Ember Line', near: ['ember-line-road', 430], levels: [6, 8] },
    { id: 'camp', name: 'the camp’s side', levels: [5, 7] },
  ],
  // what is met, by the kind of ground: the first that fits. road: within that many metres of a road. far: farther than
  // that from every place. kind: the land's own kind under her feet. every: metres between meetings, on average.
  // part: how much of the zone's fighting it takes (the job's estimate: the coven mostly keeps to the road).
  // The foes are the new Envoi's for these levels: wisps and wraiths
  where: [
    { id: 'road', name: 'the cold road', road: 16, every: 130, part: 0.6,
      packs: [[['wisp', 'wraith'], 3], [['wraith', 'wraith'], 2], [['wisp', 'wisp', 'wisp'], 2], [['wraith', 'wisp', 'wisp'], 1]] },
    { id: 'far', name: 'the far hills', far: 430, every: 105, part: 0.06,
      packs: [[['wraith', 'wraith'], 3], [['wraith', 'wisp', 'wisp'], 3], [['wisp', 'wraith'], 1]] },
    { id: 'pine', name: 'the cold pines', kind: 'pine', every: 115, part: 0.2,
      packs: [[['wisp', 'wisp', 'wisp'], 3], [['wisp', 'wraith'], 2], [['wraith', 'wisp', 'wisp'], 2], [['wraith', 'wraith'], 1]] },
    { id: 'open', name: 'the cold hills', every: 125, part: 0.14,
      packs: [[['wisp', 'wraith'], 3], [['wraith', 'wraith'], 2], [['wraith', 'wisp', 'wisp'], 2], [['wisp', 'wisp', 'wisp'], 1]] },
  ],
  // ---- the big fight (the story's: game/people/zone-2.js looks for it as `nodeNight`): three wraiths come up the hill
  // for Dawnroost's living node. It is the battle's own Dawnroost fight: three wraiths at level 12, in Dawnroost's arena.
  // The spot is the sun in the floor of the node's court, before the sunstone. Its words: words.js, gates.nodeNight ----
  gate: { id: 'nodeNight', name: 'The night at the node', at: ['dawnroost-node', 766, 440], r: 14, level: 10, arena: 'dawnroost', stand: 'pack', scene: 'dawnroost-node',
    foes: [{ id: 'wraith', level: 12 }, { id: 'wraith', level: 12 }, { id: 'wraith', level: 12 }], fanfare: true },
  // ---- a fight by each of the three dark road stones (the plan; the fights job's proposal for what waits there): the
  // cold has company. A stone can be lit once its fight is won. thing: the stone's id in game/people/zone-2.js.
  // levels: the foes', never above the party's own. worth: against an ordinary fight here ----
  things: [
    { id: 'stone-road', thing: 'node-road', words: 'stone', foes: ['frostWisp', 'frostWisp'], levels: [5, 8], above: 0, worth: 1.5, arena: 'warm-roads-moor' },
    { id: 'stone-ring', thing: 'node-ring', words: 'stone', foes: ['frostWisp', 'wraith'], levels: [5, 8], above: 0, worth: 1.5, arena: 'warm-roads-moor' },
    { id: 'stone-rise', thing: 'node-rise', words: 'stone', foes: ['frostWisp', 'frostWisp', 'wraith'], levels: [5, 8], above: 0, worth: 1.5, arena: 'warm-roads-moor' },
  ],
  // the camp: where the coven wakes after a lost fight (the narrator: "by the roadwarden's fire")
  camp: { at: ['warm-roads-camp', 800, 500], r: 36, wake: ['warm-roads-camp', 800, 520] },
  // where else the coven can rest (JOB'S CALL, one line: take it out and only the camp is left): the Wardens' hall, where
  // Marta makes up forty beds every night
  rests: [{ id: 'hall', at: ['dawnroost', 400, 500], r: 14 }],
};
