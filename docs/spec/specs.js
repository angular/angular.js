if (global.jasmine) return;

var jasmine = require('../../lib/jasmine-1.0.1');

for(var key in jasmine) {
  global[key] = jasmine[key];
}

//Patch Jasmine for proper stack traces
jasmine.Spec.prototype.fail = function(e) {
  var expectationResult = new jasmine.ExpectationResult({
    passed: false,
    message: e ? jasmine.util.formatException(e) : 'Exception'
  });
  // PATCH
  if (e) {
   expectationResult.trace = e;
  }
  this.results_.addResult(expectationResult);
};



var isVerbose = false;
var showColors = true;
process.argv.forEach(function(arg){
  switch(arg) {
  case '--color': showColors = true; break;
  case '--noColor': showColors = false; break;
  case '--verbose': isVerbose = true; break;
  }
});

jasmine.executeSpecsInFolder(__dirname, function(runner, log){
  process.exit(runner.results().failedCount);
}, isVerbose, showColors);
