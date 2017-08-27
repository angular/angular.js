'use strict';

describe('$timeout', function() {

  beforeEach(module(provideLog));


  it('should delegate functions to $browser.defer', inject(function($timeout, $browser) {
    var counter = 0;
    $timeout(function() { counter++; });

    expect(counter).toBe(0);

    $browser.defer.flush();
    expect(counter).toBe(1);

    expect(function() {$browser.defer.flush();}).toThrowError('No deferred tasks to be flushed');
    expect(counter).toBe(1);
  }));


  it('should call $apply after each callback is executed', inject(function($timeout, $rootScope) {
    var applySpy = spyOn($rootScope, '$apply').and.callThrough();

    $timeout(noop);
    expect(applySpy).not.toHaveBeenCalled();

    $timeout.flush();
    expect(applySpy).toHaveBeenCalledOnce();

    applySpy.calls.reset();

    $timeout(noop);
    $timeout(noop);
    $timeout.flush();
    expect(applySpy).toHaveBeenCalledTimes(2);
  }));


  it('should NOT call $apply if skipApply is set to true', inject(function($timeout, $rootScope) {
    var applySpy = spyOn($rootScope, '$apply').and.callThrough();

    $timeout(noop, 12, false);
    expect(applySpy).not.toHaveBeenCalled();

    $timeout.flush();
    expect(applySpy).not.toHaveBeenCalled();
  }));


  it('should NOT call $evalAsync or $digest if invokeApply is set to false',
      inject(function($timeout, $rootScope) {
    var evalAsyncSpy = spyOn($rootScope, '$evalAsync').and.callThrough();
    var digestSpy = spyOn($rootScope, '$digest').and.callThrough();
    var fulfilledSpy = jasmine.createSpy('fulfilled');

    $timeout(fulfilledSpy, 1000, false);

    $timeout.flush();

    expect(fulfilledSpy).toHaveBeenCalledOnce();
    expect(evalAsyncSpy).not.toHaveBeenCalled();
    expect(digestSpy).not.toHaveBeenCalled();
  }));


  it('should allow you to specify the delay time', inject(function($timeout, $browser) {
    var defer = spyOn($browser, 'defer');
    $timeout(noop, 123);
    expect(defer).toHaveBeenCalledTimes(1);
    expect(defer.calls.mostRecent().args[1]).toEqual(123);
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
    var cancelSpy = spyOn($browser.defer, 'cancel').and.callThrough();

    var promise1 = $timeout(noop, 0, false);
    var promise2 = $timeout(noop, 100, false);
    expect(cancelSpy).not.toHaveBeenCalled();

    $timeout.flush(0);

    // Promise1 deferred object should already be removed from the list and not cancellable
    $timeout.cancel(promise1);
    expect(cancelSpy).not.toHaveBeenCalled();

    // Promise2 deferred object should not have been called and should be cancellable
    $timeout.cancel(promise2);
    expect(cancelSpy).toHaveBeenCalled();
  }));

  it('should allow the `fn` parameter to be optional', inject(function($timeout, log) {

    $timeout().then(function(value) { log('promise success: ' + value); }, log.fn('promise error'));
    expect(log).toEqual([]);

    $timeout.flush();
    expect(log).toEqual(['promise success: undefined']);

    log.reset();
    $timeout(1000).then(function(value) { log('promise success: ' + value); }, log.fn('promise error'));
    expect(log).toEqual([]);

    $timeout.flush(500);
    expect(log).toEqual([]);
    $timeout.flush(500);
    expect(log).toEqual(['promise success: undefined']);
  }));

  it('should pass the timeout arguments in the timeout callback',
      inject(function($timeout, $browser, log) {
    var task1 = jasmine.createSpy('Nappa'),
        task2 = jasmine.createSpy('Vegeta');

    $timeout(task1, 9000, true, 'What does', 'the timeout', 'say about', 'its delay level');
    expect($browser.deferredFns.length).toBe(1);

    $timeout(task2, 9001, false, 'It\'s', 'over', 9000);
    expect($browser.deferredFns.length).toBe(2);

    $timeout(9000, false, 'What!', 9000).then(function(value) { log('There\'s no way that can be right! ' + value); }, log.fn('It can\'t!'));
    expect($browser.deferredFns.length).toBe(3);
    expect(log).toEqual([]);

    $timeout.flush(0);
    expect(task1).not.toHaveBeenCalled();

    $timeout.flush(9000);
    expect(task1).toHaveBeenCalledWith('What does', 'the timeout', 'say about', 'its delay level');

    $timeout.flush(1);
    expect(task2).toHaveBeenCalledWith('It\'s', 'over', 9000);

    $timeout.flush(9000);
    expect(log).toEqual(['There\'s no way that can be right! undefined']);

  }));


  describe('exception handling', function() {

    beforeEach(module(function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    }));


    it('should delegate exception to the $exceptionHandler service', inject(
        function($timeout, $exceptionHandler) {
      $timeout(function() { throw 'Test Error'; });
      expect($exceptionHandler.errors).toEqual([]);

      $timeout.flush();
      expect($exceptionHandler.errors).toEqual(['Test Error', 'Possibly unhandled rejection: Test Error']);
    }));


    it('should call $apply even if an exception is thrown in callback', inject(
        function($timeout, $rootScope) {
      var applySpy = spyOn($rootScope, '$apply').and.callThrough();

      $timeout(function() { throw 'Test Error'; });
      expect(applySpy).not.toHaveBeenCalled();

      $timeout.flush();
      expect(applySpy).toHaveBeenCalled();
    }));


    it('should reject the timeout promise when an exception is thrown in the timeout callback',
        inject(function($timeout, log) {
      var promise = $timeout(function() { throw 'Some Error'; });

      promise.then(log.fn('success'), function(reason) { log('error: ' + reason); });
      $timeout.flush();

      expect(log).toEqual('error: Some Error');
    }));


    it('should pass the timeout arguments in the timeout callback even if an exception is thrown',
        inject(function($timeout, log) {
      var promise1 = $timeout(function(arg) { throw arg; }, 9000, true, 'Some Arguments');
      var promise2 = $timeout(function(arg1, args2) { throw arg1 + ' ' + args2; }, 9001, false, 'Are Meant', 'To Be Thrown');

      promise1.then(log.fn('success'), function(reason) { log('error: ' + reason); });
      promise2.then(log.fn('success'), function(reason) { log('error: ' + reason); });

      $timeout.flush(0);
      expect(log).toEqual('');

      $timeout.flush(9000);
      expect(log).toEqual('error: Some Arguments');

      $timeout.flush(1);
      expect(log).toEqual('error: Some Arguments; error: Are Meant To Be Thrown');
    }));


    it('should forget references to relevant deferred even when exception is thrown',
        inject(function($timeout, $browser) {
      // $browser.defer.cancel is only called on cancel if the deferred object is still referenced
      var cancelSpy = spyOn($browser.defer, 'cancel').and.callThrough();

      var promise = $timeout(function() { throw 'Test Error'; }, 0, false);
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
          task4 = jasmine.createSpy('task4'),
          promise1, promise3, promise4;

      promise1 = $timeout(task1);
      $timeout(task2);
      promise3 = $timeout(task3, 333);
      promise4 = $timeout(333);
      promise3.then(task4, noop);

      $timeout.cancel(promise1);
      $timeout.cancel(promise3);
      $timeout.cancel(promise4);
      $timeout.flush();

      expect(task1).not.toHaveBeenCalled();
      expect(task2).toHaveBeenCalledOnce();
      expect(task3).not.toHaveBeenCalled();
      expect(task4).not.toHaveBeenCalled();
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
      var cancelSpy = spyOn($browser.defer, 'cancel').and.callThrough();

      var promise = $timeout(noop, 0, false);

      expect(cancelSpy).not.toHaveBeenCalled();
      $timeout.cancel(promise);
      expect(cancelSpy).toHaveBeenCalledOnce();

      // Promise deferred object should already be removed from the list and not cancellable again
      $timeout.cancel(promise);
      expect(cancelSpy).toHaveBeenCalledOnce();
    }));


    it('should not trigger digest when cancelled', inject(function($timeout, $rootScope, $browser) {
      var watchSpy = jasmine.createSpy('watchSpy');
      $rootScope.$watch(watchSpy);

      var t = $timeout();
      $timeout.cancel(t);
      expect(function() {$browser.defer.flush();}).toThrowError('No deferred tasks to be flushed');
      expect(watchSpy).not.toHaveBeenCalled();
    }));
  });
});
