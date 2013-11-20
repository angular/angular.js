module.exports = function(config, specificOptions) {
  config.set({
    frameworks: ['jasmine'],
    autoWatch: true,
    logLevel: config.LOG_INFO,
    logColors: true,
    browsers: ['Chrome'],
    browserDisconnectTimeout: 10000,


    // config for Travis CI
    sauceLabs: {
      testName: specificOptions.testName || 'AngularJS',
      startConnect: false,
      tunnelIdentifier: process.env.TRAVIS_JOB_NUMBER
    },

    // BrowserStack config for Travis CI
    browserStack: {
      startTunnel: false
    },

    // For more browsers on Sauce Labs see:
    // https://saucelabs.com/docs/platforms/webdriver
    customLaunchers: {
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome'
      },
      'SL_Firefox': {
        base: 'SauceLabs',
        browserName: 'firefox'
      },
      'SL_Safari': {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'Mac 10.8',
        version: '6'
      },
      'SL_IE_8': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 7',
        version: '8'
      },
      'SL_IE_9': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2008',
        version: '9'
      },
      'SL_IE_10': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 2012',
        version: '10'
      },

      'BS_Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        os: 'OS X',
        os_version: 'Mountain Lion'
      },
      'BS_Safari': {
        base: 'BrowserStack',
        browser: 'safari',
        os: 'OS X',
        os_version: 'Mountain Lion'
      },
      'BS_Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        os: 'Windows',
        os_version: '8'
      },
      'BS_IE_8': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '8.0',
        os: 'Windows',
        os_version: '7'
      },
      'BS_IE_9': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '9.0',
        os: 'Windows',
        os_version: '7'
      },
      'BS_IE_10': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '10.0',
        os: 'Windows',
        os_version: '8'
      },
      'BS_IE_11': {
        base: 'BrowserStack',
        browser: 'ie',
        browser_version: '11.0',
        os: 'Windows',
        os_version: '8.1'
      }
    }
  });


  if (process.env.TRAVIS) {
    // Debug logging into a file, that we print out at the end of the build.
    config.loggers.push({
      type: 'file',
      filename: process.env.LOGS_DIR + '/' + (specificOptions.logFile || 'karma.log'),
      level: config.LOG_DEBUG
    });
  }
};
