// The Skiff, fitted out (Coven of the Moon Faire, the journey job, November 24, 2026). Chris, 12:00: "the skiff for the
// first two zones ... differentiated by changing the skiff model to look slightly upgraded". The same ship, one step
// finer, made from the Skiff's own recipe with the kit's own parts (no new code): A PROPOSAL, his to change.
// What can be seen: a short brass-banded bowsprit; a small topsail over the main wing sail; two more brass straps
// round her hull; a fourth sunstone crystal in her mount. She flies as the Skiff does (her stats are the Skiff's).
import skiff from './skiff.js';
export default {
  ...skiff, id: 'skiff2',
  bands: { sheer: skiff.bands.sheer, straps: [...skiff.bands.straps, [-1.2, 0.24], [0.9, 0.24]] },
  bowsprit: { from: [0, 0.45, 3.0], to: [0, 1.05, 5.0], r: 0.075 },
  cluster: { ...skiff.cluster, crystals: 4 },
  masts: [{ ...skiff.masts[0], height: 4.1, tiers: [skiff.masts[0].tiers[0], { at: 0.84, span: 1.7, rise: 0.25, sweep: 0.22 }] }],
};
