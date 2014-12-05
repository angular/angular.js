describe('test benchmark', function() {
  var beforeDefault;
  beforeEach(function() {
    beforeDefault = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 90000;
  });

  afterEach(function() {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = beforeDefault;
  });

  it('should be within acceptable limits', function() {
    var done,result;
    runs(function() {
      bpSuite({url: 'base/benchpress-build/largetable-bp/index-auto.html', variable: 'ngBind', numSamples: 15, iterations: 20, angular: '/base/build/angular.js'}).
        then(function(r) {
          result = r;
          done = true;
        }, function(reason) {
          console.error('failed because', reason.message);
        }).then(null, function(e) { console.error('something went wrong', e); throw e});
    });

    waitsFor(function() {
      console.log('done?', done)
      return done;
    }, 'benchmark to finish', 90000);

    runs(function() {
      dump(result);
      expect(result.$apply.testTime.avg.mean).toBeLessThan(15);
      expect(result.create.testTime.avg.mean).toBeLessThan(1500);
    });
  });
});
