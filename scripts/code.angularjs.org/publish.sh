#!/bin/bash

# Script for updating code.angularjs.org repo from current local build.

echo "#################################"
echo "## Update code.angularjs.org ###"
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

  echo "-- Cloning code.angularjs.org"
  git clone git@github.com:angular/code.angularjs.org.git $REPO_DIR --depth=1

  echo "-- Updating code.angularjs.org"

  if [[  $IS_SNAPSHOT_BUILD ]]; then
    #
    # update the snapshot folder
    #
    rm -rf $REPO_DIR/snapshot
    mkdir $REPO_DIR/snapshot
    cp -r $BUILD_DIR/* $REPO_DIR/snapshot/
  else
    #
    # copy the files from the build
    #
    mkdir $REPO_DIR/$NEW_VERSION
    cp -r $BUILD_DIR/* $REPO_DIR/$NEW_VERSION/
  fi

  #
  # commit
  #
  echo "-- Committing code.angularjs.org"
  cd $REPO_DIR
  git add -A
  git commit -m "v$NEW_VERSION"
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
  _update_code ${backends[@]}
}

source $(dirname $0)/../utils.inc
