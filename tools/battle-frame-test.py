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

fight-camera (November 25): the camera's new shots are measured too.
    python3 tools/battle-frame-test.py builds/fights-lab.html <out folder> --only greatBramble,zone-2-A --shots [--min-wide 150] [--no-intro]
 - A giant foe (taller or wider than the battle's FRAMING.loom) may be cut by the picture's edge: only the place it
   stands must be inside. Everyone else must still be whole.
 - The resting shot on a screen wider than it is tall: each witch at least --min-wide pixels tall on a 720 px high
   screen (150 by default; the same share of a taller or shorter one).
 - The ground: in every still, no bare ground in the lower part of the picture where live ground should be (the
   battle's own count, window.__battle.ground()), and the picture itself is looked at: the strip just above the
   panels, in three parts, and the lower part of each side edge must each show some grass, not the bare dark alone
   (left out in a place whose painter's ground is nearly bare, where there is no grass to see).
 - With --shots, each kind of shot is set by the battle's hook (window.__battle.shot) and a still taken: close on a
   witch (she must stand between a third and six tenths of the picture's height, whole, above the panels); close on
   the foe (a giant: from below, its top inside); over her shoulder at the foe; over a witch's shoulder at the foe as it
   acts; close on a witch as she is hit; everyone on one side at once (all of them whole).
 - Numbers: four numbers and two words are put up at the same moment over witches standing side by side, and one
   word over the foe's head: no two may overlap, and each must be whole inside the picture.
"""
import os, sys, json
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
SIZES = [tuple(int(x) for x in s.split('x')) for s in opt('--sizes', '412x880,1280x720,880x412').split(',')]
ONLY = [x for x in opt('--only', 'zone-1-A,zone-1-B,zone-2-A,zone-4-B').split(',') if x]
MIN = float(opt('--min', '110')); LAND = '--land' in args; MARGIN = 6
# fight-camera: the new shots
SHOTS = '--shots' in args; MINW = float(opt('--min-wide', '150')); NOINTRO = '--no-intro' in args
try: from PIL import Image
except Exception: Image = None
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

def judge(name, w, h, m, loom=None):
    tall = h > w
    for f in m['fighters']:
        x0, y0, x1, y1 = f['box']; who = '%s %s (%s)' % (name, f['key'], f['kind'])
        # fight-camera: a giant may be cut by the top or the side of the picture (the battle's FRAMING.loom says who is one):
        # only the place it stands must be in the picture, above the panels
        if loom and f['side'] == 'foe' and (f['tall'] > loom['tall'] or f.get('halfW', 0) > loom['halfW']):
            fx, fy = f.get('foot', [(x0 + x1) / 2, y1])
            check(MARGIN <= fx <= w - MARGIN and fy <= m['uiTop'] - 2, '%s: a giant, the place it stands is in the picture, above the panels (at %d, %d; it may be cut by the edge: box %s)' % (who, fx, fy, f['box']))
            continue
        check(x0 >= MARGIN and x1 <= w - MARGIN and y0 >= MARGIN, '%s: wholly inside the picture (box %s on %dx%d)' % (who, f['box'], w, h))
        check(y1 <= m['uiTop'] - 2, '%s: above the two panels (feet at %d, panels from %d)' % (who, y1, m['uiTop']))
        if m['enemyBottom'] and x0 < 200: check(y0 >= m['enemyBottom'] + 2, '%s: clear of the name box (top %d, box ends %d)' % (who, y0, m['enemyBottom']))
        if tall and f['side'] == 'hero': check(f['hpx'] >= MIN, '%s: at least %d px tall on an upright phone (%d px, %.2f m)' % (who, MIN, f['hpx'], f['mh']))
        # fight-camera: and on a screen wider than tall, at least --min-wide px on a 720 px high one
        if not tall and h >= 600 and f['side'] == 'hero': check(f['hpx'] >= MINW * h / 720, '%s: at least %d px tall in the resting shot (%d px)' % (who, round(MINW * h / 720), f['hpx']))

# fight-camera: the ground in a still. The battle's own count, and the picture looked at: five places near the picture's
# lower edge and sides must each show some grass. A pixel is "bare" when it is as dark as the ground with nothing on it
def ground(name, w, h, m, g, png, sparse):
    check(g['bare'] == 0, '%s: no bare ground where live ground should be (%d of %d places looked at were bare; %d tufts grown round the painter\'s %d)' % (name, g['bare'], g['looked'], g['ring'], g['live']))
    if not Image or sparse or g['looked'] < 9: return
    im = Image.open(png).convert('RGB'); px = im.load(); top = m['uiTop']
    def grass(x0, y0, x1, y1):
        n = k = 0
        for y in range(max(0, y0), min(h, y1), 2):
            for x in range(max(0, x0), min(w, x1), 2):
                r, gg, b = px[x, y]; n += 1; k += 1 if max(r, gg, b) > 78 else 0
        return k / max(1, n)
    parts = { 'left of the strip above the panels': (4, top - 44, w // 3, top - 4), 'middle of it': (w // 3, top - 44, 2 * w // 3, top - 4), 'right of it': (2 * w // 3, top - 44, w - 4, top - 4) }
    for what, box in parts.items():
        v = grass(*box); check(v >= 0.015, '%s: grass in the %s (%.1f%% of it is lit grass, not the bare dark)' % (name, what, v * 100))

# fight-camera: are two boxes apart, and is a box inside the picture?
def apart(a, b): return a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1]
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
                if NOINTRO: raise Exception('left out (--no-intro)')
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
            # fight-camera: the foes are still rising when the menu first waits (the great bramble takes 4.6 s): wait for them
            t0 = pg.evaluate("() => window.__battle.t"); pg.wait_for_function("(t) => window.__battle.t >= t + 4.5", arg=t0, timeout=240000, polling=200)
            pg.evaluate("() => { window.__battle.turbo = 0; }"); pg.wait_for_timeout(1500)
            # the camera glides into its resting shot, and this browser draws only a few frames a second: wait till it is there
            try: pg.wait_for_function("() => { const D = window.__battle.DIR; return !D.free || (D.pos.distanceTo(D.to.pos) < 0.03 && D.look.distanceTo(D.to.look) < 0.03); }", timeout=60000, polling=300)
            except Exception: print('  (the camera had not settled after a minute)')
            pg.wait_for_timeout(800)
            m = pg.evaluate("() => window.__battle.boxes()")
            pg.screenshot(path=os.path.join(out, '%s-rest-%s.png' % (fid, tag)))
            # fight-camera: who is a giant, what ground the camera sees, and whether the place has grass to see at all
            more = pg.evaluate("() => { const B = window.__battle, A = B.arena; return { loom: B.framing ? B.framing.loom : null, ground: B.ground ? B.ground() : null, density: A && A.place && A.place.floor && A.place.floor.density != null ? A.place.floor.density : 1, where: A && A.place && A.place.floor ? A.place.floor.where || '' : '' }; }")
            loom, sparse = more['loom'], (more['density'] < 0.5 or bool(more['where']))
            hs = [f['hpx'] for f in m['fighters'] if f['side'] == 'hero']
            fs = [(f['kind'], f['hpx']) for f in m['fighters'] if f['side'] == 'foe']
            print('  shot %s; witches %s px tall; foes %s; panels from %d, name box to %d' % (m['shot'], hs, fs, m['uiTop'], m['enemyBottom']), flush=True)
            rows.append({ 'fight': fid, 'size': tag, 'shot': m['shot'], 'witches': hs, 'foes': fs, 'boxes': m['fighters'], 'uiTop': m['uiTop'], 'enemyBottom': m['enemyBottom'] })
            judge(fid, w, h, m, loom)
            if more['ground'] and not more['where']: ground('%s %s resting shot' % (fid, tag), w, h, m, more['ground'], os.path.join(out, '%s-rest-%s.png' % (fid, tag)), sparse)
            if SHOTS and more['ground']:
                # fight-camera: each kind of shot, set by the hook, measured and photographed
                keys = pg.evaluate("() => { const F = window.__battle.F; return { foes: Object.keys(F).filter((k) => F[k].side === 'foe'), witches: Object.keys(F).filter((k) => F[k].side === 'hero') }; }")
                foe, uiTop = keys['foes'][0], m['uiTop']
                stills = [('front', 'front', 'io', foe), ('profile', 'profile', 'jester', foe), ('shoulder', 'shoulder', 'fox', foe), ('foe-front', 'front', foe, 'io'), ('victim', 'victim', foe, 'ranger'), ('hit-witch', 'target', 'jester', foe), ('all-witches', 'all', 'io', None)]
                if len(keys['foes']) > 1: stills.append(('all-foes', 'all', foe, None))
                for (label, kind, a, c) in stills:
                    if (kind in ('shoulder', 'victim')) and h > w: continue          # an upright phone keeps its own over-the-shoulder shot
                    r = pg.evaluate("([k, a, c]) => window.__battle.shot(k, a, c)", [kind, a, c]); pg.wait_for_timeout(900)
                    png = os.path.join(out, '%s-%s-%s.png' % (fid, label, tag)); pg.screenshot(path=png)
                    mm = pg.evaluate("() => ({ boxes: window.__battle.boxes(), ground: window.__battle.ground() })"); bx = { f['key']: f for f in mm['boxes']['fighters'] }
                    name = '%s %s %s' % (fid, tag, label); sub = bx.get(a)
                    print('  %s: %s; %s' % (label, r, { k: v['hpx'] for k, v in bx.items() }), flush=True)
                    rows.append({ 'fight': fid, 'size': tag, 'shot': label, 'set': r, 'boxes': mm['boxes']['fighters'], 'ground': mm['ground'] })
                    if not more['where']: ground(name, w, h, mm['boxes'], mm['ground'], png, True)
                    if not sub: check(False, '%s: %s is in the shot' % (name, a)); continue
                    x0, y0, x1, y1 = sub['box']; share = sub['hpx'] / h; big = loom and sub['side'] == 'foe' and (sub['tall'] > loom['tall'] or sub.get('halfW', 0) > loom['halfW'])
                    if label in ('front', 'profile', 'hit-witch'):
                        check(1 / 3 <= share <= 0.62, '%s: %s stands %d px tall, %.0f%% of the picture (a third to six tenths)' % (name, a, sub['hpx'], share * 100))
                        check(x0 >= 0 and x1 <= w and y0 >= 0 and y1 <= uiTop, '%s: %s is whole, above the panels (box %s)' % (name, a, sub['box']))
                    elif label == 'foe-front':
                        if big: check(sub.get('head', y0) >= 0 and share >= 0.5, '%s: the giant fills the picture from below, its head inside (%d px, %.0f%% of the picture; its stated height reaches %d px from the top; an arm above that may be cut)' % (name, sub['hpx'], share * 100, sub.get('head', y0)))
                        else: check(x0 >= 0 and x1 <= w and y0 >= 0 and y1 <= uiTop and sub['hpx'] >= 0.12 * h, '%s: the foe is whole, above the panels, and at least an eighth of the picture tall (%d px; box %s)' % (name, sub['hpx'], sub['box']))
                    elif label in ('shoulder', 'victim'):
                        fo = bx.get(foe); wi = bx.get(a if label == 'shoulder' else c)
                        bigFoe = bool(fo and loom and (fo['tall'] > loom['tall'] or fo.get('halfW', 0) > loom['halfW']))
                        if fo and bigFoe: check(0 <= fo['foot'][0] <= w, '%s: the giant beyond her is in the picture (it stands at %s; it may be cut by the edge)' % (name, fo['foot']))
                        elif fo: check((fo['box'][0] >= 0 and fo['box'][2] <= w and fo['box'][1] >= 0), '%s: the foe beyond her is in the picture (box %s)' % (name, fo['box']))
                        if wi: check(wi['box'][1] < uiTop - 60 and wi['box'][2] > 0 and wi['box'][0] < w, '%s: the witch in front shows above the panels (her top at %d, panels from %d)' % (name, wi['box'][1], uiTop))
                    elif label in ('all-witches', 'all-foes'):
                        side = 'hero' if label == 'all-witches' else 'foe'
                        for f in mm['boxes']['fighters']:
                            if f['side'] != side or (loom and side == 'foe' and f['tall'] > loom['tall']): continue
                            check(f['box'][0] >= 0 and f['box'][2] <= w and f['box'][1] >= 0 and f['box'][3] <= uiTop, '%s: %s is whole, above the panels (box %s)' % (name, f['key'], f['box']))
                # numbers that come at the same moment: four over the witches, two words, and a word over the foe's head
                pg.evaluate("() => window.__battle.shot('rest')"); pg.wait_for_timeout(900)
                pg.evaluate("([ws, foe]) => { const B = window.__battle; ['3,435', '2,861', '3,249', '3,241'].forEach((t, i) => B.number(ws[i % ws.length], t, '')); B.number(ws[0], 'Blows +20%', 'word heat'); B.number(ws[1], 'Miss', 'word'); B.number(foe, 'Fate', 'word heat', 'head'); B.number(foe, '17,103', 'big'); }", [keys['witches'], foe])
                pg.wait_for_timeout(700); ns = pg.evaluate("() => window.__battle.numbers"); pg.screenshot(path=os.path.join(out, '%s-numbers-%s.png' % (fid, tag)))
                clash = [(a['text'], b['text']) for i, a in enumerate(ns) for b in ns[i + 1:] if not apart(a['box'], b['box'])]
                check(len(ns) == 8 and not clash, '%s %s: %d numbers and words up at once, none on another (%s)' % (fid, tag, len(ns), clash or 'all apart'))
                outside = [n['text'] for n in ns if n['box'][0] < 0 or n['box'][1] < 0 or n['box'][2] > w or n['box'][3] > m['uiTop']]
                check(not outside, '%s %s: every number and word whole inside the picture, above the panels (%s)' % (fid, tag, outside or 'all inside'))
                rows.append({ 'fight': fid, 'size': tag, 'shot': 'numbers', 'numbers': ns })
        ctx.close()
    b.close()
with open(os.path.join(out, 'frame-numbers.json'), 'w') as fh: json.dump(rows, fh, indent=1)
print('page errors: %d' % len(errors))
for e in errors[:10]: print('  ! ' + e)
print('%d ok, %d failed' % (len(ok), len(bad)))
for x in bad: print('  FAILED: ' + x)
sys.exit(1 if (bad or errors) else 0)
