/* global qFactory: false */
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

  // The following private functions are used to help with logging for testing invocation of the
  // promise callbacks.
  function _argToString(arg) {
    return (typeof arg === 'object' && !(arg instanceof Error)) ? toJson(arg) : '' + arg;
  }

  function _argumentsToString(args) {
    return sliceArgs(args).map(_argToString).join(',');
  }

  // Help log invocation of success(), finally(), progress() and error()
  function _logInvocation(funcName, args, returnVal, throwReturnVal) {
    var logPrefix = funcName + '(' +  _argumentsToString(args) + ')';
    if (throwReturnVal) {
      log.push(logPrefix + '->throw(' +  _argToString(returnVal) + ')');
      throw returnVal;
    } else {
      if (isUndefined(returnVal)) {
        log.push(logPrefix);
      } else {
        log.push(logPrefix + '->' +  _argToString(returnVal));
      }
      return returnVal;
    }
  }

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
    name = 'success' + (name || '');
    return function() {
      return _logInvocation(name, arguments, (returnValDefined ? returnVal : arguments[0]), throwReturnVal);
    };
  }

  /**
   * Creates a callback that logs its invocation in `log`.
   *
   * @param {(number|string)} name Suffix for 'finally' name. e.g. finally(1) => finally
   * @param {*=} returnVal Value that the callback should return. If unspecified, the passed in
   *     value is returned.
   * @param {boolean=} throwReturnVal If true, the `returnVal` will be thrown rather than returned.
   */
  function fin(name, returnVal, throwReturnVal) {
    var returnValDefined = (arguments.length >= 2);
    name = 'finally' + (name || '');
    return function() {
      return _logInvocation(name, arguments, (returnValDefined ? returnVal : arguments[0]), throwReturnVal);
    };
  }

  /**
   * Creates a callback that logs its invocation in `log`.
   *
   * @param {(number|string)} name Suffix for 'progress' name. e.g. progress(1) => progress
   * @param {*=} returnVal Value that the callback should return. If unspecified, the passed in
   *     value is returned.
   * @param {boolean=} throwReturnVal If true, the `returnVal` will be thrown rather than returned.
   */
  function progress(name, returnVal, throwReturnVal) {
    var returnValDefined = (arguments.length >= 2);
    name = 'progress' + (name || '');
    return function() {
      return _logInvocation(name, arguments, (returnValDefined ? returnVal : arguments[0]), throwReturnVal);
    };
  }

  /**
   * Creates a callback that logs its invocation in `log`.
   *
   * @param {(number|string)} name Suffix for 'error' name. e.g. error(1) => error
   * @param {*=} returnVal Value that the callback should return. If unspecified, the passed in
   *     value is first passed to q.reject() and the result is returned.
   * @param {boolean=} throwReturnVal If true, the `returnVal` will be thrown rather than returned.
   */
  function error(name, returnVal, throwReturnVal) {
    var returnValDefined = (arguments.length >= 2);
    name = 'error' + (name || '');
    return function() {
      if (!returnValDefined) {
        _logInvocation(name, arguments, 'reject(' + _argToString(arguments[0]) + ')', throwReturnVal);
        return q.reject(arguments[0]);
      } else {
        return _logInvocation(name, arguments, returnVal, throwReturnVal);
      }
    };
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


  /** helper for synchronous notification of deferred */
  function syncNotify(deferred, progress) {
    deferred.notify(progress);
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
    logExceptions: true,
    flush: function() {
      if (!mockNextTick.queue.length) throw new Error('Nothing to be flushed!');
      while (mockNextTick.queue.length) {
        var queue = mockNextTick.queue;
        mockNextTick.queue = [];
        forEach(queue, function(task) {
          try {
            task();
          } catch (e) {
            if (mockNextTick.logExceptions) {
              dump('exception in mockNextTick:', e, e.name, e.message, task);
            }
          }
        });
      }
    }
  };


  beforeEach(function() {
    q = qFactory(mockNextTick.nextTick, noop),
    defer = q.defer;
    deferred =  defer();
    promise = deferred.promise;
    log = [];
    mockNextTick.queue = [];
  });


  afterEach(function() {
    expect(mockNextTick.queue.length).toBe(0);
  });


  describe('$Q', function() {
    var resolve, reject, resolve2, reject2;
    var createPromise = function() {
      return q(function(resolveFn, rejectFn) {
        if (resolve === null) {
          resolve = resolveFn;
          reject = rejectFn;
        } else if (resolve2 === null) {
          resolve2 = resolveFn;
          reject2 = rejectFn;
        }
      });
    };

    afterEach(function() {
      resolve = reject = resolve2 = reject2 = null;
    });

    it('should return a Promise', function() {
      var promise = q(noop);
      expect(typeof promise.then).toBe('function');
      expect(typeof promise.catch).toBe('function');
      expect(typeof promise.finally).toBe('function');
    });


    describe('resolve', function() {
      it('should fulfill the promise and execute all success callbacks in the registration order',
          function() {
        var promise = createPromise();
        promise.then(success(1), error());
        promise.then(success(2), error());
        expect(logStr()).toBe('');

        resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(foo)->foo; success2(foo)->foo');
      });


      it('should do nothing if a promise was previously resolved', function() {
        var promise = createPromise();
        promise.then(success(), error());
        expect(logStr()).toBe('');

        resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)->foo');

        log = [];
        resolve('bar');
        reject('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');
      });


      it('should do nothing if a promise was previously rejected', function() {
        var promise = createPromise();
        promise.then(success(), error());
        expect(logStr()).toBe('');

        reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error(foo)->reject(foo)');

        log = [];
        resolve('bar');
        reject('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');
      });


      it('should allow deferred resolution with a new promise', function() {
        var promise = createPromise();

        promise.then(success(), error());

        resolve(createPromise());
        expect(logStr()).toBe('');

        resolve2('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)->foo');
      });


      it('should call the callback in the next turn', function() {
        var promise = createPromise();
        promise.then(success());
        expect(logStr()).toBe('');

        resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)->foo');
      });


      it('should not break if a callbacks registers another callback', function() {
        var promise = createPromise();
        promise.then(function() {
          log.push('outer');
          promise.then(function() {
            log.push('inner');
          });
        });

        resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('outer; inner');
      });


      it('should not break if a callbacks tries to resolve the deferred again', function() {
        var promise = createPromise();
        promise.then(function(val) {
          log.push('then1(' + val + ')->resolve(bar)');
          deferred.resolve('bar'); // nop
        });

        promise.then(success(2));

        resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('then1(foo)->resolve(bar); success2(foo)->foo');
      });
    });


    describe('reject', function() {
      it('should reject the promise and execute all error callbacks in the registration order',
          function() {
        var promise = createPromise();
        promise.then(success(), error(1));
        promise.then(success(), error(2));
        expect(logStr()).toBe('');

        reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(foo)->reject(foo); error2(foo)->reject(foo)');
      });


      it('should do nothing if a promise was previously resolved', function() {
        var promise = createPromise();
        promise.then(success(1), error(1));
        expect(logStr()).toBe('');

        resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(foo)->foo');

        log = [];
        reject('bar');
        resolve('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');

        promise.then(success(2), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success2(foo)->foo');
      });


      it('should do nothing if a promise was previously rejected', function() {
        var promise = createPromise();
        promise.then(success(1), error(1));
        expect(logStr()).toBe('');

        reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(foo)->reject(foo)');

        log = [];
        reject('bar');
        resolve('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');

        promise.then(success(2), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error2(foo)->reject(foo)');
      });


      it('should not defer rejection with a new promise', function() {
        var promise = createPromise();
        promise.then(success(), error());

        reject(createPromise());
        mockNextTick.flush();
        expect(logStr()).toBe('error({})->reject({})');
      });


      it('should call the error callback in the next turn', function() {
        var promise = createPromise();
        promise.then(success(), error());
        expect(logStr()).toBe('');

        reject('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('error(foo)->reject(foo)');
      });


      it('should support non-bound execution', function() {
        var promise = createPromise();
        promise.then(success(), error());
        reject('detached');
        mockNextTick.flush();
        expect(logStr()).toBe('error(detached)->reject(detached)');
      });
    });


    describe('promise', function() {
      describe('then', function() {
        it('should allow registration of a success callback without an errback or progressback ' +
          'and resolve', function() {
          var promise = createPromise();
          promise.then(success());
          resolve('foo');
          mockNextTick.flush();
          expect(logStr()).toBe('success(foo)->foo');
        });


        it('should allow registration of a success callback without an errback and reject',
            function() {
          var promise = createPromise();
          promise.then(success());
          reject('foo');
          mockNextTick.flush();
          expect(logStr()).toBe('');
        });


        it('should allow registration of an errback without a success or progress callback and ' +
          ' reject', function() {
          var promise = createPromise();
          promise.then(null, error());
          reject('oops!');
          mockNextTick.flush();
          expect(logStr()).toBe('error(oops!)->reject(oops!)');
        });


        it('should allow registration of an errback without a success callback and resolve',
            function() {
          var promise = createPromise();
          promise.then(null, error());
          resolve('done');
          mockNextTick.flush();
          expect(logStr()).toBe('');
        });


        it('should allow registration of an progressback without a success callback and resolve',
            function() {
          var promise = createPromise();
          promise.then(null, null, progress());
          resolve('done');
          mockNextTick.flush();
          expect(logStr()).toBe('');
        });


        it('should allow registration of an progressback without a error callback and reject',
            function() {
          var promise = createPromise();
          promise.then(null, null, progress());
          reject('oops!');
          mockNextTick.flush();
          expect(logStr()).toBe('');
        });


        it('should resolve all callbacks with the original value', function() {
          var promise = createPromise();
          promise.then(success('A', 'aVal'), error(), progress());
          promise.then(success('B', 'bErr', true), error(), progress());
          promise.then(success('C', q.reject('cReason')), error(), progress());
          promise.then(success('D', q.reject('dReason'), true), error(), progress());
          promise.then(success('E', 'eVal'), error(), progress());

          expect(logStr()).toBe('');
          resolve('yup');
          mockNextTick.flush();
          expect(log).toEqual(['successA(yup)->aVal',
                               'successB(yup)->throw(bErr)',
                               'successC(yup)->{}',
                               'successD(yup)->throw({})',
                               'successE(yup)->eVal']);
        });


        it('should reject all callbacks with the original reason', function() {
          var promise = createPromise();
          promise.then(success(), error('A', 'aVal'), progress());
          promise.then(success(), error('B', 'bEr', true), progress());
          promise.then(success(), error('C', q.reject('cReason')), progress());
          promise.then(success(), error('D', 'dVal'), progress());

          expect(logStr()).toBe('');
          reject('noo!');
          mockNextTick.flush();
          expect(logStr()).toBe('errorA(noo!)->aVal; errorB(noo!)->throw(bEr); errorC(noo!)->{}; errorD(noo!)->dVal');
        });


        it('should propagate resolution and rejection between dependent promises', function() {
          var promise = createPromise();
          promise.then(success(1, 'x'),       error('1')).
                  then(success(2, 'y', true), error('2')).
                  then(success(3),            error(3, 'z', true)).
                  then(success(4),            error(4, 'done')).
                  then(success(5),            error(5));

          expect(logStr()).toBe('');
          resolve('sweet!');
          mockNextTick.flush();
          expect(log).toEqual(['success1(sweet!)->x',
                               'success2(x)->throw(y)',
                               'error3(y)->throw(z)',
                               'error4(z)->done',
                               'success5(done)->done']);
        });


        it('should reject a derived promise if an exception is thrown while resolving its parent',
            function() {
          var promise = createPromise();
          promise.then(success(1, 'oops', true), error(1)).
                  then(success(2),               error(2));
          resolve('done!');
          mockNextTick.flush();
          expect(logStr()).toBe('success1(done!)->throw(oops); error2(oops)->reject(oops)');
        });


        it('should reject a derived promise if an exception is thrown while rejecting its parent',
            function() {
          var promise = createPromise();
          promise.then(null,       error(1, 'oops', true)).
                  then(success(2), error(2));
          reject('timeout');
          mockNextTick.flush();
          expect(logStr()).toBe('error1(timeout)->throw(oops); error2(oops)->reject(oops)');
        });


        it('should call success callback in the next turn even if promise is already resolved',
            function() {
          var promise = createPromise();
          resolve('done!');

          promise.then(success());
          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['success(done!)->done!']);
        });


        it('should call error callback in the next turn even if promise is already rejected',
            function() {
          var promise = createPromise();
          reject('oops!');

          promise.then(null, error());
          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['error(oops!)->reject(oops!)']);
        });

        it('should forward success resolution when success callbacks are not functions', function() {
          var promise = createPromise();
          resolve('yay!');

          promise.then(1).
                  then(null).
                  then({}).
                  then('gah!').
                  then([]).
                  then(success());

          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['success(yay!)->yay!']);
        });

        it('should forward error resolution when error callbacks are not functions', function() {
          var promise = createPromise();
          reject('oops!');

          promise.then(null, 1).
                  then(null, null).
                  then(null, {}).
                  then(null, 'gah!').
                  then(null, []).
                  then(null, error());

          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['error(oops!)->reject(oops!)']);
        });
      });


      describe('finally', function() {
        it('should not take an argument',
            function() {
          var promise = createPromise();
          promise['finally'](fin(1));
          resolve('foo');
          mockNextTick.flush();
          expect(logStr()).toBe('finally1()');
        });

        describe("when the promise is fulfilled", function() {
          it('should call the callback',
              function() {
            var promise = createPromise();
            promise.then(success(1))['finally'](fin(1));
            resolve('foo');
            mockNextTick.flush();
            expect(logStr()).toBe('success1(foo)->foo; finally1()');
          });

          it('should fulfill with the original value',
              function() {
            var promise = createPromise();
            promise['finally'](fin('B', 'b'), error('B')).
                    then(success('BB', 'bb'), error('BB'));
            resolve('RESOLVED_VAL');
            mockNextTick.flush();
            expect(log).toEqual(['finallyB()->b',
                                 'successBB(RESOLVED_VAL)->bb']);
          });


          it('should fulfill with the original value (larger test)',
              function() {
            var promise = createPromise();
            promise.then(success('A', 'a'), error('A'));
            promise['finally'](fin('B', 'b'), error('B')).
                    then(success('BB', 'bb'), error('BB'));
            promise.then(success('C', 'c'), error('C'))['finally'](fin('CC', 'IGNORED'))
                   .then(success('CCC', 'cc'), error('CCC'))
                   .then(success('CCCC', 'ccc'), error('CCCC'));
            resolve('RESOLVED_VAL');
            mockNextTick.flush();

            expect(log).toEqual(['successA(RESOLVED_VAL)->a',
                                 'finallyB()->b',
                                 'successC(RESOLVED_VAL)->c',
                                 'finallyCC()->IGNORED',
                                 'successBB(RESOLVED_VAL)->bb',
                                 'successCCC(c)->cc',
                                 'successCCCC(cc)->ccc']);
          });

          describe("when the callback returns a promise", function() {
            describe("that is fulfilled", function() {
              it("should fulfill with the original reason after that promise resolves",
                function() {
                var promise = createPromise();
                var promise2 = createPromise();
                resolve2('bar');

                promise['finally'](fin(1, promise))
                       .then(success(2));

                resolve('foo');
                mockNextTick.flush();

                expect(logStr()).toBe('finally1()->{}; success2(foo)->foo');
              });
            });

            describe("that is rejected", function() {
              it("should reject with this new rejection reason",
                  function() {
                var promise = createPromise();
                var promise2 = createPromise();
                reject2('bar');
                promise['finally'](fin(1, promise2))
                       .then(success(2), error(1));
                resolve('foo');
                mockNextTick.flush();
                expect(logStr()).toBe('finally1()->{}; error1(bar)->reject(bar)');
              });
            });

          });

          describe("when the callback throws an exception", function() {
            it("should reject with this new exception", function() {
              var promise = createPromise();
              promise['finally'](fin(1, "exception", true))
                     .then(success(1), error(2));
              resolve('foo');
              mockNextTick.flush();
              expect(logStr()).toBe('finally1()->throw(exception); error2(exception)->reject(exception)');
            });
          });

        });


        describe("when the promise is rejected", function() {
          it("should call the callback", function() {
            var promise = createPromise();
            promise['finally'](fin(1))
                   .then(success(2), error(1));
            reject('foo');
            mockNextTick.flush();
            expect(logStr()).toBe('finally1(); error1(foo)->reject(foo)');
          });

          it('should reject with the original reason', function() {
            var promise = createPromise();
            promise['finally'](fin(1), "hello")
                   .then(success(2), error(2));
            reject('original');
            mockNextTick.flush();
            expect(logStr()).toBe('finally1(); error2(original)->reject(original)');
          });

          describe("when the callback returns a promise", function() {
            describe("that is fulfilled", function() {
              it("should reject with the original reason after that promise resolves", function() {
                var promise = createPromise();
                var promise2 = createPromise();
                resolve2('bar');
                promise['finally'](fin(1, promise2))
                       .then(success(2), error(2));
                reject('original');
                mockNextTick.flush();
                expect(logStr()).toBe('finally1()->{}; error2(original)->reject(original)');
              });
            });

            describe("that is rejected", function() {
              it("should reject with the new reason", function() {
                var promise = createPromise();
                var promise2 = createPromise();
                reject2('bar');
                promise['finally'](fin(1, promise2))
                       .then(success(2), error(1));
                resolve('foo');
                mockNextTick.flush();
                expect(logStr()).toBe('finally1()->{}; error1(bar)->reject(bar)');
              });
            });
          });

          describe("when the callback throws an exception", function() {
            it("should reject with this new exception", function() {
              var promise = createPromise();
              promise['finally'](fin(1, "exception", true))
                     .then(success(1), error(2));
              resolve('foo');
              mockNextTick.flush();
              expect(logStr()).toBe('finally1()->throw(exception); error2(exception)->reject(exception)');
            });
          });
        });
      });

      describe('catch', function() {
        it('should be a shorthand for defining promise error handlers', function() {
          var promise = createPromise();
          promise['catch'](error(1)).then(null, error(2));
          reject('foo');
          mockNextTick.flush();
          expect(logStr()).toBe('error1(foo)->reject(foo); error2(foo)->reject(foo)');
        });
      });
    });
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
        expect(logStr()).toBe('success1(foo)->foo; success2(foo)->foo');
      });


      it('should complain if promise fulfilled with itself', function() {
        var resolveSpy = jasmine.createSpy('resolve');
        var rejectSpy = jasmine.createSpy('reject');
        promise.then(resolveSpy, rejectSpy);
        deferred.resolve(deferred.promise);
        mockNextTick.flush();

        expect(resolveSpy).not.toHaveBeenCalled();
        expect(rejectSpy).toHaveBeenCalled();
        expect(rejectSpy.calls[0].args[0].message).
            toMatch(/\[\$q\:qcycle\] Expected promise to be resolved with value other than itself/);
      });


      it('should do nothing if a promise was previously resolved', function() {
        promise.then(success(), error());
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)->foo');

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
        expect(logStr()).toBe('error(foo)->reject(foo)');

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
        expect(logStr()).toBe('');

        deferred2.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)->foo');
      });


      it('should call the callback in the next turn', function() {
        promise.then(success());
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('success(foo)->foo');
      });


      it('should support non-bound execution', function() {
        var resolver = deferred.resolve;
        promise.then(success(), error());
        resolver('detached');
        mockNextTick.flush();
        expect(logStr()).toBe('success(detached)->detached');
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
          log.push('then1(' + val + ')->resolve(bar)');
          deferred.resolve('bar'); // nop
        });

        promise.then(success(2));

        deferred.resolve('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('then1(foo)->resolve(bar); success2(foo)->foo');
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
        expect(logStr()).toBe('error1(foo)->reject(foo); error2(foo)->reject(foo)');
      });


      it('should do nothing if a promise was previously resolved', function() {
        promise.then(success(1), error(1));
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(foo)->foo');

        log = [];
        deferred.reject('bar');
        deferred.resolve('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');

        promise.then(success(2), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success2(foo)->foo');
      });


      it('should do nothing if a promise was previously rejected', function() {
        promise.then(success(1), error(1));
        expect(logStr()).toBe('');

        deferred.reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(foo)->reject(foo)');

        log = [];
        deferred.reject('bar');
        deferred.resolve('baz');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');

        promise.then(success(2), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error2(foo)->reject(foo)');
      });


      it('should not defer rejection with a new promise', function() {
        var deferred2 = defer();
        promise.then(success(), error());

        deferred.reject(deferred2.promise);
        mockNextTick.flush();
        expect(logStr()).toBe('error({})->reject({})');
      });


      it('should call the error callback in the next turn', function() {
        promise.then(success(), error());
        expect(logStr()).toBe('');

        deferred.reject('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('error(foo)->reject(foo)');
      });


      it('should support non-bound execution', function() {
        var rejector = deferred.reject;
        promise.then(success(), error());
        rejector('detached');
        mockNextTick.flush();
        expect(logStr()).toBe('error(detached)->reject(detached)');
      });
    });


    describe('notify', function() {
      it('should execute all progress callbacks in the registration order',
          function() {
        promise.then(success(1), error(1), progress(1));
        promise.then(success(2), error(2), progress(2));
        expect(logStr()).toBe('');

        deferred.notify('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('progress1(foo)->foo; progress2(foo)->foo');
      });


      it('should do nothing if a promise was previously resolved', function() {
        promise.then(success(1), error(1), progress(1));
        expect(logStr()).toBe('');

        deferred.resolve('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(foo)->foo');

        log = [];
        deferred.notify('bar');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');
      });


      it('should do nothing if a promise was previously rejected', function() {
        promise.then(success(1), error(1), progress(1));
        expect(logStr()).toBe('');

        deferred.reject('foo');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(foo)->reject(foo)');

        log = [];
        deferred.reject('bar');
        deferred.resolve('baz');
        deferred.notify('qux');
        expect(mockNextTick.queue.length).toBe(0);
        expect(logStr()).toBe('');

        promise.then(success(2), error(2), progress(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error2(foo)->reject(foo)');
      });


      it('should not apply any special treatment to promises passed to notify', function() {
        var deferred2 = defer();
        promise.then(success(), error(), progress());

        deferred.notify(deferred2.promise);
        mockNextTick.flush();
        expect(logStr()).toBe('progress({})->{}');
      });


      it('should call the progress callbacks in the next turn', function() {
        promise.then(success(), error(), progress(1));
        promise.then(success(), error(), progress(2));
        expect(logStr()).toBe('');

        deferred.notify('foo');
        expect(logStr()).toBe('');

        mockNextTick.flush();
        expect(logStr()).toBe('progress1(foo)->foo; progress2(foo)->foo');
      });


      it('should ignore notifications sent out in the same turn before listener registration',
          function() {
        deferred.notify('foo');
        promise.then(success(), error(), progress(1));
        expect(logStr()).toBe('');
        expect(mockNextTick.queue).toEqual([]);
      });


      it('should support non-bound execution', function() {
        var notify = deferred.notify;
        promise.then(success(), error(), progress());
        notify('detached');
        mockNextTick.flush();
        expect(logStr()).toBe('progress(detached)->detached');
      });


      it("should not save and re-emit progress notifications between ticks", function() {
        promise.then(success(1), error(1), progress(1));
        deferred.notify('foo');
        deferred.notify('bar');
        mockNextTick.flush();
        expect(logStr()).toBe('progress1(foo)->foo; progress1(bar)->bar');

        log = [];
        promise.then(success(2), error(2), progress(2));
        deferred.notify('baz');
        mockNextTick.flush();
        expect(logStr()).toBe('progress1(baz)->baz; progress2(baz)->baz');
      });

    });


    describe('promise', function() {
      it('should have a then method', function() {
        expect(typeof promise.then).toBe('function');
      });

      it('should have a catch method', function() {
        expect(typeof promise['catch']).toBe('function');
      });

      it('should have a finally method', function() {
        expect(typeof promise['finally']).toBe('function');
      });


      describe('then', function() {
        it('should allow registration of a success callback without an errback or progressback ' +
          'and resolve', function() {
          promise.then(success());
          syncResolve(deferred, 'foo');
          expect(logStr()).toBe('success(foo)->foo');
        });


        it('should allow registration of a success callback without an errback and reject',
            function() {
          promise.then(success());
          syncReject(deferred, 'foo');
          expect(logStr()).toBe('');
        });


        it('should allow registration of a success callback without an progressback and notify',
            function() {
          promise.then(success());
          syncNotify(deferred, 'doing');
          expect(logStr()).toBe('');
        });


        it('should allow registration of an errback without a success or progress callback and ' +
          ' reject', function() {
          promise.then(null, error());
          syncReject(deferred, 'oops!');
          expect(logStr()).toBe('error(oops!)->reject(oops!)');
        });


        it('should allow registration of an errback without a success callback and resolve',
            function() {
          promise.then(null, error());
          syncResolve(deferred, 'done');
          expect(logStr()).toBe('');
        });


        it('should allow registration of an errback without a progress callback and notify',
            function() {
          promise.then(null, error());
          syncNotify(deferred, 'doing');
          expect(logStr()).toBe('');
        });


        it('should allow registration of an progressback without a success or error callback and ' +
          'notify', function() {
          promise.then(null, null, progress());
          syncNotify(deferred, 'doing');
          expect(logStr()).toBe('progress(doing)->doing');
        });


        it('should allow registration of an progressback without a success callback and resolve',
            function() {
          promise.then(null, null, progress());
          syncResolve(deferred, 'done');
          expect(logStr()).toBe('');
        });


        it('should allow registration of an progressback without a error callback and reject',
            function() {
          promise.then(null, null, progress());
          syncReject(deferred, 'oops!');
          expect(logStr()).toBe('');
        });


        it('should resolve all callbacks with the original value', function() {
          promise.then(success('A', 'aVal'), error(), progress());
          promise.then(success('B', 'bErr', true), error(), progress());
          promise.then(success('C', q.reject('cReason')), error(), progress());
          promise.then(success('D', q.reject('dReason'), true), error(), progress());
          promise.then(success('E', 'eVal'), error(), progress());

          expect(logStr()).toBe('');
          syncResolve(deferred, 'yup');
          expect(log).toEqual(['successA(yup)->aVal',
                               'successB(yup)->throw(bErr)',
                               'successC(yup)->{}',
                               'successD(yup)->throw({})',
                               'successE(yup)->eVal']);
        });


        it('should reject all callbacks with the original reason', function() {
          promise.then(success(), error('A', 'aVal'), progress());
          promise.then(success(), error('B', 'bEr', true), progress());
          promise.then(success(), error('C', q.reject('cReason')), progress());
          promise.then(success(), error('D', 'dVal'), progress());

          expect(logStr()).toBe('');
          syncReject(deferred, 'noo!');
          expect(logStr()).toBe('errorA(noo!)->aVal; errorB(noo!)->throw(bEr); errorC(noo!)->{}; errorD(noo!)->dVal');
        });


        it('should notify all callbacks with the original value', function() {
          promise.then(success(), error(), progress('A', 'aVal'));
          promise.then(success(), error(), progress('B', 'bErr', true));
          promise.then(success(), error(), progress('C', q.reject('cReason')));
          promise.then(success(), error(), progress('C_reject', q.reject('cRejectReason'), true));
          promise.then(success(), error(), progress('Z', 'the end!'));

          expect(logStr()).toBe('');
          syncNotify(deferred, 'yup');
          expect(log).toEqual(['progressA(yup)->aVal',
                               'progressB(yup)->throw(bErr)',
                               'progressC(yup)->{}',
                               'progressC_reject(yup)->throw({})',
                               'progressZ(yup)->the end!']);
        });


        it('should propagate resolution and rejection between dependent promises', function() {
          promise.then(success(1, 'x'),       error('1')).
                  then(success(2, 'y', true), error('2')).
                  then(success(3),            error(3, 'z', true)).
                  then(success(4),            error(4, 'done')).
                  then(success(5),            error(5));

          expect(logStr()).toBe('');
          syncResolve(deferred, 'sweet!');
          expect(log).toEqual(['success1(sweet!)->x',
                               'success2(x)->throw(y)',
                               'error3(y)->throw(z)',
                               'error4(z)->done',
                               'success5(done)->done']);
        });


        it('should propagate notification between dependent promises', function() {
          promise.then(success(), error(), progress(1, 'a')).
                  then(success(), error(), progress(2, 'b')).
                  then(success(), error(), progress(3, 'c')).
                  then(success(), error(), progress(4)).
                  then(success(), error(), progress(5));

          expect(logStr()).toBe('');
          syncNotify(deferred, 'wait');
          expect(log).toEqual(['progress1(wait)->a',
                               'progress2(a)->b',
                               'progress3(b)->c',
                               'progress4(c)->c',
                               'progress5(c)->c']);
        });


        it('should reject a derived promise if an exception is thrown while resolving its parent',
            function() {
          promise.then(success(1, 'oops', true), error(1)).
                  then(success(2),               error(2));
          syncResolve(deferred, 'done!');
          expect(logStr()).toBe('success1(done!)->throw(oops); error2(oops)->reject(oops)');
        });


        it('should reject a derived promise if an exception is thrown while rejecting its parent',
            function() {
          promise.then(null,       error(1, 'oops', true)).
                  then(success(2), error(2));
          syncReject(deferred, 'timeout');
          expect(logStr()).toBe('error1(timeout)->throw(oops); error2(oops)->reject(oops)');
        });


        it('should stop notification propagation in case of error', function() {
          promise.then(success(), error(), progress(1)).
                  then(success(), error(), progress(2, 'ops!', true)).
                  then(success(), error(), progress(3));

          expect(logStr()).toBe('');
          syncNotify(deferred, 'wait');
          expect(log).toEqual(['progress1(wait)->wait',
                               'progress2(wait)->throw(ops!)']);
        });


        it('should call success callback in the next turn even if promise is already resolved',
            function() {
          deferred.resolve('done!');

          promise.then(success());
          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['success(done!)->done!']);
        });


        it('should call error callback in the next turn even if promise is already rejected',
            function() {
          deferred.reject('oops!');

          promise.then(null, error());
          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['error(oops!)->reject(oops!)']);
        });

        it('should forward success resolution when success callbacks are not functions', function() {
          deferred.resolve('yay!');

          promise.then(1).
                  then(null).
                  then({}).
                  then('gah!').
                  then([]).
                  then(success());

          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['success(yay!)->yay!']);
        });

        it('should forward error resolution when error callbacks are not functions', function() {
          deferred.reject('oops!');

          promise.then(null, 1).
                  then(null, null).
                  then(null, {}).
                  then(null, 'gah!').
                  then(null, []).
                  then(null, error());

          expect(logStr()).toBe('');

          mockNextTick.flush();
          expect(log).toEqual(['error(oops!)->reject(oops!)']);
        });
      });


      describe('finally', function() {

        it('should not take an argument',
            function() {
          promise['finally'](fin(1));
          syncResolve(deferred, 'foo');
          expect(logStr()).toBe('finally1()');
        });

        describe("when the promise is fulfilled", function() {

          it('should call the callback',
              function() {
            promise.then(success(1))['finally'](fin(1));
            syncResolve(deferred, 'foo');
            expect(logStr()).toBe('success1(foo)->foo; finally1()');
          });

          it('should fulfill with the original value',
              function() {
            promise['finally'](fin('B', 'b'), error('B')).
                    then(success('BB', 'bb'), error('BB'));
            syncResolve(deferred, 'RESOLVED_VAL');
            expect(log).toEqual(['finallyB()->b',
                                 'successBB(RESOLVED_VAL)->bb']);
          });


          it('should fulfill with the original value (larger test)',
              function() {
            promise.then(success('A', 'a'), error('A'));
            promise['finally'](fin('B', 'b'), error('B')).
                    then(success('BB', 'bb'), error('BB'));
            promise.then(success('C', 'c'), error('C'))['finally'](fin('CC', 'IGNORED'))
                   .then(success('CCC', 'cc'), error('CCC'))
                   .then(success('CCCC', 'ccc'), error('CCCC'));
            syncResolve(deferred, 'RESOLVED_VAL');

            expect(log).toEqual(['successA(RESOLVED_VAL)->a',
                                 'finallyB()->b',
                                 'successC(RESOLVED_VAL)->c',
                                 'finallyCC()->IGNORED',
                                 'successBB(RESOLVED_VAL)->bb',
                                 'successCCC(c)->cc',
                                 'successCCCC(cc)->ccc']);
          });

          describe("when the callback returns a promise", function() {

            describe("that is fulfilled", function() {
              it("should fulfill with the original reason after that promise resolves",
                function() {

                var returnedDef = defer();
                returnedDef.resolve('bar');

                promise['finally'](fin(1, returnedDef.promise))
                       .then(success(2));

                syncResolve(deferred, 'foo');

                expect(logStr()).toBe('finally1()->{}; success2(foo)->foo');
              });
            });

            describe("that is rejected", function() {
              it("should reject with this new rejection reason",
                function() {
                var returnedDef = defer();
                returnedDef.reject('bar');
                promise['finally'](fin(1, returnedDef.promise))
                       .then(success(2), error(1));
                syncResolve(deferred, 'foo');
                expect(logStr()).toBe('finally1()->{}; error1(bar)->reject(bar)');
              });
            });

          });

          describe("when the callback throws an exception", function() {
            it("should reject with this new exception", function() {
              promise['finally'](fin(1, "exception", true))
                     .then(success(1), error(2));
              syncResolve(deferred, 'foo');
              expect(logStr()).toBe('finally1()->throw(exception); error2(exception)->reject(exception)');
            });
          });

        });


        describe("when the promise is rejected", function() {

          it("should call the callback", function() {
            promise['finally'](fin(1))
                   .then(success(2), error(1));
            syncReject(deferred, 'foo');
            expect(logStr()).toBe('finally1(); error1(foo)->reject(foo)');
          });

          it('should reject with the original reason', function() {
            promise['finally'](fin(1), "hello")
                   .then(success(2), error(2));
            syncReject(deferred, 'original');
            expect(logStr()).toBe('finally1(); error2(original)->reject(original)');
          });

          describe("when the callback returns a promise", function() {

            describe("that is fulfilled", function() {

              it("should reject with the original reason after that promise resolves", function() {
                var returnedDef = defer();
                returnedDef.resolve('bar');
                promise['finally'](fin(1, returnedDef.promise))
                       .then(success(2), error(2));
                syncReject(deferred, 'original');
                expect(logStr()).toBe('finally1()->{}; error2(original)->reject(original)');
              });

            });

            describe("that is rejected", function() {

              it("should reject with the new reason", function() {
                var returnedDef = defer();
                returnedDef.reject('bar');
                promise['finally'](fin(1, returnedDef.promise))
                       .then(success(2), error(1));
                syncResolve(deferred, 'foo');
                expect(logStr()).toBe('finally1()->{}; error1(bar)->reject(bar)');
              });

            });

          });

          describe("when the callback throws an exception", function() {

            it("should reject with this new exception", function() {
              promise['finally'](fin(1, "exception", true))
                     .then(success(1), error(2));
              syncResolve(deferred, 'foo');
              expect(logStr()).toBe('finally1()->throw(exception); error2(exception)->reject(exception)');
            });

          });

        });
      });

      describe('catch', function() {
        it('should be a shorthand for defining promise error handlers', function() {
          promise['catch'](error(1)).then(null, error(2));
          syncReject(deferred, 'foo');
          expect(logStr()).toBe('error1(foo)->reject(foo); error2(foo)->reject(foo)');
        });
      });
    });
  });


  describe('reject', function() {
    it('should package a string into a rejected promise', function() {
      var rejectedPromise = q.reject('not gonna happen');
      promise.then(success(), error());
      syncResolve(deferred, rejectedPromise);
      expect(log).toEqual(['error(not gonna happen)->reject(not gonna happen)']);
    });


    it('should package an exception into a rejected promise', function() {
      var rejectedPromise = q.reject(new Error('not gonna happen'));
      promise.then(success(), error());
      syncResolve(deferred, rejectedPromise);
      expect(log).toEqual(['error(Error: not gonna happen)->reject(Error: not gonna happen)']);
    });


    it('should return a promise that forwards callbacks if the callbacks are missing', function() {
      var rejectedPromise = q.reject('rejected');
      promise.then(success(), error());
      syncResolve(deferred, rejectedPromise.then());
      expect(log).toEqual(['error(rejected)->reject(rejected)']);
    });


    it('should catch exceptions thrown in errback and forward them to derived promises', function() {
      var rejectedPromise = q.reject('rejected');
      rejectedPromise.then(null, error('Broken', 'catch me!', true)).
                      then(null, error('Affected'));
      mockNextTick.flush();
      expect(log).toEqual(['errorBroken(rejected)->throw(catch me!)', 'errorAffected(catch me!)->reject(catch me!)']);
    });


    it('should have functions `finally` and `catch`', function() {
      var rejectedPromise = q.reject('rejected');
      expect(rejectedPromise['finally']).not.toBeUndefined();
      expect(rejectedPromise['catch']).not.toBeUndefined();
    });
  });


  describe('when', function() {
    describe('resolution', function() {
      it('should call the success callback in the next turn when the value is a non-promise',
          function() {
        q.when('hello', success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success(hello)->hello');
      });


      it('should call the success callback in the next turn when the value is a resolved promise',
          function() {
        deferred.resolve('hello');
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success(hello)->hello');
      });


      it('should call the errback in the next turn when the value is a rejected promise', function() {
        deferred.reject('nope');
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error(nope)->reject(nope)');
      });


      it('should call the success callback after the original promise is resolved',
          function() {
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        expect(logStr()).toBe('');
        syncResolve(deferred, 'hello');
        expect(logStr()).toBe('success(hello)->hello');
      });


      it('should call the errback after the original promise is rejected',
          function() {
        q.when(deferred.promise, success(), error());
        expect(logStr()).toBe('');
        expect(logStr()).toBe('');
        syncReject(deferred, 'nope');
        expect(logStr()).toBe('error(nope)->reject(nope)');
      });
    });


    describe('notification', function() {
      it('should call the progressback when the value is a promise and gets notified',
          function() {
        q.when(deferred.promise, success(), error(), progress());
        expect(logStr()).toBe('');
        syncNotify(deferred, 'notification');
        expect(logStr()).toBe('progress(notification)->notification');
      });
    });


    describe('resolve', function() {
      it('should be an alias of the "when" function', function() {
        expect(q.resolve).toBeDefined();
        expect(q.resolve).toEqual(q.when);
      });
    });


    describe('optional callbacks', function() {
      it('should not require success callback and propagate resolution', function() {
        q.when('hi', null, error()).then(success(2), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success2(hi)->hi');
      });


      it('should not require success callback and propagate rejection', function() {
        q.when(q.reject('sorry'), null, error(1)).then(success(), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry)->reject(sorry); error2(sorry)->reject(sorry)');
      });


      it('should not require errback and propagate resolution', function() {
        q.when('hi', success(1, 'hello')).then(success(2), error());
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi)->hello; success2(hello)->hello');
      });


      it('should not require errback and propagate rejection', function() {
        q.when(q.reject('sorry'), success()).then(success(2), error(2));
        expect(logStr()).toBe('');
        mockNextTick.flush();
        expect(logStr()).toBe('error2(sorry)->reject(sorry)');
      });


      it('should not require progressback and propagate notification', function() {
        q.when(deferred.promise).
          then(success(), error(), progress());
        expect(logStr()).toBe('');
        syncNotify(deferred, 'notification');
        expect(logStr()).toBe('progress(notification)->notification');
      });
    });


    describe('returned promise', function() {
      it('should return a promise that can be resolved with a value returned from the success ' +
          'callback', function() {
        q.when('hello', success(1, 'hi'), error()).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hello)->hi; success2(hi)->hi');
      });


      it('should return a promise that can be rejected with a rejected promise returned from the ' +
          'success callback', function() {
        q.when('hello', success(1, q.reject('sorry')), error()).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hello)->{}; error2(sorry)->reject(sorry)');
      });


      it('should return a promise that can be resolved with a value returned from the errback',
          function() {
        q.when(q.reject('sorry'), success(), error(1, 'hi')).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry)->hi; success2(hi)->hi');
      });


      it('should return a promise that can be rejected with a rejected promise returned from the ' +
          'errback', function() {
        q.when(q.reject('sorry'), success(), error(1, q.reject('sigh'))).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry)->{}; error2(sigh)->reject(sigh)');
      });


      it('should return a promise that can be resolved with a promise returned from the success ' +
          'callback', function() {
        var deferred2 = defer();
        q.when('hi', success(1, deferred2.promise), error()).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi)->{}');
        syncResolve(deferred2, 'finally!');
        expect(logStr()).toBe('success1(hi)->{}; success2(finally!)->finally!');
      });


      it('should return a promise that can be resolved with promise returned from the errback ' +
          'callback', function() {
        var deferred2 = defer();
        q.when(q.reject('sorry'), success(), error(1, deferred2.promise)).then(success(2), error());
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry)->{}');
        syncResolve(deferred2, 'finally!');
        expect(logStr()).toBe('error1(sorry)->{}; success2(finally!)->finally!');
      });
    });


    describe('security', function() {
      it('should call success callback only once even if the original promise gets fulfilled ' +
          'multiple times', function() {
        var evilPromise = {
          then: function(success, error, progress) {
            evilPromise.success = success;
            evilPromise.error = error;
            evilPromise.progress = progress;
          }
        };

        q.when(evilPromise, success(), error());
        expect(logStr()).toBe('');
        evilPromise.success('done');
        mockNextTick.flush(); // TODO(i) wrong queue, evil promise would be resolved outside of the
                              //   scope.$apply lifecycle and in that case we should have some kind
                              //   of fallback queue for calling our callbacks from. Otherwise the
                              //   application will get stuck until something triggers next $apply.
        expect(logStr()).toBe('success(done)->done');

        evilPromise.success('evil is me');
        evilPromise.error('burn burn');
        expect(logStr()).toBe('success(done)->done');
      });


      it('should call errback only once even if the original promise gets fulfilled multiple ' +
          'times', function() {
        var evilPromise = {
          then: function(success, error, progress) {
            evilPromise.success = success;
            evilPromise.error = error;
            evilPromise.progress = progress;
          }
        };

        q.when(evilPromise, success(), error());
        expect(logStr()).toBe('');
        evilPromise.error('failed');
        mockNextTick.flush();
        expect(logStr()).toBe('error(failed)->reject(failed)');

        evilPromise.error('muhaha');
        evilPromise.success('take this');
        expect(logStr()).toBe('error(failed)->reject(failed)');
      });


      it('should not call progressback after promise gets fulfilled, even if original promise ' +
          'gets notified multiple times', function() {
        var evilPromise = {
          then: function(success, error, progress) {
            evilPromise.success = success;
            evilPromise.error = error;
            evilPromise.progress = progress;
          }
        };

        q.when(evilPromise, success(), error(), progress());
        expect(logStr()).toBe('');
        evilPromise.progress('notification');
        evilPromise.success('ok');
        mockNextTick.flush();
        expect(logStr()).toBe('progress(notification)->notification; success(ok)->ok');

        evilPromise.progress('muhaha');
        expect(logStr()).toBe('progress(notification)->notification; success(ok)->ok');
      });
    });
  });


  describe('all (array)', function() {
    it('should resolve all or nothing', function() {
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
      expect(logStr()).toBe('success(["hi","hola","cau"])->["hi","hola","cau"]');
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
      expect(logStr()).toBe('error(oops)->reject(oops)');
    });


    it('should not forward notifications from individual promises to the combined promise',
        function() {
      var deferred1 = defer(),
          deferred2 = defer();

      q.all([promise, deferred1.promise, deferred2.promise]).then(success(), error(), progress());
      expect(logStr()).toBe('');
      deferred.notify('x');
      deferred2.notify('y');
      expect(logStr()).toBe('');
      mockNextTick.flush();
      expect(logStr()).toBe('');
    });


    it('should ignore multiple resolutions of an (evil) array promise', function() {
      var evilPromise = {
        then: function(success, error) {
          evilPromise.success = success;
          evilPromise.error = error;
        }
      };

      q.all([promise, evilPromise]).then(success(), error());
      expect(logStr()).toBe('');

      evilPromise.success('first');
      evilPromise.success('muhaha');
      evilPromise.error('arghhh');
      expect(logStr()).toBe('');

      syncResolve(deferred, 'done');
      expect(logStr()).toBe('success(["done","first"])->["done","first"]');
    });
  });

  describe('all (hash)', function() {
    it('should resolve all or nothing', function() {
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
      expect(logStr()).toBe('success({"en":"hi","es":"hola","fr":"salut"})->{"en":"hi","es":"hola","fr":"salut"}');
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
      expect(logStr()).toBe('error(oops)->reject(oops)');
    });


    it('should ignore multiple resolutions of an (evil) hash promise', function() {
      var evilPromise = {
        then: function(success, error) {
          evilPromise.success = success;
          evilPromise.error = error;
        }
      };

      q.all({good: promise, evil: evilPromise}).then(success(), error());
      expect(logStr()).toBe('');

      evilPromise.success('first');
      evilPromise.success('muhaha');
      evilPromise.error('arghhh');
      expect(logStr()).toBe('');

      syncResolve(deferred, 'done');
      expect(logStr()).toBe('success({"evil":"first","good":"done"})->{"evil":"first","good":"done"}');
    });

    it('should handle correctly situation when given the same promise several times', function() {
      q.all({first: promise, second: promise, third: promise}).then(success(), error());
      expect(logStr()).toBe('');

      syncResolve(deferred, 'done');
      expect(logStr()).toBe('success({"first":"done","second":"done","third":"done"})->{"first":"done","second":"done","third":"done"}');
    });
  });

  describe('exception logging', function() {
    var mockExceptionLogger = {
      log: [],
      logger: function(e) {
        mockExceptionLogger.log.push(e);
      }
    };


    beforeEach(function() {
      q = qFactory(mockNextTick.nextTick, mockExceptionLogger.logger),
      defer = q.defer;
      deferred =  defer();
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
        expect(logStr()).toBe('success1(done)->throw(oops); error2(oops)->reject(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when a success callback returns rejected promise', function() {
        promise.then(success(1, q.reject('rejected'))).then(success(2), error(2));
        syncResolve(deferred, 'done');
        expect(logStr()).toBe('success1(done)->{}; error2(rejected)->reject(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });


      it('should log exceptions thrown in a errback and reject the derived promise', function() {
        var error1 = error(1, 'oops', true);
        promise.then(null, error1).then(success(2), error(2));
        syncReject(deferred, 'nope');
        expect(logStr()).toBe('error1(nope)->throw(oops); error2(oops)->reject(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when an errback returns a rejected promise', function() {
        promise.then(null, error(1, q.reject('rejected'))).then(success(2), error(2));
        syncReject(deferred, 'nope');
        expect(logStr()).toBe('error1(nope)->{}; error2(rejected)->reject(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });


      it('should log exceptions throw in a progressack and stop propagation, but shoud NOT reject ' +
        'the promise', function() {
          promise.then(success(), error(), progress(1, 'failed', true)).then(null, error(1), progress(2));
          syncNotify(deferred, '10%');
          expect(logStr()).toBe('progress1(10%)->throw(failed)');
          expect(mockExceptionLogger.log).toEqual(['failed']);
          log = [];
          syncResolve(deferred, 'ok');
          expect(logStr()).toBe('success(ok)->ok');
        }
      );
    });


    describe('in when', function() {
      it('should log exceptions thrown in a success callback and reject the derived promise',
          function() {
        var success1 = success(1, 'oops', true);
        q.when('hi', success1, error()).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi)->throw(oops); error2(oops)->reject(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when a success callback returns rejected promise', function() {
        q.when('hi', success(1, q.reject('rejected'))).then(success(2), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('success1(hi)->{}; error2(rejected)->reject(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });


      it('should log exceptions thrown in a errback and reject the derived promise', function() {
        var error1 = error(1, 'oops', true);
        q.when(q.reject('sorry'), success(), error1).then(success(), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry)->throw(oops); error2(oops)->reject(oops)');
        expect(mockExceptionLogger.log).toEqual(['oops']);
      });


      it('should NOT log exceptions when an errback returns a rejected promise', function() {
        q.when(q.reject('sorry'), success(), error(1, q.reject('rejected'))).
          then(success(2), error(2));
        mockNextTick.flush();
        expect(logStr()).toBe('error1(sorry)->{}; error2(rejected)->reject(rejected)');
        expect(mockExceptionLogger.log).toEqual([]);
      });
    });
  });


  describe('when exceptionHandler rethrows exceptions, ', function() {
    var originalLogExceptions, deferred, errorSpy, exceptionExceptionSpy;

    beforeEach(function() {
      // Turn off exception logging for these particular tests
      originalLogExceptions = mockNextTick.logExceptions;
      mockNextTick.logExceptions = false;

      // Set up spies
      exceptionExceptionSpy = jasmine.createSpy('rethrowExceptionHandler')
      .andCallFake(function rethrowExceptionHandler(e) {
        throw e;
      });
      errorSpy = jasmine.createSpy('errorSpy');


      q = qFactory(mockNextTick.nextTick, exceptionExceptionSpy);
      deferred = q.defer();
    });


    afterEach(function() {
      // Restore the original exception logging mode
      mockNextTick.logExceptions = originalLogExceptions;
    });


    it('should still reject the promise, when exception is thrown in success handler, even if exceptionHandler rethrows', function() {
      deferred.promise.then(function() { throw 'reject'; }).then(null, errorSpy);
      deferred.resolve('resolve');
      mockNextTick.flush();
      expect(exceptionExceptionSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });


    it('should still reject the promise, when exception is thrown in error handler, even if exceptionHandler rethrows', function() {
      deferred.promise.then(null, function() { throw 'reject again'; }).then(null, errorSpy);
      deferred.reject('reject');
      mockNextTick.flush();
      expect(exceptionExceptionSpy).toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalled();
    });
  });
});
