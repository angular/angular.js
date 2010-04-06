
//////////////////////////////
// Browser
//////////////////////////////

function Browser(location, document) {
  this.delay = 25;
  this.expectedUrl = location.href;
  this.urlListeners = [];
  this.hoverListener = noop;

  this.XHR = XMLHttpRequest || function () {
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
      self.hoverListener(jqLite(event.target), true);
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
    var head = jqLite(this.document[0].getElementsByTagName('head')[0]),
        link = jqLite('<link rel="stylesheet" type="text/css"></link>');
    link.attr('href', url);
    head.append(link);
  },

  xhr: function(method, url, callback){
    var xhr = new this.XHR();
    xhr.open(method, url, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        callback(xhr.status, xhr.responseText);
      }
    };
    xhr.send('');
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
   if (!existingURL.match(/#/))
     existingURL += '#';
   if (existingURL != url)
     this.location.href = url;
  },

  getUrl: function() {
   return this.location.href;
  }
};
