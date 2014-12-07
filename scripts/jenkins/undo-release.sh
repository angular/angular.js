#!/bin/bash

echo "#################################"
echo "#### undo a release  ############"
echo "#################################"

ARG_DEFS=(
  # require the git dryrun flag so the script can't be run without
  # thinking about this!
  "--git-push-dryrun=(true|false)"
  # the version number of the release.
  # e.g. 1.2.12 or 1.2.12-rc.1
  "--version-number=([0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?)"
)

function init {
  if [[ ! $VERBOSE ]]; then
    VERBOSE=false
  fi
  VERBOSE_ARG="--verbose=$VERBOSE"
}

function phase {
  ACTION_ARG="--action=$1"
  VERSION_NUMBER_ARG="--version-number=$VERSION_NUMBER"
  ../angular.js/untag-release.sh $ACTION_ARG $VERBOSE_ARG\
    --version-number=$VERSION_NUMBER

  ../code.angularjs.org/unpublish.sh $ACTION_ARG $VERSION_NUMBER_ARG $VERBOSE_ARG
  ../bower/unpublish.sh $ACTION_ARG $VERSION_NUMBER_ARG $VERBOSE_ARG
}

function run {
  # First prepare all scripts (build, commit, tag, ...),
  # so we are sure everything is all right
  phase prepare
  # only then publish to github
  phase publish
}

source $(dirname $0)/../utils.inc
