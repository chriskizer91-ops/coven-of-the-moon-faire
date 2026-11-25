# The Wickstoat, zone 4's light-thief (Coven of the Moon Faire, the peak-creatures job, November 24, 2026).
#   python3.12 kit/py/sculpt.py foes/wickstoat <level>        (Aethermoor M7's foe kit, run outside both repos)
#
# Chris's sheet (sheet-wickstoat.png, 1536 x 1024: front, side facing right, back): a lean white stoat of the high snow.
# A long low sinuous body, long neck, short strong legs; a small flat head with round ears set low, a dark nose and long
# whiskers; thick snow-white fur with blue-grey shadows; dark blue-grey paws; a long bushy tail with a black, frost-
# crusted tip; eyes solid dark, no glow. The nine ice spines down its back are NOT sculpted here: they are built in the
# page (wickstoat.js), clear ice with a spark in each that can be lit or dark one by one, which a baked picture cannot do.
#
# Measured off the sheet in its own pixels (side view: px forward, py down; front view: px across from its middle),
# at 1.6 m from nose to tail tip (the proposal's size). x his right, y forward, z up, metres, feet at z = 0.
import numpy as np

S = 1.6 / 982          # metres a sheet pixel: the side figure is 982 px from nose to tail tip
GROUND, MID = 694, 748
def p(xo, px, py): return np.array([xo * S, (px - MID) * S, (GROUND - py) * S], np.float32)
def r(*v): return np.array(v, np.float32) * S
def topx(P): return P[:, 0] / S, P[:, 1] / S + MID, GROUND - P[:, 2] / S

LEGS = {   # across px, then side-view joints: shoulder/hip, elbow/stifle, wrist/hock, paw
    'fl': [(44, 1012, 540), (44, 1002, 602), (44, 1006, 652), (44, 1022, 684)],
    'fr': [(-44, 994, 540), (-44, 984, 602), (-44, 988, 652), (-44, 1004, 684)],
    'bl': [(44, 606, 548), (46, 590, 612), (44, 588, 652), (44, 606, 684)],
    'br': [(-44, 588, 548), (-46, 572, 612), (-44, 570, 652), (-44, 588, 684)],
}
LEGS = {k: [p(*j) for j in v] for k, v in LEGS.items()}
EYES = [p(s * 24, 1186, 370) for s in (1, -1)]
NOSE = p(0, 1233, 389)
EARS = [p(s * 58, 1108, 352) for s in (1, -1)]
TAIL = [p(0, 532, 508), p(0, 470, 522), p(0, 380, 548), p(0, 300, 578), p(0, 262, 594)]

WHITE = np.array([0.95, 0.96, 0.98]); SHADOW = np.array([0.73, 0.81, 0.88]); DARK = np.array([0.165, 0.185, 0.23])
PAW = np.array([0.30, 0.34, 0.42]); EARIN = np.array([0.78, 0.70, 0.74]); FROST = np.array([0.86, 0.92, 0.97])

def build(K):
    Sd, G, LV, VOX, SIDES = K.sdf, K.geom, K.LV, K.VOX, K.SIDES
    smin, smax, ell, cap, fbm, mix, sstep = Sd.smin, Sd.smax, Sd.ell, Sd.cap, Sd.fbm, Sd.mix, Sd.sstep
    log = K.log; M = K.Mesh()

    def chain(P, pts, radii, k):
        d = None
        for i in range(len(pts) - 1):
            c = cap(P, pts[i], pts[i + 1], radii[i], radii[i + 1])
            d = c if d is None else smin(d, c, k)
        return d

    def head_sdf(P):
        h = ell(P, p(0, 1142, 368), r(52, 52, 40))                                     # skull: small, flat
        h = smin(h, cap(P, p(0, 1172, 378), p(0, 1222, 388), 27 * S, 13 * S), 0.012)    # short muzzle
        h = smin(h, ell(P, NOSE, r(9, 8, 7)), 0.004)                                   # nose
        h = smin(h, cap(P, p(0, 1150, 398), p(0, 1210, 403), 20 * S, 9 * S), 0.01)     # lower jaw
        for s in (1, -1):
            h = smin(h, ell(P, p(s * 33, 1148, 388), r(21, 27, 19)), 0.012)            # cheeks
            h = smax(h, -ell(P, EYES[0 if s > 0 else 1], r(8, 7, 6)), 0.003)           # eye sockets
        return h

    def ear_sdf(P):
        d = None
        for s, E in zip((1, -1), EARS):
            e = ell(P, E, r(12, 8, 20))                         # a round ear set low, standing up and out
            cup = ell(P, E + r(-s * 1, 5, 1), r(8, 4, 15))      # its hollow faces forward and out
            e = smax(e, -cup, 0.002)
            d = e if d is None else np.minimum(d, e)
        return d

    def body_sdf(P):
        d = ell(P, p(0, 800, 530), r(66, 262, 70))                                      # the long barrel
        d = smin(d, ell(P, p(0, 1030, 512), r(74, 74, 76)), 0.04)                      # chest, deep
        d = smin(d, ell(P, p(0, 612, 532), r(72, 78, 72)), 0.04)                       # haunches
        d = smin(d, cap(P, p(0, 1040, 470), p(0, 1118, 392), 56 * S, 46 * S), 0.03)   # the long neck
        d = smin(d, head_sdf(P), 0.025)
        d = smin(d, ear_sdf(P), 0.006)
        for k, J in LEGS.items():
            front = k[0] == 'f'
            d = smin(d, chain(P, J[:3], [30 * S, 24 * S, 19 * S] if front else [36 * S, 25 * S, 18 * S], 0.012), 0.03)
            d = smin(d, cap(P, J[2], J[3], 18 * S, 16 * S), 0.008)
            d = smin(d, ell(P, J[3] + r(0, 8, -3), r(17, 26, 9)), 0.008)              # the paw, long and flat
        d = smin(d, chain(P, TAIL, [36 * S, 34 * S, 32 * S, 27 * S, 12 * S], 0.02), 0.04)   # the long bushy tail
        return np.maximum(d, -P[:, 2])

    def zones(P):
        xo, sx, sy = topx(P)
        head = sstep(1090, 1120, sx) * (1 - sstep(420, 440, sy))
        face = head * sstep(1160, 1185, sx)
        ruff = np.exp(-(((sx - 1080) / 60) ** 2 + ((sy - 470) / 60) ** 2)) * (1 - head)
        legs = sstep(585, 615, sy)
        paws = sstep(664, 674, sy)
        tail = sstep(545, 525, sx)
        tip = sstep(395, 370, sx)
        ears = np.zeros(len(P))
        for E in EARS: ears = np.maximum(ears, np.exp(-np.sum(((P - E) / r(14, 12, 20)) ** 2, 1)))
        belly = sstep(575, 595, sy) * (1 - legs)
        return dict(head=head, face=face, ruff=ruff, legs=legs, paws=paws, tail=tail, tip=tip, ears=ears, belly=belly)

    def tuft_len(P):
        Z = zones(P)
        L = np.full(len(P), 0.11)
        L = mix(L, 0.12, Z['ruff']); L = mix(L, 0.11, Z['belly'])
        L = mix(L, 0.045, Z['legs']); L = mix(L, 0.016, Z['paws'])
        L = mix(L, 0.12, Z['tail'])
        L = mix(L, 0.03, Z['head']); L = mix(L, 0.016, Z['face']); L = mix(L, 0.012, Z['ears'])
        return L

    def flow(P, N):
        x = P[:, 0]; Z = zones(P)
        v = np.stack([0 * x, -np.ones_like(x), -0.25 + 0 * x], 1)                   # back along the body
        down = np.tile([0, -0.15, -1.0], (len(P), 1))
        w = np.maximum(Z['legs'], sstep(0.04, 0.09, np.abs(x)) * 0.35)
        v = v * (1 - w[:, None]) + down * w[:, None]
        tl = Z['tail'][:, None]
        tdir = np.tile([0, -1.0, -0.3], (len(P), 1))                                  # down the tail to its tip
        v = v * (1 - tl) + tdir * tl
        v = v + 0.12 * (np.stack([fbm(P * 14 + 3, 3.0), fbm(P * 14 + 7, 3.0), fbm(P * 14 + 11, 3.0)], 1) - 0.5)
        v = v - N * np.sum(v * N, 1, keepdims=True)
        return v / np.maximum(np.linalg.norm(v, axis=1, keepdims=True), 1e-6)

    def bare(P):
        b = P[:, 2] < 0.004
        b |= np.linalg.norm((P - NOSE) / r(14, 14, 12), axis=1) < 1
        for e in EYES: b |= np.linalg.norm((P - e) / r(11, 10, 9), axis=1) < 1
        for E in EARS: b |= np.linalg.norm((P - E) / r(12, 9, 19), axis=1) < 1
        b |= zones(P)['paws'] > 0.6
        return b

    def style(TP, TL, rng):
        n = len(TP); Z = zones(TP)
        W = TL * (0.40 + 0.08 * rng.random(n)); H = np.minimum(TL * (0.085 + 0.03 * rng.random(n)), 0.011)
        H = H * mix(1, 0.5, Z['face']) * mix(1, 1.4, Z['ruff']) * mix(1, 1.6, Z['tail'])
        C = mix(WHITE, SHADOW, (rng.random(n) ** 2 * 0.55)[:, None])
        under = np.clip((0.2 - TP[:, 2]) / 0.2, 0, 1) * (1 - Z['tail'])                 # blue-grey shadow low down
        C = mix(C, SHADOW, (under * 0.5)[:, None])
        tipc = mix(DARK, DARK * 1.4, rng.random(n)[:, None])
        C = mix(C, tipc, Z['tip'][:, None])
        C = mix(C, mix(PAW, WHITE, 0.25), (Z['paws'] * 0.8)[:, None])
        C = C * (0.94 + 0.08 * rng.random(n))[:, None]
        return dict(W=W, H=H, C=C)

    log('coat')
    coat = K.Coat(body_sdf, K.lo, K.hi, LV, VOX, tuft_len, flow, bare, style, seed=41, spacing=0.26, shape='lock',
                  sway=0.25, tip_soft=1.4, groove_depth=0.2, grooves=(2, 4), round_=0.7, log=log)
    full_sdf = coat.full_sdf
    log('body, voxel', VOX)
    Vb, Fb = Sd.mc(full_sdf, VOX, K.lo, K.hi, band=coat.HMAX + 0.01)
    log('body tris', len(Fb))
    col, top, has = coat.colours(Vb, np.tile(WHITE * 0.9, (len(Vb), 1)))
    Z = zones(Vb); xo, sx, sy = topx(Vb)
    col = mix(col, PAW * (0.85 + 0.3 * fbm(Vb * 120, 2.0))[:, None], (Z['paws'] * (~has | (Z['paws'] > 0.6)))[:, None])
    # the tail's tip: near-black, crusted with frost (pale flecks)
    fl = sstep(0.62, 0.7, fbm(Vb * 180 + 2, 2.0)) * Z['tip']
    col = mix(col, FROST, fl[:, None] * 0.85)
    nose = np.clip(1.4 - np.linalg.norm((Vb - NOSE) / r(12, 11, 10), axis=1), 0, 1)[:, None]
    col = mix(col, DARK, np.clip(nose * 1.6, 0, 1))
    lips = np.exp(-((sy - (401 + (sx - 1200) * 0.08)) / 2.5) ** 2) * (np.abs(xo) < 20) * (sx > 1185)
    col = mix(col, DARK * 1.6, lips[:, None] * 0.8)
    for E in EARS:
        inner = np.clip(1.2 - np.linalg.norm((Vb - E - r(0, 5, 1)) / r(10, 6, 14), axis=1), 0, 1)
        col = mix(col, EARIN, (inner * (~has))[:, None])
    col[has] = col[has] * 0.72 + (WHITE * 0.3) * (1 - Z['tip'][has, None]) + (DARK * 0.3) * Z['tip'][has, None]   # white fur: lift the roots
    M.add(Vb, Fb, np.clip(col, 0, 1), 0)

    # eyes: solid dark, like wet stones (a dull shine, no glow: kind 8, a rigid piece, not 7)
    for e in EYES:
        V, F = G.ellipsoid(e, r(7.5, 6.5, 6), {0: 6, 1: 8, 2: 12, 3: 16}[LV], {0: 10, 1: 14, 2: 20, 3: 28}[LV])
        M.add(V, F, np.array([0.07, 0.075, 0.09]), 8, mat=(0.3, 0.0))
    # whiskers: long, fine, pale; four a side, from the muzzle back and out
    rng = np.random.default_rng(5)
    for s in (1, -1):
        for i in range(4):
            a = p(s * 16, 1208 - i * 4, 390 + i * 3)
            d = np.array([s * (0.9 + 0.1 * i), -0.35 + 0.1 * i, -0.1 - 0.12 * i]); d /= np.linalg.norm(d)
            L = (70 + 10 * rng.random()) * S
            pts = np.array([a + d * L * u + np.array([0, -0.25, -0.2]) * L * u * u for u in np.linspace(0, 1, 6)])
            V, F = G.tube(pts, np.linspace(0.0011, 0.0004, 6), 4)
            M.add(V, F, np.array([0.92, 0.94, 0.97]), 8)
    if LV >= 1:          # painted from Chris's sheet by position (sheetpaint.py); never from the spines' ice and sparks
        import os, sheetpaint
        V, F, Cc, Kd = M.arrays()
        sheet = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', K.cfg['sheet'])
        def ice(rgb):
            r_, g_, b_ = rgb[:, 0], rgb[:, 1], rgb[:, 2]
            return ((b_ - r_ > 50) & (b_ > 150)) | (r_ - b_ > 50) | (rgb.mean(1) < 75)   # nor the eyes, nose, tail tip: the sculpt has them
        Cn = sheetpaint.paint(V, F, Cc, sheet, S, {'front': (140, GROUND), 'side': (MID, GROUND), 'back': (1400, GROUND + 2)}, skip=ice, log=log)
        o = 0
        for i, c in enumerate(M.C): M.C[i] = Cn[o:o + len(c)]; o += len(c)
    return M
