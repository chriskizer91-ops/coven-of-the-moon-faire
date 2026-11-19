// zone.js: several 3D places standing on one open land, as one thing the walker can walk (Coven of the Moon Faire,
// zone 1, November 18, 2026).
//
// The place engine builds one place at a time, each in its own painting's pixels with its own middle at 0, 0. A zone
// sets each place down at its own spot on the land (`at`, metres) and hands the walker one object that answers for
// all of them and for the land between: can she stand here, how high is the ground, what is in the camera's way.
// Every place of the zone is built when the page opens and kept (Chris's laptop and phone ran the first test at their
// screens' top speed, so there is room; hub's call, docs/decisions.md).
//
// Three things are shared, so the zone is one picture and not six:
//   the night    one moon, sky, fog and clock for every place and the land (each place keeps its own lamplight)
//   the textures a picture two places both use is loaded once
//   the sky      one, round the camera
//
// A page gives the walker a "zone place": { name, start, size: [1536, 1024], zone: { places: [{ id, at: [x, z] }],
// land: {...} } }. The first place must be at 0, 0: the zone's pixels are that place's pixels (so start, and every
// spot the checks name, can be read off its painting), and the land plants its trees with that place's tree builder.
// A single place with `land` in its own data (the first test) is taken as a zone of one.
(function (G) {
  'use strict';
  const W3D = G.W3D;
  const buildPlace = W3D.buildPlace, night0 = W3D.night, load0 = W3D.loadTextures;

  // ---- textures, loaded once however many places ask ----
  const TEX = {};
  W3D.loadTextures = function (list, renderer) {
    return load0(list.filter((t) => !TEX[t.id]), renderer).then(({ tex, used }) => {
      for (const id in tex) TEX[id] = { tex: tex[id], used: used[id] };
      const out = {}, u = {};
      for (const t of list) { out[t.id] = TEX[t.id].tex; u[t.id] = TEX[t.id].used; }
      return { tex: out, used: u };
    });
  };
  W3D.zoneTex = (id) => (TEX[id] ? TEX[id].tex : null);

  // ---- the night, shared: while a zone is being built, every place's night uses the zone's own moon, sky, fog, clock
  // and camera; only its lamplight, its shade and its painting's place on the land stay its own ----
  const SHARED = ['uSky', 'uGround', 'uMoonDir', 'uMoon', 'uFog', 'uFogNear', 'uFogFar', 'uTime', 'uCam', 'uIo', 'uCut', 'uCutW'];
  let master = null;
  W3D.night = function (M, opt) { const U = night0(M, opt); if (master) for (const k of SHARED) U[k] = master[k]; return U; };
  // a place's own night, as plain numbers, for the land to bring the fog round to as she comes near it
  const nightOf = (pl) => { const n = pl.night || {}; return { fog: n.fog || [0.075, 0.08, 0.16], near: n.fogNear || 30, far: n.fogFar || 115, sky: n.sky || [0.62, 0.6, 0.7], moon: n.moon || [0.42, 0.43, 0.56] }; };

  W3D.buildPlace = async function (zplace, renderer, opts) {
    const zone = zplace.zone || (zplace.land ? { places: [{ id: zplace.id, at: [0, 0] }], land: zplace.land } : null);
    if (!zone) return buildPlace(zplace, renderer, opts);
    const say = W3D.zoneSay || (() => {});
    const M = W3D.map({ w: 1536, h: 1024 });
    master = night0(M, zone.night || {});
    const scene = new THREE.Scene(), parts = [];
    // a land that lies on the map of Aethermoor (zone.land.atlas.map): the map is read first, and each place is set
    // down at the height the map has for its spot (a place with water of its own, `waterY`: so that its water lies
    // level with the map's there)
    const ZA = zone.land && zone.land.atlas, AM = ZA && ZA.map && W3D.atlas ? ZA.map : null, AO = {};
    if (AM) { say('Reading the map of Aethermoor…'); await W3D.atlas.load(ZA.height, ZA.kinds); }
    const H0 = AM ? W3D.atlas.at(AM.origin[0], AM.origin[1], AO).h : 0;
    const mapY = (x, z, water) => { const a = W3D.atlas.at(AM.origin[0] + x / AM.k, AM.origin[1] + z / AM.k, AO); return ((water ? a.hw : a.h) - H0) * AM.vk; };
    let sky = null;
    {
      for (const e of zone.places) {
        const pl = G.W3D_PLACES[e.id]; say('Building ' + pl.name + '…');
        // `open`: a town that was closed in by a hedge at its painting's edge is opened to the edge of its own ground (she
        // can walk anywhere on it that isn't water or solid). Every place leaves the far hills to the land
        if (e.open) { const sz = pl.size, x = pl.extent || [-460, -420, sz[0] + 460, sz[1] + 420]; pl.bounds = [[x[0], x[1]], [x[2], x[1]], [x[2], x[3]], [x[0], x[3]]]; pl.thicket = false; }
        pl.night = Object.assign({}, pl.night, { hills: false });
        await new Promise((r) => setTimeout(r, 0));   // let the page show the words before the work starts
        const P = await buildPlace(pl, renderer, opts), ox = e.at[0], oz = e.at[1];
        const oy = e.y != null ? e.y : !AM || !parts.length ? 0 : e.waterY != null ? ZA.waterY + mapY(ox, oz, true) - e.waterY : mapY(ox, oz, false);
        // the place's own scene becomes one branch of the zone's, set down at its spot
        P.scene.position.set(ox, oy, oz); scene.add(P.scene);
        const s = P.scene.children.find((o) => o.name === 'sky');
        if (s) { P.scene.remove(s); if (!sky) { sky = s; scene.add(s); } else s.geometry.dispose(); }
        // its lamplight and shade are painted in its own painting's pixels: tell them where the painting now lies
        const k = P.U.uMapK.value; k.z -= ox * k.x; k.w -= oz * k.y;
        const [a, b, c, d] = P.walkRect, PM = P.M, px = (x) => PM.px(x - ox), py = (z) => PM.py(z - oz);
        parts.push({ id: e.id, name: pl.name, P, ox, oy, oz, x0: ox + PM.x(a), z0: oz + PM.z(b), x1: ox + PM.x(c), z1: oz + PM.z(d), night: nightOf(pl), autoWater: !!e.autoWater, moat: !!e.moat, waterY: e.waterY,
          walkable: (x, z) => P.walkable(px(x), py(z)), walkH: (x, z) => P.walkH(px(x), py(z)) + oy, terrain: (x, z) => P.terrain(px(x), py(z)) + oy });
      }
    }
    scene.updateMatrixWorld(true);
    const U = master; master = null;
    const partAt = (x, z) => { for (const p of parts) if (x >= p.x0 && x <= p.x1 && z >= p.z0 && z <= p.z1) return p; return null; };
    const host = parts[0].P;

    // what the camera must not sit inside, and the lamps that light her: every place's, moved to where the place stands
    const camSolids = [], lamps = [];
    for (const p of parts) {
      for (const s of p.P.camSolids || []) camSolids.push({ p: s.p.map(([x, z]) => [x + p.ox, z + p.oz]), b: [s.b[0] + p.ox, s.b[1] + p.oz, s.b[2] + p.ox, s.b[3] + p.oz], y0: s.y0 + p.oy, y1: s.y1 + p.oy, thin: s.thin });
      for (const l of p.P.lamps || []) lamps.push({ x: l.x + p.ox, y: l.y + p.oy, z: l.z + p.oz, c: l.c, k: l.k });
    }
    const local = { position: new THREE.Vector3() }, lio = new THREE.Vector3(), wcam = new THREE.Vector3(), wio = new THREE.Vector3();
    const stats = { triangles: 0, meshes: 0, trees: 0, lamps: lamps.length, halos: 0, solids: 0 };
    for (const p of parts) for (const k in stats) if (k !== 'lamps') stats[k] += p.P.stats[k] || 0;

    const Z = {
      scene, U, M, place: zplace, parts, partAt, host, sky, zone,
      walkable: (px, py) => { const x = M.x(px), z = M.z(py), p = partAt(x, z); return p ? p.walkable(x, z) : false; },
      walkH: (px, py) => { const x = M.x(px), z = M.z(py), p = partAt(x, z); return p ? p.walkH(x, z) : 0; },
      terrain: (px, py) => { const x = M.x(px), z = M.z(py), p = partAt(x, z); return p ? p.terrain(x, z) : 0; },
      // each place looks after its own (its water, its lamps' flicker, which of its trees thin away), told where the
      // camera and Io are in its own measure. A place past the fog is not drawn at all
      update(t, cam, io) {
        const far = U.uFogFar.value > 5000 ? 1e9 : U.uFogFar.value + 30;
        if (cam) wcam.copy(cam.position); if (io) wio.copy(io);
        for (const p of parts) {
          if (cam && io) {
            const d = Math.hypot(Math.max(p.x0 - wcam.x, 0, wcam.x - p.x1), Math.max(p.z0 - wcam.z, 0, wcam.z - p.z1));
            // (the first place is never hidden whole: the land's trees are planted in its branch of the scene)
            p.P.scene.visible = p === parts[0] || d < far; if (!p.P.scene.visible) continue;
            local.position.set(wcam.x - p.ox, wcam.y - p.oy, wcam.z - p.oz); lio.set(wio.x - p.ox, wio.y - p.oy, wio.z - p.oz);
            p.P.update(t, local, lio);
          } else p.P.update(t);
        }
        // the places wrote the camera and Io in their own measure; the picture wants the land's
        if (cam && io) { U.uCam.value.copy(wcam); U.uIo.value.set(wio.x, wio.y + 1.0, wio.z); }
      },
      // how far along a line (0 to 1) the first wall, roof or deck is: the nearest of every place the line comes near
      sight: { hit(ax, ay, az, bx, by, bz) {
        let t = 1;
        for (const p of parts) {
          if (!p.P.sight || Math.max(ax, bx) < p.x0 - 1 || Math.min(ax, bx) > p.x1 + 1 || Math.max(az, bz) < p.z0 - 1 || Math.min(az, bz) > p.z1 + 1) continue;
          const h = p.P.sight.hit(ax - p.ox, ay - p.oy, az - p.oz, bx - p.ox, by - p.oy, bz - p.oz); if (h < t) t = h;
        }
        return t;
      } },
      camSolids, lamps, exits: [], items: [], takeItem() {}, maps: {}, used: {}, stats,
      precompile(r, cam) { for (const p of parts) p.P.precompile(r, cam); },
      walkPic: () => null, walkRect: host.walkRect,
      dispose() { for (const p of parts) p.P.dispose(); },
    };
    say('Laying out the land…');
    await new Promise((r) => setTimeout(r, 0));
    if (!zone.land) return Z;
    if (zone.land.atlas && W3D.atlas) { say('Reading the map of Aethermoor…'); await W3D.atlas.load(zone.land.atlas.height, zone.land.atlas.kinds); }
    W3D.landAttach(Z, zone.land);
    // the Moon Faire's camp, if the zone has one and the page carries the fair kit (fair/fair.js)
    if (zone.camp && W3D.fair) { say('Pitching the Moon Faire…'); await new Promise((r) => setTimeout(r, 0)); await W3D.fair.build(Z, zone.camp); }
    return Z;
  };
})(window);
