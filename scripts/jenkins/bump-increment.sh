#!/bin/bash

echo "############################################"
echo "##  Increment version and add "-snapshot" ##"
echo "############################################"

if [ "$1" != "patch" -a "$1" != "minor" -a "$1" != "major" ]; then
  echo "Please specify the next version type: patch|minor|major"
  exit 1
fi
BUMP_TYPE=$1

# Enable tracing and exit on first failure
set -xe
# Normalize working dir to script dir
cd `dirname $0`/../..

echo "-- increment version "
grunt bump:$BUMP_TYPE
NEXT_VERSION=$(node -e "console.log(require('./package.json').version)" | sed -e 's/\r//g')
sed -i .tmp -e 's/"version": "\(.*\)"/"version": "\1-snapshot"/' package.json
echo "-- new version: `grep '"version"' package.json`"
echo "-- commit"
git add package.json
git commit -m "chore(release): start v$NEXT_VERSION"