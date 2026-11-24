// proposal.js: where each of the six would be met, and how each plays its slot's job (the creatures job).
// THE HUB'S PROPOSAL, NOT APPROVED: Chris has not said where each creature lives. Every line is data he can move.
// Six creatures, in zones 1 to 3. (Briarmaw was left out: Chris, November 24, 10:52.)
// Until the slots carry them (game/encounters/slots.js), only the creatures' own page (creatures-lab.html) uses this:
// it puts each creature into its slot for that page alone.
//   zone, slot   the slot it would take; foe: the slot's creature id (slots.js)
//   acts         for each of the slot's moves, the creature's own motion that plays it (its data file, `acts`)
//   names        its moves' names on screen: its own M7 moves (STAND-INS until Chris names them)
//   look         its size and light in the battle (game/battle/fights.js, FOE_LOOK, says what each is)
window.COVEN_M7_PROPOSAL = {
  // zone 1, A: the heavy one (the fen)
  rotwarden: { zone: 'zone-1', slot: 'A', foe: 'heavyOne', acts: { swipe: 'rootlash', bigBlow: 'roots', mendSelf: 'bloom' },
    names: { swipe: 'Rootlash', bigBlow: 'Grasping Roots', gather: 'Lifts the great root', mendSelf: 'Heartroot Bloom' },
    look: { kind: 'm7', tall: 2.5, shadow: 0.95, yawBias: 0, glow: null, appearColor: [0.55, 0.75, 0.35], hitColor: 0xd8e8a0, hitRGB: [0.8, 0.9, 0.55], near: 2.3 } },
  // zone 1, B: the swarm (three small)
  glowcap: { zone: 'zone-1', slot: 'B', foe: 'swarmling', acts: { nip: 'bump', dart: 'spores' }, names: { nip: 'Headbutt', dart: 'Spore Puff' },
    look: { kind: 'm7', tall: 0.8, shadow: 0.38, yawBias: 0, glow: [0.75, 0x9dff5a], appearColor: [0.6, 1, 0.4], hitColor: 0xd8ffb0, hitRGB: [0.75, 1, 0.6], near: 1.0 } },
  // zone 2, A: the one that weakens (the Ember Line)
  'forge-spark': { zone: 'zone-2', slot: 'A', foe: 'coldBringer', acts: { chill: 'flare', drainStrength: 'lure', touch: 'singe', blink: 'flicker' },
    names: { chill: 'Flare', drainStrength: 'Lure', touch: 'Singe', blink: 'Flicker' },
    look: { kind: 'm7', tall: 0.55, shadow: 0.3, yawBias: 0, glow: [0.9, 0xffa040], appearColor: [1, 0.6, 0.25], hitColor: 0xffc070, hitRGB: [1, 0.75, 0.4], near: 1.0 } },
  // zone 2, B: the pair (two together)
  thornhound: { zone: 'zone-2', slot: 'B', foe: 'pairBeast', acts: { bite: 'bite', rake: 'lunge' }, names: { bite: 'Bite', rake: 'Lunge' },
    look: { kind: 'm7', tall: 0.9, shadow: 0.62, yawBias: 0, glow: null, appearColor: [0.85, 0.7, 0.4], hitColor: 0xffe0b0, hitRGB: [1, 0.85, 0.6], near: 1.5 } },
  // zone 3, A: the armoured one (Eldergrove)
  sapwight: { zone: 'zone-3', slot: 'A', foe: 'armouredOne', acts: { slam: 'grasp', crush: 'leech', sweep: 'grasp' },
    names: { slam: 'Grasp', crush: 'Sap Leech', gather: 'Lurches forward', sweep: 'Sweep' },
    look: { kind: 'm7', tall: 2.0, shadow: 0.6, yawBias: 0, glow: [0.7, 0xffa040], appearColor: [0.9, 0.6, 0.25], hitColor: 0xffd090, hitRGB: [1, 0.8, 0.5], near: 1.6 } },
  // zone 3, B: the leaper (the cold moor)
  rotstag: { zone: 'zone-3', slot: 'B', foe: 'leaper', acts: { lunge: 'antler', snap: 'gore', pounce: 'trample' },
    names: { lunge: 'Antler Charge', snap: 'Gore', pounce: 'Trample', crouch: 'Rears' },
    look: { kind: 'm7', tall: 2.0, shadow: 0.9, yawBias: 0, glow: null, appearColor: [0.85, 0.8, 0.6], hitColor: 0xfff0c8, hitRGB: [1, 0.93, 0.75], near: 1.9 } },
  // zone 4: both slots stay stand-ins (Chris, November 24, 10:31: two new creatures for the frozen peaks will take them)
};
