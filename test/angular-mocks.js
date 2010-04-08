
function MockBrowser() {
  var self = this, expectations = {}, requests = [];
  self.url = "http://server";
  self.watches = [];

  self.xhr = function(method, url, callback) {
    var expect = expectations[method] || {};
    var response = expect[url];
    if (!response) {
      throw "Unexepected request for method '" + method + "' and url '" + url + "'.";
    }
    requests.push(function(){
      callback(200, response);
    });
  };
  self.xhr.expectations = expectations;
  self.xhr.requests = requests;
  self.xhr.expect = function(method, url) {
    var expect = expectations[method] || (expectations[method] = {});
    return {
      respond: function(response) {
        expect[url] = response;
      }
    };
  };
  self.xhr.flush = function() {
    while(requests.length) {
      requests.pop()();
    }
  };
}
MockBrowser.prototype = {

  hover: function(onHover) {
  },

  getUrl: function(){
    return this.url;
  },

  setUrl: function(url){
    this.url = url;
  },

  watchUrl: function(fn) {
    this.watches.push(fn);
  },

  fireUrlWatchers: function() {
    for(var i=0; i<this.watches.length; i++) {
      this.watches[i](this.url);
    }
  }
};

angular.service('$browser', function(){
  return new MockBrowser();
});
