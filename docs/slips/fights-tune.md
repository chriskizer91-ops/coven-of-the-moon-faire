# fights-tune: foes met more often in the wilds, and the two smallest creatures stand bigger

Branch: `job/fights-tune`      Updated: November 25, 2026

(The report for the hub goes first here when the job is done.)

## Running log

- Read the brief, the rules, the fights and creatures slips. Measured what Chris met (below, "What Chris felt").
- `node tools/encounter-balance.mjs` on the code as it was: every target met, 181 fights (`balance-before`).
- Step 1 (commit `55bed5d`): one number for how often (`wilds.every` in `game/encounters/plan.js`, 58 m), a grace of
  25 m after each fight, the first meeting of a page after 15 to 45 m of wilds; what a meeting gives scaled in step.
  `node tools/encounter-balance.mjs`: every target met, 424 fights; `--old` gives the old table again (181).
