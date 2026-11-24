// land-fights.js: the fights joined to the land (Coven, the fights job, steps 3 and 4). A zone's page calls it once, in
// its marked lines:
//
//   window.__fights = CovenLandFights.start({ W, root, toast, zone: 'zone-2' })
//
// It brings together: the party (game/party/party.js, kept in the browser), the meetings in the wild
// (game/encounters/meetings.js and draw.js, with the zone's data file and the slots), the battle (game/battle/start.js),
// and the party's small button on the screen (game/party/party-view.js). What happens:
//   - a meeting comes: the land pauses (no walking, no drawing), the fight plays over it in its own layer, and its answer
//     is carried back to the party: experience and levels, each witch's HP and MP, the herbs used, the shards;
//   - won, or run from: she walks on from where she stood, with a little calm before the next meeting;
//   - lost (job's call, as the hub suggested): the coven wakes at the zone's camp, healed;
//   - at the camp, and at the zone's other resting places, the party can rest: everyone whole again;
//   - the herbs Io picks on the land go into the party's herbs and are used in fights beside the rest (Chris's word);
//   - near a big fight's spot, at its level, a button offers it (the zone's `gate`, and its `big` fights);
//   - a fight can be tied to a thing on the land (zone 2's road stones): __fights.thing(id, then).
// What the story reads: __fights.gate = { id, at: [x, z] } (the zone's big fight) and party.gates[id] once it is won.
// What it tells the page, so the hub's code can listen without touching this (step 4, thing 6):
//   window.addEventListener('coven-fights', (e) => { const d = e.detail; ... })
//   d.what = 'first-meeting'  just before the party's very first fight. To have a line said first, call d.wait() at once
//                             and d.done() when it has been said: the fight waits for done(), 6 seconds at most
//            'rest'           the party has rested (d.where: 'camp' or a resting place's id)
//            'not-ready'      the party has come to a big fight's spot too soon (d.id, d.level). Call d.told() at once
//                             and the fights' own words for it are not shown
//            'between-forms'  between the two forms of the last fight (d.id). d.wait() and d.done() as above, 90 seconds at most
//            'fight-start', 'fight-end' (d.id for a big fight or a thing's, d.result: 'won', 'lost' or 'fled')
// For the checks: __fights.meet() forces a meeting where she stands; __fights.meetings.numbers(); __fights.party;
// __fights.busy; __fights.last (the last fight's answer); __fights.auto = 'expert' lets the battle play itself;
// __fights.bigs (every big fight, with its spot); __fights.events (what it has told the page).
// A check that walks a story with no fights (tools/story-test.py) opens the page with ?test: then, in every zone but
// the first, the big fights and the things' fights stand aside, and the story's own stand-in carries on as before.
// A check of the fights themselves opens it with ?test&fights.
(function () {
  'use strict';
  const fill = (s, o) => String(s || '').replace(/\{(\w+)\}/g, (m, k) => (o && o[k] != null ? o[k] : m));
  function start(o) {
    const W = o.W, land = W.P.land, M = W.P.M, zone = o.zone || 'zone-1';
    // (a page that hands no toast gets the page's own line at the top, if it has one)
    const toast = o.toast || ((s) => { const t = document.getElementById('toast'); if (!t) return; t.textContent = s; t.classList.remove('name'); t.style.opacity = 1; clearTimeout(toast.t); toast.t = setTimeout(() => { t.style.opacity = 0; }, 2600); });
    const D = window.COVEN_ENCOUNTERS[zone], WORDS = window.COVEN_FIGHT_WORDS || { land: {}, gates: {}, slots: {} }, LW = WORDS.land || {};
    const TEST = /[?&]test\b/.test(location.search), QUIET = TEST && zone !== 'zone-1' && !/[?&]fights\b/.test(location.search);
    const party = window.CovenParty.load();
    const api = { party, busy: false, last: null, auto: null, fights: 0, zone, events: [] };
    // ---- what the page is told ----
    function tell(what, more) {
      const d = Object.assign({ what, zone }, more || {}); let waits = false, done = null, told = false;
      d.wait = () => { waits = true; }; d.done = () => { if (done) done(); }; d.told = () => { told = true; };
      api.events.push(what);
      try { window.dispatchEvent(new CustomEvent('coven-fights', { detail: d })); } catch (e) { console.error(e); }
      return { told: () => told, wait: (ms) => (waits ? new Promise((r) => { const t = setTimeout(r, ms); done = () => { clearTimeout(t); r(); }; }) : Promise.resolve()) };
    }

    // ---- the herbs: the land's bag counts the party's herbs of the kinds that grow on the land ----
    const landKinds = ((window.W3D_PLACES[zone] || {}).zone || {}).land ? window.W3D_PLACES[zone].zone.land.herbs.kinds.map((k) => k.id) : ['moonpetal', 'lavender'];
    const syncBag = () => { for (const k of landKinds) land.bag[k] = party.herbs[k] || 0; showBag(); };
    // the land's page shows Io's bag in the top left once she has picked a herb; after a fight its counts are the party's
    // (the same look as the page's own; see the slip: a hook for this from the hub would be better)
    function showBag() {
      const el = document.getElementById('bag'); if (!el || el.style.display !== 'flex') return;
      const kinds = window.W3D_PLACES[zone].zone.land.herbs.kinds.filter((k) => land.bag[k.id]);
      el.innerHTML = kinds.map((k) => '<span style="color:' + k.petal + '"><i style="background:' + k.petal + '"></i><span style="color:#f0ecff">' + k.name + ' ' + land.bag[k.id] + '</span></span>').join('');
    }
    const LE = window.W3D.landEvents || (window.W3D.landEvents = {});
    const herb0 = LE.herb;
    LE.herb = function (kind, n, bag) { party.setHerb(kind.id, bag[kind.id]); return herb0 ? herb0.call(this, kind, bag[kind.id], bag) : undefined; };
    syncBag();

    const meetings = window.CovenMeetings.create({
      W, land, data: D, party,
      onMeet: (m) => { fight({ arena: m.arena, foes: m.foes, foeLevel: m.foeLevel, reward: m.reward, words: m.slot ? WORDS.slots : undefined }, m); },
    });
    const here = () => [M.x(W.io.px), M.z(W.io.py)];
    const near = (at, r) => { if (!at) return false; const p = here(); return Math.hypot(p[0] - at[0], p[1] - at[1]) < r; };

    // ---- where the camp is, and where else the party can rest ----
    const CAMP = { at: meetings.spot(D.camp.at), wake: meetings.spot(D.camp.wake), r: D.camp.r };
    const RESTS = [{ id: 'camp', at: CAMP.at, r: CAMP.r }].concat((D.rests || []).map((r) => ({ id: r.id, at: meetings.spot(r.at), r: r.r }))).filter((r) => r.at);
    const restAt = () => RESTS.find((r) => near(r.at, r.r)) || null;
    const inCamp = () => !!restAt();
    function toCamp() {
      const w = CAMP.wake || CAMP.at || [0, 0], at = W.nearestFit(M.px(w[0]), M.py(w[1]));
      W.setIo(at[0], at[1], Math.PI);
    }
    function rest() { const r = restAt(); if (!r) return false; party.rest(); toast(r.id === 'camp' && LW.restAt && LW.restAt[zone] ? LW.restAt[zone] : LW.rested); tell('rest', { where: r.id }); return true; }

    // ---- the party's button ----
    const view = window.CovenPartyView.create({
      root: o.root, party, rest,
      afresh() { party.afresh(); syncBag(); toast(LW.afresh); },
    });
    party.onChange = () => view.refresh();

    // ---- a fight ----
    let firstTold = false; const noFightYet = () => party.fights.won + party.fights.lost + party.fights.fled === 0;
    async function fight(spec, why) {
      if (api.busy) return null;
      const wasHeld = meetings.held;
      api.busy = true; meetings.hold(true); view.close(); view.hide(true);
      // the very first fight: the page may have a line to say before it
      if (!firstTold && noFightYet()) { firstTold = true; await tell('first-meeting', { meeting: why || null }).wait(6000); }
      W.pause(true);
      tell('fight-start', { id: spec.id || null });
      const B = party.forBattle();
      // (the story so far, as the battle knows it: Io can call her letters once the night at the node is won)
      const flags = Object.assign({}, spec.flags || {}); if (party.gates.nodeNight) flags.envoi = true;
      let r = null;
      try {
        r = await window.CovenBattle.start(Object.assign({}, spec, B, { flags, auto: api.auto || undefined, tag: why }));
      } catch (e) {
        console.error(e); toast(fill(LW.noStart, { why: e && e.message ? e.message : 'no 3D' }));
      }
      if (r) {
        const lost = r.result === 'lost';
        const res = party.afterBattle(r, { lost: 'camp', gate: spec.gate || null });
        api.last = Object.assign({ levels: res.levels, spec }, r); api.fights++;
        if (lost) { toCamp(); toast((LW.woke || {})[zone] || ''); }
        else if (res.levels) toast(fill(LW.level, { level: party.level }));
        else if (r.result === 'fled') toast(LW.fled);
        syncBag();
      }
      W.pause(false); view.hide(false); view.refresh();
      meetings.hold(wasHeld); meetings.calm(why && why.worth);
      api.busy = false;
      tell('fight-end', { id: spec.id || null, result: r ? r.result : null });
      return r;
    }

    // the land's checks (?test: its clock moves only when a check says) walk her about by numbers: no meeting may
    // interrupt them, so there meetings come only when a check asks (job's call)
    if (TEST) meetings.hold(true);

    // ---- the big fights: the zone's gate (the story's) and its other big fights. Each is a spot and a button ----
    const story = (g, form, i) => {
      const w = (WORDS.gates || {})[g.id] || {}, fw = form && w.forms ? w.forms[i] || {} : w, f = form || g;
      const alias = {}; for (const k in g.alias || {}) alias[k] = ((WORDS.gates || {})[g.alias[k]] || {}).name || g.alias[k];
      return { arena: f.arena || g.arena, stand: f.stand || g.stand, scene: g.scene, foes: f.foes || g.foes, ends: f.ends || g.ends, canFlee: !!g.canFlee, alias: g.alias ? alias : undefined, fanfare: !!g.fanfare, words: fw };
    };
    const BIGS = [D.gate].concat(D.big || []).filter(Boolean).map((g) => Object.assign({}, g, { at: meetings.spot(g.at), words: (WORDS.gates || {})[g.id] || {} })).filter((g) => g.at);
    const told = {};
    async function bigFight(g) {
      if (g.kind) return fight({ id: g.id, kind: g.kind, arena: g.arena, gate: g.id, canFlee: false }, { gate: g.id });   // (one of the battle's own story fights: zone 1's great wraith)
      const forms = g.forms || [null];
      for (let i = 0; i < forms.length; i++) {
        const last = i === forms.length - 1, part = g.id + '.' + (i + 1);
        if (!last && party.gates[part]) continue;                                    // (a form already seen through is not fought again)
        if (i > 0) await tell('between-forms', { id: g.id, form: i + 1 }).wait(90000);
        const r = await fight({ id: g.id, kind: 'story', story: story(g, forms[i], i), gate: last ? g.id : part, canFlee: !!g.canFlee }, { gate: g.id, form: i + 1 });
        if (!r || !r.won) return r;
        if (last) return r;
      }
      return null;
    }
    function gateCheck() {
      if (api.busy) { view.offer(null); return; }
      const g = QUIET ? null : BIGS.find((b) => !party.gates[b.id] && near(b.at, b.r));
      if (!g) { view.offer(null); return; }
      if (party.level < g.level) {
        view.offer(null);
        if (!told[g.id]) { told[g.id] = true; if (!tell('not-ready', { id: g.id, level: g.level }).told()) toast(fill(g.words.notYet, { level: g.level })); }
        return;
      }
      view.offer(g.words.offer || g.name, () => { view.offer(null); bigFight(g); });
    }
    const timer = setInterval(() => { if (!api.busy) { view.atCamp(inCamp()); gateCheck(); } }, 400);

    // ---- a fight tied to a thing on the land (zone 2's road stones). The thing's own file asks, when it is used:
    //   if (__fights.thing(id, then)) return;      true: a fight has begun, and `then` is called if it is won.
    //   false: nothing waits there (or it is already won): carry on. ----
    const THINGS = {}; for (const t of D.things || []) THINGS[t.thing] = t;
    function thing(id, then) {
      const t = THINGS[id]; if (!t || QUIET || party.gates['thing:' + t.id]) return false;
      if (api.busy) return true;
      const L = party.level, hi = Math.max(D.levels[0], Math.min(t.levels[1], L + (t.above || 0))), lo = Math.min(hi, t.levels[0]);
      const road = D.where.find((w) => w.id === 'road') || D.where[0];
      const reward = D.reward * (t.worth || 1) * window.CovenDraw.meanBase(road, D.band) / window.CovenDraw.base(t.foes, D.band);
      if (LW.thingFight) toast(LW.thingFight);
      fight({ id: t.id, arena: t.arena, foes: t.foes.slice(), foeLevel: [lo, hi], reward, gate: 'thing:' + t.id, words: (WORDS.gates || {})[t.words] }, { thing: t.id })
        .then((r) => { if (r && r.won && then) try { then(); } catch (e) { console.error(e); } });
      return true;
    }

    Object.assign(api, {
      meetings, view,
      meet(f) { return meetings.force(f); },
      fight, bigFight, toCamp, inCamp, rest, thing, tell,
      bigs: BIGS, rests: RESTS, camp: CAMP, quiet: QUIET,
      // the story's big fight for this zone: { id, at: [x, z], ... } (not there when a check walks the story with no fights)
      gate: QUIET ? null : BIGS.find((b) => D.gate && b.id === D.gate.id) || null,
      stop() { clearInterval(timer); meetings.stop(); },
    });
    return api;
  }
  window.CovenLandFights = { start };
})();
