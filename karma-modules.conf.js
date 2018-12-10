'use strict';

var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config, {testName: 'AngularJS: isolated module tests', logFile: 'karma-modules-isolated.log'});

  config.set({
    files: [
      'build/angular.js',
      'build/angular-mocks.js',
      'test/modules/no_bootstrap.js',
      'test/helpers/matchers.js',
      'test/helpers/privateMocks.js',
      'test/helpers/support.js',
      'test/helpers/testabilityPatch.js',
      'build/test-bundles/angular-*.js'
    ]
  });
};
