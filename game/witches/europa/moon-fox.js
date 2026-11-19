// moon-fox.js: Europa, Moon Faire's Fox (her light model, MF_WITCHES.fox), for the battle screen. New here (the fights job,
// step 2), made the way moon-jester.js makes Kore: the Fox was forked from the Jester's model, so she already has the face
// the battle asks of every model (play, ACTIONS with hits and cues, anchor, busy, progress). This only gives her the
// generic move names the screen asks every hero for, played by her own:
//   victory: her curtsey;  kneel and rise: her kneeling stance;  transform: her twirl (she has no trance yet)
//   hurt and block: she has no move for being hit, here or in Moon Faire, where she only rocks: so she rocks here too
//   guard: she has none
// Nothing in her model is changed.
//   makeMoonFox({ weight }) -> the model, with those names added
function makeMoonFox(opts) {
  'use strict';
  opts = opts || {};
  const J = window.MF_WITCHES.fox.raw(opts.weight || 'lightest');
  const play0 = J.play.bind(J);
  let kneeling = false, rock = 0;
  const A = Object.assign({}, J.ACTIONS);
  A.hurt = A.block = Object.freeze({ dur: 0.6, hits: [], cues: [], hold: false, interrupt: true });
  A.victory = J.ACTIONS.curtsey; A.transform = J.ACTIONS.twirl;
  A.kneel = Object.freeze({ dur: 1.0, hits: [], cues: [], hold: true, interrupt: true }); A.rise = Object.freeze({ dur: 1.0, hits: [], cues: [], hold: false, interrupt: false });
  const W = Object.create(J);
  Object.defineProperty(W, 'ACTIONS', { value: Object.freeze(A) });
  W.play = function (name, force) {
    if (name === 'kneel' || name === 'die') { if (!kneeling) { kneeling = true; if (J.stop) J.stop(); J.setStance('kneel'); } return true; }
    if (name === 'rise') { kneeling = false; J.setStance(''); return true; }
    if (kneeling) return false;
    if (name === 'hurt' || name === 'block') { rock = 1; return true; }
    if (name === 'victory') name = 'curtsey';
    else if (name === 'transform') name = 'twirl';
    if (!J.ACTIONS[name]) return false;
    return play0(name, force);
  };
  W.guard = function () {};
  // she rocks back from a blow, as in Moon Faire's fight (game/fight/actors.js): a tilt that comes and goes in a third of a second
  W.animate = function (phase, wb, t, dt) {
    J.animate(phase, wb, t, dt);
    if (J.spin) J.root.rotation.y += J.spin;       // her twirls: a turn of her whole body the host adds to her facing (her model's own note)
    if (rock > 0) { rock = Math.max(0, rock - dt * 3.2); J.root.rotation.z = 0.09 * Math.sin(rock * Math.PI); } else if (J.root.rotation.z) J.root.rotation.z = 0;
  };
  Object.defineProperty(W, 'action', { get() { return kneeling ? 'kneel' : J.action; } });
  Object.defineProperty(W, 'busy', { get() { return !kneeling && J.busy; } });
  Object.defineProperty(W, 'progress', { get() { return kneeling ? -1 : J.progress; } });
  W.raw = J; W.witch = true;
  W.flameLight = { intensity: 0 };
  return W;
}
