#!/usr/bin/env bash

# Variables
readonly projectDir=$(realpath "$(dirname ${BASH_SOURCE[0]})/..")
readonly envHelpersPath="$projectDir/.circleci/env-helpers.inc.sh";

# Load helpers and make them available everywhere (through `$BASH_ENV`).
source $envHelpersPath;
echo "source $envHelpersPath;" >> $BASH_ENV;

####################################################################################################
# Define PUBLIC environment variables for CircleCI.
####################################################################################################
# See https://circleci.com/docs/2.0/env-vars/#built-in-environment-variables for more info.
####################################################################################################
setPublicVar CI "$CI"
setPublicVar PROJECT_ROOT "$projectDir";
# This is the branch being built; e.g. `pull/12345` for PR builds.
setPublicVar CI_BRANCH "$CIRCLE_BRANCH";
setPublicVar CI_BUILD_URL "$CIRCLE_BUILD_URL";
setPublicVar CI_COMMIT "$CIRCLE_SHA1";
setPublicVar CI_GIT_BASE_REVISION "${CIRCLE_GIT_BASE_REVISION}";
setPublicVar CI_GIT_REVISION "${CIRCLE_GIT_REVISION}";
setPublicVar CI_GIT_TAG "${CIRCLE_TAG:-false}";
setPublicVar CI_COMMIT_RANGE "$CIRCLE_GIT_BASE_REVISION..$CIRCLE_GIT_REVISION";
setPublicVar CI_PULL_REQUEST "${CIRCLE_PR_NUMBER:-false}";
setPublicVar CI_REPO_NAME "$CIRCLE_PROJECT_REPONAME";
setPublicVar CI_REPO_OWNER "$CIRCLE_PROJECT_USERNAME";
setPublicVar CI_PR_REPONAME "$CIRCLE_PR_REPONAME";
setPublicVar CI_PR_USERNAME "$CIRCLE_PR_USERNAME";


####################################################################################################
# Define SauceLabs environment variables for CircleCI.
####################################################################################################
setPublicVar BROWSER_PROVIDER "saucelabs"

# The currently latest-1 version of desktop Safari on Saucelabs (v12.0) is unstable and disconnects
# consistently. The latest version (v12.1) works fine.
# TODO: Add `SL_Safari-1` back, once it no longer corresponds to v12.0.
setPublicVar BROWSERS "SL_Chrome,SL_Chrome-1,\
SL_Firefox,SL_Firefox-1,\
SL_Safari,\
SL_iOS,SL_iOS-1,\
SL_IE_9,SL_IE_10,SL_IE_11,\
SL_EDGE,SL_EDGE-1"

setPublicVar SAUCE_LOG_FILE /tmp/angular/sauce-connect.log
setPublicVar SAUCE_READY_FILE /tmp/angular/sauce-connect-ready-file.lock
setPublicVar SAUCE_PID_FILE /tmp/angular/sauce-connect-pid-file.lock
setPublicVar SAUCE_TUNNEL_IDENTIFIER "angularjs-framework-${CIRCLE_BUILD_NUM}-${CIRCLE_NODE_INDEX}"
# Amount of seconds we wait for sauceconnect to establish a tunnel instance. In order to not
# acquire CircleCI instances for too long if sauceconnect failed, we need a connect timeout.
setPublicVar SAUCE_READY_FILE_TIMEOUT 120

####################################################################################################
# Define additional environment variables
####################################################################################################

# NOTE: Make sure the tools used to compute this are available in all executors in `config.yml`.
setPublicVar DIST_TAG $( cat package.json | grep distTag | sed -E 's/^\s*"distTag"\s*:\s*"([^"]+)"\s*,\s*$/\1/' )

####################################################################################################
####################################################################################################
##                  Source `$BASH_ENV` to make the variables available immediately.               ##
##                  *** NOTE: This must remain the last command in this script. ***               ##
####################################################################################################
####################################################################################################
source $BASH_ENV;
