'use strict';

module.exports = function(config, specificOptions) {
  config.set({
    frameworks: ['jasmine'],
    autoWatch: true,
    logLevel: config.LOG_INFO,
    logColors: true,
    browsers: ['Chrome'],
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 2,
    browserNoActivityTimeout: 30000,


    // SauceLabs config for local development.
    sauceLabs: {
      testName: specificOptions.testName || 'AngularJS',
      startConnect: true,
      options: {
        'selenium-version': '2.41.0'
      }
    },

    // BrowserStack config for local development.
    browserStack: {
      project: 'AngularJS',
      name: specificOptions.testName,
      startTunnel: true,
      timeout: 600 // 10min
    },

    // For more browsers on Sauce Labs see:
    // https://saucelabs.com/docs/platforms/webdriver
    customLaunchers: {
      'SL_Chrome': {
        base: 'SauceLabs',
        browserName: 'chrome',
        version: '39'
      },
      'SL_Firefox': {
        base: 'SauceLabs',
        browserName: 'firefox',
        version: '31'
      },
      'SL_Safari': {
        base: 'SauceLabs',
        browserName: 'safari',
        platform: 'OS X 10.10',
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
      'SL_IE_11': {
        base: 'SauceLabs',
        browserName: 'internet explorer',
        platform: 'Windows 8.1',
        version: '11'
      },
      'SL_iOS': {
        base: "SauceLabs",
        browserName: "iphone",
        platform: "OS X 10.10",
        version: "8.1"
      },

      'BS_Chrome': {
        base: 'BrowserStack',
        browser: 'chrome',
        os: 'OS X',
        os_version: 'Yosemite'
      },
      'BS_Safari': {
        base: 'BrowserStack',
        browser: 'safari',
        os: 'OS X',
        os_version: 'Yosemite'
      },
      'BS_Firefox': {
        base: 'BrowserStack',
        browser: 'firefox',
        os: 'Windows',
        os_version: '8'
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
      },
      'BS_iOS': {
        base: 'BrowserStack',
        device: 'iPhone 6',
        os: 'ios',
        os_version: '8.0'
      }
    }
  });


  if (process.env.TRAVIS) {
    var buildLabel = 'TRAVIS #' + process.env.TRAVIS_BUILD_NUMBER + ' (' + process.env.TRAVIS_BUILD_ID + ')';

    config.logLevel = config.LOG_DEBUG;
    // Karma (with socket.io 1.x) buffers by 50 and 50 tests can take a long time on IEs;-)
    config.browserNoActivityTimeout = 120000;

    config.browserStack.build = buildLabel;
    config.browserStack.startTunnel = false;
    config.browserStack.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;

    config.sauceLabs.build = buildLabel;
    config.sauceLabs.startConnect = false;
    config.sauceLabs.tunnelIdentifier = process.env.TRAVIS_JOB_NUMBER;
    config.sauceLabs.recordScreenshots = true;

    // Debug logging into a file, that we print out at the end of the build.
    config.loggers.push({
      type: 'file',
      filename: process.env.LOGS_DIR + '/' + (specificOptions.logFile || 'karma.log')
    });

    if (process.env.BROWSER_PROVIDER === 'saucelabs' || !process.env.BROWSER_PROVIDER) {
      // Allocating a browser can take pretty long (eg. if we are out of capacity and need to wait
      // for another build to finish) and so the `captureTimeout` typically kills
      // an in-queue-pending request, which makes no sense.
      config.captureTimeout = 0;
    }
  }


  // Terrible hack to workaround inflexibility of log4js:
  // - ignore web-server's 404 warnings,
  // - ignore DEBUG logs (on Travis), we log them into a file instead.
  var IGNORED_404 = [
    '/favicon.ico',
    '/%7B%7BtestUrl%7D%7D',
    '/someSanitizedUrl',
    '/{{testUrl}}'
  ];
  var log4js = require('./node_modules/karma/node_modules/log4js');
  var layouts = require('./node_modules/karma/node_modules/log4js/lib/layouts');
  var originalConfigure = log4js.configure;
  log4js.configure = function(log4jsConfig) {
    var consoleAppender = log4jsConfig.appenders.shift();
    var originalResult = originalConfigure.call(log4js, log4jsConfig);
    var layout = layouts.layout(consoleAppender.layout.type, consoleAppender.layout);



    log4js.addAppender(function(log) {
      var msg = log.data[0];

      // ignore web-server's 404s
      if (log.categoryName === 'web-server' && log.level.levelStr === config.LOG_WARN &&
          IGNORED_404.some(function(ignoredLog) {return msg.indexOf(ignoredLog) !== -1;})) {
        return;
      }

      // on Travis, ignore DEBUG statements
      if (process.env.TRAVIS && log.level.levelStr === config.LOG_DEBUG) {
        return;
      }

      console.log(layout(log));
    });

    return originalResult;
  };
};
