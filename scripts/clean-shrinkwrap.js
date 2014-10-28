#!/usr/bin/env node

/**
 * this script is just a temporary solution to deal with the issue of npm outputting the npm
 * shrinkwrap file in an unstable manner.
 *
 * See: https://github.com/npm/npm/issues/3581
 */

var _ = require('lodash');
var sorted = require('sorted-object');
var fs = require('fs');


function cleanModule(module, name) {

  // keep `from` and `resolve` properties for git dependencies, delete otherwise
  if (!(module.resolved && module.resolved.match(/^git:\/\//))) {
    delete module.from;
    delete module.resolved;
  }

  if (name === 'chokidar') {
    if (module.version === '0.8.1') {
      delete module.dependencies;
    }
  }

  _.forEach(module.dependencies, function(mod, name) {
    cleanModule(mod, name);
  });
}


console.log('Reading npm-shrinkwrap.json');
var shrinkwrap = require('./../npm-shrinkwrap.json');

console.log('Cleaning shrinkwrap object');
cleanModule(shrinkwrap, shrinkwrap.name);

console.log('Writing cleaned npm-shrinkwrap.json');
fs.writeFileSync('./npm-shrinkwrap.json', JSON.stringify(sorted(shrinkwrap), null, 2) + "\n");
