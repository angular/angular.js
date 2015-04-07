'use strict';

var fs = require('fs');
var path = require('path');
var url = require('url');

var root = path.resolve(__dirname, '..');
var tests = path.resolve(root, 'fixtures');

function stat(path) {
  try {
    return fs.statSync(path);
  } catch (e) {
    // Ignore ENOENT.
    if (e.code !== 'ENOENT') {
      throw e;
    }
  }
}

function testExists(testname) {
  var s = stat(path.resolve(tests, testname));
  return s && s.isDirectory();
}

function rewriteTestFile(testname, testfile) {
  if (testfile.search(/^https?:\/\//) === 0) {
    return testfile;
  }

  var i = 0;
  while (testfile[i] === '/') ++i;
  testfile = testfile.slice(i);
  var s = stat(path.resolve(tests, testname, testfile));
  if (s && (s.isFile() || s.isDirectory())) {
    return ['/test/e2e/fixtures', testname, testfile].join('/');
  }
  return false;
}

module.exports = {
  stat: stat,
  testExists: testExists,
  rewriteTestFile: rewriteTestFile
};
