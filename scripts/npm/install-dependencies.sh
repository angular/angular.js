#!/bin/bash

set -e

SHRINKWRAP_FILE=npm-shrinkwrap.json
SHRINKWRAP_CACHED_FILE=node_modules/npm-shrinkwrap.cached.json

if diff -q $SHRINKWRAP_FILE $SHRINKWRAP_CACHED_FILE; then
  echo 'No shrinkwrap changes detected. npm install will be skipped...';
else
  echo 'Blowing away node_modules and reinstalling npm dependencies...'
  if !(node 'scripts/npm/call-rimraf.js'); then
    rm -rf node_modules;
    echo 'cleaned node_modules using rm -rf';
  fi
  npm install
  cp $SHRINKWRAP_FILE $SHRINKWRAP_CACHED_FILE
  echo 'npm install successful!'
fi
