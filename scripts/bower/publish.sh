#!/bin/bash

# Script for updating the Angular bower repos from current local build.

echo "#################################"
echo "#### Update bower ###############"
echo "#################################"

ARG_DEFS=(
  "--action=(prepare|publish)"
)

function init {
  TMP_DIR=$(resolveDir ../../tmp)
  BUILD_DIR=$(resolveDir ../../build)
  NEW_VERSION=$(cat $BUILD_DIR/version.txt)
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
  #
  # clone repos
  #
  for repo in "${REPOS[@]}"
  do
    echo "-- Cloning bower-$repo"
    git clone git@github.com:angular/bower-$repo.git $TMP_DIR/bower-$repo
  done


  #
  # move the files from the build
  #

  for repo in "${REPOS[@]}"
  do
    if [ -f $BUILD_DIR/$repo.js ] # ignore i18l
      then
        echo "-- Updating files in bower-$repo"
        cp $BUILD_DIR/$repo.* $TMP_DIR/bower-$repo/
    fi
  done

  # move i18n files
  cp $BUILD_DIR/i18n/*.js $TMP_DIR/bower-angular-i18n/

  # move csp.css
  cp $BUILD_DIR/angular-csp.css $TMP_DIR/bower-angular


  #
  # update bower.json
  # tag each repo
  #
  for repo in "${REPOS[@]}"
  do
    echo "-- Updating version in bower-$repo to $NEW_VERSION"
    cd $TMP_DIR/bower-$repo
    replaceJsonProp "bower.json" "version" ".*" "$NEW_VERSION"
    replaceJsonProp "bower.json" "angular.*" ".*" "$NEW_VERSION"

    git add -A

    echo "-- Committing and tagging bower-$repo"
    git commit -m "v$NEW_VERSION"
    git tag v$NEW_VERSION
    cd $SCRIPT_DIR
  done
}

function publish {
  for repo in "${REPOS[@]}"
  do
    echo "-- Pushing bower-$repo"
    cd $TMP_DIR/bower-$repo
    git push origin master
    git push origin v$NEW_VERSION
    cd $SCRIPT_DIR
  done
}

source $(dirname $0)/../utils.inc
