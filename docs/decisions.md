# Chris's decisions

Newest first. Every line is something Chris said, except the lines marked **Hub's call**. Those are small calls the
hub made so the work could go on, as Chris asked on November 18. He can change any of them with a word.

- **Stands** means nothing later changes it.
- **Hub's call** means the hub decided it, not Chris. It is easy to change.
- **Replaced** means a later decision changed it, and the line says which.
- **Carried over** means he decided it for one of the old games, nothing since has changed it, and it bears on this
  game. Whether it still holds for the merged game is his call; the ones that pull against each other are in
  `docs/questions.md`.

The full older record stays in the old repos and is not copied here:
`envoi-on-the-longest-night` `docs/project-notes/decisions.md` and `moon-faire` `docs/project-notes/decisions.md`.

## November 23, 2026, midday: hub's calls made putting zones 2 and 3 on the map

Chris's word for this (10:15 and 10:36): "I really want to get those first three zones situated", and "let's continue on
with the plan as it's been". No new word from Chris here. Every line below is a **Hub's call**.

- **Hub's call.** *Each zone is its own page for now* (`zone-1.html`, `zone-2.html`, `zone-3.html`), with its first
  camp at the middle of its own land. The flight between them joins the pages later.
- **Hub's call.** *Zone 2 is the new Envoi's five places for it, on their pins:* the Warm Roads camp, the Ember Line
  road, the forest road, Dawnroost, Dawnroost's living node. *Zone 3 is its five:* the northern camp, Eldergrove's
  edge, the cold moor, the northern crossroads, the shipyard.
- **Hub's call, for Chris to overrule.** *The shipyard stands 280 m south of its pin, out in the bay.* Its pin is on
  a headland 25 m above the sea, and the place is a rock in the sea at the end of a long bridge from the south. On
  the pin it would have stood in a pond on a hilltop. It is one number to move it back.
- **Hub's call.** *The way to the shipyard is a stone causeway over the bay,* 330 m long, sloping down from a shelf
  above the shore to the shipyard's own bridge. The coast is steep all round; the only other way was 1.9 km round
  the inlet through cuttings 34 m deep.
- **Hub's call.** *Ways out that lead off a zone stay closed* (the crossroads' east and south, to "the world").
- **Hub's call.** *Zone 3's ground is frosted grass and heather, its night cold and blue; zone 2's is meadow and
  heath with warm earth roads.* Both use the pictures their own places already bring.

## November 23, 2026, 10:36: room for new creatures

- **Chris: a placeholder for one or two extra creatures in each zone.** The game is balanced so that it works as long
  as one of them is added, and is easy to rebalance if two come in for each zone. Otherwise, carry on with the plan.
- **Hub's proposal.** *Two slots in each zone, A and B.* A is on and the game is balanced with it in; B is off, and
  turning it on is one switch and one run of the checks. Each slot has a job in a fight that the foes already there
  do not have (zone 1: a heavy one, a swarm; zone 2: a cold-bringer, a pair; zone 3: an armoured one, a leaper;
  zone 4: a light-thief, a big one). Until Chris's models come, each is a plain dark shape with two pale eyes, shown
  as "a strange creature". What each is in the story, and its name, are Chris's.
- **Hub's call.** *The rule that keeps the balance steady:* a new creature is worth, in experience and in danger,
  the same as the fights it takes the place of. Slot A takes about one fight in five in its zone.
- **Hub's call.** *The fights job builds it* (its step 4), with the whole game's levels as one plan and the
  meetings for zones 2 to 4 written ahead of their land.

## November 23, 2026, 10:15: the hub writes the narration; the first three zones; a note on balance

- **Chris: the hub writes the narration for zones 1, 2 and 3,** as a text document he takes to the ChatGPT
  conversation that made the other voices. Done: 48 lines (18, 15, 15), about 4.6 minutes, in
  `game/people/narration.js`, with the recording order in `game/people/recording/`. A proposal: his to change.
- **Chris: he wants the first three zones situated.** Next for the hub: zones 2 and 3's land, places and people.
- **Chris, a minor note: the leveling balance may have to be redone.** He has found a way to make strange creatures
  in 3D and is building models for another game on the same continent at another time; some look very good. See
  the board's note. That other repo is not a source yet.
- **Hub's call.** *What the narrator is:* a calm storyteller who sets the scene (where the coven is, what has just
  happened, what is in front of them) and never explains the story or says what anyone feels. One voice for all
  zones, not a voice already used for a person. The voice note suggests a woman of about sixty; Chris casts it.
- **Hub's call.** *When the narrator speaks in zone 1:* first at each of the coven's seven set moments; and when the
  Grey Hat has asked for his lamps, the first wisp is released, a lamp comes home, eleven are home, the coven wakes
  after a lost fight, and the first time the coven comes to Wickhollow and to the jetty. Three more lines are
  written and not yet wired (the first wisp appearing, resting at the camp, coming to the great wraith too soon):
  they need a hook in the fights job's code.
- **Hub's call.** *The narrator's sound files go beside the others,* `game/talk/audio/z1/z1.narrator.01.mp3` and so
  on, in zips `z1-narrator.zip`, `z2-narrator.zip`, `z3-narrator.zip`.

## November 23, 2026, 09:40: Chris hears zone 1

- **Chris: a person speaks only when the coven walks right up to them,** to arm's length. The first time, they speak
  by themselves and the words show; then the player taps to carry on a longer talk.
- **Chris: no spoken word from anyone at a distance,** unless the story wants someone shouting from far off, which
  would be its own circumstance.
- **Chris: a narration voice for the story's set points.** ("Maybe we should make a narration voice for narrative
  points that happen in specific situations.")
- **Chris: the opening did not make sense:** the whole party speaking, and townsfolk too, with nothing to say what
  is happening.
- **Chris, unsure: the party may speak too much.** "I don't know. Maybe not less." Not changed. Put to the story job.
- **Hub's call.** *Arm's length is 1.5 m; the Talk button shows within 2.3 m.*
- **Hub's call.** *A start screen with one button,* so nothing speaks before the player is ready (and so a phone
  will play the sound).
- **Hub's call.** *Someone already met says their short call when the coven walks right up to them again.* Chris
  did not ask for this; it uses the calls already recorded and is easy to take out.
- **Hub's call.** *Stand-in narration, in words only,* before the coven speaks at five of the set moments, until
  the story job's narrator lines are written and recorded.

## November 23, 2026: the story job's work is in; zone 1 speaks

- **From the story job's slip (Chris's words there, November 19 and 20):** he approved the story page and its calls,
  the fair folk's names, zone 1's lines and voices, calls 12 to 18 for zones 2 to 4 ("go straight on"), and zone 2's
  voices. The details are in `docs/slips/story.md` ("What Chris said here") and `docs/lore/story-page.md`.
- **The hub brought `job/story` into `main`** on Chris's "continue with the next step", since the next step was
  taking in the recorded lines and they were already there.
- **Hub's call.** *How the stage of zone 1's story moves on:* 1 when the Grey Hat's first talk is said through; 2
  when Nettie's first talk is; 3 when Old Wenna has told of the great wraith; 4 when the great wraith is released.
- **Hub's call.** *Lamps home:* one for every four fights won in the wilds, up to eleven; the twelfth with the great
  wraith.
- **Hub's call.** *What starts each of the coven's set moments:* the opening when the game begins; then coming within
  34 m of Io's cottage, 30 m of the Thornwood, 60 m of Bogmire, 40 m of the great wraith's spot; after the great
  wraith is released; and the leaving after Europa sews the flames.
- **Hub's call.** *The recordings stay as the MP3 files they came as* (64 kbps, one channel). Zone 1's add 11 MB to
  the one-file build, which is now 97 MB.
- **Hub's call.** *The townsfolk wear the fair folk's other shapes for now,* and Pell is the farm lad's body made
  small. The Grey Hat wears his own.
- **For Chris:** Tully's body is a man's and Tully's voice is a woman's. One of them should change.

## November 19, 2026, later in the morning: hub's calls made placing the people

- **Hub's call.** *Where each of the fair folk stands:* nine in the camp at their own stall, cart, booth, fire or
  gate; Old Bridie on the south road two thirds of the way to Io's cottage; Jory by the lake on the jetty road.
  All in `game/people/zone-1.js`.
- **Hub's call.** *Talking is one button at the foot of the screen,* with the person's name on it, and the words
  just over it. No choices. Nothing over the middle of the picture.
- **Hub's call.** *Stand-in words until the story's lines come,* one or two a person, several leaning on Moon
  Faire's own stand-ins. They are not lore and every one is replaced.

## November 19, 2026, 08:05: every person speaks aloud

- **Chris: every person in the game speaks aloud,** with ElevenLabs voices.
- **Chris: everyone has at least five or six lines. A few people have many more, and the story leads the player to
  them.** The size of the sound has to be thought about, so some dialogue may have to be kept small.
- **Chris: a fresh Opus 5.5 conversation at extra-high effort writes the story's dialogue,** from a brief the hub
  puts together: the lore, and what the dialogue should be.
- **Chris: the fights job's second round is done.** The hub brought step 3 (fights on the land) into `main`.
- **Chris: next for the hub is the people in the Moon Faire's camp.**
- **Hub's proposal, not approved:** `docs/lore/story-brief.md`. It marks what is Chris's settled word and what is
  proposed: these are Aethermoor's last moonlit years; the fire at Misthollow was lit by Halcyon, Io's older sister;
  the Grey Hat's twelve lamps fly on the first night and he will not fly dark. Nine calls in it are Chris's, each
  with the hub's pick. The story job's first step stops for his yes before the lines are written.
- **Hub's call.** *Zone 1 has about 236 spoken lines, about 17 minutes:* four people with 20 to 28 lines (the
  lamp-seller, the Grey Hat, Nettie, Old Wenna), fifteen with 6 to 8, and 46 for the four witches. About 11 MB
  inside the one-file build at MP3 64 kbps. The whole game should stay near an hour of speech.
- **Hub's call.** *The Grey Hat stands at the jetty,* where his ship is moored, not in the camp.
- **Chris, 08:30: the names can be made up now** (by the hub or the story job), so the people can be placed by name
  while the lines are written. **And how the sound is made:** he gives the finished lines to ChatGPT, which uses
  ElevenLabs to record them and hands back zip files labelled for the game.
- **Hub's call.** *The fair folk's names:* Odile the lamp-seller, Bashir the ribbon-dyer, Zofia the fortune-teller,
  Linnet the ballad-singer, Otto the baker, Corwin the night watchman, Ros the pie-seller, Tully the gate keeper,
  Kofi the chestnut roaster, Old Bridie the lamplighter, Jory the farm lad. The Grey Hat's own name is not said.
  Chris's to change before anything is recorded.
- **Hub's call.** *A sound file is named by its line's id* (`z1.odile.03.mp3`), one zip for each speaker and zone
  (`z1-odile.zip`). A name is said aloud only where it adds warmth, so a changed name means few new recordings.

## November 19, 2026, morning: Chris tries the rebuilt land; the fights job's steps 1 and 2 are in

- **Chris: the rebuilt land looks "so very beautiful"** and he wants to continue. The frame rate is the same as
  before on the laptop and the phone.
- **Chris: the Flipbook look on the phone** falls from 45-50 frames a second to 20-35 for the second it takes to
  cross from a town into the woods. Only on the phone, only in that look.
- **Chris: battle steps 1 and 2 are done.** The hub brought `job/fights` into `main`. The second conversation is
  ready for more work.
- **Hub's call.** *The second conversation's next work is step 3, fights on the land* (milestone 3): the party, unseen
  meetings in the wild, the join, rest at the camp. Its text is on the board.
- **Hub's call.** *A first try at the Flipbook stutter, not measured* (only the phone can show it): leaving a town,
  the fog draws back and a ring of new land was wanted all at once; now that ring is made over a few seconds, and
  when frames are already under about 54 a second the land makes less each frame. The numbers panel now shows how
  many pieces of land are waiting, so Chris can say whether the stutter comes with a high number.

## November 18, 2026, 21:04: the land you walk is the map of Aethermoor

- **Chris: the 3D world the player explores is built and mapped to match the 3D world map of all of Aethermoor.** It
  is the map he has used for all his stories, so every place stands where the map has it. **Stands.**
- **Chris: the walkable world is one third the size of the map.** A metre in the game is three metres on the map,
  across and in height. Wickhollow to the Thornwood is 1.2 km. Crossing the whole map (46 km) is about 15 km: about an
  hour and a half at a jog. Towns stay real size. (He chose it from four sizes the hub offered: true, half, a third,
  a sixth.)
- **Replaced by the two lines above:** each zone about 1.5 km by 1 km; the hub's call that zone 1 is the map squeezed
  with its places pinned; the hub's call that the long roads are 6 km at true size. The long road toward zone 2 is now
  simply the map between them, about 2.2 km.
- **Hub's call.** *The land walked for zone 1* is the map from atlas pixel (1215, 1700) to (1960, 2650): 2.5 km by
  3.2 km in the game.
- **Hub's call.** *Roads find their own way and are graded:* the easiest way by slope between the gates, never
  steeper than 18 m in 100, cutting through a rise and banking over a dip.
- **Hub's call.** *The road toward zone 2 leaves Io's cottage by its west gate* (2.6 km to where the Warm Roads camp
  will be).
- **Hub's call.** *The jetty keeps Envoi's pin, in the lake north-east of Wickhollow;* its road runs round its west
  side because its gate faces the cliffs. Moving the pin a little to a kinder shore is Chris's call.
- **Hub's call.** *The lake and rivers the hub drew by hand round Wickhollow are gone;* the map's water is the water.
- **Chris: in the Flipbook look on his phone the frame rate fell to 17 for a moment while moving from one area to
  another;** with the look off it was 60 again. To be looked into.

## November 18, 2026, late: Chris's word, and hub's calls made putting zone 1 on the map

- **Chris: a mini map,** to see where he is as the full map is wired in. Then: have an Opus 5.5 sub-agent build a
  better one than the first plain one. (It is the job `minimap`.)
- **Chris: the order.** Who walks (all four), then zone 1's hills and shores from the 3D map, then the fen's own
  ground round Bogmire, then the long road toward zone 2.
- **Hub's call.** *The map's look* is the sub-agent's design, accepted by the hub: dark blue paper, the land in
  moonlit inks, a small drawing for each place, a gold arrow for her. The small map shows 290 m across and follows
  her; the big one shows the whole zone, or the whole long road when she is on it.
- **Hub's call.** *How zone 1 lies on the 3D map.* On the map zone 1's places are up to 8 km apart; in the game they
  are within 1 km (Chris's size for a zone). So each place is pinned to its own spot on the map and the land between
  is stretched to fit: round a place the land is the map shrunk 6 times. The map's heights are divided by 8.
- **Hub's call.** *The long road is the map at its true size:* 6.07 km from the zone's west edge to where zone 2's
  first place will be, over a forested hill about 165 m high. It leaves from the jetty road.
- **Hub's call.** *Running speeds stay the place engine's:* a walk 1.3 m a second, a jog 3.0, a sprint 5.2. Four
  zones and three long roads are then about 80 minutes at a sprint and over two hours at a jog. (The earlier note
  said 4.4 m a second, which was Moon Faire's.) If the crossing should be an hour and a half at a jog, the long
  roads should be about 3.5 km: Chris's call.
- **Hub's call.** *Bogmire and the fen's dark heart stand in the fen's water,* and a road crosses water on a raised
  bank of earth until there are bridges.
- **Hub's call.** *The three other witches' light models are copied in by the hub* (Kore's from the new Envoi,
  Europa's and Callisto's from Moon Faire), so the `fights` job uses them and does not copy them again.

## November 18, 2026, night: hub's calls made while pitching the Moon Faire's camp

The reasons are in `docs/slips/zone-1.md`.

- **Hub's call.** *Where the game starts.* The Moon Faire's camp stands 70 m west and 128 m south of Wickhollow's
  square, in a meadow off the south road, between the lake and Io's cottage. A lane runs from the road to its gate.
- **Hub's call.** *How the camp is laid out.* The big top at the north, a round tent either side, two square tents, a
  half ring of four stalls to the south, two wagons drawn up behind, the well in the middle, the gate to the east.
- **Hub's call.** *Io's cottage and the jetty moved 30 m further south,* and the lake's south shore was drawn in, to
  make room for the camp.
- **Hub's call.** *A second conversation can take the fights* (the job `fights` on the board), since none of its files
  are the hub's.

## November 18, 2026, night: Chris tried zone 1 with six places

- **Stands.** With all six places on one land it still runs at **144 frames a second on his laptop** (88 to 90 with the
  Flipbook look) and **60 on his phone** (45 to 50 with the Flipbook look). His phone opens the 70 MB file. His words:
  "this is looking so good".
- **Hub's call.** *So building every place when the page opens stays,* and no lighter phone build is needed yet.

## November 18, 2026, late evening: hub's calls made while setting zone 1 on one land

The reasons are in `docs/slips/zone-1.md`.

- **Hub's call.** *Every place of a zone is built when the page opens, and kept.* It keeps walking free of stalls. It
  costs a longer wait at the start (12 seconds for six places on the hub's machine) and a bigger file (70 MB).
- **Hub's call.** *Where zone 1's places stand.* Wickhollow in the middle; the Thornwood 226 m east across the bridge;
  Bogmire 463 m east; the fen's dark heart 159 m north of Bogmire; Io's cottage 205 m south; the jetty 190 m west of
  that. They join the way their roads join in the old Envoi, with 62 to 112 m of road between neighbours.
- **Hub's call.** *The Thornwood keeps its thorn hedge and its two gates.* Everywhere else she can leave a place's
  ground anywhere.
- **Hub's call.** *One night for the whole zone.* One moon, sky and fog, which come round to each place's own as she
  nears it.
- **Hub's call.** *A place's lake or fen stays inside its own ground;* only water that reaches the edge (the
  Thornwood's stream, Wickhollow's lake and river) is carried on across the land.

## November 18, 2026, evening: Chris tried the first test

- **Stands.** The first test runs at **144 frames a second on his laptop** and **60 on his phone**, in town and in the
  woods alike. With the Flipbook look on: 90 to 100 on the laptop, 45 to 50 on the phone. He saw 90 squares of land and
  about 1,190 trees past the town on the laptop, 930 on the phone.
- **Hub's call.** *What those numbers mean for zone 1.* 144 and 60 are almost certainly the most each screen can show,
  so the test is not near either machine's limit. Zone 1 keeps the test's thickness of trees and width of view, and
  every place of the zone is built when the page opens and kept, rather than built as she comes near. If a later build
  drops under 60 on the laptop or 40 on the phone, that is the sign to thin something.

## November 18, 2026, evening: hub's calls made while building the first test

All of these are the hub's, not Chris's. Each is easy to change. The reasons are in `docs/slips/first-test.md`.

- **Hub's call.** *The land's code is new; its method is Moon Faire's.* Squares of 32 m round the walker, four levels
  of detail, skirts on the seams, rules for height and ground. It is written inside the place engine's light, textures
  and trees, so the town and the land are one picture. Moon Faire's own land files were not copied: they are lit by a
  different shader and read Moon Faire's painted map.
- **Hub's call.** *The test's land is made up.* The lake to the west, the river past the east side, the Thornwood
  across the bridge, the stone ring and the pool are the hub's layout. The real zone 1 takes its broad shape from the
  3D map of Aethermoor.
- **Hub's call.** *The town is open on every side.* Io can leave Wickhollow's ground anywhere that is not water or
  solid, not only by its three roads.
- **Hub's call.** *The camera's zoom is gentler than Moon Faire's:* 1.2 times as far walking, about 1.5 times running
  (Moon Faire: 2.15 and 4.9). The fog here is close, and she would be lost in it.
- **Hub's call.** *Walking speeds stay the new Envoi's for now:* walk 1.3, run 3.0, sprint 5.2 metres a second.
- **Hub's call.** *The herbs on the ground are Moonpetal and Lavender,* Envoi's two healing herbs. Their look is a
  small picture painted in code: a stand-in until Chris wants to paint them.
- **Hub's call.** *The fog by place:* the town keeps its own; the woods are thicker (it ends at 92 m); the Thornwood is
  thickest and paler (it ends at 62 m), in the Thornwood's own colours.
- **Hub's call.** *How the game's files are laid out:* `game/` holds the pieces (`engine/`, `places/`, `witches/`,
  `pages/`), `tools/` the builder and the checks, `builds/` the built files, which are not kept in git.
- **Hub's call.** *Left out of the first test:* the keepsake shimmers, the two fonts, the painting-from-above button.

## November 18, 2026, afternoon: Chris's answers to the 13 questions

He said yes to all 13 suggestions in `docs/questions.md`, and added the following in his own words. Where his own
words go further than a suggestion, or differ from it, his own words are what is written here.

How the work goes from here:

- **Stands.** Build the game. The hub makes the small calls itself, writes each one here marked "hub's call", and keeps
  going. It stops to ask only for something that can't be undone, or a big change to the story.
- **Stands.** The hub is the creative director for how the game goes together. He answers questions when asked.
- **Stands.** The order: the first test (the Thornwood with Wickhollow), then the rest of zone 1, then the fights
  joined on, then the people, then zones 2 to 4.
- **Stands.** One HTML file at each milestone for him to try. Push often. Keep `docs/BOARD.md` up to date so a new hub
  can pick up at any point.
- **Stands.** The hub may use Opus 5.5 sub-agents to write lore and dialogue, or for any task where they help. The hub
  may also give him prompts to take to another AI to make pictures.

The world (questions 1, 5, 6, 7, 11, 12):

- **Stands.** The world is Aethermoor: the 3D continent map from the Envoi repo is the world. He is proud of how that
  map looks and wants to stick with it. It may be altered slightly to fit the Moon Faire's camp where the game starts.
- **Stands.** Moon Faire's open land is used to add the wilds you explore.
- **Stands.** Each zone becomes one open land of about 1.5 km by 1 km, with its towns at real size and the distances
  squeezed. Walking into a town is seamless: no fade.
- **Stands.** Flying should be strongly encouraged, so walking far must really be far. Running the straight road
  across the whole map, with no fights, should take about an hour and a half. Not three hours.
- **Stands.** Air travel uses his airship game, Skies of Aethermoor. It may be copied into this repo so it can be
  used. (So it is now a third read-only source. Its repo is `chriskizer91-ops/airship-game-in-aethermoor-`.)
- **Stands.** The game is a number of pages in this repo that call each other. He is not sure of the wording and
  leaves how to the hub.
- **Stands.** One final fire, at Misthollow's dead Moonwell.
- **Stands.** The moon's name is **Auros**.
- **Stands.** The setting is dusk to night. The wilds should look a little different from the towns: tree cover and
  heavy fog, so you cannot see as far.
- **Stands.** Laptop first.

The party and the story (questions 3, 8):

- **Stands.** All four witches are in the party from the beginning. (His own words. This replaces the suggestion of
  one witch joining per zone.)
- **Stands.** Who you walk as is selectable: any of the four, from the start of the game.
- **Stands.** The game starts at the Moon Faire's tent centre. The hub picks where that is; it has to be in zone 1.
- **Stands.** Some lore has to be made up for this. A first thought of his: Io's cottage is her family's cottage.

The fights and the levels (questions 2, 4, 9):

- **Stands.** The fight is Envoi's new battle. Bring in Europa's and Callisto's moves. Moon Faire's wild-plant herbs
  beside Envoi's shop herbs. The eight pretend players are a second check.
- **Stands.** Envoi's four zones, with gate fights at levels 5, 10, 15 and 20.
- **Stands.** Level 20 is the highest a player can reach. The final boss is harder than that, with a choice of easy,
  medium, hard or crazy: levels 20, 21, 22 and 22.8.
- **Stands.** About 180 fights should be what it takes to reach level 20.
- **Stands.** Foes are met Moon Faire's way (unseen, only in the wild) at Envoi's rate.
- **Stands.** Io has to be able to find herbs growing on the ground in the wilds.

The people (question 10):

- **Stands.** The fair folk are themselves at the Faire's camp. Townsfolk stay on the fair-folk bodies. The doll plays
  a few important people. The Grey Hat captains the ship. Whether the lines are redone is left to the hub.

The first test (question 13):

- **Stands.** Io walks out of Wickhollow's square into open land and back, with no fade. The land is Moon Faire's kind
  of land (drawn in squares round the camera, far hills, fog), wearing Envoi's zone 1 textures and the Thornwood's
  thorny trees.

### Hub's calls made with these answers

- **Hub's call.** *All four from the start, and any of them can lead.* His message said both "yes to all 13 as
  written" and, in his own words, "you start with all 4 at the beginning". The two disagree on question 3 (and on
  question 8, where the suggestion was Io first). The hub took his own words. To change: say "one witch per zone".
- **Hub's call.** *How 1.5 km zones and a 90-minute crossing fit together.* Each zone's own land is about 1.5 km by
  1 km. The zones are joined by **long wild roads of about 6 km each**, about 22 minutes at a run. Four zones and
  three long roads come to about 24 km, which is about an hour and a half at the land's running speed (4.4 m a
  second). The long roads are what make flying the easy way.
- **Hub's call.** *What "pages that call each other" means here.* In the repo the game is separate pieces, each in its
  own folder: the land, each town, the battle, the map, the flight. A build for Chris packs the pieces it needs into
  one HTML file. Whether the finished game is one file or a few that open each other is decided when the fights are
  joined on.
- **Hub's call.** *The hub builds too.* When the hub builds a piece itself it still uses a branch `job/<name>` and a
  slip, then merges into `main`, so the record reads the same whoever did the work.
- **Hub's call.** *Lines.* Every line is written new, after the opening lore is agreed. The 480 Moon Faire lines are a
  model of the voice only.

## November 18, 2026: the new repo and how it works

- **Stands.** The game is **Coven of the Moon Faire**, a game made from two: the new Envoi and Moon Faire. Its repo is
  `chriskizer91-ops/coven-of-the-moon-faire`.
- **Stands.** The two old repos are read-only sources, on their `main` branch. Never push to them.
- **Stands.** One conversation is the hub. Only the hub edits `docs/BOARD.md` and merges into `main`. A job
  conversation works on its own branch `job/<name>` and writes only `docs/slips/<name>.md`.
- **Stands.** An asset is copied in only when the game uses it: the finished piece, not its references or tools, with
  a line in `assets/INDEX.csv` (source repo, branch, commit, path, what it is, date).
- **Stands.** The game never loads anything from the old repos.
- **Stands.** His newer word beats older notes. Lore is not final until he says so.
- **Stands.** Plain words, pictures and simple numbers for him, and uncluttered phone screens. Builds are single HTML
  files he can open on his laptop and phone.
- **Stands.** The repo is public: no keys and no private details.
- **Stands.** Don't build the game yet. First the rules, the board, the asset list and the questions. Building starts
  after his answers.
- **Stands.** The first build is a test: Moon Faire's open land around the Thornwood, with Envoi's Wickhollow in it.

## November 18, 2026: the merge (from the old repos' notes)

- **Stands.** The 3D Envoi and Moon Faire become one game.
- **Stands.** No new claude.ai project for it. The rules, the knowledge and the game notes live as files in this repo.
- **Stands.** The plan: use Envoi's zones, 3D world map, combat and everything else already built for the 3D Envoi.
  Bring in Moon Faire's NPCs, lore and open map. Use the open map to make the wilds of the Aethermoor 3D map walkable,
  everywhere or at least much more of it. Then keep building from there.
- **Stands.** The lore, the NPCs' minds and the combat balance across the whole game all need reworking. Moon Faire's
  gating is different from Envoi's.
- **Stands.** He feels Envoi is further along, because he already made a 2D version of it, though his more recent work
  went into Moon Faire.

## Carried over from the new Envoi (November 15 to 17)

The world and travel:

- The four zones are the game's four level bands: Wickhollow and the fen; the Warm Roads; the northern wilds; the
  northeast peaks.
- Every area that looks walkable must be walkable. He likes little pockets to walk into. Many items exist only as a
  shimmer, with a card when found.
- The wild zones are larger open fields, with creepy thorny trees, more to explore, and heavy fog so less is drawn.
- Flying between zones uses his airship game, Skies of Aethermoor, with its own four ships. Raiders attack on every
  flight: one, two or three by distance. A zone opens on the party's level, and the crystals or ship upgrade for that
  flight. Skies' Crystal Shards and Envoi's shards are one currency. Flights use the night map.
- The map of Aethermoor is a real 3D model of the land, not the painting on a shape. It shows where you are whenever
  you travel.
- The star map of the Thareia system is the game's star map: twin suns, a far star, Thareia and its moon, four other
  planets. Aether crystal and the airships' amber sunstone are the same stone.
- The laptop is the main screen for the 3D world, as detailed as it can draw. The phone is secondary.
- No see-through buildings. The camera may go to right above the walker when it has to.
- Two looks to switch between: as painted, and a very fine Flipbook look with a slider.
- On a laptop, tapping a direction twice runs, Shift sprints, and there is no on-screen joystick.

The fights, the people and the story:

- Moon Faire's Io and the Jester are the heroes of Envoi's places. The Jester is named **Kore**.
- The four are the coven quartet: Io the Herbal Witch, Kore the Jester, Europa the Fox, Callisto the Ranger. His bigger
  story is how the four come to know each other.
- Io and Kore are very close friends, not sisters.
- Kore plays by Moon Faire's Fate rules. She gets very high HP, goads foes into hitting her, and her Fate move is
  overwhelmingly powerful. Kore never misses. Nothing in her numbers is final.
- Keep Envoi's levels, foes and how often they come. Only the final boss comes from Moon Faire.
- Halcyon is a woman on Moon Faire's base doll in the paladin outfit, with a glow made in code.
- Noctara is replaced by Moon Faire's final boss, so darkness can mean something different.
- Moon Faire's fair folk, at their lightest, play the townsfolk. Their words must be written new.
- Still deciding: whether the base doll's outfits, with face coverings, should play some people instead.
- It is an alternate universe to the first Envoi and does not have to agree with it.
- Both witches get a trance glow made in code. Curtain Call glows purple, with mist or pixel motes.
- The battle's sounds are all new and made in code. The six dark music pieces are locked in, with where each plays.
  His own songs are on hold, to come back to.
- Every saved asset stays labeled, so it can be used again in later games.

## Carried over from Moon Faire (November 10 to 16)

- Everywhere is a 3D open world to walk and explore. Meeting a foe while walking cuts to a fight.
- Foes in the open are unseen chance meetings, only away from lamps and people.
- The camera zooms by itself: closest standing, further walking, furthest running.
- The fair folk each have a mind and about 40 lines, which depend on how often you have talked, whom else you have
  met, how far the game is and your level.
- Combat is turn-based, "like chess", with no penalty for slow clicking. Numbers grow 20% a level.
- 20 levels, about 180 fights, level 20 the top.
- Fights start with the HP and MP the party has. Io's herbs, picked from wild plants, refill them between fights. A rest
  spot refills everything.
- Before the final fight: easy, medium, hard or crazy (levels 20, 21, 22, 22.8). The final boss has two forms, helpers
  first and then alone, with the party refilled between them.
- Finds are at half strength.
- Which weight of model where: Lightest for walking and fight distance, Light for close-ups and talks, Full only in a
  viewer in the menu.
- Power order, strongest magic first: the Jester, the Fox, Io, the Ranger. The Jester has the highest HP.
- The Moon Faire is a normal fair that follows the moon round the planet. The moon goes round once every 500 years.
- Moon phases are not part of the witches' magic.
- The airship captain (the Grey Hat) is a friend of the Moon Faire, and is done as a model.
