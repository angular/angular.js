#!/bin/bash

echo "#################################"
echo "#### Cut release ################"
echo "#################################"

ARG_DEFS=(
  "--next-version-type=(patch|minor|major)"
  "--next-version-name=(.+)"
  "[--no-test=(true|false)]"
)

function init {
  NG_ARGS=("$@")
  if [[ ! $VERBOSE ]]; then
    VERBOSE=false
  fi
  if [[ ! $NO_TEST ]]; then
    NO_TEST=false
  fi
  VERBOSE_ARG="--verbose=$VERBOSE"
  NO_TEST_ARG="--no_test=$VERBOSE"
}

function phase {
  ACTION_ARG="--action=$1"
  ../angular.js/publish.sh $ACTION_ARG $VERBOSE_ARG $NO_TEST_ARG \
      --next-version-type=$NEXT_VERSION_TYPE --next-version-name=$NEXT_VERSION_NAME
  ../code.angularjs.org/publish.sh $ACTION_ARG $VERBOSE_ARG
  ../bower/publish.sh $ACTION_ARG $VERBOSE_ARG
  ../angular-seed/publish.sh $ACTION_ARG $VERBOSE_ARG $NO_TEST_ARG
  ../angular-phonecat/publish.sh $ACTION_ARG $VERBOSE_ARG $NO_TEST_ARG
}

function run {
  # First prepare all scripts (build, test, commit, tag, ...),
  # so we are sure everything is all right
  phase prepare
  # only then publish to github
  phase publish
}

source $(dirname $0)/../utils.inc
