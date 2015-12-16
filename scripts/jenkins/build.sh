#!/bin/bash

echo "#################################"
echo "####  Jenkins Build  ############"
echo "#################################"

# Enable tracing and exit on first failure
set -xe

# Define reasonable set of browsers in case we are running manually from commandline
if [[ -z "$BROWSERS" ]]
then
  BROWSERS="Chrome,Firefox,Opera,/Users/jenkins/bin/safari.sh"
fi

# CLEAN #
rm -f angular.min.js.gzip.size
rm -f angular.js.size


# BUILD #
npm install --color false
grunt ci-checks package --no-color

mkdir -p test_out

# UNIT TESTS #
grunt test:unit --browsers $BROWSERS --reporters=dots,junit --no-colors --no-color

# END TO END TESTS #
grunt test:ci-protractor

# DOCS APP TESTS #
grunt test:docs --browsers $BROWSERS --reporters=dots,junit --no-colors --no-color

# Promises/A+ TESTS #
grunt test:promises-aplus --no-color


# CHECK SIZE #
gzip -c < build/angular.min.js > build/angular.min.js.gzip
echo "YVALUE=`ls -l build/angular.min.js | cut -d" " -f 8`" > angular.min.js.size
echo "YVALUE=`ls -l build/angular.min.js.gzip | cut -d" " -f 8`" > angular.min.js.gzip.size
