# zone-1: all of zone 1 on one land

Branch: job/zone-1      Built by: the hub      Updated: November 18, 2026, late evening

**State: part done.** All six places stand on one land and are joined by roads. Still to come before this is
milestone 2: the Moon Faire's camp (where the game starts), a choice of who walks, the zone's shape taken from the 3D
map, and the long road out toward zone 2.

## What it built

One page: **`game/pages/zone-1.html`**. Build it with `python3 tools/build.py game/pages/zone-1.html`; the file to
open is `builds/zone-1.html` (69.6 MB, everything inside).

- **Six places on one land, 955 m by 645 m**, walked between with no fade:

  | Place | Where its middle is (metres east, south of Wickhollow's square) | How it is reached |
  |---|---|---|
  | Wickhollow | 0, 0 | the game starts here for now |
  | The Thornwood | 226 east | east over Wickhollow's bridge, 85 m of road, in at its west gate |
  | Bogmire | 463 east, 9 south | out of the Thornwood's east gate, 95 m of road |
  | The fen's dark heart | 464 east, 159 north | 75 m up Bogmire's north road |
  | Io's cottage | 30 west, 205 south | 112 m down Wickhollow's south road |
  | The jetty | 190 west, 250 south | 110 m along the cottage's west road |

- **The Thornwood is the old Envoi's own place now**: its bridge and lantern, its stream in its ravine, its standing
  stones, shrine, ruined walls and pool. The stone ring and pool made up for the first test are gone from this page.
  It is a wood inside a thorn hedge with a gate west and a gate east; its trails now run on to the edge of its ground.
- **One night for the whole zone.** One moon, one sky, one fog. The fog comes round to each place's own as she nears
  it: Wickhollow's ends at 115 m, the Thornwood's at 42, Bogmire's at 100, the dark heart's at 78 (and goes green-black).
- **Each place's water carried on by rule** where it reaches the edge of its ground (the Thornwood's stream runs on
  north and south to the land's rim).
- **A town's stone runs out along its road** (and in along the road arriving), then wears down to earth.
- **The land rises to meet a boardwalk** where one reaches a place's edge (the dark heart's road).
- **The Flipbook look's counter** now counts the whole frame (it showed "0 triangles, 1 draw call", as Chris saw).

Where the new code is:

| File | What it is |
|---|---|
| `game/engine/land/zone.js` | New. Builds each place, sets it at its spot, shares the night, the sky and the textures, and answers the walker for all of them |
| `game/engine/land/land.js` | Reworked from one place to many: meets every place's edge, a ground material per place, the water rule, the stone rule |
| `game/places/zone-1.js` | New. Which places, where, the roads, the land |
| `game/places/wickhollow-open.js` | The four changes that open Wickhollow, moved out of the first test's file so both pages share them |
| `game/places/thornwood.js` and four more, with their `-trees.js` | From the new Envoi, unchanged |
| `game/data/maps-*.js` | Each place's walking areas |
| `tools/zone-test.py` | New. Walks between the places and checks it by numbers |

## Hub's calls made here

(Also in `docs/decisions.md`.)

- **Every place is built when the page opens, and kept.** Chris's laptop and phone ran the first test at their screens'
  top speed (144 and 60 frames a second), so there is room. It keeps walking free of stalls. The cost is a longer wait
  at the start and a bigger file.
- **Where the places stand** is the hub's layout: they join the way their roads join in the old Envoi, with the
  distances squeezed to 62 to 112 m of road between neighbours.
- **The Thornwood keeps its hedge and its two gates.** Elsewhere on the land she can walk anywhere; the Thornwood's
  heart is entered by its trails.
- **The other four towns are opened to the edge of their own ground**, as Wickhollow was.
- **Each place's lake or fen stays inside that place's own ground** for now (the jetty's lake, Bogmire's fen and the
  cottage's stream all end at a shore inside it). Only water that reaches the edge is carried on.

## What was copied in

31 more lines in `assets/INDEX.csv` (89 in all): the five places' files, their walking areas, and 16 more of Chris's
textures with their labels. All from the new Envoi, `main`, commit `d450c3f`. The place files are unchanged; what
opens the Thornwood's gates is in `game/places/zone-1.js`.

Changed after copying: `game/engine/place/walker.js` (the frame's counts; marked "Coven").

## What was checked, and how

With a browser that has no screen and no graphics card:

```
python3 tools/build.py game/pages/zone-1.html
python3 tools/zone-test.py builds/zone-1.html
python3 tools/look.py builds/zone-1.html <a folder> --plan <plan.json>
```

| Check | Result |
|---|---|
| Wickhollow's bridge, along the road, into the Thornwood | arrived; height never jumped more than 4.7 cm |
| The Thornwood's east gate to Bogmire | arrived; 1.0 cm |
| Bogmire's north road to the dark heart | arrived; no jump (before the land rose to meet the boardwalk, there was a 94 cm step) |
| Wickhollow's south road to Io's cottage | arrived; 7.2 cm |
| The cottage's west road to the jetty | arrived; 1.8 cm |
| The jetty back to Wickhollow, straight through the woods | arrived |
| The land's rules at 3,533 spots | every spot has a height; no spot in water can be stood on; 88% can be stood on |
| Page errors | 0 |
| Time for the page to start (this machine, no graphics card) | 12 seconds for six places (8 for one) |
| What is drawn | 150,000 to 435,000 triangles, 105 to 375 draw calls |
| The first test | still builds and still passes its own checks |
| Looked at by eye, in 24 pictures | each place, each road arriving, the Thornwood's stream leaving its ground |

**Not checked:** the frame rate; anything in motion; whether a phone will open a 70 MB file; how long a real phone
takes to start.

## Unfinished, and known rough spots

- **The Moon Faire's camp is not built.** The game still starts in Wickhollow's square.
- **Only Io walks.**
- **The land's shape is still rules, not the 3D map's.**
- The land round Bogmire wears Wickhollow's grass and woods, not the fen's own ground and reeds.
- Wickhollow's lake and the jetty's lake are two lakes with woods between.
- The cottage's stream ends at a bank inside the cottage's ground.
- The ground changes tone in a line where the land meets the Thornwood's own ground at its west gate.
- The keepsake shimmers are still left out.
- The file is 69.6 MB, of which 49.6 MB is 98 pictures. The textures could be made smaller for a phone build.

## For the hub

- Where the camp goes: there is not room for it between Wickhollow's south road and the river (30 m). The meadow west
  of the south road, south of the lake (about 70 m west, 150 m south), is free.
