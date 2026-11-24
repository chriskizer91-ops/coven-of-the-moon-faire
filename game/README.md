# game/: the game's own files

Everything a build needs is in this folder (and `tools/`). Nothing is loaded from the old repos or from the web.

| Folder | What it holds |
|---|---|
| `pages/` | One HTML page per build. A page lists the pieces it uses; `tools/build.py` packs them into one file |
| `engine/place/` | The place engine: builds a town from its data, lights it, walks Io round it, keeps the camera clear of walls |
| `engine/land/` | The land engine: open land round a place, drawn in squares round the walker |
| `places/` | A place's data: where its houses, walls, water, lamps and trees are. And the land round it |
| `data/` | Where feet can stand in each place |
| `witches/` | The witches' models, one folder each |
| `look/` | The Flipbook look |
| `texture-packs/made-web/` | Chris's textures, with their labels in `index.csv` |
| `art/` | Paintings |
| `lib/` | three.js r128 |
| `menu/` | The pause menu, the three save slots and the tab frame other pieces add their tabs to (the menu job's) |
| `travel/` | The landings a ship sets down at, one for each zone (the hub's) |
| `flight/` | The flight between zones, made from Skies of Aethermoor: its sources, the one built piece a page loads (`flight-frame.js`), and the baked ship that lies at a landing (the flight job's) |
| `maps/` | The menu's Maps tab: the zone's own map, the 3D map of Aethermoor (with choosing where to fly: `W3D.maps.world.choose`), and the star map of the Thareia system in a frame of its own. Every name and line is in `maps/data/maps-data.js` (the maps job's) |

## Build and check

```
python3 tools/build.py game/pages/first-test.html     # -> builds/first-test.html, one file, everything inside
python3 tools/walk-test.py builds/first-test.html     # walks out of town and back, and checks it by numbers
python3 tools/look.py builds/first-test.html shots    # pictures, with no screen
```

`builds/` is not kept in git: the files are tens of megabytes. Build one when it is needed.

Needs: Python 3 with Playwright and Chrome (for the two checks), and Node (to make Io's model file).

## How the pieces join

- A page loads the place engine, then the land engine, then a place's data, then the land's data.
- The place engine builds the place. If the place's data carries `land`, the land engine wraps the place: inside the
  place's own ground the place answers "can she stand here, how high is the ground"; past it, the land answers. So
  walking out of town needs no fade and no change to the walker.
- Positions inside a place are in its painting's pixels (1536 by 1024; one pixel is 4 cm across and 5 cm down). The
  land is in metres, with the place's middle at 0, 0, x east and z south.

Where each file came from is in `assets/INDEX.csv`. A copied file that was changed here says so in a comment marked
"Coven".
