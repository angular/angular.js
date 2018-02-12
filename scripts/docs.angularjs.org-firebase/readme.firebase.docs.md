Firebase for docs.angularjs.org
===============================

# Continuous integration

The docs are deployed to Google Firebase hosting via Travis deployment config, which expects
firebase.json in the repository root, which is done by a Grunt task (firebaseDocsJsonForTravis)
that modifies the paths in the firebase.json and copies it into the repository root.

See travis.yml for the complete deployment config, and scripts/travis/build.sh for the full deployment
build steps.

# Serving locally:

- Run `grunt:prepareDeploy`.
  This copies docs content files into deploy/docs and the partials for Search Engine AJAX
  Crawling into ./functions/content.

- Run `firebase serve --only functions,hosting`
  Creates a server at localhost:5000 that serves from deploy/docs and uses the local function

See /scripts/code.angularjs.org-firebase/readme.firebase.code.md for the firebase deployment to
code.angularjs.org
