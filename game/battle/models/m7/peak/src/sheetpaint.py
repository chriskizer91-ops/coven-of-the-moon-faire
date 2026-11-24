# Painting a sculpt from its character sheet (Coven of the Moon Faire, the peak-creatures job, November 24, 2026).
# Chris, November 24: "...as well as using model painting in places where we already have images."
#
# The sheet's front, side and back views are laid onto the sculpt by position: each point of the sculpt looks itself up
# in the view that faces it most squarely, where that view can see it (a depth test against the sculpt itself, so a
# horn in front of the hair does not paint the hair). Where no view sees a point well (the top, the belly, between the
# legs, inside the mouth), the sculpt's own colours fill in, made from the sheet's palette. The bake then carries the
# painted colours onto the light model with everything else.
#
#   paint(V, F, C, sheet_png, S, views, skip=None, keep=0.12) -> new colours (n, 3)
#     V, F, C   the sculpt: points (x his right, y forward, z up, metres), triangles, its own colours 0..1
#     S         metres a sheet pixel
#     views     {'front': (centre px, ground py), 'side': (middle px, ground py), 'back': (centre px, ground py)}
#     skip      fn(rgb (n, 3) 0..255) -> bool: sheet pixels never to paint from (parts the sculpt does not have)
#     keep      how much of the sculpt's own colour stays everywhere (0..1)
import numpy as np
from PIL import Image
from scipy.ndimage import binary_erosion, maximum_filter

def normals(V, F):
    n = np.cross(V[F[:, 1]] - V[F[:, 0]], V[F[:, 2]] - V[F[:, 0]])
    N = np.zeros_like(V)
    for k in range(3): np.add.at(N, F[:, k], n)
    return N / np.maximum(np.linalg.norm(N, axis=1, keepdims=True), 1e-12)

def paint(V, F, C, sheet_png, S, views, skip=None, keep=0.12, tol=0.035, log=print):
    img = np.asarray(Image.open(sheet_png).convert('RGB')).astype(np.float32)
    Hh, Ww = img.shape[:2]
    bg = np.median(img[5:40, 5:40].reshape(-1, 3), 0)
    fig = np.abs(img - bg).sum(2) > 40
    fig = binary_erosion(fig, iterations=3)                 # not the figure's very edge (half background)
    if skip is not None: fig &= ~skip(img.reshape(-1, 3)).reshape(Hh, Ww)
    N = normals(V, F)
    acc = np.zeros((len(V), 3), np.float64); wsum = np.zeros(len(V), np.float64)
    def look(u, v, depth, want):
        """sheet colour at pixel (u, v) where the point is in front (depth: bigger is nearer the viewer)"""
        ui = np.round(u).astype(np.int64); vi = np.round(v).astype(np.int64)
        inside = (ui >= 0) & (ui < Ww) & (vi >= 0) & (vi < Hh) & (want > 1e-3)
        zb = np.full((Hh, Ww), -1e9, np.float32)
        np.maximum.at(zb, (vi[inside], ui[inside]), depth[inside])
        zb = maximum_filter(zb, size=3)
        ok = inside.copy()
        ok[inside] &= depth[inside] > zb[vi[inside], ui[inside]] - tol
        ok[inside] &= fig[vi[inside], ui[inside]]
        col = np.zeros((len(V), 3)); col[ok] = img[vi[ok], ui[ok]] / 255.0
        return col, ok
    x, y, z = V[:, 0], V[:, 1], V[:, 2]
    jobs = []
    fc, fg = views['front']; jobs.append(('front', fc - x / S, fg - z / S, y, np.clip(N[:, 1], 0, 1) ** 2))
    bc, bg_ = views['back']; jobs.append(('back', bc + x / S, bg_ - z / S, -y, np.clip(-N[:, 1], 0, 1) ** 2))
    sm, sg = views['side']
    for side in (1, -1):        # the sheet shows one side; the other is its mirror
        w = np.clip(side * N[:, 0], 0, 1) ** 2
        jobs.append(('side', sm + y / S, sg - z / S, side * x, w))
    for name, u, v, depth, w in jobs:
        col, ok = look(u, v, depth, w)
        w = w * ok
        acc += col * w[:, None]; wsum += w
        log(f'paint: {name} view paints {int((w > 0.25).sum())} points')
    own = keep + np.clip(N[:, 2], 0, 1) ** 2 * 0.6 + (wsum < 0.05) * 1.0      # the top and the unseen keep their own
    out = (acc + C * own[:, None]) / (wsum + own)[:, None]
    log(f'paint: {int((wsum > 0.25).sum())} of {len(V)} points painted from the sheet')
    return np.clip(out, 0, 1).astype(np.float32)
