# flight: the flight between zones, and the Grey Hat's real ship

Branch: job/flight      Built by: a sub-agent of the hub's (Fable 5.2)      Updated: November 24, 2026, 06:10 (by the hub: the Fire button aims)

**State: both parts built, checked and pushed.** Part 1 is one flight between two landings, as a piece a page can
call. Part 2 is the Grey Hat's real ship, the Skiff, moored at zone 1's jetty. Neither is joined to the zone pages:
that is the hub's part. Nothing has been flown on a real laptop or phone yet.

## November 24, 2026: a thumb held on Fire slides to aim (the hub, on Chris's word)

**Chris, after trying `flight.html` on his phone:** "it does not work the same as the airship game originally did.
When you're firing, you should be able to control where you're firing from while holding down fire. So the fire
button is also a joystick. So you can fire and aim at the same time, and then the other joystick is the steering
the ship."

**Why it was so.** The flight was made from the oldest version of Skies of Aethermoor, the one in that repo's main
folders (commit `1887984`). In that version the Fire button only fires. Chris's later versions of the game (the
folders `polished/`, `stage4/` and `stage5/`, kept on other branches of that repo) changed it: a thumb held on Fire
can slide off it to aim while the guns keep firing. He plays those, so that is what he expected.

**What was changed** (all marked "Coven", November 24):

- `game/flight/src/game/input.js`: a thumb held on Fire slides to aim, and the guns keep firing; while a thumb
  rests on Fire or on the sky the view stays where it was put; a finger lifted anywhere on the screen is let go of.
  It is written to behave as the later versions do. No file was copied from them.
- `game/flight/flight-data.js`: the phone's hint now reads "Left thumb steers · hold Fire and slide to aim · drag
  the sky to look round".
- `game/flight/src/coven-flight.js`: the test handle also says where the view is turned and whether the guns are
  firing, so the check can see it.
- `game/flight/flight-frame.js`: packed again (`node tools/flight-build.mjs`), 2.85 MB as before.
- `tools/flight-test.py`: eight new checks, four at each phone size. **64 checks, all good, 0 page errors.**
  A thumb held on Fire and slid 90 px left and 40 px up turns the view 35 degrees and tips it 15, still firing;
  held still for 4 seconds the view stays and the guns go on; lifted, the guns stop; a thumb dragged 60 px on the
  sky turns the view 23 degrees without firing.
- The phone still has four things to press, the smallest 46 by 46 px, and nothing over the middle of the picture.

**Not checked:** how it feels under a real thumb. The check sends made-up touches; only Chris's phone can say.

**For the hub and for Chris: the flight is built on the oldest Skies of Aethermoor.** The newest is `stage5/` (the
shipwright's pass, November 14 and 15: better-looking ships with a crew, and a picture that keeps its pace on a slow
phone), on the branch `claude/keen-thompson-qm6iz2`, commit `289e47c`. Its `src/` has 53 files to the oldest's 25.
Other things Chris knows from the game he plays may be missing here for the same reason. Making the flight again
from stage 5 is his call.

**A true fact about the record:** that repo has no branch named `main`. The twelve lines in `assets/INDEX.csv` say
`main`; the commit they name, `1887984`, is right, and it is the head of the repo's default branch,
`claude/ship-game-magpie-l8cbdn`.

## What it built

### Part 1: one flight

- **The piece:** `W3D.flight.fly({ from, to, ship })`, in `game/flight/flight.js`. It gives back a promise that
  answers `{ arrived: true }` or `{ arrived: false, why }`. The top of that file says everything it does.
- **What a flight is.** It is Chris's airship game, Skies of Aethermoor, cut down to a single flight. The ship starts
  680 m up over the landing she leaves, with her bow to the landing she is bound for and her sails set. A tall
  pale-gold light stands on that landing, with a small tag showing how far it is. A quarter of the way along, raiders
  come. When she is within 320 m of the landing the crew bring her down and the flight is over.
- **It is Skies' own code.** How a ship flies, the controls, the guns, the damage, the raiders, the smoke, the ship
  builder and the six ships' measurements are copied in and used as they are. The port, the shop, the title, the
  shards, the waves and the saving are left out.
- **It runs in a frame of its own.** Skies draws with three.js 0.186.1 and the game with r128. So the flight is packed
  into one piece of text, `game/flight/flight-frame.js` (2.85 MB), and `flight.js` puts that text in a frame that
  fills the screen. The two talk by messages. When the flight ends the frame is taken away and everything it held
  goes with it.
- **The night map.** Chris: "Flights use the night map." A night map exists and fits: the old Envoi's nine night
  tiles are the same size and order as Skies' day tiles. So the ground under the ship is his night map, with its lit
  windows. The sky, the moon (high in the north-west, as on the 3D map), the clouds and the haze are made night in
  Skies' own `world.js`.
- **The two events.** `coven:flight-raiders` is raised on `window` when the raiders come, and `coven:flight-clear`
  when they are seen off. The piece plays no lines. Two more events, `coven:flight-start` and `coven:flight-end`, are
  there for anything that should rest while a flight is on.
- **Every number and every word is data:** `game/flight/flight-data.js`. No word the player reads is in code.
- **A page to try it:** `game/pages/flight.html` (2.9 MB built). Four buttons, one for each flight, and a list to
  pick the ship. When a flight ends it says how it went.

### Part 2: the real ship at the jetty

- **She is the Skiff,** the first of Skies' four ships: 8 m long, 2.66 m in the beam, one mast with a pair of wing
  sails, three sunstone crystals amidships.
- **How she gets there.** `tools/flight-bake-ship.mjs` runs Skies' ship builder once and writes down what it made, as
  plain data: `game/flight/moored/skiff.js` (731 KB, 29,518 triangles in 12 materials). The ship you fly has about
  100,000 triangles; the moored one is baked plainer (no rivets, rounder things made of fewer flats).
- **How she is drawn.** `game/flight/moored/moored-ship.js` draws the baked ship with the place engine, three.js r128,
  under the jetty's own night: the same moon, sky, fog and lamp light as the pier's planks. She wears her own painted
  pieces (planks, deck boards, brass band, the parts sheet).
- **Where she lies.** `game/places/jetty-ship-real.js` takes the place of `game/places/jetty-ship.js`. She lies where
  the stand-in lay: across the end of the pier, 1.6 m off it, bow to the west. A gangway runs from the pier's end up
  to her rail, and two lines go to the bollards.
- **What the lamps need is kept:** `W3D_PLACES.jetty.ship = { hooks, at, length, beam }`, twelve hook spots, six a
  side.
- **How the twelve hooks sit on the Skiff.** She is small, so they stand close. There is an iron post on her rail
  about every 0.8 m, six a side, from just forward of her wheel to her bow. Each post is 0.95 m tall with an arm
  0.34 m out over the water, and the lamp hangs under the arm. No two lamps hang nearer than 0.75 m, the lowest hangs 2.0 m
  above the lake, and none is nearer than 1.0 m to her sails. The order is the stand-in's: from the gangway outward, the pier's side first.
- **She carries no lanterns of her own.** Skies' Skiff has four. They are left out of the baked ship, because the
  lines say the Grey Hat's lamps are gone until they come home. Her crystals glow, low.
- **A page to look at her:** `game/pages/moored-ship.html` (27 MB built): the jetty alone. A button hangs lamps on her
  hooks, three more at each press.

## A few numbers

| Flight | How far | Ship | Raiders | Flown straight, never firing | With a fight |
|---|---|---|---|---|---|
| Wickhollow to The Warm Roads | 3.4 km | Skiff | 1 Skiff, Calm skies | 83 s | about 85 s |
| The Warm Roads to The northern wilds | 5.0 km | Cutter | a Cutter and a Skiff, Fair Winds | 106 s | about 145 s |
| The northern wilds to The northeast peaks | 8.4 km | Brig | a Brig, a Cutter and a Skiff, Fair Winds | 144 s | about 175 s |
| back from The northeast peaks | 8.4 km | Frigate | the same three | 133 s | about 160 s |

- The two long flights are hurried 1.6 times (the data's limit), to stay near two minutes. The others fly at the
  ship's own speed.
- **How hard it is.** Each flight was flown 8 times as it would really go, on the game's own clock, by two simulated
  captains: one who only steers for the landing, and one who turns on the raiders and fires. Both arrived 8 times in
  8 on every flight, with the hull whole at the landing. (The crew patch her up once the raiders are gone, as in
  Skies, so that does not say how much she took on the way.) `python3 tools/flight-test.py builds/flight.html --sim 8`
  prints it. These are simulated captains, not people.
- **It was harder at first, and that is why two things were added.** With Skies' own Fair Winds and raiders that never
  give up, the captain who only steers lost the Skiff on the first flight 1 time in 5; and the Brig against three
  raiders under Crosswinds was lost 2 times in 5 by either captain. So the first flight has calmer skies, the last has
  Fair Winds, and raiders give up after a minute. All three are single lines of data.
- The frame's text is 2.85 MB: 1.8 MB is the night map, 0.4 MB the corner map and the ships' painted pieces, and
  0.7 MB the code, three.js included.
- The flight draws about 100,000 triangles in 27 draw calls with no raiders, and about 102,000 in 40 with one.
- The moored ship adds 29,518 triangles and 12 draw calls to the jetty. Zone 1's page with her in it and the flight's
  four files added came to 104.0 MB (it is 100.3 MB now).

## What Chris said here

- Nothing was said in this conversation. One decision came through the hub while the job ran:
- **Chris, November 23, 19:40:** "the four ships you get in the airship game are the four ships you get as travel
  upgrades." It is in `flight-data.js` as one small table, `shipFrom`: the ship is set by the landing a flight
  leaves. Wickhollow: Skiff. The Warm Roads: Cutter. The northern wilds: Brig. The northeast peaks: Frigate.
  **The mapping of ship to gate, and what the Frigate is for (whatever flight comes after zone 4), are the hub's
  reading of his words, not his own words.** `fly()` uses the table when no ship is named. All four fly: the check
  flies each.
- So the moored ship at zone 1's jetty is the Skiff.

## What was copied in

Every line is in `assets/INDEX.csv`.

From `airship-game-in-aethermoor-` (main, 1887984):

- `src/ship/` whole and `src/ships/` whole, to `game/flight/src/`. Not changed.
- `src/game/flight.js`, `guns.js`, `damage.js`, `effects.js`. Not changed.
- `src/game/world.js`. **Changed, 10 places marked "Coven":** the night tiles in place of the day tiles; the moon in
  place of the sun; the sky's colours, with stars; the haze; the sea's colour past the map's edges; the cloud deck and
  the big clouds by moonlight; fainter cloud shadows; the region names left out.
- `src/game/input.js`. **Changed, 3 places marked "Coven":** a button that is not on the screen is passed over (the
  phone screen has no Sail buttons), twice; one line of words now comes from the data file.
- `src/game/raiders.js`. **Changed, 1 place marked "Coven":** the six classes are not all built at the start, only
  the ones a flight meets.
- `assets/ships/` whole (the ships' painted pieces), to `game/flight/assets/ships/`.
- `game/flight/src/coven-flight.js` is made here from Skies' `src/game/main.js`: its camera, aiming, shots landing,
  raider tags and read-outs are Skies' own. `game/flight/frame.html` is made here from its `demos/game.html`.
- Not copied: the port, the title, the shop, the shards, the saving, the two game fonts, the day map.

From `envoi-on-the-longest-night` (main, d450c3f):

- `reference/art/world-map/night/`: the nine night tiles and the whole night map, packed by
  `tools/flight-night-map.py` into `game/flight/assets/map/` (nine AVIF tiles, 1.36 MB, and a small corner map).

## What was checked, and how

- **`python3 tools/flight-test.py builds/flight.html`: 56 checks, all good, 0 page errors.** It opens the page with
  `?test` and with the network switched off, and flies through the piece's own test handle. It checks:
  - a flight starts over the landing it leaves and fills the screen;
  - flown to the landing, `fly()` answers arrived, and the events come in order: raiders, then clear, then the end;
  - raiders not seen off after 60 s give up, and that too raises the clear event;
  - with the ship lost, `fly()` answers not arrived, why: lost;
  - stopping it, a second flight while one is on, and a landing that is not there, each answer as they should;
  - after every ending nothing of it is left on the page (no frame, no layer, the same count of things as before);
  - left to run by itself it draws and flies, pausing holds it, and a key pressed on the page round it steers the
    ship and reaches nothing under the flight;
  - all four ships fly, and a ship named in the call overrules the table;
  - at 412 by 880 and at 880 by 412: four things to press, the smallest 46 by 46 px; nothing over the middle of the
    picture; a thumb on the left steers; the Fire button fires;
  - no request went to the network: 3 requests in all, each for the page's own file.
- **`python3 tools/flight-ship-test.py builds/moored-ship.html`: 14 checks, all good.** The twelve hooks, six a side, over the water and
  clear of the pier and the sails; she is the baked Skiff, lit by the jetty's own night; she cannot be walked onto.
- **The last check, on a scratch copy of zone 1's page** with the real ship switched in and the flight's four files
  added (the copy is not in the repo). The results are under "The last check" below.
- **Pictures,** taken with `tools/flight-look.py` and `tools/look.py`. They are not in the repo.
- **Not checked:**
  - **Nothing was flown or looked at on a real laptop or phone.** A browser with no screen cannot show motion or
    measure a frame rate. How it feels to steer, whether the phone holds its frame rate with a 100,000-triangle ship,
    and whether aiming by dragging is easy enough, only Chris can say. The flight shows its frame rate at the bottom
    left.
  - How long a flight takes to start on a phone. With no screen it took 3.4 s.
  - The mouse locked to the view (clicking the sky). It may not be allowed inside a frame on every browser. If it is
    not, dragging aims, as in Skies.
  - A phone's notch and rounded corners.
  - The flight has no sound. Skies has none.

## What is rough

- **The night map is painted at a slant,** with the sides of hills and houses showing. Laid flat under the ship it
  looks right from 680 m and wrong from low down. Skies' own day map is painted straight down. The ship cannot go
  below 60 m.
- **The night map's tiles do not quite meet.** A line shows where the left third joins the middle, most over the sea.
- **Landings sit where the old Envoi had them** on that map (the hub's `landings.js`), so the light stands over the
  painted place.
- **A raider who gives up** holds her fire and turns away. Skies' raiders never give up; this is the flight's own.
- **The moored ship stands still.** Her sails do not ripple and she does not sway. Her brass is a plain colour with a
  glint, not the mirror-bright brass of the flight.
- **The flight is not in the Flipbook look.** It is drawn in Skies' own look.
- **The words on the flight are plain working words** by this job, marked as proposals in the data file.

## Unfinished

- Not joined to the zones (the hub's part).
- Only the Skiff is baked for mooring. `node tools/flight-bake-ship.mjs cutter` bakes another, and
  `W3D.mooredShip(K, ship, { at, turn })` draws any of them in any place, but no other landing has a ship yet.
- No shards are paid for a raider brought down. The answer carries `downed`, the count, for when they are.

## For the hub

**To call a flight from a page,** add these four lines, in this order, anywhere before the page's own script:

```
<script src="../travel/landings.js"></script>
<script src="../flight/flight-data.js"></script>
<script src="../flight/flight-frame.js"></script>
<script src="../flight/flight.js"></script>
```

Then `const r = await W3D.flight.fly({ from: 'wickhollow', to: 'warmCamp' })`. `tools/build.py` needs no change: the
frame's text is already one file, with no web address in it. It adds 2.9 MB to a page.

1. **Rest the page under the flight.** The flight does not pause the page that called it. Best is to fly before the
   zone's world is built, so only one 3D picture is alive at a time. That matters most on a phone. If the world is
   already up, pause it until the promise answers.
2. **The story's moments.** `coven:flight-raiders` is the moment `flight`; `coven:flight-clear` is `flight-after`.
   The clear event always comes after the raiders event and before the flight ends. If the player flies straight on,
   it comes when the raiders give up (60 s after they came) or at the landing, whichever is first.
3. **The menu button.** The flight lies in front of the page (layer 60, one line of data), so it covers the game's
   menu button. It has a pause button of its own under the corner map. When the menu takes over: set
   `buttons.pause` to `false` in `flight-data.js`, raise the menu's layer above 60, and call `W3D.flight.pause(true)`
   and `W3D.flight.pause(false)`. `W3D.flight.stop()` ends a flight at once.
4. **When the ship is lost** the promise answers `{ arrived: false, why: 'lost' }` and the page is as it was. What
   happens next is yours. `why: 'turned-back'` means the player gave the flight up on the pause card.
5. **To switch zone 1 to the real ship,** in `game/pages/zone-1.html` replace the line
   `<script src="../places/jetty-ship.js"></script>` with:

   ```
   <script src="../flight/moored/skiff.js"></script>
   <script src="../flight/moored/moored-ship.js"></script>
   <script src="../places/jetty-ship-real.js"></script>
   ```

   Nothing else changes: `game/people/zone-1.js` reads the same `W3D_PLACES.jetty.ship.hooks`. It adds about 0.9 MB.
6. **`tools/things-test.py` needs one line changed** after that switch. Line 78 checks
   `s['standIn'] is True, 'the ship is marked as a stand-in'`. The real ship sets `standIn: false` and
   `ship: 'skiff'`. Its other checks pass as they are (see "The last check"). The words "(a stand-in)" on its lines 5
   and 76 are then out of date too.
7. **`docs/questions.md`:** "which ship he flies first" is answered by Chris's word of 19:40. The board's "Waiting on
   Chris" item 3 can go.
8. **`game/README.md`** has no row for `game/flight/` or `game/travel/`. A row each would help the next reader.
9. **To rebuild the frame** after a change under `game/flight/src/`, `game/flight/assets/` or to
   `game/flight/frame.html`: `cd game/flight && npm install` once, then `node tools/flight-build.mjs`. It needs Node;
   the game's own build does not.
10. **Calls I made, each one line of data, for you or Chris to overrule:**
    - which raiders come on which flight, and under which skies (`raiders`);
    - a first flight under Calm skies, softer than any of Skies' three (`skies.calm`);
    - long flights hurried up to 1.6 times (`hurry.most`); the other choice is 1, and the longest flight takes 4 minutes;
    - raiders give up after 60 s (`raidersStay`); the other choice is never, as in Skies;
    - no wind (`wind`); full sail at the start (`sailAtStart`);
    - no Sail buttons on the phone (W and S still work on a laptop);
    - the player can turn back on the pause card (`buttons.turnBack`);
    - at the jetty the ship rides with her keel in the lake, like a boat at a pier (`RIDE` in `jetty-ship-real.js`);
      the other choice is hanging in the air;
    - with her bow to the west it is her starboard side that lies to the pier. The stand-in's note said port.

## For Chris

- **Fly it on the laptop and the phone,** and read the frame rate off the bottom left. That is the one thing no check
  here could do.
- **How hard should a flight be?** As built, a player who only steers always arrives. Is that too soft after the
  first flight?
- **Should long flights be hurried?** The last one is 8.4 km. At the Brig's own speed it is 4 minutes; hurried, 2 and
  a half.
- **May the player turn back** from a flight? And what happens when the ship goes down?
- **The ships' names** (Zephyr, Gale, Tradewind, Tempest) are Skies' own proposals. They are stand-ins here. Does the
  Grey Hat's ship have a name?
- **The words on the flight** ("Leaving Wickhollow", "Follow the light to The Warm Roads", "Raiders", "Seen off",
  "She is going down") are proposals.
- **Twelve lamps on an 8 m ship** stand close together. Is that the look he wants, or should the count change with
  the ship?
- **Should the moored ship float or hang in the air?** She floats now.
- **Should she show her own four lanterns?** They are left out, so that her hooks are bare until the lamps come home.

## The last check

Run once, at the end, on a scratch copy of `game/pages/zone-1.html` with the real ship switched in (item 5 above) and
the flight's four files added. The copy was deleted afterwards; it is not in the repo.

- **The hub's own `tools/things-test.py`: 36 of its 37 checks pass.** The one that fails is "the ship is marked as a
  stand-in", as it should (item 6 above). The lamps hang on her hooks at 0, 1, 4, 11 and 12 home; from the foot of
  the pier a lamp's glow is 0.66 of 0.75; she cannot be walked onto; the jetty's line is still said on the quay.
- **`tools/flight-ship-test.py` on the zone page:** the same answers as on the small page.
- **The flight called from inside the zone page:** ready 3.3 s after the call (with no screen), the frame on top of
  everything at the middle and at two corners of the screen, arrived after 83 s of flight with both events raised,
  and the page's count of things the same after as before (112). 0 page errors.
- Pictures of all of it are in the folders named in the report to the hub.
