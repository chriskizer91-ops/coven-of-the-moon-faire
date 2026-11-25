// draw.js: who is met (Coven of the Moon Faire, the fights job, step 4). The one place that decides what a meeting in
// the wilds is: which foes, at which levels, and what the fight is worth. The land asks it (game/encounters/meetings.js)
// and so does the check (tools/encounter-balance.mjs), so the check plays the same fights the game does.
// It needs the battle's rules (game/battle/rules.js), a zone's numbers (zone-N.js), the slots (slots.js) and the plan.
//
//   CovenDraw.meeting(zone, { where, stretch, level, rand })   -> { where, name, foes, foeLevel: [low, high], reward, worth, slot }
//   CovenDraw.stretchFor(D, level)      the stretch of the zone a party of that level is fighting in (for the check)
//   CovenDraw.grounds(D, level)         [[where, weight]]: how much of the zone's fighting each kind of ground takes
//   CovenDraw.slotChances(zone, where, level)   [{ slot, p }]: the chance a meeting on this ground is each slot's
//   CovenDraw.base(pack)                a pack's experience at level 1, before the zone's `reward`
//   CovenDraw.often(zone), .every(zone, where), .reward(zone), .calm(zone), .first(), .planFights(zone)
//                                       fights-tune: how often meetings come now (the plan's `wilds`), and what follows from it
//
// THE RULE THAT KEEPS THE BALANCE STEADY. A slot's fight is given the experience and shards of the ordinary fights it
// takes the place of: on this ground, at these levels, times the slot's `worth`. So it is the same whether a slot is on
// or off, and whichever creature fills it. And a fight worth 3 uses up the ground of 3 meetings (meetings.js).
(function (G) {
  'use strict';
  const RL = () => G.BattleRules, SIM = () => G.BattleSim, PLAN = () => G.COVEN_PLAN || { share: { alone: 0.2, both: 1 / 6 }, shareCap: 0.6 };
  const zoneOf = (z) => (typeof z === 'string' ? G.COVEN_ENCOUNTERS[z] : z);
  // a foe's experience at level 1 ('bramble?' is any of the Bramble Horror's four forms)
  const xp1 = (id, band) => { if (id === 'bramble?') { const fs = SIM().BRAMBLE_FORMS[band] || SIM().BRAMBLE_FORMS[3]; return fs.reduce((a, f) => a + RL().FOES[f].xp, 0) / fs.length; } return RL().FOES[id].xp; };
  const base = (pack, band) => pack.reduce((a, id) => a + xp1(id, band), 0);
  // the ordinary fights of a kind of ground: their average experience at level 1
  const meanBase = (w, band) => { let a = 0, n = 0; for (const [p, k] of w.packs) { a += base(p, band) * k; n += k; } return a / n; };
  const pick = (list, rand) => { let t = rand() * list.reduce((a, b) => a + b[1], 0); for (const [v, n] of list) { t -= n; if (t <= 0) return v; } return list[list.length - 1][0]; };
  // how much of the zone's fighting each kind of ground takes (its `part`), for a party of this level: a ground with
  // levels of its own (zone 1) counts while the party's level is inside them
  function grounds(D, level) {
    const all = D.where.filter((w) => w.part > 0);
    const fit = all.filter((w) => !w.levels || level == null || (level >= w.levels[0] && level <= w.levels[1]));
    return (fit.length ? fit : all).map((w) => [w, w.part]);
  }
  function stretchFor(D, level) {
    if (!D.stretches) return null;
    let best = D.stretches[D.stretches.length - 1];
    for (const s of D.stretches) if (s.levels[0] <= level && (best.levels[0] > level || s.levels[0] >= best.levels[0])) best = s;
    return best;
  }
  // the chance that a meeting on this ground is a slot's creature
  function slotChances(zone, where, level) {
    const D = zoneOf(zone), S = G.COVEN_SLOTS; if (!S) return [];
    const on = S.on(D.id), share = on.length > 1 ? PLAN().share.both : PLAN().share.alone, out = [];
    for (const s of on) {
      if (s.met.indexOf(where.id) < 0 || level < (s.from || 1)) continue;
      const part = D.where.reduce((a, w) => a + (s.met.indexOf(w.id) >= 0 ? w.part || 0 : 0), 0) || 1;
      const e = Math.min(PLAN().shareCap || 0.6, share / part), w = s.worth || 1;     // its share of this ground's fighting, counted in ordinary fights
      out.push({ slot: s, p: e / (w - e * (w - 1)) });                                 // and so its share of this ground's meetings
    }
    return out;
  }
  // ---- fights-tune (November 25): how often a meeting comes, from the plan's `wilds` (game/encounters/plan.js) ----
  // own(D): the zone's own average metres between meetings, its grounds' `every` weighted by `part` (what its `reward`
  // was set for). often(D): how many times as often meetings come now (the plan's wilds.every against that; 1 with no
  // plan). A ground's metres between meetings, and what an ordinary meeting gives, are both divided by it, so a
  // kilometre walked gives what it gave before and the level at each big fight does not move
  const W = () => PLAN().wilds || {};
  const own = (D) => { let a = 0, n = 0; for (const w of D.where) if (w.part > 0 && w.every) { a += w.every * w.part; n += w.part; } return n ? a / n : 0; };
  const often = (z) => { const D = zoneOf(z), o = own(D), e = D.wildsEvery || W().every; return o && e ? o / e : 1; };
  const every = (z, w) => w.every / often(z);
  const reward = (z) => zoneOf(z).reward / often(z);
  const calm = (z) => (W().calm != null ? W().calm : zoneOf(z).calm);
  const first = () => W().first || 0;
  const planFights = (zid) => ((G.COVEN_PLAN || {}).fights || {})[zid] * often(zid);
  function meeting(zone, o) {
    const D = zoneOf(zone), w = o.where, L = o.level, rand = o.rand || Math.random, band = D.band || 1;
    // the foes' levels: the stretch's (or the ground's), within the zone's, never more than `above` over the party's own
    const lv = (o.stretch && o.stretch.levels) || w.levels || D.levels;
    const hi = Math.max(D.levels[0], Math.min(lv[1], D.levels[1], L + D.above)), lo = Math.min(hi, Math.max(lv[0], D.levels[0]));
    let r = rand(), slot = null;
    for (const c of slotChances(D, w, L)) { if (r < c.p) { slot = c.slot; break; } r -= c.p; }
    const ordinary = meanBase(w, band), R = reward(D);      // fights-tune: what a meeting gives, scaled with how often they come (was D.reward)
    if (slot) return { where: w.id, name: w.name, foes: slot.pack.slice(), foeLevel: [lo, hi], worth: slot.worth || 1, slot: slot.slot,
      reward: R * (slot.worth || 1) * ordinary / base(slot.pack, band) };
    return { where: w.id, name: w.name, foes: pick(w.packs, rand).slice(), foeLevel: [lo, hi], worth: 1, slot: null, reward: R };
  }
  // fights-tune: own, often, every, reward, calm, first, planFights added (see above)
  G.CovenDraw = { meeting, grounds, stretchFor, slotChances, base, meanBase, pick, own, often, every, reward, calm, first, planFights };
})(typeof globalThis !== 'undefined' ? globalThis : window);
