// rotstag.js: Aethermoor M7's Rot-Stag in this game's battle (the creatures job). Its model, pictures and moves are
// M7's (assets/INDEX.csv); everything below is this game's data for it, made here. m7-foe.js says what each line is.
window.M7.add('rotstag', {
  moves: 'stag',
  tex: { color: "./color-768.webp", normal: "./normal-512.webp", ao: "./ao-512.webp", emit: "./emit-256.webp" },
  mat: { glowK: 1.0, exposure: 1.0, double: true },
  acts: {
    gore: { move: 'gore', dur: 1.2, hits: [0.5] },                                    // Gore: head down, the antlers hook up
    antler: { move: 'charge', dur: 2.4, hits: [0.7] },                                // Antler Charge: low, stamping, then the run
    trample: { move: 'trample', dur: 1.8, hits: [0.6] },                              // Trample: it rears and comes down
    charge: { move: 'trample', dur: 1.2, from: 0, to: 0.42, hold: true },             // reared up, held
  },
  arrive: 'walk',
  letGo: 'runOff',                      // when beaten it turns and bounds away (wither, root, runOff or gutter)
  // its standing loop: 3.6 seconds, it shifts its weight and dips its antlers
  idle: { period: 3.6, pose(F, s, c, w) { const b = F.bones; if (b.hips) b.hips.rotation.z += 0.03 * s * w; if (b.chest) b.chest.rotation.z -= 0.02 * s * w;
    const dip = Math.max(0, c); if (b.neck) b.neck.rotation.x += 0.12 * dip * dip * w; if (b.head) b.head.rotation.x += 0.08 * dip * dip * w; } },
  fx: { kind: 'drift', color: 0xffe2a0, count: 16, at: 'head', dy: 0.12, radius: 0.25, speed: 0.08, life: 3.0, size: 0.03, bright: 0.6 },
  anchors: { chest: ['chest', 0], head: ['head', 0], top: ['head', 0.2], hit: ['head', 0] },
});
