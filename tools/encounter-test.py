#!/usr/bin/env python3
"""encounter-test.py: the fights on the land, checked with no screen.

    python3 tools/encounter-test.py builds/zone-1.html [--quick]

  1. The page starts with the fights joined on: the party, the meetings, the party's button, no errors.
  2. Numbers a person can check: walking each kind of wild ground (20 km of each, by the meetings' own count, not
     fighting), how many meetings come in a kilometre; and none in a place, in the camp, or just after a meeting.
  3. A meeting forced in the woods: the land pauses, the fight plays over it (the battle plays itself, sped up), the
     land starts again, and the answer is carried back to the party (experience, HP and MP, shards, the count of fights).
  4. A herb picked on the land goes into the party's herbs.
  5. Rest at the camp: hurt, then rested, everyone whole; no rest away from the camp.
  6. A lost fight (the party sent in at 1 HP each): the coven wakes at the camp, healed.     (left out with --quick)
  7. Closing the page and opening it again: the party is as it was.
  8. How many fights take the party from level 1 to level 5 in zone 1 (the battle's own simulator, the attentive
     player, at the zone's worth of a fight).
  9. No page errors from first to last.
"""
import os, sys, json, time
from playwright.sync_api import sync_playwright

page_file = os.path.abspath(sys.argv[1]); QUICK = '--quick' in sys.argv
errors, fails = [], []
def check(ok, text):
    print(('  ok    ' if ok else '  FAIL  ') + text, flush=True)
    if not ok: fails.append(text)

# a fight forced where she stands, played by the battle itself, sped up, its end card left when it comes
FIGHT = """async (style) => {
  const F = window.__fights, W = window.__w3d; F.auto = style;
  const before = { state: F.party.state, paused: W.paused };
  window.__battle = null;            // (the last fight's hooks stay behind it: wait for this fight's own)
  const m = F.meet();
  await new Promise((r) => { const t = setInterval(() => { if (window.__battle && window.__battle.engine && document.querySelector('.coven-battle')) { clearInterval(t); r(); } }, 200); });
  const during = { paused: W.paused, busy: F.busy, layer: !!document.querySelector('.coven-battle'), heroes: window.__battle.engine.heroes.map((h) => h.id + ' ' + h.hp + '/' + h.maxHp),
                   foes: window.__battle.engine.foes.map((f) => f.id + ' level ' + f.level), arena: m.arena };
  window.__battle.turbo = 40;
  const t2 = setInterval(() => { const B = window.__battle; if (B && B.state === 'over' && !document.getElementById('end').hidden) { clearInterval(t2); B.again(); } }, 500);
  await new Promise((r) => { const t = setInterval(() => { if (!F.busy) { clearInterval(t); r(); } }, 300); });
  return { m, before, during, after: { state: F.party.state, paused: W.paused, layer: !!document.querySelector('.coven-battle'), at: [W.P.M.x(W.io.px), W.P.M.z(W.io.py)] }, last: F.last };
}"""
# set her down at a spot (metres), where she can stand
PUT = "([x, z]) => { const W = window.__w3d, M = W.P.M, a = W.nearestFit(M.px(x), M.py(z)); W.setIo(a[0], a[1], 0); window.__fights.meetings.calm(); return [M.x(W.io.px), M.z(W.io.py)]; }"

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    ctx = b.new_context(viewport={'width': 320, 'height': 180})   # small: with no graphics card a fight draws a few frames a second
    pg = ctx.new_page()
    pg.on('pageerror', lambda e: errors.append('pageerror: ' + str(e)))
    pg.on('console', lambda m: errors.append('console: ' + m.text) if m.type == 'error' else None)
    t0 = time.time()
    pg.goto('file://' + page_file + '?test', timeout=600000); pg.wait_for_function('window.__ready || window.__err', timeout=600000)
    print('1. the page started in %.0f s' % (time.time() - t0))
    check(not pg.evaluate('window.__err || null'), 'the land started')
    check(pg.evaluate('!!window.__fights && !window.__fightsErr'), 'the fights are joined on' + (' (' + str(pg.evaluate('window.__fightsErr')) + ')' if pg.evaluate('window.__fightsErr || null') else ''))
    check(pg.evaluate("!!document.getElementById('cvPill')"), 'the party\'s button is on the screen, bottom right')
    pg.evaluate("() => { window.__fights.party.afresh(); localStorage.setItem('envoi.sharp', '0.5'); localStorage.setItem('mfw.flipbook', '0'); }")
    st = pg.evaluate('window.__fights.party.state')
    check(st['level'] == 1 and st['xp'] == 0, 'a fresh party: level 1, herbs %s' % st['herbs'])

    print('2. meetings in a kilometre of each kind of ground (20 km each, counted, not fought)')
    per = pg.evaluate("""() => {
      const F = window.__fights, W = window.__w3d, M = W.P.M, land = W.P.land, D = window.COVEN_ENCOUNTERS['zone-1'];
      F.meetings.hold(true);
      let seed = 7; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      let n = 0; const mm = window.CovenMeetings.create({ W, land, data: D, party: F.party, rand, onMeet: () => { n++; } }); mm.stop();
      const out = {}, calmMin = [];
      // for each kind of ground: random spots of that kind, walked in 2 m steps along a line, 20 km in all
      const want = { home: 'home', wilds: 'wilds', thorn: 'thorn', fen: 'fen', road: 'road' };
      const B = land.bounds;
      for (const id in want) {
        let walked = 0, meets = 0, tries = 0, last = -1e9, minGap = 1e9, path = 0;
        n = 0; mm.calm();
        while (walked < 20000 && tries < 20000) {
          tries++;
          let x = B[0] + rand() * (B[2] - B[0]), z = B[1] + rand() * (B[3] - B[1]);
          if (id === 'road') { x = -443 - rand() * 1200; z = -460 - rand() * 500; }
          if (mm.inside(x, z, D.margin) || mm.whereAt(x, z).id !== id) continue;
          const a = rand() * Math.PI * 2;      // (one walk on, line after line: the jump between lines is not counted, nor does it start a calm)
          W.setIo(M.px(x), M.py(z)); mm.check();
          for (let s = 0; s < 150; s++) {           // 300 m along a line, while it stays this kind of ground
            x += Math.cos(a) * 2; z += Math.sin(a) * 2;
            if (mm.inside(x, z, D.margin) || mm.whereAt(x, z).id !== id) break;
            W.setIo(M.px(x), M.py(z)); const k0 = n; mm.check(); walked += 2; path += 2;
            if (n > k0) { if (last > -1e9) minGap = Math.min(minGap, path - last); last = path; }
          }
        }
        out[id] = { km: +(walked / 1000).toFixed(1), meetings: n, perKm: +(n / (walked / 1000)).toFixed(2), every: D.where.find((w) => w.id === id).every, minGap: Math.round(minGap) };
      }
      // in a place, and in the camp: walking there never counts
      n = 0; mm.calm(); const R = land.rects[0];
      for (let i = 0; i < 4000; i++) { W.setIo(M.px(R.x0 + 5 + (i % 40) * 2), M.py(R.z0 + 5 + Math.floor(i / 40) % 40 * 2)); mm.check(); }
      const inTown = n; n = 0; mm.calm();
      for (let i = 0; i < 4000; i++) { const a = i * 0.01; W.setIo(M.px(-70 + 25 * Math.cos(a)), M.py(128 + 25 * Math.sin(a))); mm.check(); }
      const inCamp = n;
      F.meetings.hold(false);
      return { out, inTown, inCamp, calm: D.calm };
    }""")
    for k, v in per['out'].items():
        print('    %-6s %5.1f km walked: %3d meetings, %.1f a km (one every %d m on average; the data file says %d). Closest two: %d m apart' % (k, v['km'], v['meetings'], v['perKm'], round(1000 / max(v['perKm'], 0.01)), v['every'], v['minGap']))
    check(all(abs(1000 / max(v['perKm'], 0.01) - v['every']) < v['every'] * 0.35 for v in per['out'].values()), 'each kind of ground brings about as many as its data file says (within a third: 20 km is not many meetings)')
    check(all(v['minGap'] >= per['calm'] for v in per['out'].values()), 'never two meetings within %d m of each other' % per['calm'])
    check(per['inTown'] == 0 and per['inCamp'] == 0, 'none in Wickhollow (%d) or in the camp (%d), walking 8 km round them' % (per['inTown'], per['inCamp']))

    print('3. a meeting in the woods east of Wickhollow, fought (the battle plays itself, sped up)')
    where = pg.evaluate(PUT, [180, 260])
    x = pg.evaluate(FIGHT, 'expert')
    d, a, l = x['during'], x['after'], x['last']
    print('    meeting:', json.dumps(x['m'])); print('    fight:', d['foes'], 'in', d['arena'], '; the party', d['heroes'])
    print('    answer:', l['result'], l['xp'], 'experience,', l['shards'], 'shards; herbs used', l['herbsSpent'])
    check(not x['before']['paused'] and d['paused'] and not a['paused'], 'the land was walking, paused during the fight, and walking again after')
    check(d['layer'] and not a['layer'], 'the fight played over the land in its own layer, and the layer went')
    check(len(d['heroes']) == 4, 'all four witches fought')
    check(a['state']['xp'] + sum(0 for _ in [0]) != x['before']['state']['xp'] or a['state']['level'] > x['before']['state']['level'] or l['result'] != 'won', 'the experience was carried back: %d then %d (level %d)' % (x['before']['state']['xp'], a['state']['xp'], a['state']['level']))
    check(a['state']['shards'] == x['before']['state']['shards'] + l['shards'], 'the shards were carried back: %d' % a['state']['shards'])
    hp_ok = all(a['state']['hp'].get(k, None) == (v['hp'] if v['hp'] > 0 else 1) for k, v in l['party'].items())
    check(hp_ok, 'each witch\'s HP was carried back: ' + ', '.join('%s %s' % (k, a['state']['hp'].get(k)) for k in l['party']))
    check(sum(a['state']['fights'].values()) == 1, 'the fight was counted: %s' % a['state']['fights'])
    check(abs(a['at'][0] - where[0]) < 1 and abs(a['at'][1] - where[1]) < 1 if l['result'] != 'lost' else True, 'she walks on from where she stood')
    kept = pg.evaluate("JSON.parse(localStorage.getItem('coven.party'))")
    check(kept['xp'] == a['state']['xp'] and kept['level'] == a['state']['level'], 'the party was kept in the browser')

    print('4. a herb picked on the land')
    h = pg.evaluate("""() => { const F = window.__fights, land = window.__w3d.P.land, k = window.W3D_PLACES['zone-1'].zone.land.herbs.kinds[0];
      const was = F.party.herbs[k.id]; land.bag[k.id] = (land.bag[k.id] || 0) + 1; window.W3D.landEvents.herb(k, land.bag[k.id], land.bag); return [was, F.party.herbs[k.id], k.id]; }""")
    check(h[1] == h[0] + 1, '%s: %d in the party\'s herbs, then %d' % (h[2], h[0], h[1]))

    print('5. rest at the camp')
    pg.evaluate("() => { const F = window.__fights; F.party.setHp('io', 10); F.party.setHp('ranger', 20); }")
    pg.evaluate(PUT, [180, 260]); pg.wait_for_timeout(900)
    away = pg.evaluate("() => ({ shown: !document.querySelector('#cvParty .cvBtn').hidden })")
    pg.evaluate(PUT, [-70, 133]); pg.wait_for_timeout(900)
    camp = pg.evaluate("() => ({ shown: !document.querySelector('#cvParty .cvBtn').hidden, whole: window.__fights.party.whole() })")
    pg.evaluate("() => document.querySelector('#cvParty .cvBtn').click()")
    after = pg.evaluate("() => ({ whole: window.__fights.party.whole(), io: window.__fights.party.hp('io'), max: window.__fights.party.maxHp('io') })")
    check(not away['shown'], 'away from the camp there is no Rest button')
    check(camp['shown'] and not camp['whole'], 'at the camp, hurt, the Rest button shows')
    check(after['whole'], 'after resting everyone is whole (Io %d of %d HP)' % (after['io'], after['max']))
    pg.screenshot(path='/tmp/encounter-camp.png')

    print('5b. the gate (a proposal): the button by Bogmire\'s north gate')
    g = pg.evaluate("() => window.__fights.gate")
    pg.evaluate(PUT, g['at']); pg.wait_for_timeout(1200)
    low = pg.evaluate("() => [...document.querySelectorAll('#cvParty .cvBtn')].filter((b) => !b.hidden).map((b) => b.textContent)")
    check(g['offer'] not in low, 'below level %d no fight is offered there' % g['level'])
    pg.evaluate("() => { const P = window.__fights.party; window.__keep = P.state; let n = 0; while (P.level < 5 && n++ < 20) P.afterBattle({ result: 'won', won: true, xp: 400, shards: 0, party: {} }); }")
    pg.evaluate(PUT, [g['at'][0] + 40, g['at'][1]]); pg.wait_for_timeout(900); pg.evaluate(PUT, g['at']); pg.wait_for_timeout(1200)
    high = pg.evaluate("() => [...document.querySelectorAll('#cvParty .cvBtn')].filter((b) => !b.hidden).map((b) => b.textContent)")
    check(g['offer'] in high, 'at level 5 the button offers it: "%s"' % g['offer'])
    pg.evaluate("() => { localStorage.setItem('coven.party', JSON.stringify(window.__keep)); }")
    pg.reload(timeout=600000); pg.wait_for_function('window.__ready || window.__err', timeout=600000)
    pg.evaluate("() => { localStorage.setItem('envoi.sharp', '0.5'); localStorage.setItem('mfw.flipbook', '0'); }")

    if not QUICK:
        print('6. a lost fight: the party sent in at 1 HP each, in the fen, played carelessly')
        pg.evaluate("() => { const F = window.__fights; for (const id of F.party.witches()) F.party.setHp(id, 1); }")
        pg.evaluate(PUT, [1250, 1900])
        y = pg.evaluate(FIGHT, 'careless')
        print('    answer:', y['last']['result'], '; she is at', [round(v) for v in y['after']['at']])
        if y['last']['result'] == 'lost':
            st = y['after']['state']
            check(abs(y['after']['at'][0] + 70) < 30 and abs(y['after']['at'][1] - 133) < 30, 'lost: the coven woke at the Moon Faire\'s camp')
            check(not st['hp'] and not st['mp'], 'healed (every witch whole)')
        else:
            check(False, 'the fight was meant to be lost, and was %s' % y['last']['result'])

    print('7. the page closed and opened again')
    before = pg.evaluate('window.__fights.party.state')
    pg.reload(timeout=600000); pg.wait_for_function('window.__ready || window.__err', timeout=600000)
    again = pg.evaluate('window.__fights.party.state')
    check(again['level'] == before['level'] and again['xp'] == before['xp'] and again['shards'] == before['shards'] and again['herbs'] == before['herbs'] and again['fights'] == before['fights'],
          'the party is as it was: level %d, %d experience, %d shards, %s fights' % (again['level'], again['xp'], again['shards'], again['fights']))

    print('8. fights from level 1 to 5 in zone 1')
    n5 = pg.evaluate("""() => {
      const S = window.BattleSim, E = window.BattleEngine, RL = window.BattleRules, D = window.COVEN_ENCOUNTERS['zone-1'];
      const per = []; let fights = 0;
      for (let L = 1; L < 5; L++) {
        let xp = 0, n = 0;
        for (let i = 0; i < 150; i++) {
          const rand = E.rng(i * 7919 + L * 31);
          const set = S.FIGHTS.packs.setup(L, rand); set.reward = (set.reward || 1) * D.reward;
          const B = E.create(Object.assign({ seed: i }, set)); let s, g = 0;
          while ((s = B.turn()).type !== 'end' && g++ < 20000) if (s.type === 'choose') { const [id, t] = S.POLICIES.sensible(B, s, rand); B.choose(id, t); }
          const r = B.result(); if (r.outcome === 'win') { xp += r.xp; n++; }
        }
        const each = xp / n, need = RL.xpNeed(L); per.push([L, Math.round(each), need, +(need / each).toFixed(1)]); fights += need / each;
      }
      return { per, fights: Math.round(fights) };
    }""")
    for L, each, need, k in n5['per']: print('    level %d to %d: %d experience asked, %d a fight: %.1f fights' % (L, L + 1, need, each, k))
    check(35 <= n5['fights'] <= 55, 'about %d fights from level 1 to 5 (Chris: about 45 in zone 1)' % n5['fights'])
    b.close()

check(not errors, 'page errors: %d' % len(errors))
for e in errors[:10]: print('  ! ' + e)
print('every check passed' if not fails else '%d checks failed' % len(fails))
sys.exit(1 if fails else 0)
