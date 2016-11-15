'use strict';

describe('ngMock', function() {
  var noop = angular.noop;

  describe('TzDate', function() {

    function minutes(min) {
      return min * 60 * 1000;
    }

    it('should look like a Date', function() {
      var date = new angular.mock.TzDate(0,0);
      expect(angular.isDate(date)).toBe(true);
    });

    it('should take millis as constructor argument', function() {
      expect(new angular.mock.TzDate(0, 0).getTime()).toBe(0);
      expect(new angular.mock.TzDate(0, 1283555108000).getTime()).toBe(1283555108000);
    });

    it('should take dateString as constructor argument', function() {
      expect(new angular.mock.TzDate(0, '1970-01-01T00:00:00.000Z').getTime()).toBe(0);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.023Z').getTime()).toBe(1283555108023);
    });


    it('should fake getLocalDateString method', function() {
      var millennium = new Date('2000').getTime();

      // millennium in -3h
      var t0 = new angular.mock.TzDate(-3, millennium);
      expect(t0.toLocaleDateString()).toMatch('2000');

      // millennium in +0h
      var t1 = new angular.mock.TzDate(0, millennium);
      expect(t1.toLocaleDateString()).toMatch('2000');

      // millennium in +3h
      var t2 = new angular.mock.TzDate(3, millennium);
      expect(t2.toLocaleDateString()).toMatch('1999');
    });


    it('should fake toISOString method', function() {
      var date = new angular.mock.TzDate(-1, '2009-10-09T01:02:03.027Z');

      if (new Date().toISOString) {
        expect(date.toISOString()).toEqual('2009-10-09T01:02:03.027Z');
      } else {
        expect(date.toISOString).toBeUndefined();
      }
    });


    it('should fake getHours method', function() {
      // avoid going negative due to #5017, so use Jan 2, 1970 00:00 UTC
      var jan2 = 24 * 60 * 60 * 1000;

      //0:00 in -3h
      var t0 = new angular.mock.TzDate(-3, jan2);
      expect(t0.getHours()).toBe(3);

      //0:00 in +0h
      var t1 = new angular.mock.TzDate(0, jan2);
      expect(t1.getHours()).toBe(0);

      //0:00 in +3h
      var t2 = new angular.mock.TzDate(3, jan2);
      expect(t2.getHours()).toMatch('21');
    });


    it('should fake getMinutes method', function() {
      //0:15 in -3h
      var t0 = new angular.mock.TzDate(-3, minutes(15));
      expect(t0.getMinutes()).toBe(15);

      //0:15 in -3.25h
      var t0a = new angular.mock.TzDate(-3.25, minutes(15));
      expect(t0a.getMinutes()).toBe(30);

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, minutes(0));
      expect(t1.getMinutes()).toBe(0);

      //0:15 in +0h
      var t1a = new angular.mock.TzDate(0, minutes(15));
      expect(t1a.getMinutes()).toBe(15);

      //0:15 in +3h
      var t2 = new angular.mock.TzDate(3, minutes(15));
      expect(t2.getMinutes()).toMatch('15');

      //0:15 in +3.25h
      var t2a = new angular.mock.TzDate(3.25, minutes(15));
      expect(t2a.getMinutes()).toMatch('0');
    });


    it('should fake getSeconds method', function() {
      //0 in -3h
      var t0 = new angular.mock.TzDate(-3, 0);
      expect(t0.getSeconds()).toBe(0);

      //0 in +0h
      var t1 = new angular.mock.TzDate(0, 0);
      expect(t1.getSeconds()).toBe(0);

      //0 in +3h
      var t2 = new angular.mock.TzDate(3, 0);
      expect(t2.getSeconds()).toMatch('0');
    });


    it('should fake getMilliseconds method', function() {
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.003Z').getMilliseconds()).toBe(3);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.023Z').getMilliseconds()).toBe(23);
      expect(new angular.mock.TzDate(0, '2010-09-03T23:05:08.123Z').getMilliseconds()).toBe(123);
    });


    it('should create a date representing new year in Bratislava', function() {
      var newYearInBratislava = new angular.mock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(newYearInBratislava.getTimezoneOffset()).toBe(-60);
      expect(newYearInBratislava.getFullYear()).toBe(2010);
      expect(newYearInBratislava.getMonth()).toBe(0);
      expect(newYearInBratislava.getDate()).toBe(1);
      expect(newYearInBratislava.getHours()).toBe(0);
      expect(newYearInBratislava.getMinutes()).toBe(0);
      expect(newYearInBratislava.getSeconds()).toBe(0);
    });


    it('should delegate all the UTC methods to the original UTC Date object', function() {
      //from when created from string
      var date1 = new angular.mock.TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(date1.getUTCFullYear()).toBe(2009);
      expect(date1.getUTCMonth()).toBe(11);
      expect(date1.getUTCDate()).toBe(31);
      expect(date1.getUTCHours()).toBe(23);
      expect(date1.getUTCMinutes()).toBe(0);
      expect(date1.getUTCSeconds()).toBe(0);


      //from when created from millis
      var date2 = new angular.mock.TzDate(-1, date1.getTime());
      expect(date2.getUTCFullYear()).toBe(2009);
      expect(date2.getUTCMonth()).toBe(11);
      expect(date2.getUTCDate()).toBe(31);
      expect(date2.getUTCHours()).toBe(23);
      expect(date2.getUTCMinutes()).toBe(0);
      expect(date2.getUTCSeconds()).toBe(0);
    });


    it('should throw error when no third param but toString called', function() {
      expect(function() { new angular.mock.TzDate(0,0).toString(); }).
                           toThrowError('Method \'toString\' is not implemented in the TzDate mock');
    });
  });


  describe('$log', function() {
    angular.forEach([true, false], function(debugEnabled) {
      describe('debug ' + debugEnabled, function() {
        beforeEach(module(function($logProvider) {
          $logProvider.debugEnabled(debugEnabled);
        }));

        afterEach(inject(function($log) {
          $log.reset();
        }));

        it('should skip debugging output if disabled (' + debugEnabled + ')', inject(function($log) {
            $log.log('fake log');
            $log.info('fake log');
            $log.warn('fake log');
            $log.error('fake log');
            $log.debug('fake log');
            expect($log.log.logs).toContain(['fake log']);
            expect($log.info.logs).toContain(['fake log']);
            expect($log.warn.logs).toContain(['fake log']);
            expect($log.error.logs).toContain(['fake log']);
            if (debugEnabled) {
              expect($log.debug.logs).toContain(['fake log']);
            } else {
              expect($log.debug.logs).toEqual([]);
            }
          }));
      });
    });

    describe('debug enabled (default)', function() {
      var $log;
      beforeEach(inject(['$log', function(log) {
        $log = log;
      }]));

      afterEach(inject(function($log) {
        $log.reset();
      }));

      it('should provide the log method', function() {
        expect(function() { $log.log(''); }).not.toThrow();
      });

      it('should provide the info method', function() {
        expect(function() { $log.info(''); }).not.toThrow();
      });

      it('should provide the warn method', function() {
        expect(function() { $log.warn(''); }).not.toThrow();
      });

      it('should provide the error method', function() {
        expect(function() { $log.error(''); }).not.toThrow();
      });

      it('should provide the debug method', function() {
        expect(function() { $log.debug(''); }).not.toThrow();
      });

      it('should store log messages', function() {
        $log.log('fake log');
        expect($log.log.logs).toContain(['fake log']);
      });

      it('should store info messages', function() {
        $log.info('fake log');
        expect($log.info.logs).toContain(['fake log']);
      });

      it('should store warn messages', function() {
        $log.warn('fake log');
        expect($log.warn.logs).toContain(['fake log']);
      });

      it('should store error messages', function() {
        $log.error('fake log');
        expect($log.error.logs).toContain(['fake log']);
      });

      it('should store debug messages', function() {
        $log.debug('fake log');
        expect($log.debug.logs).toContain(['fake log']);
      });

      it('should assertEmpty', function() {
        try {
          $log.error(new Error('MyError'));
          $log.warn(new Error('MyWarn'));
          $log.info(new Error('MyInfo'));
          $log.log(new Error('MyLog'));
          $log.debug(new Error('MyDebug'));
          $log.assertEmpty();
        } catch (error) {
          var err = error.message || error;
          expect(err).toMatch(/Error: MyError/m);
          expect(err).toMatch(/Error: MyWarn/m);
          expect(err).toMatch(/Error: MyInfo/m);
          expect(err).toMatch(/Error: MyLog/m);
          expect(err).toMatch(/Error: MyDebug/m);
        } finally {
          $log.reset();
        }
      });

      it('should reset state', function() {
        $log.error(new Error('MyError'));
        $log.warn(new Error('MyWarn'));
        $log.info(new Error('MyInfo'));
        $log.log(new Error('MyLog'));
        $log.reset();
        var passed = false;
        try {
          $log.assertEmpty(); // should not throw error!
          passed = true;
        } catch (e) {
          passed = e;
        }
        expect(passed).toBe(true);
      });
    });
  });


  describe('$interval', function() {
    it('should run tasks repeatedly', inject(function($interval) {
      var counter = 0;
      $interval(function() { counter++; }, 1000);

      expect(counter).toBe(0);

      $interval.flush(1000);
      expect(counter).toBe(1);

      $interval.flush(1000);
      expect(counter).toBe(2);

      $interval.flush(2000);
      expect(counter).toBe(4);
    }));


    it('should call $apply after each task is executed', inject(function($interval, $rootScope) {
      var applySpy = spyOn($rootScope, '$apply').and.callThrough();

      $interval(noop, 1000);
      expect(applySpy).not.toHaveBeenCalled();

      $interval.flush(1000);
      expect(applySpy).toHaveBeenCalledOnce();

      applySpy.calls.reset();

      $interval(noop, 1000);
      $interval(noop, 1000);
      $interval.flush(1000);
      expect(applySpy).toHaveBeenCalledTimes(3);
    }));


    it('should NOT call $apply if invokeApply is set to false',
        inject(function($interval, $rootScope) {
      var applySpy = spyOn($rootScope, '$apply').and.callThrough();

      var counter = 0;
      $interval(function increment() { counter++; }, 1000, 0, false);

      expect(applySpy).not.toHaveBeenCalled();
      expect(counter).toBe(0);

      $interval.flush(2000);
      expect(applySpy).not.toHaveBeenCalled();
      expect(counter).toBe(2);
    }));


    it('should allow you to specify the delay time', inject(function($interval) {
      var counter = 0;
      $interval(function() { counter++; }, 123);

      expect(counter).toBe(0);

      $interval.flush(122);
      expect(counter).toBe(0);

      $interval.flush(1);
      expect(counter).toBe(1);
    }));


    it('should allow you to specify a number of iterations', inject(function($interval) {
      var counter = 0;
      $interval(function() {counter++;}, 1000, 2);

      $interval.flush(1000);
      expect(counter).toBe(1);
      $interval.flush(1000);
      expect(counter).toBe(2);
      $interval.flush(1000);
      expect(counter).toBe(2);
    }));


    describe('flush', function() {
      it('should move the clock forward by the specified time', inject(function($interval) {
        var counterA = 0;
        var counterB = 0;
        $interval(function() { counterA++; }, 100);
        $interval(function() { counterB++; }, 401);

        $interval.flush(200);
        expect(counterA).toEqual(2);

        $interval.flush(201);
        expect(counterA).toEqual(4);
        expect(counterB).toEqual(1);
      }));
    });


    it('should return a promise which will be updated with the count on each iteration',
        inject(function($interval) {
      var log = [],
          promise = $interval(function() { log.push('tick'); }, 1000);

      promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
      expect(log).toEqual([]);

      $interval.flush(1000);
      expect(log).toEqual(['tick', 'promise update: 0']);

      $interval.flush(1000);
      expect(log).toEqual(['tick', 'promise update: 0', 'tick', 'promise update: 1']);
    }));


    it('should return a promise which will be resolved after the specified number of iterations',
        inject(function($interval) {
      var log = [],
          promise = $interval(function() { log.push('tick'); }, 1000, 2);

      promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
      expect(log).toEqual([]);

      $interval.flush(1000);
      expect(log).toEqual(['tick', 'promise update: 0']);
      $interval.flush(1000);

      expect(log).toEqual([
        'tick', 'promise update: 0', 'tick', 'promise update: 1', 'promise success: 2'
      ]);

    }));


    describe('exception handling', function() {
      beforeEach(module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      }));


      it('should delegate exception to the $exceptionHandler service', inject(
          function($interval, $exceptionHandler) {
        $interval(function() { throw 'Test Error'; }, 1000);
        expect($exceptionHandler.errors).toEqual([]);

        $interval.flush(1000);
        expect($exceptionHandler.errors).toEqual(['Test Error']);

        $interval.flush(1000);
        expect($exceptionHandler.errors).toEqual(['Test Error', 'Test Error']);
      }));


      it('should call $apply even if an exception is thrown in callback', inject(
          function($interval, $rootScope) {
        var applySpy = spyOn($rootScope, '$apply').and.callThrough();

        $interval(function() { throw new Error('Test Error'); }, 1000);
        expect(applySpy).not.toHaveBeenCalled();

        $interval.flush(1000);
        expect(applySpy).toHaveBeenCalled();
      }));


      it('should still update the interval promise when an exception is thrown',
          inject(function($interval) {
        var log = [],
            promise = $interval(function() { throw new Error('Some Error'); }, 1000);

        promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
        $interval.flush(1000);

        expect(log).toEqual(['promise update: 0']);
      }));
    });


    describe('cancel', function() {
      it('should cancel tasks', inject(function($interval) {
        var task1 = jasmine.createSpy('task1', 1000),
            task2 = jasmine.createSpy('task2', 1000),
            task3 = jasmine.createSpy('task3', 1000),
            promise1, promise3;

        promise1 = $interval(task1, 200);
        $interval(task2, 1000);
        promise3 = $interval(task3, 333);

        $interval.cancel(promise3);
        $interval.cancel(promise1);
        $interval.flush(1000);

        expect(task1).not.toHaveBeenCalled();
        expect(task2).toHaveBeenCalledOnce();
        expect(task3).not.toHaveBeenCalled();
      }));


      it('should cancel the promise', inject(function($interval, $rootScope) {
        var promise = $interval(noop, 1000),
            log = [];
        promise.then(function(value) { log.push('promise success: ' + value); },
                   function(err) { log.push('promise error: ' + err); },
                   function(note) { log.push('promise update: ' + note); });
        expect(log).toEqual([]);

        $interval.flush(1000);
        $interval.cancel(promise);
        $interval.flush(1000);
        $rootScope.$apply(); // For resolving the promise -
                             // necessary since q uses $rootScope.evalAsync.

        expect(log).toEqual(['promise update: 0', 'promise error: canceled']);
      }));


      it('should return true if a task was successfully canceled', inject(function($interval) {
        var task1 = jasmine.createSpy('task1'),
            task2 = jasmine.createSpy('task2'),
            promise1, promise2;

        promise1 = $interval(task1, 1000, 1);
        $interval.flush(1000);
        promise2 = $interval(task2, 1000, 1);

        expect($interval.cancel(promise1)).toBe(false);
        expect($interval.cancel(promise2)).toBe(true);
      }));


      it('should not throw a runtime exception when given an undefined promise',
          inject(function($interval) {
        var task1 = jasmine.createSpy('task1'),
            promise1;

        promise1 = $interval(task1, 1000, 1);

        expect($interval.cancel()).toBe(false);
      }));
    });
  });


  describe('defer', function() {
    var browser, log;
    beforeEach(inject(function($browser) {
      browser = $browser;
      log = '';
    }));

    function logFn(text) {
      return function() {
        log += text + ';';
      };
    }

    it('should flush', function() {
      browser.defer(logFn('A'));
      expect(log).toEqual('');
      browser.defer.flush();
      expect(log).toEqual('A;');
    });

    it('should flush delayed', function() {
      browser.defer(logFn('A'));
      browser.defer(logFn('B'), 10);
      browser.defer(logFn('C'), 20);
      expect(log).toEqual('');

      expect(browser.defer.now).toEqual(0);
      browser.defer.flush(0);
      expect(log).toEqual('A;');

      browser.defer.flush();
      expect(log).toEqual('A;B;C;');
    });

    it('should defer and flush over time', function() {
      browser.defer(logFn('A'), 1);
      browser.defer(logFn('B'), 2);
      browser.defer(logFn('C'), 3);

      browser.defer.flush(0);
      expect(browser.defer.now).toEqual(0);
      expect(log).toEqual('');

      browser.defer.flush(1);
      expect(browser.defer.now).toEqual(1);
      expect(log).toEqual('A;');

      browser.defer.flush(2);
      expect(browser.defer.now).toEqual(3);
      expect(log).toEqual('A;B;C;');
    });

    it('should throw an exception if there is nothing to be flushed', function() {
      expect(function() {browser.defer.flush();}).toThrowError('No deferred tasks to be flushed');
    });
  });


  describe('$exceptionHandler', function() {
    it('should rethrow exceptions', inject(function($exceptionHandler) {
      expect(function() { $exceptionHandler('myException'); }).toThrow('myException');
    }));


    it('should log exceptions', function() {
      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('log');
      });
      inject(function($exceptionHandler) {
        $exceptionHandler('MyError');
        expect($exceptionHandler.errors).toEqual(['MyError']);

        $exceptionHandler('MyError', 'comment');
        expect($exceptionHandler.errors[1]).toEqual(['MyError', 'comment']);
      });
    });

    it('should log and rethrow exceptions', function() {
      module(function($exceptionHandlerProvider) {
        $exceptionHandlerProvider.mode('rethrow');
      });
      inject(function($exceptionHandler) {
        expect(function() { $exceptionHandler('MyError'); }).toThrow('MyError');
        expect($exceptionHandler.errors).toEqual(['MyError']);

        expect(function() { $exceptionHandler('MyError', 'comment'); }).toThrow('MyError');
        expect($exceptionHandler.errors[1]).toEqual(['MyError', 'comment']);
      });
    });

    it('should throw on wrong argument', function() {
      module(function($exceptionHandlerProvider) {
        expect(function() {
          $exceptionHandlerProvider.mode('XXX');
        }).toThrowError('Unknown mode \'XXX\', only \'log\'/\'rethrow\' modes are allowed!');
      });

      inject(); // Trigger the tests in `module`
    });
  });


  describe('$timeout', function() {
    it('should expose flush method that will flush the pending queue of tasks', inject(
        function($timeout) {
      var logger = [],
          logFn = function(msg) { return function() { logger.push(msg); }; };

      $timeout(logFn('t1'));
      $timeout(logFn('t2'), 200);
      $timeout(logFn('t3'));
      expect(logger).toEqual([]);

      $timeout.flush();
      expect(logger).toEqual(['t1', 't3', 't2']);
    }));


    it('should throw an exception when not flushed', inject(function($timeout) {
      $timeout(noop);

      var expectedError = 'Deferred tasks to flush (1): {id: 0, time: 0}';
      expect(function() {$timeout.verifyNoPendingTasks();}).toThrowError(expectedError);
    }));


    it('should do nothing when all tasks have been flushed', inject(function($timeout) {
      $timeout(noop);

      $timeout.flush();
      expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();
    }));


    it('should check against the delay if provided within timeout', inject(function($timeout) {
      $timeout(noop, 100);
      $timeout.flush(100);
      expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();

      $timeout(noop, 1000);
      $timeout.flush(100);
      expect(function() {$timeout.verifyNoPendingTasks();}).toThrow();

      $timeout.flush(900);
      expect(function() {$timeout.verifyNoPendingTasks();}).not.toThrow();
    }));


    it('should assert against the delay value', inject(function($timeout) {
      var count = 0;
      var iterate = function() {
        count++;
      };

      $timeout(iterate, 100);
      $timeout(iterate, 123);
      $timeout.flush(100);
      expect(count).toBe(1);
      $timeout.flush(123);
      expect(count).toBe(2);
    }));

    it('should resolve timeout functions following the timeline', inject(function($timeout) {
      var count1 = 0, count2 = 0;
      var iterate1 = function() {
        count1++;
        $timeout(iterate1, 100);
      };
      var iterate2 = function() {
        count2++;
        $timeout(iterate2, 150);
      };

      $timeout(iterate1, 100);
      $timeout(iterate2, 150);
      $timeout.flush(150);
      expect(count1).toBe(1);
      expect(count2).toBe(1);
      $timeout.flush(50);
      expect(count1).toBe(2);
      expect(count2).toBe(1);
      $timeout.flush(400);
      expect(count1).toBe(6);
      expect(count2).toBe(4);
    }));
  });


  describe('angular.mock.dump', function() {
    var d = angular.mock.dump;


    it('should serialize primitive types', function() {
      expect(d(undefined)).toEqual('undefined');
      expect(d(1)).toEqual('1');
      expect(d(null)).toEqual('null');
      expect(d('abc')).toEqual('abc');
    });


    it('should serialize element', function() {
      var e = angular.element('<div>abc</div><span>xyz</span>');
      expect(d(e).toLowerCase()).toEqual('<div>abc</div><span>xyz</span>');
      expect(d(e[0]).toLowerCase()).toEqual('<div>abc</div>');
    });

    it('should serialize scope', inject(function($rootScope) {
      $rootScope.obj = {abc:'123'};
      expect(d($rootScope)).toMatch(/Scope\(.*\): \{/);
      expect(d($rootScope)).toMatch(/{"abc":"123"}/);
    }));

    it('should serialize scope that has overridden "hasOwnProperty"', inject(function($rootScope, $sniffer) {
      $rootScope.hasOwnProperty = 'X';
      expect(d($rootScope)).toMatch(/Scope\(.*\): \{/);
      expect(d($rootScope)).toMatch(/hasOwnProperty: "X"/);
    }));
  });


  describe('jasmine module and inject', function() {
    var log;

    beforeEach(function() {
      log = '';
    });

    describe('module', function() {

      describe('object literal format', function() {
        var mock = { log: 'module' };

        beforeEach(function() {
          module({
              'service': mock,
              'other': { some: 'replacement'}
            },
            'ngResource',
            function($provide) { $provide.value('example', 'win'); }
          );
        });

        it('should inject the mocked module', function() {
          inject(function(service) {
            expect(service).toEqual(mock);
          });
        });

        it('should support multiple key value pairs', function() {
          inject(function(service, other) {
            expect(other.some).toEqual('replacement');
            expect(service).toEqual(mock);
          });
        });

        it('should integrate with string and function', function() {
          inject(function(service, $resource, example) {
            expect(service).toEqual(mock);
            expect($resource).toBeDefined();
            expect(example).toEqual('win');
          });
        });

        describe('module cleanup', function() {
          function testFn() {

          }

          it('should add hashKey to module function', function() {
            module(testFn);
            inject(function() {
              expect(testFn.$$hashKey).toBeDefined();
            });
          });

          it('should cleanup hashKey after previous test', function() {
            expect(testFn.$$hashKey).toBeUndefined();
          });
        });

        describe('$inject cleanup', function() {
          function testFn() {

          }

          it('should add $inject when invoking test function', inject(function($injector) {
            $injector.invoke(testFn);
            expect(testFn.$inject).toBeDefined();
          }));

          it('should cleanup $inject after previous test', function() {
            expect(testFn.$inject).toBeUndefined();
          });

          it('should add $inject when annotating test function', inject(function($injector) {
            $injector.annotate(testFn);
            expect(testFn.$inject).toBeDefined();
          }));

          it('should cleanup $inject after previous test', function() {
            expect(testFn.$inject).toBeUndefined();
          });

          it('should invoke an already annotated function', inject(function($injector) {
            testFn.$inject = [];
            $injector.invoke(testFn);
          }));

          it('should not cleanup $inject after previous test', function() {
            expect(testFn.$inject).toBeDefined();
          });
        });
      });

      describe('in DSL', function() {
        it('should load module', module(function() {
          log += 'module';
        }));

        afterEach(function() {
          inject();
          expect(log).toEqual('module');
        });
      });

      describe('nested calls', function() {
        it('should invoke nested module calls immediately', function() {
          module(function($provide) {
            $provide.constant('someConst', 'blah');
            module(function(someConst) {
              log = someConst;
            });
          });
          inject(function() {
            expect(log).toBe('blah');
          });
        });
      });

      describe('inline in test', function() {
        it('should load module', function() {
          module(function() {
            log += 'module';
          });
          inject();
        });

        afterEach(function() {
          expect(log).toEqual('module');
        });
      });
    });

    describe('inject', function() {
      describe('in DSL', function() {
        it('should load module', inject(function() {
          log += 'inject';
        }));

        afterEach(function() {
          expect(log).toEqual('inject');
        });
      });


      describe('inline in test', function() {
        it('should load module', function() {
          inject(function() {
            log += 'inject';
          });
        });

        afterEach(function() {
          expect(log).toEqual('inject');
        });
      });

      describe('module with inject', function() {
        beforeEach(module(function() {
          log += 'module;';
        }));

        it('should inject', inject(function() {
          log += 'inject;';
        }));

        afterEach(function() {
          expect(log).toEqual('module;inject;');
        });
      });

      it('should not change thrown Errors', inject(function($sniffer) {
        expect(function() {
          inject(function() {
            throw new Error('test message');
          });
        }).toThrow(jasmine.objectContaining({message: 'test message'}));
      }));

      it('should not change thrown strings', inject(function($sniffer) {
        expect(function() {
          inject(function() {
            throw 'test message';
          });
        }).toThrow('test message');
      }));

      describe('error stack trace when called outside of spec context', function() {
        // - Chrome, Firefox, Edge, Opera give us the stack trace as soon as an Error is created
        // - IE10+, PhantomJS give us the stack trace only once the error is thrown
        // - IE9 does not provide stack traces
        var stackTraceSupported = (function() {
          var error = new Error();
          if (!error.stack) {
            try {
              throw error;
            } catch (e) { /* empty */}
          }

          return !!error.stack;
        })();

        function testCaller() {
          return inject(function() {
            throw new Error();
          });
        }
        var throwErrorFromInjectCallback = testCaller();

        if (stackTraceSupported) {
          describe('on browsers supporting stack traces', function() {
            it('should update thrown Error stack trace with inject call location', function() {
              try {
                throwErrorFromInjectCallback();
              } catch (e) {
                expect(e.stack).toMatch('testCaller');
              }
            });
          });
        } else {
          describe('on browsers not supporting stack traces', function() {
            it('should not add stack trace information to thrown Error', function() {
              try {
                throwErrorFromInjectCallback();
              } catch (e) {
                expect(e.stack).toBeUndefined();
              }
            });
          });
        }
      });

      describe('ErrorAddingDeclarationLocationStack', function() {
        it('should be caught by Jasmine\'s `toThrowError()`', function() {
          function throwErrorAddingDeclarationStack() {
            module(function($provide) {
              $provide.factory('badFactory', function() {
                throw new Error('BadFactoryError');
              });
            });

            inject(function(badFactory) {});
          }

          expect(throwErrorAddingDeclarationStack).toThrowError(/BadFactoryError/);
        });
      });
    });
  });


  describe('$httpBackend', function() {
    var hb, callback, realBackendSpy;

    beforeEach(inject(function($httpBackend) {
      callback = jasmine.createSpy('callback');
      hb = $httpBackend;
    }));


    it('should provide "expect" methods for each HTTP verb', function() {
      expect(typeof hb.expectGET).toBe('function');
      expect(typeof hb.expectPOST).toBe('function');
      expect(typeof hb.expectPUT).toBe('function');
      expect(typeof hb.expectPATCH).toBe('function');
      expect(typeof hb.expectDELETE).toBe('function');
      expect(typeof hb.expectHEAD).toBe('function');
    });


    it('should provide "when" methods for each HTTP verb', function() {
      expect(typeof hb.whenGET).toBe('function');
      expect(typeof hb.whenPOST).toBe('function');
      expect(typeof hb.whenPUT).toBe('function');
      expect(typeof hb.whenPATCH).toBe('function');
      expect(typeof hb.whenDELETE).toBe('function');
      expect(typeof hb.whenHEAD).toBe('function');
    });


    it('should provide "route" shortcuts for expect and when', function() {
      expect(typeof hb.whenRoute).toBe('function');
      expect(typeof hb.expectRoute).toBe('function');
    });


    it('should respond with first matched definition', function() {
      hb.when('GET', '/url1').respond(200, 'content', {});
      hb.when('GET', '/url1').respond(201, 'another', {});

      callback.and.callFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('content');
      });

      hb('GET', '/url1', null, callback);
      expect(callback).not.toHaveBeenCalled();
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should respond with a copy of the mock data', function() {
      var mockObject = {a: 'b'};

      hb.when('GET', '/url1').respond(200, mockObject, {});

      callback.and.callFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toEqual({a: 'b'});
        expect(response).not.toBe(mockObject);
        response.a = 'c';
      });

      hb('GET', '/url1', null, callback);
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();

      // Fire it again and verify that the returned mock data has not been
      // modified.
      callback.calls.reset();
      hb('GET', '/url1', null, callback);
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();
      expect(mockObject).toEqual({a: 'b'});
    });


    it('should be able to handle Blobs as mock data', function() {
      if (typeof Blob !== 'undefined') {
        // eslint-disable-next-line no-undef
        var mockBlob = new Blob(['{"foo":"bar"}'], {type: 'application/json'});

        hb.when('GET', '/url1').respond(200, mockBlob, {});

        callback.and.callFake(function(status, response) {
          expect(response).not.toBe(mockBlob);
          expect(response.size).toBe(13);
          expect(response.type).toBe('application/json');
          expect(response.toString()).toBe('[object Blob]');
        });

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnce();
      }
    });


    it('should throw error when unexpected request', function() {
      hb.when('GET', '/url1').respond(200, 'content');
      expect(function() {
        hb('GET', '/xxx');
      }).toThrowError('Unexpected request: GET /xxx\nNo more request expected');
    });


    it('should match headers if specified', function() {
      hb.when('GET', '/url', null, {'X': 'val1'}).respond(201, 'content1');
      hb.when('GET', '/url', null, {'X': 'val2'}).respond(202, 'content2');
      hb.when('GET', '/url').respond(203, 'content3');

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(203);
        expect(response).toBe('content3');
      });

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      }, {'X': 'val1'});

      hb('GET', '/url', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      }, {'X': 'val2'});

      hb.flush();
    });


    it('should match data if specified', function() {
      hb.when('GET', '/a/b', '{a: true}').respond(201, 'content1');
      hb.when('GET', '/a/b').respond(202, 'content2');

      hb('GET', '/a/b', '{a: true}', function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      hb('GET', '/a/b', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      });

      hb.flush();
    });


    it('should match data object if specified', function() {
      hb.when('GET', '/a/b', {a: 1, b: 2}).respond(201, 'content1');
      hb.when('GET', '/a/b').respond(202, 'content2');

      hb('GET', '/a/b', '{"a":1,"b":2}', function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      hb('GET', '/a/b', '{"b":2,"a":1}', function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      hb('GET', '/a/b', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      });

      hb.flush();
    });


    it('should match only method', function() {
      hb.when('GET').respond(202, 'c');
      callback.and.callFake(function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('c');
      });

      hb('GET', '/some', null, callback, {});
      hb('GET', '/another', null, callback, {'X-Fake': 'Header'});
      hb('GET', '/third', 'some-data', callback, {});
      hb.flush();

      expect(callback).toHaveBeenCalled();
    });


    it('should not error if the url is not provided', function() {
      expect(function() {
        hb.when('GET');

        hb.whenGET();
        hb.whenPOST();
        hb.whenPUT();
        hb.whenPATCH();
        hb.whenDELETE();
        hb.whenHEAD();

        hb.expect('GET');

        hb.expectGET();
        hb.expectPOST();
        hb.expectPUT();
        hb.expectPATCH();
        hb.expectDELETE();
        hb.expectHEAD();
      }).not.toThrow();
    });


    it('should error if the url is undefined', function() {
      expect(function() {
        hb.when('GET', undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.whenGET(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.whenDELETE(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.whenJSONP(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.whenHEAD(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.whenPATCH(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.whenPOST(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.whenPUT(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');


      expect(function() {
        hb.expect('GET', undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.expectGET(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.expectDELETE(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.expectJSONP(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.expectHEAD(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.expectPATCH(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.expectPOST(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');

      expect(function() {
        hb.expectPUT(undefined);
      }).toThrowError('Undefined argument `url`; the argument is provided but not defined');
    });


    it('should preserve the order of requests', function() {
      hb.when('GET', '/url1').respond(200, 'first');
      hb.when('GET', '/url2').respond(201, 'second');

      hb('GET', '/url2', null, callback);
      hb('GET', '/url1', null, callback);

      hb.flush();

      expect(callback).toHaveBeenCalledTimes(2);
      expect(callback.calls.argsFor(0)).toEqual([201, 'second', '', '']);
      expect(callback.calls.argsFor(1)).toEqual([200, 'first', '', '']);
    });


    describe('respond()', function() {
      it('should take values', function() {
        hb.expect('GET', '/url1').respond(200, 'first', {'header': 'val'}, 'OK');
        hb('GET', '/url1', undefined, callback);
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(200, 'first', 'header: val', 'OK');
      });

      it('should default status code to 200', function() {
        callback.and.callFake(function(status, response) {
          expect(status).toBe(200);
          expect(response).toBe('some-data');
        });

        hb.expect('GET', '/url1').respond('some-data');
        hb.expect('GET', '/url2').respond('some-data', {'X-Header': 'true'});
        hb('GET', '/url1', null, callback);
        hb('GET', '/url2', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(2);
      });

      it('should default status code to 200 and provide status text', function() {
        hb.expect('GET', '/url1').respond('first', {'header': 'val'}, 'OK');
        hb('GET', '/url1', null, callback);
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(200, 'first', 'header: val', 'OK');
      });

      it('should take function', function() {
        hb.expect('GET', '/some?q=s').respond(function(m, u, d, h, p) {
          return [301, m + u + ';' + d + ';a=' + h.a + ';q=' + p.q, {'Connection': 'keep-alive'}, 'Moved Permanently'];
        });

        hb('GET', '/some?q=s', 'data', callback, {a: 'b'});
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(301, 'GET/some?q=s;data;a=b;q=s', 'Connection: keep-alive', 'Moved Permanently');
      });

      it('should decode query parameters in respond() function', function() {
        hb.expect('GET', '/url?query=l%E2%80%A2ng%20string%20w%2F%20spec%5Eal%20char%24&id=1234&orderBy=-name')
        .respond(function(m, u, d, h, p) {
          return [200, 'id=' + p.id + ';orderBy=' + p.orderBy + ';query=' + p.query];
        });

        hb('GET', '/url?query=l%E2%80%A2ng%20string%20w%2F%20spec%5Eal%20char%24&id=1234&orderBy=-name', null, callback);
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(200, 'id=1234;orderBy=-name;query=l•ng string w/ spec^al char$', '', '');
      });

      it('should include regex captures in respond() params when keys provided', function() {
        hb.expect('GET', /\/(.+)\/article\/(.+)/, undefined, undefined, ['id', 'name'])
        .respond(function(m, u, d, h, p) {
          return [200, 'id=' + p.id + ';name=' + p.name];
        });

        hb('GET', '/1234/article/cool-angular-article', null, callback);
        hb.flush();

        expect(callback).toHaveBeenCalledOnceWith(200, 'id=1234;name=cool-angular-article', '', '');
      });

      it('should default response headers to ""', function() {
        hb.expect('GET', '/url1').respond(200, 'first');
        hb.expect('GET', '/url2').respond('second');

        hb('GET', '/url1', null, callback);
        hb('GET', '/url2', null, callback);

        hb.flush();

        expect(callback).toHaveBeenCalledTimes(2);
        expect(callback.calls.argsFor(0)).toEqual([200, 'first', '', '']);
        expect(callback.calls.argsFor(1)).toEqual([200, 'second', '', '']);
      });

      it('should be able to override response of expect definition', function() {
        var definition = hb.expect('GET', '/url1');
        definition.respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });

      it('should be able to override response of when definition', function() {
        var definition = hb.when('GET', '/url1');
        definition.respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });

      it('should be able to override response of expect definition with chaining', function() {
        var definition = hb.expect('GET', '/url1').respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });

      it('should be able to override response of when definition with chaining', function() {
        var definition = hb.when('GET', '/url1').respond('first');
        definition.respond('second');

        hb('GET', '/url1', null, callback);
        hb.flush();
        expect(callback).toHaveBeenCalledOnceWith(200, 'second', '', '');
      });
    });


    describe('expect()', function() {
      it('should require specified order', function() {
        hb.expect('GET', '/url1').respond(200, '');
        hb.expect('GET', '/url2').respond(200, '');

        expect(function() {
          hb('GET', '/url2', null, noop, {});
        }).toThrowError('Unexpected request: GET /url2\nExpected GET /url1');
      });


      it('should have precedence over when()', function() {
        callback.and.callFake(function(status, response) {
          expect(status).toBe(300);
          expect(response).toBe('expect');
        });

        hb.when('GET', '/url').respond(200, 'when');
        hb.expect('GET', '/url').respond(300, 'expect');

        hb('GET', '/url', null, callback, {});
        hb.flush();
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should throw exception when only headers differs from expectation', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', undefined, {'Content-Type': 'application/json'});

        expect(function() {
          hb('GET', '/match', null, noop, {});
        }).toThrowError('Expected GET /match with different headers\n' +
                        'EXPECTED: {"Content-Type":"application/json"}\nGOT:      {}');
      });


      it('should throw exception when only data differs from expectation', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', 'some-data');

        expect(function() {
          hb('GET', '/match', 'different', noop, {});
        }).toThrowError('Expected GET /match with different data\n' +
                        'EXPECTED: some-data\nGOT:      different');
      });


      it('should not throw an exception when parsed body is equal to expected body object', function() {
        hb.when('GET').respond(200, '', {});

        hb.expect('GET', '/match', {a: 1, b: 2});
        expect(function() {
          hb('GET', '/match', '{"a":1,"b":2}', noop, {});
        }).not.toThrow();

        hb.expect('GET', '/match', {a: 1, b: 2});
        expect(function() {
          hb('GET', '/match', '{"b":2,"a":1}', noop, {});
        }).not.toThrow();
      });


      it('should throw exception when only parsed body differs from expected body object', function() {
        hb.when('GET').respond(200, '', {});
        hb.expect('GET', '/match', {a: 1, b: 2});

        expect(function() {
          hb('GET', '/match', '{"a":1,"b":3}', noop, {});
        }).toThrowError('Expected GET /match with different data\n' +
                        'EXPECTED: {"a":1,"b":2}\nGOT:      {"a":1,"b":3}');
      });


      it('should use when\'s respond() when no expect() respond is defined', function() {
        callback.and.callFake(function(status, response) {
          expect(status).toBe(201);
          expect(response).toBe('data');
        });

        hb.when('GET', '/some').respond(201, 'data');
        hb.expect('GET', '/some');
        hb('GET', '/some', null, callback);
        hb.flush();

        expect(callback).toHaveBeenCalled();
        expect(function() { hb.verifyNoOutstandingExpectation(); }).not.toThrow();
      });
    });


    describe('flush()', function() {
      it('flush() should flush requests fired during callbacks', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, function() {
          hb('GET', '/other', null, callback);
        });

        hb.flush();
        expect(callback).toHaveBeenCalled();
      });


      it('should flush given number of pending requests', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);

        hb.flush(2);
        expect(callback).toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(2);
      });


      it('should flush given number of pending requests beginning at specified request', function() {
        var dontCallMe = jasmine.createSpy('dontCallMe');

        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, dontCallMe);
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, dontCallMe);

        hb.flush(2, 1);
        expect(dontCallMe).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(2);
      });


      it('should flush all pending requests beginning at specified request', function() {
        var dontCallMe = jasmine.createSpy('dontCallMe');

        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, dontCallMe);
        hb('GET', '/some', null, dontCallMe);
        hb('GET', '/some', null, callback);
        hb('GET', '/some', null, callback);

        hb.flush(null, 2);
        expect(dontCallMe).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalledTimes(2);
      });


      it('should throw exception when flushing more requests than pending', function() {
        hb.when('GET').respond(200, '');
        hb('GET', '/url', null, callback);

        expect(function() {hb.flush(2);}).toThrowError('No more pending request to flush !');
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should throw exception when no request to flush', function() {
        expect(function() {hb.flush();}).toThrowError('No pending request to flush !');

        hb.when('GET').respond(200, '');
        hb('GET', '/some', null, callback);
        expect(function() {hb.flush(null, 1);}).toThrowError('No pending request to flush !');

        hb.flush();
        expect(function() {hb.flush();}).toThrowError('No pending request to flush !');
      });


      it('should throw exception if not all expectations satisfied', function() {
        hb.expect('GET', '/url1').respond();
        hb.expect('GET', '/url2').respond();

        hb('GET', '/url1', null, angular.noop);
        expect(function() {hb.flush();}).toThrowError('Unsatisfied requests: GET /url2');
      });
    });


    it('should abort requests when timeout promise resolves', function() {
      hb.expect('GET', '/url1').respond(200);

      var canceler, then = jasmine.createSpy('then').and.callFake(function(fn) {
        canceler = fn;
      });

      hb('GET', '/url1', null, callback, null, {then: then});
      expect(typeof canceler).toBe('function');

      canceler();  // simulate promise resolution

      expect(callback).toHaveBeenCalledWith(-1, undefined, '');
      hb.verifyNoOutstandingExpectation();
      hb.verifyNoOutstandingRequest();
    });


    it('should abort requests when timeout passed as a numeric value', inject(function($timeout) {
      hb.expect('GET', '/url1').respond(200);

      hb('GET', '/url1', null, callback, null, 200);
      $timeout.flush(300);

      expect(callback).toHaveBeenCalledWith(-1, undefined, '');
      hb.verifyNoOutstandingExpectation();
      hb.verifyNoOutstandingRequest();
    }));


    it('should throw an exception if no response defined', function() {
      hb.when('GET', '/test');
      expect(function() {
        hb('GET', '/test', null, callback);
      }).toThrowError('No response defined !');
    });


    it('should throw an exception if no response for exception and no definition', function() {
      hb.expect('GET', '/url');
      expect(function() {
        hb('GET', '/url', null, callback);
      }).toThrowError('No response defined !');
    });


    it('should respond undefined when JSONP method', function() {
      hb.when('JSONP', '/url1').respond(200);
      hb.expect('JSONP', '/url2').respond(200);

      expect(hb('JSONP', '/url1')).toBeUndefined();
      expect(hb('JSONP', '/url2')).toBeUndefined();
    });


    it('should not have passThrough method', function() {
      expect(hb.passThrough).toBeUndefined();
    });


    describe('verifyExpectations', function() {

      it('should throw exception if not all expectations were satisfied', function() {
        hb.expect('POST', '/u1', 'ddd').respond(201, '', {});
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});

        hb('POST', '/u1', 'ddd', noop, {});

        expect(function() {hb.verifyNoOutstandingExpectation();}).
          toThrowError('Unsatisfied requests: GET /u2, POST /u3');
      });


      it('should do nothing when no expectation', function() {
        hb.when('DELETE', '/some').respond(200, '');

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });


      it('should do nothing when all expectations satisfied', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.when('DELETE', '/some').respond(200, '');

        hb('GET', '/u2', noop);
        hb('POST', '/u3', noop);

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });
    });


    describe('verifyRequests', function() {

      it('should throw exception if not all requests were flushed', function() {
        hb.when('GET').respond(200);
        hb('GET', '/some', null, noop, {});

        expect(function() {
          hb.verifyNoOutstandingRequest();
        }).toThrowError('Unflushed requests: 1');
      });


      it('should verify requests fired asynchronously', inject(function($q) {
        hb.when('GET').respond(200);
        $q.resolve().then(function() {
          hb('GET', '/some', null, noop, {});
        });

        expect(function() {
          hb.verifyNoOutstandingRequest();
        }).toThrowError('Unflushed requests: 1');
      }));
    });


    describe('resetExpectations', function() {

      it('should remove all expectations', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.resetExpectations();

        expect(function() {hb.verifyNoOutstandingExpectation();}).not.toThrow();
      });


      it('should remove all pending responses', function() {
        var cancelledClb = jasmine.createSpy('cancelled');

        hb.expect('GET', '/url').respond(200, '');
        hb('GET', '/url', null, cancelledClb);
        hb.resetExpectations();

        hb.expect('GET', '/url').respond(300, '');
        hb('GET', '/url', null, callback, {});
        hb.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(cancelledClb).not.toHaveBeenCalled();
      });


      it('should not remove definitions', function() {
        var cancelledClb = jasmine.createSpy('cancelled');

        hb.when('GET', '/url').respond(200, 'success');
        hb('GET', '/url', null, cancelledClb);
        hb.resetExpectations();

        hb('GET', '/url', null, callback, {});
        hb.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(cancelledClb).not.toHaveBeenCalled();
      });
    });


    describe('expect/when shortcuts', function() {
      angular.forEach(['expect', 'when'], function(prefix) {
        angular.forEach(['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'JSONP'], function(method) {
          var shortcut = prefix + method;
          it('should provide ' + shortcut + ' shortcut method', function() {
            hb[shortcut]('/foo').respond('bar');
            hb(method, '/foo', undefined, callback);
            hb.flush();
            expect(callback).toHaveBeenCalledOnceWith(200, 'bar', '', '');
          });
        });
      });
    });


    describe('expectRoute/whenRoute shortcuts', function() {
      angular.forEach(['expectRoute', 'whenRoute'], function(routeShortcut) {
        var methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'JSONP'];
        they('should provide ' + routeShortcut + ' shortcut with $prop method', methods,
          function() {
            hb[routeShortcut](this, '/route').respond('path');
            hb(this, '/route', undefined, callback);
            hb.flush();
            expect(callback).toHaveBeenCalledOnceWith(200, 'path', '', '');
          }
        );
        they('should match colon delimited parameters in ' + routeShortcut + ' $prop method', methods,
          function() {
            hb[routeShortcut](this, '/route/:id/path/:s_id').respond('path');
            hb(this, '/route/123/path/456', undefined, callback);
            hb.flush();
            expect(callback).toHaveBeenCalledOnceWith(200, 'path', '', '');
          }
        );
        they('should ignore query param when matching in ' + routeShortcut + ' $prop method', methods,
          function() {
            hb[routeShortcut](this, '/route/:id').respond('path');
            hb(this, '/route/123?q=str&foo=bar', undefined, callback);
            hb.flush();
            expect(callback).toHaveBeenCalledOnceWith(200, 'path', '', '');
          }
        );
      });
    });


    describe('MockHttpExpectation', function() {
      /* global MockHttpExpectation */

      it('should accept url as regexp', function() {
        var exp = new MockHttpExpectation('GET', /^\/x/);

        expect(exp.match('GET', '/x')).toBe(true);
        expect(exp.match('GET', '/xxx/x')).toBe(true);
        expect(exp.match('GET', 'x')).toBe(false);
        expect(exp.match('GET', 'a/x')).toBe(false);
      });

      it('should match url with same query params, but different order', function() {
        var exp = new MockHttpExpectation('GET', 'www.example.com/x/y?a=b&c=d&e=f');

        expect(exp.matchUrl('www.example.com/x/y?e=f&c=d&a=b')).toBe(true);
      });

      it('should accept url as function', function() {
        var urlValidator = function(url) {
          return url !== '/not-accepted';
        };
        var exp = new MockHttpExpectation('POST', urlValidator);

        expect(exp.match('POST', '/url')).toBe(true);
        expect(exp.match('POST', '/not-accepted')).toBe(false);
      });


      it('should accept data as regexp', function() {
        var exp = new MockHttpExpectation('POST', '/url', /\{.*?\}/);

        expect(exp.match('POST', '/url', '{"a": "aa"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one": "two"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one"')).toBe(false);
      });


      it('should accept data as function', function() {
        var dataValidator = function(data) {
          var json = angular.fromJson(data);
          return !!json.id && json.status === 'N';
        };
        var exp = new MockHttpExpectation('POST', '/url', dataValidator);

        expect(exp.matchData({})).toBe(false);
        expect(exp.match('POST', '/url', '{"id": "xxx", "status": "N"}')).toBe(true);
        expect(exp.match('POST', '/url', {'id': 'xxx', 'status': 'N'})).toBe(true);
      });


      it('should ignore data only if undefined (not null or false)', function() {
        var exp = new MockHttpExpectation('POST', '/url', null);
        expect(exp.matchData(null)).toBe(true);
        expect(exp.matchData('some-data')).toBe(false);

        exp = new MockHttpExpectation('POST', '/url', undefined);
        expect(exp.matchData(null)).toBe(true);
        expect(exp.matchData('some-data')).toBe(true);
      });


      it('should accept headers as function', function() {
        var exp = new MockHttpExpectation('GET', '/url', undefined, function(h) {
          return h['Content-Type'] === 'application/json';
        });

        expect(exp.matchHeaders({})).toBe(false);
        expect(exp.matchHeaders({'Content-Type': 'application/json', 'X-Another': 'true'})).toBe(true);
      });
    });
  });


  describe('$rootElement', function() {
    it('should create mock application root', inject(function($rootElement) {
      expect($rootElement.text()).toEqual('');
    }));

    it('should attach the `$injector` to `$rootElement`', inject(function($injector, $rootElement) {
      expect($rootElement.injector()).toBe($injector);
    }));
  });


  describe('$rootScopeDecorator', function() {

    describe('$countChildScopes', function() {

      it('should return 0 when no child scopes', inject(function($rootScope) {
        expect($rootScope.$countChildScopes()).toBe(0);

        var childScope = $rootScope.$new();
        expect($rootScope.$countChildScopes()).toBe(1);
        expect(childScope.$countChildScopes()).toBe(0);

        var grandChildScope = childScope.$new();
        expect(childScope.$countChildScopes()).toBe(1);
        expect(grandChildScope.$countChildScopes()).toBe(0);
      }));


      it('should correctly navigate complex scope tree', inject(function($rootScope) {
        var child;

        $rootScope.$new();
        $rootScope.$new().$new().$new();
        child = $rootScope.$new().$new();
        child.$new();
        child.$new();
        child.$new().$new().$new();

        expect($rootScope.$countChildScopes()).toBe(11);
      }));


      it('should provide the current count even after child destructions', inject(function($rootScope) {
        expect($rootScope.$countChildScopes()).toBe(0);

        var childScope1 = $rootScope.$new();
        expect($rootScope.$countChildScopes()).toBe(1);

        var childScope2 = $rootScope.$new();
        expect($rootScope.$countChildScopes()).toBe(2);

        childScope1.$destroy();
        expect($rootScope.$countChildScopes()).toBe(1);

        childScope2.$destroy();
        expect($rootScope.$countChildScopes()).toBe(0);
      }));


      it('should work with isolate scopes', inject(function($rootScope) {
        /*
                  RS
                  |
                 CIS
                /   \
              GCS   GCIS
         */

        var childIsolateScope = $rootScope.$new(true);
        expect($rootScope.$countChildScopes()).toBe(1);

        var grandChildScope = childIsolateScope.$new();
        expect($rootScope.$countChildScopes()).toBe(2);
        expect(childIsolateScope.$countChildScopes()).toBe(1);

        var grandChildIsolateScope = childIsolateScope.$new(true);
        expect($rootScope.$countChildScopes()).toBe(3);
        expect(childIsolateScope.$countChildScopes()).toBe(2);

        childIsolateScope.$destroy();
        expect($rootScope.$countChildScopes()).toBe(0);
      }));
    });


    describe('$countWatchers', function() {

      it('should return the sum of watchers for the current scope and all of its children', inject(
        function($rootScope) {

          expect($rootScope.$countWatchers()).toBe(0);

          var childScope = $rootScope.$new();
          expect($rootScope.$countWatchers()).toBe(0);

          childScope.$watch('foo');
          expect($rootScope.$countWatchers()).toBe(1);
          expect(childScope.$countWatchers()).toBe(1);

          $rootScope.$watch('bar');
          childScope.$watch('baz');
          expect($rootScope.$countWatchers()).toBe(3);
          expect(childScope.$countWatchers()).toBe(2);
      }));


      it('should correctly navigate complex scope tree', inject(function($rootScope) {
        var child;

        $rootScope.$watch('foo1');

        $rootScope.$new();
        $rootScope.$new().$new().$new();

        child = $rootScope.$new().$new();
        child.$watch('foo2');
        child.$new();
        child.$new();
        child = child.$new().$new().$new();
        child.$watch('foo3');
        child.$watch('foo4');

        expect($rootScope.$countWatchers()).toBe(4);
      }));


      it('should provide the current count even after child destruction and watch deregistration',
          inject(function($rootScope) {

        var deregisterWatch1 = $rootScope.$watch('exp1');

        var childScope = $rootScope.$new();
        childScope.$watch('exp2');

        expect($rootScope.$countWatchers()).toBe(2);

        childScope.$destroy();
        expect($rootScope.$countWatchers()).toBe(1);

        deregisterWatch1();
        expect($rootScope.$countWatchers()).toBe(0);
      }));


      it('should work with isolate scopes', inject(function($rootScope) {
        /*
                 RS=1
                   |
                CIS=1
                /    \
            GCS=1  GCIS=1
         */

        $rootScope.$watch('exp1');
        expect($rootScope.$countWatchers()).toBe(1);

        var childIsolateScope = $rootScope.$new(true);
        childIsolateScope.$watch('exp2');
        expect($rootScope.$countWatchers()).toBe(2);
        expect(childIsolateScope.$countWatchers()).toBe(1);

        var grandChildScope = childIsolateScope.$new();
        grandChildScope.$watch('exp3');

        var grandChildIsolateScope = childIsolateScope.$new(true);
        grandChildIsolateScope.$watch('exp4');

        expect($rootScope.$countWatchers()).toBe(4);
        expect(childIsolateScope.$countWatchers()).toBe(3);
        expect(grandChildScope.$countWatchers()).toBe(1);
        expect(grandChildIsolateScope.$countWatchers()).toBe(1);

        childIsolateScope.$destroy();
        expect($rootScope.$countWatchers()).toBe(1);
      }));
    });
  });


  describe('$controllerDecorator', function() {

    describe('with `preAssignBindingsEnabled(true)`', function() {

      beforeEach(module(function($compileProvider) {
        $compileProvider.preAssignBindingsEnabled(true);
      }));


      it('should support creating controller with bindings', function() {
        var called = false;
        var data = [
          { name: 'derp1', id: 0 },
          { name: 'testname', id: 1 },
          { name: 'flurp', id: 2 }
        ];
        module(function($controllerProvider) {
          $controllerProvider.register('testCtrl', function() {
            expect(this.data).toBe(data);
            called = true;
          });
        });
        inject(function($controller, $rootScope) {
          var ctrl = $controller('testCtrl', { scope: $rootScope }, { data: data });
          expect(ctrl.data).toBe(data);
          expect(called).toBe(true);
        });
      });


      it('should support assigning bindings when a value is returned from the constructor',
        function() {
          var called = false;
          var data = [
            { name: 'derp1', id: 0 },
            { name: 'testname', id: 1 },
            { name: 'flurp', id: 2 }
          ];
          module(function($controllerProvider) {
            $controllerProvider.register('testCtrl', function() {
              expect(this.data).toBe(data);
              called = true;
              return {};
            });
          });
          inject(function($controller, $rootScope) {
            var ctrl = $controller('testCtrl', { scope: $rootScope }, { data: data });
            expect(ctrl.data).toBe(data);
            expect(called).toBe(true);
          });
        }
      );


      if (/chrome/.test(window.navigator.userAgent)) {
        it('should support assigning bindings to class-based controller', function() {
          var called = false;
          var data = [
            { name: 'derp1', id: 0 },
            { name: 'testname', id: 1 },
            { name: 'flurp', id: 2 }
          ];
          module(function($controllerProvider) {
            // eslint-disable-next-line no-eval
            var TestCtrl = eval('(class { constructor() { called = true; } })');
            $controllerProvider.register('testCtrl', TestCtrl);
          });
          inject(function($controller, $rootScope) {
            var ctrl = $controller('testCtrl', { scope: $rootScope }, { data: data });
            expect(ctrl.data).toBe(data);
            expect(called).toBe(true);
          });
        });
      }
    });


    describe('with `preAssignBindingsEnabled(false)`', function() {

      beforeEach(module(function($compileProvider) {
        $compileProvider.preAssignBindingsEnabled(false);
      }));


      it('should support creating controller with bindings', function() {
        var called = false;
        var data = [
          { name: 'derp1', id: 0 },
          { name: 'testname', id: 1 },
          { name: 'flurp', id: 2 }
        ];
        module(function($controllerProvider) {
          $controllerProvider.register('testCtrl', function() {
            expect(this.data).toBeUndefined();
            called = true;
          });
        });
        inject(function($controller, $rootScope) {
          var ctrl = $controller('testCtrl', { scope: $rootScope }, { data: data });
          expect(ctrl.data).toBe(data);
          expect(called).toBe(true);
        });
      });


      it('should support assigning bindings when a value is returned from the constructor',
        function() {
          var called = false;
          var data = [
            { name: 'derp1', id: 0 },
            { name: 'testname', id: 1 },
            { name: 'flurp', id: 2 }
          ];
          module(function($controllerProvider) {
            $controllerProvider.register('testCtrl', function() {
              expect(this.data).toBeUndefined();
              called = true;
              return {};
            });
          });
          inject(function($controller, $rootScope) {
            var ctrl = $controller('testCtrl', { scope: $rootScope }, { data: data });
            expect(ctrl.data).toBe(data);
            expect(called).toBe(true);
          });
        }
      );


      if (/chrome/.test(window.navigator.userAgent)) {
        it('should support assigning bindings to class-based controller', function() {
          var called = false;
          var data = [
            { name: 'derp1', id: 0 },
            { name: 'testname', id: 1 },
            { name: 'flurp', id: 2 }
          ];
          module(function($controllerProvider) {
            // eslint-disable-next-line no-eval
            var TestCtrl = eval('(class { constructor() { called = true; } })');
            $controllerProvider.register('testCtrl', TestCtrl);
          });
          inject(function($controller, $rootScope) {
            var ctrl = $controller('testCtrl', { scope: $rootScope }, { data: data });
            expect(ctrl.data).toBe(data);
            expect(called).toBe(true);
          });
        });
      }
    });
  });


  describe('$componentController', function() {
    it('should instantiate a simple controller defined inline in a component', function() {
      function TestController($scope, a, b) {
        this.$scope = $scope;
        this.a = a;
        this.b = b;
      }
      module(function($compileProvider) {
        $compileProvider.component('test', {
          controller: TestController
        });
      });
      inject(function($componentController, $rootScope) {
        var $scope = {};
        var ctrl = $componentController('test', { $scope: $scope, a: 'A', b: 'B' }, { x: 'X', y: 'Y' });
        expect(ctrl).toEqual(extend(new TestController($scope, 'A', 'B'), { x: 'X', y: 'Y' }));
        expect($scope.$ctrl).toBe(ctrl);
      });
    });

    it('should instantiate a controller with $$inject annotation defined inline in a component', function() {
      function TestController(x, y, z) {
        this.$scope = x;
        this.a = y;
        this.b = z;
      }
      TestController.$inject = ['$scope', 'a', 'b'];
      module(function($compileProvider) {
        $compileProvider.component('test', {
          controller: TestController
        });
      });
      inject(function($componentController, $rootScope) {
        var $scope = {};
        var ctrl = $componentController('test', { $scope: $scope, a: 'A', b: 'B' }, { x: 'X', y: 'Y' });
        expect(ctrl).toEqual(extend(new TestController($scope, 'A', 'B'), { x: 'X', y: 'Y' }));
        expect($scope.$ctrl).toBe(ctrl);
      });
    });

    it('should instantiate a named controller defined in a component', function() {
      function TestController($scope, a, b) {
        this.$scope = $scope;
        this.a = a;
        this.b = b;
      }
      module(function($controllerProvider, $compileProvider) {
        $controllerProvider.register('TestController', TestController);
        $compileProvider.component('test', {
          controller: 'TestController'
        });
      });
      inject(function($componentController, $rootScope) {
        var $scope = {};
        var ctrl = $componentController('test', { $scope: $scope, a: 'A', b: 'B' }, { x: 'X', y: 'Y' });
        expect(ctrl).toEqual(extend(new TestController($scope, 'A', 'B'), { x: 'X', y: 'Y' }));
        expect($scope.$ctrl).toBe(ctrl);
      });
    });

    it('should instantiate a named controller with `controller as` syntax defined in a component', function() {
      function TestController($scope, a, b) {
        this.$scope = $scope;
        this.a = a;
        this.b = b;
      }
      module(function($controllerProvider, $compileProvider) {
        $controllerProvider.register('TestController', TestController);
        $compileProvider.component('test', {
          controller: 'TestController as testCtrl'
        });
      });
      inject(function($componentController, $rootScope) {
        var $scope = {};
        var ctrl = $componentController('test', { $scope: $scope, a: 'A', b: 'B' }, { x: 'X', y: 'Y' });
        expect(ctrl).toEqual(extend(new TestController($scope, 'A', 'B'), {x: 'X', y: 'Y'}));
        expect($scope.testCtrl).toBe(ctrl);
      });
    });

    it('should instantiate the controller of the restrict:\'E\' component if there are more directives with the same name but not restricted to \'E\'', function() {
      function TestController() {
        this.r = 6779;
      }
      module(function($compileProvider) {
        $compileProvider.directive('test', function() {
          return { restrict: 'A' };
        });
        $compileProvider.component('test', {
          controller: TestController
        });
      });
      inject(function($componentController, $rootScope) {
        var ctrl = $componentController('test', { $scope: {} });
        expect(ctrl).toEqual(new TestController());
      });
    });

    it('should instantiate the controller of the restrict:\'E\' component if there are more directives with the same name and restricted to \'E\' but no controller', function() {
      function TestController() {
        this.r = 22926;
      }
      module(function($compileProvider) {
        $compileProvider.directive('test', function() {
          return { restrict: 'E' };
        });
        $compileProvider.component('test', {
          controller: TestController
        });
      });
      inject(function($componentController, $rootScope) {
        var ctrl = $componentController('test', { $scope: {} });
        expect(ctrl).toEqual(new TestController());
      });
    });

    it('should instantiate the controller of the directive with controller, controllerAs and restrict:\'E\' if there are more directives', function() {
      function TestController() {
        this.r = 18842;
      }
      module(function($compileProvider) {
        $compileProvider.directive('test', function() {
          return { };
        });
        $compileProvider.directive('test', function() {
          return {
            restrict: 'E',
            controller: TestController,
            controllerAs: '$ctrl'
          };
        });
      });
      inject(function($componentController, $rootScope) {
        var ctrl = $componentController('test', { $scope: {} });
        expect(ctrl).toEqual(new TestController());
      });
    });

    it('should fail if there is no directive with restrict:\'E\' and controller', function() {
      function TestController() {
        this.r = 31145;
      }
      module(function($compileProvider) {
        $compileProvider.directive('test', function() {
          return {
            restrict: 'AC',
            controller: TestController
          };
        });
        $compileProvider.directive('test', function() {
          return {
            restrict: 'E',
            controller: TestController
          };
        });
        $compileProvider.directive('test', function() {
          return {
            restrict: 'EA',
            controller: TestController,
            controllerAs: '$ctrl'
          };
        });
        $compileProvider.directive('test', function() {
          return { restrict: 'E' };
        });
      });
      inject(function($componentController, $rootScope) {
        expect(function() {
          $componentController('test', { $scope: {} });
        }).toThrowError('No component found');
      });
    });

    it('should fail if there more than two components with same name', function() {
      function TestController($scope, a, b) {
        this.$scope = $scope;
        this.a = a;
        this.b = b;
      }
      module(function($compileProvider) {
        $compileProvider.directive('test', function() {
          return {
            restrict: 'E',
            controller: TestController,
            controllerAs: '$ctrl'
          };
        });
        $compileProvider.component('test', {
          controller: TestController
        });
      });
      inject(function($componentController, $rootScope) {
        expect(function() {
          var $scope = {};
          $componentController('test', { $scope: $scope, a: 'A', b: 'B' }, { x: 'X', y: 'Y' });
        }).toThrowError('Too many components found');
      });
    });

    it('should create an isolated child of $rootScope, if no `$scope` local is provided', function() {
      function TestController($scope) {
        this.$scope = $scope;
      }
      module(function($compileProvider) {
        $compileProvider.component('test', {
          controller: TestController
        });
      });
      inject(function($componentController, $rootScope) {
        var $ctrl = $componentController('test');
        expect($ctrl.$scope).toBeDefined();
        expect($ctrl.$scope.$parent).toBe($rootScope);
        // check it is isolated
        $rootScope.a = 17;
        expect($ctrl.$scope.a).toBeUndefined();
        $ctrl.$scope.a = 42;
        expect($rootScope.a).toEqual(17);
      });
    });
  });
});


describe('ngMockE2E', function() {
  describe('$httpBackend', function() {
    var hb, realHttpBackend, callback;

    beforeEach(function() {
      callback = jasmine.createSpy('callback');
      angular.module('ng').config(function($provide) {
        realHttpBackend = jasmine.createSpy('real $httpBackend');
        $provide.value('$httpBackend', realHttpBackend);
      });
      module('ngMockE2E');
      inject(function($injector) {
        hb = $injector.get('$httpBackend');
      });
    });


    describe('passThrough()', function() {
      it('should delegate requests to the real backend when passThrough is invoked', function() {
        var eventHandlers = {progress: angular.noop};
        var uploadEventHandlers = {progress: angular.noop};

        hb.when('GET', /\/passThrough\/.*/).passThrough();
        hb('GET', '/passThrough/23', null, callback, {}, null, true, 'blob', eventHandlers, uploadEventHandlers);

        expect(realHttpBackend).toHaveBeenCalledOnceWith(
            'GET', '/passThrough/23', null, callback, {}, null, true, 'blob', eventHandlers, uploadEventHandlers);
      });

      it('should be able to override a respond definition with passThrough', function() {
        var definition = hb.when('GET', /\/passThrough\/.*/).respond('override me');
        definition.passThrough();
        hb('GET', '/passThrough/23', null, callback, {}, null, true);

        expect(realHttpBackend).toHaveBeenCalledOnceWith(
            'GET', '/passThrough/23', null, callback, {}, null, true, undefined, undefined, undefined);
      });

      it('should be able to override a respond definition with passThrough', inject(function($browser) {
        var definition = hb.when('GET', /\/passThrough\/.*/).passThrough();
        definition.respond('passThrough override');
        hb('GET', '/passThrough/23', null, callback, {}, null, true);
        $browser.defer.flush();

        expect(realHttpBackend).not.toHaveBeenCalled();
        expect(callback).toHaveBeenCalledOnceWith(200, 'passThrough override', '', '');
      }));
    });


    describe('autoflush', function() {
      it('should flush responses via $browser.defer', inject(function($browser) {
        hb.when('GET', '/foo').respond('bar');
        hb('GET', '/foo', null, callback);

        expect(callback).not.toHaveBeenCalled();
        $browser.defer.flush();
        expect(callback).toHaveBeenCalledOnce();
      }));
    });
  });

  describe('ngAnimateMock', function() {

    beforeEach(module('ngAnimate'));
    beforeEach(module('ngAnimateMock'));

    var ss, element, trackedAnimations, animationLog;

    afterEach(function() {
      if (element) {
        element.remove();
      }
      if (ss) {
        ss.destroy();
      }
    });

    beforeEach(module(function($animateProvider) {
      trackedAnimations = [];
      animationLog = [];

      $animateProvider.register('.animate', function() {
        return {
          leave: logFn('leave'),
          addClass: logFn('addClass')
        };

        function logFn(method) {
          return function(element) {
            animationLog.push('start ' + method);
            trackedAnimations.push(getDoneCallback(arguments));

            return function closingFn(cancel) {
              var lab = cancel ? 'cancel' : 'end';
              animationLog.push(lab + ' ' + method);
            };
          };
        }

        function getDoneCallback(args) {
          for (var i = args.length; i > 0; i--) {
            if (angular.isFunction(args[i])) return args[i];
          }
        }
      });

      return function($animate, $rootElement, $document, $rootScope) {
        ss = createMockStyleSheet($document);

        element = angular.element('<div class="animate"></div>');
        $rootElement.append(element);
        angular.element($document[0].body).append($rootElement);
        $animate.enabled(true);
        $rootScope.$digest();
      };
    }));

    describe('$animate.queue', function() {
      it('should maintain a queue of the executed animations', inject(function($animate) {
        element.removeClass('animate'); // we don't care to test any actual animations
        var options = {};

        $animate.addClass(element, 'on', options);
        var first = $animate.queue[0];
        expect(first.element).toBe(element);
        expect(first.event).toBe('addClass');
        expect(first.options).toBe(options);

        $animate.removeClass(element, 'off', options);
        var second = $animate.queue[1];
        expect(second.element).toBe(element);
        expect(second.event).toBe('removeClass');
        expect(second.options).toBe(options);

        $animate.leave(element, options);
        var third = $animate.queue[2];
        expect(third.element).toBe(element);
        expect(third.event).toBe('leave');
        expect(third.options).toBe(options);
      }));
    });

    describe('$animate.flush()', function() {
      it('should throw an error if there is nothing to animate', inject(function($animate) {
        expect(function() {
          $animate.flush();
        }).toThrowError('No pending animations ready to be closed or flushed');
      }));

      it('should trigger the animation to start',
        inject(function($animate) {

        expect(trackedAnimations.length).toBe(0);
        $animate.leave(element);
        $animate.flush();
        expect(trackedAnimations.length).toBe(1);
      }));

      it('should trigger the animation to end once run and called',
        inject(function($animate) {

        $animate.leave(element);
        $animate.flush();
        expect(element.parent().length).toBe(1);

        trackedAnimations[0]();
        $animate.flush();
        expect(element.parent().length).toBe(0);
      }));

      it('should trigger the animation promise callback to fire once run and closed',
        inject(function($animate) {

        var doneSpy = jasmine.createSpy();
        $animate.leave(element).then(doneSpy);
        $animate.flush();

        trackedAnimations[0]();
        expect(doneSpy).not.toHaveBeenCalled();
        $animate.flush();
        expect(doneSpy).toHaveBeenCalled();
      }));

      it('should trigger a series of CSS animations to trigger and start once run',
        inject(function($animate, $rootScope) {

        if (!browserSupportsCssAnimations()) return;

        ss.addRule('.leave-me.ng-leave', 'transition:1s linear all;');

        var i, elm, elms = [];
        for (i = 0; i < 5; i++) {
          elm = angular.element('<div class="leave-me"></div>');
          element.append(elm);
          elms.push(elm);

          $animate.leave(elm);
        }

        $rootScope.$digest();

        for (i = 0; i < 5; i++) {
          elm = elms[i];
          expect(elm.hasClass('ng-leave')).toBe(true);
          expect(elm.hasClass('ng-leave-active')).toBe(false);
        }

        $animate.flush();

        for (i = 0; i < 5; i++) {
          elm = elms[i];
          expect(elm.hasClass('ng-leave')).toBe(true);
          expect(elm.hasClass('ng-leave-active')).toBe(true);
        }
      }));

      it('should trigger parent and child animations to run within the same flush',
        inject(function($animate, $rootScope) {

        var child = angular.element('<div class="animate child"></div>');
        element.append(child);

        expect(trackedAnimations.length).toBe(0);

        $animate.addClass(element, 'go');
        $animate.addClass(child, 'start');
        $animate.flush();

        expect(trackedAnimations.length).toBe(2);
      }));

      it('should trigger animation callbacks when called',
        inject(function($animate, $rootScope) {

        var spy = jasmine.createSpy();
        $animate.on('addClass', element, spy);

        $animate.addClass(element, 'on');
        expect(spy).not.toHaveBeenCalled();

        $animate.flush();
        expect(spy).toHaveBeenCalledTimes(1);

        trackedAnimations[0]();
        $animate.flush();
        expect(spy).toHaveBeenCalledTimes(2);
      }));
    });

    describe('$animate.closeAndFlush()', function() {
      it('should close the currently running $animateCss animations',
        inject(function($animateCss, $animate) {

        if (!browserSupportsCssAnimations()) return;

        var spy = jasmine.createSpy();
        var runner = $animateCss(element, {
          duration: 1,
          to: { color: 'red' }
        }).start();

        runner.then(spy);

        expect(spy).not.toHaveBeenCalled();
        $animate.closeAndFlush();
        expect(spy).toHaveBeenCalled();
      }));

      it('should close the currently running $$animateJs animations',
        inject(function($$animateJs, $animate) {

        var spy = jasmine.createSpy();
        var runner = $$animateJs(element, 'leave', 'animate', {}).start();
        runner.then(spy);

        expect(spy).not.toHaveBeenCalled();
        $animate.closeAndFlush();
        expect(spy).toHaveBeenCalled();
      }));

      it('should run the closing javascript animation function upon flush',
        inject(function($$animateJs, $animate) {

        $$animateJs(element, 'leave', 'animate', {}).start();

        expect(animationLog).toEqual(['start leave']);
        $animate.closeAndFlush();
        expect(animationLog).toEqual(['start leave', 'end leave']);
      }));

      it('should not throw when a regular animation has no javascript animation',
        inject(function($animate, $$animation, $rootElement) {

        if (!browserSupportsCssAnimations()) return;

        var element = jqLite('<div></div>');
        $rootElement.append(element);

        // Make sure the animation has valid $animateCss options
        $$animation(element, null, {
          from: { background: 'red' },
          to: { background: 'blue' },
          duration: 1,
          transitionStyle: 'all 1s'
        });

        expect(function() {
          $animate.closeAndFlush();
        }).not.toThrow();

        dealoc(element);
      }));

      it('should throw an error if there are no animations to close and flush',
        inject(function($animate) {

        expect(function() {
          $animate.closeAndFlush();
        }).toThrowError('No pending animations ready to be closed or flushed');

      }));
    });
  });
});


describe('make sure that we can create an injector outside of tests', function() {
  //since some libraries create custom injectors outside of tests,
  //we want to make sure that this is not breaking the internals of
  //how we manage annotated function cleanup during tests. See #10967
  angular.injector([function($injector) {}]);
});


describe('`afterEach` clean-up', function() {
  describe('`$rootElement`', function() {

    describe('undecorated', function() {
      var prevRootElement;
      var prevCleanDataSpy;


      it('should set up spies for the next test to verify that `$rootElement` was cleaned up',
        function() {
          module(function($provide) {
            $provide.decorator('$rootElement', function($delegate) {
              prevRootElement = $delegate;

              // Spy on `angular.element.cleanData()`, so the next test can verify
              // that it has been called as necessary
              prevCleanDataSpy = spyOn(angular.element, 'cleanData').and.callThrough();

              return $delegate;
            });
          });

          // Inject the `$rootElement` to ensure it has been created
          inject(function($rootElement) {
            expect($rootElement.injector()).toBeDefined();
          });
        }
      );


      it('should clean up `$rootElement` after each test', function() {
        // One call is made by `testabilityPatch`'s `dealoc()`
        // We want to verify the subsequent call, made by `angular-mocks`
        expect(prevCleanDataSpy).toHaveBeenCalledTimes(2);

        var cleanUpNodes = prevCleanDataSpy.calls.argsFor(1)[0];
        expect(cleanUpNodes.length).toBe(1);
        expect(cleanUpNodes[0]).toBe(prevRootElement[0]);
      });
    });


    describe('decorated', function() {
      var prevOriginalRootElement;
      var prevRootElement;
      var prevCleanDataSpy;


      it('should set up spies for the next text to verify that `$rootElement` was cleaned up',
        function() {
          module(function($provide) {
            $provide.decorator('$rootElement', function($delegate) {
              prevOriginalRootElement = $delegate;

              // Mock `$rootElement` to be able to verify that the correct object is cleaned up
              prevRootElement = angular.element('<div></div>');

              // Spy on `angular.element.cleanData()`, so the next test can verify
              // that it has been called as necessary
              prevCleanDataSpy = spyOn(angular.element, 'cleanData').and.callThrough();

              return prevRootElement;
            });
          });

          // Inject the `$rootElement` to ensure it has been created
          inject(function($rootElement) {
            expect($rootElement).toBe(prevRootElement);
            expect(prevOriginalRootElement.injector()).toBeDefined();
            expect(prevRootElement.injector()).toBeUndefined();

            // If we don't clean up `prevOriginalRootElement`-related data now, `testabilityPatch` will
            // complain about a memory leak, because it doesn't clean up after the original
            // `$rootElement`
            // This is a false alarm, because `angular-mocks` would have cleaned up in a subsequent
            // `afterEach` block
            prevOriginalRootElement.removeData();
          });
        }
      );


      it('should clean up `$rootElement` (both original and decorated) after each test',
        function() {
          // One call is made by `testabilityPatch`'s `dealoc()`
          // We want to verify the subsequent call, made by `angular-mocks`
          expect(prevCleanDataSpy).toHaveBeenCalledTimes(2);

          var cleanUpNodes = prevCleanDataSpy.calls.argsFor(1)[0];
          expect(cleanUpNodes.length).toBe(2);
          expect(cleanUpNodes[0]).toBe(prevOriginalRootElement[0]);
          expect(cleanUpNodes[1]).toBe(prevRootElement[0]);
        }
      );
    });


    describe('uninstantiated or falsy', function() {
      it('should not break if `$rootElement` was never instantiated', function() {
        // Just an empty test to verify that `angular-mocks` doesn't break,
        // when trying to clean up `$rootElement`, if `$rootElement` was never injected in the test
        // (and thus never instantiated/created)

        // Ensure the `$injector` is created - if there is no `$injector`, no clean-up takes places
        inject(function() {});
      });


      it('should not break if the decorated `$rootElement` is falsy (e.g. `null`)', function() {
        module({$rootElement: null});

        // Ensure the `$injector` is created - if there is no `$injector`, no clean-up takes places
        inject(function() {});
      });
    });
  });


  describe('`$rootScope`', function() {
    describe('undecorated', function() {
      var prevRootScope;
      var prevDestroySpy;


      it('should set up spies for the next test to verify that `$rootScope` was cleaned up',
        inject(function($rootScope) {
          prevRootScope = $rootScope;
          prevDestroySpy = spyOn($rootScope, '$destroy').and.callThrough();
        })
      );


      it('should clean up `$rootScope` after each test', inject(function($rootScope) {
        expect($rootScope).not.toBe(prevRootScope);
        expect(prevDestroySpy).toHaveBeenCalledOnce();
        expect(prevRootScope.$$destroyed).toBe(true);
      }));
    });


    describe('falsy or without `$destroy()` method', function() {
      it('should not break if `$rootScope` is falsy (e.g. `null`)', function() {
        // Just an empty test to verify that `angular-mocks` doesn't break,
        // when trying to clean up a mocked `$rootScope` set to `null`

        module({$rootScope: null});

        // Ensure the `$injector` is created - if there is no `$injector`, no clean-up takes places
        inject(function() {});
      });


      it('should not break if `$rootScope.$destroy` is not a function', function() {
        // Just an empty test to verify that `angular-mocks` doesn't break,
        // when trying to clean up a mocked `$rootScope` without a `$destroy()` method

        module({$rootScope: {}});

        // Ensure the `$injector` is created - if there is no `$injector`, no clean-up takes places
        inject(function() {});
      });
    });
  });
});


describe('sharedInjector', function() {
  // this is of a bit tricky feature to test as we hit angular's own testing
  // mechanisms (e.g around jQuery cache checking), as ngMock augments the very
  // jasmine test runner we're using to test ngMock!
  //
  // with that in mind, we define a stubbed test framework
  // to simulate test cases being run with the ngMock hooks


  // we use the 'module' and 'inject' globals from ngMock

  it('allows me to mutate a single instance of a module (proving it has been shared)', ngMockTest(function() {
    sdescribe('test state is shared', function() {
      angular.module('sharedInjectorTestModuleA', [])
        .factory('testService', function() {
          return { state: 0 };
        });

      module.sharedInjector();

      sbeforeAll(module('sharedInjectorTestModuleA'));

      sit('access and mutate', inject(function(testService) {
        testService.state += 1;
      }));

      sit('expect mutation to have persisted', inject(function(testService) {
        expect(testService.state).toEqual(1);
      }));
    });
  }));


  it('works with standard beforeEach', ngMockTest(function() {
    sdescribe('test state is not shared', function() {
      angular.module('sharedInjectorTestModuleC', [])
        .factory('testService', function() {
          return { state: 0 };
        });

      sbeforeEach(module('sharedInjectorTestModuleC'));

      sit('access and mutate', inject(function(testService) {
        testService.state += 1;
      }));

      sit('expect mutation not to have persisted', inject(function(testService) {
        expect(testService.state).toEqual(0);
      }));
    });
  }));


  it('allows me to stub with shared injector', ngMockTest(function() {
    sdescribe('test state is shared', function() {
      angular.module('sharedInjectorTestModuleD', [])
        .value('testService', 43);

      module.sharedInjector();

      sbeforeAll(module('sharedInjectorTestModuleD', function($provide) {
        $provide.value('testService', 42);
      }));

      sit('expected access stubbed value', inject(function(testService) {
        expect(testService).toEqual(42);
      }));
    });
  }));

  it('doesn\'t interfere with other test describes', ngMockTest(function() {
    angular.module('sharedInjectorTestModuleE', [])
      .factory('testService', function() {
        return { state: 0 };
      });

    sdescribe('with stubbed injector', function() {

      module.sharedInjector();

      sbeforeAll(module('sharedInjectorTestModuleE'));

      sit('access and mutate', inject(function(testService) {
        expect(testService.state).toEqual(0);
        testService.state += 1;
      }));

      sit('expect mutation to have persisted', inject(function(testService) {
        expect(testService.state).toEqual(1);
      }));
    });

    sdescribe('without stubbed injector', function() {
      sbeforeEach(module('sharedInjectorTestModuleE'));

      sit('access and mutate', inject(function(testService) {
        expect(testService.state).toEqual(0);
        testService.state += 1;
      }));

      sit('expect original, unmutated value', inject(function(testService) {
        expect(testService.state).toEqual(0);
      }));
    });
  }));

  it('prevents nested use of sharedInjector()', function() {
    var test = ngMockTest(function() {
      sdescribe('outer', function() {

        module.sharedInjector();

        sdescribe('inner', function() {

          module.sharedInjector();

          sit('should not get here', function() {
            throw Error('should have thrown before here!');
          });
        });

      });

    });

    assertThrowsErrorMatching(test.bind(this), /already called sharedInjector()/);
  });

  it('warns that shared injector cannot be used unless test frameworks define before/after all hooks', function() {
    assertThrowsErrorMatching(function() {
      module.sharedInjector();
    }, /sharedInjector()/);
  });

  function assertThrowsErrorMatching(fn, re) {
    try {
      fn();
    } catch (e) {
      if (re.test(e.message)) {
        return;
      }
      throw Error('thrown error \'' + e.message + '\' did not match:' + re);
    }
    throw Error('should have thrown error');
  }

  // run a set of test cases in the sdescribe stub test framework
  function ngMockTest(define) {
    return function() {
      var spec = this;
      module.$$currentSpec(null);

      // configure our stubbed test framework and then hook ngMock into it
      // in much the same way
      module.$$beforeAllHook = sbeforeAll;
      module.$$afterAllHook = safterAll;

      sdescribe.root = sdescribe('root', function() {});

      sdescribe.root.beforeEach.push(module.$$beforeEach);
      sdescribe.root.afterEach.push(module.$$afterEach);

      try {
        define();
        sdescribe.root.run();
      } finally {
        // avoid failing testability for the additional
        // injectors etc created
        angular.element.cache = {};

        // clear up
        module.$$beforeAllHook = null;
        module.$$afterAllHook = null;
        module.$$currentSpec(spec);
      }
    };
  }

  // stub test framework that follows the pattern of hooks that
  // jasmine/mocha do
  function sdescribe(name, define) {
    var self = { name: name };
    self.parent = sdescribe.current || sdescribe.root;
    if (self.parent) {
      self.parent.describes.push(self);
    }

    var previous = sdescribe.current;
    sdescribe.current = self;

    self.beforeAll = [];
    self.beforeEach = [];
    self.afterAll = [];
    self.afterEach = [];
    self.define = define;
    self.tests = [];
    self.describes = [];

    self.run = function() {
      var spec = {};
      self.hooks('beforeAll', spec);

      self.tests.forEach(function(test) {
        if (self.parent) self.parent.hooks('beforeEach', spec);
        self.hooks('beforeEach', spec);
        test.run.call(spec);
        self.hooks('afterEach', spec);
        if (self.parent) self.parent.hooks('afterEach', spec);
      });

      self.describes.forEach(function(d) {
        d.run();
      });

      self.hooks('afterAll', spec);
    };

    self.hooks = function(hook, spec) {
      self[hook].forEach(function(f) {
        f.call(spec);
      });
    };

    define();

    sdescribe.current = previous;

    return self;
  }

  function sit(name, fn) {
    if (typeof fn !== 'function') throw Error('not fn', fn);
    sdescribe.current.tests.push({
      name: name,
      run: fn
    });
  }

  function sbeforeAll(fn) {
    if (typeof fn !== 'function') throw Error('not fn', fn);
    sdescribe.current.beforeAll.push(fn);
  }

  function safterAll(fn) {
    if (typeof fn !== 'function') throw Error('not fn', fn);
    sdescribe.current.afterAll.push(fn);
  }

  function sbeforeEach(fn) {
    if (typeof fn !== 'function') throw Error('not fn', fn);
    sdescribe.current.beforeEach.push(fn);
  }

  function safterEach(fn) {
    if (typeof fn !== 'function') throw Error('not fn', fn);
    sdescribe.current.afterEach.push(fn);
  }
});
