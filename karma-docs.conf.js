var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config, {testName: 'AngularJS: docs', logFile: 'karma-docs.log'});

  config.set({
    files: [
      'build/docs/components/jquery.js',
      'test/jquery_remove.js',

      'build/angular.js',
      'build/angular-cookies.js',
      'build/angular-mocks.js',
      'build/angular-resource.js',
      'build/angular-touch.js',
      'build/angular-sanitize.js',
      'build/angular-route.js',
      'build/angular-animate.js',

      'build/docs/components/lunr.js',
      'build/docs/components/google-code-prettify.js',
      'build/docs/components/marked.js',

      'build/docs/components/angular-bootstrap.js',
      'build/docs/components/angular-bootstrap-prettify.js',
      'build/docs/js/docs.js',
      'build/docs/docs-data.js',

      'docs/component-spec/mocks.js',
      'docs/component-spec/*.js'
    ],

    junitReporter: {
      outputFile: 'test_out/docs.xml',
      suite: 'Docs'
    }
  });
};
