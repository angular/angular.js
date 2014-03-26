#!/bin/sh

ARG_DEFS=(
  # require the git dryrun flag so the script can't be run without
  # thinking about this!
  "--git-push-dryrun=(true|false)"
  "--cdn-version=(.*)"
)

function init {
  NG_ARGS=("$@")
  if [[ ! $VERBOSE ]]; then
    VERBOSE=false
  fi
  VERBOSE_ARG="--verbose=$VERBOSE"
}

function phase {
  ACTION_ARG="--action=$1"
  CDN_VERSION_ARG="--cdn-version=$CDN_VERSION"
  ./scripts/angular.js/publish-cdn-version.sh $ACTION_ARG $CDN_VERSION_ARG $VERBOSE_ARG
  ./scripts/angularjs.org/publish.sh $ACTION_ARG $CDN_VERSION_ARG $VERBOSE_ARG
}

function checkCdn {
  STATUS=$(curl http://ajax.googleapis.com/ajax/libs/angularjs/$CDN_VERSION/angular.min.js --write-out '%{http_code}' -o /dev/null -silent)
  if [[ $STATUS != 200 ]]; then
    echo "Could not find release $CDN_VERSION on CDN"
    exit 1
  fi
}

function run {
  cd ../..
  checkCdn

  phase prepare
  phase publish
}

source $(dirname $0)/../utils.inc