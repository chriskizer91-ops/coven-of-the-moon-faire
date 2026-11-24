// Coven: the walkers' moves, copied from Aethermoor M7 (commit 2070b57) and made one script. Three pieces, unchanged
// but for what is marked Coven:
//   1. prototypes/foe-hd/pages/walkers/walker.js, lines 17 to 19 (ease, bump, seg) and 119 to 213 (the moves and
//      movesFor); the rest of that file is M7's loader for three.js 0.170, which this game does not use
//      (game/battle/models/m7/m7-foe.js is this game's);
//   2. prototypes/foe-hd/pages/walkers/foes.js, lines 6 to 166: the Rotwarden and the Sapwight (its other three
//      walkers are left out: this game does not use them);
//   3. the two handed to M7.addMoves at the end.
(function () {
'use strict';
const ease = (x) => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
const bump = (x) => Math.sin(Math.max(0, Math.min(1, x)) * Math.PI);
const seg = (u, a, b) => ease((u - a) / (b - a));
// ---- the moves --------------------------------------------------------------------------------------------------
// Bones (three.js axes: +z forward, +x his left, +y up). rotation.x > 0 swings a hanging limb back and tips an upright
// one forward; rotation.z > 0 swings a hanging limb toward his left; rotation.y > 0 turns toward his left.
function reset(W) {
  for (const b of Object.values(W.bones)) { b.rotation.set(0, 0, 0); b.position.copy(b.userData.p0); b.scale.set(1, 1, 1); }
  W.body.position.set(0, 0, 0); W.body.rotation.set(0, 0, 0);
}
const ROOTS = ['root1', 'root2', 'root3', 'root4'];
function roots(W, f) { ROOTS.forEach((n, i) => { const b = W.bones[n]; if (b) f(b, i); }); }
function legs(W, step, amp = 1) {
  for (const [k, ph0] of [['r', 0], ['l', Math.PI]]) {
    const ph = step + ph0, s = Math.sin(ph), lift = Math.max(0, Math.cos(ph));
    W.bones[k + '_thigh'].rotation.x = -0.34 * s * amp - 0.25 * lift * amp;
    W.bones[k + '_shin'].rotation.x = 0.55 * lift * amp;
    W.bones[k + '_foot'].rotation.x = -0.2 * lift * amp + 0.1 * s * amp;
  }
}
function crouch(W, k) {
  k *= W.foe.knees ?? 1;                       // how far this foe's knees fold (plate and bark limit it)
  // bend the knees, keep the feet planted (roughly): hips drop, thighs forward, shins back
  for (const n of ['r', 'l']) { W.bones[n + '_thigh'].rotation.x = -0.45 * k; W.bones[n + '_shin'].rotation.x = 0.8 * k; W.bones[n + '_foot'].rotation.x = -0.35 * k; }
  W.body.position.y = -0.11 * k;
  W.bones.hips.rotation.x = 0.12 * k;
}
// each foe's joint limits (foe.limits = { bone: factor }): how far that joint really bends, applied after any move, so
// plate and bark never fold further than they can without stretching (the stretch check, docs/project/jobs/foes.md)
function pose(W, move, u, t, step) {
  poseRaw(W, move, u, t, step);
  const L = W.foe.limits;
  if (L) for (const [n, k] of Object.entries(L)) { const b = W.bones[n]; if (b) { b.rotation.x *= k; b.rotation.y *= k; b.rotation.z *= k; } }
}
function poseRaw(W, move, u, t, step) {
  reset(W);
  const b = W.bones, br = Math.sin(t * 1.6), big = W.foe.weight ?? 1;
  // under everything: breathing, the head looking about, roots stirring
  b.chest.rotation.x = 0.015 * br; b.neck.rotation.x = -0.01 * br;      // breathing: a small rise of the chest (no bone is ever scaled)
  b.head.rotation.y = 0.15 * Math.sin(t * 0.45); b.head.rotation.x = 0.03 * br;
  roots(W, (r, i) => { r.rotation.z = 0.04 * Math.sin(t * 0.9 - i * 0.7); r.rotation.x = 0.03 * Math.sin(t * 0.7 - i * 0.9); });
  if (b.r_upper) { b.r_upper.rotation.z = -0.06 - 0.02 * br; b.r_fore.rotation.x = -0.12; }
  if (b.l_upper) { b.l_upper.rotation.z = 0.06 + 0.02 * br; b.l_fore.rotation.x = -0.12; }
  if (W.foe.idle) W.foe.idle(W, t);
  const P = W.foe.moves?.[move]?.pose;
  if (P) { P(W, u, t, step); return; }
  if (move === 'idle') return;
  if (move === 'walk') {
    legs(W, step);
    W.body.position.y = 0.03 * Math.abs(Math.cos(step)) * big;
    const st = W.foe.stiff ?? 1;                // how much this foe's trunk twists and bends (an armoured one less)
    b.hips.rotation.y = 0.08 * st * Math.sin(step); b.chest.rotation.y = -0.1 * st * Math.sin(step);
    b.hips.rotation.z = 0.03 * Math.sin(step);
    if (b.r_upper) b.r_upper.rotation.x = 0.3 * Math.sin(step);
    if (b.l_upper) b.l_upper.rotation.x = -0.3 * Math.sin(step);
    roots(W, (r, i) => { r.rotation.x += -0.12 * Math.sin(step - i * 0.6); r.rotation.z += 0.05 * Math.sin(step * 2 - i); });
    return;
  }
  if (move === 'hurt') {
    const a = bump(u * 1.6) * (1 - seg(u, 0.6, 1)), shake = Math.sin(u * 45) * a;
    const st = W.foe.stiff ?? 1;
    W.body.position.z = -0.16 * a; b.spine.rotation.x = -0.15 * st * a; b.chest.rotation.x = -0.12 * st * a;
    b.neck.rotation.x = -0.25 * a; b.head.rotation.z = 0.18 * a; b.hips.rotation.z = 0.04 * shake;
    if (b.r_upper) { b.r_upper.rotation.x = -0.4 * a; b.r_upper.rotation.z -= 0.3 * a; }
    if (b.l_upper) { b.l_upper.rotation.x = -0.4 * a; b.l_upper.rotation.z += 0.3 * a; }
    roots(W, (r, i) => { r.rotation.z += 0.25 * a * (i ? 0.6 : 1); r.rotation.x += -0.2 * a; });
    return;
  }
  if (move === 'ko') {
    // the knees give, he sinks onto them, then topples forward; the head drops last
    const knees = seg(u, 0, 0.35), fall = seg(u, 0.38, 0.85), drop = seg(u, 0.7, 1);
    // (the knees bend no more than the plates and bark round them allow; the fall is mostly from the hips)
    const kn = W.foe.knees ?? 1;
    for (const n of ['r', 'l']) { b[n + '_thigh'].rotation.x = -0.75 * kn * knees; b[n + '_shin'].rotation.x = 1.05 * kn * knees; b[n + '_foot'].rotation.x = -0.3 * kn * knees; }
    W.body.position.y = -0.22 * knees * (W.foe.height / 2.5) - 0.05 * fall;
    W.body.position.z = 0.1 * knees + 0.55 * fall * (W.foe.height / 2.5);
    W.body.rotation.x = 1.25 * fall; b.hips.rotation.x = 0.15 * knees;
    b.neck.rotation.x = 0.4 * drop; b.head.rotation.z = 0.3 * drop;
    if (b.r_upper) { b.r_upper.rotation.x = -0.9 * fall; b.r_upper.rotation.z -= 0.3 * fall; }
    if (b.l_upper) { b.l_upper.rotation.x = -0.9 * fall; b.l_upper.rotation.z += 0.3 * fall; }
    roots(W, (r, i) => { r.rotation.x += -0.5 * fall * (i ? 0.3 : 1); r.rotation.z += 0.3 * fall; });
    return;
  }
}
const tools = { ease, bump, seg, legs, crouch, roots };

// The walkers' moves in the foe kit's shape (kit/js/moves/<plan>.js: MOVES, DUR, LUNGE, pose), for kit/js/looks.js.
// The Fight gets the walkers from the kit's one foeLook (see register.js); this file's buildWalker draws them on the
// walkers' gallery with the roughness/metal picture.
function movesFor(foe) {
  const own = Object.entries(foe.moves).map(([k, m]) => [k, m.label]);
  return {
    MOVES: [['idle', 'Breathe'], ['walk', 'Walk'], ...own, ['hurt', 'Hit'], ['ko', 'Fall']],
    DUR: { ...Object.fromEntries(Object.entries(foe.moves).map(([k, m]) => [k, m.dur])), hurt: 0.9, ko: 2.6 },
    LUNGE: foe.lunge || 'strike',
    pose(F, move, u, t, step = 0) { F.foe ??= foe; return pose(F, move, u, t, step); },
  };
}
// Coven: foes.js imported ease, bump, seg, crouch and roots from walker.js: here they are already in scope
// the Rotwarden: his left arm is one great root (bones root1..root4), his right a plated arm with a bark fist
const rotwarden = {
  key: 'rotwarden', name: 'The Rotwarden', tier: 'Champion', act: 'Act One, the Heartroot', height: 2.5, weight: 1.4,
  stiff: 0.45, knees: 0.6,          // plate armour: his trunk barely twists, his knees fold only so far
  limits: { hips: 0.6, spine: 0.4, chest: 0.7, l_shin: 0.36, r_shin: 0.36, l_thigh: 0.55, r_thigh: 0.55, root2: 0.52, root3: 0.8, l_foot: 0.7, r_foot: 0.7 },
  text: "A First-Age warden of the root, bark grown through its plate, wearing a smith's mask that is not its face.",
  lunge: 'rootlash',
  moves: {
    rootlash: { label: 'Rootlash', dur: 1.6, pose(W, u, t) {
      // wind up to his left, then the root whips across in front of him; each joint of it trails the one before
      const b = W.bones, wind = seg(u, 0, 0.3) * (1 - seg(u, 0.3, 0.5)), back = 1 - seg(u, 0.72, 1);
      const sw = (lag) => seg(u, 0.3 + lag, 0.52 + lag) * back;
      b.spine.rotation.y = 0.5 * (0.16 * wind - 0.22 * sw(0)); b.chest.rotation.y = 0.5 * (0.12 * wind - 0.16 * sw(0));
      b.hips.rotation.y = 0.12 * wind - 0.16 * sw(0);
      b.root1.rotation.z += 0.7 * wind + 0.2 * sw(0); b.root1.rotation.x += 0.35 * wind - 1.25 * sw(0);
      b.root2.rotation.x += 0.2 * wind - 0.45 * sw(0.04); b.root2.rotation.z += -0.25 * sw(0.04);
      b.root3.rotation.x += 0.15 * wind - 0.4 * sw(0.08); b.root3.rotation.z += -0.3 * sw(0.08);
      b.root4.rotation.x += -0.3 * sw(0.12); b.root4.rotation.z += -0.35 * sw(0.12);
      b.r_upper.rotation.z -= 0.25 * sw(0); b.r_upper.rotation.x = 0.3 * wind;
      b.head.rotation.y += 0.25 * wind - 0.3 * sw(0);
      crouch(W, 0.25 * (wind + sw(0)));
    } },
    'grasping-roots': { label: 'Grasping Roots', dur: 2.0, pose(W, u, t) {
      // the root rises over his head and is driven into the floor; he follows it down
      const b = W.bones, up = seg(u, 0, 0.35) * (1 - seg(u, 0.4, 0.5)), down = seg(u, 0.4, 0.5) * (1 - seg(u, 0.8, 1));
      b.root1.rotation.x += -2.1 * up - 0.85 * down; b.root1.rotation.z += 0.25 * up - 0.15 * down;
      b.root2.rotation.x += -0.5 * up + 0.2 * down; b.root3.rotation.x += -0.3 * up + 0.35 * down; b.root4.rotation.x += 0.3 * down;
      b.chest.rotation.x = 0.35 * (-0.2 * up + 0.3 * down); b.spine.rotation.x = 0.35 * (-0.1 * up + 0.15 * down);
      b.neck.rotation.x = -0.2 * up + 0.15 * down;
      b.r_upper.rotation.z -= 0.35 * (up + down); b.r_upper.rotation.x = -0.2 * up;
      crouch(W, 0.6 * down);
      W.body.position.y += 0.03 * Math.sin(u * 60) * down * (1 - seg(u, 0.5, 0.65));
    } },
    'bark-hide': { label: 'Bark Hide', dur: 1.8, pose(W, u, t) {
      // he hunkers behind the root, fist to his chest: plate and bark grow together
      const b = W.bones, k = seg(u, 0, 0.3) * (1 - seg(u, 0.8, 1)), tremble = Math.sin(u * 80) * 0.01 * k;
      crouch(W, 0.25 * k);
      b.chest.rotation.x = 0.5 * (0.14 * k); b.neck.rotation.x = 0.2 * k; b.head.rotation.x += 0.1 * k;
      b.r_upper.rotation.x = -0.75 * k; b.r_upper.rotation.z -= -0.15 * k; b.r_fore.rotation.x = -0.6 * k;
      b.root1.rotation.x += -0.55 * k; b.root1.rotation.z += -0.35 * k; b.root2.rotation.x += -0.3 * k; b.root2.rotation.z += -0.3 * k;
      b.root3.rotation.z += -0.25 * k;
      W.body.position.x = tremble;
    } },
    blacken: { label: 'Blacken the Sap', dur: 2.2, pose(W, u, t) {
      // the mask weeps: he straightens, head back, root and fist spread wide, shaking
      const b = W.bones, k = seg(u, 0, 0.3) * (1 - seg(u, 0.78, 1)), sh = Math.sin(u * 50) * 0.03 * k;
      b.spine.rotation.x = 0.5 * (-0.1 * k); b.chest.rotation.x = 0.5 * (-0.15 * k); b.neck.rotation.x = -0.3 * k; b.head.rotation.x += -0.25 * k + sh;
      b.r_upper.rotation.z -= 0.8 * k; b.r_fore.rotation.x = -0.4 * k;
      b.root1.rotation.z += 0.65 * k; b.root2.rotation.z += 0.2 * k; b.root3.rotation.z += -0.15 * k;
      W.body.position.y = 0.04 * k;
    } },
    graft: { label: 'Graft', dur: 2.0, pose(W, u, t) {
      // "The First Seed pulses, and a Sapwight tears out of the wall": he drives the root down beside him and wrenches up
      const b = W.bones, down = seg(u, 0, 0.35) * (1 - seg(u, 0.5, 0.65)), pull = seg(u, 0.5, 0.65) * (1 - seg(u, 0.85, 1));
      b.root1.rotation.z += 0.45 * down + 0.2 * pull; b.root1.rotation.x += 0.25 * down - 0.6 * pull;
      b.root2.rotation.x += 0.3 * down - 0.3 * pull; b.root3.rotation.x += 0.25 * down;
      b.r_upper.rotation.x = -0.8 * pull; b.r_fore.rotation.x = -0.5 * pull;
      crouch(W, 0.3 * down); b.chest.rotation.y = 0.05 * down - 0.04 * pull;
    } },
    'ichor-tide': { label: 'Ichor Tide', dur: 2.0, pose(W, u, t) {
      // "Black sap floods the chamber": he sweeps the root low along the floor in a wide arc, leaning into it
      const b = W.bones, sweep = seg(u, 0.15, 0.75), k = seg(u, 0, 0.2) * (1 - seg(u, 0.8, 1));
      b.root1.rotation.x += -0.55 * k; b.root1.rotation.z += (0.5 - 1.0 * sweep) * k;
      b.root2.rotation.z += (0.3 - 0.5 * sweep) * k; b.root3.rotation.x += 0.2 * k;
      b.chest.rotation.y = (0.06 - 0.1 * sweep) * k; b.r_upper.rotation.z -= 0.3 * k;
      crouch(W, 0.3 * k);
    } },
    'heartroot-bloom': { label: 'Heartroot Bloom', dur: 2.2, pose(W, u, t) {
      // "The Seed blooms": he straightens, fist to his chest, the root curling up in front of him like a growing shoot
      const b = W.bones, k = seg(u, 0, 0.4) * (1 - seg(u, 0.8, 1)), pulse = 0.04 * Math.sin(u * 30) * k;
      b.r_upper.rotation.x = -0.85 * k; b.r_fore.rotation.x = -0.55 * k;
      b.root1.rotation.x += -0.7 * k; b.root1.rotation.z += -0.2 * k; b.root2.rotation.x += -0.45 * k + pulse; b.root3.rotation.x += -0.4 * k - pulse;
      b.neck.rotation.x = -0.2 * k; b.head.rotation.x += -0.15 * k;
      W.body.position.y = 0.03 * k;
    } },
    'ichor-rain': { label: 'Ichor Rain', dur: 2.2, pose(W, u, t) {
      // "It rains sap from the roots": the root high over him, shaken so the sap falls
      const b = W.bones, k = seg(u, 0, 0.35) * (1 - seg(u, 0.8, 1)), sh = Math.sin(u * 40) * seg(u, 0.35, 0.45) * (1 - seg(u, 0.7, 0.8));
      b.root1.rotation.x += -1.8 * k; b.root1.rotation.z += 0.15 * k;
      b.root2.rotation.x += -0.3 * k + 0.12 * sh; b.root3.rotation.x += -0.2 * k - 0.15 * sh; b.root4.rotation.z += 0.2 * sh;
      b.neck.rotation.x = -0.25 * k; b.r_upper.rotation.z -= 0.3 * k;
    } },
    unmaking: { label: 'Unmaking', dur: 2.0, pose(W, u, t) {
      // "The mask turns to one of you, charging": he leans in, head low, the mask thrust forward, root and fist spread wide
      const b = W.bones, k = seg(u, 0.05, 0.45) * (1 - seg(u, 0.8, 1)), tremble = 0.015 * Math.sin(u * 70) * k;
      W.body.position.z = 0.3 * k; b.hips.rotation.x = 0.12 * k; b.chest.rotation.x = 0.15 * k; b.neck.rotation.x = 0.25 * k + tremble;
      b.r_upper.rotation.z -= 0.6 * k; b.r_upper.rotation.x = 0.2 * k; b.root1.rotation.z += 0.55 * k; b.root1.rotation.x += 0.15 * k;
      crouch(W, 0.3 * k);
    } },
    grief: { label: 'Grief', dur: 2.6, pose(W, u, t) {
      // "It weeps sap. Something under the wood says 'Thank you.'": he slumps, head bowed, root hanging, swaying slowly
      const b = W.bones, k = seg(u, 0, 0.35) * (1 - seg(u, 0.85, 1)), sw = Math.sin(u * 7) * k;
      b.chest.rotation.x = 0.15 * k; b.neck.rotation.x = 0.4 * k; b.head.rotation.x += 0.2 * k; b.head.rotation.z = 0.08 * sw;
      b.r_upper.rotation.x = 0.1 * k; b.r_fore.rotation.x = -0.05 * k; b.root1.rotation.z += 0.08 * sw; b.root1.rotation.x += 0.1 * k;
      crouch(W, 0.2 * k); W.body.rotation.z = 0.03 * sw;
    } },
    devour: { label: 'Devour', dur: 1.8, pose(W, u, t) {
      // the charge: he leans in, takes a long stride and the root sweeps up from below
      const b = W.bones, go = seg(u, 0.1, 0.45), back = 1 - seg(u, 0.65, 1), k = go * back;
      W.body.position.z = 0.55 * k;
      b.r_thigh.rotation.x = -0.55 * k; b.r_shin.rotation.x = 0.35 * k; b.l_thigh.rotation.x = 0.35 * k; b.l_shin.rotation.x = 0.25 * k;
      b.hips.rotation.x = 0.15 * k; b.chest.rotation.x = 0.5 * (0.25 * k); b.neck.rotation.x = 0.1 * k;
      b.root1.rotation.x += -0.9 * k; b.root2.rotation.x += -0.5 * k; b.root3.rotation.x += -0.4 * k;
      b.r_upper.rotation.x = -0.7 * k; b.r_fore.rotation.x = -0.6 * k;
      W.body.position.y = -0.06 * k;
    } },
  },
};

// the sapwight: gaunt, hunched, long arms; it shambles, reaches, grips, drinks
const sapwight = {
  key: 'sapwight', name: 'Sapwight', tier: 'Veteran', act: 'Act One, the Heartroot', height: 2.0, weight: 0.8,
  stiff: 0.8, knees: 0.7,           // wound in bark: it bends, but stiffly
  limits: { neck: 0.24, head: 0.4, l_fore: 0.52, r_fore: 0.52, l_shin: 0.55, r_shin: 0.55, spine: 0.8, l_hand: 0.6, r_hand: 0.6 },
  text: 'A ghoul of bark and black sap. It used to be someone the Heartroot drank.',
  lunge: 'sap-leech',
  idle(W, t) {
    const b = W.bones, sw = Math.sin(t * 0.8);
    b.spine.rotation.x = 0.06; b.chest.rotation.x = 0.08 + 0.02 * Math.sin(t * 1.6); b.neck.rotation.x = 0.1;
    b.r_upper.rotation.x = 0.06 * sw; b.l_upper.rotation.x = -0.06 * sw; b.r_fore.rotation.x = -0.2; b.l_fore.rotation.x = -0.2;
    b.r_hand.rotation.x = 0.1 * Math.sin(t * 1.3); b.l_hand.rotation.x = 0.1 * Math.sin(t * 1.1 + 1);
    W.body.rotation.z = 0.02 * sw;
  },
  moves: {
    'sap-leech': { label: 'Sap Leech', dur: 1.9, pose(W, u, t) {
      // a lurch forward, both hands clamp on, the head dips to drink, then it draws back
      const b = W.bones, go = seg(u, 0.05, 0.3), hold = 1 - seg(u, 0.7, 1), k = go * hold, drink = seg(u, 0.35, 0.5) * hold;
      W.body.position.z = 0.35 * k;
      b.r_thigh.rotation.x = -0.4 * k; b.r_shin.rotation.x = 0.3 * k; b.l_thigh.rotation.x = 0.25 * k;
      b.spine.rotation.x = 0.15 * k; b.chest.rotation.x = 0.2 * k + 0.08 * drink; b.neck.rotation.x = 0.15 * k + 0.25 * drink;
      for (const [n, s] of [['r', -1], ['l', 1]]) {
        b[n + '_upper'].rotation.x = -1.25 * k; b[n + '_upper'].rotation.z = s * -0.25 * k;
        b[n + '_fore'].rotation.x = -0.35 * k - 0.4 * drink; b[n + '_hand'].rotation.x = -0.4 * drink;
      }
      W.body.position.y = -0.04 * k + 0.01 * Math.sin(u * 50) * drink;
    } },
    grasp: { label: 'Grasp', dur: 1.6, pose(W, u, t) {
      // the long arms swing wide and close round you
      const b = W.bones, open = seg(u, 0, 0.3) * (1 - seg(u, 0.3, 0.5)), close = seg(u, 0.32, 0.5) * (1 - seg(u, 0.8, 1));
      for (const [n, s] of [['r', -1], ['l', 1]]) {
        b[n + '_upper'].rotation.x = -0.9 * (open + close); b[n + '_upper'].rotation.z = s * (0.9 * open - 0.3 * close);
        b[n + '_fore'].rotation.x = -0.3 * open - 0.9 * close; b[n + '_fore'].rotation.y = s * 0.5 * close;
        b[n + '_hand'].rotation.x = -0.6 * close;
      }
      b.chest.rotation.x = -0.1 * open + 0.2 * close; b.neck.rotation.x = -0.15 * open + 0.1 * close;
      W.body.position.z = 0.15 * close;
    } },
    'bark-hide': { label: 'Bark Hide', dur: 1.8, pose(W, u, t) {
      // it curls up behind its arms; the bark thickens
      const b = W.bones, k = seg(u, 0, 0.3) * (1 - seg(u, 0.8, 1));
      crouch(W, 0.5 * k);
      b.spine.rotation.x = 0.25 * k; b.chest.rotation.x = 0.25 * k; b.neck.rotation.x = 0.3 * k;
      for (const [n, s] of [['r', -1], ['l', 1]]) {
        b[n + '_upper'].rotation.x = -0.9 * k; b[n + '_upper'].rotation.z = s * -0.35 * k;
        b[n + '_fore'].rotation.x = -1.15 * k; b[n + '_fore'].rotation.y = s * 0.2 * k;
      }
      W.body.position.x = Math.sin(u * 70) * 0.006 * k;
    } },
  },
};

window.M7.addMoves('rotwarden', movesFor(rotwarden));     // Coven: handed to the shared loader
window.M7.addMoves('sapwight', movesFor(sapwight));       // Coven
})();
