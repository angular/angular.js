#!/bin/sh
# Script for updating angularjs.org repo

echo "#################################"
echo "##### Update angularjs.org ######"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
  "--cdn-version=(.*)"
)

function init {
  TMP_DIR=$(resolveDir ../../tmp)
  REPO_DIR=$TMP_DIR/angularjs.org
}

function prepare {
  echo "-- Cloning angularjs.org"
  git clone git@github.com:angular/angularjs.org.git $REPO_DIR

  #
  # update files
  #
  echo "-- Updating angularjs.org"
  cd $REPO_DIR
  VERSION_REGEX="[a-z0-9\-\.\+]+"

  replaceInFile "index.html" "(ajax\/libs\/angularjs\/)$VERSION_REGEX" "\1$CDN_VERSION"
  replaceInFile "index.html" "(<span class=\"version\">[^<]*<span>)$VERSION_REGEX" "\1$CDN_VERSION"
  replaceInFile "index.html" "(code.angularjs.org\/)$VERSION_REGEX" "\1$CDN_VERSION"

  replaceInFile "js/homepage.js" "($scope.CURRENT_STABLE_VERSION[ ]*=[ ]*')$VERSION_REGEX" "\1$CDN_VERSION"
  replaceInFile "js/homepage.js" "($scope.CURRENT_UNSTABLE_VERSION[ ]*=[ ]*')$VERSION_REGEX" "\1$CDN_VERSION"

  git add index.html
  git add js/homepage.js
  git commit -m "update(version): update angular version to $CDN_VERSION"
}

function publish {
  cd $REPO_DIR
  echo "-- Pushing angularjs.org"
  git push origin master
}

source $(dirname $0)/../utils.inc
