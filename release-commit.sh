#!/usr/bin/env bash

function catch_errors() {
  echo "ERROR. That's life."
  exit 1
}

trap catch_errors ERR

TMP_FILE='changelog.tmp'
CHANGELOG_FILE='CHANGELOG.md'

echo "Getting current version..."
VERSION=`./version.js --current`

echo "Generating changelog..."
./changelog.js $VERSION $TMP_FILE

cat $CHANGELOG_FILE >> $TMP_FILE
mv -f $TMP_FILE $CHANGELOG_FILE


echo "Updating version..."
./version.js --remove-snapshot

echo "CONFIRM TO COMMIT"
read WHATEVER


echo "Creating commit..."
git commit version.yaml CHANGELOG.md -m "chore(relase): cutting the v$VERSION release"

echo "Creating tag..."
git tag "v$VERSION"
