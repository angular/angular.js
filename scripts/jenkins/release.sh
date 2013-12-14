#!/bin/bash

echo "#################################"
echo "#### Cut release ################"
echo "#################################"

if [ "$1" != "patch" -a "$1" != "minor" -a "$1" != "major" ]; then
  echo "Please specify the next version type: patch|minor|major"
  exit 1
fi
BUMP_TYPE=$1

# Enable tracing and exit on first failure
set -xe
# Normalize working dir to script dir
cd `dirname $0`/../..


# Bump versions: remove "-snapshot" suffix
./scripts/jenkins/bump-remove-snapshot.sh

# Build
./jenkins_build.sh

# Bump versions: Increment version and add "-snapshot"
./scripts/jenkins/bump-increment.sh $BUMP_TYPE

echo "-- push to Github"
# push to github
git push

# Update code.angularjs.org
./scripts/code.angularjs.org/publish.sh

# Update bower
./scripts/bower/publish.sh


