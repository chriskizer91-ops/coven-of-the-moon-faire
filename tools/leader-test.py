#!/usr/bin/env python3
"""leader-test.py: who leads, checked on a zone page (the leader job, November 25, 2026).

    python3 tools/leader-test.py builds [--page zone-1.html] [--only ABC] [--shots <folder>] [--quick]

builds is the folder with the built pages. Chris (November 25): "all four witches from the beginning. Any of them can
lead, so there has to be a thing in the menu to change who's the walking-around model."

  A  as the checks open a page (?test&fights: nothing is saved). The menu's Coven tab has "Who leads": the four by name,
     the one leading marked, every button 44 px or more at 1280x720, 412x880 and 880x412, and the arrow keys and Enter
     work. Each of the four is chosen in turn: the one walking changes at once, where she stood and facing as she
     faced, with the story, the party and the game's keys as they were; then she walks 20 m and runs 10 m (her model
     goes with her, the camera follows, she stands still after); a fight is started and played to its end with her
     leading (she leads after it, where she stood); and once, a rest at the camp. Nothing is written to the browser.
  B  as a player would (no ?test: the save is real, in a new browser of its own). Kore is chosen in slot 1; the page
     opened again starts with Kore. A new game in slot 2 starts with Io (the start); Europa is chosen there. Slot 1
     continued: Kore; slot 2 continued: Europa. A save from before this job (no leader kept) loads with the one who
     walked in it: Io, or Callisto if she was the one. Save to a file carries the leader.
  C  the journey (needs zone-2.html and index.html beside the page): slot 1 (Kore) boards the ship at the end of zone 1's
     story, flies to the Warm Roads, and lands there with Kore leading; the front door's Carry on opens zone 2 with Kore;
     zone 1 opened as the ending at the Faire has Kore leading.
--quick leaves out the fights (one fight, with Kore) and the run.

The browser here has no screen: it cannot show motion or measure a frame rate. Only a real laptop or phone can.
"""
import json, math, os, sys, time
from playwright.sync_api import sync_playwright

FLAGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--autoplay-policy=no-user-gesture-required']
FOUR = ['io', 'kore', 'europa', 'callisto']
fails, errors = [], []


def check(ok, what):
    print('  %s %s' % ('ok  ' if ok else 'FAIL', what)); sys.stdout.flush()
    if not ok:
        fails.append(what)
    return ok


# a fight, played to its end by the battle's own player (as tools/encounter-test.py does)
FIGHT = """async () => {
  const F = window.__fights, W = window.__w3d; F.auto = 'expert';
  window.__battle = null;
  const m = F.meet();
  await new Promise((r) => { const t = setInterval(() => { if (window.__battle && window.__battle.engine && document.querySelector('.coven-battle')) { clearInterval(t); r(); } }, 200); });
  const during = { paused: W.paused, who: W.who, heroes: window.__battle.engine.heroes.map((h) => h.id) };
  window.__battle.turbo = 40;
  const t2 = setInterval(() => { const B = window.__battle; if (B && B.state === 'over' && !document.getElementById('end').hidden) { clearInterval(t2); B.again(); } }, 500);
  await new Promise((r) => { const t = setInterval(() => { if (!F.busy) { clearInterval(t); r(); } }, 300); });
  return { during, outcome: F.last && (F.last.outcome || F.last.result), paused: W.paused, layer: !!document.querySelector('.coven-battle') };
}"""
# a spot in the wilds, some way from the camp, where she can stand (as tools/encounter-test.py finds one)
WILD = """() => { const F = window.__fights, W = window.__w3d, M = W.P.M, mm = F.meetings, D = window.COVEN_ENCOUNTERS[F.zone], c = F.camp.at;
  for (let r = 150; r < 900; r += 40) for (let a = 0; a < 6.28; a += 0.4) { const x = c[0] + Math.cos(a) * r, z = c[1] + Math.sin(a) * r, B = W.P.land.bounds;
    if (x < B[0] + 30 || x > B[2] - 30 || z < B[1] + 30 || z > B[3] - 30 || mm.inside(x, z, D.margin + 20)) continue;
    const q = W.nearestFit(M.px(x), M.py(z)), qx = M.x(q[0]), qz = M.z(q[1]); if (Math.hypot(qx - x, qz - z) < 6 && !mm.inside(qx, qz, D.margin)) return [qx, qz]; }
  return [c[0] + 200, c[1]]; }"""
PUT = "([x, z, yaw]) => { const W = window.__w3d, M = W.P.M, a = W.nearestFit(M.px(x), M.py(z)); W.setIo(a[0], a[1], yaw || 0); W.C.yaw = (yaw || 0) + Math.PI; if (window.__fights) window.__fights.meetings.calm(); W.step(0.2, 30, false); return [M.x(W.io.px), M.z(W.io.py)]; }"
# where she is, and her model: the walker keeps her (io), the model is drawn there
HER = """() => { const W = window.__w3d, M = W.P.M, A = W.A, r = A.root, cam = W.cam, x = M.x(W.io.px), z = M.z(W.io.py);
  let inScene = false; for (let q = r; q; q = q.parent) if (q.isScene) inScene = true;
  const others = (W3D.WITCHES || []).filter((w) => w.id !== W.who).map((w) => { const B = W3D.witch(w.id); let s = false; for (let q = B.root; q; q = q.parent) if (q.isScene) s = true; return s; });
  return { who: W.who, lead: W3D.leader.get(), x, z, y: W.io.y, yaw: W.io.yaw, model: [r.position.x, r.position.y, r.position.z], modelYaw: r.rotation.y, inScene, othersDrawn: others.filter(Boolean).length,
    cam: Math.hypot(cam.position.x - x, cam.position.z - z), camUp: cam.position.y - W.io.y, moving: W.io.moving, speed: W.io.speed }; }"""
# what must not change when she is chosen: the story, the party, the game's keys (the ?test layer and the browser)
STATE = """() => { const S = window.__story, F = window.__fights, st = S && S.state ? S.state() : null, keys = {};
  for (const k of W3D.saves.store.keys()) if (W3D.saves.isSlotKey(k) && k !== 'coven.where' && k !== 'coven.leader') keys[k] = W3D.saves.store.get(k);
  return JSON.stringify({ st: st && { stage: st.stage, moments: st.moments, heard: Object.keys(st.heard || {}).length }, party: F && F.party ? F.party.state : null, keys }); }"""
BTNS = """() => [...document.querySelectorAll('.cm-leadb')].map((b) => { const r = b.getBoundingClientRect();
  return { id: b.dataset.leader, name: b.querySelector('b').textContent, w: r.width, h: r.height, x: r.left, y: r.top, right: r.right, on: b.getAttribute('aria-checked') === 'true', cls: b.classList.contains('cm-on') }; })"""


def main():
    args = sys.argv[1:]
    if not args:
        sys.exit(__doc__)
    d = os.path.abspath(args[0]); page = 'zone-1.html'; only = 'ABC'; shots = None; quick = False
    i = 1
    while i < len(args):
        if args[i] == '--page': page = args[i + 1]; i += 2
        elif args[i] == '--only': only = args[i + 1]; i += 2
        elif args[i] == '--shots': shots = os.path.abspath(args[i + 1]); os.makedirs(shots, exist_ok=True); i += 2
        elif args[i] == '--quick': quick = True; i += 1
        else: i += 1
    t00 = time.time()
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=FLAGS)
        if 'A' in only:
            part_a(b, d, page, shots, quick)
        if 'B' in only:
            part_bc(b, d, page, shots, 'C' in only)
        elif 'C' in only:
            part_bc(b, d, page, shots, True, only_c=True)
        b.close()
    errs = [e for e in errors if 'willReadFrequently' not in e]
    check(not errs, 'no page errors (%d)%s' % (len(errs), (': ' + ' | '.join(errs[:4])) if errs else ''))
    print('\n%s: %d failed (%d s)' % ('ALL PASSED' if not fails else 'FAILED', len(fails), time.time() - t00))
    for f in fails:
        print('  FAILED:', f)
    sys.exit(1 if fails else 0)


def new_page(b, size):
    ctx = b.new_context(viewport={'width': size[0], 'height': size[1]}, accept_downloads=True)
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' else None)
    return ctx, pg


def walk(pg, metres, mag, secs=60):
    """She walks forward (the thumb pushed up) until she has gone so far; returns the metres, the game's seconds, her
    speed and what the camera and her model did on the way"""
    return pg.evaluate("""([metres, mag, secs]) => { const W = window.__w3d, M = W.P.M, x0 = M.x(W.io.px), z0 = M.z(W.io.py); let t = 0, far = 0, camMax = 0, camMin = 1e9, off = 0, moving = 0, n = 0;
      W.push(0, -1, mag);
      while (far < metres && t < secs) { W.step(1 / 30, 30, false); t += 1 / 30; n++; const x = M.x(W.io.px), z = M.z(W.io.py); far = Math.hypot(x - x0, z - z0);
        const r = W.A.root.position; off = Math.max(off, Math.hypot(r.x - x, r.z - z)); const c = Math.hypot(W.cam.position.x - x, W.cam.position.z - z); camMax = Math.max(camMax, c); camMin = Math.min(camMin, c); if (W.io.moving) moving++;
        if (window.__fights) window.__fights.meetings.calm(); }
      W.push(null); for (let i = 0; i < 45; i++) W.step(1 / 30, 30, false); W.render();
      return { far, t, speed: far / t, off, camMin, camMax, moving: moving / n, still: !W.io.moving }; }""", [metres, mag, secs])


def part_a(b, d, page, shots, quick):
    print('A. as the checks open it (?test&fights), on %s' % page)
    ctx, pg = new_page(b, (1280, 720))
    t0 = time.time(); pg.goto('file://' + os.path.join(d, page) + '?test&fights', timeout=600000)
    pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr) && W3D.menu && W3D.menu.ready) || window.__err', timeout=900000)
    check(not pg.evaluate('window.__err || null'), 'the page started (%d s here)' % (time.time() - t0))
    h0 = pg.evaluate(HER)
    check(h0['who'] == 'io' and h0['lead'] == 'io', 'a new game: Io leads, as before this job (%s walks, %s leads)' % (h0['who'], h0['lead']))
    zone = pg.evaluate('W3D.saves.zone')
    fights = pg.evaluate('!!window.__fights')
    # ---- the menu's place ----
    pg.evaluate("W3D.menu.open('coven')"); pg.wait_for_timeout(300)
    for size in [(1280, 720), (412, 880), (880, 412)]:
        pg.set_viewport_size({'width': size[0], 'height': size[1]}); pg.wait_for_timeout(300)
        bs = pg.evaluate(BTNS)
        names = [x['name'] for x in bs]; on = [x['id'] for x in bs if x['on'] and x['cls']]
        small = min(min(x['w'], x['h']) for x in bs) if bs else 0
        inside = all(x['x'] >= 0 and x['right'] <= size[0] + 0.5 for x in bs)
        check(names == ['Io', 'Kore', 'Europa', 'Callisto'] and on == ['io'] and small >= 44 and inside,
              'at %dx%d "Who leads" shows %s, Io marked as leading, the smallest button %d by %d px, none off the screen' % (size[0], size[1], ', '.join(names), min(x['w'] for x in bs), min(x['h'] for x in bs)))
        if shots: pg.screenshot(path=os.path.join(shots, 'menu-who-leads-%dx%d.png' % size))
    pg.set_viewport_size({'width': 1280, 'height': 720}); pg.wait_for_timeout(300)
    # the keys: the arrows move between the four, Enter chooses
    pg.focus('.cm-leadb[data-leader="io"]'); pg.press('.cm-leadb[data-leader="io"]', 'ArrowRight')
    f1 = pg.evaluate('document.activeElement && document.activeElement.dataset.leader')
    pg.press('.cm-leadb[data-leader="kore"]', 'ArrowLeft'); f2 = pg.evaluate('document.activeElement && document.activeElement.dataset.leader')
    pg.press('.cm-leadb[data-leader="io"]', 'End'); f3 = pg.evaluate('document.activeElement && document.activeElement.dataset.leader')
    check(f1 == 'kore' and f2 == 'io' and f3 == 'callisto', 'the arrow keys move between the four (right: %s, left: %s, End: %s)' % (f1, f2, f3))
    wild = pg.evaluate(WILD) if fights else None
    order = ['kore', 'europa', 'callisto', 'io']
    for n, w in enumerate(order):
        print('  -- %s leads' % w)
        if wild:
            pg.evaluate("W3D.menu.close()"); pg.evaluate(PUT, [wild[0], wild[1], 0.7 + n]); pg.evaluate("W3D.menu.open('coven')"); pg.wait_for_timeout(200)
        before = pg.evaluate(HER); s0 = pg.evaluate(STATE)
        t1 = time.time()
        if n == 0:
            pg.press('.cm-leadb[data-leader="callisto"]', 'Home'); pg.press('.cm-leadb[data-leader="io"]', 'ArrowRight'); pg.press('.cm-leadb[data-leader="kore"]', 'Enter')
        else:
            pg.click('.cm-leadb[data-leader="%s"]' % w)
        pg.wait_for_function("(w) => window.__w3d.who === w && !document.querySelector('.cm-leadb.cm-busy')", arg=w, timeout=120000)
        took = time.time() - t1
        after = pg.evaluate(HER); s1 = pg.evaluate(STATE)
        mark = pg.evaluate("() => ({ on: [...document.querySelectorAll('.cm-leadb.cm-on')].map((b) => b.dataset.leader), badge: [...document.querySelectorAll('.cm-witch .cm-walking')].map((e) => e.closest('.cm-witch').dataset.witch), note: (document.querySelector('.cm-note') || {}).textContent, focus: document.activeElement && document.activeElement.dataset.leader, open: W3D.menu.isOpen() })")
        moved = math.hypot(after['x'] - before['x'], after['z'] - before['z'])
        mdist = math.hypot(after['model'][0] - after['x'], after['model'][2] - after['z'])
        check(after['who'] == w and after['lead'] == w and mark['on'] == [w] and mark['badge'] == [w] and mark['open'],
              '%s chosen %s: she walks now and leads, marked in the row and on her card, the menu still open; it says "%s" (%.1f s here)' % (w, 'with the keys (Home, right, Enter)' if n == 0 else 'with a click', mark['note'], took))
        check(moved < 0.01 and abs(after['yaw'] - before['yaw']) < 1e-6 and mdist < 0.01 and abs(after['model'][1] - after['y']) < 0.01 and abs(((after['modelYaw'] - after['yaw'] + math.pi) % (2 * math.pi)) - math.pi) < 1e-3,
              'she stands where %s stood (moved %.3f m), facing as she faced (%.2f), her model on that spot (%.3f m off)' % (before['who'], moved, after['yaw'], mdist))
        check(after['inScene'] and after['othersDrawn'] == 0, 'her model is drawn and the one before is not (%d others drawn)' % after['othersDrawn'])
        check(s1 == s0, 'the story, the party and the game\'s keys are as they were')
        check(mark['focus'] == w, 'the keys stay on her button (for the next arrow)')
        pg.evaluate("W3D.menu.close()")
        if shots: pg.evaluate('(() => { __w3d.step(0.5, 30, true); })()'); pg.screenshot(path=os.path.join(shots, 'a-%s-chosen.png' % w))
        wk = walk(pg, 20, 0.6)
        h = pg.evaluate(HER)
        check(wk['far'] >= 20 and wk['off'] < 0.01 and wk['moving'] > 0.9 and wk['still'] and 2.5 < wk['camMin'] and wk['camMax'] < 12,
              '%s walks 20 m in %.1f s (%.1f m a second), her model with her all the way (%.3f m off at most), the camera %.1f to %.1f m behind; she stands still after' % (w, wk['t'], wk['speed'], wk['off'], wk['camMin'], wk['camMax']))
        if shots: pg.screenshot(path=os.path.join(shots, 'a-%s-walked.png' % w))
        if not quick:
            rn = walk(pg, 10, 1.0)
            check(rn['far'] >= 10 and rn['speed'] > 2.2 and rn['off'] < 0.01, '%s runs 10 m in %.1f s (%.1f m a second)' % (w, rn['t'], rn['speed']))
        # a fight with her leading
        if fights and (not quick or w == 'kore'):
            pg.evaluate(PUT, [wild[0], wild[1], 0.4])
            pre = pg.evaluate(HER)
            t2 = time.time(); r = pg.evaluate(FIGHT); post = pg.evaluate(HER)
            check(r['during']['paused'] and r['during']['who'] == w and set(r['during']['heroes']) >= {'io', 'jester', 'fox', 'ranger'},
                  'a fight starts with %s leading: the land waits; all four fight (%s)' % (w, ', '.join(r['during']['heroes'])))
            check(not r['paused'] and not r['layer'] and post['who'] == w and post['lead'] == w and post['inScene'] and math.hypot(post['x'] - pre['x'], post['z'] - pre['z']) < 0.5,
                  'after it (%s, %d s here) %s still leads, where she stood, and the land goes on' % (r['outcome'], time.time() - t2, w))
        pg.evaluate("W3D.menu.open('coven')"); pg.wait_for_timeout(200)
    pg.evaluate("W3D.menu.close()")
    # a rest at the camp, with Europa leading
    if fights:
        pg.evaluate("W3D.menu.open('coven')"); pg.click('.cm-leadb[data-leader="europa"]')
        pg.wait_for_function("window.__w3d.who === 'europa' && !document.querySelector('.cm-leadb.cm-busy')", timeout=60000); pg.evaluate("W3D.menu.close()")
        camp = pg.evaluate("window.__fights.camp.wake || window.__fights.camp.at")
        pg.evaluate("() => { window.__fights.party.setHp('io', 10); }")
        pg.evaluate(PUT, [camp[0], camp[1], 0]); pg.wait_for_timeout(900)
        r = pg.evaluate("() => { const b = [...document.querySelectorAll('#cvParty .cvBtn')].find((e) => !e.hidden); if (b) b.click(); return { pressed: !!b, whole: window.__fights.party.whole() }; }")
        h = pg.evaluate(HER)
        check(r['pressed'] and r['whole'] and h['who'] == 'europa' and h['lead'] == 'europa', 'a rest at the camp with Europa leading: the party is whole, and Europa still leads')
    # nothing written with ?test
    ls = pg.evaluate("() => { const o = []; for (let i = 0; i < localStorage.length; i++) o.push(localStorage.key(i)); return o; }")
    check('coven.leader' not in ls and not any(k.startswith('coven.slot.') for k in ls), '?test writes nothing of the leader to the browser (keys there: %s)' % (', '.join(ls) or 'none'))
    ctx.close()


def part_bc(b, d, page, shots, do_c, only_c=False):
    ctx, pg = new_page(b, (1280, 720))
    url = lambda pgn: 'file://' + os.path.join(d, pgn) + '?journeytest'

    def ready(timeout=900):
        pg.wait_for_function('(window.__ready && W3D.menu && W3D.menu.ready) || window.__err', timeout=timeout * 1000)
        return pg.evaluate('window.__err || null')

    def begin():
        pg.evaluate("(() => { const b = document.querySelector('#begin'); if (b && getComputedStyle(b).display !== 'none') b.querySelector('button').click(); })()")
        pg.wait_for_timeout(400)

    def choose(w):
        pg.evaluate("W3D.menu.open('coven')"); pg.wait_for_timeout(200); pg.click('.cm-leadb[data-leader="%s"]' % w)
        pg.wait_for_function("(w) => window.__w3d.who === w && !document.querySelector('.cm-leadb.cm-busy')", arg=w, timeout=120000)
        pg.evaluate("W3D.menu.close()")

    def kept(n):
        return pg.evaluate("(n) => { const s = JSON.parse(localStorage.getItem('coven.slot.' + n) || 'null'); if (!s) return null; const l = s.keys['coven.leader'], w = s.keys['coven.where']; return { leader: l ? JSON.parse(l).who : null, where: w ? JSON.parse(w).who : null, page: s.page }; }", n)

    def nav(js, t=900):
        """run js, which opens the page again (or another), and wait for the page to be ready"""
        with pg.expect_navigation(timeout=t * 1000):
            try: pg.evaluate(js)
            except Exception: pass
        err = ready(t); begin(); return err

    def who_at_start():
        return pg.evaluate("window.__leaderAtStart || null")

    # the walker's first model, as the page made it (before anything could swap it): which witch was built first
    pg.add_init_script("""(() => { const t = setInterval(() => { const W = window.W3D; if (W && W.witch && !W.witch.__seen) { const f = W.witch; W.witch = function (id) { if (!window.__leaderAtStart) window.__leaderAtStart = id; return f.apply(this, arguments); }; W.witch.__seen = true; clearInterval(t); } }, 5); })()""")
    if not only_c:
        print('B. as a player would: the save is real (a new browser of its own), on %s' % page)
        t0 = time.time(); pg.goto(url(page), timeout=600000); err = ready(); begin()
        check(not err and pg.evaluate('__w3d.who') == 'io', 'a new game opens with Io leading (%d s here)' % (time.time() - t0))
        choose('kore'); pg.wait_for_timeout(500)
        k = kept(1); ls = pg.evaluate("JSON.parse(localStorage.getItem('coven.leader') || 'null')")
        check(ls and ls['who'] == 'kore' and k and k['leader'] == 'kore', 'Kore chosen: kept at once in the game (%s) and in slot 1 (%s)' % (ls and ls['who'], k and k['leader']))
        err = nav('location.reload()')
        check(not err and pg.evaluate('__w3d.who') == 'kore' and who_at_start() == 'kore', 'the page opened again (Carry on) starts with Kore, the first and only one made (%s)' % who_at_start())
        err = nav('W3D.saves.fresh(2)')
        check(not err and pg.evaluate('W3D.saves.current') == 2 and pg.evaluate('__w3d.who') == 'io', 'a new game in slot 2 starts with Io (the start: menu-data.js)')
        choose('europa'); pg.wait_for_timeout(300)
        err = nav('W3D.saves.load(1)')
        check(not err and pg.evaluate('W3D.saves.current') == 1 and pg.evaluate('__w3d.who') == 'kore', 'slot 1 continued: Kore leads')
        err = nav('W3D.saves.load(2)')
        check(not err and pg.evaluate('W3D.saves.current') == 2 and pg.evaluate('__w3d.who') == 'europa', 'slot 2 continued: Europa leads')
        k1, k2 = kept(1), kept(2)
        check(k1['leader'] == 'kore' and k2['leader'] == 'europa', 'each slot keeps its own: slot 1 %s, slot 2 %s' % (k1['leader'], k2['leader']))
        # a save made before this job: no coven.leader; coven.where says who walked
        for who_then in ['io', 'callisto']:
            pg.evaluate("""(w) => { const s = JSON.parse(localStorage.getItem('coven.slot.1')); delete s.keys['coven.leader']; const wh = JSON.parse(s.keys['coven.where']); wh.who = w; s.keys['coven.where'] = JSON.stringify(wh); s.n = 3; localStorage.setItem('coven.slot.3', JSON.stringify(s)); }""", who_then)
            err = nav('W3D.saves.load(3)')
            check(not err and pg.evaluate('__w3d.who') == who_then and who_at_start() == who_then, 'a save from before this job, in which %s walked, loads with %s leading' % (who_then, who_then))
        # the file
        f = pg.evaluate('(() => { const f = W3D.saves.toFile(); return f && JSON.parse(f.text).keys; })()')
        check(f and 'coven.where' in f, 'Save to a file holds the save (%d keys)' % len(f or {}))
        choose('callisto'); f = pg.evaluate('(() => { const f = W3D.saves.toFile(); return f && JSON.parse(f.text).keys["coven.leader"]; })()')
        check(f and json.loads(f)['who'] == 'callisto', 'once one is chosen, Save to a file carries her: %s' % f)
        err = nav('W3D.saves.load(1)')
        check(not err and pg.evaluate('__w3d.who') == 'kore', 'back to slot 1: Kore')
        if shots: pg.screenshot(path=os.path.join(shots, 'b-slot-1-kore.png'))
    if do_c:
        print('C. the journey, with Kore leading')
        if only_c:
            pg.goto(url(page), timeout=600000); ready(); begin(); choose('kore')
        z2 = os.path.exists(os.path.join(d, 'zone-2.html'))
        if not z2:
            check(False, 'zone-2.html is beside the page (for the flight)')
        else:
            pg.evaluate("__story.flag('journey.leave', true)")
            pg.evaluate("() => { const t = __journey.gates()[0], w = __w3d, M = w.P.M; __people.stop(); w.setIo(M.px(t.x), M.py(t.z), 0); w.step(0.3, 30, false); }")
            pg.evaluate('() => { window.__boarded = __journey.board(); }')
            pg.wait_for_function('!!(W3D.maps && W3D.maps.world.choosing)', timeout=60000); pg.wait_for_timeout(1500)
            pg.evaluate("(() => { W3D.maps.world.choosing.pick('warmCamp'); })()"); pg.wait_for_timeout(600)
            pg.evaluate("document.querySelector('.cvm-go').click()")
            # the leaving's lines, pressed through, then zone 2's page
            GO = "[...document.querySelectorAll('.talkbtn')].find((e) => e.style.display !== 'none' && e.textContent === 'Go on')"
            t1 = time.time()
            while time.time() - t1 < 200:
                try:
                    if pg.evaluate("location.pathname.split('/').pop()") != page: break
                    pg.evaluate("(() => { const b = " + GO + "; if (b) b.click(); })()")
                except Exception:
                    break
                time.sleep(1.2)
            pg.wait_for_url('**/zone-2.html*', timeout=200000)
            pg.wait_for_function('!!(window.W3D && W3D.flight && W3D.flight.flying)', timeout=300000)
            ask = lambda c, a=None: pg.evaluate('([c, a]) => W3D.flight.test(c, a)', [c, a or {}])
            ask('safe', {'on': True}); ask('step', {'seconds': 200, 'auto': True, 'until': 'raised'})
            for _ in range(40):
                try: s2 = ask('step', {'seconds': 20, 'auto': True, 'fight': True})
                except Exception: break
                if not s2 or 'error' in s2 or s2.get('ended'): break
            err = ready(); pg.wait_for_timeout(1500)
            check(not err and pg.evaluate('__journey.arrived') and pg.evaluate('__w3d.who') == 'kore' and who_at_start() == 'kore',
                  'after the flight, zone 2\'s page opens with Kore leading (made first: %s)' % who_at_start())
            if shots: pg.evaluate('(() => { __w3d.step(0.5, 30, true); })()'); pg.screenshot(path=os.path.join(shots, 'c-zone-2-landed-kore.png'))
            pg.wait_for_timeout(500); k = kept(1)
            check(k and k['leader'] == 'kore' and k['page'] == 'zone-2.html', 'slot 1 now says zone 2, with Kore leading')
        if os.path.exists(os.path.join(d, 'index.html')):
            pg.goto(url('index.html')); pg.wait_for_selector('.slot', timeout=60000)
            pg.click('.slot[data-slot="1"]')
            pg.wait_for_url('**/zone-*.html*', timeout=120000); err = ready(); begin()
            check(not err and pg.evaluate('__w3d.who') == 'kore', 'the front door\'s Carry on opens %s with Kore leading' % pg.evaluate("location.pathname.split('/').pop()"))
        else:
            check(False, 'index.html is beside the page (the front door)')
        # the ending at the Faire: zone 1's page opened with the journey at its end (as after the flight home). Set from the
        # front door, which keeps no walker and saves nothing by itself: the game's journey key says "ending", and the slot
        # was last saved on zone 1's page
        pg.goto(url('index.html')); pg.wait_for_selector('.slot', timeout=60000)
        pg.evaluate("""() => { const k = 'coven.story.journey', n = W3D.saves.current, rec = JSON.parse(localStorage.getItem('coven.slot.' + n));
          const s = JSON.parse(localStorage.getItem(k) || '{"v":1,"reached":["wickhollow"]}'); s.ending = true; localStorage.setItem(k, JSON.stringify(s));
          rec.keys[k] = JSON.stringify(s); rec.page = 'zone-1.html'; localStorage.setItem('coven.slot.' + n, JSON.stringify(rec)); }""")
        pg.goto(url('zone-1.html')); err = ready(); begin()
        ending = pg.evaluate('!!(window.__journey && __journey.ending)')
        check(not err and ending and pg.evaluate('__w3d.who') == 'kore', 'zone 1 opened as the ending at the Faire (%s) has Kore leading' % ('the ending' if ending else 'NOT the ending'))
        if shots: pg.evaluate('(() => { __w3d.step(0.5, 30, true); })()'); pg.screenshot(path=os.path.join(shots, 'c-ending-kore.png'))
    ctx.close()


if __name__ == '__main__':
    main()
