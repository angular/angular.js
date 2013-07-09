#!/bin/bash

set -e

# Setup and start Sauce Connect for your TravisCI build
# This script requires your .travis.yml to include the following two private env variables:
# SAUCE_USERNAME
# SAUCE_ACCESS_KEY
# Follow the steps at https://saucelabs.com/opensource/travis to set that up.
#
# Curl and run this script as part of your .travis.yml before_script section:
# before_script:
#   - curl https://gist.github.com/santiycr/5139565/raw/sauce_connect_setup.sh | bash

CONNECT_URL="http://saucelabs.com/downloads/Sauce-Connect-latest.zip"
CONNECT_DIR="/tmp/sauce-connect-$RANDOM"
CONNECT_DOWNLOAD="Sauce_Connect.zip"
CONNECT_LOG="$CONNECT_DIR/log"

# Get Connect and start it
mkdir -p $CONNECT_DIR
cd $CONNECT_DIR
curl $CONNECT_URL > $CONNECT_DOWNLOAD 2> /dev/null
unzip $CONNECT_DOWNLOAD
rm $CONNECT_DOWNLOAD


echo "Starting Sauce Connect in the background"
echo "Logging into $CONNECT_LOG"
java -jar Sauce-Connect.jar --readyfile $SAUCE_CONNECT_READY_FILE \
    --tunnel-identifier $TRAVIS_JOB_NUMBER \
    $SAUCE_USERNAME $SAUCE_ACCESS_KEY > $CONNECT_LOG &
