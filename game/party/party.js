// party.js: the coven's party on the land (Coven, the fights job, step 3). One object holds what the four witches carry
// from fight to fight: the party's level and experience, each witch's HP and MP, the sunstone shards, the herbs, and a
// few counts. It is kept in the browser under one key, so closing the page loses nothing.
//
//   const party = CovenParty.load();        // what was kept, or a new party
//   party.level, party.xp, party.shards, party.herbs ({ moonpetal: 3, ... }), party.fights ({ won, lost, fled })
//   party.hp(id), party.mp(id)              // her HP and MP now; party.maxHp(id), party.maxMp(id) at the party's level
//   party.forBattle()                       // { partyLevel, xp, party: { io: { hp, mp }, ... }, herbs } for CovenBattle.start
//   party.afterBattle(r, opts)              // carries a fight's answer back: experience and levels, HP and MP, herbs, shards
//   party.rest()                            // every witch whole: all her HP and MP
//   party.afresh()                          // a new party, as at the very start
//   party.addHerb(id, n), party.setHerb(id, n), party.setHp(id, n)
//   party.save()                            // kept (done by the calls above; saving by hand is for the checks)
//   party.onChange = (party, what) => ...   // told after every change
//
// The numbers are the battle's own (game/battle/rules.js): a witch's HP and MP at a level, the experience a level asks,
// the top level (20), the most of one herb the party carries (99). All four are in the party from the start (Chris,
// November 18), at the same level, as in Envoi's battle.
(function () {
  'use strict';
  const KEY = 'coven.party';
  const VERSION = 1;
  const RL = () => window.BattleRules;
  const WITCHES = () => RL().PARTY.slice();

  // a new party (job's calls): level 1, no experience, every witch whole, no shards, and three of each of the battle's
  // five herbs, as Envoi's game began (rules.js START_HERBS)
  function fresh() {
    // fights-polish: a herb that says its own start (zone 4's white sage: none) begins with that many
    const herbs = {}; for (const id in RL().HERBS) herbs[id] = RL().HERBS[id].start != null ? RL().HERBS[id].start : RL().START_HERBS;
    return { v: VERSION, level: 1, xp: 0, shards: 0, hp: {}, mp: {}, herbs, fights: { won: 0, lost: 0, fled: 0 }, gates: {}, made: Date.now() };
  }

  function make(S) {
    const P = {
      onChange: null,
      get level() { return S.level; }, get xp() { return S.xp; }, get shards() { return S.shards; },
      get herbs() { return S.herbs; }, get fights() { return S.fights; }, get gates() { return S.gates; },
      // the experience the next level asks for, and how far along she is (0 to 1)
      get xpNeed() { return S.level >= RL().MAX_LEVEL ? 0 : RL().xpNeed(S.level); },
      get xpPart() { return S.level >= RL().MAX_LEVEL ? 1 : S.xp / RL().xpNeed(S.level); },
      witches: WITCHES,
      name: (id) => RL().HEROES[id].name,
      maxHp: (id) => Math.round(RL().HEROES[id].hp * RL().scale(S.level)),
      maxMp: (id) => Math.round(RL().HEROES[id].mp * RL().mpScale(S.level)),
      // her HP and MP now (kept as what she has; none kept means whole)
      hp: (id) => (S.hp[id] == null ? P.maxHp(id) : Math.max(0, Math.min(S.hp[id], P.maxHp(id)))),
      mp: (id) => (S.mp[id] == null ? P.maxMp(id) : Math.max(0, Math.min(S.mp[id], P.maxMp(id)))),
      // the whole party's health, 0 to 1: its HP over all its HP
      health() { let a = 0, b = 0; for (const id of WITCHES()) { a += P.hp(id); b += P.maxHp(id); } return b ? a / b : 1; },
      whole() { return WITCHES().every((id) => P.hp(id) >= P.maxHp(id) && P.mp(id) >= P.maxMp(id)); },
      forBattle() {
        const party = {}; for (const id of WITCHES()) party[id] = { hp: P.hp(id), mp: P.maxMp(id) ? P.mp(id) : undefined };
        return { partyLevel: S.level, xp: S.xp, party, herbs: Object.assign({}, S.herbs) };
      },
      // what a fight gave back (CovenBattle.start's answer). A witch who fell in a fight the party won or ran from gets up
      // with 1 HP (job's call); a lost fight is the land's to deal with (opts.lost: 'camp' heals them all)
      afterBattle(r, opts) {
        opts = opts || {};
        const was = S.level;
        for (const id of WITCHES()) {
          const w = r.party && r.party[id]; if (!w) continue;
          S.hp[id] = w.hp > 0 ? w.hp : 1;
          if (w.mpMax) S.mp[id] = w.mp;
        }
        for (const id in r.herbsSpent || {}) S.herbs[id] = Math.max(0, (S.herbs[id] || 0) - r.herbsSpent[id]);
        S.shards += r.shards || 0;
        S.xp += r.xp || 0;
        while (S.level < RL().MAX_LEVEL && S.xp >= RL().xpNeed(S.level)) { S.xp -= RL().xpNeed(S.level); S.level++; }
        if (S.level >= RL().MAX_LEVEL) S.xp = 0;
        // on a new level each witch keeps what she had and gains what the level adds (her HP and MP grow, the hurt stays)
        if (S.level > was) for (const id of WITCHES()) {
          if (S.hp[id] != null) S.hp[id] += Math.round(RL().HEROES[id].hp * (RL().scale(S.level) - RL().scale(was)));
          if (S.mp[id] != null) S.mp[id] += Math.round(RL().HEROES[id].mp * (RL().mpScale(S.level) - RL().mpScale(was)));
        }
        const k = r.result === 'won' ? 'won' : r.result === 'fled' ? 'fled' : 'lost'; S.fights[k] = (S.fights[k] || 0) + 1;
        if (r.won && opts.gate) S.gates[opts.gate] = true;
        if (k === 'lost' && opts.lost === 'camp') { S.hp = {}; S.mp = {}; }
        P.save(); tell(S.level > was ? 'level' : 'fight');
        return { levels: S.level - was };
      },
      rest() { S.hp = {}; S.mp = {}; P.save(); tell('rest'); },
      addHerb(id, n) { S.herbs[id] = Math.min(RL().CARRY, (S.herbs[id] || 0) + (n == null ? 1 : n)); P.save(); tell('herb'); },
      // (for the checks, and for trying a later zone by itself) the party at a level, whole, with no experience toward the next
      setLevel(n) { S.level = Math.max(1, Math.min(RL().MAX_LEVEL, Math.round(n))); S.xp = 0; S.hp = {}; S.mp = {}; P.save(); tell('level'); },
      // (for the checks) set one witch's HP, as if hurt
      setHp(id, n) { S.hp[id] = Math.max(0, Math.min(n, P.maxHp(id))); P.save(); tell('hp'); },
      setHerb(id, n) { S.herbs[id] = Math.max(0, Math.min(RL().CARRY, n)); P.save(); tell('herb'); },
      afresh() { S = fresh(); P.save(); tell('afresh'); },
      save() { try { localStorage.setItem(KEY, JSON.stringify(S)); return true; } catch (e) { return false; } },
      get state() { return JSON.parse(JSON.stringify(S)); },
    };
    function tell(what) { if (P.onChange) try { P.onChange(P, what); } catch (e) { console.error(e); } }
    return P;
  }

  function load() {
    let S = null;
    try { const t = localStorage.getItem(KEY); if (t) S = JSON.parse(t); } catch (e) { S = null; }
    if (!S || S.v !== VERSION || !(S.level >= 1)) S = fresh();
    const F = fresh();
    for (const k in F) if (S[k] == null) S[k] = F[k];
    S.level = Math.max(1, Math.min(RL().MAX_LEVEL, Math.round(S.level)));
    const P = make(S); P.save(); return P;
  }

  window.CovenParty = { load, KEY };
})();
