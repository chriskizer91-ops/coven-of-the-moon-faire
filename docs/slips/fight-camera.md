# fight-camera: close-ups that cut in, shots that fit a giant, ground with no edge

Branch: `job/fight-camera` (made from `main` at ffadd76)      Updated: November 25, 2026

## Report for the hub

(Being written. The running log below says where the work stands.)

## Running log

- 15:30 Read the brief, the rules, the two slips, Chris's two photographs, and the director in `game/battle/screen.js`.
- 15:45 Built `fights-lab.html`. Took "before" pictures of the Great bramble at 1600x750: in the resting shot a witch is
  79 to 83 px tall, and the ground is an island in the dark, as in his photographs.
- 16:00 First pass written (`screen.js`): the director's beat (close-up, blow, back out), the shot kinds, the giant's
  framing, live ground all round, a sky dome, numbers that keep apart, the test hooks. `tools/fight-camera-look.py` (new)
  takes stills of each shot. First stills at 1600x750: a witch 220 to 288 px in the resting shot, no island.
- 16:20 `tools/battle-frame-test.py` extended (`--shots`). The shared lock is busy: each run waits a long while.
