#!/bin/bash

echo "#################################"
echo "## Update code.angular.js.org ###"
echo "#################################"

# Enable tracing and exit on first failure
set -xe
# Normalize working dir to script dir
cd `dirname $0`


# export so that node.js can read those env settings
export TMP_DIR=../../tmp
export REPO_DIR=$TMP_DIR/code.angularjs.org
export BUILD_DIR=../../build

SCRIPT_DIR=`pwd`
NEW_VERSION=`cat $BUILD_DIR/version.txt`

#
# Snapshot builds are kept in a temp directory in code.angularjs.org
# that is filled by calling a php script there.
#
if [[ "$NEW_VERSION" =~ sha ]] ;then
  echo "-- updating snapshot version"
  curl -G --data-urlencode "ver=$NEW_VERSION" http://code.angularjs.org/fetchLatestSnapshot.php
  exit 0;
fi

#
# clone
#

echo "-- Cloning code.angularjs.org"
git clone git@github.com:angular/code.angularjs.org.git $REPO_DIR

#
# copy the files from the build
#

echo "-- Updating code.angularjs.org"
mkdir $REPO_DIR/$NEW_VERSION
cd $REPO_DIR
git reset --hard HEAD
git checkout master
git fetch --all
git reset --hard origin/master
cd $SCRIPT_DIR
cp -r $BUILD_DIR/* $REPO_DIR/$NEW_VERSION/

#
# commit and push
#
echo "-- Committing and pushing code.angularjs.org"
cd $REPO_DIR
git add -A
git commit -m "v$NEW_VERSION"
git push origin master
cd $SCRIPT_DIR

#
# refresh code.angularjs.org from github
#
curl http://code.angularjs.org/gitFetchSite.php