# Coven of the Moon Faire: the board

Last updated: November 18, 2026, night, by the hub.

**Only the hub changes this board.** A job conversation writes only its own slip, `docs/slips/<name>.md`, on its own
branch `job/<name>`. The rules are in `CLAUDE.md`.

**A new hub picking up:** read `CLAUDE.md`, this board, `docs/decisions.md` (newest first), then the newest slip in
`docs/slips/`. Build the newest page (`game/README.md` says how) and open it before changing anything.

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
3. The fights joined on.
4. The people.
5. Zones 2 to 4.

One HTML file to Chris at each milestone.

## Where we are

**Milestone 1, the first test: done.** Chris ran it at his screens' top speed (144 frames a second on the laptop, 60 on
the phone).

**Milestone 2, zone 1: most of it built.** `builds/zone-1.html` (from `game/pages/zone-1.html`, 71 MB):

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

## What is being worked on now

| Who | What |
|---|---|
| Chris | Trying the rebuilt zone 1 on his laptop and phone; giving the `fights` conversation its step 3 (text below) |
| The `fights` conversation | Step 3: fights on the land (milestone 3) |
| The hub | The Flipbook stutter on the phone; then the people in the camp, and zone 2's land |

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

**A big story call, so the hub will ask before building on it:**

- The opening lore. He said some has to be made up: the game starts at the Moon Faire, all four are already together,
  and Io's cottage may be her family's. The hub will write a short proposal for him to mark up before any lines are
  written.

**Left open in the old games, still his when they come up** (none blocks zone 1):

- Sound Choices: his picks among the four versions of the ten most common battle sounds.
- The 17 fighting models on Everyone Who Fights: lock them in, or say what to change.
- Whether Halcyon gets moves of her own.
- Six textures that show a faint line where they repeat.
- Which Skies of Aethermoor ship he flies first.
- Four small answers on herbs.
- The Moon Faire brambles: he has not looked at them yet.
- The names of the three stars and the four other planets.
- His songs: where each plays.

## Jobs

| Job | What it does | Branch | Slip | State |
|---|---|---|---|---|
| `first-test` | The open land round Wickhollow, as one HTML file | `job/first-test` | `docs/slips/first-test.md` | **Done, in `main`.** Built by the hub. Sent to Chris |
| `zone-1` | All of zone 1 on one land | `job/zone-1` | `docs/slips/zone-1.md` | **Most of it done, in `main`.** Six places, the camp, four witches to walk as, the 3D map's hills and fen, the long road. The better map and the rough spots are left |
| `minimap` | A better map in the corner (a sub-agent of the hub's) | `job/minimap` | `docs/slips/minimap.md` | **Done, in `main`.** Its files were `game/engine/land/minimap.js` and the map's CSS in `game/pages/zone-1.html`; they are the hub's again now |
| `fights` | The battle here as its own page, grown to four witches; then fights on the land | `job/fights` | `docs/slips/fights.md` | **Steps 1 and 2 done and in `main`** (November 19): `game/pages/battle.html`, all four witches in every fight but the first, 49 of Envoi's 51 balance targets, `CovenBattle.start()` for the land. **Step 3 handed out:** fights on the land (text below) |

**Who owns which files, so two conversations never write the same one:**

| Job | Its own folders and files | Must not change |
|---|---|---|
| `zone-1` (the hub) | `game/engine/`, `game/places/`, `game/fair/`, `game/data/`, `game/pages/zone-1.html`, `game/pages/first-test.html`, `game/witches/`, `game/art/world/`, `tools/build.py`, `tools/look.py`, `tools/walk-test.py`, `tools/zone-test.py` | anything of `fights` |
| `fights` | `game/battle/`, `game/sound/`, `game/party/`, `game/encounters/`, `game/art/arena/`, `game/art/backdrops/`, `game/pages/battle.html`, `tools/battle-*`, `tools/encounter-*`, `docs/slips/fights.md`, the faces the battle uses in `game/witches/*/moon-*.js`, and **the two marked slots in `game/pages/zone-1.html`** ("fights job: ..." to "fights job: end") | everything in the row above (read it, use it, ask the hub for a change in the slip) |

Both add lines to `assets/INDEX.csv` (at the end; the hub sorts out the join when it merges).

## How to start a job (for Chris)

1. Open a new conversation and paste the job's starter text from below.
2. The job works on its own branch and sends you one HTML file to open on your laptop and phone.
3. Tell the hub when the job says a step is ready. The hub brings it into `main` and updates this board.

## Starter texts

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
