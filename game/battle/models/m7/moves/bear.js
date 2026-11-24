// Coven: copied from Aethermoor M7 (prototypes/foe-hd/kit/js/moves/bear.js, commit 2070b57) and made a script: the word `export` taken off each
// line, and the set handed to M7.addMoves at the end (both marked Coven). Nothing else changed.
(function () {
'use strict';
// Briarmaw's own moves (the foe kit, November 23): the lively set Chris liked (the first quad moves, November 20),
// for a bear whose legs stand clear of his belly. Posed by bone name (kit/rigs/quad.py with helpers): hips, spine,
// chest, neck, head, jaw, tail, and fl/fr/bl/br _upper, _lower, _paw (the loader's applyHelpers turns the shoulder
// blades, haunches, neck_base and tail_root with them). Bones only turn (the breathing was a scale; now a turn).
// His game moves by name: maul, fang-rake, thorn-volley, call-the-briars, bramble-wall, rootquake.
// Pure poses of u (0..1 through the move) and t (the clock). rotation.x negative lifts a head or swings a leg forward.
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const bump = (x) => Math.sin(Math.max(0, Math.min(1, x)) * Math.PI);
const seg = (u, a, b) => ease((u - a) / (b - a));
const NOOP = { rotation: { x: 0, y: 0, z: 0, set() {} }, position: { set() {}, copy() {} }, scale: { set() {} } };

const MOVES = [['idle', 'Breathe'], ['walk', 'Walk'], ['roar', 'Roar'], ['swipe', 'Maul'], ['bite', 'Fang Rake'],
  ['bristle', 'Thorn Volley'], ['stomp', 'Rootquake'], ['hurt', 'Hit'], ['ko', 'Fall']];
const DUR = { roar: 2.2, swipe: 1.4, bite: 1.1, bristle: 1.6, stomp: 1.8, hurt: 0.9, ko: 2.4 };
const LUNGE = 'bite';
const ALIAS = { maul: 'swipe', strike: 'swipe', 'fang-rake': 'bite', 'thorn-volley': 'bristle', cast: 'bristle',
  'call-the-briars': 'roar', 'bramble-wall': 'stomp', rootquake: 'stomp' };
const AMP = { walk: 1, roar: 1, swipe: 1, bite: 1, stomp: 1 };     // how big each move is (the stretch check tunes it)

function reset(B) {
  for (const b of Object.values(B.bones)) { b.rotation.set(0, 0, 0); b.position.copy(b.userData.p0); b.scale.set(1, 1, 1); }
  B.body.position.set(0, 0, 0); B.body.rotation.set(0, 0, 0);
}
function legs(b, step, amp = 1) {
  // walk: diagonal pairs together (front left with back right), the foot lifting as it swings forward
  const P = { fl: 0, br: 0, fr: Math.PI, bl: Math.PI };
  for (const k of ['fl', 'fr', 'bl', 'br']) {
    const ph = step + P[k], s = Math.sin(ph), lift = Math.max(0, Math.cos(ph));
    b[k + '_upper'].rotation.x = (k[0] === 'f' ? -0.32 : -0.26) * s * amp;
    b[k + '_lower'].rotation.x = (k[0] === 'f' ? 0.24 : -0.22) * lift * amp;
    b[k + '_paw'].rotation.x = 0.14 * s * amp - (k[0] === 'f' ? 0.18 : -0.12) * lift * amp;
  }
}
function pose(B, move, u, t, step = 0) {
  reset(B);
  const b = new Proxy(B.bones, { get: (o, k) => o[k] || NOOP }), br = Math.sin(t * 1.9), A = (m) => AMP[m] ?? 1;
  // breathing under everything: the back lifts, the head bobs and looks about, the tail sways
  b.spine.rotation.x = -0.02 * br;
  b.head.rotation.x = 0.03 * br; b.head.rotation.y = 0.12 * Math.sin(t * 0.55);
  b.tail.rotation.y = 0.12 * Math.sin(t * 1.3); b.tail.rotation.x = 0.04 * br;
  b.jaw.rotation.x = 0.03 + 0.02 * br;
  if (move === 'idle') return;
  if (move === 'walk') {
    const a = A('walk');
    legs(b, step, a);
    B.body.position.y = 0.025 * Math.abs(Math.sin(step));
    b.hips.rotation.z = 0.04 * Math.sin(step); b.hips.rotation.y = 0.04 * Math.sin(step);
    b.head.rotation.x += 0.05 * Math.sin(step * 2) * a; b.head.rotation.y += 0.07 * Math.sin(step) * a;
    return;
  }
  if (move === 'roar') {
    // rear back, head up, jaw wide, shake
    const a = A('roar'), up = seg(u, 0, 0.25), hold = 1 - seg(u, 0.75, 1), k = up * hold * a, shake = Math.sin(u * 70) * 0.03 * k;
    b.hips.rotation.x = -0.2 * k; b.chest.rotation.x = -0.04 * k; b.neck.rotation.x = -0.3 * k;     // head flung up
    b.head.rotation.x += -0.3 * k + shake; b.head.rotation.y = shake * 1.5;
    b.jaw.rotation.x = 0.05 + 0.55 * k;
    b.fl_upper.rotation.x = b.fr_upper.rotation.x = 0.12 * k;
    B.body.position.y = 0.08 * k;
    return;
  }
  if (move === 'swipe') {
    // up on the hind legs a little, the right forepaw raised and raked across
    const a = A('swipe'), lift = seg(u, 0, 0.3) * a, rake = seg(u, 0.32, 0.55) * a, k = 1 - seg(u, 0.7, 1);
    b.hips.rotation.x = -0.28 * lift * k;     // he rears whole, and turns whole into the rake
    b.hips.rotation.y = (0.2 * lift - 0.4 * rake) * k;
    b.fr_upper.rotation.x = (-1.25 * lift + 0.9 * rake) * k; b.fr_upper.rotation.z = (-0.35 * lift + 0.6 * rake) * k;
    b.fr_lower.rotation.x = (0.25 * lift - 0.15 * rake) * k; b.fr_paw.rotation.x = -0.25 * lift * k;
    b.head.rotation.y += (0.3 * lift - 0.5 * rake) * k; b.jaw.rotation.x = 0.05 + 0.3 * rake * k;
    B.body.position.y = 0.06 * lift * k;
    return;
  }
  if (move === 'bite') {
    // a lunge: head down and forward, jaw open, snapped shut as he lands
    const a = A('bite'), go = seg(u, 0, 0.4) * a, snap = seg(u, 0.45, 0.55), back = 1 - seg(u, 0.6, 1);
    b.neck.rotation.x = 0.3 * go * back; b.head.rotation.x += -0.15 * go * back;
    b.jaw.rotation.x = 0.05 + 0.6 * go * (1 - snap) * back;
    b.hips.rotation.x = 0.12 * go * back; B.body.position.z = 0.3 * go * back;
    b.fl_upper.rotation.x = b.fr_upper.rotation.x = -0.2 * go * back;
    return;
  }
  if (move === 'bristle') {
    // he hunches, his thorns up, and shakes himself like a wet dog: the thorns fly
    const k = seg(u, 0, 0.25) * (1 - seg(u, 0.8, 1)), shake = Math.sin(u * 45) * k;
    b.hips.rotation.x = 0.06 * k; b.neck.rotation.x = 0.04 * k; b.head.rotation.x += 0.03 * k;
    b.hips.rotation.z = 0.06 * shake; b.hips.rotation.y = 0.04 * shake;     // he shakes whole
    b.head.rotation.z = -0.12 * shake; b.neck.rotation.z = 0.06 * shake; b.tail.rotation.y += 0.08 * shake;
    B.body.position.y = -0.03 * k;
    return;
  }
  if (move === 'stomp') {
    // he rears up on his hind legs, forepaws high, and slams them down: the ground cracks
    const a = A('stomp'), up = seg(u, 0, 0.4) * (1 - seg(u, 0.45, 0.58)) * a, slam = seg(u, 0.48, 0.6) * (1 - seg(u, 0.8, 1)) * a;
    b.hips.rotation.x = -0.32 * up + 0.07 * slam; b.chest.rotation.x = -0.03 * up + 0.02 * slam;
    for (const s of ['fl', 'fr']) {
      b[s + '_upper'].rotation.x = -0.7 * up + 0.15 * slam; b[s + '_lower'].rotation.x = 0.23 * up; b[s + '_paw'].rotation.x = -0.16 * up;
    }
    for (const s of ['bl', 'br']) { b[s + '_upper'].rotation.x = 0.25 * up; b[s + '_lower'].rotation.x = -0.15 * up; }
    b.neck.rotation.x = -0.25 * up + 0.15 * slam; b.jaw.rotation.x = 0.05 + 0.35 * (up + slam);
    B.body.position.y = 0.12 * up - 0.03 * slam;
    return;
  }
  if (move === 'hurt') {
    const a = bump(u * 1.6) * (1 - seg(u, 0.6, 1));
    B.body.position.z = -0.18 * a; b.hips.rotation.x = -0.15 * a; b.neck.rotation.x = -0.25 * a; b.head.rotation.x -= 0.2 * a;
    b.head.rotation.z = 0.2 * a; b.jaw.rotation.x = 0.05 + 0.35 * a;
    b.hips.rotation.z = 0.06 * Math.sin(u * 40) * a;
    return;
  }
  if (move === 'ko') {
    // the legs buckle, he rolls onto his side, the head drops last
    const buckle = seg(u, 0, 0.35), roll = seg(u, 0.25, 0.75), drop = seg(u, 0.6, 1);
    for (const k of ['fl', 'fr', 'bl', 'br']) { b[k + '_upper'].rotation.x = (k[0] === 'f' ? 0.32 : -0.32) * buckle; b[k + '_lower'].rotation.x = (k[0] === 'f' ? -0.24 : 0.2) * buckle; }
    B.body.position.y = -0.25 * buckle + 0.1 * roll; B.body.rotation.z = 1.45 * roll; B.body.position.x = -0.55 * roll;
    b.neck.rotation.x = 0.3 * drop; b.head.rotation.z = -0.3 * drop; b.jaw.rotation.x = 0.05 + 0.25 * drop;
    b.tail.rotation.y = 0;
  }
}
window.M7.addMoves('bear', { MOVES, DUR, LUNGE, ALIAS, pose });  // Coven: handed to the shared loader (game/battle/models/m7/m7-foe.js)
})();
