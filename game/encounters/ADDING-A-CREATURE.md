# Adding a creature

What to do when a real creature is ready to take a slot. Written by the fights job (November 24, 2026).
Chris decides which creature goes where. Nothing is copied from Aethermoor M7 until he has said so, creature by
creature (`docs/decisions.md`, November 23).

## What a slot is

Every zone has two slots for a new creature, A and B, in **one file: `game/encounters/slots.js`**.

- **A is on.** The game is balanced with it in. **B is off.** Turning it on is one word (`on: true`) and one check.
- Until a real creature comes, a slot is a **stand-in**: a plain dark shape with two pale eyes that can be fought. It
  is shown as "Strange creature".
- Each slot has a **job in a fight**, and the stand-in already does that job:

| Zone | Slot | Its job | Suggested for it (not approved) |
|---|---|---|---|
| 1 | A, on | The heavy one: slow, tough, one big blow you can see coming | Willow-Wight |
| 1 | B, off | The swarm: three small quick ones | Briarling |
| 2 | A, on | The cold-bringer: slows and weakens the four, with a wraith beside it | Mirage Wisp |
| 2 | B, off | The pair: two that are much stronger while both stand | Thornhound |
| 3 | A, on | The armoured one: blades slide off it, spells do not | Sapwight |
| 3 | B, off | The leaper: goes past the front for whoever stands at the back | Rime Wolf |
| 4 | A, on | The light-thief: drinks the four's magic, with a frost wisp beside it | Rime-Wraith |
| 4 | B, off | The big one: rare, a long fight, worth three ordinary ones | Peak-Troll |

The suggestions are the hub's, in `docs/foes-from-m7.md`.

## The balance takes care of itself

A slot's fight always gives **the same experience and shards as the ordinary fights it takes the place of**, on that
ground, at those levels (`game/encounters/draw.js`). So a new creature never changes how many fights a level takes.
What you set by hand is only **how dangerous it is**: its Life and how hard its blows land.

## The steps

**1. Chris says which creature, and for which slot.** The hub writes it in `docs/decisions.md`.

**2. Copy its finished model in** (and only that: not its sculpt, its sheets or its build tools), and add its line to
`assets/INDEX.csv` in the same commit. Where it goes: `game/battle/models/<its-name>/`.

**3. Make its model file**, `game/battle/models/<its-name>.js`. It must give the battle what every foe's model gives
(the stand-in, `game/battle/models/stand-in.js`, is the shortest example, 100 lines):

- `root`: the thing to draw, standing on the ground at 0, facing +z, in metres;
- `play(name)`, `busy`, `action`, `progress`, and a list `ACTIONS` saying how long each motion lasts and the moments
  its blows land;
- the motions the battle asks for by name: `appear`, `hurt`, `block`, `die`, `stagger`, and one for each of its moves;
- `anchor('chest')`, `anchor('head')`: where a blow lands on it;
- `animate(...)`, called every frame; `guard(on)`; `reset()`.

For a creature from Aethermoor M7, what this takes is in "A creature from Aethermoor M7", below (tried once).

**4. Change the slot's lines in `game/encounters/slots.js`:**

- `model`: the name of the new model's maker in place of `makeStandIn`, and its size (`tall`, `shadow`, `near`: how
  close it walks up to strike).
- Each move's `act`: the name of the creature's own motion for that move.
- The moves' names, in `game/encounters/words.js` (`slots`): its own name in place of "Strange creature", and its
  moves' names. A name Chris has not approved stays marked STAND-IN.
- Leave its job alone if you can. If the creature should do something else in a fight, change its moves here: the
  rules it may use are listed at the top of `slots.js`. No rule in `game/battle/` has to change.

**5. Add the model file to the pages**, beside `stand-in.js`, inside the lines marked "fights job" in
`game/pages/zone-N.html` (the zone it lives in) and in `game/pages/fights-lab.html`.

**6. Set how dangerous it is.** Run:

```
node tools/encounter-balance.mjs --slots
```

It plays the creature's fight 500 times against the ordinary fights of the same ground and prints three numbers for
each: how often the careless player loses, how often the attentive player loses, and how long a fight takes. Change
the creature's `hp` (how long) and its blows' `hits` (how dangerous) in `slots.js` until its line is close to the
ordinary one. Close means: within 12 points for the careless player, within 5 for the attentive one.

**7. Run the whole check:**

```
node tools/encounter-balance.mjs
```

Read the last line. "every target met" means: each zone still takes about 45 fights, each kind of player loses about
as often as before, and the three settings (A on; A and B on; neither) stay close to each other.

**8. Look at it and fight it:**

```
python3 tools/build.py game/pages/fights-lab.html
python3 tools/encounter-fights-test.py builds/fights-lab.html --only zone-1-A      # plays it to its end, no screen
python3 tools/encounter-look.py builds/fights-lab.html <a folder> --only zone-1-A  # a picture
```

Then build its zone's page, run `python3 tools/encounter-test.py builds/zone-N.html`, and send Chris
`fights-lab.html` to try it on his laptop and phone. Only he can see it move or read its frame rate.

## A creature from Aethermoor M7

**Tried on November 24 with the Willow-Wight, outside the repo (nothing was copied in). It works, with the changes
below.** It was drawn and moved in this game's battle, fought to its end in zone 1's slot A, with 0 page errors.

What a full-detail M7 creature is: a folder `prototypes/foe-hd/foes/<name>/assets/` with the light model
(`light.bin`), its bones (`light.json`) and four pictures; and a moves file for its body plan
(`prototypes/foe-hd/kit/js/moves/<plan>.js`). The Willow-Wight: 30,634 triangles, 11 bones; model 481 KB, pictures
547 KB (colour and bump at 512, shading at 1,024, glow at 256). **Inside a page it adds about 1.4 MB.**

What it took:

1. **Its moves file is used as it is.** It only turns bones by name, and needs nothing from M7's 3D library. The one
   change: the word `export` is taken off, since this game loads scripts, not modules.
2. **M7's loader (`kit/js/loader.js`, 140 lines) is written again for this game's older 3D library** (three.js r128
   where M7 has 0.170), about 45 lines. Four things differ:
   - a material must be told it is on a skinned model (`skinning = true`) and that the model brings its own tangents
     (`vertexTangents = true`);
   - the shading picture needs a second copy of the model's picture coordinates (`uv2`);
   - no colour space is set on the pictures: the battle draws every model as painted, so this one is too;
   - M7's `SkeletonUtils` (for a second copy of one creature) is not there: each one is built from the shared model.
3. **The model is packed and must be unpacked when the page opens.** That needs a small decoder (meshoptimizer's, MIT
   licence, 21 KB). It took 45 thousandths of a second here. Two things to know:
   - it is ready a moment after the page opens, not at once, so a page must wait for it before its first fight;
   - its file has two web addresses in comments, which the builder stops at: take them out.
   The other way, not tried: unpack once with Node when copying the creature in, and keep plain numbers (a bigger file,
   nothing to wait for).
4. **A join of about 40 lines** between M7's way of moving a creature (`pose(move, how far through, clock)`: a pure
   pose) and this battle's (`play(name)`, `busy`, `progress`, the list of motions and when their blows land, the
   anchors). Each of this battle's motions is given one of the creature's moves: `hurt` its Hit, `die` its Fall, and
   for the slot's own moves the creature's own (the Willow-Wight: Lash, Bough-Fall, Weep). The charged blow that can be
   seen coming is the first two fifths of Bough-Fall, held.
5. **The model and its pictures go inside a script file** (as text), because the builder only puts pictures inside a
   page when a script names them, and a page opened from a file cannot read another file.

**What does not come across:** M7's numbers (it fights with dice; this game sets its own in `slots.js`), and its look
exactly: M7 manages colour and this game's battle does not, so the same model is a little darker and flatter here.
**Not seen by anyone:** it moving, or its frame rate. The pictures are stills from a browser with no graphics card.

The rigid-piece kind (the wraiths, the winged: built in code from M7's hero kit) was **not tried**. It is not a file,
so it would need that kit brought over as well.

## Turning slot B on

In `game/encounters/slots.js` set that slot's `on: true`, then run step 7. With both on, each takes about one fight in
six where it lives. To try it without changing a file, open a zone's page with `?slots=AB` at the end of its address.
