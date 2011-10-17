#!/bin/bash
if [ ! -e gen_docs.disable ]; then
  jasmine-node docs/spec --noColor && node docs/src/gen-docs.js
fi
