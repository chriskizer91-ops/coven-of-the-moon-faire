#!/usr/bin/env python3
"""flight-test.py: the flight between zones, checked with no screen.

    python3 tools/flight-test.py builds/flight.html [--sim 4] [--json]

It opens the flight's try-out page with ?test and no network, and flies through the piece's own test handle
(W3D.flight.test, which runs the flight's clock without drawing):
  1. the piece is there, and a flight starts over the landing it leaves and fills the screen
  2. flown to the landing, fly() answers arrived; the raiders' two events come, in order; then nothing of it is left
  3. when the ship is lost, fly() answers not arrived; nothing is left
  4. stopping, a second flight while one is on, and a landing that is not there, each answer as they should
  5. left to run by itself it draws and flies; pausing holds it; the keys reach it and nothing under it
  6. the three flights between the four landings, and one back from the last: how long, how many raiders, and that
     each leaves in the ship the data file gives (all four ships fly)
  7. on a phone, upright (412 by 880) and on its side (880 by 412): everything to press is 44 px or more, nothing lies
     over the middle of the picture, the thumb stick and the Fire button work, and a thumb held on Fire slides to aim
  8. no request went to the network, and the page had no errors
With --sim N it also flies each flight N times as it would really go (shots do harm), once by a captain who only steers
for the landing and once by one who turns on the raiders and fires, and prints how each went: that is how hard it is.

It cannot see a picture or a motion, or measure a frame rate: look with tools/flight-look.py, and fly it on a real
laptop and phone.
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
if not args:
    sys.exit(__doc__)
page_file = os.path.abspath(args[0])
SIM = int(args[args.index('--sim') + 1]) if '--sim' in args else 0
errors, fails, requests, notes = [], [], [], {}
CHROME = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl']
HARMLESS = ('GPU stall', 'GL Driver Message', 'willReadFrequently', 'PCFSoftShadowMap')


def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok:
        fails.append(what)
    return ok


def open_page(b, size, touch=False):
    ctx = b.new_context(viewport={'width': size[0], 'height': size[1]}, has_touch=touch, is_mobile=touch, offline=True)
    pg = ctx.new_page()
    pg.set_default_timeout(240000)
    pg.on('pageerror', lambda e: errors.append('page error: ' + str(e)))
    pg.on('console', lambda m: errors.append('console ' + m.type + ': ' + m.text) if m.type == 'error' and not any(h in m.text for h in HARMLESS) else None)
    pg.on('request', lambda r: requests.append(r.url))
    pg.goto('file://' + page_file + '?test')
    pg.wait_for_function('window.__ready')
    return pg


def start(pg, frm, to, ship=None, hold=True, touch=None):
    """Start a flight and wait until it is ready. The promise's answer lands in window.__answer."""
    opts = {'from': frm, 'to': to, 'test': {'hold': hold}}
    if ship:
        opts['ship'] = ship
    if touch is not None:
        opts['test']['touch'] = touch
    pg.wait_for_function('!W3D.flight.flying', timeout=60000)   # (a flight just stopped takes a moment to take itself away)
    pg.evaluate("(o) => { window.__answer = null; window.__flightLog.length = 0; W3D.flight.fly(o).then((r) => { window.__answer = r; }); }", opts)
    return pg.evaluate('W3D.flight.whenReady()')


def ask(pg, cmd, a=None):
    return pg.evaluate('([c, a]) => W3D.flight.test(c, a)', [cmd, a or {}])


def answer(pg, wait=True):
    if wait:
        pg.wait_for_function('window.__answer !== null', timeout=60000)
    return pg.evaluate('window.__answer')


def left_over(pg):
    return pg.evaluate("({ layers: document.querySelectorAll('[data-coven-flight]').length, frames: document.querySelectorAll('iframe').length + window.frames.length, kids: document.body.children.length, flying: W3D.flight.flying })")


def events(pg):
    return [e['name'].replace('coven:flight-', '') for e in pg.evaluate('window.__flightLog')]


def fly_through(pg, fight=True, safe=True, limit=600):
    """Fly the flight that is on to its end on the flight's own clock. Returns the last state before the end."""
    if safe:
        ask(pg, 'safe', {'on': True})
    s = None
    for _ in range(int(limit / 20)):
        s2 = ask(pg, 'step', {'seconds': 20, 'auto': True, 'fight': fight})
        if 'error' in s2:
            break
        s = s2
        if s['ended']:
            break
    return s


def main():
    t00 = time.time()
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=CHROME)
        pg = open_page(b, (1280, 720))
        L = pg.evaluate('window.COVEN_LANDINGS'); D = pg.evaluate('window.COVEN_FLIGHT_DATA')
        flights = [(next(a for a in L if a['id'] == t['after']), t) for t in L if t.get('after')]
        flights.append((L[-1], next(a for a in L if a['id'] == L[-1]['after'])))   # and one back from the last landing: the fourth ship's flight
        f1 = flights[0]

        print('1. the piece, and a flight\'s start')
        base = left_over(pg)
        check(pg.evaluate("typeof W3D.flight.fly === 'function' && !W3D.flight.flying") and base['layers'] == 0 and base['frames'] == 0, 'W3D.flight.fly is there, and no flight is on')
        t0 = time.time(); s = start(pg, f1[0]['id'], f1[1]['id']); notes['start seconds (no screen)'] = round(time.time() - t0, 1)
        km = pg.evaluate('([a, b]) => W3D.flight.km(a, b)', [f1[0]['id'], f1[1]['id']])
        check(s and s['state'] == 'fly' and s['toGo'] == s['total'] and abs(s['total'] - km * 1000) < 2, 'she starts over %s, %.2f km from %s (the flight says %d m to go of %d)' % (f1[0]['name'], km, f1[1]['name'], s['toGo'], s['total']))
        check(s['height'] == D['startHeight'] and s['ship'] == D['shipFrom'][f1[0]['id']] and s['sail'] == D['sailAtStart'], 'at %d m, in the ship the data file gives for leaving %s (%s), sail at %d%%' % (s['height'], f1[0]['name'], s['ship'], s['sail'] * 100))
        box = pg.evaluate("(() => { const f = document.querySelector('[data-coven-flight] iframe').getBoundingClientRect(); return [f.left, f.top, f.width, f.height, innerWidth, innerHeight, +getComputedStyle(document.querySelector('[data-coven-flight]')).zIndex]; })()")
        check(box[:4] == [0, 0, box[4], box[5]] and box[6] == D['layer'], 'it fills the screen: %d by %d, in front of the page (layer %d)' % (box[2], box[3], box[6]))
        words = ask(pg, 'words')
        check(f1[1]['name'] in words and D['words']['ships'][s['ship']]['name'] in words, 'the words on it come from the data files (the landing\'s name, the ship\'s name)')

        print('2. flown to the landing')
        ask(pg, 'safe', {'on': True})
        s = ask(pg, 'step', {'seconds': 200, 'auto': True, 'until': 'raised'})
        want = next(r for r in D['raiders'] if km <= r['upToKm'])
        check(s['raised'] and s['raiders'] == len(want['ships']) and sorted(s['classes']) == sorted(want['ships']), 'the raiders come %d m into the flight (%.0f%% of the way): %s' % (s['total'] - s['toGo'], 100 * (s['total'] - s['toGo']) / s['total'], ', '.join(s['classes'])))
        check(events(pg) == ['start', 'raiders'], 'the event coven:flight-raiders is raised, once (%s)' % ', '.join(events(pg)))
        t0 = time.time(); last = fly_through(pg); r = answer(pg); notes['clock seconds for one flight (no screen)'] = round(time.time() - t0, 1)
        check(r and r.get('arrived') is True, 'fly() answers arrived: %s' % json.dumps(r))
        ev = events(pg)
        check(ev == ['start', 'raiders', 'clear', 'end'], 'the events come in order: %s' % ', '.join(ev))
        print('        (the simulated captain brought down %d of %d raiders, in %d s of flight)' % (r.get('downed', -1), len(want['ships']), r.get('seconds', -1)))
        lo = left_over(pg)
        check(lo == base, 'nothing of it is left on the page: %s' % json.dumps(lo))

        start(pg, f1[0]['id'], f1[1]['id']); ask(pg, 'safe'); s = ask(pg, 'step', {'seconds': 200, 'auto': True, 'until': 'raised'})
        s = ask(pg, 'step', {'seconds': D['raidersStay'] - 3, 'controls': {'sailTo': 0.1}}); held = s['raiders'] > 0 and not s['cleared']
        s = ask(pg, 'step', {'seconds': 6, 'controls': {'sailTo': 0.1}})
        check(held and s['fled'] and s['cleared'] and events(pg) == ['start', 'raiders', 'clear'], 'raiders not seen off after %d s give up and turn away, and that too raises coven:flight-clear' % D['raidersStay'])
        pg.evaluate('() => { W3D.flight.stop(); }'); answer(pg)
        print('3. the ship lost')
        start(pg, f1[0]['id'], f1[1]['id']); ask(pg, 'step', {'seconds': 5, 'auto': True}); s = ask(pg, 'sink')
        s = ask(pg, 'step', {'seconds': 1}); check(s['state'] == 'lost' and D['words']['lost'][0] in ask(pg, 'words'), 'her hull gone, the flight says so ("%s")' % D['words']['lost'][0])
        ask(pg, 'step', {'seconds': D['lostSeconds'] + 1}); r = answer(pg)
        check(r and r.get('arrived') is False and r.get('why') == 'lost', 'fly() answers not arrived, why: lost (%s)' % json.dumps(r))
        check(events(pg) == ['start', 'end'] and left_over(pg) == base, 'nothing of it is left on the page')

        print('4. stopping, and what cannot be flown')
        start(pg, f1[0]['id'], f1[1]['id'])
        busy = pg.evaluate("W3D.flight.fly({ from: 'wickhollow', to: 'warmCamp' })")
        check(busy == {'arrived': False, 'why': 'busy'}, 'a second flight while one is on answers busy')
        pg.evaluate('() => { W3D.flight.stop(); }'); r = answer(pg)
        check(r and r.get('arrived') is False and r.get('why') == 'stopped' and left_over(pg) == base, 'W3D.flight.stop() ends it: not arrived, why: stopped; nothing left')
        pg.evaluate("() => { window.__answer = null; W3D.flight.fly({ from: 'wickhollow', to: 'warmCamp', test: { hold: true } }).then((r) => { window.__answer = r; }); W3D.flight.stop(); }"); r = answer(pg)
        check(r and r.get('why') == 'stopped' and left_over(pg) == base, 'stopped before it has even started: the same, nothing left')
        none = pg.evaluate("W3D.flight.fly({ from: 'wickhollow', to: 'nowhere' })")
        check(none == {'arrived': False, 'why': 'no-landing'} and left_over(pg) == base, 'a landing that is not there answers no-landing')
        start(pg, f1[0]['id'], f1[1]['id']); ask(pg, 'pause', {'on': True})
        fr = pg.frames[-1]; fr.evaluate("document.getElementById('btn-back').click()"); r = answer(pg)
        check(r and r.get('why') == 'turned-back' and left_over(pg) == base, 'the pause card\'s "%s" ends it: not arrived, why: turned-back' % D['words']['turnBack'])

        print('5. left to run by itself')
        s0 = start(pg, f1[0]['id'], f1[1]['id'], hold=False)
        pg.evaluate("() => { window.__under = 0; window.addEventListener('keydown', () => window.__under++); }")
        pg.wait_for_timeout(2500); s1 = ask(pg, 'state')
        check(s1['frames'] > s0['frames'] and s1['t'] > 0.2, 'it draws and flies by itself: %d pictures and %.1f s of flight in 2.5 s (a browser with no screen is slow)' % (s1['frames'] - s0['frames'], s1['t']))
        pg.keyboard.down('d'); pg.wait_for_timeout(2500); pg.keyboard.up('d'); s2 = ask(pg, 'state')
        turned = (s1['heading'] - s2['heading'])
        check(turned > 0.02, 'the D key, pressed on the page round it, turns her to starboard (%.0f degrees)' % (turned * 57.3))
        check(pg.evaluate('window.__under') == 0, 'and the key reaches nothing under the flight')
        pg.evaluate('() => { W3D.flight.pause(true); }'); pg.wait_for_timeout(300); a = ask(pg, 'state'); pg.wait_for_timeout(1200); c = ask(pg, 'state')
        check(a['paused'] and c['t'] == a['t'], 'W3D.flight.pause(true) holds it (the flight\'s clock stays at %.1f s)' % c['t'])
        pg.evaluate('() => { W3D.flight.pause(false); }'); pg.wait_for_timeout(1500); c2 = ask(pg, 'state')
        check(not c2['paused'] and c2['t'] > c['t'], 'W3D.flight.pause(false) lets it go on')
        ask(pg, 'hold', {'on': True}); ask(pg, 'safe'); ask(pg, 'warp', {'frac': 0.97}); ask(pg, 'hold', {'on': False})
        r = answer(pg)
        check(r and r.get('arrived') is True and left_over(pg) == base, 'and by itself it arrives, fades and takes itself away: %s' % json.dumps(r))

        print('6. the flights, and the four ships')
        for a, t in flights:
            ship = D['shipFrom'][a['id']]; s = start(pg, a['id'], t['id'])
            kmf = s['total'] / 1000; want = next(r for r in D['raiders'] if kmf <= r['upToKm'])
            ask(pg, 'safe'); met = ask(pg, 'step', {'seconds': 300, 'auto': True, 'until': 'raised'})['classes']
            last = fly_through(pg, fight=True); r = answer(pg)
            check(r and r.get('arrived') and s['ship'] == ship and sorted(met) == sorted(want['ships']) and left_over(pg) == base,
                  '%s to %s: %.1f km in the %s, hurried %.2f times; %d raider%s (%s, %s skies); arrived after %d s with the simulated captain, who brought down %d'
                  % (a['name'], t['name'], kmf, D['words']['ships'][s['ship']]['cls'], s['hurry'], len(want['ships']), '' if len(want['ships']) == 1 else 's', ', '.join(want['ships']), want['skies'], r.get('seconds', -1), r.get('downed', -1)))
            notes['%s to %s' % (a['name'], t['name'])] = {'km': round(kmf, 2), 'ship': s['ship'], 'raiders': want['ships'], 'seconds with a fight': r.get('seconds')}
            s = start(pg, a['id'], t['id']); ask(pg, 'safe'); n = 0
            while not s['ended'] and n < 40:
                s = ask(pg, 'step', {'seconds': 20, 'auto': True}); n += 1
                if 'error' in s: break
            r = answer(pg); notes['%s to %s' % (a['name'], t['name'])]['seconds flown straight'] = r.get('seconds')
            check(r and r.get('arrived') and events(pg) == ['start', 'raiders', 'clear', 'end'], '   flown straight, never firing: arrived after %d s, and both events still came, in order' % r.get('seconds', -1))

        flown = sorted(set(v['ship'] for v in notes.values() if isinstance(v, dict)), key=D['ships'].index)
        # hub: Chris dropped the Brig and the Frigate from the flights (November 24): the ships that must fly are the ones
        # the table gives (shipFrom), not every ship listed. The Brig can still be named in a call: the next check does that
        table = sorted(set(D['shipFrom'][a['id']] for a, t in flights), key=D['ships'].index)
        check(flown == table, 'every ship the table gives flew (%d of the %d listed): %s' % (len(flown), len(D['ships']), ', '.join(D['words']['ships'][x]['cls'] for x in flown)))
        gave = pg.evaluate("(() => { W3D.flight.fly({ from: 'wickhollow', to: 'warmCamp', ship: 'brig', test: { hold: true } }); return W3D.flight.whenReady(); })()"); pg.evaluate('() => { W3D.flight.stop(); }'); pg.wait_for_function('!W3D.flight.flying')
        check(gave['ship'] == 'brig', 'a ship named in the call overrules the table (asked for the Brig from Wickhollow, got the %s)' % gave['ship'])
        if SIM:
            print('how hard it is: each flight %d times as it would really go' % SIM)
            for a, t in flights:
                for who, fight in (('only steers for the landing', False), ('turns on the raiders and fires', True)):
                    got, hull, secs = 0, [], []
                    for _ in range(SIM):
                        start(pg, a['id'], t['id']); fly_through(pg, fight=fight, safe=False); r = answer(pg)
                        got += 1 if r.get('arrived') else 0; hull.append(r.get('hull', 0)); secs.append(r.get('seconds', 0))
                    line = '%s to %s, a captain who %s: arrived %d of %d; hull left %d%% at worst, %d%% on average; %d s on average' % (a['name'], t['name'], who, got, SIM, min(hull) * 100, sum(hull) / len(hull) * 100, sum(secs) / len(secs))
                    print('  ' + line); notes.setdefault('sim', []).append(line)
        pg.context.close()

        print('7. on a phone')
        for size in ((412, 880), (880, 412)):
            pg = open_page(b, size, touch=True)
            s = start(pg, f1[0]['id'], f1[1]['id'], hold=True)
            name = '%d by %d' % size
            check(s['touch'], '%s: the flight shows its touch controls' % name)
            for stage in ('flying', 'raiders about'):
                if stage != 'flying':
                    ask(pg, 'safe'); ask(pg, 'step', {'seconds': 200, 'auto': True, 'until': 'raised'})
                bs = ask(pg, 'buttons'); small = [x for x in bs if x['w'] < 44 or x['h'] < 44]
                check(len(bs) >= 4 and not small, '%s, %s: %d things to press, the smallest %d by %d px (%s)' % (name, stage, len(bs), min(x['w'] for x in bs), min(x['h'] for x in bs), ', '.join('%s %dx%d' % (x['id'], x['w'], x['h']) for x in bs)))
                fr = pg.frames[-1]
                over = fr.evaluate("""() => { const W = innerWidth, H = innerHeight, box = [W * 0.3, H * 0.33, W * 0.7, H * 0.67], out = [];
                    for (const e of document.querySelectorAll('#hud > *, #paused, #error')) { if (['tags', 'hurt', 'aim', 'banner'].includes(e.id)) continue; const r = e.getBoundingClientRect(), cs = getComputedStyle(e);
                      if (r.width && r.height && cs.visibility !== 'hidden' && +cs.opacity > 0.01 && r.right > box[0] && r.left < box[2] && r.bottom > box[1] && r.top < box[3]) out.push(e.id); } return out; }""")
                check(not over, '%s, %s: nothing lies over the middle of the picture%s' % (name, stage, '' if not over else ': ' + ', '.join(over)))
                off = [x for x in bs if x['x'] < 0 or x['y'] < 0 or x['x'] + x['w'] > size[0] or x['y'] + x['h'] > size[1]]
                check(not off, '%s, %s: everything to press is on the screen' % (name, stage))
            # the thumb stick and the Fire button, by touches made in the flight's own page
            ask(pg, 'hold', {'on': False}); fr = pg.frames[-1]; h0 = ask(pg, 'state')
            fr.evaluate("""([x, y]) => { const c = document.getElementById('stage'), ev = (t, dx) => c.dispatchEvent(new PointerEvent(t, { pointerType: 'touch', pointerId: 7, clientX: x + dx, clientY: y, bubbles: true }));
                ev('pointerdown', 0); ev('pointermove', 60); }""", [size[0] * 0.2, size[1] * 0.7])
            pg.wait_for_timeout(2500); h1 = ask(pg, 'state')
            check(h1['stick'] and h0['heading'] - h1['heading'] > 0.02, '%s: a left thumb pushed right shows the stick and turns her to starboard (%.0f degrees)' % (name, (h0['heading'] - h1['heading']) * 57.3))
            # a thumb goes down on the middle of the Fire button and stays there
            fr.evaluate("""() => { document.getElementById('stage').dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', pointerId: 7, bubbles: true }));
                const b = document.getElementById('btn-fire'), r = b.getBoundingClientRect(); window.__fireAt = [r.left + r.width / 2, r.top + r.height / 2];
                b.dispatchEvent(new PointerEvent('pointerdown', { pointerType: 'touch', pointerId: 8, clientX: window.__fireAt[0], clientY: window.__fireAt[1], bubbles: true })); }""")
            fired = 0
            for _ in range(12):
                pg.wait_for_timeout(250); fired = max(fired, ask(pg, 'state')['bolts'])
                if fired: break
            check(fired > 0, '%s: the Fire button, held, fires her guns' % name)
            # Chris, November 24: "the fire button is also a joystick, so you can fire and aim at the same time".
            # The same thumb, still down, slides 90 px left and 40 px up, right off the button: the view must turn with
            # it, and the guns must go on firing all the while.
            v0 = ask(pg, 'state')
            fr.evaluate("""() => { const b = document.getElementById('btn-fire'), [x, y] = window.__fireAt;
                for (let i = 1; i <= 9; i++) b.dispatchEvent(new PointerEvent('pointermove', { pointerType: 'touch', pointerId: 8, clientX: x - i * 10, clientY: y - i * 40 / 9, bubbles: true })); }""")
            pg.wait_for_timeout(400); v1 = ask(pg, 'state')
            turned = (v1['view'][0] - v0['view'][0]) * 57.3; tipped = (v1['view'][1] - v0['view'][1]) * 57.3
            check(abs(turned) > 10 and abs(tipped) > 3 and v1['firing'], '%s: the thumb held on Fire, slid 90 px left and 40 px up, turns the view %.0f degrees and tips it %.0f, still firing' % (name, turned, tipped))
            pg.wait_for_timeout(4200); v2 = ask(pg, 'state')
            check(v2['firing'] and abs(v2['view'][0] - v1['view'][0]) < 0.02, '%s: held still there for 4 seconds, the view stays where the thumb put it and the guns go on firing' % name)
            fr.evaluate("() => document.getElementById('btn-fire').dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', pointerId: 8, bubbles: true }))")
            pg.wait_for_timeout(300); v3 = ask(pg, 'state')
            check(not v3['firing'], '%s: the thumb lifted, the guns stop' % name)
            # and the other way to aim still works: a thumb dragged on the sky, with nothing held
            fr.evaluate("""([x, y]) => { const c = document.getElementById('stage'), ev = (t, dx) => c.dispatchEvent(new PointerEvent(t, { pointerType: 'touch', pointerId: 9, clientX: x + dx, clientY: y, bubbles: true }));
                ev('pointerdown', 0); for (let i = 1; i <= 6; i++) ev('pointermove', i * 10); window.dispatchEvent(new PointerEvent('pointerup', { pointerType: 'touch', pointerId: 9, bubbles: true })); }""", [size[0] * 0.7, size[1] * 0.35])
            pg.wait_for_timeout(300); v4 = ask(pg, 'state')
            check(abs(v4['view'][0] - v3['view'][0]) * 57.3 > 8 and not v4['firing'], '%s: a thumb dragged 60 px on the sky turns the view %.0f degrees without firing' % (name, (v4['view'][0] - v3['view'][0]) * 57.3))
            pg.evaluate('() => { W3D.flight.stop(); }'); answer(pg)
            pg.context.close()
        b.close()

    print('8. the network, and errors')
    net = [u for u in requests if not u.startswith(('file:', 'data:', 'blob:', 'about:'))]
    files = sorted(set(u.split('?')[0] for u in requests if u.startswith('file:')))
    check(not net, 'no request went to the network (%d requests in all, every one for the page\'s own file)%s' % (len(requests), '' if not net else ': ' + ', '.join(net[:5])))
    check(len(files) == 1, 'one file was read: %s' % ', '.join(os.path.basename(f) for f in files))
    check(not errors, '%d page errors%s' % (len(errors), '' if not errors else ': ' + ' | '.join(e[:200] for e in errors[:5])))
    if '--json' in args:
        print(json.dumps(notes, indent=1))
    print('\n%s in %.0f s: %d checks failed' % ('ALL GOOD' if not fails else 'NOT GOOD', time.time() - t00, len(fails)))
    for f in fails:
        print('  FAILED: ' + f)
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    main()
