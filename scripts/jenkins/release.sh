#!/bin/bash

# tags the current commit as a release and publishes all artifacts to
# the different repositories.
# Note: This will also works if the commit is in the past!

echo "#################################"
echo "#### cut release     ############"
echo "#################################"

ARG_DEFS=(
  # require the git dryrun flag so the script can't be run without
  # thinking about this!
  "--git-push-dryrun=(true|false)"
  # The sha to release. Needs to be the same as HEAD.
  # given as parameter to double check.
  "--commit-sha=(.*)"
  # the version number of the release.
  # e.g. 1.2.12 or 1.2.12-rc.1
  "--version-number=([0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?)"
  # the codename of the release
  "--version-name=(.+)"
)

function init {
  if [[ $(git rev-parse HEAD) != $(git rev-parse $COMMIT_SHA) ]]; then
    echo "HEAD is not at $COMMIT_SHA"
    usage
  fi

  if [[ ! $VERBOSE ]]; then
    VERBOSE=false
  fi
  VERBOSE_ARG="--verbose=$VERBOSE"
}

function build {
  cd ../..
  source scripts/jenkins/init-node.sh
  yarn run grunt -- ci-checks package --no-color

  cd $SCRIPT_DIR
}

function phase {
  ACTION_ARG="--action=$1"
  ../angular.js/tag-release.sh $ACTION_ARG $VERBOSE_ARG\
    --version-number=$VERSION_NUMBER --version-name=$VERSION_NAME\
    --commit-sha=$COMMIT_SHA

  if [[ $1 == "prepare" ]]; then
    # The build requires the tag to be set already!
    build
  fi

  ../code.angularjs.org/publish.sh $ACTION_ARG $VERBOSE_ARG
  ../bower/publish.sh $ACTION_ARG $VERBOSE_ARG
}

function run {
  # First prepare all scripts (build, commit, tag, ...),
  # so we are sure everything is all right
  phase prepare
  # only then publish to github
  phase publish
}

source $(dirname $0)/../utils.inc
