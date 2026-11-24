// maps-data.js: every word the player reads on the maps, and the few settings that are somebody's call
// (Coven of the Moon Faire, the maps job, November 23, 2026). Nothing here is code: change a line and build again.
//
//   words    the Maps tab, the 3D map of Aethermoor and choosing where to fly
//   closed   one line for a landing that cannot be chosen yet, saying why
//   zones    how a spot in a zone's own metres lies on the map of Aethermoor (copied from game/places/zone-N.js, so the
//            small maps page works without a zone loaded; on a zone's page the zone's own numbers are used)
//   places   where this game stands a place somewhere else than the old Envoi's map did
//   world    the 3D map's settings
//   sky      the star map: every name and every line on it
//
// The sky's names are Chris's (November 24, 2026). Still stand-ins: the words on each card of the star map, and any
// entry below that carries standIn: true.
// The moon is Auros: Chris settled it on November 18 (docs/decisions.md). The old star map wrote "Aurous".
// Every line under `closed`, and the words "The coven" on the pin, are the maps job's proposals.
(function (G) {
  'use strict';
  G.COVEN_MAPS_DATA = {
    words: {
      tab: 'Maps',
      views: { zone: 'Zone', world: 'World', sky: 'Sky' },
      viewsLabel: 'Which map',
      // the pin on the 3D map. The old Envoi's said "Io"; here any of the four may lead, so it names them all (a proposal)
      pin: 'The coven',
      worldLoading: 'Unrolling the map of Aethermoor…',
      worldFailed: 'The map of Aethermoor could not be drawn here.',
      hintTouch: 'Drag to turn the land · two fingers to zoom and slide',
      hintMouse: 'Drag to turn the land · right button to slide · wheel to zoom',
      find: 'Back to where the coven is',
      // choosing where to fly
      chooseTitle: 'Where to?',
      chooseHint: 'Tap a landing',
      back: 'Back',
      setCourse: 'Set course',
      closeCard: 'Close',
      landing: 'Landing',
      shipHere: 'The ship lies here.',
      canFly: 'The ship can fly there.',
      courseSet: 'Course set for {name}.',
      been: 'A landing the ship knows.',
      // the numbers line, bottom left (so a frame rate can be read off the map itself)
      fps: '{fps} frames a second', measuring: 'measuring…', triangles: '{n} thousand triangles', detailPhone: 'phone detail', detailLaptop: 'laptop detail',
      // the Zone view
      zoneNone: 'The zone’s own map is drawn on the land. It shows here once a zone is open.',
      zoneLabel: 'The map of this zone',
      // the Sky view
      skyLoading: 'Charting the aether…',
      skyFailed: 'The star map could not be drawn here.',
      skyLabel: 'The star map of the Thareia system',
    },
    // why a landing cannot be chosen. {after} is the name of the landing the way there leads from.
    closed: {
      order: 'Not yet. The way there leads on from {after}.',
      any: 'Not yet. The ship cannot fly there.',
      // a line for one landing alone goes here under its id, and is used instead of the two above
      byId: {},
    },
    // k: metres in the zone to one pixel of the atlas (the zones lie on the map at one third size: 10 m / 3).
    // origin: the atlas pixel under the zone's (0, 0). start: where the walker starts, in the zone's metres.
    zones: {
      'zone-1': { zone: 1, origin: [1348, 1838], k: 10 / 3, start: [-70, 133] },
      'zone-2': { zone: 2, origin: [820, 1530], k: 10 / 3, start: [-7.72, -2.3] },
      'zone-3': { zone: 3, origin: [1150, 612], k: 10 / 3, start: [-4.24, -4.6] },
    },
    // The shipyard: the hub stood it in the bay, 280 m south of its pin (docs/decisions.md; Chris has not said yet whether
    // it stays). The map follows the game, so the pin and the shipyard's model agree. To put it back: delete the line.
    places: {
      shipyard: { at: [2097, 684] },
    },
    world: {
      // how close the view starts on the coven, in the map's units (one unit is 10 m on the atlas)
      startDist: 1000, startTilt: 0.72,
      // choosing: seconds the dotted line takes to draw, and how long it is held before the map answers
      lineSecs: 1.5, holdSecs: 1.1,
      // the dotted line's dashes: how many between two landings, and how high its arc rises (a share of its length)
      dashes: 44, arc: 0.12,
    },
    sky: {
      // false: the star map is to look at (Chris, November 23). true would bring back the old page's "Set course"
      // between worlds and its crystal cost, which this game has no use for yet (the maps job's call)
      travel: false,
      here: 'thareia',
      words: {
        title: 'THAREIA SYSTEM', home: 'System', loading: 'CHARTING THE AETHER', hint: 'Drag to spin · Pinch to zoom · Tap a world',
        hintMouse: 'Drag to spin · Wheel to zoom · Click a world',
        speeds: ['⏸ Paused', '▶ Gentle', '⏩ Fast', '⏭ Ages'],
        setCourse: 'Set course', youAreHere: '◆ You are here', crystalFrom: 'crystal from {name}', sailing: 'Sailing to {name}…',
        clock: 'Year {year} · {moon} {pct}% around', problem: 'The map hit a problem: {what}',
        close: 'Close', prev: 'Previous', next: 'Next',
      },
      // kind: the small line over the name. name: what the player reads. text, fact: its card.
      // standIn: true marks a name Chris has not settled.
      // THE NAMES BELOW ARE CHRIS'S (November 24, 2026: "I like all the names you suggested"): the Cresset and the Taper,
      // the Vigil, Brasa, Saffren, Pavane, Glaswen, the Amberwake, and the fair folk's names for the four planets.
      // Each card's words (text, fact) are still a proposal: docs/lore/sky-names-proposal.md.
      info: {
        aether: { kind: 'The space between worlds', name: 'The Aether',
          text: 'Space here isn’t empty. It’s the aether. Breathe it and you fall into a blissful sleep. Amber aether crystals, found inside the worlds and drifting free in space, power every journey. They charge from the light of the three stars.' },
        suns: { kind: 'The twin suns', name: 'The Cresset and the Taper',
          text: 'Two suns that circle each other at the heart of the system: the Cresset, big and gold, and the Taper, small and blue-white. Every world orbits the pair, and ships’ crystals charge from their light.',
          fact: 'A cresset is a basket of fire on a pole. A taper is the thin candle that lights it.' },
        far: { kind: 'Third star', name: 'The Vigil',
          text: 'The third star, red as a coal. It sits a great distance out but is still part of the system, keeping its watch from the edge. Its light charges the crystals too.',
          fact: 'A vigil is a watch kept through the night.' },
        w1: { kind: 'Known planet', name: 'Brasa',
          text: 'The world nearest the suns: small, dark and cracked, with fire showing through like a live coal. From Thareia it is a red spark low in the dawn or the dusk.',
          fact: 'The fair folk call it the Fire-Eater.' },
        w2: { kind: 'Known planet', name: 'Saffren',
          text: 'A world of gold dunes and deep canyons, with a few small blue-green seas. It is the bright light that rides ahead of the suns at dawn and follows them down at dusk.',
          fact: 'The fair folk call it the Outrider.' },
        thareia: { kind: 'Home world', name: 'Thareia',
          text: 'Home of the continent of Aethermoor. Most of its people have traveled by aether crystal, on little hoppers (basically skiffs) up to larger sailing vessels, all carrying massive crystals.',
          fact: 'Moon: {moon}' },
        // the moon: Auros (Chris, November 18, docs/decisions.md). The old page spelled it "Aurous"; its key here keeps
        // that spelling only because the star map's own code looks the moon up by it
        aurous: { kind: 'Thareia’s moon', name: 'Auros',
          text: 'Holds the highest known concentration of aether crystal. Travel comes easiest to its people, so they are the wealthiest and most powerful.',
          fact: 'Orbits Thareia once every 500 years' },
        w4: { kind: 'Known planet', name: 'Pavane',
          text: 'The giant of the system, banded in lilac, cream and rose, with a wide ring round it. It crosses the sky slowly and gravely, like the old dance it is named for.',
          fact: 'The fair folk call it the Hoop-Dancer.' },
        drift: { kind: 'Free crystal', name: 'The Amberwake',
          text: 'Aether crystal isn’t only found inside planets. Here the amber stone floats free, a band of it circling the suns. Lamplighters say the Taper spilled it, carrying fire out to light the Vigil.',
          fact: 'Captains call it the Drift.' },
        w5: { kind: 'Known planet', name: 'Glaswen',
          text: 'The farthest known world, pale and frozen, with a cold blue glow in the cracks of its ice. It is the slowest on the road: more than three of Thareia’s years to go round once.',
          fact: 'The fair folk call it the Straggler.' },
      },
    },
  };
})(typeof window !== 'undefined' ? window : globalThis);
