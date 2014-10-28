'use strict';

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'test/e2e/tests/**/*.js',
    'build/docs/ptore2e/**/*.js',
    'docs/app/e2e/*.scenario.js'
  ],

  capabilities: {
    'browserName': 'chrome'
  },

  baseUrl: 'http://localhost:8000/',

  framework: 'jasmine',

  onPrepare: function() {
    /* global angular: false, browser: false, jasmine: false */

    // Disable animations so e2e tests run more quickly
    var disableNgAnimate = function() {
      angular.module('disableNgAnimate', []).run(['$animate', function($animate) {
        $animate.enabled(false);
      }]);
    };

    browser.addMockModule('disableNgAnimate', disableNgAnimate);

    require('jasmine-reporters');
    jasmine.getEnv().addReporter(
      new jasmine.JUnitXmlReporter('test_out/docs-e2e-' + exports.config.capabilities.browserName + '-', true, true));
  },

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000,
    showColors: false
  }
};
