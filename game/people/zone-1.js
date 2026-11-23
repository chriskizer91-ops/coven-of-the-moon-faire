// zone-1.js (people): who stands where in zone 1 (Coven of the Moon Faire, November 19, 2026).
// The Moon Faire's eleven fair folk, as themselves (Chris, November 18). Their names are the hub's, of November 19, at
// Chris's asking, and his to change. `body` is the painted person in game/people/folk/npcs.js.
// A spot is `camp: [east, south]` in metres from the camp's well; or `road: [the road's name, how far along it (0 to 1),
// metres to its side]`; or `place: [the place's id, x, y]` in that place's painting, with `look` the spot they face. `faces: 'well'` looks at the well until the coven comes near.
(function (G) {
  'use strict';
  const W3D = G.W3D; W3D.PEOPLE = W3D.PEOPLE || {};
  W3D.PEOPLE['zone-1'] = {
    camp: [-70, 128],
    people: [
      { id: 'odile', name: 'Odile', trade: 'the lamp-seller', body: 'old-lamp-seller', camp: [-12.4, 12.6] },          // by her lamp stall
      { id: 'bashir', name: 'Bashir', trade: 'the ribbon-dyer', body: 'ribbon-dyer', camp: [12.4, 12.6] },              // by the brass stall
      { id: 'zofia', name: 'Zofia', trade: 'the fortune-teller', body: 'fortune-teller', camp: [12.8, -2.4] },          // by her booth
      { id: 'linnet', name: 'Linnet', trade: 'the ballad-singer', body: 'ballad-singer', camp: [-0.5, -11.5] },         // before the big top
      { id: 'otto', name: 'Otto', trade: 'the baker', body: 'fair-baker', camp: [-7.2, 6.4] },                          // by his oven cart
      { id: 'corwin', name: 'Corwin', trade: 'the night watchman', body: 'old-night-watchman', camp: [-7.6, -9.4] },    // warming at the north brazier
      { id: 'ros', name: 'Ros', trade: 'the pie-seller', body: 'pie-seller', camp: [8.2, -5.6] },                       // by her pie cart
      { id: 'tully', name: 'Tully', trade: 'the gate keeper', body: 'gate-keeper', camp: [28.6, 1.9] },                 // just inside the gate
      { id: 'kofi', name: 'Kofi', trade: 'the chestnut roaster', body: 'chestnut-roaster', camp: [8.6, 10.4] },         // at the south brazier
      { id: 'bridie', name: 'Old Bridie', trade: 'the lamplighter', body: 'old-lamplighter', road: ['Wickhollow to Io’s cottage', 0.66, 2.6] },   // on the south road, two thirds of the way to the cottage
      { id: 'jory', name: 'Jory', trade: 'the farm lad', body: 'farm-lad', road: ['Wickhollow to the jetty', 0.36, -3.2] },                           // by the lake, on the jetty road
      // the Grey Hat, on the jetty's pier where his ship moors (his own painted body)
      { id: 'captain', name: 'The Grey Hat', trade: 'the captain', body: 'grey-hat-captain', place: ['jetty', 790, 600], look: [768, 470] },
      // the townsfolk, where the new Envoi stands them in each place's painting. Their bodies are the fair folk's other
      // shapes for now (hub's call), so some look like a person of the Faire until they are painted anew.
      { id: 'quill', name: 'Quill', trade: 'the sailor', body: 'chestnut-roaster-opus', place: ['jetty', 1150, 385], look: [1050, 470] },
      { id: 'nettie', name: 'Nettie', trade: 'the herb-seller', body: 'old-lamplighter-opus', place: ['wickhollow', 568, 426], look: [640, 520] },
      { id: 'hilde', name: 'Hilde', trade: 'the smith', body: 'pie-seller', place: ['wickhollow', 1015, 364], look: [960, 460] },
      { id: 'gretch', name: 'Mayor Gretch', trade: 'the mayor', body: 'old-night-watchman-opus', place: ['wickhollow', 705, 594], look: [800, 594] },
      { id: 'wenna', name: 'Old Wenna', trade: 'the herb-seller', body: 'fortune-teller-opus', place: ['bogmire', 652, 470], look: [700, 560] },
      { id: 'tobb', name: 'Tobb', trade: 'the innkeeper', body: 'fair-baker-opus', place: ['bogmire', 1184, 296], look: [1260, 330] },
      { id: 'pell', name: 'Pell', trade: 'the child', body: 'farm-lad', size: 0.72, place: ['bogmire', 744, 354], look: [744, 300] },
    ],
  };
  // ---- how zone 1's story moves (game/people/story.js reads this; the rules are the hub's, from the story brief's table) ----
  W3D.STORY = W3D.STORY || {};
  W3D.STORY['zone-1'] = {
    talk: 'COVEN_TALK_Z1', key: 'coven.story.v1', gate: 'greatWraith', first: 'opening',
    stages: [
      { to: 1, when: (c) => c.heard('captain.ask') },                 // asked: the Grey Hat has asked for his lamps
      { to: 2, from: 1, when: (c) => c.heard('nettie.hello') },       // home: after that, Nettie has known Io
      { to: 3, when: (c) => c.heard('wenna.wraith') },                // fen: Old Wenna has told of the great wraith
      { to: 4, when: (c) => c.won() },                                // after: the great wraith is released
    ],
    tellStage: { 1: 'asked' },
    tell: [['wickhollow', (c) => c.near('wickhollow', 4)], ['jetty', (c) => c.near('jetty', 10)]],
    moments: [
      ['after-wraith', (c) => c.won()],
      ['leaving', (c) => c.heard('captain.sew')],
      ['cottage', (c) => c.near('cottage', 34)],
      ['thornwood', (c) => c.near('thornwood', 30)],
      ['fen', (c) => c.near('bogmire', 60)],
      ['before-wraith', (c) => c.gate && !c.won() && c.gateD() < 40],
    ],
  };
  // ---- stand-in words, one or two each, so the talk can be tried. NOT the story's lines: those are being written by the
  // story job (docs/lore/story-brief.md) and replace every one of these. Several lean on Moon Faire's own stand-ins. ----
  W3D.PEOPLE_STANDIN = {
    odile: ['Every flame in the row leans one way tonight. There is no wind.', 'The captain’s lamps went over us like geese. He is at the jetty, past the town.'],
    bashir: ['Blue is the one that holds. I sold your Fox all I had.'],
    zofia: ['A coin, and I turn a card. Tonight I would rather not.'],
    linnet: ['You four go on after me. Nobody envies me that.'],
    otto: ['My oven draws as if it wants to leave. Have a loaf before it does.'],
    corwin: ['Shutters first, then lamps. Forty years, and I never saw them lean.'],
    ros: ['Mutton. And the other one is mutton too.'],
    tully: ['Twelve lights went over my gate, and not one of them paid.'],
    kofi: ['My coals went grey as they passed, then came back. Chestnut?'],
    bridie: ['This is the last lantern on the road. I light it every night.'],
    jory: ['My lantern got up and left me. I am not taking my eyes off this fire.'],
  };
})(window);
