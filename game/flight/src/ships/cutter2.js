// The Cutter, made ready for the peaks (Coven of the Moon Faire, the journey job, November 24, 2026). Chris, 12:00:
// "the cutter for the last two zones with the same treatment". The same ship, one step finer, made from the Cutter's own
// recipe with the kit's own parts (no new code): A PROPOSAL, his to change.
// What can be seen: a second, smaller sunstone mount aft (more lift for thin air), five crystals in the main one;
// topsails on both masts; broader fins under her belly; two more brass straps. She flies as the Cutter does.
import cutter from './cutter.js';
export default {
  ...cutter, id: 'cutter2',
  bands: { sheer: cutter.bands.sheer, straps: [...cutter.bands.straps, [-3.2, 0.3], [1.1, 0.3]] },
  clusters: [{ z: -0.7, scale: 1 }, { z: -5.0, scale: 0.62 }],
  cluster: { ...cutter.cluster, crystals: 5 },
  masts: cutter.masts.map((m) => ({ ...m, height: m.height + 0.5, tiers: [m.tiers[0], { at: 0.83, span: m.tiers[0].span * 0.55, rise: 0.35, sweep: m.tiers[0].sweep * 0.6 }] })),
  fins: cutter.fins.map((f) => ({ ...f, span: f.span * 1.3 })),
};
