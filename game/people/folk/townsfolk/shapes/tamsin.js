// Tamsin, the child: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Tamsin, the child",
  height: 0.76,
  build: [0.95, 0.95],
  head: [1.18, 1.15, 1.18],
  skin: '#c89474',
  colors: { torso: '#8a6a4a', sleeve: '#8a6a4a', forearm: '#8a6a4a', legs: '#5a5046', boots: '#3a2c20', soles: '#1c1510' },
  parts: { tunic: { color: '#8a6a4a', rough: 0.95 }, cloak: { color: '#9a4a2a', rough: 1 }, hemfold: '#7e3a20', clasp: { color: '#b0903a', metal: 1, rough: 0.4 }, belt: { color: '#2e2018', rough: 0.5 }, buckle: { color: '#a8a8ac', metal: 1, rough: 0.4 }, tail: { color: '#2e2018', rough: 0.5 }, hair: '#3a2a1e', tie: '#c8a45a' },
  face(F) {
    F.lips('#b8706a', 0.4); F.brows('#3a2a1e', 0.8, 15); F.eyes('#4a3a2a', 0.65); F.blush('#d07060', 0.28); F.freckles(24, '#8a5a3a', 0.35);
  },
  make(K) {
    K.shell('tunic', [[1.345, 0.066, 0.066, 0.07], [1.32, 0.15, 0.1, 0.104], [1.29, 0.152, 0.116, 0.106], [1.26, 0.153, 0.132, 0.108], [1.235, 0.154, 0.147, 0.109], [1.215, 0.154, 0.15, 0.109], [1.1, 0.146, 0.13, 0.108], [1, 0.156, 0.124, 0.118]], K.w.torso, { n: 26 });
    K.shell('tunic', [[1.04, 0.154, 0.126, 0.118], [0.92, 0.18, 0.136, 0.142], [0.8, 0.198, 0.152, 0.164], [0.7, 0.208, 0.172, 0.184]], K.w.skirt, { n: 28 });
    K.shell('belt', [[1.085, 0.154, 0.138, 0.118], [1.03, 0.164, 0.136, 0.126]], K.w.torso, { n: 26 });
    K.ball('buckle', [0, 1.058, 0.144], [0.03, 0.032, 0.008], K.w.torso);
    K.tube('tail', [[0.04, 1.045, 0.144], [0.062, 0.94, 0.15], [0.07, 0.84, 0.166]], [0.014, 0.014, 0.012], K.w.bone('hips'));
    K.shell('cloak', [[1.385, 0.072, 0.072, 0.078], [1.355, 0.118, 0.094, 0.104], [1.33, 0.166, 0.114, 0.118], [1.29, 0.184, 0.132, 0.124]], K.w.torso, { n: 26 });
    K.panel('cloak', [[1.3, 0.18, 0.12, 0.126], [1.2, 0.2, 0.12, 0.144], [1.08, 0.214, 0.12, 0.158], [1, 0.222, 0.12, 0.166]], 122, 238, K.w.torso, { n: 14 });
    K.panel('cloak', [[1.03, 0.22, 0.12, 0.164], [0.86, 0.236, 0.12, 0.19], [0.66, 0.252, 0.12, 0.222], [0.44, 0.266, 0.12, 0.246], [0.26, 0.274, 0.12, 0.258]], 122, 238, K.w.skirt, { n: 14 });
    K.panel('hemfold', [[0.31, 0.28, 0.12, 0.264], [0.26, 0.282, 0.12, 0.266]], 122, 238, K.w.skirt, { n: 14 });
    K.ball('clasp', [0, 1.335, 0.116], [0.026, 0.026, 0.01], K.w.torso);
    K.hair('hair', 'topknot');
    K.shell('tie', [[1.668, 0.03, 0.03, 0.03, 0, -0.015], [1.654, 0.034, 0.034, 0.034, 0, -0.015]], K.w.head, { n: 12 });
  },
};
