#!/bin/bash

npm install --color false
grunt build --no-color
grunt bp_build --no-color
./node_modules/karma/bin/karma start karma-benchpress.conf.js --single-run --no-colors
