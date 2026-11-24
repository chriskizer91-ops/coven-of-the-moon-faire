#!/bin/sh
# creatures-pictures.sh: every picture of the six creatures from Aethermoor M7, and Chris's sheets, made again from the
# repo alone (the creatures job). About an hour on a machine with no graphics card. Run from the repo's top folder:
#
#     sh tools/creatures-pictures.sh            ->  builds/creatures-pictures/   (the pictures)
#                                                   builds/creatures-pictures/sheets/<creature>.jpg and row-*.png
#
# Each step takes the machine's shared lock by itself (if there is one), so other work can run between the steps.
set -u
O=builds/creatures-pictures; mkdir -p $O
L=""; [ -e /tmp/coven-heavy.lock ] && L="flock /tmp/coven-heavy.lock"
P="python3 tools/creatures-look.py builds/creatures-lab.html $O"
$L python3 tools/build.py game/pages/creatures-lab.html
$L timeout 1500 $P --stand --motions --row
$L timeout 1500 $P --stand --row --size 412x880
$L timeout 1500 sh -c "$P --stand --query m7=before; $P --stand --query m7=before --size 412x880"
$L timeout 1500 $P --fight 3,6 --keys glowcap,forge-spark,sapwight
$L timeout 1500 $P --fight 3,6 --keys rotwarden,rotstag,thornhound
$L timeout 1500 $P --fight 3,6 --keys glowcap,forge-spark,sapwight --size 412x880
$L timeout 1500 $P --fight 3,6 --keys rotwarden,rotstag,thornhound --size 412x880
python3 tools/creatures-sheet.py $O $O/sheets && cp $O/row-*.png $O/sheets/
node tools/m7-stretch.mjs --frames 48
