#!/usr/bin/env python3
"""flight-night-map.py: packs Chris's night map of Aethermoor for the flight between zones.

    python3 tools/flight-night-map.py <the old Envoi repo>/reference/art/world-map/night

It reads the nine night tiles (regions/01-... to 09-..., each 1536 by 1024, north up, in reading order) and the whole
night atlas, and writes into game/flight/assets/map/:
    night-1.avif ... night-9.avif    the nine tiles, as AVIF (about a third the size of WebP for the same look)
    minimap-night.webp               the whole night map, 768 wide, for the corner map
It is run once, when the night map changes: the game's build never runs it, and reads nothing from the old repo.
The same packing Skies of Aethermoor does for its day map (its tools/map-art.mjs), written again here for Python.
"""
import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'game', 'flight', 'assets', 'map')


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)
    src = sys.argv[1]
    tiles = sorted(f for f in os.listdir(os.path.join(src, 'regions')) if f[:2].isdigit() and f.endswith('.png'))
    if len(tiles) != 9:
        sys.exit('expected nine tiles in %s/regions, found %d' % (src, len(tiles)))
    os.makedirs(OUT, exist_ok=True)
    total = 0
    for i, f in enumerate(tiles):
        im = Image.open(os.path.join(src, 'regions', f)).convert('RGB')
        if im.size != (1536, 1024):
            sys.exit('%s is %s, not 1536 by 1024' % (f, im.size))
        out = os.path.join(OUT, 'night-%d.avif' % (i + 1))
        im.save(out, quality=52, speed=3, subsampling='4:2:0')
        total += os.path.getsize(out)
    atlas = [f for f in os.listdir(src) if f.lower().endswith('atlas.webp')][0]
    im = Image.open(os.path.join(src, atlas)).convert('RGB')
    mini = os.path.join(OUT, 'minimap-night.webp')
    im.resize((768, 512), Image.LANCZOS).save(mini, quality=82, method=6)
    print('9 tiles: %.2f MB, the corner map %d KB' % (total / 1048576, os.path.getsize(mini) / 1024))


if __name__ == '__main__':
    main()
