var config = require('./protractor-shared-conf').config;

config.sauceUser = process.env.SAUCE_USERNAME;
config.sauceKey = process.env.SAUCE_ACCESS_KEY;

config.multiCapabilities = [{
  'browserName': 'chrome',
  'name': 'Angular E2E',
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  'build': process.env.TRAVIS_BUILD_NUMBER
}, {
  'browserName': 'firefox',
  'name': 'Angular E2E',
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  'build': process.env.TRAVIS_BUILD_NUMBER,
  'version': '28'
}, {
  browserName: 'safari',
  'platform': 'OS X 10.9',
  'version': '7',
  'name': 'Angular E2E',
  'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
  'build': process.env.TRAVIS_BUILD_NUMBER
}];

exports.config = config;
