describe('Matcher', function () {
  function executeFutures() {
    for(var i in $scenario.currentSpec.futures) {
      var future = $scenario.currentSpec.futures[i];
      future.behavior.call({}, function(value) { future.fulfill(value); });
    }
  }
  var matcher;
  beforeEach(function() {
    setUpContext();
    var future = $scenario.addFuture('Calculate first future', function(done) {
      done(123);
    });
    matcher = new Matcher(this, future);

  });
  it('should correctly match toEqual', function() {
    matcher.toEqual(123);
    executeFutures();
  });
  it('should throw an error when incorrect match toEqual', function() {
    matcher.toEqual(456);
    try {
      executeFutures();
      fail();
    } catch (e) {
      expect(e).toEqual('Expected 456 but was 123');
    }
  });
});