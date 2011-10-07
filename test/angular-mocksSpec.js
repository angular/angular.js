'use strict';

describe('mocks', function() {
  describe('TzDate', function() {

    function minutes(min) {
      return min*60*1000;
    }

    it('should take millis as constructor argument', function() {
      expect(new TzDate(0, 0).getTime()).toBe(0);
      expect(new TzDate(0, 1283555108000).getTime()).toBe(1283555108000);
    });

    it('should take dateString as constructor argument', function() {
      expect(new TzDate(0, '1970-01-01T00:00:00.000Z').getTime()).toBe(0);
      expect(new TzDate(0, '2010-09-03T23:05:08.023Z').getTime()).toBe(1283555108023);
    });


    it('should fake getLocalDateString method', function() {
      //0 in -3h
      var t0 = new TzDate(-3, 0);
      expect(t0.toLocaleDateString()).toMatch('1970');

      //0 in +0h
      var t1 = new TzDate(0, 0);
      expect(t1.toLocaleDateString()).toMatch('1970');

      //0 in +3h
      var t2 = new TzDate(3, 0);
      expect(t2.toLocaleDateString()).toMatch('1969');
    });


    it('should fake getHours method', function() {
      //0 in -3h
      var t0 = new TzDate(-3, 0);
      expect(t0.getHours()).toBe(3);

      //0 in +0h
      var t1 = new TzDate(0, 0);
      expect(t1.getHours()).toBe(0);

      //0 in +3h
      var t2 = new TzDate(3, 0);
      expect(t2.getHours()).toMatch(21);
    });


    it('should fake getMinutes method', function() {
      //0:15 in -3h
      var t0 = new TzDate(-3, minutes(15));
      expect(t0.getMinutes()).toBe(15);

      //0:15 in -3.25h
      var t0a = new TzDate(-3.25, minutes(15));
      expect(t0a.getMinutes()).toBe(30);

      //0 in +0h
      var t1 = new TzDate(0, minutes(0));
      expect(t1.getMinutes()).toBe(0);

      //0:15 in +0h
      var t1a = new TzDate(0, minutes(15));
      expect(t1a.getMinutes()).toBe(15);

      //0:15 in +3h
      var t2 = new TzDate(3, minutes(15));
      expect(t2.getMinutes()).toMatch(15);

      //0:15 in +3.25h
      var t2a = new TzDate(3.25, minutes(15));
      expect(t2a.getMinutes()).toMatch(0);
    });


    it('should fake getSeconds method', function() {
      //0 in -3h
      var t0 = new TzDate(-3, 0);
      expect(t0.getSeconds()).toBe(0);

      //0 in +0h
      var t1 = new TzDate(0, 0);
      expect(t1.getSeconds()).toBe(0);

      //0 in +3h
      var t2 = new TzDate(3, 0);
      expect(t2.getSeconds()).toMatch(0);
    });


    it('should create a date representing new year in Bratislava', function() {
      var newYearInBratislava = new TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(newYearInBratislava.getTimezoneOffset()).toBe(-60);
      expect(newYearInBratislava.getFullYear()).toBe(2010);
      expect(newYearInBratislava.getMonth()).toBe(0);
      expect(newYearInBratislava.getDate()).toBe(1);
      expect(newYearInBratislava.getHours()).toBe(0);
      expect(newYearInBratislava.getMinutes()).toBe(0);
    });


    it('should delegate all the UTC methods to the original UTC Date object', function() {
      //from when created from string
      var date1 = new TzDate(-1, '2009-12-31T23:00:00.000Z');
      expect(date1.getUTCFullYear()).toBe(2009);
      expect(date1.getUTCMonth()).toBe(11);
      expect(date1.getUTCDate()).toBe(31);
      expect(date1.getUTCHours()).toBe(23);
      expect(date1.getUTCMinutes()).toBe(0);
      expect(date1.getUTCSeconds()).toBe(0);


      //from when created from millis
      var date2 = new TzDate(-1, angular.String.toDate('2009-12-31T23:00:00.000Z').getTime());
      expect(date2.getUTCFullYear()).toBe(2009);
      expect(date2.getUTCMonth()).toBe(11);
      expect(date2.getUTCDate()).toBe(31);
      expect(date2.getUTCHours()).toBe(23);
      expect(date2.getUTCMinutes()).toBe(0);
      expect(date2.getUTCSeconds()).toBe(0);
    });


    it('should throw error when no third param but toString called', function() {
      expect(function() { new TzDate(0,0).toString(); }).
                           toThrow('Method \'toString\' is not implemented in the TzDate mock');
    });
  });

  describe('$log mock', function() {
    var $log;
    beforeEach(function() {
      $log = MockLogFactory();
    });

    it('should provide log method', function() {
      expect(function() { $log.log(''); }).not.toThrow();
    });

    it('should provide info method', function() {
      expect(function() { $log.info(''); }).not.toThrow();
    });

    it('should provide warn method', function() {
      expect(function() { $log.warn(''); }).not.toThrow();
    });

    it('should provide error method', function() {
      expect(function() { $log.error(''); }).not.toThrow();
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
  });

  describe('defer', function() {
    var browser, log;
    beforeEach(function() {
      browser = new MockBrowser();
      log = '';
    });

    function logFn(text){ return function() {
        log += text +';';
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
  });


  describe('$exceptionHandler', function() {
    it('should rethrow exceptions', function() {
      var rootScope = angular.scope(),
          exHandler = rootScope.$service('$exceptionHandler');

      expect(function() { exHandler('myException'); }).toThrow('myException');
    });
  });
});
