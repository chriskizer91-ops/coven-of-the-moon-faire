// sapwight.js: Aethermoor M7's Sapwight in this game's battle (the creatures job). Its model, pictures and moves are
// M7's (assets/INDEX.csv); everything below is this game's data for it, made here. m7-foe.js says what each line is.
window.M7.add('sapwight', {
  moves: 'sapwight',
  tex: { color: "./color-512.webp", normal: "./normal-512.webp", orm: "./orm-256.webp", emit: "./emit-256.webp" },
  mat: { glow: 0xffa040, glowK: 1.1, exposure: 1.0 },
  acts: {
    grasp: { move: 'grasp', dur: 1.6, hits: [0.46] },                                 // Grasp: arms swing wide and close
    leech: { move: 'sap-leech', dur: 1.9, hits: [0.45], glow: 0.6 },                  // Sap Leech: a lurch, the hands clamp on
    charge: { move: 'sap-leech', dur: 1.0, from: 0, to: 0.28, hold: true },           // the lurch begun, held
    block: { move: 'bark-hide', dur: 0.8, from: 0, to: 0.35, interrupt: true },       // Bark Hide, begun: it braces
  },
  arrive: 'rise',
  letGo: 'wither',                      // when beaten it withers (wither, root, runOff or gutter: Chris's call)
  // its standing loop: 3.4 seconds, it creaks from side to side and sap drips from it
  idle: { period: 3.4, glow: 0.2, pose(F, s, c, w) { const b = F.bones; if (b.spine) b.spine.rotation.z += 0.03 * s * w; if (b.neck) b.neck.rotation.z -= 0.05 * s * w;
    if (b.head) b.head.rotation.x += 0.04 * Math.max(0, c) * w; F.body.rotation.y += 0.05 * c * w; } },
  fx: { kind: 'fall', color: 0xffa040, count: 14, at: 'head', dy: -0.02, radius: 0.12, speed: 0.1, life: 1.8, size: 0.04, bright: 0.9 },
  anchors: { chest: ['chest', 0], head: ['head', 0], top: ['head', 0.12], hit: ['r_hand', 0] },
});
