# minimap: a better map, small in the corner and big when tapped

Branch: job/minimap      Last commit: 9f58b93      Updated: 2026-11-18

## What it built
- **`game/engine/land/minimap.js`, rewritten.** It is a hand-drawn night map: dark blue paper, the land in moonlit inks.
  - **The land.** Woods are small tree crowns, fir forest is little fir trees, the thorn country is violet with thorny
    marks, the fen has reeds and small pools, open grass is lighter with grass ticks. Water has a pale shore line and a
    lighter ring just inside it. Roads are pale lines with a dark edge. Hills are shaded softly from the north-west, and
    there is a faint paper grain. Past the edge of the land she can walk, the land is still shown, but faint, as if in fog.
  - **The places.** Inside each place are its own buildings (small roofs, a warm window each), jetties, trees and lanes,
    and the camp's own tents and stalls. On top of each place is a small drawn mark: roofs for Wickhollow, thorn trees
    for the Thornwood, stilt houses for Bogmire, a dark pool for the fen's dark heart, a cottage with smoke for Io's
    cottage, a jetty with a boat, and a striped tent for the Moon Faire. Everything is drawn by code. Nothing is copied
    in and no picture is loaded.
  - **Her mark.** A gold pointed arrow that shows which way she faces, inside a soft halo that slowly breathes.
  - **The small map** sits top left: 150 px on a laptop, 124 px on a phone. It shows 290 m across, centred on her with
    north up, and the map slides under her. The only text is a small "N". A place's mark fades when it would sit under her.
  - **The big map** opens when you tap the small one. It shows the whole zone with the place names, "100 m" for scale, a
    north mark and a "×". Tapping anywhere closes it. It is sized to fit the screen either way up. Each name tries
    eight spots round its mark, on one line or two, and takes the clearest. The long road's name shows where the road
    leaves the zone.
  - **Out on the long road**, the small map keeps following her. The big map then shows the whole road with the zone at
    its foot, a flag at the far end, her mark, and a line like "2.2 km walked, 3.8 km to go". That line sits at the foot
    of the map, or at its head if the road runs under the foot.
  - **How it stays cheap.** The land is painted once into pictures: one for the zone; for the long road, one picture of
    the whole road plus 256 m squares near her. Painting is done in slices of about 7 ms in every 30 ms on a timer, so
    the game never waits for it. Each tick (7 a second, on a timer, never in the game's frame loop) only copies part of a
    picture, puts the place marks down and draws her mark. With `?test` there is no timer, and each picture is painted
    the first time it is wanted.
  - **What stays the same:** `W3D.miniMap({ root, land, walker })` still returns `{ el, big, open(on), draw() }`, plus
    `names`. It adds a few things for the checks: `timing`, `road()`, `tiles()`, `layout()`, `waiting()` and `dispose()`.
    A tap on either map does not move her or turn the camera.
- **`game/pages/zone-1.html`**, only the map's lines:
  - The small map is `clamp(124px, 22vmin, 150px)` square. Its frame is now drawn on the canvas.
  - The big map's size is set by the code.
  - `#bag` sits 22 px under the small map.
  - On a narrow screen (the `#toast` media rule), the toast sits under the bag rather than over it.

## What Chris said here
- Nothing yet. (This job's brief came from the hub.)

## What was copied in
- Nothing. Every mark is drawn with canvas code.

## What was checked, and how
- `python3 tools/zone-test.py builds/zone-1.html`: **ALL PASSED, 0 page errors**. That includes the long road walks.
- `tools/look.py` pictures, 0 page errors, at three sizes: laptop 1280×720, phone 844×390 and phone 390×844. The phone
  sizes were taken at twice the pixels, as a phone has, with the phone settings. Places shown: the camp, the Thornwood,
  the fen by Bogmire, Wickhollow, the big map in the camp and by Bogmire, and the long road at its start, at 2.2 km and
  at its end.
- **Which way the arrow points**, checked by walking her for 2.5 s three ways:
  - She moved at 133.7° with her facing at 135°.
  - She moved at 89.1° with her facing at 90°.
  - She moved at 0° with her facing at 0°.
  - In the pictures the arrow points up-right, right and down to match.
- **Names on the big map** do not overlap at 1280×720, 844×390 or 390×844. The big map is 976×700, 514×370 and
  370×267 px at those sizes.
- **Times, measured in a browser with no screen.** It draws without a graphics card, so a real laptop is likely faster.
  A phone may be 2 to 4 times slower.
  - One question to the land about what a spot is (`kind`) takes about 0.009 ms.
  - The zone's picture: 54,000 spots asked (about 0.19 s), then drawn. That is about 0.43 s of work in all, on a laptop
    and with phone settings.
  - Played normally, that work is cut into slices. The longest single slice measured was 24 ms, with laptop settings and with phone settings.
  - The long road's whole picture: 93,000 spots, about 0.27 s of work, painted in the background after the zone's.
  - One 256 m square near her on the road: 17 to 40 ms of work. It is painted only as she comes to it.
  - One redraw of both maps: 0.4 to 1 ms for the small map, about 1.2 to 1.7 ms with the big map open, and up to 4 ms
    on the road at 390×844. These times include the canvas actually finishing its drawing.
  - The zone's picture is 1218×882 pixels on these screens, and up to 2028×1470 on a large sharp laptop screen.
- **Not checked:**
  - The frame rate, and whether the halo's breathing looks smooth at 7 redraws a second. Only Chris's laptop and phone
    can show motion or a frame rate.
  - How long the zone's picture takes to appear on a real phone. My guess is a few seconds after the game starts.
    Until then the small map shows dark paper with her mark.
  - A real iPhone's Safari. The code uses only canvas features Safari has, and it does not use canvas `filter`.

## Unfinished
- Each place's own ground is still a square clearing on the map, because in the game the land's trees stop at the edge
  of a place's ground. The place marks are drawings, not boxes, but the clearing's square shape shows (most of all round
  Bogmire and the fen's dark heart, which stand in water).

## For the hub
- **Board:** the map job is done on `job/minimap`, ready to bring in. It is merged with `job/zone-1` at 8e0540e (and its
  slip commit), and it uses the land's real `kind`, `wide` and `longRoad`. I never used a stand-in.
- **The land, if you want the map better still:**
  - Past the walkable edge, `kind` keeps running its rules for thorn, fen and water in straight bands that go on for
    kilometres north of the zone. So the map ignores thorn, fen and water there. The land past the edge also changes at
    a straight north-south line near x = -400. I think that is where the 3D map's own colours begin. You can see it on
    the big map of the long road.
  - A place's `water` comes from the place's own data. The rest of what a place holds (buildings, jetties, trees, lanes)
    the map reads from the walker's zone (`walker.P.parts`). If the land gave those through `mapData`, the map would not
    need to reach into the place engine.
  - The far end of the long road has no name in the data. If it gets one ("The end of the road, for now", or zone 2's
    name), the map can write it by the flag.
- **The words the map says** ("walked", "to go", "km", "m", "N") are at the top of minimap.js. The page can change them
  with `W3D.miniMap({ ..., words: { ... } })`. Place names and the road's name come from the data.
