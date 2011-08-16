'use strict';

describe('mocks', function(){
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


    it('should fake toString method when a third param is passed in', function() {
      var t = new TzDate(0, 0, 'Mon Sep 3 2010 17:05:08 GMT+0500 (XYZ)');
      expect(t.toString()).toBe('Mon Sep 3 2010 17:05:08 GMT+0500 (XYZ)');
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

  describe('defer', function(){
    var browser, log;
    beforeEach(function(){
      browser = new MockBrowser();
      log = '';
    });

    function logFn(text){ return function(){
        log += text +';';
      };
    }

    it('should flush', function(){
      browser.defer(logFn('A'));
      expect(log).toEqual('');
      browser.defer.flush();
      expect(log).toEqual('A;');
    });

    it('should flush delayed', function(){
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

    it('should defer and flush over time', function(){
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


  ddescribe('$xhrBackend', function() {
    var xb, callback;

    beforeEach(function() {
      xb = new MockXhrBackend();
      callback = jasmine.createSpy();
    });


    it('should respond with first matched definition', function() {
      xb.when('GET', '/url1').then(200, 'content', {});
      xb.when('GET', '/url1').then(201, 'another', {});

      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('content');
      });

      xb.xhr('GET', '/url1', null, callback);
      expect(callback).not.toHaveBeenCalled();
      xb.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should throw error when unexpected request', function() {
      xb.when('GET', '/url1').then(200, 'content');
      expect(function() {
        xb.xhr('GET', '/xxx');
      }).toThrow('Unexpected request GET "/xxx"');
    });


    it('should match headers if specified', function() {
      // should equal ? or just check only defined headers ?
      xb.when('GET', '/url', null, {'X': 'val1'}).then(201, 'content1');
      xb.when('GET', '/url', null, {'X': 'val2'}).then(202, 'content2');
      xb.when('GET', '/url').then(203, 'content3');

      xb.xhr('GET', '/url', null, function(status, response) {
        expect(status).toBe(203);
        expect(response).toBe('content3');
      });

      xb.xhr('GET', '/url', null, function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      }, {'X': 'val1'});

      xb.xhr('GET', '/url', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      }, {'X': 'val2'});

      xb.flush();
    });

    it('should match data if specified', function() {
      xb.when('GET', '/a/b', {a: true}).then(201, 'content1');
      xb.when('GET', '/a/b').then(202, 'content2');

      xb.xhr('GET', '/a/b', {a: true}, function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('content1');
      });

      xb.xhr('GET', '/a/b', null, function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('content2');
      });

      xb.flush();
    });


    it('should match only method', function() {
      xb.when('GET').then(202, 'c');
      callback.andCallFake(function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('c');
      });

      xb.xhr('GET', '/some', null, callback, {});
      xb.xhr('GET', '/another', null, callback, {'X-Fake': 'Header'});
      xb.xhr('GET', '/third', 'some-data', callback, {});
      xb.flush();

      expect(callback).toHaveBeenCalled();
    });

    it('should expose given headers', function() {
      xb.when('GET', '/u1').then(200, null, {'X-Fake': 'Header', 'Content-Type': 'application/json'});
      var xhr = xb.xhr('GET', '/u1', null, noop, {});
      xb.flush();
      expect(xhr.getResponseHeader('X-Fake')).toBe('Header');
      expect(xhr.getAllResponseHeaders()).toBe('X-Fake: Header\nContent-Type: application/json');
    });

    it('should preserve the order of requests', function() {
      xb.when('GET', '/url1').then(200, 'first');
      xb.when('GET', '/url2').then(201, 'second');

      xb.xhr('GET', '/url2', null, callback);
      xb.xhr('GET', '/url1', null, callback);

      xb.flush();

      expect(callback.callCount).toBe(2);
      expect(callback.argsForCall[0]).toEqual([201, 'second']);
      expect(callback.argsForCall[1]).toEqual([200, 'first']);
    });

    it('then() should take function', function() {
      xb.when('GET', '/some').then(function(m, u, d, h) {
        return [301, m + u + ';' + d + ';' + toKeyValue(h), {'Connection': 'keep-alive'}];
      });

      var xhr = xb.xhr('GET', '/some', 'data', callback, {a: 'b'});
      xb.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe(301);
      expect(callback.mostRecentCall.args[1]).toBe('GET/some;data;a=b');
      expect(xhr.getResponseHeader('Connection')).toBe('keep-alive');
    });
  });
});
