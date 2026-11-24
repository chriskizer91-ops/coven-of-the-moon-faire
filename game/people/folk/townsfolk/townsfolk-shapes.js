// townsfolk-shapes.js: the townsfolk's shapes in one file a page can load. MADE BY tools/townsfolk-pack.py from
// game/people/folk/townsfolk/shapes/*.js and townsfolk.json: change those, not this. A PROPOSAL (see townsfolk.json).
// Only game/pages/townsfolk-lineup.html loads it (the size sheet). No zone page does: wiring comes after the paint.
window.COVEN_TOWNSFOLK = { order: ["nettie", "wenna", "marta", "roadwarden", "ysmera", "watch", "warden", "gretch", "hilde", "quill", "tobb", "pell", "brann", "tamsin", "carter", "gil", "tock", "pim", "passenger", "cutter", "passkeeper", "sorrel", "ede"], people: {
  "nettie": { name: "Nettie", zone: 1, heightM: 1.55, person: function () {
// Nettie, the herb-seller: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Nettie, the herb-seller",
  height: 0.94,
  build: [1.14, 1.12],
  head: [0.98, 1, 0.98],
  skin: '#c99378',
  colors: { torso: '#6b7a4a', sleeve: '#6b7a4a', forearm: 'skin', legs: '#5a4a3a', boots: '#3a2a20', soles: '#241a14' },
  parts: { dress: { color: '#6b7a4a', rough: 0.95 }, skirt: { color: '#7a5a3c', rough: 0.95 }, apron: { color: '#d8ccb0', rough: 0.95 }, pocket: '#bfae8c', shawl: { color: '#a8643c', rough: 0.95, pattern: { kind: 'check', color: '#8a4a2a', n: 6 } }, roll: '#7c8a58', hat: { color: '#d2b06a', rough: 0.9 }, band: '#5a6a3a', hair: '#9a948c', sprig: '#5f7a3c' },
  face(F) {
    F.lips('#a8665c', 0.6); F.brows('#8a847c', 0.7, 14); F.eyes('#5a6a4a', 0.6); F.lines(0.6); F.underEye(0.2); F.blush('#c86a58', 0.3);
  },
  make(K) {
    K.shell('dress', [[1.352, 0.065, 0.066, 0.07], [1.325, 0.151, 0.095, 0.107], [1.29, 0.155, 0.115, 0.11], [1.26, 0.156, 0.134, 0.11], [1.235, 0.156, 0.15, 0.109], [1.215, 0.156, 0.154, 0.108], [1.185, 0.151, 0.145, 0.105], [1.14, 0.137, 0.117, 0.102], [1.04, 0.121, 0.097, 0.097], [0.985, 0.153, 0.111, 0.117]], K.w.torso, { n: 28 });
    K.shell('skirt', [[1.05, 0.116, 0.092, 0.092], [0.98, 0.15, 0.125, 0.13], [0.86, 0.185, 0.16, 0.17], [0.6, 0.23, 0.2, 0.215], [0.34, 0.265, 0.23, 0.245], [0.16, 0.285, 0.245, 0.262]], K.w.skirt, { n: 30 });
    K.panel('apron', [[1.27, 0.14, 0.15], [1.235, 0.16, 0.164], [1.215, 0.162, 0.166], [1.185, 0.158, 0.156], [1.14, 0.146, 0.134], [1.045, 0.132, 0.114]], -38, 38, K.w.torso, { n: 14 });
    K.panel('apron', [[1.04, 0.133, 0.109, 0.109], [0.98, 0.162, 0.137, 0.142], [0.86, 0.197, 0.172, 0.182], [0.6, 0.242, 0.212, 0.227], [0.36, 0.274, 0.24, 0.255]], -56, 56, K.w.skirt, { n: 18 });
    K.panel('pocket', [[0.86, 0.207, 0.182, 0.192], [0.7, 0.235, 0.207, 0.22]], 14, 44, K.w.skirt, { n: 6 });
    K.panel('pocket', [[0.86, 0.207, 0.182, 0.192], [0.7, 0.235, 0.207, 0.22]], -44, -14, K.w.skirt, { n: 6 });
    K.shell('apron', [[1.063, 0.15, 0.126, 0.118], [1.027, 0.156, 0.129, 0.122]], K.w.torso, { n: 28 });
    K.shell('shawl', [[1.375, 0.072, 0.072, 0.078], [1.345, 0.126, 0.102, 0.108], [1.315, 0.178, 0.124, 0.118], [1.275, 0.198, 0.16, 0.124], [1.24, 0.206, 0.176, 0.128]], K.w.torso, { n: 28 });
    K.panel('shawl', [[1.24, 0.2, 0.12, 0.128], [1.16, 0.15, 0.12, 0.122], [1.08, 0.085, 0.12, 0.118], [1.03, 0.02, 0.12, 0.116]], 100, 260, K.w.torso, { n: 12 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, 0.195, -0.008], [1.105, 0.068, 0.066, 0.066, 0.202, -0.008], [1.075, 0.062, 0.06, 0.06, 0.21, -0.008]], K.w.bone('uarmL'), { n: 16 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, -0.195, -0.008], [1.105, 0.068, 0.066, 0.066, -0.202, -0.008], [1.075, 0.062, 0.06, 0.06, -0.21, -0.008]], K.w.bone('uarmR'), { n: 16 });
    K.hair('hair', 'bun', { underHat: true });
    K.shell('hat', [[1.578, 0.094, 0.112, 0.11], [1.62, 0.093, 0.111, 0.109], [1.652, 0.084, 0.1, 0.098], [1.668, 0.06, 0.072, 0.07], [1.674, 0.02, 0.024, 0.024]], K.w.head, { n: 26, capLast: true });
    K.shell('hat', [[1.592, 0.1, 0.118, 0.116], [1.586, 0.14, 0.158, 0.154], [1.572, 0.178, 0.196, 0.19]], K.w.head, { n: 28 });
    K.shell('band', [[1.618, 0.097, 0.115, 0.113], [1.594, 0.099, 0.117, 0.115]], K.w.head, { n: 26 });
    K.tube('sprig', [[0.085, 1.6, 0.075], [0.105, 1.645, 0.07], [0.112, 1.69, 0.06]], [0.01, 0.012, 0.004], K.w.head);
  },
};
    return PERSON; } },
  "wenna": { name: "Old Wenna", zone: 1, heightM: 1.44, person: function () {
// Old Wenna, the herb-seller: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Old Wenna, the herb-seller",
  height: 0.87,
  build: [0.98, 1.02],
  head: [1.03, 0.99, 1.02],
  skin: '#b89a84',
  colors: { torso: '#4a4a52', sleeve: '#4a4a52', forearm: '#4a4a52', legs: '#3a3430', boots: '#2a2420', soles: '#161210' },
  parts: { gown: { color: '#4a4a52', rough: 0.95 }, shawl: { color: '#5a6a5a', rough: 1 }, fringe: '#465446', hood: { color: '#5a6a5a', rough: 1 }, apron: { color: '#8a7e68', rough: 0.95 }, cord: '#6a5a3a', herbs: '#5a6a3a' },
  face(F) {
    F.lips('#96706a', 0.5); F.brows('#d0ccc4', 0.6, 12); F.eyes('#7a8a8a', 0.5); F.lines(0.95); F.underEye(0.5); F.pale(0.15);
  },
  make(K) {
    K.shell('gown', [[1.352, 0.066, 0.067, 0.071], [1.325, 0.152, 0.096, 0.108], [1.29, 0.157, 0.116, 0.111], [1.26, 0.158, 0.135, 0.111], [1.235, 0.158, 0.152, 0.11], [1.215, 0.158, 0.156, 0.109], [1.185, 0.152, 0.147, 0.106], [1.14, 0.138, 0.119, 0.103], [1.04, 0.123, 0.098, 0.098], [0.985, 0.154, 0.112, 0.119]], K.w.torso, { n: 26 });
    K.shell('gown', [[1.05, 0.111, 0.089, 0.089], [0.98, 0.144, 0.121, 0.126], [0.86, 0.178, 0.155, 0.165], [0.6, 0.221, 0.194, 0.209], [0.34, 0.254, 0.223, 0.238], [0.16, 0.274, 0.238, 0.254]], K.w.skirt, { n: 30 });
    K.panel('apron', [[1.03, 0.133, 0.11, 0.112], [0.98, 0.156, 0.133, 0.138], [0.86, 0.19, 0.167, 0.177], [0.6, 0.233, 0.206, 0.221], [0.44, 0.253, 0.224, 0.238]], -50, 50, K.w.skirt, { n: 16 });
    K.shell('cord', [[1.06, 0.13, 0.11, 0.106], [1.03, 0.14, 0.12, 0.112]], K.w.torso, { n: 24 });
    K.tube('herbs', [[0.15, 1.03, 0.085], [0.166, 0.94, 0.1], [0.176, 0.86, 0.11]], [0.016, 0.028, 0.02], K.w.bone('hips'));
    K.tube('herbs', [[-0.136, 1.03, 0.098], [-0.15, 0.95, 0.114], [-0.158, 0.89, 0.124]], [0.014, 0.024, 0.016], K.w.bone('hips'));
    K.shell('shawl', [[1.38, 0.11, 0.094, 0.11], [1.335, 0.178, 0.118, 0.122], [1.27, 0.202, 0.152, 0.13], [1.21, 0.212, 0.17, 0.136]], K.w.torso, { n: 28 });
    K.shell('fringe', [[1.225, 0.214, 0.172, 0.138], [1.195, 0.216, 0.172, 0.14]], K.w.torso, { n: 28 });
    K.panel('shawl', [[1.22, 0.208, 0.14, 0.136], [1.1, 0.15, 0.14, 0.128], [0.98, 0.08, 0.14, 0.128], [0.92, 0.02, 0.14, 0.132]], 105, 255, K.w.torso, { n: 12 });
    K.tube('shawl', [[0.05, 1.25, 0.17], [0.02, 1.14, 0.148], [-0.03, 1.03, 0.13], [-0.05, 0.94, 0.14]], [0.04, 0.034, 0.03, 0.022], K.w.torso);
    K.tube('shawl', [[-0.05, 1.25, 0.17], [-0.02, 1.15, 0.158], [0.036, 1.06, 0.146], [0.06, 0.98, 0.15]], [0.04, 0.034, 0.03, 0.022], K.w.torso);
    K.shell('hood', [[1.682, 0.014, 0.016, 0.016, 0, -0.006], [1.668, 0.056, 0.066, 0.07, 0, -0.004], [1.64, 0.088, 0.106, 0.104], [1.612, 0.1, 0.118, 0.114]], K.w.head, { n: 24 });
    K.panel('hood', [[1.612, 0.1, 0.118, 0.114], [1.56, 0.106, 0.118, 0.12], [1.49, 0.106, 0.108, 0.12], [1.43, 0.1, 0.094, 0.116], [1.385, 0.112, 0.09, 0.112], [1.35, 0.14, 0.1, 0.11]], 56, 304, K.w.hair, { n: 22 });
  },
};
    return PERSON; } },
  "marta": { name: "Marta", zone: 2, heightM: 1.53, person: function () {
// Marta, the keeper of the Wardens’ hall: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Marta, the keeper of the Wardens’ hall",
  height: 0.93,
  build: [1.2, 1.18],
  head: [0.94, 1, 0.94],
  skin: '#d4a48c',
  colors: { torso: '#5a6a7e', sleeve: '#5a6a7e', forearm: '#e8e2d4', legs: '#4a4038', boots: '#30261e', soles: '#18120e' },
  parts: { dress: { color: '#5a6a7e', rough: 0.95 }, apron: { color: '#f0ece0', rough: 0.9 }, strap: '#e6e0d2', cap: { color: '#f4f0e6', rough: 0.9 }, frill: '#e8e2d4', hair: '#b8b4ac', keys: { color: '#8a8a8e', metal: 1, rough: 0.4 }, ring: { color: '#a8904a', metal: 1, rough: 0.4 }, cuff: '#f0ece0', collar: '#f0ece0' },
  face(F) {
    F.lips('#b0706a', 0.55); F.brows('#a8a49c', 0.7, 14); F.eyes('#5a7088', 0.6); F.lines(0.7); F.underEye(0.25); F.blush('#d07864', 0.32);
  },
  make(K) {
    K.shell('dress', [[1.352, 0.067, 0.068, 0.072], [1.325, 0.154, 0.098, 0.11], [1.29, 0.158, 0.119, 0.113], [1.26, 0.159, 0.138, 0.113], [1.235, 0.159, 0.155, 0.112], [1.215, 0.159, 0.159, 0.111], [1.185, 0.154, 0.149, 0.108], [1.14, 0.139, 0.121, 0.105], [1.04, 0.124, 0.1, 0.1], [0.985, 0.156, 0.114, 0.121]], K.w.torso, { n: 28 });
    K.shell('dress', [[1.05, 0.116, 0.092, 0.092], [0.98, 0.15, 0.125, 0.13], [0.86, 0.185, 0.16, 0.17], [0.6, 0.23, 0.2, 0.215], [0.34, 0.265, 0.23, 0.245], [0.16, 0.285, 0.245, 0.262]], K.w.skirt, { n: 30 });
    K.panel('apron', [[1.29, 0.14, 0.142], [1.26, 0.156, 0.154], [1.235, 0.164, 0.168], [1.215, 0.166, 0.17], [1.185, 0.162, 0.16], [1.14, 0.15, 0.136], [1.045, 0.138, 0.118]], -42, 42, K.w.torso, { n: 14 });
    K.panel('apron', [[1.04, 0.133, 0.109, 0.109], [0.98, 0.162, 0.137, 0.142], [0.86, 0.197, 0.172, 0.182], [0.6, 0.242, 0.212, 0.227], [0.34, 0.277, 0.242, 0.257], [0.22, 0.29, 0.252, 0.268]], -72, 72, K.w.skirt, { n: 22 });
    K.shell('strap', [[1.065, 0.136, 0.114, 0.11], [1.03, 0.146, 0.124, 0.118]], K.w.torso, { n: 26 });
    K.tube('strap', [[0.092, 1.288, 0.112], [0.092, 1.34, 0.098], [0.08, 1.366, 0], [0.04, 1.3, -0.124], [-0.07, 1.08, -0.114]], [0.011, 0.011, 0.011, 0.011, 0.011], K.w.torso);
    K.tube('strap', [[-0.092, 1.288, 0.112], [-0.092, 1.34, 0.098], [-0.08, 1.366, 0], [-0.04, 1.3, -0.124], [0.07, 1.08, -0.114]], [0.011, 0.011, 0.011, 0.011, 0.011], K.w.torso);
    K.ball('strap', [0, 1.04, -0.124], [0.04, 0.022, 0.014], K.w.bone('hips'));
    K.shell('collar', [[1.385, 0.062, 0.064, 0.066], [1.36, 0.082, 0.084, 0.086], [1.345, 0.104, 0.092, 0.094]], K.w.torso, { n: 22 });
    K.tube('cuff', [[0.251, 0.925, -0.008], [0.268, 0.86, -0.008]], [0.042, 0.037], K.w.bone('farmL'));
    K.tube('cuff', [[-0.251, 0.925, -0.008], [-0.268, 0.86, -0.008]], [0.042, 0.037], K.w.bone('farmR'));
    K.tube('ring', [[0.178, 1.02, 0.06], [0.196, 0.975, 0.07], [0.186, 0.935, 0.074]], [0.008, 0.008, 0.008], K.w.bone('hips'));
    K.tube('keys', [[0.184, 0.94, 0.076], [0.19, 0.84, 0.084]], [0.012, 0.016], K.w.bone('hips'));
    K.tube('keys', [[0.198, 0.94, 0.062], [0.212, 0.86, 0.066]], [0.01, 0.013], K.w.bone('hips'));
    K.hair('hair', 'bun', { underHat: true });
    K.shell('cap', [[1.584, 0.093, 0.111, 0.109], [1.625, 0.094, 0.112, 0.112], [1.655, 0.092, 0.106, 0.116], [1.682, 0.072, 0.078, 0.1], [1.694, 0.03, 0.03, 0.05, 0, -0.012]], K.w.head, { n: 26, capLast: true });
    K.shell('frill', [[1.598, 0.097, 0.115, 0.113], [1.586, 0.11, 0.128, 0.124], [1.572, 0.116, 0.132, 0.128]], K.w.head, { n: 28 });
  },
};
    return PERSON; } },
  "roadwarden": { name: "The roadwarden", zone: 2, heightM: 1.68, person: function () {
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
    return PERSON; } },
  "ysmera": { name: "Ysmera Brightkeel", zone: 3, heightM: 1.75, person: function () {
// Ysmera Brightkeel, the shipmaster: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Ysmera Brightkeel, the shipmaster",
  height: 1.06,
  build: [0.93, 0.94],
  head: [1, 1.02, 1],
  skin: '#d8ccd4',
  colors: { torso: '#2a3450', sleeve: '#2a3450', forearm: '#2a3450', legs: '#1e2438', boots: { color: '#161a28', rough: 0.35 }, soles: '#0c0e16' },
  parts: { coat: { color: '#2a3450', rough: 0.8 }, lining: { color: '#b8c0d8', rough: 0.6 }, collar: { color: '#2a3450', rough: 0.8 }, sash: { color: '#c8ccd8', rough: 0.5 }, silver: { color: '#d0d4dc', metal: 1, rough: 0.3 }, hair: '#e4e2ea', mantle: { color: '#3a4668', rough: 0.8 }, cuff: { color: '#c8d0e4', rough: 0.6 }, hem: { color: '#c8ccd8', rough: 0.5 } },
  face(F) {
    F.pale(0.3); F.lips('#9a6a7a', 0.6); F.brows('#c8c4d0', 0.7, 11); F.eyes('#8a9ac8', 0.7); F.lines(0.35); F.eyeshadow('#6a7098', 0.2);
  },
  make(K) {
    K.shell('coat', [[1.352, 0.064, 0.064, 0.068], [1.325, 0.148, 0.092, 0.104], [1.29, 0.152, 0.112, 0.107], [1.26, 0.153, 0.13, 0.107], [1.235, 0.153, 0.146, 0.106], [1.215, 0.153, 0.15, 0.105], [1.185, 0.148, 0.141, 0.102], [1.14, 0.134, 0.114, 0.099], [1.04, 0.119, 0.094, 0.094], [0.985, 0.15, 0.108, 0.114]], K.w.torso, { n: 28 });
    K.shell('coat', [[1.04, 0.122, 0.097, 0.097], [0.96, 0.156, 0.118, 0.122], [0.87, 0.18, 0.134, 0.144], [0.74, 0.196, 0.164, 0.178], [0.56, 0.212, 0.196, 0.208], [0.36, 0.228, 0.212, 0.226], [0.2, 0.246, 0.226, 0.242], [0.1, 0.262, 0.238, 0.256]], K.w.skirt, { n: 30 });
    K.shell('hem', [[0.15, 0.262, 0.238, 0.256], [0.1, 0.27, 0.246, 0.264]], K.w.skirt, { n: 30 });
    K.shell('sash', [[1.085, 0.134, 0.112, 0.104], [1.02, 0.14, 0.112, 0.11]], K.w.torso, { n: 26 });
    K.tube('sash', [[0.086, 1.04, 0.11], [0.104, 0.9, 0.136], [0.112, 0.74, 0.166]], [0.022, 0.024, 0.018], K.w.bone('hips'));
    K.shell('mantle', [[1.375, 0.078, 0.078, 0.084], [1.345, 0.13, 0.1, 0.108], [1.31, 0.184, 0.118, 0.12], [1.26, 0.206, 0.144, 0.128], [1.225, 0.212, 0.162, 0.132]], K.w.torso, { n: 28 });
    K.panel('collar', [[1.455, 0.078, 0.07, 0.086], [1.41, 0.07, 0.068, 0.078], [1.37, 0.074, 0.074, 0.08]], 38, 322, K.w.torso, { n: 20 });
    K.ball('silver', [0, 1.345, 0.104], [0.024, 0.03, 0.01], K.w.torso);
    K.ball('silver', [0, 1.052, 0.116], [0.02, 0.026, 0.008], K.w.torso);
    K.tube('cuff', [[0.249, 0.93, -0.008], [0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmL'));
    K.tube('cuff', [[-0.249, 0.93, -0.008], [-0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmR'));
    K.hair('hair', 'short');
    K.ball('hair', [0, 1.678, -0.044], [0.06, 0.05, 0.062], K.w.head);
    K.tube('silver', [[-0.082, 1.672, -0.044], [0.082, 1.692, -0.048]], [0.006, 0.006], K.w.head);
  },
};
    return PERSON; } },
  "watch": { name: "The watchwoman", zone: 4, heightM: 1.7, person: function () {
// The watchwoman: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "The watchwoman",
  height: 1.03,
  build: [1.08, 1.06],
  head: [0.98, 1, 0.98],
  skin: '#c89a84',
  colors: { torso: '#3e4658', sleeve: '#3e4658', forearm: '#3e4658', legs: '#32323a', boots: { color: '#26221e', rough: 0.6 }, soles: '#12100e' },
  parts: { coat: { color: '#3e4658', rough: 1 }, cape: { color: '#4e5a70', rough: 1 }, trim: { color: '#8a8e9a', rough: 0.9 }, fur: { color: '#5a5048', rough: 1 }, hat: { color: '#5a5048', rough: 1 }, crown: { color: '#3e4658', rough: 1 }, scarf: { color: '#b8b4a8', rough: 1 }, belt: { color: '#2a2420', rough: 0.5 }, buckle: { color: '#a8a8ac', metal: 1, rough: 0.4 }, horn: { color: '#c8b890', rough: 0.5 }, strap: { color: '#2a2420', rough: 0.5 }, glove: { color: '#2a2420', rough: 0.7 }, hair: '#6a5a4e', badge: { color: '#a8a8ac', metal: 1, rough: 0.4 } },
  face(F) {
    F.lips('#9a6058', 0.5); F.brows('#5a4a3e', 0.8, 15); F.eyes('#5a6a6a', 0.6); F.lines(0.5); F.underEye(0.45); F.blush('#c8604e', 0.3); F.pale(0.1);
  },
  make(K) {
    K.shell('coat', [[1.352, 0.067, 0.068, 0.071], [1.325, 0.154, 0.098, 0.109], [1.29, 0.158, 0.119, 0.112], [1.26, 0.159, 0.138, 0.112], [1.235, 0.159, 0.155, 0.111], [1.215, 0.159, 0.159, 0.11], [1.185, 0.154, 0.149, 0.107], [1.14, 0.139, 0.121, 0.104], [1.04, 0.124, 0.1, 0.099], [0.985, 0.156, 0.114, 0.12]], K.w.torso, { n: 28 });
    K.shell('coat', [[1.04, 0.126, 0.102, 0.102], [0.96, 0.16, 0.124, 0.128], [0.87, 0.186, 0.134, 0.146], [0.76, 0.204, 0.166, 0.18], [0.6, 0.222, 0.196, 0.21], [0.44, 0.238, 0.212, 0.228], [0.32, 0.25, 0.222, 0.24]], K.w.skirt, { n: 30 });
    K.shell('trim', [[0.36, 0.252, 0.224, 0.242], [0.32, 0.256, 0.228, 0.246]], K.w.skirt, { n: 30 });
    K.shell('belt', [[1.07, 0.138, 0.116, 0.11], [1.025, 0.146, 0.118, 0.114]], K.w.torso, { n: 26 });
    K.ball('buckle', [0, 1.047, 0.124], [0.024, 0.026, 0.008], K.w.torso);
    K.shell('cape', [[1.38, 0.078, 0.078, 0.084], [1.35, 0.13, 0.1, 0.108], [1.315, 0.186, 0.124, 0.122], [1.25, 0.214, 0.162, 0.134], [1.215, 0.222, 0.172, 0.138], [1.19, 0.226, 0.168, 0.142], [1.15, 0.23, 0.16, 0.146]], K.w.torso, { n: 28 });
    K.shell('trim', [[1.17, 0.234, 0.168, 0.15], [1.15, 0.236, 0.166, 0.152]], K.w.torso, { n: 28 });
    K.shell('scarf', [[1.425, 0.07, 0.076, 0.072], [1.395, 0.09, 0.098, 0.09], [1.37, 0.1, 0.104, 0.096]], K.w.torso, { n: 24 });
    K.tube('strap', [[-0.03, 1.15, 0.138], [-0.085, 1.09, 0.11], [-0.128, 1.03, 0.066], [-0.176, 0.97, 0.036]], [0.012, 0.012, 0.012, 0.012], K.w.torso);
    K.tube('horn', [[-0.2, 0.99, -0.05], [-0.214, 0.94, 0.01], [-0.218, 0.9, 0.08], [-0.21, 0.89, 0.15]], [0.012, 0.022, 0.032, 0.04], K.w.bone('hips'));
    K.tube('glove', [[0.25, 0.93, -0.008], [0.268, 0.862, -0.008]], [0.042, 0.036], K.w.bone('farmL'));
    K.tube('glove', [[-0.25, 0.93, -0.008], [-0.268, 0.862, -0.008]], [0.042, 0.036], K.w.bone('farmR'));
    K.hair('hair', 'bob', { underHat: true });
    K.shell('crown', [[1.6, 0.094, 0.112, 0.11], [1.66, 0.096, 0.114, 0.112], [1.695, 0.09, 0.106, 0.104], [1.7, 0.04, 0.046, 0.046]], K.w.head, { n: 26, capLast: true });
    K.shell('hat', [[1.652, 0.104, 0.122, 0.12], [1.615, 0.11, 0.128, 0.126], [1.58, 0.104, 0.122, 0.12], [1.572, 0.094, 0.112, 0.11]], K.w.head, { n: 28 });
    K.ball('badge', [0, 1.618, 0.13], [0.02, 0.024, 0.008], K.w.head);
  },
};
    return PERSON; } },
  "warden": { name: "A Warden", zone: 4, heightM: 1.73, person: function () {
// A Warden of Dawnroost (the forty held in the street): shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "A Warden of Dawnroost (the forty held in the street)",
  height: 1.05,
  build: [1.12, 1.06],
  head: [0.97, 1, 0.97],
  skin: '#c08c6c',
  colors: { torso: '#5a5a5e', sleeve: '#5a5a5e', forearm: '#3a2c20', legs: '#4a443e', boots: { color: '#2a2019', rough: 0.5 }, soles: '#14100c' },
  parts: { mail: { color: '#7a7a80', metal: 0.6, rough: 0.5 }, tabard: { color: '#a8502c', rough: 0.95 }, trim: '#c8a45a', ember: { color: '#e0a040', rough: 0.6 }, cloak: { color: '#6a3a26', rough: 1 }, clasp: { color: '#b0903a', metal: 1, rough: 0.4 }, belt: { color: '#2a1c12', rough: 0.45 }, buckle: { color: '#b0b0b4', metal: 1, rough: 0.35 }, helm: { color: '#8a8a90', metal: 1, rough: 0.4 }, rim: { color: '#a8904a', metal: 1, rough: 0.4 }, coif: { color: '#6a6a70', metal: 0.6, rough: 0.55 }, bracer: { color: '#3a2c20', rough: 0.5 }, greave: { color: '#3a2c20', rough: 0.5 }, pauldron: { color: '#3a2c20', rough: 0.5 } },
  face(F) {
    F.lips('#96604e', 0.5); F.brows('#4a3424', 0.85, 17); F.eyes('#5a4a34', 0.6); F.lines(0.15); F.pale(0.1);
  },
  make(K) {
    K.shell('mail', [[1.36, 0.07, 0.07, 0.074], [1.325, 0.15, 0.1, 0.106], [1.29, 0.152, 0.116, 0.108], [1.26, 0.153, 0.132, 0.108], [1.235, 0.154, 0.147, 0.108], [1.215, 0.154, 0.15, 0.108], [1.185, 0.152, 0.143, 0.107], [1.14, 0.144, 0.128, 0.106], [1.04, 0.142, 0.116, 0.108], [0.99, 0.154, 0.116, 0.115]], K.w.torso, { n: 28 });
    K.shell('mail', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.122, 0.138], [0.79, 0.196, 0.152, 0.168], [0.65, 0.212, 0.186, 0.202], [0.58, 0.22, 0.194, 0.209]], K.w.skirt, { n: 28 });
    K.panel('tabard', [[1.33, 0.149, 0.106, 0.111], [1.325, 0.16, 0.11, 0.116], [1.29, 0.162, 0.126, 0.118], [1.26, 0.163, 0.142, 0.118], [1.235, 0.164, 0.157, 0.118], [1.215, 0.164, 0.16, 0.118], [1.185, 0.162, 0.153, 0.117], [1.14, 0.154, 0.138, 0.116], [1.04, 0.152, 0.126, 0.118], [0.99, 0.164, 0.126, 0.125]], -32, 32, K.w.torso, { n: 12 });
    K.panel('tabard', [[1.06, 0.15, 0.126], [0.95, 0.176, 0.128], [0.87, 0.194, 0.134], [0.79, 0.204, 0.164], [0.66, 0.218, 0.194], [0.52, 0.232, 0.21]], -36, 36, K.w.skirt, { n: 12 });
    K.panel('tabard', [[1.33, 0.149, 0.106, 0.111], [1.325, 0.16, 0.11, 0.116], [1.29, 0.162, 0.126, 0.118], [1.26, 0.163, 0.142, 0.118], [1.235, 0.164, 0.157, 0.118], [1.215, 0.164, 0.16, 0.118], [1.185, 0.162, 0.153, 0.117], [1.14, 0.154, 0.138, 0.116], [1.04, 0.152, 0.126, 0.118], [0.99, 0.164, 0.126, 0.125]], 148, 212, K.w.torso, { n: 10 });
    K.panel('trim', [[0.56, 0.236, 0.214], [0.52, 0.24, 0.218]], -36, 36, K.w.skirt, { n: 12 });
    K.ball('ember', [0, 1.205, 0.16], [0.03, 0.046, 0.008], K.w.torso);
    K.shell('belt', [[1.068, 0.159, 0.139, 0.13], [1.012, 0.165, 0.141, 0.134]], K.w.torso, { n: 28 });
    K.ball('buckle', [0, 1.04, 0.15], [0.03, 0.032, 0.008], K.w.torso);
    K.shell('cloak', [[1.375, 0.11, 0.094, 0.106], [1.35, 0.15, 0.106, 0.114], [1.325, 0.176, 0.118, 0.122]], K.w.torso, { n: 26 });
    K.panel('cloak', [[1.335, 0.174, 0.12, 0.124], [1.2, 0.2, 0.12, 0.146], [1.08, 0.214, 0.12, 0.16], [1, 0.222, 0.12, 0.168]], 122, 238, K.w.torso, { n: 14 });
    K.panel('cloak', [[1.03, 0.22, 0.12, 0.166], [0.86, 0.238, 0.12, 0.196], [0.64, 0.258, 0.12, 0.23], [0.44, 0.274, 0.12, 0.252], [0.34, 0.28, 0.12, 0.262]], 122, 238, K.w.skirt, { n: 14 });
    K.ball('clasp', [0.104, 1.325, 0.104], [0.022, 0.022, 0.01], K.w.torso);
    K.ball('clasp', [-0.104, 1.325, 0.104], [0.022, 0.022, 0.01], K.w.torso);
    K.ball('pauldron', [0.168, 1.318, -0.008], [0.068, 0.046, 0.074], K.w.bone('uarmL'));
    K.ball('pauldron', [-0.168, 1.318, -0.008], [0.068, 0.046, 0.074], K.w.bone('uarmR'));
    K.tube('bracer', [[0.232, 0.995, -0.008], [0.262, 0.885, -0.008]], [0.043, 0.034], K.w.bone('farmL'));
    K.tube('bracer', [[-0.232, 0.995, -0.008], [-0.262, 0.885, -0.008]], [0.043, 0.034], K.w.bone('farmR'));
    K.tube('greave', [[0.085, 0.5, 0], [0.085, 0.36, 0], [0.085, 0.29, 0.006]], [0.06, 0.052, 0.06], K.w.bone('shinL'));
    K.tube('greave', [[-0.085, 0.5, 0], [-0.085, 0.36, 0], [-0.085, 0.29, 0.006]], [0.06, 0.052, 0.06], K.w.bone('shinR'));
    K.panel('coif', [[1.6, 0.094, 0.112, 0.108], [1.56, 0.097, 0.112, 0.11], [1.49, 0.096, 0.102, 0.11], [1.43, 0.09, 0.092, 0.104], [1.385, 0.096, 0.094, 0.104]], 56, 304, K.w.hair, { n: 22 });
    K.panel('coif', [[1.432, 0.088, 0.094, 0.1], [1.4, 0.08, 0.106, 0.1], [1.365, 0.086, 0.1, 0.1]], -58, 58, K.w.head, { n: 10 });
    K.shell('coif', [[1.39, 0.094, 0.096, 0.104], [1.36, 0.118, 0.102, 0.11], [1.338, 0.146, 0.11, 0.116]], K.w.torso, { n: 24 });
    K.shell('helm', [[1.588, 0.1, 0.118, 0.116], [1.63, 0.1, 0.118, 0.116], [1.665, 0.09, 0.106, 0.104], [1.69, 0.066, 0.078, 0.076], [1.7, 0.022, 0.026, 0.026]], K.w.head, { n: 26, capLast: true });
    K.shell('rim', [[1.6, 0.104, 0.122, 0.12], [1.582, 0.106, 0.124, 0.122]], K.w.head, { n: 26 });
    K.tube('rim', [[0, 1.6, 0.122], [0, 1.66, 0.11], [0, 1.7, 0.03]], [0.008, 0.008, 0.006], K.w.head);
  },
};
    return PERSON; } },
  "gretch": { name: "Mayor Gretch", zone: 1, heightM: 1.63, person: function () {
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
    return PERSON; } },
  "hilde": { name: "Hilde", zone: 1, heightM: 1.73, person: function () {
// Hilde, the smith: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Hilde, the smith",
  height: 1.05,
  build: [1.14, 1.06],
  head: [0.96, 1, 0.98],
  skin: '#c08a6e',
  colors: { torso: '#8a8474', sleeve: '#8a8474', forearm: 'skin', legs: '#4a4038', boots: { color: '#2a201a', rough: 0.5 }, soles: '#17110d' },
  parts: { shirt: { color: '#8a8474', rough: 0.95 }, roll: '#979182', apron: { color: '#5a3a26', rough: 0.6 }, strap: { color: '#3c2618', rough: 0.5 }, belt: { color: '#2e1e14', rough: 0.45 }, buckle: { color: '#8a8a8e', metal: 1, rough: 0.4 }, hair: '#6a3a22', band: '#7a2e22', wrap: { color: '#3c2618', rough: 0.6 }, hammer: { color: '#6a6a70', metal: 1, rough: 0.45 }, haft: '#7a5a3a' },
  face(F) {
    F.lips('#9a5a50', 0.5); F.brows('#5a301c', 0.85, 17); F.eyes('#6a4a2a', 0.6); F.lines(0.35); F.blush('#c05a44', 0.28); F.air(300, 470, 60, 40, '#3a2a22', 0.18, 'multiply');
  },
  make(K) {
    K.shell('shirt', [[1.352, 0.066, 0.065, 0.07], [1.325, 0.152, 0.094, 0.107], [1.29, 0.157, 0.114, 0.11], [1.26, 0.158, 0.133, 0.11], [1.235, 0.158, 0.149, 0.109], [1.215, 0.158, 0.153, 0.108], [1.185, 0.152, 0.144, 0.105], [1.14, 0.138, 0.116, 0.102], [1.04, 0.123, 0.096, 0.097], [0.985, 0.154, 0.11, 0.117]], K.w.torso, { n: 28 });
    K.shell('shirt', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.124, 0.138], [0.8, 0.192, 0.13, 0.142]], K.w.skirt, { n: 28 });
    K.panel('apron', [[1.275, 0.14, 0.15], [1.235, 0.16, 0.164], [1.215, 0.162, 0.166], [1.185, 0.16, 0.156], [1.14, 0.154, 0.136], [1.05, 0.152, 0.12]], -44, 44, K.w.torso, { n: 14 });
    K.panel('apron', [[1.06, 0.16, 0.13], [0.95, 0.184, 0.132], [0.87, 0.2, 0.14], [0.79, 0.21, 0.168], [0.62, 0.226, 0.204], [0.46, 0.24, 0.22], [0.34, 0.248, 0.228]], -62, 62, K.w.skirt, { n: 20 });
    K.tube('strap', [[0.094, 1.272, 0.116], [0.086, 1.33, 0.1], [0.064, 1.366, 0.012], [0.04, 1.372, -0.058], [0, 1.374, -0.074]], [0.009, 0.009, 0.009, 0.009, 0.009], K.w.torso);
    K.tube('strap', [[-0.094, 1.272, 0.116], [-0.086, 1.33, 0.1], [-0.064, 1.366, 0.012], [-0.04, 1.372, -0.058], [0, 1.374, -0.074]], [0.009, 0.009, 0.009, 0.009, 0.009], K.w.torso);
    K.shell('belt', [[1.07, 0.16, 0.134, 0.124], [1.03, 0.166, 0.136, 0.128]], K.w.torso, { n: 28 });
    K.ball('buckle', [0, 1.05, 0.14], [0.02, 0.022, 0.008], K.w.torso);
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, 0.195, -0.008], [1.105, 0.068, 0.066, 0.066, 0.202, -0.008], [1.075, 0.062, 0.06, 0.06, 0.21, -0.008]], K.w.bone('uarmL'), { n: 16 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, -0.195, -0.008], [1.105, 0.068, 0.066, 0.066, -0.202, -0.008], [1.075, 0.062, 0.06, 0.06, -0.21, -0.008]], K.w.bone('uarmR'), { n: 16 });
    K.tube('wrap', [[0.24, 0.965, -0.008], [0.262, 0.885, -0.008]], [0.04, 0.033], K.w.bone('farmL'));
    K.tube('wrap', [[-0.24, 0.965, -0.008], [-0.262, 0.885, -0.008]], [0.04, 0.033], K.w.bone('farmR'));
    K.tube('haft', [[-0.214, 1.02, 0.03], [-0.228, 0.8, 0.035]], [0.012, 0.012], K.w.bone('hips'));
    K.tube('hammer', [[-0.214, 1.04, -0.01], [-0.214, 1.04, 0.075]], [0.026, 0.026], K.w.bone('hips'));
    K.hair('hair', 'short');
    K.ball('hair', [0, 1.53, -0.112], [0.04, 0.046, 0.036], K.w.head);
    K.shell('band', [[1.622, 0.086, 0.106, 0.102], [1.596, 0.088, 0.108, 0.104]], K.w.head, { n: 24 });
  },
};
    return PERSON; } },
  "quill": { name: "Quill", zone: 1, heightM: 1.67, person: function () {
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
    K.shell('jersey', [[1.34, 0.1, 0.086, 0.092], [1.29, 0.15, 0.116, 0.106], [1.26, 0.152, 0.132, 0.107], [1.235, 0.153, 0.147, 0.108], [1.215, 0.153, 0.15, 0.108], [1.14, 0.14, 0.126, 0.102], [1.04, 0.134, 0.108, 0.102], [0.99, 0.15, 0.11, 0.112]], K.w.torso, { n: 26 });
    K.panel('jacket', [[1.36, 0.072, 0.072, 0.076], [1.325, 0.158, 0.108, 0.112], [1.29, 0.162, 0.126, 0.114], [1.26, 0.163, 0.142, 0.115], [1.235, 0.164, 0.157, 0.116], [1.215, 0.164, 0.16, 0.116], [1.14, 0.152, 0.138, 0.112], [1.04, 0.15, 0.122, 0.112], [0.95, 0.166, 0.124, 0.124]], 30, 330, K.w.torso, { n: 26 });
    K.shell('jersey', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.124, 0.138], [0.86, 0.187, 0.125, 0.139]], K.w.skirt, { n: 26 });
    K.panel('jacket', [[1.06, 0.156, 0.124, 0.122], [0.95, 0.179, 0.126, 0.136], [0.87, 0.196, 0.134, 0.148], [0.8, 0.202, 0.14, 0.152], [0.78, 0.201, 0.139, 0.15]], 26, 334, K.w.skirt, { n: 26 });
    K.shell('belt', [[1.04, 0.153, 0.122, 0.114], [1, 0.159, 0.123, 0.118]], K.w.torso, { n: 28 });
    K.shell('kerchief', [[1.4, 0.06, 0.062, 0.062], [1.37, 0.076, 0.08, 0.08], [1.35, 0.094, 0.09, 0.088]], K.w.torso, { n: 22 });
    K.ball('kerchief', [0.02, 1.335, 0.098], [0.022, 0.02, 0.014], K.w.torso);
    K.tube('rope', [[0.12, 1.345, 0.02], [0.105, 1.3, 0.118], [0.03, 1.19, 0.168], [-0.07, 1.08, 0.13], [-0.15, 0.99, 0.085], [-0.172, 0.97, 0], [-0.15, 0.99, -0.09], [-0.06, 1.1, -0.126], [0.05, 1.23, -0.124], [0.112, 1.32, -0.085], [0.12, 1.345, 0.02]], [0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022], K.w.torso);
    K.tube('cuff', [[0.257, 0.9, -0.008], [0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmL'));
    K.tube('cuff', [[-0.257, 0.9, -0.008], [-0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmR'));
    K.hair('hair', 'short', { underHat: true });
    K.shell('cap', [[1.578, 0.091, 0.109, 0.107], [1.612, 0.091, 0.109, 0.107], [1.642, 0.083, 0.099, 0.097], [1.664, 0.06, 0.07, 0.07], [1.674, 0.02, 0.022, 0.022]], K.w.head, { n: 26, capLast: true });
    K.shell('roll', [[1.606, 0.097, 0.115, 0.113], [1.59, 0.1, 0.118, 0.116], [1.574, 0.097, 0.115, 0.113]], K.w.head, { n: 26 });
  },
};
    return PERSON; } },
  "tobb": { name: "Tobb", zone: 1, heightM: 1.77, person: function () {
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
    K.shell('shirt', [[1.35, 0.066, 0.066, 0.072], [1.325, 0.15, 0.1, 0.106], [1.29, 0.152, 0.116, 0.108], [1.26, 0.153, 0.132, 0.109], [1.235, 0.154, 0.147, 0.11], [1.215, 0.154, 0.15, 0.11], [1.14, 0.146, 0.154, 0.106], [1.04, 0.152, 0.168, 0.106], [0.96, 0.162, 0.152, 0.118], [0.92, 0.168, 0.138, 0.124]], K.w.torso, { n: 28 });
    K.panel('vest', [[1.335, 0.126, 0.1, 0.108], [1.3, 0.16, 0.12, 0.112], [1.26, 0.163, 0.142, 0.117], [1.235, 0.164, 0.157, 0.118], [1.215, 0.164, 0.16, 0.118], [1.14, 0.156, 0.164, 0.114], [1.05, 0.16, 0.176, 0.114], [1, 0.168, 0.166, 0.122]], 28, 332, K.w.torso, { n: 26 });
    K.ball('button', [0.088, 1.13, 0.142], [0.01, 0.01, 0.006], K.w.torso);
    K.ball('button', [0.092, 1.06, 0.148], [0.01, 0.01, 0.006], K.w.torso);
    K.shell('breeches', [[0.99, 0.174, 0.164, 0.128], [0.93, 0.182, 0.156, 0.136], [0.87, 0.192, 0.144, 0.142], [0.8, 0.196, 0.132, 0.14], [0.74, 0.19, 0.122, 0.132]], K.w.skirt, { n: 28 });
    K.shell('tie', [[1.012, 0.18, 0.18, 0.134], [0.972, 0.186, 0.176, 0.142]], K.w.torso, { n: 28 });
    K.panel('apron', [[0.985, 0.196, 0.19], [0.9, 0.206, 0.18], [0.8, 0.214, 0.182], [0.66, 0.228, 0.2], [0.5, 0.24, 0.216], [0.36, 0.25, 0.228]], -64, 64, K.w.skirt, { n: 22 });
    K.ball('tie', [0, 0.988, -0.16], [0.034, 0.018, 0.012], K.w.bone('hips'));
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, 0.195, -0.008], [1.105, 0.068, 0.066, 0.066, 0.202, -0.008], [1.075, 0.062, 0.06, 0.06, 0.21, -0.008]], K.w.bone('uarmL'), { n: 16 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, -0.195, -0.008], [1.105, 0.068, 0.066, 0.066, -0.202, -0.008], [1.075, 0.062, 0.06, 0.06, -0.21, -0.008]], K.w.bone('uarmR'), { n: 16 });
    K.panel('towel', [[1.2, 0.172, 0.172, 0.12], [1.27, 0.17, 0.152, 0.12], [1.325, 0.162, 0.116, 0.12]], 20, 52, K.w.torso, { n: 6 });
    K.panel('towel', [[1.332, 0.158, 0.11, 0.12], [1.3, 0.168, 0.11, 0.126], [1.24, 0.172, 0.11, 0.13]], 128, 160, K.w.torso, { n: 6 });
    K.tube('towel', [[0.098, 1.336, 0.072], [0.104, 1.35, 0], [0.098, 1.342, -0.07]], [0.03, 0.03, 0.03], K.w.torso);
    K.hair('hair', 'short');
  },
};
    return PERSON; } },
  "pell": { name: "Pell", zone: 1, heightM: 1.19, person: function () {
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
    K.shell('smock', [[1.345, 0.066, 0.066, 0.07], [1.32, 0.15, 0.1, 0.104], [1.29, 0.152, 0.116, 0.106], [1.26, 0.153, 0.132, 0.108], [1.235, 0.154, 0.147, 0.11], [1.215, 0.154, 0.15, 0.11], [1.1, 0.15, 0.134, 0.112], [1, 0.16, 0.13, 0.12]], K.w.torso, { n: 26 });
    K.shell('smock', [[1.04, 0.158, 0.13, 0.12], [0.92, 0.186, 0.148, 0.15], [0.8, 0.208, 0.174, 0.182], [0.66, 0.226, 0.198, 0.208], [0.54, 0.238, 0.21, 0.222]], K.w.skirt, { n: 28 });
    K.shell('hem', [[0.585, 0.24, 0.212, 0.224], [0.54, 0.246, 0.218, 0.23]], K.w.skirt, { n: 28 });
    K.shell('yoke', [[1.372, 0.066, 0.068, 0.07], [1.345, 0.118, 0.102, 0.104], [1.318, 0.168, 0.118, 0.116], [1.29, 0.172, 0.13, 0.118]], K.w.torso, { n: 24 });
    K.shell('sash', [[1.085, 0.158, 0.144, 0.122], [1.045, 0.164, 0.142, 0.126]], K.w.torso, { n: 26 });
    K.panel('patch', [[0.8, 0.216, 0.182], [0.7, 0.228, 0.198]], 16, 44, K.w.skirt, { n: 5 });
    K.hair('hair', 'short');
    K.tube('hair', [[0.07, 1.5, -0.05], [0.098, 1.43, -0.04], [0.106, 1.37, -0.03]], [0.022, 0.02, 0.014], K.w.hair);
    K.tube('hair', [[-0.07, 1.5, -0.05], [-0.098, 1.43, -0.04], [-0.106, 1.37, -0.03]], [0.022, 0.02, 0.014], K.w.hair);
    K.ball('ribbon', [0.104, 1.385, -0.032], [0.022, 0.014, 0.02], K.w.hair);
    K.ball('ribbon', [-0.104, 1.385, -0.032], [0.022, 0.014, 0.02], K.w.hair);
  },
};
    return PERSON; } },
  "brann": { name: "Brann", zone: 2, heightM: 1.65, person: function () {
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
  parts: { jerkin: { color: '#5a4630', rough: 0.7 }, edge: { color: '#3e2e1e', rough: 0.6 }, belt: { color: '#2a1c12', rough: 0.45 }, buckle: { color: '#b0b0b4', metal: 1, rough: 0.35 }, book: { color: '#6a2e24', rough: 0.6 }, pages: '#e0d8c0', cap: { color: '#3a4a4a', rough: 1 }, hair: '#4a4038', beard: '#5a5048', cuff: { color: '#3e2e1e', rough: 0.6 }, keys: { color: '#8a8a8e', metal: 1, rough: 0.4 } },
  face(F) {
    F.lips('#8e5a4e', 0.5); F.brows('#4a4038', 0.9, 20); F.eyes('#4a4a3a', 0.6); F.lines(0.5); F.underEye(0.3); F.beard('#5a5048', 0.7, 'beard');
  },
  make(K) {
    K.shell('jerkin', [[1.35, 0.11, 0.09, 0.096], [1.325, 0.164, 0.106, 0.11], [1.29, 0.16, 0.12, 0.112], [1.26, 0.158, 0.134, 0.113], [1.235, 0.157, 0.148, 0.114], [1.215, 0.156, 0.151, 0.115], [1.14, 0.15, 0.136, 0.114], [1.04, 0.15, 0.128, 0.116], [0.99, 0.162, 0.126, 0.123]], K.w.torso, { n: 28 });
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
    return PERSON; } },
  "tamsin": { name: "Tamsin", zone: 2, heightM: 1.25, person: function () {
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
    return PERSON; } },
  "carter": { name: "The carter", zone: 2, heightM: 1.7, person: function () {
// The carter: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "The carter",
  height: 1.03,
  build: [1.1, 1.06],
  head: [0.98, 1, 0.98],
  skin: '#c48e6c',
  colors: { torso: '#b0a480', sleeve: '#b0a480', forearm: '#b0a480', legs: '#5a4a38', boots: { color: '#3a2a1e', rough: 0.6 }, soles: '#1a130e' },
  parts: { smock: { color: '#b0a480', rough: 0.95 }, yoke: { color: '#9c906c', rough: 0.95 }, kerchief: { color: '#b8482e', pattern: { kind: 'dots', color: '#f0e0c0', n: 6 } }, hat: { color: '#4a3a2a', rough: 1 }, band: '#2e2218', hair: '#5a3a22', whip: { color: '#3a281a', rough: 0.5 }, gaiter: { color: '#6a5236', rough: 0.7 }, cuff: '#9c906c' },
  face(F) {
    F.lips('#9a5e50', 0.5); F.brows('#5a3a22', 0.85, 18); F.eyes('#5a6a3a', 0.6); F.lines(0.3); F.blush('#c8644c', 0.3); F.beard('#5a3a22', 0.5, 'stubble');
  },
  make(K) {
    K.shell('smock', [[1.36, 0.071, 0.07, 0.074], [1.325, 0.153, 0.1, 0.106], [1.29, 0.155, 0.116, 0.108], [1.26, 0.156, 0.132, 0.108], [1.235, 0.157, 0.147, 0.108], [1.215, 0.157, 0.15, 0.108], [1.185, 0.155, 0.143, 0.107], [1.14, 0.147, 0.128, 0.106], [1.04, 0.145, 0.116, 0.108], [0.99, 0.157, 0.116, 0.115]], K.w.torso, { n: 28 });
    K.shell('smock', [[1.06, 0.15, 0.114, 0.112], [0.95, 0.174, 0.116, 0.126], [0.87, 0.192, 0.122, 0.138], [0.79, 0.202, 0.152, 0.168], [0.65, 0.218, 0.186, 0.202], [0.52, 0.233, 0.2, 0.215], [0.5, 0.234, 0.202, 0.217]], K.w.skirt, { n: 30 });
    K.shell('yoke', [[1.372, 0.072, 0.074, 0.078], [1.345, 0.124, 0.102, 0.106], [1.318, 0.168, 0.118, 0.12], [1.275, 0.174, 0.138, 0.124]], K.w.torso, { n: 26 });
    K.shell('kerchief', [[1.405, 0.06, 0.062, 0.062], [1.385, 0.078, 0.082, 0.084], [1.368, 0.092, 0.092, 0.092]], K.w.torso, { n: 22 });
    K.ball('kerchief', [0, 1.352, 0.104], [0.024, 0.02, 0.014], K.w.torso);
    K.tube('cuff', [[0.259, 0.895, -0.008], [0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmL'));
    K.tube('cuff', [[-0.259, 0.895, -0.008], [-0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmR'));
    K.tube('gaiter', [[0.085, 0.47, 0], [0.085, 0.34, 0], [0.085, 0.27, 0.01]], [0.058, 0.052, 0.062], K.w.bone('shinL'));
    K.tube('gaiter', [[-0.085, 0.47, 0], [-0.085, 0.34, 0], [-0.085, 0.27, 0.01]], [0.058, 0.052, 0.062], K.w.bone('shinR'));
    K.tube('whip', [[-0.124, 1.352, 0.02], [-0.108, 1.3, 0.116], [-0.03, 1.18, 0.16], [0.08, 1.06, 0.118], [0.16, 0.98, 0.08], [0.182, 0.96, 0], [0.16, 0.98, -0.092], [0.07, 1.08, -0.13], [-0.05, 1.22, -0.128], [-0.114, 1.32, -0.088], [-0.124, 1.352, 0.02]], [0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012, 0.012], K.w.torso);
    K.tube('whip', [[0.17, 0.985, 0.06], [0.196, 0.86, 0.07], [0.204, 0.76, 0.074]], [0.016, 0.014, 0.01], K.w.bone('hips'));
    K.hair('hair', 'short', { underHat: true });
    K.shell('hat', [[1.58, 0.094, 0.112, 0.11], [1.63, 0.094, 0.112, 0.11], [1.672, 0.086, 0.102, 0.1], [1.692, 0.064, 0.076, 0.074], [1.698, 0.02, 0.024, 0.024]], K.w.head, { n: 26, capLast: true });
    K.shell('hat', [[1.596, 0.1, 0.118, 0.116], [1.588, 0.126, 0.146, 0.142], [1.594, 0.146, 0.166, 0.16]], K.w.head, { n: 28 });
    K.shell('band', [[1.624, 0.098, 0.116, 0.114], [1.598, 0.1, 0.118, 0.116]], K.w.head, { n: 26 });
  },
};
    return PERSON; } },
  "gil": { name: "Old Gil", zone: 3, heightM: 1.55, person: function () {
// Old Gil, the innkeeper: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Old Gil, the innkeeper",
  height: 0.94,
  build: [1.2, 1.26],
  head: [0.95, 1, 0.94],
  skin: '#d09c84',
  colors: { torso: '#3a4a5a', sleeve: '#3a4a5a', forearm: '#3a4a5a', legs: '#4a443c', boots: { color: '#2a221c', rough: 0.55 }, soles: '#15110e' },
  parts: { jersey: { color: '#3a4a5a', rough: 1, pattern: { kind: 'stripes', color: '#33414f', n: 14 } }, collar: { color: '#3a4a5a', rough: 1 }, apron: { color: '#c8bea8', rough: 0.95 }, tie: '#b8ae98', cap: { color: '#9a3a2e', rough: 1 }, bobble: '#d8d0c0', hair: '#e0dcd4', beard: '#e4e0d8', breeches: { color: '#4a443c', rough: 0.95 }, cuff: '#33414f', wrap: '#8a7a64' },
  face(F) {
    F.lips('#a86a5e', 0.45); F.brows('#e0dcd4', 0.85, 18); F.eyes('#5a7a8a', 0.6); F.lines(0.9); F.underEye(0.4); F.blush('#d0685a', 0.4); F.beard('#e4e0d8', 0.75, 'beard');
  },
  make(K) {
    K.shell('jersey', [[1.35, 0.068, 0.068, 0.074], [1.325, 0.152, 0.1, 0.108], [1.29, 0.153, 0.116, 0.11], [1.26, 0.154, 0.132, 0.111], [1.235, 0.155, 0.147, 0.112], [1.215, 0.155, 0.15, 0.112], [1.14, 0.15, 0.156, 0.11], [1.04, 0.156, 0.172, 0.11], [0.96, 0.166, 0.156, 0.122], [0.9, 0.172, 0.14, 0.128]], K.w.torso, { n: 28 });
    K.shell('breeches', [[0.99, 0.176, 0.166, 0.13], [0.93, 0.184, 0.158, 0.138], [0.87, 0.194, 0.146, 0.144], [0.8, 0.198, 0.134, 0.142], [0.74, 0.192, 0.124, 0.134]], K.w.skirt, { n: 28 });
    K.shell('collar', [[1.412, 0.07, 0.074, 0.074], [1.39, 0.084, 0.088, 0.088], [1.36, 0.086, 0.09, 0.092], [1.342, 0.076, 0.08, 0.084]], K.w.torso, { n: 22 });
    K.shell('tie', [[1.016, 0.182, 0.184, 0.136], [0.976, 0.188, 0.18, 0.144]], K.w.torso, { n: 28 });
    K.panel('apron', [[0.99, 0.198, 0.194], [0.9, 0.208, 0.182], [0.8, 0.216, 0.184], [0.68, 0.226, 0.198], [0.58, 0.234, 0.21]], -60, 60, K.w.skirt, { n: 20 });
    K.tube('cuff', [[0.256, 0.905, -0.008], [0.27, 0.855, -0.008]], [0.042, 0.037], K.w.bone('farmL'));
    K.tube('cuff', [[-0.256, 0.905, -0.008], [-0.27, 0.855, -0.008]], [0.042, 0.037], K.w.bone('farmR'));
    K.tube('wrap', [[0.085, 0.54, 0], [0.085, 0.47, 0.004], [0.085, 0.4, 0]], [0.058, 0.06, 0.052], K.w.bone('shinL'));
    K.tube('wrap', [[-0.085, 0.54, 0], [-0.085, 0.47, 0.004], [-0.085, 0.4, 0]], [0.058, 0.06, 0.052], K.w.bone('shinR'));
    K.hair('hair', 'short', { underHat: true });
    K.panel('beard', [[1.458, 0.062, 0.097], [1.43, 0.062, 0.106], [1.4, 0.056, 0.114], [1.36, 0.046, 0.122], [1.32, 0.032, 0.134], [1.3, 0.014, 0.132]], -66, 66, K.w.head, { n: 12 });
    K.shell('cap', [[1.578, 0.091, 0.109, 0.107], [1.612, 0.091, 0.109, 0.107], [1.642, 0.083, 0.099, 0.097], [1.664, 0.06, 0.07, 0.07], [1.674, 0.02, 0.022, 0.022]], K.w.head, { n: 26, capLast: true });
    K.shell('cap', [[1.606, 0.097, 0.115, 0.113], [1.59, 0.1, 0.118, 0.116], [1.574, 0.097, 0.115, 0.113]], K.w.head, { n: 26 });
    K.ball('bobble', [0, 1.692, 0], [0.03, 0.028, 0.03], K.w.head);
  },
};
    return PERSON; } },
  "tock": { name: "Tock", zone: 3, heightM: 1.02, person: function () {
// Tock, the shipwright (a gnome): shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Tock, the shipwright (a gnome)",
  height: 0.62,
  build: [1.3, 1.24],
  head: [1.02, 1.24, 1.08],
  skin: '#c8906c',
  colors: { torso: '#7a6a4a', sleeve: '#7a6a4a', forearm: 'skin', legs: '#4a4034', boots: { color: '#2e2218', rough: 0.55 }, soles: '#17110c' },
  parts: { shirt: { color: '#7a6a4a', rough: 0.95 }, roll: '#86765a', apron: { color: '#6a4a2e', rough: 0.6 }, pocket: { color: '#58391f', rough: 0.6 }, strap: { color: '#3e2a1a', rough: 0.5 }, belt: { color: '#2e1e14', rough: 0.5 }, cap: { color: '#3a5a6a', rough: 1 }, band: '#2c4654', hair: '#a85a2a', beard: '#b8642e', mallet: '#9a7a4a', haft: '#7a5a3a', breeches: { color: '#4a4034', rough: 0.95 } },
  face(F) {
    F.lips('#8e5444', 0.5); F.brows('#a85a2a', 0.95, 22); F.eyes('#4a5a3a', 0.6); F.lines(0.45); F.blush('#c86048', 0.34); F.beard('#b8642e', 0.9, 'beard'); F.air(518, 490, 46, 40, '#c85a44', 0.2, 'color');
  },
  make(K) {
    K.shell('shirt', [[1.35, 0.066, 0.066, 0.072], [1.325, 0.15, 0.1, 0.106], [1.29, 0.152, 0.116, 0.108], [1.26, 0.153, 0.132, 0.109], [1.235, 0.154, 0.147, 0.11], [1.215, 0.154, 0.15, 0.11], [1.14, 0.146, 0.148, 0.106], [1.04, 0.15, 0.158, 0.106], [0.96, 0.16, 0.146, 0.118], [0.92, 0.166, 0.134, 0.124]], K.w.torso, { n: 26 });
    K.shell('breeches', [[0.99, 0.172, 0.158, 0.128], [0.93, 0.18, 0.152, 0.136], [0.87, 0.19, 0.142, 0.142], [0.8, 0.196, 0.132, 0.14], [0.74, 0.19, 0.122, 0.132]], K.w.skirt, { n: 26 });
    K.panel('apron', [[1.265, 0.15, 0.146], [1.235, 0.164, 0.162], [1.215, 0.166, 0.164], [1.14, 0.158, 0.16], [1.04, 0.162, 0.17], [1, 0.168, 0.168]], -44, 44, K.w.torso, { n: 14 });
    K.panel('apron', [[1.02, 0.184, 0.178], [0.93, 0.196, 0.172], [0.84, 0.208, 0.172], [0.74, 0.218, 0.186], [0.62, 0.228, 0.202], [0.54, 0.234, 0.21]], -64, 64, K.w.skirt, { n: 20 });
    K.panel('pocket', [[0.9, 0.208, 0.182], [0.84, 0.216, 0.18], [0.76, 0.224, 0.19]], -40, 40, K.w.skirt, { n: 12 });
    K.tube('strap', [[0.1, 1.262, 0.112], [0.088, 1.33, 0.1], [0.064, 1.366, 0.012], [0.04, 1.372, -0.058], [0, 1.374, -0.074]], [0.01, 0.01, 0.01, 0.01, 0.01], K.w.torso);
    K.tube('strap', [[-0.1, 1.262, 0.112], [-0.088, 1.33, 0.1], [-0.064, 1.366, 0.012], [-0.04, 1.372, -0.058], [0, 1.374, -0.074]], [0.01, 0.01, 0.01, 0.01, 0.01], K.w.torso);
    K.shell('belt', [[1.03, 0.186, 0.184, 0.138], [0.985, 0.192, 0.182, 0.146]], K.w.torso, { n: 28 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, 0.195, -0.008], [1.105, 0.068, 0.066, 0.066, 0.202, -0.008], [1.075, 0.062, 0.06, 0.06, 0.21, -0.008]], K.w.bone('uarmL'), { n: 16 });
    K.shell('roll', [[1.13, 0.06, 0.058, 0.058, -0.195, -0.008], [1.105, 0.068, 0.066, 0.066, -0.202, -0.008], [1.075, 0.062, 0.06, 0.06, -0.21, -0.008]], K.w.bone('uarmR'), { n: 16 });
    K.tube('haft', [[-0.23, 1, 0.03], [-0.24, 0.74, 0.04]], [0.014, 0.014], K.w.bone('hips'));
    K.tube('mallet', [[-0.23, 1.04, -0.04], [-0.23, 1.04, 0.1]], [0.04, 0.04], K.w.bone('hips'));
    K.hair('hair', 'short', { underHat: true });
    K.panel('beard', [[1.458, 0.064, 0.097], [1.43, 0.066, 0.108], [1.39, 0.064, 0.12], [1.33, 0.058, 0.134], [1.28, 0.048, 0.16], [1.23, 0.034, 0.178], [1.19, 0.014, 0.178]], -66, 66, K.w.head, { n: 12 });
    K.shell('cap', [[1.578, 0.092, 0.11, 0.108], [1.62, 0.092, 0.11, 0.108], [1.665, 0.08, 0.094, 0.096, 0, -0.006], [1.71, 0.056, 0.062, 0.07, 0, -0.022], [1.74, 0.03, 0.032, 0.04, 0, -0.046], [1.75, 0.01, 0.01, 0.014, 0, -0.07]], K.w.head, { n: 24, capLast: true });
    K.shell('band', [[1.604, 0.097, 0.115, 0.113], [1.576, 0.098, 0.116, 0.114]], K.w.head, { n: 26 });
  },
};
    return PERSON; } },
  "pim": { name: "Pim", zone: 3, heightM: 0.99, person: function () {
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
    return PERSON; } },
  "passenger": { name: "The last passenger", zone: 3, heightM: 1.65, person: function () {
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
    return PERSON; } },
  "cutter": { name: "The bramble-cutter", zone: 3, heightM: 1.75, person: function () {
// The bramble-cutter: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "The bramble-cutter",
  height: 1.06,
  build: [1.18, 1.1],
  head: [0.95, 1, 0.96],
  skin: '#bc8a6a',
  colors: { torso: '#5a5a40', sleeve: '#5a5a40', forearm: '#4a3220', legs: '#4a4034', boots: { color: '#2e2218', rough: 0.6 }, soles: '#17110c' },
  parts: { tunic: { color: '#5a5a40', rough: 0.95 }, hood: { color: '#5a3e28', rough: 0.7 }, jerkin: { color: '#6a4a2e', rough: 0.65 }, chaps: { color: '#5a3e28', rough: 0.65 }, belt: { color: '#2a1c12', rough: 0.5 }, gauntlet: { color: '#4a3220', rough: 0.6 }, hook: { color: '#8a8a90', metal: 1, rough: 0.4 }, haft: '#7a5a3a', beard: '#5a3e2a', hair: '#5a3e2a' },
  face(F) {
    F.lips('#8a5648', 0.5); F.brows('#4a3020', 0.9, 20); F.eyes('#5a5a3a', 0.6); F.lines(0.4); F.underEye(0.4); F.beard('#5a3e2a', 0.8, 'beard'); F.stroke([[690, 420], [720, 470], [735, 520]], '#7a3a30', 0.35, 4);
  },
  make(K) {
    K.shell('tunic', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.122, 0.138], [0.79, 0.196, 0.152, 0.168], [0.65, 0.212, 0.186, 0.202], [0.6, 0.217, 0.191, 0.207]], K.w.skirt, { n: 28 });
    K.shell('jerkin', [[1.31, 0.158, 0.11, 0.112], [1.29, 0.158, 0.12, 0.113], [1.26, 0.158, 0.134, 0.114], [1.235, 0.158, 0.148, 0.116], [1.215, 0.158, 0.151, 0.118], [1.14, 0.152, 0.138, 0.116], [1.04, 0.152, 0.126, 0.118], [0.99, 0.164, 0.126, 0.125]], K.w.torso, { n: 28 });
    K.shell('jerkin', [[1.06, 0.156, 0.124, 0.122], [0.95, 0.179, 0.126, 0.136], [0.87, 0.196, 0.132, 0.148], [0.8, 0.204, 0.158, 0.17]], K.w.skirt, { n: 28 });
    K.shell('belt', [[1.057, 0.168, 0.139, 0.13], [1.012, 0.175, 0.141, 0.134]], K.w.torso, { n: 28 });
    K.shell('hood', [[1.39, 0.1, 0.092, 0.108], [1.35, 0.15, 0.112, 0.118], [1.31, 0.196, 0.13, 0.126], [1.25, 0.214, 0.16, 0.134], [1.21, 0.22, 0.168, 0.138]], K.w.torso, { n: 28 });
    K.shell('hood', [[1.682, 0.014, 0.016, 0.016, 0, -0.006], [1.668, 0.056, 0.066, 0.07, 0, -0.004], [1.64, 0.088, 0.106, 0.104], [1.612, 0.1, 0.118, 0.114]], K.w.head, { n: 24 });
    K.panel('hood', [[1.612, 0.1, 0.118, 0.114], [1.56, 0.106, 0.118, 0.12], [1.49, 0.106, 0.108, 0.12], [1.43, 0.1, 0.094, 0.116], [1.385, 0.112, 0.09, 0.112]], 58, 302, K.w.hair, { n: 22 });
    K.tube('gauntlet', [[0.213, 1.063, -0.008], [0.226, 1.02, -0.008], [0.262, 0.885, -0.008]], [0.06, 0.048, 0.035], K.w.bone('farmL'));
    K.tube('gauntlet', [[-0.213, 1.063, -0.008], [-0.226, 1.02, -0.008], [-0.262, 0.885, -0.008]], [0.06, 0.048, 0.035], K.w.bone('farmR'));
    K.tube('chaps', [[0.085, 0.5, 0], [0.085, 0.36, 0], [0.085, 0.27, 0.01]], [0.064, 0.055, 0.064], K.w.bone('shinL'));
    K.tube('chaps', [[-0.085, 0.5, 0], [-0.085, 0.36, 0], [-0.085, 0.27, 0.01]], [0.064, 0.055, 0.064], K.w.bone('shinR'));
    K.tube('haft', [[0.214, 1.02, 0.02], [0.226, 0.84, 0.03]], [0.014, 0.013], K.w.bone('hips'));
    K.tube('hook', [[0.226, 0.85, 0.03], [0.236, 0.7, 0.045], [0.232, 0.62, 0.085], [0.22, 0.61, 0.12]], [0.012, 0.03, 0.026, 0.006], K.w.bone('hips'));
    K.panel('beard', [[1.458, 0.062, 0.097], [1.43, 0.062, 0.106], [1.4, 0.056, 0.114], [1.36, 0.046, 0.122], [1.32, 0.032, 0.134], [1.3, 0.014, 0.132]], -66, 66, K.w.head, { n: 12 });
  },
};
    return PERSON; } },
  "passkeeper": { name: "The pass-keeper", zone: 4, heightM: 1.6, person: function () {
// The pass-keeper: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "The pass-keeper",
  height: 0.97,
  build: [1.18, 1.16],
  head: [0.95, 1, 0.95],
  skin: '#c8947c',
  colors: { torso: '#6a5440', sleeve: '#6a5440', forearm: '#6a5440', legs: '#4a4038', boots: { color: '#5a4a3a', rough: 0.9 }, soles: '#221a14' },
  parts: { coat: { color: '#6a5440', rough: 1, pattern: { kind: 'check', color: '#5c4836', n: 9 } }, fur: { color: '#c8bca8', rough: 1 }, hood: { color: '#6a5440', rough: 1 }, scarf: { color: '#a04a34', rough: 1 }, sash: { color: '#8a3a2a', rough: 0.95 }, mitten: { color: '#a04a34', rough: 1 }, hair: '#a8a49c', bootfur: { color: '#c8bca8', rough: 1 } },
  face(F) {
    F.lips('#a0625a', 0.5); F.brows('#9a968e', 0.75, 15); F.eyes('#5a6a7a', 0.6); F.lines(0.65); F.underEye(0.3); F.blush('#d0604e', 0.42); F.air(518, 490, 44, 38, '#d0604e', 0.22, 'color');
  },
  make(K) {
    K.shell('coat', [[1.36, 0.072, 0.071, 0.077], [1.325, 0.154, 0.102, 0.11], [1.29, 0.157, 0.118, 0.112], [1.26, 0.158, 0.135, 0.112], [1.235, 0.159, 0.15, 0.112], [1.215, 0.159, 0.153, 0.112], [1.185, 0.157, 0.146, 0.111], [1.14, 0.148, 0.131, 0.11], [1.04, 0.146, 0.118, 0.112], [0.99, 0.159, 0.118, 0.12]], K.w.torso, { n: 28 });
    K.shell('coat', [[1.06, 0.15, 0.116, 0.114], [0.95, 0.174, 0.118, 0.129], [0.87, 0.192, 0.124, 0.141], [0.79, 0.202, 0.155, 0.171], [0.65, 0.218, 0.19, 0.206], [0.52, 0.233, 0.204, 0.219], [0.44, 0.239, 0.21, 0.226], [0.3, 0.253, 0.222, 0.241]], K.w.skirt, { n: 30 });
    K.shell('fur', [[0.35, 0.256, 0.228, 0.246], [0.3, 0.262, 0.234, 0.252], [0.26, 0.258, 0.23, 0.248]], K.w.skirt, { n: 30 });
    K.shell('sash', [[1.07, 0.156, 0.134, 0.122], [1.02, 0.164, 0.136, 0.128]], K.w.torso, { n: 28 });
    K.tube('sash', [[-0.07, 1.03, 0.136], [-0.086, 0.92, 0.15], [-0.09, 0.82, 0.172]], [0.022, 0.022, 0.016], K.w.bone('hips'));
    K.shell('scarf', [[1.42, 0.076, 0.082, 0.078], [1.39, 0.096, 0.104, 0.094], [1.36, 0.11, 0.112, 0.102], [1.338, 0.1, 0.106, 0.098]], K.w.torso, { n: 24 });
    K.shell('hood', [[1.375, 0.118, 0.094, 0.112], [1.345, 0.164, 0.112, 0.12], [1.315, 0.186, 0.126, 0.126]], K.w.torso, { n: 26 });
    K.shell('hood', [[1.682, 0.014, 0.016, 0.016, 0, -0.006], [1.668, 0.056, 0.066, 0.07, 0, -0.004], [1.64, 0.088, 0.106, 0.104], [1.612, 0.1, 0.118, 0.114]], K.w.head, { n: 24 });
    K.panel('hood', [[1.612, 0.1, 0.118, 0.114], [1.56, 0.106, 0.118, 0.12], [1.49, 0.106, 0.108, 0.12], [1.43, 0.1, 0.094, 0.116], [1.385, 0.112, 0.09, 0.112]], 56, 304, K.w.hair, { n: 22 });
    K.tube('fur', [[-0.096, 1.44, 0.06], [-0.108, 1.52, 0.074], [-0.1, 1.6, 0.088], [-0.06, 1.655, 0.092], [0, 1.672, 0.092], [0.06, 1.655, 0.092], [0.1, 1.6, 0.088], [0.108, 1.52, 0.074], [0.096, 1.44, 0.06]], [0.018, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.022, 0.018], K.w.head);
    K.tube('fur', [[0.253, 0.915, -0.008], [0.268, 0.86, -0.008]], [0.046, 0.041], K.w.bone('farmL'));
    K.tube('fur', [[-0.253, 0.915, -0.008], [-0.268, 0.86, -0.008]], [0.046, 0.041], K.w.bone('farmR'));
    K.ball('mitten', [0.291, 0.772, 0], [0.04, 0.086, 0.046], K.w.bone('handL'));
    K.ball('mitten', [-0.291, 0.772, 0], [0.04, 0.086, 0.046], K.w.bone('handR'));
    K.tube('bootfur', [[0.085, 0.335, 0], [0.085, 0.285, 0.004]], [0.06, 0.064], K.w.bone('shinL'));
    K.tube('bootfur', [[-0.085, 0.335, 0], [-0.085, 0.285, 0.004]], [0.06, 0.064], K.w.bone('shinR'));
    K.panel('hair', [[1.606, 0.082, 0.102, 0.09], [1.56, 0.086, 0.1, 0.09], [1.51, 0.084, 0.092, 0.09]], 50, 92, K.w.head, { n: 6 });
    K.panel('hair', [[1.606, 0.082, 0.102, 0.09], [1.56, 0.086, 0.1, 0.09], [1.51, 0.084, 0.092, 0.09]], 268, 310, K.w.head, { n: 6 });
  },
};
    return PERSON; } },
  "sorrel": { name: "Sorrel", zone: 4, heightM: 1.63, person: function () {
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
    K.shell('jacket', [[1.352, 0.067, 0.069, 0.072], [1.325, 0.155, 0.099, 0.11], [1.29, 0.16, 0.121, 0.113], [1.26, 0.161, 0.14, 0.113], [1.235, 0.161, 0.158, 0.112], [1.215, 0.161, 0.162, 0.111], [1.185, 0.155, 0.152, 0.108], [1.14, 0.141, 0.123, 0.105], [1.04, 0.125, 0.102, 0.1], [0.985, 0.158, 0.117, 0.121]], K.w.torso, { n: 28 });
    K.shell('jacket', [[1.04, 0.13, 0.106, 0.104], [0.98, 0.16, 0.136, 0.14], [0.92, 0.18, 0.152, 0.158], [0.88, 0.19, 0.16, 0.168]], K.w.skirt, { n: 28 });
    K.shell('fur', [[0.905, 0.192, 0.164, 0.17], [0.87, 0.198, 0.17, 0.178]], K.w.skirt, { n: 28 });
    K.shell('fur', [[1.385, 0.076, 0.078, 0.082], [1.355, 0.118, 0.102, 0.108], [1.33, 0.166, 0.116, 0.12]], K.w.torso, { n: 24 });
    K.panel('apron', [[0.9, 0.2, 0.176], [0.8, 0.208, 0.186], [0.66, 0.224, 0.2], [0.54, 0.236, 0.212]], -34, 34, K.w.skirt, { n: 10 });
    K.shell('belt', [[1.075, 0.14, 0.12, 0.112], [1.04, 0.142, 0.118, 0.112]], K.w.torso, { n: 26 });
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
    return PERSON; } },
  "ede": { name: "Ede", zone: 4, heightM: 1.58, person: function () {
// Ede, the innkeeper: shapes on the shared template (the fair folk's kit). Coven of the Moon Faire, townsfolk job, November 24, 2026.
// A PROPOSAL: how this person looks is Chris's to say. Made new here; the colours are only first colours, for the grey guide and the size sheet:
// the painted skin replaces them. The kit's format: game/people/folk/person-kit.js reads it (window.MF_PERSON).
const PERSON = {
  name: "Ede, the innkeeper",
  height: 0.96,
  build: [1.04, 1.06],
  head: [1, 1, 1],
  skin: '#c8a08c',
  colors: { torso: '#6a6658', sleeve: '#6a6658', forearm: '#6a6658', legs: '#4a443e', boots: { color: '#4a3c30', rough: 0.85 }, soles: '#1c1612' },
  parts: { shirt: { color: '#6a6658', rough: 1 }, vest: { color: '#8a6a44', rough: 0.9 }, fleece: { color: '#d8ceb8', rough: 1 }, apron: { color: '#9a9484', rough: 0.95 }, tie: '#8a8474', hat: { color: '#5a4636', rough: 1 }, flap: { color: '#5a4636', rough: 1 }, hatfur: { color: '#a89a84', rough: 1 }, scarf: { color: '#3e5a4a', rough: 1 }, beard: '#d8d4cc', hair: '#c8c4bc', cuff: '#57534a', breeches: { color: '#4a443e', rough: 1 } },
  face(F) {
    F.lips('#96645c', 0.45); F.brows('#d0ccc4', 0.9, 20); F.eyes('#5a6a6a', 0.55); F.lines(0.95); F.underEye(0.5); F.blush('#c06454', 0.26); F.beard('#d8d4cc', 0.7, 'beard'); F.stroke([[430, 215], [518, 205], [606, 215]], '#6a4a40', 0.3, 5);
  },
  make(K) {
    K.shell('shirt', [[1.36, 0.07, 0.07, 0.074], [1.325, 0.15, 0.1, 0.106], [1.29, 0.152, 0.116, 0.108], [1.26, 0.153, 0.132, 0.108], [1.235, 0.154, 0.147, 0.108], [1.215, 0.154, 0.15, 0.108], [1.185, 0.152, 0.143, 0.107], [1.14, 0.144, 0.128, 0.106], [1.04, 0.142, 0.116, 0.108], [0.99, 0.154, 0.116, 0.115]], K.w.torso, { n: 26 });
    K.shell('breeches', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.124, 0.138], [0.8, 0.192, 0.13, 0.142], [0.74, 0.19, 0.126, 0.136]], K.w.skirt, { n: 26 });
    K.panel('vest', [[1.345, 0.118, 0.094, 0.1], [1.325, 0.16, 0.112, 0.114], [1.29, 0.162, 0.126, 0.116], [1.26, 0.163, 0.142, 0.117], [1.235, 0.164, 0.157, 0.118], [1.215, 0.164, 0.16, 0.118], [1.14, 0.154, 0.138, 0.116], [1.04, 0.152, 0.126, 0.118], [0.99, 0.164, 0.126, 0.125]], 26, 334, K.w.torso, { n: 26 });
    K.panel('vest', [[1.06, 0.156, 0.122, 0.12], [0.95, 0.18, 0.126, 0.134], [0.87, 0.196, 0.134, 0.146], [0.79, 0.206, 0.16, 0.174], [0.66, 0.218, 0.186, 0.2], [0.58, 0.224, 0.196, 0.21]], 30, 330, K.w.skirt, { n: 26 });
    K.panel('fleece', [[0.61, 0.23, 0.202, 0.216], [0.57, 0.232, 0.204, 0.218]], 30, 330, K.w.skirt, { n: 26 });
    K.shell('fleece', [[1.335, 0.16, 0.114, 0.116, 0.012, 0], [1.305, 0.18, 0.132, 0.124, 0.012, 0]], K.w.torso, { n: 26 });
    K.shell('fleece', [[1.335, 0.16, 0.114, 0.116, -0.012, 0], [1.305, 0.18, 0.132, 0.124, -0.012, 0]], K.w.torso, { n: 26 });
    K.shell('tie', [[1.03, 0.148, 0.126, 0.114], [0.995, 0.158, 0.126, 0.12]], K.w.torso, { n: 26 });
    K.panel('apron', [[1, 0.16, 0.13], [0.9, 0.186, 0.134], [0.8, 0.204, 0.16], [0.7, 0.214, 0.18], [0.62, 0.222, 0.192]], -30, 30, K.w.skirt, { n: 10 });
    K.shell('scarf', [[1.415, 0.074, 0.082, 0.076], [1.39, 0.092, 0.1, 0.092], [1.365, 0.104, 0.11, 0.1], [1.345, 0.096, 0.106, 0.096]], K.w.torso, { n: 24 });
    K.tube('scarf', [[0.06, 1.36, 0.106], [0.07, 1.24, 0.17], [0.078, 1.12, 0.15]], [0.026, 0.026, 0.022], K.w.torso);
    K.tube('cuff', [[0.256, 0.905, -0.008], [0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmL'));
    K.tube('cuff', [[-0.256, 0.905, -0.008], [-0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmR'));
    K.panel('beard', [[1.458, 0.06, 0.097], [1.432, 0.058, 0.104], [1.406, 0.048, 0.106], [1.386, 0.032, 0.099], [1.374, 0.014, 0.09]], -66, 66, K.w.head, { n: 12 });
    K.shell('hat', [[1.584, 0.094, 0.112, 0.11], [1.63, 0.096, 0.114, 0.112], [1.67, 0.09, 0.106, 0.104], [1.69, 0.066, 0.078, 0.076], [1.696, 0.02, 0.024, 0.024]], K.w.head, { n: 26, capLast: true });
    K.panel('hatfur', [[1.632, 0.102, 0.122, 0.11], [1.6, 0.106, 0.126, 0.11], [1.574, 0.1, 0.12, 0.11]], -64, 64, K.w.head, { n: 14 });
    K.panel('flap', [[1.6, 0.1, 0.116, 0.114], [1.54, 0.104, 0.112, 0.116], [1.47, 0.1, 0.1, 0.112], [1.43, 0.09, 0.09, 0.104]], 60, 300, K.w.head, { n: 22 });
  },
};
    return PERSON; } },
} };
