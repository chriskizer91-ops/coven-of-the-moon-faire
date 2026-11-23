#!/usr/bin/env python3
"""probe.py: opens a built page with no screen, runs one piece of script in it, and prints what it gives back.
    python3 tools/hub/probe.py <full path of builds/zone-3.html> <a file holding: () => { ... return {...} }>
For measuring the land: window.__land, window.__w3d, window.__people, window.__story, window.__things are there."""
import sys, json
from playwright.sync_api import sync_playwright
page, js = sys.argv[1], sys.argv[2]
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + page + '?test'); pg.wait_for_function('window.__ready || window.__err', timeout=300000)
    print('err:', pg.evaluate('window.__err || null'), errs[:3])
    print(json.dumps(pg.evaluate(open(js).read())))
    b.close()
