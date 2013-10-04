#!/bin/bash

set -e

export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

grunt parallel:travis --reporters dots \
  --browsers SL_Chrome,SL_Safari,SL_IE_8,SL_IE_9,SL_IE_10 \
  --e2e-browsers SL_Chrome
