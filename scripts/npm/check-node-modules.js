// Implementation based on
// https://github.com/angular/angular/blob/3b9c08676a4c921bbfa847802e08566fb601ba7a/tools/npm/check-node-modules.js
'use strict';

// Imports
var fs = require('fs');
var path = require('path');

// Constants
var NPM_SHRINKWRAP_FILE = 'npm-shrinkwrap.json';
var NPM_SHRINKWRAP_CACHED_FILE = 'node_modules/npm-shrinkwrap.cached.json';
var FS_OPTS = {encoding: 'utf-8'};
var PROJECT_ROOT = path.join(__dirname, '../../');

// Variables
var progressIndicatorTimer = null;

// Run
_main();

// Functions - Definitions
function _main() {
  var reinstallIfStale = process.argv.indexOf('--reinstall') !== -1;
  checkNodeModules(reinstallIfStale);
}

function cacheNpmShrinkwrapFile() {
  var absoluteMarkerFilePath = path.join(PROJECT_ROOT, NPM_SHRINKWRAP_FILE);
  var absoluteCachedMarkerFilePath = path.join(PROJECT_ROOT, NPM_SHRINKWRAP_CACHED_FILE);

  startProgressIndicator('    Caching marker file...');
  copyFile(absoluteMarkerFilePath, absoluteCachedMarkerFilePath, onCopied);

  // Helpers
  function onCopied(err) {
    stopProgressIndicator();
    if (err) logError(err);
  }
}

function checkNodeModules(reinstallIfStale) {
  var nodeModulesOk = compareMarkerFiles();

  if (nodeModulesOk) {
    console.log(':-) npm dependencies are looking good!');
  } else {
    console.warn(':-( npm dependencies are stale or in an unknown state!');

    if (reinstallIfStale) {
      purgeModules();
      installModules();
    }
  }

  return nodeModulesOk;
}

function compareMarkerFiles() {
  var absoluteMarkerFilePath = path.join(PROJECT_ROOT, NPM_SHRINKWRAP_FILE);
  var absoluteCachedMarkerFilePath = path.join(PROJECT_ROOT, NPM_SHRINKWRAP_CACHED_FILE);

  if (!fs.existsSync(absoluteCachedMarkerFilePath)) return false;

  var markerContent = fs.readFileSync(absoluteMarkerFilePath, FS_OPTS);
  var cachedMarkerContent = fs.readFileSync(absoluteCachedMarkerFilePath, FS_OPTS);

  return markerContent === cachedMarkerContent;
}

// Implementation based on
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

function installModules() {
  startProgressIndicator('    Running `npm install` (this may take a while)...');

  var exec = require('child_process').exec;
  var opts = {cwd: PROJECT_ROOT};
  var proc = exec('npm install', opts, onInstalled);

  // TODO(gkalpak): Decide if we actually want these
  // proc.stdout.pipe(process.stdout);
  // proc.stderr.pipe(process.stderr);

  // Helpers
  function onInstalled(err) {
    stopProgressIndicator();

    if (err) {
      logError(err);
      return;
    }

    cacheNpmShrinkwrapFile();
  }
}

function purgeModules() {
  startProgressIndicator('    Purging \'node_modules\'...');

  var nodeModulesPath = path.join(PROJECT_ROOT, 'node_modules');
  deleteDirSync(nodeModulesPath);

  stopProgressIndicator();
}

function logError(err) {
  var separator = new Array(81).join('!');

  console.error(separator);
  console.error('Operation completed with errors:');
  console.error(err);
  console.error(separator);
}

function startProgressIndicator(taskDescription) {
  stopProgressIndicator();

  var stdout = process.stdout;

  stdout.write(taskDescription);
  progressIndicatorTimer = setInterval(stdout.write.bind(stdout, '.'), 5000);
}

function stopProgressIndicator() {
  if (progressIndicatorTimer) {
    clearInterval(progressIndicatorTimer);
    progressIndicatorTimer = null;

    process.stdout.write('\n');
  }
}
