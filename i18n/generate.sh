#!/bin/bash

BASE_DIR=`dirname $0`
cd $BASE_DIR


/usr/bin/env jasmine-node spec/ --noColor && node src/closureSlurper.js
