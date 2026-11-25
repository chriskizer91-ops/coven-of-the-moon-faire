// lab-words.js: the words on the peak-creatures job's own small page (game/pages/peak-creatures-lab.html). Not in the
// game itself. The two names are the hub's proposal (docs/lore/zone-4-creatures-proposal.md): STAND-INS until Chris
// says yes. So are the moves' names.
window.COVEN_PEAK_LAB_WORDS = {
  title: 'Two creatures of the frozen peaks',
  lead: 'Pick one. Look: see it stand, turn it, and play each of its motions. Play or Watch: fight it where it would be met.',
  names: { wickstoat: 'The Wickstoat', hoarmantle: 'The Hoarmantle' },        // STAND-IN
  size: '{m} m tall',
  where: '{zone}, slot {slot}',
  zones: { 'zone-4': 'Zone 4: the frozen peaks' },
  look: 'Look', play: 'Play', watch: 'Watch', close: 'Back', turn: 'Turn',
  sparks: 'Sparks: {n}',
  motions: {
    stand: 'Stand', walk: 'Walk', appear: 'Arrives', hurt: 'Hurt', block: 'Braces', stagger: 'Staggers',
    charge: 'Gathers', die: 'Let go',
  },
  results: { won: 'won.', lost: 'lost.', fled: 'run from.' },
  noStart: 'This fight could not start (it needs 3D drawing, which is not available here).',
  waiting: 'Unpacking the creatures…',
};
