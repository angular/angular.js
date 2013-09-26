'use strict';

describe('angular.scenario.Future', function() {
  var future;

  it('should set the sane defaults', function() {
    var behavior = function() {};
    var future = new angular.scenario.Future('test name', behavior, 'foo');
    expect(future.name).toEqual('test name');
    expect(future.behavior).toEqual(behavior);
    expect(future.line).toEqual('foo');
    expect(future.value).toBeUndefined();
    expect(future.fulfilled).toBeFalsy();
    expect(future.parser).toEqual(angular.identity);
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

  it('should parse json with fromJson', function() {
    var future = new angular.scenario.Future('test name', function(done) {
      done(null, '{"test": "foo"}');
    });
    future.fromJson().execute(angular.noop);
    expect(future.value).toEqual({test: 'foo'});
  });

  it('should convert to json with toJson', function() {
    var future = new angular.scenario.Future('test name', function(done) {
      done(null, {test: 'foo'});
    });
    future.toJson().execute(angular.noop);
    expect(future.value).toEqual('{"test":"foo"}');
  });

  it('should convert with custom parser', function() {
    var future = new angular.scenario.Future('test name', function(done) {
      done(null, 'foo');
    });
    future.parsedWith(function(value) {
      return value.toUpperCase();
    }).execute(angular.noop);
    expect(future.value).toEqual('FOO');
  });

  it('should pass error if parser fails', function() {
    var future = new angular.scenario.Future('test name', function(done) {
      done(null, '{');
    });
    future.fromJson().execute(function(error, result) {
      expect(error).toBeDefined();
    });
  });
});
