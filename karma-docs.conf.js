files = [
  JASMINE,
  JASMINE_ADAPTER,

  'build/docs/components/jquery.js',
  'test/jquery_remove.js',

  'build/angular.js',
  'build/angular-cookies.js',
  'build/angular-mocks.js',
  'build/angular-resource.js',
  'build/angular-mobile.js',
  'build/angular-sanitize.js',

  'build/docs/components/lib/lunr.js/lunr.js',
  'build/docs/components/lib/google-code-prettify/src/prettify.js',

  'build/docs/components/angular-bootstrap.js',
  'build/docs/components/angular-bootstrap-prettify.js',
  'build/docs/js/docs.js',
  'build/docs/docs-keywords.js',

  'docs/component-spec/*.js'
];

autoWatch = true;
logLevel = LOG_INFO;
logColors = true;
browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/docs.xml',
  suite: 'Docs'
};
