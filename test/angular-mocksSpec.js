'use strict';

describe('mocks', function() {

  describe('$browser', function() {
    var $browser;

    beforeEach(function() {
      $browser = new MockBrowser();
    });

    describe('addJs', function() {

      it('should store url, id, done', function() {
        var url  = 'some.js',
            id   = 'js-id',
            done = noop;

        $browser.addJs(url, id, done);

        var script = $browser.$$scripts.shift();
        expect(script.url).toBe(url);
        expect(script.id).toBe(id);
        expect(script.done).toBe(done);
      });


      it('should return the script object', function() {
        expect($browser.addJs('some.js', null, noop)).toBe($browser.$$scripts[0]);
      });
    });
  });


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


  describe('$httpBackend', function() {
    var hb, callback;

    beforeEach(function() {
      hb = createMockHttpBackend();
      callback = jasmine.createSpy('callback');
    });


    it('should respond with first matched definition', function() {
      hb.when('GET', '/url1').then(200, 'content', {});
      hb.when('GET', '/url1').then(201, 'another', {});

      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('content');
      });

      hb('GET', '/url1', null, callback);
      expect(callback).not.toHaveBeenCalled();
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should throw error when unexpected request', function() {
      hb.when('GET', '/url1').then(200, 'content');
      expect(function() {
        hb('GET', '/xxx');
      }).toThrow('Unexpected request: GET /xxx');
    });


    it('should match headers if specified', function() {
      hb.when('GET', '/url', null, {'X': 'val1'}).then(201, 'content1');
      hb.when('GET', '/url', null, {'X': 'val2'}).then(202, 'content2');
      hb.when('GET', '/url').then(203, 'content3');

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
      hb.when('GET', '/a/b', '{a: true}').then(201, 'content1');
      hb.when('GET', '/a/b').then(202, 'content2');

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


    it('should match only method', function() {
      hb.when('GET').then(202, 'c');
      callback.andCallFake(function(status, response) {
        expect(status).toBe(202);
        expect(response).toBe('c');
      });

      hb('GET', '/some', null, callback, {});
      hb('GET', '/another', null, callback, {'X-Fake': 'Header'});
      hb('GET', '/third', 'some-data', callback, {});
      hb.flush();

      expect(callback).toHaveBeenCalled();
    });


    it('should expose given headers', function() {
      hb.when('GET', '/u1').then(200, null, {'X-Fake': 'Header', 'Content-Type': 'application/json'});
      var xhr = hb('GET', '/u1', null, noop, {});
      hb.flush();
      expect(xhr.getResponseHeader('X-Fake')).toBe('Header');
      expect(xhr.getAllResponseHeaders()).toBe('X-Fake: Header\nContent-Type: application/json');
    });


    it('should preserve the order of requests', function() {
      hb.when('GET', '/url1').then(200, 'first');
      hb.when('GET', '/url2').then(201, 'second');

      hb('GET', '/url2', null, callback);
      hb('GET', '/url1', null, callback);

      hb.flush();

      expect(callback.callCount).toBe(2);
      expect(callback.argsForCall[0]).toEqual([201, 'second']);
      expect(callback.argsForCall[1]).toEqual([200, 'first']);
    });


    it('then() should take function', function() {
      hb.when('GET', '/some').then(function(m, u, d, h) {
        return [301, m + u + ';' + d + ';' + toKeyValue(h), {'Connection': 'keep-alive'}];
      });

      var xhr = hb('GET', '/some', 'data', callback, {a: 'b'});
      hb.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe(301);
      expect(callback.mostRecentCall.args[1]).toBe('GET/some;data;a=b');
      expect(xhr.getResponseHeader('Connection')).toBe('keep-alive');
    });


    it('expect() should require specified order', function() {
      hb.expect('GET', '/url1').respond(200, '');
      hb.expect('GET', '/url2').respond(200, '');

      expect(function() {
        hb('GET', '/url2', null, noop, {});
      }).toThrow('Unexpected request: GET /url2');
    });


    it('expect() should have precendence over when()', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(300);
        expect(response).toBe('expect');
      });

      hb.when('GET', '/url').then(200, 'when');
      hb.expect('GET', '/url').respond(300, 'expect');

      hb('GET', '/url', null, callback, {});
      hb.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it ('should throw exception when only headers differes from expectation', function() {
      hb.when('GET').then(200, '', {});
      hb.expect('GET', '/match', undefined, {'Content-Type': 'application/json'});

      expect(function() {
        hb('GET', '/match', null, noop, {});
      }).toThrow('Expected GET /match with different headers');
    });


    it ('should throw exception when only data differes from expectation', function() {
      hb.when('GET').then(200, '', {});
      hb.expect('GET', '/match', 'some-data');

      expect(function() {
        hb('GET', '/match', 'different', noop, {});
      }).toThrow('Expected GET /match with different data');
    });


    it('expect() should without respond() and use then()', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(201);
        expect(response).toBe('data');
      });

      hb.when('GET', '/some').then(201, 'data');
      hb.expect('GET', '/some');
      hb('GET', '/some', null, callback);
      hb.flush();

      expect(callback).toHaveBeenCalled();
      expect(function() { hb.verifyExpectations(); }).not.toThrow();
    });


    it('flush() should not flush requests fired during callbacks', function() {
      // regression
      hb.when('GET').then(200, '');
      hb('GET', '/some', null, function() {
        hb('GET', '/other', null, callback);
      });

      hb.flush();
      expect(callback).not.toHaveBeenCalled();
    });


    it('respond() should set default status 200 if not defined', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('some-data');
      });

      hb.expect('GET', '/url1').respond('some-data');
      hb.expect('GET', '/url2').respond('some-data', {'X-Header': 'true'});
      hb('GET', '/url1', null, callback);
      hb('GET', '/url2', null, callback);
      hb.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.callCount).toBe(2);
    });


    it('then() should set default status 200 if not defined', function() {
      callback.andCallFake(function(status, response) {
        expect(status).toBe(200);
        expect(response).toBe('some-data');
      });

      hb.when('GET', '/url1').then('some-data');
      hb.when('GET', '/url2').then('some-data', {'X-Header': 'true'});
      hb('GET', '/url1', null, callback);
      hb('GET', '/url2', null, callback);
      hb.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.callCount).toBe(2);
    });


    it('should respond undefined when JSONP method', function() {
      hb.when('JSONP', '/url1').then(200);
      hb.expect('JSONP', '/url2').respond(200);

      expect(hb('JSONP', '/url1')).toBeUndefined();
      expect(hb('JSONP', '/url2')).toBeUndefined();
    });


    describe('verify', function() {

      it('should throw exception if not all expectations were satisfied', function() {
        hb.expect('POST', '/u1', 'ddd').respond(201, '', {});
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});

        hb('POST', '/u1', 'ddd', noop, {});

        expect(function() {hb.verifyExpectations();})
          .toThrow('Unsatisfied requests: GET /u2, POST /u3');
      });


      it('should do nothing when no expectation', function() {
        hb.when('DELETE', '/some').then(200, '');

        expect(function() {hb.verifyExpectations();}).not.toThrow();
      });


      it('should do nothing when all expectations satisfied', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.when('DELETE', '/some').then(200, '');

        hb('GET', '/u2', noop);
        hb('POST', '/u3', noop);

        expect(function() {hb.verifyExpectations();}).not.toThrow();
      });
    });


    describe('reset', function() {

      it('should remove all expectations', function() {
        hb.expect('GET', '/u2').respond(200, '', {});
        hb.expect('POST', '/u3').respond(201, '', {});
        hb.resetExpectations();

        expect(function() {hb.verifyExpectations();}).not.toThrow();
      });


      it('should remove all responses', function() {
        hb.expect('GET', '/url').respond(200, '', {});
        hb('GET', '/url', null, callback, {});
        hb.resetExpectations();
        hb.flush();

        expect(callback).not.toHaveBeenCalled();
      });
    });


    describe('MockHttpExpectation', function() {

      it('should accept url as regexp', function() {
        var exp = new MockHttpExpectation('GET', /^\/x/);

        expect(exp.match('GET', '/x')).toBe(true);
        expect(exp.match('GET', '/xxx/x')).toBe(true);
        expect(exp.match('GET', 'x')).toBe(false);
        expect(exp.match('GET', 'a/x')).toBe(false);
      });


      it('should accept data as regexp', function() {
        var exp = new MockHttpExpectation('POST', '/url', /\{.*?\}/);

        expect(exp.match('POST', '/url', '{"a": "aa"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one": "two"}')).toBe(true);
        expect(exp.match('POST', '/url', '{"one"')).toBe(false);
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
          return h['Content-Type'] == 'application/json';
        });

        expect(exp.matchHeaders({})).toBe(false);
        expect(exp.matchHeaders({'Content-Type': 'application/json', 'X-Another': 'true'})).toBe(true);
      });
    });
  });
});
