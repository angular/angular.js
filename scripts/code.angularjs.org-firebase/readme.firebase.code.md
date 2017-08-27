Firebase for code.angularjs.org
===============================

This folder contains the Google Firebase scripts for the code.angularjs.org setup.

firebase.json contains the rewrite rules that route every subdirectory request to the cloud function
in functions/index.js that serves the docs from the Firebase Google Cloud Storage bucket.

The deployment to the Google Cloud Storage bucket happens automatically via Travis. See the travis.yml
file in the repository root.

See /readme.firebase.docs.md for the firebase deployment to docs.angularjs.org