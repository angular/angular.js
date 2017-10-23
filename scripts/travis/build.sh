#!/bin/bash

set -e

export BROWSER_STACK_ACCESS_KEY
export SAUCE_ACCESS_KEY

BROWSER_STACK_ACCESS_KEY=$(echo "$BROWSER_STACK_ACCESS_KEY" | rev)
SAUCE_ACCESS_KEY=$(echo "$SAUCE_ACCESS_KEY" | rev)

BROWSERS="SL_Chrome,SL_Chrome-1,\
SL_Firefox,SL_Firefox-1,\
SL_Safari_8,SL_Safari_9,\
SL_iOS,\
SL_IE_9,SL_IE_10,SL_IE_11,\
SL_EDGE,SL_EDGE-1"

case "$JOB" in
  "ci-checks")
    grunt ci-checks

    if [[ $TRAVIS_PULL_REQUEST != 'false' ]]; then
      # validate commit messages of all commits in the PR
      # convert commit range to 2 dots, as commitplease uses `git log`.
      # See https://github.com/travis-ci/travis-ci/issues/4596 for more info
      echo "Validate commit messages in PR:"
      yarn run commitplease -- "${TRAVIS_COMMIT_RANGE/.../..}"
    fi
    ;;
  "unit-core")
    grunt test:promises-aplus
    grunt test:jqlite --browsers="$BROWSERS" --reporters=spec
    grunt test:modules --browsers="$BROWSERS" --reporters=spec
    ;;
  "unit-jquery")
    grunt test:jquery --browsers="$BROWSERS" --reporters=spec
    grunt test:jquery-2.2 --browsers="$BROWSERS" --reporters=spec
    grunt test:jquery-2.1 --browsers="$BROWSERS" --reporters=spec
    ;;
  "docs-app")
    grunt tests:docs --browsers="$BROWSERS" --reporters=spec
    grunt test:travis-protractor --specs="docs/app/e2e/**/*.scenario.js"
    ;;
  "e2e")
    if [[ $TEST_TARGET == jquery* ]]; then
      export USE_JQUERY=1
    fi

    export TARGET_SPECS="build/docs/ptore2e/**/default_test.js"

    if [[ "$TEST_TARGET" == jquery* ]]; then
      TARGET_SPECS="build/docs/ptore2e/**/jquery_test.js"
    fi

    export TARGET_SPECS="test/e2e/tests/**/*.js,$TARGET_SPECS"
    grunt test:travis-protractor --specs="$TARGET_SPECS"
    ;;
  "deploy")
    # we never deploy on Pull requests, so it's safe to skip the build here
    if [[ "$TRAVIS_PULL_REQUEST" == "false" ]]; then
      grunt prepareFirebaseDeploy
    else
      echo "Skipping build because Travis has been triggered by Pull Request"
    fi
    ;;
  *)
    echo "Unknown job type. Please set JOB to one of\
      'ci-checks',\
      'unit-core',\
      'unit-jquery',\
      'docs-app',\
      'e2e',\
      or\
      'deploy'."
    ;;
esac