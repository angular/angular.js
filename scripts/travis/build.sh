#!/bin/bash

set -e

export BROWSER_STACK_ACCESS_KEY
export SAUCE_ACCESS_KEY

BROWSER_STACK_ACCESS_KEY=$(echo "$BROWSER_STACK_ACCESS_KEY" | rev)
SAUCE_ACCESS_KEY=$(echo "$SAUCE_ACCESS_KEY" | rev)

BROWSERS="SL_Chrome,SL_Chrome-1,\
SL_Firefox,SL_Firefox-1,\
SL_Safari,SL_Safari-1,\
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

    if [[ "$TEST_TARGET" == jquery* ]]; then
      TARGET_SPECS="build/docs/ptore2e/**/jquery_test.js"
    else
      TARGET_SPECS="build/docs/ptore2e/**/default_test.js"
    fi

    TARGET_SPECS="test/e2e/tests/**/*.js,$TARGET_SPECS"
    grunt test:travis-protractor --specs="$TARGET_SPECS"
    ;;
  "deploy")
    export DEPLOY_DOCS
    export DEPLOY_CODE

    DIST_TAG=$( jq ".distTag" "package.json" | tr -d "\"[:space:]" )

    # upload docs if the branch distTag from package.json is "latest" (i.e. stable branch)
    if [[ "$DIST_TAG" == latest ]]; then
      DEPLOY_DOCS=true
    else
      DEPLOY_DOCS=false
    fi

    # upload the build (code + docs) if ...
    #   the commit is tagged
    #   - or the branch is "master"
    #   - or the branch distTag from package.json is "latest" (i.e. stable branch)
    if [[ "$TRAVIS_TAG" != '' || "$TRAVIS_BRANCH" == master || "$DIST_TAG" == latest ]]; then
      DEPLOY_CODE=true
    else
      DEPLOY_CODE=false
    fi

    if [[ "$DEPLOY_DOCS" == true || "$DEPLOY_CODE" == true ]]; then
      grunt prepareDeploy
    else
      echo "Skipping deployment build because conditions have not been met."
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