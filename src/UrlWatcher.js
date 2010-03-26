
// ////////////////////////////
// UrlWatcher
// ////////////////////////////

function UrlWatcher(location) {
  this.location = location;
  this.delay = 25;
  this.setTimeout = function(fn, delay) {
    window.setTimeout(fn, delay);
  };
  this.listener = function(url) {
    return url;
  };
  this.expectedUrl = location.href;
}

UrlWatcher.prototype = {
  listen: function(fn){
    this.listener = fn;
  },
  watch: function() {
    var self = this;
    var pull = function() {
      if (self.expectedUrl !== self.location.href) {
        var notify = self.location.hash.match(/^#\$iframe_notify=(.*)$/);
        if (notify) {
          if (!self.expectedUrl.match(/#/)) {
            self.expectedUrl += "#";
          }
          self.location.href = self.expectedUrl;
          var id = '_iframe_notify_' + notify[1];
          var notifyFn = angularCallbacks[id];
          delete angularCallbacks[id];
          try {
            (notifyFn||noop)();
          } catch (e) {
            alert(e);
          }
        } else {
          self.listener(self.location.href);
          self.expectedUrl = self.location.href;
        }
      }
      self.setTimeout(pull, self.delay);
    };
    pull();
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
    return window.location.href;
  }
};
