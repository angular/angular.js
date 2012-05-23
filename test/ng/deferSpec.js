'use strict';

describe('$defer', function() {
  beforeEach(module(function($provide) {
    $provide.factory('$exceptionHandler', function(){
      return jasmine.createSpy('$exceptionHandler');
    });
    $provide.value('$log', {warn: noop});
  }));


  it('should delegate functions to $browser.defer', inject(function($defer, $browser, $exceptionHandler) {
    var counter = 0;
    $defer(function() { counter++; });

    expect(counter).toBe(0);

    $browser.defer.flush();
    expect(counter).toBe(1);

    expect(function() {$browser.defer.flush();}).toThrow('No deferred tasks to be flushed');
    expect(counter).toBe(1);

    expect($exceptionHandler).not.toHaveBeenCalled();
  }));


  it('should delegate exception to the $exceptionHandler service', inject(function($defer, $browser, $exceptionHandler) {
    $defer(function() {throw "Test Error";});
    expect($exceptionHandler).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect($exceptionHandler).toHaveBeenCalledWith("Test Error");
  }));


  it('should call $apply after each callback is executed', inject(function($defer, $browser, $rootScope) {
    var applySpy = this.spyOn($rootScope, '$apply').andCallThrough();

    $defer(function() {});
    expect(applySpy).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect(applySpy).toHaveBeenCalled();

    applySpy.reset(); //reset the spy;

    $defer(function() {});
    $defer(function() {});
    $browser.defer.flush();
    expect(applySpy.callCount).toBe(2);
  }));


  it('should call $apply even if an exception is thrown in callback', inject(function($defer, $browser, $rootScope) {
    var applySpy = this.spyOn($rootScope, '$apply').andCallThrough();

    $defer(function() {throw "Test Error";});
    expect(applySpy).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect(applySpy).toHaveBeenCalled();
  }));


  it('should allow you to specify the delay time', inject(function($defer, $browser) {
    var defer = this.spyOn($browser, 'defer');
    $defer(noop, 123);
    expect(defer.callCount).toEqual(1);
    expect(defer.mostRecentCall.args[1]).toEqual(123);
  }));


  it('should return a cancelation token', inject(function($defer, $browser) {
    var defer = this.spyOn($browser, 'defer').andReturn('xxx');
    expect($defer(noop)).toEqual('xxx');
  }));


  describe('cancel', function() {
    it('should cancel tasks', inject(function($defer, $browser) {
      var task1 = jasmine.createSpy('task1'),
          task2 = jasmine.createSpy('task2'),
          task3 = jasmine.createSpy('task3'),
          token1, token3;

      token1 = $defer(task1);
      $defer(task2);
      token3 = $defer(task3, 333);

      $defer.cancel(token3);
      $defer.cancel(token1);
      $browser.defer.flush();

      expect(task1).not.toHaveBeenCalled();
      expect(task2).toHaveBeenCalledOnce();
      expect(task3).not.toHaveBeenCalled();
    }));


    it('should return true if a task was succesffuly canceled', inject(function($defer, $browser) {
      var task1 = jasmine.createSpy('task1'),
          task2 = jasmine.createSpy('task2'),
          token1, token2;

      token1 = $defer(task1);
      $browser.defer.flush();
      token2 = $defer(task2);

      expect($defer.cancel(token1)).toBe(false);
      expect($defer.cancel(token2)).toBe(true);
    }));
  });
});
