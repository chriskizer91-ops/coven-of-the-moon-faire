#!/usr/bin/env python3
"""encounter-test.py: the fights on the land, checked with no screen (the fights job, steps 3 and 4).

    python3 tools/encounter-test.py builds/zone-1.html [--quick]        (or builds/zone-2.html, builds/zone-3.html)

  1. The page starts with the fights joined on: the party, the meetings, the party's button, no errors.
  2. Numbers a person can check: walking each kind of wild ground (20 km of each, by the meetings' own count, not
     fighting), how many meetings come in a kilometre, and how many of them are the new creature's; and none in a
     place, in the camp, or just after a meeting.
  3. A meeting forced in the wilds: the land pauses, the fight plays over it (the battle plays itself, sped up), the
     land starts again, and the answer is carried back to the party (experience, HP and MP, shards, the count of fights).
     The page is told before the party's very first fight, and the fight waits for the page's answer.
  3b. The zone's new creature (slot A), met and fought: it gives what the ordinary fights there give.   (not with --quick)
  4. A herb picked on the land goes into the party's herbs.
  5. Rest at the camp: hurt, then rested, everyone whole; no rest away from the camp; the page is told.
  5b. The zone's big fight: nothing offered below its level (the page is told, and can say its own words for it); at
     its level the button offers it. In zones 2 and 3: the story waits for it, and moves on when it is won.
  5c. Zone 2: a fight by a dark road stone; the stone is lit when it is won.                     (not with --quick)
  6. A lost fight (the party sent in at 1 HP each): the coven wakes at the camp, healed.          (not with --quick)
  7. Closing the page and opening it again: the party is as it was.
  8. How many fights take the party through the zone's levels (the battle's own simulator, the attentive player, the
     fights the land itself would bring; tools/encounter-balance.mjs does this for the whole game, at three settings).
  9. No page errors from first to last.
"""
import os, sys, json, time
from playwright.sync_api import sync_playwright

page_file = os.path.abspath(sys.argv[1]); QUICK = '--quick' in sys.argv; LONG = '--long-only' in sys.argv   # --long-only: only the parts --quick leaves out (3b, 5c, 6)
errors, fails = [], []
def check(ok, text):
    print(('  ok    ' if ok else '  FAIL  ') + text, flush=True)
    if not ok: fails.append(text)

# a fight forced where she stands, played by the battle itself, sped up, its end card left when it comes
FIGHT = """async (style) => {
  const F = window.__fights, W = window.__w3d; F.auto = style;
  const before = { state: F.party.state, paused: W.paused };
  window.__battle = null;            // (the last fight's hooks stay behind it: wait for this fight's own)
  const m = F.meet(window.__forceSlot ? { slot: window.__forceSlot } : undefined);
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
    pg.add_init_script("window.__played = []; setInterval(() => { const P = window.__people; if (P && P.play && !P.__rec) { P.__rec = true; const o = P.play; P.play = (ls, p, t, c) => { for (const l of ls || []) window.__played.push(l.id); return o(ls, p, t, c); }; } }, 50);")
    pg.add_init_script("window.__heard = []; window.addEventListener('coven-fights', (e) => { const d = e.detail; window.__heard.push(d.what); if (d.what === 'first-meeting') { d.wait(); window.__firstAt = performance.now(); setTimeout(() => { window.__firstDone = performance.now(); d.done(); }, 1200); } if (d.what === 'not-ready' && window.__sayNotReady) d.told(); });")
    URL = 'file://' + page_file + '?test&fights'
    pg.goto(URL, timeout=600000); pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr)) || window.__err', timeout=600000)
    ZONE = pg.evaluate("window.__fights ? window.__fights.zone : 'zone-1'")
    print('1. the page (%s) started in %.0f s' % (ZONE, time.time() - t0))
    check(not pg.evaluate('window.__err || null'), 'the land started')
    check(pg.evaluate('!!window.__fights && !window.__fightsErr'), 'the fights are joined on' + (' (' + str(pg.evaluate('window.__fightsErr')) + ')' if pg.evaluate('window.__fightsErr || null') else ''))
    check(pg.evaluate("!!document.getElementById('cvPill')"), 'the party\'s button is on the screen, bottom right')
    # a fresh party, at the level the coven comes into this zone at (zone 1: level 1; a later zone: one above its lowest, with the last gate won)
    L0 = pg.evaluate("() => { const F = window.__fights, D = window.COVEN_ENCOUNTERS[F.zone]; F.party.afresh(); if (F.zone !== 'zone-1') F.party.setLevel(D.levels[0] + 1); localStorage.setItem('envoi.sharp', '0.5'); localStorage.setItem('mfw.flipbook', '0'); return F.party.level; }")
    st = pg.evaluate('window.__fights.party.state')
    check(st['level'] == L0 and st['xp'] == 0, 'a fresh party: level %d, herbs %s' % (L0, st['herbs']))

    WILD = pg.evaluate("""() => { // a spot in the wilds where she can stand, some way from the camp: for the fights that are fought
      const F = window.__fights, W = window.__w3d, M = W.P.M, mm = F.meetings, D = window.COVEN_ENCOUNTERS[F.zone], c = F.camp.at;
      for (let r = 150; r < 900; r += 40) for (let a = 0; a < 6.28; a += 0.4) { const x = c[0] + Math.cos(a) * r, z = c[1] + Math.sin(a) * r, B = W.P.land.bounds;
        if (x < B[0] + 30 || x > B[2] - 30 || z < B[1] + 30 || z > B[3] - 30 || mm.inside(x, z, D.margin + 20)) continue;
        const q = W.nearestFit(M.px(x), M.py(z)), qx = M.x(q[0]), qz = M.z(q[1]); if (Math.hypot(qx - x, qz - z) < 6 && !mm.inside(qx, qz, D.margin)) return [qx, qz]; }
      return [c[0] + 200, c[1]]; }""")
    FAR = pg.evaluate("""() => { // the spot in the wilds with the strongest foes (then the farthest from the camp) where she can stand: for the fight that is to be lost
      const F = window.__fights, W = window.__w3d, M = W.P.M, mm = F.meetings, D = window.COVEN_ENCOUNTERS[F.zone], c = F.camp.at, B = W.P.land.bounds; let best = null, bs = -1;
      for (let r = 300; r <= 3000; r += 100) for (let a = 0; a < 6.28; a += 0.3) { const x = c[0] + Math.cos(a) * r, z = c[1] + Math.sin(a) * r;
        if (x < B[0] + 30 || x > B[2] - 30 || z < B[1] + 30 || z > B[3] - 30 || mm.inside(x, z, D.margin + 20)) continue;
        const q = W.nearestFit(M.px(x), M.py(z)), qx = M.x(q[0]), qz = M.z(q[1]); if (Math.hypot(qx - x, qz - z) >= 6 || mm.inside(qx, qz, D.margin)) continue;
        const st = mm.stretchAt(qx, qz), w = mm.whereAt(qx, qz), lv = (st && st.levels) || (w && w.levels) || [0, 0], sc = (lv[0] + lv[1]) * 10000 + r;
        if (sc > bs) { bs = sc; best = [qx, qz]; } }
      return best; }""")
    CAMP = pg.evaluate("window.__fights.camp.wake || window.__fights.camp.at")
    # (the lines the people are given to say, by id: for the narrator's lines that wait on the fights' events)
    NARID = pg.evaluate("() => { const S = window.__story, o = {}; if (S && S.narration) for (const k in S.narration) o[k] = S.narration[k].id; return o; }"); NAR = list(NARID)
    print('2. meetings in a kilometre of each kind of ground (20 km each, counted, not fought; a party two levels into the zone)')
    per = None if LONG else pg.evaluate("""() => {
      const F = window.__fights, W = window.__w3d, M = W.P.M, land = W.P.land, D = window.COVEN_ENCOUNTERS[F.zone];
      F.meetings.hold(true);
      let seed = 7; const rand = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
      let n = 0, slots = 0, lastWorth = 1; const mm = window.CovenMeetings.create({ W, land, data: D, party: { level: Math.min(D.levels[1], D.levels[0] + 2) }, rand, onMeet: (m) => { n++; if (m.slot) slots++; lastWorth = m.worth; } }); mm.stop();
      const out = {}, B = land.bounds, segs = [];
      for (const r of land.mapData().roads) for (let i = 1; i < r.pts.length; i++) segs.push([r.pts[i - 1], r.pts[i]]);
      for (const wh of D.where) {
        const id = wh.id; let walked = 0, tries = 0, last = -1e9, minGap = 1e9, path = 0;
        n = 0; slots = 0; mm.calm();
        while (walked < 20000 && tries < 60000) {
          tries++;
          let x = B[0] + rand() * (B[2] - B[0]), z = B[1] + rand() * (B[3] - B[1]), a = rand() * Math.PI * 2;
          if (wh.test && id === 'road') { x = -443 - rand() * 1200; z = -460 - rand() * 500; }
          else if (wh.road != null && segs.length) { const sg = segs[Math.floor(rand() * segs.length)], t = rand(); x = sg[0][0] + (sg[1][0] - sg[0][0]) * t; z = sg[0][1] + (sg[1][1] - sg[0][1]) * t; a = Math.atan2(sg[1][1] - sg[0][1], sg[1][0] - sg[0][0]) + (rand() < 0.5 ? Math.PI : 0); }   // along a road
          if (mm.inside(x, z, D.margin) || mm.whereAt(x, z).id !== id) continue;
          mm.hold(false); W.setIo(M.px(x), M.py(z)); mm.check();      // (one walk on, line after line: the jump between lines is not counted, nor does it start a calm)
          for (let s = 0; s < 150; s++) {           // 300 m along a line, while it stays this kind of ground
            x += Math.cos(a) * 2; z += Math.sin(a) * 2;
            if (mm.inside(x, z, D.margin) || mm.whereAt(x, z).id !== id) break;
            W.setIo(M.px(x), M.py(z)); const k0 = n; mm.check(); walked += 2; path += 2;
            if (n > k0) { if (last > -1e9) minGap = Math.min(minGap, path - last); last = path; }
          }
        }
        if (walked > 2000) out[id] = { km: +(walked / 1000).toFixed(1), meetings: n, slots, perKm: +(n / (walked / 1000)).toFixed(2), every: wh.every, minGap: Math.round(minGap) };
        else out[id] = { km: +(walked / 1000).toFixed(1), none: true };
      }
      // in a place, and in the camp: walking there never counts
      n = 0; mm.calm(); const R = land.rects[0];
      for (let i = 0; i < 4000; i++) { W.setIo(M.px(R.x0 + 5 + (i % 40) * 2), M.py(R.z0 + 5 + Math.floor(i / 40) % 40 * 2)); mm.check(); }
      const inTown = n; n = 0; mm.calm(); const c = F.camp.at;
      for (let i = 0; i < 4000; i++) { const a = i * 0.01; W.setIo(M.px(c[0] + 25 * Math.cos(a)), M.py(c[1] + 25 * Math.sin(a))); mm.check(); }
      const inCamp = n;
      F.meetings.hold(false);
      return { out, inTown, inCamp, calm: D.calm, on: window.COVEN_SLOTS.on(F.zone).map((s) => s.slot) };
    }""")
    if not LONG:
        seen = {k: v for k, v in per['out'].items() if not v.get('none')}
        for k, v in per['out'].items():
            if v.get('none'): print('    %-8s only %.1f km of it could be found to walk: not counted' % (k, v['km'])); continue
            print('    %-8s %5.1f km walked: %3d meetings, %.1f a km (one every %d m on average; the data file says %d). Closest two: %d m apart. The new creature: %d of them' % (k, v['km'], v['meetings'], v['perKm'], round(1000 / max(v['perKm'], 0.01)), v['every'], v['minGap'], v['slots']))
        check(len(seen) >= 2 and all(abs(1000 / max(v['perKm'], 0.01) - v['every']) < v['every'] * 0.35 for v in seen.values()), 'each kind of ground brings about as many as its data file says (within a third: 20 km is not many meetings)')
        check(all(v['minGap'] >= per['calm'] for v in seen.values()), 'never two meetings within %d m of each other' % per['calm'])
        check(per['inTown'] == 0 and per['inCamp'] == 0, 'none in the first place (%d) or in the camp (%d), walking 8 km round them' % (per['inTown'], per['inCamp']))
        allm = sum(v['meetings'] for v in seen.values()); alls = sum(v['slots'] for v in seen.values())
        check(per['on'] == ['A'] and alls > 0, 'slot A is on and slot B is off; over all that ground the new creature was %d of %d meetings (each kind of ground walked the same, which is not how the coven walks: the plan\'s one in five is tools/encounter-balance.mjs\'s to check)' % (alls, allm))

    if not LONG:
        print('3. a meeting in the wilds near the camp, fought (the battle plays itself, sped up)')
        where = pg.evaluate(PUT, WILD)
        x = pg.evaluate(FIGHT, 'expert')
        d, a, l = x['during'], x['after'], x['last']
        print('    meeting:', json.dumps(x['m'])); print('    fight:', d['foes'], 'in', d['arena'], '; the party', d['heroes'])
        print('    answer:', l['result'], l['xp'], 'experience,', l['shards'], 'shards; herbs used', l['herbsSpent'])
        fm = pg.evaluate("() => ({ heard: window.__heard.slice(), waited: window.__firstDone && window.__firstAt ? window.__firstDone - window.__firstAt : null })")
        check('first-meeting' in fm['heard'] and fm['waited'] and fm['waited'] > 1000, 'the page was told before the very first fight, and the fight waited for its answer (%.1f s here; 6 s at most)' % ((fm['waited'] or 0) / 1000))
        if 'first-wisp' in NAR:
            pl = pg.evaluate("window.__played.slice()")
            check(NARID['first-wisp'] in pl, 'the narrator\'s line for the first fight was said before it (%s)' % ', '.join(i for i in pl if 'narrator' in i))
        check(not x['before']['paused'] and d['paused'] and not a['paused'], 'the land was walking, paused during the fight, and walking again after')
        check(d['layer'] and not a['layer'], 'the fight played over the land in its own layer, and the layer went')
        check(len(d['heroes']) == 4, 'all four witches fought')
        check(a['state']['xp'] != x['before']['state']['xp'] or a['state']['level'] > x['before']['state']['level'] or l['result'] != 'won', 'the experience was carried back: %d then %d (level %d)' % (x['before']['state']['xp'], a['state']['xp'], a['state']['level']))
        check(a['state']['shards'] == x['before']['state']['shards'] + l['shards'], 'the shards were carried back: %d' % a['state']['shards'])
        hp_ok = all(a['state']['hp'].get(k, None) == (v['hp'] if v['hp'] > 0 else 1) for k, v in l['party'].items())
        check(hp_ok, 'each witch\'s HP was carried back: ' + ', '.join('%s %s' % (k, a['state']['hp'].get(k)) for k in l['party']))
        check(sum(a['state']['fights'].values()) == 1, 'the fight was counted: %s' % a['state']['fights'])
        check(abs(a['at'][0] - where[0]) < 1 and abs(a['at'][1] - where[1]) < 1 if l['result'] != 'lost' else True, 'she walks on from where she stood')
        kept = pg.evaluate("JSON.parse(localStorage.getItem('coven.party'))")
        check(kept['xp'] == a['state']['xp'] and kept['level'] == a['state']['level'], 'the party was kept in the browser')
        check(pg.evaluate("window.__heard.filter((w) => w === 'fight-start').length === 1 && window.__heard.filter((w) => w === 'fight-end').length === 1"), 'the page was told the fight began and ended')

    if not QUICK:
        if LONG: pg.evaluate("() => { window.__fights.auto = 'expert'; }")
        print('3b. the zone\'s new creature (slot A), met and fought')
        pg.evaluate("() => { const F = window.__fights, Z = window.COVEN_ENCOUNTERS[F.zone], S = window.COVEN_SLOTS.zones[F.zone].A; window.__keep0 = F.party.state; let n = 0; while (F.party.level < Math.max(Z.levels[0] + 1, S.from || 1) && n++ < 400) F.party.afterBattle({ result: 'won', won: true, xp: 300, shards: 0, party: {} }); F.party.rest(); window.__forceSlot = 'A'; }")
        pg.evaluate(PUT, WILD)
        y = pg.evaluate(FIGHT, 'expert'); pg.evaluate("() => { window.__forceSlot = null; }")
        sl = pg.evaluate("() => { const F = window.__fights, S = window.COVEN_SLOTS.zones[F.zone].A; return { pack: S.pack, job: S.job, suggested: S.suggested.creature + ' (' + S.suggested.status + ')', looks: S.pack.map((id) => (window.COVEN_FOE_LOOKS[id] || {}).make || 'the battle\\'s own'), kinds: S.pack.map((id) => ((window.COVEN_FOE_LOOKS[id] || {}).opts || {}).kind || null), unpacked: window.M7 ? Object.keys(window.M7.bins).filter((k) => window.M7.bins[k].bin) : [] }; }")
        print('    slot A:', sl['job'], '; suggested for it:', sl['suggested']); print('    meeting:', json.dumps(y['m'])); print('    fight:', y['during']['foes'], '; answer:', y['last']['result'], y['last']['xp'], 'experience')
        check(y['m']['slot'] == 'A' and [f.split(' ')[0] for f in y['during']['foes']] == sl['pack'], 'the fight was the slot\'s own: %s' % ', '.join(sl['pack']))
        # hub: since the creatures came in, a slot's creature is drawn by its own model (makeM7Foe, makePeakFoe), unpacked
        own = [k for m, k in zip(sl['looks'], sl['kinds']) if m in ('makeM7Foe', 'makePeakFoe')]
        if own: check(all(k in sl['unpacked'] for k in own), 'its creature is drawn by its own model (%s), unpacked' % ', '.join(sorted(set(own))))
        else: check('makeStandIn' in sl['looks'], 'its creature is drawn by the stand-in model')
        check(y['last']['result'] in ('won', 'lost', 'fled') and not y['after']['layer'], 'it played to its end (%s)' % y['last']['result'])
        pg.evaluate("() => { localStorage.setItem('coven.party', JSON.stringify(window.__keep0)); }")
        pg.reload(timeout=600000); pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr)) || window.__err', timeout=600000)
        pg.evaluate("() => { localStorage.setItem('envoi.sharp', '0.5'); localStorage.setItem('mfw.flipbook', '0'); }")

    if not LONG:
        print('4. a herb picked on the land')
        h = pg.evaluate("""() => { const F = window.__fights, land = window.__w3d.P.land, k = window.W3D_PLACES[F.zone].zone.land.herbs.kinds[0];
          const was = F.party.herbs[k.id]; land.bag[k.id] = (land.bag[k.id] || 0) + 1; window.W3D.landEvents.herb(k, land.bag[k.id], land.bag); return [was, F.party.herbs[k.id], k.id]; }""")
        check(h[1] == h[0] + 1, '%s: %d in the party\'s herbs, then %d' % (h[2], h[0], h[1]))

    if not LONG:
        print('5. rest at the camp')
        pg.evaluate("() => { const F = window.__fights; F.party.setHp('io', 10); F.party.setHp('ranger', 20); }")
        pg.evaluate(PUT, WILD); pg.wait_for_timeout(900)
        away = pg.evaluate("() => ({ shown: !document.querySelector('#cvParty .cvBtn').hidden })")
        pg.evaluate(PUT, CAMP); pg.wait_for_timeout(900)
        camp = pg.evaluate("() => ({ shown: !document.querySelector('#cvParty .cvBtn').hidden, whole: window.__fights.party.whole() })")
        pg.evaluate("() => { window.__heard.length = 0; document.querySelector('#cvParty .cvBtn').click(); }")
        after = pg.evaluate("() => ({ whole: window.__fights.party.whole(), io: window.__fights.party.hp('io'), max: window.__fights.party.maxHp('io'), heard: window.__heard.slice(), said: document.getElementById('toast') ? document.getElementById('toast').textContent : '' })")
        check(not away['shown'], 'away from the camp there is no Rest button')
        check(camp['shown'] and not camp['whole'], 'at the camp, hurt, the Rest button shows')
        check(after['whole'], 'after resting everyone is whole (Io %d of %d HP): "%s"' % (after['io'], after['max'], after['said']))
        check('rest' in after['heard'], 'the page was told the party rested')
        if 'rest' in NAR:
            q = pg.evaluate("() => ({ pend: window.__story.pending(), played: window.__played.slice() })")
            check('rest' in q['pend'] or NARID['rest'] in q['played'], 'the narrator\'s line for a rest is waiting to be said (%s)' % ', '.join(q['pend']))
        rests = pg.evaluate("window.__fights.rests.map((r) => r.id)")
        if len(rests) > 1:
            r2 = pg.evaluate("""async () => { const F = window.__fights, W = window.__w3d, M = W.P.M, r = F.rests[1]; F.party.setHp('io', 10); const a = W.nearestFit(M.px(r.at[0]), M.py(r.at[1])); W.setIo(a[0], a[1], 0);
              const d = Math.hypot(M.x(W.io.px) - r.at[0], M.z(W.io.py) - r.at[1]); const ok = F.rest(); return { id: r.id, d, ok, whole: F.party.whole() }; }""")
            check(r2['ok'] and r2['whole'], 'the zone\'s other resting place (%s) rests the party too (she stood %.0f m from its spot)' % (r2['id'], r2['d']))
        pg.screenshot(path='/tmp/encounter-camp.png')

    if not LONG:
        print('5b. the zone\'s big fight')
        g = pg.evaluate("() => { const g = window.__fights.gate; return g && { id: g.id, at: g.at, level: g.level, r: g.r, offer: g.words.offer, notYet: g.words.notYet, name: g.name }; }")
        check(bool(g), 'the story can see it: window.__fights.gate is "%s", at (%.0f, %.0f)' % ((g or {}).get('id'), (g or {'at': [0, 0]})['at'][0], (g or {'at': [0, 0]})['at'][1]))
        pg.evaluate("() => { const g = window.__fights.gate, S = window.__story; if (g.stage && S) S.set({ stage: g.stage }); }")   # (zone 4's fire waits for the story's stage 3)
        stood = pg.evaluate(PUT, g['at']); pg.evaluate("() => { window.__heard.length = 0; }"); pg.wait_for_timeout(1300)
        check(abs(stood[0] - g['at'][0]) < g['r'] and abs(stood[1] - g['at'][1]) < g['r'], 'the coven can stand at its spot (%.0f m from it)' % (((stood[0] - g['at'][0]) ** 2 + (stood[1] - g['at'][1]) ** 2) ** 0.5))
        low = pg.evaluate("() => ({ btns: [...document.querySelectorAll('#cvParty .cvBtn')].filter((b) => !b.hidden).map((b) => b.textContent), heard: window.__heard.slice(), said: document.getElementById('toast') ? document.getElementById('toast').textContent : '', level: window.__fights.party.level })")
        check(g['offer'] not in low['btns'] and low['level'] < g['level'], 'below level %d (the party is %d) no fight is offered there' % (g['level'], low['level']))
        if 'not-ready' in NAR:
            pend = pg.evaluate("() => window.__story.pending()")
            check('not-ready' in low['heard'] and 'not-ready' in pend, 'the page was told the coven came too soon, and the narrator\'s line for it waits to be said, in place of the fights\' own words (%s)' % ', '.join(pend))
        else:
            check('not-ready' in low['heard'] and str(g['level']) in low['said'], 'the page was told the coven came too soon, and the fights\' own words showed: "%s"' % low['said'])
        pg.evaluate("() => { const P = window.__fights.party; window.__keep = P.state; let n = 0; const G = window.__fights.gate; while (P.level < G.level && n++ < 400) P.afterBattle({ result: 'won', won: true, xp: 400, shards: 0, party: {} }); }")
        pg.evaluate(PUT, [g['at'][0] + 60, g['at'][1] + 60]); pg.wait_for_timeout(900); pg.evaluate(PUT, g['at']); pg.wait_for_timeout(1300)
        high = pg.evaluate("() => [...document.querySelectorAll('#cvParty .cvBtn')].filter((b) => !b.hidden).map((b) => b.textContent)")
        check(g['offer'] in high, 'at level %d the button offers it: "%s"' % (g['level'], g['offer']))
        if ZONE != 'zone-1':
            st = pg.evaluate("""() => { const S = window.__story, P = window.__people, F = window.__fights, w = window.__w3d; if (!S) return null;
              const read = () => { const ids = []; let n = 0; while (P.say() && n++ < 20) { ids.push(P.say().id); P.talk(); } return ids; };
              S.reset(); S.set({ stage: F.zone === 'zone-2' || F.zone === 'zone-4' ? 3 : 2 }); S.begin(); if (S.state().moments && !S.state().moments.landing) { const m = S.state().moments; m.landing = true; S.set({ moments: Object.assign({ landing: true }, m) }); }
              const said = []; for (let i = 0; i < 8; i++) { S.watch(); const ids = read(); if (ids.length) said.push(ids[0]); }
              const before = S.state().stage, wonBefore = S.ctx.won();
              F.party.afterBattle({ result: 'won', won: true, xp: 0, shards: 0, party: {} }, { gate: F.gate.id });
              for (let i = 0; i < 8; i++) { S.watch(); const ids = read(); if (ids.length) said.push(ids[0]); }
              return { said, before, wonBefore, after: S.state().stage, won: S.ctx.won(), flag: !!S.state().flags.gate }; }""")
            if st:
                print('    the story at the spot:', ', '.join(st['said']))
                want = {'zone-2': 'before-node', 'zone-3': 'before-knight', 'zone-4': 'before-fire'}.get(ZONE)
                check(not st['wonBefore'] and not st['flag'], 'standing there, the story does not count the fight as met (its stand-in has stepped aside)')
                check(st['won'] and st['after'] == st['before'] + 1, 'once the fight is won the story moves on (stage %d to %d)' % (st['before'], st['after']))
        pg.evaluate("() => { localStorage.setItem('coven.party', JSON.stringify(window.__keep)); }")
        pg.reload(timeout=600000); pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr)) || window.__err', timeout=600000)
        pg.evaluate("() => { localStorage.setItem('envoi.sharp', '0.5'); localStorage.setItem('mfw.flipbook', '0'); }")

    if ZONE == 'zone-2' and not QUICK:
        print('5c. a fight by a dark road stone')
        z = pg.evaluate("""async () => { const F = window.__fights, S = window.__story, T = window.__things, w = window.__w3d, M = w.P.M; F.auto = 'expert';
          S.reset(); S.set({ stage: 1 }); const t = T.get('node-road'); w.setIo(M.px(t.x), M.py(t.z), 0); w.step(0.1, 30, false); T.tick();
          const label = document.querySelectorAll('.talkbtn')[1].textContent, nodes0 = S.state().nodes; window.__battle = null;
          T.use('node-road'); const begun = F.busy;
          await new Promise((r) => { const k = setInterval(() => { if (window.__battle && window.__battle.engine && document.querySelector('.coven-battle')) { clearInterval(k); r(); } }, 200); });
          const foes = window.__battle.engine.foes.map((f) => f.id + ' level ' + f.level), during = S.state().nodes; window.__battle.turbo = 40;
          const t2 = setInterval(() => { const B = window.__battle; if (B && B.state === 'over' && !document.getElementById('end').hidden) { clearInterval(t2); B.again(); } }, 500);
          await new Promise((r) => { const k = setInterval(() => { if (!F.busy) { clearInterval(k); r(); } }, 300); });
          await new Promise((r) => setTimeout(r, 300));
          return { label, begun, foes, nodes0, during, nodes: S.state().nodes, result: F.last.result, lit: t.lit[0].visible, again: F.thing('node-road', () => {}) }; }""")
        print('    the button: "%s"; the fight: %s; answer: %s' % (z['label'], z['foes'], z['result']))
        check(z['begun'] and z['during'] == z['nodes0'], 'using the stone began a fight, and the stone stayed dark while it was fought')
        check(z['result'] != 'won' or (z['nodes'] == z['nodes0'] + 1 and z['lit']), 'won: the stone is lit (%d lit, then %d)' % (z['nodes0'], z['nodes']))
        check(z['result'] != 'won' or z['again'] is False, 'and nothing waits there a second time')

    if ZONE == 'zone-4' and not QUICK:
        print('5d. zone 4: the great bramble (the story\'s flag), then the fire in its two forms, with the coven speaking between them')
        z = pg.evaluate("""async () => {
          const F = window.__fights, S = window.__story, P = window.__people; F.auto = 'expert';
          window.__keep4 = JSON.parse(JSON.stringify(F.party.state));
          const on = setInterval(() => { const B = window.__battle; if (B && B.engine && B.turbo !== 40) B.turbo = 40; if (B && B.state === 'over' && !document.getElementById('end').hidden) B.again(); if (!B || B.state === 'over') { if (P.say()) P.talk(); } }, 300);
          S.reset(); S.set({ stage: 1 }); F.party.setLevel(16);
          const br = F.bigs.find((b) => b.id === 'greatBramble'), flag0 = !!S.state().flags.bramble; window.__battle = null;
          const r1 = await F.bigFight(br);
          const flag1 = !!S.state().flags.bramble, won1 = !!F.party.gates.greatBramble;
          F.party.setLevel(20); S.set({ stage: 3, moments: Object.assign({}, S.state().moments, { stair: true, letter: true, 'before-fire': true }) });
          window.__heard.length = 0; const p0 = window.__played.length, stage0 = S.state().stage, wonBefore = S.ctx.won();
          const fire = F.bigs.find((b) => b.id === 'theFire'); window.__battle = null;
          const r2 = await F.bigFight(fire); clearInterval(on);
          S.watch();
          return { r1: r1 && r1.result, flag0, flag1, won1, r2: r2 && r2.result, heard: window.__heard.slice(), between: !!S.state().moments.between, played: window.__played.slice(p0),
                   wonBefore, won: S.ctx.won(), stage0, stage: S.state().stage, gates: Object.keys(F.party.gates) }; }""")
        print('    the bramble: %s; the fire: %s; told: %s' % (z['r1'], z['r2'], ', '.join(z['heard'])))
        print('    said between the forms:', ', '.join(z['played']))
        check(z['r1'] == 'won' and not z['flag0'] and z['flag1'] and z['won1'], 'the great bramble fought and won: the story\'s flag "bramble" was off, and is set')
        check(z['r2'] == 'won' and 'theFire.1' in z['gates'] and 'theFire' in z['gates'], 'the fire: its first form seen through, then its second, and won')
        check(z['heard'].count('fight-start') == 2 and 'between-forms' in z['heard'] and z['heard'].index('between-forms') > z['heard'].index('fight-start'), 'two fights, and the page told of the moment between them, after the first')
        check(z['between'] and any('.between' in i or i.startswith('z4.') for i in z['played']), 'the coven\'s moment "between" was played on the land between the two forms (%d lines)' % len(z['played']))
        check(not z['wonBefore'] and z['won'] and z['stage'] == z['stage0'] + 1, 'the story counts the fire as met, and moves on (stage %d to %d)' % (z['stage0'], z['stage']))
        pg.evaluate("() => { localStorage.setItem('coven.party', JSON.stringify(window.__keep4)); }")
        pg.reload(timeout=600000); pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr)) || window.__err', timeout=600000)
        pg.evaluate("() => { localStorage.setItem('envoi.sharp', '0.5'); localStorage.setItem('mfw.flipbook', '0'); }")

    if not QUICK:
        print('6. a lost fight: the party sent in at 1 HP each, as far from the camp as it can stand (the strongest foes), played carelessly')
        pg.evaluate("() => { const F = window.__fights; for (const id of F.party.witches()) F.party.setHp(id, 1); }")
        print('    she stands at', [round(v) for v in pg.evaluate(PUT, FAR or WILD)], 'the camp at', [round(v) for v in CAMP])
        y = pg.evaluate(FIGHT, 'careless')
        print('    answer:', y['last']['result'], '; she is at', [round(v) for v in y['after']['at']])
        if y['last']['result'] == 'lost':
            st = y['after']['state']
            check(abs(y['after']['at'][0] - CAMP[0]) < 30 and abs(y['after']['at'][1] - CAMP[1]) < 30, 'lost: the coven woke at the camp')
            check(not st['hp'] and not st['mp'], 'healed (every witch whole)')
        else:
            check(False, 'the fight was meant to be lost, and was %s' % y['last']['result'])

    print('7. the page closed and opened again')
    before = pg.evaluate('window.__fights.party.state')
    pg.reload(timeout=600000); pg.wait_for_function('(window.__ready && (window.__fights || window.__fightsErr)) || window.__err', timeout=600000)
    again = pg.evaluate('window.__fights.party.state')
    check(again['level'] == before['level'] and again['xp'] == before['xp'] and again['shards'] == before['shards'] and again['herbs'] == before['herbs'] and again['fights'] == before['fights'],
          'the party is as it was: level %d, %d experience, %d shards, %s fights' % (again['level'], again['xp'], again['shards'], again['fights']))

    if not LONG:
        print('8. fights through this zone\'s levels (the attentive player, the fights the land itself would bring, each begun whole)')
        n5 = pg.evaluate("""() => {
          const S = window.BattleSim, E = window.BattleEngine, RL = window.BattleRules, DRAW = window.CovenDraw, F = window.__fights, D = window.COVEN_ENCOUNTERS[F.zone], goal = window.COVEN_PLAN.gateLevel[F.zone];
          const from = F.zone === 'zone-1' ? 1 : D.levels[0] + 1, per = []; let fights = 0;
          for (let L = from; L < goal; L++) {
            let xp = 0, n = 0;
            for (let i = 0; i < 150; i++) {
              const rand = E.rng(i * 7919 + L * 31), gs = DRAW.grounds(D, L), w = DRAW.pick(gs, rand), m = DRAW.meeting(D, { where: w, stretch: DRAW.stretchFor(D, L), level: L, rand });
              const set = { party: RL.PARTY.map((id) => ({ id, level: L })), foes: m.foes.map((id) => ({ id: S.formOf(id, D.band, rand), level: m.foeLevel[0] + Math.floor(rand() * (m.foeLevel[1] - m.foeLevel[0] + 1)) })),
                flags: { party: true, refit: L > 5, envoi: L > 10, stoop: L > 15 }, herbs: S.BAGS.wild, ends: { canFlee: true }, reward: m.reward, seed: i };
              const B = E.create(set); let s, g = 0;
              while ((s = B.turn()).type !== 'end' && g++ < 20000) if (s.type === 'choose') { const [id, t] = S.POLICIES.sensible(B, s, rand); B.choose(id, t); }
              const r = B.result(); n++; if (r.outcome === 'win') xp += r.xp;
            }
            const each = xp / n, need = RL.xpNeed(L); per.push([L, Math.round(each), need, +(need / each).toFixed(1)]); fights += need / each;
          }
          return { per, fights: Math.round(fights), plan: window.COVEN_PLAN.fights[F.zone], from, goal };
        }""")
        for L, each, need, k in n5['per']: print('    level %d to %d: %d experience asked, %d a fight: %.1f fights' % (L, L + 1, need, each, k))
        check(abs(n5['fights'] - n5['plan']) <= 10, 'about %d fights from level %d to %d (the plan: about %d)' % (n5['fights'], n5['from'], n5['goal'], n5['plan']))
    b.close()

check(not errors, 'page errors: %d' % len(errors))
for e in errors[:10]: print('  ! ' + e)
print('every check passed' if not fails else '%d checks failed' % len(fails))
sys.exit(1 if fails else 0)
