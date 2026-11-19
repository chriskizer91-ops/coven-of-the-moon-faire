#!/usr/bin/env python3
"""battle-start-test.py: checks the one call the land makes, CovenBattle.start(), with no screen.

    python3 tools/battle-start-test.py builds/battle.html

It starts a fight the way the land will (an arena, the foes, the party's level, the foes' level, each witch's HP and MP
as she comes in), lets the battle's expert play it, sped up, leaves the end card, and checks the answer:
  1. it comes back with won, lost or fled, the experience, and each of the four witches' HP and MP after;
  2. the witches started with the HP and MP they were given (not full), and the foes at the level asked for;
  3. a second call works after the first (the layer is gone and the page can call again);
  4. the page made no errors.
"""
import os, sys
from playwright.sync_api import sync_playwright

page_file = os.path.abspath(sys.argv[1])
errors, fails = [], []
def check(ok, text):
    print(('  ok    ' if ok else '  FAIL  ') + text, flush=True)
    if not ok: fails.append(text)

RUN = """async (o) => {
  const p = window.CovenBattle.start(o);
  // as soon as the fight is set up: speed it up, and note what it started with
  await new Promise((r) => { const t = setInterval(() => { if (window.__battle && window.__battle.engine) { clearInterval(t); r(); } }, 200); });
  const B = window.__battle, E = B.engine;
  B.turbo = 40;
  const began = { heroes: E.heroes.map((h) => ({ id: h.id, hp: h.hp, maxHp: h.maxHp, mp: h.mp, maxMp: h.maxMp })), foes: E.foes.map((f) => ({ id: f.id, level: f.level })),
                  layer: !!document.querySelector('.coven-battle') };
  // leave the end card when it comes
  const t2 = setInterval(() => { const B2 = window.__battle; if (B2 && B2.state === 'over' && !document.getElementById('end').hidden) { clearInterval(t2); B2.again(); } }, 500);
  const r = await p;
  return { r, began, layerAfter: !!document.querySelector('.coven-battle') };
}"""

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 320, 'height': 180})
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errors.append('console: ' + m.text) if m.type == 'error' else None)
    pg.goto('file://' + page_file, wait_until='load', timeout=180000)
    pg.wait_for_function('!!window.CovenBattle', timeout=180000)
    pg.evaluate("() => { try { localStorage.setItem('mfw.flipbook', '0'); localStorage.setItem('envoi.sharp', '0.5'); } catch (e) {} }")

    print('1. two wisps in Eldergrove, the party at level 5 coming in hurt, the foes at level 6')
    o = {'arena': 'eldergrove', 'foes': ['wisp', 'wisp'], 'partyLevel': 5, 'foeLevel': 6, 'auto': 'expert', 'tag': 'first',
         'party': {'io': {'hp': 900, 'mp': 40}, 'jester': {'hp': 1500}, 'fox': {'hp': 700, 'mp': 30}, 'ranger': {'hp': 1000}}}
    x = pg.evaluate(RUN, o)
    r, began = x['r'], x['began']
    print('  answer:', r)
    H = {h['id']: h for h in began['heroes']}
    check(began['layer'], 'the fight covered the page in a layer of its own')
    check(set(H) == {'io', 'jester', 'fox', 'ranger'}, 'all four witches fought: ' + ', '.join(H))
    check(H['io']['hp'] == 900 and H['io']['mp'] == 40 and H['fox']['hp'] == 700 and H['fox']['mp'] == 30 and H['jester']['hp'] == 1500 and H['ranger']['hp'] == 1000,
          'each began with the HP and MP she was given (Io %d HP %d MP, Europa %d HP %d MP)' % (H['io']['hp'], H['io']['mp'], H['fox']['hp'], H['fox']['mp']))
    check(H['jester']['mp'] == H['jester']['maxMp'], 'Kore, given no MP, began with all of it')
    check([f['id'] for f in began['foes']] == ['wisp', 'wisp'] and all(f['level'] == 6 for f in began['foes']), 'the foes were the two wisps asked for, at level 6')
    check(r['result'] in ('won', 'lost', 'fled') and r['won'] == (r['result'] == 'won'), 'it answered "%s"' % r['result'])
    check((r['xp'] > 0) == r['won'], 'with %d experience' % r['xp'])
    check(set(r['party']) == {'io', 'jester', 'fox', 'ranger'} and all(set(v) >= {'hp', 'max', 'mp', 'mpMax'} for v in r['party'].values()),
          'and each witch\'s HP and MP after: ' + ', '.join('%s %d/%d HP %d MP' % (k, v['hp'], v['max'], v['mp']) for k, v in r['party'].items()))
    check(r['tag'] == 'first' and r['arena'] == 'eldergrove', 'the tag and the arena came back')
    check(not x['layerAfter'], 'the layer was gone afterwards')

    print('2. a second call, carrying the party on: a wraith rolled in band 1, at a level from the band')
    o2 = {'foes': ['wraith'], 'partyLevel': 3, 'foeLevel': [1, 5], 'auto': 'expert', 'party': r['party']}
    x2 = pg.evaluate(RUN, o2)
    r2 = x2['r']; H2 = {h['id']: h for h in x2['began']['heroes']}
    print('  answer:', r2)
    check(r2['result'] in ('won', 'lost', 'fled'), 'it answered "%s" with %d experience' % (r2['result'], r2['xp']))
    check(1 <= x2['began']['foes'][0]['level'] <= 5, 'the wraith was at level %d (asked: 1 to 5)' % x2['began']['foes'][0]['level'])
    check(x2['began']['layer'] and not x2['layerAfter'], 'its layer came and went')
    b.close()

check(not errors, 'page errors: %d' % len(errors))
for e in errors[:8]: print('  ! ' + e)
print('every check passed' if not fails else '%d checks failed' % len(fails))
sys.exit(1 if fails else 0)
