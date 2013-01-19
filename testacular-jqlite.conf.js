var angularFiles = require(__dirname + '/angularFiles.js');

files = angularFiles.mergeFiles(JASMINE, JASMINE_ADAPTER, 'jstd');
exclude = ['**/*jasmine*/**', '**/*jstd*/**'].concat(angularFiles.files.jstdExclude);

autoWatch = true;
logLevel = LOG_INFO;
logColors = true;
browsers = ['Chrome'];

junitReporter = {
  outputFile: 'test_out/jqlite.xml',
  suite: 'jqLite'
};
