# peak-creatures: two new creatures for the frozen peaks, the Wickstoat and the Hoarmantle

NOT DONE: the Hoarmantle's detail (the hub's five surface defects; in progress).

## Report for the hub (kept true as the work goes; newest state, November 24 evening)

**M7's way ran here, all of it.** Blender 4.0.2 and Python's numpy, scipy, scikit-image were installed from Ubuntu's
packages; M7's foe kit (default branch, commit c80f77e) was copied outside both repos and run as it is: the sculpt,
Blender's bake onto a light model, its pictures, its packing, its no-stretching check. Nothing was faked. Added beside
it (in this repo): `peak/src/sheetpaint.py`, which paints a sculpt from Chris's sheet by position (his 12:00 word).
How to do it all again on another machine: "How to make the two again", below.

| | The Wickstoat (zone 4, A) | The Hoarmantle (zone 4, B) |
|---|---|---|
| Sculpt (kept as source, not shipped) | 1,141,618 triangles, painted from the sheet | 1,151,096 triangles, shaped and painted from the sheet |
| Stretch check (M7's) | PASS, every move | PASS, every move |
| Light model the game draws | 20,583 triangles (+ 9 ice spines made in the page, 12 triangles each) | 35,972 triangles |
| In the page | model 423 KB, pictures 290 KB (colour 1024, surface and shading 512) | model 759 KB, pictures 0.9 MB (colour and surface 1024, shading 512) |
| Height | 0.60 m (1.63 m nose to tail) beside a 1.65 m witch | 2.06 m to the snow on its hump |

**How near the sheet.** The Wickstoat is close: outline, white fur, dark paws, round ears, whiskers, black frosted
tail tip, dark eyes and nose (its own, no longer smudged from the sheet), and nine clear ice spines from the shoulders
to the tail, each with a solid warm amber spark (all nine lit beside the sheet; 3 when met). Not as near: its fur is
less fluffy and a little thinner from the front; its sparks are a touch yellower than his. The Hoarmantle was **reshaped from his picture** (the hub's last round): its body is
cut from the sheet's own outline in all three views (each view cut out of the grey, the three crossed, then rounded
across so it is an animal, not a box), its head hung low and forward in front of the hair, its horns broad and heavy
(brown, pale ice rings, curling forward), its brow one faceted slab of ice pointing down between the eyes, its snow
laid only where his picture has white snow (drifts, hair between), its hair long hanging locks. **How near the
outline, measured** (shared area over joined area, the model's outline against the sheet's, holes filled;
`peak/src/overlap.py`): **front 0.947, side 0.936, back 0.932** (before this round, by M7's own measure, which counts
grey spots inside a figure as background: 0.746, 0.625, 0.653; after, by M7's measure: 0.85, 0.74, 0.70). Still not as
his: the hair is finer and stiffer than his wide flame-shaped locks; the hem is rounder, less ragged; the brow slab
stands a little proud. The Wickstoat by the same measure: front 0.64, side 0.75, back 0.74 (its sculpt has no spines,
which are made in the page, and no whisker tips, and the sheet's front figure takes in a piece of the side view's
tail: so these numbers are low for reasons other than its body; beside the sheet it is the same animal).

**No stretching: both PASS M7's check on every move** (limit 1.3 times for a big edge, 3 for a crease). Before, then
after (the worst big edge of each move):

| Wickstoat | Breathe | Bound | Pinch | Skitter | Glint | Hit | Fall |
|---|---|---|---|---|---|---|---|
| first check | 1.09 | 2.59 | 1.90 | 2.16 | 3.55 | 1.33 | 1.89 |
| now | 1.08 | 1.28 | 1.29 | 1.29 | 1.28 | 1.27 | 1.26 |

| Hoarmantle | Breathe | Walk | Trample | Winter Breath | Shake | Hit | Fall |
|---|---|---|---|---|---|---|---|
| first check | 1.24 | 2.74 | 3.73 | 4.00 | 2.85 | 3.37 | 2.97 |
| before reshaping | 1.28 | 1.28 | 1.28 | 1.30 | 1.26 | 1.24 | 1.29 |
| reshaped (now) | 1.29 | 1.29 | 1.29 | 1.30 | 1.29 | 1.22 | 1.30 |

What it took: the Hoarmantle's hair belongs to the body only and its legs only to their own hooves, in the hollow
under the hair; its body sways whole instead of twisting; its head does the work and its neck barely moves; its
legs stand still inside the hair (its walk is the body's heavy roll and bob); its head moves less. **Quieter than planned, said plainly:** Trample no longer shows a pawing
hoof (it tore the hem beside the hoof): its wind-up is the head lowered and the body rocking back and dipping twice,
then the charge. The Wickstoat's legs bend at the joints that show and its back arches less; its Glint rears less
high (about 30 degrees). No move was left out.

**Pictures for Chris** (in the repo, `game/battle/models/m7/peak/for-chris/`): `<key>-beside-sheet.webp` (his picture
above the model, front, side, back), `<key>-stand-1280x720.webp` and `-412x880` (in the battle's light beside a witch),
`<key>-strip.webp` (every motion), `<key>-fight-...` (fights). Every one was taken again on a fresh page for each
creature (the first Hoarmantle pictures had caught the end of the Wickstoat's fight) and every one was looked at. Made again from the repo with one command each:
`python3 tools/build.py game/pages/peak-creatures-lab.html` then
`python3 tools/peak-look.py builds/peak-creatures-lab.html <folder> --sheet game/battle/models/m7/wickstoat/src/sheet-wickstoat-reference.webp wickstoat --sheet game/battle/models/m7/hoarmantle/src/sheet-hoarmantle-reference.webp hoarmantle --stand --strip --fight 4,8`
(add `--size 412x880` for the phone). The lab page: `builds/peak-creatures-lab.html` (16.6 MB, nothing fetched).

**Checked:** both build and draw with 0 page errors; both fought in their slots with no screen (each fight pictured at 4 and 8
seconds on its own fresh page, not played to its end); heights and triangles above; `node
tools/encounter-balance.mjs` with both slots as now: "every target met" (zone 4, A and B on: -1.4 fights). **Not checked:** motion and frame rate (no screen here; the page shows its own), the phone in Chris's hand,
zone 4's own page with them (built but not walked), Glint being stronger with more sparks (only its flash is).

**For the hub:** (1) merge job/creatures first, then this branch: it adds one marked block to `zone-4.html` and to
`fights-lab.html` loading m7-foe.js and the decoder; if the creatures job also adds them, keep one copy. (2) slots.js
(zone 4 A and B, B now on) and words.js changed (fights job's files, as the brief asked); it says "every target met" here; run it again
after merging. (3) `makePeakFoe` wraps `makeM7Foe` for the spines, sparks and
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
