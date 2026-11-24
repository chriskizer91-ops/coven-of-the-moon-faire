// thornhound.js: Aethermoor M7's Thornhound in this game's battle (the creatures job). Its model, pictures and moves
// are M7's (assets/INDEX.csv); everything below is this game's data for it, made here. m7-foe.js says what each line is.
window.M7.add('thornhound', {
  moves: 'quad',
  tex: { color: "./color-512.webp", normal: "./normal-512.webp", ao: "./ao-512.webp", emit: "./emit-256.webp" },
  mat: { glowK: 1.3, exposure: 1.0, double: true },
  acts: {
    bite: { move: 'bite', dur: 1.0, hits: [0.47] },                                   // Bite: a snap, head down and forward
    lunge: { move: 'lunge', dur: 2.2, hits: [0.66, 0.72, 0.8] },                      // Lunge: a long crouch, the leap, it rakes
    howl: { move: 'howl', dur: 2.6, hits: [0.5] },                                    // Pack Howl
    charge: { move: 'lunge', dur: 1.2, from: 0, to: 0.36, hold: true },               // the crouch, trembling, held
  },
  arrive: 'walk',
  letGo: 'runOff',                      // when beaten it turns tail and runs (wither, root, runOff or gutter)
  // its standing loop: 2.4 seconds, it paces low: head down, weight from paw to paw
  idle: { period: 2.4, pose(F, s, c, w) { const b = F.bones; if (b.neck) b.neck.rotation.x += 0.08 * w; if (b.head) b.head.rotation.x -= 0.04 * w;
    if (b.hips) b.hips.rotation.z += 0.04 * s * w; if (b.chest) b.chest.rotation.z -= 0.03 * s * w; F.body.position.y -= 0.01 * w; } },
  fx: { kind: 'drift', color: 0xffd060, count: 14, at: 'spine', dy: 0.05, radius: 0.3, speed: 0.08, life: 3.0, size: 0.025, bright: 0.6 },
  anchors: { chest: ['chest', 0], head: ['head', 0], top: ['head', 0.1], hit: ['head', 0] },
  stride: 1.4,
});
