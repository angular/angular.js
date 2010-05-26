//////////////////////////////
// Browser
//////////////////////////////

function Browser(location, document) {
  this.delay = 25;
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
  this.document = jqLite(document);
  this.body = jqLite(document.body);
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
      post = null;
    }
    var xhr = new this.XHR(),
        self = this;
    xhr.open(method, url, true);
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
