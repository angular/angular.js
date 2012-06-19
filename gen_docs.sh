#!/usr/bin/env bash

if [[ ! -e gen_docs.disable ]]; then
  echo 'Testing, then building documentation...'
  jasmine-node docs/spec --noColor && node docs/src/gen-docs.js
fi

