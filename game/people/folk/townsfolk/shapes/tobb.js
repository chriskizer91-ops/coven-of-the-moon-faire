// Tobb, the innkeeper: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Tobb, the innkeeper",
  height: 1.07,
  build: [1.3, 1.26],
  head: [0.9, 1, 0.9],
  skin: '#d6a688',
  colors: { torso: '#c8bea4', sleeve: '#c8bea4', forearm: 'skin', legs: '#4a3e34', boots: { color: '#2e221a', rough: 0.5 }, soles: '#17110d' },
  parts: { shirt: { color: '#c8bea4', rough: 0.95 }, roll: '#d2c8ae', vest: { color: '#5a4a2e', rough: 0.9 }, apron: { color: '#e0d8c4', rough: 0.95 }, tie: '#cfc6b0', hair: '#7a5a3a', towel: { color: '#b8c0c4', rough: 0.95, pattern: { kind: 'hoops', color: '#7a8a9a', n: 3 } }, breeches: { color: '#4a3e34', rough: 0.95 }, button: { color: '#a8904a', metal: 1, rough: 0.4 } },
  face(F) {
    F.lips('#a8685c', 0.45); F.brows('#6a4a2e', 0.85, 20); F.eyes('#5a4a34', 0.6); F.lines(0.45); F.underEye(0.25); F.blush('#cc6a54', 0.36); F.beard('#7a5a3a', 0.45, 'stubble');
  },
  make(K) {
    K.shell('shirt', [[1.345, 0.064, 0.064, 0.068], [1.325, 0.146, 0.092, 0.1], [1.215, 0.148, 0.13, 0.108], [1.14, 0.144, 0.152, 0.106], [1.04, 0.152, 0.168, 0.106], [0.96, 0.162, 0.152, 0.118], [0.92, 0.168, 0.138, 0.124]], K.w.torso, { n: 28 });
    K.panel('vest', [[1.335, 0.126, 0.098, 0.104], [1.3, 0.156, 0.108, 0.108], [1.215, 0.156, 0.14, 0.116], [1.14, 0.152, 0.16, 0.114], [1.05, 0.158, 0.172, 0.114], [1, 0.166, 0.164, 0.122]], 28, 332, K.w.torso, { n: 26 });
    K.ball('button', [0.066, 1.13, 0.158], [0.01, 0.01, 0.006], K.w.torso);
    K.ball('button', [0.07, 1.06, 0.166], [0.01, 0.01, 0.006], K.w.torso);
    K.shell('breeches', [[0.99, 0.174, 0.164, 0.128], [0.93, 0.182, 0.156, 0.136], [0.87, 0.192, 0.144, 0.142], [0.8, 0.196, 0.132, 0.14], [0.74, 0.19, 0.122, 0.132]], K.w.skirt, { n: 28 });
    K.shell('tie', [[1.012, 0.18, 0.18, 0.134], [0.972, 0.186, 0.176, 0.142]], K.w.torso, { n: 28 });
    K.panel('apron', [[0.985, 0.196, 0.19], [0.9, 0.206, 0.18], [0.8, 0.214, 0.182], [0.66, 0.228, 0.2], [0.5, 0.24, 0.216], [0.36, 0.25, 0.228]], -64, 64, K.w.skirt, { n: 22 });
    K.ball('tie', [0, 0.988, -0.16], [0.034, 0.018, 0.012], K.w.bone('hips'));
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, 0.195, -0.008], [1.105, 0.068, 0.066, 0.066, 0.202, -0.008], [1.075, 0.062, 0.06, 0.06, 0.21, -0.008]], K.w.bone('uarmL'), { n: 16 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, -0.195, -0.008], [1.105, 0.068, 0.066, 0.066, -0.202, -0.008], [1.075, 0.062, 0.06, 0.06, -0.21, -0.008]], K.w.bone('uarmR'), { n: 16 });
    K.panel('towel', [[1.2, 0.164, 0.15, 0.12], [1.27, 0.162, 0.134, 0.12], [1.325, 0.154, 0.108, 0.12]], 20, 52, K.w.torso, { n: 6 });
    K.panel('towel', [[1.332, 0.15, 0.11, 0.112], [1.3, 0.158, 0.11, 0.116], [1.24, 0.16, 0.11, 0.122]], 128, 160, K.w.torso, { n: 6 });
    K.tube('towel', [[0.094, 1.334, 0.07], [0.1, 1.348, 0], [0.094, 1.34, -0.066]], [0.03, 0.03, 0.03], K.w.torso);
    K.hair('hair', 'short');
  },
};
