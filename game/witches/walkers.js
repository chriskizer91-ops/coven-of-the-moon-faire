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
  // leader (November 25): how fast each one's steps go. The walker (engine/place/walker.js) plays her steps faster or slower
  // by her speed over `natural` (metres a second at which her own steps keep her feet still on the ground: walk and jog).
  // Kore and Europa (Moon Faire's Jester and the Fox forked from her) walk by a phase, in radians: in her walk a foot on the
  // ground goes 0.51 m back in 62% of a step cycle, so the ground goes by at 0.131 m for each radian; in her run 0.38 m in
  // a quarter of the cycle, 0.243 m a radian (game/witches/kore/jester_kit.js, fillBase). So at the walker's walk (1.3 m a
  // second) and run (3.0) the phase goes 9.9 and 12.3 radians a second. Io and Callisto play named moves: Io keeps the
  // walker's own numbers (as before); Callisto's are measured from her model (tools/leader-look.py prints them)
  const STEP = {
    phased: { walk: 1.3 / 0.131, run: 3.0 / 0.243, natural: { walk: 1.3, jog: 3.0 } },
  };
  const made = {};
  W3D.witch = function (id) {
    if (made[id]) return made[id];
    if (id === 'io') { const A = G.makeMoonIo({ weight: 'lightest' }); A.id = 'io'; return (made.io = A); }
    const w = W3D.WITCHES.find((q) => q.id === id); if (!w) throw new Error('no witch called ' + id);
    const m = G.MF_WITCHES[w.key].raw('lightest'), phased = !!m.ACTIONS;
    if (m.spellLight && m.spellLight.parent) m.spellLight.parent.remove(m.spellLight);   // her spell light is not lit while she walks
    const A = { id, root: m.root, model: m, walkRun: false, camera: null, phase: 0, cur: '', triangles: m.triangles, wb: 0, rb: 0,
      natural: phased ? STEP.phased.natural : STEP[id] || undefined,
      animate(phase, wb, t, dt) {
        const walking = wb > 0.5;
        if (phased) {
          // leader (November 25): her run is her own model's run (its fifth number, which was always 0 here, so she only
          // ever walked faster), and her steps keep pace with the ground: the phase goes round as fast as her feet must
          // move for the walker's speed (STEP below). Starting, stopping, and walk to run blend over a moment
          const k = Math.min(1, dt * 7);
          A.wb += ((walking ? 1 : 0) - A.wb) * k; A.rb += ((walking && A.walkRun ? 1 : 0) - A.rb) * k;
          if (A.wb > 0.01) A.phase += dt * (STEP.phased.walk + (STEP.phased.run - STEP.phased.walk) * A.rb);
          m.animate(A.phase, A.wb, t, dt, A.rb * A.wb);
        }
        else { const want = walking ? (A.walkRun ? 'jog' : 'walk') : 'idle'; if (A.cur !== want) { m.play(want); A.cur = want; } m.animate(dt); }
      } };
    return (made[id] = A);
  };
})(window);
