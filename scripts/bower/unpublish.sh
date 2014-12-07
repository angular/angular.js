#!/bin/bash

# Script for removing tags from the Angular bower repos

echo "#################################"
echo "#### Untag bower ################"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
  "--version-number=([0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?)"
)

function init {
  TMP_DIR=$(resolveDir ../../tmp)
  REPOS=(
    angular
    angular-animate
    angular-cookies
    angular-i18n
    angular-loader
    angular-mocks
    angular-route
    angular-resource
    angular-sanitize
    angular-scenario
    angular-touch
  )
}

function prepare {
  :
}

function publish {
  for repo in "${REPOS[@]}"
  do
    tags=`git ls-remote --tags git@github.com:angular/bower-$repo`
    if [[ $tags =~ "refs/tags/v$VERSION_NUMBER" ]]; then
      echo "-- Creating dummy git repo for bower-$repo with origin remote"
      mkdir $TMP_DIR/bower-$repo
      cd $TMP_DIR/bower-$repo
      git init
      git remote add origin git@github.com:angular/bower-$repo.git
      git push origin :v$VERSION_NUMBER
      echo "-- Deleting v$VERSION_NUMBER tag from bower-$repo"
      cd $SCRIPT_DIR
    else
      echo "-- No remote tag matching v$VERSION_NUMBER exists on bower-$repo"
    fi
  done
}

source $(dirname $0)/../utils.inc
