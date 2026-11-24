// Coven: copied from Aethermoor M7 (prototypes/foe-hd/pages/beasts/kit/moves-stag.js, commit 2070b57) and made a script: the word `export` taken off each
// line, and the set handed to M7.addMoves at the end (both marked Coven). Nothing else changed.
(function () {
'use strict';
// Moves for a stag (the Rot-Stag; Foes: beasts, session 7). Bones from the kit's quad rig: hips, spine, chest, neck
// (neck_base is a helper the loader drives), head, jaw, tail, and per leg fl/fr/bl/br _upper, _lower, _paw.
// three.js axes: +Z forward, +Y up; rotation.x > 0 pitches a forward bone down and swings a hanging leg back.
// Bones only turn (no scale, no slide); the whole body may move. Gentle bends: big turns stretch the skin.
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const bump = (x) => Math.sin(Math.max(0, Math.min(1, x)) * Math.PI);
const seg = (u, a, b) => ease((u - a) / (b - a));
const LEGS = ['fl', 'fr', 'bl', 'br'];
function rx(b, n, v) { if (b[n]) b[n].rotation.x += v; }
function ry(b, n, v) { if (b[n]) b[n].rotation.y += v; }
function rz(b, n, v) { if (b[n]) b[n].rotation.z += v; }

function gait(b, step, amp = 1) {
  const P = { fl: 0, br: 0, fr: Math.PI, bl: Math.PI };
  for (const k of LEGS) {
    const ph = step + P[k], s = Math.sin(ph), lift = Math.max(0, Math.cos(ph)), front = k[0] === 'f';
    rx(b, k + '_upper', -0.19 * s * amp);
    if (front) { rx(b, k + '_lower', -0.45 * lift * amp); rx(b, k + '_paw', 0.35 * lift * amp); }
    else { rx(b, k + '_lower', 0.35 * lift * amp); rx(b, k + '_paw', -0.3 * lift * amp); }
  }
}

const stag = {
  list: [['idle', 'Breathe'], ['walk', 'Walk'], ['gore', 'Gore'], ['charge', 'Antler Charge'], ['trample', 'Trample'], ['bellow', 'Rot Bellow'], ['hurt', 'Hit'], ['ko', 'Fall']],
  dur: { gore: 1.2, charge: 2.4, trample: 1.8, bellow: 2.6, hurt: 0.9, ko: 2.6 },
  get MOVES() { return this.list; }, get DUR() { return this.dur; }, LUNGE: 'gore',
  ALIAS: { bite: 'gore', strike: 'charge', swipe: 'trample', roar: 'bellow', cast: 'bellow' },
  lunge: 'gore',
  pose(F, move, u, t, step) {
    const b = F.bones, B = F.body, br = Math.sin(t * 1.6), H = F.height;
    rx(b, 'spine', -0.01 * br); rx(b, 'chest', 0.012 * br);            // breathing: a small turn
    rx(b, 'neck', 0.02 * br); ry(b, 'head', 0.08 * Math.sin(t * 0.5));
    ry(b, 'tail', 0.12 * Math.sin(t * 2.1));
    if (move === 'idle') return;
    if (move === 'walk') {
      gait(b, step);
      B.position.y = 0.012 * H * Math.abs(Math.sin(step));
      rz(b, 'hips', 0.03 * Math.sin(step)); rx(b, 'neck', 0.04 * Math.sin(step * 2));
      return;
    }
    if (move === 'gore') {
      // black antlers, low and fast: the head dips and hooks up
      const down = seg(u, 0, 0.35), hook = seg(u, 0.38, 0.55), back = 1 - seg(u, 0.65, 1);
      rx(b, 'chest', 0.04 * down * back); rx(b, 'neck', 0.19 * down * back - 0.09 * hook * back); rx(b, 'head', 0.22 * down * back - 0.22 * hook * back);
      rx(b, 'chest', 0.05 * down * back); B.position.z = 0.12 * H * down * back;
      rx(b, 'fl_upper', -0.15 * down * back); rx(b, 'fr_upper', -0.15 * down * back);
      return;
    }
    if (move === 'charge') {
      // it lowers its head, stamping, then runs at you antlers first
      const low = seg(u, 0, 0.3), go = seg(u, 0.5, 0.75), back = 1 - seg(u, 0.85, 1);
      const stamp = Math.max(0, Math.sin(u * 30)) * (1 - seg(u, 0.45, 0.5));
      rx(b, 'chest', 0.04 * low * back); rx(b, 'neck', 0.2 * low * back); rx(b, 'head', 0.19 * low * back);
      rx(b, 'fr_upper', -0.2 * stamp * low); rx(b, 'fr_lower', -0.3 * stamp * low);
      B.position.z = 0.6 * H * go * back; B.position.y = -0.02 * H * low * back;
      if (go > 0 && back > 0) gait(b, u * 40, 0.8 * go);
      return;
    }
    if (move === 'trample') {
      // up on its hind legs, forehooves high, and down through the party
      const up = seg(u, 0, 0.4), down = seg(u, 0.5, 0.65), k = up * (1 - down), land = bump((u - 0.5) / 0.3);
      B.rotation.x = -0.32 * k; B.position.y = 0.06 * H * k; B.position.z = 0.15 * H * down * (1 - seg(u, 0.8, 1));
      for (const l of ['fl', 'fr']) { rx(b, l + '_upper', -0.32 * k); rx(b, l + '_lower', -0.55 * k); rx(b, l + '_paw', 0.3 * k); }
      for (const l of ['bl', 'br']) { rx(b, l + '_upper', 0.3 * k); rx(b, l + '_lower', -0.15 * k); }
      rx(b, 'neck', -0.15 * k + 0.2 * land); rx(b, 'head', 0.1 * land);
      return;
    }
    if (move === 'bellow') {
      // head up, the jaw wide, a bellow that smells of grave-sap
      const up = seg(u, 0, 0.25), hold = 1 - seg(u, 0.8, 1), k = up * hold, q = Math.sin(u * 50) * 0.02 * k;
      rx(b, 'neck', -0.15 * k); rx(b, 'head', -0.27 * k + q); rx(b, 'jaw', 0.3 * k + q);
      rx(b, 'chest', -0.05 * k);
      return;
    }
    if (move === 'hurt') {
      const a = bump(u * 1.6) * (1 - seg(u, 0.6, 1));
      B.position.z = -0.08 * H * a; rx(b, 'chest', -0.08 * a); rx(b, 'neck', -0.18 * a); rx(b, 'head', -0.12 * a);
      rz(b, 'head', 0.1 * a); rx(b, 'jaw', 0.2 * a); rz(b, 'hips', 0.05 * Math.sin(u * 40) * a);
      return;
    }
    if (move === 'ko') {
      // the knees go, it sinks, rolls onto its side, the head last
      const buckle = seg(u, 0, 0.35), roll = seg(u, 0.3, 0.75), drop = seg(u, 0.6, 1);
      for (const l of LEGS) {
        if (l[0] === 'f') { rx(b, l + '_upper', 0.22 * buckle); rx(b, l + '_lower', -0.4 * buckle); }
        else { rx(b, l + '_upper', -0.17 * buckle); rx(b, l + '_lower', 0.28 * buckle); }
      }
      B.position.y = -0.2 * H * buckle + 0.04 * H * roll; B.rotation.z = 1.4 * roll; B.position.x = -0.2 * H * roll;
      rx(b, 'neck', 0.25 * drop); rz(b, 'head', -0.2 * drop);
      return;
    }
  },
};
window.M7.addMoves('stag', stag);  // Coven: handed to the shared loader (game/battle/models/m7/m7-foe.js)
})();
