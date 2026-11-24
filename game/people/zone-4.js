// zone-4.js (people): who stands where in zone 4, how its story moves from the landing to the leaving for the Faire,
// and the things on the land its lines speak of (Coven of the Moon Faire, November 24, 2026).
// The people and their lines are the story job's (game/talk/zone-4.js, game/talk/cast.js; docs/lore/story-zones-2-4.md).
// NOT ONE WORD OF A LINE IS SET HERE: the lines were being recorded as this was built. This file only says where each
// is said, so that each is true where it is said. Where each person stands, and what moves the story on, are the
// job's calls (docs/slips/zone-4.md). Every body is one of the fair folk's shapes for now, as in zones 2 and 3.
// A spot is `place: [the place's id, x, y]` in that place's painting, with `look` the spot they face.
//
// WHERE A FIGHT BELONGS (there are none on this page yet: the fights job has not reached it):
//   the great bramble   on the road from the frozen pass up to Misthollow, BRAMBLE_AT metres along it (W3D.ZONE4.bramble.at).
//                       Until there is a fight, the bramble gives way once the coven has stood before it and spoken.
//   the fire            at the dead Moonwell, in two forms (the zone's gate fight: `gate` below, W3D.ZONE4.fire.at).
//                       Until there is one, the coven speaks before it, then between its two forms, and it ends.
(function (G) {
  'use strict';
  const W3D = G.W3D; W3D.PEOPLE = W3D.PEOPLE || {}; W3D.STORY = W3D.STORY || {}; W3D.THINGS = W3D.THINGS || {};
  const Q = W3D.ZONE4 = W3D.ZONE4 || {}, HUT = Q.HUT || [1800, 500];
  const ss = (a, b, v) => { const t = Math.max(0, Math.min(1, (v - a) / (b - a))); return t * t * (3 - 2 * t); };
  const rand = (seed) => { let s = seed >>> 0 || 1; return () => { s ^= s << 13; s >>>= 0; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; };

  // ---- where people stand ----
  const SHIPSIDE = { place: ['frozen-camp', 560, 455], look: [640, 452] };                      // the Grey Hat: by his ship, at the landing ground's east rope
  const KEEPER = { place: ['frozen-camp', HUT[0] - 16, HUT[1] + 52], look: [HUT[0] + 130, HUT[1] + 66] };   // the pass-keeper: before her hut, looking up the trail to the pass
  const AWAY = { at: [0, 6000] };                                                              // (nowhere: the Warden who speaks is one of the forty until the fire ends)
  const AWAKE = { place: ['misthollow', 792, 640], look: [772, 760] };                          // then here, at the bottom of the street, looking down it
  const STEP = ['moonwell', 768, 772];                                                         // Halcyon: the top step of the Moonwell's stair
  const HOME = ['frozen-camp', 606, 418];                                                      // and at the end, down at the ship
  const R3 = 'the frozen pass up to Misthollow', R4 = 'Misthollow’s street up to the Moonwell';
  const BRAMBLE_AT = 72;                                                                       // metres along R3 from the frozen pass: in the cutting, where the road is narrowest
  W3D.PEOPLE['zone-4'] = {
    people: [
      Object.assign({ id: 'captain', name: 'The Grey Hat', trade: 'the captain', body: 'grey-hat-captain' }, SHIPSIDE),
      Object.assign({ id: 'passkeeper', name: 'The pass-keeper', trade: 'the pass-keeper', body: 'old-lamp-seller' }, KEEPER),
      // Misthollow
      { id: 'watch', name: 'The watchwoman', trade: 'the watchwoman', body: 'pie-seller', place: ['misthollow', 722, 614], look: [742, 720] },     // at the bottom of the one street, by the dead lamp on its west side
      { id: 'sorrel', name: 'Sorrel', trade: 'the herb-seller', body: 'ballad-singer', place: ['misthollow', 480, 630], look: [560, 700] },         // before her shop (where the new Envoi stands her)
      { id: 'ede', name: 'Ede', trade: 'the innkeeper', body: 'ribbon-dyer', place: ['misthollow', 1000, 666], look: [930, 720] },                 // at the Lantern House's door
      // the Warden who speaks (her name on the screen is a stand-in: the lines never name her)
      Object.assign({ id: 'warden', name: 'The Warden', trade: 'a Warden of Dawnroost', body: 'old-night-watchman-opus' }, AWAY),
    ],
  };

  // ======== the things on the land ========
  const partOf = (k, id) => k.W.P.parts.find((q) => q.id === id);
  const spot = (k, id, px, py) => { const p = partOf(k, id); return [p.ox + p.P.M.x(px), p.oz + p.P.M.z(py)]; };
  const road = (k, name) => (k.land.roadList.find((r) => r.name === name) || { pts: [] }).pts;
  const along = (pts, dist) => { let d = 0; for (let i = 1; i < pts.length; i++) { const s = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (d + s >= dist || i === pts.length - 1) { const t = Math.max(0, Math.min(1, (dist - d) / (s || 1)));
    return { x: pts[i - 1][0] + (pts[i][0] - pts[i - 1][0]) * t, z: pts[i - 1][1] + (pts[i][1] - pts[i - 1][1]) * t, ux: (pts[i][0] - pts[i - 1][0]) / (s || 1), uz: (pts[i][1] - pts[i - 1][1]) / (s || 1) }; } d += s; } return { x: 0, z: 0, ux: 0, uz: -1 }; };
  // a thing drawn with three.js's own surfaces takes the land's own mist, by how far it is from the eye
  const misted = (sh, U) => { sh.uniforms.uZ4Fog = U.uFog; sh.uniforms.uZ4Near = U.uFogNear; sh.uniforms.uZ4Far = U.uFogFar;
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform vec3 uZ4Fog; uniform float uZ4Near; uniform float uZ4Far;')
      .replace('#include <tonemapping_fragment>', 'gl_FragColor.rgb = mix( gl_FragColor.rgb, uZ4Fog, smoothstep( uZ4Near, uZ4Far, gl_FragCoord.z / gl_FragCoord.w ) * 0.92 );\n#include <tonemapping_fragment>'); };

  // ---- a still copy of one of the fair folk's bodies, as plain numbers: every part where it stands in the standing
  // pose. (A person as the game makes one is 23 to 31 separate pieces. Forty of them would be about a thousand pieces
  // to draw; forty copies of the numbers, joined, are about ten.) The painted cloth is read by where each point stood
  // before the pose, so that is kept too. ----
  function bake(npc) { const T = G.THREE, root = npc.root, groups = new Map(), p0 = root.position.clone(), r0 = root.rotation.y;
    root.position.set(0, 0, 0); root.rotation.y = 0; root.updateMatrixWorld(true);
    const shown = (o) => { for (let q = o; q; q = q.parent) { if (!q.visible) return false; if (q === root) break; } return true; };
    const v = new T.Vector3(), nn = new T.Vector3(), acc = new T.Vector3(), accN = new T.Vector3(), base = new T.Vector3(), tmp = new T.Vector3(), M = new T.Matrix4(), si = new T.Vector4(), sw = new T.Vector4();
    root.traverse((m) => { if (!m.isMesh || !m.geometry || !m.geometry.attributes || !m.geometry.attributes.position || !shown(m)) return;
      const mat = Array.isArray(m.material) ? m.material[0] : m.material;
      if (!mat || mat.opacity === 0 || mat.isShaderMaterial || mat.blending === T.CustomBlending || mat.blending === T.AdditiveBlending) return;
      const g = m.geometry, P = g.attributes.position, N = g.attributes.normal, UV = g.attributes.uv, SI = g.attributes.skinIndex, SW = g.attributes.skinWeight, ix = g.index;
      let grp = groups.get(mat.uuid); if (!grp) groups.set(mat.uuid, grp = { mat, pos: [], nrm: [], uv: [], posed: [], posedN: [], idx: [] });
      // (a part the person's own data moves or sizes is moved and sized in the picture's own program: the same is done here)
      const fake = { uniforms: {}, vertexShader: '', fragmentShader: '' }; try { if (mat.onBeforeCompile) mat.onBeforeCompile(fake, null); } catch (e) {}
      const mv = fake.uniforms.uMove && fake.uniforms.uSize && fake.uniforms.uMid ? [fake.uniforms.uMove.value, fake.uniforms.uSize.value, fake.uniforms.uMid.value] : null;
      const off = grp.pos.length / 3, skinned = !!(m.isSkinnedMesh && SI && SW && m.skeleton);
      for (let i = 0; i < P.count; i++) { v.fromBufferAttribute(P, i); if (N) nn.fromBufferAttribute(N, i); else nn.set(0, 1, 0);
        grp.pos.push(v.x, v.y, v.z); grp.nrm.push(nn.x, nn.y, nn.z); grp.uv.push(UV ? UV.getX(i) : 0, UV ? UV.getY(i) : 0);
        if (mv) v.sub(mv[2]).multiply(mv[1]).add(mv[2]).add(mv[0]);
        if (skinned) { si.fromBufferAttribute(SI, i); sw.fromBufferAttribute(SW, i); base.copy(v).applyMatrix4(m.bindMatrix); acc.set(0, 0, 0); accN.set(0, 0, 0);
          for (let j = 0; j < 4; j++) { const w = sw.getComponent(j); if (!w) continue; const bi = si.getComponent(j), bone = m.skeleton.bones[bi]; if (!bone) continue; M.multiplyMatrices(bone.matrixWorld, m.skeleton.boneInverses[bi]);
            acc.addScaledVector(tmp.copy(base).applyMatrix4(M), w); accN.addScaledVector(tmp.copy(nn).transformDirection(M), w); }
          v.copy(acc); nn.copy(accN).normalize(); }
        else { v.applyMatrix4(m.matrixWorld); nn.transformDirection(m.matrixWorld); }
        grp.posed.push(v.x, v.y, v.z); grp.posedN.push(nn.x, nn.y, nn.z); }
      if (ix) for (let i = 0; i < ix.count; i++) grp.idx.push(off + ix.getX(i)); else for (let i = 0; i < P.count; i++) grp.idx.push(off + i); });
    root.position.copy(p0); root.rotation.y = r0; root.updateMatrixWorld(true);
    return Array.from(groups.values()); }
  const hashOf = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return (h >>> 0).toString(36); };
  // n still copies of a baked body, as one picture's worth of pieces. stand(list): where each stands: [x, y, z, turn, size]
  function crowd(baked, n, scene, U) { const T = G.THREE, sets = [];
    for (const grp of baked) { const c = grp.pos.length / 3, g = new T.BufferGeometry(), rep = (a, w) => { const o = new Float32Array(a.length * n); for (let i = 0; i < n; i++) o.set(a, i * a.length); return new T.BufferAttribute(o, w); };
      g.setAttribute('position', rep(grp.pos, 3)); g.setAttribute('normal', rep(grp.nrm, 3)); g.setAttribute('uv', rep(grp.uv, 2));
      g.setAttribute('posed', new T.BufferAttribute(new Float32Array(c * 3 * n), 3)); g.setAttribute('posedN', new T.BufferAttribute(new Float32Array(c * 3 * n), 3));
      const idx = new Uint32Array(grp.idx.length * n); for (let i = 0; i < n; i++) for (let j = 0; j < grp.idx.length; j++) idx[i * grp.idx.length + j] = grp.idx[j] + i * c; g.setIndex(new T.BufferAttribute(idx, 1));
      const src = grp.mat, mat = src.clone(), first = src.onBeforeCompile, key0 = src.customProgramCacheKey ? src.customProgramCacheKey() : '';
      mat.skinning = false; mat.morphTargets = false; mat.morphNormals = false;
      mat.onBeforeCompile = (sh, r) => { if (first) first(sh, r);
        sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nattribute vec3 posed; attribute vec3 posedN;')
          .replace('#include <defaultnormal_vertex>', 'objectNormal = posedN;\n#include <defaultnormal_vertex>').replace('#include <project_vertex>', 'transformed = posed;\n#include <project_vertex>');
        misted(sh, U); };
      mat.customProgramCacheKey = () => 'z4-still|' + key0 + '|' + (first ? hashOf(String(first)) : '');
      const mesh = new T.Mesh(g, mat); mesh.frustumCulled = false; mesh.name = 'z4-still'; scene.add(mesh); sets.push({ grp, g, mesh, c }); }
    return { sets, n, triangles: sets.reduce((a, s) => a + s.grp.idx.length / 3, 0) * n,
      show(on) { for (const s of sets) s.mesh.visible = on; },
      stand(list) { for (const s of sets) { const A = s.g.attributes.posed.array, B = s.g.attributes.posedN.array, P = s.grp.posed, N = s.grp.posedN, c3 = s.c * 3;
        for (let i = 0; i < n; i++) { const q = list[i] || [0, -9999, 0, 0, 1], cs = Math.cos(q[3]), sn = Math.sin(q[3]), k = q[4] || 1, o = i * c3;
          for (let j = 0; j < c3; j += 3) { const x = P[j] * k, y = P[j + 1] * k, z = P[j + 2] * k; A[o + j] = q[0] + x * cs + z * sn; A[o + j + 1] = q[1] + y; A[o + j + 2] = q[2] - x * sn + z * cs;
            B[o + j] = N[j] * cs + N[j + 2] * sn; B[o + j + 1] = N[j + 1]; B[o + j + 2] = -N[j] * sn + N[j + 2] * cs; } }
        s.g.attributes.posed.needsUpdate = true; s.g.attributes.posedN.needsUpdate = true; } } }; }

  // ---- where the forty stand ----
  // Held: two files of twenty up Misthollow's one street, from its foot to the edge of the town, each facing up the
  // street to the Moonwell, with the middle of the street left clear. ("Forty Wardens stand in the street." "They're
  // standing so still, Io. Like they're waiting to be told." "Forty-one went up. Forty are here.")
  const heldSpots = (k) => { const R = rand(4040), out = []; for (let i = 0; i < 20; i++) for (const px of [722, 808]) { const [x, z] = spot(k, 'misthollow', px + (R() - 0.5) * 8, 560 - i * 50.5 + (R() - 0.5) * 8);
    out.push([x, k.stand(x, z), z, Math.PI + (R() - 0.5) * 0.16, 0.97 + R() * 0.08]); } return out; };
  // Awake, once the fire has ended: coming down. Thirty-nine on the lower street, the upper square, the great stair
  // and the lower square, each facing down the way out of the town (the fortieth is the Warden who speaks).
  // ("Down. They're all coming down. Look at them. Look at them come down.")
  const awakeSpots = (k) => { const R = rand(1939), out = [], P = k.W.P, M = P.M, ok = (x, z) => P.walkable(M.px(x), M.py(z)) && out.every((q) => Math.hypot(q[0] - x, q[2] - z) > 1.25);
    for (const [x0, y0, x1, y1, n] of [[716, 330, 814, 580, 9], [520, 606, 1090, 688, 12], [640, 702, 884, 786, 8], [540, 806, 1020, 940, 10]]) { let made = 0;
      for (let tries = 0; tries < 400 && made < n; tries++) { const [x, z] = spot(k, 'misthollow', x0 + R() * (x1 - x0), y0 + R() * (y1 - y0)); if (!ok(x, z) || Math.hypot(x - spot(k, 'misthollow', AWAKE.place[1], AWAKE.place[2])[0], z - spot(k, 'misthollow', AWAKE.place[1], AWAKE.place[2])[1]) < 1.6) continue;
        const [ex, ez] = spot(k, 'misthollow', 768, 1100); out.push([x, k.stand(x, z), z, Math.atan2(ex - x, ez - z) + (R() - 0.5) * 0.7, 0.97 + R() * 0.08]); made++; } }
    return out; };

  W3D.THINGS['zone-4'] = [
    // ---- the light, the sky and the dark: the pale dawn over Misthollow and the Moonwell that has not turned in eight
    // years; then, when the moon sets, the honest dark and the stars. (game/places/zone-4.js: DAWN and DARK; zone-4-sky.js) ----
    { id: 'night',
      make: (t, k) => { t.sky = W3D.zone4Sky ? W3D.zone4Sky(k.W.P) : null; t.b = -1; t.parts = ['misthollow', 'moonwell'].map((id) => partOf(k, id)).filter(Boolean); },
      // (when the fire ends the dawn it held begins to fail: half way to dark, a dusk. When the moon sets, the dark comes.)
      tick: (t, c, me, k) => { if (!Q.DAWN || !t.parts) return; const want = c.played('moonset') ? 1 : c.won() ? 0.5 : 0;
        if (t.b < 0) t.b = want; else if (t.b !== want) t.b += Math.sign(want - t.b) * Math.min(Math.abs(want - t.b), k.dt / 26);     // 13 seconds to the dusk, 13 more for the moon to set
        const e = t.b * t.b * (3 - 2 * t.b), D = Q.DAWN, N = Q.DARK, mix = (a, z) => [a[0] + (z[0] - a[0]) * e, a[1] + (z[1] - a[1]) * e, a[2] + (z[2] - a[2]) * e];
        let d = 1e9; for (const p of t.parts) { const n = p.night; n.fog = mix(D.fog, N.fog); n.sky = mix(D.sky, N.sky); n.moon = mix(D.moon, N.moon); n.near = D.fogNear + (N.fogNear - D.fogNear) * e; n.far = D.fogFar + (N.fogFar - D.fogFar) * e;
          d = Math.min(d, Math.hypot(Math.max(p.x0 - me.x, 0, me.x - p.x1), Math.max(p.z0 - me.z, 0, me.z - p.z1))); }
        t.dark = e; if (t.sky) t.sky.set({ dawn: (1 - ss(6, 70, d)) * (1 - e), stars: ss(0.6, 1, t.b), moon: ss(0.5, 1, t.b) }); },
    },

    // ---- the cold lights. "The cold lights go up the street to the Moonwell. Like everyone." "Like seedlings to a
    // window." "The cold lights never stop at my stove." "The cold lights come in and sit by my hearth." Small pale
    // lights, drifting: up the road and the street to the dead well; past the pass-keeper's hut; two by Ede's door.
    // They are gone when the fire has ended. ----
    { id: 'cold-lights',
      make: (t, k) => { t.k = k; const pts = (id, list) => list.map(([px, py]) => spot(k, id, px, py)), r3 = road(k, R3), r4 = road(k, R4);
        const up = [].concat(r3.slice(-10), pts('misthollow', [[768, 1444], [768, 1090], [768, 960], [768, 800], [765, 700], [765, 600], [765, 300], [765, 0], [765, -420]]), r4, pts('moonwell', [[768, 1444], [768, 1100], [768, 860], [768, 770], [769, 640], [769, 520]]));
        const trail = pts('frozen-camp', [[980, 566], [1300, 560], [1520, 570], [1700, 584], [1900, 562], [2100, 592], [2350, 622], [2600, 600], [2800, 572], [3060, 574]]);
        t.tracks = [{ pts: up, n: 16, v: 1.5 }, { pts: trail, n: 5, v: 1.2 }].map((tr) => { const len = [0]; for (let i = 1; i < tr.pts.length; i++) len.push(len[i - 1] + Math.hypot(tr.pts[i][0] - tr.pts[i - 1][0], tr.pts[i][1] - tr.pts[i - 1][1])); return Object.assign(tr, { len, L: len[len.length - 1] }); });
        t.wisps = []; const mk = () => { const h = k.halo(0xbcd0ff, 1.5, 0.7), core = k.halo(0xf2f7ff, 0.34, 1); h.visible = core.visible = false; k.scene.add(h); k.scene.add(core); return { h, core }; };
        t.tracks.forEach((tr, ti) => { for (let i = 0; i < tr.n; i++) t.wisps.push(Object.assign(mk(), { tr, i, ph: i * 2.399 + ti })); });
        for (const [px, py] of [[1016, 668], [982, 674]]) { const [x, z] = spot(k, 'misthollow', px, py); t.wisps.push(Object.assign(mk(), { sit: [x, z], ph: px })); } },
      tick: (t, c, me, k) => { if (!t.wisps) return; const on = c.stage < 4;
        for (const w of t.wisps) { let x, z, edge = 1;
          if (!on) { w.h.visible = w.core.visible = false; continue; }
          if (w.sit) { x = w.sit[0] + Math.sin(k.t * 0.4 + w.ph) * 0.25; z = w.sit[1] + Math.cos(k.t * 0.33 + w.ph) * 0.2; }
          else { const tr = w.tr, s = (k.t * tr.v + w.i * tr.L / tr.n) % tr.L; let i = 1; while (i < tr.len.length - 1 && tr.len[i] < s) i++; const f = (s - tr.len[i - 1]) / ((tr.len[i] - tr.len[i - 1]) || 1), a = tr.pts[i - 1], b = tr.pts[i];
            x = a[0] + (b[0] - a[0]) * f + Math.sin(k.t * 0.7 + w.ph) * 0.5; z = a[1] + (b[1] - a[1]) * f + Math.cos(k.t * 0.6 + w.ph) * 0.5; edge = Math.min(1, s / 8, (tr.L - s) / 8); }
          const dc = Math.hypot(x - k.cam.position.x, z - k.cam.position.z); if (dc > 150) { w.h.visible = w.core.visible = false; continue; }
          const y = t.k.stand(x, z) + 1.05 + 0.22 * Math.sin(k.t * 1.3 + w.ph), a = edge * k.fade(dc) * (0.85 + 0.15 * Math.sin(k.t * 3.1 + w.ph * 2));
          w.h.position.set(x, y, z); w.core.position.set(x, y, z); w.h.visible = w.core.visible = a > 0.02; w.h.material.opacity = 0.7 * a; w.core.material.opacity = a; } },
    },

    // ---- the great bramble, grown right over the frozen road in the cutting above the pass. ("The road's gone. There's
    // only bramble." "It's grown right over the path. Like it's keeping something in." "The great bramble came down the
    // pass this winter.") Black canes thicker than an arm, arching higher than a person, frost along their tops. It
    // cannot be walked through. When it has been met (until there is a fight: once the coven has spoken before it),
    // the canes over the road are gone and the road is open; the rest still stands either side. ----
    { id: 'bramble',
      make: (t, k) => { t.k = k; const T = k.THREE, pts = road(k, R3), a = along(pts, BRAMBLE_AT), R = rand(7717); t.x = a.x; t.z = a.z; Q.bramble = { at: [a.x, a.z], road: R3, along: BRAMBLE_AT };
        const px = -a.uz, pz = a.ux, at = (u, v) => [a.x + px * u + a.ux * v, a.z + pz * u + a.uz * v];          // u: metres across the road, v: along it
        const build = (arcs) => { const pos = [], nrm = [], col = [], idx = []; let base = 0;
          for (const [A, B, h, r] of arcs) { const [ax, az] = at(A[0], A[1]), [bx, bz] = at(B[0], B[1]), ay = k.stand(ax, az) - 0.4, by = k.stand(bx, bz) - 0.4;
            const curve = new T.QuadraticBezierCurve3(new T.Vector3(ax, ay, az), new T.Vector3((ax + bx) / 2 + (R() - 0.5) * 1.5, Math.max(ay, by) + h * 2, (az + bz) / 2 + (R() - 0.5) * 1.5), new T.Vector3(bx, by, bz));
            const g = new T.TubeGeometry(curve, 10, r, 5, false), P = g.attributes.position, N = g.attributes.normal;
            for (let i = 0; i < P.count; i++) { pos.push(P.getX(i), P.getY(i), P.getZ(i)); nrm.push(N.getX(i), N.getY(i), N.getZ(i)); const f = ss(0.8, 1.0, N.getY(i)) * 0.4; col.push(0.022 + 0.42 * f, 0.016 + 0.46 * f, 0.03 + 0.6 * f); }
            for (let i = 0; i < g.index.count; i++) idx.push(base + g.index.getX(i)); base += P.count;
            // thorns: short spikes along the cane
            for (let s = 1; s < 9; s += 2) { const p = curve.getPoint((s + R()) / 10), c = new T.ConeGeometry(r * 0.6, 0.35 + R() * 0.3, 4); c.rotateZ((R() - 0.5) * 2.6); c.rotateY(R() * 6.28); c.translate(p.x, p.y + r * 0.6, p.z);
              const CP = c.attributes.position, CN = c.attributes.normal; for (let i = 0; i < CP.count; i++) { pos.push(CP.getX(i), CP.getY(i), CP.getZ(i)); nrm.push(CN.getX(i), CN.getY(i), CN.getZ(i)); col.push(0.02, 0.014, 0.028); } for (let i = 0; i < c.index.count; i++) idx.push(base + c.index.getX(i)); base += CP.count; c.dispose(); }
            g.dispose(); }
          const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new T.Float32BufferAttribute(nrm, 3)); g.setAttribute('color', new T.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeBoundingSphere();
          const mat = new T.MeshStandardMaterial({ vertexColors: true, roughness: 0.95, metalness: 0 }); mat.onBeforeCompile = (sh) => misted(sh, k.W.P.U); mat.customProgramCacheKey = () => 'z4-bramble';
          const m = new T.Mesh(g, mat); m.name = 'z4-bramble'; k.scene.add(m); return m; };
        const mid = [], sides = [];
        for (let i = 0; i < 150; i++) { const u0 = (R() - 0.5) * 30, span = (2.2 + R() * 4.5) * (R() < 0.5 ? -1 : 1), u1 = Math.max(-16, Math.min(16, u0 + span)), v0 = (R() - 0.5) * 8, v1 = v0 + (R() - 0.5) * 4, arc = [[u0, v0], [u1, v1], 1.3 + R() * 2.2, 0.08 + R() * 0.15];
          (Math.min(Math.abs(u0), Math.abs(u1)) < 3.4 || u0 * u1 < 0 ? mid : sides).push(arc); }
        for (let i = 0; i < 16; i++) mid.push([[-5 + i * 0.6, (R() - 0.5) * 5], [-3 + i * 0.6 + R() * 2.5, (R() - 0.5) * 5], 1.6 + R() * 1.8, 0.1 + R() * 0.14]);         // (the road itself is covered, whatever the dice gave)
        t.mid = build(mid); t.sides = build(sides); t.canes = mid.length + sides.length;
        // what stops her: a row of round stops across the road and up both banks
        t.stops = []; for (let u = -17; u <= 17; u += 2) { const [x, z] = at(u, 0); t.stops.push({ x, z, r: 1.7, r0: 1.7 }); } k.land.addBlockers(t.stops); },
      // (it bars the road from stage 1 on, the stage the story job calls "the great bramble bars the frozen road": in play the
      // story is at stage 1 long before anyone is here. tools/zone-test.py walks this road with no story running, at stage 0.)
      look: (t, c) => { const open = !!c.flag('bramble'), bars = c.stage >= 1; if (t.mid) t.mid.visible = !open; for (const s of t.stops || []) s.r = !bars || (open && Math.hypot(s.x - t.x, s.z - t.z) < 4.5) ? 0 : s.r0; t.open = open; t.bars = bars; },
      tick: (t, c, me, k) => { if (t.open !== !!c.flag('bramble') || t.bars !== (c.stage >= 1)) W3D.THINGS['zone-4'].find((q) => q.id === 'bramble').look(t, c);
        const d = Math.hypot(t.x - k.cam.position.x, t.z - k.cam.position.z), far = d > t.k.W.P.U.uFogFar.value + 40; if (t.sides) t.sides.visible = !far; if (t.mid) t.mid.visible = !far && !t.open; },
    },

    // ---- the forty Wardens. Held in the street until the fire ends; then awake, and coming down. They are still
    // copies of two of the fair folk's shapes in long coats (the "cloaks" of the lines, until the Wardens are painted):
    // nobody can be talked to among them until the fire has ended, and then one can (the person `warden`, above). ----
    { id: 'wardens',
      make: (t, k) => { t.k = k; t.mode = null; t.crowds = null; t.n = 0;
        t.ready = async () => { if (t.crowds || t.making) return t.making; t.making = (async () => { try { const out = [];
          for (const [id, n] of [['old-night-watchman', 20], ['old-night-watchman-opus', 20]]) { const npc = await G.MF_NPC.make(id); for (let i = 0; i < 4; i++) npc.update(0.016); const b = bake(npc); out.push(crowd(b, n, k.scene, k.W.P.U)); }
          t.crowds = out; t.triangles = out.reduce((a, c) => a + c.triangles, 0); t.pieces = out.reduce((a, c) => a + c.sets.length, 0); } catch (e) { console.error(e); t.failed = String(e && e.stack || e); } })(); return t.making; };
        t.lay = (mode) => { if (!t.crowds) return; const all = mode === 'awake' ? awakeSpots(k) : heldSpots(k); t.spots = all; t.n = all.length; t.crowds[0].stand(all.filter((_, i) => i % 2 === 0)); t.crowds[1].stand(all.filter((_, i) => i % 2 === 1)); t.mode = mode; }; },
      tick: (t, c, me, k) => { const p = partOf(t.k, 'misthollow'); if (!p) return; const d = Math.hypot(Math.max(p.x0 - me.x, 0, me.x - p.x1), Math.max(p.z0 - me.z, 0, me.z - p.z1));
        if (!t.crowds) { if (d < 220 && !t.making && !t.failed) t.ready(); return; }
        // (once the coven has gone on down the pass, the forty have gone down too: their footprints are at the pass-keeper's hut)
        const want = c.stage >= 4 ? (c.flag('gone') ? 'gone' : 'awake') : 'held';
        // (they are moved only when the coven is too far off to see it done, as a person who goes elsewhere is)
        if (t.mode !== want && (t.mode === null || d > 62)) { if (want === 'gone') { t.mode = 'gone'; t.n = 0; } else t.lay(want); }
        const on = t.mode !== 'gone' && d < t.k.W.P.U.uFogFar.value + 60; for (const cr of t.crowds) cr.show(on); },
    },

    // ---- Halcyon, on the top step of the Moonwell's stair, in the fire's light. ("She's there. On the top step."
    // "Someone stands on its stair. She doesn't speak.") She is not a person to talk to: every line of hers is said in
    // one of the coven's set moments. The light on her goes out when Io gives her the letter ("The light on the stair's
    // gone out"). From the kept flame on, a small warm light is in her hands. When the moon has set and the coven has
    // started down, she is at the ship ("You came down. Five of you"). ----
    { id: 'halcyon', place: STEP,
      make: (t, k) => { t.k = k; const T = k.THREE; t.x0 = k.X(STEP[1]); t.z0 = k.Z(STEP[2]); t.pos = [t.x0, t.z0]; t.face = 0; t.home = false; Q.halcyon = { step: [t.x0, t.z0] };
        const g = new T.Group(); t.beams = [];
        for (const a of [0, Math.PI / 2]) { const m = k.glow(0xeaf2ff, 1, 1); m.scale.set(1.9, 3.9, 1); m.rotation.y = a; m.position.y = 1.5; g.add(m); t.beams.push(m); }
        const fl = k.glow(0xcfe0ff, 11, 0.55); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.06; g.add(fl); t.beams.push(fl);
        const hl = k.halo(0xdfeaff, 6.5, 0.55); hl.position.y = 1.6; g.add(hl); t.beams.push(hl);
        for (const b of t.beams) b.userData.a = b.material.opacity;
        g.position.set(t.x0, k.ground(t.x0, t.z0), t.z0); k.scene.add(g); t.light = g; t.lightK = 1;
        t.flame = k.halo(0xffb060, 0.9, 0.9); t.core = k.halo(0xfff2cc, 0.2, 1); t.flame.visible = t.core.visible = false; k.scene.add(t.flame); k.scene.add(t.core);
        t.set = () => { if (!t.npc) return; const y = k.stand(t.pos[0], t.pos[1]); t.npc.root.position.set(t.pos[0], y, t.pos[1]); t.npc.root.rotation.y = t.face; };
        t.ready = async () => { if (t.npc || t.making) return t.making; t.making = (async () => { try { const n = await G.MF_NPC.make('fortune-teller'); n.update(0.016); k.scene.add(n.root); t.npc = n; t.set(); } catch (e) { console.error(e); t.failed = String(e); } })(); return t.making; }; },
      tick: (t, c, me, k) => { const m = t.k, d = Math.hypot(t.pos[0] - me.x, t.pos[1] - me.z);
        if (!t.home && c.heard('moonset') && d > 62) { t.home = true; t.pos = spot(m, HOME[0], HOME[1], HOME[2]); const s = spot(m, 'frozen-camp', 640, 452); t.face = Math.atan2(s[0] - t.pos[0], s[1] - t.pos[1]); t.set(); }
        if (!t.npc) { if (d < 90 && !t.making && !t.failed) t.ready(); }
        else { const show = d < 62; if (t.npc.root.visible !== show) t.npc.root.visible = show;
          if (show) { const s = m.people.say(), speaking = !!s && s.who === 'halcyon'; t.npc.talk(speaking);
            // (held: she does not stir until the letter is in her hand)
            if (c.played('letter') || t.home) { if (d < 8 && !t.npc.moving) t.npc.face(me.x, me.z); t.npc.update(k.dt); } } }
        // the light on the stair
        if (c.played('letter')) { if (t.offT == null) t.offT = c.heard('letter') ? -1e9 : k.t; t.lightK = Math.max(0, 1 - (k.t - t.offT) / 12); } else { t.offT = null; t.lightK = 1; }
        const on = t.lightK > 0.01 && !t.home; t.light.visible = on; if (on) { const f = k.fade(k.cam.position.distanceTo(t.light.position)) * t.lightK * (0.93 + 0.07 * Math.sin(k.t * 2.1)); for (const b of t.beams) b.material.opacity = b.userData.a * f; t.light.rotation.y += k.dt * 0.25; }
        // the kept flame
        const fl = c.played('flame') && d < 70; t.flame.visible = t.core.visible = !!fl;
        if (fl) { const y = m.stand(t.pos[0], t.pos[1]) + 1.06, a = t.npc ? t.npc.root.rotation.y : t.face, x = t.pos[0] + Math.sin(a) * 0.3, z = t.pos[1] + Math.cos(a) * 0.3; t.flame.position.set(x, y, z); t.core.position.set(x, y, z); t.flame.material.opacity = 0.85 * (0.9 + 0.1 * Math.sin(k.t * 9)); } },
    },

    // ---- the fire. It burns cold in the Moonwell's two bowls. When the letter is given it wakes in the dead well
    // behind Halcyon ("It's waking. Wait for my word."). When it ends, all of it is out. ----
    { id: 'the-fire', place: ['moonwell', 769, 455],
      make: (t, k) => { const T = k.THREE, oy = k.part.oy || 0; t.bowls = []; Q.fire = { at: [k.X(769), k.Z(455)] };
        for (const px of [650, 886]) { const x = k.X(px), z = k.Z(748), a = k.halo(0xc4d6ff, 3.6, 0.9), b = k.halo(0xffffff, 1.3, 1); a.position.set(x, oy + 2.6, z); b.position.set(x, oy + 2.45, z); k.scene.add(a); k.scene.add(b); t.bowls.push(a, b); }
        const g = new T.Group(), x = k.X(769), z = k.Z(455); t.well = g; t.parts = [];
        for (const a of [0, Math.PI / 3, 2 * Math.PI / 3]) { const m = k.glow(0xdce8ff, 1, 0.9); m.scale.set(4.6, 9, 1); m.rotation.y = a; m.position.y = 5.2; g.add(m); t.parts.push(m); }
        const hl = k.halo(0xc4d6ff, 17, 0.6); hl.position.y = 4.5; g.add(hl); t.parts.push(hl);
        const fl = k.glow(0xc4d6ff, 26, 0.5); fl.rotation.x = -Math.PI / 2; fl.position.y = 0.45; g.add(fl); t.parts.push(fl);
        for (const m of t.parts) m.userData.a = m.material.opacity;
        g.position.set(x, oy, z); g.visible = false; k.scene.add(g); t.grow = 0; },
      tick: (t, c, me, k) => { const d = k.cam.position.distanceTo(t.well.position), near = d < 170, lit = c.stage < 4 && near, f = k.fade(d);
        t.bowls.forEach((b, i) => { b.visible = lit; if (lit) b.material.opacity = (i % 2 ? 0.95 : 0.8) * f * (0.88 + 0.12 * Math.sin(k.t * (5 + i) + i)); });
        const awake = c.heard('letter') && !c.won() && near; t.grow = awake ? Math.min(1, t.grow + k.dt / 7) : Math.max(0, t.grow - k.dt / 2.5);
        t.well.visible = t.grow > 0.01; if (t.well.visible) { const e = t.grow * t.grow * (3 - 2 * t.grow); t.well.scale.set(0.5 + 0.5 * e, 0.25 + 0.75 * e, 0.5 + 0.5 * e); t.well.rotation.y += k.dt * 0.5;
          for (const m of t.parts) m.material.opacity = m.userData.a * e * f * (0.9 + 0.1 * Math.sin(k.t * 4.3)); } },
    },

    // ---- the moths. "Look. Moths. Hundreds. Thousands." "Every one of them knows its name." Fourteen hundred small
    // pale wings rising from the well, the court, the street and the town below, for about a minute and a quarter. ----
    { id: 'moths',
      make: (t, k) => { t.k = k; const T = k.THREE, R = rand(2424), N = 1400, pos = new Float32Array(N * 3), seed = new Float32Array(N * 4), well = spot(k, 'moonwell', 769, 455);
        for (let i = 0; i < N; i++) { let x, z; const u = R();
          if (u < 0.5) { const a = R() * 6.2832, r = Math.sqrt(R()) * 17; x = well[0] + Math.cos(a) * r; z = well[1] + Math.sin(a) * r * 0.8; }                    // the court, thickest at the well
          else if (u < 0.72) { [x, z] = spot(k, 'moonwell', 700 + R() * 140, 800 + R() * 640); }                                                                // the Moonwell's street
          else { [x, z] = spot(k, 'misthollow', 706 + R() * 120, -400 + R() * 1000); }                                                                          // Misthollow's street, where the forty stood
          pos[i * 3] = x; pos[i * 3 + 1] = k.stand(x, z) + 0.4 + R() * 1.8; pos[i * 3 + 2] = z; seed[i * 4] = R(); seed[i * 4 + 1] = R(); seed[i * 4 + 2] = R(); seed[i * 4 + 3] = u < 0.5 ? R() * R() : R(); }
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aS', new T.BufferAttribute(seed, 4));
        const mat = new T.ShaderMaterial({ transparent: true, depthWrite: false, blending: T.AdditiveBlending, uniforms: { uT: { value: -1 }, uPx: { value: 90 } },
          vertexShader: `uniform float uT, uPx; attribute vec4 aS; varying float vA;
            void main(){ float t = uT - aS.w * 16.0, on = step(0.0, t) * step(0.0, uT); t = max(t, 0.0);
              float ph = aS.z * 6.2832, sw = 0.5 + aS.x * 1.9;
              vec3 p = position + vec3(sin(t * (0.5 + aS.x) + ph) * sw - 0.17 * t, t * (0.7 + aS.y * 1.1) + 0.012 * t * t, cos(t * (0.4 + aS.y) + ph) * sw - 0.1 * t);
              vec4 mv = modelViewMatrix * vec4(p, 1.0); gl_Position = projectionMatrix * mv;
              gl_PointSize = on * uPx * (0.55 + aS.y * 0.85) * (0.7 + 0.3 * sin(t * 17.0 + ph * 3.0)) / max(1.0, -mv.z);
              vA = on * smoothstep(0.0, 1.5, t) * (1.0 - smoothstep(52.0, 76.0, t)) * (1.0 - smoothstep(70.0, 170.0, -mv.z)); }`,
          fragmentShader: 'varying float vA; void main(){ float r = length(gl_PointCoord - 0.5); gl_FragColor = vec4(0.93, 0.95, 1.0, vA * smoothstep(0.5, 0.12, r)); }' });
        const m = new T.Points(g, mat); m.frustumCulled = false; m.visible = false; m.name = 'z4-moths'; k.scene.add(m); t.m = m; t.T0 = -1; t.N = N; t.done = null;
        t.fly = () => { t.T0 = k.clock.t; t.done = false; m.visible = true; }; },
      look: (t, c) => { if (t.done == null) t.done = !!c.heard('after-fire'); },          // (if the fire ended before this page was opened, they have long gone)
      // they rise as Io says "Go on, then. All of you. Go home.", so that by Callisto's "Look. Moths." the air is full of them
      tick: (t, c, me, k) => { if (!t.m) return; if (t.T0 < 0) { if (t.done !== false || !c.played('after-fire')) return; const s = t.k.people.say(); if ((s && (s.id === 'z4.io.10' || s.id === 'z4.callisto.08')) || c.heard('after-fire')) t.fly(); else return; }
        const s = k.t - t.T0; t.m.material.uniforms.uT.value = s; t.m.material.uniforms.uPx.value = 150 * (G.innerHeight || 720) / 720 * Math.min(2, G.devicePixelRatio || 1);
        if (s > 96) { t.m.visible = false; t.T0 = -1; t.done = true; } },
    },

    // ---- the spare lamp. "Five, then. I'll light a spare." It hangs dark on its post by the ship's stern until the Grey
    // Hat has said so, and burns from then on. ("Twelve lamps lit and a spare." "Good thing I lit the spare.") ----
    { id: 'spare-lamp', place: ['frozen-camp', 468, 504],
      make: (t, k) => { const sp = Q.spare; if (!sp) return; const oy = k.part.oy || 0, x = k.part.ox + sp[0], y = oy + sp[1], z = k.part.oz + sp[2];
        t.h = k.halo(0xffb060, 1.5, 0.8); t.c = k.halo(0xffe0a8, 0.3, 1); t.p = k.pool(0xffb070, 5, 0.4, x, z); t.h.position.set(x, y, z); t.c.position.set(x, y, z); for (const m of [t.h, t.c, t.p]) { m.visible = false; k.scene.add(m); } },
      tick: (t, c, me, k) => { if (!t.h) return; const d = k.cam.position.distanceTo(t.h.position), on = c.heard('captain.landing') && d < 120, f = k.fade(d) * (0.94 + 0.06 * Math.sin(k.t * 6.3));
        t.h.visible = t.c.visible = t.p.visible = on; if (on) { t.h.material.opacity = 0.8 * f; t.c.material.opacity = f; t.p.material.opacity = 0.4 * f; } },
    },

    // ---- the footprints. "Footprints. Coming down. Forty pairs, and boots I know." When the fire has ended, the snow of
    // the trail past the pass-keeper's hut is trodden by forty pairs of boots, all going the one way: down. ----
    { id: 'footprints', place: ['frozen-camp', HUT[0], HUT[1] + 70],
      make: (t, k) => { const T = k.THREE, R = rand(4041), line = [[3060, 574], [2800, 572], [2600, 600], [2350, 622], [2100, 592], [1900, 562], [1700, 584], [1520, 570], [1300, 560], [1100, 556]].map(([px, py]) => [k.X(px), k.Z(py)]), pos = [], idx = []; let n = 0;
        for (let lane = 0; lane < 7; lane++) { const off = (lane - 3) * 0.3 + (R() - 0.5) * 0.2; let foot = 1, carry = R() * 0.4;
          for (let i = 1; i < line.length; i++) { const a = line[i - 1], b = line[i], L = Math.hypot(b[0] - a[0], b[1] - a[1]), ux = (b[0] - a[0]) / L, uz = (b[1] - a[1]) / L;
            for (let d = carry; d < L; d += 0.36 + R() * 0.06) { foot = -foot; const side = off + foot * 0.11 + (R() - 0.5) * 0.06, cx = a[0] + ux * d - uz * side, cz = a[1] + uz * d + ux * side, hl = 0.14, hw = 0.055, y = k.ground(cx, cz) + 0.035, base = pos.length / 3;
              for (const [l, w] of [[-hl, -hw], [hl, -hw], [hl, hw], [-hl, hw]]) pos.push(cx + ux * l - uz * w, y, cz + uz * l + ux * w); idx.push(base, base + 2, base + 1, base, base + 3, base + 2); n++; }
            carry = 0.2 * R(); } }
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeBoundingSphere();
        const mat = new T.MeshBasicMaterial({ color: 0x3c4466, transparent: true, opacity: 0.6, depthWrite: false, side: T.DoubleSide, polygonOffset: true, polygonOffsetFactor: -2 }); mat.onBeforeCompile = (sh) => misted(sh, k.W.P.U); mat.customProgramCacheKey = () => 'z4-prints';
        t.m = new T.Mesh(g, mat); t.m.visible = false; t.m.name = 'z4-footprints'; k.scene.add(t.m); t.n = n; },
      tick: (t, c, me, k) => { if (t.m) t.m.visible = c.stage >= 4 && Math.hypot(t.x - me.x, t.z - me.z) < 130; },
    },

    // ---- Ede's hearth, once the fire has ended. ("It caught. My fire caught. Look at it. Look at it burn.") A warm
    // light at the Lantern House's door, the first flame to stay lit in Misthollow for eight years. ----
    { id: 'ede-hearth', place: ['misthollow', 1000, 650],
      make: (t, k) => { const x = k.X(1000), z = k.Z(648), y = k.ground(x, k.Z(660)); t.h = k.halo(0xff8224, 4.4, 0.9); t.h.position.set(x, y + 1.25, z + 0.15); t.c = k.halo(0xffb860, 1.3, 0.9); t.c.position.set(x, y + 1.0, z + 0.1);
        t.p = k.pool(0xff8224, 11, 0.6, x, z + 2.4); for (const m of [t.h, t.c, t.p]) { m.visible = false; k.scene.add(m); } },
      tick: (t, c, me, k) => { const d = k.cam.position.distanceTo(t.h.position), on = c.stage >= 4 && d < 140, f = k.fade(d) * (0.9 + 0.1 * Math.sin(k.t * 7.3));
        t.h.visible = t.c.visible = t.p.visible = on; if (on) { t.h.material.opacity = 0.85 * f; t.c.material.opacity = 0.9 * f; t.p.material.opacity = 0.5 * f; } },
    },
  ];

  // ---- how zone 4's story moves. The stages and the moments are the story job's; what moves each on is the job's
  // call, made to fit the land. ----
  const bramble = (c, d) => { const b = Q.bramble; if (!b) return false; const me = c.people.me(); return Math.hypot(me.x - b.at[0], me.z - b.at[1]) < d; };
  W3D.STORY['zone-4'] = {
    talk: 'COVEN_TALK_Z4', key: 'coven.story.z4.v1', gate: 'theFire', first: 'landing',
    // (for the checks: who has nothing to say before a stage, by the lines' own conditions)
    quiet: { warden: 4 },
    stages: [
      { to: 1, when: (c) => c.heard('passkeeper.01') || c.near('frozen-pass', 2) || c.near('misthollow', 2) },   // pass: the pass-keeper has been heard (or the coven has gone up without her)
      { to: 2, when: (c) => c.near('misthollow', 2) },                                                          // town: Misthollow is reached
      { to: 3, when: (c) => c.stage >= 2 && c.heard('letter') },                                                // stair: Io has given Halcyon the letter
      { to: 4, when: (c) => c.stage >= 3 && c.won() },                                                          // after: the fire has ended
    ],
    tell: [
      // (each is said where what it names is in view: at the fork by the mere, and by the iron lamp before the causeway)
      ['shore', (c) => c.spot('frostmere-shore', 640, 470, 16)],
      ['pass', (c) => c.spot('frozen-pass', 782, 730, 14)],
      ['bramble-gone', (c) => !!c.flag('bramble') && c.heard('frozen-road')],
      ['down', (c) => c.heard('moonset')],
      ['leaving', (c) => !!c.flag('leaving')],
    ],
    each: (c) => {
      // the Warden who speaks: one of the forty until the fire ends, then at the bottom of the street
      if (c.stage >= 4 && !c.woke) { c.woke = true; c.people.move('warden', AWAKE); }
      // once the coven has gone on down the pass, the forty have gone down ahead of it
      if (c.stage >= 4 && !c.flag('gone') && c.played('moonset') && !c.near('misthollow', 420)) c.flag('gone', true);
      // the bramble that was walked round is behind them all the same
      if (c.stage >= 2 && !c.flag('bramble')) c.flag('bramble', true);
      // the leaving for the Faire: the Grey Hat has counted five down. (The ship is the gate: the hub joins the flight home here.)
      if (c.stage >= 4 && c.heard('captain.07') && !c.flag('leaving')) c.flag('leaving', true);
    },
    moments: [
      ['after-fire', (c) => c.stage >= 4],
      ['bow', (c) => c.heard('after-fire')],
      ['flame', (c) => c.heard('bow')],
      ['moonset', (c) => c.heard('flame')],
      // (until the fights job sets the great bramble's fight, it gives way once the coven has stood before it and spoken)
      ['frozen-road', (c) => !c.flag('bramble') && bramble(c, 24), (c) => { if (!c.fights) c.flag('bramble', true); }],
      // at the top of the great stair, where the street and its two files of Wardens open in front of the coven
      ['misthollow', (c) => c.spot('misthollow', 766, 650, 10) || c.spot('misthollow', 766, 560, 9)],
      ['stair', (c) => c.stage >= 2 && c.spot('moonwell', STEP[1], STEP[2], 15)],
      ['letter', (c) => c.heard('stair') && c.spot('moonwell', STEP[1], STEP[2], 3.2)],
      ['before-fire', (c) => c.heard('letter') && !c.won()],
      // (until the fights job sets the fire's fight: the coven speaks between its two forms, and it ends)
      ['between', (c) => !c.gate && c.heard('before-fire') && !c.won(), (c) => { if (!c.gate) c.flag('gate', true); }],
    ],
  };
  Q.spots = { AWAKE, STEP, HOME, R3, R4 };
})(window);
