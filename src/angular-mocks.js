
/**
 * @license AngularJS v"NG_VERSION_FULL"
 * (c) 2010-2011 AngularJS http://angularjs.org
 * License: MIT
 */


window.angular = window.angular || {};
angular.module = angular.module || {};

/**
 * @ngdoc overview
 * @name angular.module.NG_MOCK
 * @description
 *
 * The `NG_MOCK` is an angular module which is used with `NG` module and adds unit-test configuration as well as useful
 * mocks to the {@link angular.module.AUTO.$injector $injector}.
 */
angular.module.NG_MOCK = function($provide){
  $provide.service('$browser', angular.module.NG_MOCK.$BrowserProvider);
  $provide.service('$exceptionHandler', angular.module.NG_MOCK.$ExceptionHandlerProvider);
  $provide.service('$log', angular.module.NG_MOCK.$LogProvider);
};
angular.module.NG_MOCK.$inject = ['$provide'];

/**
 * @ngdoc object
 * @name angular.module.NG_MOCK.$browser
 *
 * @description
 * This service is a mock implementation of {@link angular.module.NG.$browser}. It provides fake
 * implementation for commonly used browser apis that are hard to test, e.g. setTimeout, xhr,
 * cookies, etc...
 *
 * The api of this service is the same as that of the real {@link angular.module.NG.$browser $browser}, except
 * that there are several helper methods available which can be used in tests.
 *
 * The following apis can be used in tests:
 *
 * - {@link #xhr} — enables testing of code that uses
 *   the {@link angular.module.NG.$xhr $xhr service} to make XmlHttpRequests.
 * - $browser.defer — enables testing of code that uses
 *   {@link angular.module.NG.$defer $defer} for executing functions via the `setTimeout` api.
 */
angular.module.NG_MOCK.$BrowserProvider = function(){
  this.$get = function(){
    return new angular.module.NG_MOCK.$Browser();
  };
};
angular.module.NG_MOCK.$Browser = function() {
  var self = this,
      expectations = {},
      requests = [];

  this.isMock = true;
  self.$$url = "http://server";
  self.$$lastUrl = self.$$url; // used by url polling fn
  self.pollFns = [];


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


  /**
    * @ngdoc method
    * @name angular.module.NG_MOCK.$browser#xhr
    * @methodOf angular.module.NG_MOCK.$browser
    *
    * @description
    * Generic method for training browser to expect a request in a test and respond to it.
    *
    * See also convenience methods for browser training:
    *
    * - {@link #xhr.expectGET}
    * - {@link #xhr.expectPOST}
    * - {@link #xhr.expectPUT}
    * - {@link #xhr.expectDELETE}
    * - {@link #xhr.expectJSON}
    *
    * To flush pending requests in tests use
    * {@link #xhr.flush}.
    *
    * @param {string} method Expected HTTP method.
    * @param {string} url Url path for which a request is expected.
    * @param {(object|string)=} data Expected body of the (POST) HTTP request.
    * @param {function(number, *)} callback Callback to call when response is flushed.
    * @param {object} headers Key-value pairs of expected headers.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link #xhr.flush flushed}.
    */
  self.xhr = function(method, url, data, callback, headers) {
    headers = headers || {};
    if (data && angular.isObject(data)) data = angular.toJson(data);
    if (data && angular.isString(data)) url += "|" + data;
    var expect = expectations[method] || {};
    var expectation = expect[url];
    if (!expectation) {
      throw new Error("Unexpected request for method '" + method + "' and url '" + url + "'.");
    }
    requests.push(function() {
      angular.forEach(expectation.headers, function(value, key){
        if (headers[key] !== value) {
          throw new Error("Missing HTTP request header: " + key + ": " + value);
        }
      });
      callback(expectation.code, expectation.response);
    });
  };
  self.xhr.expectations = expectations;
  self.xhr.requests = requests;
  self.xhr.expect = function(method, url, data, headers) {
    if (data && angular.isObject(data)) data = angular.toJson(data);
    if (data && angular.isString(data)) url += "|" + data;
    var expect = expectations[method] || (expectations[method] = {});
    return {
      respond: function(code, response) {
        if (!angular.isNumber(code)) {
          response = code;
          code = 200;
        }
        expect[url] = {code:code, response:response, headers: headers || {}};
      }
    };
  };

  /**
    * @ngdoc method
    * @name angular.module.NG_MOCK.$browser#xhr.expectGET
    * @methodOf angular.module.NG_MOCK.$browser
    *
    * @description
    * Trains browser to expect a `GET` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.module.NG_MOCK.$browser#xhr.flush flushed}.
    */
  self.xhr.expectGET    = angular.bind(self, self.xhr.expect, 'GET');

  /**
   * @ngdoc method
   * @name angular.module.NG_MOCK.$browser#xhr.expectPOST
   * @methodOf angular.module.NG_MOCK.$browser
    *
    * @description
    * Trains browser to expect a `POST` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.module.NG_MOCK.$browser#xhr.flush flushed}.
    */
  self.xhr.expectPOST   = angular.bind(self, self.xhr.expect, 'POST');

  /**
   * @ngdoc method
   * @name angular.module.NG_MOCK.$browser#xhr.expectDELETE
   * @methodOf angular.module.NG_MOCK.$browser
    *
    * @description
    * Trains browser to expect a `DELETE` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.module.NG_MOCK.$browser#xhr.flush flushed}.
    */
  self.xhr.expectDELETE = angular.bind(self, self.xhr.expect, 'DELETE');

  /**
   * @ngdoc method
   * @name angular.module.NG_MOCK.$browser#xhr.expectPUT
   * @methodOf angular.module.NG_MOCK.$browser
    *
    * @description
    * Trains browser to expect a `PUT` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.module.NG_MOCK.$browser#xhr.flush flushed}.
    */
  self.xhr.expectPUT    = angular.bind(self, self.xhr.expect, 'PUT');

  /**
   * @ngdoc method
   * @name angular.module.NG_MOCK.$browser#xhr.expectJSON
   * @methodOf angular.module.NG_MOCK.$browser
    *
    * @description
    * Trains browser to expect a `JSON` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.module.NG_MOCK.$browser#xhr.flush flushed}.
    */
  self.xhr.expectJSON   = angular.bind(self, self.xhr.expect, 'JSON');

  /**
   * @ngdoc method
   * @name angular.module.NG_MOCK.$browser#xhr.flush
   * @methodOf angular.module.NG_MOCK.$browser
    *
    * @description
    * Flushes all pending requests and executes xhr callbacks with the trained response as the
    * argument.
    */
  self.xhr.flush = function() {
    if (requests.length == 0) {
      throw new Error("No xhr requests to be flushed!");
    }

    while(requests.length) {
      requests.pop()();
    }
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
   * @name angular.module.NG_MOCK.$browser#defer.flush
   * @methodOf angular.module.NG_MOCK.$browser
   *
   * @description
   * Flushes all pending requests and executes the defer callbacks.
   *
   * @param {number=} number of miliseconds to flush. See {@link #defer.now}
   */
  self.defer.flush = function(delay) {
    if (angular.isDefined(delay)) {
      self.defer.now += delay;
    } else {
      if (self.deferredFns.length) {
        self.defer.now = self.deferredFns[self.deferredFns.length-1].time;
      }
    }

    while (self.deferredFns.length && self.deferredFns[0].time <= self.defer.now) {
      self.deferredFns.shift().fn();
    }
  };
  /**
   * @ngdoc property
   * @name angular.module.NG_MOCK.$browser#defer.now
   * @propertyOf angular.module.NG_MOCK.$browser
   *
   * @description
   * Current milliseconds mock time.
   */

  self.$$baseHref = '';
  self.baseHref = function() {
    return this.$$baseHref;
  };
}
angular.module.NG_MOCK.$Browser.prototype = {

/**
  * @name angular.module.NG_MOCK.$browser#poll
  * @methodOf angular.module.NG_MOCK.$browser
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
 * @name angular.module.NG_MOCK.$exceptionHandlerProvider
 *
 * @description
 * Configures the mock implementation of {@link angular.module.NG.$exceptionHandler} to rethrow or to log errors passed
 * into the `$exceptionHandler`.
 */

/**
 * @ngdoc object
 * @name angular.module.NG_MOCK.$exceptionHandler
 *
 * @description
 * Mock implementation of {@link angular.module.NG.$exceptionHandler} that rethrows or logs errors passed
 * into it. See {@link angular.module.NG_MOCK.$exceptionHandlerProvider $exceptionHandlerProvider} for configuration
 * information.
 */

angular.module.NG_MOCK.$ExceptionHandlerProvider = function(){
  var handler;

  /**
   * @ngdoc method
   * @name angular.module.NG_MOCK.$exceptionHandlerProvider#mode
   * @methodOf angular.module.NG_MOCK.$exceptionHandlerProvider
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
   *            See {@link angular.module.NG_MOCK.$log#assertEmpty assertEmpty()} and
   *             {@link angular.module.NG_MOCK.$log#reset reset()}
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
 * @name angular.module.NG_MOCK.$log
 *
 * @description
 * Mock implementation of {@link angular.module.NG.$log} that gathers all logged messages in arrays
 * (one array per logging level). These arrays are exposed as `logs` property of each of the
 * level-specific log function, e.g. for level `error` the array is exposed as `$log.error.logs`.
 *
 */
angular.module.NG_MOCK.$LogProvider = function(){

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
     * @name angular.module.NG_MOCK.$log#reset
     * @methodOf angular.module.NG_MOCK.$log
     *
     * @description
     * Reset all of the logging arrays to empty.
     */
    $log.reset = function (){
      /**
       * @ngdoc property
       * @name angular.module.NG_MOCK.$log#log.logs
       * @propertyOf angular.module.NG_MOCK.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.log.logs = [];
      /**
       * @ngdoc property
       * @name angular.module.NG_MOCK.$log#warn.logs
       * @propertyOf angular.module.NG_MOCK.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.warn.logs = [];
      /**
       * @ngdoc property
       * @name angular.module.NG_MOCK.$log#info.logs
       * @propertyOf angular.module.NG_MOCK.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.info.logs = [];
      /**
       * @ngdoc property
       * @name angular.module.NG_MOCK.$log#error.logs
       * @propertyOf angular.module.NG_MOCK.$log
       *
       * @description
       * Array of logged messages.
       */
      $log.error.logs = [];
    };

    /**
     * @ngdoc method
     * @name angular.module.NG_MOCK.$log#assertEmpty
     * @methodOf angular.module.NG_MOCK.$log
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
 * @name angular.module.NG_MOCK.TzDate
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
angular.module.NG_MOCK.TzDate = function (offset, timestamp) {
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
angular.module.NG_MOCK.TzDate.prototype = Date.prototype;


/**
 * @ngdoc function
 * @name angular.module.NG_MOCK.debug
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
angular.module.NG_MOCK.dump = function(object){
  var out;
  if (angular.isElement(object)) {
    object = angular.element(object);
    out = angular.element('<div></div>')
    angular.forEach(object, function(element){
      out.append(angular.element(element).clone());
    });
    out = out.html();
  } else if (angular.isObject(object)) {
    if (angular.isFunction(object.$eval) && angular.isFunction(object.$apply)) {
      out = serializeScope(object);
    } else {
      out = angular.toJson(object, true);
    }
  } else {
    out = String(object);
  }
  return out;

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

window.jstestdriver && (function(window){
  /**
   * Global method to output any number of objects into JSTD console. Useful for debugging.
   */
  window.dump = function() {
    var args = [];
    angular.forEach(arguments, function(arg){
      args.push(angular.module.NG_MOCK.dump(arg));
    });
    jstestdriver.console.log.apply(jstestdriver.console, args);
  };
})(window);


/**
 * @ngdoc function
 * @name angular.module.NG_MOCK.inject
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
        injector = this.$injector =  angular.injector('NG', 'NG_MOCK');
      }
      for(var i = 0, ii = blockFns.length; i < ii; i++) {
        injector.invoke(this, blockFns[i]);
      }
    };
  }
})(window);
