#!/usr/bin/env python3
"""narrator-sound.py: the narrator's recordings: taking them in, and giving them their own sound.
    python3 tools/narrator-sound.py take <folder> [--skip id,id]   copy unpacked recordings (<folder>/z1/*.mp3 ...) into
                                                                   game/people/recording/narrator-raw/, as they came
    python3 tools/narrator-sound.py render A|B|C|D                 make game/talk/audio/zN/zN.narrator.NN.mp3 from the raw ones
    python3 tools/narrator-sound.py samples                        make the four ways of two lines, for the listening page
The four ways (the people's voices are left as they are: one voice, in the middle):
    A  as recorded
    B  close and warm: more body low down, a little less hiss up top, evened out; still in the middle
    C  by the fire: B, in a small warm room (a short soft echo, a little different in each ear)
    D  all round you: C, with the voice spread wide to both ears
Each is brought back to the same loudness as the people's voices, with its peaks under -1 dB. C and D are
two-channel files; on one small speaker (a phone's) the two channels are added, so the check also measures that sum.
Nobody here can hear them: the choice is Chris's, by ear. It also writes each line's real length into narration.js."""
import sys, os, re, json, glob, shutil, subprocess
import numpy as np
from scipy import signal
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'); SR = 44100
TARGET = -15.0
RAW = os.path.join(root, 'game/people/recording/narrator-raw'); OUT = os.path.join(root, 'game/talk/audio'); LISTEN = os.path.join(root, 'game/people/listen')
WARM = 'highpass=f=70,bass=g=3:f=170:w=0.6,equalizer=f=3000:t=q:w=0.9:g=1.5,treble=g=-1.5:f=9000,acompressor=threshold=0.063:ratio=2.2:attack=8:release=150:makeup=1.3'
def decode(f, af=None):
    cmd = ['ffmpeg', '-v', 'error', '-i', f] + (['-af', af] if af else []) + ['-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, dtype=np.float32).astype(np.float64)
def room(seed, rt60=0.42, pre=0.014, n=0.6):
    """a small warm room, as what one clap would sound like in it: a few first echoes, then a soft dying wash"""
    r = np.random.default_rng(seed); t = np.arange(int(n * SR)) / SR; ir = r.standard_normal(len(t)) * np.exp(-6.91 * t / rt60)
    ir = signal.sosfilt(signal.butter(2, [220, 4200], 'bandpass', fs=SR, output='sos'), ir); out = np.zeros(int(pre * SR) + len(ir)); out[int(pre * SR):] = ir * 0.5
    for d, g in zip(r.uniform(0.009, 0.036, 5), [0.5, 0.42, 0.35, 0.28, 0.22]): out[int(d * SR)] += g * r.choice([-1, 1])
    return out / np.sqrt(np.sum(out ** 2))
def spread(seed, n=0.028):
    """a 28 ms smear of the voice, sent to the two ears with opposite sign: it widens the voice, and adds to nothing on one speaker"""
    r = np.random.default_rng(seed); s = r.standard_normal(int(n * SR)) * np.hanning(int(n * SR)); s = signal.sosfilt(signal.butter(2, 320, 'highpass', fs=SR, output='sos'), s)
    return s / np.sqrt(np.sum(s ** 2))
IRL, IRR, SIDE = room(11), room(23), spread(5)
db = lambda x: 10 ** (x / 20)
def look(f, way):
    if way == 'A': x = decode(f); return np.stack([x, x])
    x = decode(f, WARM)
    if way == 'B': return np.stack([x, x])
    x = np.concatenate([x, np.zeros(int(0.45 * SR))])                       # room for the echo to die away
    wl = signal.fftconvolve(x, IRL)[:len(x)]; wr = signal.fftconvolve(x, IRR)[:len(x)]
    g = db(-15.5 if way == 'C' else -14); L = x + g * wl; R = x + g * wr
    if way == 'D': s = signal.fftconvolve(x, SIDE)[:len(x)] * db(-7.5); L = L + s; R = R - s
    return np.stack([L, R])
def lufs(y):
    p = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-f', 'f32le', '-ar', str(SR), '-ac', str(y.shape[0]), '-i', '-', '-af', 'ebur128=peak=true', '-f', 'null', '-'], input=y.T.astype(np.float32).tobytes(), capture_output=True).stderr.decode()
    return float(re.findall(r'I:\s+(-?[\d.]+) LUFS', p)[-1]), float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', p)[-1])
def limit(y):
    """the few highest peaks are held under -1 dB, the rest left alone (so a line need not be turned down for one peak)"""
    out = subprocess.run(['ffmpeg', '-v', 'error', '-f', 'f32le', '-ar', str(SR), '-ac', '2', '-i', '-', '-af', 'alimiter=limit=0.87:attack=2:release=40:level=disabled', '-f', 'f32le', '-ac', '2', '-'], input=y.T.astype(np.float32).tobytes(), capture_output=True, check=True).stdout
    return np.frombuffer(out, dtype=np.float32).astype(np.float64).reshape(-1, 2).T
def write(y, dst, way):
    # (the people's voices are one-channel files at -18 LUFS. Played on two speakers that is the same as a two-channel
    # file at -15, so -15 is the mark here; on one speaker the sum is then measured as one channel, to compare with -18)
    for _ in range(3): I, pk = lufs(y); y = limit(y * db(TARGET - I))
    I2, pk2 = lufs(y); mono = ((y[0] + y[1]) / 2)[None, :]; Im, _ = lufs(mono)
    two = way in 'CD'; os.makedirs(os.path.dirname(dst), exist_ok=True); pcm = y if two else mono
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-f', 'f32le', '-ar', str(SR), '-ac', str(pcm.shape[0]), '-i', '-', '-c:a', 'libmp3lame', '-b:a', '96k' if two else '64k', dst], input=pcm.T.astype(np.float32).tobytes(), check=True)
    return dict(I=I2, pk=pk2, mono=Im, secs=y.shape[1] / SR, kb=os.path.getsize(dst) / 1000)
def raws(): return sorted(glob.glob(os.path.join(RAW, 'z*', '*.mp3')))
if len(sys.argv) < 2: print(__doc__); sys.exit(1)
if sys.argv[1] == 'take':
    src = sys.argv[2]; skip = set(sys.argv[sys.argv.index('--skip') + 1].split(',')) if '--skip' in sys.argv else set(); n = 0
    for f in sorted(glob.glob(os.path.join(src, 'z*', 'z*.narrator.*.mp3'))):
        i = os.path.basename(f)[:-4]; z = i.split('.')[0]
        if i in skip: print('  left out (its words have changed since): ' + i); continue
        os.makedirs(os.path.join(RAW, z), exist_ok=True); shutil.copyfile(f, os.path.join(RAW, z, i + '.mp3')); n += 1
    print('%d recordings taken in, as they came' % n)
elif sys.argv[1] == 'render':
    way = sys.argv[2]; rows = []
    for f in raws():
        i = os.path.basename(f)[:-4]; z = i.split('.')[0]; dst = os.path.join(OUT, z, i + '.mp3')
        if way == 'A': y = look(f, 'A'); I, pk = lufs(y); Im, _ = lufs(y[:1]); shutil.copyfile(f, dst); rows.append((i, dict(I=I, pk=pk, mono=Im, secs=y.shape[1] / SR, kb=os.path.getsize(dst) / 1000)))   # as recorded: the file itself, untouched
        else: rows.append((i, write(look(f, way), dst, way)))
    I = [r['I'] for _, r in rows]; print('%d lines made the way %s: on two speakers %.1f LUFS on average (from %.1f to %.1f; the people are at -15.0); loudest peak %.1f dB; on one speaker %.1f LUFS on average (lowest %.1f; the people are at -18.0); %.1f MB' % (len(rows), way, np.mean(I), min(I), max(I), max(r['pk'] for _, r in rows), np.mean([r['mono'] for _, r in rows]), min(r['mono'] for _, r in rows), sum(r['kb'] for _, r in rows) / 1000))
    # each line's real length, into narration.js
    p = os.path.join(root, 'game/people/narration.js'); s = open(p, encoding='utf8').read(); k = 0
    for i, r in rows:
        s2 = re.sub(r"(\{ id: '%s', at: '[^']+', secs: )[\d.]+" % re.escape(i), lambda m: m.group(1) + '%.1f' % r['secs'], s); k += s2 != s; s = s2
    open(p, 'w', encoding='utf8').write(s); print('%d lines\' lengths written into narration.js' % k)
elif sys.argv[1] == 'samples':
    for i in sys.argv[2:] or ['z1.narrator.01', 'z2.narrator.03']:
        f = os.path.join(RAW, i.split('.')[0], i + '.mp3')
        for way in 'ABCD': r = write(look(f, way), os.path.join(LISTEN, '%s.%s.mp3' % (i, way)), way); print('  %s %s: on two speakers %.1f LUFS (people -15.0), peak %.1f dB, on one speaker %.1f LUFS (people -18.0), %.1f s, %d kB' % (i, way, r['I'], r['pk'], r['mono'], r['secs'], r['kb']))
