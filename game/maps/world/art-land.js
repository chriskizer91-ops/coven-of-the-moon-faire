// art-land.js: the two data pictures of the land, for a page that has no zone in it (the small maps page).
// A zone's page does not load this: the same two pictures are inside it already, and the map takes them from the zone.
// One megabyte saved on every zone page.
window.MAP_ART = Object.assign(window.MAP_ART || {}, {
  height: "art/world/aethermoor-terrain-height.png",       // how high each spot of Aethermoor stands
  kinds: "art/world/aethermoor-terrain-kinds.png",         // what kind of ground each spot is
});
