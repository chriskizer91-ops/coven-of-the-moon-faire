# The hub's own tools

| File | What it does |
|---|---|
| `all-checks.sh` | The whole-game check: every check, one at a time, on the pages in `builds/`. Its top lines say how |
| `pw-bridge/` | For a machine with a Node Playwright but no Python one: `PYTHONPATH=tools/hub/pw-bridge python3 tools/<check>.py ...` runs any check here through Node. It covers only what the repo's checks use |
| `begin-shot.py`, `probe.py`, `sheet.py`, `copy-place.py` | Small helpers from the first weeks: a picture after Begin, a look inside a page, a sheet of pictures, a place copied from the old Envoi |

A browser with no screen cannot show a frame rate or motion. Only Chris's laptop and phone can.
