// Nettie, the herb-seller: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Nettie, the herb-seller",
  height: 0.94,
  build: [1.14, 1.12],
  head: [0.98, 1, 0.98],
  skin: '#c99378',
  colors: { torso: '#6b7a4a', sleeve: '#6b7a4a', forearm: 'skin', legs: '#5a4a3a', boots: '#3a2a20', soles: '#241a14' },
  parts: { dress: { color: '#6b7a4a', rough: 0.95 }, skirt: { color: '#7a5a3c', rough: 0.95 }, apron: { color: '#d8ccb0', rough: 0.95 }, pocket: '#bfae8c', shawl: { color: '#a8643c', rough: 0.95, pattern: { kind: 'check', color: '#8a4a2a', n: 6 } }, roll: '#7c8a58', hat: { color: '#d2b06a', rough: 0.9 }, band: '#5a6a3a', hair: '#9a948c', sprig: '#5f7a3c' },
  face(F) {
    F.lips('#a8665c', 0.6); F.brows('#8a847c', 0.7, 14); F.eyes('#5a6a4a', 0.6); F.lines(0.6); F.underEye(0.2); F.blush('#c86a58', 0.3);
  },
  make(K) {
    K.shell('dress', [[1.352, 0.065, 0.066, 0.07], [1.325, 0.15, 0.093, 0.102], [1.27, 0.15, 0.126, 0.106], [1.215, 0.148, 0.134, 0.108], [1.14, 0.135, 0.115, 0.102], [1.04, 0.121, 0.097, 0.097], [0.985, 0.153, 0.111, 0.117]], K.w.torso, { n: 28 });
    K.shell('skirt', [[1.05, 0.116, 0.092, 0.092], [0.98, 0.15, 0.125, 0.13], [0.86, 0.185, 0.16, 0.17], [0.6, 0.23, 0.2, 0.215], [0.34, 0.265, 0.23, 0.245], [0.16, 0.285, 0.245, 0.262]], K.w.skirt, { n: 30 });
    K.panel('apron', [[1.262, 0.112, 0.14], [1.215, 0.154, 0.146], [1.14, 0.142, 0.128], [1.045, 0.132, 0.114]], -38, 38, K.w.torso, { n: 14 });
    K.panel('apron', [[1.04, 0.133, 0.109, 0.109], [0.98, 0.162, 0.137, 0.142], [0.86, 0.197, 0.172, 0.182], [0.6, 0.242, 0.212, 0.227], [0.36, 0.274, 0.24, 0.255]], -56, 56, K.w.skirt, { n: 18 });
    K.panel('pocket', [[0.86, 0.207, 0.182, 0.192], [0.7, 0.235, 0.207, 0.22]], 14, 44, K.w.skirt, { n: 6 });
    K.panel('pocket', [[0.86, 0.207, 0.182, 0.192], [0.7, 0.235, 0.207, 0.22]], -44, -14, K.w.skirt, { n: 6 });
    K.shell('apron', [[1.063, 0.15, 0.126, 0.118], [1.027, 0.156, 0.129, 0.122]], K.w.torso, { n: 28 });
    K.shell('shawl', [[1.375, 0.072, 0.072, 0.078], [1.345, 0.126, 0.1, 0.104], [1.315, 0.176, 0.112, 0.116], [1.27, 0.196, 0.13, 0.122], [1.235, 0.204, 0.142, 0.126]], K.w.torso, { n: 28 });
    K.panel('shawl', [[1.24, 0.2, 0.12, 0.128], [1.16, 0.15, 0.12, 0.122], [1.08, 0.085, 0.12, 0.118], [1.03, 0.02, 0.12, 0.116]], 100, 260, K.w.torso, { n: 12 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, 0.195, -0.008], [1.105, 0.068, 0.066, 0.066, 0.202, -0.008], [1.075, 0.062, 0.06, 0.06, 0.21, -0.008]], K.w.bone('uarmL'), { n: 16 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, -0.195, -0.008], [1.105, 0.068, 0.066, 0.066, -0.202, -0.008], [1.075, 0.062, 0.06, 0.06, -0.21, -0.008]], K.w.bone('uarmR'), { n: 16 });
    K.hair('hair', 'bun', { underHat: true });
    K.shell('hat', [[1.578, 0.094, 0.112, 0.11], [1.62, 0.093, 0.111, 0.109], [1.652, 0.084, 0.1, 0.098], [1.668, 0.06, 0.072, 0.07], [1.674, 0.02, 0.024, 0.024]], K.w.head, { n: 26, capLast: true });
    K.shell('hat', [[1.592, 0.1, 0.118, 0.116], [1.586, 0.14, 0.158, 0.154], [1.572, 0.178, 0.196, 0.19]], K.w.head, { n: 28 });
    K.shell('band', [[1.618, 0.097, 0.115, 0.113], [1.594, 0.099, 0.117, 0.115]], K.w.head, { n: 26 });
    K.tube('sprig', [[0.085, 1.6, 0.075], [0.105, 1.645, 0.07], [0.112, 1.69, 0.06]], [0.01, 0.012, 0.004], K.w.head);
  },
};
