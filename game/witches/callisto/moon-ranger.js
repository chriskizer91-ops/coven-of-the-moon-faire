// moon-ranger.js: Callisto, Moon Faire's Ranger (her light model, MF_WITCHES.ranger), behind the face every model in the
// battle has: root, animate(phase, wb, t, dt), play(name, force), ACTIONS (dur, hits, cues), anchor(name, out), guard(on),
// reset(), busy, action, progress. New here (the fights job, step 2), made the way moon-io.js makes Io: the Ranger and Io
// share one kind of model (Moon Faire's game/fight/actors.js), so this is that file's Io part with her own moves.
// Nothing in her model is changed.
//   makeMoonRanger({ weight: 'lightest' | 'light' | 'full' })
// Her moves last as long as her model says (shots) and land when Moon Faire's fight says they do (actors.js):
//   draw (Moonsteel Draw): the arrow leaves at about 3 s and lands at 3.25 s
//   shots (the Gem): she touches the gem, then looses two arrows, landing at 5.5 s and 7.35 s
function makeMoonRanger(opts) {
  'use strict';
  opts = opts || {};
  const m = window.MF_WITCHES.ranger.raw(opts.weight || 'lightest');
  const S = m.shots;
  const SEC = {
    draw: { hits: [3.25], cues: [0.6, 2.99] }, shots: { hits: [5.5, 7.35], cues: [0.5, 5.2, 7.1] },
    hit: { hits: [], cues: [] }, hard: { hits: [], cues: [] }, dodge: { hits: [], cues: [] }, win: { hits: [], cues: [] },
    bow: { hits: [], cues: [] }, wave: { hits: [], cues: [] }, cheer: { hits: [], cues: [] }, gem: { hits: [], cues: [] },
    sword: { hits: [], cues: [] }, knives: { hits: [], cues: [] }, glass: { hits: [], cues: [] }, limber: { hits: [], cues: [] },
  };
  const ACTIONS = {};
  for (const n in SEC) { const d = S[n] || 1, q = SEC[n]; ACTIONS[n] = Object.freeze({ dur: d, hits: q.hits.map((x) => x / d), cues: q.cues.map((x) => x / d), hold: false, interrupt: n === 'hit' || n === 'hard' }); }
  // the battle screen asks every hero for its own move names: each is played by the nearest move of hers
  const ALIAS = { hurt: 'hit', block: 'dodge', victory: 'win', transform: 'cheer', cast: 'gem', throw: 'draw', attack: 'draw' };
  for (const k in ALIAS) if (!ACTIONS[k]) ACTIONS[k] = ACTIONS[ALIAS[k]];
  ACTIONS.kneel = Object.freeze({ dur: 1.4, hits: [], cues: [], hold: true, interrupt: true });
  ACTIONS.rise = Object.freeze({ dur: 1.2, hits: [], cues: [], hold: false, interrupt: false });
  Object.freeze(ACTIONS);
  const A = { root: m.root, fx: null, model: m, witch: true, ACTIONS, state: {}, trance: 0, flameLight: { intensity: 0 }, action: null, weight: opts.weight || 'lightest', triangles: m.triangles };
  if (m.light && m.light.parent && m.light.isLight) m.light.parent.remove(m.light);       // her spell light is read, not lit (as in Moon Faire's fight)
  let cur = null, down = false;
  A.play = (name, force) => {
    if (name === 'kneel' || name === 'die' || name === 'down') { if (!down) { down = true; m.play('fall'); cur = null; A.action = 'kneel'; } return true; }
    if (name === 'rise') { down = false; m.play('idle'); cur = null; A.action = null; return true; }
    if (down) return false;
    if (ALIAS[name] && !SEC[name]) name = ALIAS[name];
    if (!ACTIONS[name] || !SEC[name]) return false;
    if (cur && !force) return false;
    m.play(name); cur = name; A.action = name;
    return true;
  };
  const moveT = () => (m.move ? m.move.t : 0);
  Object.defineProperty(A, 'progress', { get() { if (!cur) return -1; return Math.min(1, moveT() / ACTIONS[cur].dur); } });
  Object.defineProperty(A, 'busy', { get() { return !!cur; } });
  Object.defineProperty(A, 'time', { get() { return cur ? moveT() : 0; } });
  A.guard = () => {};
  A.reset = () => { cur = null; down = false; A.action = null; m.play('idle'); };
  // points on her, in the world
  A.anchor = (name, out) => {
    out = out || new THREE.Vector3(); m.root.updateMatrixWorld(true); const SK = m.SK;
    switch (name) {
      case 'head': SK.head.getWorldPosition(out); out.y += 0.12; return out;
      case 'crown': SK.head.getWorldPosition(out); out.y += 0.4; return out;
      case 'handR': case 'flame': case 'palm': return SK.handR.getWorldPosition(out);
      case 'handL': case 'bow': return SK.handL.getWorldPosition(out);
      case 'feet': return out.copy(m.root.position);
      case 'hit': case 'chest': default: SK.spine3.getWorldPosition(out); out.y += 0.02; return out;
    }
  };
  A.flamePos = (out) => A.anchor('handL', out);
  A.animate = (phase, wb, t, dt) => {
    // a move has run out (her model would play it again after a pause, as on her own page): back to standing
    if (cur && moveT() >= ACTIONS[cur].dur) { cur = null; A.action = null; m.play('idle'); }
    if (!cur && !down) { const want = wb > 0.5 ? 'jog' : 'idle'; if (!m.move || m.move.name !== want) m.play(want); }
    // her model steps at most a twentieth of a second at a time: a longer frame (a slow phone, or a sped-up test) is played in steps
    if (!(dt > 0)) m.animate(0);
    else for (let k = 0, left = dt; k < 6 && left > 1e-6; k++, left -= 0.05) m.animate(Math.min(left, 0.05));
  };
  A.reset();
  return A;
}
