# menu: the pause menu, three save slots, and the frame the maps sit in

Branch: job/menu      Last commit: (see git log)      Updated: 2026-11-23, evening

A sub-agent of the hub's built this, from the hub's brief of November 23, 19:15.

## What it built

- **One menu button on the land**, top right, where the numbers button was (46 by 46 px, three short lines).
  Escape opens and closes the menu on a laptop. The "who" and "nums" buttons are inside the menu now, so the land has
  one button where it had two (the hub's call, for Chris to overrule: `oneButton` in `game/menu/menu-data.js`).
- **Opening the menu pauses the game**: the land stops walking and drawing, the story waits, nobody's talk moves on, and
  any voice that is playing stops. Closing it carries on: the voice goes on from the word it stopped at.
  - **During a fight** the menu does not open. The fight lies over the whole screen, so the button cannot be pressed;
    Escape is left to the fight (its own menus use it); and `W3D.menu.open()` answers `false`.
  - **While someone is speaking**, the menu opens. Their words stay on the screen under the menu and their voice pauses.
    Talk (the button, E or Enter) does nothing while the menu is open. When it closes, the line carries on.
  - **On the Begin screen**, the menu opens over it, and closing it leaves the Begin screen as it was.
- **The menu is one full screen** with a row of tabs, **Save, Maps, Coven, Settings**, and a × to close.
  Other jobs add tabs with **`W3D.menu.addTab({ id, label, order, mount(el, ctx), unmount() })`**, exactly as the brief
  gives it; and `W3D.menu.open(tabId)`, `W3D.menu.close()`, `W3D.menu.isOpen()`, and the window events
  `coven:menu-open` and `coven:menu-close`. How it behaves, for the maps job:
  - `el` is the tab's own panel, filling the screen under the tab row. It is **the same element each time** the tab is
    shown, hidden while another tab is shown. What is in it is the tab's to keep or clear.
  - `ctx` is `{ W, zone, close() }` (and `ctx.page`, the page's file name). `zone` is `'zone-1'` and so on.
  - `mount` is called each time the tab is shown; `unmount` each time it is left **and** each time the menu closes.
  - A tab added with an id already there takes its place: **the maps job's tab must use the id `'maps'`**, and then
    the stand-in line goes. Orders: Save 10, Maps 20, Coven 30, Settings 40.
  - A tab whose `mount` throws shows one line saying so; the menu goes on working.
- **Three save slots** (`game/menu/saves.js`), a layer over the keys the game already keeps. party.js and story.js are
  not changed. How it works:
  - The game's keys in the browser are the game being played. A slot is a copy of all of them, with the time, the
    page it was made on, where the coven stands and who walks, and one line to read.
  - **The game saves itself** into the slot in use: when the page is ready, **every 20 seconds** (if anything changed),
    whenever the page is hidden or closed, and when the menu opens.
  - **Loading a slot** (Continue, New game) writes down which slot to load and opens the page again. On the way in,
    before anything of the game reads the browser, the slot's keys are put in place. So the party, the story and the
    walker start from the slot in their own way.
  - **Across pages**: every zone page with the menu uses the same keys in the same storage, and the slot in use is
    remembered (`coven.saves`). Each save says which page it was made on.
  - **Where she stands**: a save keeps where the coven stood, which way she faced, and who walked. The page puts her
    back there when it opens again, but only on the page the save was made on (job's call: `keepWhere`).
- **The Save tab**: three cards, one for each slot.
  - The slot being played says "playing now", and has **Carry on**, **New game** and **Copy**.
  - Another slot with a game in it has **Continue**, **New game**, **Copy** and **Delete**.
  - An empty slot has **New game**.
  - New game and Delete ask first, in a box with two big buttons ("Yes, ..." and "No"). Copy asks first only when the
    slot it goes into has a game in it.
  - Each card's line: **"Zone 1 · part 3 of 5 · level 4 · 6 lamps home"**, and under it "Saved 2 minutes ago".
  - **Save to a file** and **Load from a file**. The file is about 1 KB (957 bytes in the zone 1 check). Loading
    checks the file is one of ours before anything is touched: it must be JSON, say it is this game's save, and hold
    only the game's own keys, each one readable. Then it asks which slot to put it in.
  - Small lines at the foot: what the file is for; that the game saves itself; and "Saves are kept in this browser.
    First kept here 23 Nov, 19:26; this is visit 5." (see "For Chris", 4).
  - **A browser that keeps nothing** (some phones, for a page opened from a downloaded file): the tab says plainly
    "This browser is not keeping saves for this page. Before you close it, use Save to a file. Next time, open the page
    and use Load from a file." The game then runs on a stand-in for the storage kept in memory, so Save to a file has
    the whole game in it; and a save being loaded is carried into the page's next opening in its address (after
    `#coven=`), which is cleared once it is read.
- **The Begin screen**: under the Begin button, small, "Save 1 · Zone 1 · part 3 of 5 · level 4" (or "Save 1 · a new
  game"), and a **Saves** button (120 by 44 px) that opens the menu at the Save tab. Nothing more.
- **The Coven tab**: the four witches, each with her level, her HP and MP as numbers and bars, and who walks
  ("Walking now", or a "Walk as Kore" button: what the "who" button did). The party is only read, never changed.
  Under them, a dashed box kept for **a full character viewer later**: set `W3D.menu.viewer = (el, witch, ctx) => ...`
  and each witch gets a "Look closer" button that opens it in that box.
- **The Settings tab**: **The numbers** (on or off: what the "nums" button did), **Flipbook look** (on or off, and its
  fineness when on: the land's own setting, as the look's button had it), and **Fights drawn at** 3/4, Half or Full
  (only on a page with fights: zone 1). Each is one big button or a row of three.
- **`tools/menu-test.py`**, the check (below).
- **`game/pages/menu-lab.html`**, the job's own small page for quick checks: 0.1 MB, the zone pages' screen with a
  stand-in for the land and the real party.
- **The three zone pages** each have one block, marked `menu job: start` and `menu job: end`, just before the page's
  own script (so a waiting load is put in place before the game reads anything). It adds about 60 KB to each page.

Files: `game/menu/menu-data.js` (every key, and the job's calls), `game/menu/menu-words.js` (every word the menu
shows), `game/menu/saves.js` (the slots), `game/menu/menu.js` (the menu), `game/menu/menu.css` (its looks, in the
pages' own colours and letters).

## Every key the game keeps in the browser (found by searching `game/` for localStorage)

| Key | What it holds | In a save slot? |
|---|---|---|
| `coven.party` | the party: level, experience, each witch's HP and MP, sunstone shards, herbs, fights won, run from and lost, gates won (party.js, the fights job's; only zone 1 loads it so far) | yes |
| `coven.story.v1` | zone 1's story: its stage, the lines heard, who has been talked to, the moments played, small flags (story.js) | yes |
| `coven.story.z2.v1` | zone 2's story, the same, and how many road stones are lit | yes |
| `coven.story.z3.v1` | zone 3's story | yes |
| any other `coven.story.…` | zone 4's, when it comes (the slots take every key that starts so) | yes |
| `envoi3d-found` | the keepsakes found on the land (walker.js) | yes |
| `coven.where` | **new, this job's**: where the coven stands, which way she faces, who walks, on which page | yes |
| `envoi3d-look` | the Flipbook look on the land, and its fineness (walker.js) | no: the device's |
| `envoi.sharp` | how sharp a fight's 3D is drawn (battle/screen.js, battle.html) | no: the device's |
| `envoi.fps` | the fights' frame-rate cap (battle/screen.js) | no: the device's |
| `mfw.flipbook` | the Flipbook look in fights (battle/screen.js, battle.html) | no: the device's |
| `mfw.songBed.v2` | the volume of Chris's song under everything (battle/song-bed.js; no zone page loads it) | no: the device's |
| `coven.settings` | **new, this job's**: whether the numbers show | no: the device's |
| `coven.saves` | **new, this job's**: the slot in use, a load waiting for the next opening, when saves were first kept, visits | no |
| `coven.slot.1` to `.3` | **new, this job's**: the three slots | no |

## The job's calls (each is one line of data in `game/menu/menu-data.js` or one rule; Chris's to overrule)

1. **Settings stay with the device, not in a slot.** A save carried from the laptop to the phone does not bring the
   laptop's settings. The other choice: settings in every slot too (`slot: true` on their lines).
2. **A save keeps where she stood and who walked** (`keepWhere: true`). The other choice: she starts where the page
   starts, as before.
3. **The slot being played has no Delete**, and nothing can be copied onto it. "New game" does what deleting it would
   do. The other choice: allow both, each starting the page again.
4. **Save to a file saves the game being played.** The other choice: a file button on every slot (more buttons).
5. **New game always asks first**, even into an empty slot, since it leaves the game being played (saved first).
6. **How far the story is reads "part 3 of 5"**: the zone's stage, counted from 1. The story's own stage names are
   ids, not words for a player, so none is shown. Lamps home are shown for zone 1 only (by zone 2 all twelve are
   home), and not while none is.
7. **No sound volume.** There is no one place to set it: the voices are played by people.js at full loudness, the
   fights by sound.js (which has its own Music and Effects levels), and the song's knob (song-bed.js) is not on the
   zone pages. The menu's pause reaches every voice and every Web Audio sound, so a volume for the voices could be
   added the same way; that is the hub's to decide.
8. **The Flipbook switch is the land's** (`envoi3d-look`), as the look's own button was. The fights keep theirs
   (`mfw.flipbook`).
9. **The fights' sharpness row shows only where there are fights** (zone 1 today).
10. **Choosing who walks keeps the menu open**, with "Walking now" on her card. The old panel closed itself.
11. **The menu is nearly opaque** (97%), so its words read clearly over any part of the land.

## What was found on the way

- **The "who" button could not be pressed in the real game.** The walker makes the look's own settings button
  (`#lookbtn`, walker.js) at exactly the same spot as "who" (both 68 px from the right), and adds it later, so it lay
  on top. With `?test` the walker does not make it, so the checks never saw this. Now all three are in the menu, and
  the land shows one button.
- **party.js writes `coven.party` as the page opens, even with `?test`** (the fights job's; it always has). Everything
  else waits for a player. The menu's check therefore takes the storage as it stands once the page has started, and
  checks nothing changes after.

## What Chris said here

- Nothing: this job's brief came from the hub. His words it was built from (November 23): "I think we need to work on
  the save menu." "I think three save slots if we can." The star map and the 3D map of Aethermoor inside the menu.

## What was copied in

- Nothing. Everything is new, made here.

## What was checked, and how

`python3 tools/menu-test.py builds/zone-1.html --shots <folder>` (about 8 minutes on zone 1; 1 minute on the small
page). It opens the page three ways:

- **A. As the checks open it (`?test`).** One button on the land; the menu opens on it and the land is paused; the
  tabs are Save, Maps, Coven, Settings in that order; Escape and the × close it and the land carries on; the two
  events are sent. **The frame for other tabs:** a tab of order 25 sits between Maps and Coven; `open('probe')` opens
  at it; its panel fills the screen under the tab row; `mount` gets `ctx.W`, `ctx.zone` and `ctx.close`; `unmount` is
  called on leaving the tab and on closing; the panel is the same each time; a tab with the id `maps` takes the place
  of the stand-in. **The slots by their buttons**, in memory: a new game in slot 2, slot 1 continued, slot 1 copied to
  3, slots 3 and 2 deleted. Settings and Coven do what "nums" and "who" did. **Every button is 44 px or more and none
  is off the screen** at 1280×720, 412×880 and 880×412 (the smallest is 46×46 px), on every tab and in the question
  box. **`?test` saves nothing**: the browser's storage is exactly as it was.
- **B. As a player would** (no `?test`, a fresh browser profile). The Begin screen's line and Saves button. **The
  game's clock**: the land drew 2 frames in 3 s before (the machine draws slowly with no graphics card), **0 in 3 s
  with the menu open**, 3 in 3 s after. A playing voice stops when the menu opens and carries on when it closes. **It
  saves itself**: 10 s after a change on its 20 s timer, and when the page is hidden, and when closed. **Save to a
  file**: 957 bytes, the same 3 keys as slot 1. **New game in slot 2**: the page opens again (8 s) with a new story
  and a whole party at level 1; slot 1 untouched. **Continue slot 1**: the page opens again and every key of the game
  comes back exactly as saved, and she stands where she was saved. Copy, two deletes. **Three wrong files refused**
  (a text file, another game's file, and our own file with one key added that is not the game's) and nothing changed.
  The file back into slot 2: the same keys. 0 page errors.
- **C. With the browser's storage blocked** (a stand-in for those phones). The Save tab says so plainly; Save to a
  file holds the whole game; Load from a file opens the page again with the file's game. 0 page errors.
- **Results:** zone 1 ALL PASSED; the small page ALL PASSED. (The other zones and the old checks: below.)

## What was NOT checked

- **A real phone.** Whether Chris's phone keeps storage for a page opened from a downloaded file is not known here;
  only a browser with its storage blocked was tried. The "visit N" line on the Save tab will tell: if it says "visit
  1" every time the page is opened, the phone is not keeping saves, and Save to a file is the way.
- **Hearing.** The check sees a voice's "paused" flag change; it cannot hear that the sound stops.
- **Motion and frame rates.** A browser with no screen cannot show them. The check counts the land's frames instead.
- **Real taps.** The check clicks; on a phone the same buttons are tapped. They are ordinary buttons, 46 px or more.
- **Downloads on a phone.** Save to a file was checked in a desktop browser. Phones save a downloaded file in their
  own way (Chrome on Android to Downloads).
- **The maps job's real tab**: not in yet. A stand-in tab was added and taken out by the check.
- **Two copies of the game open at once** in one browser: both would save into the same slot.

## What is rough

- The first time a witch is chosen to walk, her model is built, which takes a moment ("…" on her button).
- In zones 2 and 3 the Coven tab shows "Whole" rather than HP numbers, because the battle's rules are not loaded on
  those pages; the level is the one kept from zone 1. When the fights job joins those zones, the numbers come by
  themselves.
- "Saved 5 minutes ago" means nothing has changed in five minutes; a save is only written when something has.
- Times are the device's own clock.

## For the hub

1. **`game/README.md`**: one line in its folder table: `menu/` | the pause menu, the three save slots and the tab
   frame (the menu job's).
2. **When the pages call each other**: `W3D.saves.openPage = (page, carry) => ...` is called (when set) in place of
   opening the same page again, when the slot to be played was last saved on another zone's page. `carry` is `''`,
   or on a page with no storage `'coven=...'`, to be put after a `#` on the next page's address. Until then, a slot
   saved on zone 2's page is loaded on whichever page Continue is pressed, with that page's start.
3. **A new game** starts on the page it is pressed on. When there is a title or the pages call each other, it should
   go to zone 1's page: the same hook (`openPage`) is the place, or a word from the hub to change `fresh()`.
4. **Zone 4's page**: copy the marked block with `zone-4.html` and `zone-4`.
5. **The maps job's script** must load after the menu's block if it calls `W3D.menu.addTab` as it loads (the menu's
   block is just before the page's own script; any later place is fine), or call it once the page is ready.
6. **`tools/menu-test.py`** can join the list of checks the hub runs.
7. **For the fights job** (the hub to pass on, if wanted): party.js saves `coven.party` as the page opens even with
   `?test`.
8. **The board**: the job's state.

## For Chris

1. **One button on the land** in place of two (the hub's call). If he wants the old ones back beside it: `oneButton:
   false` in `game/menu/menu-data.js`.
2. **Settings stay with each device**, not in the save (the job's call).
3. **A save puts the coven back where she stood** when the page opens again (the job's call).
4. **On his phone:** open the zone page from the downloaded file, then the menu's Save tab. If the line at the foot
   says "this is visit 1" every time, the phone is not keeping saves for that page: use Save to a file. If the tab
   shows the orange box, it keeps nothing at all.
5. **The words**: every word the menu shows is in `game/menu/menu-words.js` ("playing now", "part 3 of 5", "Carry
   on", and so on). The character viewer's line is a stand-in.
