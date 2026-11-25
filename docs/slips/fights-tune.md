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
- Before pictures done (16:58): the row of eight (heights 0.49, 0.60, 0.78, 0.90, 2.06, 2.00, 2.05, 2.60 m) and the
  Forge-Spark and Wickstoat fights at 1280x720 (`battle-frame-test`: 34 good, 0 failed; on screen the Forge-Spark 48 px
  tall, the Wickstoat 54 px, a witch 170 to 206 px). Then the machine's usage ran out at about 17:00.
- 22:55: `origin/main` (60c8584, the left-overs job) merged in, no clash: it touched none of this job's files. The
  after builds and checks started again.
- Correction: `node tools/m7-stretch.mjs` checks the six M7 creatures only (all pass); the two peak creatures' own
  check needs Blender, as before. Their size changes nothing a stretch check measures.
