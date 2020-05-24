Firebase for docs.angularjs.org
===============================

# Continuous integration

The docs are deployed to Google Firebase hosting via a CI deployment config, which expects
firebase.json to be in the repository root, which is done by a Grunt task
(`firebaseDocsJsonForCI` which is included in `prepareDeploy`).
The `firebaseDocsJsonForCI` task modifies the paths in the `firebase.json` and copies it to the
repository root.

See .circleci/config.yml for the complete deployment config and build steps.

# Serving locally:

- Run `yarn grunt package`.
  This builds the files that will be deployed.

- Run `yarn grunt prepareDeploy`.
  This copies docs content files into deploy/docs and the partials for Search Engine AJAX
  Crawling into ./functions/content.
  It also moves the firebase.json file to the root folder, where the firebase-cli expects it

- Run `firebase serve --only functions,hosting`
  Creates a server at localhost:5000 that serves from deploy/docs and uses the local function

See /scripts/code.angularjs.org-firebase/readme.firebase.code.md for the firebase deployment to
code.angularjs.org
