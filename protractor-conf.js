'use strict';

var config = require('./protractor-shared-conf').config;

config.specs = [
  'build/docs/ptore2e/**/*.js',
  'docs/app/e2e/docsAppE2E.js'
];

config.capabilities = {
  browserName: 'chrome',
};

exports.config = config;
