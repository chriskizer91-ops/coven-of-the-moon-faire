#!/usr/bin/env python3
"""narration-order-z4.py: the recording order for the narrator's zone 4 lines, made from game/people/narration.js.
    python3 tools/narration-order-z4.py
Writes game/people/recording/narration-recording-order-z4.txt (to hand over whole) and .csv (to check against).
The same form as tools/narration-order.py makes for zones 1 to 3, as a list of its own, so those files stay exactly as
they were handed over. The narrator is one voice, already chosen: this order asks for that same voice."""
import os, re, csv, datetime
root = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
src = open(os.path.join(root, 'game/people/narration.js'), encoding='utf8').read()
def field(block, name):
    m = re.search(name + r": '((?:[^'\\]|\\.)*)'", block); return m.group(1).replace("\\'", "'") if m else ''
voice = src[src.index('voice: {'):src.index('z1: [')]
start = src.index('z4: ['); end = src.index('\n  ],', start)
lines = [dict(id=field(b, 'id'), at=field(b, 'at'), secs=float(re.search(r'secs: ([\d.]+)', b).group(1)), text=field(b, 'text'), say=field(b, 'say'), tone=field(b, 'tone')) for b in re.findall(r"\{ id: '[^']+'.*?\},", src[start:end], re.S)]
n = len(lines); secs = sum(l['secs'] for l in lines)
WHEN = {'flight': 'on the flight in', 'landing': 'the ship has just set down', 'frozen-road': 'at the great bramble', 'misthollow': 'the first sight of Misthollow', 'stair': 'the first sight of Halcyon on the Moonwell stair',
        'before-fire': 'the letter has been given', 'between': 'between the fire\'s two forms', 'after-fire': 'the fire has just ended', 'moonset': 'the moon sets', 'homecoming': 'on the flight home', 'faire': 'at the Faire\'s camp, the ending',
        'shore': 'coming to Frostmere\'s shore', 'pass': 'coming to the frozen pass', 'bramble-gone': 'the bramble has given way', 'down': 'after the moon has set', 'leaving': 'the leaving for the Faire',
        'woke': 'after a lost fight', 'not-ready': 'at the last fight, too soon'}
out = []; P = out.append
P('COVEN OF THE MOON FAIRE'); P('VOICE RECORDING ORDER: THE NARRATOR, ZONE 4 (THE NORTHEAST PEAKS, AND THE ENDING)'); P('Made %s. %d lines, 1 speaker, about %.1f minutes of speech.' % (datetime.date(2026, 11, 24).strftime('%B %d, %Y').replace(' 0', ' '), n, secs / 60)); P('')
P('WHAT THIS IS')
P('These are the narrator\'s lines for part 4 ("zone 4") of the same small fantasy video game as the earlier recording orders, and for its ending. They are all said by one speaker, the narrator, who was recorded before for zones 1, 2 and 3. The narrator sets the scene at certain points: where the four witches are, what has just happened, what is in front of them. Each line below is recorded as its own sound file. The game finds a line\'s sound by its file name, so the names must be exact. The lines are British English.'); P('')
P('HOW TO MAKE THE FILES')
for i, t in enumerate([
    'Use the same ElevenLabs model, the same settings and the same way of working as for the narrator\'s earlier recording order (zones 1 to 3).',
    'RETURNING VOICE: the narrator was recorded for zones 1 to 3 (z1-narrator.zip, z2-narrator.zip, z3-narrator.zip). Use the very same voice and settings as before, for all %d lines, so she sounds like the same person. The voice note below is for reference only.' % n,
    'Say exactly the words after "Say:". Do not add, drop or change a word.',
    'Words in [square brackets] are delivery cues, not words to speak. If a cue is spoken aloud by mistake, make the line again without the cue.',
    '"Tone:" says how the line should sound. It is never spoken. If a line comes out in the wrong tone, make it again; you may put a short cue from the tone note in square brackets at its start, such as [quietly] or [warmly].',
    'The narrator is calm throughout: a storyteller by a fire. Never dramatic, never a film-trailer voice, never hurried. If a line comes out theatrical, make it again plainer. This matters most in zone 4, where the story ends: the quieter the better.',
    'One sound file for each line, named by its file name exactly, for example z4.narrator.03.mp3 (lower case, with the dots as shown).',
    'MP3, one channel (mono), 44.1 kHz, 64 kbps, as for the earlier orders. If a file comes out with two channels, mix it down to one.',
    'Silence: no more than a fifth of a second (0.2 s) at the start and at the end of each file. Trim any longer silence.',
    'Loudness: the same for every file, and the same as the earlier orders: about -18 LUFS (integrated), with peaks no higher than -1 dBFS.',
    'Packing: one zip, named z4-narrator.zip. Inside it: the %d sound files, and a list named z4-narrator-list.csv with two columns, file and seconds: each file\'s name and its real length.' % n,
    'Check before handing back: %d files in 1 zip, every file name below present once, and nothing else.' % n,
], 1): P('%2d. %s' % (i, t))
P(''); P('HOW TO SAY THE NAMES')
P('Say them as in the earlier orders. If a name comes out wrong, write it in the International Phonetic Alphabet between slashes in the text.')
said = ' '.join(l['say'] for l in lines)
for a, b, c in [('Wickhollow', 'WICK-hollow', '/ˈwɪkhɒloʊ/'), ('Faire', 'the same as "fair"', '/fɛər/'), ('Misthollow', 'MIST-hollow', '/ˈmɪsthɒloʊ/'), ('Moonwell', 'MOON-well', '/ˈmuːnwɛl/'), ('Frostmere', 'FROST-meer', '/ˈfrɒstmɪər/'), ('Wardens', 'WAR-dens', '/ˈwɔːdənz/')]:
    if a in said: P('  %-11s %-22s %s' % (a, b, c))
P(''); P('=' * 78); P('SPEAKER: narrator   The narrator'); P('ZIP: z4-narrator.zip   (%d lines, about %.0f seconds)' % (n, secs))
P('VOICE: RETURNING. Use the same voice as before (z1-narrator.zip, z2-narrator.zip, z3-narrator.zip). For reference: ' + field(voice, 'note'))
P('-' * 78); P('ZONE 4: the northeast peaks, and the ending at the Faire   ZIP: z4-narrator.zip   (%d lines, about %.0f seconds)' % (n, secs)); P('-' * 78)
rows = []
for l in lines:
    P(l['id'] + '.mp3'); P('  Say:  ' + l['say']); P('  Tone: ' + l['tone']); P('')
    rows.append([l['id'] + '.mp3', 'z4-narrator.zip', 'narrator', 'The narrator', l['say'], l['text'], l['tone'], l['secs'], l['at'], WHEN.get(l['at'], '')])
d = os.path.join(root, 'game/people/recording')
open(os.path.join(d, 'narration-recording-order-z4.txt'), 'w', encoding='utf8').write('\n'.join(out) + '\n')
with open(os.path.join(d, 'narration-recording-order-z4.csv'), 'w', encoding='utf8', newline='') as f:
    w = csv.writer(f); w.writerow(['file', 'zip', 'speaker', 'speaker_name', 'say', 'words_shown', 'tone', 'seconds_about', 'said_at', 'when']); w.writerows(rows)
words = [len(l['text'].split()) for l in lines]
bad = [l['id'] for l in lines if re.search(r'[;—–]|\.\.\.|\d', l['say'])]
print('%d lines, about %.1f minutes; the longest is %d words, the average %.1f%s' % (n, secs / 60, max(words), sum(words) / n, '' if not bad else '; CHECK (a dash, a semicolon, dots or a digit): ' + ', '.join(bad)))
