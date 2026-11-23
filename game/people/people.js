// people.js: the people who stand in the land, and talking to them (Coven of the Moon Faire, November 19 to 23, 2026).
// The bodies are Moon Faire's painted fair folk (game/people/folk/, MF_NPC). Who stands where is data
// (game/people/zone-1.js). What they say is data too: the story job's lines (game/talk/), chosen by game/people/story.js.
//   const people = await W3D.people.start({ W, root, zone: 'zone-1' })
//     W: the walker (W3D.walk's). root: the element the button and the words go in.
//   people.lines = (person) => [{ id, who, text, secs }]   the lines of that person's next talk (left unset: stand-ins)
//   people.greet = (person) => { lines, short } or nothing  what they say by themselves when the coven walks right up
//   people.heard = (person or null, lines)                   told when a talk has been said through
//   people.play(lines, person or null, then)                 say these lines now (a talk, or the coven at a set moment)
//   people.voice = (id) => the sound for a line, as something an <audio> can play (left unset: window.COVEN_VOICE[id])
// A person is only built when the coven first comes within 75 m (one at a time), is only drawn within 58 m, and only
// moves within 42 m.
// Nobody speaks from a distance (Chris, November 23). A person speaks only when the coven walks right up to them, to
// arm's length (1.5 m): the first time, they say their first talk by themselves; on a later visit, a short word
// (people.greet decides which). Within 2.3 m a Talk button shows at the foot of the screen, for more; E or Enter
// does the same. (A shout from far off, for the story's sake, would be its own thing: people.play.)
// A line whose speaker is `narrator` is shown as narration: no name, set apart.
// The words show just over the button, with the speaker's name: each line has its own speaker (`who`).
// people.move(id, spot) sends someone to stand somewhere else, once the coven is 62 m off or more.
// For checks: window.__people = { list, near(), talk(id), say(), tick(), ready(), move(id, spot, now) }.
(function (G) {
  'use strict';
  const W3D = G.W3D, TEST = /[?&]test\b/.test(location.search);
  W3D.people = {
    async start(o) {
      const W = o.W, Z = W.P, L = Z.land, M = Z.M, D = W3D.PEOPLE[o.zone], scene = Z.scene, root = o.root;
      const standIn = W3D.PEOPLE_STANDIN || {}, cast = G.COVEN_CAST || {};
      const ground = (x, z) => Z.walkH(M.px(x), M.py(z));
      // ---- where each stands ----
      const spot = (d) => { const p = {};
        if (d.camp) { p.x = D.camp[0] + d.camp[0]; p.z = D.camp[1] + d.camp[1]; p.lookX = D.camp[0]; p.lookZ = D.camp[1]; }
        else if (d.road) { const r = L.roadList.find((q) => q.name === d.road[0]), q = r.pts; let len = 0; for (let i = 1; i < q.length; i++) len += Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]);
          let want = len * d.road[1]; for (let i = 1; i < q.length; i++) { const s = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]); if (want <= s || i === q.length - 1) { const t = Math.min(1, want / s), ux = (q[i][0] - q[i - 1][0]) / s, uz = (q[i][1] - q[i - 1][1]) / s, cx = q[i - 1][0] + ux * s * t, cz = q[i - 1][1] + uz * s * t; p.x = cx - uz * d.road[2]; p.z = cz + ux * d.road[2]; p.lookX = cx; p.lookZ = cz; break; } want -= s; } }
        else if (d.place) { const part = Z.parts.find((q) => q.id === d.place[0]), PM = part.P.M; p.x = part.ox + PM.x(d.place[1]); p.z = part.oz + PM.z(d.place[2]);
          // (a spot that cannot be stood on: the nearest that can)
          if (!Z.walkable(M.px(p.x), M.py(p.z))) { const f = W.nearestFit(M.px(p.x), M.py(p.z)); p.x = M.x(f[0]); p.z = M.z(f[1]); p.moved = true; }
          p.lookX = d.look ? part.ox + PM.x(d.look[0]) : p.x; p.lookZ = d.look ? part.oz + PM.z(d.look[1]) : p.z + 1; }
        else { p.x = d.at[0]; p.z = d.at[1]; p.lookX = p.x; p.lookZ = p.z + 1; }
        return p; };
      const list = D.people.map((d) => Object.assign({ npc: null, making: false, d: 1e9, far: true, standN: 0 }, d, spot(d)));
      for (const p of list) p.blk = { x: p.x, z: p.z, r: 0.42 }; L.addBlockers(list.map((p) => p.blk));
      // someone goes to stand somewhere else (the Grey Hat, from the camp to the shipyard): done when the coven is too far off to see it
      const settle = (p) => { Object.assign(p, spot(p.want)); p.want = null; p.blk.x = p.x; p.blk.z = p.z; if (p.npc) { p.npc.root.position.set(p.x, ground(p.x, p.z), p.z); p.npc.root.rotation.y = Math.atan2(p.lookX - p.x, p.lookZ - p.z); } };
      const nameOf = (id) => { const p = list.find((q) => q.id === id); return p ? p.name : cast[id] ? cast[id].name : ''; };
      // ---- the Talk button and the words, at the foot of the screen ----
      const el = (tag, cls, parent) => { const e = document.createElement(tag); e.className = cls; parent.appendChild(e); return e; };
      const btn = el('button', 'talkbtn', root), box = el('div', 'talkbox', root), who = el('div', 'talkwho', box), said = el('div', 'talksaid', box);
      btn.style.display = 'none'; box.style.display = 'none';
      for (const ev of ['pointerdown', 'touchstart', 'mousedown']) btn.addEventListener(ev, (e) => e.stopPropagation());
      // cur: what is being said now: { p: the person (or null: the coven at a set moment), queue, done: the lines said, then, call, line }
      let near = null, cur = null, sayT = 0, audio = null, lastT = 0, makeBusy = false, tickN = 0, lastCall = -1e9;
      const io = () => ({ x: M.x(W.io.px), z: M.z(W.io.py) });
      const api = { list, lines: null, greet: null, heard: null, voice: null }, ARM = 1.5, REACH = 2.3;
      const voice = (id) => (api.voice ? api.voice(id) : (G.COVEN_VOICE && G.COVEN_VOICE[id]) || null);
      const guess = (l) => Math.max(2.2, 0.8 + l.text.split(/\s+/).length * 0.4);
      function stop(all) { if (audio) { try { audio.onended = null; audio.pause(); } catch (e) {} audio = null; }
        const c = cur; if (!c) return; if (!all && c.queue.length) return sayNext();
        cur = null; box.style.display = 'none'; if (c.p && c.p.npc) c.p.npc.talk(false);
        if (!all && !c.call && api.heard) try { api.heard(c.p, c.done); } catch (e) { console.error(e); }
        if (!all && c.call && api.heard) try { api.heard(null, c.done); } catch (e) { console.error(e); }
        if (!all && c.then) c.then(); }
      function sayNext() { const c = cur, l = c.queue.shift(); c.line = l; c.done.push(l);
        const narr = l.who === 'narrator' || l.kind === 'narration'; box.classList.toggle('narr', narr);
        who.textContent = narr ? '' : nameOf(l.who) || (c.p ? c.p.name : ''); said.textContent = l.text; box.style.display = 'block';
        if (c.p && c.p.npc) c.p.npc.talk(!l.who || l.who === c.p.id);
        sayT = TEST ? 0.3 : (l.secs || guess(l)) + 0.5;
        const src = TEST ? null : voice(l.id);
        if (src) { try { const a = audio = new Audio(src); sayT = (l.secs || guess(l)) + 2.5; a.onended = () => { if (audio === a) { audio = null; sayT = Math.min(sayT, 0.35); } }; a.play().catch(() => { if (audio === a) audio = null; }); } catch (e) { audio = null; } } }
      function play(lines, p, then, call) { if (!lines || !lines.length) return false; if (cur) stop(true); cur = { p: p || null, queue: lines.slice(), done: [], then: then || null, call: !!call }; sayNext(); return true; }
      function talk(p) { if (cur && !cur.call) { stop(false); return true; } if (!p || !p.npc) return false;
        const me = io(); p.npc.face(me.x, me.z); if (!p.greeted) { p.greeted = true; p.npc.greet(); }
        const ls = api.lines ? api.lines(p) : null, s = standIn[p.id] || ['...'];
        return play(ls && ls.length ? ls : [{ id: 'standin.' + p.id, who: p.id, text: s[p.standN++ % s.length] }], p); }
      btn.addEventListener('click', () => talk(near));
      G.addEventListener('keydown', (e) => { if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && (near || cur) && !W.paused) { talk(near); e.preventDefault(); } });
      // ---- each frame (it rides on the land's own update) ----
      async function make(p) { p.making = makeBusy = true; try { const n = await G.MF_NPC.make(p.body); if (p.size) n.root.scale.multiplyScalar(p.size); n.root.position.set(p.x, ground(p.x, p.z), p.z); n.root.rotation.y = Math.atan2(p.lookX - p.x, p.lookZ - p.z); scene.add(n.root); n.update(0.016); p.npc = n; } catch (e) { console.error(e); p.failed = String(e); } makeBusy = false; }
      function tick() {
        const now = performance.now(), real = TEST ? 1 / 30 : lastT ? Math.min(0.5, (now - lastT) / 1000) : 0.016, dt = Math.min(0.05, real); lastT = now; tickN++;   // (a check steps the clock itself; `real` times the words, however slow the frames)
        const me = io(); let best = null, bd = REACH;
        for (const p of list) { let d = p.d = Math.hypot(p.x - me.x, p.z - me.z);
          if (p.want && d > 62 && !(cur && cur.p === p)) { settle(p); d = p.d = Math.hypot(p.x - me.x, p.z - me.z); }
          if (d > 9) p.far = true;
          if (!p.npc) { if (d < 75 && !p.making && !p.failed && !makeBusy) make(p); continue; }
          const show = d < 58; if (p.npc.root.visible !== show) p.npc.root.visible = show; if (!show) continue;
          if (d < 42 || TEST) { if (tickN % 20 === 0 && !p.npc.moving) { if (d < 7 || (cur && cur.p === p)) p.npc.face(me.x, me.z); else p.npc.face(p.lookX, p.lookZ); } p.npc.update(dt); }
          if (d < bd) { bd = d; best = p; }
          // she has walked right up to them: they speak by themselves, once for each time she comes up from farther off
          if (p.far && d < ARM && !cur && api.greet && (!TEST || api.autoInTest) && !W.paused) { p.far = false; const g = api.greet(p); if (g && g.lines && g.lines.length) { p.npc.face(me.x, me.z); if (!p.greeted) { p.greeted = true; p.npc.greet(); } play(g.lines, p, null, !!g.short); } } }
        if (cur) { sayT -= real; if (cur.p && cur.p.d > 6.5 && !cur.call) stop(true); else if (sayT <= 0) stop(false); }
        near = best;
        const label = cur && !cur.call ? (cur.queue.length ? 'Go on' : cur.p ? 'Thank ' + cur.p.name.replace(/^(Old|Mayor) /, '').replace(/^The /, 'the ') : 'Go on') : near ? 'Talk to ' + near.name.replace(/^The /, 'the ') : '';
        if (btn.textContent !== label) { btn.textContent = label; btn.style.display = label ? 'block' : 'none'; }
      }
      const u0 = Z.update; Z.update = function () { const r = u0.apply(this, arguments); try { tick(); } catch (e) { console.error(e); } return r; };
      Object.assign(api, { near: () => near, me: io, play, ARM, REACH, busy: () => !!cur, stop: () => stop(true), nameOf, tick,
        talk: (id) => talk(list.find((p) => p.id === id)),
        move: (id, d, now) => { const p = list.find((q) => q.id === id); if (!p) return false; p.want = d; if (now) settle(p); return true; },
        say: () => (cur ? { who: cur.line.who || (cur.p && cur.p.id), name: who.textContent, id: cur.line.id, text: said.textContent, left: cur.queue.length, person: cur.p ? cur.p.id : null } : null),
        ready: async () => { for (const p of list) if (!p.npc && !p.failed) await make(p); return list.filter((p) => p.npc).length; } });
      G.__people = api; return api;
    },
  };
})(window);
