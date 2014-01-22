#!/bin/bash

# Script for updating code.angularjs.org repo from current local build.

echo "#################################"
echo "## Update code.angular.js.org ###"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
)

function init {
  TMP_DIR=$(resolveDir ../../tmp)
  BUILD_DIR=$(resolveDir ../../build)
  REPO_DIR=$TMP_DIR/code.angularjs.org
  NEW_VERSION=$(cat $BUILD_DIR/version.txt)
  if [[ "$NEW_VERSION" =~ sha ]]; then
    IS_SNAPSHOT_BUILD=true
  else
    IS_SNAPSHOT_BUILD=
  fi
}

function prepare {
  if [[  $IS_SNAPSHOT_BUILD ]]; then
    # nothing to prepare for snapshot builds as
    # code.angularjs.org will fetch the current snapshot from
    # the build server during publish
    exit 0
  fi

  echo "-- Cloning code.angularjs.org"
  git clone git@github.com:angular/code.angularjs.org.git $REPO_DIR

  #
  # copy the files from the build
  #
  echo "-- Updating code.angularjs.org"
  mkdir $REPO_DIR/$NEW_VERSION
  cd $REPO_DIR
  git reset --hard HEAD
  git checkout master
  git fetch --all
  git reset --hard origin/master
  cd $SCRIPT_DIR
  cp -r $BUILD_DIR/* $REPO_DIR/$NEW_VERSION/

  #
  # commit
  #
  echo "-- Committing code.angularjs.org"
  cd $REPO_DIR
  git add -A
  git commit -m "v$NEW_VERSION"
}

function publish {
  if [[  $IS_SNAPSHOT_BUILD ]]; then
    echo "-- Updating snapshot version"
    curl -G --data-urlencode "ver=$NEW_VERSION" http://code.angularjs.org/fetchLatestSnapshot.php
    exit 0;
  fi

  cd $REPO_DIR
  echo "-- Pushing code.angularjs.org"
  git push origin master

  echo "-- Refreshing code.angularjs.org"
  curl http://code.angularjs.org/gitFetchSite.php
}

source $(dirname $0)/../utils.inc
