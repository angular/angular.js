#!/bin/bash

# Script for updating angular.js repo from current local build.

echo "#################################"
echo "##     Update angular.js      ###"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
 "--next-version-type=(patch|minor|major)"
 "--next-version-name=(.+)"
 "[--no_test=true]"
)

function init {
  cd ../..
}

function prepare() {

  if ! git symbolic-ref --short HEAD; then
    # We are on a detached branch, e.g. jenkins checks out shas instead of branches
    # Jump onto the master branch and make sure we are using the latest
    git checkout -f master
    git merge --ff-only origin/master
  fi

  ./scripts/angular.js/finalize-version.sh

  # Build
  if [[ $NO_TEST ]]; then
    grunt package
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
