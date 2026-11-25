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
  5. (left-overs, November 25, 2026) Each picture or sound a script names is put in the page ONCE, in a table at the
     top (__CP), and every script that names it reads it from there: a texture five places use was packed five times.
     Only a path that stands as a plain value in code ("key": "./x.webp", or one passed to a call) is read from the
     table; anywhere else it is packed where it stands, as before.
  6. (left-overs) Says the file's real size in MB (1,000,000 bytes, as GitHub counts) and STOPS if a page is 100 MB or
     more (GitHub takes no file that large); it warns from 95 MB.

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


SAFE_BEFORE = tuple(':,([=?|&!+')     # left-overs: what may stand before a path that is a plain value in code
SAFE_AFTER = tuple(',)]};:|&?+')


def plain_value(code, m):
    # left-overs: is this quoted path a value in code (so a table reference can stand in its place)? Not a key ({ "a": 1 })
    a = code[:m.start()].rstrip(); b = code[m.end():].lstrip()
    before = 'return' if a.endswith('return') else a[-1:]
    after = b[:1]
    if after == ':' and before in ('{', ','):
        return False
    return (before == 'return' or before in SAFE_BEFORE) and after in SAFE_AFTER


def inline_pictures(code, page_dir, script_dir, stats, table=None):
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
        uri = '"data:' + MIME['jpeg' if ext == 'jpg' else ext] + ';base64,' + base64.b64encode(data).decode() + '"'
        if table is not None and plain_value(code, m):      # left-overs: once in the table, read from there
            i = table['at'].get(uri)
            if i is None:
                i = table['at'][uri] = len(table['list']); table['list'].append(uri)
            else:
                stats['shared'] = stats.get('shared', 0) + len(uri)
            return '__CP[%d]' % i
        return uri
    return PIC.sub(one, code)


def build(rel):
    src = os.path.join(ROOT, rel)
    page_dir = os.path.dirname(src)
    html = open(src, encoding='utf-8').read()
    stats = {'pics': 0, 'bytes': 0, 'left': [], 'scripts': 0}
    table = {'at': {}, 'list': []}      # left-overs: every picture and sound the scripts name, once

    def script(m):
        f = os.path.normpath(os.path.join(page_dir, m.group(1)))
        code = inline_pictures(open(f, encoding='utf-8').read(), page_dir, os.path.dirname(f), stats, table)
        stats['scripts'] += 1
        return '<script>\n/* ' + os.path.relpath(f, ROOT) + ' */\n' + re.sub(r'</script', r'<\\/script', code, flags=re.I) + '\n</script>'
    html = re.sub(r'<script src="(\.\.?/[^"]+\.js)"></script>', script, html)
    html = re.sub(r'<link rel="stylesheet" href="(\.\.?/[^"]+\.css)">',
                  lambda m: '<style>\n' + open(os.path.normpath(os.path.join(page_dir, m.group(1))), encoding='utf-8').read() + '\n</style>', html)
    html = inline_pictures(html, page_dir, page_dir, stats)   # pictures the page's own script names
    # left-overs: the table goes in before the page's first script, so every script can read it
    if table['list']:
        k = html.find('<script')
        html = html[:k] + '<script>\n/* left-overs: every picture and sound the scripts name, once (tools/build.py) */\nvar __CP = [' + ',\n'.join(table['list']) + '];\n</script>\n' + html[k:]

    # nothing may be fetched from anywhere: no web address (the w3.org names are namespaces, not addresses), no file left outside
    bare = re.sub(r'data:[^"\')\s]+', '', html)
    web = [u for u in re.findall(r'https?://[^\s"\'<>)]+', bare) if 'www.w3.org' not in u]
    outside = re.findall(r'<script src="[^"]+"|<link rel="stylesheet" href="[^"]+"', bare)
    os.makedirs(os.path.join(ROOT, 'builds'), exist_ok=True)
    out = os.path.join(ROOT, 'builds', os.path.basename(src))
    open(out, 'w', encoding='utf-8').write(html)
    size = os.path.getsize(out); mb = size / 1048576
    print('%s  %.1f MB  (%d scripts, %d pictures inside, %.1f MB of pictures)' % (os.path.relpath(out, ROOT), mb, stats['scripts'], stats['pics'], stats['bytes'] / 1048576))
    # left-overs: the real size, as GitHub counts it (1 MB = 1,000,000 bytes); 100 MB or more stops the build
    print('  as a file: %.1f MB (%d bytes); %.1f MB of copies left out (each kept once, in the table)' % (size / 1e6, size, stats.get('shared', 0) / 1e6))
    if size >= 100e6:
        print('  STOP: the page is 100 MB or more as a file; GitHub will not take it')
        sys.exit(1)
    if size >= 95e6:
        print('  WARNING: the page is over 95 MB as a file (the limit is 100)')
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
