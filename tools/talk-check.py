#!/usr/bin/env python3
"""talk-check.py: checks spoken lines against the story job's rules (Coven of the Moon Faire, November 19, 2026).

    python3 tools/talk-check.py                     # checks game/talk/sample.js (step 1)
    python3 tools/talk-check.py game/talk/zone-1.js # later: every line of a zone

What it checks, for every line:
  - one breath: no more than 24 words (and it lists lines over 16, to read again)
  - no dashes, semicolons or trailing dots, no numbers written as digits
  - none of the banned words (level, HP, MP, experience, quest, player, game, zone, a spell's name)
  - no name that is not on the approved list; it lists every name said aloud
  - the words to say, with the [cues] taken out, are exactly the words shown
  - every id is used once, and names its speaker
  - "you" or "your" in a line: listed, so a person can check it means the coven (or a witch named in that line)
It also works out how long each line takes to say, and the minutes for each speaker and in all.
It reads the data with node, because the data files are JavaScript.
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Names that may be said aloud. People (the brief's tables), places Chris made, and words of the world.
NAMES = {
    'Io', 'Kore', 'Europa', 'Callisto',
    'Odile', 'Bashir', 'Zofia', 'Linnet', 'Otto', 'Corwin', 'Ros', 'Tully', 'Kofi', 'Bridie', 'Jory',
    'Nettie', 'Hilde', 'Gretch', 'Quill', 'Wenna', 'Tobb', 'Pell',
    'Wickhollow', 'Thornwood', 'Bogmire', 'Misthollow', 'Dawnroost', 'Aethermoor', 'Faire', 'Grey', 'Hat',
    'Warm', 'Roads', 'Old', 'Mayor', 'Moon', 'Ember', 'Wardens',
}
WORLD_WORDS = {'Old', 'Mayor', 'Moon', 'Warm', 'Roads', 'Grey', 'Hat', 'Faire', 'Ember', 'Wardens'}  # not counted as names
# Said with care: each is flagged so a person decides.
CAREFUL = {
    'Auros': 'say "the moon" unless the line truly needs Auros',
    'Halcyon': 'rests on call 2 (Halcyon is Io’s sister)',
    'Moonwell': 'call 5: no Moonwell in Wickhollow in zone 1',
    'Kofi': 'sounds like Kore when spoken; the story page suggests not saying it',
    'Thareia': 'the world’s name: nobody in zone 1 needs it',
}
BANNED = ['level', 'levels', 'hp', 'mp', 'experience', 'quest', 'quests', 'player', 'players', 'game', 'games',
          'zone', 'zones']
SPELLS = ['sealed fate', 'curtain call', 'same cloth', 'crazy quilt', 'slip stitch', 'borrowed face', 'thornwake',
          'nightbloom', 'bramble cradle', 'flame bolt', 'lunar mend', 'silverleaf', 'waxing light',
          'moonflower garden', 'rootbound return', 'moonsteel', 'harvest moon', 'harvest crescent',
          'crescent blades', 'doom dance', 'gilded rebuke', 'attack taunt', 'heal taunt', 'silver requiem',
          'folding ward', 'elderwood guardian', 'lunara', 'envoi']
# How quick each speaker talks (1 is ordinary; more is slower). Step 2 moves this into game/talk/cast.js.
PACE = {'callisto': 1.1, 'tully': 1.1, 'captain': 1.08, 'odile': 1.04, 'io': 1.0, 'nettie': 0.96,
        'kore': 0.94, 'europa': 0.92}


def load(path):
    js = ("global.window={}; require(%s); const k=Object.keys(window).find(k=>k.startsWith('COVEN_TALK'));"
          "console.log(JSON.stringify(window[k]))") % json.dumps(str(path))
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def plain(t):
    return t.replace('’', "'").replace('“', '"').replace('”', '"')


def words(t):
    return [w for w in re.split(r"[\s]+", re.sub(r"[^\w'\- ]", ' ', plain(t))) if w]


def seconds(line):
    t = line['text']
    n = len(words(t))
    stops = max(0, len(re.findall(r'[.?!,]', t)) - 1)        # each stop inside the line is a small breath
    s = (n / 2.8 + 0.15 * stops + 0.2) * PACE.get(line['who'], 1.0)   # about 2.8 words a second, ordinary speech
    return round(s, 1)


def check(data):
    errors, notes, said_names = [], [], {}
    seen = set()
    for l in data['lines']:
        i, t = l['id'], l['text']
        if i in seen:
            errors.append(f'{i}: the id is used twice')
        seen.add(i)
        if not re.fullmatch(r'z\d\.[a-z]+\.\d\d', i) or i.split('.')[1] != l['who']:
            errors.append(f'{i}: the id should be z<zone>.<speaker>.<two digits>, with the speaker who says it')
        n = len(words(t))
        if n > 24:
            errors.append(f'{i}: {n} words, more than one breath (24)')
        elif n > 16:
            notes.append(f'{i}: {n} words; read it again for breath')
        if re.search(r'[–—;]| - |\.\.\.|…', t):
            errors.append(f'{i}: a dash, semicolon or trailing dots')
        if re.search(r'\d', t):
            errors.append(f'{i}: a number written in digits')
        low = plain(t).lower()
        for b in BANNED:
            if re.search(r'\b' + b + r'\b', low):
                errors.append(f'{i}: the banned word "{b}"')
        for s in SPELLS:
            if s in low:
                errors.append(f'{i}: a spell’s name, "{s}"')
        if re.sub(r'\s+', ' ', re.sub(r'\[[^\]]*\]', '', l['say'])).strip() != t:
            errors.append(f'{i}: the words to say are not the words shown')
        tags = re.findall(r'\[([^\]]*)\]', l['say'])
        if len(tags) > 1:
            notes.append(f'{i}: {len(tags)} cues; use few')
        # names: every capitalised word. At the start of a sentence it may be an ordinary word; anywhere else it
        # must be an approved name.
        for m in re.finditer(r"\b([A-Z][a-z]+)", plain(t)):
            w, before = m.group(1), plain(t)[:m.start()].rstrip()
            first = before == '' or before[-1] in '.?!"'
            if w in CAREFUL:
                notes.append(f'{i}: "{w}": {CAREFUL[w]}')
            elif w not in NAMES and not first and w != 'I':
                errors.append(f'{i}: "{w}" is not an approved name')
            if (w in NAMES or w in CAREFUL) and w not in WORLD_WORDS:
                said_names.setdefault(w, [])
                if i not in said_names[w]:
                    said_names[w].append(i)
        if re.search(r"\byou(r|'re|'ll|'ve)?\b", low) and not re.search(r'\byou four\b', low):
            named = [w for w in ('Io', 'Kore', 'Europa', 'Callisto') if re.search(r'\b' + w + r'\b', t)]
            notes.append(f'{i}: says "you": check it means the coven' + (f' (names {", ".join(named)})' if named else ''))
    return errors, notes, said_names


def summary(data):
    per = {}
    for l in data['lines']:
        p = per.setdefault(l['who'], {'lines': 0, 'words': 0, 'secs': 0.0})
        p['lines'] += 1
        p['words'] += len(words(l['text']))
        p['secs'] += seconds(l)
    return per


def main():
    path = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT / 'game/talk/sample.js'
    data = load(path)
    errors, notes, said = check(data)
    per = summary(data)
    print(f'{path.name}: {len(data["lines"])} lines')
    for who, p in per.items():
        print(f'  {who:10} {p["lines"]:3} lines {p["words"]:4} words {p["secs"]:6.1f} s')
    tw = sum(p['words'] for p in per.values()); ts = sum(p['secs'] for p in per.values())
    print(f'  {"all":10} {len(data["lines"]):3} lines {tw:4} words {ts:6.1f} s  ({ts / 60:.1f} minutes)')
    longest = max(data['lines'], key=lambda l: len(words(l['text'])))
    print(f'  longest line: {longest["id"]}, {len(words(longest["text"]))} words; '
          f'average {tw / len(data["lines"]):.1f} words')
    print('names said aloud: ' + (', '.join(f'{k} ({len(v)})' for k, v in sorted(said.items())) or 'none'))
    for n in notes:
        print('  note: ' + n)
    for e in errors:
        print('  PROBLEM: ' + e)
    print('ALL GOOD' if not errors else f'{len(errors)} PROBLEM(S)')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
