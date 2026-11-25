# left-overs: four left-over jobs (small folk's knees, the nine big fights again, flames that lean north, what a zone page weighs)

Branch: job/left-overs      Updated: November 25, 2026

## Running log (so the work can carry on if the machine stops)

- Read the brief, CLAUDE.md, the board's handoff, game/README.md, docs/slips/README.md.
- Task 1: the fix is already in `main` (journey job, `53f7cfa`, November 24). `root` in `solveLimb` is the jester
  group; `person-kit.js` (height, build) and `people.js` (size) both set the size on that group. Checking it with
  pictures on zones 1, 2, 3.
- Task 2: the nine big fights on the lab page are `greatWraith`, `stone-road`, `stone-ring`, `stone-rise`, `nodeNight`,
  `knightOfLight`, `theFire-1`, `theFire-2`, `greatBramble`. `tools/encounter-fights-test.py` now takes `--size`.
- Task 3: north is -z, east +x on all four zones (atlas.map is a shift and a scale, no turn; the small map's N is -z).
  The lines say north-east (8 lines) more than north (1). Data: `game/look/flame-lean.js` (committed, not yet loaded by
  any page). Engine and place patches drafted in the scratchpad (patch-core.py, patch-world.py, patch-places.py): to be
  applied only after `main` has small-things.
- Task 4: `tools/left-overs-weigh.py` written (reads a built page, changes nothing).
