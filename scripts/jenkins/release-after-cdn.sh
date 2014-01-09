#!/bin/sh

ARG_DEFS=(
  # require the git dryrun flag so the script can't be run without
  # thinking about this!
  "--git-push-dryrun=(true|false)"
)

function findLatestRelease {
  # returns e.g. v1.2.7
  LATEST_TAG=$(git describe --abbrev=0 --tags)
  # returns e.g. 1.2.7
  echo ${LATEST_TAG:1}
}

function init {
  NG_ARGS=("$@")
  if [[ ! $VERBOSE ]]; then
    VERBOSE=false
  fi
  VERBOSE_ARG="--verbose=$VERBOSE"
}

function phase {
  ACTION_ARG="--action=$1"
  CDN_VERSION_ARG="--cdn-version=$LATEST_VERSION"
  ./scripts/angular.js/publish-cdn-version.sh $ACTION_ARG $CDN_VERSION_ARG $VERBOSE_ARG
  ./scripts/angularjs.org/publish.sh $ACTION_ARG $CDN_VERSION_ARG $VERBOSE_ARG
}

function run {
  cd ../..
  LATEST_VERSION=$(findLatestRelease)

  phase prepare
  phase publish
}

source $(dirname $0)/../utils.inc