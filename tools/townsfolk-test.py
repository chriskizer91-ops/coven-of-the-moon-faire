#!/usr/bin/env python3
"""townsfolk-test.py: the townsfolk job's own check (Coven of the Moon Faire, November 24, 2026).

    python3 tools/townsfolk-test.py                                  # the list only: no browser, a second
    python3 tools/townsfolk-test.py builds/townsfolk-lineup.html     # and every shape built in a browser, measured

The list (game/people/folk/townsfolk/townsfolk.json) is checked against the game's own files:
  - everyone who stands in zones 1 to 3 and is not one of the Faire's eleven or the Grey Hat is on it;
  - everyone who speaks in zone 4's places (not the coven, the ship or the ending) is on it or is told apart in "others";
  - every line it cites is a real line; every person has a shapes file, the words for both pictures, and a place in the order.
With a built page: every shape builds with no error, stands as tall as the list says, and no two are the same height and build.
It cannot see whether a shape looks right: only a person can.
"""
import json, os, re, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TF = os.path.join(ROOT, 'game', 'people', 'folk', 'townsfolk')
FAIRE = {'odile', 'bashir', 'zofia', 'linnet', 'otto', 'corwin', 'ros', 'tully', 'kofi', 'bridie', 'jory', 'captain'}
COVEN = {'io', 'kore', 'europa', 'callisto'}
n_ok = n_bad = 0


def check(ok, what):
    global n_ok, n_bad
    if ok:
        n_ok += 1
    else:
        n_bad += 1
        print('  FAILED:', what)


def main():
    d = json.load(open(os.path.join(TF, 'townsfolk.json'), encoding='utf-8'))
    people = {p['id']: p for p in d['people']}; others = {p['id'] for p in d['others']}
    # who stands in zones 1 to 3
    standing = {}
    for z in (1, 2, 3):
        src = open(os.path.join(ROOT, 'game', 'people', 'zone-%d.js' % z), encoding='utf-8').read()
        for pid, body in re.findall(r"id: '([a-z]+)', name: [^}]*?body: '([a-z-]+)'", src):
            if pid not in FAIRE:
                standing[pid] = (z, body, re.search(r"id: '%s'[^}]*?size: ([0-9.]+)" % pid, src))
    for pid, (z, body, size) in sorted(standing.items()):
        check(pid in people, '%s stands in zone %d and is not on the list' % (pid, z))
        if pid in people:
            check(people[pid]['wearsToday'].startswith(body), '%s wears %s today, the list says %s' % (pid, body, people[pid]['wearsToday']))
            check(people[pid]['zone'] == z, '%s is in zone %d' % (pid, z))
    print('zones 1 to 3: %d townsfolk stand on the land, on %d different stand-in bodies' % (len(standing), len({b for _, b, _ in standing.values()})))
    # who speaks in zone 4's own places
    t4 = open(os.path.join(ROOT, 'game', 'talk', 'zone-4.js'), encoding='utf-8').read()
    z4 = set()
    for place, ids in re.findall(r"\['([^']+)', \[([^\]]+)\]\]", t4[t4.index('places:'):t4.index('lines:')]):
        if place.startswith(('The coven', 'The ship', 'The ending')):
            continue
        z4 |= set(re.findall(r"'([a-z]+)'", ids))
    for pid in sorted(z4):
        check(pid in people or pid in others, '%s speaks in zone 4 and is not on the list' % pid)
    print('zone 4: %d speakers in its own places (%s)' % (len(z4), ', '.join(sorted(z4))))
    # the lines cited, the shapes, the words, the order
    ids = set()
    for z in '1234':
        ids |= set(re.findall(r"id: '(z\d\.[a-z]+\.\d+)'", open(os.path.join(ROOT, 'game', 'talk', 'zone-%s.js' % z), encoding='utf-8').read()))
    cited = 0
    for p in d['people'] + d['others']:
        for m in re.finditer(r'(z\d\.[a-z]+)\.(\d+)((?:, \.\d+)*)', json.dumps(p)):
            for n in [m.group(2)] + re.findall(r'\.(\d+)', m.group(3)):
                cited += 1
                check('%s.%s' % (m.group(1), n) in ids, '%s cites %s.%s, which is not a line' % (p['id'], m.group(1), n))
    for p in d['people']:
        check(os.path.exists(os.path.join(TF, p['shapes'])), p['id'] + ' has no shapes file')
        check(all(p['look'].get(k) for k in ('name', 'who', 'body', 'face')), p['id'] + ' lacks words')
        check(p['verdict'].startswith('own'), p['id'] + ' verdict')
        code = open(os.path.join(TF, p['shapes']), encoding='utf-8').read()
        h = float(re.search(r'height: ([0-9.]+)', code).group(1))
        check(abs(h * 1.65 - p['heightM']) < 0.011, '%s: the shapes say %.2f m, the list %.2f m' % (p['id'], h * 1.65, p['heightM']))
        check(not re.search(r'https?://|/home/|/Users/', code), p['id'] + ': a web address or a path in the shapes file')
    check(sorted(d['order']) == sorted(people), 'the order names everyone once')
    print('the list: %d people, %d lines cited, %d other bodies told apart (%s)' % (len(people), cited, len(others), ', '.join(sorted(others))))
    if len(sys.argv) > 1:
        from playwright.sync_api import sync_playwright
        with sync_playwright() as pw:
            b = pw.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
            pg = b.new_page(viewport={'width': 1280, 'height': 720}); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            pg.goto('file://' + os.path.abspath(sys.argv[1]) + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=180000)
            check(not pg.evaluate('window.__err || null'), 'the page started')
            facts = pg.evaluate('window.__lineup.facts()')
            for r in pg.evaluate('window.__lineup.rows'):
                got = pg.evaluate('(r) => window.__lineup.show(r, "grey")', r); check(len(got) >= 2, 'row %s shows people' % r)
            b.close()
        check(not errs, 'no page errors: %s' % errs[:2]); check(len(facts) == len(people), 'every person was built')
        seen = set()
        for f in facts:
            check(not f['errors'], '%s builds with no error: %s' % (f['id'], f['errors']))
            check(f['heightM'] - 0.03 <= f['top'] <= f['heightM'] + 0.24, '%s stands %.2f m to the top, the list says %.2f m' % (f['id'], f['top'], f['heightM']))
            check(8000 < f['triangles'] < 16000, '%s has %d triangles at full weight' % (f['id'], f['triangles']))
            key = (round(f['heightM'], 2), tuple(people[f['id']]['look']['name'].split()[:3])); check(key not in seen, f['id'] + ' is not a twin'); seen.add(key)
        hs = sorted(f['heightM'] for f in facts); tr = sorted(f['triangles'] for f in facts)
        print('built in the browser: %d people, %.2f m to %.2f m tall, %d to %d triangles each at full weight' % (len(facts), hs[0], hs[-1], tr[0], tr[-1]))
    print('%d checks passed, %d failed' % (n_ok, n_bad))
    sys.exit(1 if n_bad else 0)


if __name__ == '__main__':
    main()
