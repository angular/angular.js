#!/bin/bash
. ~/.bashrc
node docs/spec/specs.js --noColor | grep -v '/lib/jasmine' && node docs/src/gen-docs.js
