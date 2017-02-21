#!/bin/bash

echo "#################################"
echo "####  Jenkins Build  ############"
echo "#################################"

source scripts/jenkins/init-node.sh

# Enable tracing and exit on first failure
set -xe

# This is the default set of browsers to use on the CI server unless overridden via env variable
if [[ -z "$BROWSERS" ]]
then
  BROWSERS="Chrome,Firefox"
fi

# CLEAN #
rm -f angular.min.js.gzip.size
rm -f angular.js.size


# BUILD #
yarn run grunt -- ci-checks package --no-color

mkdir -p test_out

# UNIT TESTS #
yarn run grunt -- test:unit --browsers="$BROWSERS" --reporters=dots,junit --no-colors --no-color

# END TO END TESTS #
yarn run grunt -- test:ci-protractor

# DOCS APP TESTS #
yarn run grunt -- test:docs --browsers="$BROWSERS" --reporters=dots,junit --no-colors --no-color

# Promises/A+ TESTS #
yarn run grunt -- test:promises-aplus --no-color


# CHECK SIZE #
gzip -c < build/angular.min.js > build/angular.min.js.gzip
echo "YVALUE=`ls -l build/angular.min.js | cut -d" " -f 8`" > angular.min.js.size
echo "YVALUE=`ls -l build/angular.min.js.gzip | cut -d" " -f 8`" > angular.min.js.gzip.size
