'use strict';

//////////////////////////////
// Browser
//////////////////////////////
var XHR = window.XMLHttpRequest || function () {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw new Error("This browser does not support XMLHttpRequest.");
};


/**
 * @ngdoc service
 * @name angular.service.$browser
 * @requires $log
 *
 * @description
 * Constructor for the object exposed as $browser service.
 *
 * This object has two goals:
 *
 * - hide all the global state in the browser caused by the window object
 * - abstract away all the browser specific features and inconsistencies
 *
 * For tests we provide {@link angular.mock.service.$browser mock implementation} of the `$browser`
 * service, which can be used for convenient testing of the application without the interaction with
 * the real browser apis.
 */
/**
 * @param {object} window The global window object.
 * @param {object} document jQuery wrapped document.
 * @param {object} body jQuery wrapped document.body.
 * @param {function()} XHR XMLHttpRequest constructor.
 * @param {object} $log console.log or an object with the same interface.
 */
function Browser(window, document, body, XHR, $log) {
  var self = this,
      rawDocument = document[0],
      location = window.location,
      setTimeout = window.setTimeout,
      clearTimeout = window.clearTimeout,
      pendingDeferIds = {},
      lastLocationUrl;

  self.isMock = false;

  //////////////////////////////////////////////////////////////
  // XHR API
  //////////////////////////////////////////////////////////////
  var idCounter = 0;
  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];


  /**
   * Executes the `fn` function (supports currying) and decrements the `outstandingRequestCallbacks`
   * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.
   */
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, sliceArgs(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while(outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#xhr
   * @methodOf angular.service.$browser
   *
   * @param {string} method Requested method (get|post|put|delete|head|json)
   * @param {string} url Requested url
   * @param {?string} post Post data to send (null if nothing to post)
   * @param {function(number, string)} callback Function that will be called on response
   * @param {object=} header additional HTTP headers to send with XHR.
   *   Standard headers are:
   *   <ul>
   *     <li><tt>Content-Type</tt>: <tt>application/x-www-form-urlencoded</tt></li>
   *     <li><tt>Accept</tt>: <tt>application/json, text/plain, &#42;/&#42;</tt></li>
   *     <li><tt>X-Requested-With</tt>: <tt>XMLHttpRequest</tt></li>
   *   </ul>
   *
   * @description
   * Send ajax request
   */
  self.xhr = function(method, url, post, callback, headers) {
    outstandingRequestCount ++;
    if (lowercase(method) == 'json') {
      var callbackId = ("angular_" + Math.random() + '_' + (idCounter++)).replace(/\d\./, '');
      window[callbackId] = function(data) {
        window[callbackId].data = data;
      };

      var script = self.addJs(url.replace('JSON_CALLBACK', callbackId), null, function() {
        if (window[callbackId].data) {
          completeOutstandingRequest(callback, 200, window[callbackId].data);
        } else {
          completeOutstandingRequest(callback);
        }
        delete window[callbackId];
        body[0].removeChild(script);
      });
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      forEach(headers, function(value, key) {
          if (value) xhr.setRequestHeader(key, value);
      });
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          // normalize IE bug (http://bugs.jquery.com/ticket/1450)
          var status = xhr.status == 1223 ? 204 : xhr.status;
          completeOutstandingRequest(callback, status, xhr.responseText);
        }
      };
      xhr.send(post || '');
    }
  };

  /**
   * @private
   * Note: this method is used only by scenario runner
   * TODO(vojta): prefix this method with $$ ?
   * @param {function()} callback Function that will be called when no outstanding request
   */
  self.notifyWhenNoOutstandingRequests = function(callback) {
    // force browser to execute all pollFns - this is needed so that cookies and other pollers fire
    // at some deterministic time in respect to the test runner's actions. Leaving things up to the
    // regular poller would result in flaky tests.
    forEach(pollFns, function(pollFn){ pollFn(); });

    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  //////////////////////////////////////////////////////////////
  // Poll Watcher API
  //////////////////////////////////////////////////////////////
  var pollFns = [],
      pollTimeout;

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#addPollFn
   * @methodOf angular.service.$browser
   *
   * @param {function()} fn Poll function to add
   *
   * @description
   * Adds a function to the list of functions that poller periodically executes,
   * and starts polling if not started yet.
   *
   * @returns {function()} the added function
   */
  self.addPollFn = function(fn) {
    if (isUndefined(pollTimeout)) startPoller(100, setTimeout);
    pollFns.push(fn);
    return fn;
  };

  /**
   * @param {number} interval How often should browser call poll functions (ms)
   * @param {function()} setTimeout Reference to a real or fake `setTimeout` function.
   *
   * @description
   * Configures the poller to run in the specified intervals, using the specified
   * setTimeout fn and kicks it off.
   */
  function startPoller(interval, setTimeout) {
    (function check() {
      forEach(pollFns, function(pollFn){ pollFn(); });
      pollTimeout = setTimeout(check, interval);
    })();
  }

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#setUrl
   * @methodOf angular.service.$browser
   *
   * @param {string} url New url
   *
   * @description
   * Sets browser's url
   */
  self.setUrl = function(url) {

    var existingURL = lastLocationUrl;
    if (!existingURL.match(/#/)) existingURL += '#';
    if (!url.match(/#/)) url += '#';
    if (existingURL != url) {
      location.href = url;
    }
   };

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#getUrl
   * @methodOf angular.service.$browser
   *
   * @description
   * Get current browser's url
   *
   * @returns {string} Browser's url
   */
  self.getUrl = function() {
    return lastLocationUrl = location.href;
  };


  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#onHashChange
   * @methodOf angular.service.$browser
   *
   * @description
   * Detects if browser support onhashchange events and register a listener otherwise registers
   * $browser poller. The `listener` will then get called when the hash changes.
   *
   * The listener gets called with either HashChangeEvent object or simple object that also contains
   * `oldURL` and `newURL` properties.
   *
   * Note: this api is intended for use only by the $location service. Please use the
   * {@link angular.service.$location $location service} to monitor hash changes in angular apps.
   *
   * @param {function(event)} listener Listener function to be called when url hash changes.
   * @return {function()} Returns the registered listener fn - handy if the fn is anonymous.
   */
  self.onHashChange = function(listener) {
    // IE8 comp mode returns true, but doesn't support hashchange event
    var dm = window.document.documentMode;
    if ('onhashchange' in window && (isUndefined(dm) || dm >= 8)) {
      jqLite(window).bind('hashchange', listener);
    } else {
      var lastBrowserUrl = self.getUrl();

      self.addPollFn(function() {
        if (lastBrowserUrl != self.getUrl()) {
          listener();
          lastBrowserUrl = self.getUrl();
        }
      });
    }
    return listener;
  };

  //////////////////////////////////////////////////////////////
  // Cookies API
  //////////////////////////////////////////////////////////////
  var lastCookies = {};
  var lastCookieString = '';

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#cookies
   * @methodOf angular.service.$browser
   *
   * @param {string=} name Cookie name
   * @param {string=} value Cokkie value
   *
   * @description
   * The cookies method provides a 'private' low level access to browser cookies.
   * It is not meant to be used directly, use the $cookie service instead.
   *
   * The return values vary depending on the arguments that the method was called with as follows:
   * <ul>
   *   <li>cookies() -> hash of all cookies, this is NOT a copy of the internal state, so do not modify it</li>
   *   <li>cookies(name, value) -> set name to value, if value is undefined delete the cookie</li>
   *   <li>cookies(name) -> the same as (name, undefined) == DELETES (no one calls it right now that way)</li>
   * </ul>
   *
   * @returns {Object} Hash of all cookies (if called without any parameter)
   */
  self.cookies = function (name, value) {
    var cookieLength, cookieArray, cookie, i, keyValue, index;

    if (name) {
      if (value === undefined) {
        rawDocument.cookie = escape(name) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        if (isString(value)) {
          rawDocument.cookie = escape(name) + '=' + escape(value);

          cookieLength = name.length + value.length + 1;
          if (cookieLength > 4096) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because it was too large ("+
              cookieLength + " > 4096 bytes)!");
          }
          if (lastCookies.length > 20) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because too many cookies " +
              "were already set (" + lastCookies.length + " > 20 )");
          }
        }
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          cookie = cookieArray[i];
          index = cookie.indexOf('=');
          if (index > 0) { //ignore nameless cookies
            lastCookies[unescape(cookie.substring(0, index))] = unescape(cookie.substring(index + 1));
          }
        }
      }
      return lastCookies;
    }
  };


  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#defer
   * @methodOf angular.service.$browser
   * @param {function()} fn A function, who's execution should be defered.
   * @param {number=} [delay=0] of milliseconds to defer the function execution.
   * @returns {*} DeferId that can be used to cancel the task via `$browser.defer.cancel()`.
   *
   * @description
   * Executes a fn asynchroniously via `setTimeout(fn, delay)`.
   *
   * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using
   * `setTimeout` in tests, the fns are queued in an array, which can be programmatically flushed
   * via `$browser.defer.flush()`.
   *
   */
  self.defer = function(fn, delay) {
    var timeoutId;
    outstandingRequestCount++;
    timeoutId = setTimeout(function() {
      delete pendingDeferIds[timeoutId];
      completeOutstandingRequest(fn);
    }, delay || 0);
    pendingDeferIds[timeoutId] = true;
    return timeoutId;
  };


  /**
   * THIS DOC IS NOT VISIBLE because ngdocs can't process docs for foo#method.method
   *
   * @name angular.service.$browser#defer.cancel
   * @methodOf angular.service.$browser.defer
   * @returns {boolean} Returns `true` if the task hasn't executed yet and was successfuly canceled.
   *
   * @description
   * Cancels a defered task identified with `deferId`.
   */

  self.defer.cancel = function(deferId) {
    if (pendingDeferIds[deferId]) {
      delete pendingDeferIds[deferId];
      clearTimeout(deferId);
      completeOutstandingRequest(noop);
      return true;
    }
  };


  //////////////////////////////////////////////////////////////
  // Misc API
  //////////////////////////////////////////////////////////////
  var hoverListener = noop;

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#hover
   * @methodOf angular.service.$browser
   *
   * @description
   * Set hover listener.
   *
   * @param {function(Object, boolean)} listener Function that will be called when a hover event
   *    occurs.
   */
  self.hover = function(listener) { hoverListener = listener; };

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#bind
   * @methodOf angular.service.$browser
   *
   * @description
   * Register hover function to real browser
   */
  self.bind = function() {
    document.bind("mouseover", function(event){
      hoverListener(jqLite(msie ? event.srcElement : event.target), true);
      return true;
    });
    document.bind("mouseleave mouseout click dblclick keypress keyup", function(event){
      hoverListener(jqLite(event.target), false);
      return true;
    });
  };


  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#addCss
   * @methodOf angular.service.$browser
   *
   * @param {string} url Url to css file
   * @description
   * Adds a stylesheet tag to the head.
   */
  self.addCss = function(url) {
    var link = jqLite(rawDocument.createElement('link'));
    link.attr('rel', 'stylesheet');
    link.attr('type', 'text/css');
    link.attr('href', url);
    body.append(link);
  };


  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#addJs
   * @methodOf angular.service.$browser
   *
   * @param {string} url Url to js file
   * @param {string=} domId Optional id for the script tag
   *
   * @description
   * Adds a script tag to the head.
   */
  self.addJs = function(url, domId, done) {
    // we can't use jQuery/jqLite here because jQuery does crazy shit with script elements, e.g.:
    // - fetches local scripts via XHR and evals them
    // - adds and immediately removes script elements from the document
    //
    // We need addJs to be able to add angular-ie-compat.js which is very special and must remain
    // part of the DOM so that the embedded images can reference it. jQuery's append implementation
    // (v1.4.2) fubars it.
    var script = rawDocument.createElement('script');

    script.type = 'text/javascript';
    script.src = url;
    if (domId) script.id = domId;

    if (msie) {
      script.onreadystatechange = function() {
        /loaded|complete/.test(script.readyState) && done && done();
      };
    } else {
      if (done) script.onload = script.onerror = done;
    }

    body[0].appendChild(script);

    return script;
  };
}
