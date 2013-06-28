var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    files: angularFiles.mergeFilesFor('karmaModules', 'angularSrcModules'),

    junitReporter: {
      outputFile: 'test_out/modules.xml',
      suite: 'modules'
    }
  });

  config.sauceLabs.testName = 'AngularJS: modules';
};
