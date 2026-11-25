// lab-words.js: the words on the creatures job's own small page (game/pages/creatures-lab.html). Not in the game itself.
// The creatures' names are Aethermoor M7's, here as STAND-INS until Chris says what they are called in this game.
window.COVEN_CREATURES_LAB_WORDS = {
  title: 'The six creatures from Aethermoor M7',
  lead: 'Pick one. Look: see it stand, turn it, and play each of its motions. Play or Watch: fight it where it would be met.',
  names: {                     // STAND-IN: their M7 names
    glowcap: 'Glowcap', 'forge-spark': 'Forge-Spark', sapwight: 'Sapwight', rotwarden: 'The Rotwarden',
    rotstag: 'The Rot-Stag', thornhound: 'Thornhound',
  },
  size: '{m} m tall',
  where: '{zone}, slot {slot}',
  zones: { 'zone-1': 'Zone 1', 'zone-2': 'Zone 2', 'zone-3': 'Zone 3', 'zone-4': 'Zone 4' },
  look: 'Look', play: 'Play', watch: 'Watch', close: 'Back', turn: 'Turn',
  motions: {                   // the battle's motions, as the buttons name them
    stand: 'Stand', walk: 'Walk', appear: 'Arrives', hurt: 'Hurt', block: 'Braces', stagger: 'Staggers',
    charge: 'Gathers', die: 'Let go', retreat: 'Runs',
  },
  results: { won: 'won.', lost: 'lost.', fled: 'run from.' },
  noStart: 'This fight could not start (it needs 3D drawing, which is not available here).',
  waiting: 'Unpacking the creatures…',
};
