'use strict';

var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config, {testName: 'AngularJS: docs', logFile: 'karma-docs.log'});

  config.set({
    files: [
      'build/angular.js',
      'build/angular-mocks.js',
      'docs/app/src/**/*.js',
      'docs/app/test/**/*Spec.js'
    ],

    junitReporter: {
      outputFile: 'test_out/docs.xml',
      suite: 'Docs'
    }
  });
};
