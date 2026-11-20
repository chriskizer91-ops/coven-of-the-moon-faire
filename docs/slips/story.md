# story: the story's dialogue, written to be spoken aloud

Branch: job/story      Last commit: (see the branch)      Updated: November 19, 2026, evening (step 3)

## What it built

**Step 2 is done: all of zone 1's spoken lines, as data the game reads. The recordings came back the same day, are
checked, approved by Chris, and on the branch. Step 3's outline for zones 2 to 4 is written and waits for his yes.**

- `docs/lore/story-zones-2-4.md` (and `.html`, made by `tools/talk-outline.py`): **the outline for zones 2 to 4**, a
  proposal. For each zone: what it is for, its five stages and where the story points at each, who speaks and how
  many lines (zone 2 about 120, zone 3 about 124, zone 4 about 145 with the ending at the Faire), the coven's set
  moments, the small stories, and each witch's thread. Seven new calls for Chris (12 to 18). About 625 lines and 46
  minutes for the whole game. No line written yet.

- `game/talk/audio/z1/`: **all 236 recordings**, one MP3 a line, named `<id>.mp3`, taken byte for byte from the
  listening page Chris sent (8.5 MB). `game/talk/recording/z1-lengths.csv`: each one's real length. Every line's
  `secs` in `zone-1.js` is now its real length (17 minutes 23 seconds in all).
- `tools/talk-voices.py` measures the recordings against the order; `docs/lore/story-voices.html` is its page for
  Chris: what passed, and ten lines worth his ear, each playable on the page.

- `game/talk/zone-1.js`: **all 236 lines** (`window.COVEN_TALK_Z1`). Each has its id (also its sound file's name), who
  says it, the words shown, the words to say with any cue in square brackets, a plain tone note, when it can be said,
  what kind of line it is, its place in a story talk, who a pointer sends the coven to, and about how many seconds it
  takes. The counts are the brief's table exactly. The 24 approved sample lines are in it word for word.
- `game/talk/cast.js`: **all 23 speakers** (`window.COVEN_CAST`): name, trade, where they stand, a voice note for
  casting (age, sex, where they sound from, pitch, pace, texture, a line to audition with), and every small fact the
  lines invent about their own life.
- `docs/lore/story-zone-1.html`: **the reading page** (one HTML file, phone first). Every line by person and by stage,
  with seconds and totals, each person's voice note and invented facts, and the recording order in its own tab.
- `game/talk/recording/z1-recording-order.txt` and `.csv`: **the recording order**, to hand to ChatGPT whole. It
  stands on its own: what the lines are, how to name, cut, level and zip the files, how to say the names (with IPA,
  which Eleven v4 reads), then each speaker's voice note and lines.
- `tools/talk-check.py` (grown for a whole zone; `--fill` writes the seconds in), `tools/talk-reading.py` (makes the
  reading page and the recording order), `tools/talk-page.py` (step 1's page, kept).
- Step 1, kept as the record of what Chris approved: `docs/lore/story-page.md` (now marked approved),
  `game/talk/sample.js`, `docs/lore/story-sample.html` and `.md`.

## What Chris said here

- November 19, 08:42: go (start step 1).
- **November 19, 17:55: "It's all good"**, after the voices page was fixed: the voices are approved as recorded, no
  redos (taken that way; he can still flag any).
- **November 19, 16:20: "Here are the voices"**: a listening page with all 236 recordings (made by ChatGPT with
  ElevenLabs from the recording order).
- **November 19, 09:25: "Yes to all. Please continue."** On `docs/lore/story-page.md` and the 24-line sample, so:
  - The story in ten lines, as the story page has it (with its six changes), and the witches' threads.
  - The voice of the 24 sample lines.
  - His calls, each as picked: 1 these are the last moonlit years and the moon sets at the end; 2 Halcyon is Io's
    older sister and the fire is hers; 3 Kore died on stage mid-show and was offered a bargain below (walk the lost
    home, and you may take your bow); 4 Callisto is a princess of a land the moon left long ago, never named; 5 no
    Moonwell in Wickhollow in zone 1's lines; 6 the fair folk's names as the brief has them, Kofi's name not said
    aloud, Tully voiced as a woman; 7 nobody says the Grey Hat's name in zone 1; 8 the witches speak at set moments,
    about 46 lines; 9 a released soul's pale moth flies up to the moon (in zone 1, west, the opposite way to the
    lean); 10 Halcyon lives, she is the knight of light, Io gives her the oldest letter by hand, and the kept flame is
    the one Halcyon carried from home; 11 the names are said as the story page has them (Io EYE-oh, Kore KOR-ee,
    Europa yoo-ROH-pah, Callisto kah-LISS-toh, Halcyon HAL-see-on, Odile oh-DEEL, Bashir bah-SHEER, Zofia ZOF-yah).

## What was copied in

- Nothing from the old repos. The recordings are new, made for this game, so they need no line in
  `assets/INDEX.csv`.

## What was checked, and how

- **The recordings** (`python3 tools/talk-voices.py`, ffmpeg): all 236 present, each once, named exactly as ordered,
  nothing extra; the words beside each on Chris's page match ours word for word. All MP3, one channel, 44.1 kHz,
  64 kbps. Loudness -18.9 to -16.7 LUFS (asked about -18); highest peak -1.1 dBFS (asked no higher than -1).
  Silence at the start at most 0.09 s; at the end, four files run 0.21 to 0.32 s (asked 0.2): not worth redoing.
  Each voice's pitch stays in its own range (no line in a wrong voice that pitch can show). Lengths against the
  estimates: the median line is 93% of its estimate; none looks cut short or padded. **Not checked: the words by ear**
  (no speech-to-text here) and the feeling of each reading. Ten lines are flagged for Chris to hear: Io's two soft
  lines (z1.io.05, z1.io.14: pitch far above her usual, may be thin), Kore's whispered "Since tonight" (z1.kore.09),
  three cued lines where a cue might have been spoken (z1.kore.07, z1.europa.01, z1.kore.01), z1.captain.28 and
  z1.tully.06 (pitch far above their usual), and z1.captain.12 and z1.captain.08 (said fast for his slow note). Two
  voices to compare with their notes: the Grey Hat (faster and higher than his note) and Old Wenna (higher than her
  note).
- `python3 tools/talk-check.py`: **ALL GOOD.** 236 lines, 2,758 words, about 18.5 minutes of speech. Every person has
  the brief's count. Longest line 18 words, average 11.7. No dashes, semicolons, trailing dots, digits, banned words or
  spell names. Only approved names are said (Io 18 times, Kore 5, Nettie 5, Old Wenna 5, Europa 2, Callisto, Odile,
  Hilde, Quill and Pell once each; places Bogmire, the Thornwood, Wickhollow); Kofi's name never. The words to say match
  the words shown on every line. Every person has something to say at every stage after the first talk, a first hello
  and (if ordinary) a call and one line pointing to one of the four by a place. Every story talk is in order, six lines
  at most, two of them a witch's at most. 14 delivery cues in 236 lines. All 24 approved lines are present.
- Every "you" read by eye: each means the four, or a witch named in the same line.
- The step 1 sample still checks ALL GOOD on its own.
- The reading page at a phone's width (390 px) in headless Chrome: 0 page errors, fetches nothing from outside, nothing
  wider than the screen, all 236 lines shown, the three tabs work. Looked at in screenshots.
- Not checked: the lines in real voices; the seconds (worked out at about 2.8 words a second, by each speaker's pace,
  so a guess until the recordings come back with real lengths); the read-aloud tap and the copy button on a real phone;
  how Eleven v4 takes each cue (looked up in ElevenLabs' own guides, not tried).

## Job's calls

- **"It's all good" is read as: no redos.** Every recording stays as it came back.
- **The step 1 page keeps its estimated seconds** (its old ids belong to other lines now), and `talk-check.py` uses the
  real lengths only for a zone's file.
- **Zone 1 is 2,758 words, about 18.5 minutes**, a little over the brief's guess of 2,600 words and 17 minutes. Two
  trimming passes took it down from 2,958 by shortening about seventy-five lines. Cutting further would cut the lines that work. As
  MP3 at 64 kbps that is about 8.7 MB, about 11.6 MB inside the one-file build. (If the size matters more, 48 kbps mono
  is still clear for speech and saves a quarter: ElevenLabs offers `mp3_24000_48`. The recording order asks for 64.)
- **The recording order asks for** Eleven v4; MP3, mono, 44.1 kHz, 64 kbps (`mp3_44100_64`); at most 0.2 s of silence
  at each end; every file normalised to about -18 LUFS, peaks at most -1 dBFS; one zip per speaker
  (`z1-<speaker>.zip`) with a list inside (`z1-<speaker>-list.csv`: file, seconds).
- **Hilde is said HIL-duh.** Her name was not in call 11's list; it is said once (by Nettie). Easy to change.
- **Halcyon's name is not said in zone 1.** Io and Nettie say "her" and "your sister". Her name waits for zone 3.
- **Io went off with the Faire seven years ago**, a year after her sister went north. In the approved ten lines.
- **Odile measures the lean in fingers' widths**: two at dusk, three when the captain has asked, four once the
  cottage is seen, and at the end "a finger less than at dusk".
- **Voices** (all in `cast.js`, all Chris's to change): the Faire is from everywhere (Odile French, Bashir Levantine,
  Zofia Polish, Linnet Welsh, Otto German, Corwin Yorkshire, Ros London, Tully Dutch, the chestnut roaster Ghanaian,
  Old Bridie west of Ireland, Jory Geordie, the Grey Hat a faint east-coast Scots); Wickhollow is soft West Country
  (Nettie, Mayor Gretch, Hilde, Quill, and a trace of it in Io); Bogmire is broad East Anglian fen country (Old Wenna,
  Tobb, Pell). Kore clear stage speech, Europa a slight Irish lilt, Callisto a faint accent like nobody else's.
  Mayor Gretch is cast as a man and Pell as a girl; the lines never say.
- **Where a line's condition is a stage range**, the hub's picker can use it as written. Lines that need two things at
  once (for example the Grey Hat's "flew dark once": stages 1 to 3 and some lamps home) say both.
- **The sample's ids changed** in zone 1 (they were provisional). `sample.js` is kept only as the record; nothing is
  recorded from it.

## What each person's lines invent about their own life

The full lists are in `game/talk/cast.js` (`invented`) and on the reading page under each person. In short: Odile's
finger gauge, her shutters, that she never sees a land's lamps lit, and that she sold the Grey Hat his lamps; the Grey
Hat's twenty years with the Faire and the night he flew dark; Nettie's seven summers of watering, the heartsease, "home
before the frost", the marigolds; Old Wenna's lamp taken off her sill and her bad handwriting; Bridie lighting the
cottage gate lamp every night it stood empty; Tobb's unlit candle; Pell waving at the great wraith; and one small thing
each for the rest. Io wrote Nettie letters she never sent; Callisto grew up where the dark lasted her whole life.

## Unfinished

- Chris's yes (or marks) on the zones 2 to 4 outline and calls 12 to 18. Then each zone's lines, when the hub asks.
- If a recorded line is ever redone, it goes back through ChatGPT with the same file name, and `tools/talk-voices.py`
  is run again.

## For the hub

1. **The talk box shows the person's name over every line** (`game/people/people.js`, `who.textContent = p.name`). A
   story talk with a witch's line in it needs the speaker per line: every line has its own `who`, and `COVEN_CAST`
   has each speaker's `name`.
2. **The coven's 46 lines are said at set moments, not by tapping Talk**: `when.moment` is one of opening, cottage,
   thornwood (the Thornwood's edge), fen (the first sight of Bogmire), before-wraith (at the fen's dark heart),
   after-wraith, leaving (the ship lifting). `COVEN_TALK_Z1.moments` gives each one's stage. Each needs something on
   the land that starts it, once.
3. **Story talks** (`talk: [id, n]`) are said in order as one talk: z1.captain.ask (his first talk), z1.captain.dark,
   z1.captain.sew (stage 4, all twelve lamps: Europa sews the flames, then he says "Get aboard"; the leaving follows),
   z1.nettie.hello, z1.nettie.heartsease, z1.odile.hello, z1.wenna.hello, z1.wenna.wraith (this one is "Old Wenna has
   told of the great wraith", the start of stage 3's pointing to the fen's dark heart).
4. **What a line can depend on**: `stage`, `first`, `lamps`, `moment`; and for Odile, the Grey Hat, Nettie and Old
   Wenna also `met` (a person's id), `just` ('won' or 'lost'), `look` ('green' or 'steady'). Every key a line has must
   be true; more keys means more particular, chosen first; a line is said once before any repeats; `kind: 'call'` lines
   are said as the coven walks past, not in a talk. The brief's green and steady are not defined in numbers: the
   file's comment suggests green for levels 1 to 2 and steady for 3 to 5.
5. **The sound is here**: `game/talk/audio/z1/<id>.mp3` (for example `z1.odile.03.mp3`), all 236, MP3 mono 64 kbps,
   8.5 MB; real lengths in `game/talk/recording/z1-lengths.csv` and in each line's `secs`. `people.js`'s `voice(id)`
   can look them up by id as it is. Whether to keep them as MP3 or re-encode (the battle music is AAC) is the hub's
   call; the file names should stay the ids.
6. **After the great wraith, the pale moth must be seen on the land**, not only in the fight: Kore says "Watch the
   moth" and Europa "It's flying west. Toward the moon". It flies west, toward the low moon, the opposite way to the
   lean.
7. **Small things the lines expect to see**: the gate lamp at Io's cottage, lit (Callisto, Bridie, Io at the leaving);
   Odile's lamp stall by the camp's well (two pointers say "by the well"); Old Wenna's stall by Bogmire's boardwalk.
8. **For `docs/decisions.md`**: Chris's yes of 09:25, as listed above.
9. So far the brief's shape (section 5) has not got in the way of a better line.
10. **Zones 2 to 4, for the hub's planning** (all proposals until Chris says yes): new people known by trade only (the
   roadwarden, the carter, the bramble-cutter, the last passenger, the pass-keeper, a held Warden); the Grey Hat
   waits at the foot of the frozen pass, lamps lit, because no flame stays lit in Misthollow; forty Wardens stand held
   in Misthollow's street (a few dolls with covered faces could play them) and walk home at the end; the game would
   end back at the Faire's camp by night, after one last flight (call 12). Calls 12 to 18 belong in
   `docs/questions.md` until he answers.
11. The board lists my files as `docs/lore/story-*.md`; the prompt said `story-*`. I keep three pages there as HTML
   (`story-sample.html`, `story-zone-1.html`, `story-voices.html`). Move them if you would rather.
