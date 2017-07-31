#!/bin/bash

set -e

export BROWSER_STACK_ACCESS_KEY=`echo $BROWSER_STACK_ACCESS_KEY | rev`
export SAUCE_ACCESS_KEY=`echo $SAUCE_ACCESS_KEY | rev`

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
  "unit")
    if [ "$BROWSER_PROVIDER" == "browserstack" ]; then
      BROWSERS="BS_Chrome,BS_Safari,BS_Firefox,BS_IE_9,BS_IE_10,BS_IE_11,BS_EDGE,BS_iOS_8,BS_iOS_9"
    else
      BROWSERS="SL_Chrome,SL_Firefox,SL_Safari_8,SL_Safari_9,SL_IE_9,SL_IE_10,SL_IE_11,SL_EDGE,SL_iOS"
    fi

    grunt test:promises-aplus
    grunt test:unit --browsers="$BROWSERS" --reporters=spec
    grunt tests:docs --browsers="$BROWSERS" --reporters=spec
    ;;
  "docs-e2e")
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
      grunt package
      grunt compress:firebaseCodeDeploy
    else
      echo "Skipping build because Travis has been triggered by Pull Request"
    fi
    ;;
  *)
    echo "Unknown job type. Please set JOB=ci-checks, JOB=unit, JOB=deploy or JOB=e2e-*."
    ;;
esac
