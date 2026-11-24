# maps: the 3D map of Aethermoor and the star map in the menu, and choosing where to fly

Branch: job/maps      Updated: November 23, 2026      By: a sub-agent of the hub's (Fable 5.2)

## What it built

Open `builds/maps.html` to try all of it by itself (`python3 tools/build.py game/pages/maps.html`, 9.2 MB). It is a
small page with a stand-in menu. The same pieces are in the three zone pages, in one marked block each.

1. **The 3D map of Aethermoor, inside the game's page** (`game/maps/world/`, opened by `game/maps/maps.js`).
   - It is the old Envoi's map, as it was: the land, the sea, the trees, the 21 walking places, the mist over zones
     not reached yet. A pin of moonlight stands where the coven is, with the words "The coven" and the name of the
     place under it.
   - `W3D.maps.world.mount(el, { here })` gives back `{ unmount(), setHere(here), ready }`. `here` is
     `{ landing: id }` or `{ zone: 'zone-1', x, z }` (the walker's place in that zone's metres).
   - It has the old map's two levels of detail. A phone gets the lighter one, a laptop the fuller one (it follows
     the game's own setting, `W3D.quality`).
   - When it is left it frees everything: its shapes, its pictures and its graphics context.
   - A small line at the bottom left shows its own frame rate, triangles and level of detail.
2. **Choosing where to fly:** `W3D.maps.world.choose({ from, open })` gives a promise of a landing's id, or `null`.
   - It fills the screen by itself, with no menu. The land underneath is stopped while it is up, and goes on after.
   - Every landing in `game/travel/landings.js` has a mark on the map. The ship's landing is a pale ring, an open
     landing a gold diamond, a landing that is not open a dim grey one.
   - A tap on a mark gives a card at the foot of the screen with its name. An open landing's card has "Set course".
     A landing that is not open has one line saying why, and no button.
   - "Set course" draws a dotted gold line from the ship to the landing, holds it a moment (2.6 seconds in all),
     and answers. "Back" (top left) and the Escape key answer `null`. The Enter key is "Set course".
3. **The star map of the Thareia system** (`game/maps/sky/`), to look at. "You are here" is on Thareia.
   - It runs in a frame of its own inside the one file, with three.js 0.160.0 packed in. It fetches nothing.
   - Every name and word on it comes from `game/maps/data/maps-data.js`.
   - The old page's "Set course" between worlds and its crystal cost are switched off (one line of data).
4. **The Maps tab:** id `maps`, label "Maps", order 20, with three views to switch between: Zone, World, Sky.
   - Zone is the land's own big hand-drawn map, shown inside the tab.
   - The tab adds itself to `W3D.menu` when the menu is in the page, whichever of the two loads first.
   - It opens on the view last looked at. The first time it opens on Zone, which costs nothing to draw.
5. **A check,** `tools/maps-test.py`, and a picture tool, `tools/maps-look.py`.
6. **A tool,** `tools/maps-make-sky.mjs`, which packs the star map's page and three.js into one piece of text
   (`game/maps/sky/star-map-frame.js`). The built text is in the repo, so `tools/build.py` needs no Node.

### The files

| File | What it is |
|---|---|
| `game/maps/maps.js` | The Maps tab, the three views, `W3D.maps.world.mount` and `.choose`, `W3D.maps.sky.mount` |
| `game/maps/maps.css` | Their look. Everything is under `.cvm`, so it touches nothing of the game's |
| `game/maps/data/maps-data.js` | Every word the player reads, the stand-in names, the why-lines, the settings |
| `game/maps/world/` | The 3D map, copied from the old Envoi: `map3d.js`, `places.js`, `moods.js`, `tree-models.js`, `buildings.js`, `place-models.js`, `map.css`, `bands.js`, `art/` (four pictures). `art.js` and `art-land.js` are new |
| `game/maps/sky/thareia-system-star-map.html` | The star map's page, copied, with its changes marked. It is the source of the frame |
| `game/maps/sky/lib/three-0.160.0/` | three.js 0.160.0: 12 files and its licence |
| `game/maps/sky/star-map-frame.js` | Made by the tool. Not written by hand |
| `game/pages/maps.html` | The small page |
| `game/pages/zone-1.html`, `zone-2.html`, `zone-3.html` | One block each, "maps job: start" to "maps job: end" |

## What Chris said here

Nothing. Chris was not in this conversation. The job worked from the hub's text and from his words in it
(November 16 and November 23).

## What was copied in

Every line below is in `assets/INDEX.csv`, read from the old Envoi at `d450c3f`.

- From `moon-faire-witches/world-map/map/`: `map3d.js`, `places.js`, `moods.js`, `tree-models.js`, `buildings.js`,
  `place-models.js`, `map.css`.
- From `moon-faire-witches/world-map/art/`: the four pictures the map reads (ground textures, wall and roof textures,
  the places' textures, the places' grounds). The land's two data pictures were already in `game/art/world/`: the
  map uses those, one copy for both.
- From `src/game/world.js`: the four zones' outlines, as `game/maps/world/bands.js`.
- From `moon-faire-witches/star-map/`: `thareia-system-star-map.html`.
- Not copied: the map's makers (`tools/`), its 24 tree model files (they are packed in `tree-models.js` already), its
  four big source textures, its demo page.

**three.js 0.160.0 came from npm, not from an old repo,** so it has no line in `assets/INDEX.csv` (the index's
columns name an old repo). It is the package `three`, version 0.160.0, MIT licence, copyright 2010 to 2023 three.js
authors. The licence file is in the folder. Only the 12 files the star map uses were copied: `build/three.module.js`
and 11 from `examples/jsm/` (OrbitControls, EffectComposer, RenderPass, UnrealBloomPass, OutputPass, Pass,
ShaderPass, MaskPass, CopyShader, LuminosityHighPassShader, OutputShader).

### Changes to copied files (each is marked "Coven" in the file)

- `map3d.js`, 22 marks: `map.dispose()` frees everything; `map.setIoAt(x, y, name, zone)` puts the pin at any spot
  of the atlas; `map.screenOf()` says where a spot shows on the screen; `map.onFrame` tells the page each frame;
  the pin's word comes from data (it was the word "Io"); the landings are the game's own; a map taken away while
  it loads builds no further; `opts.still` lets a check draw it only when told.
- `map.css`: only the rules for the names over the map are kept. The two web fonts are gone (a build fetches nothing).
- `place-models.js` and `art/aethermoor-place-grounds.webp`: **made again** (see "The places and the reskin").
- `thareia-system-star-map.html`, 37 marks: the import map with two web addresses is gone; names and words come
  from the game's data; travel is off unless the data turns it on; buttons and names are 44 px or more; it tells
  the game when it is ready, frees what it holds when told, and passes the Escape key up.

## The calls this job made (each is one line of data, for Chris or the hub to overrule)

| Call | Where | The other choice |
|---|---|---|
| **The star map runs in a frame with three.js 0.160 packed in.** It is the safer way: the map uses four pieces of 0.160 that r128 does not have in the same form (its bloom, its output pass, its colour handling), so moving it to r128 would mean rewriting its drawing and checking every colour by eye. In a frame it runs as Chris last saw it | `tools/maps-make-sky.mjs` | Change the map to run on r128 |
| The pin says **"The coven"** (it said "Io"; here any of the four may lead) | `maps-data.js`, `words.pin` | "Io", or the name of whoever walks |
| The moon is spelled **"Auros"** on the star map, the working name. The old page wrote "Aurous" | `maps-data.js`, `sky.info.aurous.name` | "Aurous" |
| The star map is **to look at**: no "Set course" between worlds, no crystal cost | `maps-data.js`, `sky.travel: false` | `true` brings both back |
| The **shipyard** stands on the map where this game has it, in the bay (atlas 2097, 684), so the pin and the model agree | `maps-data.js`, `places.shipyard` | Delete the line: back on its old pin (2097, 599) |
| The why-lines for a landing that is not open: "Not yet. The way there leads on from The Warm Roads." | `maps-data.js`, `closed` | Any wording |
| A zone not reached yet lies **under mist**, as in the old map, also while choosing. Its landing's mark shows over the mist | `maps.js`, `zonesUpTo` | Lift the mist from a zone that may be flown to |
| The dotted line takes 1.5 seconds to draw and is held 1.1 seconds | `maps-data.js`, `world.lineSecs`, `holdSecs` | Any times |
| `choose()` stops the land while it is up (it calls the walker's `pause`) and starts it again after | `maps.js`, `world.choose` | Leave pausing to the hub |
| The Maps tab opens on **Zone** the first time (it costs nothing to draw), then on the view last looked at | `maps.js`, `tab.mount` | Always World |

## The places and the reskin

The old notes said the map's copy of the 21 places was one step behind the reskin, and that the map's own tool
brings it up to date. **The tool ran here.** It was run on a scratch copy of the map's folder, outside every repo,
reading the old Envoi at `d450c3f`. Nothing was written in the old repo.

- `make-places.mjs` ran as it is, with one change in the scratch copy: it starts this machine's Chrome. It took
  8.5 minutes. 21 places, 155,663 triangles (155,613 before), the same 70 textures.
- What changed: **Wickhollow** (its lower house: 7,197 triangles before, 7,247 now, 16 groups of shapes before,
  18 now). The texture picture came out byte for byte the same.
- The **shipyard** was taken at this game's spot. That leaves the crossroads a little less room on the map (the
  tool gives each place room up to halfway to its neighbour).
- `make-moods.mjs` and `make-buildings.mjs` ran too. Their output is the same as the copies, apart from the first
  line, so the copies were kept.
- The old Envoi's own places check (`check-places.mjs`) says 20 of 21 places are well placed, and that **the
  shipyard is in water**. That is this game's doing: the hub stood it in the bay.

## What was checked, and how

Everything here was run in a browser with no screen and no graphics card.

NUMBERS

- Not checked: see below.

## What was NOT checked

- **No frame rate.** A browser with no graphics card cannot measure one. The 3D map shows its own frame rate at the
  bottom left, so Chris can read it off on his laptop and phone.
- **No motion.** The camera's flight down to the coven, the dotted line being drawn dash by dash, the pin's pulse,
  the star map's orbits: none was seen moving. The pictures show where each ends.
- **No real phone and no real fingers.** The old map's own touch test was not run here. Taps were made with a
  pretend finger at 412 by 880.
- **How much memory a phone has left** with the game and a 3D map both open. The map is freed when it is left, but
  while it is open the phone holds both.
- **The star map's look against the old page,** side by side. It is the same code and data, so it should be the
  same; nobody compared them by eye.
- Zone 4 has no page yet, so its pin was not checked (the map has zone 4's places on it).

## What is rough

- **The pin inside a place is squeezed.** The zones lie on the atlas at one third size, but the map draws each place
  7.5 times life size so it can be seen. So walking 49 m across Wickhollow moves the pin 15 units on the map, while
  the drawn town is 37 units from middle to edge. The pin is on the right place, not on the right house.
- **The shipyard in the bay** shows as a square of still water with the yard on it: the place's own sea, lying on
  the map's sea. Its edge can be seen.
- **A landing's name and its place's name can sit close together** ("The northern wilds" under "The northern camp").
- **The Moon Faire's camp is not on the 3D map** as a place (the old Envoi had no camp). At the camp the pin's
  words are the land's own name for the spot, or "The southwest and the fen".
- Opening the 3D map takes a second or two, during which the page holds still behind the line "Unrolling the map
  of Aethermoor…".
- On a phone held on its side the tab row and the three view buttons take 120 px of 412.
- The star map's small letters (11 to 12 px) are the old page's own. They were not made bigger.

## Unfinished

- Nothing in the job's list is left out. The joining is the hub's: the ship as a gate, calling `choose()`, opening
  the next zone's page.

## For the hub

1. **Bringing this in next to the menu job:** both jobs put their block at the same spot in the three zone pages
   (just before the page's own script), so git will show a clash in each. **Keep both blocks, the menu's first, then
   the maps'.** This was tried in a scratch copy (see "What was checked").
2. **`game/travel/landings.js` is loaded by the maps' block.** If the hub loads it elsewhere too, take one out.
3. **The Zone view reads `window.__map`** (what `W3D.miniMap` gives back, which the zone pages keep there). It asks
   the land's big map to draw itself, copies the picture, and puts it away again. It works, and `minimap.js` was not
   changed. Better, when the hub has a moment: a `drawBigInto(canvas)` on the mini map, so nothing has to be shown
   and hidden; and `map` in the tab's `ctx`.
4. **`game/README.md`** has no row for `maps/` or `travel/`. Suggested: "`maps/`: the 3D map of Aethermoor, the star
   map, the Maps tab, choosing where to fly" and "`travel/`: the landings".
5. **`docs/assets-list.md`** could mark the 3D map and the star map as used.
6. **To call the choosing screen:** `const to = await W3D.maps.world.choose({ from: 'wickhollow', open: ['warmCamp'] })`.
   `to` is a landing's id or `null`. While it is up `W3D.maps.world.choosing` is set (the menu leaves Escape to it).
7. **To show where the coven is while travelling** (Chris, November 16): `W3D.maps.world.mount(el, { here })`, then
   `setHere()` as she moves, then `unmount()`.
8. **Zone 4:** when its page exists, add its line to `zones` in `game/maps/data/maps-data.js` (its pin and its
   start), or nothing at all if the page is open: the map then reads the zone's own numbers.
9. **To make the star map's frame again** after changing its page: `npm install esbuild` in a scratch folder, then
   `node tools/maps-make-sky.mjs --esbuild <that folder>`.
10. The old checks: SEE NUMBERS.

## For Chris

1. **The frame rates** of the 3D map on the laptop and the phone, read off its bottom left corner; and whether the
   phone is happy with the game and a 3D map open together.
2. **The names of the three stars and the four other planets** (they read "The Twin Suns", "The Far Star",
   "Unnamed I" to "Unnamed V"), and **the moon's spelling** (it reads "Auros").
3. **"The coven" on the pin,** or another word.
4. **Whether the star map should let him set a course between worlds** in this game. It is off.
5. **The shipyard's spot** is still his call. The map follows the game.
6. **The words for a landing that is not open yet.**
7. **Whether a zone he may fly to should still lie under mist** while he chooses.
