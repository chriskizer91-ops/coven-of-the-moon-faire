# The Hoarmantle's rig (the peak-creatures job, November 24, 2026): Aethermoor M7's four-legged template with its helper
# joints, measured off the sheet like sculpt.py. Sculpt coordinates (x his right, y forward, z up).
# The legs stand in the hollow under the hair and own only what is in that hollow; the whole curtain belongs to the body,
# so the legs can walk under it with nothing stretching. The ice (helm, icicles) and the horns are rigid pieces.
import sys, os
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'kit', 'rigs'))
from quad import make

S = 2.1 / 554; GROUND = 788; MID = 757
def p(xo, px, py): return (xo * S, (px - MID) * S, (GROUND - py) * S)
LEGS = {   # elbow/stifle, knee/hock, fetlock (the paw runs to the hoof); the blade and haunch carry the top
    'fl': [p(95, 842, 610), p(95, 836, 690), p(95, 838, 752)],
    'fr': [p(-95, 804, 610), p(-95, 798, 690), p(-95, 800, 752)],
    'bl': [p(95, 548, 610), p(95, 556, 690), p(95, 552, 752)],
    'br': [p(-95, 508, 610), p(-95, 516, 690), p(-95, 512, 752)],
}
BONES, _weigh, _rigid = make(
    legs=LEGS, paw_len=0.08,
    hips=(p(0, 450, 440), p(0, 640, 420)), spine=(p(0, 640, 420), p(0, 800, 400)), chest=(p(0, 800, 400), p(0, 930, 430)),
    neck=(p(0, 930, 440), p(0, 1000, 500)), head=(p(0, 1000, 500), p(0, 1112, 552)), leg_top=(0.6, 0.8))

def is_helper(n): return n in ('neck_base', 'tail_root') or n.endswith(('_blade', '_haunch'))
HOLLOW = 0.78
def in_hollow(P):
    z = P[:, 2]; fr = (900 + 85 * (1 - np.clip((z - 0.35) / 0.25, 0, 1)) ** 2 - MID) * S; rear = (402 - MID) * S
    a = (186 - 72 * np.clip((z - 0.15) / 1.55, 0, 1) ** 0.8) * S - 0.16; b = (fr - rear) / 2 - 0.16
    u = np.abs(P[:, 0]) / a; v = np.abs(P[:, 1] - (fr + rear) / 2) / b
    return ((u ** 2.4 + v ** 2.4) < 1) & (z < HOLLOW + 0.05)

REACH = {'upper': 0.16, 'lower': 0.12, 'paw': 0.1}
def weigh(D, P, idx):
    D = _weigh(D, P, idx)
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    hol = in_hollow(P)
    for n, i in idx.items():
        if n[:2] in ('fl', 'fr', 'bl', 'br'):
            if is_helper(n): D[:, i] += np.where(hol, 0.0, 1000.0); continue     # the blades and haunches stay hidden
            bn = BONES[i]; a2, b2 = np.array(bn[2][:2]), np.array(bn[3][:2]); ab = b2 - a2
            t = np.clip(((P[:, :2] - a2) @ ab) / max(float(ab @ ab), 1e-9), 0, 1)
            far = np.linalg.norm(P[:, :2] - (a2 + t[:, None] * ab), axis=1) > REACH[n[3:]]
            D[:, i] += np.where(~hol | far, 1000.0, 0.0)                         # a leg is only what stands in the hollow
    for e in ('head',):
        D[:, idx[e]] += np.where(y < (975 - MID) * S, 1000.0, 0.0)
    for e in ('neck_base', 'neck'):
        D[:, idx[e]] += np.where((y < (900 - MID) * S) | (z < 0.62), 1000.0, 0.0)
    D[:, idx['head']] += np.where(z < 0.55, 1000.0, 0.0)
    return D

def rigid(kind, P, idx):
    """horns, helm and eyes ride on the head; every icicle on the body bone above it, never on a leg"""
    y, z = P[:, 1].mean(), P[:, 2].mean()
    if kind == 5 or (y > (960 - MID) * S and z > 0.55): return 'head'
    if y > (980 - MID) * S: return 'head'
    if y > (860 - MID) * S: return 'chest'
    if y > (640 - MID) * S: return 'spine'
    return 'hips'

SMOOTH = 16
BANDS = {k + q: ((0.06, 0.15) if q == '_lower' else (0.02, 0.05) if q == '_paw' else (0.07, 0.2))
         for k in ('fl', 'fr', 'bl', 'br') for q in ('_upper', '_lower', '_paw')}
BANDS.update({'neck_base': (0.12, 0.3), 'neck': (0.1, 0.25), 'spine': (0.2, 0.5), 'chest': (0.2, 0.5), 'head': (0.08, 0.2)})
