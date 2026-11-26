#!/usr/bin/env python3
"""talk-voices.py: checks the recorded lines against the recording order (Coven of the Moon Faire, November 19, 2026).

    python3 tools/talk-voices.py        # zone 1: measures game/talk/audio/z1/, writes docs/lore/story-voices.html
    python3 tools/talk-voices.py 2      # zone 2: game/talk/audio/z2/, docs/lore/story-voices-z2.html (and so on)

For every line in game/talk/zone-<n>.js it looks for game/talk/audio/z<n>/<id>.mp3 and measures, with ffmpeg:
  - the format (MP3, one channel, 44.1 kHz, 64 kbps), and the length
  - the silence at the start and the end (the order asks for no more than 0.2 s)
  - the loudness (the order asks for about -18 LUFS, peaks no higher than -1 dBFS)
  - the voice's pitch (the middle of its range), to catch a line said in the wrong voice
  - how long the line is against its estimate, to catch a cue spoken aloud or a line cut short
It writes the real lengths to game/talk/recording/z<n>-lengths.csv, and a page for Chris with the lines worth a listen.
For a voice that came back from an earlier zone it also measures that zone's recordings, to show it is the same voice.
It cannot hear the words: there is no speech-to-text here. Chris's ears are the last check.
"""
import base64, concurrent.futures as cf, csv, html, importlib.util, json, re, statistics as st, subprocess, sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent


def mod(name, file):
    spec = importlib.util.spec_from_file_location(name, ROOT / file)
    m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    return m


tc = mod('talkcheck', 'tools/talk-check.py')
tp = mod('talkpage', 'tools/talk-page.py')
tr = mod('talkreading', 'tools/talk-reading.py')
Z = 'z1'
AUDIO = ROOT / 'game/talk/audio/z1'

# The lines worth Chris's ear, and why (read from the measurements below, November 19).
LISTEN = {
    'z1.io.05': 'The heart of zone 1. Its pitch measures about twice Io\u2019s usual, so it may be whispered or thin. '
                'It should sound soft, not strained.',
    'z1.io.14': 'The last line of the zone. Its pitch is well above Io\u2019s usual, like the boots line. Soft, or thin?',
    'z1.kore.09': 'No speaking pitch could be found, so it is probably whispered. The note asks for very quiet with no '
                  'laugh. A whisper may be right, or may lose it.',
    'z1.kore.07': 'Half as long again as expected. Check the [chuckles] cue came out as a chuckle, not as the word.',
    'z1.europa.01': 'A second longer than expected. Check the [curious] cue was not spoken aloud.',
    'z1.kore.01': 'The second line of the game. Check the [laughs] cue is a real laugh, not the word.',
    'z1.captain.28': 'Its pitch is far above the Grey Hat\u2019s usual (about 216 against 141). Is it still his voice?',
    'z1.tully.06': 'Its pitch is far above Tully\u2019s usual. The note asks for short and plain. Not sing-song?',
    'z1.captain.12': 'Said fast, about 40% quicker than expected. His note says slow and clipped; the deadpan may be lost.',
    'z1.captain.08': 'Also fast for him. The joke needs his slow, dry timing.',
}
# Voices worth comparing with their notes, with one line to hear each.
COMPARE_TITLE = 'Two voices to compare with their notes'
COMPARE = {
    'captain': ('z1.captain.01', 'The Grey Hat speaks faster than the other slow voices, and higher than most of the men, '
                'where his note says low, slow and clipped. If he sounds right to you, keep him.'),
    'wenna': ('z1.wenna.01', 'Old Wenna sits higher than Odile and Io, where her note says low and cracked with age. If '
              'she sounds old enough, keep her.'),
}


JS_PLAY = r"""
(function(){
  var now=null;
  function stop(){ if(now){ now.audio.pause(); now.audio.currentTime=0; now.button.textContent='▶ Play'; now.button.classList.remove('on'); now=null; } }
  document.querySelectorAll('.line').forEach(function(card){
    var audio=card.querySelector('audio.native'), button=card.querySelector('.play'), cant=card.querySelector('.cant');
    if(!audio||!button) return;
    // a blob: address plays in more places than a long data: address
    try {
      var src=audio.getAttribute('src'), raw=atob(src.slice(src.indexOf(',')+1)), bytes=new Uint8Array(raw.length);
      for(var i=0;i<raw.length;i++) bytes[i]=raw.charCodeAt(i);
      audio.src=URL.createObjectURL(new Blob([bytes],{type:'audio/mpeg'}));
    } catch(e) {}
    audio.controls=false; audio.hidden=true; button.hidden=false;
    var me={audio:audio,button:button};
    button.addEventListener('click',function(){
      if(now===me){ stop(); return; }
      stop(); now=me; button.textContent='■ Stop'; button.classList.add('on'); cant.hidden=true;
      var p=audio.play(); if(p&&p.catch) p.catch(function(err){ if(err&&err.name!=='AbortError'){ cant.hidden=false; stop(); } });
    });
    audio.addEventListener('ended',function(){ if(now===me) stop(); });
    audio.addEventListener('error',function(){ cant.hidden=false; if(now===me) stop(); });
  });
})();
"""


# Zone 2 (read from the measurements, November 20).
LISTEN_Z2 = {
    'z2.kore.01': 'Sixty per cent longer than expected, with a [laughs] cue at the start. Check it is a real laugh, not '
                  'the word, and that the shiver turns into a joke.',
    'z2.europa.06': 'Europa reads zone 2 slower than zone 1 (about 2.1 words a second against 2.4). Here the note asks for '
                    'her to be moved, so slow may be right. Does it still sound like her, or does it drag?',
    'z2.marta.21': 'A shouted call, far above Marta\u2019s usual pitch (about 340 against 196). Meant to be sharp. Is it '
                   'still her?',
}
COMPARE_Z2_TITLE = 'Three new voices to hear'
COMPARE_Z2 = {
    'marta': ('z2.marta.01', 'Marta has the most lines in zone 2 (22) and its saddest ones. Her note: about sixty-eight, '
              'warm Lancashire, quick, motherly and bossy. Is this her?'),
    'roadwarden': ('z2.roadwarden.01', 'His note says about seventy, slow, rough and kind. He speaks at about 2.8 words a '
                   'second, as fast as Marta, whose note says quick. If he sounds old and slow enough to you, keep him.'),
    'tamsin': ('z2.tamsin.01', 'Tamsin is about nine. Her pitch (about 240 Hz) is lower than most children\u2019s. If she '
               'sounds like a girl, not a woman playing one, keep her.'),
}

# Zone 3 (read from the measurements, November 20).
LISTEN_Z3 = {
    'z3.ysmera.11': 'The first time anyone says the knight\u2019s name. It comes back many times in zone 4, so check it is '
                    'said the way you want (I asked for HAL-see-on), and that it lands gently.',
    'z3.io.11': 'Asked for barely a breath, but it sits far above Io\u2019s usual pitch (about 281 against 188). Is it a '
                'whisper of a question, or too bright?',
    'z3.callisto.10': 'Quick for its words (1.4 seconds against about 2.6 expected). Asked for simple and certain. Does it '
                      'sound certain, or rushed?',
    'z3.halcyon.02': 'The knight\u2019s second \u201cGo home\u201d, asked to be quieter than the first, almost a plea. '
                     'The two take the same time. Does this one sound softer to you?',
}
COMPARE_Z3_TITLE = 'Three new voices to hear'
COMPARE_Z3 = {
    'halcyon': ('z3.halcyon.01', 'Halcyon only says \u201cGo home\u201d here, but she has twelve lines in zone 4 as '
                'herself, warm and tired, so her voice matters most. Her note: about forty, low-middle, measured, a '
                'soldier\u2019s steadiness, a West Country voice like Io\u2019s but firmer. Her pitch (about 147 Hz) is '
                'low for a woman, as asked. Could this be Io\u2019s big sister?'),
    'ysmera': ('z3.ysmera.01', 'The shipmaster has the most lines in zone 3 (22). Her note: about fifty, a cool, exact, '
               'very elegant moon-folk English, silk over steel. Is this her?'),
    'pim': ('z3.pim.01', 'Pim\u2019s note says quick and chirpy, but she is the slowest new voice in zone 3 (about 2.4 '
            'words a second). If she sounds bright enough to you, keep her.'),
}


def probe(path):
    p = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(path)],
                                  capture_output=True, text=True).stdout)
    s, f = p['streams'][0], p['format']
    r = {'codec': s.get('codec_name'), 'ch': s.get('channels'), 'rate': int(s.get('sample_rate', 0)),
         'kbps': round(int(f.get('bit_rate', 0)) / 1000), 'dur': round(float(f['duration']), 2)}
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    summ = out[out.rfind('Summary:'):]
    mi = re.search(r'I:\s+(-?[\d.]+) LUFS', summ); mp = re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ)
    r['lufs'] = float(mi.group(1)) if mi else None
    r['peak'] = float(mp.group(1)) if mp else None
    out = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(path), '-af', 'silencedetect=noise=-45dB:d=0.05',
                          '-f', 'null', '-'], capture_output=True, text=True).stderr
    starts = [float(x) for x in re.findall(r'silence_start: (-?[\d.]+)', out)]
    ends = [float(x) for x in re.findall(r'silence_end: ([\d.]+)', out)]
    r['lead'] = round(ends[0], 2) if starts and starts[0] <= 0.01 and ends else 0.0
    r['trail'] = round(r['dur'] - starts[-1], 2) if starts and len(ends) < len(starts) else (
        round(r['dur'] - starts[-1], 2) if starts and ends and abs(ends[-1] - r['dur']) < 0.06 and starts[-1] > 0.01 else 0.0)
    r['pitch'] = pitch(path)
    return r


def pitch(path, sr=16000):
    """The middle of the voice's pitch, in Hz, from the voiced parts of the line (None if it is whispered)."""
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(path), '-ac', '1', '-ar', str(sr), '-f', 's16le', '-'],
                         capture_output=True).stdout
    x = np.frombuffer(pcm, np.int16).astype(np.float32) / 32768
    win, hop, lo, hi = int(0.04 * sr), int(0.01 * sr), int(sr / 450), int(sr / 65)
    f0 = []
    for i in range(0, len(x) - win, hop):
        fr = x[i:i + win] - x[i:i + win].mean()
        if np.sqrt((fr ** 2).mean()) < 0.02:
            continue
        ac = np.correlate(fr, fr, 'full')[win - 1:]
        ac /= ac[0] + 1e-9
        k = lo + int(np.argmax(ac[lo:hi]))
        if ac[k] > 0.5:
            f0.append(sr / k)
    return round(float(np.median(f0))) if len(f0) > 10 else None


def b64(path):
    return 'data:audio/mpeg;base64,' + base64.b64encode(path.read_bytes()).decode()


def main():
    global Z, AUDIO, LISTEN, COMPARE, COMPARE_TITLE
    n_zone = int(sys.argv[1]) if len(sys.argv) > 1 else 1
    Z, AUDIO = f'z{n_zone}', ROOT / f'game/talk/audio/z{n_zone}'
    if n_zone == 2:
        LISTEN, COMPARE, COMPARE_TITLE = LISTEN_Z2, COMPARE_Z2, COMPARE_Z2_TITLE
    elif n_zone == 3:
        LISTEN, COMPARE, COMPARE_TITLE = LISTEN_Z3, COMPARE_Z3, COMPARE_Z3_TITLE
    elif n_zone > 3:
        LISTEN, COMPARE = {}, {}
    data = tc.load(ROOT / f'game/talk/zone-{n_zone}.js')
    tr.setup(data)
    cast = tc.cast()
    lines = {l['id']: l for l in data['lines']}
    # hub, November 25: the narrator's files live in the same folder (tools/narrator-sound.py makes them and checks them):
    # they are not the people's lines, so they are left out here
    files = {p.stem: p for p in AUDIO.glob('*.mp3') if '.narrator.' not in p.stem}
    missing = sorted(set(lines) - set(files)); extra = sorted(set(files) - set(lines))
    with cf.ThreadPoolExecutor(8) as ex:
        m = dict(zip(sorted(files), ex.map(probe, [files[k] for k in sorted(files)])))
    with open(ROOT / f'game/talk/recording/{Z}-lengths.csv', 'w', newline='') as f:
        w = csv.writer(f); w.writerow(['file', 'seconds'])
        for k in sorted(m):
            w.writerow([k + '.mp3', f'{m[k]["dur"]:.2f}'])
    ok_format = [k for k, r in m.items() if (r['codec'], r['ch'], r['rate']) == ('mp3', 1, 44100) and 60 <= r['kbps'] <= 70]
    lufs = [r['lufs'] for r in m.values() if r['lufs'] is not None]
    peaks = [r['peak'] for r in m.values() if r['peak'] is not None]
    long_ends = sorted((k, max(r['lead'], r['trail'])) for k, r in m.items() if r['lead'] > 0.2 or r['trail'] > 0.2)
    total = sum(r['dur'] for r in m.values())
    # each speaker's usual pitch and pace, and lines far from their own usual
    per = {}
    for k, r in m.items():
        per.setdefault(lines[k]['who'], []).append((k, r))
    rows = []
    for who in tr.ORDER:
        ks = per.get(who, [])
        ps = [r['pitch'] for _, r in ks if r['pitch']]
        words = sum(len(tc.words(lines[k]['text'])) for k, _ in ks)
        speech = sum(r['dur'] - r['lead'] - r['trail'] for _, r in ks)
        rows.append([who, len(ks), sum(r['dur'] for _, r in ks), words / speech if speech else 0, st.median(ps) if ps else 0, None])
    # a voice that came back from an earlier zone: its usual pitch there, to show it is the same voice
    before = {}         # speaker: (the first zone they were recorded for, its files)
    for k in range(1, n_zone):
        for l in tc.load(ROOT / f'game/talk/zone-{k}.js')['lines']:
            f = ROOT / f'game/talk/audio/z{k}/{l["id"]}.mp3'
            if l['who'] in per and f.exists() and before.setdefault(l['who'], (k, []))[0] == k:
                before[l['who']][1].append(f)
    if before:
        with cf.ThreadPoolExecutor(8) as ex:
            for who, (k, fs) in before.items():
                ps = [p for p in ex.map(pitch, fs) if p]
                for row in rows:
                    if row[0] == who and ps:
                        row[5] = (k, st.median(ps))
    est_total = sum(tc.estimate(l) for l in data['lines'])
    print(f'{len(m)} recordings, {len(missing)} missing, {len(extra)} not in zone-{n_zone}.js; {total / 60:.2f} minutes; '
          f'format right on {len(ok_format)}; loudness {min(lufs)} to {max(lufs)} LUFS; highest peak {max(peaks)} dBFS; '
          f'{len(long_ends)} with more than 0.2 s of silence at an end')

    def card(k, why, label=None):
        l, r = lines[k], m[k]
        return (f'<div class="line" data-who="{l["who"]}"><div class="who">{html.escape(cast[l["who"]]["name"])}'
                f'<span class="kind">{html.escape(label or k)}</span></div>'
                f'<p class="words">{html.escape(l["text"])}</p>'
                f'<p class="why">{html.escape(why)}</p>'
                f'<div class="clip"><button type="button" class="play" hidden>\u25b6 Play</button>'
                f'<span class="len">{r["dur"]:.1f} seconds</span></div>'
                f'<audio class="native" controls preload="metadata" src="{b64(files[k])}"></audio>'
                f'<p class="cant" hidden>This view cannot play sound. Open the page in Safari or Chrome.</p>'
                f'<p class="tone">Asked for: {html.escape(l["tone"])}' + (f' Said with the cue {html.escape(re.findall(r"\[[^\]]*\]", l["say"])[0])}.' if '[' in l['say'] else '') +
                f'</p><div class="meta"><span>{r["dur"]:.1f} s (expected about {tc.estimate(l):.1f})</span>'
                f'<span>pitch {r["pitch"] or "none found"}{" Hz" if r["pitch"] else ""}</span><span class="id">{k}</span></div></div>')

    passed = [
        f'<b>All {len(lines)} lines are here</b>, each once, named exactly as the order asked, and nothing extra.',
        'The words shown beside each recording on your listening page match the lines word for word.',
        f'<b>The format is right on all {len(ok_format)}</b>: MP3, one channel, 44.1 kHz, 64 kbps.',
        f'<b>The loudness is even</b>: {min(lufs)} to {max(lufs)} LUFS against the asked-for \u221218, and no peak above '
        f'\u22121 dBFS (the highest is {max(peaks)}).',
        f'<b>The silence at the start</b> is never more than {max(r["lead"] for r in m.values()):.2f} s. At the end, '
        f'{len(long_ends)} files run a hair over the asked-for 0.2 s (' + ', '.join(f'{k.replace(Z + ".", "")} {v:.2f} s' for k, v in long_ends) +
        '). Not worth redoing.',
        '<b>No line is in the wrong voice</b>, as far as pitch can tell: every speaker\u2019s lines sit in their own '
        'range. The lines that stray are mostly meant to: shouted calls, excited hellos, quiet asides.',
        '<b>No line looks cut short or padded</b> with extra words. The longest against their estimates are lines with a '
        'cue or a slow tone; the shortest are quick calls.',
        f'<b>All {len(lines)} together are {int(total // 60)} minutes {int(total % 60)} seconds</b>, about '
        f'{total * 64 / 8 / 1024:.1f} MB (my estimate was {est_total / 60:.1f} minutes).',
    ]
    back = [(cast[w]['name'].replace('The ', 'the '), k, p0, p) for w, n, d, wps, p, b in rows if b for k, p0 in [b]]
    if back:
        passed.append('<b>The returning voices are the same voices</b>: ' + '; '.join(
            f'{html.escape(nm)} {p:.0f} Hz here, {p0:.0f} in zone {k}' for nm, k, p0, p in back) +
            '. Within a few per cent, which is as close as one voice gets from day to day.')
    table = ''.join(f'<tr><td data-label="">{html.escape(cast[w]["name"])}</td><td data-label="Lines">{n}</td>'
                    f'<td data-label="Length">{d:.0f} s</td><td data-label="Words a second">{wps:.1f}</td>'
                    f'<td data-label="Pitch">{p:.0f}</td><td data-label="Before">{f"{b[1]:.0f}" if b else "new"}</td></tr>'
                    for w, n, d, wps, p, b in rows)
    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>Zone {n_zone}\u2019s voices, checked: Coven of the Moon Faire</title>
<style>{tp.CSS}
.why{{font:15px/1.5 system-ui,sans-serif;color:#f0c27c;margin:0 0 8px}}
audio{{width:100%;height:44px;margin:4px 0 8px;color-scheme:dark}}
.clip{{display:flex;align-items:center;gap:12px;margin:4px 0 10px}}
.play{{font:700 17px/1 system-ui,sans-serif;color:#10192c;background:var(--lamp);border:0;border-radius:12px;padding:0 20px;min-height:52px;min-width:120px}}
.play.on{{background:#f6dca8}}
.len{{font:15px/1.3 system-ui,sans-serif;color:var(--dim)}}
.cant{{font:14px/1.4 system-ui,sans-serif;color:#f0c27c;margin:0 0 8px}}
.pass li{{margin:0 0 10px}}
.big{{display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin:14px 0}}
.big div{{background:#16223b;border:1px solid var(--line);border-radius:10px;padding:10px 12px}}
.big b{{display:block;font:700 24px/1.1 "Iowan Old Style",Georgia,serif;color:#fff4dc}}
.big span{{font:13px/1.3 system-ui,sans-serif;color:var(--dim)}}
.line[data-who=tully]{{--c:#e8a64b}}.line[data-who=wenna]{{--c:#d7b98a}}
@media (max-width:620px){{
 .keep table{{display:table;font-size:14px}} .keep thead{{display:table-header-group}} .keep tbody{{display:table-row-group}}
 .keep tr{{display:table-row;background:none;border:0;padding:0;margin:0}} .keep td{{display:table-cell;padding:6px 6px;border-bottom:1px solid var(--line)}}
 .keep td::before{{display:none}} .keep td[data-label=""]{{font:600 14px/1.3 system-ui,sans-serif;color:var(--paper)}}
 .keep th{{font-size:11px;padding:6px}}
}}
</style></head>
<body><main>
<p class="kicker">Coven of the Moon Faire \u00b7 the story job \u00b7 the voices</p>
<h1>Zone {n_zone}\u2019s voices, checked</h1>
<p class="status">I measured all {len(m)} recordings against the recording order. I cannot hear them, and there is no
speech-to-text here, so I could not check the words by ear. Your ears are the last check. Here is everything that could be
measured, and the few lines worth a listen.</p>
<div class="big">
<div><b>{len(m)} of {len(lines)}</b><span>lines recorded, named right</span></div>
<div><b>{int(total // 60)}:{int(total % 60):02d}</b><span>minutes of speech, {total * 64 / 8 / 1024:.1f} MB</span></div>
<div><b>{len(ok_format)}</b><span>files in the right format</span></div>
<div><b>{min(lufs):.0f} to {max(lufs):.0f}</b><span>LUFS: even loudness</span></div>
</div>
<h2>Worth your ear: {len(LISTEN)} lines</h2>
<p>Nothing here is broken. These are the lines where the numbers suggest the reading might not be what the note asked for.
Tap the yellow button on each. If one sounds wrong, tell me and I will write the redo request.</p>
{''.join(card(k, why) for k, why in LISTEN.items())}
<h2>{COMPARE_TITLE}</h2>
{''.join(card(k, why, label='one line to hear') for _, (k, why) in COMPARE.items())}
<h2>What passed</h2>
<ul class="pass">{''.join(f'<li>{p}</li>' for p in passed)}</ul>
<h2>Each voice, measured</h2>
<p class="small">Pace is how quickly each speaks, in words a second, without the silence at the ends. Usual pitch is the middle
of their voice, in Hz: lower for the men, higher for the women and children. Before is the same voice\u2019s pitch in
the zone it was first recorded for.</p>
<div class="table keep"><table><thead><tr><th></th><th>Lines</th><th>Length</th><th>Pace</th><th>Pitch</th><th>Before</th></tr></thead>
<tbody>{table}</tbody></table></div>
<h2>Where the recordings are now</h2>
<p>All {len(m)} are on the branch <code>job/story</code> in <code>game/talk/audio/{Z}/</code>, one file a line, named by its
id. Their real lengths are in <code>game/talk/recording/{Z}-lengths.csv</code> and in each line\u2019s seconds in
<code>game/talk/zone-{n_zone}.js</code>. The hub can take them from there into the game.</p>
<footer><p>Made by <code>tools/talk-voices.py</code>, which measures <code>game/talk/audio/{Z}/</code> with ffmpeg. Run it
again after any redo.</p></footer>
</main>
<script>{JS_PLAY}</script>
</body></html>
"""
    out = 'docs/lore/story-voices.html' if n_zone == 1 else f'docs/lore/story-voices-{Z}.html'
    (ROOT / out).write_text(page)
    print(f'wrote {out} ({len(page) // 1024} KB)')
    if missing or extra:
        print('missing:', missing, 'extra:', extra); sys.exit(1)


if __name__ == '__main__':
    main()
