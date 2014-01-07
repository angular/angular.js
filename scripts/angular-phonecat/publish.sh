#!/bin/bash

# Script for updating angular-phonecat repo from current local build.

echo "#################################"
echo "## Update angular-phonecat ###"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
  "[--no-test=(true|false)]"
)

function init {
  TMP_DIR=$(resolveDir ../../tmp)
  BUILD_DIR=$(resolveDir ../../build)
  REPO_DIR=$TMP_DIR/angular-phonecat
  NEW_VERSION=$(cat $BUILD_DIR/version.txt)
}

function prepare {
  echo "-- Cloning angular-phonecat"
  git clone git@github.com:angular/angular-phonecat.git $REPO_DIR

  #
  # copy the files from the build
  #
  echo "-- Updating angular-phonecat"
  cd $REPO_DIR
  ./scripts/private/update-angular.sh $BUILD_DIR

  # Test
  if [[ $NO_TEST != "true" ]]; then
    ./scripts/private/test-all.sh
  fi

  # Generate demo
  ./scripts/private/snapshot-web.sh
  git checkout gh-pages
  git pull
  rm -r step*
  mv angular-phonecat-snapshots-web/step* .
  git add step*
  git commit -am "Angular $NEW_VERSION release"
}

function publish {
  cd $REPO_DIR
  echo "-- Pushing angular-phonecat"
  git push origin master -f --tags
  git push origin gh-pages -f
}

source $(dirname $0)/../utils.inc
