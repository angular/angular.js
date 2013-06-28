var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    files: angularFiles.mergeFilesFor('karmaJquery'),
    exclude: angularFiles.mergeFilesFor('karmaJqueryExclude'),

    junitReporter: {
      outputFile: 'test_out/jquery.xml',
      suite: 'jQuery'
    }
  });
};
