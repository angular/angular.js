'use strict';

/**
 * Parse headers into key value object
 *
 * @param {string} headers Raw headers as a string
 * @returns {Object} Parsed headers as key valu object
 */
function parseHeaders(headers) {
  var parsed = {}, key, val, i;

  forEach(headers.split('\n'), function(line) {
    i = line.indexOf(':');
    key = lowercase(trim(line.substr(0, i)));
    val = trim(line.substr(i + 1));

    if (key) {
      if (parsed[key]) {
        parsed[key] += ', ' + val;
      } else {
        parsed[key] = val;
      }
    }
  });

  return parsed;
}

/**
 * Chain all given functions
 *
 * This function is used for both request and response transforming
 *
 * @param {*} data Data to transform.
 * @param {function|Array.<function>} fns Function or an array of functions.
 * @param {*=} param Optional parameter to be passed to all transform functions.
 * @returns {*} Transformed data.
 */
function transform(data, fns, param) {
  if (isFunction(fns))
    return fns(data);

  forEach(fns, function(fn) {
    data = fn(data, param);
  });

  return data;
}


/**
 * @ngdoc object
 * @name angular.module.ng.$http
 * @requires $httpBacked
 * @requires $browser
 * @requires $exceptionHandler
 * @requires $cacheFactory
 *
 * @property {Array.<XhrFuture>} pendingRequests Array of pending requests.
 *
 * @description
 */
function $HttpProvider() {
  var $config = this.defaults = {
    // transform in-coming reponse data
    transformResponse: function(data) {
      if (isString(data)) {
        // strip json vulnerability protection prefix
        data = data.replace(/^\)\]\}',?\n/, '');
        if (/^\s*[\[\{]/.test(data) && /[\}\]]\s*$/.test(data))
          data = fromJson(data, true);
      }
      return data;
    },

    // transform out-going request data
    transformRequest: function(d) {
      return isObject(d) ? toJson(d) : d;
    },

    // default headers
    headers: {
      common: {
        'Accept': 'application/json, text/plain, */*',
        'X-Requested-With': 'XMLHttpRequest'
      },
      post: {'Content-Type': 'application/json'},
      put:  {'Content-Type': 'application/json'}
    }
  };

  this.$get = ['$httpBackend', '$browser', '$exceptionHandler', '$cacheFactory', '$rootScope',
      function($httpBackend, $browser, $exceptionHandler, $cacheFactory, $rootScope) {

  var defaultCache = $cacheFactory('$http');

  // the actual service
  function $http(config) {
    return new XhrFuture().send(config);
  }

  $http.pendingRequests = [];

  /**
   * @ngdoc method
   * @name angular.module.ng.$http#get
   * @methodOf angular.module.ng.$http
   *
   * @description
   * Shortcut method to perform `GET` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @ngdoc method
   * @name angular.module.ng.$http#delete
   * @methodOf angular.module.ng.$http
   *
   * @description
   * Shortcut method to perform `DELETE` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @ngdoc method
   * @name angular.module.ng.$http#head
   * @methodOf angular.module.ng.$http
   *
   * @description
   * Shortcut method to perform `HEAD` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @ngdoc method
   * @name angular.module.ng.$http#patch
   * @methodOf angular.module.ng.$http
   *
   * @description
   * Shortcut method to perform `PATCH` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @ngdoc method
   * @name angular.module.ng.$http#jsonp
   * @methodOf angular.module.ng.$http
   *
   * @description
   * Shortcut method to perform `JSONP` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request.
   *                     Should contain `JSON_CALLBACK` string.
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */
  createShortMethods('get', 'delete', 'head', 'patch', 'jsonp');

  /**
   * @ngdoc method
   * @name angular.module.ng.$http#post
   * @methodOf angular.module.ng.$http
   *
   * @description
   * Shortcut method to perform `POST` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {*} data Request content
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @ngdoc method
   * @name angular.module.ng.$http#put
   * @methodOf angular.module.ng.$http
   *
   * @description
   * Shortcut method to perform `PUT` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {*} data Request content
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */
  createShortMethodsWithData('post', 'put');

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
   * Represents Request object, returned by $http()
   *
   * !!! ACCESS CLOSURE VARS:
   * $httpBackend, $browser, $config, $log, $rootScope, defaultCache, $http.pendingRequests
   */
  function XhrFuture() {
    var rawRequest, parsedHeaders,
        cfg = {}, callbacks = [],
        defHeaders = $config.headers,
        self = this;

    /**
     * Callback registered to $httpBackend():
     *  - caches the response if desired
     *  - calls fireCallbacks()
     *  - clears the reference to raw request object
     */
    function done(status, response) {
      // aborted request or jsonp
      if (!rawRequest) parsedHeaders = {};

      if (cfg.cache && cfg.method == 'GET') {
        var cache = isObject(cfg.cache) && cfg.cache || defaultCache;
        if (200 <= status && status < 300) {
          parsedHeaders = parsedHeaders || parseHeaders(rawRequest.getAllResponseHeaders());
          cache.put(cfg.url, [status, response, parsedHeaders]);
        } else {
          // remove future object from cache
          cache.remove(cfg.url);
        }
      }

      fireCallbacks(response, status);
      rawRequest = null;
    }

    /**
     * Fire all registered callbacks for given status code
     *
     * This method when:
     *  - serving response from real request
     *  - serving response from cache
     *
     * It does:
     *  - transform the response
     *  - call proper callbacks
     *  - log errors
     *  - apply the $scope
     *  - clear parsed headers
     */
    function fireCallbacks(response, status) {
      var strStatus = status + '';

      // transform the response
      response = transform(response, cfg.transformResponse || $config.transformResponse, rawRequest);

      var idx; // remove from pending requests
      if ((idx = indexOf($http.pendingRequests, self)) !== -1)
        $http.pendingRequests.splice(idx, 1);

      // normalize internal statuses to 0
      status = Math.max(status, 0);
      forEach(callbacks, function(callback) {
        if (callback.regexp.test(strStatus)) {
          try {
            // use local var to call it without context
            var fn = callback.fn;
            fn(response, status, headers);
          } catch(e) {
            $exceptionHandler(e);
          }
        }
      });

      $rootScope.$apply();
      parsedHeaders = null;
    }

    /**
     * This is the third argument in any user callback
     * @see parseHeaders
     *
     * Return single header value or all headers parsed as object.
     * Headers all lazy parsed when first requested.
     *
     * @param {string=} name Name of header
     * @returns {string|Object}
     */
    function headers(name) {
      if (name) {
        return parsedHeaders
          ? parsedHeaders[lowercase(name)] || null
          : rawRequest.getResponseHeader(name);
      }

      parsedHeaders = parsedHeaders || parseHeaders(rawRequest.getAllResponseHeaders());

      return parsedHeaders;
    }

    /**
     * Retry the request
     *
     * @param {Object=} config Optional config object to extend the original configuration
     * @returns {XhrFuture}
     */
    this.retry = function(config) {
      if (rawRequest) throw 'Can not retry request. Abort pending request first.';

      extend(cfg, config);
      cfg.method = uppercase(cfg.method);

      var data = transform(cfg.data, cfg.transformRequest || $config.transformRequest),
          headers = extend({'X-XSRF-TOKEN': $browser.cookies()['XSRF-TOKEN']},
                           defHeaders.common, defHeaders[lowercase(cfg.method)], cfg.headers);

      var cache = isObject(cfg.cache) && cfg.cache || defaultCache,
          fromCache;

      if (cfg.cache && cfg.method == 'GET') {
        fromCache = cache.get(cfg.url);
        if (fromCache) {
          if (fromCache instanceof XhrFuture) {
            // cached request has already been sent, but there is no reponse yet,
            // we need to register callback and fire callbacks when the request is back
            // note, we have to get the values from cache and perform transformations on them,
            // as the configurations don't have to be same
            fromCache.on('always', function() {
              var requestFromCache = cache.get(cfg.url);
              parsedHeaders = requestFromCache[2];
              fireCallbacks(requestFromCache[1], requestFromCache[0]);
            });
          } else {
            // serving from cache - still needs to be async
            $browser.defer(function() {
              parsedHeaders = fromCache[2];
              fireCallbacks(fromCache[1], fromCache[0]);
            });
          }
        } else {
          // put future object into cache
          cache.put(cfg.url, self);
        }
      }

      // really send the request
      if (!cfg.cache || cfg.method !== 'GET' || !fromCache) {
        rawRequest = $httpBackend(cfg.method, cfg.url, data, done, headers, cfg.timeout);
      }

      $rootScope.$broadcast('$http.request', self);
      $http.pendingRequests.push(self);
      return self;
    };

    // just alias so that in stack trace we can see send() instead of retry()
    this.send = this.retry;

    /**
     * Abort the request
     */
    this.abort = function() {
      if (rawRequest) {
        rawRequest.abort();
      }
      return this;
    };

    /**
     * Register a callback function based on status code
     * Note: all matched callbacks will be called, preserving registered order !
     *
     * Internal statuses:
     *  `-2` = jsonp error
     *  `-1` = timeout
     *   `0` = aborted
     *
     * @example
     *   .on('2xx', function(){});
     *   .on('2x1', function(){});
     *   .on('404', function(){});
     *   .on('20x,3xx', function(){});
     *   .on('success', function(){});
     *   .on('error', function(){});
     *   .on('always', function(){});
     *   .on('timeout', function(){});
     *   .on('abort', function(){});
     *
     * @param {string} pattern Status code pattern with "x" for any number
     * @param {function(*, number, Object)} callback Function to be called when response arrives
     * @returns {XhrFuture}
     */
    this.on = function(pattern, callback) {
      var alias = {
        success: '2xx',
        error: '-2,-1,0,4xx,5xx',
        always: 'xxx,xx,x',
        timeout: '-1',
        abort: '0'
      };

      callbacks.push({
        fn: callback,
        // create regexp from given pattern
        regexp: new RegExp('^(' + (alias[pattern] || pattern).replace(/,/g, '|').
                                                              replace(/x/g, '.') + ')$')
      });

      return this;
    };

    /**
     * Configuration object of the request
     */
    this.config = cfg;
  }
}];
}

