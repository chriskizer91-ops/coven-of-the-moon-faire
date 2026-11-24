#!/usr/bin/env python3
"""townsfolk-sizes.py: joins the size pictures tools/look.py took of builds/townsfolk-lineup.html (with
tools/townsfolk-lineup-plan.json) into the sheets Chris gets (the townsfolk job, November 24, 2026).

    python3 tools/townsfolk-sizes.py <folder of look.py's pictures> <out folder>

    sizes-1-grey.jpg            the four zones' rows, two by two, at full size: every grey shape beside one of the fair folk
    sizes-2-first-colours.jpg   the same in first colours (only to tell the parts apart)
    sizes-3-all-in-a-row.jpg    the four grey rows end to end, as one long picture
"""
import os, sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
pic = lambda n: Image.open(os.path.join(src, n + '.png')).convert('RGB')
grey = [pic('a%d-zone-%d-grey' % (i, i)) for i in (1, 2, 3, 4)]
col = [pic('b%d-zone-%d-first-colours' % (i, i)) for i in (1, 2, 3, 4)]
w, h = grey[0].size
for name, four in (('sizes-1-grey.jpg', grey), ('sizes-2-first-colours.jpg', col)):
    im = Image.new('RGB', (w * 2, h * 2))
    for k, t in enumerate(four):
        im.paste(t, ((k % 2) * w, (k // 2) * h))
    im.save(os.path.join(out, name), quality=88)
row = Image.new('RGB', (w * 4, h))
for k, t in enumerate(grey):
    row.paste(t, (k * w, 0))
row.save(os.path.join(out, 'sizes-3-all-in-a-row.jpg'), quality=88)
print('wrote 3 sheets in', out, '(%d x %d, %d x %d)' % (w * 2, h * 2, w * 4, h))
