//////////////////////////////
// Browser
//////////////////////////////
var XHR = window.XMLHttpRequest || function () {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw new Error("This browser does not support XMLHttpRequest.");
};

function Browser(location, document, head, XHR, $log) {
  var self = this;
  self.isMock = false;

  //////////////////////////////////////////////////////////////
  // XHR API
  //////////////////////////////////////////////////////////////
  var idCounter = 0;
  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

  /**
   * @ngdoc method
   * @name angular.service.$browser#xhr
   * @methodOf angular.service.$browser
   * 
   * @param {string} method Requested method (get|post|put|delete|head|json)
   * @param {string} url Requested url
   * @param {string=} post Post data to send 
   * @param {function(number, string)} callback Function that will be called on response
   * 
   * @description
   * Send ajax request
   */
  self.xhr = function(method, url, post, callback) {
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (lowercase(method) == 'json') {
      var callbackId = "angular_" + Math.random() + '_' + (idCounter++);
      callbackId = callbackId.replace(/\d\./, '');
      var script = document[0].createElement('script');
      script.type = 'text/javascript';
      script.src = url.replace('JSON_CALLBACK', callbackId);
      window[callbackId] = function(data){
        window[callbackId] = _undefined;
        callback(200, data);
      };
      head.append(script);
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      outstandingRequestCount ++;
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          try {
            callback(xhr.status || 200, xhr.responseText);
          } finally {
            outstandingRequestCount--;
            if (outstandingRequestCount === 0) {
              while(outstandingRequestCallbacks.length) {
                try {
                  outstandingRequestCallbacks.pop()();
                } catch (e) {
                }
              }
            }
          }
        }
      };
      xhr.send(post || '');
    }
  };

  /**
   * @ngdoc method
   * @name angular.service.$browser#notifyWhenNoOutstandingRequests
   * @methodOf angular.service.$browser
   * 
   * @param {function} callback Function that will be called when no outstanding request
   */
  self.notifyWhenNoOutstandingRequests = function(callback) {
    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  //////////////////////////////////////////////////////////////
  // Poll Watcher API
  //////////////////////////////////////////////////////////////
  var pollFns = [];

  /**
   * @ngdoc method
   * @name angular.service.$browser#poll
   * @methodOf angular.service.$browser
   */
  self.poll = function() {
    foreach(pollFns, function(pollFn){ pollFn(); });
  };

  /**
   * @ngdoc method
   * @name angular.service.$browser#addPollFn
   * @methodOf angular.service.$browser
   * 
   * @param {function} fn Poll function to add
   * 
   * @description
   * Adds a function to the list of functions that poller periodically executes
   * 
   * @returns {function} the added function
   */
  self.addPollFn = function(fn) {
    pollFns.push(fn);
    return fn;
  };

  /**
   * @ngdoc method
   * @name angular.service.$browser#startPoller
   * @methodOf angular.service.$browser
   * 
   * @param {number} interval How often should browser call poll functions (ms)
   * @param {function} setTimeout
   * 
   * @description
   * Configures the poller to run in the specified intervals, using the specified
   * setTimeout fn and kicks it off.
   */
  self.startPoller = function(interval, setTimeout) {
    (function check(){
      self.poll();
      setTimeout(check, interval);
    })();
  };

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////
  
  /**
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
    var existingURL = location.href;
    if (!existingURL.match(/#/)) existingURL += '#';
    if (!url.match(/#/)) url += '#';
    location.href = url;
   };

  /**
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
    return location.href;
  };

  //////////////////////////////////////////////////////////////
  // Cookies API
  //////////////////////////////////////////////////////////////
  var rawDocument = document[0];
  var lastCookies = {};
  var lastCookieString = '';

  /**
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
    var cookieLength, cookieArray, i, keyValue;

    if (name) {
      if (value === _undefined) {
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
          keyValue = cookieArray[i].split("=");
          if (keyValue.length === 2) { //ignore nameless cookies
            lastCookies[unescape(keyValue[0])] = unescape(keyValue[1]);
          }
        }
      }
      return lastCookies;
    }
  };

  //////////////////////////////////////////////////////////////
  // Misc API
  //////////////////////////////////////////////////////////////
  var hoverListener = noop;
  
  /**
   * @ngdoc method
   * @name angular.service.$browser#hover
   * @methodOf angular.service.$browser
   * 
   * @param {function(Object, boolean)} listener
   * 
   * @description
   * Set hover listener - function that will be called when hover event occurs.
   */
  self.hover = function(listener) { hoverListener = listener; };
  
  /**
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
    head.append(link);
  };


  /**
   * @ngdoc method
   * @name angular.service.$browser#addJs
   * @methodOf angular.service.$browser
   * 
   * @param {string} url Url to js file
   * @param {string=} dom_id Optional id for the script tag 
   * 
   * @description
   * Adds a script tag to the head.
   */
  self.addJs = function(url, dom_id) {
    var script = jqLite(rawDocument.createElement('script'));
    script.attr('type', 'text/javascript');
    script.attr('src', url);
    if (dom_id) script.attr('id', dom_id);
    head.append(script);
  };
}
