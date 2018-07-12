'use strict';

var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(version) {
  version = version || '';

  return function(config) {
    sharedConfig(config, {
      testName: 'AngularJS: jQuery' + (version ? ' ' + version : ''),
      logFile: 'karma-jquery' + version + '.log'
    });

    config.set({
      files: angularFiles.mergeFilesFor('karmaJquery' + version),
      exclude: angularFiles.mergeFilesFor('karmaJqueryExclude'),

      junitReporter: {
        outputFile: 'test_out/jquery.xml',
        suite: 'jQuery'
      }
    });
  };
};
