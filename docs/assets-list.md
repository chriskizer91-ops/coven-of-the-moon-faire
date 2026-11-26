# The asset list: everything finished in both old games

> **Since this list was written** (November 18, evening): Chris answered the questions (`docs/decisions.md`), so read
> each "suggestion" below in the light of his answers: all four witches from the start, one fight (the new Envoi's
> battle), Skies of Aethermoor added as a third source. The first test has copied in the pieces in section 14, except
> that the land's code was written new to Moon Faire's method rather than copied (see `docs/slips/first-test.md`).
> What is actually in this repo is in `assets/INDEX.csv`.

Written by the hub, November 18, 2026. Started from the two surveys of November 17 and checked against each old
repo's `main`. Nothing has been copied into this repo yet.

**Read from:**

| Short name | Repo | Branch | Commit read |
|---|---|---|---|
| **E** | `chriskizer91-ops/envoi-on-the-longest-night` | `main` | `d450c3f` (November 18, 12:47) |
| **MF** | `chriskizer91-ops/moon-faire` | `main` | `6371714` (November 18, 13:13) |

In the tables, **E:** `path` means a path in Envoi's `main`, and **MF:** `path` a path in Moon Faire's `main`. Most of
the new Envoi lives in the folder `moon-faire-witches/`, written **E:** `mfw/…` to keep the tables narrow.

**How finished:**

- **Approved**: built, and Chris has said it is good.
- **Built**: works, but Chris has not yet said yes, or has not seen it.
- **Rough**: works with known gaps (the gaps are named).
- **Data**: numbers or words only; nothing to look at or play.

**Suggestion:** **Use as is**, **Use with changes** (the change is named), or **Leave out** (with why). These are the
hub's suggestions. Several depend on Chris's answers in `docs/questions.md`; those say which question.

**How it was checked.** Every path below was looked up in the file list of that repo's `main`. "How finished" comes
from each repo's own notes (`docs/project-notes/`). Nothing was built or run by the hub for this list, and no frame
rate has been measured on a real phone or laptop by any session: every build so far was checked in a browser without
a graphics card.

---

## 1. What changed since the surveys

The surveys were written the evening of November 17. On November 18 both repos were gathered onto `main`.

### Envoi

| The survey said | On `main` now |
|---|---|
| world-3d, reskin and world-map were on work branches, not in the hub | All brought into `main`. 416 files added, nothing clashed. Recorded in **E:** `docs/project-notes/MAIN-LINE.md` |
| The battle meets 42 of 51 balance targets | 44 of 51 when run on `main` (1,000 fights each). The battle's own notes still say 42 |
| The star map is an artifact only, not in the repo | It is in the repo: **E:** `mfw/star-map/thareia-system-star-map.html`, with the tool that packs its land |
| The battle is `dist/battle.html` | `dist/` is not kept in the repo. Only the four zone pages are stored already built. Every other page is built from its sources (the battle comes to 10.2 MB) |
| The star map uses a different three.js (0.160) than the rest | True, and it loads it from the internet. Everything else in both games uses three.js r128. So code can be shared more easily than the survey feared |
| The Grey Hat "has no light version" | He has one now (Moon Faire, 2,781 triangles). Envoi still uses the old night-watchman for Quill |

Also new since the surveys:

- Four session wrap-up notes (**E:** `docs/project-notes/sessions/`).
- The 3D map's copy of the 21 places is one step behind the reskin. Its own tool brings it up to date
  (**E:** `mfw/world-map/tools/make-places.mjs`).
- Not in `main`, by Chris's word: the first Envoi's last 55 commits of polish (old branch `claude/send-note-gigdew`).
  The first-Envoi files in `main` are from just before that polish. See question 11.

### Moon Faire

| The survey said | On `main` now |
|---|---|
| The default branch was stale and all November work sat on 15 unmerged branches | `main` now holds all of it in one tree: the four game branches joined in `game/`, every model in `models/`, plus `light-levels/` and `base-doll-light/` |
| The base doll was one 70 MB HTML file | Its sources are there too: **MF:** `base-doll-light/source/`, the full doll site and the prompt pages |
| Board rows C2 to C4 (light files for Fox, Ranger, Io) say Open, but the files exist | Confirmed: **MF:** `game/fight/witches/fox_lod.js`, `ranger_lod.js`, `io_lod.js` |

Also new since the surveys:

- A fourth Jester page: the night square with the purple glow of her October animation over her moves
  (**MF:** `models/jester-3d/viewer/purple.js`, November 18).
- Eight session wrap-up notes (**MF:** `docs/project-notes/sessions/`).

Three cautions about Moon Faire's `main`:

1. **There is no record of how its branches were joined or what was tested afterwards** (Envoi has one). The built
   pages in it were made on the branches, before the join. Treat each as "built before the join" until it is rebuilt.
2. **Two different built copies of the open world existed** (the open-world session's, and an older one from the
   fair-folk session). The notes do not say which one `main` kept. Rebuild from source before trusting it.
3. **"Music of the Moon Faire"** (the Carnival of Ashes breakdown, old branch `ccr-d4490116-7cqwt4`) is not in `main`.
   See question 11.

---

## 2. The witches

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **Io, the Herbal Witch**: full 3D model, 7 spells, 3 reactions, 6 feelings | **MF:** `models/io-3d/` | Approved through stage 12 ("beautiful"); stages 13 and 14 built, first builds. A second, finer spell pass is not started | **Use as is** for the menu viewer only (Full weight). The game uses the light files below |
| Io's light files (Trim, Light, Lightest) | **MF:** `game/fight/witches/io_lod.js`, `io_tex.js`, `witch_levels.js` | Built. Light "works perfectly", Lightest is for phones | **Use as is** |
| Io fitted to Envoi: 7 added moves for Envoi Io's 9 spells, walking model for the 3D places | **E:** `mfw/src/moon-io.js`, `moon-io-walker.js`, `io-new-moves.frag.js`, `mfw/witches/io_lod.js` | Built. She walks all 21 places and fights in the new battle | **Use as is.** This is the Io the game should start from: it already carries both spell sets |
| **Kore, the Jester** (HD): full model, all moves and lore spells, the charge shown as dust | **MF:** `models/jester-3d/` | Approved. Rule: add to her, never remove a move or a button | **Use as is** for the menu viewer |
| Kore's light files (four weights) | **MF:** `game/models/jester/` (`jester_lod.js`, `jester_tex.js`, `jester_kit.js`) | Approved in the fair square test | **Use as is** |
| Kore fitted to Envoi: Fate rules in the battle, purple trance | **E:** `mfw/src/moon-jester.js`, `mfw/witches/jester_lod.js`, `mfw/src/trance.js` | Built. Kore never misses | **Use as is** |
| Kore's night-square page with the purple glow | **MF:** `models/jester-3d/viewer/purple.js` | Built November 18, not yet seen | **Leave out** for now: a viewer page, not a game piece. The glow itself may be worth taking later |
| **Europa, the Fox**: full model, spells from rounds 1 to 3 plus two favourites | **MF:** `models/fox-3d/` | Approved as finished. Two of her fight moves use stand-in animations (Stitch, Pins and Needles) | **Use as is** for the viewer, when she joins (question 3) |
| Europa's light files | **MF:** `game/fight/witches/fox_lod.js`, `fox_tex.js` | Built | **Use with changes:** she needs fitting to Envoi's battle the way Io was |
| **Callisto, the Ranger**: full model with bow, sword, knives, gem shots, reactions, emotes | **MF:** `models/ranger-3d/` | Approved ("that's how we're going to put her in the game"). Jewellery not built | **Use as is** for the viewer, when she joins (question 3) |
| Callisto's light files | **MF:** `game/fight/witches/ranger_lod.js`, `ranger_tex.js` | Built | **Use with changes:** fit her to Envoi's battle |
| The not-HD Jester (the retired cartoon look) | **MF:** `models/jester-not-hd-3d/` | Retired by Chris | **Leave out.** Her effects and sounds were the reason to keep her; the new battle has its own |
| The October 2D flipbook frames (474 HD frames, pixel sheets) | **MF:** `assets/`, `game-assets/`, `flipbook-art-source/`, `art-pipeline/` | Finished in October | **Leave out:** the 2D era |

---

## 3. Other fighters: summons, foes and bosses

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| Lunara, the moth goddess (Io's summon) | **E:** `src/models/lunara.js` | Finished in the first Envoi; in the new battle | **Use as is** |
| Envoi, the Letter Wyrm (Io's summon) | **E:** `src/models/envoi.js` | Finished in the first Envoi; in the new battle | **Use as is** |
| The Elderwood Guardian (Io's stag) | part of Io's model (**MF:** `models/io-3d/src/I98b_wood.js`; inside her light file) | Approved | **Use as is** |
| Wisp and frost wisp | **E:** `src/models/wisp.js` | Finished | **Use as is** |
| Shadow Wraith, and the great wraith (the same model, large) | **E:** `src/models/wraith.js` | Finished | **Use as is** |
| The four Bramble Horrors | **E:** `src/models/bramble.js` | Finished | **Use as is** |
| The Bramble Colossus | **E:** `src/models/colossus.js` | Finished | **Use as is** |
| Moon Faire's three brambles (Bramble, Flowering, Great), light and fine weights | **MF:** `game/models/foes/bramble/` | Built. Chris has not looked at them. Not joined to any fight | **Leave out** for now. They were made from Envoi's own two brambles; Envoi's originals are already in the battle. Come back if a lighter bramble is needed for crowds |
| **The final boss, "the fire that would not end"**, in two forms (about 21,000 triangles) | **MF:** `game/models/foes/final-fire/final-fire.js`; copy in **E:** `mfw/witches/bigbad/final-fire.js` | Approved ("looks great") | **In the game** (zone 4's last fight, both forms; November 25) |
| The final boss's own page at the dead Moonwell | **E:** `mfw/bigbad/` | Built. Not yet inside the new battle | **Use with changes:** move it into the battle as the finale |
| **The new Halcyon**: the base doll in the paladin outfit, with a glow made in code | **E:** `mfw/src/halcyon-paladin.js`, `mfw/witches/doll/` | Built. Her moves are Io's for now; her fight is not rebuilt | **Use with changes:** she needs her fight, and Chris's call on whether she gets moves of her own |
| Everyone Who Fights: all 17 fighting models on one page | **E:** `mfw/lineup/` | Built, waiting for Chris to lock the 17 in | **Use as is** as a check page, not part of the game |
| The first Envoi's Sol, old Io, old Halcyon, Noctara | **E:** `src/models/sol.js`, `witch.js`, `halcyon.js`, `noctara.js` | Finished in the first Envoi | **Leave out:** all four were replaced by Chris's decisions |
| Creature ideas: Gloamwing, Emberback, the Bramble Ancient | **E:** `3d-model-new-character-ideas/` | Sketches | **Leave out** until a story needs them |

---

## 4. People and talk

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **The 11 fair folk**: light 3D people on one shared kit, painted skins, about 2,700 triangles each; they walk, sit, run and emote | **MF:** `game/people/npc/` (`npc.js`, `npcs.js`, `npc_tex.js`, `emotes.js`), `game/people/kit/person-kit.js` | Approved (the fair square test "ran great") | **Use as is** |
| The fair folk playing Envoi's 17 townsfolk | **E:** `mfw/src/moon-folk.js`, `mfw/witches/folk/` | Built. They talk, with Envoi's old words as a stand-in. Not yet standing in the 3D places | **Use with changes:** put them in the 3D places; words written new (question 10) |
| **The Grey Hat captain**, full model (about 599,000 triangles) | **MF:** `models/grey-hat-3d/` | Approved as done | **Use as is** for the viewer only |
| The Grey Hat's light version (2,781 triangles), as one of the fair folk | **MF:** `models/grey-hat-3d/npc/greyhat_npc.js` | Built November 16. Not placed anywhere yet. Plain-coloured hair, beard and sleeves | **Use as is** (question 10 says where) |
| **The fair folk's minds**: six needs, choosing what to do, finding their way | **MF:** `game/people/talk/minds.js` | Built. Never watched moving; Chris has not said what he makes of it | **Use with changes:** it finds its way on Moon Faire's grid; it must learn Envoi's places |
| The line picker (what someone says depends on the evening, your level, whom you have met) | **MF:** `game/people/talk/talk.js` | Built | **Use with changes:** its "stages of the evening" become this game's story stages |
| **480 written lines** (40 each for 12 people) and 28 overheard exchanges | **MF:** `game/people/talk/lines.json` | Built. Chris has not read them. Written for Moon Faire's old story | **Leave out** as game text; keep as a model of the voice. All lines are written new (question 10) |
| Speech bubbles and the plum-and-gilt look for menus and cards | **MF:** `game/openworld/src/ow.tpl.html`, lower part of `ow-main.js` | Built. Rough on a phone at the closest zoom | **Use with changes:** fix the phone bubble; make it the one look for the whole game |
| **The base doll**: Io's body, 21 outfits, each with a light model of about 50,000 triangles | **MF:** `base-doll-light/` | Approved as models. Nothing in Moon Faire loads it. Only one hairstyle; face variations not started | **Use with changes:** for a few important people only, because of its weight (question 10) |
| The first Envoi's townsfolk script, story and talking box | **E:** `src/game/script.js`, `story.js`, `talk.js` | Finished for the first Envoi | **Leave out** the words (alternate universe, written new). The talking box's portrait idea is worth keeping |
| The first Envoi's portraits (22) | **E:** `art/portraits/` | Finished | **Leave out:** they show the old cast |
| The first Envoi's paper-doll walkers | **E:** `src/walk/`, `art/walkers/` | Finished | **Leave out:** replaced by 3D people |

---

## 5. Places you walk

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **All 21 Envoi places in 3D** (Wickhollow, the cottage, the jetty, the Thornwood, Bogmire and its heart; the Warm Roads camp, the Ember Line road, the Dawnroost road, Dawnroost and its node; the northern camp, Eldergrove's edge, the cold moor, the crossroads, the shipyard; the frozen camp, Frostmere's shore, the frozen pass, Misthollow and its Moonwell) | **E:** `mfw/world3d/places/` (one data file and one tree file each) | Approved after Chris saw zone 1 reskinned ("everything looks really good"). Zones 2 to 4 are built the same way; he has not commented on them | **Use as is** for the towns. **Use with changes** for the wild places: they become part of the open land (question 5) |
| The 3D place engine: fitted walls, camera that is never inside a wall, walk-everywhere checks, keepsake shimmers, the two looks | **E:** `mfw/world3d/engine/` (6 files) | Approved in zone 1 | **Use as is** for towns |
| The four zone pages, joined on foot, with the save and the airship hook | **E:** `mfw/world3d/game/` | Built; all four pass their walk-through tests | **Use with changes:** a zone becomes one open land with its towns in it (question 5) |
| The four zones, already built as offline files (45.5, 47.7, 54.4 and 43.6 MB) | **E:** `mfw/world3d/builds/` | Built; they rebuild byte for byte from `main` | **Leave out:** built files are not copied; they are rebuilt here |
| The walking maps the 3D places stand on (where you can and cannot walk) | **E:** `src/game/maps.js` | Finished | **Use as is:** the 3D places need it |
| **Moon Faire's open land**: 768 m by 512 m, drawn in 32 m squares round the camera at four levels of detail, with a far ring to the horizon | **MF:** `game/openworld/src/land.js`, `ow-terrain.js`, `ow-core.js` | Approved ("absolutely the way I want the map to be") | **Use with changes:** this is the method for Aethermoor's wilds. Its land is read from Moon Faire's own painted map; it must read Aethermoor's heights and ground instead |
| Wild plants: 5 flowers, grasses, rushes, bracken, gorse, 144 trees you walk round | **MF:** `game/openworld/src/ow-flora.js`, `ow-props.js` | Built | **Use with changes:** the sowing method yes; the plants become each zone's own (the Thornwood's thorny trees first) |
| The automatic zoom (close standing, further walking, furthest running) | **MF:** `game/openworld/src/ow-main.js` | Approved (set from Chris's own screenshots) | **Use as is.** It has to be joined with Envoi's never-inside-a-wall camera |
| Unseen chance meetings, only away from lamps and people | **MF:** `game/openworld/src/ow-main.js` | Built as a stand-in (it shows a card, not a fight) | **Use with changes:** it starts a real fight (question 9) |
| The fair kit: tents, stalls, booth, wagon, well, lantern posts, carts, gate, crates, barrels, in Chris's painted skins | **MF:** `game/openworld/src/ow-kit.js`, `ow-dressing.js`, `game/openworld/data/` | Built. Chris has not yet said what to change in the bigger fairground | **Use as is,** wherever the Faire camps (question 10) |
| Moon Faire's seven places (the fair square, the stall row and sparring ring, the mooring field, the Last Lantern, the standing stones, the hollow, the still pool and broken arch) | **MF:** `game/openworld/src/ow-places.js`, `data/places.json` | Built | **Use with changes:** the three fair places can travel with the Faire. The four moor places belong to Moon Faire's own land: **leave out** unless Chris wants them set somewhere on Aethermoor |
| The open world as a built page (about 15 MB), and the fair-square speed test | **MF:** `game/openworld/out/` | Built before the join; see the caution in section 1 | **Leave out:** rebuilt here |
| Moon Faire's painted walking places W1 to W9 | **MF:** `game/art/world/`, `game/art/pilot/` | Superseded by the open world | **Leave out** |
| The first Envoi's 2D walk and its paintings | **E:** `src/game/field.js`, `art/walk/` | Finished | **Leave out:** the paintings stay behind as the layout the 3D places were made from |

---

## 6. Maps

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **The 3D map of Aethermoor**: a true 3D land with heights read from the atlas, ground in Chris's textures, his Forest Builder trees at three levels of detail, all 21 places standing on it, two detail levels | **E:** `mfw/world-map/` (page 8.6 MB built) | Built, step 1 of 4. Chris's notes on it are in. Its copy of the places is one step behind the reskin | **Use with changes:** refresh its places; add steps 2 to 4 (choosing where to go, the flight, landing) |
| The land data behind it (height and kind of ground for the whole continent) | **E:** `mfw/world-map/art/` | Built | **Use as is.** This is also what the open land should read to be the right shape |
| The two atlases of Aethermoor, day and night (4608 by 3072) | **E:** `reference/art/world-map/` | Chris's paintings | **Use as is,** only if a build shows them; otherwise they stay behind as references |
| **The star map of the Thareia system**: twin suns, the far star, Thareia with Aethermoor on it, the moon, four planets, ships, travel hooks | **E:** `mfw/star-map/thareia-system-star-map.html` | Built. Not joined to the game. Planet and star names are stand-ins. It loads three.js from the internet | **Use with changes:** pack three.js inside it; fix the moon's name (question 7). Not needed until space travel is |
| Where the seven landings and the four level bands are on the atlas | **E:** `src/game/game.js` (`LANDINGS`), `src/game/world.js` (`BANDS`) | Finished | **Use as is** |
| The first Envoi's toy-sized flight | **E:** `src/game/fly.js`, `src/models/magpie.js` | Finished | **Leave out:** Skies of Aethermoor replaces it |
| Moon Faire's painted world map and its lines | **MF:** `game/world/map/` | Finished | **Leave out:** it is Moon Faire's own land, not Aethermoor |
| The map editor for painted walking places | **MF:** `light-levels/pages/map-editor.html` | Built, never used on a map | **Leave out:** painted walking places are gone |

---

## 7. Fights

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **The new battle**: Envoi's fights in their arenas with Io and Kore, Fate rules, trance glows, director camera, the Flipbook button | **E:** `mfw/battle/battle.html`, `mfw/src/battle/` (engine, rules, fights, screen, sim, sound), `mfw/src/kit.js` | Built. 44 of 51 balance targets met. Halcyon's fight and the finale are left out until rebuilt. Still to come: bodies that react, spells that mark the arena, turn openers and finishers | **Use with changes:** this is the suggested one fight (question 2). It needs the finale, Halcyon, and room for 3 and 4 witches |
| Envoi's eight 3D arenas (river glade, Eldergrove, Bogmire, Frostmere, the Warm Roads moor, Dawnroost's node, the crossroads, the dead Moonwell) | **E:** `src/stage/arena-*.js`, `art/arena/` | Finished | **Use as is** |
| The battle effects and Envoi Io's spell effects | **E:** `src/fx/` | Finished | **Use as is** |
| Io's Spell Book (her 7 own spells and Envoi Io's 9, to choose from) | **E:** `mfw/spellbook/` | Built; waiting for Chris's picks | **Leave out** of the game: a choosing page. His picks decide her spell list |
| **Moon Faire's fight piece**: four witches on five painted backdrops, started with one call | **MF:** `game/fight/`, built as `game/out/mf-fight.js` | Camera approved ("perfect"). Herbs, carried HP, brambles and the two-form boss not joined | **Leave out** as a second fight (question 2). **Take from it:** the move-picking screen with its laptop corner card, the framing guard, and the "number a beat after the blow" timing |
| The approved four-witch combat engine, every number in one block | **MF:** `game/sim/blob-battle-engine.js` (same file in `docs/project-notes/lore/sim/`) | Approved (Chris played it and likes the balance) | **Use with changes:** the source for Europa's and Callisto's moves and numbers, and for Kore in a party of four |
| Moon Faire's five fight backdrops (F1 to F5) | **MF:** `game/art/fights/`, `game/art/pilot/F1.png` | Chris's paintings | **Leave out** if fights use Envoi's 3D arenas; keep in mind for a land with no arena |
| Envoi's 17 painted fight backdrops | **E:** `art/backdrops/`, `art/arena/` (copies in **MF:** `game/world/envoi-fight-backdrops/`) | Finished | **Use as is** where an arena shows one |
| The fight cameras tried on the pilot | **MF:** `light-levels/pages/pilot-fight-cameras.html` | Built as a patch, never applied | **Leave out:** the fight piece's director camera replaced it |

---

## 8. Levelling, finds, herbs and the pretend players

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| The levelling plan: 20 levels, about 180 fights, six bands of land, two gates | **MF:** `game/plan/levelling/plan-v2.json` | Approved (option B) | **Use with changes:** keep 20 levels and the pace; the bands and gates become Envoi's four zones (question 4) |
| Envoi's levels, foes, and how often they come | **E:** `mfw/src/battle/rules.js`, `fights.js` | Chris: keep them | **Use as is,** then rebalance for the merged game |
| The 18 finds, at half strength, each with a picture card | **MF:** `game/plan/finds/finds.json`, `game/art/items/` | Approved (names and cards "work"). He still dislikes that finding all of them is nearly a sure win | **Use with changes:** retune once the fight rules are set |
| Envoi's keepsakes (20 pictures), found as shimmers in the 3D places | **E:** `src/game/keepsakes.js`, `art/keepsakes/` | Finished; the shimmers work in the 3D zones | **Use as is.** Finds and keepsakes are the same idea: they should become one list |
| Herbs and rest spots: picked from wild plants, one press tops everyone up | **MF:** `game/plan/herbs/herbs-chosen.json` | Approved. Four small answers still owed by Chris | **Use as is,** beside Envoi's shop herbs (question 2) |
| The final fight plan: helpers first, then alone, refilled between; easy, medium, hard, crazy | **MF:** `game/plan/finalboss/final-fight.json` | Approved | **Use as is** |
| **The eight pretend players** that play whole games to test balance | **MF:** `game/plan/testers/testers.js` | Approved (he is less sure about the two play styles) | **Use with changes:** teach them the merged rules |
| Envoi's balance checker (51 targets) and Fate simulator | **E:** `mfw/tools/balance.mjs`, `fate-sim.mjs` | Built | **Use as is** as a check |
| Moon Faire's story as data: four acts, 45 happenings, twelve lamps | **MF:** `game/world/world.json` | Data. None of it plays. Written for the other continent | **Leave out** until the story is settled (question 1) |
| The shared save, and the hook that hands over to a flight | **E:** `mfw/world3d/game/zone.js` (`envoi3d-save`, `W3D.zoneFly`) | Built and tested in zone 1 | **Use with changes:** the save gets a new name and the party, level and herbs added |

---

## 9. Sound and music

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **155 battle sounds made in code**, each labeled with what it is for | **E:** `mfw/src/battle/sound.js` | Built and wired to every sound moment | **Use as is** |
| **The six dark music pieces made in code** (Ashen Reel, Ethereal, Ominous, Frenzy, Dirge, Reckoning), with the plan of where each plays | **E:** `mfw/src/battle/sound.js` (`PLAN`) | Approved ("chef's kiss perfect"); locked in. Dirge not yet heard after a real loss | **Use as is.** Chris wants music like them for every part of the game, so walking music in the same family is new work |
| The Sound Board (every sound by name, tap to hear) | **E:** `mfw/sound/sound-board.html` | Built | **Use as is** as a check page |
| Sound Choices (four versions each of the ten most common sounds) | **E:** `mfw/sound/choices.html`, `choices.js` | Built; waiting for Chris's picks | **Leave out** of the game; his picks change the sounds above |
| Chris's five songs, compressed for phones, with the originals | **E:** `mfw/music/` (Moonlit Forest Path twice, Herbal Lullaby, Untitled, Carnival of Ashes; Herbal Decay as his own file) | His own songs. On hold by his word | **Leave out** until he says where each plays. They are his work and stay labeled |
| The Battle Music Lab: tools that work on any song | **E:** `mfw/music/lab/` | Built | **Leave out:** a tool |
| The quiet song bed with a volume knob | **E:** `mfw/src/song-bed.js` | Built, set to off | **Leave out** with the songs |
| The first Envoi's sounds, footsteps and world ambience | **E:** `src/battle/sound.js`, `src/game/footsteps.js`, `thareia-audio.js` | Finished. Chris scrapped the old battle sounds | **Leave out** the battle sounds. **Use with changes:** footsteps and ambience, since nothing newer exists for walking |
| Moon Faire: no sound in the game | | | Nothing to take. Its sound-request prompts and audio intake tool stay behind |

---

## 10. Textures and paintings

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **Chris's made textures**: rounds one and two (130), plus the short list of 28, kept exactly as he made them | **E:** `mfw/texture-packs/made/` with `index.csv` and `prompts/` | Approved in the reskinned zones. Six show a faint line where they repeat | **Use as is,** but copy only the ones a build uses, each with its label |
| Web-sized copies of those textures | **E:** `mfw/texture-packs/made-web/` with `index.csv` | Built | **Use as is:** these are what a build should carry |
| The stand-in textures and the 365 prompts for 31 places | **E:** `mfw/texture-packs/` (per-place folders, `BRIEF.md`) | Finished; replaced wherever a made texture exists | **Leave out:** references and prompts |
| The catalogue of every texture pack across Chris's repos (388 pictures in 13 packs) | **E:** `mfw/texture-library/library.json` | Finished | **Leave out:** a catalogue; useful when new land needs textures |
| Chris's 52 painted pictures for the fair kit and the moor | **MF:** `game/openworld/round1/`, `round2/`, `round3/`; made ready in `game/openworld/data/` | Approved in use | **Use as is** (the ready-made sheets in `data/`), with the fair kit |
| The fair folk's painted skins | **MF:** `game/people/skins/`, baked into `game/people/npc/npc_tex.js` | Approved | **Use as is** (the baked file) |
| Chris's Forest Builder tree models | **E:** `mfw/world-map/art/trees/`, packed in `mfw/world-map/map/tree-models.js` | Built at three levels of detail | **Use as is.** Worth trying at walking height in the open land |
| Story pictures S1 to S4 and the title picture T1 | **MF:** `game/art/story/` | Chris's paintings, for Moon Faire's story | **Leave out** until the story is settled |
| The first Envoi's title art | **E:** `art/title/key-art.webp` | Finished | **Leave out:** the old game's title |

---

## 11. Looks shared across the game

| Asset | Where | How finished | Suggestion |
|---|---|---|---|
| **The Flipbook look** (a pixel-and-ink picture, with sliders for pixel size and colours) | **MF:** each witch's `viewer/stage.js`; the open world's version in `game/openworld/src/ow-main.js`; **E:** `mfw/src/flipbook.js` and the 3D world's version in `mfw/world3d/engine/` | Approved (he likes the finest setting). In the 3D world it has no ink outlines yet | **Use with changes:** there are four versions. The game needs one, with the ink outlines |
| Which weight of model where (Lightest walking and fighting, Light close up, Full in the viewer) | **MF:** `game/fight/witches/witch_levels.js` | Approved rule | **Use as is** |
| Trance glows made in code | **E:** `mfw/src/trance.js` | Built | **Use as is** |
| Laptop controls (tap twice to run, Shift to sprint, mouse turns the camera) and phone controls (thumb to walk, thumb to look) | **E:** `mfw/world3d/engine/walker.js`; **MF:** `game/openworld/src/ow-main.js` | Approved in both, and they nearly match | **Use with changes:** one set of controls for the whole game |
| A character viewer for the pause menu | not built in either game | | New work, later |

---

## 12. Tools

Tools are not copied (rule 2). They are listed so a job knows what exists and can read how something was made.

| Tool | Where | What it is for |
|---|---|---|
| The offline page builder (puts everything inside one HTML file) | **E:** `tools/build.mjs` | The game here needs its own builder. This is the one to model it on |
| Zone and place checks: walk to every edge, through no wall; nothing solid on walkable ground; phone stills | **E:** `mfw/world3d/tools/` | The same checks will be wanted for open land |
| Tree placing from a painting | **E:** `mfw/world3d/tools/make-trees.mjs` | |
| Terrain and place makers for the 3D map | **E:** `mfw/world-map/tools/` | Reading Aethermoor's heights for the open land starts here |
| Texture labeling and web copies | **E:** `mfw/texture-packs/tools/` | |
| Sound checks (every name exists; length and loudness; a whole fight with sound) | **E:** `mfw/sound/gaps.mjs`, `measure.mjs`, `fight.mjs` | |
| The open world's builder and its preparation scripts | **MF:** `game/openworld/build.py`, `prep_*.py` | How the land's rules are read from a map |
| The fair folk kit: making, skinning, weighting and reviewing a person | **MF:** `game/people/kit/` | For new people in new skins |
| The light-levels tools (making Trim, Light and Lightest from a full model) | **MF:** `light-levels/tools/` | For any new model |
| The Grey Hat's light-version packer | **MF:** `models/grey-hat-3d/npc/pack.py` | |
| The line checker and talk tests | **MF:** `game/people/talk/check_lines.py`, `test_talk.mjs`, `test_minds.mjs` | For the new lines |
| Audio intake (trims, levels, labels a song or a sound) | **MF:** `tools/pack_audio.py` | When Chris's songs come back |

---

## 13. Left behind whole

Older work that the merged game does not need. It all stays in the old repos.

| What | Where |
|---|---|
| The first Envoi as a finished 2D game, its final file, guides and cutscenes | **E:** `envoi-final-draft/`, `envoi-game-pass-3/`, `3d-cutscenes/`, `putting-it-all-together/`, `demos/` |
| The Bramble Colossus field study and the living battlefield | **E:** `3d-model-field-studies/`, `living-battlefields/` |
| The first Envoi's own Io model at Colossus detail | **E:** `3d-model-main-characters/` |
| The first Envoi's lore bible and specs | **E:** `docs/lore/`, `docs/specs/` |
| Moon Faire's October coded films of the Jester | **MF:** `scenes/` |
| Moon Faire's pilot and painted-walk pages | **MF:** `game/src/`, `game/out/` (except the fight piece) |
| Envoi's foes as 2D sprites | **MF:** `art/foes/` |
| The "how light can she go" pages | **MF:** `light-levels/pages/` |

---

## 14. What the first test would need

The first build is Moon Faire's open land around the Thornwood, with Envoi's Wickhollow in it. If Chris agrees to the
pass list in question 13, this is everything it would copy in, and nothing else:

| Piece | From |
|---|---|
| The open-land method (land rules, squares round the camera, light and fog) | **MF:** `game/openworld/src/land.js`, `ow-terrain.js`, `ow-core.js` |
| The plant-sowing method | **MF:** `game/openworld/src/ow-flora.js` |
| The automatic zoom | **MF:** `game/openworld/src/ow-main.js` (that part) |
| Wickhollow and the Thornwood as 3D places | **E:** `mfw/world3d/places/wickhollow.js`, `wickhollow-trees.js`, `thornwood.js`, `thornwood-trees.js` |
| The place engine | **E:** `mfw/world3d/engine/` |
| The walking map for those two places | **E:** `src/game/maps.js` (those two entries) |
| Zone 1's ground heights and kinds | **E:** `mfw/world-map/art/` (the zone 1 part) |
| Only the textures those two places and the land use | **E:** `mfw/texture-packs/made-web/` |
| Io's light model and her walker | **E:** `mfw/witches/io_lod.js`, `io_tex.js`, `witch_levels.js`, `mfw/src/moon-io.js`, `moon-io-walker.js` |
| three.js r128 | **MF:** `game/lib/three.r128.min.js` |
