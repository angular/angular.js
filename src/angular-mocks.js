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
 *   the {@link angular.service.$http $http service} to make XmlHttpRequests.
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

  // TODO(vojta): remove this temporary api
  self.$$completeOutstandingRequest = noop;
  self.$$incOutstandingRequestCount = noop;


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

  self.$$scripts = [];
  self.addJs = function(url, domId, done) {
    var script = {url: url, id: domId, done: done};
    self.$$scripts.push(script);
    return script;
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
  }
};

angular.service('$browser', function() {
  return new MockBrowser();
});


/**
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
    log: function() { $log.log.logs.push(arguments); },
    warn: function() { $log.warn.logs.push(arguments); },
    info: function() { $log.info.logs.push(arguments); },
    error: function() { $log.error.logs.push(arguments); }
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

function createMockHttpBackend() {
  var definitions = [],
      expectations = [],
      responses = [];

  function createResponse(status, data, headers) {
    return angular.isNumber(status) ? [status, data, headers] : [200, status, data];
  }

  // TODO(vojta): change params to: method, url, data, headers, callback
  function $httpBackend(method, url, data, callback, headers) {
    var xhr = new MockXhr(),
        expectation = expectations[0],
        wasExpected = false;

    function prettyPrint(data) {
      if (angular.isString(data) || angular.isFunction(data) || data instanceof RegExp)
        return data;
      return angular.toJson(data);
    }

    if (expectation && expectation.match(method, url)) {
      if (!expectation.matchData(data))
        throw Error('Expected ' + expectation + ' with different data\n' +
            'EXPECTED: ' + prettyPrint(expectation.data) + '\nGOT: ' + data);

      if (!expectation.matchHeaders(headers))
        throw Error('Expected ' + expectation + ' with different headers\n' +
            'EXPECTED: ' + prettyPrint(expectation.headers) + '\nGOT: ' + prettyPrint(headers));

      expectations.shift();

      if (expectation.response) {
        responses.push(function() {
          xhr.$$headers = expectation.response[2];
          callback(expectation.response[0], expectation.response[1]);
        });
        return method == 'JSONP' ? undefined : xhr;
      }
      wasExpected = true;
    }

    var i = -1, definition;
    while ((definition = definitions[++i])) {
      if (definition.match(method, url, data, headers || {})) {
        if (!definition.response) throw Error('No response defined !');
        responses.push(function() {
          var response = angular.isFunction(definition.response) ?
                         definition.response(method, url, data, headers) : definition.response;
          xhr.$$headers = response[2];
          callback(response[0], response[1]);
        });
        return method == 'JSONP' ? undefined : xhr;
      }
    }
    throw wasExpected ? Error('No response defined !') :
                        Error('Unexpected request: ' + method + ' ' + url);
  }

  $httpBackend.when = function(method, url, data, headers) {
    var definition = new MockHttpExpectation(method, url, data, headers);
    definitions.push(definition);
    return {
      respond: function(status, data, headers) {
        definition.response = angular.isFunction(status) ? status : createResponse(status, data, headers);
      }
    };
  };

  $httpBackend.expect = function(method, url, data, headers) {
    var expectation = new MockHttpExpectation(method, url, data, headers);
    expectations.push(expectation);
    return {
      respond: function(status, data, headers) {
        expectation.response = createResponse(status, data, headers);
      }
    };
  };

  $httpBackend.flush = function(count) {
    if (!responses.length) throw Error('No pending request to flush !');

    if (angular.isDefined(count)) {
      while (count--) {
        if (!responses.length) throw Error('No more pending request to flush !');
        responses.shift()();
      }
    } else {
      while (responses.length)
        responses.shift()();
    }
    $httpBackend.verifyNoOutstandingExpectations();
  };

  $httpBackend.verifyNoOutstandingExpectations = function() {
    if (expectations.length) {
      throw Error('Unsatisfied requests: ' + expectations.join(', '));
    }
  };

  $httpBackend.verifyRequestsHaveBeenFlushed = function() {
    if (responses.length) {
      throw Error('Unflushed requests: ' + responses.length);
    }
  };

  $httpBackend.resetExpectations = function() {
    expectations = [];
    responses = [];
  };

  return $httpBackend;
}

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
    this.$$headers = {};
  };

  this.send = function(data) {
    this.$$data = data;
  };

  this.setRequestHeader = function(key, value) {
    this.$$headers[key] = value;
  };

  this.getResponseHeader = function(name) {
    return this.$$headers[name];
  };

  this.getAllResponseHeaders = function() {
    var lines = [];

    angular.forEach(this.$$headers, function(value, key) {
      lines.push(key + ': ' + value);
    });
    return lines.join('\n');
  };

  this.abort = noop;
}


// use the mock during testing
angular.service('$httpBackend', createMockHttpBackend);
