'use strict';

describe('$http', function() {
  var $rootScope, $http, $httpBackend, callback;

  beforeEach(inject(
    function($exceptionHandlerProvider) {
      $exceptionHandlerProvider.mode('log');
    },
    ['$rootScope', '$http', '$httpBackend', function($rs, $h, $hb) {
      $rootScope = $rs;
      $http = $h;
      $httpBackend = $hb;

      spyOn($rootScope, '$apply').andCallThrough();
      callback = jasmine.createSpy('done');
    }]
  ));


  afterEach(inject(function($exceptionHandler, $httpBackend) {
    forEach($exceptionHandler.errors, function(e) {
      dump('Unhandled exception: ', e)
    });

    if ($exceptionHandler.errors.length) {
      throw 'Unhandled exceptions trapped in $exceptionHandler!';
    }

    $httpBackend.verifyNoOutstandingExpectation();
  }));


  describe('$httpProvider', function() {

    describe('interceptors', function() {

      it('should default to an empty array', inject(function($httpProvider) {
        expect($httpProvider.responseInterceptors).toEqual([]);
      }));


      it('should pass the responses through interceptors', inject(function($httpProvider, $q) {
        // just change the response data and pass the response object along
        $httpProvider.responseInterceptors.push(function(httpPromise) {
          return httpPromise.then(function(response) {
            response.data += '!';
            return response;
          });
        });

        // return a new resolved promise representing modified response object
        $httpProvider.responseInterceptors.push(function(httpPromise) {
          return httpPromise.then(function(response) {
            var deferred = $q.defer();
            deferred.resolve({
              data: response.data + '?',
              status: 209,
              headers: response.headers,
              config: response.config
            });
            return deferred.promise;
          });
        });
      }, function($http, $httpBackend) {
        $httpBackend.expect('GET', '/foo').respond(201, 'Hello');
        $http.get('/foo').success(function(data, status) {
          expect(data).toBe('Hello!?');
          expect(status).toBe(209);
          callback();
        })
        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
      }));
    });
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

    it('should pass in the response object when a request is successful', function() {
      $httpBackend.expect('GET', '/url').respond(207, 'my content', {'content-encoding': 'smurf'});
      $http({url: '/url', method: 'GET'}).then(function(response) {
        expect(response.data).toBe('my content');
        expect(response.status).toBe(207);
        expect(response.headers()).toEqual({'content-encoding': 'smurf'});
        expect(response.config.url).toBe('/url');
        callback();
      });

      $httpBackend.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    it('should pass in the response object when a request failed', function() {
      $httpBackend.expect('GET', '/url').respond(543, 'bad error', {'request-id': '123'});
      $http({url: '/url', method: 'GET'}).then(null, function(response) {
        expect(response.data).toBe('bad error');
        expect(response.status).toBe(543);
        expect(response.headers()).toEqual({'request-id': '123'});
        expect(response.config.url).toBe('/url');
        callback();
      });

      $httpBackend.flush();
      expect(callback).toHaveBeenCalledOnce();
    });


    describe('success', function() {
      it('should allow http specific callbacks to be registered via "success"', function() {
        $httpBackend.expect('GET', '/url').respond(207, 'my content', {'content-encoding': 'smurf'});
        $http({url: '/url', method: 'GET'}).success(function(data, status, headers, config) {
          expect(data).toBe('my content');
          expect(status).toBe(207);
          expect(headers()).toEqual({'content-encoding': 'smurf'});
          expect(config.url).toBe('/url');
          callback();
        });

        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should return the original http promise', function() {
        $httpBackend.expect('GET', '/url').respond(207, 'my content', {'content-encoding': 'smurf'});
        var httpPromise = $http({url: '/url', method: 'GET'});
        expect(httpPromise.success(callback)).toBe(httpPromise);
      });
    });


    describe('error', function() {
      it('should allow http specific callbacks to be registered via "error"', function() {
        $httpBackend.expect('GET', '/url').respond(543, 'bad error', {'request-id': '123'});
        $http({url: '/url', method: 'GET'}).error(function(data, status, headers, config) {
          expect(data).toBe('bad error');
          expect(status).toBe(543);
          expect(headers()).toEqual({'request-id': '123'});
          expect(config.url).toBe('/url');
          callback();
        });

        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should return the original http promise', function() {
        $httpBackend.expect('GET', '/url').respond(543, 'bad error', {'request-id': '123'});
        var httpPromise = $http({url: '/url', method: 'GET'});
        expect(httpPromise.error(callback)).toBe(httpPromise);
      });
    });
  });


  describe('response headers', function() {

    it('should return single header', function() {
      $httpBackend.expect('GET', '/url').respond('', {'date': 'date-val'});
      callback.andCallFake(function(r) {
        expect(r.headers('date')).toBe('date-val');
      });

      $http({url: '/url', method: 'GET'}).then(callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return null when single header does not exist', function() {
      $httpBackend.expect('GET', '/url').respond('', {'Some-Header': 'Fake'});
      callback.andCallFake(function(r) {
        r.headers(); // we need that to get headers parsed first
        expect(r.headers('nothing')).toBe(null);
      });

      $http({url: '/url', method: 'GET'}).then(callback)
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return all headers as object', function() {
      $httpBackend.expect('GET', '/url').respond('', {
        'content-encoding': 'gzip',
        'server': 'Apache'
      });

      callback.andCallFake(function(r) {
        expect(r.headers()).toEqual({'content-encoding': 'gzip', 'server': 'Apache'});
      });

      $http({url: '/url', method: 'GET'}).then(callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return empty object for jsonp request', function() {
      callback.andCallFake(function(r) {
        expect(r.headers()).toEqual({});
      });

      $httpBackend.expect('JSONP', '/some').respond(200);
      $http({url: '/some', method: 'JSONP'}).then(callback);
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


    it('should set the XSRF cookie into a XSRF header', inject(function($browser) {
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
    }));
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


  describe('scope.$apply', function() {

    it('should $apply after success callback', function() {
      $httpBackend.when('GET').respond(200);
      $http({method: 'GET', url: '/some'});
      $httpBackend.flush();
      expect($rootScope.$apply).toHaveBeenCalledOnce();
    });


    it('should $apply after error callback', function() {
      $httpBackend.when('GET').respond(404);
      $http({method: 'GET', url: '/some'});
      $httpBackend.flush();
      expect($rootScope.$apply).toHaveBeenCalledOnce();
    });


    it('should $apply even if exception thrown during callback', inject(function($exceptionHandler){
      $httpBackend.when('GET').respond(200);
      callback.andThrow('error in callback');

      $http({method: 'GET', url: '/some'}).then(callback);
      $httpBackend.flush();
      expect($rootScope.$apply).toHaveBeenCalledOnce();

      $exceptionHandler.errors = [];
    }));
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
          $http({method: 'GET', url: '/url'}).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual({foo: 'bar', baz: 23});
        });


        it('should deserialize json arrays', function() {
          $httpBackend.expect('GET', '/url').respond('[1, "abc", {"foo":"bar"}]');
          $http({method: 'GET', url: '/url'}).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual([1, 'abc', {foo: 'bar'}]);
        });


        it('should deserialize json with security prefix', function() {
          $httpBackend.expect('GET', '/url').respond(')]}\',\n[1, "abc", {"foo":"bar"}]');
          $http({method: 'GET', url: '/url'}).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual([1, 'abc', {foo:'bar'}]);
        });


        it('should deserialize json with security prefix ")]}\'"', function() {
          $httpBackend.expect('GET', '/url').respond(')]}\'\n\n[1, "abc", {"foo":"bar"}]');
          $http({method: 'GET', url: '/url'}).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual([1, 'abc', {foo:'bar'}]);
        });


        it('should not deserialize tpl beginning with ng expression', function() {
          $httpBackend.expect('GET', '/url').respond('{{some}}');
          $http.get('/url').success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toEqual('{{some}}');
        });
      });


      it('should pipeline more functions', function() {
        function first(d) {return d + '1';}
        function second(d) {return d + '2';}

        $httpBackend.expect('POST', '/url').respond('0');
        $http({method: 'POST', url: '/url', transformResponse: [first, second]}).success(callback);
        $httpBackend.flush();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.mostRecentCall.args[0]).toBe('012');
      });
    });
  });


  describe('cache', function() {

    var cache;

    beforeEach(inject(function($cacheFactory) {
      cache = $cacheFactory('testCache');
    }));

    function doFirstCacheRequest(method, respStatus, headers) {
      $httpBackend.expect(method || 'GET', '/url').respond(respStatus || 200, 'content', headers);
      $http({method: method || 'GET', url: '/url', cache: cache});
      $httpBackend.flush();
    }

    it('should cache GET request when cache is provided', inject(function($browser) {
      doFirstCacheRequest();

      $http({method: 'get', url: '/url', cache: cache}).success(callback);
      $browser.defer.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content');
    }));


    it('should not cache when cache is not provided', function() {
      doFirstCacheRequest();

      $httpBackend.expect('GET', '/url').respond();
      $http({method: 'GET', url: '/url'});
    });


    it('should perform request when cache cleared', function() {
      doFirstCacheRequest();

      cache.removeAll();
      $httpBackend.expect('GET', '/url').respond();
      $http({method: 'GET', url: '/url', cache: cache});
    });


    it('should always call callback asynchronously', function() {
      doFirstCacheRequest();
      $http({method: 'get', url: '/url', cache: cache}).then(callback);

      expect(callback).not.toHaveBeenCalled();
    });


    it('should not cache POST request', function() {
      doFirstCacheRequest('POST');

      $httpBackend.expect('POST', '/url').respond('content2');
      $http({method: 'POST', url: '/url', cache: cache}).success(callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content2');
    });


    it('should not cache PUT request', function() {
      doFirstCacheRequest('PUT');

      $httpBackend.expect('PUT', '/url').respond('content2');
      $http({method: 'PUT', url: '/url', cache: cache}).success(callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content2');
    });


    it('should not cache DELETE request', function() {
      doFirstCacheRequest('DELETE');

      $httpBackend.expect('DELETE', '/url').respond(206);
      $http({method: 'DELETE', url: '/url', cache: cache}).success(callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should not cache non 2xx responses', function() {
      doFirstCacheRequest('GET', 404);

      $httpBackend.expect('GET', '/url').respond('content2');
      $http({method: 'GET', url: '/url', cache: cache}).success(callback);
      $httpBackend.flush();

      expect(callback).toHaveBeenCalledOnce();
      expect(callback.mostRecentCall.args[0]).toBe('content2');
    });


    it('should cache the headers as well', inject(function($browser) {
      doFirstCacheRequest('GET', 200, {'content-encoding': 'gzip', 'server': 'Apache'});
      callback.andCallFake(function(r, s, headers) {
        expect(headers()).toEqual({'content-encoding': 'gzip', 'server': 'Apache'});
        expect(headers('server')).toBe('Apache');
      });

      $http({method: 'GET', url: '/url', cache: cache}).success(callback);
      $browser.defer.flush();
      expect(callback).toHaveBeenCalledOnce();
    }));


    it('should cache status code as well', inject(function($browser) {
      doFirstCacheRequest('GET', 201);
      callback.andCallFake(function(r, status, h) {
        expect(status).toBe(201);
      });

      $http({method: 'get', url: '/url', cache: cache}).success(callback);
      $browser.defer.flush();
      expect(callback).toHaveBeenCalledOnce();
    }));


    it('should use cache even if request fired before first response is back', function() {
      $httpBackend.expect('GET', '/url').respond(201, 'fake-response');

      callback.andCallFake(function(response, status, headers) {
        expect(response).toBe('fake-response');
        expect(status).toBe(201);
      });

      $http({method: 'GET', url: '/url', cache: cache}).success(callback);
      $http({method: 'GET', url: '/url', cache: cache}).success(callback);

      $httpBackend.flush();
      expect(callback).toHaveBeenCalled();
      expect(callback.callCount).toBe(2);
    });
  });


  describe('pendingRequests', function() {

    it('should be an array of pending requests', function() {
      $httpBackend.when('GET').respond(200);
      expect($http.pendingRequests.length).toBe(0);

      $http({method: 'get', url: '/some'});
      expect($http.pendingRequests.length).toBe(1);

      $httpBackend.flush();
      expect($http.pendingRequests.length).toBe(0);
    });


    it('should update pending requests even when served from cache', inject(function($browser) {
      $httpBackend.when('GET').respond(200);

      $http({method: 'get', url: '/cached', cache: true});
      $http({method: 'get', url: '/cached', cache: true});
      expect($http.pendingRequests.length).toBe(2);

      $httpBackend.flush();
      expect($http.pendingRequests.length).toBe(0);

      $http({method: 'get', url: '/cached', cache: true});
      expect($http.pendingRequests.length).toBe(1);

      $browser.defer.flush();
      expect($http.pendingRequests.length).toBe(0);
    }));


    it('should remove the request before firing callbacks', function() {
      $httpBackend.when('GET').respond(200);
      $http({method: 'get', url: '/url'}).success(function() {
        expect($http.pendingRequests.length).toBe(0);
      });

      expect($http.pendingRequests.length).toBe(1);
      $httpBackend.flush();
    });
  });
});
