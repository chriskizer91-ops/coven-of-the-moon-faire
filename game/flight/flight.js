// flight.js: one flight between two landings, as a piece any page can call (Coven of the Moon Faire, the flight job,
// November 23, 2026). Load after game/travel/landings.js, game/flight/flight-data.js and game/flight/flight-frame.js.
//
//   W3D.flight.fly({ from, to, ship })   ->   a promise of { arrived: true } or { arrived: false, why }
//
//     from, to   a landing's id from game/travel/landings.js ('wickhollow', 'warmCamp', ...), or a landing itself
//     ship       'skiff', 'cutter', 'brig' or 'frigate'. Left out: the ship the data file gives for the landing the
//                flight leaves (flight-data.js, shipFrom: the Skiff from Wickhollow, then the next at each gate)
//     why        'lost' (she went down, and the crew got her home), 'turned-back' (the player gave the flight up),
//                'stopped' (W3D.flight.stop() was called), 'busy' (a flight is already on), 'no-landing', 'error'
//     The answer also carries: seconds (how long it took), downed (raiders brought down), hull (0 to 1, what was left).
//
//   While it runs, two events on window, for the story engine (the moments "flight" and "flight-after"):
//     'coven:flight-raiders'   the raiders come        (detail: { ships: ['skiff', ...] })
//     'coven:flight-clear'     they are seen off       (detail: { downed })
//   and two more, for anything that should rest while the flight is on:  'coven:flight-start', 'coven:flight-end'.
//
//   W3D.flight.flying        true while a flight is on
//   W3D.flight.pause(on)     hold it or let it go on, with no card shown (for the game's own menu)
//   W3D.flight.stop()        end it now: the promise answers { arrived: false, why: 'stopped' }
//   W3D.flight.shipFor(from) the ship the data file gives for a flight that leaves that landing
//   W3D.flight.km(from, to)  how long the flight is
//
// The flight is Chris's airship game, Skies of Aethermoor. It draws with a newer three.js than the rest of the game,
// so it runs in a frame of its own that fills the screen: the frame's whole page is the text in flight-frame.js, and
// this file and the frame talk by messages. When the flight ends the frame is taken away, and everything it held
// (its picture, its models, its drawing surface) goes with it. Nothing is saved, and nothing is fetched.
// While a flight is on, the keys go to the flight and to nothing under it. The page under it is NOT paused from here:
// whoever calls fly() should rest its own drawing until the promise answers (or listen for the two events above).
(function (G) {
  'use strict';
  const W3D = (G.W3D = G.W3D || {});
  const TEST = /[?&]test\b/.test(G.location ? G.location.search : '');
  const data = () => G.COVEN_FLIGHT_DATA;
  const landing = (x) => (x && typeof x === 'object' ? x : (G.COVEN_LANDINGS || []).find((l) => l.id === x) || null);
  let cur = null;        // the flight that is on
  let asked = 0;

  // the ship for a flight is set by the landing it leaves (flight-data.js, shipFrom)
  function shipFor(from) {
    const D = data(), L = landing(from);
    return (L && D.shipFrom[L.id]) || D.ships[0];
  }
  // 5 metres to a pixel of the atlas: Skies of Aethermoor's own scale for the map (its docs/map.md)
  const km = (from, to) => { const a = landing(from), b = landing(to); return a && b ? Math.hypot(b.atlas[0] - a.atlas[0], b.atlas[1] - a.atlas[1]) * 5 / 1000 : 0; };
  const tell = (name, detail) => G.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));

  function fly(o) {
    o = o || {};
    const D = data(), from = landing(o.from), to = landing(o.to);
    if (cur) return Promise.resolve({ arrived: false, why: 'busy' });
    if (!from || !to || !from.atlas || !to.atlas) return Promise.resolve({ arrived: false, why: 'no-landing' });
    if (!D || !G.COVEN_FLIGHT_FRAME) return Promise.resolve({ arrived: false, why: 'error', message: 'the flight is not in this page' });
    const ship = D.ships.indexOf(o.ship) >= 0 ? o.ship : shipFor(from), doc = G.document;
    return new Promise((answer) => {
      const layer = doc.createElement('div'), frame = doc.createElement('iframe');
      layer.setAttribute('data-coven-flight', '');
      layer.style.cssText = 'position:fixed;inset:0;z-index:' + (D.layer || 60) + ';background:#0a0b18;transition:opacity .4s';
      frame.title = to.name; frame.setAttribute('allow', 'fullscreen');
      frame.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;border:0;display:block;background:#0a0b18';
      const say = (m) => { try { frame.contentWindow.postMessage(Object.assign({ coven: 'flight' }, m), '*'); } catch (e) { /* the frame is gone */ } };
      const waits = {};
      let done = false, slow = 0;

      function onMessage(e) {
        const m = e.data;
        if (!m || m.coven !== 'flight' || e.source !== frame.contentWindow) return;
        if (m.type === 'loaded') {
          say({ type: 'start', opts: { from: { name: from.name, atlas: from.atlas }, to: { name: to.name, atlas: to.atlas }, ship: ship, data: D,
            test: TEST || !!o.test, hold: !!(o.test && o.test.hold), touch: o.test && o.test.touch != null ? o.test.touch : undefined } });
        } else if (m.type === 'ready') {
          clearTimeout(slow); cur.ready = true; focus(); if (cur.onReady) cur.onReady(m.state);
        } else if (m.type === 'raiders') tell('coven:flight-raiders', { ships: m.ships, from: from.id, to: to.id });
        else if (m.type === 'clear') tell('coven:flight-clear', { downed: m.downed, from: from.id, to: to.id });
        else if (m.type === 'end') end(m);
        else if (m.type === 'error') end({ arrived: false, why: 'error', message: m.message });
        else if (m.type === 'test-reply' && waits[m.id]) { waits[m.id](m.value); delete waits[m.id]; }
      }
      // the keys go to the flight, and to nothing under it
      function onKey(e) {
        if (e.metaKey || e.ctrlKey || e.altKey || /^F\d+$/.test(e.key)) return;
        e.stopImmediatePropagation();
        if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) >= 0) e.preventDefault();
        say({ type: 'key', down: e.type === 'keydown', key: e.key, code: e.code, shift: e.shiftKey });
      }
      function focus() { try { frame.contentWindow.focus(); } catch (e) { /* not yet */ } }
      function end(m) {
        if (done) return;
        done = true; clearTimeout(slow);
        const result = { arrived: !!m.arrived };
        for (const k of ['why', 'message', 'seconds', 'downed', 'hits', 'hull']) if (m[k] != null) result[k] = m[k];
        G.removeEventListener('message', onMessage); G.removeEventListener('keydown', onKey, true); G.removeEventListener('keyup', onKey, true);
        G.removeEventListener('focus', focus);
        for (const id in waits) { waits[id]({ error: 'the flight is over' }); delete waits[id]; }
        const away = () => { frame.srcdoc = ''; layer.remove(); cur = null; tell('coven:flight-end', result); answer(result); };
        if (TEST || o.test) away(); else { layer.style.opacity = '0'; setTimeout(away, 420); }
      }

      cur = {
        ready: false, from: from, to: to, ship: ship, say: say, end: end,
        ask: (cmd, args) => new Promise((got) => { const id = ++asked; waits[id] = got; say({ type: 'test', id: id, cmd: cmd, args: args || {} }); }),
      };
      G.addEventListener('message', onMessage); G.addEventListener('keydown', onKey, true); G.addEventListener('keyup', onKey, true);
      G.addEventListener('focus', focus);
      // if the frame never starts (a browser with no 3D drawing, say), the flight ends as an error and not as a dark screen
      slow = setTimeout(() => end({ arrived: false, why: 'error', message: 'the flight did not start' }), 180000);
      layer.appendChild(frame); doc.body.appendChild(layer);
      frame.srcdoc = G.COVEN_FLIGHT_FRAME;
      tell('coven:flight-start', { from: from.id, to: to.id, ship: ship });
    });
  }

  W3D.flight = {
    fly: fly, shipFor: shipFor, km: km,
    get flying() { return !!cur; },
    pause: (on) => { if (cur) cur.say({ type: 'pause', on: on !== false, card: false }); },
    stop: (why) => { if (cur) { if (cur.ready) cur.say({ type: 'stop', why: why || 'stopped' }); else cur.end({ arrived: false, why: why || 'stopped' }); } },
    // for the checks (tools/flight-test.py): ask the flight that is on to do something, and get its answer.
    // The commands are the ones at the foot of game/flight/src/coven-flight.js: state, step, draw, warp, sink, ...
    test: (cmd, args) => (cur ? cur.ask(cmd, args) : Promise.resolve({ error: 'no flight is on' })),
    whenReady: () => new Promise((got) => { if (!cur) got(null); else if (cur.ready) cur.ask('state').then(got); else cur.onReady = got; }),
  };
})(typeof window !== 'undefined' ? window : globalThis);
