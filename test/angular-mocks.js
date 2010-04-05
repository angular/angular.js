
function MockBrowser() {
  this.url = "http://server";
  this.watches = [];
}
MockBrowser.prototype = {
  xhr: function(method, url, callback) {

  },

  getUrl: function(){
    return this.url;
  },

  setUrl: function(url){
    this.url = url;
  },

  watchUrl: function(fn) {
    this.watches.push(fn);
  }
};

angular.service('$browser', function(){
  return new MockBrowser();
});
