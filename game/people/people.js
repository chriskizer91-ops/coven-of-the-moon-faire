// people.js: the people who stand in the land, and talking to them (Coven of the Moon Faire, November 19, 2026).
// The bodies are Moon Faire's painted fair folk (game/people/folk/, MF_NPC). Who stands where is data
// (game/people/zone-1.js). What they say is data too: the story job's lines when they come; until then the stand-ins.
//   const people = await W3D.people.start({ W, root, zone: 'zone-1', lines, voice })
//     W: the walker (W3D.walk's). root: the element the button and the words go in.
//     lines(person, n): the lines of that person's n-th talk, as [{ id, text }] (left out: the stand-ins, in turn).
//     voice(id): the sound for a line, as something an <audio> can play, or nothing (left out: window.COVEN_VOICE[id]).
// A person is only built when the coven first comes within 75 m (one at a time), is only drawn within 58 m, and only
// moves within 42 m. Near one (3.4 m), a Talk button shows at the foot of the screen; E or Enter does the same.
// For checks: window.__people = { list, near(), talk(id), say, saying }.
(function (G) {
  'use strict';
  const W3D = G.W3D, TEST = /[?&]test\b/.test(location.search);
  W3D.people = {
    async start(o) {
      const W = o.W, Z = W.P, L = Z.land, M = Z.M, D = W3D.PEOPLE[o.zone], scene = Z.scene, root = o.root;
      const standIn = W3D.PEOPLE_STANDIN || {};
      const lines = o.lines || ((p, n) => { const s = standIn[p.id] || ['...']; return [{ id: 'standin.' + p.id + '.' + (n % s.length), text: s[n % s.length] }]; });
      const voice = o.voice || ((id) => (G.COVEN_VOICE && G.COVEN_VOICE[id]) || null);
      const ground = (x, z) => Z.walkH(M.px(x), M.py(z));
      // ---- where each stands ----
      const list = D.people.map((d) => { const p = Object.assign({ npc: null, making: false, talks: 0, d: 1e9 }, d);
        if (d.camp) { p.x = D.camp[0] + d.camp[0]; p.z = D.camp[1] + d.camp[1]; p.lookX = D.camp[0]; p.lookZ = D.camp[1]; }
        else if (d.road) { const r = L.roadList.find((q) => q.name === d.road[0]), q = r.pts; let len = 0; for (let i = 1; i < q.length; i++) len += Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]);
          let want = len * d.road[1]; for (let i = 1; i < q.length; i++) { const s = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]); if (want <= s || i === q.length - 1) { const t = Math.min(1, want / s), ux = (q[i][0] - q[i - 1][0]) / s, uz = (q[i][1] - q[i - 1][1]) / s, cx = q[i - 1][0] + ux * s * t, cz = q[i - 1][1] + uz * s * t; p.x = cx - uz * d.road[2]; p.z = cz + ux * d.road[2]; p.lookX = cx; p.lookZ = cz; break; } want -= s; } }
        else { p.x = d.at[0]; p.z = d.at[1]; p.lookX = p.x; p.lookZ = p.z + 1; }
        return p; });
      L.addBlockers(list.map((p) => ({ x: p.x, z: p.z, r: 0.42 })));
      // ---- the Talk button and the words, at the foot of the screen ----
      const el = (tag, cls, parent) => { const e = document.createElement(tag); e.className = cls; parent.appendChild(e); return e; };
      const btn = el('button', 'talkbtn', root), box = el('div', 'talkbox', root), who = el('div', 'talkwho', box), said = el('div', 'talksaid', box);
      btn.style.display = 'none'; box.style.display = 'none'; btn.setAttribute('aria-live', 'polite');
      for (const ev of ['pointerdown', 'touchstart', 'mousedown']) btn.addEventListener(ev, (e) => e.stopPropagation());
      let near = null, saying = null, sayT = 0, audio = null, queue = [], lastT = 0, makeBusy = false, tickN = 0;
      const io = () => ({ x: M.x(W.io.px), z: M.z(W.io.py) });
      const endLine = () => { if (audio) { try { audio.pause(); } catch (e) {} audio = null; } if (queue.length) return sayNext(); const p = saying; saying = null; box.style.display = 'none'; if (p && p.npc) p.npc.talk(false); };
      function sayNext() { const p = saying, l = queue.shift(); who.textContent = p.name; said.textContent = l.text; box.style.display = 'block'; saying.line = l;
        const words = l.text.split(/\s+/).length; sayT = l.sec || Math.max(2.4, 0.9 + words * 0.4);
        const src = voice(l.id); if (src && !TEST) { try { audio = new Audio(src); audio.onended = () => { if (saying === p && saying.line === l) endLine(); }; sayT = 60; audio.play().catch(() => { sayT = Math.max(2.4, 0.9 + words * 0.4); }); } catch (e) { audio = null; } } }
      function talk(p) { if (!p || !p.npc) return false; if (saying) { endLine(); if (saying || near !== p) return true; }
        const me = io(); p.npc.face(me.x, me.z); if (p.talks === 0) p.npc.greet(); p.npc.talk(true);
        queue = lines(p, p.talks).slice(); p.talks++; saying = p; sayNext(); if (o.onTalk) o.onTalk(p); return true; }
      btn.addEventListener('click', () => talk(near || saying));
      G.addEventListener('keydown', (e) => { if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && (near || saying) && !W.paused) { talk(near || saying); e.preventDefault(); } });
      // ---- each frame (it rides on the land's own update) ----
      async function make(p) { p.making = makeBusy = true; try { const n = await G.MF_NPC.make(p.body); n.root.position.set(p.x, ground(p.x, p.z), p.z); n.root.rotation.y = Math.atan2(p.lookX - p.x, p.lookZ - p.z); scene.add(n.root); n.update(0.016); p.npc = n; } catch (e) { console.error(e); p.failed = String(e); } makeBusy = false; }
      function tick() {
        const now = performance.now(), dt = TEST ? 1 / 30 : lastT ? Math.min(0.05, (now - lastT) / 1000) : 0.016; lastT = now; tickN++;   // (a check steps the clock itself)
        const me = io(); let best = null, bd = 3.4;
        for (const p of list) { const d = p.d = Math.hypot(p.x - me.x, p.z - me.z);
          if (!p.npc) { if (d < 75 && !p.making && !p.failed && !makeBusy) make(p); continue; }
          const show = d < 58; if (p.npc.root.visible !== show) p.npc.root.visible = show; if (!show) continue;
          if (d < 42 || TEST) { if (tickN % 20 === 0 && !p.npc.moving) { if (d < 7 || saying === p) p.npc.face(me.x, me.z); else p.npc.face(p.lookX, p.lookZ); } p.npc.update(dt); }
          if (d < bd) { bd = d; best = p; } }
        if (saying) { sayT -= dt; if (sayT <= 0 || saying.d > 6.5) { if (saying.d > 6.5) queue = []; endLine(); } }
        if (best !== near) { near = best; }
        const label = saying ? (queue.length ? 'Go on' : 'Thank ' + saying.name.replace(/^Old /, '')) : near ? 'Talk to ' + near.name : '';
        if (btn.textContent !== label) { btn.textContent = label; btn.style.display = label ? 'block' : 'none'; }
      }
      const u0 = Z.update; Z.update = function () { const r = u0.apply(this, arguments); try { tick(); } catch (e) { console.error(e); } return r; };
      const api = { list, near: () => near, talk: (id) => talk(list.find((p) => p.id === id)), say: () => (saying ? { who: saying.id, text: said.textContent, left: queue.length } : null), tick,
        ready: async () => { for (const p of list) if (!p.npc && !p.failed) await make(p); return list.filter((p) => p.npc).length; } };
      G.__people = api; return api;
    },
  };
})(window);
