// peak-moves.mjs: the two peak creatures' moves (game/battle/models/m7/moves/stoat.js, ox.js, which are page scripts)
// as a module, for Aethermoor M7's stretch check:  node kit/tools/stretch.mjs foes/<key> --moves=<this file>#stoat
// The moves folder is found beside this file in the repo, or where COVEN_MOVES says.
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
const DIR = process.env.COVEN_MOVES || fileURLToPath(new URL('../../moves/', import.meta.url));
const sets = {};
const window = { M7: { addMoves: (n, s) => { sets[n] = s; } } };
for (const f of ['stoat.js', 'ox.js']) new Function('window', fs.readFileSync(DIR + '/' + f, 'utf8'))(window);
export const stoat = sets.stoat, ox = sets.ox;
