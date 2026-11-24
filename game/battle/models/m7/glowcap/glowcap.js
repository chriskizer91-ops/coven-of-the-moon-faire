// glowcap.js: Aethermoor M7's Glowcap in this game's battle (the creatures job). Its model, pictures and moves are
// M7's (assets/INDEX.csv); everything below is this game's data for it, made here. Words the player reads are not
// here: they are in game/encounters/words.js.
window.M7.add('glowcap', {
  moves: 'mushroom',                     // M7's moves file for it (moves/mushroom.js)
  // its pictures, as M7 made them: colour, bump, shading in red with surface in green and blue (orm), glow
  tex: { color: "./color-512.webp", normal: "./normal-512.webp", orm: "./orm-512.webp", emit: "./emit-256.webp" },
  // how its material is lit (m7-foe.js says what each is): its gills keep their own green light
  mat: { glowK: 1.6, exposure: 1.0, double: false },
  // which of its moves plays for each motion the battle asks for: seconds, the moments a blow lands (0 to 1),
  // and how much of the move (from, to). `glow` and `fx` lift its light and its spores during the move
  acts: {
    bump: { move: 'bump', dur: 1.0, hits: [0.55] },                           // Headbutt: crouch, lunge, back
    spores: { move: 'spores', dur: 1.6, hits: [0.42, 0.62], glow: 0.9, fx: 5 }, // Spores: squat, shake its cap hard
    charge: { move: 'spores', dur: 0.9, from: 0, to: 0.26, hold: true, glow: 0.6 },  // the squat before the shake, held
  },
  arrive: 'rise',                        // it comes up out of the ground
  letGo: 'root',                         // when beaten it sinks back into the ground. One word, Chris's to change:
                                         //   wither, root, runOff or gutter
  // its own standing loop: 2.6 seconds, it rocks from foot to foot and its gills pulse
  idle: { period: 2.6, glow: 0.35, pose(F, s, c, w) { const b = F.bones;
    if (b.hips) b.hips.rotation.z += 0.07 * s * w; if (b.head) { b.head.rotation.z -= 0.05 * s * w; b.head.rotation.x += 0.03 * c * w; }
    F.body.position.y += 0.006 * Math.abs(s) * w; } },
  // its effect: a few spores drifting up from under its cap
  fx: { kind: 'rise', color: 0xb8ff6a, count: 18, at: 'head', dy: -0.05, radius: 0.4, speed: 0.12, life: 2.6, size: 0.05, bright: 0.8 },
  // where blows land on it
  anchors: { chest: ['body', 0.05], head: ['head', 0.05], top: ['head', 0.4], hit: ['r_arm', 0] },
  stride: 1.6,
});
