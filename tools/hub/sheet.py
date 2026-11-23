#!/usr/bin/env python3
"""sheet.py: joins the pictures tools/look.py made into sheets of four (sheet1.jpg ...), each with its name on it.
    python3 tools/hub/sheet.py <folder of pictures>"""
import sys, os
from PIL import Image, ImageDraw
d = sys.argv[1]; names = sorted(f for f in os.listdir(d) if f.endswith('.png') and not f.startswith('sheet'))
for s in range(0, len(names), 4):
    im = Image.new('RGB', (1280, 720))
    for k, n in enumerate(names[s:s+4]):
        t = Image.open(os.path.join(d, n)).convert('RGB').resize((640, 360), Image.LANCZOS)
        ImageDraw.Draw(t).text((8, 6), n[:-4], fill=(255, 255, 120))
        im.paste(t, ((k % 2) * 640, (k // 2) * 360))
    im.save(os.path.join(d, 'sheet%d.jpg' % (s // 4 + 1)), quality=88)
print(len(names), 'pictures')
