// zone-1.js: the meetings in zone 1's wilds (Coven, the fights job, step 3). Only numbers and names: change them here.
// Everything is metres, x east and z south of Wickhollow's square (as game/places/zone-1.js).
//
// Chris's word (November 19): the meetings are unseen (no foes walk the land); the fight is in the nearest arena; zone 1
// is band 1, levels 1 to 5, with the great wraith in the fen's dark heart as the gate at level 5; about 180 fights carry the party from
// level 1 to 20 over the four zones, so about 45 belong to zone 1.
//
// How often (job's call, from his 45): a first time through zone 1 walks about 9 km of wilds. One way from the camp,
// by Wickhollow, the jetty and Io's cottage, through the Thornwood to Bogmire and the fen's dark heart, is about 4.2 km
// of road outside the places (camp to Wickhollow 0.15, to the jetty and back 0.5, to the cottage and back 0.55, to the
// Thornwood 1.1, on to Bogmire 1.2, to the heart and back 0.7). Coming back to the camp to rest and going out again to
// the gate is 4.6 km more. 45 fights in 9 km is one every 200 m. So `every` below is about 200 m on average, kinder
// near home and harder further out, and nothing can come in the first `calm` metres after a fight.
// What a fight is worth (job's call): Envoi's battle takes the party from level 1 to 5 in about 12 wild fights. To make
// it about 45, as Chris's count asks, a fight in zone 1 is worth `reward` of what it is in Envoi's battle (the experience
// and the shards). The levels job should look at this with the whole game's plan.
window.COVEN_ENCOUNTERS = window.COVEN_ENCOUNTERS || {};
window.COVEN_ENCOUNTERS['zone-1'] = {
  band: 1,
  // levels the foes can be in this zone, and the most above the party's own level a foe can be
  levels: [1, 5], above: 1,
  reward: 0.27,
  // no meeting for this many metres after a fight (won, run from or lost), nor after coming out of a place or the camp
  calm: 70,
  // no meeting this close to a place's own ground or to the camp's meadow (metres past their edge)
  margin: 25,
  // the arenas a fight here can be in, and where each stands: the fight is in the nearest (Envoi's two zone-1 arenas)
  arenas: [
    { id: 'river-glade', name: 'Wickhollow’s river glade', at: [0, 0] },
    { id: 'bogmire', name: 'Bogmire’s boardwalk', at: [1347, 2247] },
  ],
  // where she is: the first that fits. kind: what the land is under her feet (the land's mapData().kind), or a
  // test of her spot. every: metres between meetings on average. levels: the foes' levels here.
  // packs: which foes, and how often each (a weight). Band 1's foes are Envoi's: wisps and wraiths
  where: [
    { id: 'road', name: 'the long road', test: (x, z) => x < -443 || z < -460, every: 220, levels: [3, 5],
      packs: [[['wisp', 'wraith'], 3], [['wraith'], 2], [['wisp', 'wisp', 'wisp'], 2], [['wisp', 'wisp'], 1]] },
    { id: 'fen', name: 'the fen', kind: 'fen', every: 160, levels: [3, 5],
      packs: [[['wisp', 'wisp', 'wisp'], 3], [['wisp', 'wraith'], 3], [['wraith'], 1], [['wisp', 'wisp'], 1]] },
    { id: 'thorn', name: 'the thorn country', kind: 'thorn', every: 170, levels: [2, 4],
      packs: [[['wraith'], 3], [['wisp', 'wraith'], 3], [['wisp', 'wisp'], 2], [['wisp', 'wisp', 'wisp'], 1]] },
    { id: 'home', name: 'the woods round Wickhollow', test: (x, z) => Math.hypot(x, z) < 420, every: 260, levels: [1, 3],
      packs: [[['wisp', 'wisp'], 4], [['wraith'], 2], [['wisp', 'wraith'], 1]] },
    { id: 'wilds', name: 'the wilds', every: 200, levels: [2, 5],
      packs: [[['wisp', 'wisp'], 2], [['wraith'], 2], [['wisp', 'wraith'], 2], [['wisp', 'wisp', 'wisp'], 1]] },
  ],
  // the gate fight. PLACED BY CHRIS (November 23, 19:40; the hub made this one change in the fights job's file on his
  // word): the great wraith waits in the fen's dark heart, where the boardwalk ends, as Old Wenna and the narrator say.
  // The spot is the middle of the heart's square, before the drowned hall's steps (the place bogmire-heart, its
  // painting's pixel 768, 420), where the old Envoi's great wraith sat. It was a proposal before: the road 20 m out of
  // Bogmire's north gate, [1348, 2180]. When the party stands within `r` metres and is at least `level`, a button
  // offers the fight; it is fought in Bogmire's arena, and once won it is not offered again
  gate: { id: 'greatWraith', kind: 'greatWraith', name: 'The great wraith', at: [1506.7, 1818.7], r: 14, level: 5, arena: 'bogmire',
    offer: 'Face the great wraith', notYet: 'Something waits here, too strong for the coven yet (level 5).' },
  // the Moon Faire's camp: where the party rests, and wakes after a lost fight (job's call)
  camp: { at: [-70, 128], r: 36, wake: [-70, 133] },
};
