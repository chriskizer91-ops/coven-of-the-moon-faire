// plan.js: the whole game's levels, as one plan (Coven of the Moon Faire, the fights job, step 4). Only numbers.
// The four zones' own numbers are in game/encounters/zone-1.js to zone-4.js; the creatures' slots in slots.js.
// The check that reads all of it: node tools/encounter-balance.mjs
//
// Chris's words the plan is built on: four gate fights at levels 5, 10, 15 and 20; about 180 fights carry the party
// from level 1 to 20 over the four zones (November 19); room for one or two new creatures in each zone, balanced with
// one in and easy to rebalance with two (November 23). The hub's reading, which the board gives this job: zone 1 is
// levels 1 to 5, zone 2 to 10, zone 3 to 15, zone 4 to 20, with about 45 fights in each.
(function (G) {
  'use strict';
  G.COVEN_PLAN = {
    zones: ['zone-1', 'zone-2', 'zone-3', 'zone-4'],
    // the level the party must be for each zone's big fight, and about how many fights the zone should take to get there
    // (counted from the level the party comes into the zone at, with the last zone's big fight won)
    gateLevel: { 'zone-1': 5, 'zone-2': 10, 'zone-3': 15, 'zone-4': 20 },
    fights: { 'zone-1': 45, 'zone-2': 45, 'zone-3': 45, 'zone-4': 45 },
    // how much of a zone's fighting a slot's creature takes (counted in ordinary fights: a fight worth 3 counts as 3):
    // about one fight in five when one slot is on, about one in six each when both are
    share: { alone: 1 / 5, both: 1 / 6 },
    // the most of one kind of ground's fights a slot may take, however small that ground is
    shareCap: 0.6,
    // ---- what the check holds the game to (tools/encounter-balance.mjs) ----
    targets: {
      // fights to reach a zone's gate level, with slot A on (the game as shipped): within this many of the plan
      fightsWithin: 6,
      // with A and B on, or with neither: within this many fights of A on, and within this many points of chance (out
      // of 100) of losing a fight, for each kind of pretend player
      settingsFights: 3, settingsLoss: 4,
      // how often each kind of pretend player may lose an ordinary fight in the wilds (a share of the fights it meets,
      // each begun whole; a fight run from is not a loss)
      loss: { careless: [0, 0.3], sensible: [0, 0.06], expert: [0, 0.02] },
      // a slot's own fights against the fights they take the place of: the careless player's chance of losing may
      // differ by this many points, the attentive player's by this many
      slotLoss: { careless: 12, sensible: 5 },
      // each big fight at its level: how often each kind of player should win it
      gates: {
        greatWraith: { careless: [0.2, 0.6], sensible: [0.8, 0.96], expert: [0.97, 1] },
        nodeNight: { sensible: [0.8, 0.99], expert: [0.93, 1] },
        knightOfLight: { careless: [0.05, 0.6], sensible: [0.8, 0.97], expert: [0.93, 1] },
        greatBramble: { careless: [0.1, 0.6], sensible: [0.75, 0.96], expert: [0.93, 1] },
        // (the fire is the story's ending: the attentive player nearly always sees it through. How hard it should be is Chris's)
        theFire: { careless: [0, 0.4], sensible: [0.8, 1], expert: [0.9, 1] },
      },
    },
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
