exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'build/docs/ptore2e/**/*jquery_test.js',
    'test/e2e/docsAppE2E.js'
  ],

  capabilities: {
    'browserName': 'chrome',
    'name': 'Angular E2E: jquery'
  },

  baseUrl: 'http://localhost:8000/build/docs/',

  framework: 'jasmine',

  onPrepare: function() {
    // Disable animations so e2e tests run more quickly
    var disableNgAnimate = function() {
      angular.module('disableNgAnimate', []).run(function($animate) {
        $animate.enabled(false);
      });
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
