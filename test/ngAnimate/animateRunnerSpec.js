'use strict';

describe("$$rAFMutex", function() {
  beforeEach(module('ngAnimate'));

  it('should fire the callback only when one or more RAFs have passed',
    inject(function($$rAF, $$rAFMutex) {

    var trigger = $$rAFMutex();
    var called = false;
    trigger(function() {
      called = true;
    });

    expect(called).toBe(false);
    $$rAF.flush();
    expect(called).toBe(true);
  }));

  it('should immediately fire the callback if a RAF has passed since construction',
    inject(function($$rAF, $$rAFMutex) {

    var trigger = $$rAFMutex();
    $$rAF.flush();

    var called = false;
    trigger(function() {
      called = true;
    });
    expect(called).toBe(true);
  }));
});

describe("$animateRunner", function() {

  beforeEach(module('ngAnimate'));

  they("should trigger the host $prop function",
    ['end', 'cancel', 'pause', 'resume'], function(method) {

    inject(function($animateRunner) {
      var host = {};
      var spy = host[method] = jasmine.createSpy();
      var runner = new $animateRunner(host);
      runner[method]();
      expect(spy).toHaveBeenCalled();
    });
  });

  they("should trigger the inner runner's host $prop function",
    ['end', 'cancel', 'pause', 'resume'], function(method) {

    inject(function($animateRunner) {
      var host = {};
      var spy = host[method] = jasmine.createSpy();
      var runner1 = new $animateRunner();
      var runner2 = new $animateRunner(host);
      runner1.setHost(runner2);
      runner1[method]();
      expect(spy).toHaveBeenCalled();
    });
  });

  it("should resolve the done function only if one RAF has passed",
    inject(function($animateRunner, $$rAF) {

    var runner = new $animateRunner();
    var spy = jasmine.createSpy();
    runner.done(spy);
    runner.complete(true);
    expect(spy).not.toHaveBeenCalled();
    $$rAF.flush();
    expect(spy).toHaveBeenCalled();
  }));

  it("should resolve with the status provided in the completion function",
    inject(function($animateRunner, $$rAF) {

    var runner = new $animateRunner();
    var capturedValue;
    runner.done(function(val) {
      capturedValue = val;
    });
    runner.complete('special value');
    $$rAF.flush();
    expect(capturedValue).toBe('special value');
  }));

  they("should immediately resolve each combined runner in depth-first order when $prop is called",
    ['end', 'cancel'], function(method) {

    inject(function($animateRunner, $$rAF) {
      var runner1 = new $animateRunner();
      var runner2 = new $animateRunner();
      runner1.setHost(runner2);

      var status1, status2, signature = '';
      runner1.done(function(status) {
        signature += '1';
        status1 = status;
      });

      runner2.done(function(status) {
        signature += '2';
        status2 = status;
      });

      runner1[method]();

      var expectedStatus = method === 'end' ? true : false;
      expect(status1).toBe(expectedStatus);
      expect(status2).toBe(expectedStatus);
      expect(signature).toBe('21');
    });
  });

  they("should resolve/reject using a newly created promise when .then() is used upon $prop",
    ['end', 'cancel'], function(method) {

    inject(function($animateRunner, $rootScope) {
      var runner1 = new $animateRunner();
      var runner2 = new $animateRunner();
      runner1.setHost(runner2);

      var status1;
      runner2.then(
        function() { status1 = 'pass'; },
        function() { status1 = 'fail'; });

      var status2;
      runner2.then(
        function() { status2 = 'pass'; },
        function() { status2 = 'fail'; });

      runner1[method]();

      var expectedStatus = method === 'end' ? 'pass' : 'fail';

      expect(status1).toBeFalsy();
      expect(status2).toBeFalsy();

      $rootScope.$digest();
      expect(status1).toBe(expectedStatus);
      expect(status2).toBe(expectedStatus);
    });
  });

  it("should expose/create the contained promise when getPromise() is called",
    inject(function($animateRunner, $rootScope) {

    var runner = new $animateRunner();
    expect(isPromiseLike(runner.getPromise()));
  }));

  describe(".all()", function() {
    it("should resolve when all runners have naturally resolved",
      inject(function($$rAF, $animateRunner) {

      var runner1 = new $animateRunner();
      var runner2 = new $animateRunner();
      var runner3 = new $animateRunner();

      var status;
      $animateRunner.all([runner1, runner2, runner3], function(response) {
        status = response;
      });

      runner1.complete(true);
      runner2.complete(true);
      runner3.complete(true);

      expect(status).toBeUndefined();

      $$rAF.flush();

      expect(status).toBe(true);
    }));

    they("should immediately resolve if and when all runners have resolved been $prop",
      { ended: 'end', cancelled: 'cancel' }, function(method) {

      inject(function($$rAF, $animateRunner) {
        var runner1 = new $animateRunner();
        var runner2 = new $animateRunner();
        var runner3 = new $animateRunner();

        var expectedStatus = method === 'end' ? true : false;

        var status;
        $animateRunner.all([runner1, runner2, runner3], function(response) {
          status = response;
        });

        runner1[method]();
        runner2[method]();
        runner3[method]();

        expect(status).toBe(expectedStatus);
      });
    });

    it("should return a status of `false` if more than one runner was cancelled",
      inject(function($$rAF, $animateRunner) {

      var runner1 = new $animateRunner();
      var runner2 = new $animateRunner();
      var runner3 = new $animateRunner();

      var status;
      $animateRunner.all([runner1, runner2, runner3], function(response) {
        status = response;
      });

      runner1.end();
      runner2.end();
      runner3.cancel();

      expect(status).toBe(false);
    }));
  });

  describe(".chain()", function() {
    it("should evaluate an array of functions in a chain",
      inject(function($$rAF, $animateRunner) {

      var runner1 = new $animateRunner();
      var runner2 = new $animateRunner();
      var runner3 = new $animateRunner();

      var log = [];

      var items = [];
      items.push(function(fn) { log.push(1); runner1.done(fn); });
      items.push(function(fn) { log.push(2); runner2.done(fn); });
      items.push(function(fn) { log.push(3); runner3.done(fn); });

      var status;
      $animateRunner.chain(items, function(response) {
        status = response;
      });

      runner1.complete(true);
      runner2.complete(true);
      runner3.complete(true);
      $$rAF.flush();

      expect(log).toEqual([1,2,3]);
      expect(status).toBe(true);
    }));
  });
});
