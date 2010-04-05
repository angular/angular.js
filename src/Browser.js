
//////////////////////////////
// Browser
//////////////////////////////

function Browser(location, XHR) {
  this.location = location;
  this.delay = 25;
  this.XHR = XHR;
  this.setTimeout = function(fn, delay) {
   window.setTimeout(fn, delay);
  };
  this.expectedUrl = location.href;
  this.listeners = [];
}

Browser.prototype = {
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
   this.listeners.push(fn);
  },

  startUrlWatcher: function() {
   var self = this;
   (function pull () {
     if (self.expectedUrl !== self.location.href) {
       foreach(self.listeners, function(listener){
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
