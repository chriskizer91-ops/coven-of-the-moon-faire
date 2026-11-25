#!/usr/bin/env python3
"""battle-frame-test.py: is every fighter whole, clear of the boxes, and big enough on the screen? (fights-polish job)

    python3 tools/battle-frame-test.py builds/fights-lab.html <out folder> [--only zone-1-A,zone-2-A] [--sizes 412x880,1280x720,880x412] [--min 110]
    python3 tools/battle-frame-test.py builds/zone-2.html <out folder> --land [--sizes ...]

On the fights lab page it starts each fight asked for (the player's own: nobody chooses a move, so the camera rests on
its wide shot while the menu waits), takes a picture of the intro while "Skip intro" shows, and one of the resting shot,
and measures where each fighter stands on the screen (window.__battle.boxes(): the box round its meshes as drawn).
With --land it does the same for slot A's fight on a zone's page (as the hub's pictures of November 25 did).
It checks, for the resting shot: every witch and every foe wholly inside the picture with a margin, above the two
panels at the bottom and clear of the foes' name box at the top left; on an upright phone, each witch at least --min
pixels tall (110 by default). For the intro: "Skip intro" does not lie over the frame-rate words, and is 44 px or more
tall. The browser here has no graphics card: its frame rate means nothing, and the pictures are stills.
"""
import os, sys, json
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
SIZES = [tuple(int(x) for x in s.split('x')) for s in opt('--sizes', '412x880,1280x720,880x412').split(',')]
ONLY = [x for x in opt('--only', 'zone-1-A,zone-1-B,zone-2-A,zone-4-B').split(',') if x]
MIN = float(opt('--min', '110')); LAND = '--land' in args; MARGIN = 6
os.makedirs(out, exist_ok=True)
FLAGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl']
ok, bad, errors, rows = [], [], [], []
def check(cond, what): (ok if cond else bad).append(what); print(('  ok    ' if cond else '  FAIL  ') + what, flush=True)

# the frame-rate words and "Skip intro", where each is on the screen
RECTS = """() => { const r = (e) => { if (!e) return null; const b = e.getBoundingClientRect(); return b.width ? [b.left, b.top, b.right, b.bottom].map(Math.round) : null; };
  const skip = document.getElementById('skipBtn'), shown = skip && !document.getElementById('skip').hidden;
  const rate = [...document.querySelectorAll('.coven-battle > div, #fps, #fpsB')].find((e) => /frames a second|fps/i.test(e.textContent) && e.getBoundingClientRect().width);
  let rr = null; if (rate) { const g = document.createRange(); g.selectNodeContents(rate); const b = g.getBoundingClientRect(); rr = b.width ? [b.left, b.top, b.right, b.bottom].map(Math.round) : r(rate); }
  return { skip: shown ? r(skip) : null, rate: rr, rateText: rate ? rate.textContent : '' }; }"""
LAND_READY = "() => { const F = window.__fights, Z = window.COVEN_ENCOUNTERS[F.zone], S = window.COVEN_SLOTS.zones[F.zone].A; let n = 0; while (F.party.level < Math.max(Z.levels[0] + 1, S.from || 1) && n++ < 400) F.party.afterBattle({ result: 'won', won: true, xp: 300, shards: 0, party: {} }); F.party.rest(); window.__battle = null; F.auto = null; F.meet({ slot: 'A' }); return F.zone; }"

def judge(name, w, h, m):
    tall = h > w
    for f in m['fighters']:
        x0, y0, x1, y1 = f['box']; who = '%s %s (%s)' % (name, f['key'], f['kind'])
        check(x0 >= MARGIN and x1 <= w - MARGIN and y0 >= MARGIN, '%s: wholly inside the picture (box %s on %dx%d)' % (who, f['box'], w, h))
        check(y1 <= m['uiTop'] - 2, '%s: above the two panels (feet at %d, panels from %d)' % (who, y1, m['uiTop']))
        if m['enemyBottom'] and x0 < 200: check(y0 >= m['enemyBottom'] + 2, '%s: clear of the name box (top %d, box ends %d)' % (who, y0, m['enemyBottom']))
        if tall and f['side'] == 'hero': check(f['hpx'] >= MIN, '%s: at least %d px tall on an upright phone (%d px, %.2f m)' % (who, MIN, f['hpx'], f['mh']))

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=FLAGS)
    for (w, h) in SIZES:
        tag = '%dx%d' % (w, h)
        ctx = b.new_context(viewport={'width': w, 'height': h}, has_touch=(w < 600), is_mobile=(w < 600)); pg = ctx.new_page()
        pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
        for fid in (['land'] if LAND else ONLY):
            if LAND:
                pg.goto('file://' + page_file + '?test&fights', timeout=600000)
                pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr)) || window.__err', timeout=600000); pg.wait_for_timeout(1000)
                fid = pg.evaluate(LAND_READY) + '-A'
            else:
                pg.goto('file://' + page_file, wait_until='load', timeout=180000); pg.wait_for_function('!!window.__lab', timeout=180000)
                # the creatures' models are unpacked a moment after the page opens: a fight started before shows stand-ins
                pg.wait_for_function('!window.M7 || window.M7.isReady', timeout=180000)
                pg.evaluate("() => { try { localStorage.setItem('mfw.flipbook', '0'); } catch (e) {} }")
                pg.evaluate("(i) => { window.__battle = null; window.__lab.start(i, {}); }", fid)
            print('%s at %s' % (fid, tag), flush=True)
            # the intro, while "Skip intro" shows (and the frame-rate words have been written once)
            try:
                pg.wait_for_function("() => { const s = document.getElementById('skip'); return s && !s.hidden; }", timeout=240000, polling=100)
                try: pg.wait_for_function("() => [...document.querySelectorAll('.coven-battle > div, #fps')].some((e) => /\\d+ frames a second|\\d+\\s*fps/i.test(e.textContent))", timeout=8000, polling=200)
                except Exception: pass
                r = pg.evaluate(RECTS); pg.screenshot(path=os.path.join(out, '%s-intro-%s.png' % (fid, tag)))
                if r['skip']:
                    sk, ra = r['skip'], r['rate']
                    check(sk[3] - sk[1] >= 44, '%s %s: "Skip intro" is %d px tall (44 or more)' % (fid, tag, sk[3] - sk[1]))
                    if ra: check(sk[2] <= ra[0] or sk[0] >= ra[2] or sk[3] <= ra[1] or sk[1] >= ra[3], '%s %s: "Skip intro" %s clear of the frame-rate words %s ("%s")' % (fid, tag, sk, ra, r['rateText']))
                    check(sk[0] >= 0 and sk[2] <= w and sk[1] >= 0, '%s %s: "Skip intro" inside the screen' % (fid, tag))
            except Exception as e: print('  (no intro with "Skip intro" seen: %s)' % str(e).splitlines()[0])
            pg.evaluate("() => { const b = document.getElementById('skipBtn'); if (b && !document.getElementById('skip').hidden) b.click(); }")
            # the battle's clock runs by frames, and this browser draws only a few a second: hurried until the menu waits
            pg.wait_for_function("!!window.__battle", timeout=60000); pg.evaluate("() => { window.__battle.turbo = 4; }")
            # the resting shot: the menu waits for the player's first move
            pg.wait_for_function("window.__battle && window.__battle.state === 'battle' && window.__battle.menuOpen", timeout=300000, polling=200)
            pg.evaluate("() => { window.__battle.turbo = 0; }"); pg.wait_for_timeout(1500)
            # the camera glides into its resting shot, and this browser draws only a few frames a second: wait till it is there
            try: pg.wait_for_function("() => { const D = window.__battle.DIR; return !D.free || (D.pos.distanceTo(D.to.pos) < 0.03 && D.look.distanceTo(D.to.look) < 0.03); }", timeout=60000, polling=300)
            except Exception: print('  (the camera had not settled after a minute)')
            pg.wait_for_timeout(800)
            m = pg.evaluate("() => window.__battle.boxes()")
            pg.screenshot(path=os.path.join(out, '%s-rest-%s.png' % (fid, tag)))
            hs = [f['hpx'] for f in m['fighters'] if f['side'] == 'hero']
            fs = [(f['kind'], f['hpx']) for f in m['fighters'] if f['side'] == 'foe']
            print('  shot %s; witches %s px tall; foes %s; panels from %d, name box to %d' % (m['shot'], hs, fs, m['uiTop'], m['enemyBottom']), flush=True)
            rows.append({ 'fight': fid, 'size': tag, 'shot': m['shot'], 'witches': hs, 'foes': fs, 'boxes': m['fighters'], 'uiTop': m['uiTop'], 'enemyBottom': m['enemyBottom'] })
            judge(fid, w, h, m)
        ctx.close()
    b.close()
with open(os.path.join(out, 'frame-numbers.json'), 'w') as fh: json.dump(rows, fh, indent=1)
print('page errors: %d' % len(errors))
for e in errors[:10]: print('  ! ' + e)
print('%d ok, %d failed' % (len(ok), len(bad)))
for x in bad: print('  FAILED: ' + x)
sys.exit(1 if (bad or errors) else 0)
