#!/bin/bash

set -e

mkdir -p "$LOGS_DIR"

if [ "$JOB" != "ci-checks" ]; then
  echo "start_browser_provider"
  ./scripts/travis/start_browser_provider.sh
fi

# ci-checks and unit tests do not run against the packaged code
if [[ "$JOB" != "ci-checks" ]] && [[ "$JOB" != unit-* ]]; then
  yarn grunt package
fi

# unit runs the docs tests too which need a built version of the code
if [[ "$JOB" = unit-* ]]; then
  yarn grunt validate-angular-files
  yarn grunt build
fi

# check this after the package, because at this point the browser_provider
# has probably arrived
if [ "$JOB" != "ci-checks" ]; then
  echo "wait_for_browser_provider"
  ./scripts/travis/wait_for_browser_provider.sh
fi
