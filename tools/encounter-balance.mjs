// encounter-balance.mjs: the whole game's levels and the creatures' slots, checked by playing (Coven of the Moon Faire,
// the fights job, step 4). One command runs all three settings:
//
//   node tools/encounter-balance.mjs [--n 60] [--quick] [--slots]
//
// It walks pretend parties through the four zones. Each meets the fights the game itself would bring
// (game/encounters/draw.js: the same code the land uses), by each zone's numbers (game/encounters/zone-N.js), and each
// fight is played to its end by the battle's own pretend players (game/battle/sim.js): the careless one, the attentive
// one ("sensible" in the code) and the expert. It does this three times:
//     A on        the game as shipped: slot A's creature in every zone
//     A and B on  both slots' creatures
//     neither     no new creatures
// and for each it says how many fights it takes to reach each zone's gate level, and how often each kind of player
// loses a fight. Then it checks them against the plan's targets (game/encounters/plan.js):
//   1. with A on, each zone takes about the fights the plan says;
//   2. with A on, each kind of player loses about as often as the plan allows;
//   3. the other two settings stay close to A on (in fights, and in how often a fight is lost);
//   4. each slot's own fights are about as dangerous as the fights they take the place of;
//   5. each big fight, at its level, is won about as often as the plan says.
// --slots prints only the slots' table (4), for setting a new creature's numbers. --quick plays fewer journeys.
// On a journey the party carries its hurts and its spent MP from fight to fight, as on the land, and rests when it is
// worn down: the careless player only when the party is under a quarter of its health, the attentive one under 55% (or
// when Io has under an eighth of her MP), the expert under 65%. A rest makes everyone whole and costs nothing here (on the land
// it costs the walk back to a fire). A lost fight wakes the party whole at the camp, as on the land. No herbs are used
// on a journey (on the land the party has a few). The slots' table and the big fights begin each fight whole.
// --slots prints only the slots' table, --gates only the big fights: for setting a new creature's or a fight's numbers.
// The seeds are fixed, so the same numbers always give the same table. It exits with 1 if a target is missed.
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const R = path.resolve(new URL('..', import.meta.url).pathname);
globalThis.window = globalThis;
for (const f of ['battle/rules', 'battle/engine', 'battle/sim', 'encounters/words', 'encounters/plan', 'encounters/foes', 'encounters/slots',
  'encounters/zone-1', 'encounters/zone-2', 'encounters/zone-3', 'encounters/zone-4', 'encounters/draw']) require(path.join(R, 'game', f + '.js'));
const G = globalThis, RL = G.BattleRules, S = G.BattleSim, E = G.BattleEngine, DRAW = G.CovenDraw, PLAN = G.COVEN_PLAN, SLOTS = G.COVEN_SLOTS, ZONES = G.COVEN_ENCOUNTERS;
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : +args[i + 1]; };
const QUICK = args.includes('--quick'), ONLY_SLOTS = args.includes('--slots'), ONLY_GATES = args.includes('--gates'), N = opt('--n', QUICK ? 16 : 60), NF = opt('--fights', QUICK ? 200 : 500);
const PLAYERS = ['careless', 'sensible', 'expert'], SAY = { careless: 'careless', sensible: 'attentive', expert: 'expert' };
const pct = (x) => (x * 100).toFixed(x < 0.0995 ? 1 : 0) + '%';
const flagsAt = (L) => ({ party: true, refit: L > 5, envoi: L > 10, stoop: L > 15 });
const party = (L) => RL.PARTY.map((id) => ({ id, level: L }));

// one fight, played to its end: { outcome, xp }
function play(setup, policy, seed) {
  const rand = E.rng(seed * 2654435761 + 97), B = E.create(Object.assign({ seed }, setup)), pol = S.POLICIES[policy];
  let s, g = 0, menus = 0;
  while ((s = B.turn()).type !== 'end') { if (s.type === 'choose') { menus++; const [id, t] = pol(B, s, rand); B.choose(id, t); } if (++g > 20000) break; }
  const r = B.result(); r.minutes = (r.time + menus * S.THINK) / 60; return r;
}
// a meeting in the wilds as the land would start it
function wildSetup(D, m, L, rand, P) {
  const [lo, hi] = m.foeLevel;
  return { party: P || party(L), foes: m.foes.map((id) => ({ id: S.formOf(id, D.band, rand), level: lo + Math.floor(rand() * (hi - lo + 1)) })), flags: flagsAt(L), herbs: P ? {} : S.BAGS.wild, ends: { canFlee: true }, reward: m.reward };
}
// a big fight as the land would start it (a gate, one of its forms, or another big fight)
function bigSetup(g, L, form) {
  const f = form || g, ends = Object.assign({}, f.ends || g.ends || {}); if (g.canFlee) ends.canFlee = true;
  if (g.kind === 'greatWraith') return S.FIGHTS.greatWraith.setup(L);
  return { party: party(L), foes: (f.foes || g.foes).map((x) => Object.assign({}, x)), flags: flagsAt(L), herbs: S.BAGS.gate, ends };
}
const won = (r) => r.outcome === 'win' || r.outcome === 'retreat';
// how often a big fight is won at a level, and what it gives
function bigRun(g, L, policy, n) {
  let w = 0, xp = 0, mins = 0;
  for (let i = 0; i < n; i++) {
    let ok = true, got = 0, m = 0;
    for (const form of g.forms || [null]) { const r = play(bigSetup(g, L, form), policy, 9000 + i * 7 + (form ? g.forms.indexOf(form) : 0)); m += r.minutes; if (!won(r)) { ok = false; break; } got += r.xp; }
    if (ok) { w++; xp += got; } mins += m;
  }
  return { win: w / n, xp: w ? xp / w : 0, minutes: mins / n };
}

// ---- one party's journey through a zone: fights until it is the gate's level, its hurts carried from fight to fight ----
const REST = { careless: { hp: 0.25, mp: 0 }, sensible: { hp: 0.55, mp: 0.12 }, expert: { hp: 0.65, mp: 0.12 } };
function journey(zoneId, L0, xp0, policy, seed) {
  const D = ZONES[zoneId], rand = E.rng(seed), goal = PLAN.gateLevel[zoneId], H = RL.HEROES;
  let L = L0, xp = xp0, fights = 0, lost = 0, fled = 0, slotF = 0, worth = 0, rests = 0, hp = {}, mp = {};
  const maxHp = (id) => Math.round(H[id].hp * RL.scale(L)), maxMp = (id) => Math.round(H[id].mp * RL.mpScale(L));
  const gain = (n) => { const was = L; xp += n; while (L < RL.MAX_LEVEL && xp >= RL.xpNeed(L)) { xp -= RL.xpNeed(L); L++; }
    if (L > was) for (const id of RL.PARTY) { if (hp[id] != null) hp[id] += Math.round(H[id].hp * (RL.scale(L) - RL.scale(was))); if (mp[id] != null) mp[id] += Math.round(H[id].mp * (RL.mpScale(L) - RL.mpScale(was))); } };
  const health = () => RL.PARTY.reduce((a, id) => a + (hp[id] == null ? 1 : hp[id] / maxHp(id)), 0) / RL.PARTY.length;
  const P = () => RL.PARTY.map((id) => { const u = { id, level: L }; if (hp[id] != null) u.hp = hp[id]; if (mp[id] != null && H[id].mp) u.mp = mp[id]; return u; });
  const things = (D.things || []).slice(); let nextThing = 4;      // (zone 2's stones: met early, a few fights apart)
  let guard = 0;
  while (L < goal && guard++ < 600) {
    const k = REST[policy];
    if (health() < k.hp || (k.mp && mp.io != null && mp.io < maxMp('io') * k.mp)) { hp = {}; mp = {}; rests++; }
    let r;
    if (things.length && fights >= nextThing) {
      const t = things.shift(); nextThing = fights + 4;
      const hi = Math.max(D.levels[0], Math.min(t.levels[1], L + (t.above || 0))), lo = Math.min(hi, t.levels[0]);
      const road = D.where.find((w) => w.id === 'road') || D.where[0];
      r = play({ party: P(), foes: t.foes.map((id) => ({ id, level: lo + Math.floor(rand() * (hi - lo + 1)) })), flags: flagsAt(L), herbs: {}, ends: { canFlee: true },
        reward: D.reward * (t.worth || 1) * DRAW.meanBase(road, D.band) / DRAW.base(t.foes, D.band) }, policy, seed * 31 + fights);
      worth += 1;
    } else {
      const gs = DRAW.grounds(D, L), w = DRAW.pick(gs, rand), m = DRAW.meeting(D, { where: w, stretch: DRAW.stretchFor(D, L), level: L, rand });
      r = play(wildSetup(D, m, L, rand, P()), policy, seed * 31 + fights);
      if (m.slot) slotF++; worth += m.worth;
    }
    fights++;
    if (r.outcome === 'lose' || r.outcome === 'stalemate') { lost++; hp = {}; mp = {}; continue; }      // (the coven wakes at the camp, whole)
    for (const h of r.heroes) { hp[h.id] = h.hp > 0 ? h.hp : 1; if (h.maxMp) mp[h.id] = h.mp; }
    if (won(r)) gain(r.xp); else fled++;
  }
  return { fights, lost, fled, slotF, worth, rests, L, xp };
}

// ---- 4. a slot's own fights against the fights they take the place of ----
function slotTable() {
  const rows = [];
  for (const z of PLAN.zones) for (const k of ['A', 'B']) {
    const D = ZONES[z], s = SLOTS.zones[z][k], w = D.where.find((x) => s.met.indexOf(x.id) >= 0), out = { zone: z, slot: k, job: s.job, levels: [] };
    const lo = Math.max(D.levels[0] + (z === 'zone-1' ? 1 : 1), s.from || 1), Ls = [lo, Math.min(D.levels[1] - 1, lo + 2)];
    for (const L of Ls) {
      const row = { L };
      for (const pol of ['careless', 'sensible']) {
        const a = { lose: 0, min: [] }, b = { lose: 0, min: [] };
        for (let i = 0; i < NF; i++) {
          const rand = E.rng(77 + i * 13 + L), st = DRAW.stretchFor(D, L), wl = w.levels && (L < w.levels[0] || L > w.levels[1]) ? Object.assign({}, w, { levels: null }) : w;
          SLOTS.set('none'); const m0 = DRAW.meeting(D, { where: wl, stretch: st, level: L, rand });
          const r0 = play(wildSetup(D, m0, L, rand), pol, 100 + i); if (r0.outcome === 'lose') a.lose++; a.min.push(r0.minutes);
          const m1 = { foes: s.pack.slice(), foeLevel: m0.foeLevel, reward: 1 };
          const r1 = play(wildSetup(D, m1, L, rand), pol, 100 + i); if (r1.outcome === 'lose') b.lose++; b.min.push(r1.minutes);
        }
        const med = (v) => v.sort((p, q) => p - q)[Math.floor(v.length / 2)];
        row[pol] = { ordinary: a.lose / NF, slot: b.lose / NF, minOrdinary: med(a.min), minSlot: med(b.min) };
      }
      out.levels.push(row);
    }
    rows.push(out);
  }
  SLOTS.set(null);
  return rows;
}

const fails = [], t0 = Date.now();
const T = PLAN.targets;
if (!ONLY_GATES) console.log('THE SLOTS: each slot’s own fights, against the ordinary fights they take the place of (same ground, same levels, ' + NF + ' fights each)');
if (!ONLY_GATES) console.log('  zone   slot  party  careless loses: slot / ordinary   attentive loses: slot / ordinary   a fight takes (attentive, minutes): slot / ordinary');
for (const r of ONLY_GATES ? [] : slotTable()) for (const row of r.levels) {
  const c = row.careless, s = row.sensible, w = SLOTS.zones[r.zone][r.slot].worth || 1;
  console.log('  ' + r.zone.padEnd(7) + r.slot.padEnd(6) + ('L' + row.L).padEnd(7) + (pct(c.slot) + ' / ' + pct(c.ordinary)).padEnd(35) + (pct(s.slot) + ' / ' + pct(s.ordinary)).padEnd(35) + s.minSlot.toFixed(1) + ' / ' + s.minOrdinary.toFixed(1) + (w > 1 ? '   (worth ' + w + ' fights)' : ''));
  if (Math.abs(c.slot - c.ordinary) * 100 > T.slotLoss.careless) fails.push(r.zone + ' slot ' + r.slot + ' at level ' + row.L + ': the careless player loses ' + pct(c.slot) + ' of its fights, ' + pct(c.ordinary) + ' of the ordinary ones (more than ' + T.slotLoss.careless + ' points apart)');
  if (Math.abs(s.slot - s.ordinary) * 100 > T.slotLoss.sensible) fails.push(r.zone + ' slot ' + r.slot + ' at level ' + row.L + ': the attentive player loses ' + pct(s.slot) + ' of its fights, ' + pct(s.ordinary) + ' of the ordinary ones (more than ' + T.slotLoss.sensible + ' points apart)');
}

if (!ONLY_SLOTS) {
  // ---- 5. the big fights at their levels ----
  console.log('\nTHE BIG FIGHTS, each at the level it is offered at (' + NF + ' fights each): how often each kind of player wins');
  const bigs = [], gateXp = {};
  for (const z of PLAN.zones) { const D = ZONES[z]; for (const g of [D.gate].concat(D.big || [])) bigs.push([z, g, g === D.gate]); }
  for (const [z, g, main] of bigs) {
    const row = {}; for (const p of PLAYERS) row[p] = bigRun(g, g.level, p, NF);
    if (main) gateXp[z] = row.sensible.xp;
    const want = T.gates[g.id] || {};
    console.log('  ' + z.padEnd(8) + (g.name || g.id).padEnd(24) + ('level ' + g.level).padEnd(10) + PLAYERS.map((p) => (SAY[p] + ' ' + pct(row[p].win)).padEnd(17)).join('') + 'about ' + row.sensible.minutes.toFixed(1) + ' minutes; worth ' + Math.round(row.sensible.xp).toLocaleString('en-US') + ' experience (a level there asks ' + RL.xpNeed(Math.min(19, g.level)).toLocaleString('en-US') + ')');
    for (const p of PLAYERS) if (want[p] && (row[p].win < want[p][0] || row[p].win > want[p][1])) fails.push((g.name || g.id) + ': the ' + SAY[p] + ' player wins ' + pct(row[p].win) + ' (the plan: ' + pct(want[p][0]) + ' to ' + pct(want[p][1]) + ')');
  }

  // ---- 1 to 3. the journeys, at the three settings ----
  const SETTINGS = ONLY_GATES ? [] : [['A', 'A on (the game as shipped)'], ['AB', 'A and B on'], ['none', 'neither']], res = {};
  for (const [set, label] of SETTINGS) {
    SLOTS.set(set); res[set] = {};
    for (const p of PLAYERS) {
      res[set][p] = {};
      // every party comes into a zone at the last zone's gate level, with that gate's experience won
      for (const z of PLAN.zones) {
        const zi = PLAN.zones.indexOf(z); let L0 = 1, xp0 = 0;
        if (zi > 0) { const prev = PLAN.zones[zi - 1]; L0 = PLAN.gateLevel[prev]; xp0 = gateXp[prev] || 0; while (L0 < RL.MAX_LEVEL && xp0 >= RL.xpNeed(L0)) { xp0 -= RL.xpNeed(L0); L0++; } }
        const a = { fights: 0, lost: 0, fled: 0, slotF: 0, worth: 0, rests: 0, n: 0, from: L0 };
        for (let i = 0; i < N; i++) { const j = journey(z, L0, xp0, p, 1000 + i * 17 + zi * 7919); a.fights += j.fights; a.lost += j.lost; a.fled += j.fled; a.slotF += j.slotF; a.worth += j.worth; a.rests += j.rests; a.n++; }
        res[set][p][z] = { from: L0, fights: a.fights / a.n, lose: a.lost / a.fights, fled: a.fled / a.fights, slot: a.slotF / a.fights, worth: a.worth / a.n, rests: a.rests / a.n };
      }
    }
  }
  SLOTS.set(null);
  for (const [set, label] of SETTINGS) {
    console.log('\n' + label.toUpperCase() + ': fights to each gate’s level, and how often a fight is lost (' + N + ' journeys for each kind of player)');
    console.log('  zone      levels      plan   ' + PLAYERS.map((p) => (SAY[p] + ': fights, lost, rests').padEnd(30)).join('') + 'new creatures (attentive)');
    let total = 0;
    for (const z of PLAN.zones) {
      const s = res[set].sensible[z]; total += s.fights;
      console.log('  ' + z.padEnd(10) + (s.from + ' to ' + PLAN.gateLevel[z]).padEnd(12) + String(PLAN.fights[z]).padEnd(7) + PLAYERS.map((p) => { const r = res[set][p][z]; return (r.fights.toFixed(1) + ', ' + pct(r.lose) + ', ' + r.rests.toFixed(1)).padEnd(30); }).join('') + 'one fight in ' + (s.slot ? (1 / s.slot).toFixed(1) : '(none)'));
    }
    console.log('  all four zones, the attentive player: ' + Math.round(total) + ' fights (Chris: about 180)');
  }
  // the targets
  for (const z of ONLY_GATES ? [] : PLAN.zones) {
    const a = res.A.sensible[z];
    if (Math.abs(a.fights - PLAN.fights[z]) > T.fightsWithin) fails.push(z + ', A on: ' + a.fights.toFixed(1) + ' fights to level ' + PLAN.gateLevel[z] + ' (the plan: ' + PLAN.fights[z] + ', give or take ' + T.fightsWithin + ')');
    for (const p of PLAYERS) {
      const r = res.A[p][z], want = T.loss[p];
      if (r.lose < want[0] || r.lose > want[1]) fails.push(z + ', A on: the ' + SAY[p] + ' player loses ' + pct(r.lose) + ' of its fights (the plan: ' + pct(want[0]) + ' to ' + pct(want[1]) + ')');
      for (const set of ['AB', 'none']) {
        const o = res[set][p][z];
        if (p === 'sensible' && Math.abs(o.fights - a.fights) > T.settingsFights) fails.push(z + ', ' + (set === 'AB' ? 'A and B on' : 'neither') + ': ' + o.fights.toFixed(1) + ' fights, against ' + a.fights.toFixed(1) + ' with A on (more than ' + T.settingsFights + ' apart)');
        if (Math.abs(o.lose - r.lose) * 100 > T.settingsLoss) fails.push(z + ', ' + (set === 'AB' ? 'A and B on' : 'neither') + ': the ' + SAY[p] + ' player loses ' + pct(o.lose) + ', against ' + pct(r.lose) + ' with A on (more than ' + T.settingsLoss + ' points apart)');
      }
    }
  }
  if (!ONLY_GATES) console.log('\nHOW CLOSE THE OTHER TWO SETTINGS STAY TO A ON (the attentive player’s fights; each player’s chance of losing a fight, in points out of 100)');
  for (const z of ONLY_GATES ? [] : PLAN.zones) {
    const a = res.A, line = ['AB', 'none'].map((set) => (set === 'AB' ? 'A and B on: ' : 'neither: ') + (res[set].sensible[z].fights - a.sensible[z].fights >= 0 ? '+' : '') + (res[set].sensible[z].fights - a.sensible[z].fights).toFixed(1) + ' fights; ' +
      PLAYERS.map((p) => SAY[p] + ' ' + ((res[set][p][z].lose - a[p][z].lose) * 100 >= 0 ? '+' : '') + ((res[set][p][z].lose - a[p][z].lose) * 100).toFixed(1)).join(', '));
    console.log('  ' + z.padEnd(9) + line.join('     '));
  }
}
console.log('\n' + (fails.length ? fails.length + ' targets missed:\n  ' + fails.join('\n  ') : 'every target met') + '   (' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)');
process.exit(fails.length ? 1 : 0);
