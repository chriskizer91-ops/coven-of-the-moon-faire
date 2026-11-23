// things.js: things on the land the coven can do something to, or that show what the story has done (Coven of the Moon
// Faire, November 23, 2026). Zone 2's three dark road stones, which Io lights; zone 3's knight of light, seen far off.
// What the things are is data, in the zone's people file (game/people/zone-N.js: W3D.THINGS['zone-N']):
//   { id, place: [the place's id, x, y]   where the coven stands to use it, in that place's painting
//     label                               the words on the button
//     can(c)                              may it be used now (c: what the story's rules may ask, game/people/story.js)
//     use(thing, c, story)                what using it does
//     make(thing, k)                      builds what is seen (k: { THREE, scene, part, X, Z, ground, glow(colour, size, strength) })
//     look(thing, c)                      sets how it looks now (lit or dark); called at the start and after any use
//     tick(thing, c, me)                  each frame, if it has something to do }
// The button is the same one the people use ("Talk to ..."), in the same spot: it shows when the coven stands within
// 2.6 m of a thing that can be used, and nobody to talk to is nearer. E or Enter does the same.
//   const things = W3D.things.start({ W, root, people, story, zone: 'zone-2' })
// For checks: window.__things = { list, near(), use(id), tick() }.
(function (G) {
  'use strict';
  const W3D = G.W3D;
  W3D.things = {
    start(o) {
      const W = o.W, Z = W.P, people = o.people, story = o.story, C = story.ctx, list = ((W3D.THINGS || {})[o.zone] || []).slice(), scene = Z.scene;
      // a soft round light: bright in the middle, fading to nothing at its edge (added to what is behind it)
      const soft = (() => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
        r.addColorStop(0, 'rgba(255,255,255,1)'); r.addColorStop(0.25, 'rgba(255,255,255,0.55)'); r.addColorStop(0.6, 'rgba(255,255,255,0.16)'); r.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = r; g.fillRect(0, 0, 128, 128);
        return new G.THREE.CanvasTexture(c); })();
      const glow = (color, size, opacity) => { const T = G.THREE, m = new T.Mesh(new T.PlaneGeometry(size, size), new T.MeshBasicMaterial({ map: soft, color, transparent: true, opacity: opacity == null ? 1 : opacity, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide })); m.renderOrder = 5; return m; };
      for (const t of list) { const part = Z.parts.find((q) => q.id === t.place[0]), PM = part.P.M; t.part = part; t.x = part.ox + PM.x(t.place[1]); t.z = part.oz + PM.z(t.place[2]);
        const k = { THREE: G.THREE, scene, part, glow, X: (px) => part.ox + PM.x(px), Z: (py) => part.oz + PM.z(py), ground: (x, z) => part.terrain(x, z) };
        if (t.make) try { t.make(t, k); } catch (e) { console.error(e); } }
      const looks = () => { for (const t of list) if (t.look) try { t.look(t, C); } catch (e) { console.error(e); } };
      looks();
      const btn = document.createElement('button'); btn.className = 'talkbtn'; btn.style.display = 'none'; o.root.appendChild(btn);
      for (const ev of ['pointerdown', 'touchstart', 'mousedown']) btn.addEventListener(ev, (e) => e.stopPropagation());
      let near = null;
      function use(t) { if (!t || !t.can || !t.can(C)) return false; try { t.use(t, C, story); } catch (e) { console.error(e); } looks(); return true; }
      btn.addEventListener('click', () => use(near));
      G.addEventListener('keydown', (e) => { if ((e.key === 'e' || e.key === 'E' || e.key === 'Enter') && near && !people.near() && !people.busy() && !W.paused) { use(near); e.preventDefault(); } });
      function tick() { const me = people.me(); near = null;
        if (!people.busy() && !people.near() && !W.paused) for (const t of list) if (t.can && Math.hypot(t.x - me.x, t.z - me.z) < (t.reach || 2.6) && t.can(C)) { near = t; break; }
        const label = near ? near.label : ''; if (btn.textContent !== label) { btn.textContent = label; btn.style.display = label ? 'block' : 'none'; }
        for (const t of list) if (t.tick) t.tick(t, C, me); }
      const u0 = Z.update; Z.update = function () { const r = u0.apply(this, arguments); try { tick(); } catch (e) { console.error(e); } return r; };
      const api = { list, near: () => near, use: (id) => use(list.find((t) => t.id === id)), tick, looks };
      G.__things = api; return api;
    },
  };
})(window);
