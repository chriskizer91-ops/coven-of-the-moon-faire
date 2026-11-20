# story: the story's dialogue, written to be spoken aloud

Branch: job/story      Last commit: (see the branch)      Updated: November 20, 2026, afternoon (zone 2 recorded and approved)

## What it built

**Every spoken line of the game is written: zone 1 (236, recorded and approved), and zones 2 to 4 (120, 124 and 144,
from the outline Chris approved at 19:13, with the ending at the Faire). Zones 2 to 4 have their recording orders for
ChatGPT. Zone 2's recordings came back on November 20, are checked, approved by Chris, and on the branch; zones 3 and 4 are being
recorded.**

- `game/talk/audio/z2/`: **zone 2's 120 recordings**, taken byte for byte from the listening page Chris sent (3.8 MB).
  `game/talk/recording/z2-lengths.csv` has each one's real length, and every line's `secs` in `zone-2.js` is now that
  length (7 minutes 36 seconds in all). `docs/lore/story-voices-z2.html` is the page for Chris: what passed, three lines
  worth his ear and three new voices to hear. `tools/talk-voices.py` now checks any zone (`python3 tools/talk-voices.py
  2`), and for a returning voice measures its earlier zone too. Zone 2's recording order was left as handed over.

- `game/talk/zone-2.js` (`COVEN_TALK_Z2`, the Warm Roads and Dawnroost), `zone-3.js` (`COVEN_TALK_Z3`, the northern
  wilds and the shipyard), `zone-4.js` (`COVEN_TALK_Z4`, the frozen pass, Misthollow and the dead Moonwell, and the
  ending at the Faire): **388 lines**, zone 1's shape. Each file also carries its title, its stages with a line of help
  each, its moments with plain names, its people with many lines (`bold`) and how its people group by place.
- `game/talk/cast.js`: **40 speakers** now. The 17 new ones each have a voice note and their invented facts; the
  returning ones have their zones 2 to 4 facts added, each marked with its zone.
- `game/talk/recording/z2-`, `z3-` and `z4-recording-order.txt` and `.csv`: the recording orders. Voices recorded for
  an earlier zone are marked RETURNING ("use the same voice as before", with the zip it was in); new voices have their
  casting note and audition line. Each order lists only the names its lines say, with IPA.
- `docs/lore/story-zone-2.html`, `-3.html`, `-4.html`: the reading pages, as zone 1's.
- `tools/talk-reading.py` now makes any zone's page and order (`python3 tools/talk-reading.py 3`). `tools/talk-check.py`
  knows each zone's counts and new keys. Zone 1's page and order were not remade, so they stay exactly as handed over.

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

- November 20, 13:47, after the zone 2 voices page: **"Those are all good."** Zone 2's flagged lines and its three new voices are approved; no redos.
- November 20, 08:10: "Here is zone 2 and I am starting zone 3 now" (the zone 2 listening page, made by ChatGPT).
- **November 19, 19:13**, after ChatGPT asked for zone 2's order: **"Yes to all seven"** (calls 12 to 18, each as
  picked: 12 the game ends at the Faire's camp; 13 Kore is offered her bow and says "Not yet"; 14 forty Wardens are
  held in Misthollow and walk home; 15 the knight says only "Go home", and the shipmaster names her; 16 the new people
  are known by trade only; 17 the Grey Hat cannot fly to Misthollow, and flies dark under the stars at the end; 18
  what the brambles are is never said) and **"Go straight on"**: write zone 2 and send its order first, then zones 3
  and 4 in the same session.
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

- **Zone 2's recordings** (`python3 tools/talk-voices.py 2`): all 120 present, each once, named right, nothing extra;
  the words on Chris's page match the newest zone 2 text word for word (the four lines changed on November 19
  included). All MP3, one channel, 44.1 kHz, 64 to 67 kbps. Loudness -18.7 to -17.1 LUFS; highest peak -1.2 dBFS.
  Silence at the start at most 0.06 s; six files end with 0.21 to 0.33 s (asked 0.2): not worth redoing. The five
  returning voices sit within about 6% of their zone 1 pitch. Lengths 7.6 minutes against an estimate of 8.1. **Not
  checked: the words by ear.** Flagged for Chris: z2.kore.01 (laugh cue, 60% longer than expected), z2.europa.06
  (Europa is slower all through zone 2), z2.marta.21 (a shout, far above her usual pitch); and three new voices
  against their notes: Marta, the roadwarden (quick for his slow note), Tamsin (low for a child).
- **Zones 2 to 4** (`python3 tools/talk-check.py game/talk/zone-<n>.js`): **ALL GOOD** for each, and zone 1 still ALL
  GOOD. Every person has the outline's count. Longest lines 18, 19 and 17 words; averages 10.0, 10.3, 9.8. Only
  approved names said; Kofi's never. Every ordinary person has a hello, a call, something at every stage, and a pointer
  to one of the zone's people with many lines by a place. Every talk six lines at most. 3, 1 and 4 delivery cues.
  About 8.1, 8.5 and 9.7 minutes (estimates), 3,887 words; with zone 1, about 44 minutes for the game.
- **Against the old games**: every line's runs of four and five words searched in the old repos' story notes, scripts
  and line files. Seven lines that shared a phrase were reworded (three of them after zones 2 and 3 were first sent:
  z2.roadwarden.03, z3.passenger.06, z3.kore.01). Kept on purpose: "Little Io" and "She has no ending" come from the
  new Envoi's story notes, and the outline Chris approved names them.
- Read through all three zones in one sitting for one hand: repeated phrases counted (the town refrains, "by the
  window", "at the bottom of the street", are on purpose). Three zone 2 lines about the letters were made clearer
  (z2.callisto.09, z2.io.12, z2.kore.11: "it" became "them", the letters).
- The three reading pages at 390 px in headless Chrome: 0 page errors, nothing wider than the screen, every line shown.
  The by-stage tab now keeps a set moment's lines together in the order spoken, whoever says them.
- Not checked: the lines in real voices; the seconds (estimates until the recordings come back).
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

- **Zones 2 to 4, in short** (all proposals by the story job, Chris's to change): the roadwarden's three dark road
  stones (the game counts them as `nodes`, 0 to 3); Marta's forty beds and the end bed by the window; Io's letters fold
  into wings for the first time after Dawnroost's node; the shipmaster refuses to talk about the north until the four
  have been, then says "Halcyon", one word; the last passenger gives her ticket away; the knight's two "Go home"s; at
  the foot of the pass the Grey Hat lights a spare lamp because Io says five will come down, and says "Good thing I lit
  the spare" when they do; Misthollow is always morning and nobody has cried in eight years; on the stair the letter is
  handed over, and the fire's light leaves Halcyon ("It's cold. Why is it so cold?"); at the end Io's "Go home" echoes
  the knight's; Io offers to let Kore go, and Kore stays ("I want to see what Io does next"); Callisto tells Halcyon
  the dark is a season; the Grey Hat puts out all twelve lamps and flies dark by choice; the game's last word is Io's
  "Yes".
- **The Faire ending is a walk, not one long scene**: each Faire person's talk (`z4.faire.<who>`) plays when the coven
  reaches them, and `z4.faire.farewell` plays last.
- **New names' sounds** (in the orders, all guesses): Marta MAR-tuh, Brann BRAN, Tamsin TAM-zin, Dawnroost DAWN-roost,
  Ysmera iz-MEER-ah, Gil with a hard g, Tock, Pim, Eldergrove EL-der-grove, Misthollow MIST-hollow, Moonwell, Sorrel
  SORR-ul, Ede EED; and from zone 1's people, Tully TULL-ee, Linnet LIN-it.
- **Ysmera gives no moon-glass in a line.** The outline mentioned one as a gift; the lines leave it to the game.
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

- Chris's read of zones 2 to 4 (any word can change before it is recorded).
- Zones 3 and 4's recordings. When each comes back: take the files out of the page, run `tools/talk-voices.py <n>` (it
  needs its lines worth a listen written in, as zone 2's are), then `tools/talk-check.py game/talk/zone-<n>.js
  --fill`.
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
5. **The sound is here** (zone 2's the same way, in `game/talk/audio/z2/`): `game/talk/audio/z1/<id>.mp3` (for example `z1.odile.03.mp3`), all 236, MP3 mono 64 kbps,
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
12. **Zones 2 to 4 for the game** (the shape is zone 1's; what is new):
   - `when.nodes` [from, to] in zone 2: how many of the three dark road stones are lit again.
   - Moments `flight` and `flight-after` (zones 2 and 3) and `flight` (zone 4): raiders on the flight in.
   - Zone 4's `special`: the held Warden says nothing until the fire ends (her two lines are stage 4 only).
   - Zone 4's `faire` moment: one talk per person (`z4.faire.<who>`), each played when the coven reaches them;
     `z4.faire.farewell` last. The game ends on its last line, Io's "Yes".
   - The people with many lines are, per zone: the roadwarden, Marta and the Grey Hat (zone 2); the shipmaster and the
     Grey Hat (zone 3); the watchwoman, the Grey Hat and Halcyon (zone 4).
13. **Small things the lines expect to see**, zones 2 to 4: the three road stones (by the bridge, in the standing
   stones to the west, up on the rise); the Wardens' hall with forty made beds and the end one by the window; the
   living node up the hill behind the hall; Io's letters folding into wings; the shipmaster's tall house with a glass
   roof; Tock's scaffolds on the slip; brambles taller than a person; Eldergrove's leaves turning when Io speaks; the
   pass-keeper's hut and stove; the watchwoman at the bottom of Misthollow's one street, by a dead lamp; forty Wardens
   standing still with badly mended cloaks; the Moonwell's stair; moths in their thousands; the stars; the Grey Hat's
   lamps going out; Wickhollow and the camp lit up; the cottage gate lamp lit.
14. **For `docs/decisions.md`**: Chris's yes of 19:13 to calls 12 to 18, and "go straight on".
