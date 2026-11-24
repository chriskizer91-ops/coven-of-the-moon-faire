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

- (being filled in as the last checks run)

## What was NOT checked

- Anything on a real laptop or phone: how the flight in feels, frame rates, whether a phone opens the next page by
  itself (the phone trial is for that), whether a phone plays the flight's recordings before a tap.
- The card for a page that cannot open the next: built, not seen on a device that needs it.

## Unfinished

- (being filled in)

## For the hub

- (being filled in)

## For Chris

- (being filled in)
