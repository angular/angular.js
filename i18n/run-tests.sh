#!/bin/bash

set -e
PARENT_DIR="$(dirname "$0")"
jasmine-node "$PARENT_DIR"/spec/
