# fights: the new Envoi's battle, here, then grown to four witches

Branch: job/fights      Last commit: see the branch      Updated: November 19, 2026, morning (step 3)

## What it built

### Step 1: the new Envoi's battle, running here (done)

One page: **`game/pages/battle.html`**. Build it with `python3 tools/build.py game/pages/battle.html`; the file to open
is `builds/battle.html` (10.0 MB at step 1, everything inside, no internet needed).

- Every fight the new Envoi's battle page has, in its arenas, at any level: the first fight (Io alone, on the Night
  square's painting), the wilds of bands 1 to 4, the Bramble Horror in its four forms, the Bramble Colossus, and gate 5
  (the great wraith at Bogmire). The same list, the same choices of level, foes and weather, the same Play and Watch.
- Io and Kore at their lightest, every move, Lunara, Envoi and the Elderwood Guardian, Kore's Fate, both trance glows.
- The 155 sounds and the music (the six dark pieces), made in code as in Envoi. Chris's song Herbal Decay and its
  knob (Song, up top) are there too, starting at 0 as he left it.
- The Flipbook button, the sharpness button, the frame-rate cap button, Sound on/off.
- **New here:** the frame rate the fight is really drawn at, always shown up top beside the title ("60 frames a second"),
  counted from the frames the battle draws.

### Step 2: four witches (done)

The same page, **`game/pages/battle.html`**, now 17.5 MB: all four witches of the coven in every fight but the first.

- **Europa, the Fox** and **Callisto, the Ranger** join Io and Kore, at their lightest (Moon Faire's light models), with
  Moon Faire's moves and numbers (its approved engine), set on this battle's scale the way Io's and Kore's were.
- **The party of four** stands two by two (Io and Kore in front, Europa and Callisto a step behind), and its window shows
  the four two by two, so it is no taller than it was for two.
- **The first fight is still Io's alone** (Envoi's opening: the wraith on the bridge). Job's call; see "For the hub".
- **One call for the land:** `CovenBattle.start({ arena, foes, partyLevel, foeLevel, party })` in
  `game/battle/start.js` (below).

Europa's moves (numbers at level 1; everything grows 20% a level, as every move does):

| Move | What it does | MP |
|---|---|---|
| Hemline Fangs | one cut with her shears, 275 | 0 |
| Stitch | blue fire through one foe, 340 | 16 |
| Pins and Needles | 175 to every foe | 24 |
| Same Cloth | the foe's next blow on one of the party lands on the foe itself, at double, and gives it Fate; then 2 turns' rest | 36 |
| Crazy Quilt | every small foe loses its next 2 moves (a wraith 1), and its blows fall on another foe; the great ones are not fooled; then 3 turns' rest | 40 |
| Borrowed Face | a ghost of her takes the next 2 blows aimed at one of the party, before Kore can catch them | 20 |
| Slip Stitch | runs from a wild fight, as Flee does | 0 |

Europa: 1,270 HP and 100 MP at level 1, a turn every 2.16 s. Callisto: 1,600 HP, no MP, a turn every 1.92 s.

| Callisto's move | What it does |
|---|---|
| Moonsteel Draw | one arrow, 330 |
| The Gem | two arrows of 345 at the foe chosen (if it falls, the second finds the weakest); then 2 turns before the gem is lit again |
| Flee | as for the others |

How Moon Faire's numbers became these (job's call, written in `rules.js`): HP is Moon Faire's times Io's 3.33; turns
come as much quicker than Io's as they do there; a Moon Faire blow of n is about 265 x (n / 40)^0.166 here (its plain
blows are Io's Harvest Crescent, its spells about Io's Thornwake); MP costs are about twice Moon Faire's, as Io's are.

**The party of four and the foes.** Envoi's foes were set for two witches. Against four, each foe has more HP and hits
harder (`rules.js`, `PARTY_FOES`), so a fight of four plays like Envoi's fight of two:

| Foe | HP | A blow on one witch | A blow on the whole party |
|---|---|---|---|
| wisps, frost wisps, wraiths | x 1.2 | x 2 | x 1.1 |
| the great wraith | x 2 | x 2 | x 1.1 |
| the Bramble Horror (three forms) | x 2.2 | x 2 | x 1.1 |
| the Ancient Crown | x 2 | x 2 | x 1.4 |
| the Bramble Colossus | x 2 | x 1.6 | x 1.7 |
| Halcyon | x 1.7 | x 1.6 | x 0.8 |
| Noctara | x 1.8 | x 1.6 | x 0.8 |

Their experience and shards are unchanged, so the number of fights to a level is Envoi's.

**The call for the land** (`game/battle/start.js`, loaded by the battle page):

```
const r = await CovenBattle.start({ arena: 'eldergrove', foes: ['wisp', 'wisp'], partyLevel: 5, foeLevel: 6,
                                    party: { io: { hp, mp }, jester: { hp, mp }, fox: { hp, mp }, ranger: { hp } } });
// r = { result: 'won' | 'lost' | 'fled', won, xp, shards, party: { io: { hp, max, mp, mpMax }, jester, fox, ranger }, arena, foes, tag }
```

The fight covers the page in a layer of its own and answers when the player leaves its end card. Give `r.party` to the
next call to carry HP and MP on. It can also take `foes: 'roll'` (a pack as the band rolls one), `foeLevel: [low, high]`,
`band`, `herbs`, `flags`, `weather`, `canFlee`, `kind` (`'greatWraith'` or `'dawnroost'`, the two gates the battle has),
`auto` (for tests) and `tag`. The full list is at the top of the file.

New files at step 2:

| File | What it is |
|---|---|
| `game/witches/europa/` | Europa's light models and textures (copied), and `moon-fox.js`, the face the battle uses (new) |
| `game/witches/callisto/` | Callisto's light models and textures (copied), and `moon-ranger.js`, the face the battle uses (new) |
| `game/battle/start.js` | the call for the land (new) |
| `tools/battle-testers.mjs` | Moon Faire's eight pretend players, on this battle (new) |
| `tools/battle-start-test.py` | checks the call for the land (new) |

### Step 3: fights on the land (done)

The zone-1 page, **`game/pages/zone-1.html`**, now has the fights joined on. Build it with
`python3 tools/build.py game/pages/zone-1.html`: **83.5 MB, 2.0 MB more than main's 81.5 MB** (the witches' models were
already in; the battle's code, foes, arenas and sound are what was added).

- **The party** (`game/party/party.js`): the four witches' level, experience, HP and MP, the shards and the herbs, in
  one object kept in the browser under one key (`coven.party`), so closing the page loses nothing. Top level 20. A new
  party is level 1, everyone whole, no shards, three of each of the battle's five herbs (as Envoi's game began).
- **Meetings in the wild** (`game/encounters/meetings.js`, numbers in `game/encounters/zone-1.js`): unseen; as she walks
  the wilds a fight sometimes begins, in the nearest arena (Wickhollow's river glade, or Bogmire's boardwalk). Never in a
  town or place, in the camp, or within 25 m of one; never within 70 m of the last fight.
- **The join** (`game/encounters/land-fights.js`): the land pauses, the fight plays over it in its own layer, and the
  answer is carried back: experience and levels, each witch's HP and MP, herbs used, shards. Won or run from: she walks
  on from where she stood. Lost: the coven wakes at the Moon Faire's camp, healed (job's call, as the hub suggested).
- **The herbs Io picks on the land** go into the party's herbs and are used in fights beside the rest (Chris's word).
- **Rest at the camp:** in the camp's meadow, a **Rest** button shows beside the party's button while anyone is hurt.
  Tap it: everyone whole.
- **On the screen:** one small button, bottom right: "Level 3" and one bar for the party's health. Tap it for the four
  witches (HP and MP), the experience to the next level, the shards, the herbs, Rest, and Start afresh (two taps).
- **The gate** (a proposal, no story): the great wraith waits 20 m up the road out of Bogmire's north gate, toward the
  fen's dark heart. At level 5 a button there offers the fight, in Bogmire's arena; won once, it is not offered again.
  Below level 5 a line says something waits there, too strong yet.
- The fight shows its own frame rate, small in its top right corner.

How often, and how strong (all in `game/encounters/zone-1.js`, easy to change):

| Where she is | One meeting every (on average) | Foes' levels | Mostly |
|---|---|---|---|
| The woods round Wickhollow (within 420 m) | 260 m | 1 to 3 | two wisps |
| The thorn country | 170 m | 2 to 4 | a wraith, a wisp and a wraith |
| The fen | 160 m | 3 to 5 | three wisps, a wisp and a wraith |
| The long road | 220 m | 3 to 5 | a wisp and a wraith |
| The rest of the wilds | 200 m | 2 to 5 | a mix |

A foe is never more than one level above the party. Where these numbers come from (job's calls):

- **45 fights in zone 1.** A first time through walks about 9 km of wilds: one way, the camp to Wickhollow, the jetty and
  back, the cottage and back, to the Thornwood, on to Bogmire, to the fen's heart and back, is about 4.2 km outside the
  places; back to the camp to rest and out again to the gate is 4.6 km more. 45 in 9 km is one every 200 m.
- **What a fight is worth.** In Envoi's battle the party goes from level 1 to 5 in about 12 wild fights. For about 45,
  a fight in zone 1 gives 0.27 of the experience and shards it gives in Envoi's battle (`reward`). The levels job should
  look at this with the whole game's plan.

What the land's check counted (`tools/encounter-test.py`):

| Ground | Walked | Meetings | One every |
|---|---|---|---|
| woods round Wickhollow | 20 km | 84 | 239 m (data: 260) |
| the wilds | 20 km | 106 | 189 m (data: 200) |
| thorn country | 20 km | 113 | 177 m (data: 170) |
| the fen | 20 km | 125 | 160 m (data: 160) |
| the long road | 20 km | 86 | 235 m (data: 220) |

**Fights from level 1 to 5:** about **46** (8.5, 10.5, 11.8 and 15.0 for each level, the battle's own attentive player).

Where the code is (all three steps):

| Folder | What it is |
|---|---|
| `game/battle/` | rules, engine, simulator, screen and its look, the fights; the trance glow, the witches' look, the song bed |
| `game/battle/stage/` | the nine places a fight can be (the first Envoi's arenas and the Night square) |
| `game/battle/models/` | the first Envoi's foes and summons: wraith, wisp, bramble, colossus, Halcyon, Noctara, Lunara, Envoi |
| `game/battle/fx/` | the first Envoi's effects, battlefield marks and weather, live arena ground, Io's spell effects |
| `game/sound/` | the battle's sounds and music (`sound.js`), and Chris's song with the file that names it |
| `game/witches/kore/` | Kore's model, textures, light weights, and the face the battle uses |
| `game/witches/io/` | Io: used as it was, not copied again |
| `game/art/arena/`, `game/art/backdrops/` | Chris's eight battle paintings, and the Night square's painting |
| `game/party/` | the party (`party.js`) and its button on the land (`party-view.js`) |
| `game/encounters/` | zone 1's meetings (`zone-1.js`, numbers only), when they come (`meetings.js`), the join (`land-fights.js`) |
| `game/battle/screen-layer.css` | the battle's look for its layer on the land: made by `tools/battle-scope-css.py` from `screen.css` |
| `tools/encounter-test.py` | the land's fights, checked with no screen |
| `tools/battle-test.py` | plays fights to their end with no screen and checks them |
| `tools/battle-look.py` | pictures of the battle with no screen |
| `tools/battle-balance.mjs` | Envoi's balance check (its 51 targets) on the battle here |

## What Chris said here

- November 19, morning: steps 1 and 2 are good; step 3 is fights on the land (milestone 3), in this order: the party
  kept when the page is closed; unseen meetings in the wild, in the nearest arena, zone 1 at levels 1 to 5, about 45
  fights in zone 1; the join (the land pauses, the fight plays over it, the result comes back); rest at the Moon Faire's
  camp; a small party display that keeps the phone screen clear. (With the hub's starter text on the board.)

## What was copied in

47 lines in `assets/INDEX.csv` at step 1, all from `envoi-on-the-longest-night` at `d450c3f`: the battle's 16 files,
Kore's 4, the 9 places, the 8 models, the 4 effects files, the 9 paintings, Chris's song and its file, and Envoi's
balance check. Only what `moon-faire-witches/battle/battle.html` loads.

Job's calls about what to copy:

- **`src/kit.js` was not copied.** The starter text names it, but the battle page does not load it (it is the stage the
  spell book and the line-up use).
- **Kore is `witches/folk/jester_kit.js`, not `witches/jester_lod.js`.** The battle page loads the first; Envoi's notes say
  it builds her the same as the second. Only one was copied.
- **Io's files were used from `game/witches/io/`.** All seven are byte for byte the battle's own, and `io_plus.js` is made
  by the hub's `tools/make-io.mjs` exactly as Envoi's `patch-io.mjs` makes it.
- **The paintings went in `game/art/arena/` and `game/art/backdrops/`.** The builder reads `"art/..."` paths from
  `game/art/`, so the arena files work unchanged. Neither folder is on the board's table; nobody else uses them.
- **Chris's song (2.4 MB) came too,** because the page loads it and shows its knob. It stays off (the knob starts at 0).
- **Left out:** the two Google fonts (the page uses the device's own, as the first test does) and three.js from the web
  (the repo's own r128 is the same version).

At step 2, 4 more lines, from `moon-faire` at `6371714`: Europa's and Callisto's light models and textures
(`game/fight/witches/fox_lod.js`, `fox_tex.js`, `ranger_lod.js`, `ranger_tex.js`). Their level settings were already
here, in Io's `witch_levels.js`, which is the same file as Moon Faire's.

Changed after copying (each change marked "Coven" in the file):

- `game/pages/battle.html` (from `battle/battle.html`): the paths to this repo's folders, no fonts or three.js from the web,
  the paintings' folder for the fight list, the title, and the frame-rate line.
- `tools/battle-balance.mjs` (from `tools/balance.mjs`): reads the battle from `game/battle/`; `--two` plays Envoi's
  party of two.
- Step 2, for the four witches:
  - `game/battle/rules.js`: Europa's and Callisto's moves and numbers; the party of four; the foes' numbers against four.
  - `game/battle/engine.js`: their moves (Same Cloth, Crazy Quilt, Borrowed Face, the Gem's rest); foes' HP and blows by
    the size of the party; no trance for the two who have none.
  - `game/battle/sim.js`: the party of four in every fight but the first; how each play style plays Europa and Callisto
    (as Moon Faire's engine and testers play them); with four, the attentive player walks away from the Colossus when the
    party's average HP is low (with two: when both are low, as before).
  - `game/battle/screen.js` and `screen.css`: their moves on the stage, their menus (Europa: Hemline Fangs, Chaos; Callisto:
    Moonsteel Draw, The Gem), their words on the field, the window two by two, the Gem's state in place of MP.
  - `game/battle/fights.js`: where they stand; each witch's HP and MP coming in; an arena and a foe level asked for
    (for the land's call).
- Step 3, for the land:
  - `game/battle/screen.js`: it looks for its own elements inside its own stage first. On the land its layer sits on the
    land's page, which has ids of its own (`fps`, `nums`); before this, the battle took the land's frame-rate line for
    its own button and stopped.
  - `game/battle/start.js` (new at step 2): the party's experience for the end card, what a fight is worth (`reward`),
    the herbs used in the answer, and the frame rate in the layer's corner.

## What was checked, and how

All with a browser that has no screen and no graphics card, and with Node for the balance.

```
python3 tools/build.py game/pages/battle.html
python3 tools/battle-test.py builds/battle.html --every      # every fight, every pack of foes, every Horror form, to its end
node tools/battle-balance.mjs                                # Envoi's 51 targets
python3 tools/battle-look.py builds/battle.html <folder>     # pictures
```

| Check | Result |
|---|---|
| Every fight on the list started and played to its end | **28 of 28**: the 8 fights on the list, plus each of the 16 packs of foes the four bands can bring and each of the Horror's four forms. 27 won and 1 fled (the Colossus at level 18, as Envoi's expert does when it goes badly) |
| Page errors, from the first fight to the last | **0** |
| Every sound a fight asked for exists, no sound errors | yes, in all 28 (between 7 and 533 sounds a fight, up to 67 different ones) |
| Envoi's balance check, here | **44 of 51**, the same 44 as on Envoi's main, line for line (the two printouts are identical) |
| The file reaches outside itself | no: the builder stops if it would |

Step 2, the same checks, and two more:

```
node tools/battle-testers.mjs                 # Moon Faire's eight pretend players
python3 tools/battle-start-test.py builds/battle.html
```

| Check | Result |
|---|---|
| Every fight on the list started and played to its end, with four | **8 of 8**: 7 won, 1 fled (the Bramble Horror two levels up, as the expert does) |
| Page errors | **0** |
| Every sound asked for exists | yes, in all 8 |
| Envoi's balance check, party of four | **49 of 51** (Envoi's own battle, party of two: 44) |
| The same check, party of two (`--two`) | still **44 of 51**, as on Envoi's main |
| Moon Faire's eight pretend players | **every check passed**: all eight finish every fight; the more attentive wins more, in both styles; an ordinary wild fight leaves 76% to 90% of the party's HP and 71% to 81% of its MP |
| The call for the land | **every check passed**: it answered won, the experience (158) and the four witches' HP and MP; the witches began with the HP and MP they were given and the foes at the level asked; a second call carrying the party on worked; 0 page errors |

The two of the 51 still missed, with four:

- **Dawnroost (gate 10), the attentive player:** wins 97%, the target says at most 96%. A hair too easy.
- **The finale, the attentive player:** wins 59%, the target says 2% to 10%. With four, the attentive player is nearly as
  good as the expert there. The finale is not in the battle yet (Envoi left Halcyon's and Noctara's fights out until
  their stories are rebuilt without Sol, and Moon Faire's big bad is to replace Noctara), so it is left for that work.

What the eight players found that Moon Faire's did not (reported by the check, not failed):

- **Pressing any lit button beats Envoi's careless player** in 15 of the 28 fights. Envoi's careless player mostly
  attacks and seldom heals; the button-masher also uses Lunara, the summons and Europa's tools. It is so in Envoi's own
  battle too. The careless player is one of the 51 targets' players, so it was not changed.
- **Bold beats careful against a great foe alone** (the Bramble Horrors, the Colossus): healing later and hitting more
  wins more there, partly because Io's Thornwake holds a lone foe, so hitting is also defending. In Envoi's own battle
  this is already so against the Colossus. Moon Faire found bold simply weaker, and planned to rework the two styles
  around herbs. Changing the foes' numbers did not undo it, so it is a question of how healing should pay, for Chris.

Step 3:

```
python3 tools/build.py game/pages/zone-1.html
python3 tools/encounter-test.py builds/zone-1.html
python3 tools/zone-test.py builds/zone-1.html
```

| Check | Result |
|---|---|
| The fights on the land (`encounter-test.py`) | **every check passed** (27 checks), 0 page errors; the page starts in 12 s |
| The land's own check (`zone-test.py`) | **all passed**, with the fights joined on |
| The battle page still builds and plays | yes: 17.5 MB; the first fight and band 1 to their end, 0 page errors |
| Envoi's 51 targets, Moon Faire's eight players | unchanged: **49 of 51**; every check passed |

**How it was checked:** a meeting was forced in the woods east of Wickhollow and played by the battle itself (sped up):
the land was walking, then paused, then walking again; the fight's layer came and went; the experience, shards, each
witch's HP and the count of fights were carried back and kept in the browser. A lost fight (the party sent in at 1 HP)
woke the coven at the camp, healed. A herb picked went into the party's herbs. Rest showed only at the camp and made
everyone whole. The gate's button showed only at level 5. After closing and opening the page, the party was the same.

**How the fights were played:** each plays itself (Envoi's expert player), sped up 40 times and drawn small (320 by 180)
at half sharpness, because with no graphics card a fight draws two or three frames a second. Each took two to four
minutes. The Play mode (you pick every move) is the same battle with the menus open; it was not driven by the check.

**Not checked:**

- **The frame rate.** Only Chris's laptop and phone can say. The page now shows it up top.
- **Any sound.** No session can hear one: the check only knows each sound was asked for and exists.
- Anything in motion: the pictures are stills.
- Touch on a real phone.

## Unfinished, and known rough spots

Step 3:

- **Not checked by playing:** a meeting coming by itself while walking with a thumb or keys (the check counts the
  ground by numbers, and forces the fights it plays); the tap targets on a real phone; the frame rate in a fight over the
  land (the land stops drawing while the fight is up, so it should be the battle page's own).
- **A meeting begins at once,** with no warning on the land; the battle's own short opening then plays.
- **The party's panel, when open, covers the two round buttons in the top right** on a phone held sideways. Tap the
  party's button again to close it.
- **Where she stands after a lost fight** is a few metres south of the camp's well; not where she stood.
- **The gate fight** is a spot and a button, nothing more: no sign on the land, no words. Chris's to place and dress.
- **Chris's song is not on the land** (it was off anyway); the battle page keeps it.
- **The party is not tied to a save of where she is:** after closing the page, she starts at the camp, with her party.

- **Europa and Callisto have no sounds of their own.** Their moves borrow the battle's (a swing and a thorn's snap for
  Hemline Fangs, witch-fire for Stitch, moon blades for the pins and for Callisto's arrows). Chris's to change.
- **Two of Europa's moves borrow another move of hers,** as in Moon Faire's own fight: Stitch plays Blue Mischief, Pins and
  Needles plays the Moon's Little Lie.
- **Europa has no move for being hit;** she rocks back a little, as in Moon Faire. Callisto has her own (hit).
- **Neither has a trance yet.** Their trance gauge is hidden. Io and Kore keep theirs.
- **The Gem's two arrows both go at the foe chosen** (Moon Faire lets each be aimed); if it falls, the second finds the
  weakest. Same Cloth works on any foe's next blow on one witch (Moon Faire's needs a Heavy or Crush showing on its turn
  bar, which this battle does not have). Both job's calls.
- **Fights with four take longer:** a wild pack is 0.8 to 2.2 minutes for the attentive player (Envoi's two: 0.6 to 1.4),
  inside Envoi's target of 0.6 to 2.2 (2.5 on entering a band). Four witches take four turns a round.
- **Crazy Quilt's quilt falls in front of Europa,** not over the foes (it is her model's own spell, built to land a set way
  in front of her). Seen in a still; not fixed.
- The camera was not changed for four; in the stills they stand in a slanting line, all in view.

## For the hub

- `game/art/arena/` and `game/art/backdrops/` are new folders this job made (Chris's battle paintings). Add them to the
  board's table under `fights`.
- `game/witches/io/` was used as it is: nothing in it needs changing for the battle.
- Add `game/witches/europa/` and `game/witches/callisto/` (already on the table) and `game/battle/start.js` to `fights`.
- **The first fight is still Io alone.** Chris said all four are in the party from the start; Envoi's opening fight is Io
  alone against the wraith on the bridge. The job left it so (a small call), but the opening is his: if the game opens
  at the Faire's camp with all four, this fight becomes four against one wraith, or goes. A question for him.
- **For joining the battle to the land:** the land's page loads what `game/pages/battle.html` loads (three.js, the
  places, the models, the four witches, the battle, the sound, `fights.js`, `start.js`) and `game/battle/screen.css`.
  Note: `screen.css` styles the page's `body` and `header` as the battle page's (a column, no scrolling, its colours);
  the land page will want those rules kept to the battle's layer. `start.js` makes its own `#stage` inside its layer and
  gives back the land's own `#stage`, if it has one, afterwards.
- **The levels job:** the four witches' experience is Envoi's, per fight. Chris wants about 180 fights to level 20;
  Envoi's plan is about 79 wild fights from 2 to 20 plus the gates.
- **Step 3, for the hub:**
  - The land's checks (`?test`) get no meetings unless a check asks (job's call), so `zone-test.py` is never interrupted.
  - After a fight, the party's herbs and the land's bag are the same count; the job then redraws the page's herb line in
    the top left (`#bag`) the same way the page does. A hook from the page for this would be cleaner.
  - The page's `#nums` button and the battle's damage numbers share an id; `screen-layer.css` undoes the button's look
    inside the battle's layer. Renaming one of them some day would be tidier (the battle's is the job's to rename if
    the hub prefers).
  - Every arena and foe model is on the land (2 MB), so `CovenBattle.start()` can be used for zones 2 to 4 as they come.
  - What a fight is worth on the land (`reward: 0.27` in `game/encounters/zone-1.js`) is the levels job's to settle.
- Chris's say wanted (for `docs/questions.md`): the two borrowed moves and the borrowed sounds; whether Europa and
  Callisto get trances; whether bold play should beat careful play against a great foe alone.
