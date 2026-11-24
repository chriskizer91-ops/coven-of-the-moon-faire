# journey: the zones joined into one journey

Branch: job/journey      Updated: November 24, 2026

## FIRST: the phone trial (ready to send to Chris now)

- Two tiny pages and their steps: `trial/phone/trial-1.html`, `trial/phone/trial-2.html` (about 2 KB each, nothing
  fetched) and `trial/phone/steps.txt` (the steps for Chris, in plain words).
- They answer: can one downloaded page open the next by itself on his phone; is a save in the browser's storage still
  there when it does; does a save come through in the address (after a #). Page 2 also says what kind of address it was
  opened as ("file", "content", ...): that tells the hub what to put in `opensNext` (below).
- Checked here in a browser with no screen, as files on disk, at 412 by 880 and 1280 by 720: all three answers YES,
  and the way back works. That is the laptop's case. Only his phone can say the phone's.
- Until he has tried it, the journey works on the laptop and fails kindly elsewhere (a card naming the file to open
  next, and, where storage does not last, the menu's own Save to a file). No second way to play is built.

## What it built

- **The ship is the gate** (`game/travel/journey.js`, its words and choices in `game/travel/journey-data.js`). A button,
  "Board the ship", by the ship at each landing (the same button the things on the land use, at the foot of the
  screen). Once the zone's story is done (its moment "leaving"), boarding opens the 3D map to choose: every landing
  reached, and the next one. Before that: the landings already reached only, and one line at the top saying why she
  won't go on yet. With nowhere reached, only the line.
- **Choosing**: `W3D.maps.world.choose({ from, open })`. Back, or no choice: the coven is still on the pier.
- **The next page plays the flight in**: the slot is saved, and the chosen zone's page opens with a note of the flight
  after a # in its address. That page flies (`W3D.flight.fly`) before its world is built (the walker's start waits for
  it), then builds the world and begins at its landing. The zone's flight lines (narrator and Grey Hat, moments
  "flight" and "flight-after") are said over the flight, words at the top, the recordings played, and are kept as
  heard in that zone's story. After a flight the Begin screen passes by itself if the player's taps on the flight
  already let sound play (one line of data).
- **A flight lost, or turned back**: the page left opens again, the coven at the ship where she boarded, with one line
  ("The crew brought her home to {from}. Nothing was lost.").
- **One save**: the menu's slots. `W3D.saves.openPage` opens the page a slot was last saved on; a new game (the menu's
  New game, on any page) opens zone 1's page. A zone page opened by hand (or Continue) when the slot in use was last
  saved on another zone's page opens that page instead, before building anything. The landings reached are kept in the
  slot, in the key `coven.story.journey` (it starts with `coven.story.`, so the menu's slots and files take it as they
  are).
- **The front door**: `game/pages/index.html` (0.1 MB built). The name, then the menu's own words: "Carry on" for each
  slot that has a save (with its line: zone, part, level), and "New game" (into the first empty slot; if all three are
  in use, a second tap replaces the oldest, after one line saying so). Opens the right zone's page.
- **The ships at the other landings** (`game/places/landing-ships.js`): the Cutter (baked: `game/flight/moored/cutter.js`,
  `node tools/flight-bake-ship.mjs cutter`) on the Warm Roads camp's roped landing ground, beside the Grey Hat; and in
  zone 3 on the northern camp's landing ground, then up on the shipyard's slip, on its cradle, once the Grey Hat has
  gone down there (both change at the moment he moves, when the coven is far off). On the slip she will not fly until
  zone 3's story is done.
- **Small folk stand straight**: the one-line fix in `game/witches/kore/jester_kit.js`, `solveLimb`, marked "Coven".
  The townsfolk job's line as written divided the reach before the direction was made a unit, which bent them the other
  way; the division is made after it instead (one line changed). Looked at on a small page of my own,
  `game/pages/journey-small-folk.html` (4.7 MB built): Pell, Tamsin, Tock, Pim and Tobb (full size), as the zones make
  them.
- **The check**: `tools/journey-test.py builds` (see below).

## A few numbers

- Knees (hip, knee, ankle: 180 is straight), after two seconds of standing, before and after the fix: Pell and Tamsin
  93 then 165; Tock 65 then 172; Pim 65 then 164; Tobb, full size, 172 and 172. The same body at 0.3 of a witch: 18
  before (folded), 172 after.
- The ships: the Skiff 8 m (zone 1, the flight job's), the Cutter 15 m long and 3.8 m in the beam, 34,110 triangles,
  874 KB of data. The Warm Roads' landing ground is about 18 by 10 m; the slip's ramp 17 m long.
- Pages built here: zone 1 about 117 MB, zone 2 about 107 MB (each grows by the flight, 2.9 MB, and zone 2 and 3 by the
  Cutter, about 0.9 MB); the front door 0.1 MB.
- On this machine, with no screen: a zone page opens in about 9 s; the flight is ready about 17 s after the page starts
  opening.

## What Chris said here

- Nothing new: he was not in this conversation.

## What was copied in

- Nothing from the old repos. The Cutter was baked from the flight job's own sources (`game/flight/src/`), as the flight
  job baked the Skiff; it needs no line in `assets/INDEX.csv` (it is made here, as `skiff.js` was).

## The journey job's calls (each one line of data; the hub's or Chris's to overrule)

- **Which ship lies where** (`landing-ships.js`, `ship`): the Cutter at zones 2 and 3. The table (`shipFrom`) flies the
  Cutter from the Warm Roads, so she is the one boarded there, and she is the one that flies into zone 3. Zone 3's lines
  say that ship is refitted, not changed ("New ribs, new keelson, same old ship"), and the Brig (25 m) would not fit
  the slip (17 m). **Where the table and a line disagree, the line wins**: the flight out of zone 3 is the Brig by the
  table, so the refit is where she becomes the bigger ship. The other choices: the ship seen is always the one that
  flew in (the Skiff at zone 2), or always the one to be boarded (the Brig at zone 3, too long for the slip).
  **One seam is left either way**: the coven flies into zone 2 in the Skiff and finds the Cutter at the landing. No line
  speaks of it.
- The gate's spots, beside each ship and away from the Grey Hat (`gates`).
- Where the coven stands after a flight back to Wickhollow: on the pier, a few steps from the ship (`arrive`).
- The flight lines are said only on the flight they were written for (the first flight in from the landing before),
  once; a flight back, or a second flight in, is quiet. Their order (`flightLines`): the narrator's "flight" line as
  the flight starts, the Grey Hat's when the raiders come, then the narrator's and the Grey Hat's "flight-after" lines.
- After a flight the Begin screen passes by itself when it can (`beginAfterFlight: 'auto'`; `'button'` shows it).
- A lost or turned-back flight puts them back at the landing they left (`lostGoesBack`). **The hub's call**, as the
  brief says, his to change.
- Pages from a "file:", "http:" or "https:" address open the next by themselves; any other shows the card
  (`opensNext`). To be set from the phone trial's answers.
- The ship on land sits on her keel on the ground, 4 cm clear of it (`LIFT`), not hanging in the air.
- One pause, not two, over the flight (step 7 of the brief): the flight plays before the zone's world and the menu are
  built, so the menu's button does not exist while a flight is on. The flight's own pause button (with "Turn back") is
  the one pause. Nothing was changed in `flight-data.js`.
- Every word is a stand-in (`journey-data.js`, `words`), except the game's name.

## What was checked, and how

- **`python3 tools/journey-test.py builds`: 44 checks, all good, 0 page errors** (about 7.5 minutes here). One browser
  with storage of its own, thrown away at the end, so nothing is left behind; the pages opened with `?journeytest`
  (the save is real; the flight is flown on its own test handle). Its six parts:
  - A: a new game on zone 1 reaches Wickhollow only; at the foot of the gangway "Board the ship" (150 by 48 px);
    pressed before the story's end, one line ("The Grey Hat won't fly on until his lamps are home.") and no map;
    story set to "leaving"; boarding offers the Warm Roads only; Set course; zone 2's page opens and the flight
    starts with no world under it, in the Skiff; the raiders come and the narrator's and the Grey Hat's "flight" lines
    are said; then the "flight-after" lines; zone 2's story counts the four as heard; the landing's lines begin; the
    slot says zone 2; reached: Wickhollow and the Warm Roads; the Cutter lies at the Warm Roads with her button.
  - B: zone 1's page opened again (Continue) opens zone 2's, with no flight.
  - C: on zone 2, story not done: she says why, offers Wickhollow only; that flight lost (sunk on the test handle):
    back at the Warm Roads, 0.0 m from where she boarded, with "The crew brought her home to The Warm Roads. Nothing
    was lost."; the slot still says zone 2.
  - D: a flight back to Wickhollow: no flight lines; Io on the jetty's pier (8.9 m south of its middle); slot zone 1.
  - E: zone 1 to zone 2 again (no lines the second time), zone 2's story set to its end, boarding offers Wickhollow and
    the northern wilds; zone 3's four flight lines; slot zone 3; the Cutter at the northern camp, not on the slip;
    the Grey Hat moved to the slip: she is on the slip and not at the camp; there she will not fly ("She is up on the
    slip. She won't fly until the refit is done.").
  - F: the front door: the name, two buttons ("Carry on · Save 1 · Zone 3 · part 2 of 5 · level 1", "New game"),
    Carry on opens zone 3's page.
- **The hub's checks on pages built from this branch** (zone pages 117, 107 and 104 MB): zone-test zones 1, 2, 3 (28,
  21, 25 good); people-test zone 1 (134); story-test zone 2 (61) and zone 3 (64); things-test zone 1 (40);
  menu-test zone 1 --only A (58); maps-test zone 1 (108); encounter-test zone 1 --quick (25); flight-test on
  flight.html (64). All pass. (A first try put the gate among the zone's things, which two checks count exactly; the
  gate is now the journey's own button, and both pass.)
- journey-test again at 412 by 880, parts A and F: 21 good.
- The phone trial: both pages in a browser with no screen, at 412 by 880 and 1280 by 720: YES, YES, YES; way back works.
- The small folk: `game/pages/journey-small-folk.html`, before and after, numbers above.

## What was NOT checked

- The small folk standing in the zone pages themselves: a picture run was made, but its camera stood in walls; only the
  small page's before and after pictures and numbers stand. The fix is in every zone page built from this branch.

- Anything on a real laptop or phone: how the flight in feels, frame rates, whether a phone opens the next page by
  itself (the phone trial is for that), whether a phone plays the flight's recordings before a tap.
- The card for a page that cannot open the next: built, not seen on a device that needs it.

## Unfinished

- On an upright phone the "Board the ship" button lies over the frame-rate and level pills, as "Go on" already does
  (the hub's known item for the last pass on a phone).

- Zone 4 is not joined (it came into `main` after this branch began; see For the hub).
- The way home after zone 4 (the last flight and the Faire ending on zone 1's page): not built.
- The Brig is not baked (none of this branch's pages shows her). Zone 4's page takes her by itself if her file is
  loaded: `node tools/flight-bake-ship.mjs brig` (needs `cd game/flight && npm install` once).
- The leaving narration says the ship lifts before the player presses "Board the ship". If that reads wrong, boarding
  could open straight after the leaving's lines: not built, a word from the hub would do it.
- In zone 3 the flight out starts over the northern camp on the map, though she leaves from the shipyard's slip.

## For the hub

1. **Bring it in**: the branch changes, outside its own new files: one marked block in each zone page (before the
   menu's block, so it reads the flight's note in the address before the menu's code clears the address); the one
   line of `jester_kit.js`; the `travel/` row of `game/README.md`. Nothing in `game/menu/`, `game/maps/`, the flight's
   code, `game/battle/`, `game/encounters/`, `game/talk/`, the people files or `story.js`: the gate is a "thing" the
   journey adds to `W3D.THINGS[zone]` from its own file, so those files did not need touching.
2. **Zone 4** (in `main` now): in `game/pages/zone-4.html`, before the menu's block, the same block as zone 2's with
   `zone-4.html`, `zone-4`, `frozenCamp`, and without the four lines of the Cutter (zone 4 moors its own ship). Then in
   `game/travel/journey-data.js` one line under `gates`: `frozenCamp: [{ place: ['<zone 4's landing place>', x, y],
   reach: 3 }]`, beside its ship, and under `arrive`: `frozenCamp: null`. Its leaving is already understood
   (`done`: `{ flag: 'leaving' }`, as its slip says). Its flight lines (moment "flight", `z4.narrator.01`) are said as
   zones 2's and 3's are, with nothing more. What follows zone 4 (the flight home, the Faire ending) is a step of its
   own.
3. **The phone trial's answers** set one line, `opensNext` in `journey-data.js`: add the kind of address page 2 shows
   (for example `'content:'`) if the button opened page 2 by itself on his phone.
4. **The hub's checks on this branch's pages**: see "What was checked"; `tools/journey-test.py` joins the list.
5. **The key `coven.story.journey`** holds the landings reached, in the slots by the menu's prefix rule. If the hub
   would rather name it in `game/menu/menu-data.js` as a key of its own, that is one line there and one here.
6. **The board**: the journey's row; the front door `index.html` among the pages; the phone trial sent.
7. Commit lines here end with the attribution this session was given (Opus 5.5), not the repo's usual Fable lines.

## For Chris

- **Try the phone trial** (`trial/phone/steps.txt`): the three answers decide whether the phone can play the game page
  to page.
- **Which ship lies where**: the coven flies into zone 2 in the Skiff and finds the Cutter at the landing. Keep it (the
  bigger ship is waiting for them there), or show the Skiff at zone 2 and make the refit at the shipyard the only
  change of ship. One line of data either way.
- **A lost flight** puts the coven back where she left, nothing lost. Or try again, or land anyway.
- **The words**: "Board the ship", the lines for why she won't go on, the front door's line under the name ("A story
  in four zones"): all stand-ins, in `game/travel/journey-data.js`.
