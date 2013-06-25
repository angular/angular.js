var sharedConfig = require('./karma-shared.conf');

module.exports = function(config) {
  sharedConfig(config);

  config.set({
    frameworks: [],
    files: [
      'build/angular-scenario.js',
      'node_modules/karma-ng-scenario/lib/adapter.js',
      'build/docs/docs-scenario.js'
    ],

    proxies: {
      // angular.js, angular-resource.js, etc
      '/angular': 'http://localhost:8000/build/angular',
      '/': 'http://localhost:8000/build/docs/'
    },

    junitReporter: {
      outputFile: 'test_out/e2e.xml',
      suite: 'E2E'
    }
  });

  config.sauceLabs.testName = 'AngularJS: e2e';
};
