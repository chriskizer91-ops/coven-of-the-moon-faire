#!/usr/bin/env python3
"""talk-reading.py: makes a zone's reading page and its recording order (Coven of the Moon Faire, November 19, 2026).

    python3 tools/talk-reading.py        # zone 1
    python3 tools/talk-reading.py 2      # zone 2 (and so on)

Reads game/talk/zone-<n>.js and game/talk/cast.js, runs tools/talk-check.py's checks, and writes:
  docs/lore/story-zone-<n>.html                 the reading page: every line by person and by stage, with seconds and
                                                totals, and the recording order (one HTML file, no internet needed)
  game/talk/recording/z<n>-recording-order.txt  the recording order, to hand over whole (plain text)
  game/talk/recording/z<n>-recording-order.csv  the same, one row a line, to check against
"""
import csv, html, importlib.util, io, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def mod(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT / file)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


tc = mod('talkcheck', 'tools/talk-check.py')
tp = mod('talkpage', 'tools/talk-page.py')

ORDER = ['io', 'kore', 'europa', 'callisto', 'odile', 'tully', 'bashir', 'zofia', 'linnet', 'otto', 'corwin', 'ros',
         'kofi', 'bridie', 'jory', 'captain', 'quill', 'nettie', 'gretch', 'hilde', 'wenna', 'tobb', 'pell']
PLACES = [('The coven', ['io', 'kore', 'europa', 'callisto']),
          ('The Moon Faire’s camp', ['odile', 'tully', 'bashir', 'zofia', 'linnet', 'otto', 'corwin', 'ros', 'kofi']),
          ('On the roads', ['bridie', 'jory']),
          ('The jetty', ['captain', 'quill']),
          ('Wickhollow', ['nettie', 'gretch', 'hilde']),
          ('Bogmire', ['wenna', 'tobb', 'pell'])]
STAGE_NAMES = ['dusk', 'asked', 'home', 'fen', 'after']
STAGE_HELP = dict(tp.STAGE_HELP)
MOMENTS = {'opening': 'the opening', 'cottage': 'at the cottage', 'thornwood': 'at the Thornwood’s edge',
           'fen': 'the first sight of the fen', 'before-wraith': 'before the great wraith',
           'after-wraith': 'after the great wraith', 'leaving': 'the leaving'}
SAY_NAMES = [('Io', 'EYE-oh', '/ˈaɪ.oʊ/'), ('Kore', 'KOR-ee', '/ˈkɔːri/'),
             ('Europa', 'yoo-ROH-pah', '/jʊˈroʊpə/'), ('Callisto', 'kah-LISS-toh', '/kəˈlɪstoʊ/'),
             ('Odile', 'oh-DEEL', '/oʊˈdiːl/'), ('Nettie', 'NET-ee', '/ˈnɛti/'),
             ('Wenna', 'WEN-ah', '/ˈwɛnə/'), ('Hilde', 'HIL-duh', '/ˈhɪldə/'),
             ('Pell', 'PELL', '/pɛl/'), ('Quill', 'KWILL', '/kwɪl/'),
             ('Bogmire', 'BOG-mire', '/ˈbɒɡmaɪər/'), ('Wickhollow', 'WICK-hollow', '/ˈwɪkhɒloʊ/'),
             ('Thornwood', 'THORN-wood', '/ˈθɔːnwʊd/'), ('Faire', 'the same as "fair"', '/fɛər/')]


Z, N, TITLE, ZONE1_TITLE = 'z1', 1, '', 'Wickhollow, the Thornwood and Bogmire'
SAY_NAMES += [('Marta', 'MAR-tuh', '/\u02c8m\u0251\u02d0t\u0259/'), ('Brann', 'BRAN', '/br\u00e6n/'),
              ('Tamsin', 'TAM-zin', '/\u02c8t\u00e6mz\u026an/'), ('Dawnroost', 'DAWN-roost', '/\u02c8d\u0254\u02d0nru\u02d0st/'),
              ('Halcyon', 'HAL-see-on', '/\u02c8h\u00e6lsi\u0259n/'), ('Ysmera', 'iz-MEER-ah', '/\u026az\u02c8m\u026a\u0259r\u0259/'),
              ('Brightkeel', 'BRITE-keel', '/\u02c8bra\u026atki\u02d0l/'), ('Gil', 'GILL, with a hard g', '/\u0261\u026al/'),
              ('Tock', 'TOCK', '/t\u0252k/'), ('Pim', 'PIM', '/p\u026am/'),
              ('Eldergrove', 'EL-der-grove', '/\u02c8\u025bld\u0259r\u0261ro\u028av/'), ('Misthollow', 'MIST-hollow', '/\u02c8m\u026asth\u0252lo\u028a/'),
              ('Moonwell', 'MOON-well', '/\u02c8mu\u02d0nw\u025bl/'), ('Sorrel', 'SORR-ul', '/\u02c8s\u0252r\u0259l/'),
              ('Ede', 'EED', '/i\u02d0d/'), ('Bashir', 'bah-SHEER', '/b\u0259\u02c8\u0283\u026a\u0259r/'),
              ('Zofia', 'ZOF-yah', '/\u02c8z\u0252fj\u0259/'), ('Tully', 'TULL-ee', '/\u02c8t\u028cli/'),
              ('Linnet', 'LIN-it', '/\u02c8l\u026an\u026at/')]


def setup(data):
    """Sets this zone's own speakers, places, stages and moments (zone 1's are the defaults above)."""
    global Z, N, TITLE, ORDER, PLACES, STAGE_NAMES, STAGE_HELP, MOMENTS
    Z = data['zone']; N = int(Z[1:]); TITLE = data.get('title', ZONE1_TITLE)
    if 'places' in data:
        PLACES = [(a, b) for a, b in data['places']]
        ORDER = [w for _, ws in PLACES for w in ws]
    STAGE_NAMES = data['stages']
    if 'stageHelp' in data:
        STAGE_HELP = dict(zip(STAGE_NAMES, data['stageHelp']))
    if 'momentNames' in data:
        MOMENTS = data['momentNames']


def when_words(l):
    w, bits = l.get('when', {}), []
    if 'moment' in w:
        bits.append(MOMENTS.get(w['moment'], w['moment']))
    if 'stage' in w:
        a, b = w['stage']
        bits.append(STAGE_NAMES[a] if a == b else (f'{STAGE_NAMES[a]} or {STAGE_NAMES[b]}' if b == a + 1 else f'{STAGE_NAMES[a]} to {STAGE_NAMES[b]}'))
    if 'lamps' in w:
        a, b = w['lamps']
        bits.append('all twelve lamps home' if a == 12 else ('no lamps home' if b == 0 else ('not all lamps home' if a == 0 else 'some lamps home')))
    if 'met' in w:
        bits.append('after talking to ' + tc.cast()[w['met']]['name'].replace('The ', 'the '))
    if w.get('just') == 'won':
        bits.append('just won a fight')
    if w.get('just') == 'lost':
        bits.append('just lost a fight')
    if w.get('look') == 'green':
        bits.append('the four look green')
    if w.get('look') == 'steady':
        bits.append('the four look steady')
    if w.get('first') is True:
        bits.append('first talk')
    elif w.get('first') is False:
        bits.append('a later talk')
    if l['kind'] == 'call':
        bits.append('as the coven passes')
    if not bits:
        bits.append('any time')
    return bits


def short(who):
    c = tc.cast()[who]
    return c['name']


def card(l, show_who=True):
    cues = re.findall(r'\[([^\]]*)\]', l['say'])
    meta = ''.join(f'<span>{html.escape(b)}</span>' for b in when_words(l))
    meta += f'<span>{l["secs"]:.1f} s</span>'
    if l.get('talk'):
        meta += f'<span>{html.escape(l["talk"][0].replace(Z + ".", ""))}, line {l["talk"][1]}</span>'
    if l.get('to'):
        meta += f'<span class="to">points to {html.escape(short(l["to"]))}</span>'
    for r in l.get('rests', []):
        meta += f'<span class="rests">call {r}</span>'
    cue = ('<p class="cue">Cue: ' + ', '.join(f'[{html.escape(c)}]' for c in cues) + '</p>') if cues else ''
    kind = tp.KINDS.get(l['kind'], l['kind'])
    who = (f'<div class="who">{html.escape(short(l["who"]))}<span class="kind">{kind}</span></div>' if show_who
           else f'<div class="who"><span class="kind" style="margin:0">{kind}</span></div>')
    return (f'<div class="line" data-who="{l["who"]}">{who}'
            f'<p class="words" tabindex="0">{html.escape(l["text"])}</p>'
            f'<p class="tone">{html.escape(l["tone"])}</p>{cue}'
            f'<div class="meta">{meta}<span class="id">{l["id"]}</span></div></div>')


def voice_text(c):
    v = c['voice']
    return (f'{v["sex"].capitalize()}, {v["age"]}. From: {v["from"]}. Pitch: {v["pitch"]}. Pace: {v["pace"]}. '
            f'Texture: {v["texture"]}.')


def by_person(data, cast):
    per = {}
    for l in data['lines']:
        per.setdefault(l['who'], []).append(l)
    out = []
    for place, whos in PLACES:
        out.append(f'<h3 class="place">{html.escape(place)}</h3>')
        for who in whos:
            ls, c = per[who], cast[who]
            secs = sum(l['secs'] for l in ls); words = sum(len(tc.words(l['text'])) for l in ls)
            inv = ''.join(f'<li>{html.escape(x)}</li>' for x in c['invented']) or '<li>Nothing new.</li>'
            note = f'<p class="small">{html.escape(c["note"])}</p>' if c.get('note') else ''
            out.append(
                f'<details class="person" data-who="{who}"><summary><span class="pname">{html.escape(c["name"])}</span>'
                f'<span class="ptrade">{html.escape(c["trade"])}</span>'
                f'<span class="pnums">{len(ls)} lines · {secs:.0f} s</span></summary>'
                f'<div class="pinfo"><p class="small"><b>Where:</b> {html.escape(c["where"])}. {words} words, about '
                f'{secs / 60:.1f} minutes.</p>{note}'
                f'<p class="small"><b>Voice:</b> {html.escape(voice_text(c))} <em>To audition with:</em> '
                f'“{html.escape(c["voice"]["audition"])}”</p>'
                f'<p class="small"><b>What the lines make up about this person’s life:</b></p><ul class="small">{inv}</ul></div>'
                + ''.join(card(l, show_who=(l['who'] != who)) for l in ls) + '</details>')
    return '\n'.join(out)


def by_stage(data):
    out = []
    lines = data['lines']
    for st in range(5):
        here = [l for l in lines if (l['when'].get('moment') and data['moments'][l['when']['moment']] == st)
                or ('stage' in l['when'] and tc.allows(l['when'], st) and 'moment' not in l['when'])]
        secs = sum(l['secs'] for l in here)
        out.append(f'<details class="stage"><summary><span class="pname">{st}. {STAGE_NAMES[st]}</span>'
                   f'<span class="ptrade">{html.escape(STAGE_HELP[STAGE_NAMES[st]])}</span>'
                   f'<span class="pnums">{len(here)} lines · {secs:.0f} s</span></summary>')
        coven = [l for l in here if 'moment' in l['when']]     # set moments: every speaker, in the order spoken
        if coven:
            moments = []
            for l in coven:
                if l['when']['moment'] not in moments:
                    moments.append(l['when']['moment'])
            for m in moments:
                who_m = {l['who'] for l in coven if l['when']['moment'] == m}
                label = 'The coven' if who_m <= tc.WITCHES else 'A set moment'
                out.append(f'<h4>{label}, {html.escape(MOMENTS[m])}</h4>' + ''.join(card(l) for l in coven if l['when']['moment'] == m))
        for who in ORDER:
            ls = [l for l in here if l['who'] == who and 'moment' not in l['when']]
            if ls:
                out.append(f'<h4>{html.escape(short(who))}</h4>' + ''.join(card(l) for l in ls))
        out.append('</details>')
    rest = [l for l in lines if 'stage' not in l['when'] and 'moment' not in l['when']]
    secs = sum(l['secs'] for l in rest)
    out.append(f'<details class="stage"><summary><span class="pname">Any stage</span>'
               f'<span class="ptrade">first hellos, calls, and lines that wait for something else (lamps, a fight, who '
               f'has been talked to)</span><span class="pnums">{len(rest)} lines · {secs:.0f} s</span></summary>')
    for who in ORDER:
        ls = [l for l in rest if l['who'] == who]
        if ls:
            out.append(f'<h4>{html.escape(short(who))}</h4>' + ''.join(card(l) for l in ls))
    out.append('</details>')
    return '\n'.join(out)


def recording(data, cast):
    returning = {}      # speakers recorded for an earlier zone: their first zone
    for k in range(1, N):
        f = ROOT / f'game/talk/zone-{k}.js'
        if f.exists():
            for l in tc.load(f)['lines']:
                returning.setdefault(l['who'], f'z{k}')
    per = {}
    for l in data['lines']:
        per.setdefault(l['who'], []).append(l)
    total = sum(l['secs'] for l in data['lines'])
    t = io.StringIO()
    w = t.write
    w(f'COVEN OF THE MOON FAIRE\nVOICE RECORDING ORDER: ZONE {N} ({TITLE.upper()})\n')
    w(f'Made November 19, 2026. {len(data["lines"])} lines, {len(per)} speakers, about {total / 60:.1f} minutes of speech.\n\n')
    w('WHAT THIS IS\n')
    w(f'These are the spoken lines for part {N} ("zone {N}") of a small fantasy video game. Every person in the game '
      'speaks aloud. Each line below is recorded as its own sound file, in the voice of the person who says it. The game '
      'finds each sound by its file name, so the names must be exactly as written here. The lines are British English.\n\n')
    w('HOW TO MAKE THE FILES\n')
    rules = [
        'Model: ElevenLabs Eleven v4 (model id eleven_v4).',
        'One voice for each speaker. Choose it from the voice note under the speaker’s name, test it with the\n'
        '   audition line (do not save the audition as a file), then use that same voice, with the same settings, for\n'
        '   every one of that speaker’s lines.',
        'Say exactly the words after "Say:". Do not add, drop or change a word.',
        'Words in [square brackets] are delivery cues (Eleven v4 audio tags), not words to speak. If a cue is spoken\n'
        '   aloud by mistake, make the line again without the cue.',
        '"Tone:" says how the line should sound. It is never spoken. If a line comes out in the wrong tone, make it\n'
        '   again; you may put a short cue from the tone note in square brackets at its start, such as [dryly] or\n'
        '   [gently].',
        f'One sound file for each line, named by its file name exactly, for example {data["lines"][0]["id"]}.mp3 (lower case, with\n'
        '   the dots as shown).',
        'MP3, one channel (mono), 44.1 kHz, 64 kbps (ElevenLabs output format mp3_44100_64). If a file comes out with\n'
        '   two channels, mix it down to one.',
        'Silence: no more than a fifth of a second (0.2 s) of silence at the start and at the end of each file.\n'
        '   Trim any longer silence.',
        'Loudness: the same for every file and every speaker. Normalise each file to about -18 LUFS (integrated),\n'
        '   with peaks no higher than -1 dBFS.',
        f'Packing: one zip for each speaker, named as shown under the speaker (for example {Z}-{ORDER[0]}.zip). Inside it:\n'
        f'   that speaker’s sound files, and a list named like {Z}-{ORDER[0]}-list.csv with two columns, file and seconds:\n'
        '   each file’s name and its length in seconds, to one decimal place.',
        f'Check before handing back: {len(data["lines"])} files in {len(per)} zips, every file name below present once,\n'
        '   and nothing else.',
    ]
    if returning:
        rules.insert(1, 'Returning voices: ' + ', '.join(cast[w]['name'].replace('The ', 'the ') for w in ORDER if w in returning) + ' were recorded for an '
                     'earlier zone. Use the very same voice and settings as before, so each sounds like the same person.')
    for k, r in enumerate(rules, 1):
        w(f'{k:2}. ' + re.sub(r'\n\s+', ' ', r) + '\n')
    w('\nHOW TO SAY THE NAMES\n')
    w('If a name comes out wrong, Eleven v4 reads the International Phonetic Alphabet written between slashes in the '
      'text, for example /ˈaɪ.oʊ/ for Io.\n')
    alltext = ' '.join(l['text'] for l in data['lines'])
    for n, s, ipa in SAY_NAMES:
        if re.search(r'\b' + n + r'\b', alltext):
            w(f'  {n:11} {s:22} {ipa}\n')
    w('\n')
    for who in ORDER:
        ls, c = per[who], cast[who]
        secs = sum(l['secs'] for l in ls)
        w('=' * 78 + '\n')
        w(f'SPEAKER: {who}   {c["name"]}, {c["trade"]}\n')
        w(f'ZIP: {Z}-{who}.zip   ({len(ls)} lines, about {secs:.0f} seconds)\n')
        if who in returning:
            w(f'VOICE: RETURNING. Use the same voice as before ({returning[who]}-{who}.zip). For reference: {voice_text(c)}\n')
        else:
            w(f'VOICE: NEW. {voice_text(c)}\n')
            w(f'AUDITION LINE (to choose the voice, not a file): {c["voice"]["audition"]}\n')
        w('-' * 78 + '\n')
        for l in sorted(ls, key=lambda l: l['id']):
            w(f'{l["id"]}.mp3\n  Say:  {l["say"]}\n  Tone: {l["tone"]}\n\n')
    w('=' * 78 + f'\nEND OF ZONE {N}\n')
    rows = io.StringIO()
    cw = csv.writer(rows)
    cw.writerow(['file', 'zip', 'speaker', 'speaker_name', 'say', 'words_shown', 'tone', 'seconds_about'])
    for who in ORDER:
        for l in sorted(per[who], key=lambda l: l['id']):
            cw.writerow([l['id'] + '.mp3', f'{Z}-{who}.zip', who, cast[who]['name'], l['say'], l['text'], l['tone'], f'{l["secs"]:.1f}'])
    return t.getvalue(), rows.getvalue()


CSS_MORE = r"""
.tabs{position:sticky;top:0;z-index:5;display:flex;gap:6px;padding:10px 0;margin:10px 0 6px;background:var(--ink);box-shadow:0 8px 10px -6px rgba(0,0,0,.6)}
.tabs button{flex:1;font:600 15px/1 system-ui,sans-serif;color:var(--paper);background:#16223b;border:1px solid var(--line);border-radius:10px;padding:13px 6px;min-height:46px}
.tabs button[aria-selected=true]{background:#2a3c63;border-color:#4a6496;color:#fff}
.view{display:none}.view.on{display:block}
h3.place{margin:28px 0 8px}
details.person,details.stage{background:#111b30;border:1px solid var(--line);border-radius:12px;margin:10px 0;padding:0 12px}
details.person>summary,details.stage>summary{list-style:none;cursor:pointer;padding:13px 0;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px}
details>summary::-webkit-details-marker{display:none}
.pname{font:700 18px/1.2 "Iowan Old Style",Georgia,serif;color:#fff4dc}
.ptrade{font:14px/1.3 system-ui,sans-serif;color:var(--dim);flex:1}
.pnums{font:13px/1 system-ui,sans-serif;color:var(--lamp)}
.pinfo{border-top:1px solid var(--line);padding-top:10px}
.pinfo ul{margin-top:-6px}
h4{font:700 13px/1.2 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--lamp);margin:18px 0 4px}
.line{padding:10px 12px 8px}
.words{font-size:19px}
.meta .to{border-color:#3d6a4a;color:#a9d7b4}
.big{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:14px 0}
.big div{background:#16223b;border:1px solid var(--line);border-radius:10px;padding:10px 12px}
.big b{display:block;font:700 24px/1.1 "Iowan Old Style",Georgia,serif;color:#fff4dc}
.big span{font:13px/1.3 system-ui,sans-serif;color:var(--dim)}
pre.order{white-space:pre-wrap;word-break:break-word;font:12.5px/1.45 ui-monospace,Menlo,monospace;background:#0b1220;border:1px solid var(--line);border-radius:10px;padding:12px;max-height:70vh;overflow:auto;color:#d9d2c0}
.copy{font:600 15px/1 system-ui,sans-serif;color:#10192c;background:var(--lamp);border:0;border-radius:10px;padding:13px 18px;min-height:46px;margin:6px 0 10px}
.line[data-who=bashir],.line[data-who=zofia],.line[data-who=linnet],.line[data-who=otto],.line[data-who=corwin],.line[data-who=ros],.line[data-who=kofi],.line[data-who=bridie],.line[data-who=jory]{--c:#e8a64b}
.line[data-who=quill],.line[data-who=gretch],.line[data-who=hilde]{--c:#a9c79a}
.line[data-who=wenna],.line[data-who=tobb],.line[data-who=pell]{--c:#d7b98a}
"""

JS_MORE = r"""
(function(){
  var tabs=document.querySelectorAll('.tabs button');
  tabs.forEach(function(b){ b.addEventListener('click',function(){
    tabs.forEach(function(x){ x.setAttribute('aria-selected', x===b ? 'true':'false'); });
    document.querySelectorAll('.view').forEach(function(v){ v.classList.toggle('on', v.id===b.dataset.view); });
  }); });
  var c=document.getElementById('copyorder');
  if(c) c.addEventListener('click',function(){
    var t=document.getElementById('ordertext').textContent;
    function done(){ c.textContent='Copied'; setTimeout(function(){ c.textContent='Copy the whole order'; },2000); }
    if(navigator.clipboard&&navigator.clipboard.writeText){ navigator.clipboard.writeText(t).then(done,function(){}); }
  });
})();
"""


def main():
    n_zone = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    data = tc.load(ROOT / f'game/talk/zone-{n_zone}.js')
    setup(data)
    cast = tc.cast()
    errors, notes, said = tc.check_lines(data)
    e2, n2, talks = tc.check_zone(data, tc.TARGETS[Z])
    if errors or e2:
        print('\n'.join(errors + e2)); sys.exit('the lines have problems: fix them first (python3 tools/talk-check.py)')
    for l in data['lines']:
        if 'secs' not in l:
            sys.exit(f'run python3 tools/talk-check.py game/talk/zone-{N}.js --fill first, so every line has its seconds')
    speakers = len({l['who'] for l in data['lines']})
    recorded = all(l['id'] in tc.recorded() for l in data['lines'])
    n = len(data['lines']); words = sum(len(tc.words(l['text'])) for l in data['lines'])
    secs = sum(l['secs'] for l in data['lines'])
    mb = secs * 64 / 8 / 1024
    order_txt, order_csv = recording(data, cast)
    rec = ROOT / 'game/talk/recording'
    rec.mkdir(exist_ok=True)
    (rec / f'{Z}-recording-order.txt').write_text(order_txt)
    (rec / f'{Z}-recording-order.csv').write_text(order_csv)
    if N == 1:
        status = ('Written from the story page you approved on November 19. Your 24 sample lines are here word for word. '
                  'The rest are mine, for you to read. Change any word before it is recorded.')
    else:
        status = ('Written from the outline for zones 2 to 4 that you approved on November 19, with its calls 12 to 18. '
                  'Change any word before it is recorded.')
    table_word = 'the brief’s table' if N == 1 else 'the outline'
    sample_note = ' All 24 approved sample lines are here.' if N == 1 else ''
    secs_note = ('The seconds are the recordings\u2019 real lengths, checked in <code>docs/lore/story-voices' + ('' if N == 1 else f'-{Z}') + '.html</code>.'
                 if recorded else 'The seconds are worked out from the words (about 2.8 a second), so they are a guess '
                 'until the recordings come back with their real lengths.')

    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Zone {N}, every spoken line: Coven of the Moon Faire</title>
<style>{tp.CSS}{CSS_MORE}</style></head>
<body><main>
<p class="kicker">Coven of the Moon Faire · the story job · zone {N}, {html.escape(TITLE)}</p>
<h1>Zone {N}: every spoken line</h1>
<p class="status">{status}</p>
<div class="big">
<div><b>{n}</b><span>lines, as {table_word} has them</span></div>
<div><b>{speakers}</b><span>speakers, each with a voice note</span></div>
<div><b>{secs / 60:.1f} min</b><span>of speech, {'as recorded' if recorded else 'estimated'} ({words:,} words, about {round(words / n)} a line)</span></div>
<div><b>{mb:.1f} MB</b><span>as MP3 at 64 kbps (about {mb * 4 / 3:.1f} MB inside the one-file game)</span></div>
</div>
<div class="ask"><h2>What to do with it</h2><ol>
<li><strong>Read the lines</strong>, by person or by stage. Tap any line to hear your phone read it.</li>
<li><strong>Mark up anything</strong>: a word, a line, a voice. Each person also shows what their lines make up about
their own life.</li>
<li><strong>When you are happy, hand the recording order to ChatGPT</strong>: the file
<code>{Z}-recording-order.txt</code> (sent with this page, and in the third tab). It says how to name, cut, level and
zip every file, so it stands on its own.</li>
</ol></div>
<div class="tabs" role="tablist">
<button role="tab" aria-selected="true" data-view="v-person">By person</button>
<button role="tab" aria-selected="false" data-view="v-stage">By stage</button>
<button role="tab" aria-selected="false" data-view="v-order">Recording order</button>
</div>
<section class="view on" id="v-person">
<p class="small">Tap a person to open their lines. Under each line: how to say it, when it can be said, and about how
long it takes. A green tag says who a line points the coven to.</p>
{by_person(data, cast)}
</section>
<section class="view" id="v-stage">
<div class="legend"><b>The five stages:</b> {'; '.join(f'<b>{a}</b>, {b}' for a, b in STAGE_HELP.items())}.
A line that can be said at more than one stage is shown under each of them.</div>
{by_stage(data)}
</section>
<section class="view" id="v-order">
<p>The whole order, as it goes to ChatGPT. It is also sent as a plain text file and as a spreadsheet file
(<code>{Z}-recording-order.csv</code>, one row a line) to check the zips against.</p>
<button class="copy" id="copyorder">Copy the whole order</button>
<pre class="order" id="ordertext">{html.escape(order_txt)}</pre>
</section>
<footer>
<p><strong>What was checked</strong> (<code>tools/talk-check.py</code>: all good). Every person has the brief’s count of
lines. No line is over 24 words (the longest is {max(len(tc.words(l['text'])) for l in data['lines'])}). No dashes,
semicolons, trailing dots, numbers in digits, banned words or spell names. Only approved names are said, and the chestnut
roaster’s never is. Every person has something to say at every stage after the first talk, and every ordinary
person points the coven to one of the people with many lines by a place. Every story talk is in order, six lines at most,
two of them a witch’s at most. Every id is used once.{sample_note}</p>
<p><strong>Not checked:</strong> how the lines sound in real voices. {secs_note}</p>
<p>Made by <code>tools/talk-reading.py</code> from <code>game/talk/zone-{N}.js</code> and <code>game/talk/cast.js</code>,
on the branch <code>job/story</code>.</p>
</footer>
</main>
<script>{tp.JS}{JS_MORE}</script>
</body></html>
"""
    (ROOT / f'docs/lore/story-zone-{N}.html').write_text(page)
    print(f'wrote docs/lore/story-zone-{N}.html ({len(page) // 1024} KB), game/talk/recording/{Z}-recording-order.txt '
          f'({len(order_txt) // 1024} KB) and .csv ({len(order_csv) // 1024} KB)')
    print(f'{n} lines, {words} words, {secs / 60:.1f} minutes, about {mb:.1f} MB at 64 kbps')


if __name__ == '__main__':
    main()
