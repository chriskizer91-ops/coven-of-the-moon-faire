// landing-ships.js: the Grey Hat's ship where she lies at the landings of zones 2 and 3 (Coven of the Moon Faire, the
// journey job, November 24, 2026). Zone 1's is the flight job's (places/jetty-ship-real.js). The ship is one of Skies of
// Aethermoor's, baked to plain data (game/flight/moored/, tools/flight-bake-ship.mjs) and drawn by the place engine under
// the place's own night (W3D.mooredShip, the flight job's). Load after the zone's places, a baked ship and
// game/flight/moored/moored-ship.js, then call W3D.landingShips.moor('<landing id>').
//
// What the lines say, and so what is seen (the lines are not changed; where the table of ships and a line disagree, the
// line wins):
//   zone 2  "the ship sets down at the Warm Roads camp": she lies on its roped landing ground, west of the tents, where
//           the Grey Hat stands ("west of the tents, where the ship came down", game/people/zone-2.js).
//   zone 3  "the ship sets down at the northern camp" and "She needs work before she'll go further": she lies on the
//           camp's landing ground. Then the Grey Hat takes her down the coast to the shipyard: "The ship is up on the
//           slip, and will be for a while"; Tock: "New ribs, new keelson, same old ship". So once the Grey Hat has gone
//           to the slip (he goes when the coven is far off), she is no longer at the camp but up on the slip's cradle,
//           and both are shown at the same moment. She is the same ship that flew in, being refitted, not a bigger one.
//
// WHICH SHIP (the journey job's call, one line each below, `ship`): the Cutter at both. The table of ships
// (game/flight/flight-data.js, shipFrom) flies the Cutter from the Warm Roads, so the ship that lies at zone 2 is the one
// the coven will board there; she is the ship that flies into zone 3, and zone 3's lines say that ship is refitted, not
// changed (and the Brig, 25 m long, would not fit the slip, which is 17 m). The flight out of zone 3 is the Brig, by the
// table: the refit is where she becomes the bigger ship. The other choices are in the journey slip.
// She sits on her keel, upright, on the ground (an airship set down), not hanging in the air.
(function (G) {
  'use strict';
  const W3D = G.W3D = G.W3D || {};
  const TURN = { south: 0, west: -Math.PI / 2, north: Math.PI, east: Math.PI / 2 };
  //   place  the place she lies in         at  her middle, in its painting      bow  which way she points
  //   deck   the ground under her keel, in metres (left out: the place's own ground there)
  //   until  (zone 3) shown until the Grey Hat has gone to the other one's place
  //   when   (zone 3) 'camp': until the Grey Hat has gone to the slip; 'slip': on the slip, the refit not done;
  //          'refit': on the slip, the refit done (zone 3's story at stage 4: "Refit's done. She'll fly higher")
  // CHRIS, November 24, 12:00 (the hub's reading, fitted to the lines): the Skiff fitted out (skiff2) at zone 2, and at
  // zone 3 until her refit ("That skiff is held together by stubbornness and blue thread", Tock); after it, the Cutter.
  const SHIPS = {
    warmCamp: [
      { id: 'camp', place: 'warm-roads-camp', ship: 'skiff2', at: [300, 460], bow: 'west', glow: 0.45 },
    ],
    northCamp: [
      { id: 'camp', place: 'northern-camp', ship: 'skiff2', at: [330, 450], bow: 'west', when: 'camp' },
      { id: 'slip', place: 'shipyard', ship: 'skiff2', at: [764, 300], bow: 'north', deck: 0.25, when: 'slip' },       // on the slip's cradle, her bow to its head
      { id: 'refit', place: 'shipyard', ship: 'cutter', at: [764, 248], bow: 'north', deck: 0.25, when: 'refit' },     // the same berth, after the refit
    ],
  };
  // every ship carries twelve lamp hooks, six a side (the lamps came home in zone 1), each with its lamp, lit: where
  // along her (0 amidships, +1 her bow's end of the rail, -1 her stern's), as the jetty's Skiff carries them
  const HOOKS = [0.1, -0.22, 0.2, -0.32, 0.3, -0.42], POST_H = 0.95, ARM = 0.34, DROP = 0.34;
  const LIFT = 0.04;                 // her keel this far over the ground (so it does not flicker into it)
  let moored = [], shownId = null;

  // small-things: each lamp is a lantern like the place engine's own (K.lantern: an iron base, cap and corner bars round
  // warm glass), as zone 4's ship and the jetty's lamps are, not a bare box of over-bright glass (it drew as a plain white
  // block). `lit` is K.lantern itself where the ship is drawn into the place (zone 2: with its halo and light); where she
  // is drawn apart, to be shown or moved away (zone 3), the same lantern is drawn into her own builder with no halo, so a
  // ship moved away leaves no glow behind
  const LANTERN = 0.62;              // its size, as zone 4's ship's (game/places/zone-4.js)
  function lanternIn(B, x, y, z, s) {
    B.box('iron', x, y + 0.3 * s, z, 0.03, 0.4, 0.03, 0);
    B.box('iron', x, y - 0.03 * s, z, 0.26 * s, 0.05 * s, 0.26 * s, 0);
    // left-overs (November 25, 2026): as the engine's own lantern now is, see-through glass and a flame inside that leans
    if (B.leaning) { B.box('lampGlass', x, y, z, 0.2 * s, 0.3 * s, 0.2 * s, 0, [0.62, 0.42, 0.24], { solid: false }); B.leaning(y + 0.04 * s, () => { B.cyl('glass', x, y + 0.04 * s, z, 0.055 * s, 0, 0.2 * s, 7, [2.0, 0.95, 0.32]); B.cyl('glass', x, y + 0.04 * s, z, 0.03 * s, 0, 0.12 * s, 6, [2.4, 1.75, 0.85]); }); }
    else B.box('glass', x, y, z, 0.2 * s, 0.3 * s, 0.2 * s, 0, [1.6, 1.1, 0.62]);
    B.box('iron', x, y + 0.3 * s, z, 0.3 * s, 0.06 * s, 0.3 * s, 0);
    B.cyl('iron', x, y + 0.36 * s, z, 0.16 * s, 0.02, 0.14 * s, 4);
    for (const [dx, dz] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) B.box('iron', x + dx * 0.1 * s, y, z + dz * 0.1 * s, 0.025, 0.3 * s, 0.025, 0);
  }
  function hooks(B, S, SHIP, lit) {
    const L = SHIP.hull.bow - SHIP.hull.stern, mid = (SHIP.hull.bow + SHIP.hull.stern) / 2, T3 = G.THREE, solid0 = B.solid; B.solid = false;
    const stick = (a, b, r) => { const d = new T3.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]), len = d.length(), g = new T3.CylinderGeometry(r, r, len, 5, 1, true);
      B.geom('iron', g, new T3.Matrix4().compose(new T3.Vector3((a[0] + b[0]) / 2, (a[1] + b[1]) / 2, (a[2] + b[2]) / 2), new T3.Quaternion().setFromUnitVectors(new T3.Vector3(0, 1, 0), d.normalize()), new T3.Vector3(1, 1, 1)), null, [1, 1]); g.dispose(); };
    for (const f of HOOKS) for (const side of [-1, 1]) { const z = mid + f * L * 0.8, foot = S.rail(z, side, 0, -0.06), head = S.rail(z, side, 0, POST_H), tip = S.rail(z, side, ARM, POST_H), lamp = S.rail(z, side, ARM, POST_H - DROP);
      stick(foot, head, 0.026); stick(head, tip, 0.02); stick(tip, [lamp[0], lamp[1] + 0.12, lamp[2]], 0.012);
      if (lit) lit(lamp[0], lamp[1] - 0.09, lamp[2], null, LANTERN, true); else lanternIn(B, lamp[0], lamp[1] - 0.09, lamp[2], LANTERN); }     // small-things: a lantern, where a glass box was
    B.solid = solid0;
  }
  function build(K, e, alone, i) {
    const SHIP = (G.COVEN_SHIPS || {})[e.ship];
    if (!SHIP || !W3D.mooredShip) { console.error('landing-ships.js: the baked ship ' + e.ship + ' or moored-ship.js is not loaded'); return; }
    const x = K.X(e.at[0]), z = K.Z(e.at[1]), ground = e.deck != null ? e.deck : K.gh(e.at[0], e.at[1]);
    const at = [x, ground - SHIP.hull.keel + LIFT, z], turn = TURN[e.bow] || 0;
    e.hull = SHIP.hull; e.beam = SHIP.beam; e.length = SHIP.length;
    if (alone) { const S = W3D.mooredShip(K, SHIP, { at, turn, glow: e.glow == null ? 0.45 : e.glow }); hooks(K.B, S, SHIP, K.lantern); return; }     // small-things: K.lantern (its halo and light too)
    // one of two places she can be: drawn apart, so she can be shown in one and not the other
    const fb = K.far(1e6 + i * 1000, 1e6);
    const S = W3D.mooredShip(Object.assign({}, K, { B: fb, halo: () => {} }), SHIP, { at, turn, glow: 0 });
    fb.solids.pop(); hooks(fb, S, SHIP);                                  // (her solid is a blocker on the land instead, below: it can be taken away)
    const b0 = fb.build; fb.build = function (m) { const r = b0.call(this, m); e.meshes = Object.values(r); show(shownId); return r; };
  }
  function show(id) {
    shownId = id;
    for (const e of moored) { const on = !id || e.id === id;
      for (const m of e.meshes || []) { m.position.y = on ? 0 : -500; m.updateMatrix(); m.matrixWorldNeedsUpdate = true; }     // (the land culls its far pieces by distance each frame, so they are moved away, not hidden)
      if (e.blk) { e.blk.w = on ? e.blk.w0 : 0; e.blk.d = on ? e.blk.d0 : 0; } }
  }

  W3D.landingShips = {
    // draw this landing's ship (or ships) when their places are built
    moor(landing) {
      moored = (SHIPS[landing] || []).map((e) => Object.assign({}, e));
      const alone = moored.length === 1;
      moored.forEach((e, i) => {
        const P = (G.W3D_PLACES || {})[e.place]; if (!P) { console.error('landing-ships.js: no place ' + e.place); return; }
        const extra0 = P.extra;
        P.extra = function (K) { if (extra0) extra0.call(this, K); try { build(K, e, alone, i); } catch (err) { console.error(err); } };
      });
      if (!alone) shownId = moored[0].id;
    },
    // the zone page is ready: the blockers for a ship that can be taken away, and the watch on the Grey Hat
    ready(o) {
      if (moored.length < 2 || !o.W) return;
      const Z = o.W.P, L = Z.land, blks = [];
      for (const e of moored) {
        const part = Z.parts.find((p) => p.id === e.place); if (!part || !e.hull) continue;
        const PM = part.P.M, cx = part.ox + PM.x(e.at[0]), cz = part.oz + PM.z(e.at[1]), half = (e.hull.bow - e.hull.stern) / 2, mid = (e.hull.bow + e.hull.stern) / 2, hb = e.beam / 2 - 0.15;
        const along = e.bow === 'west' ? [-1, 0] : e.bow === 'east' ? [1, 0] : e.bow === 'north' ? [0, -1] : [0, 1];
        const x = cx + along[0] * mid, z = cz + along[1] * mid, lengthwiseX = along[0] !== 0;
        e.blk = { x, z, a: 0, w0: lengthwiseX ? half : hb, d0: lengthwiseX ? hb : half }; e.blk.w = e.blk.w0; e.blk.d = e.blk.d0; e.c = [cx, cz];
        blks.push(e.blk);
      }
      if (L && L.addBlockers) L.addBlockers(blks);
      const slip = moored.find((e) => e.when === 'slip'), by = (w) => (moored.find((e) => e.when === w) || moored[0]).id;
      const watch = () => {
        const P = G.__people, cap = P && P.list && P.list.find((p) => p.id === 'captain'), st = G.__story && G.__story.state();
        const there = !!(cap && slip && slip.c && Math.hypot(cap.x - slip.c[0], cap.z - slip.c[1]) < 30);
        const want = !there ? by('camp') : st && st.stage >= 4 ? by('refit') : by('slip'); if (want !== shownId) show(want);
      };
      watch(); setInterval(watch, 500);
    },
    shown: () => shownId,
    list: () => moored.map((e) => ({ id: e.id, place: e.place, ship: e.ship, shown: !shownId || shownId === e.id, meshes: (e.meshes || []).length, blocker: e.blk ? { x: +e.blk.x.toFixed(2), z: +e.blk.z.toFixed(2), w: e.blk.w, d: e.blk.d } : null })),
    show,
  };
})(window);
