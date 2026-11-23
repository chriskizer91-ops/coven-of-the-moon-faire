// fair.js: the Moon Faire's camp on the land, built from Moon Faire's fair kit (ow-kit.js, copied unchanged) and lit by
// the place engine's night (Coven of the Moon Faire, zone 1, November 18, 2026).
//
// The kit was written for Moon Faire's open world, where a small set of helpers called OW gave it its pictures, its
// light and its fog. This file gives it the same helpers by the same names, but pointing at this game's night, so the
// tents stand under the same moon, sky and fog as the towns:
//   OW.tex       loads one of the kit's pictures
//   OW.GLSL      the place engine's night (core.js), with the three small functions the kit calls: s2l, owLight, owFog
//   OW.out       how a colour is written to the screen here
//   OW.U         the night's numbers, plus the camp's own lamplight (below)
//   OW.glowTex, OW.glowOnly   the soft glow round a lamp
// Load order: this file, then fair/data/kit-data.js, then fair/ow-kit.js.
//
// W3D.fair.build(Z, camp) sets the camp down. `camp` is data (places/zone-1.js): where its middle is, how wide, and a
// list of pieces, each [kind, { x, z, turn, ... }] with x and z measured from the camp's middle. A piece with
// `face: true` is turned to face the middle. The camp's lamplight is painted once into a small picture (a warm pool
// under every lantern and fire), which lights the tents and, through the land engine, the ground between them.
(function (G) {
  'use strict';
  const W3D = G.W3D, OW = G.OW = G.OW || {};
  const cache = new Map();
  OW.tex = function (src, o) {
    o = o || {}; const key = src + (o.repeat ? '#r' : ''); if (cache.has(key)) return cache.get(key);
    const t = new THREE.Texture(), im = new Image(); cache.set(key, t);
    t.anisotropy = 4; if (o.repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.ready = new Promise((ok, bad) => { im.onload = () => { t.image = im; t.needsUpdate = true; ok(t); }; im.onerror = () => bad(new Error('a fair picture did not load')); });
    im.src = src; return t;
  };
  // the night's shader, less the four names the kit declares for itself, and with the lamplight picture under a name of
  // its own (the kit already uses "uGlow" for how brightly its lamp glass shines)
  OW.GLSL = W3D.GLSL.F.replace('varying vec3 vW; varying vec3 vN; varying vec2 vUv; varying vec3 vCol;', '').replace(/\buGlow\b/g, 'uLampMap') + `
    vec3 s2l(vec3 c) { return c * c; }
    vec3 owLight(vec3 n, vec3 P, float k) { return nightLight(P, n, 1.0) + lampLight(P, n); }
    vec3 owFog(vec3 c, vec3 P) { return fogged(c, P); }
  `;
  OW.out = 'gl_FragColor = outC(col);';
  OW.glowOnly = (m) => { m.blending = THREE.CustomBlending; m.blendEquation = THREE.AddEquation; m.blendSrc = THREE.SrcAlphaFactor; m.blendDst = THREE.OneFactor; m.blendSrcAlpha = THREE.ZeroFactor; m.blendDstAlpha = THREE.OneFactor; return m; };
  OW.glowTex = (function () { let t = null; return () => { if (t) return t; const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(255,236,200,1)'); gr.addColorStop(0.25, 'rgba(255,190,110,0.55)'); gr.addColorStop(1, 'rgba(255,150,60,0)'); g.fillStyle = gr; g.fillRect(0, 0, 64, 64); t = new THREE.CanvasTexture(c); return t; }; })();
  OW.U = {};

  W3D.fair = {
    async build(Z, C) {
      const U = Z.U, land = Z.land, R = C.r + 14, S = 512;
      // the night's numbers for the kit: the zone's own, with the camp's lamplight picture and where it lies on the land
      const white = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1, THREE.RGBAFormat); white.needsUpdate = true;
      const mapK = { value: new THREE.Vector4(1 / (2 * R), 1 / (2 * R), 0.5 - C.x / (2 * R), 0.5 - C.z / (2 * R)) }, glowK = { value: 1 }, lampMap = { value: white };
      const KU = Object.assign({}, U); delete KU.uGlow;
      OW.U = Object.assign(KU, { uLampMap: lampMap, uMapK: mapK, uGlowK: glowK, uShade: { value: white } });
      OW.kit.heightAt = (x, z) => land.height(x, z);
      await OW.kit.ready();
      const B = OW.kit.batch({ gain: C.gain || [1, 1, 1] });
      for (const [kind, o] of C.pieces) {
        const q = Object.assign({}, o, { x: C.x + o.x, z: C.z + o.z });
        if (o.face) q.turn = Math.atan2(-o.x, -o.z) * 180 / Math.PI + (o.turn || 0);   // its front toward the camp's middle
        if (!B[kind]) throw new Error('the fair kit has no piece called ' + kind);
        B[kind](q);
      }
      const out = B.finish(Z.scene);
      if (out.mesh) { out.mesh.name = 'fair'; out.mesh.matrixAutoUpdate = false; }
      if (out.glow) { out.glow.name = 'fair-glow'; out.glow.matrixAutoUpdate = false; }
      // the camp's lamplight, painted once: a warm pool under every lantern, a wider one round every fire
      const cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d');
      g.fillStyle = '#000'; g.fillRect(0, 0, S, S); g.globalCompositeOperation = 'lighter';
      const pool = (x, z, rad, a) => { const u = ((x - C.x) / (2 * R) + 0.5) * S, v = ((z - C.z) / (2 * R) + 0.5) * S, r = rad / (2 * R) * S, gr = g.createRadialGradient(u, v, 0, u, v, r);
        gr.addColorStop(0, 'rgba(255,196,128,' + a + ')'); gr.addColorStop(0.45, 'rgba(255,170,96,' + a * 0.42 + ')'); gr.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = gr; g.fillRect(u - r, v - r, 2 * r, 2 * r); };
      for (const l of out.lamps) pool(l.x, l.z, l.fire ? 9 : 6.5, l.fire ? 0.95 : 0.8);
      const tex = new THREE.CanvasTexture(cv); tex.flipY = false; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
      lampMap.value = tex;
      // the ground between the tents takes the same lamplight; nothing of the kit can be walked through; the lamps light her
      land.addGlow({ x0: C.x - R, z0: C.z - R, x1: C.x + R, z1: C.z + R, U: Object.assign({}, U, { uGlow: { value: tex }, uShade: { value: white }, uMapK: mapK, uGlowK: glowK }) });
      land.addBlockers(out.blockers);
      for (const l of out.lamps) Z.lamps.push({ x: l.x, y: l.y, z: l.z, c: l.fire ? 0xff7a30 : 0xffb070, k: l.fire ? 2.0 : 1.0 });
      Z.fair = { mesh: out.mesh, glow: out.glow, lamps: out.lamps.length, pieces: C.pieces.length, triangles: Math.round(out.triangles) };
      return Z.fair;
    },
    // One piece of the fair kit standing by itself anywhere on the land, away from the camp: Old Bridie's lantern on
    // the south road (November 23). W3D.fair.piece(Z, 'lanternPost', { x, z, turn }) -> { mesh, glow, lamps, blockers }.
    // The camp's lamplight picture does not reach it, so it is given a small one of its own (a warm pool under its own
    // lamp) to light itself by. It cannot be walked through, and its lamp lights whoever stands by it. The ground under
    // it is lit by whoever sets it down (the land takes lamplight only when a square of it is made).
    piece(Z, kind, o) {
      const land = Z.land, R = 8, S = 64, U0 = OW.U;
      const cv = document.createElement('canvas'); cv.width = cv.height = S; const g = cv.getContext('2d'), gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S * 0.42);
      g.fillStyle = '#000'; g.fillRect(0, 0, S, S); gr.addColorStop(0, 'rgba(255,196,128,0.8)'); gr.addColorStop(0.45, 'rgba(255,170,96,0.34)'); gr.addColorStop(1, 'rgba(255,150,70,0)'); g.fillStyle = gr; g.fillRect(0, 0, S, S);
      const tex = new THREE.CanvasTexture(cv); tex.flipY = false; tex.minFilter = THREE.LinearFilter; tex.generateMipmaps = false;
      // (the kit takes the night's numbers as they stand when a batch is finished: its own lamplight for this one, then back)
      OW.U = Object.assign({}, U0, { uLampMap: { value: tex }, uMapK: { value: new THREE.Vector4(1 / (2 * R), 1 / (2 * R), 0.5 - o.x / (2 * R), 0.5 - o.z / (2 * R)) } });
      let out; try { const B = OW.kit.batch({ gain: o.gain || [1, 1, 1] }); if (!B[kind]) throw new Error('the fair kit has no piece called ' + kind); B[kind](o); out = B.finish(Z.scene); } finally { OW.U = U0; }
      if (out.mesh) { out.mesh.name = 'fair-piece'; out.mesh.matrixAutoUpdate = false; }
      if (out.glow) { out.glow.name = 'fair-piece-glow'; out.glow.matrixAutoUpdate = false; }
      land.addBlockers(out.blockers);
      for (const l of out.lamps) Z.lamps.push({ x: l.x, y: l.y, z: l.z, c: l.fire ? 0xff7a30 : 0xffb070, k: l.fire ? 2.0 : 1.0 });
      return out;
    },
  };
})(window);
