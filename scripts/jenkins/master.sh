#!/bin/bash

echo "#################################"
echo "#### Update master ##############"
echo "#################################"

ARG_DEFS=(
  "[--no-test=true]"
)

function build {
  cd ../..

  if [[ $NO_TEST ]]; then
    grunt package
  else
    ./jenkins_build.sh
  fi

  cd $SCRIPT_DIR
}

function phase {
  ../code.angularjs.org/publish.sh --action=$1
  ../bower/publish.sh --action=$1
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
