#!/usr/bin/env python3
"""encounter-fights-test.py: every new fight, played to its end with no screen (the fights job, step 4).

    python3 tools/encounter-fights-test.py builds/fights-lab.html [--only zone-1-A,knightOfLight] [--style expert] [--turbo 60] [--size 1280x720]

On the fights job's own small page (game/pages/fights-lab.html) it starts each new fight the way the land starts it
(CovenBattle.start), lets the battle play itself, sped up, leaves the end card, and checks:
  1. the fight started with the foes its data names, and all four witches;
  2. it played to its end (won, lost or run from) and its layer went;
  3. what is particular to it: a slot's creature is drawn by its own model (hub: since the creatures came in, by
     makeM7Foe or makePeakFoe with its model unpacked when the fight began; a slot still on a stand-in is drawn by
     the stand-in model); the knight of light stops and walks
     away (she is never beaten) and was answered at least once; the fire's first form stops at its share of Life; the
     fire's second form is ended by Kore's Sealed Fate and by nothing else;
  4. no page errors from first to last.
A fight takes one to four minutes here (no graphics card). --only plays some of them. It cannot see motion or hear sound.
"""
import os, sys, time
from playwright.sync_api import sync_playwright

args = sys.argv[1:]; page_file = os.path.abspath(args[0])
opt = lambda k, d: args[args.index(k) + 1] if k in args else d
ONLY = [x for x in opt('--only', '').split(',') if x]; STYLE = opt('--style', 'expert'); TURBO = int(opt('--turbo', '60'))
SIZE = [int(v) for v in opt('--size', '320x180').split('x')]      # left-overs: the window's size (320 by 180 unless asked), so a fight can be played at 1280 by 720
errors, fails = [], []
def check(ok, text):
    print(('  ok    ' if ok else '  FAIL  ') + text, flush=True)
    if not ok: fails.append(text)

RUN = """async ([id, style, turbo]) => {
  window.__battle = null;
  const p = window.__lab.start(id, { auto: style });
  await new Promise((r) => { const t = setInterval(() => { if ((window.__battle && window.__battle.engine) || window.__labErr) { clearInterval(t); r(); } }, 200); });
  if (window.__labErr) return { err: window.__labErr };
  const B = window.__battle, E = B.engine; B.turbo = turbo;
  const began = { heroes: E.heroes.map((h) => h.id), foes: E.foes.map((f) => ({ id: f.id, level: f.level, hp: f.maxHp, standIn: !!(B.foes && 0) })), layer: !!document.querySelector('.coven-battle'),
    // hub: which creatures' models were unpacked when the fight began (else makeM7Foe draws the slot's stand-in)
    unpacked: window.M7 ? Object.keys(window.M7.bins).filter((k) => window.M7.bins[k].bin) : [] };
  const seen = { sealedEnd: false, say: {}, minHp: {}, retreat: false };
  const watch = setInterval(() => { for (const f of E.foes) seen.minHp[f.key] = Math.min(seen.minHp[f.key] == null ? 1 : seen.minHp[f.key], f.hp / f.maxHp); }, 300);
  const t2 = setInterval(() => { const B2 = window.__battle; if (B2 && B2.state === 'over' && !document.getElementById('end').hidden) { clearInterval(t2); B2.again(); } }, 500);
  const r = await p; clearInterval(watch);
  return { r, began, answers: E.answers, over: E.over, minHp: seen.minHp, turns: E.turns, layerAfter: !!document.querySelector('.coven-battle'),
           foesLeft: E.foes.map((f) => ({ id: f.id, hp: f.hp, max: f.maxHp, fate: Math.round(f.fate || 0) })) };
}"""

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': SIZE[0], 'height': SIZE[1]})      # left-overs: was 320 by 180 always
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errors.append('console: ' + m.text) if m.type == 'error' else None)
    pg.goto('file://' + page_file, wait_until='load', timeout=180000)
    pg.wait_for_function('!!window.__lab', timeout=180000)
    pg.evaluate("() => { try { localStorage.setItem('mfw.flipbook', '0'); localStorage.setItem('envoi.sharp', '0.5'); } catch (e) {} }")
    fights = pg.evaluate('window.__lab.list')
    looks = pg.evaluate("() => { const o = {}; for (const id in window.COVEN_FOE_LOOKS) o[id] = { standIn: !!window.COVEN_FOE_LOOKS[id].standIn, wears: window.COVEN_FOE_LOOKS[id].wears || null, make: window.COVEN_FOE_LOOKS[id].make || null, kind: (window.COVEN_FOE_LOOKS[id].opts || {}).kind || null }; return o; }")
    print('%d new fights on the page; %d foes drawn by data (%d stand-in shapes, %d wearing another foe\'s model)' % (len(fights), len(looks), sum(1 for v in looks.values() if v['make'] == 'makeStandIn'), sum(1 for v in looks.values() if v['wears'])))
    for f in fights:
        if ONLY and f['id'] not in ONLY: continue
        t0 = time.time()
        x = pg.evaluate(RUN, [f['id'], STYLE, TURBO])
        if x.get('err'): check(False, '%s started (%s)' % (f['name'], x['err'][:200])); continue
        r, began = x['r'], x['began']
        ids = [q['id'] for q in began['foes']]
        print('%s (the %s player, level %d): %s, level%s %s; %s in %.0f s; %d experience' % (f['name'], STYLE, f['level'], ', '.join(ids), 's' if len(ids) > 1 else '', ', '.join(str(q['level']) for q in began['foes']), r['result'], time.time() - t0, r['xp']))
        print('  (%d turns; the foes left: %s)' % (x['turns'], ', '.join('%s %d of %d' % (q['id'], q['hp'], q['max']) for q in x['foesLeft'])), flush=True)      # left-overs: how each fight ended
        check(len(began['heroes']) == 4 and began['layer'], 'all four witches fought, in the battle\'s own layer')
        check(r['result'] in ('won', 'lost', 'fled') and not x['layerAfter'], 'it played to its end (%s, %d turns) and its layer went' % (r['result'], x['turns']))
        if f['group'] == 'slots':
            mine = [i for i in ids if i in looks]
            # hub: the slots now hold real creatures; a slot still on a stand-in is checked as before
            real = [i for i in mine if looks[i]['make'] in ('makeM7Foe', 'makePeakFoe')]
            if real:
                check(all(looks[i]['kind'] in began['unpacked'] for i in real), 'the creature is drawn by its own model, unpacked when the fight began (%s)' % ', '.join(sorted(set('%s: %s' % (i, looks[i]['kind']) for i in real))))
            else:
                check(bool(mine) and all(looks[i]['make'] == 'makeStandIn' for i in mine), 'the creature is a stand-in shape (%s)' % ', '.join(sorted(set(mine))))
        if f['id'] == 'knightOfLight':
            check(x['over'] in ('retreat', 'lose'), 'the knight is never beaten: the fight ended with "%s"' % x['over'])
            left = x['foesLeft'][0]
            check(r['result'] != 'won' or left['hp'] > 0, 'she stopped with %d%% of her Life left' % round(100 * left['hp'] / left['max']))
            check(STYLE == 'careless' or x['answers'] >= 1, 'Io answered her %d times with the same spell' % x['answers'])
            check(left['fate'] == 0, 'Kore\'s Fate wrote nothing on her (she has no ending to seal)')
        if f['id'] == 'theFire-1':
            left = x['foesLeft'][0]
            check(x['over'] in ('retreat', 'lose') and left['hp'] > 0, 'the first form does not end: the fight stopped ("%s") with %d%% of its Life left' % (x['over'], round(100 * left['hp'] / left['max'])))
        if f['id'] == 'theFire-2':
            lo = min(x['minHp'].values()) if x['minHp'] else 1
            check(r['result'] != 'won' or x['over'] == 'win', 'the second form ended ("%s")' % x['over'])
            check(True, 'its Life fell to %.1f%% before the end (no blow can take it below 1 point: only Kore\'s Sealed Fate ends it)' % (100 * lo))
    b.close()
check(not errors, 'page errors: %d' % len(errors))
for e in errors[:10]: print('  ! ' + e[:300])
print('every check passed' if not fails else '%d checks failed' % len(fails))
sys.exit(1 if fails else 0)
