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

## Task 1: small folk stand straight

**The fix was already in `main`.** The journey job made it on November 24 (`53f7cfa`, in
`game/witches/kore/jester_kit.js`, `solveLimb`, marked "Coven"). It divides the reach by the person's size *after* the
direction is made a unit; the townsfolk job's line as written divided it before, which bends them the other way. I
checked that `root` at that spot is the jester group made in the kit (line 1899), and that the size is set on that
same group: `game/people/folk/person-kit.js` (height and build, `J.root.scale.set`) and `game/people/people.js` (the
zone's size, `n.root.scale.multiplyScalar`). Kore is made by the same kit at size 1, so she cannot change. Europa has
her own copy of the solver, untouched. **So I changed nothing for this task.**

How it was proved: each zone page as built (after), and a copy of it with that one line undone inside it (before).
`tools/left-overs-folk.py` stands each person two seconds, puts the camera in front, and measures the knee and elbow
(hip, knee and ankle in a line is 180 degrees; a crouch is about 90).

| Who | Where | Size | Knees before | Knees after |
|---|---|---|---|---|
| Pell | zone 1, Bogmire | 0.73 | 92 | **165** |
| Tamsin | zone 2, Dawnroost | 0.73 | 92 | **165** |
| Tock | zone 3, the shipyard | 0.62 | 77 | **174** |
| Pim | zone 3, the shipyard | 0.59 | 72 | **168** |
| Tobb (full size) | zone 1 | 1.00 | 165 | 165 |
| Nettie (a little taller) | zone 1 | 1.02 | 174 | 165 |
| Io, Kore, Europa, Callisto | zone 1 | 1 (Europa 1.045) | 170, 173, 165, 175 | the same |

Elbows go the same way (Pell 89 to 151, Tock 80 to 174). Nettie: before, anyone even a little taller than a witch was
pulled ramrod straight (the reach was cut to the longest the leg allows); now she stands as Tobb does. In the pictures
the change in her cannot be seen (her dress hides her knees). 0 page errors on every page.

Checks: `townsfolk-test` on the line-up page: **385 good, 0 failed**. `people-test` zone 1: **134 good, 0 failed**.
`zone-test`: run on all four zones after task 3 (below), which covers this too.

## Task 2: the nine big fights, played again (DROPPED on the hub's word)

The hub dropped this task at 15:35 (two other jobs are changing the fight camera and the last foe's model, so a replay
now would be out of date). How far it got, on the lab page built from this branch at `509d4f8`, at 1280x720, with
`tools/encounter-fights-test.py` (it now takes `--size`; the fights job played at 320x180), the expert player, turbo 60:

| Fight | Result | Turns | Time here | Checks |
|---|---|---|---|---|
| Zone 1, the great wraith (level 5) | **won** | 77 (the fights job's run: 51) | 50 min | every check passed, 0 page errors |
| Zone 2, the stone by the bridge (level 7, two frost wisps) | **won** | 12 | 5 min | every check passed, 0 page errors |
| Zone 2, the stone in the ring | started, then stopped when the task was dropped | | | |
| the other six (the third stone, the night at the node, the knight of light, the fire's two forms, the great bramble) | not played | | | |

Nothing odd was seen in the two. At 1280x720 a big fight takes most of an hour here (each frame is slow without a
graphics card), so all nine would take about eight hours of the shared browser. The 412x880 frame check on the nine
(`tools/battle-frame-test.py --only greatWraith,stone-road,...`) was queued and taken back before it ran: it can reach
the big fights by their lab names as it is, no change needed.

## Task 3: flames that lean north-east

**Which way.** The lines and the story say **north-east**: "Every flame in the camp is leaning north-east" (Callisto),
the Grey Hat's pennant "North-east, always", "Everything leans north-east up here" (Kore, zone 3), and the story page
("every flame at the Faire leans north-east"). Only one line says "north" (Io at the cottage, "Even here they lean
north"). The board and my brief say "north". **My call: north-east, as the lines say. It is one number** (`toward: 45`
in the data; 0 is north). Chris or the hub may change it.

**Where north is.** Read from each zone's map data, not assumed: every zone's land lies on the map of Aethermoor by a
shift and a scale and no turn (`atlas.map` in `game/places/zone-1.js` to `zone-4.js`: the map's x is the land's x, the
map's y is the land's z), and the small map draws the land's -z at the top, under its N. So on all four zones north is
-z and east is +x.

**How far.** Odile measures the lean in fingers' widths: "two at dusk, then three, then four" ("Four fingers now" at
stage 2), and after the great wraith "a finger less than at dusk". Zone 2: "The flames lean harder here than at the
lake." Zone 3: "The lean's worse up here." At the Faire at the end: "Every flame standing straight." So, in fingers,
stage by stage (0 to 4): zone 1: 2, 3, 4, 4, 1; zone 2: 5; zone 3: 6; zone 4: 6, then 0 once the fire is ended
(stage 4); the Faire ending: 0. **One finger is 3 degrees** (so 6 degrees at dusk, at most 18). A proposal, as data;
I tried 3.5 (too small to see on any fire), 5 (a metre-tall fire leant like a gale) and settled on 3 from the pictures.

**The data, in one place:** `game/look/flame-lean.js`. `on` (one switch: false and every flame stands straight),
`strength` (one number for all: 1 as now, 0.5 half, 2 twice), `toward`, `fingerDegrees`, `flicker` (0.22: the lean
wavers by about a fifth, at two quick rates, and the flame's height a little), and the fingers zone by zone.

### What leans now

| Flame | Where | How it is drawn | Now |
|---|---|---|---|
| Every lantern the place engine draws: on walls, posts, pillars, the well, the cottage's gate pillars | every town on all four zones (Wickhollow 33, Bogmire 17, the jetty 12, the cottage 11, Dawnroost 35, the shipyard 46 and more) | was one glowing block of "glass"; now see-through glass and a small flame inside (a cone in a cone, 20 cm tall at the usual size) | **leans** (too small to see much on a lantern at dusk: about 1 cm at the tip) |
| The Grey Hat's ship lanterns at the landings | zones 2, 3, 4 | the same lantern (small-things made them the engine's lanterns) | **leans** |
| The Warm Roads camp's fire | zone 2 | tongues of fire (triangles) | **leans** |
| Dawnroost's node: fire bowls and braziers | zone 2 | tongues of fire | **leans** |
| The frozen camp's fire | zone 4 | cones of fire | **leans**, and stands straight once the fire is ended |

How: the place engine's builder has one new call, `B.leaning(root height, draw)`. Everything drawn inside it remembers
how far above the flame's root each corner is; the engine's shader moves those corners north-east by that height times
the lean, with the flicker on the game's own clock. Everything else remembers 0 and does not move. A page without the
data file draws every flame straight.

### What does not lean, and why (each would need remaking first)

- **Fires made of glowing blocks**: the engine's own campfire (the northern camp, zone 3), the shipyard's braziers
  (zone 3), the forges' and Wickhollow's inn hearths. Leaned, a block becomes a slanted slab (tried and looked at:
  it looks wrong). They would need flame shapes first.
- **Painted pictures** from the Faire's kit: the Moon Faire camp's lantern posts and braziers (zone 1), and **Old
  Bridie's lantern**: her lantern is one of the Faire's painted lantern posts, its flames painted on its glass. I
  tried a small 3D flame inside it: it showed as a pale cone across the painting, so it is out. So her lamp does not
  "stand almost straight" after the great wraith; it stands as it always did. To do her line properly her lantern
  would need to be one of the engine's own lanterns (Chris's call: it would look different).
- **Points of light**: every lamp's soft halo, the gate lamps' wide glows, the moving warm lights, the lamplight
  painted on the ground. They have no shape to lean.
- **The twelve lamps that come home to the Grey Hat's ship in zone 1** (plain glowing boxes on hooks, the story's).
- **The flight's ships** (Skies of Aethermoor's painted lantern cards) and the moored ship's crystal glows.
- **No warm flame to lean**: zone 4's Misthollow and Moonwell (put out by the story), the Warm Roads camp's candle (a
  glowing stick with no flame on it).
- Flames in fights and spells are not the land's.

**Something else that changed with it (please look):** a lantern's glass is now see-through and a little darker; from
a few metres the lantern reads less like a solid lit block. The halo round it is the same.

### Pictures

`left-overs/flames/flames-sheet.png` in the scratchpad (see the report's top): four flames, before and after, with
north-east marked (the camera looks north-west, so north-east is straight to the right). Single pictures:
`flames/<name>-before.png` and `-after.png`: `wall` (zone 1, dusk), `wall2` (stage 2), `wall4` (after the wraith),
`campfire`, `bowl`, `lamp2` (zone 2), `frozenfire` and `frozenfire4` (zone 4 before and after the fire is ended),
`hearth`, `northfire`, `brazier` (the block fires, from the try that was put back), `bridie0` and `bridie4`. **A still
cannot show the flicker; nobody here has seen it move.**

## Task 4: what a zone page is made of (a report; nothing was changed)

Measured with `python3 tools/left-overs-weigh.py builds/zone-N.html` on pages built from this branch at `509d4f8`
(main before small-things). It reads the page as text and changes nothing. MB here is 1,048,576 bytes, as the builder
counts. "As text" is what it weighs inside the page; "as files" is what the same thing weighs as a file on its own.

### What each page holds

| | zone 1 | zone 2 | zone 3 | zone 4 |
|---|---|---|---|---|
| The whole page | 119.0 | 105.3 | 103.8 | 95.8 |
| Pictures (as text) | 89.6 (280 of them) | 87.9 | 85.0 | 77.6 (250) |
| Sound (as text) | 17.4 (396 recordings) | 5.7 | 6.0 | 5.6 (142) |
| Models packed as text | 5.0 | 5.0 | 6.0 | 5.5 |
| Code and plain data | 7.0 | 6.8 | 6.8 | 7.1 |
| Of all that: the cost of packing files as text | 28.0 (24%) | 24.6 | 24.3 | 22.2 (23%) |
| Of all that: second and later copies of the same picture | **30.4** | **28.3** | **18.1** | **19.3** |

- **How sound is stored:** every recording is an mp3 file put in the page as base64 text (4 letters for every 3
  bytes). All 396 on zone 1 are 64 kbit/s, one channel, 44.1 kHz, variable rate. Zone 1 carries its own 254 lines
  (11.9 MB as text) and all 142 of zone 4's (5.6 MB), because the Faire ending can open on zone 1's page.
- **How pictures are stored:** webp (and a few png and jpeg) files, as base64 text, wherever a script names them.
- **How models are stored:** as numbers in code, or as base64 text (some first squeezed with gzip).
- **Why the copies:** each place file (Wickhollow, the cottage, the jetty, Bogmire...) names the shared textures by
  path, and the builder packs the picture again at every place that names it. Shared stone wall is in zone 1's page 6
  times (0.84 MB each).

### The twenty largest things, every copy counted (MB as text)

Zone 1: 1. shared stone wall, 1254x1254, 6 copies, 5.06 · 2. mossy thorn rock, 5 copies, 4.59 · 3. dirt track, 4
copies, 3.49 · 4. boardwalk planks, 5 copies, 3.42 · 5. moss ground, 3 copies, 2.71 · 6. oak bark, 3 copies, 2.25 ·
7. meadow grass, 3 copies, 2.14 · 8. dead bark (Eldergrove's), 2 copies, 2.11 · 9. leaf canopy, 4 copies, 2.09 ·
10. the map of Aethermoor's ground, 2048x3584, 2.08 · 11. the 3D map's places (gzip), 1.76 · 12. drystone, 3 copies,
1.75 · 13. bridge paving, 2 copies, 1.72 · 14. town cobbles, 3 copies, 1.71 · 15. bank grass, 2 copies, 1.68 ·
16. awning stripes, 2 copies, 1.63 · 17. dark water, 5 copies, 1.54 · 18. plank wall, 2 copies, 1.40 · 19. timber
and plaster wall, 2 copies, 1.38 · 20. river water, 3 copies, 1.36. (All but two are Chris's land textures, from
`game/texture-packs/made-web/`.)

Zone 4: 1. snow-laden fir, 5 copies, 3.88 · 2. ice, 4 copies, 3.50 · 3. snow, 5 copies, 2.69 · 4. frosted stone wall,
3 copies, 2.68 · 5. trodden snow trail, 4 copies, 2.50 · 6. frozen cliff rock, 3 copies, 2.24 · 7. snowy cliff rock, 3
copies, 2.22 · 8. dead bark, 2 copies, 2.11 · 9. plank wall, 3 copies, 2.10 · 10. the map's ground, 2.08 · 11. the 3D
map's places, 1.76 · 12. frosted setts, 2 copies, 1.65 · 13. boardwalk planks, 2 copies, 1.37 · 14. frozen waterfall
ice, 2 copies, 1.16 · 15. market produce, 1.08 · 16. lake ice, 1.08 · 17. the map's heights (png, 1152x768), 1.08 ·
18. Moonwell court setts, 1.06 · 19. frosted bridge planks, 0.98 · 20. Moonwell garden frost, 0.95.

The largest by source file (zone 1): `engine/place/extras.js` 15.0, `people/voice-z1.js` 11.9, `places/wickhollow.js`
10.5, `places/cottage.js` 10.3, `places/bogmire-heart.js` 9.8, `places/jetty.js` 7.6, `places/bogmire.js` 7.0,
`places/thornwood.js` 6.7, `people/voice-z4.js` 5.6, Callisto's textures 4.4, the map's art 2.9, the flight 2.9.

### Ways to make the pages smaller WITHOUT changing what Chris sees or hears

| Way | Saving (zone 1 / zone 4) | How sure | Risk |
|---|---|---|---|
| **Pack each picture once.** The builder puts each picture in the page once, and every place that names it reads that one copy. Only `tools/build.py` changes | **30.4 / 19.3 MB** (zone 2: 28.3, zone 3: 18.1). Zone 1 would be about 89 MB | measured (the same letters found 2 to 6 times) | low. The page also holds one copy in memory instead of six, which helps a phone. Every check would need running again |
| **Zone 1 carries only the Faire's lines of zone 4's.** The Faire ending and the homecoming use 41 of zone 4's 142 recordings (1.15 of 4.18 MB as files) | **about 4.0 / 0 MB** | measured from the lines' own `moment` | low, if no other zone 4 line can play on zone 1's page (faire-test and journey-test would show it) |
| **Leave the code's comments out of the built page** (the sources keep them) | **about 1.7 / 1.7 MB** of the 7 MB of code | estimated (whole-line and end-of-line comments counted) | low to medium: a careless stripper can cut a line that holds `//` inside words. A real minifier would save more (perhaps 3 MB) but needs a tool not in the repo |
| **A denser way to pack files as text.** Base64 costs a third on top of each file. Base85 costs a quarter: | **about 5 / 4 MB** | estimated (1/16 of the packed text) | medium: every picture and sound must be unpacked by the page's own code when it opens, which takes time on a phone (not measured). A denser packing still (about an eighth on top) is possible but riskier |

Together the first three are about **36 MB off zone 1 (119 to about 83)** and about **21 MB off zone 4 (96 to about
75)**, with nothing seen or heard changed.

### Making every page smaller than 95 MB (Chris's word of November 25: every page under 100 MB, for GitHub)

**Done by the first way alone, with nothing seen or heard changed.** `tools/build.py` (the hub's; changes marked
"left-overs:") now puts each picture and sound that a script names in the page ONCE, in a table at the top
(`var __CP = [...]`), and the script reads it from there (`__CP[12]` stands where `"data:..."` stood). It does this only
where the name stands as a plain value in code (`key: "./x.webp",`); I checked every such name in the five big pages'
scripts: all 1,294 stand that way. Anything else is packed where it stands, as before.

| Page, as a file | Before | After | Copies left out | Begin showing here, before | after |
|---|---|---|---|---|---|
| zone 1 | 124.8 MB | **93.1 MB** | 31.7 MB | 9.9 s, 9.1 s | 7.9 s, 8.9 s |
| zone 2 | 110.5 MB | **81.0 MB** | 29.5 MB | 12.5 s, 12.4 s | 12.0 s, 12.0 s |
| zone 3 | 108.9 MB | **90.2 MB** | 18.7 MB | 13.0 s, 13.9 s | 13.5 s, 13.7 s |
| zone 4 | 100.5 MB | **80.5 MB** | 20.0 MB | 11.3 s, 10.9 s | 9.5 s, 10.9 s |
| the Faire ending | 97.5 MB | **65.8 MB** | 31.7 MB | (not timed) | |

(Times: `tools/left-overs-load.py`, the page opened as a player would, two runs each, on this shared machine with no
graphics card: for comparing, not what a laptop takes. The page's text is read faster, 1.5 s against 2.1 s; the rest
is the game building itself.) Each copy left out is also one copy less in the phone's memory.

**The builder now says the real size and stops at 100 MB:** "as a file: 93.1 MB (93122527 bytes)". 1 MB here is
1,000,000 bytes, as GitHub counts. From 95 MB it warns; at 100 MB or more it stops with "STOP" and fails.

**Not done, because it was not needed** (each is ready to be the next step if a page grows again):
- zone 1 carries all 142 of zone 4's recordings for the Faire ending, which uses 41 (the moments `faire` and
  `homecoming`): leaving the other 101 out would save about **4.3 MB** on zone 1. It needs a second voice list kept in
  step with `voice-z4.js` (when zone 4's missing recordings come), so I left it.
- the code's comments left out of the built page: about 1.8 MB a page.
- a denser packing than base64: about 5 MB a page, but every file would then be unpacked by the page's own code.
- Nothing lossy was done: no picture, sound, voice or creature was made lighter.

### Ways that WOULD change what he sees or hears (only on Chris's word; not suggested now)

- **The voices at a lower bit rate.** 64 kbit/s mono is generous for speech; 40 would save about a third of the sound
  (about 6 MB on zone 1, 2 MB on zone 4). A careful ear might hear it. The hub's rule: no voice is made lighter
  without Chris's word.
- **The land textures at 1024 instead of 1254 pixels** would save about a quarter of each, but they would look softer
  up close on a laptop. Not checked how large any of them is ever drawn.
- **The map of Aethermoor's ground (2048x3584)** is drawn on the Maps tab, which can be zoomed; not suggested.

### Not checked

- Whether Chris's phone opens a 100 MB page at all (only his phone can say), and how long the unpacking would take.
- Whether some textures on a zone's page are never drawn on that zone (zone 1's page holds Eldergrove's dead bark; it
  may be the 3D map's or the flight's). Not traced.
