require.paths.push("./lib");
var jasmine = require('jasmine-1.0.1');
var sys = require('util');

for(var key in jasmine) {
  global[key] = jasmine[key];
}

var isVerbose = false;
var showColors = true;
process.argv.forEach(function(arg){
  switch(arg) {
  case '--color': showColors = true; break;
  case '--noColor': showColors = false; break;
  case '--verbose': isVerbose = true; break;
  }
});

jasmine.executeSpecsInFolder(__dirname + '/spec', function(runner, log){
  process.exit(runner.results().failedCount);
}, isVerbose, showColors);