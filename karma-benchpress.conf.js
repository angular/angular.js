module.exports = function(config) {
  config.set({
    basePath: '',
    plugins: [
        require('karma-benchpress'),
        require('karma-jasmine'),
        require('karma-chrome-launcher')
    ],
    frameworks: ['jasmine', 'benchpress'],
    files: [
      'build/angular.js',
      'benchpress-build/largetable-bp/*',
      'test/benchpress/*.js'
    ],
    exclude: [
      'benchpress-build/**/bp.conf.js',
      'benchpress-build/**/bp.js',
      'benchpress-build/**/index.html',
      'benchpress-build/**/bootstrap.min.css'
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
