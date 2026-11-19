#!/usr/bin/env python3
"""talk-page.py: makes the story job's page for Chris, as one HTML file (Coven of the Moon Faire, November 19, 2026).

    python3 tools/talk-page.py      # writes docs/lore/story-sample.html and docs/lore/story-sample.md

It reads docs/lore/story-page.md (the story page) and game/talk/sample.js (the sample lines), runs the line checks in
tools/talk-check.py, and puts both on one page that reads on a phone. The page needs no internet. Tapping a line asks
the phone's own voice to read it, only to hear its length and rhythm.
"""
import html, importlib.util, re, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
spec = importlib.util.spec_from_file_location('talkcheck', ROOT / 'tools/talk-check.py')
tc = importlib.util.module_from_spec(spec); spec.loader.exec_module(tc)

STAGES = ['dusk', 'asked', 'home', 'fen', 'after']
STAGE_HELP = [('dusk', 'the game opens; the lamps have just flown'), ('asked', 'the Grey Hat has asked for his lamps'),
              ('home', 'Nettie has known Io, and the cottage has been seen'), ('fen', 'Bogmire is reached'),
              ('after', 'the great wraith is released')]
KINDS = {'hello': 'hello', 'stage': 'the night as it goes', 'pointer': 'points the way', 'call': 'called in passing',
         'story': 'story', 'coven': 'the coven'}
MOMENTS = {'opening': 'the opening', 'cottage': 'at the cottage', 'after-wraith': 'after the great wraith'}
SHORT = {'odile': 'Odile', 'tully': 'Tully', 'captain': 'The Grey Hat', 'nettie': 'Nettie', 'io': 'Io', 'kore': 'Kore',
         'europa': 'Europa', 'callisto': 'Callisto'}
GROUPS = [
    ('The opening', 'In the camp, the moment the game begins. The twelve lamps have just flown.',
     ['z1.callisto.01', 'z1.kore.01']),
    ('Odile, the lamp-seller', 'In the camp. The first guide. Her small story: a beginning, a turn and an end.',
     ['z1.odile.01', 'z1.odile.02', 'z1.odile.03', 'z1.odile.04']),
    ('Tully, the gate keeper', 'One ordinary person’s full six: a hello; early, middle and late; the line that '
     'points the way; and the call as the coven passes the gate.',
     ['z1.tully.01', 'z1.tully.02', 'z1.tully.03', 'z1.tully.04', 'z1.tully.05', 'z1.tully.06']),
    ('The Grey Hat', 'At the jetty. His first talk asks for the lamps. His last has a line of Europa’s in it.',
     ['z1.captain.01', 'z1.captain.02', 'z1.captain.03', 'z1.europa.01', 'z1.captain.04']),
    ('Nettie, the herb-seller', 'In Wickhollow. She has kept an eye on the cottage, and she knew both sisters.',
     ['z1.nettie.01', 'z1.nettie.02', 'z1.nettie.03', 'z1.nettie.04']),
    ('At the cottage', 'The first time the coven comes to Io’s cottage.', ['z1.io.01']),
    ('After the great wraith', 'In the fen, as the great wraith is released and a pale moth rises.',
     ['z1.io.02', 'z1.kore.02']),
]


# ---------- a small Markdown reader, for the story page's own few kinds of text ----------
def inline(t):
    t = html.escape(t, quote=False)
    t = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'`([^`]+)`', r'<code>\1</code>', t)
    return t


def md(text):
    out, para, items, kind, rows = [], [], [], None, []

    def flush():
        nonlocal para, items, kind, rows
        if para:
            out.append('<p>' + inline(' '.join(para)) + '</p>')
        if items:
            tag = 'ol' if kind == 'ol' else 'ul'
            out.append(f'<{tag}>' + ''.join('<li>' + inline(i) + '</li>' for i in items) + f'</{tag}>')
        if rows:
            head = [c.strip() for c in rows[0].strip('|').split('|')]
            body = [[c.strip() for c in r.strip('|').split('|')] for r in rows[2:]]
            h = '<thead><tr>' + ''.join('<th>' + inline(c) + '</th>' for c in head) + '</tr></thead>'
            b = ''.join('<tr>' + ''.join(f'<td data-label="{html.escape(head[k] or "")}">' + inline(c) + '</td>'
                                         for k, c in enumerate(r)) + '</tr>' for r in body)
            out.append('<div class="table"><table>' + h + '<tbody>' + b + '</tbody></table></div>')
        para, items, kind, rows = [], [], None, []

    for line in text.split('\n'):
        if not line.strip():
            flush(); continue
        m = re.match(r'^(#{1,3}) (.*)', line)
        if m:
            flush(); n = len(m.group(1)) + 1
            out.append(f'<h{n}>' + inline(m.group(2)) + f'</h{n}>'); continue
        if line.startswith('|'):
            if para or items:
                flush()
            rows.append(line); continue
        m = re.match(r'^(- |\d+\. )(.*)', line)
        if m:
            if para or rows:
                flush()
            kind = 'ol' if m.group(1)[0].isdigit() else 'ul'
            items.append(m.group(2)); continue
        if items and line.startswith('  '):
            items[-1] += ' ' + line.strip(); continue
        if items or rows:
            flush()
        para.append(line.strip())
    flush()
    return '\n'.join(out)


def section(text, start, stop=None):
    a = text.index(start)
    b = text.index(stop, a) if stop else len(text)
    return text[a:b]


# ---------- the sample ----------
def when_words(l):
    w, bits = l.get('when', {}), []
    if 'moment' in w:
        bits.append(MOMENTS.get(w['moment'], w['moment']))
    if 'stage' in w:
        a, b = w['stage']
        bits.append(STAGES[a] if a == b else (f'{STAGES[a]} or {STAGES[b]}' if b == a + 1 else f'{STAGES[a]} to {STAGES[b]}'))
    if 'lamps' in w:
        a, b = w['lamps']
        bits.append('all twelve lamps home' if a == 12 else ('no lamps home' if b == 0 else 'some lamps home'))
    if w.get('first') is True:
        bits.append('first talk')
    elif w.get('first') is False:
        bits.append('a later talk')
    if not bits:
        bits.append('any time')
    return bits


def card(l):
    cues = re.findall(r'\[([^\]]*)\]', l['say'])
    meta = ''.join(f'<span>{html.escape(b)}</span>' for b in when_words(l))
    meta += f'<span>{tc.seconds(l):.1f} s</span>'
    if l.get('talk'):
        meta += f'<span>talk line {l["talk"][1]}</span>'
    for r in l.get('rests', []):
        meta += f'<span class="rests">rests on call {r}</span>'
    cue = ('<p class="cue">Cue for the voice: ' + ', '.join(f'[{html.escape(c)}]' for c in cues) + '</p>') if cues else ''
    return (f'<div class="line" data-who="{l["who"]}">'
            f'<div class="who">{html.escape(SHORT[l["who"]])}<span class="kind">{KINDS[l["kind"]]}</span></div>'
            f'<p class="words" tabindex="0">{html.escape(l["text"])}</p>'
            f'<p class="tone">{html.escape(l["tone"])}</p>{cue}'
            f'<div class="meta">{meta}<span class="id">{l["id"]}</span></div></div>')


def sample_html(data):
    by = {l['id']: l for l in data['lines']}
    used = [i for _, _, ids in GROUPS for i in ids]
    assert sorted(used) == sorted(by), 'every sample line is shown once'
    parts = []
    for title, note, ids in GROUPS:
        parts.append(f'<div class="group"><h3>{html.escape(title)}</h3><p class="gnote">{html.escape(note)}</p>'
                     + ''.join(card(by[i]) for i in ids) + '</div>')
    voices = ''.join(f'<li><strong>{html.escape(v["name"])}.</strong> {html.escape(v["note"])} '
                     f'<em>To audition with:</em> “{html.escape(v["audition"])}”</li>'
                     for v in data['voices'].values())
    return '\n'.join(parts) + ('<details><summary>How each of these eight might sound</summary>'
                               '<p class="small">A first guess for casting, so you can hear the lines in your head. '
                               'Every voice is yours to change; the witches’ most of all. The full notes for every '
                               'speaker come in step 2.</p><ul class="voices">' + voices + '</ul></details>')


def sample_md(data):
    by = {l['id']: l for l in data['lines']}
    out = ['# The sample: 24 lines to hear the voice', '',
           '**Status: a proposal by the story job (Claude), November 19, 2026. Not approved.** Made by '
           '`tools/talk-page.py` from `game/talk/sample.js`; change the lines there, not here. The ids are provisional.',
           '']
    for title, note, ids in GROUPS:
        out += [f'## {title}', '', note, '']
        for i in ids:
            l = by[i]
            out.append(f'- **{SHORT[l["who"]]}** ({", ".join(when_words(l))}; {tc.seconds(l):.1f} s; `{i}`): '
                       f'“{l["text"]}” *{l["tone"]}*' + (f' Said as: `{l["say"]}`' if l['say'] != l['text'] else '')
                       + (''.join(f' Rests on call {r}.' for r in l.get('rests', []))))
        out.append('')
    out += ['## How each might sound (a first guess for casting)', '']
    out += [f'- **{v["name"]}.** {v["note"]} To audition with: “{v["audition"]}”' for v in data['voices'].values()]
    return '\n'.join(out) + '\n'


CSS = r"""
:root{--ink:#0d1524;--ink2:#14203a;--paper:#efe6d2;--dim:#b7ad98;--lamp:#e8a64b;--line:#2a3a5c}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:radial-gradient(120% 60% at 50% 0%,#1d2b49 0%,var(--ink) 60%) fixed,var(--ink);color:var(--paper);
 font:17px/1.55 "Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif}
main{max-width:700px;margin:0 auto;padding:22px 18px 70px}
.kicker{font:600 12px/1.3 system-ui,sans-serif;letter-spacing:.14em;text-transform:uppercase;color:var(--lamp);margin:8px 0 6px}
h1{font-size:32px;line-height:1.15;margin:0 0 12px;font-weight:600}
h2{font-size:24px;margin:46px 0 10px;padding-top:14px;border-top:1px solid var(--line);font-weight:600}
h3{font-size:19px;margin:28px 0 6px;color:var(--lamp);font-weight:600}
h4{font-size:17px;margin:22px 0 4px}
p,li{margin:0 0 12px}
ul,ol{padding-left:22px;margin:0 0 14px}
strong{color:#fff4dc}
code{font:14px/1 ui-monospace,Menlo,monospace;color:var(--dim)}
.status{background:var(--ink2);border-left:3px solid var(--lamp);padding:12px 14px;border-radius:6px;color:var(--dim);font-size:15px}
.ask{background:#1a2742;border:1px solid #33496f;border-radius:10px;padding:14px 16px;margin:18px 0}
.ask h2{border:0;margin:0 0 6px;padding:0;font-size:19px;color:var(--lamp)}
.ask ol{margin:0}.ask li{margin:0 0 8px}
.small,.gnote{font:14px/1.5 system-ui,sans-serif;color:var(--dim)}
.legend{font:14px/1.5 system-ui,sans-serif;color:var(--dim);background:var(--ink2);border-radius:8px;padding:10px 12px;margin:10px 0 4px}
.legend b{color:var(--paper);font-weight:600}
.group{margin:8px 0 0}
.line{background:linear-gradient(180deg,#172440,#121c33);border:1px solid var(--line);border-radius:12px;padding:12px 14px 10px;margin:10px 0;
 border-left:4px solid var(--c,var(--lamp))}
.who{font:700 13px/1.2 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--c,var(--lamp));display:flex;gap:8px;align-items:baseline}
.kind{font-weight:500;letter-spacing:.02em;text-transform:none;color:var(--dim)}
.words{font-size:21px;line-height:1.4;margin:6px 0 6px;color:#fff8ea;cursor:pointer;-webkit-tap-highlight-color:transparent}
.words.saying{color:var(--lamp)}
.tone{font-style:italic;color:var(--dim);font-size:15.5px;margin:0 0 6px}
.cue{font:13px/1.4 system-ui,sans-serif;color:var(--dim);margin:0 0 6px}
.meta{display:flex;flex-wrap:wrap;gap:6px;font:12.5px/1 system-ui,sans-serif;color:var(--dim)}
.meta span{background:#0f182b;border:1px solid var(--line);border-radius:20px;padding:5px 9px}
.meta .rests{border-color:#7a5a2c;color:#f0c27c}
.meta .id{border:0;background:none;padding:5px 2px;opacity:.7;font-family:ui-monospace,Menlo,monospace}
.line[data-who=odile],.line[data-who=tully]{--c:#e8a64b}
.line[data-who=captain]{--c:#c9c2b4}
.line[data-who=nettie]{--c:#a9c79a}
.line[data-who=io]{--c:#e07a86}
.line[data-who=kore]{--c:#c39cf0}
.line[data-who=europa]{--c:#78d0ea}
.line[data-who=callisto]{--c:#9fb8e8}
details{margin:18px 0;background:var(--ink2);border-radius:10px;padding:10px 14px}
summary{cursor:pointer;color:var(--lamp);font:600 15px/1.4 system-ui,sans-serif;padding:4px 0}
.voices li{font-size:15.5px}
.table{overflow-x:auto;margin:0 0 16px}
table{border-collapse:collapse;width:100%;font-size:15px}
th,td{text-align:left;vertical-align:top;padding:8px 8px;border-bottom:1px solid var(--line)}
th{font:600 12.5px/1.3 system-ui,sans-serif;letter-spacing:.06em;text-transform:uppercase;color:var(--dim)}
@media (max-width:620px){
 body{font-size:16.5px}
 h1{font-size:28px}
 thead{display:none}
 table,tbody,tr,td{display:block;width:100%}
 tr{background:var(--ink2);border-radius:10px;padding:8px 12px;margin:0 0 10px;border:1px solid var(--line)}
 td{border:0;padding:4px 0}
 td::before{content:attr(data-label);display:block;font:600 11.5px/1.4 system-ui,sans-serif;letter-spacing:.07em;text-transform:uppercase;color:var(--dim)}
 td[data-label=""]::before{display:none}
 td[data-label=""]{font:700 13px/1 system-ui,sans-serif;color:var(--lamp)}
}
.totals{font:14px/1.5 system-ui,sans-serif;color:var(--dim);margin:14px 0 0}
footer{margin-top:50px;padding-top:14px;border-top:1px solid var(--line);font:14px/1.55 system-ui,sans-serif;color:var(--dim)}
"""

JS = r"""
(function(){
  var S=window.speechSynthesis, now=null;
  function stop(){ if(now){ now.classList.remove('saying'); now=null; } }
  function say(el){
    if(!S){ return; }
    if(now===el){ S.cancel(); stop(); return; }
    S.cancel(); stop();
    var u=new SpeechSynthesisUtterance(el.textContent); u.rate=0.95; u.lang='en-GB';
    u.onend=u.onerror=function(){ if(now===el) stop(); };
    now=el; el.classList.add('saying'); S.speak(u);
  }
  document.querySelectorAll('.words').forEach(function(el){
    el.addEventListener('click',function(){ say(el); });
    el.addEventListener('keydown',function(e){ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); say(el); } });
  });
  if(!S){ var n=document.getElementById('tapnote'); if(n) n.textContent='(This browser cannot read aloud, so tapping does nothing here.)'; }
})();
"""


def main():
    story = (ROOT / 'docs/lore/story-page.md').read_text()
    data = tc.load(ROOT / 'game/talk/sample.js')
    errors, notes, said = tc.check(data)
    if errors:
        print('\n'.join(errors)); sys.exit('the sample has problems: fix them first (python3 tools/talk-check.py)')
    per = tc.summary(data)
    words = sum(p['words'] for p in per.values()); secs = sum(p['secs'] for p in per.values())
    longest = max(len(tc.words(l['text'])) for l in data['lines'])

    status = re.search(r'\*\*Status:.*?(?=\n\n)', story, re.S).group(0)
    ten = section(story, '## The story in ten lines', '### What I changed')
    rest = section(story, '### What I changed')
    legend = ('<div class="legend"><b>The five stages of zone 1:</b> ' + '; '.join(
        f'<b>{a}</b>, {b}' for a, b in STAGE_HELP) + '. <br><b>Tap the words</b> to hear your phone read them '
        '<span id="tapnote">(its own plain voice, only to hear how long a line is and how it falls. The real voices '
        'come from ElevenLabs.)</span></div>')
    page = f"""<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>The story, and how it sounds: Coven of the Moon Faire</title>
<style>{CSS}</style></head>
<body><main>
<p class="kicker">Coven of the Moon Faire · the story job · step 1</p>
<h1>The story, and how it sounds</h1>
<p class="status">{inline(status.strip('*').replace('**', ''))}</p>
<div class="ask"><h2>What I need from you</h2><ol>
<li><strong>The story in ten lines.</strong> Yes, or mark it up.</li>
<li><strong>The voice of the 24 lines.</strong> Is this how these people talk? Change any word.</li>
<li><strong>Your eleven calls</strong>, further down, each with my pick. “Yes to all” is fine, and so is a
change to any one. The names, and how they are said, matter most: every one is recorded.</li>
</ol><p class="small" style="margin:8px 0 0">I stop here until you answer. Then I write all 236 lines of zone 1.</p></div>
{md(ten)}
<h2>Hear the voice: {len(data['lines'])} lines</h2>
<p>The lamp-seller, the gate keeper, the Grey Hat and Nettie, with a line or two from each witch. Under each line: how to
say it, when it can be said, and about how long it takes.</p>
{legend}
{sample_html(data)}
<p class="totals">{len(data['lines'])} lines, {words} words, about {secs / 60:.1f} minutes of speech. The longest line is
{longest} words; the average is {words / len(data['lines']):.0f}. Names said aloud: {', '.join(sorted(said))}.</p>
{md(rest)}
<footer>
<p><strong>What was checked.</strong> Every line: no more than 24 words, no dashes, semicolons or trailing dots, no
numbers in digits, none of the banned words or a spell’s name, no name that is not approved, and the words to say
match the words shown (<code>tools/talk-check.py</code>: all good). Every “you” was read to be sure it means
the four, or a witch named in the same line.</p>
<p><strong>Not checked.</strong> How the lines sound in real voices: nobody here can hear them. The seconds are worked out
from the words, so they are a guess. How ElevenLabs reads the cues was looked up in its own guides (Eleven v4 takes
cues in square brackets, placed just before the words they change); it has not been tried.</p>
<p>Made by <code>tools/talk-page.py</code> from <code>docs/lore/story-page.md</code> and
<code>game/talk/sample.js</code>, on the branch <code>job/story</code>.</p>
</footer>
</main>
<script>{JS}</script>
</body></html>
"""
    (ROOT / 'docs/lore/story-sample.html').write_text(page)
    (ROOT / 'docs/lore/story-sample.md').write_text(sample_md(data))
    print(f'wrote docs/lore/story-sample.html ({len(page) // 1024} KB) and docs/lore/story-sample.md')


if __name__ == '__main__':
    main()
