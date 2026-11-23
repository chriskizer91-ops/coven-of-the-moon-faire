// story.js: where zone 1's story has got to, and which line a person says next (Coven of the Moon Faire, November 23, 2026).
// The lines are the story job's (game/talk/zone-1.js: window.COVEN_TALK_Z1; docs/lore/story-page.md, approved by Chris
// on November 19). This file only chooses among them, by the rules that file sets out:
//   - every key a line's `when` has must be true; a line with more keys is more particular and is chosen first;
//   - a line is said once before any repeats;
//   - a story talk (`talk: [id, n]`) is said in order as one talk;
//   - a `call` is said as the coven walks past, not in a talk;
//   - the coven's own lines are said once each, at set moments.
// What it keeps (in the browser, under 'coven.story.v1'): the stage (0 dusk, 1 asked, 2 home, 3 fen, 4 after), which
// lines have been heard, who has been talked to, and which moments have been played.
// How the stage moves on (hub's call, from the story brief's table):
//   1 asked  the Grey Hat has asked for his lamps (his first talk is said through)
//   2 home   after that, Nettie has known Io (her first talk)
//   3 fen    Old Wenna has told of the great wraith (her story talk)
//   4 after  the great wraith is released (the fights job's gate is won)
// Lamps home (hub's call): one for every four fights won in the wilds, up to eleven; the twelfth with the great wraith.
// "Green" is levels 1 to 2 and "steady" 3 to 5 (the lines file's suggestion). "Just won / lost": for two minutes after.
// The set moments, and what starts each, once: opening (the game begins); cottage (within 34 m of Io's cottage);
// thornwood (within 30 m of the Thornwood); fen (within 60 m of Bogmire); before-wraith (within 40 m of the gate's
// spot, before it is won); after-wraith (back on the land after it is won); leaving (after Europa has sewn the flames).
//   const story = W3D.story.start({ W, people })      story.state(), story.set({ stage }), story.reset()
// To try a later stage: add ?stage=3 to the page's address (it is not kept).
(function (G) {
  'use strict';
  const W3D = G.W3D, KEY = 'coven.story.v1', TEST = /[?&]test\b/.test(location.search);
  W3D.story = {
    start(o) {
      const W = o.W, people = o.people, Z = W.P, T = G.COVEN_TALK_Z1 || { lines: [], moments: {} }, LINES = T.lines, zone = T.zone || 'z1';
      const fresh = () => ({ v: 1, stage: 0, n: 0, heard: {}, talks: {}, met: {}, moments: {} });
      let S = fresh(); if (!TEST) try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) S = Object.assign(fresh(), s); } catch (e) {}
      const save = () => { if (!TEST) try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
      const q = /[?&]stage=(\d)/.exec(location.search), tryStage = q ? +q[1] : null;
      // ---- what the fights know ----
      const party = () => (G.__fights && G.__fights.party) || null, gateId = () => (G.__fights && G.__fights.gate && G.__fights.gate.id) || 'greatWraith';
      const gateWon = () => { const p = party(); return !!(p && p.gates && p.gates[gateId()]); };
      const lamps = () => (o.lamps != null ? o.lamps : gateWon() ? 12 : Math.min(11, Math.floor(((party() && party().fights && party().fights.won) || 0) / 4)));
      const look = () => ((party() ? party().level : 1) <= 2 ? 'green' : 'steady');
      let just = null, justT = 0, wonN = -1, lostN = -1;
      const stage = () => (tryStage != null ? tryStage : S.stage);
      // ---- the lines, gathered: a story talk is one unit, any other line a unit of its own ----
      const groups = {}; for (const l of LINES) if (l.talk) (groups[l.talk[0]] = groups[l.talk[0]] || []).push(l);
      for (const k in groups) groups[k].sort((a, b) => a.talk[1] - b.talk[1]);
      const owner = (id) => { const m = /^z\d\.([a-z]+)\./.exec(id); return m && id.split('.').length > 2 ? m[1] : null; };   // z1.captain.ask -> captain; z1.opening -> nobody
      const UNITS = {}; LINES.forEach((l, i) => { if (l.kind === 'call' || l.kind === 'coven' && !l.talk) return;
        if (l.talk) { if (l.talk[1] !== groups[l.talk[0]][0].talk[1]) return; const ow = owner(l.talk[0]); if (!ow) return; (UNITS[ow] = UNITS[ow] || []).push({ lines: groups[l.talk[0]], when: l.when || {}, kind: 'story', i, talk: l.talk[0] }); }
        else (UNITS[l.who] = UNITS[l.who] || []).push({ lines: [l], when: l.when || {}, kind: l.kind, i, to: l.to || null }); });
      const CALLS = {}; for (const l of LINES) if (l.kind === 'call') (CALLS[l.who] = CALLS[l.who] || []).push(l);
      const fits = (w, pid) => { const st = stage();
        if (w.moment) return false;
        if (w.stage && (st < w.stage[0] || st > w.stage[1])) return false;
        if (w.first != null && ((S.talks[pid] || 0) === 0) !== w.first) return false;
        if (w.lamps && (lamps() < w.lamps[0] || lamps() > w.lamps[1])) return false;
        if (w.met && !S.met[w.met]) return false;
        if (w.just && just !== w.just) return false;
        if (w.look && look() !== w.look) return false;
        return true; };
      const heardAt = (u) => S.heard[u.lines[0].id] || 0, keys = (u) => Object.keys(u.when).length;
      // the next talk of a person: an unheard story talk first, then the hello, then the most particular unheard line (a
      // pointer to someone already met counts as heard); when all are heard, the one heard longest ago
      function linesFor(p) { const us = (UNITS[p.id] || []).filter((u) => fits(u.when, p.id)); if (!us.length) return null;
        const rank = (u) => (u.kind === 'story' ? 0 : u.kind === 'hello' ? 1 : 2);
        const fresh2 = us.filter((u) => !heardAt(u) && !(u.kind === 'pointer' && u.to && S.met[u.to]));
        const pick = fresh2.length ? fresh2.sort((a, b) => rank(a) - rank(b) || keys(b) - keys(a) || a.i - b.i)[0]
          : us.filter((u) => u.kind !== 'hello').sort((a, b) => heardAt(a) - heardAt(b) || a.i - b.i)[0] || us[0];
        return pick.lines; }
      function callFor(p) { const cs = (CALLS[p.id] || []).filter((l) => fits(l.when || {}, p.id)); if (!cs.length) return null; return cs.sort((a, b) => (S.heard[a.id] || 0) - (S.heard[b.id] || 0))[0]; }
      const heardTalk = (id) => !!(groups[id] && S.heard[groups[id][groups[id].length - 1].id]);
      function advance() { const was = S.stage;
        if (S.stage < 1 && heardTalk(zone + '.captain.ask')) S.stage = 1;
        if (S.stage === 1 && heardTalk(zone + '.nettie.hello')) S.stage = 2;
        if (S.stage < 3 && heardTalk(zone + '.wenna.wraith')) S.stage = 3;
        if (S.stage < 4 && gateWon()) S.stage = 4;
        if (S.stage !== was && o.onStage) o.onStage(S.stage, was); return S.stage !== was; }
      function heard(p, said) { for (const l of said) if (!/^standin\./.test(l.id)) S.heard[l.id] = ++S.n; if (p) { S.talks[p.id] = (S.talks[p.id] || 0) + 1; S.met[p.id] = true; } advance(); save(); }
      // ---- the coven's set moments ----
      function moment(name) { const g = groups[zone + '.' + name]; if (!g || S.moments[name] || people.busy() || W.paused) return false; S.moments[name] = true; save(); return people.play(g, null); }
      const parts = {}; for (const p of Z.parts) parts[p.id] = p;
      const dRect = (p, x, z) => (p ? Math.hypot(Math.max(p.x0 - x, 0, x - p.x1), Math.max(p.z0 - z, 0, z - p.z1)) : 1e9);
      function watch() { const p = party(); if (p && p.fights) { if (wonN >= 0 && p.fights.won > wonN) { just = 'won'; justT = performance.now(); } if (lostN >= 0 && p.fights.lost > lostN) { just = 'lost'; justT = performance.now(); } wonN = p.fights.won; lostN = p.fights.lost; }
        if (just && performance.now() - justT > 120000) just = null;
        if (advance()) save();
        if (people.busy() || W.paused) return; const me = people.me(), gate = G.__fights && G.__fights.gate;
        if (!S.moments.opening) return void moment('opening');
        if (gateWon() && !S.moments['after-wraith']) return void moment('after-wraith');
        if (heardTalk(zone + '.captain.sew') && !S.moments.leaving) return void moment('leaving');
        if (!S.moments.cottage && dRect(parts.cottage, me.x, me.z) < 34) return void moment('cottage');
        if (!S.moments.thornwood && dRect(parts.thornwood, me.x, me.z) < 30) return void moment('thornwood');
        if (!S.moments.fen && dRect(parts.bogmire, me.x, me.z) < 60) return void moment('fen');
        if (!S.moments['before-wraith'] && gate && !gateWon() && Math.hypot(me.x - gate.at[0], me.z - gate.at[1]) < 40) return void moment('before-wraith'); }
      people.lines = linesFor; people.call = callFor; people.heard = heard;
      if (!TEST) setInterval(watch, 500);
      const api = { state: () => ({ stage: stage(), kept: S.stage, lamps: lamps(), look: look(), just, heard: Object.keys(S.heard).length, talks: Object.assign({}, S.talks), moments: Object.assign({}, S.moments) }),
        set(v) { Object.assign(S, v); save(); return api.state(); }, reset() { S = fresh(); save(); return api.state(); },
        linesFor, callFor, moment, watch, groups, units: UNITS, lines: LINES, setLamps(n) { o.lamps = n; }, setJust(j) { just = j; justT = performance.now(); } };
      G.__story = api; return api;
    },
  };
})(window);
