// m7-foe.js: the one way in for Aethermoor M7's creatures (Coven of the Moon Faire, the creatures job, November 24).
// Made here, from the fights job's trial (game/encounters/ADDING-A-CREATURE.md): M7's own loader is written for
// three.js 0.170 as a module, so it is written again here for this game's r128, as a script. Every creature uses it:
//
//   window.M7.bin(key, meta, text)     its model, from <key>/light.js (tools/m7-pack.py)
//   window.M7.addMoves(name, set)      a moves file of M7's (moves/*.js), as M7 wrote it
//   window.M7.add(key, def)            its look line, its motions and its pictures (<key>/<key>.js: data)
//   await window.M7.ready              the models unpacked (a page waits for this before its first fight)
//   makeM7Foe({ kind: key })           one creature, as the battle wants a foe's model (stand-in.js has the list)
//
// What this file does for every creature at once:
//   1. LOOK. M7 draws with colour management (its pictures read as sRGB, light worked out in linear numbers, then a
//      film curve, ACES, and back to the screen's sRGB), a bright studio light and a soft room reflected in shiny parts.
//      This battle draws everything as painted, with no curve, under three dim night lights and no reflection. So the
//      same creature came out darker and flatter here: its colour picture was darkened twice over, its shadows had no
//      lift, and its metal (the stag's crown, the warden's plate) reflected nothing and went near black. Here each
//      creature's own material does M7's sums (sRGB in, the film curve, sRGB out) under this battle's own lights, and
//      reflects a small night sky (made here in code). The other things in the battle are not touched.
//   2. IT READS AT NIGHT: a soft rim of light from the moon's side, its own glow picture lit, and its numbers to keep
//      it no brighter than the four witches (M7.LOOK, below, and each creature's `mat`).
//   3. THE JOIN: M7 poses a creature as a pure pose of (move, how far through, clock); this battle asks for motions by
//      name (play, busy, progress, the moments blows land). Each creature's data says which of its moves plays for
//      which motion, when the blow lands, how it arrives and how it is let go.
//   4. ALIVE WHEN STILL: a standing loop of its own on top of M7's breathing, blended in and out so nothing jumps.
//   5. ONE SMALL EFFECT of its own (a few dozen motes), and its mends (joint limits, skin weights), all from its data.
(function (G) {
  'use strict';
  const T = G.THREE;
  const M7 = G.M7 = G.M7 || {};
  M7.kinds = M7.kinds || {}; M7.moves = M7.moves || {}; M7.bins = M7.bins || {};

  // ---- the shared look numbers (data: change here and all seven change) ----
  M7.LOOK = {
    film: true,           // M7's film curve (ACES) and sRGB, on the creature only
    exposure: 1.0,        // how bright before the curve (M7's beasts page uses 1.45 under a studio light)
    env: 0.55,            // how much of the night sky shiny parts reflect
    rim: 0x8f9cff, rimK: 0.45, rimPow: 2.4,      // the moon's rim: its colour, how strong, how thin
    moon: [-5, 9, -12],   // where the moon light comes from (game/battle/screen.js, its DirectionalLight)
    // for the before-and-after pictures only: ?m7=before in a page's address draws them as they first came in (the
    // fights job's trial): no colour sums, no sky, no rim, no standing loop, no effect, no mends
    before: /[?&]m7=before\b/.test((G.location && G.location.search) || ''),
  };

  M7.bin = (key, meta, text) => { M7.bins[key] = { meta, text, bin: null }; };
  M7.addMoves = (name, set) => { M7.moves[name] = set; };
  M7.add = (key, def) => { def.key = key; M7.kinds[key] = def; };

  // ---- the models: unzipped once when the page has loaded, decoded the first time one is made ----
  async function unzip(text) {
    const bytes = Uint8Array.from(atob(text), (c) => c.charCodeAt(0));
    const s = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
    return new Uint8Array(await new Response(s).arrayBuffer());
  }
  let readyP = null;
  function start() {
    return readyP || (readyP = (async () => {
      const t0 = performance.now();
      await G.MeshoptDecoder.ready;
      for (const k in M7.bins) if (!M7.bins[k].bin) M7.bins[k].bin = await unzip(M7.bins[k].text);
      M7.unzipMs = performance.now() - t0; M7.isReady = true; return true;
    })());
  }
  Object.defineProperty(M7, 'ready', { get: start, configurable: true });
  if (G.document) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else setTimeout(start, 0); }

  function decode(meta, bin) {
    const n = meta.vertices, S = meta.stride, D = G.MeshoptDecoder;
    const vb = new Uint8Array(n * S); D.decodeVertexBuffer(vb, n, S, bin.subarray(0, meta.vbytes));
    const ib = new Uint32Array(meta.indices); D.decodeIndexBuffer(new Uint8Array(ib.buffer), meta.indices, 4, bin.subarray(meta.vbytes, meta.vbytes + meta.ibytes));
    const dv = new DataView(vb.buffer), pos = new Float32Array(n * 3), nrm = new Int8Array(n * 3), tan = new Int8Array(n * 4), uv = new Uint16Array(n * 2), ji = new Uint8Array(n * 4), jw = new Uint8Array(n * 4);
    const lo = meta.lo, hi = meta.hi;
    for (let i = 0; i < n; i++) { const o = i * S;
      for (let a = 0; a < 3; a++) pos[i * 3 + a] = lo[a] + dv.getUint16(o + a * 2, true) / 65535 * (hi[a] - lo[a]);
      for (let a = 0; a < 3; a++) nrm[i * 3 + a] = dv.getInt8(o + 8 + a);
      for (let a = 0; a < 4; a++) tan[i * 4 + a] = dv.getInt8(o + 12 + a);
      for (let a = 0; a < 2; a++) uv[i * 2 + a] = dv.getUint16(o + 16 + a * 2, true);
      for (let a = 0; a < 4; a++) { ji[i * 4 + a] = vb[o + 20 + a]; jw[i * 4 + a] = vb[o + 24 + a]; } }
    const g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('normal', new T.BufferAttribute(nrm, 3, true));
    g.setAttribute('tangent', new T.BufferAttribute(tan, 4, true)); g.setAttribute('uv', new T.BufferAttribute(uv, 2, true));
    g.setAttribute('uv2', g.attributes.uv);                     // r128: the shading picture (aoMap) reads a second set
    g.setAttribute('skinIndex', new T.BufferAttribute(ji, 4)); g.setAttribute('skinWeight', new T.BufferAttribute(jw, 4, true));
    g.setIndex(new T.BufferAttribute(ib, 1)); g.computeBoundingBox(); g.computeBoundingSphere();
    return g;
  }

  // ---- a small night sky for shiny parts to reflect: six faces painted here, the moon's side a little brighter ----
  let ENV = null;
  function nightSky() {
    if (ENV) return ENV;
    const face = (top, bot, moon) => { const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d');
      const g = x.createLinearGradient(0, 0, 0, 32); g.addColorStop(0, top); g.addColorStop(1, bot); x.fillStyle = g; x.fillRect(0, 0, 32, 32);
      if (moon) { const r = x.createRadialGradient(16, 8, 0, 16, 8, 18); r.addColorStop(0, moon); r.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = r; x.fillRect(0, 0, 32, 32); }
      return c; };
    const sky = '#4a4478', hor = '#2c2640', gnd = '#17121a';
    // +x, -x, +y, -y, +z, -z (the moon stands at -x, +y, -z)
    ENV = new T.CubeTexture([face(sky, hor), face(sky, hor, 'rgba(190,200,255,0.8)'), face(sky, sky), face(gnd, gnd), face(sky, hor), face(sky, hor, 'rgba(190,200,255,0.9)')]);
    ENV.encoding = T.sRGBEncoding; ENV.needsUpdate = true;
    return ENV;
  }

  // ---- the material: M7's sums on this creature only (see 1 at the top) ----
  const TEX = {}, LOADING = new Set();
  // every picture asked for so far, read: a check waits for this before it takes a picture
  M7.pictures = () => Promise.all([...LOADING]);
  function tex(url, srgb) {
    const k = url + (srgb ? 's' : 'l'); if (TEX[k]) return TEX[k];
    let done; const p = new Promise((r) => { done = r; }); LOADING.add(p);
    const t = new T.TextureLoader().load(url, () => done(), undefined, () => done()); t.flipY = false; t.anisotropy = 4; t.encoding = srgb ? T.sRGBEncoding : T.LinearEncoding;
    return (TEX[k] = t);
  }
  const SHADER_RIM = [
    '{ vec3 m7N = normalize( normal ); vec3 m7V = normalize( vViewPosition );',
    '  float m7F = pow( 1.0 - saturate( dot( m7N, m7V ) ), m7RimPow );',
    '  outgoingLight += m7Rim * m7F * saturate( dot( m7N, m7Moon ) * 0.6 + 0.4 ); }',
    'outgoingLight = mix( outgoingLight, vec3( dot( outgoingLight, vec3( 0.3, 0.59, 0.11 ) ) ) * vec3( 0.85, 0.8, 0.75 ), m7Gray );',
    'gl_FragColor = vec4( outgoingLight, diffuseColor.a );'].join('\n');
  const SHADER_OUT = [
    'if ( m7Film > 0.5 ) {',
    '  vec3 c = gl_FragColor.rgb * m7Exposure / 0.6;',
    '  c = mat3( 0.59719, 0.07600, 0.02840, 0.35458, 0.90834, 0.13383, 0.04823, 0.01566, 0.83777 ) * c;',
    '  c = ( c * ( c + 0.0245786 ) - 0.000090537 ) / ( c * ( 0.983729 * c + 0.4329510 ) + 0.238081 );',
    '  c = mat3( 1.60475, -0.10208, -0.00327, -0.53108, 1.10813, -0.07276, -0.07367, -0.00605, 1.07602 ) * c;',
    '  gl_FragColor = LinearTosRGB( vec4( saturate( c ), gl_FragColor.a ) );',
    '} else gl_FragColor.rgb *= m7Exposure;'].join('\n');
  function m7Patch(shader) {
    const U = this.userData.m7;
    Object.assign(shader.uniforms, U);
    shader.fragmentShader = 'uniform float m7Film, m7Exposure, m7RimPow, m7Gray;\nuniform vec3 m7Rim, m7Moon;\n' + shader.fragmentShader
      .replace('gl_FragColor = vec4( outgoingLight, diffuseColor.a );', SHADER_RIM)
      .replace('#include <encodings_fragment>', SHADER_OUT);
  }
  function makeMaterial(def) {
    const P = def.tex, m = def.mat || {}, L = M7.LOOK;
    if (L.before) { const mat = new T.MeshStandardMaterial({ map: tex(P.color, false), normalMap: P.normal ? tex(P.normal, false) : null, aoMap: P.ao ? tex(P.ao, false) : P.orm ? tex(P.orm, false) : null,
      emissiveMap: P.emit ? tex(P.emit, false) : null, emissive: new T.Color(P.emit ? 0xffffff : 0), emissiveIntensity: 1.3, roughness: 0.82, metalness: 0 });
      mat.skinning = true; mat.vertexTangents = true; mat.userData.glowK = 1.3; mat.userData.m7 = { m7Gray: { value: 0 }, m7Moon: { value: new T.Vector3() }, m7Exposure: { value: 1 } }; return mat; }
    const glow = m.glow != null ? m.glow : 0xffffff;
    const mat = new T.MeshStandardMaterial({
      map: tex(P.color, true), normalMap: P.normal ? tex(P.normal, false) : null,
      aoMap: P.ao ? tex(P.ao, false) : P.orm ? tex(P.orm, false) : null, aoMapIntensity: m.ao != null ? m.ao : 1,
      emissiveMap: P.emit ? tex(P.emit, true) : null, emissive: new T.Color(P.emit ? glow : 0x000000), emissiveIntensity: m.glowK != null ? m.glowK : 1.3,
      roughness: m.roughness != null ? m.roughness : 0.82, metalness: 0,
      envMap: nightSky(), envMapIntensity: m.env != null ? m.env : L.env,
      side: m.double ? T.DoubleSide : T.FrontSide, transparent: false,
    });
    if (P.orm) { mat.roughnessMap = mat.metalnessMap = tex(P.orm, false); mat.roughness = m.roughK != null ? m.roughK : 1; mat.metalness = m.metalK != null ? m.metalK : 1; }
    mat.skinning = true;            // r128: a material must be told it is on a skinned model
    mat.vertexTangents = true;      // r128: and that the model brings its own tangents for the bump picture
    const rim = new T.Color(m.rim != null ? m.rim : L.rim).multiplyScalar(m.rimK != null ? m.rimK : L.rimK);
    mat.userData.m7 = { m7Film: { value: L.film ? 1 : 0 }, m7Exposure: { value: (m.exposure != null ? m.exposure : 1) * L.exposure }, m7Rim: { value: rim },
      m7RimPow: { value: L.rimPow }, m7Gray: { value: 0 }, m7Moon: { value: new T.Vector3() } };
    mat.onBeforeCompile = m7Patch;
    mat.userData.glowK = mat.emissiveIntensity;
    return mat;
  }

  // ---- one kind's shared pieces, made the first time it is asked for ----
  const SHARED = {};
  function shared(key) {
    if (SHARED[key]) return SHARED[key];
    const def = M7.kinds[key], B = M7.bins[key];
    if (!def || !B) throw new Error('no Aethermoor M7 creature called ' + key);
    if (!B.bin) throw new Error('the M7 creatures are not unpacked yet: wait for window.M7.ready');
    const t0 = performance.now(), geo = decode(B.meta, B.bin);
    if (def.mend && def.mend.weights && !M7.LOOK.before) def.mend.weights(geo, B.meta);       // a creature's own mend of its skin (its data says)
    const bb = geo.boundingBox, moves = M7.moves[def.moves];
    if (!moves) throw new Error('no moves called ' + def.moves + ' for ' + key);
    const A = {};
    for (const n in def.acts) { const a = def.acts[n]; A[n] = Object.assign({ hits: [], from: 0, to: 1, hold: false, interrupt: false }, a); }
    const std = (n, o) => { if (!A[n]) A[n] = Object.assign({ hits: [], from: 0, to: 1, hold: false, interrupt: false }, o); };
    const dur = (m, d) => ((moves.DUR || moves.dur || {})[m] || d);
    std('hurt', { move: 'hurt', dur: dur('hurt', 0.9), interrupt: true });
    std('block', { move: 'hurt', dur: 0.7, to: 0.3, brace: true, interrupt: true });
    std('stagger', { move: 'hurt', dur: 1.4, sway: true });
    std('appear', { move: 'idle', dur: 1.2, arrive: true });
    std('die', { move: 'ko', dur: 2.8, hold: true, letGo: true });
    std('retreat', { move: 'walk', dur: 2.2, hold: true, letGo: 'runOff' });
    const ACTIONS = {};
    for (const n in A) ACTIONS[n] = Object.freeze({ dur: A[n].dur, hits: A[n].hits.slice(), cues: [], hold: !!A[n].hold, interrupt: !!A[n].interrupt });
    SHARED[key] = { def, meta: B.meta, geo, moves, A, ACTIONS: Object.freeze(ACTIONS), height: bb.max.y, box: bb, decodeMs: performance.now() - t0 };
    return SHARED[key];
  }

  function buildSkinned(sh, mat) {
    const bones = {}, list = [], meta = sh.meta;
    for (const b of meta.bones) { const bone = new T.Bone(); bone.name = b.name; bones[b.name] = bone; list.push(bone); }
    for (const b of meta.bones) { const bone = bones[b.name], h = new T.Vector3(...b.head);
      if (b.parent) { bone.position.copy(h.clone().sub(new T.Vector3(...meta.bones.find((x) => x.name === b.parent).head))); bones[b.parent].add(bone); } else bone.position.copy(h); }
    const mesh = new T.SkinnedMesh(sh.geo, mat);
    for (const b of meta.bones) if (!b.parent) mesh.add(bones[b.name]);
    mesh.bind(new T.Skeleton(list)); mesh.frustumCulled = false;
    for (const b of list) b.userData.p0 = b.position.clone();
    return { mesh, bones };
  }

  // ---- the small effect: a few dozen soft motes (rise: embers, spores; fall: sap, rot; drift: pollen, thorn dust) ----
  let DOT = null;
  function dotTex() { if (DOT) return DOT; const c = document.createElement('canvas'); c.width = c.height = 32; const x = c.getContext('2d');
    const g = x.createRadialGradient(16, 16, 0, 16, 16, 16); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.4, 'rgba(255,255,255,0.45)'); g.addColorStop(1, 'rgba(255,255,255,0)');
    x.fillStyle = g; x.fillRect(0, 0, 32, 32); return (DOT = new T.CanvasTexture(c)); }
  function makeMotes(o, H) {
    const n = Math.min(40, o.count || 20), pos = new Float32Array(n * 3), col = new Float32Array(n * 3), C = new T.Color(o.color);
    const g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('color', new T.BufferAttribute(col, 3));
    const mat = new T.PointsMaterial({ size: (o.size || 0.06) * Math.max(0.6, H), map: dotTex(), vertexColors: true, transparent: true, depthWrite: false, blending: T.AdditiveBlending });
    const pts = new T.Points(g, mat); pts.frustumCulled = false;
    const P = []; for (let i = 0; i < n; i++) P.push({ age: Math.random() * (o.life || 2), life: (o.life || 2) * (0.6 + 0.8 * Math.random()), p: new T.Vector3(), v: new T.Vector3() });
    const tmp = new T.Vector3();
    function spawn(q, from) { const r = (o.radius || 0.2) * H, a = Math.random() * Math.PI * 2, s = Math.sqrt(Math.random());
      q.p.copy(from).add(tmp.set(Math.cos(a) * r * s, (Math.random() - 0.3) * r * 0.5, Math.sin(a) * r * s));
      const sp = (o.speed || 0.3) * H;
      if (o.kind === 'fall') q.v.set(0, -0.2 * sp, 0); else if (o.kind === 'drift') q.v.set((Math.random() - 0.5) * sp, sp * 0.3 * Math.random(), (Math.random() - 0.5) * sp);
      else q.v.set((Math.random() - 0.5) * sp * 0.4, sp * (0.6 + 0.6 * Math.random()), (Math.random() - 0.5) * sp * 0.4);
      q.age = 0; q.life = (o.life || 2) * (0.6 + 0.8 * Math.random()); }
    return { pts, update(dt, from, rate, fade) {
      for (let i = 0; i < n; i++) { const q = P[i]; q.age += dt * rate;
        if (q.age >= q.life) spawn(q, from);
        if (o.kind === 'fall') q.v.y -= 2.2 * dt; else if (o.kind === 'drift') q.v.multiplyScalar(1 - 0.5 * dt);
        q.p.addScaledVector(q.v, dt);
        if (o.kind === 'fall' && q.p.y < 0.01) { q.p.y = 0.01; q.v.set(0, 0, 0); }
        const u = q.age / q.life, a = Math.sin(Math.min(1, u) * Math.PI) * fade * (o.bright || 1);
        pos[i * 3] = q.p.x; pos[i * 3 + 1] = q.p.y; pos[i * 3 + 2] = q.p.z; col[i * 3] = C.r * a; col[i * 3 + 1] = C.g * a; col[i * 3 + 2] = C.b * a; }
      g.attributes.position.needsUpdate = true; g.attributes.color.needsUpdate = true;
    } };
  }

  // ---- the maker the battle calls (slots.js names it: make: 'makeM7Foe', opts: { kind }) ----
  const clamp01 = (x) => Math.max(0, Math.min(1, x));
  const ease = (x) => { x = clamp01(x); return x * x * (3 - 2 * x); };
  const bumpf = (x) => Math.sin(clamp01(x) * Math.PI);
  const TAU = Math.PI * 2;
  G.makeM7Foe = function (opts) {
    const o = opts || {}, sh = shared(o.kind), def = sh.def, A = sh.A, moves = sh.moves;
    const letGo = o.letGo || def.letGo || 'wither', arrive = o.arrive || def.arrive || 'step';
    const mat = makeMaterial(def), sk = buildSkinned(sh, mat), U = mat.userData.m7;
    const root = new T.Group(), body = new T.Group(); root.add(body); body.add(sk.mesh);
    const S = def.scale || 1; sk.mesh.scale.setScalar(S); sk.mesh.position.y = (def.lift || 0);
    const H = sh.height * S;
    // F is what M7's moves files pose: its bones, its body (moved whole), its height and plan
    const F = { group: root, body, mesh: sk.mesh, bones: sk.bones, height: (sh.meta.height || H), plan: sh.meta.plan || 'quad', t: 0 };
    const BEFORE = M7.LOOK.before, helpers = sh.meta.helpers || [], limits = (!BEFORE && def.mend && def.mend.limits) || null;
    const moon = new T.Vector3(...M7.LOOK.moon).normalize();
    sk.mesh.onBeforeRender = (r, s, cam) => { U.m7Moon.value.copy(moon).transformDirection(cam.matrixWorldInverse); };
    const motes = def.fx && !BEFORE ? makeMotes(def.fx, H) : null; if (motes) root.add(motes.pts);
    const moteAt = new T.Vector3();

    function reset() { for (const b of Object.values(F.bones)) { b.rotation.set(0, 0, 0); b.position.copy(b.userData.p0); b.scale.set(1, 1, 1); } F.body.position.set(0, 0, 0); F.body.rotation.set(0, 0, 0); }
    function pose(move, u, t, step) {
      reset(); moves.pose(F, move, u, t, step || 0);
      for (const [h, d, k] of helpers) { const hb = F.bones[h], db = F.bones[d]; if (!hb || !db) continue; const r = db.rotation; hb.rotation.set(r.x * k, r.y * k, r.z * k); r.set(r.x * (1 - k), r.y * (1 - k), r.z * (1 - k)); }
      if (limits) for (const n in limits) { const b = F.bones[n], k = limits[n]; if (b) { b.rotation.x *= k; b.rotation.y *= k; b.rotation.z *= k; } }
      if (!BEFORE && def.mend && def.mend.pose) def.mend.pose(F, move, u, t);       // a creature's own mend of a pose (its data says)
    }

    let actv = null, gone = false, fadeE = 1, guardOn = false, idleW = 1, liftV = 0;
    const state = {};
    function play(name, force) { const a = A[name]; if (!a) return false;
      if (actv && !force && (actv.name === 'die' || (!a.interrupt && !(actv.a.hold && actv.t >= actv.a.dur - 1e-6)))) return false;
      actv = { name, a, t: 0 }; gone = false; return true; }

    function animate(phase, wb, time, dt) {
      time = time || 0; dt = dt || 0; F.t = time;
      let fade = gone ? 0 : 1, gray = 0, glowK = 1, rate = 1;
      const idleOn = !actv && !(wb > 0.5);
      idleW += ((idleOn ? 1 : 0) - idleW) * Math.min(1, dt * 5);
      if (actv) {
        const a = actv.a; actv.t = Math.min(a.dur, actv.t + dt); const u = actv.t / a.dur, mu = a.from + (a.to - a.from) * u;
        if (a.arrive) {                                   // it arrives in character (its data's `arrive`)
          pose(arrive === 'walk' ? 'walk' : 'idle', 0, time, u * 6);
          if (arrive === 'rise') { F.body.position.y -= H * 0.6 * (1 - ease(u * 1.4)); fade = clamp01(u * 2.5); }
          else if (arrive === 'walk') { F.body.position.z -= 1.2 * (1 - ease(u)); fade = clamp01(u * 2); }
          else if (arrive === 'drop') { F.body.position.y += H * 0.8 * (1 - ease(u * 1.3)); fade = clamp01(u * 3); }
          else if (arrive === 'flare') { fade = clamp01(u * 2); glowK = 1 + 2.5 * bumpf(u); rate = 3; }
          else fade = clamp01(u * 1.8);
        } else if (a.letGo) {                             // it is let go, not killed (its data's `letGo`)
          const how = a.letGo === true ? letGo : a.letGo;
          if (how === 'runOff') { pose('walk', 0, time, time * 9); F.body.rotation.y = Math.PI * ease(u * 3); F.body.position.z = -2.6 * ease((u - 0.2) / 0.8) ; fade = 1 - ease((u - 0.45) / 0.55); }
          else if (how === 'root') { pose('idle', 0, time, 0); F.body.position.y = -H * 1.05 * ease((u - 0.15) / 0.85); F.body.rotation.z = 0.04 * Math.sin(u * 30) * (1 - u); gray = 0.6 * ease(u * 2); fade = 1 - ease((u - 0.7) / 0.3); rate = 2; }
          else if (how === 'gutter') { pose('hurt', Math.min(1, u * 2) * 0.6, time, 0); const fl = 0.5 + 0.5 * Math.sin(u * 70) * Math.sin(u * 23); glowK = (1 - u) * (0.3 + 0.7 * fl); F.body.position.y = -0.15 * H * ease(u); gray = 0.5 * u; fade = 1 - ease((u - 0.55) / 0.45); rate = 0.3; }
          else { pose(a.move, clamp01(u * 1.25), time, 0); gray = 0.7 * ease(u * 1.6); glowK = 1 - ease(u * 1.5); fade = 1 - ease((u - 0.62) / 0.38); F.body.position.y -= 0.06 * H * ease((u - 0.5) / 0.5); }
        } else {
          pose(a.move, mu, time, 0);
          if (a.brace) { const k = bumpf(u) * 0.8 + (guardOn ? 0.2 : 0); F.body.position.y -= 0.04 * H * k; F.body.rotation.x -= 0.1 * k; }
          if (a.sway) { const k = bumpf(u); F.body.rotation.z += 0.12 * Math.sin(u * 14) * k; F.body.position.x += 0.05 * H * Math.sin(u * 9) * k; }
          if (a.glow) glowK = 1 + a.glow * bumpf(u);
          if (a.fx) rate = a.fx;
        }
        if (actv.t >= a.dur - 1e-6) { if (a.hold) { if (a.letGo) gone = true; } else actv = null; }
      } else if (wb > 0.5) pose('walk', 0, time, phase * (def.stride || 1));
      else pose('idle', 0, time, 0);
      // its own standing loop, blended in when it stands (its data's `idle`: a pure pose of the loop's sine and cosine)
      if (def.idle && !BEFORE && idleW > 0.01) { const I = def.idle, w = (time / I.period) * TAU; I.pose(F, Math.sin(w), Math.cos(w), idleW, w); if (I.glow) glowK *= 1 + I.glow * idleW * Math.sin(w * (I.glowBeats || 1)); }
      if (guardOn && !actv) { F.body.position.y -= 0.03 * H; F.body.rotation.x -= 0.06; }
      liftV = F.body.position.y;
      const f = clamp01(fade * fadeE);
      mat.opacity = f; const tr = f < 0.999; if (mat.transparent !== tr) { mat.transparent = tr; mat.depthWrite = !tr || f > 0.5; }
      sk.mesh.visible = f > 0.01; U.m7Gray.value = gray; mat.emissiveIntensity = mat.userData.glowK * glowK;
      if (motes) { const bn = F.bones[def.fx.at] || F.bones.head; if (bn) { root.updateWorldMatrix(true, true); bn.getWorldPosition(moteAt); root.worldToLocal(moteAt); } else moteAt.set(0, H * 0.7, 0);
        if (def.fx.dy) moteAt.y += def.fx.dy * H; motes.update(dt, moteAt, rate, f * (gone ? 0 : 1)); motes.pts.visible = f > 0.01; }
    }

    const ANC = def.anchors || {};
    function anchor(name, out) {
      out = out || new T.Vector3(); root.updateWorldMatrix(true, true);
      const a = ANC[name] || ANC.chest || ['chest', 0], b = F.bones[a[0]];
      if (b) { b.getWorldPosition(out); out.y += (a[1] || 0) * H; return out; }
      return root.localToWorld(out.set(0, H * (name === 'head' || name === 'top' ? 0.9 : 0.55), 0));
    }
    animate(0, 0, 0, 0);
    let tri = sh.meta.triangles || sh.geo.index.count / 3;
    return { root, animate, play, anchor, ACTIONS: sh.ACTIONS, kind: o.kind, F,
      guard(on) { guardOn = !!on; }, reset() { actv = null; gone = false; guardOn = false; },
      get busy() { return !!actv && !(actv.a.hold && actv.t >= actv.a.dur - 1e-6); }, get action() { return actv ? actv.name : ''; },
      get progress() { return actv ? Math.min(1, actv.t / actv.a.dur) : -1; }, get dash() { return 0; }, get lift() { return Math.max(0, liftV); }, get gone() { return gone; },
      get state() { return state; }, set state(v) { if (v) Object.assign(state, v); }, setFade(f) { fadeE = clamp01(+f); },
      pose, height: H, material: mat,
      stats: { triangles: Math.round(tri), drawCalls: 1 + (motes ? 1 : 0), textures: Object.keys(def.tex).filter((k) => def.tex[k]).length, bones: sh.meta.bones.length } };
  };
})(window);
