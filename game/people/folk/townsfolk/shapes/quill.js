// Quill, the sailor: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Quill, the sailor",
  height: 1.01,
  build: [1, 0.98],
  head: [1, 1, 1],
  skin: '#b98262',
  colors: { torso: '#d8d0bc', sleeve: '#2e3c4e', forearm: '#2e3c4e', legs: '#6a6456', boots: { color: '#2a2018', rough: 0.5 }, soles: '#15100c' },
  parts: { jacket: { color: '#2e3c4e', rough: 0.95 }, jersey: { color: '#d8d0bc', rough: 0.95, pattern: { kind: 'hoops', color: '#3a4a6a', n: 9 } }, kerchief: '#a83a2a', cap: { color: '#8a3a2a', rough: 1 }, roll: '#74301f', hair: '#a8a29a', rope: { color: '#b89a64', rough: 1 }, belt: { color: '#3a2a1c', rough: 0.5 }, cuff: '#243040' },
  face(F) {
    F.lips('#8a5a4e', 0.5); F.brows('#a8a29a', 0.8, 15); F.eyes('#4a6a7a', 0.65); F.lines(0.65); F.underEye(0.3); F.blush('#b0604a', 0.22); F.beard('#a8a29a', 0.6, 'stubble');
  },
  make(K) {
    K.shell('jersey', [[1.34, 0.1, 0.082, 0.09], [1.215, 0.142, 0.122, 0.102], [1.14, 0.134, 0.114, 0.1], [1.04, 0.132, 0.106, 0.102], [0.99, 0.15, 0.11, 0.112]], K.w.torso, { n: 26 });
    K.panel('jacket', [[1.36, 0.072, 0.072, 0.076], [1.32, 0.154, 0.104, 0.106], [1.215, 0.154, 0.138, 0.112], [1.14, 0.148, 0.13, 0.11], [1.04, 0.148, 0.122, 0.112], [0.95, 0.166, 0.124, 0.124]], 30, 330, K.w.torso, { n: 26 });
    K.shell('jersey', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.124, 0.138], [0.86, 0.187, 0.125, 0.139]], K.w.skirt, { n: 26 });
    K.panel('jacket', [[1.06, 0.156, 0.124, 0.122], [0.95, 0.179, 0.126, 0.136], [0.87, 0.196, 0.134, 0.148], [0.8, 0.202, 0.14, 0.152], [0.78, 0.201, 0.139, 0.15]], 26, 334, K.w.skirt, { n: 26 });
    K.shell('belt', [[1.04, 0.153, 0.122, 0.114], [1, 0.159, 0.123, 0.118]], K.w.torso, { n: 28 });
    K.shell('kerchief', [[1.4, 0.06, 0.062, 0.062], [1.37, 0.076, 0.08, 0.08], [1.35, 0.094, 0.09, 0.088]], K.w.torso, { n: 22 });
    K.ball('kerchief', [0.02, 1.335, 0.098], [0.022, 0.02, 0.014], K.w.torso);
    K.tube('rope', [[0.12, 1.345, 0.02], [0.105, 1.3, 0.118], [0.03, 1.19, 0.15], [-0.07, 1.08, 0.142], [-0.15, 0.99, 0.085], [-0.172, 0.97, 0], [-0.15, 0.99, -0.09], [-0.06, 1.1, -0.126], [0.05, 1.23, -0.124], [0.112, 1.32, -0.085], [0.12, 1.345, 0.02]], [0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022], K.w.torso);
    K.tube('cuff', [[0.257, 0.9, -0.008], [0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmL'));
    K.tube('cuff', [[-0.257, 0.9, -0.008], [-0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmR'));
    K.hair('hair', 'short', { underHat: true });
    K.shell('cap', [[1.578, 0.091, 0.109, 0.107], [1.612, 0.091, 0.109, 0.107], [1.642, 0.083, 0.099, 0.097], [1.664, 0.06, 0.07, 0.07], [1.674, 0.02, 0.022, 0.022]], K.w.head, { n: 26, capLast: true });
    K.shell('roll', [[1.606, 0.097, 0.115, 0.113], [1.59, 0.1, 0.118, 0.116], [1.574, 0.097, 0.115, 0.113]], K.w.head, { n: 26 });
  },
};
