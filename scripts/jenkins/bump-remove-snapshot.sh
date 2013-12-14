#!/bin/bash

echo "############################################"
echo "##  Remove "-snapshot" from version ########"
echo "############################################"

# Enable tracing and exit on first failure
set -xe
# Normalize working dir to script dir
cd `dirname $0`/../..

echo "-- old version: `grep '"version"' package.json`"
sed -i .tmp -e 's/"version": "\(.*\)-snapshot"/"version": "\1"/' package.json
VERSION=$(node -e "console.log(require('./package.json').version)" | sed -e 's/\r//g')
echo "-- local version: $VERSION"

echo "-- commit and tag with v$VERSION"
git add package.json
git commit -m "chore(release): v$VERSION"
git tag -m "v$VERSION" v$VERSION
