// rotwarden.js: Aethermoor M7's Rotwarden in this game's battle (the creatures job). Its model, pictures and moves are
// M7's (assets/INDEX.csv); everything below is this game's data for it, made here. m7-foe.js says what each line is.
window.M7.add('rotwarden', {
  moves: 'rotwarden',
  tex: { color: "./color-768.webp", normal: "./normal-512.webp", orm: "./orm-384.webp" },
  mat: { exposure: 1.0, metalK: 0.55, env: 0.9 },     // its plate keeps some of its own colour as well as the sky's
  acts: {
    rootlash: { move: 'rootlash', dur: 1.6, hits: [0.45] },                           // Rootlash: wind up, the root whips across
    roots: { move: 'grasping-roots', dur: 2.0, hits: [0.47] },                        // Grasping Roots: root up, driven down
    charge: { move: 'grasping-roots', dur: 1.4, from: 0, to: 0.36, hold: true },      // the root lifted high, held
    bloom: { move: 'heartroot-bloom', dur: 2.2, hits: [0.5], fx: 4 },                 // Heartroot Bloom: he mends
    block: { move: 'bark-hide', dur: 0.8, from: 0, to: 0.35, interrupt: true },       // Bark Hide, begun: he braces
  },
  arrive: 'rise',
  letGo: 'root',                        // when beaten he sinks back into the roots (wither, root, runOff or gutter)
  // his standing loop: 4 seconds, heavy, he sways and the root arm swings
  idle: { period: 4.0, pose(F, s, c, w) { const b = F.bones; if (b.hips) b.hips.rotation.z += 0.025 * s * w; if (b.chest) b.chest.rotation.z -= 0.02 * s * w;
    if (b.root1) b.root1.rotation.x += 0.05 * c * w; F.body.position.y -= 0.01 * (1 - Math.abs(s)) * w; } },
  fx: { kind: 'drift', color: 0xc8d070, count: 18, at: 'chest', dy: 0, radius: 0.3, speed: 0.12, life: 3.0, size: 0.035, bright: 0.55 },
  anchors: { chest: ['chest', 0], head: ['head', 0], top: ['head', 0.12], hit: ['root4', 0] },
});
