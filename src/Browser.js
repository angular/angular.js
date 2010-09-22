//////////////////////////////
// Browser
//////////////////////////////
var XHR = window.XMLHttpRequest || function () {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw new Error("This browser does not support XMLHttpRequest.");
};

function Browser(location, document, head, XHR) {
  var self = this;
  self.isMock = false;

  //////////////////////////////////////////////////////////////
  // XHR API
  //////////////////////////////////////////////////////////////
  var idCounter = 0;
  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];

  self.xhr = function(method, url, post, callback){
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
      head.append(script);
      window[callbackId] = function(data){
        window[callbackId] = _undefined;
        callback(200, data);
      };
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

  self.notifyWhenNoOutstandingRequests = function(callback){
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
  function poll(){
    foreach(pollFns, function(pollFn){ pollFn(); });
  }
  self.poll = poll;
  self.addPollFn = bind(pollFns, push);
  self.startPoller = function(interval, setTimeout){
    (function check(){
      poll();
      setTimeout(check, interval);
    })();
  };

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////
  self.setUrl = function(url) {
    var existingURL = location.href;
    if (!existingURL.match(/#/)) existingURL += '#';
    if (!url.match(/#/)) url += '#';
    location.href = url;
   };
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
   * cookies() -> hash of all cookies
   * cookies(name, value) -> set name to value
   *   if value is undefined delete it
   * cookies(name) -> should get value, but deletes (no one calls it right now that way)
   */
  self.cookies = function (name, value){
    if (name) {
      if (value === _undefined) {
        delete lastCookies[name];
        rawDocument.cookie = escape(name) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        rawDocument.cookie = escape(name) + '=' + escape(lastCookies[name] = ''+value);
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        var cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (var i = 0; i < cookieArray.length; i++) {
          var keyValue = cookieArray[i].split("=");
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
  self.hover = function(listener) { hoverListener = listener; };
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


  self.addCss = function(url) {
    var link = jqLite(rawDocument.createElement('link'));
    link.attr('rel', 'stylesheet');
    link.attr('type', 'text/css');
    link.attr('href', url);
    head.append(link);
  };
}
