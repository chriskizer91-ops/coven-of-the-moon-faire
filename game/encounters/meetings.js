// meetings.js: when a fight begins in the wild (Coven, the fights job, step 3). The meetings are unseen (Chris, November
// 19): no foes walk the land; as she walks the wilds, now and then a fight simply begins. What may come, where and how
// often is the zone's data file (game/encounters/zone-1.js); this only counts the ground she covers.
//
//   const M = CovenMeetings.create({ W, land, data, party, onMeet })
//   M.check()        looks at where she is now (it also looks by itself five times a second)
//   M.calm()         nothing for the zone's calm metres from here (after a fight)
//   M.hold(on)       stop counting (while a fight or a menu is up); M.held
//   M.force()        a meeting now, where she stands (for the checks)
//   M.numbers()      { walked, wild, meetings, where, toNext } for the checks
//   onMeet(meeting)  meeting = { where, name, foes: ['wisp', ...], foeLevel: [low, high], arena, x, z }
//
// How it counts: only ground covered in the wilds, outside every place's ground and the camp's meadow (and the zone's
// margin past them). After a fight, nothing for `calm` metres. Then each metre has the same small chance, set so a
// meeting comes every `every` metres on average where she is (more often in the fen than near home). A jump (a fall
// back to the camp, a switch of witch) is not counted as walking.
(function () {
  'use strict';
  function create(o) {
    const W = o.W, land = o.land, D = o.data, party = o.party, M = W.P.M;
    const rand = o.rand || Math.random;
    const MD = land.mapData(), rects = land.rects, flats = MD.flats;   // (the land's map data, read once)
    let last = null, held = false, calmLeft = D.calm, need = -Math.log(1 - rand()), have = 0, meetings = 0, walked = 0, wild = 0, where = null;
    const at = () => ({ x: M.x(W.io.px), z: M.z(W.io.py) });
    // inside a place's ground or the camp's meadow, or within the margin of one
    const inside = (x, z, m) => rects.some((q) => x > q.x0 - m && x < q.x1 + m && z > q.z0 - m && z < q.z1 + m) || flats.some((f) => Math.hypot(x - f.x, z - f.z) < f.r + m);
    // where she is, by the data file's list: the first that fits
    function whereAt(x, z) {
      const k = MD.kind(x, z);
      for (const w of D.where) {
        if (w.test && !w.test(x, z)) continue;
        if (w.kind && !(k[w.kind] > 0.5)) continue;
        return w;
      }
      return D.where[D.where.length - 1];
    }
    const pick = (list) => { let t = rand() * list.reduce((a, b) => a + b[1], 0); for (const [v, n] of list) { t -= n; if (t <= 0) return v; } return list[list.length - 1][0]; };
    const nearest = (x, z) => D.arenas.reduce((a, b) => (Math.hypot(b.at[0] - x, b.at[1] - z) < Math.hypot(a.at[0] - x, a.at[1] - z) ? b : a));
    function meeting(x, z) {
      const w = whereAt(x, z), L = party.level;
      // the foes' levels: the place's, within the zone's, never more than `above` over the party's own
      const hi = Math.max(D.levels[0], Math.min(w.levels[1], D.levels[1], L + D.above)), lo = Math.min(hi, Math.max(w.levels[0], D.levels[0]));
      const a = nearest(x, z);
      return { where: w.id, name: w.name, foes: pick(w.packs).slice(), foeLevel: [lo, hi], arena: a.id, arenaName: a.name, x, z };
    }
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
              if (have >= need) { last = p; meetings++; have = 0; need = -Math.log(1 - rand()); calmLeft = D.calm; const m = meeting(p.x, p.z); if (o.onMeet) o.onMeet(m); return m; }
            }
          } else calmLeft = Math.max(calmLeft, D.calm * 0.5);     // coming out of a place or the camp: a little calm first
        }
      }
      last = p; return null;
    }
    const timer = setInterval(check, 200);
    return {
      check,
      calm() { calmLeft = D.calm; have = 0; need = -Math.log(1 - rand()); last = null; },
      hold(on) { held = !!on; last = null; },
      get held() { return held; },
      force() { const p = at(); meetings++; calmLeft = D.calm; have = 0; const m = meeting(p.x, p.z); if (o.onMeet) o.onMeet(m); return m; },
      whereAt, inside,
      numbers: () => ({ walked: Math.round(walked), wild: Math.round(wild), meetings, where, calmLeft: Math.max(0, Math.round(calmLeft)), toNext: +(need - have).toFixed(2) }),
      stop() { clearInterval(timer); },
    };
  }
  window.CovenMeetings = { create };
})();
