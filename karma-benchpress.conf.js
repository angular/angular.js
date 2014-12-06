module.exports = function(config) {
  'use strict';
  config.set({
    basePath: '',
    plugins: [
        require('karma-benchpress'),
        require('karma-jasmine'),
        require('karma-chrome-launcher')
    ],
    frameworks: ['jasmine', 'benchpress'],
    files: [
      'benchmarks/helpers.js',
      'build/angular.js',
      'build/benchmarks/largetable-bp/*',
      'benchmarks/*.spec.js'
    ],
    exclude: [
      'build/benchmarks/**/bp.conf.js',
      'build/benchmarks/**/bp.js',
      'build/benchmarks/**/index.html',
      'build/benchmarks/**/bootstrap.min.css'
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browserNoActivityTimeout: 90000,
    browsers: ['ChromeCanaryPerf'],
    customLaunchers: {
        ChromeCanaryPerf: {
            base: 'ChromeCanary',
            flags: [
                '--enable-memory-info ',
                '--enable-precise-memory-info ',
                '--enable-memory-benchmarking ',
                '--js-flags="--expose-gc"',
                '-incognito'
            ]
        }
    },
    singleRun: false
  });
};
