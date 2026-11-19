// sample.js (talk): the story job's sample of zone 1's spoken lines, for Chris's yes (Coven of the Moon Faire,
// November 19, 2026). A PROPOSAL, not approved: nothing here is recorded until Chris says yes.
// It is in the shape game/talk/zone-1.js will have, so the hub can see it early. The ids are provisional: they are
// renumbered in step 2, when every line of zone 1 is written. Each id will also be its sound file's name.
//
// A line:
//   id      its id, and its sound file's name (z1.odile.01 -> z1.odile.01.mp3)
//   who     the speaker's id
//   text    the words shown on the screen
//   say     the same words, with any delivery cues in [square brackets], for the voice
//   tone    a plain note of the tone and inflection to say it in
//   kind    hello, stage, pointer, call, story or coven
//   when    when it can be said: stage [from, to] (0 dusk, 1 asked, 2 home, 3 fen, 4 after); first (the first talk
//           with that person, or a later one); lamps [from, to] home; moment (a coven line's set moment)
//   talk    for a story or coven talk: which talk, and this line's place in it
//   rests   which of Chris's calls (story-page.md) the line rests on, if any
// The seconds are worked out by tools/talk-check.py from the words.
window.COVEN_TALK_SAMPLE = {
  zone: 'z1',
  voices: {
    odile: { name: 'Odile, the lamp-seller', note: 'A woman of about sixty-five. A light French accent worn soft by years on the road. Low-middle pitch, even and unhurried, a little husky. Dry, precise, fond.', audition: 'Hold it still. There. See how it sits? That’s a good wick.' },
    tully: { name: 'Tully, the gate keeper', note: 'A woman in her fifties. Flat, careful Northern English. Low pitch, slow, sparing. Every word counted out like a coin. Warmth arrives late and small.', audition: 'Name. Coin. In you go. Next.' },
    captain: { name: 'The Grey Hat', note: 'A man of about forty-five. Low and a little weathered, a faint east-coast Scots burr. Slow, clipped, deadpan. Says less than he means.', audition: 'Rope’s wet. Sky’s clear. Nobody touches the wheel but me.' },
    nettie: { name: 'Nettie, the herb-seller', note: 'A woman of about sixty. Soft West Country English (all of Wickhollow sounds like this). Middle pitch, quick and warm. A scold that melts.', audition: 'Mint for your belly, sage for your throat, and a talking-to for free.' },
    io: { name: 'Io, the Herbal Witch', note: 'A woman of about thirty. Warm, low-middle, gentle and unhurried, with a faint trace of Wickhollow under years of travel. Soft, with steel under it.', audition: 'Hold still. This will sting, and then it won’t.' },
    kore: { name: 'Kore, the Jester', note: 'A woman of about thirty. Bright and quick, a trained stage voice that can drop to a hush. Laughter always close under the words.', audition: 'Everyone laughs at the fool. That’s how she gets close enough to tell the truth.' },
    europa: { name: 'Europa, the Fox', note: 'A woman in her late twenties. Light, quick and playful, middle-high, a smile in it. A slight Irish lilt.', audition: 'Snip, there. Oh, don’t sulk. It’s a better shape now.' },
    callisto: { name: 'Callisto, the Ranger', note: 'A woman in her mid twenties. Low, calm and measured. Few words, each one meant. A faint accent like nobody else in the game.', audition: 'Wait. There. Now.' },
  },
  lines: [
    // ---- the opening: the game begins in the camp, the twelve lamps have just flown ----
    { id: 'z1.callisto.01', who: 'callisto', kind: 'coven', when: { moment: 'opening' }, talk: ['z1.opening', 1],
      text: 'Every flame in the camp is leaning north-east.',
      say: 'Every flame in the camp is leaning north-east.',
      tone: 'Quiet and exact. The first to see it. Not alarmed, just sure.' },
    { id: 'z1.kore.01', who: 'kore', kind: 'coven', when: { moment: 'opening' }, talk: ['z1.opening', 2],
      text: 'Twelve lamps leaving all at once. Someone’s putting on a better show than ours.',
      say: '[laughs] Twelve lamps leaving all at once. Someone’s putting on a better show than ours.',
      tone: 'Delighted, a performer admiring a rival act. The laugh comes first and is real. Under it, a flicker she covers.' },

    // ---- Odile, the lamp-seller, in the camp ----
    { id: 'z1.odile.01', who: 'odile', kind: 'hello', when: { first: true },
      text: 'Don’t look at me. Look at my flames.',
      say: 'Don’t look at me. Look at my flames.',
      tone: 'Calm, dry, a little stern. She means it kindly, and she is not joking.' },
    { id: 'z1.odile.02', who: 'odile', kind: 'stage', when: { stage: [0, 1], first: false },
      text: 'The cold lights? Flames that leaned too far, I’d guess, and never stood back up.',
      say: 'The cold lights? Flames that leaned too far, I’d guess, and never stood back up.',
      tone: 'Thoughtful, half to herself. A trade secret, offered as a guess.' },
    { id: 'z1.odile.03', who: 'odile', kind: 'stage', when: { stage: [2, 3] },
      text: 'I’ve put the shutters up. I won’t sell a lamp I can’t promise will stay.',
      say: 'I’ve put the shutters up. I won’t sell a lamp I can’t promise will stay.',
      tone: 'Plain and proud, a little ashamed of the shutters. The last word firm.' },
    { id: 'z1.odile.04', who: 'odile', kind: 'stage', when: { stage: [4, 4] },
      text: 'They lean a finger less than at dusk. The shutters can come down.',
      say: 'They lean a finger less than at dusk. The shutters can come down.',
      tone: 'Dry, quietly pleased. She will not make more of it than that.' },

    // ---- Tully, the gate keeper: one ordinary person's full six ----
    { id: 'z1.tully.01', who: 'tully', kind: 'hello', when: { first: true },
      text: 'I count everything through this gate. Tonight, something went out that never came in.',
      say: 'I count everything through this gate. Tonight, something went out that never came in.',
      tone: 'Flat, careful, slow. Unsettled, and hiding it. The last three words matter most.' },
    { id: 'z1.tully.02', who: 'tully', kind: 'stage', when: { stage: [0, 1], first: false },
      text: 'Every cold light leaves by the same road. At my gate, that means the show’s over.',
      say: 'Every cold light leaves by the same road. At my gate, that means the show’s over.',
      tone: 'Dry and certain, someone who has watched a thousand crowds go home. Held as a guess, not news.' },
    { id: 'z1.tully.03', who: 'tully', kind: 'pointer', when: { stage: [0, 0], first: false },
      text: 'The lamps were the captain’s. He’s at the jetty, past the town, on the lake.',
      say: 'The lamps were the captain’s. He’s at the jetty, past the town, on the lake.',
      tone: 'Brisk directions, a little put out about the lamps. Clear on the place.' },
    { id: 'z1.tully.04', who: 'tully', kind: 'stage', when: { stage: [2, 3] },
      text: 'I’ve kept the gate open past closing. For you four. Don’t tell the watchman.',
      say: 'I’ve kept the gate open past closing. For you four. Don’t tell the watchman.',
      tone: 'Gruff and a little embarrassed. The warmth is in the small stop before “for you four”.' },
    { id: 'z1.tully.05', who: 'tully', kind: 'stage', when: { stage: [4, 4] },
      text: 'Out and back, every time. I’ve stopped counting you four. Nearly.',
      say: 'Out and back, every time. I’ve stopped counting you four. Nearly.',
      tone: 'The thaw. Dry, almost fond. A small stop before “nearly”, which is a joke.' },
    { id: 'z1.tully.06', who: 'tully', kind: 'call', when: {},
      text: 'Four out. Bring back four.',
      say: 'Four out. Bring back four.',
      tone: 'Called after them as they pass the gate. Short and plain. Not quite a blessing.' },

    // ---- the Grey Hat, at the jetty ----
    { id: 'z1.captain.01', who: 'captain', kind: 'hello', when: { first: true }, talk: ['z1.captain.ask', 1],
      text: 'You’ll be the Faire’s four. Good. I’ve lost my whole crew.',
      say: 'You’ll be the Faire’s four. Good. I’ve lost my whole crew.',
      tone: 'Flat and clipped, deadpan. Let “crew” land and hang there.' },
    { id: 'z1.captain.02', who: 'captain', kind: 'story', when: { first: true }, talk: ['z1.captain.ask', 2],
      text: 'Twelve lamps, torn from their hooks. Bring them home. I don’t lift dark.',
      say: 'Twelve lamps, torn from their hooks. Bring them home. I don’t lift dark.',
      tone: 'Short and firm, no pleading. The last three words are a rule he has kept all his life.' },
    { id: 'z1.captain.03', who: 'captain', kind: 'stage', when: { stage: [1, 3], lamps: [1, 11], first: false },
      text: 'I flew dark once. Young, and sure of myself. Once.',
      say: '[quietly] I flew dark once. Young, and sure of myself. Once.',
      tone: 'Very quiet, no self-pity. A long breath before the last word, which is the whole story.' },
    { id: 'z1.europa.01', who: 'europa', kind: 'story', when: { stage: [4, 4], lamps: [12, 12] }, talk: ['z1.captain.sew', 1],
      text: 'All twelve, sewn down in blue. Lean all you like, little ones. You’re staying.',
      say: '[playfully] All twelve, sewn down in blue. Lean all you like, little ones. You’re staying.',
      tone: 'Light and quick, teasing the flames as if they were kittens. Pleased with her work.' },
    { id: 'z1.captain.04', who: 'captain', kind: 'story', when: { stage: [4, 4], lamps: [12, 12] }, talk: ['z1.captain.sew', 2],
      text: 'Any sailor with sense would fly the other way. Get aboard.',
      say: 'Any sailor with sense would fly the other way. Get aboard.',
      tone: 'Gruff and decided. A smile he will not let anyone see.' },

    // ---- Nettie, the herb-seller, in Wickhollow ----
    { id: 'z1.nettie.01', who: 'nettie', kind: 'hello', when: { first: true },
      text: 'Io. Seven summers I’ve watered your garden, and not one letter.',
      say: 'Io. Seven summers I’ve watered your garden, and not one letter.',
      tone: 'A fond scold that does not hold. Glad to see her, and cross about being glad.' },
    { id: 'z1.nettie.02', who: 'nettie', kind: 'story', when: { stage: [1, 3], first: false }, rests: [2],
      text: 'The morning your sister went north, Io, she bought heartsease off me. She said it was for you.',
      say: 'The morning your sister went north, Io, she bought heartsease off me. [gently] She said it was for you.',
      tone: 'Gentle and careful, telling something she has kept a long time. Slower at the end.' },
    { id: 'z1.nettie.03', who: 'nettie', kind: 'pointer', when: { stage: [2, 3] },
      text: 'If anyone’s still in Bogmire, it’s Old Wenna. Past the Thornwood, out in the fen.',
      say: 'If anyone’s still in Bogmire, it’s Old Wenna. Past the Thornwood, out in the fen.',
      tone: 'Practical, a little worried. Directions given like a recipe.' },
    { id: 'z1.nettie.04', who: 'nettie', kind: 'stage', when: { stage: [4, 4] },
      text: 'Go on with the Faire, Io. I’ll keep the garden. Gardens wait better than people.',
      say: 'Go on with the Faire, Io. I’ll keep the garden. Gardens wait better than people.',
      tone: 'Warm, letting her go. A small smile on the last line, so it does not break.' },

    // ---- the coven at set moments ----
    { id: 'z1.io.01', who: 'io', kind: 'coven', when: { moment: 'cottage' }, rests: [2],
      text: 'Her boots are still by the door.',
      say: '[softly] Her boots are still by the door.',
      tone: 'Almost a whisper. She did not expect it to hurt. Keep it small.' },
    { id: 'z1.io.02', who: 'io', kind: 'coven', when: { moment: 'after-wraith' }, talk: ['z1.after-wraith', 1],
      text: 'Look, Kore. Every lamp in Bogmire, going home.',
      say: 'Look, Kore. Every lamp in Bogmire, going home.',
      tone: 'Relief, counting them in. A little out of breath, the fight just over.' },
    { id: 'z1.kore.02', who: 'kore', kind: 'coven', when: { moment: 'after-wraith' }, talk: ['z1.after-wraith', 2],
      text: 'Never mind the lamps, Io. Watch the moth.',
      say: '[softly] Never mind the lamps, Io. Watch the moth.',
      tone: 'Soft and rapt, the only still moment she has. Not a rebuke. An invitation.' },
  ],
};
