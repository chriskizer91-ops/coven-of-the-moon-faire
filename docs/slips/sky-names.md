# sky-names: names for the stars, the other planets and the band of crystal

Branch: job/sky-names      Last commit of the proposal: 841892c (this slip is committed after it)      Updated: 2026-11-24

A sub-agent of the hub's wrote this, from the hub's brief of November 24. A lore job: no game code, no build.

**Everything it proposes is a proposal.** Nothing is lore until Chris says yes.

## What it built

- `docs/lore/sky-names-proposal.md`: the proposal. For each thing: a first choice, two other choices, how it is said,
  why it follows from the lore, and the words for its card on the star map. Then every new fact the names bring, and
  the exact lines for the star map's data.
- A short page for Chris to read on his phone (the names, first choice only). It is outside the repo; the hub has it.
- This slip.

## The names, first choice only

| On the map now | Proposed | Said | The fair folk's name |
|---|---|---|---|
| The Twin Suns (the big gold one) | the Cresset | KRESS-it | |
| The Twin Suns (the small blue-white one) | the Taper | TAY-per | |
| The Far Star | the Vigil | VIJ-il | |
| Unnamed I | Brasa | BRAH-sah | the Fire-Eater |
| Unnamed II | Saffren | SAFF-ren | the Outrider |
| Unnamed IV | Pavane | pah-VAHN | the Hoop-Dancer |
| Unnamed V | Glaswen | GLASS-wen | the Straggler |
| Crystal Drift | the Amberwake | AM-ber-wake | (captains: "the Drift") |

Three small extras, each a yes or no by itself: the giant's ring is the Hoop; its rose storm is the Rosette; the four
wanderers together are the High Faire.

## A few numbers a person can check

- 4 sources searched. Stars or other planets already named in them: 0.
- 12 first-choice names: 3 stars, 4 planets, 4 fair names, 1 band. Two other choices for each of the 8 main ones.
- 7 lines of data, for the 7 entries of the star map marked as needing a name (the two suns share one entry).
- 11 new facts listed for Chris to say yes or no to.
- 2 first choices are marked "not sure" of being clear of other names (Pavane, the Straggler). 1 has a sound to
  watch (Cresset, near "crescent").

## What Chris said here

- Nothing. He was not in this conversation. His words of November 24 are quoted at the top of the proposal.

## What was copied in

- Nothing.

## What was checked, and how

- **Names already in use.** Searched for any name of a star, sun, planet, moon, season, calendar, god or sky-story:
  - `envoi-on-the-longest-night`: all 888 text and code files, by word search; the star map's two notes read in full.
  - `moon-faire`: its 283 notes and its world and people data, by word search; Chris's lore discussion notes read.
  - `airship-game-in-aethermoor-`: its notes read; its sky and progress code searched.
  - `aethermoor-m7-`: its 131 notes, its lore folder and its 90 data files, by word search.
  - This game's own story page, story brief and spoken lines for zones 1 to 4.
  - Found: no star and no other planet is named anywhere. What does exist is listed in the proposal, part 1.
- **The looks.** Each name was fitted to the star map as it stands on `origin/job/maps`
  (`game/maps/sky/thareia-system-star-map.html` and `game/maps/data/maps-data.js`), read and not touched: the colours,
  sizes, order and distances are in the proposal's table of numbers.
- **Clear of real and well-known names.** From what the writer knows, and one web search for each first choice. The
  result for each is in the proposal, part 5.
- **The recorded lines.** One line says "the sun" ("Herbs go pale when they miss the sun"). The proposal keeps
  "the sun" as plain talk for daylight, so no recording changes.
- **Private details.** The three files were searched for keys, email addresses, names of people outside the game and
  paths on anyone's computer: none.

Not checked:

- **Chris's own lore compendium.** The old Envoi's notes say it "may have" names for the stars and planets. It is in
  a repo that is not a source for this game, so it was not opened. This is the one place a name of his could be
  hiding.
- **The names on the map itself.** Nothing was built. Nobody has seen the longer label for the suns on a phone.
- **How the names sound in a recorded voice.** Only Chris can judge that.
- **The web pages behind the search results.** Only their titles were seen.

## What is rough

- The names lean on what each planet looks like on the map. Those looks were made up on November 17 and are Chris's
  to change. A changed look needs its name looked at again.
- Two names for each planet may be one too many. The proposal says how to keep only one kind.

## Calls this job made (each easy to turn the other way)

- **The stars get plain "the" names; the planets get proper names.** The other choice was proper names for the stars
  too. Reason: the sky's own names so far are plain (the Aether, the Thinning), and people already say "the sun".
- **Each planet gets a chart name and a fair folk's name.** The other choice was one name each.
- **The Cresset before the Hearth** for the gold sun. Reason: "the Hearth" would make Hearthstone Keep sound as if
  it were named after the sun, which reaches into Chris's other games.
- **The Vigil before the Old Ember** for the far star. Reason: it would sit too close to the Ember Line and the Ember
  Wardens.
- **The Crystal Drift is renamed, and "the Drift" kept as the captains' word.** The other choice was to leave it.
- **The fair name goes in the card's small `fact` line,** not over the name.

## Unfinished

- Nothing, until Chris answers.

## For the hub

- **Nothing is to go into the game until Chris has chosen.** Then the lines at the end of the proposal go into
  `game/maps/data/maps-data.js` (the maps job's file), under `sky.info`, in place of `suns`, `far`, `w1`, `w2`, `w4`,
  `drift` and `w5`. `standIn: true` comes off each name he approves. The comment at the top of that file ("STAND-INS,
  not settled: the three stars' names and the four other planets' names") then needs the same change.
- **`drift` had no `standIn` mark** in the maps job's data, though its name was Claude's, not Chris's. The proposed
  line adds one.
- **The moon.** `maps-data.js` still marks `Auros` as a stand-in and says its spelling is open. `docs/decisions.md`
  (November 18) says "The moon's name is Auros" stands. That mark and those two comments can go. Not changed here.
- **The suns' label** is 25 letters where it was 13. Look at it on an upright phone (412 by 880) before sending a
  build. The fallback is in the proposal.
- **`docs/lore/README.md`** could list `sky-names-proposal.md` as a proposal, beside the story brief.
- **If Chris approves,** `docs/decisions.md` wants the names with the date, and how each is said.

## For Chris

- Yes, or which to change: each star, each planet, the band.
- One name for each planet, or two (a chart name and a fair folk's name)?
- Did you already name any of these in your lore compendium? If so, yours win.
- The eleven small facts in the proposal's part 4: yes or no to each.
- The three extras (the Hoop, the Rosette, the High Faire), and the three ideas left out (a month from the suns, the
  Vigil's long round, the Ember Line's name): only if you want them.
