'use strict';

describe('$timeout', function() {

  beforeEach(module(provideLog));


  it('should delegate functions to $browser.defer', inject(function($timeout, $browser) {
    var counter = 0;
    $timeout(function() { counter++; });

    expect(counter).toBe(0);

    $browser.defer.flush();
    expect(counter).toBe(1);

    expect(function() {$browser.defer.flush();}).toThrow('No deferred tasks to be flushed');
    expect(counter).toBe(1);
  }));


  it('should call $apply after each callback is executed', inject(function($timeout, $rootScope) {
    var applySpy = spyOn($rootScope, '$apply').andCallThrough();

    $timeout(function() {});
    expect(applySpy).not.toHaveBeenCalled();

    $timeout.flush();
    expect(applySpy).toHaveBeenCalledOnce();

    applySpy.reset();

    $timeout(function() {});
    $timeout(function() {});
    $timeout.flush();
    expect(applySpy.callCount).toBe(2);
  }));


  it('should NOT call $apply if skipApply is set to true', inject(function($timeout, $rootScope) {
    var applySpy = spyOn($rootScope, '$apply').andCallThrough();

    $timeout(function() {}, 12, false);
    expect(applySpy).not.toHaveBeenCalled();

    $timeout.flush();
    expect(applySpy).not.toHaveBeenCalled();
  }));


  it('should allow you to specify the delay time', inject(function($timeout, $browser) {
    var defer = spyOn($browser, 'defer');
    $timeout(noop, 123);
    expect(defer.callCount).toEqual(1);
    expect(defer.mostRecentCall.args[1]).toEqual(123);
  }));


  it('should return a promise which will be resolved with return value of the timeout callback',
      inject(function($timeout, log) {
    var promise = $timeout(function() { log('timeout'); return 'buba'; });

    promise.then(function(value) { log('promise success: ' + value); }, log.fn('promise error'));
    expect(log).toEqual([]);

    $timeout.flush();
    expect(log).toEqual(['timeout', 'promise success: buba']);
  }));


  it('should forget references to deferreds when callback called even if skipApply is true',
      inject(function($timeout, $browser) {
    // $browser.defer.cancel is only called on cancel if the deferred object is still referenced
    var cancelSpy = spyOn($browser.defer, 'cancel').andCallThrough();

    var promise1 = $timeout(function() {}, 0, false);
    var promise2 = $timeout(function() {}, 100, false);
    expect(cancelSpy).not.toHaveBeenCalled();

    $timeout.flush(0);

    // Promise1 deferred object should already be removed from the list and not cancellable
    $timeout.cancel(promise1);
    expect(cancelSpy).not.toHaveBeenCalled();

    // Promise2 deferred object should not have been called and should be cancellable
    $timeout.cancel(promise2);
    expect(cancelSpy).toHaveBeenCalled();
  }));


  describe('exception handling', function() {

    beforeEach(module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    }));


    it('should delegate exception to the $exceptionHandler service', inject(
        function($timeout, $exceptionHandler) {
      $timeout(function() {throw "Test Error";});
      expect($exceptionHandler.errors).toEqual([]);

      $timeout.flush();
      expect($exceptionHandler.errors).toEqual(["Test Error"]);
    }));


    it('should call $apply even if an exception is thrown in callback', inject(
        function($timeout, $rootScope) {
      var applySpy = spyOn($rootScope, '$apply').andCallThrough();

      $timeout(function() {throw "Test Error";});
      expect(applySpy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(applySpy).toHaveBeenCalled();
    }));


    it('should reject the timeout promise when an exception is thrown in the timeout callback',
        inject(function($timeout, log) {
      var promise = $timeout(function() { throw "Some Error"; });

      promise.then(log.fn('success'), function(reason) { log('error: ' + reason); });
      $timeout.flush();

      expect(log).toEqual('error: Some Error');
    }));


    it('should forget references to relevant deferred even when exception is thrown',
        inject(function($timeout, $browser) {
      // $browser.defer.cancel is only called on cancel if the deferred object is still referenced
      var cancelSpy = spyOn($browser.defer, 'cancel').andCallThrough();

      var promise = $timeout(function() { throw "Test Error"; }, 0, false);
      $timeout.flush();

      expect(cancelSpy).not.toHaveBeenCalled();
      $timeout.cancel(promise);
      expect(cancelSpy).not.toHaveBeenCalled();
    }));
  });


  describe('cancel', function() {
    it('should cancel tasks', inject(function($timeout) {
      var task1 = jasmine.createSpy('task1'),
          task2 = jasmine.createSpy('task2'),
          task3 = jasmine.createSpy('task3'),
          promise1, promise3;

      promise1 = $timeout(task1);
      $timeout(task2);
      promise3 = $timeout(task3, 333);

      $timeout.cancel(promise3);
      $timeout.cancel(promise1);
      $timeout.flush();

      expect(task1).not.toHaveBeenCalled();
      expect(task2).toHaveBeenCalledOnce();
      expect(task3).not.toHaveBeenCalled();
    }));


    it('should cancel the promise', inject(function($timeout, log) {
      var promise = $timeout(noop);
      promise.then(function(value) { log('promise success: ' + value); },
                 function(err) { log('promise error: ' + err); },
                 function(note) { log('promise update: ' + note); });
      expect(log).toEqual([]);

      $timeout.cancel(promise);
      $timeout.flush();

      expect(log).toEqual(['promise error: canceled']);
    }));


    it('should return true if a task was successfully canceled', inject(function($timeout) {
      var task1 = jasmine.createSpy('task1'),
          task2 = jasmine.createSpy('task2'),
          promise1, promise2;

      promise1 = $timeout(task1);
      $timeout.flush();
      promise2 = $timeout(task2);

      expect($timeout.cancel(promise1)).toBe(false);
      expect($timeout.cancel(promise2)).toBe(true);
    }));


    it('should not throw a runtime exception when given an undefined promise', inject(function($timeout) {
      expect($timeout.cancel()).toBe(false);
    }));


    it('should forget references to relevant deferred', inject(function($timeout, $browser) {
      // $browser.defer.cancel is only called on cancel if the deferred object is still referenced
      var cancelSpy = spyOn($browser.defer, 'cancel').andCallThrough();

      var promise = $timeout(function() {}, 0, false);

      expect(cancelSpy).not.toHaveBeenCalled();
      $timeout.cancel(promise);
      expect(cancelSpy).toHaveBeenCalledOnce();

      // Promise deferred object should already be removed from the list and not cancellable again
      $timeout.cancel(promise);
      expect(cancelSpy).toHaveBeenCalledOnce();
    }));
  });
});
