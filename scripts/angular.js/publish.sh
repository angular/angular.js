#!/bin/bash

# Script for updating angular.js repo from current local build.

echo "#################################"
echo "##     Update angular.js      ###"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
 "--next-version-type=(patch|minor|major)"
 "--next-version-name=(.+)"
 "[--no-test=(true|false)]"
)

function init {
  cd ../..
}

function prepare() {
  ./scripts/angular.js/finalize-version.sh

  # Build
  if [[ $NO_TEST == "true" ]]; then
    npm install --color false
    grunt ci-checks package --no-color
  else
    ./jenkins_build.sh
  fi

  ./scripts/angular.js/initialize-new-version.sh --next-version-type=$NEXT_VERSION_TYPE --next-version-name=$NEXT_VERSION_NAME
}

function publish() {
  BRANCH=$(git rev-parse --abbrev-ref HEAD)
  # push the commits to github
  git push origin $BRANCH
  # push the release tag
  git push origin v`cat build/version.txt`
}

source $(dirname $0)/../utils.inc
