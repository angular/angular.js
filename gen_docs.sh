#!/bin/bash 
. ~/.bashrc
node docs/spec/specs.js --noColor && node docs/src/gen-docs.js
