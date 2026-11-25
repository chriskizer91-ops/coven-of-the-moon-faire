// menu-words.js: every word the menu shows a player (Coven of the Moon Faire, the menu job, November 23, 2026).
// Change a word here and nothing else needs to change. {n}, {zone} and the like are filled in by the menu.
// Words marked STAND-IN are the menu job's, not settled: Chris's to change.
(function (G) {
  'use strict';
  const W3D = G.W3D = G.W3D || {};
  W3D.MENU_WORDS = {
    // ---- the button on the land, and the menu's frame ----
    button: 'Menu',
    close: 'Close the menu',
    tabs: { save: 'Save', maps: 'Maps', coven: 'Coven', settings: 'Settings' },

    // ---- the Begin screen: one small line under the Begin button, and the way to the Save tab ----
    beginSlot: 'Save {n}',
    beginNew: 'a new game',
    beginGo: 'Saves',

    // ---- one line for a save: the zone, how far its story is, the coven's level, the lamps home (zone 1) ----
    zone: 'Zone {n}',
    part: 'part {part} of {parts}',
    level: 'level {n}',
    lamp1: '1 lamp home',
    lampN: '{n} lamps home',
    sep: ' · ',
    // the zones' names, as their pages' loading screens give them
    zones: { 'zone-1': 'Wickhollow and the fen', 'zone-2': 'The Warm Roads and Dawnroost', 'zone-3': 'The northern wilds and the shipyard', 'zone-4': 'The northeast peaks' },

    // ---- the Save tab ----
    slot: 'Save {n}',
    inUse: 'playing now',
    empty: 'Empty',
    savedNow: 'Saved just now',
    savedMin: 'Saved {n} minute ago',
    savedMins: 'Saved {n} minutes ago',
    savedAt: 'Saved {date}, {time}',
    lastOn: 'Last played on zone {n}’s page',
    carryOn: 'Carry on',
    continue: 'Continue',
    newGame: 'New game',
    delete: 'Delete',
    copy: 'Copy',
    copyTo: 'Copy to {slot}',
    back: 'Back',
    toFile: 'Save to a file',
    fromFile: 'Load from a file',
    fileNote: 'A small file, to carry this game between the laptop and the phone, or to keep a spare.',
    autoNote: 'The game saves itself into the save you are playing: every {n} seconds, and when the page is hidden or closed.',
    kept: 'Saves are kept in this browser. First kept here {date}; this is visit {n}.',
    keptTest: 'A check is running (?test): nothing is saved.',
    noStorage: 'This browser is not keeping saves for this page. Before you close it, use Save to a file. Next time, open the page and use Load from a file.',
    saveFailed: 'The last save could not be written (the browser said no). Use Save to a file to be safe.',
    // the questions asked first
    askNewHere: 'Start a new game in Save {n}? The game in it now will be gone, and the page starts again.',
    askNewThere: 'Start a new game in Save {n}? The game in it now will be gone. The game you are playing is saved first, in Save {cur}.',
    askDelete: 'Delete Save {n}? It cannot be brought back.',
    askCopyOver: 'Save {to} has a game in it. Put a copy of Save {from} over it?',
    yesNew: 'Yes, a new game',
    yesDelete: 'Yes, delete it',
    yesCopy: 'Yes, copy it over',
    no: 'No',
    cancel: 'Cancel',
    // the file
    fileSaved: 'Saved to a file: {name}',
    fileWrong: 'That file is not a save from this game. Nothing was changed.',
    fileBig: 'That file is too big to be a save from this game. Nothing was changed.',
    fileWhere: 'This save is “{line}”, from {date}, {time}. Put it in:',
    fileOverPlaying: 'Put it in Save {n}, in place of the game you are playing? The page starts again with the save from the file.',
    fileOver: 'Save {n} has a game in it. Put the save from the file over it?',
    yesPut: 'Yes, put it there',
    filePut: 'The save from the file is in Save {n}.',
    copied: 'Save {from} is copied to Save {to}.',
    deleted: 'Save {n} is deleted.',

    // ---- the Maps tab, until the maps job's tab takes its place ----
    mapsSoon: 'The maps come here: the zone’s map, the 3D map of Aethermoor and the star map. (Not built yet.)',

    // ---- the Coven tab ----
    covenTitle: 'The coven, level {n}',
    hp: '{a} / {b} HP',
    mp: '{a} / {b} MP',
    whole: 'Whole',
    hurtNoMax: '{a} HP',
    walking: 'Walking now',
    walkAs: 'Walk as {name}',
    // ---- who leads, at the top of the Coven tab (the leader job, November 25). STAND-IN, every one: Chris's to change ----
    leadTitle: 'Who leads',
    leadNote: 'You walk as the one who leads. The other three are with her.',
    leading: 'Leading',
    leadTap: 'Lead',
    leadBusy: 'Coming…',
    leadNow: '{name} leads now.',
    leadFailed: 'Something went wrong bringing {name}. {now} still leads.',
    leadBadge: 'Leads',
    bringing: 'Bringing {name}…',
    covenNoParty: 'Fights are not joined to this zone yet: the coven’s level is the one kept from zone 1.',
    // STAND-IN: the place kept for a full character viewer, to be built later
    viewerSoon: 'A closer look at each witch comes here later.',
    look: 'Look closer',

    // ---- the Settings tab ----
    numbers: 'The numbers',
    numbersNote: 'The counts under the frame rate, bottom left.',
    flip: 'Flipbook look',
    flipNote: 'The land drawn as a pixel picture.',
    fine: 'Fineness',
    chunky: 'chunky',
    veryFine: 'very fine',
    sharp: 'Fights drawn at',
    sharpNote: 'How sharp a fight’s 3D is drawn. 3/4 is the usual.',
    sharpNames: { 0.75: '3/4', 0.5: 'Half', 1: 'Full' },
    on: 'On',
    off: 'Off',

    // ---- dates ----
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    tabBroke: 'This tab could not be shown: {why}',
  };
})(window);
