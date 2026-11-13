#!/bin/sh
# Start the runner for the live round. Needs ../secrets.local.json { tracker, token, feed, live }.
# caffeinate keeps this Mac awake while the loop runs. Stop: pkill -f runner/loop.mjs
cd "$(dirname "$0")/.." || exit 1
nohup caffeinate -dimsu node runner/loop.mjs >> loop.out.log 2>&1 &
echo "runner pid $!"
