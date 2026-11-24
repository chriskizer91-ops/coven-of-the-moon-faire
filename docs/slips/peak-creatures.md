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
  - A first sculpt and bake: in progress (the machine's shared lock is busy).
- Nothing of M7's kit is copied into this repo.
