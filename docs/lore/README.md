# The lore

**Status: nothing here is final.** Lore is final only when Chris says so. This folder starts almost empty on purpose:
the two old games each have their own lore, they disagree in places, and Chris has not yet chosen between them.

## Which source wins

1. Chris's newest word, as written in `docs/decisions.md`.
2. His older decisions in the two old repos' notes (listed below).
3. Proposals written by Claude. These are ideas, not lore, until he approves them.

Where the two old games disagree, neither wins by default. The disagreements are listed below and are asked in
`docs/questions.md`.

## What is settled (Chris's own words, both games agree or only one has spoken)

- The world is Thareia. Aethermoor is one of its continents. Its moon goes round it once every 500 years.
- The Moon Faire is a normal fair that follows the moon round the planet: a meeting of many cultures and kinds of
  knowledge.
- The coven is four separate witches who work together: Io the Herbal Witch, Kore the Jester, Europa the Fox and
  Callisto the Ranger. The names point to real-world myth; Thareia has no moons by those names.
- Their kinds of power: Callisto is the moment, Io is healing, Europa is chaos and the fabric of reality, Kore is the
  duality of life and death, and infinity. Strongest magic first: Kore, Europa, Io, Callisto.
- Moon phases are not part of their magic.
- Io and Kore are very close friends, not sisters.
- Space is the aether, not a vacuum. Travel between worlds runs on aether crystal, which is the same amber stone as
  the airships' sunstone. The moon's people are the wealthiest.
- The airship captain, the Grey Hat (maybe "Noiz"), is a friend of the Moon Faire.
- This game is an alternate universe to the first *Envoi on the Longest Night* and does not have to agree with it.
  The first Envoi's retired lore stays out: the Drowned Mother, Old Snuff, the mandrakes, Mother's Hollow.

## Where the two games disagree (open)

| What | Moon Faire says | The new Envoi says | Asked in |
|---|---|---|---|
| Where and when | Another continent, in a different time, because the moon must be overhead | Aethermoor | `questions.md` 1 |
| The final fire | A cold beacon on a crag | It stands at Misthollow's dead Moonwell, where Noctara stood | `questions.md` 6 |
| The moon's name | Auros | The star map and Envoi's November 17 notes write "Aurous"; its lore drafts write "Auros" | `questions.md` 7 |
| Wisps and wraiths | Flames gone cold | Souls going hollow | `questions.md` 1 |
| Who is in the party | All four from the start, with a shared past | Io and Kore only, meeting on the first night | `questions.md` 3 |
| Who the player walks as | The Jester | Io | `questions.md` 8 |

## Where the lore texts are (in the old repos, not copied here)

Nothing is copied until Chris has answered the questions, so that no unapproved text looks settled.

In `moon-faire`, `docs/project-notes/`:

- `lore/discussion-notes.md`: Chris's words on the world, the Faire, each witch and the captain.
- `lore/README.md`: what he has already changed, and which source wins there.
- `lore/combat-balance.md`: the combat system he approved for the party of four.
- `claude/coven-names-io-kore-europa-callisto.md`: the four names and their myths.
- `claude/final-boss-the-fire-that-would-not-end.md`: the final boss.
- `game/world/world.json` (in the game folder): the story "The fire that would not end", four acts and 45 happenings,
  written as data. None of it plays yet.

In `envoi-on-the-longest-night`, `docs/project-notes/claude/lore/`:

- `io-and-kore.md`: a draft written with Chris. Who Io and Kore are, what every move means, how they meet. Several
  lines are marked Open.
- `coven-names.md`: the four names and their myths.
- `envoi-at-moonset-story.md`: **a proposal by Claude, not approved.** One story that would answer the open questions:
  the Faire is the last thing a land sees before its moon sets, and the fire is a light that will not let go.

## How lore gets written here

- A lore job writes drafts on its own branch and its slip. The hub brings approved text into this folder.
- Every file here says at its top whether it is **approved by Chris** or **a proposal**.
- Names and lines the player reads go in data files in the game, so they can change without touching code.
