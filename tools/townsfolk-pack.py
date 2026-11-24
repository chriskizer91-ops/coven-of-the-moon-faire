#!/usr/bin/env python3
"""townsfolk-pack.py: the townsfolk job's packer (Coven of the Moon Faire, November 24, 2026).

It does two things, both from game/people/folk/townsfolk/ (townsfolk.json and shapes/<id>.js):

    python3 tools/townsfolk-pack.py
        writes game/people/folk/townsfolk/townsfolk-shapes.js: every person's shapes in one file a page can load
        (window.COVEN_TOWNSFOLK). Only game/pages/townsfolk-lineup.html loads it: the size sheet. No zone page does.

    python3 tools/townsfolk-pack.py --for-chris <folder> --guides <folder made by tools/townsfolk-guides.py>
                                    [--sizes <picture> ...] [--style <picture>]
        writes the folder Chris gets: START-HERE.txt, one folder for each person (the two grey guides and the words to
        give ChatGPT with each), the size sheets, and a zip of it all beside the folder.

The words are the way the eleven fair folk's were written (the old Moon Faire's game/people/kit/build_skin_prompts.py),
fitted to this game: its rules are kept line for line, the style line says in words what the eleven came out as, and one
line is added for the children and the gnomes, whom the game makes small by itself.
"""
import json, os, re, shutil, sys, zipfile

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TF = os.path.join(ROOT, 'game', 'people', 'folk', 'townsfolk')

BODY = '''Attach {attach}

Paint over the first picture. It is a grey guide of one person shown twice: from the front on the left, from the back on the right, standing with the arms a little out from the sides.

WHO: {name}. {who}

WHAT TO PAINT: {body}

RULES
- Keep the picture exactly this shape (3 wide by 2 tall). Keep both figures exactly where they are and exactly this size. Trace the guide's outlines: the same head covering, hair, sleeves, hands, clothes, legs and boots, and the same gaps between the arms and the body. Do not move, resize, crop, turn or re-pose the figures.{small}
- Add nothing outside the grey shapes: nothing held in the hands, nothing hanging, blowing or sticking out past the outline.
- {style}
- {world}
- Light both figures flat and evenly from straight ahead, like a costume sheet. No cast shadows, no ground, no glow, no rim light, no dark side. The game adds its own light.
- The two figures are the same person in the same clothes. Every colour, pattern and detail on the front carries round to the back.
- The right figure is seen from behind: the back of the head, no face.
- Paint the face on the left figure simply. A separate close-up replaces it.
- Fill the background with one flat mid-grey. No text, no labels, no border.'''
FACE = '''Attach one picture: {id}-face-guide.png

Repaint the face in this picture as a different person. It is a face painting that gets wrapped onto a 3D head, so its layout must not change.

WHO: {name}. {face}

RULES
- Keep the picture square and exactly this size.
- Keep the eyes, brows, nose, mouth and chin exactly where they are and the same size. Front view, looking straight ahead, mouth closed.
- Keep the plain surround: only the face in the middle, fading softly into one flat skin colour all round, in the new person's skin colour. No hair, no ears, no neck, no hat, no background.
- Paint it lifelike, in the same hand-painted style as the picture, with soft brushwork.
- Flat even light from straight ahead: no shadow down one side, no lamp highlights.
- No text, no border.'''
CUT_A = '- - - - copy everything from the next line - - - -'
CUT_B = '- - - - down to the line above - - - -'
SMALL = ' The game makes this person small by itself: paint the figure at exactly the size the guide shows, not smaller.'


def data():
    return json.load(open(os.path.join(TF, 'townsfolk.json'), encoding='utf-8'))


def pack_shapes(d):
    out = ['// townsfolk-shapes.js: the townsfolk\'s shapes in one file a page can load. MADE BY tools/townsfolk-pack.py from',
           '// game/people/folk/townsfolk/shapes/*.js and townsfolk.json: change those, not this. A PROPOSAL (see townsfolk.json).',
           '// Only game/pages/townsfolk-lineup.html loads it (the size sheet). No zone page does: wiring comes after the paint.',
           'window.COVEN_TOWNSFOLK = { order: %s, people: {' % json.dumps(d['order'])]
    for p in d['people']:
        code = open(os.path.join(TF, p['shapes']), encoding='utf-8').read()
        assert 'const PERSON' in code and '</script' not in code.lower()
        out.append('  %s: { name: %s, zone: %d, heightM: %s, person: function () {\n%s\n    return PERSON; } },'
                   % (json.dumps(p['id']), json.dumps(p['name'], ensure_ascii=False), p['zone'], p['heightM'], code.rstrip()))
    out.append('} };\n')
    f = os.path.join(TF, 'townsfolk-shapes.js')
    open(f, 'w', encoding='utf-8').write('\n'.join(out))
    print('wrote', os.path.relpath(f, ROOT), '%d people, %.0f KB' % (len(d['people']), os.path.getsize(f) / 1024))


def words(d, p, has_style):
    L = p['look']
    attach = ('two pictures: first %s-body-guide.png, then style-example.jpg' % p['id']) if has_style else ('one picture: %s-body-guide.png' % p['id'])
    style = d['style'] + (' The second picture shows three of those eleven from behind: match its finish. Take only the finish from it, not the people or their clothes.' if has_style else '')
    body = BODY.format(attach=attach, name=L['name'], who=L['who'], body=L['body'], style=style, world=d['world'], small=SMALL if p['heightM'] < 1.35 else '')
    face = FACE.format(id=p['id'], name=L['name'], face=L['face'])
    return body, face


def for_chris(d, out, guides, sizes, style):
    if os.path.exists(out):
        shutil.rmtree(out)
    os.makedirs(out)
    by = {p['id']: p for p in d['people']}
    n = len(d['order'])
    for k, pid in enumerate(d['order'], 1):
        p = by[pid]
        folder = os.path.join(out, '%02d-%s' % (k, pid))
        os.makedirs(folder)
        shutil.copy(os.path.join(guides, pid + '-body-guide.png'), folder)
        shutil.copy(os.path.join(guides, pid + '-face-guide.png'), folder)
        look = os.path.join(guides, pid + '-shape.jpg')
        if os.path.exists(look):
            shutil.copy(look, os.path.join(folder, pid + '-shape-all-round.jpg'))
        if style:
            shutil.copy(style, os.path.join(folder, 'style-example.jpg'))
        body, face = words(d, p, bool(style))
        t = ['%s, %s (zone %d)   PERSON %d OF %d' % (p['name'], p['trade'], p['zone'], k, n),
             'A PROPOSAL: change any of these words before you use them. The look is yours to say.',
             '', 'Who this is, from their own lines: %s, %s. %s' % (p['fromTheLines'].get('age', ''), p['fromTheLines'].get('sex', ''), p['fromTheLines'].get('manner', '')),
             'What is a guess: ' + p.get('guesses', ''),
             '', '=' * 78, 'PICTURE 1 OF 2: THE BODY.   Save what ChatGPT makes as:  %s-body.png' % pid, '=' * 78, CUT_A, body, CUT_B,
             '', '', '=' * 78, 'PICTURE 2 OF 2: THE FACE.   Save what ChatGPT makes as:  %s-face.png' % pid, '=' * 78, CUT_A, face, CUT_B, '']
        open(os.path.join(folder, pid + '-words.txt'), 'w', encoding='utf-8').write('\n'.join(t))
    for s in sizes:
        shutil.copy(s, out)
    first = [by[i]['name'] for i in d['order'][:7]]
    start = START.format(n=n, pics=n * 2, first=', '.join(first), firstpics=14,
                         rows='\n'.join('  %02d  %-22s %-44s zone %d   %s-body.png   %s-face.png' % (k, by[i]['name'], by[i]['trade'][:44], by[i]['zone'], i, i) for k, i in enumerate(d['order'], 1)),
                         style=('\n   The folder also holds style-example.jpg (three of the Faire\'s own people from behind). The words ask for it as a\n   second picture, so the new people match the eleven. If a picture comes out too much like those three, leave it out.' if style else ''),
                         sizes=('\n'.join('  ' + os.path.basename(s) for s in sizes) or '  (none)'))
    open(os.path.join(out, 'START-HERE.txt'), 'w', encoding='utf-8').write(start)
    z = out.rstrip('/') + '.zip'
    if os.path.exists(z):
        os.remove(z)
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as zf:
        for base, _, files in sorted(os.walk(out)):
            for f in sorted(files):
                full = os.path.join(base, f)
                zf.write(full, os.path.join(os.path.basename(out.rstrip('/')), os.path.relpath(full, out)))
    files = sum(len(f) for _, _, f in os.walk(out))
    print('wrote %s: %d people, %d files, and %s (%.1f MB)' % (out, n, files, z, os.path.getsize(z) / 1048576))


START = '''THE TOWNSFOLK'S OWN BODIES: WHAT IS HERE, AND WHAT TO DO
Coven of the Moon Faire, November 24, 2026. Everything here is a PROPOSAL: how each person looks is yours to say.

WHAT THIS IS
The people of the towns (Nettie, Marta, the shipmaster and the rest) wear the fair folk's bodies today as stand-ins.
This folder is the first half of giving them bodies of their own, made the same way as the Faire's eleven:
a grey 3D shape for each person, which you paint over in ChatGPT. Two pictures a person: the body, and the face.

  People who need a body:   {n}
  Pictures to make:         {pics}  (two each)
  If there is only time for some: the first seven ({firstpics} pictures) are the people the story leans on:
      {first}.

LOOK FIRST
{sizes}
  The size sheets show every grey shape standing beside one of the Faire's own people, with lines at 1 m, 1.5 m,
  1.65 m (a witch's height) and 1.8 m. If someone looks too tall, too short, too wide or wrong, say so before painting:
  a height or a build is one number to change. A wrong hat or coat is a new shape, and a new guide.

THE STEPS, FOR EACH PERSON (the folders are numbered in the order to do them)
1. Open the person's folder. Read <name>-words.txt. Change any words you like: the look is a proposal.
   <name>-shape-all-round.jpg shows the shape from every side, in first colours, so you can see what each part is.
2. In ChatGPT, start a new chat. Attach <name>-body-guide.png. Paste the words under "PICTURE 1 OF 2: THE BODY".{style}
3. Save the picture it makes as <name>-body.png. Check three things: both figures are still where the guide had
   them and the same size; the background is plain grey; nothing new sticks out past the grey shape.
   If it moved or resized the figures, ask it again: "Keep both figures exactly where the guide has them."
4. In the same chat or a new one, attach <name>-face-guide.png. Paste the words under "PICTURE 2 OF 2: THE FACE".
5. Save the picture as <name>-face.png. Check: the face looks straight ahead with the mouth closed, there is no hair
   or neck, and the eyes are where the guide's eyes were.
6. Send both pictures back to the hub, as they came (PNG, full size). A zip of many at once is fine.

THE NAMES TO SAVE THEM AS
{rows}

GOOD TO KNOW
- In a guide, hair and bare skin can come out the same pale grey (the back of a head most of all). The words say
  which is which.
- The face guide is the same picture in every folder (the template's plain face). It is copied into each folder
  under that person's name so nothing gets mixed up.
- The children (Pell, Tamsin) and the gnomes (Tock, Pim) look full-size in their guides. That is right: the game
  makes them small, and gives them a bigger head, by itself. The size sheets show them as they will stand.
- In <name>-shape-all-round.jpg the small and short people stand with bent knees. That is a fault in the shared
  template when a person is made smaller than a witch (it is in the game today too, under the stand-ins). The hub
  has the one-line fix. The size sheets show everyone standing straight, as they will once it is in.
- How long this takes is a guess: the old notes do not say how long the eleven's 22 pictures took, only that they
  were all made in one day. At 3 to 5 minutes a picture, the first seven people are about an hour, and all
  {pics} pictures are 2 and a half to 4 hours, more if ChatGPT makes you wait between pictures.
- The forty Wardens who stand in Misthollow's street all share ONE body (folder 07-warden): the helm and the mail
  hood hide the hair, so one painting can be all forty. If you would like them to have two faces, paint a second
  face over the same face guide (a woman of about thirty) and save it as warden-face-2.png. That is up to you.
- Halcyon and the knight of light are not here. You have already said what Halcyon is (Io's body in the paladin
  outfit, with a glow), and on the land the knight is a light. Neither needs a painting of this kind.
- Old lessons from the eleven: the painted skin does most of the work; ChatGPT kept to the guide within 1 to 2
  parts in a hundred; hair comes out as a plain shape round the face, and the top of a tall hat can smear.
- What happens after you send them: the pictures are laid onto the shapes, everyone is looked over side by side
  with the fair folk, made light (a quarter of the triangles), and stood in the towns. You then see them in the game.
'''


def main():
    a = sys.argv[1:]
    d = data()
    if '--for-chris' not in a:
        return pack_shapes(d)
    out = os.path.abspath(a[a.index('--for-chris') + 1]); guides = os.path.abspath(a[a.index('--guides') + 1])
    style = os.path.abspath(a[a.index('--style') + 1]) if '--style' in a else None
    sizes = []
    if '--sizes' in a:
        i = a.index('--sizes') + 1
        while i < len(a) and not a[i].startswith('--'):
            sizes.append(os.path.abspath(a[i])); i += 1
    for_chris(d, out, guides, sizes, style)


if __name__ == '__main__':
    main()
