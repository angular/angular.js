#!/bin/bash

set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR

npm run test-i18n

node src/closureSlurper.js


