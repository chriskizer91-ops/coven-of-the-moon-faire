# The Wickstoat's rig (the peak-creatures job, November 24, 2026): Aethermoor M7's four-legged template with its helper
# joints, and a tail of four bones so the long tail can flick and curl. Measured off the sheet like sculpt.py.
# Sculpt coordinates (x his right, y forward, z up). Rigid ice (its nine spines) is not in this model: the page hangs
# each spine on one of these bones (wickstoat.js), so it can never bend.
import sys, os
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'kit', 'rigs'))
from quad import make

S = 1.6 / 982; GROUND = 694; MID = 748
def p(xo, px, py): return (xo * S, (px - MID) * S, (GROUND - py) * S)
LEGS = {   # shoulder/hip, elbow/stifle, wrist/hock (the paw runs on to the toes)
    'fl': [p(44, 1012, 540), p(44, 1002, 602), p(44, 1006, 652)],
    'fr': [p(-44, 994, 540), p(-44, 984, 602), p(-44, 988, 652)],
    'bl': [p(44, 606, 548), p(46, 590, 612), p(44, 588, 652)],
    'br': [p(-44, 588, 548), p(-46, 572, 612), p(-44, 570, 652)],
}
TAIL = [p(0, 532, 508), p(0, 470, 522), p(0, 380, 548), p(0, 300, 578), p(0, 262, 594)]
BONES, _weigh, _rigid = make(
    legs=LEGS, paw_len=0.05,
    hips=(p(0, 560, 520), p(0, 720, 515)), spine=(p(0, 720, 515), p(0, 900, 512)), chest=(p(0, 900, 512), p(0, 1040, 495)),
    neck=(p(0, 1040, 480), p(0, 1112, 400)), head=(p(0, 1112, 400), p(0, 1233, 389)),
    tail=(TAIL[0], TAIL[1]), tail_from=(560 - MID) * S, leg_top=(0.17, 0.24))
# the tail goes on in three more bones, each the child of the one before
BONES = list(BONES)
for i, (a, b) in enumerate([(TAIL[1], TAIL[2]), (TAIL[2], TAIL[3]), (TAIL[3], TAIL[4])]):
    BONES.append((f'tail{i + 2}', 'tail' if i == 0 else f'tail{i + 1}', a, b))

def is_helper(n): return n in ('neck_base', 'tail_root') or n.endswith(('_blade', '_haunch'))
TAILS = ('tail_root', 'tail', 'tail2', 'tail3', 'tail4')

REACH = {'upper': 0.07, 'lower': 0.05, 'paw': 0.06}
def weigh(D, P, idx):
    D = _weigh(D[:, :D.shape[1]], P, {k: v for k, v in idx.items()})
    x, y, z = P[:, 0], P[:, 1], P[:, 2]
    for n, i in idx.items():
        if n[:2] in ('fl', 'fr', 'bl', 'br') and not is_helper(n):      # a leg keeps to itself
            bn = BONES[i]; a2, b2 = np.array(bn[2][1:]), np.array(bn[3][1:]); ab = b2 - a2   # in the side view (y, z)
            t = np.clip(((P[:, 1:] - a2) @ ab) / max(float(ab @ ab), 1e-9), 0, 1)
            far = np.linalg.norm(P[:, 1:] - (a2 + t[:, None] * ab), axis=1) > REACH[n[3:]]
            far |= np.abs(np.abs(x) - abs(bn[3][0])) > 0.05                    # and across: not the belly between the legs
            D[:, i] += np.where((z > 0.27) | (np.abs(x) < 0.02) | far, 400.0, 0.0)
        if n.endswith(('_blade', '_haunch')):     # a blade or haunch: only the outside of the shoulder or thigh, never the belly
            D[:, i] += np.where((np.abs(x) < 0.04) | (z < 0.2), 400.0, 0.0)
    for n in TAILS:          # the tail's bones keep to the tail, the body's to the body
        if n in idx: D[:, idx[n]] += np.where(y > (540 - MID) * S, 1000.0, 0.0)
    for n in ('hips',):
        D[:, idx[n]] += np.where(y < (500 - MID) * S, 400.0, 0.0)
    for e in ('head',):      # the head's bone stays in the head
        D[:, idx[e]] += np.where(y < (1085 - MID) * S, 1000.0, 0.0)
    return D

def rigid(kind, P, idx):
    """eyes and whiskers ride on the head"""
    if kind in (2, 7, 8) and P[:, 1].mean() > (1100 - MID) * S: return 'head'
    return _rigid(kind, P, idx)

SMOOTH = 14
BANDS = {k + q: ((0.025, 0.06) if q == '_lower' else (0.012, 0.03) if q == '_paw' else (0.03, 0.08))
         for k in ('fl', 'fr', 'bl', 'br') for q in ('_upper', '_lower', '_paw')}
BANDS.update({'neck_base': (0.05, 0.12), 'neck': (0.04, 0.1), 'spine': (0.06, 0.16), 'chest': (0.06, 0.16),
              'tail': (0.06, 0.14), 'tail2': (0.06, 0.14), 'tail3': (0.06, 0.14), 'tail4': (0.05, 0.12)})
