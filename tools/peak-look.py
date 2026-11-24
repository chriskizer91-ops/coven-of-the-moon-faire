#!/usr/bin/env python3
"""peak-look.py: pictures of the two peak creatures, with no screen (the peak-creatures job, made from creatures-look.py).

    python3 tools/peak-look.py builds/peak-creatures-lab.html <out folder> [options]

  --size 1280x720          the window (also 412x880 for an upright phone)
  --keys wickstoat         which creatures (both if left out)
  --sheet <png> <key>      Chris's sheet beside the model: the sheet's front, side and back above the model's, drawn
                           flat on the sheet's grey: <key>-beside-sheet.png (give --sheet once for each creature)
  --stand                  standing, turned three-quarters, beside a witch, under the battle's lights: <key>-stand.png
  --strip                  one strip of its motions (each at its strongest moment): <key>-strip.png
  --motions                every motion at three moments from four sides, one sheet a motion: <key>-<motion>.png
  --fight 3,6,9            a fight in its slot, the battle playing itself: a picture at each of these seconds

It prints the page's errors (there should be none), and for each creature its height and triangles.
The browser here draws without a graphics card: it cannot show motion or measure a frame rate.
"""
import os, sys
from playwright.sync_api import sync_playwright
from PIL import Image, ImageDraw

args = sys.argv[1:]
if len(args) < 2:
    sys.exit(__doc__)
page_file, out = os.path.abspath(args[0]), os.path.abspath(args[1])
opt = {'size': '1280x720', 'keys': '', 'fight': ''}
sheets, flags = {}, set()
i = 2
while i < len(args):
    a = args[i]
    if a == '--sheet':
        sheets[args[i + 2]] = args[i + 1]; i += 3
    elif a in ('--size', '--keys', '--fight'):
        opt[a[2:]] = args[i + 1]; i += 2
    else:
        flags.add(a[2:]); i += 1
W, H = (int(v) for v in opt['size'].split('x'))
os.makedirs(out, exist_ok=True)
errors = []
# the sheet's three figures, [x0, x1] in its pixels (front, side, back)
CROPS = {'wickstoat': [(0, 280), (240, 1270), (1280, 1520)], 'hoarmantle': [(5, 390), (388, 1130), (1135, 1530)]}
STRONG = {'pinch': 0.5, 'skitter': 0.35, 'glint': 0.55, 'trample': 0.7, 'breath': 0.62, 'shake': 0.5, 'charge': 0.9,
          'appear': 0.6, 'hurt': 0.3, 'block': 0.5, 'stagger': 0.4, 'die': 0.35}


def grid(paths, cols, dest, labels, keep=False):
    ims = [Image.open(p).convert('RGB') for p in paths]
    w, h = ims[0].size
    rows = (len(ims) + cols - 1) // cols
    sheet = Image.new('RGB', (w * cols, h * rows), (0, 0, 0))
    for k, (im, lab) in enumerate(zip(ims, labels)):
        ImageDraw.Draw(im).text((6, 4), lab, fill=(255, 240, 150))
        sheet.paste(im, ((k % cols) * w, (k // cols) * h))
    sheet.save(dest)
    if not keep:
        for p in paths:
            os.remove(p)


def trim(im, bg, pad=12):
    import numpy as np
    a = np.asarray(im.convert('RGB')).astype(int); m = np.abs(a - np.array(bg)).sum(2) > 30
    ys, xs = np.nonzero(m)
    if not len(xs):
        return im
    return im.crop((max(0, xs.min() - pad), max(0, ys.min() - pad), min(im.width, xs.max() + pad), min(im.height, ys.max() + pad)))


def beside(sheet_png, key, shots, dest):
    """the sheet's three figures above the model's three, each pair the same height, on the sheet's grey"""
    sh = Image.open(sheet_png).convert('RGB'); bg = sh.getpixel((10, 10))
    top = [trim(sh.crop((a, 0, b, sh.height)), bg) for a, b in CROPS[key]]
    bot = [trim(Image.open(p).convert('RGB'), (162, 154, 147)) for p in shots]
    # the model's three are scaled together, by the side views' lengths, so their sizes stay true to each other
    k = top[1].width / max(1, bot[1].width)
    bot = [im.resize((max(1, int(im.width * k)), max(1, int(im.height * k)))) for im in bot]
    gap = 30; cw = [max(t.width, m.width) for t, m in zip(top, bot)]
    th = max(t.height for t in top); mh = max(m.height for m in bot)
    img = Image.new('RGB', (sum(cw) + gap * 4, th + mh + gap * 3 + 40), bg)
    d = ImageDraw.Draw(img); x = gap
    for i, lab in enumerate(('front', 'side', 'back')):
        img.paste(top[i], (x + (cw[i] - top[i].width) // 2, gap + 20 + th - top[i].height))
        img.paste(bot[i], (x + (cw[i] - bot[i].width) // 2, gap * 2 + 20 + th + mh - bot[i].height))
        d.text((x, 6), lab + ': Chris\'s sheet (top), the model (below)', fill=(40, 36, 34)); x += cw[i] + gap
    img.save(dest)
    for p in shots:
        os.remove(p)


with sync_playwright() as p:
    b = p.chromium.launch(channel='chrome', headless=True, args=['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl'])
    pg = b.new_page(viewport={'width': W, 'height': H})
    pg.on('pageerror', lambda e: errors.append(str(e)))
    pg.on('console', lambda m: errors.append(m.text) if m.type == 'error' and 'willReadFrequently' not in m.text else None)
    pg.goto('file://' + page_file + '?test', wait_until='load', timeout=240000)
    pg.wait_for_function('!!window.__plab', timeout=240000)
    pg.evaluate('() => window.__plab.ready')
    keys = opt['keys'].split(',') if opt['keys'] else pg.evaluate('() => window.__plab.keys')
    sz = '-%dx%d' % (W, H)
    for k in keys:
        try:
            if k in sheets:
                shots = []
                for yaw in (0, 1.5708, 3.1416):
                    f = os.path.join(out, '_s%d.png' % len(shots))
                    r = pg.evaluate('([k, y]) => window.__plab.view(k, { act: "stand", yaw: y, bare: true, light: "plain", ortho: true, witch: false, lit: 9 })', [k, yaw])
                    pg.screenshot(path=f); shots.append(f)
                beside(sheets[k], k, shots, os.path.join(out, '%s-beside-sheet.png' % k))
                print(k, 'beside its sheet; size (across, tall, long) m:', r['size'])
            if 'stand' in flags:
                info = pg.evaluate('async (k) => { const r = await window.__plab.view(k, { act: "stand", yaw: 0.55, bare: true }); return { h: r.height, t: r.triangles }; }', k)
                pg.screenshot(path=os.path.join(out, '%s-stand%s.png' % (k, sz)))
                print(k, 'height %.2f m' % info['h'], info['t'], 'triangles drawn')
            if 'strip' in flags:
                shots, labels = [], []
                for m in pg.evaluate('(k) => window.__plab.motions(k)', k):
                    f = os.path.join(out, '_m%d.png' % len(shots))
                    pg.evaluate('([k, m, u]) => window.__plab.view(k, { act: m, u, yaw: 0.9, at: 0.8, bare: true, witch: true })', [k, m, STRONG.get(m, 0.5)])
                    pg.screenshot(path=f); shots.append(f); labels.append(m)
                grid(shots, 4, os.path.join(out, '%s-strip.png' % k), labels)
                print(k, 'strip of', len(shots), 'motions')
            if 'motions' in flags:
                for m in pg.evaluate('(k) => window.__plab.motions(k)', k):
                    shots, labels = [], []
                    for u in (0.3, 0.55, 0.8):
                        for yaw in (0, 1.5708, 3.1416, 4.7124):
                            f = os.path.join(out, '_%d.png' % len(shots))
                            pg.evaluate('([k, m, u, y]) => window.__plab.view(k, { act: m, u, yaw: y, at: u * 2, bare: true, witch: false })', [k, m, u, yaw])
                            pg.screenshot(path=f); shots.append(f); labels.append('%s u=%.2f side %d' % (m, u, round(yaw / 1.5708)))
                    grid(shots, 4, os.path.join(out, '%s-%s.png' % (k, m)), labels)
                print(k, 'motions done')
            if opt['fight']:
                pg.evaluate('(k) => { window.__battle = null; window.__plab.start(k, { auto: "careless" }); }', k)
                pg.wait_for_function("window.__battle && window.__battle.state === 'battle'", timeout=600000, polling=250)
                pg.evaluate('() => { window.__battle.turbo = 2; }')
                t0 = pg.evaluate('() => window.__battle.t')
                for at in [float(x) for x in opt['fight'].split(',')]:
                    pg.wait_for_function("(t) => !window.__battle || window.__battle.t >= t || window.__battle.state === 'over'", arg=t0 + at, timeout=900000, polling=100)
                    if pg.evaluate("() => !window.__battle || window.__battle.state === 'over'"):
                        break
                    pg.evaluate('() => { window.__battle.turbo = 0; }'); pg.wait_for_timeout(250)
                    pg.screenshot(path=os.path.join(out, '%s-fight%s-at-%02d.png' % (k, sz, at)))
                    d = pg.evaluate('() => window.__battle.drawn')
                    print(k, 'fight at %ds:' % at, d.get('triangles'), 'triangles,', d.get('calls'), 'draw calls')
                    pg.evaluate('() => { window.__battle.turbo = 2; }')
                pg.evaluate('() => { if (window.__battle) window.__battle.turbo = 40; }')
                pg.wait_for_function('() => !window.__plab.busy', timeout=900000, polling=500)
                print(k, 'fight ended:', pg.evaluate('() => document.getElementById("last").textContent'))
        except Exception as e:
            print(k, 'FAILED:', str(e)[:300])
    b.close()
real = [e for e in errors if 'willReadFrequently' not in e]
print('page errors:', len(real), real[:3])
