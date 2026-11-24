#!/usr/bin/env python3
"""encounter-look.py: pictures of the new fights, with no screen (the fights job, step 4).

    python3 tools/encounter-look.py builds/fights-lab.html <out folder> [--size 1280x720] [--only zone-1-A,knightOfLight] [--at 7]
    python3 tools/encounter-look.py builds/zone-2.html <out folder> --land [--size 412x880]

On the fights job's small page it takes a picture of the list, then starts each fight asked for (the battle plays
itself) and takes a picture a few seconds in (--at: seconds of the battle's own clock).
With --land, on a zone's page, it takes pictures of what the fights put on the land's screen: the party's button, the
Rest button at the camp, the big fight's button at its spot (the party set to its level), and the party's panel.
The browser here has no graphics card: its frame rate means nothing, and the pictures are stills.
"""
import os, sys
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
W, H = (int(x) for x in opt('--size', '1280x720').split('x'))
ONLY = [x for x in opt('--only', '').split(',') if x]; AT = float(opt('--at', '7')); LAND = '--land' in args
os.makedirs(out, exist_ok=True)
errors = []
tag = '%dx%d' % (W, H)
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': W, 'height': H})
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    if LAND:
        pg.goto('file://' + page_file + '?test&fights', timeout=600000)
        pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr)) || window.__err', timeout=600000)
        zone = pg.evaluate('window.__fights.zone')
        PUT = "([x, z]) => { const W = window.__w3d, M = W.P.M, a = W.nearestFit(M.px(x), M.py(z)); W.setIo(a[0], a[1], 0); W.step(0.6, 30); for (let i = 0; i < 40 && window.__land.pending(); i++) W.step(0.2, 30); W.step(0.05, 30); }"
        shot = lambda name: (pg.screenshot(path=os.path.join(out, '%s-%s-%s.png' % (zone, name, tag))), print('%s-%s-%s.png' % (zone, name, tag)))
        pg.evaluate("() => { const F = window.__fights, P = F.party, D = window.COVEN_ENCOUNTERS[F.zone]; P.afresh(); P.setLevel(F.zone === 'zone-1' ? 3 : D.levels[0] + 1); P.setHp('io', Math.round(P.maxHp('io') * 0.2)); P.setHp('ranger', Math.round(P.maxHp('ranger') * 0.4)); }")
        camp = pg.evaluate('window.__fights.camp.wake || window.__fights.camp.at'); pg.evaluate(PUT, camp); pg.wait_for_timeout(900); shot('1-camp-rest')
        pg.evaluate("() => document.getElementById('cvPill').click()"); pg.wait_for_timeout(300); shot('2-party-panel'); pg.evaluate("() => document.getElementById('cvPill').click()")
        try: pg.evaluate("() => window.__people && window.__people.ready ? window.__people.ready() : null")
        except Exception: pass
        # the story at the stage each big fight waits for (zone 4's fire waits for the letter); the narrator's line, when the zone has one, shown in place of the fights' own words
        SAY = "() => { const S = window.__story, P = window.__people; if (S && P && S.pending && S.pending().indexOf('not-ready') >= 0 && S.narration['not-ready']) P.play([S.narration['not-ready']], null); }"
        bigs = pg.evaluate("() => window.__fights.bigs.map((b) => ({ id: b.id, at: b.at, level: b.level, stage: b.stage || 0, gate: !!(window.__fights.gate && window.__fights.gate.id === b.id) }))")
        for k, g in enumerate(bigs):
            if not g['at']: print('no spot for', g['id']); continue
            pg.evaluate("(st) => { const S = window.__story; if (S && S.set) S.set({ stage: st }); const P = window.__fights.party; P.setLevel(%d); }" % max(1, g['level'] - 2), g['stage'])
            pg.evaluate(PUT, [g['at'][0] + 60, g['at'][1] + 60]); pg.wait_for_timeout(900)
            pg.evaluate(PUT, g['at']); pg.wait_for_timeout(1300); pg.evaluate(SAY); pg.wait_for_timeout(500); shot('%d-%s-too-soon' % (3 + 2 * k, g['id']))
            try: pg.evaluate("() => { const P = window.__people; if (P && P.stop) P.stop(); }")
            except Exception: pass
            pg.evaluate("(l) => { window.__fights.party.setLevel(l); }", g['level'])
            pg.evaluate(PUT, [g['at'][0] + 60, g['at'][1] + 60]); pg.wait_for_timeout(900); pg.evaluate(PUT, g['at']); pg.wait_for_timeout(1300); shot('%d-%s-offered' % (4 + 2 * k, g['id']))
        # zone 2: a dark road stone, its button
        if zone == 'zone-2':
            pg.evaluate("() => { const S = window.__story, T = window.__things, w = window.__w3d, M = w.P.M; S.set({ stage: 1 }); const t = T.get('node-road'); w.setIo(M.px(t.x), M.py(t.z), 0); w.step(0.6, 30); for (let i = 0; i < 40 && window.__land.pending(); i++) w.step(0.2, 30); T.tick(); }")
            pg.wait_for_timeout(900); shot('9-road-stone')
        pg.evaluate("() => window.__fights.party.afresh()")
    else:
        pg.goto('file://' + page_file, wait_until='load', timeout=180000)
        pg.wait_for_function('!!window.__lab', timeout=180000)
        pg.evaluate("() => { try { localStorage.setItem('mfw.flipbook', '0'); } catch (e) {} }")
        pg.wait_for_timeout(500)
        pg.screenshot(path=os.path.join(out, '00-the-list-%s.png' % tag), full_page=False); print('00-the-list-%s.png' % tag)
        for n, f in enumerate(pg.evaluate('window.__lab.list'), 1):
            if ONLY and f['id'] not in ONLY: continue
            pg.evaluate("() => { window.__battle = null; }")
            pg.evaluate("(i) => { window.__lab.start(i, { auto: 'expert' }); }", f['id'])
            pg.wait_for_function("window.__battle && window.__battle.state === 'battle'", timeout=600000, polling=250)
            pg.evaluate("() => { window.__battle.turbo = 3; }")
            t0 = pg.evaluate("() => window.__battle.t")
            pg.wait_for_function("(t) => !window.__battle || window.__battle.t >= t || window.__battle.state === 'over'", arg=t0 + AT, timeout=900000, polling=200)
            pg.evaluate("() => { window.__battle.turbo = 0; }"); pg.wait_for_timeout(400)
            name = '%02d-%s-%s.png' % (n, f['id'], tag)
            pg.screenshot(path=os.path.join(out, name))
            d = pg.evaluate("() => window.__battle.drawn")
            print('%s  %s triangles, %s draw calls  (%s)' % (name, f"{d['triangles']:,}", d['calls'], f['name']))
            # leave the fight: the page is opened again (quicker than playing a big fight to its end)
            pg.reload(wait_until='load', timeout=180000); pg.wait_for_function('!!window.__lab', timeout=180000)
    b.close()
print('page errors: %d' % len(errors))
for e in errors[:10]: print('  ! ' + e)
sys.exit(1 if errors else 0)
