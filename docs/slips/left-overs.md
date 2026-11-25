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
