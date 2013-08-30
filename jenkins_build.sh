#!/bin/bash

# Enable tracing and exit on first failure
set -xe


# Define reasonable set of browsers in case we are running manually from commandline
if [[ -z "$BROWSERS" ]]
then
  BROWSERS="Chrome,Firefox,Opera,/Users/jenkins/bin/safari.sh,/Users/jenkins/bin/ie8.sh,/Users/jenkins/bin/ie9.sh"
fi

if [[ -z "$BROWSERS_E2E" ]]
then
  BROWSERS_E2E="Chrome,Firefox,/Users/jenkins/bin/safari.sh"
fi


# CLEAN #
rm -f angular.min.js.gzip.size
rm -f angular.js.size


# BUILD #
npm install --color false
grunt ci-checks package --no-color


# UNIT TESTS #
grunt test:unit --browsers $BROWSERS --reporters=dots,junit --no-colors --no-color


# END TO END TESTS #
grunt test:e2e --browsers $BROWSERS_E2E --reporters=dots,junit --no-colors --no-color

# Promises/A+ TESTS #
grunt test:promises-aplus --no-color


# CHECK SIZE #
gzip -c < build/angular.min.js > build/angular.min.js.gzip
echo "YVALUE=`ls -l build/angular.min.js | cut -d" " -f 8`" > angular.min.js.size
echo "YVALUE=`ls -l build/angular.min.js.gzip | cut -d" " -f 8`" > angular.min.js.gzip.size
