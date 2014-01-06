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
}

function phase {
  ../angular.js/publish.sh --action=$1 "${NG_ARGS[@]}"
  ../code.angularjs.org/publish.sh --action=$1
  ../bower/publish.sh --action=$1
}

function run {
  # First prepare all scripts (build, test, commit, tag, ...),
  # so we are sure everything is all right
  phase prepare
  # only then publish to github
  phase publish
}

source $(dirname $0)/../utils.inc
