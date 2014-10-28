#!/bin/bash

set -e

# normalize the working dir to the directory of the script
cd $(dirname $0);

cd ../..
curl "http://23.251.148.50:8000/tar/$TRAVIS_REPO_SLUG/$TRAVIS_COMMIT" | tar xz || true
