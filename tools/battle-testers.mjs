// battle-testers.mjs: Moon Faire's eight pretend players, on this battle. The second balance check (the first is
// battle-balance.mjs, Envoi's 51 targets).
//
//   node tools/battle-testers.mjs [--n 300] [--two]
//
// Moon Faire's eight (moon-faire game/plan/testers/testers.js, Chris, November 15) are five levels of attentiveness, the top
// three each in two play styles. Three of them ARE the battle's own three players, as in Moon Faire:
//   careless = the battle's careless; attentive, careful = its attentive; expert, careful = its expert.
// The other five are the same thinking with Moon Faire's other habits:
//   very careless      presses any lit button, at any foe or friend; never runs
//   attentive, bold    the attentive player, but she heals late (a friend under about a third, not half) and spends on hitting
//   focused, careful   the attentive player with every tool: Europa's ghost when Kore is low, Crazy Quilt for two small foes,
//                      Kore and Callisto played as the expert plays them
//   focused, bold      the same tools with the bold habits
//   expert, bold       the expert with thinner margins: she heals later still
// It plays every fight of the 51 targets (each fight at each level once) with all eight, and checks:
//   1. every tester finishes every fight: no fight runs out of turns, nothing breaks;
//   2. the more attentive the player, the more she wins: careless <= attentive <= focused <= expert in the careful line,
//      and attentive <= focused <= expert in the bold line (3 points of chance allowed);
//   3. an ordinary wild fight costs something and not everything: what an attentive player has left after one.
// And it reports, without failing, two things Moon Faire's testers found that do not hold here (see docs/slips/fights.md):
//   - very careless against careless: pressing any lit button often beats the battle's careless player, who mostly
//     attacks and seldom heals (so it is in Envoi's own battle, too);
//   - bold against careful: Moon Faire found bold simply weaker; here healing late and hitting more often wins more
//     against a great foe alone (as it already does against the Colossus in Envoi's own battle).
// Halcyon's ambush and the finale are played and shown, but not judged: neither fight is in the battle yet.
// It prints a table and exits with 1 if a check fails. The seeds are fixed, so the same numbers give the same table.
import { createRequire } from 'module';
import path from 'path';
const require = createRequire(import.meta.url);
const R = path.resolve(new URL('..', import.meta.url).pathname);
for (const f of ['rules', 'engine', 'sim']) require(path.join(R, 'game/battle', f + '.js'));
const S = globalThis.BattleSim, E = globalThis.BattleEngine, P = S.POLICIES;
const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i < 0 ? d : args[i + 1]; };
const N = +opt('--n', 300), NOISE = 0.03;
if (args.includes('--two')) S.setParty(['io', 'jester']);

const HEALS = new Set(['mend', 'salve', 'waxing', 'garden', 'hheal', 'herb:moonpetal', 'herb:lavender']);
// the bold habit: a heal on a friend who is not yet under `at` of her HP becomes the witch's best blow instead
function bold(pol, at) {
  return (B, s, rand) => {
    const c = pol(B, s, rand), id = c[0];
    if (!HEALS.has(id)) return c;
    const party = B.heroes.filter(B.alive), low = party.filter((h) => h.hp < h.maxHp * at);
    const single = id === 'mend' || id === 'salve' || id === 'herb:moonpetal' || id === 'hheal';
    const t = single ? (c[1] ? B.unit(c[1]) : s.unit) : null;
    if (single ? t && t.hp < t.maxHp * at : low.length >= 2) return c;
    const o = (x) => s.options.find((y) => y.id === x && y.ok), f = S.focusFoe(B).key;
    for (const x of ['thorn', 'crescent', 'flame', 'attack', 'rebuke', 'jab']) if (o(x)) return [x, f];
    return c;
  };
}
// Kore, Europa and Callisto as the expert plays them; Io (and Sol) as the attentive player does
const focused = (B, s, rand) => {
  const id = s.unit.id;
  if (id === 'jester') return S.jesterPolicy(B, s, rand, 'expert');
  if (id === 'fox') return S.foxPolicy(B, s, rand, 'expert');
  if (id === 'ranger') return S.rangerPolicy(B, s, rand, 'expert');
  return P.sensible(B, s, rand);
};
// any lit button but running, at anyone it can be aimed at
const mash = (B, s, rand) => {
  const lit = s.options.filter((o) => o.ok && o.id !== 'flee');
  const o = lit[Math.floor(rand() * lit.length)];
  return [o.id, o.targets.length ? o.targets[Math.floor(rand() * o.targets.length)] : null];
};
const TESTERS = {
  'very careless': mash,
  careless: P.careless,
  'attentive, careful': P.sensible,
  'attentive, bold': bold(P.sensible, 0.35),
  'focused, careful': focused,
  'focused, bold': bold(focused, 0.35),
  'expert, careful': P.expert,
  'expert, bold': bold(P.expert, 0.3),
};
const NAMES = Object.keys(TESTERS);

// one fight, played to its end by one tester: as the simulator's playOne, with the tester in place of a play style
function play(fight, level, pol, seed) {
  const rand = E.rng(seed * 2654435761 + 97);
  const B = E.create(Object.assign({ seed }, S.FIGHTS[fight].setup(level, rand)));
  let s, menus = 0, guard = 0;
  while ((s = B.turn()).type !== 'end') {
    if (s.type === 'choose') { menus++; const [id, t] = pol(B, s, rand); B.choose(id, t); }
    if (++guard > 20000) break;
  }
  const r = B.result(); r.time += menus * S.THINK; return r;
}
const fights = [];
for (const t of S.TARGETS) if (!fights.some((f) => f.fight === t.fight && f.level === t.level)) fights.push({ fight: t.fight, level: t.level });

const t0 = Date.now(), table = {}, broke = [];
for (const F of fights) {
  table[F.fight + ' ' + F.level] = {};
  for (const name of NAMES) {
    let win = 0, stuck = 0, mins = [];
    for (let i = 0; i < N; i++) {
      let r;
      try { r = play(F.fight, F.level, TESTERS[name], 1 + i); } catch (e) { broke.push(name + ' in ' + F.fight + ' ' + F.level + ': ' + e.message); stuck++; continue; }
      if (r.outcome === 'win' || r.outcome === 'retreat') win++;
      if (r.outcome === 'stalemate' || !r.outcome) stuck++;
      mins.push(r.time / 60);
    }
    mins.sort((a, b) => a - b);
    table[F.fight + ' ' + F.level][name] = { win: win / N, stuck, median: mins[Math.floor(mins.length / 2)] || 0 };
  }
}
const pct = (x) => Math.round(x * 100);
const short = { 'very careless': 'v.care', careless: 'care', 'attentive, careful': 'att', 'attentive, bold': 'att.b', 'focused, careful': 'foc', 'focused, bold': 'foc.b', 'expert, careful': 'exp', 'expert, bold': 'exp.b' };
console.log('Wins out of 100, ' + N + ' fights each:');
console.log('fight'.padEnd(20) + NAMES.map((n) => short[n].padStart(7)).join(''));
const fails = [];
const ladder = [['careless', 'attentive, careful', 'focused, careful', 'expert, careful'], ['attentive, bold', 'focused, bold', 'expert, bold']];
const notYet = (k) => /^(halcyon|finale) /.test(k), notes = { mash: [], bold: [] };
const pairs = [['attentive, bold', 'attentive, careful'], ['focused, bold', 'focused, careful'], ['expert, bold', 'expert, careful']];
for (const k in table) {
  const row = table[k];
  console.log((k + (notYet(k) ? ' *' : '')).padEnd(20) + NAMES.map((n) => String(pct(row[n].win)).padStart(7)).join(''));
  for (const n of NAMES) if (row[n].stuck) fails.push(k + ': ' + n + ' did not finish ' + row[n].stuck + ' fights');
  if (notYet(k)) continue;
  for (const L of ladder) for (let i = 1; i < L.length; i++) if (row[L[i]].win + NOISE < row[L[i - 1]].win) fails.push(k + ': ' + L[i] + ' (' + pct(row[L[i]].win) + ') wins less than ' + L[i - 1] + ' (' + pct(row[L[i - 1]].win) + ')');
  if (row['very careless'].win > row.careless.win + NOISE) notes.mash.push(k + ' ' + pct(row['very careless'].win) + ' to ' + pct(row.careless.win));
  for (const [b, c] of pairs) if (row[b].win > row[c].win + NOISE) notes.bold.push(k + ' ' + b.split(',')[0] + ' ' + pct(row[b].win) + ' to ' + pct(row[c].win));
}
// 4. what an ordinary wild fight costs: the attentive player, a wild pack in the middle of each band, at the party's level
console.log('\nAfter an ordinary wild fight (a pack, the attentive player, ' + N + ' fights): what the party has left');
for (const L of [3, 8, 13, 18]) {
  let hp = 0, mp = 0, n = 0, mpN = 0;
  for (let i = 0; i < N; i++) {
    const r = play('packs', L, P.sensible, 5000 + i); if (r.outcome !== 'win') continue;
    for (const h of r.heroes) { hp += h.hp / h.maxHp; if (h.maxMp) { mp += h.mp / h.maxMp; mpN++; } n++; }
  }
  const H = hp / n, M = mp / mpN;
  console.log('  level ' + String(L).padEnd(3) + pct(H) + '% of the HP and ' + pct(M) + '% of the MP');
  if (H > 0.97 || H < 0.4) fails.push('an ordinary fight at level ' + L + ' leaves ' + pct(H) + '% of the HP (want between 40% and 97%)');
}
for (const b of broke.slice(0, 5)) fails.push('broke: ' + b);
console.log('\n* not in the battle yet: shown, not judged');
console.log('\nReported, not failed:\n  very careless wins more than careless in ' + notes.mash.length + ' fights: ' + notes.mash.join('; ') +
  '\n  bold wins more than careful in ' + notes.bold.length + ' cases: ' + notes.bold.join('; '));
console.log('\n' + (fails.length ? fails.length + ' checks failed:\n  ' + fails.join('\n  ') : 'every check passed') + '\n' + fights.length + ' fights x 8 testers x ' + N + ', in ' + ((Date.now() - t0) / 1000).toFixed(0) + ' s');
process.exit(fails.length ? 1 : 0);
