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
    K.shell('coat', [[1.352, 0.064, 0.064, 0.068], [1.325, 0.147, 0.09, 0.099], [1.27, 0.147, 0.122, 0.103], [1.215, 0.145, 0.13, 0.105], [1.14, 0.132, 0.112, 0.099], [1.04, 0.119, 0.094, 0.094], [0.985, 0.15, 0.108, 0.114]], K.w.torso, { n: 28 });
    K.shell('coat', [[1.04, 0.122, 0.097, 0.097], [0.96, 0.156, 0.118, 0.122], [0.87, 0.18, 0.134, 0.144], [0.74, 0.196, 0.164, 0.178], [0.56, 0.212, 0.196, 0.208], [0.36, 0.228, 0.212, 0.226], [0.2, 0.246, 0.226, 0.242], [0.1, 0.262, 0.238, 0.256]], K.w.skirt, { n: 30 });
    K.shell('hem', [[0.15, 0.262, 0.238, 0.256], [0.1, 0.27, 0.246, 0.264]], K.w.skirt, { n: 30 });
    K.shell('sash', [[1.085, 0.132, 0.108, 0.102], [1.02, 0.136, 0.11, 0.108]], K.w.torso, { n: 26 });
    K.tube('sash', [[0.086, 1.04, 0.106], [0.104, 0.9, 0.136], [0.112, 0.74, 0.166]], [0.022, 0.024, 0.018], K.w.bone('hips'));
    K.shell('mantle', [[1.375, 0.078, 0.078, 0.084], [1.345, 0.13, 0.098, 0.106], [1.31, 0.184, 0.114, 0.12], [1.26, 0.206, 0.132, 0.128], [1.225, 0.212, 0.138, 0.132]], K.w.torso, { n: 28 });
    K.panel('collar', [[1.455, 0.078, 0.07, 0.086], [1.41, 0.07, 0.068, 0.078], [1.37, 0.074, 0.074, 0.08]], 38, 322, K.w.torso, { n: 20 });
    K.ball('silver', [0, 1.345, 0.1], [0.024, 0.03, 0.01], K.w.torso);
    K.ball('silver', [0, 1.052, 0.116], [0.02, 0.026, 0.008], K.w.torso);
    K.tube('cuff', [[0.249, 0.93, -0.008], [0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmL'));
    K.tube('cuff', [[-0.249, 0.93, -0.008], [-0.27, 0.855, -0.008]], [0.04, 0.035], K.w.bone('farmR'));
    K.hair('hair', 'short');
    K.ball('hair', [0, 1.678, -0.044], [0.06, 0.05, 0.062], K.w.head);
    K.tube('silver', [[-0.082, 1.672, -0.044], [0.082, 1.692, -0.048]], [0.006, 0.006], K.w.head);
  },
};
