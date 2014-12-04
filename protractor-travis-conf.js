'use strict';

var config = require('./protractor-shared-conf').config;

if (process.env.BROWSER_PROVIDER === 'browserstack') {
  // Using BrowserStack.
  config.seleniumAddress = 'http://hub.browserstack.com/wd/hub';
  config.multiCapabilities = [
    capabilitiesForBrowserStack({
      browserName: 'chrome',
      platform: 'MAC',
      version: '34'
    }),
    capabilitiesForBrowserStack({
      browserName: 'firefox',
      version: '28'
    }),
    capabilitiesForBrowserStack({
      browserName: 'safari',
      platform: 'MAC',
      version: '7'
    })
  ];
} else {
  // Using SauceLabs.
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.multiCapabilities = [
    capabilitiesForSauceLabs({
      browserName: 'chrome',
      platform: 'OS X 10.9',
      version: '34'
    }),
    capabilitiesForSauceLabs({
      browserName: 'firefox',
      version: '28'
    }),
    capabilitiesForSauceLabs({
      browserName: 'safari',
      platform: 'OS X 10.9',
      version: '7'
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
    'browserstack.local' : 'true',
    'browserstack.debug': 'true',
    'browserstack.tunnelIdentifier': process.env.TRAVIS_JOB_NUMBER,
    'tunnelIdentifier': process.env.TRAVIS_JOB_NUMBER,

    'name': 'Angular E2E',
    'build': process.env.TRAVIS_BUILD_NUMBER,

    'browserName': capabilities.browserName,
    'platform': capabilities.platform,
    'version': capabilities.version
  };
}

function capabilitiesForSauceLabs(capabilities) {
  return {
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,

    'name': 'Angular E2E',
    'build': process.env.TRAVIS_BUILD_NUMBER,

    'browserName': capabilities.browserName,
    'platform': capabilities.platform,
    'version': capabilities.version
  };
}
