Firebase for docs.angularjs.org
===============================

This folder contains the Google Firebase scripts for the `docs.angularjs.org` setup.

See `/scripts/code.angularjs.org-firebase/readme.firebase.code.md` for the Firebase deployment to `code.angularjs.org`.

# Continuous integration

The docs are deployed to Google Firebase hosting and functions automatically via CI.

See `.circleci/config.yml` for the complete deployment config and build steps.

# Serving locally:

- Run `cd scripts/docs.angularjs.org-firebase`.
  This changes the current working directory.

- Run `yarn grunt package`.
  This builds the files that will be deployed.

- Run `yarn grunt prepareDeploy`.
  This copies docs content files into `./deploy` and the partials for Search Engine AJAX Crawling into `./functions/content`.

- Run `$(yarn bin)/firebase emulators:start` (or `..\..\node_modules\.bin\firebase emulators:start` on Windows).
  Creates a server at http://localhost:5000 that serves from `./deploy` and uses the local function.
