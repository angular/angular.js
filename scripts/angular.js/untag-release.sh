#!/bin/bash

# Untags a release.

echo "###################################"
echo "## Untag angular.js for a release #"
echo "###################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
  # the version number of the release.
  # e.g. 1.2.12 or 1.2.12-rc.1
  "--version-number=([0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?)"
)

function init {
  TMP_DIR=$(resolveDir ../../tmp)
  TAG_NAME="v$VERSION_NUMBER"
}

function prepare() {
  :
}

function publish() {
  # push the tag deletion to github
  tags=`git ls-remote --tags git@github.com:angular/angular.js`
  if [[ $tags =~ "refs/tags/v$VERSION_NUMBER^" ]]; then
    echo "-- Creating dummy git repo for angular.js with origin remote"
    mkdir $TMP_DIR/empty-angular.js
    cd $TMP_DIR/empty-angular.js
    git init
    git remote add origin git@github.com:angular/angular.js.git
    git push origin ":$TAG_NAME"
  else
    echo "-- Tag v$VERSION_NUMBER does not exist on remote. Moving on"
  fi
}

source $(dirname $0)/../utils.inc
