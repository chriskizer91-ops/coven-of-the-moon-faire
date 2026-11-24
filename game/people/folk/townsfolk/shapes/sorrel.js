// Sorrel, the herb-seller: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Sorrel, the herb-seller",
  height: 0.99,
  build: [0.98, 0.98],
  head: [1, 1, 1],
  skin: '#d0a898',
  colors: { torso: '#7a4a4e', sleeve: '#7a4a4e', forearm: '#7a4a4e', legs: '#4a3e42', boots: { color: '#4a3a30', rough: 0.8 }, soles: '#1c1612' },
  parts: { jacket: { color: '#7a4a4e', rough: 1 }, fur: { color: '#d8d0c0', rough: 1 }, skirt: { color: '#5a6066', rough: 1 }, band: { color: '#8a8e94', rough: 0.95 }, apron: { color: '#d8d4c8', rough: 0.95 }, scarf: { color: '#c8c0a8', rough: 1, pattern: { kind: 'check', color: '#a89a80', n: 7 } }, pouch: { color: '#6a4c34', rough: 0.7 }, sprig: '#e4e4dc', belt: { color: '#3a2a20', rough: 0.5 }, mitt: { color: '#8a8e94', rough: 1 }, bootfur: { color: '#d8d0c0', rough: 1 } },
  face(F) {
    F.lips('#a8626a', 0.55); F.brows('#7a4428', 0.75, 13); F.eyes('#6a7a8a', 0.6); F.lines(0.2); F.underEye(0.4); F.blush('#d0685c', 0.3); F.pale(0.12); F.freckles(30, '#a8684a', 0.3);
  },
  make(K) {
    K.shell('skirt', [[1.05, 0.118, 0.094, 0.094], [0.98, 0.152, 0.127, 0.132], [0.86, 0.184, 0.158, 0.168], [0.6, 0.222, 0.196, 0.21], [0.36, 0.25, 0.222, 0.238], [0.22, 0.262, 0.232, 0.25]], K.w.skirt, { n: 30 });
    K.shell('band', [[0.32, 0.258, 0.23, 0.246], [0.26, 0.264, 0.236, 0.252]], K.w.skirt, { n: 30 });
    K.shell('jacket', [[1.352, 0.067, 0.069, 0.072], [1.325, 0.154, 0.097, 0.105], [1.27, 0.154, 0.132, 0.109], [1.215, 0.152, 0.14, 0.111], [1.14, 0.139, 0.121, 0.105], [1.04, 0.125, 0.102, 0.1], [0.985, 0.158, 0.117, 0.121]], K.w.torso, { n: 28 });
    K.shell('jacket', [[1.04, 0.13, 0.106, 0.104], [0.98, 0.16, 0.136, 0.14], [0.92, 0.18, 0.152, 0.158], [0.88, 0.19, 0.16, 0.168]], K.w.skirt, { n: 28 });
    K.shell('fur', [[0.905, 0.192, 0.164, 0.17], [0.87, 0.198, 0.17, 0.178]], K.w.skirt, { n: 28 });
    K.shell('fur', [[1.385, 0.076, 0.078, 0.082], [1.355, 0.112, 0.1, 0.104], [1.33, 0.15, 0.112, 0.114]], K.w.torso, { n: 24 });
    K.panel('apron', [[0.9, 0.2, 0.176], [0.8, 0.208, 0.186], [0.66, 0.224, 0.2], [0.54, 0.236, 0.212]], -34, 34, K.w.skirt, { n: 10 });
    K.shell('belt', [[1.075, 0.132, 0.11, 0.106], [1.04, 0.138, 0.114, 0.11]], K.w.torso, { n: 26 });
    K.ball('pouch', [0.15, 0.99, 0.1], [0.04, 0.05, 0.03], K.w.bone('hips'));
    K.ball('pouch', [-0.16, 0.98, 0.086], [0.034, 0.044, 0.028], K.w.bone('hips'));
    K.tube('sprig', [[0.15, 1.03, 0.11], [0.16, 1.085, 0.126]], [0.014, 0.005], K.w.bone('hips'));
    K.tube('mitt', [[0.252, 0.92, -0.008], [0.272, 0.846, -0.008], [0.282, 0.8, -0.004]], [0.04, 0.034, 0.036], K.w.bone('farmL'));
    K.tube('mitt', [[-0.252, 0.92, -0.008], [-0.272, 0.846, -0.008], [-0.282, 0.8, -0.004]], [0.04, 0.034, 0.036], K.w.bone('farmR'));
    K.tube('bootfur', [[0.085, 0.33, 0], [0.085, 0.285, 0.004]], [0.058, 0.062], K.w.bone('shinL'));
    K.tube('bootfur', [[-0.085, 0.33, 0], [-0.085, 0.285, 0.004]], [0.058, 0.062], K.w.bone('shinR'));
    K.shell('scarf', [[1.676, 0.014, 0.016, 0.016, 0, -0.004], [1.662, 0.054, 0.064, 0.066, 0, -0.004], [1.635, 0.086, 0.104, 0.1], [1.606, 0.096, 0.114, 0.11]], K.w.head, { n: 24 });
    K.panel('scarf', [[1.606, 0.096, 0.114, 0.11], [1.56, 0.1, 0.112, 0.114], [1.49, 0.098, 0.1, 0.112], [1.43, 0.088, 0.09, 0.104], [1.4, 0.08, 0.088, 0.096]], 58, 302, K.w.head, { n: 22 });
    K.panel('scarf', [[1.43, 0.086, 0.092, 0.1], [1.405, 0.078, 0.11, 0.1], [1.385, 0.066, 0.104, 0.1]], -60, 60, K.w.head, { n: 10 });
    K.ball('scarf', [0, 1.375, 0.092], [0.026, 0.022, 0.016], K.w.torso);
    K.panel('scarf', [[1.41, 0.082, 0.09, 0.098], [1.34, 0.07, 0.09, 0.112], [1.27, 0.03, 0.09, 0.116]], 130, 230, K.w.hair, { n: 8 });
  },
};
