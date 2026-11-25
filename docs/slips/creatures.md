# creatures: six creatures from Aethermoor M7, brought into the battle and made their best

Branch: `job/creatures` (made from `job/fights`)      Updated: November 24, 2026

## Report for the hub

**Done.** Six creatures from Chris's Aethermoor M7 are in this game's battle, each made its best by the hub's eight
instructions, and put in the slots of zones 1 to 3 as data (the hub's proposal, not approved). Briarmaw was left out
(Chris, 10:52: every slot is taken, and the great bramble is lore of its own); nothing of it is left in the branch.
Zone 4's two slots are untouched (Chris, 10:31: two new creatures will take them).

### Each creature: what was changed, and what it measures

Heights are measured on the model standing (its highest point); triangles are the model's own; "MB" is what it adds
to a built page (its model and pictures, as text inside the page). The shared code adds 0.1 MB once.
"Brightness" is the mean brightness (0 to 255) of the pixels it covers, standing, on the Look screen under the
battle's own three lights: as it first came in, and now.

| Creature | Slot (proposal) | Height | Triangles | MB | Brightness before, now | Arrives | Let go (one word) | Standing loop | Its effect |
|---|---|---|---|---|---|---|---|---|---|
| The Rotwarden | zone 1, A, the heavy one | 2.60 m | 29,781 | 1.06 | 30, 35 | rises out of the ground | `root`: sinks back into the roots | 4 s: sways, heavy, the root arm swings | rot motes drifting from his chest |
| Glowcap | zone 1, B, the swarm (three) | 0.78 m | 17,284 | 0.61 | 51, 69 | pops up out of the ground | `root`: sinks back into the ground | 2.6 s: rocks foot to foot, gills pulse | spores rising from under its cap |
| Forge-Spark | zone 2, A, the one that weakens | 0.49 m | 13,659 | 0.72 | 47, 55 | flares into being | `gutter`: flickers and goes out | 2 s: bobs, its fire flickers three times | embers rising from its flame |
| Thornhound | zone 2, B, the pair (two) | 0.90 m | 20,249 | 0.91 | 22, 34 | walks in | `runOff`: turns tail and runs | 2.4 s: low, head down, weight paw to paw | golden pollen from its garland |
| Sapwight | zone 3, A, the armoured one | 2.06 m | 13,167 | 0.63 | 33, 39 | rises out of the ground | `wither`: falls, greys and fades | 3.4 s: creaks side to side | sap dripping from its head |
| The Rot-Stag | zone 3, B, the leaper | 2.00 m | 30,677 | 1.21 | 65, 84 | walks in | `runOff`: turns and bounds away | 3.6 s: shifts its weight, dips its antlers | pale motes round its crown |

Every one, through the one shared loader (`game/battle/models/m7/m7-foe.js`):
- **True to its look:** M7's colour sums on its own material (below); every picture M7 made for its phone set is used:
  colour, bump, shading, glow, and the shine and roughness picture where it has one (the Rotwarden, the Sapwight, the
  Glowcap). Its glow picture lights its own parts (the Glowcap's gills, the Forge-Spark's fire, the Sapwight's sap
  glow, eyes).
- **Reads at night:** a soft rim of light from the moon's side, a shadow on the ground, and a coloured glow on the
  ground where its design has a light of its own (the Glowcap green, the Forge-Spark and the Sapwight amber). In the
  Look screen every one is brighter than the witch beside it (the witch there is drawn without her own witch look,
  so that number says little); in the fight pictures none of them is brighter than the four witches.
- **Stands right:** facing the party, at M7's own size. Feet: its lowest point standing is between 2 cm under and
  2 cm over the ground for five; the Sapwight's lowest point is 11 cm under (M7's own model is so: a root tip below
  its foot), left as M7 made it.
- **Every move reads:** each move it keeps from M7 is one of its motions, with the moment its blow lands set on that
  motion (`acts` in its data); a charged blow is the wind-up of its big move, held, so it can be seen coming; it
  flinches (M7's Hit), braces (the walkers use M7's Bark Hide, begun), staggers (Hit, swaying), arrives in character
  and is let go, not killed (one word in its data: `wither`, `root`, `runOff` or `gutter`; also in a slot's `opts`).
- **Its moves in the slots** (names are M7's, STAND-INS in `game/encounters/words.js`, `slots.creatures`):
  Rotwarden: Rootlash, Grasping Roots (charged: "Lifts the great root"), Heartroot Bloom (mends).
  Glowcap: Headbutt, Spore Puff. Forge-Spark: Flare (slows), Lure (weakens), Singe, Flicker (evades).
  Thornhound: Bite, Lunge. Sapwight: Grasp, Sap Leech (charged: "Lurches forward"), Sweep.
  Rot-Stag: Antler Charge (the leap), Gore, Trample (charged: "Rears").

### Why they were darker

Three reasons, all of them the difference between M7's drawing and this battle's, put right once in the shared loader
and only on these creatures' own material (nothing else in the battle changes):
1. **The pictures' colour space.** M7 reads its colour pictures as sRGB, works the light out in linear numbers, then
   turns the result back to sRGB for the screen, with a film curve (ACES) on the way. This battle draws everything
   "as painted", with no such sums. Lit dimly, the two differ a lot: half light in M7's sums shows at about three
   quarters brightness; here it showed at half. Each creature's material now does M7's sums itself.
2. **A picture left unused, and no reflection.** The shine and roughness picture (ORM) was not used by the trial, and
   M7 lights its pages with a soft room reflected in shiny parts, which this battle has not got: so metal (the
   Rotwarden's plate, the Rot-Stag's gold crown) reflected nothing and went near black. Now the ORM picture is used,
   and each creature reflects a small night sky made in code (the moon's side a little brighter).
3. **The lights.** M7's lights are a bright studio key light (about 2.8) and a rim; this battle has three dim night
   lights. That one is right for a night scene and was left alone; the rim light from the moon's side gives back the
   shape.
Measured: under the battle's own lights each creature is now 1.0 to 1.5 times as bright as when it came in (the
table).

### The Thornhound's legs

**M7 had already mended them before this job began.** M7's default branch, November 24 at 02:13: "The thornhound
passes the stretch check at 120 frames: legs as pieces of their own (own coat), hind thighs ending above the knee, the
neck off the skull". The copy here is that one, and its `stretch.json` says it passes. This game's own check
(`tools/m7-stretch.mjs`, the same sums as M7's check, on this game's copy with this game's motions) found its hind
legs within the limit in every motion. It found two triangles over the limit on its back in Bite (1.32 times) and two
at the head in the Howl (1.30): those two motions bend the spine and the head a little less here (marked Coven in
`game/battle/models/m7/thornhound/thornhound.js`). Now none is over.

The same check found two triangles of the Rot-Stag's neck over in Gore (1.31): mended the same way (neck and head bend
a little less). It found the standing loops of the Rot-Stag and the Thornhound over at first (they bent the neck
after M7's helper joints had shared the turn out): the loops are now put on before the helper joints, and pass.

### What could not be mended

Nothing is left over the limit. **All six pass this game's no-stretching check in every motion** (standing, walking,
arriving, each move, hurt, brace, stagger; 48 moments each): `node tools/m7-stretch.mjs --frames 48`.
Two things the check notes but does not fail: one to three triangles "turned against their bone" in the Rotwarden's
root moves and the Rot-Stag's walk (in the pictures at full size nothing can be seen); and the Rotwarden and the
Sapwight are M7's **phone** models, which M7's own check never ran on (it ran on the bigger ones): they pass here.

### Size

The creatures' page, `creatures-lab.html`, is 19.3 MB built (the fights job's lab page is 14.1 MB: the six add
5.2 MB). Pictures are 1,024 px or less (most 512). Four creatures are under 1 MB each; the Rotwarden is 1.06 MB and
the Rot-Stag 1.21 MB (its colour picture is kept at 768 px for its white coat; at 512 it would be about 1.1 MB).
Each zone page that holds its two creatures grows by 1.5 to 1.9 MB.

### The sheets for Chris

Made again from the repo by **one command**, from the repo's top folder (about an hour here, without a graphics card):

    sh tools/creatures-pictures.sh

It builds `builds/creatures-lab.html`, takes every picture into `builds/creatures-pictures/`, and makes
`builds/creatures-pictures/sheets/<creature>.jpg` (one a creature: before beside after, on a laptop and on a phone,
and in a fight) and `sheets/row-1280x720.png` (all six standing in a row beside a witch). `builds/` is not kept in
git, so the sheets are not in the repo.

**Made on November 24, 14:30 to 15:00** (after Part 3, from the final page): on the machine this job ran on they are in
the job's scratch folder (`work/creatures/shots/r4/sheets/`: `glowcap.jpg`, `forge-spark.jpg`, `sapwight.jpg`,
`rotwarden.jpg`, `rotstag.jpg`, `thornhound.jpg`, `row-1280x720.png`, `row-412x880.png`). A new hub without that
folder makes them again with the command above. All fights there were drawn from the slots as committed: 0 page
errors. In the phone fight pictures the battle's camera is sometimes on the coven, not the creature.

### What is not checked

- **Nothing here can show motion or a frame rate.** Every picture is a still from a browser with no graphics card.
  How the motions look moving, how smooth the standing loops are, the frame rate on Chris's laptop and phone: only he
  can see those. The creatures' page shows its own frame rate on the Look screen, and the battle shows its own.
- The fights were played by the battle itself on the creatures' page (pictures at 3 and 6 seconds of each), not to
  their end, and not on a zone page: no zone page loads the creatures yet (below).
- That the models unpack quickly on a phone (here: 223 KB to 794 KB each; a few hundredths of a second).
- The browser on the phone must unzip (DecompressionStream: Chrome 80 and later, Safari 16.4 and later). If it cannot,
  the slot's plain stand-in is drawn instead.
- The look of the effects and the rim in motion; whether the night sky's reflection suits every arena.

### What the hub must do to bring `job/creatures` in

1. Merge `job/creatures` (it holds `job/fights`; the fights job's own branch must go in first, or with it).
   Files this job changed that are not its own: **`game/encounters/slots.js`** and **`game/encounters/words.js`**
   (the fights job's): only added lines and the six slots' lines, marked "creatures job" (Part 3, the last commit,
   `9f06d4f`, on its own). If the fights job changed those two files since, take both sides.
2. **Zone pages 1, 2 and 3:** add this block **before** `<script src="../encounters/slots.js"></script>`
   (slots.js asks whether the creatures are there when it loads; without the block a slot keeps its stand-in):

   ```
   <!-- creatures job: start -->
   <script src="../battle/models/m7/meshopt-decoder.js"></script>
   <script src="../battle/models/m7/m7-foe.js"></script>
   <script src="../battle/models/m7/moves/<file>.js"></script>          (the zone's two: see below)
   <script src="../battle/models/m7/<creature>/light.js"></script>
   <script src="../battle/models/m7/<creature>/<creature>.js"></script>  (both lines for each of the zone's two)
   <!-- creatures job: end -->
   ```
   Zone 1: moves `walkers.js` and `mushroom.js`; creatures `rotwarden`, `glowcap`.
   Zone 2: moves `spark.js` and `hound.js`; creatures `forge-spark`, `thornhound`.
   Zone 3: moves `walkers.js` and `stag.js`; creatures `sapwight`, `rotstag`.
   (A page may load all six: `game/pages/creatures-lab.html` has the whole block.)
3. Then on each: `python3 tools/encounter-test.py builds/zone-N.html`, and a fight of each slot on the page.
4. `assets/INDEX.csv` has 34 new lines (source_repo `aethermoor-m7-`, branch `claude/brave-davinci-790efm`, commit
   `2070b57`). Aethermoor M7 is not yet named as a source in `CLAUDE.md` (it names three); Chris made it read-only
   source on November 23 (`docs/decisions.md`): the hub may add it.
5. `game/battle/models/m7/meshopt-decoder.js` is not from Chris's repos: meshoptimizer's decoder (MIT licence), as
   M7's three.js package carries it. Its licence lines name its author's address, as the licence asks; one web address
   was taken out (the builder stops at them). It has no line in `assets/INDEX.csv`: the hub may want one.
6. Briarmaw's files were in this branch's first commit and taken out in the second; if the history should not hold
   them, squash the branch when merging.
7. The board, for the table: new files `game/battle/models/m7/` (all), `game/pages/creatures-lab.html`,
   `tools/m7-pack.py`, `tools/m7-stretch.mjs`, `tools/creatures-look.py`, `tools/creatures-sheet.py`,
   `tools/creatures-pictures.sh`. The slots now say B is on in zones 1 to 3; `node tools/encounter-balance.mjs`
   says "every target met" with them so (with A on, a new creature is one fight in 5 to 7; with A and B, one in 3).

### What is Chris's to decide

- Where each creature lives (every slot line is the hub's proposal, not approved).
- Their names in this game and their moves' names (all STAND-INS: their M7 names).
- How each is let go: one word each (`letGo` in its data file): the Rotwarden and the Glowcap root, the Forge-Spark
  gutters out, the Thornhound and the Rot-Stag run off, the Sapwight withers. (The hub's proposal: let go, not killed.)
- The Forge-Spark has no M7 move that weakens: its Lure (from M7's moves file, a slow bob away) does that job here.
- The Rot-Stag's colour picture at 768 px (1.21 MB) or at 512 (about 1.1 MB).
- Whether the B slots should be on (two new creatures in each of zones 1 to 3, one fight in 3 instead of 1 in 6).

## What was built

- `game/battle/models/m7/`: `m7-foe.js` (the shared loader and join, new), `meshopt-decoder.js`, `moves/` (M7's
  moves files, made scripts, marked Coven), one folder a creature (`light.js`: its model; its pictures; `<name>.js`: its
  data: which move plays for which motion and when its blows land, how it arrives and is let go, its standing loop,
  its effect, its mends), `creatures-lab.js` and `lab-words.js` (the page's own code and words).
- `game/pages/creatures-lab.html`: the six. Look (it stands, turns, and plays each motion by its own button), Play and
  Watch (a fight in its slot).
- `tools/m7-pack.py` (a model into a script), `tools/m7-stretch.mjs` (the no-stretching check, no screen needed, half a
  second a creature), `tools/creatures-look.py` (pictures), `tools/creatures-sheet.py` (Chris's sheets),
  `tools/creatures-pictures.sh` (all of it, one command).
- Part 3: the six slots of zones 1 to 3 in `game/encounters/slots.js`, their words in `game/encounters/words.js`.

## What Chris said here

- November 24, 09:25: the seven to bring over, by how they look, improved by sub-agents with the hub's instructions.
- November 24, 10:31 (through the hub): zone 4's slots wait for two new creatures; the Rotwarden keeps its name.
- November 24, 10:52 (through the hub): Briarmaw is left out of this game (every slot is taken; the great bramble is
  its own lore).

## What was copied in

- From Aethermoor M7's default branch `claude/brave-davinci-790efm`, commit `2070b57` (the newest, November 24,
  12:42), read only: for each creature its light model and bones (packed by `tools/m7-pack.py`, bytes unchanged), its
  pictures (phone size; some made smaller here), and the moves files they use. 34 lines in `assets/INDEX.csv`.
- M7's job branches `job/foe-hd` and `job/foes-beasts` hold OLDER versions of five of the seven; nothing was taken
  from them.

## What was checked, and how

| Check | Result |
|---|---|
| `node tools/m7-stretch.mjs --frames 48` | all six pass in every motion (after the three mends above) |
| `node tools/encounter-balance.mjs` with the six slots on | **every target met** |
| `python3 tools/creatures-look.py` (pictures: standing before and after at both sizes, every motion from four sides, the row, fights) | 0 page errors |
| the built page reaches nothing outside itself (`tools/build.py`) | yes |

## The job's calls (each is one line of data)

- Pictures made smaller here: most to 512 px; the Rotwarden's colour kept at 768, the Rot-Stag's at 768.
- The shared look numbers (`M7.LOOK` in `m7-foe.js`): the film curve on, exposure 1.0, the night sky's reflection 0.55,
  the rim 0.45. The Thornhound's coat lifted a quarter (`exposure: 1.25`); the Rotwarden's plate half as metallic
  (`metalK: 0.55`) so it keeps its green and gold.
- Each creature's arrival, standing loop, effect, and which of its moves plays each slot move.
- The commit lines end with this sub-agent's own model name (Opus 5.5), not the repo's usual one.
