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
  cp -r $BUILD_DIR/* $REPO_DIR/$NEW_VERSION/

  #
  # commit
  #
  echo "-- Committing code.angularjs.org"
  cd $REPO_DIR
  git add -A
  git commit -m "v$NEW_VERSION"
}


function _update_snapshot() {
  for backend in "$@" ; do
    echo "-- Updating snapshot version: backend=$backend"
    curl -G --data-urlencode "ver=$NEW_VERSION" http://$backend:8003/fetchLatestSnapshot.php
  done
}

function _update_code() {
  cd $REPO_DIR

  echo "-- Pushing code.angularjs.org"
  git push origin master

  for backend in "$@" ; do
    echo "-- Refreshing code.angularjs.org: backend=$backend"
    curl http://$backend:8003/gitFetchSite.php
  done
}

function publish {
  # The TXT record for backends.angularjs.org is a CSV of the IP addresses for
  # the currently serving Compute Engine backends.
  # code.angularjs.org is served out of port 8003 on these backends.
  backends=("$(dig backends.angularjs.org +short TXT | python -c 'print raw_input()[1:-1].replace(",", "\n")')")

  if [[  $IS_SNAPSHOT_BUILD ]]; then
    _update_snapshot ${backends[@]}
  else
    _update_code ${backends[@]}
  fi
}

source $(dirname $0)/../utils.inc
