# zone-1: all of zone 1 on one land

Branch: job/zone-1      Built by: the hub      Updated: November 18, 2026, night

**State: part done.** All six places stand on one land and are joined by roads, and the game starts in the Moon
Faire's camp. Still to come before this is milestone 2: a choice of who walks, the zone's shape taken from the 3D map,
the fen's own ground round Bogmire, and the long road out toward zone 2.

Chris ran the six places (before the camp) at 144 frames a second on his laptop and 60 on his phone.

## Added on November 23, 12:13: the narrator's recordings, and four ways it could sound

- **43 of the narrator's 48 lines are in,** as recorded (zone 1: 18, zone 2: 14, zone 3: 11). The five whose words
  changed were left out; Chris is having them made again. Until then those five show in words only.
- **Kept twice:** as they came in `game/people/recording/narrator-raw/`, and for the game in `game/talk/audio/zN/`
  beside the people's lines. So the game's copies can be made again another way without losing the first.
- **Measured (not heard):** the narrator is as loud as the people's voices (both -18 LUFS, a measure of loudness),
  one channel, the same kind of file. No line stands out as loud or quiet. Each line's real length is now in
  `game/people/narration.js`.
- **`tools/narrator-sound.py`** takes recordings in and makes them one of four ways: A as recorded; B close and
  warm; C by the fire (B in a small warm room, a little different in each ear); D all round you (C spread wide).
  Each is brought to the same loudness as the people's voices. C and D are two-channel files, half as big again.
- **`game/pages/listen-narrator.html`** (builds to 1 MB): a page to choose by ear. Two narrator lines, each of the
  four ways, each followed by two of the coven as they are now. Checked at a phone's width: plays through, nothing
  wider than the screen, 0 page errors, fetches nothing.
- **Not checked: how any of it sounds.** Nobody here can hear. The choice is Chris's.

## Added on November 23, afternoon: zones 2 and 3 speak

- **Six people stand in zone 2 and seven in zone 3,** with the story job's recorded lines (120 and 124, every one
  with its sound in the page). Zone 2: the Grey Hat and the roadwarden at the Warm Roads camp, the carter by the
  broken cart on the road east, Marta, Brann and Tamsin in Dawnroost. Zone 3: the Grey Hat at the northern camp,
  the bramble-cutter at Eldergrove's edge, and Ysmera, Old Gil, Tock, Pim and the last passenger in the shipyard.
  Who stands where is in `game/people/zone-2.js` and `zone-3.js`.
- **The story engine now reads each zone's rules from data** (`game/people/story.js`; the rules sit in each zone's
  people file as `W3D.STORY['zone-N']`). Zone 1's rules moved into `game/people/zone-1.js` unchanged.
- **Zone 2 plays through:** the landing; the Grey Hat sends the coven to the roadwarden; he asks; the three dark road
  stones on the Ember Line road each get a button, "Light the road stone", and glow amber once lit; with three lit,
  coming into Dawnroost moves the story on; Marta; the forty beds; the living node; the leaving.
- **Zone 3 plays through, in the order the map gives:** the landing; brambles on the road; Eldergrove's edge; a small
  fire at its east end; the first sight of the shipyard from the causeway; the shipmaster and the Grey Hat at the
  slip; back up to the crossroads, where a tall pale light stands on the east road; the knight; back to the
  shipmaster for the name; the leaving. The Grey Hat goes from the camp to the shipyard once his first talk is
  heard, when the coven is too far off to see him go.
- **New: things on the land** (`game/people/things.js`): something the coven can walk up to and use with the same
  button as talking, or that shows what the story has done. Zone 2's road stones and zone 3's knight's light.
- **A person's next line** now puts a line that belongs to the present stage alone before the general ones, so the
  Grey Hat says "We can fly" first once the node holds.
- **Five of the narrator's lines changed to fit the map** (none was recorded yet): `z2.narrator.04`, `z3.narrator.09`,
  `.10`, `.12`, `.13`. The recording order was written again (`game/people/recording/`).
- **Checked:** `tools/story-test.py` (new) builds every person and plays each zone's story from the landing to the
  leaving: all passed, 0 page errors. `tools/people-test.py` still passes on zone 1, and `tools/zone-test.py` on
  zones 2 and 3. Sixteen pictures of the people, the stones and the light were looked at.
- **Not checked:** the sound itself, the frame rate with people in, and the pages' size on the phone (89.3 MB and
  86.7 MB). Only Chris can.
- **Stand-ins, until the fights job reaches these zones:** there are no fights in zones 2 or 3. The night at the
  living node and the knight at the crossroads are "met" by walking up to them: the coven speaks before, the
  narrator and the coven after. Lines that wait on a fight just won or lost, or on the coven's level, are not heard.
- **Rough or not done:** everyone wears one of the fair folk's shapes (Tamsin is the farm lad made small; the two
  gnomes are the baker and the pie-seller made small). The knight has no body, only a light. The ship is nowhere to
  be seen at either camp or on the slip. No flight in or out, so the two flight lines each are not heard.

## Added on November 23: zones 2 and 3, on the map

The same hub that does zone 1 does these (so they are written up here).

- **Zone 2, the Warm Roads and Dawnroost** (`game/places/zone-2.js`, `game/pages/zone-2.html`). Five of the new
  Envoi's places, as they are, each on its own pin on the map at one third size: the Warm Roads camp (where she
  starts), the Ember Line road 700 m to the east-north-east, the forest road, Dawnroost, and Dawnroost's living node
  north of the town. Four roads join them (565 m, 896 m, 740 m and 292 m). The camp to the node is 2.5 km of walking.
- **Zone 3, the northern wilds and the shipyard** (`game/places/zone-3.js`, `game/pages/zone-3.html`). Five places:
  the northern camp (the start), Eldergrove's edge, the cold moor, the northern crossroads on its hill, and the
  shipyard. Roads of 661 m, 849 m and 852 m join the first four. From the crossroads the road goes 870 m down the
  hill to a shelf above the shore, then **a stone causeway 330 m long slopes down over the sea** to the shipyard's
  own bridge. The camp to the shipyard is 3.6 km of walking, and the land falls from 83 m up at the crossroads to
  the sea 67 m below the camp.
- **Each wild place is opened at its gates.** These places end in a ring of thicket with a marked way out. The zone
  file adds a strip of walking ground from each way out to the place's edge, and takes away the trees standing on it.
- **Three changes to the land engine** (`game/engine/land/land.js`, `zone.js`), all needed by zone 3:
  - The land was not drawn anywhere lower than 50 m below the start (that number marked "under a place"). Zone 3's
    shore is 67 m below. The mark is now 9,000 m down.
  - A road can be given `wet` (how dear a step over water is when it finds its way) and `stoneAll` (stone underfoot
    from end to end, for a causeway).
  - A land can have no leafy trees (`noLeaf`: firs and bare thorns only, for the north).
  - On a causeway over water she is kept to its top.
  - A place can be marked `sea`: it stands in the map's own water, so that water comes right up to its edge.
- **Checked:** `tools/zone-test.py` passes on all three zones after these changes (every road walked at a sprint,
  no jump in her height, she ends on the next place's ground, 4,000 spots obey the rules, no page errors). Twelve
  pictures of zone 3 and eight of zone 2 were looked at.
- **Not checked:** the frame rate on either page (only Chris's laptop and phone can show it). Zone 3's shipyard road
  is steep: 13 to 18 m in every 100.
- **Not in these two pages yet:** people, voices, the story, the narrator, fights. They are land to walk only.
- **Sizes:** zone 2 is 81.8 MB, zone 3 is 78.9 MB.

## What it built

One page: **`game/pages/zone-1.html`**. Build it with `python3 tools/build.py game/pages/zone-1.html`; the file to
open is `builds/zone-1.html` (71.0 MB, everything inside).

- **The Moon Faire's camp, where the game starts**: 70 m west and 128 m south of Wickhollow's square, in a levelled,
  trampled meadow off the south road. 43 pieces of Moon Faire's fair kit in Chris's painted skins: the big top, two
  round tents, two square tents, four stalls, a booth, two wagons, the well, the gate, an oven cart, a pie cart, two
  braziers, 14 lantern posts, crates, barrels, bales and tables. 2,724 triangles, two draws. Its lanterns light the
  ground between the tents and light Io. None of it can be walked through.
- **Six places on one land, 955 m by 675 m**, walked between with no fade:

  | Place | Where its middle is (metres east, south of Wickhollow's square) | How it is reached |
  |---|---|---|
  | Wickhollow | 0, 0 | from the camp: out of its gate, up the south road |
  | The Thornwood | 226 east | east over Wickhollow's bridge, 85 m of road, in at its west gate |
  | Bogmire | 463 east, 9 south | out of the Thornwood's east gate, 95 m of road |
  | The fen's dark heart | 464 east, 159 north | 75 m up Bogmire's north road |
  | Io's cottage | 30 west, 235 south | 142 m down Wickhollow's south road, past the camp |
  | The jetty | 190 west, 280 south | 110 m along the cottage's west road |

- **The Thornwood is the old Envoi's own place now**: its bridge and lantern, its stream in its ravine, its standing
  stones, shrine, ruined walls and pool. The stone ring and pool made up for the first test are gone from this page.
  It is a wood inside a thorn hedge with a gate west and a gate east; its trails now run on to the edge of its ground.
- **One night for the whole zone.** One moon, one sky, one fog. The fog comes round to each place's own as she nears
  it: Wickhollow's ends at 115 m, the Thornwood's at 42, Bogmire's at 100, the dark heart's at 78 (and goes green-black).
- **Each place's water carried on by rule** where it reaches the edge of its ground (the Thornwood's stream runs on
  north and south to the land's rim).
- **A town's stone runs out along its road** (and in along the road arriving), then wears down to earth.
- **The land rises to meet a boardwalk** where one reaches a place's edge (the dark heart's road).
- **The Flipbook look's counter** now counts the whole frame (it showed "0 triangles, 1 draw call", as Chris saw).

Where the new code is:

| File | What it is |
|---|---|
| `game/engine/land/zone.js` | New. Builds each place, sets it at its spot, shares the night, the sky and the textures, and answers the walker for all of them |
| `game/engine/land/land.js` | Reworked from one place to many: meets every place's edge, a ground material per place, the water rule, the stone rule |
| `game/places/zone-1.js` | New. Which places, where, the roads, the land, and the camp's layout |
| `game/fair/fair.js` | New. Gives Moon Faire's fair kit this game's night, and sets the camp down |
| `game/fair/ow-kit.js`, `game/fair/data/` | Moon Faire's fair kit and its 11 pictures, unchanged |
| `game/places/wickhollow-open.js` | The four changes that open Wickhollow, moved out of the first test's file so both pages share them |
| `game/places/thornwood.js` and four more, with their `-trees.js` | From the new Envoi, unchanged |
| `game/data/maps-*.js` | Each place's walking areas |
| `tools/zone-test.py` | New. Walks between the places and checks it by numbers |

## Changed on November 23, after Chris first heard it: nobody speaks from a distance

Chris heard the first build with voices. The opening made no sense to him: several witches spoke at once, with
nothing to set the scene, and people of the camp called out over them. His word, and what was done:

- **A person speaks only when the coven walks right up to them.** To arm's length, 1.5 m. The first time, they say
  their first talk by themselves and the words show. After that the Talk button (within 2.3 m) is for more.
  The calls "as the coven walks past" are gone. A person already met says their short call when she walks right up
  to them again (hub's call: Chris did not ask for it; easy to take out).
- **A shout from far off, for the story's sake,** would be its own thing. None is made yet.
- **A narrator's voice for the story's set points.** The talk box can now show narration: no name, set apart.
  Before the coven speaks at a set moment there is a line of narration. For now these are stand-ins in words only,
  with no voice (`game/people/zone-1.js`); the story job is asked to write and record the real ones.
- **A start screen with one button, "Begin".** Nothing speaks until it is tapped. (A phone also only plays sound
  after a tap.) It says "Carry on" when the opening has been heard before.
- **Chris wondered whether the party speaks too much.** Not changed: he was not sure. It is put to the story job.
- **Checked** (`tools/people-test.py`, all passed): at 3 m nobody speaks; at 1.3 m Kofi's first talk begins by
  itself; walking up again later he says his short call. The start screen and the narration were looked at in the
  headless browser, opened as a player would.
- **Not checked:** the sound, as before.

## Added on November 23: the story's lines and voices are in, and nineteen people stand in zone 1

- **Every person in zone 1 speaks aloud.** The story job's 236 lines for zone 1 (`game/talk/zone-1.js`) and their 236
  recordings (`game/talk/audio/z1/`, 8.4 MB) are in the page. `tools/voice-list.py z1` lists the recordings for the
  page (`game/people/voice-z1.js`) and says if any line has none; the builder now puts MP3 inside the one file.
- **Nineteen people stand in zone 1.** The eleven fair folk as before. New: the Grey Hat on the jetty's pier, on his
  own painted body (`game/people/folk/greyhat_npc.js`, from Moon Faire); Quill at the jetty; Nettie, Hilde and Mayor
  Gretch in Wickhollow; Old Wenna, Tobb and Pell in Bogmire, each where the new Envoi stands them in the painting.
- **Which line comes next** (`game/people/story.js`), by the story job's own rules: a story talk first, then the
  first hello, then the most particular line not yet heard; nothing repeats until all of a person's lines for that
  time are said. Each line shows its own speaker's name, so a witch can answer inside a talk.
- **The stage of the story** is kept in the browser: 0 dusk; 1 when the Grey Hat has asked for his lamps; 2 when
  Nettie has known Io; 3 when Old Wenna has told of the great wraith; 4 when the great wraith is released.
- **Lamps home:** one for every four fights won in the wilds, up to eleven; the twelfth with the great wraith.
- **The coven speaks at seven set moments,** once each: the opening; near Io's cottage; near the Thornwood; near
  Bogmire; near the great wraith's spot; after it is released; and the leaving, after Europa sews the flames.
- **A person calls out as the coven walks past,** once each time she comes near from far off.
- **Checked** (`tools/people-test.py`, all passed, 0 page errors): all nineteen are there, on the ground, in the open;
  walking up shows the button; a talk shows the words and ends; all 236 lines have their recording in the page;
  every person has something to say at every stage; the Grey Hat's first talk is his four-line asking and moves the
  stage on, and so do Nettie's and Old Wenna's; at the end the talk at the jetty is Europa sewing the flames; a
  person says each thing once before any comes round again; each of the seven moments plays once. `tools/zone-test.py`
  still passes. The page is 97.0 MB (it was 85.7).
- **Not checked: the sound itself.** A browser with no screen plays nothing, so nobody has yet heard a line in the
  game. Whether the voice starts when it should, is loud enough beside the fights' music, and whether a phone lets
  it play, only Chris can tell. Also not checked: the frame rate, and the page's size on the phone (97 MB).
- **Rough or not done:**
  - Tully's body is a man in a flat hat; Tully's voice is a woman's.
  - Seven townsfolk wear the fair folk's other shapes, so some look like someone at the Faire.
  - She can walk through a person who stands inside a town (not in the camp or on a road).
  - The pale moth after the great wraith is not on the land yet, though Kore says "Watch the moth".
  - Io's cottage has no lit gate lamp; Old Bridie has no lantern; the Grey Hat has no ship behind him.
  - Nothing happens after the leaving: there is no flight to zone 2 yet.
  - The people stand still.

## Added on November 19: the people of the Moon Faire, and talking to them

- **Eleven people stand in the land,** on Moon Faire's painted bodies (`game/people/folk/`, copied from the new
  Envoi's copy; about 2,500 to 2,900 triangles each). Nine are in the camp at their stalls: Odile the lamp-seller,
  Bashir the ribbon-dyer, Zofia the fortune-teller, Linnet the ballad-singer, Otto the baker, Corwin the night
  watchman, Ros the pie-seller, Tully the gate keeper, Kofi the chestnut roaster. Old Bridie the lamplighter is on
  the south road, two thirds of the way to the cottage. Jory the farm lad is by the lake on the jetty road.
  Who stands where is data: `game/people/zone-1.js`.
- **Talking** (`game/people/people.js`): within 3.4 m of a person a Talk button shows at the foot of the screen
  ("Talk to Odile"; E or Enter on a laptop). The person turns to her, greets her the first time, and their words
  show over the button. The talk ends by itself, or when she walks 6.5 m off.
- **The words are stand-ins,** one or two each, until the story job's lines come (`docs/lore/story-brief.md`).
- **A recorded line plays when there is one:** the talk looks for the line's sound by its id. None is in yet.
- **A person is built only when she first comes within 75 m,** one at a time; drawn within 58 m; moves within 42 m.
  Building one took about 0.6 s in the headless browser, which has no graphics card. On a real laptop or phone it
  should be much quicker, but it has not been measured there.
- **Checked** (`tools/people-test.py`, all passed, 0 page errors): each of the eleven is there, stands on the ground,
  in the open, more than 1.2 m from anyone else; walking up shows the button with their name; a talk shows their
  words and ends by itself. `tools/zone-test.py` still passes. The page is 85.7 MB (it was 83.5).
- **Not checked:** the frame rate with nine people in view in the camp; whether making a person causes a hitch on
  a real device; the Talk button under a thumb on a phone.
- **Rough or not done:** the people stand still (no walking about, sitting, or talking to each other: Moon Faire's
  minds are not brought over yet); nobody is seen past 58 m; the Grey Hat is not at the jetty yet; the townsfolk
  are not in Wickhollow or Bogmire yet; Old Bridie has no lantern post and Jory no fire.

## Rebuilt on November 18, night: the land is the map of Aethermoor at one third size

Chris, 21:04: the world the player walks must be built and mapped to match the 3D world map of all of Aethermoor,
the map of all his stories. He chose one third size. So the squeezed zone described in the next section is gone.
What stands now:

- **One size everywhere.** A metre here is three metres on the map, across and in height. Wickhollow's spot on the
  map is this land's middle. No stretching, no pins.
- **Where the places are now** (metres east and south of Wickhollow's square, and how high):

  | Place | East | South | Height | By road from |
  |---|---|---|---|---|
  | Wickhollow | 0 | 0 | 0 | |
  | The Moon Faire's camp | -70 | 128 | about 4 | Wickhollow's south road, as before |
  | Io's cottage | 13 | 367 | 35 up | Wickhollow, 280 m, uphill |
  | The jetty | 327 | -107 | 26 down | Wickhollow, 390 m, down to the lake |
  | The Thornwood | 607 | 1073 | 33 up | Wickhollow, 1.23 km |
  | The fen's dark heart | 1507 | 1823 | 33 down | Bogmire, 450 m |
  | Bogmire | 1347 | 2247 | 34 down | the Thornwood, 1.5 km |

- **The land walked** is the map from atlas pixel (1215, 1700) to (1960, 2650): 2.5 km by 3.2 km here. The ground
  stands between 41 m below and 121 m above Wickhollow's square.
- **Each place stands at the map's height** for its spot (`engine/land/zone.js`). A place with water of its own that
  the map also has (the jetty's lake, the fen) is set so the two waters are level.
- **The map's water is the water:** the lake north-east of Wickhollow with the jetty on it, a small lake to the west,
  the fen's pools and channels, the sea to the south. Each lies at the map's height for it, level right up its
  banks. The lake and rivers drawn by hand round Wickhollow are gone. Where a place's own water reaches the edge of
  its ground (Wickhollow's river and lake, the Thornwood's stream), the land carries it on for 26 to 40 m.
- **Roads find their own way** over the map's hills between the gates given (the easiest way by slope, keeping off
  water), are **graded** (never steeper than 18 m in 100 between their points: they cut through a rise and bank
  over a dip), and have their sharp corners rounded.
- **The road toward zone 2** now leaves Io's cottage by its west gate and is simply the map between there and
  where the Warm Roads camp will be: 2.6 km.
- **The thorn country** is the land within about 250 m of the Thornwood.
- **Checked** (`tools/zone-test.py`, all passed, 0 page errors): every named road walked at a sprint (the short ones
  whole, the long ones' first and last 220 m), ending on the ground of the place it leads to; on the land her height
  never changed more than 6 cm in a thirtieth of a second; 387 of 390 spots along the long road can be stood on; no
  spot in water can be stood on; 82% of spots on the land can be stood on. The first test still passes.
- **Not checked:** the frame rate; the middle stretches of the long roads walked by the check (their heights and
  whether they can be stood on were measured along their whole length, but she did not walk them).
- **Chris saw** (before this rebuild) the Flipbook look fall to 17 frames a second for a moment on his phone while
  moving from one area to another. Not looked into yet.

### Rough spots of the rebuild

- **The jetty stands on its own ground in the map's lake** and its gate is on its north side, under the cliffs of
  the lake's north shore. So its road comes down to the south shore and runs round its west side. Its own lake and
  the map's lake are at one level but do not join.
- **Wickhollow's river and lake stop 26 to 40 m past the town's edge.** The map has no river there at this size.
- **The map's heights were guessed from a painting**, and at one third size some are abrupt: a 26 m drop from
  Wickhollow to its lake, cliffs on the lake's north shore, crags east of the Thornwood.
- **A road beside a steep hillside has a steep bank on one side** (up to about 30 m near the crags).
- **Rivers are drawn in level squares**, so one running downhill steps down like small weirs.
- **A road crosses water on a plain bank of earth**, not a bridge.
- **The cottage's south gate and the Thornwood's stream lead nowhere yet.**

## Before the rebuild (replaced): who walks, the map, the squeezed zone, the 6 km road

Still true from this section: any of the four witches walks; the map in the corner (now the sub-agent's better
one); the fen's ground, reeds and mist; Bogmire and the fen's dark heart standing in the fen's water. No longer
true: the pins and stretching, the heights divided by 8, the 6.07 km road at true size.


- **Any of the four witches can walk.** A hat button, top right, lists Io, Kore, Europa and Callisto. Kore's light
  model is the new Envoi's; Europa's and Callisto's are Moon Faire's. `game/witches/walkers.js` gives the walker any of
  them (`W3D.witch(id)`), and the walker gained `setWho(id)`.
- **A map in the corner** (`game/engine/land/minimap.js`), with her mark; tap it for a big one with names. The first
  one is plain. A better one is being made on its own branch, `job/minimap`, by a sub-agent (Chris's idea).
- **Zone 1 lies on the 3D map of Aethermoor.** The map's two data pictures (how high each spot is, what kind of
  ground it is) are copied in, and `game/engine/land/atlas.js` reads them. Each place is pinned to its own spot on the
  map. Round a place the land is the map shrunk 6 times; between places it stretches to fit. From the map the land
  takes: its **hills** (heights divided by 8, between 6 m down and 14 m up); its **water** (lakes, rivers and the
  fen's pools and channels); its **fen** (the fen's own ground, reeds, bare trees, a low green-grey mist); its **open
  grass** (fewer trees) and **pine forest** (firs).
- **Bogmire and the fen's dark heart stand in the fen's water**, which now comes right up to their own.
- **A road crosses water on a raised bank of earth.**
- **The long road toward zone 2: 6.07 km.** It leaves the jetty road, goes west to a gate at the zone's edge, then
  north-north-west to where zone 2's Warm Roads camp will be. Along it the land is the map at its **true size**: it
  climbs about 165 m over a forested hill and comes down again. She can walk 70 m either side of it. It ends at a
  hedge for now ("The end of the road, for now").
- **Numbers.** The zone's ground now stands between 6 m below and 18 m above Wickhollow's square. 79% of spots on
  the zone's land can be stood on (it was 89%: the rest is the new water). 546 of 550 spots along and beside the
  long road can be stood on. A near piece of ground takes 6.2 thousandths of a second to make (it was 4.4).
- **Checked** (`tools/zone-test.py`, all passed, 0 page errors): the seven walks between places; the gate road; three
  stretches of the long road at a sprint (the first 600 m, over the highest hill, the last 300 m), her height never
  jumping more than 5 cm in a thirtieth of a second; no spot in water can be stood on. The first test still passes.
- **Not checked:** the frame rate with any of this (only Chris's laptop and phone can show it); the whole 6 km walked
  in one go; how the three other witches look from every side while walking.

## Hub's calls made here

- **Nov 23, zone 3: the story's order follows the map.** The story job wrote the shipyard as near the camp and the
  crossroads as beyond Eldergrove. On the map the road runs camp, Eldergrove's edge, cold moor, crossroads,
  shipyard. So the coven reaches the shipyard first (nothing is at the crossroads yet), and the knight comes when
  they go back up. Stage 1 is stepping onto the shipyard's bridge; stage 2 is having heard both the shipmaster and
  the Grey Hat at the slip. The knight stands on the crossroads' east road, toward the mountains.
- **Nov 23, zone 2: the three dark road stones are the Ember Line road's own three nodes,** lit by walking up and
  pressing a button. The fights job may set a fight by each later.
- **Nov 23: where people stand** in zones 2 and 3, and which of the fair folk's shapes each wears.

- **Nov 23, zone 3: the shipyard stands 280 m south of its pin.** Its pin on the map, (2097, 599), is on a headland
  25 m above the sea. The place itself is a rock in the sea at the end of a long bridge from the south. So it stands
  in the bay just off that headland, at (2097, 684), with the map's sea all round it. One number to change back.
- **Nov 23, zone 3: the way to the shipyard is a causeway over the bay.** The coast there is steep all round. The
  other way, round the head of the inlet, was 1.9 km with cuttings 34 m deep.
- **Nov 23, zones 2 and 3: the crossroads' two ways out to "the world" (east and south) stay closed,** and so do any
  ways out that lead off the zone.

(Also in `docs/decisions.md`.)

- **How the zone lies on the map.** Envoi's 3D map has zone 1's places up to 8 km apart; here they are within 1 km,
  as Chris asked. So the zone cannot be the map at one size. Each place is pinned to its spot and the land between
  is stretched. The map's heights are divided by 8 so the hills can be walked. The numbers are in
  `game/places/zone-1.js` (`atlas`), easy to change.
- **The long road is the map at true size**, straight from the zone's west gate to zone 2's first place: 5.98 km on
  the map, 6.07 km with its bends. It leaves from the jetty road because Wickhollow's west side is the lake.
- **How long it takes.** She walks at 1.3 m a second, jogs at 3.0, sprints at 5.2 (Shift on the laptop). The long
  road is about 20 minutes at a sprint and 34 at a jog.
- **Water by hand wins over the map's.** Within 55 m of Wickhollow's river and lake, and near the camp and the towns
  that do not stand in water, the map's water is left out.
- **Every place is built when the page opens, and kept.** Chris's laptop and phone ran the first test at their screens'
  top speed (144 and 60 frames a second), so there is room. It keeps walking free of stalls. The cost is a longer wait
  at the start and a bigger file.
- **Where the places stand** is the hub's layout: they join the way their roads join in the old Envoi, with the
  distances squeezed to 62 to 112 m of road between neighbours.
- **The Thornwood keeps its hedge and its two gates.** Elsewhere on the land she can walk anywhere; the Thornwood's
  heart is entered by its trails.
- **The other four towns are opened to the edge of their own ground**, as Wickhollow was.
- **Where the camp is, and how it is laid out,** is the hub's: the big top at the north, tents either side, a half ring
  of stalls to the south, wagons behind, the gate to the east where a lane comes in from the south road. To make room,
  Io's cottage and the jetty moved 30 m further south and the lake's south shore was drawn in.
- **The fair kit is Moon Faire's own code, unchanged.** It asks a few helpers for its light and fog; `fair.js` answers
  with this game's night, so no line of the kit was edited.
- **The camp's lamplight** is painted once into a small picture (a warm pool under each lantern and fire), the way a
  town's is.
- **Each place's lake or fen stays inside that place's own ground** for now (the jetty's lake, Bogmire's fen and the
  cottage's stream all end at a shore inside it). Only water that reaches the edge is carried on.

## What was copied in

44 more lines in `assets/INDEX.csv` (102 in all). From the new Envoi (`main`, `d450c3f`): the five places' files,
their walking areas, and 16 more of Chris's textures with their labels. From Moon Faire (`main`, `6371714`): the fair
kit, its 11 pictures, and where each piece lies on the kit's sheet. The place files are unchanged; what
opens the Thornwood's gates is in `game/places/zone-1.js`.

Changed after copying: `game/engine/place/walker.js` (the frame's counts; marked "Coven").

## What was checked, and how

With a browser that has no screen and no graphics card:

```
python3 tools/build.py game/pages/zone-1.html
python3 tools/zone-test.py builds/zone-1.html
python3 tools/look.py builds/zone-1.html <a folder> --plan <plan.json>
```

| Check | Result |
|---|---|
| Wickhollow's bridge, along the road, into the Thornwood | arrived; height never jumped more than 4.7 cm |
| The Thornwood's east gate to Bogmire | arrived; 1.0 cm |
| Bogmire's north road to the dark heart | arrived; no jump (before the land rose to meet the boardwalk, there was a 94 cm step) |
| Wickhollow's south road to Io's cottage | arrived; 7.2 cm |
| The cottage's west road to the jetty | arrived; 1.8 cm |
| The jetty back to Wickhollow, straight through the woods | arrived |
| The camp's gate up to Wickhollow | arrived; 2.0 cm |
| The spot the game starts on | can be stood on |
| The land's rules at 3,533 spots | every spot has a height; no spot in water can be stood on; 88% can be stood on |
| Page errors | 0 |
| Time for the page to start (this machine, no graphics card) | 11 to 12 seconds for six places and the camp (8 for one place) |
| What is drawn | 150,000 to 435,000 triangles, 105 to 375 draw calls |
| The first test | still builds and still passes its own checks |
| Looked at by eye, in 34 pictures | each place, each road arriving, the Thornwood's stream leaving its ground, the camp from the ground and from above, the camp in the Flipbook look |

**Not checked:** the frame rate with the camp in; anything in motion (the lanterns' flicker, the camera near a tent).

## Unfinished, and known rough spots

- Zone 3's causeway is a plain bank with stone on top and sheer sides. It is not a built bridge with arches, and it
  has no parapet. She is kept to its top (half a metre past the stones each side), but it looks as if she could fall.
- Zone 3's ground is the same frosted grass everywhere. The map's snow line is not drawn on the land yet.
- Every page now carries the frosted fir pictures (about 2 MB), used or not: the tree engine names them.

- **Nobody is in the camp yet**: no fair folk, no captain.
- The camera can pass inside a tent or a stall (the kit's pieces do not thin away as walls and trees do).
- The tents cannot be entered.
- **The fen's ground is one texture** (Bogmire's bank grass). No mud, no lily pads on the land's own pools.
- **A road crosses water on a plain bank of earth**, not a bridge or a boardwalk.
- **The long road is bare**: no camps, no people, no fights, no signposts, and a hedge at its end.
- **The map's rivers are drawn in level squares**, so a river running downhill out on the long road would step down
  like small weirs. (None crosses the road itself.)
- **The lake by Wickhollow and the jetty's lake are still two lakes.**
- The land round Bogmire wears Wickhollow's grass and woods, not the fen's own ground and reeds.
- Wickhollow's lake and the jetty's lake are two lakes with woods between.
- The cottage's stream ends at a bank inside the cottage's ground.
- The ground changes tone in a line where the land meets the Thornwood's own ground at its west gate.
- The keepsake shimmers are still left out.
- The file is 71 MB, of which 50.6 MB is 109 pictures. Chris's phone opens it.

## For the hub

- Nothing waiting.
