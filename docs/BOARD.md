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
2. The rest of zone 1. **Built, bar the people: six places, the camp, four witches to walk as, the map's hills and fen, the long road.**
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
| Chris | Trying the camp; starting a second conversation on `fights` if he wants (starter text below) |
| The hub | The rest of milestone 2 (below) |

## What is left of milestone 2 (job `zone-1`)

Done on November 18 (late): any of the four witches walks; a map in the corner; zone 1 lies on the 3D map of
Aethermoor (its hills, water and fen); the long road toward zone 2 (6.07 km). The details and numbers are in
`docs/slips/zone-1.md`.

1. **The better map**, being made by a sub-agent on `job/minimap` (`docs/slips/minimap.md`). The hub checks it and
   merges it.
2. **Chris's frame rates** with the new land (the fen's water, the long road's forest), on his laptop and phone.
3. **Rough spots**: the camera can pass inside a tent; a road crosses water on a plain bank of earth; the long road
   is bare and ends at a hedge; the two lakes are still two.

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
| `minimap` | A better map in the corner (a sub-agent of the hub's) | `job/minimap` | `docs/slips/minimap.md` | **Running.** Its only files: `game/engine/land/minimap.js` and the map's CSS in `game/pages/zone-1.html` |
| `fights` | The new Envoi's battle copied in and running here as its own page, then grown to four witches | `job/fights` | `docs/slips/fights.md` | **Ready for a second conversation.** Chris has the starter text (also below). No branch yet |

**Who owns which files, so two conversations never write the same one:**

| Job | Its own folders and files | Must not change |
|---|---|---|
| `zone-1` (the hub) | `game/engine/`, `game/places/`, `game/fair/`, `game/data/`, `game/pages/zone-1.html`, `game/pages/first-test.html`, `game/witches/`, `game/art/world/`, `tools/build.py`, `tools/look.py`, `tools/walk-test.py`, `tools/zone-test.py` | anything of `fights` |
| `fights` | `game/battle/`, `game/sound/`, `game/pages/battle.html`, `tools/battle-*`, `docs/slips/fights.md` | everything in the row above, and all of `game/witches/` (read it, use it, ask the hub for a change in the slip). **The hub has already copied in Kore's, Europa's and Callisto's light models** (`game/witches/kore/`, `europa/`, `callisto/`, with their lines in `assets/INDEX.csv`): use those, do not copy them again. A fight needs more of a witch (her moves, her full model): copy those into `game/battle/` |

Both add lines to `assets/INDEX.csv` (at the end; the hub sorts out the join when it merges).

## How to start a job (for Chris)

1. Open a new conversation and paste the job's starter text from below.
2. The job works on its own branch and sends you one HTML file to open on your laptop and phone.
3. Tell the hub when the job says a step is ready. The hub brings it into `main` and updates this board.

## Starter texts

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
