'use strict';

var config = require('./protractor-shared-conf').config;


// Using SauceLabs.
config.capabilities = undefined;
config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;
config.multiCapabilities = [
  capabilitiesForSauceLabs({
    browserName: 'chrome',
    platform: 'OS X 10.14',
    version: '81'
  }),
  capabilitiesForSauceLabs({
    browserName: 'firefox',
    platform: 'OS X 10.14',
    version: '76'
  })
];


config.allScriptsTimeout = 30000;
config.getPageTimeout = 30000;

exports.config = config;


function capabilitiesForSauceLabs(capabilities) {
  return {
    'tunnel-identifier': process.env.SAUCE_TUNNEL_IDENTIFIER,

    'name': 'AngularJS E2E',
    'build': `${process.env.CIRCLE_BUILD_NUM}-${process.env.CIRCLE_NODE_INDEX}`,

    'browserName': capabilities.browserName,
    'platform': capabilities.platform,
    'version': capabilities.version,
    'elementScrollBehavior': 1,
    // Allow e2e test sessions to run for a maximum of 40 minutes, instead of the default 30 minutes.
    'maxDuration': 2400
  };
}
