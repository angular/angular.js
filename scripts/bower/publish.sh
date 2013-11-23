#!/bin/bash

#
# update all the things
#

set -e # fail if any command fails

cd `dirname $0`

NEW_VERSION=$1

ZIP_FILE=angular-$NEW_VERSION.zip
ZIP_FILE_URL=http://code.angularjs.org/$NEW_VERSION/angular-$NEW_VERSION.zip
ZIP_DIR=angular-$NEW_VERSION

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


#
# download and unzip the file
#

#wget $ZIP_FILE_URL
unzip $ZIP_FILE


#
# move the files from the zip
#

for repo in "${REPOS[@]}"
do
  if [ -f $ZIP_DIR/$repo.js ] # ignore i18l
    then
      cd bower-$repo
      git checkout master
      git reset --hard HEAD
      cd ..
      mv $ZIP_DIR/$repo.* bower-$repo/
  fi
done

# move i18n files
mv $ZIP_DIR/i18n/*.js bower-angular-i18n/

# move csp.css
mv $ZIP_DIR/angular-csp.css bower-angular


#
# get the old version number
#

OLD_VERSION=$(node -e "console.log(require('./bower-angular/bower').version)" | sed -e 's/\r//g')
echo $OLD_VERSION
echo $NEW_VERSION

#
# update bower.json
# tag each repo
#

for repo in "${REPOS[@]}"
do
  cd bower-$repo
  pwd
  sed -i '' -e "s/$OLD_VERSION/$NEW_VERSION/g" bower.json
  git add -A
  git commit -m "v$NEW_VERSION"
  git tag v$NEW_VERSION
  git push origin master
  git push origin v$NEW_VERSION
  cd ..
done
