#!/usr/bin/env python3
"""townsfolk-guides.py: makes the grey guides Chris paints over, with the fair folk kit's OWN tools (Coven of the
Moon Faire, the townsfolk job, November 24, 2026).

    python3 tools/townsfolk-guides.py <the old Moon Faire repo> <work folder> <out folder> [id ...]

The kit that made the eleven fair folk is in the old Moon Faire repo (game/people/kit/), and it is not copied into
this repo: the game does not use it. This tool reads the kit's files out of the old repo with `git show` into the work
folder (so nothing is ever written in the old repo), builds the kit's own test stage there with its build_viewer.py,
and then, for each person in game/people/folk/townsfolk/shapes/, uses the kit's guides.py and shoot.py as they are:

    <id>-body-guide.png   the model standing, plain greys, front (left half) and back (right half), 1536 x 1024
    <id>-face-guide.png   the kit's face guide (its face_plain.webp), the same for everyone, named for the person
    <id>-shape.jpg        the kit's own sheet of the person as built: front, three-quarter, side, back, walking, the face twice
    facts.json            what the kit counted for each: triangles, parts, errors
    style-example.jpg     three of the Faire's own eleven, seen from behind, on flat grey: cut out of the painted sheets
                          Chris made for them (the old repo's game/people/skins/), so ChatGPT can match their finish

    python3 tools/townsfolk-guides.py <the old Moon Faire repo> <work folder> <out folder> --style-only
        makes only style-example.jpg (no browser, a few seconds)

This is a tool for making art, not part of a build: the game and tools/build.py never need the old repo.
Needs Python 3 with Playwright, Chrome and Pillow. The pictures are drawn with no graphics card: run it through the
shared lock on a shared machine.
"""
import asyncio, json, os, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SHAPES = os.path.join(ROOT, 'game', 'people', 'folk', 'townsfolk', 'shapes')
NEED = ['lib/three.r128.min.js', 'models/jester/meshopt_simplifier.js', 'models/jester/jester_tex.js', 'models/jester/jester_kit.js',
        'models/jester/lod.js', 'src/stage.js', 'people/kit/build_viewer.py', 'people/kit/viewer.tpl.html', 'people/kit/person-kit.js',
        'people/kit/face_plain.webp', 'people/kit/shoot.py', 'people/kit/guides.py']


def fetch(old, work):
    for f in NEED:
        dst = os.path.join(work, 'game', f)
        if os.path.exists(dst):
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        open(dst, 'wb').write(subprocess.check_output(['git', '-C', old, 'show', 'HEAD:game/' + f]))
    stage = os.path.join(work, 'game', 'people', 'out', 'person-stage.html')
    if not os.path.exists(stage):
        subprocess.check_call([sys.executable, os.path.join(work, 'game', 'people', 'kit', 'build_viewer.py')], cwd=os.path.join(work, 'game'))
    return os.path.join(work, 'game', 'people', 'kit')


STYLE = [('baker', 'A'), ('fortune', 'B'), ('lampseller', 'A')]      # the baker, the old lamplighter, the lamp-seller


def style_example(old, work, out):
    """The painted BACK figure of three of the eleven, cut out along the guide's outline (moved by the fit the kit measured) and stood on flat grey."""
    import io
    import numpy as np
    from PIL import Image
    from scipy import ndimage
    show = lambda f: subprocess.check_output(['git', '-C', old, 'show', 'HEAD:game/people/skins/' + f])
    tiles = []
    for model, letter in STYLE:
        body = np.array(Image.open(io.BytesIO(show('%s/%s-body.webp' % (model, letter)))).convert('RGB')); H, Wd = body.shape[:2]; hw = Wd // 2
        g = np.array(Image.open(io.BytesIO(show('%s/guide.png' % model))).convert('RGB')).astype(int); gm = (np.abs(g - 0x6e).sum(2) > 6)[:, 768:]
        sx, sy, ox, oy = json.loads(show('%s/%s.json' % (model, letter)))['fit']['back']
        yy, xx = np.mgrid[0:H, 0:hw]; u = xx / hw; v = 1 - yy / H                     # a painted point (0 to 1, y up)
        gu = (u - ox) / sx; gv = (v - oy) / sy                                         # where that point is on the guide
        gx = np.clip((gu * 768).astype(int), 0, 767); gy = np.clip(((1 - gv) * 1024).astype(int), 0, 1023)
        m = gm[gy, gx] & (gu >= 0) & (gu < 1) & (gv >= 0) & (gv < 1)
        soft = ndimage.gaussian_filter(ndimage.binary_erosion(m, iterations=2).astype(float), 1.2)[..., None]
        half = body[:, hw:].astype(float)
        tiles.append(Image.fromarray((half * soft + 0x6e * (1 - soft)).astype(np.uint8)))
    im = Image.new('RGB', (sum(t.width for t in tiles), tiles[0].height), (0x6e, 0x6e, 0x6e)); x = 0
    for t in tiles:
        im.paste(t, (x, 0)); x += t.width
    os.makedirs(out, exist_ok=True)
    im.save(os.path.join(out, 'style-example.jpg'), quality=90)
    print('style-example.jpg  %d x %d: %d of the eleven, from behind' % (im.width, im.height, len(tiles)))


async def run(kit, out, ids):
    sys.path.insert(0, kit)
    from shoot import Shooter
    import guides as G
    from PIL import Image
    os.makedirs(out, exist_ok=True)
    face = Image.open(os.path.join(kit, 'face_plain.webp')).convert('RGB')
    s = await Shooter().start()
    facts_all, bad = {}, 0
    for pid in ids:
        code = open(os.path.join(SHAPES, pid + '.js'), encoding='utf-8').read()
        facts, sheet = await s.shoot(code)
        facts_all[pid] = facts
        if not sheet or facts.get('errors'):
            bad += 1
            print('%-11s COULD NOT BE BUILT: %s' % (pid, facts.get('errors')))
            continue
        sheet.save(os.path.join(out, pid + '-shape.jpg'), quality=86)
        (await G.guide(s, code)).save(os.path.join(out, pid + '-body-guide.png'))
        face.save(os.path.join(out, pid + '-face-guide.png'))
        own = facts.get('own', {})
        print('%-11s %5d triangles (%4d in %2d shapes of its own)  height %.2f  build %s' % (pid, facts['triangles'], sum(own.values()), len(own), facts['scale']['height'], facts['scale']['build']))
    await s.stop()
    json.dump(facts_all, open(os.path.join(out, 'facts.json'), 'w'), indent=1)
    print('%d people, %d could not be built' % (len(ids), bad))
    return bad


def main():
    if len(sys.argv) < 4:
        sys.exit(__doc__)
    old, work, out = (os.path.abspath(p) for p in sys.argv[1:4])
    rest = sys.argv[4:]
    style_example(old, work, out)
    if '--style-only' in rest:
        return
    ids = rest or sorted(f[:-3] for f in os.listdir(SHAPES) if f.endswith('.js'))
    kit = fetch(old, work)
    sys.exit(1 if asyncio.run(run(kit, out, ids)) else 0)


if __name__ == '__main__':
    main()
