'use strict';

// Imports
var fs = require('fs');
var path = require('path');

// Constants
var PROJECT_ROOT = path.join(__dirname, '../../');
var NODE_MODULES_DIR = 'node_modules';
var NPM_SHRINKWRAP_FILE = 'npm-shrinkwrap.json';
var NPM_SHRINKWRAP_CACHED_FILE = NODE_MODULES_DIR + '/npm-shrinkwrap.cached.json';

// Run
_main();

// Functions - Definitions
function _main() {
  process.chdir(PROJECT_ROOT);
  copyFile(NPM_SHRINKWRAP_FILE, NPM_SHRINKWRAP_CACHED_FILE, onCopied);
}

// Implementation based on:
// https://stackoverflow.com/questions/11293857/fastest-way-to-copy-file-in-node-js#answer-21995878
function copyFile(srcPath, dstPath, callback) {
  var callbackCalled = false;

  if (!fs.existsSync(srcPath)) {
    done(new Error('Missing source file: ' + srcPath));
    return;
  }

  var rs = fs.createReadStream(srcPath);
  rs.on('error', done);

  var ws = fs.createWriteStream(dstPath);
  ws.on('error', done);
  ws.on('finish', done);

  rs.pipe(ws);

  // Helpers
  function done(err) {
    if (callback && !callbackCalled) {
      callbackCalled = true;
      callback(err);
    }
  }
}

function onCopied(err) {
  if (err) {
    var separator = new Array(81).join('!');

    console.error(separator);
    console.error(
        'Failed to copy `' + NPM_SHRINKWRAP_FILE + '` to `' + NPM_SHRINKWRAP_CACHED_FILE + '`:');
    console.error(err);
    console.error(separator);
  }
}
