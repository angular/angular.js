#!/bin/bash

echo "############################################"
echo "##  Remove "-snapshot" from version ########"
echo "############################################"

# Enable tracing and exit on first failure
set -xe
# Normalize working dir to script dir
cd `dirname $0`/../..

echo "-- old version: `grep '"version"' package.json`"
sed -i .tmp -E 's/"version": "(.*)-snapshot"/"version": "\1"/' package.json
VERSION=`sed -En 's/.*"version"[ ]*:[ ]*"(.*)".*/\1/p' package.json`
echo "-- local version: $VERSION"

echo "-- commit and tag with v$VERSION"
git add package.json
git commit -m "chore(release): v$VERSION"
git tag -m "v$VERSION" v$VERSION
