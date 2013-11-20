#!/bin/bash

set -e

export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

grunt parallel:travis --reporters dots \
  --browsers BS_Chrome,BS_Safari,BS_Firefox,BS_IE_8,BS_IE_9,BS_IE_10,BS_IE_11 \
  --e2e-browsers BS_Chrome
