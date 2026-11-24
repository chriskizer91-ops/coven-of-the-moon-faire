// stoat.js: the Wickstoat's moves (Coven of the Moon Faire, the peak-creatures job, November 24, 2026). Made here, in
// the form of Aethermoor M7's moves files (moves/hound.js is M7's own), so the shared loader (m7-foe.js) plays it as it
// plays theirs. Each move is a pure pose of u (0..1 through the move) and t (the clock). Bones only turn: nothing is
// scaled or slid (M7's no-stretching rule); the whole body may move.
// Bones (sculpt/wickstoat/rig.py): hips, spine, chest, neck, head, tail, tail2, tail3, tail4, and for each leg
// fl / fr / bl / br: _upper, _lower, _paw (the helpers, _blade, _haunch, neck_base, tail_root, are the loader's).
// three.js axes: +Z forward, +Y up; rotation.x > 0 pitches a forward-pointing bone down and swings a hanging leg back.
(function () {
'use strict';
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const bump = (x) => Math.sin(Math.max(0, Math.min(1, x)) * Math.PI);
const seg = (u, a, b) => ease((u - a) / (b - a));
const FRONT = ['fl', 'fr'], HIND = ['bl', 'br'];
function rx(b, n, v) { if (b[n]) b[n].rotation.x += v; }
function ry(b, n, v) { if (b[n]) b[n].rotation.y += v; }
function rz(b, n, v) { if (b[n]) b[n].rotation.z += v; }
// the long tail: yaw and pitch spread down its four bones, more toward the tip
function tail(b, yaw, pitch, curl) { const w = [0.5, 0.8, 1.0, 1.1]; ['tail', 'tail2', 'tail3', 'tail4'].forEach((n, i) => { ry(b, n, yaw * w[i]); rx(b, n, pitch * w[i] + (curl || 0) * i * 0.4); }); }
// the back's arch, spread along it: k > 0 humps the back up (as a stoat bounds), k < 0 stretches it long and low
function arch(b, k) { rx(b, 'hips', -0.9 * k); rx(b, 'spine', 0.55 * k); rx(b, 'chest', 0.55 * k); rx(b, 'neck', -0.15 * k); }
// the body snakes sideways: an S down its length (k: how far, one way or the other)
function snake(b, k) { ry(b, 'hips', 0.22 * k); ry(b, 'spine', -0.3 * k); ry(b, 'chest', -0.2 * k); ry(b, 'neck', 0.3 * k); ry(b, 'head', 0.1 * k); tail(b, -0.35 * k, 0); }
function crouch(b, k) {
  // (the legs bend at the joints that show, below the fur: M7's rule for a limb buried in the body)
  for (const l of FRONT) { rx(b, l + '_upper', 0.08 * k); rx(b, l + '_lower', -0.26 * k); rx(b, l + '_paw', 0.3 * k); }
  for (const l of HIND) { rx(b, l + '_upper', -0.1 * k); rx(b, l + '_lower', 0.28 * k); rx(b, l + '_paw', -0.3 * k); }
}

const stoat = {
  list: [['idle', 'Breathe'], ['walk', 'Bound'], ['pinch', 'Pinch'], ['skitter', 'Skitter'], ['glint', 'Glint'], ['hurt', 'Hit'], ['ko', 'Fall']],
  dur: { pinch: 1.2, skitter: 1.4, glint: 1.9, hurt: 0.8, ko: 2.2 },
  get MOVES() { return this.list; }, get DUR() { return this.dur; }, LUNGE: 'pinch',
  ALIAS: { bite: 'pinch', strike: 'pinch', swipe: 'pinch', lunge: 'pinch', cast: 'glint', roar: 'glint' },
  pose(F, move, u, t, step) {
    const b = F.bones, B = F.body, br = Math.sin(t * 3.1), H = F.height;
    // breathing under everything, quick and shallow; the tail never quite still
    rx(b, 'spine', -0.012 * br); rx(b, 'chest', 0.016 * br); rx(b, 'head', 0.02 * br);
    tail(b, 0.06 * Math.sin(t * 1.3), 0.01 * br);
    if (move === 'idle') return;
    if (move === 'walk') {
      // the bound: the back humps as the hind feet land under it, then stretches long as the forefeet reach
      const s = Math.sin(step), c = Math.cos(step);
      arch(b, 0.08 * s);
      for (const l of FRONT) { rx(b, l + '_upper', 0.13 * s); rx(b, l + '_lower', 0.12 * s - 0.28 * Math.max(0, -c)); rx(b, l + '_paw', 0.35 * Math.max(0, -c)); }
      for (const l of HIND) { rx(b, l + '_upper', -0.14 * s); rx(b, l + '_lower', -0.12 * s + 0.28 * Math.max(0, c)); rx(b, l + '_paw', -0.3 * Math.max(0, c)); }
      B.position.y = 0.06 * H * Math.max(0, Math.sin(step + 0.6)); B.rotation.x = 0.05 * c;
      rx(b, 'head', -0.08 * s); tail(b, 0.05 * c, 0.12 * s);
      return;
    }
    if (move === 'pinch') {
      // wind-up: low and long, head drawn back, tail up and quivering; the dart; the nip at 0.5; back again
      const low = seg(u, 0, 0.32) * (1 - seg(u, 0.38, 0.46)), dart = seg(u, 0.36, 0.5) * (1 - seg(u, 0.62, 1)), nip = bump((u - 0.44) / 0.14);
      crouch(b, low * 0.8); arch(b, -0.12 * low + 0.1 * dart);
      B.position.y = -0.1 * H * low; B.position.z = -0.12 * H * low + 0.7 * H * dart;
      rx(b, 'neck', -0.12 * low + 0.1 * dart); rx(b, 'head', 0.08 * low + 0.14 * nip);
      tail(b, 0.06 * Math.sin(t * 30) * low, -0.16 * low + 0.06 * dart);
      for (const l of FRONT) { rx(b, l + '_upper', -0.1 * dart); rx(b, l + '_lower', -0.3 * dart); }
      for (const l of HIND) { rx(b, l + '_upper', 0.08 * dart); rx(b, l + '_lower', 0.3 * dart); }
      return;
    }
    if (move === 'skitter') {
      // a darting S this way and that, its body snaking, too quick to pin down; it ends where it began
      const k = bump(u), w = Math.sin(u * Math.PI * 3);
      snake(b, 0.6 * w * k);
      B.position.x = 0.45 * H * w * k; B.rotation.y = -0.35 * w * k; B.position.y = 0.03 * H * Math.abs(Math.sin(u * Math.PI * 6)) * k;
      crouch(b, 0.35 * k);
      for (const l of FRONT) rx(b, l + '_lower', 0.18 * Math.sin(u * 40) * k);
      for (const l of HIND) rx(b, l + '_lower', -0.18 * Math.sin(u * 40) * k);
      return;
    }
    if (move === 'glint') {
      // it stands up tall on its hind legs (as a stoat does to look round), the spines flash at 0.55, it drops
      const up = seg(u, 0, 0.35) * (1 - seg(u, 0.75, 1)), th = 0.75 * up, flash = bump((u - 0.45) / 0.25);
      const zp = -0.24, sn = Math.sin(th);
      B.rotation.x = -th; B.position.y = -zp * sn * 0.9; B.position.z = zp * (1 - Math.cos(th)) + 0.05 * H * up;
      // it turns up about its hind feet, so the hind legs lean with the body and the hips need not bend
      for (const l of HIND) { rx(b, l + '_upper', 0.1 * th); rx(b, l + '_lower', 0.15 * th); rx(b, l + '_paw', 0.9 * th); }
      for (const l of FRONT) { rx(b, l + '_upper', -0.12 * up); rx(b, l + '_lower', -0.22 * up); rx(b, l + '_paw', 0.35 * up); }
      rx(b, 'neck', 0.2 * up); rx(b, 'head', 0.3 * up - 0.12 * flash);
      arch(b, -0.15 * flash);
      tail(b, 0.05 * Math.sin(t * 9) * up, 0.35 * up, 0.08 * up);
      return;
    }
    if (move === 'hurt') {
      const a = bump(u * 1.6) * (1 - seg(u, 0.6, 1));
      B.position.z = -0.25 * H * a; B.position.y = 0.05 * H * a; arch(b, 0.12 * a); snake(b, 0.3 * a);
      rx(b, 'head', -0.12 * a); tail(b, 0.08 * Math.sin(u * 30) * a, -0.12 * a);
      return;
    }
    if (move === 'ko') {
      // it curls down small, head on its paws, tail round it
      const down = seg(u, 0, 0.5), curl = seg(u, 0.3, 0.9);
      crouch(b, 0.7 * down); B.position.y = -0.16 * H * down;
      snake(b, 0.5 * curl); rx(b, 'neck', 0.2 * curl); rx(b, 'head', 0.15 * curl);
      tail(b, 0.5 * curl, 0.05 * curl);
      return;
    }
  },
};
if (typeof window !== 'undefined' && window.M7) window.M7.addMoves('stoat', stoat);
})();
