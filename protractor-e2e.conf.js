'use strict';

var config = require('./protractor-shared-conf').config;

config.specs = [
  'test/e2e/tests/**/*.js'
];

config.baseUrl = 'http://localhost:8000/e2e/';

config.capabilities = {
  browserName: 'chrome',
};

exports.config = config;
