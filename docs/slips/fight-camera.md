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
     twice running, and never one where somebody stands between the camera and its subject, or nearer the camera than
     its subject.
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

RESULTS

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
- Nov 26 03:10 `main` merged in. The closing batch started as one run.
