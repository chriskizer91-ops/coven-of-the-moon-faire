# creatures: the seven creatures from Aethermoor M7, brought into the battle and made their best

Branch: job/creatures      Updated: November 24, 2026 (in progress)

Made from `job/fights`. A sub-agent of the hub's (Opus 5.5). The brief: bring the seven creatures Chris chose
(November 24, 09:25: the Rot-Stag, the Thornhound, the Rotwarden, the Sapwight, Briarmaw, the Forge-Spark, the
Glowcap) into this game's battle, with the hub's eight instructions for each.

## What it built (so far)

- **One way in for all seven**, `game/battle/models/m7/`:
  - `m7-foe.js`: the shared loader and join (new, made here from the fights job's trial). `makeM7Foe({ kind })` gives
    the battle a foe's model, as `stand-in.js` does.
  - `meshopt-decoder.js`: the small library that unpacks M7's packed models.
  - `moves/`: M7's own moves files, made scripts (marked Coven).
  - `<creature>/`: each creature's model (`light.js`), its pictures, and its data (`<creature>.js`: which move plays
    for which motion, when a blow lands, how it arrives, how it is let go, its standing loop, its effect).
  - `proposal.js`: the hub's proposal of which slot each takes (data; NOT APPROVED).
- **`game/pages/creatures-lab.html`**: the seven, each to Look at (standing, turned, every motion one by one) and to
  fight where it would be met.
- `tools/m7-pack.py` (packs a model into a script), `tools/creatures-look.py` (pictures, with no screen).

## What was copied in

- From Aethermoor M7, its default branch `claude/brave-davinci-790efm`, commit `2070b57` (the newest on November
  24, 12:42). Each file has its line in `assets/INDEX.csv` (40 lines).
- The job branches `job/foe-hd` and `job/foes-beasts` of M7 hold OLDER versions of five of the seven (the default
  branch's are newer for every one), so nothing was taken from them.
- `meshopt-decoder.js` is not from any of Chris's repos: it is meshoptimizer's decoder (MIT licence), the one M7's
  three.js package carries, as the fights job's trial used it. One web address was taken out of a comment. It has no
  line in `assets/INDEX.csv` (the hub may want one).
