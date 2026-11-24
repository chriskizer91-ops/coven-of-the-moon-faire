// landings.js: where the Grey Hat's ship sets down, one landing for each zone (Coven of the Moon Faire, November 23, 2026).
// The hub's file. The 3D map of Aethermoor shows these to choose from, the flight goes from one to another, and each
// zone's page opens at its own. Every name a player reads is here, not in code.
//
//   id      the landing's short name, used by the map, the flight and the pages
//   name    what the player reads
//   zone    which zone it is in (1 to 4)
//   page    the zone's page, which opens at this landing
//   place   the place in that zone where the ship stands (game/places/)
//   atlas   where it is on the map of Aethermoor, in the atlas's own pixels (4608 by 3072, north up). Zone 1's is the
//           jetty's pin in this game; the other three are the old Envoi's own landing spots for the same camps
//           (its src/game/game.js, LANDINGS), which this game's zones were laid out on.
//   after   the landing a flight to this one must come from (the zones are opened in order)
// The old Envoi had three more landings (Bogmire, Dawnroost, the shipyard) for flying within a zone. This game has
// none of them yet: a zone is walked.
(function (G) {
  'use strict';
  G.COVEN_LANDINGS = [
    { id: 'wickhollow', name: 'Wickhollow', zone: 1, page: 'zone-1.html', place: 'jetty', atlas: [1446, 1806], after: null },
    { id: 'warmCamp', name: 'The Warm Roads', zone: 2, page: 'zone-2.html', place: 'warm-roads-camp', atlas: [820, 1530], after: 'wickhollow' },
    { id: 'northCamp', name: 'The northern wilds', zone: 3, page: 'zone-3.html', place: 'northern-camp', atlas: [1150, 590], after: 'warmCamp' },
    { id: 'frozenCamp', name: 'The northeast peaks', zone: 4, page: 'zone-4.html', place: 'frozen-camp', atlas: [2760, 1090], after: 'northCamp' },
  ];
})(typeof window !== 'undefined' ? window : globalThis);
