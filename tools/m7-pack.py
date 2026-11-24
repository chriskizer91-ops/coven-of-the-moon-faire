#!/usr/bin/env python3
"""m7-pack.py: puts one Aethermoor M7 creature's light model inside a script, so a built page carries it.

    python3 tools/m7-pack.py <key> <light.bin> <light.json>   ->  game/battle/models/m7/<key>/light.js

The model (light.bin, packed by M7's own tools) is kept byte for byte: it is squeezed once more (gzip, which the
browser undoes by itself) and written as text. Its bones and numbers (light.json) are written as they are.
The page unpacks it when it opens (game/battle/models/m7/m7-foe.js). The creatures job, November 24, 2026.
"""
import base64, gzip, json, os, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

if len(sys.argv) != 4:
    sys.exit(__doc__)
key, bin_path, json_path = sys.argv[1:]
raw = open(bin_path, 'rb').read()
meta = json.load(open(json_path))
packed = gzip.compress(raw, 9, mtime=0)
out_dir = os.path.join(ROOT, 'game', 'battle', 'models', 'm7', key)
os.makedirs(out_dir, exist_ok=True)
out = os.path.join(out_dir, 'light.js')
with open(out, 'w', encoding='utf-8') as f:
    f.write('// %s/light.js: Aethermoor M7\'s %s, its light model (light.bin, unchanged, squeezed with gzip and written as\n' % (key, key))
    f.write('// text) and its bones (light.json, unchanged). Made by tools/m7-pack.py. Where they came from: assets/INDEX.csv.\n')
    f.write('window.M7.bin(%s, %s,\n"%s");\n' % (json.dumps(key), json.dumps(meta, separators=(',', ':')), base64.b64encode(packed).decode()))
print('%s  model %d KB, squeezed %d KB, as text %d KB' % (os.path.relpath(out, ROOT), len(raw) / 1024, len(packed) / 1024, os.path.getsize(out) / 1024))
