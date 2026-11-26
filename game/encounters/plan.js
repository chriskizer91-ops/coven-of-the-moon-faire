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
    // fights-tune: these 45s are the fights at each zone's OWN spacing (its grounds' `every`, as the fights job set
    // them). With meetings coming more often (`wilds`, below) the same walk brings more fights, each worth less, so the
    // check holds a zone to 45 times `often` (game/encounters/draw.js: CovenDraw.planFights): the same walk, the same
    // level at the big fight. Chris's earlier "about 180" is beaten by his newer word of November 25 (below)
    fights: { 'zone-1': 45, 'zone-2': 45, 'zone-3': 45, 'zone-4': 45 },
    // ---- fights-tune: how often a meeting comes in the wilds. Chris, November 25, after playing zone 1: "It just was
    // way more running than I thought. I think that the foes should pop up in the wilds more often." ----
    // The one number to change is `every`. Each kind of ground keeps its own share as its zone's file sets it (kinder
    // near home, harder in the fen): the file's `every`s are scaled together so that their average (weighted by
    // `part`) is this. What an ordinary meeting gives (`reward`: its experience and shards) is scaled down in step, so
    // a kilometre walked in the wilds still gives what it gave, and the coven is the same level at each big fight.
    // Roads count as wilds, as before; inside a place, the camp and their margin there are still none.
    wilds: {
      // hub, November 26: 75, not the job's 58. At 58 the whole game is 424 fights and about 11.5 hours of fighting; at 75 it
      // is 329 fights and about 8.9 hours (it was 181 and 5.1). Chris's to change: 58, 75 or 90 are in docs/questions.md (B1)
      every: 75,     // metres walked in the wilds between two meetings, on average (before: about 191 in zone 1, 125, 115 and 118 in zones 2 to 4)
      first: 30,     // the first meeting on a zone's page comes after half to one and a half times this many metres of wilds (before: the calm, 70, then the usual wait)
      calm: 25,      // after every fight, won, run from or lost: no meeting for this many metres (before: 70). So two never come back to back
    },
    // the story's walk in each zone, in km of wilds before its big fight, as the fights job measured it (the zones'
    // files say how). Only the check reads it: the level the coven has at the big fight after walking it once
    walk: { 'zone-1': 9.0, 'zone-2': 2.5, 'zone-3': 4.8, 'zone-4': 3.3 },
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
