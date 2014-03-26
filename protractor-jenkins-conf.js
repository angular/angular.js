exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'build/docs/ptore2e/**/*.js',
    'test/e2e/docsAppE2E.js'
  ],

  capabilities: {
    'browserName': 'chrome'
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

    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('test_out/e2e-' + exports.config.capabilities.browserName + '-', true, true));
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    showColors: false
  }
};
