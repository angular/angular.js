var angularFiles = require(__dirname + '/angularFiles.js');

files = [ANGULAR_SCENARIO, ANGULAR_SCENARIO_ADAPTER, 'build/docs/docs-scenario.js'];

autoWatch = false;
singleRun = true;
logLevel = LOG_INFO;
logColors = true;
browsers = ['Chrome'];

proxies = {
  // angular.js, angular-resource.js, etc
  '/angular': 'http://localhost:8000/build/angular',
  '/': 'http://localhost:8000/build/docs/'
};

junitReporter = {
  outputFile: 'test_out/e2e.xml',
  suite: 'E2E'
};
