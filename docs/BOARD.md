# Coven of the Moon Faire: the board

Last updated: November 18, 2026, late evening, by the hub.

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
2. The rest of zone 1. **Part built: six places joined. The camp is next.**
3. The fights joined on.
4. The people.
5. Zones 2 to 4.

One HTML file to Chris at each milestone.

## Where we are

**Milestone 1, the first test: done.** Chris ran it at 144 frames a second on his laptop and 60 on his phone, in town
and in the woods (90 to 100 and 45 to 50 with the Flipbook look). Those are almost certainly each screen's top speed.

**Milestone 2, zone 1: part built.** `builds/zone-1.html` (from `game/pages/zone-1.html`, 69.6 MB) has all six of the
zone's places on one land of 955 m by 645 m, joined by roads, walked between with no fade. Its slip is
`docs/slips/zone-1.md`. An early copy went to Chris on November 18 so he can try six places at once.

What the checks say (no screen, no graphics card):

- Io walks from each place to the next and arrives; her height never jumps more than 7 cm at an edge.
- 0 page errors. The file fetches nothing from outside itself. The first test still passes.
- The page takes 12 seconds to start with six places (8 with one).
- 150,000 to 435,000 triangles and 105 to 375 draw calls.

**Not measured:** the frame rate with six places, and whether a phone opens a 70 MB file.

## What is being worked on now

| Who | What |
|---|---|
| Chris | Trying `zone-1.html`: the frame rate in each place, and whether his phone opens it |
| The hub | The rest of milestone 2 (below) |

No job conversations are running.

## What is left of milestone 2 (job `zone-1`)

1. **The Moon Faire's camp**, where the game starts: Moon Faire's fair kit (tents, stalls, the wagon, the well)
   copied in and set on the land. Hub's leaning for the spot: the meadow about 70 m west and 150 m south of
   Wickhollow's square, between the lake and the cottage's road. The kit is lit by Moon Faire's own shader, so it
   needs fitting to the place engine's night, the way the land was.
2. **A choice of who walks**: Kore beside Io first (her light model is in the new Envoi), then Europa and Callisto.
3. **Zone 1's broad shape from the 3D map** of Aethermoor, so the land's hills and shores are the map's.
4. **The fen's own ground and reeds** on the land round Bogmire, and the lakes joined up.
5. **The long wild road** out of zone 1 toward zone 2 (about 6 km), as rules only.
6. **A lighter build for the phone**, if 70 MB proves too much: smaller copies of the textures.

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

- **The frame rate of `zone-1.html`** on his laptop and phone (bottom left), in Wickhollow, in Bogmire and by the
  cottage. And whether the phone opens the file at all.
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
| `zone-1` | All of zone 1 on one land | `job/zone-1` | `docs/slips/zone-1.md` | **Part done, in `main`.** Six places joined. The camp and the rest are left |

## How to start a job (for Chris)

The hub is building the pieces itself for now, in the order above. If a second conversation should take a piece:

1. Open a new conversation and paste the job's starter text (the hub writes it here when a job is ready to hand out).
2. The job works on its own branch and sends you one HTML file to open on your laptop and phone.
3. Tell the hub when the job says it is ready. The hub brings it into `main` and updates this board.

## Starter texts

None handed out yet.
