var angularFiles = require('./angularFiles');
var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    files: angularFiles.mergeFilesFor('karmaZepto'),
    exclude: angularFiles.mergeFilesFor('karmaZeptoExclude'),

    junitReporter: {
      outputFile: 'test_out/zepto.xml',
      suite: 'Zepto'
    }
  });

  config.sauceLabs.testName = 'AngularJS: Zepto';
};
