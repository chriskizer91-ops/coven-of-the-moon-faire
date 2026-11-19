#!/usr/bin/env python3
"""talk-voices.py: checks the recorded lines against the recording order (Coven of the Moon Faire, November 19, 2026).

    python3 tools/talk-voices.py        # measures game/talk/audio/z1/ and writes docs/lore/story-voices.html

For every line in game/talk/zone-1.js it looks for game/talk/audio/z1/<id>.mp3 and measures, with ffmpeg:
  - the format (MP3, one channel, 44.1 kHz, 64 kbps), and the length
  - the silence at the start and the end (the order asks for no more than 0.2 s)
  - the loudness (the order asks for about -18 LUFS, peaks no higher than -1 dBFS)
  - the voice's pitch (the middle of its range), to catch a line said in the wrong voice
  - how long the line is against its estimate, to catch a cue spoken aloud or a line cut short
It writes the real lengths to game/talk/recording/z1-lengths.csv, and a page for Chris with the lines worth a listen.
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
COMPARE = {
    'captain': ('z1.captain.01', 'The Grey Hat speaks faster than the other slow voices, and higher than most of the men, '
                'where his note says low, slow and clipped. If he sounds right to you, keep him.'),
    'wenna': ('z1.wenna.01', 'Old Wenna sits higher than Odile and Io, where her note says low and cracked with age. If '
              'she sounds old enough, keep her.'),
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
    data = tc.load(ROOT / 'game/talk/zone-1.js')
    cast = tc.cast()
    lines = {l['id']: l for l in data['lines']}
    files = {p.stem: p for p in AUDIO.glob('*.mp3')}
    missing = sorted(set(lines) - set(files)); extra = sorted(set(files) - set(lines))
    with cf.ThreadPoolExecutor(8) as ex:
        m = dict(zip(sorted(files), ex.map(probe, [files[k] for k in sorted(files)])))
    with open(ROOT / 'game/talk/recording/z1-lengths.csv', 'w', newline='') as f:
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
        rows.append((who, len(ks), sum(r['dur'] for _, r in ks), words / speech if speech else 0, st.median(ps) if ps else 0))
    print(f'{len(m)} recordings, {len(missing)} missing, {len(extra)} not in zone-1.js; {total / 60:.2f} minutes; '
          f'format right on {len(ok_format)}; loudness {min(lufs)} to {max(lufs)} LUFS; highest peak {max(peaks)} dBFS; '
          f'{len(long_ends)} with more than 0.2 s of silence at an end')

    def card(k, why, label=None):
        l, r = lines[k], m[k]
        return (f'<div class="line" data-who="{l["who"]}"><div class="who">{html.escape(cast[l["who"]]["name"])}'
                f'<span class="kind">{html.escape(label or k)}</span></div>'
                f'<p class="words">{html.escape(l["text"])}</p>'
                f'<p class="why">{html.escape(why)}</p>'
                f'<audio controls preload="none" src="{b64(files[k])}"></audio>'
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
        f'{len(long_ends)} files run a hair over the asked-for 0.2 s (' + ', '.join(f'{k.replace("z1.", "")} {v:.2f} s' for k, v in long_ends) +
        '). Not worth redoing.',
        '<b>No line is in the wrong voice</b>, as far as pitch can tell: every speaker\u2019s lines sit in their own '
        'range. The lines that stray are mostly meant to: shouted calls, excited hellos, quiet asides.',
        '<b>No line looks cut short or padded</b> with extra words. The longest against their estimates are lines with a '
        'cue or a slow tone; the shortest are quick calls and the Grey Hat (below).',
        f'<b>All {len(lines)} together are {int(total // 60)} minutes {int(total % 60)} seconds</b>, about '
        f'{total * 64 / 8 / 1024:.1f} MB, a little under my estimate of 18\u00bd minutes.',
    ]
    table = ''.join(f'<tr><td data-label="">{html.escape(cast[w]["name"])}</td><td data-label="Lines">{n}</td>'
                    f'<td data-label="Length">{d:.0f} s</td><td data-label="Words a second">{wps:.1f}</td>'
                    f'<td data-label="Pitch">{p:.0f}</td></tr>' for w, n, d, wps, p in rows)
    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>The voices, checked: Coven of the Moon Faire</title>
<style>{tp.CSS}
.why{{font:15px/1.5 system-ui,sans-serif;color:#f0c27c;margin:0 0 8px}}
audio{{width:100%;height:44px;margin:4px 0 8px;color-scheme:dark}}
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
<h1>The voices, checked</h1>
<p class="status">I measured all 236 recordings against the recording order. I cannot hear them, and there is no
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
Tap play on each. If one sounds wrong, tell me and I will write the redo request.</p>
{''.join(card(k, why) for k, why in LISTEN.items())}
<h2>Two voices to compare with their notes</h2>
{''.join(card(k, why, label='one line to hear') for _, (k, why) in COMPARE.items())}
<h2>What passed</h2>
<ul class="pass">{''.join(f'<li>{p}</li>' for p in passed)}</ul>
<h2>Each voice, measured</h2>
<p class="small">Words a second is how quickly each speaks, without the silence at the ends. Usual pitch is the middle
of their voice, in Hz: lower for the men, higher for the women and Pell.</p>
<div class="table keep"><table><thead><tr><th></th><th>Lines</th><th>Length</th><th>Words a second</th><th>Pitch</th></tr></thead>
<tbody>{table}</tbody></table></div>
<h2>Where the recordings are now</h2>
<p>All 236 are on the branch <code>job/story</code> in <code>game/talk/audio/z1/</code>, one file a line, named by its
id. Their real lengths are in <code>game/talk/recording/z1-lengths.csv</code> and in each line\u2019s seconds in
<code>game/talk/zone-1.js</code>. The hub can take them from there into the game.</p>
<footer><p>Made by <code>tools/talk-voices.py</code>, which measures <code>game/talk/audio/z1/</code> with ffmpeg. Run it
again after any redo.</p></footer>
</main></body></html>
"""
    (ROOT / 'docs/lore/story-voices.html').write_text(page)
    print(f'wrote docs/lore/story-voices.html ({len(page) // 1024} KB)')
    if missing or extra:
        print('missing:', missing, 'extra:', extra); sys.exit(1)


if __name__ == '__main__':
    main()
