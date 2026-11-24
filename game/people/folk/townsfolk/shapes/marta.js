// Marta, the keeper of the Wardens’ hall: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Marta, the keeper of the Wardens’ hall",
  height: 0.93,
  build: [1.2, 1.18],
  head: [0.94, 1, 0.94],
  skin: '#d4a48c',
  colors: { torso: '#5a6a7e', sleeve: '#5a6a7e', forearm: '#e8e2d4', legs: '#4a4038', boots: '#30261e', soles: '#18120e' },
  parts: { dress: { color: '#5a6a7e', rough: 0.95 }, apron: { color: '#f0ece0', rough: 0.9 }, strap: '#e6e0d2', cap: { color: '#f4f0e6', rough: 0.9 }, frill: '#e8e2d4', hair: '#b8b4ac', keys: { color: '#8a8a8e', metal: 1, rough: 0.4 }, ring: { color: '#a8904a', metal: 1, rough: 0.4 }, cuff: '#f0ece0', collar: '#f0ece0' },
  face(F) {
    F.lips('#b0706a', 0.55); F.brows('#a8a49c', 0.7, 14); F.eyes('#5a7088', 0.6); F.lines(0.7); F.underEye(0.25); F.blush('#d07864', 0.32);
  },
  make(K) {
    K.shell('dress', [[1.352, 0.067, 0.068, 0.072], [1.325, 0.153, 0.095, 0.105], [1.27, 0.153, 0.129, 0.109], [1.215, 0.151, 0.138, 0.111], [1.14, 0.137, 0.119, 0.105], [1.04, 0.124, 0.1, 0.1], [0.985, 0.156, 0.114, 0.121]], K.w.torso, { n: 28 });
    K.shell('dress', [[1.05, 0.116, 0.092, 0.092], [0.98, 0.15, 0.125, 0.13], [0.86, 0.185, 0.16, 0.17], [0.6, 0.23, 0.2, 0.215], [0.34, 0.265, 0.23, 0.245], [0.16, 0.285, 0.245, 0.262]], K.w.skirt, { n: 30 });
    K.panel('apron', [[1.29, 0.106, 0.136], [1.215, 0.156, 0.136], [1.14, 0.144, 0.126], [1.045, 0.136, 0.116]], -42, 42, K.w.torso, { n: 14 });
    K.panel('apron', [[1.04, 0.133, 0.109, 0.109], [0.98, 0.162, 0.137, 0.142], [0.86, 0.197, 0.172, 0.182], [0.6, 0.242, 0.212, 0.227], [0.34, 0.277, 0.242, 0.257], [0.22, 0.29, 0.252, 0.268]], -72, 72, K.w.skirt, { n: 22 });
    K.shell('strap', [[1.065, 0.136, 0.114, 0.11], [1.03, 0.146, 0.124, 0.118]], K.w.torso, { n: 26 });
    K.tube('strap', [[0.09, 1.288, 0.126], [0.094, 1.34, 0.092], [0.08, 1.362, 0], [0.04, 1.3, -0.104], [-0.07, 1.08, -0.106]], [0.011, 0.011, 0.011, 0.011, 0.011], K.w.torso);
    K.tube('strap', [[-0.09, 1.288, 0.126], [-0.094, 1.34, 0.092], [-0.08, 1.362, 0], [-0.04, 1.3, -0.104], [0.07, 1.08, -0.106]], [0.011, 0.011, 0.011, 0.011, 0.011], K.w.torso);
    K.ball('strap', [0, 1.04, -0.124], [0.04, 0.022, 0.014], K.w.bone('hips'));
    K.shell('collar', [[1.385, 0.062, 0.064, 0.066], [1.36, 0.082, 0.084, 0.086], [1.345, 0.104, 0.092, 0.094]], K.w.torso, { n: 22 });
    K.tube('cuff', [[0.251, 0.925, -0.008], [0.268, 0.86, -0.008]], [0.042, 0.037], K.w.bone('farmL'));
    K.tube('cuff', [[-0.251, 0.925, -0.008], [-0.268, 0.86, -0.008]], [0.042, 0.037], K.w.bone('farmR'));
    K.tube('ring', [[0.178, 1.02, 0.06], [0.196, 0.975, 0.07], [0.186, 0.935, 0.074]], [0.008, 0.008, 0.008], K.w.bone('hips'));
    K.tube('keys', [[0.184, 0.94, 0.076], [0.19, 0.84, 0.084]], [0.012, 0.016], K.w.bone('hips'));
    K.tube('keys', [[0.198, 0.94, 0.062], [0.212, 0.86, 0.066]], [0.01, 0.013], K.w.bone('hips'));
    K.hair('hair', 'bun', { underHat: true });
    K.shell('cap', [[1.584, 0.093, 0.111, 0.109], [1.625, 0.094, 0.112, 0.112], [1.655, 0.092, 0.106, 0.116], [1.682, 0.072, 0.078, 0.1], [1.694, 0.03, 0.03, 0.05, 0, -0.012]], K.w.head, { n: 26, capLast: true });
    K.shell('frill', [[1.598, 0.097, 0.115, 0.113], [1.586, 0.11, 0.128, 0.124], [1.572, 0.116, 0.132, 0.128]], K.w.head, { n: 28 });
  },
};
