// The roadwarden: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "The roadwarden",
  height: 1.02,
  build: [1.08, 1.04],
  head: [0.98, 1, 0.98],
  skin: '#b07a5a',
  colors: { torso: '#6a5a44', sleeve: '#6a5a44', forearm: '#4a3a2a', legs: '#4a4238', boots: { color: '#2e241c', rough: 0.55 }, soles: '#17110d' },
  parts: { tunic: { color: '#6a5a44', rough: 0.95 }, tabard: { color: '#9a4a2a', rough: 0.95 }, trim: '#c8a45a', cloak: { color: '#5a4a3e', rough: 1 }, clasp: { color: '#b0903a', metal: 1, rough: 0.4 }, belt: { color: '#2e2018', rough: 0.5 }, buckle: { color: '#a8a8ac', metal: 1, rough: 0.4 }, bracer: { color: '#3a2a1c', rough: 0.55 }, hair: '#c8c4bc', beard: '#d0ccc4', wrap: '#7a6a54' },
  face(F) {
    F.lips('#8a5a4c', 0.5); F.brows('#c8c4bc', 0.85, 17); F.eyes('#6a5a3a', 0.6); F.lines(0.85); F.underEye(0.4); F.beard('#d0ccc4', 0.7, 'beard');
  },
  make(K) {
    K.shell('tunic', [[1.36, 0.07, 0.07, 0.074], [1.325, 0.15, 0.1, 0.106], [1.29, 0.152, 0.116, 0.108], [1.26, 0.153, 0.132, 0.108], [1.235, 0.154, 0.147, 0.108], [1.215, 0.154, 0.15, 0.108], [1.185, 0.152, 0.143, 0.107], [1.14, 0.144, 0.128, 0.106], [1.04, 0.142, 0.116, 0.108], [0.99, 0.154, 0.116, 0.115]], K.w.torso, { n: 28 });
    K.shell('tunic', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.122, 0.138], [0.79, 0.196, 0.152, 0.168], [0.65, 0.212, 0.186, 0.202], [0.52, 0.226, 0.2, 0.215]], K.w.skirt, { n: 28 });
    K.panel('tabard', [[1.33, 0.149, 0.106, 0.111], [1.325, 0.16, 0.11, 0.116], [1.29, 0.162, 0.126, 0.118], [1.26, 0.163, 0.142, 0.118], [1.235, 0.164, 0.157, 0.118], [1.215, 0.164, 0.16, 0.118], [1.185, 0.162, 0.153, 0.117], [1.14, 0.154, 0.138, 0.116], [1.04, 0.152, 0.126, 0.118], [0.99, 0.164, 0.126, 0.125]], -32, 32, K.w.torso, { n: 12 });
    K.panel('tabard', [[1.06, 0.15, 0.126], [0.95, 0.176, 0.128], [0.87, 0.194, 0.134], [0.79, 0.204, 0.164], [0.68, 0.216, 0.19], [0.6, 0.224, 0.202]], -34, 34, K.w.skirt, { n: 12 });
    K.panel('trim', [[0.63, 0.23, 0.208], [0.6, 0.233, 0.211]], -34, 34, K.w.skirt, { n: 12 });
    K.shell('belt', [[1.063, 0.156, 0.136, 0.128], [1.018, 0.162, 0.139, 0.132]], K.w.torso, { n: 28 });
    K.ball('buckle', [0, 1.04, 0.146], [0.024, 0.026, 0.008], K.w.torso);
    K.shell('cloak', [[1.385, 0.074, 0.074, 0.08], [1.355, 0.118, 0.096, 0.106], [1.33, 0.164, 0.116, 0.12], [1.3, 0.18, 0.136, 0.126]], K.w.torso, { n: 26 });
    K.panel('cloak', [[1.31, 0.176, 0.12, 0.126], [1.2, 0.196, 0.12, 0.142], [1.08, 0.21, 0.12, 0.156], [1, 0.218, 0.12, 0.164]], 124, 236, K.w.torso, { n: 14 });
    K.panel('cloak', [[1.03, 0.216, 0.12, 0.162], [0.9, 0.228, 0.12, 0.18], [0.76, 0.238, 0.12, 0.202], [0.62, 0.246, 0.12, 0.222]], 124, 236, K.w.skirt, { n: 14 });
    K.ball('clasp', [0.118, 1.318, 0.098], [0.022, 0.022, 0.01], K.w.torso);
    K.tube('bracer', [[0.236, 0.98, -0.008], [0.262, 0.885, -0.008]], [0.041, 0.033], K.w.bone('farmL'));
    K.tube('bracer', [[-0.236, 0.98, -0.008], [-0.262, 0.885, -0.008]], [0.041, 0.033], K.w.bone('farmR'));
    K.tube('wrap', [[-0.268, 0.86, -0.008], [-0.278, 0.815, -0.006]], [0.031, 0.034], K.w.bone('handR'));
    K.hair('hair', 'short');
    K.panel('beard', [[1.458, 0.06, 0.097], [1.432, 0.058, 0.104], [1.406, 0.048, 0.106], [1.386, 0.032, 0.099], [1.374, 0.014, 0.09]], -66, 66, K.w.head, { n: 12 });
  },
};
