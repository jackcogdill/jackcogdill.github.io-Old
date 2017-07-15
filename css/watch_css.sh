#! /bin/bash

sassfile="style.scss"
intermed="_style.css"
final="style.css"

# Kill sass processes with Ctrl+C when finished
trap "ps | grep sass | grep -v grep | grep -oE \"^[0-9]+ \" | awk '{print $1}' | xargs kill -9" SIGINT

# Ensure intermediate file exists
if [ ! -f "$intermed" ]; then
    touch "$intermed"
fi

sass -t compressed --watch "$sassfile":"$intermed" &\
    find "$intermed" | entr postcss "$intermed" --no-map --use autoprefixer -o "$final"

# Remove Ctrl-C trap
trap - SIGINT

# Done with intermediate file
rm "$intermed"
