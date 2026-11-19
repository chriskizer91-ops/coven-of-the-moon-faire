#!/usr/bin/env python3
"""battle-test.py: plays fights of the built battle page to their end with no screen, and checks them by numbers.

    python3 tools/battle-test.py builds/battle.html                  # every fight on the list, at its own level
    python3 tools/battle-test.py builds/battle.html --every          # and every pack of foes and every Horror form
    python3 tools/battle-test.py builds/battle.html --fights band1,gate5 --level 12 --turbo 40 --size 320x180

With no screen the battle draws only a few frames a second, so it is sped up (turbo 40) and drawn small (320 by 180) and at half
sharpness, or one fight would take ten minutes. Here a fight takes two to four minutes.

Each fight plays itself (the expert play style), sped up (turbo), with the sound made but silent. For each it checks:
  1. the fight starts, reaches its end and shows its end card;
  2. every sound the fight asked for exists, and the sound made no errors;
  3. the page made no errors at all, from the first fight to the last.
It prints one line a fight: who fought, the outcome, how long the battle ran on its own clock, how many sounds played.
"""
import os, sys, time
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
page_file = os.path.abspath(args[0])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
EVERY = '--every' in args
LEVEL = int(opt('--level', 0))
TURBO = float(opt('--turbo', 40))
ONLY = opt('--fights', '')
SIZE = [int(x) for x in opt('--size', '320x180').split('x')]

WRAP = """() => {
  const real = window.makeBattleSound; window.__snd = { made: [], calls: {} };
  window.makeBattleSound = (o) => {
    const S = real(o), T = window.__snd; T.made.push(S);
    const sfx = new Proxy({}, { get: (_, k) => (...a) => { T.calls[k] = (T.calls[k] || 0) + 1; return S.sfx[k](...a); } });
    return new Proxy(S, { get: (o2, k) => (k === 'sfx' ? sfx : o2[k]) });
  };
}"""

errors, fails, t0 = [], [], time.time()
def log(s): print('%5.0fs  %s' % (time.time() - t0, s), flush=True)

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': SIZE[0], 'height': SIZE[1]})
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errors.append('console: ' + m.text) if m.type == 'error' else None)
    pg.goto('file://' + page_file, wait_until='load', timeout=180000)
    pg.wait_for_function('!!window.__arena', timeout=180000)
    pg.evaluate("() => { try { localStorage.setItem('mfw.flipbook', '0'); localStorage.setItem('envoi.sharp', '0.5'); } catch (e) {} }")
    pg.evaluate(WRAP)
    # the list of fights to play: [id, options]
    runs = []
    for F in pg.evaluate("() => window.__arena.FIGHTS.map((F) => ({ id: F.id, level: F.level, kind: F.kind, band: F.band, pack: !!F.pack, forms: !!F.forms, levels: F.levels }))"):
        if ONLY and F['id'] not in ONLY.split(','): continue
        L = LEVEL or F['level']
        L = max(F['levels'][0], min(F['levels'][1], L))
        runs.append((F['id'], {'level': L}))
        if EVERY and F['kind'] == 'wild' and not F['pack'] and not F['forms']:
            n = pg.evaluate("(b) => window.BattleSim.BAND_PACKS[b].filter((p) => p[0] !== 'bramble?').length", F['band'])
            runs += [(F['id'], {'level': L, 'foes': 'p%d' % i}) for i in range(n)]
        if EVERY and F['forms']:
            runs += [(F['id'], {'level': L, 'foes': f}) for f in ['bramble', 'brambleAmbush', 'brambleTowering', 'brambleAncient']]
    log('%d fights to play' % len(runs))
    for fid, o in runs:
        pg.evaluate("() => { window.__snd.calls = {}; }")
        pg.evaluate("([i, o]) => { window.__arena.start(i, Object.assign({ watch: 'expert' }, o)); }", [fid, o])
        try:
            pg.wait_for_function('!!window.__battle', timeout=180000)
            pg.evaluate("(tb) => { window.__snd.made.forEach((S) => S.init()); window.__snd.made.forEach((S) => S.setMuted && S.setMuted(true)); window.__battle.turbo = tb; }", TURBO)
            pg.wait_for_function("window.__battle && window.__battle.state === 'over' && !document.getElementById('end').hidden", timeout=2400000, polling=500)
        except Exception as e:
            fails.append('%s %s did not reach its end: %s' % (fid, o, str(e).split('\n')[0]))
            log('FAIL  %s %s did not reach its end' % (fid, o)); pg.evaluate("() => window.__arena.stop()"); continue
        r = pg.evaluate("""() => { const T = window.__snd, B = window.__battle;
          return { outcome: B.result.outcome, t: Math.round(B.t), heroes: B.engine.heroes.map((h) => h.id).join(' + '), foes: B.engine.foes.map((f) => f.id).join(', '),
                   calls: T.calls, missing: T.made.flatMap((x) => [...(x.missing || [])]), errs: T.made.flatMap((x) => x.errors || []) }; }""")
        n = sum(r['calls'].values())
        ok = not r['missing'] and not r['errs']
        if not ok: fails.append('%s %s: sounds missing %s, sound errors %s' % (fid, o, r['missing'], r['errs']))
        log('%s  %-9s L%-2d %-12s %s against %s: %s after %d s of battle. %d sounds, %d different%s' % (
            'ok   ' if ok else 'FAIL ', fid, o['level'], o.get('foes', ''), r['heroes'], r['foes'], r['outcome'], r['t'], n, len(r['calls']),
            '' if ok else '. Missing: %s' % r['missing']))
        pg.evaluate("() => window.__arena.stop()")
    b.close()

log('page errors: %d' % len(errors))
for e in errors[:10]: log('  ! ' + e)
print('%d fights played, %d failed, %d page errors' % (len(runs), len(fails), len(errors)))
sys.exit(1 if fails or errors else 0)
