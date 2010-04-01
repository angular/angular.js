
// ////////////////////////////
// UrlWatcher
// ////////////////////////////

function UrlWatcher(location) {
  this.location = location;
  this.delay = 25;
  this.setTimeout = function(fn, delay) {
    window.setTimeout(fn, delay);
  };
  this.expectedUrl = location.href;
  this.listeners = [];
}

UrlWatcher.prototype = {
  watch: function(fn){
    this.listeners.push(fn);
  },

  start: function() {
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

  set: function(url) {
    var existingURL = this.location.href;
    if (!existingURL.match(/#/))
      existingURL += '#';
    if (existingURL != url)
      this.location.href = url;
    this.existingURL = url;
  },

  get: function() {
    return this.location.href;
  }
};
