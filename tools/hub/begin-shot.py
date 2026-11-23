#!/usr/bin/env python3
"""begin-shot.py: opens a page as a player would (not as a check), presses Begin, and prints what is being said.
    python3 tools/hub/begin-shot.py <full path of builds/zone-2.html> [name for its three pictures]"""
import sys
from playwright.sync_api import sync_playwright
page = sys.argv[1]; out = sys.argv[2] if len(sys.argv) > 2 else 'begin'
with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', '--autoplay-policy=no-user-gesture-required'])
    pg = b.new_page(viewport={'width': 1280, 'height': 720}); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)))
    pg.goto('file://' + page); pg.wait_for_function('window.__ready || window.__err', timeout=400000); pg.wait_for_timeout(1500)
    pg.screenshot(path=out + '-1.png')
    pg.click('#begin button'); pg.wait_for_timeout(4000); pg.screenshot(path=out + '-2.png')
    print('say:', pg.evaluate('JSON.stringify(window.__people.say())'))
    pg.wait_for_timeout(9000); pg.screenshot(path=out + '-3.png'); print('say:', pg.evaluate('JSON.stringify(window.__people.say())'), 'errors:', errs[:3])
    b.close()
