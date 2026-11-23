#!/usr/bin/env python3
"""build.py: packs one page of the game into a single HTML file with everything inside it.

    python3 tools/build.py game/pages/first-test.html          ->  builds/first-test.html

What it does, in order:
  1. Makes Io's model file (tools/make-io.mjs) if it is missing or older than its two sources.
  2. Puts every local <script src="..."> and <link rel="stylesheet" href="..."> inside the page.
  3. Turns every picture path written in double quotes inside those scripts into the picture itself:
       "./something.webp"   read from the page's folder, or else from the folder of the script that names it
       "art/something.avif" read from game/art/
     A path whose file is not in this repo is left as it is (the place engine then uses a plain colour).
  4. Checks that the finished file names nothing on the internet, and nothing outside itself.

Nothing is read from the old repos or from the web: a build works with only this repo on the disk.
The file goes into builds/, which is not kept in git (the files are tens of megabytes).
"""
import base64, os, re, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
GAME = os.path.join(ROOT, 'game')
MIME = {'mp3': 'audio/mpeg', 'webp': 'image/webp', 'png': 'image/png', 'jpg': 'image/jpeg', 'jpeg': 'image/jpeg', 'avif': 'image/avif',
        'webm': 'audio/webm', 'm4a': 'audio/mp4', 'woff2': 'font/woff2'}
PIC = re.compile(r'"((?:art/|\./)[^"\n]+\.(webp|png|jpe?g|avif|webm|m4a|mp3))"')


def make_io():
    d = os.path.join(GAME, 'witches', 'io')
    out, srcs = os.path.join(d, 'io_plus.js'), [os.path.join(d, 'io_lod.js'), os.path.join(d, 'io-new-moves.frag.js')]
    if not os.path.exists(out) or any(os.path.getmtime(s) > os.path.getmtime(out) for s in srcs):
        subprocess.check_call(['node', os.path.join(ROOT, 'tools', 'make-io.mjs')])


def inline_pictures(code, page_dir, script_dir, stats):
    def one(m):
        p, ext = m.group(1), m.group(2).lower()
        if p.startswith('./'):
            f = os.path.normpath(os.path.join(page_dir, p))
            if not os.path.exists(f):
                f = os.path.normpath(os.path.join(script_dir, p))
        else:
            f = os.path.join(GAME, p)
        if not os.path.exists(f):
            stats['left'].append(p)
            return m.group(0)
        data = open(f, 'rb').read()
        stats['pics'] += 1
        stats['bytes'] += len(data)
        return '"data:' + MIME['jpeg' if ext == 'jpg' else ext] + ';base64,' + base64.b64encode(data).decode() + '"'
    return PIC.sub(one, code)


def build(rel):
    src = os.path.join(ROOT, rel)
    page_dir = os.path.dirname(src)
    html = open(src, encoding='utf-8').read()
    stats = {'pics': 0, 'bytes': 0, 'left': [], 'scripts': 0}

    def script(m):
        f = os.path.normpath(os.path.join(page_dir, m.group(1)))
        code = inline_pictures(open(f, encoding='utf-8').read(), page_dir, os.path.dirname(f), stats)
        stats['scripts'] += 1
        return '<script>\n/* ' + os.path.relpath(f, ROOT) + ' */\n' + re.sub(r'</script', r'<\\/script', code, flags=re.I) + '\n</script>'
    html = re.sub(r'<script src="(\.\.?/[^"]+\.js)"></script>', script, html)
    html = re.sub(r'<link rel="stylesheet" href="(\.\.?/[^"]+\.css)">',
                  lambda m: '<style>\n' + open(os.path.normpath(os.path.join(page_dir, m.group(1))), encoding='utf-8').read() + '\n</style>', html)
    html = inline_pictures(html, page_dir, page_dir, stats)   # pictures the page's own script names

    # nothing may be fetched from anywhere: no web address (the w3.org names are namespaces, not addresses), no file left outside
    bare = re.sub(r'data:[^"\')\s]+', '', html)
    web = [u for u in re.findall(r'https?://[^\s"\'<>)]+', bare) if 'www.w3.org' not in u]
    outside = re.findall(r'<script src="[^"]+"|<link rel="stylesheet" href="[^"]+"', bare)
    os.makedirs(os.path.join(ROOT, 'builds'), exist_ok=True)
    out = os.path.join(ROOT, 'builds', os.path.basename(src))
    open(out, 'w', encoding='utf-8').write(html)
    mb = os.path.getsize(out) / 1048576
    print('%s  %.1f MB  (%d scripts, %d pictures inside, %.1f MB of pictures)' % (os.path.relpath(out, ROOT), mb, stats['scripts'], stats['pics'], stats['bytes'] / 1048576))
    left = sorted(set(stats['left']))
    if left:
        print('  %d picture paths are not in this repo and were left as they are (stand-ins the engine does not need), such as %s' % (len(left), left[0]))
    if web or outside:
        print('  STOP: the file still reaches outside itself: ' + ', '.join((web + outside)[:5]))
        sys.exit(1)
    print('  nothing is fetched from the web or from another file')
    return out


if __name__ == '__main__':
    pages = sys.argv[1:]
    if not pages:
        sys.exit('usage: python3 tools/build.py game/pages/<page>.html [...]')
    make_io()
    for p in pages:
        build(p)
