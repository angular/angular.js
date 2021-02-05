Firebase for code.angularjs.org
===============================

This folder contains the Google Firebase scripts for the `code.angularjs.org` setup.

`firebase.json` contains the rewrite rules that route every subdirectory request to the cloud function in `functions/index.js` that serves the docs from the Firebase Google Cloud Storage bucket.

`functions/index.js` also contains a rule that deletes outdated build zip files from the snapshot and snapshot-stable folders when new zip files are uploaded.

See `/scripts/docs.angularjs.org-firebase/readme.firebase.code.md` for the Firebase deployment to `docs.angularjs.org`.

# Continuous integration

The code is deployed to Google Firebase hosting and functions as well as to the Google Cloud Storage bucket automatically via CI.
See `.circleci/config.yml` for the complete deployment config and build steps.
