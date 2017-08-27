'use strict';

var config = require('./protractor-shared-conf').config;

if (process.env.BROWSER_PROVIDER === 'browserstack') {
  // Using BrowserStack.
  config.seleniumAddress = 'http://hub.browserstack.com/wd/hub';
  config.multiCapabilities = [
    capabilitiesForBrowserStack({
      browserName: 'chrome',
      platform: 'MAC',
      version: '49'
    }),
    capabilitiesForBrowserStack({
      browserName: 'firefox',
      version: '47'
    }),
    capabilitiesForBrowserStack({
      browserName: 'safari',
      platform: 'MAC',
      version: '9'
    })
  ];
} else {
  // Using SauceLabs.
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.multiCapabilities = [
    capabilitiesForSauceLabs({
      browserName: 'chrome',
      platform: 'OS X 10.11',
      version: '48'
    }),
    capabilitiesForSauceLabs({
      browserName: 'firefox',
      version: '47'
    }),
    capabilitiesForSauceLabs({
      browserName: 'safari',
      platform: 'OS X 10.11',
      version: '9'
    })
  ];
}


config.allScriptsTimeout = 30000;
config.getPageTimeout = 30000;

exports.config = config;


function capabilitiesForBrowserStack(capabilities) {
  return {
    'browserstack.user': process.env.BROWSER_STACK_USERNAME,
    'browserstack.key': process.env.BROWSER_STACK_ACCESS_KEY,
    'browserstack.local': 'true',
    'browserstack.debug': 'true',
    'browserstack.tunnelIdentifier': process.env.TRAVIS_JOB_NUMBER,
    'tunnelIdentifier': process.env.TRAVIS_JOB_NUMBER,

    'name': 'AngularJS E2E',
    'build': process.env.TRAVIS_BUILD_NUMBER,

    'browserName': capabilities.browserName,
    'platform': capabilities.platform,
    'version': capabilities.version,
    'elementScrollBehavior': 1
  };
}

function capabilitiesForSauceLabs(capabilities) {
  return {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,

    'name': 'AngularJS E2E',
    'build': process.env.TRAVIS_BUILD_NUMBER,

    'browserName': capabilities.browserName,
    'platform': capabilities.platform,
    'version': capabilities.version,
    'elementScrollBehavior': 1
  };
}
