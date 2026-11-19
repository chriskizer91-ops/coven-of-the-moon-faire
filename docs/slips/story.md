# story: the story's dialogue, written to be spoken aloud

Branch: job/story      Last commit: (see the branch)      Updated: November 19, 2026, morning

## What it built

Step 1 (the story page and a sample, for Chris's yes). **Stopped here for Chris.**

- `docs/lore/story-page.md`: the story page, a proposal. The story in ten lines (the brief's, with six changes, each
  with its reason), each witch's thread, the four people the story is told through, Chris's calls with a pick for
  each (the brief's nine and two new ones), the fair folk's names, and where the old games' lore fights with this.
- `game/talk/sample.js`: 24 sample lines, in the shape `game/talk/zone-1.js` will have. Odile 4, Tully's full six,
  the Grey Hat 4, Nettie 4, Io 2, Kore 2, Europa 1, Callisto 1. Also a first casting note for these eight voices.
- `docs/lore/story-sample.html`: **the page for Chris** (open on a phone). The story page and the sample together.
  Tapping a line asks the phone's own voice to read it, only to hear its length.
- `docs/lore/story-sample.md`: the sample as plain text, made from `sample.js`.
- `tools/talk-check.py`: the line checks (step 2 grows it). `tools/talk-page.py`: makes the page.

## What Chris said here

- November 19, 08:42: go (start step 1). No lore decisions yet.

## What was copied in

- Nothing.

## What was checked, and how

- `python3 tools/talk-check.py`: ALL GOOD. 24 lines, 289 words, about 2.0 minutes of speech. Longest line 18 words,
  average 12. No dashes, semicolons, trailing dots, digits, banned words or spell names. Every name said is approved
  (Io, Kore, Old Wenna; places Bogmire, the Thornwood). The words to say match the words shown on every line. Every
  "you" read by eye: each means the four, or a witch named in the same line (Europa's means the flames). No line
  shares more than an ordinary phrase with the old games' 1,498 lines (checked four words at a time).
- The page at a phone's width (390 px) in headless Chrome: 0 page errors, fetches nothing from outside, nothing wider
  than the screen. Looked at in screenshots.
- Not checked: the lines in real voices; the seconds (worked out at about 2.8 words a second, so a guess); the
  read-aloud tap on a real phone; how ElevenLabs reads the cues (looked up in its own guides: Eleven v4, the
  recommended model since September 28, 2026, takes cues in square brackets placed just before the words they change,
  and follows them better than v3; not tried).

## Job's calls

- **Io went off with the Faire seven years ago**, a year after her sister went north (so Nettie has a number to say).
  In the ten lines, marked.
- **Tully is cast as a woman.** The lines never say, but a voice must be one, and the body the game uses (Moon Faire's
  painted gate keeper) is a woman's.
- **Odile measures the lean in fingers' widths**, as a running gauge across the stages.
- **Coven lines carry `when.moment`** (opening, cottage, after-wraith, and in step 2 the Thornwood's edge, the first
  sight of the fen, before the wraith, the leaving), since they are not talks with a person.
- **The sample's ids are provisional** (`z1.odile.01` and so on). They are renumbered in step 2. Nothing is recorded
  before then.
- **A first casting note for the eight speakers in the sample**, so Chris can hear the lines in his head. The full
  notes for every speaker come in step 2.
- **The page's copy is kept on the branch** as `docs/lore/story-sample.html` (inside the `story-` files I may write).

## What each person's sample lines invent about their own life

- Odile: she reads the lean in fingers' widths; she puts her shutters up rather than sell a lamp she cannot promise.
- Tully: keeps the gate open past closing for the coven, and would rather the watchman did not know.
- The Grey Hat: flew dark once, when he was young.
- Nettie: has watered Io's garden for seven summers; sold Io's sister heartsease the morning she went north (rests on
  call 2).
- Io: her sister's boots are still by the cottage door (rests on call 2).

## Unfinished

- Step 2 (all 236 lines of zone 1, the cast, the reading page, the recording order) waits for Chris's yes.
- Step 3 (his notes, then the outline for zones 2 to 4).

## For the hub

1. **The talk box shows the person's name over every line** (`game/people/people.js`, `who.textContent = p.name`). A
   story talk with a witch's line in it needs the speaker per line. Every line in `sample.js` has its own `who`.
2. **The coven's lines are said at set moments, not by tapping Talk.** Each moment needs something that starts it: the
   opening, the cottage, the Thornwood's edge, the first sight of the fen, before and after the great wraith, the
   leaving. The sample uses `when.moment` for this.
3. **After the great wraith, the pale moth must be seen on the land**, not only in the fight: Kore's line is "Watch
   the moth." If Chris says yes to call 9, it flies toward the low moon in the west, the opposite way to the lean.
4. **Europa sews the twelve flames at the jetty** (a story talk, after the great wraith, all twelve lamps home). It is
   why the Grey Hat can fly on while the flames still lean.
5. **What a line can depend on**, as the sample uses it: `stage`, `first`, `lamps`, `moment`. The four people with
   many lines may also use the extras the brief allows; none of the sample's do. `lines(person, n)` in
   `people.js` will need the stage and the lamps home to choose.
6. **For `docs/questions.md`** (if Chris does not answer them here): call 10, what becomes of Halcyon; call 11, how
   the names are said aloud; that Kofi and Kore sound alike spoken; and Tully's voice.
7. So far the brief's shape (section 5) has not got in the way of a better line.
