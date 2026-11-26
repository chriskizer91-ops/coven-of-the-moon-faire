# leader: who leads, chosen in the menu (any of the four)

Branch: job/leader      Updated: 2026-11-26

## Report for the hub

Chris, November 25: "Yes, all four witches from the beginning. Any of them can lead, so there has to be a thing in the
menu to change who's the walking-around model." This job makes that.

### 1. What I found first

- **Who walks today is Io, not Kore.** The one in the red hat and wine-red robe is Io, the Herbal Witch. Kore is the
  jester in plum. Every zone page made Io: the walker started with Io unless a page named another, and no page did.
- **The other three are not drawn on the land.** Only the one walking has a model there. Nobody follows her.
- **The story assumes all four are always there, whoever walks.** The story brief says so in plain words
  (`docs/lore/story-brief.md`, section 5: "The same recording plays whichever witch the player walks as. So no line may
  say 'you' and mean one witch. All four are always there"). The coven's lines at set moments are said by all four.
- **All four are in the party and in every fight from the very start of zone 1.** `party.js` keeps all four; the battle's
  party list is the four; every fight on the land is fought by the four (the check saw io, jester, fox and ranger in
  each fight). Nothing on any zone page holds a witch back.
  - One leftover, not on any zone page: the battle's "first" fight (`game/battle/fights.js`, kind `first`) is Io alone.
    Only the battle page and the balance sums use it. Left as it is: it is the fights job's, and changing it would
    change the balance targets.
- **A way to choose already existed, but did not last.** The menu's Coven tab had a "Walk as" button on each card. The
  choice was kept only in `coven.where`, and put back only on the same page. A flight to the next zone, the front door's
  Carry on or a new page all went back to Io.
- **Everything that follows "the one who walks" follows a spot, not a model.** The camera, the corner map's arrow, who a
  person turns to and talks to, where a fight starts and where she stands after it, the gate by the ship: all read the
  walker's own place (`W.io`). So once the model is swapped where she stands, all of them follow by themselves.
- **Kore's and Europa's steps were wrong on the land.** Their model has its own run, but the land never played it
  (`walkers.js` gave it 0), so they only walked faster. And their steps went round at about a quarter of the pace the
  ground went by, so their feet slid. Callisto had Io's step numbers, and Io's run moved her feet faster than the ground.

### 2. What changed, file by file

- `game/menu/menu.js`: the Coven tab starts with **"Who leads"**: four big buttons, one for each witch, with her own
  colour, her first letter in a round disc, her name and what she is. The one leading has a gold ring and says
  "Leading". Tap or click another, and she leads at once; the menu stays open and says "Kore leads now." The arrow
  keys move between the four, Home and End go to the ends, Enter or Space chooses. Below it the four cards (level, HP,
  MP) as before; the leader's card says "Leads". The old "Walk as" buttons are gone (one way to choose, not two).
- `game/menu/menu.css`: the looks of the row. Four across on a laptop, two by two on a phone. Each button is at least
  64 px tall.
- `game/menu/menu-words.js`: the row's words, **every one marked as a stand-in**: "Who leads", "You walk as the one who
  leads. The other three are with her.", "Leading", "Lead", "Coming…", "{name} leads now.", "Leads", "Bringing {name}…".
- `game/menu/menu-data.js`: a new game key, `coven.leader`, kept in the save slot; and a `leader` block: the four, who
  leads a new game (Io), and each one's colour.
- `game/menu/saves.js`: `W3D.leader` (who leads; kept in `coven.leader` the moment she is chosen). Once the page is
  ready, anything that changes who walks (the menu, or a page's old "who" panel) is kept as the leader and the slot is
  saved. A save made before this job has no `coven.leader`: then the one who walked in it (`coven.where`), else Io.
- `game/engine/place/walker.js`: the walker is made as the leader (so only her model is built when the page opens).
  `setWho` puts her where the walker keeps her, facing the same way, and sets her pose at once. `W.A` is now always the
  one walking (it stayed the first one before). Each witch's own step speeds are used (below).
- `game/witches/walkers.js`: Kore's and Europa's own run is played; their steps keep pace with the ground (9.9 radians a
  second at a walk, 10.3 at a run; it was 2.2 and 3.3); starting, stopping and walk to run blend over a moment. Io's
  run and Callisto's walk and run have their own measured numbers. All the numbers are in one block, `STEP`.
- `game/pages/leader-lab.html`: the job's own small page (Wickhollow, its land, the four, the menu; 39.6 MB built).
- `tools/leader-test.py`: the job's check. `tools/leader-look.py`: the pictures of each one walking.
- No zone page was changed: the walker reads the leader itself.

How well the feet keep to the ground now (measured on the small page: how fast a foot on the ground goes back under
her, in metres a second, against how fast she goes; the same number is perfect):

| Witch | Walk, 1.3 | Run, 3.0 | Sprint, 5.2 | Before (walk / run) |
|---|---|---|---|---|
| Io | 1.26 | 2.99 | 5.16 | 1.24 / 3.94 |
| Kore | 1.30 | 3.02 | 5.26 | about 0.4 / 0.7 (no run pose) |
| Europa | 1.30 | 3.02 | 5.26 | the same as Kore |
| Callisto | 1.29 | 2.99 | 5.17 | 1.56 / 3.31 |

A cost: to cover 1.3 m a second with her short stride, Kore and Europa take quick little steps (about 3 a second).
The other choice was calmer steps with feet that slide.

### 3. The checks

RESULTS_HERE

### 4. Pictures

PICTURES_HERE

### 5. What could not be checked here

- **Motion and frame rate.** A browser with no screen cannot show either. The feet were measured by numbers, and the
  pictures show poses, not movement. Whether Kore's quick steps look right, only Chris's laptop can say.
- **Touch.** The checks click and press keys. On a phone the same buttons are tapped (each 64 px tall or more).
- **Sound.** Nothing here plays sound.
- **The moment of the swap on a slow device.** The first time a witch is chosen her model is built: here about 0.1 s.
  On Chris's phone it may take longer ("Coming…" shows on her button meanwhile).
- **Memory.** A witch once chosen stays built (only the one leading is drawn).

### 6. My calls, each with the other choice

1. **The row sits at the top of the Coven tab**, not on a tab of its own and not on the land. Other choice: its own tab,
   or a small button on the land (one more button on the screen).
2. **Her own colour and her first letter**, not a small picture. Other choice: a portrait of each.
3. **A new game starts with Io leading** (`leader.start` in `menu-data.js`). Other choice: keep the leader of the game
   being played.
4. **The menu stays open after choosing**, as the old Coven tab did. Other choice: close it, so she is seen at once.
5. **Kore's and Europa's steps keep pace with the ground** (quick steps, no sliding). Other choice: slower steps that
   slide (the old numbers are in `walkers.js`).
6. **Io's run plays slower than before** (her feet no longer go back faster than the ground). Other choice: the old
   2.125 in `walkers.js`.
7. **The other three are still not drawn.** Drawing them following her is a bigger job (three more models on the
   land, a cost on the phone), and Chris has not asked. See "For the hub".

### 7. Lines of the story that fit one leader best

No line was changed. The story was written for "whoever leads, all four there", and every line still reads. But with
only the leader drawn, some lines are said to someone the player does not see:

- **People who speak to Io by name, face to face, when the coven walks up to them** (they turn to whoever leads):
  Nettie `z1.nettie.01`, `.02`, `.03` ("The garden's yours"), `.07`, `.08`, `.14`, `.15`, `.19`; Hilde `z1.hilde.03`;
  Marta `z2.marta.01` (**"Io? Little Io? Look at you. You've got her walk."**: the clearest one; said to Kore's face it
  jars), `z2.marta.09`, `z2.marta.12`; the Grey Hat `z3.captain.16`; Halcyon `z4.halcyon.02` ("I know who you are"),
  `.05`, `.07`, `.12`; Nettie `z4.nettie.03` ("Look at the two of you. Same walk."), `z4.nettie.04`.
- **Kore asking Io to stand behind her**: `z1.kore.08`, `z1.io.10`, `z2.kore.08`, `z3.kore.09`, `z4.kore.06`. They fit
  any leader while the others are not drawn. They would clash only if followers were drawn in the wrong order.
- **The narrator, when the player lights a road stone**: `z2.narrator.05` ("Io's small flame catches."). With another
  leading, she presses "Light the road stone" and Io's flame lights it.
- **A word on the land, not a line**: a herb picked says "… in Io's bag". Io carries the herbs, so it holds.

### 8. For the hub

1. **The board and `docs/decisions.md`**: Chris's word of November 25 ("all four from the beginning; any of them can
   lead; a thing in the menu"), and that it is built: the "Who leads" row in the Coven tab.
2. **`docs/questions.md`**: the calls in section 6 are Chris's to overrule. The biggest: should the other three be drawn
   following the leader on the land? (Not built. Three more models drawn, and time on the phone.)
3. **The lines in section 7**: for Chris or the story job to read. Marta's "You've got her walk" is the one most likely
   to need a word.
4. **`tools/hub/all-checks.sh`**: add `leader-test` (`python3 tools/leader-test.py builds`; about an hour with its four
   fights; `--quick` plays one).
5. **`game/README.md`**: one line under `witches/`: "`walkers.js`: any of the four as the one who walks, with each
   one's own step speeds".
6. The hub said the one walking in the pictures was Kore: it was Io.

## Running log

- Nov 25, 15:40 Read the brief, the rules, the menu's slip, the walker, the saves, the journey. Made the small page.
- 16:10 First pictures: the one in the red hat is Io. Code started: `coven.leader`, the walker made as the leader, the
  "Who leads" row.
- 17:00 Measured the four's feet: Kore's and Europa's run was never played on the land, and their feet slid. Fixed.
- Then each witch's own step speeds measured and set; all four within 6 cm a second of the ground. First run of the
  check on zone 1 (`--quick`, part A): 37 good, 3 failed, all three a slip in the check itself (it compared against
  the state from before the first fight, which the fight's experience had changed).
- Nov 26, 11:00 Cut off by the usage limit on Nov 25. Merged `main` (c5235d5): no clash. The check put right. The final
  run started: four zone pages and the front door built, the check, the pictures, the hub's checks.
