'use strict';

var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  var angularModule = process.env.KARMA_MODULE;

  sharedConfig(config, {testName: 'AngularJS: module ' + angularModule, logFile: 'karma-modules-' + angularModule + '.log'});

  config.set({
    files: angularFiles.mergeFilesFor('karmaModules-' + angularModule)
  });
};
