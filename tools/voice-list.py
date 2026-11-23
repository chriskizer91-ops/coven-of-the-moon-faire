#!/usr/bin/env python3
"""voice-list.py: lists a zone's recorded lines for the page, and checks them against the lines.
    python3 tools/voice-list.py z1
Reads game/talk/zone-1.js (the story job's lines) and game/talk/audio/z1/ (its recordings, one <line id>.mp3 each).
Writes game/people/voice-z1.js: the id of every line that has a recording, and where its sound is. The builder puts
the sound inside the one-file build. Says which lines have no recording, which recordings match no line, and the size."""
import sys, os, re, json
z = sys.argv[1] if len(sys.argv) > 1 else 'z1'; n = z[1:]
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
ids = re.findall(r"\{ id: '([^']+)'", open(os.path.join(root, 'game/talk/zone-%s.js' % n), encoding='utf8').read())
folder = os.path.join(root, 'game/talk/audio', z); have = sorted(f[:-4] for f in os.listdir(folder) if f.endswith('.mp3')) if os.path.isdir(folder) else []
missing = [i for i in ids if i not in have]; extra = [h for h in have if h not in ids]; size = sum(os.path.getsize(os.path.join(folder, h + '.mp3')) for h in have if h in ids)
out = "// voice-%s.js: which of zone %s's lines have a recording, and where (made by tools/voice-list.py; do not edit by hand).\n" % (z, n)
out += "window.COVEN_VOICE = Object.assign(window.COVEN_VOICE || {}, {\n" + ''.join('  %s: "./../talk/audio/%s/%s.mp3",\n' % (json.dumps(i), z, i) for i in ids if i in have) + "});\n"
open(os.path.join(root, 'game/people/voice-%s.js' % z), 'w', encoding='utf8').write(out)
print('%d lines, %d with a recording (%.1f MB), %d without, %d recordings that match no line' % (len(ids), len(ids) - len(missing), size / 1e6, len(missing), len(extra)))
for m in missing[:12]: print('  no recording: ' + m)
for e in extra[:12]: print('  matches no line: ' + e)
sys.exit(1 if extra else 0)
