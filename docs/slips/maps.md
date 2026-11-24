# maps: the 3D map of Aethermoor and the star map in the menu, and choosing where to fly

Branch: job/maps      Last commit of code: 310f7a3      Updated: November 24, 2026, 07:15      By: a sub-agent of the hub's (Fable 5.2)

`origin/main` is merged into this branch twice, at the hub's asking: once with the real menu in it (`6f20722`) and
once with the flight in it (`65c7825`). The checks below were run after the merges, on the real zone-1 page with the
real menu.

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
| `game/maps/data/maps-data.js` | Every word the player reads, the names that are stand-ins (marked so), the why-lines, the settings |
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

- `map3d.js`, 22 marked lines: `map.dispose()` frees everything; `map.setIoAt(x, y, name, zone)` puts the pin at any spot
  of the atlas; `map.screenOf()` says where a spot shows on the screen; `map.onFrame` tells the page each frame;
  the pin's word comes from data (it was the word "Io"); the landings are the game's own; a map taken away while
  it loads builds no further; `opts.still` lets a check draw it only when told.
- `map.css`: only the rules for the names over the map are kept. The two web fonts are gone (a build fetches nothing).
- `place-models.js` and `art/aethermoor-place-grounds.webp`: **made again** (see "The places and the reskin").
- `thareia-system-star-map.html`, 39 marked lines: the import map with two web addresses is gone; names and words come
  from the game's data; travel is off unless the data turns it on; buttons and names are 44 px or more; it tells
  the game when it is ready, frees what it holds when told, and passes the Escape key up.

## The calls this job made (each is one line of data, for Chris or the hub to overrule)

| Call | Where | The other choice |
|---|---|---|
| **The star map runs in a frame with three.js 0.160 packed in.** It is the safer way: the map is written for 0.160. Its colour handling and its last drawing pass do not exist in r128, and its add-ons (the turning of the view, the glow) are not in the game's r128 file. Moving it to r128 would mean rewriting its drawing and checking every colour by eye. In a frame it runs as Chris last saw it | `tools/maps-make-sky.mjs` | Change the map to run on r128 |
| The pin says **"The coven"** (it said "Io"; here any of the four may lead) | `maps-data.js`, `words.pin` | "Io", or the name of whoever walks |
| The star map is **to look at**: no "Set course" between worlds, no crystal cost | `maps-data.js`, `sky.travel: false` | `true` brings both back |
| The **shipyard** stands on the map where this game has it, in the bay (atlas 2097, 684), so the pin and the model agree | `maps-data.js`, `places.shipyard` | Delete the line: back on its old pin (2097, 599) |
| The why-lines for a landing that is not open: "Not yet. The way there leads on from The Warm Roads." | `maps-data.js`, `closed` | Any wording |
| A zone not reached yet lies **under mist**, as in the old map, also while choosing. Its landing's mark shows over the mist | `maps.js`, `zonesUpTo` | Lift the mist from a zone that may be flown to |
| The dotted line takes 1.5 seconds to draw and is held 1.1 seconds | `maps-data.js`, `world.lineSecs`, `holdSecs` | Any times |
| `choose()` stops the land while it is up (it calls the walker's `pause`) and starts it again after | `maps.js`, `world.choose` | Leave pausing to the hub |
| The Maps tab opens on **Zone** the first time (it costs nothing to draw), then on the view last looked at | `maps.js`, `tab.mount` | Always World |

**Not a call of this job's: the moon is Auros.** The job's text called the spelling open. `docs/decisions.md` says
Chris settled it on November 18, so the star map reads "Auros" (the old page wrote "Aurous") and the name is not
marked as a stand-in. The band of crystal's name, "Crystal Drift", is marked as a stand-in: it was Claude's in the
old Envoi, not Chris's. The `sky-names` job, whose slip said both, was right; both are done.

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

Everything here was run in a browser with no screen and no graphics card, on November 24, after `origin/main` was
merged in (the real menu and the flight are in the pages). The job was cut off once, late on November 23, while
these runs were going; all of them were run again from the start.

The two `maps-test` rows on the small page and on zone 1 were run on the last commit of code. The other rows were
run a little earlier: the menu's check, `things-test` and `people-test` before two marks and three comments were
put right in the data file (no code reads the marks); zones 2 and 3 before that and before the card's place on a
phone held on its side (CSS for low screens only).

| Check | On | Result |
|---|---|---|
| `tools/maps-test.py` | `builds/maps.html`, at 412 by 880 and 1280 by 720 | **All passed: 102 checks, 0 page errors** |
| `tools/maps-test.py` | `builds/zone-1.html` with the real menu, at both sizes | **All passed: 108 checks, 0 page errors** |
| `tools/maps-test.py` | `builds/zone-2.html`, `builds/zone-3.html`, at 412 by 880 | **All passed: 54 checks each.** The pin stands where the walker is: "The Warm Roads camp" in zone 2, "The northern camp" in zone 3 |
| `tools/menu-test.py --only A` (the hub's check now) | `builds/zone-1.html` | **All passed: 58 checks.** The tabs are Save, Maps, Coven, Settings, in that order, with the maps' tab in place |
| `tools/things-test.py` | `builds/zone-1.html` | **All passed: 40 checks** |
| `tools/people-test.py` | `builds/zone-1.html` | **All passed: 134 checks** |

What `tools/maps-test.py` checks, in plain words:

- **The pin is in the right place.** At each zone's start and at each of the four landings, the pin's spot on the
  atlas is the one worked out from the game's own files (`game/places/zone-N.js`, `game/travel/landings.js`), to
  within 0.06 of an atlas pixel (60 cm on the map). Zone 1's start is atlas 1327.0, 1877.9; zone 2's 817.68, 1529.31; zone 3's 1148.73,
  610.62. On a zone's page it is where the walker really stands. The pin is also checked where it is drawn: with
  the view slid sideways its name stands 0.0 px from where it should.
- **Each map opens, closes and leaves nothing behind.** After closing, the 3D map's own renderer counts 0 shapes and
  0 pictures; so does the star map's. The page has no more canvases or frames than before. On zone 1 the game's own
  renderer counts the same before and after (118 shapes and 57 pictures at the phone's size, 205 and 86 at the
  laptop's). The 3D map is opened and closed three times, the star map twice, and each once more while switching.
- **Choosing:** the landing tapped is the answer. Back answers `null`, the Escape key answers `null`. A landing that
  is not open shows its why-line, has no "Set course", and cannot be chosen by the Enter key or by asking outright.
  The dotted line is drawn to its end. The land is stopped meanwhile and goes on after.
- **The star map makes no request to the network** (0 requests in the whole check). Its nine names are the data's.
  "You are here" is on Thareia. Asking it to travel does nothing.
- **Every button is 44 px or more** at both sizes, and none lies off the screen. The smallest are 46 by 46 (the
  card's close mark) and 86 by 44 (the three view buttons). In the star map every button and every name that can be
  tapped is 44 px tall or more. The card and the round button stay in the bottom two fifths of the screen.
- **In the real menu:** the tab opens from `W3D.menu.open('maps')`; the three views switch and each takes the last
  one away; the Escape key pressed inside the star map's frame closes the menu; opened again, the tab shows the
  view last looked at.

### The numbers (no graphics card: the times are this machine's, not a phone's)

| | Phone's level (412 by 880) | Laptop's level (1280 by 720) |
|---|---|---|
| The 3D map: time to open | 1.5 to 1.7 seconds | 1.8 seconds |
| Triangles in the first picture | 1,634,042 in 71 draw calls | 6,564,252 in 207 draw calls |
| From far off (the whole land) | 531,306 in 46 draw calls | 2,115,962 in 94 draw calls |
| Close in on Wickhollow | 1,724,144 in 55 draw calls | 6,721,514 in 133 draw calls |
| It holds, while open | 59 shapes, 11 pictures | 104 shapes, 11 pictures |
| It holds, after closing | 0 and 0 | 0 and 0 |
| The star map: time to open | 2.0 to 3.4 seconds | 2.7 to 3.9 seconds |
| The star map: one picture | 135,742 triangles in 219 draw calls | 161,144 in 242 draw calls |
| The star map holds, open / closed | 61 shapes, 33 pictures / 0 and 0 | 62 shapes, 33 pictures / 0 and 0 |

The triangle counts are the old map's own: its notes give 0.4 to 1.6 million on a phone and 1.8 to 6.0 million on a
laptop, and Chris ran that map on his phone.

| Page | Size | Of which the maps |
|---|---|---|
| `builds/maps.html` | 9.2 MB | all of it |
| `builds/zone-1.html` | 108.6 MB | 7.4 MB |
| `builds/zone-2.html` | 97.6 MB | 7.4 MB |
| `builds/zone-3.html` | 94.9 MB | 7.4 MB |

The star map's frame is 0.72 MB of the 7.4 (three.js 0.160.0 is 12 files inside it). A zone's page carries the
land's two data pictures once, not twice: the map takes them from the zone.

### Pictures

Taken with `tools/maps-look.py`, on this machine (not in the repo). 12 views at each size: the zone's map; the 3D map
where the coven is, with a landing's card, from far off, close in; choosing (as it opens, a landing not open, the
open one, the dotted line); the star map (the system, Thareia, the moon).

- From the real zone-1 page, inside the real menu, at 1280 by 720, 412 by 880 and 880 by 412 (a phone on its
  side): 36 pictures.
- From the small page, at the same three sizes: 36 pictures.

## What was NOT checked

- **No frame rate.** A browser with no graphics card cannot measure one. The 3D map shows its own frame rate at the
  bottom left, so Chris can read it off on his laptop and phone.
- **No motion.** The camera's flight down to the coven, the dotted line being drawn dash by dash, the pin's pulse,
  the star map's orbits: none was seen moving. The pictures show where each ends.
- **No real phone and no real fingers.** The old map's own touch test (turning, pinching, sliding) was not run
  here. The check's taps are clicks at the place on the screen where a mark or a button shows.
- **How much memory a phone has left** with the game and a 3D map both open. The map is freed when it is left, but
  while it is open the phone holds both.
- **The star map's look against the old page,** side by side. It is the same code and data, so it should be the
  same; nobody compared them by eye.
- Zone 4 has no page yet, so its pin was not checked (the map has zone 4's places on it).
- **A phone held on its side** (880 by 412) was looked at in pictures only; the check runs at the two sizes above.
- **The hub's other checks** (`zone-test`, `story-test`, `encounter-test`) were not run again after the merges. The
  maps' block adds scripts that do nothing until a map is opened.
- **The real joining:** nothing calls `choose()` in the game yet, so it was only called by the check and by the
  small page's button.

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
- On a phone held on its side the tab row and the three view buttons take 120 px of 412. There the card sits in
  the bottom left corner, and is narrower, so the middle of the map stays clear (on the 3D map and on the star map).
- On a phone held on its side the zone's own map is small (it is shown whole, in a box 290 px tall).
- The star map's small letters (11 to 12 px) are the old page's own. They were not made bigger.
- **The Zone view is a copy of the land's big map,** so it carries that map's own close mark (a cross, top right),
  which does nothing there.
- **While choosing on a wide screen,** the view opens on the ship and the landings that may be chosen. A landing
  that is not open can lie off the screen until the map is turned or slid.

## Unfinished

- Nothing in the job's list is left out. The joining is the hub's: the ship as a gate, calling `choose()`, opening
  the next zone's page.

## For the hub

1. **`origin/main` is merged into `job/maps`** (twice: `6f20722` with the menu, `65c7825` with the flight), so this
   branch should come into `main` without a clash. `main` has moved on since (to `3a4c65f`: the board, the flight's
   Fire button, the sky-names proposal). None of that touches the maps' files, the zone pages or `assets/INDEX.csv`,
   and git joins the two without a clash (tried with `git merge-tree`, not merged). In each zone page the maps' block sits straight after the menu's
   block. In `assets/INDEX.csv` both sides' lines are kept: main's, then the maps' 13. There is no stand-in of the
   menu in any zone page: it is only in `game/pages/maps.html`.
2. **Checked on the real zone-1 page with the real menu,** as asked: the Maps tab opened from the real menu, and
   `tools/menu-test.py builds/zone-1.html --only A` still passes (58 checks). `tools/things-test.py` and
   `tools/people-test.py` pass on the same page.
3. **`game/travel/landings.js` is loaded by the maps' block** in the three zone pages. If the hub loads it elsewhere
   in a zone page when it joins the journey, take one out.
4. **The Zone view reads `window.__map`** (what `W3D.miniMap` gives back, which the zone pages keep there). It asks
   the land's big map to draw itself, copies the picture, and puts it away again. It works, and `minimap.js` was not
   changed. Two things would make it better, when the hub has a moment: a `drawBigInto(canvas)` on the mini map, so
   nothing has to be shown and hidden; and a way to leave out the big map's own close mark (the cross in its top
   right corner), which shows in the copy and does nothing there.
5. **`game/README.md`** has a row for `travel/` now and none for `maps/`. Suggested: "`maps/`: the 3D map of
   Aethermoor, the star map, the Maps tab, choosing where to fly (the maps job's)".
6. **`docs/assets-list.md`** could mark the 3D map and the star map as used.
7. **To call the choosing screen:** `const to = await W3D.maps.world.choose({ from: 'wickhollow', open: ['warmCamp'] })`.
   `to` is a landing's id or `null`. While it is up `W3D.maps.world.choosing` is set (the menu leaves Escape to it).
   It stops the land itself and starts it again; if the hub would sooner do that, it is one line in `maps.js`.
8. **To show where the coven is while travelling** (Chris, November 16): `W3D.maps.world.mount(el, { here })`, then
   `setHere()` as she moves, then `unmount()`.
9. **Zone 4:** when its page exists the map reads the zone's own numbers from the page. For the small page, add
   zone 4's line to `zones` in `game/maps/data/maps-data.js` (its pin and its start).
10. **To make the star map's frame again** after changing its page: `npm install esbuild` in a scratch folder, then
    `node tools/maps-make-sky.mjs --esbuild <that folder>`. The built text is in the repo, so a build needs no Node.
11. **three.js 0.160.0 has no line in `assets/INDEX.csv`** (it is from npm, and the index's columns name an old
    repo). If the hub wants a line for it, the facts are under "What was copied in".
12. **When Chris has chosen the sky's names** (`docs/lore/sky-names-proposal.md`): the lines go into
    `game/maps/data/maps-data.js` under `sky.info`, as the sky-names slip says, and `standIn: true` comes off each.
    Nothing else has to change, and the star map's frame need not be made again (the names are handed to it when it
    opens). Look at the suns' longer name on an upright phone: a name's box on the star map is as wide as its
    letters. `python3 tools/maps-test.py builds/maps.html` reads the nine names back from the star map.
13. **The old Envoi's places tool was run on a scratch copy,** not in any repo. The copy is gone with the machine's
    scratch space; `place-models.js` says at its top how it was made, should it be needed again.

## For Chris

1. **The frame rates** of the 3D map on the laptop and the phone, read off its bottom left corner; and whether the
   phone is happy with the game and a 3D map open together.
2. **The names of the three stars, the four other planets and the band of crystal** (they read "The Twin Suns",
   "The Far Star", "Unnamed I", "Unnamed II", "Unnamed IV", "Unnamed V", "Crystal Drift"). A proposal for all of
   them is waiting for him (`docs/lore/sky-names-proposal.md`, the sky-names job's).
3. **"The coven" on the pin,** or another word.
4. **Whether the star map should let him set a course between worlds** in this game. It is off.
5. **The shipyard's spot** is still his call. The map follows the game.
6. **The words for a landing that is not open yet.**
7. **Whether a zone he may fly to should still lie under mist** while he chooses.
