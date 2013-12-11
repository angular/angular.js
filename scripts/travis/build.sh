#!/bin/bash

set -e

export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

if [ $JOB = "unit" ]; then
  grunt ci-checks
  grunt test:docgen
  grunt test:promises-aplus
  grunt test:unit --browsers SL_Chrome,SL_Safari,SL_Firefox,SL_IE_8,SL_IE_9,SL_IE_10,SL_IE_11 --reporters dots
elif [ $JOB = "e2e" ]; then
  grunt test:e2e --browsers SL_Chrome --reporters dots
else
  echo "Unknown job type. Please set JOB=unit or JOB=e2e."
fi
