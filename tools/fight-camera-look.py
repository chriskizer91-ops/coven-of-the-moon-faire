#!/usr/bin/env python3
"""fight-camera-look.py: stills of the battle camera's shots (the fight-camera job).

    python3 tools/fight-camera-look.py builds/fights-lab.html <out folder> [--fights greatBramble,zone-1-A] [--sizes 1280x720,1600x750,412x880]
                                       [--kinds rest,front,...] [--beats 6] [--level 16] [--who io] [--as 12x4.8]

A browser with no screen draws two or three pictures a second and cannot show motion. So this takes stills:
 1. of each named kind of shot, set at once by the battle's test hook (window.__battle.shot): the resting shot; close on a
    witch from the front and from the side; over her shoulder at the foe; close on the foe; over a witch's shoulder at
    the foe as it acts; close on whoever is hit; two at grips; and everyone on one side at once;
 2. (--beats N) of N moves as the fight plays itself: the battle's clock is stopped the moment the camera comes to each
    part of a move (the close-up when it begins, the blow landing, the backing out, the resting shot), a still is taken,
    and the clock is set going again.
--as 12x4.8 tells the camera the first foe is 12 m tall and reaches 4.8 m to each side, whatever its model: to see how
the shots would frame a foe of that size before its model is here (the stills are named "...-as12x4.8").
Beside each still it writes what was measured (shots.json): how tall each fighter stands, what ground the camera sees,
where the numbers are. The pictures are for a person to look at; tools/battle-frame-test.py judges the numbers.
"""
import os, sys, json
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
SIZES = [tuple(int(x) for x in s.split('x')) for s in opt('--sizes', '1280x720').split(',')]
FIGHTS = [x for x in opt('--fights', 'greatBramble').split(',') if x]
KINDS = [x for x in opt('--kinds', 'rest,front,profile,shoulder,foe-front,victim,target,hit-witch,clash,all-witches,all-foes').split(',') if x]
BEATS = int(opt('--beats', '0')); LEVEL = int(opt('--level', '0')); WHO = opt('--who', 'io'); AS = opt('--as', ''); WAIT = float(opt('--wait', '4'))
os.makedirs(out, exist_ok=True)
FLAGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl']
SETTLED = "() => { const D = window.__battle.DIR; return !D.free || (D.pos.distanceTo(D.to.pos) < 0.02 && D.look.distanceTo(D.to.look) < 0.02); }"
MEASURE = "() => { const B = window.__battle; return { boxes: B.boxes(), ground: B.ground(), numbers: B.numbers, beat: B.beat, cam: B.DIR.debug() }; }"
# a named still: [the hook's kind, who it is on, the other one]; 'foe' is the first foe, WHO the witch
SHOT = { 'rest': ('rest', None, None), 'front': ('front', 'W', 'F'), 'profile': ('profile', 'W', 'F'), 'shoulder': ('shoulder', 'W', 'F'),
         'foe-front': ('front', 'F', 'W'), 'victim': ('victim', 'F', 'W'), 'target': ('target', 'F', 'W'), 'hit-witch': ('target', 'W', 'F'),
         'clash': ('clash', 'W', 'F'), 'all-witches': ('all', 'W', None), 'all-foes': ('all', 'F', None), 'fit': ('fit', None, None) }
rows, errors = [], []
def save():
    jf = os.path.join(out, 'shots.json'); old = []
    if os.path.exists(jf):
        try: old = [r for r in json.load(open(jf)) if not any(r['file'] == n['file'] for n in rows)]
        except Exception: old = []
    with open(jf, 'w') as fh: json.dump(old + rows, fh, indent=1)
    print('page errors: %d' % len(errors))
    for e in errors[:10]: print('  ! ' + e)

def settle(pg, ms=500, limit=60000):
    try: pg.wait_for_function(SETTLED, timeout=limit, polling=250)
    except Exception: pass   # (after a cut the camera eases in for a few seconds: here that is half a minute; the still is taken nearly there)
    pg.wait_for_timeout(ms)

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=FLAGS)
    for (w, h) in SIZES:
        tag = '%dx%d' % (w, h)
        ctx = b.new_context(viewport={'width': w, 'height': h}, has_touch=(w < 600), is_mobile=(w < 600)); pg = ctx.new_page()
        pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
        for fid in FIGHTS:
            pg.goto('file://' + page_file, wait_until='load', timeout=180000); pg.wait_for_function('!!window.__lab', timeout=180000)
            pg.wait_for_function('!window.M7 || window.M7.isReady', timeout=180000)
            pg.evaluate("() => { try { localStorage.setItem('mfw.flipbook', '0'); } catch (e) {} }")
            pg.evaluate("([i, L]) => { window.__battle = null; window.__lab.start(i, L ? { level: L } : {}); }", [fid, LEVEL])
            # (the last fight shows a card first, "How strong is the fire?": its first choice is pressed)
            pg.wait_for_function("() => { const c = document.querySelector('.coven-last-card button[data-setting]'); if (c) c.click(); return !!window.__battle; }", timeout=120000, polling=300); pg.evaluate("() => { window.__battle.turbo = 6; }")
            pg.wait_for_function("() => { const b = document.getElementById('skipBtn'); if (b && !document.getElementById('skip').hidden) b.click(); return window.__battle && window.__battle.state === 'battle' && window.__battle.menuOpen; }", timeout=400000, polling=300)
            # (the foes are still rising when the menu first waits: the great bramble takes 4.6 s. The stills wait for them)
            t0 = pg.evaluate("() => window.__battle.t"); pg.wait_for_function("([t, w]) => window.__battle.t >= t + w", arg=[t0, WAIT], timeout=240000, polling=200)   # (--wait: longer for a foe that takes longer to come to its size)
            pg.evaluate("() => { window.__battle.turbo = 0; }")
            foe = pg.evaluate("() => { const F = window.__battle.F; return Object.keys(F).filter((k) => F[k].side === 'foe'); }")
            print('%s at %s (foes: %s)' % (fid, tag, ', '.join(foe)), flush=True)
            key = lambda x: WHO if x == 'W' else foe[0] if x == 'F' else None
            if AS:
                tw = [float(x) for x in AS.split('x')]
                pg.evaluate("([k, t, hw]) => { const f = window.__battle.F[k]; f.tall = t; f.look = Object.assign({}, f.look, { halfW: hw }); }", [foe[0], tw[0], tw[1]])
                fid_tag = fid + '-as' + AS
            else: fid_tag = fid
            for kind in KINDS:
                if kind == 'all-foes' and len(foe) < 2: continue
                hk, a, c = SHOT[kind]
                if kind == 'clash':  # the witch stood where her blade would reach the foe, for the still
                    pg.evaluate("([a, f]) => { const F = window.__battle.F, A = F[a], T = F[f], dx = A.pos.x - T.pos.x, dz = A.pos.z - T.pos.z, d = Math.hypot(dx, dz), r = 1.4 + ((T.look && T.look.reach) || 0); A.pos.x = T.pos.x + dx / d * r; A.pos.z = T.pos.z + dz / d * r; }", [key(a), key(c)])
                    pg.wait_for_timeout(700)
                r = pg.evaluate("([k, a, c]) => window.__battle.shot(k, a, c)", [hk, key(a), key(c)])
                settle(pg)
                name = '%s-%s-%s.png' % (fid_tag, kind, tag); pg.screenshot(path=os.path.join(out, name))
                m = pg.evaluate(MEASURE)
                hs = {f['key']: f['hpx'] for f in m['boxes']['fighters']}
                print('  %-12s %s  tall on the screen: %s  ground: %s' % (kind, r, hs, m['ground']), flush=True)
                rows.append({ 'fight': fid, 'size': tag, 'still': kind, 'file': name, 'shot': r, 'measure': m })
                if kind == 'clash': pg.evaluate("(a) => { const A = window.__battle.F[a]; A.pos.x = A.home.x; A.pos.z = A.home.z; }", key(a)); pg.wait_for_timeout(300)
            if BEATS:
                # the fight plays itself; the clock stops at each part of each move, and a still is taken
                pg.evaluate("() => { const B = window.__battle; B.shot('rest'); B.freezeOn(['act', 'hit', 'out', 'rest']); B.auto = 'sensible'; const btn = document.querySelector('#cmd button:not([disabled])'); if (btn) btn.click(); }")
                pg.wait_for_timeout(400)
                pg.evaluate("() => { const btn = document.querySelector('#cmd button:not([disabled])'); if (btn && window.__battle.menuOpen) btn.click(); if (!window.__battle.frozen) window.__battle.turbo = 1; }")
                seen, n0, last = 0, None, None
                while seen < BEATS * 4:
                    try: pg.wait_for_function("() => !window.__battle || window.__battle.state === 'over' || (window.__battle.frozen && window.__battle.t !== undefined)", timeout=240000, polling=100)
                    except Exception as e: print('  (no more beats: %s)' % str(e).splitlines()[0]); break
                    fz = pg.evaluate("() => window.__battle && window.__battle.frozen")
                    if not fz: break
                    info = pg.evaluate("() => Object.assign({ banner: (document.getElementById('banner') || {}).textContent }, window.__battle.beat)")
                    if n0 is None: n0 = fz['n']
                    if fz['n'] - n0 >= BEATS and fz['phase'] == 'act': break
                    tagp = (fz['n'], fz['phase'])
                    if tagp != last or fz['phase'] == 'hit':
                        settle(pg, 350, 18000)
                        name = '%s-move%02d-%s-%s-%s.png' % (fid_tag, fz['n'] - n0, {'act': '1act', 'hit': '2hit', 'out': '3out', 'rest': '4rest'}[fz['phase']], info['last'], tag)
                        if not os.path.exists(os.path.join(out, name)):
                            pg.screenshot(path=os.path.join(out, name)); m = pg.evaluate(MEASURE)
                            hs = {f['key']: f['hpx'] for f in m['boxes']['fighters']}
                            print('  move %d %-4s %-9s %-16s by %s at %s: %s ground %s numbers %d' % (fz['n'] - n0, fz['phase'], info['last'], info['banner'], info['actor'], info['targets'], hs, m['ground'], len(m['numbers'])), flush=True)
                            rows.append({ 'fight': fid, 'size': tag, 'still': 'move', 'file': name, 'beat': info, 'frozen': fz, 'measure': m }); seen += 1
                    last = tagp
                    pg.evaluate("() => { const B = window.__battle; B.freezeOn(['act', 'hit', 'out', 'rest']); B.turbo = 2; }")
            pg.evaluate("() => { if (window.__battle) window.__battle.freezeOn(null); }")
            jf = os.path.join(out, 'shots-part.json'); json.dump(rows, open(jf, 'w'), indent=1)
        ctx.close()
    b.close()
save()
sys.exit(1 if errors else 0)
