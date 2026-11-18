# Coven of the Moon Faire: the board

Last updated: November 18, 2026, evening, by the hub.

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

1. **The first test** (the Thornwood with Wickhollow). **Built. Waiting for Chris to try it.**
2. The rest of zone 1.
3. The fights joined on.
4. The people.
5. Zones 2 to 4.

One HTML file to Chris at each milestone.

## Where we are

**Milestone 1 is built and sent: `builds/first-test.html`** (built from `game/pages/first-test.html`, 27.5 MB).

What it is: Wickhollow's square as the reskinned zone 1 has it, with 770 m by 510 m of open land round it. Io walks
out of town into the land and back with no fade. Across the bridge is the Thornwood: thorn trees, heavy pale fog, a
road, a ring of standing stones, a still pool, herbs to pick. Its slip is `docs/slips/first-test.md`.

What the checks say (all with no screen and no graphics card):

- She walks 74 m out past the town's edge and back; her height never jumps more than 3.8 cm crossing it.
- 0 page errors. The file fetches nothing from outside itself.
- A piece of land takes 2 to 4 thousandths of a second to make.
- 130,000 to 365,000 triangles and 95 to 290 draw calls, depending on where she looks. The square alone was 203,000
  and 135 before the land.

**What nobody has measured: the frame rate on a real laptop or phone.** The page shows it at the bottom left.

## What is being worked on now

| Who | What |
|---|---|
| Chris | Trying the first test on his laptop and phone, and reading the frame rate off the bottom left |
| The hub | Next: the rest of zone 1 (below) |

No job conversations are running.

## What comes next: the rest of zone 1

Job `zone-1`. Zone 1 has six places (Wickhollow, Io's cottage, the jetty, the Thornwood, Bogmire, Bogmire's dark
heart) and now the Moon Faire's camp, where the game starts.

In this order:

1. **Several places on one land.** Today the land engine wraps one place, at the land's middle. Zone 1 needs many,
   each at its own spot, each built when she comes near and let go when she is far, without a stall. This is the main
   piece of new engine work and the main risk: building a place takes a few seconds today.
2. **Zone 1's shape from the 3D map.** The land's broad heights and kinds of ground read from the map of Aethermoor,
   with the distances squeezed: about 1.5 km by 1 km for the zone.
3. **The other five places copied in** and set on the land, with roads between them.
4. **The Moon Faire's camp**, with Moon Faire's fair kit (tents, stalls, the wagon), as the place the game starts.
   Hub's call still to make: where. The hub's leaning is the meadow by the south road, between Wickhollow and Io's
   cottage.
5. **A choice of who walks**: Kore beside Io first, then Europa and Callisto.
6. **The long wild road** out of zone 1 toward zone 2 (about 6 km), as rules only.

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

- **The frame rate of the first test** on his laptop and on his phone (bottom left of the screen), standing in the
  square, and standing in the Thornwood. It decides how thick the trees and how wide the view can be in zone 1.
- Anything he wants changed in how the land looks or feels: the fog, the trees, the roads, the camera drawing back.

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
| `zone-1` | The rest of zone 1 on one land | `job/zone-1` | `docs/slips/zone-1.md` | Next. Not started |

## How to start a job (for Chris)

The hub is building the pieces itself for now, in the order above. If a second conversation should take a piece:

1. Open a new conversation and paste the job's starter text (the hub writes it here when a job is ready to hand out).
2. The job works on its own branch and sends you one HTML file to open on your laptop and phone.
3. Tell the hub when the job says it is ready. The hub brings it into `main` and updates this board.

## Starter texts

None handed out yet.
