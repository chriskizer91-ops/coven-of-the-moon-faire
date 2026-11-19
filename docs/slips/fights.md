# fights: the new Envoi's battle, here, then grown to four witches

Branch: job/fights      Last commit: see the branch      Updated: November 18, 2026, night

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

Where the code is:

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
| `tools/battle-test.py` | plays fights to their end with no screen and checks them |
| `tools/battle-look.py` | pictures of the battle with no screen |
| `tools/battle-balance.mjs` | Envoi's balance check (its 51 targets) on the battle here |

## What Chris said here

- Nothing yet in this conversation.

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

Changed after copying (each change marked "Coven" in the file):

- `game/pages/battle.html` (from `battle/battle.html`): the paths to this repo's folders, no fonts or three.js from the web,
  the paintings' folder for the fight list, the title, and the frame-rate line.
- `tools/battle-balance.mjs` (from `tools/balance.mjs`): reads the battle from `game/battle/`.

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

**How the fights were played:** each plays itself (Envoi's expert player), sped up 40 times and drawn small (320 by 180)
at half sharpness, because with no graphics card a fight draws two or three frames a second. Each took two to four
minutes. The Play mode (you pick every move) is the same battle with the menus open; it was not driven by the check.

**Not checked:**

- **The frame rate.** Only Chris's laptop and phone can say. The page now shows it up top.
- **Any sound.** No session can hear one: the check only knows each sound was asked for and exists.
- Anything in motion: the pictures are stills.
- Touch on a real phone.

## Unfinished

- Step 2 (below).

## For the hub

- `game/art/arena/` and `game/art/backdrops/` are new folders this job made (Chris's battle paintings). Add them to the
  board's table under `fights`.
- `game/witches/io/` was used as it is: nothing in it needs changing for the battle.
