// last-fight-data.js (Coven of the Moon Faire, the last-foe job; made new here): the last fight's choice of easy, medium,
// hard or crazy, and what Moon Faire's final-fight plan fixes round it, as data. game/battle/last-fight.js reads it.
//
// The plan is Moon Faire's game/plan/finalboss/final-fight.json (main, 6371714), chosen by Chris on November 15, 2026.
// It is read, not copied in: its numbers are on Moon Faire's own scale, and this game's battle rules (rules.js) make the
// fire's numbers from its level (x1.2 a level, so a level that is not a whole number, 22.8, works as it is).
//
// What is taken from it:
//   settings  "Before the fight the game offers four settings. Each sets the level of everything in both forms."
//             Easy 20, medium 21, hard 22, crazy 22.8 (Chris: "crazy is 22.8, not 23").
//   helpers   form one is the big body with helpers: two of the Shadow Wraith's kind and two of the wisp's ("wraiths and
//             brambles it has called"; until the brambles have numbers of their own, the wraiths' numbers). Here: two
//             wraiths and two frost wisps (the wisps of zone 4, as Envoi's own page of this fight had them), at the
//             setting's level. The final form is alone.
//   refill    between the two forms "every witch up, full HP and MP, and every once-a-fight move ready again".
// What this game's story keeps, against the plan (each is in docs/slips/last-foe.md, "Calls for Chris"): form one
// cannot be ended and its fight stops at 45% of its Life; the final form is ended only by Kore's Sealed Fate; the
// coven's moment between the two forms is played on the land.
(function (G) {
  'use strict';
  G.COVEN_LAST_FIGHT = {
    forms: ['fireHolds', 'fireHunger'],        // the foes that are the last fight's two forms (game/encounters/foes.js)
    settings: [
      { id: 'easy', level: 20 },
      { id: 'medium', level: 21 },
      { id: 'hard', level: 22 },
      { id: 'crazy', level: 22.8 },
    ],
    helpers: ['wraith', 'wraith', 'frostWisp', 'frostWisp'],   // form one's helpers, at the setting's level
    refill: true,                              // the party comes to the final form with full HP and MP, every witch up
    // the card is asked for each time the last fight is begun (so a lost fight can be tried again easier). The one
    // time it is not: the final form straight after form one, in the same go (the setting chosen there carries on)
    // checks: a fight the battle plays itself (auto) under a test browser picks this after a moment
    autoPick: 'easy', autoWait: 1.2,
    // the words on the card. The four names are Moon Faire's own (Chris, November 15: "easy, medium, hard or crazy").
    // Everything else is a STAND-IN, Chris's to change
    words: {
      title: 'How strong is the fire?',                                         // STAND-IN
      lead: 'The coven is level 20. The fire can be met at its own level, or above it.',   // STAND-IN
      settings: {
        easy: { name: 'Easy', line: 'The fire at level 20' },                   // name: Moon Faire's; line: STAND-IN
        medium: { name: 'Medium', line: 'The fire at level 21' },
        hard: { name: 'Hard', line: 'The fire at level 22' },
        crazy: { name: 'Crazy', line: 'The fire at level 22.8' },
      },
      keys: 'Keys 1 to 4 choose too.',                                            // STAND-IN (shown on a laptop only)
    },
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
