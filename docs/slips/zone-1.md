# zone-1: all of zone 1 on one land

Branch: job/zone-1      Built by: the hub      Updated: November 18, 2026, night

**State: part done.** All six places stand on one land and are joined by roads, and the game starts in the Moon
Faire's camp. Still to come before this is milestone 2: a choice of who walks, the zone's shape taken from the 3D map,
the fen's own ground round Bogmire, and the long road out toward zone 2.

Chris ran the six places (before the camp) at 144 frames a second on his laptop and 60 on his phone.

## What it built

One page: **`game/pages/zone-1.html`**. Build it with `python3 tools/build.py game/pages/zone-1.html`; the file to
open is `builds/zone-1.html` (71.0 MB, everything inside).

- **The Moon Faire's camp, where the game starts**: 70 m west and 128 m south of Wickhollow's square, in a levelled,
  trampled meadow off the south road. 43 pieces of Moon Faire's fair kit in Chris's painted skins: the big top, two
  round tents, two square tents, four stalls, a booth, two wagons, the well, the gate, an oven cart, a pie cart, two
  braziers, 14 lantern posts, crates, barrels, bales and tables. 2,724 triangles, two draws. Its lanterns light the
  ground between the tents and light Io. None of it can be walked through.
- **Six places on one land, 955 m by 675 m**, walked between with no fade:

  | Place | Where its middle is (metres east, south of Wickhollow's square) | How it is reached |
  |---|---|---|
  | Wickhollow | 0, 0 | from the camp: out of its gate, up the south road |
  | The Thornwood | 226 east | east over Wickhollow's bridge, 85 m of road, in at its west gate |
  | Bogmire | 463 east, 9 south | out of the Thornwood's east gate, 95 m of road |
  | The fen's dark heart | 464 east, 159 north | 75 m up Bogmire's north road |
  | Io's cottage | 30 west, 235 south | 142 m down Wickhollow's south road, past the camp |
  | The jetty | 190 west, 280 south | 110 m along the cottage's west road |

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
| `game/places/zone-1.js` | New. Which places, where, the roads, the land, and the camp's layout |
| `game/fair/fair.js` | New. Gives Moon Faire's fair kit this game's night, and sets the camp down |
| `game/fair/ow-kit.js`, `game/fair/data/` | Moon Faire's fair kit and its 11 pictures, unchanged |
| `game/places/wickhollow-open.js` | The four changes that open Wickhollow, moved out of the first test's file so both pages share them |
| `game/places/thornwood.js` and four more, with their `-trees.js` | From the new Envoi, unchanged |
| `game/data/maps-*.js` | Each place's walking areas |
| `tools/zone-test.py` | New. Walks between the places and checks it by numbers |

## Added on November 18, late: who walks, the map, the 3D map's land, the long road

- **Any of the four witches can walk.** A hat button, top right, lists Io, Kore, Europa and Callisto. Kore's light
  model is the new Envoi's; Europa's and Callisto's are Moon Faire's. `game/witches/walkers.js` gives the walker any of
  them (`W3D.witch(id)`), and the walker gained `setWho(id)`.
- **A map in the corner** (`game/engine/land/minimap.js`), with her mark; tap it for a big one with names. The first
  one is plain. A better one is being made on its own branch, `job/minimap`, by a sub-agent (Chris's idea).
- **Zone 1 lies on the 3D map of Aethermoor.** The map's two data pictures (how high each spot is, what kind of
  ground it is) are copied in, and `game/engine/land/atlas.js` reads them. Each place is pinned to its own spot on the
  map. Round a place the land is the map shrunk 6 times; between places it stretches to fit. From the map the land
  takes: its **hills** (heights divided by 8, between 6 m down and 14 m up); its **water** (lakes, rivers and the
  fen's pools and channels); its **fen** (the fen's own ground, reeds, bare trees, a low green-grey mist); its **open
  grass** (fewer trees) and **pine forest** (firs).
- **Bogmire and the fen's dark heart stand in the fen's water**, which now comes right up to their own.
- **A road crosses water on a raised bank of earth.**
- **The long road toward zone 2: 6.07 km.** It leaves the jetty road, goes west to a gate at the zone's edge, then
  north-north-west to where zone 2's Warm Roads camp will be. Along it the land is the map at its **true size**: it
  climbs about 165 m over a forested hill and comes down again. She can walk 70 m either side of it. It ends at a
  hedge for now ("The end of the road, for now").
- **Numbers.** The zone's ground now stands between 6 m below and 18 m above Wickhollow's square. 79% of spots on
  the zone's land can be stood on (it was 89%: the rest is the new water). 546 of 550 spots along and beside the
  long road can be stood on. A near piece of ground takes 6.2 thousandths of a second to make (it was 4.4).
- **Checked** (`tools/zone-test.py`, all passed, 0 page errors): the seven walks between places; the gate road; three
  stretches of the long road at a sprint (the first 600 m, over the highest hill, the last 300 m), her height never
  jumping more than 5 cm in a thirtieth of a second; no spot in water can be stood on. The first test still passes.
- **Not checked:** the frame rate with any of this (only Chris's laptop and phone can show it); the whole 6 km walked
  in one go; how the three other witches look from every side while walking.

## Hub's calls made here

(Also in `docs/decisions.md`.)

- **How the zone lies on the map.** Envoi's 3D map has zone 1's places up to 8 km apart; here they are within 1 km,
  as Chris asked. So the zone cannot be the map at one size. Each place is pinned to its spot and the land between
  is stretched. The map's heights are divided by 8 so the hills can be walked. The numbers are in
  `game/places/zone-1.js` (`atlas`), easy to change.
- **The long road is the map at true size**, straight from the zone's west gate to zone 2's first place: 5.98 km on
  the map, 6.07 km with its bends. It leaves from the jetty road because Wickhollow's west side is the lake.
- **How long it takes.** She walks at 1.3 m a second, jogs at 3.0, sprints at 5.2 (Shift on the laptop). The long
  road is about 20 minutes at a sprint and 34 at a jog.
- **Water by hand wins over the map's.** Within 55 m of Wickhollow's river and lake, and near the camp and the towns
  that do not stand in water, the map's water is left out.
- **Every place is built when the page opens, and kept.** Chris's laptop and phone ran the first test at their screens'
  top speed (144 and 60 frames a second), so there is room. It keeps walking free of stalls. The cost is a longer wait
  at the start and a bigger file.
- **Where the places stand** is the hub's layout: they join the way their roads join in the old Envoi, with the
  distances squeezed to 62 to 112 m of road between neighbours.
- **The Thornwood keeps its hedge and its two gates.** Elsewhere on the land she can walk anywhere; the Thornwood's
  heart is entered by its trails.
- **The other four towns are opened to the edge of their own ground**, as Wickhollow was.
- **Where the camp is, and how it is laid out,** is the hub's: the big top at the north, tents either side, a half ring
  of stalls to the south, wagons behind, the gate to the east where a lane comes in from the south road. To make room,
  Io's cottage and the jetty moved 30 m further south and the lake's south shore was drawn in.
- **The fair kit is Moon Faire's own code, unchanged.** It asks a few helpers for its light and fog; `fair.js` answers
  with this game's night, so no line of the kit was edited.
- **The camp's lamplight** is painted once into a small picture (a warm pool under each lantern and fire), the way a
  town's is.
- **Each place's lake or fen stays inside that place's own ground** for now (the jetty's lake, Bogmire's fen and the
  cottage's stream all end at a shore inside it). Only water that reaches the edge is carried on.

## What was copied in

44 more lines in `assets/INDEX.csv` (102 in all). From the new Envoi (`main`, `d450c3f`): the five places' files,
their walking areas, and 16 more of Chris's textures with their labels. From Moon Faire (`main`, `6371714`): the fair
kit, its 11 pictures, and where each piece lies on the kit's sheet. The place files are unchanged; what
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
| The camp's gate up to Wickhollow | arrived; 2.0 cm |
| The spot the game starts on | can be stood on |
| The land's rules at 3,533 spots | every spot has a height; no spot in water can be stood on; 88% can be stood on |
| Page errors | 0 |
| Time for the page to start (this machine, no graphics card) | 11 to 12 seconds for six places and the camp (8 for one place) |
| What is drawn | 150,000 to 435,000 triangles, 105 to 375 draw calls |
| The first test | still builds and still passes its own checks |
| Looked at by eye, in 34 pictures | each place, each road arriving, the Thornwood's stream leaving its ground, the camp from the ground and from above, the camp in the Flipbook look |

**Not checked:** the frame rate with the camp in; anything in motion (the lanterns' flicker, the camera near a tent).

## Unfinished, and known rough spots

- **Nobody is in the camp yet**: no fair folk, no captain.
- The camera can pass inside a tent or a stall (the kit's pieces do not thin away as walls and trees do).
- The tents cannot be entered.
- **The fen's ground is one texture** (Bogmire's bank grass). No mud, no lily pads on the land's own pools.
- **A road crosses water on a plain bank of earth**, not a bridge or a boardwalk.
- **The long road is bare**: no camps, no people, no fights, no signposts, and a hedge at its end.
- **The map's rivers are drawn in level squares**, so a river running downhill out on the long road would step down
  like small weirs. (None crosses the road itself.)
- **The lake by Wickhollow and the jetty's lake are still two lakes.**
- The land round Bogmire wears Wickhollow's grass and woods, not the fen's own ground and reeds.
- Wickhollow's lake and the jetty's lake are two lakes with woods between.
- The cottage's stream ends at a bank inside the cottage's ground.
- The ground changes tone in a line where the land meets the Thornwood's own ground at its west gate.
- The keepsake shimmers are still left out.
- The file is 71 MB, of which 50.6 MB is 109 pictures. Chris's phone opens it.

## For the hub

- Nothing waiting.
