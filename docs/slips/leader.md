# leader: who leads, chosen in the menu (any of the four)

Branch: job/leader      Updated: 2026-11-25

(Being written. The report for the hub comes first when the job is done.)

## Running log

- 15:40 Read the brief, the rules, the menu's slip, the walker, the saves, the journey. Made a small page of the job's
  own, `game/pages/leader-lab.html` (Wickhollow and its land, the four witches, the menu: 39.6 MB built).
- 16:10 First pictures on the small page: the one in the red hat who walks today is **Io**, not Kore (Kore is the
  jester in plum). Code started: the leader kept in the save (`coven.leader`), the walker made as the leader, the
  Coven tab's "Who leads" row.
- 17:00 First run on the small page. Found: a slip of mine had taken the walker's `isBusy` out (fixed). Measured the
  four's feet: **Kore's and Europa's run was never played on the land** (`walkers.js` gave their model 0 for its run),
  and their steps went round at about a quarter of the pace the ground went by, so their feet slid. Fixed in
  `walkers.js`: their own run, and steps that keep pace (9.9 and 12.3 radians a second at a walk and a run).
