
/**
 * @license AngularJS v"NG_VERSION_FULL"
 * (c) 2010-2011 AngularJS http://angularjs.org
 * License: MIT
 *
 * TODO(vojta): wrap whole file into closure during build
 */

/**
 * @ngdoc overview
 * @name angular.mock
 * @description
 *
 * Namespace from 'angular-mocks.js' which contains testing related code.
 */
angular.mock = {};

/**
 * @ngdoc object
 * @name angular.module.ngMock.$browser
 *
 * @description
 * This service is a mock implementation of {@link angular.module.ng.$browser}. It provides fake
 * implementation for commonly used browser apis that are hard to test, e.g. setTimeout, xhr,
 * cookies, etc...
 *
 * The api of this service is the same as that of the real {@link angular.module.ng.$browser $browser}, except
 * that there are several helper methods available which can be used in tests.
 *
 * The following apis can be used in tests:
 *
 * - $browser.defer — enables testing of code that uses
 *   {@link angular.module.ng.$defer $defer} for executing functions via the `setTimeout` api.
 */
angular.mock.$BrowserProvider = function(){
  this.$get = function(){
    return new angular.mock.$Browser();
  };
};
angular.mock.$Browser = function() {
  var self = this;

  this.isMock = true;
  self.$$url = "http://server";
  self.$$lastUrl = self.$$url; // used by url polling fn
  self.pollFns = [];

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = angular.noop;
  self.$$incOutstandingRequestCount = angular.noop;


  // register url polling fn

  self.onUrlChange = function(listener) {
    self.pollFns.push(
      function() {
        if (self.$$lastUrl != self.$$url) {
          self.$$lastUrl = self.$$url;
          listener(self.$$url);
        }
      }
    );

    return listener;
  };

  self.cookieHash = {};
  self.lastCookieHash = {};
  self.deferredFns = [];
  self.deferredNextId = 0;

  self.defer = function(fn, delay) {
    delay = delay || 0;
    self.deferredFns.push({time:(self.defer.now + delay), fn:fn, id: self.deferredNextId});
    self.deferredFns.sort(function(a,b){ return a.time - b.time;});
    return self.deferredNextId++;
  };


  self.defer.now = 0;


  self.defer.cancel = function(deferId) {
    var fnIndex;

    angular.forEach(self.deferredFns, function(fn, index) {
      if (fn.id === deferId) fnIndex = index;
    });

    if (fnIndex !== undefined) {
      self.deferredFns.splice(fnIndex, 1);
      return true;
    }

    return false;
  };


  /**
   * @ngdoc method
   * @name angular.module.ngMock.$browser#defer.flush
   * @methodOf angular.module.ngMock.$browser
   *
   * @description
   * Flushes all pending requests and executes the defer callbacks.
   *
   * @param {number=} number of milliseconds to flush. See {@link #defer.now}
   */
  self.defer.flush = function(delay) {
    if (angular.isDefined(delay)) {
      self.defer.now += delay;
    } else {
      if (self.deferredFns.length) {
        self.defer.now = self.deferredFns[self.deferredFns.length-1].time;
      } else {
        throw Error('No deferred tasks to be flushed');
      }
    }

    while (self.deferredFns.length && self.deferredFns[0].time <= self.defer.now) {
      self.deferredFns.shift().fn();
    }
  };
  /**
   * @ngdoc property
   * @name angular.module.ngMock.$browser#defer.now
   * @propertyOf angular.module.ngMock.$browser
   *
   * @description
   * Current milliseconds mock time.
   */

  self.$$baseHref = '';
  self.baseHref = function() {
    return this.$$baseHref;
  };

  self.$$scripts = [];
  self.addJs = function(url, done) {
    var script = {url: url, done: done};
    self.$$scripts.push(script);
    return script;
  };
}
angular.mock.$Browser.prototype = {

/**
  * @name angular.module.ngMock.$browser#poll
  * @methodOf angular.module.ngMock.$browser
  *
  * @description
  * run all fns in pollFns
  */
  poll: function poll() {
    angular.forEach(this.pollFns, function(pollFn){
      pollFn();
    });
  },

  addPollFn: function(pollFn) {
    this.pollFns.push(pollFn);
    return pollFn;
  },

  url: function(url, replace) {
    if (url) {
      this.$$url = url;
      return this;
    }

    return this.$$url;
  },

  cookies:  function(name, value) {
    if (name) {
      if (value == undefined) {
        delete this.cookieHash[name];
      } else {
        if (angular.isString(value) &&       //strings only
            value.length <= 4096) {          //strict cookie storage limits
          this.cookieHash[name] = value;
        }
      }
    } else {
      if (!angular.equals(this.cookieHash, this.lastCookieHash)) {
        this.lastCookieHash = angular.copy(this.cookieHash);
        this.cookieHash = angular.copy(this.cookieHash);
      }
      return this.cookieHash;
    }
  },

  notifyWhenNoOutstandingRequests: function(fn) {
    fn();
  }
};


/**
 * @ngdoc object
 * @name angular.module.ngMock.$exceptionHandlerProvider
 *
 * @description
 * Configures the mock implementation of {@link angular.module.ng.$exceptionHandler} to rethrow or to log errors passed
 * into the `$exceptionHandler`.
 */

/**
 * @ngdoc object
 * @name angular.module.ngMock.$exceptionHandler
 *
 * @description
 * Mock implementation of {@link angular.module.ng.$exceptionHandler} that rethrows or logs errors passed
 * into it. See {@link angular.module.ngMock.$exceptionHandlerProvider $exceptionHandlerProvider} for configuration
 * information.
 */

angular.mock.$ExceptionHandlerProvider = function(){
  var handler;

  /**
   * @ngdoc method
   * @name angular.module.ngMock.$exceptionHandlerProvider#mode
   * @methodOf angular.module.ngMock.$exceptionHandlerProvider
   *
   * @description
   * Sets the logging mode.
   *
   * @param {string} mode Mode of operation, defaults to `rethrow`.
   *
   *   - `rethrow`: If any errors are are passed into the handler in tests, it typically
   *                means that there is a bug in the application or test, so this mock will
   *                make these tests fail.
   *   - `log`: Sometimes it is desirable to test that an error is throw, for this case the `log` mode stores the
   *            error and allows later assertion of it.
   *            See {@link angular.module.ngMock.$log#assertEmpty assertEmpty()} and
   *             {@link angular.module.ngMock.$log#reset reset()}
   */
  this.mode = function(mode){
    switch(mode) {
      case 'rethrow':
        handler = function(e) {
          throw e;
        }
        break;
      case 'log':
        var errors = [];
        handler = function(e) {
          errors.push(e);
        }
        handler.errors = errors;
        break;
      default:
        throw Error("Unknown mode '" + mode + "', only 'log'/'rethrow' modes are allowed!");
    }
  };

  this.$get = function(){
    return handler;
  };

  this.mode('rethrow');
};


/**
 * @ngdoc service
 * @name angular.module.ngMock.$log
 *
 * @description
 * Mock implementation of {@link angular.module.ng.$log} that gathers all logged messages in arrays
 * (one array per logging level). These arrays are exposed as `logs` property of each of the
 * level-specific log function, e.g. for level `error` the array is exposed as `$log.error.logs`.
 *
 */
angular.mock.$logProvider = function(){

  function concat(array1, array2, index) {
    return array1.concat(Array.prototype.slice.call(array2, index));
  }


  this.$get = function () {
    var $log = {
      log: function() { $log.log.logs.push(concat([], arguments, 0)); },
      warn: function() { $log.warn.logs.push(concat([], arguments, 0)); },
      info: function() { $log.info.logs.push(concat([], arguments, 0)); },
      error: function() { $log.error.logs.push(concat([], arguments, 0)); }
    };

    /**
     * @ngdoc method
     * @name angular.module.ngMock.$log#reset
     * @methodOf angular.module.ngMock.$log
     *
     * @description
     * Reset all of the logging arrays to empty.
     */
    $log.reset = function (){
      /**
       * @ngdoc property
       * @name angular.module.ngMock.$log#log.logs
       * @propertyOf angular.module.ngMock.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.log.logs = [];
      /**
       * @ngdoc property
       * @name angular.module.ngMock.$log#warn.logs
       * @propertyOf angular.module.ngMock.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.warn.logs = [];
      /**
       * @ngdoc property
       * @name angular.module.ngMock.$log#info.logs
       * @propertyOf angular.module.ngMock.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.info.logs = [];
      /**
       * @ngdoc property
       * @name angular.module.ngMock.$log#error.logs
       * @propertyOf angular.module.ngMock.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.error.logs = [];
    };

    /**
     * @ngdoc method
     * @name angular.module.ngMock.$log#assertEmpty
     * @methodOf angular.module.ngMock.$log
     *
     * @description
     * Assert that the all of the logging methods have no logged messages. If messages present, an exception is thrown.
     */
    $log.assertEmpty = function() {
      var errors = [];
      angular.forEach(['error', 'warn', 'info', 'log'], function(logLevel) {
        angular.forEach($log[logLevel].logs, function(log) {
          angular.forEach(log, function (logItem) {
            errors.push('MOCK $log (' + logLevel + '): ' + String(logItem) + '\n' + (logItem.stack || ''));
          });
        });
      });
      if (errors.length) {
        errors.unshift("Expected $log to be empty! Either a message was logged unexpectedly, or an expected " +
          "log message was not checked and removed:");
        errors.push('')
        throw new Error(errors.join('\n---------\n'));
      }
    };

    $log.reset();
    return $log;
  };
};


/**
 * @ngdoc object
 * @name angular.mock.TzDate
 * @description
 *
 * *NOTE*: this is not an injectable instance, just a globally available mock class of `Date`.
 *
 * Mock of the Date type which has its timezone specified via constroctor arg.
 *
 * The main purpose is to create Date-like instances with timezone fixed to the specified timezone
 * offset, so that we can test code that depends on local timezone settings without dependency on
 * the time zone settings of the machine where the code is running.
 *
 * @param {number} offset Offset of the *desired* timezone in hours (fractions will be honored)
 * @param {(number|string)} timestamp Timestamp representing the desired time in *UTC*
 *
 * @example
 * !!!! WARNING !!!!!
 * This is not a complete Date object so only methods that were implemented can be called safely.
 * To make matters worse, TzDate instances inherit stuff from Date via a prototype.
 *
 * We do our best to intercept calls to "unimplemented" methods, but since the list of methods is
 * incomplete we might be missing some non-standard methods. This can result in errors like:
 * "Date.prototype.foo called on incompatible Object".
 *
 * <pre>
 * var newYearInBratislava = new TzDate(-1, '2009-12-31T23:00:00Z');
 * newYearInBratislava.getTimezoneOffset() => -60;
 * newYearInBratislava.getFullYear() => 2010;
 * newYearInBratislava.getMonth() => 0;
 * newYearInBratislava.getDate() => 1;
 * newYearInBratislava.getHours() => 0;
 * newYearInBratislava.getMinutes() => 0;
 * </pre>
 *
 */
angular.mock.TzDate = function (offset, timestamp) {
  var self = new Date(0);
  if (angular.isString(timestamp)) {
    var tsStr = timestamp;

    self.origDate = angular.fromJson(angular.toJson({date:timestamp})).date;

    timestamp = self.origDate.getTime();
    if (isNaN(timestamp))
      throw {
        name: "Illegal Argument",
        message: "Arg '" + tsStr + "' passed into TzDate constructor is not a valid date string"
      };
  } else {
    self.origDate = new Date(timestamp);
  }

  var localOffset = new Date(timestamp).getTimezoneOffset();
  self.offsetDiff = localOffset*60*1000 - offset*1000*60*60;
  self.date = new Date(timestamp + self.offsetDiff);

  self.getTime = function() {
    return self.date.getTime() - self.offsetDiff;
  };

  self.toLocaleDateString = function() {
    return self.date.toLocaleDateString();
  };

  self.getFullYear = function() {
    return self.date.getFullYear();
  };

  self.getMonth = function() {
    return self.date.getMonth();
  };

  self.getDate = function() {
    return self.date.getDate();
  };

  self.getHours = function() {
    return self.date.getHours();
  };

  self.getMinutes = function() {
    return self.date.getMinutes();
  };

  self.getSeconds = function() {
    return self.date.getSeconds();
  };

  self.getTimezoneOffset = function() {
    return offset * 60;
  };

  self.getUTCFullYear = function() {
    return self.origDate.getUTCFullYear();
  };

  self.getUTCMonth = function() {
    return self.origDate.getUTCMonth();
  };

  self.getUTCDate = function() {
    return self.origDate.getUTCDate();
  };

  self.getUTCHours = function() {
    return self.origDate.getUTCHours();
  };

  self.getUTCMinutes = function() {
    return self.origDate.getUTCMinutes();
  };

  self.getUTCSeconds = function() {
    return self.origDate.getUTCSeconds();
  };

  self.getDay = function() {
    return self.origDate.getDay();
  };

  //hide all methods not implemented in this mock that the Date prototype exposes
  var unimplementedMethods = ['getMilliseconds', 'getUTCDay',
      'getUTCMilliseconds', 'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds',
      'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear',
      'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds',
      'setYear', 'toDateString', 'toJSON', 'toGMTString', 'toLocaleFormat', 'toLocaleString',
      'toLocaleTimeString', 'toSource', 'toString', 'toTimeString', 'toUTCString', 'valueOf'];

  angular.forEach(unimplementedMethods, function(methodName) {
    self[methodName] = function() {
      throw Error("Method '" + methodName + "' is not implemented in the TzDate mock");
    };
  });

  return self;
}

//make "tzDateInstance instanceof Date" return true
angular.mock.TzDate.prototype = Date.prototype;


/**
 * @ngdoc function
 * @name angular.mock.debug
 * @description
 *
 * *NOTE*: this is not an injectable instance, just a globally available function.
 *
 * Method for serializing common angular objects (scope, elements, etc..) into strings, useful for debugging.
 *
 * This method is also available on window, where it can be used to display objects on debug console.
 *
 * @param {*} object - any object to turn into string.
 * @return a serialized string of the argument
 */
angular.mock.dump = function(object){
  return serialize(object);

  function serialize(object) {
    var out;

    if (angular.isElement(object)) {
      object = angular.element(object);
      out = angular.element('<div></div>')
      angular.forEach(object, function(element){
        out.append(angular.element(element).clone());
      });
      out = out.html();
    } else if (angular.isArray(object)) {
      out = [];
      angular.forEach(object, function(o) {
        out.push(serialize(o));
      });
      out = '[ ' + out.join(', ') + ' ]';
    } else if (angular.isObject(object)) {
      if (angular.isFunction(object.$eval) && angular.isFunction(object.$apply)) {
        out = serializeScope(object);
      } else if (object instanceof Error) {
        out = object.stack || ('' + object.name + ': ' + object.message);
      } else {
        out = angular.toJson(object, true);
      }
    } else {
      out = String(object);
    }

    return out;
  }

  function serializeScope(scope, offset) {
    offset = offset ||  '  ';
    var log = [offset + 'Scope(' + scope.$id + '): {'];
    for ( var key in scope ) {
      if (scope.hasOwnProperty(key) && !key.match(/^(\$|this)/)) {
        log.push('  ' + key + ': ' + angular.toJson(scope[key]));
      }
    }
    var child = scope.$$childHead;
    while(child) {
      log.push(serializeScope(child, offset + '  '));
      child = child.$$nextSibling;
    }
    log.push('}');
    return log.join('\n' + offset);
  }
};

/**
 * @ngdoc object
 * @name angular.module.ngMock.$httpBackend
 * @describe
 * Fake version of `$httpBackend` service used by the `$http` service during unit testing.
 *
 * This implementation can be used to respond with static or dynamic responses via the `expect` and
 * `when` apis and their shortcuts (`expectGET`, `whenPOST`, etc).
 */
angular.mock.$HttpBackendProvider = function() {
  this.$get = [createHttpBackendMock];
};

/**
 * General factory function for $httpBackend mock.
 * Returns instance for unit testing (when no arguments specified):
 *   - passing through is disabled
 *   - auto flushing is disabled
 *
 * Returns instance for e2e testing (when `$delegate` and `$defer` specified):
 *   - passing through (delegating request to real backend) is enabled
 *   - auto flushing is enabled
 *
 * @param {Object=} $delegate Real $httpBackend instance (allow passing through if specified)
 * @param {Object=} $defer Auto-flushing enabled if specified
 * @return {Object} Instance of $httpBackend mock
 */
function createHttpBackendMock($delegate, $defer) {
  var definitions = [],
      expectations = [],
      responses = [],
      responsesPush = angular.bind(responses, responses.push);

  function createResponse(status, data, headers) {
    if (angular.isFunction(status)) return status;

    return function() {
      return angular.isNumber(status)
          ? [status, data, headers]
          : [200, status, data];
    }
  }

  // TODO(vojta): change params to: method, url, data, headers, callback
  function $httpBackend(method, url, data, callback, headers) {
    var xhr = new MockXhr(),
        expectation = expectations[0],
        wasExpected = false;

    function prettyPrint(data) {
      return (angular.isString(data) || angular.isFunction(data) || data instanceof RegExp)
          ? data
          : angular.toJson(data);
    }

    if (expectation && expectation.match(method, url)) {
      if (!expectation.matchData(data))
        throw Error('Expected ' + expectation + ' with different data\n' +
            'EXPECTED: ' + prettyPrint(expectation.data) + '\nGOT:      ' + data);

      if (!expectation.matchHeaders(headers))
        throw Error('Expected ' + expectation + ' with different headers\n' +
            'EXPECTED: ' + prettyPrint(expectation.headers) + '\nGOT:      ' +
            prettyPrint(headers));

      expectations.shift();

      if (expectation.response) {
        responses.push(function() {
          var response = expectation.response(method, url, data, headers);
          xhr.$$respHeaders = response[2];
          callback(response[0], response[1], xhr.getAllResponseHeaders());
        });
        return;
      }
      wasExpected = true;
    }

    var i = -1, definition;
    while ((definition = definitions[++i])) {
      if (definition.match(method, url, data, headers || {})) {
        if (definition.response) {
          // if $defer specified, we do auto flush all requests
          ($defer ? $defer : responsesPush)(function() {
            var response = definition.response(method, url, data, headers);
            xhr.$$respHeaders = response[2];
            callback(response[0], response[1], xhr.getAllResponseHeaders());
          });
        } else if (definition.passThrough) {
          $delegate(method, url, data, callback, headers);
        } else throw Error('No response defined !');
        return;
      }
    }
    throw wasExpected ?
        Error('No response defined !') :
        Error('Unexpected request: ' + method + ' ' + url + '\n' +
              (expectation ? 'Expected ' + expectation : 'No more request expected'));
  }

  $httpBackend.when = function(method, url, data, headers) {
    var definition = new MockHttpExpectation(method, url, data, headers),
        chain = {
          respond: function(status, data, headers) {
            definition.response = createResponse(status, data, headers);
          }
        };

    if ($defer) {
      chain.passThrough = function() {
        definition.passThrough = true;
      };
    }

    definitions.push(definition);
    return chain;
  };

  createShortMethods('when');


  $httpBackend.expect = function(method, url, data, headers) {
    var expectation = new MockHttpExpectation(method, url, data, headers);
    expectations.push(expectation);
    return {
      respond: function(status, data, headers) {
        expectation.response = createResponse(status, data, headers);
      }
    };
  };

  createShortMethods('expect');


  $httpBackend.flush = function(count) {
    if (!responses.length) throw Error('No pending request to flush !');

    if (angular.isDefined(count)) {
      while (count--) {
        if (!responses.length) throw Error('No more pending request to flush !');
        responses.shift()();
      }
    } else {
      while (responses.length) {
        responses.shift()();
      }
    }
    $httpBackend.verifyNoOutstandingExpectation();
  };

  $httpBackend.verifyNoOutstandingExpectation = function() {
    if (expectations.length) {
      throw Error('Unsatisfied requests: ' + expectations.join(', '));
    }
  };

  $httpBackend.verifyNoOutstandingRequest = function() {
    if (responses.length) {
      throw Error('Unflushed requests: ' + responses.length);
    }
  };

  $httpBackend.resetExpectations = function() {
    expectations.length = 0;
    responses.length = 0;
  };

  return $httpBackend;


  function createShortMethods(prefix) {
    angular.forEach(['GET', 'PUT', 'POST', 'DELETE', 'PATCH', 'JSONP'], function(method) {
     $httpBackend[prefix + method] = function(url, data, headers) {
       return $httpBackend[prefix](method, url, data, headers)
     }
    });
  }
};

function MockHttpExpectation(method, url, data, headers) {

  this.data = data;
  this.headers = headers;

  this.match = function(m, u, d, h) {
    if (method != m) return false;
    if (!this.matchUrl(u)) return false;
    if (angular.isDefined(d) && !this.matchData(d)) return false;
    if (angular.isDefined(h) && !this.matchHeaders(h)) return false;
    return true;
  };

  this.matchUrl = function(u) {
    if (!url) return true;
    if (angular.isFunction(url.test)) return url.test(u);
    return url == u;
  };

  this.matchHeaders = function(h) {
    if (angular.isUndefined(headers)) return true;
    if (angular.isFunction(headers)) return headers(h);
    return angular.equals(headers, h);
  };

  this.matchData = function(d) {
    if (angular.isUndefined(data)) return true;
    if (data && angular.isFunction(data.test)) return data.test(d);
    if (data && !angular.isString(data)) return angular.toJson(data) == d;
    return data == d;
  };

  this.toString = function() {
    return method + ' ' + url;
  };
}

function MockXhr() {

  // hack for testing $http, $httpBackend
  MockXhr.$$lastInstance = this;

  this.open = function(method, url, async) {
    this.$$method = method;
    this.$$url = url;
    this.$$async = async;
    this.$$reqHeaders = {};
    this.$$respHeaders = {};
  };

  this.send = function(data) {
    this.$$data = data;
  };

  this.setRequestHeader = function(key, value) {
    this.$$reqHeaders[key] = value;
  };

  this.getResponseHeader = function(name) {
    // the lookup must be case insensitive, that's why we try two quick lookups and full scan at last
    var header = this.$$respHeaders[name];
    if (header) return header;

    name = angular.lowercase(name);
    header = this.$$respHeaders[name];
    if (header) return header;

    header = undefined;
    angular.forEach(this.$$respHeaders, function(headerVal, headerName) {
      if (!header && angular.lowercase(headerName) == name) header = headerVal;
    });
    return header;
  };

  this.getAllResponseHeaders = function() {
    var lines = [];

    angular.forEach(this.$$respHeaders, function(value, key) {
      lines.push(key + ': ' + value);
    });
    return lines.join('\n');
  };

  this.abort = angular.noop;
}

/**
 * @ngdoc overview
 * @name angular.module.ngMock
 * @description
 *
 * The `ngMock` is an angular module which is used with `ng` module and adds unit-test configuration as well as useful
 * mocks to the {@link angular.module.AUTO.$injector $injector}.
 */
angular.module('ngMock', ['ng']).service({
  '$browser': angular.mock.$BrowserProvider,
  '$exceptionHandler': angular.mock.$ExceptionHandlerProvider,
  '$log': angular.mock.$logProvider,
  '$httpBackend': angular.mock.$HttpBackendProvider
});



/**
 * @ngdoc overview
 * @name angular.module.ngMockE2E
 * @description
 *
 * The `ngMockE2E` is an angular module which contains mock for `$httpBackend`. This mock allows you
 * to either respond with fake data or delegate to real backend.
 */
angular.module('ngMockE2E', ['ng']).init(function($provide) {
  $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
});

angular.mock.e2e = {};
angular.mock.e2e.$httpBackendDecorator = ['$delegate', '$defer', createHttpBackendMock];



window.jstestdriver && (function(window){
  /**
   * Global method to output any number of objects into JSTD console. Useful for debugging.
   */
  window.dump = function() {
    var args = [];
    angular.forEach(arguments, function(arg){
      args.push(angular.mock.dump(arg));
    });
    jstestdriver.console.log.apply(jstestdriver.console, args);
  };
})(window);


/**
 * @ngdoc function
 * @name angular.mock.inject
 * @description
 *
 * *NOTE*: this is not an injectable instance, just a globally available function on window.
 *
 * This function wraps a test method into an injectable method. It create one
 * {@link angular.module.AUTO.$injector $injector} per test, which is then used for testing.
 *
 * Here is an example of what a typical jasmine tests looks like with the inject method.
 * <pre>
 *   describe('MyApp', function() {
 *
 *     // Argument inference is used to inject the $provide service
 *     beforeEach(inject(function($provide, $rootScope) {
 *       // $provide service is configured as needed
 *       $provide.value('version', 'v1.0.1');
 *       $rootScope.value = 123;
 *     });
 *
 *     // Argument inference is used to inject the $rootScope as well as the version
 *     it('should provide a version', inject(function($rootScope, version){
 *       expect(version).toEqual('v1.0.1');
 *       expect($rootScope.value).toEqual(123);
 *     });
 *
 *     // The inject can also chain the methods
 *     it('should override a version and test the new version is injected', inject(
 *       function($provide) {
 *         $provide.value('version', 'overridden'); // override version here
 *       },
 *       function(version) {
 *         expect(version).toEqual('overridden');
 *       }
 *     ));
 *
 *   });
 *
 * </pre>
 *
 * @param {*} fns... any number of functions which will be injected using the injector.
 * @return a method
 */
window.jasmine && (function(window){
  window.inject = function (){
    var blockFns = Array.prototype.slice.call(arguments, 0);
    return function(){
      var injector = this.$injector;
      if (!injector) {
        injector = this.$injector = angular.injector('ng', 'ngMock');
      }
      for(var i = 0, ii = blockFns.length; i < ii; i++) {
        injector.invoke(this, blockFns[i]);
      }
    };
  }
})(window);
