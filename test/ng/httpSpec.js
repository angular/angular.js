'use strict';

describe('$http', function() {

  var callback, mockedCookies;
  var customParamSerializer = function(params) {
    return Object.keys(params).join('_');
  };

  beforeEach(function() {
    callback = jasmine.createSpy('done');
    mockedCookies = {};
    module({
      $$cookieReader: function() {
        return mockedCookies;
      }
    });
  });

  beforeEach(module({
    customParamSerializer: customParamSerializer
  }));
  beforeEach(module(function($exceptionHandlerProvider) {
    $exceptionHandlerProvider.mode('log');
  }));

  afterEach(inject(function($exceptionHandler, $httpBackend, $rootScope) {
    forEach($exceptionHandler.errors, function(e) {
      dump('Unhandled exception: ', e);
    });

    if ($exceptionHandler.errors.length) {
      throw 'Unhandled exceptions trapped in $exceptionHandler!';
    }

    $rootScope.$digest();
    $httpBackend.verifyNoOutstandingExpectation();
  }));


  describe('$httpProvider', function() {
    describe('interceptors', function() {
      it('should chain request, requestReject, response and responseReject interceptors', function() {
        module(function($httpProvider) {
          var savedConfig, savedResponse;
          $httpProvider.interceptors.push(function($q) {
            return {
              request: function(config) {
                config.url += '/1';
                savedConfig = config;
                return $q.reject('/2');
              }
            };
          });
          $httpProvider.interceptors.push(function($q) {
            return {
              requestError: function(error) {
                savedConfig.url += error;
                return $q.when(savedConfig);
              }
            };
          });
          $httpProvider.interceptors.push(function() {
            return {
              responseError: function(rejection) {
                savedResponse.data += rejection;
                return savedResponse;
              }
            };
          });
          $httpProvider.interceptors.push(function($q) {
            return {
              response: function(response) {
                response.data += ':1';
                savedResponse = response;
                return $q.reject(':2');
              }
            };
          });
        });
        inject(function($http, $httpBackend, $rootScope) {
          var response;
          $httpBackend.expect('GET', '/url/1/2').respond('response');
          $http({method: 'GET', url: '/url'}).then(function(r) {
            response = r;
          });
          $rootScope.$apply();
          $httpBackend.flush();
          expect(response.data).toEqual('response:1:2');
        });
      });


      it('should verify order of execution', function() {
        module(function($httpProvider) {
          $httpProvider.interceptors.push(function($q) {
            return {
              request: function(config) {
                config.url += '/outer';
                return config;
              },
              response: function(response) {
                response.data = '{' + response.data + '} outer';
                return response;
              }
            };
          });
          $httpProvider.interceptors.push(function($q) {
            return {
              request: function(config) {
                config.url += '/inner';
                return config;
              },
              response: function(response) {
                response.data = '{' + response.data + '} inner';
                return response;
              }
            };
          });
        });
        inject(function($http, $httpBackend) {
          var response;
          $httpBackend.expect('GET', '/url/outer/inner').respond('response');
          $http({method: 'GET', url: '/url'}).then(function(r) {
            response = r;
          });
          $httpBackend.flush();
          expect(response.data).toEqual('{{response} inner} outer');
        });
      });
    });


    describe('request interceptors', function() {
      it('should pass request config as a promise', function() {
        var run = false;
        module(function($httpProvider) {
          $httpProvider.interceptors.push(function() {
            return {
              request: function(config) {
                expect(config.url).toEqual('/url');
                expect(config.data).toEqual({one: "two"});
                expect(config.headers.foo).toEqual('bar');
                run = true;
                return config;
              }
            };
          });
        });
        inject(function($http, $httpBackend, $rootScope) {
          $httpBackend.expect('POST', '/url').respond('');
          $http({method: 'POST', url: '/url', data: {one: 'two'}, headers: {foo: 'bar'}});
          $rootScope.$apply();
          expect(run).toEqual(true);
        });
      });

      it('should allow manipulation of request', function() {
        module(function($httpProvider) {
          $httpProvider.interceptors.push(function() {
            return {
              request: function(config) {
                config.url = '/intercepted';
                config.headers.foo = 'intercepted';
                return config;
              }
            };
          });
        });
        inject(function($http, $httpBackend, $rootScope) {
          $httpBackend.expect('GET', '/intercepted', null, function(headers) {
            return headers.foo === 'intercepted';
          }).respond('');
          $http.get('/url');
          $rootScope.$apply();
        });
      });


      it('should allow replacement of the headers object', function() {
        module(function($httpProvider) {
          $httpProvider.interceptors.push(function() {
            return {
              request: function(config) {
                config.headers = {foo: 'intercepted'};
                return config;
              }
            };
          });
        });
        inject(function($http, $httpBackend, $rootScope) {
          $httpBackend.expect('GET', '/url', null, function(headers) {
            return angular.equals(headers, {foo: 'intercepted'});
          }).respond('');
          $http.get('/url');
          $rootScope.$apply();
        });
      });

      it('should reject the http promise if an interceptor fails', function() {
        var reason = new Error('interceptor failed');
        module(function($httpProvider) {
          $httpProvider.interceptors.push(function($q) {
            return {
              request: function(promise) {
                return $q.reject(reason);
              }
            };
          });
        });
        inject(function($http, $httpBackend, $rootScope) {
          var success = jasmine.createSpy(), error = jasmine.createSpy();
          $http.get('/url').then(success, error);
          $rootScope.$apply();
          expect(success).not.toHaveBeenCalled();
          expect(error).toHaveBeenCalledWith(reason);
        });
      });

      it('should not manipulate the passed-in config', function() {
        module(function($httpProvider) {
          $httpProvider.interceptors.push(function() {
            return {
              request: function(config) {
                config.url = '/intercepted';
                config.headers.foo = 'intercepted';
                return config;
              }
            };
          });
        });
        inject(function($http, $httpBackend, $rootScope) {
          var config = { headers: { foo: 'bar'} };
          var configCopy = angular.copy(config);
          $httpBackend.expect('GET', '/intercepted').respond('');
          $http.get('/url', config);
          $rootScope.$apply();
          expect(config).toEqual(configCopy);
          $httpBackend.expect('POST', '/intercepted').respond('');
          $http.post('/url', {bar: 'baz'}, config);
          $rootScope.$apply();
          expect(config).toEqual(configCopy);
        });
      });

      it('should support interceptors defined as services', function() {
        module(function($provide, $httpProvider) {
          $provide.factory('myInterceptor', function() {
            return {
              request: function(config) {
                config.url = '/intercepted';
                return config;
              }
            };
          });
          $httpProvider.interceptors.push('myInterceptor');
        });
        inject(function($http, $httpBackend, $rootScope) {
          $httpBackend.expect('POST', '/intercepted').respond('');
          $http.post('/url');
          $rootScope.$apply();
        });
      });

      it('should support complex interceptors based on promises', function() {
        module(function($provide, $httpProvider) {
          $provide.factory('myInterceptor', function($q, $rootScope) {
            return {
              request: function(config) {
                return $q.when('/intercepted').then(function(intercepted) {
                  config.url = intercepted;
                  return config;
                });
              }
            };
          });
          $httpProvider.interceptors.push('myInterceptor');
        });
        inject(function($http, $httpBackend, $rootScope) {
          $httpBackend.expect('POST', '/intercepted').respond('');
          $http.post('/two');
          $rootScope.$apply();
        });
      });
    });
  });


  describe('the instance', function() {
    var $httpBackend, $http, $rootScope;

    beforeEach(inject(['$httpBackend', '$http', '$rootScope', function($hb, $h, $rs) {
      $httpBackend = $hb;
      $http = $h;
      $rootScope = $rs;
      spyOn($rootScope, '$apply').andCallThrough();
    }]));

    it('should throw error if the request configuration is not an object', function() {
      expect(function() {
          $http('/url');
      }).toThrowMinErr('$http','badreq', 'Http request configuration must be an object.  Received: /url');
    });

    it('should send GET requests if no method specified', function() {
      $httpBackend.expect('GET', '/url').respond('');
      $http({url: '/url'});
    });

    it('should do basic request', function() {
      $httpBackend.expect('GET', '/url').respond('');
      $http({url: '/url', method: 'GET'});
    });


    it('should pass data if specified', function() {
      $httpBackend.expect('POST', '/url', 'some-data').respond('');
      $http({url: '/url', method: 'POST', data: 'some-data'});
    });


    describe('params', function() {
      it('should do basic request with params and encode', function() {
        $httpBackend.expect('GET', '/url?a%3D=%3F%26&b=2').respond('');
        $http({url: '/url', params: {'a=':'?&', b:2}, method: 'GET'});
      });


      it('should merge params if url contains some already', function() {
        $httpBackend.expect('GET', '/url?c=3&a=1&b=2').respond('');
        $http({url: '/url?c=3', params: {a:1, b:2}, method: 'GET'});
      });


      it('should jsonify objects in params map', function() {
        $httpBackend.expect('GET', '/url?a=1&b=%7B%22c%22:3%7D').respond('');
        $http({url: '/url', params: {a:1, b:{c:3}}, method: 'GET'});
      });


      it('should expand arrays in params map', function() {
        $httpBackend.expect('GET', '/url?a=1&a=2&a=3').respond('');
        $http({url: '/url', params: {a: [1,2,3]}, method: 'GET'});
      });


      it('should not encode @ in url params', function() {
        //encodeURIComponent is too agressive and doesn't follow http://www.ietf.org/rfc/rfc3986.txt
        //with regards to the character set (pchar) allowed in path segments
        //so we need this test to make sure that we don't over-encode the params and break stuff
        //like buzz api which uses @self

        $httpBackend.expect('GET', '/Path?!do%26h=g%3Da+h&:bar=$baz@1').respond('');
        $http({url: '/Path', params: {':bar': '$baz@1', '!do&h': 'g=a h'}, method: 'GET'});
      });

      it('should not add question mark when params is empty', function() {
        $httpBackend.expect('GET', '/url').respond('');
        $http({url: '/url', params: {}, method: 'GET'});
      });

      it('should not double quote dates', function() {
        $httpBackend.expect('GET', '/url?date=2014-07-15T17:30:00.000Z').respond('');
        $http({url: '/url', params: {date:new Date('2014-07-15T17:30:00.000Z')}, method: 'GET'});
      });


      describe('custom params serialization', function() {

        it('should allow specifying custom paramSerializer as function', function() {
          $httpBackend.expect('GET', '/url?foo_bar').respond('');
          $http({url: '/url', params: {foo: 'fooVal', bar: 'barVal'}, paramSerializer: customParamSerializer});
        });

        it('should allow specifying custom paramSerializer as function from DI', function() {
          $httpBackend.expect('GET', '/url?foo_bar').respond('');
          $http({url: '/url', params: {foo: 'fooVal', bar: 'barVal'}, paramSerializer: 'customParamSerializer'});
        });
      });
    });


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


      it('should pass statusText in response object when a request is successful', function() {
        $httpBackend.expect('GET', '/url').respond(200, 'SUCCESS', {}, 'OK');
        $http({url: '/url', method: 'GET'}).then(function(response) {
          expect(response.statusText).toBe('OK');
          callback();
        });

        $httpBackend.flush();
        expect(callback).toHaveBeenCalledOnce();
      });


      it('should pass statusText in response object when a request fails', function() {
        $httpBackend.expect('GET', '/url').respond(404, 'ERROR', {}, 'Not Found');
        $http({url: '/url', method: 'GET'}).then(null, function(response) {
          expect(response.statusText).toBe('Not Found');
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


        it('should error if the callback is not a function', function() {
          expect(function() {
            $http({url: '/url', method: 'GET'}).success();
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).success(undefined);
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).success(null);
          }).toThrowMinErr('ng', 'areq');


          expect(function() {
            $http({url: '/url', method: 'GET'}).success({});
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).success([]);
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).success('error');
          }).toThrowMinErr('ng', 'areq');
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


        it('should error if the callback is not a function', function() {
          expect(function() {
            $http({url: '/url', method: 'GET'}).error();
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).error(undefined);
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).error(null);
          }).toThrowMinErr('ng', 'areq');


          expect(function() {
            $http({url: '/url', method: 'GET'}).error({});
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).error([]);
          }).toThrowMinErr('ng', 'areq');

          expect(function() {
            $http({url: '/url', method: 'GET'}).error('error');
          }).toThrowMinErr('ng', 'areq');
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

        $http({url: '/url', method: 'GET'}).then(callback);
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
      /* global parseHeaders: false */

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

      it('should parse multiple values for the same header', function() {
        expect(parseHeaders('key:value1\nkey:value2').key).toBe('value1, value2');
      });
    });


    describe('request headers', function() {

      it('should send custom headers', function() {
        $httpBackend.expect('GET', '/url', undefined, function(headers) {
          return headers['Custom'] == 'header';
        }).respond('');

        $http({url: '/url', method: 'GET', headers: {
          'Custom': 'header'
        }});

        $httpBackend.flush();
      });


      it('should set default headers for GET request', function() {
        $httpBackend.expect('GET', '/url', undefined, function(headers) {
          return headers['Accept'] == 'application/json, text/plain, */*';
        }).respond('');

        $http({url: '/url', method: 'GET', headers: {}});
        $httpBackend.flush();
      });


      it('should set default headers for POST request', function() {
        $httpBackend.expect('POST', '/url', 'messageBody', function(headers) {
          return headers['Accept'] == 'application/json, text/plain, */*' &&
                 headers['Content-Type'] == 'application/json;charset=utf-8';
        }).respond('');

        $http({url: '/url', method: 'POST', headers: {}, data: 'messageBody'});
        $httpBackend.flush();
      });


      it('should set default headers for PUT request', function() {
        $httpBackend.expect('PUT', '/url', 'messageBody', function(headers) {
          return headers['Accept'] == 'application/json, text/plain, */*' &&
                 headers['Content-Type'] == 'application/json;charset=utf-8';
        }).respond('');

        $http({url: '/url', method: 'PUT', headers: {}, data: 'messageBody'});
        $httpBackend.flush();
      });

      it('should set default headers for PATCH request', function() {
        $httpBackend.expect('PATCH', '/url', 'messageBody', function(headers) {
          return headers['Accept'] == 'application/json, text/plain, */*' &&
                 headers['Content-Type'] == 'application/json;charset=utf-8';
        }).respond('');

        $http({url: '/url', method: 'PATCH', headers: {}, data: 'messageBody'});
        $httpBackend.flush();
      });

      it('should set default headers for custom HTTP method', function() {
        $httpBackend.expect('FOO', '/url', undefined, function(headers) {
          return headers['Accept'] == 'application/json, text/plain, */*';
        }).respond('');

        $http({url: '/url', method: 'FOO', headers: {}});
        $httpBackend.flush();
      });


      it('should override default headers with custom', function() {
        $httpBackend.expect('POST', '/url', 'messageBody', function(headers) {
          return headers['Accept'] == 'Rewritten' &&
                 headers['Content-Type'] == 'Rewritten';
        }).respond('');

        $http({url: '/url', method: 'POST', data: 'messageBody', headers: {
          'Accept': 'Rewritten',
          'Content-Type': 'Rewritten'
        }});
        $httpBackend.flush();
      });

      it('should delete default headers if custom header function returns null', function() {

        $httpBackend.expect('POST', '/url', 'messageBody', function(headers) {
          return !('Accept' in headers);
        }).respond('');

        $http({url: '/url', method: 'POST', data: 'messageBody', headers: {
          'Accept': function() { return null; }
        }});
        $httpBackend.flush();
      });

      it('should override default headers with custom in a case insensitive manner', function() {
        $httpBackend.expect('POST', '/url', 'messageBody', function(headers) {
          return headers['accept'] == 'Rewritten' &&
                 headers['content-type'] == 'Content-Type Rewritten' &&
                 isUndefined(headers['Accept']) &&
                 isUndefined(headers['Content-Type']);
        }).respond('');

        $http({url: '/url', method: 'POST', data: 'messageBody', headers: {
          'accept': 'Rewritten',
          'content-type': 'Content-Type Rewritten'
        }});
        $httpBackend.flush();
      });

      it('should not set XSRF cookie for cross-domain requests', inject(function($browser) {
        mockedCookies['XSRF-TOKEN'] =  'secret';
        $browser.url('http://host.com/base');
        $httpBackend.expect('GET', 'http://www.test.com/url', undefined, function(headers) {
          return isUndefined(headers['X-XSRF-TOKEN']);
        }).respond('');

        $http({url: 'http://www.test.com/url', method: 'GET', headers: {}});
        $httpBackend.flush();
      }));


      it('should not send Content-Type header if request data/body is undefined', function() {
        $httpBackend.expect('POST', '/url', undefined, function(headers) {
          return !headers.hasOwnProperty('Content-Type');
        }).respond('');

        $httpBackend.expect('POST', '/url2', undefined, function(headers) {
          return !headers.hasOwnProperty('content-type');
        }).respond('');

        $http({url: '/url', method: 'POST'});
        $http({url: '/url2', method: 'POST', headers: {'content-type': 'Rewritten'}});
        $httpBackend.flush();
      });

      it('should NOT delete Content-Type header if request data/body is set by request transform', function() {
        $httpBackend.expect('POST', '/url', {'one': 'two'}, function(headers) {
          return headers['Content-Type'] == 'application/json;charset=utf-8';
        }).respond('');

        $http({
          url: '/url',
          method: 'POST',
          transformRequest: function(data) {
            data = {'one': 'two'};
            return data;
          }
        });

        $httpBackend.flush();
      });

      it('should set the XSRF cookie into a XSRF header', inject(function() {
        function checkXSRF(secret, header) {
          return function(headers) {
            return headers[header || 'X-XSRF-TOKEN'] == secret;
          };
        }

        mockedCookies['XSRF-TOKEN'] =  'secret';
        mockedCookies['aCookie'] = 'secret2';
        $httpBackend.expect('GET', '/url', undefined, checkXSRF('secret')).respond('');
        $httpBackend.expect('POST', '/url', undefined, checkXSRF('secret')).respond('');
        $httpBackend.expect('PUT', '/url', undefined, checkXSRF('secret')).respond('');
        $httpBackend.expect('DELETE', '/url', undefined, checkXSRF('secret')).respond('');
        $httpBackend.expect('GET', '/url', undefined, checkXSRF('secret', 'aHeader')).respond('');
        $httpBackend.expect('GET', '/url', undefined, checkXSRF('secret2')).respond('');

        $http({url: '/url', method: 'GET'});
        $http({url: '/url', method: 'POST', headers: {'S-ome': 'Header'}});
        $http({url: '/url', method: 'PUT', headers: {'Another': 'Header'}});
        $http({url: '/url', method: 'DELETE', headers: {}});
        $http({url: '/url', method: 'GET', xsrfHeaderName: 'aHeader'});
        $http({url: '/url', method: 'GET', xsrfCookieName: 'aCookie'});

        $httpBackend.flush();
      }));

      it('should send execute result if header value is function', function() {
        var headerConfig = {'Accept': function() { return 'Rewritten'; }};

        function checkHeaders(headers) {
          return headers['Accept'] == 'Rewritten';
        }

        $httpBackend.expect('GET', '/url', undefined, checkHeaders).respond('');
        $httpBackend.expect('POST', '/url', undefined, checkHeaders).respond('');
        $httpBackend.expect('PUT', '/url', undefined, checkHeaders).respond('');
        $httpBackend.expect('PATCH', '/url', undefined, checkHeaders).respond('');
        $httpBackend.expect('DELETE', '/url', undefined, checkHeaders).respond('');

        $http({url: '/url', method: 'GET', headers: headerConfig});
        $http({url: '/url', method: 'POST', headers: headerConfig});
        $http({url: '/url', method: 'PUT', headers: headerConfig});
        $http({url: '/url', method: 'PATCH', headers: headerConfig});
        $http({url: '/url', method: 'DELETE', headers: headerConfig});

        $httpBackend.flush();
      });

      it('should expose a config object to header functions', function() {
        var config = {
          foo: 'Rewritten',
          headers: {'Accept': function(config) {
            return config.foo;
          }}
        };

        $httpBackend.expect('GET', '/url', undefined, {Accept: 'Rewritten'}).respond('');
        $http.get('/url', config);
        $httpBackend.flush();
      });

      it('should not allow modifications to a config object in header functions', function() {
        var config = {
          headers: {'Accept': function(config) {
            config.foo = 'bar';
            return 'Rewritten';
          }}
        };

        $httpBackend.expect('GET', '/url', undefined, {Accept: 'Rewritten'}).respond('');
        $http.get('/url', config);
        $httpBackend.flush();

        expect(config.foo).toBeUndefined();
      });

      it('should check the cache before checking the XSRF cookie', inject(function($cacheFactory) {
        var testCache = $cacheFactory('testCache');

        spyOn(testCache, 'get').andCallFake(function() {
          mockedCookies['XSRF-TOKEN'] = 'foo';
        });

        $httpBackend.expect('GET', '/url', undefined, function(headers) {
          return headers['X-XSRF-TOKEN'] === 'foo';
        }).respond('');
        $http({url: '/url', method: 'GET', cache: testCache});
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


      it('should handle empty response header', function() {
       $httpBackend.expect('GET', '/url', undefined)
           .respond(200, '', { 'Custom-Empty-Response-Header': '', 'Constructor': '' });
       $http.get('/url').then(callback);
       $httpBackend.flush();
       expect(callback).toHaveBeenCalledOnce();
       var headers = callback.mostRecentCall.args[0].headers;
       expect(headers('custom-empty-response-Header')).toEqual('');
       expect(headers('ToString')).toBe(null);
       expect(headers('Constructor')).toBe('');
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

      it('should have patch()', function() {
        $httpBackend.expect('PATCH', '/url', 'some-data').respond('');
        $http.patch('/url', 'some-data');
      });

      it('patch() should allow config param', function() {
        $httpBackend.expect('PATCH', '/url', 'some-data', checkHeader('Custom', 'Header')).respond('');
        $http.patch('/url', 'some-data', {headers: {'Custom': 'Header'}});
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


      it('should $apply even if exception thrown during callback', inject(function($exceptionHandler) {
        $httpBackend.when('GET').respond(200);
        callback.andThrow('error in callback');

        $http({method: 'GET', url: '/some'}).then(callback);
        $httpBackend.flush();
        expect($rootScope.$apply).toHaveBeenCalledOnce();

        $exceptionHandler.errors = [];
      }));
    });


    describe('transformData', function() {

      describe('request', function() {

        describe('default', function() {

          it('should transform object into json', function() {
            $httpBackend.expect('POST', '/url', '{"one":"two"}').respond('');
            $http({method: 'POST', url: '/url', data: {one: 'two'}});
          });


          it('should transform object with date into json', function() {
            $httpBackend.expect('POST', '/url', {"date": new Date(Date.UTC(2013, 11, 25))}).respond('');
            $http({method: 'POST', url: '/url', data: {date: new Date(Date.UTC(2013, 11, 25))}});
          });


          it('should ignore strings', function() {
            $httpBackend.expect('POST', '/url', 'string-data').respond('');
            $http({method: 'POST', url: '/url', data: 'string-data'});
          });


          it('should ignore File objects', function() {
            var file = {
              some: true,
              // $httpBackend compares toJson values by default,
              // we need to be sure it's not serialized into json string
              test: function(actualValue) {
                return this === actualValue;
              }
            };

            // I'm really sorry for doing this :-D
            // Unfortunatelly I don't know how to trick toString.apply(obj) comparison
            spyOn(window, 'isFile').andReturn(true);

            $httpBackend.expect('POST', '/some', file).respond('');
            $http({method: 'POST', url: '/some', data: file});
          });
        });


        it('should ignore Blob objects', function() {
          if (!window.Blob) return;

          var blob = new Blob(['blob!'], { type: 'text/plain' });

          $httpBackend.expect('POST', '/url', '[object Blob]').respond('');
          $http({ method: 'POST', url: '/url', data: blob });
        });

        it('should ignore FormData objects', function() {
          if (!window.FormData) return;

          var formData = new FormData();
          formData.append('angular', 'is great');

          $httpBackend.expect('POST', '/url', '[object FormData]').respond('');
          $http({ method: 'POST', url: '/url', data: formData });
        });

        it('should have access to request headers', function() {
          $httpBackend.expect('POST', '/url', 'header1').respond(200);
          $http.post('/url', 'req', {
            headers: {h1: 'header1'},
            transformRequest: function(data, headers) {
              return headers('h1');
            }
          }).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
        });

        it('should have access to request headers with mixed case', function() {
          $httpBackend.expect('POST', '/url', 'header1').respond(200);
          $http.post('/url', 'req', {
            headers: {H1: 'header1'},
            transformRequest: function(data, headers) {
              return headers('H1');
            }
          }).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
        });

        it('should not allow modifications to headers in a transform functions', function() {
          var config = {
            headers: {'Accept': 'bar'},
            transformRequest: function(data, headers) {
              angular.extend(headers(), {
                'Accept': 'foo'
              });
            }
          };

          $httpBackend.expect('GET', '/url', undefined, {Accept: 'bar'}).respond(200);
          $http.get('/url', config).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
        });

        it('should pipeline more functions', function() {
          function first(d, h) {return d + '-first' + ':' + h('h1');}
          function second(d) {return uppercase(d);}

          $httpBackend.expect('POST', '/url', 'REQ-FIRST:V1').respond(200);
          $http.post('/url', 'req', {
            headers: {h1: 'v1'},
            transformRequest: [first, second]
          }).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
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


          it('should ignore leading/trailing whitespace', function() {
            $httpBackend.expect('GET', '/url').respond('  \n  {"foo":"bar","baz":23}  \r\n  \n  ');
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual({foo: 'bar', baz: 23});
          });


          it('should deserialize json numbers when response header contains application/json',
              function() {
            $httpBackend.expect('GET', '/url').respond('123', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual(123);
          });


          it('should deserialize json strings when response header contains application/json',
              function() {
            $httpBackend.expect('GET', '/url').respond('"asdf"', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual('asdf');
          });


          it('should deserialize json nulls when response header contains application/json',
              function() {
            $httpBackend.expect('GET', '/url').respond('null', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual(null);
          });


          it('should deserialize json true when response header contains application/json',
              function() {
            $httpBackend.expect('GET', '/url').respond('true', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual(true);
          });


          it('should deserialize json false when response header contains application/json',
              function() {
            $httpBackend.expect('GET', '/url').respond('false', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual(false);
          });


          it('should deserialize json empty string when response header contains application/json',
              function() {
            $httpBackend.expect('GET', '/url').respond('""', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual('');
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


          it('should retain security prefix if response is not json', function() {
            $httpBackend.expect('GET', '/url').respond(')]}\',\n This is not JSON !');
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual(')]}\',\n This is not JSON !');
          });


          it('should not attempt to deserialize json when HEAD request', function() {
            //per http spec for Content-Type, HEAD request should return a Content-Type header
            //set to what the content type would have been if a get was sent
            $httpBackend.expect('HEAD', '/url').respond('', {'Content-Type': 'application/json'});
            $http({method: 'HEAD', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual('');
          });

          it('should not attempt to deserialize json for an empty response whose header contains application/json', function() {
            //per http spec for Content-Type, HEAD request should return a Content-Type header
            //set to what the content type would have been if a get was sent
            $httpBackend.expect('GET', '/url').respond('', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual('');
          });

          it('should not attempt to deserialize json for a blank response whose header contains application/json', function() {
            //per http spec for Content-Type, HEAD request should return a Content-Type header
            //set to what the content type would have been if a get was sent
            $httpBackend.expect('GET', '/url').respond(' ', {'Content-Type': 'application/json'});
            $http({method: 'GET', url: '/url'}).success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual(' ');
          });

          it('should not deserialize tpl beginning with ng expression', function() {
            $httpBackend.expect('GET', '/url').respond('{{some}}');
            $http.get('/url').success(callback);
            $httpBackend.flush();

            expect(callback).toHaveBeenCalledOnce();
            expect(callback.mostRecentCall.args[0]).toEqual('{{some}}');
          });

          it('should not deserialize json when the opening and closing brackets do not match',
            function() {
              $httpBackend.expect('GET', '/url1').respond('[Code](url): function() {}');
              $httpBackend.expect('GET', '/url2').respond('{"is": "not"} ["json"]');
              $http.get('/url1').success(callback);
              $http.get('/url2').success(callback);
              $httpBackend.flush();

              expect(callback.calls.length).toBe(2);
              expect(callback.calls[0].args[0]).toEqual('[Code](url): function() {}');
              expect(callback.calls[1].args[0]).toEqual('{"is": "not"} ["json"]');
            }
          );
        });


        it('should have access to response headers', function() {
          $httpBackend.expect('GET', '/url').respond(200, 'response', {h1: 'header1'});
          $http.get('/url', {
            transformResponse: function(data, headers) {
              return headers('h1');
            }
          }).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toBe('header1');
        });

        it('should have access to response status', function() {
          $httpBackend.expect('GET', '/url').respond(200, 'response', {h1: 'header1'});
          $http.get('/url', {
            transformResponse: function(data, headers, status) {
              return status;
            }
          }).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toBe(200);
        });


        it('should pipeline more functions', function() {
          function first(d, h) {return d + '-first' + ':' + h('h1');}
          function second(d) {return uppercase(d);}

          $httpBackend.expect('POST', '/url').respond(200, 'resp', {h1: 'v1'});
          $http.post('/url', '', {transformResponse: [first, second]}).success(callback);
          $httpBackend.flush();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toBe('RESP-FIRST:V1');
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


      it('should cache GET request when cache is provided', inject(function($rootScope) {
        doFirstCacheRequest();

        $http({method: 'get', url: '/url', cache: cache}).success(callback);
        $rootScope.$digest();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.mostRecentCall.args[0]).toBe('content');
      }));

      it('should cache JSONP request when cache is provided', inject(function($rootScope) {
        $httpBackend.expect('JSONP', '/url?cb=JSON_CALLBACK').respond('content');
        $http({method: 'JSONP', url: '/url?cb=JSON_CALLBACK', cache: cache});
        $httpBackend.flush();

        $http({method: 'JSONP', url: '/url?cb=JSON_CALLBACK', cache: cache}).success(callback);
        $rootScope.$digest();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.mostRecentCall.args[0]).toBe('content');
      }));

      it('should cache request when cache is provided and no method specified', function() {
        doFirstCacheRequest();

        $http({url: '/url', cache: cache}).success(callback);
        $rootScope.$digest();

        expect(callback).toHaveBeenCalledOnce();
        expect(callback.mostRecentCall.args[0]).toBe('content');
      });


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


      it('should cache the headers as well', inject(function($rootScope) {
        doFirstCacheRequest('GET', 200, {'content-encoding': 'gzip', 'server': 'Apache'});
        callback.andCallFake(function(r, s, headers) {
          expect(headers()).toEqual({'content-encoding': 'gzip', 'server': 'Apache'});
          expect(headers('server')).toBe('Apache');
        });

        $http({method: 'GET', url: '/url', cache: cache}).success(callback);
        $rootScope.$digest();
        expect(callback).toHaveBeenCalledOnce();
      }));


      it('should not share the cached headers object instance', inject(function($rootScope) {
        doFirstCacheRequest('GET', 200, {'content-encoding': 'gzip', 'server': 'Apache'});
        callback.andCallFake(function(r, s, headers) {
          expect(headers()).toEqual(cache.get('/url')[2]);
          expect(headers()).not.toBe(cache.get('/url')[2]);
        });

        $http({method: 'GET', url: '/url', cache: cache}).success(callback);
        $rootScope.$digest();
        expect(callback).toHaveBeenCalledOnce();
      }));


      it('should not share the pending cached headers object instance', inject(function($rootScope) {
        var firstResult;
        callback.andCallFake(function(result) {
          expect(result.headers()).toEqual(firstResult.headers());
          expect(result.headers()).not.toBe(firstResult.headers());
        });

        $httpBackend.expect('GET', '/url').respond(200, 'content', {'content-encoding': 'gzip', 'server': 'Apache'});
        $http({method: 'GET', url: '/url', cache: cache}).then(function(result) {
          firstResult = result;
        });
        $http({method: 'GET', url: '/url', cache: cache}).then(callback);
        $httpBackend.flush();

        expect(callback).toHaveBeenCalledOnce();
      }));


      it('should cache status code as well', inject(function($rootScope) {
        doFirstCacheRequest('GET', 201);
        callback.andCallFake(function(r, status, h) {
          expect(status).toBe(201);
        });

        $http({method: 'get', url: '/url', cache: cache}).success(callback);
        $rootScope.$digest();
        expect(callback).toHaveBeenCalledOnce();
      }));


      it('should use cache even if second request was made before the first returned', function() {
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


      it('should preserve config object when resolving from cache', function() {
        $httpBackend.expect('GET', '/url').respond(200, 'content');
        $http({method: 'GET', url: '/url', cache: cache, headers: {foo: 'bar'}});
        $httpBackend.flush();

        $http({method: 'GET', url: '/url', cache: cache, headers: {foo: 'baz'}}).then(callback);
        $rootScope.$digest();

        expect(callback.mostRecentCall.args[0].config.headers.foo).toBe('baz');
      });


      it('should preserve config object when resolving from pending cache', function() {
        $httpBackend.expect('GET', '/url').respond(200, 'content');
        $http({method: 'GET', url: '/url', cache: cache, headers: {foo: 'bar'}});

        $http({method: 'GET', url: '/url', cache: cache, headers: {foo: 'baz'}}).then(callback);
        $httpBackend.flush();

        expect(callback.mostRecentCall.args[0].config.headers.foo).toBe('baz');
      });


      it('should preserve config object when rejecting from pending cache', function() {
        $httpBackend.expect('GET', '/url').respond(404, 'content');
        $http({method: 'GET', url: '/url', cache: cache, headers: {foo: 'bar'}});

        $http({method: 'GET', url: '/url', cache: cache, headers: {foo: 'baz'}}).catch(callback);
        $httpBackend.flush();

        expect(callback.mostRecentCall.args[0].config.headers.foo).toBe('baz');
      });


      it('should allow the cached value to be an empty string', function() {
        cache.put('/abc', '');

        callback.andCallFake(function(response, status, headers) {
          expect(response).toBe('');
          expect(status).toBe(200);
        });

        $http({method: 'GET', url: '/abc', cache: cache}).success(callback);
        $rootScope.$digest();
        expect(callback).toHaveBeenCalled();
      });


      it('should default to status code 200 and empty headers if cache contains a non-array element',
          inject(function($rootScope) {
            cache.put('/myurl', 'simple response');
            $http.get('/myurl', {cache: cache}).success(function(data, status, headers) {
              expect(data).toBe('simple response');
              expect(status).toBe(200);
              expect(headers()).toEqual({});
              callback();
            });

            $rootScope.$digest();
            expect(callback).toHaveBeenCalledOnce();
          })
      );

      describe('$http.defaults.cache', function() {

        it('should be undefined by default', function() {
          expect($http.defaults.cache).toBeUndefined();
        });

        it('should cache requests when no cache given in request config', function() {
          $http.defaults.cache = cache;

          // First request fills the cache from server response.
          $httpBackend.expect('GET', '/url').respond(200, 'content');
          $http({method: 'GET', url: '/url'}); // Notice no cache given in config.
          $httpBackend.flush();

          // Second should be served from cache, without sending request to server.
          $http({method: 'get', url: '/url'}).success(callback);
          $rootScope.$digest();

          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toBe('content');

          // Invalidate cache entry.
          $http.defaults.cache.remove("/url");

          // After cache entry removed, a request should be sent to server.
          $httpBackend.expect('GET', '/url').respond(200, 'content');
          $http({method: 'GET', url: '/url'});
          $httpBackend.flush();
        });

        it('should have less priority than explicitly given cache', inject(function($cacheFactory) {
          var localCache = $cacheFactory('localCache');
          $http.defaults.cache = cache;

          // Fill local cache.
          $httpBackend.expect('GET', '/url').respond(200, 'content-local-cache');
          $http({method: 'GET', url: '/url', cache: localCache});
          $httpBackend.flush();

          // Fill default cache.
          $httpBackend.expect('GET', '/url').respond(200, 'content-default-cache');
          $http({method: 'GET', url: '/url'});
          $httpBackend.flush();

          // Serve request from default cache when no local given.
          $http({method: 'get', url: '/url'}).success(callback);
          $rootScope.$digest();
          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toBe('content-default-cache');
          callback.reset();

          // Serve request from local cache when it is given (but default filled too).
          $http({method: 'get', url: '/url', cache: localCache}).success(callback);
          $rootScope.$digest();
          expect(callback).toHaveBeenCalledOnce();
          expect(callback.mostRecentCall.args[0]).toBe('content-local-cache');
        }));

        it('should be skipped if {cache: false} is passed in request config', function() {
          $http.defaults.cache = cache;

          $httpBackend.expect('GET', '/url').respond(200, 'content');
          $http({method: 'GET', url: '/url'});
          $httpBackend.flush();

          $httpBackend.expect('GET', '/url').respond();
          $http({method: 'GET', url: '/url', cache: false});
          $httpBackend.flush();
        });
      });
    });


    describe('timeout', function() {

      it('should abort requests when timeout promise resolves', inject(function($q) {
        var canceler = $q.defer();

        $httpBackend.expect('GET', '/some').respond(200);

        $http({method: 'GET', url: '/some', timeout: canceler.promise}).catch(
            function(response) {
              expect(response.data).toBeUndefined();
              expect(response.status).toBe(-1);
              expect(response.headers()).toEqual({});
              expect(response.config.url).toBe('/some');
              callback();
            });

        $rootScope.$apply(function() {
          canceler.resolve();
        });

        expect(callback).toHaveBeenCalled();
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      }));


      it('should reject promise when timeout promise resolves', inject(function($timeout) {
        var onFulfilled = jasmine.createSpy('onFulfilled');
        var onRejected = jasmine.createSpy('onRejected');
        $httpBackend.expect('GET', '/some').respond(200);

        $http({method: 'GET', url: '/some', timeout: $timeout(noop, 10)}).then(onFulfilled, onRejected);

        $timeout.flush(100);

        expect(onFulfilled).not.toHaveBeenCalled();
        expect(onRejected).toHaveBeenCalledOnce();
      }));
    });


    describe('pendingRequests', function() {

      it('should be an array of pending requests', function() {
        $httpBackend.when('GET').respond(200);
        expect($http.pendingRequests.length).toBe(0);

        $http({method: 'get', url: '/some'});
        $rootScope.$digest();
        expect($http.pendingRequests.length).toBe(1);

        $httpBackend.flush();
        expect($http.pendingRequests.length).toBe(0);
      });


      it('should update pending requests even when served from cache', inject(function($rootScope) {
        $httpBackend.when('GET').respond(200);

        $http({method: 'get', url: '/cached', cache: true});
        $http({method: 'get', url: '/cached', cache: true});
        $rootScope.$digest();
        expect($http.pendingRequests.length).toBe(2);

        $httpBackend.flush();
        expect($http.pendingRequests.length).toBe(0);

        $http({method: 'get', url: '/cached', cache: true});
        spyOn($http.pendingRequests, 'push').andCallThrough();
        $rootScope.$digest();
        expect($http.pendingRequests.push).toHaveBeenCalledOnce();

        $rootScope.$apply();
        expect($http.pendingRequests.length).toBe(0);
      }));


      it('should remove the request before firing callbacks', function() {
        $httpBackend.when('GET').respond(200);
        $http({method: 'get', url: '/url'}).success(function() {
          expect($http.pendingRequests.length).toBe(0);
        });

        $rootScope.$digest();
        expect($http.pendingRequests.length).toBe(1);
        $httpBackend.flush();
      });
    });


    describe('defaults', function() {

      it('should expose the defaults object at runtime', function() {
        expect($http.defaults).toBeDefined();

        $http.defaults.headers.common.foo = 'bar';
        $httpBackend.expect('GET', '/url', undefined, function(headers) {
          return headers['foo'] == 'bar';
        }).respond('');

        $http.get('/url');
        $httpBackend.flush();
      });

      it('should have separate objects for defaults PUT and POST', function() {
        expect($http.defaults.headers.post).not.toBe($http.defaults.headers.put);
        expect($http.defaults.headers.post).not.toBe($http.defaults.headers.patch);
        expect($http.defaults.headers.put).not.toBe($http.defaults.headers.patch);
      });

      it('should expose default param serializer at runtime', function() {
        var paramSerializer = $http.defaults.paramSerializer;
        expect(paramSerializer({foo: 'foo', bar: ['bar', 'baz']})).toEqual('bar=bar&bar=baz&foo=foo');
      });
    });
  });


  it('should pass timeout, withCredentials and responseType', function() {
    var $httpBackend = jasmine.createSpy('$httpBackend');

    $httpBackend.andCallFake(function(m, u, d, c, h, timeout, withCredentials, responseType) {
      expect(timeout).toBe(12345);
      expect(withCredentials).toBe(true);
      expect(responseType).toBe('json');
    });

    module(function($provide) {
      $provide.value('$httpBackend', $httpBackend);
    });

    inject(function($http, $rootScope) {
      $http({
        method: 'GET',
        url: 'some.html',
        timeout: 12345,
        withCredentials: true,
        responseType: 'json'
      });
      $rootScope.$digest();
      expect($httpBackend).toHaveBeenCalledOnce();
    });

    $httpBackend.verifyNoOutstandingExpectation = noop;
  });


  it('should use withCredentials from default', function() {
    var $httpBackend = jasmine.createSpy('$httpBackend');

    $httpBackend.andCallFake(function(m, u, d, c, h, timeout, withCredentials, responseType) {
      expect(withCredentials).toBe(true);
    });

    module(function($provide) {
      $provide.value('$httpBackend', $httpBackend);
    });

    inject(function($http, $rootScope) {
      $http.defaults.withCredentials = true;
      $http({
        method: 'GET',
        url: 'some.html',
        timeout: 12345,
        responseType: 'json'
      });
      $rootScope.$digest();
      expect($httpBackend).toHaveBeenCalledOnce();
    });

    $httpBackend.verifyNoOutstandingExpectation = noop;
  });
});


describe('$http with $applyAsync', function() {
  var $http, $httpBackend, $rootScope, $browser, log;
  beforeEach(module(function($httpProvider) {
    $httpProvider.useApplyAsync(true);
  }, provideLog));


  beforeEach(inject(['$http', '$httpBackend', '$rootScope', '$browser', 'log', function(http, backend, scope, browser, logger) {
    $http = http;
    $httpBackend = backend;
    $rootScope = scope;
    $browser = browser;
    spyOn($rootScope, '$apply').andCallThrough();
    spyOn($rootScope, '$applyAsync').andCallThrough();
    spyOn($rootScope, '$digest').andCallThrough();
    spyOn($browser.defer, 'cancel').andCallThrough();
    log = logger;
  }]));


  it('should schedule coalesced apply on response', function() {
    var handler = jasmine.createSpy('handler');
    $httpBackend.expect('GET', '/template1.html').respond(200, '<h1>Header!</h1>', {});
    $http.get('/template1.html').then(handler);
    // Ensure requests are sent
    $rootScope.$digest();

    $httpBackend.flush(null, false);
    expect($rootScope.$applyAsync).toHaveBeenCalledOnce();
    expect(handler).not.toHaveBeenCalled();

    $browser.defer.flush();
    expect(handler).toHaveBeenCalledOnce();
  });


  it('should combine multiple responses within short time frame into a single $apply', function() {
    $httpBackend.expect('GET', '/template1.html').respond(200, '<h1>Header!</h1>', {});
    $httpBackend.expect('GET', '/template2.html').respond(200, '<p>Body!</p>', {});

    $http.get('/template1.html').then(log.fn('response 1'));
    $http.get('/template2.html').then(log.fn('response 2'));
    // Ensure requests are sent
    $rootScope.$digest();

    $httpBackend.flush(null, false);
    expect(log).toEqual([]);

    $browser.defer.flush();
    expect(log).toEqual(['response 1', 'response 2']);
  });


  it('should handle pending responses immediately if a digest occurs on $rootScope', function() {
    $httpBackend.expect('GET', '/template1.html').respond(200, '<h1>Header!</h1>', {});
    $httpBackend.expect('GET', '/template2.html').respond(200, '<p>Body!</p>', {});
    $httpBackend.expect('GET', '/template3.html').respond(200, '<p>Body!</p>', {});

    $http.get('/template1.html').then(log.fn('response 1'));
    $http.get('/template2.html').then(log.fn('response 2'));
    $http.get('/template3.html').then(log.fn('response 3'));
    // Ensure requests are sent
    $rootScope.$digest();

    // Intermediate $digest occurs before 3rd response is received, assert that pending responses
    /// are handled
    $httpBackend.flush(2);
    expect(log).toEqual(['response 1', 'response 2']);

    // Finally, third response is received, and a second coalesced $apply is started
    $httpBackend.flush(null, false);
    $browser.defer.flush();
    expect(log).toEqual(['response 1', 'response 2', 'response 3']);
  });
});

describe('$http without useLegacyPromiseExtensions', function() {
  var $httpBackend, $http;
  beforeEach(module(function($httpProvider) {
    $httpProvider.useLegacyPromiseExtensions(false);
  }, provideLog));

  beforeEach(inject(['$httpBackend', '$http', '$rootScope', function($hb, $h, $rs) {
    $httpBackend = $hb;
    $http = $h;
  }]));

  it('should throw when the success or error methods are called if useLegacyPromiseExtensions is false', function() {
    $httpBackend.expect('GET', '/url').respond('');
    var promise = $http({url: '/url'});

    function callSucess() {
      promise.success();
    }

    function callError() {
      promise.error();
    }

    expect(callSucess).toThrowMinErr(
            '$http', 'legacy', 'The method `success` on the promise returned from `$http` has been disabled.');
    expect(callError).toThrowMinErr(
            '$http', 'legacy', 'The method `error` on the promise returned from `$http` has been disabled.');
  });
});

describe('$http param serializers', function() {

  var defSer, jqrSer;
  beforeEach(inject(function($httpParamSerializer, $httpParamSerializerJQLike) {
    defSer = $httpParamSerializer;
    jqrSer = $httpParamSerializerJQLike;
  }));

  describe('common functionality', function() {

    it('should return empty string for null or undefined params', function() {
        expect(defSer(undefined)).toEqual('');
        expect(jqrSer(undefined)).toEqual('');
        expect(defSer(null)).toEqual('');
        expect(jqrSer(null)).toEqual('');
    });

    it('should serialize objects', function() {
      expect(defSer({foo: 'foov', bar: 'barv'})).toEqual('bar=barv&foo=foov');
      expect(jqrSer({foo: 'foov', bar: 'barv'})).toEqual('bar=barv&foo=foov');
      expect(defSer({someDate: new Date('2014-07-15T17:30:00.000Z')})).toEqual('someDate=2014-07-15T17:30:00.000Z');
      expect(jqrSer({someDate: new Date('2014-07-15T17:30:00.000Z')})).toEqual('someDate=2014-07-15T17:30:00.000Z');
    });

  });

  describe('default array serialization', function() {

    it('should serialize arrays by repeating param name', function() {
      expect(defSer({a: 'b', foo: ['bar', 'baz']})).toEqual('a=b&foo=bar&foo=baz');
    });
  });

  describe('jquery array and objects serialization', function() {

    it('should serialize arrays by repeating param name with [] suffix', function() {
      expect(jqrSer({a: 'b', foo: ['bar', 'baz']})).toEqual('a=b&foo%5B%5D=bar&foo%5B%5D=baz');
      expect(decodeURIComponent(jqrSer({a: 'b', foo: ['bar', 'baz']}))).toEqual('a=b&foo[]=bar&foo[]=baz');
    });

    it('should serialize objects by repeating param name with [key] suffix', function() {
      expect(jqrSer({a: 'b', foo: {'bar': 'barv', 'baz': 'bazv'}})).toEqual('a=b&foo%5Bbar%5D=barv&foo%5Bbaz%5D=bazv');
                                                                           //a=b&foo[bar]=barv&foo[baz]=bazv
    });

    it('should serialize nested objects by repeating param name with [key] suffix', function() {
      expect(jqrSer({a: ['b', {c: 'd'}], e: {f: 'g', 'h': ['i', 'j']}})).toEqual(
         'a%5B%5D=b&a%5B1%5D%5Bc%5D=d&e%5Bf%5D=g&e%5Bh%5D%5B%5D=i&e%5Bh%5D%5B%5D=j');
         //a[]=b&a[1][c]=d&e[f]=g&e[h][]=i&e[h][]=j
    });

    it('should serialize objects inside array elements using their index', function() {
      expect(jqrSer({a: ['b', 'c'], d: [{e: 'f', g: 'h'}, 'i', {j: 'k'}]})).toEqual(
         'a%5B%5D=b&a%5B%5D=c&d%5B0%5D%5Be%5D=f&d%5B0%5D%5Bg%5D=h&d%5B%5D=i&d%5B2%5D%5Bj%5D=k');
         //a[]=b&a[]=c&d[0][e]=f&d[0][g]=h&d[]=i&d[2][j]=k
    });
  });

});
