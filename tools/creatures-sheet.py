#!/usr/bin/env python3
"""creatures-sheet.py: one sheet for each creature, for Chris: as it first came in beside how it is now, on a laptop
and on a phone, and in a fight. Made from the pictures tools/creatures-look.py takes (the creatures job).

    python3 tools/creatures-sheet.py <folder of pictures> <out folder>

Each sheet is <key>.jpg: top, the laptop (1280 by 720) before and after; then the phone (412 by 880) before and after
and in a fight; at the bottom, in a fight on a laptop. Before and after are the creature alone beside a witch. The phone pictures keep their shape (tools/hub/sheet.py makes
every picture 16 by 9, which squashes a phone's).
"""
import os, sys
from PIL import Image, ImageDraw, ImageFont

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
try:
    font = ImageFont.truetype('DejaVuSans.ttf', 26)
except OSError:
    font = ImageFont.load_default()
NAMES = {'glowcap': 'Glowcap', 'forge-spark': 'Forge-Spark', 'sapwight': 'Sapwight', 'rotwarden': 'The Rotwarden', 'rotstag': 'The Rot-Stag', 'thornhound': 'Thornhound'}


def pic(name, w, h):
    f = os.path.join(src, name)
    if not os.path.exists(f):
        im = Image.new('RGB', (w, h), (30, 26, 40)); ImageDraw.Draw(im).text((10, 10), 'not taken', fill=(200, 200, 200), font=font); return im
    im = Image.open(f).convert('RGB'); im.thumbnail((w, h), Image.LANCZOS)
    c = Image.new('RGB', (w, h), (13, 10, 20)); c.paste(im, ((w - im.width) // 2, (h - im.height) // 2)); return c


def label(im, text):
    d = ImageDraw.Draw(im); d.rectangle((0, 0, im.width, 38), fill=(13, 10, 20)); d.text((10, 5), text, fill=(255, 230, 168), font=font); return im


for k, name in NAMES.items():
    S = Image.new('RGB', (1640, 1650), (13, 10, 20))
    S.paste(label(pic('%s-stand-before-1280x720.png' % k, 800, 450), name + ': before, laptop'), (10, 50))
    S.paste(label(pic('%s-stand-1280x720.png' % k, 800, 450), name + ': after, laptop'), (830, 50))
    S.paste(label(pic('%s-stand-before-412x880.png' % k, 300, 641), 'before, phone'), (10, 520))
    S.paste(label(pic('%s-stand-412x880.png' % k, 300, 641), 'after, phone'), (320, 520))
    S.paste(label(pic('%s-fight-412x880-at-03.png' % k, 300, 641), 'in a fight, phone'), (650, 520))
    S.paste(label(pic('%s-fight-412x880-at-06.png' % k, 300, 641), 'a moment later'), (960, 520))
    S.paste(label(pic('%s-fight-1280x720-at-03.png' % k, 800, 450), 'in a fight, laptop'), (10, 1185))
    S.paste(label(pic('%s-fight-1280x720-at-06.png' % k, 800, 450), 'a moment later'), (830, 1185))
    ImageDraw.Draw(S).text((10, 8), name + ' (Aethermoor M7), in Coven of the Moon Faire', fill=(240, 236, 255), font=font)
    S.save(os.path.join(out, k + '.jpg'), quality=86)
    print(os.path.join(out, k + '.jpg'))
