#!/bin/bash

set -e

export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

if [ $JOB = "unit" ]; then
  grunt ci-checks
  grunt test:promises-aplus
  grunt test:unit --browsers SL_Chrome,SL_Safari,SL_Firefox,SL_IE_8,SL_IE_9,SL_IE_10,SL_IE_11 --reporters dots
  grunt tests:docs --browsers SL_Chrome,SL_Safari,SL_Firefox,SL_IE_8,SL_IE_9,SL_IE_10,SL_IE_11 --reporters dots
  grunt test:travis-protractor --specs "docs/app/e2e/**/*.scenario.js"
elif [ $JOB = "e2e" ]; then
  export TARGET_SPECS="build/docs/ptore2e/**/default_test.js"
  if [ $TEST_TARGET = "jquery" ]; then
    TARGET_SPECS="build/docs/ptore2e/**/jquery_test.js"
  fi
  grunt test:travis-protractor --specs "$TARGET_SPECS"
else
  echo "Unknown job type. Please set JOB=unit or JOB=e2e-*."
fi
