# Coven of the Moon Faire

One game made from two of Chris's games:

- **The new Envoi** (Envoi with the Moon Faire witches): four zones of Aethermoor built in 3D, a 3D map of the whole
  land, a rebuilt battle with sound and music. Source: `chriskizer91-ops/envoi-on-the-longest-night`, branch `main`.
- **Moon Faire**: the four witches of the coven as 3D models, the fair folk and their talk, an open land to walk,
  levelling, finds and herbs. Source: `chriskizer91-ops/moon-faire`, branch `main`.

The plan Chris set on November 18, 2026: use Envoi's zones, 3D map and battle; bring in Moon Faire's people, lore and
open land; use the open land to make the wilds of Aethermoor walkable. Then keep building.

## Where it stands

**Nothing of the game is built here yet.** This repo so far holds the rules, the board, the list of what exists in
both old games, and the questions Chris answers before building starts. See `docs/BOARD.md`.

The first build will be a test: Moon Faire's open land around the Thornwood, with Envoi's Wickhollow in it.

## Start here

1. `CLAUDE.md`: the rules every session follows.
2. `docs/BOARD.md`: where the game stands and who is doing what.
3. `docs/decisions.md`: what Chris has decided.
4. `docs/questions.md`: what he has not decided yet.
5. `docs/assets-list.md`: everything finished in both old games, where it lives, and whether it is suggested for use.

## How the repo is laid out

| Folder or file | What it holds |
|---|---|
| `CLAUDE.md` | The rules |
| `docs/BOARD.md` | The board (the hub writes it) |
| `docs/decisions.md` | Chris's decisions |
| `docs/questions.md` | The open calls |
| `docs/assets-list.md` | What exists in the two old games |
| `docs/lore/` | The lore |
| `docs/slips/` | One note per job |
| `assets/INDEX.csv` | Where every copied asset came from |

The game's own folders are added when the first build is made.

## The old repos

They stay as they are, as sources. Nothing here loads from them, and nobody pushes to them. An asset is copied over
only when the game uses it, with a line in `assets/INDEX.csv` saying where it came from.
