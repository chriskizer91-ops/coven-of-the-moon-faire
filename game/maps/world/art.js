// art.js: the pictures the 3D map of Aethermoor reads (Coven of the Moon Faire, the maps job, November 23, 2026).
// These four came in with the map from the old Envoi (game/maps/world/art/; their lines are in assets/INDEX.csv).
// The two data pictures of the land (how high, what kind of ground) are the ones the game's zones already read
// (game/art/world/). On a zone's page they are inside the page already, and the map takes them from the zone
// (game/maps/maps.js). A page with no zone in it loads art-land.js as well, which names the two.
// tools/build.py puts each picture inside the page.
window.MAP_ART = Object.assign(window.MAP_ART || {}, {
  blayers: "./art/aethermoor-building-layers.webp",        // the wall and roof textures, in one picture
  players: "./art/aethermoor-place-layers.webp",           // the textures the walking places use, in one picture
  pgrounds: "./art/aethermoor-place-grounds.webp",         // where each walking place has cobbles, earth, paving and water
  layers: "./art/aethermoor-ground-layers.webp",           // Chris's world-map ground textures, in one picture
});
