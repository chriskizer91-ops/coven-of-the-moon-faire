# Fill the empty space between a bake's islands with each island's own edge colour (Coven, peak-creatures job): the
# kit's 6-pixel margin is too thin once the pictures are made smaller for a phone, and the black between islands then
# shows as thin dark lines along seams (on small parts like horns and ice most of all).
#   python3 kit/tools/dilate.py foes/<key>       (after the bake, before textures.py)
import sys, os, numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt
d = os.path.join(sys.argv[1], 'build', 'bake')
col = np.asarray(Image.open(os.path.join(d, 'color.png')).convert('RGB'))
empty = col.astype(int).sum(2) < 3
_, (iy, ix) = distance_transform_edt(empty, return_indices=True)
for n in ('color.png', 'normal.png', 'ao.png', 'mat.png', 'emit.png'):
    p = os.path.join(d, n)
    if not os.path.exists(p): continue
    im = Image.open(p); a = np.asarray(im.convert('RGB')).copy()
    if a.shape[:2] != empty.shape: continue
    a[empty] = a[iy[empty], ix[empty]]
    Image.fromarray(a).save(p)
print('dilate: filled', int(empty.sum()), 'empty texels of', empty.size)
