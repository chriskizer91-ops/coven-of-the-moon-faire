#!/usr/bin/env python3
"""copy-place.py: copies one more of the new Envoi's places into the game, by CLAUDE.md's rules for copying.
    python3 tools/hub/copy-place.py <folder of the Envoi clone> <place id> "<Its name>"
    python3 tools/hub/copy-place.py ../envoi frozen-camp "The frozen camp"
The clone is the read-only one CLAUDE.md describes (no checkout needed: files are read with git show).
It copies the place's two files (game/places/<id>.js and <id>-trees.js), its walking areas as plain numbers
(game/data/maps-<id>.js), and any of its textures not here yet (game/texture-packs/made-web/), and adds one line to
assets/INDEX.csv for each. It does not copy the walking painting (game/art/walk/): copy that by hand for the one
place a zone's page starts in. Used for every place of zones 2 and 3."""
import subprocess, os, csv, re, sys, json, datetime, tempfile
NEW = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..'); SRC = os.path.abspath(sys.argv[1]); E = 'envoi-on-the-longest-night'; sys.argv = sys.argv[:1] + sys.argv[2:]
COMMIT = subprocess.check_output(['git', '-C', SRC, 'rev-parse', '--short', 'HEAD'], text=True).strip(); DATE = datetime.date.today().isoformat(); W = 'moon-faire-witches/'
blob = lambda path: subprocess.check_output(['git', '-C', SRC, 'show', 'HEAD:' + path])
rows = []
def take(src, dst, what, data=None):
    d = os.path.join(NEW, dst); os.makedirs(os.path.dirname(d), exist_ok=True); open(d, 'wb').write(data if data is not None else blob(src)); rows.append([dst, E, 'main', COMMIT, src, what, DATE])
pid, name = sys.argv[1], sys.argv[2]
take(W + 'world3d/places/%s.js' % pid, 'game/places/%s.js' % pid, name + ' as a 3D place')
take(W + 'world3d/places/%s-trees.js' % pid, 'game/places/%s-trees.js' % pid, "where %s's trees stand" % name)
src = blob(W + 'world3d/places/%s.js' % pid).decode()
ids = set(re.findall(r"made-web/([a-z0-9_]+)\.webp", src))
for line in blob(W + 'world3d/engine/extras.js').decode().split('\n'):
    m = re.search(r"\{ id: '([a-z0-9_]+)', (.*)made:", line)
    if m and any(w in ids for w in re.findall(r"'([a-z0-9_*]+)'", m.group(2).split('test:')[0].split('src:')[0]) if w != '*'): ids.add(m.group(1))
have = set(f[:-5] for f in os.listdir(os.path.join(NEW, 'game/texture-packs/made-web')) if f.endswith('.webp'))
files = set(subprocess.check_output(['git', '-C', SRC, 'ls-tree', '--name-only', 'HEAD', W + 'texture-packs/made-web/'], text=True).split('\n'))
new = sorted(i for i in ids - have if W + 'texture-packs/made-web/' + i + '.webp' in files)
for i in new: take(W + 'texture-packs/made-web/' + i + '.webp', 'game/texture-packs/made-web/' + i + '.webp', "Chris's made texture, web copy: " + i)
idx = blob(W + 'texture-packs/made-web/index.csv').decode().splitlines()
with open(os.path.join(NEW, 'game/texture-packs/made-web/index.csv'), 'a') as f:
    for l in idx[1:]:
        if any(re.search(r'\b' + re.escape(i) + r'\.webp', l) for i in new): f.write(l + '\n')
# its walking areas, as plain numbers
node = r"""
const fs = require('fs'); const G = {}; new Function('globalThis', 'window', fs.readFileSync(process.argv[2], 'utf8'))(G, G);
const id = process.argv[1], m = G.MAPS[id], r = (p) => p.map((q) => q.map((v) => Math.round(v * 100) / 100));
process.stdout.write(JSON.stringify({ walk: m.walk.map(r), block: m.block.map(r) }));
"""
mapid = (re.search(r"mapId: '([a-z-]+)'", src) or re.search(r"const ID = '([a-z-]+)'", src)).group(1)
mapsjs = os.path.join(tempfile.mkdtemp(), 'maps.js'); open(mapsjs, 'wb').write(blob('src/game/maps.js'))
d = json.loads(subprocess.check_output(['node', '-e', node, mapid, mapsjs], text=True))
js = """// maps-%s.js: where Io's feet can stand in %s, in its painting's own 1536 x 1024 pixels.
// walk: areas she can stand inside (their union). block: areas cut out of them.
// Taken from the old Envoi's walking maps (src/game/maps.js, MAPS['%s']): only these two lists, as plain numbers.
(function (G) {
  G.MAPS = G.MAPS || {};
  G.MAPS['%s'] = {
    walk: %s,
    block: %s,
  };
})(typeof globalThis !== 'undefined' ? globalThis : window);
""" % (pid, name, mapid, mapid, json.dumps(d['walk']), json.dumps(d['block']))
take('src/game/maps.js', 'game/data/maps-%s.js' % pid, "%s's walking map: only its walk and block areas, as plain numbers" % name, js.encode())
with open(os.path.join(NEW, 'assets/INDEX.csv'), 'a', newline='') as f: csv.writer(f).writerows(rows)
print(pid, ':', len(rows), 'pieces;', 'new textures:', ' '.join(new) or 'none', '; walk areas', len(d['walk']), 'block', len(d['block']))
