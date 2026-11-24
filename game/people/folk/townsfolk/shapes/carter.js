// The carter: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "The carter",
  height: 1.03,
  build: [1.1, 1.06],
  head: [0.98, 1, 0.98],
  skin: '#c48e6c',
  colors: { torso: '#b0a480', sleeve: '#b0a480', forearm: '#b0a480', legs: '#5a4a38', boots: { color: '#3a2a1e', rough: 0.6 }, soles: '#1a130e' },
  parts: { smock: { color: '#b0a480', rough: 0.95 }, yoke: { color: '#9c906c', rough: 0.95 }, kerchief: { color: '#b8482e', pattern: { kind: 'dots', color: '#f0e0c0', n: 6 } }, hat: { color: '#4a3a2a', rough: 1 }, band: '#2e2218', hair: '#5a3a22', whip: { color: '#3a281a', rough: 0.5 }, gaiter: { color: '#6a5236', rough: 0.7 }, cuff: '#9c906c' },
  face(F) {
    F.lips('#9a5e50', 0.5); F.brows('#5a3a22', 0.85, 18); F.eyes('#5a6a3a', 0.6); F.lines(0.3); F.blush('#c8644c', 0.3); F.beard('#5a3a22', 0.5, 'stubble');
  },
  make(K) {
    K.shell('smock', [[1.36, 0.071, 0.07, 0.074], [1.32, 0.153, 0.1, 0.102], [1.25, 0.151, 0.13, 0.106], [1.215, 0.151, 0.134, 0.108], [1.14, 0.145, 0.126, 0.106], [1.04, 0.145, 0.116, 0.108], [0.99, 0.157, 0.116, 0.115]], K.w.torso, { n: 28 });
    K.shell('smock', [[1.06, 0.15, 0.114, 0.112], [0.95, 0.174, 0.116, 0.126], [0.87, 0.192, 0.122, 0.138], [0.79, 0.202, 0.152, 0.168], [0.65, 0.218, 0.186, 0.202], [0.52, 0.233, 0.2, 0.215], [0.5, 0.234, 0.202, 0.217]], K.w.skirt, { n: 30 });
    K.shell('yoke', [[1.372, 0.072, 0.074, 0.078], [1.345, 0.124, 0.1, 0.104], [1.318, 0.166, 0.116, 0.118], [1.275, 0.17, 0.142, 0.122]], K.w.torso, { n: 26 });
    K.shell('kerchief', [[1.405, 0.06, 0.062, 0.062], [1.385, 0.078, 0.082, 0.084], [1.368, 0.092, 0.092, 0.092]], K.w.torso, { n: 22 });
    K.ball('kerchief', [0, 1.352, 0.104], [0.024, 0.02, 0.014], K.w.torso);
    K.tube('cuff', [[0.259, 0.895, -0.008], [0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmL'));
    K.tube('cuff', [[-0.259, 0.895, -0.008], [-0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmR'));
    K.tube('gaiter', [[0.085, 0.47, 0], [0.085, 0.34, 0], [0.085, 0.27, 0.01]], [0.058, 0.052, 0.062], K.w.bone('shinL'));
    K.tube('gaiter', [[-0.085, 0.47, 0], [-0.085, 0.34, 0], [-0.085, 0.27, 0.01]], [0.058, 0.052, 0.062], K.w.bone('shinR'));
    K.tube('whip', [[-0.124, 1.352, 0.02], [-0.108, 1.3, 0.128], [-0.03, 1.18, 0.156], [0.08, 1.06, 0.148], [0.16, 0.98, 0.088], [0.182, 0.96, 0], [0.16, 0.98, -0.092], [0.07, 1.08, -0.13], [-0.05, 1.22, -0.128], [-0.114, 1.32, -0.088], [-0.124, 1.352, 0.02]], [0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012], K.w.torso);
    K.tube('whip', [[0.17, 0.985, 0.06], [0.196, 0.86, 0.07], [0.204, 0.76, 0.074]], [0.016, 0.014, 0.01], K.w.bone('hips'));
    K.hair('hair', 'short', { underHat: true });
    K.shell('hat', [[1.58, 0.094, 0.112, 0.11], [1.63, 0.094, 0.112, 0.11], [1.672, 0.086, 0.102, 0.1], [1.692, 0.064, 0.076, 0.074], [1.698, 0.02, 0.024, 0.024]], K.w.head, { n: 26, capLast: true });
    K.shell('hat', [[1.596, 0.1, 0.118, 0.116], [1.588, 0.126, 0.146, 0.142], [1.594, 0.146, 0.166, 0.16]], K.w.head, { n: 28 });
    K.shell('band', [[1.624, 0.098, 0.116, 0.114], [1.598, 0.1, 0.118, 0.116]], K.w.head, { n: 26 });
  },
};
