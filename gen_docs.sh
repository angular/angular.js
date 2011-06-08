#!/bin/bash
if [ ! -e gen_docs.disable ]; then
  /usr/bin/env node docs/spec/specs.js --noColor | grep -v '/lib/jasmine' && node docs/src/gen-docs.js
fi
