#!/bin/bash

echo "############################################"
echo "##  Increment version, add "-snapshot" and set version name ##"
echo "############################################"

ARG_DEFS=(
  "--next-version-type=(patch|minor|major)"
  "--next-version-name=(.+)"
)

function run {
  cd ../..

  grunt bump:$NEXT_VERSION_TYPE
  NEXT_VERSION=$(readJsonProp "package.json" "version")
  replaceJsonProp "package.json" "version" "(.*)" "\2-snapshot"
  replaceJsonProp "package.json" "codename" ".*" "$NEXT_VERSION_NAME"

  git add package.json
  git commit -m "chore(release): start v$NEXT_VERSION ($NEXT_VERSION)"
}

source $(dirname $0)/../utils.inc
