# fights-tune: foes met more often in the wilds, and the two smallest creatures stand bigger

Branch: `job/fights-tune`      Updated: November 25, 2026

## Report for the hub

(Being written: the checks are still running. See the running log at the end.)

## Running log

- Read the brief, the rules, the fights and creatures slips. Measured what Chris met.
- `node tools/encounter-balance.mjs` on the code as it was: every target met, 181 fights.
- Step 1 (`55bed5d`): one number for how often (`wilds.every` in `game/encounters/plan.js`, 58 m), a grace of 25 m
  after each fight, the first meeting of a page after 15 to 45 m of wilds; what a meeting gives scaled in step.
  `node tools/encounter-balance.mjs`: every target met, 424 fights; `--old` gives the old table again (181).
- Step 2 (`0840291`): `tools/encounter-test.py` reads the new spacing; a small page with all eight creatures.
- Step 3 (`70fbed0`): the Forge-Spark 0.75 m with a stronger glow, the Wickstoat 0.8 m. `node tools/m7-stretch.mjs
  --frames 48`: all eight pass, as before.
- Browser steps started in the background, one at a time through the lock (row and fight pictures before and after,
  the frame check, the two creatures' fights, the four zone pages, `encounter-test`).
