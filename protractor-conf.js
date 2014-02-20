var config = require('./protractor-shared-conf').config;

config.specs = [
  'build/docs/ptore2e/**/*.js',
  'test/e2e/docsAppE2E.js'
];

config.capabilities = {
  browserName: 'chrome',
};

exports.config = config;
