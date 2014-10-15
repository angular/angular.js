'use strict';

var fs = require('fs');
var path = require('path');
var url = require('url');

var root = path.resolve(__dirname, '..');
var tests = path.resolve(root, 'tests');

module.exports = {
  testExists: function(testname) {
    testname = path.resolve(tests, testname);
    return fs.statSync(testname).isDirectory();
  },

  rewriteTestFile: function(testname, testfile) {
    var i = 0;
    while (testfile[i] === '/') ++i;
    testfile = testfile.slice(i);
    var stat = fs.statSync(path.resolve(tests, testname, testfile));
    if (stat && stat.isFile() || stat.isDirectory()) {
      return ['/test/e2e/tests', testname, testfile].join('/');
    }
    return false;
  }
};
