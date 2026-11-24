# Coven of the Moon Faire: the board

Last updated: November 24, 2026, 12:03, by the hub.

**Only the hub changes this board.** A job conversation writes only its own slip, `docs/slips/<name>.md`, on its own
branch `job/<name>`. The rules are in `CLAUDE.md`.

**A new hub picking up:** read `CLAUDE.md`, this board, `docs/decisions.md` (newest first), then the newest slip in
`docs/slips/`. Build the newest page (`game/README.md` says how) and open it before changing anything.

## The plan to finish (November 23, 2026, 19:15)

This section is the newest. Where "Hub handoff" below says something different, this is right.

**Chris, 16:53 and 19:00:** set up finishing the game. The save menu gets **three save slots**, and holds the maps:
the zone's own, **the 3D map of Aethermoor** and **the star map**. The 3D map is to look at and **to choose where to
fly**; flying is **the airship game** (Skies of Aethermoor), and **the ships are the gates between zones, as in
Envoi**. The **new creatures** are being built now in his project Aethermoor M7. He has **more narrator lines** to
send. The hub may hand side tasks to **sub-agents** (Opus 5.5 at extra-high effort, or Fable 5.2 at high effort).

### Who is doing what

| Job | Branch | What | Who | State |
|---|---|---|---|---|
| `menu` | `job/menu` | One menu button; the game pauses; tabs Save, Maps, Coven, Settings; **three save slots**, saving to a file and back | a sub-agent of the hub's (Opus 5.5, extra high) | **Done, in `main` (21:50).** On all three zone pages. Its slip: `docs/slips/menu.md` |
| `maps` | `job/maps` | The 3D map of Aethermoor and the star map brought in from the old Envoi, as the menu's Maps tab; choosing where to fly on the 3D map | a sub-agent (Fable 5.2, high) | **Done, in `main` (November 24, 07:42).** On all three zone pages. Its slip: `docs/slips/maps.md`. Nothing calls `choose()` yet: that joining is the hub's |
| `zone-4` | `job/zone-4` | All of zone 4: its land, people, story and the narrator's words for it, built to fit the lines Chris is recording | a sub-agent (Fable 5.2, high) | **Done, in `main` (November 24, 08:40).** No word of its 144 lines was changed. Its slip: `docs/slips/zone-4.md` |
| `flight` | `job/flight` | One flight between two landings, built from Skies of Aethermoor; then the Grey Hat's real ship at a landing | a sub-agent (Fable 5.2, high) | **Done, in `main` (22:25).** Both parts. Its slip: `docs/slips/flight.md`. Not joined to the zones yet: that is the hub's |
| `fights` | `job/fights` | The rest of the fights job: step 4 (two slots for a new creature in each zone, the whole game's levels); fights on zones 2 and 3; zone 4's fights; a trial of one M7 creature outside the repo | a sub-agent (Fable 5.2, high) built it and was stopped at 08:48 to save Chris's usage; **a second sub-agent (Opus 5.5, high) is finishing the checking** | **Built and pushed, NOT in `main`.** 14 of its 16 new fights were never played in a browser, nobody has seen them in a picture, zone 4's page has no fights block, one check fails. The second sub-agent does all of that, then the hub brings it in |
| `sky-names` | `job/sky-names` | A lore job: names proposed for the three stars, the four other planets, the band of crystal and every other unnamed thing on the star map, with each card's words. A proposal until Chris says yes | a sub-agent (Fable 5.2, high) | **Proposal in, in `main` (November 24, 06:25):** `docs/lore/sky-names-proposal.md`. The short page went to Chris. **Waiting on his yes or his changes** |
| `townsfolk` | `job/townsfolk` | Bodies of their own for the towns' people (zones 1 to 4). His part is two pictures a person, as for the eleven fair folk | a sub-agent (Fable 5.2, high) | **First part done, in `main` (November 24, 07:42):** 23 people, their shapes, guides and the words for 46 pictures; the folder went to Chris. **On hold (07:58):** Chris thought the people's models were already made, and they are (the eleven). The townsfolk keep the bodies they have for the first draft; the kit waits unless he asks. The later steps are in `docs/slips/townsfolk.md` |
| `journey` | `job/journey` | The joining: the ship as the gate, the map to choose on, the next page playing the flight in, one save across the pages, a small front door, the ships at zones 2 and 3, small folk standing straight | **a sub-agent (Opus 5.5, high)** | **First part done, in `main` (November 24, 11:34):** zones 1 to 3 are one journey. **Second part started:** zone 4 joined, the flight home, the Faire ending on zone 1's page, the bottom of an upright phone, then every check on `main`'s state |
| `creatures` | `job/creatures` (made from `job/fights`) | Six creatures from Aethermoor M7 (the Rot-Stag, the Thornhound, the Rotwarden, the Sapwight, the forge-spark, the Glowcap; Briarmaw, his seventh pick, is left out on his word of 10:52) brought into the battle and each made its best here, by the hub's eight instructions; then into the slots on the hub's proposal | **a sub-agent (Opus 5.5, high)** | **Started November 24, 09:29.** Its text is not on the board: `docs/decisions.md`, November 24, 09:25, has the instructions and the proposal in short |
| `peak-creatures` | `job/peak-creatures` (made from `job/creatures`) | Two new creatures for the frozen peaks, built from Chris's character sheets the way M7 builds one: the Wickstoat (zone 4, slot A) and the Hoarmantle (zone 4, slot B), each held to the same eight instructions as the seven | **a sub-agent (Opus 5.5, high)** | **Started November 24, 10:48.** The sheets are kept outside the repo until it files them. `docs/lore/zone-4-creatures-proposal.md` says what each is |
| a list of foes to suggest | none (it only read) | Which of Aethermoor M7's creatures could come into each zone, with pictures, for Chris to choose from | a sub-agent (Opus 5.5, extra high) | **Done 21:30:** `docs/foes-from-m7.md`; the list and four picture sheets went to Chris |
| the hub | `job/zone-1`, `main` | Takes in Chris's narrator lines; brings each job into `main`; then joins the journey (below); then zone 4 | this conversation | |

### The menu is in (21:50): what the hub checked, and what it leaves for the hub

- **Checked by the hub on `main`, after the merge:** the three pages rebuilt (100.3, 90.2 and 87.5 MB);
  `tools/menu-test.py` passes on all three (93 checks on zone 1, its three ways: as a check, as a player, with
  storage blocked; 57 each on zones 2 and 3); and the older checks still pass (people 134, things 40, zone 28,
  fights 25 on zone 1; story 61 and 64 on zones 2 and 3). The job changed only its own files, its slip and one
  marked block in each page. `tools/menu-test.py` is one of the hub's checks from now on.
- **How it joins the page without changing it** (worth knowing): it wraps the browser's own "play" for sounds, so it
  can pause a voice mid-line and carry on; it watches for the page saying it is ready; and with `?test` it keeps
  every write in memory, so a check saves nothing.
- **Left for the hub:**
  - When the pages call each other: set `W3D.saves.openPage(page, carry)`, so a save last made on another zone's
    page opens that page, and a new game opens zone 1's.
  - Zone 4's page needs the menu's marked block.
  - The maps job's tab must load after the menu's block (its code already waits for the menu).
- **Seen in the pictures, both older than the menu and the hub's to fix in the last pass on a phone:**
  - On an upright phone the "Go on" button lies over the frame-rate pill and the level pill.
  - For a moment as a page finishes loading, the loading words and the Begin screen show through each other.
- **For Chris to try on his phone:** whether the phone keeps saves between visits for a page opened from a
  downloaded file. The Save tab says "this is visit N"; if N never goes past 1, it does not, and Save to a file is
  the way.

### The flight and the real ship are in (22:25): what the hub checked, and what it leaves for the hub

- **One flight is a piece a page can call:** `W3D.flight.fly({ from, to, ship })`. It is Skies of Aethermoor's own
  flying, cut down to one flight, over Chris's night map of Aethermoor, in a frame of its own (its 3D library is
  newer than the game's). It adds 2.9 MB to a page. Try it by itself: `game/pages/flight.html` (2.9 MB built).
- **The four ships are the four travel upgrades** (Chris, 19:40), one for each landing flown from: the Skiff from
  Wickhollow, the Cutter from the Warm Roads, the Brig from the northern wilds, the Frigate from the northeast
  peaks. All four fly. The order is the hub's reading (`shipFrom` in `game/flight/flight-data.js`).
- **The flights, by the job's own numbers:** Wickhollow to the Warm Roads 3.4 km, 1 raider, about 85 seconds;
  the Warm Roads to the northern wilds 5.0 km, 2 raiders, about 2 and a half minutes; the northern wilds to the
  northeast peaks 8.4 km, 3 raiders, about 3 minutes.
- **The real ship lies at zone 1's jetty:** the Skiff, baked to plain data and drawn by the place engine. The hub's
  stand-in is gone from the repo. The twelve lamps hang on her hooks as before.
- **Checked by the hub on `main`, after the merge:** `tools/flight-test.py` (56 checks) and
  `tools/flight-ship-test.py` (14) pass; on zone 1 with the real ship in (101.2 MB): things 40, people 134, zone 28,
  fights 25, menu 58 (the quick way). The job changed only its own files. Both checks join the hub's list.
- **Not checked by anyone: the flight on a real laptop or phone.** How it steers, its frame rate, whether a phone
  holds up. Only Chris can.
- **Left for the hub:**
  - Joining it to the zones ("How the pieces join", below). The flight does not pause the page under it: fly before
    the zone's world is built, or pause the world until the flight answers.
  - The flight covers the menu button, and has a pause button of its own. When the menu should take over:
    `buttons.pause` in the flight's data, and `W3D.flight.pause(on)`.
  - A ship at the landings of zones 2 and 3: `node tools/flight-bake-ship.mjs cutter` bakes another (it needs Node;
    the game's own build does not), and `W3D.mooredShip` draws it.
  - What happens when a ship is lost on the way (the flight answers "not arrived" and leaves the page as it was).
- **The flight job's calls, each one line of data, for Chris to overrule:** a calm first flight; raiders give up
  after 60 seconds; long flights hurried up to 1.6 times; no wind; the player can turn back from the pause card; no
  shards paid; the moored ship rides with her keel in the lake, not hanging in the air; her starboard side lies to
  the pier; her own four lanterns are left off so her hooks are bare until the lamps come home. The ships' names
  (the Zephyr and the rest) and every word on the flight's screen are stand-ins, in its data file.

### How the pieces join (the hub's part, once the three are in)

1. At a zone's end the story reaches its leaving, at the Grey Hat's ship. **The ship is the gate.**
2. The 3D map opens to choose where to fly: `W3D.maps.world.choose({ from, open })`. A dotted line is drawn.
3. The next zone's page opens and **plays the flight in** first: `W3D.flight.fly({ from, to, ship })`. The lines for a
   flight are that zone's own (the moments `flight` and `flight-after`), so they are heard there. The flight raises
   two events, and the story engine speaks.
4. The ship sets down at that zone's landing, and its story starts with the landing, as now.
5. The save goes with the player from page to page: the same slot, in the same browser storage.

The landings, one for each zone, are in `game/travel/landings.js` (the hub's; both the map and the flight read it).

### What it takes to finish, in order

1. The three sub-agents' jobs brought in and joined (above). **Then the first three zones are one journey.**
2. **Zone 4:** its land, people and story (step 7 of the handoff's list, with its pins).
3. **The fights job's step 4** brought in; fights joined to zones 2, 3 and 4; Chris's creatures as they come.
4. **One game:** a title; the pages opening each other; a last pass on a phone.
5. Left over, small: flames that lean; the townsfolk's own bodies (18 wear a fair-folk shape); the knight's body.

### Sources

- **Skies of Aethermoor** (`airship-game-in-aethermoor-`): a source since November 18. The hub read it for the
  first time at 19:05, after Chris's word on the flight. It is small: 96 files, its built game 4.6 MB. It runs
  three.js 0.186; the game runs r128; the star map 0.160. So the flight and the star map each run in a frame of
  their own inside the one file, unless a sub-agent finds a better way.
- **Aethermoor M7** (`Aethermoor-m7-`), where Chris is building the new creatures. **A read-only source since
  19:40** (Chris: "Just don't write there. Only read from it"). The hub has read its board and its bestiary's notes
  only; nothing is copied. 93 foes are planned there, about 29 beasts built in full detail (a light model of about
  50,000 triangles each). Which come into this game, and where, is Chris's call (`docs/decisions.md`, 19:40).

### What the hub needs from Chris for a first whole draft (November 24, 06:12)

A first draft is: the four zones as one journey from dusk at the Faire to the ending, with the menu, the saves, the
maps, the flights and every voice. **Chris, November 24, 05:56: the first draft also has the foes he picks from M7,
the townsfolk in bodies of their own, and the stars and planets named.**

1. ~~The five narrator lines of zones 2 and 3.~~ **Done:** he sent them on November 24 and they are in. Every
   narrator line of zones 1 to 3 has a voice now, 48 of 48.
2. **The held Warden's two lines** (`z4-warden.zip`: `z4.warden.01`, `z4.warden.02`), and whether that Warden is a
   man or a woman (the cast says a man's voice, the story notes say "she"). The other 142 are in (November 24, 11:06).
   As it stood: **zone 4's 144 spoken lines** (he is making them now, November 24, 06:58), recorded from `game/talk/recording/z4-recording-order.txt` (sent November 24).
   Zone 4 is being built to fit those words, so none should need making twice.
3. **Zone 4's narrator lines:** 18, the list went to him on November 24 (`narration-recording-order-z4.txt`). They
   are proposals: he may change any before recording.
4. ~~Two character sheet pictures for the new creatures of the frozen peaks.~~ **He sent both (10:46); the
   `peak-creatures` job is building them.** **Answered 10:52:** the great bramble stays as it is, and Briarmaw is left out of the game. So the eight
   slots hold six of M7's creatures and the two new ones.
   **The foes: he has picked seven** (November 24, 09:25; the `creatures` job is bringing them in). Still his to
   say: where each lives (the hub's proposal is in `docs/decisions.md`), an eighth for zone 4's peaks if he wants
   one, what a beaten creature does, and the name "the Rotwarden" beside the story's Wardens. As asked before:
   the five foe questions at the end of `docs/foes-from-m7.md`. Until he answers, every creature slot stays a
   stand-in. The fights job is trying one M7 creature in this game's battle, outside the repo, to learn what
   bringing one in takes.
5. ~~Two pictures for each townsperson.~~ **Not needed for the first draft** (07:58: he thought the people's
   models were already made; the townsfolk keep the eleven's bodies). The kit is ready if he ever wants it.
6. ~~Yes, or changes, to the sky's names.~~ **He said yes to all of them (November 24, 06:58).** They are lore:
   `docs/decisions.md` and `docs/lore/README.md`. **The hub still has to put them on the star map** (below).
   As it stood before his yes: the proposal is in (`docs/lore/sky-names-proposal.md`) and the short
   page went to him on November 24: the Cresset and the Taper (the twin suns), the Vigil (the far star); Brasa,
   Saffren, Pavane and Glaswen (the four planets, each with a fair-folk name); the Amberwake (the band of crystal).
   Still stand-ins. When he has chosen, the hub puts the lines at the end of the proposal into the star map's
   data (`game/maps/data/maps-data.js`, once the maps job is in `main`), and marks Auros settled there too (the
   maps data still calls its spelling open; `docs/decisions.md` settled it on November 18).
   The job could not read his own lore compendium: it is in a repo that is not a source. A name he gave there wins.
   The hub's own check added one thing: *Pavane* is also the title of a well-known 1968 novel (not about a planet).
7. **The flight: made again from his newest airship game, or left as it is?** The flight was built on the oldest
   version of Skies of Aethermoor. The one he plays is stage 4 and stage 5, on other branches of that repo. The
   Fire button is put right (below); the ships' better looks and the smoother picture of stage 5 are not in.
8. **A try on his own laptop and phone, at the next safe stopping point** (his word, 07:58: zone 4, the fights and
   the joining in and checked, one set of builds sent): `flight.html` again (does a thumb held on Fire aim as he expects; its
   frame rate); whether the phone keeps a save between visits (the Save tab's "visit N"); whether the phone opens
   a page of 100 MB at all; how the narrator sounds the B way.

### Zones 1 to 3 are one journey; zone 4 speaks (November 24, 11:34)

- **The journey, in `main`** (`docs/slips/journey.md`): a "Board the ship" button by the ship at each landing; before a
  zone's story is done she takes the coven only to landings already reached; then the 3D map opens with the next
  one open; the next zone's page plays the flight in before its world is built, with the Grey Hat's and the
  narrator's flight lines; a lost or turned-back flight puts the coven back where they left; the menu's slot goes
  from page to page; `game/pages/index.html` is the front door (the name, "Carry on" for each slot, "New game").
- **Checked on its own branch,** not run again on `main`: `tools/journey-test.py` 44 checks; `zone-test` 28, 21, 25;
  `people-test` 134; `story-test` 61 and 64; `things-test` 40; `menu-test --only A` 58; `maps-test` 108;
  `flight-test` 64. Built pages: zone 1 117 MB, zone 2 107 MB, zone 3 104 MB.
- **Small folk stand straight** (one line in `game/witches/kore/jester_kit.js`): knees from 65 to 93 degrees up to
  164 to 172, where 180 is straight. Shown on a small page only: the in-zone pictures were unusable.
- **Zone 4's recordings are in: 142 of 144.** The held Warden's two lines (`z4.warden.01`, `.02`) did not come.
  `story-test` on zone 4: 74 good, 2 failed, both those two lines.
- **Rough, known:** on an upright phone "Board the ship" and "Go on" lie over the frame-rate and level pills (being
  put right in the second part); the leaving narration says the ship lifts before Board is pressed; zone 3's
  flight out starts over the northern camp though she leaves from the slip.
- **ANSWERED 12:00: which ship lies where.** The Skiff (zone 1), the Skiff slightly upgraded (zone 2, and zone 3
  until the refit), the Cutter (zone 3 after the refit), the Cutter slightly upgraded (zone 4). The journey job's
  third part. `docs/decisions.md` has it in full. As it stood: the Skiff at Wickhollow, the Cutter at zones 2 and 3 (zone 3's
  recorded lines say she is refitted, "same old ship"; the Brig, 25 m, does not fit the 17 m slip). His word of
  November 23 was that the four ships are the four travel upgrades. And the phone trial (`trial/phone/`): no answer yet.

### The fights are built, and one M7 creature ran in this game's battle (November 24, 08:48)

- **Built on `job/fights`** (the slip has it all): the slots as data (`game/encounters/slots.js`, A on, B off, each a
  stand-in that names the creature `docs/foes-from-m7.md` suggests); the whole game's levels as one plan; fights on
  zones 2 and 3; zone 4's as data; the three page events for the narrator.
- **The numbers** (`node tools/encounter-balance.mjs`): about 45 fights to each gate's level in every zone, 181 in
  all, and within 1.5 fights of that with both slots on or neither. An attentive player loses under 1 fight in 100.
- **A mistake it found and put right:** on the land a zone 1 fight gave 1.75 times the experience meant, so zone 1
  took about 26 fights to level 5, not 45.
- **The M7 trial: it works, with changes.** The Willow-Wight was drawn and moved in this game's battle and fought
  to its end. M7's loader had to be rewritten for this game's three.js (about 45 lines) and its poses joined to
  this battle's motions (40 lines). One creature adds about 1.4 MB to a page. Scratch files only, outside the repo.
- **Chris's to say:** which creatures fill the eight slots; whether about 45 fights a zone is right (zone 2's road
  must be walked about twice before level 10); how hard the ending is; what a beaten creature does.

### Zone 4 is in (November 24, 08:40)

- **In `main`:** `game/pages/zone-4.html` (82.1 MB with the maps; no recordings yet): five places from the old Envoi,
  3.3 km of road from the frozen camp to the Moonwell, six people to talk to, forty held Wardens, the great
  bramble, Halcyon, the fire, the moonset, and the story from the landing to "You came down. Five of you." The
  Faire ending is a piece of its own (`game/people/faire-ending.js`, tried on `game/pages/faire-ending.html`).
- **Checked by the hub on `main`, built again:** `zone-test` 19, `story-test` 75, `menu-test --only A` 57,
  `maps-test` 108: all good. The hub added the maps' block to the page and zone 4 to the maps' data.
- **The narrator's 18 lines for zone 4 are proposals** (`game/people/narration.js`); the list to record from is
  `game/people/recording/narration-recording-order-z4.txt`. It went to Chris.
- **Still to do for zone 4** (the slip's "For the hub" has the exact lines): its recordings (when Chris sends them:
  `tools/voice-list.py z4`, then build); its two fights (the fights job has fitted them to its hooks); its flight
  in, its flight home, and the Faire ending joined to zone 1's page (the journey); a baked ship of its own.
- **Chris's to say** (each one line of data): the peaks stand at one ninth of the map's height, not one third (at
  one third no walkable road exists); Misthollow stands 143 m south of its pin and the Moonwell at the head of its
  street; the walk is 3.3 km up and 3.3 km down; the forty wear the night-watchman's coat.

### The maps are in, with the sky's names on the star map (November 24, 07:42)

- **In `main`:** the Maps tab (Zone, World, Sky) on all three zone pages, the 3D map of Aethermoor with choosing
  where to fly, and the star map. Chris's names are on the star map (`game/maps/data/maps-data.js`); each card's
  words are still a proposal.
- **Checked by the hub on `main`:** the small page `maps.html` (9.2 MB), `tools/maps-test.py`: 102 checks, all
  good; pictures of every view at both sizes. On an upright phone the suns' longer name fits.
- **NOT run by the hub on `main`:** the zone pages with the maps in them. The maps job ran them on its own branch
  (`maps-test` on zone 1: 108; on zones 2 and 3: 54 each; `menu-test --only A`: 58; `things-test`: 40;
  `people-test`: 134), and nothing that has come into `main` since touches them but the five narrator recordings.
  **Run them all again when the journey is joined,** with `zone-test` and `story-test`, which the maps job did not run.
- **Sizes with the maps in** (the maps job's numbers): zone 1 is 108.6 MB, zone 2 is 97.6 MB, zone 3 is 94.9 MB.
- **Left for the hub** (from the maps job's report): `choose()` stops the land and starts it again by itself (one
  line if the hub would sooner do it); the Zone view reads `window.__map` (a `drawBigInto(canvas)` in the minimap
  would be cleaner); the shipyard shows on the 3D map as standing in water; the pin inside a town is on the right
  place but not the right house; a phone's memory with the game and a 3D map both open has not been measured.

### The townsfolk's bodies, first part (November 24, 07:42)

- **23 people need a body of their own** (the 18 of zones 1 to 3, and zone 4's five). Only the forty held Wardens
  share one. Today they stand on 9 stand-in bodies, each a copy of someone at the Faire.
- **Chris's part: 46 pictures** (two a person). The folder and its `START-HERE.txt` went to him. One person first.
- **Halcyon** is not from this kit: Chris decided earlier she is the doll (Io's body) in the paladin outfit with a
  glow, built in the old Envoi. On `job/zone-4` she is a stand-in. **The knight of zone 3** stays a light on the land.
- **A fault in the game today, found by this job:** anyone made smaller than a witch stands with bent knees and
  elbows (Pell, Tamsin, Tock, Pim). The fix is one line in `game/witches/kore/jester_kit.js`, `solveLimb`:
  `let d = _va.length() / (root.scale.y || 1);`. Tried in a scratch copy only. **The hub is to make it and look at
  the four in a zone page.**
- **Chris's to decide** (the slip has all six): every look; what the moon's people and a gnome look like; the Ember
  Wardens' colours; the lifelike look of the eleven or the witches' painted look; whether the Warden who speaks is
  a man or a woman (the cast and the notes disagree).

### How a model is built here (Chris, November 24, 12:00)

Whoever builds a model is a sub-agent on **Opus 5.5 at high or extra high effort.** It makes **a highly detailed
model, a million triangles or more, and bakes it onto a simpler model** the game draws; and it **paints the model
from pictures that already exist** (his sheets, his skins) and does not repaint from words. Put this in every
brief that builds a model.

### Chris's Fable usage (November 24, 06:58; 74% at 07:58)

He was at 60% of his week's Fable usage at 06:58 and 74% at 07:58. **His word (07:58): new side work runs on Opus
5.5 at high effort; what is running may run on; the hub coordinates.** Start nothing new on Fable. The sub-agents are the big
spenders (what three of them used, start to finish: sky names 0.3 million tokens, the maps job's last part 0.55
million, the townsfolk's first part 0.59 million; zone 4 and the fights are bigger jobs and still at work). If more side work is needed, ask him first whether it runs on Opus 5.5 (extra high), which he also
allowed, or waits. Keep the hub's own steps few.

### The flight's Fire button aims (November 24, 06:10)

Chris tried `flight.html` on his phone: it did not steer like his airship game, where "the fire button is also a
joystick". The cause: the flight was made from the oldest version of that game, where Fire only fires. Now a thumb
held on Fire slides to aim while the guns keep firing (`game/flight/src/game/input.js`, marked "Coven"). In `main`.
`tools/flight-test.py`: 64 checks, all good. Not checked: how it feels under a real thumb. The flight job's slip
has the rest, and a true fact about the record: that repo has no branch named `main`; the commit in
`assets/INDEX.csv` (`1887984`) is right.

### Waiting on Chris (the newest; the older lists below still stand where not answered)

1. **The narrator's five changed lines, recorded with their words as they are now.** What he sent at 19:40 (a
   page) and at 20:57 (two packets) were the same recordings the game already has, with the old words for those
   five. The list of the five, with their words as they now are, went back to him.
   **ANSWERED (20:57): the narrator's sound is B,** close and warm. Done, in `main`.
2. **ANSWERED (19:40): the great wraith waits in the fen's dark heart.** Done and in `main`.
3. **ANSWERED (19:40): the four ships are the four travel upgrades.** The hub's reading of the order (Skiff,
   Cutter, Brig, Frigate, one at each gate) is his to correct.
6. **Which of M7's creatures come into this game, and where.** The fights job's step 4 keeps two slots a zone.
   The suggestions are in `docs/foes-from-m7.md`, with five short questions at its end: the willow-wight and the
   briarling for zone 1, the mirage wisp and the thornhound for zone 2, the sapwight and the rime wolf for zone 3,
   the rime-wraith and the peak-troll for zone 4.
4. **The townsfolk's bodies:** who makes the 18, and when. They can stay as they are until the end.
5. **A creature is ready:** when one is, he says so, and Aethermoor M7 becomes a source.

## Hub handoff (November 23, 2026, 13:15; brought up to date at 15:45)

Chris moved the hub to a new conversation. This section is the newest and truest part of the board. Where an
older section below says something different, this section is right.

**The new hub picked up at 14:57** with this repo to write to and the two old repos to read. Steps 1 to 4 of the
list below wait on Chris, so it did **step 5, the four small things zone 1's lines speak of. Done, checked, in
`main`.** What it found and built is in `docs/slips/zone-1.md` (the newest part, at the top).

### Where things stand

- **Everything is in `main`.** No branch holds work that `main` lacks, and nothing was left unsaved.
- **Three zones can be walked and their stories played**, each as its own page:

  | Page | What is in it | Size |
  |---|---|---|
  | `game/pages/zone-1.html` | Wickhollow, the Thornwood, Bogmire and its heart, Io's cottage, the jetty, the Moon Faire's camp; 19 people; fights in the wild and the great wraith; the story from dusk to the leaving. **New (15:45):** the cottage's gate lamps glow; Old Bridie's lantern; a stand-in ship at the pier with twelve lamp hooks, a lamp on each as it comes home; the pale moth after the great wraith | 100.3 MB |
  | `game/pages/zone-2.html` | The Warm Roads camp to Dawnroost's living node, 2.5 km; 6 people; three road stones to light; the story from the landing to the leaving | 90.2 MB |
  | `game/pages/zone-3.html` | The northern camp to the shipyard, 3.6 km, ending on a causeway over the sea; 7 people; the knight's light; the story from the landing to the leaving | 87.4 MB |

- **Voices:** all 480 of the people's and the coven's lines for zones 1 to 3 are recorded and in. The narrator has
  43 of 48 lines in, made close and warm (way B, Chris's choice, November 23, 20:57).
- **Fights** are in zone 1 only (the fights job's steps 1 to 3). In zones 2 and 3 the two big fights are stood in
  for: walking up to them counts as the fight met.
- **Not built yet:** the flight between zones, zone 4, one title and one save for the whole game.
- **The checks all pass** on what is in `main` (run again at 15:35): `tools/zone-test.py` on the three zones,
  `tools/people-test.py`, `tools/things-test.py` (new) and `tools/encounter-test.py --quick` on zone 1,
  `tools/story-test.py` on zones 2 and 3. None of them can hear a line, see a motion or measure a frame rate.
- **What Chris has last been sent:** November 23, 12:22: `listen-narrator.html`, and the three zone pages with the
  narrator speaking. November 23, 15:45: `zone-1.html` with the four small things, and four sheets of before and
  after pictures.
- **The ship at the jetty is the real one since 22:25:** the Skiff from Skies of Aethermoor ("The plan to finish").
  The hub's stand-in of the afternoon is gone.

### What is in progress, and on which branch

| Who | What | Branch | State |
|---|---|---|---|
| The hub | Zones 1 to 3, the people, the story engine, the narrator; zone 1's four small things (15:45) | `job/zone-1` (the hub's working branch) | All of it merged into `main`. Nothing half done |
| The `fights` conversation | Step 4: two slots for a new creature in each zone, the whole game's levels, the checks at three settings. Its starter text is under "Starter texts" | `job/fights` | Handed out November 23, 10:36. **Not merged: Chris has not said it is ready.** The branch holds nothing new yet |
| The `story` conversation | Zone 4's recordings (its 144 lines are written and in `main`) | `job/story` | Merged up to its last commit. Zone 4's sound is still to come |
| Chris, with ChatGPT and ElevenLabs | The narrator's five changed lines, made again | none | See "Waiting on Chris" |
| Chris, in another conversation | Creature models for another game on the same continent | not this repo | That repo is off limits until he adds it as a source |

`job/minimap` and `job/first-test` are finished and merged.

### Waiting on Chris

New at 15:45, the first two because the next steps need them:

1. **ANSWERED (19:00): the hub has read Skies of Aethermoor.** As it stood at 15:45:
   **Skies of Aethermoor, for the hub.** The flight between zones (step 6) and the Grey Hat's real ship both come
   from `chriskizer91-ops/airship-game-in-aethermoor-`. It is a source by the rules, but the hub's new conversation
   was given three repos and not that one, and may not add it by itself. Chris adds it to the hub's conversation,
   to read only. Until then the hub can go on with zone 4's land (step 7).
2. **Where the great wraith waits.** Old Wenna says "It sits in the fen's dark heart. Up the north road, where the
   boardwalk ends", and the narrator "The fen's dark heart. The boardwalk ends here". But the fight is offered on
   the road 20 m out of Bogmire's north gate, 390 m short of the heart (the fights job's own proposal, marked as
   Chris's to place). The hub's suggestion: move it into the heart's square, before the drowned hall's steps, where
   the old Envoi's great wraith sat. It is one line of the fights job's. If he says yes, the text for the fights
   conversation is under "Starter texts".
3. **What he makes of the four small things:** the stand-in ship (a plain hull, to be replaced), the moth (a pale
   shape in a soft light; it rises the way the camera looks), Bridie's lantern, the gate lamps' glow.

From the handoff of 13:15, still open:

1. **The narrator's sound.** A, B, C or D on `listen-narrator.html`, or what is wrong with the nearest. He wants the
   narrator to sound like a storybook, and different in direction from the people's voices.
2. **The narrator's five changed lines, recorded again:** `z2.narrator.04`, `z3.narrator.09`, `.10`, `.12`, `.13`.
   The words are in `game/people/recording/narration-recording-order.txt`.
3. **Which other voices need editing,** and what is wrong with each, in plain words. He judges by ear.
4. **Frame rates** on his laptop and phone for all three zone pages, and whether the phone opens files of 87 to 100 MB.
   Still open from November 19: the Flipbook look dropping to 20 to 35 frames a second for a moment on the phone,
   when crossing from a town into the woods.
5. **The shipyard's spot:** in the bay, 280 m south of its pin (a hub's call). Back on the pin, or leave it?
6. **Zone 3's order:** the shipyard first, the knight on the way back up to the crossroads (a hub's call).
7. **When the fights job's step 4 is ready** to bring in.
8. Smaller calls, none of which blocks anything: Tully's body is a man's and the voice a woman's; whether a person
   already met still says a short word when the coven walks right up; whether the coven speaks too much; the jetty's
   pin; any names he wants changed; what he makes of the camp.

### Next steps, in order

1. **When Chris picks the narrator's sound:** `python3 tools/narrator-sound.py render C` (his letter), then
   `python3 tools/voice-list.py z1` (and `z2`, `z3`), build the three pages, run the checks, send them.
2. **When the five new narrator lines come:** unpack them into a new empty folder with `z2/` and `z3/` inside,
   `python3 tools/narrator-sound.py take <folder>`, then step 1 again with the letter he picked (A if none yet).
3. **Any voices Chris names for editing.** Fix what can be measured. For a matter of taste, make a few versions on a
   page like `game/pages/listen-narrator.html` for him to pick from.
4. **When Chris says the fights job's step 4 is ready:** bring `job/fights` into `main` (expect a clash in
   `assets/INDEX.csv`: keep both sides' lines). Then join the fights to zones 2 and 3 ("For the fights job, when it
   reaches zones 2 and 3", below), and wire the narrator's three unwired lines in zone 1 (`first-wisp`, `rest`,
   `not-ready`) to the fights' own events.
5. **DONE (November 23, 15:45).** The small things zone 1's lines expect to see: the pale moth on the land after
   the great wraith, flying west; the lit gate lamps at Io's cottage; Old Bridie's lantern; the Grey Hat's ship at
   the jetty (a stand-in). Left over from it, small, none blocks anything:
   - No flame leans anywhere, though the lines say every flame leans north. A thing for the whole game: the camp's
     lanterns, Bridie's lamp (which should stand almost straight after the great wraith), the towns' lamps.
   - Quill has no lantern "tied to its post with three hitches". Odile's stall is 20 m from the well, and two
     pointers say "by the well". Old Wenna's stall "by the boardwalk" was not looked at.
   - The moth could rise on the great wraith's own spot once that spot is settled ("Waiting on Chris", 2).
6. **The flight between zones. IN PROGRESS since 19:15** (the jobs `maps` and `flight`, "The plan to finish").
   As it stood at 15:45: it needed the Skies of Aethermoor repo added to the hub's conversation ("Waiting on
   Chris", 1). Skies of Aethermoor is a read-only source by the rules; copy only what the game uses.
   The pages call each other; the flight lines (`flight`, `flight-after`) get heard; a ship stands at each landing.
   The real ship takes the place of the stand-in at the jetty: one file, `game/places/jetty-ship.js`. Keep
   `W3D_PLACES.jetty.ship.hooks` (where the twelve lamps hang) and the lamps follow.
7. **Zone 4:** its land, people and story, the same way as zones 2 and 3. Its places and pins on the map:
   frozen-camp (2760, 1105), frostmere-shore (3180, 1125), frozen-pass (3270, 980), misthollow (3500, 735),
   moonwell (3522, 645). Its lines are in `game/talk/zone-4.js`; the plan is `docs/lore/story-zones-2-4.md`; it
   ends with a `faire` moment back at the camp.
8. **One game:** a title, one save, a pause menu, everything joined. **The pause menu and the saves are IN
   PROGRESS since 19:15** (the job `menu`), with three slots, not one (Chris, 19:00).

### How the hub works here (what a new hub needs to know)

- **Two copies of the repo are handy:** one on `job/zone-1` to build in, one on `main` to merge in
  (`git merge --no-ff`) and to edit the board and decisions. A plain `git fetch` may not show the job branches:
  fetch each by name (`git fetch origin job/fights:refs/remotes/origin/job/fights`). `git ls-remote origin` shows
  what GitHub really has.
- **Build and check:** `python3 tools/build.py game/pages/zone-2.html`, then `tools/zone-test.py`,
  `tools/story-test.py` (zones 2 and 3) or `tools/people-test.py` (zone 1) on the built page, then pictures with
  `tools/look.py` and `tools/hub/sheet.py`. Each check takes 3 to 8 minutes with no graphics card. `tools/look.py`
  counts some harmless warnings as page errors once people are in a page; the checks' own count is the true one.
- **Adding a zone:** copy each place with `tools/hub/copy-place.py`; write `game/places/zone-N.js` (each place's
  pin, the gates opened, the roads named with `route: true`) and `game/people/zone-N.js` (who stands where, the
  story's rules, the things on the land); make the page from `game/pages/zone-3.html`. Zone 3's files are the
  newest pattern. `tools/hub/probe.py` runs a piece of script in a built page, for measuring the land.
- **The slip for all of the hub's building** is `docs/slips/zone-1.md`: newest part first, with every hub's call,
  what was checked and how, and the rough spots.
- **Zone 1 now has "things on the land" too** (`game/people/things.js`, `W3D.THINGS['zone-1']` in
  `game/people/zone-1.js`): its check is `tools/things-test.py builds/zone-1.html`, about 35 seconds. A thing can
  stand anywhere on the land, make a light that faces the camera (`halo`) or lies on the ground (`pool`), and is
  told the game's clock, so a check can step it. `W3D.fair.piece` stands one piece of the fair kit anywhere.
- **Look from where a line is said before trusting it.** Two of zone 1's set points were said where the thing they
  speak of could not be seen (the cottage's gate lamp, the ship at the pier). `tools/look.py` takes a plan of shots;
  a shot's `js` runs before its camera is set, so set the walker inside the `js` if it needs her place.
- **Things that tripped this hub:** the map's coasts are steep at one third size (zone 3's shore is 67 m below its
  camp), so check heights before trusting a road; a place that stands in the map's own sea needs `sea: true`; a
  narrator line must match the land as built, so read them against the map before they are recorded.

## What this game is

One game made from two: the new Envoi (Aethermoor's four zones in 3D, the 3D map, the rebuilt battle with sound) and
Moon Faire (the four witches of the coven, the fair folk and their minds, the open land, levelling and herbs).

Chris's plan and answers are in `docs/decisions.md`. In short: the world is Aethermoor; all four witches from the
start and any of them can lead; the game starts at the Moon Faire's camp in zone 1; each zone is one open land with its
towns in it, no fade; the fight is the new Envoi's battle; four gate fights at levels 5, 10, 15 and 20; flying between
zones by Skies of Aethermoor, and walking far is far on purpose.

## The order Chris set

1. **The first test** (the Thornwood with Wickhollow). **Done.**
2. The rest of zone 1. **Built, bar the people, and rebuilt on the map of Aethermoor at one third size.**
3. The fights joined on. **Done for zone 1** (job `fights`, November 19).
4. The people. **Begun** (November 19): the Moon Faire's eleven stand in the camp and on the roads, and talk; every person will speak aloud; the story job writes the lines.
5. Zones 2 to 4.

One HTML file to Chris at each milestone.

## Where we are

**Milestone 1, the first test: done.** Chris ran it at his screens' top speed (144 frames a second on the laptop, 60 on
the phone).

**Milestone 2, zone 1: built** (as it stood on November 18; it has grown since, see the handoff above). `builds/zone-1.html` (from `game/pages/zone-1.html`, then 71 MB):

- All six of the zone's places on one land of 955 m by 675 m, joined by roads, walked between with no fade.
- **The game starts in the Moon Faire's camp**: 43 pieces of Moon Faire's fair kit in a meadow off the south road,
  lantern-lit, a lane to its gate.

Its slip is `docs/slips/zone-1.md`. Chris ran the six places (before the camp) at 144 and 60 frames a second again, and
his phone opens the file. The copy with the camp went to him on November 18, at night.

What the checks say (no screen, no graphics card):

- Io walks from the camp to Wickhollow and from each place to the next, and arrives; her height never jumps more than
  9 cm at an edge.
- 0 page errors. The file fetches nothing from outside itself. The first test still passes.
- The page takes 11 to 12 seconds to start.

**Zones 2 and 3: their land is built** (November 23). `builds/zone-2.html` (81.8 MB) and `builds/zone-3.html` (78.9 MB):

- **Zone 2, the Warm Roads and Dawnroost:** five places on their pins on the map, four roads, 2.5 km from the camp to
  the living node.
- **Zone 3, the northern wilds and the shipyard:** five places, 3.6 km from the northern camp to the shipyard. The
  last 330 m is a stone causeway over the sea. The shipyard stands 280 m south of its pin (a hub's call, in
  `docs/decisions.md`).
- **Both now have their people, voices and story** (November 23, afternoon): six people in zone 2, seven in zone 3,
  244 recorded lines, and each zone's story plays from the landing to the leaving (`tools/story-test.py`). The
  pages are 89.3 MB and 86.7 MB.
- Not in them yet: fights (the two big ones are stood in for), the narrator's voice (words only), the flight.
- All three zones pass `tools/zone-test.py`. Nobody has seen their frame rates.

## What is being worked on now

| Who | What |
|---|---|
| Chris | Having the narrator's five changed lines made again; choosing the narrator's sound by ear; building creature models in another conversation |
| The `story` conversation | All four zones' lines written (236, 120, 124, 144); zones 1 to 3 recorded and checked; zone 4's recordings to come |
| The `fights` conversation | Step 3 done and in `main`. **Step 4 handed out** (November 23): two slots for a new creature in each zone (A on, B off), the whole game's levels, the checks at three settings (text below) |
| The hub | **Zone 1's four small things are in (November 23, 15:45): gate lamps, Bridie's lantern, a stand-in ship and its twelve lamps, the pale moth.** Before that: **Zone 1's nineteen people speak aloud; nobody speaks from a distance; a start screen; narration stand-ins** (November 23). **The narrator's 48 lines for zones 1 to 3 are written** (the hub's, at Chris's asking) and wired into zone 1 in words. **Zones 2 and 3 are built and speak, in `main`** (November 23). **The narrator speaks: 43 of 48 lines are in** (the five changed ones are being made again). Next: the narrator's sound once Chris has picked by ear; the pale moth; the flight between zones; zone 4's land; the narrator's recordings when they come; the pale moth; the flight between zones |

## A note for later: the fights' balance may be redone

Chris, November 23: he has found a way to make strange creatures in 3D, and is building models for another game set
on the same continent at another time. Some look very good and may come into this game as foes. If they do, the
levels and the fights' balance (the fights job's 49 of 51 targets, the 180 fights to level 20, each zone's foes)
may have to be worked out again. **Chris, 10:36: make a placeholder for one or two extra creatures in each zone, and balance the game so it works as long as one is added, and is easy to rebalance if two are.** That is the fights job's step 4 (text below). When a real creature comes: the foes and their numbers are data
(`game/encounters/`, `game/battle/`), a new repo of Chris's has to be added as a source in `docs/decisions.md`
before anything is copied from it, and the balance check is `tools/battle-*`.

## What is left of milestone 2 (job `zone-1`)

**The land is the map of Aethermoor at one third size** (Chris's word, November 18, 21:04; rebuilt the same night).
Every place stands where the map has it and at the map's height: the Thornwood 1.2 km south-east of Wickhollow,
Bogmire 2.6 km, the jetty on the lake to the north-east, Io's cottage up the hill to the south. The map's lakes, fen
and sea are the water. Roads find their own way over the hills and are graded. The road toward zone 2 is 2.6 km.
Any of the four witches walks. The better map is in. Where everything is, the numbers and the rough spots are in
`docs/slips/zone-1.md` ("Rebuilt on November 18, night").

How a new zone is added now: give each place its pin on the map (`at(ax, ay)` in `game/places/zone-1.js`), widen
`bounds`, and name the roads between gates with `route: true`. The engine does the rest.

1. **Chris's frame rates** on the rebuilt land, on his laptop and phone; and the Flipbook look's stutter on the
   phone when moving between areas (17 frames a second for a moment), not looked into yet.
2. **Rough spots**: the jetty's road goes round its west side; Wickhollow's river and lake stop just past the town;
   some of the map's heights are abrupt at this size; roads cross water on a plain bank of earth; the camera can
   pass inside a tent.
3. **The long roads' other ends**: the road toward zone 2 ends at a hedge.

Then milestone 2 goes to Chris as one HTML file.

## After zone 1

The hub's plan. Names and order may change.

| Piece | What it does | Depends on |
|---|---|---|
| `fights` | The new battle copied in and started from the land: unseen meetings in the wild, the nearest arena, Europa and Callisto fitted to it, herbs used | zone 1 |
| `people` | The fair folk at the camp with their minds; townsfolk in the towns; the Grey Hat at the landings | zone 1, the opening lore |
| `lore` | The opening: why the Faire is here, why the four are together, Io's family cottage. Written with Chris | his say on the story |
| `lines` | Every person's words, written new (Opus 5.5 helpers may draft; Chris reads) | `lore` |
| `zones-2-4` | The other three zones as lands, and the long roads between | zone 1's engine |
| `travel` | Choosing where to go on the 3D map, the flight in Skies of Aethermoor, landing | Skies copied in |
| `levels` | One levelling plan and one balance check for four witches | `fights` |
| `one-game` | Title, save, pause menu, the character viewer, everything joined | all of the above |

## Waiting on Chris

**To carry on well:**

- What he makes of the camp: where it is, how it is laid out, how bright the lanterns are.
- Anything he wants changed about where the places stand or how far apart they are.
- **The shipyard's spot.** The hub stood it in the bay, 280 m south of its pin, because the pin is on a headland 25 m
  above the sea. Say if it should go back on the pin, or somewhere else.
- The frame rate on `zone-2.html` and `zone-3.html`, laptop and phone.
- **Zone 3's order.** The hub made the story follow the map: the shipyard first, the knight on the way back up to
  the crossroads. Say if it should go another way.
- **Which way the narrator should sound:** A, B, C or D on `listen-narrator.html` (sent November 23, 12:13), or what
  is wrong with the nearest. And which other voices need editing, and what is wrong with each.
- **Five narrator lines changed** before recording (`z2.narrator.04`, `z3.narrator.09`, `.10`, `.12`, `.13`). If the
  narrator has been recorded already, those five need making again from the new recording order.

**A big story call (settled: Chris approved the story page on November 19; kept here for the record):**

- The opening lore. He said some has to be made up: the game starts at the Moon Faire, all four are already together,
  and Io's cottage may be her family's. The hub will write a short proposal for him to mark up before any lines are
  written.

**Left open in the old games, still his when they come up** (none blocks zone 1):

- Sound Choices: his picks among the four versions of the ten most common battle sounds.
- The 17 fighting models on Everyone Who Fights: lock them in, or say what to change.
- Whether Halcyon gets moves of her own.
- Six textures that show a faint line where they repeat.
- ~~Which Skies of Aethermoor ship he flies first.~~ Answered November 23, 19:40: the four ships are the four travel upgrades; the Skiff first, by the hub's reading.
- Four small answers on herbs.
- The Moon Faire brambles: he has not looked at them yet.
- The names of the three stars and the four other planets.
- His songs: where each plays.

## For the fights job, when it reaches zones 2 and 3

- **Zone 1's gate spot: MOVED (November 23, 19:40, on Chris's word; in `main`).** `gate.at` in
  `game/encounters/zone-1.js` is now [1506.7, 1818.7]: keep it when you merge `main`. Your check's words for it
  ("the button by Bogmire's north gate", `tools/encounter-test.py` 5b) are stale; the check passes. As first written:
  the lines put the great wraith in the fen's dark
  heart, where the boardwalk ends. The middle of the heart's square is (1506.7, 1818.7) in zone 1's metres (the
  place `bogmire-heart`, its painting's pixel 768, 420). The story's moments and the hub's moth read the spot from
  `window.__fights.gate.at`, so nothing of the hub's has to change when it moves.

- The story looks for the zone's big fight as `window.__fights.gate` (`{ id, at: [x, z] }`) and counts it won when
  `party.gates[id]` is true, as in zone 1. The hub's names for them: `nodeNight` (zone 2, at Dawnroost's living
  node) and `knightOfLight` (zone 3, on the crossroads' east road). Any other id works: the story uses the gate's own.
- Until there is a gate, the story stands in for it. Once `__fights.gate` exists on a zone's page the stand-in
  stops by itself.
- Zone 2's three road stones are lit by a button now (`game/people/zone-2.js`, `W3D.THINGS`). A fight by each stone
  can be added by making `can` wait for it.

## Jobs

| Job | What it does | Branch | Slip | State |
|---|---|---|---|---|
| `first-test` | The open land round Wickhollow, as one HTML file | `job/first-test` | `docs/slips/first-test.md` | **Done, in `main`.** Built by the hub. Sent to Chris |
| `zone-1` | All of zone 1 on one land; and all of the hub's own building since (zones 2 and 3, the people, the narrator, the small things) | `job/zone-1` | `docs/slips/zone-1.md` | **In `main`**, up to zone 1's four small things (November 23, 15:45). The rough spots are in the slip |
| `menu` | The pause menu and three save slots (a sub-agent of the hub's) | `job/menu` | `docs/slips/menu.md` | **Done, in `main`** (November 23, 21:50) |
| `maps` | The 3D map of Aethermoor and the star map in the menu; choosing where to fly (a sub-agent) | `job/maps` | `docs/slips/maps.md` | **Started November 23, 19:15** |
| `flight` | The flight between zones from Skies of Aethermoor; the real ship (a sub-agent) | `job/flight` | `docs/slips/flight.md` | **Done, in `main`** (November 23, 22:25). Joining it to the zones is the hub's |
| `sky-names` | Names proposed for the stars, planets and the rest of the star map (a sub-agent; a lore job) | `job/sky-names` | `docs/slips/sky-names.md` | **Proposal in, in `main`** (November 24, 06:25). Nothing built. Waiting on Chris's yes or his changes |
| `townsfolk` | The towns' people in bodies of their own, first part: shapes, guides and the words for Chris's pictures (a sub-agent) | `job/townsfolk` | `docs/slips/townsfolk.md` | **Started November 24, 06:03** |
| `zone-4` | All of zone 4: land, people, story, the narrator's words (a sub-agent) | `job/zone-4` | `docs/slips/zone-4.md` | **Started November 24, 05:41.** Its text is not on the board: the rule that matters is that no word of `game/talk/zone-4.js` changes, because Chris is recording those lines |
| `minimap` | A better map in the corner (a sub-agent of the hub's) | `job/minimap` | `docs/slips/minimap.md` | **Done, in `main`.** Its files were `game/engine/land/minimap.js` and the map's CSS in `game/pages/zone-1.html`; they are the hub's again now |
| `fights` | The battle here as its own page, grown to four witches; then fights on the land | `job/fights` | `docs/slips/fights.md` | **Steps 1, 2 and 3 done and in `main`** (November 19): the battle page; `CovenBattle.start()`; the party kept in the browser; unseen meetings in zone 1's wilds (about 46 fights to level 5); the fight over the land and back; rest at the camp; the gate's spot (a proposal). Zone 1's page is 83.5 MB **From November 24, 06:03 the rest of the job is a sub-agent's of the hub's, on Chris's word; the fights conversation is done with.** Its text is not on the board: step 4 as written under "Starter texts", then zones 2 and 3, zone 4 as data, and a trial of one M7 creature outside the repo |
| `story` | The story's dialogue, written to be spoken aloud (every person has a voice) | `job/story` | `docs/slips/story.md` | **In `main`** (November 23): the story page Chris approved; every line of zones 1 to 4 (`game/talk/zone-*.js`, `cast.js`); the recordings for zones 1 to 3 (`game/talk/audio/`, 480 files, 16 MB). Its notes for the hub are at the end of its slip: the moth, the gate lamp, and what zones 2 to 4 need |

**Who owns which files, so two conversations never write the same one:**

| Job | Its own folders and files | Must not change |
|---|---|---|
| `zone-1` (the hub) | `game/engine/`, `game/places/`, `game/fair/`, `game/people/`, `game/data/`, `game/pages/zone-1.html`, `game/pages/first-test.html`, `game/witches/`, `game/art/world/`, `tools/build.py`, `tools/look.py`, `tools/walk-test.py`, `tools/zone-test.py` | anything of `fights` |
| `fights` | `game/battle/`, `game/sound/`, `game/party/`, `game/encounters/`, `game/art/arena/`, `game/art/backdrops/`, `game/pages/battle.html`, `tools/battle-*`, `tools/encounter-*`, `docs/slips/fights.md`, the faces the battle uses in `game/witches/*/moon-*.js`, and **the two marked slots in `game/pages/zone-1.html`** ("fights job: ..." to "fights job: end") | everything in the row above (read it, use it, ask the hub for a change in the slip) |
| `story` | `game/talk/`, `tools/talk-*`, `docs/lore/story-*.md` (but not `story-brief.md`, the hub's), `docs/slips/story.md` | everything else (read it, ask the hub for a change in the slip) |

Both add lines to `assets/INDEX.csv` (at the end; the hub sorts out the join when it merges).

## How to start a job (for Chris)

1. Open a new conversation and paste the job's starter text from below.
2. The job works on its own branch and sends you one HTML file to open on your laptop and phone.
3. Tell the hub when the job says a step is ready. The hub brings it into `main` and updates this board.

## Starter texts

### `fights`, step 4 (paste this into the fights conversation)

```
Step 4 for the fights job: room for new creatures, and the whole game's levels. Step 3 is in main. Thank you.

First: git fetch, then merge origin/main into job/fights. Read the top of docs/decisions.md, docs/BOARD.md (the
note "the fights' balance may be redone"), docs/slips/zone-1.md (the two sections of November 23) and
docs/slips/story.md ("For the hub"). What is new on the land: nineteen people stand in zone 1 and speak aloud with
recorded voices; the story has stages; the land is paused behind a Begin button until the player taps it.

WHAT CHRIS SAID (November 23)
He has found a way to make strange creatures in 3D, and is building models for another game set on the same
continent at another time. Some look very good, and he may bring them into this game as foes. His words: "come up
with a placeholder for an extra creature or two extra creatures in each zone, and we balance the game so that as
long as one of those creatures gets added everything works out, and it's easy to rebalance if two additional
creatures come in for each zone."

THE PLACEHOLDERS (the hub's proposal; the names and what each does are stand-ins for Chris to replace)
Every zone gets two slots for a new creature, A and B. Slot A is ON: the game is balanced with it in. Slot B is OFF,
and turning it on is one switch and one run of the checks. Until Chris's models come, each slot is a stand-in that
can be fought: a plain dark shape with two pale eyes, sized for its kind, shown as "a strange creature".

  Zone 1 (levels 1 to 5)    A  the heavy one: slow and tough, with one big blow that can be seen coming.
                               Met in the thorn country and the fen, from level 2.
                            B  the swarm: three small quick ones, each down in a blow or two. Met in the open wilds.
  Zone 2 (levels 5 to 10)   A  the cold-bringer: does little harm itself, but slows and weakens the four.
                               Met along the cold roads.
                            B  the pair: two that are much stronger while both stand. Met in the hills off the road.
  Zone 3 (levels 10 to 15)  A  the armoured one: blades slide off it, magic does not. Met in the brambles.
                            B  the leaper: goes past the front for whoever stands at the back. Met in the wilds.
  Zone 4 (levels 15 to 20)  A  the light-thief: drains the four's magic rather than their health. Met on the pass.
                            B  the big one: rare, a long fight, worth three ordinary ones. Met near Misthollow.

If one of these does not fit how the battle works, change what it does and say so in your slip. What matters is
that each slot has a clear job in a fight that the foes already there do not have.

WHAT TO BUILD
1. The slots as data: one file that says, for each zone and slot, whether it is on, its name, its levels, where it
   is met, how often, what it does in a fight, and which model draws it. Swapping the stand-in for a real model must
   be a change to that file and one new model file, with no change to the rules.
2. The rule that keeps the balance steady: a new creature is worth, in experience and in danger, the same as the
   fights it takes the place of at that level. So turning a slot on or off changes what the fights are like, not how
   many fights it takes to reach the next level, and not how often the careful and careless players lose.
   Slot A takes about one fight in five in its zone. With B on as well, each takes about one in six.
3. The whole game's levels, all four zones, as one plan: zone 1 levels 1 to 5, zone 2 to 10, zone 3 to 15, zone 4 to
   20; about 45 fights in each; the gates at 5, 10, 15 and 20 as they are. Zone 1's meetings exist. Write the
   meetings data for zones 2, 3 and 4 now in the same form, by the kind of ground (road, open, pine, fen, thorn,
   and "far from any place"), so they work when the hub's land for each zone arrives. Leave each zone's gate spot
   and arenas easy to move: the hub will give the real places when each zone's land is built.
4. The checks, with your pretend players, at three settings: A on (the game as shipped), A and B on, and neither.
   For each: how many fights to each gate's level, and how often each kind of player loses. A on must meet your
   targets. The other two must stay close, and you say how close. One command runs all three.
5. A short page of plain steps, game/encounters/ADDING-A-CREATURE.md: what Chris or a later conversation does when
   a real creature arrives (put its model here, set these lines, run this check, read these numbers).
6. Three small things the land's narrator needs from the fights. Send a page event for each, so the hub's code can
   listen without touching yours: window.dispatchEvent(new CustomEvent('coven-fights', { detail: { what: ... } }))
   with what = 'first-meeting' (just before the very first fight begins: wait up to 6 seconds for the hub to call
   detail.done(), so a line can be said first), 'rest' (the party has rested at the camp), 'not-ready' (the party
   has come to a gate's spot too soon; when the hub answers detail.told(), do not show your own words for it).

Small calls are yours: write each in your slip as a job's call. The creatures' names and what they are in the
story are Chris's. The other game's repo is not a source for this one yet: copy nothing from it until the hub adds
it in docs/decisions.md. Both pages must still build, and tools/zone-test.py, tools/people-test.py and your own
checks must still pass. Push to job/fights often, and tell Chris when a step is ready.
```

### The three sub-agent jobs of November 23, 19:15: what every one of them is told first

```
You are a sub-agent of the hub's, working on Coven of the Moon Faire. Your job's name is JOBNAME and your branch is
job/JOBNAME. Chris, whose game this is, cannot code: he reads plain words, pictures and simple numbers.

READ FIRST, in this order: CLAUDE.md; docs/BOARD.md ("The plan to finish" at the top, then "Hub handoff");
game/README.md; docs/slips/README.md.

THE RULES THAT MATTER MOST (CLAUDE.md has them all)
- You write: your own new files; ONE slip, docs/slips/JOBNAME.md; and, in a page under game/pages/ that you must
  touch, ONE block marked "JOBNAME job: start" and "JOBNAME job: end". Nothing else. Never edit another job's
  files, docs/BOARD.md, docs/decisions.md, docs/questions.md, docs/assets-list.md or CLAUDE.md. If you need one of
  those changed, or a change to a file of the hub's or of the fights job's, write the exact change in your slip under
  "For the hub" and work round it meanwhile.
- The old repos are read-only. Copy in only what the game uses, and only the finished piece. Every copied file, or
  folder copied whole, gets one line in assets/INDEX.csv in the same commit, with the commit it was read from.
  A copied file that you then change gets a comment marked "Coven" at each change.
- A build is one HTML file with everything inside it and no internet: python3 tools/build.py game/pages/<page>.html
  (it writes builds/<page>.html). The builder stops if the finished file names any web address at all, even in a
  comment, so take web addresses out of whatever you copy in.
- Words the player reads live in a data file, not in code. A name that is not settled is a stand-in and is marked so.
- Screens: few buttons, each large enough for a thumb (44 px or more), nothing covering the middle of the picture.
  It must work on a laptop (keyboard and mouse) and on a phone (touch), upright and on its side. Check at 1280 by
  720 and at 412 by 880.
- The repo is public: no keys, no private details, no paths from anyone's computer, in files or commit messages.
- Don't settle one of Chris's calls by building it. Where you must choose, make it one line of data, say in your
  slip that it is your call, and what the other choice was.

HOW TO WORK HERE
- This machine has two processor cores and is shared with other sub-agents. Every build, check and picture run is
  heavy (a zone page is about 100 MB and a check of one takes 3 to 8 minutes). Run each heavy command through the
  shared lock, so only one runs at a time:   flock /tmp/coven-heavy.lock <the command>
  Give such commands a long time limit (15 minutes), and do not run two at once yourself.
- Make a small page of your own for fast checks (a few MB), and use the big zone pages only for the last checks.
- The checks open a page with ?test: then nothing is saved and the game does not wait for the Begin button. Keep
  both true. tools/look.py takes pictures with no screen; tools/hub/ has the hub's helpers. A headless browser
  cannot show motion or measure a frame rate: say so, don't guess.
- Commit as you go and push your branch: git -c push.negotiate=true push -u origin job/JOBNAME
  End every commit message with the same two lines the repo's other commits end with (see git log).
- Do not merge into main, and do not touch any other working copy on this machine.

WHEN YOU ARE DONE
Your slip says, in plain words: what was built; a few numbers a person can check; what was checked and how; what
was NOT checked; what is rough; "For the hub" (what the hub must change or decide); "For Chris" (calls that are
his). Everything is committed and pushed. Your last message to the hub is a short report: what works, the numbers,
where the pictures are, what is not done, and anything you were unsure of.
```

### `menu` (given to a sub-agent of the hub's, November 23, 19:15, under the text above with its name put in)

```
JOB: menu. The pause menu, three save slots, and the frame the maps sit in.

WHAT CHRIS SAID (November 23)
"I think we need to work on the save menu." "I think three save slots if we can." He wants the star map and the 3D
map of Aethermoor inside that menu (the maps job builds those two; you build the menu they sit in). He dislikes a
crowded screen.

WHAT IS THERE TODAY
No menu, no title, no slots. The game saves itself in the browser: the party under the key coven.party
(game/party/party.js, the fights job's file: do not change it), the story's stage under keys of its own
(game/people/story.js, the hub's), and a few small switches. On screen are two round buttons, top right ("who":
choose who walks; "nums": show the numbers), the small map, and a level pill. Each page waits behind a Begin button.

WHAT TO BUILD
1. ONE menu button on the land. It opens the menu and pauses the game: the land, the story, talk and sound. Closing
   it carries on. Escape opens and closes it on a laptop. Say in your slip what happens if it is pressed during a
   fight or while someone is speaking, and make that safe.
2. The menu is one full screen with a row of tabs: Save, Maps, Coven, Settings. Other jobs add tabs through this,
   which you must build exactly, because the maps job is coding to it now:
       W3D.menu.addTab({ id, label, order, mount(el, ctx), unmount() })
           el: the tab's own panel, filling the screen under the tab row. ctx: { W, zone, close() }.
           mount is called each time the tab is shown and unmount each time it is left or the menu closes, so a
           tab that draws in 3D stops drawing and frees what it holds.
       W3D.menu.open(tabId), W3D.menu.close(), W3D.menu.isOpen()
       window events 'coven:menu-open' and 'coven:menu-close'
   Orders: Save 10, Maps 20, Coven 30, Settings 40. Until the maps job's tab is there, Maps shows one plain line.
3. THREE SAVE SLOTS.
   - First find every key the game writes in the browser's storage, and list them in your slip with what each holds.
   - A slot is a snapshot of all of them, with the time and one line a player can read (the zone, how far the
     story is, the coven's level, lamps home). The game goes on saving itself, into the slot in use: on a timer and
     whenever the page is hidden or closed. Do it without changing party.js or story.js: a layer over the same keys.
   - Each slot: Continue, New game (asks first), Delete (asks first). Copy to another slot if it is simple.
   - Save to a file and Load from a file: one small file, to carry a save between the laptop and the phone and to
     keep a spare. Loading checks the file is one of ours before it touches anything.
   - On some phones a page opened from a downloaded file is given no lasting storage. Test whether storage works
     and lasts; if it does not, say so plainly in the Save tab and point to Save to a file.
   - The zone pages are separate files today and will call each other later. Slots must hold across pages: the
     same keys in the same storage, the slot in use remembered, and the page the save was last on written in it.
   - With ?test nothing is saved, as now.
4. The Begin screen: under the Begin button, small, which slot is in use and its one line, and a way to the Save
   tab. No more than that.
5. Coven tab: the four witches, each one's level and health (read the party; do not change it), and who walks
   (what the "who" button does today). Leave a clearly marked place for a full character viewer later.
6. Settings tab: the switches that exist today (the numbers, sharpness, the Flipbook look, and sound volume if
   there is one place to set it: look, don't rewrite sound). Move "who" and "nums" into the menu, so the land has
   one button where it had two (the hub's call, for Chris to overrule). The checks in tools/ may press the old
   buttons: look before you hide them, and keep the checks passing.
7. A check, tools/menu-test.py: opening stops the game's clock and closing starts it; three slots save, load and
   delete, and a save comes back the same; the file goes out and comes back the same; the game saves itself; a
   wrong file is refused; ?test saves nothing; every button is 44 px or more at 412 by 880 and none lies off the
   screen; 0 page errors. At the end the old checks must still pass on zone 1 (zone-test, people-test, things-test,
   encounter-test --quick) and story-test on zone 2.
8. Pictures of every tab at both sizes, in a folder you name in your report.
The menu goes on all three zone pages (one marked block each). Its looks should sit with the game's own: read the
pages' CSS for the colours and the lettering already in use.
```

### `maps` (given to a sub-agent of the hub's, November 23, 19:15, under the text above with its name put in)

```
JOB: maps. The 3D map of Aethermoor and the star map, in the menu; and choosing where to fly.

WHAT CHRIS SAID
November 23: "I want to add in the celestial sky planet orbit map and the larger 3D world map into the save menu."
"The continent 3D map is to look at and for choosing where to fly using the airship game and ships as the gates
like in Envoi." November 16 (in the old Envoi's notes, which you must read: moon-faire-witches/world-map/README.md):
whenever the player travels, a 3D map of Aethermoor shows where Io is; for a flight it draws a dotted line from
here to there; then Skies of Aethermoor flies the ship there, and the zone opens at the landing.

WHERE THE TWO MAPS ARE (the old Envoi repo, read-only)
- moon-faire-witches/world-map/: the 3D map of Aethermoor. map/ holds the model (map3d.js, places.js,
  place-models.js, tree-models.js, buildings.js, moods.js, art.js, map.css), art/ its data pictures, textures and
  trees, tools/ its makers, envoi-map-where.html the page. It is step 1 of 4 there: the land, and a pin where Io is.
- moon-faire-witches/star-map/thareia-system-star-map.html: the star map of the Thareia system, one page. Its
  notes are docs/project-notes/claude/slips/star-map.md. It has hooks already (window.StarMap, and events).

WHAT TO BUILD
1. THE 3D MAP OF AETHERMOOR, in this repo under game/maps/, running inside the game's page.
       W3D.maps.world.mount(el, { here }) -> { unmount(), setHere(here) }
           here: { landing: id } or { zone, x, z } (the walker's place on that zone's land, in its metres).
       W3D.maps.world.choose({ from, open }) -> a promise of a landing's id, or null if the player backs out.
           from: the landing the ship stands at. open: the ids that may be chosen now. It fills the screen
           without the menu.
   - "You are here": a pin where the coven is. This game's zones are laid on the atlas at one third size:
     game/places/zone-1.js (and 2, 3) say how a spot in a zone's metres comes from the atlas's pixels.
   - Choosing: the landings are in game/travel/landings.js (the hub's file: read it, don't change it). Each
     shows on the map; a tap gives a card with its name; "Set course" draws the dotted line from here to there and
     answers. A landing that is not open is shown dim, with one line saying why (your own data file).
   - The old notes say the map's copy of the places is one step behind the reskin and that its own tool brings it
     up to date. Do that if the tool runs here; if not, say so.
   - It is a second 3D scene: free what it holds when it is left, and measure it (triangles, draw calls, how
     long it takes to open). It has two levels of detail: use the lighter on a phone.
2. THE STAR MAP, under game/maps/, to look at. "You are here" on Thareia.
   - It loads three.js 0.160 from the internet as a module; the rest of the game uses three.js r128 (game/lib/).
     Either pack 0.160 inside (npm has it: fetch it in a scratch folder outside the repo, copy in only the files it
     needs, and write its version and licence in your slip) and run the map in a frame of its own inside the one
     file, or change the map to run on r128. Choose the safer, and say why. Either way the built page must name no
     web address, and the map must work with no internet.
   - The names of the three stars and four planets are stand-ins, and the moon's spelling is an open question
     (docs/questions.md, 7; docs/lore/README.md gives the working name). Put every name in a data file.
3. THE MAPS TAB. The menu job is building the menu now, to this:
       W3D.menu.addTab({ id, label, order, mount(el, ctx), unmount() })      ctx: { W, zone, close() }
       mount is called each time the tab is shown; unmount each time it is left or the menu closes.
   Add one tab: id 'maps', label 'Maps', order 20. Inside it, three views to switch between: Zone, World, Sky.
   Zone is the big hand-drawn map the game already has (game/engine/land/minimap.js, the hub's: use what it
   offers and do not change it; if it offers nothing you can use, say what you need under "For the hub").
   Until the menu is merged, try your tab with a tiny stand-in of that interface on a small page of your own
   (game/pages/maps.html: just the maps, a few MB, for fast checks).
4. A check, tools/maps-test.py: each map opens and closes and leaves nothing behind (the renderer's own counts of
   geometries and textures come back to where they were); the pin is in the right place for each zone's start;
   choose() answers with the landing tapped, and null when backed out of; a landing that is not open cannot be
   chosen; the star map makes no request to the network; every button is 44 px or more at 412 by 880; 0 page
   errors. At the end, on the zone-1 page as well.
5. Pictures of each view at both sizes, in a folder you name in your report.
```

### `flight` (given to a sub-agent of the hub's, November 23, 19:15, under the text above with its name put in)

```
JOB: flight. The flight between zones, in Skies of Aethermoor; and the Grey Hat's real ship.

WHAT CHRIS SAID
November 23: the 3D map "is to look at and for choosing where to fly using the airship game and ships as the
gates like in Envoi." November 16 (the old Envoi's moon-faire-witches/world-map/README.md, read it): "the flight
in Skies of Aethermoor on the night map, with as many raiders as the flight is long. You fly Skies' four ships;
upgrading to the next ship is part of each gate between zones." Which ship he flies first is still his call
(docs/questions.md): make it one line of data.

THE SOURCE
Skies of Aethermoor, the repo airship-game-in-aethermoor- (read-only; the hub's prompt says where it is on this
machine and how to read it). Read its README.md, docs/game.md, docs/ships.md and docs/map.md. It is written as
modules for three.js 0.186.1 and built with esbuild; the rest of this game runs three.js r128 (game/lib/).

WHAT TO BUILD
1. ONE FLIGHT, from one landing to another, as a piece the hub can call:
       W3D.flight.fly({ from, to, ship }) -> a promise of { arrived: true } or { arrived: false, why }
       window events while it runs: 'coven:flight-raiders' (raiders come) and 'coven:flight-clear' (seen off).
   The landings are in game/travel/landings.js (the hub's file: read it, don't change it).
   - It fills the screen, and when it ends it takes itself away wholly and frees what it held.
   - Build it from Skies' own code. Copy in only what a flight needs (flying, the controls, the map under the
     ship, the ship builder and the ships' measurements, and the raiders, guns and damage if raiders are in). Not
     the port, the shop, the title or its saving.
   - Because the two three.js versions differ, the simple safe way is a frame of its own inside the one file:
     bundle the flight with esbuild (Node is here and npm works) into one piece of text, keep the sources, your
     build tool and the built text all in the repo (so python3 tools/build.py needs no Node), and have the game's
     page start it in a frame and talk to it by messages. If tools/build.py must learn something for this, it is
     the hub's file: do it in a tool of your own and write the exact change under "For the hub".
   - The route: start over the from-landing, a plain marker showing the way, arrive when the ship is near the
     to-landing. A flight should take about two minutes (data). "As many raiders as the flight is long" (data);
     the first flight should be gentle. If the ship goes down the crew get her home: the promise answers
     { arrived: false } and the hub decides what happens next.
   - "On the night map": Skies flies over Chris's day map in nine tiles. See whether a night map exists (the old
     Envoi keeps day and night atlases under reference/art/world-map/); if it does and fits, use it; if not, say
     what you did instead to make it night.
   - The two events: the story has recorded lines for the flight into each zone (the moments "flight" and
     "flight-after" in game/talk/zone-2.js and zone-3.js). You do not play them: you only raise the two events at
     the right times, and the hub's story engine speaks.
   - A small page of your own, game/pages/flight.html, for trying it and for fast checks.
2. THE REAL SHIP AT A LANDING, if step 1 is done and sound. A plain stand-in ship lies at zone 1's jetty now
   (game/places/jetty-ship.js, the hub's; read its top). The real one should take its place: one of Skies' ships,
   moored, drawn by the land's own engine under its own night (three.js r128, the place engine's materials). The
   likely way is to bake the built ship once into plain data (its shape and its painted pieces) with a tool, and
   draw that. Do not change jetty-ship.js: make the real ship a file that can stand in its place, tell the hub how
   to switch, and keep what the lamps need: W3D_PLACES.jetty.ship = { hooks: twelve spots, six a side, where a
   lamp hangs; at; length; beam }. If this cannot be done well in the time, say so and stop at step 1.
3. A check, tools/flight-test.py: fly() answers arrived when the ship reaches the landing (drive it through a test
   handle of your own, not by hand); it answers not arrived when the ship is lost; the two events come; after it
   ends nothing of it is left on the page; no request goes to the network; the controls are 44 px or more at 412
   by 880; 0 page errors.
4. Pictures at both sizes of the flight's start, middle (with raiders) and arrival, in a folder you name.
You do NOT join the flight to the zones (the ship as a gate, the map to choose on, opening the next zone's page):
the hub does that once your piece, the maps job's and the menu job's are in.
```

### `fights`: one more thing for step 4 (NOT NEEDED NOW: Chris said yes on November 23, 19:40, and the hub made the change in `main`. The fights conversation only has to merge `main` and keep the new spot)

```
One more thing for step 4, from the hub (November 23). Chris has said yes to this.

The great wraith's spot in zone 1 should be in the fen's dark heart, not on the road out of Bogmire. Two recorded
lines say so. Old Wenna: "It sits in the fen's dark heart. Up the north road, where the boardwalk ends." The
narrator, when the coven comes near: "The fen's dark heart. The boardwalk ends here."

In game/encounters/zone-1.js, gate.at is [1348, 2180] now: the road 20 m out of Bogmire's north gate. The middle of
the heart's square, before the drowned hall's steps, is [1506.7, 1818.7] (the place bogmire-heart, its painting's
pixel 768, 420; the old Envoi's great wraith sat at the top of those steps). Move it there, keep r and the rest, and
check that the button still shows at level 5 and that no wild meeting comes inside the heart's own ground.

Nothing of the hub's has to change: the story's moments and the moth read the spot from window.__fights.gate.at.
git fetch and merge origin/main first: main has zone 1's small things now (a stand-in ship at the jetty, Old
Bridie's lantern, the moth, game/people/things.js on zone 1's page).
```

### `story`: the hub's note about a narrator (NOT NEEDED FOR THE NARRATION NOW: Chris had the hub write it, November 23, 10:15. Still useful for its questions 2 to 5: whether the party speaks too much, the short calls at arm's length, a shout from far off)

```
A note for the story job, from the hub (November 23). Chris has now heard zone 1 in the game.

First: git fetch, and merge origin/main into job/story. Your work is all in main. The hub's side is in
game/people/ (people.js, story.js, zone-1.js): read story.js's top comment for how your lines are chosen.

WHAT CHRIS SAID (his words, shortened)
- The opening did not make sense to him. When the game opens "you hear the whole party say something" and townsfolk
  too, and it is not clear what is happening or where she is when the talking happens.
- "Maybe we should make a narration voice for narrative points that happen in specific situations."
- "I think the party should be speaking maybe less than they are. I don't know. Maybe not less."
- A person should speak only when the coven walks right up to them, to arm's length. The first time, they speak by
  themselves and the words show; then the player taps to carry on a longer talk.
- No spoken word from anyone at a distance, unless the story wants someone shouting from far off, "and that would be
  a different circumstance".

WHAT THE HUB HAS ALREADY CHANGED IN THE GAME
- Nobody speaks from a distance. Walking right up to a person (1.5 m) the first time starts their first talk. The Talk
  button is for more. Your `call` lines are now said when the coven walks right up to someone already met.
- A start screen with one button. Nothing speaks before it is tapped.
- The talk box can show narration: a line whose `who` is `narrator` (or whose `kind` is `narration`) is shown with no
  name, set apart. Before the coven speaks at a set moment the hub now shows a stand-in line of narration, in words
  only, with no voice (game/people/zone-1.js, PEOPLE_NARRATION_STANDIN). They are stand-ins: replace them.

WHAT IS ASKED OF YOU
1. A narrator. A speaker `narrator` in cast.js with a voice note for casting (Chris chooses the voice). Then narration
   lines, `kind: 'narration'`, `who: 'narrator'`, ids like z1.narrator.01, as the first line of each set moment's talk
   (so `talk: ['z1.opening', 0]` comes before the coven's lines), for every moment in zones 1 to 4. One line, two at
   most, each one breath. It sets the scene: where the coven is, what has just happened, what is in front of them.
   It never explains the story or says what anyone feels. If you think some moments are better with no narration,
   say which and why.
2. The opening above all. With the narrator setting the scene, say whether the coven's six lines there still earn
   their place, or should be fewer. Chris was unsure. Propose, with your reason; he decides.
3. The party's other moments: the same question, moment by moment. Propose cuts if any; change nothing that is
   recorded without his yes.
4. Your calls, now said at arm's length to someone already met: read them again in that light. Mark any that no
   longer read right ("Don't brush my glass going by" still works; a line shouted across the camp would not).
5. A shout from far off: if the story truly wants one anywhere in the four zones, propose it as `kind: 'shout'`, with
   where the speaker stands and how far the coven is. If it wants none, say so.
6. The recording order for the new lines only (the narrator's, and any changed line), in the same form as before, so
   Chris can hand it over.

As before: show Chris the proposal first (one page he can open), and write nothing into the recorded set until he
says yes.
```

### `story` (paste this into a new conversation, with `docs/lore/story-brief.md` pasted under it)

```
You are a job conversation for Coven of the Moon Faire. Your job is `story`: the story's dialogue, written to be
spoken aloud. Every person in the game will have a voice (ElevenLabs), so every line you write will be recorded.

SETTING UP
Add the repo chriskizer91-ops/coven-of-the-moon-faire with push access. Add chriskizer91-ops/envoi-on-the-longest-night
and chriskizer91-ops/moon-faire as read-only sources: their main branch only, never push to them, and read them the
light way CLAUDE.md shows (no full download). Read CLAUDE.md, docs/BOARD.md, the top of docs/decisions.md,
docs/lore/README.md and docs/lore/story-brief.md. The brief is also pasted whole below, so you have it at once.
Then read the sources the brief lists in its section 8.

Work on your own branch job/story, made from main. You are the lore job. Under docs/ you may write only
docs/slips/story.md (read docs/slips/README.md for what a slip holds) and your own files in docs/lore/ whose names
begin "story-" (not story-brief.md: that is the hub's). Each of your lore files says at its top that it is a
proposal. Your game files are game/talk/ and tools/talk-*. Nothing else. The repo is public: no keys, and nothing
private about Chris or his family (the old notes mark where such lines were left out; leave them out).

WHO YOU ARE WRITING FOR
Chris made this world: the map of Aethermoor, the four witches, the Moon Faire. He is not a programmer. Write to him
in plain words and short sentences, and end every step with something he can open (one HTML file). Lore is not final
until he says so. The brief marks what is his settled word and what is the hub's proposal. Do not settle one of his
calls by writing it into lines: section 7 of the brief lists them.

WHAT TO MAKE, IN THREE STEPS. STOP AFTER STEP 1 AND WAIT FOR CHRIS.

Step 1: the story page and a sample, for his yes.
- docs/lore/story-page.md: one page. The story in ten lines (start from the brief's; make it better where you can and
  say what you changed and why). Each witch's thread. The calls that are his, each with your pick. The fair folk's
  names from the brief, so he can change any before it is recorded. Anything in the two old games' lore that fights
  with this, and your way through it.
- A sample of about 24 lines so he can hear the voice before the rest is written: the lamp-seller, the Grey Hat,
  Nettie, one ordinary person's full six, and a line or two from each witch.
- Send him both as one HTML page he can read on his phone. Then stop. He will say yes, or mark it up.

Step 2: all of zone 1's lines (about 236, as the brief's table has them), as data the game reads.
- game/talk/cast.js: every speaker: the id and the name shown from the brief's tables, where they stand, and a voice
  note for casting (age, sex, where they sound like they are from, pitch, pace, texture, and one line to audition
  with).
- game/talk/zone-1.js: every line: an id that will also be its sound file's name (for example z1.captain.03); who
  says it; the words shown on the screen; a plain note of the tone and inflection to say it in ("dry, fond, half
  to herself"); the same words with any delivery cues in square brackets, in a field of their own; when it can be
  said (the stage, first talk or later, lamps home; for the four people with many lines
  also the few extra things the brief allows); what kind of line it is (hello, stage, pointer, call, story, coven);
  for a story talk, the order of its lines; and about how many seconds it takes to say.
- For each person, a short list of every fact you invented about their own life, so Chris can see it.
- tools/talk-check.py: counts the lines for each person against the brief's table; no line over 24 words; the minutes
  of speech in all and for each person; no banned word; no name Chris has not approved; every person has something
  to say at every stage; every id used once.
- A reading page, one HTML file: every line by person and by stage, with the seconds and the totals.
- The recording order, as one file Chris can hand over whole. Chris gives the lines to ChatGPT, which uses
  ElevenLabs to record them and hands back zip files labelled for the game. So the order must stand on its own, for
  a reader who knows nothing of this game:
  - first, how to name and pack: one sound file for each line, named by the line's id (z1.odile.03.mp3); MP3, one
    channel; no more than a fifth of a second of silence at either end; the same loudness throughout; one zip for
    each speaker, named for the zone and the speaker (z1-odile.zip), each with a small list inside of every file and
    its length in seconds;
  - then, for each speaker: the voice note for casting, so one voice is chosen and kept for all that speaker's lines;
  - then each of that speaker's lines: the file name, the words to say exactly, and the tone and inflection.
  Make it in a form that is easy to hand over and to check against (a plain text or CSV file, as well as on the
  reading page).
- Tell Chris. He tells the hub.

Step 3: his notes worked in. Then the cast and the beats for zones 2 to 4 (Dawnroost and the Warm Roads; the northern
wilds and the shipyard; the frozen pass, Misthollow and the dead Moonwell) as an outline only: who speaks, how many
lines, what each is for. Their lines are written when the hub asks, zone by zone.

WHAT THE DIALOGUE SHOULD BE
This is the part that matters most.
- Written for the ear. Say every line aloud before you keep it. Short words. The strongest word last. Numbers as
  words. Nothing that needs its punctuation to be understood. No dashes, semicolons or trailing dots.
- One breath: about 12 words, never more than 24. One new thing in a line, never two.
- Every voice unmistakable with the name covered. Each person notices one kind of thing: the lamp-seller notices
  flames before faces, the dyer sees what holds its colour, the gate keeper counts. Let that do the work.
- The feeling under all of it: a fair at dusk on a land's last good nights, and a goodbye said kindly. Warm, dry,
  a little funny, a little sad. Never grim and never cute. Humour comes from the person, not from a pun.
- People talk about their own small thing and the big story shows through it. Nobody explains the plot. Nobody
  outside the coven knows what the fire is, or says its name. Each has a guess about the wisps, from their own
  trade, and holds it as a guess.
- The heart is Io, who holds on, and Kore, who lets go. Let the two of them disagree gently and often. Europa is
  quick and playful and sees threads. Callisto says little and sees first. The witches' lines are few: make each
  one earn its place.
- The first thing a person says must make the player want the second.
- Each of the four people with many lines (the lamp-seller, the Grey Hat, Nettie, Old Wenna) tells a small story of
  their own across the stages: a beginning, a turn and an end. They are who the story is told through, and every
  ordinary person has one line that sends the player toward one of them, by a place the player can find ("past the
  town, on the lake").
- Leave room for the voice: write the line that has the feeling under it, not the line that states the feeling.
- A lamp-and-candle world. No modern words. Never the words level, HP, MP, experience, quest, player, game, zone,
  or a spell's name. Say "the moon" unless a line truly needs "Auros".
- Names: the fair folk have names now (the brief, section 4). Use them where they add warmth, and otherwise speak
  of a person by trade. Invent no other name that is spoken.
- The same recording plays whichever witch the player walks as, and all four are always there. So "you" always
  means the coven. A witch may be spoken to by name.
- Invent nothing bigger than a person's own life. What the world is, is Chris's.
- The 480 lines in Moon Faire's lines.json and the old words in Envoi's script.js show the voice of each person.
  Learn from them. Reuse none of them.

You may use sub-agents to draft, but read every line yourself and make it one hand. ElevenLabs changes often: if you
need a detail of how it reads cues or what it can make, look it up in its own documentation, do not go from memory.

The hub is building the people into the camp and the talk itself while you write, to the shape in the brief's
section 5. If that shape gets in the way of a better line, say so in your slip early. Small calls are yours: write
each in your slip as a job's call. Push to job/story often.
```

### `fights`, step 3 (paste this into the fights conversation)

```
Step 3 for the fights job: fights on the land. Steps 1 and 2 are in main. Thank you: they are good.

First: git fetch, then merge origin/main into job/fights. Main has moved a long way. The hub joined the two asset
lists and dropped 7 doubled lines (the witches' light models were copied by both of us), so take main's
assets/INDEX.csv as it is. Then read docs/BOARD.md, the top of docs/decisions.md, and docs/slips/zone-1.md
("Rebuilt on November 18, night").

What is new on the land (game/pages/zone-1.html, built with python3 tools/build.py game/pages/zone-1.html):
- The land is Chris's map of Aethermoor at one third size, every place where the map has it. Zone 1 is 2.5 km by
  3.2 km: Wickhollow, the Moon Faire's camp (the game starts there), Io's cottage, the jetty, the Thornwood, Bogmire,
  the fen's dark heart, joined by roads, and a 2.6 km road toward zone 2.
- Any of the four witches walks (W.who, W.setWho(id)). There is a map in the corner.
- For you: W.pause(true) stops the land (no walking, no drawing) and W.pause(false) starts it again.
  W.io has her place (W.P.M.x(W.io.px), W.P.M.z(W.io.py) give metres east and south). W.P.land is the land:
  region() names where she stands; mapData().kind(x, z) says what a spot is (water, fen, thorn, open, pine, rim);
  rects are the places' own ground; mapData().flats is the camp; mapData().roads the roads; bag is the herbs she has
  picked (moonpetal and lavender, by count); W3D.landEvents.herb and .region are called when she picks one or
  crosses into a new region (the page sets them: wrap them, do not replace them).
- In game/pages/zone-1.html you may write only between the two pairs of marked lines: "fights job: its script tags"
  to "fights job: end", and "fights job: its start-up" to "fights job: end". Nothing else in that page.

Build, in this order, each ending with something Chris can open:

1. The party (game/party/): one object that holds the four witches' level, experience, HP and MP, the shards and the
   herbs; kept in the browser (localStorage, one key) so closing the page does not lose it; top level 20. Io's wild
   herbs from the land's bag are used in a fight beside the shop herbs (Chris's word). A way to start afresh.
2. Meetings in the wild (game/encounters/): as she walks the wild, a fight sometimes begins. Chris's word: the
   meetings are unseen (no foes walking the land), the fight is in the nearest arena, and zone 1 is band 1
   (levels 1 to 5), with the great wraith at Bogmire as the gate at level 5. About 180 fights carry the party from
   level 1 to 20 over the four zones, so about 45 belong to zone 1: set how often a meeting comes from that and from
   how far there is to walk, and say the numbers. No meeting in a town or place, in the camp, or just after one.
   Which foes, how strong, and how often, by where she is (woods, thorn country, fen, the long road): in a data
   file, easy to change. The gate fight needs a spot and a way to begin it: propose it, do not write story for it.
3. The join: when a meeting comes, the land pauses, CovenBattle.start() plays the fight over it, and the answer is
   carried back: experience and levels, each witch's HP and MP, herbs spent, shards. Won: she walks on. Fled: she
   walks on. Lost: your call (the hub suggests she wakes at the Moon Faire's camp, healed), marked as a call.
4. Rest: a way to heal at the Moon Faire's camp. Small and plain.
5. On the land's screen, as little as possible: Chris wants uncluttered phone screens. The party's level and health
   in one small place, large enough for a thumb if it can be tapped, nothing over the middle.

Check it with no screen: a check (tools/encounter-test.py) that forces a meeting, plays it, comes back, and shows
the party carried on, the land paused and started again, and no page errors; and numbers a person can check (how
many meetings in a kilometre of woods, how many fights to level 5). Say what could not be checked. Both pages must
still build, and tools/zone-test.py and your own battle checks must still pass. The zone-1 page will grow by about
the battle's size; say by how much.

Small calls are yours: write each in your slip as a job's call. Stop and ask Chris only for something that cannot
be undone or a big change to the story. The opening of the story (Envoi's first fight, Io alone on the bridge) is
not settled: leave the first fight out of the land for now. Push to job/fights often, and tell Chris when a step
is ready.
```

### `fights` (paste this into a new conversation)

```
You are a job conversation for Coven of the Moon Faire. Your job is `fights`.

Repo: chriskizer91-ops/coven-of-the-moon-faire (add it with push access). Read CLAUDE.md, docs/BOARD.md and
docs/decisions.md on main first, then docs/slips/first-test.md to see how a piece is copied in, built and checked.
Sources, read-only, on their main branch, never pushed to: chriskizer91-ops/envoi-on-the-longest-night and
chriskizer91-ops/moon-faire.

Work on your own branch job/fights, made from main. Write only your own slip, docs/slips/fights.md, under docs/.
The board has a table of which files are yours and which you must not change. If you need one of the hub's files
changed (tools/build.py, anything in game/engine/ or game/witches/io/), say so in your slip under "For the hub".

What to build, in two steps. Send Chris one HTML file at the end of each.

Step 1. The new Envoi's battle, running here. It is in the Envoi repo under moon-faire-witches/ (battle/battle.html,
src/battle/, src/kit.js, src/moon-jester.js, src/trance.js, witches/jester_lod.js and the files they load, plus
the first Envoi's models, arenas and effects in src/models/, src/stage/, src/fx/, art/arena/ that the battle uses).
Copy in only what the battle loads, each with a line in assets/INDEX.csv. Make game/pages/battle.html and build it
with `python3 tools/build.py game/pages/battle.html` into one file that fetches nothing from outside itself.
Io's files are already in game/witches/io/: use them, do not copy them again. Keep the 155 sounds and the six music
pieces. It passes when every fight the Envoi battle has can be started and played to its end here with no page
errors, and Envoi's own balance check gives the same result here as there (44 of 51 targets on Envoi's main).

Step 2. Four witches. Chris decided all four are in the party from the start. Fit Europa (the Fox) and Callisto
(the Ranger) to this battle the way Io and Kore were fitted: their light models are in the Moon Faire repo
(game/fight/witches/fox_lod.js, ranger_lod.js and their textures), and their moves and numbers are in Moon
Faire's approved engine (game/sim/blob-battle-engine.js). Then rebalance for a party of four with both checks:
Envoi's 51 targets and Moon Faire's eight pretend players (game/plan/testers/testers.js).

Also give the battle one call the land can make to start a fight and get the result back, shaped like Moon
Faire's: start({ arena, foes, partyLevel, foeLevel, party }) -> won, lost or fled, the experience, and each
witch's HP and MP after. Do not join it to the land yourself: the hub does that.

Chris's rules: plain words, pictures and simple numbers; say what you could not check (no session can measure a
frame rate or hear a sound); small calls are yours, written in your slip as "job's call"; stop and ask only for
something that cannot be undone or a big change to the story. Push to job/fights often. Tell Chris when a step is
ready, and he will tell the hub.
```
