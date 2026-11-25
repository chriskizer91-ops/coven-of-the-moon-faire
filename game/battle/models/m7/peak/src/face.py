# face.py: the Hoarmantle's face, sharp, straight from Chris's sheet (the peak-creatures job, November 24, 2026).
# Chris: "the face is very blurry, can you fix it". A baked colour picture gives the face only a few dozen pixels, so the
# face gets pictures of its own: the sheet's front view of the face, and its side view of the muzzle, each laid on a
# thin skin that follows the sculpt's own face (found by casting rays at the sculpt from the front and from each side).
# The eyes are small pieces of their own, at the sheet's eye places.
#
#   python3 face.py <sculpt high-N.npz> <sheet png> <out folder>   -> face.js (the skins and the eyes, as data),
#                                                                      face-front.webp, face-side.webp
import sys, os, json, numpy as np
from PIL import Image, ImageFilter
from scipy.spatial import cKDTree

S, GROUND, MID = 2.1 / 554, 788, 757           # the sheet's side view (as hoarmantle/src/sculpt.py)
FRONT_C = 200                                  # the front view's middle
FRONT = (128, 272, 418, 606)                   # the face in the front view: x0, x1, y0, y1 (sheet pixels)
SIDE = (1062, 1126, 455, 606)                  # the muzzle and eye in the side view (clear of the horn's tip)
SHEET_NOSE = 1120                              # the nose's tip in the side view
EYES = [(160, 494), (245, 494)]                # the eyes in the front view
LIFT = 0.006                                   # the skin stands this far off the sculpt (metres)

npz, sheet_png, out = sys.argv[1:4]
d = np.load(npz); V, F, K = d['V'], d['F'], d['K']
n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]]); N = np.zeros_like(V)
for k in range(3): np.add.at(N, F[:, k], n)
N /= np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-12)
body = (K == 0) & (V[:, 1] > (960 - MID) * S)
sheet = Image.open(sheet_png).convert('RGB')

def skin(points_uv, axis, sign, nmin):
    """cast a ray at the sculpt along `axis` from the `sign` side for each grid point; the nearest surface that faces it"""
    sel = body & (N[:, axis] * sign > nmin)
    P = V[sel]; other = [a for a in (0, 1, 2) if a != axis]
    tree = cKDTree(P[:, other])
    out_p, ok = [], []
    for q in points_uv:
        idx = tree.query_ball_point(q, 0.007)
        if not idx: out_p.append([0, 0, 0]); ok.append(False); continue
        j = idx[int(np.argmax(P[idx, axis] * sign))]
        p = P[j].copy(); p[axis] += sign * LIFT; out_p.append(p.tolist()); ok.append(True)
    return np.array(out_p), np.array(ok)

def grid(x0, x1, y0, y1, step):
    us = np.arange(x0, x1 + 0.01, step); vs = np.arange(y0, y1 + 0.01, step)
    return us, vs

def mesh(us, vs, P, ok, maxjump):
    nu = len(us); tris = []
    for i in range(len(vs) - 1):
        for j in range(nu - 1):
            a, b, c, e = i * nu + j, i * nu + j + 1, (i + 1) * nu + j + 1, (i + 1) * nu + j
            if ok[a] and ok[b] and ok[c] and ok[e]:
                q = P[[a, b, c, e]]
                if np.ptp(q, axis=0).max() < maxjump: tris += [[a, e, c], [a, c, b]]
    used = np.unique(np.array(tris)); remap = -np.ones(len(P), int); remap[used] = np.arange(len(used))
    return used, remap[np.array(tris)]

def picture(box, name):
    x0, x1, y0, y1 = box
    im = sheet.crop((x0, y0, x1 + 1, y1 + 1)).resize((512, int(512 * (y1 - y0 + 1) / (x1 - x0 + 1))), Image.LANCZOS)
    w, h = im.size
    # its edge fades out over 14% of its size, so the skin's border never shows
    yy, xx = np.mgrid[0:h, 0:w]; e = np.minimum(np.minimum(xx, w - 1 - xx) / (0.14 * w), np.minimum(yy, h - 1 - yy) / (0.14 * h))
    a = (np.clip(e, 0, 1) ** 1.5 * 255).astype(np.uint8)
    im.putalpha(Image.fromarray(a)); im.save(os.path.join(out, name), 'WEBP', quality=92, method=6)
    return w, h

data = {'pictures': {'front': './face-front.webp', 'side': './face-side.webp'}, 'skins': [], 'eyes': []}
# the front: rays from in front (+y), the face and the hair framing it
us, vs = grid(*FRONT, 3.0)
pts = [[(FRONT_C - u) * S, (GROUND - v) * S] for v in vs for u in us]
P, ok = skin(pts, 1, 1, 0.25)
used, T = mesh(us, vs, P, ok, 0.05)
uv = [[(u - FRONT[0]) / (FRONT[1] - FRONT[0]), (v - FRONT[2]) / (FRONT[3] - FRONT[2])] for v in vs for u in us]
data['skins'].append({'picture': 'front', 'p': np.round(P[used], 3).tolist(), 'uv': np.round(np.array(uv)[used], 3).tolist(), 't': T.tolist()})
picture(FRONT, 'face-front.webp')
# the sides: rays from each side (the sheet shows one; the other is its mirror), the muzzle and the eye
# the model's muzzle is a little longer than the sheet's: its side picture is stretched to fit, nose to nose
m = body & (np.abs(V[:, 0]) < 0.03) & (np.abs(V[:, 2] - (GROUND - 556) * S) < 0.03)
TIP = V[m, 1].max() / S + MID; kx = (TIP - SIDE[0]) / (SHEET_NOSE - SIDE[0]); print('face: model nose at', round(TIP), 'px, sheet', SHEET_NOSE)
for sgn in (1, -1):
    us, vs = grid(*SIDE, 3.0)
    pts = [[(SIDE[0] + (u - SIDE[0]) * kx - MID) * S, (GROUND - v) * S] for v in vs for u in us]
    P, ok = skin(pts, 0, sgn, 0.7)
    used, T = mesh(us, vs, P, ok, 0.05)
    if sgn < 0: T = T[:, ::-1]
    uv = [[(u - SIDE[0]) / (SIDE[1] - SIDE[0]), (v - SIDE[2]) / (SIDE[3] - SIDE[2])] for v in vs for u in us]
    data['skins'].append({'picture': 'side', 'p': np.round(P[used], 3).tolist(), 'uv': np.round(np.array(uv)[used], 3).tolist(), 't': T.tolist()})
picture(SIDE, 'face-side.webp')
# the eyes: where the front rays meet the face at the sheet's eye places, a little proud of it
for (u, v) in EYES:
    p, okk = skin([[(FRONT_C - u) * S, (GROUND - v) * S]], 1, 1, 0.1)
    if okk[0]: data['eyes'].append(np.round(p[0] + np.array([0, 0.004, 0]), 4).tolist())
with open(os.path.join(out, 'face.js'), 'w') as f:
    f.write('// face.js: the Hoarmantle\'s face skins and eyes (sculpt coordinates, metres), made by peak/src/face.py from the\n'
            '// sculpt and Chris\'s sheet. Read by peak/peak-foe.js. Pictures: face-front.webp, face-side.webp (from the sheet).\n')
    f.write('window.M7.kinds.hoarmantle.peak.face = ' + json.dumps(data, separators=(',', ':')) + ';\n')
print('face: skins', [len(s['t']) for s in data['skins']], 'triangles; eyes', len(data['eyes']))
