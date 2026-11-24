// Old Gil, the innkeeper: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Old Gil, the innkeeper",
  height: 0.94,
  build: [1.2, 1.26],
  head: [0.95, 1, 0.94],
  skin: '#d09c84',
  colors: { torso: '#3a4a5a', sleeve: '#3a4a5a', forearm: '#3a4a5a', legs: '#4a443c', boots: { color: '#2a221c', rough: 0.55 }, soles: '#15110e' },
  parts: { jersey: { color: '#3a4a5a', rough: 1, pattern: { kind: 'stripes', color: '#33414f', n: 14 } }, collar: { color: '#3a4a5a', rough: 1 }, apron: { color: '#c8bea8', rough: 0.95 }, tie: '#b8ae98', cap: { color: '#9a3a2e', rough: 1 }, bobble: '#d8d0c0', hair: '#e0dcd4', beard: '#e4e0d8', breeches: { color: '#4a443c', rough: 0.95 }, cuff: '#33414f', wrap: '#8a7a64' },
  face(F) {
    F.lips('#a86a5e', 0.45); F.brows('#e0dcd4', 0.85, 18); F.eyes('#5a7a8a', 0.6); F.lines(0.9); F.underEye(0.4); F.blush('#d0685a', 0.4); F.beard('#e4e0d8', 0.75, 'beard');
  },
  make(K) {
    K.shell('jersey', [[1.35, 0.068, 0.068, 0.074], [1.325, 0.152, 0.1, 0.108], [1.29, 0.153, 0.116, 0.11], [1.26, 0.154, 0.132, 0.111], [1.235, 0.155, 0.147, 0.112], [1.215, 0.155, 0.15, 0.112], [1.14, 0.15, 0.156, 0.11], [1.04, 0.156, 0.172, 0.11], [0.96, 0.166, 0.156, 0.122], [0.9, 0.172, 0.14, 0.128]], K.w.torso, { n: 28 });
    K.shell('breeches', [[0.99, 0.176, 0.166, 0.13], [0.93, 0.184, 0.158, 0.138], [0.87, 0.194, 0.146, 0.144], [0.8, 0.198, 0.134, 0.142], [0.74, 0.192, 0.124, 0.134]], K.w.skirt, { n: 28 });
    K.shell('collar', [[1.412, 0.07, 0.074, 0.074], [1.39, 0.084, 0.088, 0.088], [1.36, 0.086, 0.09, 0.092], [1.342, 0.076, 0.08, 0.084]], K.w.torso, { n: 22 });
    K.shell('tie', [[1.016, 0.182, 0.184, 0.136], [0.976, 0.188, 0.18, 0.144]], K.w.torso, { n: 28 });
    K.panel('apron', [[0.99, 0.198, 0.194], [0.9, 0.208, 0.182], [0.8, 0.216, 0.184], [0.68, 0.226, 0.198], [0.58, 0.234, 0.21]], -60, 60, K.w.skirt, { n: 20 });
    K.tube('cuff', [[0.256, 0.905, -0.008], [0.27, 0.855, -0.008]], [0.042, 0.037], K.w.bone('farmL'));
    K.tube('cuff', [[-0.256, 0.905, -0.008], [-0.27, 0.855, -0.008]], [0.042, 0.037], K.w.bone('farmR'));
    K.tube('wrap', [[0.085, 0.54, 0], [0.085, 0.47, 0.004], [0.085, 0.4, 0]], [0.058, 0.06, 0.052], K.w.bone('shinL'));
    K.tube('wrap', [[-0.085, 0.54, 0], [-0.085, 0.47, 0.004], [-0.085, 0.4, 0]], [0.058, 0.06, 0.052], K.w.bone('shinR'));
    K.hair('hair', 'short', { underHat: true });
    K.panel('beard', [[1.458, 0.062, 0.097], [1.43, 0.062, 0.106], [1.4, 0.056, 0.114], [1.36, 0.046, 0.122], [1.32, 0.032, 0.134], [1.3, 0.014, 0.132]], -66, 66, K.w.head, { n: 12 });
    K.shell('cap', [[1.578, 0.091, 0.109, 0.107], [1.612, 0.091, 0.109, 0.107], [1.642, 0.083, 0.099, 0.097], [1.664, 0.06, 0.07, 0.07], [1.674, 0.02, 0.022, 0.022]], K.w.head, { n: 26, capLast: true });
    K.shell('cap', [[1.606, 0.097, 0.115, 0.113], [1.59, 0.1, 0.118, 0.116], [1.574, 0.097, 0.115, 0.113]], K.w.head, { n: 26 });
    K.ball('bobble', [0, 1.692, 0], [0.03, 0.028, 0.03], K.w.head);
  },
};
