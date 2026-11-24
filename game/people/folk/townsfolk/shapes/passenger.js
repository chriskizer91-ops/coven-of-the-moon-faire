// The last passenger: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "The last passenger",
  height: 1,
  build: [0.98, 0.97],
  head: [1, 1, 1],
  skin: '#d2a892',
  colors: { torso: '#6a5a6a', sleeve: '#6a5a6a', forearm: '#6a5a6a', legs: '#3e3a40', boots: { color: '#2e2622', rough: 0.55 }, soles: '#161210' },
  parts: { dress: { color: '#6a5a6a', rough: 0.95 }, cloak: { color: '#4a5a5e', rough: 1 }, hood: { color: '#4a5a5e', rough: 1 }, lining: '#8a8a7a', scarf: { color: '#b8a070', rough: 1, pattern: { kind: 'hoops', color: '#8a7448', n: 5 } }, hair: '#6a4a34', strap: { color: '#4a3424', rough: 0.6 }, bag: { color: '#6a4c30', rough: 0.7 }, flap: { color: '#523822', rough: 0.6 }, buckle: { color: '#a8904a', metal: 1, rough: 0.4 }, clasp: { color: '#a8904a', metal: 1, rough: 0.4 }, cuff: '#574a57' },
  face(F) {
    F.lips('#a8686a', 0.55); F.brows('#5a3e2c', 0.75, 13); F.eyes('#6a6a5a', 0.6); F.lines(0.3); F.underEye(0.4); F.blush('#c87a6a', 0.14);
  },
  make(K) {
    K.shell('dress', [[1.352, 0.064, 0.064, 0.068], [1.325, 0.148, 0.092, 0.104], [1.29, 0.152, 0.112, 0.107], [1.26, 0.153, 0.13, 0.107], [1.235, 0.153, 0.146, 0.106], [1.215, 0.153, 0.15, 0.105], [1.185, 0.148, 0.141, 0.102], [1.14, 0.134, 0.114, 0.099], [1.04, 0.119, 0.094, 0.094], [0.985, 0.15, 0.108, 0.114]], K.w.torso, { n: 28 });
    K.shell('dress', [[1.05, 0.11, 0.088, 0.088], [0.98, 0.142, 0.12, 0.125], [0.86, 0.176, 0.154, 0.163], [0.6, 0.218, 0.192, 0.206], [0.34, 0.252, 0.221, 0.235], [0.16, 0.271, 0.235, 0.252]], K.w.skirt, { n: 30 });
    K.shell('cloak', [[1.37, 0.09, 0.086, 0.094], [1.34, 0.14, 0.104, 0.112], [1.31, 0.182, 0.118, 0.122], [1.27, 0.196, 0.14, 0.128]], K.w.torso, { n: 26 });
    K.panel('cloak', [[1.28, 0.192, 0.12, 0.128], [1.18, 0.206, 0.12, 0.146], [1.08, 0.216, 0.12, 0.16], [1, 0.224, 0.12, 0.168]], 122, 238, K.w.torso, { n: 14 });
    K.panel('cloak', [[1.03, 0.222, 0.12, 0.166], [0.86, 0.24, 0.12, 0.196], [0.64, 0.262, 0.12, 0.232], [0.44, 0.28, 0.12, 0.256], [0.3, 0.29, 0.12, 0.268]], 122, 238, K.w.skirt, { n: 14 });
    K.panel('hood', [[1.4, 0.09, 0.08, 0.104], [1.36, 0.112, 0.08, 0.14], [1.31, 0.108, 0.08, 0.158], [1.26, 0.08, 0.08, 0.15], [1.235, 0.04, 0.08, 0.136]], 100, 260, K.w.torso, { n: 14 });
    K.shell('scarf', [[1.412, 0.064, 0.068, 0.066], [1.385, 0.084, 0.09, 0.086], [1.36, 0.098, 0.098, 0.094], [1.342, 0.09, 0.094, 0.09]], K.w.torso, { n: 22 });
    K.tube('scarf', [[-0.05, 1.35, 0.104], [-0.064, 1.24, 0.158], [-0.07, 1.14, 0.126]], [0.024, 0.024, 0.02], K.w.torso);
    K.ball('clasp', [0, 1.318, 0.122], [0.018, 0.018, 0.008], K.w.torso);
    K.tube('strap', [[0.114, 1.335, 0.02], [0.1, 1.29, 0.122], [0, 1.16, 0.142], [-0.07, 1.09, 0.106], [-0.125, 1.02, 0.06], [-0.176, 0.97, 0.03]], [0.012, 0.012, 0.012, 0.012, 0.012, 0.012], K.w.torso);
    K.ball('bag', [-0.222, 0.86, 0.02], [0.052, 0.09, 0.104], K.w.bone('hips'));
    K.ball('flap', [-0.236, 0.9, 0.02], [0.046, 0.056, 0.108], K.w.bone('hips'));
    K.ball('buckle', [-0.282, 0.87, 0.02], [0.008, 0.018, 0.018], K.w.bone('hips'));
    K.tube('cuff', [[0.257, 0.9, -0.008], [0.27, 0.855, -0.008]], [0.038, 0.033], K.w.bone('farmL'));
    K.tube('cuff', [[-0.257, 0.9, -0.008], [-0.27, 0.855, -0.008]], [0.038, 0.033], K.w.bone('farmR'));
    K.hair('hair', 'short');
    K.tube('hair', [[0, 1.5, -0.094], [0.03, 1.42, -0.118], [0.06, 1.33, -0.168], [0.07, 1.2, -0.176], [0.066, 1.08, -0.172]], [0.03, 0.028, 0.026, 0.024, 0.016], K.w.hair);
  },
};
