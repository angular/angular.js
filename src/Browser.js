
//////////////////////////////
// Browser
//////////////////////////////

function Browser(location) {
  this.location = location;
  this.delay = 25;
  this.setTimeout = function(fn, delay) {
   window.setTimeout(fn, delay);
  };
  this.expectedUrl = location.href;
  this.listeners = [];
}

Browser.prototype = {
  watchUrl: function(fn){
   this.listeners.push(fn);
  },

  startUrlWatcher: function() {
   var self = this;
   (function pull () {
     if (self.expectedUrl !== self.location.href) {
       foreach(self.listeners, function(listener){
         listener(self.location.href);
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
   this.existingURL = url;
  },

  getUrl: function() {
   return this.location.href;
  }
};
