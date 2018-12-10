'use strict';

var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config, {testName: 'AngularJS: isolated module tests (ngMock)', logFile: 'karma-ngMock-isolated.log'});

  config.set({
    files: angularFiles.mergeFilesFor('karmaModules-ngMock')
  });
};
