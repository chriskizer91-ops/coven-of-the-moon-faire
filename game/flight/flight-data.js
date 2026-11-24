// flight-data.js: the flight between zones (Coven of the Moon Faire, November 23, 2026; the flight job's file).
// Every number that sets how a flight goes, and every word the player reads on one, is here and not in code.
// game/flight/flight.js reads it and hands it to the flight when one starts. Load it before flight.js.
//
// The flight is Chris's airship game, Skies of Aethermoor, flown over his night map from one landing to another
// (the landings are in game/travel/landings.js, the hub's file).
(function (G) {
  'use strict';
  G.COVEN_FLIGHT_DATA = {

    // ---------------- the ship for each flight ----------------
    // Chris, November 23, 19:40: "the four ships you get in the airship game are the four ships you get as travel
    // upgrades." The hub's reading of it: the Captain's four ships are flown in order, one for each gate between
    // zones, each an upgrade on the last. So the ship is set by the landing a flight LEAVES (the ids are those of
    // game/travel/landings.js). The Frigate is the last upgrade, for whatever flight comes after zone 4.
    // That mapping of ship to gate, and what the Frigate is for, are the hub's reading, not Chris's own words.
    // W3D.flight.fly({ from, to }) uses this table; fly({ from, to, ship: 'brig' }) overrules it.
    // journey job, on Chris's word of November 24, 12:00 ("the skiff for the first two zones ... slightly upgraded, and
    // then the cutter for the last two zones with the same treatment"), as the hub read it: the Skiff from Wickhollow,
    // the Skiff fitted out (skiff2) from the Warm Roads, the Cutter from the northern wilds (after her refit at the
    // shipyard), the Cutter made ready for the peaks (cutter2) from the frozen camp, home.
    shipFrom: { wickhollow: 'skiff', warmCamp: 'skiff2', northCamp: 'cutter', frozenCamp: 'cutter2' },
    ships: ['skiff', 'cutter', 'brig', 'frigate', 'skiff2', 'cutter2'],   // (journey job: the two fitted-out ships added)   // the four that can be flown, smallest first (a landing not in the table flies the first)

    // ---------------- the flight ----------------
    startHeight: 680,        // metres over the landing she leaves from (Skies' own starting height; its clouds lie at 430)
    sailAtStart: 1,          // 1 is full sail: left alone, she flies on at her best speed (Skies starts at half sail)
    wind: 0,                 // no wind (Skies has one worth up to 14% of her speed; with it comes one more thing to read)
    // "A flight should take about two minutes." A short flight is never slowed: she flies at her own speed. A long
    // one is hurried, up to `most` times her own speed, to come as near to `minutes` as that allows. The raiders are
    // hurried by the same amount. With the ships in shipFrom the three flights take about 1.5, 2 and 2.5 minutes of
    // straight flying, and longer with a fight.
    minutes: 2,
    hurry: { most: 1.6 },
    arriveWithin: 320,       // she has arrived when she is this near the landing, in metres, at any height
    arriveSeconds: 3.5,      // the crew bring her down for this long, then the flight is over
    lostSeconds: 4,          // if she goes down: this long to watch, then the crew get her home

    // ---------------- the raiders ----------------
    // Chris: raiders attack on every flight, "one, two or three by distance". Each row: a flight of up to this many
    // kilometres meets these raiders, under these skies. The three flights between the four landings are 3.4, 5.0 and
    // 8.4 km. Which classes come is the flight job's call (zone 3's line says "Bigger ship this time"), and so are
    // the skies. The first flight is gentle: one Skiff under Calm skies, softer than any of Skies' own three.
    raiders: [
      { upToKm: 4, ships: ['skiff'], skies: 'calm' },
      { upToKm: 7, ships: ['cutter', 'skiff'], skies: 'fair' },
      { upToKm: 1e9, ships: ['brig', 'cutter', 'skiff'], skies: 'fair' },
    ],
    raidersAt: 0.25,         // they come when this much of the way is flown (0.25: a quarter)
    raidersStay: 60,         // seconds. Raiders not seen off by then give up and turn away, so a flight never turns into a long beating
    raidersLose: 2600,       // metres. A raider left this far behind has lost her, and is gone
    // How far off the raiders aim, how slowly they reload, how hard they hit, how sturdy they are, how fast they sail.
    // fair, cross and mael are Skies of Aethermoor's own three skies (Fair Winds, Crosswinds, Maelstrom: its
    // src/game/progress.js), copied here as numbers. calm is the flight job's own, for a first flight that a player
    // who only steers for the landing gets through (tools/flight-test.py --sim says how each flight goes).
    skies: {
      calm: { aim: 2.6, reload: 1.7, damage: 0.4, toughness: 0.7, pace: 0.84 },
      fair: { aim: 1.8, reload: 1.35, damage: 0.6, toughness: 0.8, pace: 0.88 },
      cross: { aim: 1, reload: 1, damage: 1, toughness: 1, pace: 0.92 },
      mael: { aim: 0.8, reload: 0.92, damage: 1.15, toughness: 1.15, pace: 0.96 },
    },

    // ---------------- the screen ----------------
    buttons: {
      pause: true,           // the flight's own pause button, under the corner map. false when the game's one menu button takes over
      turnBack: true,        // "Turn back" on the pause card: ends the flight as not arrived
    },
    layer: 60,               // how far in front of the page the flight lies (the frame's z-index)

    // ---------------- the words ----------------
    // PROPOSALS, all of them: plain working words by the flight job, or Skies' own where marked. None is lore that
    // Chris has settled. {from} and {to} are the landings' names from game/travel/landings.js; {ship} is the ship's name.
    words: {
      // The ships' names are Skies of Aethermoor's own proposals (its docs/ships.md: "proposals for Chris to keep or
      // change"), winds growing with the ship. STAND-INS here: the Grey Hat's ship has no settled name in this game.
      ships: {
        skiff: { name: 'Zephyr', cls: 'Skiff' }, cutter: { name: 'Gale', cls: 'Cutter' }, brig: { name: 'Tradewind', cls: 'Brig' },
        frigate: { name: 'Tempest', cls: 'Frigate' }, skiff2: { name: 'Zephyr', cls: 'Skiff' }, cutter2: { name: 'Gale', cls: 'Cutter' },   // (journey job: the same ships, fitted out)
        galleon: { name: 'Doldrums', cls: 'Galleon' }, manowar: { name: 'Thunderhead', cls: 'Man-o\'-war' },
      },
      shipLine: '{cls} · {length} m',
      loading: 'Raising the sails…',
      setOut: ['Leaving {from}', 'Follow the light to {to}'],
      raiders: ['Raiders', 'Turn the view to them and fire'],
      raiderTag: 'Raider · {cls}',
      raiderDown: 'A raider is going down',
      clear: ['Seen off', 'Fly on to {to}'],
      arrive: ['{to}', 'The landing lies below'],
      lost: ['She is going down', 'All hands to the boats'],
      warnCrystals: 'The crystals are cracked: she is sinking',
      warnHigh: 'The air is too thin to climb higher',
      warnSea: 'Open sea: Aethermoor is behind you',
      hull: 'Hull', sails: 'Sails', crystals: 'Crystals', surge: 'Surge', fire: 'Fire',
      speed: '{kmh} km/h · {m} m up',
      batteries: { bow: 'Bow guns', stern: 'Stern guns', port: 'Port side guns', starboard: 'Starboard side guns' },
      noGuns: 'No guns that way', guns: ['{n} gun', '{n} guns'], outOfReach: 'out of reach',
      compass: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'],
      km: '{n} km', m: '{n} m',
      fps: 'frames a second',
      paused: ['Paused', 'The ship holds her place.'], resume: 'Fly on', turnBack: 'Turn back',
      pauseLabel: 'Pause', mapLabel: 'The map: tap to make it bigger',
      hintTouch: 'Left thumb steers · hold Fire and slide to aim · drag the sky to look round',
      hintMouse: 'A and D steer · Space climbs, Shift dives · drag to look round',
      keysButton: 'Keys (H)', keysTitle: 'Flying',
      keys: [
        ['A / D or ← →', 'turn'], ['Space or ↑', 'climb'], ['Shift or ↓', 'dive'], ['W / S', 'more sail / less sail'],
        ['Mouse', 'look round: the guns facing that way fire'], ['On a raider', 'the guns lock on and aim ahead of it'],
        ['Left click or F', 'fire'], ['R', 'surge: a burst of speed'], ['C · M · P · H', 'look ahead · map · pause · hide this'],
      ],
      lockHint: 'Click the sky to aim with the mouse. Esc lets go.',
      noLockHint: 'Drag the sky to aim. Left click or F fires.',
      noStart: 'The flight could not start: {why}',
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
