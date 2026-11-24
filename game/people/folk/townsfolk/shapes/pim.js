// Pim, the herb-seller (a gnome): shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Pim, the herb-seller (a gnome)",
  height: 0.6,
  build: [1.14, 1.12],
  head: [1.14, 1.24, 1.16],
  skin: '#d8a488',
  colors: { torso: '#7a8a4a', sleeve: '#e0d8c0', forearm: '#e0d8c0', legs: '#8a5a3a', boots: { color: '#4a3020', rough: 0.6 }, soles: '#1c140e' },
  parts: { bodice: { color: '#7a8a4a', rough: 0.9 }, lace: '#d8c890', skirt: { color: '#b8642e', rough: 0.95, pattern: { kind: 'hoops', color: '#8a4a22', n: 5 } }, apron: { color: '#e8e0c8', rough: 0.95 }, cap: { color: '#c8a03a', rough: 1 }, band: '#a8842a', hair: '#c87a3a', strap: { color: '#6a4a2e', rough: 0.6 }, satchel: { color: '#8a6a3e', rough: 0.7 }, flap: { color: '#6a4a2e', rough: 0.6 }, leaf: '#5a7a34', cuff: '#7a8a4a' },
  face(F) {
    F.lips('#c8706a', 0.55); F.brows('#b06a30', 0.7, 13); F.eyes('#5a8a5a', 0.65); F.blush('#e07a68', 0.36); F.freckles(50, '#b06a40', 0.4);
  },
  make(K) {
    K.shell('bodice', [[1.3, 0.15, 0.112, 0.106], [1.26, 0.153, 0.132, 0.107], [1.235, 0.153, 0.147, 0.106], [1.215, 0.153, 0.15, 0.106], [1.185, 0.148, 0.141, 0.102], [1.14, 0.134, 0.116, 0.1], [1.04, 0.12, 0.096, 0.096], [1, 0.14, 0.104, 0.108]], K.w.torso, { n: 26 });
    K.panel('lace', [[1.29, 0.16, 0.126], [1.26, 0.161, 0.14], [1.235, 0.161, 0.155], [1.215, 0.161, 0.158], [1.14, 0.142, 0.124], [1.05, 0.13, 0.106]], -13, 13, K.w.torso, { n: 6 });
    K.shell('skirt', [[1.05, 0.124, 0.1, 0.1], [0.98, 0.164, 0.138, 0.144], [0.86, 0.208, 0.182, 0.192], [0.7, 0.244, 0.218, 0.23], [0.54, 0.268, 0.24, 0.254], [0.42, 0.28, 0.25, 0.266]], K.w.skirt, { n: 30 });
    K.panel('apron', [[1.04, 0.13, 0.11], [0.98, 0.174, 0.148], [0.86, 0.218, 0.192], [0.72, 0.25, 0.224], [0.62, 0.264, 0.238]], -40, 40, K.w.skirt, { n: 12 });
    K.shell('apron', [[1.07, 0.128, 0.104, 0.1], [1.035, 0.136, 0.112, 0.108]], K.w.torso, { n: 24 });
    K.shell('cuff', [[0.9, 0.036, 0.036, 0.036, 0.257, -0.008], [0.86, 0.034, 0.034, 0.034, 0.268, -0.008]], K.w.bone('farmL'), { n: 12 });
    K.shell('cuff', [[0.9, 0.036, 0.036, 0.036, -0.257, -0.008], [0.86, 0.034, 0.034, 0.034, -0.268, -0.008]], K.w.bone('farmR'), { n: 12 });
    K.tube('strap', [[-0.11, 1.33, 0.02], [-0.096, 1.29, 0.106], [0, 1.17, 0.152], [0.075, 1.08, 0.104], [0.132, 1.03, 0.06], [0.17, 0.99, 0.03]], [0.012, 0.012, 0.012, 0.012, 0.012, 0.012], K.w.torso);
    K.tube('strap', [[-0.11, 1.33, 0.02], [-0.094, 1.29, -0.106], [0, 1.16, -0.118], [0.075, 1.08, -0.1], [0.132, 1.03, -0.056], [0.17, 0.99, -0.03]], [0.012, 0.012, 0.012, 0.012, 0.012, 0.012], K.w.torso);
    K.ball('satchel', [0.214, 0.9, 0.02], [0.05, 0.07, 0.085], K.w.bone('hips'));
    K.ball('flap', [0.226, 0.935, 0.02], [0.044, 0.04, 0.088], K.w.bone('hips'));
    K.tube('leaf', [[0.214, 0.965, 0.03], [0.228, 1.01, 0.05]], [0.016, 0.006], K.w.bone('hips'));
    K.tube('leaf', [[0.21, 0.965, -0.01], [0.214, 1.02, -0.02]], [0.014, 0.005], K.w.bone('hips'));
    K.hair('hair', 'short', { underHat: true });
    K.ball('hair', [0.094, 1.5, -0.03], [0.04, 0.042, 0.042], K.w.head);
    K.ball('hair', [-0.094, 1.5, -0.03], [0.04, 0.042, 0.042], K.w.head);
    K.shell('cap', [[1.578, 0.092, 0.11, 0.108], [1.62, 0.092, 0.11, 0.108], [1.665, 0.078, 0.092, 0.092], [1.72, 0.052, 0.058, 0.06, 0.008, -0.004], [1.775, 0.028, 0.03, 0.032, 0.022, -0.008], [1.81, 0.008, 0.008, 0.01, 0.036, -0.01]], K.w.head, { n: 24, capLast: true });
    K.shell('band', [[1.604, 0.097, 0.115, 0.113], [1.576, 0.098, 0.116, 0.114]], K.w.head, { n: 26 });
  },
};
