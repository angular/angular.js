'use strict';

/**
 * @license AngularJS v"NG_VERSION_FULL"
 * (c) 2010-2011 AngularJS http://angularjs.org
 * License: MIT
 */


/*

 NUGGGGGH MUST TONGUE WANGS
                           \
                                .....
                               C C  /
                              /<   /
               ___ __________/_#__=o
              /(- /(\_\________   \
              \ ) \ )_      \o     \
              /|\ /|\       |'     |
                            |     _|
                            /o   __\
                           / '     |
                          / /      |
                         /_/\______|
                        (   _(    <
                         \    \    \
                          \    \    |
                           \____\____\
                           ____\_\__\_\
                         /`   /`     o\
                         |___ |_______|.. . b'ger


 IN THE FINAL BUILD THIS FILE DOESN'T HAVE DIRECT ACCESS TO GLOBAL FUNCTIONS
 DEFINED IN Angular.js YOU *MUST* REFER TO THEM VIA angular OBJECT
 (e.g. angular.forEach(...)) AND MAKE SURE THAT THE GIVEN FUNCTION IS EXPORTED
 TO THE angular NAMESPACE in AngularPublic.js

 */


/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.mock
 * @description
 *
 * The `angular.mock` object is a namespace for all built-in mock services that ship with angular.
 * It automatically replaces real services if the `angular-mocks.js` file is loaded after
 * `angular.js` and before any tests.
 *
 * Built-in mocks:
 *
 * * {@link angular.mock.service.$browser $browser } - A mock implementation of the browser.
 * * {@link angular.mock.service.$exceptionHandler $exceptionHandler } - A mock implementation of
 *   the angular service exception handler.
 * * {@link angular.mock.service.$log $log } - A mock implementation of the angular service log.
 */
angular.mock = {};


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.mock.service.$browser
 *
 * @description
 * This service is a mock implementation of {@link angular.service.$browser}. It provides fake
 * implementation for commonly used browser apis that are hard to test, e.g. setTimeout, xhr,
 * cookies.
 *
 * This implementation is automatically available and replaces regular `$browser` service in tests
 * when `angular-mocks.js` is loaded.
 *
 * The api of this service is the same as the real {@link angular.service.$browser $browser}, except
 * that there are several helper methods available which can be used in tests.
 *
 * The following apis can be used in tests:
 *
 * - {@link angular.mock.service.$browser.xhr $browser.xhr} — enables testing of code that uses
 *   the {@link angular.service.$xhr $xhr service} to make XmlHttpRequests.
 * - $browser.defer — enables testing of code that uses
 *   {@link angular.service.$defer $defer service} for executing functions via the `setTimeout` api.
 */
function MockBrowser() {
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
    * @ngdoc function
    * @name angular.mock.service.$browser.xhr
    *
    * @description
    * Generic method for training browser to expect a request in a test and respond to it.
    *
    * See also convenience methods for browser training:
    *
    * - {@link angular.mock.service.$browser.xhr.expectGET $browser.xhr.expectGET}
    * - {@link angular.mock.service.$browser.xhr.expectPOST $browser.xhr.expectPOST}
    * - {@link angular.mock.service.$browser.xhr.expectPUT $browser.xhr.expectPUT}
    * - {@link angular.mock.service.$browser.xhr.expectDELETE $browser.xhr.expectDELETE}
    * - {@link angular.mock.service.$browser.xhr.expectJSON $browser.xhr.expectJSON}
    *
    * To flush pending requests in tests use
    * {@link angular.mock.service.$browser.xhr.flush $browser.xhr.flush}.
    *
    * @param {string} method Expected HTTP method.
    * @param {string} url Url path for which a request is expected.
    * @param {(object|string)=} data Expected body of the (POST) HTTP request.
    * @param {function(number, *)} callback Callback to call when response is flushed.
    * @param {object} headers Key-value pairs of expected headers.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.mock.service.$browser.xhr.flush flushed}.
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
    requests.push(function(){
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
    * @ngdoc function
    * @name angular.mock.service.$browser.xhr.expectGET
    *
    * @description
    * Trains browser to expect a `GET` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.mock.service.$browser.xhr.flush flushed}.
    */
  self.xhr.expectGET    = angular.bind(self, self.xhr.expect, 'GET');

  /**
    * @ngdoc function
    * @name angular.mock.service.$browser.xhr.expectPOST
    *
    * @description
    * Trains browser to expect a `POST` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.mock.service.$browser.xhr.flush flushed}.
    */
  self.xhr.expectPOST   = angular.bind(self, self.xhr.expect, 'POST');

  /**
    * @ngdoc function
    * @name angular.mock.service.$browser.xhr.expectDELETE
    *
    * @description
    * Trains browser to expect a `DELETE` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.mock.service.$browser.xhr.flush flushed}.
    */
  self.xhr.expectDELETE = angular.bind(self, self.xhr.expect, 'DELETE');

  /**
    * @ngdoc function
    * @name angular.mock.service.$browser.xhr.expectPUT
    *
    * @description
    * Trains browser to expect a `PUT` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.mock.service.$browser.xhr.flush flushed}.
    */
  self.xhr.expectPUT    = angular.bind(self, self.xhr.expect, 'PUT');

  /**
    * @ngdoc function
    * @name angular.mock.service.$browser.xhr.expectJSON
    *
    * @description
    * Trains browser to expect a `JSON` request and respond to it.
    *
    * @param {string} url Url path for which a request is expected.
    * @returns {object} Response configuration object. You can call its `respond()` method to
    *   configure what should the browser mock return when the response is
    *   {@link angular.mock.service.$browser.xhr.flush flushed}.
    */
  self.xhr.expectJSON   = angular.bind(self, self.xhr.expect, 'JSON');

  /**
    * @ngdoc function
    * @name angular.mock.service.$browser.xhr.flush
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
    }
  };


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

  self.$$baseHref = '';
  self.baseHref = function() {
    return this.$$baseHref;
  };
}
MockBrowser.prototype = {

/**
  * @name angular.mock.service.$browser#poll
  * @methodOf angular.mock.service.$browser
  *
  * @description
  * run all fns in pollFns
  */
  poll: function poll(){
    angular.forEach(this.pollFns, function(pollFn){
      pollFn();
    });
  },

  addPollFn: function(pollFn) {
    this.pollFns.push(pollFn);
    return pollFn;
  },

  hover: function(onHover) {
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

  addJs: function(){}
};

angular.service('$browser', function(){
  return new MockBrowser();
});


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.mock.service.$exceptionHandler
 *
 * @description
 * Mock implementation of {@link angular.service.$exceptionHandler} that rethrows any error passed
 * into `$exceptionHandler`. If any errors are are passed into the handler in tests, it typically
 * means that there is a bug in the application or test, so this mock will make these tests fail.
 *
 * See {@link angular.mock} for more info on angular mocks.
 */
angular.service('$exceptionHandler', function() {
  return function(e) { throw e; };
});


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.mock.service.$log
 *
 * @description
 * Mock implementation of {@link angular.service.$log} that gathers all logged messages in arrays
 * (one array per logging level). These arrays are exposed as `logs` property of each of the
 * level-specific log function, e.g. for level `error` the array is exposed as `$log.error.logs`.
 *
 * See {@link angular.mock} for more info on angular mocks.
 */
angular.service('$log', MockLogFactory);

function MockLogFactory() {
  var $log = {
    log: function(){ $log.log.logs.push(arguments); },
    warn: function(){ $log.warn.logs.push(arguments); },
    info: function(){ $log.info.logs.push(arguments); },
    error: function(){ $log.error.logs.push(arguments); }
  };

  $log.log.logs = [];
  $log.warn.logs = [];
  $log.info.logs = [];
  $log.error.logs = [];

  return $log;
}


/**
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
function TzDate(offset, timestamp) {
  if (angular.isString(timestamp)) {
    var tsStr = timestamp;

    this.origDate = angular.String.toDate(timestamp);

    timestamp = this.origDate.getTime();
    if (isNaN(timestamp))
      throw {
        name: "Illegal Argument",
        message: "Arg '" + tsStr + "' passed into TzDate constructor is not a valid date string"
      };
  } else {
    this.origDate = new Date(timestamp);
  }

  var localOffset = new Date(timestamp).getTimezoneOffset();
  this.offsetDiff = localOffset*60*1000 - offset*1000*60*60;
  this.date = new Date(timestamp + this.offsetDiff);

  this.getTime = function() {
    return this.date.getTime() - this.offsetDiff;
  };

  this.toLocaleDateString = function() {
    return this.date.toLocaleDateString();
  };

  this.getFullYear = function() {
    return this.date.getFullYear();
  };

  this.getMonth = function() {
    return this.date.getMonth();
  };

  this.getDate = function() {
    return this.date.getDate();
  };

  this.getHours = function() {
    return this.date.getHours();
  };

  this.getMinutes = function() {
    return this.date.getMinutes();
  };

  this.getSeconds = function() {
    return this.date.getSeconds();
  };

  this.getTimezoneOffset = function() {
    return offset * 60;
  };

  this.getUTCFullYear = function() {
    return this.origDate.getUTCFullYear();
  };

  this.getUTCMonth = function() {
    return this.origDate.getUTCMonth();
  };

  this.getUTCDate = function() {
    return this.origDate.getUTCDate();
  };

  this.getUTCHours = function() {
    return this.origDate.getUTCHours();
  };

  this.getUTCMinutes = function() {
    return this.origDate.getUTCMinutes();
  };

  this.getUTCSeconds = function() {
    return this.origDate.getUTCSeconds();
  };

  this.getDay = function() {
    return this.origDate.getDay();
  };

  //hide all methods not implemented in this mock that the Date prototype exposes
  var self = this,
      unimplementedMethods = ['getMilliseconds', 'getUTCDay',
      'getUTCMilliseconds', 'getYear', 'setDate', 'setFullYear', 'setHours', 'setMilliseconds',
      'setMinutes', 'setMonth', 'setSeconds', 'setTime', 'setUTCDate', 'setUTCFullYear',
      'setUTCHours', 'setUTCMilliseconds', 'setUTCMinutes', 'setUTCMonth', 'setUTCSeconds',
      'setYear', 'toDateString', 'toJSON', 'toGMTString', 'toLocaleFormat', 'toLocaleString',
      'toLocaleTimeString', 'toSource', 'toString', 'toTimeString', 'toUTCString', 'valueOf'];

  angular.forEach(unimplementedMethods, function(methodName) {
    self[methodName] = function() {
      throw {
        name: "MethodNotImplemented",
        message: "Method '" + methodName + "' is not implemented in the TzDate mock"
      };
    };
  });
}

//make "tzDateInstance instanceof Date" return true
TzDate.prototype = Date.prototype;
