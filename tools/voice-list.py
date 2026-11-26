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
# (and the narrator's lines for the zone, the hub's: game/people/narration.js)
narr = re.findall(r"\{ id: '(%s\.narrator\.\d+)'" % z, open(os.path.join(root, 'game/people/narration.js'), encoding='utf8').read()); ids += narr
folder = os.path.join(root, 'game/talk/audio', z); have = sorted(f[:-4] for f in os.listdir(folder) if f.endswith('.mp3')) if os.path.isdir(folder) else []
missing = [i for i in ids if i not in have]; extra = [h for h in have if h not in ids]; size = sum(os.path.getsize(os.path.join(folder, h + '.mp3')) for h in have if h in ids)
out = "// voice-%s.js: which of zone %s's lines have a recording, and where (made by tools/voice-list.py; do not edit by hand).\n" % (z, n)
out += "window.COVEN_VOICE = Object.assign(window.COVEN_VOICE || {}, {\n" + ''.join('  %s: "./../talk/audio/%s/%s.mp3",\n' % (json.dumps(i), z, i) for i in ids if i in have) + "});\n"
open(os.path.join(root, 'game/people/voice-%s.js' % z), 'w', encoding='utf8').write(out)
# left-overs (November 25, 2026): zone 1's page carries zone 4's lines only for the Faire ending and the homecoming
# (it opens as the ending after the flight home). So for z4 this also writes voice-z4-faire.js: only the lines of the
# moments 'faire' and 'homecoming' (the coven's and the folk's, and the narrator's at those moments). Zone 1's page
# loads that one; zone 4's page and the Faire's own page load the whole list. It saves about 4 MB on zone 1's page.
if z == 'z4':
    MOMENTS = ('faire', 'homecoming')
    talk = open(os.path.join(root, 'game/talk/zone-4.js'), encoding='utf8').read()
    keep = set(m.group(1) for m in re.finditer(r"\{ id: '(z4\.[^']+)'[^\n]*?moment: '([a-z-]+)'", talk) if m.group(2) in MOMENTS)
    keep |= set(m.group(1) for m in re.finditer(r"\{ id: '(z4\.narrator\.\d+)', at: '([a-z-]+)'", open(os.path.join(root, 'game/people/narration.js'), encoding='utf8').read()) if m.group(2) in MOMENTS)
    sub = [i for i in ids if i in have and i in keep]
    out2 = "// voice-z4-faire.js: zone 4's recorded lines that zone 1's page can play: the Faire ending and the homecoming (made by tools/voice-list.py z4; do not edit by hand).\n"
    out2 += "window.COVEN_VOICE = Object.assign(window.COVEN_VOICE || {}, {\n" + ''.join('  %s: "./../talk/audio/z4/%s.mp3",\n' % (json.dumps(i), i) for i in sub) + "});\n"
    open(os.path.join(root, 'game/people/voice-z4-faire.js'), 'w', encoding='utf8').write(out2)
    print('  and voice-z4-faire.js: %d of them, for zone 1\'s page (%.1f MB)' % (len(sub), sum(os.path.getsize(os.path.join(folder, i + '.mp3')) for i in sub) / 1e6))
print('%d lines, %d with a recording (%.1f MB), %d without, %d recordings that match no line' % (len(ids), len(ids) - len(missing), size / 1e6, len(missing), len(extra)))
print('  (of those without: %d are the narrator\'s, not recorded yet)' % len([m for m in missing if '.narrator.' in m]))
for m in [m for m in missing if '.narrator.' not in m][:12]: print('  no recording: ' + m)
for e in extra[:12]: print('  matches no line: ' + e)
sys.exit(1 if extra else 0)
