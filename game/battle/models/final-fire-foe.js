// final-fire-foe.js (Coven of the Moon Faire, the last-foe job; made new here): the fire that would not end, Moon
// Faire's final foe (game/battle/models/final-fire.js, copied in as it is), as a foe of this game's battle.
// Defines makeFinalFireFoe(opts) only. Needs final-fire.js loaded before it.
//
// The battle (game/battle/screen.js) asks a foe's model for motions by its own names (appear, hurt, die, retreat ...)
// and for each move by the move's `act` (game/encounters/foes.js). The fire has six motions of its own: idle, blow,
// call, hurt, change (form one breaks open into the final form) and ending. This file plays the battle's names as the
// fire's own (AS below), and adds one motion the fire does not have: form one waking as it appears (its flames light
// up from dark). Nothing here changes a rule or a number of the fight.
//
// opts: { form: 1 or 2, detail: 0.5 to 1 (1: about 21,000 triangles, as Chris saw it), breaks: in form 2, whether it
//         appears whole and breaks open (the change) as the fight begins (default true), wake: seconds form one takes
//         to light up as it appears }
function makeFinalFireFoe(opts) {
  'use strict';
  opts = opts || {};
  const form = +opts.form === 2 ? 2 : 1, breaks = form === 2 && opts.breaks !== false, WAKE = +opts.wake || 2.4;
  const M = makeFinalFire({ detail: opts.detail === undefined ? 1 : opts.detail, form: breaks ? 1 : form });
  const sm = (x) => { const t = Math.max(0, Math.min(1, x)); return t * t * (3 - 2 * t); };
  // the battle's name for a motion -> the fire's own. Form one shows no damage (Moon Faire's rule): whatever is done to
  // it, and when its fight stops at its share of Life, it only flinches, a ripple through its corona. Its ending (the
  // final form's, after Kore's Sealed Fate) is the battle's `die`.
  const AS = { idle: 'idle', blow: 'blow', call: 'call', hurt: 'hurt', change: 'change', ending: 'ending',
    block: 'hurt', burn: 'hurt', stagger: 'hurt', kneel: 'hurt', retreat: 'hurt', die: 'ending' };
  const MOVES = { blow: 1, call: 1 };                        // its moves: one asked for while it breaks open waits for it
  const ACTIONS = {};
  for (const k in AS) ACTIONS[k] = M.ACTIONS[AS[k]];
  ACTIONS.appear = Object.freeze(breaks ? M.ACTIONS.change : { dur: WAKE, hits: [], cues: [0.5], hold: false, interrupt: false });
  Object.freeze(ACTIONS);
  let own = null, wait = null, cur = '';                     // own: form one waking { t }; wait: a move waiting for the change to end
  function play(name, force) {
    if (name === 'appear') {
      cur = 'appear'; wait = null;
      if (breaks) { M.reset(1); M.setFade(1); own = null; return M.play('change', true); }
      own = { t: 0 }; M.setFade(0.04); M.play('idle', true); return true;
    }
    const to = AS[name]; if (!to) return false;
    if (M.action === 'change') { if (MOVES[to]) { wait = name; return true; } return false; }   // the change always plays through
    if (own && !MOVES[to]) return false;                     // waking: a flinch does not stop it
    if (own) { own = null; M.setFade(1); }
    const ok = M.play(to, force); if (ok) cur = name; return ok;
  }
  function animate(phase, walk, t, dt) {
    if (own) { own.t += dt > 0 ? dt : 0; M.setFade(0.04 + 0.96 * sm(own.t / WAKE)); if (own.t >= WAKE) { own = null; M.setFade(1); } }
    if (wait && M.action !== 'change') { const n = wait; wait = null; if (M.play(AS[n], true)) cur = n; }
    M.animate(phase, walk, t, dt);
  }
  // the battle's name for what is playing ('' when it only stands and burns)
  const action = () => (own ? 'appear' : wait ? wait : !M.action ? '' : cur === 'appear' && M.action === 'change' ? 'appear' : AS[cur] === M.action ? cur : M.action);
  return {
    root: M.root, fx: M.fx, animate, play, ACTIONS,
    anchor: (name, out) => M.anchor(name, out),
    reset() { own = null; wait = null; cur = ''; M.reset(form); M.setFade(1); },
    guard() {},
    get busy() { return !!own || !!wait || M.busy; },
    get action() { return action(); },
    get progress() { return own ? Math.min(1, own.t / WAKE) : wait ? 0 : M.progress; },
    get gone() { return M.gone; },
    get form() { return M.form; },
    get height() { return M.height; }, get width() { return M.width; },
    get state() { return M.state; }, set state(v) { M.state = v; },
    setFade(f) { M.setFade(f); },
    get dash() { return 0; }, get lift() { return 0; },
    stats: M.stats,
  };
}
