# peak-creatures: two new creatures for the frozen peaks, the Wickstoat and the Hoarmantle

Branch: job/peak-creatures      Updated: November 24, 2026 (in progress)

Made from `job/creatures`. A sub-agent of the hub's (Opus 5.5). The brief: build the two creatures Chris made
character sheets for on November 24 (10:46), Aethermoor M7's way, and bring them into the battle through the
creatures job's one shared loader (`game/battle/models/m7/m7-foe.js`).

## Does M7's way run here? (found out first)

- **Yes, it can be made to run.** M7's foe kit needs Blender 4.0, Python 3.12 with numpy, scipy and scikit-image, and
  Node with three.js 0.170, meshoptimizer and gltf-transform. On this machine:
  - Blender 4.0.2 installed from Ubuntu's own packages (`apt-get install blender`), and numpy, scipy, scikit-image for
    its Python 3.12 (`python3-numpy python3-scipy python3-skimage`). Blender starts with no screen.
  - M7's kit copied (read only, from M7's default branch, commit `c80f77e`) into a scratch folder outside every repo,
    and its Node packages installed there (`npm install`, 215 packages).
  - **It ran, start to finish, on the Wickstoat** (November 24, about 12:00): the sculpt (shape, fur as sculpted locks),
    the check against the sheet, Blender's bake onto the light model (surface, shading in the creases, colour), the
    pictures, the packing, and M7's no-stretching check. The work itself is quick here (a sculpt in seconds to two
    minutes, a bake in a few minutes); the wait is for the shared lock.
- Nothing of M7's kit is copied into this repo.

## What Chris said here (passed on by the hub)

- November 24, 12:00, on how a model is built: "Have it make a model that's like a million triangles or more, a highly
  detailed model, and then bake that onto a simpler model. As well as using model painting in places where we already
  have images." So each sculpt is a million triangles or more, baked onto the light model, and **painted from his own
  sheet**: its front, side and back views laid onto the sculpt by position (`sheetpaint.py`, made here, beside M7's
  kit), with the places no view shows (the top, the belly, between the legs) filled from the sheet's own colours.

## How to make the two again on another machine (M7's kit, run outside both repos)

What was installed here (Ubuntu 24.04, as root; nothing of it goes in the repo):

```
apt-get update
apt-get install -y --no-install-recommends blender python3-numpy python3-scipy python3-skimage   # Blender 4.0.2, Python 3.12
```

Node 22 and Python 3 with Pillow were already here. Then, in a scratch folder outside every repo:

```
# M7, read only (a light copy): the foe kit from its default branch, commit c80f77e
git clone --depth 1 --filter=blob:none --no-checkout <M7's address> m7src
mkdir work && git -C m7src archive c80f77e prototypes/foe-hd/kit prototypes/foe-hd/package.json \
    prototypes/foe-hd/package-lock.json | tar -x -C work
cd work/prototypes/foe-hd && npm install                    # three 0.170, meshoptimizer, gltf-transform (215 packages)
# this game's pieces beside it (from this repo):
cp <repo>/game/battle/models/m7/peak/src/sheetpaint.py kit/py/
for k in wickstoat hoarmantle; do mkdir -p foes/$k; cp <repo>/game/battle/models/m7/$k/src/{sculpt.py,rig.py,foe.json} foes/$k/; done
mkdir -p ../../art-in/3d/sheets      # the sheets as PNG, where foe.json looks for them:
python3 -c "from PIL import Image; [Image.open(f'<repo>/game/battle/models/m7/{k}/src/sheet-{k}-reference.webp').save(f'../../art-in/3d/sheets/sheet-{k}.png') for k in ('wickstoat','hoarmantle')]"
```

Then for each creature (key and moves: `wickstoat stoat`, `hoarmantle ox`):

```
python3.12 kit/py/sculpt.py foes/<key> 0          # the light model's shape
python3.12 kit/py/sculpt.py foes/<key> <level>    # the sculpt (foe.json "sculpt": 3 for the Wickstoat, 2 for the Hoarmantle), painted from the sheet
python3 kit/py/sheet.py foes/<key> <level>        # renders beside the sheet: foes/<key>/build/compare-<level>.png
blender -b -P kit/blender/bake.py -- foes/<key>   # the bake onto the light model, and its bones
python3 kit/tools/textures.py foes/<key>          # the pictures (WebP)
node kit/tools/pack.mjs foes/<key>                # the packed light model: assets/light.bin, light.json
COVEN_MOVES=<repo>/game/battle/models/m7/moves node kit/tools/stretch.mjs foes/<key> --moves=<repo>/game/battle/models/m7/peak/src/peak-moves.mjs#<moves> --parts
python3 <repo>/tools/m7-pack.py <key> foes/<key>/assets/light.bin foes/<key>/assets/light.json    # into this repo
```

and copy the pictures the creature's data names (`<key>/<key>.js`, `tex`) from `foes/<key>/assets/` into
`game/battle/models/m7/<key>/` (the 1024 ones are made by textures.py; the 512 ones are those made smaller, WebP).
On this machine every one of those steps ran under the shared lock (`flock /tmp/coven-heavy.lock timeout 1500 ...`).
