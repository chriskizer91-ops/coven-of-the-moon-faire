# the outline overlap (shared area / joined area) of the model's renders and the sheet's figures, at the sheet's own
# scale, with each silhouette's holes filled (M7's sheet.py counts grey spots inside the figure as background)
import sys, json, numpy as np
from PIL import Image
from scipy.ndimage import binary_fill_holes
foe, LV = sys.argv[1], sys.argv[2]; cfg = json.load(open(foe + '/foe.json'))
sheet = np.asarray(Image.open(foe + '/../../../../' + cfg['sheet']).convert('RGB')).astype(int)
def msk(a, bg, t): return binary_fill_holes(np.abs(a - bg).sum(2) > t)
def crop(m): ys, xs = np.nonzero(m); return m[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
out = []
for i, v in enumerate(('front', 'side', 'back')):
    a0, a1 = cfg['crops'][i]; s = sheet[:, a0:a1]
    sm = crop(msk(s, np.median(s[:20].reshape(-1, 3), 0), 40)); ppm = sm.shape[0] / cfg['height']
    r = np.asarray(Image.open(f'{foe}/build/render-{LV}-{v}.png').convert('RGB')).astype(int)
    rm = crop(msk(r, r[5, 5], 25)); k = ppm / (r.shape[1] / cfg['view']['width'])
    rm = np.asarray(Image.fromarray(rm.astype(np.uint8) * 255).resize((int(rm.shape[1] * k), int(rm.shape[0] * k)))) > 127
    H = max(sm.shape[0], rm.shape[0]); W = max(sm.shape[1], rm.shape[1]); A = np.zeros((H, W), bool); B = A.copy()
    A[H - sm.shape[0]:, (W - sm.shape[1]) // 2:(W - sm.shape[1]) // 2 + sm.shape[1]] = sm
    B[H - rm.shape[0]:, (W - rm.shape[1]) // 2:(W - rm.shape[1]) // 2 + rm.shape[1]] = rm
    out.append(f'{v} {(A & B).sum() / (A | B).sum():.3f}')
print('outline overlap (holes filled):', ', '.join(out))
