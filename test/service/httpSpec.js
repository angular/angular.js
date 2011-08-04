'use strict';

// TODO(vojta): refactor these tests to use new inject() syntax
describe('$http', function() {

  var $http, $browser, $exceptionHandler, // services
      method, url, data, headers, timeout, // passed arguments
      onSuccess, onError, // callback spies
      scope, errorLogs, respond, rawXhrObject, future;

  beforeEach(inject(function($injector) {
    $injector.get('$exceptionHandlerProvider').mode('log');
    scope = $injector.get('$rootScope');
    $http = $injector.get('$http');
    $browser = $injector.get('$browser');
    $exceptionHandler = $injector.get('$exceptionHandler');

    // TODO(vojta): move this into mock browser ?
    respond = method = url = data = headers = null;
    rawXhrObject = {
      abort: jasmine.createSpy('request.abort'),
      getResponseHeader: function(h) {return h + '-val';},
      getAllResponseHeaders: function() {
        return 'content-encoding: gzip\nserver: Apache\n';
      }
    };

    spyOn(scope, '$apply');
    spyOn($browser, 'xhr').andCallFake(function(m, u, d, c, h, t) {
      method = m;
      url = u;
      data = d;
      respond = c;
      headers = h;
      timeout = t;
      return rawXhrObject;
    });
  }));

  afterEach(function() {
    // expect($exceptionHandler.errors.length).toBe(0);
  });

  function doCommonXhr(method, url) {
    future = $http({method: method || 'GET', url: url || '/url'});

    onSuccess = jasmine.createSpy('on200');
    onError = jasmine.createSpy('on400');
    future.on('200', onSuccess);
    future.on('400', onError);

    return future;
  }


  it('should do basic request', function() {
    $http({url: '/url', method: 'GET'});
    expect($browser.xhr).toHaveBeenCalledOnce();
    expect(url).toBe('/url');
    expect(method).toBe('GET');
  });


  it('should pass data if specified', function() {
    $http({url: '/url', method: 'POST', data: 'some-data'});
    expect($browser.xhr).toHaveBeenCalledOnce();
    expect(data).toBe('some-data');
  });


  it('should pass timeout if specified', function() {
    $http({url: '/url', method: 'POST', timeout: 5000});
    expect($browser.xhr).toHaveBeenCalledOnce();
    expect(timeout).toBe(5000);
  });


  describe('callbacks', function() {

    beforeEach(doCommonXhr);

    it('should log exceptions', function() {
      onSuccess.andThrow('exception in success callback');
      onError.andThrow('exception in error callback');

      respond(200, 'content');
      expect($exceptionHandler.errors.pop()).toContain('exception in success callback');

      respond(400, '');
      expect($exceptionHandler.errors.pop()).toContain('exception in error callback');
    });


    it('should log more exceptions', function() {
      onError.andThrow('exception in error callback');
      future.on('500', onError).on('50x', onError);
      respond(500, '');

      expect($exceptionHandler.errors.length).toBe(2);
      $exceptionHandler.errors = [];
    });


    it('should get response as first param', function() {
      respond(200, 'response');
      expect(onSuccess).toHaveBeenCalledOnce();
      expect(onSuccess.mostRecentCall.args[0]).toBe('response');

      respond(400, 'empty');
      expect(onError).toHaveBeenCalledOnce();
      expect(onError.mostRecentCall.args[0]).toBe('empty');
    });


    it('should get status code as second param', function() {
      respond(200, 'response');
      expect(onSuccess).toHaveBeenCalledOnce();
      expect(onSuccess.mostRecentCall.args[1]).toBe(200);

      respond(400, 'empty');
      expect(onError).toHaveBeenCalledOnce();
      expect(onError.mostRecentCall.args[1]).toBe(400);
    });
  });


  describe('response headers', function() {

    var callback;

    beforeEach(function() {
      callback = jasmine.createSpy('callback');
    });

    it('should return single header', function() {
      callback.andCallFake(function(r, s, header) {
        expect(header('date')).toBe('date-val');
      });

      $http({url: '/url', method: 'GET'}).on('200', callback);
      respond(200, '');

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return null when single header does not exist', function() {
      callback.andCallFake(function(r, s, header) {
        header(); // we need that to get headers parsed first
        expect(header('nothing')).toBe(null);
      });

      $http({url: '/url', method: 'GET'}).on('200', callback);
      respond(200, '');

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return all headers as object', function() {
      callback.andCallFake(function(r, s, header) {
        expect(header()).toEqual({'content-encoding': 'gzip', 'server': 'Apache'});
      });

      $http({url: '/url', method: 'GET'}).on('200', callback);
      respond(200, '');

      expect(callback).toHaveBeenCalledOnce();
    });


    it('should return empty object for jsonp request', function() {
      // jsonp doesn't return raw object
      rawXhrObject = undefined;
      callback.andCallFake(function(r, s, headers) {
        expect(headers()).toEqual({});
      });

      $http({url: '/some', method: 'JSONP'}).on('200', callback);
      respond(200, '');
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
      $http({url: '/url', method: 'GET', headers: {
        'Custom': 'header',
        'Content-Type': 'application/json'
      }});

      expect(headers['Custom']).toEqual('header');
      expect(headers['Content-Type']).toEqual('application/json');
    });


    it('should set default headers for GET request', function() {
      $http({url: '/url', method: 'GET', headers: {}});

      expect(headers['Accept']).toBe('application/json, text/plain, */*');
      expect(headers['X-Requested-With']).toBe('XMLHttpRequest');
    });


    it('should set default headers for POST request', function() {
      $http({url: '/url', method: 'POST', headers: {}});

      expect(headers['Accept']).toBe('application/json, text/plain, */*');
      expect(headers['X-Requested-With']).toBe('XMLHttpRequest');
      expect(headers['Content-Type']).toBe('application/json');
    });


    it('should set default headers for PUT request', function() {
      $http({url: '/url', method: 'PUT', headers: {}});

      expect(headers['Accept']).toBe('application/json, text/plain, */*');
      expect(headers['X-Requested-With']).toBe('XMLHttpRequest');
      expect(headers['Content-Type']).toBe('application/json');
    });


    it('should set default headers for custom HTTP method', function() {
      $http({url: '/url', method: 'FOO', headers: {}});

      expect(headers['Accept']).toBe('application/json, text/plain, */*');
      expect(headers['X-Requested-With']).toBe('XMLHttpRequest');
    });


    it('should override default headers with custom', function() {
      $http({url: '/url', method: 'POST', headers: {
        'Accept': 'Rewritten',
        'Content-Type': 'Rewritten'
      }});

      expect(headers['Accept']).toBe('Rewritten');
      expect(headers['X-Requested-With']).toBe('XMLHttpRequest');
      expect(headers['Content-Type']).toBe('Rewritten');
    });


    it('should set the XSRF cookie into a XSRF header', function() {
      $browser.cookies('XSRF-TOKEN', 'secret');

      $http({url: '/url', method: 'GET'});
      expect(headers['X-XSRF-TOKEN']).toBe('secret');

      $http({url: '/url', method: 'POST', headers: {'S-ome': 'Header'}});
      expect(headers['X-XSRF-TOKEN']).toBe('secret');

      $http({url: '/url', method: 'PUT', headers: {'Another': 'Header'}});
      expect(headers['X-XSRF-TOKEN']).toBe('secret');

      $http({url: '/url', method: 'DELETE', headers: {}});
      expect(headers['X-XSRF-TOKEN']).toBe('secret');
    });
  });


  describe('short methods', function() {

    it('should have .get()', function() {
      $http.get('/url');

      expect(method).toBe('GET');
      expect(url).toBe('/url');
    });


    it('.get() should allow config param', function() {
      $http.get('/url', {headers: {'Custom': 'Header'}});

      expect(method).toBe('GET');
      expect(url).toBe('/url');
      expect(headers['Custom']).toBe('Header');
    });


    it('should have .delete()', function() {
      $http['delete']('/url');

      expect(method).toBe('DELETE');
      expect(url).toBe('/url');
    });


    it('.delete() should allow config param', function() {
      $http['delete']('/url', {headers: {'Custom': 'Header'}});

      expect(method).toBe('DELETE');
      expect(url).toBe('/url');
      expect(headers['Custom']).toBe('Header');
    });


    it('should have .head()', function() {
      $http.head('/url');

      expect(method).toBe('HEAD');
      expect(url).toBe('/url');
    });


    it('.head() should allow config param', function() {
      $http.head('/url', {headers: {'Custom': 'Header'}});

      expect(method).toBe('HEAD');
      expect(url).toBe('/url');
      expect(headers['Custom']).toBe('Header');
    });


    it('should have .patch()', function() {
      $http.patch('/url');

      expect(method).toBe('PATCH');
      expect(url).toBe('/url');
    });


    it('.patch() should allow config param', function() {
      $http.patch('/url', {headers: {'Custom': 'Header'}});

      expect(method).toBe('PATCH');
      expect(url).toBe('/url');
      expect(headers['Custom']).toBe('Header');
    });


    it('should have .post()', function() {
      $http.post('/url', 'some-data');

      expect(method).toBe('POST');
      expect(url).toBe('/url');
      expect(data).toBe('some-data');
    });


    it('.post() should allow config param', function() {
      $http.post('/url', 'some-data', {headers: {'Custom': 'Header'}});

      expect(method).toBe('POST');
      expect(url).toBe('/url');
      expect(data).toBe('some-data');
      expect(headers['Custom']).toBe('Header');
    });


    it('should have .put()', function() {
      $http.put('/url', 'some-data');

      expect(method).toBe('PUT');
      expect(url).toBe('/url');
      expect(data).toBe('some-data');
    });


    it('.put() should allow config param', function() {
      $http.put('/url', 'some-data', {headers: {'Custom': 'Header'}});

      expect(method).toBe('PUT');
      expect(url).toBe('/url');
      expect(data).toBe('some-data');
      expect(headers['Custom']).toBe('Header');
    });


    it('should have .jsonp()', function() {
      $http.jsonp('/url');

      expect(method).toBe('JSONP');
      expect(url).toBe('/url');
    });


    it('.jsonp() should allow config param', function() {
      $http.jsonp('/url', {headers: {'Custom': 'Header'}});

      expect(method).toBe('JSONP');
      expect(url).toBe('/url');
      expect(headers['Custom']).toBe('Header');
    });
  });


  describe('future', function() {

    describe('abort', function() {

      beforeEach(doCommonXhr);

      it('should return itself to allow chaining', function() {
        expect(future.abort()).toBe(future);
      });

      it('should allow aborting the request', function() {
        future.abort();

        expect(rawXhrObject.abort).toHaveBeenCalledOnce();
      });


      it('should not abort already finished request', function() {
        respond(200, 'content');

        future.abort();
        expect(rawXhrObject.abort).not.toHaveBeenCalled();
      });
    });


    describe('retry', function() {

      it('should retry last request with same callbacks', function() {
        doCommonXhr('HEAD', '/url-x');
        respond(200, '');
        $browser.xhr.reset();
        onSuccess.reset();

        future.retry();
        expect($browser.xhr).toHaveBeenCalledOnce();
        expect(method).toBe('HEAD');
        expect(url).toBe('/url-x');

        respond(200, 'body');
        expect(onSuccess).toHaveBeenCalledOnce();
      });


      it('should return itself to allow chaining', function() {
        doCommonXhr();
        respond(200, '');
        expect(future.retry()).toBe(future);
      });


      it('should throw error when pending request', function() {
        doCommonXhr();
        expect(future.retry).toThrow('Can not retry request. Abort pending request first.');
      });
    });


    describe('on', function() {

      var callback;

      beforeEach(function() {
        future = $http({method: 'GET', url: '/url'});
        callback = jasmine.createSpy('callback');
      });

      it('should return itself to allow chaining', function() {
        expect(future.on('200', noop)).toBe(future);
      });


      it('should call exact status code callback', function() {
        future.on('205', callback);
        respond(205, '');

        expect(callback).toHaveBeenCalledOnce();
      });


      it('should match 2xx', function() {
        future.on('2xx', callback);

        respond(200, '');
        respond(201, '');
        respond(266, '');

        respond(400, '');
        respond(300, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(3);
      });


      it('should match 20x', function() {
        future.on('20x', callback);

        respond(200, '');
        respond(201, '');
        respond(205, '');

        respond(400, '');
        respond(300, '');
        respond(210, '');
        respond(255, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(3);
      });


      it('should match 2x1', function() {
        future.on('2x1', callback);

        respond(201, '');
        respond(211, '');
        respond(251, '');

        respond(400, '');
        respond(300, '');
        respond(210, '');
        respond(255, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(3);
      });


      it('should match xxx', function() {
        future.on('xxx', callback);

        respond(201, '');
        respond(211, '');
        respond(251, '');
        respond(404, '');
        respond(501, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(5);
      });


      it('should call all matched callbacks', function() {
        var no = jasmine.createSpy('wrong');
        future.on('xxx', callback);
        future.on('2xx', callback);
        future.on('205', callback);
        future.on('3xx', no);
        future.on('2x1', no);
        future.on('4xx', no);
        respond(205, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(3);
        expect(no).not.toHaveBeenCalled();
      });


      it('should allow list of status patterns', function() {
        future.on('2xx,3xx', callback);

        respond(405, '');
        expect(callback).not.toHaveBeenCalled();

        respond(201);
        expect(callback).toHaveBeenCalledOnce();

        respond(301);
        expect(callback.callCount).toBe(2);
      });


      it('should preserve the order of listeners', function() {
        var log = '';
        future.on('2xx', function() {log += '1';});
        future.on('201', function() {log += '2';});
        future.on('2xx', function() {log += '3';});

        respond(201);
        expect(log).toBe('123');
      });


      it('should know "success" alias', function() {
        future.on('success', callback);
        respond(200, '');
        expect(callback).toHaveBeenCalledOnce();

        callback.reset();
        respond(201, '');
        expect(callback).toHaveBeenCalledOnce();

        callback.reset();
        respond(250, '');
        expect(callback).toHaveBeenCalledOnce();

        callback.reset();
        respond(404, '');
        respond(501, '');
        expect(callback).not.toHaveBeenCalled();
      });


      it('should know "error" alias', function() {
        future.on('error', callback);
        respond(401, '');
        expect(callback).toHaveBeenCalledOnce();

        callback.reset();
        respond(500, '');
        expect(callback).toHaveBeenCalledOnce();

        callback.reset();
        respond(0, '');
        expect(callback).toHaveBeenCalledOnce();

        callback.reset();
        respond(201, '');
        respond(200, '');
        respond(300, '');
        expect(callback).not.toHaveBeenCalled();
      });


      it('should know "always" alias', function() {
        future.on('always', callback);
        respond(201, '');
        respond(200, '');
        respond(300, '');
        respond(401, '');
        respond(502, '');
        respond(0,   '');
        respond(-1,  '');
        respond(-2,  '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(8);
      });


      it('should call "xxx" when 0 status code', function() {
        future.on('xxx', callback);
        respond(0, '');
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should not call "2xx" when 0 status code', function() {
        future.on('2xx', callback);
        respond(0, '');
        expect(callback).not.toHaveBeenCalled();
      });

      it('should normalize internal statuses -1, -2 to 0', function() {
        callback.andCallFake(function(response, status) {
          expect(status).toBe(0);
        });

        future.on('xxx', callback);
        respond(-1, '');
        respond(-2, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(2);
      });

      it('should match "timeout" when -1 internal status', function() {
        future.on('timeout', callback);
        respond(-1, '');

        expect(callback).toHaveBeenCalledOnce();
      });

      it('should match "abort" when 0 status', function() {
        future.on('abort', callback);
        respond(0, '');

        expect(callback).toHaveBeenCalledOnce();
      });

      it('should match "error" when 0, -1, or -2', function() {
        future.on('error', callback);
        respond(0,  '');
        respond(-1, '');
        respond(-2, '');

        expect(callback).toHaveBeenCalled();
        expect(callback.callCount).toBe(3);
      });
    });
  });


  describe('scope.$apply', function() {

    beforeEach(doCommonXhr);

    it('should $apply after success callback', function() {
      respond(200, '');
      expect(scope.$apply).toHaveBeenCalledOnce();
    });


    it('should $apply after error callback', function() {
      respond(404, '');
      expect(scope.$apply).toHaveBeenCalledOnce();
    });


    it('should $apply even if exception thrown during callback', function() {
      onSuccess.andThrow('error in callback');
      onError.andThrow('error in callback');

      respond(200, '');
      expect(scope.$apply).toHaveBeenCalledOnce();

      scope.$apply.reset();
      respond(400, '');
      expect(scope.$apply).toHaveBeenCalledOnce();

      $exceptionHandler.errors = [];
    });
  });


  describe('transform', function() {

    describe('request', function() {

      describe('default', function() {

        it('should transform object into json', function() {
          $http({method: 'POST', url: '/url', data: {one: 'two'}});
          expect(data).toBe('{"one":"two"}');
        });


        it('should ignore strings', function() {
          $http({method: 'POST', url: '/url', data: 'string-data'});
          expect(data).toBe('string-data');
        });
      });
    });


    describe('response', function() {

      describe('default', function() {

        it('should deserialize json objects', function() {
          doCommonXhr();
          respond(200, '{"foo":"bar","baz":23}');

          expect(onSuccess.mostRecentCall.args[0]).toEqual({foo: 'bar', baz: 23});
        });


        it('should deserialize json arrays', function() {
          doCommonXhr();
          respond(200, '[1, "abc", {"foo":"bar"}]');

          expect(onSuccess.mostRecentCall.args[0]).toEqual([1, 'abc', {foo: 'bar'}]);
        });


        it('should deserialize json with security prefix', function() {
          doCommonXhr();
          respond(200, ')]}\',\n[1, "abc", {"foo":"bar"}]');

          expect(onSuccess.mostRecentCall.args[0]).toEqual([1, 'abc', {foo:'bar'}]);
        });
      });

      it('should pipeline more functions', function() {
        function first(d) {return d + '1';}
        function second(d) {return d + '2';}
        onSuccess = jasmine.createSpy('onSuccess');

        $http({method: 'POST', url: '/url', data: '0', transformResponse: [first, second]})
          .on('200', onSuccess);

        respond(200, '0');
        expect(onSuccess).toHaveBeenCalledOnce();
        expect(onSuccess.mostRecentCall.args[0]).toBe('012');
      });
    });
  });


  describe('cache', function() {

    function doFirstCacheRequest(method, responseStatus) {
      onSuccess = jasmine.createSpy('on200');
      $http({method: method || 'get', url: '/url', cache: true});
      respond(responseStatus || 200, 'content');
      $browser.xhr.reset();
    }

    it('should cache GET request', function() {
      doFirstCacheRequest();

      $http({method: 'get', url: '/url', cache: true}).on('200', onSuccess);
      $browser.defer.flush();

      expect(onSuccess).toHaveBeenCalledOnce();
      expect(onSuccess.mostRecentCall.args[0]).toBe('content');
      expect($browser.xhr).not.toHaveBeenCalled();
    });


    it('should always call callback asynchronously', function() {
      doFirstCacheRequest();

      $http({method: 'get', url: '/url', cache: true}).on('200', onSuccess);
      expect(onSuccess).not.toHaveBeenCalled();
    });


    it('should not cache POST request', function() {
      doFirstCacheRequest('post');

      $http({method: 'post', url: '/url', cache: true}).on('200', onSuccess);
      $browser.defer.flush();
      expect(onSuccess).not.toHaveBeenCalled();
      expect($browser.xhr).toHaveBeenCalledOnce();
    });


    it('should not cache PUT request', function() {
      doFirstCacheRequest('put');

      $http({method: 'put', url: '/url', cache: true}).on('200', onSuccess);
      $browser.defer.flush();
      expect(onSuccess).not.toHaveBeenCalled();
      expect($browser.xhr).toHaveBeenCalledOnce();
    });


    it('should not cache DELETE request', function() {
      doFirstCacheRequest('delete');

      $http({method: 'delete', url: '/url', cache: true}).on('200', onSuccess);
      $browser.defer.flush();
      expect(onSuccess).not.toHaveBeenCalled();
      expect($browser.xhr).toHaveBeenCalledOnce();
    });


    it('should not cache non 2xx responses', function() {
      doFirstCacheRequest('get', 404);

      $http({method: 'get', url: '/url', cache: true}).on('200', onSuccess);
      $browser.defer.flush();
      expect(onSuccess).not.toHaveBeenCalled();
      expect($browser.xhr).toHaveBeenCalledOnce();
    });


    it('should cache the headers as well', function() {
      doFirstCacheRequest();
      onSuccess.andCallFake(function(r, s, headers) {
        expect(headers()).toEqual({'content-encoding': 'gzip', 'server': 'Apache'});
        expect(headers('server')).toBe('Apache');
      });

      $http({method: 'get', url: '/url', cache: true}).on('200', onSuccess);
      $browser.defer.flush();
      expect(onSuccess).toHaveBeenCalledOnce();
    });


    it('should cache status code as well', function() {
      doFirstCacheRequest('get', 201);
      onSuccess.andCallFake(function(r, status, h) {
        expect(status).toBe(201);
      });

      $http({method: 'get', url: '/url', cache: true}).on('2xx', onSuccess);
      $browser.defer.flush();
      expect(onSuccess).toHaveBeenCalledOnce();
    });
  });


  describe('pendingCount', function() {

    it('should return number of pending requests', function() {
      expect($http.pendingCount()).toBe(0);

      $http({method: 'get', url: '/some'});
      expect($http.pendingCount()).toBe(1);

      respond(200, '');
      expect($http.pendingCount()).toBe(0);
    });


    it('should decrement the counter when request aborted', function() {
      future = $http({method: 'get', url: '/x'});
      expect($http.pendingCount()).toBe(1);
      future.abort();
      respond(0, '');

      expect($http.pendingCount()).toBe(0);
    });


    it('should decrement the counter when served from cache', function() {
      $http({method: 'get', url: '/cached', cache: true});
      respond(200, 'content');
      expect($http.pendingCount()).toBe(0);

      $http({method: 'get', url: '/cached', cache: true});
      expect($http.pendingCount()).toBe(1);

      $browser.defer.flush();
      expect($http.pendingCount()).toBe(0);
    });


    it('should decrement the counter before firing callbacks', function() {
      $http({method: 'get', url: '/cached'}).on('xxx', function() {
        expect($http.pendingCount()).toBe(0);
      });

      expect($http.pendingCount()).toBe(1);
      respond(200, 'content');
    });
  });
});
