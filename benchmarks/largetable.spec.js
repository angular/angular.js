describe('benchmarks', function() {
  var beforeDefault;
  beforeEach(function() {
    beforeDefault = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = beforeDefault;
  });

  describe('largetable', function(){
    [
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
    ].forEach(function(variable){
      it('should be within acceptable limits', function() {
        var done,result;
        runs(function() {
          bpSuite({url: 'base/build/benchmarks/largetable-bp/index-auto.html', variable: variable, numSamples: 1, iterations: 1, angular: '/base/build/angular.js'}).
            then(function(r) {
              result = r;
              done = true;
            }).then(null, function(e) { console.error('something went wrong', e); throw e});
        });

        waitsFor(function() {
          return done;
        }, 'benchmark to finish', 90000);

        runs(function() {
          console.log(prettyBenchpressLog('largetable', variable, result));
        });
      });
    });
  });
});
