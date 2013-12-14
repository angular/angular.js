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

CONNECT_LOG="$LOGS_DIR/sauce-connect"
CONNECT_STDOUT="$LOGS_DIR/sauce-connect.stdout"
CONNECT_STDERR="$LOGS_DIR/sauce-connect.stderr"

# Get Connect and start it
mkdir -p $CONNECT_DIR
cd $CONNECT_DIR
curl $CONNECT_URL -o $CONNECT_DOWNLOAD 2> /dev/null 1> /dev/null
unzip $CONNECT_DOWNLOAD > /dev/null
rm $CONNECT_DOWNLOAD

SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`


ARGS=""

# Set tunnel-id only on Travis, to make local testing easier.
if [ ! -z "$TRAVIS_JOB_NUMBER" ]; then
  ARGS="$ARGS --tunnel-identifier $TRAVIS_JOB_NUMBER"
fi
if [ ! -z "$BROWSER_PROVIDER_READY_FILE" ]; then
  ARGS="$ARGS --readyfile $BROWSER_PROVIDER_READY_FILE"
fi


echo "Starting Sauce Connect in the background, logging into:"
echo "  $CONNECT_LOG"
echo "  $CONNECT_STDOUT"
echo "  $CONNECT_STDERR"
java -jar Sauce-Connect.jar $ARGS $SAUCE_USERNAME $SAUCE_ACCESS_KEY \
  --logfile $CONNECT_LOG 2> $CONNECT_STDERR 1> $CONNECT_STDOUT &
