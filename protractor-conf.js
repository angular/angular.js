'use strict';

var config = require('./protractor-shared-conf').config;

config.specs = [
  'test/e2e/tests/**/*.js',
  'build/docs/ptore2e/**/*.js',
  'docs/app/e2e/**/*.scenario.js'
];

config.capabilities.browserName = 'chrome';

config.directConnect = true;

exports.config = config;
