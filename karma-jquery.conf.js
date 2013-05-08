var angularFiles = require(__dirname + '/angularFiles.js');

files = angularFiles.mergeFiles(JASMINE, JASMINE_ADAPTER, 'jstdJquery');
exclude = ['**/*jasmine*/**', '**/*jstd*/**'].concat(angularFiles.files.jstdJqueryExclude);

autoWatch = true;
logLevel = LOG_INFO;
logColors = true;
browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/jquery.xml',
  suite: 'jQuery'
};
