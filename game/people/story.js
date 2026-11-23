// story.js: where a zone's story has got to, and which line a person says next (Coven of the Moon Faire, November 23, 2026).
// The lines are the story job's (game/talk/zone-N.js: window.COVEN_TALK_ZN; docs/lore/story-page.md, approved by Chris
// on November 19). This file only chooses among them, by the rules that file sets out:
//   - every key a line's `when` has must be true; a line with more keys is more particular and is chosen first;
//   - a line is said once before any repeats;
//   - a story talk (`talk: [id, n]`) is said in order as one talk;
//   - a `call` is a short word, said by itself when the coven walks right up to someone already met (Chris, November 23:
//     nobody speaks from a distance; the first time the coven walks up to a person, they say their first talk);
//   - the coven's own lines are said once each, at set moments.
// What is particular to a zone is data, in that zone's people file (game/people/zone-N.js: W3D.STORY['zone-N']):
//   talk     the name of the lines (COVEN_TALK_Z2)            key   where the browser keeps this zone's story
//   gate     the fights job's gate fight for the zone          first the moment the zone opens on
//   stages   [{ to, from, when(c) }]: the stage moves on to `to` when `when` is true (only from stage `from`, if given)
//   tellStage { stage: narrator's line }                       tell  [[narrator's line, when(c), again]]
//   moments  [[name, when(c), then(c)]]: the coven's set moments, each once, the first that is due
//   changed(c, stage, was)   what else happens when the stage moves          each(c)   looked at twice a second (someone goes elsewhere)
// `c` is what a rule may ask: c.stage, c.heard(talk or line, without the zone's "z2."), c.won() (the gate fight),
// c.near(place id, metres), c.spot(place id, x, y, metres) (a spot in a place's painting), c.nodes, c.lamps (how many of
// the Grey Hat's lamps are home), c.played(moment),
// c.flag(name, value), c.fights (are there fights on this land), c.people, c.tell(narrator's line).
// What it keeps: the stage, which lines have been heard, who has been talked to, which moments have been played,
// how many road stones are lit (zone 2's `nodes`), and small flags.
// Zone 1 (hub's calls, from the story brief's table): 1 asked, the Grey Hat has asked for his lamps; 2 home, Nettie has
// known Io; 3 fen, Old Wenna has told of the great wraith; 4 after, the great wraith is released.
// Lamps home (zone 1, hub's call): one for every four fights won in the wilds, up to eleven; the twelfth with the great
// wraith. "Green" is levels 1 to 2 and "steady" 3 and up (the lines file's suggestion). "Just won / lost": for two
// minutes after.
//   const story = W3D.story.start({ W, people, zone: 'zone-2' })      story.state(), story.set({ stage }), story.reset()
// To try a later stage: add ?stage=3 to the page's address (it is not kept).
(function (G) {
  'use strict';
  const W3D = G.W3D, TEST = /[?&]test\b/.test(location.search);
  W3D.story = {
    start(o) {
      const W = o.W, people = o.people, Z = W.P, CFG = (W3D.STORY || {})[o.zone || 'zone-1'] || {}, KEY = CFG.key || 'coven.story.v1';
      const T = G[CFG.talk || 'COVEN_TALK_Z1'] || { lines: [], moments: {} }, LINES = T.lines, zone = T.zone || 'z1';
      const fresh = () => ({ v: 1, stage: 0, n: 0, heard: {}, talks: {}, met: {}, moments: {}, said: {}, nodes: 0, flags: {} });
      let S = fresh(); if (!TEST) try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.v === 1) S = Object.assign(fresh(), s); } catch (e) {}
      const save = () => { if (!TEST) try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
      const q = /[?&]stage=(\d)/.exec(location.search), tryStage = q ? +q[1] : null;
      // ---- what the fights know ----
      const party = () => (G.__fights && G.__fights.party) || null, gateId = () => (G.__fights && G.__fights.gate && G.__fights.gate.id) || CFG.gate || 'greatWraith';
      const gateWon = () => { const p = party(); return !!(S.flags.gate || (p && p.gates && p.gates[gateId()])); };   // (flags.gate: a zone with no fights yet lets the gate stand as met)
      const lamps = () => (o.lamps != null ? o.lamps : gateWon() ? 12 : Math.min(11, Math.floor(((party() && party().fights && party().fights.won) || 0) / 4)));
      const look = () => ((party() ? party().level : 1) <= 2 ? 'green' : 'steady');
      let just = null, justT = 0, wonN = -1, lostN = -1, lampN = -1, begun = TEST || !o.waitBegin;
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
        if (w.nodes && ((S.nodes || 0) < w.nodes[0] || (S.nodes || 0) > w.nodes[1])) return false;
        if (w.met && !S.met[w.met]) return false;
        if (w.just && just !== w.just) return false;
        if (w.look && look() !== w.look) return false;
        return true; };
      const heardAt = (u) => S.heard[u.lines[0].id] || 0, keys = (u) => Object.keys(u.when).length;
      // the next talk of a person: an unheard story talk first, then the hello, then a line for this stage alone, then the most particular unheard line (a
      // pointer to someone already met counts as heard); when all are heard, the one heard longest ago
      function linesFor(p) { const us = (UNITS[p.id] || []).filter((u) => fits(u.when, p.id)); if (!us.length) return null;
        const st = stage(), rank = (u) => (u.kind === 'story' ? 0 : u.kind === 'hello' ? 1 : u.when.stage && u.when.stage[0] === st && u.when.stage[1] === st ? 2 : 3);   // (a line that belongs to this stage alone comes before the general ones)
        const fresh2 = us.filter((u) => !heardAt(u) && !(u.kind === 'pointer' && u.to && S.met[u.to]));
        const pick = fresh2.length ? fresh2.sort((a, b) => rank(a) - rank(b) || (rank(a) === 2 ? 0 : keys(b) - keys(a)) || a.i - b.i)[0]
          : us.filter((u) => u.kind !== 'hello').sort((a, b) => heardAt(a) - heardAt(b) || a.i - b.i)[0] || us[0];
        return pick.lines; }
      function callFor(p) { const cs = (CALLS[p.id] || []).filter((l) => fits(l.when || {}, p.id)); if (!cs.length) return null; return cs.sort((a, b) => (S.heard[a.id] || 0) - (S.heard[b.id] || 0))[0]; }
      const heardTalk = (id) => !!(groups[id] && S.heard[groups[id][groups[id].length - 1].id]);
      // ---- what a zone's rules may ask ----
      const parts = {}; for (const p of Z.parts) parts[p.id] = p;
      const dRect = (p, x, z) => (p ? Math.hypot(Math.max(p.x0 - x, 0, x - p.x1), Math.max(p.z0 - z, 0, z - p.z1)) : 1e9);
      let me = people.me();
      const C = { get stage() { return stage(); }, get nodes() { return S.nodes || 0; }, get lamps() { return lamps(); }, get fights() { return !!G.__fights; }, get gate() { return (G.__fights && G.__fights.gate) || null; }, people,
        heard: (id) => heardTalk(zone + '.' + id) || !!S.heard[zone + '.' + id], won: () => gateWon(), played: (m) => !!S.moments[m],
        near: (id, d) => dRect(parts[id], me.x, me.z) < d,
        spot: (id, px, py, d) => { const p = parts[id]; return !!p && Math.hypot(p.ox + p.P.M.x(px) - me.x, p.oz + p.P.M.z(py) - me.z) < d; },
        gateD: () => { const g = G.__fights && G.__fights.gate; return g ? Math.hypot(me.x - g.at[0], me.z - g.at[1]) : 1e9; },
        flag: (k, v) => { if (v !== undefined) { S.flags[k] = v; save(); } return S.flags[k]; }, tell: (k, again) => narrate(k, again) };
      function advance() { const was = S.stage;
        for (const r of CFG.stages || []) if (S.stage < r.to && (r.from == null || S.stage === r.from) && r.when(C)) S.stage = r.to;
        if (S.stage !== was) { for (let k = was + 1; k <= S.stage; k++) if (CFG.tellStage && CFG.tellStage[k]) narrate(CFG.tellStage[k]);
          if (CFG.changed) try { CFG.changed(C, S.stage, was); } catch (e) { console.error(e); }
          if (o.onStage) o.onStage(S.stage, was); }
        return S.stage !== was; }
      function heard(p, said) { for (const l of said) if (!/^standin\./.test(l.id)) S.heard[l.id] = ++S.n; if (p) { S.talks[p.id] = (S.talks[p.id] || 0) + 1; S.met[p.id] = true; } advance(); save(); }
      // ---- the coven's set moments ----
      // (before the coven speaks, the scene is set by the narrator: the story job's narration line when the moment has one;
      // until then a stand-in in words only, from game/people/zone-1.js)
      const NARR = W3D.PEOPLE_NARRATION_STANDIN || {};
      // the narrator's lines (game/people/narration.js), by what each is for
      const NAR = {}; for (const l of ((G.COVEN_NARRATION || {})[zone] || [])) NAR[l.at] = Object.assign({ who: 'narrator', kind: 'narration' }, l);
      // a thing that has happened on the land, to be told when nothing else is being said: once, unless `again`
      const pend = []; const narrate = (key, again) => { if (!NAR[key] || (!again && S.said[key]) || pend.indexOf(key) >= 0) return; if (!again) S.said[key] = true; pend.push(key); save(); };
      function moment(name, then) { const g = groups[zone + '.' + name]; if (!g || S.moments[name] || people.busy() || W.paused) return false; S.moments[name] = true; save();
        const lead = NAR[name] ? [NAR[name]] : !g.some((l) => l.who === 'narrator') && NARR[name] ? [{ id: 'standin.narrator.' + name, who: 'narrator', kind: 'narration', text: NARR[name], secs: Math.max(4, NARR[name].split(/\s+/).length * 0.33) }] : [];
        return people.play(lead.concat(g), null, then ? () => { try { then(C); } catch (e) { console.error(e); } save(); } : null); }
      function watch() { const p = party(); if (p && p.fights) {
          if (wonN >= 0 && p.fights.won > wonN) { just = 'won'; justT = performance.now(); narrate('wisp-released'); }
          if (lostN >= 0 && p.fights.lost > lostN) { just = 'lost'; justT = performance.now(); narrate('woke', true); }
          wonN = p.fights.won; lostN = p.fights.lost;
          // a lamp has come home (the twelfth comes with the great wraith, and is told there)
          const lp = lamps(); if (lampN >= 0 && lp > lampN && lp < 12) { if (!S.said['lamp-first']) narrate('lamp-first'); else if (lp === 11) narrate('lamp-eleven'); else narrate('lamp-again', true); } lampN = lp; }
        if (just && performance.now() - justT > 120000) just = null;
        me = people.me(); if (advance()) save();
        me = people.me();
        if (!begun || people.busy() || W.paused) return;
        const first = CFG.first || 'opening'; if (!S.moments[first] && groups[zone + '.' + first]) return void moment(first);
        if (pend.length) { const k = pend.shift(); return void people.play([NAR[k]], null); }
        if (CFG.each) CFG.each(C);
        for (const t of CFG.tell || []) if (t[1](C)) narrate(t[0], t[2]);
        for (const m of CFG.moments || []) if (!S.moments[m[0]] && groups[zone + '.' + m[0]] && m[1](C)) return void moment(m[0], m[2]); }
      // walked right up to: the first time, their first talk; later, a short word (not more than one in 45 seconds each)
      const lastWord = {};
      people.greet = (p) => { if (!(S.talks[p.id] > 0)) { const ls = linesFor(p); return ls ? { lines: ls } : null; }
        const now = performance.now(); if (now - (lastWord[p.id] || -1e9) < 45000) return null; const c = callFor(p); if (!c) return null; lastWord[p.id] = now; return { lines: [c], short: true }; };
      people.lines = linesFor; people.heard = heard;
      if (!TEST) setInterval(watch, 500);
      const api = { state: () => ({ stage: stage(), kept: S.stage, nodes: S.nodes || 0, flags: Object.assign({}, S.flags), lamps: lamps(), look: look(), just, heard: Object.keys(S.heard).length, talks: Object.assign({}, S.talks), moments: Object.assign({}, S.moments) }),
        set(v) { Object.assign(S, v); save(); return api.state(); }, reset() { S = fresh(); pend.length = 0; save(); return api.state(); },
        begin() { begun = true; }, setNodes(n) { S.nodes = n; advance(); save(); return S.nodes; }, flag: C.flag, ctx: C, cfg: CFG, zone, linesFor, callFor, moment, watch, narrate, pending: () => pend.slice(), narration: NAR, groups, units: UNITS, lines: LINES, setLamps(n) { o.lamps = n; }, setJust(j) { just = j; justT = performance.now(); } };
      G.__story = api; return api;
    },
  };
})(window);
