#!/bin/sh

# Script for updating cdnVersion of angular.js

echo "###################################"
echo "## Update angular.js cdnVersion ###"
echo "###################################"

ARG_DEFS=(
  "--cdn-version=(.*)"
  "--action=(prepare|publish)"
)

function init {
  cd ../..
}

function prepare {
  replaceJsonProp "package.json" "cdnVersion" "(.*)" "$CDN_VERSION"
  git add package.json
  git commit -m "chore(release): update cdn version"
}

function publish {
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  # push the commits to github
  git push origin $BRANCH
}

source $(dirname $0)/../utils.inc
