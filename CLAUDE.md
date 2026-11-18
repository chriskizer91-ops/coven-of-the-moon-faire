# CLAUDE.md: the rules every session follows

This is **Coven of the Moon Faire**, one game made from two: the new Envoi and Moon Faire. Read this first, then
`docs/BOARD.md`.

## 1. The old repos are read-only

- The two sources are `chriskizer91-ops/envoi-on-the-longest-night` and `chriskizer91-ops/moon-faire`, on their `main`
  branch only.
- Never push to them, never open a pull request on them, never change a file in them.
- This repo, `chriskizer91-ops/coven-of-the-moon-faire`, is the only one any session writes to.
- A third read-only source, added by Chris on November 18: `chriskizer91-ops/airship-game-in-aethermoor-` (Skies of
  Aethermoor), for flying between zones. The same rules apply to it: never push to it, copy only what the game uses.
- Any other repo of Chris's is off limits until Chris adds it as a source in `docs/decisions.md`.

Both old repos are heavy. Read them without downloading everything:

```
GIT_LFS_SKIP_SMUDGE=1 git clone --depth 1 --filter=blob:none --no-checkout <url> <folder>
git -C <folder> ls-tree -r --name-only HEAD      # the file list (do not use ls-tree -l: it downloads every file)
git -C <folder> show HEAD:<path>                 # one file
```

## 2. Copying an asset in

- Copy an asset in **only when the game uses it.** No copying "in case".
- Copy **the finished piece**, not its references, its build tools, its stage pictures or its earlier versions.
- Every copied file, or folder copied whole, gets **one line in `assets/INDEX.csv`** in the same commit:

  | Column | What goes in it |
  |---|---|
  | `path_here` | where it now lives in this repo |
  | `source_repo` | `envoi-on-the-longest-night` or `moon-faire` |
  | `source_branch` | `main` |
  | `source_commit` | the commit it was read from (short hash is fine) |
  | `source_path` | its path in the old repo |
  | `what_it_is` | a few plain words |
  | `date_copied` | `2026-11-18` style |

- If a copied file is then changed here, leave its line as it is. The line says where it came from, not what it is now.
- Something made new in this repo needs no line.
- `docs/assets-list.md` says what exists and whether it is suggested for use. It is a menu, not permission: a job copies
  only what its own build needs.

## 3. The game never loads anything from the old repos

- No script, picture, sound or data file is fetched from an old repo, from GitHub, or from a claude.ai link when the
  game runs or when it is built.
- Everything a build needs is in this repo. A build must work with the old repos deleted.

## 4. Who writes what

- **The hub** is the one conversation that edits `docs/BOARD.md` and merges into `main`. Nobody else does either.
- **A job conversation** works on its own branch, `job/<name>`, and writes only one file under `docs/`:
  `docs/slips/<name>.md`. Everything else it writes is the game's own files for its job.
- A job never edits another job's files, another job's slip, the board, `docs/decisions.md`, `docs/questions.md`,
  `docs/assets-list.md` or this file. If it needs one of those changed, it says so in its slip.
- A job pushes to its own branch as it goes. When it is ready, Chris tells the hub, and the hub brings it into `main`
  and updates the board.
- `docs/slips/README.md` says what a slip holds.

## 5. Chris's word, and the lore

- **Chris's newer word beats older notes.** That includes the notes copied from the old repos, the two surveys, and
  everything in `docs/` here. When he decides something, the hub writes it in `docs/decisions.md` with the date.
- **Lore is not final until Chris says so.** A proposal by Claude is marked as a proposal and stays one until he
  approves it. Text the player reads (names, lines, place names) lives in data files, not in code, so it is easy to
  change.
- Don't settle one of Chris's calls by building it. The open calls are in `docs/questions.md`.

## 6. How to talk to Chris, and what a build is

- **Plain words.** Short sentences, no jargon. Say what something is before using its name.
- **Pictures and simple numbers.** Show a step with screenshots, and with a few numbers a person can check
  (how many, how big, how fast). Say what was not checked.
- **Uncluttered phone screens.** Few buttons, large enough for a thumb, nothing covering the middle of the picture.
- **A build is one HTML file** with everything inside it, that opens on his laptop and on his phone, with no
  internet needed. Send it as a file to download.
- Every step ends with something Chris can open.

## 7. The repo is public

- No keys, tokens or passwords, ever, in any file or commit message.
- No private details: nothing about Chris's family, his accounts, his devices' names, or paths on his own computer.
- Before pushing, search what you added for keys, email addresses and private details.
- When copying a note from an old repo, the same rule applies to the copy.

## Where things are

| File | What it is | Who writes it |
|---|---|---|
| `CLAUDE.md` | These rules | the hub, on Chris's word |
| `README.md` | What the game is and how the repo is laid out | the hub |
| `docs/BOARD.md` | Where the game stands, what is being worked on, what is left, the jobs | the hub only |
| `docs/decisions.md` | Chris's decisions, newest first | the hub |
| `docs/questions.md` | The calls only Chris can make, each with a suggestion | the hub |
| `docs/assets-list.md` | Every finished asset in both old games, and a suggestion for each | the hub |
| `docs/lore/` | The lore: what is settled, what is proposed, what is open | the hub and the lore job |
| `docs/slips/<name>.md` | One job's own notes | that job only |
| `assets/INDEX.csv` | One line for every asset copied in | whoever copies it, in the same commit |
