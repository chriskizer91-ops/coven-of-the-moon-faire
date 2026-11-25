// words.js: every word the player reads that the fights job has added since step 4 (Coven of the Moon Faire).
// Words live here, not in code, so they are easy to change (CLAUDE.md, 5). Nothing here is lore that Chris has
// approved: every name marked STAND-IN is a stand-in, and every line is a proposal until he says so.
// {name}, {level}, {n} in a line are filled in by the code that shows it.
(function (G) {
  'use strict';
  G.COVEN_FIGHT_WORDS = {
    // ---- on the land (game/encounters/land-fights.js) ----
    land: {
      level: 'The coven is level {level}.',
      fled: 'The coven slips away.',
      noStart: 'The fight could not start here ({why}).',
      afresh: 'A new start: the coven at level 1.',
      rested: 'The coven rests. Everyone is whole again.',
      // where the coven wakes after a lost fight, and where it rests, zone by zone (the narrator has a line for each
      // waking: game/people/narration.js, `woke`)
      woke: { 'zone-1': 'The coven wakes at the Moon Faire’s camp, healed.', 'zone-2': 'The coven wakes at the Warm Roads camp, healed.',
        'zone-3': 'The coven wakes at the northern camp, healed.', 'zone-4': 'The coven wakes at the camp at the foot of the pass, healed.' },
      restAt: { 'zone-1': 'The coven rests by the Moon Faire’s fire. Everyone is whole again.' },
      // a fight that is tied to a thing on the land (zone 2's road stones): shown when the thing is used
      thingFight: 'Something stirs by the stone.',
    },
    // ---- words over a fighter in the battle (game/battle/screen.js shows them; game/battle/engine.js says when) ----
    battle: {
      weakened: { word: 'Weakened', cls: 'heat', note: 'The cold gets into the coven’s hands: for a while every blow they land is lighter.' },
      slides: { word: 'Blades slide off', cls: '', note: 'Blades slide off it. Spells do not.' },
      answered: { word: 'She falters', cls: 'weak', note: 'Io answers with the same prayer. The knight falters, and loses her turn.' },
    },
    // ---- the stand-in creatures of the eight slots (game/encounters/slots.js). STAND-IN names: Chris's creatures
    // will bring their own ----
    slots: {
      name: 'Strange creature',                         // STAND-IN: shown for every slot until a real creature fills it
      intro: 'Something the coven has no name for stands in the way.',   // STAND-IN
      attack: 'The strange creature attacks!',          // STAND-IN
      attackMany: 'The strange creatures close in!',    // STAND-IN
      win: 'It goes still, and is only a shape in the dark.',   // STAND-IN (what a beaten creature does is Chris's call)
      // creatures job: the six creatures from Aethermoor M7 in their slots. STAND-IN: their M7 names and their own M7
      // moves' names, until Chris names them for this game
      creatures: {
        heavyOne: { name: 'The Rotwarden', moves: { swipe: 'Rootlash', bigBlow: 'Grasping Roots', gather: 'Lifts the great root', mendSelf: 'Heartroot Bloom' } },
        swarmling: { name: 'Glowcap', moves: { nip: 'Headbutt', dart: 'Spore Puff' } },
        coldBringer: { name: 'Forge-Spark', moves: { chill: 'Flare', drainStrength: 'Lure', touch: 'Singe', blink: 'Flicker' } },
        pairBeast: { name: 'Thornhound', moves: { bite: 'Bite', rake: 'Lunge' } },
        armouredOne: { name: 'Sapwight', moves: { slam: 'Grasp', crush: 'Sap Leech', gather: 'Lurches forward', sweep: 'Sweep' } },
        leaper: { name: 'The Rot-Stag', moves: { lunge: 'Antler Charge', snap: 'Gore', pounce: 'Trample', crouch: 'Rears' } },
      },
      moves: {                                          // STAND-IN names of the stand-ins' moves
        swipe: 'Swipe', bigBlow: 'Heavy blow', gather: 'Gathers itself', mendSelf: 'Knits itself', nip: 'Nip', dart: 'Dart',
        chill: 'Cold breath', drainStrength: 'Cold hands', touch: 'Cold touch', blink: 'Blink', bite: 'Bite', rake: 'Rake',
        slam: 'Slam', crush: 'Crush', sweep: 'Sweep', lunge: 'Lunge', snap: 'Snap', pounce: 'Pounce', crouch: 'Crouches',
        drink: 'Drinks the light', dirge: 'Dirge', grasp: 'Cold grasp', pull: 'Pulls under', smash: 'Smash',
        boulder: 'Hurls a boulder', lift: 'Lifts a boulder', stomp: 'Stomp', regrow: 'Regrows',
      },
    },
    // ---- the big fights (game/encounters/zone-N.js names each; game/encounters/foes.js has the foes that are new) ----
    // offer: the button on the land. notYet: said once when the coven comes too soon (the narrator says it instead when
    // the hub's page answers the event). intro, after, attack, win, lose, end: the fight's own words.
    gates: {
      greatWraith: { offer: 'Face the great wraith', notYet: 'Something waits here, too strong for the coven yet (level {level}).' },
      // zone 2, at Dawnroost's living node: three wraiths come up the hill for it (Marta's and Callisto's lines)
      nodeNight: {
        offer: 'Hold the node', notYet: 'Whatever comes for the node at night, the coven is not ready to meet it yet (level {level}).',
        intro: 'Dawnroost’s last living node burns low on the hill, and its light has drawn them.',
        after: 'Three wraiths come up the hill, slow, stronger than any the coven has met.',
        attack: 'The wraiths close in!',
        moth: 'Three pale moths rise from the empty robes and drift into the light of the node.',
        win: 'The node holds.',
        lose: 'The coven falls on the hill. The node still burns, and the wraiths will come again tonight.',
      },
      // zone 2's three road stones: something cold sits by each dark stone (the fights job's proposal)
      stone: {
        intro: 'The stone is dark and cold, and the cold has company.', attack: 'The cold lights close in!',
        win: 'The road is quiet. The stone can be lit.', lose: 'The coven falls by the dark stone.',
      },
      // zone 3, on the crossroads' east road: the knight of light (Halcyon; nothing in these words gives her name)
      knightOfLight: {
        name: 'Knight of light',                       // shown in the fight; her name is not said until Ysmera says it
        offer: 'Stand in her way', notYet: 'Something bright is walking the north road. The coven is not ready to stand in its way yet (level {level}).',
        intro: 'Someone is coming down the north road, all light.',
        after: 'A knight in Warden steel, her sword already drawn. She fights with Io’s own prayers.',
        attack: 'The knight attacks!',
        tip: 'When she casts one of Io’s own prayers, Io can answer with the same one.',
        retreat: ['Io answers her, prayer for prayer.', 'The knight stops. For a long moment she only looks at Io.'],
        win: 'The knight lowers her sword, and walks back the way she came.',
        lose: 'The coven falls at the crossroads. The knight does not strike again. She walks back north.',
        moves: { flame: 'Flame Bolt', crescent: 'Crescent Blades', briars: 'Nightbloom Briars', mend: 'Lunar Mend', moonlight: 'Moonlight', gather: 'The light gathers' },
      },
      // zone 4, on the frozen pass: the great bramble that bars the road (the battle's Bramble Colossus, cut down to size)
      greatBramble: {
        name: 'Great bramble',
        offer: 'Cut a way through', notYet: 'The bramble over the road is older and stronger than the coven yet (level {level}).',
        intro: 'The road is gone. There is only bramble, grown right over the path, green where nothing else is.',
        after: 'The ground splits. It heaves itself up out of the snow, and a great thorned bud opens on a glowing heart.',
        attack: 'The great bramble attacks!',
        moth: 'Its spire cracks at the foot and topples like a tree. Its heart beats once more, and goes dark.',
        win: 'The great bramble is felled, and the road up the pass is open.',
        lose: 'The coven falls among its thorns.', fled: 'The coven backs away down the road. It cannot follow: it is rooted. The road is still shut.',
      },
      // zone 4, at the dead Moonwell: the fire, in two forms. STAND-IN names: what the fire is called is Chris's
      theFire: {
        offer: 'Face the fire', notYet: 'The fire at the dead Moonwell would swallow the coven as it is (level {level}).',
        forms: [
          { name: 'The fire that holds',               // STAND-IN name of the first form
            intro: 'The dead Moonwell gives no light of its own. Every light in the north has been drawn here, and held.',
            after: 'The fire wakes. Eight years of held lights turn, all at once, to look at the coven.',
            attack: 'The fire reaches for them!',
            retreat: ['The fire burns as high as it did at the start.', 'Nothing hurts it. It will not let anything end.'],
            win: 'It will not end. Not this way.', lose: 'The fire takes the coven’s light and holds it with the rest.' },
          { name: 'The fire’s hunger',                 // STAND-IN name of the second form
            intro: 'Kore steps in front. Every hungry thing in the fire turns to her.',
            after: 'It comes for her with all of it.',
            attack: 'The hunger falls on Kore!',
            tip: 'No blow can end it. Let it strike Kore until its Fate is sealed, then use her Sealed Fate.',
            moth: 'Kore gives it its ending. The fire lets go, and every light it held rises.',
            win: 'The fire has ended.', lose: 'The fire takes the coven’s light and holds it with the rest.' },
        ],
      },
    },
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
