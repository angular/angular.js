#!/bin/bash

set -xe

export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`
./lib/sauce/sauce_connect_setup.sh
npm install -g grunt-cli
grunt ci-checks package
./lib/sauce/sauce_connect_block.sh

grunt parallel:travis --reporters dots \
  --browsers SL_Chrome,SL_Firefox,SL_Safari,SL_IE_8,SL_IE_9,SL_IE_10 \
  --e2e-browsers SL_Chrome
