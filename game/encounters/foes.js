// foes.js: the foes of the big fights that the battle did not have (Coven of the Moon Faire, the fights job).
// Only numbers, and which model each wears. Their names and words are in game/encounters/words.js.
// Loaded after game/battle/rules.js (it adds to BattleRules.FOES) and before game/battle/fights.js is used.
//
// A foe's line is the battle's own form (game/battle/rules.js, FOES): hp and each move's blows at level 1 (everything
// grows 20% a level), atb (seconds for its turn to come round), and its moves. What is new here, each a rule the
// engine has had since step 4 (game/battle/engine.js, marked "Coven"):
//   noFate    Kore's Fate does not write on it: it has no ending to seal (the knight; the fire's first form)
//   unending  no blow can end it: it stays at 1 Life until Kore's Sealed Fate ends it (the fire's second form)
//   echo      on a move: it is one of Io's own spells (Io's move of that name); Io can answer it with the same spell
//   act       on a move: which of its model's motions plays
// A foe with no model of its own WEARS the nearest model the battle has, as a stand-in:
//   the knight of light wears Halcyon's (the Gloam Knight of the new Envoi: dark armour, where the story says "all light");
//   the fire, in both forms, wore Noctara's (the new Envoi's last foe) until the last-foe job (below);
//   the great bramble is the battle's own Bramble Colossus, made weaker for where it stands in the story.
// last-foe: the fire now wears its own model, in both forms: Moon Faire's final foe, "the fire that would not end"
// (game/battle/models/final-fire.js, copied in as it is; game/battle/models/final-fire-foe.js plays it in the battle).
// Each of its moves plays the nearest of the model's two moves (blow: its iron hand strikes; call: its rings line up,
// flame streams in from the party's side and bursts). Only `act` changed in the moves: no rule and no number.
(function (G) {
  'use strict';
  const RL = G.BattleRules, WORDS = (G.COVEN_FIGHT_WORDS || {}).gates || {};
  const KN = (WORDS.knightOfLight || {}).moves || {}, FIRE = (WORDS.theFire || {}).forms || [{}, {}];
  const FOES = {
    // ---- zone 3's big fight, level 15: the knight of light. She fights with Io's own spells and has no ending to seal.
    // She is never beaten: at a share of her Life (the fight's `ends`, in game/encounters/zone-3.js) she stops and walks
    // away, and each time Io answers one of her spells with the same spell that share rises and she loses a turn.
    knightOfLight: {
      name: (WORDS.knightOfLight || {}).name || 'Knight of light', hp: 17000, atb: 2.5, fixedLevel: 16, boss: true, noFate: true, shards: 320, xp: 235,
      weak: {}, resist: { moon: 0.75 },
      moves: {
        flame: { name: KN.flame || 'Flame Bolt', weight: 0.3, hits: [615], target: 'one', echo: 'flame', act: 'gloamCleave', time: 2.4 },
        crescent: { name: KN.crescent || 'Crescent Blades', weight: 0.3, hits: [127, 127, 127, 127, 127], target: 'random', echo: 'crescent', act: 'duskArc', time: 3 },
        briars: { name: KN.briars || 'Nightbloom Briars', weight: 0.2, hits: [440], held: true, target: 'one', echo: 'briars', act: 'severance', time: 2.6 },
        mend: { name: KN.mend || 'Lunar Mend', weight: 0.2, healPct: 0.04, hurt: 0.75, cooldown: 3, target: 'self', echo: 'mend', act: 'vowStance', time: 2.2 },
        moonlight: { name: KN.moonlight || 'Moonlight', below: 0.55, once: true, charge: true, chargeName: KN.gather || 'The light gathers', hits: [820], target: 'all', act: 'blackNoon', time: 3.6 },
      },
    },
    // ---- zone 4's last fight, level 20: the fire, in two forms (docs/lore/story-zones-2-4.md; game/talk/zone-4.js) ----
    // The first form: "Nothing hurts it. It won't let anything end." It cannot be sealed, and at a share of its Life the
    // fight stops (the fight's `ends`): the coven has learned it will not end this way.
    fireHolds: {
      name: FIRE[0].name || 'The fire', hp: 14000, atb: 2.7, fixedLevel: 20, boss: true, noFate: true, shards: 0, xp: 90,
      moves: {
        reach: { name: 'Reaching flames', weight: 0.35, hits: [210, 210, 210], target: 'random', act: 'blow', time: 2.6 },   // last-foe: act (was crownShards)
        draw: { name: 'Draws the light', weight: 0.25, hits: [210], sap: 24, target: 'all', act: 'call', time: 2.8 },   // last-foe: act (was frostDust)
        flare: { name: 'Flare', weight: 0.25, charge: true, chargeName: 'The fire draws breath', hits: [720], target: 'all', act: 'call', time: 4.6 },   // last-foe: act (was voidSphere)
        cold: { name: 'The warmth goes', weight: 0.15, hits: [150], frost: 8, target: 'all', act: 'call', time: 2.8 },   // last-foe: act (was frostDust)
      },
    },
    // The second form: Kore draws the fire's hunger onto herself and gives it its ending. Its single blows all fall on
    // Kore. No blow can end it: every blow on her writes its Fate, and when its Fate meets the Life it has left, her
    // Sealed Fate ends it. It grows harder every turn it takes, so it is a race.
    fireHunger: {
      name: FIRE[1].name || 'The fire', hp: 8000, atb: 2.6, fixedLevel: 20, boss: true, unending: true, rage: 0.1, shards: 600, xp: 700,
      moves: {
        hunger: { name: 'Hunger', weight: 0.5, hits: [336], target: 'jester', act: 'blow', time: 2.4 },   // last-foe: act (was crownShards)
        allOfIt: { name: 'All of it', weight: 0.22, charge: true, chargeName: 'It gathers all of it', hits: [672], target: 'jester', act: 'call', time: 4.2 },   // last-foe: act (was voidSphere)
        heat: { name: 'Heat', weight: 0.28, hits: [448], target: 'all', act: 'call', time: 2.6 },   // last-foe: act (was frostDust)
      },
    },
  };
  for (const id in FOES) RL.FOES[id] = FOES[id];
  // how each looks in the battle (game/battle/fights.js reads this): the model it wears, and its light
  G.COVEN_FOE_LOOKS = Object.assign(G.COVEN_FOE_LOOKS || {}, {
    knightOfLight: { wears: 'halcyon', standIn: true, look: { glow: [1.7, 0xfff0c8], appearColor: [1, 0.94, 0.78], hitColor: 0xfff1d0, hitRGB: [1, 0.92, 0.75], near: 2.2, downAct: 'kneel' } },
    // last-foe: the fire, in its own model (it wore Noctara's, as a stand-in). As Moon Faire shows it: about 8 m tall
    // and 4.8 m across whole, 12 m and 9.6 m broken open; crimson and rose light; standing about 12 m from the party,
    // turned a little toward it (stand: where it stands in its arena, in metres, whatever the fight's own stand says;
    // yawBias: about 0.6 of the way round to face the party, as its own page stood it). Form one appears dark and
    // lights up; the final form appears whole and breaks open as its fight begins (its change). reach: how far from
    // its middle a witch stops to strike it (the bowl and its legs). detail 1 is the model as Chris saw it.
    fireHolds: { make: 'makeFinalFireFoe', opts: { form: 1, detail: 1 }, look: { kind: 'finalFire', tall: 8, halfW: 2.4, shadow: 4.2, reach: 1.9, stand: [3.2, -11.5], yawBias: 0.18, fxScale: 2.2,
      glow: [3.2, 0xd42a48], appearColor: [0.83, 0.16, 0.28], hitColor: 0xf08fa6, hitRGB: [0.94, 0.56, 0.65], downAct: 'none' } },
    fireHunger: { make: 'makeFinalFireFoe', opts: { form: 2, detail: 1, breaks: true }, look: { kind: 'finalFire', tall: 12, halfW: 4.8, shadow: 5, reach: 2.4, stand: [3.2, -11.5], yawBias: 0.18, fxScale: 2.8,
      glow: [4.6, 0xff1f3d], appearColor: [1, 0.79, 0.82], hitColor: 0xff1f3d, hitRGB: [1, 0.12, 0.24], downAct: 'die' } },
  });
})(typeof globalThis !== 'undefined' ? globalThis : window);
