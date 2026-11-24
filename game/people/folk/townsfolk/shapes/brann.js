// Brann, the storekeeper: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Brann, the storekeeper",
  height: 1,
  build: [1.16, 1.12],
  head: [0.96, 1, 0.96],
  skin: '#c89878',
  colors: { torso: '#8a8a7a', sleeve: '#8a8a7a', forearm: '#8a8a7a', legs: '#46403a', boots: { color: '#2a2019', rough: 0.5 }, soles: '#15100c' },
  parts: { shirt: { color: '#8a8a7a', rough: 0.95 }, jerkin: { color: '#5a4630', rough: 0.7 }, edge: { color: '#3e2e1e', rough: 0.6 }, belt: { color: '#2a1c12', rough: 0.45 }, buckle: { color: '#b0b0b4', metal: 1, rough: 0.35 }, book: { color: '#6a2e24', rough: 0.6 }, pages: '#e0d8c0', cap: { color: '#3a4a4a', rough: 1 }, hair: '#4a4038', beard: '#5a5048', cuff: { color: '#3e2e1e', rough: 0.6 }, keys: { color: '#8a8a8e', metal: 1, rough: 0.4 } },
  face(F) {
    F.lips('#8e5a4e', 0.5); F.brows('#4a4038', 0.9, 20); F.eyes('#4a4a3a', 0.6); F.lines(0.5); F.underEye(0.3); F.beard('#5a5048', 0.7, 'beard');
  },
  make(K) {
    K.shell('shirt', [[1.36, 0.069, 0.069, 0.073], [1.32, 0.148, 0.098, 0.1], [1.25, 0.147, 0.127, 0.104], [1.215, 0.147, 0.131, 0.106], [1.14, 0.141, 0.123, 0.104], [1.04, 0.141, 0.114, 0.106], [0.99, 0.152, 0.114, 0.113]], K.w.torso, { n: 26 });
    K.shell('jerkin', [[1.35, 0.11, 0.09, 0.096], [1.325, 0.164, 0.108, 0.11], [1.25, 0.158, 0.138, 0.114], [1.215, 0.156, 0.142, 0.116], [1.14, 0.15, 0.136, 0.114], [1.04, 0.15, 0.128, 0.116], [0.99, 0.162, 0.126, 0.123]], K.w.torso, { n: 28 });
    K.shell('jerkin', [[1.06, 0.154, 0.124, 0.12], [0.95, 0.178, 0.126, 0.134], [0.87, 0.194, 0.132, 0.146], [0.79, 0.204, 0.16, 0.174], [0.7, 0.212, 0.18, 0.192], [0.64, 0.216, 0.188, 0.2]], K.w.skirt, { n: 28 });
    K.shell('edge', [[0.67, 0.22, 0.192, 0.204], [0.64, 0.223, 0.195, 0.207]], K.w.skirt, { n: 28 });
    K.shell('edge', [[1.335, 0.16, 0.11, 0.112, 0.012, 0], [1.31, 0.176, 0.118, 0.118, 0.012, 0]], K.w.torso, { n: 26 });
    K.shell('belt', [[1.06, 0.165, 0.141, 0.132], [1.01, 0.172, 0.144, 0.137]], K.w.torso, { n: 28 });
    K.ball('buckle', [0, 1.035, 0.156], [0.028, 0.03, 0.008], K.w.torso);
    K.tube('book', [[-0.196, 1, 0.04], [-0.204, 0.86, 0.046]], [0.036, 0.036], K.w.bone('hips'));
    K.tube('pages', [[-0.198, 0.985, 0.078], [-0.206, 0.875, 0.084]], [0.012, 0.012], K.w.bone('hips'));
    K.tube('keys', [[0.19, 1, 0.06], [0.202, 0.9, 0.07]], [0.008, 0.016], K.w.bone('hips'));
    K.tube('cuff', [[0.252, 0.92, -0.008], [0.27, 0.855, -0.008]], [0.042, 0.037], K.w.bone('farmL'));
    K.tube('cuff', [[-0.252, 0.92, -0.008], [-0.27, 0.855, -0.008]], [0.042, 0.037], K.w.bone('farmR'));
    K.hair('hair', 'short', { underHat: true });
    K.panel('beard', [[1.458, 0.06, 0.097], [1.432, 0.058, 0.104], [1.406, 0.048, 0.106], [1.386, 0.032, 0.099], [1.374, 0.014, 0.09]], -66, 66, K.w.head, { n: 12 });
    K.shell('cap', [[1.588, 0.092, 0.11, 0.108], [1.63, 0.092, 0.11, 0.108], [1.656, 0.088, 0.104, 0.102], [1.664, 0.06, 0.072, 0.07], [1.666, 0.02, 0.024, 0.024]], K.w.head, { n: 26, capLast: true });
  },
};
