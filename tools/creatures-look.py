#!/usr/bin/env python3
"""creatures-look.py: pictures of the six creatures from Aethermoor M7, with no screen (the creatures job).

    python3 tools/creatures-look.py builds/creatures-lab.html <out folder> [options]

  --size 1280x720          the window (also 412x880 for an upright phone)
  --keys glowcap,rotstag   which creatures (all six if left out)
  --query m7=before        added to the page's address (m7=before draws them as they first came in)
  --stand                  one picture of each standing, turned three-quarters, beside a witch: <key>-stand.png
  --m7light                the same under M7's own lights (its beasts page), to set beside M7's pictures: <key>-m7light.png
  --motions                every motion at three moments, from four sides, one sheet a motion: <key>-<motion>.png
  --fight 3,6,9            a fight in its slot, the battle playing itself: a picture at each of these seconds
  --row                    all of them standing in a row beside a witch, in one picture: row.png

It prints the page's errors (there should be none), and for each creature its height and triangles.
The browser here draws without a graphics card: it cannot show motion or measure a frame rate.
"""
import os, sys, json
from playwright.sync_api import sync_playwright

args = sys.argv[1:]
if len(args) < 2:
    sys.exit(__doc__)
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = {'size': '1280x720', 'keys': '', 'query': '', 'fight': ''}
flags = set()
i = 2
while i < len(args):
    a = args[i]
    if a in ('--size', '--keys', '--query', '--fight'):
        opt[a[2:]] = args[i + 1]; i += 2
    else:
        flags.add(a[2:]); i += 1
W, H = (int(v) for v in opt['size'].split('x'))
os.makedirs(out, exist_ok=True)
errors = []


def grid(paths, cols, dest, labels):
    from PIL import Image, ImageDraw
    ims = [Image.open(p).convert('RGB') for p in paths]
    w, h = ims[0].size
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new('RGB', (w * cols, h * rows), (0, 0, 0))
    for k, (im, lab) in enumerate(zip(ims, labels)):
        ImageDraw.Draw(im).text((6, 4), lab, fill=(255, 240, 150))
        sheet.paste(im, ((k % cols) * w, (k // cols) * h))
    sheet.save(dest)
    for p in paths:
        os.remove(p)


with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': W, 'height': H})
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'willReadFrequently' not in m.text else None)
    pg.goto('file://' + page_file + '?test' + ('&' + opt['query'] if opt['query'] else ''), wait_until='load', timeout=240000)
    pg.wait_for_function('!!window.__clab', timeout=240000)
    pg.evaluate('() => window.__clab.ready')
    keys = opt['keys'].split(',') if opt['keys'] else pg.evaluate('() => window.__clab.keys')
    tag = '-before' if 'before' in opt['query'] else ''
    sz = '-%dx%d' % (W, H)
    for k in keys:
      try:
          if 'stand' in flags:
              info = pg.evaluate('async (k) => { const r = await window.__clab.view(k, { act: "stand", yaw: 0.55, bare: true }); return { h: r.height, t: r.triangles }; }', k)
              pg.screenshot(path=os.path.join(out, '%s-stand%s%s.png' % (k, tag, sz)))
              print(k, 'height %.2f m' % info['h'], info['t'], 'triangles drawn')
          if 'm7light' in flags:
              pg.evaluate('(k) => window.__clab.view(k, { act: "stand", yaw: 0.55, bare: true, light: "m7", witch: false })', k)
              pg.screenshot(path=os.path.join(out, '%s-m7light%s.png' % (k, sz)))
              pg.evaluate('(k) => window.__clab.view(k, { act: "stand", light: "battle" })', k)
          if 'motions' in flags:
              for m in pg.evaluate('(k) => window.__clab.motions(k)', k):
                  shots, labels = [], []
                  for u in (0.3, 0.55, 0.8):
                      for yaw in (0, 1.5708, 3.1416, 4.7124):
                          f = os.path.join(out, '_%d.png' % len(shots))
                          pg.evaluate('([k, m, u, y]) => window.__clab.view(k, { act: m, u, yaw: y, at: u * 2, bare: true, witch: false })', [k, m, u, yaw])
                          pg.screenshot(path=f); shots.append(f); labels.append('%s u=%.2f side %d' % (m, u, round(yaw / 1.5708)))
                  grid(shots, 4, os.path.join(out, '%s-%s%s.png' % (k, m, tag)), labels)
              print(k, 'motions done')
          if opt['fight']:
              pg.evaluate('(k) => { window.__battle = null; window.__clab.start(k, { auto: "careless" }); }', k)
              pg.wait_for_function("window.__battle && window.__battle.state === 'battle'", timeout=600000, polling=250)
              pg.evaluate('() => { window.__battle.turbo = 2; }')
              t0 = pg.evaluate('() => window.__battle.t')
              for at in [float(x) for x in opt['fight'].split(',')]:
                  pg.wait_for_function("(t) => !window.__battle || window.__battle.t >= t || window.__battle.state === 'over'", arg=t0 + at, timeout=900000, polling=100)
                  if pg.evaluate("() => !window.__battle || window.__battle.state === 'over'"):
                      break
                  pg.evaluate('() => { window.__battle.turbo = 0; }'); pg.wait_for_timeout(250)
                  pg.screenshot(path=os.path.join(out, '%s-fight%s%s-at-%02d.png' % (k, tag, sz, at)))
                  d = pg.evaluate('() => window.__battle.drawn')
                  print(k, 'fight at %ds:' % at, d.get('triangles'), 'triangles,', d.get('calls'), 'draw calls')
                  pg.evaluate('() => { window.__battle.turbo = 2; }')
              pg.evaluate('() => { if (window.__battle) window.__battle.turbo = 40; }')
              pg.wait_for_function('() => !window.__clab.busy', timeout=900000, polling=500)
      except Exception as e:
        print(k, 'FAILED:', str(e)[:300])
    if 'row' in flags:
        hs = pg.evaluate('(ks) => window.__clab.row(ks)', keys)
        pg.screenshot(path=os.path.join(out, 'row%s%s.png' % (tag, sz)))
        print('in a row, heights in metres:', dict(zip(keys, hs)))
    b.close()
real = [e for e in errors if 'willReadFrequently' not in e]
print('page errors:', len(real), real[:3])
