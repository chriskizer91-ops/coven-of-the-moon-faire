// menu-data.js: what the menu and the save slots work with (Coven of the Moon Faire, the menu job, November 23, 2026).
// Every key the game writes in the browser's storage, and whether it goes in a save slot; and the menu job's own calls,
// each as one line, so the hub or Chris can change one without touching the code. The words a player reads are in
// menu-words.js.
(function (G) {
  'use strict';
  const W3D = G.W3D = G.W3D || {};
  W3D.MENU_DATA = {
    // ---- every key the game writes (found by searching game/ for localStorage, November 23) ----
    // slot: true   the game's progress: copied into the save slot in use, and back out of it when a slot is loaded
    // slot: false  this device's own settings, or the menu's bookkeeping: they stay with the device, in no slot
    //              (the menu job's call: settings belong to the phone or the laptop, so a save carried from the laptop
    //              to the phone does not bring the laptop's settings. The other choice: settings in every slot too)
    keys: [
      { key: 'coven.party', slot: true, what: 'the party: its level and experience, each witch\'s HP and MP, sunstone shards, herbs, fights won, run from and lost, gates won (game/party/party.js, the fights job\'s; only zone 1 loads it so far)' },
      { prefix: 'coven.story.', slot: true, what: 'a zone\'s story: its stage, the lines heard, who has been talked to, the moments played, road stones lit, small flags (game/people/story.js; zone 1 coven.story.v1, zone 2 coven.story.z2.v1, zone 3 coven.story.z3.v1, and zone 4\'s when it comes)' },
      { key: 'envoi3d-found', slot: true, what: 'the keepsakes found on the land (game/engine/place/walker.js)' },
      { key: 'coven.where', slot: true, what: 'where the coven stands, which way she faces, who walks, and on which page (this job\'s: written with every save)' },
      // leader: who leads, kept in the save and carried from page to page (the leader job, November 25)
      { key: 'coven.leader', slot: true, what: 'who leads: the witch the player walks as, any of the four (the leader job\'s: written the moment she is chosen)' },
      { key: 'envoi3d-look', slot: false, what: 'the Flipbook look on the land, on or off, and how fine (walker.js)' },
      { key: 'envoi.sharp', slot: false, what: 'how sharp a fight\'s 3D is drawn: 3/4, half or full (game/battle/screen.js, game/pages/battle.html)' },
      { key: 'envoi.fps', slot: false, what: 'the fights\' frame-rate cap (game/battle/screen.js)' },
      { key: 'mfw.flipbook', slot: false, what: 'the Flipbook look in fights (game/battle/screen.js, game/pages/battle.html)' },
      { key: 'mfw.songBed.v2', slot: false, what: 'the volume knob of Chris\'s song under everything (game/battle/song-bed.js; no zone page loads it yet)' },
      { key: 'coven.settings', slot: false, what: 'the menu\'s own settings: whether the numbers show (this job\'s)' },
      { key: 'coven.saves', slot: false, what: 'which slot is in use, a slot waiting to be loaded when the page opens again, when this browser first kept a save, how many visits (this job\'s)' },
      { prefix: 'coven.slot.', slot: false, what: 'the three save slots, coven.slot.1 to coven.slot.3: each a copy of every key above marked slot: true, with the time, the page and one line to read (this job\'s)' },
    ],
    slots: 3,
    // the game saves itself into the slot in use this often, and whenever the page is hidden or closed
    autosaveSeconds: 20,
    // the menu job's call: a save remembers where the coven stood and who walked, and the page puts her back there when
    // it opens again (only on the page the save was made on). The other choice: false, and she starts where the page starts
    keepWhere: true,
    // ---- who leads (the leader job, November 25, 2026; Chris: "Any of them can lead, so there has to be a thing in the menu
    // to change who's the walking-around model") ----
    // ids: the four, in the coven's order (W3D.WITCHES, game/witches/walkers.js, has their names)
    // start: who leads in a new game, and in a save made before this job (it kept no leader: Io walked). The leader job's
    //   call; the other choice is to keep the leader of the game being played when a new game starts
    // colours: each one's own colour, for her button in the Coven tab: picked from her clothes as the land draws them
    //   (Io her wine-red hat and robe, Kore her plum jester's coat, Europa her orange patchwork, Callisto her slate-blue
    //   cloak). The leader job's call; the other choice is a small picture of each
    leader: {
      ids: ['io', 'kore', 'europa', 'callisto'],
      start: 'io',
      colours: { io: '#b0354f', kore: '#9a3a7c', europa: '#e07a30', callisto: '#5f7f9a' },
    },
    // the hub's call, for Chris to overrule: one menu button on the land where there were two ("who" and "nums"), with
    // both inside the menu. false keeps the old buttons beside the menu's
    oneButton: true,
    // the tabs the menu makes itself (other jobs add theirs with W3D.menu.addTab). The Maps tab is a stand-in line until
    // the maps job adds a tab with the id 'maps'
    tabs: { save: 10, maps: 20, coven: 30, settings: 40 },
    // how sharp a fight's 3D is drawn: the battle's own three choices (game/battle/screen.js), 3/4 unless another is picked
    sharp: { key: 'envoi.sharp', choices: [0.75, 0.5, 1], start: 0.75 },
    // what a save file must say about itself before it is let in, and how big it may be
    file: { game: 'Coven of the Moon Faire', kind: 'coven-save', v: 1, most: 1048576 },
  };
})(window);
