// hoarmantle.js: the Hoarmantle in this game's battle (the peak-creatures job, November 24, 2026). A new creature,
// made from Chris's character sheet with Aethermoor M7's foe kit (its sculpt and rig: hoarmantle/src/). Its model and
// pictures are in this folder; everything below is data. m7-foe.js says what each line of the first part is; `peak` is
// read by peak/peak-foe.js (its frosty breath and the snow off its mantle).
// Its name and its moves' names are STAND-INS until Chris says yes (game/encounters/words.js holds the words).
window.M7.add('hoarmantle', {
  moves: 'ox',
  tex: { color: "./color-1024.webp", normal: "./normal-1024.webp", ao: "./ao-512.webp" },
  mat: { glowK: 0, exposure: 1.0, double: true },
  acts: {
    trample: { move: 'trample', dur: 2.6, hits: [0.7] },                              // Trample: head down, a pawing hoof, the charge
    breath: { move: 'breath', dur: 2.8, hits: [0.55] },                               // Winter Breath: a long cold huff over all four
    shake: { move: 'shake', dur: 2.2, hits: [0.5] },                                  // Shake the Mantle: snow and icicles fall
    charge: { move: 'trample', dur: 1.6, from: 0, to: 0.5, hold: true },              // head down, pawing, held: the blow seen coming
  },
  arrive: 'walk',
  letGo: 'runOff',                      // beaten, it turns away and walks off up the road
  stride: 0.9,
  // its standing loop, 7 seconds: its weight shifts, its head swings low, its hair sways with it
  idle: { period: 7.0, pose(F, s, c, w) { const b = F.bones, R = (n, a, v) => { if (b[n]) b[n].rotation[a] += v; };
    R('hips', 'z', 0.012 * s * w); R('chest', 'z', -0.01 * s * w); R('head', 'y', 0.07 * c * w); R('neck', 'x', 0.05 * Math.max(0, c) * w); } },
  anchors: { chest: ['chest', 0], head: ['head', 0], top: ['chest', 0.5], hit: ['chest', 0] },
  peak: {
    sheet: { m: 2.1 / 554, mid: 757, ground: 788 },
    // the brow ice (made in the page, clear): rows of points from the back of the slab to its lower edge, left to right,
    // in the sheet's pixels: [across, px along (side view), py down]; centre: the head's middle (px, py); thick: px
    helm: { centre: [1040, 520], thick: 16, ice: 0x9fcfe6, opacity: 0.6, glow: 0x10202a, rows: [
      [[-60, 965, 425], [-30, 960, 412], [0, 958, 408], [30, 960, 412], [60, 965, 425]],
      [[-78, 1010, 440], [-40, 1020, 425], [0, 1025, 420], [40, 1020, 425], [78, 1010, 440]],
      [[-82, 1050, 462], [-42, 1065, 450], [0, 1075, 445], [42, 1065, 450], [82, 1050, 462]],
      [[-76, 1070, 472], [-38, 1090, 480], [0, 1102, 497], [38, 1090, 480], [76, 1070, 472]] ] },
    nose: [1116, 556],
    faceLift: 0.35,                       // the face's own picture, lifted a little so it reads as his painting does at night
    eye: 0x86bcd8, eyeGlow: 0x102028, eyeSize: 0.015,   // small calm pale-blue eyes                    // where the breath comes from (sheet pixels, side view)
    huffEvery: 6.0,                       // a huff of frost now and then when it stands (seconds, about)
    breath: { color: 0xa8c4d8, bright: 0.32, size: 0.32, reach: 2.6, long: 1.1 },   // Winter Breath: its colour, how bright, how far, how long
    snow: { color: 0xc8d4e0, ice: 0x9fd8ec, iceShare: 0.3, bright: 0.45, size: 0.07, from: 2.0, wide: 0.6, long: 2.4 },
  },
});
