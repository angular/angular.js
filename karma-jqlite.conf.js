var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    files: angularFiles.mergeFilesFor('karma'),
    exclude: angularFiles.mergeFilesFor('karmaExclude'),

    junitReporter: {
      outputFile: 'test_out/jqlite.xml',
      suite: 'jqLite'
    }
  });

  config.sauceLabs.testName = 'AngularJS: jqLite';
};
