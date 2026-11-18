# first-test: Wickhollow with open land round it

Branch: job/first-test      Built by: the hub      Updated: November 18, 2026, evening

## What it built

One page: **`game/pages/first-test.html`**. Build it with `python3 tools/build.py game/pages/first-test.html`; the file
to open is `builds/first-test.html` (27.5 MB, everything inside, no internet needed).

- **Wickhollow's square**, as the reskinned zone 1 has it: the same place data, engine and textures.
- **Open land round it**, 770 m by 510 m, walked into and out of with no fade:
  - the woods round the town (leafy trees and firs);
  - the town's lake carried on to the west, and its river carried on north and south;
  - across the town's bridge, **the Thornwood**: bare thorn trees in clumps with clearings, pale heavy fog;
  - a road east through the Thornwood, a road south toward Io's cottage, a trail to a ring of standing stones, a trail
    to a still pool;
  - **herbs on the ground** (Moonpetal and Lavender): Io walks into one, it goes into her bag, and the bag shows at
    the top left.
- The land is **drawn in squares of 32 m round her**, each at the detail its distance needs (a point every 0.5, 1, 2 or
  4 m on a laptop), with far hills round the camera and fog that thickens as she leaves town.
- The camera draws back a little by itself as she walks and more as she runs.
- On the screen: the frame rate (bottom left, always), a button for more numbers (top right), the look's button
  (Flipbook look, beside it), where she is and what she found (top middle), her herbs (top left).

Where the code is:

| Folder | What it is |
|---|---|
| `game/engine/place/` | The place engine, from the new Envoi (six files) |
| `game/engine/land/land.js` | The land engine: new |
| `game/places/wickhollow.js`, `wickhollow-trees.js` | Wickhollow, from the new Envoi, unchanged |
| `game/places/first-test-land.js` | The land round it, and the four small changes that open the town onto it: new |
| `game/witches/io/` | Io's light model, her added moves, her textures |
| `game/look/flipbook.js` | The Flipbook look |
| `game/texture-packs/made-web/` | 38 of Chris's textures, with their labels (`index.csv`, only their rows) |
| `game/data/maps-wickhollow.js` | Where she can stand in the square |
| `tools/build.py` | Packs a page into one file |
| `tools/look.py`, `tools/walk-test.py` | Pictures and checks with no screen |
| `tools/make-io.mjs` | Makes the Io file the game loads from her model and her added moves |

## Hub's calls made here

(Also in `docs/decisions.md`.)

- **The land's code is new; the method is Moon Faire's.** Moon Faire's own land files could not be dropped in: they are
  lit by Moon Faire's shader and read Moon Faire's painted map. The town is lit by the place engine's night. So the
  land was written to Moon Faire's method (squares round the camera, four levels of detail, skirts on the seams, rules
  for height and ground) inside the place engine's light, textures and trees, so town and land are one picture.
  Nothing was copied from Moon Faire but three.js.
- **The land's shape is made up.** The 3D map's data has one point every 5 to 10 m, far too coarse for a land 770 m
  across. The real zone 1 will take its broad shape from the 3D map and its fine shape from rules like these.
- **The town was opened up.** Before, Io could walk only inside the painting, behind a hedge. Now she can walk anywhere
  on the town's own ground (about 98 m by 93 m) that is not water or solid, and off its edge anywhere.
- **The camera's zoom is gentler than Moon Faire's:** 1.2 times walking and about 1.5 times running (Moon Faire: 2.15
  and 4.9). In fog this close she would be lost at Moon Faire's distances.
- **Walking speeds are the new Envoi's** for now (walk 1.3, run 3.0, sprint 5.2 m a second).
- **Herbs:** Envoi's two healing herbs by name. The sprig is a small picture painted in code, a stand-in.
- **Left out of the test:** the keepsake shimmers (they need the first Envoi's item list and pictures), the two fonts
  (not on this machine; the page uses the device's own), the town's painting-from-above button.
- **The Flipbook look** is given the land's night colours beside the town's painting, or the Thornwood's fog came out
  peach.

## What was copied in

59 lines in `assets/INDEX.csv`: three.js r128 (Moon Faire); the six place engine files, Wickhollow's two place files,
Io's seven files, the Flipbook look, Wickhollow's painting, 38 textures and their labels, and Wickhollow's walking
areas (the new Envoi).

Changed after copying (each change is marked "Coven" in the file):

- `game/engine/place/core.js`: one line, to share its two shader pieces with the land.
- `game/engine/place/world.js`: the tree builder made a function, so the land can plant the same trees; five more
  things handed back to whoever built the place.
- `game/engine/place/walker.js`: the camera's zoom.

## What was checked, and how

All with a browser that has no screen and no graphics card. Run them with:

```
python3 tools/build.py game/pages/first-test.html
python3 tools/walk-test.py builds/first-test.html
python3 tools/look.py builds/first-test.html <a folder for the pictures> --plan <plan.json>
```

| Check | Result |
|---|---|
| Io walks east off the town's ground into the Thornwood | 74 m past the edge in 34 seconds, never stopped |
| Her height as she crosses the edge | never jumps: at most 3.8 cm in a thirtieth of a second |
| She walks back onto the town's ground | yes, east and south |
| South down the road and back | 64 m past the edge, at most 2.3 cm |
| The land's rules at 3,907 spots | every spot has a height; no spot in water can be stood on; 86% can be stood on |
| A herb | walked into, in the bag, gone from the ground, shown on the screen |
| Page errors | 0 |
| The file reaches outside itself | no: the builder stops if it would |
| Time to make one piece of land (this machine) | finest square of ground 4 thousandths of a second; a square's trees 2 |
| What is drawn | 130,000 to 365,000 triangles, 95 to 290 draw calls. The square alone, before the land: 203,000 and 135 |
| Looked at by eye, in 40 pictures | the seams of ground, road, lake and river; the Thornwood; the stones; the pool; a phone's size; the Flipbook look |

**Not checked:**

- **The frame rate.** A browser with no graphics card cannot say. Only Chris's laptop and phone can.
- Anything in motion: every picture is a still.
- Touch controls on a real phone.

## Unfinished, and known rough spots

- The trees thin away when they are between the camera and Io or right against the camera, as in the town. The camera
  does not steer round them. The standing stones do the same.
- The lake and the pool are flat sheets with no ripple at the shore.
- The standing stones are plain blocks.
- The road's edge is soft and straight-sided; there are no ruts, verges or stones along it.
- Past the land's rim (385 m east and west, 255 m north and south) there is a thick hedge of trees and she cannot go on.
- The thorn trees wear the town's bark, not the Thornwood's black bark.
- Nothing is saved: the herbs come back when the page is opened again.
- The land is made on the page's main thread, a few thousandths of a second a frame. Moon Faire used a background
  worker; that can be added if a real laptop shows a stutter.

## For the hub

- Chris's frame rate on his laptop and phone decides how dense zone 1 can be.
- The Moon Faire's camp needs a spot in zone 1 (the game starts there).
