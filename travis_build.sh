#!/bin/bash

set -xe

warn() {
  tput setaf 1
  echo "[ERROR] Received $1"
  tput sgr0
  exit 1
}

trap "warn SIGINT" SIGINT
trap "warn SIGTERM" SIGTERM
trap "warn SIGHUP" SIGHUP

export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`
./lib/sauce/sauce_connect_setup.sh
npm install -g grunt-cli
grunt ci-checks package

echo ">>> grunt exited with code: $?"
echo ""
echo ""

./lib/sauce/sauce_connect_block.sh
grunt parallel:travis --reporters dots --browsers SL_Chrome
