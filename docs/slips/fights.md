# fights: the new Envoi's battle, here, then grown to four witches, then fights on every land

Branch: job/fights      Last commit: see the branch      Updated: November 24, 2026 (step 4, zones 2 to 4)

**Who wrote what.** Steps 1 to 3 (below, from "What it built") were written by the fights conversation, up to
November 19. Everything in this first part was written on November 24 by a sub-agent of the hub's that took the job
over on Chris's word ("you can use a sub agent to do the rest of the fights conversation"). Nobody could be asked while
it worked: every choice it made is listed under "The job's calls", each with the other choice.

## Report for the hub (the finishing, November 24)

Written by a second sub-agent of the hub's, which took over the checking of the fights job. Nobody could be asked while
it worked; its calls are marked "my call".

### What was done

- **`main` brought in** (zone 4, the maps, the star map). On zones 2 and 3 the maps' block now comes before the fights'.
- **Zone 4's page has its fights block** (`game/pages/zone-4.html`, after the maps' block, copied from zone 3's with
  `zone-4`). Its numbers (`game/encounters/zone-4.js`) were checked against the land as built: the camp's spot is the
  page's own start at the frozen camp (the fire 7 m east of it is inside the camp's 40 m), the inn's rest is 1.6 m
  south of the Lantern House's door, and each ground's `every` (100 to 125 m) is unchanged: the walk is 3.3 km, not the
  3.4 the file guessed, too small a change to touch. Its hub comment at line 117 ("the fights job has not reached this
  page") is the hub's to take out.
- **The narrator's lines that wait on the fights are wired**, in the hub's `game/people/story.js`, one block marked
  "fights job" (so it works for every zone at once): `first-wisp` (the first fight waits for it, 6 s at most; skipped if
  someone is already talking), `rest` (at the camp only, once a page), `not-ready` (said in place of the fights' own
  words, each time). `woke` was already wired there for every zone, zone 4's `z4.narrator.17` included. No word of
  `game/talk/` or `narration.js` was changed.
- **The great wraith is on the lab page too**, so all 17 fights can be tried there.

### What I had to put right

1. **A real fault, found only by playing in a browser** (`game/battle/start.js`): a big fight that cannot be run from
   lost every one of its ends, not only running away. So on the land and on the lab page **the knight of light never
   stopped** (the expert player fought her 116 turns and lost, with her at 25% of her Life), **Io's answers did
   nothing**, and **the fire's first form could not stop**. The simulator never had the fault, so its numbers stand.
   After the fix: the knight stopped and walked away at 40% after one answer, won in 53 turns; the fire's first form
   stopped at 44%.
2. **The failing check was the check's fault** (`tools/encounter-test.py`, part 6): its lost fight was fought 150 m
   from the camp, where a level 1 party at 1 HP each can still win. It is now fought at the spot with the strongest
   foes. The game was not wrong.
3. **On a phone held upright the four witches' numbers in a fight ran into each other and off the panel**
   (`game/battle/screen-layer.css`, marked "Coven"): under 480 px wide the panel of the four takes more of the width,
   and an MP may go under its HP. This is in every fight on every zone page. Seen fixed in a picture at 412 by 880.
4. **The lab page's buttons on a phone**: Watch fell onto a row of its own with the list showing through. Now the level
   is one row and Play and Watch sit side by side under it, on a solid ground.
5. `tools/encounter-test.py` now also checks zone 4's two big fights on the land (the great bramble sets the story's
   flag `bramble`; the fire's two forms with the coven's moment `between` played between them, and the story moves
   on) and the narrator's waiting lines. `tools/encounter-look.py --land` now takes every big fight's button and a
   road stone's.

### The 17 fights, played to their end in a browser (`tools/encounter-fights-test.py`, the expert player)

All 17 won, every check passed, 0 page errors: zone 1 A and B, zone 2 A and B, the three road stones, the night at
the node, zone 3 A and B, zone 4 A and B, the great wraith (51 turns), the knight of light (53 turns, stopped at 40%,
answered once), the fire's first form (stopped at 44%), the fire's second form (ended by Kore's Sealed Fate), the great
bramble (40 turns). Each took 1 to 16 minutes here.

### The last checks (on the four zone pages built from commit 931dd41, with every change above in them)

| Check | Result |
|---|---|
| `tools/encounter-test.py` zone 1 (the quick part and the long parts) | **all 39 passed**, 0 page errors. The narrator's first-fight line was said before the first fight (`z1.narrator.09`); the rest line and the not-ready line wait to be said; the lost fight (at the spot with the strongest foes) was lost and the coven woke at the camp |
| the same, zone 3 | **all 40 passed**, 0 page errors |
| the same, zone 2 | 42 passed, **1 failed: the check's fault** (it read the toast's left-over words from earlier). Put right in the check (commit e2bcd8a); its quick part run again: see RESULTS below |
| the same, zone 4 | 43 passed, **2 failed: the check's fault** (it looked for the fire before the story's stage 3, when the fire is rightly not offered). Put right (e2bcd8a); quick part run again: see RESULTS below. **Zone 4's two big fights on the land passed**: the great bramble won and the story's flag `bramble` set; the fire's first form seen through, the coven's moment `between` played on the land (the narrator and six of the coven's lines), the second form won, the story moved from stage 3 to 4. Its lost fight lost, the coven woke at the frozen camp. About 45 fights from level 16 to 20 (the plan: 45) |
| `tools/zone-test.py` zone 1 | **ALL PASSED** (on the build before the last small change to `story.js`; run again below) |

RESULTS of the rest (each filled in as it finished):

- `quick-4` (35 ok, 0 failed): every check passed
- `quick-2` (35 ok, 0 failed): every check passed
- `story-2` (61 ok, 0 failed): ALL PASSED
- `story-3` (64 ok, 0 failed): ALL PASSED
- `story-4` (75 ok, 0 failed): ALL PASSED
- `zone-test-1` (28 ok, 0 failed): ALL PASSED
- `zone-test-2` (21 ok, 0 failed): ALL PASSED
- `zone-test-3` (25 ok, 0 failed): ALL PASSED
- `zone-test-4` (19 ok, 0 failed): ALL PASSED
- `enc-balance` (0 ok, 0 failed): enc-balance exit 0 :
- `battle-balance` (0 ok, 0 failed): ok   The finale        L18 expert    win   0% (want 0%-2%)       median 10.8 min, losses leave 58% of the foes' HP
- `battle-testers` (0 ok, 0 failed): every check passed
- `menu-1` (58 ok, 0 failed): ALL PASSED
- `menu-2` (57 ok, 0 failed): ALL PASSED
- `menu-3` (57 ok, 0 failed): ALL PASSED
- `menu-4` (57 ok, 0 failed): ALL PASSED
- `maps-1` (108 ok, 0 failed): ALL PASSED
- `maps-2` (108 ok, 0 failed): ALL PASSED
- `maps-3` (108 ok, 0 failed): ALL PASSED

### The pictures (looked at, every one)

Made again with (from the working copy, after `python3 tools/build.py game/pages/fights-lab.html`):
`python3 tools/encounter-look.py builds/fights-lab.html <folder>` and the same with `--size 412x880`, then
`python3 tools/hub/sheet.py <folder>` (a laptop sheet; for the phone's tall pictures it squashes them). The land's
buttons: `python3 tools/encounter-look.py builds/zone-N.html <folder> --land` (and `--size 412x880`).

What they show: every stand-in is a plain dark shape with two pale eyes, readable, sized for its kind. On the laptop
the battle's camera often stands the foes at the right edge, so a big one (zone 1 A, zone 3 A, the fire) is cut by
the edge in the opening seconds: this is the battle's own framing (the wraiths too), not the stand-ins'; left as it
is. The knight wears Halcyon's model, the fire Noctara's (stand-ins). Nothing covers the middle of a phone's screen.

## November 24: step 4, and fights on zones 2, 3 and 4

### What it built

**1. Room for new creatures: two slots in every zone** (`game/encounters/slots.js`, one file).

- Slot A is **on**: the game is balanced with it in. Slot B is **off**: one word turns it on.
- Until Chris's creatures come, each slot is a **stand-in that can be fought**: a plain dark shape with two pale eyes,
  sized for its kind, shown as "Strange creature" (`game/battle/models/stand-in.js`, made here in code).
- Each slot has a job in a fight that the foes already there do not have, and the stand-in does that job today:

| Zone | Slot | Its job in a fight | Where it is met | Suggested for it (NOT approved) |
|---|---|---|---|---|
| 1 | A, on | the heavy one: slow, tough, one big blow that can be seen coming; it knits itself | thorn country, fen | Willow-Wight |
| 1 | B, off | the swarm: three small quick ones | the woods and wilds | Briarling |
| 2 | A, on | the cold-bringer: slows and weakens the four; a wraith fights beside it | the cold road | Mirage Wisp |
| 2 | B, off | the pair: two that hit harder and come round sooner while both stand | the hills off the road | Thornhound |
| 3 | A, on | the armoured one: blades and arrows do two fifths of their harm, spells all of it | the brambles, the pines | Sapwight |
| 3 | B, off | the leaper: goes past the front for Europa or Callisto; Kore cannot catch the blow | the wilds | Rime Wolf |
| 4 | A, on | the light-thief: drinks MP from one witch or from all four; a frost wisp beside it | the frozen pass | Rime-Wraith |
| 4 | B, off | the big one: alone, a long fight, worth three ordinary ones | round Misthollow | Peak-Troll |

- The suggested creature for each slot is written in the slot's own line, marked "SUGGESTED, NOT APPROVED"
  (from `docs/foes-from-m7.md`). Each job is shaped from what that creature does in Aethermoor M7, so it could take the
  slot with no change to the rules. **Nothing was copied from Aethermoor M7.**
- **The rule that keeps the balance steady** (`game/encounters/draw.js`): a slot's fight gives exactly the experience
  and shards of the ordinary fights it takes the place of, on that ground, at those levels. A fight worth three uses up
  the ground of three meetings. So a slot on or off changes what the fights are like, not how many a level takes.
- Seven small rules were added to the battle for the slots' jobs, each marked "Coven (step 4)" in
  `game/battle/engine.js`: Weakened (the four's blows a quarter lighter for a while); a pair; blades sliding off; a
  blow at the back that Kore cannot catch; MP drunk from all four; a foe with no ending to seal; a foe only a seal ends.

**2. The whole game's levels, as one plan** (`game/encounters/plan.js`, and one file of numbers for each zone:
`game/encounters/zone-1.js` to `zone-4.js`).

| Zone | The party comes in at | Its big fight asks | Fights to get there | What a fight is worth there |
|---|---|---|---|---|
| 1 | level 1 | level 5: the great wraith | about 45 | 0.31 of the foes' own numbers |
| 2 | level 6 | level 10: the night at the node | about 45 | 0.27 |
| 3 | level 10, most of the way to 11 | level 15: the knight of light | about 45 | 0.29 |
| 4 | level 16 | level 20: the fire | about 45 | 0.70 |

- **About 181 fights from level 1 to 20** (Chris: about 180).
- A foe is never more than one level above the party. How strong the foes are goes by how far along a zone's road the
  coven is (its `stretches`); what is met goes by the kind of ground (its `where`: the road, the pines, the open
  hills, far from any place, and in zone 3 the brambles).
- **A mistake found and put right:** on the land a zone-1 fight was giving 1.75 times the experience the zone's file
  and this slip said (the battle's own worth for a wild fight was multiplied in as well). So zone 1 took about 26
  fights to level 5, not the 46 the slip gave. Now a zone's `reward` is the whole of it, and zone 1 takes about 45.

**3. Fights on zones 2 and 3** (one marked block in each page: `game/pages/zone-2.html`, `zone-3.html`).

- Meetings in the wilds, as in zone 1: unseen, in the nearest arena, never in a place or at the camp.
- **Zone 2's big fight, `nodeNight`:** three wraiths come up the hill for Dawnroost's living node (Marta: "Every night
  something comes up the hill for the node behind the hall. Wraiths."; Callisto: "Three of them, coming up the hill").
  It is the battle's own Dawnroost fight (three wraiths at level 12), with new words. The spot is the sun in the floor
  of the node's court, before the sunstone. The button says "Hold the node", from level 10.
- **A fight by each of zone 2's three road stones:** pressing "Light the road stone" starts it (frost wisps and a
  wraith: the cold has company), and the stone is lit when it is won. What waits there is this job's proposal.
- **Zone 3's big fight, `knightOfLight`:** on the crossroads' east road, where the hub's light stands. She fights with
  Io's own spells (Flame Bolt, Crescent Blades, Nightbloom Briars, Lunar Mend, Moonlight). Kore's Fate writes nothing on
  her ("There's nothing there to seal"). **She is never beaten:** when her Life is down to three tenths she stops and
  walks away, and the fight is won. **When Io answers one of her spells with the same spell** she falters, loses her
  turn, and stops sooner (the lines: "She used my prayers. Every one. And she stopped when I answered."). The button
  says "Stand in her way", from level 15. **She wears Halcyon's model as a stand-in** (the new Envoi's Gloam Knight,
  dark armour with a pale gold light at her feet, where the story says "all light").
- Rest: at each zone's camp, and (this job's call) at one more place in each: the Wardens' hall in Dawnroost, Old
  Gil's bunkhouse at the shipyard. A lost fight wakes the coven at the zone's camp, as the narrator's lines say.
- **The story is joined as the hub asked:** it sees `window.__fights.gate` and `party.gates[id]`, and its own stand-in
  stops by itself. In `game/people/zone-2.js` one thing was changed, marked "fights job": a stone's `use`.
  `game/people/zone-3.js` was not changed.

**4. Zone 4, as data** (`game/encounters/zone-4.js`; not on a page yet: "For the hub" has the steps).

- Meetings by ground and by stretch, levels 15 to 20, with frost wisps and wraiths.
- **The great bramble** on the frozen road: the battle's Bramble Colossus at level 16 with three fifths of its Life and
  lighter blows, since here it must be passed. From level 16, from the story's stage 1. The coven can back away (it
  is rooted). When it is won the story's flag `bramble` is set, as the zone-4 job's slip asks.
- **The fire, in two forms**, at the dead Moonwell, level 20, offered once the letter is given (the story's stage 3):
  - the first form cannot be ended (no Fate, and it never falls): when its Life is down to 45% the fight stops
    ("Nothing hurts it. It won't let anything end.");
  - then the coven's moment `between` is played on the land, and waited for;
  - the second form's single blows all fall on Kore. No blow can end it. Its Fate grows with every blow on her, and
    her Sealed Fate ends it ("Then I'll give it an ending. I know how.").
  - **Both forms wear Noctara's model as a stand-in** (the new Envoi's last foe).

**5. One check for three settings:** `node tools/encounter-balance.mjs` (about half a minute). **6. The steps for a
real creature:** `game/encounters/ADDING-A-CREATURE.md`. **7. A small page of every new fight:**
`game/pages/fights-lab.html` (14 MB built): the eight stand-ins, the three stones' fights and the big fights of zones 2
to 4, each to Play or to Watch, at any level. **This is the page to send Chris.**

**8. What the land's narrator needed** (step 4, thing 6): the page is sent an event for each. See "For the hub".

### Numbers a person can check

From `node tools/encounter-balance.mjs` (60 journeys for each kind of pretend player in each zone, at each setting;
the same numbers every time it is run):

**Fights to each gate's level, the attentive player:**

| Zone | The plan | A on (the game as shipped) | A and B on | Neither |
|---|---|---|---|---|
| 1, to level 5 | 45 | 45.2 | 45.3 | 45.7 |
| 2, to level 10 | 45 | 45.0 | 44.8 | 44.9 |
| 3, to level 15 | 45 | 44.9 | 45.0 | 45.5 |
| 4, to level 20 | 45 | 46.1 | 44.6 | 46.5 |
| All four | 180 | 181 | 180 | 183 |

**How often a fight is lost** (a share of the fights met; hurts carried from fight to fight, as on the land):

| Zone | Setting | Careless | Attentive | Expert |
|---|---|---|---|---|
| 1 | A on / A and B / neither | 1.6% / 1.5% / 1.9% | 0% / 0% / 0% | 0% / 0% / 0% |
| 2 | A on / A and B / neither | 13% / 15% / 11% | 0.1% / 0.1% / 0.1% | 0% / 0% / 0% |
| 3 | A on / A and B / neither | 17% / 18% / 19% | 0.4% / 0.5% / 1.2% | 0.4% / 0.5% / 1.2% |
| 4 | A on / A and B / neither | 24% / 23% / 26% | 0.8% / 0.6% / 1.1% | 0% / 0.1% / 0.1% |

- **How close the other two settings stay to A on:** within 1.5 fights in every zone, and within 2.6 points of chance
  for every kind of player. (The check allows 3 fights and 4 points.)
- With A on, a new creature is about one fight in 5 to 7 in every zone; with both on, one in 3 to 4.
- The careless player rests about 4 to 8 times in a zone, the attentive one 12 to 15 times, the expert 9 to 12.

**The big fights, each at the level it is offered at** (500 fights each):

| Fight | Level | Careless wins | Attentive wins | Expert wins | About |
|---|---|---|---|---|---|
| The great wraith (zone 1) | 5 | 29% | 93% | 99% | 6 minutes |
| The night at the node (zone 2) | 10 | 15% | 98% | 100% | 3 minutes |
| The knight of light (zone 3) | 15 | 11% | 94% | 97% | 5 and a half minutes |
| The great bramble (zone 4) | 16 | 18% | 95% | 99% | 4 minutes |
| The fire, both forms (zone 4) | 20 | 5% | 100% | 100% | 9 minutes |

**Each slot's own fights against the ordinary fights they take the place of** (500 fights each, begun whole): the
careless player loses 0% to 1% of them where the ordinary fights cost 0% to 12% (zone 3's brambles have the Bramble
Horror in them), and 9% to 10% of zone 4's big one where ordinary fights cost 5% to 6%. A slot's fight takes 0.9 to 2.4
minutes where an ordinary one takes 0.7 to 1.8; the big one takes 6.7 (it is worth three).

**The pages:**

| Page | In `main` | With its fights | How long to open here |
|---|---|---|---|
| `zone-1.html` | 101.2 MB | 101.3 MB | 11 seconds |
| `zone-2.html` | 90.2 MB | 92.2 MB (2.0 MB more) | 13 seconds |
| `zone-3.html` | 87.5 MB | 89.5 MB (2.0 MB more) | 13 seconds |
| `fights-lab.html` | new | 14.1 MB | |

(How much longer zones 2 and 3 take to open than before was not measured: see "What was checked".)

### The trial of one creature from Aethermoor M7 (outside the repo; nothing copied in)

**It works, with changes.** The Willow-Wight (the first of the hub's top picks, and finished in M7) was drawn and
moved in this game's battle in zone 1's slot A, and fought to its end: won in 10 turns, 0 page errors. Its moves file
is used as it is; M7's loader had to be written again for this game's older 3D library (about 45 lines); a small
decoder (21 KB) unpacks the model in 45 thousandths of a second; a join of about 40 lines turns M7's poses into this
battle's motions. It adds about 1.4 MB to a page (the lab page 14.1 MB, with it 15.4 MB). It looks a little darker
here than in M7. The true steps are in `game/encounters/ADDING-A-CREATURE.md`. Only the full-detail kind was tried.

### The job's calls (each is one line of data; each is Chris's to overrule)

1. **About 45 fights a zone, at one meeting every 100 to 130 m** in zones 2 to 4 (zone 1 keeps its 160 to 260 m).
   Zone 2's road to the node is 2.5 km, which brings about 20 fights, so the coven walks it about twice before level
   10. Zone 3's road is long enough (4.8 km before the knight, about 41 fights). *The other choice:* fewer fights each
   worth more (`reward` in the zone's file), or a lower gate level.
2. **Zone 1's `reward` is 0.31**, not 0.27, so that it is 45 fights with foes never more than one level above the party.
3. **What each slot's stand-in does**, its numbers, and where it is met. Zone 3's A is met in the pines as well as the
   brambles, or it would be one fight in ten.
4. **Zone 2's A and zone 4's A come with one of the zone's own foes**, since alone they do little harm.
5. **The big one (zone 4, B) is rare**: worth three fights, and it uses up the ground of three.
6. **The road stones' fights**: frost wisps and a wraith, worth one and a half ordinary fights each, can be run from.
7. **The knight**: stops at three tenths of her Life; each answer raises that by a tenth, up to six tenths, and costs
   her a turn. *The other choice:* she stops at the first answer (a very short fight).
8. **The fire**: the first form stops at 45% of its Life; the second is ended only by Kore's Sealed Fate, and all its
   single blows fall on Kore. The attentive player nearly always wins it. How hard the ending should be is Chris's.
9. **The Bramble Colossus does not roam zone 4** (it did in the new Envoi): it is the great bramble, once.
   **The Bramble Horror is met in zone 3's brambles only**, about one fight in ten there.
10. **One more resting place in each of zones 2 to 4** (`rests`): the Wardens' hall, Old Gil's bunkhouse, Ede's inn.
11. **The first-meeting event** waits only if the page asks (`d.wait()`), so nothing pauses when nobody is listening.
    The board's text had it wait six seconds always.
12. Every name and line in `game/encounters/words.js` is a stand-in or a proposal, marked so.

### What was checked, and how

| Check | Result |
|---|---|
| `node tools/encounter-balance.mjs` (the three settings, the slots, the big fights) | **every target met** |
| `node tools/battle-balance.mjs` (the new Envoi's 51 targets), and `--two` | **49 of 51, and 44 of 51: as before** |
| `node tools/battle-testers.mjs` (Moon Faire's eight players) | **every check passed, as before** |
| `tools/encounter-test.py --quick` on zones 1, 2 and 3 | **every check passed** (32, 35 and 35 checks), 0 page errors |
| `tools/encounter-test.py --long-only` on zones 2 and 3 (slot A fought, a road stone's fight, a lost fight) | **every check passed** |
| the same on zone 1 | slot A fought and won; **1 check failed, and it is the check's fault**: its "lost fight" is now fought by the camp, where the foes are too weak to beat a party at 1 HP each. Not fixed, not run again |
| `tools/story-test.py` on zones 2 and 3 | **all passed** (61 and 64 checks, as in `main`) |
| `tools/zone-test.py` on zones 1, 2 and 3; `tools/people-test.py` and `tools/things-test.py` on zone 1 | **all passed** |
| `tools/encounter-fights-test.py` on the lab page: zone 1 A and zone 2 A played to their end | **passed**, 0 page errors |

- **Not run** (the job was asked to stop starting long runs): the other 14 fights of the lab page played by the
  battle (both of B's stand-ins in zones 1 to 4, zone 3's A and zone 4's A, the three stones, the node, **the knight,
  the great bramble and both forms of the fire**); `tools/menu-test.py` on the three pages (one run on zone 2 was
  still going when this was written); pictures of the stand-ins and of the buttons on the land at both sizes; the
  time a page takes to open, before against after (with its fights a zone page opened in 11 to 13 seconds here).
  The commands: `python3 tools/encounter-fights-test.py builds/fights-lab.html` (about two minutes a fight; `--only`
  plays some), `python3 tools/encounter-look.py builds/fights-lab.html <folder>`, and the same with
  `builds/zone-2.html <folder> --land` for the buttons on the land (`--size 412x880` for a phone).
- **So the knight, the great bramble and the fire have only been played by the simulator, not on a screen.**
- **Not checked by anyone:** a frame rate, anything in motion, any sound, touch on a real phone, zone 4 on its page.

### Rough spots

- The stand-ins are plain shapes with simple motions. Nobody has looked at one in a picture yet.
- The knight wears dark armour (Halcyon's model) and the fire is Noctara's model: both stand-ins.
- Zone 2 needs its road walked about twice (call 1).
- A herb the battle does not know (zone 4's white sage) is carried and shown, and cannot be used in a fight.
- The old rough spots of step 3 (below) still stand.

### For the hub

- **Zone 4's page:** copy the block marked "fights job: start" to "fights job: end" from `game/pages/zone-3.html` to
  the same spot in `game/pages/zone-4.html` (after the menu's block), and change `zone-3` to `zone-4` in it twice (the
  data file's name, and the zone's name in the last lines). Its numbers are `game/encounters/zone-4.js`. It reads the
  zone-4 job's own spots (`W3D.ZONE4.bramble.at`, `W3D.ZONE4.fire.at`), sets the story's flag `bramble` when the great
  bramble is won, offers the fire from the story's stage 3, and plays the moment `between` between the fire's two
  forms. **None of this has been run on zone 4's page.** Then: `python3 tools/encounter-test.py builds/zone-4.html`.
  To set there: `camp` and `rests` (two spots in two places' paintings), and each ground's `every`.
- **The narrator's lines** (`first-wisp`, `rest`, `not-ready`): the events are sent on every zone's page.
  `window.addEventListener('coven-fights', (e) => { const d = e.detail; ... })`: `d.what === 'first-meeting'` (call
  `d.wait()` at once, say the line, then `d.done()`; six seconds at most); `'rest'`; `'not-ready'` (`d.id`, `d.level`;
  call `d.told()` at once and the fights' own words are not shown). Also `'fight-start'`, `'fight-end'`,
  `'between-forms'`.
- **A story walked with no fights** (`tools/story-test.py`, `?test`): on zones 2 to 4 the fights then stand aside
  (`window.__fightsQuiet`, no `window.__fights`). A check of the fights opens a page with `?test&fights`.
- **Changed in the hub's files:** only `game/people/zone-2.js`, a road stone's `use`, marked "fights job".
- **New files of this job's** for the board's table: `game/encounters/` (all of it), `game/battle/models/stand-in.js`,
  `game/pages/fights-lab.html`, `tools/encounter-balance.mjs`, `tools/encounter-fights-test.py`,
  `tools/encounter-look.py`. `party.setLevel(n)` is new, for the checks and for trying a later zone by itself.
- `?slots=AB` (or `A`, `B`, `none`) at the end of a page's address tries another setting without changing a file.
- The check of zone 1's lost fight wants a spot in the fen again (`tools/encounter-test.py`, part 6).

### For Chris

- Which creatures fill the slots (the eight suggestions are in the table above; none is approved).
- Whether about 45 fights a zone is right when zones 2 and 4 are short walks (call 1).
- How hard the ending should be (call 8), and what the fire's two forms are called.
- What a beaten creature does (the stand-in "goes still"), and every stand-in name and line in `words.js`.
- Whether the coven may rest at the hall, the bunkhouse and the inn (call 10).
- What waits by the road stones (call 6).
- `fights-lab.html` on his laptop and phone: only he can see the fights move and read the frame rate.

## Steps 1 to 3 (written by the fights conversation, up to November 19)

## What it built (steps 1 to 3)

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
