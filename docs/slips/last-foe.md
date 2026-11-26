# last-foe: the fire wears its own model; the last fight's four settings; what exists of the knight

Branch: job/last-foe (with `main` 877ef05 merged)      Updated: November 26, 2026

## Report for the hub

**What was done**
1. **The fire wears its own model in both forms:** Moon Faire's final foe, "the fire that would not end", copied in
   unchanged from `moon-faire` `main` `6371714` (`game/battle/models/final-fire.js`, 58 KB, its line in
   `assets/INDEX.csv`; no web address, no outside code, so no licence note needed). A small new file plays it in the
   battle (`final-fire-foe.js`, 4 KB). Form one lights up as it appears; the final form appears whole and breaks open
   as its fight begins; its end is the model's own ending (one small flame left). No rule, number or player's line of
   the fight was changed by this part (only which motion each move plays). Part 1 below.
2. **The last fight's four settings (task 3):** a card just before the last fight: Easy, Medium, Hard, Crazy (levels
   20, 21, 22, 22.8, as Moon Faire's plan and Chris's decision say). The setting is the level of everything in both
   forms. Form one now has its helpers (two wraiths, two frost wisps); the party comes to the final form refilled. The
   story's rules stay (form one stops at 45%, only Kore's Sealed Fate ends the final form). Part 2 below, with the plan
   point by point against the game, and nine calls for Chris.
3. **The knight: found, not built.** The model Chris means is almost surely **Envoi's new Halcyon** (Moon Faire's base
   doll in its paladin outfit, with a glow made in code; about 50,000 triangles; motions borrowed from Io; about 6.4 MB).
   In this game's lore the knight *is* Halcyon. Aethermoor M7 has no knight of light. Part 3 below.

**Added to a page** (as files; the builder counts about the same): **zone 4 and the fights lab +0.07 MB each** (the
model 58 KB, its player 4 KB, the card 11 KB). The battle page: nothing (it does not offer the last fight). Zone 4's
page after the merge with `main`: **81.9 MB as a file** (78.2 MB as the builder counts it), under 100 MB.

**Checks** (all on pages built from this branch; numbers below)
| Check | Good | Failed |
|---|---|---|
| The card on the fights lab, 1280x720 and 412x880: four buttons (123x70 px; two rows of two on the phone), keyboard and click/tap, each setting started with the fire and its 4 helpers at its level and the name box showing it (Level 20, 21, 22, 22.8); crazy played 8 turns | 12 + 12 | 0 |
| The last fight on **zone 4's land** at each setting: card, levels, name box, form one stopped, the coven's moment between, the final form at the same level with the party full, the card asked once; **easy's final form played to its end and won by Kore's Sealed Fate** (43 turns), the other three let fall | 26 | 0 |
| `node tools/battle-balance.mjs` | 49 of 51 | 2, **the same two as before** (old Envoi's Dawnroost and finale): its numbers did not move |
| `node tools/encounter-balance.mjs --gates` | every target met (the fire at level 20: careless 4.8%, attentive 100%, expert 100%, as before) | 0 |
| `node tools/last-fight-balance.mjs --n 300` (new) | the table in "The sums" | |
| `tools/battle-test.py` on the battle page (built after the merge) | 8 fights played to their end | 0 page errors, 0 failed |
| `tools/battle-start-test.py`, `encounter-test.py builds/zone-4.html --long-only`, form two's stills | **still running** (waiting for the shared lock): see "Checks still running" | |

**Pictures to show Chris** (all in `/tmp/claude-0/-home-user-coven-of-the-moon-faire/41576e32-9c97-530a-9c7c-c502d1946878/scratchpad/last-foe/`):
`sheet-for-chris.jpg` (the fire's two forms in a fight here, beside the same two as Moon Faire showed them), the card
`card/card-1280x720.png` and `card/card-412x880.png`, a fight at crazy `card/rounds-crazy-1280x720.png`, the knight
`knight/knight-three-quarter.png`.

**For the camera job (`fight-camera`): the last foe's true sizes, in metres** (it stands at x 3.2, z -11.5; it does
not walk)
| | Height | Width | Its middle (the black sphere, `anchor('heart')`) | Its top (`anchor('top')`) | The bowl's glow |
|---|---|---|---|---|---|
| Form one | 8.0 | 4.8 | 6.1 up | 8.0 | 1.3 up |
| Final form | 12.0 | 9.6 (its ribbons and loose blades reach a little past) | 7.9 up | 12.0 | 0.8 up |
During its change (the first 5.2 s of the final form's fight) it grows from the first row to the second, from 2.6 s
on. Its look gives `tall` 8 and 12, `halfW` 2.4 and 4.8. Its blow lands about 4.3 m in front of it, so with the party
12 m away the hand never reaches them in the picture (the hit shows on the witch). Form one's helpers stand at
(1.5, -5.2), (5.0, -6.6), (2.8, -3.8), (4.6, -4.4).

**What could not be checked here:** motion (stills only), frame rate (this machine draws 1 to 3 frames a second with
no graphics card; the page shows its own rate for Chris to read), sound, touch on a real phone (the tap was a test
browser's), how the model looks with the Flipbook look on.

## Part 1. The fire wears its own model, in both forms

### What was copied in

| File here | From | Commit | Size |
|---|---|---|---|
| `game/battle/models/final-fire.js` | `moon-faire`, `main`, `game/models/foes/final-fire/final-fire.js` | `6371714` | 58 KB (58,089 bytes) |

- One line in `assets/INDEX.csv`, in the same commit. The file is unchanged (byte for byte). It has no web address.
- Licence: it is Moon Faire's own code, made in code by Claude for Chris (three.js r128, no picture files, no outside
  code inside it). No third-party notice is needed. Envoi's copy (`moon-faire-witches/witches/bigbad/final-fire.js`) is
  the same file.
- Its sizes: 21,104 triangles and 14 draw calls at detail 1 (the model as Chris saw it), six small textures painted in
  code, one light of its own, no skeleton.

### What changed, file by file

| File | What |
|---|---|
| `game/battle/models/final-fire-foe.js` | **New.** Plays the model in this game's battle: the battle's names for a motion played as the fire's own (table below). Form one appears dark and lights up over 2.4 s. The final form appears whole and breaks open (the model's own `change`, 5.2 s) as its fight begins. A move asked for while it breaks open waits for the change to end |
| `game/encounters/foes.js` | Both forms `make: 'makeFinalFireFoe'` (they wore Noctara's model, marked stand-in). Their look as data: height, width, glow colours, where it stands. Each move's `act` names the model's `blow` or `call` (was a Noctara motion). **No rule and no number of the fight changed.** Marked "last-foe:" |
| `game/battle/fights.js` | A fight's first foe whose look names its own spot (`stand`, metres) stands there, and the foes with it where its look's `with` says. Marked "last-foe:" |
| `game/pages/zone-4.html`, `game/pages/fights-lab.html` | Load `final-fire.js` and `final-fire-foe.js` after the stand-in model, in a block marked "last-foe job" |

### The fire's look, as Moon Faire shows it

| | Form one ("The fire that holds") | Final form ("The fire's hunger") |
|---|---|---|
| How tall, how wide | 8 m tall, 4.8 m across | 12 m tall, 9.6 m across |
| Where it stands | 3.2 m right, 11.5 m back (about 12 m from Io) | the same spot |
| Its glow on the ground | crimson `#d42a48`, 3.2 m round | hot red `#ff1f3d`, 4.6 m round |
| Its blows' light on a witch | rose `#f08fa6` | hot red `#ff1f3d` |
| Turned toward the party | about 0.6 of the way round, as Envoi's page of this fight stood it | the same |

The spot and the turn are the ones Envoi's own page of this fight used (`moon-faire-witches/bigbad/bigbad.js`: the boss
at 3.2, -11.5, the witches at -2.6, -0.8 and -1.2, 0.2, its two wraiths and two frost wisps between).

### Which motion plays when

| The battle asks for | The model plays |
|---|---|
| appear (form one) | nothing new: its flames light up from dark over 2.4 s (made here: the model has no appear) |
| appear (final form) | `change`: dark and still, light builds inside, it breaks open at 2.6 s, 5.2 s in all |
| Reaching flames, Hunger (single blows) | `blow`: its iron hand rises and strikes down |
| Draws the light, Flare, The warmth goes, All of it, Heat | `call`: its rings line up, flame streams in from the party's side, it bursts |
| being hit; block; stagger; form one's stop at 45% | `hurt`: a flinch and a ripple through its corona, nothing breaks (Moon Faire: form one "shows no damage") |
| its end (the final form, after Kore's Sealed Fate) | `ending`: the corona goes out blade by blade, the shards fall, one small ordinary flame is left |

- **Motions of the model not used:** none. All six (idle, blow, call, hurt, change, ending) are used.
- **Moves of this game's fire with no motion of their own** (each plays its nearest, listed above): Reaching flames
  (three blows on one hand strike), Draws the light, Flare, The warmth goes, All of it, Heat (five moves on one call).
  Flare and All of it are gathered a turn ahead: the gathering turn has no motion of the model's (the battle's own ring
  and drawn-in sparks show it).

### Noctara

After this change **nothing wears Noctara's model** (the knight wears Halcyon's). `noctara.js` (0.11 MB) is still
loaded on zones 1 to 4, the fights lab, both creature labs and the battle page, and `fights.js` still knows it (the old
Envoi's own finale, which no page offers). Left for the hub to remove (see "For the hub").

## Part 2. The last fight's four settings (task 3, Chris's word of November 25)

### What Moon Faire's plan says, and what this game did before today

Read from `moon-faire`, `main` (`6371714`): `game/plan/finalboss/final-fight.json` (the fight Chris chose; "the fight
the game reads"), its `README.md`, and the project notes `docs/project-notes/decisions.md` (November 15) and
`claude/final-boss-the-fire-that-would-not-end.md`. The plan file is **not copied in**: its numbers are on Moon
Faire's own scale (the Jester has 1,000 HP there, 63,896 here), so this game's rules make the numbers from the levels.

| # | The plan says | This game before today | This game now |
|---|---|---|---|
| 1 | Before the fight the game offers four settings, easy, medium, hard, crazy: levels 20, 21, 22, 22.8 ("crazy is 22.8, not 23"). Each sets the level of **everything in both forms** | the fire fixed at level 20, no choice | **Built.** A card just before the last fight; the setting is the level of the fire and of its helpers, in both forms |
| 2 | The party is level 20, the top, and meets the fight fresh from a rest spot | the coven at 20 (the fight is offered from 20); it comes with whatever HP and MP it has | as before (a rest spot: see 9) |
| 3 | Numbers grow 20% a level above 20 | this game's rules grow everything 20% a level (`rules.js`: 1.2 to the power of the level less one) | the same rule. 22.8 works as it is (1.2 to the power 21.8): no change was needed to anyone's numbers |
| 4 | **Form one: helpers first.** The big body with four helpers, "wraiths and brambles it has called": two of the Shadow Wraith's kind and two of the wisp's (the brambles use the wraiths' numbers until they have their own) | the fire alone | **Built:** two wraiths and two frost wisps at the setting's level (frost wisps: zone 4's wisps, and what Envoi's own page of this fight put beside it). Brambles: not used (call C3) |
| 5 | Form one shows no damage | (the stand-in did) | the model shows none: a flinch only |
| 6 | Form one ends when its Life is gone **or Kore seals it**; her Curtain Call falls and the fallen get up | it cannot be sealed or ended; its fight stops at 45% of its Life (the story: "Nothing hurts it") | **the story kept** (call C1) |
| 7 | **The change: the full refill.** "Every witch up, full HP and MP, and every once-a-fight move ready again" | the party carried its HP and MP (and its fallen) from form one into the final form | **Built:** the final form begins with every witch up, full HP and MP. Each form is its own fight here, so once-a-fight moves were already ready again |
| 8 | **The final form: alone.** Form one's body with 20% more Life and blows 10% bigger. It starts with no Fate. It ends "for good, in the Curtain Call" | alone; its own numbers (8,000 Life at level 1, against form one's 14,000; no blow can end it; its blows fall on Kore; only Kore's Sealed Fate ends it) | **the story's numbers and rule kept** (call C2). Starts with no Fate: as the plan |
| 9 | A rest spot just outside the place of the fight | the camp and Ede's inn in Misthollow (the fight is at the dead Moonwell) | not changed (call C5) |
| 10 | **If the party falls in either form, the whole fight starts again from before form one** | a form seen through is not fought again: a party lost in the final form comes back to the final form | **not changed** (it is `land-fights.js`, the fights-tune job's file). The card is asked again each time either form is begun, so a lost final form can be tried again easier. Call C4, and the one-line change is under "For the hub" |
| 11 | The words for the refill and the names: not written ("every name is a stand-in") | the coven's moment `between` is played on the land between the forms | no line the player reads was changed. The card's own words are new, marked stand-ins |

### What was built

| File | What |
|---|---|
| `game/battle/last-fight-data.js` | **New, data.** The four settings and their levels; form one's helpers; the refill; the card's words (the four names are Moon Faire's own; the title, the line under it and each button's small line are stand-ins) |
| `game/battle/last-fight.js` | **New.** The card, and the last fight given its setting. It stands in front of `CovenBattle.start` (`start.js` is not changed): a fight whose first foe is one of the fire's forms is given the level, the helpers (form one) and the refill (final form). Every other fight goes through as it came |
| `game/encounters/foes.js` | The fire's level reads the setting while its fight is made, and is 20, as before, when none is chosen (the balance tools). Where the helpers stand (`with`). Marked "last-foe:" |
| `game/battle/fights.js` | The helpers stand where the fire's look says (the same "last-foe:" change as in part 1) |
| `game/pages/zone-4.html`, `game/pages/fights-lab.html` | Load the two files after `start.js`, in a block marked "last-foe job" |
| `tools/last-fight-balance.mjs` | **New.** The sums: a level 20 coven against the last fight at each setting (below). `tools/battle-balance.mjs` is not changed: it has the old Envoi's finale, not this fight |

**The card.** Four buttons in a row on a laptop (123 by 70 px each), two rows of two on an upright phone. A click, a
tap, Tab and Enter, or the keys 1 to 4 choose; the first button has the keyboard when it opens. It has no "not now"
(call C6). **When it is asked:** each time the last fight is begun. The one time it is not: the final form straight
after form one in the same go, which keeps form one's setting. A final form begun again after a loss asks again.
**For the checks:** a fight the battle plays itself (`auto`) in a test browser picks Easy after 1.2 seconds, and
`CovenLastFight.preset = 'hard'` skips the next card. A person pressing the lab page's Watch gets the card.

## Part 3. The knight: what exists (found, not built)

Searched the file lists of all four sources for "knight", "paladin", "halcyon", "warden" (and "armour", "sentinel",
"doll", "outfit"), and the notes' words for "knight" and "paladin":

| Source (branch, commit) | What is there |
|---|---|
| `aethermoor-m7-` (no `main`; its default branch is `claude/brave-davinci-790efm`, `54bee14`; its seven `job/*` branches too) | **No knight of light.** Only Aethermoor M7's own armoured foes: the Ashen Warden ("a stocky knight in shaped plate", its notes say), the Forge Warden, the Iron Sentinel, the Sentinel Captain, the Rotwarden. Each is a finished M7 creature (`prototypes/foe-hd/foes/<name>/`: a sculpt, a rig, textures, motions), made as that game's foes. None is meant for this fight. Nothing on the other seven branches |
| `moon-faire` (`main`, `6371714`) | **The paladin outfit** of the base doll: `base-doll-light/.../wardrobe/C8.js` and its light model `C8_light.js` (outfit C8 of 21). No knight of its own, no Halcyon |
| `envoi-on-the-longest-night` (`main`, `d450c3f`) | **The new Halcyon, built for this:** `moon-faire-witches/src/halcyon-paladin.js` (10.7 KB) on Moon Faire's base doll (`moon-faire-witches/witches/doll/`: `doll.js` 0.47 MB, `doll_tex.js` 2.23 MB, `C8.js` 0.05 MB, `C8_light.js` 3.65 MB, `doll_light.js`, `hair_bun.js`). Also the old Envoi's Halcyon (`src/models/halcyon.js`, the Gloam Knight in dark armour, which zone 3's knight wears now as her stand-in) |
| `airship-game-in-aethermoor-` (`claude/ship-game-magpie-l8cbdn`, `1887984`) | Nothing (96 files, all ships and flight) |

**The one that fits Chris's words ("the knight model was being built"): Envoi's new Halcyon.** In this game's lore
the knight of light *is* Halcyon, Io's sister (`docs/lore/story-page.md`, answer 10). Chris decided on November 16
that Halcyon becomes "Moon Faire Io's simple body in a paladin outfit ... with her face repainted and a glow aura made
in code" (Envoi's `docs/project-notes/decisions.md`). That model was built the same day:

- **What it is:** Moon Faire's base doll (Io's body) wearing the paladin outfit at its light weight, about 50,000
  triangles, with a glow made in code: a pale glow round her, rising motes, a glowing outline, and a white light over
  her face that hides it.
- **How finished:** a model with motions, shown on Envoi's "Everyone Who Fights" page. **Her motions are Io's own**
  (the doll's), under Halcyon's move names: her blade strikes play Io's crescent and sickle, her stance is a kneel,
  her retreat a walk. Envoi's notes: "Built. Her moves are Io's for now; her fight is not rebuilt." So: a finished
  body and look, borrowed motions, not yet her own fight.
- **Its size:** about 6.4 MB of files, against Halcyon's stand-in model now (0.14 MB). Zone 3's page would grow by
  about 6.3 MB (it is 103.8 MB as the builder counts it). Most of it is the outfit's light model (3.65 MB) and the
  doll's textures (2.23 MB). If the townsfolk ever use the base doll too, the doll's 2.7 MB would be shared.
- **Pictures:** `knight/knight-*.png` in the scratchpad (see "Pictures"), made from Envoi's files on a scratch page
  (nothing copied into the repo).
- **What bringing it in would take:** copy the seven files (one line each in `assets/INDEX.csv`); check `doll.js`
  needs nothing more than Io's own helpers already here; give the knight `make: 'makeHalcyonPaladin'` in `foes.js`
  with her look (about 1.75 m tall); map her five moves (Io's own spells: Flame Bolt, Crescent Blades, Nightbloom
  Briars, Lunar Mend, Moonlight) to the doll's motions (it has Io's casts, so each could be Io's own motion for that
  spell, which would suit "she fights with Io's own spells"); load the files on zone 3's page and the fights lab.
  About half a day, and 6.3 MB on zone 3's page. **Not done: the hub asks Chris which knight he means.**

## Calls for Chris (each made as one line of data, or left as the game had it)

| # | What | Done here | The other choice |
|---|---|---|---|
| C1 | Form one's end | the story's: it cannot be sealed or ended, and its fight stops at 45% of its Life ("Nothing hurts it") | the plan's: it falls when its Life is gone or Kore seals it, and her Curtain Call brings the fallen up |
| C2 | The final form's numbers and its end | the story's: its own Life (8,000 at level 1), no blow ends it, its blows fall on Kore, only her Sealed Fate ends it | the plan's: form one's body with 20% more Life and 10% bigger blows, ended in the Curtain Call |
| C3 | Form one's helpers | two wraiths and two frost wisps (Envoi's page of this fight; zone 4's wisps) | the plan's "wraiths and brambles" (this game's brambles are foes always met alone); or, one day, the forty held Wardens of the story's proposal 14 |
| C4 | A party lost in the final form | comes back to the final form, as before (the card asks again) | the plan's: the whole fight again from before form one (one line in `land-fights.js`, under "For the hub") |
| C5 | A rest spot just outside the fight (the plan) | none added: the camp and Ede's inn in Misthollow | a rest spot by the dead Moonwell (`rests` in `zone-4.js`) |
| C6 | The card has no "not now" | once the fire is faced, a setting must be chosen | a fifth button that walks away from the well |
| C7 | When the fire breaks open | at the start of the final form's fight, after the coven's moment on the land, as Kore steps in front | at the end of form one's fight, as it stops |
| C8 | How fine the model is drawn | detail 1, 21,104 triangles (as Chris saw it and approved it) | detail 0.5, 10,724 triangles (what Envoi's page of this fight used); one number in `foes.js` |
| C9 | The card's words | stand-ins, except the four names (Moon Faire's own) | Chris's words |

## The sums: how often a level 20 coven wins the last fight (`node tools/last-fight-balance.mjs --n 300`)

One go is form one (stopped at 45%) and then the final form (ended by Kore's Sealed Fate); a go is won when both are.
300 goes each, the battle's own pretend players, the same seeds every run. Nothing was tuned.

| Setting | Careless | Attentive (careful) | Expert |
|---|---|---|---|
| As before today (level 20, no helpers, no refill) | 1% | 100% | 95% |
| **Easy** (level 20, with helpers, the refill) | 0% | 44% | 70% |
| **Medium** (level 21) | 0% | 14% | 29% |
| **Hard** (level 22) | 0% | 4% | 10% |
| **Crazy** (level 22.8) | 0% | 1% | 2% |

- **Almost every lost go is lost in form one**, to the fire and its four helpers (easy: 56% of the attentive player's
  goes, 30% of the expert's). With the refill, a coven that sees form one through nearly always wins the final form.
- **Against Moon Faire's own measures** (its plan, the same kinds of player, nothing found): attentive and careful 80%,
  3%, 0%, 0%; expert and careful 100%, 91%, 12%, 0%. Here easy is harder for both, medium is easier for the attentive
  player and harder for the expert, and hard and crazy come out about the same. The two games' rules differ (four
  witches here, this fight's own moves, the 45% stop), so the plan's numbers cannot be expected to carry over.
- A win takes about 8 to 11 minutes of play.

## For the hub

1. **Noctara is worn by nothing now.** `game/battle/models/noctara.js` (0.11 MB) can come out of zones 1 to 4, the
   fights lab, both creature labs and the battle page; with it `FOE_LOOK.noctara` and `makeNoctara` in `fights.js`
   (the old Envoi's finale is in `sim.js` and `battle-balance.mjs` only, which need no model). Not done here.
2. **A bug found by reading `screen.js` (not seen in a picture):** when a story fight ends by its foe stopping (the
   knight's, and the fire's form one), `retreatEnding` calls `recognize()`, the old Halcyon ambush's moment. For these
   fights `cfg.knowLines` is empty, so it shows the old Envoi's fallback words "Sol knows that stance." for about three
   seconds before the fight's own lines. The fix is the camera job's or the hub's file: skip `recognize()` and
   `learnStoop()` unless `cfg.knowLines` (and `cfg.stoopLines`) are given.
3. **If Chris takes the plan's rule for a lost final form (call C4):** in `game/encounters/land-fights.js`,
   `bigFight`, after `const r = await fight(...)`: when `!r.won && last`, delete `party.gates[g.id + '.' + k]` for
   each earlier form `k`. That is the fights-tune job's file.
4. **`docs/decisions.md`:** Chris, November 25: the fire's model is swapped for Moon Faire's ("The fire's the final big
   bad ... I would like that to be swapped out ... the final boss has already been built"), and the four settings
   ("you select easy, medium, or hard for the final boss, or crazy ... level 20, level 21, level 22, or level 22.8").
5. **`docs/questions.md`:** D6 (the knight and the fire wear stand-ins): the fire's half is answered; the knight's
   now asks which knight he means (part 3). Add calls C1 to C9.
6. **`docs/assets-list.md`:** the final boss's line is now "In the game (zone 4)".
7. The checks (`encounter-test`, `encounter-fights-test`) pick Easy on the card by themselves when they let the
   battle play (a test browser, `auto`): their old numbers hold. `CovenLastFight.preset` chooses another.

## Running log

- Nov 25 15:30 to 16:00: read, copied the model, made its player, first build and pictures.
- 16:00 to 17:00: task 3 built (the card, levels, helpers, refill), card checks passed at both sizes.
- 17:00 cut off by the usage limit; 20:55 on: the sums, the balance tools, zone 4 and battle built, the knight
  pictured, the land check passed (26 good).
- 23:30 cut off again; Nov 26 03:05: merged `main` (877ef05), the owed checks run once more (below).

## Checks still running

Started on November 26 at 03:01 in one queue (`run-e.sh`), each step under the shared lock; the queue was waiting for
the lock when this was written (another job held it from 03:32). Log: `/tmp/claude-0/-home-user-coven-of-the-moon-faire/41576e32-9c97-530a-9c7c-c502d1946878/scratchpad/last-foe/logs/run-e.log`.

1. `tools/battle-start-test.py builds/battle.html`.
2. Form two's stills on the fights lab (`pics2/2-*.png`: its change in four steps, idle, a blow, a call, being hit,
   sealed, its ending in three steps). To get there sooner, the still run lowers the final form's Life to a fifth
   after its first blow and call, so Kore's Fate meets it sooner; the whole final form played without that is the
   land check above (easy, won by Kore's Sealed Fate after 43 turns). When the queue ends, `run-f.sh` remakes
   `sheet-for-chris.jpg` with the final form's still in it (until then its bottom-left cell says it is being taken).
3. `tools/encounter-test.py builds/zone-4.html --long-only` (about an hour): the bramble and both fire forms on the
   land, with the card picked by itself (Easy).
