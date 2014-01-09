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

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  }
};
