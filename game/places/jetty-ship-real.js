// jetty-ship-real.js: the Grey Hat's REAL ship at the end of the jetty's pier (Coven of the Moon Faire, the flight job,
// November 23, 2026). It takes the place of places/jetty-ship.js, the hub's stand-in: load this INSTEAD of that file,
// after places/jetty.js, game/flight/moored/skiff.js and game/flight/moored/moored-ship.js.
//
// She is the Skiff from Chris's airship game, Skies of Aethermoor: the first of the Captain's four ships, the one flown
// from Wickhollow (Chris, November 23, 19:40, as the hub reads it). 8 m long, 2.7 m in the beam, one mast with a pair
// of wing sails, a three-crystal sunstone cluster amidships, a gun at her prow and one on each rail. She is drawn by the
// place engine under the jetty's own night, from the baked ship (tools/flight-bake-ship.mjs).
//
// What the lamps need is kept, as the stand-in gave it:
//   W3D_PLACES.jetty.ship = { hooks: twelve spots, six a side, where a lamp hangs; at; length; beam }
// The lines speak of "her twelve lamp hooks". On so small a ship they stand close: an iron post on her rail every 0.8 m
// or so, six a side, from just forward of her wheel to her bow, each with an arm out over the water and the lamp hung
// under it, clear of her wing sails. The order is the order the lamps come home, as before: from the gangway outward,
// the pier's side first.
//
// She lies where the stand-in lay: across the end of the pier, 1.6 m off it, her bow to the west.
// THE FLIGHT JOB'S CALLS, each one line below: she rides low, her keel in the lake like a boat at a pier (RIDE), not
// hanging in the air; and it is her starboard side that lies to the pier (with her bow to the west it must be).
(function (G) {
  'use strict';
  const W3D = G.W3D, J = G.W3D_PLACES.jetty, SHIP = (G.COVEN_SHIPS || {}).skiff, extra0 = J.extra;
  if (!SHIP || !W3D.mooredShip) { console.error('jetty-ship-real.js: the baked ship or moored-ship.js is not loaded'); return; }
  const WATER = -1.6, DECK = -1.0;                       // the lake, and the pier's planks (the jetty's own numbers)
  const PX = (px) => (px - 768) * 0.04, PZ = (py) => (py - 512) * 0.05;   // the jetty's painting, in metres from its middle
  const RIDE = 0.95;                                     // her deck amidships above the lake, in metres (her keel is 1.3 m under her deck: 0.35 m of her in the water)
  const CLEAR = 1.6;                                     // how far her side lies off the pier's end
  const CX = PX(768) - 0.4, CZ = PZ(800) + CLEAR + SHIP.beam / 2;         // her middle, in the jetty's metres
  const AT = [CX, WATER + RIDE, CZ], TURN = -Math.PI / 2;                 // her bow to the west
  const S = W3D.mooredShip.spots(SHIP, { at: AT, turn: TURN });
  const PIER = -1;                                       // which of her sides is the pier's: -1 is starboard
  const GANG = -0.45;                                    // where the gangway meets her rail, in metres along her (0 amidships, forward is +)

  // the twelve hooks: six a side. Each is where a lamp hangs, in the jetty's metres.
  const HOOK_Z = [0.8, -1.75, 1.55, -2.5, 2.3, -3.25], POST_H = 0.95, ARM = 0.34, DROP = 0.34;
  const hooks = []; for (const z of HOOK_Z) for (const side of [PIER, -PIER]) hooks.push(S.rail(z, side, ARM, POST_H - DROP));
  // (the stand-in gave standIn, hooks, at, length and beam; ship, deck, bow and gangway are new, for the checks)
  J.ship = { standIn: false, ship: SHIP.id, hooks, at: [CX, WATER, CZ], length: SHIP.length, beam: SHIP.beam, deck: AT[1], bow: 'west', gangway: S.rail(GANG, PIER) };

  function build(K) {
    const B = K.B, T3 = G.THREE, solid0 = B.solid;
    W3D.mooredShip(K, SHIP, { at: AT, turn: TURN, glow: 0.45 });
    B.solid = false;
    const DARK = [0.4, 0.31, 0.28], ROPE = [1.3, 1.1, 0.78];
    const stick = (k, a, b, r, col, seg) => { const d = new T3.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = d.length(), g = new T3.CylinderGeometry(r, r, len, seg || 5, 1, true);
      B.geom(k, g, new T3.Matrix4().compose(new T3.Vector3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2), new T3.Quaternion().setFromUnitVectors(new T3.Vector3(0, 1, 0), d.normalize()), new T3.Vector3(1, 1, 1)), col, [1, 1]); g.dispose(); };
    // ---- the twelve lamp hooks: an iron post on the rail, an arm out over the water, a ring. Bare until a lamp comes home ----
    for (const z of HOOK_Z) for (const side of [-1, 1]) { const foot = S.rail(z, side, 0, -0.06), head = S.rail(z, side, 0, POST_H), tip = S.rail(z, side, ARM, POST_H);
      stick('iron', foot, head, 0.026, null, 5); stick('iron', head, tip, 0.02, null, 4); stick('iron', tip, [tip[0], tip[1] - 0.1, tip[2]], 0.014, null, 4); }
    // ---- the gangway from the pier's end up to her rail, and her two lines to the bollards there ----
    { const r0 = S.rail(GANG - 0.4, PIER, 0.04, 0.02), r1 = S.rail(GANG + 0.4, PIER, 0.04, 0.02), pz = PZ(800) - 0.25, y = DECK + 0.02;
      const a = [r0[0], y, pz], b = [r1[0], y, pz], quad = (k, p, q, r, s, col) => { B.quad(k, p, q, r, s, null, col); B.quad(k, s, r, q, p, null, col); };
      quad('deck', a, b, r1, r0, [0.9, 0.86, 0.86]);
      for (let i = 1; i < 6; i++) { const t = i / 6, p = [a[0] + (r0[0] - a[0]) * t, a[1] + (r0[1] - a[1]) * t + 0.03, a[2] + (r0[2] - a[2]) * t], q = [b[0] + (r1[0] - b[0]) * t, b[1] + (r1[1] - b[1]) * t + 0.03, b[2] + (r1[2] - b[2]) * t]; stick('wood', p, q, 0.022, DARK, 4); }   // cleats for the feet
      stick('wood', a, r0, 0.04, DARK, 4); stick('wood', b, r1, 0.04, DARK, 4); }
    for (const [px, z] of [[727, 1.9], [815, -2.9]]) stick('wood', [PX(px), -0.62, PZ(806)], S.rail(z, PIER, 0, -0.1), 0.03, ROPE, 4);
    B.solid = solid0;
  }
  J.extra = function (K) { extra0.call(this, K); try { build(K); } catch (e) { console.error(e); } };
})(window);
