#!/bin/bash

set -e

mkdir -p $LOGS_DIR

if [ $JOB != "ci-checks" ]; then
  echo "start_browser_provider"
  ./scripts/travis/start_browser_provider.sh
fi

npm install -g grunt-cli

if [ $JOB != "ci-checks" ]; then
  grunt package
  echo "wait_for_browser_provider"
  ./scripts/travis/wait_for_browser_provider.sh
fi
