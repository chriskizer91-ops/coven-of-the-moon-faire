# Coven of the Moon Faire: the board

Last updated: November 18, 2026, by the hub.

**Only the hub changes this board.** A job conversation writes only its own slip, `docs/slips/<name>.md`, on its own
branch `job/<name>`. The rules are in `CLAUDE.md`.

## What this game is

One game made from two: the new Envoi (Aethermoor's four zones in 3D, the 3D map, the rebuilt battle with sound) and
Moon Faire (the four witches of the coven, the fair folk and their minds, the open land, levelling and herbs).
Chris's plan: use Envoi's zones, map and battle; bring in Moon Faire's people, lore and open land; use the open land to
make Aethermoor's wilds walkable; then keep building.

## Where we are

**Nothing of the game is built here yet, on purpose.** Chris asked for the ground rules first.

Done (November 18):

- This repo set up: `CLAUDE.md`, `README.md`, this board, `docs/decisions.md`, `docs/lore/README.md`, `docs/slips/`,
  and an empty `assets/INDEX.csv`.
- Both old repos read on `main`: their project notes, their decisions and their code.
- `docs/assets-list.md`: every finished asset in both games, where it lives, how finished it is, and a suggestion for
  each. It also says what changed on `main` since the surveys of November 17.
- `docs/questions.md`: 13 calls for Chris, each with a suggestion.

## What is being worked on now

| Who | What |
|---|---|
| Chris | Answering `docs/questions.md` |
| The hub | Waiting on those answers. Then: write them into `docs/decisions.md`, and start the first test |

No job conversations are running.

## What comes next, in order

1. **Chris's answers** go into `docs/decisions.md`. The asset list's suggestions are updated to match.
2. **The first test build** (job `first-test`): Moon Faire's open land around the Thornwood, with Envoi's Wickhollow in
   it. One HTML file. What it must show is question 13. What it would copy in is the last section of
   `docs/assets-list.md`.
3. Chris tries the test on his laptop and phone. What he says decides how the zones are built.

After the test, and not before. These are the hub's guess at the jobs; they are not started and their names may
change with Chris's answers:

| Likely job | What it would do | Depends on |
|---|---|---|
| `zone-1-land` | Zone 1 as one open land with all its towns in it | The test, question 5 |
| `battle-for-four` | The new battle grown to take 2, 3 or 4 witches, with the finale and Halcyon | Questions 2 and 3 |
| `story` | The setting and the story, written with Chris | Questions 1 and 6 |
| `people` | The fair folk and the townsfolk standing in the 3D places, with minds | Question 10, the story |
| `lines` | Every person's words, written new | The story |
| `travel` | Choosing where to go on the 3D map, the flight, landing | Question 11 (Skies of Aethermoor as a source) |
| `levels` | One levelling plan and one balance check for the merged game | Questions 2, 3 and 4 |
| `one-game` | Title, save, pause menu, and everything joined from start to finish | All of the above |

Two or three jobs at once at most, besides the hub.

## Waiting on Chris

**For this game:**

- The 13 questions in `docs/questions.md`.

**Left open in the old games, and still his to answer when they come up** (none of these blocks the test):

- Sound Choices: his picks among the four versions of the ten most common battle sounds.
- The 17 fighting models on Everyone Who Fights: lock them in, or say what to change.
- Whether Halcyon gets moves of her own (she uses Io's today).
- Six textures that show a faint line where they repeat: make any again?
- Which Skies of Aethermoor ship he flies first.
- Four small answers on herbs (a witch who fainted; where the game teaches topping up; the careless player; whether
  the two play styles stay).
- The Moon Faire brambles: he has not looked at them yet.
- The names of the three stars and the four other planets on the star map.
- His songs: where each plays, when he is ready.

**One thing only he can do on GitHub:** Envoi's repo still shows an October branch as its default. To make `main` the
branch people see first, change the default branch in that repo's settings. (Not needed for this game: every session
here reads `main` by name.)

## Jobs

| Job | What it does | Branch | Slip | State |
|---|---|---|---|---|
| `first-test` | The open land round the Thornwood with Wickhollow in it, as one HTML file | `job/first-test` | `docs/slips/first-test.md` | Not started: waits for Chris's answers |

## How to start a job (for Chris)

1. Open a new conversation and paste the job's starter text. The hub writes it here when the job is ready to start.
2. The job works on its own branch and sends you one HTML file to open on your laptop and phone. Ask it for changes
   right there until you are happy.
3. Tell the hub when the job says it is ready. The hub brings it into `main` and updates this board.

## Starter texts

None yet. The first one is written once the questions are answered.
