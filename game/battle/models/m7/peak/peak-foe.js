// peak-foe.js: the frozen peaks' two creatures, the Wickstoat and the Hoarmantle, made through the shared loader
// (m7-foe.js, the creatures job's) with the few things each needs that a baked model cannot hold (Coven of the Moon
// Faire, the peak-creatures job, November 24, 2026).
//
//   makePeakFoe({ kind: 'wickstoat' | 'hoarmantle' })   what slots.js names: makeM7Foe's creature, plus
//     - its ice pieces that must be clear and must never bend (the Wickstoat's nine spines), each hung on one bone;
//     - its lights that the fight changes one by one (the Wickstoat's nine sparks: foe.lit, 0 to 9);
//     - its one small effect, played on its own moves' moments (motes of stolen light; a frosty breath; falling snow).
// Everything a person might change is data, in <kind>/<kind>.js (`peak`). Nothing else in the battle is touched.
(function (G) {
  'use strict';
  const T = G.THREE, M7 = G.M7;
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const bump = (x) => Math.sin(clamp01(x) * Math.PI);

  // sculpt coordinates (x his right, y forward, z up) to the model's (three.js: +X his left, +Y up, +Z forward)
  const toModel = (s) => new T.Vector3(-s[0], s[2], s[1]);
  function boneRest(meta, name) { const b = meta.bones.find((x) => x.name === name); return b ? new T.Vector3(...b.head) : new T.Vector3(); }
  // a child of a bone at a place given in the model's rest coordinates (a bone's rest turn is none, so this is a sum)
  function hang(F, meta, bone, at) { const o = new T.Object3D(); o.position.copy(at).sub(boneRest(meta, bone)); (F.bones[bone] || F.mesh).add(o); return o; }

  let DOT = null;
  function dotTex() { if (DOT) return DOT; const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.3, 'rgba(255,255,255,0.5)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64); return (DOT = new T.CanvasTexture(c)); }

  // ---- a pool of soft points (the battle's look: additive, round, no outline): at most 48 ----
  function pool(n, size, additive) {
    n = Math.min(48, n); const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const mat = new T.PointsMaterial({ size, map: dotTex(), vertexColors: true, transparent: true, depthWrite: false, blending: additive === false ? T.NormalBlending : T.AdditiveBlending });
    const pts = new T.Points(g, mat); pts.frustumCulled = false;
    const P = []; for (let i = 0; i < n; i++) P.push({ on: false, age: 0, life: 1, p: new T.Vector3(), v: new T.Vector3(), a: new T.Vector3(), c: new T.Color(), b: 1, drag: 0, to: null, from: new T.Vector3(), arc: 0, done: null });
    function free() { return P.find((q) => !q.on) || P[0]; }
    return { pts, P, mat,
      emit(o) { const q = free(); q.on = true; q.age = 0; q.life = o.life || 1; q.p.copy(o.p); q.from.copy(o.p); q.v.copy(o.v || new T.Vector3()); q.a.copy(o.a || new T.Vector3());
        q.c.set(o.color != null ? o.color : 0xffffff); q.b = o.bright != null ? o.bright : 1; q.drag = o.drag || 0; q.to = o.to || null; q.arc = o.arc || 0; q.done = o.done || null; return q; },
      update(dt, fade) {
        for (let i = 0; i < n; i++) { const q = P[i];
          if (q.on) { q.age += dt; const u = q.age / q.life;
            if (q.to) { const tp = typeof q.to === 'function' ? q.to() : q.to, e = u * u * (3 - 2 * u); q.p.lerpVectors(q.from, tp, e); q.p.y += q.arc * Math.sin(Math.PI * clamp01(u)); }
            else { q.v.addScaledVector(q.a, dt); q.v.multiplyScalar(1 - q.drag * dt); q.p.addScaledVector(q.v, dt); if (q.p.y < 0.02) { q.p.y = 0.02; q.v.set(0, 0, 0); } }
            if (u >= 1) { q.on = false; if (q.done) { const d = q.done; q.done = null; d(); } } }
          const a = q.on ? Math.sin(Math.min(1, q.age / q.life) * Math.PI) ** 0.6 * q.b * fade : 0;
          pos[i * 3] = q.p.x; pos[i * 3 + 1] = q.p.y; pos[i * 3 + 2] = q.p.z; col[i * 3] = q.c.r * a; col[i * 3 + 1] = q.c.g * a; col[i * 3 + 2] = q.c.b * a; }
        g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
      } };
  }

  // ---- the Wickstoat's nine spines: clear faceted ice, swept back, each with one spark inside ----
  function spineGeo(L, W, Hh) {
    // a crystal: a diamond base, its apex high and toward the back, a ridge down its front edge (flat facets)
    const v = [[0, 0, L * 0.55], [W * 0.5, 0, 0], [0, 0, -L * 0.45], [-W * 0.5, 0, 0], [0, Hh, -L * 0.3], [0, Hh * 0.5, L * 0.18], [W * 0.18, Hh * 0.55, -L * 0.25], [-W * 0.18, Hh * 0.55, -L * 0.25]];
    const f = [[0, 1, 5], [1, 6, 5], [5, 6, 4], [1, 2, 6], [6, 2, 4], [0, 5, 3], [3, 5, 7], [5, 4, 7], [3, 7, 2], [7, 4, 2], [0, 3, 1], [1, 3, 2]];
    const pos = []; for (const t of f) for (const i of t) pos.push(...v[i]);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.computeVertexNormals(); return g;
  }
  function wickstoat(f, def, meta) {
    const P = def.peak, F = f.F, root = f.root, S = P.sheet;
    const toS = (px, py, xo) => [(xo || 0) * S.m, (px - S.mid) * S.m, (S.ground - py) * S.m];
    const ice = new T.MeshPhongMaterial({ color: P.ice, specular: 0x3a5060, shininess: 50, flatShading: true, transparent: true, opacity: P.iceOpacity, depthWrite: false, side: T.DoubleSide, emissive: new T.Color(P.iceGlow), skinning: false });
    const spines = [];
    P.spines.forEach((s, i) => {
      const base = toModel(toS(s.px, s.py + s.sink));
      const o = hang(F, meta, s.bone, base);
      const m = new T.Mesh(spineGeo(s.len * S.m, s.wide * S.m, (s.tall + s.sink) * S.m), ice); m.renderOrder = 2; o.add(m);
      const core = new T.Mesh(new T.OctahedronGeometry(s.tall * S.m * 0.17, 0), new T.MeshBasicMaterial({ color: P.spark, transparent: true, depthWrite: false }));   // solid warm amber (added light turns white on white fur)
      core.position.set(0, (s.tall * 0.42 + s.sink) * S.m, -s.len * S.m * 0.08); core.renderOrder = 3; o.add(core);
      const halo = new T.Sprite(new T.SpriteMaterial({ map: dotTex(), color: P.spark, transparent: true, blending: T.AdditiveBlending, depthWrite: false }));
      halo.position.copy(core.position); halo.scale.setScalar(s.tall * S.m * 0.7); halo.renderOrder = 3; o.add(halo);
      spines.push({ o, core, halo, glow: 0, ph: i * 0.7 });
    });
    const motes = pool(40, P.mote.size, true); root.add(motes.pts);
    let lit = Math.max(0, Math.min(9, P.startLit | 0)), last = '', lastP = -1, flash = 0, coming = 0;
    const wp = new T.Vector3();
    const sparkAt = (i) => { spines[i].core.updateWorldMatrix(true, false); return root.worldToLocal(spines[i].core.getWorldPosition(new T.Vector3())); };
    const base = { animate: f.animate, play: f.play, reset: f.reset };
    f.play = function (name, force) {
      const ok = base.play.call(f, name, force);
      if (ok && name === 'die') {            // let go: its stolen lights drift back to the coven, and it bolts
        for (let i = 0; i < lit; i++) { const from = sparkAt(i); motes.emit({ p: from, to: new T.Vector3((Math.random() - 0.5) * 1.6, 1.0 + Math.random() * 0.5, P.mote.reach * (1.2 + Math.random() * 0.8)), arc: 0.5, life: 1.6 + Math.random() * 0.8, color: P.spark, bright: 1.2 }); }
        lit = 0; f.state.lit = 0;
      }
      return ok;
    };
    f.reset = function () { base.reset.call(f); last = ''; lastP = -1; flash = 0; };
    f.animate = function (phase, wb, time, dt) {
      base.animate.call(f, phase, wb, time, dt);
      const act = f.action, pr = f.progress, A = def.acts[act];
      // Pinch: at the blow, a mote of light leaves the witch in front of it and flies into the next dark spine
      if (act === 'pinch' && A && lastP < A.hits[0] && pr >= A.hits[0] && lit + coming < 9) {
        const k = lit + coming; coming++;
        motes.emit({ p: new T.Vector3(0, P.mote.height, P.mote.reach), to: () => sparkAt(k), arc: 0.35, life: P.mote.fly, color: P.spark, bright: 1.4,
          done: () => { coming = Math.max(0, coming - 1); lit = Math.min(9, lit + 1); f.state.lit = lit; spines[Math.min(8, lit - 1)].glow = 2.5; } });
      }
      if (act === 'glint' && A && lastP < A.hits[0] && pr >= A.hits[0]) flash = 1;
      lastP = act === last ? pr : -1; last = act;
      flash = Math.max(0, flash - dt * 1.6);
      const fade = f.material.opacity * (F.mesh.visible ? 1 : 0), boost = 1 + P.glintK * flash * (0.4 + 0.6 * lit / 9);
      ice.opacity = P.iceOpacity * fade; ice.emissive.setScalar(0).add(new T.Color(P.iceGlow)).multiplyScalar(1 + 2 * flash * lit / 9);
      spines.forEach((s, i) => {
        const on = i < lit, pulse = 0.82 + 0.18 * Math.sin(time * P.pulse + s.ph);
        s.glow = Math.max(on ? 1 : 0, s.glow - dt * 2); const g = s.glow * pulse * boost * fade;
        s.core.visible = s.halo.visible = g > 0.01; s.core.material.opacity = Math.min(1, g); s.halo.material.opacity = Math.min(1, g * 0.45);
        s.halo.scale.setScalar(def.peak.spines[i].tall * S.m * (0.7 + 0.6 * flash) * (on ? 1 : 0.6));
      });
      motes.update(dt, 1);
    };
    Object.defineProperty(f, 'lit', { get: () => lit, set: (v) => { lit = Math.max(0, Math.min(9, v | 0)); f.state.lit = lit; } });
    f.state.lit = lit;
    const st = Object.getOwnPropertyDescriptor(f, 'state');
    Object.defineProperty(f, 'state', { get: st.get, set(v) { st.set(v); if (v && v.lit != null) { lit = Math.max(0, Math.min(9, v.lit | 0)); } }, configurable: true });
    f.stats.peak = { spines: spines.length, sparks: spines.length, motes: 40 };
    f.animate(0, 0, 0, 0);
    return f;
  }

  // ---- the Hoarmantle: a frosty breath from its nose, snow falling from its mantle ----
  function hoarmantle(f, def, meta) {
    const P = def.peak, F = f.F, root = f.root, S = P.sheet;
    const nose = hang(F, meta, 'head', toModel([0, (P.nose[0] - S.mid) * S.m, (S.ground - P.nose[1]) * S.m]));
    // the brow ice: one faceted slab of clear pale-blue ice, low on the brow, its lower edge a shallow V (data: peak.helm)
    if (P.helm) {
      const Hm = P.helm, toS = (q) => [q[0] * S.m, (q[1] - S.mid) * S.m, (S.ground - q[2]) * S.m], c0 = Hm.centre, rows = Hm.rows, nr = rows.length, nc = rows[0].length;
      const outer = [], inner = [];
      for (const row of rows) for (const q of row) { outer.push(toModel(toS(q)));
        const k = Hm.thick / Math.hypot(q[1] - c0[0], q[2] - c0[1], q[0]); inner.push(toModel(toS([q[0] * (1 - k), q[1] - (q[1] - c0[0]) * k, q[2] - (q[2] - c0[1]) * k]))); }
      const pos = [], quad = (a, b, c, d) => { for (const v of [a, b, c, a, c, d]) pos.push(v.x, v.y, v.z); }, at = (i, j) => i * nc + j;
      for (let i = 0; i < nr - 1; i++) for (let j = 0; j < nc - 1; j++) {
        quad(outer[at(i, j)], outer[at(i + 1, j)], outer[at(i + 1, j + 1)], outer[at(i, j + 1)]);
        quad(inner[at(i, j)], inner[at(i, j + 1)], inner[at(i + 1, j + 1)], inner[at(i + 1, j)]); }
      const edge = []; for (let j = 0; j < nc; j++) edge.push(at(0, j)); for (let i = 1; i < nr; i++) edge.push(at(i, nc - 1));
      for (let j = nc - 2; j >= 0; j--) edge.push(at(nr - 1, j)); for (let i = nr - 2; i > 0; i--) edge.push(at(i, 0));
      for (let e = 0; e < edge.length; e++) { const a = edge[e], b = edge[(e + 1) % edge.length]; quad(outer[a], outer[b], inner[b], inner[a]); }
      const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(pos, 3)); g.computeVertexNormals();
      const helmMat = new T.MeshPhongMaterial({ color: Hm.ice, specular: 0x4a6878, shininess: 40, flatShading: true, transparent: true, opacity: Hm.opacity, depthWrite: false, side: T.DoubleSide, emissive: new T.Color(Hm.glow) });
      const mesh = new T.Mesh(g, helmMat); mesh.renderOrder = 2;
      const o = hang(F, meta, 'head', new T.Vector3()); o.add(mesh);
      f.helm = { mesh, mat: helmMat };
    }
    // the face, sharp from Chris's sheet: thin skins on the sculpt's own face with the sheet's front and side views of
    // it, and two small pale-blue eyes (data: hoarmantle/face.js, made by peak/src/face.py)
    if (P.face) {
      const o = hang(F, meta, 'head', new T.Vector3()), FC = P.face, mats = {};
      for (const k in FC.pictures) { const tx = new T.TextureLoader().load(FC.pictures[k]); tx.encoding = T.sRGBEncoding; tx.anisotropy = 4;
        mats[k] = new T.MeshStandardMaterial({ map: tx, emissiveMap: tx, emissive: new T.Color(0xffffff), emissiveIntensity: P.faceLift, roughness: 0.9, metalness: 0,
          transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }); }
      for (const sk of FC.skins) {
        const pos = new Float32Array(sk.p.length * 3), uv = new Float32Array(sk.uv.length * 2);
        sk.p.forEach((q, i) => { const v = toModel(q); pos[i * 3] = v.x; pos[i * 3 + 1] = v.y; pos[i * 3 + 2] = v.z; uv[i * 2] = sk.uv[i][0]; uv[i * 2 + 1] = 1 - sk.uv[i][1]; });
        const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('uv', new T.BufferAttribute(uv, 2));
        g.setIndex([].concat(...sk.t)); g.computeVertexNormals();
        const m = new T.Mesh(g, mats[sk.picture]); m.renderOrder = 1; o.add(m); }
      const eyeM = new T.MeshStandardMaterial({ color: P.eye, emissive: new T.Color(P.eyeGlow), roughness: 0.25 }), pupM = new T.MeshBasicMaterial({ color: 0x0a0c10 });
      for (const e of FC.eyes) { const v = toModel(e), r = P.eyeSize;
        const ball = new T.Mesh(new T.SphereGeometry(r, 12, 8), eyeM); ball.position.copy(v); ball.scale.set(1, 0.85, 0.6); o.add(ball);
        const pup = new T.Mesh(new T.SphereGeometry(r * 0.55, 8, 6), pupM); pup.position.copy(v).add(new T.Vector3(0, 0, r * 0.4)); pup.scale.set(1, 1, 0.5); o.add(pup); }
      f.face = { mats };
    }
    const breath = pool(40, P.breath.size, true); root.add(breath.pts);
    const snow = pool(44, P.snow.size, true); root.add(snow.pts);
    let last = '', lastP = -1, nextHuff = 2 + Math.random() * P.huffEvery, blowing = 0;
    const np = new T.Vector3(), fwd = new T.Vector3();
    function puff(n, speed, spread, life) {
      nose.updateWorldMatrix(true, false); root.worldToLocal(nose.getWorldPosition(np));
      for (let i = 0; i < n; i++) breath.emit({ p: np.clone().add(new T.Vector3((Math.random() - 0.5) * 0.08, (Math.random() - 0.5) * 0.06, 0)),
        v: new T.Vector3((Math.random() - 0.5) * spread, -0.1 + Math.random() * 0.25, speed * (0.6 + 0.6 * Math.random())), a: new T.Vector3(0, 0.12, 0), drag: 0.8,
        life: life * (0.7 + 0.6 * Math.random()), color: P.breath.color, bright: P.breath.bright });
    }
    function fall(n) {
      for (let i = 0; i < n; i++) { const a = Math.random() * Math.PI * 2, rr = Math.sqrt(Math.random());
        snow.emit({ p: new T.Vector3(Math.cos(a) * P.snow.wide * rr, P.snow.from * (0.7 + 0.3 * Math.random()), (Math.random() - 0.4) * P.snow.long), v: new T.Vector3(Math.cos(a) * 0.5, 0.3 + Math.random() * 0.4, 0),
          a: new T.Vector3(0, -3.2, 0), drag: 0.6, life: 0.9 + Math.random() * 0.7, color: Math.random() < P.snow.iceShare ? P.snow.ice : P.snow.color, bright: P.snow.bright }); }
    }
    const base = { animate: f.animate };
    f.animate = function (phase, wb, time, dt) {
      base.animate.call(f, phase, wb, time, dt);
      const act = f.action, pr = f.progress, A = def.acts[act];
      if (act === 'breath' && A && lastP < A.hits[0] - 0.08 && pr >= A.hits[0] - 0.08) blowing = P.breath.long;
      if (act === 'shake' && A && lastP < A.hits[0] && pr >= A.hits[0]) fall(40);
      if (act === 'shake' && pr > 0.15 && pr < 0.8 && Math.random() < dt * 14) fall(1);
      lastP = act === last ? pr : -1; last = act;
      if (blowing > 0) { blowing -= dt; if (Math.random() < dt * 40) puff(1, P.breath.reach, 1.6, 1.4); }
      if (!act && !(wb > 0.5)) { nextHuff -= dt; if (nextHuff <= 0) { puff(6, 0.5, 0.25, 1.1); nextHuff = P.huffEvery * (0.7 + 0.6 * Math.random()); } }
      const fade = f.material.opacity * (F.mesh.visible ? 1 : 0);
      if (f.helm) { f.helm.mat.opacity = P.helm.opacity * fade; f.helm.mesh.visible = fade > 0.01; }
      if (f.face) for (const k in f.face.mats) f.face.mats[k].opacity = fade;
      breath.update(dt, fade); snow.update(dt, fade);
    };
    f.stats.peak = { breath: 40, snow: 44 };
    f.animate(0, 0, 0, 0);
    return f;
  }

  const MAKERS = { wickstoat, hoarmantle };
  G.makePeakFoe = function (opts) {
    const o = opts || {}, f = G.makeM7Foe(o), def = M7.kinds[o.kind];
    if (!def.peak || !MAKERS[o.kind] || M7.LOOK.before) return f;
    return MAKERS[o.kind](f, def, M7.bins[o.kind].meta);
  };
})(window);
