#!/bin/bash

set -e
PARENT_DIR="$(dirname "$0")"

../node_modules/.bin/jasmine-node "$PARENT_DIR"/spec/
