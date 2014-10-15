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
  }
};
