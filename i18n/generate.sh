#!/bin/bash

set -e

BASE_DIR=`dirname $0`
cd $BASE_DIR

./run-tests.sh

node src/closureSlurper.js


