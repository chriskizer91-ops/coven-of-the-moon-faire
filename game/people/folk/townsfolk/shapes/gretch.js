// Mayor Gretch: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Mayor Gretch",
  height: 0.99,
  build: [1.24, 1.22],
  head: [0.92, 1, 0.92],
  skin: '#d2a288',
  colors: { torso: '#5a2e34', sleeve: '#5a2e34', forearm: '#5a2e34', legs: '#3a3432', boots: { color: '#241c18', rough: 0.45 }, soles: '#14100e' },
  parts: { coat: { color: '#5a2e34', rough: 0.9 }, facing: { color: '#3e1e24', rough: 0.9 }, vest: { color: '#b89a5a', rough: 0.85 }, fur: { color: '#6a5a48', rough: 1 }, chain: { color: '#c0a040', metal: 1, rough: 0.35 }, cuff: '#3e1e24', hair: '#b8b2aa', collar: '#e0d8c8', cap: { color: '#3e1e24', rough: 0.9 }, band: { color: '#b89a5a', rough: 0.8 } },
  face(F) {
    F.lips('#a06a60', 0.45); F.brows('#b8b2aa', 0.85, 18); F.eyes('#5a5a6a', 0.6); F.lines(0.7); F.underEye(0.45); F.blush('#c8705c', 0.25); F.beard('#b8b2aa', 0.5, 'stubble');
  },
  make(K) {
    K.shell('vest', [[1.33, 0.12, 0.098, 0.102], [1.29, 0.15, 0.116, 0.106], [1.26, 0.152, 0.132, 0.107], [1.235, 0.153, 0.147, 0.108], [1.215, 0.153, 0.15, 0.108], [1.14, 0.148, 0.152, 0.106], [1.04, 0.15, 0.16, 0.108], [0.96, 0.158, 0.146, 0.116], [0.9, 0.166, 0.13, 0.124]], K.w.torso, { n: 28 });
    K.panel('coat', [[1.36, 0.074, 0.074, 0.078], [1.325, 0.158, 0.108, 0.112], [1.29, 0.162, 0.126, 0.114], [1.26, 0.163, 0.142, 0.115], [1.235, 0.164, 0.157, 0.116], [1.215, 0.164, 0.16, 0.116], [1.14, 0.158, 0.162, 0.114], [1.04, 0.16, 0.17, 0.116], [0.99, 0.166, 0.16, 0.122]], 24, 336, K.w.torso, { n: 26 });
    K.panel('coat', [[1.06, 0.164, 0.17, 0.118], [0.95, 0.18, 0.158, 0.13], [0.87, 0.194, 0.15, 0.142], [0.79, 0.204, 0.16, 0.17], [0.65, 0.218, 0.19, 0.204], [0.52, 0.23, 0.204, 0.217], [0.42, 0.238, 0.21, 0.225]], 20, 340, K.w.skirt, { n: 28 });
    K.panel('facing', [[0.52, 0.24, 0.214, 0.227], [0.42, 0.248, 0.22, 0.235]], 20, 340, K.w.skirt, { n: 28 });
    K.shell('fur', [[1.385, 0.07, 0.07, 0.076], [1.36, 0.1, 0.09, 0.098], [1.335, 0.15, 0.112, 0.116], [1.31, 0.172, 0.126, 0.124]], K.w.torso, { n: 26 });
    K.tube('chain', [[0.112, 1.33, 0.112], [0.086, 1.27, 0.136], [0.046, 1.2, 0.162], [0, 1.165, 0.168]], [0.009, 0.009, 0.009, 0.009], K.w.torso);
    K.tube('chain', [[-0.112, 1.33, 0.112], [-0.086, 1.27, 0.136], [-0.046, 1.2, 0.162], [0, 1.165, 0.168]], [0.009, 0.009, 0.009, 0.009], K.w.torso);
    K.ball('chain', [0, 1.14, 0.168], [0.03, 0.034, 0.01], K.w.torso);
    K.tube('cuff', [[0.249, 0.93, -0.008], [0.27, 0.855, -0.008]], [0.044, 0.039], K.w.bone('farmL'));
    K.tube('cuff', [[-0.249, 0.93, -0.008], [-0.27, 0.855, -0.008]], [0.044, 0.039], K.w.bone('farmR'));
    K.hair('hair', 'short', { underHat: true });
    K.shell('cap', [[1.584, 0.094, 0.112, 0.11], [1.606, 0.108, 0.126, 0.124], [1.632, 0.126, 0.142, 0.146], [1.654, 0.114, 0.126, 0.136], [1.668, 0.066, 0.074, 0.084], [1.672, 0.02, 0.022, 0.026]], K.w.head, { n: 26, capLast: true });
    K.shell('band', [[1.604, 0.097, 0.115, 0.113], [1.58, 0.098, 0.116, 0.114]], K.w.head, { n: 26 });
  },
};
