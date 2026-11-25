// last-fight-balance.mjs (Coven of the Moon Faire, the last-foe job; made new here): how often a level 20 coven wins the
// last fight at each of the four settings (easy 20, medium 21, hard 22, crazy 22.8: game/battle/last-fight-data.js),
// with the battle's own pretend players. Nothing is tuned here: it reports what the established levels give.
//   node tools/last-fight-balance.mjs [--n 200]
// One go at the last fight, as the game plays it: form one (the fire and its helpers, at the setting's level; its fight
// stops at 45% of the fire's Life, zone-4.js), then the final form (the fire alone, the party back to full HP and MP).
// A go is won when both are. "As before" is the fight as it was before the setting came in: level 20, no helpers, and
// the party carrying its HP and MP from form one into the final form.
// The seeds are fixed, so the same numbers always give the same report.
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const R = path.resolve(new URL('..', import.meta.url).pathname);
globalThis.window = globalThis;
for (const f of ['battle/rules', 'battle/engine', 'battle/sim', 'encounters/words', 'encounters/foes', 'battle/last-fight-data', 'encounters/zone-4'])
  require(path.join(R, 'game', f + '.js'));
const G = globalThis, RL = G.BattleRules, E = G.BattleEngine, S = G.BattleSim, D = G.COVEN_LAST_FIGHT, Z = G.COVEN_ENCOUNTERS['zone-4'];
const n = process.argv.includes('--n') ? +process.argv[process.argv.indexOf('--n') + 1] : 200;
const L = 20, flags = { party: true, refit: true, envoi: true, stoop: true };
const fresh = () => RL.PARTY.map((id) => ({ id, level: L }));
function play(setup, policy, seed) {
  const rand = E.rng(seed * 2654435761 + 97), B = E.create(Object.assign({ seed }, setup)), pol = S.POLICIES[policy];
  let s, g = 0, menus = 0;
  while ((s = B.turn()).type !== 'end') { if (s.type === 'choose') { menus++; const [id, t] = pol(B, s, rand); B.choose(id, t); } if (++g > 20000) break; }
  const r = B.result(); r.minutes = (r.time + menus * S.THINK) / 60; return r;
}
const carry = (r) => RL.PARTY.map((id) => { const h = (r.heroes || []).find((u) => u.id === id) || {}; const u = { id, level: L }; if (h.hp != null) u.hp = Math.max(0, h.hp); if (h.mp != null) u.mp = h.mp; return u; });
const won = (r) => r.outcome === 'win' || r.outcome === 'retreat';
const [F1, F2] = Z.gate.forms;
function go(setting, policy, seed, before) {
  G.CovenLastFight = { level: before ? 20 : setting.level };
  const foes1 = F1.foes.map((f) => Object.assign({}, f, { level: G.CovenLastFight.level })).concat(before ? [] : D.helpers.map((id) => ({ id, level: setting.level })));
  const r1 = play({ party: fresh(), foes: foes1, flags, herbs: S.BAGS.gate, ends: Object.assign({}, F1.ends) }, policy, seed);
  if (!won(r1)) return { won: false, at: 1, minutes: r1.minutes };
  const p2 = before ? carry(r1) : fresh();
  const r2 = play({ party: p2, foes: F2.foes.map((f) => Object.assign({}, f, { level: G.CovenLastFight.level })), flags, herbs: S.BAGS.gate, ends: Object.assign({}, F2.ends || {}) }, policy, seed + 50000);
  return { won: won(r2), at: 2, minutes: r1.minutes + r2.minutes, fate: r2.outcome };
}
const PLAYERS = [['careless', 'careless'], ['sensible', 'attentive (careful)'], ['expert', 'expert']];
const rows = [['as before', { level: 20 }, true]].concat(D.settings.map((s) => [s.id, s, false]));
const t0 = Date.now();
console.log('THE LAST FIGHT, a level 20 coven, ' + n + ' goes each: how often both forms are won (and where the lost ones were lost)');
for (const [name, s, before] of rows) {
  let line = '  ' + (name + (before ? ' (level 20, no helpers)' : ' (level ' + s.level + ')')).padEnd(34);
  for (const [p, say] of PLAYERS) {
    let w = 0, l1 = 0, m = 0;
    for (let i = 0; i < n; i++) { const r = go(s, p, 1 + i * 7, before); if (r.won) { w++; m += r.minutes; } else if (r.at === 1) l1++; }
    line += (say + ' ' + Math.round(100 * w / n) + '%').padEnd(26) + ('(lost in form one ' + Math.round(100 * l1 / n) + '%' + (w ? ', a win ' + (m / w).toFixed(0) + ' min' : '') + ')').padEnd(36);
  }
  console.log(line);
}
G.CovenLastFight = null;
console.log('(' + ((Date.now() - t0) / 1000).toFixed(0) + ' s)');
