#!/usr/bin/env python3
"""left-overs-weigh.py: what a built page is made of, by weight (the left-overs job, November 25, 2026). It changes nothing.

    python3 tools/left-overs-weigh.py builds/zone-1.html [--json out.json]

It reads the built page as text and splits it by the file each part came from (the builder writes /* path */ at the
top of every script it puts in). In each part it finds:
  - every picture, sound or font packed as text (data:<type>;base64,...): its type, its size as text and as a file,
    and for a picture its width and height, for a sound its bit rate, its rate of samples and how many channels;
  - every other long run of base64 text (a model's numbers packed as text), 2,000 characters or more;
  - what is left: code and plain data written as text.
Base64 writes 3 bytes as 4 letters, so a quarter of every packed run is the cost of packing it as text.
The same blob found twice or more (the same letters) is counted as stored twice.
"""
import base64, collections, hashlib, json, re, struct, sys, zlib

page = sys.argv[1]
html = open(page, encoding='utf-8').read()
MB = 1048576.0
total_chars = len(html)
total_bytes = len(html.encode('utf-8'))

# split by source file: the builder writes "<script>\n/* game/... */\n"
marks = [(m.start(), m.group(1)) for m in re.finditer(r'<script>\n/\* ([^*]+?) \*/\n', html)]
parts = []
prev, name = 0, '(the page itself)'
for pos, nm in marks:
    parts.append((name, html[prev:pos])); prev, name = pos, nm
parts.append((name, html[prev:]))

DATA = re.compile(r'data:([a-z]+/[a-z0-9.+-]+);base64,([A-Za-z0-9+/=]+)')
B64 = re.compile(r'[A-Za-z0-9+/]{2000,}={0,2}')


def pic_size(b):
    try:
        if b[:4] == b'RIFF' and b[8:12] == b'WEBP':
            k = b[12:16]
            if k == b'VP8 ':
                w, h = struct.unpack('<HH', b[26:30]); return w & 0x3fff, h & 0x3fff
            if k == b'VP8L':
                v = struct.unpack('<I', b[21:25])[0]; return (v & 0x3fff) + 1, ((v >> 14) & 0x3fff) + 1
            if k == b'VP8X':
                return 1 + int.from_bytes(b[24:27], 'little'), 1 + int.from_bytes(b[27:30], 'little')
        if b[:8] == b'\x89PNG\r\n\x1a\n':
            return struct.unpack('>II', b[16:24])
        if b[:2] == b'\xff\xd8':
            i = 2
            while i < len(b):
                if b[i] != 0xff: i += 1; continue
                mk = b[i + 1]
                if mk in (0xc0, 0xc1, 0xc2):
                    h, w = struct.unpack('>HH', b[i + 5:i + 9]); return w, h
                ln = struct.unpack('>H', b[i + 2:i + 4])[0]; i += 2 + ln
        if b[4:12] in (b'ftypavif', b'ftypavis'):
            j = b.find(b'ispe')
            if j > 0: return struct.unpack('>II', b[j + 8:j + 16])
    except Exception:
        pass
    return None


BR = {1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320], 2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]}
SR = {3: [44100, 48000, 32000], 2: [22050, 24000, 16000], 0: [11025, 12000, 8000]}


def mp3_info(b):
    i = 0
    if b[:3] == b'ID3':
        sz = (b[6] << 21) | (b[7] << 14) | (b[8] << 7) | b[9]; i = 10 + sz
    while i < min(len(b) - 4, i + 65536):
        if b[i] == 0xff and (b[i + 1] & 0xe0) == 0xe0:
            ver = (b[i + 1] >> 3) & 3; layer = (b[i + 1] >> 1) & 3; bri = b[i + 2] >> 4; sri = (b[i + 2] >> 2) & 3; ch = b[i + 3] >> 6
            if ver != 1 and layer == 1 and 0 < bri < 15 and sri < 3:
                kb = BR[1 if ver == 3 else 2][bri]; sr = SR[ver][sri]
                vbr = b'Xing' in b[i:i + 200] or b'Info' in b[i:i + 200] or b'VBRI' in b[i:i + 200]
                return {'kbps': kb, 'hz': sr, 'ch': 1 if ch == 3 else 2, 'vbr_tag': vbr}
        i += 1
    return None


blobs = []            # (part, kind, mime, chars, bytes, extra, hash)
code = collections.Counter()
for name, text in parts:
    spans = []
    for m in DATA.finditer(text):
        mime, b = m.group(1), m.group(2)
        raw = base64.b64decode(b + '=' * (-len(b) % 4))
        extra = {}
        if mime.startswith('image/'):
            s = pic_size(raw); extra['wh'] = list(s) if s else None
        if mime.startswith('audio/'):
            extra['mp3'] = mp3_info(raw) if mime == 'audio/mpeg' else None
        kind = 'sound' if mime.startswith('audio/') else 'picture' if mime.startswith('image/') else 'font' if mime.startswith('font/') else 'other'
        blobs.append((name, kind, mime, len(m.group(0)), len(raw), extra, hashlib.sha1(b.encode()).hexdigest()))
        spans.append((m.start(), m.end()))
    # long base64 runs that are not data: URIs (models packed as text)
    rest = list(text)
    taken = bytearray(len(text))
    for a, z in spans:
        taken[a:z] = b'\x01' * (z - a)
    for m in B64.finditer(text):
        if taken[m.start()]: continue
        b = m.group(0)
        try: raw = base64.b64decode(b + '=' * (-len(b) % 4))
        except Exception: continue
        gz = raw[:2] == b'\x1f\x8b'
        blobs.append((name, 'model', 'base64' + (' (gzip)' if gz else ''), len(b), len(raw), {}, hashlib.sha1(b.encode()).hexdigest()))
        taken[m.start():m.end()] = b'\x01' * (m.end() - m.start())
    code[name] += len(text) - sum(taken)

kinds = collections.defaultdict(lambda: [0, 0, 0])
for _, k, _, ch, by, _, _ in blobs:
    kinds[k][0] += ch; kinds[k][1] += by; kinds[k][2] += 1
seen = collections.defaultdict(list)
for i, bl in enumerate(blobs): seen[bl[6]].append(i)
twice = [(v, blobs[v[0]]) for v in seen.values() if len(v) > 1]

print('%s: %.1f MB as a file (%d characters)' % (page, total_bytes / MB, total_chars))
print('\nBy kind (as text in the page; as files; how many):')
for k, (ch, by, n) in sorted(kinds.items(), key=lambda x: -x[1][0]):
    print('  %-8s %7.1f MB as text  %7.1f MB as files  %5d   (packing costs %.1f MB)' % (k, ch / MB, by / MB, n, (ch - by) / MB))
cc = sum(code.values())
print('  %-8s %7.1f MB (code and plain data written as text)' % ('code', cc / MB))
pack = sum(ch - by for _, _, _, ch, by, _, _ in blobs)
print('  packing as text costs %.1f MB in all (%.0f%% of the page)' % (pack / MB, 100 * pack / total_chars))

print('\nThe sound:')
snd = [b for b in blobs if b[1] == 'sound']
rates = collections.Counter()
for b in snd:
    mi = b[5].get('mp3')
    rates['%s kbps %s Hz %s ch%s' % ((mi['kbps'], mi['hz'], mi['ch'], ' (VBR)' if mi['vbr_tag'] else '') if mi else ('?', '?', '?', ''))] += 1
for r, n in rates.most_common(): print('  %4d files at %s' % (n, r))
sp = collections.Counter();
for b in snd: sp[b[0]] += b[3]
for nm, ch in sp.most_common(8): print('  %7.2f MB in %s' % (ch / MB, nm))

print('\nStored twice or more (the same blob):')
waste = 0
for v, bl in sorted(twice, key=lambda x: -x[1][3] * (len(x[0]) - 1)):
    waste += bl[3] * (len(v) - 1)
for v, bl in sorted(twice, key=lambda x: -x[1][3] * (len(x[0]) - 1))[:15]:
    where = sorted(set(blobs[i][0] for i in v))
    print('  %d times, %.2f MB each (%s %s): %s' % (len(v), bl[3] / MB, bl[1], bl[2], '; '.join(where)[:200]))
print('  in all, %.1f MB is a second (or later) copy' % (waste / MB))

print('\nThe twenty largest things (one blob, or one file\'s code):')
things = [(bl[3], '%s %s%s in %s' % (bl[1], bl[2], (' %dx%d' % tuple(bl[5]['wh'])) if bl[5].get('wh') else '', bl[0])) for bl in blobs]
things += [(c, 'code in %s' % n) for n, c in code.items()]
for ch, what in sorted(things, reverse=True)[:20]: print('  %6.2f MB  %s' % (ch / MB, what))

print('\nBy source file (all it holds, as text):')
byfile = collections.Counter()
for n, t in parts: byfile[n] += len(t)
for n, ch in byfile.most_common(25): print('  %6.2f MB  %s' % (ch / MB, n))

pics = [b for b in blobs if b[1] == 'picture' and b[5].get('wh')]
big = sorted(pics, key=lambda b: -b[3])[:25]
print('\nThe largest pictures:')
for b in big: print('  %6.2f MB  %-11s %5dx%-5d in %s' % (b[3] / MB, b[2], b[5]['wh'][0], b[5]['wh'][1], b[0]))

if '--json' in sys.argv:
    json.dump({'blobs': [list(b) for b in blobs], 'code': dict(code), 'total': total_chars}, open(sys.argv[sys.argv.index('--json') + 1], 'w'))
