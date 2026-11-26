#!/usr/bin/env python3
"""left-overs-load.py: how long a built page takes to reach its Begin screen here (the left-overs job, November 25, 2026).

    python3 tools/left-overs-load.py builds/zone-1.html [builds/zone-2.html ...] [--runs 2]

Opens each page as a player would (no ?test), in a fresh browser page, and times: the page's text read and its scripts
run (the 'load' event), and the game ready with its Begin button showing. This machine has no graphics card and is
shared, so the numbers are for comparing one page with another here, not what a laptop or phone will take.
"""
import os, sys, time
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
runs = int(args[args.index('--runs') + 1]) if '--runs' in args else 1
pages = [a for i, a in enumerate(args) if not a.startswith('--') and (i == 0 or args[i - 1] != '--runs')]
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    for page in pages:
        f = os.path.abspath(page)
        for r in range(runs):
            pg = b.new_page(viewport={'width': 1280, 'height': 720}); errs = []
            pg.on('pageerror', lambda e: errs.append(str(e)))
            t0 = time.time(); pg.goto('file://' + f, wait_until='load', timeout=600000); t1 = time.time()
            pg.wait_for_function("(window.__ready && document.querySelector('#begin button')) || window.__err", timeout=600000); t2 = time.time()
            print('%-28s %6.1f MB  run %d: loaded in %5.1f s, Begin showing at %5.1f s, page errors %d' % (os.path.basename(page), os.path.getsize(f) / 1e6, r + 1, t1 - t0, t2 - t0, len(errs)), flush=True)
            pg.close()
    b.close()
