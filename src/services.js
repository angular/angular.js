angularService("$window", bind(window, identity, window));
angularService("$document", function(window){
  return jqLite(window.document);
}, {inject:['$window']});

var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.]*)(:([0-9]+))?([^\?#]+)(\?([^#]*))?((#([^\?]*))?(\?([^\?]*))?)$/;
var DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21};
angularService("$location", function(browser){
  var scope = this;
  function location(url){
    if (isDefined(url)) {
      var match = URL_MATCH.exec(url);
      if (match) {
        location.href = url;
        location.protocol = match[1];
        location.host = match[3] || '';
        location.port = match[5] || DEFAULT_PORTS[location.href] || null;
        location.path = match[6];
        location.search = parseKeyValue(match[8]);
        location.hash = match[9];
        if (location.hash) location.hash = location.hash.substr(1);
        location.hashPath = match[11] || '';
        location.hashSearch = parseKeyValue(match[13]);
      }
    }
    var hashKeyValue = toKeyValue(location.hashSearch);
    return location.href +
      (location.hashPath ? location.hashPath : '') +
      (hashKeyValue ? '?' + hashKeyValue : '');
  }
  browser.watchUrl(function(url){
    location(url);
  });
  location(browser.getUrl());
  this.$onEval(PRIORITY_LAST, function(){
    var href = location();
    if (href != location.href) {
      browser.setUrl(href);
      location.href = href;
    }
  });
  return location;
}, {inject: ['$browser']});

if (!angularService['$browser']) {
  var browserSingleton;
  angularService('$browser', function browserFactory(){
    if (!browserSingleton) {
      browserSingleton = new Browser(window.location);
      browserSingleton.startUrlWatcher();
    }
    return browserSingleton;
  });
}

