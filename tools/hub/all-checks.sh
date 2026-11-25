#!/bin/bash
# The hub's whole-game check: runs the named checks one at a time on the pages in builds/, a log for each in
# builds/check-logs/, and one line for each in builds/check-logs/summary.txt (how many good, how many failed).
#
#   sh tools/hub/all-checks.sh all                 every check (about three hours on a small machine)
#   sh tools/hub/all-checks.sh zone-test-1 flight-test     only these
#
# Build the pages first (tools/build.py). Where Python's Playwright is not installed but a Node one is:
#   PYTHONPATH=tools/hub/pw-bridge sh tools/hub/all-checks.sh all
# Never run two of these at once: two browsers each holding a 100 MB page may be what stops a small machine.
cd "$(dirname "$0")/../.." || exit 1
L=builds/check-logs; mkdir -p $L
ALL="zone-test-1 zone-test-2 zone-test-3 zone-test-4 story-test-2 story-test-3 story-test-4 people-test things-test
walk-test menu-test-1 menu-test-A-2 menu-test-A-3 menu-test-A-4 maps-test-maps maps-test-1 maps-test-2 maps-test-3
maps-test-4 flight-test flight-ship-test-1 flight-ship-test-moored faire-test townsfolk-test journey-test
journey-test-412 encounter-test-2 encounter-test-3 encounter-quick-1 encounter-long-1 encounter-quick-4
encounter-long-4"
[ "$1" = all ] && set -- $ALL
run() { name=$1; shift
  s=$(date +%s); timeout 5400 "$@" > "$L/$name.log" 2>&1; r=$?
  echo "$(date +%H:%M) $name rc=$r $(( $(date +%s) - s ))s ok=$(grep -c '^ *ok ' "$L/$name.log") fail=$(grep -c '^ *FAIL' "$L/$name.log") last: $(tail -n 1 "$L/$name.log" | cut -c1-80)" >> $L/summary.txt
}
for c in "$@"; do
  case $c in
    zone-test-*) z=${c#zone-test-}; run $c python3 tools/zone-test.py builds/zone-$z.html ;;
    story-test-*) z=${c#story-test-}; run $c python3 tools/story-test.py builds/zone-$z.html ;;   # zone 4 fails 2 until the held Warden's lines are recorded
    people-test) run $c python3 tools/people-test.py builds/zone-1.html ;;
    things-test) run $c python3 tools/things-test.py builds/zone-1.html ;;
    walk-test) run $c python3 tools/walk-test.py builds/first-test.html ;;
    menu-test-1) run $c python3 tools/menu-test.py builds/zone-1.html ;;
    menu-test-A-*) z=${c#menu-test-A-}; run $c python3 tools/menu-test.py builds/zone-$z.html --only A ;;
    maps-test-maps) run $c python3 tools/maps-test.py builds/maps.html ;;
    maps-test-*) z=${c#maps-test-}; run $c python3 tools/maps-test.py builds/zone-$z.html ;;
    # zones 1 and 4: the quick and the long parts are run apart. Run whole, zone 1's "a fight meant to be lost" is
    # won (the check has raised the party to level 5 by then), and zone 4 takes over an hour.
    encounter-long-*) z=${c#encounter-long-}; run $c python3 -u tools/encounter-test.py builds/zone-$z.html --long-only ;;
    encounter-quick-*) z=${c#encounter-quick-}; run $c python3 -u tools/encounter-test.py builds/zone-$z.html --quick ;;
    encounter-test-*) z=${c#encounter-test-}; run $c python3 -u tools/encounter-test.py builds/zone-$z.html ;;
    flight-test) run $c python3 tools/flight-test.py builds/flight.html ;;
    flight-ship-test-1) run $c python3 tools/flight-ship-test.py builds/zone-1.html ;;
    flight-ship-test-moored) run $c python3 tools/flight-ship-test.py builds/moored-ship.html ;;
    journey-test) run $c python3 -u tools/journey-test.py builds ;;
    journey-test-412) run $c python3 -u tools/journey-test.py builds --only AF --size 412x880 ;;
    faire-test) run $c python3 tools/faire-test.py builds/faire-ending.html ;;
    townsfolk-test) run $c python3 tools/townsfolk-test.py builds/townsfolk-lineup.html ;;
    *) echo "$(date +%H:%M) $c: no such check" >> $L/summary.txt ;;
  esac
done
echo "$(date +%H:%M) ALL DONE" >> $L/summary.txt
tail -n 40 $L/summary.txt
