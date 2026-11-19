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
