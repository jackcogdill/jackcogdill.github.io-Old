#! /bin/bash

trap "ps | grep sass | grep -v grep | grep -oE \"^[0-9]+ \" | awk '{print $1}' | xargs kill -9" SIGINT
sass -t compressed --watch style.scss:_style.css &\
    find _style.css | entr postcss _style.css --no-map --use autoprefixer -o style.css
trap - SIGINT
