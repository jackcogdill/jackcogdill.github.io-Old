#! /bin/bash

sass -t compressed --watch style.scss:_style.css &\
    find _style.css | entr postcss _style.css --use autoprefixer -o style.css
ps | grep sass | grep -v grep | grep -oE " [0-9]+ $(whoami)" | awk '{print $1}' | xargs kill -9
