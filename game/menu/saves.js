// saves.js: three save slots, as a layer over the keys the game already keeps (Coven of the Moon Faire, the menu job,
// November 23, 2026). Nothing of the game's own changes: party.js, story.js and the walker go on writing their keys in
// the browser's storage as before. This file copies those keys (menu-data.js says which) into the slot in use, and back
// out of a slot when one is loaded.
//
// How it works:
//   - the game's keys in the browser are the game being played. coven.saves says which slot that is (1 unless changed);
//   - the game saves itself into that slot: when the page is ready, every 20 seconds (menu-data.js), whenever the page
//     is hidden or closed, and when the menu opens. A save is a copy of every slot key, with the time, the page it was
//     made on, where the coven stands and who walks (coven.where), and a few numbers for its one line;
//   - loading another slot, or starting a new game, writes "load slot N" in coven.saves and opens the page again. On the
//     way in, before anything of the game reads the browser, this file puts slot N's keys in place of the game's. So
//     the party, the story and the walker start from the slot, in their own way, with no change to them;
//   - every zone page that has the menu uses the same keys in the same storage, so a slot holds across pages;
//   - with ?test nothing is written to the browser: every write goes to a layer in memory over the browser's storage,
//     and loading a slot happens in that layer at once, with no new page.
// Load this before the page's own start-up script, so a waiting load is put in place before the game reads anything.
//
//   W3D.saves.slot(n)        the save in slot n (1 to 3), or null      .slots()  all three   .current  the slot in use
//   W3D.saves.save(why)      save now into the slot in use              .line(save)   its one line, in words
//   W3D.saves.load(n)        play slot n (saved first: the slot in use)  .fresh(n)  a new game in slot n
//   W3D.saves.remove(n)      empty slot n (not the one in use)          .copy(from, to)
//   W3D.saves.toFile()       { name, text } of the slot in use, saved first   .fromText(text)  { ok, save, why }
//   W3D.saves.put(save, n)   a save from a file into slot n (into the slot in use: the page starts again with it)
//   W3D.saves.storage        { ok: true / false / null (not tried: ?test), first, visits, inMemory }
//   W3D.saves.openPage       left null. If set to (page, carry) => ..., it is called in place of opening this page again
//                            when the slot to be played was last saved on another zone's page (for the hub, when the
//                            pages call each other). carry is '' or, on a page with no storage, 'coven=...' to be put
//                            after a # on the next page's address
(function (G) {
  'use strict';
  const W3D = G.W3D = G.W3D || {}, D = W3D.MENU_DATA, WD = W3D.MENU_WORDS;
  const TEST = /[?&]test\b/.test(location.search);
  const STATE = 'coven.saves', WHERE = 'coven.where', SLOT = (n) => 'coven.slot.' + n;

  // ---- the browser's storage, and with ?test a layer in memory over it (reads fall through, writes stay here) ----
  let LS = null; try { LS = G.localStorage; } catch (e) { LS = null; }
  // does the browser keep what is written? (not tried with ?test: trying writes). Some phones give a page opened from a
  // downloaded file no storage at all. Then the page gets a stand-in kept in memory, so the game runs as usual and Save
  // to a file has the whole game to write; and a save to be loaded is carried into the page's next opening in its
  // address (after #coven=), since nothing else lasts that long there
  const storage = { ok: null, first: null, visits: 0, inMemory: false };
  if (!TEST) {
    const k = 'coven.saves.probe', v = 'p' + Math.random();
    try { LS.setItem(k, v); storage.ok = LS.getItem(k) === v; LS.removeItem(k); } catch (e) { storage.ok = false; }
    if (!storage.ok) {
      const m = new Map(), shim = {
        getItem: (q) => (m.has(String(q)) ? m.get(String(q)) : null), setItem: (q, x) => { m.set(String(q), String(x)); }, removeItem: (q) => { m.delete(String(q)); },
        key: (i) => [...m.keys()][i] || null, clear: () => m.clear(), get length() { return m.size; },
      };
      try { Object.defineProperty(G, 'localStorage', { configurable: true, enumerable: true, get: () => shim }); } catch (e) { /* the game's own reads fail as before */ }
      LS = shim; storage.inMemory = true;
    }
  }
  const real = {
    get(k) { try { return LS ? LS.getItem(k) : null; } catch (e) { return null; } },
    set(k, v) { try { LS.setItem(k, v); return true; } catch (e) { return false; } },
    del(k) { try { if (LS) LS.removeItem(k); } catch (e) { /* nothing to do */ } },
    keys() { const out = []; try { for (let i = 0; i < LS.length; i++) out.push(LS.key(i)); } catch (e) { /* none */ } return out; },
  };
  const mem = new Map();   // ?test only: a value of null means removed here
  const store = TEST ? {
    get: (k) => (mem.has(k) ? mem.get(k) : real.get(k)),
    set(k, v) { mem.set(k, String(v)); return true; },
    del(k) { mem.set(k, null); },
    keys() { const s = new Set(real.keys()); for (const [k, v] of mem) { if (v == null) s.delete(k); else s.add(k); } return [...s]; },
    memory: mem,
  } : real;
  const parse = (s) => { try { return s == null ? null : JSON.parse(s); } catch (e) { return null; } };
  const put = (k, o) => store.set(k, JSON.stringify(o));

  // which keys go in a slot (menu-data.js)
  const isSlotKey = (k) => D.keys.some((e) => e.slot && (e.key === k || (e.prefix && k.indexOf(e.prefix) === 0)));
  const N = D.slots || 3, okN = (n) => n === +n && n >= 1 && n <= N;

  // only a save's own keys, each a string the game wrote (for a save from a file, or carried in the address)
  function clean(rec) {
    if (!rec || typeof rec !== 'object' || !rec.keys || typeof rec.keys !== 'object') return null;
    const keys = {}; let n = 0;
    for (const k in rec.keys) { const v = rec.keys[k]; if (!isSlotKey(k) || typeof v !== 'string' || v.length > D.file.most) return null; const p = parse(v); if (!p || typeof p !== 'object') return null; keys[k] = v; n++; }
    return n ? Object.assign({}, rec, { v: 1, keys }) : null;
  }
  // a load carried in the address, from a page that had no storage: put in place first
  { const h = /[#&]coven=([^&]*)/.exec(location.hash || '');
    if (h && !TEST) {
      let c = null; try { c = JSON.parse(decodeURIComponent(h[1])); } catch (e) { c = null; }
      if (c && c.v === 1) {
        for (let n = 1; n <= N; n++) { const r = clean(c.slots && c.slots[n]); if (r) store.set(SLOT(n), JSON.stringify(Object.assign(r, { n }))); else store.del(SLOT(n)); }
        if (c.state && c.state.v === 1) store.set(STATE, JSON.stringify(c.state));
      }
      try { history.replaceState(null, '', location.href.replace(/#.*$/, '')); } catch (e) { /* it stays in the address: harmless */ }
    } }

  // ---- coven.saves: the slot in use, a load waiting for this page, when saves were first kept here, visits ----
  const readState = () => { const s = parse(store.get(STATE)); return s && s.v === 1 ? s : { v: 1, current: 1 }; };
  let state = readState();
  if (!okN(state.current)) state.current = 1;
  if (!TEST) { state.first = state.first || Date.now(); state.visits = (state.visits || 0) + 1; }
  storage.first = state.first || null; storage.visits = state.visits || 0;

  // put slot n's keys in place of the game's (or, fresh, take the game's away: a new game)
  function lay(n, fresh) {
    const rec = fresh ? null : slot(n), keys = (rec && rec.keys) || {};
    for (const k of store.keys()) if (isSlotKey(k) && !(k in keys)) store.del(k);
    for (const k in keys) if (isSlotKey(k)) store.set(k, keys[k]);
    if (fresh) store.del(SLOT(n));
    state.current = n;
  }
  // a load waiting from the page before: done now, before the game reads anything
  if (state.pending && okN(state.pending.slot)) { lay(state.pending.slot, !!state.pending.fresh); }
  delete state.pending;
  if (!TEST) put(STATE, state);

  // ---- a slot ----
  function slot(n) { if (!okN(n)) return null; const r = parse(store.get(SLOT(n))); return r && r.v === 1 && r.keys && typeof r.keys === 'object' ? r : null; }
  const slots = () => { const out = []; for (let n = 1; n <= N; n++) out.push(slot(n)); return out; };

  // ---- this page, once it is ready (menu.js calls ready) ----
  let W = null, page = null, zone = null, switching = false, lastSaved = '', failed = false, timer = 0;
  const zoneN = (z) => +String(z || '').replace(/\D/g, '') || null;
  // the numbers a save's line is made of: the zone, how far its story is, the coven's level, the lamps home (zone 1)
  function bits() {
    const b = { zone: zoneN(zone) };
    // small-things: only the zone's own story has parts and lamps. In the ending, zone 1's page runs the Faire's story
    // (its zone is 'faire'), which was read against zone 1's rules and gave "part 1 of 5" beside "the end reached"
    const own = !(G.__story && G.__story.zone && G.__story.zone !== zone);
    const st = own && G.__story && G.__story.state ? G.__story.state() : null, rules = (W3D.STORY || {})[zone];
    if (st && rules && rules.stages) { b.part =(st.kept != null ? st.kept : st.stage) + 1; b.parts = rules.stages.length + 1; }
    const live = G.__fights && G.__fights.party, kept = parse(store.get('coven.party'));
    b.level = live ? live.level : kept && kept.level >= 1 ? Math.round(kept.level) : 1;
    if (b.zone === 1 && st && st.lamps != null) b.lamps = st.lamps;
    return b;
  }
  const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));
  function line(rec) {
    if (!rec) return WD.empty;
    const b = rec.bits || {}, out = [];
    if (b.zone) out.push(fill(WD.zone, { n: b.zone }));
    if (b.part && b.parts) out.push(fill(WD.part, b));
    if (b.level) out.push(fill(WD.level, { n: b.level }));
    if (b.lamps > 0) out.push(b.lamps === 1 ? WD.lamp1 : fill(WD.lampN, { n: b.lamps }));
    return out.join(WD.sep) || (rec.line || '');
  }

  // save now into the slot in use. Returns true if a save was written, false if nothing had changed or it failed
  function save(why) {
    if (switching || !page) return false;
    if (W && W.io && !W.isBusy()) {
      const w = { page, zone, px: +W.io.px.toFixed(2), py: +W.io.py.toFixed(2), yaw: +(W.io.yaw || 0).toFixed(3), who: W.who || 'io' };
      put(WHERE, w);
    }
    const keys = {}; for (const k of store.keys()) if (isSlotKey(k)) { const v = store.get(k); if (v != null) keys[k] = v; }
    const b = bits(), n = state.current, old = slot(n), sig = JSON.stringify([keys, b, page]);
    if (old && sig === lastSaved) return false;
    const rec = { v: 1, n, made: (old && old.made) || Date.now(), saved: Date.now(), page, zone, bits: b, line: '', keys };
    rec.line = line(rec);
    const ok = put(SLOT(n), rec);
    failed = !ok; if (ok) lastSaved = sig;
    if (ok) G.dispatchEvent(new CustomEvent('coven:saved', { detail: { slot: n, why: why || '' } }));
    return ok;
  }

  // play another slot, or a new game: written down, then the page opens again and lays it on the way in
  function go(n, fresh) {
    state = Object.assign(readState(), { first: state.first, visits: state.visits });
    if (TEST) { lay(n, fresh); lastSaved = ''; G.dispatchEvent(new CustomEvent('coven:saves-switched', { detail: { slot: n, fresh: !!fresh } })); return 'test'; }
    state.pending = { slot: n, fresh: !!fresh, at: Date.now() }; put(STATE, state);
    switching = true; clearInterval(timer);
    // no storage that lasts: everything is carried in the address instead (the three slots and which to load)
    let carry = '';
    if (storage.inMemory) { const c = { v: 1, state, slots: {} }; for (let m = 1; m <= N; m++) c.slots[m] = slot(m); carry = 'coven=' + encodeURIComponent(JSON.stringify(c)); }
    const rec = fresh ? null : slot(n);
    if (rec && rec.page && rec.page !== page && typeof api.openPage === 'function') { try { api.openPage(rec.page, carry); return 'page'; } catch (e) { console.error(e); } }
    if (carry) location.hash = carry;
    api.reopen();
    return 'reload';
  }
  function load(n) { if (!okN(n)) return false; if (n === state.current) return 'here'; save('switch'); return go(n, false); }
  function fresh(n) { if (!okN(n)) return false; if (n !== state.current) save('switch'); return go(n, true); }
  function remove(n) { if (!okN(n) || n === state.current) return false; store.del(SLOT(n)); return true; }
  function copy(from, to) {
    if (!okN(from) || !okN(to) || from === to || to === state.current) return false;
    if (from === state.current) save('copy');
    const rec = slot(from); if (!rec) return false;
    return put(SLOT(to), Object.assign({}, rec, { n: to, copiedFrom: from }));
  }

  // ---- a file: the slot in use, to carry between devices or keep as a spare ----
  const two = (v) => (v < 10 ? '0' : '') + v;
  function toFile() {
    save('file');
    const rec = slot(state.current); if (!rec) return null;
    const F = D.file, d = new Date(rec.saved);
    const out = { game: F.game, kind: F.kind, v: F.v, saved: d.toISOString(), page: rec.page, zone: rec.zone, line: line(rec), bits: rec.bits, keys: rec.keys };
    return { name: 'coven-save-' + d.getFullYear() + '-' + two(d.getMonth() + 1) + '-' + two(d.getDate()) + '-' + two(d.getHours()) + two(d.getMinutes()) + '.json', text: JSON.stringify(out, null, 1), save: rec };
  }
  // is this text a save of ours? Nothing is touched here: it only answers, with the save made ready for put()
  function fromText(text) {
    const F = D.file, no = (why) => ({ ok: false, why });
    if (typeof text !== 'string' || !text.length) return no('empty');
    if (text.length > F.most) return no('big');
    let o = null; try { o = JSON.parse(text); } catch (e) { return no('not JSON'); }
    if (!o || typeof o !== 'object' || o.game !== F.game || o.kind !== F.kind || o.v !== F.v) return no('not ours');
    if (!o.keys || typeof o.keys !== 'object' || Array.isArray(o.keys)) return no('no keys');
    const keys = {}; let n = 0;
    for (const k in o.keys) {
      const v = o.keys[k];
      if (!isSlotKey(k)) return no('a key that is not the game\'s: ' + k);
      if (typeof v !== 'string' || v.length > F.most) return no('a value that is not the game\'s: ' + k);
      const p = parse(v); if (p == null || typeof p !== 'object') return no('a value that is not the game\'s: ' + k);
      if (k === 'coven.party' && !(p.v === 1 && p.level >= 1)) return no('not a party');
      if (k.indexOf('coven.story.') === 0 && p.v !== 1) return no('not a story');
      keys[k] = v; n++;
    }
    if (!n) return no('no keys');
    const b = {}; for (const k of ['zone', 'part', 'parts', 'level', 'lamps']) if (o.bits && o.bits[k] === +o.bits[k]) b[k] = o.bits[k];
    const pg = /^zone-\d+\.html$/.test(o.page) ? o.page : null, zn = /^zone-\d+$/.test(o.zone) ? o.zone : null;
    const t = Date.parse(o.saved);
    return { ok: true, save: { v: 1, n: 0, made: isFinite(t) ? t : Date.now(), saved: isFinite(t) ? t : Date.now(), page: pg, zone: zn, bits: b, line: '', keys, fromFile: true } };
  }
  function putSave(rec, n) {
    if (!okN(n) || !rec || !rec.keys) return false;
    const r = Object.assign({}, rec, { n }); r.line = line(r);
    if (!put(SLOT(n), r)) return false;
    if (n === state.current) { go(n, false); return 'reload'; }
    return true;
  }

  // ---- the page is ready: put the coven back where she was, and keep saving ----
  function ready(o) {
    W = o.W; page = o.page; zone = o.zone;
    const w = parse(store.get(WHERE));
    if (!TEST && D.keepWhere && W && w && w.page === page && isFinite(w.px) && isFinite(w.py)) {
      try {
        if (w.who && w.who !== W.who && W3D.witch && (W3D.WITCHES || []).some((q) => q.id === w.who)) W.setWho(w.who);
        const at = W.nearestFit(w.px, w.py); if (W.C) W.C.yaw = (w.yaw || 0) + Math.PI; W.setIo(at[0], at[1], w.yaw || 0);
        api.restored = { px: at[0], py: at[1], who: W.who };
      } catch (e) { console.error(e); }
    }
    save('ready');
    if (!TEST) {
      timer = setInterval(() => save('timer'), (D.autosaveSeconds || 20) * 1000);
      document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') save('hidden'); });
      G.addEventListener('pagehide', () => save('closed'));
    }
  }

  const api = W3D.saves = {
    test: TEST, store, storage, isSlotKey, slot, slots, line, bits, save, load, fresh, remove, copy, toFile, fromText, put: putSave, ready,
    get current() { return state.current; }, get failed() { return failed; }, get switching() { return switching; },
    get page() { return page; }, get zone() { return zone; },
    openPage: null, restored: null,
    reopen() { location.reload(); },
  };
})(window);
