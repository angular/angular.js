#!/bin/bash

set -e

BASE_DIR=`dirname $0`

yarn run test-i18n

node $BASE_DIR/src/closureSlurper.js

yarn run test-i18n-ucd

echo "Generating ngParseExt"
node $BASE_DIR/ucd/src/extract.js

