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
  // by her speed over `natural`: the metres a second at which her own steps keep her feet still on the ground, at a walk and
  // at a run. Measured on the leader job's small page (game/pages/leader-lab.html): a foot on the ground, how fast it goes
  // back under her, at the walker's walk (1.3 m a second) and run (3.0).
  //   Kore and Europa (Moon Faire's Jester, and the Fox made from her) walk by a phase, in radians. On the ground her foot
  //   goes back 0.131 m for each radian at a walk and 0.292 m at a run, so at the walker's walk and run the phase goes 9.9
  //   and 10.3 radians a second. (It went 2.2 and 3.3 before: her feet slid, at about a quarter of the ground's pace.)
  //   Io: her walk as before (1.05: her feet go 1.24 m a second at 1.3); her run 2.79 (it was 2.13, and her feet went back
  //   3.9 m a second while the ground went 3.0). Callisto: 1.27 and 2.35 (she had Io's numbers: 1.56 m a second at a walk).
  // The other choice is the old numbers (io: walk 1.054, jog 2.125 for Io and Callisto; 2.2 and 3.3 for the phase)
  const STEP = {
    phased: { walk: 1.3 / 0.131, run: 3.0 / 0.292, natural: { walk: 1.3, jog: 3.0 } },
    io: { walk: 1.054, jog: 2.79 },
    callisto: { walk: 1.27, jog: 2.35 },
  };
  const made = {};
  W3D.witch = function (id) {
    if (made[id]) return made[id];
    if (id === 'io') { const A = G.makeMoonIo({ weight: 'lightest' }); A.id = 'io'; A.natural = STEP.io; return (made.io = A); }
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
