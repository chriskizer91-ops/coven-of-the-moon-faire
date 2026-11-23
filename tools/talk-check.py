#!/usr/bin/env python3
"""talk-check.py: checks spoken lines against the story job's rules (Coven of the Moon Faire, November 19, 2026).

    python3 tools/talk-check.py                         # checks game/talk/zone-1.js
    python3 tools/talk-check.py game/talk/sample.js     # the approved sample
    python3 tools/talk-check.py --fill                  # also writes each line's seconds into zone-1.js
                                                        # (the real length once recorded: recording/z1-lengths.csv)

For every line:
  - one breath: no more than 24 words (and it lists lines over 18, to read again)
  - no dashes, semicolons or trailing dots, no numbers written as digits
  - none of the banned words (level, HP, MP, experience, quest, player, game, zone, a spell's name)
  - no name that is not approved (and Kofi's name is never said: Chris, November 19)
  - the words to say, with the [cues] taken out, are exactly the words shown
  - every id is used once and names its speaker; every speaker is in the cast
  - "you" or "your": listed, so a person can check it means the coven (or a witch named in that line)
For the zone (when the file is a zone):
  - each person's count of lines against the brief's table (docs/lore/story-brief.md, section 4)
  - every person has something to say at every stage, after the first talk
  - every ordinary person has one line that points to one of the four people the story is told through
  - a story talk has its lines in order, no more than six, and no more than two of them a witch's
  - the 24 lines of the approved sample are here word for word
It also works out how long each line takes to say, and the minutes for each speaker and in all.
It reads the data with node, because the data files are JavaScript.
"""
import json, re, subprocess, sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# Names that may be said aloud. People (the brief's tables), places Chris made, and words of the world.
NAMES = {
    'Io', 'Kore', 'Europa', 'Callisto',
    'Odile', 'Bashir', 'Zofia', 'Linnet', 'Otto', 'Corwin', 'Ros', 'Tully', 'Bridie', 'Jory',
    'Nettie', 'Hilde', 'Gretch', 'Quill', 'Wenna', 'Tobb', 'Pell', 'Halcyon',
    'Marta', 'Brann', 'Tamsin', 'Ysmera', 'Gil', 'Tock', 'Pim', 'Sorrel', 'Ede',
    'Wickhollow', 'Thornwood', 'Bogmire', 'Misthollow', 'Dawnroost', 'Eldergrove', 'Aethermoor', 'Faire', 'Grey', 'Hat',
    'Warm', 'Roads', 'Old', 'Mayor', 'Moon', 'Ember', 'Warden', 'Wardens', 'Moonwell',
}
WORLD_WORDS = {'Old', 'Mayor', 'Moon', 'Warm', 'Roads', 'Grey', 'Hat', 'Faire', 'Ember', 'Warden', 'Wardens'}  # not counted as names
NEVER = {'Kofi': 'Kofi’s name is never said aloud (it sounds like Kore): Chris, November 19'}
NEVER_IN = {'z1': {'Moonwell': 'call 5: no Moonwell in Wickhollow in zone 1'}}
CAREFUL = {'Auros': 'say "the moon" unless the line truly needs Auros',
           'Thareia': 'the world’s name: nobody needs it'}
BANNED = ['level', 'levels', 'hp', 'mp', 'experience', 'quest', 'quests', 'player', 'players', 'game', 'games',
          'zone', 'zones']
SPELLS = ['sealed fate', 'curtain call', 'same cloth', 'crazy quilt', 'slip stitch', 'borrowed face', 'thornwake',
          'nightbloom', 'bramble cradle', 'flame bolt', 'lunar mend', 'silverleaf', 'waxing light',
          'moonflower garden', 'rootbound return', 'moonsteel', 'harvest moon', 'harvest crescent',
          'crescent blades', 'doom dance', 'gilded rebuke', 'attack taunt', 'heal taunt', 'silver requiem',
          'folding ward', 'elderwood guardian', 'lunara', 'envoi']
WITCHES = {'io', 'kore', 'europa', 'callisto'}
BOLD = {'odile', 'captain', 'nettie', 'wenna'}   # zone 1's; a zone file names its own in `bold`
# The brief's table: how many lines each person has in zone 1.
TARGET_Z1 = {'odile': 24, 'zofia': 8, 'bashir': 6, 'linnet': 6, 'otto': 6, 'corwin': 6, 'ros': 6, 'tully': 6,
             'kofi': 6, 'bridie': 6, 'jory': 6, 'captain': 28, 'quill': 6, 'nettie': 24, 'gretch': 8, 'hilde': 6,
             'wenna': 20, 'tobb': 6, 'pell': 6, 'io': 14, 'kore': 12, 'europa': 10, 'callisto': 10}
# Zones 2 to 4: the outline Chris approved on November 19 (docs/lore/story-zones-2-4.md).
TARGETS = {
    'z1': TARGET_Z1,
    'z2': {'roadwarden': 16, 'marta': 22, 'brann': 8, 'tamsin': 6, 'carter': 6, 'captain': 16,
           'io': 14, 'kore': 12, 'europa': 10, 'callisto': 10},
    'z3': {'ysmera': 22, 'gil': 8, 'tock': 6, 'pim': 6, 'passenger': 8, 'cutter': 6, 'halcyon': 2, 'captain': 16,
           'io': 15, 'kore': 13, 'europa': 11, 'callisto': 11},
    'z4': {'passkeeper': 8, 'sorrel': 8, 'ede': 8, 'watch': 10, 'warden': 2, 'halcyon': 12, 'captain': 12,
           'io': 18, 'kore': 16, 'europa': 13, 'callisto': 13,
           'nettie': 4, 'odile': 3, 'tully': 2, 'linnet': 2, 'zofia': 2, 'bridie': 2, 'bashir': 1, 'otto': 1,
           'corwin': 1, 'ros': 1, 'kofi': 1, 'jory': 1, 'gretch': 1, 'hilde': 1, 'quill': 1},
}
_cast = None


def node_json(path):
    js = ("global.window={}; require(%s); const k=Object.keys(window).find(k=>k.startsWith('COVEN_'));"
          "console.log(JSON.stringify(window[k]))") % json.dumps(str(Path(path).resolve()))
    out = subprocess.run(['node', '-e', js], capture_output=True, text=True, check=True).stdout
    return json.loads(out)


def load(path):
    return node_json(path)


def cast():
    global _cast
    if _cast is None:
        _cast = node_json(ROOT / 'game/talk/cast.js')
    return _cast


def plain(t):
    return t.replace('’', "'").replace('“', '"').replace('”', '"')


def words(t):
    return [w for w in re.split(r"[\s]+", re.sub(r"[^\w'\- ]", ' ', plain(t))) if w]


_recorded = None


def recorded():
    """The real lengths of recorded lines (game/talk/recording/<zone>-lengths.csv), by line id."""
    global _recorded
    if _recorded is None:
        _recorded = {}
        for f in (ROOT / 'game/talk/recording').glob('*-lengths.csv'):
            for row in f.read_text().splitlines()[1:]:
                name, secs = row.split(',')
                _recorded[name.removesuffix('.mp3')] = float(secs)
    return _recorded


USE_RECORDED = True   # off for files that are not a zone (their ids are not the recordings' ids)


def seconds(line):
    """The line's length: its recording's real length if it has been recorded, otherwise the estimate."""
    return round(recorded()[line['id']], 1) if USE_RECORDED and line['id'] in recorded() else estimate(line)


def estimate(line):
    t = line['text']
    n = len(words(t))
    stops = max(0, len(re.findall(r'[.?!,]', t)) - 1)        # each stop inside the line is a small breath
    pace = cast().get(line['who'], {}).get('pace', 1.0)
    return round((n / 2.8 + 0.15 * stops + 0.2) * pace, 1)  # about 2.8 words a second, ordinary speech


def allows(when, stage):
    s = when.get('stage')
    return s is None or s[0] <= stage <= s[1]


def check_lines(data):
    errors, notes, said = [], [], {}
    never = {**NEVER, **NEVER_IN.get(data.get('zone', ''), {})}
    seen = set()
    for l in data['lines']:
        i, t = l['id'], l['text']
        if i in seen:
            errors.append(f'{i}: the id is used twice')
        seen.add(i)
        if (not re.fullmatch(r'z\d\.[a-z]+\.\d\d', i) or i.split('.')[1] != l['who']
                or i.split('.')[0] != data.get('zone', i.split('.')[0])):
            errors.append(f'{i}: the id should be z<zone>.<speaker>.<two digits>, with the speaker who says it')
        if l['who'] not in cast():
            errors.append(f'{i}: "{l["who"]}" is not in game/talk/cast.js')
        for k in ('text', 'say', 'tone', 'kind', 'when'):
            if k not in l or l[k] in ('', None):
                errors.append(f'{i}: no {k}')
        n = len(words(t))
        if n > 24:
            errors.append(f'{i}: {n} words, more than one breath (24)')
        elif n > 18:
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
        if len(re.findall(r'\[([^\]]*)\]', l['say'])) > 1:
            notes.append(f'{i}: more than one cue; use few')
        # names: every capitalised word. At the start of a sentence it may be an ordinary word; anywhere else it
        # must be an approved name.
        for m in re.finditer(r"\b([A-Z][a-z]+)", plain(t)):
            w, before = m.group(1), plain(t)[:m.start()].rstrip()
            first = before == '' or before[-1] in '.?!"'
            if w in never:
                errors.append(f'{i}: "{w}": {never[w]}')
            elif w in CAREFUL:
                notes.append(f'{i}: "{w}": {CAREFUL[w]}')
            elif w not in NAMES and not first and w != 'I':
                errors.append(f'{i}: "{w}" is not an approved name')
            if (w in NAMES or w in CAREFUL) and w not in WORLD_WORDS:
                said.setdefault(w, [])
                if i not in said[w]:
                    said[w].append(i)
        if l['who'] not in WITCHES and re.search(r"\byou(r|'re|'ll|'ve|'d)?\b", low) and not re.search(r'\byou four\b', low):
            named = [w for w in ('Io', 'Kore', 'Europa', 'Callisto') if re.search(r'\b' + w + r'\b', t)]
            notes.append(f'{i}: says "you": check it means the coven' + (f' (names {", ".join(named)})' if named else ''))
    return errors, notes, said


def check_zone(data, target):
    errors, notes = [], []
    lines = data['lines']
    bold = set(data.get('bold', BOLD))
    special = data.get('special', {})          # speakers outside the usual shape, with the reason
    moments = data.get('moments', {})
    per = {}
    for l in lines:
        per.setdefault(l['who'], []).append(l)
    for who, want in target.items():
        have = len(per.get(who, []))
        if have != want:
            errors.append(f'{who}: {have} lines, the brief’s table says {want}')
    for who in per:
        if who not in target:
            errors.append(f'{who}: speaks, but is not in the brief’s table')
    # every person (not the witches) has something for a later talk at every stage
    for who, ls in per.items():
        if who in WITCHES or who in special or all('moment' in l['when'] for l in ls):
            continue
        for st in range(5):
            if not any(allows(l['when'], st) and l['when'].get('first') is not True and l['kind'] != 'call'
                       and not ({'met', 'just', 'look', 'lamps', 'nodes', 'moment'} & set(l['when'])) for l in ls):
                errors.append(f'{who}: nothing to say at stage {st} ({data["stages"][st]}) after the first talk')
        if not any(l['when'].get('first') is True for l in ls):
            errors.append(f'{who}: no first hello')
        if who not in bold and not any(l['kind'] == 'pointer' and l.get('to') in bold for l in ls):
            errors.append(f'{who}: no line that points to one of the people with many lines ({", ".join(sorted(bold))})')
        if who not in bold and not any(l['kind'] == 'call' for l in ls):
            errors.append(f'{who}: no call as the coven passes')
    # extras only for the four
    for l in lines:
        if l['who'] not in bold and ({'met', 'just', 'look'} & set(l['when'])):
            errors.append(f'{l["id"]}: met, just and look are only for the people with many lines')
        if 'moment' in l['when'] and moments and l['when']['moment'] not in moments:
            errors.append(f'{l["id"]}: the moment "{l["when"]["moment"]}" is not in this zone\u2019s list')
        if l.get('to') and l['to'] not in cast():
            errors.append(f'{l["id"]}: points to "{l["to"]}", who is not in the cast')
        if l['kind'] == 'coven' and 'moment' not in l['when']:
            errors.append(f'{l["id"]}: a coven line needs its moment')
        if l['who'] in WITCHES and l['kind'] not in ('coven', 'story'):
            errors.append(f'{l["id"]}: a witch’s line is coven or story')
    # talks
    talks = {}
    for l in lines:
        if l.get('talk'):
            talks.setdefault(l['talk'][0], []).append(l)
    for tid, ls in talks.items():
        order = sorted(l['talk'][1] for l in ls)
        if order != list(range(1, len(ls) + 1)):
            errors.append(f'{tid}: its lines are numbered {order}, not 1 to {len(ls)}')
        if len(ls) > 6:
            errors.append(f'{tid}: {len(ls)} lines; a talk has no more than six')
        people = {l['who'] for l in ls} - WITCHES
        in_moment = all('moment' in l['when'] for l in ls)
        if people and not in_moment and sum(l['who'] in WITCHES for l in ls) > 2:
            errors.append(f'{tid}: more than two witch lines in a talk with a person')
        if len(people) > 1 and not in_moment:
            errors.append(f'{tid}: more than one person (not a witch) in one talk')
    # the approved sample, word for word
    sample = ROOT / 'game/talk/sample.js'
    if sample.exists() and data.get('zone') == 'z1':
        texts = {l['text'] for l in lines}
        for l in load(sample)['lines']:
            if l['text'] not in texts:
                errors.append(f'approved sample line missing or changed: “{l["text"]}”')
    return errors, notes, talks


def summary(data):
    per = {}
    for l in data['lines']:
        p = per.setdefault(l['who'], {'lines': 0, 'words': 0, 'secs': 0.0})
        p['lines'] += 1
        p['words'] += len(words(l['text']))
        p['secs'] += seconds(l)
    return per


def fill(path, data):
    """Write each line's seconds into the file, right after its id."""
    s = path.read_text()
    for l in data['lines']:
        sec = seconds(l)
        pat = re.compile(r"(\{ id: '" + re.escape(l['id']) + r"',)( secs: [\d.]+,)?")
        s, n = pat.subn(lambda m: m.group(1) + f' secs: {sec},', s)
        if n != 1:
            sys.exit(f'could not place the seconds for {l["id"]}')
    path.write_text(s)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    path = Path(args[0]) if args else ROOT / 'game/talk/zone-1.js'
    data = load(path)
    errors, notes, said = check_lines(data)
    is_zone = 'stages' in data and path.name.startswith('zone-')
    global USE_RECORDED
    USE_RECORDED = is_zone
    if is_zone:
        e2, n2, talks = check_zone(data, TARGETS[data['zone']])
        errors += e2; notes += n2
    per = summary(data)
    print(f'{path.name}: {len(data["lines"])} lines')
    order = list(TARGETS[data['zone']]) if is_zone else list(per)
    for who in order:
        if who in per:
            p = per[who]
            print(f'  {who:10} {p["lines"]:3} lines {p["words"]:5} words {p["secs"]:6.1f} s  ({p["secs"] / 60:.1f} min)')
    tw = sum(p['words'] for p in per.values()); ts = sum(p['secs'] for p in per.values())
    print(f'  {"all":10} {len(data["lines"]):3} lines {tw:5} words {ts:6.1f} s  ({ts / 60:.1f} minutes)')
    longest = max(data['lines'], key=lambda l: len(words(l['text'])))
    print(f'  longest line: {longest["id"]}, {len(words(longest["text"]))} words; '
          f'average {tw / len(data["lines"]):.1f} words')
    rec = sum(USE_RECORDED and l['id'] in recorded() for l in data['lines'])
    print(f'  seconds: {rec} of {len(data["lines"])} lines are real recorded lengths, the rest estimates')
    cues = sum(len(re.findall(r'\[[^\]]*\]', l['say'])) for l in data['lines'])
    print(f'  delivery cues: {cues} in {len(data["lines"])} lines')
    print('names said aloud: ' + (', '.join(f'{k} ({len(v)})' for k, v in sorted(said.items())) or 'none'))
    for n in notes:
        print('  note: ' + n)
    for e in errors:
        print('  PROBLEM: ' + e)
    if '--fill' in sys.argv and not errors:
        fill(path, data)
        print(f'seconds written into {path.name}')
    print('ALL GOOD' if not errors else f'{len(errors)} PROBLEM(S)')
    return 1 if errors else 0


if __name__ == '__main__':
    sys.exit(main())
