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
    K.shell('coat', [[1.352, 0.067, 0.068, 0.071], [1.325, 0.153, 0.095, 0.104], [1.27, 0.153, 0.129, 0.108], [1.215, 0.151, 0.138, 0.11], [1.14, 0.137, 0.119, 0.104], [1.04, 0.124, 0.1, 0.099], [0.985, 0.156, 0.114, 0.12]], K.w.torso, { n: 28 });
    K.shell('coat', [[1.04, 0.126, 0.102, 0.102], [0.96, 0.16, 0.124, 0.128], [0.87, 0.186, 0.134, 0.146], [0.76, 0.204, 0.166, 0.18], [0.6, 0.222, 0.196, 0.21], [0.44, 0.238, 0.212, 0.228], [0.32, 0.25, 0.222, 0.24]], K.w.skirt, { n: 30 });
    K.shell('trim', [[0.36, 0.252, 0.224, 0.242], [0.32, 0.256, 0.228, 0.246]], K.w.skirt, { n: 30 });
    K.shell('belt', [[1.07, 0.132, 0.108, 0.104], [1.025, 0.14, 0.114, 0.11]], K.w.torso, { n: 26 });
    K.ball('buckle', [0, 1.047, 0.118], [0.024, 0.026, 0.008], K.w.torso);
    K.shell('cape', [[1.38, 0.078, 0.078, 0.084], [1.35, 0.13, 0.1, 0.108], [1.315, 0.186, 0.118, 0.122], [1.25, 0.214, 0.14, 0.134], [1.19, 0.226, 0.15, 0.142], [1.15, 0.23, 0.152, 0.146]], K.w.torso, { n: 28 });
    K.shell('trim', [[1.17, 0.234, 0.156, 0.15], [1.15, 0.236, 0.158, 0.152]], K.w.torso, { n: 28 });
    K.shell('scarf', [[1.425, 0.07, 0.076, 0.072], [1.395, 0.09, 0.098, 0.09], [1.37, 0.1, 0.104, 0.096]], K.w.torso, { n: 24 });
    K.tube('strap', [[0.118, 1.37, 0.02], [0.104, 1.32, 0.13], [0, 1.17, 0.16], [-0.11, 1.03, 0.124], [-0.176, 0.97, 0.046]], [0.012, 0.012, 0.012, 0.012, 0.012], K.w.torso);
    K.tube('horn', [[-0.2, 0.99, -0.05], [-0.214, 0.94, 0.01], [-0.218, 0.9, 0.08], [-0.21, 0.89, 0.15]], [0.012, 0.022, 0.032, 0.04], K.w.bone('hips'));
    K.tube('glove', [[0.25, 0.93, -0.008], [0.268, 0.862, -0.008]], [0.042, 0.036], K.w.bone('farmL'));
    K.tube('glove', [[-0.25, 0.93, -0.008], [-0.268, 0.862, -0.008]], [0.042, 0.036], K.w.bone('farmR'));
    K.hair('hair', 'bob', { underHat: true });
    K.shell('crown', [[1.6, 0.094, 0.112, 0.11], [1.66, 0.096, 0.114, 0.112], [1.695, 0.09, 0.106, 0.104], [1.7, 0.04, 0.046, 0.046]], K.w.head, { n: 26, capLast: true });
    K.shell('hat', [[1.652, 0.104, 0.122, 0.12], [1.615, 0.11, 0.128, 0.126], [1.58, 0.104, 0.122, 0.12], [1.572, 0.094, 0.112, 0.11]], K.w.head, { n: 28 });
    K.ball('badge', [0, 1.618, 0.13], [0.02, 0.024, 0.008], K.w.head);
  },
};
