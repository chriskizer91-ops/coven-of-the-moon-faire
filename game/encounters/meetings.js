// meetings.js: when a fight begins in the wild (Coven, the fights job, steps 3 and 4). The meetings are unseen (Chris,
// November 19): no foes walk the land; as she walks the wilds, now and then a fight simply begins. What may come, where
// and how often is the zone's data file (game/encounters/zone-N.js); who it is, is decided by game/encounters/draw.js
// (the slots' creatures among them); this only counts the ground she covers and knows what kind of ground it is.
//
//   const M = CovenMeetings.create({ W, land, data, party, onMeet })
//   M.check()        looks at where she is now (it also looks by itself five times a second)
//   M.calm(n)        nothing for the zone's calm metres from here (after a fight; n: a fight worth n uses up n meetings)
//   M.hold(on)       stop counting (while a fight or a menu is up); M.held
//   M.force(o)       a meeting now, where she stands (for the checks); o.slot: 'A' or 'B' forces that slot's creature
//   M.numbers()      { walked, wild, meetings, where, toNext } for the checks
//   M.spot(at)       a spot from a data file, [x, z] or ['place id', px, py] or 'ZONE4.bramble.at', as [x, z] in the zone's metres (or null)
//   onMeet(meeting)  meeting = { where, name, stretch, foes: ['wisp', ...], foeLevel: [low, high], reward, worth, slot, arena, x, z }
//
// How it counts: only ground covered in the wilds, outside every place's ground and the camp's meadow (and the zone's
// margin past them). After a fight, nothing for `calm` metres. Then each metre has the same small chance, set so a
// meeting comes every `every` metres on average where she is (more often in the fen than near home). A jump (a fall
// back to the camp, a switch of witch) is not counted as walking.
// What kind of ground she is on (step 4), the first of the zone's `where` that fits:
//   test: (x, z) => ...   a test of her spot (zone 1)          kind: 'fen'     the land's own kind under her feet
//   road: 16              within that many metres of a road     near: ['place id', 300]   that near a place's edge
//   far: 430              farther than that from every place
// And how strong the foes are, where the zone goes by how far along she is: the first of its `stretches` that fits.
(function () {
  'use strict';
  function create(o) {
    const W = o.W, land = o.land, D = o.data, party = o.party, M = W.P.M;
    const rand = o.rand || Math.random;
    const MD = land.mapData(), rects = land.rects, flats = MD.flats;   // (the land's map data, read once)
    const parts = {}; for (const p of W.P.parts || []) parts[p.id] = p;
    let last = null, held = false, calmLeft = D.calm, need = -Math.log(1 - rand()), have = 0, meetings = 0, walked = 0, wild = 0, where = null;
    const at = () => ({ x: M.x(W.io.px), z: M.z(W.io.py) });
    // a spot from a data file: [x, z], or ['place id', px, py] in that place's own painting (null if the place is not on this land)
    // or 'ZONE4.bramble.at': a spot another file has worked out and left under window.W3D (null until it is there)
    const spot = (a) => { if (!a) return null;
      if (typeof a === 'string') { let v = window.W3D; for (const k of a.split('.')) v = v == null ? null : v[k]; return v && v.length >= 2 ? [v[0], v[1]] : null; }
      if (typeof a[0] !== 'string') return [a[0], a[1]]; const p = parts[a[0]]; return !p ? null : a[1] == null ? [p.ox, p.oz] : [p.ox + p.P.M.x(a[1]), p.oz + p.P.M.z(a[2])]; };
    // inside a place's ground or the camp's meadow, or within the margin of one
    const inside = (x, z, m) => rects.some((q) => x > q.x0 - m && x < q.x1 + m && z > q.z0 - m && z < q.z1 + m) || flats.some((f) => Math.hypot(x - f.x, z - f.z) < f.r + m);
    // metres to a place's edge (0 inside it; a place that is not on this land is infinitely far), to the nearest place, to the nearest road
    const rectD = (q, x, z) => Math.hypot(Math.max(q.x0 - x, 0, x - q.x1), Math.max(q.z0 - z, 0, z - q.z1));
    const placeD = (id, x, z) => (parts[id] ? rectD(parts[id], x, z) : 1e9);
    const anyPlaceD = (x, z) => rects.reduce((d, q) => Math.min(d, rectD(q, x, z)), 1e9);
    const SEG = []; for (const r of MD.roads || []) for (let i = 1; i < r.pts.length; i++) SEG.push([r.pts[i - 1][0], r.pts[i - 1][1], r.pts[i][0], r.pts[i][1]]);
    const roadD = (x, z) => { let d = 1e9; for (const [ax, az, bx, bz] of SEG) { const dx = bx - ax, dz = bz - az, t = Math.max(0, Math.min(1, ((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz || 1))); d = Math.min(d, Math.hypot(x - ax - dx * t, z - az - dz * t)); } return d; };
    const fits = (w, x, z, k) => !(w.test && !w.test(x, z)) && !(w.kind && !(k[w.kind] > 0.5)) && !(w.road != null && roadD(x, z) > w.road) && !(w.near && placeD(w.near[0], x, z) > w.near[1]) && !(w.far != null && anyPlaceD(x, z) < w.far);
    // where she is, by the data file's list: the first that fits
    function whereAt(x, z) { const k = MD.kind(x, z); for (const w of D.where) if (fits(w, x, z, k)) return w; return D.where[D.where.length - 1]; }
    function stretchAt(x, z) { if (!D.stretches) return null; for (const s of D.stretches) if (!s.near || placeD(s.near[0], x, z) <= s.near[1]) return s; return D.stretches[D.stretches.length - 1]; }
    const ARENAS = D.arenas.map((a) => ({ id: a.id, name: a.name, at: spot(a.at) })).filter((a) => a.at);
    const nearest = (x, z) => (ARENAS.length ? ARENAS : [{ id: D.arenas[0].id, name: D.arenas[0].name, at: [0, 0] }]).reduce((a, b) => (Math.hypot(b.at[0] - x, b.at[1] - z) < Math.hypot(a.at[0] - x, a.at[1] - z) ? b : a));
    function meeting(x, z, force) {
      const w = whereAt(x, z), st = stretchAt(x, z), a = nearest(x, z);
      let m = window.CovenDraw.meeting(D, { where: w, stretch: st, level: party.level, rand });
      // (for the checks) a slot's creature, whatever the ground: with the experience of this ground's ordinary fights
      if (force && force.slot) { const s = (window.COVEN_SLOTS.zones[D.id] || {})[force.slot]; if (s) m = Object.assign(m, { foes: s.pack.slice(), slot: s.slot, worth: s.worth || 1, reward: D.reward * (s.worth || 1) * window.CovenDraw.meanBase(w, D.band) / window.CovenDraw.base(s.pack, D.band) }); }
      return Object.assign(m, { stretch: st ? st.id : null, arena: a.id, arenaName: a.name, x, z });
    }
    // after a meeting: the calm, and the count to the next one. A fight worth n uses up the ground of n meetings
    function spend(n) { n = Math.max(1, n || 1); calmLeft = D.calm * n; have = 0; need = 0; for (let i = 0; i < n; i++) need += -Math.log(1 - rand()); }
    function check() {
      if (held || (W.paused)) { last = null; return null; }
      const p = at();
      if (last) {
        const d = Math.hypot(p.x - last.x, p.z - last.z);
        if (d > 0.05 && d < 40) {                                   // (a longer step is a jump, not a walk)
          walked += d;
          if (!inside(p.x, p.z, D.margin)) {
            wild += d;
            const w = whereAt(p.x, p.z); where = w.id;
            if (calmLeft > 0) calmLeft -= d;
            else {
              have += d / Math.max(10, w.every - D.calm);          // so that, with the calm, one comes every `every` metres on average
              if (have >= need) { last = p; meetings++; const m = meeting(p.x, p.z); spend(m.worth); if (o.onMeet) o.onMeet(m); return m; }
            }
          } else calmLeft = Math.max(calmLeft, D.calm * 0.5);     // coming out of a place or the camp: a little calm first
        }
      }
      last = p; return null;
    }
    const timer = setInterval(check, 200);
    return {
      check, spot, placeD, roadD,
      calm(n) { spend(n); last = null; },
      hold(on) { held = !!on; last = null; },
      get held() { return held; },
      force(f) { const p = at(); meetings++; const m = meeting(p.x, p.z, f); spend(m.worth); if (o.onMeet) o.onMeet(m); return m; },
      whereAt, stretchAt, inside,
      numbers: () => ({ walked: Math.round(walked), wild: Math.round(wild), meetings, where, calmLeft: Math.max(0, Math.round(calmLeft)), toNext: +(need - have).toFixed(2) }),
      stop() { clearInterval(timer); },
    };
  }
  window.CovenMeetings = { create };
})();
