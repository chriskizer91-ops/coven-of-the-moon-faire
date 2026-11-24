# zone-4: the northeast peaks, the last zone

Branch: job/zone-4      Updated: November 24, 2026 (the land is in; the people, the story and the narrator are being built)

A sub-agent of the hub's wrote this, building zone 4 the way zones 2 and 3 were built. Nobody could be asked while it
worked, so every choice it made is listed under "The job's calls", each with the other choice.

**The one rule above the others was kept: no word of `game/talk/zone-4.js` was changed.** Its 144 lines are being
recorded as they stand.

## What it built

### 1. The land (done, checked)

- **`game/pages/zone-4.html`** (builds to 73.7 MB before the people's bodies and voices): the page, made from
  `zone-3.html`, with the menu job's marked block kept.
- **`game/places/zone-4.js`**: five of the old Envoi's places on one land, 3.1 km by 1.9 km of Chris's map:
  the frozen camp (where the ship sets down), Frostmere's shore, the frozen pass, Misthollow and the dead Moonwell.
- **Four roads join them, 3.3 km of walking from the camp to the Moonwell, climbing 256 m:**

  | Road | Length | It climbs |
  |---|---|---|
  | the frozen camp to Frostmere's shore | 1,726 m | 117 m |
  | Frostmere's shore up to the frozen pass | 481 m | 65 m (the steepest: 17 m in every 100, in a cutting through deep snow) |
  | the frozen pass up to Misthollow | 1,048 m | 48 m |
  | Misthollow's street up to the Moonwell | 60 m | 3 m |

- **Misthollow is joined to the land** (it was a town with two doors): from the south a bridge of stone setts on tall
  posts carries the road over the sea of mist to the foot of the town's south stair; to the north its one street runs
  on between the houses, out of the town and up to the Moonwell.
- **No flame is lit in Misthollow or at the Moonwell.** The lines say so four times. The old places had warm lanterns,
  lit windows and two fire bowls: here every window is dark, every wall lantern is gone, all thirteen lamp pillars
  stand with a dead lantern on them, and the fire bowls are cold iron.
- **The light up there is a pale cold dawn** ("never dark, never warm", "it's always morning here"): a bright,
  colourless sky and a white mist, in those two places only. The road up is night, as in zones 1 to 3.

## The job's calls (each is one line of data in `game/places/zone-4.js`; each is Chris's to overrule)

1. **The peaks stand at one ninth of the map's height, not one third** (`VK`). Measured first: at one third the
   camp is 41 m up and Misthollow 775 m, and no road gentler than 18 m in 100 exists between them shorter than
   7.8 km, in cuttings up to 87 m deep. At one ninth the climb is 256 m and the roads are 3.3 km. The fog hides
   everything past 80 m, so what is lost is not seen. *The other choice:* one third, with a road more than twice as
   long. (Anything between works too: it is one number.)
2. **Misthollow stands 143 m south of its pin** (`MIST_PIN`), on the flat top of its mountain. On the pin itself the
   town would sit on the mountain's north rim, with the land falling away where its street has to climb.
3. **The dead Moonwell stands at the head of Misthollow's street, 153 m north of the town** (`AT.well`), which is
   290 m south of its own pin, and 12.8 m higher than the town's lower square (`WELL_UP`). The lines need it there:
   "The Moonwell's up there, where the street ends", "the cold lights go up the street to the Moonwell". On its own
   pin it would be 300 m away across open mountain and 47 m *below* the town. *The other choice:* on its pin, with a
   780 m road winding down to it, and three lines untrue.
4. **The other three places are on their pins.** The mountain is steep under them (the map is up to 48 m above
   Frostmere's shore's own ground at its edge, and 60 m above the frozen pass's), so the roads leave them in cuttings
   through the snow. Zones 2 and 3 have the same (up to 44 m). Moving each 200 to 270 m would halve it; not done.
5. **The flames** (`flameless`) and **the dawn** (`DAWN`), above.
6. **Names a player reads on the land are stand-ins:** "The frozen road", "The snowbound pines", "The northeast
   peaks" (the landing's name), and the herb "White sage" (Sorrel sells it).

## What was copied in

Each has its line in `assets/INDEX.csv`, read from the old Envoi at commit `d450c3f`:

- The five places, as they are: `game/places/frozen-camp.js`, `frostmere-shore.js`, `frozen-pass.js`,
  `misthollow.js`, `moonwell.js`, each with its `-trees.js` and its walking areas (`game/data/maps-<place>.js`).
- Ten of Chris's textures the places use: frozen cliff rock, frozen waterfall ice, trodden snow trail, snow-crusted
  lake ice, snowy cobbles, the snowy mountain road, blue slate roof, frosted setts, the Moonwell's court setts and its
  frosted garden earth.
- The frozen camp's walking painting (the Flipbook look takes its colours from it).

**None of the copied files was changed.** Everything this zone changes about them (the gates, the bridge, the dead
lamps, the dawn) is done from `game/places/zone-4.js`, as zones 2 and 3 do.

## What had to be made new for snow and ice country

- Nothing in the engine. The land wears the places' own snow, trodden snow, frozen rock and ice.
- The dawn's light and mist (numbers only).
- The bridge into Misthollow (the place engine's own deck, posts and rails), and the bank of rock it lands on.
- The dead lanterns (the engine's own lantern, with no flame).

## What was checked, and how

- `tools/zone-test.py builds/zone-4.html`: **ALL PASSED.** Every road walked at a sprint, her height never jumped
  (at most 5.3 cm in a thirtieth of a second), she ended on the next place's ground each time; 3,941 spots obey the
  land's rules (94% can be stood on); 0 page errors.
- 24 pictures of the land, looked at one by one.
- Not checked: the frame rate; how the climb feels to walk. Only Chris's laptop and phone can show those.

## Rough spots

- The road from Frostmere's shore to the pass runs in a cutting up to 30 m deep, its sides streaked snow.
- The sea of mist round Misthollow stops at the edge of the town's own ground; the land beyond rises out of it.

## For the hub

(filled in as the job goes on)

## For Chris

(filled in as the job goes on)
