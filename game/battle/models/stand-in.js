// stand-in.js: a stand-in for a creature that has no model yet (Coven of the Moon Faire, the fights job, step 4).
// A plain dark shape with two pale eyes, sized for its kind. It is made here, in code: nothing is copied from anywhere.
// It takes the place of a creature Chris has not chosen yet (game/encounters/slots.js names one for each slot), so the
// slot can be fought today. When the real creature comes, its own model file takes this one's place in the slot's line.
//
//   const m = makeStandIn({ shape: 'heavy', tall: 2.6, wide: 1.5, eyes: 0xdfe8ff, body: 0x15121c })
//
// shape: 'heavy' (a tall hunched lump), 'small' (a ball on the ground), 'thin' (a tall teardrop that hangs in the air),
//        'low' (long and low, on four stubs), 'plated' (a lump under slabs), 'hooded' (a tall cone), 'huge' (a boulder
//        with shoulders).
// What it gives the battle screen is what every foe's model gives it (game/battle/models/wisp.js is the pattern):
// root, play(name), busy, action, progress, ACTIONS (each with the moments its blows land), anchor(name), guard, reset,
// animate, dash. Its actions: appear, hurt, block, die, stagger, strike (one blow), flurry (three), heave (one heavy
// blow), leap (a jump at its prey), cast (a move on itself or on everyone), charge (gathering a blow that can be seen
// coming), retreat.
function makeStandIn(opts) {
  'use strict';
  const T = window.THREE, o = opts || {};
  const shape = o.shape || 'heavy', tall = o.tall || 1.6, wide = o.wide || tall * 0.6;
  const root = new T.Group(), inner = new T.Group(); root.add(inner);
  const bodyMat = new T.MeshStandardMaterial({ color: o.body != null ? o.body : 0x15121c, roughness: 0.95, metalness: 0, emissive: o.rim != null ? o.rim : 0x1b1730, emissiveIntensity: 0.55, transparent: true });
  const eyeMat = new T.MeshBasicMaterial({ color: o.eyes != null ? o.eyes : 0xdfe8ff, transparent: true });
  const parts = [];
  const add = (geo, x, y, z, sx, sy, sz, mat) => { const m = new T.Mesh(geo, mat || bodyMat); m.position.set(x, y, z); m.scale.set(sx, sy, sz); inner.add(m); parts.push(m); return m; };
  const ball = new T.SphereGeometry(0.5, 14, 10), cone = new T.ConeGeometry(0.5, 1, 12), box = new T.BoxGeometry(1, 1, 1);
  let eyeY = tall * 0.78, eyeZ = wide * 0.42, eyeGap = wide * 0.18, eyeR = Math.max(0.035, tall * 0.035), hover = 0;
  if (shape === 'small') { add(ball, 0, tall * 0.5, 0, wide, tall, wide); eyeY = tall * 0.62; eyeZ = wide * 0.46; eyeGap = wide * 0.2; eyeR = tall * 0.07; }
  else if (shape === 'thin') { hover = tall * 0.18; add(cone, 0, tall * 0.42, 0, wide * 0.8, tall * 0.84, wide * 0.8).rotation.x = Math.PI; add(ball, 0, tall * 0.8, 0, wide * 0.82, tall * 0.4, wide * 0.82); eyeY = tall * 0.8; eyeZ = wide * 0.38; }
  else if (shape === 'low') { add(ball, 0, tall * 0.58, 0, wide * 0.7, tall * 0.62, wide * 1.7); add(ball, 0, tall * 0.74, wide * 0.78, wide * 0.5, tall * 0.5, wide * 0.6);
    for (const [x, z] of [[-1, 1], [1, 1], [-1, -1], [1, -1]]) add(box, x * wide * 0.24, tall * 0.2, z * wide * 0.5, wide * 0.14, tall * 0.42, wide * 0.14); eyeY = tall * 0.8; eyeZ = wide * 1.06; eyeGap = wide * 0.13; }
  else if (shape === 'plated') { add(ball, 0, tall * 0.46, 0, wide, tall * 0.92, wide * 0.9);
    for (let i = 0; i < 5; i++) { const a = (i - 2) * 0.5; const p = add(box, Math.sin(a) * wide * 0.46, tall * (0.42 + 0.1 * Math.cos(a * 2)), Math.cos(a) * wide * 0.4, wide * 0.36, tall * 0.5, wide * 0.1); p.rotation.y = a; }
    add(box, 0, tall * 0.93, 0, wide * 0.7, tall * 0.14, wide * 0.6); eyeY = tall * 0.74; eyeZ = wide * 0.47; eyeGap = wide * 0.12; }
  else if (shape === 'hooded') { add(cone, 0, tall * 0.5, 0, wide, tall, wide); add(ball, 0, tall * 0.8, wide * 0.05, wide * 0.5, tall * 0.26, wide * 0.5); eyeY = tall * 0.8; eyeZ = wide * 0.29; eyeGap = wide * 0.1; }
  else if (shape === 'huge') { add(ball, 0, tall * 0.42, 0, wide, tall * 0.84, wide * 0.9); add(ball, -wide * 0.42, tall * 0.62, 0, wide * 0.5, tall * 0.5, wide * 0.5); add(ball, wide * 0.42, tall * 0.62, 0, wide * 0.5, tall * 0.5, wide * 0.5);
    add(ball, 0, tall * 0.86, wide * 0.1, wide * 0.42, tall * 0.3, wide * 0.42); eyeY = tall * 0.88; eyeZ = wide * 0.3; eyeGap = wide * 0.09; eyeR = tall * 0.025; }
  else { add(ball, 0, tall * 0.4, 0, wide, tall * 0.8, wide * 0.85); add(ball, 0, tall * 0.74, wide * 0.12, wide * 0.62, tall * 0.5, wide * 0.6); eyeY = tall * 0.8; eyeZ = wide * 0.4; eyeGap = wide * 0.14; }
  const eyes = [add(ball, -eyeGap, eyeY, eyeZ, eyeR * 2, eyeR * 2, eyeR * 2, eyeMat), add(ball, eyeGap, eyeY, eyeZ, eyeR * 2, eyeR * 2, eyeR * 2, eyeMat)];

  // ---- its actions: how long each takes, when its blows land, and how it moves (lean forward, lift, squash, a lunge) ----
  const A = (dur, hits, how, more) => Object.assign({ dur, hits, cues: [], hold: false, interrupt: false, how }, more || {});
  const bump = (u, a, b) => (u <= a || u >= b ? 0 : Math.sin((u - a) / (b - a) * Math.PI));
  const ACTS = {
    appear: A(1.1, [], (u) => ({ fade: Math.min(1, u * 1.6), sy: 0.3 + 0.7 * Math.min(1, u * 1.4) })),
    hurt: A(0.5, [], (u) => ({ lean: -0.3 * bump(u, 0, 1), sx: 1 + 0.12 * bump(u, 0, 0.6) }), { interrupt: true }),
    block: A(0.5, [], (u) => ({ sy: 1 - 0.14 * bump(u, 0, 1) }), { interrupt: true }),
    stagger: A(1.4, [], (u) => ({ lean: -0.22 * bump(u, 0, 1), roll: 0.18 * Math.sin(u * 9) * (1 - u) })),
    die: A(1.5, [], (u) => ({ fade: 1 - u, sy: 1 - 0.75 * u, sx: 1 + 0.5 * u }), { hold: true }),
    retreat: A(1.6, [], (u) => ({ fade: 1 - u, back: 1 }), { hold: true }),
    strike: A(1.0, [0.5], (u) => ({ lean: 0.5 * bump(u, 0.25, 0.75), dash: u > 0.3 && u < 0.5 ? 5 : u > 0.6 && u < 0.8 ? -5 : 0 })),
    flurry: A(1.6, [0.3, 0.52, 0.74], (u) => ({ lean: 0.35 * (bump(u, 0.18, 0.4) + bump(u, 0.4, 0.62) + bump(u, 0.62, 0.86)), roll: 0.2 * Math.sin(u * 28) * bump(u, 0.15, 0.9) })),
    heave: A(1.8, [0.62], (u) => ({ lift: tall * 0.25 * bump(u, 0.1, 0.62), sy: 1 + 0.25 * bump(u, 0.1, 0.55) - 0.3 * bump(u, 0.58, 0.8), lean: 0.6 * bump(u, 0.5, 0.85) })),
    leap: A(1.3, [0.55], (u) => ({ lift: tall * 1.1 * bump(u, 0.15, 0.6), dash: u > 0.15 && u < 0.55 ? 9 : u > 0.65 && u < 0.95 ? -12 : 0, lean: 0.4 * bump(u, 0.2, 0.7) })),
    cast: A(1.4, [0.55], (u) => ({ sy: 1 + 0.2 * bump(u, 0.1, 0.6), glow: bump(u, 0.2, 0.9) })),
    charge: A(1.6, [], (u) => ({ sy: 1 - 0.18 * bump(u, 0, 1), sx: 1 + 0.12 * bump(u, 0, 1), glow: u }), { hold: true }),
  };
  const ACTIONS = {}; for (const n in ACTS) ACTIONS[n] = Object.freeze({ dur: ACTS[n].dur, hits: ACTS[n].hits.slice(), cues: [], hold: ACTS[n].hold, interrupt: ACTS[n].interrupt }); Object.freeze(ACTIONS);
  let actv = null, guardOn = false, fadeE = 1, dashV = 0, liftV = 0, gone = false;
  const state = {};
  function play(name, force) {
    const def = ACTS[name]; if (!def) return false;
    if (actv && !force && (actv.name === 'die' || (!def.interrupt && !(actv.def.hold && actv.t >= actv.def.dur - 1e-6)))) return false;
    actv = { name, def, t: 0 }; gone = false; return true;
  }
  function animate(phase, wb, time, dt) {
    let P = { fade: gone ? 0 : 1 };
    if (actv) {
      actv.t = Math.min(actv.def.dur, actv.t + (dt || 0));
      const u = actv.t / actv.def.dur; P = Object.assign({ fade: 1 }, actv.def.how(u));
      if (actv.t >= actv.def.dur - 1e-6) { if (actv.def.hold) { if (actv.name === 'die' || actv.name === 'retreat') gone = true; } else actv = null; }
    }
    const breathe = 1 + 0.025 * Math.sin((time || 0) * 1.7 + tall), bob = hover ? hover + 0.06 * Math.sin((time || 0) * 1.3) : 0;
    dashV = P.dash || 0; liftV = (P.lift || 0) + bob;
    inner.position.set(0, liftV, P.back ? -2.2 * (actv ? actv.t / actv.def.dur : 1) : 0);
    inner.rotation.set(P.lean || (guardOn ? -0.12 : 0), 0, P.roll || 0);
    inner.scale.set((P.sx || 1), (P.sy || 1) * breathe, (P.sx || 1));
    const f = Math.max(0, Math.min(1, (P.fade == null ? 1 : P.fade) * fadeE));
    bodyMat.opacity = f; eyeMat.opacity = f; root.visible = root.visible && true;
    bodyMat.emissiveIntensity = 0.55 + 1.4 * (P.glow || 0);
    const blink = Math.sin((time || 0) * 0.9 + tall * 3) > 0.985 ? 0.15 : 1; for (const e of eyes) e.scale.y = eyeR * 2 * blink;
  }
  const V3 = () => new T.Vector3();
  const ANC = { chest: [0, tall * 0.55, wide * 0.2], head: [0, eyeY, eyeZ * 0.6], heart: [0, tall * 0.5, wide * 0.25], top: [0, tall, 0], hit: [0, tall * 0.6, wide * 0.6] };
  function anchor(name, out) { out = out || V3(); inner.updateWorldMatrix(true, false); const L = ANC[name] || ANC.chest; return inner.localToWorld(out.set(L[0], L[1], L[2])); }
  animate(0, 0, 0, 0);
  let tri = 0; root.traverse((m) => { if (m.isMesh) tri += (m.geometry.index ? m.geometry.index.count : m.geometry.attributes.position.count) / 3; });
  return {
    root, animate, play, anchor, ACTIONS,
    guard(on) { guardOn = !!on; },
    reset() { actv = null; guardOn = false; gone = false; },
    get busy() { return !!actv && !(actv.def.hold && actv.t >= actv.def.dur - 1e-6); },
    get action() { return actv ? actv.name : ''; },
    get progress() { return actv ? Math.min(1, actv.t / actv.def.dur) : -1; },
    get dash() { return dashV; }, get lift() { return liftV; }, get gone() { return gone; },
    get state() { return state; }, set state(v) { if (v) Object.assign(state, v); },
    setFade(f) { fadeE = Math.max(0, Math.min(1, +f)); },
    standIn: true, stats: { triangles: Math.round(tri), drawCalls: parts.length, textures: 0, bones: 0 },
  };
}
