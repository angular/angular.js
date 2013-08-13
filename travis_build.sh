#!/bin/bash

export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

./lib/sauce/sauce_connect_setup.sh
npm install -g grunt-cli
grunt ci-checks package
grunt connect:testserver > /dev/null &
./lib/sauce/sauce_connect_block.sh

grunt test:docgen
grunt parallel:travis --reporters dots --browsers SL_Chrome
