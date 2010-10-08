describe('angular.scenario.Future', function() {
  var future;
  
  it('should set the name and behavior', function() {
    var behavior = function() {};
    var future = new angular.scenario.Future('test name', behavior);
    expect(future.name).toEqual('test name');
    expect(future.behavior).toEqual(behavior);
    expect(future.value).toBeUndefined();
    expect(future.fulfilled).toBeFalsy();
  });
  
  it('should be fulfilled after execution and done callback', function() {
    var future = new angular.scenario.Future('test name', function(done) {
      done();
    });
    future.execute(angular.noop);
    expect(future.fulfilled).toBeTruthy();
  });
  
  it('should take callback with (error, result) and forward', function() {
    var future = new angular.scenario.Future('test name', function(done) {
      done(10, 20);
    });
    future.execute(function(error, result) {
      expect(error).toEqual(10);
      expect(result).toEqual(20);
    });
  });
  
  it('should use error as value if provided', function() {
    var future = new angular.scenario.Future('test name', function(done) {
      done(10, 20);
    });
    future.execute(angular.noop);
    expect(future.value).toEqual(10);
  });
});
