// zone-4.js: the fights of zone 4, the frozen pass, Misthollow and the dead Moonwell (Coven of the Moon Faire, the
// fights job, November 24, 2026). Only numbers and names, in the form of zone-2.js. Levels 15 to 20.
// WRITTEN BEFORE ZONE 4'S LAND WAS IN MAIN, from the zone-4 job's branch as it stood on November 24 (its slip says
// where each fight belongs). Every spot is given by a place's id (frozen-camp, frostmere-shore, frozen-pass,
// misthollow, moonwell) or is one the zone-4 job's own file works out (W3D.ZONE4), so nothing here has to move when the
// land comes. It has not been run on zone 4's page: the steps for joining are in docs/slips/fights.md.
//
// The walk (from the pins on the map, at the land's one third size): the camp to Frostmere's shore 1.4 km, on to the
// frozen pass 0.57, on to Misthollow 1.1, up to the Moonwell 0.3: about 3.4 km, a little less outside the places.
window.COVEN_ENCOUNTERS = window.COVEN_ENCOUNTERS || {};
window.COVEN_ENCOUNTERS['zone-4'] = {
  id: 'zone-4', band: 4,
  levels: [15, 20], above: 1,
  reward: 0.7,
  calm: 70, margin: 25,
  arenas: [
    { id: 'frostmere', name: 'Frostmere’s shore', at: ['frostmere-shore', 768, 512] },
    { id: 'dead-moonwell', name: 'the dead Moonwell', at: ['moonwell', 768, 512] },
  ],
  stretches: [
    { id: 'top', name: 'Misthollow and the Moonwell', near: ['moonwell', 400], levels: [18, 20] },
    { id: 'top', name: 'Misthollow and the Moonwell', near: ['misthollow', 460], levels: [18, 20] },
    { id: 'pass', name: 'the frozen pass', near: ['frozen-pass', 440], levels: [17, 19] },
    { id: 'shore', name: 'Frostmere’s shore', near: ['frostmere-shore', 440], levels: [16, 18] },
    { id: 'camp', name: 'the camp’s side', levels: [15, 17] },
  ],
  // The foes are the new Envoi's for these levels: frost wisps and wraiths. JOB'S CALL: the Bramble Colossus is NOT met
  // by chance here (in the new Envoi it was, about one wild fight in twelve): in this story it is the great bramble that
  // bars the pass, once. To have it roam as well, add [['colossus'], 1] to a ground's packs.
  where: [
    { id: 'pass', name: 'the frozen pass', near: ['frozen-pass', 420], every: 115, part: 0.25,
      packs: [[['frostWisp', 'frostWisp', 'wraith'], 3], [['wraith', 'wraith', 'frostWisp'], 2], [['frostWisp', 'frostWisp', 'frostWisp'], 2], [['wraith', 'wraith'], 1]] },
    { id: 'town', name: 'the heights round Misthollow', near: ['misthollow', 420], every: 115, part: 0.25,
      packs: [[['wraith', 'wraith', 'frostWisp'], 3], [['frostWisp', 'frostWisp', 'wraith'], 3], [['wraith', 'wraith'], 2]] },
    { id: 'road', name: 'the frozen road', road: 16, every: 125, part: 0.35,
      packs: [[['frostWisp', 'frostWisp', 'wraith'], 3], [['wraith', 'wraith'], 2], [['frostWisp', 'frostWisp', 'frostWisp'], 2], [['wraith', 'wraith', 'frostWisp'], 1]] },
    { id: 'far', name: 'the far snows', far: 430, every: 100, part: 0.05,
      packs: [[['wraith', 'wraith', 'frostWisp'], 3], [['frostWisp', 'frostWisp', 'wraith'], 2]] },
    { id: 'open', name: 'the snowfields', every: 115, part: 0.1,
      packs: [[['frostWisp', 'frostWisp', 'wraith'], 3], [['frostWisp', 'frostWisp', 'frostWisp'], 2], [['wraith', 'wraith'], 2]] },
  ],
  // ---- the last fight (the story's gate): the fire at the dead Moonwell, level 20, in two forms, one after the other.
  // Between the two the land speaks (the coven's moment `between`): the page is sent an event and waited for.
  // Form 1 cannot be ended: when its Life is down to `below` the fight stops ("Nothing hurts it"). Form 2 is ended only
  // by Kore's Sealed Fate. The foes are in foes.js, the words in words.js (gates.theFire).
  // at: the well, as the zone-4 job's file gives it. stage: it is offered once the letter is given (the story's stage 3).
  // between: the coven's moment between the two forms, which the fights play on the land ----
  gate: { id: 'theFire', name: 'The fire', at: 'ZONE4.fire.at', r: 18, level: 20, stage: 3, between: 'between', arena: 'dead-moonwell', stand: 'great', scene: 'dead-moonwell',
    forms: [
      { foes: [{ id: 'fireHolds' }], ends: { retreat: { foe: 'fireHolds', below: 0.45 } } },
      { foes: [{ id: 'fireHunger' }], stand: 'knight' },
    ], fanfare: true },
  // ---- the other big fight: the great bramble that bars the frozen road up the pass (stage 1 of the story). It is the
  // battle's Bramble Colossus at level 16, with less Life and lighter blows (hpMul, dmgMul), since here it must be
  // passed, where in the new Envoi it could be left alone. The coven can back away from it: it is rooted.
  // at: its spot on the road, as the zone-4 job's file gives it. won.flag: what the story asks to be told when it is won ----
  big: [
    { id: 'greatBramble', name: 'The great bramble', at: 'ZONE4.bramble.at', r: 22, level: 16, stage: 1, won: { flag: 'bramble' }, arena: 'frostmere', stand: 'colossus', scene: 'frozen-road',
      foes: [{ id: 'colossus', level: 16, hpMul: 0.6, dmgMul: 0.88 }], alias: { colossus: 'greatBramble' }, canFlee: true, fanfare: true },
  ],
  camp: { at: ['frozen-camp', 630, 452], r: 40, wake: ['frozen-camp', 630, 480] },
  // where else the coven can rest (JOB'S CALL, one line): Ede's inn in Misthollow, where she tries to light the fire every night
  rests: [{ id: 'inn', at: ['misthollow', 980, 690], r: 14 }],
};
