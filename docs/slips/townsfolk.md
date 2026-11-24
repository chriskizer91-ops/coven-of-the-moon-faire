# townsfolk: bodies of their own for the people of the towns (the first part: up to Chris's pictures)

Branch: job/townsfolk      Last commit of code: see `git log` (this slip is committed with it)      Updated: 2026-11-24, 07:40

A sub-agent of the hub's did this, from the hub's brief of November 24. **Everything about how a person looks is a
proposal until Chris says so.** Nothing in a zone page, in the people files or in `game/people/people.js` was changed.

## What it built

The first part of the job: everything up to the two pictures a person that only Chris can make.

- **The list of who needs a body, and who each is:** `game/people/folk/townsfolk/townsfolk.json`. For each person:
  name, trade, zone, the stand-in body worn today, who they are from their own lines only (each fact names its line),
  what the lines say of their look (almost always nothing), what is a guess, and the words for the two pictures.
- **The shapes for 23 people** on the shared template, in the kit's own format: `game/people/folk/townsfolk/shapes/<id>.js`.
  No zone page loads them. `townsfolk-shapes.js` beside them is the same shapes packed for the size page (made by a tool).
- **A small page of its own** that stands the shapes in a row beside one of the Faire's people:
  `game/pages/townsfolk-lineup.html` (4.8 MB built). Buttons choose the row (a zone, or the first seven) and grey or
  first colours.
- **Four tools:**
  - `tools/townsfolk-guides.py`: makes the grey guides with the old Moon Faire kit's own `guides.py` and `shoot.py`,
    read out of the old repo into a scratch folder (nothing is written in the old repo, nothing copied into this one).
  - `tools/townsfolk-pack.py`: packs the shapes for the size page; and writes the folder Chris gets, with its zip.
  - `tools/townsfolk-sizes.py`: joins the size pictures into sheets. `tools/townsfolk-lineup-plan.json` is the plan
    `tools/look.py` takes them by.
  - `tools/townsfolk-test.py`: the job's own check (below).
- **The folder for Chris** (on the hub's machine, not in the repo): `START-HERE.txt`, three size sheets, and 23
  numbered folders, each with the body guide, the face guide, the shape seen all round, the words for both pictures
  and a style example. A zip of it lies beside it.

### To make the folder again from the repo (about 10 minutes, most of it waiting for the lock)

```
python3 tools/townsfolk-guides.py <the old Moon Faire repo> <a scratch folder> <guides folder>
python3 tools/townsfolk-pack.py && python3 tools/build.py game/pages/townsfolk-lineup.html
python3 tools/look.py builds/townsfolk-lineup.html <shots folder> --size 1680x640 --plan tools/townsfolk-lineup-plan.json
python3 tools/townsfolk-sizes.py <shots folder> <sizes folder>
python3 tools/townsfolk-pack.py --for-chris <out folder> --guides <guides folder> --style <guides folder>/style-example.jpg --sizes <sizes folder>/*.jpg
```

## The count

**23 people need a body of their own. That asks 46 pictures of Chris (two each).**

| | Who | Today |
|---|---|---|
| Zone 1 (7) | Nettie, Old Wenna, Mayor Gretch, Hilde, Quill, Tobb, Pell | all wear a fair person's body |
| Zone 2 (5) | Marta, the roadwarden, Brann, Tamsin, the carter | all wear a fair person's body |
| Zone 3 (6) | Ysmera Brightkeel, Old Gil, Tock, Pim, the last passenger, the bramble-cutter | all wear a fair person's body |
| Zone 4 (5) | the watchwoman, a Warden, the pass-keeper, Sorrel, Ede | nothing in `main` yet. On `job/zone-4`, as pushed on November 24: stand-ins too (Ros, Corwin, Odile, Linnet, Bashir) |

- **Why none of the 18 is fine as they are.** The 18 stand on **9** stand-in bodies, and every one is a copy of a
  person who also stands at the Faire. Mayor Gretch, the roadwarden and Old Gil are all Corwin the night watchman.
  Tobb, Brann and Tock are all Otto the baker. Nettie and Marta are both Old Bridie. Old Wenna (eighty) and Ysmera
  (the elegant shipmaster) are both Zofia. Quill and the carter are Kofi. Hilde and Pim wear Ros's very body, the
  passenger wears Linnet's, the bramble-cutter Tully's. Pell and Tamsin are Jory the farm lad, a grown man, shrunk.
  At the ending (zone 4's walk through the camp) Nettie, Gretch, Hilde and Quill stand in the same camp as the people
  they are copies of.
- **Who shares.** Only **the forty held Wardens: one body for all forty.** A helm over a mail hood hides the hair, so
  one painting can be any of them. (A second face for them would be one more picture: Chris's call.) Nobody else
  shares. Sharing a set of shapes between two people would not save Chris a picture: each person is two pictures
  whatever shapes they stand on.
- **Fine as she is: the knight of light on the land in zone 3.** She is a tall pale light there (the hub's call), and
  both people who speak of her say "all light". Her fighting body is the fights job's model
  (`game/battle/models/halcyon.js`), not a person on this kit. She needs no picture.
- **Halcyon needs a body on the land, but not from this kit.** In zone 4 she stands on the Moonwell stair, says twelve
  lines, the light over her face goes out, and at the ending she walks into the camp beside Io ("Same walk"). Chris
  has already said what she is (`docs/decisions.md`): Moon Faire's base doll, which is Io's body, in the paladin
  outfit, with a glow made in code. It is built in the old Envoi (`moon-faire-witches/src/halcyon-paladin.js`, with
  `witches/doll/`; the outfit's light model is about 50,000 triangles). On `job/zone-4` she is Zofia the
  fortune-teller's body standing in a light, as a stand-in. See "For the hub".

## Numbers a person can check

- 23 shapes files, 100 KB in all; 7 to 14 added shapes each (a hat, a coat, an apron and so on).
- Heights from **0.99 m** (Pim, a gnome) to **1.77 m** (Tobb). A witch is 1.65 m: 12 townsfolk are shorter, 2 the
  same, 9 taller. The Faire's eleven run from 1.50 m to 1.73 m.
- At full weight each is 10,300 to 12,400 triangles in its parts (the kit counts 12,800 to 14,600 drawn). The game
  uses a quarter: about 2,600 to 3,700 each, the same as the stand-ins they replace. Not made yet (step 6).
- The page of sizes is 4.8 MB. Its rows draw 65,000 to 90,000 triangles (people at full weight) in 113 to 151 draws.
- The folder for Chris: 23 folders, 119 files, about 24 MB; the zip about 22 MB.

## Calls made here (each one line of data, Chris's or the hub's to overrule)

- **A shapes file for every person, none shared but the Wardens'.** The other choice was the eleven's way, two or
  three people on one set of shapes. The brief asked that nobody be a fair person with a new hat, and that ages,
  builds and heights differ in one street.
- **Heights and builds:** `height`, `build`, `head` at the top of each shapes file. A height is one number.
- **The children and the gnomes carry their own height** (Pell 0.72, Tamsin 0.76, Tock 0.62, Pim 0.60 of a witch),
  with a bigger head. The gnomes' heights are the hub's (0.62) kept nearly as they were. So the `size:` in the people
  files goes when their bodies come in.
- **The order to paint in** (`order` in `townsfolk.json`): the six guides the story job set in bold, then the Warden
  (forty at once, the sight Misthollow is built round), then the three more who stand at the ending, then by zone.
- **The style of the paint: like the Faire's eleven** (lifelike, hand-painted, muted), not like the witches. The
  eleven came out lifelike because ChatGPT never had the style picture the old words named. The words here say that
  look in plain words, and each folder has `style-example.jpg`: three of the eleven seen from behind, cut out of the
  sheets Chris made for them. The other choice is the witches' painted look; then that line of the words changes
  (`style` in `townsfolk.json`).
- **Looks that are guesses about the world,** each marked in `townsfolk.json` under `guesses`: what the moon's people
  look like (Ysmera: silver hair, cool pale skin); what a gnome looks like (big head, beard, pointed cap); the Ember
  Wardens' kit and colours (ember orange tabard with a flame sign, dull gold, brown cloaks, a helm and mail), which
  the roadwarden's old kit and Tamsin's cloak share, and which should agree with Halcyon's paladin outfit.
- **The Warden's face is a man's of about thirty,** because the cast gives this Warden a man's voice. The notes on
  both of the Warden's lines, and the cast's own note, say "she". One of the two should change (see "For Chris").
- **Things at the hip are part of the shape:** Hilde's hammer, Tock's mallet, the bramble-cutter's billhook, Brann's
  tally book, Marta's keys, the watchwoman's horn, the carter's whip, Quill's rope. Nothing is held in a hand (the
  kit's own advice: a held thing swings with the arm). Once painted they stay; say now if one should go.

## What was copied in

Nothing. The kit's tools are read from the old Moon Faire repo when a guide is made, into a scratch folder
(`moon-faire`, commit 6371714). `style-example.jpg` is cut from three of the old repo's prepared skin sheets and goes
only into Chris's folder. So `assets/INDEX.csv` has no new line.

## What was checked, and how

- **`python3 tools/townsfolk-test.py builds/townsfolk-lineup.html`: 385 checks pass** (285 without the page).
  - The list against the game's own files: all 18 townsfolk who stand in zones 1 to 3 are on it, each with the body the
    people file gives them today; all 6 speakers of zone 4's own places are on it or told apart (Halcyon); all 109
    lines it cites are real lines; everyone has shapes, words for both pictures and a place in the order.
  - In a browser: all 23 build with no error, stand as tall as the list says, and no two are twins.
- **Every shape was looked at** from the front, three-quarter, side, back, one walking frame and the face, with the
  kit's own picture taker, over three rounds. Fixed on the way: bibs and coats the body poked through (the template's
  chest reaches 13.1 cm forward at chest height, more than the kit's notes say: measured, and every layer cleared
  against it); a mayor whose side hair stood out like ear flaps (now a cap); a sailor whose breeches read as a skirt;
  the ready-made beards, which stand out like a box (each beard here is its own shape).
- **Every guide's chest and back were looked at close up** for flecks of body showing through. None left on the
  chests. Small flecks remain at the tops of the shoulders on Tobb and Brann (the template's puffed sleeve cap), as on
  the Faire's baker.
- **The size page** was built and opened at 1680 by 640 (the sheets), 1280 by 720 and 412 by 880, as a check (`?test`).
  The only page message is the harmless "willReadFrequently" warning.
- **The builder** passes the page: nothing is fetched from the web or another file.

**Not checked:**

- **Motion.** A browser with no screen cannot show it. Only the standing pose and one walking frame were seen. A
  cape, a hood or a shoulder mantle may be cut through by an arm when it is raised to wave or point (the watchwoman,
  Ysmera, the bramble-cutter, Nettie and Old Wenna have one). The kit's eleven have the same limit with coats.
- **A quarter of the triangles.** The lighter weights are step 6. Two of the eleven lost their waist at a quarter
  and were dropped, so a shape here could need a touch then.
- **Any painting.** ChatGPT was not run. Whether it keeps to these guides as well as it kept to the eleven's is
  unknown until the first pictures come back. **Do the first person and send it back before doing the rest.**
- **Frame rate.** Not measurable here. The new bodies should cost what the stand-ins cost.
- **The size page on a real phone.** Held upright, a row of eight people is too small to read. It is a tool for
  making the sheets, not something Chris needs to open.

## What is rough

- **Hair is a plain shape round the head** and reads as a cap until it is painted (the kit's known limit). Bare-headed
  people (Tobb, the roadwarden, Hilde, the passenger) show it most.
- **Under men's and children's clothes the body is still the Jester's.** Tunics and smocks are cut straight to hide
  it, which makes chests deep.
- **The children are small adults with a bigger head.** The face painting is what will make them children.
- **Thin things are plain tubes:** straps, the chain of office, the rope. The paint will carry them.
- **The watchwoman's horn strap comes out from under her cape** (a strap over the cape cut through it).

## A fault found in the shared template (it is in the game today)

**A person made smaller than a witch stands with bent knees and elbows.** The template's limb solver measures the reach
from hip to foot in the world, where a small person's is short, against leg bones it remembers at full size, so it
bends the knee to fit. At 0.94 (Old Gil) it shows a little; at 0.72 and 0.62 (Pell, Tamsin, Tock, Pim: the stand-ins
standing in the zones now) they crouch with their hands on their hips. A person taller than a witch is not harmed.
The kit's own pictures show it; the size page stands everyone in the guide's pose, so its sheets do not.

The fix is one line in `game/witches/kore/jester_kit.js` (the hub's file, copied from the old Envoi), in `solveLimb`:

```
-    _va.subVectors(T, A); let d = _va.length(); const mx = ...
+    _va.subVectors(T, A); let d = _va.length() / (root.scale.y || 1); const mx = ...      // Coven: a small person's reach is measured at the template's size
```

Tried in a scratch copy of the kit, and looked at: Pell, Tamsin, Tock, Pim and Old Gil then stand straight, and Tobb
(taller than a witch) stands as before. A witch divides by 1, so she cannot change. Not tried in a zone page.

## Unfinished: the steps after Chris's pictures (steps 4 to 7 of the eleven's way)

1. **Take the pictures in.** Chris sends `<id>-body.png` and `<id>-face.png`. The kit's `prep_skin.py` wants them as
   `<id>-A-body.png` and `<id>-A-face.png` in one folder, and each person's guide as `people/skins/<id>/guide.png` in
   its scratch tree (that is `<id>-body-guide.png` from `tools/townsfolk-guides.py`). It needs numpy, OpenCV and scipy.
   It measures the figures against the guide, spreads the edge colours, paints out the small face, and writes two
   `.webp` pictures and a small fit file for each person.
2. **Lay them on and finish the fit** (the kit's `SKIN-KIT.md`): look at each painted person and write the small skin
   file: skin colour for neck and hands, parts to make one flat colour (hair, beards, small things that stick out),
   how matt each part is, and hats moved down (the kit's hats sit about 3 cm high). The eleven had a Claude model do
   this through Chris's key at about 11 cents each. A sub-agent can do it by eye with the kit's picture taker, as the
   shapes were done here, with no key.
3. **The review beside the others** (`REVIEW-KIT.md`): everyone on one ground line beside the fair folk and a witch;
   heights, builds, head sizes, hats. The size page here can grow a "painted" look for it.
4. **The lighter weight** (`WEIGHT-KIT.md`, `make_weights.py`): for each of the 23 sets of shapes, which parts to leave
   off and what share of each to keep at a quarter. The paint needs no baking.
5. **Wiring** (`make_wiring.py`): each person's talking loops, hello, fidgets, pace and moods, chosen from the one
   shared library the game already has (`game/people/folk/emotes.js`). `game/talk/cast.js` gives each speaker's pace.
6. **Packing for the game.** New files only, which add themselves the way `greyhat_npc.js` does:
   - `game/people/folk/townsfolk/town_npcs.js`: adds the 23 to `window.MF_NPCS.people` and their weights to
     `window.MF_NPCS.weights`.
   - the pictures, by zone, so a page carries only its own people: `town_tex_z1.js` to `town_tex_z4.js`, each adding
     to `window.MF_NPC_TEX`. By the eleven's measure a painted person is about 0.19 MB: about 1.3 MB for zone 1,
     1.0 for zone 2, 1.1 for zone 3, 1.0 for zone 4, and 0.8 more wherever the ending's four (Nettie, Gretch, Hilde,
     Quill) stand again.
7. **Then the people files** ("For the hub").

## For the hub

**What changes when the bodies are done** (nothing below is changed yet):

- **The `body:` of each person.** Suggested ids: `town-<id>`.

  | File | Person | `body:` today | becomes | and |
  |---|---|---|---|---|
  | `game/people/zone-1.js` | quill | `chestnut-roaster-opus` | `town-quill` | |
  | | nettie | `old-lamplighter-opus` | `town-nettie` | |
  | | hilde | `pie-seller` | `town-hilde` | |
  | | gretch | `old-night-watchman-opus` | `town-gretch` | |
  | | wenna | `fortune-teller-opus` | `town-wenna` | |
  | | tobb | `fair-baker-opus` | `town-tobb` | |
  | | pell | `farm-lad` | `town-pell` | take out `size: 0.72` |
  | `game/people/zone-2.js` | roadwarden | `old-night-watchman-opus` | `town-roadwarden` | |
  | | carter | `chestnut-roaster-opus` | `town-carter` | |
  | | marta | `old-lamplighter-opus` | `town-marta` | |
  | | brann | `fair-baker-opus` | `town-brann` | |
  | | tamsin | `farm-lad` | `town-tamsin` | take out `size: 0.72` |
  | `game/people/zone-3.js` | cutter | `gate-keeper` | `town-cutter` | |
  | | ysmera | `fortune-teller-opus` | `town-ysmera` | |
  | | gil | `old-night-watchman-opus` | `town-gil` | |
  | | tock | `fair-baker-opus` | `town-tock` | take out `size: 0.62` |
  | | pim | `pie-seller` | `town-pim` | take out `size: 0.62` |
  | | passenger | `ballad-singer` | `town-passenger` | |
  | `game/people/zone-4.js` (the zone-4 job's; as on `job/zone-4`, November 24) | passkeeper | `old-lamp-seller` | `town-passkeeper` | |
  | | watch | `pie-seller` | `town-watch` | |
  | | sorrel | `ballad-singer` | `town-sorrel` | |
  | | ede | `ribbon-dyer` | `town-ede` | |
  | | warden (the one who speaks) | `old-night-watchman-opus` | `town-warden` | |
  | | the forty, in the thing `wardens` | twenty baked copies each of `old-night-watchman` and `old-night-watchman-opus` | forty of `town-warden` | one line: the list of two ids becomes one |
  | | the thing `halcyon` | `fortune-teller`, in a light | her own body (below) | |

- **Each zone page** gets two script lines after `../people/folk/greyhat_npc.js` and before `../people/folk/npc.js`:
  `../people/folk/townsfolk/town_npcs.js` and that zone's `town_tex_zN.js`. The page where the ending is played also
  needs the pictures of Nettie, Gretch, Hilde and Quill.
- **The template fix above** (`game/witches/kore/jester_kit.js`, one line). Without it Pell, Tamsin, Tock and Pim
  crouch in their new bodies as they do in their stand-ins today. It is worth making now: it mends the stand-ins too.
- **Forty Wardens in one street.** The zone-4 job already stands them cheaply: it makes one painted person, bakes it
  still, and stands twenty copies (twice, from two bodies). With the Warden's own body that is one bake and forty
  copies. A held Warden is then exactly the pose it was baked in: bake `town-warden` standing at rest.
- **Halcyon on the land in zone 4, and at the ending.** By Chris's decision she needs: the doll, the paladin outfit
  and `halcyon-paladin.js` copied in from the old Envoi, and the zone-4 job's `halcyon` thing to make that body in
  place of `MF_NPC.make('fortune-teller')` (it already turns the light off after the letter and takes her to the
  ship). Her face with the light out is Chris's (below). This was not looked into past the first lines of
  `halcyon-paladin.js`. The fights job's battle uses the older dark-armoured Halcyon
  (`game/battle/models/halcyon.js`): the two should become one.
  **A cheaper way, if Chris would rather:** a 24th body on this kit (the Warden's kit without the helm, a woman of
  about forty, two more pictures). It was not made, so as not to settle his call by building it. She would then walk
  as the fair folk walk, not as Io does, and Nettie's "Same walk" would be less true.
- **Zone 4's people file is on `job/zone-4`, not in `main`.** Its ids are the list's ids (`passkeeper`, `watch`,
  `sorrel`, `ede`, `warden`), so nothing needs renaming.
- **The board says "18 wear a fair-folk shape".** It is 18 in zones 1 to 3, and 23 with zone 4's five.
- `tools/townsfolk-test.py` can join the hub's checks: its list part needs no browser and takes a second.

## For Chris

1. **The pictures: 46, two for each of 23 people.** If there is only time for some, the first seven (14 pictures):
   Nettie, Old Wenna, Marta, the roadwarden, Ysmera, the watchwoman, a Warden. **Do one person first and send it back**,
   so the fit can be tried before the rest are made.
   **How long: a guess.** The old notes do not say how long the eleven's 22 pictures took; they say only that all 22
   were made on one day, November 13, between the words being written and the people being finished that evening. At 3
   to 5 minutes a picture, the first seven people are about an hour and all 46 are two and a half to four hours, more
   if ChatGPT makes him wait between pictures, and more for any it has to make twice.
2. **The sizes.** The sheets show everyone beside Otto. Too tall, too short, too wide: say so before painting.
3. **Every look is his to change,** in the words, before he paints. Three are about the world, not one person:
   what the moon's people look like; what a gnome looks like; the Ember Wardens' colours and kit.
4. **The style:** like the Faire's eleven (lifelike), or like the witches (painted)?
5. **The held Warden who speaks:** the voice is a man's; the notes on the lines say "she". Which is it? And should
   the forty have a second face (one more picture)?
6. **Halcyon's face once the light is out.** His note of November 16 said to repaint the doll's face. She is seen
   close to at the end, beside Io.
7. **The things at the hip** (hammer, mallet, billhook, tally book, keys, horn, whip, rope): keep them, or plainer?
