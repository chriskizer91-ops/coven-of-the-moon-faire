// art.js: the pictures the 3D map of Aethermoor reads (Coven of the Moon Faire, the maps job, November 23, 2026).
// The two data pictures of the land are the ones the game's zones already read (game/art/world/): one copy, two readers.
// The four others came in with the map from the old Envoi (game/maps/world/art/; their lines are in assets/INDEX.csv).
// tools/build.py puts each picture inside the page.
window.MAP_ART = {
  height: "art/world/aethermoor-terrain-height.png",       // how high each spot of Aethermoor stands
  kinds: "art/world/aethermoor-terrain-kinds.png",         // what kind of ground each spot is
  blayers: "./art/aethermoor-building-layers.webp",        // the wall and roof textures, in one picture
  players: "./art/aethermoor-place-layers.webp",           // the textures the walking places use, in one picture
  pgrounds: "./art/aethermoor-place-grounds.webp",         // where each walking place has cobbles, earth, paving and water
  layers: "./art/aethermoor-ground-layers.webp",           // Chris's world-map ground textures, in one picture
};
