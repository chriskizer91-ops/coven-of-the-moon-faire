# The Hoarmantle, zone 4's big one (Coven of the Moon Faire, the peak-creatures job, November 24, 2026).
#   python3.12 kit/py/sculpt.py foes/hoarmantle <level>       (Aethermoor M7's foe kit, run outside both repos)
#
# Chris's sheet (sheet-hoarmantle.png, 1536 x 1024: front, side facing right, back): a great shaggy musk-ox of the
# peaks. A high hump, a low-hung head; a curtain of grey-blue hair to the ground hiding most of the legs, its ends hung
# with small icicles; a mantle of frost and packed snow over the hump and spine; two broad brown horns that sweep down
# beside the cheeks and curl forward, ringed with ice; a slab of pale blue ice across the brow like a helm; a dark
# short-muzzled face, small calm pale-blue eyes; wide dark hooves just showing. No flame, no glow.
#
# Measured off the sheet in its own pixels (side view: px forward, py down; front view: px across from its middle), at
# 2.1 m to the top of the snow on its hump (the proposal's size). x his right, y forward, z up, metres, feet at z = 0.
#
# The hair curtain is a hanging skirt round a hollow: the legs stand in the hollow, clear of the hair, so they can walk
# under it and nothing stretches (the hub's hard part: "the ox's hair curtain over walking legs").
import math
import numpy as np

S = 2.1 / 554
GROUND, MID = 788, 757
def p(xo, px, py): return np.array([xo * S, (px - MID) * S, (GROUND - py) * S], np.float32)
def r(*v): return np.array(v, np.float32) * S
def topx(P): return P[:, 0] / S, P[:, 1] / S + MID, GROUND - P[:, 2] / S

LEGS = {   # across px, then side-view joints: shoulder/hip, elbow/stifle, knee/hock, fetlock, hoof
    'fl': [(92, 850, 520), (95, 842, 610), (95, 836, 690), (95, 838, 752), (95, 842, 776)],
    'fr': [(-92, 812, 520), (-95, 804, 610), (-95, 798, 690), (-95, 800, 752), (-95, 804, 776)],
    'bl': [(92, 560, 520), (95, 548, 610), (95, 556, 690), (95, 552, 752), (95, 556, 776)],
    'br': [(-92, 520, 520), (-95, 508, 610), (-95, 516, 690), (-95, 512, 752), (-95, 516, 776)],
}
LEGS = {k: [p(*j) for j in v] for k, v in LEGS.items()}
EYES = [p(s * 42, 1046, 492) for s in (1, -1)]
NOSE = p(0, 1110, 552)
def REAR(z):                       # the curtain's back: 402 px low down, rounding forward over the rump
    return (402 + 70 * np.clip((z - 0.75) / 0.4, 0, 1) ** 2 - MID) * S
def FRONT(z):                      # its front: under the chin (1070 px) low down; behind the horns (900 px) higher up
    return (900 + 85 * (1 - np.clip((z - 0.35) / 0.25, 0, 1)) ** 2 - MID) * S
SKIRT_C = (735 - MID) * S          # (the middle, for the hem's pattern)
HOLLOW_TOP = 0.78                  # how high the hollow under the hair reaches (the belly)

WOOL = np.array([0.56, 0.62, 0.70]); WOOL2 = np.array([0.80, 0.84, 0.89]); FROSTW = np.array([0.87, 0.91, 0.94])
HIDE = np.array([0.23, 0.25, 0.28]); HORN = np.array([0.47, 0.38, 0.30]); HORN2 = np.array([0.62, 0.53, 0.43])
ICE = np.array([0.66, 0.85, 0.93]); ICE2 = np.array([0.82, 0.93, 0.97]); HOOF = np.array([0.17, 0.17, 0.19])
EYE = np.array([0.62, 0.80, 0.90])

def build(K):
    Sd, G, LV, VOX, SIDES, SEG = K.sdf, K.geom, K.LV, K.VOX, K.SIDES, K.SEG
    smin, smax, ell, cap, fbm, vnoise, mix, sstep, tri = Sd.smin, Sd.smax, Sd.ell, Sd.cap, Sd.fbm, Sd.vnoise, Sd.mix, Sd.sstep, Sd.tri
    log = K.log; M = K.Mesh()
    from scipy.spatial import ConvexHull
    from parts import Blobs

    def chain(P, pts, radii, k):
        d = None
        for i in range(len(pts) - 1):
            c = cap(P, pts[i], pts[i + 1], radii[i], radii[i + 1])
            d = c if d is None else smin(d, c, k)
        return d

    def half_w(z):          # the curtain's half width (front view): 130 px under the hump, 178 px at the hem
        return (186 - 72 * np.clip((z - 0.15) / 1.55, 0, 1) ** 0.8) * S
    def plan(P, inset=0.0):
        """the curtain's footprint: a rounded oval, its front set back behind the head higher up, inset by `inset` m"""
        fr = FRONT(P[:, 2]); rr = REAR(P[:, 2]); c = (fr + rr) / 2
        a = half_w(P[:, 2]) - inset; b = (fr - rr) / 2 - inset
        u = np.abs(P[:, 0]) / a; v = np.abs(P[:, 1] - c) / b
        q = (u ** 2.4 + v ** 2.4) ** (1 / 2.4)
        return (q - 1) * np.minimum(a, b)
    def hem(P):
        """the bottom of the hair: pointed locks hanging down, between 7 and 19 cm off the ground"""
        th = np.arctan2(P[:, 1] - SKIRT_C, P[:, 0] * 1.6)
        n = vnoise(P * np.array([3, 3, 0], np.float32) + 4, 1.0)
        return 0.06 + 0.16 * np.abs(np.sin(th * 19 + 3 * n)) ** 0.7

    def head_sdf(P):
        h = ell(P, p(0, 1040, 520), r(58, 66, 62))                                    # skull
        h = smin(h, cap(P, p(0, 1062, 540), p(0, 1100, 556), 50 * S, 40 * S), 0.04)    # broad short muzzle
        h = smin(h, ell(P, NOSE, r(34, 20, 24)), 0.02)                                 # the nose pad
        for s in (1, -1):
            h = smax(h, -ell(P, EYES[0 if s > 0 else 1], r(8, 7, 6)), 0.008)          # small eye sockets
        return h

    def base_sdf(P):
        """the body under its snow: the hump, the back, the rump, the curtain, the head"""
        d = ell(P, p(0, 830, 345), r(112, 150, 115))                                   # the hump, high
        d = smin(d, ell(P, p(0, 640, 395), r(122, 180, 115)), 0.14)                   # the back
        d = smin(d, ell(P, p(0, 500, 470), r(125, 90, 120)), 0.14)                    # the rump
        d = smin(d, cap(P, p(0, 900, 420), p(0, 1010, 505), 100 * S, 70 * S), 0.12)    # the neck, down to the head
        top = d
        # the curtain hangs from the back to the hem: its footprint, above the hem, below the back's shoulders
        sk = np.maximum(plan(P), hem(P) - P[:, 2])
        sk = np.maximum(sk, P[:, 2] - 1.15)
        d = smin(top, sk, 0.25)
        d = smin(d, head_sdf(P), 0.07)
        # the beard under the head, hanging to 0.35 m
        # the hollow under the hair, where the legs stand (never seen from the side)
        hol = np.maximum(plan(P, 0.13), P[:, 2] - HOLLOW_TOP)
        d = smax(d, -hol, 0.04)
        for k, J in LEGS.items():
            d = smin(d, chain(P, J[1:5], [36 * S, 30 * S, 26 * S, 27 * S], 0.02), 0.03)
            d = smin(d, ell(P, J[4] + r(0, 16, -2), r(34, 30, 14)), 0.015)            # the hoof, wide
        return np.maximum(d, -P[:, 2])

    # ---- the mantle of snow: lumps laid in shelves over the hump and the spine (the same at every level) ----
    log('snow')
    Vc, Fc = Sd.mc(base_sdf, 0.04, K.lo, K.hi)
    srng = np.random.default_rng(23)
    SP = G.sample_surface(Vc, Fc, 60000, srng)
    SP, SN = Sd.project(SP, base_sdf)
    xo, sx, sy = topx(SP)
    # the snow line: down to py 470 at the rump, 430 at the withers, high on the head's side
    line = np.interp(sx, [400, 500, 700, 900, 1000, 1080], [500, 480, 440, 430, 420, 300])
    ok = (SN[:, 2] > 0.3) & (sy < line) & (sx < 1010)
    C = SP[ok]
    C = C[srng.permutation(len(C))]
    keep = []; from scipy.spatial import cKDTree
    t = cKDTree(C); used = np.zeros(len(C), bool)
    for i in range(len(C)):
        if used[i]: continue
        keep.append(i); used[t.query_ball_point(C[i], 0.06)] = True
    C = C[keep]
    R = (0.04 + 0.035 * srng.random(len(C))) * (0.7 + 0.5 * np.clip(C[:, 2] / 2.0, 0, 1))
    # the shelves: each lump hangs a little below its own place, so the mantle lies in tiers
    C = C + np.array([0, 0, -0.02], np.float32) + SN[ok][keep] * (R * 0.25)[:, None]
    FLAT = np.array([1.0, 1.0, 1.7], np.float32)
    _snow = Blobs(C * FLAT, R, k=0.02)
    def snow(P): return _snow(P * FLAT) / 1.3      # lumps flattened into shelves (measured in a squashed space)
    log('snow lumps', len(C))
    def snow_fine(P):
        if LV < 2: return 0
        return 0.006 * (fbm(P * 1.0, 22.0) - 0.5) + 0.003 * (vnoise(P, 90.0) - 0.5)
    def body_sdf(P):
        return smin(base_sdf(P), snow(P), 0.03)
    def is_snow(P):
        return snow(P) < base_sdf(P) + 0.004

    def zones(P):
        xo, sx, sy = topx(P)
        head = sstep(975, 1005, sx) * (1 - sstep(600, 640, sy))
        face = head * sstep(1000, 1030, sx) * (1 - sstep(590, 600, sy))
        legs = sstep(GROUND - HOLLOW_TOP / S + 10, GROUND - HOLLOW_TOP / S + 40, sy) * (plan(P, 0.12) < 0)
        hooves = sstep(758, 764, sy)
        curtain = sstep(470, 560, sy) * (1 - legs)
        return dict(head=head, face=face, legs=legs, hooves=hooves, curtain=curtain)

    def tuft_len(P):
        Z = zones(P)
        L = np.full(len(P), 0.30)
        L = mix(L, 0.6, Z['curtain'])
        L = mix(L, 0.10, Z['head']); L = mix(L, 0.05, Z['face'])
        L = mix(L, 0.06, Z['legs'])
        return L

    def flow(P, N):
        x = P[:, 0]; Z = zones(P)
        v = np.tile([0, -0.1, -1.0], (len(P), 1))                                  # the hair hangs straight down
        hd = (Z['head'] * (1 - Z['face']))[:, None]
        v = v * (1 - hd) + np.stack([np.sign(x) * 0.3, -np.ones_like(x), -0.6 + 0 * x], 1) * hd
        v = v + 0.10 * (np.stack([fbm(P * 4 + 3, 3.0), fbm(P * 4 + 7, 3.0), fbm(P * 4 + 11, 3.0)], 1) - 0.5)
        v = v - N * np.sum(v * N, 1, keepdims=True)
        return v / np.maximum(np.linalg.norm(v, axis=1, keepdims=True), 1e-6)

    def bare(P):
        b = P[:, 2] < 0.004
        b |= is_snow(P)
        Z = zones(P)
        b |= Z['face'] > 0.5
        b |= Z['hooves'] > 0.5
        b |= Z['legs'] > 0.5
        return b

    def style(TP, TL, rng):
        n = len(TP); Z = zones(TP)
        W = TL * (0.30 + 0.08 * rng.random(n)); H = np.minimum(TL * (0.08 + 0.03 * rng.random(n)), 0.055)
        H = H * (0.35 + 0.65 * sstep(0.12, 0.55, TP[:, 2]))          # thinning toward the hem: no ledge where the locks end
        C = mix(WOOL, WOOL2, rng.random(n)[:, None] ** 1.5)
        hi = np.clip((TP[:, 2] - 1.0) / 0.8, 0, 1)                                    # paler, frostier up high
        C = mix(C, FROSTW, (hi * 0.4 * rng.random(n))[:, None])
        C = mix(C, mix(WOOL, HIDE, 0.35), (Z['head'] * 0.25)[:, None])
        C = C * (0.92 + 0.12 * rng.random(n))[:, None]
        return dict(W=W, H=H, C=C)

    log('coat')
    coat = K.Coat(body_sdf, K.lo, K.hi, LV, VOX, tuft_len, flow, bare, style, seed=57, spacing=0.22, shape='lock',
                  sway=0.2, tip_soft=1.3, groove_depth=0.26, grooves=(3, 6), round_=0.6, log=log)
    def full(P):
        d = coat.full_sdf(P)
        sn = np.clip((base_sdf(P) - snow(P)) / 0.01, 0, 1)
        return d + sn * snow_fine(P) if LV >= 2 else d
    log('body, voxel', VOX)
    Vb, Fb = Sd.mc(full, VOX, K.lo, K.hi, band=coat.HMAX + 0.03)
    log('body tris', len(Fb))
    col, top, has = coat.colours(Vb, np.tile(mix(WOOL, HIDE, 0.6), (len(Vb), 1)))
    Z = zones(Vb); xo, sx, sy = topx(Vb)
    sn = is_snow(Vb)
    sc = mix(np.array([0.93, 0.95, 0.97]), np.array([0.80, 0.86, 0.92]), np.clip(fbm(Vb * 7 + 1, 2.0) * 1.4 - 0.3, 0, 1)[:, None])
    col[sn] = sc[sn]
    col = mix(col, HIDE * (0.85 + 0.3 * fbm(Vb * 30, 2.0))[:, None], (Z['face'] * (~has))[:, None])
    col = mix(col, mix(HIDE, WOOL, 0.3), (Z['legs'] * (~has) * (1 - Z['hooves']))[:, None])
    col = mix(col, HOOF, Z['hooves'][:, None])
    nose = np.clip(1.4 - np.linalg.norm((Vb - NOSE) / r(30, 18, 22), axis=1), 0, 1)[:, None]
    col = mix(col, HIDE * 0.55, np.clip(nose * 1.4, 0, 1))
    lips = np.exp(-((sy - 580) / 3) ** 2) * (np.abs(xo) < 30) * (sx > 1060)
    col = mix(col, HIDE * 0.5, lips[:, None])
    M.add(Vb, Fb, np.clip(col, 0, 1), 0)

    # ---- the horns: broad at the root, sweeping down past the cheeks, curling forward; ringed with ice ----
    log('horns')
    def curve(pts, n):
        pts = np.asarray(pts, float)
        L_ = np.r_[0, np.cumsum(np.linalg.norm(np.diff(pts, axis=0), axis=1))]
        s_ = np.linspace(0, L_[-1], n)
        return np.stack([np.interp(s_, L_, pts[:, i]) for i in range(3)], 1)
    hrng = np.random.default_rng(9)
    ICICLES = []           # (base, length, radius) gathered here and below, made at the end
    for s in (1, -1):
        c = curve([p(s * 55, 995, 462), p(s * 100, 960, 468), p(s * 132, 915, 505), p(s * 138, 905, 560),
                   p(s * 126, 930, 605), p(s * 100, 985, 612), p(s * 78, 1030, 590), p(s * 66, 1052, 562)],
                  {0: 14, 1: 20, 2: 36, 3: 52}[LV])
        u = np.linspace(0, 1, len(c))
        rad = (24 * (1 - u) ** 0.85 + 3) * S
        V, F = G.tube(c, rad, max(7, SIDES + 2), ridges=10 if LV >= 2 else 0, ridge_amp=0.06)
        # colour: brown, paler toward the tip; rings of ice at intervals
        t_ = np.argmin(np.linalg.norm(V[:, None, :] - c[None, ::max(1, len(c) // 24), :], axis=2), 1) * max(1, len(c) // 24) / (len(c) - 1)
        cc = mix(HORN, HORN2, np.clip(t_ * 1.2, 0, 1)[:, None])
        ring = (np.abs(np.sin(t_ * math.pi * 7 + 0.5)) > 0.86) & (t_ < 0.85)
        cc[ring] = ICE2
        M.add(V, F, np.clip(cc, 0, 1), 5, mat=(0.5, 0.0))
        for q in (0.35, 0.5, 0.62, 0.74):
            j = int(q * (len(c) - 1)); ICICLES.append((c[j] - np.array([0, 0, rad[j] * 0.9]), 0.05 + 0.04 * hrng.random(), 0.012))

    # ---- the helm: a slab of pale blue ice across the brow, cut in facets, pointed down between the eyes ----
    log('helm')
    hr = np.random.default_rng(13)
    chunks = []
    for (ax, px_, py_, w_, h_, d_) in [(0, 1035, 455, 70, 34, 60), (40, 1015, 448, 46, 30, 55), (-40, 1015, 448, 46, 30, 55),
                                      (68, 985, 445, 34, 26, 48), (-68, 985, 445, 34, 26, 48), (0, 1078, 482, 36, 30, 22),
                                      (22, 1070, 470, 30, 24, 26), (-22, 1070, 470, 30, 24, 26), (0, 990, 430, 60, 26, 40)]:
        c0 = p(ax, px_, py_)
        pts = c0 + (hr.random((14, 3)) - 0.5) * r(w_, d_, h_) * 2
        if px_ > 1060: pts = np.vstack([pts, p(ax * 0.5, 1098, 494)])            # the point down the brow
        hull = ConvexHull(pts)
        F = hull.simplices.copy()
        cen = pts.mean(0)
        for i, f in enumerate(F):          # wind each facet outward
            n_ = np.cross(pts[f[1]] - pts[f[0]], pts[f[2]] - pts[f[0]])
            if n_ @ (pts[f[0]] - cen) < 0: F[i] = f[[0, 2, 1]]
        chunks.append((pts, F))
    for pts, F in chunks:
        cc = mix(ICE, ICE2, hr.random(len(pts))[:, None])
        M.add(pts, F, cc, 8, mat=(0.15, 0.0))

    # ---- eyes: small, calm, pale blue ----
    for e in EYES:
        V, F = G.ellipsoid(e, r(7, 6, 5.5), {0: 6, 1: 8, 2: 12, 3: 16}[LV], {0: 10, 1: 14, 2: 20, 3: 28}[LV])
        cc = np.tile(EYE, (len(V), 1)); cc[np.linalg.norm((V - e) / r(7, 6, 5.5) - np.array([0, 1, 0]), axis=1) < 0.55] = [0.05, 0.06, 0.08]
        M.add(V, F, cc, 8, mat=(0.2, 0.0))

    # ---- icicles: on the hair's ends round the hem, under the snow's shelves, under the horns ----
    log('icicles')
    ir = np.random.default_rng(31)
    # round the hem: on the curtain's surface, a little above its lowest points
    a_ = np.linspace(-math.pi, math.pi, 64, endpoint=False) + ir.random(64) * 0.05
    for th in a_:
        dx, dy = math.sin(th), math.cos(th)
        # walk out from the middle until outside the curtain, at a height just above the hem
        for z0 in (0.24, 0.5):
            if z0 == 0.5 and ir.random() < 0.55: continue
            Pp = np.array([[0, SKIRT_C, z0]], np.float32)
            for step in np.linspace(0.2, 1.8, 160):
                Pp = np.array([[dx * step * 0.62, SKIRT_C + dy * step * 335 * S * 0.95, z0]], np.float32)
                if base_sdf(Pp)[0] > 0: break
            ICICLES.append((Pp[0] - np.array([dx, dy, 0]) * 0.03, 0.06 + 0.09 * ir.random(), 0.010 + 0.005 * ir.random()))
    # under the snow's shelves, on the sides
    for c in C[ir.permutation(len(C))[:28]]:
        if abs(c[0]) < 0.25: continue
        ICICLES.append((c - np.array([0, 0, 0.05]), 0.05 + 0.06 * ir.random(), 0.009))
    for base, L, rr in ICICLES:
        V, F = G.horn(np.asarray(base, float), [0, 0, -1], L, rr, None, 0.0, max(3, SEG - 1), max(5, SIDES - 1), tipR=0.001, power=1.1)
        t_ = np.clip((base[2] - V[:, 2]) / L, 0, 1)[:, None]
        M.add(V, F, np.clip(mix(ICE2, ICE, t_), 0, 1), 8, mat=(0.15, 0.0))
    if LV >= 1:          # painted from Chris's sheet by position (sheetpaint.py)
        import os, sheetpaint
        V, F, Cc, Kd = M.arrays()
        sheet = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', '..', '..', K.cfg['sheet'])
        Cn = sheetpaint.paint(V, F, Cc, sheet, S, {'front': (200, GROUND), 'side': (MID, GROUND), 'back': (1331, 786)}, log=log)
        o = 0
        for i, c in enumerate(M.C): M.C[i] = Cn[o:o + len(c)]; o += len(c)
    return M
