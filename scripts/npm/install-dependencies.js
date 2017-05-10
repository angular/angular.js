#!/usr/bin/env node

'use strict';

var rimraf = require('rimraf');
var shell = require('shelljs');
var q = require('q');
var child_process = require('child_process');

var SHRINKWRAP_FILE = 'npm-shrinkwrap.json';
var SHRINKWRAP_CACHED_FILE = 'node_modules/npm-shrinkwrap.cached.json';

function cleanNodeModules() {
  if (process.platform === "win32") {
    var deferred = q.defer();
    rimraf('node_modules', function(error) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        console.log('cleaned node_modules using rimraf');
        deferred.resolve();
      }
    });

    return deferred.promise;
  }

  shell.rm('-rf', 'node_modules');
  console.log('cleaned node_modules using rm -rf');
}

function installDependencies() {

  if (!shell.exec('diff ' + SHRINKWRAP_FILE + ' ' + SHRINKWRAP_CACHED_FILE, {silent: true}).output) {
    console.log('No shrinkwrap changes detected. npm install will be skipped...');
  } else {
    console.log('Blowing away node_modules and reinstalling npm dependencies...');
    q.when(cleanNodeModules()).then(function() {
      shell.exec('npm install');
      shell.cp(SHRINKWRAP_FILE, SHRINKWRAP_CACHED_FILE);
      console.log('npm install successful!');
    });
  }
}

exports.installDependencies = installDependencies;