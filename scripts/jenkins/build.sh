#!/bin/bash

echo "#################################"
echo "####  Jenkins Build  ############"
echo "#################################"

source scripts/jenkins/set-node-version.sh

# Enable tracing and exit on first failure
set -xe

# This is the default set of browsers to use on the CI server unless overridden via env variable
if [[ -z "$BROWSERS" ]]
then
  BROWSERS="Chrome,Firefox,Opera,/Users/jenkins/bin/safari.sh"
fi

# CLEAN #
rm -f angular.min.js.gzip.size
rm -f angular.js.size


# BUILD #
npm install -g grunt-cli
npm install --color false
grunt ci-checks package --no-color

mkdir -p test_out

# UNIT TESTS #
grunt test:unit --browsers="$BROWSERS" --reporters=dots,junit --no-colors --no-color

# END TO END TESTS #
grunt test:ci-protractor

# DOCS APP TESTS #
grunt test:docs --browsers="$BROWSERS" --reporters=dots,junit --no-colors --no-color

# Promises/A+ TESTS #
grunt test:promises-aplus --no-color


# CHECK SIZE #
gzip -c < build/angular.min.js > build/angular.min.js.gzip
echo "YVALUE=`ls -l build/angular.min.js | cut -d" " -f 8`" > angular.min.js.size
echo "YVALUE=`ls -l build/angular.min.js.gzip | cut -d" " -f 8`" > angular.min.js.gzip.size
