'use strict';

var config = require('./protractor-shared-conf').config;

config.specs = [
  'test/e2e/tests/helpers/**/*.js',
  'test/e2e/tests/**/*Spec.js'
];

config.baseUrl = 'http://localhost:8000/';

config.capabilities = {
  browserName: 'chrome',
};

exports.config = config;
