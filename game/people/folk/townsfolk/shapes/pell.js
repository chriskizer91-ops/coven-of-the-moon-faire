// Pell, the child: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Pell, the child",
  height: 0.72,
  build: [0.96, 0.96],
  head: [1.2, 1.16, 1.2],
  skin: '#d8a890',
  colors: { torso: '#b8a47c', sleeve: '#b8a47c', forearm: 'skin', legs: '#6a5a4a', boots: '#3a2c22', soles: '#1c1612' },
  parts: { smock: { color: '#6a8a8a', rough: 0.95 }, yoke: '#b8a47c', patch: '#a8643c', hair: '#8a5a34', ribbon: '#a83a2e', sash: '#4a5a5a', hem: '#587676' },
  face(F) {
    F.lips('#c07a70', 0.4); F.brows('#7a4e2c', 0.6, 12); F.eyes('#5a7a4a', 0.6); F.blush('#d87a68', 0.3); F.freckles(40, '#a86a4a', 0.4);
  },
  make(K) {
    K.shell('smock', [[1.345, 0.066, 0.066, 0.07], [1.32, 0.148, 0.098, 0.1], [1.26, 0.15, 0.13, 0.106], [1.215, 0.15, 0.136, 0.11], [1.1, 0.15, 0.13, 0.112], [1, 0.16, 0.128, 0.12]], K.w.torso, { n: 26 });
    K.shell('smock', [[1.04, 0.158, 0.13, 0.12], [0.92, 0.186, 0.148, 0.15], [0.8, 0.208, 0.174, 0.182], [0.66, 0.226, 0.198, 0.208], [0.54, 0.238, 0.21, 0.222]], K.w.skirt, { n: 28 });
    K.shell('hem', [[0.585, 0.24, 0.212, 0.224], [0.54, 0.246, 0.218, 0.23]], K.w.skirt, { n: 28 });
    K.shell('yoke', [[1.372, 0.066, 0.068, 0.07], [1.345, 0.118, 0.1, 0.1], [1.318, 0.166, 0.116, 0.114], [1.29, 0.17, 0.132, 0.116]], K.w.torso, { n: 24 });
    K.shell('sash', [[1.085, 0.158, 0.138, 0.12], [1.045, 0.164, 0.138, 0.126]], K.w.torso, { n: 26 });
    K.panel('patch', [[0.8, 0.216, 0.182], [0.7, 0.228, 0.198]], 16, 44, K.w.skirt, { n: 5 });
    K.hair('hair', 'short');
    K.tube('hair', [[0.07, 1.5, -0.05], [0.098, 1.43, -0.04], [0.106, 1.37, -0.03]], [0.022, 0.02, 0.014], K.w.hair);
    K.tube('hair', [[-0.07, 1.5, -0.05], [-0.098, 1.43, -0.04], [-0.106, 1.37, -0.03]], [0.022, 0.02, 0.014], K.w.hair);
    K.ball('ribbon', [0.104, 1.385, -0.032], [0.022, 0.014, 0.02], K.w.hair);
    K.ball('ribbon', [-0.104, 1.385, -0.032], [0.022, 0.014, 0.02], K.w.hair);
  },
};
