// journey-data.js: how the zones join into one journey (Coven of the Moon Faire, the journey job, November 24, 2026).
// Every word the player reads on the way, and every choice the journey job made, is here and not in code.
// game/travel/journey.js reads it. Load it before journey.js.
//
// The journey: at a zone's landing, the Grey Hat's ship is the gate. Once the zone's story has reached its end, the
// coven can board, choose on the 3D map where to fly, and the chosen zone's page opens and plays the flight in before
// its world is built; then the zone begins at its landing. One save slot follows the player from page to page.
// The landings themselves (names, pages, the order they open in) are in game/travel/landings.js (the hub's).
(function (G) {
  'use strict';
  G.COVEN_JOURNEY = {

    // ---------------- when a zone is done ----------------
    // A zone's story has reached its end once this moment of its story has been played (game/people/zone-N.js,
    // W3D.STORY: each zone's "leaving"). Then the ship will go on to the next landing.
    // Zone 4 has no such moment: its leaving is a flag of its story (docs/slips/zone-4.md, For the hub, 3).
    done: { 'zone-1': 'leaving', 'zone-2': 'leaving', 'zone-3': 'leaving', 'zone-4': { flag: 'leaving' } },

    // a new game begins on this page (the front door's "Begin anew", and the menu's New game on any page)
    firstPage: 'zone-1.html',

    // ---------------- the gate: where the coven stands to board ----------------
    // For each landing, one or more spots by the ship, in that place's painting (as the people's spots are). The button
    // shows within `reach` metres. `ship` names the moored ship it belongs to (game/places/landing-ships.js), where a
    // zone has more than one; `refit` means she is up on the slip and will not fly until the zone's story is done.
    // JOURNEY JOB'S CALLS: each spot is beside the ship, away from the Grey Hat (his Talk button is the nearer one).
    gates: {
      wickhollow: [{ place: ['jetty', 750, 782], reach: 3 }],                                  // the pier's end, at the foot of the gangway
      warmCamp: [{ place: ['warm-roads-camp', 285, 526], reach: 3.2 }],                        // on the landing ground, beside her port side
      northCamp: [
        { place: ['northern-camp', 320, 516], reach: 3.2, ship: 'camp' },                      // on the landing ground, beside her, until the Grey Hat takes her down the coast
        { place: ['shipyard', 764, 448], reach: 3, ship: ['slip', 'refit'], refit: true },                 // at the foot of the slip, once she is up on it
      ],
      frozenCamp: [{ place: ['frozen-camp', 318, 516], reach: 3.2 }],                           // in the snow beside her port side (the zone-4 job laid her at 318, 458, bow west)
    },

    // ---------------- arriving ----------------
    // Where the coven stands when a flight sets her down at a landing, in that place's painting, and the spot she
    // faces. null: the zone page's own start (zones 2 and 3 start at their landing already).
    arrive: {
      wickhollow: { place: ['jetty', 768, 690], face: [768, 800] },                            // on the pier, a few steps from the ship
      warmCamp: null,
      northCamp: null,
      frozenCamp: null,
    },
    // After a flight the page's Begin screen is passed by itself, if the browser already counts the player's taps or
    // keys on the flight (that is what lets a phone play sound). 'button': always show it, as on any other opening.
    beginAfterFlight: 'auto',

    // ---------------- the way home ----------------
    // Once the last zone's story is done, the ship goes home: boarding at `from` offers only `to`, and the page of `to`
    // opens AS THE ENDING (game/people/faire-ending.js, the zone-4 job's), not as its first night. A slot that has
    // flown home opens the ending again on Continue. The homecoming's lines (zone 4's moment "homecoming" and the
    // narrator's line 10) are said as the ending opens, as the zone-4 job left them: the flight home itself is quiet.
    // `fights`: whether the wilds' fights run during the ending (false: the land is quiet; the zone-4 job's advice).
    home: { from: 'frozenCamp', to: 'wickhollow', page: 'zone-1.html', fights: false },

    // ---------------- the lines on the flight in ----------------
    // A zone's flight lines (its moments "flight" and "flight-after", game/talk/zone-N.js, and the narrator's lines for
    // them, game/people/narration.js) are said on the flight they were written for: the first flight into that zone
    // from the landing before it (landings.js, `after`), and only once. JOURNEY JOB'S CALL, the order: the narrator's
    // "flight" line as the flight starts; the Grey Hat's "flight" line when the raiders come; when they are seen off,
    // the narrator's "flight-after" line and then the Grey Hat's.
    flightLines: {
      start: [['narrator', 'flight']],
      raiders: [['talk', 'flight']],
      clear: [['narrator', 'flight-after'], ['talk', 'flight-after']],
    },

    // ---------------- opening the next page ----------------
    // Pages opened from an address of these kinds open the next page by themselves (a laptop's files, or a web
    // address). Any other kind (a phone's downloaded file can be one) shows a card that names the file to open next.
    // To change once Chris has tried the phone trial (trial/phone/).
    opensNext: ['file:', 'http:', 'https:'],

    // A flight lost, or turned back: the coven is back at the landing she left, nothing lost (THE HUB'S CALL, his to
    // change: the other choice would be to land anyway, or to try the flight again).
    lostGoesBack: true,

    // ---------------- the words ----------------
    // STAND-INS, all of them (the journey job's plain working words): none is lore Chris has settled.
    // {from}, {to} are landings' names (landings.js); {page} a page's file name.
    words: {
      board: 'Board the ship',                    // the button by the ship
      notYet: {                                   // pressed before the zone's story is done: why she will not go on yet
        'zone-1': 'The Grey Hat won’t fly on until his lamps are home.',
        'zone-2': 'The Grey Hat won’t fly on yet. There is still work on the Warm Roads.',
        'zone-3': 'The Grey Hat won’t fly on yet. There is still work in the north.',
        'zone-4': 'The Grey Hat won’t fly on yet.',
      },
      nowhereElse: 'There is nowhere else she can take you yet.',
      toDoor: 'Back to the front door',          // the button under the end card
      onSlip: 'She is up on the slip. She won’t fly until the refit is done.',
      lost: 'The crew brought her home to {from}. Nothing was lost.',
      turnedBack: 'She turned back to {from}.',
      flightError: 'The flight could not start. You are still at {from}.',
      // the card, where a page cannot open the next by itself
      card: {
        title: 'Open the next page',
        body: 'Open {page} from the same folder as this page. The coven is waiting there.',
        noStorage: 'This browser does not keep saves between pages. Save to a file now, and on the next page load it from the menu (Save, then Load from a file).',
        saveFile: 'Save to a file',
        stay: 'Stay here',
      },
      // the front door (game/pages/index.html)
      door: {
        title: 'Coven of the Moon Faire',          // the game's name (settled)
        subtitle: 'A story in four zones',         // STAND-IN
        replace: 'Every slot is in use. Tap again to begin anew in slot {n}, in place of its save.',
        opening: 'Opening…',
        ended: 'the end reached',                  // added to the line of a slot that has seen the ending (STAND-IN)
        // "Carry on", "Save {n}" and "New game" are the menu's own words (game/menu/menu-words.js)
      },
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
