// forge-spark.js: Aethermoor M7's Forge-Spark in this game's battle (the creatures job). Its model, pictures and moves
// are M7's (assets/INDEX.csv); everything below is this game's data for it, made here. m7-foe.js says what each line is.
window.M7.add('forge-spark', {
  moves: 'spark',
  // fights-tune (November 25): how tall it stands, in metres. M7 made it 0.49 m, a speck on every screen; Chris agreed
  // the hub's suggestion of about 0.75 m with a stronger glow. Its shadow, glow on the ground, embers, where blows land
  // and how near it comes follow this one number (game/battle/models/m7/m7-foe.js; game/encounters/slots.js)
  tall: 0.75,
  tex: { color: "./color-512.webp", normal: "./normal-512.webp", ao: "./ao-512.webp", emit: "./emit-256.webp" },
  mat: { glowK: 2.5, exposure: 1.0, double: true },      // fights-tune: its own fire lit brighter (was 1.6)
  acts: {
    singe: { move: 'dart', dur: 1.0, hits: [0.42] },                                  // Singe: it darts in, touches, darts back
    flare: { move: 'flare', dur: 1.4, hits: [0.5], glow: 1.4, fx: 4 },               // Flare: it rises and flares white-hot
    lure: { move: 'lure', dur: 2.0, hits: [0.5], glow: 0.5, fx: 2 },                 // it bobs away, slow, and back
    flicker: { move: 'flicker', dur: 1.2, hits: [0.45] },                            // it gutters down, lights a step away
    charge: { move: 'flare', dur: 0.9, from: 0, to: 0.3, hold: true, glow: 0.8 },
  },
  arrive: 'flare',                      // it flares into being
  letGo: 'gutter',                      // when beaten it gutters out (wither, root, runOff or gutter: Chris's call)
  // its standing loop: 2 seconds, its fire flickers three times and it bobs
  idle: { period: 2.0, glow: 0.3, glowBeats: 3, pose(F, s, c, w) { const b = F.bones; if (b.body) b.body.position.y += 0.012 * s * w; if (b.top) b.top.rotation.z += 0.05 * Math.sin(Math.atan2(s, c) * 3) * w; } },
  // fights-tune: more embers and brighter (were 24, and 1); their size and spread already grow with its height
  fx: { kind: 'rise', color: 0xffa040, count: 36, at: 'top', dy: 0.05, radius: 0.25, speed: 0.5, life: 1.4, size: 0.06, bright: 1.7 },
  anchors: { chest: ['body', 0], head: ['top', 0], top: ['top', 0.2], hit: ['r_fist', 0] },
});
