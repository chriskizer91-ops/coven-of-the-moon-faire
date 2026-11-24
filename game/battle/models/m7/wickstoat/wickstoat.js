// wickstoat.js: the Wickstoat in this game's battle (the peak-creatures job, November 24, 2026). A new creature, made
// from Chris's character sheet with Aethermoor M7's foe kit (its sculpt and rig: wickstoat/src/). Its model and
// pictures are in this folder; everything below is data. m7-foe.js says what each line of the first part is; `peak` is
// read by peak/peak-foe.js (the nine ice spines and their sparks, and its motes of stolen light).
// Its name and its moves' names are STAND-INS until Chris says yes (game/encounters/words.js holds the words).
window.M7.add('wickstoat', {
  moves: 'stoat',
  tex: { color: "./color-1024.webp", normal: "./normal-512.webp", ao: "./ao-512.webp" },
  mat: { glowK: 0, exposure: 0.8, double: true },       // white fur: a little lower, so it is never brighter than the witches
  acts: {
    pinch: { move: 'pinch', dur: 1.2, hits: [0.5] },                                  // Pinch: it darts in and nips
    skitter: { move: 'skitter', dur: 1.4, hits: [] },                                 // Skitter: a darting S, hard to hit
    glint: { move: 'glint', dur: 1.9, hits: [0.55] },                                 // Glint: up on its hind legs, every lit spine flashes
  },
  arrive: 'walk',
  letGo: 'runOff',                      // beaten, it drops its stolen lights (they drift back) and bolts
  stride: 1.25,
  // its standing loop, 5.2 seconds: head up for a look round, a flick of the tail now and then (never quite still)
  idle: { period: 5.2, pose(F, s, c, w, ph) { const b = F.bones, R = (n, a, v) => { if (b[n]) b[n].rotation[a] += v; };
    const up = Math.max(0, s) ** 2, look = Math.sin(ph * 0.5 + 0.4), flick = Math.max(0, Math.sin(ph * 2.3) - 0.8) * 5;
    R('neck', 'x', -0.16 * up * w); R('head', 'x', 0.06 * up * w); R('head', 'y', 0.42 * look * w); R('neck', 'y', 0.14 * look * w);
    R('tail2', 'y', 0.25 * flick * w); R('tail3', 'y', 0.35 * flick * w); R('tail4', 'y', 0.4 * flick * w); R('tail3', 'x', -0.1 * flick * w); } },
  anchors: { chest: ['chest', 0], head: ['head', 0], top: ['head', 0.15], hit: ['chest', 0] },
  peak: {
    // the sheet's side view: metres a pixel, its middle and its ground (as wickstoat/src/sculpt.py)
    sheet: { m: 1.6 / 982, mid: 748, ground: 694 },
    // the nine spines from the shoulders to the base of the tail (sheet pixels: px along, py the fur's top there, how
    // tall, how long, how wide, how deep it sits in the fur) and the bone each rides on. They light in this order.
    spines: [
      { px: 987, py: 445, tall: 66, len: 62, wide: 48, sink: 8, bone: 'chest' },
      { px: 924, py: 452, tall: 58, len: 58, wide: 44, sink: 8, bone: 'chest' },
      { px: 857, py: 458, tall: 50, len: 54, wide: 40, sink: 8, bone: 'spine' },
      { px: 794, py: 462, tall: 44, len: 50, wide: 36, sink: 8, bone: 'spine' },
      { px: 730, py: 465, tall: 38, len: 46, wide: 33, sink: 8, bone: 'spine' },
      { px: 671, py: 462, tall: 33, len: 42, wide: 30, sink: 8, bone: 'hips' },
      { px: 615, py: 470, tall: 28, len: 38, wide: 27, sink: 8, bone: 'hips' },
      { px: 562, py: 479, tall: 24, len: 34, wide: 24, sink: 4, bone: 'hips' },
      { px: 513, py: 490, tall: 20, len: 30, wide: 21, sink: 4, bone: 'hips' },
    ],
    ice: 0x78c2e6, iceOpacity: 0.45, iceGlow: 0x0e1820,
    spark: 0xffb84a,
    startLit: 3,          // how many it has lit when met (THE JOB'S CALL: the sheet shows all nine; 0 was the other choice)
    pulse: 1.3,           // the sparks' slow pulse (a turn a second, about)
    glintK: 2.2,          // how much brighter the lit sparks flash in Glint (more lit, brighter)
    mote: { size: 0.07, height: 1.05, reach: 1.15, fly: 0.7 },   // the stolen light: its size, where the witch is (height, how far in front), how long it flies
  },
});
