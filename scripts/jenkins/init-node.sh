#!/bin/bash

# Install nvm for this shell
source ~/.nvm/nvm.sh

# Use version of node.js found in .nvmrc
nvm install

# clean out and install yarn
rm -rf ~/.yarn
curl -o- -L https://raw.githubusercontent.com/yarnpkg/yarn/2a0afc73210c7a82082585283e518eeb88ca19ae/scripts/install-latest.sh | bash -s -- --version 0.17.9

# Ensure we have the correct global grunt installed
yarn global add grunt-cli@1.2.0 --exact

# Ensure that we have the local dependencies installed
yarn install