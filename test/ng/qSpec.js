'use strict';

/**
  http://wiki.commonjs.org/wiki/Promises
  http://www.slideshare.net/domenicdenicola/callbacks-promises-and-coroutines-oh-my-the-evolution-of-asynchronicity-in-javascript

  Q:  https://github.com/kriskowal/q
      https://github.com/kriskowal/q/blob/master/design/README.js
      https://github.com/kriskowal/uncommonjs/blob/master/promises/specification.md
      http://jsconf.eu/2010/speaker/commonjs_i_promise_by_kris_kow.html
        - good walkthrough of the Q api's and design, jump to 15:30

  twisted: http://twistedmatrix.com/documents/11.0.0/api/twisted.internet.defer.Deferred.html
  dojo: https://github.com/dojo/dojo/blob/master/_base/Deferred.js
        http://dojotoolkit.org/api/1.6/dojo/Deferred
        http://dojotoolkit.org/documentation/tutorials/1.6/promises/
  when.js: https://github.com/briancavalier/when.js
  DART: http://www.dartlang.org/docs/api/Promise.html#Promise::Promise
        http://code.google.com/p/dart/source/browse/trunk/dart/corelib/src/promise.dart
        http://codereview.chromium.org/8271014/patch/11003/12005
        https://chromereviews.googleplex.com/3365018/
  WinJS: http://msdn.microsoft.com/en-us/library/windows/apps/br211867.aspx

  http://download.oracle.com/javase/1.5.0/docs/api/java/util/concurrent/Future.html
  http://en.wikipedia.org/wiki/Futures_and_promises
  http://wiki.ecmascript.org/doku.php?id=strawman:deferred_functions
  http://wiki.ecmascript.org/doku.php?id=strawman:async_functions


  http://jsperf.com/throw-vs-return
*/

describe('q', function() {
  var q, defer, deferred, promise, log;

  /**
   * Creates a callback that logs its invocation in `log`.
   *
   * @param {(number|string)} name Suffix for 'success' name. e.g. success(1) => success1
   * @param {*=} returnVal Value that the callback should return. If unspecified, the passed in
   *     value is returned.
   * @param {boolean=} throwReturnVal If true, the `returnVal` will be thrown rather than returned.
   */
  function success(name, returnVal, throwReturnVal) {
    var returnValDefined = (arguments.length >= 2);

    return function() {
      name = 'success' + (name || '');
      var args = toJson(sliceArgs(arguments)).replace(/(^\[|"|\]$)/g, '');
      log.push(name + '(' +  args + ')');
      returnVal = returnValDefined ? returnVal : arguments[0];
      if (throwReturnVal) throw returnVal;
      return returnVal;
    }
  }


  /**
   * Creates a callback that logs its invocation in `log`.
   *
   * @param {(number|string)} name Suffix for 'error' name. e.g. error(1) => error1
   * @param {*=} returnVal Value that the callback should return. If unspecified, the passed in
   *     value is rethrown.
   * @param {boolean=} throwReturnVal If true, the `returnVal` will be thrown rather than returned.
   */
  function error(name, returnVal, throwReturnVal) {
    var returnValDefined = (arguments.length >= 2);

    return function(){
      name = 'error' + (name || '');
      log.push(name + '(' + [].join.call(arguments, ',') + ')');
      returnVal = returnValDefined ? returnVal : q.reject(arguments[0]);
      if (throwReturnVal) throw returnVal;
      return returnVal;
    }
  }


  /** helper for synchronous resolution of deferred */
  function syncResolve(deferred, result) {
    deferred.resolve(result);
    mockNextTick.flush();
  }


  /** helper for synchronous rejection of deferred */
  function syncReject(deferred, reason) {
    deferred.reject(reason);
    mockNextTick.flush();
  }


  /** converts the `log` to a '; '-separated string */
  function logStr() {
    return log.join('; ');
  }


  var mockNextTick = {
    nextTick: function(task) {
      mockNextTick.queue.push(task);
    },
    queue: [],
    flush: function() {
      if (!mockNextTick.queue.length) throw new Error('Nothing to be flushed!');
      while (mockNextTick.queue.length) {
        var queue = mockNextTick.queue;
        mockNextTick.queue = [];
        forEach(queue, function(task) {
          try {
            task();
          } catch(e) {
            dump('exception in mockNextTick:', e, e.name, e.message, task);
          }
        });
      }
    }
  }


  beforeEach(function() {
    q = qFactory(mockNextTick.nextTick, noop),
    defer = q.defer;
    deferred =  defer()
    promise = deferred.promise;
    log = [];
    mockNextTick.queue = [];
  });


  afterEach(function() {
    expect(mockNextTick.queue.length).toBe(0);
  });


  describe('defer', function() {
    it('should create a new deferred', function() {
      expect(deferred.promise).toBeDefined();
      expect(deferred.resolve).toBeDefined();
      expect(deferred.reject).toBeDefined();
    });


    describe('resolve', function() {
      it('should fulfill the promise and execute all success callbacks in the registration order',
          function() {
        promise.then(success(1), error());
        promise.then(success(2), error());
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(foo); success2(foo)');
      });


      it('should do nothing if a promise was previously resolved', function() {
        promise.then(success(), error());
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)');

        log = [];
        deferred.resolve('bar');
        deferred.reject('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');
      });


      it('should do nothing if a promise was previously rejected', function() {
        promise.then(success(), error());
        expect(logStr()).toBe('');

        deferred.reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error(foo)');

        log = [];
        deferred.resolve('bar');
        deferred.reject('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');
      });


      it('should allow deferred resolution with a new promise', function() {
        var deferred2 = defer();
        promise.then(success(), error());

        deferred.resolve(deferred2.promise);
        mockNextTick.flush();
        expect(logStr()).toBe('');

        deferred2.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)');
      });


      it('should call the callback in the next turn', function() {
        promise.then(success());
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)');
      });


      it('should support non-bound execution', function() {
        var resolver = deferred.resolve;
        promise.then(success(), error());
        resolver('detached');
        mockNextTick.flush();
        expect(logStr()).toBe('success(detached)');
      });


      it('should not break if a callbacks registers another callback', function() {
        promise.then(function() {
          log.push('outer');
          promise.then(function() {
            log.push('inner');
          });
        });

        deferred.resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('outer; inner');
      });


      it('should not break if a callbacks tries to resolve the deferred again', function() {
        promise.then(function(val) {
          log.push('success1(' + val + ')');
          deferred.resolve('bar');
        });

        promise.then(success(2));

        deferred.resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('success1(foo); success2(foo)');
      });
    });


    describe('reject', function() {
      it('should reject the promise and execute all error callbacks in the registration order',
          function() {
        promise.then(success(), error(1));
        promise.then(success(), error(2));
        expect(logStr()).toBe('');

        deferred.reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(foo); error2(foo)');
      });


      it('should do nothing if a promise was previously resolved', function() {
        promise.then(success(1), error(1));
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(foo)');

        log = [];
        deferred.reject('bar');
        deferred.resolve('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');

        promise.then(success(2), error(2))
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success2(foo)');
      });


      it('should do nothing if a promise was previously rejected', function() {
        promise.then(success(1), error(1));
        expect(logStr()).toBe('');

        deferred.reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(foo)');

        log = [];
        deferred.reject('bar');
        deferred.resolve('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');

        promise.then(success(2), error(2))
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error2(foo)');
      });


      it('should not defer rejection with a new promise', function() {
        var deferred2 = defer();
        promise.then(success(), error());

        deferred.reject(deferred2.promise);
        mockNextTick.flush();
        expect(logStr()).toBe('error([object Object])');
      });


      it('should call the error callback in the next turn', function() {
        promise.then(success(), error());
        expect(logStr()).toBe('');

        deferred.reject('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('error(foo)');
      });


      it('should support non-bound execution', function() {
        var rejector = deferred.reject;
        promise.then(success(), error());
        rejector('detached');
        mockNextTick.flush();
        expect(logStr()).toBe('error(detached)');
      });
    });


    describe('promise', function() {
      it('should have a then method', function() {
        expect(typeof promise.then).toBe('function');
      });


      describe('then', function() {
        it('should allow registration of a success callback without an errback and resolve',
            function() {
          promise.then(success());
          syncResolve(deferred, 'foo');
          expect(logStr()).toBe('success(foo)');
        });

        it('should allow registration of a success callback without an errback and reject',
            function() {
          promise.then(success());
          syncReject(deferred, 'foo');
          expect(logStr()).toBe('');
        });


        it('should allow registration of an errback without a success callback and reject',
            function() {
          promise.then(null, error());
          syncReject(deferred, 'oops!');
          expect(logStr()).toBe('error(oops!)');
        });


        it('should allow registration of an errback without a success callback and resolve',
            function() {
          promise.then(null, error());
          syncResolve(deferred, 'done');
          expect(logStr()).toBe('');
        });


        it('should resolve all callbacks with the original value', function() {
          promise.then(success('A', 'aVal'), error());
          promise.then(success('B', 'bErr', true), error());
          promise.then(success('C', q.reject('cReason')), error());
          promise.then(success('D', 'dVal'), error());

          expect(logStr()).toBe('');
          syncResolve(deferred, 'yup');
          expect(logStr()).toBe('successA(yup); successB(yup); successC(yup); successD(yup)');
        });


        it('should reject all callbacks with the original reason', function() {
          promise.then(success(), error('A', 'aVal'));
          promise.then(success(), error('B', 'bEr', true));
          promise.then(success(), error('C', q.reject('cReason')));
          promise.then(success(), error('D', 'dVal'));

          expect(logStr()).toBe('');
          syncReject(deferred, 'noo!');
          expect(logStr()).toBe('errorA(noo!); errorB(noo!); errorC(noo!); errorD(noo!)');
        });


        it('should propagate resolution and rejection between dependent promises', function() {
          promise.then(success(1, 'x'), error('1')).
                  then(success(2, 'y', true), error('2')).
                  then(success(3), error(3, 'z', true)).
                  then(success(4), error(4, 'done')).
                  then(success(5), error(5));

          expect(logStr()).toBe('');
          syncResolve(deferred, 'sweet!');
          expect(log).toEqual(['success1(sweet!)',
                               'success2(x)',
                               'error3(y)',
                               'error4(z)',
                               'success5(done)']);
        });


        it('should reject a derived promise if an exception is thrown while resolving its parent',
            function() {
          promise.then(success(1, 'oops', true)).
                  then(success(2), error(2));
          syncResolve(deferred, 'done!');
          expect(logStr()).toBe('success1(done!); error2(oops)');
        });


        it('should reject a derived promise if an exception is thrown while rejecting its parent',
            function() {
          promise.then(null, error(1, 'oops', true)).
                  then(success(2), error(2));
          syncReject(deferred, 'timeout');
          expect(logStr()).toBe('error1(timeout); error2(oops)');
        });


        it('should call success callback in the next turn even if promise is already resolved',
            function() {
          deferred.resolve('done!');

          promise.then(success());
          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['success(done!)']);
        });


        it('should call errpr callback in the next turn even if promise is already rejected',
            function() {
          deferred.reject('oops!');

          promise.then(null, error());
          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['error(oops!)']);
        });
      });
    });
  });


  describe('reject', function() {
    it('should package a string into a rejected promise', function() {
      var rejectedPromise = q.reject('not gonna happen');
      promise.then(success(), error());
      syncResolve(deferred, rejectedPromise);
      expect(log).toEqual(['error(not gonna happen)']);
    });


    it('should package an exception into a rejected promise', function() {
      var rejectedPromise = q.reject(Error('not gonna happen'));
      promise.then(success(), error());
      syncResolve(deferred, rejectedPromise);
      expect(log).toEqual(['error(Error: not gonna happen)']);
    });


    it('should return a promise that forwards callbacks if the callbacks are missing', function() {
      var rejectedPromise = q.reject('rejected');
      promise.then(success(), error());
      syncResolve(deferred, rejectedPromise.then());
      expect(log).toEqual(['error(rejected)']);
    });
  });


  describe('when', function() {
    describe('resolution', function() {
      it('should call the success callback in the next turn when the value is a non-promise',
          function() {
        q.when('hello', success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success(hello)');
      });


      it('should call the success callback in the next turn when the value is a resolved promise',
          function() {
        deferred.resolve('hello');
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success(hello)');
      });


      it('should call the errback in the next turn when the value is a rejected promise', function() {
        deferred.reject('nope');
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error(nope)');
      });


      it('should call the success callback after the original promise is resolved',
          function() {
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('');
        syncResolve(deferred, 'hello');
        expect(logStr()).toBe('success(hello)');
      });


      it('should call the errback after the orignal promise is rejected',
          function() {
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('');
        syncReject(deferred, 'nope');
        expect(logStr()).toBe('error(nope)');
      });
    });


    describe('optional callbacks', function() {
      it('should not require success callback and propagate resolution', function() {
        q.when('hi', null, error()).then(success(2), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success2(hi)');
      });


      it('should not require success callback and propagate rejection', function() {
        q.when(q.reject('sorry'), null, error(1)).then(success(), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry); error2(sorry)');
      });


      it('should not require errback and propagate resolution', function() {
        q.when('hi', success(1, 'hello')).then(success(2), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi); success2(hello)');
      });


      it('should not require errback and propagate rejection', function() {
        q.when(q.reject('sorry'), success()).then(success(2), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error2(sorry)');
      });
    });


    describe('returned promise', function() {
      it('should return a promise that can be resolved with a value returned from the success ' +
          'callback', function() {
        q.when('hello', success(1, 'hi'), error()).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hello); success2(hi)');
      });


      it('should return a promise that can be rejected with a rejected promise returned from the ' +
          'success callback', function() {
        q.when('hello', success(1, q.reject('sorry')), error()).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hello); error2(sorry)');
      });


      it('should return a promise that can be resolved with a value returned from the errback',
          function() {
        q.when(q.reject('sorry'), success(), error(1, 'hi')).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry); success2(hi)');
      });


      it('should return a promise that can be rejected with a rejected promise returned from the ' +
          'errback', function() {
        q.when(q.reject('sorry'), success(), error(1, q.reject('sigh'))).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry); error2(sigh)');
      });


      it('should return a promise that can be resolved with a promise returned from the success ' +
          'callback', function() {
        var deferred2 = defer();
        q.when('hi', success(1, deferred2.promise), error()).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi)');
        syncResolve(deferred2, 'finally!');
        expect(logStr()).toBe('success1(hi); success2(finally!)');
      });


      it('should return a promise that can be resolved with promise returned from the errback ' +
          'callback', function() {
        var deferred2 = defer();
        q.when(q.reject('sorry'), success(), error(1, deferred2.promise)).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry)');
        syncResolve(deferred2, 'finally!');
        expect(logStr()).toBe('error1(sorry); success2(finally!)');
      });
    });


    describe('security', function() {
      it('should call success callback only once even if the original promise gets fullfilled ' +
          'multiple times', function() {
        var evilPromise = {
          then: function(success, error) {
            evilPromise.success = success;
            evilPromise.error = error;
          }
        }

        q.when(evilPromise, success(), error());
        mockNextTick.flush();
        expect(logStr()).toBe('');
        evilPromise.success('done');
        mockNextTick.flush(); // TODO(i) wrong queue, evil promise would be resolved outside of the
                              //   scope.$apply lifecycle and in that case we should have some kind
                              //   of fallback queue for calling our callbacks from. Otherwise the
                              //   application will get stuck until something triggers next $apply.
        expect(logStr()).toBe('success(done)');

        evilPromise.success('evil is me');
        evilPromise.error('burn burn');
        expect(logStr()).toBe('success(done)');
      });


      it('should call errback only once even if the original promise gets fullfilled multiple ' +
          'times', function() {
        var evilPromise = {
          then: function(success, error) {
            evilPromise.success = success;
            evilPromise.error = error;
          }
        }

        q.when(evilPromise, success(), error());
        mockNextTick.flush();
        expect(logStr()).toBe('');
        evilPromise.error('failed');
        expect(logStr()).toBe('error(failed)');

        evilPromise.error('muhaha');
        evilPromise.success('take this');
        expect(logStr()).toBe('error(failed)');
      });
    });
  });


  describe('all (array)', function() {
    it('should resolve all of nothing', function() {
      var result;
      q.all([]).then(function(r) { result = r; });
      mockNextTick.flush();
      expect(result).toEqual([]);
    });


    it('should take an array of promises and return a promise for an array of results', function() {
      var deferred1 = defer(),
          deferred2 = defer();

      q.all([promise, deferred1.promise, deferred2.promise]).then(success(), error());
      expect(logStr()).toBe('');
      syncResolve(deferred, 'hi');
      expect(logStr()).toBe('');
      syncResolve(deferred2, 'cau');
      expect(logStr()).toBe('');
      syncResolve(deferred1, 'hola');
      expect(logStr()).toBe('success([hi,hola,cau])');
    });


    it('should reject the derived promise if at least one of the promises in the array is rejected',
        function() {
      var deferred1 = defer(),
          deferred2 = defer();

      q.all([promise, deferred1.promise, deferred2.promise]).then(success(), error());
      expect(logStr()).toBe('');
      syncResolve(deferred2, 'cau');
      expect(logStr()).toBe('');
      syncReject(deferred1, 'oops');
      expect(logStr()).toBe('error(oops)');
    });


    it('should ignore multiple resolutions of an (evil) array promise', function() {
      var evilPromise = {
        then: function(success, error) {
          evilPromise.success = success;
          evilPromise.error = error;
        }
      }

      q.all([promise, evilPromise]).then(success(), error());
      expect(logStr()).toBe('');

      evilPromise.success('first');
      evilPromise.success('muhaha');
      evilPromise.error('arghhh');
      expect(logStr()).toBe('');

      syncResolve(deferred, 'done');
      expect(logStr()).toBe('success([done,first])');
    });
  });

  describe('all (hash)', function() {
    it('should resolve all of nothing', function() {
      var result;
      q.all({}).then(function(r) { result = r; });
      mockNextTick.flush();
      expect(result).toEqual({});
    });


    it('should take a hash of promises and return a promise for a hash of results', function() {
      var deferred1 = defer(),
          deferred2 = defer();

      q.all({en: promise, fr: deferred1.promise, es: deferred2.promise}).then(success(), error());
      expect(logStr()).toBe('');
      syncResolve(deferred, 'hi');
      expect(logStr()).toBe('');
      syncResolve(deferred2, 'hola');
      expect(logStr()).toBe('');
      syncResolve(deferred1, 'salut');
      expect(logStr()).toBe('success({en:hi,es:hola,fr:salut})');
    });


    it('should reject the derived promise if at least one of the promises in the hash is rejected',
        function() {
      var deferred1 = defer(),
          deferred2 = defer();

      q.all({en: promise, fr: deferred1.promise, es: deferred2.promise}).then(success(), error());
      expect(logStr()).toBe('');
      syncResolve(deferred2, 'hola');
      expect(logStr()).toBe('');
      syncReject(deferred1, 'oops');
      expect(logStr()).toBe('error(oops)');
    });


    it('should ignore multiple resolutions of an (evil) hash promise', function() {
      var evilPromise = {
        then: function(success, error) {
          evilPromise.success = success;
          evilPromise.error = error;
        }
      }

      q.all({good: promise, evil: evilPromise}).then(success(), error());
      expect(logStr()).toBe('');

      evilPromise.success('first');
      evilPromise.success('muhaha');
      evilPromise.error('arghhh');
      expect(logStr()).toBe('');

      syncResolve(deferred, 'done');
      expect(logStr()).toBe('success({evil:first,good:done})');
    });

    it('should handle correctly situation when given the same promise several times', function() {
      q.all({first: promise, second: promise, third: promise}).then(success(), error());
      expect(logStr()).toBe('');

      syncResolve(deferred, 'done');
      expect(logStr()).toBe('success({first:done,second:done,third:done})');
    });
  });

  describe('exception logging', function() {
    var mockExceptionLogger = {
      log: [],
      logger: function(e) {
        mockExceptionLogger.log.push(e);
      }
    }


    beforeEach(function() {
      q = qFactory(mockNextTick.nextTick, mockExceptionLogger.logger),
      defer = q.defer;
      deferred =  defer()
      promise = deferred.promise;
      log = [];
      mockExceptionLogger.log = [];
    });


    describe('in then', function() {
      it('should log exceptions thrown in a success callback and reject the derived promise',
          function() {
        var success1 = success(1, 'oops', true);
        promise.then(success1).then(success(2), error(2));
        syncResolve(deferred, 'done');
        expect(logStr()).toBe('success1(done); error2(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when a success callback returns rejected promise', function() {
        promise.then(success(1, q.reject('rejected'))).then(success(2), error(2));
        syncResolve(deferred, 'done');
        expect(logStr()).toBe('success1(done); error2(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });


      it('should log exceptions thrown in a errback and reject the derived promise', function() {
        var error1 = error(1, 'oops', true);
        promise.then(null, error1).then(success(2), error(2));
        syncReject(deferred, 'nope');
        expect(logStr()).toBe('error1(nope); error2(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when an errback returns a rejected promise', function() {
        promise.then(null, error(1, q.reject('rejected'))).then(success(2), error(2));
        syncReject(deferred, 'nope');
        expect(logStr()).toBe('error1(nope); error2(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });
    });


    describe('in when', function() {
      it('should log exceptions thrown in a success callback and reject the derived promise',
          function() {
        var success1 = success(1, 'oops', true);
        q.when('hi', success1, error()).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi); error2(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when a success callback returns rejected promise', function() {
        q.when('hi', success(1, q.reject('rejected'))).then(success(2), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi); error2(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });


      it('should log exceptions thrown in a errback and reject the derived promise', function() {
        var error1 = error(1, 'oops', true);
        q.when(q.reject('sorry'), success(), error1).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry); error2(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when an errback returns a rejected promise', function() {
        q.when(q.reject('sorry'), success(), error(1, q.reject('rejected'))).
          then(success(2), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry); error2(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });
    });
  });
});
