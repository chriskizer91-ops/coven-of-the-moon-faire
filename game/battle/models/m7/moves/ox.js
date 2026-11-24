// ox.js: the Hoarmantle's moves (Coven of the Moon Faire, the peak-creatures job, November 24, 2026). Made here, in the
// form of Aethermoor M7's moves files, so the shared loader (m7-foe.js) plays it as it plays theirs. Each move is a pure
// pose of u (0..1 through the move) and t (the clock). Bones only turn; the whole body may move.
// Bones (hoarmantle/rig.py): hips, spine, chest, neck, head, and for each leg fl / fr / bl / br: _upper, _lower, _paw.
// The legs stand in the hollow under the hair; the hair is the body's, so it sways only as the body sways.
// three.js axes: +Z forward, +Y up; rotation.x > 0 pitches a forward-pointing bone down and swings a hanging leg back.
(function () {
'use strict';
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const bump = (x) => Math.sin(Math.max(0, Math.min(1, x)) * Math.PI);
const seg = (u, a, b) => ease((u - a) / (b - a));
const LEGS = ['fl', 'fr', 'bl', 'br'];
function rx(b, n, v) { if (b[n]) b[n].rotation.x += v; }
function ry(b, n, v) { if (b[n]) b[n].rotation.y += v; }
function rz(b, n, v) { if (b[n]) b[n].rotation.z += v; }
// one leg lifted and set down: k 0..1, how far forward (fw) it reaches
function step1(b, l, k, fw) {
  const front = l[0] === 'f';
  rx(b, l + '_upper', -fw * k); rx(b, l + '_lower', (front ? -0.2 : 0.2) * bump(k)); rx(b, l + '_paw', (front ? 0.18 : -0.15) * bump(k));
}
// head down, horns forward (k 0..1)
function headDown(b, k) { rx(b, 'neck', 0.03 * k); rx(b, 'head', 0.2 * k); }   // the head does it; the neck, buried in hair, barely moves

const ox = {
  list: [['idle', 'Breathe'], ['walk', 'Walk'], ['trample', 'Trample'], ['breath', 'Winter Breath'], ['shake', 'Shake the Mantle'], ['hurt', 'Hit'], ['ko', 'Fall']],
  dur: { trample: 2.6, breath: 2.8, shake: 2.2, hurt: 1.1, ko: 3.0 },
  get MOVES() { return this.list; }, get DUR() { return this.dur; }, LUNGE: 'trample',
  ALIAS: { bite: 'trample', strike: 'trample', swipe: 'trample', lunge: 'trample', charge: 'trample', cast: 'breath', roar: 'breath', stomp: 'shake' },
  pose(F, move, u, t, step) {
    const b = F.bones, B = F.body, H = F.height, br = Math.sin(t * 1.15);
    // breathing slow and deep: the barrel rises and falls, the hair sways with it
    rx(b, 'chest', 0.02 * br); rx(b, 'spine', -0.012 * br); rx(b, 'neck', -0.015 * br);
    B.rotation.z = 0.006 * Math.sin(t * 0.7);         // the hair sways with the whole body, never twisted along it
    if (move === 'idle') return;
    if (move === 'walk') {
      // a slow heavy walk: one leg at a time (left hind, left fore, right hind, right fore), the body rolling over it
      const s = step * 0.5;
      const ph = { bl: 0, fl: Math.PI / 2, br: Math.PI, fr: Math.PI * 1.5 };
      for (const l of LEGS) { const a = Math.sin(s + ph[l]); rx(b, l + '_upper', -0.02 * a); const lift = Math.max(0, Math.cos(s + ph[l]));
        rx(b, l + '_lower', (l[0] === 'f' ? -0.03 : 0.03) * lift); }   // the legs move only a little, inside the hair (no stretching at the hem)
      B.rotation.z = 0.02 * Math.sin(s);
      B.position.y = 0.008 * H * Math.abs(Math.sin(s)); rx(b, 'head', 0.03 * Math.sin(s * 2)); ry(b, 'head', 0.03 * Math.sin(s));
      return;
    }
    if (move === 'trample') {
      // head down; a fore hoof paws the ground twice; the charge at 0.7; it pulls up and backs to its place
      const down = seg(u, 0, 0.18) * (1 - seg(u, 0.86, 1)), paw = u < 0.55 ? bump(((u - 0.15) / 0.2) % 1) * (u > 0.15 ? 1 : 0) : 0;
      const run = seg(u, 0.56, 0.7) * (1 - seg(u, 0.78, 1)), hook = bump((u - 0.64) / 0.16);
      headDown(b, 0.6 * down); rx(b, 'head', -0.1 * hook);
      // (a pawing hoof tore the hem beside it in M7's stretch check: the wind-up is the head lowered and the body rocking back and dipping twice)
      B.position.y -= 0.012 * H * paw; B.rotation.x += 0.02 * paw;
      B.position.z = 1.1 * run - 0.1 * down * (1 - run); B.position.y = -0.03 * H * down + 0.03 * H * bump((u - 0.56) / 0.14);
      B.rotation.x = 0.05 * down - 0.04 * hook;
      return;
    }
    if (move === 'breath') {
      // it lifts its head and draws in (the hump rises), then lowers it and breathes out long and cold over all four
      const draw = seg(u, 0, 0.35) * (1 - seg(u, 0.42, 0.55)), blow = seg(u, 0.45, 0.58) * (1 - seg(u, 0.85, 1));
      rx(b, 'head', -0.1 * draw + 0.06 * blow); B.rotation.x = -0.02 * draw + 0.015 * blow; B.position.y = 0.015 * H * draw;
      ry(b, 'head', 0.14 * Math.sin((u - 0.5) * 6) * blow);
      return;
    }
    if (move === 'shake') {
      // braced, it shakes its whole mantle: a shudder from the head back along the body; snow and icicles fall at 0.5
      const k = seg(u, 0.1, 0.3) * (1 - seg(u, 0.75, 0.95)), w = Math.sin(u * 50);
      rz(b, 'head', 0.1 * w * k); B.rotation.z = 0.035 * Math.sin(u * 50 - 0.5) * k; B.position.x = 0.03 * Math.sin(u * 50) * k; headDown(b, 0.4 * k);
      for (const l of LEGS) rz(b, l + '_upper', (l[1] === 'l' ? -0.04 : 0.04) * k);       // legs braced wide
      return;
    }
    if (move === 'hurt') {
      const a = bump(u * 1.5) * (1 - seg(u, 0.6, 1));
      B.position.z = -0.12 * a; rx(b, 'head', -0.08 * a); B.rotation.x = -0.025 * a;
      B.rotation.z = 0.02 * a;
      return;
    }
    if (move === 'ko') {
      // it lowers its head, weary, and settles back on its haunches a little
      const k = seg(u, 0, 0.6);
      headDown(b, 0.5 * k);
      for (const l of ['bl', 'br']) { rx(b, l + '_upper', -0.05 * k); rx(b, l + '_lower', 0.08 * k); }
      B.position.y = -0.03 * H * k;
      return;
    }
  },
};
if (typeof window !== 'undefined' && window.M7) window.M7.addMoves('ox', ox);
})();
