#!/usr/bin/env python3
"""journey-test.py: the zones joined into one journey, checked from page to page (the journey job, November 24, 2026).

    python3 tools/journey-test.py builds [--only ABCDE] [--size 1280x720] [--shots <folder>]

builds is the folder with the built pages (zone-1.html, zone-2.html, zone-3.html, index.html). The pages are opened
with ?journeytest: the save is real (it lasts from page to page, as for a player) and the flight in is flown on its own
test handle. Nothing is left behind: the browser is a new one with storage of its own, thrown away at the end.

  A  a new game on zone 1; its story set to its end (the story's test handle); the button by the ship; board; the 3D
     map with the Warm Roads open; Set course; zone 2's page opens and plays the flight in; the Grey Hat's two flight
     lines and the narrator's come; the landing; the slot now says zone 2
  B  zone 1's page opened again (Continue): it opens zone 2's, with no flight
  C  on zone 2, story not done: boarding says why she won't go on, and offers Wickhollow only; that flight lost: back
     at the Warm Roads, at the ship, with one line; the slot still says zone 2
  D  a flight back to Wickhollow: landed on the jetty's pier; the slot says zone 1
  E  zone 1 to zone 2 again (no flight lines this time), zone 2's story set to its end, on to the northern wilds: zone
     3's flight lines, the landing, the slot says zone 3
  F  the front door (index.html): the game's name, the slot, Carry on opens the slot's page

The browser here has no screen: it cannot show motion or measure a frame rate. Only a real laptop or phone can.
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright

FLAGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--autoplay-policy=no-user-gesture-required']
fails, notes = [], {}


def check(ok, what):
    print('  %s %s' % ('ok  ' if ok else 'FAIL', what)); sys.stdout.flush()
    if not ok:
        fails.append(what)
    return ok


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    d = os.path.abspath(args[0]); only = 'ABCDEF'; size = (1280, 720); shots = None
    i = 1
    while i < len(args):
        if args[i] == '--only': only = args[i + 1]; i += 2
        elif args[i] == '--size': size = tuple(int(v) for v in args[i + 1].split('x')); i += 2
        elif args[i] == '--shots': shots = os.path.abspath(args[i + 1]); os.makedirs(shots, exist_ok=True); i += 2
        else: i += 1
    url = lambda z: 'file://' + os.path.join(d, z) + '?journeytest'
    tag = '%dx%d' % size
    errors = []
    t00 = time.time()

    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=FLAGS)
        ctx = b.new_context(viewport={'width': size[0], 'height': size[1]}, accept_downloads=True)
        pg = ctx.new_page()
        pg.on('pageerror', lambda e: errors.append(str(e)))
        pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'willReadFrequently' not in m.text else None)

        def shot(name):
            if shots:
                pg.screenshot(path=os.path.join(shots, '%s-%s.png' % (name, tag)))

        def ready(timeout=400):
            pg.wait_for_function('window.__ready || window.__err', timeout=timeout * 1000)
            pg.wait_for_function('window.__journey && window.__journey.ready', timeout=30000)
            return pg.evaluate('window.__err || null')

        def where():
            return pg.evaluate("location.pathname.split('/').pop()")

        def slot():
            return pg.evaluate('(() => { const s = W3D.saves.slot(W3D.saves.current); return s ? { page: s.page, zone: s.bits && s.bits.zone } : null; })()')

        def at_gate(i=0, yaw=3.1416):
            """Io stands at the gate's spot, facing the ship (yaw 0: south); the land is stepped so the button can show.
            Returns the buttons shown."""
            return pg.evaluate('''([i, yaw]) => { const t = __journey.gates()[i], w = __w3d, M = w.P.M;
                __people.stop(); w.setIo(M.px(t.x), M.py(t.z), yaw); w.C.yaw = yaw + Math.PI; w.step(0.3, 30, true); __things.tick(); __journey.gateTick();
                const bs = [...document.querySelectorAll('.talkbtn')].filter((e) => e.style.display !== 'none');
                return bs.map((e) => { const r = e.getBoundingClientRect(); return { text: e.textContent, w: r.width, h: r.height, y: r.top + r.height / 2 }; }); }''', [i, yaw])

        def end_story():
            pg.evaluate("(() => { const m = Object.assign({}, __story.state().moments, { leaving: true }); __story.set({ moments: m }); })()")

        def board_and_choose(to, pic=None, expect_open=None):
            pg.evaluate('() => { window.__boarded = __journey.board(); }')
            pg.wait_for_function('!!(W3D.maps && W3D.maps.world.choosing)', timeout=30000)
            pg.wait_for_timeout(1500)
            st = pg.evaluate('''(to) => { const h = W3D.maps.world.choosing; h.pick(to); const g = document.querySelector('.cvm-go');
                const marks = [...document.querySelectorAll('[class*="cvm-mark"]')].map((m) => m.className);
                return { go: g ? g.textContent : null, log: __journey.log.filter((l) => l.what === 'board').pop(), lines: __journey.log.filter((l) => l.what === 'line').map((l) => l.text) }; }''', to)
            pg.wait_for_timeout(600)
            if pic:
                shot(pic)
            if expect_open is not None:
                check(st['log'] and sorted(st['log']['open']) == sorted(expect_open), 'boarding offers: %s' % json.dumps(st['log'] and st['log']['open']))
            check(st['go'] is not None, 'the map offers "%s" for %s' % (st['go'], to))
            pg.evaluate("document.querySelector('.cvm-go').click()")
            return st['lines']

        def flight_page(page_name, timeout=120):
            pg.wait_for_url('**/' + page_name + '*', timeout=timeout * 1000)
            pg.wait_for_function('!!(window.W3D && W3D.flight && W3D.flight.flying)', timeout=180000)
            return pg.evaluate('W3D.flight.whenReady()')

        def ask(cmd, a=None):
            return pg.evaluate('([c, a]) => W3D.flight.test(c, a)', [cmd, a or {}])

        def fly_through():
            ask('safe', {'on': True})
            s = ask('step', {'seconds': 200, 'auto': True, 'until': 'raised'})
            raised = bool(s and s.get('raised'))
            pg.wait_for_timeout(600)
            said1 = pg.evaluate("__journey.log.filter((l) => l.what === 'said').map((l) => l.id)")
            last = None
            for _ in range(40):
                try:
                    s2 = ask('step', {'seconds': 20, 'auto': True, 'fight': True})
                except Exception:
                    break
                if not s2 or 'error' in s2:
                    break
                last = s2
                if s2.get('ended'):
                    break
            return raised, said1

        # ---------------- A ----------------
        if 'A' in only:
            print('A. a new game on zone 1, to zone 2 by the ship')
            t0 = time.time(); pg.goto(url('zone-1.html')); err = ready(); notes['zone 1 opens (s, no screen)'] = round(time.time() - t0)
            check(not err and where() == 'zone-1.html', 'zone 1 opens (%d s here)' % notes['zone 1 opens (s, no screen)'])
            pg.click('#begin button')
            pg.wait_for_timeout(500)
            st = pg.evaluate('__journey.state()')
            check(st['reached'] == ['wickhollow'], 'a new game has reached Wickhollow only: %s' % json.dumps(st['reached']))
            bs = at_gate(0, 0)
            check(bs and bs[-1]['text'] == 'Board the ship' and bs[-1]['h'] >= 44 and bs[-1]['w'] >= 44, 'at the foot of the gangway the button says "Board the ship" (%s)' % json.dumps(bs))
            pg.evaluate('() => __journey.board()'); pg.wait_for_timeout(300)
            ln = pg.evaluate("__journey.log.filter((l) => l.what === 'line').map((l) => l.text)")
            check(ln and 'lamps' in ln[-1] and not pg.evaluate('!!W3D.maps.world.choosing'), 'before the story is done, with nowhere reached, she says why and the map does not open: "%s"' % (ln[-1] if ln else ''))
            end_story()
            check(pg.evaluate('__journey.isDone()'), "zone 1's story set to its end (the moment \"leaving\")")
            pg.evaluate('() => { window.__shown = document.querySelector(".cj-line"); }')
            bs = at_gate(0, 0); pg.wait_for_timeout(5000); at_gate(0, 0); shot('a1-gate-zone-1')
            board_and_choose('warmCamp', 'a2-map-choose', ['warmCamp'])
            t0 = time.time(); s = flight_page('zone-2.html'); notes['flight starts (s)'] = round(time.time() - t0)
            check(s and s.get('state') == 'fly' and s.get('ship') == 'skiff', 'zone 2\'s page opens and the flight in starts before its world: %s, in the %s' % (s and s.get('state'), s and s.get('ship')))
            check(not pg.evaluate('!!window.__w3d'), 'no world is built under the flight')
            pg.wait_for_timeout(2500); shot('a3-flight-in')
            raised, said1 = fly_through()
            check(raised and 'z2.captain.01' in said1 and 'z2.narrator.01' in said1, 'the raiders come, and the narrator\'s and the Grey Hat\'s "flight" lines are said: %s' % ', '.join(said1))
            err = ready()
            said = pg.evaluate("__journey.log.filter((l) => l.what === 'said').map((l) => l.id)")
            check(not err and 'z2.captain.02' in said and 'z2.narrator.02' in said, 'they are seen off: "flight-after" lines said (%s); the world is built' % ', '.join(said))
            kept = pg.evaluate("(() => { const s = JSON.parse(localStorage.getItem('coven.story.z2.v1')); return { heard: ['z2.captain.01','z2.captain.02','z2.narrator.01','z2.narrator.02'].filter((k) => s.heard[k]), m: s.moments }; })()")
            check(len(kept['heard']) == 4 and kept['m'].get('flight') and kept['m'].get('flight-after'), 'zone 2\'s story counts them as heard')
            pg.wait_for_function('__story.state().moments.landing === true', timeout=20000); shot('a4-landing-zone-2')
            check(pg.evaluate('__journey.arrived') and where() == 'zone-2.html', 'the coven has landed at the Warm Roads, and the landing\'s lines begin')
            pg.wait_for_timeout(500)
            sl = slot(); check(sl and sl['page'] == 'zone-2.html' and sl['zone'] == 2, 'the slot now says zone 2: %s' % json.dumps(sl))
            check(pg.evaluate('__journey.state().reached') == ['wickhollow', 'warmCamp'], 'reached: Wickhollow and the Warm Roads')
            bs = at_gate(); check(bs and bs[-1]['text'] == 'Board the ship', 'zone 2 has its ship and its button too'); shot('a5-gate-zone-2')
            ships = pg.evaluate('W3D.landingShips.list()')
            check(len(ships) == 1 and ships[0]['ship'] == 'cutter', 'the ship at the Warm Roads: %s' % json.dumps(ships))

        # ---------------- B ----------------
        if 'B' in only:
            print('B. Continue: zone 1\'s page opened, the slot was last saved on zone 2')
            pg.goto(url('zone-1.html'))
            pg.wait_for_url('**/zone-2.html*', timeout=200000)
            err = ready()
            check(not err and where() == 'zone-2.html' and not pg.evaluate('__journey.arrived'), 'zone 1\'s page opened zone 2\'s, with no flight')

        # ---------------- C ----------------
        if 'C' in only:
            print('C. a flight lost')
            check(not pg.evaluate('__journey.isDone()'), 'zone 2\'s story is not done')
            ln = board_and_choose('wickhollow', None, ['wickhollow'])
            check(ln and 'Warm Roads' in ln[-1], 'she says why she won\'t go on: "%s"' % (ln[-1] if ln else ''))
            flight_page('zone-1.html')
            ask('step', {'seconds': 5, 'auto': True}); ask('sink')
            D = pg.evaluate('COVEN_FLIGHT_DATA.lostSeconds')
            try:
                ask('step', {'seconds': D + 1})
            except Exception:
                pass
            pg.wait_for_url('**/zone-2.html*', timeout=60000)
            err = ready(); pg.wait_for_timeout(1500)
            ln = pg.evaluate("__journey.log.filter((l) => l.what === 'line').map((l) => l.text)")
            check(not err and ln and 'brought her home' in ln[-1], 'back at the Warm Roads: "%s"' % (ln[-1] if ln else ''))
            dist = pg.evaluate('(() => { const t = __journey.gates()[0], M = __w3d.P.M; return Math.hypot(M.x(__w3d.io.px) - t.x, M.z(__w3d.io.py) - t.z); })()')
            check(dist < 4, 'standing by the ship, where she boarded (%.1f m from the gate)' % dist)
            shot('c1-back-after-lost')
            sl = slot(); check(sl and sl['page'] == 'zone-2.html', 'the slot still says zone 2')

        # ---------------- D ----------------
        if 'D' in only:
            print('D. a flight back to Wickhollow')
            board_and_choose('wickhollow')
            s = flight_page('zone-1.html'); fly_through()
            err = ready()
            said = pg.evaluate("__journey.log.filter((l) => l.what === 'said').length")
            check(not err and pg.evaluate('__journey.arrived') and said == 0, 'landed at Wickhollow, with no flight lines (they are zone 2\'s and 3\'s, for the flight in)')
            pos = pg.evaluate("(() => { const p = __w3d.P.parts.find((q) => q.id === 'jetty'), M = __w3d.P.M; return [M.x(__w3d.io.px) - p.ox, M.z(__w3d.io.py) - p.oz]; })()")
            check(abs(pos[0] - 0) < 3 and abs(pos[1] - (690 - 512) * 0.05) < 3, 'Io stands on the jetty\'s pier: %.1f, %.1f m from the jetty\'s middle' % tuple(pos))
            pg.wait_for_timeout(800); shot('d1-landed-wickhollow')
            sl = slot(); check(sl and sl['page'] == 'zone-1.html', 'the slot says zone 1')

        # ---------------- E ----------------
        if 'E' in only:
            print('E. zone 2 to zone 3')
            board_and_choose('warmCamp', None, ['warmCamp'])
            flight_page('zone-2.html'); fly_through(); err = ready()
            check(not err and pg.evaluate("__journey.log.filter((l) => l.what === 'said').length") == 0, 'the second flight into zone 2 says no flight lines')
            end_story()
            board_and_choose('northCamp', None, ['wickhollow', 'northCamp'])
            flight_page('zone-3.html'); pg.wait_for_timeout(2000); shot('e1-flight-in-zone-3')
            raised, said1 = fly_through(); err = ready()
            said = pg.evaluate("__journey.log.filter((l) => l.what === 'said').map((l) => l.id)")
            check(not err and all(k in said for k in ['z3.narrator.01', 'z3.captain.01', 'z3.narrator.02', 'z3.captain.02']), 'zone 3\'s flight lines: %s' % ', '.join(said))
            pg.wait_for_function('__story.state().moments.landing === true', timeout=20000)
            pg.wait_for_timeout(500); sl = slot(); check(sl and sl['page'] == 'zone-3.html' and sl['zone'] == 3, 'the slot says zone 3: %s' % json.dumps(sl))
            ships = pg.evaluate('W3D.landingShips.list()')
            check(len(ships) == 2 and ships[0]['shown'] and not ships[1]['shown'], 'the ship lies at the northern camp, not yet on the slip: %s' % json.dumps(ships))
            bs = at_gate(0); check(bs and bs[-1]['text'] == 'Board the ship', 'her button at the camp'); shot('e2-landing-zone-3')
            pg.evaluate("(() => { __people.move('captain', { place: ['shipyard', 800, 384], look: [764, 240] }, true); })()"); pg.wait_for_timeout(1200)
            ships = pg.evaluate('W3D.landingShips.list()')
            check(ships[1]['shown'] and not ships[0]['shown'], 'once the Grey Hat has gone to the slip, she is on the slip and not at the camp')
            bs = at_gate(1); pg.evaluate('() => __journey.board(1)'); pg.wait_for_timeout(300)
            ln = pg.evaluate("__journey.log.filter((l) => l.what === 'line').map((l) => l.text)")
            check(ln and 'slip' in ln[-1] and not pg.evaluate('!!W3D.maps.world.choosing'), 'on the slip, before the story is done, she will not fly: "%s"' % (ln[-1] if ln else ''))
            pg.wait_for_timeout(5000); at_gate(1); shot('e3-on-the-slip')

        # ---------------- F ----------------
        if 'F' in only:
            print('F. the front door')
            pg.goto(url('index.html')); pg.wait_for_function('window.__ready', timeout=30000); pg.wait_for_timeout(300)
            st = pg.evaluate('''(() => { const bs = [...document.querySelectorAll('button')].map((e) => { const r = e.getBoundingClientRect(); return { text: e.textContent, w: r.width, h: r.height }; });
                return { title: document.querySelector('h1').textContent, bs }; })()''')
            shot('f1-front-door')
            check(st['title'] == 'Coven of the Moon Faire', 'the name: %s' % st['title'])
            check(all(x['h'] >= 44 for x in st['bs']) and len(st['bs']) <= 4, 'its buttons (%d), each 44 px or more: %s' % (len(st['bs']), ' / '.join(x['text'] for x in st['bs'])))
            if 'E' in only or 'A' in only:
                pg.click('button[data-slot]')
                pg.wait_for_url('**/zone-*.html*', timeout=60000)
                check(where() in ('zone-2.html', 'zone-3.html'), 'Carry on opens the slot\'s page: %s' % where())

        b.close()
    real = [e for e in errors if 'willReadFrequently' not in e]
    print('page errors: %d' % len(real))
    for e in real[:8]:
        print('   ', e[:300])
    check(not real, 'no page errors')
    notes['seconds in all'] = round(time.time() - t00)
    print(json.dumps(notes))
    print('ALL PASSED' if not fails else '%d FAILED' % len(fails)); sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
