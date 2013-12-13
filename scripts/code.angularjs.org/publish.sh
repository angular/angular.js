#!/bin/bash

#
# update all the things
#

set -e # fail if any command fails

cd `dirname $0`
SCRIPT_DIR=`pwd`

export TMP_DIR=../../tmp
export REPO_DIR=$TMP_DIR/code.angularjs.org

export BUILD_DIR=../../build

NEW_VERSION=$(node -e "console.log(require(process.env.BUILD_DIR+'/version.json').full)" | sed -e 's/\r//g')

#
# Don't publish snapshot builds!
#
if [[ "$NEW_VERSION" =~ sha ]] ;then
  echo "publish to code.angularjs.org is not allowed for snapshot builds"
  exit 1;
fi

exit 2

#
# clone
#

git clone git@github.com:angular/code.angularjs.org.git $REPO_DIR

#
# copy the files from the build
#

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

cd $REPO_DIR
git add -A
git commit -m "v$NEW_VERSION"
# TODO git push origin master
cd $SCRIPT_DIR
