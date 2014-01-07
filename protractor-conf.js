exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'build/docs/ptore2e/**/*.js',
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
