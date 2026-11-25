// menu.js: the pause menu (Coven of the Moon Faire, the menu job, November 23, 2026).
// One button on the land opens it (Escape does too, on a laptop) and pauses the game: the land, the story, the talk and
// the sound. It is one full screen with a row of tabs: Save, Maps, Coven, Settings. Closing it carries on.
//
// Other jobs add tabs:
//   W3D.menu.addTab({ id, label, order, mount(el, ctx), unmount() })
//       el     the tab's own panel, filling the screen under the tab row. The same element each time the tab is shown;
//              it is hidden while another tab is shown, and what is in it is the tab's to keep or clear
//       ctx    { W, zone, close() }   W: the walker (the page's W3D.walk); zone: 'zone-1' and so on; close(): closes
//              the menu. (Also ctx.page: 'zone-1.html'.)
//       mount is called each time the tab is shown, unmount each time it is left or the menu closes, so a tab that draws
//       in 3D stops drawing and frees what it holds. A tab added with an id already there takes its place (the maps
//       job's 'maps' takes the place of the stand-in line). order: Save 10, Maps 20, Coven 30, Settings 40
//   W3D.menu.open(tabId)   opens the menu at that tab (or the last one shown), or moves to it. false if it cannot open
//                          yet (the page is still starting) or a fight is on
//   W3D.menu.close(), W3D.menu.isOpen()
//   window events 'coven:menu-open' (detail.tab) and 'coven:menu-close'
//   W3D.menu.viewer        left null: the place kept for a full character viewer. Set it to (el, witch, ctx) => ...
//                          and each witch in the Coven tab gets a "Look closer" button that opens it in the tab
//
// The page calls W3D.menu.start({ page: 'zone-1.html', zone: 'zone-1' }) once, in its marked block, before its own
// start-up script. The menu joins the page when the page says it is ready (window.__ready).
// While a fight is on, the menu does not open and Escape is left to the fight (and to the maps job's "choose where to
// fly" while it is up). If someone is speaking, their voice is
// paused with everything else and carries on from where it stopped when the menu closes.
// The words are in menu-words.js; the keys and the calls in menu-data.js; the save slots in saves.js.
(function (G) {
  'use strict';
  const W3D = G.W3D = G.W3D || {}, D = W3D.MENU_DATA, T = W3D.MENU_WORDS;
  const S = () => W3D.saves;
  const TEST = /[?&]test\b/.test(location.search);
  const fill = (s, o) => String(s).replace(/\{(\w+)\}/g, (m, k) => (o && o[k] != null ? o[k] : m));
  const mk = (tag, cls, parent, text) => { const e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; if (parent) parent.appendChild(e); return e; };
  const btn = (cls, parent, text, tap) => { const b = mk('button', 'cm-b' + (cls ? ' ' + cls : ''), parent, text); b.type = 'button'; if (tap) b.addEventListener('click', tap); return b; };
  const parse = (s) => { try { return s == null ? null : JSON.parse(s); } catch (e) { return null; } };
  const nf = (n) => Math.round(n).toLocaleString('en-US');

  // ---- sound: every <audio> that plays, and every Web Audio context, is known, so the menu can pause them all ----
  const media = new Set(), contexts = new Set();
  try {
    const play0 = G.HTMLMediaElement.prototype.play;
    G.HTMLMediaElement.prototype.play = function () {
      media.add(this);
      if (media.size > 48) for (const m of media) if (m.paused || m.ended) media.delete(m);
      return play0.apply(this, arguments);
    };
  } catch (e) { /* no audio elements here */ }
  try {
    for (const name of ['AudioContext', 'webkitAudioContext']) {
      const AC = G[name]; if (typeof AC !== 'function') continue;
      G[name] = class extends AC { constructor(...a) { super(...a); contexts.add(this); } };
    }
  } catch (e) { /* Web Audio as it was */ }
  let heldMedia = [], heldCtx = [];
  function hush() {
    heldMedia = []; heldCtx = [];
    for (const m of media) { if (!m.paused && !m.ended) { try { m.pause(); heldMedia.push(m); } catch (e) { /* gone */ } } else if (m.ended) media.delete(m); }
    for (const c of contexts) if (c.state === 'running') { try { c.suspend(); heldCtx.push(c); } catch (e) { /* gone */ } }
  }
  function unhush() {
    for (const m of heldMedia) { try { const p = m.play(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* gone */ } }
    for (const c of heldCtx) { try { const p = c.resume(); if (p && p.catch) p.catch(() => {}); } catch (e) { /* gone */ } }
    heldMedia = []; heldCtx = [];
  }

  // ---- the tabs ----
  const tabs = new Map();
  let W = null, page = null, zone = null, ready = false, isOpen = false, cur = null, mounted = false, last = 'save', wasPaused = false;
  let root = null, tabRow = null, body = null, askBox = null, noteEl = null, landBtn = null, beginEl = null, asking = null, noteT = 0;
  const sorted = () => [...tabs.values()].sort((a, b) => a.order - b.order || (a.id < b.id ? -1 : 1));
  const ctx = () => ({ W, zone, page, close: () => close() });
  function addTab(t) {
    if (!t || typeof t.id !== 'string' || !t.id) throw new Error('W3D.menu.addTab: a tab needs an id');
    if (typeof t.mount !== 'function') throw new Error('W3D.menu.addTab: the tab ' + t.id + ' needs mount(el, ctx)');
    const old = tabs.get(t.id), shown = isOpen && cur === t.id;
    if (shown) leave();
    if (old && old.pane) old.pane.remove();
    tabs.set(t.id, { id: t.id, label: String(t.label != null ? t.label : t.id), order: isFinite(+t.order) ? +t.order : 100, mount: t.mount, unmount: typeof t.unmount === 'function' ? t.unmount : null, pane: null });
    drawTabs();
    if (shown) show(t.id);
    return true;
  }
  function removeTab(id) {
    const t = tabs.get(id); if (!t) return false;
    if (isOpen && cur === id) { leave(); cur = null; }
    if (t.pane) t.pane.remove(); tabs.delete(id); drawTabs();
    if (isOpen && !cur) show(sorted()[0] && sorted()[0].id);
    return true;
  }
  function drawTabs() {
    if (!tabRow) return;
    tabRow.innerHTML = '';
    for (const t of sorted()) {
      const b = mk('button', 'cm-tab', tabRow, t.label); b.type = 'button'; b.dataset.tab = t.id; b.setAttribute('role', 'tab');
      b.setAttribute('aria-selected', String(isOpen && cur === t.id));
      b.addEventListener('click', () => show(t.id));
    }
  }
  function leave() {
    if (!cur) return;
    const t = tabs.get(cur);
    if (mounted && t && t.unmount) { try { t.unmount(); } catch (e) { console.error(e); } }
    mounted = false;
    if (t && t.pane) t.pane.hidden = true;
  }
  function show(id) {
    const t = tabs.get(id) || tabs.get(last) || sorted()[0]; if (!t) return;
    if (cur === t.id && mounted) return;
    leave(); cur = t.id; last = t.id;
    for (const b of tabRow.children) b.setAttribute('aria-selected', String(b.dataset.tab === t.id));
    if (!t.pane) { t.pane = mk('div', 'cm-pane', body); t.pane.dataset.tab = t.id; t.pane.setAttribute('role', 'tabpanel'); }
    t.pane.hidden = false; mounted = true;
    try { t.mount(t.pane, ctx()); } catch (e) { console.error(e); t.pane.textContent = ''; mk('p', 'cm-p cm-pad', t.pane, fill(T.tabBroke, { why: e && e.message ? e.message : String(e) })); }
  }

  // ---- opening and closing ----
  const fighting = () => !!((G.CovenBattle && G.CovenBattle.running) || (G.__fights && G.__fights.busy));
  function open(tabId) {
    if (!ready || !root || fighting() || S().switching) return false;
    if (!isOpen) {
      S().save('menu');
      wasPaused = !!W.paused; W.pause(true); hush();
      isOpen = true; root.hidden = false; document.documentElement.classList.add('cm-is-open');
      show(tabId && tabs.has(tabId) ? tabId : last);
      try { root.focus({ preventScroll: true }); } catch (e) { /* fine */ }
      G.dispatchEvent(new CustomEvent('coven:menu-open', { detail: { tab: cur } }));
    } else show(tabId && tabs.has(tabId) ? tabId : cur);
    return true;
  }
  function close() {
    if (!isOpen) return false;
    endAsk(null); leave();
    isOpen = false; root.hidden = true; document.documentElement.classList.remove('cm-is-open');
    W.pause(wasPaused); unhush();
    G.dispatchEvent(new CustomEvent('coven:menu-close', { detail: { tab: cur } }));
    return true;
  }

  // ---- a question asked first, inside the menu: big buttons, Escape or "No" says no ----
  function ask(text, choices) {
    endAsk(null); noteEl.classList.remove('cm-on');
    return new Promise((done) => {
      askBox.innerHTML = ''; askBox.hidden = false;
      const box = mk('div', 'cm-askbox', askBox); box.setAttribute('role', 'alertdialog');
      mk('p', 'cm-p', box, text);
      const row = mk('div', 'cm-askrow', box);
      for (const c of choices) btn((c.main ? 'cm-main' : '') + (c.warn ? ' cm-warn' : ''), row, c.label, () => endAsk(c.value)).dataset.ask = String(c.value);
      asking = done;
    });
  }
  function endAsk(v) { if (!asking) return; const d = asking; asking = null; askBox.hidden = true; askBox.innerHTML = ''; d(v); }
  const yesNo = (text, yes) => ask(text, [{ label: yes, value: true, warn: true }, { label: T.no, value: false, main: true }]);
  // a short message along the foot of the menu
  function note(text) { noteEl.textContent = text; noteEl.classList.add('cm-on'); clearTimeout(noteT); noteT = setTimeout(() => noteEl.classList.remove('cm-on'), 4500); root.dataset.note = text; }

  // ---- the Save tab ----
  let copying = 0;
  const when = (t) => {
    const m = Math.floor((Date.now() - t) / 60000);
    if (m < 1) return T.savedNow; if (m < 60) return fill(m === 1 ? T.savedMin : T.savedMins, { n: m });
    const d = new Date(t), two = (v) => (v < 10 ? '0' : '') + v;
    return fill(T.savedAt, { date: d.getDate() + ' ' + T.months[d.getMonth()], time: two(d.getHours()) + ':' + two(d.getMinutes()) });
  };
  const dateOf = (t) => { const d = new Date(t), two = (v) => (v < 10 ? '0' : '') + v; return { date: d.getDate() + ' ' + T.months[d.getMonth()], time: two(d.getHours()) + ':' + two(d.getMinutes()) }; };
  function scroller(el, wide) { el.innerHTML = ''; const sc = mk('div', 'cm-scroll', el); return mk('div', 'cm-col' + (wide ? ' cm-wide' : ''), sc); }
  function saveTab(el) {
    const s = S(), col = scroller(el, true), n0 = s.current;
    if (s.test) mk('p', 'cm-small', col, T.keptTest);
    else if (s.storage.ok === false) mk('p', 'cm-warnbox', col, T.noStorage).dataset.k = 'no-storage';
    if (s.failed) mk('p', 'cm-warnbox', col, T.saveFailed);
    const grid = mk('div', 'cm-slots', col);
    for (let n = 1; n <= (D.slots || 3); n++) {
      const rec = s.slot(n), inUse = n === n0, card = mk('div', 'cm-card' + (inUse ? ' cm-use' : '') + (rec ? '' : ' cm-empty'), grid);
      card.dataset.slot = n;
      const head = mk('div', 'cm-head', card); mk('b', '', head, fill(T.slot, { n })); if (inUse) mk('span', 'cm-badge', head, T.inUse);
      mk('div', 'cm-line', card, rec ? s.line(rec) : T.empty);
      mk('div', 'cm-when', card, rec ? when(rec.saved) + (rec.page && page && rec.page !== page && rec.bits && rec.bits.zone ? T.sep + fill(T.lastOn, { n: rec.bits.zone }) : '') : ' ');
      const acts = mk('div', 'cm-acts', card);
      const targets = []; for (let m = 1; m <= (D.slots || 3); m++) if (m !== n && m !== n0) targets.push(m);
      if (copying === n && rec) {
        for (const m of targets) btn('cm-main', acts, fill(T.copyTo, { slot: fill(T.slot, { n: m }) }), async () => {
          if (s.slot(m) && !(await yesNo(fill(T.askCopyOver, { from: n, to: m }), T.yesCopy))) return;
          copying = 0; if (s.copy(n, m)) note(fill(T.copied, { from: n, to: m })); saveTab(el);
        }).dataset.act = 'copy-to-' + m;
        btn('', acts, T.back, () => { copying = 0; saveTab(el); }).dataset.act = 'back';
        continue;
      }
      if (inUse) btn('cm-main', acts, T.carryOn, () => close()).dataset.act = 'carry-on';
      else if (rec) btn('cm-main', acts, T.continue, () => { if (s.load(n) === 'test') saveTab(el); }).dataset.act = 'continue';
      btn(rec ? '' : 'cm-span', acts, T.newGame, async () => {
        const q = inUse ? fill(T.askNewHere, { n }) : fill(T.askNewThere, { n, cur: n0 });
        if (await yesNo(q, T.yesNew)) { if (s.fresh(n) === 'test') saveTab(el); }
      }).dataset.act = 'new';
      if (rec && targets.length) btn('', acts, T.copy, () => { copying = n; saveTab(el); }).dataset.act = 'copy';
      if (rec && !inUse) btn('cm-warn', acts, T.delete, async () => {
        if (await yesNo(fill(T.askDelete, { n }), T.yesDelete)) { if (s.remove(n)) note(fill(T.deleted, { n })); saveTab(el); }
      }).dataset.act = 'delete';
    }
    // the file: out and in
    const files = mk('div', 'cm-files', col);
    btn('', files, T.toFile, () => {
      const f = s.toFile(); if (!f) return;
      const url = URL.createObjectURL(new Blob([f.text], { type: 'application/json' })), a = mk('a', '', document.body);
      a.href = url; a.download = f.name; a.click(); setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 5000);
      note(fill(T.fileSaved, { name: f.name })); root.dataset.file = f.name; saveTab(el);
    }).dataset.act = 'to-file';
    const pick = mk('input', 'cm-hide', files); pick.type = 'file';   // (any file may be picked: some phones grey out a .json when told what to accept; every file is checked here)
    btn('', files, T.fromFile, () => { pick.value = ''; pick.click(); }).dataset.act = 'from-file';
    pick.addEventListener('change', () => { const f = pick.files && pick.files[0]; if (f) fromFile(f, el); });
    mk('p', 'cm-small', col, T.fileNote);
    mk('p', 'cm-small', col, fill(T.autoNote, { n: D.autosaveSeconds || 20 }));
    if (!s.test && s.storage.ok && s.storage.first) { const d = dateOf(s.storage.first); mk('p', 'cm-small', col, fill(T.kept, { date: d.date + ', ' + d.time, n: s.storage.visits })); }
  }
  async function fromFile(f, el) {
    const s = S(); let text = '';
    if (f.size > D.file.most) { root.dataset.fileWhy = 'big'; note(T.fileBig); return; }
    try { text = await f.text(); } catch (e) { text = ''; }
    const r = s.fromText(text);
    root.dataset.fileWhy = r.ok ? 'ok' : r.why;
    if (!r.ok) { note(T.fileWrong); return; }
    const d = dateOf(r.save.saved), n0 = s.current, choices = [];
    for (let n = 1; n <= (D.slots || 3); n++) choices.push({ label: fill(T.slot, { n }) + (n === n0 ? ' (' + T.inUse + ')' : s.slot(n) ? '' : ' (' + T.empty.toLowerCase() + ')'), value: n, main: !s.slot(n) });
    choices.push({ label: T.cancel, value: 0 });
    const n = await ask(fill(T.fileWhere, { line: s.line(r.save), date: d.date, time: d.time }), choices);
    if (!n) return;
    if (n === n0) { if (!(await yesNo(fill(T.fileOverPlaying, { n }), T.yesPut))) return; }
    else if (s.slot(n) && !(await yesNo(fill(T.fileOver, { n }), T.yesPut))) return;
    const ok = s.put(r.save, n);
    if (ok === true) { note(fill(T.filePut, { n })); saveTab(el); } else if (ok === 'test' || s.test) saveTab(el);
  }

  // ---- the Maps tab, a stand-in line until the maps job's tab takes its place ----
  function mapsTab(el) { const col = scroller(el); mk('p', 'cm-p cm-soon', col, T.mapsSoon); }

  // ---- the Coven tab: who leads, at the top (the leader job, November 25); then the four witches, each one's level and
  // health (read from the party, never changed) ----
  // Who leads: four big buttons, one for each witch, with her own colour (menu-data.js, leader.colours) and her name. The one
  // leading is marked. Choosing another changes the one walking at once, where she stood and facing as she faced (the
  // walker's setWho), and keeps her as the leader (saves.js); the menu stays open. The arrow keys move between the four
  let leadBusy = false;
  function leadStrip(col, el) {
    const four = W3D.WITCHES || [{ id: 'io', name: 'Io', is: '', key: 'io' }], who = W && W.who, LD = D.leader || {}, colours = LD.colours || {};
    const box = mk('section', 'cm-lead', col); box.dataset.place = 'leader';
    mk('h2', 'cm-h', box, T.leadTitle);
    mk('p', 'cm-small cm-leadnote', box, T.leadNote);
    const row = mk('div', 'cm-leadrow', box); row.setAttribute('role', 'radiogroup'); row.setAttribute('aria-label', T.leadTitle);
    const bs = [];
    for (const w of four) {
      const on = who === w.id, b = mk('button', 'cm-leadb' + (on ? ' cm-on' : ''), row); b.type = 'button';
      b.dataset.act = 'walk-' + w.id; b.dataset.leader = w.id; b.setAttribute('role', 'radio'); b.setAttribute('aria-checked', String(on));
      b.tabIndex = on || (!four.some((q) => q.id === who) && w === four[0]) ? 0 : -1;
      b.style.setProperty('--her', colours[w.id] || '#8a80c8');
      const disc = mk('span', 'cm-disc', b); disc.setAttribute('aria-hidden', 'true'); disc.textContent = w.name.charAt(0);
      const t = mk('span', 'cm-leadtext', b); mk('b', '', t, w.name); mk('small', 'cm-leadis', t, w.is || '');
      mk('span', 'cm-leadstate', b, on ? T.leading : T.leadTap);
      b.setAttribute('aria-label', w.name + (w.is ? ', ' + w.is : '') + (on ? ': ' + T.leading : ''));
      b.addEventListener('click', () => lead(w, b, el));
      bs.push(b);
    }
    row.addEventListener('keydown', (e) => {
      const i = bs.indexOf(document.activeElement); if (i < 0) return;
      const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; let j = -1;
      if (step) j = (i + step + bs.length) % bs.length; else if (e.key === 'Home') j = 0; else if (e.key === 'End') j = bs.length - 1;
      if (j < 0) return;
      e.preventDefault(); e.stopPropagation(); bs[i].tabIndex = -1; bs[j].tabIndex = 0; bs[j].focus();
    });
    return bs;
  }
  // choose her: the walker swaps the model where she stands (built the first time she is chosen, which takes a moment)
  function lead(w, b, el) {
    if (!W || leadBusy || W.who === w.id) return;
    leadBusy = true; b.classList.add('cm-busy'); b.setAttribute('aria-busy', 'true');
    const st = b.querySelector('.cm-leadstate'); if (st) st.textContent = T.leadBusy;
    const was = (W3D.WITCHES || []).find((q) => q.id === W.who);
    setTimeout(() => {
      let ok = true; try { W.setWho(w.id); } catch (er) { console.error(er); ok = false; }
      leadBusy = false;
      if (isOpen && cur === 'coven') covenTab(el, w.id);
      note(ok && W.who === w.id ? fill(T.leadNow, { name: w.name }) : fill(T.leadFailed, { name: w.name, now: was ? was.name : '' }));
    }, 30);
  }
  function covenTab(el, focusId) {
    const col = scroller(el, true), live = G.__fights && G.__fights.party, kept = parse(S().store.get('coven.party'));
    const level = live ? live.level : kept && kept.level >= 1 ? Math.round(kept.level) : 1;
    const bs = leadStrip(col, el);
    if (focusId) { const f = bs.find((b) => b.dataset.leader === focusId); if (f) try { f.focus({ preventScroll: true }); } catch (e) { /* fine */ } }
    mk('h2', 'cm-h cm-h2', col, fill(T.covenTitle, { n: level }));
    if (!live) mk('p', 'cm-small', col, T.covenNoParty);
    const grid = mk('div', 'cm-witches', col), who = W && W.who;
    const four = W3D.WITCHES || [{ id: 'io', name: 'Io', is: '', key: 'io' }], colours = (D.leader && D.leader.colours) || {};
    const viewerEl = mk('div', 'cm-viewer'); viewerEl.dataset.place = 'character-viewer';
    for (const w of four) {
      const id = w.key || w.id, card = mk('div', 'cm-card cm-witch' + (who === w.id ? ' cm-use' : ''), grid); card.dataset.witch = w.id;
      card.style.setProperty('--her', colours[w.id] || '#8a80c8');
      const head = mk('div', 'cm-head', card); mk('b', '', head, w.name);
      // leader: the one leading says so on her card (the choosing is in the strip above)
      if (who === w.id) mk('span', 'cm-badge cm-walking', head, T.leadBadge); else mk('span', 'cm-is', head, w.is || '');
      mk('div', 'cm-lv', card, fill(T.level, { n: level }).replace(/^./, (c) => c.toUpperCase()));
      const bar = (cls, a, b, words) => { const r = mk('div', 'cm-stat', card); mk('span', '', r, words); const g = mk('div', 'cm-bar ' + cls, card); mk('i', '', g).style.width = (b ? Math.max(0, Math.min(100, 100 * a / b)) : 100).toFixed(0) + '%'; };
      if (live && live.maxHp) {
        const hp = live.hp(id), mh = live.maxHp(id), mm = live.maxMp(id);
        bar('cm-hp' + (hp / mh < 0.25 ? ' cm-low' : ''), hp, mh, fill(T.hp, { a: nf(hp), b: nf(mh) }));
        if (mm) bar('cm-mp', live.mp(id), mm, fill(T.mp, { a: nf(live.mp(id)), b: nf(mm) }));
      } else {
        const h = kept && kept.hp && kept.hp[id] != null ? kept.hp[id] : null;
        mk('div', 'cm-stat', card, h == null ? T.whole : fill(T.hurtNoMax, { a: nf(h) }));
      }
      if (typeof api.viewer === 'function') { const acts = mk('div', 'cm-acts', card); btn('cm-span', acts, T.look, () => { viewerEl.innerHTML = ''; try { api.viewer(viewerEl, w.id, ctx()); } catch (er) { console.error(er); } }).dataset.act = 'look-' + w.id; }
    }
    // the place kept for a full character viewer (later): its own box under the four
    col.appendChild(viewerEl);
    if (typeof api.viewer !== 'function') mk('p', 'cm-small cm-soon', viewerEl, T.viewerSoon);
  }

  // ---- the Settings tab: the switches the land had, now in one place ----
  const settings = { nums: false };
  const keepSettings = () => S().store.set('coven.settings', JSON.stringify(settings));
  function setNums(on) {
    settings.nums = !!on;
    const n = document.getElementById('numbers'); if (n) n.classList.toggle('more', settings.nums);
    const b = document.getElementById('nums'); if (b) b.classList.toggle('on', settings.nums);
  }
  function settingsTab(el) {
    const col = scroller(el);
    const row = (key, label, sub, on, tap) => {
      const b = mk('button', 'cm-row', col); b.type = 'button'; b.dataset.set = key; b.setAttribute('role', 'switch'); b.setAttribute('aria-checked', String(!!on));
      const t = mk('span', 'cm-rowtext', b); mk('b', '', t, label); mk('small', '', t, sub);
      mk('span', 'cm-switch' + (on ? ' cm-on' : ''), b, on ? T.on : T.off);
      b.addEventListener('click', tap); return b;
    };
    const numsOn = !!(document.getElementById('numbers') && document.getElementById('numbers').classList.contains('more'));
    row('nums', T.numbers, T.numbersNote, numsOn, () => { setNums(!numsOn); keepSettings(); settingsTab(el); });
    if (W && W.setLook && W.look && G.makeFlipbook) {
      const flip = !!W.look.flip;
      row('flip', T.flip, T.flipNote, flip, () => { W.setLook({ flip: !flip }); settingsTab(el); });
      if (flip) {
        const box = mk('div', 'cm-fine', col); mk('b', '', box, T.fine);
        const r = mk('input', '', box); r.type = 'range'; r.min = 160; r.max = 720; r.step = 20; r.value = W.look.rows; r.dataset.set = 'fine'; r.setAttribute('aria-label', T.fine);
        r.addEventListener('input', () => W.setLook({ rows: +r.value }));
        const ends = mk('small', '', box); mk('span', '', ends, T.chunky); mk('span', '', ends, T.veryFine);
      }
    }
    if (G.BattleScreen) {
      const now = +S().store.get(D.sharp.key), v = D.sharp.choices.indexOf(now) >= 0 ? now : D.sharp.start;
      const box = mk('div', 'cm-seg', col), t = mk('span', 'cm-rowtext', box); mk('b', '', t, T.sharp); mk('small', '', t, T.sharpNote);
      const seg = mk('div', 'cm-segrow', box);
      for (const c of D.sharp.choices) { const b = btn(c === v ? 'cm-main' : '', seg, T.sharpNames[c] || String(c), () => { S().store.set(D.sharp.key, String(c)); settingsTab(el); }); b.dataset.set = 'sharp-' + c; b.setAttribute('aria-pressed', String(c === v)); }
    }
  }

  // ---- the Begin screen: under the Begin button, small, the slot in use and its line, and the way to the Save tab ----
  function beginLine() {
    if (!beginEl) return;
    const s = S(), n = s.current, rec = s.slot(n), st = G.__story && G.__story.state ? G.__story.state() : null, first = ((W3D.STORY || {})[zone] || {}).first;
    const fresh = !rec || (st && first && !st.moments[first] && !(rec.bits && rec.bits.level > 1));
    beginEl.querySelector('span').textContent = fill(T.beginSlot, { n }) + T.sep + (fresh ? T.beginNew : s.line(rec));
  }

  // ---- joining the page ----
  function build() {
    root = mk('div', 'cm', document.body); root.id = 'cmMenu'; root.hidden = true; root.tabIndex = -1;
    root.setAttribute('role', 'dialog'); root.setAttribute('aria-modal', 'true'); root.setAttribute('aria-label', T.button);
    const top = mk('div', 'cm-top', root);
    tabRow = mk('div', 'cm-tabs', top); tabRow.setAttribute('role', 'tablist');
    const x = mk('button', 'cm-x', top); x.type = 'button'; x.setAttribute('aria-label', T.close);
    x.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';
    x.addEventListener('click', () => close());
    body = mk('div', 'cm-body', root);
    askBox = mk('div', 'cm-ask', root); askBox.hidden = true;
    noteEl = mk('div', 'cm-note', root); noteEl.setAttribute('aria-live', 'polite');
    // the one button on the land, top right
    const world = document.getElementById('world') || document.body;
    landBtn = mk('button', 'cm-btn', world); landBtn.id = 'cmBtn'; landBtn.type = 'button'; landBtn.setAttribute('aria-label', T.button);
    landBtn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="#eee8ff" stroke-width="1.9" stroke-linecap="round"><path d="M5 7h14M5 12h14M5 17h14"/></svg>';
    for (const ev of ['pointerdown', 'touchstart', 'mousedown']) landBtn.addEventListener(ev, (e) => e.stopPropagation());
    landBtn.addEventListener('click', () => open());
    // the Begin screen's line (only when the page shows it: not with ?test)
    const b = document.getElementById('begin');
    if (b && getComputedStyle(b).display !== 'none' && b.firstElementChild) {
      beginEl = mk('div', 'cm-begin', b.firstElementChild); mk('span', '', beginEl);
      const go = mk('button', '', beginEl, T.beginGo); go.type = 'button'; go.id = 'cmBeginGo'; go.addEventListener('click', (e) => { e.stopPropagation(); open('save'); });
      beginLine();
    }
    drawTabs();
  }
  function onReady() {
    if (ready) return;
    W = G.__w3d; if (!W) return;
    S().ready({ W, page, zone });
    if (!TEST) { const k = parse(S().store.get('coven.settings')); if (k && k.nums) setNums(true); }
    build(); ready = true;
    G.addEventListener('coven:saved', () => beginLine());
  }
  // Escape opens and closes it (a question open: Escape says no). Left alone while a fight is on: the fight uses it
  G.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.repeat || !ready) return;
    if (asking) { endAsk(false); e.preventDefault(); return; }
    if (isOpen) { close(); e.preventDefault(); return; }
    // left alone too while the maps job's full-screen "choose where to fly" is up: it uses Escape to back out
    if (fighting() || (W3D.maps && W3D.maps.world && W3D.maps.world.choosing)) return;
    if (open()) e.preventDefault();
  });
  function start(o) {
    page = o.page; zone = o.zone;
    if (D.oneButton) document.documentElement.classList.add('cm-one');
    // the page says it is ready by setting window.__ready: the menu joins it then, in the same moment
    if (G.__ready) { setTimeout(onReady, 0); return; }
    let v = G.__ready;
    try {
      Object.defineProperty(G, '__ready', { configurable: true, enumerable: true, get: () => v,
        set: (x) => { v = x; if (!x) return; Object.defineProperty(G, '__ready', { configurable: true, enumerable: true, writable: true, value: x }); try { onReady(); } catch (e) { console.error(e); G.__menuErr = String(e && e.stack || e); } } });
    } catch (e) { const t = setInterval(() => { if (G.__ready) { clearInterval(t); onReady(); } }, 200); }
  }

  // the menu's own four tabs (Maps a stand-in line until the maps job adds its own with the id 'maps')
  addTab({ id: 'save', label: T.tabs.save, order: D.tabs.save, mount: (el) => { copying = 0; saveTab(el); } });
  addTab({ id: 'maps', label: T.tabs.maps, order: D.tabs.maps, mount: mapsTab });
  addTab({ id: 'coven', label: T.tabs.coven, order: D.tabs.coven, mount: covenTab });
  addTab({ id: 'settings', label: T.tabs.settings, order: D.tabs.settings, mount: settingsTab });
  G.addEventListener('coven:saves-switched', () => { if (isOpen && cur === 'save') { const t = tabs.get('save'); if (t && t.pane) saveTab(t.pane); } beginLine(); });

  const api = W3D.menu = {
    addTab, removeTab, open, close, isOpen: () => isOpen, start,
    get tab() { return isOpen ? cur : null; }, tabs: () => sorted().map((t) => t.id),
    get ready() { return ready; }, viewer: null,
  };
})(window);
