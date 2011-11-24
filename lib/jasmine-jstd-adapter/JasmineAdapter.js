/**
 * @fileoverview Jasmine JsTestDriver Adapter.
 * @author misko@hevery.com (Misko Hevery)
 */
(function(window) {
  var rootDescribes = new Describes(window);
  var describePath = [];
  rootDescribes.collectMode();

  var JASMINE_TYPE = 'jasmine test case';
  TestCase('Jasmine Adapter Tests', null, JASMINE_TYPE);

  var jasminePlugin = {
      name:'jasmine',

      getTestRunsConfigurationFor: function(testCaseInfos, expressions, testRunsConfiguration) {
        for (var i = 0; i < testCaseInfos.length; i++) {
          if (testCaseInfos[i].getType() == JASMINE_TYPE) {
            testRunsConfiguration.push(new jstestdriver.TestRunConfiguration(testCaseInfos[i], []));
          }
        }
        return false;
      },

      runTestConfiguration: function(testRunConfiguration, onTestDone, onTestRunConfigurationComplete){
        if (testRunConfiguration.getTestCaseInfo().getType() != JASMINE_TYPE) return false;

        var jasmineEnv = jasmine.currentEnv_ = new jasmine.Env();
        rootDescribes.playback();
        var specLog = jstestdriver.console.log_ = [];
        var start;
        jasmineEnv.specFilter = function(spec) {
          return rootDescribes.isExclusive(spec);
        };
        jasmineEnv.reporter = {
          log: function(str){
            specLog.push(str);
          },

          reportRunnerStarting: function(runner) { },

          reportSpecStarting: function(spec) {
            specLog = jstestdriver.console.log_ = [];
            start = new Date().getTime();
          },

          reportSpecResults: function(spec) {
            var suite = spec.suite;
            var results = spec.results();
            if (results.skipped) return;
            var end = new Date().getTime();
            var messages = [];
            var resultItems = results.getItems();
            var state = 'passed';
            for ( var i = 0; i < resultItems.length; i++) {
              if (!resultItems[i].passed()) {
                state = resultItems[i].message.match(/AssertionError:/) ? 'error' : 'failed';
                messages.push({
                  message: resultItems[i].toString(),
                  name: resultItems[i].trace.name,
                  stack: formatStack(resultItems[i].trace.stack)
              });
              }
            }
            onTestDone(
              new jstestdriver.TestResult(
                suite.getFullName(),
                spec.description,
                state,
                jstestdriver.angular.toJson(messages),
                specLog.join('\n'),
                end - start));
          },

          reportSuiteResults: function(suite) {},

          reportRunnerResults: function(runner) {
            onTestRunConfigurationComplete();
          }
        };
        jasmineEnv.execute();
        return true;
      },

      onTestsFinish: function(){
        jasmine.currentEnv_ = null;
        rootDescribes.collectMode();
      }
  };
  jstestdriver.pluginRegistrar.register(jasminePlugin);

  function formatStack(stack) {
    var lines = (stack||'').split(/\r?\n/);
    var frames = [];
    for (i = 0; i < lines.length; i++) {
      if (!lines[i].match(/\/jasmine[\.-]/)) {
        frames.push(lines[i].replace(/https?:\/\/\w+(:\d+)?\/test\//, '').replace(/^\s*/, '      '));
      }
    }
    return frames.join('\n');
  }

  function noop(){}
  function Describes(window){
    var describes = {};
    var beforeEachs = {};
    var afterEachs = {};
    // Here we store:
    // 0: everyone runs
    // 1: run everything under ddescribe
    // 2: run only iits (ignore ddescribe)
    var exclusive = 0;
    var collectMode = true;
    intercept('describe', describes);
    intercept('xdescribe', describes);
    intercept('beforeEach', beforeEachs);
    intercept('afterEach', afterEachs);

    function intercept(functionName, collection){
      window[functionName] = function(desc, fn){
        if (collectMode) {
          collection[desc] = function(){
            jasmine.getEnv()[functionName](desc, fn);
          };
        } else {
          jasmine.getEnv()[functionName](desc, fn);
        }
      };
    }
    window.ddescribe = function(name, fn){
      if (exclusive < 1) {
        exclusive = 1; // run ddescribe only
      }
      window.describe(name, function(){
        var oldIt = window.it;
        window.it = function(name, fn){
          fn.exclusive = 1; // run anything under ddescribe
          oldIt(name, fn);
        };
        try {
          fn.call(this);
        } finally {
          window.it = oldIt;
        };
      });
    };
    window.iit = function(name, fn){
      exclusive = fn.exclusive = 2; // run only iits
      jasmine.getEnv().it(name, fn);
    };


    this.collectMode = function() {
      collectMode = true;
      exclusive = 0; // run everything
    };
    this.playback = function(){
      collectMode = false;
      playback(beforeEachs);
      playback(afterEachs);
      playback(describes);

      function playback(set) {
        for ( var name in set) {
          set[name]();
        }
      }
    };

    this.isExclusive = function(spec) {
      if (exclusive) {
        var blocks = spec.queue.blocks;
        for ( var i = 0; i < blocks.length; i++) {
          if (blocks[i].func.exclusive >= exclusive) {
            return true;
          }
        }
        return false;
      }
      return true;
    };
  }

})(window);

// Patch Jasmine for proper stack traces
jasmine.Spec.prototype.fail = function (e) {
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

