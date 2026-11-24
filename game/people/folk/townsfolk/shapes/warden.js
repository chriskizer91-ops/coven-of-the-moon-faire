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
    K.shell('mail', [[1.36, 0.07, 0.07, 0.074], [1.32, 0.15, 0.1, 0.102], [1.25, 0.148, 0.13, 0.106], [1.215, 0.148, 0.134, 0.108], [1.14, 0.142, 0.126, 0.106], [1.04, 0.142, 0.116, 0.108], [0.99, 0.154, 0.116, 0.115]], K.w.torso, { n: 28 });
    K.shell('mail', [[1.06, 0.146, 0.114, 0.112], [0.95, 0.169, 0.116, 0.126], [0.87, 0.186, 0.122, 0.138], [0.79, 0.196, 0.152, 0.168], [0.65, 0.212, 0.186, 0.202], [0.58, 0.22, 0.194, 0.209]], K.w.skirt, { n: 28 });
    K.panel('tabard', [[1.34, 0.104, 0.108], [1.25, 0.122, 0.14], [1.215, 0.122, 0.144], [1.14, 0.12, 0.136], [1.04, 0.12, 0.126], [0.99, 0.124, 0.126]], -46, 46, K.w.torso, { n: 12 });
    K.panel('tabard', [[1.06, 0.15, 0.126], [0.95, 0.176, 0.128], [0.87, 0.194, 0.134], [0.79, 0.204, 0.164], [0.66, 0.218, 0.194], [0.52, 0.232, 0.21]], -36, 36, K.w.skirt, { n: 12 });
    K.panel('tabard', [[1.34, 0.104, 0.1, 0.112], [1.215, 0.12, 0.1, 0.118], [1.04, 0.12, 0.1, 0.118], [0.99, 0.124, 0.1, 0.124]], 134, 226, K.w.torso, { n: 10 });
    K.panel('trim', [[0.56, 0.236, 0.214], [0.52, 0.24, 0.218]], -36, 36, K.w.skirt, { n: 12 });
    K.ball('ember', [0, 1.2, 0.146], [0.03, 0.046, 0.008], K.w.torso);
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
