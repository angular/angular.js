#!/bin/bash

echo "#################################"
echo "#### Update master ##############"
echo "#################################"

ARG_DEFS=()

function init {
  if [[ ! $VERBOSE ]]; then
    VERBOSE=false
  fi
  VERBOSE_ARG="--verbose=$VERBOSE"
}

function build {
  cd ../..
  scripts/jenkins/build.sh
  cd $SCRIPT_DIR
}

function phase {
  ACTION_ARG="--action=$1"
  ../code.angularjs.org/publish.sh $ACTION_ARG $VERBOSE_ARG
  ../bower/publish.sh $ACTION_ARG $VERBOSE_ARG
}

function run {
  build

  # First prepare all scripts (build, test, commit, tag, ...),
  # so we are sure everything is all right
  phase prepare
  # only then publish to github
  phase publish
}

source $(dirname $0)/../utils.inc
