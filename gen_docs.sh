#!/bin/bash
if [ ! -e gen_docs.disable ]; then
  /usr/bin/env jasmine-node docs/spec -i docs/src -i lib --noColor && node docs/src/gen-docs.js
fi
