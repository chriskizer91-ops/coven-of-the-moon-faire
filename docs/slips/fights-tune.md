# fights-tune: foes met more often in the wilds, and the two smallest creatures stand bigger

Branch: `job/fights-tune`      Updated: November 25, 2026

## Report for the hub

**Done.** Foes are met about three times as often in zone 1 and twice as often in zones 2 to 4, with the level at
each big fight unchanged. The Forge-Spark stands 0.75 m with a stronger glow, the Wickstoat 0.8 m. Every target of
`node tools/encounter-balance.mjs` is met (two of its fight counts are restated for the new spacing: see "Targets").

### What Chris felt (zone 1, before this job)

She starts in the Moon Faire's camp, 5 m from its middle. The camp and its margin are safe for 61 m round its middle,
so she runs **56 m before any meeting can come** (19 s at her run, 3.0 m a second; 11 s with Shift, 5.2 m a second).
After that, nothing for 70 m, then each metre had a small chance. Round Wickhollow (the woods, where Chris ran) a
meeting came every **260 m** on average.

| Zone 1, at her run (3.0 m a second) | Before | Now |
|---|---|---|
| From the start to the first meeting | **on average 316 m, 106 s** (1 time in 10 over 560 m, over 3 minutes) | 71 to 101 m, **24 to 34 s** |
| Between meetings in the woods round Wickhollow | 260 m, **87 s** | 79 m, **26 s** |
| Between meetings in the open wilds, the thorn country, the fen, the long road | 200, 170, 160, 220 m (53 to 73 s) | 61, 52, 49, 67 m (16 to 22 s) |
| The grace after any fight (won, run from or lost) | 70 m, 23 s | **25 m, 8 s** |
| Coming out of a town or the camp | at least 35 m of calm | at least 12 m (none before the page's first meeting) |

Zones 2 to 4 before: every 105 to 130 m (35 to 43 s); now every 49 to 62 m (16 to 21 s).

### The numbers before and after

| | Before | Now |
|---|---|---|
| Metres between meetings in the wilds (average) | 191 in zone 1; 125, 115, 118 in zones 2 to 4 | **58 in every zone** |
| Fights a zone, the attentive player (zones 1 to 4) | 45, 45, 45, 46 | **147, 96, 89, 93** |
| Fights in the whole game | **181** (Chris's earlier "about 180") | **424** |
| What an ordinary meeting gives (`reward`: experience and shards, against the battle's own) | 0.31, 0.27, 0.29, 0.70 | **0.094, 0.125, 0.146, 0.345** |
| Herbs | a meeting gives none (herbs are picked on the land) | unchanged |
| Km of wilds walked to each big fight's level | 8.6, 5.6, 5.2, 5.4 | **8.5, 5.6, 5.1, 5.4** (the same) |
| Level after the story's own walk, walked once (the big fight asks 5, 10, 15, 20) | 5.1, 8.0, 14.8, 18.5 | **5.2, 8.0, 14.8, 18.6** (the same) |
| Time spent fighting to the last big fight (the battle's own reckoning) | about 5.1 hours | **about 11.5 hours** |
| Forge-Spark, height standing | 0.49 m | **0.75 m** (on a 1280x720 fight: 48 px tall, now 64 px) |
| Wickstoat, height standing | 0.60 m | **0.80 m** (54 px, now 68 px; a witch is 170 to 206 px) |

So the level curve holds: the same walk brings the coven to the same level, in about 2.3 times as many fights.

### What changed, file by file (each change marked "fights-tune")

- `game/encounters/plan.js`: **`wilds`, the numbers to change on Chris's word:** `every: 58` (metres between
  meetings, the average in every zone), `first: 30` (the page's first meeting after 15 to 45 m of wilds), `calm: 25`
  (the grace after a fight). And `walk` (the story's walk in km in each zone, read only by the check).
- `game/encounters/draw.js`: the sums that follow from `wilds`. Each ground keeps its share as its zone file sets it
  (kinder near home, harder in the fen); the zone's average becomes `every`; what a meeting gives is divided by the same
  amount (`CovenDraw.often`, `.every`, `.reward`, `.calm`, `.first`, `.planFights`). A zone file may set its own
  `wildsEvery` to differ from the rest. The zone files themselves are unchanged.
- `game/encounters/meetings.js`: reads those; the page's first meeting; the grace.
- `game/encounters/land-fights.js`: one line, a road stone's reward follows the same scale. (It does not touch
  `bigFight`: the last-foe slip's item 3, call C4, is in other lines, so the two do not clash.)
- `game/battle/models/m7/m7-foe.js`: a creature's data may say `tall` (metres). Its whole model is drawn that much
  bigger, through a size group between its root and its body, so its own motions, effect, where blows land, and how it
  arrives and is let go grow with it. A creature without `tall` is drawn exactly as before.
- `game/battle/models/m7/forge-spark/forge-spark.js`: `tall: 0.75`; its fire brighter (`glowK` 1.6 to 2.5); more and
  brighter embers (24 to 36, brightness 1 to 1.7).
- `game/battle/models/m7/wickstoat/wickstoat.js`: `tall: 0.8`. Its nine spines and their sparks hang on its bones and
  grow with it.
- `game/encounters/slots.js`: each creature's look follows its `tall`: the stated height (the camera and the frame
  check read it), its shadow, its glow on the ground (the Forge-Spark's: 0.9 m, now 1.54 m), how near it comes to
  strike (its own part of the distance), and how far off the witches stand (half its length, grown). The Glowcap and the
  other five are untouched.
- `game/pages/creatures-row.html` (new, not in the game): the creatures' page with all eight, for the row picture.
- `tools/encounter-balance.mjs`: plays the new numbers; `--old` plays the old ones, `--every 80` tries another
  spacing; a new table, THE WALK (metres, km to each big fight's level, the level after the story's walk, hours of
  fighting, rests and lost fights for each km).
- `tools/encounter-test.py`: counts meetings against the spacing now; new checks: the page's first meeting comes
  soon, and the grace begins after a fight; its fights-to-level give-or-take grows with the plan's fights.

### Targets

All met. Two are counts of fights, and those counts are what Chris's newer word changes, so they are restated, not
loosened: **fights to each gate's level** is now the plan's 45 times how often meetings come (148, 97, 89, 91; give or
take 6 times the same); **the three settings stay within 3 fights of each other** became 3 times the same (6 to 10). In
their old form, the first would be missed in every zone (147 against 45) and the second once, by 0.3 fights (zone 4
with A and B on: 89.8 against 93.0, allowed 3). Every other target is unchanged and met: how often each player loses a
fight, the slots against the ordinary fights, every big fight's wins (`--gates`: the great wraith 93%, the node 98%,
the knight 94%, the bramble 95%, the fire 100% for the attentive player, as before).

### Checks

| Check | Result |
|---|---|
| `node tools/encounter-balance.mjs` (after merging `main` at c644a0f) | **every target met**, 424 fights; `--old`: every target met, 181 (the old table, to the fight) |
| `node tools/encounter-balance.mjs --gates` | **every target met** |
| A walk with no browser through `meetings.js` (scratch, 400 walks a zone) | first meeting after 16 to 45 m of wilds; never two closer than 26 m |
| `node tools/m7-stretch.mjs --frames 48` | the six M7 creatures pass, as before (size does not change it; the two peak creatures need Blender, as before) |
| `encounter-test` zone 1, whole | **41 good, 0 failed**, 0 page errors: one meeting every 50 m in the fen to 83 m round Wickhollow (want 49 to 79); first meeting 17 m out of the camp; grace 25 m; about 145 fights to level 5 (plan 148) |
| `encounter-test --quick` zone 2 (on the page built after merging `main` at c644a0f) | **37 good, 0 failed**, 0 page errors; first meeting 18 m out of the camp |
| `encounter-test --quick` zones 3 and 4 | ENC-RESULTS |
| `encounter-fights-test` zone 2 A (the Forge-Spark) and zone 4 A (the Wickstoat), played to their end | **7 good, 0 failed**: both won (17 and 20 turns), each drawn by its own model |
| `battle-frame-test` on the lab page: zones 1 A and B, 2 A, 4 A and B, at 1280x720, 412x880, 880x412 | **267 good, 0 failed**, 0 page errors: every fighter whole on screen, clear of the panels |
| the row of eight, before and after | heights 0.49, 0.60 then **0.75, 0.80**; the other six the same; 0 page errors |

### Pictures (in the job's scratch folder, `fights-tune/`)

- **Show Chris:** `pics-before/row-1280x720.png` and `pics-after/row-1280x720.png` (the eight beside a witch, before
  and after); `frame-before/zone-2-A-rest-1280x720.png` against `frame-after/zone-2-A-rest-1280x720.png` (the
  Forge-Spark in a fight), and the same for `zone-4-A` (the Wickstoat).
- Also: every fight picture at the three sizes in `frame-after/`, their numbers in `frame-numbers.json`.

### What could not be checked here

How it feels to walk it (the counts are by numbers), frame rate, anything in motion (the glow's flicker, the embers),
sound, touch. Whether 424 fights feel too many. The pictures are stills from a browser with no graphics card.

### My calls (each one line of data)

1. **58 m in every zone, zone 1 too.** The brief said "about twice as often, about every 50 to 65 m". Zone 1 was
   sparser than the brief thought (191 m, not 100 to 130), so 58 m there is 3.3 times as often (147 fights, 3 hours of
   fighting to the great wraith). *The other choice:* `wildsEvery: 96` in `zone-1.js` makes zone 1 twice as often
   (about 90 fights; the woods every 130 m, 43 s).
2. **The woods round Wickhollow stay the kindest ground** (79 m, against 49 in the fen), as the fights job set it.
3. **The page's first meeting after 15 to 45 m of wilds**, every time a zone page is opened, not only the first time.
4. **The grace is 25 m** (8 s at a run, about 20 s walking). Flee works as before (one try in two, as the battle has
   it), and after any fight the grace begins.
5. **A road stone's fight is scaled like the rest** (it stays worth 1.5 ordinary fights).
6. **Wickstoat 0.8 m: the hub's call**, as the brief said. Forge-Spark 0.75 m: Chris agreed the hub's suggestion.
7. **The Forge-Spark's glow:** its fire 2.5 times lit (was 1.6), 36 embers (24), its ground glow 1.54 m. No real light
   was added (one would light the witches and the ground, but slows every material on a phone).

### For the hub

1. **The big one: more fights also cost more on the way.** A fight hurts as much as before, and three times as many
   come in a km. By the check's reckoning, for each km of wilds the attentive player now rests 5 to 6 times (before
   1.4 to 2.9), and the careless player loses 2.3 to 4 fights a km in zones 2 to 4 and wakes at the camp (before 1 to
   2). In zone 1 the attentive player loses none. On the land a rest is a walk back to a fire. This may undo some of
   what Chris asked for. A suggestion for Chris, **not built**: after a fight in the wilds the four get back part of
   what they lost (one number), so a km costs what it did. Or a lower `every` only in zones 2 to 4.
2. **Roads are not safe, and were not before.** The brief said "roads, camps and towns stay safe as they are": camps
   and towns are safe; a road has always been ground for meetings, at its own rate (zone 2's road is 60% of its
   fights). Left as it was. Making roads safe would need the balance redone.
3. **`docs/decisions.md`:** Chris, November 25: foes met more often in the wilds; the Forge-Spark about 0.75 m with a
   stronger glow; the Glowcap keeps its size. Chris's "about 180 fights" is now about 424 (at `every: 58`).
4. The lab pages (`fights-lab.html`, `creatures-lab.html`) give a slot's fight the zone's old `reward`: only on those
   pages, and only experience shown on the end card.
5. The commit lines end with this sub-agent's own trailer lines, as the other jobs' do.

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
