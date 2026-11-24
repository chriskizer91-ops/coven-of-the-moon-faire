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
