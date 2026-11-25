# Questions for Chris

## Open calls, November 25, 2026

Written by the hub. The game is whole and in `main`. These are the calls that are yours. Each has my suggestion,
and the game is built on the suggestion until you say otherwise. Answer in any form ("A3: yes", or your own words).
The thirteen questions of November 18, all answered, are kept below as the record.

### A. Only you can do these

| | What | Why it matters |
|---|---|---|
| A1 | **Open the builds on your laptop and your phone.** Read the frame rate off each page. Close the page, open it again, and see whether your save is still there | No machine here can measure speed, motion, sound or touch |
| A2 | **On the phone: does one downloaded page open the next?** Open `index.html` from a folder holding all five files and board the ship at zone 1 | If it does not, the journey on a phone needs another way to hand over, and I build that next |
| A3 | **On the phone: does a page of 100 to 125 MB open at all,** and how long does it take? | If it does not, the pages have to be made lighter for the phone |
| A4 | **Record the held Warden's two lines** (`z4.warden.01`, `.02`). Is that Warden a man or a woman? | Zone 4 has 142 of its 144 voices |
| A5 | **Record the narrator's 18 lines for zone 4** (`game/people/recording/narration-recording-order-z4.txt`) | Zone 4's narration is silent until then |

### B. The fights

| | The call | What the game does now (my suggestion) |
|---|---|---|
| B1 | How many fights a zone | About 45, a meeting every 100 to 130 m. A careful player meets 181 in the whole game |
| B2 | How often a creature is met, not a wisp or wraith | About one fight in 3, with both creatures of a zone turned on. With only the first of the two it would be about one in 6 |
| B3 | What happens to a beaten creature | It is let go, not killed: the Rotwarden and the Glowcap root, the Forge-Spark gutters out, the Thornhound and the Rot-Stag run off, the Sapwight withers, the Wickstoat drops its lights and bolts, the Hoarmantle walks off |
| B4 | The knight | He stops at 3/10 of his Life. Each answer gives him back 1/10, up to 6/10 |
| B5 | The fire's ending | Its first form stops at 45%. Only Kore's Sealed Fate ends the second. The two forms' names are stand-ins |
| B6 | Resting | She can rest at the hall, the bunkhouse and the inn |
| B7 | What waits at the road stones | Frost wisps and a wraith |
| B8 | A lost flight | She is put back where she left, and nothing is lost |
| B9 | What zone 4's white sage does in a fight | It heals the whole party, as Lavender does. A stand-in by the fights-polish job. Before November 25 it was carried and could not be used at all |
| B10 | A fight on an upright phone: the painted place, or the fighters big | The fighters big. The camera stands behind the party and looks down, so only ground shows behind them. To see a strip of the painting the camera must look down less, and then the witches stand in front of the foes |

### C. The creatures

| | The call | What the game does now (my suggestion) |
|---|---|---|
| C1 | Where each one lives | Zone 1: the Rotwarden (A), the Glowcap (B). Zone 2: the Forge-Spark (A), the Thornhound (B). Zone 3: the Sapwight (A), the Rot-Stag (B). Zone 4: the Wickstoat (A), the Hoarmantle (B) |
| C2 | Their names and their moves' names | All stand-ins, in `game/encounters/words.js`. Two begin with "The" (the Rotwarden, the Rot-Stag) and six do not. The Hoarmantle's "Paws the ground" names a motion that was taken out |
| C3 | The Forge-Spark's size | 0.49 m, as in M7. It is hard to see on a phone. I suggest half as big again (about 0.75 m) and a stronger glow |
| C4 | The Forge-Spark's weakening move | "Lure" |
| C5 | The Wickstoat's sparks at the start of a fight | 3 lit |
| C6 | The Hoarmantle: another round on its hair and horns? | They are softer than your sheet: streaks where yours has layered locks, and paler, more banded horns |
| C7 | The Hoarmantle's weight | 2.18 MB in a page; the aim was 1.5. I suggest leaving it: zone 4 is the lightest page |
| C8 | The Rot-Stag's colour picture | 768 px now (1.22 MB). 512 px would save about 0.3 MB and look a little softer |
| C9 | A big foe at the right edge of a laptop screen is cut a little by the camera | Left as it is until you have seen it move |

### D. The journey and the words

| | The call | What the game does now (my suggestion) |
|---|---|---|
| D1 | The words "Board the ship", "Back to the front door", "the end reached", and the front door's line | Stand-ins, in `game/travel/journey-data.js` |
| D2 | Whether the homecoming lines move onto the flight home | They play on arrival now |
| D3 | Zone 4's peaks | One ninth of the map's height |
| D4 | Whether the flight is made again from stage 5 of your airship game | You said "let me think about the flight". It stands as built |
| D5 | The townsfolk's own bodies | The 23 keep stand-in bodies. The kit for their pictures waits unless you ask |
| D6 | The knight and the fire wear Halcyon's and Noctara's models | Stand-ins until you say what they should be |
| D7 | The sky's names (stars, planets, the crystal band) | A proposal: `docs/lore/sky-names-proposal.md` |
| D8 | When the leaving lines are said (the narrator, then the coven, as the ship leaves a zone) | After "Board the ship" and "Set course", just before the flight. Before November 25 they were said on the land, before she boarded. The coven's lines speak as if already in the air while the picture is still the pier. Saying them over the flight itself is a bigger change, not made |

---

## The thirteen questions of November 18 (all answered)

> **Answered, November 18, 2026, afternoon.** Chris said yes to all 13, with changes in his own words on questions 3,
> 5 and 8: all four witches from the start; any of them can lead; and crossing the whole map on foot should take about
> an hour and a half. His answers are in `docs/decisions.md`. This page is kept as the record of what was asked.

Written by the hub, November 18, 2026. These are the calls only you can make. Each one says what the two games do
today, then my suggestion. A suggestion is only that: nothing is built on it until you answer.

Answer in any form ("1: yes", "3: B", or your own words). Your answers go into `docs/decisions.md`.

The first five are the ones you asked for. Questions 6 to 13 came up while reading both games.

---

## 1. The setting and the timeline

**The question.** Where and when does Coven of the Moon Faire happen?

**Today.**

- Moon Faire: another continent of Thareia, not Aethermoor, in a different time, because the moon has to be overhead
  where the Faire is.
- The new Envoi: Aethermoor, in Envoi's own places, as an alternate universe to the first Envoi.
- Your plan of November 18 uses Envoi's zones and the 3D map of Aethermoor, so the land is Aethermoor.

**My suggestion.** The game happens on **Aethermoor, in the years the moon is over it**, and the Moon Faire has come
to Aethermoor because it follows the moon. That keeps both of your rules: the Faire is always under the moon, and
every place already built is used. Moon Faire's other continent is not thrown away. It becomes where the Faire goes
next, for a later game.

Two small things ride on this:

- **Wisps and wraiths.** Moon Faire calls them "flames gone cold". Envoi calls them "souls going hollow". I suggest one
  line that makes both true: *a soul is a light*. A wisp is a light that has lost its way.
- **How much of the "Envoi at Moonset" story to use.** That story is my proposal from November 16 and you have not
  approved it. I suggest we do not adopt it whole now. We settle the setting here, and the story gets its own
  conversation with you.

---

## 2. Which fight rules

**The question.** The two games fight by different rules. Which one is the game's?

**Today.**

| | The new Envoi's battle | Moon Faire's fight |
|---|---|---|
| Party | 2 witches (Io, Kore) | 4 witches |
| Where it happens | Envoi's 3D arenas | 5 painted backdrops |
| Kore's Fate rules | Yes (taken from Moon Faire) | Yes |
| Kore's HP at level 1 | 2,000 | 1,000 |
| Sound and music | 155 sounds and 6 music pieces, wired in | None |
| Foes | Envoi's: wisps, wraith, great wraith, 4 Bramble Horrors, Colossus | Wisp, wraith, great wraith; 3 brambles built but not joined |
| HP and MP between fights | Carried from fight to fight; rests refill | Carried from fight to fight; rest spots refill |
| Herbs | Bought in shops with shards (up to 99 of each); each kind once per fight | Picked from wild plants; one press tops everyone up between fights |
| Checked by | Envoi's 51 balance targets (44 met on `main`) | 8 pretend players |

**My suggestion.** **One fight: the new Envoi's battle**, because it has the arenas, the sound, the music and Kore's
Fate rules already in it. Into it we bring three things from Moon Faire:

1. Europa's and Callisto's moves and numbers, so the same battle can run with 2, 3 or 4 witches.
2. Moon Faire's herbs beside Envoi's: Io picks wild plants in the open land and one press tops everyone up between
   fights, and shops still sell herbs for shards. (Both games already carry HP and MP from fight to fight.)
3. Moon Faire's eight pretend players, as a second check beside Envoi's 51 targets.

Kore's numbers are set per party size (she needs more HP with two witches than with four). All of it needs
rebalancing, as you said on November 18.

---

## 3. When each witch joins

**The question.** Does the party start as four, or grow?

**Today.**

- Moon Faire: all four from the start. Their story goes back to before the game.
- The new Envoi: Io fights alone first, and Kore joins on the first night. Europa and Callisto are not in it.
- You have said your bigger story is how the four come to know each other.

**My suggestion.** The party **grows by one witch per zone**, so the game is the story of how they meet:

| Zone | Levels | Who is in the party |
|---|---|---|
| 1. Wickhollow and the fen | 1 to 5 | Io alone for the first fight, then Kore |
| 2. The Warm Roads | 5 to 10 | Callisto joins (3) |
| 3. The northern wilds | 10 to 15 | Europa joins (4) |
| 4. The northeast peaks | 15 to 20 | All four, through the finale |

Callisto before Europa because Callisto's magic is the weakest and Europa's the second strongest, so the party's
power climbs in steps. It also gives the balance a clean step at each zone. The order, and where each one is met, are
yours.

The other choices: all four from the start (Moon Faire's way), or only Io and Kore for the whole game with the other
two kept for a later game (Envoi's way).

---

## 4. How the gating works

**The question.** What stops the player from going on until they are ready?

**Today.**

- The new Envoi: four zones, one per level band. A big fight at the end of each: level 5 (the great wraith), 10
  (Dawnroost), 15 (Halcyon), 20 (the finale). A new zone opens on the party's level, plus the crystals or the ship
  upgrade for that flight, using Skies of Aethermoor's four ships.
- Moon Faire: 20 levels and about 180 fights. Two gates: the great wraith at level 10 and the great bramble at level
  20. Then the final boss, with a choice of easy, medium, hard or crazy. Out walking, foes are from one level below
  the party to two above.

Both stop at level 20, which makes them easy to join.

**My suggestion.** **Envoi's four zones and four gate fights, opened the Envoi way** (level, then crystals or a ship
upgrade). From Moon Faire we keep:

- the choice before the last fight (easy, medium, hard, crazy: levels 20, 21, 22, 22.8);
- the final boss in two forms, with the party refilled between them;
- wild foes from one level below the party to two above;
- about 180 fights in all, so about 45 a zone.

Moon Faire's own two gates are dropped, because Envoi's four cover the same levels.

---

## 5. How much of Aethermoor is walkable

**The question.** You want the wilds walkable, "everywhere or at least much more of it". How much, and at what size?

**The sizes today.**

| Thing | Size |
|---|---|
| One Envoi place (Wickhollow's square) | about 60 m by 50 m |
| All 21 Envoi places | each roughly that size (the wild ones are wider fields), joined by fades |
| Moon Faire's whole open land | 768 m by 512 m: about 125 times one Envoi place |
| Aethermoor on the 3D map | about 46 km by 31 km |
| Wickhollow to Bogmire on that map | about 8 km |

At the open land's running speed (4.4 m a second), Wickhollow to Bogmire at true size is a 30-minute run, and
crossing the whole continent is close to 3 hours. True size everywhere would be mostly empty running, and it is far
more land than a phone or laptop can hold at ground detail.

**My suggestion.** **Each zone becomes one open land you walk without a fade**, with its towns standing in it at their
real size and the distances between them squeezed:

- Each zone's land is about 1.5 km by 1 km. That is four times Moon Faire's whole land, per zone, and about 500
  times one Envoi place.
- A run from one town to the next takes one to two minutes.
- Flying between zones stays as you decided, with Skies of Aethermoor.
- The parts of Aethermoor outside the four zones (the central island, the east, the southeast) stay fly-over only for
  now. The open-land method means new land can be added later without rebuilding.

The first test (the Thornwood with Wickhollow in it) would be one piece of this: about 770 m by 510 m, the size of
Moon Faire's land, so you can feel the scale before we commit to it.

One thing to tell me: inside a zone, should walking into a town be **seamless** (my suggestion), or is a short fade at
a town's edge fine?

---

## 6. The final fire

**The question.** The same boss model plays two stories. Which is it now?

**Today.** In Moon Faire it is a cold beacon on a crag. In the new Envoi it stands at Misthollow's dead Moonwell, in
Noctara's place.

**My suggestion.** With one game there is one fire: **at Misthollow's dead Moonwell**, at the end of zone 4. Its look
and its two forms stay exactly as you approved them. Moon Faire's crag is not built yet, so nothing is lost. What the
fire *is* belongs to the story conversation (question 1).

---

## 7. The moon's name

**The question.** Is the moon **Auros** or **Aurous**?

**Today.** Moon Faire's lore and Envoi's lore drafts write "Auros". The star map and Envoi's November 17 notes write
"Aurous".

**My suggestion.** **Auros**, because it is the spelling in far more places. On the star map it is a one-word fix.

---

## 8. Who the player walks as

**Today.** Moon Faire: the Jester (Kore), with the others walking with her, and the fair folk speak only to her. The
new Envoi: Io, who already walks all 21 places.

**My suggestion.** **Io**, since the game opens with her alone and she is already walking every Envoi place. Once
others have joined, a button in the menu lets you choose who leads. The fair folk's lines are being rewritten anyway
(question 10), so they can be written to whoever is leading.

---

## 9. How foes are met while walking

**Today.** Moon Faire: unseen chance meetings, only away from lamps and people. The new Envoi's 3D zones have no
fights joined on yet; the 2D Envoi had its own rate.

**My suggestion.** **Moon Faire's rule** (unseen, only in the wild, never near lamps or people), at **Envoi's rate**.
A fight then cuts to the nearest Envoi arena for that land.

---

## 10. The people

**Today.**

- Moon Faire has 11 fair folk and the Grey Hat captain: light models (about 2,700 triangles each), a mind each, and
  480 lines written for Moon Faire's story.
- The new Envoi uses those same 11 bodies to play Envoi's 17 townsfolk, with Envoi's old words as a stand-in.
- You were still weighing whether the base doll's 21 outfits, with face coverings, should play some people. A doll is
  about 50,000 triangles: about 18 fair folk's worth.

**My suggestion.**

- **The fair folk are themselves**, at the Moon Faire's camp, with their minds. The Faire camps where the story needs
  it (in the first test: near Wickhollow).
- **Envoi's townsfolk stay on the fair-folk bodies for now**, in new painted skins over time so nobody appears twice.
- **The doll plays only a few important people** (Halcyon already; perhaps one leader per town), because of its
  weight.
- **Every line is written new** once the story is settled. The 480 Moon Faire lines are kept as a model of the voice,
  not used as they are.
- **The Grey Hat** is the captain of the ship you fly between zones, standing at each landing. He replaces the
  stand-in playing Quill, now that he has a light model.

---

## 11. Sources outside the two old repos

**The question.** Two things the game may need are in neither `main`.

- **Skies of Aethermoor** (`airship-game-in-aethermoor-`). Flights between zones are built on it, and it is not one
  of the two sources you named. **My suggestion:** add it as a third read-only source when the travel job starts, not
  before.
- **The first Envoi's last polish** (55 commits on the old branch `claude/send-note-gigdew`). They are not in Envoi's
  `main`. They only matter if we want the first Envoi's own final fixes to its arenas and foes. **My suggestion:**
  leave them out unless a build hits a bug they fixed.
- **"Music of the Moon Faire"** (the Carnival of Ashes breakdown, on Moon Faire's old branch `ccr-d4490116-7cqwt4`) is
  also not in Moon Faire's `main`. The song itself is in Envoi's `main`. **My suggestion:** leave it out; your songs
  are on hold.

---

## 12. Laptop or phone first

**Today.** For the 3D Envoi you said the laptop is the main screen and the phone is secondary. For Moon Faire you
first thought laptop only, then the fair square "ran great" on both.

**My suggestion.** **Laptop first, and it must also run on the phone**: one file that notices which it is on and
turns detail down for the phone by itself. Every build is tried at both sizes before it is sent.

---

## 13. The first test: what counts as a pass

You named the first build: Moon Faire's open land around the Thornwood, with Envoi's Wickhollow in it. Before
building it, I suggest we agree what it has to show:

1. Io walks out of Wickhollow's square into open land and back, with no fade.
2. The land is Moon Faire's kind of land (drawn in squares round the camera, far hills, fog), wearing Envoi's
   zone 1 textures and the Thornwood's thorny trees.
3. Wickhollow looks the same as in the reskinned zone 1 build you said looks really good.
4. The camera never goes inside a wall or a tree.
5. It runs smoothly on your laptop and opens on your phone. The file shows its own frame rate, and you tell me the
   number.

No fights, no people and no story in the test, unless you want them. Say if any of these should change.
