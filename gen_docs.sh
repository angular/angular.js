#!/usr/bin/env bash

JASMINE_NODE='jasmine-node'
local_jasmine='./node_modules/.bin/jasmine-node'

if ! type -p "$JASMINE_NODE" >/dev/null 2>&1;then
  if [[ -x "$local_jasmine" ]];then
    JASMINE_NODE="$local_jasmine"
  else
    echo 'Could not find a locally or globally installed executable of' \
         'jasmine-node. Try: `npm install jasmine-node`.' >&2
    exit 1
  fi
fi

if [[ ! -e gen_docs.disable ]]; then
  echo 'Testing, then building documentation...'
  "$JASMINE_NODE" docs/spec --noColor && node docs/src/gen-docs.js
fi
