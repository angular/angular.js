#!/bin/bash

BASE_DIR=`dirname $0`
cd $BASE_DIR


../node_modules/.bin/jasmine-node spec/ --noColor && node src/closureSlurper.js
