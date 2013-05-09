var angularFiles = require(__dirname + '/angularFiles.js');

files = angularFiles.mergeFiles(JASMINE, JASMINE_ADAPTER, 'jstdJquery');
files.push({pattern: 'src/ngLocale/*.js', included: false, served: true});

exclude = ['**/*jasmine*/**', '**/*jstd*/**'].concat(angularFiles.files.jstdJqueryExclude);

proxies =  {
  '/angular/i18n': 'http://localhost:9876/base/src/ngLocale'
};

autoWatch = true;
logLevel = LOG_INFO;
logColors = true;
browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/jquery.xml',
  suite: 'jQuery'
};
