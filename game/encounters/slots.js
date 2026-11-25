// slots.js: room for new creatures (Coven of the Moon Faire, the fights job, step 4). ONE FILE to change when a real
// creature arrives: game/encounters/ADDING-A-CREATURE.md has the steps.
//
// Chris, November 23: "come up with a placeholder for an extra creature or two extra creatures in each zone, and we
// balance the game so that as long as one of those creatures gets added everything works out, and it's easy to
// rebalance if two additional creatures come in for each zone."
//
// So every zone has two slots, A and B. A is ON: the game is balanced with it in. B is OFF: turning it on is the one
// word `on: true` below, and one run of the check (node tools/encounter-balance.mjs).
// Until Chris's creatures come, each slot is a STAND-IN that can be fought: a plain dark shape with two pale eyes
// (game/battle/models/stand-in.js), shown as "Strange creature" (the name is in game/encounters/words.js).
//
// `suggested` is the creature docs/foes-from-m7.md suggests for the slot. SUGGESTED, NOT APPROVED: Chris has not
// chosen. Each slot's job in a fight is shaped so that creature could take it with no change to the rules.
//
// What a slot's line says:
//   on        is it in the game
//   job       what it does in a fight that the foes already there do not
//   from      the party's level from which it can be met
//   met       where: the zone's kinds of ground (the `where` ids in game/encounters/zone-N.js)
//   share     how much of the zone's fighting it takes: about one fight in five when it is the only slot on, one in six
//             each when both are (the numbers are in game/encounters/plan.js)
//   worth     how many ordinary fights one of its fights stands for (the big one: 3)
//   pack      who is in the fight: the creature's id, once for each one that comes; it may bring a foe the zone has
//   foes      the creature itself, in the battle's own form (game/battle/rules.js, FOES; the new rules are explained in
//             game/encounters/foes.js and below)
//   model     what draws it: `make` names the model's maker (a function a model file defines), `opts` is handed to it,
//             `look` is its size and light in the battle (game/battle/fights.js, FOE_LOOK). Each move's `act` names the
//             model's motion that plays for it
//
// THE RULE THAT KEEPS THE BALANCE STEADY (game/encounters/draw.js does it): a slot's fight gives exactly the experience
// and shards of the ordinary fights it takes the place of, on that ground at those levels, times `worth`; and a fight
// worth 3 uses up the ground of 3. So turning a slot on or off changes what the fights are like, not how many it takes
// to reach a level. `xp` and `shards` below are therefore only shares within its own pack.
//
// The rules a slot's job may use (game/battle/engine.js, each marked "Coven (step 4)"):
//   charge: true          a blow that can be seen coming: it gathers for a turn, then lands (the battle had this)
//   healPct               it heals a share of its own Life (the battle had this)
//   frost: seconds        the four's turns come slower for a while (the battle had this)
//   weaken: seconds       every blow the four land is a quarter lighter for a while (new)
//   evade: 1              the next single blow aimed at it misses (the battle had this)
//   pair: { dmg, haste }  while its partner stands, each of the two hits harder and comes round sooner (new)
//   resist: { physical }  blades and arrows slide off it; spells do not (new)
//   target: 'back', leap  it goes past the front for whoever stands at the back, and Kore cannot catch the blow (new)
//   sap: n                it drinks MP, from the one it strikes or from all four (new for all four)
//   alone: true           always met alone, and a great foe: more Life against four, slower to seal
(function (G) {
  'use strict';
  const M = ((G.COVEN_FIGHT_WORDS || {}).slots || {}).moves || {}, NAME = ((G.COVEN_FIGHT_WORDS || {}).slots || {}).name || 'Strange creature';
  const standIn = (shape, tall, wide, eyes, look) => ({ make: 'makeStandIn', opts: { shape, tall, wide, eyes }, look: Object.assign({ kind: 'standin', tall, shadow: wide * 0.75, yawBias: 0, glow: [wide * 1.1, eyes], appearColor: [0.6, 0.62, 0.8], hitColor: 0xdfe8ff, hitRGB: [0.8, 0.85, 1] }, look || {}) });
  const SLOTS = {
    'zone-1': {
      // the heavy one: slow and tough, with one big blow that can be seen coming
      A: { on: true, job: 'the heavy one: slow and tough, with one big blow that can be seen coming',
        suggested: { creature: 'Willow-Wight', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'slow; its Bough-Fall is a charged blow; it weeps to heal' },
        from: 2, met: ['thorn', 'fen'], worth: 1, pack: ['heavyOne'],
        foes: { heavyOne: { name: NAME, hp: 4100, atb: 3.9, xp: 40, shards: 30,
          moves: {
            swipe: { name: M.swipe, weight: 0.45, hits: [185], target: 'one', act: 'strike', time: 2.2 },
            bigBlow: { name: M.bigBlow, weight: 0.35, charge: true, chargeName: M.gather, hits: [470], target: 'one', act: 'heave', time: 3 },
            mendSelf: { name: M.mendSelf, weight: 0.2, healPct: 0.08, hurt: 0.6, cooldown: 3, target: 'self', act: 'cast', time: 2.4 },
          } } },
        model: { heavyOne: standIn('heavy', 2.6, 1.7, 0xdfe8ff, { near: 2.4 }) } },
      // the swarm: three small quick ones, each down in a blow or two
      B: { on: false, job: 'the swarm: three small quick ones, each down in a blow or two',
        suggested: { creature: 'Briarling', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'one of the weakest creatures there; three of them read well' },
        from: 1, met: ['home', 'wilds'], worth: 1, pack: ['swarmling', 'swarmling', 'swarmling'],
        foes: { swarmling: { name: NAME, hp: 640, atb: 2.0, xp: 40, shards: 30,
          moves: {
            nip: { name: M.nip, weight: 0.6, hits: [78], target: 'one', act: 'strike', time: 1.6 },
            dart: { name: M.dart, weight: 0.4, hits: [34, 34], target: 'random', act: 'flurry', time: 2 },
          } } },
        model: { swarmling: standIn('small', 0.7, 0.7, 0xffe9a8, { near: 1.2 }) } },
    },
    'zone-2': {
      // the cold-bringer: does little harm itself, but slows and weakens the four. It comes with one of the zone's own foes
      A: { on: true, job: 'the cold-bringer: does little harm itself, but slows and weakens the four',
        suggested: { creature: 'Mirage Wisp', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'Cold Touch chills, Beguile charms, Blink dodges; little harm of its own' },
        from: 5, met: ['road'], worth: 1, pack: ['coldBringer', 'wraith'],
        foes: { coldBringer: { name: NAME, hp: 2100, atb: 2.6, weak: { fire: 1.5 }, xp: 40, shards: 30,
          moves: {
            chill: { name: M.chill, weight: 0.35, hits: [55], frost: 5, target: 'all', act: 'cast', time: 2.2 },
            drainStrength: { name: M.drainStrength, weight: 0.3, hits: [45], weaken: 9, target: 'all', act: 'cast', time: 2.2 },
            touch: { name: M.touch, weight: 0.2, hits: [115], target: 'one', act: 'strike', time: 1.8 },
            blink: { name: M.blink, weight: 0.15, evade: 1, target: 'self', noRepeat: true, act: 'cast', time: 1.5 },
          } } },
        model: { coldBringer: standIn('thin', 1.5, 0.7, 0xbfe4ff, { near: 1.6 }) } },
      // the pair: two that are much stronger while both stand
      B: { on: false, job: 'the pair: two that are much stronger while both stand',
        suggested: { creature: 'Thornhound', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'its Pack Howl: the pack answers, and every foe is quicker. It fails M7’s own stretch check today' },
        from: 5, met: ['open', 'pine', 'far'], worth: 1, pack: ['pairBeast', 'pairBeast'],
        foes: { pairBeast: { name: NAME, hp: 2500, atb: 3.0, pair: { dmg: 1.45, haste: 1.25 }, xp: 40, shards: 30,
          moves: {
            bite: { name: M.bite, weight: 0.55, hits: [150], target: 'one', act: 'strike', time: 1.8 },
            rake: { name: M.rake, weight: 0.45, hits: [52, 52, 52], target: 'random', act: 'flurry', time: 2.2 },
          } } },
        model: { pairBeast: standIn('low', 1.0, 0.8, 0xffd9a0, { near: 1.8 }) } },
    },
    'zone-3': {
      // the armoured one: blades slide off it, magic does not
      A: { on: true, job: 'the armoured one: blades slide off it, magic does not',
        suggested: { creature: 'Sapwight', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'bark wound round it like armour, and a Bark Hide move. That blades slide off would be this game’s own rule' },
        from: 10, met: ['bramble', 'pine'], worth: 1, pack: ['armouredOne'],
        foes: { armouredOne: { name: NAME, hp: 3800, atb: 3.3, resist: { physical: 0.4 }, weak: { fire: 1.25 }, xp: 40, shards: 30,
          moves: {
            slam: { name: M.slam, weight: 0.45, hits: [520], target: 'lastAttacker', act: 'strike', time: 2.2 },
            crush: { name: M.crush, weight: 0.25, charge: true, chargeName: M.gather, hits: [900], target: 'one', act: 'heave', time: 3 },
            sweep: { name: M.sweep, weight: 0.3, hits: [260], target: 'all', act: 'flurry', time: 2.4 },
          } } },
        model: { armouredOne: standIn('plated', 2.1, 1.5, 0xc8ffd0, { near: 2.2 }) } },
      // the leaper: goes past the front for whoever stands at the back
      B: { on: false, job: 'the leaper: goes past the front for whoever stands at the back',
        suggested: { creature: 'Rime Wolf', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'one of the fastest there; its Lunge is a charged leap. Only planned in M7 today: no model yet' },
        from: 10, met: ['open', 'pine', 'far'], worth: 1, pack: ['leaper', 'leaper'],
        foes: { leaper: { name: NAME, hp: 2500, atb: 2.3, xp: 40, shards: 30,
          moves: {
            lunge: { name: M.lunge, weight: 0.5, hits: [250], target: 'back', leap: true, act: 'leap', time: 2 },
            snap: { name: M.snap, weight: 0.3, hits: [140], target: 'one', act: 'strike', time: 1.8 },
            pounce: { name: M.pounce, weight: 0.2, charge: true, chargeName: M.crouch, hits: [400], target: 'back', leap: true, act: 'leap', time: 2.4 },
          } } },
        model: { leaper: standIn('low', 1.05, 0.85, 0xcfe8ff, { near: 2.0 }) } },
    },
    'zone-4': {
      // the light-thief: drains the four's magic rather than their health. It comes with one of the zone's own foes
      A: { on: true, job: 'the light-thief: drains the four’s magic rather than their health',
        suggested: { creature: 'Rime-Wraith', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'a held soul, to be let go; it chills and pulls under. Nothing there drains magic: the drain would be this game’s own rule' },
        from: 15, met: ['pass'], worth: 1, pack: ['lightThief', 'frostWisp'],
        foes: { lightThief: { name: NAME, hp: 3500, atb: 2.9, weak: { moon: 1.3 }, xp: 40, shards: 30,
          moves: {
            drink: { name: M.drink, weight: 0.35, hits: [110], sap: 42, target: 'one', act: 'strike', time: 2.2 },
            dirge: { name: M.dirge, weight: 0.3, hits: [62], sap: 20, target: 'all', act: 'cast', time: 2.4 },
            grasp: { name: M.grasp, weight: 0.2, hits: [135], frost: 4, target: 'all', act: 'cast', time: 2.2 },
            pull: { name: M.pull, weight: 0.15, charge: true, chargeName: M.gather, hits: [500], sap: 40, target: 'one', act: 'heave', time: 3 },
          } } },
        model: { lightThief: standIn('hooded', 1.9, 0.95, 0xa8d4ff, { near: 1.8 }) } },
      // the big one: rare, a long fight, worth three ordinary ones
      B: { on: false, job: 'the big one: rare, a long fight, worth three ordinary ones',
        suggested: { creature: 'Peak-Troll', from: 'Aethermoor M7', status: 'SUGGESTED, NOT APPROVED', why: 'Regrow makes a long fight; Hurl Boulder is a big blow that can be seen coming' },
        from: 16, met: ['town'], worth: 3, pack: ['bigOne'],
        foes: { bigOne: { name: NAME, hp: 11000, atb: 2.9, alone: true, xp: 40, shards: 30,
          moves: {
            smash: { name: M.smash, weight: 0.4, hits: [340], target: 'lastAttacker', act: 'strike', time: 2.4 },
            boulder: { name: M.boulder, weight: 0.25, charge: true, chargeName: M.lift, hits: [480], target: 'one', act: 'heave', time: 3.2 },
            stomp: { name: M.stomp, weight: 0.2, hits: [165], target: 'all', act: 'cast', time: 2.4 },
            regrow: { name: M.regrow, weight: 0.15, healPct: 0.05, hurt: 0.75, cooldown: 3, target: 'self', act: 'cast', time: 2.4 },
          } } },
        model: { bigOne: standIn('huge', 3.4, 2.6, 0xffe2b8, { near: 3.2, reach: 1.2, halfW: 1.6, fxScale: 1.6 }) } },
    },
  };
  // ---- the slots' creatures join the battle's foes, and the battle learns what draws each ----
  const RL = G.BattleRules, LOOKS = G.COVEN_FOE_LOOKS = G.COVEN_FOE_LOOKS || {};
  for (const z in SLOTS) for (const k of ['A', 'B']) {
    const s = SLOTS[z][k]; s.zone = z; s.slot = k;
    for (const id in s.foes) { if (RL) RL.FOES[id] = s.foes[id]; LOOKS[id] = Object.assign({ standIn: s.model[id].make === 'makeStandIn' }, s.model[id]); }
  }
  // which slots are on: as the lines above say, unless the page or a check says otherwise:
  //   COVEN_SLOTS.set('A') (the game as shipped), .set('AB'), .set('none'); or ?slots=AB in a page's address
  let forced = null;
  try { const q = /[?&]slots=(AB|A|B|none)\b/.exec(G.location ? G.location.search : ''); if (q) forced = q[1]; } catch (e) {}
  G.COVEN_SLOTS = {
    zones: SLOTS,
    set(v) { forced = v == null ? null : String(v); },
    get setting() { return forced; },
    // the slots that are on in a zone: [slot, ...]
    on(zone) { const Z = SLOTS[zone] || {}; return ['A', 'B'].filter((k) => Z[k] && (forced == null ? Z[k].on : forced !== 'none' && forced.indexOf(k) >= 0)).map((k) => Z[k]); },
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
