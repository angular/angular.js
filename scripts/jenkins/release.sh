#!/bin/bash

set -e # fail if any command fails
cd `dirname $0`/../..

# bump versions: remove "-snapshot" suffix
sed -i -e 's/"version": "\(.*\)-snapshot"/"version": "\1"/' package.json

# Build
./jenkins_build.sh

VERSION=`cat build/version.txt`

# bump versions: increment version number and add "-snapshot" again
grunt bump:$BUMP_TYPE
sed -i -e 's/"version": "\(.*\)"/"version": "\1-snapshot"/' package.json

# commit, tag and push
git commit -m "chore(release): v%VERSION%"
git tag -m "v%VERSION%" v%VERSION%
# TODO git push

# Update code.angularjs.org
./scripts/code.angularjs.org/publish.sh

# Push to bower
./scripts/bower/publish.sh


