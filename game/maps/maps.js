// maps.js: the maps in the menu, and choosing where to fly (Coven of the Moon Faire, the maps job, November 23, 2026).
//
// Three maps, one tab:
//   Zone    the big hand-drawn map of the zone she is in (the hub's game/engine/land/minimap.js draws it; this shows it)
//   World   the 3D map of Aethermoor from the old Envoi (game/maps/world/), with a pin where the coven is
//   Sky     the star map of the Thareia system from the old Envoi (game/maps/sky/), in a frame of its own
//
// What other pieces call:
//   W3D.maps.world.mount(el, { here })  ->  { unmount(), setHere(here), ready }
//        here: { landing: id }  or  { zone: 'zone-1', x, z }   (the walker's place on that zone's land, in its metres)
//        ready: a promise, kept once the land is built and the pin stands
//   W3D.maps.world.choose({ from, open })  ->  a promise of a landing's id, or null if the player backs out
//        from: the landing the ship stands at. open: the ids that may be chosen now. It fills the screen by itself.
//   W3D.maps.sky.mount(el)   ->  { unmount(), ready }
//   W3D.maps.zone.mount(el)  ->  { unmount() }
//   W3D.maps.tab             the Maps tab, as W3D.menu.addTab takes it. It adds itself when the menu is there.
//   W3D.maps.where(here)     ->  { at: [x, y] on the atlas, zone, name }   (where the pin goes: the checks read it)
//   W3D.maps.last            numbers from the last time each map was opened and closed (the checks read them)
//
// A 3D map is a second 3D scene beside the game's. Each is built when it is shown and freed when it is left: its
// shapes, pictures and its graphics context are given back, so the game's own scene has the phone to itself again.
// Every word the player reads is in game/maps/data/maps-data.js. The landings are the hub's (game/travel/landings.js).
(function (G) {
  'use strict';
  const W3D = G.W3D = G.W3D || {};
  const DATA = G.COVEN_MAPS_DATA, WORDS = DATA.words;
  const TEST = /[?&]test\b/.test(location.search);
  // with ?test the dotted line is drawn at once and held a quarter of a second (?mapshold=5 holds it longer, for a picture)
  const HOLD = +((location.search.match(/[?&]mapshold=([\d.]+)/) || [])[1] || 0.25);
  const SVGNS = 'http://www.w3.org/2000/svg';
  const el = (tag, cls, parent, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; };
  const button = (cls, parent, text, label) => { const b = el('button', cls, parent, text); b.type = 'button'; if (label) b.setAttribute('aria-label', label); return b; };
  const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o && o[k] != null ? o[k] : m));
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const landings = () => G.COVEN_LANDINGS || [];
  const landing = (id) => landings().find((l) => l.id === id) || null;
  const coarse = () => !!(G.matchMedia && G.matchMedia('(pointer: coarse)').matches);
  // a tap on a map is not a step or a look in the game underneath
  const quiet = (e) => { for (const ev of ['pointerdown', 'pointerup', 'touchstart', 'touchend', 'mousedown', 'mouseup', 'click', 'wheel', 'contextmenu']) e.addEventListener(ev, (x) => x.stopPropagation()); };
  const MOON = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.5 3.2A9 9 0 1 0 20.8 15 7.2 7.2 0 0 1 15.5 3.2z" fill="#f4f0ff"/></svg>';
  const last = { world: null, sky: null, choose: null };

  // ---- this game's places on the old map: a place the game stands somewhere else is moved on the map too ----
  if (G.MapPlaces) for (const id in DATA.places || {}) if (G.MapPlaces.PLACES[id]) Object.assign(G.MapPlaces.PLACES[id], DATA.places[id]);

  // ---- where a spot is on the atlas ----
  const zoneKey = (z) => (typeof z === 'number' ? 'zone-' + z : String(z));
  // how a zone's metres lie on the atlas: the zone's own numbers if its page is open, or else the copy in the data
  function zoneMap(key) {
    const d = DATA.zones[key] || null, pl = G.W3D_PLACES && G.W3D_PLACES[key];
    const live = pl && pl.zone && pl.zone.land && pl.zone.land.atlas && pl.zone.land.atlas.map;
    if (live && live.origin && live.k) return { zone: d ? d.zone : +key.replace(/\D/g, '') || 0, origin: live.origin, k: live.k, start: d ? d.start : [0, 0] };
    return d;
  }
  // which zones are open when the coven is in zone z: the zones are reached in order
  const zonesUpTo = (z) => [1, 2, 3, 4].filter((k) => k <= (z || 1));
  function where(here) {
    const P = G.MapPlaces; let at = null, zone = 0, name = (here && here.name) || '', place = null;
    if (here && here.landing) { const l = landing(here.landing); if (l) { at = l.atlas.slice(); zone = l.zone; name = name || l.name; place = l.place; } }
    else if (here && here.zone != null) {
      const m = zoneMap(zoneKey(here.zone));
      if (m) { const x = here.x != null ? here.x : m.start[0], z = here.z != null ? here.z : m.start[1]; at = [m.origin[0] + x / m.k, m.origin[1] + z / m.k]; zone = m.zone; }
    }
    if (!at) { const l = landings()[0]; at = l ? l.atlas.slice() : [2304, 1536]; zone = l ? l.zone : 0; name = name || (l ? l.name : ''); }
    // the walking place she is in or right by, if any; and the words under the pin: the name given (the land's own name
    // for where she stands), or the landing's, or that place's, or else what the zone's land is called
    let near = null, best = 30;
    if (P) for (const id in P.PLACES) { const p = P.PLACES[id], d = Math.hypot(p.at[0] - at[0], p.at[1] - at[1]); if (d < best) { best = d; near = id; } }
    if (!place || !P || !P.PLACES[place]) place = near;
    if (!name && P) name = near && best < 16 ? P.PLACES[near].name : P.ZONES[zone] ? P.ZONES[zone].land : '';
    return { at, zone, name, place };
  }
  // the map's pictures. The two of the land (how high, what kind of ground) are the same two the zones read: on a
  // zone's page they are taken from the zone, which has them inside the page already
  function mapArt() {
    const art = Object.assign({}, G.MAP_ART || {});
    if (!art.height || !art.kinds) for (const k in G.W3D_PLACES || {}) { const a = G.W3D_PLACES[k] && G.W3D_PLACES[k].zone && G.W3D_PLACES[k].zone.land && G.W3D_PLACES[k].zone.land.atlas; if (a && a.height && a.kinds) { art.height = a.height; art.kinds = a.kinds; break; } }
    return art;
  }
  // how much the 3D map draws: the laptop's level where the game itself runs at its high setting, the phone's otherwise
  function detail() {
    const asked = (location.search.match(/[?&]detail=(phone|laptop)/) || [])[1]; if (asked) return asked;
    if (W3D.quality) return W3D.quality === 'high' ? 'laptop' : 'phone';
    return Math.min(screen.width, screen.height) >= 700 && G.matchMedia('(pointer: fine)').matches ? 'laptop' : 'phone';
  }

  // =====================================================================================================
  // The 3D map of Aethermoor, in a box. o: { here, from, open, choose, done(id or null) }
  // =====================================================================================================
  function openWorld(host, o) {
    const t0 = performance.now(), P = G.MapPlaces, CH = !!o.choose, S = DATA.world;
    const root = el('div', 'cvm cvm-world' + (CH ? ' cvm-choosing' : ''), host); quiet(root);
    const mapEl = el('div', 'cvm-map', root);
    const svg = document.createElementNS(SVGNS, 'svg'); svg.setAttribute('class', 'cvm-line'); svg.setAttribute('aria-hidden', 'true'); root.appendChild(svg);
    const pathSoft = document.createElementNS(SVGNS, 'path'), pathLine = document.createElementNS(SVGNS, 'path');
    pathSoft.setAttribute('class', 'soft'); pathLine.setAttribute('class', 'line'); svg.appendChild(pathSoft); svg.appendChild(pathLine);
    const marksEl = el('div', 'cvm-marks', root);
    const nums = el('div', 'cvm-nums', root);
    const hint = el('div', 'cvm-hint', root, CH ? WORDS.chooseHint : coarse() ? WORDS.hintTouch : WORDS.hintMouse);
    const find = button('cvm-round cvm-find', root, null, WORDS.find); find.innerHTML = MOON; find.hidden = true;
    const card = el('div', 'cvm-card', root); card.hidden = true;
    const load = el('div', 'cvm-load', root); const loadMsg = el('p', null, load, WORDS.worldLoading);
    let back = null;
    if (CH) { const top = el('div', 'cvm-top', root); back = button('cvm-btn cvm-back', top, WORDS.back); el('div', 'cvm-title', top, WORDS.chooseTitle); }

    const state = { ready: false, dead: false, picked: null, going: null, lineT0: 0, linePart: 0, frames: 0, openMs: 0, here: null, marks: [] };
    let map = null, numsT = 0, hintT = 0, doneT = 0, tick = 0;
    // with ?test the map does not draw by itself (a browser with no graphics card would spend all its time drawing):
    // it is drawn when something changes, and now and then besides
    const draw = () => { if (TEST && map && state.ready && !state.dead) { map.step(0.05); map.render(); } };
    const again = () => { draw(); if (!state.dead) tick = setTimeout(again, detail() === 'laptop' ? 5000 : 1500); };
    if (TEST) tick = setTimeout(again, 1500);
    const openIds = new Set(o.open || []);
    const fromL = o.from ? landing(o.from) : null;

    if (!G.WorldMap || !G.THREE || !P) { loadMsg.textContent = WORDS.worldFailed; }
    let w = where(o.here);
    state.here = w;

    // ---- the landings: a mark on the map for each, that can be tapped ----
    function kindOf(l) {
      if (CH) return fromL && l.id === fromL.id ? 'from' : openIds.has(l.id) ? 'open' : 'shut';
      return l.zone <= (w.zone || 1) ? 'known' : 'shut';
    }
    function whyShut(l) {
      const C = DATA.closed; if (C.byId && C.byId[l.id]) return C.byId[l.id];
      const a = l.after ? landing(l.after) : null;
      if (a && (!fromL || l.zone > fromL.zone)) return fill(C.order, { after: a.name });
      return C.any;
    }
    for (const l of landings()) {
      const k = kindOf(l), b = button('cvm-mark ' + k, marksEl); b.dataset.id = l.id; b.dataset.kind = k;
      el('i', null, b); el('span', null, b, l.name);
      b.addEventListener('click', () => pick(l.id));
      state.marks.push({ l, b, k, s: { x: 0, y: 0, on: false } });
    }
    function showCard(l) {
      const k = kindOf(l); card.textContent = ''; card.hidden = false; root.classList.add('carded');
      const x = button('cvm-x', card, '✕', WORDS.closeCard); x.addEventListener('click', () => pick(null));
      el('div', 'cvm-kind', card, WORDS.landing + (P && P.ZONES[l.zone] ? ' · ' + P.ZONES[l.zone].land : ''));
      el('h2', null, card, l.name);
      el('p', 'cvm-why', card, k === 'from' ? WORDS.shipHere : k === 'open' ? WORDS.canFly : k === 'known' ? WORDS.been : whyShut(l));
      if (CH && k === 'open') { const go = button('cvm-btn cvm-go', card, WORDS.setCourse); go.addEventListener('click', () => setCourse(l.id)); }
    }
    function pick(id) {
      if (state.going) return;
      const l = id ? landing(id) : null; state.picked = l ? l.id : null;
      for (const m of state.marks) m.b.classList.toggle('on', !!l && m.l.id === l.id);
      if (!l) { card.hidden = true; root.classList.remove('carded'); drawLine(); draw(); return; }
      showCard(l); hint.classList.add('gone');
      drawLine(); draw();
    }
    // "Set course": the dotted line is drawn from here to there, held a moment, and the map answers
    function setCourse(id) {
      const l = landing(id); if (!CH || state.going || !l || !openIds.has(id) || (fromL && fromL.id === id)) return false;
      state.going = id; state.lineT0 = performance.now(); root.classList.add('going');
      card.textContent = ''; el('p', 'cvm-set', card, fill(WORDS.courseSet, { name: l.name })); card.hidden = false;
      if (map && fromL) { const a = fromL.atlas, b = l.atlas; frame2(a, b, 1.4); }
      doneT = setTimeout(() => finish(id), (TEST ? HOLD : S.lineSecs + S.holdSecs) * 1000);
      drawLine(); draw();
      return true;
    }
    function finish(id) { if (state.dead) return; clearTimeout(doneT); if (o.done) o.done(id); }

    // ---- the dotted line: from the ship to the landing chosen, in an arc over the land, drawn over the map ----
    const sp = { x: 0, y: 0, on: false, front: false };
    function linePath(a, b, part) {
      const n = S.dashes, len = Math.hypot(b[0] - a[0], b[1] - a[1]); let d = '', pen = false;
      for (let i = 0; i <= n; i++) {
        const t = i / n; if (t > part + 1e-6) break;
        map.screenOf(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, 16 + len * S.arc * 4 * t * (1 - t), sp);
        if (!sp.front) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + sp.x.toFixed(1) + ' ' + sp.y.toFixed(1); pen = true;
      }
      return d;
    }
    function drawLine() {
      if (!map || !state.ready || !fromL) { pathSoft.setAttribute('d', ''); pathLine.setAttribute('d', ''); return; }
      const to = state.going ? landing(state.going) : state.picked && openIds.has(state.picked) && state.picked !== fromL.id ? landing(state.picked) : null;
      if (!to) { pathSoft.setAttribute('d', ''); pathLine.setAttribute('d', ''); state.linePart = 0; return; }
      // before "Set course" the way is shown faintly; after it, the line is drawn along it
      const part = state.going ? clamp((performance.now() - state.lineT0) / (S.lineSecs * 1000), 0, 1) : 0;
      state.linePart = TEST && state.going ? 1 : part;
      pathSoft.setAttribute('d', linePath(fromL.atlas, to.atlas, 1));
      pathLine.setAttribute('d', state.going ? linePath(fromL.atlas, to.atlas, state.linePart) : '');
    }
    // the view that holds two spots of the atlas, however the screen is turned
    function frame2(a, b, secs) {
      const wd = mapEl.clientWidth || 1, hg = mapEl.clientHeight || 1, asp = wd / hg, dx = Math.abs(b[0] - a[0]), dy = Math.abs(b[1] - a[1]);
      const dist = clamp(Math.max(dx / (0.5 * asp), dy / 0.36, 700) + 260, 900, 6200), x = (a[0] + b[0]) / 2, y = (a[1] + b[1]) / 2 + dist * 0.06;
      if (TEST || !secs) { map.view = { x, y, dist, yaw: 0, tilt: 0.95 }; return Promise.resolve(); }
      return map.flyTo(x, y, dist, secs, 0, 0.95);
    }
    function homeView(fly) {
      if (CH && fromL) { // the ship, and every landing that may be chosen
        let a = fromL.atlas.slice(), b = fromL.atlas.slice();
        for (const l of landings()) if (openIds.has(l.id)) { a = [Math.min(a[0], l.atlas[0]), Math.min(a[1], l.atlas[1])]; b = [Math.max(b[0], l.atlas[0]), Math.max(b[1], l.atlas[1])]; }
        return frame2(a, b, fly ? 1.6 : 0);
      }
      if (TEST || !fly) { map.view = { x: w.at[0], y: w.at[1], dist: S.startDist, yaw: 0, tilt: S.startTilt }; return Promise.resolve(); }
      return map.flyTo(w.at[0], w.at[1], S.startDist, undefined, 0, S.startTilt);
    }
    function onFrame() {
      state.frames++;
      for (const m of state.marks) {
        map.screenOf(m.l.atlas[0], m.l.atlas[1], 14, m.s);
        if (m.s.on) { m.b.style.display = ''; m.b.style.transform = 'translate(' + m.s.x.toFixed(1) + 'px,' + m.s.y.toFixed(1) + 'px)'; } else m.b.style.display = 'none';
      }
      root.classList.toggle('far', map.view.dist > 3000);
      drawLine();
      const now = performance.now();
      if (now - numsT > 1000) { numsT = now; const n = map.numbers(); nums.textContent = (n.fps ? fill(WORDS.fps, { fps: n.fps }) : WORDS.measuring) + ' · ' + fill(WORDS.triangles, { n: Math.round(n.triangles / 1000) }) + ' · ' + (n.detail === 'laptop' ? WORDS.detailLaptop : WORDS.detailPhone); }
    }
    function setPin() { map.setIoAt(w.at[0], w.at[1], w.name, w.zone, w.place); map.setOpen(o.openZones || zonesUpTo(Math.max(w.zone, fromL ? fromL.zone : 0))); }

    const onKey = (e) => {
      if (!CH || state.dead) return;
      if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); if (!state.going) finish(null); }
      else if (e.key === 'Enter' && state.picked && !state.going) { if (setCourse(state.picked)) { e.preventDefault(); e.stopPropagation(); } }
    };
    if (CH) { G.addEventListener('keydown', onKey, true); back.addEventListener('click', () => { if (!state.going) finish(null); }); }
    find.addEventListener('click', () => { if (map && state.ready && !state.going) { pick(null); homeView(true); } });

    let ro = null;
    const ready = (async () => {
      if (!G.WorldMap || !G.THREE || !P) throw new Error('the map is not in this page');
      // a moment for the "Unrolling" line to show before the land is built (the building holds the page for a second or more)
      await new Promise((r) => setTimeout(r, 30));
      if (state.dead) return null;
      const art = mapArt(); if (!art.height || !art.kinds) throw new Error('the land\'s two pictures are not in this page');
      map = G.WorldMap.create(mapEl, { art, detail: detail(), open: zonesUpTo(w.zone), words: { pin: WORDS.pin }, landings: [], keep: TEST, still: TEST }); // (landings: []: the landings are this file's own marks, so no place's name carries the old diamond)
      handle.map = map;
      map.onTouch = () => hint.classList.add('gone');
      await map.ready;
      if (state.dead) return null;
      setPin(); map.resize(); homeView(false);
      map.onFrame = onFrame;
      if (G.ResizeObserver) { ro = new ResizeObserver(() => { if (map && !state.dead) map.resize(); }); ro.observe(mapEl); }
      state.ready = true; state.openMs = Math.round(performance.now() - t0);
      load.classList.add('gone'); find.hidden = false; root.classList.add('ready');
      hintT = setTimeout(() => hint.classList.add('gone'), 6000);
      // the first picture, and what it cost
      map.step(0.016); map.render();
      const n = map.numbers(), mem = map.P.renderer.info.memory;
      last.world = { openMs: state.openMs, detail: n.detail, triangles: n.triangles, calls: n.calls, trees: n.trees, geometries: mem.geometries, textures: mem.textures, left: null };
      return handle;
    })();
    ready.catch((e) => { if (!state.dead) { loadMsg.textContent = WORDS.worldFailed; console.error(e); } });

    const handle = {
      root, state, map: null, ready,
      setHere(here) { o.here = here; w = where(here); state.here = w; if (map && state.ready) { setPin(); for (const m of state.marks) { const k = kindOf(m.l); m.b.classList.remove(m.k); m.b.classList.add(k); m.k = k; m.b.dataset.kind = k; } homeView(!TEST); draw(); } },
      pick, setCourse,
      unmount() {
        if (state.dead) return; state.dead = true;
        clearTimeout(hintT); clearTimeout(doneT); clearTimeout(tick); if (ro) ro.disconnect();
        if (CH) G.removeEventListener('keydown', onKey, true);
        let left = null; if (map) { try { left = map.dispose(); } catch (e) { console.error(e); } }
        if (last.world) last.world.left = left;
        handle.map = map = null; root.remove();
      },
    };
    return handle;
  }

  // =====================================================================================================
  // The star map, in a frame of its own (it runs a newer three.js than the game; game/maps/sky/)
  // =====================================================================================================
  function openSky(host) {
    const t0 = performance.now(), S = DATA.sky;
    const root = el('div', 'cvm cvm-sky', host); quiet(root);
    const load = el('div', 'cvm-load', root); const loadMsg = el('p', null, load, WORDS.skyLoading);
    const state = { ready: false, dead: false, error: null, left: null };
    let frame = null, okReady = null, goneT = 0;
    const ready = new Promise((ok) => { okReady = ok; });
    const moon = S.info.aurous ? S.info.aurous.name : '';
    const info = {}; for (const k in S.info) { info[k] = {}; for (const f in S.info[k]) info[k][f] = typeof S.info[k][f] === 'string' ? fill(S.info[k][f], { moon }) : S.info[k][f]; }
    const cfg = { info, words: S.words, travel: !!S.travel, here: S.here, moon, test: TEST };
    const onMsg = (e) => {
      const d = e.data; if (!frame || e.source !== frame.contentWindow || !d || d.coven !== 'sky') return;
      if (d.what === 'ready') { state.ready = true; load.classList.add('gone'); last.sky = { openMs: Math.round(performance.now() - t0), triangles: d.triangles, calls: d.calls, geometries: d.geometries, textures: d.textures, left: null }; okReady(handle); }
      else if (d.what === 'error') { state.error = d.message; loadMsg.textContent = WORDS.skyFailed; load.classList.remove('gone'); }
      // the Escape key pressed inside the frame: handed on to the page, as if it had been pressed there (the menu closes on it)
      else if (d.what === 'escape') { if (!state.dead) document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', code: 'Escape', bubbles: true, cancelable: true })); }
      else if (d.what === 'freed') { state.left = { geometries: d.geometries, textures: d.textures }; if (last.sky) last.sky.left = state.left; away(); }
    };
    function away() { clearTimeout(goneT); G.removeEventListener('message', onMsg); if (frame) { frame.remove(); frame = null; } root.remove(); }
    if (!G.COVEN_SKY_FRAME) { loadMsg.textContent = WORDS.skyFailed; }
    else {
      G.addEventListener('message', onMsg);
      frame = document.createElement('iframe'); frame.className = 'cvm-frame'; frame.title = WORDS.skyLabel;
      // the frame's page is a piece of text inside this file: its names and words are put into it here
      frame.srcdoc = G.COVEN_SKY_FRAME.replace('/*COVEN_SKY*/null', () => JSON.stringify(cfg).replace(/</g, '\\u003c'));
      root.insertBefore(frame, load);
    }
    const handle = {
      root, state, ready, get frame() { return frame; },
      unmount() {
        if (state.dead) return; state.dead = true; root.style.display = 'none';
        // the frame frees what it holds, and is taken away. This page can reach into the frame (its page is a piece of this
        // file), so it is done at once; if a browser will not let it, the frame is asked by message and given a moment
        let left = null;
        try { const w = frame && frame.contentWindow; if (w && typeof w.COVEN_SKY_FREE === 'function') left = w.COVEN_SKY_FREE(); } catch (e) { left = null; }
        if (left) { state.left = left; if (last.sky) last.sky.left = left; away(); }
        else if (state.ready && frame && frame.contentWindow) { try { frame.contentWindow.postMessage({ coven: 'sky', what: 'stop' }, '*'); } catch (e) { /* gone already */ } goneT = setTimeout(away, 1500); }
        // (a frame left before it was ready has drawn nothing yet: taking it away is all there is to do)
        else away();
      },
    };
    return handle;
  }

  // =====================================================================================================
  // The zone's own map: the big hand-drawn one the land already has, shown here
  // =====================================================================================================
  function openZone(host) {
    const root = el('div', 'cvm cvm-zone', host); quiet(root);
    const mm = G.__map, state = { drawn: false, dead: false };
    let t = 0, cv = null;
    if (!mm || !mm.big || typeof mm.open !== 'function') el('p', 'cvm-note', root, WORDS.zoneNone);
    else {
      cv = el('canvas', 'cvm-zonemap', root); cv.setAttribute('role', 'img'); cv.setAttribute('aria-label', WORDS.zoneLabel);
      // the land's big map is drawn (out of sight, under this), copied here, and put away again
      const draw = () => {
        if (state.dead) return;
        try {
          mm.open(true); const b = mm.big; if (cv.width !== b.width || cv.height !== b.height) { cv.width = b.width; cv.height = b.height; }
          const g = cv.getContext('2d'); g.clearRect(0, 0, cv.width, cv.height); g.drawImage(b, 0, 0); state.drawn = b.width > 0 && b.height > 0;
          // it is shown as large as the tab's box allows, in its own shape, and never larger than it was drawn
          const box = root.getBoundingClientRect(), k = Math.min((box.width - 12) / (b.width || 1), (box.height - 12) / (b.height || 1), 1);
          cv.style.width = Math.max(1, Math.floor(b.width * k)) + 'px'; cv.style.height = Math.max(1, Math.floor(b.height * k)) + 'px';
        }
        catch (e) { console.error(e); } finally { try { mm.open(false); } catch (e) { /* nothing to close */ } }
      };
      draw(); G.addEventListener('resize', draw); state.draw = draw;
      if (!TEST) t = setInterval(draw, 500);
    }
    return { root, state, unmount() { if (state.dead) return; state.dead = true; clearInterval(t); if (state.draw) G.removeEventListener('resize', state.draw); root.remove(); } };
  }

  // =====================================================================================================
  // What the rest of the game calls
  // =====================================================================================================
  const world = {
    mount(elm, o) { const h = openWorld(elm, { here: (o && o.here) || null, openZones: o && o.openZones }); world.shown = h; return h; },
    // choosing where to fly: the map fills the screen without the menu; the land underneath is stopped meanwhile
    choose(o) {
      o = o || {};
      return new Promise((resolve) => {
        if (world.choosing) { resolve(null); return; }
        const host = el('div', 'cvm-full', document.body);
        const Wk = G.__w3d; let paused = false;
        if (Wk && typeof Wk.pause === 'function' && !Wk.paused) { Wk.pause(true); paused = true; }
        const h = openWorld(host, { choose: true, here: { landing: o.from }, from: o.from, open: o.open || [], done: (id) => {
          last.choose = { from: o.from, to: id, linePart: h.state.linePart };
          h.unmount(); host.remove(); world.choosing = null;
          if (paused && Wk && Wk.paused) Wk.pause(false);
          resolve(id || null);
        } });
        world.choosing = h;
      });
    },
    shown: null, choosing: null,
  };
  const sky = { mount(elm) { const h = openSky(elm); sky.shown = h; return h; }, shown: null };
  const zone = { mount(elm) { return openZone(elm); } };

  // ---- the Maps tab: three views to switch between ----
  let view = null, shown = null, tabRoot = null, tabCtx = null, tabEl = null, tabWas = null;
  // The tab fills the panel the menu gives it. If that panel is not a box the tab can fill (it has no place of its own,
  // or no height), the tab takes the screen from the panel's top down, so a map is never drawn into nothing.
  function fit() {
    if (!tabRoot || !tabEl) return;
    tabRoot.style.position = ''; tabRoot.style.height = '';
    const r = tabEl.getBoundingClientRect();
    if (r.height < 160) { tabRoot.style.position = 'relative'; tabRoot.style.height = Math.max(240, G.innerHeight - Math.max(0, r.top)) + 'px'; }
  }
  function hereOf(ctx) {
    const Wk = ctx && ctx.W, key = ctx && ctx.zone;
    if (Wk && Wk.io && Wk.P && Wk.P.M && key && zoneMap(zoneKey(key))) {
      let name = ''; try { name = (Wk.P.land && Wk.P.land.region && Wk.P.land.region()) || ''; } catch (e) { /* no name */ }
      return { zone: key, x: Wk.P.M.x(Wk.io.px), z: Wk.P.M.z(Wk.io.py), name };
    }
    if (key && zoneMap(zoneKey(key))) return { zone: key };
    return { landing: landings()[0] ? landings()[0].id : null };
  }
  function show(v) {
    if (!tabRoot) return;
    if (shown) { shown.unmount(); shown = null; }
    view = v;
    for (const b of tabRoot.querySelectorAll('.cvm-views button')) { const on = b.dataset.view === v; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on ? 'true' : 'false'); }
    const box = tabRoot.querySelector('.cvm-view');
    shown = v === 'world' ? world.mount(box, { here: hereOf(tabCtx) }) : v === 'sky' ? sky.mount(box) : zone.mount(box);
    tab.shown = shown; tab.view = v;
  }
  const tab = {
    id: 'maps', label: WORDS.tab, order: 20, view: null, shown: null,
    mount(elm, ctx) {
      tab.unmount(); tabCtx = ctx || {}; tabEl = elm;
      tabWas = elm.style.position; if (getComputedStyle(elm).position === 'static') elm.style.position = 'relative';
      tabRoot = el('div', 'cvm cvm-tab', elm); fit(); G.addEventListener('resize', fit);
      const row = el('div', 'cvm-views', tabRoot); row.setAttribute('role', 'group'); row.setAttribute('aria-label', WORDS.viewsLabel);
      for (const v of ['zone', 'world', 'sky']) { const b = button(null, row, WORDS.views[v]); b.dataset.view = v; b.addEventListener('click', () => { if (view !== v || !shown) show(v); }); }
      el('div', 'cvm-view', tabRoot);
      // it opens on the view last looked at; the first time, on the zone's own map if there is one (it costs nothing to draw)
      show(view || (G.__map && G.__map.big ? 'zone' : 'world'));
    },
    unmount() {
      if (shown) { shown.unmount(); shown = null; } tab.shown = null; G.removeEventListener('resize', fit);
      if (tabRoot) { tabRoot.remove(); tabRoot = null; } if (tabEl && tabWas != null) tabEl.style.position = tabWas; tabEl = null; tabWas = null; tabCtx = null;
    },
    show,
  };

  W3D.maps = { world, sky, zone, tab, where, last, data: DATA };

  // the tab adds itself to the menu, whichever of the two is loaded first
  let added = false, tries = 0;
  function addTab() { if (added || !W3D.menu || typeof W3D.menu.addTab !== 'function') return added; W3D.menu.addTab(tab); added = true; return true; }
  if (!addTab()) {
    document.addEventListener('DOMContentLoaded', addTab); G.addEventListener('load', addTab); G.addEventListener('coven:menu-open', addTab);
    const t = setInterval(() => { if (addTab() || ++tries > 240) clearInterval(t); }, 500);
  }
})(window);
