// briarmaw.js: Aethermoor M7's Briarmaw in this game's battle (the creatures job). Its model, pictures and moves are
// M7's (assets/INDEX.csv); everything below is this game's data for it, made here. m7-foe.js says what each line is.
window.M7.add('briarmaw', {
  moves: 'bear',
  tex: { color: "./color-512.webp", normal: "./normal-512.webp", ao: "./ao-512.webp", emit: "./emit-256.webp" },
  mat: { glowK: 1.3, exposure: 1.0, double: true },
  acts: {
    maul: { move: 'swipe', dur: 1.4, hits: [0.46] },                                  // Maul: a paw up, raked down
    rake: { move: 'bite', dur: 1.1, hits: [0.5] },                                    // Fang Rake
    volley: { move: 'bristle', dur: 1.6, hits: [0.5], fx: 5 },                        // Thorn Volley: it bristles and shakes
    quake: { move: 'stomp', dur: 1.8, hits: [0.55] },                                 // Rootquake: it rears and slams down
    roar: { move: 'roar', dur: 2.2, hits: [0.5], fx: 3 },                             // Roar
    charge: { move: 'stomp', dur: 1.3, from: 0, to: 0.42, hold: true },               // reared up, held
  },
  arrive: 'walk',
  letGo: 'runOff',                      // when beaten it lumbers away into the briars (wither, root, runOff or gutter)
  // its standing loop: 3 seconds, it flexes: the shoulders roll and the back swells
  idle: { period: 3.0, pose(F, s, c, w) { const b = F.bones; if (b.chest) b.chest.rotation.x -= 0.03 * c * w; if (b.spine) b.spine.rotation.x += 0.02 * c * w;
    if (b.fl_upper) b.fl_upper.rotation.x += 0.04 * s * w; if (b.fr_upper) b.fr_upper.rotation.x -= 0.04 * s * w; if (b.head) b.head.rotation.y += 0.06 * s * w; } },
  fx: { kind: 'drift', color: 0xb8d060, count: 18, at: 'chest', dy: 0.1, radius: 0.5, speed: 0.1, life: 3.0, size: 0.035, bright: 0.5 },
  anchors: { chest: ['chest', 0], head: ['head', 0], top: ['chest', 0.4], hit: ['head', 0] },
});
