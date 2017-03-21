#!/bin/bash

set -e

yarn global add grunt-cli@1.2.0

mkdir -p $LOGS_DIR

if [ $JOB != "ci-checks" ]; then
  echo "start_browser_provider"
  ./scripts/travis/start_browser_provider.sh
fi

if [ $JOB != "ci-checks" ]; then
  grunt package
  echo "wait_for_browser_provider"
  ./scripts/travis/wait_for_browser_provider.sh
fi
