describe('benchmarks', function() {
  var beforeDefault;
  beforeEach(function() {
    beforeDefault = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = beforeDefault;
  });

  var benchConfigs = {
    'largetable-bp': {
      url: 'base/build/benchmarks/largetable-bp/index-auto.html',
      variables: [
        'none',
        'baselineBinding',
        'baselineInterpolation',
        'ngBind',
        'ngBindOnce',
        'interpolation',
        'ngBindFn',
        'interpolationFn',
        'ngBindFilter',
        'interpolationFilter'
      ]
    },
    'orderby-bp': {
      url: 'base/build/benchmarks/orderby-bp/index-auto.html',
      variables: [
        'baseline',
        'orderBy',
        'orderByArray',
        'orderByFunction',
        'orderByArrayFunction'
      ]
    },
    'event-delegation-bp': {
      url: 'base/build/benchmarks/event-delegation-bp/index-auto.html',
      variables: [
        'ngClick',
        'ngClickNoJqLite',
        'ngShow',
        'textInterpolation',
        'dlgtClick',
        'noopDir',
        'noop'
      ]
    },
    'parsed-expressions-bp': {
      url: 'base/build/benchmarks/parsed-expressions-bp/index-auto.html',
      variables: [
        'simplePath'
        'complexPath',
        'constructorPath',
        'fieldAccess',
        'fieldIndex',
        'operators',
        'shortCircuitingOperators',
        'filters',
        'functionCalls',
        'objectLiterals',
        'arrayLiterals'
      ]
    }
  };

  Object.keys(benchConfigs).forEach(function(name) {
    describe(name, function() {
      benchConfigs[name].variables.forEach(function(variable){
        it('should be within acceptable limits', function() {
          var done,result;
          runs(function() {
            bpSuite({url: benchConfigs[name].url, variable: variable, numSamples: 1, iterations: 1, angular: '/base/build/angular.js'}).
              then(function(r) {
                result = r;
                done = true;
              }).then(null, function(e) { console.error('something went wrong', e); throw e});
          });

          waitsFor(function() {
            return done;
          }, 'benchmark to finish', 90000);

          runs(function() {
            console.log(prettyBenchpressLog(name, variable, result));
          });
        });
      });
    });
  });
});
