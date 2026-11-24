#!/usr/bin/env python3
"""maps-test.py: the maps in the menu, and choosing where to fly, checked with no screen (the maps job).

    python3 tools/maps-test.py builds/maps.html              the small page, at 412 x 880 and at 1280 x 720
    python3 tools/maps-test.py builds/zone-1.html            a zone's page (slower: the land is built first)
    options:  --size 412x880   one size only        --json   print everything it measured

What it checks, at each size:
  1. the 3D map of Aethermoor opens, and its pin stands where the coven is: at each zone's start, and at each landing
     (worked out here from game/places/zone-N.js and game/travel/landings.js, not from the map's own numbers)
  2. it closes and leaves nothing behind: its own renderer counts 0 shapes and 0 pictures, the page has no more canvases
     or frames than before, and the game's renderer (on a zone's page) counts what it counted before
  3. choosing where to fly: the landing tapped is the answer; Back and Escape answer nothing; a landing that is not
     open shows why and cannot be chosen; the dotted line is drawn to its end
  4. the star map opens in its frame with the names from the data, "you are here" on Thareia, no way to set a course,
     and makes no request to the network; it closes and leaves nothing behind
  5. the zone's own map shows (on a zone's page); the three views switch and each takes the last one away
  6. every button is 44 px or more and inside the screen; the card and the buttons stay out of the middle
  7. 0 page errors
It cannot see a picture, a motion or a frame rate: look with tools/maps-look.py, and on a real laptop and phone."""
import sys, os, re, json, time
from playwright.sync_api import sync_playwright

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
args = sys.argv[1:]
if not args or args[0].startswith('--'):
    sys.exit(__doc__)
page_file = os.path.abspath(args[0])
sizes = [(412, 880), (1280, 720)]
if '--size' in args:
    sizes = [tuple(int(v) for v in args[args.index('--size') + 1].split('x'))]
fails, measured = [], {}


def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok:
        fails.append(what)
    return ok


def read(rel):
    return open(os.path.join(ROOT, rel), encoding='utf-8').read()


# ---- where the pin should stand, worked out from the game's own files ----
def expected():
    out = {'landings': {}, 'zones': {}}
    for m in re.finditer(r"\{ id: '(\w+)'.*?zone: (\d).*?atlas: \[(\d+), (\d+)\], after: (null|'\w+')", read('game/travel/landings.js')):
        out['landings'][m.group(1)] = {'zone': int(m.group(2)), 'at': [int(m.group(3)), int(m.group(4))], 'after': None if m.group(5) == 'null' else m.group(5).strip("'")}
    for n in (1, 2, 3):
        src = read('game/places/zone-%d.js' % n)
        pin = [int(v) for v in re.search(r'PIN0 = \[(\d+), (\d+)\]', src).groups()]
        assert re.search(r'const K = 10 / 3,', src), 'zone %d is no longer at one third size' % n
        st = re.search(r"\n\s+start: ([^\n]+?), startFace", src).group(1)
        place = re.match(r"PL\['([\w-]+)'\]\.start", st)
        if place:   # the zone starts where its camp does
            st = re.search(r"start: (\[[^\]]+\])", read('game/places/%s.js' % place.group(1))).group(1)
        assert re.fullmatch(r'[\d\s\[\]\(\)\+\-\*/\.,]+', st), 'a start that cannot be read: ' + st
        px, py = eval(st)
        x, z = (px - 768) * 0.04, (py - 512) * 0.05          # a painting's pixel is 4 cm across and 5 cm down, its middle at 768, 512
        out['zones']['zone-%d' % n] = {'zone': n, 'start': [x, z], 'at': [pin[0] + x * 0.3, pin[1] + z * 0.3]}   # 10 m / 3 to an atlas pixel
    return out


EXP = expected()
near = lambda a, b, tol=0.06: a is not None and b is not None and abs(a[0] - b[0]) <= tol and abs(a[1] - b[1]) <= tol

# what the page is asked to do (each returns plain numbers)
JS_SETUP = """() => {
  const T = window.__mapsTest = { host: null };
  T.zone = (window.W3D_PLACES && Object.keys(window.W3D_PLACES).find((k) => /^zone-\\d$/.test(k))) || null;
  T.hasMenu = !!(window.W3D && W3D.menu && typeof W3D.menu.open === 'function');
  // the Maps tab is opened through the menu if the page has one, or else in a box of the test's own
  T.open = (view) => {
    if (T.hasMenu) { W3D.menu.open('maps'); } else if (!T.host) { T.host = document.createElement('div'); T.host.style.cssText = 'position:fixed;inset:0;z-index:50'; document.body.appendChild(T.host);
      W3D.maps.tab.mount(T.host, { W: window.__w3d || null, zone: T.zone || 'zone-1', close() {} }); }
    if (view && W3D.maps.tab.view !== view) W3D.maps.tab.show(view);
  };
  T.close = () => { if (T.hasMenu) W3D.menu.close(); else if (T.host) { W3D.maps.tab.unmount(); T.host.remove(); T.host = null; } };
  T.count = () => { const g = window.__w3d && window.__w3d.renderer ? window.__w3d.renderer.info.memory : null;
    return { canvases: document.querySelectorAll('canvas').length, frames: document.querySelectorAll('iframe').length, ours: document.querySelectorAll('.cvm, .cvm-full').length, game: g ? [g.geometries, g.textures] : null }; };
  // every button that shows, with its size and whether it lies inside the screen
  T.buttons = (root) => [...(root || document).querySelectorAll('.cvm button, .cvm-full button')].filter((b) => b.offsetParent && getComputedStyle(b).visibility !== 'hidden' && b.style.display !== 'none').map((b) => { const r = b.getBoundingClientRect();
    return { what: (b.className || b.dataset.view || b.textContent).trim().slice(0, 40), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10, mark: b.classList.contains('cvm-mark'), inside: r.left >= -0.5 && r.top >= -0.5 && r.right <= innerWidth + 0.5 && r.bottom <= innerHeight + 0.5, top: r.top, bottom: r.bottom }; });
  T.rect = (sel) => { const e = document.querySelector(sel); if (!e || !e.offsetParent) return null; const r = e.getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
  return { maps: !!(window.W3D && W3D.maps), zone: T.zone, hasMenu: T.hasMenu, landings: (window.COVEN_LANDINGS || []).map((l) => l.id), count: T.count(), size: [innerWidth, innerHeight] };
}"""
JS_WORLD_READY = "() => { const h = W3D.maps.world.shown; return !!(h && h.state.ready) || !!(h && h.root.querySelector('.cvm-load p').textContent === W3D.maps.data.words.worldFailed); }"
JS_WORLD = """async (zones) => {
  const T = window.__mapsTest, h = W3D.maps.world.shown, m = h.map, out = { ready: h.state.ready, last: Object.assign({}, W3D.maps.last.world), here: h.state.here, pins: {}, where: {} };
  if (!m) return out;
  out.pinNow = m.io ? m.io.at : null; out.pinName = h.root.querySelector('.map-tag.io span').textContent; out.pinTitle = h.root.querySelector('.map-tag.io b').textContent;
  // on a zone's page: where the walker really is, worked out from the land's own numbers
  const W = window.__w3d; if (W && T.zone) { const a = window.W3D_PLACES[T.zone].zone.land.atlas.map; out.walker = [a.origin[0] + W.P.M.x(W.io.px) / a.k, a.origin[1] + W.P.M.z(W.io.py) / a.k]; }
  out.marks = h.state.marks.map((k) => ({ id: k.l.id, kind: k.k }));
  out.buttons = T.buttons(); out.find = T.rect('.cvm-find'); out.nums = h.root.querySelector('.cvm-nums').textContent;
  // a landing tapped while only looking: its card, and no way to set a course
  h.pick('warmCamp'); out.lookCard = { rect: T.rect('.cvm-card'), go: !!h.root.querySelector('.cvm-go'), text: h.root.querySelector('.cvm-card h2').textContent, buttons: T.buttons(h.root.querySelector('.cvm-card')) }; h.pick(null);
  // the pin at each zone's start and at each landing
  for (const z of zones) { h.setHere({ zone: z }); out.pins[z] = m.io.at.slice(); out.where[z] = W3D.maps.where({ zone: z }); }
  for (const l of window.COVEN_LANDINGS) { h.setHere({ landing: l.id }); out.pins[l.id] = m.io.at.slice(); }
  out.numbers = m.numbers(); out.mem = Object.assign({}, m.P.renderer.info.memory);
  return out;
}"""
JS_CHOOSE_START = "([from, open]) => { window.__got = undefined; W3D.maps.world.choose({ from, open }).then((v) => { window.__got = v === null ? 'NULL' : v; }); return true; }"
JS_CHOOSE_READY = "() => !!(W3D.maps.world.choosing && W3D.maps.world.choosing.state.ready)"
JS_CHOOSE_STATE = """() => { const T = window.__mapsTest, h = W3D.maps.world.choosing; if (!h) return null; const full = document.querySelector('.cvm-full').getBoundingClientRect();
  return { full: [full.left, full.top, full.width, full.height], marks: h.state.marks.map((k) => { const r = k.b.getBoundingClientRect(); return { id: k.l.id, kind: k.k, on: k.s.on, x: r.left + r.width / 2, y: r.top + 22, shown: k.b.style.display !== 'none' }; }),
    card: T.rect('.cvm-card'), cardText: h.root.querySelector('.cvm-card') ? h.root.querySelector('.cvm-card').textContent : '', go: T.rect('.cvm-go'), back: T.rect('.cvm-back'), buttons: T.buttons(), picked: h.state.picked, going: h.state.going,
    soft: (h.root.querySelector('.cvm-line .soft').getAttribute('d') || '').length, line: (h.root.querySelector('.cvm-line .line').getAttribute('d') || '').length, pin: h.map && h.map.io ? h.map.io.at : null, paused: window.__w3d ? window.__w3d.paused : null, got: window.__got }; }"""
JS_SKY_READY = "() => { const h = W3D.maps.sky.shown; return !!(h && (h.state.ready || h.state.error)); }"
JS_SKY_FRAME = """() => { const B = [...document.querySelectorAll('button, .lbl, #title')].filter((b) => b.offsetParent && getComputedStyle(b).display !== 'none' && !b.hidden).map((b) => { const r = b.getBoundingClientRect(); return { what: (b.id || b.className) + ' ' + b.textContent.trim().slice(0, 16), w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }; });
  const S = window.StarMap, out = { hasMap: !!S, labels: [...document.querySelectorAll('.lbl')].map((l) => l.textContent), here: S && S.getLocation(), hereMark: [...document.querySelectorAll('.lbl.here')].map((l) => l.textContent), title: document.getElementById('title').textContent, buttons: B, numbers: S && S.numbers(), size: [innerWidth, innerHeight] };
  if (S) { out.travelTo = S.travelTo('aurous'); S.select('aurous'); out.card = { shown: document.getElementById('card').classList.contains('show'), title: document.getElementById('cTitle').textContent, go: getComputedStyle(document.getElementById('cGo')).display, trip: getComputedStyle(document.getElementById('cTrip')).display };
    S.select('thareia'); out.cardHere = { title: document.getElementById('cTitle').textContent, fact: document.getElementById('cFact').textContent, trip: document.getElementById('cTripTxt').textContent, go: getComputedStyle(document.getElementById('cGo')).display };
    out.cardButtons = [...document.querySelectorAll('#card button')].filter((b) => getComputedStyle(b).display !== 'none').map((b) => { const r = b.getBoundingClientRect(); return { what: b.id, w: Math.round(r.width * 10) / 10, h: Math.round(r.height * 10) / 10 }; }); }
  return out; }"""


def run(size):
    W, H = size
    tag = '%d x %d' % size
    print('\n== %s ==' % tag)
    errors, requests = [], []
    R = measured[tag] = {}
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
        pg = b.new_page(viewport={'width': W, 'height': H}, has_touch=W < 600)
        pg.on('pageerror', lambda e: errors.append('page error: ' + str(e)))
        pg.on('console', lambda m: errors.append('console error: ' + m.text) if m.type == 'error' else None)
        pg.on('request', lambda r: requests.append(r.url[:120]) if not r.url.startswith(('data:', 'blob:', 'about:')) and not r.url.startswith('file://' + page_file) else None)
        t0 = time.time()
        pg.goto('file://' + page_file + '?test')
        pg.wait_for_function('window.__ready || window.__err', timeout=600000)
        if pg.evaluate('window.__err || null'):
            check(False, 'the page starts'); b.close(); return
        S = pg.evaluate(JS_SETUP); R['setup'] = S
        print('  (the page started in %.0f s; %s; %s)' % (time.time() - t0, 'zone page: ' + S['zone'] if S['zone'] else 'the small page', 'it has a menu' if S['hasMenu'] else 'no menu here: the tab is opened in a box of the test\'s own'))
        if not check(S['maps'], 'the maps are in the page (W3D.maps)'):
            b.close(); return
        base = S['count']
        zone_here = S['zone'] or 'zone-1'
        wait = lambda js, sec=300: pg.wait_for_function(js, timeout=sec * 1000)
        same = lambda c: c['canvases'] == base['canvases'] and c['frames'] == base['frames'] and c['ours'] == base['ours'] and c['game'] == base['game']

        # ---- 1. the 3D map of Aethermoor, and its pin ----
        print('1. the 3D map of Aethermoor')
        pg.evaluate("window.__mapsTest.open('world')"); wait(JS_WORLD_READY)
        r = R['world'] = pg.evaluate(JS_WORLD, sorted(EXP['zones']))
        if check(r['ready'], 'it opens: %s ms to build, %s triangles in %s draw calls at the %s\'s level of detail; it holds %s shapes and %s pictures' % (r['last']['openMs'], '{:,}'.format(r['last']['triangles']), r['last']['calls'], r['last']['detail'], r['last']['geometries'], r['last']['textures'])):
            want = EXP['zones'][zone_here]['at'] if not S['zone'] else r.get('walker')
            check(near(r['pinNow'], want), 'the pin stands where the coven is (%s): atlas %.1f, %.1f, wanted %.1f, %.1f' % (zone_here, r['pinNow'][0], r['pinNow'][1], want[0], want[1]))
            check(r['pinTitle'] == pg.evaluate('W3D.maps.data.words.pin') and len(r['pinName']) > 0, 'the pin says "%s", and under it "%s"' % (r['pinTitle'], r['pinName']))
            for z in sorted(EXP['zones']):
                e = EXP['zones'][z]
                check(near(r['pins'][z], e['at']) and r['where'][z]['zone'] == e['zone'], 'the pin at %s\'s start: atlas %.2f, %.2f (the zone\'s file gives %.2f, %.2f)' % (z, r['pins'][z][0], r['pins'][z][1], e['at'][0], e['at'][1]))
            check(all(near(r['pins'].get(i), l['at'], 0.001) for i, l in EXP['landings'].items()) and len(EXP['landings']) == 4, 'the pin at each of the %d landings stands on the landing\'s own spot' % len(EXP['landings']))
            check(len(r['marks']) == len(EXP['landings']) and all(m['kind'] in ('known', 'shut') for m in r['marks']), 'every landing has a mark on the map: ' + ', '.join('%s (%s)' % (m['id'], m['kind']) for m in r['marks']))
            check(r['lookCard']['rect'] is not None and not r['lookCard']['go'], 'a landing tapped while only looking shows its card ("%s") and no "Set course"' % r['lookCard']['text'])
            buttons = [x for x in r['buttons'] + r['lookCard']['buttons']]
            small = [x for x in buttons if x['w'] < 44 or x['h'] < 44]
            check(not small and len(buttons) >= 4, 'every button is 44 px or more: %d buttons, the smallest %s' % (len(buttons), 'x'.join(str(v) for v in min(([x['w'], x['h']] for x in buttons), key=lambda v: min(v)))) + ('' if not small else ' TOO SMALL: ' + json.dumps(small)))
            off = [x for x in buttons if not x['mark'] and not x['inside']]
            check(not off, 'no button lies off the screen' + ('' if not off else ': ' + json.dumps(off)))
            c = r['lookCard']['rect']; f = r['find']
            check(c['y'] > H * 0.6 and f['y'] > H * 0.6, 'the card and the round button stay out of the middle: the card starts %d px down a screen %d px tall' % (c['y'], H))
        # ---- 2. it closes and leaves nothing behind ----
        print('2. closing it')
        pg.evaluate('window.__mapsTest.close()')
        left = pg.evaluate('W3D.maps.last.world.left'); cnt = pg.evaluate('window.__mapsTest.count()')
        check(left is not None and left['geometries'] == 0 and left['textures'] == 0, 'the map\'s own renderer counts %s shapes and %s pictures after it is closed' % (left and left['geometries'], left and left['textures']))
        check(same(cnt), 'the page is as it was: %d canvases, %d frames, nothing of the maps left%s' % (cnt['canvases'], cnt['frames'], '' if not cnt['game'] else '; the game\'s renderer counts %d shapes and %d pictures, as before' % tuple(cnt['game'])) + ('' if same(cnt) else ' (before: %s, now: %s)' % (json.dumps(base), json.dumps(cnt))))
        ok = True
        for i in range(2):
            pg.evaluate("window.__mapsTest.open('world')"); wait(JS_WORLD_READY); pg.evaluate('window.__mapsTest.close()')
            l2 = pg.evaluate('W3D.maps.last.world.left'); c2 = pg.evaluate('window.__mapsTest.count()')
            ok = ok and l2['geometries'] == 0 and l2['textures'] == 0 and same(c2)
        check(ok, 'opened and closed twice more: the same every time')

        # ---- 3. choosing where to fly ----
        print('3. choosing where to fly')
        def start(frm, opn):
            pg.evaluate(JS_CHOOSE_START, [frm, opn]); wait(JS_CHOOSE_READY); pg.wait_for_timeout(400); return pg.evaluate(JS_CHOOSE_STATE)
        def tap(mark):
            # a real tap where the mark shows; if it lies off the screen, the mark is pressed by name
            if mark['shown'] and 2 < mark['x'] < W - 2 and 2 < mark['y'] < H - 2: pg.mouse.click(mark['x'], mark['y']); return 'tapped'
            pg.evaluate("(id) => document.querySelector('.cvm-mark[data-id=' + id + ']').click()", mark['id']); return 'pressed by name (it lay off the screen)'
        got = lambda: pg.evaluate('window.__got === undefined ? null : window.__got')
        st = R['choose'] = start('wickhollow', ['warmCamp'])
        kinds = {m['id']: m['kind'] for m in st['marks']}
        check(st['full'] == [0, 0, W, H], 'it fills the screen by itself (%d x %d), with no menu' % (st['full'][2], st['full'][3]))
        check(kinds == {'wickhollow': 'from', 'warmCamp': 'open', 'northCamp': 'shut', 'frozenCamp': 'shut'}, 'the ship\'s landing, the open one and the two shut ones are marked so: ' + json.dumps(kinds))
        check(near(st['pin'], EXP['landings']['wickhollow']['at'], 0.001), 'the pin stands at the ship\'s landing')
        if S['zone']:
            check(st['paused'] is True, 'the land underneath is stopped while choosing')
        mk = {m['id']: m for m in st['marks']}
        check(mk['wickhollow']['shown'] and mk['warmCamp']['shown'], 'the ship\'s landing and the open landing are both on the screen when it opens')
        how = tap(mk['northCamp']); s2 = pg.evaluate(JS_CHOOSE_STATE)
        after = pg.evaluate("W3D.maps.data.closed.order.replace('{after}', window.COVEN_LANDINGS.find((l) => l.id === 'warmCamp').name)")
        check(s2['picked'] == 'northCamp' and s2['go'] is None and after in s2['cardText'], 'a landing that is not open (%s): its card says why ("%s") and has no "Set course"' % (how, after))
        tried = pg.evaluate("W3D.maps.world.choosing.setCourse('northCamp')"); pg.keyboard.press('Enter'); pg.wait_for_timeout(500)
        check(tried is False and got() is None and pg.evaluate('!!W3D.maps.world.choosing'), 'it cannot be chosen: asked outright and with the Enter key, the map still waits')
        how = tap(mk['warmCamp']); pg.wait_for_timeout(150); s3 = pg.evaluate(JS_CHOOSE_STATE)
        check(s3['picked'] == 'warmCamp' and s3['go'] is not None and s3['soft'] > 20, 'the open landing (%s): its card has "Set course", and the way there shows faintly' % how)
        small = [x for x in s3['buttons'] if x['w'] < 44 or x['h'] < 44]; off = [x for x in s3['buttons'] if not x['mark'] and not x['inside']]
        check(not small and not off, 'every button is 44 px or more and on the screen: %d buttons, the smallest %s' % (len(s3['buttons']), 'x'.join(str(v) for v in min(([x['w'], x['h']] for x in s3['buttons']), key=lambda v: min(v)))) + ('' if not small and not off else ' ' + json.dumps(small + off)))
        check(s3['card']['y'] > H * 0.6 and s3['back']['y'] < H * 0.15, 'the card is at the foot and Back at the top: the middle is clear')
        pg.mouse.click(s3['go']['x'] + s3['go']['w'] / 2, s3['go']['y'] + s3['go']['h'] / 2)
        s4 = pg.evaluate(JS_CHOOSE_STATE)
        wait('window.__got !== undefined', 20); lc = pg.evaluate('W3D.maps.last.choose'); cnt = pg.evaluate('window.__mapsTest.count()'); left = pg.evaluate('W3D.maps.last.world.left')
        check(got() == 'warmCamp', '"Set course" tapped: the answer is the landing tapped (%s)' % got())
        check(s4 and s4['going'] == 'warmCamp' and lc['linePart'] == 1 and s4['line'] > 20, 'the dotted line is drawn from the ship to the landing, to its end')
        check(same(cnt) and left['geometries'] == 0 and left['textures'] == 0, 'the choosing screen takes itself away and leaves nothing behind')
        if S['zone']:
            check(pg.evaluate('window.__w3d.paused') is False, 'the land goes on again afterwards')
        st = start('wickhollow', ['warmCamp']); pg.mouse.click(st['back']['x'] + st['back']['w'] / 2, st['back']['y'] + st['back']['h'] / 2); wait('window.__got !== undefined', 20)
        check(got() == 'NULL', 'Back: the answer is nothing (null)')
        st = start('wickhollow', ['warmCamp']); pg.keyboard.press('Escape'); wait('window.__got !== undefined', 20)
        check(got() == 'NULL', 'the Escape key: the answer is nothing (null)')
        st = start('warmCamp', ['northCamp']); mk = {m['id']: m for m in st['marks']}; tap(mk['northCamp']); pg.wait_for_timeout(150); pg.keyboard.press('Enter'); wait('window.__got !== undefined', 20)
        check(got() == 'northCamp' and {m['id']: m['kind'] for m in st['marks']}['wickhollow'] == 'shut', 'from the Warm Roads with the northern wilds open: tapped, then the Enter key: the answer is northCamp')
        cnt = pg.evaluate('window.__mapsTest.count()')
        check(same(cnt), 'after four times choosing the page is as it was')

        # ---- 4. the star map ----
        print('4. the star map')
        n0 = len(requests)
        pg.evaluate("window.__mapsTest.open('sky')"); wait(JS_SKY_READY, 240)
        sk = pg.evaluate('({ ready: W3D.maps.sky.shown.state.ready, error: W3D.maps.sky.shown.state.error, last: W3D.maps.last.sky })')
        if check(sk['ready'], 'it opens in its frame: %s' % ('%s ms, %s triangles in %s draw calls; it holds %s shapes and %s pictures' % (sk['last']['openMs'], '{:,}'.format(sk['last']['triangles']), sk['last']['calls'], sk['last']['geometries'], sk['last']['textures']) if sk['ready'] else sk['error'])):
            fr = [f for f in pg.frames if f != pg.main_frame]
            f = R['sky'] = fr[0].evaluate(JS_SKY_FRAME)
            names = pg.evaluate('Object.fromEntries(Object.entries(W3D.maps.data.sky.info).map(([k, v]) => [k, v.name]))')
            want = [names[k] for k in ('suns', 'w1', 'w2', 'thareia', 'aurous', 'w4', 'drift', 'w5', 'far')]
            check(len(fr) == 1 and sorted(f['labels']) == sorted(want), 'its nine names are the data\'s: ' + ', '.join(f['labels']))
            check(f['here'] == 'thareia' and f['hereMark'] == [names['thareia']], '"you are here" is on %s' % ', '.join(f['hereMark']))
            check(f['cardHere']['title'] == names['thareia'] and names['aurous'] in f['cardHere']['fact'] and f['cardHere']['trip'] == pg.evaluate('W3D.maps.data.sky.words.youAreHere'), 'Thareia\'s card says "%s" and "%s"' % (f['cardHere']['trip'], f['cardHere']['fact']))
            check(f['travelTo'] is False and f['card']['shown'] and f['card']['go'] == 'none' and f['card']['trip'] == 'none', 'it is to look at: the moon\'s card ("%s") has no "Set course" and no cost, and asking to travel does nothing' % f['card']['title'])
            bs = f['buttons'] + f['cardButtons']; small = [x for x in bs if x['w'] < 44 or x['h'] < 44]
            check(not small and len(bs) >= 8, 'every button and every name that can be tapped is 44 px or more: %d of them, the smallest %s' % (len(bs), 'x'.join(str(v) for v in min(([x['w'], x['h']] for x in bs), key=lambda v: min(v)))) + ('' if not small else ' TOO SMALL: ' + json.dumps(small)))
        t1 = time.time(); pg.evaluate('window.__mapsTest.close()'); pg.wait_for_function("document.querySelectorAll('iframe').length === 0 && document.querySelectorAll('.cvm-sky').length === 0", timeout=8000)
        cnt = pg.evaluate('window.__mapsTest.count()'); left = pg.evaluate('W3D.maps.last.sky && W3D.maps.last.sky.left'); R['skyGone'] = round(time.time() - t1, 2)
        check(same(cnt) and left is not None, 'it closes and the frame is gone; before it went its renderer counted %s shapes and %s pictures still held' % (left and left['geometries'], left and left['textures']))
        check(left is not None and left['geometries'] == 0 and left['textures'] == 0, 'the star map freed everything it held')
        pg.evaluate("window.__mapsTest.open('sky')"); wait(JS_SKY_READY, 240)
        if S['hasMenu']:
            # the Escape key pressed while the frame has the keyboard still closes the menu
            [f for f in pg.frames if f != pg.main_frame][0].evaluate("window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }))")
            pg.wait_for_timeout(600); shut = pg.evaluate('!W3D.menu.isOpen()')
            check(shut, 'the Escape key pressed inside the star map\'s frame closes the menu')
            if not shut: pg.evaluate('window.__mapsTest.close()')
        else:
            pg.evaluate('window.__mapsTest.close()')
        pg.wait_for_function("document.querySelectorAll('iframe').length === 0", timeout=8000)
        check(same(pg.evaluate('window.__mapsTest.count()')), 'opened and closed once more: the same')
        check(len(requests) == n0, 'the star map made no request to the network (%d requests)' % (len(requests) - n0))

        # ---- 5. the zone's own map, and switching ----
        print('5. the zone\'s own map, and switching between the three')
        pg.evaluate("window.__mapsTest.open('zone')")
        z = pg.evaluate("""() => { const s = W3D.maps.tab.shown, cv = document.querySelector('.cvm-zonemap'), note = document.querySelector('.cvm-note'); let ink = 0;
          if (cv && cv.width) { const d = cv.getContext('2d').getImageData(0, 0, cv.width, cv.height).data; const seen = new Set(); for (let i = 0; i < d.length; i += 4 * 97) seen.add(d[i] >> 4 << 8 | d[i + 1] >> 4 << 4 | d[i + 2] >> 4); ink = seen.size; }
          const r = cv ? cv.getBoundingClientRect() : null, box = document.querySelector('.cvm-view').getBoundingClientRect();
          return { view: W3D.maps.tab.view, canvas: cv ? [cv.width, cv.height] : null, shown: r ? [r.width, r.height] : null, fits: r ? r.left >= box.left && r.right <= box.right + 0.5 && r.top >= box.top && r.bottom <= box.bottom + 0.5 : null, colours: ink, note: note ? note.textContent : null,
            bigOpen: window.__map && window.__map.big ? window.__map.big.style.display !== 'none' : null, switchButtons: window.__mapsTest.buttons() }; }""")
        R['zone'] = z
        if S['zone']:
            check(z['canvas'] and z['colours'] > 12 and z['fits'], 'the zone\'s hand-drawn map shows: %s pixels drawn, %d by %d on the screen, %d different colours in it' % ('x'.join(str(v) for v in z['canvas'] or []), z['shown'][0], z['shown'][1], z['colours']))
            check(z['bigOpen'] is False, 'the land\'s own big map is put away again underneath')
        else:
            check(z['note'] == pg.evaluate('W3D.maps.data.words.zoneNone'), 'no zone is open on this page, and it says so: "%s"' % z['note'])
        sw = [x for x in z['switchButtons'] if x['what'] in ('zone', 'world', 'sky') or x['what'] == 'on']
        check(len(z['switchButtons']) >= 3 and all(x['w'] >= 44 and x['h'] >= 44 and x['inside'] for x in z['switchButtons']), 'the three buttons that switch maps are 44 px or more: ' + ', '.join('%sx%s' % (x['w'], x['h']) for x in z['switchButtons'][:3]))
        pg.evaluate("W3D.maps.tab.show('world')"); wait(JS_WORLD_READY)
        a = pg.evaluate("({ world: document.querySelectorAll('.cvm-world').length, sky: document.querySelectorAll('.cvm-sky, iframe').length, zone: document.querySelectorAll('.cvm-zone').length })")
        pg.evaluate("W3D.maps.tab.show('sky')"); wait(JS_SKY_READY, 240)
        c = pg.evaluate("({ world: document.querySelectorAll('.cvm-world').length, sky: document.querySelectorAll('.cvm-sky').length, zone: document.querySelectorAll('.cvm-zone').length, left: W3D.maps.last.world.left })")
        pg.evaluate("W3D.maps.tab.show('zone')"); pg.wait_for_function("document.querySelectorAll('iframe').length === 0", timeout=8000)
        d = pg.evaluate("({ world: document.querySelectorAll('.cvm-world').length, sky: document.querySelectorAll('.cvm-sky, iframe').length, zone: document.querySelectorAll('.cvm-zone').length })")
        check(a == {'world': 1, 'sky': 0, 'zone': 0} and c['world'] == 0 and c['sky'] == 1 and c['zone'] == 0 and c['left'] == {'geometries': 0, 'textures': 0, 'programs': c['left']['programs']} and d == {'world': 0, 'sky': 0, 'zone': 1}, 'Zone to World to Sky and back to Zone: each view takes the last one away')
        pg.evaluate('window.__mapsTest.close()'); pg.wait_for_timeout(300)
        cnt = pg.evaluate('window.__mapsTest.count()')
        check(same(cnt), 'the tab closed: the page is as it was at the start (%d canvases, %d frames)' % (cnt['canvases'], cnt['frames']))
        if S['hasMenu']:
            pg.evaluate("W3D.menu.open('maps')"); v = pg.evaluate('W3D.maps.tab.view'); pg.evaluate('W3D.menu.close()')
            check(v == 'zone', 'opened again through the menu, the tab shows the view last looked at (%s)' % v)

        # ---- 7. errors, and the network ----
        print('7. errors')
        pg.wait_for_timeout(300)
        check(not errors, '%d page errors' % len(errors) + ('' if not errors else ': ' + ' | '.join(e[:200] for e in errors[:4])))
        check(not requests, '%d requests to the network in the whole check' % len(requests) + ('' if not requests else ': ' + ', '.join(requests[:3])))
        b.close()


for s in sizes:
    run(s)
if '--json' in args:
    print(json.dumps(measured, indent=1))
print('\n' + ('ALL PASSED' if not fails else '%d FAILED:\n  ' % len(fails) + '\n  '.join(fails)))
sys.exit(1 if fails else 0)
