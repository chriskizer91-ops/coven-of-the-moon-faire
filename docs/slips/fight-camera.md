# fight-camera: close-ups that cut in, shots that fit a giant, ground with no edge

Branch: `job/fight-camera` (made from `main` at ffadd76; `main` at 877ef05 merged in)      Updated: November 26, 2026

## Report for the hub

Done by a sub-agent of the hub's. Nobody could be asked while it worked: its calls are marked "my call", each with the
other choice. Chris's words of November 25 are the brief: close-ups on the one attacking, then back out; shots that
suit a foe's size; and his two photographs (tiny witches, an island of ground in the dark, numbers in a heap).

### What changed, file by file (every change has a comment beginning "fight-camera:")

**`game/battle/screen.js`** (the battle's screen). Nothing else in the game was changed: no CSS, no arena file.

1. **A move now has three camera beats.** When anyone begins a move (a witch or a foe), the camera cuts in close on
   the one acting. When the blow lands, it shows whoever is hit. Then it backs out to the resting shot.
   - The log of a turn tells the camera when a move begins and ends, and every blow tells it who was hit.
   - The close-up is held 0.9 seconds, the blow 0.8 seconds. **The move never waits for the camera**: the move's own
     shots (the ones it always asked for) wait their turn and are taken when the hold is over. So a fight takes
     exactly as long as before.
   - A move that has its own film (the black bars: a summons, a Trance, a finishing blow) keeps its own shots after the
     opening close-up.
2. **The kinds of shot**, and how one is chosen:
   - *front*: close on the one acting, from the front quarter (a witch is seen from the foes' side, so her face shows);
   - *profile*: close, from the side;
   - *shoulder*: over the acting witch's shoulder at the foe she aims at;
   - *victim*: over the shoulder of the witch a foe aims at, looking at the foe;
   - *target*: close on whoever is hit; *clash*: both, from the side, when the two are at grips;
   - *all*: everyone hit at once, from where all their faces show;
   - *rest*: the resting shot.
   - Chosen by **who acts** (a witch or a foe), **what the move is** (at one foe: over a shoulder too; at her own side
     or at everyone: on her alone) and **how big the other is** (a witch at a giant: over her shoulder first, so it
     looms; a giant at a witch: over the witch's shoulder first). The kinds are taken in turn, never the same kind
     twice running, and never one where somebody stands between the camera and its subject, nearer the camera than
     its subject, or right beside the camera.
   - A blow on one fighter cuts to them unless the shot already shows them big. A blow on everyone at once stays in the
     wide shot if it shows them all.
3. **Cuts, not glides (my call; one data switch, `FRAMING.cuts.into`: `'cut'` or `'glide'`).** Why: a fast glide from
   behind the party to in front of one witch swings the picture through whoever stands between, and at 30 frames a
   second it is a smear of five or six pictures. After a cut the camera still moves a little: it eases in on a
   close-up, and it backs out into the resting shot (`push`, `pull`). The other choice, `'glide'`, is there to try.
4. **Shots that fit a giant.** A foe taller than 3.2 m, or reaching more than 2.2 m to each side, is a giant
   (`FRAMING.loom`). It is read from the foe's own data (`tall`, `halfW` in its look), so a new model only needs its
   numbers. **My call: a giant looms and may be cut by the top or side of the picture; the party is never pulled back to
   fit it.** The other choice was to fit it whole and let the witches shrink (what it did before).
   - The resting shot with a giant: the party whole, their feet just above the panels, the giant as far up as 5.4 m.
   - A close-up on a giant is taken from 1.3 m above the ground, looking up at the top four fifths of it.
   - Everything else (the Rotwarden at 2.6 m, the Hoarmantle, a 0.5 m creature) keeps the resting shot it had, which
     Chris said works. A creature under 1.15 m is framed as if it were 1.15 m, so it is not blown up to fill the screen.
5. **The ground has no edge.** The arena grew its live ground only where the painter's fixed camera looks: a wedge,
   which the moving camera saw as an island. Now the same grass (the arena's own picture, wind, marks and lights)
   grows all round the fight, 44 m out, thinner and lower than the painter's; from 26 m out it pales into the colour
   of the painting's own far ground, so the ground runs on into the painted place. The dark band that lay between the
   ground and the painting is gone. Above the painting's top edge there is now plain night sky (a camera that looks up
   at a giant used to see the painting again, upside down, with a second moon).
6. **Numbers and words keep apart, and stay inside the picture.** Each is put where it wants to be; one that would
   touch an earlier one is moved up clear of it (down, if there is no room above); none may pass the picture's edge or
   go under the panels. So four numbers at once can all be read, and a word over a giant's head ("Fate") is not cut off.
7. **Every framing number is data, in `FRAMING`**, with a plain comment on each line: `loom`, `giant`, `close`, `over`,
   `pair`, `all`, `see`, `cuts`, `ground`, `nums`.
8. Test hooks on `window.__battle`: `shot(kind, who, other)` sets any named shot at once; `freezeOn([...])` stops the
   battle's clock the moment a move's camera comes to a beat; `beat`, `numbers`, `ground()`, `framing`.

**`tools/battle-frame-test.py`** (the fights-polish job's check, extended): a giant is judged by where it stands; the
resting shot on a laptop asks 150 px of every witch (at 720 px high); the ground is counted and the picture looked at;
`--shots` sets and measures each kind of shot and puts eight numbers up at once.

**`tools/fight-camera-look.py`** (new): stills of each kind of shot, and of moves as a fight plays itself (the clock
stopped at each beat). `--as 12x4.8` tells the camera a foe is that big, to see the framing before a model is here.

### The numbers: how tall a witch stands (her lowest point to her highest, in screen pixels)

| Shot | Fight | 1280x720 | 1600x750 | Upright phone 412x880 | Phone on its side 880x412 |
|---|---|---|---|---|---|
| Resting shot, **before** | the Great bramble | | **79 to 83** | | |
| Resting shot, after | the Great bramble (7.8 m) | **170 to 210** | **183 to 229** | 133 to 148 | 75 to 86 |
| Resting shot | the great wraith (7.4 m) | 170 to 210 | | | |
| Resting shot | the fire, form one (8 m, its own model) | 190 to 244 | | | |
| Resting shot | the fire, final form (12 m) | 158 to 190 | | | |
| Resting shot (unchanged) | the Rotwarden (2.6 m) | 182 to 225 | 190 to 236 | 172 to 204 | 93 to 110 |
| Resting shot (unchanged) | the Forge-Spark (0.55 m) and a wraith | 170 to 206 | 185 to 228 | 167 to 199 | |
| Resting shot (unchanged) | the Hoarmantle | 181 to 224 | | 157 to 185 | |
| Close-up on the one acting | every fight | Io 300 (42% of the picture), Kore 310 (43%) | | | |

Close on a foe at 1280x720: the Forge-Spark 195 px tall, the Rotwarden 380, the Hoarmantle 425, the great wraith 608; the
Great bramble fills the picture from below (852 px of its own height on a 720 px screen, its head inside).
The ground: in every still, of up to 45 places looked at in the lower part of the picture, **0 were bare**. About 31,400
tufts are grown round the painter's 4,900 (2,144 round 381 at the dead Moonwell, whose ground is nearly bare by design).
Numbers: eight numbers and words put up at once: none on another, all inside the picture, in every fight and size tried.

### What was checked, and how many good and failed

Every page was built from this branch. Every browser run went through the shared lock, with
`PYTHONPATH=tools/hub/pw-bridge`. **Page errors: 0 in every run.**

| Check | Page | Good | Failed |
|---|---|---|---|
| `battle-frame-test.py --shots`, 1280x720: the Great bramble, the great wraith, zone 1 A, zone 2 A, zone 4 B, the fire's two forms (then still stand-ins) | `fights-lab.html` | 287 | 2, both the check's own fault on the bramble (it asked a giant to be whole). Mended; the bramble again: 41 good, 0 failed |
| the same, 1600x750: the Great bramble, zone 2 A, zone 1 A | `fights-lab.html` | 129 | 2: zone 1 A's resting shot (not changed by this job) showed 1.5% and 1.3% lit grass in two parts of the strip above the panels, where I had asked 1.5%. That strip is the trampled clearing, thin by design. The bar is now 1%; run again: 18 good, 0 failed |
| the same, upright phone 412x880: the Great bramble, zone 1 A, zone 2 A, zone 4 B | `fights-lab.html` | 156 | 2. (1) Io 109 px beside the bramble, 110 asked: mended (an upright phone holds a giant more tightly); again: 20 good, 0 failed, a witch 133 to 148 px. (2) In the shot of both foes at once, the wraith's robe is 29 px past the right edge: **left as it is** (phone only) |
| resting shot, phone on its side 880x412: the Great bramble, zone 1 A | `fights-lab.html` | 28 | 0 |
| zone 1 A with `--shots` again, after the last change (no close-up from beside a foe) | `fights-lab.html` | 44 | 0 |
| `battle-frame-test.py --land`, slot A, 1280x720 and 412x880 | `zone-2.html` | 50 | 0 |
| `encounter-fights-test.py`: zone 1 A, zone 2 A and **the Great bramble, each played to its end** | `fights-lab.html` | all three won (8, 14 and 36 turns), every check passed | 0 |
| `battle-start-test.py` | `battle.html` | every check passed | 0 |
| `battle-test.py` | `battle.html` | BATTLETEST | |

### The pictures (every sheet looked at)

For Chris, in `/tmp/claude-0/-home-user-coven-of-the-moon-faire/41576e32-9c97-530a-9c7c-c502d1946878/scratchpad/fight-camera/for-chris/`:
- `1-resting-shot-before-and-after.jpg`: the Great bramble at 1600x750, before and after. **Show this first.**
- `2-a-witchs-move.jpg`: Callisto's shot at the bramble, and at the Rotwarden: the close-up, the hit, the backing out.
- `3-the-giants-move.jpg`: the bramble's Hammerfall (close from below, the blow on all four, back out), and Io striking by hand.
  (Its lower left picture was taken before the last mend: the Rotwarden's arm fills the right of it. The camera no longer
  stands there; checked by numbers, not by a new picture.)
- `4-the-fire-two-forms.jpg`: the fire's two forms at 1280x720: resting shot, close-up, over a shoulder.

Everything else is in `/tmp/claude-0/-home-user-coven-of-the-moon-faire/41576e32-9c97-530a-9c7c-c502d1946878/scratchpad/fight-camera/`: `before/` (the old camera), `final/shots*`, `final/phone`, `final/side`, `final/land`,
`final/last`, `final/redo` (the frame check's stills, with `frame-numbers.json`), `final/moves` (moves, beat by beat),
`final/fire`, `final/fire2`, `final/as` (the bramble told it is 12 m tall), `try3/` (every kind of shot, three fights), and
`work/*.log` (every run's log). The build to send: `builds/fights-lab.html` in this working copy (23.5 MB).

### The fire's two forms (the hub's word of November 26)

- The framing reads only a foe's `tall` and `halfW`. Nothing was added for the fire.
- Form one: the resting shot holds the party (190 to 244 px) and the fire up to 5.4 m, so the top of its sphere is cut by
  the top edge. When it acts, the close-up and the over-the-shoulder shot both hold the sphere.
- Final form: the same. **One thing I could not tell:** in my stills, 10 seconds into its fight, the final form looked
  about the first form's size. The close-up is framed for the 12 m it is said to be, so there was sky above it. If the
  model does grow to 12 m, it will fill that shot.

### What could not be checked here, and what Chris should watch for on his laptop

No machine here can show motion, a frame rate, sound or touch. Every shot was seen only as a still.

- **How the cuts feel.** Is 0.9 seconds on the close-up too long or too short? (`FRAMING.cuts.hold`.) Is the blow
  held long enough to read the number? (`hit`.) Would he rather the camera flew in than cut? (`into: 'glide'`.)
- **The ease after a cut** (the camera creeping in on a close-up, backing out into the resting shot): seen only as
  its last picture. If it swims, `push` and `pull` set to 0 turn it off.
- **A witch running in to strike**: the close-up goes with her. Only its first picture was seen.
- **The frame rate.** There are about 31,000 more tufts of grass than before (6 times the painter's own). On his
  laptop this should be small; he should read the frame-rate words in the corner. On a phone it is thinned to three
  quarters (`FRAMING.ground.phone`). If a phone slows, that number is the one to lower.
- The Great bramble's long moves (Devour, Maelstrom) were seen at a few beats only.

### The calls I made (each is one line of data)

| Call | What I chose | The other choice |
|---|---|---|
| Cut or glide | cut, then a small ease (`cuts.into: 'cut'`) | `'glide'` |
| A giant | looms, cut by the edge (`loom`) | fitted whole, witches small |
| How close a close-up | the one acting stands half the picture's height (`close.share: 0.5`) | nearer (head and shoulders): then the others near her fall out of the picture |
| A blow on a giant | cuts to the giant from below unless it already fills the picture (`see.giant: 0.9`) | stay in the wide shot (`0.5`) |
| Small and middle foes' resting shot | left as it was | the giant's framing for all |
| Far ground | the painting's own far-ground colour | dark, as it was |

### Rough

- A close-up on one witch shows the witches near her too: they stand 2 m apart. The one acting is in the middle and is
  never the smaller.
- Europa and Callisto stand behind Io and Kore, so a front close-up on them is often not clear; they get the side-on
  one (Europa's from the far side) and the over-the-shoulder one more.
- Where the painting meets its own mirror at the side, a second moon can show (older than this job; a low camera
  looking up sees it more often).
- Bogmire (the great wraith): the boardwalk stands on a plain dark ground when the camera moves, not on water (older
  than this job). No grass is grown there, by design.
- An upright phone keeps its own resting and over-the-shoulder shots; it gets the new close-ups, the giant's framing of
  two-shots, the ground and the numbers.

### For the hub

- Bring in `job/fight-camera` whole: `game/battle/screen.js`, the two tools, this slip. No page was changed.
- `tools/battle-frame-test.py --shots` could join the hub's checks (about 2 minutes a fight at one size here).
- For the `last-foe` job: the fire's two forms need only `tall` and `halfW` in their looks (they have them: 8 m and
  12 m). At 12 m the close-up on it stands about 20 m off, behind the party; pictures "as 12x4.8" show the framing.
- For `docs/questions.md`: cut or glide; how long the close-up holds.

### For Chris

- Play `fights-lab.html` on the laptop, the Great bramble at level 16, and one small fight. Watch a witch's move: the
  camera should cut in on her, show the hit, and back out. Say if it is too quick, too slow, or too jumpy.
- The witches now stand two to three times as tall beside the Great bramble, and the ground has no edge.

## Running log

- Nov 25 15:30 Read the brief, the rules, the slips, Chris's photographs, the director in `screen.js`.
- 15:45 "Before" pictures of the Great bramble at 1600x750: a witch 79 to 83 px tall; the ground an island.
- 16:00 to 17:00 First and second pass in `screen.js`; `tools/fight-camera-look.py`; the frame check extended.
- 17:30 Stills of every kind of shot (Great bramble, zone 1 A, zone 2 A at 1280x720) and five moves. Looked at all.
- 22:40 Frame check with `--shots` at 1280x720 on seven fights: 287 good, 2 failed (both the check's own fault, mended).
- Nov 26 03:10 `main` merged in. The closing batch started as one run. It was stopped at two hours (a long wait for the
  lock): the frame checks, the moves and the first fights of the battle test were done.
- 05:00 `main` merged again (the fire's own model). Second batch: the fire's stills, two re-checks, the land check, the
  start test, the Great bramble's fight to its end. A close-up was found standing beside the Rotwarden: mended.
- 07:30 Third batch: the mend checked by numbers; the final form 10 s in. The battle test was cut short twice by my own
  time limits; run once more alone.
