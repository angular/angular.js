#!/bin/bash

echo "############################################"
echo "##  Remove "-snapshot" from version ########"
echo "############################################"

ARG_DEFS=()

function run {
  cd ../..

  replaceJsonProp "package.json" "version" "(.*)-snapshot" "\2"
  VERSION=$(readJsonProp "package.json" "version")

  git add package.json
  git commit -m "chore(release): cut v$VERSION release"
  git tag -m "v$VERSION" v$VERSION
}

source $(dirname $0)/../utils.inc
