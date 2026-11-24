// journey.js: the seams that join the zones into one journey (Coven of the Moon Faire, the journey job, November 24,
// 2026). Every piece it joins is someone else's and is not changed: the ship at each landing (game/places/), the 3D map's
// choosing (W3D.maps.world.choose, the maps job's), the flight (W3D.flight.fly, the flight job's), the save slots
// (W3D.saves, the menu job's), the people, the story and the things on the land (game/people/, the hub's).
// Its words and its choices are in game/travel/journey-data.js.
//
//   W3D.journey.start({ page: 'zone-2.html', zone: 'zone-2', landing: 'warmCamp' })     in a zone page, BEFORE the
//                                                                                         menu's block
// What it does on a zone page:
//   1. The ship is the gate. A button by the ship ("things", game/people/things.js). Once the zone's story is done
//      (journey-data.js, `done`), boarding opens the 3D map to choose: every landing reached, and the next one. Before
//      that, only the landings already reached, with one line saying why she will not go on yet.
//   2. A choice made: the slot is saved, and the chosen zone's page is opened with a note of the flight after a # in
//      its address (#journey=...), and, where the browser keeps no storage, the save after it (#...&coven=..., the
//      menu's own way). Where a page cannot open the next (journey-data.js, `opensNext`), a card names the file.
//   3. A page opened with a flight note plays the flight BEFORE its world is built (one 3D picture at a time): the
//      walker's start (W3D.walk) waits for it. The zone's flight lines are said on the way. Then the world is built and
//      the zone begins at its landing. A flight lost or turned back opens the page left, where the coven stands at the
//      ship again, with one line of words.
//   4. One save: the menu's slots. W3D.saves.openPage opens the page a slot was last saved on; a new game opens the
//      first page. Which landings the coven has reached is kept in the slot (the key coven.story.journey).
// For checks: window.__journey = { state(), board(), go(to), log, note, arrived, ... }. ?journeytest flies the flight
// in on its own test handle (W3D.flight.test) and is passed on from page to page.
(function (G) {
  'use strict';
  const W3D = (G.W3D = G.W3D || {});
  const TEST = /[?&]test\b/.test(location.search), JT = /[?&]journeytest\b/.test(location.search);
  const D = () => G.COVEN_JOURNEY, WORDS = () => D().words;
  const KEY = 'coven.story.journey', NEXT = 'coven.journey.next';
  const landing = (id) => (G.COVEN_LANDINGS || []).find((l) => l.id === id) || null;
  const parse = (s) => { try { return s == null ? null : JSON.parse(s); } catch (e) { return null; } };
  const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));
  // the browser's storage as the game sees it (the menu may have put a stand-in in memory in its place)
  const store = {
    get: (k) => { try { return W3D.saves ? W3D.saves.store.get(k) : G.localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { if (W3D.saves) W3D.saves.store.set(k, v); else G.localStorage.setItem(k, v); } catch (e) { /* none */ } },
    del: (k) => { try { if (W3D.saves) W3D.saves.store.del(k); else G.localStorage.removeItem(k); } catch (e) { /* none */ } },
  };
  const log = [];
  const say = (what, o) => { log.push(Object.assign({ what, t: Math.round(performance.now()) }, o || {})); };

  // ---- the note of a flight, carried in the address (read before the menu's own code takes the address's # away) ----
  let note = null;
  {
    const h = location.hash || '', m = /[#&]journey=([^&]*)/.exec(h);
    if (m) {
      note = parse(decodeURIComponent(m[1]));
      const rest = h.replace(/^#/, '').split('&').filter((p) => p && p.indexOf('journey=') !== 0).join('&');
      try { history.replaceState(null, '', location.href.replace(/#.*$/, '') + (rest ? '#' + rest : '')); } catch (e) { /* it stays: harmless */ }
    }
  }

  let page = null, zone = null, here = null, W = null, arrived = false, readyDone = false, busy = false;
  // ---- what the journey keeps in the slot: the landings reached ----
  function state() { const s = parse(store.get(KEY)); return s && s.v === 1 && Array.isArray(s.reached) ? s : { v: 1, reached: ['wickhollow'] }; }
  function reach(id) { const s = state(); if (s.reached.indexOf(id) < 0) s.reached.push(id); s.at = id; store.set(KEY, JSON.stringify(s)); return s; }
  // ---- the zone's story ----
  const story = () => G.__story || null;
  const isDone = () => { const st = story() && story().state(); return !!(st && st.moments && st.moments[D().done[zone]]); };
  const next = () => (G.COVEN_LANDINGS || []).find((l) => l.after === here) || null;

  // ---- one line of words, at the top of the screen (out of the middle of the picture) ----
  let lineEl = null, lineT = 0;
  function line(text, secs) {
    if (!lineEl) { lineEl = document.createElement('div'); lineEl.className = 'cj-line'; lineEl.setAttribute('aria-live', 'polite');
      lineEl.style.cssText = 'position:fixed;left:50%;top:calc(16px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:7;max-width:min(520px,calc(100% - 40px));padding:9px 18px;border-radius:16px;background:rgba(14,12,34,.82);color:#f4f0ff;font:16px/1.35 Georgia,serif;text-align:center;pointer-events:none;transition:opacity .4s;opacity:0';
      (document.getElementById('world') || document.body).appendChild(lineEl); }
    lineEl.textContent = text; lineEl.style.opacity = 1; say('line', { text });
    clearTimeout(lineT); lineT = setTimeout(() => { lineEl.style.opacity = 0; }, (secs || 4.5) * 1000);
  }

  // ---- opening another page ----
  function carry(pending) {
    const S = W3D.saves; if (!S || !S.storage || !S.storage.inMemory) return '';
    const st = Object.assign(parse(S.store.get('coven.saves')) || { v: 1, current: 1 }, { v: 1 });
    if (pending) st.pending = { slot: S.current, fresh: false, at: Date.now() };
    const c = { v: 1, state: st, slots: {} }; for (let n = 1; n <= 3; n++) c.slots[n] = S.slot(n);
    return 'coven=' + encodeURIComponent(JSON.stringify(c));
  }
  const canOpen = () => D().opensNext.indexOf(location.protocol) >= 0;
  function open(pg, hash) {
    const q = JT ? '?journeytest' : '';
    say('open', { page: pg });
    if (!canOpen()) return card(pg);
    location.href = pg + q + (hash ? '#' + hash : '');
    return true;
  }
  // where a page cannot open the next by itself: a card that names the file (and, with no storage, the save to a file)
  function card(pg) {
    const C = WORDS().card, S = W3D.saves, el = document.createElement('div');
    el.className = 'cj-card';
    el.style.cssText = 'position:fixed;inset:0;z-index:80;display:grid;place-items:center;background:rgba(6,5,18,.86);font-family:Georgia,serif;color:#f4f0ff;text-align:center;padding:20px';
    const box = document.createElement('div'); box.style.cssText = 'max-width:440px';
    const h = document.createElement('h2'); h.textContent = C.title; h.style.cssText = 'font-weight:400;color:#ffe9b8;margin:0 0 12px';
    const p = document.createElement('p'); p.textContent = fill(C.body, { page: pg }); p.style.cssText = 'font-size:18px;margin:0 0 14px';
    box.append(h, p);
    const btn = (t, f) => { const b = document.createElement('button'); b.textContent = t; b.style.cssText = 'display:block;width:100%;min-height:52px;margin:10px 0 0;border-radius:26px;border:1px solid rgba(255,226,160,.8);background:rgba(52,40,96,.9);color:#ffe9b8;font:600 18px Georgia,serif'; b.onclick = f; box.appendChild(b); return b; };
    if (S && S.storage && S.storage.inMemory) {
      const q = document.createElement('p'); q.textContent = C.noStorage; q.style.cssText = 'font-size:15px;color:#cfc8ee;margin:0 0 6px'; box.appendChild(q);
      btn(C.saveFile, () => { const f = S.toFile(); if (!f) return; const url = URL.createObjectURL(new Blob([f.text], { type: 'application/json' })), a = document.createElement('a'); a.href = url; a.download = f.name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 5000); });
    }
    btn(C.stay, () => { el.remove(); busy = false; });
    el.appendChild(box); document.body.appendChild(el);
    say('card', { page: pg });
    return false;
  }

  // ---- 1 and 2: the gate, and choosing ----
  async function board(gate) {
    if (busy) return false;
    const w = WORDS(), done = isDone();
    if (gate && gate.refit && !done) { line(w.onSlip); return false; }
    const s = state(), open1 = s.reached.filter((id) => id !== here && landing(id));
    const nx = next(); if (done && nx && open1.indexOf(nx.id) < 0) open1.push(nx.id);
    if (!done) line(w.notYet[zone] || w.notYet['zone-4']);
    if (!open1.length) { if (done) line(w.nowhereElse); say('board', { open: [], done }); return false; }
    say('board', { open: open1, done });
    busy = true;
    let to = null;
    try { to = W3D.maps && W3D.maps.world && W3D.maps.world.choose ? await W3D.maps.world.choose({ from: here, open: open1 }) : open1[open1.length - 1]; } catch (e) { console.error(e); to = null; }
    say('chose', { to });
    if (!to || open1.indexOf(to) < 0) { busy = false; return false; }      // back, or no choice: she is still on the pier
    return leave(to);
  }
  function leave(to) {
    const L = landing(to); if (!L) { busy = false; return false; }
    busy = true;
    if (W3D.saves && !W3D.saves.test) W3D.saves.save('journey');
    const n = { v: 1, from: here, to, at: Date.now() };
    store.set(NEXT, JSON.stringify(n));                // (for a page opened by hand: it finds its flight here)
    const c = carry(true);
    return open(L.page, 'journey=' + encodeURIComponent(JSON.stringify(n)) + (c ? '&' + c : ''));
  }

  // ---- 3: the flight in, before the world is built ----
  // the lines of one moment of this zone: the narrator's (narration.js) or the zone's own (game/talk/zone-N.js)
  function linesOf(kind, moment) {
    const cfg = (W3D.STORY || {})[zone] || {}, T = G[cfg.talk] || null, z = T ? T.zone : null;
    if (!T) return [];
    if (kind === 'narrator') return ((G.COVEN_NARRATION || {})[z] || []).filter((l) => l.at === moment).map((l) => Object.assign({ who: 'narrator' }, l));
    return (T.lines || []).filter((l) => l.when && l.when.moment === moment);
  }
  // the zone's story, as kept, so the lines said on the flight count as heard there
  const FRESH = () => ({ v: 1, stage: 0, n: 0, heard: {}, talks: {}, met: {}, moments: {}, said: {}, nodes: 0, flags: {} });
  function storyKept() { const k = ((W3D.STORY || {})[zone] || {}).key; const s = k ? parse(store.get(k)) : null; return { k, S: s && s.v === 1 ? Object.assign(FRESH(), s) : FRESH() }; }
  function heard(lines, moment) { const { k, S } = storyKept(); if (!k) return; for (const l of lines) S.heard[l.id] = ++S.n; if (moment) S.moments[moment] = true; store.set(k, JSON.stringify(S)); }
  // saying lines over the flight: words at the top, the recording if there is one
  let box = null, queue = [], cur = null, audio = null, sayT = 0, timer = 0;
  function sayLines(lines) {
    for (const l of lines) queue.push(l);
    if (!cur) nextLine();
  }
  function nextLine() {
    clearTimeout(timer); if (audio) { try { audio.onended = null; audio.pause(); } catch (e) { /* gone */ } audio = null; }
    cur = queue.shift() || null;
    if (!box) { box = document.createElement('div'); box.className = 'cj-say';
      box.style.cssText = 'position:fixed;left:50%;top:calc(14px + env(safe-area-inset-top,0px));transform:translateX(-50%);z-index:70;width:min(520px,calc(100% - 200px));min-width:200px;padding:8px 14px 10px;border-radius:14px;background:rgba(8,8,22,.78);border:1px solid rgba(255,226,160,.3);font:16px/1.35 Georgia,serif;color:#f4f0ff;text-align:center;pointer-events:none;display:none';
      document.body.appendChild(box); }
    if (!cur) { box.style.display = 'none'; return; }
    const narr = cur.who === 'narrator', cast = G.COVEN_CAST || {}, name = narr ? '' : (cast[cur.who] && cast[cur.who].name) || (cur.who === 'captain' ? 'The Grey Hat' : '');
    box.innerHTML = ''; if (name) { const n = document.createElement('div'); n.textContent = name; n.style.cssText = 'color:#ffd98a;font:600 13px Georgia,serif;letter-spacing:.03em;margin-bottom:2px'; box.appendChild(n); }
    const t = document.createElement('div'); t.textContent = cur.text; if (narr) t.style.cssText = 'font-style:italic;color:#ffeccc'; box.appendChild(t); box.style.display = 'block';
    say('said', { id: cur.id, who: cur.who, text: cur.text });
    const secs = JT ? 0.3 : (cur.secs || Math.max(2.2, cur.text.split(/\s+/).length * 0.4)) + 0.6;
    const src = JT ? null : (G.COVEN_VOICE || {})[cur.id];
    if (src) { try { const a = audio = new Audio(src); a.onended = () => { if (audio === a) { clearTimeout(timer); timer = setTimeout(nextLine, 350); } };
      // (a phone plays no sound before a tap: if it says no, try again once the player has touched the flight)
      const tryPlay = (n) => a.play().catch(() => { if (n > 0 && audio === a) setTimeout(() => { if (audio === a && navigator.userActivation && navigator.userActivation.hasBeenActive) tryPlay(0); else if (audio === a && n > 1) tryPlay(n - 1); }, 400); });
      tryPlay(6); } catch (e) { audio = null; } }
    timer = setTimeout(nextLine, (src ? secs + 2.5 : secs) * 1000);
  }
  function stopLines() { queue = []; nextLine(); }

  async function flyIn(n) {
    const from = landing(n.from), to = landing(n.to), D0 = D();
    if (!from || !to || !W3D.flight) return { arrived: true, why: 'no-flight' };
    // the zone's flight lines are for the first flight in, from the landing before it, and are said once
    const kept = storyKept().S, firstIn = to.after === from.id && !kept.moments.flight;
    const fl = D0.flightLines, pick = (list) => [].concat(...list.map(([k, m]) => linesOf(k, m)));
    const onRaiders = () => { if (!firstIn) return; const ls = pick(fl.raiders); heard(ls, 'flight'); sayLines(ls); say('moment', { name: 'flight' }); };
    const onClear = () => { if (!firstIn) return; const ls = pick(fl.clear); heard(ls, 'flight-after'); sayLines(ls); say('moment', { name: 'flight-after' }); };
    G.addEventListener('coven:flight-raiders', onRaiders); G.addEventListener('coven:flight-clear', onClear);
    const ship = (W3D.flight.shipFor && W3D.flight.shipFor(from.id)) || undefined;
    say('flight', { from: from.id, to: to.id, ship, firstIn });
    const go = W3D.flight.fly({ from: from.id, to: to.id, test: JT ? { hold: true } : undefined });
    if (firstIn) { const ls = pick(fl.start); heard(ls); setTimeout(() => sayLines(ls), JT ? 0 : 1800); }
    let r = null; try { r = await go; } catch (e) { r = { arrived: false, why: 'error' }; }
    G.removeEventListener('coven:flight-raiders', onRaiders); G.removeEventListener('coven:flight-clear', onClear);
    if (!r.arrived) stopLines();
    say('flown', r);
    return r;
  }
  function goBack(n, r) {
    const from = landing(n.from);
    const why = r && r.why === 'turned-back' ? 'turned-back' : r && r.why === 'lost' ? 'lost' : 'error';
    store.del(NEXT);
    const back = { v: 1, back: why, from: n.from, to: n.to };
    const c = carry(false);
    if (!from) return;
    open(from.page, 'journey=' + encodeURIComponent(JSON.stringify(back)) + (c ? '&' + c : ''));
  }

  // ---- the zone page is ready: put the coven at the landing, say what happened, keep watching the ships ----
  function placeAt(spot) {
    const Z = W.P, part = Z.parts.find((p) => p.id === spot.place[0]); if (!part) return false;
    const PM = part.P.M, x = part.ox + PM.x(spot.place[1]), z = part.oz + PM.z(spot.place[2]);
    const at = W.nearestFit(Z.M.px(x), Z.M.py(z));
    let yaw = null; if (spot.face) { const fx = part.ox + PM.x(spot.face[0]), fz = part.oz + PM.z(spot.face[1]); yaw = Math.atan2(fx - x, fz - z); }
    W.setIo(at[0], at[1], yaw == null ? undefined : yaw); if (yaw != null && W.C) W.C.yaw = yaw + Math.PI;
    return true;
  }
  function onReady() {
    if (readyDone) return; readyDone = true; W = G.__w3d;
    if (!TEST) reach(here);
    if (arrived) {
      const a = (D().arrive || {})[here]; if (a && W) try { placeAt(a); } catch (e) { console.error(e); }
      if (W3D.saves && !TEST) setTimeout(() => W3D.saves.save('arrived'), 50);
      // the Begin screen: passed by itself after a flight, if the player's taps on the flight already let sound play
      const b = document.getElementById('begin'), act = navigator.userActivation;
      if (b && D().beginAfterFlight === 'auto' && getComputedStyle(b).display !== 'none' && (JT || (act && act.hasBeenActive))) { const btn = b.querySelector('button'); if (btn) btn.click(); }
    }
    if (note && note.back && note.to !== here) {
      const w = WORDS(), L = landing(note.from), k = note.back === 'turned-back' ? 'turnedBack' : note.back === 'lost' ? 'lost' : 'flightError';
      setTimeout(() => line(fill(w[k], { from: L ? L.name : '' }), 5), 400);
    }
    if (W3D.landingShips && W3D.landingShips.ready) try { W3D.landingShips.ready({ W, here }); } catch (e) { console.error(e); }
    say('ready', { here, arrived });
  }

  // ---- 4: one save, from page to page ----
  function hookSaves() {
    const S = W3D.saves; if (!S || S.__journey) return; S.__journey = true;
    S.openPage = (pg, c) => open(pg, c || '');
    const reopen0 = S.reopen;
    // a new game begins on the first page
    S.reopen = function () {
      const st = parse(S.store.get('coven.saves')), first = D().firstPage;
      if (st && st.pending && st.pending.fresh && page !== first) { store.del(KEY); return open(first, (location.hash || '').replace(/^#/, '')); }
      return reopen0.call(S);
    };
  }

  // ---- the gate on the land ----
  function gates() {
    const list = (D().gates || {})[here] || [], ships = () => (W3D.landingShips ? W3D.landingShips.shown(here) : null);
    return list.map((g, i) => ({
      id: 'ship-gate' + (i ? '-' + i : ''), place: g.place, reach: g.reach || 3, gate: g,
      get label() { return WORDS().board; },
      can: () => !busy && !(W3D.flight && W3D.flight.flying) && (!g.ship || !ships() || ships() === g.ship),
      use: () => { board(g); },
    }));
  }

  W3D.journey = {
    start(o) {
      page = o.page; zone = o.zone; here = o.landing;
      W3D.THINGS = W3D.THINGS || {}; W3D.THINGS[zone] = (W3D.THINGS[zone] || []).concat(gates());
      // a flight note for this page: from the address, or (a page opened by hand) from the browser's storage
      if (!note && !TEST) { const n = parse(store.get(NEXT)); if (n && n.to === here && Date.now() - n.at < 6 * 3600 * 1000) note = n; }
      const flight = !!(note && !note.back && note.to === here);
      if (flight && !TEST) store.del(NEXT);
      // the walker's start waits: for the flight in, or (no note: the page opened by hand, or Continue) for a look at the
      // slot in use, which may have been saved last on another zone's page: then that page is opened instead
      const walk0 = W3D.walk;
      if (!TEST && typeof walk0 === 'function') W3D.walk = async function () {
        W3D.walk = walk0;
        if (flight) {
          const r = await flyIn(note);
          if (!r.arrived && D().lostGoesBack) { goBack(note, r); return new Promise(() => {}); }
          arrived = true; reach(here);
        } else if (!note) {
          const S = W3D.saves, rec = S && S.slot ? S.slot(S.current) : null;
          if (rec && rec.page && rec.page !== page && /^zone-\d+\.html$/.test(rec.page)) { say('elsewhere', { page: rec.page }); hookSaves(); if (open(rec.page, carry(true)) !== false) return new Promise(() => {}); }
        }
        return walk0.apply(this, arguments);
      };
      setTimeout(hookSaves, 0);
      const poll = setInterval(() => { hookSaves(); if (G.__ready && G.__w3d && (G.__story || G.__peopleErr)) { clearInterval(poll); try { onReady(); } catch (e) { console.error(e); } } }, 250);
    },
    state, board: (i) => board(((D().gates || {})[here] || [])[i || 0] || null), leave, isDone, next, line,
    get note() { return note; }, get arrived() { return arrived; }, get here() { return here; }, get busy() { return busy; },
  };
  G.__journey = { log, state, board: (i) => W3D.journey.board(i), leave, isDone, get note() { return note; }, get arrived() { return arrived; }, get ready() { return readyDone; } };
})(window);
