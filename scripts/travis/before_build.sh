#!/bin/bash

set -e

DISTTAG=$( cat package.json | jq '.distTag' | tr -d \" )

echo $TRAVIS_TAG
echo $DISTTAG

if [[ $TRAVIS_TAG = '' && $DISTTAG = "next" ]]; then
  echo "read from json";
fi

yarn global add grunt-cli@1.2.0

mkdir -p $LOGS_DIR

if [ $JOB != "ci-checks" ]; then
  echo "start_browser_provider"
  ./scripts/travis/start_browser_provider.sh

  grunt package

  echo "wait_for_browser_provider"
  ./scripts/travis/wait_for_browser_provider.sh
fi
