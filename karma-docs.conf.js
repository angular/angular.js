var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    files: [
      'build/docs/components/jquery.js',
      'test/jquery_remove.js',

      'build/angular.js',
      'build/angular-cookies.js',
      'build/angular-mocks.js',
      'build/angular-resource.js',
      'build/angular-mobile.js',
      'build/angular-sanitize.js',
      'build/angular-route.js',

      'build/docs/components/lib/lunr.js/lunr.js',
      'build/docs/components/lib/google-code-prettify/src/prettify.js',
      'build/docs/components/showdown.js',

      'build/docs/components/angular-bootstrap.js',
      'build/docs/components/angular-bootstrap-prettify.js',
      'build/docs/js/docs.js',
      'build/docs/docs-data.js',

      'docs/component-spec/*.js'
    ],

    junitReporter: {
      outputFile: 'test_out/docs.xml',
      suite: 'Docs'
    }
  });
};
