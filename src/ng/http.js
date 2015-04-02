'use strict';

var APPLICATION_JSON = 'application/json';
var CONTENT_TYPE_APPLICATION_JSON = {'Content-Type': APPLICATION_JSON + ';charset=utf-8'};
var JSON_START = /^\[|^\{(?!\{)/;
var JSON_ENDS = {
  '[': /]$/,
  '{': /}$/
};
var JSON_PROTECTION_PREFIX = /^\)\]\}',?\n/;

function paramSerializerFactory(jQueryMode) {

  function serializeValue(v) {
    if (isObject(v)) {
      return isDate(v) ? v.toISOString() : toJson(v);
    }
    return v;
  }

  return function paramSerializer(params) {
    if (!params) return '';
    var parts = [];
    forEachSorted(params, function(value, key) {
      if (value === null || isUndefined(value)) return;
      if (isArray(value) || isObject(value) && jQueryMode) {
        forEach(value, function(v, k) {
          var keySuffix = jQueryMode ? '[' + (!isArray(value) ? k : '') + ']' : '';
          parts.push(encodeUriQuery(key + keySuffix)  + '=' + encodeUriQuery(serializeValue(v)));
        });
      } else {
        parts.push(encodeUriQuery(key) + '=' + encodeUriQuery(serializeValue(value)));
      }
    });

    return parts.length > 0 ? parts.join('&') : '';
  };
}

function $HttpParamSerializerProvider() {
  /**
   * @ngdoc service
   * @name $httpParamSerializer
   * @description
   *
   * Default $http params serializer that converts objects to a part of a request URL
   * according to the following rules:
   * * `{'foo': 'bar'}` results in `foo=bar`
   * * `{'foo': Date.now()}` results in `foo=2015-04-01T09%3A50%3A49.262Z` (`toISOString()` and encoded representation of a Date object)
   * * `{'foo': ['bar', 'baz']}` results in `foo=bar&foo=baz` (repeated key for each array element)
   * * `{'foo': {'bar':'baz'}}` results in `foo=%7B%22bar%22%3A%22baz%22%7D"` (stringified and encoded representation of an object)
   * */
  this.$get = function() {
    return paramSerializerFactory(false);
  };
}

function $HttpParamSerializerJQLikeProvider() {
  /**
   * @ngdoc service
   * @name $httpParamSerializerJQLike
   * @description
   *
   * Alternative $http params serializer that follows jQuerys `param()` method {http://api.jquery.com/jquery.param/} logic.
   * */
  this.$get = function() {
    return paramSerializerFactory(true);
  };
}

function defaultHttpResponseTransform(data, headers) {
  if (isString(data)) {
    // Strip json vulnerability protection prefix and trim whitespace
    var tempData = data.replace(JSON_PROTECTION_PREFIX, '').trim();

    if (tempData) {
      var contentType = headers('Content-Type');
      if ((contentType && (contentType.indexOf(APPLICATION_JSON) === 0)) || isJsonLike(tempData)) {
        data = fromJson(tempData);
      }
    }
  }

  return data;
}

function isJsonLike(str) {
    var jsonStart = str.match(JSON_START);
    return jsonStart && JSON_ENDS[jsonStart[0]].test(str);
}

/**
 * Parse headers into key value object
 *
 * @param {string} headers Raw headers as a string
 * @returns {Object} Parsed headers as key value object
 */
function parseHeaders(headers) {
  var parsed = createMap(), i;

  function fillInParsed(key, val) {
    if (key) {
      parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
    }
  }

  if (isString(headers)) {
    forEach(headers.split('\n'), function(line) {
      i = line.indexOf(':');
      fillInParsed(lowercase(trim(line.substr(0, i))), trim(line.substr(i + 1)));
    });
  } else if (isObject(headers)) {
    forEach(headers, function(headerVal, headerKey) {
      fillInParsed(lowercase(headerKey), trim(headerVal));
    });
  }

  return parsed;
}


/**
 * Returns a function that provides access to parsed headers.
 *
 * Headers are lazy parsed when first requested.
 * @see parseHeaders
 *
 * @param {(string|Object)} headers Headers to provide access to.
 * @returns {function(string=)} Returns a getter function which if called with:
 *
 *   - if called with single an argument returns a single header value or null
 *   - if called with no arguments returns an object containing all headers.
 */
function headersGetter(headers) {
  var headersObj;

  return function(name) {
    if (!headersObj) headersObj =  parseHeaders(headers);

    if (name) {
      var value = headersObj[lowercase(name)];
      if (value === void 0) {
        value = null;
      }
      return value;
    }

    return headersObj;
  };
}


/**
 * Chain all given functions
 *
 * This function is used for both request and response transforming
 *
 * @param {*} data Data to transform.
 * @param {function(string=)} headers HTTP headers getter fn.
 * @param {number} status HTTP status code of the response.
 * @param {(Function|Array.<Function>)} fns Function or an array of functions.
 * @returns {*} Transformed data.
 */
function transformData(data, headers, status, fns) {
  if (isFunction(fns)) {
    return fns(data, headers, status);
  }

  forEach(fns, function(fn) {
    data = fn(data, headers, status);
  });

  return data;
}


function isSuccess(status) {
  return 200 <= status && status < 300;
}


/**
 * @ngdoc provider
 * @name $httpProvider
 * @description
 * Use `$httpProvider` to change the default behavior of the {@link ng.$http $http} service.
 * */
function $HttpProvider() {
  /**
   * @ngdoc property
   * @name $httpProvider#defaults
   * @description
   *
   * Object containing default values for all {@link ng.$http $http} requests.
   *
   * - **`defaults.cache`** - {Object} - an object built with {@link ng.$cacheFactory `$cacheFactory`}
   * that will provide the cache for all requests who set their `cache` property to `true`.
   * If you set the `default.cache = false` then only requests that specify their own custom
   * cache object will be cached. See {@link $http#caching $http Caching} for more information.
   *
   * - **`defaults.xsrfCookieName`** - {string} - Name of cookie containing the XSRF token.
   * Defaults value is `'XSRF-TOKEN'`.
   *
   * - **`defaults.xsrfHeaderName`** - {string} - Name of HTTP header to populate with the
   * XSRF token. Defaults value is `'X-XSRF-TOKEN'`.
   *
   * - **`defaults.headers`** - {Object} - Default headers for all $http requests.
   * Refer to {@link ng.$http#setting-http-headers $http} for documentation on
   * setting default headers.
   *     - **`defaults.headers.common`**
   *     - **`defaults.headers.post`**
   *     - **`defaults.headers.put`**
   *     - **`defaults.headers.patch`**
   *
   * - **`defaults.paramSerializer`** - {string|function(Object<string,string>):string} - A function used to prepare string representation
   * of request parameters (specified as an object).
   * Is specified as string, it is interpreted as function registered in with the {$injector}.
   * Defaults to {$httpParamSerializer}.
   *
   **/
  var defaults = this.defaults = {
    // transform incoming response data
    transformResponse: [defaultHttpResponseTransform],

    // transform outgoing request data
    transformRequest: [function(d) {
      return isObject(d) && !isFile(d) && !isBlob(d) && !isFormData(d) ? toJson(d) : d;
    }],

    // default headers
    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*'
      },
      post:   shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
      put:    shallowCopy(CONTENT_TYPE_APPLICATION_JSON),
      patch:  shallowCopy(CONTENT_TYPE_APPLICATION_JSON)
    },

    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',

    paramSerializer: '$httpParamSerializer'
  };

  var useApplyAsync = false;
  /**
   * @ngdoc method
   * @name $httpProvider#useApplyAsync
   * @description
   *
   * Configure $http service to combine processing of multiple http responses received at around
   * the same time via {@link ng.$rootScope.Scope#$applyAsync $rootScope.$applyAsync}. This can result in
   * significant performance improvement for bigger applications that make many HTTP requests
   * concurrently (common during application bootstrap).
   *
   * Defaults to false. If no value is specified, returns the current configured value.
   *
   * @param {boolean=} value If true, when requests are loaded, they will schedule a deferred
   *    "apply" on the next tick, giving time for subsequent requests in a roughly ~10ms window
   *    to load and share the same digest cycle.
   *
   * @returns {boolean|Object} If a value is specified, returns the $httpProvider for chaining.
   *    otherwise, returns the current configured value.
   **/
  this.useApplyAsync = function(value) {
    if (isDefined(value)) {
      useApplyAsync = !!value;
      return this;
    }
    return useApplyAsync;
  };

  /**
   * @ngdoc property
   * @name $httpProvider#interceptors
   * @description
   *
   * Array containing service factories for all synchronous or asynchronous {@link ng.$http $http}
   * pre-processing of request or postprocessing of responses.
   *
   * These service factories are ordered by request, i.e. they are applied in the same order as the
   * array, on request, but reverse order, on response.
   *
   * {@link ng.$http#interceptors Interceptors detailed info}
   **/
  var interceptorFactories = this.interceptors = [];

  this.$get = ['$httpBackend', '$$cookieReader', '$cacheFactory', '$rootScope', '$q', '$injector',
      function($httpBackend, $$cookieReader, $cacheFactory, $rootScope, $q, $injector) {

    var defaultCache = $cacheFactory('$http');

    /**
     * Make sure that default param serializer is exposed as a function
     */
    defaults.paramSerializer = isString(defaults.paramSerializer) ?
      $injector.get(defaults.paramSerializer) : defaults.paramSerializer;

    /**
     * Interceptors stored in reverse order. Inner interceptors before outer interceptors.
     * The reversal is needed so that we can build up the interception chain around the
     * server request.
     */
    var reversedInterceptors = [];

    forEach(interceptorFactories, function(interceptorFactory) {
      reversedInterceptors.unshift(isString(interceptorFactory)
          ? $injector.get(interceptorFactory) : $injector.invoke(interceptorFactory));
    });

    /**
     * @ngdoc service
     * @kind function
     * @name $http
     * @requires ng.$httpBackend
     * @requires $cacheFactory
     * @requires $rootScope
     * @requires $q
     * @requires $injector
     *
     * @description
     * The `$http` service is a core Angular service that facilitates communication with the remote
     * HTTP servers via the browser's [XMLHttpRequest](https://developer.mozilla.org/en/xmlhttprequest)
     * object or via [JSONP](http://en.wikipedia.org/wiki/JSONP).
     *
     * For unit testing applications that use `$http` service, see
     * {@link ngMock.$httpBackend $httpBackend mock}.
     *
     * For a higher level of abstraction, please check out the {@link ngResource.$resource
     * $resource} service.
     *
     * The $http API is based on the {@link ng.$q deferred/promise APIs} exposed by
     * the $q service. While for simple usage patterns this doesn't matter much, for advanced usage
     * it is important to familiarize yourself with these APIs and the guarantees they provide.
     *
     *
     * ## General usage
     * The `$http` service is a function which takes a single argument — a configuration object —
     * that is used to generate an HTTP request and returns  a {@link ng.$q promise}
     * with two $http specific methods: `success` and `error`.
     *
     * ```js
     *   // Simple GET request example :
     *   $http.get('/someUrl').
     *     success(function(data, status, headers, config) {
     *       // this callback will be called asynchronously
     *       // when the response is available
     *     }).
     *     error(function(data, status, headers, config) {
     *       // called asynchronously if an error occurs
     *       // or server returns response with an error status.
     *     });
     * ```
     *
     * ```js
     *   // Simple POST request example (passing data) :
     *   $http.post('/someUrl', {msg:'hello word!'}).
     *     success(function(data, status, headers, config) {
     *       // this callback will be called asynchronously
     *       // when the response is available
     *     }).
     *     error(function(data, status, headers, config) {
     *       // called asynchronously if an error occurs
     *       // or server returns response with an error status.
     *     });
     * ```
     *
     *
     * Since the returned value of calling the $http function is a `promise`, you can also use
     * the `then` method to register callbacks, and these callbacks will receive a single argument –
     * an object representing the response. See the API signature and type info below for more
     * details.
     *
     * A response status code between 200 and 299 is considered a success status and
     * will result in the success callback being called. Note that if the response is a redirect,
     * XMLHttpRequest will transparently follow it, meaning that the error callback will not be
     * called for such responses.
     *
     * ## Writing Unit Tests that use $http
     * When unit testing (using {@link ngMock ngMock}), it is necessary to call
     * {@link ngMock.$httpBackend#flush $httpBackend.flush()} to flush each pending
     * request using trained responses.
     *
     * ```
     * $httpBackend.expectGET(...);
     * $http.get(...);
     * $httpBackend.flush();
     * ```
     *
     * ## Shortcut methods
     *
     * Shortcut methods are also available. All shortcut methods require passing in the URL, and
     * request data must be passed in for POST/PUT requests.
     *
     * ```js
     *   $http.get('/someUrl').success(successCallback);
     *   $http.post('/someUrl', data).success(successCallback);
     * ```
     *
     * Complete list of shortcut methods:
     *
     * - {@link ng.$http#get $http.get}
     * - {@link ng.$http#head $http.head}
     * - {@link ng.$http#post $http.post}
     * - {@link ng.$http#put $http.put}
     * - {@link ng.$http#delete $http.delete}
     * - {@link ng.$http#jsonp $http.jsonp}
     * - {@link ng.$http#patch $http.patch}
     *
     *
     * ## Setting HTTP Headers
     *
     * The $http service will automatically add certain HTTP headers to all requests. These defaults
     * can be fully configured by accessing the `$httpProvider.defaults.headers` configuration
     * object, which currently contains this default configuration:
     *
     * - `$httpProvider.defaults.headers.common` (headers that are common for all requests):
     *   - `Accept: application/json, text/plain, * / *`
     * - `$httpProvider.defaults.headers.post`: (header defaults for POST requests)
     *   - `Content-Type: application/json`
     * - `$httpProvider.defaults.headers.put` (header defaults for PUT requests)
     *   - `Content-Type: application/json`
     *
     * To add or overwrite these defaults, simply add or remove a property from these configuration
     * objects. To add headers for an HTTP method other than POST or PUT, simply add a new object
     * with the lowercased HTTP method name as the key, e.g.
     * `$httpProvider.defaults.headers.get = { 'My-Header' : 'value' }`.
     *
     * The defaults can also be set at runtime via the `$http.defaults` object in the same
     * fashion. For example:
     *
     * ```
     * module.run(function($http) {
     *   $http.defaults.headers.common.Authorization = 'Basic YmVlcDpib29w'
     * });
     * ```
     *
     * In addition, you can supply a `headers` property in the config object passed when
     * calling `$http(config)`, which overrides the defaults without changing them globally.
     *
     * To explicitly remove a header automatically added via $httpProvider.defaults.headers on a per request basis,
     * Use the `headers` property, setting the desired header to `undefined`. For example:
     *
     * ```js
     * var req = {
     *  method: 'POST',
     *  url: 'http://example.com',
     *  headers: {
     *    'Content-Type': undefined
     *  },
     *  data: { test: 'test' }
     * }
     *
     * $http(req).success(function(){...}).error(function(){...});
     * ```
     *
     * ## Transforming Requests and Responses
     *
     * Both requests and responses can be transformed using transformation functions: `transformRequest`
     * and `transformResponse`. These properties can be a single function that returns
     * the transformed value (`function(data, headersGetter, status)`) or an array of such transformation functions,
     * which allows you to `push` or `unshift` a new transformation function into the transformation chain.
     *
     * ### Default Transformations
     *
     * The `$httpProvider` provider and `$http` service expose `defaults.transformRequest` and
     * `defaults.transformResponse` properties. If a request does not provide its own transformations
     * then these will be applied.
     *
     * You can augment or replace the default transformations by modifying these properties by adding to or
     * replacing the array.
     *
     * Angular provides the following default transformations:
     *
     * Request transformations (`$httpProvider.defaults.transformRequest` and `$http.defaults.transformRequest`):
     *
     * - If the `data` property of the request configuration object contains an object, serialize it
     *   into JSON format.
     *
     * Response transformations (`$httpProvider.defaults.transformResponse` and `$http.defaults.transformResponse`):
     *
     *  - If XSRF prefix is detected, strip it (see Security Considerations section below).
     *  - If JSON response is detected, deserialize it using a JSON parser.
     *
     *
     * ### Overriding the Default Transformations Per Request
     *
     * If you wish override the request/response transformations only for a single request then provide
     * `transformRequest` and/or `transformResponse` properties on the configuration object passed
     * into `$http`.
     *
     * Note that if you provide these properties on the config object the default transformations will be
     * overwritten. If you wish to augment the default transformations then you must include them in your
     * local transformation array.
     *
     * The following code demonstrates adding a new response transformation to be run after the default response
     * transformations have been run.
     *
     * ```js
     * function appendTransform(defaults, transform) {
     *
     *   // We can't guarantee that the default transformation is an array
     *   defaults = angular.isArray(defaults) ? defaults : [defaults];
     *
     *   // Append the new transformation to the defaults
     *   return defaults.concat(transform);
     * }
     *
     * $http({
     *   url: '...',
     *   method: 'GET',
     *   transformResponse: appendTransform($http.defaults.transformResponse, function(value) {
     *     return doTransform(value);
     *   })
     * });
     * ```
     *
     *
     * ## Caching
     *
     * To enable caching, set the request configuration `cache` property to `true` (to use default
     * cache) or to a custom cache object (built with {@link ng.$cacheFactory `$cacheFactory`}).
     * When the cache is enabled, `$http` stores the response from the server in the specified
     * cache. The next time the same request is made, the response is served from the cache without
     * sending a request to the server.
     *
     * Note that even if the response is served from cache, delivery of the data is asynchronous in
     * the same way that real requests are.
     *
     * If there are multiple GET requests for the same URL that should be cached using the same
     * cache, but the cache is not populated yet, only one request to the server will be made and
     * the remaining requests will be fulfilled using the response from the first request.
     *
     * You can change the default cache to a new object (built with
     * {@link ng.$cacheFactory `$cacheFactory`}) by updating the
     * {@link ng.$http#defaults `$http.defaults.cache`} property. All requests who set
     * their `cache` property to `true` will now use this cache object.
     *
     * If you set the default cache to `false` then only requests that specify their own custom
     * cache object will be cached.
     *
     * ## Interceptors
     *
     * Before you start creating interceptors, be sure to understand the
     * {@link ng.$q $q and deferred/promise APIs}.
     *
     * For purposes of global error handling, authentication, or any kind of synchronous or
     * asynchronous pre-processing of request or postprocessing of responses, it is desirable to be
     * able to intercept requests before they are handed to the server and
     * responses before they are handed over to the application code that
     * initiated these requests. The interceptors leverage the {@link ng.$q
     * promise APIs} to fulfill this need for both synchronous and asynchronous pre-processing.
     *
     * The interceptors are service factories that are registered with the `$httpProvider` by
     * adding them to the `$httpProvider.interceptors` array. The factory is called and
     * injected with dependencies (if specified) and returns the interceptor.
     *
     * There are two kinds of interceptors (and two kinds of rejection interceptors):
     *
     *   * `request`: interceptors get called with a http `config` object. The function is free to
     *     modify the `config` object or create a new one. The function needs to return the `config`
     *     object directly, or a promise containing the `config` or a new `config` object.
     *   * `requestError`: interceptor gets called when a previous interceptor threw an error or
     *     resolved with a rejection.
     *   * `response`: interceptors get called with http `response` object. The function is free to
     *     modify the `response` object or create a new one. The function needs to return the `response`
     *     object directly, or as a promise containing the `response` or a new `response` object.
     *   * `responseError`: interceptor gets called when a previous interceptor threw an error or
     *     resolved with a rejection.
     *
     *
     * ```js
     *   // register the interceptor as a service
     *   $provide.factory('myHttpInterceptor', function($q, dependency1, dependency2) {
     *     return {
     *       // optional method
     *       'request': function(config) {
     *         // do something on success
     *         return config;
     *       },
     *
     *       // optional method
     *      'requestError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       },
     *
     *
     *
     *       // optional method
     *       'response': function(response) {
     *         // do something on success
     *         return response;
     *       },
     *
     *       // optional method
     *      'responseError': function(rejection) {
     *         // do something on error
     *         if (canRecover(rejection)) {
     *           return responseOrNewPromise
     *         }
     *         return $q.reject(rejection);
     *       }
     *     };
     *   });
     *
     *   $httpProvider.interceptors.push('myHttpInterceptor');
     *
     *
     *   // alternatively, register the interceptor via an anonymous factory
     *   $httpProvider.interceptors.push(function($q, dependency1, dependency2) {
     *     return {
     *      'request': function(config) {
     *          // same as above
     *       },
     *
     *       'response': function(response) {
     *          // same as above
     *       }
     *     };
     *   });
     * ```
     *
     * ## Security Considerations
     *
     * When designing web applications, consider security threats from:
     *
     * - [JSON vulnerability](http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx)
     * - [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery)
     *
     * Both server and the client must cooperate in order to eliminate these threats. Angular comes
     * pre-configured with strategies that address these issues, but for this to work backend server
     * cooperation is required.
     *
     * ### JSON Vulnerability Protection
     *
     * A [JSON vulnerability](http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx)
     * allows third party website to turn your JSON resource URL into
     * [JSONP](http://en.wikipedia.org/wiki/JSONP) request under some conditions. To
     * counter this your server can prefix all JSON requests with following string `")]}',\n"`.
     * Angular will automatically strip the prefix before processing it as JSON.
     *
     * For example if your server needs to return:
     * ```js
     * ['one','two']
     * ```
     *
     * which is vulnerable to attack, your server can return:
     * ```js
     * )]}',
     * ['one','two']
     * ```
     *
     * Angular will strip the prefix, before processing the JSON.
     *
     *
     * ### Cross Site Request Forgery (XSRF) Protection
     *
     * [XSRF](http://en.wikipedia.org/wiki/Cross-site_request_forgery) is a technique by which
     * an unauthorized site can gain your user's private data. Angular provides a mechanism
     * to counter XSRF. When performing XHR requests, the $http service reads a token from a cookie
     * (by default, `XSRF-TOKEN`) and sets it as an HTTP header (`X-XSRF-TOKEN`). Since only
     * JavaScript that runs on your domain could read the cookie, your server can be assured that
     * the XHR came from JavaScript running on your domain. The header will not be set for
     * cross-domain requests.
     *
     * To take advantage of this, your server needs to set a token in a JavaScript readable session
     * cookie called `XSRF-TOKEN` on the first HTTP GET request. On subsequent XHR requests the
     * server can verify that the cookie matches `X-XSRF-TOKEN` HTTP header, and therefore be sure
     * that only JavaScript running on your domain could have sent the request. The token must be
     * unique for each user and must be verifiable by the server (to prevent the JavaScript from
     * making up its own tokens). We recommend that the token is a digest of your site's
     * authentication cookie with a [salt](https://en.wikipedia.org/wiki/Salt_(cryptography&#41;)
     * for added security.
     *
     * The name of the headers can be specified using the xsrfHeaderName and xsrfCookieName
     * properties of either $httpProvider.defaults at config-time, $http.defaults at run-time,
     * or the per-request config object.
     *
     *
     * @param {object} config Object describing the request to be made and how it should be
     *    processed. The object has following properties:
     *
     *    - **method** – `{string}` – HTTP method (e.g. 'GET', 'POST', etc)
     *    - **url** – `{string}` – Absolute or relative URL of the resource that is being requested.
     *    - **params** – `{Object.<string|Object>}` – Map of strings or objects which will be turned
     *      to `?key1=value1&key2=value2` after the url. If the value is not a string, it will be
     *      JSONified.
     *    - **data** – `{string|Object}` – Data to be sent as the request message data.
     *    - **headers** – `{Object}` – Map of strings or functions which return strings representing
     *      HTTP headers to send to the server. If the return value of a function is null, the
     *      header will not be sent. Functions accept a config object as an argument.
     *    - **xsrfHeaderName** – `{string}` – Name of HTTP header to populate with the XSRF token.
     *    - **xsrfCookieName** – `{string}` – Name of cookie containing the XSRF token.
     *    - **transformRequest** –
     *      `{function(data, headersGetter)|Array.<function(data, headersGetter)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      request body and headers and returns its transformed (typically serialized) version.
     *      See {@link ng.$http#overriding-the-default-transformations-per-request
     *      Overriding the Default Transformations}
     *    - **transformResponse** –
     *      `{function(data, headersGetter, status)|Array.<function(data, headersGetter, status)>}` –
     *      transform function or an array of such functions. The transform function takes the http
     *      response body, headers and status and returns its transformed (typically deserialized) version.
     *      See {@link ng.$http#overriding-the-default-transformations-per-request
     *      Overriding the Default Transformations}
     *    - **paramSerializer** - {string|function(Object<string,string>):string} - A function used to prepare string representation
     *      of request parameters (specified as an object).
     *      Is specified as string, it is interpreted as function registered in with the {$injector}.
     *    - **cache** – `{boolean|Cache}` – If true, a default $http cache will be used to cache the
     *      GET request, otherwise if a cache instance built with
     *      {@link ng.$cacheFactory $cacheFactory}, this cache will be used for
     *      caching.
     *    - **timeout** – `{number|Promise}` – timeout in milliseconds, or {@link ng.$q promise}
     *      that should abort the request when resolved.
     *    - **withCredentials** - `{boolean}` - whether to set the `withCredentials` flag on the
     *      XHR object. See [requests with credentials](https://developer.mozilla.org/docs/Web/HTTP/Access_control_CORS#Requests_with_credentials)
     *      for more information.
     *    - **responseType** - `{string}` - see
     *      [requestType](https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#responseType).
     *
     * @returns {HttpPromise} Returns a {@link ng.$q promise} object with the
     *   standard `then` method and two http specific methods: `success` and `error`. The `then`
     *   method takes two arguments a success and an error callback which will be called with a
     *   response object. The `success` and `error` methods take a single argument - a function that
     *   will be called when the request succeeds or fails respectively. The arguments passed into
     *   these functions are destructured representation of the response object passed into the
     *   `then` method. The response object has these properties:
     *
     *   - **data** – `{string|Object}` – The response body transformed with the transform
     *     functions.
     *   - **status** – `{number}` – HTTP status code of the response.
     *   - **headers** – `{function([headerName])}` – Header getter function.
     *   - **config** – `{Object}` – The configuration object that was used to generate the request.
     *   - **statusText** – `{string}` – HTTP status text of the response.
     *
     * @property {Array.<Object>} pendingRequests Array of config objects for currently pending
     *   requests. This is primarily meant to be used for debugging purposes.
     *
     *
     * @example
<example module="httpExample">
<file name="index.html">
  <div ng-controller="FetchController">
    <select ng-model="method">
      <option>GET</option>
      <option>JSONP</option>
    </select>
    <input type="text" ng-model="url" size="80"/>
    <button id="fetchbtn" ng-click="fetch()">fetch</button><br>
    <button id="samplegetbtn" ng-click="updateModel('GET', 'http-hello.html')">Sample GET</button>
    <button id="samplejsonpbtn"
      ng-click="updateModel('JSONP',
                    'https://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero')">
      Sample JSONP
    </button>
    <button id="invalidjsonpbtn"
      ng-click="updateModel('JSONP', 'https://angularjs.org/doesntexist&callback=JSON_CALLBACK')">
        Invalid JSONP
      </button>
    <pre>http status code: {{status}}</pre>
    <pre>http response data: {{data}}</pre>
  </div>
</file>
<file name="script.js">
  angular.module('httpExample', [])
    .controller('FetchController', ['$scope', '$http', '$templateCache',
      function($scope, $http, $templateCache) {
        $scope.method = 'GET';
        $scope.url = 'http-hello.html';

        $scope.fetch = function() {
          $scope.code = null;
          $scope.response = null;

          $http({method: $scope.method, url: $scope.url, cache: $templateCache}).
            success(function(data, status) {
              $scope.status = status;
              $scope.data = data;
            }).
            error(function(data, status) {
              $scope.data = data || "Request failed";
              $scope.status = status;
          });
        };

        $scope.updateModel = function(method, url) {
          $scope.method = method;
          $scope.url = url;
        };
      }]);
</file>
<file name="http-hello.html">
  Hello, $http!
</file>
<file name="protractor.js" type="protractor">
  var status = element(by.binding('status'));
  var data = element(by.binding('data'));
  var fetchBtn = element(by.id('fetchbtn'));
  var sampleGetBtn = element(by.id('samplegetbtn'));
  var sampleJsonpBtn = element(by.id('samplejsonpbtn'));
  var invalidJsonpBtn = element(by.id('invalidjsonpbtn'));

  it('should make an xhr GET request', function() {
    sampleGetBtn.click();
    fetchBtn.click();
    expect(status.getText()).toMatch('200');
    expect(data.getText()).toMatch(/Hello, \$http!/);
  });

// Commented out due to flakes. See https://github.com/angular/angular.js/issues/9185
// it('should make a JSONP request to angularjs.org', function() {
//   sampleJsonpBtn.click();
//   fetchBtn.click();
//   expect(status.getText()).toMatch('200');
//   expect(data.getText()).toMatch(/Super Hero!/);
// });

  it('should make JSONP request to invalid URL and invoke the error handler',
      function() {
    invalidJsonpBtn.click();
    fetchBtn.click();
    expect(status.getText()).toMatch('0');
    expect(data.getText()).toMatch('Request failed');
  });
</file>
</example>
     */
    function $http(requestConfig) {

      if (!angular.isObject(requestConfig)) {
        throw minErr('$http')('badreq', 'Http request configuration must be an object.  Received: {0}', requestConfig);
      }

      var config = extend({
        method: 'get',
        transformRequest: defaults.transformRequest,
        transformResponse: defaults.transformResponse,
        paramSerializer: defaults.paramSerializer
      }, requestConfig);

      config.headers = mergeHeaders(requestConfig);
      config.method = uppercase(config.method);
      config.paramSerializer = isString(config.paramSerializer) ?
        $injector.get(config.paramSerializer) : config.paramSerializer;

      var serverRequest = function(config) {
        var headers = config.headers;
        var reqData = transformData(config.data, headersGetter(headers), undefined, config.transformRequest);

        // strip content-type if data is undefined
        if (isUndefined(reqData)) {
          forEach(headers, function(value, header) {
            if (lowercase(header) === 'content-type') {
                delete headers[header];
            }
          });
        }

        if (isUndefined(config.withCredentials) && !isUndefined(defaults.withCredentials)) {
          config.withCredentials = defaults.withCredentials;
        }

        // send request
        return sendReq(config, reqData).then(transformResponse, transformResponse);
      };

      var chain = [serverRequest, undefined];
      var promise = $q.when(config);

      // apply interceptors
      forEach(reversedInterceptors, function(interceptor) {
        if (interceptor.request || interceptor.requestError) {
          chain.unshift(interceptor.request, interceptor.requestError);
        }
        if (interceptor.response || interceptor.responseError) {
          chain.push(interceptor.response, interceptor.responseError);
        }
      });

      while (chain.length) {
        var thenFn = chain.shift();
        var rejectFn = chain.shift();

        promise = promise.then(thenFn, rejectFn);
      }

      promise.success = function(fn) {
        assertArgFn(fn, 'fn');

        promise.then(function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      promise.error = function(fn) {
        assertArgFn(fn, 'fn');

        promise.then(null, function(response) {
          fn(response.data, response.status, response.headers, config);
        });
        return promise;
      };

      return promise;

      function transformResponse(response) {
        // make a copy since the response must be cacheable
        var resp = extend({}, response);
        if (!response.data) {
          resp.data = response.data;
        } else {
          resp.data = transformData(response.data, response.headers, response.status, config.transformResponse);
        }
        return (isSuccess(response.status))
          ? resp
          : $q.reject(resp);
      }

      function executeHeaderFns(headers, config) {
        var headerContent, processedHeaders = {};

        forEach(headers, function(headerFn, header) {
          if (isFunction(headerFn)) {
            headerContent = headerFn(config);
            if (headerContent != null) {
              processedHeaders[header] = headerContent;
            }
          } else {
            processedHeaders[header] = headerFn;
          }
        });

        return processedHeaders;
      }

      function mergeHeaders(config) {
        var defHeaders = defaults.headers,
            reqHeaders = extend({}, config.headers),
            defHeaderName, lowercaseDefHeaderName, reqHeaderName;

        defHeaders = extend({}, defHeaders.common, defHeaders[lowercase(config.method)]);

        // using for-in instead of forEach to avoid unecessary iteration after header has been found
        defaultHeadersIteration:
        for (defHeaderName in defHeaders) {
          lowercaseDefHeaderName = lowercase(defHeaderName);

          for (reqHeaderName in reqHeaders) {
            if (lowercase(reqHeaderName) === lowercaseDefHeaderName) {
              continue defaultHeadersIteration;
            }
          }

          reqHeaders[defHeaderName] = defHeaders[defHeaderName];
        }

        // execute if header value is a function for merged headers
        return executeHeaderFns(reqHeaders, shallowCopy(config));
      }
    }

    $http.pendingRequests = [];

    /**
     * @ngdoc method
     * @name $http#get
     *
     * @description
     * Shortcut method to perform `GET` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name $http#delete
     *
     * @description
     * Shortcut method to perform `DELETE` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name $http#head
     *
     * @description
     * Shortcut method to perform `HEAD` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name $http#jsonp
     *
     * @description
     * Shortcut method to perform `JSONP` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request.
     *                     The name of the callback should be the string `JSON_CALLBACK`.
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */
    createShortMethods('get', 'delete', 'head', 'jsonp');

    /**
     * @ngdoc method
     * @name $http#post
     *
     * @description
     * Shortcut method to perform `POST` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

    /**
     * @ngdoc method
     * @name $http#put
     *
     * @description
     * Shortcut method to perform `PUT` request.
     *
     * @param {string} url Relative or absolute URL specifying the destination of the request
     * @param {*} data Request content
     * @param {Object=} config Optional configuration object
     * @returns {HttpPromise} Future object
     */

     /**
      * @ngdoc method
      * @name $http#patch
      *
      * @description
      * Shortcut method to perform `PATCH` request.
      *
      * @param {string} url Relative or absolute URL specifying the destination of the request
      * @param {*} data Request content
      * @param {Object=} config Optional configuration object
      * @returns {HttpPromise} Future object
      */
    createShortMethodsWithData('post', 'put', 'patch');

        /**
         * @ngdoc property
         * @name $http#defaults
         *
         * @description
         * Runtime equivalent of the `$httpProvider.defaults` property. Allows configuration of
         * default headers, withCredentials as well as request and response transformations.
         *
         * See "Setting HTTP Headers" and "Transforming Requests and Responses" sections above.
         */
    $http.defaults = defaults;


    return $http;


    function createShortMethods(names) {
      forEach(arguments, function(name) {
        $http[name] = function(url, config) {
          return $http(extend(config || {}, {
            method: name,
            url: url
          }));
        };
      });
    }


    function createShortMethodsWithData(name) {
      forEach(arguments, function(name) {
        $http[name] = function(url, data, config) {
          return $http(extend(config || {}, {
            method: name,
            url: url,
            data: data
          }));
        };
      });
    }


    /**
     * Makes the request.
     *
     * !!! ACCESSES CLOSURE VARS:
     * $httpBackend, defaults, $log, $rootScope, defaultCache, $http.pendingRequests
     */
    function sendReq(config, reqData) {
      var deferred = $q.defer(),
          promise = deferred.promise,
          cache,
          cachedResp,
          reqHeaders = config.headers,
          url = buildUrl(config.url, config.paramSerializer(config.params));

      $http.pendingRequests.push(config);
      promise.then(removePendingReq, removePendingReq);


      if ((config.cache || defaults.cache) && config.cache !== false &&
          (config.method === 'GET' || config.method === 'JSONP')) {
        cache = isObject(config.cache) ? config.cache
              : isObject(defaults.cache) ? defaults.cache
              : defaultCache;
      }

      if (cache) {
        cachedResp = cache.get(url);
        if (isDefined(cachedResp)) {
          if (isPromiseLike(cachedResp)) {
            // cached request has already been sent, but there is no response yet
            cachedResp.then(resolvePromiseWithResult, resolvePromiseWithResult);
          } else {
            // serving from cache
            if (isArray(cachedResp)) {
              resolvePromise(cachedResp[1], cachedResp[0], shallowCopy(cachedResp[2]), cachedResp[3]);
            } else {
              resolvePromise(cachedResp, 200, {}, 'OK');
            }
          }
        } else {
          // put the promise for the non-transformed response into cache as a placeholder
          cache.put(url, promise);
        }
      }


      // if we won't have the response in cache, set the xsrf headers and
      // send the request to the backend
      if (isUndefined(cachedResp)) {
        var xsrfValue = urlIsSameOrigin(config.url)
            ? $$cookieReader()[config.xsrfCookieName || defaults.xsrfCookieName]
            : undefined;
        if (xsrfValue) {
          reqHeaders[(config.xsrfHeaderName || defaults.xsrfHeaderName)] = xsrfValue;
        }

        $httpBackend(config.method, url, reqData, done, reqHeaders, config.timeout,
            config.withCredentials, config.responseType);
      }

      return promise;


      /**
       * Callback registered to $httpBackend():
       *  - caches the response if desired
       *  - resolves the raw $http promise
       *  - calls $apply
       */
      function done(status, response, headersString, statusText) {
        if (cache) {
          if (isSuccess(status)) {
            cache.put(url, [status, response, parseHeaders(headersString), statusText]);
          } else {
            // remove promise from the cache
            cache.remove(url);
          }
        }

        function resolveHttpPromise() {
          resolvePromise(response, status, headersString, statusText);
        }

        if (useApplyAsync) {
          $rootScope.$applyAsync(resolveHttpPromise);
        } else {
          resolveHttpPromise();
          if (!$rootScope.$$phase) $rootScope.$apply();
        }
      }


      /**
       * Resolves the raw $http promise.
       */
      function resolvePromise(response, status, headers, statusText) {
        // normalize internal statuses to 0
        status = Math.max(status, 0);

        (isSuccess(status) ? deferred.resolve : deferred.reject)({
          data: response,
          status: status,
          headers: headersGetter(headers),
          config: config,
          statusText: statusText
        });
      }

      function resolvePromiseWithResult(result) {
        resolvePromise(result.data, result.status, shallowCopy(result.headers()), result.statusText);
      }

      function removePendingReq() {
        var idx = $http.pendingRequests.indexOf(config);
        if (idx !== -1) $http.pendingRequests.splice(idx, 1);
      }
    }


    function buildUrl(url, serializedParams) {
      if (serializedParams.length > 0) {
        url += ((url.indexOf('?') == -1) ? '?' : '&') + serializedParams;
      }
      return url;
    }
  }];
}
