#!/bin/bash

#
# init all of the bower repos
#

set -e # fail if any command fails

REPOS=(
  angular           \
  angular-animate   \
  angular-cookies   \
  angular-i18n      \
  angular-loader    \
  angular-mocks     \
  angular-route     \
  angular-resource  \
  angular-sanitize  \
  angular-scenario  \
  angular-touch     \
)

cd `dirname $0`

for repo in "${REPOS[@]}"
do
  git clone git@github.com:angular/bower-$repo.git
done
