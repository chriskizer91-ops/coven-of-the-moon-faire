// proposal.js: the two peak creatures in zone 4's slots, for the peak-creatures lab page alone, until slots.js carries
// them (the job's last commits put them there; then this does nothing). THE HUB'S PROPOSAL (docs/lore/
// zone-4-creatures-proposal.md), NOT APPROVED: names and moves are stand-ins.
(function () {
  'use strict';
  const SL = window.COVEN_SLOTS && window.COVEN_SLOTS.zones; if (!SL) return;
  const P = {
    wickstoat: { slot: 'A', foe: 'lightThief', acts: { drink: 'pinch', dirge: 'glint', grasp: 'glint', pull: 'pinch' },
      look: { kind: 'm7', tall: 0.62, shadow: 0.55, yawBias: 0, glow: null, appearColor: [1, 0.75, 0.35], hitColor: 0xffe0b0, hitRGB: [1, 0.88, 0.7], near: 1.15 } },
    hoarmantle: { slot: 'B', foe: 'bigOne', acts: { smash: 'trample', boulder: 'trample', stomp: 'shake', regrow: 'breath' },
      look: { kind: 'm7', tall: 2.1, shadow: 1.5, yawBias: 0, glow: null, appearColor: [0.75, 0.88, 1], hitColor: 0xe8f4ff, hitRGB: [0.9, 0.95, 1], near: 2.6, reach: 1.0, halfW: 1.6, fxScale: 1.5 } },
  };
  for (const k in P) { const p = P[k], s = SL['zone-4'][p.slot]; if (!s || !s.model[p.foe] || s.model[p.foe].make === 'makePeakFoe') continue;
    const f = s.foes[p.foe]; for (const mv in p.acts) if (f.moves[mv]) f.moves[mv].act = p.acts[mv];
    s.model[p.foe] = { make: 'makePeakFoe', opts: { kind: k }, look: p.look };
    window.COVEN_FOE_LOOKS[p.foe] = Object.assign({ standIn: false }, s.model[p.foe]); }
})();
