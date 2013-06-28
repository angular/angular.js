var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    files: angularFiles.mergeFiles('jstdJquery'),
    exclude: angularFiles.files.jstdJqueryExclude,

    junitReporter: {
      outputFile: 'test_out/jquery.xml',
      suite: 'jQuery'
    }
  });
};
