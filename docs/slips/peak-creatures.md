# peak-creatures: two new creatures for the frozen peaks, the Wickstoat and the Hoarmantle

## Report for the hub (kept true as the work goes; newest state, November 24 evening)

**M7's way ran here, all of it.** Blender 4.0.2 and Python's numpy, scipy, scikit-image were installed from Ubuntu's
packages; M7's foe kit (default branch, commit c80f77e) was copied outside both repos and run as it is: the sculpt,
Blender's bake onto a light model, its pictures, its packing, its no-stretching check. Nothing was faked. Added beside
it (in this repo): `peak/src/sheetpaint.py`, which paints a sculpt from Chris's sheet by position (his 12:00 word).
How to do it all again on another machine: "How to make the two again", below.

| | The Wickstoat (zone 4, A) | The Hoarmantle (zone 4, B) |
|---|---|---|
| Sculpt (kept as source, not shipped) | 1,141,618 triangles, painted from the sheet | 1,118,426 triangles, painted from the sheet |
| Light model the game draws | 20,583 triangles (+ 9 ice spines made in the page, 12 triangles each) | 34,205 triangles |
| In the page | model 423 KB, pictures 290 KB (colour 1024, surface and shading 512) | model 766 KB, pictures 0.9 MB (colour and surface 1024, shading 512) |
| Height | 0.60 m (1.63 m nose to tail) beside a 1.65 m witch | 2.16 m to the snow on its hump, 2.86 m long |

**How near the sheet.** The Wickstoat is close: outline, white fur, dark paws, round ears, whiskers, black frosted tail
tip, dark eyes, all from his picture. Not as near: its fur is less fluffy (a little thinner from the front); the spines
read as pale glassy triangles in the flat light, and the last three sit low in the fur; the sparks show best at night.
The Hoarmantle is recognisably his ox (face, horns with ice rings, ice helm, snow mantle, grey-blue hair to the ground,
icicles, hooves peeping, painted from his picture) but **it is blockier than his**: the hair curtain hangs straighter
and the snow sits as a cap; his hair is wider, wilder locks that flare more at the hem.

**What would not mend (said plainly).** M7's no-stretching check does **not** pass yet for either. The Wickstoat:
standing, Hurt and Skitter pass; Bound, Pinch, Glint and the Fall stretch to 1.3 to 1.6 times (limit 1.3) at the
shoulders, haunches and knees, where short legs come out of thick fur. The Hoarmantle: standing passes; the others
stretch 1.8 to 2.8 times, at the hem round the hind hooves and under the neck. The check's pictures are in the scratch
folder only. Next step for whoever goes on: softer moves at those joints, or M7's per-joint limits (`mend.limits`).

**Pictures for Chris** (in the repo, `game/battle/models/m7/peak/for-chris/`): `<key>-beside-sheet.webp` (his picture
above the model, front, side, back), `<key>-stand-1280x720.webp` and `-412x880` (in the battle's light beside a witch),
`<key>-strip.webp` (every motion), `<key>-fight-...` (fights). Made again from the repo with one command each:
`python3 tools/build.py game/pages/peak-creatures-lab.html` then
`python3 tools/peak-look.py builds/peak-creatures-lab.html <folder> --sheet game/battle/models/m7/wickstoat/src/sheet-wickstoat-reference.webp wickstoat --sheet game/battle/models/m7/hoarmantle/src/sheet-hoarmantle-reference.webp hoarmantle --stand --strip --fight 4,8`
(add `--size 412x880` for the phone). The lab page: `builds/peak-creatures-lab.html` (16.6 MB, nothing fetched).

**Checked:** both build and draw with 0 page errors; both fought in their slots with no screen; heights and triangles
above. **Not checked:** motion and frame rate (no screen here; the page shows its own), the phone in Chris's hand,
zone 4's own page with them (built but not walked), Glint being stronger with more sparks (only its flash is).

**For the hub:** (1) merge job/creatures first, then this branch: it adds one marked block to `zone-4.html` and to
`fights-lab.html` loading m7-foe.js and the decoder; if the creatures job also adds them, keep one copy. (2) slots.js
(zone 4 A and B, B now on) and words.js changed (fights job's files, as the brief asked); run
`node tools/encounter-balance.mjs` after merging. (3) `makePeakFoe` wraps `makeM7Foe` for the spines, sparks and
breath; a hook in m7-foe.js would let it be one maker. (4) creatures-lab.html still puts Briarmaw in zone 4 B on its
own page; harmless.

**For Chris:** the two names and all move names are stand-ins; the Wickstoat starts each fight with 3 sparks lit (the
job's call; 0 was the other choice); being let go: the Wickstoat drops its lights and bolts, the Hoarmantle turns and
walks off; the Hoarmantle's slot is now on.

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
