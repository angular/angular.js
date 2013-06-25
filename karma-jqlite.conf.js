var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    files: angularFiles.mergeFiles('jstd'),
    exclude: angularFiles.files.jstdExclude,

    junitReporter: {
      outputFile: 'test_out/jqlite.xml',
      suite: 'jqLite'
    }
  });
};
