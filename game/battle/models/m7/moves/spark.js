// Coven: copied from Aethermoor M7 (prototypes/foe-hd/kit/js/moves/spark.js, commit 2070b57) and made a script: the word `export` taken off each
// line, and the set handed to M7.addMoves at the end (both marked Coven). Nothing else changed.
(function () {
'use strict';
// Moves for something that floats (the foe kit, November 23: the marsh-light and the forge-spark), posed by bone name:
// body (the floating thing, a root of its own), top (its flame or crown, flickering), drops (a root: what falls from
// it), ground (a root: what lies under it, staying put), and l_fist / r_fist (roots: things floating at its sides).
// Floating parts move whole (roots may move; nothing stretches). Positions are offsets from each root's rest.
// Pure poses of u (0..1 through the move) and t (the clock).
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const bump = (x) => Math.sin(Math.max(0, Math.min(1, x)) * Math.PI);
const seg = (u, a, b) => ease((u - a) / (b - a));
const NOOP = { rotation: { x: 0, y: 0, z: 0, set() {} }, position: { x: 0, y: 0, z: 0, set() {}, copy() {} }, scale: { set() {} }, userData: { p0: { x: 0, y: 0, z: 0 } } };

const MOVES = [['idle', 'Hover'], ['walk', 'Drift'], ['dart', 'Dart'], ['flare', 'Flare'], ['lure', 'Lure'],
  ['flicker', 'Flicker'], ['hurt', 'Hit'], ['ko', 'Gutter']];
const DUR = { dart: 1.0, flare: 1.4, lure: 2.0, flicker: 1.2, hurt: 0.8, ko: 1.8 };
const LUNGE = 'dart';
const ALIAS = { strike: 'dart', bite: 'dart', swipe: 'dart', cast: 'flare', roar: 'flare', singe: 'dart',
  'cold-fire': 'dart', gutter: 'ko' };

function reset(B) {
  for (const b of Object.values(B.bones)) { b.rotation.set(0, 0, 0); b.position.copy(b.userData.p0); b.scale.set(1, 1, 1); }
  B.body.position.set(0, 0, 0); B.body.rotation.set(0, 0, 0);
}
// move a root by an offset (three.js: x left of the foe, y up, z forward)
function off(b, x, y, z) { const p = b.userData.p0; b.position.set(p.x + x, p.y + y, p.z + z); }
function pose(B, move, u, t, step = 0) {
  reset(B);
  const b = new Proxy(B.bones, { get: (o, k) => o[k] || NOOP }), H = B.height || 0.6;
  const bob = 0.04 * H * Math.sin(t * 2.1);
  // it hovers: bobbing, turning a little; its flame flickers; what floats at its sides bobs out of step; drops fall
  off(b.body, 0, bob, 0); b.body.rotation.y = 0.15 * Math.sin(t * 0.7);
  b.top.rotation.z = 0.035 * Math.sin(t * 7.3) + 0.02 * Math.sin(t * 11.1); b.top.rotation.x = 0.03 * Math.sin(t * 5.7);
  off(b.l_fist, 0, 0.05 * H * Math.sin(t * 2.1 + 1.3), 0); off(b.r_fist, 0, 0.05 * H * Math.sin(t * 2.1 + 2.6), 0);
  b.l_fist.rotation.y = 0.4 * Math.sin(t * 0.9); b.r_fist.rotation.y = -0.4 * Math.sin(t * 0.8);
  const fall = (t * 0.8) % 1;
  off(b.drops, 0, -0.1 * H * fall * fall + bob * 0.5, 0);
  const all = (x, y, z) => { for (const n of ['body', 'l_fist', 'r_fist']) { const p = b[n].position; p.set(p.x + x, p.y + y, p.z + z); } const d = b.drops.position; d.set(d.x + x, d.y + y, d.z + z); };
  if (move === 'idle') return;
  if (move === 'walk') { b.body.rotation.x = 0.15; all(0, 0.02 * H * Math.sin(step * 2), 0); return; }
  if (move === 'dart') {
    // it darts in, touches you, and darts back
    const go = seg(u, 0.1, 0.4) * (1 - seg(u, 0.55, 0.9));
    all(0, -0.05 * H * go, 0.7 * H * go); b.body.rotation.x = 0.35 * go; b.top.rotation.x += -0.1 * go;
    off(b.l_fist, 0.15 * H * go, 0, 0.9 * H * go); off(b.r_fist, -0.15 * H * go, 0, 0.9 * H * go);
    return;
  }
  if (move === 'flare') {
    // it rises and flares white-hot; what floats at its sides flies out
    const k = seg(u, 0, 0.35) * (1 - seg(u, 0.75, 1)), shake = Math.sin(u * 70) * 0.04 * k;
    all(0, 0.12 * H * k, 0); b.top.rotation.z += shake; b.body.rotation.z = shake * 2;
    off(b.l_fist, 0.25 * H * k, 0.12 * H * k, 0); off(b.r_fist, -0.25 * H * k, 0.12 * H * k, 0);
    return;
  }
  if (move === 'lure') {
    // it bobs away over the water, slow and inviting, and back
    const away = bump(u);
    all(0.12 * H * Math.sin(u * Math.PI * 2), 0.06 * H * Math.sin(u * Math.PI * 4), -0.45 * H * away);
    b.body.rotation.y += 0.6 * Math.sin(u * Math.PI * 2);
    return;
  }
  if (move === 'flicker') {
    // it gutters down, and lights again a step away
    const out = seg(u, 0, 0.35) * (1 - seg(u, 0.4, 0.45)), back = seg(u, 0.45, 0.8);
    all(0.25 * H * back, -0.3 * H * out + 0.0 * back, 0);
    b.body.rotation.x = 0.5 * out; b.top.rotation.x += 0.1 * out;
    return;
  }
  if (move === 'hurt') {
    const a = bump(u * 1.6) * (1 - seg(u, 0.6, 1));
    all(0, 0.03 * H * a, -0.18 * H * a); b.body.rotation.x = -0.4 * a; b.top.rotation.z += 0.07 * Math.sin(u * 40) * a;
    return;
  }
  if (move === 'ko') {
    // it gutters and sinks to the ground, tipping over
    const k = seg(u, 0, 0.8);
    all(0, -0.42 * H * k, 0); b.body.rotation.z = 1.2 * seg(u, 0.4, 1); b.top.rotation.x += 0.12 * k;
    off(b.l_fist, 0.1 * H * k, -0.4 * H * k, 0); off(b.r_fist, -0.1 * H * k, -0.4 * H * k, 0);
  }
}
window.M7.addMoves('spark', { MOVES, DUR, LUNGE, ALIAS, pose });  // Coven: handed to the shared loader (game/battle/models/m7/m7-foe.js)
})();
