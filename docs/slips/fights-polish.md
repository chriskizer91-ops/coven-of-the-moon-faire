# fights-polish: a fight that fills an upright phone, and four small repairs

Branch: `job/fights-polish` (made from `main` at 62a9e42)      Updated: November 25, 2026

## Report for the hub

Done by a sub-agent of the hub's (Opus 5.5, high). Nobody could be asked while it worked: its calls are marked
"my call", each with the other choice.

### What was changed, file by file (every change has a comment beginning "fights-polish:")

- **`game/battle/screen.js`** (the battle's screen):
  - **The camera's framing numbers are in one place now, `FRAMING`**, just above the director (`const DIR`). A laptop
    and a phone on its side keep exactly the numbers they had (the resting shot: 50° round from behind the party,
    7° up, a 36° lens; the wide shot: 48°, 9°, 36°; a twentieth of the width kept clear at each side). **A screen
    narrower than 0.9 times its height (an upright phone) uses `FRAMING.tall`:** 10° round from behind the party,
    22° up, a 40° lens (the wide shot 12° and 24°); the shot is moved onto the middle of what it frames and fitted
    again, three times (`centre: 3`), so the one farthest out no longer sets how far off the camera stands; 0.84 of
    the half-width may be used (`edge`); and the strip under the foes' name box at the top left is kept clear
    (`clearTop: 8` px under it). So on an upright phone the party stands big near the bottom with their backs to us,
    and the foes beyond them higher up, above the party's heads.
  - The name box's height is read at the moment a shot is fitted (and the resting shot is fitted again when it
    changes), because a frame of another height is a narrower view across: before this, a foe at the side went out.
  - **On an upright phone the intro uses the moving camera** as the foes rise (the painter's fixed camera shows only a
    narrow slice of the wide painting there, and the party was cut at its edge), and the intro's first line, still on
    the painting, has its slice centred on the party instead of on the painting's middle (Io stood outside it). It then
    glides on into the fight instead of cutting. Laptop and side-on: as before. **My call**; the other choice was to
    keep the painting's slice for the whole intro on a phone.
  - A test hook, `window.__battle.boxes()`: where each fighter stands on the screen (the box round its posed body, its
    height in pixels and in metres), the menus' top and the name box's bottom. Creatures made with Aethermoor M7's kit
    are bent on the graphics card in their own way, so they are measured by where they stand, their stated height and
    reach (marked `nominal`).
- **`game/battle/screen-layer.css`** (the battle on the land and the lab page) **and `game/battle/screen.css`** (the
  battle page): **"Skip intro" is 44 px tall** (it was 35), and on the land and the lab page it stands **just under the
  frame-rate words** (top 30 px, right 10 px) instead of over them. On the battle page the frame rate is in the header,
  outside the fight, so there it stays at the top right.
  - Note: `screen-layer.css` says it is made by `tools/battle-scope-css.py`, but running that tool now would drop the
    fights job's hand-made phone block at its end (and this change). I changed both files by hand, the same way.
- **`game/battle/rules.js`**: **zone 4's white sage is now a herb the battle knows** ("White sage": it heals the whole
  party as Lavender does; `start: 0`, so a new party does not begin with any). **My call**, a stand-in: zone 4's land
  grows white sage where zones 1 to 3 grow Lavender, so it does Lavender's work. Other choices: Moonpetal's (heal one),
  or something of its own (Chris's to say; `docs/questions.md`).
- **`game/party/party.js`**: a new party starts each herb with that herb's own `start` if it has one (only white sage
  has: 0), else three, as before.
- **`game/battle/models/m7/m7-foe.js`, `game/battle/models/m7/peak/peak-foe.js`, `game/encounters/slots.js`: one foe
  maker.** `makeM7Foe` now adds a peak creature's extras itself (the Wickstoat's spines and sparks, the Hoarmantle's
  face, breath and snow), from `M7.extras`, which `peak-foe.js` fills. `makePeakFoe` is kept as another name for
  `makeM7Foe` (the peak creatures' look page calls it); zone 4's two slots now name `makeM7Foe`. What the player sees
  is the same, with one small difference for the better: before, if a fight began before the models were unpacked,
  `makePeakFoe` hung the extras on the plain stand-in; now they go only on a real model.
- **`tools/encounter-test.py`**: part 6 (the fight meant to be lost) **sets the party's level itself**, to the level the
  coven comes into the zone at (zone 1: level 1), before sending it in at 1 HP each. Run whole, an earlier part had left
  it at level 5, where it wins even at 1 HP. Nothing in the game was changed for it.
- **`tools/battle-frame-test.py`** (new): starts fights on the lab page (or slot A on a zone page, `--land`), takes a
  picture of the intro while "Skip intro" shows and one of the resting shot, and checks: every witch and every foe
  wholly inside the picture, above the two panels, clear of the name box; on an upright phone each witch at least
  110 px tall; "Skip intro" 44 px or more and clear of the frame-rate words.

### Why zone 4's white sage could not be used

The land puts what is picked into the party's herbs under the herb's own name (`white-sage`). The battle lists and uses
only the herbs in its own table (`rules.js`, `HERBS`: Moonpetal, Lavender, Silver Mugwort, Ember-star Lily,
Nightrose), so white sage was carried, shown in the party's panel, and never offered in a fight. Now it is in that
table. Checked by sums with the battle's own engine: a witch's Item list shows "Moonpetal (4), White sage (2)"; using it
healed all four (10,354 to 14,962 HP and so on) and left 1; the next turn it showed "once a fight". The simulator's
players never carry it, so no balance number moves.

### The numbers: how tall a witch stands on the screen

Measured by `tools/battle-frame-test.py` on `fights-lab.html`, in the resting shot (the menu waiting for the first
move, the camera settled), from her lowest posed point to her highest, in screen pixels. "Before" is the same build
with the old numbers put back in `FRAMING.tall`.

| Fight | Foes | Upright phone 412x880, before | Upright phone, after | Laptop 1280x720 (unchanged) | Phone on its side 880x412 (unchanged) |
|---|---|---|---|---|---|
| zone 1, A | the Rotwarden (2.6 m) | 67 to 70 px | **173 to 206 px** | 182 to 225 px | 94 to 110 px |
| zone 1, B | three Glowcaps | 60 to 63 px | **125 to 146 px** | 165 to 209 px | 91 to 106 px |
| zone 2, A | the Forge-Spark (0.49 m) and a wraith | 59 to 61 px | **168 to 200 px** | 170 to 206 px | 91 to 106 px |
| zone 4, B | the Hoarmantle | 65 to 68 px | **158 to 185 px** | 181 to 224 px | 93 to 109 px |

(The hub's "about 45 px" was read off zone 4's picture, slot A; measured this way, zone 4 B stood 65 to 68 px.)
The foes on an upright phone, after: the Rotwarden 219 px, a wraith 149, the Hoarmantle 183, a Glowcap 45 to 51, the
Forge-Spark 46 (its box with its reach; the creature itself is about 25 px: its size is Chris's call, B in
`docs/questions.md`).

### What was checked, and how many good and failed

Every page was built from this branch. Every browser check ran through the shared lock, one at a time, with
`PYTHONPATH=tools/hub/pw-bridge` (the bridge needed nothing new).

| Check | Page | Good | Failed |
|---|---|---|---|
| `tools/battle-frame-test.py`, 4 fights (zone 1 A: the Rotwarden alone; zone 1 B: three Glowcaps; zone 2 A: the Forge-Spark and a wraith; zone 4 B: the Hoarmantle) at 412x880, 1280x720 and 880x412 | `fights-lab.html` | 213 | 0 |
| the same, "before" (old numbers put back), at 412x880 | `fights-lab.html` | 74 | 16 (every witch under 110 px: the fault this job mends) |
| `tools/battle-frame-test.py --land`, slot A of each zone, at the three sizes | `zone-1.html` to `zone-4.html` | 48, 55, 48, 55 | 0 |
| `tools/battle-test.py` | `battle.html` | 8 fights played | 0, 0 page errors |
| `tools/battle-start-test.py` | `battle.html` | 14 | 0 |
| `tools/encounter-fights-test.py --only zone-1-A,zone-1-B,zone-2-A,zone-4-A`, each played to its end | `fights-lab.html` | 13 (all four won) | 0, 0 page errors |
| `tools/encounter-test.py`, run whole | `zone-2.html` | 43 | 0 |
| `tools/encounter-test.py`, run whole | `zone-1.html` | 39 (the lost fight at level 1: lost, the coven woke at the camp, healed) | 0 |
| `node tools/encounter-balance.mjs` | sums | every target met; 181 fights for the attentive player, as on the board | 0 |
| white sage, by sums with the battle's engine | | offered, heals all four, then "once a fight" | 0 |
| one foe maker: `makeM7Foe` and `makePeakFoe` give the same creature, in a browser | `fights-lab.html` | Wickstoat: 9 spines, 9 sparks, its motes; Hoarmantle: its breath and snow; Rotwarden: nothing added | 0 |

"Skip intro" was checked in every one of the frame runs: 44 px tall, under the frame-rate words, inside the screen.

A note on the hub's pictures: with the camera settled, the old upright shot already had all four witches inside the
picture (only small). The witch cut at the left edge in the hub's pictures was taken while the camera was still
gliding or during a move (this browser draws only 2 or 3 frames a second, so a glide takes many seconds here), and in
the intro, where the painting's slice was centred on the painting's middle. The frame check now waits until the
camera has arrived.

### The pictures (every one looked at)

All in `/tmp/claude-0/-home-user-coven-of-the-moon-faire/41576e32-9c97-530a-9c7c-c502d1946878/scratchpad/fights-polish/`:
- `upright-before-after.jpg`: the four lab fights on an upright phone, before (top row) and after (bottom row).
- `land-upright.jpg`: slot A on each zone's page, upright phone, after.
- `after/`: the lab fights, `<fight>-intro-<size>.png` and `<fight>-rest-<size>.png`, at the three sizes;
  `before/`: the same at 412x880 with the old numbers; `land/`: slot A on each zone page, intro and resting shot, at
  the three sizes. `frame-numbers.json` in each folder holds every box measured.
- The logs of every check are beside them (`*.log`, and `summary.txt`).

These are the resting shot (the menu waiting) and the intro, not a shot a few seconds into the auto-player's moves as
the hub's were: the resting shot is the picture the player sees most, and it is the one the change is about.

What is still wrong in them: on an upright phone the painted place does not show (all ground; "Rough" below); the
Forge-Spark is a speck on every screen (its size is Chris's call); in zone 4 slot A on a laptop, a small glow of the
frost wisp shows during the intro's first line, before the foes rise (older than this job: the laptop's intro was not
changed).

### Not checked

- Motion, the frame rate, sound and touch: no machine here can show them. The camera's glide into the new upright
  shot, and the intro's change from the painting to the moving camera, were seen only as stills.
- The Hoarmantle's own fight played to its end (35 minutes): left out as the brief says. My change to the maker
  touches it; the Wickstoat's fight, which goes through the same new path, was played to its end instead, and the
  Hoarmantle was drawn with its extras in the frame pictures at all three sizes.
- Every other shot of the director on an upright phone (a witch's move over her shoulder, a close-up, the bow) keeps
  its own numbers; only the resting shot and the wide shot changed. The pictures show only the resting shot and the
  intro.

### Rough

- **On an upright phone the painted place no longer shows behind the fight**: looking down 22°, the picture is all
  ground. At 14° a strip of the painting showed at the top, but Kore then stood in front of the foes (the Forge-Spark
  and the Hoarmantle's legs were hidden behind her). I chose seeing the foes. `FRAMING.tall.wide.rise` is the one
  number to change.
- With three foes the witches are smaller (125 to 146 px) than with one or two (158 to 206): three foes spread wider.
- The Forge-Spark is still small on every screen: it is 0.49 m tall beside 1.7 m witches (Chris's call).
- A shot is fitted to the menus' height as it was when the battle laid itself out (a taller menu, such as Io's seven
  commands, is not refitted). That is older than this job, and the same on a laptop.

### For the hub

- Bring in `job/fights-polish` whole. It touches only `game/battle/**`, `game/encounters/slots.js`,
  `game/party/party.js`, two tools, and this slip. No zone page was changed.
- `tools/battle-scope-css.py` would now drop two hand-made parts of `screen-layer.css` (the fights job's phone block
  and this job's "Skip intro"). Either teach it to keep a marked tail, or never run it again.
- `tools/hub/all-checks.sh`: zone 1's encounter check can now be run whole (`encounter-test-1`), and its comment about
  the lost fight can go.
- `tools/battle-frame-test.py` could join the hub's checks: `python3 tools/battle-frame-test.py builds/fights-lab.html
  <folder>` (about 50 minutes for 4 fights at 3 sizes here; `--sizes 412x880` for the phone alone).
- For `docs/questions.md`: what white sage does in a fight (my stand-in: Lavender's).

### For Chris

- **A fight on your phone held upright now fills the screen**: the four witches stand two to three times as tall as
  before, with their backs to you, and the foes beyond them. Please look at it on your phone, and say if you would
  rather see the painted place behind the fight (then the witches would stand a little in front of the foes).
- **White sage now works in a fight.** For now it heals all four, as Lavender does. Say if it should do something else.
- "Skip intro" no longer lies over the frame-rate words, and is bigger for a thumb.
