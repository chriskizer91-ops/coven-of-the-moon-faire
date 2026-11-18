#!/usr/bin/env python3
"""look.py: opens a built page in a browser with no screen, puts Io somewhere, and saves pictures of what the game draws.

    python3 tools/look.py builds/first-test.html <out folder> [--size 1280x720] [--plan plan.json]

A plan is a list of shots: {"name": "bridge", "io": [px, py, yaw], "cam": [yaw, pitch, dist], "run": 1.0, "js": "..."}
  io:  where she stands, in the town painting's pixels (the land beyond uses the same grid), and which way she faces
  cam: the camera's turn, tilt and distance (left out: the game's own)
  run: seconds of game time to play before the picture (so the land near her has time to be made)
  js:  a line of script to run first (window.__w3d is the walker)
With no plan it takes one picture where the game starts.

It prints the page's errors (there should be none) and, for each shot, the triangles and draw calls.
The browser here draws without a graphics card, so its frame rate means nothing: only a real laptop or phone can say.
"""
import json, os, sys, time
from playwright.sync_api import sync_playwright


def main():
    args = sys.argv[1:]
    if len(args) < 2:
        sys.exit(__doc__)
    page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
    size = (1280, 720)
    plan = [{"name": "start", "run": 1.0}]
    extra = ''
    i = 2
    while i < len(args):
        if args[i] == '--size':
            size = tuple(int(v) for v in args[i + 1].split('x')); i += 2
        elif args[i] == '--plan':
            plan = json.load(open(args[i + 1])); i += 2
        elif args[i] == '--query':
            extra = '&' + args[i + 1]; i += 2
        else:
            i += 1
    os.makedirs(out, exist_ok=True)
    errors = []
    with sync_playwright() as p:
        b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
        pg = b.new_page(viewport={'width': size[0], 'height': size[1]})
        pg.on('pageerror', lambda e: errors.append('page error: ' + str(e)))
        pg.on('console', lambda m: errors.append('console ' + m.type + ': ' + m.text) if m.type in ('error', 'warning') and 'GPU stall' not in m.text and 'GL Driver Message' not in m.text else None)
        t0 = time.time()
        pg.goto('file://' + page_file + '?test' + extra)
        pg.wait_for_function('window.__ready || window.__err', timeout=180000)
        err = pg.evaluate('window.__err || null')
        if err:
            print('THE PAGE DID NOT START:', err); b.close(); sys.exit(1)
        print('started in %.1f s' % (time.time() - t0))
        for s in plan:
            if s.get('js'):
                pg.evaluate(s['js'])
            if s.get('io'):
                pg.evaluate('([x, y, a]) => window.__w3d.setIo(x, y, a)', s['io'])
            if s.get('cam'):
                pg.evaluate('([a, b, c]) => window.__w3d.setCam(a, b, c)', s['cam'])
            n = pg.evaluate('(sec) => window.__w3d.step(sec, 30)', s.get('run', 0.5))
            # the land is made a square at a time: play on until none is waiting
            for _ in range(40):
                if not pg.evaluate('window.__land ? window.__land.pending() : 0'):
                    break
                n = pg.evaluate('window.__w3d.step(0.2, 30)')
            n = pg.evaluate('window.__w3d.step(0.04, 30)')
            f = os.path.join(out, s['name'] + '.png')
            pg.screenshot(path=f)
            more = pg.evaluate('window.__land ? window.__land.numbers() : null')
            print('%-22s %7d triangles %4d draw calls%s' % (s['name'], n['triangles'], n['calls'], ('  land: ' + json.dumps(more)) if more else ''))
        b.close()
    print('page errors: %d' % len(errors))
    for e in errors[:12]:
        print('  ' + e[:300])
    sys.exit(1 if any(e.startswith('page error') for e in errors) else 0)


if __name__ == '__main__':
    main()
