#!/usr/bin/env node

'use strict';

var shell = require('shelljs');

var SHRINKWRAP_FILE = 'npm-shrinkwrap.json';
var SHRINKWRAP_CACHED_FILE = 'node_modules/npm-shrinkwrap.cached.json';


function shrinkwrapChanged() {
  return shell.exec('diff ' + SHRINKWRAP_FILE + ' ' + SHRINKWRAP_CACHED_FILE, {silent: true}).output;
}

function cleanNodeModules() {
  if (process.platform !== "win32") {
    console.time('shell.rm');
    shell.rm('-rf', 'node_modules');
    console.timeEnd('shell.rm');
    console.log('cleaned node_modules using rimraf');
  } else {
    console.time('rm -rf');
    shell.exec('rm -rf node_modules');
    console.timeEnd('rm -rf');
    console.log('cleaned node_modules using rm -rf');
  }
}

function npmInstall() {
  shell.exec('npm install');
  shell.cp(SHRINKWRAP_FILE, SHRINKWRAP_CACHED_FILE);
}

function installDependencies() {

  if (!shrinkwrapChanged()) {
    console.log('No shrinkwrap changes detected. npm install will be skipped...');
  } else {
    console.log('Blowing away node_modules and reinstalling npm dependencies...');
    cleanNodeModules();
    npmInstall();
    console.log('npm install successful!');
  }
}

exports.installDependencies = installDependencies;
