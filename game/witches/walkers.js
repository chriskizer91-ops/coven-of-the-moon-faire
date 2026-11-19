// walkers.js: any of the four witches as the one who walks (Coven of the Moon Faire, zone 1, November 18, 2026).
// The walker (engine/place/walker.js) asks whoever walks for three things: root (her model), walkRun (is she running),
// and animate(phase, walking, time, dt). Io has her own wrapper (io/moon-io.js). This gives Kore, Europa and Callisto the
// same face, driving each the way her own model wants, as Moon Faire's fight did (its game/fight/actors.js):
//   Kore and Europa   their models move by a walking phase: animate(phase, walking, time, dt)
//   Callisto          hers by named moves, like Io: play('idle' | 'walk' | 'jog'), then animate(dt)
// Each is made the first time she is asked for, at her lightest weight, and kept.
//   W3D.WITCHES            the four, in the coven's order: { id, name, is, key (her name in MF_WITCHES) }
//   W3D.witch('europa')    her, ready to walk
(function (G) {
  'use strict';
  const W3D = G.W3D;
  W3D.WITCHES = [
    { id: 'io', name: 'Io', is: 'the Herbal Witch', key: 'io' },
    { id: 'kore', name: 'Kore', is: 'the Jester', key: 'jester' },
    { id: 'europa', name: 'Europa', is: 'the Fox', key: 'fox' },
    { id: 'callisto', name: 'Callisto', is: 'the Ranger', key: 'ranger' },
  ];
  const made = {};
  W3D.witch = function (id) {
    if (made[id]) return made[id];
    if (id === 'io') { const A = G.makeMoonIo({ weight: 'lightest' }); A.id = 'io'; return (made.io = A); }
    const w = W3D.WITCHES.find((q) => q.id === id); if (!w) throw new Error('no witch called ' + id);
    const m = G.MF_WITCHES[w.key].raw('lightest'), phased = !!m.ACTIONS;
    if (m.spellLight && m.spellLight.parent) m.spellLight.parent.remove(m.spellLight);   // her spell light is not lit while she walks
    const A = { id, root: m.root, model: m, walkRun: false, camera: null, phase: 0, cur: '', triangles: m.triangles,
      animate(phase, wb, t, dt) {
        const walking = wb > 0.5;
        if (phased) { if (walking) A.phase += dt * (A.walkRun ? 3.3 : 2.2); m.animate(A.phase, walking ? 1 : 0, t, dt, 0); }
        else { const want = walking ? (A.walkRun ? 'jog' : 'walk') : 'idle'; if (A.cur !== want) { m.play(want); A.cur = want; } m.animate(dt); }
      } };
    return (made[id] = A);
  };
})(window);
