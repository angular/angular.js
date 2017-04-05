#!/bin/bash

# Install nvm for this shell
source ~/.nvm/nvm.sh

# Use version of node.js found in .nvmrc
nvm install

# clean out and install yarn
rm -rf ~/.yarn
curl -o- -L https://yarnpkg.com/install.sh | bash -s -- --version 0.21.3
export PATH="$HOME/.yarn/bin:$PATH"

# Ensure that we have the local dependencies installed
yarn install

echo testing grunt version
yarn run grunt -- --version
