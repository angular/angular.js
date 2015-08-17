'use strict';

describe('$$animateAsyncRun', function() {
  beforeEach(module('ngAnimate'));

  it('should fire the callback only when one or more RAFs have passed',
    inject(function($$animateAsyncRun, $$rAF) {

    var trigger = $$animateAsyncRun();
    var called = false;
    trigger(function() {
      called = true;
    });

    expect(called).toBe(false);
    $$rAF.flush();
    expect(called).toBe(true);
  }));

  it('should immediately fire the callback if a RAF has passed since construction',
    inject(function($$animateAsyncRun, $$rAF) {

    var trigger = $$animateAsyncRun();
    $$rAF.flush();

    var called = false;
    trigger(function() {
      called = true;
    });
    expect(called).toBe(true);
  }));
});

describe("$$AnimateRunner", function() {

  beforeEach(module('ngAnimate'));

  they("should trigger the host $prop function",
    ['end', 'cancel', 'pause', 'resume'], function(method) {

    inject(function($$AnimateRunner) {
      var host = {};
      var spy = host[method] = jasmine.createSpy();
      var runner = new $$AnimateRunner(host);
      runner[method]();
      expect(spy).toHaveBeenCalled();
    });
  });

  they("should trigger the inner runner's host $prop function",
    ['end', 'cancel', 'pause', 'resume'], function(method) {

    inject(function($$AnimateRunner) {
      var host = {};
      var spy = host[method] = jasmine.createSpy();
      var runner1 = new $$AnimateRunner();
      var runner2 = new $$AnimateRunner(host);
      runner1.setHost(runner2);
      runner1[method]();
      expect(spy).toHaveBeenCalled();
    });
  });

  it("should resolve the done function only if one RAF has passed",
    inject(function($$AnimateRunner, $$rAF) {

    var runner = new $$AnimateRunner();
    var spy = jasmine.createSpy();
    runner.done(spy);
    runner.complete(true);
    expect(spy).not.toHaveBeenCalled();
    $$rAF.flush();
    expect(spy).toHaveBeenCalled();
  }));

  it("should resolve with the status provided in the completion function",
    inject(function($$AnimateRunner, $$rAF) {

    var runner = new $$AnimateRunner();
    var capturedValue;
    runner.done(function(val) {
      capturedValue = val;
    });
    runner.complete('special value');
    $$rAF.flush();
    expect(capturedValue).toBe('special value');
  }));

  they("should immediately resolve each combined runner in a bottom-up order when $prop is called",
    ['end', 'cancel'], function(method) {

    inject(function($$AnimateRunner) {
      var runner1 = new $$AnimateRunner();
      var runner2 = new $$AnimateRunner();
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

    inject(function($$AnimateRunner, $rootScope) {
      var runner1 = new $$AnimateRunner();
      var runner2 = new $$AnimateRunner();
      runner1.setHost(runner2);

      var status1;
      runner1.then(
        function() { status1 = 'pass'; },
        function() { status1 = 'fail'; });

      var status2;
      runner2.then(
        function() { status2 = 'pass'; },
        function() { status2 = 'fail'; });

      runner1[method]();

      var expectedStatus = method === 'end' ? 'pass' : 'fail';

      expect(status1).toBeUndefined();
      expect(status2).toBeUndefined();

      $rootScope.$digest();
      expect(status1).toBe(expectedStatus);
      expect(status2).toBe(expectedStatus);
    });
  });

  it("should expose/create the contained promise when getPromise() is called",
    inject(function($$AnimateRunner, $rootScope) {

    var runner = new $$AnimateRunner();
    expect(isPromiseLike(runner.getPromise())).toBeTruthy();
  }));

  it("should expose the `catch` promise function to handle the rejected state",
    inject(function($$AnimateRunner, $rootScope) {

    var runner = new $$AnimateRunner();
    var animationFailed = false;
    runner.catch(function() {
      animationFailed = true;
    });
    runner.cancel();
    $rootScope.$digest();
    expect(animationFailed).toBe(true);
  }));

  they("should expose the `finally` promise function to handle the final state when $prop",
    { 'rejected': 'cancel', 'resolved': 'end' }, function(method) {
    inject(function($$AnimateRunner, $rootScope) {
        var runner = new $$AnimateRunner();
        var animationComplete = false;
        runner.finally(function() {
          animationComplete = true;
        });
        runner[method]();
        $rootScope.$digest();
        expect(animationComplete).toBe(true);
    });
  });

  describe(".all()", function() {
    it("should resolve when all runners have naturally resolved",
      inject(function($$rAF, $$AnimateRunner) {

      var runner1 = new $$AnimateRunner();
      var runner2 = new $$AnimateRunner();
      var runner3 = new $$AnimateRunner();

      var status;
      $$AnimateRunner.all([runner1, runner2, runner3], function(response) {
        status = response;
      });

      runner1.complete(true);
      runner2.complete(true);
      runner3.complete(true);

      expect(status).toBeUndefined();

      $$rAF.flush();

      expect(status).toBe(true);
    }));

    they("should immediately resolve if and when all runners have been $prop",
      { ended: 'end', cancelled: 'cancel' }, function(method) {

      inject(function($$AnimateRunner) {
        var runner1 = new $$AnimateRunner();
        var runner2 = new $$AnimateRunner();
        var runner3 = new $$AnimateRunner();

        var expectedStatus = method === 'end' ? true : false;

        var status;
        $$AnimateRunner.all([runner1, runner2, runner3], function(response) {
          status = response;
        });

        runner1[method]();
        runner2[method]();
        runner3[method]();

        expect(status).toBe(expectedStatus);
      });
    });

    it("should return a status of `false` if one or more runners was cancelled",
      inject(function($$AnimateRunner) {

      var runner1 = new $$AnimateRunner();
      var runner2 = new $$AnimateRunner();
      var runner3 = new $$AnimateRunner();

      var status;
      $$AnimateRunner.all([runner1, runner2, runner3], function(response) {
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
      inject(function($$rAF, $$AnimateRunner) {

      var runner1 = new $$AnimateRunner();
      var runner2 = new $$AnimateRunner();
      var runner3 = new $$AnimateRunner();

      var log = [];

      var items = [];
      items.push(function(fn) {
        runner1.done(function() {
          log.push(1);
          fn();
        });
      });

      items.push(function(fn) {
        runner2.done(function() {
          log.push(2);
          fn();
        });
      });

      items.push(function(fn) {
        runner3.done(function() {
          log.push(3);
          fn();
        });
      });

      var status;
      $$AnimateRunner.chain(items, function(response) {
        status = response;
      });

      $$rAF.flush();

      runner2.complete(true);
      expect(log).toEqual([]);
      expect(status).toBeUndefined();

      runner1.complete(true);
      expect(log).toEqual([1,2]);
      expect(status).toBeUndefined();

      runner3.complete(true);
      expect(log).toEqual([1,2,3]);
      expect(status).toBe(true);
    }));

    it("should break the chian when a function evaluates to false",
      inject(function($$rAF, $$AnimateRunner) {

      var runner1 = new $$AnimateRunner();
      var runner2 = new $$AnimateRunner();
      var runner3 = new $$AnimateRunner();
      var runner4 = new $$AnimateRunner();
      var runner5 = new $$AnimateRunner();
      var runner6 = new $$AnimateRunner();

      var log = [];

      var items = [];
      items.push(function(fn) { log.push(1); runner1.done(fn); });
      items.push(function(fn) { log.push(2); runner2.done(fn); });
      items.push(function(fn) { log.push(3); runner3.done(fn); });
      items.push(function(fn) { log.push(4); runner4.done(fn); });
      items.push(function(fn) { log.push(5); runner5.done(fn); });
      items.push(function(fn) { log.push(6); runner6.done(fn); });

      var status;
      $$AnimateRunner.chain(items, function(response) {
        status = response;
      });

      runner1.complete('');
      runner2.complete(null);
      runner3.complete(undefined);
      runner4.complete(0);
      runner5.complete(false);

      runner6.complete(true);

      $$rAF.flush();

      expect(log).toEqual([1,2,3,4,5]);
      expect(status).toBe(false);
    }));
  });
});
