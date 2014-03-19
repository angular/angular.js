'use strict';

describe('$debounce', function() {


  it("should return a function", inject(function($debounce) {
    expect($debounce(function() {}, 123)).toEqual(jasmine.any(Function));
  }));


  it('should allow you to specify the delay time', inject(function($debounce, $timeout) {
    var counter = 0;
    var debouncedFn = $debounce(function() { counter++; }, 123);

    debouncedFn();
    expect(counter).toBe(0);

    $timeout.flush(122);
    expect(counter).toBe(0);

    $timeout.flush(1);
    expect(counter).toBe(1);
  }));


  it('should only call the real function after the specified time delay.', inject(function($debounce, $timeout) {
    var counter = 0;
    var debouncedFn = $debounce(function() { counter++; }, 123);

    debouncedFn();
    $timeout.flush(122);
    expect(counter).toBe(0);

    debouncedFn();
    $timeout.flush(1);
    expect(counter).toBe(0);

    $timeout.flush(123);
    expect(counter).toBe(1);
  }));

  it('should call the function immediately if the `immediate` param is true', inject(function($debounce, $timeout) {
    var counter = 0;
    var debouncedFn = $debounce(function() { counter++; }, 123, true);

    debouncedFn();
    expect(counter).toBe(1);

    $timeout.flush(122);
    expect(counter).toBe(1);

    $timeout.flush(1);
    expect(counter).toBe(1);

    debouncedFn();
    expect(counter).toBe(2);
  }));


describe('exception handling', function() {

    beforeEach(module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    }));


    it('should delegate exception to the $exceptionHandler service', inject(
        function($debounce, $timeout, $exceptionHandler) {

      var debouncedFn = $debounce(function() {throw "Test Error";}, 123);

      debouncedFn();
      expect($exceptionHandler.errors).toEqual([]);

      $timeout.flush(123);
      expect($exceptionHandler.errors).toEqual(["Test Error"]);
    }));


    it('should call $apply even if an exception is thrown in callback', inject(
        function($debounce, $timeout, $rootScope) {

      var applySpy = spyOn($rootScope, '$apply').andCallThrough();

      var debouncedFn = $debounce(function() {throw "Test Error";}, 123);

      debouncedFn();
      expect(applySpy).not.toHaveBeenCalled();

      $timeout.flush(123);
      expect(applySpy).toHaveBeenCalled();
    }));

  });
});