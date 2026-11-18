# Chris's decisions

Newest first. Every line is something Chris said. Claude's suggestions are not here: they are in `docs/questions.md`
until he answers them.

- **Stands** means nothing later changes it.
- **Replaced** means a later decision changed it, and the line says which.
- **Carried over** means he decided it for one of the old games, nothing since has changed it, and it bears on this
  game. Whether it still holds for the merged game is his call; the ones that pull against each other are in
  `docs/questions.md`.

The full older record stays in the old repos and is not copied here:
`envoi-on-the-longest-night` `docs/project-notes/decisions.md` and `moon-faire` `docs/project-notes/decisions.md`.

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
