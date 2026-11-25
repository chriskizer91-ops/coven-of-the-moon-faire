// zone-1.js (people): who stands where in zone 1, how its story moves, and the small things its lines expect to see
// (Coven of the Moon Faire, November 19 to 23, 2026).
// The Moon Faire's eleven fair folk, as themselves (Chris, November 18). Their names are the hub's, of November 19, at
// Chris's asking, and his to change. `body` is the painted person in game/people/folk/npcs.js.
// A spot is `camp: [east, south]` in metres from the camp's well; or `road: [the road's name, how far along it (0 to 1),
// metres to its side]`; or `place: [the place's id, x, y]` in that place's painting, with `look` the spot they face. `faces: 'well'` looks at the well until the coven comes near.
(function (G) {
  'use strict';
  const W3D = G.W3D; W3D.PEOPLE = W3D.PEOPLE || {};
  W3D.PEOPLE['zone-1'] = {
    camp: [-70, 128],
    people: [
      { id: 'odile', name: 'Odile', trade: 'the lamp-seller', body: 'old-lamp-seller', camp: [-12.4, 12.6] },          // by her lamp stall
      { id: 'bashir', name: 'Bashir', trade: 'the ribbon-dyer', body: 'ribbon-dyer', camp: [12.4, 12.6] },              // by the brass stall
      { id: 'zofia', name: 'Zofia', trade: 'the fortune-teller', body: 'fortune-teller', camp: [12.8, -2.4] },          // by her booth
      { id: 'linnet', name: 'Linnet', trade: 'the ballad-singer', body: 'ballad-singer', camp: [-0.5, -11.5] },         // before the big top
      { id: 'otto', name: 'Otto', trade: 'the baker', body: 'fair-baker', camp: [-7.2, 6.4] },                          // by his oven cart
      { id: 'corwin', name: 'Corwin', trade: 'the night watchman', body: 'old-night-watchman', camp: [-7.6, -9.4] },    // warming at the north brazier
      { id: 'ros', name: 'Ros', trade: 'the pie-seller', body: 'pie-seller', camp: [8.2, -5.6] },                       // by her pie cart
      { id: 'tully', name: 'Tully', trade: 'the gate keeper', body: 'gate-keeper', camp: [28.6, 1.9] },                 // just inside the gate
      { id: 'kofi', name: 'Kofi', trade: 'the chestnut roaster', body: 'chestnut-roaster', camp: [8.6, 10.4] },         // at the south brazier
      { id: 'bridie', name: 'Old Bridie', trade: 'the lamplighter', body: 'old-lamplighter', road: ['Wickhollow to Io’s cottage', 0.66, 2.6] },   // on the south road, two thirds of the way to the cottage
      { id: 'jory', name: 'Jory', trade: 'the farm lad', body: 'farm-lad', road: ['Wickhollow to the jetty', 0.36, -3.2] },                           // by the lake, on the jetty road
      // the Grey Hat, on the jetty's pier where his ship moors (his own painted body)
      { id: 'captain', name: 'The Grey Hat', trade: 'the captain', body: 'grey-hat-captain', place: ['jetty', 790, 600], look: [768, 470] },
      // the townsfolk, where the new Envoi stands them in each place's painting. Their bodies are the fair folk's other
      // shapes for now (hub's call), so some look like a person of the Faire until they are painted anew.
      { id: 'quill', name: 'Quill', trade: 'the sailor', body: 'chestnut-roaster-opus', place: ['jetty', 1150, 385], look: [1050, 470] },
      { id: 'nettie', name: 'Nettie', trade: 'the herb-seller', body: 'old-lamplighter-opus', place: ['wickhollow', 568, 426], look: [640, 520] },
      { id: 'hilde', name: 'Hilde', trade: 'the smith', body: 'pie-seller', place: ['wickhollow', 1015, 364], look: [960, 460] },
      { id: 'gretch', name: 'Mayor Gretch', trade: 'the mayor', body: 'old-night-watchman-opus', place: ['wickhollow', 705, 594], look: [800, 594] },
      { id: 'wenna', name: 'Old Wenna', trade: 'the herb-seller', body: 'fortune-teller-opus', place: ['bogmire', 652, 470], look: [700, 560] },
      { id: 'tobb', name: 'Tobb', trade: 'the innkeeper', body: 'fair-baker-opus', place: ['bogmire', 1184, 296], look: [1260, 330] },
      { id: 'pell', name: 'Pell', trade: 'the child', body: 'farm-lad', size: 0.72, place: ['bogmire', 744, 354], look: [744, 300] },
    ],
  };
  // ---- how zone 1's story moves (game/people/story.js reads this; the rules are the hub's, from the story brief's table) ----
  W3D.STORY = W3D.STORY || {};
  W3D.STORY['zone-1'] = {
    talk: 'COVEN_TALK_Z1', key: 'coven.story.v1', gate: 'greatWraith', first: 'opening',
    stages: [
      { to: 1, when: (c) => c.heard('captain.ask') },                 // asked: the Grey Hat has asked for his lamps
      { to: 2, from: 1, when: (c) => c.heard('nettie.hello') },       // home: after that, Nettie has known Io
      { to: 3, when: (c) => c.heard('wenna.wraith') },                // fen: Old Wenna has told of the great wraith
      { to: 4, when: (c) => c.won() },                                // after: the great wraith is released
    ],
    tellStage: { 1: 'asked' },
    // (the jetty's line speaks of the ship at the end of the pier, so it waits until the coven is down on the quay and can see her)
    tell: [['wickhollow', (c) => c.near('wickhollow', 4)], ['jetty', (c) => c.spot('jetty', 768, 330, 8)]],
    moments: [
      ['after-wraith', (c) => c.won()],
      ['leaving', (c) => c.heard('captain.sew')],
      // (the cottage's lines are said at its gate, with the lit gate lamps in view: the lane's two pillars where the road from
      // Wickhollow comes in, or the garden gate to the south, or failing both the cottage's own door)
      ['cottage', (c) => c.spot('cottage', 552, 112, 15) || c.spot('cottage', 792, 745, 12) || c.spot('cottage', 800, 520, 9)],
      ['thornwood', (c) => c.near('thornwood', 30)],
      ['fen', (c) => c.near('bogmire', 60)],
      ['before-wraith', (c) => c.gate && !c.won() && c.gateD() < 40],
    ],
  };
  // ---- the small things zone 1's lines expect to see (hub's calls, November 23; game/people/things.js draws them) ----
  // The ship herself is part of the jetty (game/places/jetty-ship-real.js: the Skiff from Skies of Aethermoor, the flight
  // job's). Here are the lights and the moth.
  W3D.THINGS = W3D.THINGS || {};
  const WEST = [-0.87, -0.5];    // the way the moth goes: west and somewhat north, toward the moon (the moon stands high in the north-west)
  // the cottage's four gate pillars, each with a lantern on top: where it stands in the cottage's painting, how tall it
  // is, its lantern's size (the cottage's own numbers, game/places/cottage.js): the lane's two, where the road from
  // Wickhollow comes in, and the garden gate's two to the south
  const GATE_LAMPS = [[480, 112, 2.75, 1.1], [624, 112, 2.75, 1.1], [726, 745, 2.4, 1.0], [858, 745, 2.4, 1.0]];
  W3D.THINGS['zone-1'] = [
    // the gate lamps at Io's cottage, kept lit. The cottage already had a lantern on each gate pillar, but each was a
    // small light that could not be told from a dark one a few steps off. Each now has a wide warm glow, so a kept
    // lamp reads as one from the road. ("The lamp by the gate is lit. Someone's kept it." "I lit the lamp at the
    // cottage gate every night it stood empty." "And the gate lamp, still lit.")
    { id: 'gate-lamps', place: ['cottage', 552, 112],
      make: (t, k) => { t.halos = GATE_LAMPS.map(([px, py, top, s]) => { const x = k.X(px), z = k.Z(py), h = k.halo(0xffb060, 3.0, 0.8); h.position.set(x, k.ground(x, z) + top + 0.18 + 0.15 * s, z); k.scene.add(h); return h; }); },
      tick: (t, c, me, k) => { for (const h of t.halos || []) { const d = k.cam.position.distanceTo(h.position); h.visible = d < 170; if (h.visible) h.material.opacity = 0.8 * k.fade(d) * (0.95 + 0.05 * Math.sin(k.t * 5.1 + h.position.x)); } },
    },
    // Old Bridie's lantern, "the last lantern on the south road": one of the Faire's own lantern posts, beside her, its
    // arm out toward the road, lit. ("Don't stand between me and my lamp"; "Go careful. It's dark past my lamp.")
    { id: 'bridie-lantern',
      make: (t, k) => { const b = k.person('bridie'); if (!b || !W3D.fair || !W3D.fair.piece) return;
        const ux = b.lookX - b.x, uz = b.lookZ - b.z, d = Math.hypot(ux, uz) || 1, ax = ux / d, az = uz / d;        // (toward the road from where she stands)
        const x = b.x - az * 1.15 - ax * 0.35, z = b.z + ax * 1.15 - az * 0.35;                                     // a step along the road from her, a little further off it
        const out = W3D.fair.piece(k.W.P, 'lanternPost', { x, z, turn: Math.atan2(-az, ax) * 180 / Math.PI }), L = out.lamps[0] || { x, y: k.stand(x, z) + 2.6, z };
        t.x = x; t.z = z; t.lamp = [L.x, L.y, L.z]; t.post = out;
        t.pool = k.pool(0xffb070, 11, 0.62, L.x, L.z); k.scene.add(t.pool); },
    },
    // the twelve ship's lamps, each on its hook as it comes home (one for every four fights won in the wilds, the twelfth
    // with the great wraith: game/people/story.js). Bare hooks until then. The hooks are the stand-in ship's.
    { id: 'ship-lamps', place: ['jetty', 768, 800],
      make: (t, k) => { const S = (G.W3D_PLACES.jetty || {}).ship, T = k.THREE, p = k.part; t.n = -1; t.halos = []; if (!S) return;
        const oy = p.oy || 0, gp = [], ip = [], add = (to, w, h, d, x, y, z) => { const g = new T.BoxGeometry(w, h, d).toNonIndexed(); g.translate(x, y, z); to.push(...g.attributes.position.array); g.dispose(); };
        for (const h of S.hooks) { const x = p.ox + h[0], y = oy + h[1], z = p.oz + h[2];
          add(gp, 0.17, 0.25, 0.17, x, y, z); add(ip, 0.25, 0.045, 0.25, x, y + 0.15, z); add(ip, 0.22, 0.04, 0.22, x, y - 0.145, z);
          const hl = k.halo(0xffb060, 1.5, 0.75); hl.position.set(x, y, z); hl.visible = false; k.scene.add(hl); t.halos.push(hl); }
        const mesh = (arr, color) => { const g = new T.BufferGeometry(); g.setAttribute('position', new T.Float32BufferAttribute(arr, 3)); g.setDrawRange(0, 0); g.computeBoundingSphere(); const m = new T.Mesh(g, new T.MeshBasicMaterial({ color })); k.scene.add(m); return m; };
        t.glass = mesh(gp, 0xffca80); t.iron = mesh(ip, 0x14121a); t.hooks = S.hooks.length; t.mid = [p.ox + S.at[0], oy + S.at[1] + 2, p.oz + S.at[2]]; },
      show: (t, n) => { n = Math.max(0, Math.min(t.hooks || 0, n | 0)); t.n = n; if (!t.glass) return; t.glass.geometry.setDrawRange(0, n * 36); t.iron.geometry.setDrawRange(0, n * 72); t.halos.forEach((h, i) => { h.visible = i < n; }); },
      look: (t, c) => { t.show(t, c.lamps); },
      tick: (t, c, me, k) => { if (!t.glass) return; if (c.lamps !== t.n) t.show(t, c.lamps); if (!t.n) return;
        const f = 0.75 * k.fade(k.cam.position.distanceTo(t.halos[0].position)), fl = 0.94 + 0.06 * Math.sin(k.t * 6.3);     // the fog takes them at a distance; a little flicker
        for (let i = 0; i < t.n; i++) t.halos[i].material.opacity = f * (i % 2 ? fl : 1.88 - fl); },
    },
    // the pale moth after the great wraith: it rises on the great wraith's own spot if the camera has that in view (if
    // not, where the camera is looking), circles once, and flies west toward the moon until the fog has it. ("Where it stood, one pale moth rises." "Watch the moth." "It's flying west. Toward
    // the moon.") Once only: if the great wraith was let go before this page was opened, the moth has long gone.
    { id: 'moth',
      make: (t, k) => { const T = k.THREE, c = document.createElement('canvas'); c.width = c.height = 96; const g = c.getContext('2d');
        // one pair of wings, the body's side at the left: a broad forewing and a rounder hindwing, pale, a little darker at the tips
        const wing = (cx, cy, rx, ry, rot) => { g.save(); g.translate(cx, cy); g.rotate(rot); g.scale(rx, ry); const gr = g.createRadialGradient(-0.25, 0, 0.05, 0, 0, 1);
          gr.addColorStop(0, 'rgba(255,253,244,1)'); gr.addColorStop(0.7, 'rgba(232,236,255,0.96)'); gr.addColorStop(0.93, 'rgba(196,204,240,0.9)'); gr.addColorStop(1, 'rgba(190,200,240,0)');
          g.fillStyle = gr; g.beginPath(); g.arc(0, 0, 1, 0, 6.2832); g.fill(); g.restore(); };
        wing(40, 60, 34, 24, 0.5); wing(48, 34, 46, 26, -0.38);
        const tex = new T.CanvasTexture(c), mat = new T.MeshBasicMaterial({ map: tex, transparent: true, side: T.DoubleSide, depthWrite: false });
        const geo = new T.PlaneGeometry(0.46, 0.46); geo.rotateX(-Math.PI / 2); geo.translate(0.23, 0, 0);        // flat, hinged at the body
        const root = new T.Group(), R = new T.Mesh(geo, mat), Lw = new T.Mesh(geo, mat); Lw.scale.x = -1; root.add(R); root.add(Lw);
        const bodyG = new T.CylinderGeometry(0.028, 0.018, 0.24, 5); bodyG.rotateX(Math.PI / 2); const body = new T.Mesh(bodyG, new T.MeshBasicMaterial({ color: 0xf2eeff, transparent: true })); root.add(body);
        const hl = k.halo(0xb4c0ff, 2.1, 0.4), core = k.halo(0xf4f2ff, 0.55, 0.42); root.add(hl); root.add(core);      // a soft pale light round it, so it can be followed against the dark
        root.visible = false; k.scene.add(root); Object.assign(t, { root, R, Lw, mat, body, hl, core, T0: -1, done: null, k });
        // (for the checks, and to try it: window.__things.get('moth').fly())
        t.fly = (x, z) => { const me = k.people.me(), v = new T.Vector3(); k.cam.getWorldDirection(v); const d = Math.hypot(v.x, v.z) || 1;
          // on the great wraith's own spot ("where it stood") when the camera has that in view; if not, where the camera is looking, so it is seen
          if (x == null) { const g = G.__fights && G.__fights.gate, gx = g ? g.at[0] - me.x : 0, gz = g ? g.at[1] - me.z : 0, gd = Math.hypot(gx, gz);
            if (g && gd > 2 && gd < 30 && (gx * v.x + gz * v.z) / (gd * d) > 0.5) { x = g.at[0]; z = g.at[1]; } else { x = me.x + v.x / d * 6.5; z = me.z + v.z / d * 6.5; } }
          t.p0 = [x, Math.max(k.stand(x, z), k.stand(me.x, me.z)) + 0.8, z]; t.T0 = k.clock.t; t.done = false; t.at = t.p0.slice(); root.position.set(t.p0[0], t.p0[1], t.p0[2]); root.visible = true; return t.p0; }; },
      look: (t, c) => { if (t.done == null) t.done = !!c.played('after-wraith'); },
      tick: (t, c, me, k) => { if (!t.root) return;
        if (t.T0 < 0) { if (t.done === false && c.played('after-wraith')) t.fly(); else return; }
        const s = k.t - t.T0, tau = Math.max(0, s - 12), rise = 3.8 * Math.pow(Math.min(1, s / 7), 0.8);
        // it circles as it rises, then the circle is carried west, and up
        const ang = s < 12 ? s * 1.5 : 18 + tau * 1.0, r = (s < 7 ? 0.25 + 0.136 * s : 1.2) * (1 - 0.45 * Math.min(1, tau / 10)), go = 1.7 * (tau - 2 * (1 - Math.exp(-tau / 2)));
        const x = t.p0[0] + WEST[0] * go + Math.cos(ang) * r, z = t.p0[2] + WEST[1] * go + Math.sin(ang) * r, y = t.p0[1] + rise + 0.13 * tau + 0.18 * Math.sin(s * 2.3);
        t.root.rotation.y = Math.atan2(-(x - t.at[0]), -(z - t.at[2])); t.at = [x, y, z]; t.root.position.set(x, y, z);
        const flap = Math.sin(s * 15) * 0.95; t.R.rotation.z = flap; t.Lw.rotation.z = -flap;
        const dist = k.cam.position.distanceTo(t.root.position), a = Math.min(1, s / 1.2) * Math.max(0, Math.min(1, (118 - s) / 10)) * k.fade(dist) * Math.max(0, Math.min(1, (130 - dist) / 30));
        t.mat.opacity = a; t.body.material.opacity = a; t.hl.material.opacity = 0.4 * a; t.core.material.opacity = 0.42 * a;
        if (s > 118 || dist > 130) { t.root.visible = false; t.T0 = -1; t.done = true; } },
    },
  ];

  // ---- stand-in words, one or two each, so the talk can be tried. NOT the story's lines: those are being written by the
  // story job (docs/lore/story-brief.md) and replace every one of these. Several lean on Moon Faire's own stand-ins. ----
  W3D.PEOPLE_STANDIN = {
    odile: ['Every flame in the row leans one way tonight. There is no wind.', 'The captain’s lamps went over us like geese. He is at the jetty, past the town.'],
    bashir: ['Blue is the one that holds. I sold your Fox all I had.'],
    zofia: ['A coin, and I turn a card. Tonight I would rather not.'],
    linnet: ['You four go on after me. Nobody envies me that.'],
    otto: ['My oven draws as if it wants to leave. Have a loaf before it does.'],
    corwin: ['Shutters first, then lamps. Forty years, and I never saw them lean.'],
    ros: ['Mutton. And the other one is mutton too.'],
    tully: ['Twelve lights went over my gate, and not one of them paid.'],
    kofi: ['My coals went grey as they passed, then came back. Chestnut?'],
    bridie: ['This is the last lantern on the road. I light it every night.'],
    jory: ['My lantern got up and left me. I am not taking my eyes off this fire.'],
  };
})(window);
