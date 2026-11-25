// start.js: the one call the land makes to start a fight and get the result back (Coven, the fights job, step 2). Shaped
// like Moon Faire's (moon-faire game/fight/api.js, MF_FIGHT.start):
//
//     const r = await CovenBattle.start({ arena: 'river-glade', foes: ['wisp', 'wraith'], partyLevel: 3, foeLevel: 4,
//                                         party: { io: { hp, mp }, jester: { hp, mp }, fox: { hp, mp }, ranger: { hp } } });
//     r = { result: 'won' | 'lost' | 'fled', won, xp, shards, party: { io: { hp, max, mp, mpMax }, jester, fox, ranger },
//           herbsSpent: { moonpetal: 1, ... }, arena, foes, tag }
//
// What it can be told (all but foes may be left out):
//   arena       where the fight is: 'river-glade', 'warm-roads-moor', 'eldergrove', 'frostmere', 'bogmire', 'dawnroost',
//               'crossroads' or 'dead-moonwell' (window.ARENAS). Left out: the band's own arena (band from foeLevel)
//   foes        a list of foe ids ('wisp', 'wraith', 'frostWisp', 'bramble', 'brambleAmbush', 'brambleTowering',
//               'brambleAncient', 'colossus'), or 'roll': a pack as the band's wilds roll one (BattleSim.BAND_PACKS)
//   partyLevel  the party's level, 1 to 20
//   foeLevel    the foes' level: a number, or [lowest, highest] (each foe gets one in that range). Left out: the band's range
//   band        which band's packs 'roll' uses (1 to 4). Left out: from foeLevel, or else from partyLevel
//   party       what each witch brings from the last fight: { io: { hp, mp }, jester: { hp, mp }, fox: { hp, mp },
//               ranger: { hp } } (left out or null: full). Give back result.party to carry HP and MP on
//   herbs       the herbs the party carries: { moonpetal: 3, ... } (each may be used once in a fight). Left out: none
//   flags       the story so far: { refit, envoi, stoop } (left out: as the party's level has them)
//   weather     'clear', 'rain' or 'storm' (left out: as the place says)
//   canFlee     false for a fight that cannot be run from (left out: a wild fight can be)
//   auto        'careless', 'sensible' or 'expert': the battle's own players choose every move (for tests)
//   flipbook    start with the Flipbook look
//   kind        'wild' (the default), or a story fight: 'greatWraith' (gate 5) or 'dawnroost' (gate 10), which bring their own foes
//               or 'story' with story: { arena, stand, foes: [{ id, level, hpMul, dmgMul }], ends, canFlee, words, ... }: a big
//               fight given as data (a zone's file, game/encounters/zone-N.js)
//   words       a wild fight's own words: { intro, attack, attackMany, win, lose } (the slots' stand-ins, a fight by a thing)
//   xp          the party's experience toward its next level (for the end card's bar and its level-up)
//   reward      what the fight's experience and shards are worth, against the foes' plain numbers in rules.js (1: as they
//               are written there). Left out: the battle's own (a wild fight 1.75, a story fight 1)
//   tag         anything, handed back unchanged
// The fight covers the page (a layer of its own, over everything) and answers when the player leaves its end card.
// While it runs, the page that called it should stop drawing its own picture. Needs, loaded before it, everything
// game/pages/battle.html loads (three.js, the arenas, the models, the witches, rules, engine, sim, sound, screen, fights).
// Note for the page that loads it: screen.css styles the page's body and header as the battle page's (see the slip).
(function () {
  'use strict';
  let running = null, SND = null;
  const BAND = (L) => (L <= 5 ? 1 : L <= 10 ? 2 : L <= 15 ? 3 : 4);
  function start(o) {
    o = o || {};
    if (running) return Promise.reject(new Error('a fight is already running'));
    const RL = window.BattleRules, S = window.BattleSim;
    const L = Math.max(1, Math.min(RL.MAX_LEVEL, Math.round(o.partyLevel || 1)));
    const lv0 = Array.isArray(o.foeLevel) ? o.foeLevel[0] : o.foeLevel;
    const band = o.band || BAND(lv0 != null ? lv0 : L);
    // the party as the battle's fights take it (fights.js): its level, each witch's HP and MP, the herbs, the story's flags
    const hp = {}, mp = {}, pp = o.party || {};
    for (const id of RL.PARTY) { if (pp[id] && pp[id].hp != null) hp[id] = pp[id].hp; if (pp[id] && pp[id].mp != null) mp[id] = pp[id].mp; }
    const flags = Object.assign({ party: true, magpie: true, lights: L > 5, refit: L > 5, envoi: L > 10, charge: L > 10, stoop: L > 15, shipyard: L > 15, upgrade2: L > 15 }, o.flags || {});
    const P = { level: L, xp: o.xp || 0, hp, mp, herbs: Object.assign({}, o.herbs || {}), flags, keepsakes: {} };
    let pack = o.foes === 'roll' || !o.foes ? null : o.foes.slice();
    const opts = { arena: true, band, place: o.arena || undefined, foeLevel: o.foeLevel, weather: o.weather };
    if (pack) opts.pack = pack;
    // (step 4) a big fight given as data (kind: 'story', story: {...}: game/battle/fights.js), and a meeting's own words
    if (o.story) opts.story = o.story; if (o.words) opts.words = o.words;
    // kind: a wild fight (the default), or one of the story's fights: 'greatWraith' (gate 5), 'dawnroost' (gate 10)
    const cfg = window.GameFights.config(o.kind || 'wild', P, opts);
    // (no running away: only `canFlee` is taken out of the fight's ends. Fixed November 24: it took out every end, so the knight
    // of light never stopped and walked away, and Io's answers and the fire's first form did nothing, on the land and on the lab page)
    if (o.canFlee === false) { const f0 = cfg.fight; cfg.fight = () => { const f = f0(), ends = Object.assign({}, f.ends || {}); delete ends.canFlee; return Object.assign(f, { ends }); }; }
    // reward: what the fight's experience and shards are worth here, against the battle's own (the land's zones set it)
    // (step 4: it TAKES THE PLACE of the battle's own worth for a wild fight, rules.js WILD_REWARD 1.75; until then it was
    // multiplied by it, so a fight on the land gave 1.75 times what the zone's file and the slip said)
    if (o.reward != null) { const f1 = cfg.fight; cfg.fight = () => { const f = f1(); f.reward = o.reward; return f; }; }
    let bag = null; { const f2 = cfg.fight; cfg.fight = () => { const f = f2(); bag = Object.assign({}, f.herbs || {}); return f; }; }
    // its own layer, with the stage the battle screen draws on
    const layer = document.createElement('div');
    layer.className = 'coven-battle';
    layer.style.cssText = 'position:fixed;inset:0;z-index:9000;display:flex;flex-direction:column;background:#120d18';
    const stage = document.createElement('main'); stage.id = 'stage'; stage.setAttribute('aria-label', 'Battle');
    stage.style.cssText = 'flex:1 1 auto;min-height:0';
    const old = document.getElementById('stage'); if (old) old.id = 'stage-before-battle';
    // the frame rate the fight is really drawn at, small in the top right corner (CLAUDE.md: every build shows its own)
    const rate = document.createElement('div');
    rate.style.cssText = 'position:absolute;top:calc(8px + env(safe-area-inset-top,0px));right:calc(12px + env(safe-area-inset-right,0px));z-index:20;pointer-events:none;font:12px system-ui,sans-serif;color:rgba(232,230,255,.75);text-shadow:0 1px 2px #000';
    layer.appendChild(stage); layer.appendChild(rate); document.body.appendChild(layer);
    let lastF = null, lastT = 0;
    const rateT = setInterval(() => { const B = window.__battle, f = B && B.drawn ? B.drawn.frame : null, now = performance.now(); if (f != null && lastF != null && f >= lastF) rate.textContent = Math.round((f - lastF) * 1000 / (now - lastT)) + ' frames a second'; lastF = f; lastT = now; }, 1000);
    stage.innerHTML = window.BattleScreen.markup();
    SND = SND || window.makeBattleSound(); window.__battleSND = SND; cfg.sound = SND;
    cfg.flipbook = !!o.flipbook; if (o.auto) cfg.auto = o.auto;
    return new Promise((resolve, reject) => {
      let ctl = null;
      const done = (r, err) => {
        if (ctl) { ctl.stop(); ctl = null; }
        clearInterval(rateT); layer.remove(); if (old) old.id = 'stage'; running = null;
        if (err) { reject(err); return; }
        const out = r.outcome === 'win' || r.outcome === 'retreat' ? 'won' : r.outcome === 'fled' ? 'fled' : 'lost';
        const party = {};
        for (const h of r.heroes || []) party[h.id] = { hp: h.hp, max: h.maxHp, mp: h.mp, mpMax: h.maxMp };
        // the herbs used: what the fight was given to use, less what it had left
        const herbsSpent = {}; for (const id in bag || {}) { const n = bag[id] - ((r.herbs || {})[id] || 0); if (n > 0) herbsSpent[id] = n; }
        resolve({ result: out, won: out === 'won', xp: r.xp || 0, shards: r.shards || 0, party, herbsSpent, arena: cfg.arena || null, foes: (r.foes || []).map((f) => f.key), tag: o.tag });
      };
      cfg.game = { onEnd: (r) => done(r || { outcome: 'lost', heroes: [] }), onError: (e) => done(null, e || new Error('the battle could not start (it needs WebGL)')) };
      running = { stop: () => done({ outcome: 'fled', heroes: [] }) };
      try { ctl = window.BattleScreen.start(cfg); } catch (e) { done(null, e); }
    });
  }
  window.CovenBattle = { start, get running() { return !!running; } };
})();
