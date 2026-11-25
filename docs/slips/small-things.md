# small-things: the rough spots of the journey and the land

Branch: job/small-things      Updated: November 25, 2026      By: a sub-agent of the hub's (Opus 5.5)

## Report for the hub

**Ready to bring in: CHECKS_VERDICT.** Eleven items: 9 were real and are put right, 2 were only how a browser with no
screen draws (and got a small change anyway, so the pictures read right), 1 is two facts for the hub to write.
Pictures (not in the repo): `small-things/after/` and `small-things/before/` under the session's scratchpad folder
(the same one as the hub's `final-check/`).

### The eleven items

| # | What | Real? | What was done, where |
|---|---|---|---|
| 1 | Talk box 418 px on a 412 px phone | Real | The four zone pages' `.talkbox` width leaves room for its padding and border: 384 px on a 412 px phone (14 px clear each side); a laptop's is 594 px as before |
| 2 | End card button on two lines, over the frame-rate pill | Real | `game/travel/journey.js`: one line (`white-space:nowrap`), 60 px up. On a 412x880 phone: 212 by 52 px, its foot 16 px above the pill's top |
| 3 | Front door: "part 1 of 5" beside "the end reached" | Real | `game/menu/saves.js`: in the ending the story running is the Faire's (zone "faire"), which was read against zone 1's rules: only a zone's own story gives a part now. `journey.js` (front door) also drops the part for a slot saved before this. Now "Save 1 · Zone 1 · level 7 · the end reached". **Level 1 was only how the check got there**: it never fights, and the level is the kept party's (`coven.party`); with a party at level 7 the line says level 7 |
| 4 | Corner map nearly empty | **Real, worse here than on a laptop** | See below. `game/engine/land/minimap.js`: while the land is paused (the Begin screen, the menu) its picture is painted in 30 ms slices, not 7. Behind the Begin screen it is now ready in about 2 s here, before Begin is pressed |
| 5 | Zone map in the Maps tab is labels on black | Not a fault of its own | The same picture as item 4, not yet painted. The tab copies the land's big map every 0.5 s, so it fills in once painted. With item 4 it is painted while the menu is open, too |
| 6 | Flight: corner map an empty box; pointer label cut at the left | Map: only the check's held flight. Label: **real** | `game/flight/src/coven-flight.js` (frame rebuilt): a tag pinned to an edge stays whole on the screen (it was centred 56 px in, and the landing's tag is 172 px wide); the corner map is also drawn as soon as its picture loads, so a held flight shows it too |
| 7 | Zone 2's ship lamps are white blocks | Real (zone 3 too: the same code) | `game/places/landing-ships.js`: each lamp is a lantern made like the place engine's own (iron base, cap and four bars round warm glass), as zone 4's ship's are. Zone 2 uses the engine's lantern itself, with its halo and light; zone 3's ship can be moved away, so hers have no halo. No asset copied |
| 8 | Loading words and Begin screen through each other | Real | The four zone pages: the loading screen goes at once when the Begin screen comes. Its fade only moves while frames are drawn: here, when Begin first showed, the loading screen was still at full opacity |
| 9 | The leaving narration says the ship lifts before "Board the ship" | Real | `game/travel/journey.js`: the zone's leaving (zones 1 to 3: the narrator's line and then the coven's lines, one group; zone 4: the narrator's told line) is held until "Set course" and said then, as written, before the next page opens. Not a word changed, nothing cut. See "Item 9" below |
| 10 | Zone 3's flight out starts over the northern camp; the flight home over the frozen camp | Zone 3: real. Zone 4: not a fault | `journey.js`, `game/flight/flight.js`: a flight starts over the gate she was boarded at, when that is more than 100 m from the landing's own spot (`W3D.flight.fly({ at })`). Zone 3's flight out now starts over the shipyard's slip. Zone 4's ship really does lie at the frozen camp (it never moves; the Grey Hat counts five down there), so the flight home rightly starts over it |
| 11 | Two small facts | (for the hub) | Not files this job may edit: the exact changes are under "For the hub" |

### Item 4, the corner map, plainly

- The map's picture of the zone is painted by the game a little at a time, 7 thousandths of a second in every 30, so the
  game never waits for it. Here it is 2.2 seconds of work.
- Behind the Begin screen (the land paused) that took 8 seconds here. Once Begin is pressed, this machine draws the land
  at 1 to 3 frames a second, and the painting got one small slice a frame: minutes. The hub's pictures pressed Begin
  1.5 seconds after the page was ready, so every one showed an empty map.
- On Chris's laptop it would have been ready a few seconds in. On his phone, with a slower processor and the 100 MB page
  busy, likely 20 seconds to a minute or more of an empty map. So it was a real fault, much worse here than there.
- Now, while the land is paused (the Begin screen, the menu), the slices are bigger. Measured here: ready 1.9 to
  BEGIN_RANGE seconds after the Begin screen came, before Begin was pressed. While walking, nothing changed (7 ms slices,
  as before), so the frame rate is not touched.
- Not changed: if Begin is pressed at once, the rest is painted while walking, as before.

### Item 9, the leaving, plainly

- Before: the story's leaving moment played on the land as soon as the Grey Hat had said his last line: the narrator
  "The Grey Hat's ship lifts from the lake…", then the coven "From up here the Faire looks like a pincushion". Then the
  player walked to the ship and pressed "Board the ship".
- Now: at that point the story only notes that she may leave (a flag of the story's, `journey.leave`, which the journey
  reads as "done"). "Board the ship", choose on the map, "Set course": then the same lines are said, the same group in the
  same order, with their recordings, in the talk box at the foot; "Go on" hurries them as always. When the last is said,
  the next page opens and the flight begins.
- Only on the flight onward (the next landing, or home), once. A flight back to an earlier landing says nothing. A save
  made before this, where the lines were already said, does not say them again.
- Every zone: zones 1 to 3 (a moment with its narrator's line first), zone 4 (its told line, which has no recording yet).
- **What still reads oddly**: the coven's lines speak from the air ("From up here…") while the picture is still the pier
  for those 20 to 30 seconds. To say them over the flight itself, the next zone's page would need the leaving zone's
  lines and their recordings (zone 1's whole talk file and its 6 recordings in zone 2's page, and so on): a bigger change,
  not done. Chris may also simply prefer them before boarding, as they were: it is one place in `journey.js` to undo.
- With `?test` (the story's own check, `story-test`) the story is left exactly as it was, so that check still finds the
  leaving where it looks for it.

### Numbers

NUMBERS

### What was checked, and how many good and failed

CHECKS

### Pictures (each looked at)

PICTURES

### What was not checked

- Motion, frame rate, sound and touch: no machine here can. In particular: whether the bigger paint slices behind the
  Begin screen can be felt (nothing moves there), whether the leaving's recordings play after "Set course" on a phone
  (the player has just tapped, so they should), and how the lanterns look moving.
- Chris's real phone: how soon the corner map is painted there.
- A flight from the slip played whole by a person (the check flies it on its test handle).

### Files changed (each change marked "small-things:"; changed copied files also say "Coven")

- `game/pages/zone-1.html` to `zone-4.html`: two lines each, outside every job's block (the talk box's width; the loading
  screen at Begin).
- `game/travel/journey.js`: the end card's button; the front door's line; the held leaving; the flight's start spot.
- `game/menu/saves.js`: the part only from the zone's own story.
- `game/engine/land/minimap.js`: bigger slices while the land is paused.
- `game/flight/flight.js`: `at`, a spot to start over. `game/flight/src/coven-flight.js` (a copied file, marked "Coven"):
  the corner map drawn on load; tags kept whole on the screen. `game/flight/flight-frame.js` rebuilt
  (`node tools/flight-build.mjs`; before the change it rebuilt byte for byte).
- `game/places/landing-ships.js`: lanterns. **Not on the hub's list of files for this job by name**; it is the journey
  job's own file (the ships at the landings), and the lamps are drawn nowhere else. Changed there because item 7 cannot be
  put right anywhere else without a patch from outside.
- `tools/journey-test.py`: new checks (the held leaving in A and H, the flights' start in A, G, H, the front door's line).

## For the hub

1. **`assets/INDEX.csv`, the twelve lines of `airship-game-in-aethermoor-`** (lines 240 to 251, the ones with commit
   `1887984`): column 3 `main` becomes `claude/ship-game-magpie-l8cbdn`. That repo has no branch named `main`; `1887984`
   is the head of its default branch, `claude/ship-game-magpie-l8cbdn` (the flight's slip, "A true fact about the
   record"). Nothing else on those lines changes.
2. **`docs/lore/story-voices-z4.html`, line 108**, two changes:
   - `<b>All 144 lines are here</b>, each once,` becomes `<b>142 of the 144 lines are here</b> (the held Warden's two
     are not recorded yet), each once,`
   - `<b>All 144 together are 9 minutes 4 seconds</b>` becomes `<b>All 142 together are 9 minutes 4 seconds</b>`
   (Line 96's "142 of 144" and line 92's "all 142" are right already.)
3. `story-test` runs with `?test`, so it still sees the leaving played on the land, as before. In play (and in
   `journey-test`) it is now said after "Set course". If the hub would rather the story check followed play, that is the
   story check's change, not made here.
4. The board's "Known rough spots": the first two groups' items are done, except as said above.

## For Chris

- **The ship's leaving lines** are now said after you press "Board the ship" and set the course, just before the flight.
  The coven's lines in it speak as if already in the air while the picture is still the pier. Is that better than before
  (said on the land before you board), or would you rather hear them over the flight itself (a bigger change)?
- **The lanterns on the ship** at the Warm Roads and the northern wilds now look like the lanterns at the frozen camp.
- **The corner map** should now be ready by the time you press Begin. Tell the hub if it is still empty on your phone in
  the first minute.
