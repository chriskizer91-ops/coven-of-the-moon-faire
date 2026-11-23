#!/usr/bin/env python3
"""narration-order.py: the recording order for the narrator's lines, made from game/people/narration.js.
    python3 tools/narration-order.py
Writes game/people/recording/narration-recording-order.txt (to hand over whole) and .csv (to check against).
It is in the same form as the story job's recording orders (game/talk/recording/), so it can go to the same place."""
import os, re, json, csv
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(root, 'game/people/narration.js'), encoding='utf8').read()
def field(block, name):
    m = re.search(name + r": '((?:[^'\\]|\\.)*)'", block); return m.group(1).replace("\\'", "'") if m else ''
voice = src[src.index('voice: {'):src.index('z1: [')]
zones = {}
for z in ('z1', 'z2', 'z3'):
    start = src.index(z + ': ['); end = src.index('\n  ],', start)
    zones[z] = [dict(id=field(b, 'id'), at=field(b, 'at'), secs=float(re.search(r'secs: ([\d.]+)', b).group(1)), text=field(b, 'text'), say=field(b, 'say'), tone=field(b, 'tone')) for b in re.findall(r"\{ id: '[^']+'.*?\},", src[start:end], re.S)]
n = sum(len(v) for v in zones.values()); secs = sum(l['secs'] for v in zones.values() for l in v)
NAMES = {'z1': 'ZONE 1: Wickhollow, the Thornwood and Bogmire', 'z2': 'ZONE 2: the Warm Roads and Dawnroost', 'z3': 'ZONE 3: the northern wilds and the shipyard'}
out = []; P = out.append
P('COVEN OF THE MOON FAIRE'); P('VOICE RECORDING ORDER: THE NARRATOR, ZONES 1 TO 3'); P('Made November 23, 2026. %d lines, 1 speaker, about %.1f minutes of speech.' % (n, secs / 60)); P('')
P('WHAT THIS IS')
P('These are new lines for the same small fantasy video game as the earlier recording orders (zones 1, 2 and 3). They are all said by one new speaker: the narrator. The narrator sets the scene at certain points: where the four witches are, what has just happened, what is in front of them. Each line below is recorded as its own sound file. The game finds a line\'s sound by its file name, so the names must be exact.'); P('')
P('HOW TO MAKE THE FILES')
for i, t in enumerate([
    'Use the same ElevenLabs model, the same settings and the same way of working as for the earlier recording orders of this game.',
    'One voice for the narrator, for all %d lines in all three zones. Choose it from the voice note below, test it with the audition line (do not save the audition as a file), then keep that one voice and its settings throughout. It must not be a voice already used for a person in the game.' % n,
    'Say exactly the words after "Say:". Do not add, drop or change a word.',
    'Words in [square brackets] are delivery cues, not words to speak. If a cue is spoken aloud by mistake, make the line again without the cue.',
    '"Tone:" says how the line should sound. It is never spoken. If a line comes out in the wrong tone, make it again; you may put a short cue from the tone note in square brackets at its start, such as [quietly] or [warmly].',
    'The narrator is calm throughout: a storyteller by a fire. Never dramatic, never a film-trailer voice, never hurried. If a line comes out theatrical, make it again plainer.',
    'One sound file for each line, named by its file name exactly, for example z1.narrator.03.mp3 (lower case, with the dots as shown).',
    'MP3, one channel (mono), 44.1 kHz, 64 kbps, as for the earlier orders. If a file comes out with two channels, mix it down to one.',
    'Silence: no more than a fifth of a second (0.2 s) at the start and at the end of each file. Trim any longer silence.',
    'Loudness: the same for every file, and the same as the earlier orders: about -18 LUFS (integrated), with peaks no higher than -1 dBFS.',
    'Packing: three zips, one for each zone, named z1-narrator.zip, z2-narrator.zip and z3-narrator.zip. Inside each: that zone\'s sound files, and a list named like z1-narrator-list.csv with two columns, file and seconds: each file\'s name and its real length.',
    'Check before handing back: %d files in 3 zips (%s), every file name below present once, and nothing else.' % (n, ', '.join('%d in %s-narrator.zip' % (len(zones[z]), z) for z in zones)),
], 1): P('%2d. %s' % (i, t))
P(''); P('HOW TO SAY THE NAMES')
P('Say them as in the earlier orders. If a name comes out wrong, write it in the International Phonetic Alphabet between slashes in the text.')
for a, b, c in [('Io', 'EYE-oh', '/ˈaɪ.oʊ/'), ('Wickhollow', 'WICK-hollow', '/ˈwɪkhɒloʊ/'), ('Bogmire', 'BOG-mire', '/ˈbɒɡmaɪər/'), ('Thornwood', 'THORN-wood', '/ˈθɔːnwʊd/'), ('Faire', 'the same as "fair"', '/fɛər/'), ('Dawnroost', 'DAWN-roost', '/ˈdɔːnruːst/'), ('Eldergrove', 'ELDER-grove', '/ˈɛldərɡroʊv/'), ('Ember', 'EM-ber', '/ˈɛmbər/')]: P('  %-11s %-22s %s' % (a, b, c))
P(''); P('=' * 78); P('SPEAKER: narrator   The narrator'); P('ZIPS: z1-narrator.zip, z2-narrator.zip, z3-narrator.zip   (%d lines, about %.0f seconds)' % (n, secs))
P('VOICE: ' + field(voice, 'note')); P('IF THAT DOES NOT SUIT: ' + field(voice, 'other')); P('AUDITION LINE (to choose the voice, not a file): ' + field(voice, 'audition'))
rows = []
for z, ls in zones.items():
    P('-' * 78); P('%s   ZIP: %s-narrator.zip   (%d lines, about %.0f seconds)' % (NAMES[z], z, len(ls), sum(l['secs'] for l in ls))); P('-' * 78)
    for l in ls:
        P(l['id'] + '.mp3'); P('  Say:  ' + l['say']); P('  Tone: ' + l['tone']); P('')
        rows.append([l['id'] + '.mp3', z + '-narrator.zip', 'narrator', 'The narrator', l['say'], l['text'], l['tone'], l['secs'], l['at']])
os.makedirs(os.path.join(root, 'game/people/recording'), exist_ok=True)
open(os.path.join(root, 'game/people/recording/narration-recording-order.txt'), 'w', encoding='utf8').write('\n'.join(out) + '\n')
with open(os.path.join(root, 'game/people/recording/narration-recording-order.csv'), 'w', encoding='utf8', newline='') as f:
    w = csv.writer(f); w.writerow(['file', 'zip', 'speaker', 'speaker_name', 'say', 'words_shown', 'tone', 'seconds_about', 'said_at']); w.writerows(rows)
words = [len(l['text'].split()) for v in zones.values() for l in v]
print('%d lines (%s), about %.1f minutes; the longest is %d words' % (n, ', '.join('%s %d' % (z, len(v)) for z, v in zones.items()), secs / 60, max(words)))
