// faire-ending.js: the game's last scene, at the Moon Faire's camp outside Wickhollow (Coven of the Moon Faire,
// November 24, 2026; the zone-4 job). A piece that can be started by itself, on zone 1's land.
//
// The story job wrote it as a walk, not one long scene (docs/slips/story.md; game/talk/zone-4.js, the moments
// `homecoming` and `faire`): the ship comes home under the stars; then each of fifteen people has one short talk
// (`z4.faire.<who>`), said when the coven walks up to them; and when all fifteen have been heard the last talk plays
// (`z4.faire.farewell`), and the game ends on its last line, Io's "Yes."
// NOT ONE WORD OF A LINE IS SET HERE.
//
// How a page uses it (game/pages/faire-ending.html does exactly this; docs/slips/zone-4.md says what the hub must do
// to join it to zone 1's own page after the last flight):
//   1. load game/talk/zone-4.js (and its recordings, when they are in) beside zone 1's own files, this file, and
//      game/places/zone-4-sky.js (the stars: without it the ending still plays, under zone 1's own sky)
//   2. W3D.faireEnding.cast()                          BEFORE W3D.people.start: the six who live elsewhere come to the camp
//   3. const people = await W3D.people.start({ W, root, zone: 'zone-1' })
//   4. const end = W3D.faireEnding.start({ W, root, people, waitBegin: true })     IN PLACE OF W3D.story.start for zone 1
//      end.story is the story engine's own handle (end.story.begin() after the Begin button, as on a zone's page)
// What it keeps is the story engine's own, under its own name in the browser, so it never touches a zone's story.
(function (G) {
  'use strict';
  const W3D = G.W3D; W3D.STORY = W3D.STORY || {}; W3D.THINGS = W3D.THINGS || {};
  // ---- the words on the screen at the very end. STAND-INS: Chris's to write ----
  const WORDS = { end: 'The end', under: 'Coven of the Moon Faire' };
  // ---- who says goodbye, in no order: the nine of the Faire who live at the camp, and six who have come out to it ----
  const ALL = ['nettie', 'odile', 'tully', 'linnet', 'zofia', 'bridie', 'bashir', 'otto', 'corwin', 'ros', 'kofi', 'jory', 'gretch', 'hilde', 'quill'];
  // where those six stand at the camp for the last night, in metres east and south of the camp's well (the job's call:
  // in zone 1 Nettie, Hilde and the mayor stand in Wickhollow, Quill at the jetty, Old Bridie and Jory on the roads)
  const AT_CAMP = { nettie: [-4.0, 2.0], gretch: [4.6, 1.0], hilde: [-4.5, -4.5], quill: [5.0, -3.0], bridie: [-10.5, 0.5], jory: [11.5, 3.5] };
  const HALCYON = [1.9, 3.1];      // Halcyon: by the well, a step from where the coven stands when the scene opens
  W3D.STORY.faire = {
    talk: 'COVEN_TALK_Z4', key: 'coven.story.faire.v1', first: 'homecoming', stages: [],
    tell: [['faire', (c) => c.heard('homecoming')]],
    moments: [['faire.farewell', (c) => ALL.every((id) => c.heard('faire.' + id)), () => { if (W3D.faireEnding.onLast) W3D.faireEnding.onLast(); }]],
  };
  W3D.faireEnding = {
    who: ALL, words: WORDS, atCamp: AT_CAMP,
    cast(zone) { const D = (W3D.PEOPLE || {})[zone || 'zone-1']; if (!D) return 0; let n = 0;
      for (const p of D.people) if (AT_CAMP[p.id]) { delete p.place; delete p.road; delete p.look; delete p.at; p.camp = AT_CAMP[p.id].slice(); n++; } return n; },
    start(o) { const W = o.W, people = o.people, root = o.root, Z = W.P, M = Z.M, D = W3D.PEOPLE[o.zone || 'zone-1'], camp = D.camp || [0, 0], TEST = /[?&]test\b/.test(location.search);
      // anyone set down where feet cannot stand (a lantern post, a stall) takes the nearest spot that can be stood on
      for (const p of people.list) if (AT_CAMP[p.id] && !Z.walkable(M.px(p.x), M.py(p.z))) { const f = W.nearestFit(M.px(p.x), M.py(p.z)); people.move(p.id, { at: [M.x(f[0]), M.z(f[1])] }, true); }
      // the lamps are out ("Lamps out, all twelve. I'll fly dark tonight"): the story engine is told none is lit
      const story = W3D.story.start({ W, people, zone: 'faire', waitBegin: !!o.waitBegin, lamps: 0 }), talkOf = (p) => story.groups['z4.faire.' + p.id] || null;
      people.lines = (p) => talkOf(p);
      people.greet = (p) => { const t = talkOf(p); return t && !story.ctx.heard('faire.' + p.id) ? { lines: t } : null; };
      // the last night is under the stars, with no moon ("Stars. Look at them. I've never seen so many."): zone 4's sky, if the page carries it
      const sky = W3D.zone4Sky ? W3D.zone4Sky(Z) : null; if (sky) sky.set({ dawn: 0, stars: 1, moon: 1 });
      // Halcyon, come home: she stands by the well. (Not a person to talk to: her lines are said in Nettie's talk and the last one.)
      const H = { x: camp[0] + HALCYON[0], z: camp[1] + HALCYON[1], npc: null, failed: null };
      H.ready = (async () => { try { const n = await G.MF_NPC.make(o.body || 'fortune-teller'); const me = people.me(); n.root.position.set(H.x, Z.walkH(M.px(H.x), M.py(H.z)), H.z); n.root.rotation.y = Math.atan2(me.x - H.x, me.z - H.z); Z.scene.add(n.root); n.update(0.016); H.npc = n; } catch (e) { console.error(e); H.failed = String(e); } })();
      let tickN = 0, lastT = 0; const u0 = Z.update; Z.update = function () { const r = u0.apply(this, arguments);
        try { if (H.npc) { const now = performance.now(), dt = TEST ? 1 / 30 : Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now; const me = people.me(), d = Math.hypot(me.x - H.x, me.z - H.z), s = people.say();
          H.npc.root.visible = d < 58; if (d < 42) { H.npc.talk(!!s && s.who === 'halcyon'); if (tickN++ % 20 === 0 && d < 9) H.npc.face(me.x, me.z); H.npc.update(dt); } } } catch (e) { console.error(e); } return r; };
      // the very end: when the last line has been said, the picture goes dark and two lines of words come up
      const card = document.createElement('div'); card.className = 'faire-end';
      card.style.cssText = 'position:absolute;inset:0;z-index:30;display:none;place-items:center;text-align:center;background:rgba(5,5,14,0);transition:background 4s;pointer-events:none;font-family:Georgia,"Times New Roman",serif';
      card.innerHTML = '<div style="opacity:0;transition:opacity 3s 2.5s"><div class="faire-end-1" style="font-size:clamp(30px,6vw,54px);color:#ffe9b8;letter-spacing:.03em"></div><div class="faire-end-2" style="margin-top:10px;font-size:16px;color:#cfc8ee"></div></div>';
      card.querySelector('.faire-end-1').textContent = WORDS.end; card.querySelector('.faire-end-2').textContent = WORDS.under; root.appendChild(card);
      const api = { story, halcyon: H, sky, ended: false, card, heard: () => ALL.filter((id) => story.ctx.heard('faire.' + id)), left: () => ALL.filter((id) => !story.ctx.heard('faire.' + id)) };
      W3D.faireEnding.onLast = () => { api.ended = true; card.style.display = 'grid'; /* hub: with the end card up, the talk's box and its button are hidden, so nothing shows dimly behind the card or under "Back to the front door" */ if (!document.getElementById('faire-end-quiet')) { const st = document.createElement('style'); st.id = 'faire-end-quiet'; st.textContent = 'body.faire-ended .talkbox,body.faire-ended .talkbtn{display:none!important}'; document.head.appendChild(st); } document.body.classList.add('faire-ended'); requestAnimationFrame(() => { card.style.background = 'rgba(5,5,14,0.94)'; card.firstChild.style.opacity = 1; }); if (o.onEnd) try { o.onEnd(); } catch (e) { console.error(e); } };
      if (story.state().moments['faire.farewell'] && story.ctx.heard('faire.farewell')) W3D.faireEnding.onLast();     // (opened again after the end)
      G.__faire = api; return api; },
  };
})(window);
