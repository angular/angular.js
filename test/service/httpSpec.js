'use strict';

// TODO(vojta): refactor these tests to use new inject() syntax
describe('$http', function() {

  var $http, $browser, $exceptionHandler, $httpBackend,
      scope, callback, future, callback;

  beforeEach(inject(function($injector) {
    $injector.get('$exceptionHandlerProvider').mode('log');
    scope = $injector.get('$rootScope');
    $http = $injector.get('$http');
    $browser = $injector.get('$browser');
    $httpBackend = $injector.get('$httpBackend');
    $exceptionHandler = $injector.get('$exceptionHandler');
    spyOn(scope, '$apply');
    callback = jasmine.createSpy('callback');
  }));

  afterEach(function() {
    if ($exceptionHandler.errors.length) throw $exceptionHandler.errors;
    $httpBackend.verifyExpectations();
  });


  it('should do basic request', function() {
    $httpBackend.expect('GET', '/url').respond('');
    $http({url: '/url', method: 'GET'});
  });


  it('should pass data if specified', function() {
    $httpBackend.expect('POST', '/url', 'some-data').respond('');
    $http({url: '/url', method: 'POST', data: 'some-data'});
  });


  // TODO(vojta): test passing timeout


  describe('callbacks', function() {

    function throwing(name) {
      return function() {
        throw name;
      };
    }

    it('should log exceptions', function() {
      $httpBackend.expect('GET', '/url1').respond(200, 'content');
      $httpBackend.expect('GET', '/url2').respond(400, '');

      $http({url: '/url1', method: 'GET'}).on('200', throwing('exception in success callback'));
      $http({url: '/url2', method: 'GET'}).on('400', throwing('exception in error callback'));
      $httpBackend.flush();

      expect($exceptionHandler.errors.shift()).toContain('exception in success callback');
      expect($exceptionHandler.errors.shift()).toContain('exception in error callback');
    });


    it('should log more exceptions', function() {
      $httpBackend.expect('GET', '/url').respond(500, '');
      $http({url: '/url', method: 'GET'})
        .on('500', throwing('exception in error callback'))
        .on('5xx', throwing('exception in error callback'));
      $httpBackend.flush();

      expect($exceptionHandler.errors.length).toBe(2);
      $exceptionHandler.errors = [];
    });


    it('should get response as first param', function() {
      $httpBackend.expect('GET', '/url').respond('some-content');
      $http({url: '/url', method: 'GET'}).on('200', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('some-content');
    });


    it('should get status code as second param', function() {
      $httpBackend.expect('GET', '/url').respond(250, 'some-content');
      $http({url: '/url', method: 'GET'}).on('2xx', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[1]).toBe(250);
    });
  });


  describe('response headers', function() {

    it('should return single header', function() {
      $httpBackend.expect('GET', '/url').respond('', {'date': 'date-val'});
      callback.andCallFake(function(r, s, header) {
        expect(header('date')).toBe('date-val');
      });

      $http({url: '/url', method: 'GET'}).on('200', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return null when single header does not exist', function() {
      $httpBackend.expect('GET', '/url').respond('', {'Some-Header': 'Fake'});
      callback.andCallFake(function(r, s, header) {
        header(); // we need that to get headers parsed first
        expect(header('nothing')).toBe(null);
      });

      $http({url: '/url', method: 'GET'}).on('200', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return all headers as object', function() {
      $httpBackend.expect('GET', '/url').respond('', {'content-encoding': 'gzip', 'server': 'Apache'});
      callback.andCallFake(function(r, s, header) {
        expect(header()).toEqual({'content-encoding': 'gzip', 'server': 'Apache'});
      });

      $http({url: '/url', method: 'GET'}).on('200', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return empty object for jsonp request', function() {
      callback.andCallFake(function(r, s, headers) {
        expect(headers()).toEqual({});
      });

      $httpBackend.expect('JSONP', '/some').respond(200);
      $http({url: '/some', method: 'JSONP'}).on('200', callback);
      $httpBackend.flush();
      expect(callback).toHaveBeenCalledOnce();
    });
  });


  describe('response headers parser', function() {

    it('should parse basic', function() {
      var parsed = parseHeaders(
          'date: Thu, 04 Aug 2011 20:23:08 GMT\n' +
          'content-encoding: gzip\n' +
          'transfer-encoding: chunked\n' +
          'x-cache-info: not cacheable; response has already expired, not cacheable; response has already expired\n' +
          'connection: Keep-Alive\n' +
          'x-backend-server: pm-dekiwiki03\n' +
          'pragma: no-cache\n' +
          'server: Apache\n' +
          'x-frame-options: DENY\n' +
          'content-type: text/html; charset=utf-8\n' +
          'vary: Cookie, Accept-Encoding\n' +
          'keep-alive: timeout=5, max=1000\n' +
          'expires: Thu: , 19 Nov 1981 08:52:00 GMT\n');

      expect(parsed['date']).toBe('Thu, 04 Aug 2011 20:23:08 GMT');
      expect(parsed['content-encoding']).toBe('gzip');
      expect(parsed['transfer-encoding']).toBe('chunked');
      expect(parsed['keep-alive']).toBe('timeout=5, max=1000');
    });


    it('should parse lines without space after colon', function() {
      expect(parseHeaders('key:value').key).toBe('value');
    });


    it('should trim the values', function() {
      expect(parseHeaders('key:    value ').key).toBe('value');
    });


    it('should allow headers without value', function() {
      expect(parseHeaders('key:').key).toBe('');
    });


    it('should merge headers with same key', function() {
      expect(parseHeaders('key: a\nkey:b\n').key).toBe('a, b');
    });


    it('should normalize keys to lower case', function() {
      expect(parseHeaders('KeY: value').key).toBe('value');
    });


    it('should parse CRLF as delimiter', function() {
      // IE does use CRLF
      expect(parseHeaders('a: b\r\nc: d\r\n')).toEqual({a: 'b', c: 'd'});
      expect(parseHeaders('a: b\r\nc: d\r\n').a).toBe('b');
    });


    it('should parse tab after semi-colon', function() {
      expect(parseHeaders('a:\tbb').a).toBe('bb');
      expect(parseHeaders('a: \tbb').a).toBe('bb');
    });
  });


  describe('request headers', function() {

    it('should send custom headers', function() {
      $httpBackend.expect('GET', '/url', undefined, function(headers) {
        return headers['Custom'] == 'header' && headers['Content-Type'] == 'application/json';
      }).respond('');

      $http({url: '/url', method: 'GET', headers: {
        'Custom': 'header',
        'Content-Type': 'application/json'
      }});

      $httpBackend.flush();
    });


    it('should set default headers for GET request', function() {
      $httpBackend.expect('GET', '/url', undefined, function(headers) {
        return headers['Accept'] == 'application/json, text/plain, */*' &&
               headers['X-Requested-With'] == 'XMLHttpRequest';
      }).respond('');

      $http({url: '/url', method: 'GET', headers: {}});
      $httpBackend.flush();
    });


    it('should set default headers for POST request', function() {
      $httpBackend.expect('POST', '/url', undefined, function(headers) {
        return headers['Accept'] == 'application/json, text/plain, */*' &&
               headers['X-Requested-With'] == 'XMLHttpRequest' &&
               headers['Content-Type'] == 'application/json';
      }).respond('');

      $http({url: '/url', method: 'POST', headers: {}});
      $httpBackend.flush();
    });


    it('should set default headers for PUT request', function() {
      $httpBackend.expect('PUT', '/url', undefined, function(headers) {
        return headers['Accept'] == 'application/json, text/plain, */*' &&
               headers['X-Requested-With'] == 'XMLHttpRequest' &&
               headers['Content-Type'] == 'application/json';
      }).respond('');

      $http({url: '/url', method: 'PUT', headers: {}});
      $httpBackend.flush();
    });


    it('should set default headers for custom HTTP method', function() {
      $httpBackend.expect('FOO', '/url', undefined, function(headers) {
        return headers['Accept'] == 'application/json, text/plain, */*' &&
               headers['X-Requested-With'] == 'XMLHttpRequest';
      }).respond('');

      $http({url: '/url', method: 'FOO', headers: {}});
      $httpBackend.flush();
    });


    it('should override default headers with custom', function() {
      $httpBackend.expect('POST', '/url', undefined, function(headers) {
        return headers['Accept'] == 'Rewritten' &&
               headers['X-Requested-With'] == 'XMLHttpRequest' &&
               headers['Content-Type'] == 'Rewritten';
      }).respond('');

      $http({url: '/url', method: 'POST', headers: {
        'Accept': 'Rewritten',
        'Content-Type': 'Rewritten'
      }});
      $httpBackend.flush();
    });


    it('should set the XSRF cookie into a XSRF header', function() {
      function checkXSRF(secret) {
        return function(headers) {
          return headers['X-XSRF-TOKEN'] == secret;
        };
      }

      $browser.cookies('XSRF-TOKEN', 'secret');
      $httpBackend.expect('GET', '/url', undefined, checkXSRF('secret')).respond('');
      $httpBackend.expect('POST', '/url', undefined, checkXSRF('secret')).respond('');
      $httpBackend.expect('PUT', '/url', undefined, checkXSRF('secret')).respond('');
      $httpBackend.expect('DELETE', '/url', undefined, checkXSRF('secret')).respond('');

      $http({url: '/url', method: 'GET'});
      $http({url: '/url', method: 'POST', headers: {'S-ome': 'Header'}});
      $http({url: '/url', method: 'PUT', headers: {'Another': 'Header'}});
      $http({url: '/url', method: 'DELETE', headers: {}});

      $httpBackend.flush();
    });
  });


  describe('short methods', function() {

    function checkHeader(name, value) {
      return function(headers) {
        return headers[name] == value;
      };
    }

    it('should have get()', function() {
      $httpBackend.expect('GET', '/url').respond('');
      $http.get('/url');
    });


    it('get() should allow config param', function() {
      $httpBackend.expect('GET', '/url', undefined, checkHeader('Custom', 'Header')).respond('');
      $http.get('/url', {headers: {'Custom': 'Header'}});
    });


    it('should have delete()', function() {
      $httpBackend.expect('DELETE', '/url').respond('');
      $http['delete']('/url');
    });


    it('delete() should allow config param', function() {
      $httpBackend.expect('DELETE', '/url', undefined, checkHeader('Custom', 'Header')).respond('');
      $http['delete']('/url', {headers: {'Custom': 'Header'}});
    });


    it('should have head()', function() {
      $httpBackend.expect('HEAD', '/url').respond('');
      $http.head('/url');
    });


    it('head() should allow config param', function() {
      $httpBackend.expect('HEAD', '/url', undefined, checkHeader('Custom', 'Header')).respond('');
      $http.head('/url', {headers: {'Custom': 'Header'}});
    });


    it('should have patch()', function() {
      $httpBackend.expect('PATCH', '/url').respond('');
      $http.patch('/url');
    });


    it('patch() should allow config param', function() {
      $httpBackend.expect('PATCH', '/url', undefined, checkHeader('Custom', 'Header')).respond('');
      $http.patch('/url', {headers: {'Custom': 'Header'}});
    });


    it('should have post()', function() {
      $httpBackend.expect('POST', '/url', 'some-data').respond('');
      $http.post('/url', 'some-data');
    });


    it('post() should allow config param', function() {
      $httpBackend.expect('POST', '/url', 'some-data', checkHeader('Custom', 'Header')).respond('');
      $http.post('/url', 'some-data', {headers: {'Custom': 'Header'}});
    });


    it('should have put()', function() {
      $httpBackend.expect('PUT', '/url', 'some-data').respond('');
      $http.put('/url', 'some-data');
    });


    it('put() should allow config param', function() {
      $httpBackend.expect('PUT', '/url', 'some-data', checkHeader('Custom', 'Header')).respond('');
      $http.put('/url', 'some-data', {headers: {'Custom': 'Header'}});
    });


    it('should have jsonp()', function() {
      $httpBackend.expect('JSONP', '/url').respond('');
      $http.jsonp('/url');
    });


    it('jsonp() should allow config param', function() {
      $httpBackend.expect('JSONP', '/url', undefined, checkHeader('Custom', 'Header')).respond('');
      $http.jsonp('/url', {headers: {'Custom': 'Header'}});
    });
  });


  describe('future', function() {

    describe('abort', function() {

      var future, rawXhrObject;

      beforeEach(function() {
        $httpBackend.when('GET', '/url').then('');
        future = $http({method: 'GET', url: '/url'});
        rawXhrObject = MockXhr.$$lastInstance;
        spyOn(rawXhrObject, 'abort');
      });

      it('should return itself to allow chaining', function() {
        expect(future.abort()).toBe(future);
      });

      it('should allow aborting the request', function() {
        future.abort();

        expect(rawXhrObject.abort).toHaveBeenCalledOnce();
      });


      it('should not abort already finished request', function() {
        $httpBackend.flush();

        future.abort();
        expect(rawXhrObject.abort).not.toHaveBeenCalled();
      });
    });


    describe('retry', function() {

      var future;

      beforeEach(function() {
        $httpBackend.expect('HEAD', '/url-x').respond('');
        future = $http({method: 'HEAD', url: '/url-x'}).on('2xx', callback);
      });

      it('should retry last request with same callbacks', function() {
        $httpBackend.flush();
        callback.reset();

        $httpBackend.expect('HEAD', '/url-x').respond('');
        future.retry();
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should return itself to allow chaining', function() {
        $httpBackend.flush();

        $httpBackend.expect('HEAD', '/url-x').respond('');
        expect(future.retry()).toBe(future);
      });


      it('should throw error when pending request', function() {
        expect(future.retry).toThrow('Can not retry request. Abort pending request first.');
      });
    });


    describe('on', function() {

      var future;

      function expectToMatch(status, pattern) {
        expectToNotMatch(status, pattern, true);
      }

      function expectToNotMatch(status, pattern, match) {
        callback.reset();
        future = $http({method: 'GET', url: '/' + status});
        future.on(pattern, callback);
        $httpBackend.flush();

        if (match) expect(callback).toHaveBeenCalledOnce();
        else expect(callback).not.toHaveBeenCalledOnce();
      }

      beforeEach(function() {
        $httpBackend.when('GET').then(function(m, url) {
          return [parseInt(url.substr(1)), '', {}];
        });
      });

      it('should return itself to allow chaining', function() {
        future = $http({method: 'GET', url: '/url'});
        expect(future.on('200', noop)).toBe(future);
      });


      it('should call exact status code callback', function() {
        expectToMatch(205, '205');
      });


      it('should match 2xx', function() {
        expectToMatch(200, '2xx');
        expectToMatch(201, '2xx');
        expectToMatch(266, '2xx');

        expectToNotMatch(400, '2xx');
        expectToNotMatch(300, '2xx');
      });


      it('should match 20x', function() {
        expectToMatch(200, '20x');
        expectToMatch(201, '20x');
        expectToMatch(205, '20x');

        expectToNotMatch(210, '20x');
        expectToNotMatch(301, '20x');
        expectToNotMatch(404, '20x');
        expectToNotMatch(501, '20x');
      });


      it('should match 2x1', function() {
        expectToMatch(201, '2x1');
        expectToMatch(211, '2x1');
        expectToMatch(251, '2x1');

        expectToNotMatch(210, '2x1');
        expectToNotMatch(301, '2x1');
        expectToNotMatch(400, '2x1');
      });


      it('should match xxx', function() {
        expectToMatch(200, 'xxx');
        expectToMatch(210, 'xxx');
        expectToMatch(301, 'xxx');
        expectToMatch(406, 'xxx');
        expectToMatch(510, 'xxx');
      });


      it('should call all matched callbacks', function() {
        var no = jasmine.createSpy('wrong');
        $http({method: 'GET', url: '/205'})
          .on('xxx', callback)
          .on('2xx', callback)
          .on('205', callback)
          .on('3xx', no)
          .on('2x1', no)
          .on('4xx', no);

        $httpBackend.flush();

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(3);
        expect(no).not.toHaveBeenCalled();
      });


      it('should allow list of status patterns', function() {
        expectToMatch(201, '2xx,3xx');
        expectToMatch(301, '2xx,3xx');
        expectToNotMatch(405, '2xx,3xx');
      });


      it('should preserve the order of listeners', function() {
        var log = '';

        $http({method: 'GET', url: '/201'})
          .on('2xx', function() {log += '1';})
          .on('201', function() {log += '2';})
          .on('2xx', function() {log += '3';});

        $httpBackend.flush();
        expect(log).toBe('123');
      });


      it('should know "success" alias', function() {
        expectToMatch(200, 'success');
        expectToMatch(201, 'success');
        expectToMatch(250, 'success');

        expectToNotMatch(403, 'success');
        expectToNotMatch(501, 'success');
      });


      it('should know "error" alias', function() {
        expectToMatch(401, 'error');
        expectToMatch(500, 'error');
        expectToMatch(0, 'error');

        expectToNotMatch(201, 'error');
        expectToNotMatch(200, 'error');
      });


      it('should know "always" alias', function() {
        expectToMatch(200, 'always');
        expectToMatch(201, 'always');
        expectToMatch(250, 'always');
        expectToMatch(300, 'always');
        expectToMatch(302, 'always');
        expectToMatch(404, 'always');
        expectToMatch(501, 'always');
        expectToMatch(0, 'always');
        expectToMatch(-1, 'always');
        expectToMatch(-2, 'always');
      });


      it('should call "xxx" when 0 status code', function() {
        expectToMatch(0, 'xxx');
      });


      it('should not call "2xx" when 0 status code', function() {
        expectToNotMatch(0, '2xx');
      });

      it('should normalize internal statuses -1, -2 to 0', function() {
        callback.andCallFake(function(response, status) {
          expect(status).toBe(0);
        });

        $http({method: 'GET', url: '/0'}).on('xxx', callback);
        $http({method: 'GET', url: '/-1'}).on('xxx', callback);
        $http({method: 'GET', url: '/-2'}).on('xxx', callback);

        $httpBackend.flush();
        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(3);
      });

      it('should match "timeout" when -1 internal status', function() {
        expectToMatch(-1, 'timeout');
      });

      it('should match "abort" when 0 status', function() {
        expectToMatch(0, 'abort');
      });

      it('should match "error" when 0, -1, or -2', function() {
        expectToMatch(0, 'error');
        expectToMatch(-1, 'error');
        expectToMatch(-2, 'error');
      });
    });
  });


  describe('scope.$apply', function() {

    it('should $apply after success callback', function() {
      $httpBackend.when('GET').then(200);
      $http({method: 'GET', url: '/some'});
      $httpBackend.flush();
      expect(scope.$apply).toHaveBeenCalledOnce();
    });


    it('should $apply after error callback', function() {
      $httpBackend.when('GET').then(404);
      $http({method: 'GET', url: '/some'});
      $httpBackend.flush();
      expect(scope.$apply).toHaveBeenCalledOnce();
    });


    it('should $apply even if exception thrown during callback', function() {
      $httpBackend.when('GET').then(200);
      callback.andThrow('error in callback');

      $http({method: 'GET', url: '/some'}).on('200', callback);
      $httpBackend.flush();
      expect(scope.$apply).toHaveBeenCalledOnce();

      $exceptionHandler.errors = [];
    });
  });


  describe('transform', function() {

    describe('request', function() {

      describe('default', function() {

        it('should transform object into json', function() {
          $httpBackend.expect('POST', '/url', '{"one":"two"}').respond('');
          $http({method: 'POST', url: '/url', data: {one: 'two'}});
        });


        it('should ignore strings', function() {
          $httpBackend.expect('POST', '/url', 'string-data').respond('');
          $http({method: 'POST', url: '/url', data: 'string-data'});
        });
      });
    });


    describe('response', function() {

      describe('default', function() {

        it('should deserialize json objects', function() {
          $httpBackend.expect('GET', '/url').respond('{"foo":"bar","baz":23}');
          $http({method: 'GET', url: '/url'}).on('200', callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual({foo: 'bar', baz: 23});
        });


        it('should deserialize json arrays', function() {
          $httpBackend.expect('GET', '/url').respond('[1, "abc", {"foo":"bar"}]');
          $http({method: 'GET', url: '/url'}).on('200', callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual([1, 'abc', {foo: 'bar'}]);
        });


        it('should deserialize json with security prefix', function() {
          $httpBackend.expect('GET', '/url').respond(')]}\',\n[1, "abc", {"foo":"bar"}]');
          $http({method: 'GET', url: '/url'}).on('200', callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual([1, 'abc', {foo:'bar'}]);
        });


        it('should deserialize json with security prefix ")]}\'"', function() {
          $httpBackend.expect('GET', '/url').respond(')]}\'\n\n[1, "abc", {"foo":"bar"}]');
          $http({method: 'GET', url: '/url'}).on('200', callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual([1, 'abc', {foo:'bar'}]);
        });
      });


      it('should pipeline more functions', function() {
        function first(d) {return d + '1';}
        function second(d) {return d + '2';}

        $httpBackend.expect('POST', '/url').respond('0');
        $http({method: 'POST', url: '/url', transformResponse: [first, second]})
          .on('200', callback);
        $httpBackend.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.mostRecentCall.args[0]).toBe('012');
      });
    });
  });


  describe('cache', function() {

    function doFirstCacheRequest(method, respStatus, headers) {
      $httpBackend.expect(method || 'GET', '/url').respond(respStatus || 200, 'content', headers);
      $http({method: method || 'GET', url: '/url', cache: true});
      $httpBackend.flush();
    }

    it('should cache GET request', function() {
      doFirstCacheRequest();

      $http({method: 'get', url: '/url', cache: true}).on('200', callback);
      $browser.defer.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content');
    });


    it('should always call callback asynchronously', function() {
      doFirstCacheRequest();
      $http({method: 'get', url: '/url', cache: true}).on('200', callback);

      expect(callback).not.toHaveBeenCalledOnce();
    });


    it('should not cache POST request', function() {
      doFirstCacheRequest('POST');

      $httpBackend.expect('POST', '/url').respond('content2');
      $http({method: 'POST', url: '/url', cache: true}).on('200', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content2');
    });


    it('should not cache PUT request', function() {
      doFirstCacheRequest('PUT');

      $httpBackend.expect('PUT', '/url').respond('content2');
      $http({method: 'PUT', url: '/url', cache: true}).on('200', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content2');
    });


    it('should not cache DELETE request', function() {
      doFirstCacheRequest('DELETE');

      $httpBackend.expect('DELETE', '/url').respond(206);
      $http({method: 'DELETE', url: '/url', cache: true}).on('206', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should not cache non 2xx responses', function() {
      doFirstCacheRequest('GET', 404);

      $httpBackend.expect('GET', '/url').respond('content2');
      $http({method: 'GET', url: '/url', cache: true}).on('200', callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content2');
    });


    it('should cache the headers as well', function() {
      doFirstCacheRequest('GET', 200, {'content-encoding': 'gzip', 'server': 'Apache'});
      callback.andCallFake(function(r, s, headers) {
        expect(headers()).toEqual({'content-encoding': 'gzip', 'server': 'Apache'});
        expect(headers('server')).toBe('Apache');
      });

      $http({method: 'GET', url: '/url', cache: true}).on('200', callback);
      $browser.defer.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should cache status code as well', function() {
      doFirstCacheRequest('GET', 201);
      callback.andCallFake(function(r, status, h) {
        expect(status).toBe(201);
      });

      $http({method: 'get', url: '/url', cache: true}).on('2xx', callback);
      $browser.defer.flush();
      expect(callback).toHaveBeenCalledOnce();
    });
  });


  describe('pendingRequests', function() {

    it('should be an array of pending requests', function() {
      $httpBackend.when('GET').then(200);
      expect($http.pendingRequests.length).toBe(0);

      $http({method: 'get', url: '/some'});
      expect($http.pendingRequests.length).toBe(1);

      $httpBackend.flush();
      expect($http.pendingRequests.length).toBe(0);
    });


    it('should remove the request when aborted', function() {
      $httpBackend.when('GET').then(0);
      future = $http({method: 'get', url: '/x'});
      expect($http.pendingRequests.length).toBe(1);

      future.abort();
      $httpBackend.flush();

      expect($http.pendingRequests.length).toBe(0);
    });


    it('should remove the request when served from cache', function() {
      $httpBackend.when('GET').then(200);

      $http({method: 'get', url: '/cached', cache: true});
      $httpBackend.flush();
      expect($http.pendingRequests.length).toBe(0);

      $http({method: 'get', url: '/cached', cache: true});
      expect($http.pendingRequests.length).toBe(1);

      $browser.defer.flush();
      expect($http.pendingRequests.length).toBe(0);
    });


    it('should remove the request before firing callbacks', function() {
      $httpBackend.when('GET').then(200);
      $http({method: 'get', url: '/url'}).on('xxx', function() {
        expect($http.pendingRequests.length).toBe(0);
      });

      expect($http.pendingRequests.length).toBe(1);
      $httpBackend.flush();
    });
  });
});
