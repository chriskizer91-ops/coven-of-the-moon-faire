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
- Task 1 done: pictures and knee angles on zones 1, 2, 3, before (the line undone in a copy of the built page) and
  after (the page as built). Knees: Pell 92 to 165, Tamsin 92 to 165, Tock 77 to 174, Pim 72 to 168; Tobb 165 both;
  Nettie (1.02) 174 to 165; the four witches the same both times. 0 page errors. Sheet: knees/small-folk-sheet.png.
- Task 4: `tools/left-overs-weigh.py` written (reads a built page, changes nothing).
- Task 3 done (after `main` had small-things, merged at `64776ca`): flames lean north-east; tried 3.5 then 5 then
  back to 3 degrees a finger after looking at pictures (5 was a gale on a 1 m fire). Leaned blocks (hearths, the
  engine's campfire, the shipyard's braziers) became slanted slabs: put back. Bridie's painted lantern: an added 3D
  flame looked wrong on the painting: taken out.
- Task 2: great wraith played at 1280x720: won (50 min here). The other eight run after the checks.


