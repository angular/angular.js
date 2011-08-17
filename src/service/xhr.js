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
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr
 * @function
 *
 * @requires $browser $xhr delegates all XHR requests to the `$browser.xhr()`.
 * @requires $log $xhr delegates all exceptions to `$log.error()`.
 * @requires $cacheFactory
 *
 * @description
 * Generates an XHR request. The $xhr service is function which takes one parameter - configuration
 * object. It returns XhrFuture object.
 *
 * # Configuration
 * - headers per method
 * - transformResponse (default - remove XRSF prefix, parseJson string)
 * - transformRequest (default toJson string)
 *
 * <pre>
// default configuration
angular.service('$xhrConfig', function() {
  return {

    // transform in-coming reponse data
    transformResponse: function(data) {
      if (isString(data)) {
        if (/^\)\]\},\n/.test(data)) data = data.substr(6);
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
        'Accept': 'application/json, text/plain, *&#47;*',
        'X-Requested-With': 'XMLHttpRequest'
      },
      post: {'Content-Type': 'application/x-www-form-urlencoded'}
    }
  };
});
 * </pre>
 *
 * # Security Considerations
 * When designing web applications your design needs to consider security threats from
 * {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
 * JSON Vulnerability} and {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF}.
 * Both server and the client must cooperate in order to eliminate these threats. Angular comes
 * pre-configured with strategies that address these issues, but for this to work backend server
 * cooperation is required.
 *
 * ## JSON Vulnerability Protection
 * A {@link http://haacked.com/archive/2008/11/20/anatomy-of-a-subtle-json-vulnerability.aspx
 * JSON Vulnerability} allows third party web-site to turn your JSON resource URL into
 * {@link http://en.wikipedia.org/wiki/JSON#JSONP JSONP} request under some conditions. To
 * counter this your server can prefix all JSON requests with following string `")]}',\n"`.
 * Angular will automatically strip the prefix before processing it as JSON.
 *
 * For example if your server needs to return:
 * <pre>
 * ['one','two']
 * </pre>
 *
 * which is vulnerable to attack, your server can return:
 * <pre>
 * )]}',
 * ['one','two']
 * </pre>
 *
 * angular will strip the prefix, before processing the JSON.
 *
 *
 * ## Cross Site Request Forgery (XSRF) Protection
 * {@link http://en.wikipedia.org/wiki/Cross-site_request_forgery XSRF} is a technique by which an
 * unauthorized site can gain your user's private data. Angular provides following mechanism to
 * counter XSRF. When performing XHR requests, the $xhr service reads a token from a cookie
 * called `XSRF-TOKEN` and sets it as the HTTP header `X-XSRF-TOKEN`. Since only JavaScript that
 * runs on your domain could read the cookie, your server can be assured that the XHR came from
 * JavaScript running on your domain.
 *
 * To take advantage of this, your server needs to set a token in a JavaScript readable session
 * cookie called `XSRF-TOKEN` on first HTTP GET request. On subsequent non-GET requests the server
 * can verify that the cookie matches `X-XSRF-TOKEN` HTTP header, and therefore be sure that only
 * JavaScript running on your domain could have read the token. The token must be unique for each
 * user and must be verifiable by the server (to prevent the JavaScript making up its own tokens).
 * We recommend that the token is a digest of your site's authentication cookie with
 * {@link http://en.wikipedia.org/wiki/Rainbow_table salt for added security}.
 *
 * @param {Object} config Configuration object, which can have these properties:
 *
 *  - `{string} method` HTTP method to use. Valid values are: `GET`, `POST`, `PUT`, `DELETE`,
 *    `HEAD`, `PATCH` and `JSONP`. `JSONP` is a special case which causes a
 *    {@link http://en.wikipedia.org/wiki/JSON#JSONP JSONP} cross domain request using script tag
 *    insertion.
 *
 *  - `{string} url` Relative or absolute URL specifying the destination of the request.
 *    For `JSONP` requests, `url` should contain `JSON_CALLBACK` string to be replaced with a name
 *    of an angular generated function.
 *
 *  - `{Object} headers` Request headers.
 *
 *  - `{*} data` Request content.
 *
 *  - `{function(*)|Array.<function(*)>}` transformRequest Function or an array of functions to
 *    transform the data before sending.
 *
 *  - `{function(*)|Array.<function(*)>}` transformResponse Function or an array of functions to
 *    transform the response before passing it to callbacks.
 *
 *  - `{boolean} cache` If true the request will be cached. If already cached version exists, it
 *    will be served from cache, without performing a request to server.
 *
 * @returns {XhrFuture} Future object with these methods:
 *
 *  - `repeat({Object=})` Repeat the request using the original configuration, preserving all
 *    registered callback functions. It accepts one optional parameter - config object, which
 *    overrides the original config object, if specified.
 *
 *  - `on({string}, {function()})` Register a callback function for given status. Note: all
 *    callbacks that match given pattern will be called in the same order in which they were
 *    registered.
 *
 *  - `abort()` Abort the request
 *
 *
 * The callback functions will be called with:
 *
 *  - `{*} response` Transformed response
 *  - `{number} code` {@link http://en.wikipedia.org/wiki/List_of_HTTP_status_codes HTTP status code}
 *  - `{function(string=)}` headers Function which return value of given header or all response
 *     headers parsed as an object if no header specified. Note that all header keys are lower cased
 *     to be consistent.
 *
 * @example
   <doc:example>
     <doc:source>
       <script>
         function FetchCntl($xhr) {
           var self = this;

           this.fetch = function() {
             self.code = null;
             self.response = null;

             $xhr({method: self.method, url: self.url
             }).on('success' , function(response, code) {
               self.code = code;
               self.response = response;
             }).on('error', function(response, code) {
               self.code = code;
               self.response = response || "Request failed";
             });
           };

           this.updateModel = function(method, url) {
             self.method = method;
             self.url = url;
           };
         }
         FetchCntl.$inject = ['$xhr'];
       </script>
       <div ng:controller="FetchCntl">
         <select name="method">
           <option>GET</option>
           <option>JSONP</option>
         </select>
         <input type="text" name="url" value="index.html" size="80"/>
         <button ng:click="fetch()">fetch</button><br>
         <button ng:click="updateModel('GET', 'index.html')">Sample GET</button>
         <button ng:click="updateModel('JSONP', 'https://www.googleapis.com/buzz/v1/activities/googlebuzz/@self?alt=json&callback=JSON_CALLBACK')">Sample JSONP (Buzz API)</button>
         <button ng:click="updateModel('JSONP', 'https://www.invalid_JSONP_request.com&callback=JSON_CALLBACK')">Invalid JSONP</button>
         <pre>code={{code}}</pre>
         <pre>response={{response}}</pre>
       </div>
     </doc:source>
     <doc:scenario>
       it('should make xhr GET request', function() {
         element(':button:contains("Sample GET")').click();
         element(':button:contains("fetch")').click();
         expect(binding('code')).toBe('code=200');
         expect(binding('response')).toMatch(/angularjs.org/);
       });

       it('should make JSONP request to the Buzz API', function() {
         element(':button:contains("Buzz API")').click();
         element(':button:contains("fetch")').click();
         expect(binding('code')).toBe('code=200');
         expect(binding('response')).toMatch(/buzz-feed/);
       });

       it('should make JSONP request to invalid URL and invoke the error handler',
           function() {
         element(':button:contains("Invalid JSONP")').click();
         element(':button:contains("fetch")').click();
         expect(binding('code')).toBe('code=0');
         expect(binding('response')).toBe('response=Request failed');
       });
     </doc:scenario>
   </doc:example>
 */
angularServiceInject('$xhr', function($browser, $error, $config, $cacheFactory) {

  var rootScope = this.$root,
      cache = $cacheFactory('$xhr'),
      pendingRequestsCount = 0;

  // the actual service
  function $xhr(config) {
    return new XhrFuture().retry(config);
  }

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#pendingCount
   * @methodOf angular.service.$xhr
   *
   * @description
   * Return number of pending requests
   *
   * @returns {number} Number of pending requests
   */
  $xhr.pendingCount = function() {
    return pendingRequestsCount;
  };

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#get
   * @methodOf angular.service.$xhr
   *
   * @description
   * Shortcut method to perform `GET` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#delete
   * @methodOf angular.service.$xhr
   *
   * @description
   * Shortcut method to perform `DELETE` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#head
   * @methodOf angular.service.$xhr
   *
   * @description
   * Shortcut method to perform `HEAD` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#patch
   * @methodOf angular.service.$xhr
   *
   * @description
   * Shortcut method to perform `PATCH` request
   *
   * @param {string} url Relative or absolute URL specifying the destination of the request
   * @param {Object=} config Optional configuration object
   * @returns {XhrFuture} Future object
   */

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#jsonp
   * @methodOf angular.service.$xhr
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
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#post
   * @methodOf angular.service.$xhr
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
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$xhr#put
   * @methodOf angular.service.$xhr
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

  return $xhr;

  function createShortMethods(names) {
    forEach(arguments, function(name) {
      $xhr[name] = function(url, config) {
        return $xhr(extend(config || {}, {
          method: name,
          url: url
        }));
      };
    });
  }

  function createShortMethodsWithData(name) {
    forEach(arguments, function(name) {
      $xhr[name] = function(url, data, config) {
        return $xhr(extend(config || {}, {
          method: name,
          url: url,
          data: data
        }));
      };
    });
  }

  /**
   * Represents Request object, returned by $xhr()
   *
   * !!! ACCESS CLOSURE VARS: $browser, $config, $log, rootScope, cache, pendingRequestsCount
   */
  function XhrFuture() {
    var rawRequest, cfg = {}, callbacks = [],
        defHeaders = $config.headers,
        parsedHeaders;

    /**
     * Callback registered to $browser.xhr:
     *  - caches the response if desired
     *  - calls fireCallbacks()
     *  - clears the reference to raw request object
     */
    function done(status, response) {
      // aborted request or jsonp
      if (!rawRequest) parsedHeaders = {};

      if (cfg.cache && cfg.method == 'GET' && 200 <= status && status < 300) {
        parsedHeaders = parsedHeaders || parseHeaders(rawRequest.getAllResponseHeaders());
        cache.put(cfg.url, [status, response, parsedHeaders]);
      }

      fireCallbacks(response, status);
      rawRequest = null;
    }

    /**
     * Fire all registered callbacks for given status code
     *
     * This method when:
     *  - serving response from real request ($browser.xhr callback)
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
      // transform the response
      response = transform(response, cfg.transformResponse || $config.transformResponse, rawRequest);

      var regexp = statusToRegexp(status),
          pattern, callback;

      for (var i = 0; i < callbacks.length; i += 2) {
        pattern = callbacks[i];
        callback = callbacks[i + 1];
        if (regexp.test(pattern)) {
          try {
            callback(response, status, headers);
          } catch(e) {
            $error(e);
          }
        }
      }

      rootScope.$apply();
      parsedHeaders = null;
      pendingRequestsCount--;
    }

    /**
     * Convert given status code number into regexp
     *
     * It would be much easier to convert registered statuses (e.g. "2xx") into regexps,
     * but this has an advantage of creating just one regexp, instead of one regexp per
     * registered callback. Anyway, probably not big deal.
     *
     * @param status
     * @returns {RegExp}
     */
    function statusToRegexp(status) {
      var strStatus = status + '',
          i = Math.max(3, strStatus.length),
          regexp = '';

      while(i--) {
        regexp = '(' + (strStatus.charAt(i) || 0) + '|x)' + regexp;
      }

      return new RegExp(regexp);
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
        if (parsedHeaders) return parsedHeaders[lowercase(name)];
        return rawRequest.getResponseHeader(name);
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
      if (rawRequest)
        throw 'Can not retry request. Abort pending request first.';

      extend(cfg, config);
      cfg.method = uppercase(cfg.method);

      var data = transform(cfg.data, cfg.transformRequest || $config.transformRequest),
          headers = extend({'X-XSRF-TOKEN': $browser.cookies()['XSRF-TOKEN']},
                           defHeaders.common, defHeaders[lowercase(cfg.method)], cfg.headers);

      var fromCache;
      if (cfg.cache && cfg.method == 'GET' && (fromCache = cache.get(cfg.url))) {
        $browser.defer(function() {
          parsedHeaders = fromCache[2];
          fireCallbacks(fromCache[1], fromCache[0]);
        });
      } else {
        rawRequest = $browser.xhr(cfg.method, cfg.url, data, done, headers);
      }

      pendingRequestsCount++;
      return this;
    };

    /**
     * Abort the request
     */
    this.abort = function() {
      if (rawRequest) {
        rawRequest.abort();
        rawRequest = null;
        pendingRequestsCount--;
      }
    };

    /**
     * Register a callback function based on status code
     * Note: all matched callbacks will be called, preserving registered order !
     *
     * @example
     *   .on('2xx', function(){});
     *   .on('2x1', function(){});
     *   .on('404', function(){});
     *   .on('xxx', function(){});
     *   .on('20x,3xx', function(){});
     *   .on('success', function(){});
     *   .on('error', function(){});
     *   .on('always', function(){});
     *
     * @param {string} pattern Status code pattern with "x" for any number
     * @param {function(*, number, Object)} callback Function to be called when response arrives
     * @returns {XhrFuture}
     */
    this.on = function(pattern, callback) {
      var alias = {
        success: '2xx',
        error: '000,4xx,5xx',
        always: 'xxx'
      };

      callbacks.push(alias[pattern] || pattern);
      callbacks.push(callback);

      return this;
    };
  }
}, ['$browser', '$exceptionHandler', '$xhrConfig', '$cacheFactory']);

// TODO(vojta): remove when we have the concept of configuration
angular.service('$xhrConfig', function() {
  return {

    // transform in-coming reponse data
    transformResponse: function(data) {
      if (isString(data)) {
        if (/^\)\]\}',\n/.test(data)) data = data.substr(6);
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
});
