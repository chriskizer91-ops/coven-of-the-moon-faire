// moored-ship.js: draws one of Skies of Aethermoor's ships moored in a place, under that place's own night (Coven of the
// Moon Faire, the flight job, November 23, 2026). Three.js r128, the place engine's own surfaces (W3D.mat: moonlight,
// the lamps' warm light, shade, fog). Load after the place engine and a baked ship (game/flight/moored/skiff.js).
//
// A ship is built by Skies' code for a newer three.js, so she is baked once into plain data (tools/flight-bake-ship.mjs)
// and drawn here from that: the same shape, wearing the same painted pieces (game/flight/assets/ships/: her planks, her
// deck boards, her brass band and the parts sheet her sails, crystals and fins are cut from). She stands still: her
// sails do not ripple and she does not sway, and she carries no lanterns of her own.
//
//   const ship = W3D.mooredShip(K, COVEN_SHIPS.skiff, { at: [x, y, z], turn })       inside a place's extra(K)
//     at     where her deck amidships is, in the place's metres
//     turn   which way her bow points: 0 south (+z), -Math.PI / 2 west (-x), Math.PI north, Math.PI / 2 east
//   ship.spot(sx, sy, sz)     a spot in her own measure (x to port, y up, z to the bow) as a spot in the place
//   ship.rail(z, side)        the top of her rail at z along her, on side 1 (port) or -1 (starboard), in the place
//   W3D.mooredShip.spots(shipData, { at, turn })   the same two, with no place being built (for laying out lamp hooks)
(function (G) {
  'use strict';
  const W3D = G.W3D;
  // the painted pieces: named as the places name theirs, so the build puts them inside the page
  const PICS = { planks: "./../flight/assets/ships/planks.webp", deck: "./../flight/assets/ships/deck.webp", band: "./../flight/assets/ships/band.webp", parts: "./../flight/assets/ships/parts.webp", plates: "./../flight/assets/ships/plates.webp" };
  // each of her materials as a surface of the night: which painted piece, what tint, how shiny. The names are Skies' own
  // (its src/ship/materials.js), and the colours are the ones it gives them.
  //   cutw: thins away only when the camera is boxed in;  cut: thins away between the camera and Io (a sail, a rope)
  const LOOK = {
    hull: { pic: 'planks', repeat: true, cutw: true, shade: 0.4, vary: 0.1 },
    plates: { pic: 'plates', repeat: true, cutw: true, tint: 0xc8c8cc, spec: 0.3, shade: 0.4 },
    deck: { pic: 'deck', repeat: true, cutw: true, shade: 0.5 },
    band: { pic: 'band', repeat: true, cutw: true, tint: 0xd8d2cc, spec: 0.45, shade: 0.4 },
    brass: { tint: 0xb48c40, spec: 0.8, shade: 0.4 },               // (Skies: 0xd9a743, under a sun; a shade darker for the night)
    bronze: { tint: 0x8a5e2c, spec: 0.4, shade: 0.4 },              // (Skies: 0xa06a2e)
    wood: { pic: 'deck', repeat: true, tint: 0xc49a74, shade: 0.5 },
    rope: { tint: 0x8a6a48, cut: true, shade: 0.4 },
    dark: { tint: 0x140b06, shade: 0.4 },
    canvas: { pic: 'parts', cut: true, shade: 0.3 },
    parts: { pic: 'parts', alphaTest: 0.45, glowmap: true, shade: 0.4 },
    crystal: { tint: 0xffa23a, lit: 0.45, emis: 0x6a3000 },          // sunstone, amber and low: lit a little from within
    gem: { pic: 'parts', lit: 0.45, emis: 0x4a2400 },
    flag: { cut: true, shade: 0.3 },
  };
  const bytes = (s) => { const b = atob(s), a = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) a[i] = b.charCodeAt(i); return a.buffer; };

  function spots(ship, o) {
    const at = o.at, c = Math.cos(o.turn || 0), s = Math.sin(o.turn || 0), R = ship.rail;
    const spot = (sx, sy, sz) => [at[0] + sx * c + sz * s, at[1] + sy, at[2] - sx * s + sz * c];
    // her rail's top at z along her: between the two measured stations either side
    const railAt = (z) => { let i = 0; while (i < R.length - 2 && R[i + 1][0] < z) i++; const a = R[i], b = R[i + 1], t = Math.max(0, Math.min(1, (z - a[0]) / (b[0] - a[0]))); return [a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; };
    return { spot, rail: (z, side, out, up) => { const r = railAt(z); return spot((side || 1) * (r[0] + (out || 0)), r[1] + (up || 0), z); }, railAt };
  }

  // the surfaces are made when the place builds its meshes: they share the place's own night (its moon, fog and lamps)
  function surfaces(B) {
    if (B.__shipLook) return; B.__shipLook = true;
    const T = G.THREE, build0 = B.build, tex = {};
    const picture = (id, repeat) => { const k = id + (repeat ? '+' : ''); if (tex[k]) return tex[k];
      const t = tex[k] = new T.Texture(); t.wrapS = t.wrapT = repeat ? T.RepeatWrapping : T.ClampToEdgeWrapping; t.anisotropy = 4; t.minFilter = T.LinearMipmapLinearFilter; t.magFilter = T.LinearFilter;
      t.image = W3D.flatImage([120, 100, 90]); t.needsUpdate = true;
      const im = new Image(); im.onload = () => { t.image = im; t.needsUpdate = true; }; im.src = PICS[id]; return t; };
    B.build = function (mats) {
      const U = mats.iron.uniforms;          // every surface of the place carries the night's shared settings
      for (const k of B.keys()) { if (k.indexOf('ship_') !== 0 || mats[k]) continue;
        const L = LOOK[k.slice(5)] || {}, o = Object.assign({ side: T.DoubleSide }, L);
        if (L.pic) { o.map = picture(L.pic, L.repeat); o.rep = 1; }
        mats[k] = W3D.mat(U, o); }
      return build0.call(this, mats);
    };
  }

  W3D.mooredShip = function (K, ship, o) {
    const T = G.THREE, B = K.B, S = spots(ship, o), solid0 = B.solid;
    const m4 = new T.Matrix4().makeRotationY(o.turn || 0).setPosition(o.at[0], o.at[1], o.at[2]);
    B.solid = false;                        // (her solid is one box, below: not one for every piece)
    for (const key in ship.parts) {
      const P = ship.parts[key], g = new T.BufferGeometry(), k = ship.reach / 32767;
      const pos = new Float32Array(new Int16Array(bytes(P.pos))); for (let i = 0; i < pos.length; i++) pos[i] *= k;
      const n8 = new Int8Array(bytes(P.nor)), nor = new Float32Array(P.corners * 3); for (let i = 0; i < P.corners; i++) { nor[i * 3] = n8[i * 4] / 127; nor[i * 3 + 1] = n8[i * 4 + 1] / 127; nor[i * 3 + 2] = n8[i * 4 + 2] / 127; }
      g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('normal', new T.BufferAttribute(nor, 3));
      g.setAttribute('uv', new T.BufferAttribute(new Float32Array(bytes(P.uv)), 2));
      if (P.col) { const c8 = new Uint8Array(bytes(P.col)), col = new Float32Array(c8.length); for (let i = 0; i < c8.length; i++) col[i] = c8[i] / 255; g.setAttribute('color', new T.BufferAttribute(col, 4)); }
      g.setIndex(new T.BufferAttribute(P.wide ? new Uint32Array(bytes(P.idx)) : new Uint16Array(bytes(P.idx)), 1));
      const flat = g.toNonIndexed(), ca = flat.attributes.color;
      B.geom('ship_' + key, flat, m4, ca ? (v, i) => [ca.getX(i), ca.getY(i), ca.getZ(i)] : null, 1);
      g.dispose(); flat.dispose();
    }
    B.solid = solid0;
    surfaces(B);
    // her crystals' own light, low (o.glow: how strong, 1 as Skies has it in flight)
    const gk = o.glow == null ? 0.5 : o.glow;
    for (const q of ship.glows) { const p = S.spot(q[0], q[1], q[2]); K.halo(p[0], p[1], p[2], q[3] * 1.6, [q[4] * gk, q[5] * gk, q[6] * gk]); }
    // one solid for her hull, so nobody walks into her and the camera never sits inside her
    const H = ship.hull, hb = ship.beam / 2 - 0.2, c = [[-hb, H.stern + 0.5], [hb, H.stern + 0.5], [hb, H.bow - 0.6], [-hb, H.bow - 0.6]].map((q) => { const p = S.spot(q[0], 0, q[1]); return [p[0], p[2]]; });
    B.solids.push({ k: 'wood', y0: o.at[1] + H.keel, y1: o.at[1] + 1.0, poly: c });
    return S;
  };
  W3D.mooredShip.spots = spots;
})(window);
