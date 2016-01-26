// Implementation based on:
// https://github.com/angular/angular/blob/3b9c08676a4c921bbfa847802e08566fb601ba7a/tools/npm/check-node-modules.js
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
  var purgeIfStale = process.argv.indexOf('--purge') !== -1;

  process.chdir(PROJECT_ROOT);
  checkNodeModules(purgeIfStale);
}

function checkNodeModules(purgeIfStale) {
  var nodeModulesOk = compareMarkerFiles(NPM_SHRINKWRAP_FILE, NPM_SHRINKWRAP_CACHED_FILE);

  if (nodeModulesOk) {
    console.log(':-) npm dependencies are looking good!');
  } else if (purgeIfStale) {
    console.log(':-( npm dependencies are stale or in an unknown state!');
    console.log('    Purging \'' + NODE_MODULES_DIR + '\'...');
    deleteDirSync(NODE_MODULES_DIR);
  } else {
    var separator = new Array(81).join('!');

    console.warn(separator);
    console.warn(':-( npm dependencies are stale or in an unknown state!');
    console.warn('You can rebuild the dependencies by running `npm install`.');
    console.warn(separator);
  }

  return nodeModulesOk;
}

function compareMarkerFiles(markerFilePath, cachedMarkerFilePath) {
  if (!fs.existsSync(cachedMarkerFilePath)) return false;

  var opts = {encoding: 'utf-8'};
  var markerContent = fs.readFileSync(markerFilePath, opts);
  var cachedMarkerContent = fs.readFileSync(cachedMarkerFilePath, opts);

  return markerContent === cachedMarkerContent;
}

// Custom implementation of `rm -rf` that works consistently across OSes
function deleteDirSync(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(deleteDirOrFileSync);
    fs.rmdirSync(path);
  }

  // Helpers
  function deleteDirOrFileSync(subpath) {
    var curPath = path + '/' + subpath;

    if (fs.lstatSync(curPath).isDirectory()) {
      deleteDirSync(curPath);
    } else {
      fs.unlinkSync(curPath);
    }
  }
}
