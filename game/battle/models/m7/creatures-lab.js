// creatures-lab.js: the creatures job's own small page (game/pages/creatures-lab.html). The six creatures from
// Aethermoor M7, each to Look at (standing, turned, every motion one by one) and to fight where it would be met
// (Play: you choose every move; Watch: the battle plays itself). Words: lab-words.js. Not in the game itself.
// window.__clab is for the checks: __clab.ready, __clab.keys, __clab.view(key, { act, u, yaw, light }), __clab.start(key, o).
(function () {
  'use strict';
  const $ = (id) => document.getElementById(id), W = window.COVEN_CREATURES_LAB_WORDS, M7 = window.M7, P = window.COVEN_M7_PROPOSAL || {};
  const ORDER = ['glowcap', 'forge-spark', 'sapwight', 'rotwarden', 'rotstag', 'thornhound'];
  const KEYS = ORDER.filter((k) => M7.kinds[k] && M7.bins[k]);
  const SL = window.COVEN_SLOTS.zones, Z = window.COVEN_ENCOUNTERS, DRAW = window.CovenDraw, FW = window.COVEN_FIGHT_WORDS;

  // ---- each creature into its proposed slot, for this page alone, unless the slots already carry it ----
  for (const k of KEYS) { const p = P[k]; if (!p) continue; const s = SL[p.zone][p.slot], f = s.foes[p.foe];
    if (s.model[p.foe].make === 'makeM7Foe') continue;
    f.name = W.names[k]; for (const mv in p.acts) if (f.moves[mv]) { f.moves[mv].act = p.acts[mv]; f.moves[mv].name = p.names[mv]; if (f.moves[mv].charge) f.moves[mv].chargeName = p.names.gather || p.names.crouch || p.names.lift || f.moves[mv].chargeName; }
    s.model[p.foe] = { make: 'makeM7Foe', opts: { kind: k }, look: p.look };
    window.COVEN_FOE_LOOKS[p.foe] = Object.assign({ standIn: false }, s.model[p.foe]); }
  const slotOf = (k) => { const p = P[k]; if (p) return { zone: p.zone, k: p.slot, s: SL[p.zone][p.slot] };
    for (const z in SL) for (const s of ['A', 'B']) for (const id in SL[z][s].model) { const m = SL[z][s].model[id]; if (m.make === 'makeM7Foe' && m.opts && m.opts.kind === k) return { zone: z, k: s, s: SL[z][s] }; } return null; };

  // ---- the list ----
  let cur = KEYS[0], busy = false;
  $('title').textContent = W.title; $('lead').textContent = W.lead;
  $('look').textContent = W.look; $('play').textContent = W.play; $('watch').textContent = W.watch;
  const list = $('list');
  for (const k of KEYS) { const b = document.createElement('button'); b.dataset.k = k; b.innerHTML = '<b></b><small></small>'; b.querySelector('b').textContent = W.names[k];
    const so = slotOf(k); b.querySelector('small').textContent = so ? W.where.replace('{zone}', W.zones[so.zone]).replace('{slot}', so.k) : '';
    b.addEventListener('click', () => { cur = k; show(); }); list.appendChild(b); }
  function show() { for (const b of list.querySelectorAll('button')) b.setAttribute('aria-pressed', String(b.dataset.k === cur)); }
  show();

  // ---- a fight, started the way the land starts a slot's fight ----
  async function start(k, o) {
    o = o || {}; if (busy) return null; if (k) cur = k; await M7.ready;
    const so = slotOf(cur); if (!so) return null; const D = Z[so.zone], s = so.s, w = D.where.find((x) => s.met.indexOf(x.id) >= 0) || D.where[0];
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
  const T = window.THREE; let V = null;
  function radial(inner, mid) { const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, inner); g.addColorStop(0.45, mid); g.addColorStop(1, 'rgba(0,0,0,0)'); x.fillStyle = g; x.fillRect(0, 0, 128, 128); return new T.CanvasTexture(c); }
  function viewer() {
    if (V) return V;
    const cv = $('view'), r = new T.WebGLRenderer({ canvas: cv, antialias: true }); r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setClearColor(0x120e1c, 1);
    const scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, 0.05, 80);
    // the battle's lights (game/battle/screen.js): sky and ground, the moon from behind, a warm fill from the front
    const hemi = new T.HemisphereLight(0x756aa8, 0x33262f, 1.1), moon = new T.DirectionalLight(0xb8c0ff, 0.62), fill = new T.DirectionalLight(0xffdcc0, 0.42);
    moon.position.set(-5, 9, -12); fill.position.set(2, 5, 10); scene.add(hemi, moon, fill);
    const ground = new T.Mesh(new T.CircleGeometry(9, 48), new T.MeshStandardMaterial({ color: 0x2b2433, roughness: 1 })); ground.rotation.x = -Math.PI / 2; scene.add(ground);
    const disc = (tex, add) => { const m = new T.Mesh(new T.CircleGeometry(1, 36), new T.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: add ? T.AdditiveBlending : T.NormalBlending })); m.rotation.x = -Math.PI / 2; m.position.y = 0.004; scene.add(m); return m; };
    const shadow = disc(radial('rgba(10,4,16,0.62)', 'rgba(10,4,16,0.3)'), false), glow = disc(radial('rgba(255,255,255,1)', 'rgba(255,255,255,0.28)'), true);
    let witch = null; try { witch = window.makeMoonIo({ weight: 'lightest' }); scene.add(witch.root); } catch (e) { witch = null; }
    V = { r, scene, cam, cv, hemi, moon, fill, ground, shadow, glow, witch, m: null, key: null, yaw: 0, clock: 0, act: 'stand', on: false, light: 'battle', fps: 0 };
    return V;
  }
  function lookOf(k) { const so = slotOf(k); return (so && so.s.model[(P[k] || {}).foe]) ? so.s.model[P[k].foe].look : ((P[k] || {}).look || {}); }
  function choose(k) {
    const v = viewer(); if (v.key === k && v.m) return v;
    if (v.m) { v.scene.remove(v.m.root); }
    v.m = window.makeM7Foe({ kind: k }); v.key = k; v.scene.add(v.m.root);
    const L = lookOf(k), sh = (L.shadow || 0.6); v.shadow.scale.set(sh, sh * 0.8, 1);
    if (L.glow) { v.glow.visible = true; v.glow.scale.setScalar(L.glow[0]); v.glow.material.color.set(L.glow[1]); } else v.glow.visible = false;
    return v;
  }
  function frame(v) {
    const w = v.cv.clientWidth || window.innerWidth, h = v.cv.clientHeight || window.innerHeight;
    if (v.cv.width !== Math.round(w * v.r.getPixelRatio())) v.r.setSize(w, h, false);
    v.cam.aspect = w / h; v.cam.updateProjectionMatrix();
    const H = Math.max(v.m.height, 1.7), box = new T.Box3().setFromObject(v.m.F.mesh), wide = Math.max(box.max.x - box.min.x, box.max.z - box.min.z);
    const wx = v.witch ? -(wide * 0.5 + 0.7) : 0; if (v.witch) { v.witch.root.position.set(wx, 0, 0.2); v.witch.root.rotation.y = 0.35; }
    const needW = wide + (v.witch ? 1.6 : 0.4), needH = H * 1.25, vf = v.cam.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * v.cam.aspect);
    const d = Math.max(needH / (2 * Math.tan(vf / 2)), needW / (2 * Math.tan(hf / 2))) + wide * 0.4;
    const cx = v.witch ? wx * 0.5 : 0; v.cam.position.set(cx, H * 0.55 + d * 0.12, d); v.cam.lookAt(cx, H * 0.45, 0);
  }
  function setLight(v, how) {   // 'battle' (the battle's own), or 'm7' (M7's beasts page, for comparing: its lights in this library's numbers)
    v.light = how; const m7 = how === 'm7', U = v.m && v.m.material.userData.m7;
    v.r.setClearColor(m7 ? 0x6e6a66 : 0x120e1c, 1); v.ground.material.color.set(m7 ? 0x3a3024 : 0x2b2433);
    if (m7) { v.hemi.color.set(0xd8e0ff).convertSRGBToLinear(); v.hemi.groundColor.set(0x4a3a2a).convertSRGBToLinear(); v.hemi.intensity = 1.3 / Math.PI;
      v.moon.color.set(0x9fc0ff).convertSRGBToLinear(); v.moon.intensity = 1.6 / Math.PI; v.moon.position.set(-5, 3, -5);
      v.fill.color.set(0xffe2bc).convertSRGBToLinear(); v.fill.intensity = 2.9 / Math.PI; v.fill.position.set(4, 7, 5); if (U) U.m7Exposure.value = 1.45; }
    else { v.hemi.color.set(0x756aa8); v.hemi.groundColor.set(0x33262f); v.hemi.intensity = 1.1; v.moon.color.set(0xb8c0ff); v.moon.intensity = 0.62; v.moon.position.set(-5, 9, -12);
      v.fill.color.set(0xffdcc0); v.fill.intensity = 0.42; v.fill.position.set(2, 5, 10); if (U) U.m7Exposure.value = (M7.kinds[v.key].mat || {}).exposure * M7.LOOK.exposure || 1; }
  }
  // one still: the creature at a moment of one motion, turned by yaw, drawn once
  function still(k, o) {
    o = o || {}; const v = choose(k); v.m.root.rotation.y = o.yaw || 0; v.m.reset(); if (o.light) setLight(v, o.light);
    v.witch && (v.witch.root.visible = o.witch !== false);
    const act = o.act || 'stand', dt = 1 / 30; let t = 2;
    if (act === 'stand' || act === 'walk') { for (let i = 0; i < 60; i++, t += dt) v.m.animate(t * 4.2, act === 'walk' ? 1 : 0, t, dt); if (o.at) for (let i = 0, n = Math.round(o.at * 30); i < n; i++, t += dt) v.m.animate(t * 4.2, act === 'walk' ? 1 : 0, t, dt); }
    else { for (let i = 0; i < 30; i++, t += dt) v.m.animate(0, 0, t, dt); v.m.play(act, true); const D = v.m.ACTIONS[act].dur * (o.u == null ? 0.5 : o.u);
      for (let s = 0; s < D - 1e-6; s += dt, t += dt) v.m.animate(0, 0, t, Math.min(dt, D - s)); }
    if (v.witch && v.witch.animate) v.witch.animate(0, 0, t, 0);
    frame(v); v.r.render(v.scene, v.cam);
    return { act, height: +v.m.height.toFixed(2), triangles: v.r.info.render.triangles, box: new T.Box3().setFromObject(v.m.F.mesh) };
  }
  // the Look screen: it plays live; one button for each motion, Turn, Back
  function motions(k) { const sh = M7.kinds[k], mv = M7.moves[sh.moves], labels = {}; for (const [a, l] of (mv.MOVES || mv.list || [])) labels[a] = l;
    const own = Object.keys(sh.acts).filter((a) => a !== 'charge').map((a) => [a, labels[sh.acts[a].move] || a]);
    return [['stand', W.motions.stand], ['walk', W.motions.walk], ['appear', W.motions.appear]].concat(own, [['charge', W.motions.charge], ['hurt', W.motions.hurt], ['block', W.motions.block], ['stagger', W.motions.stagger], ['die', W.motions.die]]).filter(([a]) => a === 'stand' || a === 'walk' || v0(k).m.ACTIONS[a]); }
  const v0 = (k) => choose(k);
  let last = 0, frames = 0, fpsT = 0;
  function loop(now) {
    const v = V; if (!v || !v.on) return; const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now; v.clock += dt;
    frames++; fpsT += dt; if (fpsT >= 1) { $('fps').textContent = Math.round(frames / fpsT) + ' fps'; frames = 0; fpsT = 0; }
    if (v.act !== 'stand' && v.act !== 'walk' && !v.m.busy && v.m.action === '') v.act = 'stand';
    if (v.m.action === 'die' && v.m.gone) { v.hold = (v.hold || 0) + dt; if (v.hold > 1.2) { v.hold = 0; v.m.reset(); v.act = 'stand'; } }
    v.m.root.rotation.y = v.yaw; v.m.animate(v.clock * 4.2, v.act === 'walk' ? 1 : 0, v.clock, dt);
    if (v.witch && v.witch.animate) v.witch.animate(0, 0, v.clock, dt);
    frame(v); v.r.render(v.scene, v.cam); requestAnimationFrame(loop);
  }
  async function open(k) {
    $('lab').style.display = 'none'; $('viewer').hidden = false; $('vname').textContent = W.names[k] + ' · ' + W.size.replace('{m}', '…');
    await M7.ready; const v = choose(k); setLight(v, 'battle'); v.on = true; v.act = 'stand'; v.m.reset();
    $('vname').textContent = W.names[k] + ' · ' + W.size.replace('{m}', v.m.height.toFixed(2));
    const row = $('moves'); row.innerHTML = '';
    for (const [a, label] of motions(k)) { const b = document.createElement('button'); b.textContent = label; b.addEventListener('click', () => { v.act = a; if (a !== 'stand' && a !== 'walk') v.m.play(a, true); else v.m.reset(); }); row.appendChild(b); }
    last = 0; requestAnimationFrame(loop);
  }
  $('look').addEventListener('click', () => open(cur));
  $('vclose').textContent = W.close; $('vturn').textContent = W.turn;
  $('vclose').addEventListener('click', () => { if (V) V.on = false; $('viewer').hidden = true; $('lab').style.display = ''; });
  $('vturn').addEventListener('click', () => { if (V) V.yaw += Math.PI / 4; });

  // all of them standing in a row beside a witch, at their true sizes, under the battle's lights (for Chris's sheet)
  async function row(keys) {
    const v = viewer(); await M7.ready; if (v.m) { v.scene.remove(v.m.root); v.m = null; v.key = null; }
    setLight(v, 'battle'); v.shadow.visible = v.glow.visible = false;
    const ms = keys.map((k) => window.makeM7Foe({ kind: k })); await M7.pictures(); await new Promise((r) => setTimeout(r, 30));
    let x = 0; const dt = 1 / 30;
    if (v.witch) { v.witch.root.visible = true; v.witch.root.position.set(0, 0, 0); v.witch.root.rotation.y = 0.2; x = 0.9; }
    let top = 1.7;
    for (const m of ms) { v.scene.add(m.root); m.root.rotation.y = 0.6; for (let i = 0; i < 40; i++) m.animate(0, 0, 2 + i * dt, dt);
      const b = new T.Box3().setFromObject(m.F.mesh), w = Math.max(b.max.x - b.min.x, (b.max.z - b.min.z) * 0.8); x += w / 2 + 0.25; m.root.position.set(x, 0, 0); x += w / 2 + 0.25; top = Math.max(top, m.height); }
    const w = v.cv.clientWidth || window.innerWidth, h = v.cv.clientHeight || window.innerHeight; v.r.setSize(w, h, false); v.cam.aspect = w / h; v.cam.updateProjectionMatrix();
    const vf = v.cam.fov * Math.PI / 180, hf = 2 * Math.atan(Math.tan(vf / 2) * v.cam.aspect), cx = x / 2 - 0.2;
    const d = Math.max(top * 1.3 / (2 * Math.tan(vf / 2)), (x + 1.2) / (2 * Math.tan(hf / 2)));
    v.cam.position.set(cx, top * 0.5 + d * 0.1, d); v.cam.lookAt(cx, top * 0.42, 0); v.r.render(v.scene, v.cam);
    for (const m of ms) v.scene.remove(m.root);
    return ms.map((m) => +m.height.toFixed(2));
  }
  const ready = M7.ready.then(() => { $('wait').hidden = true; return true; });
  $('wait').textContent = W.waiting;
  window.__clab = { keys: KEYS, ready, start: (k, o) => start(k, o), open, motions: (k) => motions(k).map((x) => x[0]),
    async view(k, o) { $('lab').style.display = 'none'; $('viewer').hidden = false; $('vbar').hidden = !!(o && o.bare); choose(k); await M7.pictures(); await new Promise((r) => setTimeout(r, 30)); return still(k, o); },
    get busy() { return busy; }, row: async (ks) => { $('lab').style.display = 'none'; $('viewer').hidden = false; $('vbar').hidden = true; return row(ks || KEYS); }, slotOf: (k) => { const s = slotOf(k); return s ? { zone: s.zone, slot: s.k } : null; } };
})();
