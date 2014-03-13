#!/usr/bin/env node

var _ = require('lodash');
var sorted = require('sorted-object');
var fs = require('fs');


function cleanModule(mod, name) {
  delete mod.from;
  delete mod.resolved;
  _.forEach(mod.dependencies, function(mod, name) {
    cleanModule(mod, name);
  });
}


console.log('Reading npm-shrinkwrap.json');
var shrinkwrap = require('./npm-shrinkwrap.json');

console.log('Cleaning shrinkwrap object');
cleanModule(shrinkwrap, shrinkwrap.name);

console.log('Writing cleaned npm-shrinkwrap.json');
fs.writeFileSync('npm-shrinkwrap.json', JSON.stringify(sorted(shrinkwrap), null, 2));
