#!/usr/bin/env python3
"""menu-test.py: the pause menu and its three save slots, checked with no screen (the menu job).
    python3 tools/menu-test.py builds/zone-1.html [--shots <folder>] [--only A|B|C]
It opens the page three ways:
  A. as the checks do (?test): the one button; opening pauses the land and closing carries on; the tabs in their order;
     W3D.menu.addTab, open, close, isOpen and the two events, as other jobs use them; slots made, loaded, copied and
     deleted by pressing the buttons; every button 44 px or more, none off the screen, at 1280 by 720, 412 by 880 and
     880 by 412; and the browser's storage exactly as it was (?test saves nothing).
  B. as a player would (no ?test, a new browser profile, so nothing of anyone's is touched): the Begin screen's line; the
     game's clock stops while the menu is open and runs again after; a voice that is playing stops and carries on; the
     game saves itself on its timer, when hidden and when closed; a file goes out and comes back the same; a new game in
     slot 2; slot 1 loaded again and every key the same as it was saved; a copy; two deletes; three wrong files refused.
  C. with the browser's storage blocked, as some phones do for a page opened from a downloaded file: the Save tab says
     so plainly and points to Save to a file.
It cannot hear anything, see motion or measure a frame rate. With --shots it saves pictures of every tab at both sizes."""
import sys, os, json, time, base64, struct, tempfile
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
page_file = os.path.abspath(args[0])
shots = args[args.index('--shots') + 1] if '--shots' in args else None
only = args[args.index('--only') + 1] if '--only' in args else 'ABC'
if shots: os.makedirs(shots, exist_ok=True)
fails, notes = [], []
def check(ok, what):
    print(('  ok    ' if ok else '  FAIL  ') + what)
    if not ok: fails.append(what)
FLAGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--autoplay-policy=no-user-gesture-required']
URL = 'file://' + page_file
def shot(pg, name):
    if shots: pg.screenshot(path=os.path.join(shots, name + '.png'))
def watch(pg, errs):
    pg.on('pageerror', lambda e: errs.append('page error: ' + str(e)))
    pg.on('console', lambda m: errs.append('console error: ' + m.text) if m.type == 'error' else None)
def ready(pg, timeout=600000):
    pg.wait_for_function('window.__ready || window.__err', timeout=timeout)
    return pg.evaluate('window.__err || window.__menuErr || null')
def store(pg):
    return pg.evaluate('() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); o[k] = localStorage.getItem(k); } return o; }')

# every button, slider and link that can be seen, on the land or in the menu: its size and whether it is on the screen
SIZES = """() => { const out = [], W = innerWidth, H = innerHeight;
  const seen = (e) => { const s = getComputedStyle(e); if (s.display === 'none' || s.visibility === 'hidden') return false; for (let q = e; q; q = q.parentElement) { if (q.hidden || getComputedStyle(q).display === 'none') return false; } const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
  const list = [...document.querySelectorAll('#cmMenu button, #cmMenu input[type=range], #cmBtn, #cmBeginGo')].filter(seen);
  for (const e of list) { const r = e.getBoundingClientRect(); let sc = null; for (let q = e.parentElement; q; q = q.parentElement) if (q.classList && q.classList.contains('cm-scroll')) { sc = q; break; }
    const scrolls = !!sc && sc.scrollHeight > sc.clientHeight + 1, below = r.bottom > H + 0.5;
    out.push({ what: (e.dataset.act || e.dataset.set || e.dataset.tab || e.dataset.ask || e.id || e.className || e.tagName) + (e.textContent ? ' "' + e.textContent.trim().slice(0, 24) + '"' : ''),
      w: Math.round(r.width), h: Math.round(r.height), off: r.left < -0.5 || r.right > W + 0.5 || r.top < -0.5 || (below && !scrolls), byScroll: below && scrolls }); }
  return out; }"""
def sizes(pg, where):
    s = pg.evaluate(SIZES)
    small = [b for b in s if b['w'] < 44 or b['h'] < 44]
    off = [b for b in s if b['off']]
    check(len(s) > 0 and not small, '%s: %d buttons, the smallest %d by %d px%s' % (where, len(s), min(b['w'] for b in s) if s else 0, min(b['h'] for b in s) if s else 0,
          (' (too small: ' + ', '.join('%s %dx%d' % (b['what'], b['w'], b['h']) for b in small[:4]) + ')') if small else ''))
    check(not off, '%s: none off the screen%s%s' % (where, (' (off: ' + ', '.join(b['what'] for b in off[:4]) + ')') if off else '',
          ('; %d reached by scrolling the tab' % sum(b['byScroll'] for b in s)) if any(b['byScroll'] for b in s) else ''))
    return s
def tabs_pictures(pg, name):
    for t in ['save', 'maps', 'coven', 'settings']:
        pg.click('.cm-tab[data-tab="%s"]' % t); pg.wait_for_timeout(150)
        sizes(pg, '%s, the %s tab' % (name, t)); shot(pg, '%s-%s' % (name, t))
def ask_yes(pg):
    pg.wait_for_selector('.cm-ask:not([hidden]) [data-ask="true"]', timeout=5000); pg.click('.cm-ask [data-ask="true"]')
def silence():
    n = 8000; data = b'\x00\x00' * n
    wav = b'RIFF' + struct.pack('<I', 36 + len(data)) + b'WAVEfmt ' + struct.pack('<IHHIIHH', 16, 1, 1, 8000, 16000, 2, 16) + b'data' + struct.pack('<I', len(data)) + data
    return 'data:audio/wav;base64,' + base64.b64encode(wav).decode()

with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=FLAGS)
    # ======================================= A. with ?test =======================================
    if 'A' in only:
        print('A. with ?test, as the checks open it')
        errs = []; ctx = b.new_context(viewport={'width': 1280, 'height': 720}, accept_downloads=True); pg = ctx.new_page(); watch(pg, errs)
        t0 = time.time(); pg.goto(URL + '?test'); err = ready(pg)
        check(not err, 'the page starts (%.0f s)%s' % (time.time() - t0, ': ' + err if err else ''))
        before = store(pg)
        pg.evaluate("() => { window.__mev = []; addEventListener('coven:menu-open', (e) => __mev.push(['open', e.detail && e.detail.tab])); addEventListener('coven:menu-close', () => __mev.push(['close'])); }")
        land = pg.evaluate("""() => { const v = (id) => { const e = document.getElementById(id); return !!e && getComputedStyle(e).display !== 'none' && e.getBoundingClientRect().width > 0; };
          const r = document.getElementById('cmBtn').getBoundingClientRect(); return { menu: v('cmBtn'), who: v('who'), nums: v('nums'), look: v('lookbtn'), x: Math.round(r.left), y: Math.round(r.top), w: r.width, h: r.height }; }""")
        check(land['menu'] and not land['who'] and not land['nums'] and not land['look'], 'one button on the land, top right (at %d, %d, %d by %d px); "who" and "nums" are in the menu now' % (land['x'], land['y'], land['w'], land['h']))
        pg.evaluate("() => { const w = window.__w3d; if (!w.P || !window.__land) return w.step(0.2, 30); for (let i = 0; i < 40 && __land.pending(); i++) w.step(0.2, 30); w.step(0.04, 30); }")
        shot(pg, 'A-land-laptop')
        pg.click('#cmBtn'); pg.wait_for_timeout(150)
        st = pg.evaluate("() => ({ open: W3D.menu.isOpen(), paused: __w3d.paused, tab: W3D.menu.tab, tabs: [...document.querySelectorAll('.cm-tab')].map((b) => b.dataset.tab + ':' + b.textContent), ev: __mev.slice() })")
        check(st['open'] and st['paused'], 'the button opens the menu, and the land is paused')
        check([t.split(':')[0] for t in st['tabs']] == ['save', 'maps', 'coven', 'settings'], 'the tabs, in order: %s' % ', '.join(t.split(':')[1] for t in st['tabs']))
        check(st['ev'] == [['open', 'save']], "the event 'coven:menu-open' is sent, at the Save tab")
        tabs_pictures(pg, 'laptop')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
        st = pg.evaluate('() => ({ open: W3D.menu.isOpen(), paused: __w3d.paused, ev: __mev.slice(-1) })')
        check(not st['open'] and not st['paused'] and st['ev'] == [['close']], "Escape closes it, the land carries on, and 'coven:menu-close' is sent")
        pg.keyboard.press('Escape'); pg.wait_for_timeout(100)
        o1 = pg.evaluate('W3D.menu.isOpen()'); pg.click('.cm-x'); pg.wait_for_timeout(100); o2 = pg.evaluate('W3D.menu.isOpen()')
        check(o1 and not o2, 'Escape opens it again, and the × closes it')
        # ---- the frame other jobs' tabs sit in ----
        api = pg.evaluate("""() => { const M = W3D.menu, log = [], out = {}; let el0 = null, ctx0 = null;
          M.addTab({ id: 'probe', label: 'Probe', order: 25, mount(el, ctx) { log.push('mount'); el0 = el; ctx0 = ctx; el.innerHTML = '<canvas width=10 height=10></canvas>'; }, unmount() { log.push('unmount'); } });
          out.order = M.tabs().join(','); out.opened = M.open('probe'); out.tab = M.tab; out.isOpen = M.isOpen();
          const r = el0.getBoundingClientRect(), row = document.querySelector('.cm-top').getBoundingClientRect();
          out.fills = Math.abs(r.top - row.bottom) < 1.5 && Math.abs(r.bottom - innerHeight) < 1.5 && Math.abs(r.width - innerWidth) < 1.5;
          out.ctx = { W: ctx0.W === window.__w3d, zone: ctx0.zone, close: typeof ctx0.close };
          document.querySelector('.cm-tab[data-tab="coven"]').click(); out.afterLeave = log.join(',');
          M.open('probe'); M.close(); out.afterClose = log.join(','); out.hiddenAfter = !!el0.closest('[hidden]');
          M.open('probe'); out.same = document.querySelector('.cm-pane[data-tab="probe"]') === el0; ctx0.close(); out.ctxClose = !M.isOpen(); out.log = log.join(',');
          M.addTab({ id: 'maps', label: 'Maps*', order: 20, mount(el) { el.textContent = 'the maps job'; } });
          out.replaced = M.tabs().filter((t) => t === 'maps').length === 1 && [...document.querySelectorAll('.cm-tab')].some((b) => b.textContent === 'Maps*');
          M.removeTab('probe'); out.events = __mev.length; return out; }""")
        check(api['order'] == 'save,maps,probe,coven,settings', 'W3D.menu.addTab: a tab of order 25 sits between Maps (20) and Coven (30): %s' % api['order'])
        check(api['opened'] and api['tab'] == 'probe' and api['isOpen'], 'W3D.menu.open(tabId) opens the menu at that tab; isOpen() says so')
        check(api['fills'], 'its panel fills the screen under the tab row')
        check(api['ctx']['W'] and api['ctx']['zone'] and api['ctx']['close'] == 'function', 'mount(el, ctx) is given ctx.W (the walker), ctx.zone ("%s") and ctx.close()' % api['ctx']['zone'])
        check(api['afterLeave'] == 'mount,unmount' and api['afterClose'] == 'mount,unmount,mount,unmount' and api['hiddenAfter'], 'unmount() each time the tab is left and each time the menu closes; the panel is hidden then')
        check(api['same'] and api['ctxClose'], 'the same panel each time; ctx.close() closes the menu')
        check(api['replaced'], "a tab added with the id 'maps' takes the place of the stand-in line")
        # ---- the slots, by their buttons (with ?test it all happens in memory) ----
        pg.click('#cmBtn'); pg.click('.cm-tab[data-tab="save"]'); pg.wait_for_timeout(100)
        s1 = pg.evaluate('JSON.stringify(W3D.saves.slot(1).keys)')
        pg.click('.cm-card[data-slot="2"] [data-act="new"]'); pg.wait_for_timeout(100); shot(pg, 'laptop-ask-new-game')
        sizes(pg, 'laptop, the question asked first'); ask_yes(pg); pg.wait_for_timeout(150)
        st = pg.evaluate("() => { W3D.saves.save('check'); return { cur: W3D.saves.current, two: !!W3D.saves.slot(2), one: JSON.stringify(W3D.saves.slot(1).keys) }; }")
        check(st['cur'] == 2 and st['two'] and st['one'] == s1, 'New game in slot 2 (asked first): slot 2 is in use, slot 1 untouched')
        pg.click('.cm-card[data-slot="1"] [data-act="continue"]'); pg.wait_for_timeout(150)
        st = pg.evaluate("() => { const k = W3D.saves.slot(1).keys, s = W3D.saves.store; return { cur: W3D.saves.current, same: Object.keys(k).every((q) => s.get(q) === k[q]) }; }")
        check(st['cur'] == 1 and st['same'], 'Continue slot 1: slot 1 in use, and every key the game keeps is as slot 1 has it')
        pg.click('.cm-card[data-slot="1"] [data-act="copy"]'); pg.wait_for_timeout(80); shot(pg, 'laptop-copy')
        pg.click('.cm-card[data-slot="1"] [data-act="copy-to-3"]'); pg.wait_for_timeout(80)
        try: ask_yes(pg)
        except Exception: pass
        pg.wait_for_timeout(100)
        st = pg.evaluate('() => JSON.stringify(W3D.saves.slot(3) && W3D.saves.slot(3).keys) === JSON.stringify(W3D.saves.slot(1).keys)')
        check(st, 'Copy slot 1 to slot 3: the same keys')
        pg.click('.cm-card[data-slot="3"] [data-act="delete"]'); ask_yes(pg); pg.wait_for_timeout(100)
        pg.click('.cm-card[data-slot="2"] [data-act="delete"]'); ask_yes(pg); pg.wait_for_timeout(100)
        check(pg.evaluate('!W3D.saves.slot(2) && !W3D.saves.slot(3) && !!W3D.saves.slot(1)'), 'Delete slots 3 and 2 (asked first): both empty, slot 1 kept')
        # the settings switch with ?test too: nothing may reach the browser
        pg.click('.cm-tab[data-tab="settings"]'); pg.click('[data-set="nums"]'); pg.wait_for_timeout(80)
        nums = pg.evaluate("document.getElementById('numbers').classList.contains('more')")
        if pg.query_selector('[data-set="flip"]'): pg.click('[data-set="flip"]'); pg.wait_for_timeout(80); pg.click('[data-set="flip"]')
        if pg.query_selector('[data-set="sharp-0.5"]'): pg.click('[data-set="sharp-0.5"]'); pg.wait_for_timeout(80)
        check(nums, 'Settings: "The numbers" shows the counts under the frame rate (what the "nums" button did)')
        pg.click('.cm-tab[data-tab="coven"]'); pg.wait_for_timeout(80)
        if pg.query_selector('[data-act="walk-kore"]'):
            pg.click('[data-act="walk-kore"]'); pg.wait_for_function("window.__w3d.who === 'kore'", timeout=60000)
            check(pg.evaluate("window.__w3d.who === 'kore' && !!document.querySelector('.cm-witch[data-witch=\"kore\"] .cm-walking')"), 'Coven: "Walk as Kore" makes Kore the one who walks (what the "who" button did)')
        pg.click('.cm-x')
        after = store(pg)
        changed = sorted(k for k in set(before) | set(after) if before.get(k) != after.get(k))
        check(not changed, '?test saves nothing: the browser\'s storage is as it was (%d keys before, %d after%s)' % (len(before), len(after), (': changed ' + ', '.join(changed)) if changed else ''))
        notes.append('with ?test the storage held %d keys, written before the menu did anything: %s' % (len(before), ', '.join(sorted(before)) or 'none'))
        # ---- a phone, upright and on its side ----
        for (w, h, name) in [(412, 880, 'phone'), (880, 412, 'side')]:
            pg.set_viewport_size({'width': w, 'height': h}); pg.wait_for_timeout(200)
            pg.evaluate("() => { const w = window.__w3d; if (!w.P || !window.__land) return w.step(0.2, 30); for (let i = 0; i < 40 && __land.pending(); i++) w.step(0.2, 30); w.step(0.04, 30); }")
            shot(pg, 'A-land-' + name); sizes(pg, name + ' %dx%d, the land' % (w, h))
            pg.click('#cmBtn'); pg.wait_for_timeout(150); tabs_pictures(pg, name)
            pg.click('.cm-tab[data-tab="save"]'); pg.click('.cm-card[data-slot="1"] [data-act="new"]'); pg.wait_for_timeout(100)
            sizes(pg, name + ', the question asked first'); shot(pg, name + '-ask-new-game'); pg.click('.cm-ask [data-ask="false"]'); pg.click('.cm-x')
        real = [e for e in errs if 'willReadFrequently' not in e]
        check(not real, 'page errors with ?test: %d%s' % (len(real), (': ' + '; '.join(real[:3])) if real else ''))
        ctx.close()

    # ======================================= B. as a player would =======================================
    if 'B' in only:
        print('B. as a player would (no ?test, a new browser profile)')
        errs = []; ctx = b.new_context(viewport={'width': 1280, 'height': 720}, accept_downloads=True); pg = ctx.new_page(); watch(pg, errs)
        t0 = time.time(); pg.goto(URL); err = ready(pg)
        check(not err, 'the page starts (%.0f s)%s' % (time.time() - t0, ': ' + err if err else ''))
        bg = pg.evaluate("""() => { const e = document.querySelector('#begin .cm-begin'), g = document.getElementById('cmBeginGo'); return { shown: getComputedStyle(document.getElementById('begin')).display !== 'none', line: e ? e.textContent : null, go: g ? [g.getBoundingClientRect().width, g.getBoundingClientRect().height] : null }; }""")
        check(bg['shown'] and bg['line'] and bg['line'].startswith('Save 1') and bg['go'] and min(bg['go']) >= 44, 'the Begin screen: under the button, "%s", and the way to the Save tab (%dx%d px)' % ((bg['line'] or '').replace('Saves', ' [Saves]'), (bg['go'] or [0, 0])[0], (bg['go'] or [0, 0])[1]))
        shot(pg, 'begin-laptop')
        pg.click('#begin button >> nth=0'); pg.wait_for_timeout(1500)
        lk = pg.evaluate("() => { const v = (id) => { const e = document.getElementById(id); return e ? getComputedStyle(e).display !== 'none' : null; }; return { menu: v('cmBtn'), who: v('who'), nums: v('nums'), look: v('lookbtn') }; }")
        check(lk['menu'] and not lk['who'] and not lk['nums'] and not lk['look'], 'as a player sees it: the menu button shows; "who", "nums"%s are hidden' % (' and the look\'s own button (the walker makes it; it lay over "who")' if lk['look'] is not None else ''))
        pg.wait_for_timeout(2500); shot(pg, 'land-laptop')
        # ---- the clock ----
        pg.evaluate("""() => { const W = window.__w3d; window.__ticks = () => (W.P && W.P.__menuTicks != null ? W.P.__menuTicks : W.ticks || 0);
          if (W.P && W.P.update && W.P.__menuTicks == null) { const u0 = W.P.update; W.P.__menuTicks = 0; W.P.update = function () { W.P.__menuTicks++; return u0.apply(this, arguments); }; } }""")
        tick = lambda: pg.evaluate('window.__ticks()')
        a = tick(); pg.wait_for_timeout(3000); b1 = tick()
        pg.click('#cmBtn'); pg.wait_for_timeout(300); c = tick(); pg.wait_for_timeout(3000); d = tick(); paused = pg.evaluate('__w3d.paused')
        pg.keyboard.press('Escape'); pg.wait_for_timeout(3000); e = tick(); unp = pg.evaluate('!__w3d.paused')
        check(b1 - a > 0 and d - c == 0 and paused and e - d > 0 and unp, "the game's clock: %d frames of the land in 3 s before; %d in 3 s with the menu open (paused); %d in 3 s after it closed" % (b1 - a, d - c, e - d))
        # ---- a voice that is playing stops with the menu, and carries on ----
        v = pg.evaluate("""async (src) => { const a = new Audio(src); a.loop = true; window.__voice = a; try { await a.play(); } catch (e) { return { err: String(e) }; }
          await new Promise((r) => setTimeout(r, 300)); const p0 = a.paused; W3D.menu.open(); await new Promise((r) => setTimeout(r, 300)); const p1 = a.paused;
          W3D.menu.close(); await new Promise((r) => setTimeout(r, 400)); const p2 = a.paused; a.pause(); return { p0, p1, p2 }; }""", silence())
        check(not v.get('err') and v['p0'] is False and v['p1'] is True and v['p2'] is False, 'a voice playing: it stops when the menu opens and carries on when it closes%s' % (' (' + v['err'] + ')' if v.get('err') else ''))
        # ---- the game saves itself ----
        sk = pg.evaluate("() => { const z = W3D.saves.zone; return (W3D.STORY && W3D.STORY[z] && W3D.STORY[z].key) || 'coven.story.v1'; }")
        prog = """(o) => { const W = __w3d, P = window.__fights && window.__fights.party; if (window.__story && __story.set) __story.set({ stage: o.stage });
          if (P) { P.setHp(o.hurt, o.hp); P.addHerb('moonpetal', 2); } const f = W.nearestFit(W.io.px + o.dx, W.io.py + o.dx); W.setIo(f[0], f[1], o.yaw); return { px: W.io.px, py: W.io.py }; }"""
        t_mark = pg.evaluate('Date.now()')
        here1 = pg.evaluate(prog, {'stage': 2, 'hurt': 'io', 'hp': 50, 'dx': 60, 'yaw': 1.0})
        got = pg.wait_for_function("(t) => { const s = JSON.parse(localStorage.getItem('coven.slot.1') || 'null'); return s && s.saved > t ? s.saved : 0; }", arg=t_mark, timeout=40000, polling=500).json_value()
        slot1 = pg.evaluate("JSON.parse(localStorage.getItem('coven.slot.1'))")
        live_same = all(pg.evaluate('(k) => localStorage.getItem(k)', k) == slot1['keys'][k] for k in slot1['keys'])
        check(live_same and sk in slot1['keys'], 'it saves itself on its timer: %.0f s after a change, slot 1 holds %d keys, all as the game has them (%s)' % ((got - t_mark) / 1000, len(slot1['keys']), ', '.join(sorted(slot1['keys']))))
        for why, js in [('hidden', "() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); delete document.visibilityState; }"),
                        ('closed', "() => dispatchEvent(new PageTransitionEvent('pagehide'))")]:
            t1 = pg.evaluate('Date.now()'); pg.evaluate(prog, {'stage': 2, 'hurt': 'io', 'hp': 50, 'dx': 8, 'yaw': 1.0}); pg.wait_for_timeout(20); pg.evaluate(js)
            s = pg.evaluate("JSON.parse(localStorage.getItem('coven.slot.1'))")
            check(s['saved'] >= t1 and json.loads(s['keys']['coven.where'])['px'] == round(pg.evaluate('__w3d.io.px'), 2), 'it saves itself when the page is %s' % why)
        slot1 = pg.evaluate("JSON.parse(localStorage.getItem('coven.slot.1'))")
        notes.append('slot 1 as saved: "%s", %d keys, %d bytes' % (slot1['line'], len(slot1['keys']), len(json.dumps(slot1))))
        # ---- out to a file ----
        pg.click('#cmBtn'); pg.click('.cm-tab[data-tab="save"]')
        with pg.expect_download() as dl: pg.click('[data-act="to-file"]')
        fpath = os.path.join(tempfile.mkdtemp(), dl.value.suggested_filename); dl.value.save_as(fpath)
        ftext = open(fpath, encoding='utf-8').read(); f = json.loads(ftext)
        slot1 = pg.evaluate("JSON.parse(localStorage.getItem('coven.slot.1'))")
        check(f['keys'] == slot1['keys'] and f['kind'] == 'coven-save', 'Save to a file: "%s", %d bytes, holds the same %d keys as slot 1' % (dl.value.suggested_filename, len(ftext.encode()), len(f['keys'])))
        shot(pg, 'laptop-save-in-use')
        # ---- a new game in slot 2: the page opens again ----
        pg.click('.cm-card[data-slot="2"] [data-act="new"]')
        with pg.expect_navigation(timeout=120000): ask_yes(pg)
        t0 = time.time(); err = ready(pg)
        st = pg.evaluate("""(sk) => { const p = JSON.parse(localStorage.getItem('coven.party') || 'null'), s = JSON.parse(localStorage.getItem(sk) || 'null');
          return { cur: W3D.saves.current, level: p ? p.level : 1, hurt: p ? Object.keys(p.hp || {}).length : 0, stage: s ? s.stage : 0, line: (document.querySelector('#begin .cm-begin span') || {}).textContent,
            one: localStorage.getItem('coven.slot.1') }; }""", sk)
        check(not err and st['cur'] == 2 and st['level'] == 1 and st['hurt'] == 0 and st['stage'] == 0, 'New game in slot 2 (asked first): the page opens again (%.0f s) with slot 2 in use, a new story and a whole party at level 1' % (time.time() - t0))
        check(json.loads(st['one'])['keys'] == slot1['keys'], 'slot 1 is untouched by it')
        check((st['line'] or '').startswith('Save 2'), 'the Begin screen says "%s"' % st['line'])
        pg.click('#begin button >> nth=0'); pg.wait_for_timeout(500)
        pg.evaluate(prog, {'stage': 1, 'hurt': 'jester', 'hp': 70, 'dx': -40, 'yaw': 2.0}); pg.evaluate("() => dispatchEvent(new PageTransitionEvent('pagehide'))")
        slot2 = pg.evaluate("JSON.parse(localStorage.getItem('coven.slot.2'))")
        check(slot2 and slot2['keys'] != slot1['keys'], 'slot 2 saves its own game: "%s"' % (slot2 or {}).get('line'))
        # ---- slot 1 again, from the Begin screen's way in ----
        pg.reload(); ready(pg)
        pg.click('#cmBeginGo'); pg.wait_for_timeout(200); shot(pg, 'laptop-save-three')
        with pg.expect_navigation(timeout=120000): pg.click('.cm-card[data-slot="1"] [data-act="continue"]')
        t0 = time.time(); err = ready(pg)
        back = pg.evaluate("(keys) => { const out = {}; for (const k in keys) out[k] = localStorage.getItem(k); return out; }", slot1['keys'])
        diff = [k for k in slot1['keys'] if k != 'coven.where' and back[k] != slot1['keys'][k]]
        w0, w1 = json.loads(slot1['keys']['coven.where']), json.loads(back['coven.where'])
        pos = pg.evaluate('({ px: __w3d.io.px, py: __w3d.io.py, who: __w3d.who, cur: W3D.saves.current })')
        check(not err and pos['cur'] == 1 and not diff, 'Continue slot 1: the page opens again (%.0f s), and the %d keys of the game come back exactly as saved%s' % (time.time() - t0, len(slot1['keys']) - 1, (' (differ: ' + ', '.join(diff) + ')') if diff else ''))
        check(abs(pos['px'] - w0['px']) < 1 and abs(pos['py'] - w0['py']) < 1 and pos['who'] == w0.get('who', 'io'), 'she stands where she was saved (%.1f, %.1f; saved at %.1f, %.1f), and %s walks' % (pos['px'], pos['py'], w0['px'], w0['py'], pos['who']))
        pg.click('#begin button >> nth=0'); pg.wait_for_timeout(300)
        # ---- copy and delete ----
        pg.click('#cmBtn'); pg.click('.cm-tab[data-tab="save"]'); pg.wait_for_timeout(100)
        pg.click('.cm-card[data-slot="1"] [data-act="copy"]'); pg.click('.cm-card[data-slot="1"] [data-act="copy-to-3"]'); pg.wait_for_timeout(150)
        s1, s3 = pg.evaluate("[JSON.parse(localStorage.getItem('coven.slot.1')), JSON.parse(localStorage.getItem('coven.slot.3'))]")
        check(s3 and s3['keys'] == s1['keys'], 'Copy slot 1 to slot 3: the same keys')
        pg.click('.cm-card[data-slot="3"] [data-act="delete"]'); ask_yes(pg); pg.wait_for_timeout(100)
        pg.click('.cm-card[data-slot="2"] [data-act="delete"]'); ask_yes(pg); pg.wait_for_timeout(100)
        check(pg.evaluate("!localStorage.getItem('coven.slot.2') && !localStorage.getItem('coven.slot.3') && !!localStorage.getItem('coven.slot.1')"), 'Delete slots 3 and 2 (asked first): both gone, slot 1 kept')
        # ---- wrong files are refused before anything is touched ----
        game = lambda: pg.evaluate("() => { const o = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); if (k !== 'coven.where' && k !== 'coven.slot.' + W3D.saves.current) o[k] = localStorage.getItem(k); } return o; }")
        g0 = game(); refused = []
        bad = dict(f); bad['keys'] = dict(f['keys']); bad['keys']['evil.key'] = '{}'
        for name, data in [('notes.txt', b'just some words'), ('other.json', json.dumps({'game': 'Another game', 'keys': {}}).encode()), ('sneaky.json', json.dumps(bad).encode())]:
            pg.evaluate("document.getElementById('cmMenu').dataset.fileWhy = ''")
            pg.set_input_files('#cmMenu input[type=file]', files=[{'name': name, 'mimeType': 'application/json', 'buffer': data}])
            why = pg.wait_for_function("document.getElementById('cmMenu').dataset.fileWhy || null", timeout=5000).json_value()
            refused.append('%s (%s)' % (name, why))
            check(why != 'ok' and pg.is_visible('.cm-note.cm-on') and not pg.is_visible('.cm-ask'), 'a wrong file is refused: %s, "%s"' % (refused[-1], pg.evaluate("document.querySelector('.cm-note').textContent")))
        check(game() == g0, 'the three wrong files changed nothing in the browser')
        # ---- the file comes back ----
        pg.set_input_files('#cmMenu input[type=file]', fpath)
        pg.wait_for_selector('.cm-ask:not([hidden]) [data-ask="2"]', timeout=5000); shot(pg, 'laptop-file-where'); sizes(pg, 'laptop, where to put a save from a file')
        pg.click('.cm-ask [data-ask="2"]'); pg.wait_for_timeout(200)
        s2 = pg.evaluate("JSON.parse(localStorage.getItem('coven.slot.2'))")
        check(s2 and s2['keys'] == f['keys'], 'Load from a file into slot 2: slot 2 holds exactly the keys that went out to the file')
        real = [e for e in errs if 'willReadFrequently' not in e]
        check(not real, 'page errors as a player: %d%s' % (len(real), (': ' + '; '.join(real[:3])) if real else ''))
        notes.append('keys in the browser at the end: ' + ', '.join(sorted(store(pg))))
        ctx.close()
        # the Begin screen on a phone, upright
        ctx = b.new_context(viewport={'width': 412, 'height': 880}); pg = ctx.new_page(); pg.goto(URL); ready(pg); pg.wait_for_timeout(300)
        sizes(pg, 'phone 412x880, the Begin screen'); shot(pg, 'begin-phone')
        pg.click('#begin button >> nth=0'); pg.wait_for_timeout(4000); sizes(pg, 'phone 412x880, the land as a player sees it'); shot(pg, 'land-phone'); ctx.close()

    # ======================================= C. no storage =======================================
    if 'C' in only:
        print('C. a browser that keeps nothing for this page')
        errs = []; ctx = b.new_context(viewport={'width': 412, 'height': 880}); pg = ctx.new_page(); watch(pg, errs)
        pg.add_init_script("Object.defineProperty(window, 'localStorage', { configurable: true, get() { throw new DOMException('The page has no storage', 'SecurityError'); } });")
        pg.goto(URL); err = ready(pg)
        pg.click('#cmBeginGo'); pg.wait_for_timeout(200)
        w = pg.evaluate("() => { const e = document.querySelector('[data-k=\"no-storage\"]'); return e && e.getBoundingClientRect().height > 0 ? e.textContent : null; }")
        check(not err and w and 'Save to a file' in w, 'the Save tab says so plainly: "%s"' % w)
        shot(pg, 'phone-no-storage'); sizes(pg, 'phone, the Save tab with no storage')
        pg.click('.cm-x'); pg.click('#begin button >> nth=0'); pg.wait_for_timeout(300)
        sk = pg.evaluate("() => { const z = W3D.saves.zone; return (W3D.STORY && W3D.STORY[z] && W3D.STORY[z].key) || 'coven.story.v1'; }")
        stage_of = lambda: pg.evaluate("(k) => { const s = JSON.parse(localStorage.getItem(k) || 'null'); return s ? s.stage : null; }", sk)
        pg.evaluate("() => { if (window.__story && __story.set) __story.set({ stage: 2 }); const P = window.__fights && __fights.party; if (P) P.setHp('fox', 40); }")
        pg.click('#cmBtn'); pg.click('.cm-tab[data-tab="save"]')
        with pg.expect_download() as dl: pg.click('[data-act="to-file"]')
        fpath = os.path.join(tempfile.mkdtemp(), dl.value.suggested_filename); dl.value.save_as(fpath); f = json.loads(open(fpath, encoding='utf-8').read())
        fs = json.loads(f['keys'][sk])['stage'] if sk in f['keys'] else None
        check(fs == 2, 'Save to a file works there, with the whole game in it (%d keys; the story at stage %s)' % (len(f['keys']), fs))
        pg.click('.cm-x'); pg.evaluate("() => { if (window.__story && __story.set) __story.set({ stage: 3 }); }")
        pg.click('#cmBtn'); pg.click('.cm-tab[data-tab="save"]')
        pg.set_input_files('#cmMenu input[type=file]', fpath); pg.wait_for_selector('.cm-ask:not([hidden]) [data-ask="1"]', timeout=5000)
        pg.click('.cm-ask [data-ask="1"]'); pg.wait_for_selector('.cm-ask:not([hidden]) [data-ask="true"]', timeout=5000)
        with pg.expect_navigation(timeout=120000): pg.click('.cm-ask [data-ask="true"]')
        err = ready(pg)
        st = pg.evaluate("(k) => ({ mem: W3D.saves.storage.inMemory, hash: location.hash, same: Object.keys(W3D.saves.slot(1).keys).length, story: JSON.parse(localStorage.getItem(k) || 'null') })", sk)
        check(not err and st['mem'] and st['story'] and st['story']['stage'] == 2 and not st['hash'], 'Load from a file there: the page opens again with the file\'s game (the story back at stage 2, was 3), carried in the address, which is then cleared')
        real = [e for e in errs if 'willReadFrequently' not in e]
        check(not real, 'page errors with no storage: %d%s' % (len(real), (': ' + '; '.join(real[:3])) if real else ''))
        ctx.close()
    b.close()

for n in notes: print('  note: ' + n)
print('ALL PASSED' if not fails else '%d FAILED' % len(fails))
sys.exit(1 if fails else 0)
