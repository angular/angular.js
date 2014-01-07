#!/bin/bash

# Script for updating angular-seed repo from current local build.

echo "#################################"
echo "## Update angular-seed ###"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
  "[--no-test=(true|false)]"
)

function init {
  TMP_DIR=$(resolveDir ../../tmp)
  BUILD_DIR=$(resolveDir ../../build)
  REPO_DIR=$TMP_DIR/angular-seed
  NEW_VERSION=$(cat $BUILD_DIR/version.txt)
}

function prepare {
  echo "-- Cloning angular-seed"
  git clone git@github.com:angular/angular-seed.git $REPO_DIR

  #
  # copy the files from the build
  #
  echo "-- Updating angular-seed"
  cd $REPO_DIR
  ./scripts/update-angular.sh $BUILD_DIR

  # Test
  if [[ $NO_TEST != "true" ]]; then
    ./scripts/test-all.sh
  fi
}

function publish {
  cd $REPO_DIR
  echo "-- Pushing angular-seed"
  git push origin master
}

source $(dirname $0)/../utils.inc
