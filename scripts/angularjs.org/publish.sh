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
  BASE_DIR=$(resolveDir ../..)
  TMP_DIR=$BASE_DIR/tmp
  REPO_DIR=$TMP_DIR/angularjs.org
  BRANCH_PATTERN=$(readJsonProp "$BASE_DIR/package.json" "branchVersion")
  BUILD_DIR=$BASE_DIR/build
}

function prepare {
  echo "-- Cloning angularjs.org"
  git clone git@github.com:angular/angularjs.org.git $REPO_DIR

  #
  # update files
  #
  echo "-- Updating angularjs.org"
  cd $REPO_DIR
  VERSION_REGEX="[-a-z0-9\.\+]+"

  # Replace the version in the script links that reference the Google CDN
  # e.g. <script src="http://ajax.googleapis.com/ajax/libs/angularjs/1.3.0-beta.1/angular.js"></script>
  replaceInFile "index.html" "(http:\/\/ajax.googleapis.com\/ajax\/libs\/angularjs\/)$VERSION_REGEX" "\1$CDN_VERSION"

  # Replace the version in the script links that reference code.angularjs.org
  # e.g. <script src="http://code.angularjs.org/1.3.0-beta.1/i18n/angular-locale_sk.js"></script>
  replaceInFile "index.html" "(code\.angularjs\.org\/)$VERSION_REGEX" "\1$CDN_VERSION"

  # Replace the version of the branch that we are updating
  echo $BRANCH_PATTERN
  echo $CDN_VERSION
  replaceInFile "js/download-data.js" "branch:[ ]+'($BRANCH_PATTERN)',[ ]+version:[ ]+'$VERSION_REGEX'" "branch: '\1', version: '$CDN_VERSION'"

  git add index.html
  git add js/download-data.js
  git commit -m "update(version): update angular version to $CDN_VERSION for branch $BRANCH_PATTERN"
}

function publish {
  cd $REPO_DIR
  echo "-- Pushing angularjs.org"
  git push origin master
}

source $(dirname $0)/../utils.inc
