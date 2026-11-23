// things.js: things on the land the coven can do something to, or that show what the story has done (Coven of the Moon
// Faire, November 23, 2026). Zone 2's three dark road stones, which Io lights; zone 3's knight of light, seen far off;
// zone 1's pale moth, Old Bridie's lantern and the lamps that come home to the Grey Hat's ship.
// What the things are is data, in the zone's people file (game/people/zone-N.js: W3D.THINGS['zone-N']):
//   { id, place: [the place's id, x, y]   where the coven stands to use it, in that place's painting
//         (or at: [x, z] in the land's own metres; or neither, for a thing that finds its own spot in make)
//     label                               the words on the button
//     can(c)                              may it be used now (c: what the story's rules may ask, game/people/story.js)
//     use(thing, c, story)                what using it does
//     make(thing, k)                      builds what is seen (k: { THREE, scene, part, X, Z, ground, glow(colour, size, strength),
//                                         and, since zone 1's things: W, land, people, person(id), stand(x, z), halo(colour, size, strength), pool(colour, size, strength, x, z), fade(distance), cam, clock })
//     look(thing, c)                      sets how it looks now (lit or dark); called at the start and after any use
//     tick(thing, c, me, k)               each frame, if it has something to do (k.t: the game's clock in seconds, k.dt: since the last frame, k.cam: the camera) }
// A halo is a soft light that always faces the camera (a lamp seen from any side); a pool is the same light lying on
// the ground, laid over its rises and dips. Neither knows the fog, so fade(distance) says how much of one is left at
// that distance from the camera, by the night's own fog.
// The button is the same one the people use ("Talk to ..."), in the same spot: it shows when the coven stands within
// 2.6 m of a thing that can be used, and nobody to talk to is nearer. E or Enter does the same.
//   const things = W3D.things.start({ W, root, people, story, zone: 'zone-2' })
// For checks: window.__things = { list, near(), use(id), tick(), get(id) }.
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
      // (zone 1's things) a light that faces the camera; a light lying on the ground; where feet would stand anywhere on the land; how much the fog leaves of a light
      const T3 = G.THREE, ZM = Z.M, stand = (x, z) => Z.walkH(ZM.px(x), ZM.py(z));
      const halo = (color, size, opacity) => { const m = new T3.Sprite(new T3.SpriteMaterial({ map: soft, color, transparent: true, opacity: opacity == null ? 1 : opacity, blending: T3.AdditiveBlending, depthWrite: false })); m.scale.set(size, size, 1); m.renderOrder = 5; return m; };
      const pool = (color, size, opacity, x, z) => { const n = 8, g = new T3.PlaneGeometry(size, size, n, n); g.rotateX(-Math.PI / 2); const p = g.attributes.position;
        for (let i = 0; i < p.count; i++) p.setY(i, stand(x + p.getX(i), z + p.getZ(i)) + 0.07);
        const m = new T3.Mesh(g, new T3.MeshBasicMaterial({ map: soft, color, transparent: true, opacity: opacity == null ? 1 : opacity, blending: T3.AdditiveBlending, depthWrite: false })); m.position.set(x, 0, z); m.renderOrder = 4; return m; };
      const fade = (d) => { const a = Z.U.uFogNear.value, b = Z.U.uFogFar.value, u = Math.max(0, Math.min(1, (d - a) / Math.max(1, b - a))); return 1 - u * u * (3 - 2 * u) * 0.85; };
      const K = { t: 0, dt: 0, cam: W.cam, fade };
      for (const t of list) { const part = t.place ? Z.parts.find((q) => q.id === t.place[0]) : null, PM = part ? part.P.M : null; t.part = part;
        if (part) { t.x = part.ox + PM.x(t.place[1]); t.z = part.oz + PM.z(t.place[2]); } else if (t.at) { t.x = t.at[0]; t.z = t.at[1]; } else { t.x = t.z = 1e9; }
        const k = { THREE: T3, scene, part, glow, halo, pool, fade, stand, W, land: Z.land, people, clock: K, cam: W.cam, person: (id) => people.list.find((q) => q.id === id) || null,
          X: (px) => (part ? part.ox + PM.x(px) : px), Z: (py) => (part ? part.oz + PM.z(py) : py), ground: (x, z) => (part ? part.terrain(x, z) : stand(x, z)) };
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
        for (const t of list) if (t.tick) t.tick(t, C, me, K); }
      // (the game's clock comes with the land's own update: it only moves when the game does, so a check can step it)
      const u0 = Z.update; Z.update = function (clock) { const r = u0.apply(this, arguments); if (typeof clock === 'number') { K.dt = Math.max(0, Math.min(0.25, clock - K.t)); K.t = clock; } try { tick(); } catch (e) { console.error(e); } return r; };
      const api = { list, near: () => near, use: (id) => use(list.find((t) => t.id === id)), tick, looks, get: (id) => list.find((t) => t.id === id) || null, clock: K };
      G.__things = api; return api;
    },
  };
})(window);
