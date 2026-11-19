// land-fights.js: the fights joined to the land (Coven, the fights job, step 3). The land's page calls it once, in its
// marked start-up lines:
//
//   window.__fights = CovenLandFights.start({ W, root, toast, zone: 'zone-1' })
//
// It brings together: the party (game/party/party.js, kept in the browser), the meetings in the wild
// (game/encounters/meetings.js, with the zone's data file), the battle (game/battle/start.js), and the party's small
// button on the screen (game/party/party-view.js). What happens:
//   - a meeting comes: the land pauses (no walking, no drawing), the fight plays over it in its own layer, and its answer
//     is carried back to the party: experience and levels, each witch's HP and MP, the herbs used, the shards;
//   - won, or run from: she walks on from where she stood, with a little calm before the next meeting;
//   - lost (job's call, as the hub suggested): the coven wakes at the Moon Faire's camp, healed;
//   - at the camp, the party can rest: everyone whole again;
//   - the herbs Io picks on the land go into the party's herbs and are used in fights beside the rest (Chris's word);
//   - near the gate's spot, at the gate's level, a button offers the gate fight (a proposal: see the zone's data file).
// For the checks: __fights.meet() forces a meeting where she stands; __fights.meetings.numbers(); __fights.party;
// __fights.busy; __fights.last (the last fight's answer); __fights.auto = 'expert' lets the battle play itself.
(function () {
  'use strict';
  function start(o) {
    const W = o.W, land = W.P.land, M = W.P.M, toast = o.toast || (() => {});
    const D = window.COVEN_ENCOUNTERS[o.zone || 'zone-1'];
    const party = window.CovenParty.load();
    const api = { party, busy: false, last: null, auto: null, fights: 0 };

    // ---- the herbs: the land's bag counts the party's herbs of the kinds that grow on the land ----
    const landKinds = ((window.W3D_PLACES[o.zone || 'zone-1'] || {}).zone || {}).land ? window.W3D_PLACES[o.zone || 'zone-1'].zone.land.herbs.kinds.map((k) => k.id) : ['moonpetal', 'lavender'];
    const syncBag = () => { for (const k of landKinds) land.bag[k] = party.herbs[k] || 0; showBag(); };
    // the land's page shows Io's bag in the top left once she has picked a herb; after a fight its counts are the party's
    // (the same look as the page's own; see the slip: a hook for this from the hub would be better)
    function showBag() {
      const el = document.getElementById('bag'); if (!el || el.style.display !== 'flex') return;
      const kinds = window.W3D_PLACES[o.zone || 'zone-1'].zone.land.herbs.kinds.filter((k) => land.bag[k.id]);
      el.innerHTML = kinds.map((k) => '<span style="color:' + k.petal + '"><i style="background:' + k.petal + '"></i><span style="color:#f0ecff">' + k.name + ' ' + land.bag[k.id] + '</span></span>').join('');
    }
    const LE = window.W3D.landEvents || (window.W3D.landEvents = {});
    const herb0 = LE.herb;
    LE.herb = function (kind, n, bag) { party.setHerb(kind.id, bag[kind.id]); return herb0 ? herb0.call(this, kind, bag[kind.id], bag) : undefined; };
    syncBag();

    // ---- where the camp is ----
    const inCamp = () => { const x = M.x(W.io.px), z = M.z(W.io.py); return Math.hypot(x - D.camp.at[0], z - D.camp.at[1]) < D.camp.r; };
    function toCamp() {
      const at = W.nearestFit(M.px(D.camp.wake[0]), M.py(D.camp.wake[1]));
      W.setIo(at[0], at[1], Math.PI);
    }

    // ---- the party's button ----
    const view = window.CovenPartyView.create({
      root: o.root, party,
      rest() { if (!inCamp()) return; party.rest(); toast('The coven rests by the Moon Faire’s fire. Everyone is whole again.'); },
      afresh() { party.afresh(); syncBag(); toast('A new start: the coven at level 1.'); },
    });
    party.onChange = () => view.refresh();

    // ---- a fight ----
    async function fight(spec, why) {
      if (api.busy) return null;
      const wasHeld = meetings.held;
      api.busy = true; meetings.hold(true); view.close(); view.hide(true);
      W.pause(true);
      const B = party.forBattle();
      let r = null;
      try {
        r = await window.CovenBattle.start(Object.assign({}, spec, B, { auto: api.auto || undefined, tag: why }));
      } catch (e) {
        console.error(e); toast('The fight could not start here (' + (e && e.message ? e.message : 'no 3D') + ').');
      }
      if (r) {
        const lost = r.result === 'lost';
        const res = party.afterBattle(r, { lost: 'camp', gate: spec.gate || null });
        api.last = Object.assign({ levels: res.levels, spec }, r); api.fights++;
        if (lost) { toCamp(); toast('The coven wakes at the Moon Faire’s camp, healed.'); }
        else if (res.levels) toast('The coven is level ' + party.level + '.');
        else if (r.result === 'fled') toast('The coven slips away.');
        syncBag();
      }
      W.pause(false); view.hide(false); view.refresh();
      meetings.hold(wasHeld); meetings.calm();
      api.busy = false;
      return r;
    }
    const meetings = window.CovenMeetings.create({
      W, land, data: D, party,
      onMeet: (m) => { fight({ arena: m.arena, foes: m.foes, foeLevel: m.foeLevel, reward: D.reward }, m); },
    });

    // the land's checks (?test: its clock moves only when a check says) walk her about by numbers: no meeting may
    // interrupt them, so there meetings come only when a check asks (job's call)
    if (/[?&]test\b/.test(location.search)) meetings.hold(true);

    // ---- the gate (a proposal: the spot and the button only) ----
    const G = D.gate;
    function gateCheck() {
      if (api.busy || !G || party.gates[G.id]) { view.offer(null); return; }
      const x = M.x(W.io.px), z = M.z(W.io.py), near = Math.hypot(x - G.at[0], z - G.at[1]) < G.r;
      if (!near) { view.offer(null); return; }
      if (party.level < G.level) { view.offer(null); if (!gateCheck.told) { gateCheck.told = true; toast(G.notYet); } return; }
      view.offer(G.offer, () => { view.offer(null); fight({ kind: G.kind, arena: G.arena, gate: G.id, canFlee: false }, { gate: G.id }); });
    }
    const timer = setInterval(() => { if (!api.busy) { view.atCamp(inCamp()); gateCheck(); } }, 400);

    Object.assign(api, {
      meetings, view,
      meet() { return meetings.force(); },
      fight, toCamp, inCamp, gate: G,
      stop() { clearInterval(timer); meetings.stop(); },
    });
    return api;
  }
  window.CovenLandFights = { start };
})();
