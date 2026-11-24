// peak-lab.js: the peak-creatures job's own small page (game/pages/peak-creatures-lab.html), made in the shape of the
// creatures job's page (creatures-lab.js). The Wickstoat and the Hoarmantle, each to Look at (standing, turned, every
// motion one by one) and to fight where it would be met (Play: you choose every move; Watch: the battle plays itself).
// Words: lab-words.js. Not in the game itself.
// window.__plab is for the checks: __plab.ready, __plab.view(key, { act, u, yaw, light, ortho, witch, lit }),
// __plab.start(key, o), __plab.motions(key).
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id), W = window.COVEN_PEAK_LAB_WORDS, M7 = window.M7, T = window.THREE;
  const KEYS = ['wickstoat', 'hoarmantle'].filter((k) => M7.kinds[k] && M7.bins[k]);
  const SL = window.COVEN_SLOTS.zones, Z = window.COVEN_ENCOUNTERS, DRAW = window.CovenDraw, FW = window.COVEN_FIGHT_WORDS;
  const SLOT = { wickstoat: ['zone-4', 'A'], hoarmantle: ['zone-4', 'B'] };
  const slotOf = (k) => { const [z, s] = SLOT[k]; return { zone: z, k: s, s: SL[z][s] }; };
  const idOf = (k) => Object.keys(slotOf(k).s.model)[0];

  // ---- the list ----
  let cur = KEYS[0], busy = false;
  $('title').textContent = W.title; $('lead').textContent = W.lead;
  $('look').textContent = W.look; $('play').textContent = W.play; $('watch').textContent = W.watch;
  const list = $('list');
  for (const k of KEYS) { const b = document.createElement('button'); b.dataset.k = k; b.innerHTML = '<b></b><small></small>'; b.querySelector('b').textContent = W.names[k];
    const so = slotOf(k); b.querySelector('small').textContent = W.where.replace('{zone}', W.zones[so.zone]).replace('{slot}', so.k);
    b.addEventListener('click', () => { cur = k; show(); }); list.appendChild(b); }
  function show() { for (const b of list.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.k === cur)); }
  show();

  // ---- a fight, started the way the land starts a slot's fight (slot B is fought here even while it is off) ----
  async function start(k, o) {
    o = o || {}; if (busy) return null; if (k) cur = k; await M7.ready;
    const so = slotOf(cur), D = Z[so.zone], s = so.s, w = D.where.find((x) => s.met.indexOf(x.id) >= 0) || D.where[0];
    const L = o.level || Math.max(D.levels[0] + 1, s.from || 1);
    busy = true; $('lab').style.display = 'none'; let r = null;
    try { r = await window.CovenBattle.start({ partyLevel: L, flags: { envoi: L > 10 }, herbs: { moonpetal: 3, lavender: 3, mugwort: 3, emberLily: 3, nightrose: 3 }, auto: o.auto || undefined,
      arena: D.arenas[0].id, foes: s.pack.slice(), foeLevel: [Math.max(D.levels[0], L - 1), Math.min(D.levels[1], L + 1)], reward: D.reward * (s.worth || 1) * DRAW.meanBase(w, D.band) / DRAW.base(s.pack, D.band), words: FW.slots }); }
    catch (e) { console.error(e); $('last').textContent = W.noStart; window.__labErr = String(e && e.stack || e); }
    $('lab').style.display = ''; busy = false;
    if (r) $('last').textContent = W.names[cur] + ': ' + W.results[r.result];
    return r;
  }
  $('play').addEventListener('click', () => start(null, {}));
  $('watch').addEventListener('click', () => start(null, { auto: 'sensible' }));

  // ---- Look: the creature alone under the battle's own three lights, beside a witch for its size ----
  let V = null;
  function radial(inner, mid) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner); g.addColorStop(0.45, mid); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); }
  function viewer() {
    if (V) return V;
    const cv = $('view'), r = new T.WebGLRenderer({ canvas: cv, antialias: true }); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setClearColor(0x120e1c, 1);
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, 0.05, 80), ortho = new T.OrthographicCamera(-1, 1, 1, -1, 0.05, 80);
    // the battle's lights (game/battle/screen.js): sky and ground, the moon from behind, a warm fill from the front
    const hemi = new T.HemisphereLight(0x756aa8, 0x33262f, 1.1), moon = new T.DirectionalLight(0xb8c0ff, 0.62), fill = new T.DirectionalLight(0xffdcc0, 0.42);
    moon.position.set(-5, 9, -12); fill.position.set(2, 5, 10); scene.add(hemi, moon, fill);
    const ground = new T.Mesh(new T.CircleGeometry(9, 48), new T.MeshStandardMaterial({ color: 0x2b2433, roughness: 1 })); ground.rotation.x = -Math.PI / 2; scene.add(ground);
    const shadow = new T.Mesh(new T.CircleGeometry(1, 36), new T.MeshBasicMaterial({ map: radial('rgba(10,4,16,0.62)', 'rgba(10,4,16,0.3)'), transparent: true, depthWrite: false }));
    shadow.rotation.x = -Math.PI / 2; shadow.position.y = 0.01; scene.add(shadow);
    let witch = null; try { witch = window.makeMoonIo({ weight: 'lightest' }); scene.add(witch.root); } catch (e) { witch = null; }
    V = { r, scene, cam, ortho, cv, hemi, moon, fill, ground, shadow, witch, m: null, key: null, yaw: 0, clock: 0, act: 'stand', on: false, light: 'battle' };
    return V;
  }
  const lookOf = (k) => slotOf(k).s.model[idOf(k)].look || {};
  function choose(k) {
    const v = viewer(); if (v.key === k && v.m) return v;
    if (v.m) v.scene.remove(v.m.root);
    v.m = window.makePeakFoe({ kind: k }); v.key = k; v.scene.add(v.m.root);
    const sh = lookOf(k).shadow || 0.6; v.shadow.scale.set(sh, sh * 0.8, 1);
    return v;
  }
  function frame(v, ortho) {
    const w = v.cv.clientWidth || window.innerWidth, h = v.cv.clientHeight || window.innerHeight;
    if (v.cv.width !== Math.round(w * v.r.getPixelRatio())) v.r.setSize(w, h, false);
    const box = new T.Box3().setFromObject(v.m.F.mesh), H = Math.max(box.max.y, 1.7);
    if (ortho) {      // a flat view, as a model sheet draws it: the creature alone, filling the picture
      const c = box.getCenter(new T.Vector3()), sz = box.getSize(new T.Vector3()), half = Math.max(sz.y * 0.62, Math.max(sz.x, sz.z) * 0.62 * h / w);
      v.ortho.left = -half * w / h; v.ortho.right = half * w / h; v.ortho.top = half; v.ortho.bottom = -half; v.ortho.updateProjectionMatrix();
      v.ortho.position.set(c.x, c.y, 30); v.ortho.lookAt(c.x, c.y, 0); return v.ortho;
    }
    v.cam.aspect = w / h; v.cam.updateProjectionMatrix();
    const wide = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
    const wx = v.witch ? -(wide * 0.5 + 0.7) : 0; if (v.witch) { v.witch.root.position.set(wx, 0, 0.2); v.witch.root.rotation.y = 0.35; }
    const needW = wide + (v.witch ? 1.6 : 0.4), needH = H * 1.25, vf = v.cam.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * v.cam.aspect);
    const d = Math.max(needH / (2 * Math.tan(vf / 2)), needW / (2 * Math.tan(hf / 2))) + wide * 0.4;
    const cx = v.witch ? wx * 0.5 : 0; v.cam.position.set(cx, H * 0.55 + d * 0.12, d); v.cam.lookAt(cx, H * 0.45, 0);
    return v.cam;
  }
  function setLight(v, how) {   // 'battle' (the battle's own), or 'plain' (even light on the sheet's grey, to set beside the sheet)
    v.light = how; const plain = how === 'plain';
    v.r.setClearColor(plain ? 0xa29a93 : 0x120e1c, 1); v.ground.visible = !plain; v.shadow.visible = !plain;
    if (plain) { v.hemi.color.set(0xffffff); v.hemi.groundColor.set(0x8a8580); v.hemi.intensity = 1.0; v.moon.color.set(0xffffff); v.moon.intensity = 0.35; v.moon.position.set(-3, 6, 8);
      v.fill.color.set(0xffffff); v.fill.intensity = 0.55; v.fill.position.set(3, 4, 10); }
    else { v.hemi.color.set(0x756aa8); v.hemi.groundColor.set(0x33262f); v.hemi.intensity = 1.1; v.moon.color.set(0xb8c0ff); v.moon.intensity = 0.62; v.moon.position.set(-5, 9, -12);
      v.fill.color.set(0xffdcc0); v.fill.intensity = 0.42; v.fill.position.set(2, 5, 10); }
  }
  // one still: the creature at a moment of one motion, turned by yaw, drawn once
  function still(k, o) {
    o = o || {}; const v = choose(k); v.m.root.rotation.y = o.yaw || 0; v.m.reset(); setLight(v, o.light || 'battle');
    if (v.witch) v.witch.root.visible = o.witch !== false && !o.ortho;
    if (o.lit != null && 'lit' in v.m) v.m.lit = o.lit;
    const act = o.act || 'stand', dt = 1 / 30; let t = 2;
    if (act === 'stand' || act === 'walk') { const n = 60 + Math.round((o.at || 0) * 30); for (let i = 0; i < n; i++, t += dt) v.m.animate(t * 4.2, act === 'walk' ? 1 : 0, t, dt); }
    else { for (let i = 0; i < 30; i++, t += dt) v.m.animate(0, 0, t, dt); v.m.play(act, true); const D = v.m.ACTIONS[act].dur * (o.u == null ? 0.5 : o.u);
      for (let s = 0; s < D - 1e-6; s += dt, t += dt) v.m.animate(0, 0, t, Math.min(dt, D - s)); }
    if (v.witch && v.witch.animate) v.witch.animate(0, 0, t, 0);
    const cam = frame(v, !!o.ortho); v.r.render(v.scene, cam);
    const box = new T.Box3().setFromObject(v.m.F.mesh);
    return { act, height: +v.m.height.toFixed(2), triangles: v.r.info.render.triangles, size: box.getSize(new T.Vector3()).toArray().map((x) => +x.toFixed(2)), lit: v.m.lit };
  }
  // the Look screen: it plays live; one button for each motion, Turn, Back (and the Wickstoat's sparks)
  function motions(k) { const sh = M7.kinds[k], mv = M7.moves[sh.moves], labels = {}; for (const [a, l] of (mv.MOVES || mv.list || [])) labels[a] = l;
    const own = Object.keys(sh.acts).filter((a) => a !== 'charge').map((a) => [a, labels[sh.acts[a].move] || a]);
    const ch = sh.acts.charge ? [['charge', W.motions.charge]] : [];
    return [['stand', W.motions.stand], ['walk', W.motions.walk], ['appear', W.motions.appear]].concat(own, ch, [['hurt', W.motions.hurt], ['block', W.motions.block], ['stagger', W.motions.stagger], ['die', W.motions.die]]); }
  let last = 0, frames = 0, fpsT = 0;
  function loop(now) {
    const v = V; if (!v || !v.on) return; const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; v.clock += dt;
    frames++; fpsT += dt; if (fpsT >= 1) { $('fps').textContent = Math.round(frames / fpsT) + ' fps'; frames = 0; fpsT = 0; }
    if (v.act !== 'stand' && v.act !== 'walk' && !v.m.busy && v.m.action === '') v.act = 'stand';
    if (v.m.action === 'die' && v.m.gone) { v.hold = (v.hold || 0) + dt; if (v.hold > 1.2) { v.hold = 0; v.m.reset(); v.act = 'stand'; if ('lit' in v.m) v.m.lit = 3; } }
    v.m.root.rotation.y = v.yaw; v.m.animate(v.clock * 4.2, v.act === 'walk' ? 1 : 0, v.clock, dt);
    if (v.witch && v.witch.animate) v.witch.animate(0, 0, v.clock, dt);
    v.r.render(v.scene, frame(v, false)); requestAnimationFrame(loop);
  }
  async function open(k) {
    $('lab').style.display = 'none'; $('viewer').hidden = false; $('vname').textContent = W.names[k] + ' · ' + W.size.replace('{m}', '…');
    await M7.ready; const v = choose(k); setLight(v, 'battle'); if (v.witch) v.witch.root.visible = true; v.on = true; v.act = 'stand'; v.m.reset();
    $('vname').textContent = W.names[k] + ' · ' + W.size.replace('{m}', v.m.height.toFixed(2));
    const row = $('moves'); row.innerHTML = '';
    for (const [a, label] of motions(k)) { const b = document.createElement('button'); b.textContent = label; b.addEventListener('click', () => { v.act = a; if (a !== 'stand' && a !== 'walk') v.m.play(a, true); else v.m.reset(); }); row.appendChild(b); }
    if ('lit' in v.m) { const b = document.createElement('button'); const say = () => { b.textContent = W.sparks.replace('{n}', v.m.lit); }; say();
      b.addEventListener('click', () => { v.m.lit = (v.m.lit + 1) % 10; say(); }); row.appendChild(b); }
    last = 0; requestAnimationFrame(loop);
  }
  $('look').addEventListener('click', () => open(cur));
  $('vclose').textContent = W.close; $('vturn').textContent = W.turn;
  $('vclose').addEventListener('click', () => { if (V) V.on = false; $('viewer').hidden = true; $('lab').style.display = ''; });
  $('vturn').addEventListener('click', () => { if (V) V.yaw += Math.PI / 4; });

  const ready = M7.ready.then(() => { $('wait').hidden = true; return true; });
  $('wait').textContent = W.waiting;
  window.__plab = { keys: KEYS, ready, start: (k, o) => start(k, o), open, motions: (k) => motions(k).map((x) => x[0]),
    async view(k, o) { $('lab').style.display = 'none'; $('viewer').hidden = false; $('vbar').hidden = !!(o && o.bare); $('vtop').hidden = $('fps').hidden = !!(o && o.bare); choose(k); await M7.pictures(); await new Promise((r) => setTimeout(r, 30)); return still(k, o); },
    get busy() { return busy; }, slotOf: (k) => { const s = slotOf(k); return { zone: s.zone, slot: s.k }; } };
})();
