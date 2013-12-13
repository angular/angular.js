#!/bin/bash

if [ -z "$1" ]; then
    echo "Please specify the version bump type: patch|minor|major"
    exit 1
fi

set -e # fail if any command fails
cd `dirname $0`/../..
BUMP_TYPE=$1

# bump versions: remove "-snapshot" suffix
sed -i .tmp -e 's/"version": "\(.*\)-snapshot"/"version": "\1"/' package.json

# Build
# ./jenkins_build.sh
grunt package
VERSION=`cat build/version.txt`

# Commit and tag
git add package.json
git commit -m "chore(release): v$VERSION"
git tag -m "v$VERSION" v$VERSION

# bump versions: increment version number and add "-snapshot"
grunt bump:$BUMP_TYPE
NEXT_VERSION=$(node -e "console.log(require('./package.json').version)" | sed -e 's/\r//g')
sed -i .tmp -e 's/"version": "\(.*\)"/"version": "\1-snapshot"/' package.json
git add package.json
git commit -m "chore(release): start v$NEXT_VERSION"

# push to github
# TODO git push

# Update code.angularjs.org
./scripts/code.angularjs.org/publish.sh

# Push to bower
./scripts/bower/publish.sh


