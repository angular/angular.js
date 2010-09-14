//////////////////////////////
// Browser
//////////////////////////////

function Browser(location, document, head) {
  this.delay = 50;
  this.expectedUrl = location.href;
  this.urlListeners = [];
  this.hoverListener = noop;
  this.isMock = false;
  this.outstandingRequests = { count: 0, callbacks:[]};

  this.XHR = window.XMLHttpRequest || function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
    throw new Error("This browser does not support XMLHttpRequest.");
  };
  this.setTimeout = function(fn, delay) {
   window.setTimeout(fn, delay);
  };

  this.location = location;
  this.document = document;
  var rawDocument = document[0];
  this.head = head;
  this.idCounter = 0;

  this.cookies = cookies;
  this.watchCookies = function(fn){ cookieListeners.push(fn); };

  // functions
  var lastCookies = {};
  var lastCookieString = '';
  var cookieListeners = [];
  /**
   * cookies() -> hash of all cookies
   * cookies(name, value) -> set name to value
   *   if value is undefined delete it
   * cookies(name) -> should get value, but deletes (no one calls it right now that way)
   */
  function cookies(name, value){
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
        foreach(cookieListeners, function(fn){
          fn(lastCookies);
        });
      }
      return lastCookies;
    }
  }
}

Browser.prototype = {

  bind: function() {
    var self = this;
    self.document.bind("mouseover", function(event){
      self.hoverListener(jqLite(msie ? event.srcElement : event.target), true);
      return true;
    });
    self.document.bind("mouseleave mouseout click dblclick keypress keyup", function(event){
      self.hoverListener(jqLite(event.target), false);
      return true;
    });
  },

  hover: function(hoverListener) {
    this.hoverListener = hoverListener;
  },

  addCss: function(url) {
    var doc = this.document[0],
        head = jqLite(doc.getElementsByTagName('head')[0]),
        link = jqLite(doc.createElement('link'));
    link.attr('rel', 'stylesheet');
    link.attr('type', 'text/css');
    link.attr('href', url);
    head.append(link);
  },

  xhr: function(method, url, post, callback){
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (lowercase(method) == 'json') {
      var callbackId = "angular_" + Math.random() + '_' + (this.idCounter++);
      callbackId = callbackId.replace(/\d\./, '');
      var script = this.document[0].createElement('script');
      script.type = 'text/javascript';
      script.src = url.replace('JSON_CALLBACK', callbackId);
      this.head.append(script);
      window[callbackId] = function(data){
        window[callbackId] = _undefined;
        callback(200, data);
      };
    } else {
      var xhr = new this.XHR(),
      self = this;
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      this.outstandingRequests.count ++;
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          try {
            callback(xhr.status || 200, xhr.responseText);
          } finally {
            self.outstandingRequests.count--;
            self.processRequestCallbacks();
          }
        }
      };
      xhr.send(post || '');
    }
  },

  processRequestCallbacks: function(){
    if (this.outstandingRequests.count === 0) {
      while(this.outstandingRequests.callbacks.length) {
        try {
          this.outstandingRequests.callbacks.pop()();
        } catch (e) {
        }
      }
    }
  },

  notifyWhenNoOutstandingRequests: function(callback){
    if (this.outstandingRequests.count === 0) {
      callback();
    } else {
      this.outstandingRequests.callbacks.push(callback);
    }
  },

  watchUrl: function(fn){
    this.urlListeners.push(fn);
  },

  startUrlWatcher: function() {
   var self = this;
   (function pull () {
     if (self.expectedUrl !== self.location.href) {
       foreach(self.urlListeners, function(listener){
         try {
           listener(self.location.href);
         } catch (e) {
           error(e);
         }
       });
       self.expectedUrl = self.location.href;
     }
     self.setTimeout(pull, self.delay);
   })();
  },

  startCookieWatcher: function() {
    var self = this;
    (function poll() {
      self.cookies();
      self.setTimeout(poll, self.delay);
    })();
  },

  setUrl: function(url) {
   var existingURL = this.location.href;
   if (!existingURL.match(/#/)) existingURL += '#';
   if (!url.match(/#/)) url += '#';
   if (existingURL != url) {
     this.location.href = this.expectedUrl = url;
   }
  },

  getUrl: function() {
   return this.location.href;
  }
};
