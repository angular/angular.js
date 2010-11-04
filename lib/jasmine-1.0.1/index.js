var fs = require('fs');
var sys = require('sys');
var path = require('path');

var filename = __dirname + '/jasmine.js';
global.window = {
  setTimeout: setTimeout,
  clearTimeout: clearTimeout,
  setInterval: setInterval,
  clearInterval: clearInterval
};
var src = fs.readFileSync(filename);
var jasmine = process.compile(src + '\njasmine;', filename);
delete global.window;

function noop(){}

jasmine.executeSpecsInFolder = function(folder, done, isVerbose, showColors, matcher){
  var log = [];
  var columnCounter = 0;
  var start = 0;
  var elapsed = 0;
  var verbose = isVerbose || false;
  var fileMatcher = new RegExp(matcher || "\.js$");
  var colors = showColors || false;
  var specs = jasmine.getAllSpecFiles(folder, fileMatcher);

  var ansi = {
    green: '\033[32m',
    red: '\033[31m',
    yellow: '\033[33m',
    none: '\033[0m'
  };

  for (var i = 0, len = specs.length; i < len; ++i){
    var filename = specs[i];
    require(filename.replace(/\.*$/, ""));
  }

  var jasmineEnv = jasmine.getEnv();
  jasmineEnv.reporter = {
    log: function(str){
    },
    
    reportSpecStarting: function(runner) {
    },
    
    reportRunnerStarting: function(runner) {
      sys.puts('Started');
      start = Number(new Date);
    },

    reportSuiteResults: function(suite) {
      var specResults = suite.results();
      var path = [];
      while(suite) {
        path.unshift(suite.description);
        suite = suite.parentSuite;
      }
      var description = path.join(' ');

      if (verbose)
        log.push('Spec ' + description);

      specResults.items_.forEach(function(spec){
        if (spec.failedCount > 0 && spec.description) {
          if (!verbose)
              log.push(description);
          log.push('  it ' + spec.description);
          spec.items_.forEach(function(result){
            log.push('  ' + result.trace.stack + '\n');
          });
        }
      });
    },

    reportSpecResults: function(spec) {
      var result = spec.results();
      var msg = '';
      if (result.passed())
      {
        msg = (colors) ? (ansi.green + '.' + ansi.none) : '.';
//      } else if (result.skipped) {  TODO: Research why "result.skipped" returns false when "xit" is called on a spec?
//        msg = (colors) ? (ansi.yellow + '*' + ansi.none) : '*';
      } else {
        msg = (colors) ? (ansi.red + 'F' + ansi.none) : 'F';
      }
      sys.print(msg);
      if (columnCounter++ < 50) return;
      columnCounter = 0;
      sys.print('\n');
    },


    reportRunnerResults: function(runner) {
      elapsed = (Number(new Date) - start) / 1000;
      sys.puts('\n');
      log.forEach(function(log){
        sys.puts(log);
      });
      sys.puts('Finished in ' + elapsed + ' seconds');

      var summary = jasmine.printRunnerResults(runner);
      if(colors)
      {
        if(runner.results().failedCount === 0 )
          sys.puts(ansi.green + summary + ansi.none);
        else
          sys.puts(ansi.red + summary + ansi.none);
      } else {
        sys.puts(summary);
      }
      (done||noop)(runner, log);
    }
  };
  jasmineEnv.execute();
};

jasmine.getAllSpecFiles = function(dir, matcher){
  var specs = [];

  if (fs.statSync(dir).isFile() && dir.match(matcher)) {
    specs.push(dir);
  } else {
    var files = fs.readdirSync(dir);
    for (var i = 0, len = files.length; i < len; ++i){
      var filename = dir + '/' + files[i];
      if (fs.statSync(filename).isFile() && filename.match(matcher)){
        specs.push(filename);
      }else if (fs.statSync(filename).isDirectory()){
        var subfiles = this.getAllSpecFiles(filename, matcher);
        subfiles.forEach(function(result){
          specs.push(result);
        });
      }
    }
  }
  
  return specs;
};

jasmine.printRunnerResults = function(runner){
  var results = runner.results();
  var suites = runner.suites();
  var msg = '';
  msg += suites.length + ' test' + ((suites.length === 1) ? '' : 's') + ', ';
  msg += results.totalCount + ' assertion' + ((results.totalCount === 1) ? '' : 's') + ', ';
  msg += results.failedCount + ' failure' + ((results.failedCount === 1) ? '' : 's') + '\n';
  return msg;
};

function now(){
  return new Date().getTime();
}

jasmine.asyncSpecWait = function(){
  var wait = jasmine.asyncSpecWait;
  wait.start = now();
  wait.done = false;
  (function innerWait(){
    waits(10);
    runs(function() {
      if (wait.start + wait.timeout < now()) {
        expect('timeout waiting for spec').toBeNull();
      } else if (wait.done) {
        wait.done = false;
      } else {
        innerWait();
      }
    });
  })();
};
jasmine.asyncSpecWait.timeout = 4 * 1000;
jasmine.asyncSpecDone = function(){
  jasmine.asyncSpecWait.done = true;
};

for ( var key in jasmine) {
  exports[key] = jasmine[key];
}