var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config, {testName: 'AngularJS: jqLite', logFile: 'karma-jqlite.log'});

  config.set({
    files: angularFiles.mergeFilesFor('karma').concat({
      pattern: "test/fixtures/**/*.html",
      served: true,
      watched: true,
      included: false
    }),
    exclude: angularFiles.mergeFilesFor('karmaExclude'),

    junitReporter: {
      outputFile: 'test_out/jqlite.xml',
      suite: 'jqLite'
    }
  });
};
