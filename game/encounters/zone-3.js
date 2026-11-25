// zone-3.js: the fights of zone 3, the northern wilds and the shipyard (Coven of the Moon Faire, the fights job,
// November 24, 2026). Only numbers and names, in the form of zone-2.js. Levels 10 to 15; the big fight at level 15.
//
// The walk (measured on the built land): the road from the camp to the shipyard is 3.6 km outside the places (camp to
// Eldergrove's edge 0.66, on to the cold moor 0.85, on to the crossroads 0.85, down to the shipyard 1.2). The story sends
// the coven to the shipyard first and back up to the crossroads for the knight: 4.8 km of road before her fight. At one
// meeting every 115 m that is about 41 fights, which is what the plan asks, so here the road is enough.
window.COVEN_ENCOUNTERS = window.COVEN_ENCOUNTERS || {};
window.COVEN_ENCOUNTERS['zone-3'] = {
  id: 'zone-3', band: 3,
  levels: [10, 15], above: 1,
  reward: 0.29,
  calm: 70, margin: 25,
  arenas: [
    { id: 'eldergrove', name: 'Eldergrove’s edge', at: ['eldergrove-edge', 768, 512] },
    { id: 'crossroads', name: 'the northern crossroads', at: ['crossroads', 768, 512] },
  ],
  stretches: [
    { id: 'north', name: 'the crossroads and the shore road', near: ['crossroads', 460], levels: [13, 15] },
    { id: 'north', name: 'the crossroads and the shore road', near: ['shipyard', 900], levels: [13, 15] },
    { id: 'moor', name: 'the cold moor', near: ['cold-moor', 440], levels: [12, 14] },
    { id: 'grove', name: 'Eldergrove’s edge', near: ['eldergrove-edge', 440], levels: [11, 13] },
    { id: 'camp', name: 'the camp’s side', levels: [10, 12] },
  ],
  // The foes are the new Envoi's for these levels: wraiths, wisps, frost wisps, and in the brambles the Bramble Horror
  // ('bramble?': any of its four forms; always alone, and the coven can always walk away from it)
  where: [
    { id: 'bramble', name: 'the brambles', near: ['eldergrove-edge', 260], every: 110, part: 0.2,
      packs: [[['bramble?'], 1], [['wraith', 'wraith'], 3], [['wraith', 'wisp', 'wisp'], 3], [['wraith', 'frostWisp'], 3]] },
    { id: 'road', name: 'the north road', road: 16, every: 120, part: 0.5,
      packs: [[['wraith', 'wraith'], 3], [['wraith', 'frostWisp'], 3], [['wraith', 'wisp', 'wisp'], 2], [['frostWisp', 'frostWisp', 'wraith'], 2]] },
    { id: 'far', name: 'the far wilds', far: 430, every: 100, part: 0.05,
      packs: [[['frostWisp', 'frostWisp', 'wraith'], 3], [['wraith', 'wraith'], 2], [['wraith', 'frostWisp'], 1]] },
    { id: 'pine', name: 'the frosted pines', kind: 'pine', every: 110, part: 0.15,
      packs: [[['wraith', 'frostWisp'], 3], [['frostWisp', 'frostWisp', 'wraith'], 2], [['wraith', 'wisp', 'wisp'], 2], [['wraith', 'wraith'], 1]] },
    { id: 'open', name: 'the northern wilds', every: 115, part: 0.1,
      packs: [[['wraith', 'wraith'], 3], [['wraith', 'frostWisp'], 2], [['wraith', 'wisp', 'wisp'], 2], [['frostWisp', 'frostWisp', 'wraith'], 1]] },
  ],
  // ---- the big fight (the story's: `knightOfLight`): the knight of light, on the crossroads' east road, where the hub's
  // light stands. She fights with Io's own spells. She is never beaten: when her Life is down to `below` she stops and
  // walks back north (the lines: "she stopped when I answered"). Each time Io answers one of her spells with the same
  // spell, she loses a turn and `below` rises by `step`, up to `most`. The foe is in foes.js; its words in words.js ----
  gate: { id: 'knightOfLight', name: 'The knight of light', at: ['crossroads', 1500, 490], r: 14, level: 15, arena: 'crossroads', stand: 'knight', scene: 'northern-crossroads',
    foes: [{ id: 'knightOfLight' }], ends: { retreat: { foe: 'knightOfLight', below: 0.3 }, answer: { foe: 'knightOfLight', step: 0.1, most: 0.6 } }, fanfare: true },
  camp: { at: ['northern-camp', 662, 440], r: 36, wake: ['northern-camp', 662, 440] },
  // where else the coven can rest (JOB'S CALL, one line): Old Gil's bunkhouse at the shipyard, "two bunks to spare"
  rests: [{ id: 'bunkhouse', at: ['shipyard', 436, 500], r: 14 }],
};
